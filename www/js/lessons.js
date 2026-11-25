// Hand-written teaching lessons for Learn (generated from tools/lessons_src.py — edit that file instead).
// LESSONS[course][unit] = three lessons, one per key idea of the unit's lecture.
// In every check the correct choice is listed first; the app shuffles the order.
export const LESSONS = {
"prealgebra": [
[
{
"t": "Order of operations",
"x": "When an expression has several operations, everyone agrees on one order so it has a single answer: **brackets**, then **powers**, then **multiplication and division** (left to right), then **addition and subtraction** (left to right).\n\nMultiplication does *not* beat division: they share a level, so you go left to right. $12\\div3\\times2$ is $4\\times2=8$, not $12\\div6=2$.\n\nA fraction bar acts like brackets around the top and around the bottom.",
"ex": {
"q": "Evaluate $18-12\\div3\\times2+1$.",
"steps": [
"No brackets or powers. Do $\\div$ and $\\times$ left to right: $12\\div3=4$, then $4\\times2=8$.",
"Now $+$ and $-$ left to right: $18-8=10$, then $10+1=11$."
],
"ans": "$11$"
},
"checks": [
{
"q": "What is $5+2\\times3^2$?",
"c": [
"$23$",
"$63$",
"$41$",
"$121$"
],
"why": "Power first: $3^2=9$. Then $2\\times9=18$. Then $5+18=23$."
},
{
"q": "What is $\\dfrac{6+4\\times3}{2}$?",
"c": [
"$9$",
"$15$",
"$12$",
"$7$"
],
"why": "The bar groups the top: $6+12=18$, and $18\\div2=9$."
}
]
},
{
"t": "Adding fractions",
"x": "You can only add fractions that are cut into the **same size pieces**. So first rewrite both with a common denominator, then add the numerators and keep the denominator.\n\nThe easiest common denominator is the **least common multiple** of the bottoms. For $\\frac16+\\frac14$ use $12$: $\\frac{2}{12}+\\frac{3}{12}=\\frac{5}{12}$.\n\nNever add the bottoms. $\\frac12+\\frac12$ is $1$, not $\\frac24$.",
"ex": {
"q": "Compute $\\frac35+\\frac{2}{3}$.",
"steps": [
"The LCM of $5$ and $3$ is $15$.",
"$\\frac35=\\frac{9}{15}$ and $\\frac23=\\frac{10}{15}$.",
"Add the tops: $\\frac{19}{15}$, which is $1\\frac{4}{15}$."
],
"ans": "$\\frac{19}{15}$"
},
"checks": [
{
"q": "What is $\\frac14+\\frac38$?",
"c": [
"$\\frac58$",
"$\\frac{4}{12}$",
"$\\frac{3}{32}$",
"$\\frac12$"
],
"why": "Write $\\frac14=\\frac28$; then $\\frac28+\\frac38=\\frac58$."
},
{
"q": "What is $\\frac56-\\frac13$?",
"c": [
"$\\frac12$",
"$\\frac43$",
"$\\frac23$",
"$\\frac16$"
],
"why": "$\\frac13=\\frac26$, so $\\frac56-\\frac26=\\frac36=\\frac12$."
}
]
},
{
"t": "Percent means per hundred",
"x": "\"Percent\" means \"out of $100$\", so $x\\%=\\frac{x}{100}$. To find $x\\%$ of a number, multiply: $x\\%$ of $y$ is $\\frac{x}{100}\\times y$.\n\nHandy shortcuts: $10\\%$ is dividing by $10$, $50\\%$ is halving, $25\\%$ is quartering, $1\\%$ is dividing by $100$. Build others from these: $15\\%=10\\%+5\\%$.\n\nPercent \"of\" is symmetric: $8\\%$ of $50$ equals $50\\%$ of $8$, which is $4$.",
"ex": {
"q": "What is $35\\%$ of $240$?",
"steps": [
"$10\\%$ of $240$ is $24$, so $30\\%$ is $72$.",
"$5\\%$ is half of $10\\%$: $12$.",
"$35\\%=30\\%+5\\%$: $72+12=84$."
],
"ans": "$84$"
},
"checks": [
{
"q": "What is $15\\%$ of $60$?",
"c": [
"$9$",
"$15$",
"$4$",
"$6$"
],
"why": "$10\\%$ of $60$ is $6$ and $5\\%$ is $3$, so $15\\%$ is $9$."
},
{
"q": "$12$ is what percent of $48$?",
"c": [
"$25\\%$",
"$12\\%$",
"$4\\%$",
"$36\\%$"
],
"why": "$\\frac{12}{48}=\\frac14=25\\%$."
}
]
}
],
[
{
"t": "Ratios as parts",
"x": "A ratio $a:b$ tells you how a whole is split into **parts**. If cats : dogs $=2:5$, think of $2$ equal parts of cats and $5$ equal parts of dogs, $7$ parts in all.\n\nGive each part a size $k$: cats $=2k$, dogs $=5k$. Any one fact about the totals lets you find $k$, and then everything else.\n\nRatios scale: $2:5=4:10=6:15$. Multiply or divide both sides by the same number.",
"ex": {
"q": "Juice is mixed with water in the ratio $2:7$. How much juice is in $45$ litres of the drink?",
"steps": [
"There are $2+7=9$ parts.",
"Each part is $45\\div9=5$ litres.",
"Juice is $2$ parts: $2\\times5=10$ litres."
],
"ans": "$10$ litres"
},
"checks": [
{
"q": "Ann and Ben share $\\$60$ in the ratio $1:3$. How much does Ben get?",
"c": [
"$\\$45$",
"$\\$20$",
"$\\$15$",
"$\\$40$"
],
"why": "$4$ parts of $\\$15$ each; Ben gets $3$ parts, $\\$45$."
},
{
"q": "The ratio of boys to girls is $4:5$ and there are $20$ girls. How many boys?",
"c": [
"$16$",
"$25$",
"$36$",
"$9$"
],
"why": "Girls $=5k=20$ gives $k=4$, so boys $=4k=16$."
}
]
},
{
"t": "Averages",
"x": "The **mean** (average) is the total divided by how many numbers there are. The most useful form is the other way round: **total $=$ average $\\times$ count**.\n\nThat turns \"missing number\" problems into subtraction: find the total the average demands, subtract the numbers you know.\n\nAdding a number above the average pulls it up; below pulls it down. Adding the average itself changes nothing.",
"ex": {
"q": "Your first four quiz scores average $80$. What must you score on the fifth to average $82$?",
"steps": [
"Five quizzes averaging $82$ need a total of $5\\times82=410$.",
"The first four total $4\\times80=320$.",
"You need $410-320=90$."
],
"ans": "$90$"
},
"checks": [
{
"q": "The mean of $3, 7, 8$ and $x$ is $6$. What is $x$?",
"c": [
"$6$",
"$18$",
"$4$",
"$24$"
],
"why": "The total must be $4\\times6=24$, and $3+7+8=18$, so $x=6$."
},
{
"q": "A class of $20$ averages $70$ and a class of $30$ averages $80$. What is the combined average?",
"c": [
"$76$",
"$75$",
"$74$",
"$78$"
],
"why": "Total $=20\\cdot70+30\\cdot80=1400+2400=3800$ over $50$ students: $76$. (Not $75$: the bigger class counts more.)"
}
]
},
{
"t": "Undo to solve",
"x": "An equation is a balance. Whatever you do to one side, do to the other, and it stays balanced.\n\nTo solve, **undo** what was done to $x$, in reverse order. For $3x+5=26$: $x$ was multiplied by $3$, then $5$ was added. So subtract $5$ first ($3x=21$), then divide by $3$ ($x=7$).\n\nAlways check by substituting back: $3\\cdot7+5=26$. ✓",
"ex": {
"q": "Solve $\\dfrac{x-4}{3}=5$.",
"steps": [
"Last thing done was dividing by $3$, so multiply both sides by $3$: $x-4=15$.",
"Undo subtracting $4$ by adding $4$: $x=19$.",
"Check: $\\frac{19-4}{3}=\\frac{15}{3}=5$. ✓"
],
"ans": "$x=19$"
},
"checks": [
{
"q": "Solve $4x-7=21$.",
"c": [
"$x=7$",
"$x=3.5$",
"$x=28$",
"$x=14$"
],
"why": "Add $7$: $4x=28$. Divide by $4$: $x=7$."
},
{
"q": "Solve $2(x+3)=18$.",
"c": [
"$x=6$",
"$x=7.5$",
"$x=9$",
"$x=12$"
],
"why": "Divide by $2$: $x+3=9$, so $x=6$."
}
]
}
],
[
{
"t": "Prime factorisation",
"x": "Every whole number bigger than $1$ is a product of primes in exactly one way. Find it with a **factor tree**: split into any two factors, keep splitting until every branch is prime.\n\nWrite the answer with powers: $360=2^3\\cdot3^2\\cdot5$.\n\nThe factorisation answers many questions at once. The GCD takes the *smaller* power of each shared prime; the LCM takes the *larger* power of every prime that appears.",
"ex": {
"q": "Find the least common multiple of $12$ and $18$.",
"steps": [
"$12=2^2\\cdot3$ and $18=2\\cdot3^2$.",
"Take the larger power of each prime: $2^2$ and $3^2$.",
"LCM $=4\\cdot9=36$."
],
"ans": "$36$"
},
"checks": [
{
"q": "What is the prime factorisation of $84$?",
"c": [
"$2^2\\cdot3\\cdot7$",
"$2\\cdot3\\cdot14$",
"$4\\cdot21$",
"$2^3\\cdot7$"
],
"why": "$84=2\\cdot42=2\\cdot2\\cdot21=2^2\\cdot3\\cdot7$. Only primes are allowed, so $14$ and $21$ must be split."
},
{
"q": "What is the largest prime factor of $195$?",
"c": [
"$13$",
"$5$",
"$39$",
"$15$"
],
"why": "$195=5\\cdot39=3\\cdot5\\cdot13$."
}
]
},
{
"t": "Area toolkit",
"x": "Three formulas cover most shapes: rectangle $=lw$, triangle $=\\frac12bh$, circle $=\\pi r^2$. A parallelogram is $bh$ and a trapezium is $\\frac{a+b}{2}h$ (average of the parallel sides times the height).\n\nThe height is always measured **perpendicular** to the base, not along a slanted side.\n\nFor an awkward shape, either cut it into simple pieces and add, or draw a big simple shape around it and subtract the extra.",
"ex": {
"q": "A rectangle is $10\\times6$. A triangle with base $10$ (the bottom side) and its top vertex on the top side is cut out. What area is left?",
"steps": [
"Rectangle area: $10\\times6=60$.",
"The triangle has base $10$ and height $6$: $\\frac12\\cdot10\\cdot6=30$.",
"Left over: $60-30=30$."
],
"ans": "$30$"
},
"checks": [
{
"q": "A trapezium has parallel sides $5$ and $9$ and height $4$. What is its area?",
"c": [
"$28$",
"$56$",
"$36$",
"$18$"
],
"why": "$\\frac{5+9}{2}\\cdot4=7\\cdot4=28$."
},
{
"q": "A circle has diameter $10$. What is its area?",
"c": [
"$25\\pi$",
"$100\\pi$",
"$10\\pi$",
"$20\\pi$"
],
"why": "The radius is $5$, so the area is $\\pi\\cdot5^2=25\\pi$."
}
]
},
{
"t": "Percent change",
"x": "Percent change compares the change to the **original** amount: $\\dfrac{\\text{new}-\\text{old}}{\\text{old}}\\times100\\%$.\n\nUse multipliers: up $20\\%$ means $\\times1.2$; down $20\\%$ means $\\times0.8$. Several changes in a row multiply: up $10\\%$ then up $10\\%$ is $\\times1.21$, a $21\\%$ rise.\n\nThat's why \"up $50\\%$ then down $50\\%$\" doesn't return to the start: $1.5\\times0.5=0.75$, a $25\\%$ loss.",
"ex": {
"q": "A price drops from $\\$80$ to $\\$60$. What is the percent decrease?",
"steps": [
"The change is $80-60=20$.",
"Compare with the original: $\\frac{20}{80}=\\frac14$.",
"That's a $25\\%$ decrease."
],
"ans": "$25\\%$"
},
"checks": [
{
"q": "A population of $500$ grows by $20\\%$ and then by another $10\\%$. What is it now?",
"c": [
"$660$",
"$650$",
"$600$",
"$700$"
],
"why": "$500\\times1.2=600$, then $600\\times1.1=660$."
},
{
"q": "After a $25\\%$ discount a jacket costs $\\$60$. What was the original price?",
"c": [
"$\\$80$",
"$\\$75$",
"$\\$85$",
"$\\$45$"
],
"why": "$0.75\\times\\text{price}=60$, so the price was $60\\div0.75=80$. (Adding $25\\%$ of $60$ is the trap.)"
}
]
}
],
[
{
"t": "Rates add up",
"x": "**Distance $=$ rate $\\times$ time**, and the same shape works for any rate: pages per hour, litres per minute.\n\nWhen people work **together**, add their rates, not their times. If A does a job in $a$ hours, A's rate is $\\frac1a$ of the job per hour.\n\nFor average speed over a whole trip, use total distance $\\div$ total time. Averaging the two speeds is usually wrong.",
"ex": {
"q": "A tap fills a tank in $4$ hours and a second tap fills it in $12$ hours. How long with both open?",
"steps": [
"Rates: $\\frac14$ and $\\frac1{12}$ of the tank per hour.",
"Together: $\\frac14+\\frac1{12}=\\frac3{12}+\\frac1{12}=\\frac4{12}=\\frac13$ tank per hour.",
"So it takes $3$ hours."
],
"ans": "$3$ hours"
},
"checks": [
{
"q": "You drive $60$ miles at $30$ mph and $60$ miles back at $60$ mph. What is your average speed?",
"c": [
"$40$ mph",
"$45$ mph",
"$50$ mph",
"$35$ mph"
],
"why": "Times: $2$ h and $1$ h. Total $120$ miles in $3$ hours: $40$ mph."
},
{
"q": "Two trains start $300$ km apart and drive towards each other at $70$ and $80$ km/h. When do they meet?",
"c": [
"After $2$ hours",
"After $4$ hours",
"After $1.5$ hours",
"After $3$ hours"
],
"why": "They close the gap at $70+80=150$ km/h: $300\\div150=2$ hours."
}
]
},
{
"t": "Multiply choices",
"x": "If a task happens in **stages**, and stage one has $m$ options while stage two has $n$ options (whatever you picked first), there are $m\\times n$ ways in total. This is the **multiplication principle**.\n\nIt works for any number of stages: a $3$-letter code from $26$ letters has $26^3$ options.\n\nWatch for restrictions. If letters can't repeat, the stages shrink: $26\\times25\\times24$.",
"ex": {
"q": "How many $3$-digit numbers have all digits odd?",
"steps": [
"Each of the three digits can be $1,3,5,7$ or $9$: $5$ choices.",
"Three independent stages: $5\\times5\\times5$.",
"$125$ numbers."
],
"ans": "$125$"
},
"checks": [
{
"q": "A menu has $4$ starters, $5$ mains and $3$ desserts. How many three-course meals are there?",
"c": [
"$60$",
"$12$",
"$20$",
"$15$"
],
"why": "$4\\times5\\times3=60$."
},
{
"q": "How many ways can gold, silver and bronze go to $8$ runners?",
"c": [
"$336$",
"$512$",
"$24$",
"$56$"
],
"why": "Gold $8$ ways, then silver $7$, then bronze $6$: $8\\cdot7\\cdot6=336$."
}
]
},
{
"t": "Pythagoras",
"x": "In a right triangle with legs $a, b$ and hypotenuse $c$ (the side opposite the right angle, always the longest): $a^2+b^2=c^2$.\n\nTo find a leg, subtract: $b^2=c^2-a^2$.\n\nMemorise the common triples, and their multiples: $3$-$4$-$5$ ($6$-$8$-$10$, $9$-$12$-$15$), $5$-$12$-$13$, $8$-$15$-$17$, $7$-$24$-$25$. They turn many problems into recognition.",
"ex": {
"q": "A rectangle is $9$ by $12$. How long is its diagonal?",
"steps": [
"The diagonal is the hypotenuse of a right triangle with legs $9$ and $12$.",
"$9^2+12^2=81+144=225$.",
"$\\sqrt{225}=15$ (it's $3\\times$ the $3$-$4$-$5$ triangle)."
],
"ans": "$15$"
},
"checks": [
{
"q": "A right triangle has hypotenuse $26$ and one leg $10$. What is the other leg?",
"c": [
"$24$",
"$16$",
"$28$",
"$36$"
],
"why": "$26^2-10^2=676-100=576=24^2$. (It's $2\\times$ the $5$-$12$-$13$.)"
},
{
"q": "Which of these is a right triangle?",
"c": [
"$8, 15, 17$",
"$6, 8, 11$",
"$5, 11, 12$",
"$7, 9, 12$"
],
"why": "$8^2+15^2=64+225=289=17^2$."
}
]
}
],
[
{
"t": "Name the unknown",
"x": "For a word problem, first decide **what to call $x$**: usually the thing the question asks for, or the smallest quantity.\n\nThen translate sentence by sentence: \"is\" becomes $=$, \"more than\" becomes $+$, \"times\" becomes $\\times$, \"of\" usually becomes $\\times$.\n\nSolve, then answer the actual question asked, with units.",
"ex": {
"q": "Sam is $3$ times as old as his son. In $12$ years he'll be twice as old. How old is the son now?",
"steps": [
"Let the son be $x$; Sam is $3x$.",
"In $12$ years: $3x+12=2(x+12)$.",
"$3x+12=2x+24$, so $x=12$. Check: $36+12=48=2\\cdot24$. ✓"
],
"ans": "$12$"
},
"checks": [
{
"q": "Three consecutive integers add to $84$. What is the largest?",
"c": [
"$29$",
"$28$",
"$27$",
"$30$"
],
"why": "$x+(x+1)+(x+2)=3x+3=84$ gives $x=27$, so the largest is $29$."
},
{
"q": "A number plus half of itself is $27$. What is the number?",
"c": [
"$18$",
"$13.5$",
"$9$",
"$54$"
],
"why": "$x+\\frac x2=\\frac{3x}{2}=27$, so $x=18$."
}
]
},
{
"t": "Simplify first",
"x": "Before multiplying big numbers, **cancel** common factors. It's faster and you're far less likely to slip.\n\nLook for structure: $99\\times7=(100-1)\\times7=693$, and $25\\times36=25\\times4\\times9=900$.\n\nFractions of products cancel across the bar: in $\\frac{a\\cdot b}{c\\cdot d}$ you may cancel any factor on top with any factor below.",
"ex": {
"q": "Compute $\\dfrac{36\\times25}{15\\times12}$.",
"steps": [
"Cancel $36$ with $12$: $\\frac{36}{12}=3$.",
"Cancel $25$ with $15$: $\\frac{25}{15}=\\frac53$.",
"$3\\times\\frac53=5$."
],
"ans": "$5$"
},
"checks": [
{
"q": "What is $\\dfrac{2^{10}}{2^{7}}$?",
"c": [
"$8$",
"$2^{17}$",
"$\\frac{10}{7}$",
"$3$"
],
"why": "Cancel seven $2$s: $2^{10-7}=2^3=8$."
},
{
"q": "What is $48\\times125$?",
"c": [
"$6000$",
"$5000$",
"$6200$",
"$4800$"
],
"why": "$48\\times125=6\\times8\\times125=6\\times1000$."
}
]
},
{
"t": "Estimate to check",
"x": "Before or after working something out, round the numbers and get a rough answer. If the exact answer is far away, something went wrong.\n\nEstimation also **eliminates** wrong multiple-choice answers fast: $\\frac{397}{0.49}$ is about $400\\div\\frac12=800$.\n\nKnow whether your rounding made the estimate too big or too small, so you know which way the true answer lies.",
"ex": {
"q": "Estimate $\\dfrac{612\\times0.48}{3.1}$.",
"steps": [
"Round: $600\\times0.5=300$.",
"Divide by about $3$: $100$.",
"The exact value is about $94.8$, close to the estimate."
],
"ans": "about $100$"
},
"checks": [
{
"q": "Which is closest to $\\sqrt{50}\\times\\sqrt{18}$?",
"c": [
"$30$",
"$68$",
"$900$",
"$9$"
],
"why": "$\\sqrt{50\\cdot18}=\\sqrt{900}=30$ exactly."
},
{
"q": "$19.8\\times5.1$ is closest to:",
"c": [
"$100$",
"$95$",
"$1000$",
"$25$"
],
"why": "$20\\times5=100$; the exact value is $100.98$."
}
]
}
]
],
"algebra": [
[
{
"t": "Solving linear equations",
"x": "A linear equation has $x$ only to the first power. The plan: **expand** brackets, **collect** the $x$ terms on one side and numbers on the other, then **divide**.\n\nMove a term across by doing the opposite operation to both sides; it changes sign as it crosses.\n\nWith fractions, multiply every term by the common denominator first to clear them.",
"ex": {
"q": "Solve $5x-3=2x+12$.",
"steps": [
"Subtract $2x$ from both sides: $3x-3=12$.",
"Add $3$: $3x=15$.",
"Divide by $3$: $x=5$."
],
"ans": "$x=5$"
},
"checks": [
{
"q": "Solve $3(x-2)=x+8$.",
"c": [
"$x=7$",
"$x=5$",
"$x=3$",
"$x=1$"
],
"why": "Expand: $3x-6=x+8$. Then $2x=14$, $x=7$."
},
{
"q": "Solve $\\frac{x}{2}+\\frac{x}{3}=10$.",
"c": [
"$x=12$",
"$x=6$",
"$x=60$",
"$x=2$"
],
"why": "Multiply by $6$: $3x+2x=60$, so $5x=60$ and $x=12$."
}
]
},
{
"t": "Slope",
"x": "The **slope** of a line measures steepness: rise over run, $m=\\dfrac{y_2-y_1}{x_2-x_1}$.\n\nPositive slope goes up to the right, negative goes down, zero is horizontal, and a vertical line has undefined slope.\n\nParallel lines have equal slopes. Perpendicular lines have slopes that multiply to $-1$, like $2$ and $-\\frac12$.",
"ex": {
"q": "Find the slope of the line through $(1,4)$ and $(5,-4)$.",
"steps": [
"Rise: $-4-4=-8$.",
"Run: $5-1=4$.",
"$m=\\frac{-8}{4}=-2$."
],
"ans": "$-2$"
},
"checks": [
{
"q": "What is the slope through $(-2,1)$ and $(4,4)$?",
"c": [
"$\\frac12$",
"$2$",
"$-\\frac12$",
"$\\frac32$"
],
"why": "$\\frac{4-1}{4-(-2)}=\\frac36=\\frac12$."
},
{
"q": "A line has slope $\\frac23$. What is the slope of a perpendicular line?",
"c": [
"$-\\frac32$",
"$\\frac32$",
"$-\\frac23$",
"$\\frac23$"
],
"why": "Perpendicular slopes multiply to $-1$: $\\frac23\\cdot(-\\frac32)=-1$."
}
]
},
{
"t": "Slope-intercept form",
"x": "Every non-vertical line can be written $y=mx+b$, where $m$ is the slope and $b$ is the **$y$-intercept** (where it crosses the $y$-axis, at $x=0$).\n\nTo find the equation from a point and a slope, plug the point in to get $b$.\n\nTo find where a line crosses the $x$-axis, set $y=0$ and solve.",
"ex": {
"q": "Find the line with slope $3$ through $(2,1)$.",
"steps": [
"Start with $y=3x+b$.",
"Plug in $(2,1)$: $1=6+b$, so $b=-5$.",
"The line is $y=3x-5$."
],
"ans": "$y=3x-5$"
},
"checks": [
{
"q": "Where does $y=-2x+6$ cross the $x$-axis?",
"c": [
"$(3,0)$",
"$(6,0)$",
"$(-3,0)$",
"$(0,6)$"
],
"why": "Set $y=0$: $-2x+6=0$, $x=3$. ($(0,6)$ is the $y$-intercept.)"
},
{
"q": "What is the slope of $2x+4y=8$?",
"c": [
"$-\\frac12$",
"$2$",
"$\\frac12$",
"$-2$"
],
"why": "Solve for $y$: $y=-\\frac12x+2$."
}
]
}
],
[
{
"t": "Elimination",
"x": "To solve two equations in two unknowns, combine them so one variable **cancels**.\n\nLine up the equations; multiply one or both so the coefficients of one variable match (or are opposites); then subtract (or add). Solve for the remaining variable and substitute back.\n\nSometimes adding the equations directly is a shortcut: if $x+y=10$ and $x-y=4$, adding gives $2x=14$.",
"ex": {
"q": "Solve $2x+3y=12$ and $x-y=1$.",
"steps": [
"Multiply the second by $3$: $3x-3y=3$.",
"Add to the first: $5x=15$, so $x=3$.",
"Then $y=x-1=2$. Check: $6+6=12$. ✓"
],
"ans": "$x=3,\\ y=2$"
},
"checks": [
{
"q": "If $x+y=9$ and $x-y=3$, what is $x$?",
"c": [
"$6$",
"$3$",
"$12$",
"$4.5$"
],
"why": "Add: $2x=12$, so $x=6$."
},
{
"q": "If $3a+2b=16$ and $a+2b=8$, what is $a$?",
"c": [
"$4$",
"$2$",
"$8$",
"$3$"
],
"why": "Subtract: $2a=8$, so $a=4$."
}
]
},
{
"t": "Exponent rules",
"x": "Same base: **multiply → add exponents** ($a^3a^4=a^7$), **divide → subtract** ($a^7/a^2=a^5$), **power of a power → multiply** ($(a^3)^2=a^6$).\n\nAlso $a^0=1$, $a^{-n}=\\frac1{a^n}$, and $a^{1/n}=\\sqrt[n]{a}$.\n\nTo compare or combine different bases, rewrite them with a common base: $8^2=(2^3)^2=2^6$.",
"ex": {
"q": "Solve $4^{x}=8^{2}$.",
"steps": [
"Write both as powers of $2$: $4^x=2^{2x}$ and $8^2=2^6$.",
"So $2x=6$.",
"$x=3$."
],
"ans": "$x=3$"
},
"checks": [
{
"q": "Simplify $\\dfrac{x^5\\cdot x^3}{x^2}$.",
"c": [
"$x^6$",
"$x^{13}$",
"$x^{7.5}$",
"$x^{4}$"
],
"why": "$x^{5+3-2}=x^6$."
},
{
"q": "What is $27^{2/3}$?",
"c": [
"$9$",
"$18$",
"$3$",
"$81$"
],
"why": "$27^{1/3}=3$, then squared is $9$."
}
]
},
{
"t": "Absolute value",
"x": "$|x|$ is the **distance** from $x$ to $0$, so it's never negative. $|x-a|$ is the distance between $x$ and $a$.\n\n$|x-a|=b$ (with $b>0$) has two solutions: $x=a+b$ and $x=a-b$.\n\n$|x-a|<b$ means \"within $b$ of $a$\": $a-b<x<a+b$. And $|x-a|>b$ means \"farther than $b$\": $x<a-b$ or $x>a+b$.",
"ex": {
"q": "Solve $|2x-3|=7$.",
"steps": [
"Either $2x-3=7$ or $2x-3=-7$.",
"First: $2x=10$, $x=5$.",
"Second: $2x=-4$, $x=-2$."
],
"ans": "$x=5$ or $x=-2$"
},
"checks": [
{
"q": "How many integers satisfy $|x-4|<3$?",
"c": [
"$5$",
"$6$",
"$7$",
"$3$"
],
"why": "$1<x<7$: the integers $2,3,4,5,6$."
},
{
"q": "What is the sum of the solutions of $|x+1|=6$?",
"c": [
"$-2$",
"$0$",
"$12$",
"$5$"
],
"why": "$x=5$ or $x=-7$; the sum is $-2$ (twice the centre, $-1$)."
}
]
}
],
[
{
"t": "Factoring",
"x": "To factor $x^2+bx+c$, find two numbers that **multiply to $c$** and **add to $b$**: $x^2+7x+12=(x+3)(x+4)$.\n\nWatch for special patterns: difference of squares $a^2-b^2=(a-b)(a+b)$, and perfect squares $a^2\\pm2ab+b^2=(a\\pm b)^2$.\n\nOnce factored, set each factor to zero to solve: a product is zero only if a factor is.",
"ex": {
"q": "Solve $x^2-x-12=0$.",
"steps": [
"Need two numbers with product $-12$ and sum $-1$: $-4$ and $3$.",
"$(x-4)(x+3)=0$.",
"$x=4$ or $x=-3$."
],
"ans": "$x=4$ or $x=-3$"
},
"checks": [
{
"q": "Factor $x^2-49$.",
"c": [
"$(x-7)(x+7)$",
"$(x-7)^2$",
"$(x-49)(x+1)$",
"$x(x-49)$"
],
"why": "Difference of squares with $a=x$, $b=7$."
},
{
"q": "Compute $101^2-99^2$ quickly.",
"c": [
"$400$",
"$200$",
"$4$",
"$2$"
],
"why": "$(101-99)(101+99)=2\\cdot200=400$."
}
]
},
{
"t": "The quadratic formula",
"x": "Every quadratic $ax^2+bx+c=0$ is solved by $x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}$.\n\nThe **discriminant** $b^2-4ac$ tells you how many real roots there are: positive → two, zero → one (a double root), negative → none.\n\nUse the formula when factoring isn't obvious; it never fails.",
"ex": {
"q": "Solve $x^2+4x-1=0$.",
"steps": [
"$a=1,b=4,c=-1$; discriminant $16+4=20$.",
"$x=\\frac{-4\\pm\\sqrt{20}}{2}=\\frac{-4\\pm2\\sqrt5}{2}$.",
"$x=-2\\pm\\sqrt5$."
],
"ans": "$x=-2\\pm\\sqrt5$"
},
"checks": [
{
"q": "How many real solutions does $2x^2+3x+5=0$ have?",
"c": [
"None",
"One",
"Two",
"Infinitely many"
],
"why": "$b^2-4ac=9-40<0$."
},
{
"q": "For which $k$ does $x^2+6x+k=0$ have exactly one solution?",
"c": [
"$9$",
"$36$",
"$6$",
"$3$"
],
"why": "Need $36-4k=0$, so $k=9$: $(x+3)^2=0$."
}
]
},
{
"t": "Vieta's formulas",
"x": "If $ax^2+bx+c=0$ has roots $r$ and $s$, then $r+s=-\\dfrac{b}{a}$ and $rs=\\dfrac{c}{a}$, without solving!\n\nThis lets you compute symmetric expressions: $r^2+s^2=(r+s)^2-2rs$ and $\\frac1r+\\frac1s=\\frac{r+s}{rs}$.\n\nGoing backwards, a quadratic with roots $r,s$ is $x^2-(r+s)x+rs$.",
"ex": {
"q": "The roots of $x^2-5x+3=0$ are $r$ and $s$. Find $r^2+s^2$.",
"steps": [
"$r+s=5$ and $rs=3$.",
"$r^2+s^2=(r+s)^2-2rs=25-6$.",
"$=19$."
],
"ans": "$19$"
},
"checks": [
{
"q": "What is the product of the roots of $2x^2-7x+6=0$?",
"c": [
"$3$",
"$6$",
"$\\frac72$",
"$-3$"
],
"why": "$\\frac ca=\\frac62=3$."
},
{
"q": "Which quadratic has roots $2$ and $-5$?",
"c": [
"$x^2+3x-10$",
"$x^2-3x-10$",
"$x^2+3x+10$",
"$x^2-7x+10$"
],
"why": "Sum $-3$, product $-10$: $x^2-(-3)x+(-10)$."
}
]
}
],
[
{
"t": "Composition",
"x": "$f(g(x))$ means: feed $x$ into $g$, then feed the result into $f$. Work **inside out**.\n\nOrder matters: usually $f(g(x))\\neq g(f(x))$.\n\nTo find a composition as a formula, substitute the whole expression $g(x)$ wherever $f$ has $x$.",
"ex": {
"q": "If $f(x)=2x+1$ and $g(x)=x^2$, find $f(g(3))$ and $g(f(3))$.",
"steps": [
"$g(3)=9$, so $f(g(3))=f(9)=19$.",
"$f(3)=7$, so $g(f(3))=g(7)=49$.",
"Different answers: order matters."
],
"ans": "$19$ and $49$"
},
"checks": [
{
"q": "If $f(x)=x-3$ and $g(x)=2x$, what is $f(g(x))$?",
"c": [
"$2x-3$",
"$2x-6$",
"$2x^2-3$",
"$x-6$"
],
"why": "Replace $x$ in $f$ with $2x$: $2x-3$."
},
{
"q": "If $h(x)=3x-2$, what is $h(h(2))$?",
"c": [
"$10$",
"$4$",
"$16$",
"$12$"
],
"why": "$h(2)=4$, then $h(4)=10$."
}
]
},
{
"t": "Completing the square",
"x": "Rewrite $x^2+bx$ as a square minus a correction: $x^2+bx=\\left(x+\\frac b2\\right)^2-\\frac{b^2}{4}$.\n\nThis turns any quadratic into **vertex form** $a(x-h)^2+k$, which shows the minimum or maximum value $k$ at $x=h$.\n\nIt's also how the quadratic formula is proved.",
"ex": {
"q": "Find the minimum value of $x^2-6x+14$.",
"steps": [
"$x^2-6x=(x-3)^2-9$.",
"So $x^2-6x+14=(x-3)^2+5$.",
"A square is at least $0$, so the minimum is $5$, at $x=3$."
],
"ans": "$5$"
},
"checks": [
{
"q": "Write $x^2+10x+30$ in vertex form.",
"c": [
"$(x+5)^2+5$",
"$(x+10)^2-70$",
"$(x+5)^2+30$",
"$(x-5)^2+5$"
],
"why": "$x^2+10x=(x+5)^2-25$, plus $30$ gives $+5$."
},
{
"q": "What is the maximum of $-x^2+4x$?",
"c": [
"$4$",
"$2$",
"$0$",
"$-4$"
],
"why": "$-(x^2-4x)=-(x-2)^2+4$."
}
]
},
{
"t": "Arithmetic series",
"x": "An **arithmetic sequence** adds the same difference $d$ each time: $a, a+d, a+2d,\\dots$ The $n$-th term is $a+(n-1)d$.\n\nThe sum of $n$ terms is $\\dfrac{n(\\text{first}+\\text{last})}{2}$: pair the first with the last, the second with the second-last, and so on.\n\nCount terms carefully: from $5$ to $50$ in steps of $5$ there are $\\frac{50-5}{5}+1=10$ terms.",
"ex": {
"q": "Find $3+7+11+\\dots+99$.",
"steps": [
"$d=4$; the number of terms is $\\frac{99-3}{4}+1=25$.",
"Sum $=\\frac{25(3+99)}{2}=\\frac{25\\cdot102}{2}$.",
"$=1275$."
],
"ans": "$1275$"
},
"checks": [
{
"q": "What is $1+2+\\dots+100$?",
"c": [
"$5050$",
"$5000$",
"$10100$",
"$4950$"
],
"why": "$\\frac{100\\cdot101}{2}=5050$."
},
{
"q": "What is the $20$th term of $2, 5, 8, \\dots$?",
"c": [
"$59$",
"$62$",
"$60$",
"$57$"
],
"why": "$2+19\\cdot3=59$."
}
]
}
],
[
{
"t": "Rationalising",
"x": "To clear a square root from a denominator, multiply top and bottom by something that removes it.\n\nA single root: $\\frac{1}{\\sqrt3}=\\frac{\\sqrt3}{3}$. A sum or difference: multiply by the **conjugate**, since $(a+\\sqrt b)(a-\\sqrt b)=a^2-b$.\n\nSimplify roots first by pulling out square factors: $\\sqrt{72}=\\sqrt{36\\cdot2}=6\\sqrt2$.",
"ex": {
"q": "Rationalise $\\dfrac{2}{\\sqrt5-1}$.",
"steps": [
"Multiply top and bottom by the conjugate $\\sqrt5+1$.",
"Bottom: $(\\sqrt5)^2-1^2=4$.",
"$\\frac{2(\\sqrt5+1)}{4}=\\frac{\\sqrt5+1}{2}$."
],
"ans": "$\\frac{\\sqrt5+1}{2}$"
},
"checks": [
{
"q": "Simplify $\\sqrt{50}+\\sqrt{18}$.",
"c": [
"$8\\sqrt2$",
"$\\sqrt{68}$",
"$2\\sqrt{17}$",
"$15\\sqrt2$"
],
"why": "$5\\sqrt2+3\\sqrt2=8\\sqrt2$."
},
{
"q": "What is $\\dfrac{1}{\\sqrt2+1}$?",
"c": [
"$\\sqrt2-1$",
"$\\sqrt2+1$",
"$\\frac{\\sqrt2}{2}$",
"$1-\\sqrt2$"
],
"why": "Multiply by $\\sqrt2-1$: the bottom becomes $2-1=1$."
}
]
},
{
"t": "Domains",
"x": "The **domain** is every input a formula accepts. Two rules catch almost everything: **no dividing by zero**, and **no square roots of negatives** (in the real numbers).\n\nFor $\\frac{1}{x-2}$, exclude $x=2$. For $\\sqrt{x+3}$, need $x\\ge-3$. Combine all the conditions.\n\nThe **range** is every output the function actually produces.",
"ex": {
"q": "Find the domain of $f(x)=\\dfrac{\\sqrt{x-1}}{x-4}$.",
"steps": [
"The root needs $x-1\\ge0$, so $x\\ge1$.",
"The denominator needs $x\\neq4$.",
"Domain: $x\\ge1$, $x\\ne4$."
],
"ans": "$[1,4)\\cup(4,\\infty)$"
},
"checks": [
{
"q": "Which value is NOT in the domain of $\\dfrac{x}{x^2-9}$?",
"c": [
"$3$",
"$0$",
"$9$",
"$-9$"
],
"why": "$x^2-9=0$ at $x=\\pm3$."
},
{
"q": "What is the range of $y=x^2+2$?",
"c": [
"$y\\ge2$",
"all real numbers",
"$y\\ge0$",
"$y>2$"
],
"why": "$x^2\\ge0$, so $y\\ge2$, reached at $x=0$."
}
]
},
{
"t": "Symmetry",
"x": "Look for **symmetry** before grinding. If swapping $x$ and $y$ leaves a system unchanged, try setting $x=y$, or use $x+y$ and $xy$.\n\nPairing helps too: in a sum, pair terms from opposite ends; in a product of factors, pair terms that combine nicely.\n\nA good substitution can turn a scary equation into a quadratic: in $x^4-5x^2+4=0$, let $u=x^2$.",
"ex": {
"q": "Solve $x^4-5x^2+4=0$.",
"steps": [
"Let $u=x^2$: $u^2-5u+4=0$.",
"$(u-1)(u-4)=0$, so $u=1$ or $4$.",
"$x=\\pm1$ or $x=\\pm2$."
],
"ans": "$x=\\pm1,\\pm2$"
},
"checks": [
{
"q": "If $x+y=7$ and $xy=10$, what is $x^2+y^2$?",
"c": [
"$29$",
"$49$",
"$39$",
"$69$"
],
"why": "$(x+y)^2-2xy=49-20=29$."
},
{
"q": "If $x+\\frac1x=3$, what is $x^2+\\frac1{x^2}$?",
"c": [
"$7$",
"$9$",
"$11$",
"$6$"
],
"why": "Square: $x^2+2+\\frac1{x^2}=9$, so $x^2+\\frac1{x^2}=7$."
}
]
}
]
],
"number_theory": [
[
{
"t": "Divisibility tests",
"x": "You can test divisibility without dividing:\n• **2, 5, 10**: look at the last digit.\n• **4**: the last two digits form a multiple of $4$. **8**: the last three digits.\n• **3, 9**: the digit sum is a multiple of $3$ (or $9$).\n• **11**: the alternating sum of digits ($+-+-\\dots$) is a multiple of $11$.\n\nFor **6**, test $2$ and $3$; for **12**, test $3$ and $4$. Combine tests for coprime factors.",
"ex": {
"q": "Is $7\\,128$ divisible by $12$?",
"steps": [
"Test $4$: the last two digits are $28$, a multiple of $4$. ✓",
"Test $3$: digit sum $7+1+2+8=18$, a multiple of $3$. ✓",
"$3$ and $4$ are coprime, so it's divisible by $12$ ($7128=12\\times594$)."
],
"ans": "Yes"
},
"checks": [
{
"q": "Which digit $d$ makes $57d$ divisible by $9$?",
"c": [
"$6$",
"$3$",
"$0$",
"$9$"
],
"why": "Digit sum $12+d$ must be a multiple of $9$: $d=6$."
},
{
"q": "Which of these is divisible by $11$?",
"c": [
"$9\\,284$",
"$9\\,285$",
"$8\\,294$",
"$9\\,248$"
],
"why": "Alternating sums: $9-2+8-4=11$ ✓. For $9285$ it's $12$, for $8294$ it's $-1$, for $9248$ it's $3$."
}
]
},
{
"t": "Unique factorisation",
"x": "Every integer greater than $1$ factors into primes in **exactly one way** (up to order). This is the Fundamental Theorem of Arithmetic.\n\nConsequences you use all the time: if a prime divides a product, it divides one of the factors; a number is a perfect square exactly when every prime exponent is even; a cube when every exponent is a multiple of $3$.\n\nSo to make $n$ a square, look at which exponents are odd.",
"ex": {
"q": "What is the smallest positive $k$ such that $72k$ is a perfect square?",
"steps": [
"$72=2^3\\cdot3^2$.",
"The exponent of $2$ is odd; the exponent of $3$ is even.",
"Multiply by one more $2$: $k=2$, giving $144=12^2$."
],
"ans": "$2$"
},
"checks": [
{
"q": "What is the smallest $k$ with $50k$ a perfect cube?",
"c": [
"$20$",
"$2$",
"$5$",
"$10$"
],
"why": "$50=2\\cdot5^2$. Need $2^3\\cdot5^3$: multiply by $2^2\\cdot5=20$."
},
{
"q": "How many primes divide $2^4\\cdot3^2\\cdot7$?",
"c": [
"$3$",
"$7$",
"$4$",
"$8$"
],
"why": "The distinct primes are $2$, $3$ and $7$."
}
]
},
{
"t": "GCD times LCM",
"x": "For positive integers, $\\gcd(a,b)\\times\\text{lcm}(a,b)=a\\times b$.\n\nWhy: in the prime factorisations, the GCD takes the smaller power of each prime and the LCM the larger. Together they use each power exactly once.\n\nSo if you know three of $a, b$, GCD and LCM, you know the fourth.",
"ex": {
"q": "Two numbers have GCD $6$ and LCM $72$. One is $18$. What is the other?",
"steps": [
"Product of the numbers $=6\\times72=432$.",
"The other is $432\\div18$.",
"$=24$. Check: $\\gcd(18,24)=6$, $\\text{lcm}=72$. ✓"
],
"ans": "$24$"
},
"checks": [
{
"q": "What is $\\text{lcm}(21,35)$?",
"c": [
"$105$",
"$735$",
"$7$",
"$70$"
],
"why": "$\\gcd=7$, so $\\text{lcm}=\\frac{21\\cdot35}{7}=105$."
},
{
"q": "If $\\gcd(a,b)=1$, what is $\\text{lcm}(a,b)$?",
"c": [
"$ab$",
"$1$",
"$a+b$",
"$\\max(a,b)$"
],
"why": "Coprime numbers share nothing, so the LCM is the full product."
}
]
}
],
[
{
"t": "Work mod n",
"x": "\"$a\\equiv b\\pmod n$\" means $a$ and $b$ leave the same remainder when divided by $n$.\n\nYou can **add, subtract and multiply** remainders freely: to find the remainder of a big expression, reduce each piece first. $17\\times23\\pmod 5$: $17\\equiv2$, $23\\equiv3$, so the product $\\equiv6\\equiv1$.\n\nNegative remainders are allowed and often handy: $99\\equiv-1\\pmod{100}$.",
"ex": {
"q": "What is the remainder when $2^{10}$ is divided by $7$?",
"steps": [
"$2^3=8\\equiv1\\pmod 7$.",
"$2^{10}=(2^3)^3\\cdot2\\equiv1^3\\cdot2$.",
"Remainder $2$ (check: $1024=7\\cdot146+2$)."
],
"ans": "$2$"
},
"checks": [
{
"q": "What is the remainder of $47\\times52$ divided by $5$?",
"c": [
"$4$",
"$2$",
"$0$",
"$1$"
],
"why": "$47\\equiv2$, $52\\equiv2$, product $\\equiv4$."
},
{
"q": "What is the remainder of $99^{5}$ divided by $100$?",
"c": [
"$99$",
"$1$",
"$0$",
"$95$"
],
"why": "$99\\equiv-1$, so $99^5\\equiv(-1)^5=-1\\equiv99$."
}
]
},
{
"t": "Counting divisors",
"x": "If $n=p^a q^b r^c\\cdots$, every divisor picks an exponent for each prime: $0$ to $a$ for $p$, $0$ to $b$ for $q$, and so on.\n\nSo the number of divisors is $(a+1)(b+1)(c+1)\\cdots$.\n\nDivisors come in pairs $d$ and $\\frac nd$, so the count is odd exactly when $n$ is a perfect square.",
"ex": {
"q": "How many positive divisors does $360$ have?",
"steps": [
"$360=2^3\\cdot3^2\\cdot5^1$.",
"Choices of exponents: $4$, $3$ and $2$.",
"$4\\cdot3\\cdot2=24$ divisors."
],
"ans": "$24$"
},
"checks": [
{
"q": "How many divisors does $2^5\\cdot7^2$ have?",
"c": [
"$18$",
"$10$",
"$7$",
"$12$"
],
"why": "$(5+1)(2+1)=18$."
},
{
"q": "Which number has an odd number of divisors?",
"c": [
"$49$",
"$48$",
"$50$",
"$51$"
],
"why": "Only perfect squares do: $49=7^2$ has $1,7,49$."
}
]
},
{
"t": "Cycles",
"x": "Last digits of powers **repeat in cycles**. Powers of $7$ end in $7, 9, 3, 1, 7, 9, 3, 1,\\dots$, a cycle of length $4$.\n\nTo find the last digit of $7^{n}$, find where $n$ falls in the cycle: use $n\\bmod 4$ (with remainder $0$ meaning the last spot).\n\nThe same idea works for remainders mod anything: powers mod $m$ always eventually cycle.",
"ex": {
"q": "What is the units digit of $3^{2025}$?",
"steps": [
"Powers of $3$ end in $3, 9, 7, 1$: cycle length $4$.",
"$2025=4\\cdot506+1$, remainder $1$.",
"So it matches $3^1$: units digit $3$."
],
"ans": "$3$"
},
"checks": [
{
"q": "What is the units digit of $2^{100}$?",
"c": [
"$6$",
"$2$",
"$4$",
"$8$"
],
"why": "Cycle $2,4,8,6$; $100\\equiv0\\pmod4$ means the 4th spot: $6$."
},
{
"q": "What is the units digit of $9^{51}$?",
"c": [
"$9$",
"$1$",
"$3$",
"$7$"
],
"why": "Powers of $9$ alternate $9,1$; odd exponents give $9$."
}
]
}
],
[
{
"t": "Bases",
"x": "In base $b$, digits run from $0$ to $b-1$ and each place is worth a power of $b$: $\\overline{213}_5=2\\cdot25+1\\cdot5+3=58$.\n\nTo convert **to** base $b$, repeatedly divide by $b$ and read the remainders from bottom to top.\n\nBase $2$ (binary) uses only $0$ and $1$; every number is a sum of distinct powers of $2$.",
"ex": {
"q": "Write $45$ in base $3$.",
"steps": [
"$45\\div3=15$ r $0$; $15\\div3=5$ r $0$; $5\\div3=1$ r $2$; $1\\div3=0$ r $1$.",
"Read the remainders upwards: $1200$.",
"Check: $27+2\\cdot9+0+0=45$. ✓"
],
"ans": "$1200_3$"
},
"checks": [
{
"q": "What is $\\overline{1011}_2$ in base $10$?",
"c": [
"$11$",
"$13$",
"$1011$",
"$9$"
],
"why": "$8+0+2+1=11$."
},
{
"q": "What is $\\overline{34}_8+\\overline{17}_8$ in base $10$?",
"c": [
"$43$",
"$51$",
"$41$",
"$53$"
],
"why": "$28+15=43$."
}
]
},
{
"t": "Euclidean algorithm",
"x": "$\\gcd(a,b)=\\gcd(b,\\ a\\bmod b)$: any common divisor of $a$ and $b$ also divides the remainder.\n\nSo repeatedly replace the bigger number by its remainder until you reach $0$; the last nonzero number is the GCD. It's fast even for huge numbers.\n\nSubtraction works too: $\\gcd(a,b)=\\gcd(a-b,b)$.",
"ex": {
"q": "Find $\\gcd(252,198)$.",
"steps": [
"$252=1\\cdot198+54$, so $\\gcd(198,54)$.",
"$198=3\\cdot54+36$, so $\\gcd(54,36)$; $54=1\\cdot36+18$; $36=2\\cdot18+0$.",
"The GCD is $18$."
],
"ans": "$18$"
},
"checks": [
{
"q": "What is $\\gcd(91,65)$?",
"c": [
"$13$",
"$7$",
"$5$",
"$1$"
],
"why": "$91-65=26$; $\\gcd(65,26)$: $65=2\\cdot26+13$; $26=2\\cdot13$. GCD $13$."
},
{
"q": "What is $\\gcd(n, n+6)$ when $n$ is odd and not a multiple of $3$?",
"c": [
"$1$",
"$6$",
"$2$",
"$3$"
],
"why": "It divides $(n+6)-n=6$, but $n$ shares no factor $2$ or $3$."
}
]
},
{
"t": "Neighbours are coprime",
"x": "Consecutive integers $n$ and $n+1$ always have $\\gcd=1$: any common divisor divides their difference, $1$.\n\nMore generally, $\\gcd(n, n+k)$ divides $k$. So $n$ and $n+2$ share at most a factor of $2$.\n\nThis is useful in proofs: if $n(n+1)$ is a perfect square, each factor must be a square on its own (they share no primes), which is impossible for positive $n$.",
"ex": {
"q": "What are the possible values of $\\gcd(n, n+4)$?",
"steps": [
"Any common divisor divides $(n+4)-n=4$.",
"So the GCD is $1$, $2$ or $4$.",
"All occur: $n=1$ gives $1$, $n=2$ gives $2$, $n=4$ gives $4$."
],
"ans": "$1$, $2$ or $4$"
},
"checks": [
{
"q": "What is $\\gcd(1000, 1001)$?",
"c": [
"$1$",
"$7$",
"$1000$",
"$11$"
],
"why": "Consecutive integers are coprime."
},
{
"q": "What is the largest possible $\\gcd(n, n+10)$?",
"c": [
"$10$",
"$5$",
"$2$",
"$1$"
],
"why": "It divides $10$, and $n=10$ achieves it."
}
]
}
],
[
{
"t": "Fermat's little theorem",
"x": "If $p$ is prime and $p$ doesn't divide $a$, then $a^{p-1}\\equiv1\\pmod p$.\n\nSo exponents can be reduced **mod $p-1$**: $3^{100}\\pmod 7$: $3^6\\equiv1$, and $100=6\\cdot16+4$, so $3^{100}\\equiv3^4=81\\equiv4$.\n\nA related form, true for every $a$: $a^p\\equiv a\\pmod p$.",
"ex": {
"q": "Find $2^{100}\\bmod 13$.",
"steps": [
"$13$ is prime, so $2^{12}\\equiv1$.",
"$100=12\\cdot8+4$, so $2^{100}\\equiv2^4=16$.",
"$16\\equiv3\\pmod{13}$."
],
"ans": "$3$"
},
"checks": [
{
"q": "What is $5^{22}\\bmod 11$?",
"c": [
"$3$",
"$1$",
"$5$",
"$4$"
],
"why": "$5^{10}\\equiv1$, so $5^{22}\\equiv5^2=25\\equiv3$."
},
{
"q": "What is $7^{7}\\bmod 7$?",
"c": [
"$0$",
"$1$",
"$7$",
"$6$"
],
"why": "Fermat needs $p\\nmid a$. Here $7\\mid7^7$, so the remainder is $0$."
}
]
},
{
"t": "Inverses",
"x": "The **inverse** of $a$ mod $n$ is a number $a^{-1}$ with $a\\cdot a^{-1}\\equiv1\\pmod n$. It exists exactly when $\\gcd(a,n)=1$.\n\nInverses let you \"divide\" in modular arithmetic: to solve $3x\\equiv5\\pmod7$, multiply by the inverse of $3$, which is $5$ (since $15\\equiv1$): $x\\equiv25\\equiv4$.\n\nFor small $n$, find inverses by trying; for big $n$, use the Euclidean algorithm backwards.",
"ex": {
"q": "Solve $4x\\equiv3\\pmod{11}$.",
"steps": [
"Find the inverse of $4$ mod $11$: $4\\cdot3=12\\equiv1$, so it's $3$.",
"Multiply both sides by $3$: $x\\equiv9$.",
"Check: $4\\cdot9=36=33+3$. ✓"
],
"ans": "$x\\equiv9\\pmod{11}$"
},
"checks": [
{
"q": "What is the inverse of $2$ mod $9$?",
"c": [
"$5$",
"$4$",
"$2$",
"$7$"
],
"why": "$2\\cdot5=10\\equiv1\\pmod 9$."
},
{
"q": "Which number has NO inverse mod $12$?",
"c": [
"$9$",
"$5$",
"$7$",
"$11$"
],
"why": "$\\gcd(9,12)=3\\ne1$."
}
]
},
{
"t": "Sum of divisors",
"x": "For $n=p^a q^b\\cdots$, the sum of all divisors is $(1+p+\\dots+p^a)(1+q+\\dots+q^b)\\cdots$.\n\nEach divisor appears exactly once when you expand the product. And $1+p+\\dots+p^a=\\dfrac{p^{a+1}-1}{p-1}$.\n\nA number is **perfect** if its divisors (other than itself) add to it, like $6=1+2+3$ and $28$.",
"ex": {
"q": "Find the sum of the divisors of $72$.",
"steps": [
"$72=2^3\\cdot3^2$.",
"$(1+2+4+8)(1+3+9)=15\\cdot13$.",
"$=195$."
],
"ans": "$195$"
},
"checks": [
{
"q": "What is the sum of the divisors of $12$?",
"c": [
"$28$",
"$16$",
"$24$",
"$27$"
],
"why": "$(1+2+4)(1+3)=7\\cdot4=28$."
},
{
"q": "What is the sum of the divisors of $3^4$?",
"c": [
"$121$",
"$81$",
"$13$",
"$40$"
],
"why": "$1+3+9+27+81=121=\\frac{3^5-1}{2}$."
}
]
}
],
[
{
"t": "Chinese remainder theorem",
"x": "If $m$ and $n$ are coprime, the pair of conditions $x\\equiv a\\pmod m$ and $x\\equiv b\\pmod n$ has exactly one solution mod $mn$.\n\nTo find it, list numbers with the first remainder ($a, a+m, a+2m,\\dots$) until one has the second remainder.\n\nThis is why the remainder mod $15$ is determined by the remainders mod $3$ and mod $5$.",
"ex": {
"q": "Find the smallest positive $x$ with $x\\equiv2\\pmod 3$ and $x\\equiv3\\pmod 5$.",
"steps": [
"Numbers $\\equiv3\\pmod5$: $3, 8, 13, 18,\\dots$",
"Check mod $3$: $3\\to0$, $8\\to2$. ✓",
"$x=8$, and all solutions are $8+15k$."
],
"ans": "$8$"
},
"checks": [
{
"q": "What is the smallest positive $x$ with $x\\equiv1\\pmod4$ and $x\\equiv2\\pmod 3$?",
"c": [
"$5$",
"$9$",
"$2$",
"$11$"
],
"why": "$1,5,9,\\dots$; $5\\equiv2\\pmod3$."
},
{
"q": "A number leaves remainder $1$ when divided by $2, 3, 4, 5$ and $6$. Smallest such number above $1$?",
"c": [
"$61$",
"$31$",
"$121$",
"$59$"
],
"why": "$x-1$ is a multiple of $\\text{lcm}(2,\\dots,6)=60$."
}
]
},
{
"t": "Linear Diophantine equations",
"x": "$ax+by=c$ has integer solutions exactly when $\\gcd(a,b)$ divides $c$.\n\nOnce you find one solution $(x_0,y_0)$, all solutions are $x=x_0+\\frac{b}{g}t$, $y=y_0-\\frac{a}{g}t$, where $g=\\gcd(a,b)$.\n\nFor word problems (\"stamps of $5$ and $7$ cents\"), also require $x,y\\ge0$.",
"ex": {
"q": "Find all non-negative solutions of $3x+5y=31$.",
"steps": [
"Try $y$ values: $31-5y$ must be a multiple of $3$.",
"$y=2$: $21$, so $x=7$. $y=5$: $6$, so $x=2$.",
"$y=8$ is too big. Solutions: $(7,2)$ and $(2,5)$."
],
"ans": "$(7,2), (2,5)$"
},
"checks": [
{
"q": "Does $6x+9y=20$ have integer solutions?",
"c": [
"No",
"Yes",
"Only with $x=0$",
"Infinitely many positive ones"
],
"why": "$\\gcd(6,9)=3$ doesn't divide $20$."
},
{
"q": "With $5$ and $7$ cent stamps, which amount is impossible?",
"c": [
"$23$",
"$24$",
"$25$",
"$26$"
],
"why": "$24=10+14$, $25=5\\cdot5$, $26=5+21$, but $23$ can't be made. (The largest impossible amount is $5\\cdot7-5-7=23$.)"
}
]
},
{
"t": "Small moduli",
"x": "Looking at an equation **mod a small number** often proves it impossible.\n\nSquares mod $4$ are only $0$ or $1$. Squares mod $3$ are only $0$ or $1$. Squares mod $8$ are $0$, $1$ or $4$. Cubes mod $9$ are $0$, $1$ or $8$.\n\nSo $x^2+y^2=4003$ has no solutions: the left side is $0, 1$ or $2$ mod $4$, but $4003\\equiv3$.",
"ex": {
"q": "Can $n^2+1$ ever be divisible by $3$?",
"steps": [
"Squares mod $3$ are $0$ or $1$.",
"So $n^2+1$ is $1$ or $2$ mod $3$.",
"Never $0$: no."
],
"ans": "No"
},
"checks": [
{
"q": "Which number can be a sum of two squares?",
"c": [
"$41$",
"$43$",
"$47$",
"$39$"
],
"why": "$41=16+25$. The others are $3\\pmod4$, which is impossible."
},
{
"q": "What remainder can a perfect square leave when divided by $8$, if the square is odd?",
"c": [
"$1$",
"$3$",
"$5$",
"$7$"
],
"why": "$(2k+1)^2=4k(k+1)+1$, and $k(k+1)$ is even, so it's $1\\pmod8$."
}
]
}
]
],
"counting_and_probability": [
[
{
"t": "Multiplication principle",
"x": "If something happens in **independent stages**, multiply the number of choices at each stage.\n\nDo the **most restricted** stage first. For \"$4$-digit numbers that are even\", the last digit has $5$ choices and the first digit can't be $0$: $9\\cdot10\\cdot10\\cdot5=4500$.\n\nIf choices depend on earlier choices, the counts can shrink stage by stage, but you still multiply.",
"ex": {
"q": "How many $4$-digit numbers have no repeated digits?",
"steps": [
"First digit: $9$ choices (not $0$).",
"Second: $9$ (now $0$ is allowed, but not the first digit). Third: $8$. Fourth: $7$.",
"$9\\cdot9\\cdot8\\cdot7=4536$."
],
"ans": "$4536$"
},
"checks": [
{
"q": "How many licence plates have $2$ letters followed by $3$ digits?",
"c": [
"$676\\,000$",
"$67\\,600$",
"$5$",
"$26\\,000$"
],
"why": "$26^2\\cdot10^3=676\\cdot1000$."
},
{
"q": "How many $3$-digit numbers are odd?",
"c": [
"$450$",
"$500$",
"$900$",
"$405$"
],
"why": "$9\\cdot10\\cdot5=450$."
}
]
},
{
"t": "Probability",
"x": "When all outcomes are **equally likely**, probability $=\\dfrac{\\text{favourable outcomes}}{\\text{total outcomes}}$.\n\nCount both carefully, using the same kind of outcome. With two dice, there are $36$ ordered outcomes, all equally likely; the $11$ possible sums are *not* equally likely.\n\nFor independent events, multiply probabilities.",
"ex": {
"q": "Two fair dice are rolled. What is the probability the sum is $8$?",
"steps": [
"Total ordered outcomes: $36$.",
"Sum $8$: $(2,6),(3,5),(4,4),(5,3),(6,2)$: $5$ outcomes.",
"Probability $\\frac{5}{36}$."
],
"ans": "$\\frac5{36}$"
},
"checks": [
{
"q": "A coin is flipped $3$ times. What is the probability of exactly $2$ heads?",
"c": [
"$\\frac38$",
"$\\frac23$",
"$\\frac14$",
"$\\frac12$"
],
"why": "$HHT, HTH, THH$: $3$ of $8$."
},
{
"q": "A bag has $3$ red and $5$ blue balls. Two are drawn without replacement. Probability both red?",
"c": [
"$\\frac{3}{28}$",
"$\\frac{9}{64}$",
"$\\frac38$",
"$\\frac{1}{8}$"
],
"why": "$\\frac38\\cdot\\frac27=\\frac{6}{56}=\\frac3{28}$."
}
]
},
{
"t": "Complements",
"x": "\"At least one\" problems are usually easiest **backwards**: $P(\\text{at least one})=1-P(\\text{none})$.\n\nThe same works for counting: count everything, subtract the ones you don't want.\n\nSo the chance of at least one six in four rolls is $1-\\left(\\frac56\\right)^4\\approx0.52$.",
"ex": {
"q": "How many $3$-letter strings (A–Z) have at least one vowel (A, E, I, O, U)?",
"steps": [
"All strings: $26^3=17\\,576$.",
"Strings with no vowel: $21^3=9\\,261$.",
"At least one vowel: $17\\,576-9\\,261=8\\,315$."
],
"ans": "$8315$"
},
"checks": [
{
"q": "A coin is flipped $5$ times. Probability of at least one head?",
"c": [
"$\\frac{31}{32}$",
"$\\frac{5}{32}$",
"$\\frac12$",
"$\\frac{1}{32}$"
],
"why": "$1-\\left(\\frac12\\right)^5=\\frac{31}{32}$."
},
{
"q": "Probability that two dice show different numbers?",
"c": [
"$\\frac56$",
"$\\frac16$",
"$\\frac{11}{36}$",
"$\\frac{30}{36}\\cdot\\frac12$"
],
"why": "$1-P(\\text{same})=1-\\frac{6}{36}=\\frac56$."
}
]
}
],
[
{
"t": "Permutations",
"x": "A **permutation** is an arrangement where **order matters**. $n$ different objects can be lined up in $n!=n(n-1)\\cdots1$ ways.\n\nChoosing and arranging $k$ of $n$ objects: $n(n-1)\\cdots(n-k+1)=\\dfrac{n!}{(n-k)!}$.\n\nAround a circle (where rotations count as the same), $n$ people sit in $(n-1)!$ ways.",
"ex": {
"q": "In how many ways can $5$ friends sit in a row if Ana and Ben must sit together?",
"steps": [
"Glue Ana and Ben into one block: now $4$ units to arrange: $4!=24$.",
"Inside the block they can be AB or BA: $\\times2$.",
"$24\\cdot2=48$."
],
"ans": "$48$"
},
"checks": [
{
"q": "How many ways to arrange the letters of WORD?",
"c": [
"$24$",
"$4$",
"$16$",
"$256$"
],
"why": "$4!=24$ (all letters different)."
},
{
"q": "In how many ways can $6$ people sit around a round table?",
"c": [
"$120$",
"$720$",
"$36$",
"$60$"
],
"why": "Fix one person; arrange the other $5$: $5!=120$."
}
]
},
{
"t": "Combinations",
"x": "A **combination** is a selection where **order doesn't matter**. Choosing $k$ of $n$: $\\dbinom nk=\\dfrac{n!}{k!(n-k)!}$.\n\nIt's the permutation count divided by $k!$, because each group of $k$ was counted in all $k!$ orders.\n\nSymmetry: $\\binom nk=\\binom n{n-k}$. Choosing who's in is the same as choosing who's out.",
"ex": {
"q": "A committee of $3$ is chosen from $5$ women and $4$ men. How many committees have exactly $2$ women?",
"steps": [
"Choose the women: $\\binom52=10$.",
"Choose the man: $\\binom41=4$.",
"$10\\cdot4=40$."
],
"ans": "$40$"
},
"checks": [
{
"q": "What is $\\binom{8}{3}$?",
"c": [
"$56$",
"$336$",
"$24$",
"$40$"
],
"why": "$\\frac{8\\cdot7\\cdot6}{3\\cdot2\\cdot1}=56$."
},
{
"q": "How many handshakes happen if $10$ people each shake hands once with everyone else?",
"c": [
"$45$",
"$90$",
"$100$",
"$10$"
],
"why": "Each handshake is a pair: $\\binom{10}2=45$."
}
]
},
{
"t": "Repeated letters",
"x": "Arranging letters with repeats over-counts: swapping two identical letters gives the same word.\n\nDivide by the factorial of each repeat count: arrangements of $n$ letters with repeats $a, b,\\dots$ is $\\dfrac{n!}{a!\\,b!\\cdots}$.\n\nFor example, BANANA has $6$ letters with A three times and N twice: $\\frac{6!}{3!\\,2!}=60$.",
"ex": {
"q": "How many arrangements of the letters of LEVEL are there?",
"steps": [
"$5$ letters: L twice, E twice, V once.",
"$\\frac{5!}{2!\\,2!}=\\frac{120}{4}$.",
"$=30$."
],
"ans": "$30$"
},
"checks": [
{
"q": "How many arrangements of AABB?",
"c": [
"$6$",
"$24$",
"$4$",
"$12$"
],
"why": "$\\frac{4!}{2!2!}=6$."
},
{
"q": "How many paths go from $(0,0)$ to $(3,2)$ using unit steps right or up?",
"c": [
"$10$",
"$5$",
"$6$",
"$32$"
],
"why": "Arrange RRRUU: $\\frac{5!}{3!2!}=10$."
}
]
}
],
[
{
"t": "Stars and bars",
"x": "The number of ways to split $n$ identical items into $k$ groups (groups may be empty) is $\\dbinom{n+k-1}{k-1}$.\n\nPicture $n$ stars and $k-1$ bars in a row; the bars cut the stars into $k$ groups. You're just choosing where the bars go.\n\nIf every group must get at least one, first hand one to each group: $\\binom{n-1}{k-1}$.",
"ex": {
"q": "How many non-negative integer solutions does $a+b+c=6$ have?",
"steps": [
"$6$ stars and $2$ bars: $8$ positions.",
"Choose where the bars go: $\\binom82$.",
"$=28$."
],
"ans": "$28$"
},
"checks": [
{
"q": "In how many ways can $10$ identical sweets be shared among $3$ children if each gets at least one?",
"c": [
"$36$",
"$66$",
"$45$",
"$120$"
],
"why": "$\\binom{9}{2}=36$."
},
{
"q": "How many positive solutions does $x+y+z+w=8$ have?",
"c": [
"$35$",
"$165$",
"$56$",
"$70$"
],
"why": "$\\binom{7}{3}=35$."
}
]
},
{
"t": "Inclusion–exclusion",
"x": "To count things in $A$ **or** $B$, add the sizes and subtract the overlap, which was counted twice: $|A\\cup B|=|A|+|B|-|A\\cap B|$.\n\nFor three sets: add the singles, subtract the pairs, add back the triple.\n\nClassic use: \"how many numbers up to $N$ are divisible by $2$ or $3$?\" Count multiples of each, then subtract multiples of $6$.",
"ex": {
"q": "How many integers from $1$ to $100$ are divisible by $3$ or $5$?",
"steps": [
"Multiples of $3$: $33$. Multiples of $5$: $20$.",
"Both means multiples of $15$: $6$.",
"$33+20-6=47$."
],
"ans": "$47$"
},
"checks": [
{
"q": "In a class of $30$, $18$ play football, $12$ play tennis and $5$ play both. How many play neither?",
"c": [
"$5$",
"$0$",
"$10$",
"$7$"
],
"why": "$18+12-5=25$ play something; $30-25=5$."
},
{
"q": "How many integers from $1$ to $60$ are divisible by neither $2$ nor $3$?",
"c": [
"$20$",
"$10$",
"$30$",
"$40$"
],
"why": "Divisible by $2$ or $3$: $30+20-10=40$; $60-40=20$."
}
]
},
{
"t": "Expected value is linear",
"x": "The **expected value** is the probability-weighted average outcome.\n\n**Linearity**: the expectation of a sum is the sum of the expectations, *even if the parts depend on each other*. So break complicated counts into simple yes/no indicators and add their probabilities.\n\nThe expected number of sixes in $12$ rolls is $12\\cdot\\frac16=2$.",
"ex": {
"q": "$5$ letters are put randomly into their $5$ envelopes. What is the expected number in the right envelope?",
"steps": [
"Each letter is in its own envelope with probability $\\frac15$.",
"By linearity, add: $5\\cdot\\frac15$.",
"$=1$, whatever the number of letters!"
],
"ans": "$1$"
},
"checks": [
{
"q": "What is the expected value of one roll of a fair die?",
"c": [
"$3.5$",
"$3$",
"$4$",
"$6$"
],
"why": "$\\frac{1+2+\\dots+6}{6}=\\frac{21}{6}$."
},
{
"q": "A coin is flipped $10$ times. Expected number of times HH appears in consecutive flips?",
"c": [
"$\\frac94$",
"$\\frac52$",
"$\\frac{10}{4}$",
"$2$"
],
"why": "There are $9$ consecutive pairs, each HH with probability $\\frac14$."
}
]
}
],
[
{
"t": "Pascal's rule",
"x": "$\\dbinom nk=\\dbinom{n-1}{k-1}+\\dbinom{n-1}{k}$. To choose $k$ from $n$, either the last item is chosen (choose $k-1$ more from $n-1$) or it isn't (choose all $k$ from the other $n-1$).\n\nThis builds **Pascal's triangle**: each entry is the sum of the two above it.\n\nRow $n$ adds up to $2^n$, the number of subsets of an $n$-element set.",
"ex": {
"q": "Use Pascal's rule to find $\\binom{6}{3}$ from row $5$: $1, 5, 10, 10, 5, 1$.",
"steps": [
"$\\binom63=\\binom52+\\binom53$.",
"$=10+10$.",
"$=20$."
],
"ans": "$20$"
},
"checks": [
{
"q": "What is the sum $\\binom70+\\binom71+\\dots+\\binom77$?",
"c": [
"$128$",
"$64$",
"$49$",
"$256$"
],
"why": "Each row sums to $2^n$: $2^7=128$."
},
{
"q": "$\\binom{9}{4}+\\binom{9}{5}=$",
"c": [
"$\\binom{10}{5}$",
"$\\binom{18}{9}$",
"$\\binom{10}{4}$",
"$\\binom{9}{9}$"
],
"why": "Pascal's rule with $n=10$, $k=5$."
}
]
},
{
"t": "Binomial theorem",
"x": "$(a+b)^n=\\sum_{k=0}^{n}\\binom nk a^{n-k}b^k$. The coefficients are row $n$ of Pascal's triangle.\n\nTo find one particular term, pick the right $k$: the term with $b^k$ is $\\binom nk a^{n-k}b^k$.\n\nPlugging in numbers gives identities: $a=b=1$ shows the row sums to $2^n$.",
"ex": {
"q": "Find the coefficient of $x^2$ in $(2x+3)^5$.",
"steps": [
"The $x^2$ term uses $(2x)^2$ and $3^3$: $\\binom52(2x)^2\\,3^3$.",
"$=10\\cdot4x^2\\cdot27$.",
"Coefficient $1080$."
],
"ans": "$1080$"
},
"checks": [
{
"q": "What is the coefficient of $x^3$ in $(x+1)^6$?",
"c": [
"$20$",
"$15$",
"$6$",
"$18$"
],
"why": "$\\binom63=20$."
},
{
"q": "What is the constant term of $\\left(x+\\frac1x\\right)^4$?",
"c": [
"$6$",
"$4$",
"$1$",
"$0$"
],
"why": "Need equal numbers of $x$ and $\\frac1x$: $\\binom42=6$."
}
]
},
{
"t": "Geometric probability",
"x": "When a point is chosen **uniformly** from a region, probability $=\\dfrac{\\text{favourable length/area}}{\\text{total length/area}}$.\n\nTwo random numbers in $[0,1]$ are a random point in the unit square, so \"$x+y<1$\" is a triangle of area $\\frac12$.\n\nDraw the region. Most of these problems are just area computations.",
"ex": {
"q": "Two numbers are chosen at random in $[0,2]$. What is the probability they differ by less than $1$?",
"steps": [
"Points $(x,y)$ in a $2\\times2$ square, area $4$.",
"$|x-y|\\ge1$ is two corner triangles, each with legs $1$: total area $1$.",
"So $P=\\frac{4-1}{4}=\\frac34$."
],
"ans": "$\\frac34$"
},
"checks": [
{
"q": "A point is chosen in a square of side $2$. Probability it's within $1$ of the centre?",
"c": [
"$\\frac\\pi4$",
"$\\frac12$",
"$\\frac{\\pi}{2}$",
"$\\frac14$"
],
"why": "Circle area $\\pi$ over square area $4$."
},
{
"q": "A stick of length $1$ is broken at a random point. Probability the longer piece is more than $\\frac34$?",
"c": [
"$\\frac12$",
"$\\frac14$",
"$\\frac34$",
"$\\frac13$"
],
"why": "The break must be within $\\frac14$ of an end: total length $\\frac12$."
}
]
}
],
[
{
"t": "Casework",
"x": "Split a problem into **cases that don't overlap and together cover everything**, count each case, then add.\n\nChoose the split that makes each case easy: by the first digit, by how many of something there are, by which item is largest.\n\nCheck you haven't double-counted: each object must land in exactly one case.",
"ex": {
"q": "How many $3$-digit numbers have digits adding to $5$?",
"steps": [
"Case on the first digit $a\\ge1$; the other two digits add to $5-a$.",
"Two digits adding to $s$: $s+1$ ways. $a=1$: $5$; $a=2$: $4$; $a=3$: $3$; $a=4$: $2$; $a=5$: $1$.",
"Total $5+4+3+2+1=15$."
],
"ans": "$15$"
},
"checks": [
{
"q": "How many integers from $1$ to $100$ have exactly one digit $7$?",
"c": [
"$18$",
"$19$",
"$20$",
"$10$"
],
"why": "Units $7$ with tens $\\ne7$: $9$ ($7,17,\\dots,97$ except $77$). Tens $7$ with units $\\ne7$: $9$. Total $18$."
},
{
"q": "How many triangles with integer sides have perimeter $9$?",
"c": [
"$3$",
"$2$",
"$4$",
"$5$"
],
"why": "Largest side $c<4.5$: $(1,4,4), (2,3,4), (3,3,3)$."
}
]
},
{
"t": "Recursion",
"x": "Count a size-$n$ problem using answers for smaller sizes. Look at the **first or last step** and see what's left.\n\nTiling a $1\\times n$ strip with $1\\times1$ and $1\\times2$ tiles: the first tile leaves a strip of $n-1$ or $n-2$, so $a_n=a_{n-1}+a_{n-2}$, the Fibonacci numbers.\n\nCompute small cases by hand, then use the recursion to climb.",
"ex": {
"q": "How many ways can you climb $6$ stairs taking $1$ or $2$ steps at a time?",
"steps": [
"$a_n=a_{n-1}+a_{n-2}$ (your first move is $1$ or $2$ steps).",
"$a_1=1$, $a_2=2$, $a_3=3$, $a_4=5$, $a_5=8$.",
"$a_6=13$."
],
"ans": "$13$"
},
"checks": [
{
"q": "How many binary strings of length $5$ have no two consecutive $1$s?",
"c": [
"$13$",
"$8$",
"$16$",
"$21$"
],
"why": "$a_1=2$, $a_2=3$, then Fibonacci: $5, 8, 13$."
},
{
"q": "$a_1=1$ and $a_n=2a_{n-1}+1$. What is $a_5$?",
"c": [
"$31$",
"$15$",
"$32$",
"$63$"
],
"why": "$1,3,7,15,31$; in general $2^n-1$."
}
]
},
{
"t": "Symmetry",
"x": "If the situation looks the same from two points of view, the answers are equal. Use that instead of counting.\n\n\"Is $A$ before $B$ in a random order?\" By symmetry, exactly half of all orders: $\\frac12$.\n\nSymmetry also halves work: the number of $5$-card hands with more red cards than black equals the number with more black than red.",
"ex": {
"q": "$4$ people are lined up randomly. What is the probability Ana is somewhere left of Ben?",
"steps": [
"Swapping Ana and Ben turns every 'left' order into a 'right' order.",
"So the two kinds of order are equally common.",
"Probability $\\frac12$."
],
"ans": "$\\frac12$"
},
"checks": [
{
"q": "A fair coin is flipped $7$ times. Probability of more heads than tails?",
"c": [
"$\\frac12$",
"$\\frac{7}{16}$",
"$\\frac{35}{128}$",
"$\\frac38$"
],
"why": "With an odd number of flips there are no ties, and heads/tails are symmetric."
},
{
"q": "Three dice are rolled. Probability the first is the strictly largest?",
"c": [
"$\\frac{55}{216}$",
"$\\frac13$",
"$\\frac16$",
"$\\frac12$"
],
"why": "If the first die shows $v$, each other die has $v-1$ smaller values: $\\sum_{v=1}^{6}(v-1)^2=0+1+4+9+16+25=55$ outcomes. It's a bit less than $\\frac13$ because ties happen."
}
]
}
]
],
"geometry": [
[
{
"t": "Angle facts",
"x": "Angles on a straight line add to $180^\\circ$; angles around a point add to $360^\\circ$; vertically opposite angles are equal.\n\nThe angles of a triangle add to $180^\\circ$. An **exterior angle** of a triangle equals the sum of the two interior angles not next to it.\n\nIn an isosceles triangle the base angles are equal.",
"ex": {
"q": "An isosceles triangle has a top (apex) angle of $40^\\circ$. What are its base angles?",
"steps": [
"The angles add to $180^\\circ$, so the base angles total $140^\\circ$.",
"They're equal.",
"Each is $70^\\circ$."
],
"ans": "$70^\\circ$"
},
"checks": [
{
"q": "Two angles of a triangle are $35^\\circ$ and $75^\\circ$. What is the exterior angle at the third vertex?",
"c": [
"$110^\\circ$",
"$70^\\circ$",
"$105^\\circ$",
"$145^\\circ$"
],
"why": "The exterior angle equals the sum of the two remote angles: $35+75$."
},
{
"q": "Three angles around a point are $x$, $2x$ and $3x$. What is $x$?",
"c": [
"$60^\\circ$",
"$30^\\circ$",
"$36^\\circ$",
"$90^\\circ$"
],
"why": "$6x=360^\\circ$."
}
]
},
{
"t": "Parallel lines",
"x": "When a line crosses two **parallel** lines, it makes equal angles in matching positions:\n• **corresponding** angles (an \"F\" shape) are equal,\n• **alternate** angles (a \"Z\" shape) are equal,\n• **co-interior** angles (a \"C\" shape) add to $180^\\circ$.\n\nThese let you move an angle from one place to another, which is the heart of angle chasing.",
"ex": {
"q": "Lines $\\ell\\parallel m$ are cut by a transversal. One co-interior angle is $3x+10$ and the other is $2x+20$. Find $x$.",
"steps": [
"Co-interior angles add to $180^\\circ$: $5x+30=180$.",
"$5x=150$.",
"$x=30$, giving angles $100^\\circ$ and $80^\\circ$."
],
"ans": "$x=30$"
},
"checks": [
{
"q": "Alternate angles are $4x-20$ and $2x+30$. What is $x$?",
"c": [
"$25$",
"$15$",
"$35$",
"$5$"
],
"why": "Alternate angles are equal: $4x-20=2x+30$, so $x=25$."
},
{
"q": "A transversal makes a $65^\\circ$ angle with one of two parallel lines. Which angles appear where it crosses the other line?",
"c": [
"$65^\\circ$ and $115^\\circ$",
"$65^\\circ$ only",
"$25^\\circ$ and $155^\\circ$",
"$65^\\circ$ and $25^\\circ$"
],
"why": "Corresponding angles copy the $65^\\circ$, and the angles next to it on the line are $180^\\circ-65^\\circ=115^\\circ$."
}
]
},
{
"t": "Triangle area",
"x": "Area $=\\frac12\\times\\text{base}\\times\\text{height}$, where the height is perpendicular to the base (it may fall outside the triangle).\n\nAny side can be the base: $\\frac12 a\\,h_a=\\frac12 b\\,h_b$. Use this to find a height you don't know.\n\nWith two sides and the angle between them: area $=\\frac12ab\\sin C$.",
"ex": {
"q": "A right triangle has legs $6$ and $8$. Find the height to the hypotenuse.",
"steps": [
"Area $=\\frac12\\cdot6\\cdot8=24$; the hypotenuse is $10$.",
"Using the hypotenuse as base: $\\frac12\\cdot10\\cdot h=24$.",
"$h=4.8$."
],
"ans": "$4.8$"
},
"checks": [
{
"q": "Find the area of the triangle with vertices $(0,0)$, $(6,0)$ and $(2,5)$.",
"c": [
"$15$",
"$30$",
"$12$",
"$10$"
],
"why": "Base $6$ along the $x$-axis, height $5$: $\\frac12\\cdot6\\cdot5=15$."
},
{
"q": "Two sides are $8$ and $10$ with a $30^\\circ$ angle between them. Area?",
"c": [
"$20$",
"$40$",
"$80$",
"$20\\sqrt3$"
],
"why": "$\\frac12\\cdot8\\cdot10\\cdot\\sin30^\\circ=40\\cdot\\frac12$."
}
]
}
],
[
{
"t": "Pythagorean triples",
"x": "Integer right triangles show up everywhere. The basic ones: $3$-$4$-$5$, $5$-$12$-$13$, $8$-$15$-$17$, $7$-$24$-$25$, $20$-$21$-$29$.\n\nAny multiple works too: $6$-$8$-$10$, $15$-$20$-$25$, $10$-$24$-$26$.\n\nSpot them by dividing out common factors: $27$-$36$-$?$ is $9\\times(3$-$4$-$5)$, so the hypotenuse is $45$.",
"ex": {
"q": "A right triangle has legs $20$ and $48$. Find the hypotenuse.",
"steps": [
"Both are multiples of $4$: $4\\times(5, 12)$.",
"$5$-$12$-$13$ scaled by $4$.",
"Hypotenuse $52$."
],
"ans": "$52$"
},
"checks": [
{
"q": "Legs $16$ and $30$. Hypotenuse?",
"c": [
"$34$",
"$46$",
"$32$",
"$36$"
],
"why": "$2\\times(8$-$15$-$17)$."
},
{
"q": "Hypotenuse $50$, one leg $14$. Other leg?",
"c": [
"$48$",
"$36$",
"$40$",
"$44$"
],
"why": "$2\\times(7$-$24$-$25)$."
}
]
},
{
"t": "Special triangles",
"x": "Two right triangles have fixed side ratios:\n• **$45$-$45$-$90$**: sides $1 : 1 : \\sqrt2$ (half a square).\n• **$30$-$60$-$90$**: sides $1 : \\sqrt3 : 2$ (half an equilateral triangle). The short leg is opposite $30^\\circ$.\n\nAn equilateral triangle of side $s$ has height $\\frac{\\sqrt3}{2}s$ and area $\\frac{\\sqrt3}{4}s^2$.",
"ex": {
"q": "Find the area of an equilateral triangle with side $6$.",
"steps": [
"Its height splits it into two $30$-$60$-$90$ triangles with short leg $3$.",
"Height $=3\\sqrt3$.",
"Area $=\\frac12\\cdot6\\cdot3\\sqrt3=9\\sqrt3$."
],
"ans": "$9\\sqrt3$"
},
"checks": [
{
"q": "A square has diagonal $10$. What is its side?",
"c": [
"$5\\sqrt2$",
"$10\\sqrt2$",
"$5$",
"$\\frac{10}{3}$"
],
"why": "Side $\\cdot\\sqrt2=10$, so side $=\\frac{10}{\\sqrt2}=5\\sqrt2$."
},
{
"q": "In a $30$-$60$-$90$ triangle the hypotenuse is $14$. Longer leg?",
"c": [
"$7\\sqrt3$",
"$7$",
"$14\\sqrt3$",
"$7\\sqrt2$"
],
"why": "Short leg $7$, long leg $7\\sqrt3$."
}
]
},
{
"t": "Similarity",
"x": "Triangles are **similar** if their angles match; then all sides are in the same ratio $k$.\n\nTwo equal angles are enough (**AA**). Parallel lines create similar triangles all the time.\n\nIf lengths scale by $k$, **areas scale by $k^2$** and volumes by $k^3$.",
"ex": {
"q": "In triangle $ABC$, $DE\\parallel BC$ with $D$ on $AB$, $E$ on $AC$, $AD=3$, $DB=6$, and $BC=12$. Find $DE$.",
"steps": [
"$DE\\parallel BC$ makes triangle $ADE$ similar to $ABC$.",
"Ratio $\\frac{AD}{AB}=\\frac{3}{9}=\\frac13$.",
"$DE=\\frac13\\cdot12=4$."
],
"ans": "$4$"
},
"checks": [
{
"q": "Two similar triangles have sides in ratio $2:5$. The smaller has area $8$. Area of the larger?",
"c": [
"$50$",
"$20$",
"$125$",
"$40$"
],
"why": "Areas scale by $\\left(\\frac52\\right)^2=\\frac{25}{4}$: $8\\cdot\\frac{25}4=50$."
},
{
"q": "A $2$ m pole casts a $3$ m shadow; a tree casts a $15$ m shadow at the same time. How tall is the tree?",
"c": [
"$10$ m",
"$22.5$ m",
"$12$ m",
"$9$ m"
],
"why": "Similar triangles: $\\frac{h}{15}=\\frac23$."
}
]
}
],
[
{
"t": "Circle formulas",
"x": "Circumference $=2\\pi r$, area $=\\pi r^2$.\n\nA **sector** with angle $\\theta$ is the fraction $\\frac{\\theta}{360^\\circ}$ of the circle: arc length $\\frac{\\theta}{360}2\\pi r$, area $\\frac{\\theta}{360}\\pi r^2$.\n\nRead carefully whether you're given the radius or the diameter.",
"ex": {
"q": "Find the area of a $60^\\circ$ sector of a circle with radius $6$.",
"steps": [
"The sector is $\\frac{60}{360}=\\frac16$ of the circle.",
"Full area $=36\\pi$.",
"Sector area $=6\\pi$."
],
"ans": "$6\\pi$"
},
"checks": [
{
"q": "A circle has circumference $10\\pi$. What is its area?",
"c": [
"$25\\pi$",
"$100\\pi$",
"$10\\pi$",
"$5\\pi$"
],
"why": "$2\\pi r=10\\pi$, so $r=5$."
},
{
"q": "What is the arc length of a $90^\\circ$ arc of a circle with radius $8$?",
"c": [
"$4\\pi$",
"$16\\pi$",
"$2\\pi$",
"$8\\pi$"
],
"why": "$\\frac14\\cdot16\\pi=4\\pi$."
}
]
},
{
"t": "Inscribed angles",
"x": "An **inscribed angle** (vertex on the circle) is **half the central angle** on the same arc.\n\nSo all inscribed angles on the same arc are equal, and an angle inscribed in a semicircle is $90^\\circ$ (Thales).\n\nIn a **cyclic quadrilateral** (all four vertices on a circle), opposite angles add to $180^\\circ$.",
"ex": {
"q": "Points $A$, $B$, $C$ lie on a circle with centre $O$ and $\\angle AOB=110^\\circ$. Find $\\angle ACB$ ($C$ on the major arc).",
"steps": [
"$\\angle ACB$ is inscribed on the same arc $AB$ as the central angle.",
"Inscribed $=\\frac12$ central.",
"$\\angle ACB=55^\\circ$."
],
"ans": "$55^\\circ$"
},
"checks": [
{
"q": "$ABCD$ is cyclic with $\\angle A=75^\\circ$. What is $\\angle C$?",
"c": [
"$105^\\circ$",
"$75^\\circ$",
"$150^\\circ$",
"$37.5^\\circ$"
],
"why": "Opposite angles of a cyclic quadrilateral add to $180^\\circ$."
},
{
"q": "$AB$ is a diameter and $C$ is on the circle with $AC=6$, $BC=8$. What is the radius?",
"c": [
"$5$",
"$10$",
"$7$",
"$14$"
],
"why": "$\\angle C=90^\\circ$, so $AB=10$ and the radius is $5$."
}
]
},
{
"t": "Polygon angles",
"x": "The interior angles of an $n$-gon add to $(n-2)\\cdot180^\\circ$ (it splits into $n-2$ triangles).\n\nThe **exterior** angles of any convex polygon add to $360^\\circ$. In a regular $n$-gon each exterior angle is $\\frac{360^\\circ}{n}$ and each interior angle is $180^\\circ-\\frac{360^\\circ}{n}$.\n\nWorking with exterior angles is usually faster.",
"ex": {
"q": "Each interior angle of a regular polygon is $150^\\circ$. How many sides does it have?",
"steps": [
"Each exterior angle is $180^\\circ-150^\\circ=30^\\circ$.",
"Exterior angles add to $360^\\circ$.",
"$n=\\frac{360}{30}=12$."
],
"ans": "$12$"
},
"checks": [
{
"q": "What is the sum of the interior angles of a hexagon?",
"c": [
"$720^\\circ$",
"$540^\\circ$",
"$1080^\\circ$",
"$360^\\circ$"
],
"why": "$(6-2)\\cdot180^\\circ$."
},
{
"q": "What is each interior angle of a regular octagon?",
"c": [
"$135^\\circ$",
"$120^\\circ$",
"$140^\\circ$",
"$45^\\circ$"
],
"why": "Exterior $45^\\circ$, interior $180^\\circ-45^\\circ$."
}
]
}
],
[
{
"t": "Heron's formula",
"x": "If you know all three sides $a, b, c$, let $s=\\frac{a+b+c}{2}$ (the semi-perimeter). Then\n$$\\text{Area}=\\sqrt{s(s-a)(s-b)(s-c)}.$$\n\nThe classic example: the $13$-$14$-$15$ triangle has $s=21$ and area $\\sqrt{21\\cdot8\\cdot7\\cdot6}=84$.\n\nAlso useful: area $=rs$, where $r$ is the radius of the inscribed circle.",
"ex": {
"q": "Find the area of the triangle with sides $5$, $5$ and $6$.",
"steps": [
"$s=8$.",
"Area $=\\sqrt{8\\cdot3\\cdot3\\cdot2}=\\sqrt{144}$.",
"$=12$. (Check: height to the base $6$ is $4$, and $\\frac12\\cdot6\\cdot4=12$.)"
],
"ans": "$12$"
},
"checks": [
{
"q": "What is the area of a triangle with sides $13$, $14$, $15$?",
"c": [
"$84$",
"$90$",
"$42$",
"$105$"
],
"why": "$\\sqrt{21\\cdot8\\cdot7\\cdot6}=\\sqrt{7056}=84$."
},
{
"q": "A triangle has area $84$ and perimeter $42$. What is its inradius?",
"c": [
"$4$",
"$2$",
"$6$",
"$8$"
],
"why": "Area $=rs$ with $s=21$: $r=4$."
}
]
},
{
"t": "Power of a point",
"x": "For a point $P$ and a circle, draw any line through $P$ meeting the circle at $A$ and $B$. The product $PA\\cdot PB$ is **the same for every line**.\n\nSo two chords crossing at $P$ give $PA\\cdot PB=PC\\cdot PD$; two secants from outside give the same; and a tangent of length $t$ gives $t^2=PA\\cdot PB$.\n\nIt turns circle problems into simple equations.",
"ex": {
"q": "Two chords cross at $P$. One is cut into $4$ and $6$; the other into $3$ and $x$. Find $x$.",
"steps": [
"Power of a point: $4\\cdot6=3\\cdot x$.",
"$24=3x$.",
"$x=8$."
],
"ans": "$8$"
},
"checks": [
{
"q": "From $P$, a tangent has length $6$, and a secant meets the circle at distances $4$ and $x$ from $P$. Find $x$.",
"c": [
"$9$",
"$8$",
"$12$",
"$2$"
],
"why": "$6^2=4x$."
},
{
"q": "$P$ is $13$ from the centre of a circle of radius $5$. Tangent length?",
"c": [
"$12$",
"$8$",
"$\\sqrt{194}$",
"$18$"
],
"why": "The tangent is perpendicular to the radius: $\\sqrt{13^2-5^2}$."
}
]
},
{
"t": "Volumes",
"x": "**Prism or cylinder**: base area $\\times$ height (cylinder $\\pi r^2h$).\n**Pyramid or cone**: $\\frac13\\times$ base area $\\times$ height (cone $\\frac13\\pi r^2h$).\n**Sphere**: $V=\\frac43\\pi r^3$, surface area $4\\pi r^2$.\n\nThe $\\frac13$ for pointed shapes is the one to remember: a cone holds a third of the cylinder around it.",
"ex": {
"q": "A cone has radius $3$ and slant height $5$. Find its volume.",
"steps": [
"Height from Pythagoras: $\\sqrt{5^2-3^2}=4$.",
"$V=\\frac13\\pi\\cdot3^2\\cdot4$.",
"$=12\\pi$."
],
"ans": "$12\\pi$"
},
"checks": [
{
"q": "What is the volume of a sphere with radius $3$?",
"c": [
"$36\\pi$",
"$108\\pi$",
"$12\\pi$",
"$27\\pi$"
],
"why": "$\\frac43\\pi\\cdot27=36\\pi$."
},
{
"q": "A cube has surface area $54$. What is its volume?",
"c": [
"$27$",
"$9$",
"$81$",
"$54$"
],
"why": "$6s^2=54$ gives $s=3$, volume $27$."
}
]
}
],
[
{
"t": "Coordinates",
"x": "Put the figure on axes to turn geometry into algebra.\n• Distance: $\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$.\n• Midpoint: $\\left(\\frac{x_1+x_2}2,\\frac{y_1+y_2}2\\right)$.\n• Circle centre $(h,k)$, radius $r$: $(x-h)^2+(y-k)^2=r^2$.\n\nPlace things cleverly: a vertex at the origin, a side along an axis.",
"ex": {
"q": "Find the distance from $(1,2)$ to $(7,10)$.",
"steps": [
"Differences: $6$ and $8$.",
"$\\sqrt{36+64}=\\sqrt{100}$.",
"$10$."
],
"ans": "$10$"
},
"checks": [
{
"q": "What is the midpoint of $(-3,5)$ and $(7,-1)$?",
"c": [
"$(2,2)$",
"$(5,3)$",
"$(4,4)$",
"$(2,3)$"
],
"why": "$\\left(\\frac{4}{2},\\frac{4}{2}\\right)$."
},
{
"q": "What is the radius of $x^2+y^2-6x+8y=0$?",
"c": [
"$5$",
"$25$",
"$\\sqrt{14}$",
"$10$"
],
"why": "Complete the squares: $(x-3)^2+(y+4)^2=25$."
}
]
},
{
"t": "Draw it well",
"x": "A careful diagram is half the solution. Draw it **large** and roughly **to scale**, and label everything you know.\n\nMark equal lengths and equal angles; add the obvious helpful lines: radii to tangent points, the height of a triangle, a diagonal that makes right triangles.\n\nBut don't trust the picture for facts. Two lines that *look* perpendicular still need a reason.",
"ex": {
"q": "A circle of radius $5$ has a chord of length $8$. How far is the chord from the centre?",
"steps": [
"Draw the radius to an end of the chord and the perpendicular from the centre to the chord.",
"The perpendicular bisects the chord: a right triangle with hypotenuse $5$ and leg $4$.",
"Distance $=3$."
],
"ans": "$3$"
},
"checks": [
{
"q": "A tangent touches a circle of radius $6$ at $T$; $P$ is on the tangent with $PT=8$. How far is $P$ from the centre?",
"c": [
"$10$",
"$14$",
"$2\\sqrt7$",
"$12$"
],
"why": "Radius $\\perp$ tangent: $\\sqrt{36+64}=10$."
},
{
"q": "A rhombus has diagonals $10$ and $24$. What is its side?",
"c": [
"$13$",
"$17$",
"$26$",
"$12$"
],
"why": "Diagonals bisect at right angles: legs $5$ and $12$."
}
]
},
{
"t": "Area ratios",
"x": "Triangles with the **same height** have areas in the ratio of their bases. So a line from a vertex to the opposite side splits the area in the same ratio as it splits the side.\n\nTriangles with the same base have areas in the ratio of their heights.\n\nA median (to the midpoint) splits a triangle into two equal areas.",
"ex": {
"q": "In triangle $ABC$ (area $30$), $D$ is on $BC$ with $BD:DC=2:3$. Find the area of $ABD$.",
"steps": [
"$ABD$ and $ADC$ share the height from $A$.",
"So their areas are in the ratio $2:3$.",
"$ABD=\\frac25\\cdot30=12$."
],
"ans": "$12$"
},
"checks": [
{
"q": "$M$ is the midpoint of $BC$ and triangle $ABC$ has area $18$. Area of $ABM$?",
"c": [
"$9$",
"$6$",
"$12$",
"$4.5$"
],
"why": "A median halves the area."
},
{
"q": "In a triangle, the three medians create $6$ small triangles. If the whole has area $24$, each small one has area:",
"c": [
"$4$",
"$6$",
"$3$",
"$8$"
],
"why": "The six triangles formed by the medians all have equal area."
}
]
}
]
],
"intermediate_algebra": [
[
{
"t": "Remainder theorem",
"x": "The remainder when $p(x)$ is divided by $x-a$ is simply $p(a)$.\n\nSo $x-a$ is a **factor** exactly when $p(a)=0$ (the factor theorem).\n\nFor a quadratic divisor like $x^2-1$, the remainder is linear, $rx+s$; find $r$ and $s$ by plugging in the roots $x=1$ and $x=-1$.",
"ex": {
"q": "Find the remainder when $p(x)=x^3-4x^2+2x+5$ is divided by $x-3$.",
"steps": [
"By the remainder theorem it's $p(3)$.",
"$27-36+6+5$.",
"$=2$."
],
"ans": "$2$"
},
"checks": [
{
"q": "For which $k$ is $x-2$ a factor of $x^3+kx-6$?",
"c": [
"$-1$",
"$1$",
"$3$",
"$-7$"
],
"why": "$8+2k-6=0$ gives $k=-1$."
},
{
"q": "What is the remainder when $x^{100}$ is divided by $x+1$?",
"c": [
"$1$",
"$-1$",
"$0$",
"$100$"
],
"why": "$(-1)^{100}=1$."
}
]
},
{
"t": "Vieta for cubics",
"x": "For $x^3+bx^2+cx+d$ with roots $r, s, t$:\n$$r+s+t=-b,\\quad rs+st+tr=c,\\quad rst=-d.$$\n(Divide through by the leading coefficient first.)\n\nSigns alternate: minus, plus, minus. Use these to compute symmetric expressions without finding the roots.",
"ex": {
"q": "The roots of $x^3-6x^2+11x-6$ are $r,s,t$. Find $\\frac1r+\\frac1s+\\frac1t$.",
"steps": [
"$\\frac1r+\\frac1s+\\frac1t=\\frac{rs+st+tr}{rst}$.",
"$rs+st+tr=11$ and $rst=6$.",
"$\\frac{11}{6}$."
],
"ans": "$\\frac{11}{6}$"
},
"checks": [
{
"q": "What is the product of the roots of $2x^3-5x^2+x+8$?",
"c": [
"$-4$",
"$4$",
"$8$",
"$\\frac52$"
],
"why": "Divide by $2$: $d=4$, so $rst=-4$."
},
{
"q": "If $r,s,t$ are the roots of $x^3-3x^2+x-1$, find $r^2+s^2+t^2$.",
"c": [
"$7$",
"$9$",
"$11$",
"$8$"
],
"why": "$(r+s+t)^2-2(rs+st+tr)=9-2$."
}
]
},
{
"t": "Paired roots",
"x": "If a polynomial has **real coefficients**, complex roots come in **conjugate pairs**: if $2+3i$ is a root, so is $2-3i$.\n\nIf it has **rational coefficients**, irrational roots like $1+\\sqrt2$ come with their partner $1-\\sqrt2$.\n\nEach pair multiplies to a nice quadratic: $(x-(a+bi))(x-(a-bi))=x^2-2ax+a^2+b^2$.",
"ex": {
"q": "A cubic with real coefficients has roots $2$ and $1+i$. Find it (leading coefficient $1$).",
"steps": [
"The third root is $1-i$.",
"$(x-(1+i))(x-(1-i))=x^2-2x+2$.",
"Multiply by $x-2$: $x^3-4x^2+6x-4$."
],
"ans": "$x^3-4x^2+6x-4$"
},
"checks": [
{
"q": "A polynomial with rational coefficients has root $3-\\sqrt5$. Which must also be a root?",
"c": [
"$3+\\sqrt5$",
"$-3+\\sqrt5$",
"$\\sqrt5-3$",
"$5-\\sqrt3$"
],
"why": "Rational coefficients pair $a-\\sqrt b$ with $a+\\sqrt b$."
},
{
"q": "What quadratic has roots $1\\pm\\sqrt3$?",
"c": [
"$x^2-2x-2$",
"$x^2+2x-2$",
"$x^2-2x+4$",
"$x^2-2x-3$"
],
"why": "Sum $2$, product $1-3=-2$."
}
]
}
],
[
{
"t": "AM–GM",
"x": "For non-negative numbers, the arithmetic mean is at least the geometric mean: $\\dfrac{a+b}{2}\\ge\\sqrt{ab}$, with equality exactly when $a=b$.\n\nIt gives **minimums of sums** when the product is fixed, and **maximums of products** when the sum is fixed.\n\nExample: $x+\\frac1x\\ge2$ for $x>0$, with equality at $x=1$.",
"ex": {
"q": "For $x>0$, find the minimum of $4x+\\frac9x$.",
"steps": [
"AM–GM: $4x+\\frac9x\\ge2\\sqrt{4x\\cdot\\frac9x}=2\\sqrt{36}$.",
"$=12$.",
"Equality when $4x=\\frac9x$, i.e. $x=\\frac32$. Minimum $12$."
],
"ans": "$12$"
},
"checks": [
{
"q": "Two positive numbers add to $10$. What is their largest possible product?",
"c": [
"$25$",
"$24$",
"$50$",
"$100$"
],
"why": "The product is largest when they're equal: $5\\cdot5$."
},
{
"q": "A rectangle has area $36$. Smallest possible perimeter?",
"c": [
"$24$",
"$36$",
"$20$",
"$26$"
],
"why": "Perimeter $2(l+w)\\ge4\\sqrt{lw}=24$, at the $6\\times6$ square."
}
]
},
{
"t": "Log rules",
"x": "$\\log_b x=y$ means $b^y=x$. The rules mirror the exponent rules:\n$$\\log(xy)=\\log x+\\log y,\\quad \\log\\frac xy=\\log x-\\log y,\\quad \\log x^k=k\\log x.$$\n\nChange of base: $\\log_b x=\\dfrac{\\log x}{\\log b}$ in any base you like.\n\nAlso $\\log_b b=1$ and $\\log_b1=0$.",
"ex": {
"q": "Simplify $\\log_2 24-\\log_2 3$.",
"steps": [
"Subtracting logs divides: $\\log_2\\frac{24}{3}$.",
"$=\\log_2 8$.",
"$=3$."
],
"ans": "$3$"
},
"checks": [
{
"q": "What is $\\log_3 81$?",
"c": [
"$4$",
"$27$",
"$3$",
"$\\frac{81}{3}$"
],
"why": "$3^4=81$."
},
{
"q": "What is $\\log_4 8$?",
"c": [
"$\\frac32$",
"$2$",
"$\\frac23$",
"$\\frac12$"
],
"why": "$\\frac{\\log_2 8}{\\log_2 4}=\\frac32$."
}
]
},
{
"t": "Geometric series",
"x": "A **geometric sequence** multiplies by the same ratio $r$ each time: $a, ar, ar^2,\\dots$\n\nThe sum of $n$ terms is $a\\dfrac{r^n-1}{r-1}$. If $|r|<1$, the infinite sum is $\\dfrac{a}{1-r}$.\n\nThe trick behind it: multiply the sum by $r$ and subtract; almost everything cancels.",
"ex": {
"q": "Find $1+\\frac13+\\frac19+\\frac1{27}+\\cdots$.",
"steps": [
"First term $a=1$, ratio $r=\\frac13$.",
"$|r|<1$, so the sum is $\\frac{1}{1-\\frac13}$.",
"$=\\frac32$."
],
"ans": "$\\frac32$"
},
"checks": [
{
"q": "What is $1+2+4+\\dots+2^{9}$?",
"c": [
"$1023$",
"$1024$",
"$512$",
"$2047$"
],
"why": "$\\frac{2^{10}-1}{2-1}=1023$."
},
{
"q": "Write $0.\\overline{36}$ as a fraction.",
"c": [
"$\\frac{4}{11}$",
"$\\frac{36}{100}$",
"$\\frac{9}{25}$",
"$\\frac{36}{90}$"
],
"why": "$\\frac{36}{100}+\\frac{36}{100^2}+\\dots=\\frac{36/100}{1-1/100}=\\frac{36}{99}=\\frac4{11}$."
}
]
}
],
[
{
"t": "Complex numbers",
"x": "$i$ is defined by $i^2=-1$. Complex numbers $a+bi$ add and multiply like algebra, replacing $i^2$ by $-1$.\n\nThe **conjugate** of $z=a+bi$ is $\\bar z=a-bi$, and $z\\bar z=a^2+b^2=|z|^2$. To divide, multiply top and bottom by the conjugate of the bottom.\n\nPowers of $i$ cycle: $i, -1, -i, 1$.",
"ex": {
"q": "Compute $\\dfrac{3+i}{1-i}$.",
"steps": [
"Multiply top and bottom by $1+i$.",
"Top: $(3+i)(1+i)=3+3i+i+i^2=2+4i$. Bottom: $1+1=2$.",
"$1+2i$."
],
"ans": "$1+2i$"
},
"checks": [
{
"q": "What is $(2+3i)(2-3i)$?",
"c": [
"$13$",
"$-5$",
"$4-9i$",
"$5$"
],
"why": "$4-9i^2=4+9$."
},
{
"q": "What is $i^{2027}$?",
"c": [
"$-i$",
"$i$",
"$1$",
"$-1$"
],
"why": "$2027=4\\cdot506+3$, so $i^3=-i$."
}
]
},
{
"t": "Conics",
"x": "The four conics and their standard forms:\n• **Circle** $(x-h)^2+(y-k)^2=r^2$.\n• **Parabola** $y=a(x-h)^2+k$.\n• **Ellipse** $\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1$ (semi-axes $a$ and $b$).\n• **Hyperbola** $\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=1$.\n\nTo identify one, complete the squares.",
"ex": {
"q": "What shape is $x^2+4y^2-2x-16y+13=0$?",
"steps": [
"Complete squares: $(x-1)^2-1+4(y-2)^2-16+13=0$.",
"$(x-1)^2+4(y-2)^2=4$, i.e. $\\frac{(x-1)^2}{4}+\\frac{(y-2)^2}{1}=1$.",
"An ellipse centred at $(1,2)$ with semi-axes $2$ and $1$."
],
"ans": "An ellipse"
},
"checks": [
{
"q": "What is the area of the ellipse $\\frac{x^2}{9}+\\frac{y^2}{4}=1$?",
"c": [
"$6\\pi$",
"$36\\pi$",
"$13\\pi$",
"$9\\pi$"
],
"why": "An ellipse's area is $\\pi ab=\\pi\\cdot3\\cdot2$."
},
{
"q": "Which equation is a hyperbola?",
"c": [
"$x^2-y^2=1$",
"$x^2+y^2=1$",
"$y=x^2$",
"$2x^2+y^2=1$"
],
"why": "The squares have opposite signs."
}
]
},
{
"t": "Telescoping",
"x": "A sum **telescopes** when each term splits into a difference $f(k)-f(k+1)$: consecutive pieces cancel, leaving only the first and last.\n\nThe classic: $\\frac{1}{k(k+1)}=\\frac1k-\\frac1{k+1}$.\n\nSo $\\sum_{k=1}^{n}\\frac1{k(k+1)}=1-\\frac1{n+1}$. Look for partial fractions whenever the denominator factors.",
"ex": {
"q": "Find $\\dfrac1{1\\cdot2}+\\dfrac1{2\\cdot3}+\\dots+\\dfrac1{9\\cdot10}$.",
"steps": [
"Write each term as $\\frac1k-\\frac1{k+1}$.",
"$\\left(1-\\frac12\\right)+\\left(\\frac12-\\frac13\\right)+\\dots+\\left(\\frac19-\\frac1{10}\\right)$.",
"Everything cancels except $1-\\frac1{10}=\\frac9{10}$."
],
"ans": "$\\frac{9}{10}$"
},
"checks": [
{
"q": "What is $\\sum_{k=1}^{\\infty}\\frac{1}{k(k+1)}$?",
"c": [
"$1$",
"$\\infty$",
"$\\frac12$",
"$2$"
],
"why": "$1-\\frac1{n+1}\\to1$."
},
{
"q": "What is $\\log\\frac21+\\log\\frac32+\\dots+\\log\\frac{100}{99}$ (base $10$)?",
"c": [
"$2$",
"$1$",
"$99$",
"$100$"
],
"why": "The product telescopes to $\\frac{100}{1}$, and $\\log100=2$."
}
]
}
],
[
{
"t": "Special values",
"x": "To solve a **functional equation**, plug in values that make things collapse: $x=0$, $y=0$, $x=y$, $y=-x$, $x=1$.\n\nEach substitution gives a new fact; combine them.\n\nExample: if $f(x+y)=f(x)+f(y)$, then $x=y=0$ gives $f(0)=2f(0)$, so $f(0)=0$.",
"ex": {
"q": "$f(x)+2f(1-x)=3x$ for all $x$. Find $f(0)$.",
"steps": [
"$x=0$: $f(0)+2f(1)=0$.",
"$x=1$: $f(1)+2f(0)=3$.",
"From the first, $f(0)=-2f(1)$; then $f(1)-4f(1)=3$, so $f(1)=-1$ and $f(0)=2$."
],
"ans": "$2$"
},
"checks": [
{
"q": "If $f(xy)=f(x)+f(y)$ for all positive $x,y$, what is $f(1)$?",
"c": [
"$0$",
"$1$",
"$-1$",
"Can't tell"
],
"why": "$x=y=1$: $f(1)=2f(1)$."
},
{
"q": "If $f(x)+f(-x)=x^2$ for all $x$, what is $f(0)$?",
"c": [
"$0$",
"$1$",
"$\\frac12$",
"Can't tell"
],
"why": "$x=0$: $2f(0)=0$."
}
]
},
{
"t": "Cauchy–Schwarz",
"x": "For real numbers, $(a_1b_1+\\dots+a_nb_n)^2\\le(a_1^2+\\dots+a_n^2)(b_1^2+\\dots+b_n^2)$, with equality when the $a$'s and $b$'s are proportional.\n\nIt bounds a **linear** expression given a sum of **squares**: if $x^2+y^2=1$, then $3x+4y\\le\\sqrt{(9+16)(x^2+y^2)}=5$.\n\nA handy form (Titu/Engel): $\\frac{a^2}{x}+\\frac{b^2}{y}\\ge\\frac{(a+b)^2}{x+y}$.",
"ex": {
"q": "If $x^2+y^2+z^2=9$, find the maximum of $x+2y+2z$.",
"steps": [
"Cauchy–Schwarz: $(x+2y+2z)^2\\le(1+4+4)(x^2+y^2+z^2)=9\\cdot9$.",
"So $x+2y+2z\\le9$.",
"Equality at $(x,y,z)=(1,2,2)$, which has $1+4+4=9$. ✓"
],
"ans": "$9$"
},
"checks": [
{
"q": "If $a^2+b^2=4$, what is the largest value of $a+b$?",
"c": [
"$2\\sqrt2$",
"$4$",
"$2$",
"$\\sqrt2$"
],
"why": "$(a+b)^2\\le2(a^2+b^2)=8$."
},
{
"q": "For positive $x,y$ with $x+y=1$, the minimum of $\\frac1x+\\frac1y$ is:",
"c": [
"$4$",
"$2$",
"$1$",
"$\\frac12$"
],
"why": "Titu: $\\frac{1^2}{x}+\\frac{1^2}{y}\\ge\\frac{(1+1)^2}{x+y}=4$."
}
]
},
{
"t": "Floor",
"x": "$\\lfloor x\\rfloor$ is the greatest integer $\\le x$: $\\lfloor3.7\\rfloor=3$, $\\lfloor-1.2\\rfloor=-2$.\n\nWrite $x=n+f$ with $n=\\lfloor x\\rfloor$ an integer and $0\\le f<1$ the fractional part. Many floor equations become simple once you do this.\n\nTo count multiples: the number of multiples of $k$ up to $N$ is $\\lfloor N/k\\rfloor$.",
"ex": {
"q": "Solve $x+\\lfloor x\\rfloor=8.3$.",
"steps": [
"Write $x=n+f$ with $n$ an integer and $0\\le f<1$: then $2n+f=8.3$.",
"$f=8.3-2n$ must lie in $[0,1)$, so $2n$ is an even integer in $(7.3,8.3]$: $2n=8$.",
"$n=4$, $f=0.3$, so $x=4.3$. Check: $4.3+4=8.3$. ✓"
],
"ans": "$x=4.3$"
},
"checks": [
{
"q": "What is $\\lfloor\\sqrt{50}\\rfloor$?",
"c": [
"$7$",
"$8$",
"$6$",
"$25$"
],
"why": "$49\\le50<64$."
},
{
"q": "How many multiples of $7$ are there from $1$ to $100$?",
"c": [
"$14$",
"$15$",
"$13$",
"$7$"
],
"why": "$\\lfloor100/7\\rfloor=14$."
}
]
}
],
[
{
"t": "Symmetric sums",
"x": "An expression is **symmetric** if swapping variables doesn't change it, like $a^2+b^2$ or $a^3+b^3$.\n\nEvery symmetric expression in $a, b$ can be written using $s=a+b$ and $p=ab$:\n$a^2+b^2=s^2-2p$, $\\ a^3+b^3=s^3-3sp$, $\\ (a-b)^2=s^2-4p$.\n\nCombine with Vieta: if $a,b$ are roots of a quadratic, you know $s$ and $p$ immediately.",
"ex": {
"q": "If $a+b=5$ and $ab=2$, find $a^3+b^3$.",
"steps": [
"$a^3+b^3=(a+b)^3-3ab(a+b)$.",
"$=125-3\\cdot2\\cdot5$.",
"$=95$."
],
"ans": "$95$"
},
"checks": [
{
"q": "If $a+b=6$ and $ab=7$, what is $(a-b)^2$?",
"c": [
"$8$",
"$22$",
"$36$",
"$1$"
],
"why": "$s^2-4p=36-28$."
},
{
"q": "If $a+b=3$ and $a^2+b^2=5$, what is $ab$?",
"c": [
"$2$",
"$4$",
"$1$",
"$-2$"
],
"why": "$5=9-2ab$."
}
]
},
{
"t": "Substitution",
"x": "A good **substitution** turns a hard expression into a familiar one.\n\nRepeated blocks: in $(x^2+x)^2-8(x^2+x)+12$, let $u=x^2+x$. Reciprocal pairs: $x+\\frac1x=t$. Roots: let $u=\\sqrt x$.\n\nAlways translate back at the end, and check for extra solutions you introduced (such as negative square roots).",
"ex": {
"q": "Solve $(x^2+x)^2-8(x^2+x)+12=0$.",
"steps": [
"Let $u=x^2+x$: $u^2-8u+12=0$, so $u=2$ or $u=6$.",
"$x^2+x=2$: $x=1$ or $-2$.",
"$x^2+x=6$: $x=2$ or $-3$."
],
"ans": "$x=1,-2,2,-3$"
},
"checks": [
{
"q": "Solve $x-5\\sqrt x+6=0$.",
"c": [
"$x=4$ or $9$",
"$x=2$ or $3$",
"$x=-2$ or $-3$",
"$x=6$"
],
"why": "$u=\\sqrt x$: $u^2-5u+6=0$, $u=2,3$."
},
{
"q": "How many real solutions does $4^x-5\\cdot2^x+4=0$ have?",
"c": [
"$2$",
"$1$",
"$0$",
"$4$"
],
"why": "$u=2^x$: $u=1$ or $4$, giving $x=0$ or $2$."
}
]
},
{
"t": "Equality first",
"x": "In an optimisation problem, **guess where the best value happens** before proving anything. It's usually when the variables are equal, or at an endpoint.\n\nThe guess tells you which inequality to use, and how to split terms so equality cases match.\n\nExample: to minimise $x+\\frac{4}{x}$, guess equality at $x=\\frac4x$, so $x=2$, and the minimum is $4$.",
"ex": {
"q": "For positive $a,b,c$ with $a+b+c=3$, what is the largest possible $abc$?",
"steps": [
"Symmetric, so guess $a=b=c=1$: $abc=1$.",
"Prove it with AM–GM: $\\frac{a+b+c}{3}\\ge\\sqrt[3]{abc}$, so $1\\ge\\sqrt[3]{abc}$.",
"Maximum $1$."
],
"ans": "$1$"
},
"checks": [
{
"q": "For $x>0$, the minimum of $x+\\frac{9}{x}$ is:",
"c": [
"$6$",
"$9$",
"$10$",
"$3$"
],
"why": "Equality at $x=3$: $3+3$."
},
{
"q": "For $x$ in $[0,4]$, the maximum of $x(4-x)$ is:",
"c": [
"$4$",
"$16$",
"$2$",
"$8$"
],
"why": "Symmetric about $x=2$: $2\\cdot2$."
}
]
}
]
],
"precalculus": [
[
{
"t": "The unit circle",
"x": "Put an angle $\\theta$ at the centre of a circle of radius $1$, measured anticlockwise from the positive $x$-axis. The point where it lands is $(\\cos\\theta,\\sin\\theta)$.\n\nSo $\\cos^2\\theta+\\sin^2\\theta=1$ always, and $\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}$ is the slope of that radius.\n\nSigns by quadrant: all positive in I; only $\\sin$ in II; only $\\tan$ in III; only $\\cos$ in IV.",
"ex": {
"q": "If $\\sin\\theta=\\frac35$ and $\\theta$ is in quadrant II, find $\\cos\\theta$.",
"steps": [
"$\\cos^2\\theta=1-\\frac{9}{25}=\\frac{16}{25}$.",
"So $\\cos\\theta=\\pm\\frac45$.",
"In quadrant II cosine is negative: $-\\frac45$."
],
"ans": "$-\\frac45$"
},
"checks": [
{
"q": "If $\\cos\\theta=\\frac{5}{13}$ in quadrant IV, what is $\\tan\\theta$?",
"c": [
"$-\\frac{12}{5}$",
"$\\frac{12}{5}$",
"$-\\frac{5}{12}$",
"$\\frac{12}{13}$"
],
"why": "$\\sin\\theta=-\\frac{12}{13}$, so $\\tan\\theta=\\frac{-12/13}{5/13}$."
},
{
"q": "What is $\\sin^2 40^\\circ+\\cos^2 40^\\circ$?",
"c": [
"$1$",
"$0$",
"$\\sin80^\\circ$",
"$2$"
],
"why": "Pythagorean identity: it's always $1$."
}
]
},
{
"t": "Special angles",
"x": "Know these exactly:\n• $30^\\circ$: $\\sin=\\frac12$, $\\cos=\\frac{\\sqrt3}2$\n• $45^\\circ$: $\\sin=\\cos=\\frac{\\sqrt2}2$\n• $60^\\circ$: $\\sin=\\frac{\\sqrt3}2$, $\\cos=\\frac12$\n\nFor other quadrants, use the **reference angle** (the acute angle to the $x$-axis) and fix the sign: $\\sin150^\\circ=\\sin30^\\circ=\\frac12$, $\\cos150^\\circ=-\\frac{\\sqrt3}2$.",
"ex": {
"q": "Find $\\cos240^\\circ$.",
"steps": [
"$240^\\circ$ is in quadrant III; its reference angle is $240^\\circ-180^\\circ=60^\\circ$.",
"$\\cos60^\\circ=\\frac12$.",
"Cosine is negative in quadrant III: $-\\frac12$."
],
"ans": "$-\\frac12$"
},
"checks": [
{
"q": "What is $\\tan60^\\circ$?",
"c": [
"$\\sqrt3$",
"$\\frac{\\sqrt3}{3}$",
"$1$",
"$\\frac12$"
],
"why": "$\\frac{\\sqrt3/2}{1/2}=\\sqrt3$."
},
{
"q": "What is $\\sin315^\\circ$?",
"c": [
"$-\\frac{\\sqrt2}2$",
"$\\frac{\\sqrt2}2$",
"$-\\frac12$",
"$\\frac{\\sqrt3}2$"
],
"why": "Reference angle $45^\\circ$, quadrant IV: sine negative."
}
]
},
{
"t": "Radians",
"x": "A **radian** is the angle that cuts off an arc equal to the radius. A full turn is $2\\pi$ radians, so $180^\\circ=\\pi$.\n\nConvert: multiply degrees by $\\frac{\\pi}{180}$; multiply radians by $\\frac{180}{\\pi}$. So $90^\\circ=\\frac\\pi2$, $60^\\circ=\\frac\\pi3$, $45^\\circ=\\frac\\pi4$, $30^\\circ=\\frac\\pi6$.\n\nIn radians, arc length is simply $r\\theta$ and sector area $\\frac12r^2\\theta$.",
"ex": {
"q": "A sector of a circle of radius $6$ has angle $\\frac{2\\pi}{3}$. Find its arc length and area.",
"steps": [
"Arc length $=r\\theta=6\\cdot\\frac{2\\pi}{3}=4\\pi$.",
"Area $=\\frac12r^2\\theta=\\frac12\\cdot36\\cdot\\frac{2\\pi}3$.",
"$=12\\pi$."
],
"ans": "$4\\pi$ and $12\\pi$"
},
"checks": [
{
"q": "How many degrees is $\\frac{5\\pi}{6}$?",
"c": [
"$150^\\circ$",
"$120^\\circ$",
"$300^\\circ$",
"$135^\\circ$"
],
"why": "$\\frac56\\cdot180^\\circ$."
},
{
"q": "What is $\\cos\\frac{\\pi}{3}$?",
"c": [
"$\\frac12$",
"$\\frac{\\sqrt3}2$",
"$0$",
"$1$"
],
"why": "$\\frac\\pi3=60^\\circ$."
}
]
}
],
[
{
"t": "Addition formulas",
"x": "$$\\sin(a\\pm b)=\\sin a\\cos b\\pm\\cos a\\sin b,\\qquad \\cos(a\\pm b)=\\cos a\\cos b\\mp\\sin a\\sin b.$$\n(Note the sign flips for cosine.)\n\nThey let you compute new exact values from known ones: $75^\\circ=45^\\circ+30^\\circ$, $15^\\circ=45^\\circ-30^\\circ$.",
"ex": {
"q": "Find $\\sin75^\\circ$ exactly.",
"steps": [
"$\\sin(45^\\circ+30^\\circ)=\\sin45\\cos30+\\cos45\\sin30$.",
"$=\\frac{\\sqrt2}2\\cdot\\frac{\\sqrt3}2+\\frac{\\sqrt2}2\\cdot\\frac12$.",
"$=\\frac{\\sqrt6+\\sqrt2}{4}$."
],
"ans": "$\\frac{\\sqrt6+\\sqrt2}{4}$"
},
"checks": [
{
"q": "What is $\\cos15^\\circ$?",
"c": [
"$\\frac{\\sqrt6+\\sqrt2}{4}$",
"$\\frac{\\sqrt6-\\sqrt2}{4}$",
"$\\frac{\\sqrt3}{4}$",
"$\\frac12$"
],
"why": "$\\cos(45-30)=\\cos45\\cos30+\\sin45\\sin30$, the same as $\\sin75^\\circ$."
},
{
"q": "Simplify $\\sin x\\cos y-\\cos x\\sin y$.",
"c": [
"$\\sin(x-y)$",
"$\\sin(x+y)$",
"$\\cos(x+y)$",
"$\\cos(x-y)$"
],
"why": "It's the subtraction formula for sine."
}
]
},
{
"t": "Double angle",
"x": "Set $a=b$ in the addition formulas:\n$$\\sin2x=2\\sin x\\cos x,\\qquad \\cos2x=\\cos^2x-\\sin^2x=2\\cos^2x-1=1-2\\sin^2x.$$\n\nThe $\\cos2x$ forms let you trade squares for double angles: $\\sin^2x=\\frac{1-\\cos2x}{2}$.\n\nProducts like $\\sin x\\cos x$ often simplify to $\\frac12\\sin2x$.",
"ex": {
"q": "If $\\sin x=\\frac35$ with $x$ acute, find $\\sin2x$ and $\\cos2x$.",
"steps": [
"$\\cos x=\\frac45$.",
"$\\sin2x=2\\cdot\\frac35\\cdot\\frac45=\\frac{24}{25}$.",
"$\\cos2x=1-2\\cdot\\frac9{25}=\\frac7{25}$."
],
"ans": "$\\frac{24}{25}$ and $\\frac{7}{25}$"
},
"checks": [
{
"q": "What is $2\\sin15^\\circ\\cos15^\\circ$?",
"c": [
"$\\frac12$",
"$\\frac{\\sqrt3}2$",
"$1$",
"$\\frac14$"
],
"why": "It's $\\sin30^\\circ$."
},
{
"q": "What is $\\cos^2 22.5^\\circ-\\sin^2 22.5^\\circ$?",
"c": [
"$\\frac{\\sqrt2}2$",
"$1$",
"$\\frac12$",
"$0$"
],
"why": "It's $\\cos45^\\circ$."
}
]
},
{
"t": "Law of cosines",
"x": "For any triangle with sides $a, b, c$ and angle $C$ opposite $c$:\n$$c^2=a^2+b^2-2ab\\cos C.$$\n\nWhen $C=90^\\circ$ it's Pythagoras. Use it to find a side from two sides and the angle between them, or an angle from all three sides.\n\n$C$ is obtuse exactly when $c^2>a^2+b^2$.",
"ex": {
"q": "A triangle has sides $5$ and $8$ with a $60^\\circ$ angle between them. Find the third side.",
"steps": [
"$c^2=25+64-2\\cdot5\\cdot8\\cos60^\\circ$.",
"$=89-40=49$.",
"$c=7$."
],
"ans": "$7$"
},
"checks": [
{
"q": "A triangle has sides $3$, $5$, $7$. What is the angle opposite $7$?",
"c": [
"$120^\\circ$",
"$90^\\circ$",
"$135^\\circ$",
"$150^\\circ$"
],
"why": "$49=9+25-30\\cos C$ gives $\\cos C=-\\frac12$."
},
{
"q": "Is the triangle with sides $6, 7, 10$ acute, right or obtuse?",
"c": [
"Obtuse",
"Acute",
"Right",
"Can't tell"
],
"why": "$10^2=100>36+49=85$."
}
]
}
],
[
{
"t": "Dot product",
"x": "For vectors $\\mathbf u=(u_1,u_2)$ and $\\mathbf v=(v_1,v_2)$: $\\mathbf u\\cdot\\mathbf v=u_1v_1+u_2v_2$, and also $\\mathbf u\\cdot\\mathbf v=|\\mathbf u||\\mathbf v|\\cos\\theta$.\n\nSo vectors are **perpendicular** exactly when their dot product is $0$, and you can find the angle between any two vectors.\n\n$\\mathbf v\\cdot\\mathbf v=|\\mathbf v|^2$.",
"ex": {
"q": "Find the angle between $(1,2)$ and $(3,1)$.",
"steps": [
"Dot product: $3+2=5$.",
"Lengths: $\\sqrt5$ and $\\sqrt{10}$, product $\\sqrt{50}=5\\sqrt2$.",
"$\\cos\\theta=\\frac{5}{5\\sqrt2}=\\frac{1}{\\sqrt2}$, so $\\theta=45^\\circ$."
],
"ans": "$45^\\circ$"
},
"checks": [
{
"q": "For which $k$ are $(2,k)$ and $(3,-6)$ perpendicular?",
"c": [
"$1$",
"$-1$",
"$4$",
"$\\frac12$"
],
"why": "$6-6k=0$."
},
{
"q": "What is $(1,2,3)\\cdot(4,-5,6)$?",
"c": [
"$12$",
"$32$",
"$-12$",
"$0$"
],
"why": "$4-10+18=12$."
}
]
},
{
"t": "Determinants",
"x": "For a $2\\times2$ matrix, $\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}=ad-bc$.\n\nIts absolute value is the **area of the parallelogram** spanned by the column vectors $(a,c)$ and $(b,d)$; a triangle with those sides has half that area.\n\nA determinant of $0$ means the vectors are parallel (and the matrix has no inverse).",
"ex": {
"q": "Find the area of the triangle with vertices $(0,0)$, $(4,1)$ and $(2,5)$.",
"steps": [
"Use the vectors $(4,1)$ and $(2,5)$.",
"$\\det=4\\cdot5-1\\cdot2=18$: the parallelogram has area $18$.",
"The triangle is half: $9$."
],
"ans": "$9$"
},
"checks": [
{
"q": "What is $\\det\\begin{pmatrix}3&2\\\\5&4\\end{pmatrix}$?",
"c": [
"$2$",
"$22$",
"$-2$",
"$7$"
],
"why": "$12-10=2$."
},
{
"q": "For which $k$ is $\\begin{pmatrix}2&k\\\\3&6\\end{pmatrix}$ not invertible?",
"c": [
"$4$",
"$9$",
"$1$",
"$-4$"
],
"why": "$12-3k=0$."
}
]
},
{
"t": "Polar form",
"x": "A complex number $z=a+bi$ can also be described by its **length** $r=|z|=\\sqrt{a^2+b^2}$ and **angle** $\\theta$: $z=r(\\cos\\theta+i\\sin\\theta)$.\n\nMultiplying complex numbers **multiplies lengths and adds angles**. Dividing divides lengths and subtracts angles.\n\nSo multiplying by $i$ rotates by $90^\\circ$.",
"ex": {
"q": "Write $1+i$ in polar form, then compute $(1+i)^2$ using it.",
"steps": [
"$r=\\sqrt2$, $\\theta=45^\\circ$.",
"Squaring: length $(\\sqrt2)^2=2$, angle $90^\\circ$.",
"$2(\\cos90^\\circ+i\\sin90^\\circ)=2i$."
],
"ans": "$2i$"
},
"checks": [
{
"q": "What is $|3-4i|$?",
"c": [
"$5$",
"$7$",
"$1$",
"$25$"
],
"why": "$\\sqrt{9+16}$."
},
{
"q": "$z$ has length $2$ and angle $30^\\circ$; $w$ has length $3$ and angle $60^\\circ$. What is $zw$?",
"c": [
"$6i$",
"$6$",
"$5i$",
"$6+6i$"
],
"why": "Length $6$, angle $90^\\circ$."
}
]
}
],
[
{
"t": "De Moivre",
"x": "$\\left(\\cos\\theta+i\\sin\\theta\\right)^n=\\cos n\\theta+i\\sin n\\theta$.\n\nIn polar form, raising to the $n$-th power raises the length to the $n$ and multiplies the angle by $n$.\n\nThat makes huge powers easy: convert to polar, power up, convert back.",
"ex": {
"q": "Compute $(1+i)^8$.",
"steps": [
"$1+i$ has length $\\sqrt2$ and angle $45^\\circ$.",
"Eighth power: length $(\\sqrt2)^8=16$, angle $360^\\circ$.",
"$16(\\cos360^\\circ+i\\sin360^\\circ)=16$."
],
"ans": "$16$"
},
"checks": [
{
"q": "What is $\\left(\\frac{1}{2}+\\frac{\\sqrt3}{2}i\\right)^6$?",
"c": [
"$1$",
"$-1$",
"$i$",
"$6$"
],
"why": "Length $1$, angle $60^\\circ$; times $6$ is $360^\\circ$."
},
{
"q": "What is $(\\cos 20^\\circ+i\\sin20^\\circ)^{9}$?",
"c": [
"$-1$",
"$1$",
"$i$",
"$-i$"
],
"why": "Angle $180^\\circ$."
}
]
},
{
"t": "Roots of unity",
"x": "The solutions of $z^n=1$ are the $n$ **roots of unity**: $\\cos\\frac{2\\pi k}{n}+i\\sin\\frac{2\\pi k}{n}$ for $k=0,1,\\dots,n-1$.\n\nThey sit evenly spaced on the unit circle, forming a regular $n$-gon.\n\nThey **add to $0$** (for $n\\ge2$), and multiply to $\\pm1$. If $\\omega$ is a primitive cube root of unity, $1+\\omega+\\omega^2=0$ and $\\omega^3=1$.",
"ex": {
"q": "Let $\\omega\\ne1$ satisfy $\\omega^3=1$. Find $\\omega^{100}+\\omega^{200}$.",
"steps": [
"$\\omega^{99}=1$, so $\\omega^{100}=\\omega$; and $\\omega^{198}=1$, so $\\omega^{200}=\\omega^2$.",
"$\\omega+\\omega^2=-1$ because $1+\\omega+\\omega^2=0$.",
"Answer $-1$."
],
"ans": "$-1$"
},
"checks": [
{
"q": "How many solutions does $z^6=1$ have in the complex numbers?",
"c": [
"$6$",
"$2$",
"$1$",
"$3$"
],
"why": "An $n$-th degree equation has $n$ roots; here the $6$ roots of unity."
},
{
"q": "What is the sum of the $5$th roots of unity?",
"c": [
"$0$",
"$1$",
"$5$",
"$-1$"
],
"why": "They're symmetric around the origin, and by Vieta on $z^5-1$ the sum is $0$."
}
]
},
{
"t": "Cross product",
"x": "For 3D vectors, $\\mathbf u\\times\\mathbf v$ is a vector **perpendicular to both**, with length $|\\mathbf u||\\mathbf v|\\sin\\theta$, the area of the parallelogram they span.\n\nCompute it with the pattern\n$\\mathbf u\\times\\mathbf v=(u_2v_3-u_3v_2,\\ u_3v_1-u_1v_3,\\ u_1v_2-u_2v_1)$.\n\nOrder matters: $\\mathbf v\\times\\mathbf u=-\\mathbf u\\times\\mathbf v$.",
"ex": {
"q": "Find $(1,0,0)\\times(0,1,0)$ and $(1,2,0)\\times(3,4,0)$.",
"steps": [
"First: $(0\\cdot0-0\\cdot1,\\ 0\\cdot0-1\\cdot0,\\ 1\\cdot1-0\\cdot0)=(0,0,1)$.",
"Second: $(0,0,1\\cdot4-2\\cdot3)=(0,0,-2)$.",
"The second has length $2$: the parallelogram's area."
],
"ans": "$(0,0,1)$ and $(0,0,-2)$"
},
"checks": [
{
"q": "What is the area of the parallelogram spanned by $(2,0,0)$ and $(0,3,0)$?",
"c": [
"$6$",
"$5$",
"$0$",
"$\\sqrt{13}$"
],
"why": "They're perpendicular: $2\\cdot3$."
},
{
"q": "What is $\\mathbf u\\times\\mathbf u$ for any vector $\\mathbf u$?",
"c": [
"$\\mathbf 0$",
"$|\\mathbf u|^2$",
"$\\mathbf u$",
"$1$"
],
"why": "$\\sin0^\\circ=0$."
}
]
}
],
[
{
"t": "Parametric curves",
"x": "A **parametric curve** gives $x$ and $y$ separately in terms of a parameter $t$: $x=f(t)$, $y=g(t)$. Think of $t$ as time and $(x,y)$ as a moving point.\n\nTo find the ordinary equation, **eliminate $t$**: solve one equation for $t$ and substitute, or use an identity like $\\cos^2t+\\sin^2t=1$.\n\n$x=r\\cos t$, $y=r\\sin t$ traces a circle of radius $r$.",
"ex": {
"q": "Eliminate $t$: $x=2t+1$, $y=t^2$.",
"steps": [
"From the first, $t=\\frac{x-1}{2}$.",
"Substitute: $y=\\left(\\frac{x-1}{2}\\right)^2$.",
"A parabola: $y=\\frac{(x-1)^2}{4}$."
],
"ans": "$y=\\frac{(x-1)^2}{4}$"
},
"checks": [
{
"q": "What curve is $x=3\\cos t$, $y=3\\sin t$?",
"c": [
"A circle of radius $3$",
"A line",
"An ellipse with axes $3$ and $9$",
"A parabola"
],
"why": "$x^2+y^2=9(\\cos^2t+\\sin^2t)=9$."
},
{
"q": "Where is the point $x=t^2$, $y=t+1$ when $t=-2$?",
"c": [
"$(4,-1)$",
"$(-4,-1)$",
"$(4,3)$",
"$(2,-1)$"
],
"why": "$x=4$, $y=-1$."
}
]
},
{
"t": "Polar coordinates",
"x": "A point can be given by its **distance** $r$ from the origin and **angle** $\\theta$ from the positive $x$-axis.\n\nConvert: $x=r\\cos\\theta$, $y=r\\sin\\theta$, and $r^2=x^2+y^2$, $\\tan\\theta=\\frac yx$.\n\nSome curves are much simpler in polar form: $r=2$ is a circle, $\\theta=\\frac\\pi4$ is a line through the origin.",
"ex": {
"q": "Convert the polar point $\\left(4,\\frac{2\\pi}{3}\\right)$ to $(x,y)$.",
"steps": [
"$x=4\\cos120^\\circ=4\\cdot(-\\frac12)=-2$.",
"$y=4\\sin120^\\circ=4\\cdot\\frac{\\sqrt3}2=2\\sqrt3$.",
"$(-2,2\\sqrt3)$."
],
"ans": "$(-2,2\\sqrt3)$"
},
"checks": [
{
"q": "What is $(0,-3)$ in polar form (with $r>0$)?",
"c": [
"$\\left(3,\\frac{3\\pi}2\\right)$",
"$\\left(3,\\frac{\\pi}2\\right)$",
"$(-3,0)$",
"$(3,\\pi)$"
],
"why": "It's $3$ units straight down."
},
{
"q": "What is $r=4\\cos\\theta$ in Cartesian form?",
"c": [
"$(x-2)^2+y^2=4$",
"$x^2+y^2=4$",
"$x=4$",
"$y=4x$"
],
"why": "Multiply by $r$: $x^2+y^2=4x$, then complete the square."
}
]
},
{
"t": "Symmetries",
"x": "Use symmetry to simplify trig: $\\sin(-x)=-\\sin x$ (odd), $\\cos(-x)=\\cos x$ (even), $\\sin(180^\\circ-x)=\\sin x$, $\\cos(90^\\circ-x)=\\sin x$.\n\nSums over symmetric angles often cancel or pair up: $\\sin^2x+\\sin^2(90^\\circ-x)=1$.\n\nPeriodicity: $\\sin$ and $\\cos$ repeat every $360^\\circ$; $\\tan$ every $180^\\circ$.",
"ex": {
"q": "Find $\\sin^21^\\circ+\\sin^22^\\circ+\\dots+\\sin^289^\\circ$.",
"steps": [
"Pair $\\sin^2k+\\sin^2(90^\\circ-k)=\\sin^2k+\\cos^2k=1$.",
"$k=1,\\dots,44$ pair with $89,\\dots,46$: $44$ pairs giving $44$.",
"Plus the middle term $\\sin^245^\\circ=\\frac12$: total $44.5$."
],
"ans": "$\\frac{89}{2}$"
},
"checks": [
{
"q": "What is $\\cos(-60^\\circ)$?",
"c": [
"$\\frac12$",
"$-\\frac12$",
"$\\frac{\\sqrt3}2$",
"$-\\frac{\\sqrt3}2$"
],
"why": "Cosine is even."
},
{
"q": "What is $\\sin10^\\circ-\\cos80^\\circ$?",
"c": [
"$0$",
"$1$",
"$\\sin70^\\circ$",
"$-1$"
],
"why": "$\\cos80^\\circ=\\sin10^\\circ$."
}
]
}
]
],
"oly_nt": [
[
{
"t": "Parity",
"x": "Every integer is **even or odd**, and the rules are simple: even $\\pm$ even $=$ even, odd $\\pm$ odd $=$ even, odd $\\times$ odd $=$ odd, and anything $\\times$ even $=$ even.\n\nParity arguments prove impossibility quickly: if one side of an equation must be odd and the other even, there are no solutions.\n\nA sum of integers is odd exactly when it has an odd number of odd terms.",
"ex": {
"q": "Can $x^2+y^2=4z+3$ have integer solutions?",
"steps": [
"Look mod $4$: squares are $0$ or $1$, so $x^2+y^2$ is $0$, $1$ or $2$ mod $4$.",
"The right side is $3$ mod $4$.",
"So no solutions."
],
"ans": "No"
},
"checks": [
{
"q": "The numbers $1, 2, \\dots, 10$ are written down. You may replace any two by their difference. Can you end with $0$?",
"c": [
"No",
"Yes",
"Only if you start with $1$",
"Only after $5$ moves"
],
"why": "Replacing $a,b$ by $a-b$ keeps the parity of the total. The total starts at $55$ (odd), so the last number is odd."
},
{
"q": "$a$ and $b$ are integers and $a+b$ is odd. Then $a-b$ is:",
"c": [
"Odd",
"Even",
"Zero",
"Can't tell"
],
"why": "$(a+b)-(a-b)=2b$ is even, so $a+b$ and $a-b$ have the same parity."
}
]
},
{
"t": "Factor everything",
"x": "In integer equations, **factoring** is the strongest tool: if $(x-a)(y-b)=N$, then each factor is a divisor of $N$, and there are only finitely many cases.\n\n**Simon's favourite factoring trick**: turn $xy+ax+by$ into a product by adding a constant: $xy+ax+by+ab=(x+b)(y+a)$.\n\nDifferences of squares and of cubes factor too.",
"ex": {
"q": "Find all positive integers $x,y$ with $xy-2x-3y=0$.",
"steps": [
"Add $6$: $xy-2x-3y+6=6$, so $(x-3)(y-2)=6$.",
"Positive factor pairs of $6$: $(1,6),(2,3),(3,2),(6,1)$ (negative pairs give non-positive $x$ or $y$).",
"Solutions: $(4,8), (5,5), (6,4), (9,3)$."
],
"ans": "$(4,8),(5,5),(6,4),(9,3)$"
},
"checks": [
{
"q": "How many positive integer pairs satisfy $x^2-y^2=15$?",
"c": [
"$2$",
"$4$",
"$1$",
"$0$"
],
"why": "$(x-y)(x+y)=15$: $(1,15)$ gives $(8,7)$ and $(3,5)$ gives $(4,1)$."
},
{
"q": "What is the largest prime factor of $3^8-1$?",
"c": [
"$41$",
"$13$",
"$5$",
"$7$"
],
"why": "$(3^4-1)(3^4+1)=80\\cdot82=2^5\\cdot5\\cdot2\\cdot41$."
}
]
},
{
"t": "Last digits",
"x": "The last digit of a number is its remainder **mod $10$**; the last two digits are the remainder mod $100$.\n\nLast digits of powers repeat in cycles of length dividing $4$. For mod $100$, Euler's theorem gives a cycle length dividing $40$ (for numbers coprime to $10$).\n\nSplit $100=4\\times25$ and use the Chinese remainder theorem when needed.",
"ex": {
"q": "Find the last two digits of $7^{40}$.",
"steps": [
"$7^2=49$, $7^4=2401\\equiv1\\pmod{100}$.",
"So $7^{40}=(7^4)^{10}\\equiv1$.",
"Last two digits $01$."
],
"ans": "$01$"
},
"checks": [
{
"q": "What is the last digit of $1^1+2^2+3^3+4^4$?",
"c": [
"$8$",
"$0$",
"$4$",
"$2$"
],
"why": "$1+4+27+256=288$."
},
{
"q": "What are the last two digits of $3^{20}$?",
"c": [
"$01$",
"$81$",
"$49$",
"$43$"
],
"why": "$3^{10}=59049\\equiv49$; $49^2=2401\\equiv01$."
}
]
}
],
[
{
"t": "Congruences",
"x": "Treat $\\equiv\\pmod n$ like equality: add, subtract, multiply both sides, and raise to powers.\n\nYou may **divide** by $a$ only if $\\gcd(a,n)=1$. In general, $ka\\equiv kb\\pmod n$ gives $a\\equiv b\\pmod{\\frac{n}{\\gcd(k,n)}}$.\n\nChoosing the right modulus is the art: try $3, 4, 8, 9, 7, 11$ and see which makes the problem collapse.",
"ex": {
"q": "Show that $n^3-n$ is always divisible by $6$.",
"steps": [
"$n^3-n=(n-1)n(n+1)$, three consecutive integers.",
"One of them is even, and one is a multiple of $3$.",
"So $6$ divides the product."
],
"ans": "Always divisible by $6$"
},
"checks": [
{
"q": "Solve $6x\\equiv4\\pmod{10}$.",
"c": [
"$x\\equiv4\\pmod 5$",
"$x\\equiv4\\pmod{10}$",
"No solution",
"$x\\equiv2\\pmod 5$"
],
"why": "Divide everything by $2$: $3x\\equiv2\\pmod5$; the inverse of $3$ is $2$, so $x\\equiv4$."
},
{
"q": "What is $2^{2025}\\bmod 3$?",
"c": [
"$2$",
"$1$",
"$0$",
"$3$"
],
"why": "$2\\equiv-1$, so $2^{2025}\\equiv(-1)^{2025}=-1\\equiv2$."
}
]
},
{
"t": "Divisor counts",
"x": "If $n=p_1^{a_1}\\cdots p_k^{a_k}$, then $d(n)=(a_1+1)\\cdots(a_k+1)$.\n\nWorking **backwards** is common: a number with exactly $6$ divisors is $p^5$ or $p^2q$.\n\nDivisors pair up as $d\\leftrightarrow\\frac nd$, so the product of all divisors is $n^{d(n)/2}$.",
"ex": {
"q": "Find the smallest positive integer with exactly $12$ divisors.",
"steps": [
"$12=12, 6\\cdot2, 4\\cdot3, 3\\cdot2\\cdot2$ give shapes $p^{11}, p^5q, p^3q^2, p^2qr$.",
"Use the smallest primes, biggest exponent on $2$: $2^{11}$, $2^5\\cdot3=96$, $2^3\\cdot3^2=72$, $2^2\\cdot3\\cdot5=60$.",
"The smallest is $60$."
],
"ans": "$60$"
},
"checks": [
{
"q": "How many divisors does $10^6$ have?",
"c": [
"$49$",
"$36$",
"$7$",
"$12$"
],
"why": "$2^6\\cdot5^6$: $7\\cdot7$."
},
{
"q": "What is the product of all divisors of $12$?",
"c": [
"$1728$",
"$144$",
"$28$",
"$72$"
],
"why": "$d(12)=6$, so it's $12^3$."
}
]
},
{
"t": "Squares mod small numbers",
"x": "Squares have very few possible remainders:\n• mod $3$: $0, 1$\n• mod $4$: $0, 1$\n• mod $5$: $0, 1, 4$\n• mod $8$: $0, 1, 4$ (odd squares are always $1$)\n• mod $9$: $0, 1, 4, 7$\n\nSo a number $\\equiv2$ or $3\\pmod4$ is never a square, and a sum of two squares is never $\\equiv3\\pmod4$.",
"ex": {
"q": "Is $n^2+n+1$ ever divisible by $5$?",
"steps": [
"Try $n=0,1,2,3,4$: $1, 3, 7, 13, 21$.",
"Mod $5$: $1, 3, 2, 3, 1$.",
"Never $0$: $5$ never divides $n^2+n+1$."
],
"ans": "Never divisible by $5$"
},
"checks": [
{
"q": "Which number can be a perfect square?",
"c": [
"$2\\,025$",
"$2\\,027$",
"$2\\,023$",
"$2\\,022$"
],
"why": "$2027\\equiv3$, $2023\\equiv3\\pmod 4$, and $2022\\equiv2\\pmod 4$; $2025=45^2$."
},
{
"q": "Can a perfect square end in the digit $7$?",
"c": [
"No",
"Yes",
"Only if it's odd",
"Only above $1000$"
],
"why": "Squares mod $10$ are $0,1,4,5,6,9$."
}
]
}
],
[
{
"t": "Euler's theorem",
"x": "If $\\gcd(a,n)=1$, then $a^{\\varphi(n)}\\equiv1\\pmod n$, where $\\varphi(n)$ counts the numbers from $1$ to $n$ coprime to $n$.\n\n$\\varphi(p)=p-1$ for a prime (that's Fermat), $\\varphi(p^k)=p^k-p^{k-1}$, and $\\varphi$ multiplies over coprime parts: $\\varphi(100)=\\varphi(4)\\varphi(25)=2\\cdot20=40$.\n\nSo exponents can be reduced mod $\\varphi(n)$.",
"ex": {
"q": "Find $3^{2026}\\bmod 100$.",
"steps": [
"$\\varphi(100)=40$ and $\\gcd(3,100)=1$, so $3^{40}\\equiv1$; in fact the order of $3$ is even smaller: $3^{10}=59049\\equiv49$ and $49^2=2401\\equiv1$, so $3^{20}\\equiv1$.",
"$2026=20\\cdot101+6$, so $3^{2026}\\equiv3^{6}=729$.",
"$729\\equiv29\\pmod{100}$."
],
"ans": "$29$"
},
"checks": [
{
"q": "What is $\\varphi(36)$?",
"c": [
"$12$",
"$18$",
"$24$",
"$6$"
],
"why": "$\\varphi(4)\\varphi(9)=2\\cdot6$."
},
{
"q": "What is $7^{100}\\bmod 15$?",
"c": [
"$1$",
"$7$",
"$4$",
"$13$"
],
"why": "$\\varphi(15)=8$, $100=8\\cdot12+4$, $7^4=2401\\equiv1$."
}
]
},
{
"t": "Wilson's theorem",
"x": "For a prime $p$: $(p-1)!\\equiv-1\\pmod p$.\n\nWhy: in $1\\cdot2\\cdots(p-1)$, every number pairs with its inverse mod $p$ and the pair multiplies to $1$, except $1$ and $p-1$, which are their own inverses. So the product is $1\\cdot(p-1)\\equiv-1$.\n\nFor composite $n>4$, $(n-1)!\\equiv0\\pmod n$.",
"ex": {
"q": "Find $10!\\bmod 11$ and $9!\\bmod 11$.",
"steps": [
"Wilson: $10!\\equiv-1\\equiv10\\pmod{11}$.",
"$10!=10\\cdot9!$, and $10\\equiv-1$, so $-9!\\equiv-1$.",
"$9!\\equiv1\\pmod{11}$."
],
"ans": "$10$ and $1$"
},
"checks": [
{
"q": "What is $12!\\bmod 13$?",
"c": [
"$12$",
"$1$",
"$0$",
"$6$"
],
"why": "Wilson: $-1\\equiv12$."
},
{
"q": "What is $5!\\bmod 6$?",
"c": [
"$0$",
"$5$",
"$1$",
"$3$"
],
"why": "$6$ is composite and $5!=120=6\\cdot20$."
}
]
},
{
"t": "Legendre's formula",
"x": "The exponent of a prime $p$ in $n!$ is\n$$\\left\\lfloor\\frac np\\right\\rfloor+\\left\\lfloor\\frac n{p^2}\\right\\rfloor+\\left\\lfloor\\frac n{p^3}\\right\\rfloor+\\cdots$$\n\nEach multiple of $p$ contributes one, each multiple of $p^2$ one more, and so on.\n\nThe number of **trailing zeros** of $n!$ is the exponent of $5$ (there are always more $2$s).",
"ex": {
"q": "How many zeros does $100!$ end in?",
"steps": [
"Count factors of $5$: $\\lfloor100/5\\rfloor=20$.",
"Plus $\\lfloor100/25\\rfloor=4$ (extra fives from $25, 50, 75, 100$).",
"$24$ zeros."
],
"ans": "$24$"
},
"checks": [
{
"q": "What is the largest power of $2$ dividing $20!$?",
"c": [
"$2^{18}$",
"$2^{10}$",
"$2^{16}$",
"$2^{20}$"
],
"why": "$10+5+2+1=18$."
},
{
"q": "How many zeros does $30!$ end in?",
"c": [
"$7$",
"$6$",
"$3$",
"$8$"
],
"why": "$6+1=7$."
}
]
}
],
[
{
"t": "Orders",
"x": "The **order** of $a$ mod $n$ is the smallest $k\\ge1$ with $a^k\\equiv1\\pmod n$.\n\nKey fact: $a^m\\equiv1$ exactly when the order divides $m$. In particular, the order divides $\\varphi(n)$.\n\nSo to find an order, only test divisors of $\\varphi(n)$.",
"ex": {
"q": "Find the order of $2$ modulo $11$.",
"steps": [
"The order divides $\\varphi(11)=10$: test $1, 2, 5, 10$.",
"$2^1=2$, $2^2=4$, $2^5=32\\equiv10$.",
"None is $1$, so the order is $10$."
],
"ans": "$10$"
},
"checks": [
{
"q": "What is the order of $3$ mod $7$?",
"c": [
"$6$",
"$3$",
"$2$",
"$7$"
],
"why": "Test divisors of $6$: $3^2=9\\equiv2$, $3^3=27\\equiv6$. So it's $6$."
},
{
"q": "If $a$ has order $12$ mod $n$, for which $m$ is $a^m\\equiv1$?",
"c": [
"$m=36$",
"$m=6$",
"$m=8$",
"$m=18$"
],
"why": "Exactly the multiples of $12$."
}
]
},
{
"t": "Lifting the exponent",
"x": "For an odd prime $p$ with $p\\mid a-b$ (and $p\\nmid a, b$):\n$$v_p(a^n-b^n)=v_p(a-b)+v_p(n),$$\nwhere $v_p(x)$ is the exponent of $p$ in $x$.\n\nFor $p=2$ with $a,b$ odd and $n$ even: $v_2(a^n-b^n)=v_2(a-b)+v_2(a+b)+v_2(n)-1$.\n\nIt answers \"what is the largest power of $p$ dividing…\" instantly.",
"ex": {
"q": "What is the largest power of $3$ dividing $10^{9}-1$?",
"steps": [
"$3\\mid10-1=9$, so LTE applies with $a=10$, $b=1$.",
"$v_3(10^9-1)=v_3(9)+v_3(9)=2+2$.",
"$3^4$."
],
"ans": "$3^4$"
},
"checks": [
{
"q": "What is $v_5(6^{25}-1)$?",
"c": [
"$3$",
"$2$",
"$1$",
"$25$"
],
"why": "$v_5(5)+v_5(25)=1+2$."
},
{
"q": "What is $v_2(3^{8}-1)$?",
"c": [
"$5$",
"$3$",
"$4$",
"$8$"
],
"why": "$v_2(2)+v_2(4)+v_2(8)-1=1+2+3-1=5$ (indeed $6560=2^5\\cdot205$)."
}
]
},
{
"t": "Bounding",
"x": "If an equation's sides grow at different rates, only **small values** can work. Bound the variables, then check what's left by hand.\n\nTypical moves: compare $x^2$ with consecutive squares (if $n^2<x^2<(n+1)^2$, impossible); factorials and powers outgrow polynomials.\n\nCombine with mods to cut the cases further.",
"ex": {
"q": "Find all positive integers $n$ with $n^2+n+1$ a perfect square.",
"steps": [
"For $n\\ge1$: $n^2<n^2+n+1<n^2+2n+1=(n+1)^2$.",
"It's strictly between consecutive squares.",
"So there are no positive solutions."
],
"ans": "None"
},
"checks": [
{
"q": "For how many positive $n$ is $n!+1$ a perfect square, with $n\\le7$?",
"c": [
"$3$",
"$1$",
"$0$",
"$7$"
],
"why": "$4!+1=25$, $5!+1=121$, $7!+1=5041=71^2$."
},
{
"q": "Which positive $x$ satisfies $2^x=x^2$ with $x\\ne2$?",
"c": [
"$4$",
"$3$",
"$8$",
"$16$"
],
"why": "$2^4=16=4^2$; beyond that $2^x$ wins."
}
]
}
],
[
{
"t": "Infinite descent",
"x": "To show an equation has no positive solutions, suppose there's one and build a **smaller** positive one. Repeating forever is impossible, because positive integers can't decrease forever.\n\nEquivalently: take the **smallest** solution and find an even smaller one, a contradiction.\n\nThe classic: $\\sqrt2$ is irrational. If $a^2=2b^2$, then $a$ is even, $a=2c$, so $b^2=2c^2$: a smaller solution.",
"ex": {
"q": "Show $x^2+y^2=3z^2$ has no positive integer solutions.",
"steps": [
"Squares mod $3$ are $0,1$; $x^2+y^2\\equiv0$ forces $x\\equiv y\\equiv0\\pmod3$.",
"Then $9\\mid3z^2$, so $3\\mid z$.",
"Divide everything by $3$: a smaller solution. Descent: impossible."
],
"ans": "No solutions"
},
"checks": [
{
"q": "If $a^2=2b^2$ with positive integers, what must be true of $a$?",
"c": [
"$a$ is even",
"$a$ is odd",
"$a$ is prime",
"$a=b$"
],
"why": "$a^2$ is even, so $a$ is even, and descent follows."
},
{
"q": "The descent argument works because:",
"c": [
"Positive integers can't decrease forever",
"Every number is prime",
"Squares are positive",
"Equations have unique solutions"
],
"why": "That's the well-ordering principle."
}
]
},
{
"t": "Sums of two squares",
"x": "A prime $p$ is a sum of two squares exactly when $p=2$ or $p\\equiv1\\pmod4$: $5=1+4$, $13=4+9$, $29=4+25$.\n\nA positive integer is a sum of two squares exactly when every prime $\\equiv3\\pmod4$ appears to an **even** power in its factorisation.\n\nThe identity $(a^2+b^2)(c^2+d^2)=(ac-bd)^2+(ad+bc)^2$ shows products of sums of two squares are sums of two squares.",
"ex": {
"q": "Is $45$ a sum of two squares?",
"steps": [
"$45=3^2\\cdot5$.",
"The prime $3\\equiv3\\pmod4$ appears to an even power.",
"Yes: $45=36+9$."
],
"ans": "Yes: $6^2+3^2$"
},
"checks": [
{
"q": "Which prime is a sum of two squares?",
"c": [
"$37$",
"$31$",
"$43$",
"$23$"
],
"why": "$37\\equiv1\\pmod4$: $37=1+36$."
},
{
"q": "Is $21$ a sum of two squares?",
"c": [
"No",
"Yes",
"Only with zero",
"Yes, $16+5$"
],
"why": "$21=3\\cdot7$, and both are $3\\bmod4$ to odd powers."
}
]
},
{
"t": "Vieta jumping",
"x": "For a symmetric equation like $a^2+b^2=kab+c$, fix $b$ and view it as a **quadratic in $a$**. If $a$ is one root, Vieta gives the other root $a'=kb-a=\\frac{b^2-c}{a}$.\n\n$a'$ is also an integer, so you can **jump** from the solution $(a,b)$ to $(a',b)$, often a smaller one.\n\nJumping down until you hit a minimal solution, combined with descent, solves famous problems like IMO 1988 Q6.",
"ex": {
"q": "$(a,b)=(1,1)$ solves $a^2+b^2=3ab-1$. Jump to find more solutions.",
"steps": [
"Fix $b=1$: $a^2-3a+2=0$ has roots $a=1$ and $a'=3\\cdot1-1=2$. New solution $(2,1)$.",
"Fix $a=2$, view as quadratic in $b$: other root $b'=3\\cdot2-1=5$. New solution $(2,5)$.",
"Keep going: $(13,5)$, $(13,34)$,… (alternate Fibonacci numbers!)."
],
"ans": "$(2,1),(2,5),(13,5),\\dots$"
},
"checks": [
{
"q": "In $a^2-kab+b^2=c$, if $a$ is a root (with $b$ fixed), the other root is:",
"c": [
"$kb-a$",
"$a-kb$",
"$\\frac{a}{b}$",
"$kab$"
],
"why": "Sum of roots $=kb$ by Vieta."
},
{
"q": "$(a,b)=(1,2)$ satisfies $a^2+b^2=5ab-5$. Jump in $a$ (fixing $b=2$): the other root is",
"c": [
"$9$",
"$3$",
"$5$",
"$10$"
],
"why": "$a'=5\\cdot2-1=9$; check $81+4=85=5\\cdot18-5$. ✓"
}
]
}
]
],
"oly_comb": [
[
{
"t": "Count the complement",
"x": "When \"at least one\", \"not all\" or \"some\" appears, count the **opposite** and subtract from the total.\n\nThe complement is often a single clean case (\"none at all\") while the original splits into many messy ones.\n\nCombine with the multiplication principle: total ways minus ways with no restriction violated.",
"ex": {
"q": "How many $5$-digit numbers contain at least one digit $0$?",
"steps": [
"All $5$-digit numbers: $9\\cdot10^4=90\\,000$.",
"With no zero at all: $9^5=59\\,049$.",
"At least one zero: $90\\,000-59\\,049=30\\,951$."
],
"ans": "$30\\,951$"
},
"checks": [
{
"q": "How many subsets of $\\{1,\\dots,10\\}$ contain at least one even number?",
"c": [
"$992$",
"$1023$",
"$512$",
"$960$"
],
"why": "Total $2^{10}=1024$; subsets with only odd numbers: $2^5=32$."
},
{
"q": "In a group of $23$ people, the probability that two share a birthday is closest to:",
"c": [
"$\\frac12$",
"$\\frac{23}{365}$",
"$\\frac1{10}$",
"$\\frac{9}{10}$"
],
"why": "$P(\\text{all different})=\\frac{365\\cdot364\\cdots343}{365^{23}}\\approx0.49$, so the complement is about $0.51$."
}
]
},
{
"t": "Bijections",
"x": "Two sets have the same size if you can **pair them up perfectly** (a bijection). Count the easier one.\n\nClassic bijections: lattice paths ↔ strings of R and U; subsets ↔ binary strings; distributions of identical balls ↔ stars and bars.\n\nFinding the right bijection often turns a hard count into a binomial coefficient.",
"ex": {
"q": "How many increasing sequences $1\\le a<b<c\\le10$ are there?",
"steps": [
"Each such sequence is just a $3$-element subset of $\\{1,\\dots,10\\}$ written in order.",
"This pairing is a bijection.",
"So there are $\\binom{10}{3}=120$."
],
"ans": "$120$"
},
"checks": [
{
"q": "How many non-decreasing sequences $1\\le a\\le b\\le c\\le5$?",
"c": [
"$35$",
"$10$",
"$125$",
"$60$"
],
"why": "Map $(a,b,c)\\mapsto(a,b+1,c+2)$, a strictly increasing triple in $\\{1,\\dots,7\\}$: $\\binom73=35$."
},
{
"q": "The number of subsets of an $n$-element set equals:",
"c": [
"The number of binary strings of length $n$",
"$n!$",
"$n^2$",
"$\\binom n2$"
],
"why": "Write $1$ for 'in' and $0$ for 'out'."
}
]
},
{
"t": "Pigeonhole",
"x": "If more than $n$ objects go into $n$ boxes, some box gets at least two. More generally, $N$ objects in $n$ boxes force a box with at least $\\lceil N/n\\rceil$.\n\nThe skill is choosing the **boxes**: remainders, colours, parity patterns, regions of a shape.\n\nPigeonhole proves something *exists* without telling you which.",
"ex": {
"q": "Show that among any $5$ points in a $2\\times2$ square, two are within $\\sqrt2$ of each other.",
"steps": [
"Cut the square into four $1\\times1$ squares (the boxes).",
"$5$ points, $4$ boxes: two points share a small square.",
"The farthest apart two points in a unit square can be is its diagonal, $\\sqrt2$."
],
"ans": "Proved by pigeonhole"
},
"checks": [
{
"q": "How many integers must you pick to guarantee two with the same remainder mod $7$?",
"c": [
"$8$",
"$7$",
"$14$",
"$6$"
],
"why": "$7$ remainders are the boxes; $8$ numbers force a repeat."
},
{
"q": "$50$ socks in $4$ colours. How many must you grab to be sure of $3$ of one colour?",
"c": [
"$9$",
"$12$",
"$8$",
"$5$"
],
"why": "$8$ could be $2$ of each; the $9$th makes a triple."
}
]
}
],
[
{
"t": "Combine tools",
"x": "Real problems need several tools at once: casework to split, the complement to simplify a case, bijections to recognise a count, symmetry to halve the work.\n\nA good habit: compute **small cases** by hand, look for a pattern, then find the argument that explains it.\n\nAlways sanity-check with a tiny example.",
"ex": {
"q": "How many $4$-digit numbers have digits that strictly increase from left to right?",
"steps": [
"Strictly increasing digits can't include $0$ (it would have to come first).",
"So choose $4$ different digits from $1$–$9$; there's exactly one increasing order (a bijection with subsets).",
"$\\binom94=126$."
],
"ans": "$126$"
},
"checks": [
{
"q": "How many $3$-digit numbers have digits that strictly decrease left to right?",
"c": [
"$120$",
"$84$",
"$720$",
"$210$"
],
"why": "Now $0$ is allowed (last): choose $3$ of $10$ digits, $\\binom{10}{3}$."
},
{
"q": "How many ways to choose $2$ squares of an $8\\times8$ chessboard that share a side?",
"c": [
"$112$",
"$64$",
"$128$",
"$56$"
],
"why": "Horizontal pairs: $8\\cdot7=56$; vertical: $56$."
}
]
},
{
"t": "Recursions",
"x": "Describe the answer for $n$ in terms of smaller answers by looking at what happens **first** (or last).\n\nCommon recursions: Fibonacci ($a_n=a_{n-1}+a_{n-2}$), derangements ($D_n=(n-1)(D_{n-1}+D_{n-2})$), Catalan numbers.\n\nSet up states carefully: sometimes you need two sequences, such as \"ending in A\" and \"ending in B\".",
"ex": {
"q": "How many ways to tile a $2\\times6$ board with $1\\times2$ dominoes?",
"steps": [
"Look at the left edge: either one vertical domino (leaves $2\\times5$) or two horizontal ones stacked (leaves $2\\times4$).",
"$t_n=t_{n-1}+t_{n-2}$ with $t_1=1$, $t_2=2$.",
"$t_3=3, t_4=5, t_5=8, t_6=13$."
],
"ans": "$13$"
},
"checks": [
{
"q": "How many derangements (no one gets their own hat) are there of $4$ hats?",
"c": [
"$9$",
"$12$",
"$6$",
"$24$"
],
"why": "$D_2=1$, $D_3=2$, $D_4=3(2+1)=9$."
},
{
"q": "How many strings of A, B of length $4$ have no two A's in a row?",
"c": [
"$8$",
"$5$",
"$13$",
"$16$"
],
"why": "Fibonacci with $a_1=2$, $a_2=3$: $5$, $8$."
}
]
},
{
"t": "Linearity of expectation",
"x": "$E[X+Y]=E[X]+E[Y]$ **always**, even when $X$ and $Y$ are dependent.\n\nSo write a complicated count as a sum of **indicator** variables (each $1$ if something happens, $0$ if not). The expected count is the sum of the probabilities.\n\nThis handles fixed points, runs, records, collisions… without ever finding the full distribution.",
"ex": {
"q": "$10$ people shuffle and redistribute their hats. Expected number of people with their own hat?",
"steps": [
"Let $X_i=1$ if person $i$ gets their own hat; $P(X_i=1)=\\frac{1}{10}$.",
"Expected total $=\\sum E[X_i]=10\\cdot\\frac1{10}$.",
"$=1$."
],
"ans": "$1$"
},
"checks": [
{
"q": "A random permutation of $1,\\dots,n$: the expected number of $i$ with $\\pi(i)>\\pi(i+1)$ is",
"c": [
"$\\frac{n-1}{2}$",
"$\\frac n2$",
"$1$",
"$\\frac{n}{4}$"
],
"why": "Each of the $n-1$ adjacent pairs is a descent with probability $\\frac12$."
},
{
"q": "Roll $6$ dice. Expected number of distinct faces showing?",
"c": [
"$6\\left(1-\\left(\\frac56\\right)^6\\right)$",
"$6$",
"$3.5$",
"$\\left(\\frac56\\right)^6$"
],
"why": "Face $k$ appears with probability $1-\\left(\\frac56\\right)^6$; sum over $6$ faces (about $3.99$)."
}
]
}
],
[
{
"t": "Invariants",
"x": "An **invariant** is a quantity that never changes under the allowed moves. If the start and the target have different values, the target is unreachable.\n\nGood candidates: the sum, the sum mod something, parity of a count, a product, a colouring count.\n\nA **monovariant** only ever increases (or decreases); it proves that a process must stop.",
"ex": {
"q": "Numbers $1,2,\\dots,20$ are on a board. A move replaces $a,b$ with $a+b-1$. What number is left at the end?",
"steps": [
"Each move lowers the total by exactly $1$, and there are $19$ moves.",
"Start total: $210$.",
"Final number: $210-19=191$."
],
"ans": "$191$"
},
"checks": [
{
"q": "A chessboard has two opposite corners removed. Can it be tiled by dominoes?",
"c": [
"No",
"Yes",
"Only by $31$ dominoes of one colour",
"Only on an $8\\times8$"
],
"why": "Each domino covers one black and one white square, but the two removed corners have the same colour: $30$ of one, $32$ of the other."
},
{
"q": "You may flip any two coins at once. Starting with $7$ heads up, can you reach all tails?",
"c": [
"No",
"Yes",
"Only with $7$ flips",
"Only with an even number of coins"
],
"why": "Each move changes the number of heads by $-2$, $0$ or $+2$: its parity is invariant, and $7$ is odd."
}
]
},
{
"t": "Colourings",
"x": "Colour a board or a set cleverly, then **count colours**: every allowed piece covers a fixed pattern of colours, so some shapes or positions become impossible.\n\nChessboard colouring handles dominoes. Colouring in $k$ colours by $(i+j)\\bmod k$ handles $1\\times k$ pieces.\n\nColouring is just a picture of an invariant.",
"ex": {
"q": "Can a $10\\times10$ board be tiled by $1\\times4$ tiles?",
"steps": [
"Colour cell $(i,j)$ with $(i+j)\\bmod4$. Every $1\\times4$ tile covers one cell of each colour.",
"$25$ tiles would need exactly $25$ cells of each colour.",
"But colour $1$ appears $26$ times (and colour $3$ only $24$): impossible."
],
"ans": "No"
},
"checks": [
{
"q": "An $8\\times8$ board with one corner removed: can it be tiled by $1\\times3$ tiles?",
"c": [
"No",
"Yes",
"Only if the corner is white",
"Yes, with $21$ tiles any way you like"
],
"why": "Number rows and columns from $0$ and colour by $(i+j)\\bmod3$; every $1\\times3$ tile covers one cell of each colour. The colours appear $21, 22, 21$ times. Removing the corner (colour $0$) leaves $20, 22, 21$, but $21$ tiles need exactly $21$ of each."
},
{
"q": "Every domino on a chessboard covers:",
"c": [
"one black and one white square",
"two black squares",
"two squares of the same colour",
"either, depending on direction"
],
"why": "Neighbouring squares have different colours."
}
]
},
{
"t": "Double counting",
"x": "Count the same thing **in two ways**; the two answers must be equal. This proves identities and gives equations.\n\nExample: count pairs (person, handshake) — by people, it's the sum of the handshake counts; by handshakes, it's twice the number of handshakes.\n\nTables help: count the entries of a grid by rows and by columns.",
"ex": {
"q": "In a club, every member is in exactly $3$ committees and every committee has exactly $4$ members. There are $12$ members. How many committees?",
"steps": [
"Count (member, committee) memberships by members: $12\\cdot3=36$.",
"Count by committees: $4C$.",
"$4C=36$, so $C=9$."
],
"ans": "$9$"
},
"checks": [
{
"q": "Prove $\\binom{n}{2}$ counts handshakes by counting each person's $n-1$ shakes. The sum $n(n-1)$ counts each handshake:",
"c": [
"twice",
"once",
"$n$ times",
"$n-1$ times"
],
"why": "Each handshake has two people, so it's counted from both ends."
},
{
"q": "Each of $10$ students knows exactly $3$ others (knowing is mutual). How many pairs know each other?",
"c": [
"$15$",
"$30$",
"$10$",
"$45$"
],
"why": "$\\frac{10\\cdot3}{2}=15$."
}
]
}
],
[
{
"t": "The extremal principle",
"x": "Look at the object that is **biggest, smallest, first, or last**: the longest path, the closest pair, the person with the most friends.\n\nThe extreme object has special properties (\"nothing is bigger than it\"), which often leads straight to a contradiction or a construction.\n\nCombine with \"suppose the claim is false; take a minimal counterexample\".",
"ex": {
"q": "Finitely many people stand in a field, all pairwise distances different. Each throws a ball at their nearest neighbour. If the number of people is odd, show someone is not hit.",
"steps": [
"Take the closest pair $A,B$: they throw at each other.",
"If anyone else throws at $A$ or $B$, some person is hit twice, and then by counting someone is unhit. Otherwise remove $A$ and $B$; the others still throw within the rest.",
"Repeat; with an odd number, you end with one person who isn't hit."
],
"ans": "Proved"
},
"checks": [
{
"q": "In a finite set of numbers, which object does the extremal principle focus on?",
"c": [
"The largest or smallest element",
"The middle element",
"A random element",
"The sum"
],
"why": "Extremes have the most constraints."
},
{
"q": "Among finitely many points (not all on a line), take the pair with the smallest positive distance. Why might this help?",
"c": [
"No other pair is closer",
"It's always $1$",
"They're on a circle",
"It's unique by definition"
],
"why": "That extremal property is what you exploit."
}
]
},
{
"t": "Handshake lemma",
"x": "In any graph, the **sum of the degrees is twice the number of edges**: each edge has two ends.\n\nSo the number of vertices with **odd degree is even**.\n\nUse it to rule out configurations: there's no party of $7$ people where everyone shakes exactly $3$ hands ($7\\cdot3$ is odd).",
"ex": {
"q": "A graph has $10$ vertices: $4$ of degree $3$ and the rest of degree $2$. How many edges?",
"steps": [
"Degree sum: $4\\cdot3+6\\cdot2=24$.",
"Edges are half the degree sum.",
"$12$ edges."
],
"ans": "$12$"
},
"checks": [
{
"q": "Can a group of $9$ people each have exactly $5$ friends (friendship mutual)?",
"c": [
"No",
"Yes",
"Only if one person has $4$",
"Yes, in a circle"
],
"why": "Degree sum $45$ would be odd."
},
{
"q": "A polyhedron has faces that are all triangles and $12$ faces. How many edges?",
"c": [
"$18$",
"$36$",
"$12$",
"$24$"
],
"why": "Each face has $3$ edges and each edge borders $2$ faces: $\\frac{12\\cdot3}{2}$."
}
]
},
{
"t": "Generating functions",
"x": "Encode a sequence $a_0,a_1,\\dots$ as a polynomial or power series $a_0+a_1x+a_2x^2+\\cdots$.\n\nMultiplying generating functions combines choices: the coefficient of $x^n$ in $(1+x+x^2)(1+x)$ counts ways to make $n$ from one choice of $0$–$2$ and one of $0$–$1$.\n\n$\\frac1{1-x}=1+x+x^2+\\cdots$ represents \"any number of copies\".",
"ex": {
"q": "How many ways to make $10$ cents from $1$-, $2$- and $5$-cent coins?",
"steps": [
"Generating function $\\frac{1}{(1-x)(1-x^2)(1-x^5)}$; find the coefficient of $x^{10}$.",
"By number of $5$s: zero $5$s: $10$ from $1$s and $2$s, $6$ ways; one $5$: $5$ left, $3$ ways; two $5$s: $1$ way.",
"$6+3+1=10$."
],
"ans": "$10$"
},
"checks": [
{
"q": "The coefficient of $x^3$ in $(1+x)^5$ counts:",
"c": [
"$3$-element subsets of a $5$-set",
"$5$-element subsets of a $3$-set",
"permutations of $3$",
"$3^5$ strings"
],
"why": "Each factor chooses 'in' ($x$) or 'out' ($1$)."
},
{
"q": "In how many ways can you roll a total of $4$ with two dice?",
"c": [
"$3$",
"$4$",
"$6$",
"$2$"
],
"why": "Coefficient of $x^4$ in $(x+\\dots+x^6)^2$: $(1,3),(2,2),(3,1)$."
}
]
}
],
[
{
"t": "Winning and losing positions",
"x": "In a two-player game with no luck, classify each position as **winning** (the player to move can force a win) or **losing**.\n\nA position is losing if **every** move leads to a winning position, and winning if **some** move leads to a losing position. Work backwards from the end.\n\nLook for a pattern, then prove it: usually a simple rule like \"multiples of $4$ are losing\".",
"ex": {
"q": "$20$ stones; players alternately take $1$, $2$ or $3$. Whoever takes the last stone wins. Who wins?",
"steps": [
"$0$ stones (no move) is losing for the player to move. $1,2,3$ are winning (take all).",
"$4$ is losing: every move leaves $1$–$3$. Pattern: multiples of $4$ are losing.",
"$20$ is a multiple of $4$: the second player wins by always leaving a multiple of $4$."
],
"ans": "The second player"
},
"checks": [
{
"q": "Same game but you may take $1$ to $4$ stones. Which starting pile is losing for the first player?",
"c": [
"$15$",
"$16$",
"$12$",
"$18$"
],
"why": "Now multiples of $5$ are losing."
},
{
"q": "A position where every move leads to a winning position is:",
"c": [
"losing",
"winning",
"a draw",
"impossible"
],
"why": "Whatever you do, you hand your opponent a win."
}
]
},
{
"t": "The probabilistic method",
"x": "To show an object with some property **exists**, pick one **at random** and show the probability of the property is positive (or that the average is good enough).\n\nIf the average value of something is $A$, some choice achieves at least $A$.\n\nIt proves existence without constructing anything.",
"ex": {
"q": "Show that the vertices of any graph with $m$ edges can be split into two groups with at least $\\frac m2$ edges between them.",
"steps": [
"Put each vertex in a group by a coin flip.",
"Each edge crosses between the groups with probability $\\frac12$, so the expected number of crossing edges is $\\frac m2$.",
"Some split does at least as well as the average."
],
"ans": "Proved"
},
"checks": [
{
"q": "If a random choice has expected score $7.3$, then:",
"c": [
"some choice scores at least $7.3$",
"every choice scores $7.3$",
"no choice scores above $7.3$",
"most choices score $7.3$"
],
"why": "Not everything can be below the average."
},
{
"q": "A random $2$-colouring of $n$ points: the expected number of monochromatic pairs is",
"c": [
"$\\frac12\\binom n2$",
"$\\binom n2$",
"$n$",
"$\\frac n2$"
],
"why": "Each pair matches with probability $\\frac12$."
}
]
},
{
"t": "Bound and construct",
"x": "\"Find the maximum\" problems need **two halves**: prove nothing does better (the bound), and show an example that achieves it (the construction).\n\nA bound without a construction, or an example without a bound, is only half an answer.\n\nTry small cases to guess the answer; the extremal examples often suggest both parts.",
"ex": {
"q": "What is the most kings you can place on an $8\\times8$ board with no two attacking?",
"steps": [
"Bound: split the board into $16$ blocks of $2\\times2$; each block holds at most one king (all its squares touch).",
"Construction: put a king in the top-left square of each block; none attack.",
"Maximum $16$."
],
"ans": "$16$"
},
"checks": [
{
"q": "The most rooks on an $8\\times8$ board with none attacking is:",
"c": [
"$8$",
"$16$",
"$32$",
"$64$"
],
"why": "At most one per row (bound); the diagonal achieves $8$."
},
{
"q": "What is the largest subset of $\\{1,\\dots,10\\}$ with no two consecutive numbers?",
"c": [
"$5$",
"$6$",
"$4$",
"$10$"
],
"why": "Pair $\\{1,2\\},\\dots,\\{9,10\\}$: at most one from each; the odd numbers achieve $5$."
}
]
}
]
],
"oly_alg": [
[
{
"t": "Factor it",
"x": "Factoring reveals hidden structure. Learn the key identities:\n• $a^2-b^2=(a-b)(a+b)$\n• $a^3\\pm b^3=(a\\pm b)(a^2\\mp ab+b^2)$\n• $a^3+b^3+c^3-3abc=(a+b+c)(a^2+b^2+c^2-ab-bc-ca)$\n• Sophie Germain: $a^4+4b^4=(a^2+2b^2+2ab)(a^2+2b^2-2ab)$\n\nWhen an expression is complicated, factoring usually beats expanding.",
"ex": {
"q": "Show $n^4+4$ is prime only for $n=1$.",
"steps": [
"Sophie Germain with $b=1$: $n^4+4=(n^2+2n+2)(n^2-2n+2)$.",
"For $n\\ge2$, the smaller factor $n^2-2n+2=(n-1)^2+1\\ge2$.",
"So it's composite for $n\\ge2$; $n=1$ gives $5$, prime."
],
"ans": "Only $n=1$"
},
"checks": [
{
"q": "What is $\\dfrac{2025^3-1}{2025^2+2025+1}$?",
"c": [
"$2024$",
"$2025$",
"$2026$",
"$1$"
],
"why": "$a^3-1=(a-1)(a^2+a+1)$."
},
{
"q": "If $a+b+c=0$, then $a^3+b^3+c^3$ equals:",
"c": [
"$3abc$",
"$0$",
"$abc$",
"$(a+b+c)^3$"
],
"why": "From the identity, $a^3+b^3+c^3-3abc=0$."
}
]
},
{
"t": "Symmetric sums",
"x": "For roots $r_1,\\dots,r_n$ of a polynomial, the **elementary symmetric sums** $e_1=\\sum r_i$, $e_2=\\sum_{i<j}r_ir_j$, … come straight from the coefficients (Vieta).\n\n**Power sums** $p_k=\\sum r_i^k$ can then be computed by Newton's identities, e.g. $p_2=e_1^2-2e_2$.\n\nFor a quadratic with roots $r,s$: $r^n+s^n$ satisfies the same recurrence as the polynomial.",
"ex": {
"q": "$r,s$ are roots of $x^2-x-1$. Find $r^5+s^5$.",
"steps": [
"Each root satisfies $x^2=x+1$, so $p_n=p_{n-1}+p_{n-2}$ where $p_n=r^n+s^n$.",
"$p_0=2$, $p_1=1$, so $p_2=3$, $p_3=4$, $p_4=7$.",
"$p_5=11$."
],
"ans": "$11$"
},
"checks": [
{
"q": "Roots of $x^3-2x^2+3x-4$: find $\\sum r_i^2$.",
"c": [
"$-2$",
"$10$",
"$4$",
"$-6$"
],
"why": "$e_1^2-2e_2=4-6=-2$ (negative, so some roots are complex)."
},
{
"q": "If $r+s=4$ and $rs=1$, what is $r^3+s^3$?",
"c": [
"$52$",
"$64$",
"$60$",
"$48$"
],
"why": "$(r+s)^3-3rs(r+s)=64-12$."
}
]
},
{
"t": "Recognise sequences",
"x": "Before attacking a sequence, compute the first terms and **look**: is it arithmetic, geometric, Fibonacci-like, periodic, squares, triangular numbers?\n\nA linear recurrence $a_n=pa_{n-1}+qa_{n-2}$ has solutions $\\alpha r_1^n+\\beta r_2^n$, where $r_1, r_2$ are the roots of $x^2=px+q$.\n\nMany \"impossible\" sequences turn out to be **periodic**.",
"ex": {
"q": "$a_1=2$, $a_2=3$ and $a_{n}=\\frac{a_{n-1}}{a_{n-2}}$. Find $a_{2025}$.",
"steps": [
"Compute: $2, 3, \\frac32, \\frac12, \\frac13, \\frac23, 2, 3,\\dots$",
"The sequence repeats every $6$ terms.",
"$2025=6\\cdot337+3$, so $a_{2025}=a_3=\\frac32$."
],
"ans": "$\\frac32$"
},
"checks": [
{
"q": "Solve $a_n=5a_{n-1}-6a_{n-2}$ with $a_0=2$, $a_1=5$. What is $a_n$?",
"c": [
"$2^n+3^n$",
"$5^n$",
"$2\\cdot3^n$",
"$3^n-2^n$"
],
"why": "Roots of $x^2=5x-6$ are $2, 3$; $\\alpha+\\beta=2$ and $2\\alpha+3\\beta=5$ give $\\alpha=\\beta=1$."
},
{
"q": "$a_1=1$ and $a_{n+1}=a_n+2n+1$. What is $a_{10}$?",
"c": [
"$100$",
"$91$",
"$121$",
"$55$"
],
"why": "$a_n=n^2$."
}
]
}
],
[
{
"t": "Mean inequalities",
"x": "For positive reals: $\\text{QM}\\ge\\text{AM}\\ge\\text{GM}\\ge\\text{HM}$, i.e.\n$$\\sqrt{\\tfrac{a^2+b^2}{2}}\\ge\\tfrac{a+b}{2}\\ge\\sqrt{ab}\\ge\\tfrac{2}{\\frac1a+\\frac1b},$$\nwith equality exactly when all the numbers are equal. The same holds for $n$ numbers.\n\nAM–GM is the workhorse: split terms so the product becomes constant.",
"ex": {
"q": "For $x>0$, find the minimum of $x^2+\\frac{2}{x}$.",
"steps": [
"Split $\\frac2x=\\frac1x+\\frac1x$ so the product of the three terms is constant: $x^2\\cdot\\frac1x\\cdot\\frac1x=1$.",
"AM–GM: $x^2+\\frac1x+\\frac1x\\ge3\\sqrt[3]{1}=3$.",
"Equality when $x^2=\\frac1x$, i.e. $x=1$. Minimum $3$."
],
"ans": "$3$"
},
"checks": [
{
"q": "For positive $a,b,c$, the minimum of $\\frac ab+\\frac bc+\\frac ca$ is:",
"c": [
"$3$",
"$1$",
"$0$",
"$\\frac32$"
],
"why": "AM–GM: the product of the three fractions is $1$."
},
{
"q": "For positive $a,b$ with $ab=4$, the minimum of $a+4b$ is:",
"c": [
"$8$",
"$5$",
"$4$",
"$10$"
],
"why": "$a+4b\\ge2\\sqrt{4ab}=8$, at $a=4$, $b=1$."
}
]
},
{
"t": "Telescoping",
"x": "Turn each term into a **difference** $f(k)-f(k+1)$ so that the sum collapses to the ends. Products can telescope too, as ratios $\\frac{g(k+1)}{g(k)}$.\n\nPartial fractions find the split: $\\frac{1}{k(k+2)}=\\frac12\\left(\\frac1k-\\frac1{k+2}\\right)$.\n\nRoot tricks also telescope: $\\frac{1}{\\sqrt{k+1}+\\sqrt k}=\\sqrt{k+1}-\\sqrt k$.",
"ex": {
"q": "Compute $\\sum_{k=1}^{99}\\dfrac{1}{\\sqrt{k+1}+\\sqrt{k}}$.",
"steps": [
"Rationalise: each term is $\\sqrt{k+1}-\\sqrt{k}$.",
"The sum telescopes to $\\sqrt{100}-\\sqrt1$.",
"$=9$."
],
"ans": "$9$"
},
"checks": [
{
"q": "What is $\\prod_{k=2}^{10}\\left(1-\\frac1k\\right)$?",
"c": [
"$\\frac1{10}$",
"$\\frac{9}{10}$",
"$\\frac12$",
"$\\frac1{9}$"
],
"why": "$\\frac12\\cdot\\frac23\\cdots\\frac9{10}=\\frac1{10}$."
},
{
"q": "What is $\\sum_{k=1}^{\\infty}\\frac{1}{k(k+2)}$?",
"c": [
"$\\frac34$",
"$1$",
"$\\frac12$",
"$\\frac32$"
],
"why": "$\\frac12\\left(1+\\frac12\\right)$: only $\\frac11$ and $\\frac12$ survive."
}
]
},
{
"t": "Floor equations",
"x": "Write $x=n+f$ with $n=\\lfloor x\\rfloor\\in\\mathbb Z$ and $0\\le f<1$. Then **bound**: $n\\le x<n+1$ turns floor equations into inequalities for $n$.\n\nHermite's identity: $\\lfloor x\\rfloor+\\lfloor x+\\tfrac12\\rfloor=\\lfloor2x\\rfloor$.\n\nFor sums like $\\sum\\lfloor\\frac{k}{3}\\rfloor$, group terms with equal floor values.",
"ex": {
"q": "Solve $\\lfloor 2x\\rfloor=3x-1$.",
"steps": [
"$3x-1$ must be an integer $m$, so $x=\\frac{m+1}{3}$, and $m\\le2x<m+1$.",
"$m\\le\\frac{2m+2}{3}<m+1$ gives $3m\\le2m+2$ and $2m+2<3m+3$, so $-1<m\\le2$.",
"$m=0,1,2$: $x=\\frac13,\\frac23,1$. All check."
],
"ans": "$x=\\frac13,\\frac23,1$"
},
"checks": [
{
"q": "What is $\\sum_{k=1}^{10}\\left\\lfloor\\frac k3\\right\\rfloor$?",
"c": [
"$15$",
"$18$",
"$12$",
"$10$"
],
"why": "Values: $0,0,1,1,1,2,2,2,3,3$."
},
{
"q": "How many positive integers $n\\le100$ have $\\lfloor\\sqrt n\\rfloor=5$?",
"c": [
"$11$",
"$10$",
"$9$",
"$6$"
],
"why": "$25\\le n\\le35$."
}
]
}
],
[
{
"t": "Integer root theorem",
"x": "If a polynomial with **integer coefficients** has a rational root $\\frac pq$ (in lowest terms), then $p$ divides the constant term and $q$ divides the leading coefficient.\n\nFor a monic polynomial, every rational root is an integer dividing the constant term.\n\nAlso: $a-b$ divides $P(a)-P(b)$ for integer polynomials, a powerful constraint.",
"ex": {
"q": "Find all rational roots of $2x^3-3x^2-11x+6$.",
"steps": [
"Candidates: $\\pm1,\\pm2,\\pm3,\\pm6,\\pm\\frac12,\\pm\\frac32$.",
"Test: $x=3$: $54-27-33+6=0$. ✓ Divide: $(x-3)(2x^2+3x-2)=(x-3)(2x-1)(x+2)$.",
"Roots $3, \\frac12, -2$."
],
"ans": "$3,\\frac12,-2$"
},
"checks": [
{
"q": "Which could be a rational root of $3x^3+x-4$?",
"c": [
"$\\frac43$",
"$\\frac34$",
"$\\frac25$",
"$\\frac12$"
],
"why": "$p\\mid4$, $q\\mid3$. (In fact $x=1$ is a root.)"
},
{
"q": "$P$ has integer coefficients with $P(1)=3$ and $P(5)=10$. Is that possible?",
"c": [
"No",
"Yes",
"Only if $P$ is linear",
"Only if $P(0)=0$"
],
"why": "$5-1=4$ must divide $10-3=7$."
}
]
},
{
"t": "Titu's lemma",
"x": "For positive denominators: $\\dfrac{a_1^2}{b_1}+\\dots+\\dfrac{a_n^2}{b_n}\\ge\\dfrac{(a_1+\\dots+a_n)^2}{b_1+\\dots+b_n}$.\n\nIt's Cauchy–Schwarz in a handy form. Equality holds when $\\frac{a_i}{b_i}$ is the same for all $i$.\n\nIt's perfect for sums of fractions with squares (or things you can make into squares) on top.",
"ex": {
"q": "For positive $x,y,z$ with $x+y+z=1$, find the minimum of $\\frac1x+\\frac4y+\\frac9z$.",
"steps": [
"Write it as $\\frac{1^2}x+\\frac{2^2}y+\\frac{3^2}z$.",
"Titu: $\\ge\\frac{(1+2+3)^2}{x+y+z}=36$.",
"Equality when $\\frac1x=\\frac2y=\\frac3z$, i.e. $(x,y,z)=\\left(\\frac16,\\frac13,\\frac12\\right)$. Minimum $36$."
],
"ans": "$36$"
},
"checks": [
{
"q": "For positive $a,b$ with $a+b=2$, the minimum of $\\frac{1}{a}+\\frac1b$ is:",
"c": [
"$2$",
"$1$",
"$4$",
"$\\frac12$"
],
"why": "$\\frac{(1+1)^2}{a+b}=2$."
},
{
"q": "Titu's lemma is a special case of:",
"c": [
"Cauchy–Schwarz",
"Vieta",
"Heron",
"Pascal"
],
"why": "Apply Cauchy–Schwarz to $\\frac{a_i}{\\sqrt{b_i}}$ and $\\sqrt{b_i}$."
}
]
},
{
"t": "Roots of unity filter",
"x": "To add only every $k$-th coefficient of a polynomial, average its values at the $k$-th roots of unity.\n\nFor even coefficients: $\\frac{P(1)+P(-1)}{2}$. For every third coefficient, use $\\omega=e^{2\\pi i/3}$: $\\frac{P(1)+P(\\omega)+P(\\omega^2)}{3}$.\n\nIt works because $1+\\omega^j+\\omega^{2j}$ is $3$ when $3\\mid j$ and $0$ otherwise.",
"ex": {
"q": "Find $\\binom{10}{0}+\\binom{10}{2}+\\binom{10}{4}+\\dots+\\binom{10}{10}$.",
"steps": [
"Let $P(x)=(1+x)^{10}$.",
"Even coefficients sum to $\\frac{P(1)+P(-1)}{2}=\\frac{2^{10}+0}{2}$.",
"$=512$."
],
"ans": "$512$"
},
"checks": [
{
"q": "What is $\\binom{6}{0}+\\binom63+\\binom66$?",
"c": [
"$22$",
"$21$",
"$20$",
"$32$"
],
"why": "$1+20+1=22$, which equals $\\frac{2^6+2\\cdot\\text{Re}((1+\\omega)^6)}{3}=\\frac{64+2}{3}$."
},
{
"q": "$\\frac{P(1)+P(-1)}{2}$ gives the sum of which coefficients?",
"c": [
"The even-degree ones",
"The odd-degree ones",
"All of them",
"The leading one"
],
"why": "Odd powers cancel between $1$ and $-1$."
}
]
}
],
[
{
"t": "Substitutions",
"x": "Change variables to reveal structure:\n• a constraint $abc=1$: try $a=\\frac xy$, $b=\\frac yz$, $c=\\frac zx$;\n• $a+b+c=0$: use identities like $a^3+b^3+c^3=3abc$;\n• sides of a triangle: $a=y+z$, $b=z+x$, $c=x+y$ (Ravi substitution) with $x,y,z>0$;\n• trig: $x=\\tan\\theta$ when you see $1+x^2$.\n\nA symmetric problem often simplifies with $s=a+b$, $p=ab$.",
"ex": {
"q": "Solve the system $x+y=5$, $x^3+y^3=35$.",
"steps": [
"Let $s=x+y=5$, $p=xy$: $x^3+y^3=s^3-3sp=125-15p$.",
"$125-15p=35$, so $p=6$.",
"$x,y$ are roots of $t^2-5t+6$: $\\{2,3\\}$."
],
"ans": "$(2,3)$ or $(3,2)$"
},
"checks": [
{
"q": "In a triangle with sides $a=y+z$, $b=z+x$, $c=x+y$, what is $x$ in terms of the sides?",
"c": [
"$\\frac{b+c-a}{2}$",
"$\\frac{a+b+c}{2}$",
"$a-b$",
"$\\frac{a}{2}$"
],
"why": "$b+c-a=2x$."
},
{
"q": "If $x+\\frac1x=t$, then $x^3+\\frac1{x^3}$ equals:",
"c": [
"$t^3-3t$",
"$t^3$",
"$t^3+3t$",
"$3t$"
],
"why": "Cube: $t^3=x^3+\\frac1{x^3}+3t$."
}
]
},
{
"t": "Jensen's inequality",
"x": "If $f$ is **convex** (curves upward, like $x^2$ or $e^x$), then $f$ of the average is at most the average of $f$:\n$$f\\left(\\frac{x_1+\\dots+x_n}{n}\\right)\\le\\frac{f(x_1)+\\dots+f(x_n)}{n}.$$\nFor **concave** $f$ (like $\\sqrt x$, $\\log x$, or $\\sin x$ on $[0,\\pi]$), the inequality flips.\n\nEquality holds when all the $x_i$ are equal.",
"ex": {
"q": "Find the maximum of $\\sin A+\\sin B+\\sin C$ for the angles of a triangle.",
"steps": [
"$\\sin$ is concave on $[0,\\pi]$.",
"Jensen: $\\frac{\\sin A+\\sin B+\\sin C}{3}\\le\\sin\\frac{A+B+C}{3}=\\sin60^\\circ$.",
"Maximum $3\\cdot\\frac{\\sqrt3}2=\\frac{3\\sqrt3}{2}$, for an equilateral triangle."
],
"ans": "$\\frac{3\\sqrt3}{2}$"
},
"checks": [
{
"q": "Which function is convex on the positive reals?",
"c": [
"$x^2$",
"$\\sqrt x$",
"$\\log x$",
"$-x^2$"
],
"why": "Its graph curves upward."
},
{
"q": "For positive $a,b,c$ with $a+b+c=3$, the minimum of $a^2+b^2+c^2$ is:",
"c": [
"$3$",
"$9$",
"$1$",
"$0$"
],
"why": "Jensen on $x^2$: at least $3\\cdot1^2$."
}
]
},
{
"t": "Symmetric inequalities",
"x": "For a symmetric inequality, you may **assume an order** like $a\\ge b\\ge c$ without loss of generality.\n\nClassic tools: rearrangement (similarly ordered sequences give the biggest sum of products), Schur's inequality, and \"SOS\" (write the difference as a sum of squares).\n\nThe simplest: $a^2+b^2+c^2\\ge ab+bc+ca$, since twice the difference is $(a-b)^2+(b-c)^2+(c-a)^2$.",
"ex": {
"q": "Prove $a^2+b^2+c^2\\ge ab+bc+ca$.",
"steps": [
"Double both sides and subtract: $2(a^2+b^2+c^2)-2(ab+bc+ca)$.",
"$=(a-b)^2+(b-c)^2+(c-a)^2\\ge0$.",
"Equality exactly when $a=b=c$."
],
"ans": "Proved"
},
"checks": [
{
"q": "If $a+b+c=6$, the largest possible value of $ab+bc+ca$ is:",
"c": [
"$12$",
"$36$",
"$18$",
"$9$"
],
"why": "$(a+b+c)^2=a^2+b^2+c^2+2(ab+bc+ca)\\ge3(ab+bc+ca)$."
},
{
"q": "Rearrangement: for $a\\ge b$ and $x\\ge y$, which is larger?",
"c": [
"$ax+by$",
"$ay+bx$",
"They're equal",
"It depends"
],
"why": "$(ax+by)-(ay+bx)=(a-b)(x-y)\\ge0$."
}
]
}
],
[
{
"t": "Equality cases",
"x": "Before proving an inequality, find **when equality holds**. Usually it's all variables equal, or some at an endpoint (like $0$).\n\nYour proof must be tight exactly there. If a step loses information at the equality case, that step is wrong.\n\nThe equality case tells you how to split terms for AM–GM and which inequality to try.",
"ex": {
"q": "For $x>0$, find the minimum of $x+\\frac{1}{x^2}$ and say where it occurs.",
"steps": [
"Guess: AM–GM with terms balanced at equality. Split $x=\\frac x2+\\frac x2$ so the product with $\\frac1{x^2}$ is constant: $\\frac x2\\cdot\\frac x2\\cdot\\frac1{x^2}=\\frac14$.",
"$\\frac x2+\\frac x2+\\frac1{x^2}\\ge3\\sqrt[3]{\\frac14}$.",
"Equality when $\\frac x2=\\frac1{x^2}$, i.e. $x=\\sqrt[3]2$. Minimum $\\frac{3}{\\sqrt[3]4}$."
],
"ans": "$\\frac{3}{\\sqrt[3]{4}}$ at $x=\\sqrt[3]{2}$"
},
"checks": [
{
"q": "For non-negative $a,b$ with $a+b=1$, the maximum of $a^2+b^2$ occurs at:",
"c": [
"$(a,b)=(1,0)$ or $(0,1)$",
"$a=b=\\frac12$",
"$a=\\frac13$",
"nowhere"
],
"why": "$a^2+b^2=1-2ab$ is largest when $ab=0$: an endpoint, not the middle."
},
{
"q": "AM–GM on $a$ and $b$ is an equality exactly when:",
"c": [
"$a=b$",
"$a=0$",
"$a+b=1$",
"$ab=1$"
],
"why": "$\\frac{a+b}2-\\sqrt{ab}=\\frac12(\\sqrt a-\\sqrt b)^2$."
}
]
},
{
"t": "Smoothing",
"x": "**Smoothing** moves variables closer together (or further apart) while keeping the constraint, and shows the expression only improves.\n\nIf moving two unequal variables toward their average never makes things worse, the optimum is at all-equal.\n\nIf it always helps to push variables apart, the optimum is at an extreme, like some variables being $0$.",
"ex": {
"q": "Among positive numbers with a fixed sum, why is the product largest when they're all equal?",
"steps": [
"Replace two unequal numbers $a\\ne b$ by $\\frac{a+b}2,\\frac{a+b}2$: the sum stays the same.",
"$\\left(\\frac{a+b}{2}\\right)^2-ab=\\frac{(a-b)^2}{4}>0$, so the product increases.",
"Keep smoothing: the maximum is at all-equal."
],
"ans": "Smoothing increases the product"
},
"checks": [
{
"q": "With $a+b=10$ (both positive), $ab$ is largest when:",
"c": [
"$a=b=5$",
"$a=1$",
"$a=9$",
"$a=10$"
],
"why": "Smoothing towards equal increases the product."
},
{
"q": "For non-negative $a,b$ with $a+b=2$, the maximum of $a^3+b^3$ is:",
"c": [
"$8$",
"$2$",
"$4$",
"$6$"
],
"why": "Here spreading out helps: $(2,0)$ gives $8$, while $(1,1)$ gives only $2$."
}
]
},
{
"t": "Integer polynomials",
"x": "For a polynomial $P$ with integer coefficients: **$a-b$ divides $P(a)-P(b)$** for all integers $a, b$.\n\nSo $P(a)\\bmod m$ depends only on $a\\bmod m$, and values at nearby integers constrain each other.\n\nIf $P$ has integer roots $r_1,\\dots$, then $P(x)=(x-r_1)\\cdots Q(x)$ with $Q$ also integer-coefficient.",
"ex": {
"q": "Can a polynomial with integer coefficients have $P(2)=5$ and $P(7)=13$?",
"steps": [
"$7-2=5$ must divide $P(7)-P(2)=8$.",
"$5\\nmid8$.",
"Impossible."
],
"ans": "No"
},
"checks": [
{
"q": "$P$ has integer coefficients and $P(0)$ and $P(1)$ are both odd. Can $P$ have an integer root?",
"c": [
"No",
"Yes",
"Only $0$",
"Only negative ones"
],
"why": "$P(n)\\equiv P(0)$ or $P(1)\\pmod 2$, so $P(n)$ is always odd, never $0$."
},
{
"q": "If $P(x)$ has integer coefficients and $P(3)=0$, then $P(10)$ is divisible by:",
"c": [
"$7$",
"$10$",
"$3$",
"$13$"
],
"why": "$10-3$ divides $P(10)-P(3)=P(10)$."
}
]
}
]
],
"oly_geo": [
[
{
"t": "Angle chasing",
"x": "Mark every angle you can find, step by step, using: triangle sums ($180^\\circ$), straight lines, parallel lines, isosceles triangles, and circles (inscribed angles, tangent–chord angles).\n\nIntroduce a variable for one unknown angle and express the others in terms of it.\n\nMost olympiad geometry starts with an angle chase that reveals a cyclic quadrilateral or similar triangles.",
"ex": {
"q": "In triangle $ABC$, $AB=AC$ and $\\angle A=36^\\circ$. The bisector of $\\angle B$ meets $AC$ at $D$. Find $\\angle BDC$.",
"steps": [
"Base angles: $\\angle B=\\angle C=72^\\circ$.",
"The bisector gives $\\angle DBC=36^\\circ$.",
"In triangle $BDC$: $\\angle BDC=180^\\circ-36^\\circ-72^\\circ=72^\\circ$ (so $BDC$ is isosceles too)."
],
"ans": "$72^\\circ$"
},
"checks": [
{
"q": "The tangent–chord angle equals:",
"c": [
"the inscribed angle on the other side of the chord",
"the central angle",
"$90^\\circ$",
"half the tangent length"
],
"why": "Both are half the arc cut off by the chord."
},
{
"q": "In triangle $ABC$, $\\angle A=50^\\circ$. The bisectors of $\\angle B$ and $\\angle C$ meet at $I$. Find $\\angle BIC$.",
"c": [
"$115^\\circ$",
"$130^\\circ$",
"$100^\\circ$",
"$65^\\circ$"
],
"why": "$\\angle BIC=180^\\circ-\\frac{B+C}{2}=180^\\circ-65^\\circ=90^\\circ+\\frac{A}{2}$."
}
]
},
{
"t": "AA similarity",
"x": "Two triangles are similar as soon as **two angles match**. Then corresponding sides are proportional.\n\nLook for: parallel lines (corresponding angles), a shared angle, inscribed angles on the same arc, right angles.\n\nWrite the similarity with vertices in matching order ($\\triangle ABC\\sim\\triangle DEF$), then read off ratios like $\\frac{AB}{DE}=\\frac{BC}{EF}$.",
"ex": {
"q": "In right triangle $ABC$ with $\\angle C=90^\\circ$, $CD$ is the altitude to $AB$. If $AD=4$ and $DB=9$, find $CD$.",
"steps": [
"$\\triangle ACD\\sim\\triangle CBD$ (each has a right angle, and $\\angle A=\\angle BCD$).",
"So $\\frac{AD}{CD}=\\frac{CD}{DB}$, i.e. $CD^2=AD\\cdot DB=36$.",
"$CD=6$."
],
"ans": "$6$"
},
"checks": [
{
"q": "With the same set-up, $AC^2$ equals:",
"c": [
"$AD\\cdot AB$",
"$AD\\cdot DB$",
"$DB\\cdot AB$",
"$AB^2-AD^2$"
],
"why": "$\\triangle ACD\\sim\\triangle ABC$ gives $\\frac{AC}{AB}=\\frac{AD}{AC}$."
},
{
"q": "Two chords $AB$ and $CD$ meet at $P$ inside a circle. Which triangles are similar?",
"c": [
"$PAC$ and $PDB$",
"$PAB$ and $PCD$",
"$PAD$ and $PAC$",
"none"
],
"why": "$\\angle CAB=\\angle CDB$ (same arc) and vertical angles at $P$ match."
}
]
},
{
"t": "Shared heights",
"x": "Triangles with the **same height** have areas proportional to their bases; triangles with the **same base** have areas proportional to their heights.\n\nSo a cevian $AD$ splits the area of $ABC$ in the ratio $BD:DC$. And two triangles on the same base between parallel lines have equal areas.\n\nArea ratios convert length problems into area problems and back.",
"ex": {
"q": "In triangle $ABC$, $D$ is on $BC$ with $BD=2DC$, and $E$ is the midpoint of $AD$. If $[ABC]=36$, find $[EBD]$.",
"steps": [
"$[ABD]=\\frac23[ABC]=24$ (shared height from $A$).",
"$E$ is the midpoint of $AD$, so $[EBD]=\\frac12[ABD]$ (shared height from $B$).",
"$[EBD]=12$."
],
"ans": "$12$"
},
"checks": [
{
"q": "$ABCD$ is a trapezium with $AB\\parallel CD$. Which two triangles have equal area?",
"c": [
"$ABC$ and $ABD$",
"$ABC$ and $ACD$",
"$ABD$ and $BCD$",
"$ABC$ and $BCD$"
],
"why": "Same base $AB$, and $C$, $D$ are at the same height above it."
},
{
"q": "In triangle $ABC$ the three medians meet at $G$. What fraction of the area is triangle $GBC$?",
"c": [
"$\\frac13$",
"$\\frac12$",
"$\\frac16$",
"$\\frac14$"
],
"why": "$G$ is $\\frac13$ of the way up each median, so its height above $BC$ is $\\frac13$ of $A$'s."
}
]
}
],
[
{
"t": "Cyclic quadrilaterals",
"x": "Four points lie on a circle exactly when:\n• opposite angles add to $180^\\circ$, or\n• a side subtends equal angles at the other two points ($\\angle ACB=\\angle ADB$), or\n• power of a point holds: $PA\\cdot PB=PC\\cdot PD$.\n\nSpotting a hidden cyclic quadrilateral unlocks many angle equalities at once. Right angles on a common segment are a classic giveaway.",
"ex": {
"q": "In triangle $ABC$, $BE$ and $CF$ are altitudes. Show $B, C, E, F$ are concyclic.",
"steps": [
"$\\angle BEC=90^\\circ$ and $\\angle BFC=90^\\circ$.",
"So $E$ and $F$ both see segment $BC$ at a right angle.",
"They lie on the circle with diameter $BC$."
],
"ans": "They lie on the circle with diameter $BC$"
},
"checks": [
{
"q": "In cyclic quadrilateral $ABCD$, $\\angle ABD=35^\\circ$. What is $\\angle ACD$?",
"c": [
"$35^\\circ$",
"$145^\\circ$",
"$55^\\circ$",
"$70^\\circ$"
],
"why": "Both subtend arc $AD$."
},
{
"q": "Which condition proves $ABCD$ is cyclic?",
"c": [
"$\\angle A+\\angle C=180^\\circ$",
"$\\angle A=\\angle C$",
"$AB=CD$",
"$AC\\perp BD$"
],
"why": "Opposite angles supplementary."
}
]
},
{
"t": "Power of a point",
"x": "For a point $P$ and a circle with centre $O$ and radius $r$: every line through $P$ meeting the circle at $A, B$ gives $PA\\cdot PB=|OP^2-r^2|$, the **power** of $P$.\n\nIt gives chord–chord, secant–secant and tangent–secant relations in one rule.\n\nWith signed lengths, the power is negative inside the circle and positive outside.",
"ex": {
"q": "$P$ is $10$ from the centre of a circle of radius $6$. A line through $P$ meets the circle at $A$ and $B$ with $PA=4$. Find $PB$.",
"steps": [
"Power of $P$: $10^2-6^2=64$.",
"$PA\\cdot PB=64$.",
"$PB=16$."
],
"ans": "$16$"
},
"checks": [
{
"q": "$P$ is inside a circle of radius $5$, at distance $3$ from the centre. A chord through $P$ is split into parts $x$ and $y$. What is $xy$?",
"c": [
"$16$",
"$9$",
"$25$",
"$34$"
],
"why": "$r^2-OP^2=25-9$."
},
{
"q": "Two circles meet at $X$ and $Y$. For a point $P$ on line $XY$ outside both circles, the tangent lengths to the two circles are:",
"c": [
"equal",
"in ratio of the radii",
"always $XY$",
"unrelated"
],
"why": "Both equal $\\sqrt{PX\\cdot PY}$."
}
]
},
{
"t": "Look for diameters",
"x": "A **diameter** creates right angles: any angle inscribed in a semicircle is $90^\\circ$. Conversely, a right angle means its hypotenuse is a diameter of the circumcircle.\n\nSo the circumradius of a right triangle is half its hypotenuse, and its circumcentre is the hypotenuse's midpoint.\n\nDraw the diameter through a key point (often the antipode of a vertex) to create right angles to chase.",
"ex": {
"q": "Find the circumradius of the triangle with sides $10$, $24$, $26$.",
"steps": [
"$10^2+24^2=676=26^2$: it's a right triangle.",
"The hypotenuse is a diameter of the circumcircle.",
"$R=13$."
],
"ans": "$13$"
},
"checks": [
{
"q": "$AB$ is a diameter and $C$ is on the circle. Then $\\angle ACB$ is:",
"c": [
"$90^\\circ$",
"$60^\\circ$",
"$180^\\circ$",
"it depends on $C$"
],
"why": "Thales' theorem."
},
{
"q": "In a right triangle with legs $6$ and $8$, the distance from the right-angle vertex to the circumcentre is:",
"c": [
"$5$",
"$4.8$",
"$10$",
"$7$"
],
"why": "The circumcentre is the midpoint of the hypotenuse, which is equidistant ($5$) from all three vertices."
}
]
}
],
[
{
"t": "Triangle centres",
"x": "• **Centroid** $G$: where the medians meet; it divides each median $2:1$.\n• **Circumcentre** $O$: where the perpendicular bisectors meet; centre of the circle through the vertices.\n• **Incentre** $I$: where the angle bisectors meet; centre of the inscribed circle.\n• **Orthocentre** $H$: where the altitudes meet.\n\n$O$, $G$ and $H$ lie on the **Euler line**, with $OG:GH=1:2$.",
"ex": {
"q": "The vertices of a triangle are $(0,0)$, $(6,0)$ and $(0,9)$. Find its centroid and circumcentre.",
"steps": [
"Centroid: average of the vertices, $\\left(\\frac{6}{3},\\frac93\\right)=(2,3)$.",
"It's a right triangle (right angle at the origin), so the circumcentre is the midpoint of the hypotenuse: $(3,4.5)$.",
"The orthocentre is the right-angle vertex $(0,0)$. Check: $O$, $G$, $H$ are collinear. ✓"
],
"ans": "$G=(2,3)$, $O=(3,4.5)$"
},
"checks": [
{
"q": "Which centre is always inside the triangle?",
"c": [
"The incentre",
"The circumcentre",
"The orthocentre",
"None of them"
],
"why": "The incentre (like the centroid) is always inside; the circumcentre and orthocentre move outside in obtuse triangles."
},
{
"q": "In an equilateral triangle, the four centres:",
"c": [
"coincide",
"form a square",
"lie on a circle",
"are all different"
],
"why": "By symmetry every centre is the middle point."
}
]
},
{
"t": "Law of sines",
"x": "In any triangle, $\\dfrac{a}{\\sin A}=\\dfrac{b}{\\sin B}=\\dfrac{c}{\\sin C}=2R$, where $R$ is the circumradius.\n\nIt converts between side lengths and angles, and links them to the circumcircle.\n\nAlso useful: area $=\\frac12ab\\sin C=\\frac{abc}{4R}$.",
"ex": {
"q": "A triangle has $\\angle A=30^\\circ$ and $a=5$. Find its circumradius.",
"steps": [
"Law of sines: $\\frac{a}{\\sin A}=2R$.",
"$\\frac{5}{1/2}=10=2R$.",
"$R=5$."
],
"ans": "$5$"
},
"checks": [
{
"q": "In triangle $ABC$, $\\angle A=45^\\circ$, $\\angle B=60^\\circ$ and $a=\\sqrt2$. What is $b$?",
"c": [
"$\\sqrt3$",
"$\\sqrt6$",
"$2$",
"$\\frac{\\sqrt3}2$"
],
"why": "$b=\\frac{a\\sin B}{\\sin A}=\\frac{\\sqrt2\\cdot\\frac{\\sqrt3}2}{\\frac{\\sqrt2}2}=\\sqrt3$."
},
{
"q": "A triangle has sides $13$, $14$, $15$ and area $84$. What is $R$?",
"c": [
"$\\frac{65}{8}$",
"$7$",
"$\\frac{15}{2}$",
"$8$"
],
"why": "$R=\\frac{abc}{4K}=\\frac{2730}{336}=\\frac{65}{8}$."
}
]
},
{
"t": "Angle bisector theorem",
"x": "The bisector of angle $A$ meets $BC$ at $D$ with $\\dfrac{BD}{DC}=\\dfrac{AB}{AC}$: it splits the opposite side in the ratio of the adjacent sides.\n\nSo $BD=\\dfrac{ac}{b+c}$ and $DC=\\dfrac{ab}{b+c}$.\n\nThe external bisector divides $BC$ externally in the same ratio.",
"ex": {
"q": "In triangle $ABC$, $AB=6$, $AC=9$ and $BC=10$. The bisector of $\\angle A$ meets $BC$ at $D$. Find $BD$.",
"steps": [
"$\\frac{BD}{DC}=\\frac69=\\frac23$.",
"$BD=\\frac{2}{5}\\cdot10$.",
"$BD=4$."
],
"ans": "$4$"
},
"checks": [
{
"q": "In triangle $ABC$, $AB=5$, $AC=7$, and the bisector from $A$ meets $BC$ at $D$ with $BD=2.5$. What is $DC$?",
"c": [
"$3.5$",
"$5$",
"$2.5$",
"$7$"
],
"why": "$\\frac{BD}{DC}=\\frac57$."
},
{
"q": "The incentre lies on:",
"c": [
"all three angle bisectors",
"all three medians",
"all three altitudes",
"the Euler line always"
],
"why": "It's defined as their common point."
}
]
}
],
[
{
"t": "Ceva's theorem",
"x": "Cevians $AD$, $BE$, $CF$ of triangle $ABC$ (with $D, E, F$ on the sides) are **concurrent** exactly when\n$$\\frac{BD}{DC}\\cdot\\frac{CE}{EA}\\cdot\\frac{AF}{FB}=1.$$\n\nIt explains why medians, angle bisectors and altitudes are concurrent.\n\nGo around the triangle in one direction, vertex → point → vertex.",
"ex": {
"q": "Cevians from $A$, $B$, $C$ meet at one point. $\\frac{BD}{DC}=2$ and $\\frac{CE}{EA}=\\frac34$. Find $\\frac{AF}{FB}$.",
"steps": [
"Ceva: $2\\cdot\\frac34\\cdot\\frac{AF}{FB}=1$.",
"$\\frac32\\cdot\\frac{AF}{FB}=1$.",
"$\\frac{AF}{FB}=\\frac23$."
],
"ans": "$\\frac23$"
},
"checks": [
{
"q": "For the three medians, each ratio $\\frac{BD}{DC}$ etc. equals:",
"c": [
"$1$",
"$2$",
"$\\frac12$",
"it varies"
],
"why": "Midpoints split sides equally, and $1\\cdot1\\cdot1=1$."
},
{
"q": "Ceva's theorem tests whether three cevians are:",
"c": [
"concurrent",
"parallel",
"equal in length",
"perpendicular"
],
"why": "It's a concurrency criterion."
}
]
},
{
"t": "Menelaus",
"x": "A line crossing the (extended) sides $BC$, $CA$, $AB$ of triangle $ABC$ at $D$, $E$, $F$ satisfies\n$$\\frac{BD}{DC}\\cdot\\frac{CE}{EA}\\cdot\\frac{AF}{FB}=1$$\n(using unsigned lengths; with signed lengths the product is $-1$).\n\nIt's the collinearity partner of Ceva. Use it to find ratios along a line that cuts a triangle.",
"ex": {
"q": "In triangle $ABC$, $D$ is the midpoint of $BC$ and $E$ is on $CA$ with $CE:EA=1:2$. Line $DE$ meets line $AB$ at $F$. Find $\\frac{AF}{FB}$.",
"steps": [
"Menelaus: $\\frac{BD}{DC}\\cdot\\frac{CE}{EA}\\cdot\\frac{AF}{FB}=1$.",
"$1\\cdot\\frac12\\cdot\\frac{AF}{FB}=1$.",
"$\\frac{AF}{FB}=2$ ($F$ lies on $AB$ extended beyond $B$)."
],
"ans": "$2$"
},
"checks": [
{
"q": "Menelaus' theorem is used to prove three points are:",
"c": [
"collinear",
"concyclic",
"concurrent lines",
"equidistant"
],
"why": "It's a collinearity criterion."
},
{
"q": "If a line through the midpoints of $AB$ and $AC$ is extended, it:",
"c": [
"is parallel to $BC$",
"meets $BC$ at its midpoint",
"passes through $A$",
"is perpendicular to $BC$"
],
"why": "The midline is parallel to the third side (so it never meets line $BC$)."
}
]
},
{
"t": "Bash when stuck",
"x": "When synthetic ideas run out, **compute**: coordinates, complex numbers, vectors, trigonometry, or barycentric coordinates.\n\nChoose a set-up that keeps the algebra small: put a key point at the origin, a key line on an axis, the circumcircle as the unit circle.\n\nA bash is reliable, though slow. Clean symmetry in the set-up pays off.",
"ex": {
"q": "Prove that the diagonals of a parallelogram bisect each other, using vectors.",
"steps": [
"Put $A$ at the origin, with $\\vec{AB}=\\mathbf u$ and $\\vec{AD}=\\mathbf v$; then $C=\\mathbf u+\\mathbf v$.",
"Midpoint of $AC$: $\\frac{\\mathbf u+\\mathbf v}{2}$. Midpoint of $BD$: $\\frac{\\mathbf u+\\mathbf v}{2}$.",
"They're the same point."
],
"ans": "Proved"
},
"checks": [
{
"q": "In complex-number geometry, points on the unit circle satisfy:",
"c": [
"$\\bar z=\\frac1z$",
"$\\bar z=z$",
"$z^2=1$",
"$|z|=0$"
],
"why": "$z\\bar z=|z|^2=1$."
},
{
"q": "The centroid of points $A$, $B$, $C$ in coordinates is:",
"c": [
"$\\frac{A+B+C}{3}$",
"$\\frac{A+B}{2}$",
"$A+B+C$",
"$\\frac{A+B+C}{2}$"
],
"why": "Average the coordinates."
}
]
}
],
[
{
"t": "Inversion",
"x": "**Inversion** in a circle with centre $O$ and radius $r$ sends a point $P$ to $P'$ on ray $OP$ with $OP\\cdot OP'=r^2$.\n\nIt swaps inside and outside; circles through $O$ become lines (and lines become circles through $O$); other circles stay circles. Angles are preserved.\n\nUse it to turn a tangle of circles through one point into lines.",
"ex": {
"q": "Inversion in the unit circle centred at the origin: where does the point $(2,0)$ go? And $(0,\\frac13)$?",
"steps": [
"$OP\\cdot OP'=1$ with $P'$ on the same ray.",
"$(2,0)\\mapsto(\\frac12,0)$.",
"$(0,\\frac13)\\mapsto(0,3)$."
],
"ans": "$(\\frac12,0)$ and $(0,3)$"
},
"checks": [
{
"q": "Under inversion centred at $O$, a circle through $O$ becomes:",
"c": [
"a line",
"a circle through $O$",
"a point",
"a parabola"
],
"why": "$O$ goes to infinity, so the image is a line (not through $O$)."
},
{
"q": "A point on the circle of inversion is sent to:",
"c": [
"itself",
"the centre",
"infinity",
"its reflection"
],
"why": "$OP=r$ forces $OP'=r$."
}
]
},
{
"t": "Homothety",
"x": "A **homothety** with centre $X$ and ratio $k$ scales every point away from $X$ by $k$: it maps figures to similar, parallel copies.\n\nTwo circles are related by homotheties centred at their **external** and **internal** centres of similitude.\n\nThe centroid is the centre of the homothety with ratio $-\\frac12$ taking the triangle to its medial triangle.",
"ex": {
"q": "A homothety with centre $(0,0)$ and ratio $3$ maps the circle $(x-1)^2+y^2=1$ to what?",
"steps": [
"The centre $(1,0)$ goes to $(3,0)$.",
"The radius scales by $3$: radius $3$.",
"Image: $(x-3)^2+y^2=9$."
],
"ans": "$(x-3)^2+y^2=9$"
},
"checks": [
{
"q": "A homothety maps segment $AB$ to $A'B'$. Then $A'B'$ is:",
"c": [
"parallel to $AB$",
"perpendicular to $AB$",
"equal to $AB$",
"on the same line always"
],
"why": "Homotheties preserve directions."
},
{
"q": "The homothety centred at the centroid with ratio $-\\frac12$ sends vertex $A$ to:",
"c": [
"the midpoint of $BC$",
"the midpoint of $AB$",
"the orthocentre",
"$A$ itself"
],
"why": "$G$ divides the median $2:1$."
}
]
},
{
"t": "Radical axis",
"x": "The **radical axis** of two circles is the set of points with equal power to both. It's a straight line, perpendicular to the line joining the centres.\n\nIf the circles intersect, it's the line through the two intersection points.\n\nFor three circles, the three radical axes are **concurrent** (or parallel) at the radical centre.",
"ex": {
"q": "Find the radical axis of $x^2+y^2=4$ and $(x-3)^2+y^2=1$.",
"steps": [
"Power to the first: $x^2+y^2-4$. Power to the second: $x^2-6x+9+y^2-1$.",
"Set equal: $-4=-6x+8$.",
"$x=2$: a vertical line."
],
"ans": "$x=2$"
},
"checks": [
{
"q": "Two circles meet at $P$ and $Q$. Their radical axis is:",
"c": [
"line $PQ$",
"the line through the centres",
"the perpendicular bisector of the centres",
"tangent to both"
],
"why": "$P$ and $Q$ have power $0$ to both circles."
},
{
"q": "The radical axis is always perpendicular to:",
"c": [
"the line joining the centres",
"both circles' tangents",
"the $x$-axis",
"nothing in particular"
],
"why": "Subtracting the circle equations leaves a line perpendicular to the centre line."
}
]
}
]
],
"oly_mixed": [
[
{
"t": "Parity",
"x": "Every integer is **even or odd**, and the rules are simple: even $\\pm$ even $=$ even, odd $\\pm$ odd $=$ even, odd $\\times$ odd $=$ odd, and anything $\\times$ even $=$ even.\n\nParity arguments prove impossibility quickly: if one side of an equation must be odd and the other even, there are no solutions.\n\nA sum of integers is odd exactly when it has an odd number of odd terms.",
"ex": {
"q": "Can $x^2+y^2=4z+3$ have integer solutions?",
"steps": [
"Look mod $4$: squares are $0$ or $1$, so $x^2+y^2$ is $0$, $1$ or $2$ mod $4$.",
"The right side is $3$ mod $4$.",
"So no solutions."
],
"ans": "No"
},
"checks": [
{
"q": "The numbers $1, 2, \\dots, 10$ are written down. You may replace any two by their difference. Can you end with $0$?",
"c": [
"No",
"Yes",
"Only if you start with $1$",
"Only after $5$ moves"
],
"why": "Replacing $a,b$ by $a-b$ keeps the parity of the total. The total starts at $55$ (odd), so the last number is odd."
},
{
"q": "$a$ and $b$ are integers and $a+b$ is odd. Then $a-b$ is:",
"c": [
"Odd",
"Even",
"Zero",
"Can't tell"
],
"why": "$(a+b)-(a-b)=2b$ is even, so $a+b$ and $a-b$ have the same parity."
}
]
},
{
"t": "Count the complement",
"x": "When \"at least one\", \"not all\" or \"some\" appears, count the **opposite** and subtract from the total.\n\nThe complement is often a single clean case (\"none at all\") while the original splits into many messy ones.\n\nCombine with the multiplication principle: total ways minus ways with no restriction violated.",
"ex": {
"q": "How many $5$-digit numbers contain at least one digit $0$?",
"steps": [
"All $5$-digit numbers: $9\\cdot10^4=90\\,000$.",
"With no zero at all: $9^5=59\\,049$.",
"At least one zero: $90\\,000-59\\,049=30\\,951$."
],
"ans": "$30\\,951$"
},
"checks": [
{
"q": "How many subsets of $\\{1,\\dots,10\\}$ contain at least one even number?",
"c": [
"$992$",
"$1023$",
"$512$",
"$960$"
],
"why": "Total $2^{10}=1024$; subsets with only odd numbers: $2^5=32$."
},
{
"q": "In a group of $23$ people, the probability that two share a birthday is closest to:",
"c": [
"$\\frac12$",
"$\\frac{23}{365}$",
"$\\frac1{10}$",
"$\\frac{9}{10}$"
],
"why": "$P(\\text{all different})=\\frac{365\\cdot364\\cdots343}{365^{23}}\\approx0.49$, so the complement is about $0.51$."
}
]
},
{
"t": "Factor it",
"x": "Factoring reveals hidden structure. Learn the key identities:\n• $a^2-b^2=(a-b)(a+b)$\n• $a^3\\pm b^3=(a\\pm b)(a^2\\mp ab+b^2)$\n• $a^3+b^3+c^3-3abc=(a+b+c)(a^2+b^2+c^2-ab-bc-ca)$\n• Sophie Germain: $a^4+4b^4=(a^2+2b^2+2ab)(a^2+2b^2-2ab)$\n\nWhen an expression is complicated, factoring usually beats expanding.",
"ex": {
"q": "Show $n^4+4$ is prime only for $n=1$.",
"steps": [
"Sophie Germain with $b=1$: $n^4+4=(n^2+2n+2)(n^2-2n+2)$.",
"For $n\\ge2$, the smaller factor $n^2-2n+2=(n-1)^2+1\\ge2$.",
"So it's composite for $n\\ge2$; $n=1$ gives $5$, prime."
],
"ans": "Only $n=1$"
},
"checks": [
{
"q": "What is $\\dfrac{2025^3-1}{2025^2+2025+1}$?",
"c": [
"$2024$",
"$2025$",
"$2026$",
"$1$"
],
"why": "$a^3-1=(a-1)(a^2+a+1)$."
},
{
"q": "If $a+b+c=0$, then $a^3+b^3+c^3$ equals:",
"c": [
"$3abc$",
"$0$",
"$abc$",
"$(a+b+c)^3$"
],
"why": "From the identity, $a^3+b^3+c^3-3abc=0$."
}
]
}
],
[
{
"t": "Congruences",
"x": "Treat $\\equiv\\pmod n$ like equality: add, subtract, multiply both sides, and raise to powers.\n\nYou may **divide** by $a$ only if $\\gcd(a,n)=1$. In general, $ka\\equiv kb\\pmod n$ gives $a\\equiv b\\pmod{\\frac{n}{\\gcd(k,n)}}$.\n\nChoosing the right modulus is the art: try $3, 4, 8, 9, 7, 11$ and see which makes the problem collapse.",
"ex": {
"q": "Show that $n^3-n$ is always divisible by $6$.",
"steps": [
"$n^3-n=(n-1)n(n+1)$, three consecutive integers.",
"One of them is even, and one is a multiple of $3$.",
"So $6$ divides the product."
],
"ans": "Always divisible by $6$"
},
"checks": [
{
"q": "Solve $6x\\equiv4\\pmod{10}$.",
"c": [
"$x\\equiv4\\pmod 5$",
"$x\\equiv4\\pmod{10}$",
"No solution",
"$x\\equiv2\\pmod 5$"
],
"why": "Divide everything by $2$: $3x\\equiv2\\pmod5$; the inverse of $3$ is $2$, so $x\\equiv4$."
},
{
"q": "What is $2^{2025}\\bmod 3$?",
"c": [
"$2$",
"$1$",
"$0$",
"$3$"
],
"why": "$2\\equiv-1$, so $2^{2025}\\equiv(-1)^{2025}=-1\\equiv2$."
}
]
},
{
"t": "Combine tools",
"x": "Real problems need several tools at once: casework to split, the complement to simplify a case, bijections to recognise a count, symmetry to halve the work.\n\nA good habit: compute **small cases** by hand, look for a pattern, then find the argument that explains it.\n\nAlways sanity-check with a tiny example.",
"ex": {
"q": "How many $4$-digit numbers have digits that strictly increase from left to right?",
"steps": [
"Strictly increasing digits can't include $0$ (it would have to come first).",
"So choose $4$ different digits from $1$–$9$; there's exactly one increasing order (a bijection with subsets).",
"$\\binom94=126$."
],
"ans": "$126$"
},
"checks": [
{
"q": "How many $3$-digit numbers have digits that strictly decrease left to right?",
"c": [
"$120$",
"$84$",
"$720$",
"$210$"
],
"why": "Now $0$ is allowed (last): choose $3$ of $10$ digits, $\\binom{10}{3}$."
},
{
"q": "How many ways to choose $2$ squares of an $8\\times8$ chessboard that share a side?",
"c": [
"$112$",
"$64$",
"$128$",
"$56$"
],
"why": "Horizontal pairs: $8\\cdot7=56$; vertical: $56$."
}
]
},
{
"t": "Mean inequalities",
"x": "For positive reals: $\\text{QM}\\ge\\text{AM}\\ge\\text{GM}\\ge\\text{HM}$, i.e.\n$$\\sqrt{\\tfrac{a^2+b^2}{2}}\\ge\\tfrac{a+b}{2}\\ge\\sqrt{ab}\\ge\\tfrac{2}{\\frac1a+\\frac1b},$$\nwith equality exactly when all the numbers are equal. The same holds for $n$ numbers.\n\nAM–GM is the workhorse: split terms so the product becomes constant.",
"ex": {
"q": "For $x>0$, find the minimum of $x^2+\\frac{2}{x}$.",
"steps": [
"Split $\\frac2x=\\frac1x+\\frac1x$ so the product of the three terms is constant: $x^2\\cdot\\frac1x\\cdot\\frac1x=1$.",
"AM–GM: $x^2+\\frac1x+\\frac1x\\ge3\\sqrt[3]{1}=3$.",
"Equality when $x^2=\\frac1x$, i.e. $x=1$. Minimum $3$."
],
"ans": "$3$"
},
"checks": [
{
"q": "For positive $a,b,c$, the minimum of $\\frac ab+\\frac bc+\\frac ca$ is:",
"c": [
"$3$",
"$1$",
"$0$",
"$\\frac32$"
],
"why": "AM–GM: the product of the three fractions is $1$."
},
{
"q": "For positive $a,b$ with $ab=4$, the minimum of $a+4b$ is:",
"c": [
"$8$",
"$5$",
"$4$",
"$10$"
],
"why": "$a+4b\\ge2\\sqrt{4ab}=8$, at $a=4$, $b=1$."
}
]
}
],
[
{
"t": "Euler's theorem",
"x": "If $\\gcd(a,n)=1$, then $a^{\\varphi(n)}\\equiv1\\pmod n$, where $\\varphi(n)$ counts the numbers from $1$ to $n$ coprime to $n$.\n\n$\\varphi(p)=p-1$ for a prime (that's Fermat), $\\varphi(p^k)=p^k-p^{k-1}$, and $\\varphi$ multiplies over coprime parts: $\\varphi(100)=\\varphi(4)\\varphi(25)=2\\cdot20=40$.\n\nSo exponents can be reduced mod $\\varphi(n)$.",
"ex": {
"q": "Find $3^{2026}\\bmod 100$.",
"steps": [
"$\\varphi(100)=40$ and $\\gcd(3,100)=1$, so $3^{40}\\equiv1$; in fact the order of $3$ is even smaller: $3^{10}=59049\\equiv49$ and $49^2=2401\\equiv1$, so $3^{20}\\equiv1$.",
"$2026=20\\cdot101+6$, so $3^{2026}\\equiv3^{6}=729$.",
"$729\\equiv29\\pmod{100}$."
],
"ans": "$29$"
},
"checks": [
{
"q": "What is $\\varphi(36)$?",
"c": [
"$12$",
"$18$",
"$24$",
"$6$"
],
"why": "$\\varphi(4)\\varphi(9)=2\\cdot6$."
},
{
"q": "What is $7^{100}\\bmod 15$?",
"c": [
"$1$",
"$7$",
"$4$",
"$13$"
],
"why": "$\\varphi(15)=8$, $100=8\\cdot12+4$, $7^4=2401\\equiv1$."
}
]
},
{
"t": "Invariants",
"x": "An **invariant** is a quantity that never changes under the allowed moves. If the start and the target have different values, the target is unreachable.\n\nGood candidates: the sum, the sum mod something, parity of a count, a product, a colouring count.\n\nA **monovariant** only ever increases (or decreases); it proves that a process must stop.",
"ex": {
"q": "Numbers $1,2,\\dots,20$ are on a board. A move replaces $a,b$ with $a+b-1$. What number is left at the end?",
"steps": [
"Each move lowers the total by exactly $1$, and there are $19$ moves.",
"Start total: $210$.",
"Final number: $210-19=191$."
],
"ans": "$191$"
},
"checks": [
{
"q": "A chessboard has two opposite corners removed. Can it be tiled by dominoes?",
"c": [
"No",
"Yes",
"Only by $31$ dominoes of one colour",
"Only on an $8\\times8$"
],
"why": "Each domino covers one black and one white square, but the two removed corners have the same colour: $30$ of one, $32$ of the other."
},
{
"q": "You may flip any two coins at once. Starting with $7$ heads up, can you reach all tails?",
"c": [
"No",
"Yes",
"Only with $7$ flips",
"Only with an even number of coins"
],
"why": "Each move changes the number of heads by $-2$, $0$ or $+2$: its parity is invariant, and $7$ is odd."
}
]
},
{
"t": "Integer root theorem",
"x": "If a polynomial with **integer coefficients** has a rational root $\\frac pq$ (in lowest terms), then $p$ divides the constant term and $q$ divides the leading coefficient.\n\nFor a monic polynomial, every rational root is an integer dividing the constant term.\n\nAlso: $a-b$ divides $P(a)-P(b)$ for integer polynomials, a powerful constraint.",
"ex": {
"q": "Find all rational roots of $2x^3-3x^2-11x+6$.",
"steps": [
"Candidates: $\\pm1,\\pm2,\\pm3,\\pm6,\\pm\\frac12,\\pm\\frac32$.",
"Test: $x=3$: $54-27-33+6=0$. ✓ Divide: $(x-3)(2x^2+3x-2)=(x-3)(2x-1)(x+2)$.",
"Roots $3, \\frac12, -2$."
],
"ans": "$3,\\frac12,-2$"
},
"checks": [
{
"q": "Which could be a rational root of $3x^3+x-4$?",
"c": [
"$\\frac43$",
"$\\frac34$",
"$\\frac25$",
"$\\frac12$"
],
"why": "$p\\mid4$, $q\\mid3$. (In fact $x=1$ is a root.)"
},
{
"q": "$P$ has integer coefficients with $P(1)=3$ and $P(5)=10$. Is that possible?",
"c": [
"No",
"Yes",
"Only if $P$ is linear",
"Only if $P(0)=0$"
],
"why": "$5-1=4$ must divide $10-3=7$."
}
]
}
],
[
{
"t": "Orders",
"x": "The **order** of $a$ mod $n$ is the smallest $k\\ge1$ with $a^k\\equiv1\\pmod n$.\n\nKey fact: $a^m\\equiv1$ exactly when the order divides $m$. In particular, the order divides $\\varphi(n)$.\n\nSo to find an order, only test divisors of $\\varphi(n)$.",
"ex": {
"q": "Find the order of $2$ modulo $11$.",
"steps": [
"The order divides $\\varphi(11)=10$: test $1, 2, 5, 10$.",
"$2^1=2$, $2^2=4$, $2^5=32\\equiv10$.",
"None is $1$, so the order is $10$."
],
"ans": "$10$"
},
"checks": [
{
"q": "What is the order of $3$ mod $7$?",
"c": [
"$6$",
"$3$",
"$2$",
"$7$"
],
"why": "Test divisors of $6$: $3^2=9\\equiv2$, $3^3=27\\equiv6$. So it's $6$."
},
{
"q": "If $a$ has order $12$ mod $n$, for which $m$ is $a^m\\equiv1$?",
"c": [
"$m=36$",
"$m=6$",
"$m=8$",
"$m=18$"
],
"why": "Exactly the multiples of $12$."
}
]
},
{
"t": "The extremal principle",
"x": "Look at the object that is **biggest, smallest, first, or last**: the longest path, the closest pair, the person with the most friends.\n\nThe extreme object has special properties (\"nothing is bigger than it\"), which often leads straight to a contradiction or a construction.\n\nCombine with \"suppose the claim is false; take a minimal counterexample\".",
"ex": {
"q": "Finitely many people stand in a field, all pairwise distances different. Each throws a ball at their nearest neighbour. If the number of people is odd, show someone is not hit.",
"steps": [
"Take the closest pair $A,B$: they throw at each other.",
"If anyone else throws at $A$ or $B$, some person is hit twice, and then by counting someone is unhit. Otherwise remove $A$ and $B$; the others still throw within the rest.",
"Repeat; with an odd number, you end with one person who isn't hit."
],
"ans": "Proved"
},
"checks": [
{
"q": "In a finite set of numbers, which object does the extremal principle focus on?",
"c": [
"The largest or smallest element",
"The middle element",
"A random element",
"The sum"
],
"why": "Extremes have the most constraints."
},
{
"q": "Among finitely many points (not all on a line), take the pair with the smallest positive distance. Why might this help?",
"c": [
"No other pair is closer",
"It's always $1$",
"They're on a circle",
"It's unique by definition"
],
"why": "That extremal property is what you exploit."
}
]
},
{
"t": "Substitutions",
"x": "Change variables to reveal structure:\n• a constraint $abc=1$: try $a=\\frac xy$, $b=\\frac yz$, $c=\\frac zx$;\n• $a+b+c=0$: use identities like $a^3+b^3+c^3=3abc$;\n• sides of a triangle: $a=y+z$, $b=z+x$, $c=x+y$ (Ravi substitution) with $x,y,z>0$;\n• trig: $x=\\tan\\theta$ when you see $1+x^2$.\n\nA symmetric problem often simplifies with $s=a+b$, $p=ab$.",
"ex": {
"q": "Solve the system $x+y=5$, $x^3+y^3=35$.",
"steps": [
"Let $s=x+y=5$, $p=xy$: $x^3+y^3=s^3-3sp=125-15p$.",
"$125-15p=35$, so $p=6$.",
"$x,y$ are roots of $t^2-5t+6$: $\\{2,3\\}$."
],
"ans": "$(2,3)$ or $(3,2)$"
},
"checks": [
{
"q": "In a triangle with sides $a=y+z$, $b=z+x$, $c=x+y$, what is $x$ in terms of the sides?",
"c": [
"$\\frac{b+c-a}{2}$",
"$\\frac{a+b+c}{2}$",
"$a-b$",
"$\\frac{a}{2}$"
],
"why": "$b+c-a=2x$."
},
{
"q": "If $x+\\frac1x=t$, then $x^3+\\frac1{x^3}$ equals:",
"c": [
"$t^3-3t$",
"$t^3$",
"$t^3+3t$",
"$3t$"
],
"why": "Cube: $t^3=x^3+\\frac1{x^3}+3t$."
}
]
}
],
[
{
"t": "Infinite descent",
"x": "To show an equation has no positive solutions, suppose there's one and build a **smaller** positive one. Repeating forever is impossible, because positive integers can't decrease forever.\n\nEquivalently: take the **smallest** solution and find an even smaller one, a contradiction.\n\nThe classic: $\\sqrt2$ is irrational. If $a^2=2b^2$, then $a$ is even, $a=2c$, so $b^2=2c^2$: a smaller solution.",
"ex": {
"q": "Show $x^2+y^2=3z^2$ has no positive integer solutions.",
"steps": [
"Squares mod $3$ are $0,1$; $x^2+y^2\\equiv0$ forces $x\\equiv y\\equiv0\\pmod3$.",
"Then $9\\mid3z^2$, so $3\\mid z$.",
"Divide everything by $3$: a smaller solution. Descent: impossible."
],
"ans": "No solutions"
},
"checks": [
{
"q": "If $a^2=2b^2$ with positive integers, what must be true of $a$?",
"c": [
"$a$ is even",
"$a$ is odd",
"$a$ is prime",
"$a=b$"
],
"why": "$a^2$ is even, so $a$ is even, and descent follows."
},
{
"q": "The descent argument works because:",
"c": [
"Positive integers can't decrease forever",
"Every number is prime",
"Squares are positive",
"Equations have unique solutions"
],
"why": "That's the well-ordering principle."
}
]
},
{
"t": "Winning and losing positions",
"x": "In a two-player game with no luck, classify each position as **winning** (the player to move can force a win) or **losing**.\n\nA position is losing if **every** move leads to a winning position, and winning if **some** move leads to a losing position. Work backwards from the end.\n\nLook for a pattern, then prove it: usually a simple rule like \"multiples of $4$ are losing\".",
"ex": {
"q": "$20$ stones; players alternately take $1$, $2$ or $3$. Whoever takes the last stone wins. Who wins?",
"steps": [
"$0$ stones (no move) is losing for the player to move. $1,2,3$ are winning (take all).",
"$4$ is losing: every move leaves $1$–$3$. Pattern: multiples of $4$ are losing.",
"$20$ is a multiple of $4$: the second player wins by always leaving a multiple of $4$."
],
"ans": "The second player"
},
"checks": [
{
"q": "Same game but you may take $1$ to $4$ stones. Which starting pile is losing for the first player?",
"c": [
"$15$",
"$16$",
"$12$",
"$18$"
],
"why": "Now multiples of $5$ are losing."
},
{
"q": "A position where every move leads to a winning position is:",
"c": [
"losing",
"winning",
"a draw",
"impossible"
],
"why": "Whatever you do, you hand your opponent a win."
}
]
},
{
"t": "Equality cases",
"x": "Before proving an inequality, find **when equality holds**. Usually it's all variables equal, or some at an endpoint (like $0$).\n\nYour proof must be tight exactly there. If a step loses information at the equality case, that step is wrong.\n\nThe equality case tells you how to split terms for AM–GM and which inequality to try.",
"ex": {
"q": "For $x>0$, find the minimum of $x+\\frac{1}{x^2}$ and say where it occurs.",
"steps": [
"Guess: AM–GM with terms balanced at equality. Split $x=\\frac x2+\\frac x2$ so the product with $\\frac1{x^2}$ is constant: $\\frac x2\\cdot\\frac x2\\cdot\\frac1{x^2}=\\frac14$.",
"$\\frac x2+\\frac x2+\\frac1{x^2}\\ge3\\sqrt[3]{\\frac14}$.",
"Equality when $\\frac x2=\\frac1{x^2}$, i.e. $x=\\sqrt[3]2$. Minimum $\\frac{3}{\\sqrt[3]4}$."
],
"ans": "$\\frac{3}{\\sqrt[3]{4}}$ at $x=\\sqrt[3]{2}$"
},
"checks": [
{
"q": "For non-negative $a,b$ with $a+b=1$, the maximum of $a^2+b^2$ occurs at:",
"c": [
"$(a,b)=(1,0)$ or $(0,1)$",
"$a=b=\\frac12$",
"$a=\\frac13$",
"nowhere"
],
"why": "$a^2+b^2=1-2ab$ is largest when $ab=0$: an endpoint, not the middle."
},
{
"q": "AM–GM on $a$ and $b$ is an equality exactly when:",
"c": [
"$a=b$",
"$a=0$",
"$a+b=1$",
"$ab=1$"
],
"why": "$\\frac{a+b}2-\\sqrt{ab}=\\frac12(\\sqrt a-\\sqrt b)^2$."
}
]
}
]
]
};
