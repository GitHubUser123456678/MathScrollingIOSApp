// "Discover": maths for everyone — fun facts, brain teasers, visual proofs that build step by step,
// and number spotlights. Hand-written content; cards use the same shape as the other feed sources.

const rnd = (n) => Math.floor(Math.random() * n);
const pick = (a) => a[rnd(a.length)];

// ------------------------------------------------------------------ fun facts
// [emoji, headline, text, why (optional, shown under "Why?")]
const FACTS = [
  ['🃏', 'Every shuffle is probably new', 'There are $52!\\approx 8\\times10^{67}$ ways to order a deck of cards. Shuffle well and you have almost certainly made an order no one has ever held before.', '$52!$ means $52\\times51\\times\\cdots\\times1$. Even if every person who ever lived shuffled once a second for the age of the universe, they would not get close to that many orders.'],
  ['🎂', 'Birthday surprise', 'In a group of just $23$ people, it’s more likely than not that two share a birthday. With $70$ people it’s over $99.9\\%$.', 'Count the chance that everyone is different: $\\frac{365}{365}\\cdot\\frac{364}{365}\\cdots\\frac{343}{365}\\approx0.49$. So the chance of a match is about $0.51$.'],
  ['♾️', '0.999… really is 1', 'The repeating decimal $0.999\\ldots$ is exactly equal to $1$, not just “very close”.', 'Let $x=0.999\\ldots$ Then $10x=9.999\\ldots$, and subtracting gives $9x=9$, so $x=1$.'],
  ['🏨', 'Hilbert’s infinite hotel', 'A hotel with infinitely many rooms, all full, can still fit a new guest: everyone moves from room $n$ to room $n+1$.', 'Infinity doesn’t behave like a big number. Even infinitely many new guests fit: move everyone to room $2n$, freeing all the odd rooms.'],
  ['📏', 'Some infinities are bigger', 'There are more real numbers between $0$ and $1$ than there are whole numbers — even though both are infinite.', 'Georg Cantor’s “diagonal argument” (1891) shows any list of decimals misses at least one number, so the decimals can’t be counted.'],
  ['🥧', 'π has been computed to over 100 trillion digits', 'Computers have calculated π to more than $100$ trillion decimal places. About $40$ digits are enough to work out the size of the observable universe to within an atom.', null],
  ['✨', 'The most beautiful equation', '$e^{i\\pi}+1=0$ links five famous numbers — $0$, $1$, $\\pi$, $e$ and $i$ — in one line. It’s called Euler’s identity.', 'It comes from Euler’s formula $e^{i\\theta}=\\cos\\theta+i\\sin\\theta$ with $\\theta=\\pi$.'],
  ['🔢', 'A palindrome of ones', '$111111111^2=12345678987654321$.', 'Squaring repunits (numbers made of 1s) makes the digits climb and fall, until carrying starts to interfere after nine 1s.'],
  ['📄', 'Fold to the Moon', 'If you could fold a $0.1$ mm sheet of paper in half $42$ times, it would be thicker than the distance to the Moon.', 'Each fold doubles the thickness: $0.1\\text{ mm}\\times2^{42}\\approx440{,}000$ km, more than the $384{,}400$ km to the Moon.'],
  ['🚕', 'The taxicab number', '$1729$ is the smallest number that is a sum of two cubes in two different ways: $1^3+12^3=9^3+10^3$.', 'Ramanujan pointed this out to G. H. Hardy, who had arrived in taxi number 1729 and called it a dull number.'],
  ['🟧', 'Odd numbers build squares', '$1+3+5+\\cdots$ up to the $n$th odd number always equals $n^2$. For example $1+3+5+7=16$.', 'Each odd number is an L-shaped layer that turns an $n\\times n$ square into an $(n+1)\\times(n+1)$ one.'],
  ['🔍', 'Googol', 'A googol is $10^{100}$ — a 1 followed by 100 zeros. The company Google is named after it (spelled differently).', null],
  ['🧩', 'God’s number is 20', 'A Rubik’s Cube has $43{,}252{,}003{,}274{,}489{,}856{,}000$ positions, but every one can be solved in at most $20$ moves (proved in 2010).', null],
  ['🐝', 'Bees are clever mathematicians', 'Hexagons divide a flat surface into equal cells using the least total wall length. Thomas Hales proved this “honeycomb conjecture” in 1999.', null],
  ['🗺️', 'Four colours are enough', 'Any map can be coloured with just four colours so that neighbouring countries never match. It was the first major theorem proved with a computer (1976).', null],
  ['🌻', 'Fibonacci in flowers', 'The spirals of seeds in a sunflower usually come in Fibonacci numbers, like $34$ one way and $55$ the other.', 'Fibonacci numbers go $1,1,2,3,5,8,13,21,34,55,\\ldots$ — each is the sum of the two before.'],
  ['🌀', 'The mysterious 6174', 'Take any four-digit number (not all digits the same). Arrange its digits largest-first and smallest-first, subtract, and repeat. You always reach $6174$ within $7$ steps.', 'Example: $3524\\to5432-2345=3087\\to8730-0378=8352\\to8532-2358=6174$. Then $7641-1467=6174$ forever.'],
  ['🔁', 'The cyclic number 142857', '$142857\\times2=285714$, $\\times3=428571$, $\\times4=571428$ — the same digits, rotated. And $142857\\times7=999999$.', 'It comes from $\\frac17=0.\\overline{142857}$.'],
  ['0️⃣', 'Zero is a newer idea than you think', 'Zero as a number in its own right, with rules like $a+0=a$, was written down by the Indian mathematician Brahmagupta in 628 CE.', null],
  ['🧮', 'Algorithm is a person’s name', 'The word “algorithm” comes from al-Khwārizmī, a 9th-century Persian scholar in Baghdad. “Algebra” comes from the title of his book.', null],
  ['🎀', 'A strip with one side', 'Give a paper strip a half-twist and tape the ends: you get a Möbius strip, which has only one side and one edge. Cut it down the middle and it stays in one piece!', null],
  ['♾️', 'Primes never run out', 'There are infinitely many prime numbers. Euclid proved it around 300 BCE.', 'If there were only finitely many, multiply them all and add $1$. That number isn’t divisible by any prime on the list — a contradiction.'],
  ['📜', '358 years for one proof', 'Fermat scribbled in 1637 that $a^n+b^n=c^n$ has no positive whole-number solutions when $n>2$. Andrew Wiles proved it in 1994–95.', null],
  ['❓', 'Unsolved and simple', 'Is every even number greater than $2$ the sum of two primes? Nobody knows! This is Goldbach’s conjecture from 1742, checked by computer up to $4\\times10^{18}$.', null],
  ['🔂', 'The 3n + 1 puzzle', 'Pick any number. If it’s even, halve it; if it’s odd, triple it and add $1$. Repeat. Every number ever tried reaches $1$ — but no one can prove it always happens.', 'This is the Collatz conjecture. Starting at $27$ takes $111$ steps and climbs as high as $9232$ before falling to $1$.'],
  ['📊', 'Benford’s law', 'In lots of real data — populations, prices, river lengths — about $30\\%$ of numbers start with a $1$, and fewer than $5\\%$ start with a $9$.', 'Auditors use this to spot made-up accounts, because invented numbers tend to be spread too evenly.'],
  ['🍕', 'Pizza maths', 'A pizza with radius $z$ and thickness $a$ has volume $\\pi\\cdot z\\cdot z\\cdot a$ — “pi z z a”.', null],
  ['⏱️', 'Ten factorial seconds', '$10!$ seconds is exactly $6$ weeks.', '$10!=3{,}628{,}800$, and $6$ weeks $=6\\cdot7\\cdot24\\cdot60\\cdot60=3{,}628{,}800$ seconds.'],
  ['4️⃣', 'An honest number', 'Four is the only number whose English name has as many letters as its value.', null],
  ['🫧', 'Why bubbles are round', 'Of all shapes holding the same volume, the sphere has the smallest surface area. Surface tension pulls bubbles into that shape.', null],
  ['📐', 'A president’s proof', 'The Pythagorean theorem has hundreds of different proofs — including one by James Garfield, published five years before he became US President.', null],
  ['⏳', 'Million vs billion', 'A million seconds is about $11.6$ days. A billion seconds is about $31.7$ years.', null],
  ['🔷', 'V − E + F = 2', 'For any convex polyhedron, vertices $-$ edges $+$ faces $=2$. A cube has $8-12+6=2$.', 'This is Euler’s polyhedron formula. It’s one of the first results in topology, the study of shape.'],
  ['🎲', 'Exactly five perfect solids', 'There are only five Platonic solids: tetrahedron, cube, octahedron, dodecahedron and icosahedron. Many dice come in these shapes.', 'At each corner the face angles must add to less than $360^\\circ$, which leaves only five ways to fit regular faces together.'],
  ['💯', 'Perfect numbers', '$6=1+2+3$ and $28=1+2+4+7+14$ equal the sum of their smaller divisors. Only $52$ such perfect numbers are known (as of 2024), and all of them are even.', null],
  ['🐚', 'The golden ratio', '$\\varphi=\\frac{1+\\sqrt5}{2}\\approx1.618$. Divide consecutive Fibonacci numbers — $\\frac{55}{34}$, $\\frac{89}{55}$ — and you get closer and closer to it.', null],
  ['√', '√2 is irrational', '$\\sqrt2$ can’t be written as a fraction. Legend says the Pythagoreans were so upset by this discovery that they tried to keep it secret.', 'If $\\sqrt2=\\frac pq$ in lowest terms, then $p^2=2q^2$, so $p$ is even; then $q$ is even too — but the fraction was in lowest terms.'],
  ['❌', 'Tic-tac-toe has 255,168 games', 'Counting every possible sequence of moves, there are $255{,}168$ different games of tic-tac-toe. With perfect play, it’s always a draw.', null],
  ['♟️', 'More chess games than atoms', 'Claude Shannon estimated about $10^{120}$ possible chess games — far more than the roughly $10^{80}$ atoms in the observable universe.', null],
  ['!', 'Why 0! = 1', '$0!$ (zero factorial) equals $1$.', 'There is exactly one way to arrange zero objects: do nothing. It also keeps formulas like $\\binom{n}{0}=\\frac{n!}{0!\\,n!}=1$ working.'],
];

// ------------------------------------------------------------------ brain teasers
// [question, [choices], correct index, explanation]
const TEASERS = [
  ['A bat and a ball cost $1.10$ dollars together. The bat costs $1.00$ dollar more than the ball. How much does the ball cost?', ['10 cents', '5 cents', '1 cent', '15 cents'], 1, 'If the ball is $x$, the bat is $x+1$, so $2x+1=1.10$ and $x=0.05$. (10 cents is the famous trap: then the bat would cost $1.10$ and the total $1.20$.)'],
  ['If $5$ machines make $5$ widgets in $5$ minutes, how long do $100$ machines take to make $100$ widgets?', ['100 minutes', '20 minutes', '5 minutes', '1 minute'], 2, 'Each machine makes one widget in $5$ minutes. $100$ machines working at once make $100$ widgets in the same $5$ minutes.'],
  ['A patch of lily pads doubles in size every day. It covers the whole lake on day $48$. On which day did it cover half the lake?', ['Day 24', 'Day 47', 'Day 36', 'Day 46'], 1, 'It doubles each day, so the day before it was full, it was half: day $47$.'],
  ['On a game show, a car is behind one of $3$ doors. You pick door 1. The host, who knows where the car is, opens door 3 to show a goat. Should you switch to door 2?', ['No — it’s 50/50 now', 'Yes — switching wins 2/3 of the time', 'It doesn’t matter at all', 'No — staying wins 2/3 of the time'], 1, 'Your first pick is right only $\\frac13$ of the time. The other $\\frac23$, the car is behind one of the other doors — and the host has just shown you which one. This is the Monty Hall problem.'],
  ['How many people do you need in a room for a better-than-even chance that two share a birthday?', ['183', '23', '50', '366'], 1, 'Only $23$! The chance that $23$ people all have different birthdays is about $49\\%$. There are $253$ pairs of people, and any pair could match.'],
  ['$10$ people each shake hands with everyone else exactly once. How many handshakes happen?', ['100', '90', '45', '50'], 2, 'Each person shakes $9$ hands: $10\\times9=90$, but that counts every handshake twice. So $\\frac{90}{2}=45$.'],
  ['How many squares of any size are on a chessboard?', ['64', '204', '196', '256'], 1, 'There are $8^2$ squares of size 1, $7^2$ of size 2, …, $1^2$ of size 8: $64+49+36+25+16+9+4+1=204$.'],
  ['A clock shows $3{:}15$. What is the angle between the hour and minute hands?', ['0°', '7.5°', '15°', '22.5°'], 1, 'The minute hand points at the 3. The hour hand has moved a quarter of the way from 3 to 4: a quarter of $30^\\circ$ is $7.5^\\circ$.'],
  ['A snail at the bottom of a $10$ m well climbs $3$ m each day and slides down $2$ m each night. On which day does it reach the top?', ['Day 10', 'Day 8', 'Day 7', 'Day 9'], 1, 'After $7$ days and nights it is at $7$ m. On day $8$ it climbs $3$ m to $10$ m and is out before it can slide back.'],
  ['You drive to a town at $60$ km/h and come back the same way at $40$ km/h. What was your average speed?', ['50 km/h', '48 km/h', '45 km/h', '52 km/h'], 1, 'Say the town is $120$ km away. Going takes $2$ h, returning takes $3$ h: $240$ km in $5$ h is $48$ km/h, not $50$.'],
  ['What is $1+2+3+\\cdots+100$?', ['5000', '5050', '5100', '10100'], 1, 'Pair the numbers: $1+100$, $2+99$, … — that’s $50$ pairs each adding to $101$, so $5050$. Gauss reportedly found this as a schoolboy.'],
  ['A rope fits snugly around the Earth’s equator. You add just $1$ metre to its length and lift it evenly all the way round. Roughly how high off the ground is it?', ['0.0001 mm', '1.6 mm', '16 cm', '1 m'], 2, 'Circumference $C=2\\pi r$, so adding $1$ m raises the radius by $\\frac{1}{2\\pi}\\approx0.16$ m — about $16$ cm, no matter how big the Earth is!'],
  ['How many times does the digit $7$ appear when you write the numbers from $1$ to $100$?', ['10', '11', '19', '20'], 3, '$7$ appears in the ones place $10$ times ($7,17,\\ldots,97$) and in the tens place $10$ times ($70$–$79$): $20$ in total (77 counts twice).'],
  ['A family has two children, and at least one of them is a boy. What is the probability that both are boys?', ['1/2', '1/3', '1/4', '2/3'], 1, 'The equally likely families are BB, BG, GB, GG. “At least one boy” rules out GG, leaving three — and only one of them is BB.'],
  ['Which is bigger: $2^{100}$ or $100^{10}$?', ['2^100', '100^10', 'They’re equal', 'Can’t tell'], 0, '$100^{10}=10^{20}$, while $2^{100}=(2^{10})^{10}=1024^{10}>1000^{10}=10^{30}$. So $2^{100}$ is far bigger.'],
  ['A $1$ km long train travels at $60$ km/h and goes through a $1$ km tunnel. How long from the front entering to the back leaving?', ['1 minute', '2 minutes', '30 seconds', '3 minutes'], 1, 'The front has to travel $1$ km through the tunnel plus $1$ km more for the back to clear it: $2$ km at $1$ km per minute.'],
  ['Numbering the pages of a book uses $192$ digits in total. How many pages does the book have?', ['96', '100', '192', '64'], 1, 'Pages 1–9 use $9$ digits; pages 10–99 use $90\\times2=180$. That’s $189$, leaving $3$ digits for page $100$.'],
  ['What is the last digit of $2^{2026}$?', ['2', '4', '6', '8'], 1, 'Last digits of powers of $2$ cycle $2,4,8,6$. Since $2026$ leaves remainder $2$ when divided by $4$, the last digit is $4$.'],
  ['How many zeros are at the end of $25!$ (that is, $25\\times24\\times\\cdots\\times1$)?', ['5', '6', '2', '25'], 1, 'Each zero needs a factor $10=2\\times5$. There are plenty of 2s; count the 5s: $5,10,15,20$ give one each and $25$ gives two — $6$ in all.'],
  ['Three cards: one red on both sides, one white on both sides, one red on one side and white on the other. You draw one and see a red side. What’s the chance the other side is red too?', ['1/2', '2/3', '1/3', '3/4'], 1, 'There are three red faces you could be looking at, and two of them belong to the red-red card. So the chance is $\\frac23$.'],
  ['A father is $4$ times as old as his son. In $20$ years he will be twice as old. How old is the son now?', ['5', '10', '15', '20'], 1, 'If the son is $s$: $4s+20=2(s+20)$, so $2s=20$ and $s=10$.'],
  ['You flip a fair coin $3$ times. What is the probability of getting at least one head?', ['1/2', '3/4', '7/8', '2/3'], 2, 'The only way to get no heads is TTT, which has probability $\\frac18$. So at least one head is $1-\\frac18=\\frac78$.'],
  ['How many diagonals does a hexagon have?', ['6', '9', '12', '15'], 1, 'Each of the $6$ corners connects to $3$ non-neighbouring corners: $6\\times3=18$, counted twice, so $9$.'],
  ['$3$ cats catch $3$ mice in $3$ minutes. How many cats are needed to catch $100$ mice in $100$ minutes?', ['100', '3', '33', '10'], 1, 'Each cat catches one mouse every $3$ minutes, so in $100$ minutes $3$ cats catch about $100$ mice.'],
  ['You’re running a race and you overtake the person in second place. What place are you in now?', ['First', 'Second', 'Third', 'It depends'], 1, 'You took their place — second. The person in first is still ahead of you.'],
  ['What is $0.1\\times0.1$?', ['0.1', '0.01', '0.2', '1'], 1, '$\\frac1{10}\\times\\frac1{10}=\\frac1{100}=0.01$. Multiplying by a number less than 1 makes things smaller.'],
  ['A square has the same number for its area and its perimeter. How long is each side?', ['2', '4', '8', '16'], 1, 'Area $s^2$ equals perimeter $4s$ when $s=4$: area $16$, perimeter $16$.'],
  ['Which number comes next: $1, 1, 2, 3, 5, 8, 13, \\ldots$?', ['18', '20', '21', '26'], 2, 'Each number is the sum of the two before it (the Fibonacci sequence): $8+13=21$.'],
  ['What is $15\\%$ of $40$ plus $40\\%$ of $15$?', ['6', '12', '9', '15'], 1, '$x\\%$ of $y$ equals $y\\%$ of $x$! Each part is $6$, so the total is $12$.'],
  ['A cube is painted red and cut into $27$ equal small cubes. How many small cubes have no red paint at all?', ['0', '1', '6', '8'], 1, 'Only the very centre cube is hidden from every face.'],
];

// ------------------------------------------------------------------ visual proofs (SVG, built step by step)
const C = { a: '#f5b942', b: '#60a5fa', c: '#f472b6', d: '#4ade80', e: '#c084fc', line: 'rgba(255,255,255,.55)' };
const svg = (inner, vb = '0 0 240 240') => `<svg viewBox="${vb}" class="vp-svg" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
const rect = (x, y, w, h, fill, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="#0d0e12" stroke-width="2" ${extra}/>`;
const text = (x, y, t, fill = '#fff', size = 14) => `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-family="system-ui,sans-serif" font-weight="700" text-anchor="middle" dominant-baseline="middle">${t}</text>`;
const poly = (pts, fill, op = 1) => `<polygon points="${pts}" fill="${fill}" fill-opacity="${op}" stroke="#0d0e12" stroke-width="2"/>`;

function oddSquares() {
  const cols = [C.a, C.b, C.c, C.d, C.e]; const s = 40; const steps = [];
  for (let n = 1; n <= 5; n++) {
    let inner = '';
    for (let k = 1; k <= n; k++) for (let i = 0; i < k; i++) { inner += rect(20 + i * s, 20 + (k - 1) * s, s, s, cols[k - 1]); if (i < k - 1) inner += rect(20 + (k - 1) * s, 20 + i * s, s, s, cols[k - 1]); }
    const sum = Array.from({ length: n }, (_, i) => 2 * i + 1).join(' + ');
    steps.push({ svg: svg(inner), cap: `$${sum} = ${n * n} = ${n}^2$`, note: n === 1 ? 'Start with one square.' : `Add the next odd number, ${2 * n - 1}, as an L-shaped layer…` });
  }
  steps.push({ svg: steps[4].svg, cap: '$1+3+5+\\cdots+(2n-1)=n^2$', note: 'Every layer turns a square into the next bigger square — so the sum of the first $n$ odd numbers is always $n^2$.' });
  return { title: 'Odd numbers make squares', steps };
}
function triangular() {
  const s = 34; const n = 5; const steps = [];
  const stair = (col, flip) => { let o = ''; for (let r = 0; r < n; r++) for (let c = 0; c <= r; c++) { const x = flip ? 20 + (n - c) * s : 20 + c * s; const y = flip ? 20 + (n - 1 - r) * s : 20 + r * s; o += rect(x, y, s, s, col); } return o; };
  steps.push({ svg: svg(stair(C.a, false), '0 0 240 220'), cap: '$1+2+3+4+5$', note: 'Stack 1, 2, 3, 4 and 5 blocks into a staircase.' });
  steps.push({ svg: svg(stair(C.a, false) + stair(C.b, true), '0 0 240 220'), cap: '$2(1+2+3+4+5) = 5\\times6$', note: 'A second, upside-down copy fits on top to make a $5\\times6$ rectangle.' });
  steps.push({ svg: svg(stair(C.a, false) + stair(C.b, true), '0 0 240 220'), cap: '$1+2+\\cdots+n=\\dfrac{n(n+1)}{2}$', note: 'So one staircase is half the rectangle: $\\frac{5\\times6}{2}=15$. The same works for any $n$.' });
  return { title: 'Adding 1 to n in one picture', steps };
}
function geometric() {
  const steps = []; let inner = ''; let x = 20; let y = 20; let w = 200; let h = 200; const cols = [C.a, C.b, C.c, C.d, C.e, C.a, C.b];
  const terms = [];
  for (let k = 0; k < 7; k++) {
    if (k % 2 === 0) { inner += rect(x, y, w / 2, h, cols[k]); if (k < 3) inner += text(x + w / 4, y + h / 2, `1/${2 ** (k + 1)}`, '#111', 14); x += w / 2; w /= 2; }
    else { inner += rect(x, y, w, h / 2, cols[k]); if (k < 3) inner += text(x + w / 2, y + h / 4, `1/${2 ** (k + 1)}`, '#111', 13); y += h / 2; h /= 2; }
    terms.push(`\\tfrac1{${2 ** (k + 1)}}`);
    if (k < 4) steps.push({ svg: svg(`${rect(20, 20, 200, 200, 'transparent', 'stroke="rgba(255,255,255,.4)"')}${inner}`), cap: `$${terms.join('+')}$`, note: k === 0 ? 'Shade half of a $1\\times1$ square.' : 'Then half of what’s left…' });
  }
  steps.push({ svg: svg(`${rect(20, 20, 200, 200, 'transparent', 'stroke="rgba(255,255,255,.4)"')}${inner}`), cap: '$\\tfrac12+\\tfrac14+\\tfrac18+\\cdots=1$', note: 'Keep going forever and the pieces fill the whole square, so the infinite sum is exactly $1$.' });
  return { title: 'Infinitely many halves make one', steps };
}
function pythagoras() {
  const S = 200; const a = 70; const b = S - a; const o = 20;
  const outer = rect(o, o, S, S, '#1b1e26', 'stroke="rgba(255,255,255,.5)"');
  const tri1 = [poly(`${o},${o} ${o + a},${o} ${o},${o + b}`, C.b), poly(`${o + a},${o} ${o + S},${o} ${o + S},${o + a}`, C.b), poly(`${o + S},${o + a} ${o + S},${o + S} ${o + b},${o + S}`, C.b), poly(`${o + b},${o + S} ${o},${o + S} ${o},${o + b}`, C.b)].join('');
  const tilt = poly(`${o + a},${o} ${o + S},${o + a} ${o + b},${o + S} ${o},${o + b}`, C.a) + text(o + S / 2, o + S / 2, 'c²', '#111', 22);
  const tri2 = [poly(`${o},${o + a} ${o + a},${o + a} ${o},${o + S}`, C.b), poly(`${o + a},${o + a} ${o + a},${o + S} ${o},${o + S}`, C.b), poly(`${o + a},${o} ${o + S},${o} ${o + S},${o + a}`, C.b), poly(`${o + a},${o} ${o + a},${o + a} ${o + S},${o + a}`, C.b)].join('');
  const sq = rect(o, o, a, a, C.c) + text(o + a / 2, o + a / 2, 'a²', '#111', 18) + rect(o + a, o + a, b, b, C.d) + text(o + a + b / 2, o + a + b / 2, 'b²', '#111', 22);
  return {
    title: 'Why a² + b² = c²',
    steps: [
      { svg: svg(outer + tri1), cap: 'Four copies of a right triangle with legs $a,b$ and hypotenuse $c$', note: 'Arrange them inside a big square of side $a+b$.' },
      { svg: svg(outer + tri1 + tilt), cap: 'The gap in the middle is a square of area $c^2$', note: 'Its sides are the four hypotenuses.' },
      { svg: svg(outer + tri2 + sq), cap: 'Slide the same four triangles into the corners…', note: 'Now the gaps are two squares: one of area $a^2$ and one of area $b^2$.' },
      { svg: svg(outer + tri2 + sq), cap: '$a^2+b^2=c^2$', note: 'Same big square, same four triangles — so the leftover areas must be equal.' },
    ],
  };
}
function angleSum() {
  const A = [40, 190]; const B = [210, 190]; const T = [120, 60];
  const tri = poly(`${A} ${B} ${T}`, '#1b1e26');
  const arc = (cx, cy, r, a0, a1, col) => { const p = (a) => `${cx + r * Math.cos(a)},${cy - r * Math.sin(a)}`; return `<path d="M${cx},${cy} L${p(a0)} A${r},${r} 0 0 0 ${p(a1)} Z" fill="${col}" fill-opacity=".85"/>`; };
  const angA = Math.atan2(A[1] - T[1], T[0] - A[0]); const angB = Math.atan2(B[1] - T[1], B[0] - T[0]);
  const base = tri + arc(...A, 28, 0, angA, C.a) + arc(...B, 28, Math.PI - angB, Math.PI, C.b) + arc(...T, 26, Math.PI + angA, 2 * Math.PI - angB, C.c);
  const line = `<line x1="10" y1="60" x2="230" y2="60" stroke="${C.line}" stroke-width="2" stroke-dasharray="6 5"/>`;
  // The alternate angles sit just under the parallel line, on either side of the pink angle.
  const copies = arc(...T, 40, Math.PI, Math.PI + angA, C.a) + arc(...T, 40, 2 * Math.PI - angB, 2 * Math.PI, C.b) + arc(...T, 40, Math.PI + angA, 2 * Math.PI - angB, C.c);
  return {
    title: 'Why a triangle’s angles add to 180°',
    steps: [
      { svg: svg(base), cap: 'Any triangle, with its three angles coloured', note: 'Call them yellow, blue and pink.' },
      { svg: svg(base + line), cap: 'Draw a line through the top corner, parallel to the base', note: 'A straight line is an angle of $180^\\circ$.' },
      { svg: svg(base + line + copies), cap: 'Alternate angles are equal', note: 'Yellow and blue appear again at the top corner, right beside pink.' },
      { svg: svg(base + line + copies), cap: 'yellow + pink + blue $=180^\\circ$', note: 'Together they make the straight line, so the angles of every triangle add to $180^\\circ$.' },
    ],
  };
}
function binomialSquare() {
  const o = 20; const a = 120; const b = 80;
  const big = rect(o, o, a + b, a + b, '#1b1e26', 'stroke="rgba(255,255,255,.5)"');
  const parts = rect(o, o, a, a, C.a) + text(o + a / 2, o + a / 2, 'a²', '#111', 22) + rect(o + a, o, b, a, C.b) + text(o + a + b / 2, o + a / 2, 'ab', '#111', 18) + rect(o, o + a, a, b, C.b) + text(o + a / 2, o + a + b / 2, 'ab', '#111', 18) + rect(o + a, o + a, b, b, C.c) + text(o + a + b / 2, o + a + b / 2, 'b²', '#111', 20);
  const labels = text(o + a / 2, 12, 'a', '#ddd', 13) + text(o + a + b / 2, 12, 'b', '#ddd', 13);
  return {
    title: '(a + b)² as a picture',
    steps: [
      { svg: svg(big + labels), cap: 'A square with side $a+b$ has area $(a+b)^2$', note: 'Split each side into a part $a$ and a part $b$.' },
      { svg: svg(big + parts + labels), cap: 'It splits into four rectangles', note: 'One $a\\times a$ square, one $b\\times b$ square, and two $a\\times b$ rectangles.' },
      { svg: svg(big + parts + labels), cap: '$(a+b)^2=a^2+2ab+b^2$', note: 'That’s why $(a+b)^2$ is not $a^2+b^2$ — the two $ab$ rectangles are easy to forget.' },
    ],
  };
}
const PROOFS = [oddSquares, triangular, geometric, pythagoras, angleSum, binomialSquare];

// ------------------------------------------------------------------ number spotlight
const FAMOUS = {
  0: 'The number that took centuries to accept — and makes place value possible.', 7: 'Voted the world’s favourite number in a large online poll.',
  12: 'Divisible by 1, 2, 3, 4 and 6 — why we have 12 hours, 12 inches and dozens.', 28: 'The second perfect number: $1+2+4+7+14=28$.', 37: 'Multiply it by 3, 6, 9, … 27 and you get 111, 222, 333, … 999.',
  42: 'The “Answer to the Ultimate Question of Life, the Universe, and Everything” in The Hitchhiker’s Guide to the Galaxy.', 73: 'Sheldon Cooper’s “best number”: the 21st prime, and its mirror 37 is the 12th prime.', 89: '$\\frac1{89}=0.011235\\ldots$ — the Fibonacci numbers hiding in a decimal.',
  100: '$100=1^3+2^3+3^3+4^3$ — and also $(1+2+3+4)^2$.', 153: '$1^3+5^3+3^3=153$: it equals the sum of the cubes of its digits.', 220: 'With 284, the smallest “amicable pair”: each one’s divisors add up to the other.',
  255: 'The largest number that fits in one byte: $11111111_2$.', 360: 'Degrees in a circle, chosen because 360 has 24 divisors.', 496: 'The third perfect number.', 561: 'The smallest Carmichael number — a composite that fools Fermat’s primality test.',
  1089: 'Take a 3-digit number with different end digits, reverse it, subtract, then add that to its reverse: you always get 1089.', 1729: 'The Hardy–Ramanujan taxicab number: $1^3+12^3=9^3+10^3$.', 2520: 'The smallest number divisible by every number from 1 to 10.',
  3435: '$3^3+4^4+3^3+5^5=3435$ — a Munchausen number.', 6174: 'Kaprekar’s constant: four-digit numbers fall into it.', 8128: 'The fourth perfect number.', 65537: 'The largest known Fermat prime, $2^{16}+1$.',
};
function props(n) {
  const out = [];
  const divs = []; for (let d = 1; d * d <= n; d++) if (n % d === 0) { divs.push(d); if (d * d !== n) divs.push(n / d); }
  divs.sort((a, b) => a - b);
  const prime = n > 1 && divs.length === 2;
  const fac = []; let m = n; for (let p = 2; p * p <= m; p++) { let e = 0; while (m % p === 0) { m /= p; e++; } if (e) fac.push(e > 1 ? `${p}^{${e}}` : `${p}`); } if (m > 1) fac.push(`${m}`);
  if (n > 1) out.push(prime ? ['Prime', 'Only divisible by 1 and itself'] : ['Composite', `$${n}=${fac.join('\\cdot ')}$`]);
  out.push([n % 2 ? 'Odd' : 'Even', '']);
  const sq = Math.round(Math.sqrt(n)); if (sq * sq === n) out.push(['Perfect square', `$${sq}^2$`]);
  const cb = Math.round(Math.cbrt(n)); if (cb * cb * cb === n && n > 1) out.push(['Perfect cube', `$${cb}^3$`]);
  const t = Math.round((Math.sqrt(8 * n + 1) - 1) / 2); if ((t * (t + 1)) / 2 === n && n > 0) out.push(['Triangular', `$1+2+\\cdots+${t}$`]);
  let a = 0; let b = 1; while (b < n) [a, b] = [b, a + b]; if (b === n || n === 0) out.push(['Fibonacci', 'In $1,1,2,3,5,8,\\ldots$']);
  if (String(n) === [...String(n)].reverse().join('') && n > 9) out.push(['Palindrome', 'Reads the same backwards']);
  const sigma = divs.reduce((s, d) => s + d, 0) - n;
  if (n > 1) out.push(sigma === n ? ['Perfect', 'Equals the sum of its smaller divisors'] : sigma > n ? ['Abundant', `Smaller divisors add to ${sigma}`] : ['Deficient', `Smaller divisors add to ${sigma}`]);
  let h = n; const seen = new Set(); while (h !== 1 && !seen.has(h) && n > 0) { seen.add(h); h = [...String(h)].reduce((s, d) => s + d * d, 0); } if (h === 1 && n > 0) out.push(['Happy', 'Sum of digit squares leads to 1']);
  out.push(['Divisors', `${divs.length}: ${divs.length <= 12 ? divs.join(', ') : `${divs.slice(0, 10).join(', ')}, …`}`]);
  out.push(['Binary', `$${n.toString(2)}_2$`]);
  if (n > 0 && n < 4000) out.push(['Roman', roman(n)]);
  out.push(['Digit sum', String([...String(n)].reduce((s, d) => s + +d, 0))]);
  return out;
}
function roman(n) { const m = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]; let s = ''; for (const [v, r] of m) while (n >= v) { s += r; n -= v; } return s; }

// ------------------------------------------------------------------ cards
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const KINDS = ['fact', 'fact', 'teaser', 'teaser', 'proof', 'number'];
export function sparkCard(kind = pick(KINDS)) {
  if (kind === 'fact') {
    const i = rnd(FACTS.length); const [emo, head, body, why] = FACTS[i];
    return { id: `spark:fact:${i}`, source: 'spark', kind: 'fact', heading: head, html: `<div class="sp-emoji">${emo}</div><p class="sp-lead">${esc(body)}</p>`, base: 'text', dollarMath: true, solutionHtml: why ? `<p>${esc(why)}</p>` : null, solutionLabel: 'Why?', topic: 'Fun fact', widget: 'react' };
  }
  if (kind === 'teaser') {
    const i = rnd(TEASERS.length); const [q, choices, a, why] = TEASERS[i];
    return { id: `spark:teaser:${i}`, source: 'spark', kind: 'teaser', heading: 'Brain teaser', html: `<p class="sp-lead">${esc(q)}</p>`, base: 'text', dollarMath: true, answer: { type: 'choice', value: 'ABCDE'[a], labels: choices }, solutionHtml: `<p>${esc(why)}</p>`, solutionLabel: 'Explain', difficulty: 2, topic: 'Brain teaser', explain: why };
  }
  if (kind === 'proof') {
    const i = rnd(PROOFS.length); const p = PROOFS[i]();
    return { id: `spark:proof:${i}`, source: 'spark', kind: 'proof', heading: p.title, html: '<p class="sp-sub">A proof without words — tap through it.</p>', base: 'text', dollarMath: true, widget: 'proof', proof: p, topic: 'Visual proof' };
  }
  let n;
  const keys = Object.keys(FAMOUS).map(Number);
  n = Math.random() < 0.55 ? pick(keys) : 2 + rnd(9998);
  const story = FAMOUS[n];
  return { id: `spark:number:${n}`, source: 'spark', kind: 'number', heading: `Number spotlight: ${n.toLocaleString('en-US')}`, html: story ? `<p class="sp-lead">${esc(story)}</p>` : '<p class="sp-sub">Every number has a personality. Here’s this one’s.</p>', base: 'text', dollarMath: true, widget: 'number', number: n, props: props(n), topic: 'Number spotlight' };
}
export const SPARK_COUNTS = { facts: FACTS.length, teasers: TEASERS.length, proofs: PROOFS.length };
