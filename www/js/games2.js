// Twenty more mini-games: ten fast "speed maths" rounds built on one quick-fire engine, and ten puzzles.
// Uses only the context the app passes in (sheet, sound, XP, best scores, ⚡), so it has no imports.

const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const rnd = (n) => Math.floor(Math.random() * n);
const pick = (a) => a[rnd(a.length)];
const between = (a, b) => a + rnd(b - a + 1);
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const isPrime = (n) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
const factorise = (n) => { const f = []; for (let d = 2; d * d <= n; d++) while (n % d === 0) { f.push(d); n /= d; } if (n > 1) f.push(n); return f; };
const divisorCount = (n) => { let c = 0; for (let d = 1; d * d <= n; d++) if (n % d === 0) c += d * d === n ? 1 : 2; return c; };
const powMod = (b, e, m) => { let r = 1; b %= m; while (e > 0) { if (e & 1) r = (r * b) % m; b = (b * b) % m; e >>= 1; } return r; };
// Four answer options: the right one plus nearby wrong ones.
function options(answer, spread = 3, min = -Infinity) {
  const set = new Set([answer]);
  for (let t = 0; set.size < 4 && t < 60; t++) { const v = answer + (rnd(2) ? 1 : -1) * between(1, spread + Math.floor(t / 10)); if (v >= min) set.add(v); }
  return shuffle([...set]);
}

function result(body, ctx, { id, title, big, unit = '', line = '', again, share }) {
  body.innerHTML = `<div class="sprint-done game-done"><small class="gd-title">${title}</small><div class="score">${big}<small> ${unit}</small></div><p>${line}</p>
    <button class="btn wide again">Play again</button><button class="btn ghost wide share-g">Share</button><button class="btn ghost wide more-g">More games</button></div>`;
  body.querySelector('.again').addEventListener('click', again);
  body.querySelector('.share-g').addEventListener('click', () => ctx.shareText(share));
  body.querySelector('.more-g').addEventListener('click', () => ctx.openGames());
}
function done(ctx, body, id, score, xp, opts) {
  const best = ctx.recordBest(id, score);
  const gained = ctx.gameDone(id, xp) ?? xp;
  result(body, ctx, { id, ...opts, line: `${best ? 'New best! ' : ''}+${gained} XP${opts.line ? ` · ${opts.line}` : ''}` });
}
const stopper = (fn) => Object.assign(fn, { onReplace: true });

// ------------------------------------------------------------------ quick-fire engine
// gen(level) → { q: html, choices: [html…], answer: index, why?: text shown after a miss }
function quickfire(ctx, cfg) {
  const TIME = cfg.time || 60;
  let left = TIME; let score = 0; let streak = 0; let best = 0; let level = 1; let over = false; let cur; let lock = false;
  const body = el(`<div class="quickfire">
    <div class="gb-top"><span class="gb-score">0</span><span class="r-streak"></span><span class="gb-time">${TIME}s</span></div>
    <div class="qf-q"></div><div class="qf-choices"></div><p class="qf-why small"></p></div>`);
  const next = () => {
    cur = cfg.gen(level);
    body.querySelector('.qf-q').innerHTML = cur.q;
    body.querySelector('.qf-why').textContent = '';
    const box = body.querySelector('.qf-choices');
    box.className = `qf-choices n${cur.choices.length}`;
    box.innerHTML = cur.choices.map((c, i) => `<button class="qf-c" data-i="${i}">${c}</button>`).join('');
    lock = false;
  };
  body.querySelector('.qf-choices').addEventListener('click', (e) => {
    const b = e.target.closest('.qf-c'); if (!b || lock || over) return;
    lock = true;
    const ok = +b.dataset.i === cur.answer;
    b.classList.add(ok ? 'right' : 'wrong');
    if (ok) {
      score++; streak++; best = Math.max(best, streak); level = 1 + Math.floor(score / 4);
      ctx.sound(streak % 5 === 0 ? 'crit' : 'correct');
      if (streak % 5 === 0) { left += 3; ctx.toast(`${streak} in a row — +3s`); }
      setTimeout(next, 220);
    } else {
      streak = 0; left = Math.max(0, left - 3); ctx.sound('wrong');
      body.querySelectorAll('.qf-c')[cur.answer]?.classList.add('right');
      if (cur.why) body.querySelector('.qf-why').textContent = cur.why;
      setTimeout(next, cur.why ? 1300 : 700);
    }
    body.querySelector('.gb-score').textContent = score;
    body.querySelector('.r-streak').textContent = streak >= 3 ? `🔥 ${streak}` : '';
  });
  next();
  const timer = setInterval(() => {
    if (over) return;
    left--; body.querySelector('.gb-time').textContent = `${left}s`;
    body.querySelector('.gb-time').classList.toggle('low', left <= 10);
    if (left <= 0) {
      over = true; clearInterval(timer);
      done(ctx, body, cfg.id, score, Math.min(90, score * 3), { title: 'Time!', big: score, unit: 'correct', line: `best streak ${best}`, again: () => ctx.startGame(cfg.id), share: `I got ${score} right in ${cfg.title} on MathScroll!` });
    }
  }, 1000);
  ctx.openSheet(cfg.title, body, 'tall', stopper(() => { over = true; clearInterval(timer); }));
}

const GEN = {
  prime(level) {
    const hi = [50, 100, 200, 500, 1000][Math.min(4, level - 1)];
    let n = between(2, hi);
    if (rnd(2)) { while (!isPrime(n)) n++; }
    if (!isPrime(n) && level > 2 && rnd(2)) { const a = pick([7, 11, 13, 17, 19, 23]); n = a * pick([7, 11, 13, 17, 19]); } // sneaky composites
    const p = isPrime(n);
    return { q: `<div class="qf-big">${n}</div>`, choices: ['Prime', 'Not prime'], answer: p ? 0 : 1, why: p ? `${n} is prime.` : `${n} = ${factorise(n).join(' × ')}` };
  },
  compare(level) {
    const kinds = [
      () => { const a = between(2, 9); const b = between(2, 9); const c = between(2, 9); const d = between(2, 9); return [`${a}^{${b}}`, a ** b, `${c}^{${d}}`, c ** d]; },
      () => { const a = between(1, 12); const b = between(a + 1, 15); const c = between(1, 12); const d = between(c + 1, 15); return [`\\frac{${a}}{${b}}`, a / b, `\\frac{${c}}{${d}}`, c / d]; },
      () => { const a = between(2, 60); const b = between(2, 60); const c = between(2, 60); return [`\\sqrt{${a}}+\\sqrt{${b}}`, Math.sqrt(a) + Math.sqrt(b), `\\sqrt{${c * 4}}`, Math.sqrt(c * 4)]; },
      () => { const n = between(4, 9); const k = between(2, 6); const m = between(2, 9); return [`${n}!`, [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880][n], `${m}^{${k}}`, m ** k]; },
      () => { const a = between(10, 99); const b = between(10, 99); const c = between(10, 99); const d = between(10, 99); return [`${a}\\times${b}`, a * b, `${c}\\times${d}`, c * d]; },
    ];
    for (;;) {
      const [l, lv, r, rv] = kinds[rnd(Math.min(kinds.length, 2 + level))]();
      if (Math.abs(lv - rv) < 1e-9) continue;
      return { q: '<div class="qf-label">Which is bigger?</div>', choices: [ctx2tex(l), ctx2tex(r)], answer: lv > rv ? 0 : 1, why: `${round(lv)} vs ${round(rv)}` };
    }
  },
  sequence(level) {
    const a = between(1, 9); const d = between(2, 9); const r = between(2, 3);
    const kinds = [
      () => [Array.from({ length: 6 }, (_, i) => a + d * i), 'add the same amount each time'],
      () => [Array.from({ length: 6 }, (_, i) => a * r ** i), `multiply by ${r}`],
      () => [Array.from({ length: 6 }, (_, i) => (i + a) ** 2), 'squares'],
      () => [Array.from({ length: 6 }, (_, i) => ((i + a) * (i + a + 1)) / 2), 'triangular numbers'],
      () => { const s = [a, d]; while (s.length < 6) s.push(s[s.length - 1] + s[s.length - 2]); return [s, 'add the previous two']; },
      () => { const s = [a]; for (let i = 1; i < 6; i++) s.push(s[i - 1] + d + i - 1); return [s, 'the gaps grow by 1']; },
      () => { const ps = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43]; const k = rnd(6); return [ps.slice(k, k + 6), 'primes']; },
      () => [Array.from({ length: 6 }, (_, i) => (i + 1) ** 3), 'cubes'],
      () => [Array.from({ length: 6 }, (_, i) => a + (i % 2 ? -d : d) * i), 'alternating signs'],
    ];
    const [s, why] = kinds[rnd(Math.min(kinds.length, 3 + level))]();
    const ans = s.pop();
    const opts = options(ans, Math.max(3, Math.round(Math.abs(ans) * 0.15)));
    return { q: `<div class="qf-seq">${s.join(', ')}, <b>?</b></div>`, choices: opts.map(String), answer: opts.indexOf(ans), why: `${ans} — ${why}` };
  },
  solvex(level) {
    const x = between(-9, 12) || 3;
    let tex;
    const t = rnd(Math.min(4, 1 + level));
    if (t === 0) { const a = between(2, 9); const b = between(-20, 20); tex = `${a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)} = ${a * x + b}`; }
    else if (t === 1) { const a = between(2, 6); const b = between(1, 9); tex = `${a}(x + ${b}) = ${a * (x + b)}`; }
    else if (t === 2) { const a = between(2, 5); const b = between(1, 9); tex = `\\frac{x}{${a}} + ${b} = ${x / a + b}`; if (!Number.isInteger(x / a)) return GEN.solvex(level); }
    else { const r = between(1, 9); const s = between(-9, -1); tex = `x^2 ${-(r + s) < 0 ? '-' : '+'} ${Math.abs(r + s)}x ${r * s < 0 ? '-' : '+'} ${Math.abs(r * s)} = 0,\\ x>0`; const opts = options(r, 3, 1); return { q: `<div class="qf-label">Solve for x</div><div class="qf-tex">${ctx2tex(tex)}</div>`, choices: opts.map(String), answer: opts.indexOf(r) }; }
    const opts = options(x, 3);
    return { q: `<div class="qf-label">Solve for x</div><div class="qf-tex">${ctx2tex(tex)}</div>`, choices: opts.map(String), answer: opts.indexOf(x) };
  },
  estimate(level) {
    const t = rnd(Math.min(4, 1 + level));
    let tex; let v;
    if (t === 0) { const n = between(10, 999); tex = `\\sqrt{${n}}`; v = Math.round(Math.sqrt(n)); }
    else if (t === 1) { const a = between(11, 99); const b = between(11, 99); tex = `${a}\\times${b}`; v = Math.round((a * b) / 100) * 100; }
    else if (t === 2) { const r = between(2, 15); tex = `\\pi\\cdot${r}^2`; v = Math.round(Math.PI * r * r); }
    else { const n = between(100, 99999); tex = `\\log_{2}(${n})`; v = Math.round(Math.log2(n)); }
    const step = t === 1 ? 100 : t === 2 ? Math.max(5, Math.round(v / 6)) : Math.max(1, Math.round(v / 5));
    const opts = shuffle([v, v + step, v - step, v + 2 * step].filter((x) => x > 0)).slice(0, 4);
    if (!opts.includes(v)) opts[0] = v;
    return { q: `<div class="qf-label">Closest to…</div><div class="qf-tex">${ctx2tex(tex)}</div>`, choices: opts.map(String), answer: opts.indexOf(v) };
  },
  binary(level) {
    const n = between(1, [15, 31, 63, 127, 255][Math.min(4, level - 1)]);
    if (level > 2 && rnd(2)) {
      const opts = options(n, 4, 1).map((x) => x.toString(2));
      return { q: `<div class="qf-label">${n} in binary is…</div>`, choices: opts, answer: opts.indexOf(n.toString(2)) };
    }
    const opts = options(n, 4, 0);
    return { q: `<div class="qf-label">In decimal…</div><div class="qf-big mono">${n.toString(2)}<sub>2</sub></div>`, choices: opts.map(String), answer: opts.indexOf(n), why: `${n.toString(2)} = ${[...n.toString(2)].map((b, i, a) => (b === '1' ? 2 ** (a.length - 1 - i) : null)).filter((x) => x != null).join(' + ')}` };
  },
  angle(level) {
    const step = level > 3 ? 5 : 15;
    const a = between(1, Math.floor(175 / step)) * step;
    const rot = rnd(360);
    const r = 80; const p = (deg) => { const t = ((rot + deg) * Math.PI) / 180; return `${100 + r * Math.cos(t)},${100 - r * Math.sin(t)}`; };
    const svg = `<svg viewBox="0 0 200 200" class="qf-angle"><polyline points="${p(0)} 100,100 ${p(a)}" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="100" r="5" fill="currentColor"/></svg>`;
    const gap = level > 3 ? 10 : 20;
    const set = new Set([a]); while (set.size < 4) { const v = a + (rnd(2) ? 1 : -1) * gap * between(1, 3); if (v > 0 && v < 180) set.add(v); }
    const list = shuffle([...set]);
    return { q: `<div class="qf-label">How big is this angle?</div>${svg}`, choices: list.map((x) => `${x}°`), answer: list.indexOf(a), why: `It’s ${a}°` };
  },
  units(level) {
    const b = between(2, 9) + (level > 2 ? 10 * between(1, 9) : 0); const e = between(5, 20 + level * 10);
    const ans = powMod(b, e, 10);
    const set = new Set([ans]); while (set.size < 4) set.add(rnd(10));
    const list = shuffle([...set]);
    return { q: `<div class="qf-label">Last digit of</div><div class="qf-tex">${ctx2tex(`${b}^{${e}}`)}</div>`, choices: list.map(String), answer: list.indexOf(ans), why: `Last digits of powers of ${b % 10} repeat in a cycle.` };
  },
  divisors(level) {
    const n = pick([12, 16, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 60, 64, 72, 80, 84, 90, 96, 100, 108, 120, 144, 180, 210, 240, 360].slice(0, 8 + level * 4));
    const ans = divisorCount(n);
    const opts = options(ans, 3, 2);
    const f = factorise(n); const counts = {}; f.forEach((p) => { counts[p] = (counts[p] || 0) + 1; });
    return { q: `<div class="qf-label">How many divisors does</div><div class="qf-big">${n}</div><div class="qf-label">have?</div>`, choices: opts.map(String), answer: opts.indexOf(ans), why: `${n} = ${Object.entries(counts).map(([p, e]) => (e > 1 ? `${p}^${e}` : p)).join('·')} → ${Object.values(counts).map((e) => `(${e}+1)`).join('')} = ${ans}` };
  },
  mod(level) {
    const m = between(3, 6 + level * 2);
    let tex; let ans;
    if (level < 3 || rnd(2)) { const n = between(20, 100 * level); tex = `${n} \\bmod ${m}`; ans = n % m; }
    else { const b = between(2, 12); const e = between(2, 30); tex = `${b}^{${e}} \\bmod ${m}`; ans = powMod(b, e, m); }
    const set = new Set([ans]); while (set.size < Math.min(4, m)) set.add(rnd(m));
    const list = shuffle([...set]);
    return { q: `<div class="qf-label">Remainder</div><div class="qf-tex">${ctx2tex(tex)}</div>`, choices: list.map(String), answer: list.indexOf(ans) };
  },
};
const round = (v) => (Number.isInteger(v) ? v : v.toFixed(3));
let texFn = (s) => s;
const ctx2tex = (s) => texFn(s);

export const QUICKFIRE = [
  { id: 'qf_prime', gen: 'prime', title: 'Prime or Not', icon: '🔍', blurb: 'Is it prime? Watch out for 91 and 221.' },
  { id: 'qf_compare', gen: 'compare', title: 'Which Is Bigger?', icon: '⚖️', blurb: 'Powers, fractions, roots and factorials, head to head.' },
  { id: 'qf_sequence', gen: 'sequence', title: 'Next in Line', icon: '🔗', blurb: 'Spot the pattern and pick the next term.' },
  { id: 'qf_solvex', gen: 'solvex', title: 'Solve for x', icon: '𝑥', blurb: 'Equations at speed, from 2x+3 to quadratics.' },
  { id: 'qf_estimate', gen: 'estimate', title: 'Estimation Station', icon: '🎯', blurb: 'Roots, products, circles and logs: get close.' },
  { id: 'qf_binary', gen: 'binary', title: 'Binary Bits', icon: '💾', blurb: 'Read and write numbers in base 2.' },
  { id: 'qf_angle', gen: 'angle', title: 'Angle Eye', icon: '📐', blurb: 'Judge angles by eye.' },
  { id: 'qf_units', gen: 'units', title: 'Last Digit', icon: '🔚', blurb: 'The last digit of huge powers, using cycles.' },
  { id: 'qf_divisors', gen: 'divisors', title: 'Divisor Count', icon: '➗', blurb: 'How many divisors? Use prime factorisation.' },
  { id: 'qf_mod', gen: 'mod', title: 'Clock Maths', icon: '🕐', blurb: 'Remainders and modular powers.' },
];

// ------------------------------------------------------------------ 2048
function g2048(ctx) {
  const N = 4; let g = Array.from({ length: N }, () => Array(N).fill(0)); let score = 0; let over = false; let won = false;
  const body = el(`<div class="g2048"><div class="gb-top"><span class="gb-score">0</span><span class="small">Swipe to merge equal tiles</span><span class="bb-best">Best ${ctx.bests().g2048 || 0}</span></div><div class="t-board"></div></div>`);
  const board = body.querySelector('.t-board');
  const add = () => { const free = []; g.forEach((r, i) => r.forEach((v, j) => { if (!v) free.push([i, j]); })); if (!free.length) return; const [i, j] = pick(free); g[i][j] = Math.random() < 0.9 ? 2 : 4; };
  const draw = () => { board.innerHTML = g.flat().map((v) => `<div class="t2 v${Math.min(v, 4096)}">${v || ''}</div>`).join(''); body.querySelector('.gb-score').textContent = score; };
  const slide = (row) => { const a = row.filter(Boolean); for (let i = 0; i < a.length - 1; i++) if (a[i] === a[i + 1]) { a[i] *= 2; score += a[i]; if (a[i] === 2048 && !won) { won = true; ctx.toast('2048! Keep going…'); } a.splice(i + 1, 1); } while (a.length < N) a.push(0); return a; };
  const move = (dir) => {
    if (over) return;
    const before = JSON.stringify(g);
    for (let k = 0; k < N; k++) {
      let line = dir === 'L' || dir === 'R' ? g[k].slice() : g.map((r) => r[k]);
      if (dir === 'R' || dir === 'D') line.reverse();
      line = slide(line);
      if (dir === 'R' || dir === 'D') line.reverse();
      line.forEach((v, i) => { if (dir === 'L' || dir === 'R') g[k][i] = v; else g[i][k] = v; });
    }
    if (JSON.stringify(g) === before) return;
    add(); draw(); ctx.sound('quest');
    const canMove = g.some((r, i) => r.some((v, j) => !v || (j < N - 1 && v === r[j + 1]) || (i < N - 1 && v === g[i + 1][j])));
    if (!canMove) { over = true; setTimeout(() => done(ctx, body, 'g2048', score, Math.min(120, Math.round(score / 60)), { title: 'No moves left', big: score, unit: 'points', again: () => ctx.startGame('g2048'), share: `I scored ${score} in 2048 on MathScroll!` }), 600); }
  };
  let sx = 0; let sy = 0;
  board.addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; });
  board.addEventListener('pointerup', (e) => { const dx = e.clientX - sx; const dy = e.clientY - sy; if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return; move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'R' : 'L') : (dy > 0 ? 'D' : 'U')); });
  const key = (e) => { const m = { ArrowLeft: 'L', ArrowRight: 'R', ArrowUp: 'U', ArrowDown: 'D' }[e.key]; if (m) { e.preventDefault(); move(m); } };
  document.addEventListener('keydown', key);
  add(); add(); draw();
  ctx.openSheet('2048', body, 'tall', stopper(() => { over = true; document.removeEventListener('keydown', key); }));
  body._test = { grid: () => g, move, set: (x) => { g = x; draw(); } };
}

// ------------------------------------------------------------------ Sudoku
function sudokuSolve(b, randomise = false) {
  const i = b.indexOf(0); if (i < 0) return true;
  const r = Math.floor(i / 9); const c = i % 9;
  const digits = randomise ? shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]) : [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (const d of digits) {
    let ok = true;
    for (let k = 0; k < 9 && ok; k++) if (b[r * 9 + k] === d || b[k * 9 + c] === d || b[(3 * Math.floor(r / 3) + Math.floor(k / 3)) * 9 + 3 * Math.floor(c / 3) + (k % 3)] === d) ok = false;
    if (ok) { b[i] = d; if (sudokuSolve(b, randomise)) return true; b[i] = 0; }
  }
  return false;
}
function sudoku(ctx, level = null) {
  if (level == null) {
    const pickEl = el(`<div class="chess-pick"><p>Pick a difficulty.</p>${[['Easy', 42], ['Medium', 34], ['Hard', 28]].map(([n, g], i) => `<button class="game-tile" data-l="${i}"><span class="g-text"><b>${n}</b><small>${g} numbers given</small></span></button>`).join('')}</div>`);
    pickEl.querySelectorAll('[data-l]').forEach((b) => b.addEventListener('click', () => sudoku(ctx, +b.dataset.l)));
    ctx.openSheet('Sudoku', pickEl, 'tall');
    return;
  }
  const full = Array(81).fill(0); sudokuSolve(full, true);
  const givens = [42, 34, 28][level];
  const puzzle = full.slice(); shuffle([...Array(81).keys()]).slice(0, 81 - givens).forEach((i) => { puzzle[i] = 0; });
  const cur = puzzle.slice(); let sel = -1; const start = Date.now(); let over = false;
  const body = el(`<div class="sudoku"><div class="gb-top"><span>${['Easy', 'Medium', 'Hard'][level]}</span><span class="gb-time">0:00</span></div><div class="su-grid"></div>
    <div class="su-pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => `<button class="r-key" data-d="${d}">${d}</button>`).join('')}<button class="r-key" data-d="0">⌫</button></div></div>`);
  const grid = body.querySelector('.su-grid');
  const conflict = (i) => { const v = cur[i]; if (!v) return false; const r = Math.floor(i / 9); const c = i % 9; for (let k = 0; k < 81; k++) { if (k === i || cur[k] !== v) continue; const r2 = Math.floor(k / 9); const c2 = k % 9; if (r2 === r || c2 === c || (Math.floor(r2 / 3) === Math.floor(r / 3) && Math.floor(c2 / 3) === Math.floor(c / 3))) return true; } return false; };
  const draw = () => {
    grid.innerHTML = cur.map((v, i) => `<button class="su-c ${puzzle[i] ? 'given' : ''} ${i === sel ? 'sel' : ''} ${sel >= 0 && v && v === cur[sel] ? 'same' : ''} ${conflict(i) ? 'bad' : ''} ${i % 9 === 2 || i % 9 === 5 ? 'br' : ''} ${Math.floor(i / 9) === 2 || Math.floor(i / 9) === 5 ? 'bb' : ''}" data-i="${i}">${v || ''}</button>`).join('');
  };
  grid.addEventListener('click', (e) => { const c = e.target.closest('.su-c'); if (!c) return; sel = +c.dataset.i; draw(); });
  body.querySelector('.su-pad').addEventListener('click', (e) => {
    const k = e.target.closest('[data-d]'); if (!k || sel < 0 || puzzle[sel] || over) return;
    cur[sel] = +k.dataset.d; ctx.sound('quest'); draw();
    if (cur.every((v, i) => v && !conflict(i))) {
      over = true; const secs = Math.round((Date.now() - start) / 1000);
      const xp = [40, 60, 90][level]; ctx.sound('level');
      setTimeout(() => done(ctx, body, 'sudoku', [1000, 2000, 3000][level] - Math.min(900, secs), xp, { title: 'Solved!', big: `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`, line: ['Easy', 'Medium', 'Hard'][level], again: () => ctx.startGame('sudoku'), share: `I solved a ${['easy', 'medium', 'hard'][level]} Sudoku in ${Math.floor(secs / 60)}m${secs % 60}s on MathScroll!` }), 500);
    }
  });
  const timer = setInterval(() => { if (over) return clearInterval(timer); const s = Math.round((Date.now() - start) / 1000); body.querySelector('.gb-time').textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }, 1000);
  draw();
  ctx.openSheet('Sudoku', body, 'tall', stopper(() => { over = true; clearInterval(timer); }));
  body._test = { solve: () => { for (let i = 0; i < 81; i++) if (!puzzle[i]) { sel = i; cur[i] = full[i]; } cur[sel] = 0; draw(); return { sel, digit: full[sel] }; } };
}

// ------------------------------------------------------------------ Minesweeper
function mines(ctx) {
  const R = 10; const C = 8; const M = 12;
  let mine = null; const open = Array(R * C).fill(false); const flag = Array(R * C).fill(false); let flagMode = false; let over = false; let start = 0;
  const body = el(`<div class="mines"><div class="gb-top"><span class="m-left">💣 ${M}</span><button class="btn ghost small m-flag">🚩 Flag: off</button><span class="gb-time">0s</span></div><div class="m-grid" style="--c:${C}"></div><p class="small">Tap to dig. Numbers count the mines touching a square. Turn on 🚩 to mark mines.</p></div>`);
  const grid = body.querySelector('.m-grid');
  const nb = (i) => { const r = Math.floor(i / C); const c = i % C; const out = []; for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { const rr = r + dr; const cc = c + dc; if ((dr || dc) && rr >= 0 && rr < R && cc >= 0 && cc < C) out.push(rr * C + cc); } return out; };
  const count = (i) => nb(i).filter((j) => mine[j]).length;
  const lay = (safe) => { mine = Array(R * C).fill(false); const banned = new Set([safe, ...nb(safe)]); let k = 0; while (k < M) { const i = rnd(R * C); if (!mine[i] && !banned.has(i)) { mine[i] = true; k++; } } start = Date.now(); };
  const draw = () => {
    grid.innerHTML = open.map((o, i) => { const n = o && !mine[i] ? count(i) : 0; return `<button class="m-c ${o ? 'open' : ''} ${o && mine[i] ? 'boom' : ''} n${n}" data-i="${i}">${o ? (mine[i] ? '💣' : n || '') : flag[i] ? '🚩' : ''}</button>`; }).join('');
    body.querySelector('.m-left').textContent = `💣 ${M - flag.filter(Boolean).length}`;
  };
  const dig = (i) => {
    if (open[i] || flag[i]) return;
    open[i] = true;
    if (!mine[i] && count(i) === 0) nb(i).forEach(dig);
  };
  grid.addEventListener('click', (e) => {
    const c = e.target.closest('.m-c'); if (!c || over) return;
    const i = +c.dataset.i;
    if (!mine) lay(i);
    if (flagMode) { if (!open[i]) { flag[i] = !flag[i]; ctx.sound('quest'); } draw(); return; }
    if (flag[i]) return;
    dig(i); ctx.sound(mine[i] ? 'wrong' : 'quest');
    if (mine[i]) { over = true; mine.forEach((m, j) => { if (m) open[j] = true; }); draw(); setTimeout(() => done(ctx, body, 'mines', 0, 3, { title: 'Boom!', big: '💥', line: 'Try again', again: () => ctx.startGame('mines'), share: 'Minesweeper on MathScroll got me 💥' }), 1100); return; }
    draw();
    if (open.filter((o, j) => o && !mine[j]).length === R * C - M) {
      over = true; const secs = Math.round((Date.now() - start) / 1000); ctx.sound('level');
      setTimeout(() => done(ctx, body, 'mines', Math.max(10, 600 - secs), 50, { title: 'Cleared!', big: `${secs}s`, again: () => ctx.startGame('mines'), share: `I cleared Minesweeper in ${secs}s on MathScroll!` }), 500);
    }
  });
  body.querySelector('.m-flag').addEventListener('click', (e) => { flagMode = !flagMode; e.currentTarget.textContent = `🚩 Flag: ${flagMode ? 'on' : 'off'}`; e.currentTarget.classList.toggle('on', flagMode); });
  const timer = setInterval(() => { if (over || !mine) return; body.querySelector('.gb-time').textContent = `${Math.round((Date.now() - start) / 1000)}s`; }, 1000);
  draw();
  ctx.openSheet('Minesweeper', body, 'tall', stopper(() => { over = true; clearInterval(timer); }));
  body._test = { mines: () => mine, dig: (i) => grid.querySelector(`[data-i="${i}"]`).click() };
}

// ------------------------------------------------------------------ Lights Out
function lights(ctx, level = 1) {
  const N = 5; let on = Array(N * N).fill(false); let moves = 0; let over = false;
  const press = (i, arr = on) => { const r = Math.floor(i / N); const c = i % N; [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => { const rr = r + dr; const cc = c + dc; if (rr >= 0 && rr < N && cc >= 0 && cc < N) arr[rr * N + cc] = !arr[rr * N + cc]; }); };
  const taps = shuffle([...Array(N * N).keys()]).slice(0, Math.min(3 + level * 2, 15)); // solvable: built from real presses
  taps.forEach((i) => press(i));
  const body = el(`<div class="lights"><div class="gb-top"><span>Level ${level}</span><span class="small">Turn every light off</span><span class="l-moves">0 moves</span></div><div class="l-grid"></div><p class="small">Pressing a light flips it and its neighbours. (It’s linear algebra over ℤ/2!)</p></div>`);
  const grid = body.querySelector('.l-grid');
  const draw = () => { grid.innerHTML = on.map((v, i) => `<button class="l-c ${v ? 'on' : ''}" data-i="${i}"></button>`).join(''); body.querySelector('.l-moves').textContent = `${moves} moves`; };
  grid.addEventListener('click', (e) => {
    const c = e.target.closest('.l-c'); if (!c || over) return;
    press(+c.dataset.i); moves++; ctx.sound('quest'); draw();
    if (on.every((v) => !v)) {
      over = true; ctx.sound('level');
      ctx.recordBest('lights', level); ctx.gameDone('lights', 10 + level * 5);
      setTimeout(() => { const p = el(`<div class="bb-stuck"><b>Lights out!</b><p>Level ${level} in ${moves} moves (fewest possible ≤ ${taps.length})</p><button class="btn wide nx">Level ${level + 1}</button><button class="btn ghost wide more-g">More games</button></div>`); body.appendChild(p); p.querySelector('.nx').addEventListener('click', () => lights(ctx, level + 1)); p.querySelector('.more-g').addEventListener('click', () => ctx.openGames()); }, 400);
    }
  });
  draw();
  ctx.openSheet('Lights Out', body, 'tall');
  body._test = { taps };
}

// ------------------------------------------------------------------ Tower of Hanoi
function hanoi(ctx, n = 3) {
  let pegs = [[...Array(n).keys()].map((k) => n - k), [], []]; let held = null; let moves = 0; let over = false;
  const min = 2 ** n - 1;
  const body = el(`<div class="hanoi"><div class="gb-top"><span>${n} discs</span><span class="small">Best possible: ${min}</span><span class="h-moves">0 moves</span></div><div class="h-pegs"></div><p class="small">Move the tower to the right peg. Never put a bigger disc on a smaller one. Tap a peg to pick up, tap another to drop.</p></div>`);
  const box = body.querySelector('.h-pegs');
  const draw = () => {
    box.innerHTML = pegs.map((p, i) => `<button class="h-peg ${held === i ? 'held' : ''}" data-i="${i}"><span class="h-pole"></span>${p.map((d, k) => `<span class="h-disc" style="--w:${30 + (60 * d) / n}%;--h:${(d * 47) % 360};bottom:${8 + k * 22}px">${''}</span>`).join('')}</button>`).join('');
    body.querySelector('.h-moves').textContent = `${moves} moves`;
  };
  box.addEventListener('click', (e) => {
    const p = e.target.closest('.h-peg'); if (!p || over) return;
    const i = +p.dataset.i;
    if (held === null) { if (pegs[i].length) { held = i; ctx.sound('quest'); } }
    else {
      const d = pegs[held][pegs[held].length - 1]; const top = pegs[i][pegs[i].length - 1];
      if (i !== held && (top === undefined || top > d)) { pegs[i].push(pegs[held].pop()); moves++; ctx.sound('correct'); } else if (i !== held) ctx.sound('wrong');
      held = null;
    }
    draw();
    if (pegs[2].length === n) {
      over = true; ctx.sound('level');
      ctx.recordBest('hanoi', n); ctx.gameDone('hanoi', 10 + n * 8 + (moves === min ? 15 : 0));
      setTimeout(() => { const pnl = el(`<div class="bb-stuck"><b>${moves === min ? 'Perfect!' : 'Solved!'}</b><p>${moves} moves (best possible ${min} = 2<sup>${n}</sup> − 1)</p>${n < 8 ? `<button class="btn wide nx">Try ${n + 1} discs</button>` : ''}<button class="btn ghost wide more-g">More games</button></div>`); body.appendChild(pnl); pnl.querySelector('.nx')?.addEventListener('click', () => hanoi(ctx, n + 1)); pnl.querySelector('.more-g').addEventListener('click', () => ctx.openGames()); }, 300);
    }
  });
  draw();
  ctx.openSheet('Tower of Hanoi', body, 'tall');
}

// ------------------------------------------------------------------ 15-puzzle
function fifteen(ctx, N = 4) {
  let t = [...Array(N * N).keys()].map((k) => (k + 1) % (N * N)); // 0 = gap, at the end
  let gap = N * N - 1; let moves = 0; let over = false; const start = Date.now();
  const nbrs = (i) => [i - N, i + N, i % N ? i - 1 : -1, (i + 1) % N ? i + 1 : -1].filter((j) => j >= 0 && j < N * N);
  for (let k = 0, prev = -1; k < 200 * N; k++) { const opts = nbrs(gap).filter((j) => j !== prev); const j = pick(opts); [t[gap], t[j]] = [t[j], t[gap]]; prev = gap; gap = j; }
  const body = el(`<div class="fifteen"><div class="gb-top"><span>${N}×${N}</span><span class="small">Put the numbers in order</span><span class="f-moves">0 moves</span></div><div class="f-grid" style="--n:${N}"></div></div>`);
  const grid = body.querySelector('.f-grid');
  const draw = () => { grid.innerHTML = t.map((v, i) => `<button class="f-c ${v ? '' : 'gap'} ${v && v === i + 1 ? 'home' : ''}" data-i="${i}">${v || ''}</button>`).join(''); body.querySelector('.f-moves').textContent = `${moves} moves`; };
  grid.addEventListener('click', (e) => {
    const c = e.target.closest('.f-c'); if (!c || over) return;
    const i = +c.dataset.i; if (!nbrs(gap).includes(i)) return;
    [t[gap], t[i]] = [t[i], t[gap]]; gap = i; moves++; ctx.sound('quest'); draw();
    if (t.every((v, k) => v === (k + 1) % (N * N))) {
      over = true; const secs = Math.round((Date.now() - start) / 1000); ctx.sound('level');
      setTimeout(() => done(ctx, body, 'fifteen', Math.max(10, 1000 - moves * 2 - secs), N === 3 ? 30 : 60, { title: 'Solved!', big: moves, unit: 'moves', line: `${secs}s`, again: () => ctx.startGame('fifteen'), share: `I solved the 15-puzzle in ${moves} moves on MathScroll!` }), 400);
    }
  });
  draw();
  ctx.openSheet(`${N * N - 1}-Puzzle`, body, 'tall', stopper(() => { over = true; }));
  body._test = { solve: () => { t = [...Array(N * N).keys()].map((k) => (k + 1) % (N * N)); [t[N * N - 1], t[N * N - 2]] = [t[N * N - 2], t[N * N - 1]]; gap = N * N - 2; draw(); } };
}

// ------------------------------------------------------------------ Mastermind (bulls & cows)
function mastermind(ctx) {
  const secret = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4).join('');
  let guess = ''; const rows = []; let over = false;
  const body = el(`<div class="mastermind"><div class="gb-top"><span>Guess the 4-digit code</span><span class="mm-left">10 tries</span></div>
    <p class="small">All four digits are different. 🎯 = right digit, right place · ⚪ = right digit, wrong place.</p>
    <div class="mm-rows"></div><div class="mm-now"></div>
    <div class="r-pad">${['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓'].map((k) => `<button class="r-key" data-k="${k}">${k}</button>`).join('')}</div></div>`);
  const draw = () => {
    body.querySelector('.mm-rows').innerHTML = rows.map(([g, b, c]) => `<div class="mm-row"><span class="mono">${g}</span><span>${'🎯'.repeat(b)}${'⚪'.repeat(c)}${!b && !c ? '—' : ''}</span></div>`).join('');
    body.querySelector('.mm-now').textContent = guess.padEnd(4, '·');
    body.querySelector('.mm-left').textContent = `${10 - rows.length} tries`;
  };
  body.querySelector('.r-pad').addEventListener('click', (e) => {
    const k = e.target.closest('[data-k]')?.dataset.k; if (!k || over) return;
    if (k === '⌫') guess = guess.slice(0, -1);
    else if (k === '✓') {
      if (guess.length !== 4) return;
      const b = [...guess].filter((d, i) => secret[i] === d).length;
      const c = [...guess].filter((d, i) => secret.includes(d) && secret[i] !== d).length;
      rows.push([guess, b, c]); guess = ''; ctx.sound(b === 4 ? 'level' : b + c ? 'quest' : 'wrong');
      if (b === 4 || rows.length >= 10) {
        over = true; draw();
        const n = rows.length; const win = b === 4;
        setTimeout(() => done(ctx, body, 'mastermind', win ? 11 - n : 0, win ? 15 + (10 - n) * 6 : 3, { title: win ? 'Cracked it!' : `The code was ${secret}`, big: win ? n : '🔒', unit: win ? (n === 1 ? 'guess' : 'guesses') : '', again: () => ctx.startGame('mastermind'), share: win ? `I cracked the code in ${n} guesses on MathScroll!` : 'The MathScroll code beat me.' }), 600);
        return;
      }
    } else if (guess.length < 4 && !guess.includes(k)) guess += k;
    draw();
  });
  draw();
  ctx.openSheet('Code Breaker', body, 'tall');
  body._test = { secret };
}

// ------------------------------------------------------------------ Nim
function nim(ctx, wins = 0) {
  const heaps = Array.from({ length: between(3, 4) }, () => between(1, 7));
  let yourTurn = true; let over = false;
  const body = el(`<div class="nim"><div class="gb-top"><span>Win streak ${wins}</span><span class="nim-status">Your turn</span></div>
    <p class="small">Take any number of stones from <b>one</b> row (tap a stone to take it and everything to its right). Whoever takes the last stone wins.</p><div class="nim-heaps"></div>
    <button class="btn ghost small nim-hint">💡 Hint (1⚡)</button><p class="small nim-why"></p></div>`);
  const draw = (hl = null) => {
    body.querySelector('.nim-heaps').innerHTML = heaps.map((h, r) => `<div class="nim-row">${Array.from({ length: h }, (_, k) => `<button class="nim-s ${hl && hl[0] === r && k >= h - hl[1] ? 'hl' : ''}" data-r="${r}" data-k="${k}"></button>`).join('') || '<span class="small">empty</span>'}</div>`).join('');
  };
  const xor = () => heaps.reduce((a, b) => a ^ b, 0);
  const bestMove = () => { const x = xor(); if (x) for (let r = 0; r < heaps.length; r++) { const t = heaps[r] ^ x; if (t < heaps[r]) return [r, heaps[r] - t]; } const r = heaps.findIndex((h) => h > 0); return [r, 1]; };
  const end = (youWon) => {
    over = true; ctx.sound(youWon ? 'level' : 'wrong');
    const streak = youWon ? wins + 1 : 0;
    ctx.recordBest('nim', streak); ctx.gameDone('nim', youWon ? 25 + wins * 5 : 3);
    const p = el(`<div class="bb-stuck"><b>${youWon ? 'You win!' : 'Computer wins'}</b><p>${youWon ? `Streak ${streak}.` : 'The secret: XOR the row sizes in binary. Leave your opponent a total of 0 and you can’t lose.'}</p><button class="btn wide nx">${youWon ? 'Next game' : 'Try again'}</button><button class="btn ghost wide more-g">More games</button></div>`);
    body.appendChild(p);
    p.querySelector('.nx').addEventListener('click', () => nim(ctx, streak));
    p.querySelector('.more-g').addEventListener('click', () => ctx.openGames());
  };
  const computer = () => {
    body.querySelector('.nim-status').textContent = 'Computer’s turn…';
    setTimeout(() => {
      if (over) return;
      // A little mercy early in a streak: sometimes a random move.
      const [r, n] = Math.random() < Math.max(0.05, 0.45 - wins * 0.1) ? (() => { const rr = pick(heaps.map((h, i) => (h ? i : -1)).filter((i) => i >= 0)); return [rr, between(1, heaps[rr])]; })() : bestMove();
      heaps[r] -= n; draw([r, 0]); ctx.sound('quest');
      if (heaps.every((h) => !h)) return end(false);
      yourTurn = true; body.querySelector('.nim-status').textContent = 'Your turn';
    }, 700);
  };
  body.querySelector('.nim-heaps').addEventListener('click', (e) => {
    const s = e.target.closest('.nim-s'); if (!s || !yourTurn || over) return;
    const r = +s.dataset.r; const k = +s.dataset.k;
    heaps[r] = k; yourTurn = false; draw(); ctx.sound('correct'); body.querySelector('.nim-why').textContent = '';
    if (heaps.every((h) => !h)) return end(true);
    computer();
  });
  body.querySelector('.nim-hint').addEventListener('click', () => {
    if (!yourTurn || over || !ctx.spend(1)) { if (!over && yourTurn) ctx.toast('A hint costs 1 ⚡'); return; }
    const x = xor(); const [r, n] = bestMove();
    draw([r, n]);
    body.querySelector('.nim-why').textContent = x ? `Take ${n} from row ${r + 1} — that makes the XOR of the rows 0.` : 'No winning move right now (the XOR is already 0). Take one and hope!';
  });
  draw();
  ctx.openSheet('Nim', body, 'tall', stopper(() => { over = true; }));
}

// ------------------------------------------------------------------ Magic square
function magic(ctx, N = 3) {
  const target = (N * (N * N + 1)) / 2;
  // A random 3×3 or 4×4 magic square (rotations/reflections of standard ones), then hide some cells.
  let sq = N === 3 ? [8, 1, 6, 3, 5, 7, 4, 9, 2] : [16, 2, 3, 13, 5, 11, 10, 8, 9, 7, 6, 12, 4, 14, 15, 1];
  const rot = (a) => a.map((_, i) => a[(N - 1 - (i % N)) * N + Math.floor(i / N)]);
  for (let k = rnd(4); k > 0; k--) sq = rot(sq);
  if (rnd(2)) sq = sq.map((_, i) => sq[Math.floor(i / N) * N + (N - 1 - (i % N))]);
  const hidden = new Set(shuffle([...Array(N * N).keys()]).slice(0, N === 3 ? 6 : 9));
  const cur = sq.map((v, i) => (hidden.has(i) ? 0 : v)); let sel = [...hidden][0]; let over = false;
  const body = el(`<div class="magic"><div class="gb-top"><span>${N}×${N}</span><span class="small">Every row, column and diagonal adds to <b>${target}</b></span></div><div class="mg-grid" style="--n:${N}"></div><div class="mg-sums small"></div>
    <div class="mg-pad">${[...Array(N * N).keys()].map((k) => `<button class="r-key" data-d="${k + 1}">${k + 1}</button>`).join('')}<button class="r-key" data-d="0">⌫</button></div></div>`);
  const grid = body.querySelector('.mg-grid');
  const sums = () => { const out = []; for (let r = 0; r < N; r++) out.push(cur.slice(r * N, r * N + N)); return out; };
  const draw = () => {
    grid.innerHTML = cur.map((v, i) => `<button class="mg-c ${hidden.has(i) ? '' : 'given'} ${i === sel ? 'sel' : ''}" data-i="${i}">${v || ''}</button>`).join('');
    const rows = sums().map((r) => r.reduce((a, b) => a + b, 0));
    body.querySelector('.mg-sums').textContent = `Row sums: ${rows.join(', ')}`;
    body.querySelectorAll('.mg-pad [data-d]').forEach((b) => b.classList.toggle('used', +b.dataset.d > 0 && cur.includes(+b.dataset.d)));
  };
  grid.addEventListener('click', (e) => { const c = e.target.closest('.mg-c'); if (!c || !hidden.has(+c.dataset.i)) return; sel = +c.dataset.i; draw(); });
  body.querySelector('.mg-pad').addEventListener('click', (e) => {
    const k = e.target.closest('[data-d]'); if (!k || over) return;
    const d = +k.dataset.d; if (d && cur.includes(d)) return;
    cur[sel] = d; ctx.sound('quest'); draw();
    const lines = []; for (let i = 0; i < N; i++) { lines.push([...Array(N).keys()].map((j) => cur[i * N + j])); lines.push([...Array(N).keys()].map((j) => cur[j * N + i])); }
    lines.push([...Array(N).keys()].map((j) => cur[j * N + j])); lines.push([...Array(N).keys()].map((j) => cur[j * N + N - 1 - j]));
    if (cur.every(Boolean) && lines.every((l) => l.reduce((a, b) => a + b, 0) === target)) {
      over = true; ctx.sound('level');
      ctx.recordBest('magic', N); ctx.gameDone('magic', N === 3 ? 25 : 60);
      setTimeout(() => { const p = el(`<div class="bb-stuck"><b>Magic!</b><p>Every line adds to ${target}.</p>${N === 3 ? '<button class="btn wide nx">Try 4×4</button>' : '<button class="btn wide nx">Another 4×4</button>'}<button class="btn ghost wide more-g">More games</button></div>`); body.appendChild(p); p.querySelector('.nx').addEventListener('click', () => magic(ctx, 4)); p.querySelector('.more-g').addEventListener('click', () => ctx.openGames()); }, 300);
    } else {
      const nxt = [...hidden].find((i) => !cur[i]); if (nxt != null) { sel = nxt; draw(); }
    }
  });
  draw();
  ctx.openSheet('Magic Square', body, 'tall');
  body._test = { answer: () => sq, hidden: () => [...hidden] };
}

// ------------------------------------------------------------------ Memory match
const PAIRS = [
  ['\\frac12', '0.5'], ['\\frac14', '25\\%'], ['\\frac34', '0.75'], ['2^5', '32'], ['\\sqrt{49}', '7'], ['3!', '6'], ['\\frac{1}{5}', '20\\%'],
  ['10^3', '1000'], ['\\binom{5}{2}', '10'], ['\\sqrt{2}^2', '2'], ['\\frac{2}{3}', '0.\\overline{6}'], ['4^{1/2}', '2'], ['\\log_2 8', '3'], ['\\pi', '3.14159…'],
  ['0.125', '\\frac18'], ['5^2+12^2', '13^2'], ['11^2', '121'], ['\\frac{7}{8}', '87.5\\%'], ['\\sqrt[3]{27}', '3'], ['2^{-1}', '0.5'], ['6\\times7', '42'], ['\\sin 30^\\circ', '\\frac12'],
];
function memory(ctx) {
  const chosen = shuffle(PAIRS.slice()).filter((p, i, a) => a.findIndex((q) => q[1] === p[1]) === i).slice(0, 6);
  const cards = shuffle(chosen.flatMap(([a, b], k) => [{ k, t: a }, { k, t: b }]));
  let up = []; let matched = 0; let moves = 0; let lock = false; const start = Date.now();
  const body = el(`<div class="memory"><div class="gb-top"><span class="mem-moves">0 moves</span><span class="small">Match equal values</span><span>${chosen.length} pairs</span></div><div class="mem-grid"></div></div>`);
  const grid = body.querySelector('.mem-grid');
  grid.innerHTML = cards.map((c, i) => `<button class="mem-c" data-i="${i}"><span class="mem-front">?</span><span class="mem-back">${ctx2tex(c.t)}</span></button>`).join('');
  grid.addEventListener('click', (e) => {
    const b = e.target.closest('.mem-c'); if (!b || lock || b.classList.contains('up') || b.classList.contains('done')) return;
    b.classList.add('up'); up.push(b); ctx.sound('quest');
    if (up.length < 2) return;
    moves++; body.querySelector('.mem-moves').textContent = `${moves} moves`;
    const [x, y] = up; up = [];
    if (cards[+x.dataset.i].k === cards[+y.dataset.i].k) {
      x.classList.add('done'); y.classList.add('done'); matched++; ctx.sound('correct');
      if (matched === chosen.length) {
        const secs = Math.round((Date.now() - start) / 1000);
        setTimeout(() => done(ctx, body, 'memory', Math.max(10, 300 - moves * 8 - secs), Math.max(15, 60 - moves * 2), { title: 'All matched!', big: moves, unit: 'moves', line: `${secs}s`, again: () => ctx.startGame('memory'), share: `I matched all the pairs in ${moves} moves on MathScroll!` }), 500);
      }
    } else { lock = true; setTimeout(() => { x.classList.remove('up'); y.classList.remove('up'); lock = false; }, 800); }
  });
  ctx.openSheet('Memory Match', body, 'tall');
  body._test = { cards };
}

// ------------------------------------------------------------------ catalogue
export const GAMES2 = [
  { id: 'g2048', name: '2048', icon: '🔢', blurb: 'Swipe to merge powers of two.', cost: '1⚡ per game', cat: 'arcade', play: g2048 },
  { id: 'sudoku', name: 'Sudoku', icon: '9️⃣', blurb: 'The classic, in three difficulties.', cost: '1⚡ per puzzle', cat: 'puzzle', play: (c) => sudoku(c) },
  { id: 'mines', name: 'Minesweeper', icon: '💣', blurb: 'Logic and numbers. First tap is always safe.', cost: '1⚡ per game', cat: 'puzzle', play: mines },
  { id: 'lights', name: 'Lights Out', icon: '💡', blurb: 'Turn off every light. Levels get harder.', cost: '1⚡ per run', cat: 'puzzle', play: (c) => lights(c) },
  { id: 'hanoi', name: 'Tower of Hanoi', icon: '🗼', blurb: 'Move the tower in 2ⁿ − 1 moves.', cost: '1⚡ per run', cat: 'puzzle', play: (c) => hanoi(c) },
  { id: 'fifteen', name: '15-Puzzle', icon: '🧊', blurb: 'Slide the tiles back into order.', cost: '1⚡ per puzzle', cat: 'puzzle', play: (c) => fifteen(c) },
  { id: 'mastermind', name: 'Code Breaker', icon: '🔐', blurb: 'Crack a 4-digit code with logic.', cost: '1⚡ per code', cat: 'puzzle', play: mastermind },
  { id: 'nim', name: 'Nim', icon: '🪨', blurb: 'Beat the computer — the secret is binary.', cost: '1⚡ per run', cat: 'puzzle', play: (c) => nim(c) },
  { id: 'magic', name: 'Magic Square', icon: '✨', blurb: 'Make every line add to the same total.', cost: '1⚡ per square', cat: 'puzzle', play: (c) => magic(c) },
  { id: 'memory', name: 'Memory Match', icon: '🃏', blurb: 'Pair up equal values: ½ and 0.5, 2⁵ and 32.', cost: 'Free — it’s maths', cat: 'speed', play: memory },
  ...QUICKFIRE.map((q) => ({ id: q.id, name: q.title, icon: q.icon, blurb: q.blurb, cost: 'Free — it’s maths', cat: 'speed', play: (c) => quickfire(c, { id: q.id, title: q.title, gen: GEN[q.gen] }) })),
];
export const PAID2 = new Set(GAMES2.filter((g) => g.cost.includes('⚡')).map((g) => g.id));
export function play2(id, ctx) { texFn = ctx.tex || texFn; GAMES2.find((g) => g.id === id).play(ctx); }
// One quick-fire question, for feed cards.
export function quickQuestion(ctx, kind) { texFn = ctx.tex || texFn; return GEN[kind](1 + rnd(2)); }
export const QUICK_KINDS = Object.keys(GEN);
