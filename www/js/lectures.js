// Hand-written lecture content for every Learn unit (generated from lectures_src.py).
export const LECTURES = {
"prealgebra": [
{
"hook": "Every calculation follows the same few rules. Learn them once and use them forever.",
"ideas": [
{
"t": "Order of operations",
"b": "Brackets first, then powers, then $\\times$ and $\\div$ left to right, then $+$ and $-$ left to right. So $3+4\\times2=3+8=11$, not $14$."
},
{
"t": "Adding fractions",
"b": "Rewrite with a common denominator, then add the tops: $\\frac23+\\frac14=\\frac{8}{12}+\\frac{3}{12}=\\frac{11}{12}$."
},
{
"t": "Percent means per hundred",
"b": "$x\\%$ of $y$ is $\\frac{x}{100}\\cdot y$. So $15\\%$ of $80$ is $0.15\\times80=12$."
}
],
"example": {
"q": "Compute $2+3\\times(8-5)^2$.",
"steps": [
"Brackets first: $8-5=3$.",
"Powers next: $3^2=9$.",
"Multiply: $3\\times9=27$.",
"Add last: $2+27=29$."
],
"ans": "$29$"
},
"check": {
"q": "What is $\\frac12+\\frac13$?",
"choices": [
"$\\frac56$",
"$\\frac25$",
"$\\frac16$",
"$\\frac23$"
],
"a": 0,
"why": "Common denominator $6$: $\\frac36+\\frac26=\\frac56$. Adding tops and bottoms separately ($\\frac25$) is the classic mistake."
}
},
{
"hook": "Ratios, averages and equations turn word problems into a few lines of arithmetic.",
"ideas": [
{
"t": "Ratios as parts",
"b": "If boys : girls $=2:3$, write boys $=2k$ and girls $=3k$. A class of $30$ gives $5k=30$, so $k=6$: $12$ boys and $18$ girls."
},
{
"t": "Averages",
"b": "Average $=\\frac{\\text{sum}}{\\text{count}}$, so sum $=$ average $\\times$ count. Four tests averaging $85$ total $340$."
},
{
"t": "Undo to solve",
"b": "Do the same thing to both sides to undo what happened to $x$: $x+7=19$ gives $x=12$; $5x=35$ gives $x=7$."
}
],
"example": {
"q": "The average of five numbers is $12$. Four of them are $10, 11, 14$ and $9$. What is the fifth?",
"steps": [
"The five numbers total $5\\times12=60$.",
"The four known numbers add to $10+11+14+9=44$.",
"So the fifth is $60-44=16$."
],
"ans": "$16$"
},
"check": {
"q": "Red and blue marbles are in the ratio $3:5$. There are $40$ marbles. How many are red?",
"choices": [
"$15$",
"$24$",
"$8$",
"$25$"
],
"a": 0,
"why": "$3k+5k=8k=40$, so $k=5$ and there are $3k=15$ red marbles."
}
},
{
"hook": "Primes are the atoms of arithmetic, and a few area formulas cover almost every shape.",
"ideas": [
{
"t": "Prime factorisation",
"b": "Break a number into primes: $360=2^3\\cdot3^2\\cdot5$. The factorisation is unique, and it unlocks GCDs, LCMs and divisor counts."
},
{
"t": "Area toolkit",
"b": "Rectangle $lw$, triangle $\\frac12bh$, circle $\\pi r^2$. Split awkward shapes into these pieces."
},
{
"t": "Percent change",
"b": "Change $=\\frac{\\text{new}-\\text{old}}{\\text{old}}\\times100\\%$. Going from $50$ to $65$ is a $\\frac{15}{50}=30\\%$ increase."
}
],
"example": {
"q": "A shirt costs $40$ dollars. The price goes up $25\\%$, then the new price is cut by $20\\%$. What is the final price?",
"steps": [
"Up $25\\%$: $40\\times1.25=50$.",
"Down $20\\%$: $50\\times0.8=40$.",
"It's back to $40$ dollars, because $1.25\\times0.8=1$."
],
"ans": "$40$ dollars"
},
"check": {
"q": "What is the greatest common factor of $84$ and $120$?",
"choices": [
"$12$",
"$6$",
"$24$",
"$4$"
],
"a": 0,
"why": "$84=2^2\\cdot3\\cdot7$ and $120=2^3\\cdot3\\cdot5$. Take the smaller power of each shared prime: $2^2\\cdot3=12$."
}
},
{
"hook": "Contest problems love rates, counting and right triangles. Here is how to handle each one.",
"ideas": [
{
"t": "Rates add up",
"b": "Distance $=$ rate $\\times$ time. Working together, rates add: if A paints a wall in $3$ h and B in $6$ h, together they paint $\\frac13+\\frac16=\\frac12$ a wall per hour, so it takes $2$ hours."
},
{
"t": "Multiply choices",
"b": "With $m$ ways to do one thing and $n$ ways to do another, there are $mn$ ways to do both: $3$ shirts and $4$ trousers make $12$ outfits."
},
{
"t": "Pythagoras",
"b": "In a right triangle $a^2+b^2=c^2$. Learn the triples $3$-$4$-$5$, $5$-$12$-$13$ and $8$-$15$-$17$."
}
],
"example": {
"q": "A $13$ ft ladder leans against a wall with its foot $5$ ft from the wall. How high does it reach?",
"steps": [
"The ladder is the hypotenuse: $5^2+h^2=13^2$.",
"$25+h^2=169$, so $h^2=144$.",
"$h=12$ ft, a $5$-$12$-$13$ triangle."
],
"ans": "$12$ ft"
},
"check": {
"q": "A car travels $150$ miles in $2.5$ hours. What is its average speed?",
"choices": [
"$60$ mph",
"$50$ mph",
"$75$ mph",
"$65$ mph"
],
"a": 0,
"why": "Speed $=$ distance $\\div$ time $=150\\div2.5=60$ mph."
}
},
{
"hook": "Harder problems are just several easy steps in a row. The skill is organising them.",
"ideas": [
{
"t": "Name the unknown",
"b": "Let $x$ be what you want, turn each sentence into an equation, then solve."
},
{
"t": "Simplify first",
"b": "Cancel before you multiply: $\\frac{48\\times35}{14\\times12}=\\frac{48}{12}\\cdot\\frac{35}{14}=4\\cdot\\frac52=10$."
},
{
"t": "Estimate to check",
"b": "Estimate the answer before working it out. If the exact answer is far from your estimate, look for a mistake."
}
],
"example": {
"q": "Ana is $3$ times as old as Ben. In $10$ years she will be twice as old as him. How old is Ben now?",
"steps": [
"Let Ben be $b$, so Ana is $3b$.",
"In $10$ years: $3b+10=2(b+10)$.",
"$3b+10=2b+20$, so $b=10$.",
"Check: Ana is $30$ and Ben is $10$; in $10$ years they are $40$ and $20$. ✓"
],
"ans": "$10$"
},
"check": {
"q": "Simplify $\\frac{2^{10}}{2^7}$.",
"choices": [
"$8$",
"$2^{17}$",
"$1$",
"$2^{70}$"
],
"a": 0,
"why": "Dividing powers of the same base subtracts exponents: $2^{10-7}=2^3=8$."
}
}
],
"algebra": [
{
"hook": "Lines are the simplest functions. Master them and the rest of algebra builds on top.",
"ideas": [
{
"t": "Solving linear equations",
"b": "Gather the $x$ terms on one side and the numbers on the other: $5x-3=2x+9$, so $3x=12$ and $x=4$."
},
{
"t": "Slope",
"b": "$m=\\frac{y_2-y_1}{x_2-x_1}$. The line through $(1,2)$ and $(3,8)$ has slope $\\frac62=3$."
},
{
"t": "Slope-intercept form",
"b": "$y=mx+b$: $m$ is the steepness and $b$ is where the line crosses the $y$-axis."
}
],
"example": {
"q": "Find the line through $(2,5)$ with slope $3$.",
"steps": [
"Start with $y=3x+b$.",
"Plug in $(2,5)$: $5=6+b$, so $b=-1$.",
"The line is $y=3x-1$."
],
"ans": "$y=3x-1$"
},
"check": {
"q": "Solve $4(x-2)=2x+6$.",
"choices": [
"$x=7$",
"$x=2$",
"$x=4$",
"$x=-1$"
],
"a": 0,
"why": "$4x-8=2x+6$, so $2x=14$ and $x=7$."
}
},
{
"hook": "Two unknowns need two equations. Exponent rules are the grammar of algebra.",
"ideas": [
{
"t": "Elimination",
"b": "Add or subtract equations to cancel a variable: $x+y=10$ and $x-y=4$ add to $2x=14$, so $x=7$ and $y=3$."
},
{
"t": "Exponent rules",
"b": "$a^ma^n=a^{m+n}$, $(a^m)^n=a^{mn}$, $a^0=1$ and $a^{-n}=\\frac1{a^n}$."
},
{
"t": "Absolute value",
"b": "$|x-3|=5$ splits into $x-3=5$ or $x-3=-5$, so $x=8$ or $x=-2$."
}
],
"example": {
"q": "Two numbers add to $25$ and differ by $7$. Find them.",
"steps": [
"$x+y=25$ and $x-y=7$.",
"Add the equations: $2x=32$, so $x=16$.",
"Then $y=25-16=9$."
],
"ans": "$16$ and $9$"
},
"check": {
"q": "Simplify $(x^3)^2\\cdot x^4$.",
"choices": [
"$x^{10}$",
"$x^9$",
"$x^{24}$",
"$x^{12}$"
],
"a": 0,
"why": "$(x^3)^2=x^6$, and $x^6\\cdot x^4=x^{10}$."
}
},
{
"hook": "Quadratics turn up everywhere. You can solve them three ways, and sometimes you don't need to solve them at all.",
"ideas": [
{
"t": "Factoring",
"b": "Find two numbers that multiply to $c$ and add to $b$: $x^2+5x+6=(x+2)(x+3)$, so the roots are $-2$ and $-3$."
},
{
"t": "The quadratic formula",
"b": "$x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}$ always works. The discriminant $b^2-4ac$ tells you how many real roots there are."
},
{
"t": "Vieta's formulas",
"b": "For $ax^2+bx+c=0$, the roots add to $-\\frac ba$ and multiply to $\\frac ca$, without solving anything."
}
],
"example": {
"q": "The roots of $x^2-7x+k=0$ differ by $1$. Find $k$.",
"steps": [
"By Vieta, $r+s=7$ and $rs=k$.",
"With $r-s=1$: $r=4$ and $s=3$.",
"So $k=rs=12$."
],
"ans": "$12$"
},
"check": {
"q": "How many real roots does $x^2+2x+5=0$ have?",
"choices": [
"$0$",
"$1$",
"$2$",
"Infinitely many"
],
"a": 0,
"why": "The discriminant is $4-20=-16<0$, so there are no real roots."
}
},
{
"hook": "Functions are machines and parabolas have hidden centres. Series add up faster than you'd think.",
"ideas": [
{
"t": "Composition",
"b": "$f(g(x))$ means put $g(x)$ into $f$. If $f(x)=2x+1$ and $g(x)=x^2$, then $f(g(3))=f(9)=19$."
},
{
"t": "Completing the square",
"b": "$x^2+6x+2=(x+3)^2-7$, which shows the vertex of the parabola is at $(-3,-7)$."
},
{
"t": "Arithmetic series",
"b": "Sum $=$ (number of terms) $\\times$ (average of the first and last): $1+2+\\dots+100=100\\cdot\\frac{101}{2}=5050$."
}
],
"example": {
"q": "Find the minimum value of $x^2-8x+20$.",
"steps": [
"Complete the square: $x^2-8x+16+4=(x-4)^2+4$.",
"A square is never negative, so its smallest value is $0$, at $x=4$.",
"The minimum value is $4$."
],
"ans": "$4$"
},
"check": {
"q": "What is $3+7+11+\\dots+43$?",
"choices": [
"$253$",
"$230$",
"$276$",
"$242$"
],
"a": 0,
"why": "The terms go up by $4$, so there are $\\frac{43-3}{4}+1=11$ of them. Sum $=11\\cdot\\frac{3+43}2=253$."
}
},
{
"hook": "Clean algebra comes down to a few habits: rationalise, watch the domain, and look for symmetry.",
"ideas": [
{
"t": "Rationalising",
"b": "Multiply by a clever form of $1$: $\\frac1{\\sqrt3}=\\frac{\\sqrt3}3$, and $\\frac1{\\sqrt2+1}=\\frac{\\sqrt2-1}{(\\sqrt2+1)(\\sqrt2-1)}=\\sqrt2-1$."
},
{
"t": "Domains",
"b": "You can't divide by $0$ or take an even root of a negative number (in the reals). So $\\frac1{\\sqrt{x-2}}$ needs $x>2$."
},
{
"t": "Symmetry",
"b": "If an expression stays the same when you swap the variables, try using $x+y$ and $xy$ as new unknowns."
}
],
"example": {
"q": "If $x+\\frac1x=5$, find $x^2+\\frac1{x^2}$.",
"steps": [
"Square both sides: $x^2+2+\\frac1{x^2}=25$.",
"The middle term is $2\\cdot x\\cdot\\frac1x=2$.",
"So $x^2+\\frac1{x^2}=23$."
],
"ans": "$23$"
},
"check": {
"q": "Simplify $\\frac6{\\sqrt3}$.",
"choices": [
"$2\\sqrt3$",
"$3\\sqrt2$",
"$\\sqrt3$",
"$6\\sqrt3$"
],
"a": 0,
"why": "$\\frac6{\\sqrt3}\\cdot\\frac{\\sqrt3}{\\sqrt3}=\\frac{6\\sqrt3}3=2\\sqrt3$."
}
}
],
"number_theory": [
{
"hook": "Whole numbers hide a lot of structure, and divisibility is the way in.",
"ideas": [
{
"t": "Divisibility tests",
"b": "A number is divisible by $3$ or $9$ if its digit sum is, by $4$ if its last two digits are, and by $11$ if its alternating digit sum is."
},
{
"t": "Unique factorisation",
"b": "Every whole number above $1$ is a product of primes in exactly one way: $84=2^2\\cdot3\\cdot7$."
},
{
"t": "GCD times LCM",
"b": "$\\gcd(a,b)\\cdot\\operatorname{lcm}(a,b)=ab$. Since $\\gcd(12,18)=6$, $\\operatorname{lcm}(12,18)=\\frac{216}6=36$."
}
],
"example": {
"q": "What is the smallest number divisible by every integer from $1$ to $6$?",
"steps": [
"We need $\\operatorname{lcm}(1,2,\\dots,6)$.",
"The highest prime powers up to $6$ are $2^2$ (from $4$), $3$ and $5$.",
"$4\\cdot3\\cdot5=60$."
],
"ans": "$60$"
},
"check": {
"q": "Which of these is divisible by $9$?",
"choices": [
"$4518$",
"$3247$",
"$1001$",
"$2224$"
],
"a": 0,
"why": "$4+5+1+8=18$, which is a multiple of $9$."
}
},
{
"hook": "Remainders behave like a small number system of their own. That makes huge powers easy.",
"ideas": [
{
"t": "Work mod n",
"b": "Remainders add and multiply. Since $17\\equiv2\\pmod5$, we get $17^2\\equiv4\\pmod5$."
},
{
"t": "Counting divisors",
"b": "If $n=p^aq^b$, then $n$ has $(a+1)(b+1)$ divisors. $72=2^3\\cdot3^2$ has $4\\cdot3=12$."
},
{
"t": "Cycles",
"b": "Last digits of powers repeat: powers of $7$ end in $7,9,3,1,7,9,3,1,\\dots$, so $7^{100}$ ends in $1$."
}
],
"example": {
"q": "Find the remainder when $2^{50}$ is divided by $7$.",
"steps": [
"Powers of $2$ mod $7$ go $2,4,1,2,4,1,\\dots$, a cycle of length $3$.",
"$50=3\\cdot16+2$, so $2^{50}\\equiv2^2\\pmod7$.",
"The remainder is $4$."
],
"ans": "$4$"
},
"check": {
"q": "How many positive divisors does $36$ have?",
"choices": [
"$9$",
"$6$",
"$8$",
"$12$"
],
"a": 0,
"why": "$36=2^2\\cdot3^2$, so it has $(2+1)(2+1)=9$ divisors."
}
},
{
"hook": "Same numbers, different notation. Bases and the Euclidean algorithm show numbers from new angles.",
"ideas": [
{
"t": "Bases",
"b": "In base $b$ the digits are weighted by powers of $b$: $213_5=2\\cdot25+1\\cdot5+3=58$."
},
{
"t": "Euclidean algorithm",
"b": "$\\gcd(a,b)=\\gcd(b,\\,a\\bmod b)$. So $\\gcd(252,105)=\\gcd(105,42)=\\gcd(42,21)=21$."
},
{
"t": "Neighbours are coprime",
"b": "$\\gcd(n,n+1)=1$ always, because any common divisor would divide their difference, $1$."
}
],
"example": {
"q": "Write $100$ in base $3$.",
"steps": [
"Powers of $3$: $1, 3, 9, 27, 81$.",
"$100=1\\cdot81+0\\cdot27+2\\cdot9+0\\cdot3+1$.",
"So $100=10201_3$."
],
"ans": "$10201_3$"
},
"check": {
"q": "$\\gcd(91,65)=$",
"choices": [
"$13$",
"$7$",
"$5$",
"$1$"
],
"a": 0,
"why": "$91=65+26$, $65=2\\cdot26+13$, $26=2\\cdot13$, so the GCD is $13$."
}
},
{
"hook": "Fermat's little theorem turns enormous powers into small ones.",
"ideas": [
{
"t": "Fermat's little theorem",
"b": "If $p$ is prime and $p\\nmid a$, then $a^{p-1}\\equiv1\\pmod p$. For example $3^6\\equiv1\\pmod7$."
},
{
"t": "Inverses",
"b": "$a$ has an inverse mod $n$ exactly when $\\gcd(a,n)=1$. The inverse of $3$ mod $7$ is $5$, because $15\\equiv1$."
},
{
"t": "Sum of divisors",
"b": "For $p^a$ the divisors add to $1+p+\\dots+p^a=\\frac{p^{a+1}-1}{p-1}$. Multiply these across the prime powers."
}
],
"example": {
"q": "Find the remainder when $3^{100}$ is divided by $7$.",
"steps": [
"By Fermat, $3^6\\equiv1\\pmod7$.",
"$100=6\\cdot16+4$, so $3^{100}\\equiv3^4=81$.",
"$81=7\\cdot11+4$, so the remainder is $4$."
],
"ans": "$4$"
},
"check": {
"q": "What is the inverse of $4$ modulo $9$?",
"choices": [
"$7$",
"$2$",
"$5$",
"$4$"
],
"a": 0,
"why": "$4\\cdot7=28=27+1\\equiv1\\pmod9$."
}
},
{
"hook": "Contest number theory: combine congruences and rule out impossible equations.",
"ideas": [
{
"t": "Chinese remainder theorem",
"b": "With coprime moduli, $x\\equiv2\\pmod3$ and $x\\equiv3\\pmod5$ have exactly one solution mod $15$: here $x=8$."
},
{
"t": "Linear Diophantine equations",
"b": "$ax+by=c$ has integer solutions exactly when $\\gcd(a,b)\\mid c$. So $6x+9y=7$ has none."
},
{
"t": "Small moduli",
"b": "Squares are $0$ or $1$ mod $4$, and $0$, $1$ or $4$ mod $8$. A quick check like this often rules out an equation."
}
],
"example": {
"q": "Find the smallest positive $x$ with $x\\equiv1\\pmod4$ and $x\\equiv2\\pmod5$.",
"steps": [
"Numbers $\\equiv2\\pmod5$: $2, 7, 12, 17, \\dots$",
"Their remainders mod $4$: $2, 3, 0, 1$. The last one works.",
"$x=17$."
],
"ans": "$17$"
},
"check": {
"q": "Can $x^2+y^2=4003$ have integer solutions?",
"choices": [
"No",
"Yes",
"Only if $x=y$",
"Only for negative $x$"
],
"a": 0,
"why": "$4003\\equiv3\\pmod4$, but a sum of two squares is $0$, $1$ or $2$ mod $4$."
}
}
],
"counting_and_probability": [
{
"hook": "Counting is careful multiplying, and probability is counting with a fraction at the end.",
"ideas": [
{
"t": "Multiplication principle",
"b": "Independent choices multiply: a 3-letter code from $26$ letters has $26^3=17576$ possibilities."
},
{
"t": "Probability",
"b": "With equally likely outcomes, probability $=\\frac{\\text{favourable}}{\\text{total}}$. Rolling a $5$ or $6$: $\\frac26=\\frac13$."
},
{
"t": "Complements",
"b": "Sometimes it's easier to count what you don't want: $P(\\text{at least one head in 3 flips})=1-\\frac18=\\frac78$."
}
],
"example": {
"q": "Two dice are rolled. What is the probability the sum is $7$?",
"steps": [
"There are $6\\times6=36$ equally likely outcomes.",
"Sum $7$: $(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)$, which is $6$ outcomes.",
"$\\frac6{36}=\\frac16$."
],
"ans": "$\\frac16$"
},
"check": {
"q": "How many 4-digit PINs have no repeated digits?",
"choices": [
"$5040$",
"$10000$",
"$3024$",
"$6561$"
],
"a": 0,
"why": "$10\\cdot9\\cdot8\\cdot7=5040$."
}
},
{
"hook": "Does order matter? That one question decides between permutations and combinations.",
"ideas": [
{
"t": "Permutations",
"b": "$n$ things in a row can be ordered in $n!$ ways. Choosing and ordering $k$ of $n$ gives $\\frac{n!}{(n-k)!}$."
},
{
"t": "Combinations",
"b": "Choosing $k$ of $n$ when order doesn't matter: $\\binom nk=\\frac{n!}{k!(n-k)!}$. So $\\binom52=10$."
},
{
"t": "Repeated letters",
"b": "Divide out the repeats: MISSISSIPPI has $\\frac{11!}{4!\\,4!\\,2!}=34650$ arrangements."
}
],
"example": {
"q": "A committee of $3$ is chosen from $5$ boys and $4$ girls. How many committees have exactly $2$ girls?",
"steps": [
"Choose the girls: $\\binom42=6$.",
"Choose the boy: $\\binom51=5$.",
"Multiply: $6\\cdot5=30$."
],
"ans": "$30$"
},
"check": {
"q": "How many ways can the letters of BOOK be arranged?",
"choices": [
"$12$",
"$24$",
"$6$",
"$4$"
],
"a": 0,
"why": "$\\frac{4!}{2!}=12$, because the two O's are identical."
}
},
{
"hook": "Three tools for cases that look messy: stars and bars, inclusion–exclusion and expected value.",
"ideas": [
{
"t": "Stars and bars",
"b": "Sharing $n$ identical items among $k$ people (some may get none) can be done in $\\binom{n+k-1}{k-1}$ ways."
},
{
"t": "Inclusion–exclusion",
"b": "$|A\\cup B|=|A|+|B|-|A\\cap B|$. The numbers from $1$ to $100$ divisible by $2$ or $3$: $50+33-16=67$."
},
{
"t": "Expected value is linear",
"b": "The expected total of two dice is $3.5+3.5=7$, with no need to list all the outcomes."
}
],
"example": {
"q": "How many ways can $6$ identical sweets be shared among $3$ children?",
"steps": [
"Stars and bars: $6$ stars and $2$ bars.",
"Arrange the $8$ symbols by choosing where the bars go: $\\binom82$.",
"$\\binom82=28$."
],
"ans": "$28$"
},
"check": {
"q": "How many integers from $1$ to $60$ are divisible by $4$ or $6$?",
"choices": [
"$20$",
"$25$",
"$15$",
"$24$"
],
"a": 0,
"why": "$15+10-5=20$. The overlap is multiples of $\\operatorname{lcm}(4,6)=12$, and there are $5$ of them."
}
},
{
"hook": "Pascal's triangle links counting to algebra.",
"ideas": [
{
"t": "Pascal's rule",
"b": "$\\binom nk=\\binom{n-1}{k-1}+\\binom{n-1}{k}$: each entry of Pascal's triangle is the sum of the two above it."
},
{
"t": "Binomial theorem",
"b": "$(x+y)^n=\\sum_k\\binom nk x^ky^{n-k}$. The coefficient of $x^2$ in $(x+1)^5$ is $\\binom52=10$."
},
{
"t": "Geometric probability",
"b": "When outcomes are points in a region, probability $=$ favourable length or area $\\div$ total length or area."
}
],
"example": {
"q": "Find the coefficient of $x^3$ in $(2x+1)^5$.",
"steps": [
"The $x^3$ term is $\\binom53(2x)^3\\cdot1^2$.",
"$\\binom53=10$ and $(2x)^3=8x^3$.",
"The coefficient is $10\\cdot8=80$."
],
"ans": "$80$"
},
"check": {
"q": "What is $\\binom60+\\binom61+\\dots+\\binom66$?",
"choices": [
"$64$",
"$32$",
"$36$",
"$128$"
],
"a": 0,
"why": "Row $n$ of Pascal's triangle sums to $2^n$, so the answer is $2^6=64$."
}
},
{
"hook": "Harder counting comes down to splitting into cases, building up from smaller ones, and spotting symmetry.",
"ideas": [
{
"t": "Casework",
"b": "Split into cases that don't overlap and add them up. Check that every outcome is counted exactly once."
},
{
"t": "Recursion",
"b": "Build answers from smaller ones. The number of ways to climb $n$ stairs taking $1$ or $2$ at a time satisfies $a_n=a_{n-1}+a_{n-2}$."
},
{
"t": "Symmetry",
"b": "Outcomes that are equally likely by symmetry have equal probabilities, which often halves the work."
}
],
"example": {
"q": "How many ways can you climb $6$ stairs taking $1$ or $2$ steps at a time?",
"steps": [
"$a_1=1$, $a_2=2$, and $a_n=a_{n-1}+a_{n-2}$.",
"$a_3=3$, $a_4=5$, $a_5=8$.",
"$a_6=13$."
],
"ans": "$13$"
},
"check": {
"q": "A fair coin is flipped $4$ times. What is the probability of more heads than tails?",
"choices": [
"$\\frac5{16}$",
"$\\frac12$",
"$\\frac38$",
"$\\frac3{16}$"
],
"a": 0,
"why": "Three heads happens $4$ ways and four heads $1$ way: $5$ out of $16$. By symmetry, more tails is also $\\frac5{16}$ and a tie is $\\frac6{16}$."
}
}
],
"geometry": [
{
"hook": "Geometry starts with angles. Learn where they go and diagrams start to make sense.",
"ideas": [
{
"t": "Angle facts",
"b": "The angles of a triangle add to $180^\\circ$, angles on a straight line add to $180^\\circ$, and vertical angles are equal."
},
{
"t": "Parallel lines",
"b": "A line crossing two parallel lines makes equal corresponding angles and equal alternate angles."
},
{
"t": "Triangle area",
"b": "Area $=\\frac12bh$, where the height must be perpendicular to the base you chose."
}
],
"example": {
"q": "Two angles of a triangle are $47^\\circ$ and $68^\\circ$. Find the exterior angle at the third vertex.",
"steps": [
"The third angle is $180^\\circ-47^\\circ-68^\\circ=65^\\circ$.",
"The exterior angle is $180^\\circ-65^\\circ=115^\\circ$.",
"Shortcut: it equals the sum of the other two angles, $47^\\circ+68^\\circ$."
],
"ans": "$115^\\circ$"
},
"check": {
"q": "Each interior angle of a regular hexagon is…",
"choices": [
"$120^\\circ$",
"$108^\\circ$",
"$135^\\circ$",
"$60^\\circ$"
],
"a": 0,
"why": "The interior angles add to $180^\\circ(6-2)=720^\\circ$, and $720^\\circ\\div6=120^\\circ$."
}
},
{
"hook": "Right triangles and similar triangles do most of the work in geometry.",
"ideas": [
{
"t": "Pythagorean triples",
"b": "$3$-$4$-$5$, $5$-$12$-$13$, $8$-$15$-$17$ and $7$-$24$-$25$ (and their multiples) save a lot of time."
},
{
"t": "Special triangles",
"b": "A 30-60-90 triangle has sides in ratio $1:\\sqrt3:2$; a 45-45-90 triangle has $1:1:\\sqrt2$."
},
{
"t": "Similarity",
"b": "Triangles with the same angles have proportional sides, and their areas scale by the square of the ratio."
}
],
"example": {
"q": "An equilateral triangle has side $6$. Find its area.",
"steps": [
"Drop a height. It splits the triangle into two 30-60-90 triangles with short leg $3$.",
"The height is $3\\sqrt3$.",
"Area $=\\frac12\\cdot6\\cdot3\\sqrt3=9\\sqrt3$."
],
"ans": "$9\\sqrt3$"
},
"check": {
"q": "Two similar triangles have sides in ratio $2:3$. The smaller has area $12$. What is the area of the larger?",
"choices": [
"$27$",
"$18$",
"$24$",
"$36$"
],
"a": 0,
"why": "Areas scale by $\\left(\\frac32\\right)^2=\\frac94$, so $12\\cdot\\frac94=27$."
}
},
{
"hook": "Circles bring arcs, sectors and the inscribed angle theorem.",
"ideas": [
{
"t": "Circle formulas",
"b": "$C=2\\pi r$ and $A=\\pi r^2$. A sector with angle $\\theta$ is $\\frac{\\theta}{360^\\circ}$ of the whole circle."
},
{
"t": "Inscribed angles",
"b": "An inscribed angle is half the central angle on the same arc, so an angle in a semicircle is $90^\\circ$."
},
{
"t": "Polygon angles",
"b": "The interior angles of an $n$-gon add to $180^\\circ(n-2)$. The exterior angles always add to $360^\\circ$."
}
],
"example": {
"q": "A sector of a circle of radius $6$ has angle $60^\\circ$. Find its area.",
"steps": [
"The whole circle has area $\\pi\\cdot6^2=36\\pi$.",
"$60^\\circ$ is $\\frac16$ of the circle.",
"The sector's area is $6\\pi$."
],
"ans": "$6\\pi$"
},
"check": {
"q": "An inscribed angle stands on an arc of $100^\\circ$. The angle is…",
"choices": [
"$50^\\circ$",
"$100^\\circ$",
"$200^\\circ$",
"$80^\\circ$"
],
"a": 0,
"why": "An inscribed angle is half its arc."
}
},
{
"hook": "Formulas that look like magic: Heron, power of a point and volumes.",
"ideas": [
{
"t": "Heron's formula",
"b": "With $s=\\frac{a+b+c}2$, area $=\\sqrt{s(s-a)(s-b)(s-c)}$. The $13$-$14$-$15$ triangle has area $84$."
},
{
"t": "Power of a point",
"b": "For chords through $P$, $PA\\cdot PB=PC\\cdot PD$. For a tangent, $PT^2=PA\\cdot PB$."
},
{
"t": "Volumes",
"b": "Prism or cylinder: $Bh$. Pyramid or cone: $\\frac13Bh$. Sphere: $\\frac43\\pi r^3$."
}
],
"example": {
"q": "Find the area of a triangle with sides $5$, $5$ and $6$.",
"steps": [
"$s=\\frac{5+5+6}2=8$.",
"Area $=\\sqrt{8\\cdot3\\cdot3\\cdot2}=\\sqrt{144}$.",
"The area is $12$."
],
"ans": "$12$"
},
"check": {
"q": "A point is $13$ from the centre of a circle of radius $5$. How long is a tangent from the point to the circle?",
"choices": [
"$12$",
"$8$",
"$18$",
"$\\sqrt{194}$"
],
"a": 0,
"why": "The tangent is perpendicular to the radius, so its length is $\\sqrt{13^2-5^2}=12$."
}
},
{
"hook": "When the picture gets hard, put it on coordinates.",
"ideas": [
{
"t": "Coordinates",
"b": "Place the figure on axes to turn geometry into algebra. Distance $=\\sqrt{(\\Delta x)^2+(\\Delta y)^2}$."
},
{
"t": "Draw it well",
"b": "A big, accurate diagram often suggests the answer and catches mistakes."
},
{
"t": "Area ratios",
"b": "Triangles with the same height have areas in the same ratio as their bases."
}
],
"example": {
"q": "Find the distance between $(1,2)$ and $(7,10)$.",
"steps": [
"$\\Delta x=6$ and $\\Delta y=8$.",
"Distance $=\\sqrt{36+64}=\\sqrt{100}$.",
"The distance is $10$."
],
"ans": "$10$"
},
"check": {
"q": "In triangle $ABC$, $D$ is on $BC$ with $BD=2$ and $DC=6$. If $ABC$ has area $40$, what is the area of $ABD$?",
"choices": [
"$10$",
"$20$",
"$8$",
"$13$"
],
"a": 0,
"why": "Both triangles have the same height from $A$, so the ratio is $\\frac{BD}{BC}=\\frac28$, giving $10$."
}
}
],
"intermediate_algebra": [
{
"hook": "Polynomials keep their secrets in their coefficients.",
"ideas": [
{
"t": "Remainder theorem",
"b": "The remainder when $p(x)$ is divided by $x-a$ is $p(a)$."
},
{
"t": "Vieta for cubics",
"b": "For $x^3+bx^2+cx+d$: $r_1+r_2+r_3=-b$, $r_1r_2+r_2r_3+r_3r_1=c$ and $r_1r_2r_3=-d$."
},
{
"t": "Paired roots",
"b": "Real polynomials have non-real roots in conjugate pairs $a\\pm bi$."
}
],
"example": {
"q": "Find the remainder when $x^{100}+2x+1$ is divided by $x+1$.",
"steps": [
"By the remainder theorem, plug in $x=-1$.",
"$(-1)^{100}+2(-1)+1=1-2+1$.",
"The remainder is $0$."
],
"ans": "$0$"
},
"check": {
"q": "The roots of $x^3-6x^2+11x-6$ add to…",
"choices": [
"$6$",
"$-6$",
"$11$",
"$1$"
],
"a": 0,
"why": "The sum is $-b=6$ (the roots are $1$, $2$ and $3$)."
}
},
{
"hook": "Inequalities and logarithms are tools for finding the best possible value.",
"ideas": [
{
"t": "AM–GM",
"b": "For non-negative numbers, $\\frac{a+b}2\\ge\\sqrt{ab}$, with equality exactly when $a=b$."
},
{
"t": "Log rules",
"b": "$\\log(ab)=\\log a+\\log b$, $\\log a^k=k\\log a$ and $\\log_ba=\\frac{\\ln a}{\\ln b}$."
},
{
"t": "Geometric series",
"b": "$a+ar+ar^2+\\dots=\\frac{a}{1-r}$ when $|r|<1$."
}
],
"example": {
"q": "Find the minimum of $x+\\frac4x$ for $x>0$.",
"steps": [
"AM–GM: $x+\\frac4x\\ge2\\sqrt{x\\cdot\\frac4x}=4$.",
"Equality needs $x=\\frac4x$, so $x=2$.",
"The minimum is $4$."
],
"ans": "$4$"
},
"check": {
"q": "$\\log_2 48-\\log_2 3=$",
"choices": [
"$4$",
"$16$",
"$45$",
"$\\log_2 45$"
],
"a": 0,
"why": "$\\log_2\\frac{48}3=\\log_2 16=4$."
}
},
{
"hook": "Complex numbers, conic sections and sums where almost everything cancels.",
"ideas": [
{
"t": "Complex numbers",
"b": "$i^2=-1$ and $|a+bi|=\\sqrt{a^2+b^2}$. Powers of $i$ cycle through $i,-1,-i,1$."
},
{
"t": "Conics",
"b": "Ellipse $\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1$, hyperbola $\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=1$, parabola $y=ax^2+bx+c$."
},
{
"t": "Telescoping",
"b": "$\\frac1{n(n+1)}=\\frac1n-\\frac1{n+1}$, so most terms of such a sum cancel."
}
],
"example": {
"q": "Compute $\\frac1{1\\cdot2}+\\frac1{2\\cdot3}+\\dots+\\frac1{99\\cdot100}$.",
"steps": [
"Each term is $\\frac1n-\\frac1{n+1}$.",
"The sum is $\\left(1-\\frac12\\right)+\\left(\\frac12-\\frac13\\right)+\\dots+\\left(\\frac1{99}-\\frac1{100}\\right)$.",
"Everything cancels except $1-\\frac1{100}=\\frac{99}{100}$."
],
"ans": "$\\frac{99}{100}$"
},
"check": {
"q": "$i^{2026}=$",
"choices": [
"$-1$",
"$1$",
"$i$",
"$-i$"
],
"a": 0,
"why": "$2026=4\\cdot506+2$, so $i^{2026}=i^2=-1$."
}
},
{
"hook": "Functional equations and the inequalities that come up in proofs.",
"ideas": [
{
"t": "Special values",
"b": "In a functional equation, plug in special values like $0$, $1$ and $x=y$, then guess the function and check it."
},
{
"t": "Cauchy–Schwarz",
"b": "$(a_1^2+\\dots+a_n^2)(b_1^2+\\dots+b_n^2)\\ge(a_1b_1+\\dots+a_nb_n)^2$."
},
{
"t": "Floor",
"b": "Write $x=\\lfloor x\\rfloor+\\{x\\}$ with $0\\le\\{x\\}<1$, then handle each part separately."
}
],
"example": {
"q": "If $f(x)+2f(1-x)=3x$ for all $x$, find $f(0)$.",
"steps": [
"$x=0$: $f(0)+2f(1)=0$.",
"$x=1$: $f(1)+2f(0)=3$.",
"From the first, $f(0)=-2f(1)$; substituting gives $-3f(1)=3$, so $f(1)=-1$ and $f(0)=2$."
],
"ans": "$2$"
},
"check": {
"q": "If $x+y=10$, what is the largest possible value of $xy$?",
"choices": [
"$25$",
"$50$",
"$100$",
"$20$"
],
"a": 0,
"why": "$xy\\le\\left(\\frac{x+y}2\\right)^2=25$, with equality at $x=y=5$."
}
},
{
"hook": "Advanced manipulation: symmetric sums, substitutions and equality cases.",
"ideas": [
{
"t": "Symmetric sums",
"b": "Write symmetric expressions using $x+y$ and $xy$: $x^2+y^2=(x+y)^2-2xy$."
},
{
"t": "Substitution",
"b": "Replace a repeated chunk with one letter to lower the degree: in $x^4-5x^2+4$, let $u=x^2$."
},
{
"t": "Equality first",
"b": "In an inequality, find when equality holds first. It tells you which tool will work."
}
],
"example": {
"q": "Solve $x^4-5x^2+4=0$.",
"steps": [
"Let $u=x^2$: $u^2-5u+4=0$.",
"$(u-1)(u-4)=0$, so $u=1$ or $u=4$.",
"So $x=\\pm1$ or $x=\\pm2$."
],
"ans": "$\\pm1,\\ \\pm2$"
},
"check": {
"q": "If $x+y=5$ and $xy=3$, find $x^2+y^2$.",
"choices": [
"$19$",
"$25$",
"$22$",
"$16$"
],
"a": 0,
"why": "$x^2+y^2=(x+y)^2-2xy=25-6=19$."
}
}
],
"precalculus": [
{
"hook": "Trigonometry starts with one picture: the unit circle.",
"ideas": [
{
"t": "The unit circle",
"b": "The point at angle $\\theta$ is $(\\cos\\theta,\\sin\\theta)$, so $\\sin^2\\theta+\\cos^2\\theta=1$."
},
{
"t": "Special angles",
"b": "$\\sin30^\\circ=\\frac12$, $\\sin45^\\circ=\\frac{\\sqrt2}2$, $\\sin60^\\circ=\\frac{\\sqrt3}2$. Cosine goes the other way."
},
{
"t": "Radians",
"b": "$\\pi$ radians $=180^\\circ$, so $\\frac\\pi6=30^\\circ$ and $\\frac\\pi4=45^\\circ$."
}
],
"example": {
"q": "If $\\sin\\theta=\\frac35$ and $\\theta$ is acute, find $\\cos\\theta$.",
"steps": [
"$\\cos^2\\theta=1-\\sin^2\\theta=1-\\frac9{25}$.",
"So $\\cos^2\\theta=\\frac{16}{25}$.",
"$\\theta$ is acute, so $\\cos\\theta$ is positive: $\\frac45$."
],
"ans": "$\\frac45$"
},
"check": {
"q": "$\\cos\\frac\\pi3=$",
"choices": [
"$\\frac12$",
"$\\frac{\\sqrt3}2$",
"$\\frac{\\sqrt2}2$",
"$1$"
],
"a": 0,
"why": "$\\frac\\pi3=60^\\circ$ and $\\cos60^\\circ=\\frac12$."
}
},
{
"hook": "A handful of identities let you work out almost any angle.",
"ideas": [
{
"t": "Addition formulas",
"b": "$\\sin(a\\pm b)=\\sin a\\cos b\\pm\\cos a\\sin b$ and $\\cos(a\\pm b)=\\cos a\\cos b\\mp\\sin a\\sin b$."
},
{
"t": "Double angle",
"b": "$\\sin2\\theta=2\\sin\\theta\\cos\\theta$ and $\\cos2\\theta=\\cos^2\\theta-\\sin^2\\theta$."
},
{
"t": "Law of cosines",
"b": "$c^2=a^2+b^2-2ab\\cos C$: Pythagoras with a correction term."
}
],
"example": {
"q": "Find $\\sin75^\\circ$.",
"steps": [
"$75^\\circ=45^\\circ+30^\\circ$.",
"$\\sin75^\\circ=\\sin45^\\circ\\cos30^\\circ+\\cos45^\\circ\\sin30^\\circ$.",
"$=\\frac{\\sqrt2}2\\cdot\\frac{\\sqrt3}2+\\frac{\\sqrt2}2\\cdot\\frac12=\\frac{\\sqrt6+\\sqrt2}4$."
],
"ans": "$\\frac{\\sqrt6+\\sqrt2}4$"
},
"check": {
"q": "A triangle has sides $5$ and $8$ with a $60^\\circ$ angle between them. How long is the third side?",
"choices": [
"$7$",
"$\\sqrt{89}$",
"$\\sqrt{129}$",
"$6$"
],
"a": 0,
"why": "$c^2=25+64-2\\cdot5\\cdot8\\cdot\\frac12=49$, so $c=7$."
}
},
{
"hook": "Vectors, matrices and the polar form of complex numbers.",
"ideas": [
{
"t": "Dot product",
"b": "$u\\cdot v=|u||v|\\cos\\theta$, so $u\\perp v$ exactly when $u\\cdot v=0$."
},
{
"t": "Determinants",
"b": "$\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}=ad-bc$ is the factor by which the matrix scales area."
},
{
"t": "Polar form",
"b": "$z=r(\\cos\\theta+i\\sin\\theta)$. Multiplying complex numbers multiplies their lengths and adds their angles."
}
],
"example": {
"q": "Find the angle between $u=(1,1)$ and $v=(1,0)$.",
"steps": [
"$u\\cdot v=1$, $|u|=\\sqrt2$ and $|v|=1$.",
"$\\cos\\theta=\\frac1{\\sqrt2}$.",
"$\\theta=45^\\circ$."
],
"ans": "$45^\\circ$"
},
"check": {
"q": "$\\det\\begin{pmatrix}3&2\\\\1&4\\end{pmatrix}=$",
"choices": [
"$10$",
"$14$",
"$12$",
"$5$"
],
"a": 0,
"why": "$3\\cdot4-2\\cdot1=10$."
}
},
{
"hook": "Powers and roots of complex numbers sit in neat patterns around a circle.",
"ideas": [
{
"t": "De Moivre",
"b": "$(\\cos\\theta+i\\sin\\theta)^n=\\cos n\\theta+i\\sin n\\theta$."
},
{
"t": "Roots of unity",
"b": "The solutions of $z^n=1$ are evenly spaced around the unit circle, and they add to $0$."
},
{
"t": "Cross product",
"b": "$|u\\times v|$ is the area of the parallelogram made by $u$ and $v$."
}
],
"example": {
"q": "Compute $(1+i)^8$.",
"steps": [
"$1+i$ has length $\\sqrt2$ and angle $45^\\circ$.",
"Raising to the 8th power: length $(\\sqrt2)^8=16$, angle $8\\cdot45^\\circ=360^\\circ$.",
"So $(1+i)^8=16$."
],
"ans": "$16$"
},
"check": {
"q": "What is the sum of the fifth roots of unity?",
"choices": [
"$0$",
"$1$",
"$5$",
"$-1$"
],
"a": 0,
"why": "They are spread evenly around the origin. By Vieta on $z^5-1$, their sum is $0$."
}
},
{
"hook": "Curves, coordinate systems and trig symmetries.",
"ideas": [
{
"t": "Parametric curves",
"b": "$(x,y)=(\\cos t,\\sin t)$ traces the unit circle. Eliminate $t$ to find the curve."
},
{
"t": "Polar coordinates",
"b": "$x=r\\cos\\theta$ and $y=r\\sin\\theta$. Switch to polar when the problem has circular symmetry."
},
{
"t": "Symmetries",
"b": "$\\sin(\\pi-x)=\\sin x$ and $\\cos(-x)=\\cos x$, and periodicity makes many trig sums collapse."
}
],
"example": {
"q": "Convert the polar point $(r,\\theta)=\\left(4,\\frac{2\\pi}3\\right)$ to rectangular coordinates.",
"steps": [
"$x=4\\cos\\frac{2\\pi}3=4\\cdot\\left(-\\frac12\\right)=-2$.",
"$y=4\\sin\\frac{2\\pi}3=4\\cdot\\frac{\\sqrt3}2=2\\sqrt3$.",
"The point is $(-2,\\,2\\sqrt3)$."
],
"ans": "$(-2,\\,2\\sqrt3)$"
},
"check": {
"q": "What curve is traced by $x=3\\cos t$, $y=3\\sin t$?",
"choices": [
"A circle of radius $3$",
"An ellipse with unequal axes",
"A line",
"A parabola"
],
"a": 0,
"why": "$x^2+y^2=9(\\cos^2t+\\sin^2t)=9$."
}
}
],
"oly_nt": [
{
"hook": "Olympiad number theory starts with parity, factoring and last digits.",
"ideas": [
{
"t": "Parity",
"b": "Odd $\\pm$ odd is even and odd $\\times$ odd is odd. Many problems that look impossible fall to a parity count."
},
{
"t": "Factor everything",
"b": "Write numbers as products of primes. Conditions about divisibility become conditions about exponents."
},
{
"t": "Last digits",
"b": "Work mod $10$ for the last digit, or mod $100$ for the last two."
}
],
"example": {
"q": "Can seven numbers chosen from $\\{1,3,5,\\dots,19\\}$ add up to $100$?",
"steps": [
"Every number in the set is odd.",
"A sum of seven odd numbers is odd.",
"$100$ is even, so it's impossible."
],
"ans": "No"
},
"check": {
"q": "What is the last digit of $3^{2025}$?",
"choices": [
"$3$",
"$9$",
"$7$",
"$1$"
],
"a": 0,
"why": "Last digits of powers of $3$ cycle $3,9,7,1$, and $2025\\equiv1\\pmod4$, so the last digit is $3$."
}
},
{
"hook": "Congruences and divisor counting, the AMC staples.",
"ideas": [
{
"t": "Congruences",
"b": "$a\\equiv b\\pmod n$ means $n\\mid a-b$. You can add, subtract and multiply congruences."
},
{
"t": "Divisor counts",
"b": "$\\tau(n)=\\prod(e_i+1)$, and $\\tau(n)$ is odd exactly when $n$ is a perfect square."
},
{
"t": "Squares mod small numbers",
"b": "Squares are $0$ or $1$ mod $3$ and mod $4$, and $0$, $1$ or $4$ mod $8$."
}
],
"example": {
"q": "How many of the numbers from $1$ to $100$ have an odd number of divisors?",
"steps": [
"Divisors pair up as $d$ and $\\frac nd$.",
"A pair collapses only when $d=\\frac nd$, which means $n$ is a perfect square.",
"The squares up to $100$ are $1^2,\\dots,10^2$: $10$ numbers."
],
"ans": "$10$"
},
"check": {
"q": "If $n$ is odd, what is $n^2$ mod $8$?",
"choices": [
"$1$",
"$3$",
"$5$",
"$7$"
],
"a": 0,
"why": "$(2k+1)^2=4k(k+1)+1$, and $k(k+1)$ is even, so $n^2\\equiv1\\pmod8$."
}
},
{
"hook": "AIME-level tools: Euler, Wilson and Legendre.",
"ideas": [
{
"t": "Euler's theorem",
"b": "$a^{\\varphi(n)}\\equiv1\\pmod n$ when $\\gcd(a,n)=1$. Since $\\varphi(100)=40$, $3^{40}\\equiv1\\pmod{100}$."
},
{
"t": "Wilson's theorem",
"b": "$(p-1)!\\equiv-1\\pmod p$ for every prime $p$."
},
{
"t": "Legendre's formula",
"b": "The power of $p$ in $n!$ is $\\left\\lfloor\\frac np\\right\\rfloor+\\left\\lfloor\\frac n{p^2}\\right\\rfloor+\\dots$, so $100!$ ends in $20+4=24$ zeros."
}
],
"example": {
"q": "Find the last two digits of $7^{2024}$.",
"steps": [
"$7^4=2401\\equiv1\\pmod{100}$.",
"$2024=4\\cdot506$, so $7^{2024}=(7^4)^{506}\\equiv1$.",
"The last two digits are $01$."
],
"ans": "$01$"
},
"check": {
"q": "How many zeros does $50!$ end with?",
"choices": [
"$12$",
"$10$",
"$11$",
"$5$"
],
"a": 0,
"why": "$\\left\\lfloor\\frac{50}5\\right\\rfloor+\\left\\lfloor\\frac{50}{25}\\right\\rfloor=10+2=12$."
}
},
{
"hook": "Olympiad techniques: orders, lifting the exponent and bounding.",
"ideas": [
{
"t": "Orders",
"b": "The smallest $k>0$ with $a^k\\equiv1\\pmod n$ divides every exponent that gives $1$, including $\\varphi(n)$."
},
{
"t": "Lifting the exponent",
"b": "For an odd prime $p$ with $p\\mid a-b$ and $p\\nmid ab$: $v_p(a^n-b^n)=v_p(a-b)+v_p(n)$."
},
{
"t": "Bounding",
"b": "Show one variable must be small (by size or by a modular argument), then check the few cases left."
}
],
"example": {
"q": "Find all positive integers $n$ for which $3\\mid2^n+1$.",
"steps": [
"$2\\equiv-1\\pmod3$, so $2^n+1\\equiv(-1)^n+1$.",
"That is $0$ when $n$ is odd and $2$ when $n$ is even.",
"Answer: every odd $n$."
],
"ans": "all odd $n$"
},
"check": {
"q": "What is the highest power of $3$ dividing $4^9-1$?",
"choices": [
"$3^3$",
"$3^2$",
"$3^1$",
"$3^9$"
],
"a": 0,
"why": "By LTE, $v_3(4^9-1)=v_3(4-1)+v_3(9)=1+2=3$."
}
},
{
"hook": "IMO-style ideas: descent, sums of squares and Vieta jumping.",
"ideas": [
{
"t": "Infinite descent",
"b": "Assume a smallest solution exists, then build an even smaller one. That's a contradiction, so there are no solutions."
},
{
"t": "Sums of two squares",
"b": "A prime $p$ is a sum of two squares exactly when $p=2$ or $p\\equiv1\\pmod4$."
},
{
"t": "Vieta jumping",
"b": "In a symmetric quadratic Diophantine equation, the other root of the quadratic gives a new, smaller solution. Keep descending."
}
],
"example": {
"q": "Show that $x^2+y^2=3z^2$ has no positive integer solutions.",
"steps": [
"Squares are $0$ or $1$ mod $3$, so $x^2+y^2\\equiv0\\pmod3$ forces $3\\mid x$ and $3\\mid y$.",
"Then $9\\mid3z^2$, so $3\\mid z$.",
"Dividing everything by $3$ gives a smaller solution. By infinite descent, there are none."
],
"ans": "no solutions"
},
"check": {
"q": "Which prime is a sum of two squares?",
"choices": [
"$13$",
"$7$",
"$11$",
"$19$"
],
"a": 0,
"why": "$13=4+9$, and $13\\equiv1\\pmod4$. The others are all $\\equiv3\\pmod4$."
}
}
],
"oly_comb": [
{
"hook": "Olympiad combinatorics is about clever ways of counting.",
"ideas": [
{
"t": "Count the complement",
"b": "Counting the outcomes you don't want, or splitting into cases, cracks most counting problems."
},
{
"t": "Bijections",
"b": "If two sets match up one-to-one, they're the same size, so count whichever is easier."
},
{
"t": "Pigeonhole",
"b": "Put $n+1$ objects into $n$ boxes and some box gets at least two."
}
],
"example": {
"q": "Among any $13$ people, must two share a birth month?",
"steps": [
"The $12$ months are the boxes.",
"The $13$ people are the objects.",
"By pigeonhole, yes."
],
"ans": "Yes"
},
"check": {
"q": "How many subsets does a 5-element set have?",
"choices": [
"$32$",
"$25$",
"$10$",
"$31$"
],
"a": 0,
"why": "Each element is either in or out: $2^5=32$."
}
},
{
"hook": "Recursion and expected value turn hard counts into easy ones.",
"ideas": [
{
"t": "Combine tools",
"b": "Use stars and bars with inclusion–exclusion to handle 'at most' conditions."
},
{
"t": "Recursions",
"b": "Express $a_n$ in terms of smaller cases. Domino tilings of a $2\\times n$ board satisfy $a_n=a_{n-1}+a_{n-2}$."
},
{
"t": "Linearity of expectation",
"b": "$E[X+Y]=E[X]+E[Y]$, even when $X$ and $Y$ depend on each other."
}
],
"example": {
"q": "$10$ people throw their hats in a pile and each takes one at random. What is the expected number who get their own hat?",
"steps": [
"Let $X_i=1$ if person $i$ gets their own hat, and $0$ otherwise.",
"$E[X_i]=\\frac1{10}$.",
"$E[X_1+\\dots+X_{10}]=10\\cdot\\frac1{10}=1$."
],
"ans": "$1$"
},
"check": {
"q": "How many ways are there to tile a $2\\times5$ board with dominoes?",
"choices": [
"$8$",
"$5$",
"$13$",
"$10$"
],
"a": 0,
"why": "$a_1=1$, $a_2=2$, $a_3=3$, $a_4=5$, $a_5=8$."
}
},
{
"hook": "Invariants and colourings can prove that something is impossible.",
"ideas": [
{
"t": "Invariants",
"b": "Find a quantity that never changes under the allowed moves. If the start and target differ in it, the target can't be reached."
},
{
"t": "Colourings",
"b": "Chessboard colourings show that many tilings are impossible."
},
{
"t": "Double counting",
"b": "Count the same set in two different ways and set the results equal."
}
],
"example": {
"q": "Remove two opposite corners from a chessboard. Can $31$ dominoes cover the rest?",
"steps": [
"Each domino covers one black and one white square.",
"Opposite corners are the same colour, so $30$ squares of one colour and $32$ of the other remain.",
"$31$ dominoes need $31$ of each, so it's impossible."
],
"ans": "No"
},
"check": {
"q": "$10$ people each shake hands with everyone else once. How many handshakes are there?",
"choices": [
"$45$",
"$90$",
"$100$",
"$50$"
],
"a": 0,
"why": "Each person shakes $9$ hands, which counts every handshake twice: $\\frac{10\\cdot9}2=45$."
}
},
{
"hook": "Extremal ideas, graphs and generating functions.",
"ideas": [
{
"t": "The extremal principle",
"b": "Look at the largest, smallest or first element. It often has a special property."
},
{
"t": "Handshake lemma",
"b": "The degrees in a graph add to twice the number of edges, so the number of odd-degree vertices is even."
},
{
"t": "Generating functions",
"b": "Encode counts as coefficients of a polynomial. Multiplying polynomials combines choices."
}
],
"example": {
"q": "Can $9$ people each know exactly $3$ of the others (knowing is mutual)?",
"steps": [
"That's a graph with $9$ vertices, each of degree $3$.",
"The degrees add to $27$, which must be twice the number of edges.",
"$27$ is odd, so it's impossible."
],
"ans": "No"
},
"check": {
"q": "What is the coefficient of $x^4$ in $(1+x+x^2)^3$?",
"choices": [
"$6$",
"$3$",
"$7$",
"$10$"
],
"a": 0,
"why": "Choose exponents from $\\{0,1,2\\}$ three times adding to $4$: arrangements of $(2,2,0)$ give $3$ and of $(2,1,1)$ give $3$, so $6$."
}
},
{
"hook": "Games, existence proofs and constructions.",
"ideas": [
{
"t": "Winning and losing positions",
"b": "A position is losing exactly when every move leads to a winning position for the opponent."
},
{
"t": "The probabilistic method",
"b": "If a random object has a property with positive probability, then some object has that property."
},
{
"t": "Bound and construct",
"b": "Prove the answer can't be better than some value, then give an example that reaches it."
}
],
"example": {
"q": "Two players take $1$, $2$ or $3$ stones from a pile of $21$, taking turns. Whoever takes the last stone wins. Who wins?",
"steps": [
"Multiples of $4$ are losing positions: whatever you take, your opponent can bring the pile back to a multiple of $4$.",
"$21$ is not a multiple of $4$.",
"The first player wins by taking $1$, leaving $20$."
],
"ans": "the first player"
},
"check": {
"q": "In the same game starting with $24$ stones, who wins?",
"choices": [
"The second player",
"The first player",
"Nobody",
"It depends on luck"
],
"a": 0,
"why": "$24$ is a multiple of $4$, a losing position for whoever moves first."
}
}
],
"oly_alg": [
{
"hook": "Most olympiad algebra tricks are hidden factorisations.",
"ideas": [
{
"t": "Factor it",
"b": "Look for patterns like $a^2-b^2=(a-b)(a+b)$, and complete the square."
},
{
"t": "Symmetric sums",
"b": "Work with $r+s$ and $rs$ instead of the roots themselves."
},
{
"t": "Recognise sequences",
"b": "Arithmetic (constant gaps), geometric (constant ratio) or recursive."
}
],
"example": {
"q": "Compute $2025^2-2024^2$.",
"steps": [
"Difference of squares: $(2025-2024)(2025+2024)$.",
"$=1\\cdot4049$.",
"$=4049$."
],
"ans": "$4049$"
},
"check": {
"q": "If $a+b=7$ and $ab=10$, then $a^3+b^3=$",
"choices": [
"$133$",
"$343$",
"$70$",
"$210$"
],
"a": 0,
"why": "$a^3+b^3=(a+b)^3-3ab(a+b)=343-210=133$."
}
},
{
"hook": "The mean inequalities and telescoping.",
"ideas": [
{
"t": "Mean inequalities",
"b": "For positive numbers, QM $\\ge$ AM $\\ge$ GM $\\ge$ HM, with equality exactly when all the numbers are equal."
},
{
"t": "Telescoping",
"b": "Write each term as a difference so that neighbouring terms cancel."
},
{
"t": "Floor equations",
"b": "$\\lfloor x\\rfloor\\le x<\\lfloor x\\rfloor+1$ turns floor equations into inequalities."
}
],
"example": {
"q": "Find $\\left(1-\\frac12\\right)\\left(1-\\frac13\\right)\\cdots\\left(1-\\frac1{10}\\right)$.",
"steps": [
"$1-\\frac1k=\\frac{k-1}k$.",
"The product is $\\frac12\\cdot\\frac23\\cdots\\frac9{10}$.",
"It telescopes to $\\frac1{10}$."
],
"ans": "$\\frac1{10}$"
},
"check": {
"q": "For positive $a,b,c$ with $abc=1$, what is the minimum of $a+b+c$?",
"choices": [
"$3$",
"$1$",
"$\\sqrt3$",
"$0$"
],
"a": 0,
"why": "By AM–GM, $a+b+c\\ge3\\sqrt[3]{abc}=3$, with equality at $a=b=c=1$."
}
},
{
"hook": "Polynomials over the integers, Cauchy–Schwarz and roots of unity.",
"ideas": [
{
"t": "Integer root theorem",
"b": "Integer roots of a monic polynomial with integer coefficients divide the constant term."
},
{
"t": "Titu's lemma",
"b": "$\\sum\\frac{a_i^2}{b_i}\\ge\\frac{(\\sum a_i)^2}{\\sum b_i}$ for positive $b_i$, a handy form of Cauchy–Schwarz."
},
{
"t": "Roots of unity filter",
"b": "Averaging $f(1)$, $f(\\omega)$ and $f(\\omega^2)$ picks out the coefficients whose exponents are multiples of $3$."
}
],
"example": {
"q": "Find the integer roots of $x^3-3x^2-4x+12$.",
"steps": [
"Candidates divide $12$. Try $x=2$: $8-12-8+12=0$. ✓",
"Divide: $x^3-3x^2-4x+12=(x-2)(x^2-x-6)$.",
"$x^2-x-6=(x-3)(x+2)$, so the roots are $2$, $3$ and $-2$."
],
"ans": "$2,\\ 3,\\ -2$"
},
"check": {
"q": "For positive $x,y$ with $x+y=1$, what is the minimum of $\\frac1x+\\frac4y$?",
"choices": [
"$9$",
"$5$",
"$8$",
"$4$"
],
"a": 0,
"why": "By Titu, $\\frac{1^2}x+\\frac{2^2}y\\ge\\frac{(1+2)^2}{x+y}=9$, with equality at $x=\\frac13$, $y=\\frac23$."
}
},
{
"hook": "Functional equations and convexity.",
"ideas": [
{
"t": "Substitutions",
"b": "Try $x=0$, $y=x$ and $y=-x$. Then prove injectivity or surjectivity and look for fixed points."
},
{
"t": "Jensen's inequality",
"b": "For convex $f$: $f\\left(\\frac{x_1+\\dots+x_n}n\\right)\\le\\frac{f(x_1)+\\dots+f(x_n)}n$."
},
{
"t": "Symmetric inequalities",
"b": "Schur, Muirhead and sum-of-squares (SOS) arguments handle many of them."
}
],
"example": {
"q": "Find all $f:\\mathbb R\\to\\mathbb R$ with $f(x+y)=f(x)+y$ for all $x,y$.",
"steps": [
"Put $x=0$: $f(y)=f(0)+y$.",
"So $f(x)=x+c$, where $c=f(0)$.",
"Check: $(x+y)+c=(x+c)+y$. ✓ All functions $f(x)=x+c$ work."
],
"ans": "$f(x)=x+c$"
},
"check": {
"q": "For the convex function $f(x)=x^2$, Jensen's inequality says…",
"choices": [
"$\\left(\\frac{a+b}2\\right)^2\\le\\frac{a^2+b^2}2$",
"$\\left(\\frac{a+b}2\\right)^2\\ge\\frac{a^2+b^2}2$",
"$a^2+b^2\\le2ab$",
"$a+b\\le2\\sqrt{ab}$"
],
"a": 0,
"why": "For convex $f$, $f$ of the average is at most the average of $f$. Here that's the QM–AM inequality."
}
},
{
"hook": "Top-level technique: equality cases, smoothing and integer polynomials.",
"ideas": [
{
"t": "Equality cases",
"b": "Find the equality cases first, and make sure every step you use is tight there."
},
{
"t": "Smoothing",
"b": "Moving variables closer together while keeping a constraint often changes the expression in one direction."
},
{
"t": "Integer polynomials",
"b": "For integers $a$ and $b$, $a-b\\mid P(a)-P(b)$."
}
],
"example": {
"q": "Is there an integer polynomial with $P(1)=2$ and $P(3)=5$?",
"steps": [
"We would need $3-1\\mid P(3)-P(1)$.",
"But $P(3)-P(1)=3$, and $2\\nmid3$.",
"So no such polynomial exists."
],
"ans": "No"
},
"check": {
"q": "For $x,y,z\\ge0$ with $x+y+z=3$, what is the maximum of $xy+yz+zx$?",
"choices": [
"$3$",
"$9$",
"$\\frac94$",
"$6$"
],
"a": 0,
"why": "$xy+yz+zx\\le\\frac{(x+y+z)^2}3=3$, with equality at $x=y=z=1$."
}
}
],
"oly_geo": [
{
"hook": "Olympiad geometry starts with angle chasing and similar triangles.",
"ideas": [
{
"t": "Angle chasing",
"b": "Label one angle $x$ and push it around using triangle sums, parallel lines and isosceles triangles."
},
{
"t": "AA similarity",
"b": "Two equal angles are enough for similarity. Look for them whenever lines are parallel."
},
{
"t": "Shared heights",
"b": "Triangles with the same apex and bases on one line have areas proportional to their bases."
}
],
"example": {
"q": "In triangle $ABC$, $AB=AC$ and $\\angle A=40^\\circ$. Find $\\angle B$.",
"steps": [
"The base angles are equal: $\\angle B=\\angle C$.",
"$2\\angle B=180^\\circ-40^\\circ=140^\\circ$.",
"$\\angle B=70^\\circ$."
],
"ans": "$70^\\circ$"
},
"check": {
"q": "A line through the midpoints of two sides of a triangle is parallel to the third side. How long is it compared with the third side?",
"choices": [
"Half as long",
"A third as long",
"The same length",
"Twice as long"
],
"a": 0,
"why": "The midline theorem: the small triangle is similar to the big one with ratio $\\frac12$."
}
},
{
"hook": "Circles bring cyclic quadrilaterals and power of a point.",
"ideas": [
{
"t": "Cyclic quadrilaterals",
"b": "Opposite angles add to $180^\\circ$, and angles standing on the same chord are equal."
},
{
"t": "Power of a point",
"b": "$PA\\cdot PB$ is the same for every line through $P$ that meets the circle at $A$ and $B$."
},
{
"t": "Look for diameters",
"b": "An angle inscribed in a semicircle is $90^\\circ$."
}
],
"example": {
"q": "Chords $AB$ and $CD$ meet at $P$ inside a circle, with $PA=4$, $PB=6$ and $PC=3$. Find $PD$.",
"steps": [
"Power of a point: $PA\\cdot PB=PC\\cdot PD$.",
"$24=3\\cdot PD$.",
"$PD=8$."
],
"ans": "$8$"
},
"check": {
"q": "In cyclic quadrilateral $ABCD$, $\\angle A=95^\\circ$. What is $\\angle C$?",
"choices": [
"$85^\\circ$",
"$95^\\circ$",
"$105^\\circ$",
"$90^\\circ$"
],
"a": 0,
"why": "Opposite angles of a cyclic quadrilateral add to $180^\\circ$."
}
},
{
"hook": "Triangle centres and the law of sines.",
"ideas": [
{
"t": "Triangle centres",
"b": "Incentre: angle bisectors. Circumcentre: perpendicular bisectors. Centroid: medians, split $2:1$. Orthocentre: altitudes."
},
{
"t": "Law of sines",
"b": "$\\frac a{\\sin A}=\\frac b{\\sin B}=\\frac c{\\sin C}=2R$, where $R$ is the circumradius."
},
{
"t": "Angle bisector theorem",
"b": "The bisector from $A$ splits $BC$ in the ratio $AB:AC$."
}
],
"example": {
"q": "Find the circumradius of a triangle with sides $6$, $8$ and $10$.",
"steps": [
"$6^2+8^2=10^2$, so it's a right triangle.",
"The hypotenuse is a diameter of the circumcircle.",
"$R=5$."
],
"ans": "$5$"
},
"check": {
"q": "In triangle $ABC$, $AB=6$, $AC=9$ and $BC=10$. The bisector of angle $A$ meets $BC$ at $D$. Find $BD$.",
"choices": [
"$4$",
"$5$",
"$6$",
"$3$"
],
"a": 0,
"why": "$BD:DC=6:9=2:3$, so $BD=\\frac25\\cdot10=4$."
}
},
{
"hook": "Ceva, Menelaus and when to switch to coordinates.",
"ideas": [
{
"t": "Ceva's theorem",
"b": "Lines $AD$, $BE$ and $CF$ meet at one point exactly when $\\frac{BD}{DC}\\cdot\\frac{CE}{EA}\\cdot\\frac{AF}{FB}=1$."
},
{
"t": "Menelaus",
"b": "For a straight line cutting the three sides (extended), the same product equals $1$ (or $-1$ with signed lengths)."
},
{
"t": "Bash when stuck",
"b": "Coordinates, complex numbers or barycentric coordinates turn geometry into algebra."
}
],
"example": {
"q": "In triangle $ABC$, $D$ is the midpoint of $BC$ and $CE:EA=1:2$. Where must $F$ be on $AB$ so that $AD$, $BE$ and $CF$ meet at one point?",
"steps": [
"Ceva: $\\frac{BD}{DC}\\cdot\\frac{CE}{EA}\\cdot\\frac{AF}{FB}=1$.",
"$1\\cdot\\frac12\\cdot\\frac{AF}{FB}=1$.",
"So $AF:FB=2:1$."
],
"ans": "$AF:FB=2:1$"
},
"check": {
"q": "The medians of a triangle meet at a point that divides each median in the ratio…",
"choices": [
"$2:1$",
"$1:1$",
"$3:1$",
"$3:2$"
],
"a": 0,
"why": "The centroid is two-thirds of the way along each median from the vertex."
}
},
{
"hook": "Transformations: inversion, homothety and radical axes.",
"ideas": [
{
"t": "Inversion",
"b": "Inversion swaps the inside and outside of a circle, and turns circles through the centre into lines."
},
{
"t": "Homothety",
"b": "Scaling about a centre (sometimes with a rotation) maps a figure onto a similar one. Find the centre."
},
{
"t": "Radical axis",
"b": "Points with equal power to two circles lie on a line. The three radical axes of three circles meet at one point."
}
],
"example": {
"q": "Two circles of radii $3$ and $7$ touch externally. A homothety centred at the point of contact maps the small circle onto the big one. What is its ratio?",
"steps": [
"The point of contact lies on the line of centres, between the two circles.",
"So the homothety flips the small circle onto the far side: the ratio is negative.",
"The ratio is $-\\frac73$."
],
"ans": "$-\\frac73$"
},
"check": {
"q": "Under inversion in a circle centred at $O$, a line not through $O$ becomes…",
"choices": [
"a circle through $O$",
"a line",
"a circle not through $O$",
"a point"
],
"a": 0,
"why": "Lines not through the centre invert to circles through the centre, and vice versa."
}
}
],
"oly_mixed": [
{
"hook": "A mix of olympiad ideas: one from number theory, combinatorics and algebra, with a worked example.",
"ideas": [
{
"t": "Parity",
"b": "Odd $\\pm$ odd is even and odd $\\times$ odd is odd. Many problems that look impossible fall to a parity count."
},
{
"t": "Count the complement",
"b": "Counting the outcomes you don't want, or splitting into cases, cracks most counting problems."
},
{
"t": "Factor it",
"b": "Look for patterns like $a^2-b^2=(a-b)(a+b)$, and complete the square."
}
],
"example": {
"q": "Can seven numbers chosen from $\\{1,3,5,\\dots,19\\}$ add up to $100$?",
"steps": [
"Every number in the set is odd.",
"A sum of seven odd numbers is odd.",
"$100$ is even, so it's impossible."
],
"ans": "No"
},
"check": {
"q": "How many subsets does a 5-element set have?",
"choices": [
"$32$",
"$25$",
"$10$",
"$31$"
],
"a": 0,
"why": "Each element is either in or out: $2^5=32$."
}
},
{
"hook": "A mix of olympiad ideas: one from number theory, combinatorics and algebra, with a worked example.",
"ideas": [
{
"t": "Congruences",
"b": "$a\\equiv b\\pmod n$ means $n\\mid a-b$. You can add, subtract and multiply congruences."
},
{
"t": "Combine tools",
"b": "Use stars and bars with inclusion–exclusion to handle 'at most' conditions."
},
{
"t": "Mean inequalities",
"b": "For positive numbers, QM $\\ge$ AM $\\ge$ GM $\\ge$ HM, with equality exactly when all the numbers are equal."
}
],
"example": {
"q": "$10$ people throw their hats in a pile and each takes one at random. What is the expected number who get their own hat?",
"steps": [
"Let $X_i=1$ if person $i$ gets their own hat, and $0$ otherwise.",
"$E[X_i]=\\frac1{10}$.",
"$E[X_1+\\dots+X_{10}]=10\\cdot\\frac1{10}=1$."
],
"ans": "$1$"
},
"check": {
"q": "For positive $a,b,c$ with $abc=1$, what is the minimum of $a+b+c$?",
"choices": [
"$3$",
"$1$",
"$\\sqrt3$",
"$0$"
],
"a": 0,
"why": "By AM–GM, $a+b+c\\ge3\\sqrt[3]{abc}=3$, with equality at $a=b=c=1$."
}
},
{
"hook": "A mix of olympiad ideas: one from number theory, combinatorics and algebra, with a worked example.",
"ideas": [
{
"t": "Euler's theorem",
"b": "$a^{\\varphi(n)}\\equiv1\\pmod n$ when $\\gcd(a,n)=1$. Since $\\varphi(100)=40$, $3^{40}\\equiv1\\pmod{100}$."
},
{
"t": "Invariants",
"b": "Find a quantity that never changes under the allowed moves. If the start and target differ in it, the target can't be reached."
},
{
"t": "Integer root theorem",
"b": "Integer roots of a monic polynomial with integer coefficients divide the constant term."
}
],
"example": {
"q": "Find the integer roots of $x^3-3x^2-4x+12$.",
"steps": [
"Candidates divide $12$. Try $x=2$: $8-12-8+12=0$. ✓",
"Divide: $x^3-3x^2-4x+12=(x-2)(x^2-x-6)$.",
"$x^2-x-6=(x-3)(x+2)$, so the roots are $2$, $3$ and $-2$."
],
"ans": "$2,\\ 3,\\ -2$"
},
"check": {
"q": "In triangle $ABC$, $AB=6$, $AC=9$ and $BC=10$. The bisector of angle $A$ meets $BC$ at $D$. Find $BD$.",
"choices": [
"$4$",
"$5$",
"$6$",
"$3$"
],
"a": 0,
"why": "$BD:DC=6:9=2:3$, so $BD=\\frac25\\cdot10=4$."
}
},
{
"hook": "A mix of olympiad ideas: one from number theory, combinatorics and algebra, with a worked example.",
"ideas": [
{
"t": "Orders",
"b": "The smallest $k>0$ with $a^k\\equiv1\\pmod n$ divides every exponent that gives $1$, including $\\varphi(n)$."
},
{
"t": "The extremal principle",
"b": "Look at the largest, smallest or first element. It often has a special property."
},
{
"t": "Substitutions",
"b": "Try $x=0$, $y=x$ and $y=-x$. Then prove injectivity or surjectivity and look for fixed points."
}
],
"example": {
"q": "In triangle $ABC$, $D$ is the midpoint of $BC$ and $CE:EA=1:2$. Where must $F$ be on $AB$ so that $AD$, $BE$ and $CF$ meet at one point?",
"steps": [
"Ceva: $\\frac{BD}{DC}\\cdot\\frac{CE}{EA}\\cdot\\frac{AF}{FB}=1$.",
"$1\\cdot\\frac12\\cdot\\frac{AF}{FB}=1$.",
"So $AF:FB=2:1$."
],
"ans": "$AF:FB=2:1$"
},
"check": {
"q": "What is the highest power of $3$ dividing $4^9-1$?",
"choices": [
"$3^3$",
"$3^2$",
"$3^1$",
"$3^9$"
],
"a": 0,
"why": "By LTE, $v_3(4^9-1)=v_3(4-1)+v_3(9)=1+2=3$."
}
},
{
"hook": "A mix of olympiad ideas: one from number theory, combinatorics and algebra, with a worked example.",
"ideas": [
{
"t": "Infinite descent",
"b": "Assume a smallest solution exists, then build an even smaller one. That's a contradiction, so there are no solutions."
},
{
"t": "Winning and losing positions",
"b": "A position is losing exactly when every move leads to a winning position for the opponent."
},
{
"t": "Equality cases",
"b": "Find the equality cases first, and make sure every step you use is tight there."
}
],
"example": {
"q": "Show that $x^2+y^2=3z^2$ has no positive integer solutions.",
"steps": [
"Squares are $0$ or $1$ mod $3$, so $x^2+y^2\\equiv0\\pmod3$ forces $3\\mid x$ and $3\\mid y$.",
"Then $9\\mid3z^2$, so $3\\mid z$.",
"Dividing everything by $3$ gives a smaller solution. By infinite descent, there are none."
],
"ans": "no solutions"
},
"check": {
"q": "In the same game starting with $24$ stones, who wins?",
"choices": [
"The second player",
"The first player",
"Nobody",
"It depends on luck"
],
"a": 0,
"why": "$24$ is a multiple of $4$, a losing position for whoever moves first."
}
}
]
};
