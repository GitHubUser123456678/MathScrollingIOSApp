// Reads a maths answer, written in LaTeX ("\frac{2\sqrt3}{3}") or typed ("2sqrt(3)/3"), and returns its
// numeric value, so answers can be checked by value. Returns NaN for anything with variables, words or lists.

function closeBrace(s, i) {
  let depth = 0;
  for (let j = i; j < s.length; j++) {
    if (s[j] === '{') depth++;
    else if (s[j] === '}' && --depth === 0) return j;
  }
  return -1;
}
// Replace \cmd{a}{b} (n brace groups) using fn(args).
function replaceCmd(s, cmd, n, fn) {
  for (let guard = 0; guard < 50; guard++) {
    const i = s.indexOf(cmd);
    if (i < 0) return s;
    let j = i + cmd.length; const args = [];
    for (let k = 0; k < n; k++) {
      while (s[j] === ' ') j++;
      if (s[j] === '{') { const e = closeBrace(s, j); if (e < 0) return s; args.push(s.slice(j + 1, e)); j = e + 1; }
      else if (s[j] && /[0-9a-z]/i.test(s[j])) { args.push(s[j]); j++; } // \frac12, \sqrt3
      else return s.slice(0, i) + s.slice(i + cmd.length);
    }
    s = s.slice(0, i) + fn(args) + s.slice(j);
  }
  return s;
}

export function cleanTex(raw) {
  let s = String(raw).trim();
  const boxed = s.lastIndexOf('\\boxed{');
  if (boxed >= 0) { const e = closeBrace(s, boxed + 6); if (e > 0) s = s.slice(boxed + 7, e); }
  return s.replace(/^\$+|\$+$/g, '').replace(/^\\\(|\\\)$/g, '').replace(/^\\\[|\\\]$/g, '').trim();
}

function toPlain(raw) {
  let s = cleanTex(raw);
  if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/,/g, ''); // 1,000
  s = s.replace(/\\(left|right|displaystyle|,|;|!|quad|qquad)|~/g, ' ')
    .replace(/\^\s*\{?\\circ\}?|\\circ|°|\\%|%|\\\$|\$/g, '')
    .replace(/\\(?:text|mbox|mathrm)\{\s*(?:cm|m|km|in|inches|ft|feet|units?|square units|sq units|degrees?|dollars|cents|meters|centimeters|hours|minutes|seconds|days|mph|miles)\s*\}(\^2|\^3)?/gi, '')
    .replace(/\\[dt]frac/g, '\\frac')
    .replace(/(\d)\s*\\frac\{(\d+)\}\{(\d+)\}/g, '($1+$2/$3)'); // mixed numbers like 5\frac{1}{3}
  s = replaceCmd(s, '\\frac', 2, ([a, b]) => `((${a})/(${b}))`);
  s = s.replace(/\\sqrt\s*\[([^\]]+)\]/g, '\\root{$1}');
  s = replaceCmd(s, '\\root', 2, ([n, x]) => `root((${x}),(${n}))`);
  s = replaceCmd(s, '\\sqrt', 1, ([x]) => `sqrt(${x})`);
  s = s.replace(/\\pi/g, 'pi').replace(/\\cdot|\\times/g, '*').replace(/\\div/g, '/').replace(/[{]/g, '(').replace(/[}]/g, ')')
    .replace(/π/g, 'pi').replace(/√/g, 'sqrt').replace(/[×·]/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-');
  return s;
}

// Recursive-descent parser over + - * / ^, implicit multiplication, sqrt(), root(x, n), pi.
function evaluate(src) {
  const toks = [];
  const re = /\s*(\d+\.?\d*|\.\d+|sqrt|root|pi|[-+*/^(),])/y;
  let m; let pos = 0;
  src = src.trim();
  while (pos < src.length) {
    re.lastIndex = pos;
    m = re.exec(src);
    if (!m) return NaN;
    toks.push(m[1]); pos = re.lastIndex;
    while (src[pos] === ' ') pos++;
  }
  let i = 0;
  const peek = () => toks[i];
  const startsAtom = (t) => t !== undefined && (/^[\d.]/.test(t) || t === '(' || t === 'sqrt' || t === 'root' || t === 'pi');
  function expr() { let v = term(); while (peek() === '+' || peek() === '-') { const op = toks[i++]; const r = term(); v = op === '+' ? v + r : v - r; } return v; }
  function term() {
    let v = unary();
    for (;;) {
      if (peek() === '*' || peek() === '/') { const op = toks[i++]; const r = unary(); v = op === '*' ? v * r : v / r; }
      else if (startsAtom(peek())) v *= power(); // implicit: 2sqrt(3), 3pi, 2(1+x)
      else return v;
    }
  }
  function unary() { if (peek() === '-') { i++; return -unary(); } if (peek() === '+') { i++; return unary(); } return power(); }
  function power() { const b = atom(); if (peek() === '^') { i++; return b ** unary(); } return b; }
  function atom() {
    const t = toks[i++];
    if (t === undefined) return NaN;
    if (/^[\d.]/.test(t)) return parseFloat(t);
    if (t === 'pi') return Math.PI;
    if (t === '(') { const v = expr(); if (toks[i++] !== ')') return NaN; return v; }
    if (t === 'sqrt') { if (peek() === '(') { i++; const v = expr(); if (toks[i++] !== ')') return NaN; return Math.sqrt(v); } return Math.sqrt(power()); }
    if (t === 'root') { if (toks[i++] !== '(') return NaN; const x = expr(); if (toks[i++] !== ',') return NaN; const n = expr(); if (toks[i++] !== ')') return NaN; return x < 0 && n % 2 === 1 ? -((-x) ** (1 / n)) : x ** (1 / n); }
    return NaN;
  }
  const v = expr();
  return i === toks.length ? v : NaN;
}

export function exprValue(raw) {
  if (raw == null) return NaN;
  const s = toPlain(raw);
  if (!s || s.length > 120 || /[a-oq-z]/i.test(s.replace(/sqrt|root|pi/g, ''))) return NaN; // variables or words
  if (/,/.test(s.replace(/root\([^()]*(\([^()]*\))*[^()]*,/g, ''))) return NaN; // lists of answers
  const v = evaluate(s);
  return Number.isFinite(v) && Math.abs(v) < 1e15 ? v : NaN;
}
export const sameValue = (a, b) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(b));
