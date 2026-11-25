# Source for www/js/lessons.js — hand-written teaching lessons for the Learn courses.
# Every unit has three teaching lessons, one per key idea of that unit's lecture:
#   T(title, explanation, (example question, [steps], answer), [check, check])
# A check is (question, [CORRECT, wrong, wrong, wrong], why). The correct choice is always listed first;
# the app shuffles the order. Paragraphs in the explanation are separated by a blank line.
# Run:  python3 tools/lessons_src.py   (writes www/js/lessons.js)
import json, os

def T(t, explain, ex, checks):
    q, steps, ans = ex
    x = "\n".join(("• " + ln[2:]) if ln.startswith("- ") else ln for ln in explain.strip().split("\n"))
    return {"t": t, "x": x, "ex": {"q": q, "steps": steps, "ans": ans},
            "checks": [{"q": cq, "c": ch, "why": why} for cq, ch, why in checks]}

L = {}

# ======================================================================= PREALGEBRA
L["prealgebra"] = [
 [  # unit 1
  T("Order of operations", r"""
When an expression has several operations, everyone agrees on one order so it has a single answer: **brackets**, then **powers**, then **multiplication and division** (left to right), then **addition and subtraction** (left to right).

Multiplication does *not* beat division: they share a level, so you go left to right. $12\div3\times2$ is $4\times2=8$, not $12\div6=2$.

A fraction bar acts like brackets around the top and around the bottom.""",
    (r"Evaluate $18-12\div3\times2+1$.", [r"No brackets or powers. Do $\div$ and $\times$ left to right: $12\div3=4$, then $4\times2=8$.", r"Now $+$ and $-$ left to right: $18-8=10$, then $10+1=11$."], r"$11$"),
    [(r"What is $5+2\times3^2$?", [r"$23$", r"$63$", r"$41$", r"$121$"], r"Power first: $3^2=9$. Then $2\times9=18$. Then $5+18=23$."),
     (r"What is $\dfrac{6+4\times3}{2}$?", [r"$9$", r"$15$", r"$12$", r"$7$"], r"The bar groups the top: $6+12=18$, and $18\div2=9$.")]),
  T("Adding fractions", r"""
You can only add fractions that are cut into the **same size pieces**. So first rewrite both with a common denominator, then add the numerators and keep the denominator.

The easiest common denominator is the **least common multiple** of the bottoms. For $\frac16+\frac14$ use $12$: $\frac{2}{12}+\frac{3}{12}=\frac{5}{12}$.

Never add the bottoms. $\frac12+\frac12$ is $1$, not $\frac24$.""",
    (r"Compute $\frac35+\frac{2}{3}$.", [r"The LCM of $5$ and $3$ is $15$.", r"$\frac35=\frac{9}{15}$ and $\frac23=\frac{10}{15}$.", r"Add the tops: $\frac{19}{15}$, which is $1\frac{4}{15}$."], r"$\frac{19}{15}$"),
    [(r"What is $\frac14+\frac38$?", [r"$\frac58$", r"$\frac{4}{12}$", r"$\frac{3}{32}$", r"$\frac12$"], r"Write $\frac14=\frac28$; then $\frac28+\frac38=\frac58$."),
     (r"What is $\frac56-\frac13$?", [r"$\frac12$", r"$\frac43$", r"$\frac23$", r"$\frac16$"], r"$\frac13=\frac26$, so $\frac56-\frac26=\frac36=\frac12$.")]),
  T("Percent means per hundred", r"""
"Percent" means "out of $100$", so $x\%=\frac{x}{100}$. To find $x\%$ of a number, multiply: $x\%$ of $y$ is $\frac{x}{100}\times y$.

Handy shortcuts: $10\%$ is dividing by $10$, $50\%$ is halving, $25\%$ is quartering, $1\%$ is dividing by $100$. Build others from these: $15\%=10\%+5\%$.

Percent "of" is symmetric: $8\%$ of $50$ equals $50\%$ of $8$, which is $4$.""",
    (r"What is $35\%$ of $240$?", [r"$10\%$ of $240$ is $24$, so $30\%$ is $72$.", r"$5\%$ is half of $10\%$: $12$.", r"$35\%=30\%+5\%$: $72+12=84$."], r"$84$"),
    [(r"What is $15\%$ of $60$?", [r"$9$", r"$15$", r"$4$", r"$6$"], r"$10\%$ of $60$ is $6$ and $5\%$ is $3$, so $15\%$ is $9$."),
     (r"$12$ is what percent of $48$?", [r"$25\%$", r"$12\%$", r"$4\%$", r"$36\%$"], r"$\frac{12}{48}=\frac14=25\%$.")]),
 ],
 [  # unit 2
  T("Ratios as parts", r"""
A ratio $a:b$ tells you how a whole is split into **parts**. If cats : dogs $=2:5$, think of $2$ equal parts of cats and $5$ equal parts of dogs, $7$ parts in all.

Give each part a size $k$: cats $=2k$, dogs $=5k$. Any one fact about the totals lets you find $k$, and then everything else.

Ratios scale: $2:5=4:10=6:15$. Multiply or divide both sides by the same number.""",
    (r"Juice is mixed with water in the ratio $2:7$. How much juice is in $45$ litres of the drink?", [r"There are $2+7=9$ parts.", r"Each part is $45\div9=5$ litres.", r"Juice is $2$ parts: $2\times5=10$ litres."], r"$10$ litres"),
    [(r"Ann and Ben share $\$60$ in the ratio $1:3$. How much does Ben get?", [r"$\$45$", r"$\$20$", r"$\$15$", r"$\$40$"], r"$4$ parts of $\$15$ each; Ben gets $3$ parts, $\$45$."),
     (r"The ratio of boys to girls is $4:5$ and there are $20$ girls. How many boys?", [r"$16$", r"$25$", r"$36$", r"$9$"], r"Girls $=5k=20$ gives $k=4$, so boys $=4k=16$.")]),
  T("Averages", r"""
The **mean** (average) is the total divided by how many numbers there are. The most useful form is the other way round: **total $=$ average $\times$ count**.

That turns "missing number" problems into subtraction: find the total the average demands, subtract the numbers you know.

Adding a number above the average pulls it up; below pulls it down. Adding the average itself changes nothing.""",
    (r"Your first four quiz scores average $80$. What must you score on the fifth to average $82$?", [r"Five quizzes averaging $82$ need a total of $5\times82=410$.", r"The first four total $4\times80=320$.", r"You need $410-320=90$."], r"$90$"),
    [(r"The mean of $3, 7, 8$ and $x$ is $6$. What is $x$?", [r"$6$", r"$18$", r"$4$", r"$24$"], r"The total must be $4\times6=24$, and $3+7+8=18$, so $x=6$."),
     (r"A class of $20$ averages $70$ and a class of $30$ averages $80$. What is the combined average?", [r"$76$", r"$75$", r"$74$", r"$78$"], r"Total $=20\cdot70+30\cdot80=1400+2400=3800$ over $50$ students: $76$. (Not $75$: the bigger class counts more.)")]),
  T("Undo to solve", r"""
An equation is a balance. Whatever you do to one side, do to the other, and it stays balanced.

To solve, **undo** what was done to $x$, in reverse order. For $3x+5=26$: $x$ was multiplied by $3$, then $5$ was added. So subtract $5$ first ($3x=21$), then divide by $3$ ($x=7$).

Always check by substituting back: $3\cdot7+5=26$. ✓""",
    (r"Solve $\dfrac{x-4}{3}=5$.", [r"Last thing done was dividing by $3$, so multiply both sides by $3$: $x-4=15$.", r"Undo subtracting $4$ by adding $4$: $x=19$.", r"Check: $\frac{19-4}{3}=\frac{15}{3}=5$. ✓"], r"$x=19$"),
    [(r"Solve $4x-7=21$.", [r"$x=7$", r"$x=3.5$", r"$x=28$", r"$x=14$"], r"Add $7$: $4x=28$. Divide by $4$: $x=7$."),
     (r"Solve $2(x+3)=18$.", [r"$x=6$", r"$x=7.5$", r"$x=9$", r"$x=12$"], r"Divide by $2$: $x+3=9$, so $x=6$.")]),
 ],
 [  # unit 3
  T("Prime factorisation", r"""
Every whole number bigger than $1$ is a product of primes in exactly one way. Find it with a **factor tree**: split into any two factors, keep splitting until every branch is prime.

Write the answer with powers: $360=2^3\cdot3^2\cdot5$.

The factorisation answers many questions at once. The GCD takes the *smaller* power of each shared prime; the LCM takes the *larger* power of every prime that appears.""",
    (r"Find the least common multiple of $12$ and $18$.", [r"$12=2^2\cdot3$ and $18=2\cdot3^2$.", r"Take the larger power of each prime: $2^2$ and $3^2$.", r"LCM $=4\cdot9=36$."], r"$36$"),
    [(r"What is the prime factorisation of $84$?", [r"$2^2\cdot3\cdot7$", r"$2\cdot3\cdot14$", r"$4\cdot21$", r"$2^3\cdot7$"], r"$84=2\cdot42=2\cdot2\cdot21=2^2\cdot3\cdot7$. Only primes are allowed, so $14$ and $21$ must be split."),
     (r"What is the largest prime factor of $195$?", [r"$13$", r"$5$", r"$39$", r"$15$"], r"$195=5\cdot39=3\cdot5\cdot13$.")]),
  T("Area toolkit", r"""
Three formulas cover most shapes: rectangle $=lw$, triangle $=\frac12bh$, circle $=\pi r^2$. A parallelogram is $bh$ and a trapezium is $\frac{a+b}{2}h$ (average of the parallel sides times the height).

The height is always measured **perpendicular** to the base, not along a slanted side.

For an awkward shape, either cut it into simple pieces and add, or draw a big simple shape around it and subtract the extra.""",
    (r"A rectangle is $10\times6$. A triangle with base $10$ (the bottom side) and its top vertex on the top side is cut out. What area is left?", [r"Rectangle area: $10\times6=60$.", r"The triangle has base $10$ and height $6$: $\frac12\cdot10\cdot6=30$.", r"Left over: $60-30=30$."], r"$30$"),
    [(r"A trapezium has parallel sides $5$ and $9$ and height $4$. What is its area?", [r"$28$", r"$56$", r"$36$", r"$18$"], r"$\frac{5+9}{2}\cdot4=7\cdot4=28$."),
     (r"A circle has diameter $10$. What is its area?", [r"$25\pi$", r"$100\pi$", r"$10\pi$", r"$20\pi$"], r"The radius is $5$, so the area is $\pi\cdot5^2=25\pi$.")]),
  T("Percent change", r"""
Percent change compares the change to the **original** amount: $\dfrac{\text{new}-\text{old}}{\text{old}}\times100\%$.

Use multipliers: up $20\%$ means $\times1.2$; down $20\%$ means $\times0.8$. Several changes in a row multiply: up $10\%$ then up $10\%$ is $\times1.21$, a $21\%$ rise.

That's why "up $50\%$ then down $50\%$" doesn't return to the start: $1.5\times0.5=0.75$, a $25\%$ loss.""",
    (r"A price drops from $\$80$ to $\$60$. What is the percent decrease?", [r"The change is $80-60=20$.", r"Compare with the original: $\frac{20}{80}=\frac14$.", r"That's a $25\%$ decrease."], r"$25\%$"),
    [(r"A population of $500$ grows by $20\%$ and then by another $10\%$. What is it now?", [r"$660$", r"$650$", r"$600$", r"$700$"], r"$500\times1.2=600$, then $600\times1.1=660$."),
     (r"After a $25\%$ discount a jacket costs $\$60$. What was the original price?", [r"$\$80$", r"$\$75$", r"$\$85$", r"$\$45$"], r"$0.75\times\text{price}=60$, so the price was $60\div0.75=80$. (Adding $25\%$ of $60$ is the trap.)")]),
 ],
 [  # unit 4
  T("Rates add up", r"""
**Distance $=$ rate $\times$ time**, and the same shape works for any rate: pages per hour, litres per minute.

When people work **together**, add their rates, not their times. If A does a job in $a$ hours, A's rate is $\frac1a$ of the job per hour.

For average speed over a whole trip, use total distance $\div$ total time. Averaging the two speeds is usually wrong.""",
    (r"A tap fills a tank in $4$ hours and a second tap fills it in $12$ hours. How long with both open?", [r"Rates: $\frac14$ and $\frac1{12}$ of the tank per hour.", r"Together: $\frac14+\frac1{12}=\frac3{12}+\frac1{12}=\frac4{12}=\frac13$ tank per hour.", r"So it takes $3$ hours."], r"$3$ hours"),
    [(r"You drive $60$ miles at $30$ mph and $60$ miles back at $60$ mph. What is your average speed?", [r"$40$ mph", r"$45$ mph", r"$50$ mph", r"$35$ mph"], r"Times: $2$ h and $1$ h. Total $120$ miles in $3$ hours: $40$ mph."),
     (r"Two trains start $300$ km apart and drive towards each other at $70$ and $80$ km/h. When do they meet?", [r"After $2$ hours", r"After $4$ hours", r"After $1.5$ hours", r"After $3$ hours"], r"They close the gap at $70+80=150$ km/h: $300\div150=2$ hours.")]),
  T("Multiply choices", r"""
If a task happens in **stages**, and stage one has $m$ options while stage two has $n$ options (whatever you picked first), there are $m\times n$ ways in total. This is the **multiplication principle**.

It works for any number of stages: a $3$-letter code from $26$ letters has $26^3$ options.

Watch for restrictions. If letters can't repeat, the stages shrink: $26\times25\times24$.""",
    (r"How many $3$-digit numbers have all digits odd?", [r"Each of the three digits can be $1,3,5,7$ or $9$: $5$ choices.", r"Three independent stages: $5\times5\times5$.", r"$125$ numbers."], r"$125$"),
    [(r"A menu has $4$ starters, $5$ mains and $3$ desserts. How many three-course meals are there?", [r"$60$", r"$12$", r"$20$", r"$15$"], r"$4\times5\times3=60$."),
     (r"How many ways can gold, silver and bronze go to $8$ runners?", [r"$336$", r"$512$", r"$24$", r"$56$"], r"Gold $8$ ways, then silver $7$, then bronze $6$: $8\cdot7\cdot6=336$.")]),
  T("Pythagoras", r"""
In a right triangle with legs $a, b$ and hypotenuse $c$ (the side opposite the right angle, always the longest): $a^2+b^2=c^2$.

To find a leg, subtract: $b^2=c^2-a^2$.

Memorise the common triples, and their multiples: $3$-$4$-$5$ ($6$-$8$-$10$, $9$-$12$-$15$), $5$-$12$-$13$, $8$-$15$-$17$, $7$-$24$-$25$. They turn many problems into recognition.""",
    (r"A rectangle is $9$ by $12$. How long is its diagonal?", [r"The diagonal is the hypotenuse of a right triangle with legs $9$ and $12$.", r"$9^2+12^2=81+144=225$.", r"$\sqrt{225}=15$ (it's $3\times$ the $3$-$4$-$5$ triangle)."], r"$15$"),
    [(r"A right triangle has hypotenuse $26$ and one leg $10$. What is the other leg?", [r"$24$", r"$16$", r"$28$", r"$36$"], r"$26^2-10^2=676-100=576=24^2$. (It's $2\times$ the $5$-$12$-$13$.)"),
     (r"Which of these is a right triangle?", [r"$8, 15, 17$", r"$6, 8, 11$", r"$5, 11, 12$", r"$7, 9, 12$"], r"$8^2+15^2=64+225=289=17^2$.")]),
 ],
 [  # unit 5
  T("Name the unknown", r"""
For a word problem, first decide **what to call $x$**: usually the thing the question asks for, or the smallest quantity.

Then translate sentence by sentence: "is" becomes $=$, "more than" becomes $+$, "times" becomes $\times$, "of" usually becomes $\times$.

Solve, then answer the actual question asked, with units.""",
    (r"Sam is $3$ times as old as his son. In $12$ years he'll be twice as old. How old is the son now?", [r"Let the son be $x$; Sam is $3x$.", r"In $12$ years: $3x+12=2(x+12)$.", r"$3x+12=2x+24$, so $x=12$. Check: $36+12=48=2\cdot24$. ✓"], r"$12$"),
    [(r"Three consecutive integers add to $84$. What is the largest?", [r"$29$", r"$28$", r"$27$", r"$30$"], r"$x+(x+1)+(x+2)=3x+3=84$ gives $x=27$, so the largest is $29$."),
     (r"A number plus half of itself is $27$. What is the number?", [r"$18$", r"$13.5$", r"$9$", r"$54$"], r"$x+\frac x2=\frac{3x}{2}=27$, so $x=18$.")]),
  T("Simplify first", r"""
Before multiplying big numbers, **cancel** common factors. It's faster and you're far less likely to slip.

Look for structure: $99\times7=(100-1)\times7=693$, and $25\times36=25\times4\times9=900$.

Fractions of products cancel across the bar: in $\frac{a\cdot b}{c\cdot d}$ you may cancel any factor on top with any factor below.""",
    (r"Compute $\dfrac{36\times25}{15\times12}$.", [r"Cancel $36$ with $12$: $\frac{36}{12}=3$.", r"Cancel $25$ with $15$: $\frac{25}{15}=\frac53$.", r"$3\times\frac53=5$."], r"$5$"),
    [(r"What is $\dfrac{2^{10}}{2^{7}}$?", [r"$8$", r"$2^{17}$", r"$\frac{10}{7}$", r"$3$"], r"Cancel seven $2$s: $2^{10-7}=2^3=8$."),
     (r"What is $48\times125$?", [r"$6000$", r"$5000$", r"$6200$", r"$4800$"], r"$48\times125=6\times8\times125=6\times1000$.")]),
  T("Estimate to check", r"""
Before or after working something out, round the numbers and get a rough answer. If the exact answer is far away, something went wrong.

Estimation also **eliminates** wrong multiple-choice answers fast: $\frac{397}{0.49}$ is about $400\div\frac12=800$.

Know whether your rounding made the estimate too big or too small, so you know which way the true answer lies.""",
    (r"Estimate $\dfrac{612\times0.48}{3.1}$.", [r"Round: $600\times0.5=300$.", r"Divide by about $3$: $100$.", r"The exact value is about $94.8$, close to the estimate."], r"about $100$"),
    [(r"Which is closest to $\sqrt{50}\times\sqrt{18}$?", [r"$30$", r"$68$", r"$900$", r"$9$"], r"$\sqrt{50\cdot18}=\sqrt{900}=30$ exactly."),
     (r"$19.8\times5.1$ is closest to:", [r"$100$", r"$95$", r"$1000$", r"$25$"], r"$20\times5=100$; the exact value is $100.98$.")]),
 ],
]

# ======================================================================= ALGEBRA
L["algebra"] = [
 [
  T("Solving linear equations", r"""
A linear equation has $x$ only to the first power. The plan: **expand** brackets, **collect** the $x$ terms on one side and numbers on the other, then **divide**.

Move a term across by doing the opposite operation to both sides; it changes sign as it crosses.

With fractions, multiply every term by the common denominator first to clear them.""",
    (r"Solve $5x-3=2x+12$.", [r"Subtract $2x$ from both sides: $3x-3=12$.", r"Add $3$: $3x=15$.", r"Divide by $3$: $x=5$."], r"$x=5$"),
    [(r"Solve $3(x-2)=x+8$.", [r"$x=7$", r"$x=5$", r"$x=3$", r"$x=1$"], r"Expand: $3x-6=x+8$. Then $2x=14$, $x=7$."),
     (r"Solve $\frac{x}{2}+\frac{x}{3}=10$.", [r"$x=12$", r"$x=6$", r"$x=60$", r"$x=2$"], r"Multiply by $6$: $3x+2x=60$, so $5x=60$ and $x=12$.")]),
  T("Slope", r"""
The **slope** of a line measures steepness: rise over run, $m=\dfrac{y_2-y_1}{x_2-x_1}$.

Positive slope goes up to the right, negative goes down, zero is horizontal, and a vertical line has undefined slope.

Parallel lines have equal slopes. Perpendicular lines have slopes that multiply to $-1$, like $2$ and $-\frac12$.""",
    (r"Find the slope of the line through $(1,4)$ and $(5,-4)$.", [r"Rise: $-4-4=-8$.", r"Run: $5-1=4$.", r"$m=\frac{-8}{4}=-2$."], r"$-2$"),
    [(r"What is the slope through $(-2,1)$ and $(4,4)$?", [r"$\frac12$", r"$2$", r"$-\frac12$", r"$\frac32$"], r"$\frac{4-1}{4-(-2)}=\frac36=\frac12$."),
     (r"A line has slope $\frac23$. What is the slope of a perpendicular line?", [r"$-\frac32$", r"$\frac32$", r"$-\frac23$", r"$\frac23$"], r"Perpendicular slopes multiply to $-1$: $\frac23\cdot(-\frac32)=-1$.")]),
  T("Slope-intercept form", r"""
Every non-vertical line can be written $y=mx+b$, where $m$ is the slope and $b$ is the **$y$-intercept** (where it crosses the $y$-axis, at $x=0$).

To find the equation from a point and a slope, plug the point in to get $b$.

To find where a line crosses the $x$-axis, set $y=0$ and solve.""",
    (r"Find the line with slope $3$ through $(2,1)$.", [r"Start with $y=3x+b$.", r"Plug in $(2,1)$: $1=6+b$, so $b=-5$.", r"The line is $y=3x-5$."], r"$y=3x-5$"),
    [(r"Where does $y=-2x+6$ cross the $x$-axis?", [r"$(3,0)$", r"$(6,0)$", r"$(-3,0)$", r"$(0,6)$"], r"Set $y=0$: $-2x+6=0$, $x=3$. ($(0,6)$ is the $y$-intercept.)"),
     (r"What is the slope of $2x+4y=8$?", [r"$-\frac12$", r"$2$", r"$\frac12$", r"$-2$"], r"Solve for $y$: $y=-\frac12x+2$.")]),
 ],
 [
  T("Elimination", r"""
To solve two equations in two unknowns, combine them so one variable **cancels**.

Line up the equations; multiply one or both so the coefficients of one variable match (or are opposites); then subtract (or add). Solve for the remaining variable and substitute back.

Sometimes adding the equations directly is a shortcut: if $x+y=10$ and $x-y=4$, adding gives $2x=14$.""",
    (r"Solve $2x+3y=12$ and $x-y=1$.", [r"Multiply the second by $3$: $3x-3y=3$.", r"Add to the first: $5x=15$, so $x=3$.", r"Then $y=x-1=2$. Check: $6+6=12$. ✓"], r"$x=3,\ y=2$"),
    [(r"If $x+y=9$ and $x-y=3$, what is $x$?", [r"$6$", r"$3$", r"$12$", r"$4.5$"], r"Add: $2x=12$, so $x=6$."),
     (r"If $3a+2b=16$ and $a+2b=8$, what is $a$?", [r"$4$", r"$2$", r"$8$", r"$3$"], r"Subtract: $2a=8$, so $a=4$.")]),
  T("Exponent rules", r"""
Same base: **multiply → add exponents** ($a^3a^4=a^7$), **divide → subtract** ($a^7/a^2=a^5$), **power of a power → multiply** ($(a^3)^2=a^6$).

Also $a^0=1$, $a^{-n}=\frac1{a^n}$, and $a^{1/n}=\sqrt[n]{a}$.

To compare or combine different bases, rewrite them with a common base: $8^2=(2^3)^2=2^6$.""",
    (r"Solve $4^{x}=8^{2}$.", [r"Write both as powers of $2$: $4^x=2^{2x}$ and $8^2=2^6$.", r"So $2x=6$.", r"$x=3$."], r"$x=3$"),
    [(r"Simplify $\dfrac{x^5\cdot x^3}{x^2}$.", [r"$x^6$", r"$x^{13}$", r"$x^{7.5}$", r"$x^{4}$"], r"$x^{5+3-2}=x^6$."),
     (r"What is $27^{2/3}$?", [r"$9$", r"$18$", r"$3$", r"$81$"], r"$27^{1/3}=3$, then squared is $9$.")]),
  T("Absolute value", r"""
$|x|$ is the **distance** from $x$ to $0$, so it's never negative. $|x-a|$ is the distance between $x$ and $a$.

$|x-a|=b$ (with $b>0$) has two solutions: $x=a+b$ and $x=a-b$.

$|x-a|<b$ means "within $b$ of $a$": $a-b<x<a+b$. And $|x-a|>b$ means "farther than $b$": $x<a-b$ or $x>a+b$.""",
    (r"Solve $|2x-3|=7$.", [r"Either $2x-3=7$ or $2x-3=-7$.", r"First: $2x=10$, $x=5$.", r"Second: $2x=-4$, $x=-2$."], r"$x=5$ or $x=-2$"),
    [(r"How many integers satisfy $|x-4|<3$?", [r"$5$", r"$6$", r"$7$", r"$3$"], r"$1<x<7$: the integers $2,3,4,5,6$."),
     (r"What is the sum of the solutions of $|x+1|=6$?", [r"$-2$", r"$0$", r"$12$", r"$5$"], r"$x=5$ or $x=-7$; the sum is $-2$ (twice the centre, $-1$).")]),
 ],
 [
  T("Factoring", r"""
To factor $x^2+bx+c$, find two numbers that **multiply to $c$** and **add to $b$**: $x^2+7x+12=(x+3)(x+4)$.

Watch for special patterns: difference of squares $a^2-b^2=(a-b)(a+b)$, and perfect squares $a^2\pm2ab+b^2=(a\pm b)^2$.

Once factored, set each factor to zero to solve: a product is zero only if a factor is.""",
    (r"Solve $x^2-x-12=0$.", [r"Need two numbers with product $-12$ and sum $-1$: $-4$ and $3$.", r"$(x-4)(x+3)=0$.", r"$x=4$ or $x=-3$."], r"$x=4$ or $x=-3$"),
    [(r"Factor $x^2-49$.", [r"$(x-7)(x+7)$", r"$(x-7)^2$", r"$(x-49)(x+1)$", r"$x(x-49)$"], r"Difference of squares with $a=x$, $b=7$."),
     (r"Compute $101^2-99^2$ quickly.", [r"$400$", r"$200$", r"$4$", r"$2$"], r"$(101-99)(101+99)=2\cdot200=400$.")]),
  T("The quadratic formula", r"""
Every quadratic $ax^2+bx+c=0$ is solved by $x=\dfrac{-b\pm\sqrt{b^2-4ac}}{2a}$.

The **discriminant** $b^2-4ac$ tells you how many real roots there are: positive → two, zero → one (a double root), negative → none.

Use the formula when factoring isn't obvious; it never fails.""",
    (r"Solve $x^2+4x-1=0$.", [r"$a=1,b=4,c=-1$; discriminant $16+4=20$.", r"$x=\frac{-4\pm\sqrt{20}}{2}=\frac{-4\pm2\sqrt5}{2}$.", r"$x=-2\pm\sqrt5$."], r"$x=-2\pm\sqrt5$"),
    [(r"How many real solutions does $2x^2+3x+5=0$ have?", [r"None", r"One", r"Two", r"Infinitely many"], r"$b^2-4ac=9-40<0$."),
     (r"For which $k$ does $x^2+6x+k=0$ have exactly one solution?", [r"$9$", r"$36$", r"$6$", r"$3$"], r"Need $36-4k=0$, so $k=9$: $(x+3)^2=0$.")]),
  T("Vieta's formulas", r"""
If $ax^2+bx+c=0$ has roots $r$ and $s$, then $r+s=-\dfrac{b}{a}$ and $rs=\dfrac{c}{a}$, without solving!

This lets you compute symmetric expressions: $r^2+s^2=(r+s)^2-2rs$ and $\frac1r+\frac1s=\frac{r+s}{rs}$.

Going backwards, a quadratic with roots $r,s$ is $x^2-(r+s)x+rs$.""",
    (r"The roots of $x^2-5x+3=0$ are $r$ and $s$. Find $r^2+s^2$.", [r"$r+s=5$ and $rs=3$.", r"$r^2+s^2=(r+s)^2-2rs=25-6$.", r"$=19$."], r"$19$"),
    [(r"What is the product of the roots of $2x^2-7x+6=0$?", [r"$3$", r"$6$", r"$\frac72$", r"$-3$"], r"$\frac ca=\frac62=3$."),
     (r"Which quadratic has roots $2$ and $-5$?", [r"$x^2+3x-10$", r"$x^2-3x-10$", r"$x^2+3x+10$", r"$x^2-7x+10$"], r"Sum $-3$, product $-10$: $x^2-(-3)x+(-10)$.")]),
 ],
 [
  T("Composition", r"""
$f(g(x))$ means: feed $x$ into $g$, then feed the result into $f$. Work **inside out**.

Order matters: usually $f(g(x))\neq g(f(x))$.

To find a composition as a formula, substitute the whole expression $g(x)$ wherever $f$ has $x$.""",
    (r"If $f(x)=2x+1$ and $g(x)=x^2$, find $f(g(3))$ and $g(f(3))$.", [r"$g(3)=9$, so $f(g(3))=f(9)=19$.", r"$f(3)=7$, so $g(f(3))=g(7)=49$.", r"Different answers: order matters."], r"$19$ and $49$"),
    [(r"If $f(x)=x-3$ and $g(x)=2x$, what is $f(g(x))$?", [r"$2x-3$", r"$2x-6$", r"$2x^2-3$", r"$x-6$"], r"Replace $x$ in $f$ with $2x$: $2x-3$."),
     (r"If $h(x)=3x-2$, what is $h(h(2))$?", [r"$10$", r"$4$", r"$16$", r"$12$"], r"$h(2)=4$, then $h(4)=10$.")]),
  T("Completing the square", r"""
Rewrite $x^2+bx$ as a square minus a correction: $x^2+bx=\left(x+\frac b2\right)^2-\frac{b^2}{4}$.

This turns any quadratic into **vertex form** $a(x-h)^2+k$, which shows the minimum or maximum value $k$ at $x=h$.

It's also how the quadratic formula is proved.""",
    (r"Find the minimum value of $x^2-6x+14$.", [r"$x^2-6x=(x-3)^2-9$.", r"So $x^2-6x+14=(x-3)^2+5$.", r"A square is at least $0$, so the minimum is $5$, at $x=3$."], r"$5$"),
    [(r"Write $x^2+10x+30$ in vertex form.", [r"$(x+5)^2+5$", r"$(x+10)^2-70$", r"$(x+5)^2+30$", r"$(x-5)^2+5$"], r"$x^2+10x=(x+5)^2-25$, plus $30$ gives $+5$."),
     (r"What is the maximum of $-x^2+4x$?", [r"$4$", r"$2$", r"$0$", r"$-4$"], r"$-(x^2-4x)=-(x-2)^2+4$.")]),
  T("Arithmetic series", r"""
An **arithmetic sequence** adds the same difference $d$ each time: $a, a+d, a+2d,\dots$ The $n$-th term is $a+(n-1)d$.

The sum of $n$ terms is $\dfrac{n(\text{first}+\text{last})}{2}$: pair the first with the last, the second with the second-last, and so on.

Count terms carefully: from $5$ to $50$ in steps of $5$ there are $\frac{50-5}{5}+1=10$ terms.""",
    (r"Find $3+7+11+\dots+99$.", [r"$d=4$; the number of terms is $\frac{99-3}{4}+1=25$.", r"Sum $=\frac{25(3+99)}{2}=\frac{25\cdot102}{2}$.", r"$=1275$."], r"$1275$"),
    [(r"What is $1+2+\dots+100$?", [r"$5050$", r"$5000$", r"$10100$", r"$4950$"], r"$\frac{100\cdot101}{2}=5050$."),
     (r"What is the $20$th term of $2, 5, 8, \dots$?", [r"$59$", r"$62$", r"$60$", r"$57$"], r"$2+19\cdot3=59$.")]),
 ],
 [
  T("Rationalising", r"""
To clear a square root from a denominator, multiply top and bottom by something that removes it.

A single root: $\frac{1}{\sqrt3}=\frac{\sqrt3}{3}$. A sum or difference: multiply by the **conjugate**, since $(a+\sqrt b)(a-\sqrt b)=a^2-b$.

Simplify roots first by pulling out square factors: $\sqrt{72}=\sqrt{36\cdot2}=6\sqrt2$.""",
    (r"Rationalise $\dfrac{2}{\sqrt5-1}$.", [r"Multiply top and bottom by the conjugate $\sqrt5+1$.", r"Bottom: $(\sqrt5)^2-1^2=4$.", r"$\frac{2(\sqrt5+1)}{4}=\frac{\sqrt5+1}{2}$."], r"$\frac{\sqrt5+1}{2}$"),
    [(r"Simplify $\sqrt{50}+\sqrt{18}$.", [r"$8\sqrt2$", r"$\sqrt{68}$", r"$2\sqrt{17}$", r"$15\sqrt2$"], r"$5\sqrt2+3\sqrt2=8\sqrt2$."),
     (r"What is $\dfrac{1}{\sqrt2+1}$?", [r"$\sqrt2-1$", r"$\sqrt2+1$", r"$\frac{\sqrt2}{2}$", r"$1-\sqrt2$"], r"Multiply by $\sqrt2-1$: the bottom becomes $2-1=1$.")]),
  T("Domains", r"""
The **domain** is every input a formula accepts. Two rules catch almost everything: **no dividing by zero**, and **no square roots of negatives** (in the real numbers).

For $\frac{1}{x-2}$, exclude $x=2$. For $\sqrt{x+3}$, need $x\ge-3$. Combine all the conditions.

The **range** is every output the function actually produces.""",
    (r"Find the domain of $f(x)=\dfrac{\sqrt{x-1}}{x-4}$.", [r"The root needs $x-1\ge0$, so $x\ge1$.", r"The denominator needs $x\neq4$.", r"Domain: $x\ge1$, $x\ne4$."], r"$[1,4)\cup(4,\infty)$"),
    [(r"Which value is NOT in the domain of $\dfrac{x}{x^2-9}$?", [r"$3$", r"$0$", r"$9$", r"$-9$"], r"$x^2-9=0$ at $x=\pm3$."),
     (r"What is the range of $y=x^2+2$?", [r"$y\ge2$", r"all real numbers", r"$y\ge0$", r"$y>2$"], r"$x^2\ge0$, so $y\ge2$, reached at $x=0$.")]),
  T("Symmetry", r"""
Look for **symmetry** before grinding. If swapping $x$ and $y$ leaves a system unchanged, try setting $x=y$, or use $x+y$ and $xy$.

Pairing helps too: in a sum, pair terms from opposite ends; in a product of factors, pair terms that combine nicely.

A good substitution can turn a scary equation into a quadratic: in $x^4-5x^2+4=0$, let $u=x^2$.""",
    (r"Solve $x^4-5x^2+4=0$.", [r"Let $u=x^2$: $u^2-5u+4=0$.", r"$(u-1)(u-4)=0$, so $u=1$ or $4$.", r"$x=\pm1$ or $x=\pm2$."], r"$x=\pm1,\pm2$"),
    [(r"If $x+y=7$ and $xy=10$, what is $x^2+y^2$?", [r"$29$", r"$49$", r"$39$", r"$69$"], r"$(x+y)^2-2xy=49-20=29$."),
     (r"If $x+\frac1x=3$, what is $x^2+\frac1{x^2}$?", [r"$7$", r"$9$", r"$11$", r"$6$"], r"Square: $x^2+2+\frac1{x^2}=9$, so $x^2+\frac1{x^2}=7$.")]),
 ],
]

# ======================================================================= NUMBER THEORY
L["number_theory"] = [
 [
  T("Divisibility tests", r"""
You can test divisibility without dividing:
- **2, 5, 10**: look at the last digit.
- **4**: the last two digits form a multiple of $4$. **8**: the last three digits.
- **3, 9**: the digit sum is a multiple of $3$ (or $9$).
- **11**: the alternating sum of digits ($+-+-\dots$) is a multiple of $11$.

For **6**, test $2$ and $3$; for **12**, test $3$ and $4$. Combine tests for coprime factors.""",
    (r"Is $7\,128$ divisible by $12$?", [r"Test $4$: the last two digits are $28$, a multiple of $4$. ✓", r"Test $3$: digit sum $7+1+2+8=18$, a multiple of $3$. ✓", r"$3$ and $4$ are coprime, so it's divisible by $12$ ($7128=12\times594$)."], r"Yes"),
    [(r"Which digit $d$ makes $57d$ divisible by $9$?", [r"$6$", r"$3$", r"$0$", r"$9$"], r"Digit sum $12+d$ must be a multiple of $9$: $d=6$."),
     (r"Which of these is divisible by $11$?", [r"$9\,284$", r"$9\,285$", r"$8\,294$", r"$9\,248$"], r"Alternating sums: $9-2+8-4=11$ ✓. For $9285$ it's $12$, for $8294$ it's $-1$, for $9248$ it's $3$.")]),
  T("Unique factorisation", r"""
Every integer greater than $1$ factors into primes in **exactly one way** (up to order). This is the Fundamental Theorem of Arithmetic.

Consequences you use all the time: if a prime divides a product, it divides one of the factors; a number is a perfect square exactly when every prime exponent is even; a cube when every exponent is a multiple of $3$.

So to make $n$ a square, look at which exponents are odd.""",
    (r"What is the smallest positive $k$ such that $72k$ is a perfect square?", [r"$72=2^3\cdot3^2$.", r"The exponent of $2$ is odd; the exponent of $3$ is even.", r"Multiply by one more $2$: $k=2$, giving $144=12^2$."], r"$2$"),
    [(r"What is the smallest $k$ with $50k$ a perfect cube?", [r"$20$", r"$2$", r"$5$", r"$10$"], r"$50=2\cdot5^2$. Need $2^3\cdot5^3$: multiply by $2^2\cdot5=20$."),
     (r"How many primes divide $2^4\cdot3^2\cdot7$?", [r"$3$", r"$7$", r"$4$", r"$8$"], r"The distinct primes are $2$, $3$ and $7$.")]),
  T("GCD times LCM", r"""
For positive integers, $\gcd(a,b)\times\text{lcm}(a,b)=a\times b$.

Why: in the prime factorisations, the GCD takes the smaller power of each prime and the LCM the larger. Together they use each power exactly once.

So if you know three of $a, b$, GCD and LCM, you know the fourth.""",
    (r"Two numbers have GCD $6$ and LCM $72$. One is $18$. What is the other?", [r"Product of the numbers $=6\times72=432$.", r"The other is $432\div18$.", r"$=24$. Check: $\gcd(18,24)=6$, $\text{lcm}=72$. ✓"], r"$24$"),
    [(r"What is $\text{lcm}(21,35)$?", [r"$105$", r"$735$", r"$7$", r"$70$"], r"$\gcd=7$, so $\text{lcm}=\frac{21\cdot35}{7}=105$."),
     (r"If $\gcd(a,b)=1$, what is $\text{lcm}(a,b)$?", [r"$ab$", r"$1$", r"$a+b$", r"$\max(a,b)$"], r"Coprime numbers share nothing, so the LCM is the full product.")]),
 ],
 [
  T("Work mod n", r"""
"$a\equiv b\pmod n$" means $a$ and $b$ leave the same remainder when divided by $n$.

You can **add, subtract and multiply** remainders freely: to find the remainder of a big expression, reduce each piece first. $17\times23\pmod 5$: $17\equiv2$, $23\equiv3$, so the product $\equiv6\equiv1$.

Negative remainders are allowed and often handy: $99\equiv-1\pmod{100}$.""",
    (r"What is the remainder when $2^{10}$ is divided by $7$?", [r"$2^3=8\equiv1\pmod 7$.", r"$2^{10}=(2^3)^3\cdot2\equiv1^3\cdot2$.", r"Remainder $2$ (check: $1024=7\cdot146+2$)."], r"$2$"),
    [(r"What is the remainder of $47\times52$ divided by $5$?", [r"$4$", r"$2$", r"$0$", r"$1$"], r"$47\equiv2$, $52\equiv2$, product $\equiv4$."),
     (r"What is the remainder of $99^{5}$ divided by $100$?", [r"$99$", r"$1$", r"$0$", r"$95$"], r"$99\equiv-1$, so $99^5\equiv(-1)^5=-1\equiv99$.")]),
  T("Counting divisors", r"""
If $n=p^a q^b r^c\cdots$, every divisor picks an exponent for each prime: $0$ to $a$ for $p$, $0$ to $b$ for $q$, and so on.

So the number of divisors is $(a+1)(b+1)(c+1)\cdots$.

Divisors come in pairs $d$ and $\frac nd$, so the count is odd exactly when $n$ is a perfect square.""",
    (r"How many positive divisors does $360$ have?", [r"$360=2^3\cdot3^2\cdot5^1$.", r"Choices of exponents: $4$, $3$ and $2$.", r"$4\cdot3\cdot2=24$ divisors."], r"$24$"),
    [(r"How many divisors does $2^5\cdot7^2$ have?", [r"$18$", r"$10$", r"$7$", r"$12$"], r"$(5+1)(2+1)=18$."),
     (r"Which number has an odd number of divisors?", [r"$49$", r"$48$", r"$50$", r"$51$"], r"Only perfect squares do: $49=7^2$ has $1,7,49$.")]),
  T("Cycles", r"""
Last digits of powers **repeat in cycles**. Powers of $7$ end in $7, 9, 3, 1, 7, 9, 3, 1,\dots$, a cycle of length $4$.

To find the last digit of $7^{n}$, find where $n$ falls in the cycle: use $n\bmod 4$ (with remainder $0$ meaning the last spot).

The same idea works for remainders mod anything: powers mod $m$ always eventually cycle.""",
    (r"What is the units digit of $3^{2025}$?", [r"Powers of $3$ end in $3, 9, 7, 1$: cycle length $4$.", r"$2025=4\cdot506+1$, remainder $1$.", r"So it matches $3^1$: units digit $3$."], r"$3$"),
    [(r"What is the units digit of $2^{100}$?", [r"$6$", r"$2$", r"$4$", r"$8$"], r"Cycle $2,4,8,6$; $100\equiv0\pmod4$ means the 4th spot: $6$."),
     (r"What is the units digit of $9^{51}$?", [r"$9$", r"$1$", r"$3$", r"$7$"], r"Powers of $9$ alternate $9,1$; odd exponents give $9$.")]),
 ],
 [
  T("Bases", r"""
In base $b$, digits run from $0$ to $b-1$ and each place is worth a power of $b$: $\overline{213}_5=2\cdot25+1\cdot5+3=58$.

To convert **to** base $b$, repeatedly divide by $b$ and read the remainders from bottom to top.

Base $2$ (binary) uses only $0$ and $1$; every number is a sum of distinct powers of $2$.""",
    (r"Write $45$ in base $3$.", [r"$45\div3=15$ r $0$; $15\div3=5$ r $0$; $5\div3=1$ r $2$; $1\div3=0$ r $1$.", r"Read the remainders upwards: $1200$.", r"Check: $27+2\cdot9+0+0=45$. ✓"], r"$1200_3$"),
    [(r"What is $\overline{1011}_2$ in base $10$?", [r"$11$", r"$13$", r"$1011$", r"$9$"], r"$8+0+2+1=11$."),
     (r"What is $\overline{34}_8+\overline{17}_8$ in base $10$?", [r"$43$", r"$51$", r"$41$", r"$53$"], r"$28+15=43$.")]),
  T("Euclidean algorithm", r"""
$\gcd(a,b)=\gcd(b,\ a\bmod b)$: any common divisor of $a$ and $b$ also divides the remainder.

So repeatedly replace the bigger number by its remainder until you reach $0$; the last nonzero number is the GCD. It's fast even for huge numbers.

Subtraction works too: $\gcd(a,b)=\gcd(a-b,b)$.""",
    (r"Find $\gcd(252,198)$.", [r"$252=1\cdot198+54$, so $\gcd(198,54)$.", r"$198=3\cdot54+36$, so $\gcd(54,36)$; $54=1\cdot36+18$; $36=2\cdot18+0$.", r"The GCD is $18$."], r"$18$"),
    [(r"What is $\gcd(91,65)$?", [r"$13$", r"$7$", r"$5$", r"$1$"], r"$91-65=26$; $\gcd(65,26)$: $65=2\cdot26+13$; $26=2\cdot13$. GCD $13$."),
     (r"What is $\gcd(n, n+6)$ when $n$ is odd and not a multiple of $3$?", [r"$1$", r"$6$", r"$2$", r"$3$"], r"It divides $(n+6)-n=6$, but $n$ shares no factor $2$ or $3$.")]),
  T("Neighbours are coprime", r"""
Consecutive integers $n$ and $n+1$ always have $\gcd=1$: any common divisor divides their difference, $1$.

More generally, $\gcd(n, n+k)$ divides $k$. So $n$ and $n+2$ share at most a factor of $2$.

This is useful in proofs: if $n(n+1)$ is a perfect square, each factor must be a square on its own (they share no primes), which is impossible for positive $n$.""",
    (r"What are the possible values of $\gcd(n, n+4)$?", [r"Any common divisor divides $(n+4)-n=4$.", r"So the GCD is $1$, $2$ or $4$.", r"All occur: $n=1$ gives $1$, $n=2$ gives $2$, $n=4$ gives $4$."], r"$1$, $2$ or $4$"),
    [(r"What is $\gcd(1000, 1001)$?", [r"$1$", r"$7$", r"$1000$", r"$11$"], r"Consecutive integers are coprime."),
     (r"What is the largest possible $\gcd(n, n+10)$?", [r"$10$", r"$5$", r"$2$", r"$1$"], r"It divides $10$, and $n=10$ achieves it.")]),
 ],
 [
  T("Fermat's little theorem", r"""
If $p$ is prime and $p$ doesn't divide $a$, then $a^{p-1}\equiv1\pmod p$.

So exponents can be reduced **mod $p-1$**: $3^{100}\pmod 7$: $3^6\equiv1$, and $100=6\cdot16+4$, so $3^{100}\equiv3^4=81\equiv4$.

A related form, true for every $a$: $a^p\equiv a\pmod p$.""",
    (r"Find $2^{100}\bmod 13$.", [r"$13$ is prime, so $2^{12}\equiv1$.", r"$100=12\cdot8+4$, so $2^{100}\equiv2^4=16$.", r"$16\equiv3\pmod{13}$."], r"$3$"),
    [(r"What is $5^{22}\bmod 11$?", [r"$3$", r"$1$", r"$5$", r"$4$"], r"$5^{10}\equiv1$, so $5^{22}\equiv5^2=25\equiv3$."),
     (r"What is $7^{7}\bmod 7$?", [r"$0$", r"$1$", r"$7$", r"$6$"], r"Fermat needs $p\nmid a$. Here $7\mid7^7$, so the remainder is $0$.")]),
  T("Inverses", r"""
The **inverse** of $a$ mod $n$ is a number $a^{-1}$ with $a\cdot a^{-1}\equiv1\pmod n$. It exists exactly when $\gcd(a,n)=1$.

Inverses let you "divide" in modular arithmetic: to solve $3x\equiv5\pmod7$, multiply by the inverse of $3$, which is $5$ (since $15\equiv1$): $x\equiv25\equiv4$.

For small $n$, find inverses by trying; for big $n$, use the Euclidean algorithm backwards.""",
    (r"Solve $4x\equiv3\pmod{11}$.", [r"Find the inverse of $4$ mod $11$: $4\cdot3=12\equiv1$, so it's $3$.", r"Multiply both sides by $3$: $x\equiv9$.", r"Check: $4\cdot9=36=33+3$. ✓"], r"$x\equiv9\pmod{11}$"),
    [(r"What is the inverse of $2$ mod $9$?", [r"$5$", r"$4$", r"$2$", r"$7$"], r"$2\cdot5=10\equiv1\pmod 9$."),
     (r"Which number has NO inverse mod $12$?", [r"$9$", r"$5$", r"$7$", r"$11$"], r"$\gcd(9,12)=3\ne1$.")]),
  T("Sum of divisors", r"""
For $n=p^a q^b\cdots$, the sum of all divisors is $(1+p+\dots+p^a)(1+q+\dots+q^b)\cdots$.

Each divisor appears exactly once when you expand the product. And $1+p+\dots+p^a=\dfrac{p^{a+1}-1}{p-1}$.

A number is **perfect** if its divisors (other than itself) add to it, like $6=1+2+3$ and $28$.""",
    (r"Find the sum of the divisors of $72$.", [r"$72=2^3\cdot3^2$.", r"$(1+2+4+8)(1+3+9)=15\cdot13$.", r"$=195$."], r"$195$"),
    [(r"What is the sum of the divisors of $12$?", [r"$28$", r"$16$", r"$24$", r"$27$"], r"$(1+2+4)(1+3)=7\cdot4=28$."),
     (r"What is the sum of the divisors of $3^4$?", [r"$121$", r"$81$", r"$13$", r"$40$"], r"$1+3+9+27+81=121=\frac{3^5-1}{2}$.")]),
 ],
 [
  T("Chinese remainder theorem", r"""
If $m$ and $n$ are coprime, the pair of conditions $x\equiv a\pmod m$ and $x\equiv b\pmod n$ has exactly one solution mod $mn$.

To find it, list numbers with the first remainder ($a, a+m, a+2m,\dots$) until one has the second remainder.

This is why the remainder mod $15$ is determined by the remainders mod $3$ and mod $5$.""",
    (r"Find the smallest positive $x$ with $x\equiv2\pmod 3$ and $x\equiv3\pmod 5$.", [r"Numbers $\equiv3\pmod5$: $3, 8, 13, 18,\dots$", r"Check mod $3$: $3\to0$, $8\to2$. ✓", r"$x=8$, and all solutions are $8+15k$."], r"$8$"),
    [(r"What is the smallest positive $x$ with $x\equiv1\pmod4$ and $x\equiv2\pmod 3$?", [r"$5$", r"$9$", r"$2$", r"$11$"], r"$1,5,9,\dots$; $5\equiv2\pmod3$."),
     (r"A number leaves remainder $1$ when divided by $2, 3, 4, 5$ and $6$. Smallest such number above $1$?", [r"$61$", r"$31$", r"$121$", r"$59$"], r"$x-1$ is a multiple of $\text{lcm}(2,\dots,6)=60$.")]),
  T("Linear Diophantine equations", r"""
$ax+by=c$ has integer solutions exactly when $\gcd(a,b)$ divides $c$.

Once you find one solution $(x_0,y_0)$, all solutions are $x=x_0+\frac{b}{g}t$, $y=y_0-\frac{a}{g}t$, where $g=\gcd(a,b)$.

For word problems ("stamps of $5$ and $7$ cents"), also require $x,y\ge0$.""",
    (r"Find all non-negative solutions of $3x+5y=31$.", [r"Try $y$ values: $31-5y$ must be a multiple of $3$.", r"$y=2$: $21$, so $x=7$. $y=5$: $6$, so $x=2$.", r"$y=8$ is too big. Solutions: $(7,2)$ and $(2,5)$."], r"$(7,2), (2,5)$"),
    [(r"Does $6x+9y=20$ have integer solutions?", [r"No", r"Yes", r"Only with $x=0$", r"Infinitely many positive ones"], r"$\gcd(6,9)=3$ doesn't divide $20$."),
     (r"With $5$ and $7$ cent stamps, which amount is impossible?", [r"$23$", r"$24$", r"$25$", r"$26$"], r"$24=10+14$, $25=5\cdot5$, $26=5+21$, but $23$ can't be made. (The largest impossible amount is $5\cdot7-5-7=23$.)")]),
  T("Small moduli", r"""
Looking at an equation **mod a small number** often proves it impossible.

Squares mod $4$ are only $0$ or $1$. Squares mod $3$ are only $0$ or $1$. Squares mod $8$ are $0$, $1$ or $4$. Cubes mod $9$ are $0$, $1$ or $8$.

So $x^2+y^2=4003$ has no solutions: the left side is $0, 1$ or $2$ mod $4$, but $4003\equiv3$.""",
    (r"Can $n^2+1$ ever be divisible by $3$?", [r"Squares mod $3$ are $0$ or $1$.", r"So $n^2+1$ is $1$ or $2$ mod $3$.", r"Never $0$: no."], r"No"),
    [(r"Which number can be a sum of two squares?", [r"$41$", r"$43$", r"$47$", r"$39$"], r"$41=16+25$. The others are $3\pmod4$, which is impossible."),
     (r"What remainder can a perfect square leave when divided by $8$, if the square is odd?", [r"$1$", r"$3$", r"$5$", r"$7$"], r"$(2k+1)^2=4k(k+1)+1$, and $k(k+1)$ is even, so it's $1\pmod8$.")]),
 ],
]

# ======================================================================= COUNTING & PROBABILITY
L["counting_and_probability"] = [
 [
  T("Multiplication principle", r"""
If something happens in **independent stages**, multiply the number of choices at each stage.

Do the **most restricted** stage first. For "$4$-digit numbers that are even", the last digit has $5$ choices and the first digit can't be $0$: $9\cdot10\cdot10\cdot5=4500$.

If choices depend on earlier choices, the counts can shrink stage by stage, but you still multiply.""",
    (r"How many $4$-digit numbers have no repeated digits?", [r"First digit: $9$ choices (not $0$).", r"Second: $9$ (now $0$ is allowed, but not the first digit). Third: $8$. Fourth: $7$.", r"$9\cdot9\cdot8\cdot7=4536$."], r"$4536$"),
    [(r"How many licence plates have $2$ letters followed by $3$ digits?", [r"$676\,000$", r"$67\,600$", r"$5$", r"$26\,000$"], r"$26^2\cdot10^3=676\cdot1000$."),
     (r"How many $3$-digit numbers are odd?", [r"$450$", r"$500$", r"$900$", r"$405$"], r"$9\cdot10\cdot5=450$.")]),
  T("Probability", r"""
When all outcomes are **equally likely**, probability $=\dfrac{\text{favourable outcomes}}{\text{total outcomes}}$.

Count both carefully, using the same kind of outcome. With two dice, there are $36$ ordered outcomes, all equally likely; the $11$ possible sums are *not* equally likely.

For independent events, multiply probabilities.""",
    (r"Two fair dice are rolled. What is the probability the sum is $8$?", [r"Total ordered outcomes: $36$.", r"Sum $8$: $(2,6),(3,5),(4,4),(5,3),(6,2)$: $5$ outcomes.", r"Probability $\frac{5}{36}$."], r"$\frac5{36}$"),
    [(r"A coin is flipped $3$ times. What is the probability of exactly $2$ heads?", [r"$\frac38$", r"$\frac23$", r"$\frac14$", r"$\frac12$"], r"$HHT, HTH, THH$: $3$ of $8$."),
     (r"A bag has $3$ red and $5$ blue balls. Two are drawn without replacement. Probability both red?", [r"$\frac{3}{28}$", r"$\frac{9}{64}$", r"$\frac38$", r"$\frac{1}{8}$"], r"$\frac38\cdot\frac27=\frac{6}{56}=\frac3{28}$.")]),
  T("Complements", r"""
"At least one" problems are usually easiest **backwards**: $P(\text{at least one})=1-P(\text{none})$.

The same works for counting: count everything, subtract the ones you don't want.

So the chance of at least one six in four rolls is $1-\left(\frac56\right)^4\approx0.52$.""",
    (r"How many $3$-letter strings (A–Z) have at least one vowel (A, E, I, O, U)?", [r"All strings: $26^3=17\,576$.", r"Strings with no vowel: $21^3=9\,261$.", r"At least one vowel: $17\,576-9\,261=8\,315$."], r"$8315$"),
    [(r"A coin is flipped $5$ times. Probability of at least one head?", [r"$\frac{31}{32}$", r"$\frac{5}{32}$", r"$\frac12$", r"$\frac{1}{32}$"], r"$1-\left(\frac12\right)^5=\frac{31}{32}$."),
     (r"Probability that two dice show different numbers?", [r"$\frac56$", r"$\frac16$", r"$\frac{11}{36}$", r"$\frac{30}{36}\cdot\frac12$"], r"$1-P(\text{same})=1-\frac{6}{36}=\frac56$.")]),
 ],
 [
  T("Permutations", r"""
A **permutation** is an arrangement where **order matters**. $n$ different objects can be lined up in $n!=n(n-1)\cdots1$ ways.

Choosing and arranging $k$ of $n$ objects: $n(n-1)\cdots(n-k+1)=\dfrac{n!}{(n-k)!}$.

Around a circle (where rotations count as the same), $n$ people sit in $(n-1)!$ ways.""",
    (r"In how many ways can $5$ friends sit in a row if Ana and Ben must sit together?", [r"Glue Ana and Ben into one block: now $4$ units to arrange: $4!=24$.", r"Inside the block they can be AB or BA: $\times2$.", r"$24\cdot2=48$."], r"$48$"),
    [(r"How many ways to arrange the letters of WORD?", [r"$24$", r"$4$", r"$16$", r"$256$"], r"$4!=24$ (all letters different)."),
     (r"In how many ways can $6$ people sit around a round table?", [r"$120$", r"$720$", r"$36$", r"$60$"], r"Fix one person; arrange the other $5$: $5!=120$.")]),
  T("Combinations", r"""
A **combination** is a selection where **order doesn't matter**. Choosing $k$ of $n$: $\dbinom nk=\dfrac{n!}{k!(n-k)!}$.

It's the permutation count divided by $k!$, because each group of $k$ was counted in all $k!$ orders.

Symmetry: $\binom nk=\binom n{n-k}$. Choosing who's in is the same as choosing who's out.""",
    (r"A committee of $3$ is chosen from $5$ women and $4$ men. How many committees have exactly $2$ women?", [r"Choose the women: $\binom52=10$.", r"Choose the man: $\binom41=4$.", r"$10\cdot4=40$."], r"$40$"),
    [(r"What is $\binom{8}{3}$?", [r"$56$", r"$336$", r"$24$", r"$40$"], r"$\frac{8\cdot7\cdot6}{3\cdot2\cdot1}=56$."),
     (r"How many handshakes happen if $10$ people each shake hands once with everyone else?", [r"$45$", r"$90$", r"$100$", r"$10$"], r"Each handshake is a pair: $\binom{10}2=45$.")]),
  T("Repeated letters", r"""
Arranging letters with repeats over-counts: swapping two identical letters gives the same word.

Divide by the factorial of each repeat count: arrangements of $n$ letters with repeats $a, b,\dots$ is $\dfrac{n!}{a!\,b!\cdots}$.

For example, BANANA has $6$ letters with A three times and N twice: $\frac{6!}{3!\,2!}=60$.""",
    (r"How many arrangements of the letters of LEVEL are there?", [r"$5$ letters: L twice, E twice, V once.", r"$\frac{5!}{2!\,2!}=\frac{120}{4}$.", r"$=30$."], r"$30$"),
    [(r"How many arrangements of AABB?", [r"$6$", r"$24$", r"$4$", r"$12$"], r"$\frac{4!}{2!2!}=6$."),
     (r"How many paths go from $(0,0)$ to $(3,2)$ using unit steps right or up?", [r"$10$", r"$5$", r"$6$", r"$32$"], r"Arrange RRRUU: $\frac{5!}{3!2!}=10$.")]),
 ],
 [
  T("Stars and bars", r"""
The number of ways to split $n$ identical items into $k$ groups (groups may be empty) is $\dbinom{n+k-1}{k-1}$.

Picture $n$ stars and $k-1$ bars in a row; the bars cut the stars into $k$ groups. You're just choosing where the bars go.

If every group must get at least one, first hand one to each group: $\binom{n-1}{k-1}$.""",
    (r"How many non-negative integer solutions does $a+b+c=6$ have?", [r"$6$ stars and $2$ bars: $8$ positions.", r"Choose where the bars go: $\binom82$.", r"$=28$."], r"$28$"),
    [(r"In how many ways can $10$ identical sweets be shared among $3$ children if each gets at least one?", [r"$36$", r"$66$", r"$45$", r"$120$"], r"$\binom{9}{2}=36$."),
     (r"How many positive solutions does $x+y+z+w=8$ have?", [r"$35$", r"$165$", r"$56$", r"$70$"], r"$\binom{7}{3}=35$.")]),
  T("Inclusion–exclusion", r"""
To count things in $A$ **or** $B$, add the sizes and subtract the overlap, which was counted twice: $|A\cup B|=|A|+|B|-|A\cap B|$.

For three sets: add the singles, subtract the pairs, add back the triple.

Classic use: "how many numbers up to $N$ are divisible by $2$ or $3$?" Count multiples of each, then subtract multiples of $6$.""",
    (r"How many integers from $1$ to $100$ are divisible by $3$ or $5$?", [r"Multiples of $3$: $33$. Multiples of $5$: $20$.", r"Both means multiples of $15$: $6$.", r"$33+20-6=47$."], r"$47$"),
    [(r"In a class of $30$, $18$ play football, $12$ play tennis and $5$ play both. How many play neither?", [r"$5$", r"$0$", r"$10$", r"$7$"], r"$18+12-5=25$ play something; $30-25=5$."),
     (r"How many integers from $1$ to $60$ are divisible by neither $2$ nor $3$?", [r"$20$", r"$10$", r"$30$", r"$40$"], r"Divisible by $2$ or $3$: $30+20-10=40$; $60-40=20$.")]),
  T("Expected value is linear", r"""
The **expected value** is the probability-weighted average outcome.

**Linearity**: the expectation of a sum is the sum of the expectations, *even if the parts depend on each other*. So break complicated counts into simple yes/no indicators and add their probabilities.

The expected number of sixes in $12$ rolls is $12\cdot\frac16=2$.""",
    (r"$5$ letters are put randomly into their $5$ envelopes. What is the expected number in the right envelope?", [r"Each letter is in its own envelope with probability $\frac15$.", r"By linearity, add: $5\cdot\frac15$.", r"$=1$, whatever the number of letters!"], r"$1$"),
    [(r"What is the expected value of one roll of a fair die?", [r"$3.5$", r"$3$", r"$4$", r"$6$"], r"$\frac{1+2+\dots+6}{6}=\frac{21}{6}$."),
     (r"A coin is flipped $10$ times. Expected number of times HH appears in consecutive flips?", [r"$\frac94$", r"$\frac52$", r"$\frac{10}{4}$", r"$2$"], r"There are $9$ consecutive pairs, each HH with probability $\frac14$.")]),
 ],
 [
  T("Pascal's rule", r"""
$\dbinom nk=\dbinom{n-1}{k-1}+\dbinom{n-1}{k}$. To choose $k$ from $n$, either the last item is chosen (choose $k-1$ more from $n-1$) or it isn't (choose all $k$ from the other $n-1$).

This builds **Pascal's triangle**: each entry is the sum of the two above it.

Row $n$ adds up to $2^n$, the number of subsets of an $n$-element set.""",
    (r"Use Pascal's rule to find $\binom{6}{3}$ from row $5$: $1, 5, 10, 10, 5, 1$.", [r"$\binom63=\binom52+\binom53$.", r"$=10+10$.", r"$=20$."], r"$20$"),
    [(r"What is the sum $\binom70+\binom71+\dots+\binom77$?", [r"$128$", r"$64$", r"$49$", r"$256$"], r"Each row sums to $2^n$: $2^7=128$."),
     (r"$\binom{9}{4}+\binom{9}{5}=$", [r"$\binom{10}{5}$", r"$\binom{18}{9}$", r"$\binom{10}{4}$", r"$\binom{9}{9}$"], r"Pascal's rule with $n=10$, $k=5$.")]),
  T("Binomial theorem", r"""
$(a+b)^n=\sum_{k=0}^{n}\binom nk a^{n-k}b^k$. The coefficients are row $n$ of Pascal's triangle.

To find one particular term, pick the right $k$: the term with $b^k$ is $\binom nk a^{n-k}b^k$.

Plugging in numbers gives identities: $a=b=1$ shows the row sums to $2^n$.""",
    (r"Find the coefficient of $x^2$ in $(2x+3)^5$.", [r"The $x^2$ term uses $(2x)^2$ and $3^3$: $\binom52(2x)^2\,3^3$.", r"$=10\cdot4x^2\cdot27$.", r"Coefficient $1080$."], r"$1080$"),
    [(r"What is the coefficient of $x^3$ in $(x+1)^6$?", [r"$20$", r"$15$", r"$6$", r"$18$"], r"$\binom63=20$."),
     (r"What is the constant term of $\left(x+\frac1x\right)^4$?", [r"$6$", r"$4$", r"$1$", r"$0$"], r"Need equal numbers of $x$ and $\frac1x$: $\binom42=6$.")]),
  T("Geometric probability", r"""
When a point is chosen **uniformly** from a region, probability $=\dfrac{\text{favourable length/area}}{\text{total length/area}}$.

Two random numbers in $[0,1]$ are a random point in the unit square, so "$x+y<1$" is a triangle of area $\frac12$.

Draw the region. Most of these problems are just area computations.""",
    (r"Two numbers are chosen at random in $[0,2]$. What is the probability they differ by less than $1$?", [r"Points $(x,y)$ in a $2\times2$ square, area $4$.", r"$|x-y|\ge1$ is two corner triangles, each with legs $1$: total area $1$.", r"So $P=\frac{4-1}{4}=\frac34$."], r"$\frac34$"),
    [(r"A point is chosen in a square of side $2$. Probability it's within $1$ of the centre?", [r"$\frac\pi4$", r"$\frac12$", r"$\frac{\pi}{2}$", r"$\frac14$"], r"Circle area $\pi$ over square area $4$."),
     (r"A stick of length $1$ is broken at a random point. Probability the longer piece is more than $\frac34$?", [r"$\frac12$", r"$\frac14$", r"$\frac34$", r"$\frac13$"], r"The break must be within $\frac14$ of an end: total length $\frac12$.")]),
 ],
 [
  T("Casework", r"""
Split a problem into **cases that don't overlap and together cover everything**, count each case, then add.

Choose the split that makes each case easy: by the first digit, by how many of something there are, by which item is largest.

Check you haven't double-counted: each object must land in exactly one case.""",
    (r"How many $3$-digit numbers have digits adding to $5$?", [r"Case on the first digit $a\ge1$; the other two digits add to $5-a$.", r"Two digits adding to $s$: $s+1$ ways. $a=1$: $5$; $a=2$: $4$; $a=3$: $3$; $a=4$: $2$; $a=5$: $1$.", r"Total $5+4+3+2+1=15$."], r"$15$"),
    [(r"How many integers from $1$ to $100$ have exactly one digit $7$?", [r"$18$", r"$19$", r"$20$", r"$10$"], r"Units $7$ with tens $\ne7$: $9$ ($7,17,\dots,97$ except $77$). Tens $7$ with units $\ne7$: $9$. Total $18$."),
     (r"How many triangles with integer sides have perimeter $9$?", [r"$3$", r"$2$", r"$4$", r"$5$"], r"Largest side $c<4.5$: $(1,4,4), (2,3,4), (3,3,3)$.")]),
  T("Recursion", r"""
Count a size-$n$ problem using answers for smaller sizes. Look at the **first or last step** and see what's left.

Tiling a $1\times n$ strip with $1\times1$ and $1\times2$ tiles: the first tile leaves a strip of $n-1$ or $n-2$, so $a_n=a_{n-1}+a_{n-2}$, the Fibonacci numbers.

Compute small cases by hand, then use the recursion to climb.""",
    (r"How many ways can you climb $6$ stairs taking $1$ or $2$ steps at a time?", [r"$a_n=a_{n-1}+a_{n-2}$ (your first move is $1$ or $2$ steps).", r"$a_1=1$, $a_2=2$, $a_3=3$, $a_4=5$, $a_5=8$.", r"$a_6=13$."], r"$13$"),
    [(r"How many binary strings of length $5$ have no two consecutive $1$s?", [r"$13$", r"$8$", r"$16$", r"$21$"], r"$a_1=2$, $a_2=3$, then Fibonacci: $5, 8, 13$."),
     (r"$a_1=1$ and $a_n=2a_{n-1}+1$. What is $a_5$?", [r"$31$", r"$15$", r"$32$", r"$63$"], r"$1,3,7,15,31$; in general $2^n-1$.")]),
  T("Symmetry", r"""
If the situation looks the same from two points of view, the answers are equal. Use that instead of counting.

"Is $A$ before $B$ in a random order?" By symmetry, exactly half of all orders: $\frac12$.

Symmetry also halves work: the number of $5$-card hands with more red cards than black equals the number with more black than red.""",
    (r"$4$ people are lined up randomly. What is the probability Ana is somewhere left of Ben?", [r"Swapping Ana and Ben turns every 'left' order into a 'right' order.", r"So the two kinds of order are equally common.", r"Probability $\frac12$."], r"$\frac12$"),
    [(r"A fair coin is flipped $7$ times. Probability of more heads than tails?", [r"$\frac12$", r"$\frac{7}{16}$", r"$\frac{35}{128}$", r"$\frac38$"], r"With an odd number of flips there are no ties, and heads/tails are symmetric."),
     (r"Three dice are rolled. Probability the first is the strictly largest?", [r"$\frac{55}{216}$", r"$\frac13$", r"$\frac16$", r"$\frac12$"], r"If the first die shows $v$, each other die has $v-1$ smaller values: $\sum_{v=1}^{6}(v-1)^2=0+1+4+9+16+25=55$ outcomes. It's a bit less than $\frac13$ because ties happen.")]),
 ],
]

# ======================================================================= GEOMETRY
L["geometry"] = [
 [
  T("Angle facts", r"""
Angles on a straight line add to $180^\circ$; angles around a point add to $360^\circ$; vertically opposite angles are equal.

The angles of a triangle add to $180^\circ$. An **exterior angle** of a triangle equals the sum of the two interior angles not next to it.

In an isosceles triangle the base angles are equal.""",
    (r"An isosceles triangle has a top (apex) angle of $40^\circ$. What are its base angles?", [r"The angles add to $180^\circ$, so the base angles total $140^\circ$.", r"They're equal.", r"Each is $70^\circ$."], r"$70^\circ$"),
    [(r"Two angles of a triangle are $35^\circ$ and $75^\circ$. What is the exterior angle at the third vertex?", [r"$110^\circ$", r"$70^\circ$", r"$105^\circ$", r"$145^\circ$"], r"The exterior angle equals the sum of the two remote angles: $35+75$."),
     (r"Three angles around a point are $x$, $2x$ and $3x$. What is $x$?", [r"$60^\circ$", r"$30^\circ$", r"$36^\circ$", r"$90^\circ$"], r"$6x=360^\circ$.")]),
  T("Parallel lines", r"""
When a line crosses two **parallel** lines, it makes equal angles in matching positions:
- **corresponding** angles (an "F" shape) are equal,
- **alternate** angles (a "Z" shape) are equal,
- **co-interior** angles (a "C" shape) add to $180^\circ$.

These let you move an angle from one place to another, which is the heart of angle chasing.""",
    (r"Lines $\ell\parallel m$ are cut by a transversal. One co-interior angle is $3x+10$ and the other is $2x+20$. Find $x$.", [r"Co-interior angles add to $180^\circ$: $5x+30=180$.", r"$5x=150$.", r"$x=30$, giving angles $100^\circ$ and $80^\circ$."], r"$x=30$"),
    [(r"Alternate angles are $4x-20$ and $2x+30$. What is $x$?", [r"$25$", r"$15$", r"$35$", r"$5$"], r"Alternate angles are equal: $4x-20=2x+30$, so $x=25$."),
     (r"A transversal makes a $65^\circ$ angle with one of two parallel lines. Which angles appear where it crosses the other line?", [r"$65^\circ$ and $115^\circ$", r"$65^\circ$ only", r"$25^\circ$ and $155^\circ$", r"$65^\circ$ and $25^\circ$"], r"Corresponding angles copy the $65^\circ$, and the angles next to it on the line are $180^\circ-65^\circ=115^\circ$.")]),
  T("Triangle area", r"""
Area $=\frac12\times\text{base}\times\text{height}$, where the height is perpendicular to the base (it may fall outside the triangle).

Any side can be the base: $\frac12 a\,h_a=\frac12 b\,h_b$. Use this to find a height you don't know.

With two sides and the angle between them: area $=\frac12ab\sin C$.""",
    (r"A right triangle has legs $6$ and $8$. Find the height to the hypotenuse.", [r"Area $=\frac12\cdot6\cdot8=24$; the hypotenuse is $10$.", r"Using the hypotenuse as base: $\frac12\cdot10\cdot h=24$.", r"$h=4.8$."], r"$4.8$"),
    [(r"Find the area of the triangle with vertices $(0,0)$, $(6,0)$ and $(2,5)$.", [r"$15$", r"$30$", r"$12$", r"$10$"], r"Base $6$ along the $x$-axis, height $5$: $\frac12\cdot6\cdot5=15$."),
     (r"Two sides are $8$ and $10$ with a $30^\circ$ angle between them. Area?", [r"$20$", r"$40$", r"$80$", r"$20\sqrt3$"], r"$\frac12\cdot8\cdot10\cdot\sin30^\circ=40\cdot\frac12$.")]),
 ],
 [
  T("Pythagorean triples", r"""
Integer right triangles show up everywhere. The basic ones: $3$-$4$-$5$, $5$-$12$-$13$, $8$-$15$-$17$, $7$-$24$-$25$, $20$-$21$-$29$.

Any multiple works too: $6$-$8$-$10$, $15$-$20$-$25$, $10$-$24$-$26$.

Spot them by dividing out common factors: $27$-$36$-$?$ is $9\times(3$-$4$-$5)$, so the hypotenuse is $45$.""",
    (r"A right triangle has legs $20$ and $48$. Find the hypotenuse.", [r"Both are multiples of $4$: $4\times(5, 12)$.", r"$5$-$12$-$13$ scaled by $4$.", r"Hypotenuse $52$."], r"$52$"),
    [(r"Legs $16$ and $30$. Hypotenuse?", [r"$34$", r"$46$", r"$32$", r"$36$"], r"$2\times(8$-$15$-$17)$."),
     (r"Hypotenuse $50$, one leg $14$. Other leg?", [r"$48$", r"$36$", r"$40$", r"$44$"], r"$2\times(7$-$24$-$25)$.")]),
  T("Special triangles", r"""
Two right triangles have fixed side ratios:
- **$45$-$45$-$90$**: sides $1 : 1 : \sqrt2$ (half a square).
- **$30$-$60$-$90$**: sides $1 : \sqrt3 : 2$ (half an equilateral triangle). The short leg is opposite $30^\circ$.

An equilateral triangle of side $s$ has height $\frac{\sqrt3}{2}s$ and area $\frac{\sqrt3}{4}s^2$.""",
    (r"Find the area of an equilateral triangle with side $6$.", [r"Its height splits it into two $30$-$60$-$90$ triangles with short leg $3$.", r"Height $=3\sqrt3$.", r"Area $=\frac12\cdot6\cdot3\sqrt3=9\sqrt3$."], r"$9\sqrt3$"),
    [(r"A square has diagonal $10$. What is its side?", [r"$5\sqrt2$", r"$10\sqrt2$", r"$5$", r"$\frac{10}{3}$"], r"Side $\cdot\sqrt2=10$, so side $=\frac{10}{\sqrt2}=5\sqrt2$."),
     (r"In a $30$-$60$-$90$ triangle the hypotenuse is $14$. Longer leg?", [r"$7\sqrt3$", r"$7$", r"$14\sqrt3$", r"$7\sqrt2$"], r"Short leg $7$, long leg $7\sqrt3$.")]),
  T("Similarity", r"""
Triangles are **similar** if their angles match; then all sides are in the same ratio $k$.

Two equal angles are enough (**AA**). Parallel lines create similar triangles all the time.

If lengths scale by $k$, **areas scale by $k^2$** and volumes by $k^3$.""",
    (r"In triangle $ABC$, $DE\parallel BC$ with $D$ on $AB$, $E$ on $AC$, $AD=3$, $DB=6$, and $BC=12$. Find $DE$.", [r"$DE\parallel BC$ makes triangle $ADE$ similar to $ABC$.", r"Ratio $\frac{AD}{AB}=\frac{3}{9}=\frac13$.", r"$DE=\frac13\cdot12=4$."], r"$4$"),
    [(r"Two similar triangles have sides in ratio $2:5$. The smaller has area $8$. Area of the larger?", [r"$50$", r"$20$", r"$125$", r"$40$"], r"Areas scale by $\left(\frac52\right)^2=\frac{25}{4}$: $8\cdot\frac{25}4=50$."),
     (r"A $2$ m pole casts a $3$ m shadow; a tree casts a $15$ m shadow at the same time. How tall is the tree?", [r"$10$ m", r"$22.5$ m", r"$12$ m", r"$9$ m"], r"Similar triangles: $\frac{h}{15}=\frac23$.")]),
 ],
 [
  T("Circle formulas", r"""
Circumference $=2\pi r$, area $=\pi r^2$.

A **sector** with angle $\theta$ is the fraction $\frac{\theta}{360^\circ}$ of the circle: arc length $\frac{\theta}{360}2\pi r$, area $\frac{\theta}{360}\pi r^2$.

Read carefully whether you're given the radius or the diameter.""",
    (r"Find the area of a $60^\circ$ sector of a circle with radius $6$.", [r"The sector is $\frac{60}{360}=\frac16$ of the circle.", r"Full area $=36\pi$.", r"Sector area $=6\pi$."], r"$6\pi$"),
    [(r"A circle has circumference $10\pi$. What is its area?", [r"$25\pi$", r"$100\pi$", r"$10\pi$", r"$5\pi$"], r"$2\pi r=10\pi$, so $r=5$."),
     (r"What is the arc length of a $90^\circ$ arc of a circle with radius $8$?", [r"$4\pi$", r"$16\pi$", r"$2\pi$", r"$8\pi$"], r"$\frac14\cdot16\pi=4\pi$.")]),
  T("Inscribed angles", r"""
An **inscribed angle** (vertex on the circle) is **half the central angle** on the same arc.

So all inscribed angles on the same arc are equal, and an angle inscribed in a semicircle is $90^\circ$ (Thales).

In a **cyclic quadrilateral** (all four vertices on a circle), opposite angles add to $180^\circ$.""",
    (r"Points $A$, $B$, $C$ lie on a circle with centre $O$ and $\angle AOB=110^\circ$. Find $\angle ACB$ ($C$ on the major arc).", [r"$\angle ACB$ is inscribed on the same arc $AB$ as the central angle.", r"Inscribed $=\frac12$ central.", r"$\angle ACB=55^\circ$."], r"$55^\circ$"),
    [(r"$ABCD$ is cyclic with $\angle A=75^\circ$. What is $\angle C$?", [r"$105^\circ$", r"$75^\circ$", r"$150^\circ$", r"$37.5^\circ$"], r"Opposite angles of a cyclic quadrilateral add to $180^\circ$."),
     (r"$AB$ is a diameter and $C$ is on the circle with $AC=6$, $BC=8$. What is the radius?", [r"$5$", r"$10$", r"$7$", r"$14$"], r"$\angle C=90^\circ$, so $AB=10$ and the radius is $5$.")]),
  T("Polygon angles", r"""
The interior angles of an $n$-gon add to $(n-2)\cdot180^\circ$ (it splits into $n-2$ triangles).

The **exterior** angles of any convex polygon add to $360^\circ$. In a regular $n$-gon each exterior angle is $\frac{360^\circ}{n}$ and each interior angle is $180^\circ-\frac{360^\circ}{n}$.

Working with exterior angles is usually faster.""",
    (r"Each interior angle of a regular polygon is $150^\circ$. How many sides does it have?", [r"Each exterior angle is $180^\circ-150^\circ=30^\circ$.", r"Exterior angles add to $360^\circ$.", r"$n=\frac{360}{30}=12$."], r"$12$"),
    [(r"What is the sum of the interior angles of a hexagon?", [r"$720^\circ$", r"$540^\circ$", r"$1080^\circ$", r"$360^\circ$"], r"$(6-2)\cdot180^\circ$."),
     (r"What is each interior angle of a regular octagon?", [r"$135^\circ$", r"$120^\circ$", r"$140^\circ$", r"$45^\circ$"], r"Exterior $45^\circ$, interior $180^\circ-45^\circ$.")]),
 ],
 [
  T("Heron's formula", r"""
If you know all three sides $a, b, c$, let $s=\frac{a+b+c}{2}$ (the semi-perimeter). Then
$$\text{Area}=\sqrt{s(s-a)(s-b)(s-c)}.$$

The classic example: the $13$-$14$-$15$ triangle has $s=21$ and area $\sqrt{21\cdot8\cdot7\cdot6}=84$.

Also useful: area $=rs$, where $r$ is the radius of the inscribed circle.""",
    (r"Find the area of the triangle with sides $5$, $5$ and $6$.", [r"$s=8$.", r"Area $=\sqrt{8\cdot3\cdot3\cdot2}=\sqrt{144}$.", r"$=12$. (Check: height to the base $6$ is $4$, and $\frac12\cdot6\cdot4=12$.)"], r"$12$"),
    [(r"What is the area of a triangle with sides $13$, $14$, $15$?", [r"$84$", r"$90$", r"$42$", r"$105$"], r"$\sqrt{21\cdot8\cdot7\cdot6}=\sqrt{7056}=84$."),
     (r"A triangle has area $84$ and perimeter $42$. What is its inradius?", [r"$4$", r"$2$", r"$6$", r"$8$"], r"Area $=rs$ with $s=21$: $r=4$.")]),
  T("Power of a point", r"""
For a point $P$ and a circle, draw any line through $P$ meeting the circle at $A$ and $B$. The product $PA\cdot PB$ is **the same for every line**.

So two chords crossing at $P$ give $PA\cdot PB=PC\cdot PD$; two secants from outside give the same; and a tangent of length $t$ gives $t^2=PA\cdot PB$.

It turns circle problems into simple equations.""",
    (r"Two chords cross at $P$. One is cut into $4$ and $6$; the other into $3$ and $x$. Find $x$.", [r"Power of a point: $4\cdot6=3\cdot x$.", r"$24=3x$.", r"$x=8$."], r"$8$"),
    [(r"From $P$, a tangent has length $6$, and a secant meets the circle at distances $4$ and $x$ from $P$. Find $x$.", [r"$9$", r"$8$", r"$12$", r"$2$"], r"$6^2=4x$."),
     (r"$P$ is $13$ from the centre of a circle of radius $5$. Tangent length?", [r"$12$", r"$8$", r"$\sqrt{194}$", r"$18$"], r"The tangent is perpendicular to the radius: $\sqrt{13^2-5^2}$.")]),
  T("Volumes", r"""
**Prism or cylinder**: base area $\times$ height (cylinder $\pi r^2h$).
**Pyramid or cone**: $\frac13\times$ base area $\times$ height (cone $\frac13\pi r^2h$).
**Sphere**: $V=\frac43\pi r^3$, surface area $4\pi r^2$.

The $\frac13$ for pointed shapes is the one to remember: a cone holds a third of the cylinder around it.""",
    (r"A cone has radius $3$ and slant height $5$. Find its volume.", [r"Height from Pythagoras: $\sqrt{5^2-3^2}=4$.", r"$V=\frac13\pi\cdot3^2\cdot4$.", r"$=12\pi$."], r"$12\pi$"),
    [(r"What is the volume of a sphere with radius $3$?", [r"$36\pi$", r"$108\pi$", r"$12\pi$", r"$27\pi$"], r"$\frac43\pi\cdot27=36\pi$."),
     (r"A cube has surface area $54$. What is its volume?", [r"$27$", r"$9$", r"$81$", r"$54$"], r"$6s^2=54$ gives $s=3$, volume $27$.")]),
 ],
 [
  T("Coordinates", r"""
Put the figure on axes to turn geometry into algebra.
- Distance: $\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$.
- Midpoint: $\left(\frac{x_1+x_2}2,\frac{y_1+y_2}2\right)$.
- Circle centre $(h,k)$, radius $r$: $(x-h)^2+(y-k)^2=r^2$.

Place things cleverly: a vertex at the origin, a side along an axis.""",
    (r"Find the distance from $(1,2)$ to $(7,10)$.", [r"Differences: $6$ and $8$.", r"$\sqrt{36+64}=\sqrt{100}$.", r"$10$."], r"$10$"),
    [(r"What is the midpoint of $(-3,5)$ and $(7,-1)$?", [r"$(2,2)$", r"$(5,3)$", r"$(4,4)$", r"$(2,3)$"], r"$\left(\frac{4}{2},\frac{4}{2}\right)$."),
     (r"What is the radius of $x^2+y^2-6x+8y=0$?", [r"$5$", r"$25$", r"$\sqrt{14}$", r"$10$"], r"Complete the squares: $(x-3)^2+(y+4)^2=25$.")]),
  T("Draw it well", r"""
A careful diagram is half the solution. Draw it **large** and roughly **to scale**, and label everything you know.

Mark equal lengths and equal angles; add the obvious helpful lines: radii to tangent points, the height of a triangle, a diagonal that makes right triangles.

But don't trust the picture for facts. Two lines that *look* perpendicular still need a reason.""",
    (r"A circle of radius $5$ has a chord of length $8$. How far is the chord from the centre?", [r"Draw the radius to an end of the chord and the perpendicular from the centre to the chord.", r"The perpendicular bisects the chord: a right triangle with hypotenuse $5$ and leg $4$.", r"Distance $=3$."], r"$3$"),
    [(r"A tangent touches a circle of radius $6$ at $T$; $P$ is on the tangent with $PT=8$. How far is $P$ from the centre?", [r"$10$", r"$14$", r"$2\sqrt7$", r"$12$"], r"Radius $\perp$ tangent: $\sqrt{36+64}=10$."),
     (r"A rhombus has diagonals $10$ and $24$. What is its side?", [r"$13$", r"$17$", r"$26$", r"$12$"], r"Diagonals bisect at right angles: legs $5$ and $12$.")]),
  T("Area ratios", r"""
Triangles with the **same height** have areas in the ratio of their bases. So a line from a vertex to the opposite side splits the area in the same ratio as it splits the side.

Triangles with the same base have areas in the ratio of their heights.

A median (to the midpoint) splits a triangle into two equal areas.""",
    (r"In triangle $ABC$ (area $30$), $D$ is on $BC$ with $BD:DC=2:3$. Find the area of $ABD$.", [r"$ABD$ and $ADC$ share the height from $A$.", r"So their areas are in the ratio $2:3$.", r"$ABD=\frac25\cdot30=12$."], r"$12$"),
    [(r"$M$ is the midpoint of $BC$ and triangle $ABC$ has area $18$. Area of $ABM$?", [r"$9$", r"$6$", r"$12$", r"$4.5$"], r"A median halves the area."),
     (r"In a triangle, the three medians create $6$ small triangles. If the whole has area $24$, each small one has area:", [r"$4$", r"$6$", r"$3$", r"$8$"], r"The six triangles formed by the medians all have equal area.")]),
 ],
]

# ======================================================================= INTERMEDIATE ALGEBRA
L["intermediate_algebra"] = [
 [
  T("Remainder theorem", r"""
The remainder when $p(x)$ is divided by $x-a$ is simply $p(a)$.

So $x-a$ is a **factor** exactly when $p(a)=0$ (the factor theorem).

For a quadratic divisor like $x^2-1$, the remainder is linear, $rx+s$; find $r$ and $s$ by plugging in the roots $x=1$ and $x=-1$.""",
    (r"Find the remainder when $p(x)=x^3-4x^2+2x+5$ is divided by $x-3$.", [r"By the remainder theorem it's $p(3)$.", r"$27-36+6+5$.", r"$=2$."], r"$2$"),
    [(r"For which $k$ is $x-2$ a factor of $x^3+kx-6$?", [r"$-1$", r"$1$", r"$3$", r"$-7$"], r"$8+2k-6=0$ gives $k=-1$."),
     (r"What is the remainder when $x^{100}$ is divided by $x+1$?", [r"$1$", r"$-1$", r"$0$", r"$100$"], r"$(-1)^{100}=1$.")]),
  T("Vieta for cubics", r"""
For $x^3+bx^2+cx+d$ with roots $r, s, t$:
$$r+s+t=-b,\quad rs+st+tr=c,\quad rst=-d.$$
(Divide through by the leading coefficient first.)

Signs alternate: minus, plus, minus. Use these to compute symmetric expressions without finding the roots.""",
    (r"The roots of $x^3-6x^2+11x-6$ are $r,s,t$. Find $\frac1r+\frac1s+\frac1t$.", [r"$\frac1r+\frac1s+\frac1t=\frac{rs+st+tr}{rst}$.", r"$rs+st+tr=11$ and $rst=6$.", r"$\frac{11}{6}$."], r"$\frac{11}{6}$"),
    [(r"What is the product of the roots of $2x^3-5x^2+x+8$?", [r"$-4$", r"$4$", r"$8$", r"$\frac52$"], r"Divide by $2$: $d=4$, so $rst=-4$."),
     (r"If $r,s,t$ are the roots of $x^3-3x^2+x-1$, find $r^2+s^2+t^2$.", [r"$7$", r"$9$", r"$11$", r"$8$"], r"$(r+s+t)^2-2(rs+st+tr)=9-2$.")]),
  T("Paired roots", r"""
If a polynomial has **real coefficients**, complex roots come in **conjugate pairs**: if $2+3i$ is a root, so is $2-3i$.

If it has **rational coefficients**, irrational roots like $1+\sqrt2$ come with their partner $1-\sqrt2$.

Each pair multiplies to a nice quadratic: $(x-(a+bi))(x-(a-bi))=x^2-2ax+a^2+b^2$.""",
    (r"A cubic with real coefficients has roots $2$ and $1+i$. Find it (leading coefficient $1$).", [r"The third root is $1-i$.", r"$(x-(1+i))(x-(1-i))=x^2-2x+2$.", r"Multiply by $x-2$: $x^3-4x^2+6x-4$."], r"$x^3-4x^2+6x-4$"),
    [(r"A polynomial with rational coefficients has root $3-\sqrt5$. Which must also be a root?", [r"$3+\sqrt5$", r"$-3+\sqrt5$", r"$\sqrt5-3$", r"$5-\sqrt3$"], r"Rational coefficients pair $a-\sqrt b$ with $a+\sqrt b$."),
     (r"What quadratic has roots $1\pm\sqrt3$?", [r"$x^2-2x-2$", r"$x^2+2x-2$", r"$x^2-2x+4$", r"$x^2-2x-3$"], r"Sum $2$, product $1-3=-2$.")]),
 ],
 [
  T("AM–GM", r"""
For non-negative numbers, the arithmetic mean is at least the geometric mean: $\dfrac{a+b}{2}\ge\sqrt{ab}$, with equality exactly when $a=b$.

It gives **minimums of sums** when the product is fixed, and **maximums of products** when the sum is fixed.

Example: $x+\frac1x\ge2$ for $x>0$, with equality at $x=1$.""",
    (r"For $x>0$, find the minimum of $4x+\frac9x$.", [r"AM–GM: $4x+\frac9x\ge2\sqrt{4x\cdot\frac9x}=2\sqrt{36}$.", r"$=12$.", r"Equality when $4x=\frac9x$, i.e. $x=\frac32$. Minimum $12$."], r"$12$"),
    [(r"Two positive numbers add to $10$. What is their largest possible product?", [r"$25$", r"$24$", r"$50$", r"$100$"], r"The product is largest when they're equal: $5\cdot5$."),
     (r"A rectangle has area $36$. Smallest possible perimeter?", [r"$24$", r"$36$", r"$20$", r"$26$"], r"Perimeter $2(l+w)\ge4\sqrt{lw}=24$, at the $6\times6$ square.")]),
  T("Log rules", r"""
$\log_b x=y$ means $b^y=x$. The rules mirror the exponent rules:
$$\log(xy)=\log x+\log y,\quad \log\frac xy=\log x-\log y,\quad \log x^k=k\log x.$$

Change of base: $\log_b x=\dfrac{\log x}{\log b}$ in any base you like.

Also $\log_b b=1$ and $\log_b1=0$.""",
    (r"Simplify $\log_2 24-\log_2 3$.", [r"Subtracting logs divides: $\log_2\frac{24}{3}$.", r"$=\log_2 8$.", r"$=3$."], r"$3$"),
    [(r"What is $\log_3 81$?", [r"$4$", r"$27$", r"$3$", r"$\frac{81}{3}$"], r"$3^4=81$."),
     (r"What is $\log_4 8$?", [r"$\frac32$", r"$2$", r"$\frac23$", r"$\frac12$"], r"$\frac{\log_2 8}{\log_2 4}=\frac32$.")]),
  T("Geometric series", r"""
A **geometric sequence** multiplies by the same ratio $r$ each time: $a, ar, ar^2,\dots$

The sum of $n$ terms is $a\dfrac{r^n-1}{r-1}$. If $|r|<1$, the infinite sum is $\dfrac{a}{1-r}$.

The trick behind it: multiply the sum by $r$ and subtract; almost everything cancels.""",
    (r"Find $1+\frac13+\frac19+\frac1{27}+\cdots$.", [r"First term $a=1$, ratio $r=\frac13$.", r"$|r|<1$, so the sum is $\frac{1}{1-\frac13}$.", r"$=\frac32$."], r"$\frac32$"),
    [(r"What is $1+2+4+\dots+2^{9}$?", [r"$1023$", r"$1024$", r"$512$", r"$2047$"], r"$\frac{2^{10}-1}{2-1}=1023$."),
     (r"Write $0.\overline{36}$ as a fraction.", [r"$\frac{4}{11}$", r"$\frac{36}{100}$", r"$\frac{9}{25}$", r"$\frac{36}{90}$"], r"$\frac{36}{100}+\frac{36}{100^2}+\dots=\frac{36/100}{1-1/100}=\frac{36}{99}=\frac4{11}$.")]),
 ],
 [
  T("Complex numbers", r"""
$i$ is defined by $i^2=-1$. Complex numbers $a+bi$ add and multiply like algebra, replacing $i^2$ by $-1$.

The **conjugate** of $z=a+bi$ is $\bar z=a-bi$, and $z\bar z=a^2+b^2=|z|^2$. To divide, multiply top and bottom by the conjugate of the bottom.

Powers of $i$ cycle: $i, -1, -i, 1$.""",
    (r"Compute $\dfrac{3+i}{1-i}$.", [r"Multiply top and bottom by $1+i$.", r"Top: $(3+i)(1+i)=3+3i+i+i^2=2+4i$. Bottom: $1+1=2$.", r"$1+2i$."], r"$1+2i$"),
    [(r"What is $(2+3i)(2-3i)$?", [r"$13$", r"$-5$", r"$4-9i$", r"$5$"], r"$4-9i^2=4+9$."),
     (r"What is $i^{2027}$?", [r"$-i$", r"$i$", r"$1$", r"$-1$"], r"$2027=4\cdot506+3$, so $i^3=-i$.")]),
  T("Conics", r"""
The four conics and their standard forms:
- **Circle** $(x-h)^2+(y-k)^2=r^2$.
- **Parabola** $y=a(x-h)^2+k$.
- **Ellipse** $\frac{x^2}{a^2}+\frac{y^2}{b^2}=1$ (semi-axes $a$ and $b$).
- **Hyperbola** $\frac{x^2}{a^2}-\frac{y^2}{b^2}=1$.

To identify one, complete the squares.""",
    (r"What shape is $x^2+4y^2-2x-16y+13=0$?", [r"Complete squares: $(x-1)^2-1+4(y-2)^2-16+13=0$.", r"$(x-1)^2+4(y-2)^2=4$, i.e. $\frac{(x-1)^2}{4}+\frac{(y-2)^2}{1}=1$.", r"An ellipse centred at $(1,2)$ with semi-axes $2$ and $1$."], r"An ellipse"),
    [(r"What is the area of the ellipse $\frac{x^2}{9}+\frac{y^2}{4}=1$?", [r"$6\pi$", r"$36\pi$", r"$13\pi$", r"$9\pi$"], r"An ellipse's area is $\pi ab=\pi\cdot3\cdot2$."),
     (r"Which equation is a hyperbola?", [r"$x^2-y^2=1$", r"$x^2+y^2=1$", r"$y=x^2$", r"$2x^2+y^2=1$"], r"The squares have opposite signs.")]),
  T("Telescoping", r"""
A sum **telescopes** when each term splits into a difference $f(k)-f(k+1)$: consecutive pieces cancel, leaving only the first and last.

The classic: $\frac{1}{k(k+1)}=\frac1k-\frac1{k+1}$.

So $\sum_{k=1}^{n}\frac1{k(k+1)}=1-\frac1{n+1}$. Look for partial fractions whenever the denominator factors.""",
    (r"Find $\dfrac1{1\cdot2}+\dfrac1{2\cdot3}+\dots+\dfrac1{9\cdot10}$.", [r"Write each term as $\frac1k-\frac1{k+1}$.", r"$\left(1-\frac12\right)+\left(\frac12-\frac13\right)+\dots+\left(\frac19-\frac1{10}\right)$.", r"Everything cancels except $1-\frac1{10}=\frac9{10}$."], r"$\frac{9}{10}$"),
    [(r"What is $\sum_{k=1}^{\infty}\frac{1}{k(k+1)}$?", [r"$1$", r"$\infty$", r"$\frac12$", r"$2$"], r"$1-\frac1{n+1}\to1$."),
     (r"What is $\log\frac21+\log\frac32+\dots+\log\frac{100}{99}$ (base $10$)?", [r"$2$", r"$1$", r"$99$", r"$100$"], r"The product telescopes to $\frac{100}{1}$, and $\log100=2$.")]),
 ],
 [
  T("Special values", r"""
To solve a **functional equation**, plug in values that make things collapse: $x=0$, $y=0$, $x=y$, $y=-x$, $x=1$.

Each substitution gives a new fact; combine them.

Example: if $f(x+y)=f(x)+f(y)$, then $x=y=0$ gives $f(0)=2f(0)$, so $f(0)=0$.""",
    (r"$f(x)+2f(1-x)=3x$ for all $x$. Find $f(0)$.", [r"$x=0$: $f(0)+2f(1)=0$.", r"$x=1$: $f(1)+2f(0)=3$.", r"From the first, $f(0)=-2f(1)$; then $f(1)-4f(1)=3$, so $f(1)=-1$ and $f(0)=2$."], r"$2$"),
    [(r"If $f(xy)=f(x)+f(y)$ for all positive $x,y$, what is $f(1)$?", [r"$0$", r"$1$", r"$-1$", r"Can't tell"], r"$x=y=1$: $f(1)=2f(1)$."),
     (r"If $f(x)+f(-x)=x^2$ for all $x$, what is $f(0)$?", [r"$0$", r"$1$", r"$\frac12$", r"Can't tell"], r"$x=0$: $2f(0)=0$.")]),
  T("Cauchy–Schwarz", r"""
For real numbers, $(a_1b_1+\dots+a_nb_n)^2\le(a_1^2+\dots+a_n^2)(b_1^2+\dots+b_n^2)$, with equality when the $a$'s and $b$'s are proportional.

It bounds a **linear** expression given a sum of **squares**: if $x^2+y^2=1$, then $3x+4y\le\sqrt{(9+16)(x^2+y^2)}=5$.

A handy form (Titu/Engel): $\frac{a^2}{x}+\frac{b^2}{y}\ge\frac{(a+b)^2}{x+y}$.""",
    (r"If $x^2+y^2+z^2=9$, find the maximum of $x+2y+2z$.", [r"Cauchy–Schwarz: $(x+2y+2z)^2\le(1+4+4)(x^2+y^2+z^2)=9\cdot9$.", r"So $x+2y+2z\le9$.", r"Equality at $(x,y,z)=(1,2,2)$, which has $1+4+4=9$. ✓"], r"$9$"),
    [(r"If $a^2+b^2=4$, what is the largest value of $a+b$?", [r"$2\sqrt2$", r"$4$", r"$2$", r"$\sqrt2$"], r"$(a+b)^2\le2(a^2+b^2)=8$."),
     (r"For positive $x,y$ with $x+y=1$, the minimum of $\frac1x+\frac1y$ is:", [r"$4$", r"$2$", r"$1$", r"$\frac12$"], r"Titu: $\frac{1^2}{x}+\frac{1^2}{y}\ge\frac{(1+1)^2}{x+y}=4$.")]),
  T("Floor", r"""
$\lfloor x\rfloor$ is the greatest integer $\le x$: $\lfloor3.7\rfloor=3$, $\lfloor-1.2\rfloor=-2$.

Write $x=n+f$ with $n=\lfloor x\rfloor$ an integer and $0\le f<1$ the fractional part. Many floor equations become simple once you do this.

To count multiples: the number of multiples of $k$ up to $N$ is $\lfloor N/k\rfloor$.""",
    (r"Solve $x+\lfloor x\rfloor=8.3$.", [r"Write $x=n+f$ with $n$ an integer and $0\le f<1$: then $2n+f=8.3$.", r"$f=8.3-2n$ must lie in $[0,1)$, so $2n$ is an even integer in $(7.3,8.3]$: $2n=8$.", r"$n=4$, $f=0.3$, so $x=4.3$. Check: $4.3+4=8.3$. ✓"], r"$x=4.3$"),
    [(r"What is $\lfloor\sqrt{50}\rfloor$?", [r"$7$", r"$8$", r"$6$", r"$25$"], r"$49\le50<64$."),
     (r"How many multiples of $7$ are there from $1$ to $100$?", [r"$14$", r"$15$", r"$13$", r"$7$"], r"$\lfloor100/7\rfloor=14$.")]),
 ],
 [
  T("Symmetric sums", r"""
An expression is **symmetric** if swapping variables doesn't change it, like $a^2+b^2$ or $a^3+b^3$.

Every symmetric expression in $a, b$ can be written using $s=a+b$ and $p=ab$:
$a^2+b^2=s^2-2p$, $\ a^3+b^3=s^3-3sp$, $\ (a-b)^2=s^2-4p$.

Combine with Vieta: if $a,b$ are roots of a quadratic, you know $s$ and $p$ immediately.""",
    (r"If $a+b=5$ and $ab=2$, find $a^3+b^3$.", [r"$a^3+b^3=(a+b)^3-3ab(a+b)$.", r"$=125-3\cdot2\cdot5$.", r"$=95$."], r"$95$"),
    [(r"If $a+b=6$ and $ab=7$, what is $(a-b)^2$?", [r"$8$", r"$22$", r"$36$", r"$1$"], r"$s^2-4p=36-28$."),
     (r"If $a+b=3$ and $a^2+b^2=5$, what is $ab$?", [r"$2$", r"$4$", r"$1$", r"$-2$"], r"$5=9-2ab$.")]),
  T("Substitution", r"""
A good **substitution** turns a hard expression into a familiar one.

Repeated blocks: in $(x^2+x)^2-8(x^2+x)+12$, let $u=x^2+x$. Reciprocal pairs: $x+\frac1x=t$. Roots: let $u=\sqrt x$.

Always translate back at the end, and check for extra solutions you introduced (such as negative square roots).""",
    (r"Solve $(x^2+x)^2-8(x^2+x)+12=0$.", [r"Let $u=x^2+x$: $u^2-8u+12=0$, so $u=2$ or $u=6$.", r"$x^2+x=2$: $x=1$ or $-2$.", r"$x^2+x=6$: $x=2$ or $-3$."], r"$x=1,-2,2,-3$"),
    [(r"Solve $x-5\sqrt x+6=0$.", [r"$x=4$ or $9$", r"$x=2$ or $3$", r"$x=-2$ or $-3$", r"$x=6$"], r"$u=\sqrt x$: $u^2-5u+6=0$, $u=2,3$."),
     (r"How many real solutions does $4^x-5\cdot2^x+4=0$ have?", [r"$2$", r"$1$", r"$0$", r"$4$"], r"$u=2^x$: $u=1$ or $4$, giving $x=0$ or $2$.")]),
  T("Equality first", r"""
In an optimisation problem, **guess where the best value happens** before proving anything. It's usually when the variables are equal, or at an endpoint.

The guess tells you which inequality to use, and how to split terms so equality cases match.

Example: to minimise $x+\frac{4}{x}$, guess equality at $x=\frac4x$, so $x=2$, and the minimum is $4$.""",
    (r"For positive $a,b,c$ with $a+b+c=3$, what is the largest possible $abc$?", [r"Symmetric, so guess $a=b=c=1$: $abc=1$.", r"Prove it with AM–GM: $\frac{a+b+c}{3}\ge\sqrt[3]{abc}$, so $1\ge\sqrt[3]{abc}$.", r"Maximum $1$."], r"$1$"),
    [(r"For $x>0$, the minimum of $x+\frac{9}{x}$ is:", [r"$6$", r"$9$", r"$10$", r"$3$"], r"Equality at $x=3$: $3+3$."),
     (r"For $x$ in $[0,4]$, the maximum of $x(4-x)$ is:", [r"$4$", r"$16$", r"$2$", r"$8$"], r"Symmetric about $x=2$: $2\cdot2$.")]),
 ],
]

# ======================================================================= PRECALCULUS
L["precalculus"] = [
 [
  T("The unit circle", r"""
Put an angle $\theta$ at the centre of a circle of radius $1$, measured anticlockwise from the positive $x$-axis. The point where it lands is $(\cos\theta,\sin\theta)$.

So $\cos^2\theta+\sin^2\theta=1$ always, and $\tan\theta=\frac{\sin\theta}{\cos\theta}$ is the slope of that radius.

Signs by quadrant: all positive in I; only $\sin$ in II; only $\tan$ in III; only $\cos$ in IV.""",
    (r"If $\sin\theta=\frac35$ and $\theta$ is in quadrant II, find $\cos\theta$.", [r"$\cos^2\theta=1-\frac{9}{25}=\frac{16}{25}$.", r"So $\cos\theta=\pm\frac45$.", r"In quadrant II cosine is negative: $-\frac45$."], r"$-\frac45$"),
    [(r"If $\cos\theta=\frac{5}{13}$ in quadrant IV, what is $\tan\theta$?", [r"$-\frac{12}{5}$", r"$\frac{12}{5}$", r"$-\frac{5}{12}$", r"$\frac{12}{13}$"], r"$\sin\theta=-\frac{12}{13}$, so $\tan\theta=\frac{-12/13}{5/13}$."),
     (r"What is $\sin^2 40^\circ+\cos^2 40^\circ$?", [r"$1$", r"$0$", r"$\sin80^\circ$", r"$2$"], r"Pythagorean identity: it's always $1$.")]),
  T("Special angles", r"""
Know these exactly:
- $30^\circ$: $\sin=\frac12$, $\cos=\frac{\sqrt3}2$
- $45^\circ$: $\sin=\cos=\frac{\sqrt2}2$
- $60^\circ$: $\sin=\frac{\sqrt3}2$, $\cos=\frac12$

For other quadrants, use the **reference angle** (the acute angle to the $x$-axis) and fix the sign: $\sin150^\circ=\sin30^\circ=\frac12$, $\cos150^\circ=-\frac{\sqrt3}2$.""",
    (r"Find $\cos240^\circ$.", [r"$240^\circ$ is in quadrant III; its reference angle is $240^\circ-180^\circ=60^\circ$.", r"$\cos60^\circ=\frac12$.", r"Cosine is negative in quadrant III: $-\frac12$."], r"$-\frac12$"),
    [(r"What is $\tan60^\circ$?", [r"$\sqrt3$", r"$\frac{\sqrt3}{3}$", r"$1$", r"$\frac12$"], r"$\frac{\sqrt3/2}{1/2}=\sqrt3$."),
     (r"What is $\sin315^\circ$?", [r"$-\frac{\sqrt2}2$", r"$\frac{\sqrt2}2$", r"$-\frac12$", r"$\frac{\sqrt3}2$"], r"Reference angle $45^\circ$, quadrant IV: sine negative.")]),
  T("Radians", r"""
A **radian** is the angle that cuts off an arc equal to the radius. A full turn is $2\pi$ radians, so $180^\circ=\pi$.

Convert: multiply degrees by $\frac{\pi}{180}$; multiply radians by $\frac{180}{\pi}$. So $90^\circ=\frac\pi2$, $60^\circ=\frac\pi3$, $45^\circ=\frac\pi4$, $30^\circ=\frac\pi6$.

In radians, arc length is simply $r\theta$ and sector area $\frac12r^2\theta$.""",
    (r"A sector of a circle of radius $6$ has angle $\frac{2\pi}{3}$. Find its arc length and area.", [r"Arc length $=r\theta=6\cdot\frac{2\pi}{3}=4\pi$.", r"Area $=\frac12r^2\theta=\frac12\cdot36\cdot\frac{2\pi}3$.", r"$=12\pi$."], r"$4\pi$ and $12\pi$"),
    [(r"How many degrees is $\frac{5\pi}{6}$?", [r"$150^\circ$", r"$120^\circ$", r"$300^\circ$", r"$135^\circ$"], r"$\frac56\cdot180^\circ$."),
     (r"What is $\cos\frac{\pi}{3}$?", [r"$\frac12$", r"$\frac{\sqrt3}2$", r"$0$", r"$1$"], r"$\frac\pi3=60^\circ$.")]),
 ],
 [
  T("Addition formulas", r"""
$$\sin(a\pm b)=\sin a\cos b\pm\cos a\sin b,\qquad \cos(a\pm b)=\cos a\cos b\mp\sin a\sin b.$$
(Note the sign flips for cosine.)

They let you compute new exact values from known ones: $75^\circ=45^\circ+30^\circ$, $15^\circ=45^\circ-30^\circ$.""",
    (r"Find $\sin75^\circ$ exactly.", [r"$\sin(45^\circ+30^\circ)=\sin45\cos30+\cos45\sin30$.", r"$=\frac{\sqrt2}2\cdot\frac{\sqrt3}2+\frac{\sqrt2}2\cdot\frac12$.", r"$=\frac{\sqrt6+\sqrt2}{4}$."], r"$\frac{\sqrt6+\sqrt2}{4}$"),
    [(r"What is $\cos15^\circ$?", [r"$\frac{\sqrt6+\sqrt2}{4}$", r"$\frac{\sqrt6-\sqrt2}{4}$", r"$\frac{\sqrt3}{4}$", r"$\frac12$"], r"$\cos(45-30)=\cos45\cos30+\sin45\sin30$, the same as $\sin75^\circ$."),
     (r"Simplify $\sin x\cos y-\cos x\sin y$.", [r"$\sin(x-y)$", r"$\sin(x+y)$", r"$\cos(x+y)$", r"$\cos(x-y)$"], r"It's the subtraction formula for sine.")]),
  T("Double angle", r"""
Set $a=b$ in the addition formulas:
$$\sin2x=2\sin x\cos x,\qquad \cos2x=\cos^2x-\sin^2x=2\cos^2x-1=1-2\sin^2x.$$

The $\cos2x$ forms let you trade squares for double angles: $\sin^2x=\frac{1-\cos2x}{2}$.

Products like $\sin x\cos x$ often simplify to $\frac12\sin2x$.""",
    (r"If $\sin x=\frac35$ with $x$ acute, find $\sin2x$ and $\cos2x$.", [r"$\cos x=\frac45$.", r"$\sin2x=2\cdot\frac35\cdot\frac45=\frac{24}{25}$.", r"$\cos2x=1-2\cdot\frac9{25}=\frac7{25}$."], r"$\frac{24}{25}$ and $\frac{7}{25}$"),
    [(r"What is $2\sin15^\circ\cos15^\circ$?", [r"$\frac12$", r"$\frac{\sqrt3}2$", r"$1$", r"$\frac14$"], r"It's $\sin30^\circ$."),
     (r"What is $\cos^2 22.5^\circ-\sin^2 22.5^\circ$?", [r"$\frac{\sqrt2}2$", r"$1$", r"$\frac12$", r"$0$"], r"It's $\cos45^\circ$.")]),
  T("Law of cosines", r"""
For any triangle with sides $a, b, c$ and angle $C$ opposite $c$:
$$c^2=a^2+b^2-2ab\cos C.$$

When $C=90^\circ$ it's Pythagoras. Use it to find a side from two sides and the angle between them, or an angle from all three sides.

$C$ is obtuse exactly when $c^2>a^2+b^2$.""",
    (r"A triangle has sides $5$ and $8$ with a $60^\circ$ angle between them. Find the third side.", [r"$c^2=25+64-2\cdot5\cdot8\cos60^\circ$.", r"$=89-40=49$.", r"$c=7$."], r"$7$"),
    [(r"A triangle has sides $3$, $5$, $7$. What is the angle opposite $7$?", [r"$120^\circ$", r"$90^\circ$", r"$135^\circ$", r"$150^\circ$"], r"$49=9+25-30\cos C$ gives $\cos C=-\frac12$."),
     (r"Is the triangle with sides $6, 7, 10$ acute, right or obtuse?", [r"Obtuse", r"Acute", r"Right", r"Can't tell"], r"$10^2=100>36+49=85$.")]),
 ],
 [
  T("Dot product", r"""
For vectors $\mathbf u=(u_1,u_2)$ and $\mathbf v=(v_1,v_2)$: $\mathbf u\cdot\mathbf v=u_1v_1+u_2v_2$, and also $\mathbf u\cdot\mathbf v=|\mathbf u||\mathbf v|\cos\theta$.

So vectors are **perpendicular** exactly when their dot product is $0$, and you can find the angle between any two vectors.

$\mathbf v\cdot\mathbf v=|\mathbf v|^2$.""",
    (r"Find the angle between $(1,2)$ and $(3,1)$.", [r"Dot product: $3+2=5$.", r"Lengths: $\sqrt5$ and $\sqrt{10}$, product $\sqrt{50}=5\sqrt2$.", r"$\cos\theta=\frac{5}{5\sqrt2}=\frac{1}{\sqrt2}$, so $\theta=45^\circ$."], r"$45^\circ$"),
    [(r"For which $k$ are $(2,k)$ and $(3,-6)$ perpendicular?", [r"$1$", r"$-1$", r"$4$", r"$\frac12$"], r"$6-6k=0$."),
     (r"What is $(1,2,3)\cdot(4,-5,6)$?", [r"$12$", r"$32$", r"$-12$", r"$0$"], r"$4-10+18=12$.")]),
  T("Determinants", r"""
For a $2\times2$ matrix, $\det\begin{pmatrix}a&b\\c&d\end{pmatrix}=ad-bc$.

Its absolute value is the **area of the parallelogram** spanned by the column vectors $(a,c)$ and $(b,d)$; a triangle with those sides has half that area.

A determinant of $0$ means the vectors are parallel (and the matrix has no inverse).""",
    (r"Find the area of the triangle with vertices $(0,0)$, $(4,1)$ and $(2,5)$.", [r"Use the vectors $(4,1)$ and $(2,5)$.", r"$\det=4\cdot5-1\cdot2=18$: the parallelogram has area $18$.", r"The triangle is half: $9$."], r"$9$"),
    [(r"What is $\det\begin{pmatrix}3&2\\5&4\end{pmatrix}$?", [r"$2$", r"$22$", r"$-2$", r"$7$"], r"$12-10=2$."),
     (r"For which $k$ is $\begin{pmatrix}2&k\\3&6\end{pmatrix}$ not invertible?", [r"$4$", r"$9$", r"$1$", r"$-4$"], r"$12-3k=0$.")]),
  T("Polar form", r"""
A complex number $z=a+bi$ can also be described by its **length** $r=|z|=\sqrt{a^2+b^2}$ and **angle** $\theta$: $z=r(\cos\theta+i\sin\theta)$.

Multiplying complex numbers **multiplies lengths and adds angles**. Dividing divides lengths and subtracts angles.

So multiplying by $i$ rotates by $90^\circ$.""",
    (r"Write $1+i$ in polar form, then compute $(1+i)^2$ using it.", [r"$r=\sqrt2$, $\theta=45^\circ$.", r"Squaring: length $(\sqrt2)^2=2$, angle $90^\circ$.", r"$2(\cos90^\circ+i\sin90^\circ)=2i$."], r"$2i$"),
    [(r"What is $|3-4i|$?", [r"$5$", r"$7$", r"$1$", r"$25$"], r"$\sqrt{9+16}$."),
     (r"$z$ has length $2$ and angle $30^\circ$; $w$ has length $3$ and angle $60^\circ$. What is $zw$?", [r"$6i$", r"$6$", r"$5i$", r"$6+6i$"], r"Length $6$, angle $90^\circ$.")]),
 ],
 [
  T("De Moivre", r"""
$\left(\cos\theta+i\sin\theta\right)^n=\cos n\theta+i\sin n\theta$.

In polar form, raising to the $n$-th power raises the length to the $n$ and multiplies the angle by $n$.

That makes huge powers easy: convert to polar, power up, convert back.""",
    (r"Compute $(1+i)^8$.", [r"$1+i$ has length $\sqrt2$ and angle $45^\circ$.", r"Eighth power: length $(\sqrt2)^8=16$, angle $360^\circ$.", r"$16(\cos360^\circ+i\sin360^\circ)=16$."], r"$16$"),
    [(r"What is $\left(\frac{1}{2}+\frac{\sqrt3}{2}i\right)^6$?", [r"$1$", r"$-1$", r"$i$", r"$6$"], r"Length $1$, angle $60^\circ$; times $6$ is $360^\circ$."),
     (r"What is $(\cos 20^\circ+i\sin20^\circ)^{9}$?", [r"$-1$", r"$1$", r"$i$", r"$-i$"], r"Angle $180^\circ$.")]),
  T("Roots of unity", r"""
The solutions of $z^n=1$ are the $n$ **roots of unity**: $\cos\frac{2\pi k}{n}+i\sin\frac{2\pi k}{n}$ for $k=0,1,\dots,n-1$.

They sit evenly spaced on the unit circle, forming a regular $n$-gon.

They **add to $0$** (for $n\ge2$), and multiply to $\pm1$. If $\omega$ is a primitive cube root of unity, $1+\omega+\omega^2=0$ and $\omega^3=1$.""",
    (r"Let $\omega\ne1$ satisfy $\omega^3=1$. Find $\omega^{100}+\omega^{200}$.", [r"$\omega^{99}=1$, so $\omega^{100}=\omega$; and $\omega^{198}=1$, so $\omega^{200}=\omega^2$.", r"$\omega+\omega^2=-1$ because $1+\omega+\omega^2=0$.", r"Answer $-1$."], r"$-1$"),
    [(r"How many solutions does $z^6=1$ have in the complex numbers?", [r"$6$", r"$2$", r"$1$", r"$3$"], r"An $n$-th degree equation has $n$ roots; here the $6$ roots of unity."),
     (r"What is the sum of the $5$th roots of unity?", [r"$0$", r"$1$", r"$5$", r"$-1$"], r"They're symmetric around the origin, and by Vieta on $z^5-1$ the sum is $0$.")]),
  T("Cross product", r"""
For 3D vectors, $\mathbf u\times\mathbf v$ is a vector **perpendicular to both**, with length $|\mathbf u||\mathbf v|\sin\theta$, the area of the parallelogram they span.

Compute it with the pattern
$\mathbf u\times\mathbf v=(u_2v_3-u_3v_2,\ u_3v_1-u_1v_3,\ u_1v_2-u_2v_1)$.

Order matters: $\mathbf v\times\mathbf u=-\mathbf u\times\mathbf v$.""",
    (r"Find $(1,0,0)\times(0,1,0)$ and $(1,2,0)\times(3,4,0)$.", [r"First: $(0\cdot0-0\cdot1,\ 0\cdot0-1\cdot0,\ 1\cdot1-0\cdot0)=(0,0,1)$.", r"Second: $(0,0,1\cdot4-2\cdot3)=(0,0,-2)$.", r"The second has length $2$: the parallelogram's area."], r"$(0,0,1)$ and $(0,0,-2)$"),
    [(r"What is the area of the parallelogram spanned by $(2,0,0)$ and $(0,3,0)$?", [r"$6$", r"$5$", r"$0$", r"$\sqrt{13}$"], r"They're perpendicular: $2\cdot3$."),
     (r"What is $\mathbf u\times\mathbf u$ for any vector $\mathbf u$?", [r"$\mathbf 0$", r"$|\mathbf u|^2$", r"$\mathbf u$", r"$1$"], r"$\sin0^\circ=0$.")]),
 ],
 [
  T("Parametric curves", r"""
A **parametric curve** gives $x$ and $y$ separately in terms of a parameter $t$: $x=f(t)$, $y=g(t)$. Think of $t$ as time and $(x,y)$ as a moving point.

To find the ordinary equation, **eliminate $t$**: solve one equation for $t$ and substitute, or use an identity like $\cos^2t+\sin^2t=1$.

$x=r\cos t$, $y=r\sin t$ traces a circle of radius $r$.""",
    (r"Eliminate $t$: $x=2t+1$, $y=t^2$.", [r"From the first, $t=\frac{x-1}{2}$.", r"Substitute: $y=\left(\frac{x-1}{2}\right)^2$.", r"A parabola: $y=\frac{(x-1)^2}{4}$."], r"$y=\frac{(x-1)^2}{4}$"),
    [(r"What curve is $x=3\cos t$, $y=3\sin t$?", [r"A circle of radius $3$", r"A line", r"An ellipse with axes $3$ and $9$", r"A parabola"], r"$x^2+y^2=9(\cos^2t+\sin^2t)=9$."),
     (r"Where is the point $x=t^2$, $y=t+1$ when $t=-2$?", [r"$(4,-1)$", r"$(-4,-1)$", r"$(4,3)$", r"$(2,-1)$"], r"$x=4$, $y=-1$.")]),
  T("Polar coordinates", r"""
A point can be given by its **distance** $r$ from the origin and **angle** $\theta$ from the positive $x$-axis.

Convert: $x=r\cos\theta$, $y=r\sin\theta$, and $r^2=x^2+y^2$, $\tan\theta=\frac yx$.

Some curves are much simpler in polar form: $r=2$ is a circle, $\theta=\frac\pi4$ is a line through the origin.""",
    (r"Convert the polar point $\left(4,\frac{2\pi}{3}\right)$ to $(x,y)$.", [r"$x=4\cos120^\circ=4\cdot(-\frac12)=-2$.", r"$y=4\sin120^\circ=4\cdot\frac{\sqrt3}2=2\sqrt3$.", r"$(-2,2\sqrt3)$."], r"$(-2,2\sqrt3)$"),
    [(r"What is $(0,-3)$ in polar form (with $r>0$)?", [r"$\left(3,\frac{3\pi}2\right)$", r"$\left(3,\frac{\pi}2\right)$", r"$(-3,0)$", r"$(3,\pi)$"], r"It's $3$ units straight down."),
     (r"What is $r=4\cos\theta$ in Cartesian form?", [r"$(x-2)^2+y^2=4$", r"$x^2+y^2=4$", r"$x=4$", r"$y=4x$"], r"Multiply by $r$: $x^2+y^2=4x$, then complete the square.")]),
  T("Symmetries", r"""
Use symmetry to simplify trig: $\sin(-x)=-\sin x$ (odd), $\cos(-x)=\cos x$ (even), $\sin(180^\circ-x)=\sin x$, $\cos(90^\circ-x)=\sin x$.

Sums over symmetric angles often cancel or pair up: $\sin^2x+\sin^2(90^\circ-x)=1$.

Periodicity: $\sin$ and $\cos$ repeat every $360^\circ$; $\tan$ every $180^\circ$.""",
    (r"Find $\sin^21^\circ+\sin^22^\circ+\dots+\sin^289^\circ$.", [r"Pair $\sin^2k+\sin^2(90^\circ-k)=\sin^2k+\cos^2k=1$.", r"$k=1,\dots,44$ pair with $89,\dots,46$: $44$ pairs giving $44$.", r"Plus the middle term $\sin^245^\circ=\frac12$: total $44.5$."], r"$\frac{89}{2}$"),
    [(r"What is $\cos(-60^\circ)$?", [r"$\frac12$", r"$-\frac12$", r"$\frac{\sqrt3}2$", r"$-\frac{\sqrt3}2$"], r"Cosine is even."),
     (r"What is $\sin10^\circ-\cos80^\circ$?", [r"$0$", r"$1$", r"$\sin70^\circ$", r"$-1$"], r"$\cos80^\circ=\sin10^\circ$.")]),
 ],
]

# ======================================================================= OLYMPIAD NUMBER THEORY
L["oly_nt"] = [
 [
  T("Parity", r"""
Every integer is **even or odd**, and the rules are simple: even $\pm$ even $=$ even, odd $\pm$ odd $=$ even, odd $\times$ odd $=$ odd, and anything $\times$ even $=$ even.

Parity arguments prove impossibility quickly: if one side of an equation must be odd and the other even, there are no solutions.

A sum of integers is odd exactly when it has an odd number of odd terms.""",
    (r"Can $x^2+y^2=4z+3$ have integer solutions?", [r"Look mod $4$: squares are $0$ or $1$, so $x^2+y^2$ is $0$, $1$ or $2$ mod $4$.", r"The right side is $3$ mod $4$.", r"So no solutions."], r"No"),
    [(r"The numbers $1, 2, \dots, 10$ are written down. You may replace any two by their difference. Can you end with $0$?", [r"No", r"Yes", r"Only if you start with $1$", r"Only after $5$ moves"], r"Replacing $a,b$ by $a-b$ keeps the parity of the total. The total starts at $55$ (odd), so the last number is odd."),
     (r"$a$ and $b$ are integers and $a+b$ is odd. Then $a-b$ is:", [r"Odd", r"Even", r"Zero", r"Can't tell"], r"$(a+b)-(a-b)=2b$ is even, so $a+b$ and $a-b$ have the same parity.")]),
  T("Factor everything", r"""
In integer equations, **factoring** is the strongest tool: if $(x-a)(y-b)=N$, then each factor is a divisor of $N$, and there are only finitely many cases.

**Simon's favourite factoring trick**: turn $xy+ax+by$ into a product by adding a constant: $xy+ax+by+ab=(x+b)(y+a)$.

Differences of squares and of cubes factor too.""",
    (r"Find all positive integers $x,y$ with $xy-2x-3y=0$.", [r"Add $6$: $xy-2x-3y+6=6$, so $(x-3)(y-2)=6$.", r"Positive factor pairs of $6$: $(1,6),(2,3),(3,2),(6,1)$ (negative pairs give non-positive $x$ or $y$).", r"Solutions: $(4,8), (5,5), (6,4), (9,3)$."], r"$(4,8),(5,5),(6,4),(9,3)$"),
    [(r"How many positive integer pairs satisfy $x^2-y^2=15$?", [r"$2$", r"$4$", r"$1$", r"$0$"], r"$(x-y)(x+y)=15$: $(1,15)$ gives $(8,7)$ and $(3,5)$ gives $(4,1)$."),
     (r"What is the largest prime factor of $3^8-1$?", [r"$41$", r"$13$", r"$5$", r"$7$"], r"$(3^4-1)(3^4+1)=80\cdot82=2^5\cdot5\cdot2\cdot41$.")]),
  T("Last digits", r"""
The last digit of a number is its remainder **mod $10$**; the last two digits are the remainder mod $100$.

Last digits of powers repeat in cycles of length dividing $4$. For mod $100$, Euler's theorem gives a cycle length dividing $40$ (for numbers coprime to $10$).

Split $100=4\times25$ and use the Chinese remainder theorem when needed.""",
    (r"Find the last two digits of $7^{40}$.", [r"$7^2=49$, $7^4=2401\equiv1\pmod{100}$.", r"So $7^{40}=(7^4)^{10}\equiv1$.", r"Last two digits $01$."], r"$01$"),
    [(r"What is the last digit of $1^1+2^2+3^3+4^4$?", [r"$8$", r"$0$", r"$4$", r"$2$"], r"$1+4+27+256=288$."),
     (r"What are the last two digits of $3^{20}$?", [r"$01$", r"$81$", r"$49$", r"$43$"], r"$3^{10}=59049\equiv49$; $49^2=2401\equiv01$.")]),
 ],
 [
  T("Congruences", r"""
Treat $\equiv\pmod n$ like equality: add, subtract, multiply both sides, and raise to powers.

You may **divide** by $a$ only if $\gcd(a,n)=1$. In general, $ka\equiv kb\pmod n$ gives $a\equiv b\pmod{\frac{n}{\gcd(k,n)}}$.

Choosing the right modulus is the art: try $3, 4, 8, 9, 7, 11$ and see which makes the problem collapse.""",
    (r"Show that $n^3-n$ is always divisible by $6$.", [r"$n^3-n=(n-1)n(n+1)$, three consecutive integers.", r"One of them is even, and one is a multiple of $3$.", r"So $6$ divides the product."], r"Always divisible by $6$"),
    [(r"Solve $6x\equiv4\pmod{10}$.", [r"$x\equiv4\pmod 5$", r"$x\equiv4\pmod{10}$", r"No solution", r"$x\equiv2\pmod 5$"], r"Divide everything by $2$: $3x\equiv2\pmod5$; the inverse of $3$ is $2$, so $x\equiv4$."),
     (r"What is $2^{2025}\bmod 3$?", [r"$2$", r"$1$", r"$0$", r"$3$"], r"$2\equiv-1$, so $2^{2025}\equiv(-1)^{2025}=-1\equiv2$.")]),
  T("Divisor counts", r"""
If $n=p_1^{a_1}\cdots p_k^{a_k}$, then $d(n)=(a_1+1)\cdots(a_k+1)$.

Working **backwards** is common: a number with exactly $6$ divisors is $p^5$ or $p^2q$.

Divisors pair up as $d\leftrightarrow\frac nd$, so the product of all divisors is $n^{d(n)/2}$.""",
    (r"Find the smallest positive integer with exactly $12$ divisors.", [r"$12=12, 6\cdot2, 4\cdot3, 3\cdot2\cdot2$ give shapes $p^{11}, p^5q, p^3q^2, p^2qr$.", r"Use the smallest primes, biggest exponent on $2$: $2^{11}$, $2^5\cdot3=96$, $2^3\cdot3^2=72$, $2^2\cdot3\cdot5=60$.", r"The smallest is $60$."], r"$60$"),
    [(r"How many divisors does $10^6$ have?", [r"$49$", r"$36$", r"$7$", r"$12$"], r"$2^6\cdot5^6$: $7\cdot7$."),
     (r"What is the product of all divisors of $12$?", [r"$1728$", r"$144$", r"$28$", r"$72$"], r"$d(12)=6$, so it's $12^3$.")]),
  T("Squares mod small numbers", r"""
Squares have very few possible remainders:
- mod $3$: $0, 1$
- mod $4$: $0, 1$
- mod $5$: $0, 1, 4$
- mod $8$: $0, 1, 4$ (odd squares are always $1$)
- mod $9$: $0, 1, 4, 7$

So a number $\equiv2$ or $3\pmod4$ is never a square, and a sum of two squares is never $\equiv3\pmod4$.""",
    (r"Is $n^2+n+1$ ever divisible by $5$?", [r"Try $n=0,1,2,3,4$: $1, 3, 7, 13, 21$.", r"Mod $5$: $1, 3, 2, 3, 1$.", r"Never $0$: $5$ never divides $n^2+n+1$."], r"Never divisible by $5$"),
    [(r"Which number can be a perfect square?", [r"$2\,025$", r"$2\,027$", r"$2\,023$", r"$2\,022$"], r"$2027\equiv3$, $2023\equiv3\pmod 4$, and $2022\equiv2\pmod 4$; $2025=45^2$."),
     (r"Can a perfect square end in the digit $7$?", [r"No", r"Yes", r"Only if it's odd", r"Only above $1000$"], r"Squares mod $10$ are $0,1,4,5,6,9$.")]),
 ],
 [
  T("Euler's theorem", r"""
If $\gcd(a,n)=1$, then $a^{\varphi(n)}\equiv1\pmod n$, where $\varphi(n)$ counts the numbers from $1$ to $n$ coprime to $n$.

$\varphi(p)=p-1$ for a prime (that's Fermat), $\varphi(p^k)=p^k-p^{k-1}$, and $\varphi$ multiplies over coprime parts: $\varphi(100)=\varphi(4)\varphi(25)=2\cdot20=40$.

So exponents can be reduced mod $\varphi(n)$.""",
    (r"Find $3^{2026}\bmod 100$.", [r"$\varphi(100)=40$ and $\gcd(3,100)=1$, so $3^{40}\equiv1$; in fact the order of $3$ is even smaller: $3^{10}=59049\equiv49$ and $49^2=2401\equiv1$, so $3^{20}\equiv1$.", r"$2026=20\cdot101+6$, so $3^{2026}\equiv3^{6}=729$.", r"$729\equiv29\pmod{100}$."], r"$29$"),
    [(r"What is $\varphi(36)$?", [r"$12$", r"$18$", r"$24$", r"$6$"], r"$\varphi(4)\varphi(9)=2\cdot6$."),
     (r"What is $7^{100}\bmod 15$?", [r"$1$", r"$7$", r"$4$", r"$13$"], r"$\varphi(15)=8$, $100=8\cdot12+4$, $7^4=2401\equiv1$.")]),
  T("Wilson's theorem", r"""
For a prime $p$: $(p-1)!\equiv-1\pmod p$.

Why: in $1\cdot2\cdots(p-1)$, every number pairs with its inverse mod $p$ and the pair multiplies to $1$, except $1$ and $p-1$, which are their own inverses. So the product is $1\cdot(p-1)\equiv-1$.

For composite $n>4$, $(n-1)!\equiv0\pmod n$.""",
    (r"Find $10!\bmod 11$ and $9!\bmod 11$.", [r"Wilson: $10!\equiv-1\equiv10\pmod{11}$.", r"$10!=10\cdot9!$, and $10\equiv-1$, so $-9!\equiv-1$.", r"$9!\equiv1\pmod{11}$."], r"$10$ and $1$"),
    [(r"What is $12!\bmod 13$?", [r"$12$", r"$1$", r"$0$", r"$6$"], r"Wilson: $-1\equiv12$."),
     (r"What is $5!\bmod 6$?", [r"$0$", r"$5$", r"$1$", r"$3$"], r"$6$ is composite and $5!=120=6\cdot20$.")]),
  T("Legendre's formula", r"""
The exponent of a prime $p$ in $n!$ is
$$\left\lfloor\frac np\right\rfloor+\left\lfloor\frac n{p^2}\right\rfloor+\left\lfloor\frac n{p^3}\right\rfloor+\cdots$$

Each multiple of $p$ contributes one, each multiple of $p^2$ one more, and so on.

The number of **trailing zeros** of $n!$ is the exponent of $5$ (there are always more $2$s).""",
    (r"How many zeros does $100!$ end in?", [r"Count factors of $5$: $\lfloor100/5\rfloor=20$.", r"Plus $\lfloor100/25\rfloor=4$ (extra fives from $25, 50, 75, 100$).", r"$24$ zeros."], r"$24$"),
    [(r"What is the largest power of $2$ dividing $20!$?", [r"$2^{18}$", r"$2^{10}$", r"$2^{16}$", r"$2^{20}$"], r"$10+5+2+1=18$."),
     (r"How many zeros does $30!$ end in?", [r"$7$", r"$6$", r"$3$", r"$8$"], r"$6+1=7$.")]),
 ],
 [
  T("Orders", r"""
The **order** of $a$ mod $n$ is the smallest $k\ge1$ with $a^k\equiv1\pmod n$.

Key fact: $a^m\equiv1$ exactly when the order divides $m$. In particular, the order divides $\varphi(n)$.

So to find an order, only test divisors of $\varphi(n)$.""",
    (r"Find the order of $2$ modulo $11$.", [r"The order divides $\varphi(11)=10$: test $1, 2, 5, 10$.", r"$2^1=2$, $2^2=4$, $2^5=32\equiv10$.", r"None is $1$, so the order is $10$."], r"$10$"),
    [(r"What is the order of $3$ mod $7$?", [r"$6$", r"$3$", r"$2$", r"$7$"], r"Test divisors of $6$: $3^2=9\equiv2$, $3^3=27\equiv6$. So it's $6$."),
     (r"If $a$ has order $12$ mod $n$, for which $m$ is $a^m\equiv1$?", [r"$m=36$", r"$m=6$", r"$m=8$", r"$m=18$"], r"Exactly the multiples of $12$.")]),
  T("Lifting the exponent", r"""
For an odd prime $p$ with $p\mid a-b$ (and $p\nmid a, b$):
$$v_p(a^n-b^n)=v_p(a-b)+v_p(n),$$
where $v_p(x)$ is the exponent of $p$ in $x$.

For $p=2$ with $a,b$ odd and $n$ even: $v_2(a^n-b^n)=v_2(a-b)+v_2(a+b)+v_2(n)-1$.

It answers "what is the largest power of $p$ dividing…" instantly.""",
    (r"What is the largest power of $3$ dividing $10^{9}-1$?", [r"$3\mid10-1=9$, so LTE applies with $a=10$, $b=1$.", r"$v_3(10^9-1)=v_3(9)+v_3(9)=2+2$.", r"$3^4$."], r"$3^4$"),
    [(r"What is $v_5(6^{25}-1)$?", [r"$3$", r"$2$", r"$1$", r"$25$"], r"$v_5(5)+v_5(25)=1+2$."),
     (r"What is $v_2(3^{8}-1)$?", [r"$5$", r"$3$", r"$4$", r"$8$"], r"$v_2(2)+v_2(4)+v_2(8)-1=1+2+3-1=5$ (indeed $6560=2^5\cdot205$).")]),
  T("Bounding", r"""
If an equation's sides grow at different rates, only **small values** can work. Bound the variables, then check what's left by hand.

Typical moves: compare $x^2$ with consecutive squares (if $n^2<x^2<(n+1)^2$, impossible); factorials and powers outgrow polynomials.

Combine with mods to cut the cases further.""",
    (r"Find all positive integers $n$ with $n^2+n+1$ a perfect square.", [r"For $n\ge1$: $n^2<n^2+n+1<n^2+2n+1=(n+1)^2$.", r"It's strictly between consecutive squares.", r"So there are no positive solutions."], r"None"),
    [(r"For how many positive $n$ is $n!+1$ a perfect square, with $n\le7$?", [r"$3$", r"$1$", r"$0$", r"$7$"], r"$4!+1=25$, $5!+1=121$, $7!+1=5041=71^2$."),
     (r"Which positive $x$ satisfies $2^x=x^2$ with $x\ne2$?", [r"$4$", r"$3$", r"$8$", r"$16$"], r"$2^4=16=4^2$; beyond that $2^x$ wins.")]),
 ],
 [
  T("Infinite descent", r"""
To show an equation has no positive solutions, suppose there's one and build a **smaller** positive one. Repeating forever is impossible, because positive integers can't decrease forever.

Equivalently: take the **smallest** solution and find an even smaller one, a contradiction.

The classic: $\sqrt2$ is irrational. If $a^2=2b^2$, then $a$ is even, $a=2c$, so $b^2=2c^2$: a smaller solution.""",
    (r"Show $x^2+y^2=3z^2$ has no positive integer solutions.", [r"Squares mod $3$ are $0,1$; $x^2+y^2\equiv0$ forces $x\equiv y\equiv0\pmod3$.", r"Then $9\mid3z^2$, so $3\mid z$.", r"Divide everything by $3$: a smaller solution. Descent: impossible."], r"No solutions"),
    [(r"If $a^2=2b^2$ with positive integers, what must be true of $a$?", [r"$a$ is even", r"$a$ is odd", r"$a$ is prime", r"$a=b$"], r"$a^2$ is even, so $a$ is even, and descent follows."),
     (r"The descent argument works because:", [r"Positive integers can't decrease forever", r"Every number is prime", r"Squares are positive", r"Equations have unique solutions"], r"That's the well-ordering principle.")]),
  T("Sums of two squares", r"""
A prime $p$ is a sum of two squares exactly when $p=2$ or $p\equiv1\pmod4$: $5=1+4$, $13=4+9$, $29=4+25$.

A positive integer is a sum of two squares exactly when every prime $\equiv3\pmod4$ appears to an **even** power in its factorisation.

The identity $(a^2+b^2)(c^2+d^2)=(ac-bd)^2+(ad+bc)^2$ shows products of sums of two squares are sums of two squares.""",
    (r"Is $45$ a sum of two squares?", [r"$45=3^2\cdot5$.", r"The prime $3\equiv3\pmod4$ appears to an even power.", r"Yes: $45=36+9$."], r"Yes: $6^2+3^2$"),
    [(r"Which prime is a sum of two squares?", [r"$37$", r"$31$", r"$43$", r"$23$"], r"$37\equiv1\pmod4$: $37=1+36$."),
     (r"Is $21$ a sum of two squares?", [r"No", r"Yes", r"Only with zero", r"Yes, $16+5$"], r"$21=3\cdot7$, and both are $3\bmod4$ to odd powers.")]),
  T("Vieta jumping", r"""
For a symmetric equation like $a^2+b^2=kab+c$, fix $b$ and view it as a **quadratic in $a$**. If $a$ is one root, Vieta gives the other root $a'=kb-a=\frac{b^2-c}{a}$.

$a'$ is also an integer, so you can **jump** from the solution $(a,b)$ to $(a',b)$, often a smaller one.

Jumping down until you hit a minimal solution, combined with descent, solves famous problems like IMO 1988 Q6.""",
    (r"$(a,b)=(1,1)$ solves $a^2+b^2=3ab-1$. Jump to find more solutions.", [r"Fix $b=1$: $a^2-3a+2=0$ has roots $a=1$ and $a'=3\cdot1-1=2$. New solution $(2,1)$.", r"Fix $a=2$, view as quadratic in $b$: other root $b'=3\cdot2-1=5$. New solution $(2,5)$.", r"Keep going: $(13,5)$, $(13,34)$,… (alternate Fibonacci numbers!)."], r"$(2,1),(2,5),(13,5),\dots$"),
    [(r"In $a^2-kab+b^2=c$, if $a$ is a root (with $b$ fixed), the other root is:", [r"$kb-a$", r"$a-kb$", r"$\frac{a}{b}$", r"$kab$"], r"Sum of roots $=kb$ by Vieta."),
     (r"$(a,b)=(1,2)$ satisfies $a^2+b^2=5ab-5$. Jump in $a$ (fixing $b=2$): the other root is", [r"$9$", r"$3$", r"$5$", r"$10$"], r"$a'=5\cdot2-1=9$; check $81+4=85=5\cdot18-5$. ✓")]),
 ],
]

# ======================================================================= OLYMPIAD COMBINATORICS
L["oly_comb"] = [
 [
  T("Count the complement", r"""
When "at least one", "not all" or "some" appears, count the **opposite** and subtract from the total.

The complement is often a single clean case ("none at all") while the original splits into many messy ones.

Combine with the multiplication principle: total ways minus ways with no restriction violated.""",
    (r"How many $5$-digit numbers contain at least one digit $0$?", [r"All $5$-digit numbers: $9\cdot10^4=90\,000$.", r"With no zero at all: $9^5=59\,049$.", r"At least one zero: $90\,000-59\,049=30\,951$."], r"$30\,951$"),
    [(r"How many subsets of $\{1,\dots,10\}$ contain at least one even number?", [r"$992$", r"$1023$", r"$512$", r"$960$"], r"Total $2^{10}=1024$; subsets with only odd numbers: $2^5=32$."),
     (r"In a group of $23$ people, the probability that two share a birthday is closest to:", [r"$\frac12$", r"$\frac{23}{365}$", r"$\frac1{10}$", r"$\frac{9}{10}$"], r"$P(\text{all different})=\frac{365\cdot364\cdots343}{365^{23}}\approx0.49$, so the complement is about $0.51$.")]),
  T("Bijections", r"""
Two sets have the same size if you can **pair them up perfectly** (a bijection). Count the easier one.

Classic bijections: lattice paths ↔ strings of R and U; subsets ↔ binary strings; distributions of identical balls ↔ stars and bars.

Finding the right bijection often turns a hard count into a binomial coefficient.""",
    (r"How many increasing sequences $1\le a<b<c\le10$ are there?", [r"Each such sequence is just a $3$-element subset of $\{1,\dots,10\}$ written in order.", r"This pairing is a bijection.", r"So there are $\binom{10}{3}=120$."], r"$120$"),
    [(r"How many non-decreasing sequences $1\le a\le b\le c\le5$?", [r"$35$", r"$10$", r"$125$", r"$60$"], r"Map $(a,b,c)\mapsto(a,b+1,c+2)$, a strictly increasing triple in $\{1,\dots,7\}$: $\binom73=35$."),
     (r"The number of subsets of an $n$-element set equals:", [r"The number of binary strings of length $n$", r"$n!$", r"$n^2$", r"$\binom n2$"], r"Write $1$ for 'in' and $0$ for 'out'.")]),
  T("Pigeonhole", r"""
If more than $n$ objects go into $n$ boxes, some box gets at least two. More generally, $N$ objects in $n$ boxes force a box with at least $\lceil N/n\rceil$.

The skill is choosing the **boxes**: remainders, colours, parity patterns, regions of a shape.

Pigeonhole proves something *exists* without telling you which.""",
    (r"Show that among any $5$ points in a $2\times2$ square, two are within $\sqrt2$ of each other.", [r"Cut the square into four $1\times1$ squares (the boxes).", r"$5$ points, $4$ boxes: two points share a small square.", r"The farthest apart two points in a unit square can be is its diagonal, $\sqrt2$."], r"Proved by pigeonhole"),
    [(r"How many integers must you pick to guarantee two with the same remainder mod $7$?", [r"$8$", r"$7$", r"$14$", r"$6$"], r"$7$ remainders are the boxes; $8$ numbers force a repeat."),
     (r"$50$ socks in $4$ colours. How many must you grab to be sure of $3$ of one colour?", [r"$9$", r"$12$", r"$8$", r"$5$"], r"$8$ could be $2$ of each; the $9$th makes a triple.")]),
 ],
 [
  T("Combine tools", r"""
Real problems need several tools at once: casework to split, the complement to simplify a case, bijections to recognise a count, symmetry to halve the work.

A good habit: compute **small cases** by hand, look for a pattern, then find the argument that explains it.

Always sanity-check with a tiny example.""",
    (r"How many $4$-digit numbers have digits that strictly increase from left to right?", [r"Strictly increasing digits can't include $0$ (it would have to come first).", r"So choose $4$ different digits from $1$–$9$; there's exactly one increasing order (a bijection with subsets).", r"$\binom94=126$."], r"$126$"),
    [(r"How many $3$-digit numbers have digits that strictly decrease left to right?", [r"$120$", r"$84$", r"$720$", r"$210$"], r"Now $0$ is allowed (last): choose $3$ of $10$ digits, $\binom{10}{3}$."),
     (r"How many ways to choose $2$ squares of an $8\times8$ chessboard that share a side?", [r"$112$", r"$64$", r"$128$", r"$56$"], r"Horizontal pairs: $8\cdot7=56$; vertical: $56$.")]),
  T("Recursions", r"""
Describe the answer for $n$ in terms of smaller answers by looking at what happens **first** (or last).

Common recursions: Fibonacci ($a_n=a_{n-1}+a_{n-2}$), derangements ($D_n=(n-1)(D_{n-1}+D_{n-2})$), Catalan numbers.

Set up states carefully: sometimes you need two sequences, such as "ending in A" and "ending in B".""",
    (r"How many ways to tile a $2\times6$ board with $1\times2$ dominoes?", [r"Look at the left edge: either one vertical domino (leaves $2\times5$) or two horizontal ones stacked (leaves $2\times4$).", r"$t_n=t_{n-1}+t_{n-2}$ with $t_1=1$, $t_2=2$.", r"$t_3=3, t_4=5, t_5=8, t_6=13$."], r"$13$"),
    [(r"How many derangements (no one gets their own hat) are there of $4$ hats?", [r"$9$", r"$12$", r"$6$", r"$24$"], r"$D_2=1$, $D_3=2$, $D_4=3(2+1)=9$."),
     (r"How many strings of A, B of length $4$ have no two A's in a row?", [r"$8$", r"$5$", r"$13$", r"$16$"], r"Fibonacci with $a_1=2$, $a_2=3$: $5$, $8$.")]),
  T("Linearity of expectation", r"""
$E[X+Y]=E[X]+E[Y]$ **always**, even when $X$ and $Y$ are dependent.

So write a complicated count as a sum of **indicator** variables (each $1$ if something happens, $0$ if not). The expected count is the sum of the probabilities.

This handles fixed points, runs, records, collisions… without ever finding the full distribution.""",
    (r"$10$ people shuffle and redistribute their hats. Expected number of people with their own hat?", [r"Let $X_i=1$ if person $i$ gets their own hat; $P(X_i=1)=\frac{1}{10}$.", r"Expected total $=\sum E[X_i]=10\cdot\frac1{10}$.", r"$=1$."], r"$1$"),
    [(r"A random permutation of $1,\dots,n$: the expected number of $i$ with $\pi(i)>\pi(i+1)$ is", [r"$\frac{n-1}{2}$", r"$\frac n2$", r"$1$", r"$\frac{n}{4}$"], r"Each of the $n-1$ adjacent pairs is a descent with probability $\frac12$."),
     (r"Roll $6$ dice. Expected number of distinct faces showing?", [r"$6\left(1-\left(\frac56\right)^6\right)$", r"$6$", r"$3.5$", r"$\left(\frac56\right)^6$"], r"Face $k$ appears with probability $1-\left(\frac56\right)^6$; sum over $6$ faces (about $3.99$).")]),
 ],
 [
  T("Invariants", r"""
An **invariant** is a quantity that never changes under the allowed moves. If the start and the target have different values, the target is unreachable.

Good candidates: the sum, the sum mod something, parity of a count, a product, a colouring count.

A **monovariant** only ever increases (or decreases); it proves that a process must stop.""",
    (r"Numbers $1,2,\dots,20$ are on a board. A move replaces $a,b$ with $a+b-1$. What number is left at the end?", [r"Each move lowers the total by exactly $1$, and there are $19$ moves.", r"Start total: $210$.", r"Final number: $210-19=191$."], r"$191$"),
    [(r"A chessboard has two opposite corners removed. Can it be tiled by dominoes?", [r"No", r"Yes", r"Only by $31$ dominoes of one colour", r"Only on an $8\times8$"], r"Each domino covers one black and one white square, but the two removed corners have the same colour: $30$ of one, $32$ of the other."),
     (r"You may flip any two coins at once. Starting with $7$ heads up, can you reach all tails?", [r"No", r"Yes", r"Only with $7$ flips", r"Only with an even number of coins"], r"Each move changes the number of heads by $-2$, $0$ or $+2$: its parity is invariant, and $7$ is odd.")]),
  T("Colourings", r"""
Colour a board or a set cleverly, then **count colours**: every allowed piece covers a fixed pattern of colours, so some shapes or positions become impossible.

Chessboard colouring handles dominoes. Colouring in $k$ colours by $(i+j)\bmod k$ handles $1\times k$ pieces.

Colouring is just a picture of an invariant.""",
    (r"Can a $10\times10$ board be tiled by $1\times4$ tiles?", [r"Colour cell $(i,j)$ with $(i+j)\bmod4$. Every $1\times4$ tile covers one cell of each colour.", r"$25$ tiles would need exactly $25$ cells of each colour.", r"But colour $1$ appears $26$ times (and colour $3$ only $24$): impossible."], r"No"),
    [(r"An $8\times8$ board with one corner removed: can it be tiled by $1\times3$ tiles?", [r"No", r"Yes", r"Only if the corner is white", r"Yes, with $21$ tiles any way you like"], r"Number rows and columns from $0$ and colour by $(i+j)\bmod3$; every $1\times3$ tile covers one cell of each colour. The colours appear $21, 22, 21$ times. Removing the corner (colour $0$) leaves $20, 22, 21$, but $21$ tiles need exactly $21$ of each."),
     (r"Every domino on a chessboard covers:", [r"one black and one white square", r"two black squares", r"two squares of the same colour", r"either, depending on direction"], r"Neighbouring squares have different colours.")]),
  T("Double counting", r"""
Count the same thing **in two ways**; the two answers must be equal. This proves identities and gives equations.

Example: count pairs (person, handshake) — by people, it's the sum of the handshake counts; by handshakes, it's twice the number of handshakes.

Tables help: count the entries of a grid by rows and by columns.""",
    (r"In a club, every member is in exactly $3$ committees and every committee has exactly $4$ members. There are $12$ members. How many committees?", [r"Count (member, committee) memberships by members: $12\cdot3=36$.", r"Count by committees: $4C$.", r"$4C=36$, so $C=9$."], r"$9$"),
    [(r"Prove $\binom{n}{2}$ counts handshakes by counting each person's $n-1$ shakes. The sum $n(n-1)$ counts each handshake:", [r"twice", r"once", r"$n$ times", r"$n-1$ times"], r"Each handshake has two people, so it's counted from both ends."),
     (r"Each of $10$ students knows exactly $3$ others (knowing is mutual). How many pairs know each other?", [r"$15$", r"$30$", r"$10$", r"$45$"], r"$\frac{10\cdot3}{2}=15$.")]),
 ],
 [
  T("The extremal principle", r"""
Look at the object that is **biggest, smallest, first, or last**: the longest path, the closest pair, the person with the most friends.

The extreme object has special properties ("nothing is bigger than it"), which often leads straight to a contradiction or a construction.

Combine with "suppose the claim is false; take a minimal counterexample".""",
    (r"Finitely many people stand in a field, all pairwise distances different. Each throws a ball at their nearest neighbour. If the number of people is odd, show someone is not hit.", [r"Take the closest pair $A,B$: they throw at each other.", r"If anyone else throws at $A$ or $B$, some person is hit twice, and then by counting someone is unhit. Otherwise remove $A$ and $B$; the others still throw within the rest.", r"Repeat; with an odd number, you end with one person who isn't hit."], r"Proved"),
    [(r"In a finite set of numbers, which object does the extremal principle focus on?", [r"The largest or smallest element", r"The middle element", r"A random element", r"The sum"], r"Extremes have the most constraints."),
     (r"Among finitely many points (not all on a line), take the pair with the smallest positive distance. Why might this help?", [r"No other pair is closer", r"It's always $1$", r"They're on a circle", r"It's unique by definition"], r"That extremal property is what you exploit.")]),
  T("Handshake lemma", r"""
In any graph, the **sum of the degrees is twice the number of edges**: each edge has two ends.

So the number of vertices with **odd degree is even**.

Use it to rule out configurations: there's no party of $7$ people where everyone shakes exactly $3$ hands ($7\cdot3$ is odd).""",
    (r"A graph has $10$ vertices: $4$ of degree $3$ and the rest of degree $2$. How many edges?", [r"Degree sum: $4\cdot3+6\cdot2=24$.", r"Edges are half the degree sum.", r"$12$ edges."], r"$12$"),
    [(r"Can a group of $9$ people each have exactly $5$ friends (friendship mutual)?", [r"No", r"Yes", r"Only if one person has $4$", r"Yes, in a circle"], r"Degree sum $45$ would be odd."),
     (r"A polyhedron has faces that are all triangles and $12$ faces. How many edges?", [r"$18$", r"$36$", r"$12$", r"$24$"], r"Each face has $3$ edges and each edge borders $2$ faces: $\frac{12\cdot3}{2}$.")]),
  T("Generating functions", r"""
Encode a sequence $a_0,a_1,\dots$ as a polynomial or power series $a_0+a_1x+a_2x^2+\cdots$.

Multiplying generating functions combines choices: the coefficient of $x^n$ in $(1+x+x^2)(1+x)$ counts ways to make $n$ from one choice of $0$–$2$ and one of $0$–$1$.

$\frac1{1-x}=1+x+x^2+\cdots$ represents "any number of copies".""",
    (r"How many ways to make $10$ cents from $1$-, $2$- and $5$-cent coins?", [r"Generating function $\frac{1}{(1-x)(1-x^2)(1-x^5)}$; find the coefficient of $x^{10}$.", r"By number of $5$s: zero $5$s: $10$ from $1$s and $2$s, $6$ ways; one $5$: $5$ left, $3$ ways; two $5$s: $1$ way.", r"$6+3+1=10$."], r"$10$"),
    [(r"The coefficient of $x^3$ in $(1+x)^5$ counts:", [r"$3$-element subsets of a $5$-set", r"$5$-element subsets of a $3$-set", r"permutations of $3$", r"$3^5$ strings"], r"Each factor chooses 'in' ($x$) or 'out' ($1$)."),
     (r"In how many ways can you roll a total of $4$ with two dice?", [r"$3$", r"$4$", r"$6$", r"$2$"], r"Coefficient of $x^4$ in $(x+\dots+x^6)^2$: $(1,3),(2,2),(3,1)$.")]),
 ],
 [
  T("Winning and losing positions", r"""
In a two-player game with no luck, classify each position as **winning** (the player to move can force a win) or **losing**.

A position is losing if **every** move leads to a winning position, and winning if **some** move leads to a losing position. Work backwards from the end.

Look for a pattern, then prove it: usually a simple rule like "multiples of $4$ are losing".""",
    (r"$20$ stones; players alternately take $1$, $2$ or $3$. Whoever takes the last stone wins. Who wins?", [r"$0$ stones (no move) is losing for the player to move. $1,2,3$ are winning (take all).", r"$4$ is losing: every move leaves $1$–$3$. Pattern: multiples of $4$ are losing.", r"$20$ is a multiple of $4$: the second player wins by always leaving a multiple of $4$."], r"The second player"),
    [(r"Same game but you may take $1$ to $4$ stones. Which starting pile is losing for the first player?", [r"$15$", r"$16$", r"$12$", r"$18$"], r"Now multiples of $5$ are losing."),
     (r"A position where every move leads to a winning position is:", [r"losing", r"winning", r"a draw", r"impossible"], r"Whatever you do, you hand your opponent a win.")]),
  T("The probabilistic method", r"""
To show an object with some property **exists**, pick one **at random** and show the probability of the property is positive (or that the average is good enough).

If the average value of something is $A$, some choice achieves at least $A$.

It proves existence without constructing anything.""",
    (r"Show that the vertices of any graph with $m$ edges can be split into two groups with at least $\frac m2$ edges between them.", [r"Put each vertex in a group by a coin flip.", r"Each edge crosses between the groups with probability $\frac12$, so the expected number of crossing edges is $\frac m2$.", r"Some split does at least as well as the average."], r"Proved"),
    [(r"If a random choice has expected score $7.3$, then:", [r"some choice scores at least $7.3$", r"every choice scores $7.3$", r"no choice scores above $7.3$", r"most choices score $7.3$"], r"Not everything can be below the average."),
     (r"A random $2$-colouring of $n$ points: the expected number of monochromatic pairs is", [r"$\frac12\binom n2$", r"$\binom n2$", r"$n$", r"$\frac n2$"], r"Each pair matches with probability $\frac12$.")]),
  T("Bound and construct", r"""
"Find the maximum" problems need **two halves**: prove nothing does better (the bound), and show an example that achieves it (the construction).

A bound without a construction, or an example without a bound, is only half an answer.

Try small cases to guess the answer; the extremal examples often suggest both parts.""",
    (r"What is the most kings you can place on an $8\times8$ board with no two attacking?", [r"Bound: split the board into $16$ blocks of $2\times2$; each block holds at most one king (all its squares touch).", r"Construction: put a king in the top-left square of each block; none attack.", r"Maximum $16$."], r"$16$"),
    [(r"The most rooks on an $8\times8$ board with none attacking is:", [r"$8$", r"$16$", r"$32$", r"$64$"], r"At most one per row (bound); the diagonal achieves $8$."),
     (r"What is the largest subset of $\{1,\dots,10\}$ with no two consecutive numbers?", [r"$5$", r"$6$", r"$4$", r"$10$"], r"Pair $\{1,2\},\dots,\{9,10\}$: at most one from each; the odd numbers achieve $5$.")]),
 ],
]

# ======================================================================= OLYMPIAD ALGEBRA
L["oly_alg"] = [
 [
  T("Factor it", r"""
Factoring reveals hidden structure. Learn the key identities:
- $a^2-b^2=(a-b)(a+b)$
- $a^3\pm b^3=(a\pm b)(a^2\mp ab+b^2)$
- $a^3+b^3+c^3-3abc=(a+b+c)(a^2+b^2+c^2-ab-bc-ca)$
- Sophie Germain: $a^4+4b^4=(a^2+2b^2+2ab)(a^2+2b^2-2ab)$

When an expression is complicated, factoring usually beats expanding.""",
    (r"Show $n^4+4$ is prime only for $n=1$.", [r"Sophie Germain with $b=1$: $n^4+4=(n^2+2n+2)(n^2-2n+2)$.", r"For $n\ge2$, the smaller factor $n^2-2n+2=(n-1)^2+1\ge2$.", r"So it's composite for $n\ge2$; $n=1$ gives $5$, prime."], r"Only $n=1$"),
    [(r"What is $\dfrac{2025^3-1}{2025^2+2025+1}$?", [r"$2024$", r"$2025$", r"$2026$", r"$1$"], r"$a^3-1=(a-1)(a^2+a+1)$."),
     (r"If $a+b+c=0$, then $a^3+b^3+c^3$ equals:", [r"$3abc$", r"$0$", r"$abc$", r"$(a+b+c)^3$"], r"From the identity, $a^3+b^3+c^3-3abc=0$.")]),
  T("Symmetric sums", r"""
For roots $r_1,\dots,r_n$ of a polynomial, the **elementary symmetric sums** $e_1=\sum r_i$, $e_2=\sum_{i<j}r_ir_j$, … come straight from the coefficients (Vieta).

**Power sums** $p_k=\sum r_i^k$ can then be computed by Newton's identities, e.g. $p_2=e_1^2-2e_2$.

For a quadratic with roots $r,s$: $r^n+s^n$ satisfies the same recurrence as the polynomial.""",
    (r"$r,s$ are roots of $x^2-x-1$. Find $r^5+s^5$.", [r"Each root satisfies $x^2=x+1$, so $p_n=p_{n-1}+p_{n-2}$ where $p_n=r^n+s^n$.", r"$p_0=2$, $p_1=1$, so $p_2=3$, $p_3=4$, $p_4=7$.", r"$p_5=11$."], r"$11$"),
    [(r"Roots of $x^3-2x^2+3x-4$: find $\sum r_i^2$.", [r"$-2$", r"$10$", r"$4$", r"$-6$"], r"$e_1^2-2e_2=4-6=-2$ (negative, so some roots are complex)."),
     (r"If $r+s=4$ and $rs=1$, what is $r^3+s^3$?", [r"$52$", r"$64$", r"$60$", r"$48$"], r"$(r+s)^3-3rs(r+s)=64-12$.")]),
  T("Recognise sequences", r"""
Before attacking a sequence, compute the first terms and **look**: is it arithmetic, geometric, Fibonacci-like, periodic, squares, triangular numbers?

A linear recurrence $a_n=pa_{n-1}+qa_{n-2}$ has solutions $\alpha r_1^n+\beta r_2^n$, where $r_1, r_2$ are the roots of $x^2=px+q$.

Many "impossible" sequences turn out to be **periodic**.""",
    (r"$a_1=2$, $a_2=3$ and $a_{n}=\frac{a_{n-1}}{a_{n-2}}$. Find $a_{2025}$.", [r"Compute: $2, 3, \frac32, \frac12, \frac13, \frac23, 2, 3,\dots$", r"The sequence repeats every $6$ terms.", r"$2025=6\cdot337+3$, so $a_{2025}=a_3=\frac32$."], r"$\frac32$"),
    [(r"Solve $a_n=5a_{n-1}-6a_{n-2}$ with $a_0=2$, $a_1=5$. What is $a_n$?", [r"$2^n+3^n$", r"$5^n$", r"$2\cdot3^n$", r"$3^n-2^n$"], r"Roots of $x^2=5x-6$ are $2, 3$; $\alpha+\beta=2$ and $2\alpha+3\beta=5$ give $\alpha=\beta=1$."),
     (r"$a_1=1$ and $a_{n+1}=a_n+2n+1$. What is $a_{10}$?", [r"$100$", r"$91$", r"$121$", r"$55$"], r"$a_n=n^2$.")]),
 ],
 [
  T("Mean inequalities", r"""
For positive reals: $\text{QM}\ge\text{AM}\ge\text{GM}\ge\text{HM}$, i.e.
$$\sqrt{\tfrac{a^2+b^2}{2}}\ge\tfrac{a+b}{2}\ge\sqrt{ab}\ge\tfrac{2}{\frac1a+\frac1b},$$
with equality exactly when all the numbers are equal. The same holds for $n$ numbers.

AM–GM is the workhorse: split terms so the product becomes constant.""",
    (r"For $x>0$, find the minimum of $x^2+\frac{2}{x}$.", [r"Split $\frac2x=\frac1x+\frac1x$ so the product of the three terms is constant: $x^2\cdot\frac1x\cdot\frac1x=1$.", r"AM–GM: $x^2+\frac1x+\frac1x\ge3\sqrt[3]{1}=3$.", r"Equality when $x^2=\frac1x$, i.e. $x=1$. Minimum $3$."], r"$3$"),
    [(r"For positive $a,b,c$, the minimum of $\frac ab+\frac bc+\frac ca$ is:", [r"$3$", r"$1$", r"$0$", r"$\frac32$"], r"AM–GM: the product of the three fractions is $1$."),
     (r"For positive $a,b$ with $ab=4$, the minimum of $a+4b$ is:", [r"$8$", r"$5$", r"$4$", r"$10$"], r"$a+4b\ge2\sqrt{4ab}=8$, at $a=4$, $b=1$.")]),
  T("Telescoping", r"""
Turn each term into a **difference** $f(k)-f(k+1)$ so that the sum collapses to the ends. Products can telescope too, as ratios $\frac{g(k+1)}{g(k)}$.

Partial fractions find the split: $\frac{1}{k(k+2)}=\frac12\left(\frac1k-\frac1{k+2}\right)$.

Root tricks also telescope: $\frac{1}{\sqrt{k+1}+\sqrt k}=\sqrt{k+1}-\sqrt k$.""",
    (r"Compute $\sum_{k=1}^{99}\dfrac{1}{\sqrt{k+1}+\sqrt{k}}$.", [r"Rationalise: each term is $\sqrt{k+1}-\sqrt{k}$.", r"The sum telescopes to $\sqrt{100}-\sqrt1$.", r"$=9$."], r"$9$"),
    [(r"What is $\prod_{k=2}^{10}\left(1-\frac1k\right)$?", [r"$\frac1{10}$", r"$\frac{9}{10}$", r"$\frac12$", r"$\frac1{9}$"], r"$\frac12\cdot\frac23\cdots\frac9{10}=\frac1{10}$."),
     (r"What is $\sum_{k=1}^{\infty}\frac{1}{k(k+2)}$?", [r"$\frac34$", r"$1$", r"$\frac12$", r"$\frac32$"], r"$\frac12\left(1+\frac12\right)$: only $\frac11$ and $\frac12$ survive.")]),
  T("Floor equations", r"""
Write $x=n+f$ with $n=\lfloor x\rfloor\in\mathbb Z$ and $0\le f<1$. Then **bound**: $n\le x<n+1$ turns floor equations into inequalities for $n$.

Hermite's identity: $\lfloor x\rfloor+\lfloor x+\tfrac12\rfloor=\lfloor2x\rfloor$.

For sums like $\sum\lfloor\frac{k}{3}\rfloor$, group terms with equal floor values.""",
    (r"Solve $\lfloor 2x\rfloor=3x-1$.", [r"$3x-1$ must be an integer $m$, so $x=\frac{m+1}{3}$, and $m\le2x<m+1$.", r"$m\le\frac{2m+2}{3}<m+1$ gives $3m\le2m+2$ and $2m+2<3m+3$, so $-1<m\le2$.", r"$m=0,1,2$: $x=\frac13,\frac23,1$. All check."], r"$x=\frac13,\frac23,1$"),
    [(r"What is $\sum_{k=1}^{10}\left\lfloor\frac k3\right\rfloor$?", [r"$15$", r"$18$", r"$12$", r"$10$"], r"Values: $0,0,1,1,1,2,2,2,3,3$."),
     (r"How many positive integers $n\le100$ have $\lfloor\sqrt n\rfloor=5$?", [r"$11$", r"$10$", r"$9$", r"$6$"], r"$25\le n\le35$.")]),
 ],
 [
  T("Integer root theorem", r"""
If a polynomial with **integer coefficients** has a rational root $\frac pq$ (in lowest terms), then $p$ divides the constant term and $q$ divides the leading coefficient.

For a monic polynomial, every rational root is an integer dividing the constant term.

Also: $a-b$ divides $P(a)-P(b)$ for integer polynomials, a powerful constraint.""",
    (r"Find all rational roots of $2x^3-3x^2-11x+6$.", [r"Candidates: $\pm1,\pm2,\pm3,\pm6,\pm\frac12,\pm\frac32$.", r"Test: $x=3$: $54-27-33+6=0$. ✓ Divide: $(x-3)(2x^2+3x-2)=(x-3)(2x-1)(x+2)$.", r"Roots $3, \frac12, -2$."], r"$3,\frac12,-2$"),
    [(r"Which could be a rational root of $3x^3+x-4$?", [r"$\frac43$", r"$\frac34$", r"$\frac25$", r"$\frac12$"], r"$p\mid4$, $q\mid3$. (In fact $x=1$ is a root.)"),
     (r"$P$ has integer coefficients with $P(1)=3$ and $P(5)=10$. Is that possible?", [r"No", r"Yes", r"Only if $P$ is linear", r"Only if $P(0)=0$"], r"$5-1=4$ must divide $10-3=7$.")]),
  T("Titu's lemma", r"""
For positive denominators: $\dfrac{a_1^2}{b_1}+\dots+\dfrac{a_n^2}{b_n}\ge\dfrac{(a_1+\dots+a_n)^2}{b_1+\dots+b_n}$.

It's Cauchy–Schwarz in a handy form. Equality holds when $\frac{a_i}{b_i}$ is the same for all $i$.

It's perfect for sums of fractions with squares (or things you can make into squares) on top.""",
    (r"For positive $x,y,z$ with $x+y+z=1$, find the minimum of $\frac1x+\frac4y+\frac9z$.", [r"Write it as $\frac{1^2}x+\frac{2^2}y+\frac{3^2}z$.", r"Titu: $\ge\frac{(1+2+3)^2}{x+y+z}=36$.", r"Equality when $\frac1x=\frac2y=\frac3z$, i.e. $(x,y,z)=\left(\frac16,\frac13,\frac12\right)$. Minimum $36$."], r"$36$"),
    [(r"For positive $a,b$ with $a+b=2$, the minimum of $\frac{1}{a}+\frac1b$ is:", [r"$2$", r"$1$", r"$4$", r"$\frac12$"], r"$\frac{(1+1)^2}{a+b}=2$."),
     (r"Titu's lemma is a special case of:", [r"Cauchy–Schwarz", r"Vieta", r"Heron", r"Pascal"], r"Apply Cauchy–Schwarz to $\frac{a_i}{\sqrt{b_i}}$ and $\sqrt{b_i}$.")]),
  T("Roots of unity filter", r"""
To add only every $k$-th coefficient of a polynomial, average its values at the $k$-th roots of unity.

For even coefficients: $\frac{P(1)+P(-1)}{2}$. For every third coefficient, use $\omega=e^{2\pi i/3}$: $\frac{P(1)+P(\omega)+P(\omega^2)}{3}$.

It works because $1+\omega^j+\omega^{2j}$ is $3$ when $3\mid j$ and $0$ otherwise.""",
    (r"Find $\binom{10}{0}+\binom{10}{2}+\binom{10}{4}+\dots+\binom{10}{10}$.", [r"Let $P(x)=(1+x)^{10}$.", r"Even coefficients sum to $\frac{P(1)+P(-1)}{2}=\frac{2^{10}+0}{2}$.", r"$=512$."], r"$512$"),
    [(r"What is $\binom{6}{0}+\binom63+\binom66$?", [r"$22$", r"$21$", r"$20$", r"$32$"], r"$1+20+1=22$, which equals $\frac{2^6+2\cdot\text{Re}((1+\omega)^6)}{3}=\frac{64+2}{3}$."),
     (r"$\frac{P(1)+P(-1)}{2}$ gives the sum of which coefficients?", [r"The even-degree ones", r"The odd-degree ones", r"All of them", r"The leading one"], r"Odd powers cancel between $1$ and $-1$.")]),
 ],
 [
  T("Substitutions", r"""
Change variables to reveal structure:
- a constraint $abc=1$: try $a=\frac xy$, $b=\frac yz$, $c=\frac zx$;
- $a+b+c=0$: use identities like $a^3+b^3+c^3=3abc$;
- sides of a triangle: $a=y+z$, $b=z+x$, $c=x+y$ (Ravi substitution) with $x,y,z>0$;
- trig: $x=\tan\theta$ when you see $1+x^2$.

A symmetric problem often simplifies with $s=a+b$, $p=ab$.""",
    (r"Solve the system $x+y=5$, $x^3+y^3=35$.", [r"Let $s=x+y=5$, $p=xy$: $x^3+y^3=s^3-3sp=125-15p$.", r"$125-15p=35$, so $p=6$.", r"$x,y$ are roots of $t^2-5t+6$: $\{2,3\}$."], r"$(2,3)$ or $(3,2)$"),
    [(r"In a triangle with sides $a=y+z$, $b=z+x$, $c=x+y$, what is $x$ in terms of the sides?", [r"$\frac{b+c-a}{2}$", r"$\frac{a+b+c}{2}$", r"$a-b$", r"$\frac{a}{2}$"], r"$b+c-a=2x$."),
     (r"If $x+\frac1x=t$, then $x^3+\frac1{x^3}$ equals:", [r"$t^3-3t$", r"$t^3$", r"$t^3+3t$", r"$3t$"], r"Cube: $t^3=x^3+\frac1{x^3}+3t$.")]),
  T("Jensen's inequality", r"""
If $f$ is **convex** (curves upward, like $x^2$ or $e^x$), then $f$ of the average is at most the average of $f$:
$$f\left(\frac{x_1+\dots+x_n}{n}\right)\le\frac{f(x_1)+\dots+f(x_n)}{n}.$$
For **concave** $f$ (like $\sqrt x$, $\log x$, or $\sin x$ on $[0,\pi]$), the inequality flips.

Equality holds when all the $x_i$ are equal.""",
    (r"Find the maximum of $\sin A+\sin B+\sin C$ for the angles of a triangle.", [r"$\sin$ is concave on $[0,\pi]$.", r"Jensen: $\frac{\sin A+\sin B+\sin C}{3}\le\sin\frac{A+B+C}{3}=\sin60^\circ$.", r"Maximum $3\cdot\frac{\sqrt3}2=\frac{3\sqrt3}{2}$, for an equilateral triangle."], r"$\frac{3\sqrt3}{2}$"),
    [(r"Which function is convex on the positive reals?", [r"$x^2$", r"$\sqrt x$", r"$\log x$", r"$-x^2$"], r"Its graph curves upward."),
     (r"For positive $a,b,c$ with $a+b+c=3$, the minimum of $a^2+b^2+c^2$ is:", [r"$3$", r"$9$", r"$1$", r"$0$"], r"Jensen on $x^2$: at least $3\cdot1^2$.")]),
  T("Symmetric inequalities", r"""
For a symmetric inequality, you may **assume an order** like $a\ge b\ge c$ without loss of generality.

Classic tools: rearrangement (similarly ordered sequences give the biggest sum of products), Schur's inequality, and "SOS" (write the difference as a sum of squares).

The simplest: $a^2+b^2+c^2\ge ab+bc+ca$, since twice the difference is $(a-b)^2+(b-c)^2+(c-a)^2$.""",
    (r"Prove $a^2+b^2+c^2\ge ab+bc+ca$.", [r"Double both sides and subtract: $2(a^2+b^2+c^2)-2(ab+bc+ca)$.", r"$=(a-b)^2+(b-c)^2+(c-a)^2\ge0$.", r"Equality exactly when $a=b=c$."], r"Proved"),
    [(r"If $a+b+c=6$, the largest possible value of $ab+bc+ca$ is:", [r"$12$", r"$36$", r"$18$", r"$9$"], r"$(a+b+c)^2=a^2+b^2+c^2+2(ab+bc+ca)\ge3(ab+bc+ca)$."),
     (r"Rearrangement: for $a\ge b$ and $x\ge y$, which is larger?", [r"$ax+by$", r"$ay+bx$", r"They're equal", r"It depends"], r"$(ax+by)-(ay+bx)=(a-b)(x-y)\ge0$.")]),
 ],
 [
  T("Equality cases", r"""
Before proving an inequality, find **when equality holds**. Usually it's all variables equal, or some at an endpoint (like $0$).

Your proof must be tight exactly there. If a step loses information at the equality case, that step is wrong.

The equality case tells you how to split terms for AM–GM and which inequality to try.""",
    (r"For $x>0$, find the minimum of $x+\frac{1}{x^2}$ and say where it occurs.", [r"Guess: AM–GM with terms balanced at equality. Split $x=\frac x2+\frac x2$ so the product with $\frac1{x^2}$ is constant: $\frac x2\cdot\frac x2\cdot\frac1{x^2}=\frac14$.", r"$\frac x2+\frac x2+\frac1{x^2}\ge3\sqrt[3]{\frac14}$.", r"Equality when $\frac x2=\frac1{x^2}$, i.e. $x=\sqrt[3]2$. Minimum $\frac{3}{\sqrt[3]4}$."], r"$\frac{3}{\sqrt[3]{4}}$ at $x=\sqrt[3]{2}$"),
    [(r"For non-negative $a,b$ with $a+b=1$, the maximum of $a^2+b^2$ occurs at:", [r"$(a,b)=(1,0)$ or $(0,1)$", r"$a=b=\frac12$", r"$a=\frac13$", r"nowhere"], r"$a^2+b^2=1-2ab$ is largest when $ab=0$: an endpoint, not the middle."),
     (r"AM–GM on $a$ and $b$ is an equality exactly when:", [r"$a=b$", r"$a=0$", r"$a+b=1$", r"$ab=1$"], r"$\frac{a+b}2-\sqrt{ab}=\frac12(\sqrt a-\sqrt b)^2$.")]),
  T("Smoothing", r"""
**Smoothing** moves variables closer together (or further apart) while keeping the constraint, and shows the expression only improves.

If moving two unequal variables toward their average never makes things worse, the optimum is at all-equal.

If it always helps to push variables apart, the optimum is at an extreme, like some variables being $0$.""",
    (r"Among positive numbers with a fixed sum, why is the product largest when they're all equal?", [r"Replace two unequal numbers $a\ne b$ by $\frac{a+b}2,\frac{a+b}2$: the sum stays the same.", r"$\left(\frac{a+b}{2}\right)^2-ab=\frac{(a-b)^2}{4}>0$, so the product increases.", r"Keep smoothing: the maximum is at all-equal."], r"Smoothing increases the product"),
    [(r"With $a+b=10$ (both positive), $ab$ is largest when:", [r"$a=b=5$", r"$a=1$", r"$a=9$", r"$a=10$"], r"Smoothing towards equal increases the product."),
     (r"For non-negative $a,b$ with $a+b=2$, the maximum of $a^3+b^3$ is:", [r"$8$", r"$2$", r"$4$", r"$6$"], r"Here spreading out helps: $(2,0)$ gives $8$, while $(1,1)$ gives only $2$.")]),
  T("Integer polynomials", r"""
For a polynomial $P$ with integer coefficients: **$a-b$ divides $P(a)-P(b)$** for all integers $a, b$.

So $P(a)\bmod m$ depends only on $a\bmod m$, and values at nearby integers constrain each other.

If $P$ has integer roots $r_1,\dots$, then $P(x)=(x-r_1)\cdots Q(x)$ with $Q$ also integer-coefficient.""",
    (r"Can a polynomial with integer coefficients have $P(2)=5$ and $P(7)=13$?", [r"$7-2=5$ must divide $P(7)-P(2)=8$.", r"$5\nmid8$.", r"Impossible."], r"No"),
    [(r"$P$ has integer coefficients and $P(0)$ and $P(1)$ are both odd. Can $P$ have an integer root?", [r"No", r"Yes", r"Only $0$", r"Only negative ones"], r"$P(n)\equiv P(0)$ or $P(1)\pmod 2$, so $P(n)$ is always odd, never $0$."),
     (r"If $P(x)$ has integer coefficients and $P(3)=0$, then $P(10)$ is divisible by:", [r"$7$", r"$10$", r"$3$", r"$13$"], r"$10-3$ divides $P(10)-P(3)=P(10)$.")]),
 ],
]

# ======================================================================= OLYMPIAD GEOMETRY
L["oly_geo"] = [
 [
  T("Angle chasing", r"""
Mark every angle you can find, step by step, using: triangle sums ($180^\circ$), straight lines, parallel lines, isosceles triangles, and circles (inscribed angles, tangent–chord angles).

Introduce a variable for one unknown angle and express the others in terms of it.

Most olympiad geometry starts with an angle chase that reveals a cyclic quadrilateral or similar triangles.""",
    (r"In triangle $ABC$, $AB=AC$ and $\angle A=36^\circ$. The bisector of $\angle B$ meets $AC$ at $D$. Find $\angle BDC$.", [r"Base angles: $\angle B=\angle C=72^\circ$.", r"The bisector gives $\angle DBC=36^\circ$.", r"In triangle $BDC$: $\angle BDC=180^\circ-36^\circ-72^\circ=72^\circ$ (so $BDC$ is isosceles too)."], r"$72^\circ$"),
    [(r"The tangent–chord angle equals:", [r"the inscribed angle on the other side of the chord", r"the central angle", r"$90^\circ$", r"half the tangent length"], r"Both are half the arc cut off by the chord."),
     (r"In triangle $ABC$, $\angle A=50^\circ$. The bisectors of $\angle B$ and $\angle C$ meet at $I$. Find $\angle BIC$.", [r"$115^\circ$", r"$130^\circ$", r"$100^\circ$", r"$65^\circ$"], r"$\angle BIC=180^\circ-\frac{B+C}{2}=180^\circ-65^\circ=90^\circ+\frac{A}{2}$.")]),
  T("AA similarity", r"""
Two triangles are similar as soon as **two angles match**. Then corresponding sides are proportional.

Look for: parallel lines (corresponding angles), a shared angle, inscribed angles on the same arc, right angles.

Write the similarity with vertices in matching order ($\triangle ABC\sim\triangle DEF$), then read off ratios like $\frac{AB}{DE}=\frac{BC}{EF}$.""",
    (r"In right triangle $ABC$ with $\angle C=90^\circ$, $CD$ is the altitude to $AB$. If $AD=4$ and $DB=9$, find $CD$.", [r"$\triangle ACD\sim\triangle CBD$ (each has a right angle, and $\angle A=\angle BCD$).", r"So $\frac{AD}{CD}=\frac{CD}{DB}$, i.e. $CD^2=AD\cdot DB=36$.", r"$CD=6$."], r"$6$"),
    [(r"With the same set-up, $AC^2$ equals:", [r"$AD\cdot AB$", r"$AD\cdot DB$", r"$DB\cdot AB$", r"$AB^2-AD^2$"], r"$\triangle ACD\sim\triangle ABC$ gives $\frac{AC}{AB}=\frac{AD}{AC}$."),
     (r"Two chords $AB$ and $CD$ meet at $P$ inside a circle. Which triangles are similar?", [r"$PAC$ and $PDB$", r"$PAB$ and $PCD$", r"$PAD$ and $PAC$", r"none"], r"$\angle CAB=\angle CDB$ (same arc) and vertical angles at $P$ match.")]),
  T("Shared heights", r"""
Triangles with the **same height** have areas proportional to their bases; triangles with the **same base** have areas proportional to their heights.

So a cevian $AD$ splits the area of $ABC$ in the ratio $BD:DC$. And two triangles on the same base between parallel lines have equal areas.

Area ratios convert length problems into area problems and back.""",
    (r"In triangle $ABC$, $D$ is on $BC$ with $BD=2DC$, and $E$ is the midpoint of $AD$. If $[ABC]=36$, find $[EBD]$.", [r"$[ABD]=\frac23[ABC]=24$ (shared height from $A$).", r"$E$ is the midpoint of $AD$, so $[EBD]=\frac12[ABD]$ (shared height from $B$).", r"$[EBD]=12$."], r"$12$"),
    [(r"$ABCD$ is a trapezium with $AB\parallel CD$. Which two triangles have equal area?", [r"$ABC$ and $ABD$", r"$ABC$ and $ACD$", r"$ABD$ and $BCD$", r"$ABC$ and $BCD$"], r"Same base $AB$, and $C$, $D$ are at the same height above it."),
     (r"In triangle $ABC$ the three medians meet at $G$. What fraction of the area is triangle $GBC$?", [r"$\frac13$", r"$\frac12$", r"$\frac16$", r"$\frac14$"], r"$G$ is $\frac13$ of the way up each median, so its height above $BC$ is $\frac13$ of $A$'s.")]),
 ],
 [
  T("Cyclic quadrilaterals", r"""
Four points lie on a circle exactly when:
- opposite angles add to $180^\circ$, or
- a side subtends equal angles at the other two points ($\angle ACB=\angle ADB$), or
- power of a point holds: $PA\cdot PB=PC\cdot PD$.

Spotting a hidden cyclic quadrilateral unlocks many angle equalities at once. Right angles on a common segment are a classic giveaway.""",
    (r"In triangle $ABC$, $BE$ and $CF$ are altitudes. Show $B, C, E, F$ are concyclic.", [r"$\angle BEC=90^\circ$ and $\angle BFC=90^\circ$.", r"So $E$ and $F$ both see segment $BC$ at a right angle.", r"They lie on the circle with diameter $BC$."], r"They lie on the circle with diameter $BC$"),
    [(r"In cyclic quadrilateral $ABCD$, $\angle ABD=35^\circ$. What is $\angle ACD$?", [r"$35^\circ$", r"$145^\circ$", r"$55^\circ$", r"$70^\circ$"], r"Both subtend arc $AD$."),
     (r"Which condition proves $ABCD$ is cyclic?", [r"$\angle A+\angle C=180^\circ$", r"$\angle A=\angle C$", r"$AB=CD$", r"$AC\perp BD$"], r"Opposite angles supplementary.")]),
  T("Power of a point", r"""
For a point $P$ and a circle with centre $O$ and radius $r$: every line through $P$ meeting the circle at $A, B$ gives $PA\cdot PB=|OP^2-r^2|$, the **power** of $P$.

It gives chord–chord, secant–secant and tangent–secant relations in one rule.

With signed lengths, the power is negative inside the circle and positive outside.""",
    (r"$P$ is $10$ from the centre of a circle of radius $6$. A line through $P$ meets the circle at $A$ and $B$ with $PA=4$. Find $PB$.", [r"Power of $P$: $10^2-6^2=64$.", r"$PA\cdot PB=64$.", r"$PB=16$."], r"$16$"),
    [(r"$P$ is inside a circle of radius $5$, at distance $3$ from the centre. A chord through $P$ is split into parts $x$ and $y$. What is $xy$?", [r"$16$", r"$9$", r"$25$", r"$34$"], r"$r^2-OP^2=25-9$."),
     (r"Two circles meet at $X$ and $Y$. For a point $P$ on line $XY$ outside both circles, the tangent lengths to the two circles are:", [r"equal", r"in ratio of the radii", r"always $XY$", r"unrelated"], r"Both equal $\sqrt{PX\cdot PY}$.")]),
  T("Look for diameters", r"""
A **diameter** creates right angles: any angle inscribed in a semicircle is $90^\circ$. Conversely, a right angle means its hypotenuse is a diameter of the circumcircle.

So the circumradius of a right triangle is half its hypotenuse, and its circumcentre is the hypotenuse's midpoint.

Draw the diameter through a key point (often the antipode of a vertex) to create right angles to chase.""",
    (r"Find the circumradius of the triangle with sides $10$, $24$, $26$.", [r"$10^2+24^2=676=26^2$: it's a right triangle.", r"The hypotenuse is a diameter of the circumcircle.", r"$R=13$."], r"$13$"),
    [(r"$AB$ is a diameter and $C$ is on the circle. Then $\angle ACB$ is:", [r"$90^\circ$", r"$60^\circ$", r"$180^\circ$", r"it depends on $C$"], r"Thales' theorem."),
     (r"In a right triangle with legs $6$ and $8$, the distance from the right-angle vertex to the circumcentre is:", [r"$5$", r"$4.8$", r"$10$", r"$7$"], r"The circumcentre is the midpoint of the hypotenuse, which is equidistant ($5$) from all three vertices.")]),
 ],
 [
  T("Triangle centres", r"""
- **Centroid** $G$: where the medians meet; it divides each median $2:1$.
- **Circumcentre** $O$: where the perpendicular bisectors meet; centre of the circle through the vertices.
- **Incentre** $I$: where the angle bisectors meet; centre of the inscribed circle.
- **Orthocentre** $H$: where the altitudes meet.

$O$, $G$ and $H$ lie on the **Euler line**, with $OG:GH=1:2$.""",
    (r"The vertices of a triangle are $(0,0)$, $(6,0)$ and $(0,9)$. Find its centroid and circumcentre.", [r"Centroid: average of the vertices, $\left(\frac{6}{3},\frac93\right)=(2,3)$.", r"It's a right triangle (right angle at the origin), so the circumcentre is the midpoint of the hypotenuse: $(3,4.5)$.", r"The orthocentre is the right-angle vertex $(0,0)$. Check: $O$, $G$, $H$ are collinear. ✓"], r"$G=(2,3)$, $O=(3,4.5)$"),
    [(r"Which centre is always inside the triangle?", [r"The incentre", r"The circumcentre", r"The orthocentre", r"None of them"], r"The incentre (like the centroid) is always inside; the circumcentre and orthocentre move outside in obtuse triangles."),
     (r"In an equilateral triangle, the four centres:", [r"coincide", r"form a square", r"lie on a circle", r"are all different"], r"By symmetry every centre is the middle point.")]),
  T("Law of sines", r"""
In any triangle, $\dfrac{a}{\sin A}=\dfrac{b}{\sin B}=\dfrac{c}{\sin C}=2R$, where $R$ is the circumradius.

It converts between side lengths and angles, and links them to the circumcircle.

Also useful: area $=\frac12ab\sin C=\frac{abc}{4R}$.""",
    (r"A triangle has $\angle A=30^\circ$ and $a=5$. Find its circumradius.", [r"Law of sines: $\frac{a}{\sin A}=2R$.", r"$\frac{5}{1/2}=10=2R$.", r"$R=5$."], r"$5$"),
    [(r"In triangle $ABC$, $\angle A=45^\circ$, $\angle B=60^\circ$ and $a=\sqrt2$. What is $b$?", [r"$\sqrt3$", r"$\sqrt6$", r"$2$", r"$\frac{\sqrt3}2$"], r"$b=\frac{a\sin B}{\sin A}=\frac{\sqrt2\cdot\frac{\sqrt3}2}{\frac{\sqrt2}2}=\sqrt3$."),
     (r"A triangle has sides $13$, $14$, $15$ and area $84$. What is $R$?", [r"$\frac{65}{8}$", r"$7$", r"$\frac{15}{2}$", r"$8$"], r"$R=\frac{abc}{4K}=\frac{2730}{336}=\frac{65}{8}$.")]),
  T("Angle bisector theorem", r"""
The bisector of angle $A$ meets $BC$ at $D$ with $\dfrac{BD}{DC}=\dfrac{AB}{AC}$: it splits the opposite side in the ratio of the adjacent sides.

So $BD=\dfrac{ac}{b+c}$ and $DC=\dfrac{ab}{b+c}$.

The external bisector divides $BC$ externally in the same ratio.""",
    (r"In triangle $ABC$, $AB=6$, $AC=9$ and $BC=10$. The bisector of $\angle A$ meets $BC$ at $D$. Find $BD$.", [r"$\frac{BD}{DC}=\frac69=\frac23$.", r"$BD=\frac{2}{5}\cdot10$.", r"$BD=4$."], r"$4$"),
    [(r"In triangle $ABC$, $AB=5$, $AC=7$, and the bisector from $A$ meets $BC$ at $D$ with $BD=2.5$. What is $DC$?", [r"$3.5$", r"$5$", r"$2.5$", r"$7$"], r"$\frac{BD}{DC}=\frac57$."),
     (r"The incentre lies on:", [r"all three angle bisectors", r"all three medians", r"all three altitudes", r"the Euler line always"], r"It's defined as their common point.")]),
 ],
 [
  T("Ceva's theorem", r"""
Cevians $AD$, $BE$, $CF$ of triangle $ABC$ (with $D, E, F$ on the sides) are **concurrent** exactly when
$$\frac{BD}{DC}\cdot\frac{CE}{EA}\cdot\frac{AF}{FB}=1.$$

It explains why medians, angle bisectors and altitudes are concurrent.

Go around the triangle in one direction, vertex → point → vertex.""",
    (r"Cevians from $A$, $B$, $C$ meet at one point. $\frac{BD}{DC}=2$ and $\frac{CE}{EA}=\frac34$. Find $\frac{AF}{FB}$.", [r"Ceva: $2\cdot\frac34\cdot\frac{AF}{FB}=1$.", r"$\frac32\cdot\frac{AF}{FB}=1$.", r"$\frac{AF}{FB}=\frac23$."], r"$\frac23$"),
    [(r"For the three medians, each ratio $\frac{BD}{DC}$ etc. equals:", [r"$1$", r"$2$", r"$\frac12$", r"it varies"], r"Midpoints split sides equally, and $1\cdot1\cdot1=1$."),
     (r"Ceva's theorem tests whether three cevians are:", [r"concurrent", r"parallel", r"equal in length", r"perpendicular"], r"It's a concurrency criterion.")]),
  T("Menelaus", r"""
A line crossing the (extended) sides $BC$, $CA$, $AB$ of triangle $ABC$ at $D$, $E$, $F$ satisfies
$$\frac{BD}{DC}\cdot\frac{CE}{EA}\cdot\frac{AF}{FB}=1$$
(using unsigned lengths; with signed lengths the product is $-1$).

It's the collinearity partner of Ceva. Use it to find ratios along a line that cuts a triangle.""",
    (r"In triangle $ABC$, $D$ is the midpoint of $BC$ and $E$ is on $CA$ with $CE:EA=1:2$. Line $DE$ meets line $AB$ at $F$. Find $\frac{AF}{FB}$.", [r"Menelaus: $\frac{BD}{DC}\cdot\frac{CE}{EA}\cdot\frac{AF}{FB}=1$.", r"$1\cdot\frac12\cdot\frac{AF}{FB}=1$.", r"$\frac{AF}{FB}=2$ ($F$ lies on $AB$ extended beyond $B$)."], r"$2$"),
    [(r"Menelaus' theorem is used to prove three points are:", [r"collinear", r"concyclic", r"concurrent lines", r"equidistant"], r"It's a collinearity criterion."),
     (r"If a line through the midpoints of $AB$ and $AC$ is extended, it:", [r"is parallel to $BC$", r"meets $BC$ at its midpoint", r"passes through $A$", r"is perpendicular to $BC$"], r"The midline is parallel to the third side (so it never meets line $BC$).")]),
  T("Bash when stuck", r"""
When synthetic ideas run out, **compute**: coordinates, complex numbers, vectors, trigonometry, or barycentric coordinates.

Choose a set-up that keeps the algebra small: put a key point at the origin, a key line on an axis, the circumcircle as the unit circle.

A bash is reliable, though slow. Clean symmetry in the set-up pays off.""",
    (r"Prove that the diagonals of a parallelogram bisect each other, using vectors.", [r"Put $A$ at the origin, with $\vec{AB}=\mathbf u$ and $\vec{AD}=\mathbf v$; then $C=\mathbf u+\mathbf v$.", r"Midpoint of $AC$: $\frac{\mathbf u+\mathbf v}{2}$. Midpoint of $BD$: $\frac{\mathbf u+\mathbf v}{2}$.", r"They're the same point."], r"Proved"),
    [(r"In complex-number geometry, points on the unit circle satisfy:", [r"$\bar z=\frac1z$", r"$\bar z=z$", r"$z^2=1$", r"$|z|=0$"], r"$z\bar z=|z|^2=1$."),
     (r"The centroid of points $A$, $B$, $C$ in coordinates is:", [r"$\frac{A+B+C}{3}$", r"$\frac{A+B}{2}$", r"$A+B+C$", r"$\frac{A+B+C}{2}$"], r"Average the coordinates.")]),
 ],
 [
  T("Inversion", r"""
**Inversion** in a circle with centre $O$ and radius $r$ sends a point $P$ to $P'$ on ray $OP$ with $OP\cdot OP'=r^2$.

It swaps inside and outside; circles through $O$ become lines (and lines become circles through $O$); other circles stay circles. Angles are preserved.

Use it to turn a tangle of circles through one point into lines.""",
    (r"Inversion in the unit circle centred at the origin: where does the point $(2,0)$ go? And $(0,\frac13)$?", [r"$OP\cdot OP'=1$ with $P'$ on the same ray.", r"$(2,0)\mapsto(\frac12,0)$.", r"$(0,\frac13)\mapsto(0,3)$."], r"$(\frac12,0)$ and $(0,3)$"),
    [(r"Under inversion centred at $O$, a circle through $O$ becomes:", [r"a line", r"a circle through $O$", r"a point", r"a parabola"], r"$O$ goes to infinity, so the image is a line (not through $O$)."),
     (r"A point on the circle of inversion is sent to:", [r"itself", r"the centre", r"infinity", r"its reflection"], r"$OP=r$ forces $OP'=r$.")]),
  T("Homothety", r"""
A **homothety** with centre $X$ and ratio $k$ scales every point away from $X$ by $k$: it maps figures to similar, parallel copies.

Two circles are related by homotheties centred at their **external** and **internal** centres of similitude.

The centroid is the centre of the homothety with ratio $-\frac12$ taking the triangle to its medial triangle.""",
    (r"A homothety with centre $(0,0)$ and ratio $3$ maps the circle $(x-1)^2+y^2=1$ to what?", [r"The centre $(1,0)$ goes to $(3,0)$.", r"The radius scales by $3$: radius $3$.", r"Image: $(x-3)^2+y^2=9$."], r"$(x-3)^2+y^2=9$"),
    [(r"A homothety maps segment $AB$ to $A'B'$. Then $A'B'$ is:", [r"parallel to $AB$", r"perpendicular to $AB$", r"equal to $AB$", r"on the same line always"], r"Homotheties preserve directions."),
     (r"The homothety centred at the centroid with ratio $-\frac12$ sends vertex $A$ to:", [r"the midpoint of $BC$", r"the midpoint of $AB$", r"the orthocentre", r"$A$ itself"], r"$G$ divides the median $2:1$.")]),
  T("Radical axis", r"""
The **radical axis** of two circles is the set of points with equal power to both. It's a straight line, perpendicular to the line joining the centres.

If the circles intersect, it's the line through the two intersection points.

For three circles, the three radical axes are **concurrent** (or parallel) at the radical centre.""",
    (r"Find the radical axis of $x^2+y^2=4$ and $(x-3)^2+y^2=1$.", [r"Power to the first: $x^2+y^2-4$. Power to the second: $x^2-6x+9+y^2-1$.", r"Set equal: $-4=-6x+8$.", r"$x=2$: a vertical line."], r"$x=2$"),
    [(r"Two circles meet at $P$ and $Q$. Their radical axis is:", [r"line $PQ$", r"the line through the centres", r"the perpendicular bisector of the centres", r"tangent to both"], r"$P$ and $Q$ have power $0$ to both circles."),
     (r"The radical axis is always perpendicular to:", [r"the line joining the centres", r"both circles' tangents", r"the $x$-axis", r"nothing in particular"], r"Subtracting the circle equations leaves a line perpendicular to the centre line.")]),
 ],
]

# ======================================================================= OLYMPIAD MIXED
# Every Olympiad Mixed unit's ideas are the first ideas of the matching NT, combinatorics and algebra units.
L["oly_mixed"] = [[L["oly_nt"][u][0], L["oly_comb"][u][0], L["oly_alg"][u][0]] for u in range(5)]

# ----------------------------------------------------------------------- output
if __name__ == "__main__":
    for c, units in L.items():
        assert len(units) == 5, c
        for u, lessons in enumerate(units):
            assert len(lessons) == 3, (c, u)
            for les in lessons:
                assert len(les["checks"]) == 2 and all(len(k["c"]) == 4 for k in les["checks"]), (c, u, les["t"])
                assert len(set(k for ch in les["checks"] for k in [tuple(ch["c"])])) == 2
                for ch in les["checks"]:
                    assert len(set(ch["c"])) == 4, (c, u, les["t"], ch["c"])
    out = os.path.join(os.path.dirname(__file__), "..", "www", "js", "lessons.js")
    with open(out, "w") as f:
        f.write("// Hand-written teaching lessons for Learn (generated from tools/lessons_src.py — edit that file instead).\n")
        f.write("// LESSONS[course][unit] = three lessons, one per key idea of the unit's lecture.\n")
        f.write("// In every check the correct choice is listed first; the app shuffles the order.\n")
        f.write("export const LESSONS = " + json.dumps(L, ensure_ascii=False, indent=0) + ";\n")
    print("lessons:", sum(len(l) for u in L.values() for l in u), "→", os.path.relpath(out))
