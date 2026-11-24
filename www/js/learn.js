// Learn: Duolingo-style courses. A course is a winding path of units; each unit has four lessons, a
// treasure chest and a unit test, a guidebook of key ideas, and a legendary (no-mistakes) challenge.
// Foundations courses use the MATH dataset (levels 1–5); Olympiad courses use Omni-MATH difficulty bands.

const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

const MATH_UNITS = ['Foundations', 'Building blocks', 'Stepping up', 'Contest ready', 'Mastery'];
const OLY_BANDS = [
  { name: 'Warm-up', sub: 'Difficulty 1–3', lo: 1, hi: 3 },
  { name: 'AMC level', sub: 'Difficulty 3–4', lo: 3, hi: 4 },
  { name: 'AIME level', sub: 'Difficulty 4–5', lo: 4, hi: 5 },
  { name: 'Olympiad', sub: 'Difficulty 5–6.5', lo: 5, hi: 6.5 },
  { name: 'National & IMO', sub: 'Difficulty 6.5+', lo: 6.5, hi: 10.1 },
];

export const COURSES = [
  { id: 'prealgebra', group: 'Foundations', icon: '➗', color: '#58cc02', blurb: 'Fractions, percents, ratios, basic equations' },
  { id: 'algebra', group: 'Foundations', icon: '𝑥', color: '#1cb0f6', blurb: 'Linear equations, quadratics, functions' },
  { id: 'number_theory', group: 'Foundations', icon: '🔢', color: '#ce82ff', blurb: 'Divisibility, primes, remainders' },
  { id: 'counting_and_probability', group: 'Foundations', icon: '🎲', color: '#ff9600', blurb: 'Counting, combinations, probability' },
  { id: 'geometry', group: 'Foundations', icon: '📐', color: '#ff4b4b', blurb: 'Angles, triangles, circles, area' },
  { id: 'intermediate_algebra', group: 'Foundations', icon: '∑', color: '#2b70c9', blurb: 'Polynomials, inequalities, sequences' },
  { id: 'precalculus', group: 'Foundations', icon: '📈', color: '#00cd9c', blurb: 'Trigonometry, vectors, complex numbers' },
  { id: 'oly_nt', group: 'Olympiad', name: 'Olympiad Number Theory', topic: 'nt', icon: '🧮', color: '#a560e8', blurb: 'Modular arithmetic, divisibility, Diophantine equations' },
  { id: 'oly_comb', group: 'Olympiad', name: 'Olympiad Combinatorics', topic: 'comb', icon: '🧩', color: '#e8730c', blurb: 'Counting, pigeonhole, invariants, graphs' },
  { id: 'oly_alg', group: 'Olympiad', name: 'Olympiad Algebra', topic: 'alg', icon: '⚖️', color: '#1899d6', blurb: 'Inequalities, polynomials, sequences, functions' },
  { id: 'oly_geo', group: 'Olympiad', name: 'Olympiad Geometry', topic: 'geo', icon: '⭕', color: '#e03e3e', blurb: 'Triangles, circles, similarity, trig and coordinates' },
  { id: 'oly_mixed', group: 'Olympiad', name: 'Olympiad Mixed', topic: null, icon: '🏅', color: '#d4a106', blurb: 'All olympiad topics, from HMMT and AIME to the IMO' },
];
const isOly = (c) => c.group === 'Olympiad';
const courseName = (ctx, c) => c.name || ctx.subjects[c.id];
const unitName = (c, u) => (isOly(c) ? OLY_BANDS[u].name : MATH_UNITS[u]);
const unitSub = (c, u) => (isOly(c) ? OLY_BANDS[u].sub : `Level ${u + 1}`);
export const problemSpec = (c, u) => (isOly(c) ? { kind: 'oly', topic: c.topic, lo: OLY_BANDS[u].lo, hi: OLY_BANDS[u].hi } : { kind: 'math', config: c.id, level: u + 1 });

// Key ideas for each unit ("guidebook"). $…$ is rendered as maths.
const GUIDE = {
  prealgebra: [
    ['Order of operations: brackets, powers, then $\\times\\div$, then $+-$, left to right.', 'To add fractions, use a common denominator: $\\frac12+\\frac13=\\frac56$.', '$x\\%$ of $y$ is $\\frac{x}{100}\\cdot y$.'],
    ['Ratios: if $a:b=2:3$, write $a=2k$, $b=3k$.', 'Average $=\\dfrac{\\text{sum}}{\\text{count}}$, so sum $=$ average $\\times$ count.', 'Solve one-step equations by doing the same thing to both sides.'],
    ['Primes and factor trees: $360=2^3\\cdot 3^2\\cdot 5$.', 'Area of a rectangle $=lw$, triangle $=\\frac12bh$, circle $=\\pi r^2$.', 'Percent change $=\\dfrac{\\text{new}-\\text{old}}{\\text{old}}\\times100\\%$.'],
    ['Distance $=$ rate $\\times$ time; combine rates for people working together.', 'Count carefully: list systematically, or multiply choices.', 'Use the Pythagorean theorem $a^2+b^2=c^2$ for right triangles.'],
    ['Multi-step word problems: name the unknown, write one equation, then solve.', 'Check answers with estimation.', 'Simplify before computing: cancel common factors first.'],
  ],
  algebra: [
    ['Linear equations: collect $x$ on one side.', 'Slope $m=\\dfrac{y_2-y_1}{x_2-x_1}$; line $y=mx+b$.', 'Distribute carefully: $-(a-b)=-a+b$.'],
    ['Systems: substitute or eliminate.', 'Exponent rules: $a^m a^n=a^{m+n}$, $(a^m)^n=a^{mn}$, $a^{-n}=1/a^n$.', 'Absolute value $|x-a|=b$ gives two cases.'],
    ['Factor quadratics: $x^2+5x+6=(x+2)(x+3)$.', 'Quadratic formula: $x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}$.', 'Vieta: roots sum to $-b/a$ and multiply to $c/a$.'],
    ['Functions: $f(g(x))$ means apply $g$ first.', 'Completing the square: $x^2+6x=(x+3)^2-9$.', 'Arithmetic series sum $=\\dfrac{n(a_1+a_n)}{2}$.'],
    ['Rationalise: $\\dfrac{1}{\\sqrt2}=\\dfrac{\\sqrt2}{2}$.', 'Domain and range: watch for division by zero and square roots of negatives.', 'Look for symmetry and clever substitutions.'],
  ],
  number_theory: [
    ['Divisibility rules: 3 and 9 by digit sum, 4 by the last two digits, 11 by alternating sum.', 'Every integer $>1$ factors uniquely into primes.', '$\\gcd(a,b)\\cdot\\text{lcm}(a,b)=ab$.'],
    ['Remainders add and multiply: work mod $n$.', 'Number of divisors of $p^a q^b$ is $(a+1)(b+1)$.', 'Units digits repeat in cycles.'],
    ['Base $b$: $\\overline{abc}_b=ab^2+bb+c$.', 'Euclidean algorithm: $\\gcd(a,b)=\\gcd(b,a\\bmod b)$.', 'Consecutive integers are coprime.'],
    ['Fermat: $a^{p-1}\\equiv1\\pmod p$ if $p\\nmid a$.', 'Modular inverses exist when $\\gcd(a,n)=1$.', 'Sum of divisors of $p^a$ is $\\dfrac{p^{a+1}-1}{p-1}$.'],
    ['Chinese remainder theorem combines congruences.', 'Linear Diophantine $ax+by=c$ is solvable iff $\\gcd(a,b)\\mid c$.', 'Look at the problem mod small numbers (2, 3, 4, 8, 9).'],
  ],
  counting_and_probability: [
    ['Multiplication principle: independent choices multiply.', 'Probability $=\\dfrac{\\text{favourable}}{\\text{total}}$ when outcomes are equally likely.', 'Complementary counting: count what you don\'t want.'],
    ['Permutations $n!$; arrangements of $k$ from $n$: $\\frac{n!}{(n-k)!}$.', 'Combinations $\\binom nk=\\frac{n!}{k!(n-k)!}$.', 'Repeated letters: divide by the repeats\' factorials.'],
    ['Stars and bars: $\\binom{n+k-1}{k-1}$ ways to split $n$ into $k$ nonnegative parts.', 'Inclusion–exclusion: $|A\\cup B|=|A|+|B|-|A\\cap B|$.', 'Expected value is linear.'],
    ['Pascal\'s triangle and $\\binom nk=\\binom{n-1}{k-1}+\\binom{n-1}{k}$.', 'Binomial theorem: $(x+y)^n=\\sum\\binom nk x^k y^{n-k}$.', 'Geometric probability: compare lengths or areas.'],
    ['Casework: split into cases that don\'t overlap.', 'Recursion: build the answer for $n$ from smaller $n$.', 'Symmetry often halves the work.'],
  ],
  geometry: [
    ['Angles in a triangle sum to $180^\\circ$; straight line $180^\\circ$.', 'Vertical angles are equal; parallel lines make equal corresponding angles.', 'Area of triangle $=\\frac12 bh$.'],
    ['Pythagorean triples: 3-4-5, 5-12-13, 8-15-17.', '30-60-90 sides: $1:\\sqrt3:2$; 45-45-90: $1:1:\\sqrt2$.', 'Similar triangles have proportional sides.'],
    ['Circle: $C=2\\pi r$, $A=\\pi r^2$; arc and sector are fractions of these.', 'An inscribed angle is half its arc.', 'Polygon interior angles sum to $180(n-2)$.'],
    ['Heron: $A=\\sqrt{s(s-a)(s-b)(s-c)}$.', 'Power of a point: $PA\\cdot PB=PC\\cdot PD$.', 'Volume: prism $Bh$, pyramid and cone $\\frac13Bh$, sphere $\\frac43\\pi r^3$.'],
    ['Coordinates turn geometry into algebra.', 'Draw a big, accurate diagram first.', 'Area ratios of triangles with the same height equal base ratios.'],
  ],
  intermediate_algebra: [
    ['Polynomial division and the remainder theorem: $p(a)$ is the remainder on dividing by $x-a$.', 'Vieta for cubics: $r_1+r_2+r_3=-b/a$.', 'Conjugate roots come in pairs.'],
    ['AM–GM: $\\frac{a+b}2\\ge\\sqrt{ab}$ for $a,b\\ge0$.', 'Logs: $\\log(ab)=\\log a+\\log b$, $\\log_b a=\\frac{\\ln a}{\\ln b}$.', 'Geometric series: $\\frac{a}{1-r}$ when $|r|<1$.'],
    ['Complex numbers: $i^2=-1$, $|a+bi|=\\sqrt{a^2+b^2}$.', 'Conics: circle, ellipse $\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1$, hyperbola, parabola.', 'Telescoping sums: $\\frac1{n(n+1)}=\\frac1n-\\frac1{n+1}$.'],
    ['Functional equations: plug in special values like $0$, $1$, $x=y$.', 'Cauchy–Schwarz: $(\\sum a_i^2)(\\sum b_i^2)\\ge(\\sum a_ib_i)^2$.', 'Floor function: write $x=\\lfloor x\\rfloor+\\{x\\}$.'],
    ['Symmetric sums: express in terms of $e_1,e_2,e_3$.', 'Substitute to reduce degree.', 'Check edge cases and equality conditions.'],
  ],
  precalculus: [
    ['Unit circle: $\\sin^2\\theta+\\cos^2\\theta=1$.', 'Special angles: $\\sin30^\\circ=\\frac12$, $\\cos45^\\circ=\\frac{\\sqrt2}2$.', 'Radians: $\\pi=180^\\circ$.'],
    ['Addition formulas: $\\sin(a+b)=\\sin a\\cos b+\\cos a\\sin b$.', 'Double angle: $\\cos2\\theta=1-2\\sin^2\\theta$.', 'Law of cosines: $c^2=a^2+b^2-2ab\\cos C$.'],
    ['Vectors: dot product $u\\cdot v=|u||v|\\cos\\theta$.', 'Matrices: $\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}=ad-bc$.', 'Polar form $re^{i\\theta}$.'],
    ['De Moivre: $(\\cos\\theta+i\\sin\\theta)^n=\\cos n\\theta+i\\sin n\\theta$.', 'Roots of unity are evenly spaced on the unit circle.', 'Cross product gives area of parallelograms.'],
    ['Parametric curves and projections.', 'Convert between rectangular, polar and spherical coordinates.', 'Use symmetry of trig graphs.'],
  ],
  nt: [
    ['Parity: odd/even arguments solve many problems.', 'Divisibility tricks and prime factorisation.', 'Last digits: work mod 10.'],
    ['Congruences: $a\\equiv b\\pmod n$ means $n\\mid a-b$.', 'Count divisors with exponents: $\\tau(n)=\\prod(e_i+1)$.', 'Squares are $0$ or $1\\pmod 4$, and $0,1,4\\pmod 8$ only for $0,1,4$.'],
    ['Fermat and Euler: $a^{\\varphi(n)}\\equiv1\\pmod n$ when $\\gcd(a,n)=1$.', 'Wilson: $(p-1)!\\equiv-1\\pmod p$.', 'Legendre: the power of $p$ in $n!$ is $\\sum\\lfloor n/p^k\\rfloor$.'],
    ['Orders: the smallest $k$ with $a^k\\equiv1$ divides $\\varphi(n)$.', 'Lifting the exponent for $v_p(a^n-b^n)$.', 'Bound one variable, then check cases.'],
    ['Vieta jumping for symmetric Diophantine equations.', 'Quadratic residues and sums of two squares.', 'Infinite descent: a smallest solution leads to a contradiction.'],
  ],
  comb: [
    ['Complementary counting and casework.', 'Bijections: count something easier that matches one-to-one.', 'Pigeonhole: $n+1$ objects in $n$ boxes forces a shared box.'],
    ['Stars and bars, inclusion–exclusion.', 'Recursions: find $a_n$ from $a_{n-1},a_{n-2}$.', 'Expected value by linearity, even when events depend on each other.'],
    ['Invariants: find a quantity that never changes.', 'Colourings: chessboard colouring shows impossibility.', 'Double counting: count one set two ways.'],
    ['Extremal principle: look at the largest or smallest element.', 'Graph theory: degrees sum to twice the number of edges.', 'Generating functions encode counting sequences.'],
    ['Combinatorial games: winning and losing positions.', 'Probabilistic method: show a good object exists.', 'Construct examples and prove bounds that match.'],
  ],
  alg: [
    ['Manipulate expressions: factor, complete the square.', 'Vieta and symmetric sums.', 'Sequences: arithmetic, geometric, recursive.'],
    ['AM–GM and QM–AM–GM–HM.', 'Telescoping sums and products.', 'Floor and fractional parts.'],
    ['Polynomials: roots, remainder theorem, integer root theorem.', 'Cauchy–Schwarz in Engel form: $\\sum\\frac{a_i^2}{b_i}\\ge\\frac{(\\sum a_i)^2}{\\sum b_i}$.', 'Complex roots of unity filter sums.'],
    ['Functional equations: substitutions, injectivity, fixed points.', 'Jensen\'s inequality for convex functions.', 'Schur, Muirhead and SOS for symmetric inequalities.'],
    ['Equality cases guide the proof.', 'Smoothing and mixing variables.', 'Polynomials over the integers: $a-b\\mid P(a)-P(b)$.'],
  ],
  geo: [
    ['Angle chasing in triangles and with parallel lines.', 'Similar triangles: AA similarity.', 'Area tricks: shared heights.'],
    ['Inscribed angles and cyclic quadrilaterals (opposite angles sum to $180^\\circ$).', 'Power of a point.', 'Pythagoras and special right triangles.'],
    ['Triangle centres: incentre, circumcentre, centroid, orthocentre.', 'Law of sines: $\\frac a{\\sin A}=2R$.', 'Stewart\'s theorem and angle bisector theorem.'],
    ['Ceva and Menelaus for concurrency and collinearity.', 'Trig Ceva; ratio lemma.', 'Coordinates, complex numbers or vectors when angles fail.'],
    ['Inversion, homothety and spiral similarity.', 'Radical axes.', 'Projective tools: cross-ratio, harmonic divisions.'],
  ],
};
GUIDE.oly_nt = GUIDE.nt; GUIDE.oly_comb = GUIDE.comb; GUIDE.oly_alg = GUIDE.alg; GUIDE.oly_geo = GUIDE.geo;
GUIDE.oly_mixed = GUIDE.nt.map((x, u) => [x[0], GUIDE.comb[u][0], GUIDE.alg[u][0], GUIDE.geo[u][0]]);

const UNITS = 5; const PER_UNIT = 5; // 4 lessons + a unit test (the chest sits between lessons 2 and 3)
const TOTAL = UNITS * PER_UNIT;
const ZIG = [0, 46, 70, 46, 0, -46, -70, -46];
const nodeInfo = (k) => {
  const unit = Math.floor(k / PER_UNIT); const slot = k % PER_UNIT;
  const test = slot === PER_UNIT - 1;
  return { unit, slot, test, questions: test ? 8 : 5, hearts: 3, label: test ? `Unit ${unit + 1} test` : `Lesson ${slot + 1}` };
};
const xpFor = (info, oly) => Math.round((info.test ? 25 + 5 * (info.unit + 1) : 10 + 3 * (info.unit + 1)) * (oly ? 1.5 : 1));

// ------------------------------------------------------------------ path
export function openLearn(ctx) {
  const p = ctx.progress();
  p.done ||= {}; p.chests ||= {}; p.legend ||= {}; p.mistakes ||= [];
  if (!p.course) return pickCourse(ctx);
  const course = COURSES.find((c) => c.id === p.course) || COURSES[0];
  const done = p.done[course.id] || 0;
  const oly = isOly(course);
  const body = el(`<div class="learn" style="--cc:${course.color}">
    <div class="learn-head"><button class="learn-course">${course.icon} <b>${courseName(ctx, course)}</b> <span>▾</span></button><span class="learn-pct">${Math.round((100 * done) / TOTAL)}%</span></div>
    ${p.mistakes.length ? `<button class="learn-review">🔁 Review mistakes <b>${p.mistakes.length}</b></button>` : ''}
    <div class="learn-path"></div></div>`);
  body.querySelector('.learn-course').addEventListener('click', () => pickCourse(ctx));
  body.querySelector('.learn-review')?.addEventListener('click', () => startLesson(ctx, course, { unit: 0, test: false, questions: Math.min(5, p.mistakes.length), hearts: 99, label: 'Mistakes review' }, { review: true }));
  const path = body.querySelector('.learn-path');
  for (let u = 0; u < UNITS; u++) {
    const unitLocked = done < u * PER_UNIT;
    const unitDone = done >= (u + 1) * PER_UNIT;
    const legend = (p.legend[course.id] || []).includes(u);
    const band = el(`<div class="unit-band ${unitLocked ? 'locked' : ''} ${legend ? 'legend' : ''}"><div><small>Unit ${u + 1} · ${unitSub(course, u)}</small><b>${legend ? '👑 ' : ''}${unitName(course, u)}</b></div>
      <span class="band-btns"><button class="band-btn guide" aria-label="Guidebook">📖</button>${unitLocked ? '<button class="btn small jump">Jump here</button>' : unitDone && !legend ? '<button class="band-btn legend-go" aria-label="Legendary challenge">👑</button>' : ''}</span></div>`);
    band.querySelector('.guide').addEventListener('click', () => guidebook(ctx, course, u));
    band.querySelector('.jump')?.addEventListener('click', () => confirmJump(ctx, course, u));
    band.querySelector('.legend-go')?.addEventListener('click', () => legendIntro(ctx, course, u));
    path.appendChild(band);
    const col = el('<div class="unit-nodes"></div>');
    for (let s = 0; s < PER_UNIT; s++) {
      const k = u * PER_UNIT + s; const info = nodeInfo(k);
      const st = k < done ? 'done' : k === done ? 'current' : 'locked';
      const n = el(`<div class="node-wrap" style="--x:${ZIG[(k + Math.floor(k / PER_UNIT)) % ZIG.length]}px"><button class="node ${st} ${info.test ? 'test' : ''}" aria-label="${info.label}">${info.test ? '🏆' : st === 'done' ? '✓' : st === 'locked' ? '🔒' : '★'}</button>${st === 'current' ? '<span class="node-start">START</span>' : ''}</div>`);
      n.querySelector('.node').addEventListener('click', () => nodePopup(ctx, course, k, st, n));
      col.appendChild(n);
      if (s === 1) { // treasure chest after lesson 2
        const reached = done >= k + 1; const opened = (p.chests[course.id] || []).includes(u);
        const c = el(`<div class="node-wrap" style="--x:${-ZIG[(k + 2) % ZIG.length]}px"><button class="chest-node ${opened ? 'opened' : reached ? 'ready' : ''}" aria-label="Treasure chest">${opened ? '📭' : '🎁'}</button></div>`);
        c.querySelector('button').addEventListener('click', () => {
          if (opened) return ctx.toast('Already opened');
          if (!reached) return ctx.toast('Finish lesson 2 to open this chest');
          (p.chests[course.id] ||= []).push(u); ctx.save();
          const bonus = 3 + u; ctx.chest(bonus, 10 + 5 * u);
          ctx.toast(`Chest: +${bonus} ⚡ and +${10 + 5 * u} XP!`); openLearn(ctx);
        });
        col.appendChild(c);
      }
    }
    path.appendChild(col);
  }
  if (done >= TOTAL) path.appendChild(el(`<div class="course-done">🏆 You finished ${courseName(ctx, course)}! Earn 👑 in every unit, or pick another course.</div>`));
  ctx.openSheet('Learn', body, 'tall');
  setTimeout(() => body.querySelector('.node.current')?.scrollIntoView({ block: 'center' }), 60);
}

function nodePopup(ctx, course, k, st, wrap) {
  document.querySelectorAll('.node-pop').forEach((x) => x.remove());
  const info = nodeInfo(k); const xp = xpFor(info, isOly(course));
  const pop = el(`<div class="node-pop ${st}">
    <b>${info.label}</b><small>${info.questions} questions · ${unitSub(course, info.unit)} · ${info.hearts} hearts</small>
    ${st === 'locked' ? '<p>Finish the lessons before this one to unlock it.</p>' : `<button class="btn wide go">${st === 'done' ? `Practise +${xp >> 1} XP` : `Start +${xp} XP`}</button>`}</div>`);
  document.querySelectorAll('.node-wrap.popped').forEach((x) => x.classList.remove('popped'));
  wrap.classList.add('popped'); // above the nodes below it
  wrap.appendChild(pop);
  pop.querySelector('.go')?.addEventListener('click', () => startLesson(ctx, course, info, { practice: st === 'done', node: k }));
  setTimeout(() => document.addEventListener('click', function off(e) { if (!pop.contains(e.target) && !wrap.contains(e.target)) { pop.remove(); document.removeEventListener('click', off); } }), 0);
}

function guidebook(ctx, course, u) {
  const tips = (GUIDE[course.id] || [])[u] || [];
  const body = el(`<div class="guidebook" style="--cc:${course.color}"><p class="small">Unit ${u + 1} · ${unitSub(course, u)}</p><h3>${unitName(course, u)}</h3><div class="gb-tips"></div>
    <button class="btn wide back">Back to the path</button></div>`);
  const box = body.querySelector('.gb-tips');
  tips.forEach((t, i) => { const row = el(`<div class="gb-tip"><span>${i + 1}</span><div></div></div>`); row.querySelector('div').appendChild(ctx.renderText(t)); box.appendChild(row); });
  body.querySelector('.back').addEventListener('click', () => openLearn(ctx));
  ctx.openSheet('📖 Guidebook', body, 'tall');
}
function confirmJump(ctx, course, u) {
  const body = el(`<div class="chess-pick"><p>Already know this? Pass a test at <b>${unitSub(course, u)}</b> to skip straight to Unit ${u + 1}: 8 questions, 3 hearts.</p><button class="btn wide go">Start the test</button><button class="btn ghost wide back">Not now</button></div>`);
  body.querySelector('.go').addEventListener('click', () => startLesson(ctx, course, { unit: u, test: true, questions: 8, hearts: 3, label: `Jump to unit ${u + 1}` }, { jump: u }));
  body.querySelector('.back').addEventListener('click', () => openLearn(ctx));
  ctx.openSheet(`Jump to unit ${u + 1}`, body, 'tall');
}
function legendIntro(ctx, course, u) {
  const body = el(`<div class="chess-pick legend-intro"><div class="le-big">👑</div><p><b>Legendary challenge</b> — 8 questions from Unit ${u + 1}, and <b>no mistakes allowed</b>. Win it to crown this unit and earn a big XP bonus.</p><button class="btn wide go">Start (1 ⚡)</button><button class="btn ghost wide back">Not now</button></div>`);
  body.querySelector('.go').addEventListener('click', async () => {
    if (!(await ctx.payOrSolve('start a legendary challenge'))) return;
    startLesson(ctx, course, { unit: u, test: true, questions: 8, hearts: 1, label: `Legendary · Unit ${u + 1}` }, { legend: u });
  });
  body.querySelector('.back').addEventListener('click', () => openLearn(ctx));
  ctx.openSheet('Legendary', body, 'tall');
}

function pickCourse(ctx) {
  const p = ctx.progress(); p.done ||= {};
  const groups = ['Foundations', 'Olympiad'];
  const body = el(`<div class="chess-pick">${groups.map((g) => `<h4 class="course-group">${g === 'Olympiad' ? '🏅 Olympiad' : '📘 Foundations'}</h4><p class="small">${g === 'Olympiad' ? 'Real olympiad problems (HMMT, AIME, USAMO, IMO and more), from warm-ups to IMO level.' : 'Competition problems from Level 1 warm-ups to Level 5 contest problems.'}</p>
    ${COURSES.filter((c) => c.group === g).map((c) => { const d = p.done[c.id] || 0; return `<button class="game-tile course-tile" data-c="${c.id}" style="--cc:${c.color}"><span class="g-icon">${c.icon}</span><span class="g-text"><b>${courseName(ctx, c)}${p.course === c.id ? ' ✓' : ''}</b><small>${c.blurb}</small><span class="course-bar"><i style="width:${(100 * d) / TOTAL}%"></i></span></span></button>`; }).join('')}`).join('')}</div>`);
  body.querySelectorAll('[data-c]').forEach((b) => b.addEventListener('click', () => { p.course = b.dataset.c; ctx.save(); openLearn(ctx); }));
  ctx.openSheet('Choose a course', body, 'tall');
}

// ------------------------------------------------------------------ a lesson
function startLesson(ctx, course, info, { practice = false, node = null, jump = null, legend = null, review = false } = {}) {
  ctx.closeSheet();
  const p = ctx.progress();
  const oly = isOly(course);
  const Q = info.questions;
  let hearts = info.hearts; let i = 0; let right = 0; let streak = 0; let alive = true;
  const seen = new Set(); const start = Date.now();
  const reviewQueue = review ? p.mistakes.slice(0, Q) : null;
  const ov = el(`<div class="lesson" style="--cc:${course.color}">
    <div class="lesson-top"><button class="lesson-x" aria-label="Quit">✕</button><div class="lesson-bar"><i></i></div><span class="hearts">${hearts > 9 ? '∞' : `❤️ <b>${hearts}</b>`}</span></div>
    <div class="lesson-streak"></div>
    <div class="lesson-stage"></div>
    <div class="lesson-foot" hidden><div class="lf-msg"></div><button class="btn wide lf-go">Continue</button></div></div>`);
  document.body.appendChild(ov);
  const stage = ov.querySelector('.lesson-stage'); const foot = ov.querySelector('.lesson-foot');
  const quit = () => { alive = false; ov.remove(); openLearn(ctx); };
  ov.querySelector('.lesson-x').addEventListener('click', () => {
    if (i === 0 || !alive) return quit();
    if (ov.querySelector('.quit-ask')) return;
    const ask = el('<div class="quit-ask"><b>Quit this lesson?</b><p>You’ll lose your progress in it.</p><button class="btn wide stay">Keep going</button><button class="btn ghost wide leave">Quit</button></div>');
    ov.appendChild(ask);
    ask.querySelector('.stay').addEventListener('click', () => ask.remove());
    ask.querySelector('.leave').addEventListener('click', quit);
  });
  const fetchOne = async () => {
    if (review) return reviewQueue.shift();
    for (let t = 0; t < 4; t++) { try { const c = await ctx.fetchProblem(problemSpec(course, info.unit), seen); seen.add(c.id); return c; } catch { /* retry */ } }
    throw new Error('offline');
  };
  let next = fetchOne();
  const show = async () => {
    ov.querySelector('.lesson-bar i').style.width = `${(100 * i) / Q}%`;
    foot.hidden = true;
    stage.innerHTML = '<p class="loader-msg">Loading…</p>';
    let card;
    try { card = await next; } catch { stage.innerHTML = '<p class="loader-msg">Couldn’t load problems. Check your connection.</p>'; return; }
    if (!alive || !card) return;
    next = i + 1 < Q ? fetchOne() : null;
    let answered = false;
    ctx.mountProblem(stage, { ...card, daily: false }, (ok) => {
      if (answered) return; answered = true;
      i++;
      if (ok) {
        right++; streak++;
        if (review) { p.mistakes = p.mistakes.filter((m) => m.id !== card.id); ctx.save(); }
        if (streak >= 3) { const s = ov.querySelector('.lesson-streak'); s.textContent = `🔥 ${streak} in a row!`; s.classList.remove('show'); void s.offsetWidth; s.classList.add('show'); }
      } else {
        streak = 0;
        if (!review) { p.mistakes = [card, ...p.mistakes.filter((m) => m.id !== card.id)].slice(0, 25); ctx.save(); }
        if (hearts <= 9) { hearts--; ov.querySelector('.hearts b').textContent = hearts; ov.querySelector('.hearts').classList.add('lost'); setTimeout(() => ov.querySelector('.hearts')?.classList.remove('lost'), 600); }
      }
      ov.querySelector('.lesson-bar i').style.width = `${(100 * i) / Q}%`;
      foot.hidden = false; foot.className = `lesson-foot ${ok ? 'ok' : 'no'}`;
      foot.querySelector('.lf-msg').innerHTML = ok ? `<b>${['Nice!', 'Correct!', 'Great job!', 'You got it!', 'Brilliant!'][right % 5]}</b>` : `<b>${hearts > 0 ? 'Not quite' : 'Out of hearts'}</b><small>${hearts > 0 && !review ? ' — saved to your mistakes to review later' : ''}</small>`;
      foot.querySelector('.lf-go').onclick = () => { if (hearts <= 0) return fail(); if (i >= Q) return finish(); show(); };
      setTimeout(() => foot.scrollIntoView({ block: 'end', behavior: 'smooth' }), 50);
    });
    stage.scrollTop = 0;
  };
  const fail = () => {
    alive = false; foot.hidden = true;
    stage.innerHTML = `<div class="lesson-end"><div class="le-big">${legend != null ? '👑' : '💔'}</div><h2>${legend != null ? 'So close!' : 'Out of hearts'}</h2><p>You got ${right} of ${i}. ${legend != null ? 'Legendary means no mistakes — try again when you’re ready.' : 'Try again — the problems will be different.'}</p><button class="btn wide again">Try again</button><button class="btn ghost wide back">Back to the path</button></div>`;
    stage.querySelector('.again').addEventListener('click', () => { ov.remove(); if (legend != null) legendIntro(ctx, course, legend); else startLesson(ctx, course, info, { practice, node, jump }); });
    stage.querySelector('.back').addEventListener('click', quit);
    ctx.sound('wrong');
  };
  const finish = () => {
    alive = false;
    const perfect = right === Q;
    let xp = xpFor(info, oly) + (perfect ? 5 : 0);
    if (practice || review) xp = Math.round(xp / 2);
    if (legend != null) xp = xpFor(info, oly) * 2;
    let unlocked = '';
    if (jump != null) { p.done[course.id] = Math.max(p.done[course.id] || 0, jump * PER_UNIT); unlocked = `Unit ${jump + 1} unlocked!`; }
    else if (legend != null) { (p.legend[course.id] ||= []).includes(legend) || p.legend[course.id].push(legend); unlocked = `Unit ${legend + 1} is now legendary 👑`; }
    else if (!practice && !review && node != null) { p.done[course.id] = Math.max(p.done[course.id] || 0, node + 1); if (info.test) unlocked = info.unit + 1 < UNITS ? `Unit ${info.unit + 2} unlocked!` : 'Course complete!'; }
    ctx.save();
    ctx.lessonDone(xp, { perfect });
    ctx.sound('level');
    const secs = Math.round((Date.now() - start) / 1000);
    foot.hidden = true;
    ov.querySelector('.lesson-bar i').style.width = '100%';
    stage.innerHTML = `<div class="lesson-end"><div class="le-big">${legend != null ? '👑' : info.test || jump != null ? '🏆' : perfect ? '🌟' : '🎉'}</div><h2>${legend != null ? 'Legendary!' : review ? 'Review done!' : jump != null ? 'Test passed!' : info.test ? 'Unit complete!' : perfect ? 'Perfect lesson!' : 'Lesson complete!'}</h2>
      ${unlocked ? `<p class="le-unlock">${unlocked}</p>` : ''}
      <div class="le-stats"><div><small>XP</small><b>+${xp}</b></div><div><small>Accuracy</small><b>${Math.round((100 * right) / Q)}%</b></div><div><small>Time</small><b>${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}</b></div></div>
      <p class="small">You also earned ${right} ⚡ for the mini-games.</p>
      <button class="btn wide cont">Continue</button><button class="btn ghost wide share-l">Share</button></div>`;
    stage.querySelector('.cont').addEventListener('click', quit);
    stage.querySelector('.share-l').addEventListener('click', () => ctx.shareText(`I just finished ${info.label} in ${courseName(ctx, course)} on MathScroll — ${right}/${Q} correct!`));
  };
  show();
}
