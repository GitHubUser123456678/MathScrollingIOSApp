import { SOURCES, PROBLEM_TOPICS, escapeHTML } from './sources.js';
import { renderContent } from './render.js';

// ------------------------------------------------------------------ storage
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem('ms:' + key); return v == null ? fallback : JSON.parse(v); } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem('ms:' + key, JSON.stringify(value)); } catch { /* storage full or blocked */ }
  },
};

const DEFAULT_SETTINGS = {
  sources: { contest: true, olympiad: true, aops: true, proofwiki: true, oeis: true, wikipedia: true },
  weights: { contest: 24, olympiad: 16, aops: 14, proofwiki: 18, oeis: 12, wikipedia: 16 },
  topics: [...PROBLEM_TOPICS],
};

// Settings from the first version of the app used different source names; start fresh if so.
const savedSettings = store.get('settings', {});
const state = {
  settings: savedSettings.v === 2 ? { ...DEFAULT_SETTINGS, ...savedSettings } : { ...DEFAULT_SETTINGS, v: 2 },
  saved: store.get('saved', []),
  seen: new Set(store.get('seen', [])),
  stats: { answered: 0, correct: 0, streak: 0, best: 0, ...store.get('stats', {}) },
  tab: store.get('tab', 'mix'),
  cards: [],
  pending: 0,
  failures: {},
  generation: 0,
};
state.settings.sources = { ...DEFAULT_SETTINGS.sources, ...state.settings.sources };
state.settings.weights = { ...DEFAULT_SETTINGS.weights, ...state.settings.weights };
state.settings.v = 2;
if (!Array.isArray(state.settings.topics) || !state.settings.topics.length) state.settings.topics = [...PROBLEM_TOPICS];

const saveSettings = () => store.set('settings', state.settings);
const saveStats = () => store.set('stats', state.stats);
const saveSaved = () => store.set('saved', state.saved.slice(0, 300));
function markSeen(id) {
  state.seen.add(id);
  if (state.seen.size > 4000) state.seen = new Set([...state.seen].slice(-3000));
  store.set('seen', [...state.seen]);
}

// ------------------------------------------------------------------ dom helpers
const $ = (s, el = document) => el.querySelector(s);
const feed = $('#feed');
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

const ICONS = {
  bookmark: '<svg viewBox="0 0 24 24"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z"/></svg>',
  bulb: '<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>',
  share: '<svg viewBox="0 0 24 24"><path d="M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>',
  open: '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
};

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  requestAnimationFrame(() => t.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.classList.remove('show'); setTimeout(() => { t.hidden = true; }, 250); }, 1800);
}

// ------------------------------------------------------------------ tabs
const TABS = [
  { id: 'mix', label: 'For you' },
  { id: 'contest', label: 'AMC/AIME' },
  { id: 'aops', label: 'AoPS' },
  { id: 'olympiad', label: 'Olympiad' },
  { id: 'proofwiki', label: 'Proofs' },
  { id: 'oeis', label: 'Sequences' },
  { id: 'wikipedia', label: 'Concepts' },
];

function renderTabs() {
  const nav = $('#tabs');
  nav.innerHTML = '';
  for (const t of TABS) {
    if (t.id !== 'mix' && !state.settings.sources[t.id]) continue;
    const b = h(`<button role="tab" class="tab" data-tab="${t.id}" aria-selected="${state.tab === t.id}">${t.label}</button>`);
    b.addEventListener('click', () => switchTab(t.id));
    nav.appendChild(b);
  }
  nav.querySelector('[aria-selected="true"]')?.scrollIntoView({ inline: 'center', block: 'nearest' });
}

function switchTab(id) {
  if (state.tab === id) { feed.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  state.tab = id;
  store.set('tab', id);
  renderTabs();
  resetFeed();
}

// ------------------------------------------------------------------ fetching
function activeSources() {
  const enabled = Object.keys(SOURCES).filter((k) => state.settings.sources[k] && (state.failures[k] || 0) < 5);
  if (state.tab !== 'mix') return enabled.includes(state.tab) ? [state.tab] : [];
  return enabled;
}

function pickSource(list) {
  const w = list.map((k) => state.settings.weights[k] || 1);
  let r = Math.random() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < list.length; i++) { if ((r -= w[i]) < 0) return list[i]; }
  return list[list.length - 1];
}

async function fetchCard() {
  for (let attempt = 0; attempt < 6; attempt++) {
    const list = activeSources();
    if (!list.length) throw new Error('none');
    const key = pickSource(list);
    try {
      const card = await SOURCES[key].fetch(state.settings);
      state.failures[key] = 0;
      if (state.seen.has(card.id) && attempt < 4) continue;
      if (state.cards.some((c) => c.data.id === card.id)) continue;
      return card;
    } catch (err) {
      state.failures[key] = (state.failures[key] || 0) + 1;
      console.warn(`[MathScroll] ${key} failed:`, err.message);
    }
  }
  throw new Error('exhausted');
}

const BUFFER = 3;
function fill() {
  const gen = state.generation;
  const current = currentIndex();
  const wanted = current + 1 + BUFFER - state.cards.length - state.pending;
  for (let i = 0; i < wanted; i++) {
    state.pending++;
    updateLoader();
    fetchCard()
      .then((data) => { if (gen === state.generation) appendCard(data); })
      .catch((err) => { if (gen === state.generation) showFeedError(err.message); })
      .finally(() => { if (gen === state.generation) { state.pending--; updateLoader(); } });
  }
}

function resetFeed() {
  state.generation++;
  state.cards = [];
  state.pending = 0;
  feed.innerHTML = '';
  feed.appendChild(loaderEl());
  feed.scrollTop = 0;
  fill();
}

function loaderEl() {
  return h(`<section class="card loader" id="loader">
    <div class="card-inner">
      <div class="skeleton"><span></span><span></span><span></span><span class="short"></span></div>
      <p class="loader-msg" id="loaderMsg">Finding something good…</p>
      <button class="btn" id="retryBtn" hidden>Try again</button>
    </div></section>`);
}

function updateLoader() {
  const l = $('#loader');
  if (!l) return;
  feed.appendChild(l); // keep it last
}

let errorShown = false;
function showFeedError(code) {
  if (state.cards.length > currentIndex() + 1) return; // still have content to show
  const msg = $('#loaderMsg');
  const btn = $('#retryBtn');
  if (!msg) return;
  if (code === 'none') {
    msg.textContent = state.tab === 'mix' ? 'All sources are switched off. Turn some on in Settings.' : 'This source is switched off or unreachable right now.';
  } else {
    msg.textContent = navigator.onLine === false ? "You're offline. Connect to keep scrolling." : "Couldn't reach the maths sources just now.";
  }
  btn.hidden = false;
  btn.onclick = () => { state.failures = {}; btn.hidden = true; msg.textContent = 'Finding something good…'; fill(); };
  errorShown = true;
}

// ------------------------------------------------------------------ cards
const SOURCE_META = {
  contest: { tag: 'Problem', cls: 's-contest', from: 'AoPS Wiki' },
  aops: { tag: 'Problem', cls: 's-aops', from: 'AoPS forum' },
  olympiad: { tag: 'Problem', cls: 's-olympiad', from: 'Olympiad' },
  wikipedia: { tag: 'Concept', cls: 's-wiki', from: 'Wikipedia' },
  proofwiki: { tag: 'Theorem', cls: 's-proof', from: 'ProofWiki' },
  oeis: { tag: 'Sequence', cls: 's-oeis', from: 'OEIS' },
};
const isProblem = (d) => ['contest', 'aops', 'olympiad'].includes(d.source);

function buildCard(data, { standalone = false } = {}) {
  const meta = SOURCE_META[data.source] || SOURCE_META.wikipedia;
  const isSaved = state.saved.some((s) => s.id === data.id);
  const where = `<span class="where">${escapeHTML(meta.from)}</span>`;
  const el = h(`<section class="card ${meta.cls}" data-id="${escapeHTML(data.id)}">
    <div class="card-inner">
      <div class="meta"><span class="pill">${meta.tag}</span>${where}</div>
      <h2 class="heading">${escapeHTML(data.heading)}</h2>
      <div class="content"></div>
    </div>
    <nav class="rail">
      <button class="rail-btn save ${isSaved ? 'on' : ''}" aria-label="Save" aria-pressed="${isSaved}">${ICONS.bookmark}<span>Save</span></button>
      ${data.solutionHtml ? `<button class="rail-btn sol" aria-label="${data.solutionLabel}">${ICONS.bulb}<span>${data.solutionLabel}</span></button>` : ''}
      <button class="rail-btn share" aria-label="Share">${ICONS.share}<span>Share</span></button>
      <a class="rail-btn open" href="${escapeHTML(data.url)}" target="_blank" rel="noopener" aria-label="Open source">${ICONS.open}<span>Source</span></a>
    </nav>
  </section>`);
  if (standalone) el.classList.add('standalone');

  const content = $('.content', el);
  try {
    content.appendChild(renderContent(data.html, { base: data.base, dollar: data.dollarMath }));
  } catch (e) {
    content.innerHTML = '<p>Couldn’t display this one.</p>';
  }
  if (data.terms && data.terms.length) {
    const terms = h(`<div class="terms" aria-label="First terms"></div>`);
    data.terms.forEach((t, i) => terms.appendChild(h(`<span style="--i:${i}">${escapeHTML(t)}</span>`)));
    terms.appendChild(h('<span class="ellipsis">…</span>'));
    content.appendChild(terms);
    content.appendChild(h('<p class="hint">What comes next — and why?</p>'));
  }
  if (isProblem(data)) content.appendChild(answerBox(data, el));

  $('.save', el).addEventListener('click', (e) => toggleSave(data, e.currentTarget));
  $('.sol', el)?.addEventListener('click', () => openSolution(data));
  $('.share', el).addEventListener('click', () => share(data));

  // Fade hint when content overflows.
  const inner = $('.card-inner', el);
  const checkOverflow = () => inner.classList.toggle('overflows', inner.scrollHeight - inner.scrollTop - inner.clientHeight > 8);
  inner.addEventListener('scroll', checkOverflow, { passive: true });
  requestAnimationFrame(checkOverflow);
  el._checkOverflow = checkOverflow;
  return el;
}

function answerBox(data, cardEl) {
  if (!data.answer) {
    return h(`<p class="hint">${data.isProof ? 'Proof problem — work it out, then tap <b>Solution</b>.' : 'Work it out, then tap <b>Solution</b>.'}</p>`);
  }
  if (data.answer.type === 'reveal') {
    const box = h('<div class="answer"><button class="btn ghost reveal">Show answer</button></div>');
    box.querySelector('.reveal').addEventListener('click', (e) => {
      const ans = h('<div class="feedback revealed">Answer: </div>');
      ans.appendChild(renderContent(`<span>$${escapeHTML(data.answer.value)}$</span>`, { base: 'text', dollar: true }));
      e.currentTarget.replaceWith(ans);
      requestAnimationFrame(() => cardEl._checkOverflow?.());
    });
    return box;
  }
  const box = h('<div class="answer"></div>');
  const finish = (ok, chosen) => {
    state.stats.answered++;
    if (ok) {
      state.stats.correct++;
      state.stats.streak++;
      state.stats.best = Math.max(state.stats.best, state.stats.streak);
    } else {
      state.stats.streak = 0;
    }
    saveStats();
    updateStreak(ok);
    cardEl.classList.add(ok ? 'solved' : 'missed');
    const fb = h(`<div class="feedback ${ok ? 'ok' : 'no'}">${ok ? 'Correct!' : `Not quite — the answer is <b>${escapeHTML(data.answer.value)}</b>.`}${data.solutionHtml ? ' <button class="link">See solution</button>' : ''}</div>`);
    fb.querySelector('.link')?.addEventListener('click', () => openSolution(data));
    box.appendChild(fb);
    if (ok) burst(box);
    requestAnimationFrame(() => cardEl._checkOverflow?.());
  };

  if (data.answer.type === 'choice') {
    const row = h('<div class="choices" role="group" aria-label="Your answer"></div>');
    for (const L of ['A', 'B', 'C', 'D', 'E']) {
      const b = h(`<button class="choice">${L}</button>`);
      b.addEventListener('click', () => {
        row.querySelectorAll('button').forEach((x) => { x.disabled = true; if (x.textContent === data.answer.value) x.classList.add('right'); });
        if (L !== data.answer.value) b.classList.add('wrong');
        finish(L === data.answer.value, L);
      });
      row.appendChild(b);
    }
    box.appendChild(row);
  } else {
    const form = h(`<form class="numeric"><input inputmode="numeric" maxlength="7" placeholder="Your answer" aria-label="Your answer" autocomplete="off"><button class="btn" type="submit">Check</button></form>`);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const v = input.value.trim();
      if (!/^-?\d{1,6}$/.test(v)) { input.classList.add('shake'); setTimeout(() => input.classList.remove('shake'), 400); return; }
      input.blur();
      input.disabled = true; form.querySelector('button').disabled = true;
      const ok = String(parseInt(v, 10)) === data.answer.value;
      input.classList.add(ok ? 'right' : 'wrong');
      finish(ok, v);
    });
    box.appendChild(form);
  }
  return box;
}

function burst(anchor) {
  const wrap = h('<div class="burst" aria-hidden="true"></div>');
  const glyphs = ['∑', 'π', '∞', '√', '∫', '✓', 'φ', 'e'];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('span');
    s.textContent = glyphs[i % glyphs.length];
    const a = (i / 14) * Math.PI * 2;
    s.style.setProperty('--dx', `${Math.cos(a) * (60 + Math.random() * 50)}px`);
    s.style.setProperty('--dy', `${Math.sin(a) * (40 + Math.random() * 40) - 30}px`);
    wrap.appendChild(s);
  }
  anchor.appendChild(wrap);
  setTimeout(() => wrap.remove(), 1000);
}

function updateStreak(pulse) {
  const s = $('#streak');
  if (state.stats.streak >= 2) {
    s.hidden = false;
    s.innerHTML = `<b>${state.stats.streak}</b> in a row`;
    if (pulse) { s.classList.remove('pulse'); void s.offsetWidth; s.classList.add('pulse'); }
  } else {
    s.hidden = true;
  }
}

function appendCard(data) {
  const el = buildCard(data);
  state.cards.push({ data, el });
  const loader = $('#loader');
  // If the person is sitting on the loading card, move them onto the new card
  // (browsers otherwise keep the loader snapped in view after the insert).
  const onLoader = feed.scrollTop >= loader.offsetTop - 10;
  feed.insertBefore(el, loader);
  if (onLoader) feed.scrollTo({ top: el.offsetTop, behavior: 'instant' });
  if (errorShown) { errorShown = false; const b = $('#retryBtn'); if (b) b.hidden = true; const m = $('#loaderMsg'); if (m) m.textContent = 'Finding something good…'; }
  observer.observe(el);
  if (state.cards.length === 1) markSeen(data.id);
}

function toggleSave(data, btn) {
  const i = state.saved.findIndex((s) => s.id === data.id);
  if (i >= 0) { state.saved.splice(i, 1); toast('Removed from saved'); } else { state.saved.unshift({ ...data, savedAt: Date.now() }); toast('Saved'); }
  saveSaved();
  const on = i < 0;
  document.querySelectorAll(`.card[data-id="${CSS.escape(data.id)}"] .save`).forEach((b) => { b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  if (on) { btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop'); }
}

async function share(data) {
  const title = data.heading;
  try {
    if (navigator.share) { await navigator.share({ title, text: `${title} — via MathScroll`, url: data.url }); return; }
  } catch (e) { if (e.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(data.url); toast('Link copied'); } catch { toast(data.url); }
}

// ------------------------------------------------------------------ current card tracking
let currentEl = null;
const observer = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting && e.intersectionRatio > 0.6) {
      currentEl = e.target;
      const c = state.cards.find((x) => x.el === e.target);
      if (c) markSeen(c.data.id);
      fill();
    }
  }
}, { root: feed, threshold: [0.6] });

function currentIndex() {
  if (!currentEl) return 0;
  const i = state.cards.findIndex((c) => c.el === currentEl);
  return i < 0 ? 0 : i;
}

// Keyboard support (handy when testing on a computer).
document.addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea')) return;
  if (!$('#sheet').hidden) { if (e.key === 'Escape') closeSheet(); return; }
  if (['ArrowDown', 'j', ' ', 'PageDown'].includes(e.key)) { e.preventDefault(); feed.scrollBy({ top: feed.clientHeight, behavior: 'smooth' }); }
  if (['ArrowUp', 'k', 'PageUp'].includes(e.key)) { e.preventDefault(); feed.scrollBy({ top: -feed.clientHeight, behavior: 'smooth' }); }
  if (e.key === 's' && currentEl) $('.sol', currentEl)?.click();
});

// ------------------------------------------------------------------ sheet
const sheet = $('#sheet');
const scrim = $('#scrim');
let sheetOnClose = null;
function openSheet(title, bodyEl, cls = '', onClose = null) {
  sheetOnClose = onClose;
  $('#sheetTitle').textContent = title;
  const body = $('#sheetBody');
  body.innerHTML = '';
  body.appendChild(bodyEl);
  body.scrollTop = 0;
  sheet.className = `sheet ${cls}`;
  sheet.hidden = false; scrim.hidden = false;
  requestAnimationFrame(() => { sheet.classList.add('open'); scrim.classList.add('open'); });
}
function closeSheet() {
  const cb = sheetOnClose; sheetOnClose = null; if (cb) cb();
  sheet.classList.remove('open'); scrim.classList.remove('open');
  sheet.style.transform = '';
  setTimeout(() => { sheet.hidden = true; scrim.hidden = true; }, 260);
}
$('#sheetClose').addEventListener('click', closeSheet);
scrim.addEventListener('click', closeSheet);

// Drag the grip down to dismiss.
(() => {
  let startY = null; let dy = 0;
  const grip = $('#sheetGrip');
  const head = $('.sheet-head');
  const start = (e) => { startY = e.touches[0].clientY; dy = 0; sheet.style.transition = 'none'; };
  const move = (e) => { if (startY == null) return; dy = Math.max(0, e.touches[0].clientY - startY); sheet.style.transform = `translateY(${dy}px)`; };
  const end = () => { if (startY == null) return; sheet.style.transition = ''; if (dy > 90) closeSheet(); else sheet.style.transform = ''; startY = null; };
  [grip, head].forEach((el) => { el.addEventListener('touchstart', start, { passive: true }); el.addEventListener('touchmove', move, { passive: true }); el.addEventListener('touchend', end); });
})();

function openSolution(data) {
  const body = document.createElement('div');
  body.className = 'content solution';
  body.appendChild(renderContent(data.solutionHtml, { base: data.base, dollar: data.dollarMath }));
  const foot = h(`<p class="credit">${escapeHTML(data.solutionNote || '')} <a href="${escapeHTML(data.url)}" target="_blank" rel="noopener">Source</a></p>`);
  body.appendChild(foot);
  openSheet(`${data.solutionLabel} — ${data.heading}`, body);
}

// ------------------------------------------------------------------ saved
function openSaved() {
  const body = document.createElement('div');
  const s = state.stats;
  body.appendChild(h(`<div class="stats">
    <div><b>${s.correct}</b><span>solved</span></div>
    <div><b>${s.answered ? Math.round((100 * s.correct) / s.answered) : 0}%</b><span>accuracy</span></div>
    <div><b>${s.best}</b><span>best run</span></div>
    <div><b>${state.seen.size}</b><span>seen</span></div>
  </div>`));
  if (!state.saved.length) {
    body.appendChild(h('<p class="empty">Nothing saved yet. Tap <b>Save</b> on anything you want to come back to.</p>'));
  } else {
    const list = h('<ul class="saved-list"></ul>');
    for (const item of state.saved) {
      const meta = SOURCE_META[item.source] || SOURCE_META.wikipedia;
      const label = item.heading;
      const li = h(`<li class="${meta.cls}"><button class="saved-item"><span class="pill">${meta.tag}</span><span class="t">${escapeHTML(label)}</span></button></li>`);
      li.querySelector('button').addEventListener('click', () => {
        const card = buildCard(item, { standalone: true });
        openSheet(label, card, 'tall');
        card._checkOverflow?.();
      });
      list.appendChild(li);
    }
    body.appendChild(list);
  }
  openSheet('Saved', body);
}

// ------------------------------------------------------------------ settings
function openSettings() {
  const st = state.settings;
  const body = document.createElement('div');
  body.className = 'settings';
  let changed = false;

  body.appendChild(h('<h3>Sources</h3>'));
  const srcList = h('<div class="group"></div>');
  for (const [key, src] of Object.entries(SOURCES)) {
    const down = (state.failures[key] || 0) >= 5;
    const row = h(`<label class="row"><span><b>${src.label}</b><small>${src.blurb}${down ? ' · <em>unreachable right now</em>' : ''}</small></span>
      <input type="checkbox" class="switch" ${st.sources[key] ? 'checked' : ''}></label>`);
    row.querySelector('input').addEventListener('change', (e) => { st.sources[key] = e.target.checked; state.failures[key] = 0; saveSettings(); changed = true; });
    srcList.appendChild(row);
  }
  body.appendChild(srcList);

  body.appendChild(h('<h3>Problem topics</h3>'));
  const topicList = h('<div class="group"></div>');
  for (const t of PROBLEM_TOPICS) {
    const row = h(`<label class="row"><span><b>${t}</b>${t === 'Combinatorics' ? '<small>Includes graph theory</small>' : ''}</span><input type="checkbox" class="switch" ${st.topics.includes(t) ? 'checked' : ''}></label>`);
    row.querySelector('input').addEventListener('change', (e) => {
      st.topics = e.target.checked ? [...new Set([...st.topics, t])] : st.topics.filter((x) => x !== t);
      if (!st.topics.length) st.topics = [...PROBLEM_TOPICS];
      saveSettings(); changed = true;
    });
    topicList.appendChild(row);
  }
  body.appendChild(topicList);
  body.appendChild(h('<p class="small">Applies to AMC/AIME, AoPS and olympiad problems.</p>'));

  body.appendChild(h('<h3>Data</h3>'));
  const reset = h('<button class="btn ghost">Reset stats & history</button>');
  reset.addEventListener('click', () => {
    state.stats = { answered: 0, correct: 0, streak: 0, best: 0 }; saveStats();
    state.seen = new Set(); store.set('seen', []);
    updateStreak(); toast('Stats reset');
  });
  body.appendChild(reset);

  body.appendChild(h(`<p class="small credits">Problems come from the
    <a href="https://huggingface.co/datasets/project-numina/NuminaMath-1.5" target="_blank" rel="noopener">NuminaMath</a> dataset (AMC/AIME with AoPS Wiki solutions, AoPS forum and olympiad problems),
    theorems from <a href="https://proofwiki.org" target="_blank" rel="noopener">ProofWiki</a> via
    <a href="https://huggingface.co/datasets/wellecks/naturalproofs-gen" target="_blank" rel="noopener">NaturalProofs</a>,
    sequences from the <a href="https://oeis.org" target="_blank" rel="noopener">OEIS</a>, and articles live from
    <a href="https://en.wikipedia.org" target="_blank" rel="noopener">Wikipedia</a>. Wiki content is CC BY-SA.
    Contest problems © MAA and their respective owners.</p>`));

  openSheet('Settings', body, '', () => {
    if (!changed) return;
    if (state.tab !== 'mix' && !st.sources[state.tab]) state.tab = 'mix';
    renderTabs(); resetFeed();
  });
}

$('#savedBtn').addEventListener('click', openSaved);
$('#settingsBtn').addEventListener('click', openSettings);

// ------------------------------------------------------------------ boot
function boot() {
  if (state.tab !== 'mix' && !state.settings.sources[state.tab]) state.tab = 'mix';
  renderTabs();
  updateStreak();
  resetFeed();
  window.addEventListener('online', () => { if (errorShown) { state.failures = {}; fill(); } });
}

function whenKatex(cb, tries = 0) {
  if (window.katex || tries > 100) cb(); else setTimeout(() => whenKatex(cb, tries + 1), 30);
}
whenKatex(boot);

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
