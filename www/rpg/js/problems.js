// Problems for Numeria battles.
//  • quick(): generated AMC-style questions with five choices (A–E), for regular monsters.
//  • realProblem(): actual AMC 8 / AMC 10 / AMC 12 / AIME problems, for elites, bosses and raids.
import { textToHtml } from '../../js/sources.js';
import { exprValue, cleanTex } from '../../js/expr.js';

const rnd = (n) => Math.floor(Math.random() * n);
const between = (a, b) => a + rnd(b - a + 1);
const pick = (a) => a[rnd(a.length)];
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const isPrime = (n) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
const divisorCount = (n) => { let c = 0; for (let d = 1; d * d <= n; d++) if (n % d === 0) c += d * d === n ? 1 : 2; return c; };
const powMod = (b, e, m) => { let r = 1; b %= m; while (e > 0) { if (e & 1) r = (r * b) % m; b = (b * b) % m; e >>= 1; } return r; };
const C = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));

// Five sorted choices around the answer, like a real AMC.
function choices5(ans, spread = 3, min = -Infinity, fmt = String) {
  const set = new Set([ans]);
  for (let t = 0; set.size < 5 && t < 200; t++) {
    const v = ans + (rnd(2) ? 1 : -1) * between(1, Math.max(1, spread + Math.floor(t / 20)));
    if (v >= min) set.add(v);
  }
  const list = [...set].sort((a, b) => a - b);
  return { choices: list.map(fmt), correct: list.indexOf(ans) };
}
function fracChoices(n, d, wrong) {
  const key = (a, b) => { const g = gcd(a, b); return `${a / g}/${b / g}`; };
  const seen = new Set([key(n, d)]); const list = [[n, d]];
  for (const [a, b] of wrong) { if (b > 0 && a > 0 && !seen.has(key(a, b))) { seen.add(key(a, b)); const g = gcd(a, b); list.push([a / g, b / g]); } if (list.length === 5) break; }
  while (list.length < 5) { const a = between(1, n + 4); const b = between(a + 1, d + 6); if (!seen.has(key(a, b))) { seen.add(key(a, b)); const g = gcd(a, b); list.push([a / g, b / g]); } }
  list.sort((x, y) => x[0] / x[1] - y[0] / y[1]);
  return { choices: list.map(([a, b]) => `$\\frac{${a}}{${b}}$`), correct: list.findIndex(([a, b]) => a === n && b === d) };
}
const T = (t, lo, hi) => Math.round(lo + (hi - lo) * Math.min(1, (t - 1) / 4)); // scale by tier 1..5

// Each generator returns { q, ans (number), choices, correct, hint, topic }.
const GEN = {
  arith(t) { const a = between(11, T(t, 25, 99)); const b = between(11, T(t, 25, 99)); const c = between(2, 12); const d = between(2, 12); const ans = a * b - c * d; return { q: `What is $${a}\\times ${b}-${c}\\times ${d}$?`, ans, ...choices5(ans, 10), hint: 'Multiply first, then subtract.', topic: 'algebra' }; },
  fraction(t) {
    const b = between(2, T(t, 6, 12)); const d = between(2, T(t, 7, 15)); const a = between(1, b - 1); const c = between(1, d - 1);
    let n = a * d + c * b; let den = b * d; const g = gcd(n, den); n /= g; den /= g;
    return { q: `What is $\\frac{${a}}{${b}}+\\frac{${c}}{${d}}$?`, ans: n / den, ...fracChoices(n, den, [[a + c, b + d], [a * c, b * d], [n + 1, den], [n, den + 1], [Math.max(1, n - 1), den]]), hint: 'Use a common denominator: $\\frac ab+\\frac cd=\\frac{ad+bc}{bd}$.', topic: 'algebra' };
  },
  ratio(t) { const p = between(2, 7); let q = between(2, 9); if (q === p) q++; const k = between(3, T(t, 8, 30)); const total = (p + q) * k; return { q: `The ratio of red to blue marbles in a bag is $${p}:${q}$. There are $${total}$ marbles. How many are blue?`, ans: q * k, ...choices5(q * k, Math.max(3, k)), hint: 'Write red $=pk$, blue $=qk$, and use the total.', topic: 'algebra' }; },
  percent(t) {
    if (t > 2 && rnd(2)) { const p = pick([10, 20, 25, 50]); const q = pick([10, 20, 25, 40]); const base = 100 * between(1, 8); const ans = Math.round(base * (1 + p / 100) * (1 - q / 100)); return { q: `A price of $${base}$ is raised by $${p}\\%$, then the new price is lowered by $${q}\\%$. What is the final price?`, ans, ...choices5(ans, Math.max(5, Math.round(ans / 12))), hint: 'Multiply by $1+\\frac p{100}$, then by $1-\\frac q{100}$.', topic: 'algebra' }; }
    const p = pick([5, 10, 15, 20, 25, 30, 40, 60, 75]); const n = 20 * between(2, T(t, 10, 40)); const ans = (p * n) / 100; return { q: `What is $${p}\\%$ of $${n}$?`, ans, ...choices5(ans, Math.max(3, Math.round(ans / 8))), hint: '$p\\%$ of $n$ is $\\frac{p}{100}\\cdot n$.', topic: 'algebra' };
  },
  average(t) { const A = between(60, 90); const k = between(3, T(t, 4, 8)); const B = A + between(1, 4); const x = (k + 1) * B - k * A; return { q: `The average of $${k}$ test scores is $${A}$. After one more test, the average is $${B}$. What was the score on the new test?`, ans: x, ...choices5(x, 4), hint: 'Total = average × count, before and after.', topic: 'algebra' }; },
  primes(t) { const a = between(1, T(t, 20, 80)); const b = a + between(15, T(t, 25, 60)); let c = 0; for (let k = a + 1; k < b; k++) if (isPrime(k)) c++; return { q: `How many prime numbers are strictly between $${a}$ and $${b}$?`, ans: c, ...choices5(c, 2, 0), hint: 'Check each number for small prime factors: 2, 3, 5, 7.', topic: 'nt' }; },
  gcd(t) { const g = between(2, T(t, 9, 25)); const a = g * between(2, 9); let b = g * between(2, 11); if (b === a) b += g; const l = (a * b) / gcd(a, b); return { q: `What is the least common multiple of $${a}$ and $${b}$?`, ans: l, ...choices5(l, Math.max(3, g), 1), hint: '$\\operatorname{lcm}(a,b)=\\frac{ab}{\\gcd(a,b)}$.', topic: 'nt' }; },
  divisors(t) { const n = pick([12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 60, 72, 84, 90, 96, 100, 108, 120, 144, 180, 210, 240, 360, 420, 720].slice(0, 8 + t * 4)); const ans = divisorCount(n); return { q: `How many positive divisors does $${n}$ have?`, ans, ...choices5(ans, 3, 2), hint: 'If $n=p^aq^b\\cdots$, it has $(a+1)(b+1)\\cdots$ divisors.', topic: 'nt' }; },
  digits(t) { const a = between(11, T(t, 50, 999)); const b = between(11, T(t, 50, 999)); const p = a * b; const ans = [...String(p)].reduce((s, d) => s + +d, 0); return { q: `What is the sum of the digits of $${a}\\times ${b}$?`, ans, ...choices5(ans, 4, 1), hint: 'Multiply it out carefully, then add the digits.', topic: 'nt' }; },
  units(t) { const b = between(2, 9) + (t > 2 ? 10 * between(1, 9) : 0); const e = between(10, 20 + 50 * t); const ans = powMod(b, e, 10); return { q: `What is the units digit of $${b}^{${e}}$?`, ans, ...choices5(ans, 3, 0), hint: 'Units digits of powers repeat in a cycle of length 1, 2 or 4.', topic: 'nt' }; },
  base(t) { const bs = pick(t < 3 ? [2, 5] : [2, 3, 5, 7, 8]); const n = between(bs * 3, T(t, 60, 400)); return { q: `What is $${n.toString(bs)}_{${bs}}$ in base $10$?`, ans: n, ...choices5(n, 4, 1), hint: `Each digit is worth a power of ${bs}.`, topic: 'nt' }; },
  mod(t) { const m = between(5, T(t, 9, 13)); const b = between(2, 15); const e = between(10, 30 + 40 * t); const ans = powMod(b, e, m); return { q: `What is the remainder when $${b}^{${e}}$ is divided by $${m}$?`, ans, ...choices5(ans, 3, 0), hint: 'Find the cycle of powers mod $m$ (Fermat: $a^{p-1}\\equiv1$ for prime $p$).', topic: 'nt' }; },
  factorial(t) { const n = between(T(t, 20, 60), T(t, 50, 300)); let z = 0; for (let p = 5; p <= n; p *= 5) z += Math.floor(n / p); return { q: `How many zeros are at the end of $${n}!$?`, ans: z, ...choices5(z, 3, 0), hint: 'Count factors of 5: $\\lfloor n/5\\rfloor+\\lfloor n/25\\rfloor+\\cdots$', topic: 'nt' }; },
  angles(t) { const n = pick([5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36].slice(0, 5 + t * 2)); const ans = (180 * (n - 2)) / n; return { q: `What is the measure, in degrees, of each interior angle of a regular ${n}-gon?`, ans, ...choices5(ans, 6, 1), hint: 'Interior angles sum to $180(n-2)$.', topic: 'geometry' }; },
  polygon(t) { const n = between(6, T(t, 12, 30)); const ans = (n * (n - 3)) / 2; return { q: `How many diagonals does a convex polygon with $${n}$ sides have?`, ans, ...choices5(ans, Math.max(3, n), 1), hint: 'Each vertex joins $n-3$ others by a diagonal; each diagonal is counted twice.', topic: 'geometry' }; },
  pythag(t) { const [a, b, c] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]].slice(0, 2 + t)); const k = between(1, T(t, 3, 6)); if (rnd(2)) return { q: `A right triangle has legs $${a * k}$ and $${b * k}$. How long is the hypotenuse?`, ans: c * k, ...choices5(c * k, 3, 1), hint: '$a^2+b^2=c^2$. Look for a Pythagorean triple.', topic: 'geometry' }; return { q: `A right triangle has hypotenuse $${c * k}$ and one leg $${a * k}$. How long is the other leg?`, ans: b * k, ...choices5(b * k, 3, 1), hint: '$b=\\sqrt{c^2-a^2}$.', topic: 'geometry' }; },
  area(t) { const a = between(3, T(t, 10, 30)); const b = between(3, T(t, 10, 30)); const h = between(2, T(t, 8, 20)); if (rnd(2)) { const ans = ((a + b) * h) / 2; if (!Number.isInteger(ans)) return GEN.area(t); return { q: `A trapezoid has parallel sides $${a}$ and $${b}$ and height $${h}$. What is its area?`, ans, ...choices5(ans, Math.max(3, h), 1), hint: 'Trapezoid area $=\\frac{(a+b)h}{2}$.', topic: 'geometry' }; } const ans = (a * b) / 2; if (!Number.isInteger(ans)) return GEN.area(t); return { q: `What is the area of the triangle with vertices $(0,0)$, $(${a},0)$ and $(0,${b})$?`, ans, ...choices5(ans, Math.max(3, a), 1), hint: 'It is a right triangle: area $=\\frac12\\cdot$ base $\\cdot$ height.', topic: 'geometry' }; },
  circle(t) { const r = between(2, T(t, 9, 25)); if (rnd(2)) return { q: `A circle has area $${r * r}\\pi$. Its circumference is $k\\pi$. What is $k$?`, ans: 2 * r, ...choices5(2 * r, 3, 1), hint: '$A=\\pi r^2$ and $C=2\\pi r$.', topic: 'geometry' }; return { q: `A circle has circumference $${2 * r}\\pi$. Its area is $k\\pi$. What is $k$?`, ans: r * r, ...choices5(r * r, Math.max(3, r), 1), hint: '$C=2\\pi r$ gives $r$; then $A=\\pi r^2$.', topic: 'geometry' }; },
  coord(t) { const [a, b, c] = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15]]); const x = between(-9, 9); const y = between(-9, 9); return { q: `What is the distance between $(${x},${y})$ and $(${x + a},${y + b})$?`, ans: c, ...choices5(c, 3, 1), hint: 'Distance $=\\sqrt{(\\Delta x)^2+(\\Delta y)^2}$.', topic: 'geometry' }; },
  counting(t) { if (rnd(2)) { const n = between(5, T(t, 8, 20)); const ans = C(n, 2); return { q: `At a party, each of $${n}$ people shakes hands with every other person exactly once. How many handshakes are there?`, ans, ...choices5(ans, Math.max(3, n), 1), hint: 'Choose 2 people: $\\binom n2=\\frac{n(n-1)}2$.', topic: 'counting' }; } const w = pick(t < 3 ? ['MATH', 'PRIME', 'ANGLE'] : ['LEVEL', 'BANANA', 'COOKIE', 'PEPPER', 'SEESAW']); const counts = {}; [...w].forEach((ch) => { counts[ch] = (counts[ch] || 0) + 1; }); const ans = fact(w.length) / Object.values(counts).reduce((p, k) => p * fact(k), 1); return { q: `How many distinct arrangements of the letters in ${w} are there?`, ans, ...choices5(ans, Math.max(3, Math.round(ans / 6)), 1), hint: 'Divide $n!$ by the factorial of each repeated letter count.', topic: 'counting' }; },
  probability(t) { const s = between(3, 11); let fav = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === s) fav++; const g = gcd(fav, 36); const m = fav / g; const n = 36 / g; return { q: `Two fair dice are rolled. The probability that the sum is $${s}$ is $\\frac mn$ in lowest terms. What is $m+n$?`, ans: m + n, ...choices5(m + n, 4, 2), hint: 'Count pairs $(a,b)$ with $a+b=s$, out of 36.', topic: 'counting' }; },
  binomial(t) { const n = between(5, T(t, 8, 12)); const k = between(2, Math.min(4, n - 2)); const ans = C(n, k); return { q: `What is the coefficient of $x^{${k}}$ in the expansion of $(x+1)^{${n}}$?`, ans, ...choices5(ans, Math.max(3, Math.round(ans / 6)), 1), hint: 'Binomial theorem: the coefficient is $\\binom nk$.', topic: 'counting' }; },
  quadratic(t) { const r = between(-6, 9) || 2; const s = between(-6, 9) || 3; const S = r + s; const P = r * s; const ans = S * S - 2 * P; const sg = (v) => (v < 0 ? `- ${-v}` : `+ ${v}`); return { q: `The roots of $x^2 ${sg(-S)}x ${sg(P)} = 0$ are $r$ and $s$. What is $r^2+s^2$?`, ans, ...choices5(ans, 4, 0), hint: 'Vieta: $r+s$ and $rs$; then $r^2+s^2=(r+s)^2-2rs$.', topic: 'algebra' }; },
  sequence(t) { const a = between(1, 15); const d = between(2, 9); const n = between(10, T(t, 15, 40)); const ans = (n * (2 * a + (n - 1) * d)) / 2; return { q: `An arithmetic sequence starts $${a}, ${a + d}, ${a + 2 * d}, \\dots$ What is the sum of its first $${n}$ terms?`, ans, ...choices5(ans, Math.max(5, d * 3), 1), hint: 'Sum $=\\frac n2\\,(\\text{first}+\\text{last})$, with last $=a+(n-1)d$.', topic: 'algebra' }; },
  logs(t) { const p = between(1, 6); const q = between(1, 6); const base = pick([2, 3]); return { q: `What is $\\log_{${base}} ${base ** p}+\\log_{${base}} ${base ** q}$?`, ans: p + q, ...choices5(p + q, 3, 0), hint: '$\\log_b x+\\log_b y=\\log_b(xy)$.', topic: 'algebra' }; },
};
export const TOPIC_OF = Object.fromEntries(Object.keys(GEN).map((k) => [k, GEN[k](1).topic]));

// A quick question from one of the monster's topics, at its tier (1–5).
export function quick(topics, tier) {
  const key = pick(topics);
  const p = GEN[key](tier);
  return { kind: 'quick', key, ...p, letters: 'ABCDE' };
}

// ------------------------------------------------------------------ real contest problems
const HF = 'https://datasets-server.huggingface.co';
const E2H = 'furonghuang-lab/Easy2Hard-Bench';
const AIME_DS = 'di-zhang-fdu/AIME_1983_2024';
const FIGURE = /\b(shown (below|above|in the (figure|diagram))|in the (figure|diagram) (below|above)|figure below|diagram below|the figure shows|pictured below)\b/i;
const totals = (() => { try { return JSON.parse(localStorage.getItem('numeria:totals') || '{}'); } catch { return {}; } })();
const saveTotals = () => { try { localStorage.setItem('numeria:totals', JSON.stringify(totals)); } catch { /* full */ } };
async function getJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}
async function filterRow(ds, config, split, where) {
  const key = `${ds}|${config}|${split}|${where}`;
  const url = (off, len) => `${HF}/filter?dataset=${encodeURIComponent(ds)}&config=${config}&split=${split}&where=${encodeURIComponent(where)}&offset=${off}&length=${len}`;
  if (totals[key] == null) { const j = await getJSON(url(0, 1)); totals[key] = j.num_rows_total || 0; saveTotals(); if (!totals[key]) return null; if (totals[key] === 1) return j.rows[0]?.row; }
  if (!totals[key]) return null;
  const j = await getJSON(url(rnd(totals[key]), 1));
  return j.rows?.[0]?.row || null;
}
const TAG = { amc8: 'AMC8', amc10: 'AMC10', amc12: 'AMC12', aime: 'AIME' };
function guessTopic(text) {
  if (/probabilit|how many ways|arrangement|choose|committee|dice|coins?\b|permutation|subsets?/i.test(text)) return 'counting';
  if (/triangle|circle|angle|polygon|square|rectangle|perimeter|radius|area|hexagon|trapezoid|tangent|diameter|chord|parallelogram/i.test(text)) return 'geometry';
  if (/divisib|prime|remainder|digit|integer[s]? n\b|gcd|greatest common|least common|factor|mod(ulo)?\b|multiple of/i.test(text)) return 'nt';
  return 'algebra';
}
function aopsLink(year, contest, part, num) {
  const p = part ? `_${part}` : '';
  return `https://artofproblemsolving.com/wiki/index.php/${year}_${contest}${p}_Problems/Problem_${num}`;
}
function finishCard(text, answer, extra) {
  const num = exprValue(answer);
  if (!Number.isFinite(num)) return null;
  return { kind: 'real', html: textToHtml(text), ans: num, ansTex: cleanTex(answer), topic: guessTopic(text), ...extra };
}
// spec: { tier, rating: [lo, hi] } or { tier: 'aime', problem: [lo, hi] }
export async function realProblem(spec) {
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      if (spec.problem && (attempt % 2 === 0)) {
        const [lo, hi] = spec.problem;
        const row = await filterRow(AIME_DS, 'default', 'train', `"Problem Number" >= ${lo} AND "Problem Number" <= ${hi}`);
        if (!row || !row.Question || FIGURE.test(row.Question)) continue;
        const year = row.Year; const part = year >= 2000 && row.Part ? row.Part : '';
        const card = finishCard(row.Question, String(row.Answer), { label: `${year} AIME${part ? ` ${part}` : ''} #${row['Problem Number']}`, tierName: 'AIME', link: aopsLink(year, 'AIME', part, row['Problem Number']), rating: 3 + row['Problem Number'] / 5, id: `aime:${row.ID}` });
        if (card) return card;
        continue;
      }
      const tag = TAG[spec.tier];
      const [lo, hi] = spec.rating || [0, 10];
      const relax = attempt >= 3; // drop the rating window if it's too narrow
      const where = `"tag"='${tag}'${relax ? '' : ` AND "unnorm_rating" >= ${lo} AND "unnorm_rating" < ${hi}`}`;
      const split = Math.random() < 0.75 ? 'eval' : 'train';
      const row = await filterRow(E2H, 'E2H-AMC', split, where);
      if (!row || !row.problem || FIGURE.test(row.problem)) continue;
      const sub = String(row.subtest || '');
      let contest = 'AMC_8'; let part = ''; let name = 'AMC 8';
      if (tag === 'AMC10' || tag === 'AMC12') { const m = sub.match(/(10|12)([AB])?/); contest = `AMC_${m ? m[1] : tag.slice(3)}${m && m[2] ? m[2] : ''}`; name = contest.replace('_', ' '); }
      if (tag === 'AIME') { part = (sub.match(/I{1,2}$/) || [''])[0]; contest = 'AIME'; name = `AIME${part ? ` ${part}` : ''}`; }
      const card = finishCard(row.problem, String(row.answer), { label: `${row.year} ${name} #${row.index}`, tierName: name, link: aopsLink(row.year, contest, part, row.index), solution: row.solution ? textToHtml(row.solution.replace(/\\section\*?\{[^}]*\}/g, '')) : null, solutionText: row.solution || null, rating: row.unnorm_rating, id: `e2h:${tag}:${row.year}:${sub}:${row.index}` });
      if (card) return card;
    } catch (e) { if (attempt === 5) throw e; }
  }
  throw new Error('Could not load a contest problem');
}

// ------------------------------------------------------------------ hints (class abilities)
export function hintFor(kind, p) {
  const v = p.ans;
  if (kind === 'estimate') {
    if (!Number.isFinite(v)) return 'No estimate available.';
    const w = Math.max(2, Math.abs(v) * (0.25 + Math.random() * 0.2));
    const lo = Math.floor(v - w * Math.random()); const hi = Math.ceil(lo + w * 1.3);
    return `The answer is between ${lo} and ${hi}.`;
  }
  if (kind === 'lastdigit') return Number.isInteger(v) ? `The answer ends in ${Math.abs(v) % 10}.` : 'The answer isn’t a whole number.';
  if (kind === 'eliminate') return Number.isInteger(v) ? `The answer is ${v % 2 === 0 ? 'even' : 'odd'}.` : 'The answer isn’t a whole number.';
  if (kind === 'sketch') {
    if (p.hint) return p.hint;
    if (p.solutionText) { const m = p.solutionText.replace(/\\section\*?\{[^}]*\}/g, '').trim().match(/^[\s\S]{20,260}?[.!?](\s|$)/); if (m) return m[0].trim(); }
    return 'Draw it, label everything, and look for a familiar pattern.';
  }
  return '';
}
