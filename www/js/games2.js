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
  if (/best|Solved|Cleared|Cracked|matched/i.test(`${title} ${line}`)) confetti();
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

// ------------------------------------------------------------------ effects
let layer = null;
const fxLayer = () => { if (!layer || !layer.isConnected) { layer = el('<div id="fx-layer"></div>'); document.body.appendChild(layer); } return layer; };
// Particles bursting out of a screen point.
export function burst(x, y, { color = '#facc15', n = 14, spread = 90, size = 8 } = {}) {
  const L = fxLayer();
  for (let k = 0; k < n; k++) {
    const d = el(`<i class="fx-p" style="left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${Array.isArray(color) ? pick(color) : color}"></i>`);
    L.appendChild(d);
    const a = Math.random() * Math.PI * 2; const r = spread * (0.4 + Math.random() * 0.8);
    d.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * r}px), calc(-50% + ${Math.sin(a) * r + 30}px)) scale(.2)`, opacity: 0 }], { duration: 550 + Math.random() * 300, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => d.remove();
  }
}
export function popText(x, y, text, color = '#facc15') {
  const d = el(`<b class="fx-t" style="left:${x}px;top:${y}px;color:${color}">${text}</b>`);
  fxLayer().appendChild(d);
  d.animate([{ transform: 'translate(-50%,-50%) scale(.6)', opacity: 0 }, { transform: 'translate(-50%,-90%) scale(1.15)', opacity: 1, offset: 0.25 }, { transform: 'translate(-50%,-180%) scale(1)', opacity: 0 }], { duration: 900, easing: 'ease-out' }).onfinish = () => d.remove();
}
export function confetti() {
  const W = window.innerWidth;
  for (let k = 0; k < 70; k++) {
    const d = el(`<i class="fx-c" style="left:${Math.random() * W}px;background:${pick(['#f87171', '#facc15', '#4ade80', '#60a5fa', '#c084fc', '#fb923c'])}"></i>`);
    fxLayer().appendChild(d);
    d.animate([{ transform: `translateY(-20px) rotate(0deg)`, opacity: 1 }, { transform: `translate(${(Math.random() - 0.5) * 160}px, ${window.innerHeight + 40}px) rotate(${Math.random() * 720}deg)`, opacity: 0.9 }], { duration: 1600 + Math.random() * 1400, delay: Math.random() * 300, easing: 'cubic-bezier(.3,.6,.5,1)' }).onfinish = () => d.remove();
  }
}
const centerOf = (node) => { const b = node.getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; };

// ------------------------------------------------------------------ Math Blitz (mixed speed rounds, combos, fever)
GEN.arith = (level) => {
  const op = pick(level < 2 ? ['+', '−'] : level < 4 ? ['+', '−', '×'] : ['+', '−', '×', '÷']);
  let a; let b; let ans;
  if (op === '+') { a = between(5, 20 * level); b = between(5, 20 * level); ans = a + b; }
  else if (op === '−') { a = between(10, 25 * level); b = between(1, a); ans = a - b; }
  else if (op === '×') { a = between(3, 12); b = between(3, 9 + level); ans = a * b; }
  else { b = between(2, 12); ans = between(2, 12); a = b * ans; }
  const opts = options(ans, Math.max(3, Math.round(ans * 0.1)), 0);
  return { q: `<div class="qf-big">${a} ${op} ${b}</div>`, choices: opts.map(String), answer: opts.indexOf(ans) };
};
const BLITZ_KINDS = ['arith', 'arith', 'compare', 'prime', 'sequence', 'solvex', 'estimate', 'units', 'divisors', 'mod', 'binary', 'angle'];
function blitz(ctx) {
  let left = 60; let score = 0; let combo = 0; let bestCombo = 0; let correct = 0; let over = false; let lock = false; let cur; let freezes = 0; let frozen = 0;
  const body = el(`<div class="blitz"><div class="gb-top"><span class="gb-score">0</span><span class="bz-mult">×1</span><span class="gb-time">60s</span></div>
    <div class="bz-meter"><i></i></div>
    <div class="qf-q"></div><div class="qf-choices"></div>
    <div class="bz-foot"><button class="btn ghost small bz-freeze" disabled>❄️ Freeze <b>0</b></button><span class="small bz-kind"></span></div></div>`);
  const mult = () => Math.min(5, 1 + Math.floor(combo / 3)) * (combo >= 12 ? 2 : 1);
  const hud = () => {
    body.querySelector('.gb-score').textContent = score;
    body.querySelector('.bz-mult').textContent = `×${mult()}${combo >= 12 ? ' 🔥 FEVER' : ''}`;
    body.querySelector('.bz-meter i').style.width = `${Math.min(100, (combo / 12) * 100)}%`;
    body.classList.toggle('fever', combo >= 12);
    const f = body.querySelector('.bz-freeze'); f.disabled = !freezes || frozen > 0; f.querySelector('b').textContent = freezes;
  };
  const NAMES = { arith: 'Arithmetic', compare: 'Compare', prime: 'Primes', sequence: 'Sequences', solvex: 'Algebra', estimate: 'Estimation', units: 'Last digits', divisors: 'Divisors', mod: 'Remainders', binary: 'Binary', angle: 'Angles' };
  const next = () => {
    const kind = pick(BLITZ_KINDS.slice(0, Math.min(BLITZ_KINDS.length, 4 + correct)));
    cur = GEN[kind](1 + Math.floor(correct / 5));
    body.querySelector('.qf-q').innerHTML = cur.q;
    body.querySelector('.bz-kind').textContent = NAMES[kind];
    const box = body.querySelector('.qf-choices');
    box.className = `qf-choices n${cur.choices.length}`;
    box.innerHTML = cur.choices.map((c, i) => `<button class="qf-c" data-i="${i}">${c}</button>`).join('');
    box.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 160 });
    lock = false;
  };
  body.querySelector('.qf-choices').addEventListener('click', (e) => {
    const b = e.target.closest('.qf-c'); if (!b || lock || over) return;
    lock = true;
    const ok = +b.dataset.i === cur.answer; const [x, y] = centerOf(b);
    b.classList.add(ok ? 'right' : 'wrong');
    if (ok) {
      combo++; correct++; bestCombo = Math.max(bestCombo, combo);
      const pts = 10 * mult(); score += pts;
      burst(x, y, { color: combo >= 12 ? ['#f97316', '#facc15', '#ef4444'] : ['#4ade80', '#facc15'], n: 10 + Math.min(20, combo) });
      popText(x, y - 20, `+${pts}`);
      if (combo % 5 === 0) { left += 2; popText(x, y - 60, '+2s', '#60a5fa'); }
      if (combo % 8 === 0) { freezes++; ctx.toast('❄️ Freeze earned!'); }
      ctx.sound(combo % 5 === 0 ? 'crit' : 'correct');
      setTimeout(next, 180);
    } else {
      combo = 0; left = Math.max(0, left - 3); ctx.sound('wrong'); popText(x, y - 20, '−3s', '#ef4444');
      body.querySelectorAll('.qf-c')[cur.answer]?.classList.add('right');
      body.animate([{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'none' }], { duration: 250 });
      setTimeout(next, cur.why ? 1100 : 650);
    }
    hud();
  });
  body.querySelector('.bz-freeze').addEventListener('click', () => { if (!freezes || frozen) return; freezes--; frozen = 5; body.classList.add('frozen'); ctx.sound('quest'); hud(); });
  next(); hud();
  const timer = setInterval(() => {
    if (over) return;
    if (frozen > 0) { frozen--; if (!frozen) body.classList.remove('frozen'); hud(); return; }
    left--; body.querySelector('.gb-time').textContent = `${left}s`;
    body.querySelector('.gb-time').classList.toggle('low', left <= 10);
    if (left <= 0) {
      over = true; clearInterval(timer);
      done(ctx, body, 'blitz', score, Math.min(120, Math.round(score / 12)), { title: 'Time!', big: score, unit: 'points', line: `${correct} correct · best combo ${bestCombo}`, again: () => ctx.startGame('blitz'), share: `I scored ${score} in Math Blitz on MathScroll (combo ${bestCombo})!` });
    }
  }, 1000);
  ctx.openSheet('Math Blitz', body, 'tall', stopper(() => { over = true; clearInterval(timer); }));
}

// ------------------------------------------------------------------ canvas helper
function makeCanvas(body, sel, heightFrac = 0.58) {
  const c = body.querySelector(sel);
  const W = Math.min(560, body.clientWidth || window.innerWidth - 32); const H = Math.round(Math.min(560, window.innerHeight * heightFrac));
  const dpr = window.devicePixelRatio || 1;
  c.width = W * dpr; c.height = H * dpr; c.style.width = `${W}px`; c.style.height = `${H}px`;
  const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { c, g, W, H };
}

// ------------------------------------------------------------------ Number Ninja
const NINJA_RULES = [
  { t: 'multiples of 3', f: (n) => n % 3 === 0, why: (n) => `${n} isn’t a multiple of 3` },
  { t: 'even numbers', f: (n) => n % 2 === 0, why: (n) => `${n} is odd` },
  { t: 'primes', f: isPrime, why: (n) => (n < 2 ? `${n} isn’t prime` : `${n} = ${factorise(n).join('×')}`) },
  { t: 'perfect squares', f: (n) => Number.isInteger(Math.sqrt(n)), why: (n) => `${n} isn’t a square` },
  { t: 'multiples of 4', f: (n) => n % 4 === 0, why: (n) => `${n} ÷ 4 isn’t whole` },
  { t: 'multiples of 7', f: (n) => n % 7 === 0, why: (n) => `${n} isn’t a multiple of 7` },
  { t: 'numbers with digit sum 9', f: (n) => [...String(n)].reduce((a, d) => a + +d, 0) === 9, why: (n) => `digits of ${n} add to ${[...String(n)].reduce((a, d) => a + +d, 0)}` },
  { t: 'factors of 60', f: (n) => 60 % n === 0, why: (n) => `60 ÷ ${n} isn’t whole` },
];
function ninja(ctx) {
  const body = el(`<div class="ninja"><div class="gb-top"><span class="gb-score">0</span><span class="nj-lives">❤️❤️❤️</span></div>
    <div class="nj-rule">Slice <b></b></div><div class="nj-wrap"><canvas class="nj-canvas"></canvas><div class="nj-flash"></div></div>
    <p class="small">Swipe through numbers that fit the rule. Let one fall or slice a wrong one and you lose a heart. Don’t slice 💣.</p></div>`);
  ctx.openSheet('Number Ninja', body, 'tall', stopper(() => { over = true; }));
  const { c, g, W, H } = makeCanvas(body, '.nj-canvas');
  let objs = []; let bits = []; let trail = []; let score = 0; let lives = 3; let over = false; let t0 = performance.now(); let lastSpawn = 0; let ruleIdx = rnd(NINJA_RULES.length); let ruleAt = t0; let sliced = 0; let swipeCombo = 0;
  const rule = () => NINJA_RULES[ruleIdx];
  const setRule = () => { body.querySelector('.nj-rule b').textContent = rule().t; body.querySelector('.nj-rule').animate([{ transform: 'scale(1.25)', color: '#facc15' }, { transform: 'scale(1)' }], { duration: 500 }); };
  setRule();
  const drawLives = () => { body.querySelector('.nj-lives').textContent = '❤️'.repeat(lives) + '🖤'.repeat(Math.max(0, 3 - lives)); };
  const spawn = (now) => {
    const elapsed = (now - t0) / 1000;
    const bomb = elapsed > 15 && Math.random() < 0.1;
    let n;
    if (Math.random() < 0.55) { const goods = [...Array(100).keys()].map((k) => k + 1).filter(rule().f); n = pick(goods); } else n = between(1, 99);
    const x = W * (0.15 + Math.random() * 0.7);
    objs.push({ x, y: H + 30, vx: (W / 2 - x) * (0.4 + Math.random() * 0.5) / 60, vy: -(Math.sqrt(2 * 0.22 * H * (0.55 + Math.random() * 0.35))), r: 28, n, bomb, hue: rnd(360), dead: false });
  };
  const flash = (color) => { const f = body.querySelector('.nj-flash'); f.style.background = color; f.animate([{ opacity: 0.45 }, { opacity: 0 }], { duration: 350 }); };
  const loseLife = (msg, x, y) => {
    lives--; drawLives(); ctx.sound('wrong'); flash('#ef4444');
    const b = c.getBoundingClientRect(); popText(b.left + x, b.top + y, msg, '#f87171');
    if (lives <= 0) end();
  };
  const end = () => {
    if (over) return; over = true;
    setTimeout(() => done(ctx, body, 'ninja', score, Math.min(120, Math.round(score / 10)), { title: 'Game over', big: score, unit: 'points', line: `${sliced} sliced`, again: () => ctx.startGame('ninja'), share: `I scored ${score} in Number Ninja on MathScroll!` }), 700);
  };
  const sliceAt = (o) => {
    o.dead = true;
    const b = c.getBoundingClientRect();
    if (o.bomb) { burst(b.left + o.x, b.top + o.y, { color: ['#111', '#f97316', '#ef4444'], n: 30, spread: 140 }); loseLife('💥', o.x, o.y); return; }
    if (rule().f(o.n)) {
      swipeCombo++; sliced++;
      const pts = 10 * swipeCombo; score += pts; body.querySelector('.gb-score').textContent = score;
      burst(b.left + o.x, b.top + o.y, { color: `hsl(${o.hue} 85% 60%)`, n: 16 });
      popText(b.left + o.x, b.top + o.y - 30, swipeCombo > 1 ? `+${pts} combo ×${swipeCombo}` : `+${pts}`);
      bits.push({ x: o.x, y: o.y, vx: -2, vy: o.vy * 0.3, n: o.n, hue: o.hue, side: -1, a: 1 }, { x: o.x, y: o.y, vx: 2, vy: o.vy * 0.3, n: o.n, hue: o.hue, side: 1, a: 1 });
      ctx.sound(swipeCombo > 1 ? 'crit' : 'correct');
    } else loseLife(rule().why(o.n), o.x, o.y);
  };
  const segHits = (ax, ay, bx, by, o) => { const dx = bx - ax; const dy = by - ay; const L = dx * dx + dy * dy || 1; let t = ((o.x - ax) * dx + (o.y - ay) * dy) / L; t = Math.max(0, Math.min(1, t)); const px = ax + t * dx - o.x; const py = ay + t * dy - o.y; return px * px + py * py < o.r * o.r; };
  let down = false;
  const pt = (e) => { const b = c.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  c.addEventListener('pointerdown', (e) => { down = true; swipeCombo = 0; c.setPointerCapture(e.pointerId); trail = [[...pt(e), performance.now()]]; });
  c.addEventListener('pointermove', (e) => {
    if (!down || over) return;
    const p = [...pt(e), performance.now()]; const q = trail[trail.length - 1] || p; trail.push(p);
    for (const o of objs) if (!o.dead && segHits(q[0], q[1], p[0], p[1], o)) sliceAt(o);
  });
  const up = () => { down = false; swipeCombo = 0; };
  c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
  const frame = (now) => {
    if (over && !objs.length && !bits.length) return;
    if (!body.isConnected) return;
    const elapsed = (now - t0) / 1000;
    if (!over && now - ruleAt > 25000) { ruleIdx = (ruleIdx + 1 + rnd(NINJA_RULES.length - 1)) % NINJA_RULES.length; ruleAt = now; setRule(); objs.forEach((o) => { if (!o.dead && !o.bomb && o.vy > 0) o.dead = true; }); }
    if (!over && now - lastSpawn > Math.max(450, 1300 - elapsed * 12)) { spawn(now); if (elapsed > 20 && Math.random() < 0.35) spawn(now); lastSpawn = now; }
    g.clearRect(0, 0, W, H);
    for (const o of objs) {
      o.x += o.vx; o.y += o.vy; o.vy += 0.22;
      if (!o.dead && o.vy > 0 && o.y > H + 40) { o.dead = true; if (!over && !o.bomb && rule().f(o.n)) loseLife(`missed ${o.n}`, o.x, H - 20); }
      if (o.dead) continue;
      g.save(); g.translate(o.x, o.y);
      if (o.bomb) { g.font = '46px serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('💣', 0, 2); }
      else {
        const grd = g.createRadialGradient(-8, -10, 4, 0, 0, o.r); grd.addColorStop(0, `hsl(${o.hue} 90% 72%)`); grd.addColorStop(1, `hsl(${o.hue} 70% 45%)`);
        g.fillStyle = grd; g.beginPath(); g.arc(0, 0, o.r, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#fff'; g.font = '800 22px system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 4; g.fillText(o.n, 0, 1);
      }
      g.restore();
    }
    objs = objs.filter((o) => !o.dead || false);
    for (const b of bits) {
      b.x += b.vx; b.y += b.vy; b.vy += 0.3; b.a -= 0.02;
      g.save(); g.globalAlpha = Math.max(0, b.a); g.translate(b.x, b.y); g.rotate(b.side * (1 - b.a));
      g.fillStyle = `hsl(${b.hue} 80% 55%)`; g.beginPath(); g.arc(0, 0, 28, b.side < 0 ? Math.PI / 2 : -Math.PI / 2, b.side < 0 ? Math.PI * 1.5 : Math.PI / 2); g.fill(); g.restore();
    }
    bits = bits.filter((b) => b.a > 0 && b.y < H + 60);
    trail = trail.filter((p) => now - p[2] < 140);
    if (trail.length > 1) { g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 5; g.lineCap = 'round'; g.lineJoin = 'round'; g.shadowColor = '#7dd3fc'; g.shadowBlur = 12; g.beginPath(); trail.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); g.shadowBlur = 0; }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  body._test = { objs: () => objs, rule: () => rule(), slice: (o) => sliceAt(o) };
}

// ------------------------------------------------------------------ Meteor Defense
function meteorQ(wave) {
  const t = rnd(Math.min(6, wave + 1));
  let a; let b;
  if (t === 0) { a = between(2, 20); b = between(2, 20); return [`${a} + ${b}`, a + b]; }
  if (t === 1) { a = between(10, 40); b = between(1, a); return [`${a} − ${b}`, a - b]; }
  if (t === 2) { a = between(2, 12); b = between(2, 12); return [`${a} × ${b}`, a * b]; }
  if (t === 3) { b = between(2, 12); a = between(2, 12); return [`${a * b} ÷ ${b}`, a]; }
  if (t === 4) { a = between(2, 15); return [`${a}²`, a * a]; }
  if (t === 5) { a = pick([10, 20, 25, 50]); b = pick([20, 40, 60, 80, 120, 200]); return [`${a}% of ${b}`, (a * b) / 100]; }
  a = between(2, 9); b = between(2, 4); return [`${a}^${b}`, a ** b];
}
function meteor(ctx) {
  const body = el(`<div class="meteor"><div class="gb-top"><span class="gb-score">0</span><span class="mt-wave">Wave 1</span><span class="mt-shields">🛡️🛡️🛡️</span></div>
    <div class="nj-wrap"><canvas class="mt-canvas"></canvas><div class="nj-flash"></div></div><div class="mt-pad"></div>
    <p class="small">Tap the answer to fire at the meteor. Don’t let them reach the ground!</p></div>`);
  ctx.openSheet('Meteor Defense', body, 'tall', stopper(() => { over = true; }));
  const { c, g, W, H } = makeCanvas(body, '.mt-canvas', 0.5);
  const stars = Array.from({ length: 60 }, () => [Math.random() * W, Math.random() * H, Math.random() * 1.5 + 0.3]);
  let mets = []; let lasers = []; let booms = []; let score = 0; let shields = 3; let wave = 1; let kills = 0; let over = false; let last = 0; let jam = 0; let shake = 0;
  const pad = body.querySelector('.mt-pad');
  const flash = (color) => { const f = body.querySelector('.nj-flash'); f.style.background = color; f.animate([{ opacity: 0.4 }, { opacity: 0 }], { duration: 350 }); };
  const drawPad = () => {
    const answers = [...new Set(mets.filter((m) => !m.dead).map((m) => m.ans))];
    while (answers.length < 4) { const base = answers.length ? pick(answers) : between(5, 40); const d = Math.max(1, base + pick([-2, -1, 1, 2, 10, -10])); if (!answers.includes(d)) answers.push(d); }
    const cur = [...pad.querySelectorAll('.mt-btn')].map((b) => +b.dataset.a);
    if (cur.length === answers.length && answers.every((a) => cur.includes(a))) return;
    pad.innerHTML = shuffle(answers.slice(0, 6)).map((a) => `<button class="mt-btn" data-a="${a}">${a}</button>`).join('');
  };
  const spawn = () => {
    const [q, ans] = meteorQ(wave);
    if (mets.some((m) => !m.dead && m.ans === ans)) return;
    mets.push({ x: 40 + Math.random() * (W - 80), y: -30, v: 0.35 + wave * 0.09 + Math.random() * 0.2, q, ans, r: 30, rot: Math.random() * 6, dead: false });
    drawPad();
  };
  pad.addEventListener('click', (e) => {
    const b = e.target.closest('.mt-btn'); if (!b || over || jam > performance.now()) return;
    const a = +b.dataset.a;
    const target = mets.filter((m) => !m.dead && m.ans === a).sort((x, y) => y.y - x.y)[0];
    if (!target) { jam = performance.now() + 900; pad.classList.add('jam'); setTimeout(() => pad.classList.remove('jam'), 900); ctx.sound('wrong'); const [x, y] = centerOf(b); popText(x, y - 20, 'Miss! Cannon jammed', '#f87171'); return; }
    target.dead = true; kills++;
    const pts = 10 * wave + Math.round((1 - target.y / H) * 20); score += pts;
    lasers.push({ x: target.x, y: target.y, t: performance.now() });
    booms.push({ x: target.x, y: target.y, t: performance.now() });
    const cb = c.getBoundingClientRect(); burst(cb.left + target.x, cb.top + target.y, { color: ['#fb923c', '#facc15', '#f87171'], n: 18, spread: 70 }); popText(cb.left + target.x, cb.top + target.y - 20, `+${pts}`);
    ctx.sound('correct');
    body.querySelector('.gb-score').textContent = score;
    if (kills % 8 === 0) { wave++; body.querySelector('.mt-wave').textContent = `Wave ${wave}`; ctx.toast(`Wave ${wave}!`); ctx.sound('crit'); }
    drawPad();
  });
  const end = () => {
    if (over) return; over = true;
    setTimeout(() => done(ctx, body, 'meteor', score, Math.min(120, Math.round(score / 15)), { title: 'Planet lost', big: score, unit: 'points', line: `Wave ${wave} · ${kills} meteors`, again: () => ctx.startGame('meteor'), share: `I defended the planet to wave ${wave} (${score} pts) in Meteor Defense on MathScroll!` }), 800);
  };
  const frame = (now) => {
    if (!body.isConnected || (over && now - last > 1500)) return;
    if (!over && now - last > Math.max(1100, 3200 - wave * 280) && mets.filter((m) => !m.dead).length < 3 + Math.floor(wave / 2)) { spawn(); last = now; }
    g.save();
    if (shake > 0) { g.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake); shake *= 0.9; if (shake < 0.5) shake = 0; }
    const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#0b1026'); sky.addColorStop(1, '#2a1846'); g.fillStyle = sky; g.fillRect(-10, -10, W + 20, H + 20);
    g.fillStyle = '#fff'; for (const [x, y, r] of stars) { g.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(now / 900 + x)); g.fillRect(x, y, r, r); } g.globalAlpha = 1;
    g.fillStyle = '#1f6f4a'; g.beginPath(); g.ellipse(W / 2, H + 40, W * 0.8, 70, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#94a3b8'; g.fillRect(W / 2 - 10, H - 26, 20, 26); g.beginPath(); g.arc(W / 2, H - 26, 14, Math.PI, 0); g.fill();
    for (const m of mets) {
      if (m.dead) continue;
      m.y += m.v; m.rot += 0.01;
      if (m.y > H - 30) { m.dead = true; shields--; shake = 14; flash('#ef4444'); ctx.sound('wrong'); booms.push({ x: m.x, y: H - 30, t: now, big: true }); body.querySelector('.mt-shields').textContent = '🛡️'.repeat(Math.max(0, shields)) + '💥'.repeat(Math.max(0, 3 - shields)); drawPad(); if (shields <= 0) end(); continue; }
      g.save(); g.translate(m.x, m.y);
      g.strokeStyle = 'rgba(251,146,60,.35)'; g.lineWidth = 10; g.beginPath(); g.moveTo(0, -m.r); g.lineTo(-6, -m.r - 40); g.stroke();
      g.rotate(m.rot); const grd = g.createRadialGradient(-8, -8, 4, 0, 0, m.r); grd.addColorStop(0, '#a8a29e'); grd.addColorStop(1, '#57534e'); g.fillStyle = grd;
      g.beginPath(); for (let k = 0; k < 9; k++) { const a = (k / 9) * Math.PI * 2; const rr = m.r * (0.85 + 0.15 * Math.sin(k * 2.3)); g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } g.closePath(); g.fill();
      g.rotate(-m.rot); g.fillStyle = '#fff'; g.font = `800 ${m.q.length > 7 ? 13 : 16}px system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = '#000'; g.shadowBlur = 4; g.fillText(m.q, 0, 1);
      g.restore();
    }
    mets = mets.filter((m) => !m.dead);
    lasers = lasers.filter((l) => now - l.t < 180);
    for (const l of lasers) { g.strokeStyle = '#67e8f9'; g.lineWidth = 4; g.shadowColor = '#22d3ee'; g.shadowBlur = 14; g.beginPath(); g.moveTo(W / 2, H - 30); g.lineTo(l.x, l.y); g.stroke(); g.shadowBlur = 0; }
    booms = booms.filter((b) => now - b.t < 400);
    for (const b of booms) { const k = (now - b.t) / 400; g.fillStyle = `rgba(251,146,60,${1 - k})`; g.beginPath(); g.arc(b.x, b.y, (b.big ? 60 : 36) * k + 6, 0, Math.PI * 2); g.fill(); }
    g.restore();
    requestAnimationFrame(frame);
  };
  drawPad();
  requestAnimationFrame(frame);
  body._test = { mets: () => mets };
}

// ------------------------------------------------------------------ catalogue
export const GAMES2 = [
  { id: 'ninja', name: 'Number Ninja', icon: '🥷', blurb: 'Slice the numbers that fit the rule — primes, squares, multiples…', cost: '1⚡ per game', cat: 'action', play: ninja,
    how: ['Swipe across numbers that fit the rule at the top.', 'Slice a wrong number or let a right one fall: lose a heart.', 'Slice several in one swipe for a combo. Avoid 💣.', 'The rule changes every 25 seconds!'] },
  { id: 'meteor', name: 'Meteor Defense', icon: '☄️', blurb: 'Blast falling meteors by tapping their answers.', cost: '1⚡ per game', cat: 'action', play: meteor,
    how: ['Each meteor carries a sum.', 'Tap its answer at the bottom to fire your laser.', 'A wrong answer jams the cannon for a second.', 'Three meteors reach the ground and it’s over. Waves get faster.'] },
  { id: 'blitz', name: 'Math Blitz', icon: '⚡', blurb: '60 seconds of mixed speed maths. Build combos, hit fever.', cost: 'Free — it’s maths', cat: 'action', play: blitz,
    how: ['Answer as many as you can in 60 seconds.', 'Correct answers in a row raise your multiplier (up to ×5).', '12 in a row starts 🔥 fever: double points.', 'Every 8 in a row earns a ❄️ freeze that stops the clock for 5 s. Wrong answers cost 3 s.'] },
  { id: 'g2048', name: '2048', icon: '🔢', blurb: 'Swipe to merge powers of two.', cost: '1⚡ per game', cat: 'puzzle', play: g2048, how: ['Swipe to slide every tile.', 'Two equal tiles merge into their sum.', 'Reach 2048 — then keep going.'] },
  { id: 'sudoku', name: 'Sudoku', icon: '9️⃣', blurb: 'The classic number puzzle, in three difficulties.', cost: '1⚡ per puzzle', cat: 'puzzle', play: (c) => sudoku(c), how: ['Fill the grid so every row, column and 3×3 box has 1–9 once.', 'Tap a square, then a number.', 'Clashes turn red.'] },
  { id: 'mines', name: 'Minesweeper', icon: '💣', blurb: 'Pure logic. First tap is always safe.', cost: '1⚡ per game', cat: 'puzzle', play: mines, how: ['Tap to dig. A number tells you how many of the 8 neighbours are mines.', 'Turn on 🚩 to mark mines.', 'Dig every safe square to win.'] },
  { id: 'mastermind', name: 'Code Breaker', icon: '🔐', blurb: 'Crack a secret 4-digit code by deduction.', cost: '1⚡ per code', cat: 'brain', play: mastermind, how: ['Guess a 4-digit code (all digits different).', '🎯 = right digit in the right place. ⚪ = right digit, wrong place.', 'Crack it in 10 tries.'] },
  { id: 'memory', name: 'Memory Match', icon: '🃏', blurb: 'Pair equal values: ½ and 0.5, 2⁵ and 32.', cost: 'Free — it’s maths', cat: 'brain', play: memory, how: ['Flip two cards at a time.', 'Match cards with equal values, like ¼ and 25%.', 'Fewer moves = more points.'] },
  { id: 'nim', name: 'Nim', icon: '🪨', blurb: 'Outsmart the computer. The secret is binary.', cost: '1⚡ per run', cat: 'strategy', play: (c) => nim(c), how: ['Take any number of stones from one row.', 'Whoever takes the last stone wins.', 'There’s a perfect strategy — can you find it?'] },
];
export const PAID2 = new Set(GAMES2.filter((g) => g.cost.includes('⚡')).map((g) => g.id));
export function play2(id, ctx) { texFn = ctx.tex || texFn; GAMES2.find((g) => g.id === id).play(ctx); }
// One quick-fire question, for feed cards.
export function quickQuestion(ctx, kind) { texFn = ctx.tex || texFn; return GEN[kind](1 + rnd(2)); }
export const QUICK_KINDS = Object.keys(GEN).filter((k) => k !== 'arith');
