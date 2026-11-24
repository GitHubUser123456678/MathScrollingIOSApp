import { SOURCES, PROBLEM_TOPICS, escapeHTML, textToHtml, answerFor, searchAll } from './sources.js';
import { renderContent } from './render.js';

// Where shared post links point. On the website it's the site itself; inside the iOS app it's the public site.
const PUBLIC_URL = location.protocol === 'https:'
  ? location.origin + location.pathname
  : 'https://githubuser123456678.github.io/MathScrollingIOSApp/';

// ------------------------------------------------------------------ storage
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem('ms:' + key); return v == null ? fallback : JSON.parse(v); } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem('ms:' + key, JSON.stringify(value)); return true; } catch { return false; }
  },
};

const DEFAULT_SETTINGS = {
  sources: { contest: true, olympiad: true, aops: true, proofwiki: true, oeis: true, wikipedia: true },
  weights: { contest: 24, olympiad: 16, aops: 14, proofwiki: 18, oeis: 12, wikipedia: 16 },
  topics: [...PROBLEM_TOPICS],
  personalise: true,
  dailyGoal: 5,
  theme: 'system',
};

const savedSettings = store.get('settings', {});
const state = {
  settings: savedSettings.v === 2 ? { ...DEFAULT_SETTINGS, ...savedSettings } : { ...DEFAULT_SETTINGS, v: 2 },
  saved: store.get('saved', []),
  liked: store.get('liked', []),
  posts: store.get('posts', []),
  seen: new Set(store.get('seen', [])),
  stats: { answered: 0, correct: 0, streak: 0, best: 0, ...store.get('stats', {}) },
  days: store.get('days', {}),
  engagement: store.get('engagement', {}),
  profile: { name: 'Mathlete', ...store.get('profile', {}) },
  tab: store.get('tab', 'mix'),
  cards: [],
  pending: 0,
  failures: {},
  generation: 0,
  pinned: null, // a shared post opened from a link, shown first
};
state.settings.sources = { ...DEFAULT_SETTINGS.sources, ...state.settings.sources };
state.settings.weights = { ...DEFAULT_SETTINGS.weights, ...state.settings.weights };
state.settings.v = 2;
if (!Array.isArray(state.settings.topics) || !state.settings.topics.length) state.settings.topics = [...PROBLEM_TOPICS];

const saveSettings = () => store.set('settings', state.settings);
const saveStats = () => { store.set('stats', state.stats); store.set('days', state.days); };
const saveList = (key) => {
  // Keep lists inside the browser's storage limit; drop the oldest if it's full.
  while (!store.set(key, state[key]) && state[key].length > 10) state[key].pop();
};
const today = () => new Date().toLocaleDateString('en-CA');
const dayRec = (d = today()) => (state.days[d] ||= { seen: 0, answered: 0, solved: 0 });

function markSeen(id) {
  if (!state.seen.has(id)) {
    dayRec().seen++;
    saveStats();
  }
  state.seen.add(id);
  if (state.seen.size > 4000) state.seen = new Set([...state.seen].slice(-3000));
  store.set('seen', [...state.seen]);
}

function dayStreak() {
  let n = 0;
  const d = new Date();
  if (!(state.days[today()]?.seen > 0)) d.setDate(d.getDate() - 1);
  for (;;) {
    const k = d.toLocaleDateString('en-CA');
    if (state.days[k]?.seen > 0) { n++; d.setDate(d.getDate() - 1); } else break;
  }
  return n;
}

// Personalised "For you": sources you like, save and solve come up more often.
function engage(source, amount) {
  if (!source || !SOURCES[source]) return;
  state.engagement[source] = Math.max(-15, Math.min(60, (state.engagement[source] || 0) + amount));
  store.set('engagement', state.engagement);
}
function weightFor(source) {
  const base = state.settings.weights[source] || 1;
  if (!state.settings.personalise) return base;
  const score = state.engagement[source] || 0;
  return base * Math.max(0.4, Math.min(3, 1 + score / 25));
}

// ------------------------------------------------------------------ theme
function applyTheme() {
  const t = state.settings.theme;
  if (t === 'system') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t;
  const dark = t === 'dark' || (t === 'system' && !matchMedia('(prefers-color-scheme: light)').matches);
  document.querySelector('meta[name="theme-color"]').setAttribute('content', dark ? '#0d0e12' : '#f7f5ef');
}
matchMedia('(prefers-color-scheme: light)').addEventListener?.('change', applyTheme);

// ------------------------------------------------------------------ dom helpers
const $ = (s, el = document) => el.querySelector(s);
const feed = $('#feed');
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

const ICONS = {
  heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-9.2-8.6C1.3 8.5 3 5 6.4 5c2.1 0 3.4 1.2 4.1 2.3h3c.7-1.1 2-2.3 4.1-2.3 3.4 0 5.1 3.5 3.6 6.4C19 15.6 12 20 12 20z" transform="translate(0 -.5)"/></svg>',
  bookmark: '<svg viewBox="0 0 24 24"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z"/></svg>',
  bulb: '<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>',
  share: '<svg viewBox="0 0 24 24"><path d="M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>',
  open: '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
  gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
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

// ------------------------------------------------------------------ posts & share links
function b64url(bytes) {
  let bin = '';
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function unb64url(s) {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}
async function pipe(bytes, stream) {
  return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());
}
async function encodePost(p) {
  const bytes = new TextEncoder().encode(JSON.stringify(p));
  if (typeof CompressionStream !== 'undefined') {
    try { return 'z' + b64url(await pipe(bytes, new CompressionStream('deflate-raw'))); } catch { /* fall through */ }
  }
  return 'j' + b64url(bytes);
}
async function decodePost(s) {
  let bytes = unb64url(s.slice(1));
  if (s[0] === 'z') bytes = await pipe(bytes, new DecompressionStream('deflate-raw'));
  const p = JSON.parse(new TextDecoder().decode(bytes));
  if (typeof p !== 'object' || !p || typeof p.b !== 'string') throw new Error('bad post');
  return p;
}
function hashStr(s) {
  let x = 5381;
  for (let i = 0; i < s.length; i++) x = ((x << 5) + x + s.charCodeAt(i)) | 0;
  return (x >>> 0).toString(36);
}
const POST_KINDS = { problem: 'Problem', fact: 'Fact', question: 'Question' };

function postCard(p) {
  const kind = POST_KINDS[p.k] ? p.k : 'problem';
  return {
    id: `post:${p.id || hashStr(JSON.stringify([p.t, p.b, p.a, p.s, p.n]))}`,
    source: 'post',
    kind: POST_KINDS[kind],
    postKind: kind,
    heading: (p.t || '').trim() || POST_KINDS[kind],
    author: (p.n || 'Someone').slice(0, 40),
    date: p.d,
    html: textToHtml(String(p.b).slice(0, 5000)),
    solutionHtml: p.s ? textToHtml(String(p.s).slice(0, 8000)) : null,
    solutionLabel: 'Solution',
    solutionNote: `Posted by ${(p.n || 'someone').slice(0, 40)} on MathScroll.`,
    answer: kind === 'problem' && p.a ? answerFor(p.b, p.a, 'math-word-problem') : null,
    base: 'text',
    dollarMath: true,
    post: p,
    url: null,
  };
}
async function postLink(p) {
  return `${PUBLIC_URL}#p=${await encodePost({ t: p.t, b: p.b, a: p.a, s: p.s, n: p.n, k: p.k, d: p.d })}`;
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
  const w = list.map(weightFor);
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
  currentEl = null;
  feed.innerHTML = '';
  feed.appendChild(loaderEl());
  feed.scrollTop = 0;
  if (state.pinned) appendCard(state.pinned);
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
  if (l) feed.appendChild(l); // keep it last
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
  post: { tag: 'Post', cls: 's-post', from: '' },
};
const metaFor = (d) => {
  if (d.source === 'post') return { ...SOURCE_META.post, tag: d.kind || 'Post', from: `by ${d.author}` };
  return SOURCE_META[d.source] || SOURCE_META.wikipedia;
};
const isProblem = (d) => ['contest', 'aops', 'olympiad'].includes(d.source) || (d.source === 'post' && d.postKind === 'problem');
const inList = (key, id) => state[key].some((s) => s.id === id);

function buildCard(data, { standalone = false, pinned = false } = {}) {
  const meta = metaFor(data);
  const isSaved = inList('saved', data.id);
  const isLiked = inList('liked', data.id);
  const el = h(`<section class="card ${meta.cls}" data-id="${escapeHTML(data.id)}">
    <div class="card-inner">
      ${pinned ? '<div class="shared-banner">Shared with you</div>' : ''}
      <div class="meta"><span class="pill">${escapeHTML(meta.tag)}</span><span class="where">${escapeHTML(meta.from)}</span></div>
      <h2 class="heading">${escapeHTML(data.heading)}</h2>
      <div class="content"></div>
    </div>
    <nav class="rail">
      <button class="rail-btn like ${isLiked ? 'on' : ''}" aria-label="Like" aria-pressed="${isLiked}">${ICONS.heart}<span>Like</span></button>
      <button class="rail-btn save ${isSaved ? 'on' : ''}" aria-label="Save" aria-pressed="${isSaved}">${ICONS.bookmark}<span>Save</span></button>
      ${data.solutionHtml ? `<button class="rail-btn sol" aria-label="${data.solutionLabel}">${ICONS.bulb}<span>${data.solutionLabel}</span></button>` : ''}
      <button class="rail-btn share" aria-label="Share">${ICONS.share}<span>Share</span></button>
      ${data.url ? `<a class="rail-btn open" href="${escapeHTML(data.url)}" target="_blank" rel="noopener" aria-label="Open source">${ICONS.open}<span>Source</span></a>` : ''}
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

  $('.like', el).addEventListener('click', (e) => toggleList('liked', data, e.currentTarget));
  $('.save', el).addEventListener('click', (e) => toggleList('saved', data, e.currentTarget));
  $('.sol', el)?.addEventListener('click', () => openSolution(data));
  $('.share', el).addEventListener('click', () => share(data));
  attachDoubleTap(el, data);

  // Fade hint when content overflows.
  const inner = $('.card-inner', el);
  const checkOverflow = () => inner.classList.toggle('overflows', inner.scrollHeight - inner.scrollTop - inner.clientHeight > 8);
  inner.addEventListener('scroll', checkOverflow, { passive: true });
  requestAnimationFrame(checkOverflow);
  el._checkOverflow = checkOverflow;
  return el;
}

// Double-tap anywhere on a card to like it.
function attachDoubleTap(el, data) {
  let last = 0;
  el.addEventListener('pointerup', (e) => {
    if (e.target.closest('button, a, input, textarea, .rail, form')) return;
    const now = Date.now();
    if (now - last < 320) {
      last = 0;
      if (!inList('liked', data.id)) toggleList('liked', data, $('.like', el));
      const heart = h(`<div class="big-heart" aria-hidden="true">${ICONS.heart}</div>`);
      const r = el.getBoundingClientRect();
      heart.style.left = `${e.clientX - r.left}px`;
      heart.style.top = `${e.clientY - r.top}px`;
      el.appendChild(heart);
      setTimeout(() => heart.remove(), 900);
    } else {
      last = now;
    }
  });
}

function answerBox(data, cardEl) {
  const box = h('<div class="answer"></div>');
  if (data.hintHtml) {
    const hint = h('<button class="btn ghost small hint-btn">Hint</button>');
    hint.addEventListener('click', () => {
      const shown = h('<div class="hint-box"><b>Hint</b> </div>');
      shown.appendChild(renderContent(data.hintHtml, { base: 'text', dollar: true }));
      hint.replaceWith(shown);
      requestAnimationFrame(() => cardEl._checkOverflow?.());
    });
    box.appendChild(hint);
  }
  if (!data.answer) {
    box.appendChild(h(`<p class="hint">${data.isProof ? 'Proof problem — work it out, then tap <b>Solution</b>.' : data.solutionHtml ? 'Work it out, then tap <b>Solution</b>.' : 'Work it out!'}</p>`));
    return box;
  }
  if (data.answer.type === 'reveal') {
    const btn = h('<button class="btn ghost reveal">Show answer</button>');
    btn.addEventListener('click', () => {
      const ans = h('<div class="feedback revealed">Answer: </div>');
      ans.appendChild(renderContent(`<span>$${escapeHTML(data.answer.value)}$</span>`, { base: 'text', dollar: true }));
      btn.replaceWith(ans);
      requestAnimationFrame(() => cardEl._checkOverflow?.());
    });
    box.appendChild(btn);
    return box;
  }
  const finish = (ok) => {
    state.stats.answered++;
    const d = dayRec();
    d.answered++;
    if (ok) {
      state.stats.correct++;
      state.stats.streak++;
      state.stats.best = Math.max(state.stats.best, state.stats.streak);
      d.solved++;
      engage(data.source, 2);
    } else {
      state.stats.streak = 0;
      engage(data.source, 1);
    }
    saveStats();
    updateStreak(ok);
    if (ok && d.solved === state.settings.dailyGoal) setTimeout(() => toast(`Daily goal reached — ${d.solved} solved today!`), 700);
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
        finish(L === data.answer.value);
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
      finish(ok);
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
  const el = buildCard(data, { pinned: data === state.pinned });
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

function toggleList(key, data, btn) {
  const i = state[key].findIndex((s) => s.id === data.id);
  const on = i < 0;
  if (on) state[key].unshift({ ...data, savedAt: Date.now() }); else state[key].splice(i, 1);
  if (state[key].length > 150) state[key].length = 150;
  saveList(key);
  if (on) engage(data.source, key === 'liked' ? 3 : 2); else engage(data.source, key === 'liked' ? -3 : -2);
  if (key === 'saved') toast(on ? 'Saved' : 'Removed from saved');
  const cls = key === 'liked' ? '.like' : '.save';
  document.querySelectorAll(`.card[data-id="${CSS.escape(data.id)}"] ${cls}`).forEach((b) => { b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  if (on && btn) { btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop'); }
}

async function share(data) {
  let url = data.url;
  let text = `${data.heading} — via MathScroll`;
  if (data.source === 'post') {
    url = await postLink(data.post);
    text = `${data.heading} — a maths ${data.kind.toLowerCase()} on MathScroll`;
  }
  try {
    if (navigator.share) { await navigator.share({ title: data.heading, text, url }); return; }
  } catch (e) { if (e.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(url); toast('Link copied'); } catch { toast('Couldn’t copy the link'); }
}

// ------------------------------------------------------------------ current card tracking
let currentEl = null;
let currentSince = Date.now();
const observer = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting && e.intersectionRatio > 0.6 && e.target !== currentEl) {
      // A very quick swipe past a card counts as "not for me".
      const prev = state.cards.find((x) => x.el === currentEl);
      if (prev && Date.now() - currentSince < 1200) engage(prev.data.source, -0.3);
      currentEl = e.target;
      currentSince = Date.now();
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
  if (e.key === 'l' && currentEl) $('.like', currentEl)?.click();
  if (e.key === '/') { e.preventDefault(); openSearch(); }
});

// ------------------------------------------------------------------ sheet
const sheet = $('#sheet');
const scrim = $('#scrim');
let sheetOnClose = null;
function openSheet(title, bodyEl, cls = '', onClose = null) {
  // Replacing one sheet with another only runs the old sheet's close action if it asked for that.
  const prev = sheetOnClose; sheetOnClose = null; if (prev && prev.onReplace) prev();
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
  setTimeout(() => { if (!sheet.classList.contains('open')) { sheet.hidden = true; scrim.hidden = true; } }, 260);
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
  engage(data.source, 0.5);
  const body = document.createElement('div');
  body.className = 'content solution';
  body.appendChild(renderContent(data.solutionHtml, { base: data.base, dollar: data.dollarMath }));
  const link = data.url ? ` <a href="${escapeHTML(data.url)}" target="_blank" rel="noopener">Source</a>` : '';
  body.appendChild(h(`<p class="credit">${escapeHTML(data.solutionNote || '')}${link}</p>`));
  openSheet(`${data.solutionLabel} — ${data.heading}`, body);
}

function openCard(data, title) {
  const card = buildCard(data, { standalone: true });
  openSheet(title || data.heading, card, 'tall');
  card._checkOverflow?.();
  markSeen(data.id);
}

// ------------------------------------------------------------------ profile
let profileTab = 'saved';
function openProfile() {
  const s = state.stats;
  const p = state.profile;
  const body = document.createElement('div');
  body.className = 'profile';
  const initial = (p.name.trim()[0] || '∑').toUpperCase();
  const head = h(`<div class="profile-head">
      <div class="avatar">${escapeHTML(initial)}</div>
      <div class="who">
        <input class="name-input" value="${escapeHTML(p.name)}" maxlength="30" aria-label="Your name">
        <small>Tap your name to change it · used on your posts</small>
      </div>
      <button class="icon-btn" id="openSettings" aria-label="Settings">${ICONS.gear}</button>
    </div>`);
  const nameInput = $('.name-input', head);
  nameInput.addEventListener('change', () => {
    state.profile.name = nameInput.value.trim().slice(0, 30) || 'Mathlete';
    store.set('profile', state.profile);
    $('.avatar', head).textContent = (state.profile.name[0] || '∑').toUpperCase();
  });
  $('#openSettings', head).addEventListener('click', openSettings);
  body.appendChild(head);

  body.appendChild(h(`<div class="stats">
    <div><b>${s.correct}</b><span>solved</span></div>
    <div><b>${s.answered ? Math.round((100 * s.correct) / s.answered) : 0}%</b><span>accuracy</span></div>
    <div><b>${s.best}</b><span>best run</span></div>
    <div><b>${dayStreak()}</b><span>day streak</span></div>
  </div>`));

  // Today's goal + last 7 days.
  const goal = state.settings.dailyGoal;
  const t = dayRec();
  const pct = Math.min(100, Math.round((100 * t.solved) / goal));
  const week = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const rec = state.days[d.toLocaleDateString('en-CA')] || {};
    const cls = rec.solved >= goal ? 'goal' : rec.seen > 0 ? 'active' : '';
    week.push(`<div class="day ${cls}" title="${rec.solved || 0} solved"><span></span><small>${d.toLocaleDateString('en', { weekday: 'narrow' })}</small></div>`);
  }
  body.appendChild(h(`<div class="goal-card">
      <div class="goal-top"><b>Today</b><span>${t.solved} / ${goal} solved</span></div>
      <div class="bar"><span style="width:${pct}%"></span></div>
      <div class="week">${week.join('')}</div>
    </div>`));

  const tabs = h(`<div class="segmented profile-tabs" role="tablist">
      <button role="tab" data-k="saved">Saved ${state.saved.length}</button>
      <button role="tab" data-k="liked">Liked ${state.liked.length}</button>
      <button role="tab" data-k="posts">Posts ${state.posts.length}</button>
    </div>`);
  const list = h('<div class="profile-list"></div>');
  const renderList = () => {
    tabs.querySelectorAll('button').forEach((b) => b.setAttribute('aria-checked', b.dataset.k === profileTab));
    list.innerHTML = '';
    if (profileTab === 'posts') {
      const make = h('<button class="btn wide">Write a post</button>');
      make.addEventListener('click', () => openCompose());
      list.appendChild(make);
      if (!state.posts.length) list.appendChild(h('<p class="empty">Share a problem you made up, a neat fact or a question. Anyone you send the link to can open it in MathScroll.</p>'));
      const ul = h('<ul class="saved-list"></ul>');
      state.posts.forEach((post, idx) => {
        const card = postCard(post);
        const li = h(`<li class="s-post"><button class="saved-item"><span class="pill">${escapeHTML(card.kind)}</span><span class="t">${escapeHTML(card.heading)}</span></button>
          <button class="icon-btn mini share-post" aria-label="Share">${ICONS.share}</button>
          <button class="icon-btn mini del-post" aria-label="Delete">${ICONS.trash}</button></li>`);
        $('.saved-item', li).addEventListener('click', () => openCard(card));
        $('.share-post', li).addEventListener('click', () => share(card));
        const del = $('.del-post', li);
        del.addEventListener('click', () => {
          if (!del.classList.contains('confirm')) { del.classList.add('confirm'); toast('Tap the bin again to delete'); setTimeout(() => del.classList.remove('confirm'), 2500); return; }
          state.posts.splice(idx, 1); saveList('posts'); renderList();
          tabs.querySelector('[data-k="posts"]').textContent = `Posts ${state.posts.length}`;
        });
        ul.appendChild(li);
      });
      list.appendChild(ul);
      return;
    }
    const items = state[profileTab];
    if (!items.length) {
      list.appendChild(h(`<p class="empty">${profileTab === 'saved' ? 'Nothing saved yet. Tap <b>Save</b> on anything you want to come back to.' : 'Nothing liked yet. Double-tap a card or tap the heart.'}</p>`));
      return;
    }
    const ul = h('<ul class="saved-list"></ul>');
    for (const item of items) {
      const meta = metaFor(item);
      const li = h(`<li class="${meta.cls}"><button class="saved-item"><span class="pill">${escapeHTML(meta.tag)}</span><span class="t">${escapeHTML(item.heading)}</span></button></li>`);
      li.querySelector('button').addEventListener('click', () => openCard(item));
      ul.appendChild(li);
    }
    list.appendChild(ul);
  };
  tabs.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { profileTab = b.dataset.k; renderList(); }));
  body.appendChild(tabs);
  body.appendChild(list);
  renderList();
  openSheet('Profile', body);
}

// ------------------------------------------------------------------ compose
const DRAFT_KEY = 'draft';
function openCompose() {
  const draft = store.get(DRAFT_KEY, { k: 'problem', t: '', b: '', a: '', s: '' });
  const body = document.createElement('div');
  body.className = 'compose';
  body.innerHTML = `
    <div class="segmented kinds" role="radiogroup">
      ${Object.entries(POST_KINDS).map(([k, v]) => `<button role="radio" data-k="${k}" aria-checked="${draft.k === k}">${v}</button>`).join('')}
    </div>
    <input class="field title" maxlength="80" placeholder="Title (optional)" value="${escapeHTML(draft.t)}">
    <div class="tex-tools" aria-label="Insert maths">
      <button data-ins="$$" data-off="1">$x$</button><button data-ins="\\frac{}{}" data-off="6">a/b</button><button data-ins="\\sqrt{}" data-off="6">√</button>
      <button data-ins="^{}" data-off="2">xⁿ</button><button data-ins="_{}" data-off="2">xₙ</button><button data-ins="\\sum_{}^{}" data-off="6">∑</button>
      <button data-ins="\\int_{}^{}" data-off="6">∫</button><button data-ins="\\le " data-off="4">≤</button><button data-ins="\\pi" data-off="3">π</button>
    </div>
    <textarea class="field body" rows="6" maxlength="5000" placeholder="Write your problem. Put maths between dollar signs, like $x^2 + y^2 = z^2$.">${escapeHTML(draft.b)}</textarea>
    <input class="field answer" maxlength="80" placeholder="Answer (optional — a number, A–E, or an expression)" value="${escapeHTML(draft.a)}">
    <textarea class="field solution" rows="3" maxlength="8000" placeholder="Solution (optional, hidden until someone taps Solution)">${escapeHTML(draft.s)}</textarea>
    <p class="small preview-label">Preview</p>
    <div class="preview content"></div>
    <button class="btn wide post-btn">Post & share</button>
    <p class="small">Posts are saved on this device. Sharing sends a link with the whole post inside it, so anyone can open it — no account needed.</p>`;
  let kind = draft.k;
  const title = $('.title', body); const text = $('.body', body); const answer = $('.answer', body); const solution = $('.solution', body);
  const preview = $('.preview', body);
  let lastFocus = text;
  [text, solution, title, answer].forEach((f) => f.addEventListener('focus', () => { lastFocus = f; }));
  const current = () => ({ k: kind, t: title.value.trim(), b: text.value.trim(), a: kind === 'problem' ? answer.value.trim() : '', s: solution.value.trim() });
  let timer;
  const update = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const d = current();
      store.set(DRAFT_KEY, d);
      answer.hidden = kind !== 'problem';
      preview.innerHTML = '';
      if (!d.b) { preview.innerHTML = '<p class="hint">Your post will appear here.</p>'; return; }
      try { preview.appendChild(renderContent(`${d.t ? `<h3>${escapeHTML(d.t)}</h3>` : ''}${textToHtml(d.b)}`, { base: 'text', dollar: true })); } catch { /* ignore */ }
    }, 200);
  };
  [title, text, answer, solution].forEach((f) => f.addEventListener('input', update));
  body.querySelectorAll('.kinds button').forEach((b) => b.addEventListener('click', () => {
    kind = b.dataset.k;
    body.querySelectorAll('.kinds button').forEach((x) => x.setAttribute('aria-checked', x === b));
    update();
  }));
  body.querySelectorAll('.tex-tools button').forEach((b) => b.addEventListener('pointerdown', (e) => {
    e.preventDefault(); // keep the keyboard open
    const f = lastFocus === title || lastFocus === answer ? text : lastFocus;
    const ins = b.dataset.ins; const off = Number(b.dataset.off);
    const s = f.selectionStart ?? f.value.length; const end = f.selectionEnd ?? s;
    f.value = f.value.slice(0, s) + ins + f.value.slice(end);
    f.focus();
    f.setSelectionRange(s + off, s + off);
    update();
  }));
  $('.post-btn', body).addEventListener('click', async () => {
    const d = current();
    if (d.b.length < 5) { text.classList.add('shake'); setTimeout(() => text.classList.remove('shake'), 400); toast('Write something first'); return; }
    const post = { ...d, n: state.profile.name, d: Date.now(), id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}` };
    state.posts.unshift(post);
    saveList('posts');
    store.set(DRAFT_KEY, { k: kind, t: '', b: '', a: '', s: '' });
    const card = postCard(post);
    openCard(card, 'Your post');
    toast('Posted');
    share(card);
  });
  update();
  openSheet('New post', body);
}

// ------------------------------------------------------------------ search
const RECENT_KEY = 'recent-searches';
const SEARCH_GROUPS = { problems: 'Problems', proofwiki: 'ProofWiki', oeis: 'OEIS', wikipedia: 'Wikipedia' };
const GROUP_META = { problems: 'contest', proofwiki: 'proofwiki', oeis: 'oeis', wikipedia: 'wikipedia' };
function openSearch(initial = '') {
  const body = document.createElement('div');
  body.className = 'search';
  body.innerHTML = `
    <form class="search-form"><input class="field" type="search" placeholder="Search problems, theorems, sequences…" enterkeyhint="search" autocomplete="off"><button class="btn" type="submit">Go</button></form>
    <div class="recent"></div>
    <div class="results"></div>`;
  const input = $('input', body); const results = $('.results', body); const recent = $('.recent', body);
  const showRecent = () => {
    const r = store.get(RECENT_KEY, []);
    recent.innerHTML = r.length ? '' : '<p class="small">Try “Catalan”, “Fermat”, “pigeonhole”, “Lagrange” or a sequence number like A000045.</p>';
    r.forEach((q) => {
      const chip = h(`<button class="chip">${escapeHTML(q)}</button>`);
      chip.addEventListener('click', () => { input.value = q; run(); });
      recent.appendChild(chip);
    });
  };
  let runId = 0;
  const run = () => {
    const q = input.value.trim();
    if (!q) return;
    const id = ++runId;
    store.set(RECENT_KEY, [q, ...store.get(RECENT_KEY, []).filter((x) => x !== q)].slice(0, 8));
    showRecent();
    results.innerHTML = '';
    const groups = {};
    for (const [key, label] of Object.entries(SEARCH_GROUPS)) {
      groups[key] = h(`<section class="result-group ${SOURCE_META[GROUP_META[key]].cls}"><h3>${label}</h3><div class="items"><p class="small searching">Searching…</p></div></section>`);
      results.appendChild(groups[key]);
    }
    searchAll(q, (key, items, err) => {
      if (id !== runId) return;
      const box = $('.items', groups[key]);
      box.innerHTML = '';
      if (err) { box.innerHTML = '<p class="small">Couldn’t search this source just now.</p>'; return; }
      if (!items.length) { box.innerHTML = '<p class="small">No matches.</p>'; return; }
      for (const it of items) {
        const row = h(`<button class="result"><b>${escapeHTML(it.title)}</b><span>${escapeHTML(it.snippet || '')}</span></button>`);
        row.addEventListener('click', async () => {
          row.classList.add('loading');
          try {
            const card = await it.load();
            if (!card) throw new Error('empty');
            openCard(card);
            sheetOnClose = () => setTimeout(() => openSearch(q), 280); // closing the card goes back to the results
          } catch { row.classList.remove('loading'); toast('Couldn’t open that one'); }
        });
        box.appendChild(row);
      }
    });
  };
  $('form', body).addEventListener('submit', (e) => { e.preventDefault(); input.blur(); run(); });
  showRecent();
  openSheet('Search', body, 'tall');
  if (initial) { input.value = initial; run(); } else setTimeout(() => input.focus(), 300);
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

  body.appendChild(h('<h3>Feed</h3>'));
  const feedGroup = h('<div class="group"></div>');
  const pers = h(`<label class="row"><span><b>Personalise For you</b><small>Show more of what you like, save and solve</small></span><input type="checkbox" class="switch" ${st.personalise ? 'checked' : ''}></label>`);
  pers.querySelector('input').addEventListener('change', (e) => { st.personalise = e.target.checked; saveSettings(); });
  feedGroup.appendChild(pers);
  const goalRow = h(`<label class="row"><span><b>Daily goal</b><small>Problems to solve each day</small></span><select class="select">${[3, 5, 10, 15, 20].map((n) => `<option ${n === st.dailyGoal ? 'selected' : ''}>${n}</option>`).join('')}</select></label>`);
  goalRow.querySelector('select').addEventListener('change', (e) => { st.dailyGoal = Number(e.target.value); saveSettings(); });
  feedGroup.appendChild(goalRow);
  body.appendChild(feedGroup);

  body.appendChild(h('<h3>Appearance</h3>'));
  const seg = h('<div class="segmented" role="radiogroup"></div>');
  for (const [k, v] of [['system', 'Auto'], ['dark', 'Dark'], ['light', 'Light']]) {
    const b = h(`<button role="radio" aria-checked="${st.theme === k}">${v}</button>`);
    b.addEventListener('click', () => {
      st.theme = k; saveSettings(); applyTheme();
      seg.querySelectorAll('button').forEach((x) => x.setAttribute('aria-checked', x === b));
    });
    seg.appendChild(b);
  }
  body.appendChild(seg);

  body.appendChild(h('<h3>Data</h3>'));
  const reset = h('<button class="btn ghost">Reset stats & history</button>');
  reset.addEventListener('click', () => {
    if (!reset.classList.contains('confirm')) { reset.classList.add('confirm'); reset.textContent = 'Tap again to reset'; return; }
    state.stats = { answered: 0, correct: 0, streak: 0, best: 0 };
    state.days = {}; saveStats();
    state.seen = new Set(); store.set('seen', []);
    state.engagement = {}; store.set('engagement', {});
    updateStreak(); toast('Stats reset');
    reset.classList.remove('confirm'); reset.textContent = 'Reset stats & history';
  });
  body.appendChild(reset);

  body.appendChild(h(`<p class="small credits">Problems come from the
    <a href="https://huggingface.co/datasets/project-numina/NuminaMath-1.5" target="_blank" rel="noopener">NuminaMath</a> dataset (AMC/AIME with AoPS Wiki solutions, AoPS forum and olympiad problems),
    theorems from <a href="https://proofwiki.org" target="_blank" rel="noopener">ProofWiki</a> via
    <a href="https://huggingface.co/datasets/wellecks/naturalproofs-gen" target="_blank" rel="noopener">NaturalProofs</a>,
    sequences from the <a href="https://oeis.org" target="_blank" rel="noopener">OEIS</a>, and articles live from
    <a href="https://en.wikipedia.org" target="_blank" rel="noopener">Wikipedia</a>. Wiki content is CC BY-SA.
    Contest problems © MAA and their respective owners.</p>`));

  const apply = () => {
    if (!changed) return;
    changed = false;
    if (state.tab !== 'mix' && !st.sources[state.tab]) state.tab = 'mix';
    renderTabs(); resetFeed();
  };
  apply.onReplace = true;
  openSheet('Settings', body, '', apply);
}

// ------------------------------------------------------------------ onboarding
function openWelcome() {
  const st = state.settings;
  const body = document.createElement('div');
  body.className = 'welcome';
  const srcChips = Object.entries(SOURCES).map(([k, s]) => `<button class="chip ${st.sources[k] ? 'on' : ''}" data-src="${k}">${s.label}</button>`).join('');
  const topicChips = PROBLEM_TOPICS.map((t) => `<button class="chip on" data-topic="${t}">${t}</button>`).join('');
  body.innerHTML = `
    <div class="welcome-hero"><div class="brand big">∑</div><h2>Scroll maths, not videos.</h2>
      <p>Swipe up for the next card. Tap A–E to answer, double-tap to like, and tap <b>Solution</b> when you're stuck.</p></div>
    <h3>What do you want to see?</h3><div class="chips">${srcChips}</div>
    <h3>Favourite topics</h3><div class="chips">${topicChips}</div>
    <button class="btn wide start">Start scrolling</button>`;
  body.querySelectorAll('.chip').forEach((c) => c.addEventListener('click', () => c.classList.toggle('on')));
  let started = false;
  const finish = () => {
    if (started) return;
    started = true;
    const srcs = [...body.querySelectorAll('[data-src]')];
    if (srcs.some((c) => c.classList.contains('on'))) srcs.forEach((c) => { st.sources[c.dataset.src] = c.classList.contains('on'); });
    const topics = [...body.querySelectorAll('[data-topic].on')].map((c) => c.dataset.topic);
    st.topics = topics.length ? topics : [...PROBLEM_TOPICS];
    saveSettings();
    store.set('onboarded', true);
    renderTabs(); resetFeed();
  };
  finish.onReplace = true;
  $('.start', body).addEventListener('click', () => { finish(); closeSheet(); });
  openSheet('Welcome to MathScroll', body, 'tall', finish);
}

$('#profileBtn').addEventListener('click', openProfile);
$('#createBtn').addEventListener('click', () => openCompose());
$('#searchBtn').addEventListener('click', () => openSearch());

// ------------------------------------------------------------------ boot
async function readSharedPost() {
  const m = location.hash.match(/^#p=([zj][A-Za-z0-9_-]+)$/);
  if (!m) return;
  try {
    const p = await decodePost(m[1]);
    state.pinned = postCard(p);
  } catch {
    toast('That shared link looks broken');
  }
  history.replaceState(null, '', location.pathname + location.search);
}

async function boot() {
  applyTheme();
  if (state.tab !== 'mix' && !state.settings.sources[state.tab]) state.tab = 'mix';
  await readSharedPost();
  if (state.pinned) state.tab = 'mix';
  renderTabs();
  updateStreak();
  resetFeed();
  if (!store.get('onboarded', false) && !state.pinned) setTimeout(openWelcome, 400);
  window.addEventListener('online', () => { if (errorShown) { state.failures = {}; fill(); } });
  window.addEventListener('hashchange', async () => {
    await readSharedPost();
    if (state.pinned) { closeSheet(); resetFeed(); }
  });
}

function whenKatex(cb, tries = 0) {
  if (window.katex || tries > 100) cb(); else setTimeout(() => whenKatex(cb, tries + 1), 30);
}
whenKatex(boot);

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
