import { SOURCES, PROBLEM_TOPICS, escapeHTML, textToHtml, answerFor, searchAll, dailyChallenge, DEFAULT_FILTERS, difficultyToRating, difficultyWindow, WIKI_GROUP_NAMES, numinaByIndex, mathProblem, chessPuzzle, MATH_SUBJECTS, olympiadProblem } from './sources.js';
import { renderContent } from './render.js';
import { exprValue, sameValue } from './expr.js';
import * as cloud from './cloud.js';
import { openGames as openGamesRaw, mount24, GAMES, payOrSolve, gameOfDay, startGame as startGameRaw } from './games.js';
import { quickQuestion, QUICK_KINDS, burst as fxBurst, popText, confetti } from './games2.js';
import { sparkCard } from './spark.js';
// Discover: maths for everyone (fun facts, brain teasers, visual proofs, number spotlights).
SOURCES.spark = { label: 'Discover', short: 'Discover', fetch: async () => sparkCard(), blurb: 'Fun facts, brain teasers, visual proofs and number spotlights' };
import { openLearn as openLearnRaw } from './learn.js';

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
    try { localStorage.setItem('ms:' + key, JSON.stringify(value)); } catch { return false; }
    onStoreChange(key);
    return true;
  },
};

const DEFAULT_SETTINGS = {
  sources: { spark: true, contest: true, math: true, omni: true, olympiad: true, aops: true, proofwiki: true, oeis: true, wikipedia: true },
  weights: { spark: 18, contest: 20, math: 14, omni: 10, olympiad: 12, aops: 10, proofwiki: 14, oeis: 9, wikipedia: 13 },
  filters: { ...DEFAULT_FILTERS },
  topics: [...PROBLEM_TOPICS],
  personalise: true,
  dailyGoal: 5,
  theme: 'system',
  daily: true,
  focus: { on: true, every: 4, seconds: 10, gate: true, skips: 3 },
  sound: true,
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
  pins: [], // cards shown first: a post opened from a link, today's daily challenge
  badges: store.get('badges', {}),
  cosmetics: { owned: [], frame: null, ...store.get('cosmetics', {}) },
};
state.settings.sources = { ...DEFAULT_SETTINGS.sources, ...state.settings.sources };
state.settings.weights = { ...DEFAULT_SETTINGS.weights, ...state.settings.weights };
state.settings.filters = { ...DEFAULT_FILTERS, ...state.settings.filters };
state.settings.focus = { ...DEFAULT_SETTINGS.focus, ...state.settings.focus };
if (state.stats.rating == null) state.stats.rating = 1000;
const filters = () => state.settings.filters;
const fetchSettings = () => ({ ...state.settings, rating: state.stats.rating });
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
    const d = dayRec();
    d.seen++;
    saveStats();
    if (!d.loginBonus) {
      d.loginBonus = true;
      const streak = dayStreak();
      const bonus = 10 + 2 * Math.min(streak, 20);
      setTimeout(() => { gainXp(bonus); toast(streak > 1 ? `Day ${streak} streak! +${bonus} XP` : Object.keys(state.days).length > 1 ? `Welcome back! +${bonus} XP` : `Welcome! +${bonus} XP for your first day`); }, 900);
    }
    questEvent('seen');
  }
  state.seen.add(id);
  if (state.seen.size % 50 === 0 || state.seen.size === 100) checkBadges();
  if (state.seen.size > 4000) state.seen = new Set([...state.seen].slice(-3000));
  store.set('seen', [...state.seen]);
}

function dayStreak() {
  let n = 0;
  const d = new Date();
  if (!(state.days[today()]?.seen > 0 || state.days[today()]?.frozen)) d.setDate(d.getDate() - 1);
  for (;;) {
    const k = d.toLocaleDateString('en-CA');
    if (state.days[k]?.seen > 0 || state.days[k]?.frozen) { n++; d.setDate(d.getDate() - 1); } else break;
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
  if (source === 'community') return 9;
  const base = state.settings.weights[source] || 1;
  if (!state.settings.personalise) return base;
  const score = state.engagement[source] || 0;
  return base * Math.max(0.4, Math.min(3, 1 + score / 25));
}

// ------------------------------------------------------------------ badges
const BADGES = [
  { id: 'solve1', name: 'First solve', desc: 'Solve a problem', test: () => state.stats.correct >= 1 },
  { id: 'solve10', name: 'Warmed up', desc: 'Solve 10 problems', test: () => state.stats.correct >= 10 },
  { id: 'solve50', name: 'Problem crusher', desc: 'Solve 50 problems', test: () => state.stats.correct >= 50 },
  { id: 'solve200', name: 'Mathlete', desc: 'Solve 200 problems', test: () => state.stats.correct >= 200 },
  { id: 'run5', name: 'On a roll', desc: '5 correct in a row', test: () => state.stats.best >= 5 },
  { id: 'run15', name: 'Unstoppable', desc: '15 correct in a row', test: () => state.stats.best >= 15 },
  { id: 'days3', name: 'Habit', desc: '3-day streak', test: () => dayStreak() >= 3 },
  { id: 'days7', name: 'Week of maths', desc: '7-day streak', test: () => dayStreak() >= 7 },
  { id: 'days30', name: 'Devoted', desc: '30-day streak', test: () => dayStreak() >= 30 },
  { id: 'seen100', name: 'Explorer', desc: 'See 100 cards', test: () => state.seen.size >= 100 },
  { id: 'seen1000', name: 'Voyager', desc: 'See 1,000 cards', test: () => state.seen.size >= 1000 },
  { id: 'daily1', name: 'Daily solver', desc: 'Solve a daily challenge', test: () => (state.stats.dailySolved || 0) >= 1 },
  { id: 'daily7', name: 'Daily devotee', desc: '7 daily challenges in a row', test: () => (state.stats.dailyBest || 0) >= 7 },
  { id: 'seq1', name: 'Pattern spotter', desc: 'Guess the next term of a sequence', test: () => (state.stats.seqRight || 0) >= 1 },
  { id: 'post1', name: 'Author', desc: 'Write a post', test: () => state.posts.length >= 1 },
  { id: 'save10', name: 'Collector', desc: 'Save 10 cards', test: () => state.saved.length >= 10 },
  { id: 'learner', name: 'Scholar', desc: 'Finish 10 Learn lessons', test: () => (state.stats.learn?.lessons || 0) >= 10 },
  { id: 'unit1', name: 'Unit cleared', desc: 'Pass a unit test in Learn', test: () => Object.values(state.stats.learn?.done || {}).some((d) => d >= 5) },
  { id: 'boss1', name: 'Boss slayer', desc: 'Defeat a unit boss in Learn', test: () => Object.values(state.stats.learn?.boss || {}).some((l) => l.length) },
  { id: 'lecturer', name: 'Lecture hall', desc: 'Finish 5 Learn lectures', test: () => Object.values(state.stats.learn?.lectures || {}).reduce((a, l) => a + l.length, 0) >= 5 },
  { id: 'puzzler', name: 'Tactician', desc: 'Solve 10 chess puzzles', test: () => (state.stats.puzzlesSolved || 0) >= 10 },
  { id: 'gamer', name: 'Gamer', desc: 'Play 10 different mini-games', test: () => Object.keys(state.stats.games || {}).length >= 10 },
  { id: 'arcade', name: 'Arcade legend', desc: 'Play every mini-game', test: () => GAMES.every((g) => (state.stats.games || {})[g.id] != null) },
  { id: 'maker24', name: 'Twenty-four', desc: 'Solve 10 “make 24” puzzles', test: () => (state.stats.solved24 || 0) >= 10 },
  { id: 'duel1', name: 'Duelist', desc: 'Win a duel', test: () => (state.stats.duelsWon || 0) >= 1 },
  { id: 'level10', name: 'Double digits', desc: 'Reach level 10', test: () => levelFor(state.stats.xp || 0) >= 10 },
  { id: 'focus10', name: 'Deep thinker', desc: 'Finish 10 focus problems', test: () => (state.stats.focusDone || 0) >= 10 },
  { id: 'think30', name: 'Patient mind', desc: 'Spend 30 minutes thinking on problems', test: () => (state.stats.thinkTotal || 0) >= 1800 },
];
function checkBadges() {
  let fresh = null;
  for (const b of BADGES) {
    if (!state.badges[b.id] && b.test()) { state.badges[b.id] = today(); fresh = b; }
  }
  if (fresh) {
    store.set('badges', state.badges);
    setTimeout(() => toast(`Badge unlocked: ${fresh.name}`), 900);
  }
}

// ------------------------------------------------------------------ XP, levels, quests, streak freezes
const LEVEL_TITLES = [[1, 'Novice'], [3, 'Apprentice'], [6, 'Problem Solver'], [10, 'Mathlete'], [15, 'Competitor'], [20, 'Olympian'], [30, 'Grandmaster'], [45, 'Legend']];
const xpForLevel = (L) => 25 * L * (L - 1);
const levelFor = (xp) => Math.max(1, Math.floor((1 + Math.sqrt(1 + 0.16 * Math.max(0, xp))) / 2));
const titleFor = (L) => [...LEVEL_TITLES].reverse().find(([l]) => L >= l)[1];
let pendingXp = 0; let xpTimer = null;

function gainXp(amount, anchor = null) {
  amount = Math.round(amount);
  if (!(amount > 0)) return;
  const st = state.stats;
  const before = levelFor(st.xp || 0);
  st.xp = (st.xp || 0) + amount;
  rollWeek();
  const wk = cloud.weekStart();
  if (st.weekOf !== wk) { st.weekOf = wk; st.weekXp = 0; }
  const leagueBefore = leagueFor(st.weekXp || 0)[0];
  st.weekXp = (st.weekXp || 0) + amount;
  session.xp += amount;
  const leagueAfter = leagueFor(st.weekXp)[0];
  if (leagueAfter !== leagueBefore) setTimeout(() => { toast(`Promoted to ${leagueAfter} league!`); sound('level'); }, 1600);
  saveStats();
  renderLevel();
  if (anchor) floatXp(anchor, amount);
  const after = levelFor(st.xp);
  if (after > before) {
    st.chests = (st.chests || 0) + 1; // every level-up comes with a chest
    saveStats();
    setTimeout(() => celebrateLevel(after), 700);
  }
  if (cloud.currentUser()) { pendingXp += amount; clearTimeout(xpTimer); xpTimer = setTimeout(flushXp, 2500); }
}
async function flushXp() {
  let a = pendingXp; pendingXp = 0;
  while (a > 0) {
    const chunk = Math.min(400, a); a -= chunk;
    try { await cloud.addXp(chunk); } catch (e) { console.warn('[MathScroll] XP not saved:', e.message); pendingXp += chunk + a; return; }
  }
}
function floatXp(anchor, amount) {
  const f = h(`<span class="xp-float">+${amount} XP</span>`);
  anchor.appendChild(f);
  setTimeout(() => f.remove(), 1300);
}
function renderLevel() {
  const btn = $('#levelBtn');
  if (!btn) return;
  const xp = state.stats.xp || 0; const L = levelFor(xp);
  const frac = (xp - xpForLevel(L)) / (xpForLevel(L + 1) - xpForLevel(L));
  btn.querySelector('b').textContent = L;
  btn.querySelector('.prog').style.strokeDashoffset = `${94.25 * (1 - frac)}`;
  btn.setAttribute('aria-label', `Level ${L}, ${Math.round(frac * 100)}% to level ${L + 1}. Open your progress.`);
  const open = questsFor(today()).filter((q) => !(dayRec().questsDone || []).includes(q.id)).length;
  btn.classList.toggle('has-quests', open > 0);
  const bar = $('#xpbar');
  if (bar) {
    bar.querySelector('.fill').style.width = `${Math.max(2, frac * 100)}%`;
    const cp = state.stats.chestProgress || 0;
    bar.querySelector('.pips').innerHTML = Array.from({ length: CHEST_EVERY }, (_, i) => `<i class="${i < cp ? 'on' : ''}"></i>`).join('');
  }
  const cb = $('#chestBtn');
  if (cb) { const n = state.stats.chests || 0; cb.hidden = n <= 0; cb.querySelector('b').textContent = n > 1 ? n : ''; }
}
function celebrateLevel(L) {
  const glyphs = ['∑', 'π', '∞', '√', '∫', 'φ', '★', 'e', 'Δ', 'θ'];
  const ov = h(`<div class="levelup" role="dialog" aria-label="Level up"><div class="lu-card"><small>Level up!</small><div class="lu-num">${L}</div><b>${titleFor(L)}</b><p>${xpForLevel(L + 1) - (state.stats.xp || 0)} XP to level ${L + 1}</p><span class="lu-chest">🎁 +1 chest</span></div></div>`);
  for (let i = 0; i < 28; i++) {
    const g = document.createElement('span');
    g.className = 'confetti'; g.textContent = glyphs[i % glyphs.length];
    g.style.left = `${Math.random() * 100}%`; g.style.animationDelay = `${Math.random() * 0.6}s`;
    g.style.color = ['#f5b942', '#4ade80', '#8fb0ff', '#ff8fab', '#c4a5ff'][i % 5];
    ov.appendChild(g);
  }
  const close = () => ov.remove();
  ov.addEventListener('click', close);
  setTimeout(close, 3200);
  document.body.appendChild(ov);
  sound('level');
  unlockLevelCosmetics(L);
  checkBadges();
}
// XP for a correct answer: harder problems and answer combos are worth more.
function solveXp(data, streak) {
  const base = 10 + Math.round((data.difficulty ?? 3) * 4);
  const mult = streak >= 10 ? 2.5 : streak >= 5 ? 2 : streak >= 3 ? 1.5 : 1;
  return { xp: Math.round(base * mult), mult };
}

const QUEST_POOL = [
  { id: 'solve3', text: 'Solve 3 problems', goal: 3, ev: 'solve', xp: 30 },
  { id: 'solve5', text: 'Solve 5 problems', goal: 5, ev: 'solve', xp: 45 },
  { id: 'combo3', text: 'Get 3 right in a row', goal: 3, ev: 'combo', xp: 35 },
  { id: 'focus2', text: 'Finish 2 focus problems', goal: 2, ev: 'focus', xp: 30 },
  { id: 'hard1', text: 'Solve a Hard or Expert problem', goal: 1, ev: 'hard', xp: 40 },
  { id: 'seq1', text: 'Guess the next term of a sequence', goal: 1, ev: 'seq', xp: 30 },
  { id: 'proof2', text: 'Read 2 proofs', goal: 2, ev: 'proof', xp: 20 },
  { id: 'like3', text: 'Like 3 cards', goal: 3, ev: 'like', xp: 15 },
  { id: 'think5', text: 'Spend 5 minutes thinking on problems', goal: 300, ev: 'think', xp: 30, unit: 's' },
  { id: 'daily', text: 'Solve today’s daily challenge', goal: 1, ev: 'daily', xp: 40 },
  { id: 'cards15', text: 'Look at 15 cards', goal: 15, ev: 'seen', xp: 15 },
  { id: 'game1', text: 'Play a mini-game', goal: 1, ev: 'game', xp: 20 },
  { id: 'lesson1', text: 'Finish a Learn lesson', goal: 1, ev: 'lesson', xp: 25 },
  { id: 'lesson3', text: 'Finish 3 Learn lessons', goal: 3, ev: 'lesson', xp: 50 },
  { id: 'lecture1', text: 'Watch a Learn lecture', goal: 1, ev: 'lecture', xp: 20 },
];
// Three quests a day, the same for everyone, picked from the date.
function questsFor(date) {
  let seed = 0;
  for (const ch of `quests-${date}`) seed = (seed * 33 + ch.charCodeAt(0)) >>> 0;
  const src = state.settings.sources;
  const pool = QUEST_POOL.filter((q) => (q.id !== 'daily' || state.settings.daily) && (q.ev !== 'focus' || state.settings.focus.on) && (q.ev !== 'proof' || src.proofwiki) && (q.ev !== 'seq' || src.oeis));
  // Seeded shuffle, then the first three with different kinds of goal (always finishes).
  const order = [...pool];
  for (let i = order.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1103515245) + 12345) >>> 0;
    const j = (seed >>> 8) % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  const picked = [];
  for (const q of order) {
    if (picked.length === 3) break;
    if (!picked.some((p) => p.ev === q.ev)) picked.push(q);
  }
  return picked;
}
function questEvent(ev, amount = 1, atLeast = null) {
  const d = dayRec();
  d.quests = d.quests || {}; d.questsDone = d.questsDone || [];
  let changed = false;
  for (const q of questsFor(today())) {
    if (q.ev !== ev || d.questsDone.includes(q.id)) continue;
    const prev = d.quests[q.id] || 0;
    const now = atLeast != null ? Math.max(prev, atLeast) : prev + amount;
    if (now === prev) continue;
    d.quests[q.id] = now; changed = true;
    if (now >= q.goal) {
      d.questsDone.push(q.id);
      setTimeout(() => { toast(`Quest complete: ${q.text} · +${q.xp} XP`); gainXp(q.xp); sound('quest'); }, 1200);
      if (d.questsDone.length === 3 && !d.allQuests) {
        d.allQuests = true;
        state.stats.freezes = Math.min(2, (state.stats.freezes || 0) + 1);
        setTimeout(() => { toast('All quests done! +50 XP and a streak freeze'); gainXp(50); }, 3200);
      }
    }
  }
  if (changed) { saveStats(); renderLevel(); }
}
// Missed yesterday? Spend a streak freeze so the day streak survives.
function applyStreakFreeze() {
  const day = (n) => { const x = new Date(); x.setDate(x.getDate() - n); return x.toLocaleDateString('en-CA'); };
  const y = state.days[day(1)]; const before = state.days[day(2)];
  if ((y?.seen > 0) || y?.frozen || !(before?.seen > 0 || before?.frozen) || !(state.stats.freezes > 0)) return;
  state.days[day(1)] = { ...(y || { seen: 0, answered: 0, solved: 0 }), frozen: true };
  state.stats.freezes--;
  saveStats();
  setTimeout(() => toast(`Streak freeze used — your ${dayStreak()}-day streak is safe`), 1500);
}

// ------------------------------------------------------------------ rewards: sounds, chests, cosmetics, leagues
let audioCtx = null;
function sound(kind) {
  if (!state.settings.sound) return;
  try {
    audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const tunes = {
      correct: [[660, 0], [990, 0.09]], wrong: [[247, 0], [196, 0.11]], crit: [[784, 0], [1175, 0.06], [1568, 0.12], [2093, 0.18]],
      level: [[523, 0], [659, 0.1], [784, 0.2], [1047, 0.32]], chest: [[880, 0], [1175, 0.07], [1568, 0.14]], quest: [[740, 0], [1109, 0.1]],
    };
    const t0 = audioCtx.currentTime;
    for (const [f, dt] of tunes[kind] || []) {
      const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
      o.type = kind === 'wrong' ? 'triangle' : 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0 + dt);
      g.gain.exponentialRampToValueAtTime(kind === 'wrong' ? 0.12 : 0.16, t0 + dt + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dt + 0.24);
      o.connect(g); g.connect(audioCtx.destination); o.start(t0 + dt); o.stop(t0 + dt + 0.26);
    }
  } catch { /* no audio */ }
}

const COSMETICS = [
  { id: 'mint', name: 'Mint', bg: 'linear-gradient(135deg,#34d399,#a7f3d0)' },
  { id: 'ocean', name: 'Ocean', bg: 'linear-gradient(135deg,#38bdf8,#1e3a8a)' },
  { id: 'ember', name: 'Ember', bg: 'linear-gradient(135deg,#facc15,#f97316,#ef4444)' },
  { id: 'rose', name: 'Rose', bg: 'linear-gradient(135deg,#fda4af,#e11d48)' },
  { id: 'mono', name: 'Graphite', bg: 'linear-gradient(135deg,#f5f5f5,#404040)' },
  { id: 'neon', name: 'Neon', bg: 'linear-gradient(135deg,#a3e635,#22d3ee)' },
  { id: 'gold', name: 'Gold', bg: 'linear-gradient(135deg,#b7791f,#fde68a,#f5b942,#b7791f)', level: 5 },
  { id: 'aurora', name: 'Aurora', bg: 'linear-gradient(135deg,#22d3ee,#a78bfa,#f472b6)', level: 10 },
  { id: 'galaxy', name: 'Galaxy', bg: 'linear-gradient(135deg,#1e1b4b,#7c3aed,#ec4899,#1e1b4b)', level: 15 },
  { id: 'prism', name: 'Prism', bg: 'conic-gradient(#ef4444,#f59e0b,#eab308,#22c55e,#3b82f6,#8b5cf6,#ef4444)', level: 20 },
  { id: 'sigma', name: 'Sigma', bg: 'conic-gradient(from 45deg,#f5b942,#0d0e12,#f5b942,#0d0e12,#f5b942)', rare: true },
];
const saveCosmetics = () => store.set('cosmetics', state.cosmetics);
function own(id) {
  if (state.cosmetics.owned.includes(id)) return false;
  state.cosmetics.owned.push(id);
  if (!state.cosmetics.frame) state.cosmetics.frame = id;
  saveCosmetics();
  return true;
}
function unlockLevelCosmetics(L) {
  for (const c of COSMETICS) if (c.level && L >= c.level && own(c.id)) setTimeout(() => toast(`New avatar frame unlocked: ${c.name}`), 3600);
}
const frameBg = () => COSMETICS.find((c) => c.id === state.cosmetics.frame)?.bg || null;

const CHEST_EVERY = 5;
function chestProgress() {
  const st = state.stats;
  st.chestProgress = (st.chestProgress || 0) + 1;
  if (st.chestProgress >= CHEST_EVERY) {
    st.chestProgress = 0;
    st.chests = (st.chests || 0) + 1;
    setTimeout(() => { toast('Chest earned! Tap 🎁 to open it'); sound('chest'); }, 900);
  }
  saveStats(); renderLevel();
}
// Open a chest: mostly XP, sometimes a streak freeze, a new avatar frame, or a jackpot.
function openChest() {
  const st = state.stats;
  if (!(st.chests > 0)) return;
  st.chests--; saveStats(); renderLevel();
  const r = Math.random();
  const lockedFrames = COSMETICS.filter((c) => !c.level && !state.cosmetics.owned.includes(c.id) && (!c.rare || r > 0.97));
  let reward;
  if (r > 0.95) reward = { kind: 'xp', amount: 300, label: 'Jackpot!' };
  else if (r > 0.80 && lockedFrames.length) { const c = lockedFrames[Math.floor(Math.random() * lockedFrames.length)]; reward = { kind: 'frame', c, label: 'New avatar frame' }; }
  else if (r > 0.68 && (st.freezes || 0) < 2) reward = { kind: 'freeze', label: 'Streak freeze' };
  else if (r > 0.50) reward = { kind: 'xp', amount: 80 + Math.floor(Math.random() * 71), label: 'Big XP' };
  else reward = { kind: 'xp', amount: 25 + Math.floor(Math.random() * 36), label: 'XP' };
  const ov = h(`<div class="chest-open" role="dialog" aria-label="Chest"><div class="chest-box">🎁</div><div class="chest-reward" hidden></div><p class="small">Tap to continue</p></div>`);
  document.body.appendChild(ov);
  sound('chest');
  setTimeout(() => {
    const box = $('.chest-reward', ov);
    $('.chest-box', ov).classList.add('opened');
    if (reward.kind === 'xp') { box.innerHTML = `<small>${reward.label}</small><b>+${reward.amount} XP</b>`; gainXp(reward.amount); }
    if (reward.kind === 'freeze') { box.innerHTML = '<small>Streak freeze</small><b>❄</b><span>Protects your streak if you miss a day</span>'; st.freezes = (st.freezes || 0) + 1; saveStats(); }
    if (reward.kind === 'frame') { own(reward.c.id); box.innerHTML = `<small>New avatar frame</small><i class="frame-swatch" style="background:${reward.c.bg}"></i><b>${reward.c.name}</b><span>Equip it in your profile</span>`; }
    box.hidden = false;
    sound(reward.amount >= 300 ? 'level' : 'crit');
  }, 900);
  ov.addEventListener('click', () => { if (!$('.chest-reward', ov).hidden) { ov.remove(); if (state.stats.chests > 0) setTimeout(() => toast(`${state.stats.chests} more chest${state.stats.chests === 1 ? '' : 's'} to open`), 300); } });
}

const LEAGUES = [['Bronze', 0, '#cd7f32'], ['Silver', 150, '#cbd5e1'], ['Gold', 400, '#f5b942'], ['Platinum', 800, '#67e8f9'], ['Diamond', 1500, '#a5b4fc'], ['Master', 3000, '#f472b6']];
const leagueFor = (wxp) => { let l = LEAGUES[0]; for (const x of LEAGUES) if (wxp >= x[1]) l = x; return l; };
const nextLeague = (wxp) => LEAGUES.find((x) => x[1] > wxp) || null;
// A new week started: remember how last week went.
function rollWeek() {
  const st = state.stats; const wk = cloud.weekStart();
  if (st.weekOf && st.weekOf !== wk) {
    if ((st.weekXp || 0) > 0) st.lastWeek = { xp: st.weekXp, league: leagueFor(st.weekXp)[0], shown: false };
    st.weekOf = wk; st.weekXp = 0; saveStats();
  }
  if (st.lastWeek && !st.lastWeek.shown) {
    st.lastWeek.shown = true; saveStats();
    setTimeout(() => toast(`Last week: ${st.lastWeek.league} league with ${st.lastWeek.xp} XP. New week — climb again!`), 2500);
  }
}

// Session recap after 30 minutes of use.
const session = { start: Date.now(), active: 0, solved: 0, xp: 0, recapAt: 30 };
setInterval(() => {
  if (document.hidden) return;
  session.active++;
  if (session.active >= session.recapAt * 60) { session.recapAt += 30; openRecap(); }
}, 1000);
function openRecap() {
  if (!sheet.hidden) return;
  const L = levelFor(state.stats.xp || 0);
  const body = document.createElement('div');
  body.className = 'recap';
  body.innerHTML = `<div class="recap-big">${Math.round(session.active / 60)} min</div>
    <div class="stats"><div><b>${session.solved}</b><span>solved</span></div><div><b>+${session.xp}</b><span>XP</span></div><div><b>${L}</b><span>level</span></div><div><b>${dayStreak()}</b><span>day streak</span></div></div>
    <p>${xpForLevel(L + 1) - (state.stats.xp || 0)} XP to level ${L + 1}. Keep going, or take a break and come back for tomorrow’s quests.</p>
    <button class="btn wide keep">Keep going</button><button class="btn ghost wide share-s">Share my session</button>`;
  $('.keep', body).addEventListener('click', closeSheet);
  $('.share-s', body).addEventListener('click', () => shareText(`I solved ${session.solved} maths problems and earned ${session.xp} XP on MathScroll in ${Math.round(session.active / 60)} minutes!`));
  openSheet('Session recap', body);
}

// ------------------------------------------------------------------ accounts
// Once accounts are set up (config.js filled in), guests get a short taste of the feed and then need a
// free account for everything: the feed, Learn, Games, Numeria and posting. Before setup nothing is locked.
const GUEST_TASTE = 10;
const needsAccount = () => cloud.cloudEnabled && !cloud.currentUser();
const PERKS = `<ul class="perks">
      <li><b>The endless feed</b>: contest problems, proofs, puzzles and Discover cards</li>
      <li><b>Learn</b>: courses, lectures, bosses and olympiad tracks</li>
      <li><b>Games</b>: 12 games with 144 campaign levels, and the Numeria MMO</li>
      <li><b>Daily challenge, leaderboards</b> and ranked sprints</li>
      <li><b>Your XP, streaks and badges</b> saved on every device</li>
      <li><b>Post, like and comment</b> in Community</li>
    </ul>`;
function requireAccount(feature) {
  if (!needsAccount()) return false;
  const body = document.createElement('div');
  body.className = 'gate';
  body.innerHTML = `<div class="gate-icon">★</div><h3>${escapeHTML(feature)} needs a free account</h3>${PERKS}
    <button class="btn wide create">Create free account</button>
    <button class="btn ghost wide signin">I have an account</button>`;
  $('.create', body).addEventListener('click', () => openAuth('', 'signup'));
  $('.signin', body).addEventListener('click', () => openAuth('', 'signin'));
  openSheet('Free account needed', body);
  return true;
}
// Gated entry points: everything outside the feed's free taste goes through these.
function openLearn(c) { if (requireAccount('Learn')) return; openLearnRaw(c); }
function openGames(c) { if (requireAccount('Games')) return; openGamesRaw(c); }
function startGame(id, c, ...a) { if (requireAccount('Games')) return; startGameRaw(id, c, ...a); }
// The wall that covers the feed when a guest's taste runs out.
function guestSeen() {
  if (!needsAccount()) return;
  const n = store.get('guestViews', 0) + 1;
  store.set('guestViews', n);
  if (n > GUEST_TASTE) showWall();
}
function showWall() {
  if (!needsAccount() || $('.acct-wall')) return;
  const w = document.createElement('div');
  w.className = 'acct-wall';
  w.innerHTML = `<div class="aw-card"><div class="aw-sigma">∑</div><h2>Enjoying MathScroll?</h2>
    <p>You’ve seen your ${GUEST_TASTE} free cards. Make a free account to keep scrolling and unlock everything:</p>${PERKS}
    <button class="btn wide create">Create free account</button><button class="btn ghost wide signin">I have an account</button>
    <p class="small">Free forever. No ads. Just a username, email and password.</p></div>`;
  $('.create', w).addEventListener('click', () => openAuth('', 'signup'));
  $('.signin', w).addEventListener('click', () => openAuth('', 'signin'));
  document.body.appendChild(w);
}
function hideWall() { $('.acct-wall')?.remove(); }

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
  chat: '<svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12z"/></svg>',
  flag: '<svg viewBox="0 0 24 24"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>',
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
// A public post from the community database.
function cloudCard(row) {
  const kind = POST_KINDS[row.kind] ? row.kind : 'problem';
  const prof = row.profiles || {};
  const name = prof.username ? `@${prof.username}` : 'someone';
  const p = { t: row.title || '', b: row.body, a: row.answer || '', s: row.solution || '', n: name, k: kind, d: Date.parse(row.created_at) };
  return {
    ...postCard(p),
    id: `cloud:${row.id}`,
    cloudId: row.id,
    ownerId: row.user_id,
    author: name,
    likeCount: row.like_count || 0,
    commentCount: row.comment_count || 0,
    topic: row.topic || null,
    difficulty: row.difficulty || null,
    rated: false,
    solutionNote: `Posted by ${name} on MathScroll.`,
  };
}
const timeAgo = (t) => {
  const s = Math.max(1, Math.round((Date.now() - t) / 1000));
  if (s < 60) return 'just now';
  const m = Math.round(s / 60); if (m < 60) return `${m}m`;
  const hr = Math.round(m / 60); if (hr < 24) return `${hr}h`;
  const d = Math.round(hr / 24); return d < 30 ? `${d}d` : new Date(t).toLocaleDateString();
};

async function postLink(p) {
  return `${PUBLIC_URL}#p=${await encodePost({ t: p.t, b: p.b, a: p.a, s: p.s, n: p.n, k: p.k, d: p.d })}`;
}

// ------------------------------------------------------------------ tabs
const TABS = [
  { id: 'mix', label: 'For you' },
  { id: 'spark', label: '✨ Discover' },
  { id: 'community', label: 'Community' },
  { id: 'contest', label: 'AMC/AIME' },
  { id: 'math', label: 'MATH' },
  { id: 'omni', label: 'Omni' },
  { id: 'aops', label: 'AoPS' },
  { id: 'olympiad', label: 'Olympiad' },
  { id: 'proofwiki', label: 'Proofs' },
  { id: 'oeis', label: 'Sequences' },
  { id: 'wikipedia', label: 'Concepts' },
];

function renderTabs() {
  const nav = $('#tabs');
  nav.innerHTML = '';
  const n = activeFilterCount();
  const fb = h(`<button class="tab filter-pill ${n ? 'on' : ''}" aria-label="Filters"><svg viewBox="0 0 24 24"><path d="M4 6h16M7 12h10M10 18h4"/></svg>${n ? `<b>${n}</b>` : ''}</button>`);
  fb.addEventListener('click', openFilters);
  nav.appendChild(fb);
  for (const t of TABS) {
    if (t.id === 'community' ? !cloud.cloudEnabled : t.id !== 'mix' && t.id !== 'games' && t.id !== 'learn' && !state.settings.sources[t.id]) continue;
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
  if (state.tab === 'community') return ['community'];
  const enabled = Object.keys(SOURCES).filter((k) => state.settings.sources[k] && (state.failures[k] || 0) < 5);
  if (state.tab !== 'mix') return enabled.includes(state.tab) ? [state.tab] : [];
  const fs = fetchSettings();
  const list = enabled.filter((k) => !SOURCES[k].eligible || SOURCES[k].eligible(fs));
  if (cloud.cloudEnabled && (state.failures.community || 0) < 3 && filters().qtype === 'any' && !filters().checkable) list.push('community');
  return list;
}

function pickSource(list) {
  const w = list.map(weightFor);
  let r = Math.random() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < list.length; i++) { if ((r -= w[i]) < 0) return list[i]; }
  return list[list.length - 1];
}

// Community posts: newest first on the Community tab; a random recent one inside For you.
const community = { offset: 0, buffer: [], done: false, recent: null };
function resetCommunity() { community.offset = 0; community.buffer = []; community.done = false; }
async function communityCard() {
  if (state.tab === 'community') {
    if (!community.buffer.length && !community.done) {
      const rows = await cloud.listPosts({ order: state.communityOrder || 'new', limit: 15, offset: community.offset });
      community.offset += rows.length;
      if (rows.length < 15) community.done = true;
      community.buffer.push(...rows);
    }
    const row = community.buffer.shift();
    if (!row) throw new Error('end');
    return cloudCard(row);
  }
  if (!community.recent || Date.now() - community.recent.at > 5 * 60000) {
    community.recent = { at: Date.now(), rows: await cloud.listPosts({ order: 'new', limit: 50 }) };
  }
  const fresh = community.recent.rows.filter((r) => !state.seen.has(`cloud:${r.id}`) && !state.cards.some((c) => c.data.id === `cloud:${r.id}`));
  if (!fresh.length) throw new Error('no matching problem');
  return cloudCard(fresh[Math.floor(Math.random() * fresh.length)]);
}

// Outliers: cards that would show up broken or odd. All sources stay in; just these cards are skipped.
const FIGURE_REF = /\b(as shown|shown (in|below|above)|in the (figure|diagram|picture|graph) (below|above|shown)|see (the )?(figure|diagram)|the (figure|diagram|picture) (below|above|shows)|figure \d|following (figure|diagram))\b/i;
function isOutlier(card) {
  const html = card.html || '';
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const hasPicture = /<img|asy-src|<svg|class="figure"/.test(html);
  if (card.source === 'wikipedia') return text.length < 280;
  if (card.source === 'oeis' || card.source === 'proofwiki') return text.length < 20;
  if (text.length < 25 || text.length > 6000) return true;
  if (!hasPicture && FIGURE_REF.test(text)) return true; // refers to a picture we don't have
  if (/\uFFFD|\?\?\?\?|\[\s*\]\s*$/.test(text)) return true; // garbled text
  if (/^(problem|question)\s*\d*[.:]?\s*$/i.test(text)) return true;
  return false;
}
// Between problems the For you feed drops in something different now and then.
const INTERSTITIALS = ['lightning', 'q24', 'course', 'lightning', 'gotd', 'q24', 'lightning', 'course'];
let sinceGame = 0; let interIdx = 0;
async function fetchCard() {
  if (state.tab === 'mix' && ++sinceGame >= 8 && state.cards.filter((c) => c.data.source !== 'game').length >= 5) {
    sinceGame = 0;
    const kind = INTERSTITIALS[interIdx++ % INTERSTITIALS.length];
    return { id: `game:${kind}:${Date.now()}`, source: 'game', kind, heading: kind };
  }
  for (let attempt = 0; attempt < 6; attempt++) {
    const list = activeSources();
    if (!list.length) throw new Error('none');
    const key = pickSource(list);
    if (key === 'community') {
      try {
        const card = await communityCard();
        if (state.cards.some((c) => c.data.id === card.id)) continue;
        return card;
      } catch (err) {
        if (err.message === 'end') throw err;
        if (err.message !== 'no matching problem') state.failures.community = (state.failures.community || 0) + 1;
        if (state.tab === 'community') throw err;
        continue;
      }
    }
    try {
      const card = await SOURCES[key].fetch(fetchSettings());
      state.failures[key] = 0;
      if (filters().hideSeen && state.seen.has(card.id) && attempt < 4) continue;
      if (isOutlier(card) && attempt < 5) { state.skippedOutliers = (state.skippedOutliers || 0) + 1; continue; }
      if (state.cards.some((c) => c.data.id === card.id)) continue;
      return card;
    } catch (err) {
      // "Nothing matches" isn't the source being down.
      if (err.message !== 'no matching problem') state.failures[key] = (state.failures[key] || 0) + 1;
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
  endFocus('reset');
  state.generation++;
  state.cards = [];
  state.pending = 0;
  currentEl = null;
  resetCommunity();
  feed.innerHTML = '';
  feed.appendChild(loaderEl());
  feed.scrollTop = 0;
  if (state.tab === 'mix') state.pins.forEach(appendCard);
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
  if (code === 'end') {
    msg.textContent = state.cards.length ? 'You’ve seen every community post. Write the next one!' : 'No community posts yet. Be the first — tap +.';
    btn.hidden = true;
    errorShown = true;
    return;
  }
  if (code === 'none') {
    msg.textContent = state.tab === 'mix' ? 'Nothing matches your filters and sources. Try widening them.' : 'This source is switched off or unreachable right now.';
  } else if (activeFilterCount()) {
    msg.textContent = 'Couldn’t find anything matching your filters just now. Try widening them, or try again.';
  } else {
    msg.textContent = navigator.onLine === false ? "You're offline. Connect to keep scrolling." : "Couldn't reach the maths sources just now.";
  }
  btn.hidden = false;
  btn.onclick = () => { state.failures = {}; btn.hidden = true; msg.textContent = 'Finding something good…'; fill(); };
  if (activeFilterCount() && !$('#loaderFilters')) {
    const f = h('<button class="btn ghost" id="loaderFilters">Filters</button>');
    f.addEventListener('click', openFilters);
    btn.after(f);
  }
  errorShown = true;
}

// ------------------------------------------------------------------ cards
const SOURCE_META = {
  contest: { tag: 'Problem', cls: 's-contest', from: 'AoPS Wiki' },
  math: { tag: 'Problem', cls: 's-math', from: 'MATH' },
  omni: { tag: 'Problem', cls: 's-omni', from: 'Omni-MATH' },
  aops: { tag: 'Problem', cls: 's-aops', from: 'AoPS forum' },
  olympiad: { tag: 'Problem', cls: 's-olympiad', from: 'Olympiad' },
  wikipedia: { tag: 'Concept', cls: 's-wiki', from: 'Wikipedia' },
  proofwiki: { tag: 'Theorem', cls: 's-proof', from: 'ProofWiki' },
  oeis: { tag: 'Sequence', cls: 's-oeis', from: 'OEIS' },
  post: { tag: 'Post', cls: 's-post', from: '' },
  spark: { tag: 'Discover', cls: 's-spark', from: 'Discover' },
};
const SPARK_TAG = { fact: 'Fun fact', teaser: 'Brain teaser', proof: 'Visual proof', number: 'Number spotlight' };
// Big faint symbol behind each card, and a little icon in its label.
const GLYPH = { contest: 'Σ', math: 'π', omni: '∞', aops: '◇', olympiad: '★', wikipedia: '∫', proofwiki: '∴', oeis: 'ℕ', post: '✎', fact: '!', teaser: '?', proof: '△', number: '#' };
const ICON = { contest: '🏆', math: '📐', omni: '🌌', aops: '💬', olympiad: '🥇', wikipedia: '📖', proofwiki: '📜', oeis: '🔢', post: '✍️', fact: '💡', teaser: '🧩', proof: '👁️', number: '🔮' };
const metaFor = (d) => {
  if (d.source === 'post') return { ...SOURCE_META.post, tag: d.kind || 'Post', from: `${d.cloudId ? '' : 'by '}${d.author}${d.date ? ` · ${timeAgo(d.date)}` : ''}` };
  if (d.source === 'spark') return { tag: SPARK_TAG[d.kind] || 'Discover', cls: `s-spark k-${d.kind}`, from: 'Discover' };
  return SOURCE_META[d.source] || SOURCE_META.wikipedia;
};
const isProblem = (d) => ['contest', 'aops', 'olympiad', 'math', 'omni'].includes(d.source) || (d.source === 'post' && d.postKind === 'problem') || (d.source === 'spark' && !!d.answer);
const inList = (key, id) => state[key].some((s) => s.id === id);

function buildCard(data, { standalone = false, onAnswered = null } = {}) {
  if (data.source === 'game') return buildGameCard(data);
  const meta = metaFor(data);
  const isSaved = inList('saved', data.id);
  const isLiked = inList('liked', data.id);
  const gk = data.source === 'spark' ? data.kind : data.source;
  const el = h(`<section class="card ${meta.cls}" data-id="${escapeHTML(data.id)}" data-glyph="${GLYPH[gk] || 'Σ'}">
    <div class="card-inner">
      ${data.banner ? `<div class="shared-banner">${escapeHTML(data.banner)}</div>` : ''}
      <div class="meta"><span class="pill"><i class="pill-ic">${ICON[gk] || '✦'}</i>${escapeHTML(meta.tag)}</span><span class="where">${escapeHTML(meta.from)}</span>${diffChip(data)}</div>
      <h2 class="heading">${escapeHTML(data.heading)}</h2>
      <div class="content"></div>
    </div>
    <nav class="rail">
      <button class="rail-btn like ${isLiked ? 'on' : ''}" aria-label="Like" aria-pressed="${isLiked}">${ICONS.heart}<span>${data.cloudId ? data.likeCount : 'Like'}</span></button>
      ${data.cloudId ? `<button class="rail-btn comments" aria-label="Comments">${ICONS.chat}<span>${data.commentCount}</span></button>` : ''}
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
  if (data.terms && data.terms.length) content.appendChild(termsGame(data, el));
  if (data.widget === 'proof') content.appendChild(proofWidget(data));
  if (data.widget === 'number') content.appendChild(numberWidget(data));
  if (data.widget === 'react') content.appendChild(reactWidget(data));
  if (isProblem(data)) content.appendChild(answerBox(data, el, onAnswered));

  $('.like', el).addEventListener('click', (e) => (data.cloudId ? toggleCloudLike(data, e.currentTarget) : toggleList('liked', data, e.currentTarget)));
  $('.comments', el)?.addEventListener('click', () => openComments(data));
  if (data.cloudId && cloud.currentUser()) {
    cloud.myLikes([data.cloudId]).then((set) => { if (set.has(data.cloudId)) { const b = $('.like', el); b.classList.add('on'); b.setAttribute('aria-pressed', 'true'); } }).catch(() => {});
  }
  $('.save', el).addEventListener('click', (e) => toggleList('saved', data, e.currentTarget));
  const srcLink = $('.open', el);
  if (srcLink && isProblem(data)) {
    // The source page can give the answer away, so it waits for the think time too.
    srcLink.classList.add('gated'); srcLink.dataset.frac = '1';
    srcLink.addEventListener('click', (e) => { if (spoilerLeft(el, 1) > 0) { e.preventDefault(); gated(el, 1, srcLink, () => {})(); } });
  }
  const solBtn = $('.sol', el);
  if (solBtn && data.daily && needsAccount()) solBtn.addEventListener('click', (e) => { e.stopImmediatePropagation(); requireAccount('The daily challenge'); }, true);
  if (solBtn) {
    if (isProblem(data)) { solBtn.classList.add('gated'); solBtn.dataset.frac = '1'; }
    solBtn.addEventListener('click', isProblem(data) ? gated(el, 1, solBtn, () => openSolution(data)) : () => openSolution(data));
  }
  $('.share', el).addEventListener('click', () => share(data));
  attachDoubleTap(el, data);

  // Fade hint when content overflows.
  const inner = $('.card-inner', el);
  let more = null;
  const checkOverflow = () => {
    const hidden = inner.scrollHeight - inner.scrollTop - inner.clientHeight > 8;
    inner.classList.toggle('overflows', hidden);
    // Long card: offer to read it all in a sheet (scrolling inside a swipe feed can be fiddly on phones).
    if (!standalone && !data.widget && inner.scrollHeight > inner.clientHeight + 40 && !more) {
      more = h('<button class="read-more">Read full ↓</button>');
      more.addEventListener('click', () => openCard(data));
      el.appendChild(more);
    }
    if (more) more.hidden = !hidden;
  };
  inner.addEventListener('scroll', checkOverflow, { passive: true });
  inner.querySelectorAll('img').forEach((img) => img.addEventListener('load', checkOverflow));
  requestAnimationFrame(checkOverflow);
  setTimeout(checkOverflow, 400);
  el._checkOverflow = checkOverflow;
  return el;
}

// ------------------------------------------------------------------ answer feedback & Discover widgets
const PRAISE = ['Correct!', 'Nailed it!', 'Brilliant!', 'Spot on!', 'Yes! 🎉', 'Great thinking!', 'You got it!'];
const pickPraise = () => PRAISE[Math.floor(Math.random() * PRAISE.length)];
function celebrate(btn, ok, cardEl) {
  const r = btn.getBoundingClientRect(); const x = r.left + r.width / 2; const y = r.top + r.height / 2;
  if (ok) {
    fxBurst(x, y, { color: ['#4ade80', '#facc15', '#60a5fa', '#f472b6'], n: 22, spread: 110 });
    if (state.stats.streak + 1 >= 5 && (state.stats.streak + 1) % 5 === 0) confetti();
  } else {
    cardEl.classList.remove('shake'); void cardEl.offsetWidth; cardEl.classList.add('shake');
  }
}
// Visual proof: step through pictures.
function proofWidget(data) {
  const p = data.proof; let k = 0;
  const w = h(`<div class="vp"><div class="vp-stage"></div><div class="vp-cap"></div><div class="vp-note"></div>
    <div class="vp-nav"><button class="btn ghost small vp-prev" aria-label="Previous step">‹</button><div class="vp-dots">${p.steps.map(() => '<i></i>').join('')}</div><button class="btn small vp-next">Next step ›</button></div></div>`);
  const show = () => {
    const st = p.steps[k];
    $('.vp-stage', w).innerHTML = st.svg;
    $('.vp-stage svg', w).animate([{ opacity: 0.2, transform: 'scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: 'ease-out' });
    const cap = $('.vp-cap', w); cap.innerHTML = ''; cap.appendChild(renderContent(`<span>${escapeHTML(st.cap)}</span>`, { base: 'text', dollar: true }));
    const note = $('.vp-note', w); note.innerHTML = ''; note.appendChild(renderContent(`<span>${escapeHTML(st.note)}</span>`, { base: 'text', dollar: true }));
    w.querySelectorAll('.vp-dots i').forEach((d, j) => d.classList.toggle('on', j <= k));
    $('.vp-prev', w).disabled = k === 0;
    const last = k === p.steps.length - 1;
    $('.vp-next', w).textContent = last ? 'Start again ↺' : 'Next step ›';
    if (last && !w.dataset.done) { w.dataset.done = '1'; gainXp(5); engage('spark', 2); questEvent('solve'); }
  };
  $('.vp-next', w).addEventListener('click', () => { k = k === p.steps.length - 1 ? 0 : k + 1; sound('click'); show(); });
  $('.vp-prev', w).addEventListener('click', () => { if (k) { k--; show(); } });
  show();
  return w;
}
// Number spotlight: tappable property chips.
function numberWidget(data) {
  const w = h(`<div class="ns"><div class="ns-big">${data.number.toLocaleString('en-US')}</div><div class="ns-chips"></div><p class="ns-tip">Tap a property to see why.</p><div class="ns-detail" hidden></div></div>`);
  const chips = $('.ns-chips', w); const detail = $('.ns-detail', w);
  data.props.forEach(([name, why]) => {
    const c = h(`<button class="ns-chip">${escapeHTML(name)}</button>`);
    c.addEventListener('click', () => {
      w.querySelectorAll('.ns-chip').forEach((x) => x.classList.toggle('on', x === c));
      detail.hidden = !why; detail.innerHTML = '';
      if (why) detail.appendChild(renderContent(`<span><b>${escapeHTML(name)}:</b> ${escapeHTML(why)}</span>`, { base: 'text', dollar: true }));
    });
    chips.appendChild(c);
  });
  return w;
}
// Fun fact reactions.
function reactWidget(data) {
  const w = h('<div class="react"><button data-r="wow">🤯 <span>Mind-blown</span></button><button data-r="knew">🤓 <span>Knew it</span></button><button data-r="share">📤 <span>Share</span></button></div>');
  w.addEventListener('click', (e) => {
    const b = e.target.closest('[data-r]'); if (!b) return;
    if (b.dataset.r === 'share') return share(data);
    if (w.dataset.done) return;
    w.dataset.done = '1'; b.classList.add('on');
    const r = b.getBoundingClientRect(); fxBurst(r.left + r.width / 2, r.top + r.height / 2, { color: ['#facc15', '#f472b6', '#60a5fa'], n: 14 });
    engage('spark', b.dataset.r === 'wow' ? 2 : 1); gainXp(2);
  });
  return w;
}

// ------------------------------------------------------------------ focus: staying with a problem
// 1) Spoilers (hint, answer, solution) unlock after a few seconds of thinking.
// 2) Every few problems is a "focus problem": the feed pauses on it for ~10 s, or until you answer.
//    A few "skip anyway" passes a day keep it from feeling like a trap.
// 3) Flicking past several problems in a row makes the next one a focus problem.
const focusCfg = () => state.settings.focus;
const answered = (el) => el.classList.contains('solved') || el.classList.contains('missed');
function spoilerLeft(el, frac) {
  const f = focusCfg();
  if (!f.gate || answered(el)) return 0;
  const start = el._firstSeen || Date.now();
  return Math.max(0, Math.ceil((start + f.seconds * 1000 * frac - Date.now()) / 1000));
}
function gated(el, frac, btn, fn) {
  return () => {
    const left = spoilerLeft(el, frac);
    if (left > 0) {
      btn.classList.remove('nudge'); void btn.offsetWidth; btn.classList.add('nudge');
      toast(`${left}s more — have a go first!`);
      return;
    }
    fn();
  };
}
// Show the countdown on locked spoiler buttons of the card on screen.
setInterval(() => {
  if (!currentEl && !sheet.classList.contains('open')) return;
  const els = [currentEl, sheet.classList.contains('open') ? $('#sheetBody .card') : null].filter(Boolean);
  for (const el of els) {
    el.querySelectorAll('.gated').forEach((b) => {
      const left = spoilerLeft(el, Number(b.dataset.frac || 1));
      b.classList.toggle('waiting', left > 0);
      if (left > 0) b.dataset.left = `${left}s`; else delete b.dataset.left;
    });
  }
}, 400);

let focusLock = null;
const skipsLeft = () => Math.max(0, focusCfg().skips - (dayRec().focusSkips || 0));
function startFocus(el) {
  if (focusLock) endFocus('reset');
  const secs = focusCfg().seconds;
  const pill = h(`<div class="focus-pill" role="status">
      <svg viewBox="0 0 36 36" class="ring"><circle cx="18" cy="18" r="15"/><circle class="prog" cx="18" cy="18" r="15"/></svg>
      <div class="focus-text"><b>Focus problem</b><span>Stay with it for <i>${secs}</i>s — or answer it</span></div>
      <button class="skip-focus">Skip${skipsLeft() ? ` (${skipsLeft()})` : ''}</button></div>`);
  el.appendChild(pill);
  const start = Date.now();
  focusLock = { el, start, secs, pill, target: el.offsetTop };
  lockFeed(el);
  const prog = $('.prog', pill);
  const tick = () => {
    if (!focusLock || focusLock.el !== el) return;
    const t = (Date.now() - start) / 1000;
    const left = Math.max(0, Math.ceil(secs - t));
    $('i', pill).textContent = left;
    prog.style.strokeDashoffset = `${94.25 * (1 - Math.min(1, t / secs))}`;
    if (t >= secs) endFocus('done'); else focusLock.timer = setTimeout(tick, 200);
  };
  tick();
  $('.skip-focus', pill).addEventListener('click', () => {
    if (!skipsLeft()) { toast('No skips left today — answer it, or wait it out. You’re close!'); return; }
    dayRec().focusSkips = (dayRec().focusSkips || 0) + 1; saveStats();
    endFocus('skip');
    feed.scrollBy({ top: feed.clientHeight, behavior: 'smooth' });
  });
}
function endFocus(reason) {
  if (!focusLock) return;
  const { el, pill, timer } = focusLock;
  clearTimeout(timer);
  focusLock = null;
  unlockFeed();
  if (reason === 'done' || reason === 'answered') {
    state.stats.focusDone = (state.stats.focusDone || 0) + 1; saveStats(); checkBadges();
    gainXp(5); questEvent('focus');
    pill.classList.add('done');
    pill.innerHTML = `<div class="focus-text"><b>${reason === 'answered' ? 'Nice focus!' : 'Time’s up — nice focus.'}</b><span>${reason === 'answered' ? 'Swipe on when you’re ready.' : 'Solutions are unlocked. Swipe on when you’re ready.'}</span></div>`;
    setTimeout(() => pill.remove(), 3500);
  } else {
    pill.remove();
  }
  if (el) el.classList.remove('focusing');
}
function lockFeed(el) {
  el.classList.add('focusing');
  const settle = (tries = 0) => {
    if (!focusLock || focusLock.el !== el) return;
    focusLock.target = el.offsetTop;
    if (Math.abs(feed.scrollTop - el.offsetTop) < 3 || tries > 12) { feed.classList.add('locked'); feed.scrollTop = el.offsetTop; return; }
    setTimeout(() => settle(tries + 1), 80);
  };
  settle();
}
function unlockFeed() { feed.classList.remove('locked'); }
// If anything still moves the feed while locked, spring back.
feed.addEventListener('scroll', () => {
  if (!focusLock || !feed.classList.contains('locked')) return;
  if (Math.abs(feed.scrollTop - focusLock.target) > 4) {
    feed.scrollTop = focusLock.target;
    const p = focusLock.pill; p.classList.remove('nudge'); void p.offsetWidth; p.classList.add('nudge');
  }
}, { passive: true });

let quickRun = 0;
let forceFocus = false;
let problemCount = 0;
// Called when a new card takes the screen.
function onCardShown(el, data, prevData, prevDwell) {
  if (prevData && isProblem(prevData)) {
    const secs = Math.min(300, prevDwell / 1000);
    const d = dayRec(); d.think = Math.round((d.think || 0) + secs);
    questEvent('think', Math.round(secs));
    state.stats.thinkTotal = Math.round((state.stats.thinkTotal || 0) + secs);
    saveStats();
    if (secs < 3) quickRun++; else quickRun = 0;
    if (quickRun >= 3 && focusCfg().on) { quickRun = 0; forceFocus = true; toast('Slow down a little — the next problem is a focus problem.'); }
  }
  el._firstSeen ||= Date.now();
  if (!data || !isProblem(data) || answered(el)) return;
  problemCount++;
  const f = focusCfg();
  if (f.on && (forceFocus || problemCount % f.every === 0)) { forceFocus = false; startFocus(el); }
}

// ------------------------------------------------------------------ difficulty
const BANDS = [
  { id: 'easy', name: 'Easy', max: 2.5 },
  { id: 'medium', name: 'Medium', max: 4.5 },
  { id: 'hard', name: 'Hard', max: 6.5 },
  { id: 'expert', name: 'Expert', max: 11 },
];
const bandOf = (d) => BANDS.find((b) => d <= b.max) || BANDS[3];
function diffChip(data) {
  if (data.difficulty == null) return '';
  const b = bandOf(data.difficulty);
  const val = data.rated ? data.difficulty.toFixed(1) : `~${data.difficulty}`;
  const dots = Math.max(1, Math.min(5, Math.round(data.difficulty / 2)));
  return `<span class="diff d-${b.id}" title="Difficulty ${val} out of 10${data.rated ? '' : ' (estimated)'}"><span class="dmeter">${[1, 2, 3, 4, 5].map((k) => `<b class="${k <= dots ? 'on' : ''}"></b>`).join('')}</span>${b.name}</span>`;
}
// Elo-style skill rating: beating a problem rated above you moves you up more.
function updateRating(data, ok) {
  if (data.difficulty == null) return;
  const st = state.stats;
  const pr = difficultyToRating(data.difficulty);
  const expected = 1 / (1 + 10 ** ((pr - st.rating) / 400));
  const k = (st.answered || 0) < 30 ? 48 : 28;
  const weight = data.rated ? 1 : 0.6; // estimated difficulties count for less
  st.rating = Math.round(Math.max(100, st.rating + k * weight * ((ok ? 1 : 0) - expected)));
  st.ratingHistory = [...(st.ratingHistory || []), st.rating].slice(-60);
  const band = bandOf(data.difficulty).id;
  st.byBand = st.byBand || {};
  st.byBand[band] = st.byBand[band] || { a: 0, c: 0 };
  st.byBand[band].a++; if (ok) st.byBand[band].c++;
  const topic = data.topic && data.topic !== 'unknown' ? data.topic : 'Other';
  st.byTopic = st.byTopic || {};
  st.byTopic[topic] = st.byTopic[topic] || { a: 0, c: 0 };
  st.byTopic[topic].a++; if (ok) st.byTopic[topic].c++;
}
function sparkline(vals) {
  if (vals.length < 2) return '';
  const w = 280; const hgt = 48;
  const lo = Math.min(...vals) - 10; const hi = Math.max(...vals) + 10;
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * w},${hgt - ((v - lo) / (hi - lo)) * hgt}`).join(' ');
  return `<svg class="spark" viewBox="0 0 ${w} ${hgt}" preserveAspectRatio="none"><polyline points="${pts}"/></svg>`;
}
function skillsSection() {
  const st = state.stats;
  const row = (label, rec) => {
    const pct = rec.a ? Math.round((100 * rec.c) / rec.a) : 0;
    return `<div class="skill"><span>${escapeHTML(label)}</span><div class="bar"><span style="width:${pct}%"></span></div><small>${rec.a ? `${pct}% · ${rec.a}` : '—'}</small></div>`;
  };
  const bands = BANDS.map((b) => row(b.name, (st.byBand || {})[b.id] || { a: 0, c: 0 })).join('');
  const topics = Object.entries(st.byTopic || {}).sort((a, b) => b[1].a - a[1].a).slice(0, 8).map(([t, r]) => row(t, r)).join('');
  const level = Math.max(1, Math.min(10, (st.rating - 600) / 160));
  return `<details class="skills" open><summary><b>Skill rating</b><span class="rating">${st.rating}</span></summary>
    <p class="small">Goes up when you solve problems, more for harder ones. You're working at about <b>${level.toFixed(1)}/10</b> (${bandOf(level).name}).</p>
    ${sparkline(st.ratingHistory || [])}
    <h4>By difficulty</h4>${bands}
    ${topics ? `<h4>By topic</h4>${topics}` : ''}</details>`;
}

// Show the first terms of a sequence and let the person guess the next one.
function termsGame(data, cardEl) {
  const wrap = h('<div></div>');
  const all = data.terms;
  const k = Math.min(10, all.length - 1);
  const terms = h(`<div class="terms" aria-label="First terms"></div>`);
  all.slice(0, k).forEach((t, i) => terms.appendChild(h(`<span style="--i:${i}">${escapeHTML(t)}</span>`)));
  const blank = h('<span class="blank">?</span>');
  terms.appendChild(blank);
  wrap.appendChild(terms);
  const form = h(`<form class="numeric guess"><input inputmode="numeric" maxlength="24" placeholder="Next term?" aria-label="Guess the next term" autocomplete="off"><button class="btn" type="submit">Check</button><button class="btn ghost giveup" type="button">Show</button></form>`);
  const reveal = (ok, gaveUp) => {
    form.querySelectorAll('input, button').forEach((x) => { x.disabled = true; });
    blank.textContent = all[k];
    blank.className = ok ? 'right' : 'revealed';
    all.slice(k + 1).forEach((t, i) => terms.appendChild(h(`<span style="--i:${i}">${escapeHTML(t)}</span>`)));
    terms.appendChild(h('<span class="ellipsis">…</span>'));
    if (!gaveUp) {
      state.stats.seqTried = (state.stats.seqTried || 0) + 1;
      if (ok) state.stats.seqRight = (state.stats.seqRight || 0) + 1;
      if (ok) { gainXp(12, wrap); questEvent('seq'); } else gainXp(2);
      saveStats();
      engage('oeis', ok ? 2 : 1);
      checkBadges();
    }
    const fb = h(`<div class="feedback ${ok ? 'ok' : 'no'}">${ok ? 'Spot on!' : gaveUp ? 'Here’s how it continues.' : `Not quite — it’s <b>${escapeHTML(all[k])}</b>.`} <button class="link">Why?</button></div>`);
    fb.querySelector('.link').addEventListener('click', () => openSolution(data));
    wrap.appendChild(fb);
    if (ok) burst(wrap);
    requestAnimationFrame(() => cardEl._checkOverflow?.());
  };
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    const v = input.value.trim().replace(/^\+/, '').replace(/[,\s]/g, '');
    if (!/^-?\d+$/.test(v)) { input.classList.add('shake'); setTimeout(() => input.classList.remove('shake'), 400); return; }
    input.blur();
    const ok = v.replace(/^(-?)0+(?=\d)/, '$1') === all[k];
    input.classList.add(ok ? 'right' : 'wrong');
    reveal(ok, false);
  });
  form.querySelector('.giveup').addEventListener('click', () => reveal(false, true));
  wrap.appendChild(form);
  return wrap;
}

// Double-tap anywhere on a card to like it.
function attachDoubleTap(el, data) {
  let last = 0;
  el.addEventListener('pointerup', (e) => {
    if (e.target.closest('button, a, input, textarea, .rail, form')) return;
    const now = Date.now();
    if (now - last < 320) {
      last = 0;
      const likeBtn = $('.like', el);
      if (data.cloudId) { if (!likeBtn.classList.contains('on')) toggleCloudLike(data, likeBtn); } else if (!inList('liked', data.id)) toggleList('liked', data, likeBtn);
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

function answerBox(data, cardEl, onAnswered = null) {
  const box = h('<div class="answer"></div>');
  if (data.daily && needsAccount()) {
    const b = h('<button class="btn wide gate-btn">★ Sign in to play today’s challenge</button>');
    b.addEventListener('click', () => requireAccount('The daily challenge'));
    box.appendChild(b);
    return box;
  }
  if (data.hintHtml) {
    const hint = h('<button class="btn ghost small hint-btn">Hint</button>');
    hint.classList.add('gated'); hint.dataset.frac = '0.5';
    hint.addEventListener('click', gated(cardEl, 0.5, hint, () => {
      const shown = h('<div class="hint-box"><b>Hint</b> </div>');
      shown.appendChild(renderContent(data.hintHtml, { base: 'text', dollar: true }));
      hint.replaceWith(shown);
      requestAnimationFrame(() => cardEl._checkOverflow?.());
    }));
    box.appendChild(hint);
  }
  if (!data.answer) {
    box.appendChild(h(`<p class="hint">${data.isProof ? 'Proof problem — work it out, then tap <b>Solution</b>.' : data.solutionHtml ? 'Work it out, then tap <b>Solution</b>.' : 'Work it out!'}</p>`));
    return box;
  }
  if (data.answer.type === 'reveal') {
    const btn = h('<button class="btn ghost reveal gated" data-frac="1">Show answer</button>');
    btn.addEventListener('click', gated(cardEl, 1, btn, () => {
      const ans = h('<div class="feedback revealed">Answer: </div>');
      ans.appendChild(renderContent(`<span>$${escapeHTML(data.answer.value)}$</span>`, { base: 'text', dollar: true }));
      btn.replaceWith(ans);
      requestAnimationFrame(() => cardEl._checkOverflow?.());
      if (focusLock?.el === cardEl) endFocus('answered');
    }));
    box.appendChild(btn);
    return box;
  }
  const finish = (ok) => {
    if (focusLock?.el === cardEl) setTimeout(() => endFocus('answered'), 0);
    updateRating(data, ok);
    state.stats.answered++;
    const d = dayRec();
    d.answered++;
    if (ok) {
      state.stats.correct++;
      state.stats.streak++;
      state.stats.best = Math.max(state.stats.best, state.stats.streak);
      d.solved++;
      engage(data.source, 2);
      const { xp, mult } = solveXp(data, state.stats.streak);
      const crit = Math.random() < 0.12; // a lucky solve now and then
      const earned = (xp + (d.solved === 1 ? 10 : 0)) * (crit ? 2 : 1);
      gainXp(earned, box);
      sound(crit ? 'crit' : 'correct');
      if (crit) { box.classList.add('crit'); setTimeout(() => toast(`Critical solve! 2× XP (+${earned})`), 300); }
      else if (mult > 1) setTimeout(() => toast(`${state.stats.streak} in a row — ×${mult} XP combo!`), 400);
      session.solved++;
      chestProgress();
      document.body.classList.toggle('on-fire', state.stats.streak >= 5);
      questEvent('solve');
      questEvent('combo', 0, state.stats.streak);
      if ((data.difficulty ?? 0) > 4.5) questEvent('hard');
    } else {
      state.stats.streak = 0;
      engage(data.source, 1);
      gainXp(2);
      sound('wrong');
      document.body.classList.remove('on-fire');
    }
    if (data.daily && !d.dailyDone) {
      d.dailyDone = true;
      if (ok) {
        const y = new Date(); y.setDate(y.getDate() - 1);
        const yd = state.days[y.toLocaleDateString('en-CA')];
        state.stats.dailyStreak = yd?.dailySolved ? (state.stats.dailyStreak || 0) + 1 : 1;
        state.stats.dailyBest = Math.max(state.stats.dailyBest || 0, state.stats.dailyStreak);
        state.stats.dailySolved = (state.stats.dailySolved || 0) + 1;
        d.dailySolved = true;
        gainXp(50);
        questEvent('daily');
      } else {
        state.stats.dailyStreak = 0;
      }
      state.pins = state.pins.filter((p) => !p.daily);
      cloud.submitDaily(today(), ok).catch(() => {});
    }
    if (ok) state.stats.charges = Math.min(99, (state.stats.charges || 0) + 1); // ⚡ for the mini-games
    saveStats();
    updateStreak(ok);
    checkBadges();
    if (data.daily) setTimeout(() => toast(ok ? `Daily challenge solved! Daily streak: ${state.stats.dailyStreak}` : 'Daily challenge done — new one tomorrow'), 600);
    else if (ok && d.solved === state.settings.dailyGoal) setTimeout(() => toast(`Daily goal reached — ${d.solved} solved today!`), 700);
    cardEl.classList.add(ok ? 'solved' : 'missed');
    const fb = h(`<div class="feedback ${ok ? 'ok' : 'no'}"><span class="fb-icon">${ok ? '✓' : '✕'}</span><div class="fb-text">${ok ? `${pickPraise()} <span class="charge-earned">+1 ⚡</span>` : `Not quite — the answer is <b>${escapeHTML(data.answer.value)}</b>${data.answer.labels ? `: ${escapeHTML(data.answer.labels['ABCDE'.indexOf(data.answer.value)])}` : ''}.`}${data.solutionHtml ? ` <button class="link">${data.source === 'spark' ? 'Why?' : 'See solution'}</button>` : ''}</div></div>`);
    fb.querySelector('.link')?.addEventListener('click', () => openSolution(data));
    if (!ok && data.answer.type === 'expr') { const b = fb.querySelector('b'); b.textContent = ''; b.appendChild(renderContent(`<span>$${escapeHTML(data.answer.value)}$</span>`, { base: 'text', dollar: true })); }
    if (data.explain) { const ex = h('<div class="fb-explain"></div>'); ex.appendChild(renderContent(`<p>${escapeHTML(data.explain)}</p>`, { base: 'text', dollar: true })); fb.appendChild(ex); fb.querySelector('.link')?.remove(); }
    if (data.daily) {
      const brag = h('<button class="link brag">Share result</button>');
      brag.addEventListener('click', () => shareText(ok
        ? `I solved today's MathScroll daily challenge! Daily streak: ${state.stats.dailyStreak}. Can you?`
        : `Today's MathScroll daily challenge got me. Can you solve it?`));
      fb.append(' · ', brag);
    }
    box.appendChild(fb);
    if (ok) burst(box);
    requestAnimationFrame(() => cardEl._checkOverflow?.());
    onAnswered?.(ok);
  };

  if (data.answer.type === 'choice' && data.answer.labels) {
    const list = h('<div class="choice-list" role="group" aria-label="Your answer"></div>');
    data.answer.labels.forEach((lab, i) => {
      const L = 'ABCDE'[i];
      const b = h(`<button class="choice-row" data-l="${L}"><b>${L}</b><span></span></button>`);
      b.querySelector('span').appendChild(renderContent(`<span>${escapeHTML(lab)}</span>`, { base: 'text', dollar: true }));
      b.addEventListener('click', () => {
        list.querySelectorAll('button').forEach((x) => { x.disabled = true; if (x.dataset.l === data.answer.value) x.classList.add('right'); });
        if (L !== data.answer.value) b.classList.add('wrong');
        celebrate(b, L === data.answer.value, cardEl);
        finish(L === data.answer.value);
      });
      list.appendChild(b);
    });
    box.appendChild(list);
  } else if (data.answer.type === 'choice') {
    const row = h('<div class="choices" role="group" aria-label="Your answer"></div>');
    for (const L of ['A', 'B', 'C', 'D', 'E']) {
      const b = h(`<button class="choice">${L}</button>`);
      b.addEventListener('click', () => {
        row.querySelectorAll('button').forEach((x) => { x.disabled = true; if (x.textContent === data.answer.value) x.classList.add('right'); });
        if (L !== data.answer.value) b.classList.add('wrong');
        celebrate(b, L === data.answer.value, cardEl);
        finish(L === data.answer.value);
      });
      row.appendChild(b);
    }
    box.appendChild(row);
  } else if (data.answer.type === 'expr') {
    const form = h(`<form class="numeric expr"><input inputmode="text" maxlength="60" placeholder="e.g. 3/4, 2sqrt(3), pi/6" aria-label="Your answer" autocomplete="off" autocapitalize="off" spellcheck="false"><button class="btn" type="submit">Check</button></form>`);
    const preview = h('<p class="expr-preview small"></p>');
    const input = form.querySelector('input');
    input.addEventListener('input', () => { const v = exprValue(input.value); preview.textContent = input.value.trim() ? (Number.isFinite(v) ? `≈ ${+v.toPrecision(8)}` : 'Type a number or expression') : ''; });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = exprValue(input.value);
      if (!Number.isFinite(v)) { input.classList.add('shake'); setTimeout(() => input.classList.remove('shake'), 400); preview.textContent = 'Couldn’t read that — try something like 3/4 or 2sqrt(3)'; return; }
      input.blur(); input.disabled = true; form.querySelector('button').disabled = true;
      const ok = sameValue(v, data.answer.num ?? exprValue(data.answer.value));
      input.classList.add(ok ? 'right' : 'wrong');
      finish(ok);
    });
    box.append(form, preview);
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
    s.innerHTML = `${state.stats.streak >= 5 ? '🔥 ' : ''}<b>${state.stats.streak}</b> in a row${state.stats.streak >= 3 ? ` · ×${state.stats.streak >= 10 ? 2.5 : state.stats.streak >= 5 ? 2 : 1.5} XP` : ''}`;
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

const GUEST_SAVES = 20;
function toggleList(key, data, btn) {
  const i = state[key].findIndex((s) => s.id === data.id);
  const on = i < 0;
  if (on && key === 'saved' && state.saved.length >= GUEST_SAVES && needsAccount()) { requireAccount(`Saving more than ${GUEST_SAVES} cards`); return; }
  if (on) state[key].unshift({ ...data, savedAt: Date.now() }); else state[key].splice(i, 1);
  if (state[key].length > 150) state[key].length = 150;
  saveList(key);
  if (on) engage(data.source, key === 'liked' ? 3 : 2); else engage(data.source, key === 'liked' ? -3 : -2);
  if (on && key === 'liked') questEvent('like');
  if (key === 'saved') toast(on ? 'Saved' : 'Removed from saved');
  if (on) checkBadges();
  const cls = key === 'liked' ? '.like' : '.save';
  document.querySelectorAll(`.card[data-id="${CSS.escape(data.id)}"] ${cls}`).forEach((b) => { b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  if (on && btn) { btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop'); }
}

async function shareText(text) {
  try {
    if (navigator.share) { await navigator.share({ title: 'MathScroll', text, url: PUBLIC_URL }); return; }
  } catch (e) { if (e.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(`${text} ${PUBLIC_URL}`); toast('Copied — paste it anywhere'); } catch { toast('Couldn’t copy'); }
}

async function share(data) {
  let url = data.url;
  let text = `${data.heading} — via MathScroll`;
  if (data.cloudId) {
    url = `${PUBLIC_URL}#post=${data.cloudId}`;
    text = `${data.heading} — by ${data.author} on MathScroll`;
  } else if (data.source === 'post') {
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
      const dwell = Date.now() - currentSince;
      if (prev && dwell < 1200) engage(prev.data.source, -0.3);
      if (focusLock && focusLock.el !== e.target) endFocus('reset');
      currentEl = e.target;
      currentSince = Date.now();
      e.target.classList.remove('enter'); void e.target.offsetWidth; e.target.classList.add('enter');
      e.target._checkOverflow?.();
      const c = state.cards.find((x) => x.el === e.target);
      if (c) { markSeen(c.data.id); guestSeen(); }
      onCardShown(e.target, c?.data, prev?.data, dwell);
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
  if (focusLock && ['ArrowDown', 'j', ' ', 'PageDown', 'ArrowUp', 'k', 'PageUp'].includes(e.key)) { e.preventDefault(); toast('Focus problem — stay with it a few more seconds'); return; }
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
  if (typeof setNav === 'function') setNav('home');
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
  if (data.source === 'proofwiki') questEvent('proof');
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
  card._firstSeen = Date.now();
  openSheet(title || data.heading, card, 'tall');
  card._checkOverflow?.();
  markSeen(data.id);
}

// ------------------------------------------------------------------ account sync
// Signed-in people keep their stats, saves, likes, badges and private posts on the server.
const SYNC_KEYS = new Set(['saved', 'liked', 'posts', 'stats', 'days', 'badges', 'profile', 'cosmetics']);
let syncTimer = null;
let syncing = false;
function onStoreChange(key) {
  if (!SYNC_KEYS.has(key) || syncing || !cloud.cloudEnabled || !cloud.currentUser()) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(pushSync, 4000);
}
function localData() {
  return { v: 1, saved: state.saved, liked: state.liked, posts: state.posts, stats: state.stats, days: state.days, badges: state.badges, profile: state.profile, cosmetics: state.cosmetics };
}
async function pushSync() {
  if (!cloud.currentUser()) return;
  try { await cloud.saveUserData(localData()); state.lastSync = Date.now(); } catch (e) { console.warn('[MathScroll] sync failed:', e.message); }
}
const byNewest = (a, b) => (b.savedAt || b.d || 0) - (a.savedAt || a.d || 0);
function unionById(a = [], b = []) {
  const seen = new Map();
  [...a, ...b].forEach((x) => { if (x && x.id && !seen.has(x.id)) seen.set(x.id, x); });
  return [...seen.values()].sort(byNewest).slice(0, 150);
}
function mergeData(server) {
  if (!server || typeof server !== 'object') return;
  syncing = true;
  try {
    state.saved = unionById(state.saved, server.saved); saveList('saved');
    state.liked = unionById(state.liked, server.liked); saveList('liked');
    state.posts = unionById(state.posts, server.posts); saveList('posts');
    const a = state.stats; const b = server.stats || {};
    const merged = { ...a };
    for (const k of ['answered', 'correct', 'best', 'sprintBest', 'dailySolved', 'dailyBest', 'dailyStreak', 'seqTried', 'seqRight', 'xp', 'focusDone', 'thinkTotal']) merged[k] = Math.max(a[k] || 0, b[k] || 0);
    if (a.weekOf === b.weekOf) merged.weekXp = Math.max(a.weekXp || 0, b.weekXp || 0); else if ((b.weekOf || '') > (a.weekOf || '')) { merged.weekOf = b.weekOf; merged.weekXp = b.weekXp; }
    if ((b.answered || 0) > (a.answered || 0)) {
      // The other device has more history: take its rating and skill breakdowns.
      Object.assign(merged, { rating: b.rating ?? a.rating, ratingHistory: b.ratingHistory || a.ratingHistory, byBand: b.byBand || a.byBand, byTopic: b.byTopic || a.byTopic });
    }
    state.stats = merged; store.set('stats', state.stats);
    for (const [d, rec] of Object.entries(server.days || {})) {
      const mine = state.days[d] || {};
      state.days[d] = { ...mine, ...rec, seen: Math.max(mine.seen || 0, rec.seen || 0), answered: Math.max(mine.answered || 0, rec.answered || 0), solved: Math.max(mine.solved || 0, rec.solved || 0), dailyDone: mine.dailyDone || rec.dailyDone, dailySolved: mine.dailySolved || rec.dailySolved };
    }
    store.set('days', state.days);
    for (const [id, date] of Object.entries(server.badges || {})) if (!state.badges[id] || date < state.badges[id]) state.badges[id] = date;
    store.set('badges', state.badges);
    if (server.cosmetics?.owned) { state.cosmetics.owned = [...new Set([...state.cosmetics.owned, ...server.cosmetics.owned])]; state.cosmetics.frame ||= server.cosmetics.frame; store.set('cosmetics', state.cosmetics); }
    for (const k of ['chests', 'freezes']) state.stats[k] = Math.max(state.stats[k] || 0, (server.stats || {})[k] || 0);
    store.set('stats', state.stats);
    if (server.profile?.name && state.profile.name === 'Mathlete') { state.profile.name = server.profile.name; store.set('profile', state.profile); }
  } finally { syncing = false; }
  updateStreak();
}
async function pullSync() {
  if (!cloud.currentUser()) return;
  try {
    const row = await cloud.loadUserData();
    if (row?.data) mergeData(row.data);
    await pushSync();
    // XP earned before signing in counts too (within the server's daily limit).
    const server = await cloud.myXp().catch(() => null);
    const diff = (state.stats.xp || 0) - (server?.total || 0);
    if (diff > 0) { pendingXp += Math.min(diff, 4000); flushXp(); }
    renderLevel();
  } catch (e) { console.warn('[MathScroll] sync failed:', e.message); }
}

// ------------------------------------------------------------------ community: likes, comments, accounts
async function toggleCloudLike(data, btn) {
  if (!cloud.currentUser()) { openAuth('Sign in to like posts'); return; }
  const on = !btn.classList.contains('on');
  const label = btn.querySelector('span');
  data.likeCount = Math.max(0, data.likeCount + (on ? 1 : -1));
  document.querySelectorAll(`.card[data-id="${CSS.escape(data.id)}"] .like`).forEach((b) => { b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); b.querySelector('span').textContent = data.likeCount; });
  if (on) { btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop'); }
  // Keep a local copy too, so it shows under Liked in your profile.
  const i = state.liked.findIndex((x) => x.id === data.id);
  if (on && i < 0) state.liked.unshift({ ...data }); else if (!on && i >= 0) state.liked.splice(i, 1);
  saveList('liked');
  if (on) questEvent('like');
  try { await cloud.setLike(data.cloudId, on); } catch (e) {
    data.likeCount = Math.max(0, data.likeCount + (on ? -1 : 1));
    document.querySelectorAll(`.card[data-id="${CSS.escape(data.id)}"] .like`).forEach((b) => { b.classList.toggle('on', !on); b.querySelector('span').textContent = data.likeCount; });
    toast(e.message);
  }
  if (label) label.textContent = data.likeCount;
}

function openComments(data) {
  const body = document.createElement('div');
  body.className = 'comments-sheet';
  const me = cloud.currentUser();
  body.innerHTML = `<div class="comment-list"><p class="small">Loading comments…</p></div>
    ${me ? `<form class="comment-form"><textarea class="field" rows="2" maxlength="1000" placeholder="Add a comment (maths in $…$ works)"></textarea><button class="btn" type="submit">Post</button></form>`
    : '<button class="btn wide sign-in">Sign in to comment</button>'}
    <button class="link report-post">${ICONS.flag} Report this post</button>`;
  const list = $('.comment-list', body);
  const render = (rows) => {
    list.innerHTML = rows.length ? '' : '<p class="small">No comments yet. Start the discussion!</p>';
    for (const c of rows) {
      const name = c.profiles?.username ? `@${c.profiles.username}` : 'someone';
      const item = h(`<div class="comment"><div class="c-head"><b>${escapeHTML(name)}</b><small>${timeAgo(Date.parse(c.created_at))}</small>
        ${me && me.id === c.user_id ? `<button class="icon-btn mini del" aria-label="Delete comment">${ICONS.trash}</button>` : ''}</div></div>`);
      item.appendChild(renderContent(textToHtml(c.body), { base: 'text' }));
      item.querySelector('.del')?.addEventListener('click', async () => {
        try { await cloud.deleteComment(c.id); item.remove(); data.commentCount = Math.max(0, data.commentCount - 1); updateCount(); } catch (e) { toast(e.message); }
      });
      list.appendChild(item);
    }
  };
  const updateCount = () => document.querySelectorAll(`.card[data-id="${CSS.escape(data.id)}"] .comments span`).forEach((x) => { x.textContent = data.commentCount; });
  cloud.listComments(data.cloudId).then(render).catch((e) => { list.innerHTML = `<p class="small">${escapeHTML(e.message)}</p>`; });
  $('.sign-in', body)?.addEventListener('click', () => openAuth('Sign in to comment'));
  const form = $('.comment-form', body);
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const ta = form.querySelector('textarea');
    const text = ta.value.trim();
    if (!text) return;
    form.querySelector('button').disabled = true;
    try {
      await cloud.addComment(data.cloudId, text);
      ta.value = '';
      data.commentCount++; updateCount();
      render(await cloud.listComments(data.cloudId));
      list.lastElementChild?.scrollIntoView({ block: 'nearest' });
    } catch (err) { toast(err.message); }
    form.querySelector('button').disabled = false;
  });
  const rep = $('.report-post', body);
  rep.addEventListener('click', async () => {
    if (!cloud.currentUser()) { openAuth('Sign in to report'); return; }
    if (!rep.classList.contains('confirm')) { rep.classList.add('confirm'); rep.lastChild.textContent = ' Tap again to report'; return; }
    try { await cloud.report({ postId: data.cloudId, reason: 'Reported from app' }); toast('Thanks — reported'); rep.remove(); } catch (e) { toast(e.message); }
  });
  openSheet(`Comments · ${data.heading}`, body, 'tall');
}

function openAuth(reason = '', mode = 'signin', prefillEmail = '') {
  const body = document.createElement('div');
  body.className = 'auth';
  body.innerHTML = `
    ${reason ? `<p class="auth-reason">${escapeHTML(reason)}</p>` : ''}
    <div class="segmented auth-tabs"><button data-m="signin">Sign in</button><button data-m="signup">Create account</button></div>
    <form class="auth-form">
      <input class="field username" name="username" autocomplete="username" placeholder="Username (3–20 letters, numbers, _)" maxlength="20">
      <input class="field email" type="email" name="email" autocomplete="email" placeholder="Email" required value="${escapeHTML(prefillEmail)}">
      <input class="field password" type="password" name="password" autocomplete="current-password" placeholder="Password (6+ characters)" minlength="6" required>
      <p class="auth-error" hidden></p>
      <button class="btn ghost small resend" type="button" hidden>Resend confirmation email</button>
      <button class="btn wide submit" type="submit"></button>
      <button class="link forgot" type="button">Forgot password?</button>
    </form>
    <p class="small">Your account is kept on the server, with your stats, saves and posts, so you can sign in on any device. Your username is shown on posts and comments; your email is never shown.</p>`;
  const $$ = (sel) => $(sel, body);
  const showMsg = (text, ok = false) => { const e = $$('.auth-error'); e.hidden = false; e.classList.toggle('ok', ok); e.textContent = text; };
  const setMode = (m) => {
    mode = m;
    body.querySelectorAll('.auth-tabs button').forEach((b) => b.setAttribute('aria-checked', b.dataset.m === m));
    $$('.username').hidden = m !== 'signup';
    $$('.username').required = m === 'signup';
    $$('.password').autocomplete = m === 'signup' ? 'new-password' : 'current-password';
    $$('.submit').textContent = m === 'signup' ? 'Create account' : 'Sign in';
    $$('.forgot').hidden = m !== 'signin';
    $$('.auth-error').hidden = true;
    $$('.resend').hidden = true;
  };
  // Resend with a cooldown so people don't hit Supabase's email limit.
  const resend = $$('.resend');
  const cooldown = (btn, secs, label) => {
    btn.disabled = true;
    const tick = () => { if (secs <= 0) { btn.disabled = false; btn.textContent = label; return; } btn.textContent = `${label} (${secs--}s)`; setTimeout(tick, 1000); };
    tick();
  };
  resend.addEventListener('click', async () => {
    const email = $$('.email').value.trim();
    if (!email) { showMsg('Type your email first.'); return; }
    try { await cloud.resendConfirmation(email); showMsg(`Sent again to ${email}. Check your inbox and spam folder.`, true); cooldown(resend, 60, 'Resend confirmation email'); } catch (e) { showMsg(e.message); }
  });
  $$('.forgot').addEventListener('click', async () => {
    const email = $$('.email').value.trim();
    if (!email) { showMsg('Type your email above, then tap “Forgot password?” again.'); $$('.email').focus(); return; }
    try { await cloud.requestPasswordReset(email); showMsg(`If there’s an account for ${email}, a link to set a new password is on its way.`, true); } catch (e) { showMsg(e.message); }
  });
  body.querySelectorAll('.auth-tabs button').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.m)));
  $$('.auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = $$('.submit');
    const email = $$('.email').value.trim(); const password = $$('.password').value; const username = $$('.username').value.trim();
    btn.disabled = true; $$('.auth-error').hidden = true;
    try {
      if (mode === 'signup') {
        const r = await cloud.signUp({ email, password, username });
        if (r.needsConfirm) { btn.disabled = false; showCheckEmail(email); return; }
      } else {
        await cloud.signIn({ email, password });
      }
      const u = cloud.currentUser();
      toast(`Signed in as @${u?.username || 'you'}`);
      closeSheet();
      renderTabs();
      pullSync();
    } catch (ex) {
      showMsg(ex.message);
      if (/confirm your email/i.test(ex.message)) resend.hidden = false;
    }
    btn.disabled = false;
  });
  // After sign-up: tell them to confirm, with a resend button.
  const showCheckEmail = (email) => {
    body.innerHTML = `<div class="check-email">
      <div class="envelope">✉</div>
      <h3>Check your email</h3>
      <p>We sent a confirmation link to <b>${escapeHTML(email)}</b>. Tap it to finish creating your account — it signs you in automatically.</p>
      <p class="small">Can’t find it? Look in spam or promotions. Using the iPhone app? The link opens in Safari; once it says you’re confirmed, come back here and sign in.</p>
      <button class="btn ghost wide resend2">Resend email</button>
      <button class="btn wide go-signin">I’ve confirmed — sign in</button>
      <p class="auth-error" hidden></p></div>`;
    const r2 = $$('.resend2');
    cooldown(r2, 60, 'Resend email');
    r2.addEventListener('click', async () => {
      try { await cloud.resendConfirmation(email); toast('Sent again'); cooldown(r2, 60, 'Resend email'); } catch (err) { showMsg(err.message); }
    });
    $$('.go-signin').addEventListener('click', () => openAuth('', 'signin', email));
    $('#sheetTitle').textContent = 'Confirm your email';
  };
  setMode(mode);
  openSheet(mode === 'signup' ? 'Create account' : 'Sign in', body);
}

// After opening a password-reset link.
function openNewPassword() {
  const body = document.createElement('div');
  body.className = 'auth';
  body.innerHTML = `<p class="auth-reason">Choose a new password for @${escapeHTML(cloud.currentUser()?.username || '')}.</p>
    <form class="auth-form"><input class="field p1" type="password" autocomplete="new-password" placeholder="New password (6+ characters)" minlength="6" required>
    <input class="field p2" type="password" autocomplete="new-password" placeholder="Type it again" minlength="6" required>
    <p class="auth-error" hidden></p><button class="btn wide" type="submit">Save new password</button></form>`;
  $('form', body).addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = $('.auth-error', body);
    const a = $('.p1', body).value; const b = $('.p2', body).value;
    if (a !== b) { err.hidden = false; err.textContent = 'Those don’t match.'; return; }
    try { await cloud.updatePassword(a); toast('Password updated'); closeSheet(); } catch (ex) { err.hidden = false; err.textContent = ex.message; }
  });
  openSheet('New password', body);
}

// ------------------------------------------------------------------ profile
let profileTab = 'saved';
function openProfile() {
  const s = state.stats;
  const p = state.profile;
  const body = document.createElement('div');
  body.className = 'profile';
  const initial = (p.name.trim()[0] || '∑').toUpperCase();
  const fb = frameBg();
  const head = h(`<div class="profile-head">
      <div class="avatar-wrap${fb ? ' framed' : ''}" style="${fb ? `--frame:${fb}` : ''}"><div class="avatar">${escapeHTML(initial)}</div></div>
      <div class="who">
        <input class="name-input" value="${escapeHTML(p.name)}" maxlength="30" aria-label="Your name">
        <small>Level ${levelFor(state.stats.xp || 0)} · ${titleFor(levelFor(state.stats.xp || 0))} · ${state.stats.xp || 0} XP</small>
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
  if (cloud.cloudEnabled) {
    const u = cloud.currentUser();
    const acct = h(u
      ? `<div class="account"><span>Signed in as <b>@${escapeHTML(u.username || '')}</b><small class="sync-note">Stats, saves and posts are backed up to your account${state.lastSync ? ' · synced' : ''}</small></span><button class="btn ghost small sign-out">Sign out</button></div>`
      : `<div class="account"><span>Sign in to post publicly, like and comment.</span><button class="btn small sign-in">Sign in</button></div>`);
    acct.querySelector('.sign-out')?.addEventListener('click', async () => { clearTimeout(syncTimer); await pushSync(); await cloud.signOut(); toast('Signed out'); openProfile(); renderTabs(); });
    acct.querySelector('.sign-in')?.addEventListener('click', () => openAuth());
    body.appendChild(acct);
    if (u) {
      nameInput.value = u.displayName || u.username || state.profile.name;
      $('.avatar', head).textContent = (nameInput.value.trim()[0] || '∑').toUpperCase();
      nameInput.addEventListener('change', () => cloud.updateDisplayName(nameInput.value.trim()).catch((e) => toast(e.message)));
    }
  }

  body.appendChild(h(`<div class="stats">
    <div><b>${s.correct}</b><span>solved</span></div>
    <div><b>${s.answered ? Math.round((100 * s.correct) / s.answered) : 0}%</b><span>accuracy</span></div>
    <div><b>${s.best}</b><span>best run</span></div>
    <div><b>${dayStreak()}</b><span>day streak</span></div>
  </div>`));

  body.appendChild(h(skillsSection()));

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
      <div class="goal-top"><b>Today</b><span>${t.solved} / ${goal} solved · ${Math.round((t.think || 0) / 60)} min thinking</span></div>
      <div class="bar"><span style="width:${pct}%"></span></div>
      <div class="week">${week.join('')}</div>
    </div>`));

  const sprintBtn = h(`<button class="btn wide sprint-start">Start a 10-problem sprint${state.stats.sprintBest ? ` · best ${state.stats.sprintBest}/10` : ''}</button>`);
  sprintBtn.addEventListener('click', openSprint);
  body.appendChild(sprintBtn);
  const owned = state.cosmetics.owned;
  const coll = h(`<details class="badges collection"><summary><b>Avatar frames</b><span>${owned.length} / ${COSMETICS.length}</span></summary><div class="frame-grid">${
    COSMETICS.map((c) => `<button class="frame-item ${owned.includes(c.id) ? 'owned' : ''} ${state.cosmetics.frame === c.id ? 'on' : ''}" data-id="${c.id}" ${owned.includes(c.id) ? '' : 'disabled'}><i class="frame-swatch" style="background:${c.bg}"></i><small>${owned.includes(c.id) ? c.name : c.level ? `Level ${c.level}` : c.rare ? 'Rare chest' : 'Chest'}</small></button>`).join('')
  }</div><p class="small">Get frames from chests (one every ${CHEST_EVERY} solves and every level-up) and by levelling up.</p></details>`);
  coll.querySelectorAll('.frame-item.owned').forEach((b) => b.addEventListener('click', () => {
    state.cosmetics.frame = state.cosmetics.frame === b.dataset.id ? null : b.dataset.id; saveCosmetics(); openProfile();
  }));
  body.appendChild(coll);
  const earned = BADGES.filter((b) => state.badges[b.id]).length;
  body.appendChild(h(`<details class="badges"><summary><b>Badges</b><span>${earned} / ${BADGES.length}</span></summary><div class="badge-grid">${
    BADGES.map((b) => `<div class="badge ${state.badges[b.id] ? 'earned' : ''}"><span class="medal">${state.badges[b.id] ? '★' : '☆'}</span><b>${escapeHTML(b.name)}</b><small>${escapeHTML(b.desc)}</small></div>`).join('')
  }</div></details>`));
  if ((state.stats.dailyStreak || 0) > 0) body.querySelector('.goal-top span').textContent += ` · daily streak ${state.stats.dailyStreak}`;

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
      const me = cloud.currentUser();
      if (me) {
        const pub = h('<div class="public-posts"><p class="small">Loading your public posts…</p></div>');
        list.appendChild(pub);
        cloud.listPosts({ userId: me.id, limit: 50 }).then((rows) => {
          pub.innerHTML = rows.length ? '<h4 class="list-h">Public</h4>' : '';
          const ulp = h('<ul class="saved-list"></ul>');
          for (const row of rows) {
            const card = cloudCard(row);
            const li = h(`<li class="s-post"><button class="saved-item"><span class="pill">${escapeHTML(card.kind)}</span><span class="t">${escapeHTML(card.heading)}</span><small>♥ ${card.likeCount} · 💬 ${card.commentCount}</small></button>
              <button class="icon-btn mini share-post" aria-label="Share">${ICONS.share}</button>
              <button class="icon-btn mini del-post" aria-label="Delete">${ICONS.trash}</button></li>`);
            $('.saved-item', li).addEventListener('click', () => openCard(card));
            $('.share-post', li).addEventListener('click', () => share(card));
            const del = $('.del-post', li);
            del.addEventListener('click', async () => {
              if (!del.classList.contains('confirm')) { del.classList.add('confirm'); toast('Tap the bin again to delete'); setTimeout(() => del.classList.remove('confirm'), 2500); return; }
              try { await cloud.deletePost(row.id); li.remove(); toast('Deleted'); } catch (e) { toast(e.message); }
            });
            ulp.appendChild(li);
          }
          pub.appendChild(ulp);
          if (state.posts.length) pub.appendChild(h('<h4 class="list-h">On this device</h4>'));
        }).catch((e) => { pub.innerHTML = `<p class="small">${escapeHTML(e.message)}</p>`; });
      }
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
  if (requireAccount('Posting')) return;
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
    <div class="compose-extra">
      <select class="select topic"><option value="">Topic (optional)</option>${PROBLEM_TOPICS.map((t) => `<option ${draft.topic === t ? 'selected' : ''}>${t}</option>`).join('')}</select>
      <label class="diff-pick">Difficulty <input type="range" min="0" max="10" step="0.5" class="cdiff" value="${draft.difficulty || 0}"><b class="cdiff-v">${draft.difficulty ? draft.difficulty : '–'}</b></label>
    </div>
    ${cloud.cloudEnabled ? `<div class="group publish-row">${cloud.currentUser()
      ? `<label class="row"><span><b>Post publicly</b><small>As @${escapeHTML(cloud.currentUser().username || '')} — everyone sees it in Community</small></span><input type="checkbox" class="switch public" checked></label>`
      : '<div class="row"><span><b>Want everyone to see it?</b><small>Sign in to post to Community. Otherwise it stays on this device.</small></span><button class="btn small sign-in" type="button">Sign in</button></div>'}</div>` : ''}
    <p class="small preview-label">Preview</p>
    <div class="preview content"></div>
    <button class="btn wide post-btn">Post${cloud.currentUser() ? '' : ' & share'}</button>
    <p class="small">${cloud.currentUser() ? 'Public posts appear in Community for everyone. Private posts stay on this device and can be shared as a link.' : 'Posts are saved on this device. Sharing sends a link with the whole post inside it, so anyone can open it — no account needed.'}</p>`;
  let kind = draft.k;
  const title = $('.title', body); const text = $('.body', body); const answer = $('.answer', body); const solution = $('.solution', body);
  const preview = $('.preview', body);
  let lastFocus = text;
  [text, solution, title, answer].forEach((f) => f.addEventListener('focus', () => { lastFocus = f; }));
  const topicSel = $('.topic', body); const cdiff = $('.cdiff', body);
  cdiff.addEventListener('input', () => { $('.cdiff-v', body).textContent = Number(cdiff.value) ? cdiff.value : '–'; update(); });
  topicSel.addEventListener('change', () => update());
  $('.sign-in', body)?.addEventListener('click', () => openAuth('Sign in to post publicly'));
  const current = () => ({ k: kind, t: title.value.trim(), b: text.value.trim(), a: kind === 'problem' ? answer.value.trim() : '', s: solution.value.trim(), topic: topicSel.value, difficulty: Number(cdiff.value) || null });
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
    const pubBox = $('.public', body);
    const btn = $('.post-btn', body);
    if (pubBox?.checked && cloud.currentUser()) {
      btn.disabled = true; btn.textContent = 'Posting…';
      try {
        const row = await cloud.createPost({ ...d, difficulty: d.difficulty && d.difficulty >= 1 ? d.difficulty : null });
        store.set(DRAFT_KEY, { k: kind, t: '', b: '', a: '', s: '' });
        state.posts.unshift({ ...d, n: `@${cloud.currentUser().username}`, d: Date.now(), id: `c${row.id}`, cloudId: row.id });
        saveList('posts'); checkBadges();
        const card = cloudCard({ ...row, profiles: { username: cloud.currentUser().username } });
        openCard(card, 'Your post');
        toast('Posted to Community');
        gainXp(20);
        community.recent = null;
        return;
      } catch (e) {
        btn.disabled = false; btn.textContent = 'Post & share';
        toast(e.message);
        return;
      }
    }
    const post = { ...d, n: state.profile.name, d: Date.now(), id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}` };
    state.posts.unshift(post);
    saveList('posts');
    checkBadges();
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

// ------------------------------------------------------------------ sprint
// Ten answerable AMC/AIME problems against the clock.
const SPRINT_LEN = 10;
async function answerableProblem() {
  for (let i = 0; i < 8; i++) {
    try {
      const c = await SOURCES.contest.fetch(fetchSettings());
      if (c.answer && (c.answer.type === 'choice' || c.answer.type === 'numeric')) return c;
    } catch { /* try again */ }
  }
  throw new Error('no problems');
}
// How hard the problems you solve to earn ⚡ are (Games → change).
const GAME_LEVELS = {
  easy: { name: 'Easy', desc: 'MATH levels 1–2: quick warm-ups', levels: [1, 2] },
  medium: { name: 'Medium', desc: 'MATH levels 3–4: a minute or two each', levels: [3, 4] },
  hard: { name: 'Hard', desc: 'MATH level 5 and AMC problems', levels: [5], contest: [3, 5.5] },
  expert: { name: 'Expert', desc: 'Hard AMC/AIME and olympiad problems', contest: [5, 8], oly: { lo: 4, hi: 6.5 } },
};
function pickGameLevel(done) {
  const cur = state.settings.gameLevel || 'medium';
  const body = h(`<div class="chess-pick"><p>How hard should the problems be that earn ⚡ for games?</p>${Object.entries(GAME_LEVELS).map(([k, v]) => `<button class="game-tile ${k === cur ? 'on' : ''}" data-k="${k}"><span class="g-text"><b>${v.name}${k === cur ? ' ✓' : ''}</b><small>${v.desc}</small></span></button>`).join('')}</div>`);
  body.querySelectorAll('[data-k]').forEach((b) => b.addEventListener('click', () => { state.settings.gameLevel = b.dataset.k; saveSettings(); toast(`Game problems: ${GAME_LEVELS[b.dataset.k].name}`); done?.(); }));
  openSheet('Game problem difficulty', body, 'tall');
}
async function contestBetween([lo, hi]) {
  const fs = { ...fetchSettings(), filters: { ...(state.settings.filters || {}), dmin: lo, dmax: hi, matchLevel: false, checkable: true, qtype: 'any' } };
  for (let i = 0; i < 6; i++) {
    try { const c = await SOURCES.contest.fetch(fs); if (c.answer && ['choice', 'numeric', 'expr'].includes(c.answer.type)) return c; } catch { /* again */ }
  }
  throw new Error('no problems');
}
// A problem with a checkable answer for games, at the chosen difficulty.
async function quickProblem() {
  const L = GAME_LEVELS[state.settings.gameLevel || 'medium'];
  for (let i = 0; i < 3; i++) {
    try {
      if (L.levels && (!L.contest || Math.random() < 0.5)) return await mathProblem({ levels: L.levels });
      if (L.contest && Math.random() < 0.5) return await contestBetween(L.contest);
      if (L.oly) return await olympiadProblem(L.oly);
      if (L.contest) return await contestBetween(L.contest);
    } catch { /* try again */ }
  }
  return answerableProblem();
}
function openSprint() {
  if (requireAccount('Ranked sprints')) return;
  const body = document.createElement('div');
  body.className = 'sprint';
  body.innerHTML = `<div class="sprint-bar"><span class="sprint-count">1 / ${SPRINT_LEN}</span><span class="sprint-time">0:00</span><button class="btn ghost small skip">Skip</button></div>
    <div class="sprint-progress"><span></span></div><div class="sprint-stage"><p class="loader-msg">Getting problems ready…</p></div>`;
  const stage = $('.sprint-stage', body);
  const results = [];
  const start = Date.now();
  let alive = true;
  let next = answerableProblem();
  const fmt = (ms) => { const t = Math.floor(ms / 1000); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; };
  const timer = setInterval(() => { if (alive) $('.sprint-time', body).textContent = fmt(Date.now() - start); }, 500);
  const stop = () => { alive = false; clearInterval(timer); };
  const show = async () => {
    const i = results.length;
    $('.sprint-count', body).textContent = `${Math.min(i + 1, SPRINT_LEN)} / ${SPRINT_LEN}`;
    $('.sprint-progress span', body).style.width = `${(100 * i) / SPRINT_LEN}%`;
    if (i >= SPRINT_LEN) return finish();
    stage.innerHTML = '<p class="loader-msg">Loading…</p>';
    let card;
    try { card = await next; } catch { stage.innerHTML = '<p class="loader-msg">Couldn’t load problems. Check your connection.</p>'; return; }
    if (!alive) return;
    next = i + 1 < SPRINT_LEN ? answerableProblem() : null;
    let done = false;
    const el = buildCard(card, {
      standalone: true,
      onAnswered: (ok) => {
        if (done) return; done = true;
        results.push(ok ? 'right' : 'wrong');
        setTimeout(() => { if (alive) show(); }, ok ? 900 : 2200);
      },
    });
    el.querySelectorAll('.rail .sol, .rail .open, .hint-btn').forEach((x) => x.remove()); // no peeking mid-sprint
    stage.innerHTML = '';
    stage.appendChild(el);
    $('.skip', body).onclick = () => { if (done) return; done = true; results.push('skip'); show(); };
  };
  const finish = () => {
    stop();
    const right = results.filter((r) => r === 'right').length;
    const time = fmt(Date.now() - start);
    const best = state.stats.sprintBest || 0;
    const isBest = right > best || (right === best && right > 0 && (Date.now() - start) < (state.stats.sprintBestMs || Infinity));
    if (isBest) { state.stats.sprintBest = right; state.stats.sprintBestMs = Date.now() - start; saveStats(); }
    gainXp(right * 5 + (right === SPRINT_LEN ? 50 : 0));
    cloud.submitSprint(right, Date.now() - start).catch(() => {});
    $('.sprint-bar', body).hidden = true;
    stage.innerHTML = `<div class="sprint-done"><div class="score">${right}<small>/ ${SPRINT_LEN}</small></div>
      <p>${right >= 8 ? 'Outstanding.' : right >= 5 ? 'Nice work.' : 'Good practice — go again?'} Time ${time}.${isBest ? ' <b>New personal best!</b>' : ''}</p>
      <div class="dots">${results.map((r) => `<span class="${r}"></span>`).join('')}</div>
      <button class="btn wide again">Go again</button><button class="btn ghost wide brag">Share score</button></div>`;
    $('.again', stage).addEventListener('click', openSprint);
    $('.brag', stage).addEventListener('click', () => shareText(`I got ${right}/${SPRINT_LEN} on a MathScroll AMC/AIME sprint in ${time}. Beat that!`));
  };
  openSheet('Sprint', body, 'tall', stop);
  show();
}

// ------------------------------------------------------------------ filters
function activeFilterCount() {
  const f = filters(); const d = DEFAULT_FILTERS;
  let n = 0;
  if (f.matchLevel || f.dmin !== d.dmin || f.dmax !== d.dmax) n++;
  if (!f.unrated) n++;
  if (f.qtype !== 'any') n++;
  if (f.checkable) n++;
  if (!f.hideSeen) n++;
  if (f.oeisClassic) n++;
  if (f.wikiTopics.length !== d.wikiTopics.length) n++;
  if (state.settings.topics.length !== PROBLEM_TOPICS.length) n++;
  return n;
}
function openFilters() {
  const f = filters();
  const st = state.settings;
  let changed = false;
  const mark = () => { changed = true; saveSettings(); };
  const body = document.createElement('div');
  body.className = 'settings filters';
  body.innerHTML = `
    <h3>Difficulty</h3>
    <div class="group pad">
      <div class="range-row"><span>From</span><input type="range" min="1" max="10" step="0.5" class="dmin" value="${f.dmin}"><b class="dmin-v">${f.dmin}</b></div>
      <div class="range-row"><span>To</span><input type="range" min="1" max="10" step="0.5" class="dmax" value="${f.dmax}"><b class="dmax-v">${f.dmax}</b></div>
      <p class="small range-help"></p>
    </div>
    <div class="group">
      <label class="row"><span><b>Match my level</b><small>Picks problems around your skill rating (${state.stats.rating})</small></span><input type="checkbox" class="switch match" ${f.matchLevel ? 'checked' : ''}></label>
      <label class="row"><span><b>Include unrated problems</b><small>AMC/AIME, AoPS and olympiad problems have estimated difficulty</small></span><input type="checkbox" class="switch unrated" ${f.unrated ? 'checked' : ''}></label>
    </div>
    <h3>Answer type</h3>
    <div class="segmented qtype" role="radiogroup">
      ${[['any', 'Any'], ['mcq', 'A–E'], ['number', 'Answer'], ['proof', 'Proof']].map(([k, v]) => `<button role="radio" data-k="${k}" aria-checked="${f.qtype === k}">${v}</button>`).join('')}
    </div>
    <div class="group" style="margin-top:10px">
      <label class="row"><span><b>Only problems I can check</b><small>Multiple choice or a number answer</small></span><input type="checkbox" class="switch checkable" ${f.checkable ? 'checked' : ''}></label>
      <label class="row"><span><b>Skip cards I've seen</b></span><input type="checkbox" class="switch hideseen" ${f.hideSeen ? 'checked' : ''}></label>
    </div>
    <h3>Problem topics</h3>
    <div class="chips topics">${PROBLEM_TOPICS.map((t) => `<button class="chip ${st.topics.includes(t) ? 'on' : ''}" data-t="${t}">${t === 'Combinatorics' ? 'Combinatorics & graphs' : t}</button>`).join('')}</div>
    <h3>Concept topics (Wikipedia)</h3>
    <div class="chips wiki">${Object.entries(WIKI_GROUP_NAMES).map(([k, v]) => `<button class="chip ${f.wikiTopics.includes(k) ? 'on' : ''}" data-w="${k}">${v}</button>`).join('')}</div>
    <h3>Sources</h3>
    <div class="chips srcs">${Object.entries(SOURCES).map(([k, v]) => `<button class="chip ${st.sources[k] ? 'on' : ''}" data-s="${k}">${v.label}</button>`).join('')}</div>
    <div class="group" style="margin-top:10px">
      <label class="row"><span><b>Classic sequences only</b><small>The well-known OEIS sequences</small></span><input type="checkbox" class="switch classic" ${f.oeisClassic ? 'checked' : ''}></label>
    </div>
    <button class="btn ghost wide reset-f">Reset filters</button>`;
  const dmin = $('.dmin', body); const dmax = $('.dmax', body);
  const help = () => {
    const [lo, hi] = difficultyWindow({ ...st, rating: state.stats.rating });
    const name = (d) => bandOf(d).name.toLowerCase();
    $('.range-help', body).textContent = f.matchLevel
      ? `Matching your level: ${lo.toFixed(1)}–${hi.toFixed(1)} (${name(lo)} to ${name(hi)}).`
      : `${lo}–${hi}: ${name(lo)} to ${name(hi)}. AMC 10/12 ≈ 2–4, AIME ≈ 4–6, olympiads ≈ 6–10.`;
    dmin.disabled = dmax.disabled = f.matchLevel;
  };
  const onRange = (e) => {
    let a = Number(dmin.value); let b = Number(dmax.value);
    if (a > b) { if (e.target === dmin) b = a; else a = b; dmin.value = a; dmax.value = b; }
    f.dmin = a; f.dmax = b;
    $('.dmin-v', body).textContent = a; $('.dmax-v', body).textContent = b;
    help(); mark();
  };
  dmin.addEventListener('input', onRange); dmax.addEventListener('input', onRange);
  const bindSwitch = (cls, key) => $(cls, body).addEventListener('change', (e) => { f[key] = e.target.checked; help(); mark(); });
  bindSwitch('.match', 'matchLevel'); bindSwitch('.unrated', 'unrated'); bindSwitch('.checkable', 'checkable'); bindSwitch('.hideseen', 'hideSeen'); bindSwitch('.classic', 'oeisClassic');
  body.querySelectorAll('.qtype button').forEach((b) => b.addEventListener('click', () => {
    f.qtype = b.dataset.k; body.querySelectorAll('.qtype button').forEach((x) => x.setAttribute('aria-checked', x === b)); mark();
  }));
  const chipGroup = (sel, attr, get, set) => body.querySelectorAll(`${sel} .chip`).forEach((c) => c.addEventListener('click', () => {
    c.classList.toggle('on');
    const on = [...body.querySelectorAll(`${sel} .chip.on`)].map((x) => x.dataset[attr]);
    if (!on.length) { c.classList.add('on'); toast('Keep at least one'); return; }
    set(on); mark();
  }));
  chipGroup('.topics', 't', null, (on) => { st.topics = on; });
  chipGroup('.wiki', 'w', null, (on) => { f.wikiTopics = on; });
  chipGroup('.srcs', 's', null, (on) => { Object.keys(SOURCES).forEach((k) => { st.sources[k] = on.includes(k); }); state.failures = {}; });
  $('.reset-f', body).addEventListener('click', () => {
    state.settings.filters = { ...DEFAULT_FILTERS };
    st.topics = [...PROBLEM_TOPICS];
    Object.keys(SOURCES).forEach((k) => { st.sources[k] = true; });
    changed = true; saveSettings();
    openFilters();
  });
  help();
  const apply = () => {
    if (!changed) return;
    changed = false;
    if (state.tab !== 'mix' && !st.sources[state.tab]) state.tab = 'mix';
    state.failures = {};
    renderTabs(); resetFeed();
  };
  apply.onReplace = true;
  openSheet('Filters', body, '', apply);
}

// ------------------------------------------------------------------ mini-games
const BEST_LABEL = { g2048: (v) => `${v} pts`, lights: (v) => `Level ${v}`, hanoi: (v) => `${v} discs`, mastermind: (v) => `${11 - v} guesses`, nim: (v) => `Streak ${v}`, magic: (v) => `${v}×${v}`, blockblast: (v) => `${v} pts`, chess: (v) => (v > 100 ? `Rating ${v}` : 'Played'), sumblast: (v) => `${v} pts`, g24: (v) => `${v} solved`, queens: (v) => `${v}×${v}`, rush: (v) => `${v} correct` };
const gameCtx = {
  openSheet: (...a) => openSheet(...a), closeSheet: () => closeSheet(), toast: (m) => toast(m), sound: (k) => sound(k), shareText: (t) => shareText(t),
  bests: () => state.stats.games || {},
  campaign: () => (state.stats.camp ||= {}),
  saveCampaign: () => saveStats(),
  gainXp: (n) => gainXp(n),
  charges: () => (state.stats.charges ??= 3),
  spend(n) { if (gameCtx.charges() < n) return false; state.stats.charges -= n; saveStats(); return true; },
  refund(n) { state.stats.charges = gameCtx.charges() + n; saveStats(); },
  gameLevelName: () => GAME_LEVELS[state.settings.gameLevel || 'medium'].name,
  pickGameLevel: (done) => pickGameLevel(done),
  chessPuzzle: (r) => chessPuzzle(r),
  puzzleRating: () => (state.stats.puzzleRating ??= 800),
  puzzleResult(pr, solved) {
    const r = gameCtx.puzzleRating();
    const n = (state.stats.puzzles = (state.stats.puzzles || 0) + 1);
    const k = n < 10 ? 60 : n < 30 ? 36 : 20; // settle in fast, then steady
    const delta = Math.round(k * ((solved ? 1 : 0) - 1 / (1 + 10 ** ((pr - r) / 400))));
    state.stats.puzzleRating = Math.max(400, r + delta);
    if (solved) state.stats.puzzlesSolved = (state.stats.puzzlesSolved || 0) + 1;
    saveStats();
    return { rating: state.stats.puzzleRating, delta };
  },
  // Show a real problem in the given box; resolves true/false once answered.
  async problem(box) {
    const card = await quickProblem();
    return new Promise((resolve) => {
      const el = buildCard(card, { standalone: true, onAnswered: (ok) => resolve(ok) });
      el.querySelectorAll('.rail, .read-more').forEach((x) => x.remove());
      box.innerHTML = ''; box.appendChild(el);
    });
  },
  bestLabel: (id, v) => (BEST_LABEL[id] || (id.startsWith('qf_') ? (x) => `${x} correct` : (x) => `${x} pts`))(v),
  tex: (t) => texHtml(t),
  recordBest(id, v) {
    const g = (state.stats.games ||= {});
    const isBest = g[id] == null || v > g[id];
    if (g[id] == null || v > g[id]) g[id] = v;
    saveStats();
    return isBest && v > 0;
  },
  gameDone(id, xp, extra = {}) {
    if (extra.solved24) state.stats.solved24 = (state.stats.solved24 || 0) + extra.solved24;
    if (id === gameOfDay()) xp *= 2; // game of the day
    gainXp(xp);
    questEvent('game');
    checkBadges();
    return xp;
  },
};
function texHtml(t) {
  try { return window.katex ? window.katex.renderToString(t, { throwOnError: false }) : escapeHTML(t); } catch { return escapeHTML(t); }
}
// ------------------------------------------------------------------ Learn (Duolingo-style courses)
const learnCtx = {
  openSheet: (...a) => openSheet(...a), closeSheet: () => closeSheet(), toast: (m) => toast(m), sound: (k) => sound(k), shareText: (t) => shareText(t),
  subjects: MATH_SUBJECTS,
  progress: () => (state.stats.learn ||= { course: null, done: {}, lessons: 0 }),
  save: () => saveStats(),
  async fetchProblem(spec, seen) {
    if (spec.kind === 'math') return mathProblem({ config: spec.config, levels: [spec.level] });
    try { return await olympiadProblem({ topic: spec.topic, lo: spec.lo, hi: spec.hi, exclude: seen }); } catch {
      return olympiadProblem({ topic: null, lo: spec.lo, hi: spec.hi, exclude: seen }); // not enough of this topic at this level
    }
  },
  renderText: (t) => renderContent(textToHtml(t), { base: 'text', dollar: true }),
  renderHtml: (card) => renderContent(card.html, { base: card.base || 'text', dollar: card.dollarMath !== false }),
  lectureDone(xp) { gainXp(xp); questEvent('lecture'); checkBadges(); saveStats(); },
  async wikiSummary(title) {
    const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
    if (!r.ok) throw new Error('wiki');
    const j = await r.json();
    return { title: j.title, extract: j.extract, thumbnail: j.thumbnail?.source };
  },
  chest(charges, xp) { state.stats.charges = gameCtx.charges() + charges; gainXp(xp); saveStats(); sound('chest'); },
  payOrSolve: (what) => payOrSolve(gameCtx, what),
  mountProblem(box, card, onAnswered) {
    const el = buildCard(card, { standalone: true, onAnswered });
    el.querySelectorAll('.rail, .read-more, .hint-btn').forEach((x) => x.remove());
    box.innerHTML = ''; box.appendChild(el);
    return el;
  },
  lessonDone(xp, { perfect }) {
    const p = learnCtx.progress(); p.lessons = (p.lessons || 0) + 1;
    gainXp(xp); questEvent('lesson'); checkBadges(); saveStats();
    if (perfect) state.stats.perfectLessons = (state.stats.perfectLessons || 0) + 1;
  },
};

// A playable "make 24" card that turns up in the feed now and then.
function buildGameCard(data) {
  if (data.kind === 'lightning') return buildLightningCard(data);
  if (data.kind === 'course') return buildCourseCard(data);
  if (data.kind === 'gotd') return buildGotdCard(data);
  return build24Card(data);
}
const shellCard = (data, pill, where, title, accent) => h(`<section class="card s-game" data-id="${escapeHTML(data.id)}" style="--accent:${accent}"><div class="card-inner">
      <div class="meta"><span class="pill">${pill}</span><span class="where">${where}</span></div>
      <h2 class="heading">${title}</h2><div class="content"><div class="slot"></div></div></div></section>`);
// Three rapid questions right in the feed.
function buildLightningCard(data) {
  const kind = QUICK_KINDS[Math.floor(Math.random() * QUICK_KINDS.length)];
  const el = shellCard(data, '⚡ Lightning round', '3 quick questions', 'Lightning round', '#facc15');
  const slot = $('.slot', el);
  let k = 0; let right = 0;
  const ctx = { tex: texHtml };
  const next = () => {
    if (k >= 3) {
      const xp = right * 4;
      if (xp) gainXp(xp, slot);
      questEvent('game'); checkBadges();
      slot.innerHTML = `<div class="lt-done"><b>${right}/3</b><span>${right === 3 ? 'Flawless! ' : ''}${xp ? `+${xp} XP` : 'Better luck next round'}</span></div><button class="btn ghost small lt-more">Play Math Blitz</button>`;
      $('.lt-more', slot).addEventListener('click', () => startGame('blitz', gameCtx));
      return;
    }
    const q = quickQuestion(ctx, kind);
    slot.innerHTML = `<div class="lt-dots">${[0, 1, 2].map((j) => `<i class="${j < k ? 'done' : j === k ? 'now' : ''}"></i>`).join('')}</div><div class="qf-q lt-q">${q.q}</div><div class="qf-choices n${q.choices.length}">${q.choices.map((c, i) => `<button class="qf-c" data-i="${i}">${c}</button>`).join('')}</div>`;
    slot.querySelectorAll('.qf-c').forEach((b) => b.addEventListener('click', () => {
      if (slot.dataset.lock) return; slot.dataset.lock = '1';
      const ok = +b.dataset.i === q.answer;
      b.classList.add(ok ? 'right' : 'wrong');
      if (!ok) slot.querySelectorAll('.qf-c')[q.answer]?.classList.add('right');
      sound(ok ? 'correct' : 'wrong');
      if (ok) right++;
      k++;
      setTimeout(() => { delete slot.dataset.lock; next(); }, ok ? 450 : 1100);
    }));
  };
  next();
  return el;
}
// "Pick up where you left off" in Learn.
function buildCourseCard(data) {
  const p = state.stats.learn || {};
  const el = shellCard(data, '🎓 Learn', p.course ? 'Your course' : 'Courses', p.course ? 'Keep your streak going' : 'Learn something new', '#58cc02');
  const slot = $('.slot', el);
  const done = p.course ? (p.done?.[p.course] || 0) : 0;
  const name = p.course ? (MATH_SUBJECTS[p.course] || { oly_nt: 'Olympiad Number Theory', oly_comb: 'Olympiad Combinatorics', oly_alg: 'Olympiad Algebra', oly_geo: 'Olympiad Geometry', oly_mixed: 'Olympiad Mixed' }[p.course]) : null;
  slot.innerHTML = p.course
    ? `<p class="hint" style="margin-top:0!important">${escapeHTML(name)} · Unit ${Math.min(5, Math.floor(done / 5) + 1)} · ${done % 5 === 4 ? 'Unit test' : `Lesson ${(done % 5) + 1}`}</p><div class="course-bar big"><i style="width:${(100 * done) / 25}%"></i></div><button class="btn wide go-learn">Continue →</button>`
    : '<p class="hint" style="margin-top:0!important">Short lessons with lectures, worked examples, boss problems and a memory meter. From prealgebra to the IMO.</p><button class="btn wide go-learn">Pick a course</button>';
  $('.go-learn', slot).addEventListener('click', () => openLearn(learnCtx));
  return el;
}
function buildGotdCard(data) {
  const g = GAMES.find((x) => x.id === gameOfDay());
  const el = shellCard(data, '🎮 Game of the day', '2× XP today', g.name, '#db2777');
  const slot = $('.slot', el);
  slot.innerHTML = `<div class="gotd"><span class="gotd-icon">${g.icon}</span><p>${escapeHTML(g.blurb)}</p></div><button class="btn wide play">Play · ${escapeHTML(g.cost)}</button><button class="btn ghost small all">All ${GAMES.length} games</button>`;
  $('.play', slot).addEventListener('click', () => startGame(g.id, gameCtx));
  $('.all', slot).addEventListener('click', () => openGames(gameCtx));
  return el;
}
function build24Card(data) {
  const el = h(`<section class="card s-game" data-id="${escapeHTML(data.id)}"><div class="card-inner">
      <div class="meta"><span class="pill">Mini-game</span><span class="where">Quick break</span></div>
      <h2 class="heading">Quick 24</h2>
      <div class="content"><p class="hint" style="margin-top:0!important">Use all four numbers with + − × ÷ to make 24.</p><div class="slot"></div></div>
    </div></section>`);
  const slot = $('.slot', el);
  let solved = false;
  const board = mount24(slot, gameCtx, {
    compact: true,
    onSolve: () => {
      if (solved) return;
      solved = true;
      const fair = !board.hinted();
      if (fair) { state.stats.solved24 = (state.stats.solved24 || 0) + 1; gainXp(15, slot); }
      questEvent('game'); checkBadges();
      slot.innerHTML = `<div class="feedback ok">${fair ? 'Made 24! +15 XP' : 'Nice — now try one without the hint.'}</div>`;
      const more = h('<button class="btn ghost small">More games</button>');
      more.addEventListener('click', () => openGames(gameCtx));
      slot.appendChild(more);
    },
  });
  return el;
}

// ------------------------------------------------------------------ progress hub
let boardTab = 'week';
function openProgress() {
  const st = state.stats;
  const xp = st.xp || 0; const L = levelFor(xp);
  const into = xp - xpForLevel(L); const need = xpForLevel(L + 1) - xpForLevel(L);
  const wk = cloud.weekStart();
  const d = dayRec();
  const quests = questsFor(today());
  const body = document.createElement('div');
  body.className = 'progress';
  body.innerHTML = `
    <div class="lvl-head">
      <div class="lvl-ring"><svg viewBox="0 0 36 36" class="ring"><circle cx="18" cy="18" r="15"/><circle class="prog" cx="18" cy="18" r="15" style="stroke-dashoffset:${94.25 * (1 - into / need)}"/></svg><b>${L}</b></div>
      <div class="lvl-text"><b>${titleFor(L)}</b><span>${into} / ${need} XP to level ${L + 1}</span><span>${st.weekOf === wk ? st.weekXp || 0 : 0} XP this week · ${xp} total</span></div>
    </div>
    <div class="streak-row"><span>🔥 <b>${dayStreak()}</b>-day streak</span><span>❄ <b>${st.freezes || 0}</b> streak freeze${st.freezes === 1 ? '' : 's'}</span><span>🎁 <b>${st.chests || 0}</b></span></div>
    <div class="league" style="--lc:${leagueFor(st.weekOf === wk ? st.weekXp || 0 : 0)[2]}"><b>${leagueFor(st.weekOf === wk ? st.weekXp || 0 : 0)[0]} league</b><span>${(() => { const w = st.weekOf === wk ? st.weekXp || 0 : 0; const nx = nextLeague(w); return nx ? `${nx[1] - w} XP to ${nx[0]} this week` : 'Top league — amazing!'; })()}</span></div>
    ${st.chests > 0 ? '<button class="btn wide open-chest">🎁 Open a chest</button>' : ''}
    <button class="btn ghost wide duel-go">⚔ Duel a friend</button>
    <button class="btn ghost wide learn-go">🎓 Learn — courses</button>
    <button class="btn ghost wide games-go">🎮 Mini-games</button>
    <h3>Today’s quests</h3>
    <div class="quests">${quests.map((q) => {
      const done = (d.questsDone || []).includes(q.id);
      const prog = Math.min(q.goal, d.quests?.[q.id] || 0);
      const shown = q.unit === 's' ? `${Math.floor(prog / 60)}/${q.goal / 60} min` : `${prog}/${q.goal}`;
      return `<div class="quest ${done ? 'done' : ''}"><div class="q-top"><span>${done ? '✓ ' : ''}${escapeHTML(q.text)}</span><b>+${q.xp} XP</b></div><div class="bar"><span style="width:${(100 * prog) / q.goal}%"></span></div><small>${done ? 'Done' : shown}</small></div>`;
    }).join('')}</div>
    <p class="small">${d.allQuests ? 'All done today — you earned a streak freeze. New quests tomorrow.' : 'Finish all three for +50 XP and a streak freeze (protects your streak if you miss a day).'}</p>
    <div class="daily-box"></div>
    <h3>Leaderboard</h3>
    <div class="segmented board-tabs"><button data-b="week">This week</button><button data-b="all">All time</button><button data-b="sprint">Sprint</button></div>
    <div class="board"></div>
    <button class="btn wide sprint-go">Start a ranked sprint</button>`;
  // Daily challenge status.
  const dailyBox = $('.daily-box', body);
  const dailyLine = d.dailyDone ? (d.dailySolved ? '✓ You solved today’s challenge.' : 'You tried today’s challenge — new one tomorrow.') : 'You haven’t tried today’s challenge yet.';
  dailyBox.innerHTML = `<h3>Daily challenge</h3><p class="daily-line">${dailyLine}${st.dailyStreak ? ` Daily streak: <b>${st.dailyStreak}</b>.` : ''}</p>${d.dailyDone ? '' : '<button class="btn ghost small play-daily">Play it now</button>'}<p class="small daily-stats"></p>`;
  $('.play-daily', dailyBox)?.addEventListener('click', () => {
    closeSheet();
    if (state.tab !== 'mix') switchTab('mix');
    const el = document.querySelector('.card[data-id^="daily"]');
    if (el) feed.scrollTo({ top: el.offsetTop, behavior: 'smooth' }); else loadDaily();
  });
  if (cloud.cloudEnabled) {
    cloud.dailyStats(today()).then(({ total, solved }) => {
      $('.daily-stats', dailyBox).textContent = total ? `${total} player${total === 1 ? '' : 's'} today · ${Math.round((100 * solved) / total)}% solved it` : 'Nobody has played today’s yet — be first!';
    }).catch(() => {});
  }
  // Leaderboards.
  const board = $('.board', body);
  const me = cloud.currentUser();
  const renderBoard = async () => {
    body.querySelectorAll('.board-tabs button').forEach((b) => b.setAttribute('aria-checked', b.dataset.b === boardTab));
    if (!cloud.cloudEnabled) { board.innerHTML = '<p class="small">Leaderboards switch on once accounts are set up (see SETUP-ACCOUNTS.md).</p>'; return; }
    board.innerHTML = '<p class="small">Loading…</p>';
    try {
      let rows;
      if (boardTab === 'sprint') {
        rows = (await cloud.sprintLeaderboard(new Date(Date.now() - 7 * 864e5).toISOString())).map((r) => ({ id: r.user_id, name: r.profiles?.username, val: `${r.score}/10`, sub: `${Math.round(r.ms / 1000)}s` }));
      } else {
        rows = (await cloud.leaderboard(boardTab)).map((r) => ({ id: r.user_id, name: r.profiles?.username, val: `${boardTab === 'week' ? r.week_xp : r.total} XP`, sub: `Lv ${r.level}` }));
      }
      if (!rows.length) { board.innerHTML = `<p class="small">${boardTab === 'sprint' ? 'No sprints this week yet.' : 'No one on the board yet this week.'} ${me ? 'Get some XP and claim first place!' : ''}</p>`; }
      else {
        board.innerHTML = `<ol class="ranks">${rows.map((r, i) => `<li class="${me && r.id === me.id ? 'me' : ''}"><span class="rk">${i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}</span><span class="nm">@${escapeHTML(r.name || 'player')}</span><small>${escapeHTML(r.sub)}</small><b>${escapeHTML(r.val)}</b></li>`).join('')}</ol>`;
        if (me && boardTab !== 'sprint' && !rows.some((r) => r.id === me.id)) board.appendChild(h(`<p class="small you-line">You: ${boardTab === 'week' ? (st.weekOf === wk ? st.weekXp || 0 : 0) : xp} XP — not in the top ${rows.length} yet.</p>`));
      }
      if (!me) {
        board.classList.add('locked-board');
        const cta = h('<div class="board-cta"><b>Join the leaderboard</b><span>Create a free account to rank your XP against everyone.</span><button class="btn small">Create account</button></div>');
        cta.querySelector('button').addEventListener('click', () => requireAccount('The leaderboard'));
        board.appendChild(cta);
      }
    } catch (e) { board.innerHTML = `<p class="small">${escapeHTML(e.message)}</p>`; }
  };
  body.querySelectorAll('.board-tabs button').forEach((b) => b.addEventListener('click', () => { boardTab = b.dataset.b; renderBoard(); }));
  $('.sprint-go', body).addEventListener('click', openSprint);
  $('.open-chest', body)?.addEventListener('click', () => { closeSheet(); openChest(); });
  $('.duel-go', body).addEventListener('click', () => openDuel());
  $('.games-go', body).addEventListener('click', () => openGames(gameCtx));
  $('.learn-go', body).addEventListener('click', () => openLearn(learnCtx));
  renderBoard();
  openSheet('Your progress', body, 'tall');
}

// ------------------------------------------------------------------ duels
// Play 5 AMC/AIME problems, then send a friend a link with the same five and your score.
const DUEL_LEN = 5;
const encodeDuel = async (d) => encodePost({ b: 'duel', duel: d });
async function decodeDuel(s) { const p = await decodePost(s); if (!p.duel || !Array.isArray(p.duel.r)) throw new Error('bad duel'); return p.duel; }
const rowIdx = (card) => Number(String(card.id).split(':').pop());
async function duelProblems() {
  const out = [];
  for (let tries = 0; out.length < DUEL_LEN && tries < 25; tries++) {
    try {
      const c = await SOURCES.contest.fetch({ ...fetchSettings(), filters: { ...filters(), checkable: true, qtype: 'any' }, topics: [...PROBLEM_TOPICS] });
      if (c.answer && (c.answer.type === 'choice' || c.answer.type === 'numeric') && !out.some((x) => x.id === c.id)) out.push(c);
    } catch { /* try again */ }
  }
  if (out.length < DUEL_LEN) throw new Error('Couldn’t load problems. Check your connection.');
  return out;
}
function openDuel(challenge = null) {
  const body = document.createElement('div');
  body.className = 'sprint duel';
  const fmt = (ms) => { const t = Math.round(ms / 1000); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; };
  const intro = challenge
    ? `<div class="duel-intro"><div class="duel-vs">⚔</div><h3>@${escapeHTML(challenge.n || 'A friend')} challenged you!</h3><p>${DUEL_LEN} AMC/AIME problems. They got <b>${challenge.s}/${DUEL_LEN}</b> in <b>${fmt(challenge.t)}</b>. Can you beat that?</p><button class="btn wide go">Accept the duel</button></div>`
    : `<div class="duel-intro"><div class="duel-vs">⚔</div><h3>Duel a friend</h3><p>Answer ${DUEL_LEN} AMC/AIME problems as fast as you can. Then send your friend a link: they get the <b>same five</b>, and you see who wins.</p><button class="btn wide go">Start</button></div>`;
  body.innerHTML = intro;
  let alive = true;
  const stop = () => { alive = false; };
  $('.go', body).addEventListener('click', async () => {
    body.innerHTML = '<p class="loader-msg">Getting the problems ready…</p>';
    let cards;
    try { cards = challenge ? await Promise.all(challenge.r.map((i) => numinaByIndex(i))) : await duelProblems(); } catch (e) { body.innerHTML = `<p class="loader-msg">${escapeHTML(e.message)}</p>`; return; }
    if (!alive) return;
    body.innerHTML = `<div class="sprint-bar"><span class="sprint-count"></span><span class="sprint-time">0:00</span></div><div class="sprint-progress"><span></span></div><div class="sprint-stage"></div>`;
    const stage = $('.sprint-stage', body);
    const results = [];
    const start = Date.now();
    const timer = setInterval(() => { if (!alive) { clearInterval(timer); return; } $('.sprint-time', body).textContent = fmt(Date.now() - start); }, 500);
    const show = () => {
      const i = results.length;
      $('.sprint-count', body).textContent = `${Math.min(i + 1, DUEL_LEN)} / ${DUEL_LEN}`;
      $('.sprint-progress span', body).style.width = `${(100 * i) / DUEL_LEN}%`;
      if (i >= DUEL_LEN) { clearInterval(timer); finish(Date.now() - start); return; }
      let done = false;
      const el = buildCard({ ...cards[i], daily: false }, { standalone: true, onAnswered: (ok) => { if (done) return; done = true; results.push(ok); setTimeout(() => alive && show(), ok ? 800 : 1800); } });
      el.querySelectorAll('.rail .sol, .rail .open, .hint-btn').forEach((x) => x.remove());
      el._firstSeen = Date.now() - 600000; // no think-time lock in a duel
      stage.innerHTML = ''; stage.appendChild(el);
    };
    const finish = async (ms) => {
      const score = results.filter(Boolean).length;
      const ids = cards.map(rowIdx);
      gainXp(score * 5);
      let verdict = '';
      if (challenge) {
        const win = score > challenge.s || (score === challenge.s && ms < challenge.t);
        const tie = score === challenge.s && Math.abs(ms - challenge.t) < 1000;
        verdict = tie ? 'It’s a tie!' : win ? 'You win! 🏆' : `@${escapeHTML(challenge.n || 'They')} wins this one`;
        if (win && !tie) { gainXp(30); sound('level'); } else sound('quest');
        state.stats.duelsWon = (state.stats.duelsWon || 0) + (win && !tie ? 1 : 0);
      }
      state.stats.duels = (state.stats.duels || 0) + 1; saveStats();
      const name = cloud.currentUser()?.username || state.profile.name || 'Mathlete';
      const link = `${PUBLIC_URL}#duel=${await encodeDuel({ r: ids, s: score, t: ms, n: name })}`;
      body.innerHTML = `<div class="sprint-done"><div class="score">${score}<small>/ ${DUEL_LEN}</small></div>
        ${verdict ? `<h3 class="verdict">${verdict}</h3><p>You: ${score}/${DUEL_LEN} in ${fmt(ms)} · @${escapeHTML(challenge.n || 'them')}: ${challenge.s}/${DUEL_LEN} in ${fmt(challenge.t)}</p>` : `<p>Time ${fmt(ms)}. Now send it to a friend — they’ll get the same five problems.</p>`}
        <div class="dots">${results.map((r) => `<span class="${r ? 'right' : 'wrong'}"></span>`).join('')}</div>
        <button class="btn wide send">${challenge ? 'Send a rematch' : 'Challenge a friend'}</button><button class="btn ghost wide again">New duel</button></div>`;
      $('.send', body).addEventListener('click', () => shareTextUrl(challenge
        ? `${verdict.replace(/<[^>]+>/g, '')} I got ${score}/${DUEL_LEN} in ${fmt(ms)} on our MathScroll duel. Rematch?`
        : `I got ${score}/${DUEL_LEN} in ${fmt(ms)} on these MathScroll problems. Can you beat me?`, link));
      $('.again', body).addEventListener('click', () => openDuel());
    };
    show();
  });
  openSheet(challenge ? 'Duel' : 'Duel a friend', body, 'tall', stop);
}
async function shareTextUrl(text, url) {
  try { if (navigator.share) { await navigator.share({ title: 'MathScroll duel', text, url }); return; } } catch (e) { if (e.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(`${text} ${url}`); toast('Link copied — send it to a friend'); } catch { toast('Couldn’t copy the link'); }
}

// ------------------------------------------------------------------ settings
function openSettings() {
  const st = state.settings;
  const body = document.createElement('div');
  body.className = 'settings';
  let changed = false;

  body.appendChild(h('<h3>Your feed style</h3>'));
  const pp = h(personaPicker(state.settings.persona || 'student'));
  pp.querySelectorAll('[data-persona]').forEach((b) => b.addEventListener('click', () => { applyPersona(b.dataset.persona); pp.querySelectorAll('[data-persona]').forEach((x) => x.classList.toggle('on', x === b)); toast(`Feed style: ${PERSONAS[b.dataset.persona].name}`); resetFeed(); }));
  body.appendChild(pp);
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

  const fbtn = h('<button class="btn ghost wide">Difficulty, topics & more filters…</button>');
  fbtn.addEventListener('click', openFilters);
  body.appendChild(fbtn);
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
  const snd = h(`<label class="row"><span><b>Sounds</b><small>Little chimes for correct answers, chests and level-ups</small></span><input type="checkbox" class="switch" ${st.sound ? 'checked' : ''}></label>`);
  snd.querySelector('input').addEventListener('change', (e) => { st.sound = e.target.checked; saveSettings(); if (st.sound) sound('correct'); });
  feedGroup.appendChild(snd);
  const dailyRow = h(`<label class="row"><span><b>Daily challenge</b><small>One AMC/AIME problem a day, the same for everyone</small></span><input type="checkbox" class="switch" ${st.daily ? 'checked' : ''}></label>`);
  dailyRow.querySelector('input').addEventListener('change', (e) => { st.daily = e.target.checked; saveSettings(); if (!st.daily) state.pins = state.pins.filter((p) => !p.daily); });
  feedGroup.appendChild(dailyRow);
  const goalRow = h(`<label class="row"><span><b>Daily goal</b><small>Problems to solve each day</small></span><select class="select">${[3, 5, 10, 15, 20].map((n) => `<option ${n === st.dailyGoal ? 'selected' : ''}>${n}</option>`).join('')}</select></label>`);
  goalRow.querySelector('select').addEventListener('change', (e) => { st.dailyGoal = Number(e.target.value); saveSettings(); });
  feedGroup.appendChild(goalRow);
  const f = st.focus;
  const sel = (vals, cur, fmt) => vals.map((v) => `<option value="${v}" ${v === cur ? 'selected' : ''}>${fmt(v)}</option>`).join('');
  const focusRows = h(`<div>
    <label class="row"><span><b>Focus problems</b><small>Every few problems, the feed pauses so you really try one</small></span><input type="checkbox" class="switch f-on" ${f.on ? 'checked' : ''}></label>
    <label class="row"><span><b>How often</b></span><select class="select f-every">${sel([3, 4, 5, 8, 10], f.every, (v) => `Every ${v}th`)}</select></label>
    <label class="row"><span><b>Think time</b><small>How long focus problems pause, and spoilers stay hidden</small></span><select class="select f-secs">${sel([10, 15, 20, 30, 45], f.seconds, (v) => `${v} s`)}</select></label>
    <label class="row"><span><b>Hide spoilers at first</b><small>Hint, answer and solution unlock after the think time</small></span><input type="checkbox" class="switch f-gate" ${f.gate ? 'checked' : ''}></label>
    <label class="row"><span><b>Skips per day</b><small>For focus problems you really want to pass</small></span><select class="select f-skips">${sel([0, 1, 3, 5, 10], f.skips, (v) => String(v))}</select></label>
  </div>`);
  $('.f-on', focusRows).addEventListener('change', (e) => { f.on = e.target.checked; saveSettings(); if (!f.on) endFocus('reset'); });
  $('.f-gate', focusRows).addEventListener('change', (e) => { f.gate = e.target.checked; saveSettings(); });
  $('.f-every', focusRows).addEventListener('change', (e) => { f.every = Number(e.target.value); saveSettings(); });
  $('.f-secs', focusRows).addEventListener('change', (e) => { f.seconds = Number(e.target.value); saveSettings(); });
  $('.f-skips', focusRows).addEventListener('change', (e) => { f.skips = Number(e.target.value); saveSettings(); });
  while (focusRows.firstElementChild) feedGroup.appendChild(focusRows.firstElementChild);
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
// "What brings you here?" — tunes the mix of the For you feed.
const PERSONAS = {
  curious: { icon: '🤔', name: 'Just curious', desc: 'Fun facts, puzzles, visual proofs and big ideas', weights: { spark: 45, wikipedia: 16, oeis: 10, proofwiki: 6, math: 8, contest: 6, omni: 2, olympiad: 2, aops: 2 }, focusEvery: 6 },
  student: { icon: '📚', name: 'Student', desc: 'Practice problems from easy to hard, with a mix of fun', weights: { spark: 18, math: 18, contest: 18, wikipedia: 10, proofwiki: 8, oeis: 6, omni: 6, olympiad: 6, aops: 6 }, focusEvery: 4 },
  competitor: { icon: '🏆', name: 'Competitor', desc: 'AMC, AIME and olympiad problems first', weights: { spark: 6, contest: 22, olympiad: 14, omni: 14, aops: 12, math: 12, proofwiki: 8, wikipedia: 6, oeis: 4 }, focusEvery: 4 },
};
function applyPersona(id) {
  const P = PERSONAS[id]; if (!P) return;
  state.settings.persona = id;
  state.settings.weights = { ...state.settings.weights, ...P.weights };
  state.settings.focus = { ...state.settings.focus, every: P.focusEvery };
  state.settings.sources.spark = true;
  saveSettings();
}
const personaPicker = (cur) => `<div class="personas">${Object.entries(PERSONAS).map(([k, p]) => `<button class="persona ${k === cur ? 'on' : ''}" data-persona="${k}"><span>${p.icon}</span><b>${p.name}</b><small>${p.desc}</small></button>`).join('')}</div>`;

function openWelcome() {
  const st = state.settings;
  const body = document.createElement('div');
  body.className = 'welcome';
  const srcChips = Object.entries(SOURCES).map(([k, s]) => `<button class="chip ${st.sources[k] ? 'on' : ''}" data-src="${k}">${s.label}</button>`).join('');
  const topicChips = PROBLEM_TOPICS.map((t) => `<button class="chip on" data-topic="${t}">${t}</button>`).join('');
  body.innerHTML = `
    <div class="welcome-hero"><div class="brand big">∑</div><h2>Scroll maths, not videos.</h2>
      <p>Swipe up for the next card, tap to answer, double-tap to like.</p></div>
    <h3>What brings you here?</h3>${personaPicker(st.persona || 'student')}
    <div class="welcome-tour">
      <div><span>✨</span><b>Discover</b><small>Fun facts, brain teasers and proofs you can watch</small></div>
      <div><span>🎓</span><b>Learn</b><small>Courses from prealgebra to the IMO, with lectures</small></div>
      <div><span>🎮</span><b>Games</b><small>12 maths games, from Number Ninja to chess puzzles</small></div>
      <div><span>⚔️</span><b>Numeria</b><small>A maths adventure game with real contest problems</small></div>
    </div>
    <details class="welcome-more"><summary>Choose sources and topics</summary>
    <h3>What do you want to see?</h3><div class="chips">${srcChips}</div>
    <h3>Favourite topics</h3><div class="chips">${topicChips}</div></details>
    <button class="btn wide start">Start scrolling</button>`;
  body.querySelectorAll('.chip').forEach((c) => c.addEventListener('click', () => c.classList.toggle('on')));
  let persona = st.persona || 'student';
  body.querySelectorAll('[data-persona]').forEach((b) => b.addEventListener('click', () => { persona = b.dataset.persona; body.querySelectorAll('[data-persona]').forEach((x) => x.classList.toggle('on', x === b)); sound('click'); }));
  let started = false;
  const finish = () => {
    if (started) return;
    started = true;
    const srcs = [...body.querySelectorAll('[data-src]')];
    if (srcs.some((c) => c.classList.contains('on'))) srcs.forEach((c) => { st.sources[c.dataset.src] = c.classList.contains('on'); });
    const topics = [...body.querySelectorAll('[data-topic].on')].map((c) => c.dataset.topic);
    st.topics = topics.length ? topics : [...PROBLEM_TOPICS];
    saveSettings();
    applyPersona(persona);
    store.set('onboarded', true);
    renderTabs(); resetFeed();
    if (!store.get('coached', false)) setTimeout(showCoach, 700);
  };
  finish.onReplace = true;
  $('.start', body).addEventListener('click', () => { finish(); closeSheet(); });
  openSheet('Welcome to MathScroll', body, 'tall', finish);
}

// ------------------------------------------------------------------ picture viewer
// Tap a diagram or picture to see it full screen; tap again (or the background) to close; double-tap to zoom.
document.addEventListener('click', (e) => {
  const target = e.target.closest('.content img, .asy-wrap');
  if (!target || e.target.closest('a')) return;
  e.stopPropagation();
  const box = h('<div class="lightbox" role="dialog" aria-label="Picture"><div class="lb-inner"></div><button class="lb-close" aria-label="Close">✕</button></div>');
  const clone = target.cloneNode(true);
  clone.classList.add('lb-item');
  $('.lb-inner', box).appendChild(clone);
  let zoomed = false; let lastTap = 0;
  box.addEventListener('click', (ev) => {
    const now = Date.now();
    if (ev.target.closest('.lb-item') && now - lastTap < 320) { zoomed = !zoomed; box.classList.toggle('zoomed', zoomed); lastTap = 0; return; }
    lastTap = now;
    if (ev.target.closest('.lb-item') && zoomed) return;
    setTimeout(() => { if (Date.now() - lastTap >= 300 && !zoomed) box.remove(); }, 330);
  });
  $('.lb-close', box).addEventListener('click', (ev) => { ev.stopPropagation(); box.remove(); });
  document.body.appendChild(box);
}, true);

// ------------------------------------------------------------------ first-run tips
function showCoach() {
  store.set('coached', true);
  const steps = [
    { icon: '👆', title: 'Swipe up', text: 'for the next card. Every card is a problem, a fact, a proof or a puzzle.', cls: 'swipe' },
    { icon: '🅰️', title: 'Tap an answer', text: 'to check it. Right answers earn XP and ⚡ for games.', cls: 'tap' },
    { icon: '❤️', title: 'Double-tap', text: 'to like a card. Use the buttons on the right to save, share or see the solution.', cls: 'like' },
  ];
  let i = 0;
  const box = h('<div class="coach" role="dialog" aria-label="Tips"><div class="coach-card"><div class="coach-anim"></div><b class="coach-title"></b><p class="coach-text"></p><div class="coach-dots"></div><button class="btn wide coach-next">Next</button><button class="link coach-skip">Skip</button></div></div>');
  const draw = () => {
    const st = steps[i];
    $('.coach-anim', box).className = `coach-anim ${st.cls}`; $('.coach-anim', box).textContent = st.icon;
    $('.coach-title', box).textContent = st.title; $('.coach-text', box).textContent = st.text;
    $('.coach-dots', box).innerHTML = steps.map((_, j) => `<i class="${j === i ? 'on' : ''}"></i>`).join('');
    $('.coach-next', box).textContent = i === steps.length - 1 ? 'Let’s go!' : 'Next';
  };
  $('.coach-next', box).addEventListener('click', () => { if (++i >= steps.length) box.remove(); else draw(); });
  $('.coach-skip', box).addEventListener('click', () => box.remove());
  draw();
  document.body.appendChild(box);
}

// ------------------------------------------------------------------ bottom navigation
function setNav(id) { document.querySelectorAll('.bottombar [data-nav]').forEach((b) => b.classList.toggle('on', b.dataset.nav === id)); }
document.querySelectorAll('.bottombar [data-nav]').forEach((b) => b.addEventListener('click', () => {
  const id = b.dataset.nav; sound('click');
  if (id === 'home') { closeSheet(); if (state.tab !== 'mix') switchTab('mix'); else feed.scrollTo({ top: 0, behavior: 'smooth' }); setNav('home'); }
  if (id === 'learn') { openLearn(learnCtx); setNav('learn'); }
  if (id === 'games') { openGames(gameCtx); setNav('games'); }
}));
$('#profileBtn').addEventListener('click', () => setNav('me'));
$('#profileBtn').addEventListener('click', openProfile);
$('#levelBtn').addEventListener('click', openProgress);
$('#chestBtn').addEventListener('click', openChest);
$('#createBtn').addEventListener('click', () => openCompose());
$('#searchBtn').addEventListener('click', () => openSearch());

// ------------------------------------------------------------------ boot
async function readDuelLink() {
  const m = location.hash.match(/^#duel=([zj][A-Za-z0-9_-]+)$/);
  if (!m) return false;
  history.replaceState(null, '', location.pathname + location.search);
  try { const d = await decodeDuel(m[1]); setTimeout(() => openDuel(d), 500); return true; } catch { toast('That duel link looks broken'); return false; }
}

async function readSharedPost() {
  const pm = location.hash.match(/^#post=(\d+)$/);
  if (pm && cloud.cloudEnabled) {
    try {
      const row = await cloud.getPost(pm[1]);
      if (row) {
        const card = { ...cloudCard(row), banner: 'Shared with you' };
        state.pins = [card, ...state.pins.filter((x) => x.id !== card.id && !x.banner?.startsWith('Shared'))];
        state.justShared = true;
      } else toast('That post was deleted');
    } catch { toast('Couldn’t load that post'); }
    history.replaceState(null, '', location.pathname + location.search);
    return;
  }
  const m = location.hash.match(/^#p=([zj][A-Za-z0-9_-]+)$/);
  if (!m) return;
  try {
    const p = await decodePost(m[1]);
    const card = { ...postCard(p), banner: 'Shared with you' };
    state.pins = [card, ...state.pins.filter((x) => x.id !== card.id && !x.banner?.startsWith('Shared'))];
    state.justShared = true;
  } catch {
    toast('That shared link looks broken');
  }
  history.replaceState(null, '', location.pathname + location.search);
}

// Today's daily challenge goes right after whatever card is on screen (or first, at the start).
async function loadDaily() {
  if (!state.settings.daily || dayRec().dailyDone) return;
  try {
    const date = today();
    const card = { ...(await dailyChallenge(date)), banner: `Daily challenge · ${new Date().toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' })}` };
    if (dayRec().dailyDone || state.pins.some((p) => p.daily)) return;
    state.pins.push(card);
    if (state.tab !== 'mix') return;
    const atTop = feed.scrollTop < 10 && currentIndex() === 0 && !state.cards[0]?.data.banner;
    const idx = atTop ? 0 : Math.min(state.cards.length, currentIndex() + 1);
    const el = buildCard(card);
    const before = state.cards[idx]?.el || $('#loader');
    feed.insertBefore(el, before);
    state.cards.splice(idx, 0, { data: card, el });
    observer.observe(el);
    if (atTop && idx === 0) feed.scrollTo({ top: 0, behavior: 'instant' });
  } catch (e) {
    console.warn('[MathScroll] daily challenge unavailable:', e.message);
  }
}

async function boot() {
  applyTheme();
  if (state.tab !== 'mix' && !state.settings.sources[state.tab]) state.tab = 'mix';
  const auth = cloud.cloudEnabled ? await cloud.handleAuthRedirect() : null;
  const duel = await readDuelLink();
  await readSharedPost();
  if (state.justShared) state.tab = 'mix';
  renderTabs();
  updateStreak();
  resetFeed();
  if (auth?.error) setTimeout(() => { toast(auth.error); openAuth(auth.error); }, 500);
  else if (auth?.type === 'recovery') setTimeout(openNewPassword, 500);
  else if (auth?.user) setTimeout(() => toast(`Email confirmed — welcome, @${auth.user.username || 'you'}!`), 500);
  if (!store.get('onboarded', false) && !state.justShared && !auth && !duel) setTimeout(openWelcome, 400);
  rollWeek();
  loadDaily();
  applyStreakFreeze();
  renderLevel();
  // Signing in or out unlocks/locks features on cards already built, so rebuild the feed.
  let wasSignedIn = !!cloud.currentUser();
  cloud.onAuthChange((u) => {
    const now = !!u;
    if (now === wasSignedIn) return;
    wasSignedIn = now;
    if (now) hideWall(); else if (store.get('guestViews', 0) > GUEST_TASTE) showWall();
    state.pins = state.pins.filter((p) => !p.daily);
    renderTabs(); resetFeed(); loadDaily(); renderLevel();
  });
  if (!cloud.currentUser() && cloud.cloudEnabled && /^#sign(up|in)$/.test(location.hash)) { const m = location.hash.slice(1); history.replaceState(null, '', location.pathname + location.search); setTimeout(() => openAuth('', m), 500); }
  if (cloud.currentUser()) pullSync();
  else if (needsAccount() && store.get('guestViews', 0) > GUEST_TASTE) showWall();
  document.addEventListener('visibilitychange', () => { if (document.hidden && cloud.currentUser()) { clearTimeout(syncTimer); pushSync(); } });
  window.addEventListener('online', () => { if (errorShown) { state.failures = {}; fill(); } });
  window.addEventListener('hashchange', async () => {
    if (cloud.cloudEnabled && /access_token=|error_description=/.test(location.hash)) {
      const r = await cloud.handleAuthRedirect();
      if (r?.error) { toast(r.error); openAuth(r.error); }
      else if (r?.type === 'recovery') openNewPassword();
      else if (r?.user) { closeSheet(); toast(`Email confirmed — welcome, @${r.user.username || 'you'}!`); renderTabs(); pullSync(); }
      return;
    }
    state.justShared = false;
    if (await readDuelLink()) return;
    await readSharedPost();
    if (state.justShared) { closeSheet(); resetFeed(); }
  });
}

function whenKatex(cb, tries = 0) {
  if (window.katex || tries > 100) cb(); else setTimeout(() => whenKatex(cb, tries + 1), 30);
}
whenKatex(boot);

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
