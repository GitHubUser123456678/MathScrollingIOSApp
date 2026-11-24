// A small Asymptote interpreter: enough of the language used in AMC/AIME and MATH diagrams
// (points, paths, circles, arcs, labels, dots, fills, loops, olympiad helpers) to draw them as SVG.
// Anything it can't handle throws, and the caller falls back to a "diagram" note.

// ------------------------------------------------------------------ values
class Pair { constructor(x, y) { this.x = x; this.y = y; } }
class Path { constructor(subs) { this.subs = subs; } } // subs: [{ pts: [Pair], closed: bool }]
class Pen { constructor(o = {}) { Object.assign(this, { color: null, width: null, dash: null, opacity: null }, o); } }
class Transform { constructor(a, b, c, d, e, f) { Object.assign(this, { a, b, c, d, e, f }); } }
class Label { constructor(s, pos = null, align = null) { this.s = s; this.pos = pos; this.align = align; } }
class ArrowSpec { constructor(where) { this.where = where; } } // 'end' | 'begin' | 'both' | 'mid'
class Fn { constructor(params, body, env) { this.params = params; this.body = body; this.env = env; } }
const CYCLE = { cycle: true };

const P = (x, y) => new Pair(x, y);
const add = (a, b) => P(a.x + b.x, a.y + b.y);
const sub = (a, b) => P(a.x - b.x, a.y - b.y);
const mul = (a, k) => P(a.x * k, a.y * k);
const len = (a) => Math.hypot(a.x, a.y);
const deg = Math.PI / 180;
const dirOf = (a) => P(Math.cos(a * deg), Math.sin(a * deg));

const COLORS = {
  black: '#000', white: '#fff', red: '#e11d1d', green: '#16a34a', blue: '#1d4ed8', yellow: '#eab308', cyan: '#06b6d4',
  magenta: '#c026d3', orange: '#f97316', purple: '#7e22ce', brown: '#92400e', pink: '#ec4899', gray: '#808080', grey: '#808080',
  lightgray: '#d4d4d4', lightgrey: '#d4d4d4', mediumgray: '#a3a3a3', darkgray: '#525252', darkgrey: '#525252', heavygray: '#404040',
  lightblue: '#93c5fd', lightred: '#fca5a5', lightgreen: '#86efac', lightyellow: '#fef08a', lightcyan: '#a5f3fc', lightmagenta: '#f0abfc',
  heavyblue: '#1e3a8a', heavyred: '#991b1b', heavygreen: '#14532d', darkblue: '#1e3a8a', darkgreen: '#166534', deepblue: '#1e40af',
  deepred: '#b91c1c', deepgreen: '#15803d', olive: '#808000', royalblue: '#4169e1', navy: '#000080', palegray: '#e5e5e5', palegrey: '#e5e5e5',
  paleblue: '#bfdbfe', palered: '#fecaca', palegreen: '#bbf7d0', paleyellow: '#fef9c3', fuchsia: '#d946ef', salmon: '#fa8072', springgreen: '#00ff7f',
  chartreuse: '#7fff00', violet: '#8b5cf6', lavender: '#e6e6fa', mediumblue: '#3b82f6', mediumred: '#ef4444', mediumgreen: '#22c55e', invisible: 'none',
};

function toPath(v) {
  if (v instanceof Path) return v;
  if (v instanceof Pair) return new Path([{ pts: [v], closed: false }]);
  throw new Error('expected a path');
}
function applyT(t, v) {
  if (v instanceof Pair) return P(t.a * v.x + t.b * v.y + t.e, t.c * v.x + t.d * v.y + t.f);
  if (v instanceof Path) return new Path(v.subs.map((s) => ({ pts: s.pts.map((p) => applyT(t, p)), closed: s.closed })));
  if (v instanceof Transform) return new Transform(t.a * v.a + t.b * v.c, t.a * v.b + t.b * v.d, t.c * v.a + t.d * v.c, t.c * v.b + t.d * v.d, t.a * v.e + t.b * v.f + t.e, t.c * v.e + t.d * v.f + t.f);
  if (typeof v === 'string' || v instanceof Label || v instanceof Pen) return v; // rotated/scaled text: drawn as-is
  if (Array.isArray(v)) return v.map((x) => applyT(t, x));
  throw new Error('cannot transform that');
}
const rotT = (a, c = P(0, 0)) => {
  const co = Math.cos(a * deg); const si = Math.sin(a * deg);
  return new Transform(co, -si, si, co, c.x - co * c.x + si * c.y, c.y - si * c.x - co * c.y);
};
function circlePts(c, r, a1 = 0, a2 = 360, n = null) {
  const steps = n || Math.max(12, Math.ceil(Math.abs(a2 - a1) / 4));
  const pts = [];
  for (let i = 0; i <= steps; i++) { const a = a1 + ((a2 - a1) * i) / steps; pts.push(add(c, mul(dirOf(a), r))); }
  return pts;
}
const circlePath = (c, r) => new Path([{ pts: circlePts(c, r, 0, 360).slice(0, -1), closed: true }]);

// Smooth curve through points (approximates Asymptote's ".." joins, which use Hobby's algorithm):
// tangents like Catmull-Rom, with control lengths chosen so arcs come out circular.
function catmull(pts, closed) {
  if (pts.length < 3) return pts;
  const n = pts.length;
  const get = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  const tangent = (i) => {
    let t = sub(get(i + 1), get(i - 1));
    if (!closed && i === 0) t = sub(get(1), get(0));
    if (!closed && i === n - 1) t = sub(get(n - 1), get(n - 2));
    const l = len(t) || 1; return mul(t, 1 / l);
  };
  const out = [pts[0]];
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const a = get(i); const b = get(i + 1);
    const t1 = tangent(i); const t2 = tangent(i + 1);
    const chord = len(sub(b, a));
    const phi = Math.acos(Math.max(-1, Math.min(1, t1.x * t2.x + t1.y * t2.y)));
    const c = chord / (3 * Math.cos(phi / 4) ** 2);
    out.push(...bezier(a, add(a, mul(t1, c)), sub(b, mul(t2, c)), b));
  }
  if (closed) out.pop();
  return out;
}
function bezier(a, c1, c2, b) {
  const out = [];
  for (let k = 1; k <= 16; k++) {
    const t = k / 16; const u = 1 - t;
    out.push(P(u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x, u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y));
  }
  return out;
}

// Line through A,B meets line through C,D.
function extension(A, B, C, D) {
  const d1 = sub(B, A); const d2 = sub(D, C);
  const den = d1.x * d2.y - d1.y * d2.x;
  if (Math.abs(den) < 1e-12) throw new Error('parallel lines');
  const t = ((C.x - A.x) * d2.y - (C.y - A.y) * d2.x) / den;
  return add(A, mul(d1, t));
}
function segPts(path) {
  const out = [];
  for (const s of toPath(path).subs) {
    const pts = s.closed ? [...s.pts, s.pts[0]] : s.pts;
    for (let i = 0; i + 1 < pts.length; i++) out.push([pts[i], pts[i + 1]]);
  }
  return out;
}
function intersections(p, q) {
  const res = [];
  for (const [a, b] of segPts(p)) {
    for (const [c, d] of segPts(q)) {
      const r = sub(b, a); const s = sub(d, c);
      const den = r.x * s.y - r.y * s.x;
      if (Math.abs(den) < 1e-12) continue;
      const t = ((c.x - a.x) * s.y - (c.y - a.y) * s.x) / den;
      const u = ((c.x - a.x) * r.y - (c.y - a.y) * r.x) / den;
      if (t >= -1e-9 && t <= 1 + 1e-9 && u >= -1e-9 && u <= 1 + 1e-9) {
        const pt = add(a, mul(r, t));
        if (!res.some((x) => len(sub(x, pt)) < 1e-6)) res.push(pt);
      }
    }
  }
  return res;
}
function foot(Pt, A, B) {
  const d = sub(B, A); const t = ((Pt.x - A.x) * d.x + (Pt.y - A.y) * d.y) / (d.x * d.x + d.y * d.y);
  return add(A, mul(d, t));
}
function circumcenter(A, B, C) {
  const d = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
  const a2 = A.x * A.x + A.y * A.y; const b2 = B.x * B.x + B.y * B.y; const c2 = C.x * C.x + C.y * C.y;
  return P((a2 * (B.y - C.y) + b2 * (C.y - A.y) + c2 * (A.y - B.y)) / d, (a2 * (C.x - B.x) + b2 * (A.x - C.x) + c2 * (B.x - A.x)) / d);
}
function incenter(A, B, C) {
  const a = len(sub(B, C)); const b = len(sub(A, C)); const c = len(sub(A, B)); const s = a + b + c;
  return P((a * A.x + b * B.x + c * C.x) / s, (a * A.y + b * B.y + c * C.y) / s);
}
const inradius = (A, B, C) => { const I = incenter(A, B, C); return len(sub(I, foot(I, A, B))); };
const pathPoint = (p, t) => {
  const s = toPath(p).subs[0]; const pts = s.closed ? [...s.pts, s.pts[0]] : s.pts;
  const i = Math.max(0, Math.min(pts.length - 1, Math.floor(t))); const f = t - i;
  return i >= pts.length - 1 ? pts[pts.length - 1] : add(pts[i], mul(sub(pts[i + 1], pts[i]), f));
};

// ------------------------------------------------------------------ tokenizer
const TYPES = new Set(['real', 'int', 'pair', 'path', 'guide', 'pen', 'string', 'bool', 'transform', 'void', 'picture', 'Label', 'var']);
function tokenize(src) {
  const toks = [];
  let i = 0;
  const ops = ['---', '..', '--', '^^', '++', '+=', '-=', '*=', '/=', '==', '!=', '<=', '>=', '&&', '||', '::'];
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (src.startsWith('//', i)) { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (src.startsWith('/*', i)) { const j = src.indexOf('*/', i + 2); i = j < 0 ? src.length : j + 2; continue; }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] || ''))) {
      const m = src.slice(i).match(/^(\d*\.?\d+(?:[eE][-+]?\d+)?|\d+\.)/);
      toks.push({ t: 'num', v: parseFloat(m[0]) }); i += m[0].length; continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1; let s = '';
      while (j < src.length && src[j] !== c) { if (src[j] === '\\' && src[j + 1] === c) { s += c; j += 2; continue; } s += src[j++]; }
      toks.push({ t: 'str', v: s }); i = j + 1; continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      const m = src.slice(i).match(/^[A-Za-z_][A-Za-z0-9_]*/);
      toks.push({ t: 'id', v: m[0] }); i += m[0].length; continue;
    }
    const op = ops.find((o) => src.startsWith(o, i));
    if (op) { toks.push({ t: 'op', v: op }); i += op.length; continue; }
    toks.push({ t: 'op', v: c }); i++;
  }
  toks.push({ t: 'eof', v: '' });
  return toks;
}

// ------------------------------------------------------------------ parser (to a small AST)
function parse(src) {
  const toks = tokenize(src);
  let k = 0;
  const peek = (o = 0) => toks[k + o];
  const is = (v, o = 0) => toks[k + o].v === v && toks[k + o].t !== 'str';
  const next = () => toks[k++];
  const expect = (v) => { if (!is(v)) throw new Error(`expected ${v} near "${peek().v}"`); return next(); };

  const isTypeAt = (o) => peek(o).t === 'id' && TYPES.has(peek(o).v);
  function typeLen(o) { // "pair", "pair[]", "pair[][]"
    if (!isTypeAt(o)) return 0;
    let n = 1;
    while (is('[', o + n - 1 + 1) && is(']', o + n + 1)) n += 2;
    return n;
  }

  function program() { const body = []; while (peek().t !== 'eof') body.push(statement()); return { k: 'block', body }; }
  function block() { expect('{'); const body = []; while (!is('}')) { if (peek().t === 'eof') throw new Error('missing }'); body.push(statement()); } next(); return { k: 'block', body }; }
  function statement() {
    if (is(';')) { next(); return { k: 'nop' }; }
    if (is('{')) return block();
    if (peek().t === 'id' && ['import', 'include', 'access', 'from', 'unravel', 'usepackage', 'texpreamble', 'settings'].includes(peek().v)) {
      while (!is(';') && peek().t !== 'eof') next(); if (is(';')) next(); return { k: 'nop' };
    }
    if (is('if')) { next(); expect('('); const c = expr(); expect(')'); const a = statement(); let b = null; if (is('else')) { next(); b = statement(); } return { k: 'if', c, a, b }; }
    if (is('while')) { next(); expect('('); const c = expr(); expect(')'); return { k: 'while', c, body: statement() }; }
    if (is('for')) {
      next(); expect('(');
      const tl = typeLen(0);
      if (tl && peek(tl).t === 'id' && is(':', tl + 1)) { // for (pair p : arr)
        k += tl; const name = next().v; next(); const arr = expr(); expect(')');
        return { k: 'foreach', name, arr, body: statement() };
      }
      const init = is(';') ? null : (tl ? decl(true) : expr()); expect(';');
      const c = is(';') ? null : expr(); expect(';');
      const step = is(')') ? null : expr(); expect(')');
      return { k: 'for', init, c, step, body: statement() };
    }
    if (is('return')) { next(); const e = is(';') ? null : expr(); expect(';'); return { k: 'return', e }; }
    if (is('break')) { next(); expect(';'); return { k: 'break' }; }
    if (is('continue')) { next(); expect(';'); return { k: 'continue' }; }
    const tl = typeLen(0);
    if (tl && peek(tl).t === 'id' && !is('(', tl + 1)) { const d = decl(false); expect(';'); return d; }
    if (tl && peek(tl).t === 'id' && is('(', tl + 1)) { // function definition
      k += tl; const name = next().v; expect('(');
      const params = [];
      while (!is(')')) {
        const pl = typeLen(0); if (pl) k += pl;
        const pname = next().v; let def = null;
        if (is('=')) { next(); def = assignExpr(); }
        params.push({ name: pname, def });
        if (is(',')) next();
      }
      next();
      if (is('=')) { next(); const e = expr(); expect(';'); return { k: 'fndef', name, params, body: { k: 'block', body: [{ k: 'return', e }] } }; }
      return { k: 'fndef', name, params, body: block() };
    }
    const e = expr(); if (is(';')) next(); else if (!is('}') && peek().t !== 'eof') expect(';');
    return { k: 'expr', e };
  }
  function decl(inFor) {
    const tl = typeLen(0); const isArray = tl > 1; k += tl;
    const items = [];
    do {
      if (is(',')) next();
      const name = next().v;
      let init = null;
      if (is('[') && is(']', 1)) { next(); next(); }
      if (is('=')) { next(); init = is('{') ? arrayLit() : assignExpr(); }
      items.push({ name, init });
    } while (is(','));
    return { k: 'decl', items, isArray, inFor };
  }
  function arrayLit() {
    expect('{'); const items = [];
    while (!is('}')) { items.push(is('{') ? arrayLit() : assignExpr()); if (is(',')) next(); }
    next(); return { k: 'array', items };
  }
  const expr = () => assignExpr();
  function assignExpr() {
    const left = ternary();
    if (['=', '+=', '-=', '*=', '/='].some((o) => is(o))) { const op = next().v; const right = is('{') ? arrayLit() : assignExpr(); return { k: 'assign', op, left, right }; }
    return left;
  }
  function ternary() {
    const c = orExpr();
    if (is('?')) { next(); const a = assignExpr(); expect(':'); const b = assignExpr(); return { k: 'cond', c, a, b }; }
    return c;
  }
  const binLevel = (ops, nextFn) => () => { let l = nextFn(); while (ops.some((o) => is(o))) { const op = next().v; l = { k: 'bin', op, l, r: nextFn() }; } return l; };
  const orExpr = () => binLevel(['||'], andExpr)();
  const andExpr = () => binLevel(['&&'], eqExpr)();
  const eqExpr = () => binLevel(['==', '!='], relExpr)();
  const relExpr = () => binLevel(['<', '>', '<=', '>='], pathExpr)();
  // Path joins bind more loosely than arithmetic: A--B+C is A--(B+C).
  function pathExpr() {
    if (is('--') && (is(';', 1) || is(')', 1))) return addExpr();
    const first = pathNode();
    if (!['--', '..', '---', '^^', '&'].some((o) => is(o))) return first;
    const nodes = [first]; const joins = [];
    while (['--', '..', '---', '^^', '&'].some((o) => is(o))) {
      let j = next().v;
      if (j === '..' && (is('tension') || is('controls'))) {
        if (is('controls')) { next(); const c1 = addExpr(); let c2 = c1; if (is('and')) { next(); c2 = addExpr(); } expect('..'); j = { controls: [c1, c2] }; } else { next(); if (is('atleast')) next(); addExpr(); if (is('and')) { next(); addExpr(); } expect('..'); }
      }
      joins.push(j);
      nodes.push(pathNode());
    }
    return { k: 'path', nodes, joins };
  }
  function pathNode() {
    if (is('{')) { next(); expr(); expect('}'); } // direction specifier: ignored
    if (is('cycle')) { next(); return { k: 'cycle' }; }
    const e = addExpr();
    if (is('{') && !is('}', 1)) { next(); expr(); expect('}'); }
    return e;
  }
  const addExpr = () => binLevel(['+', '-'], mulExpr)();
  const mulExpr = () => binLevel(['*', '/', '%', '#'], unary)();
  function unary() {
    if (is('-')) { next(); return { k: 'neg', e: unary() }; }
    if (is('+')) { next(); return unary(); }
    if (is('!')) { next(); return { k: 'not', e: unary() }; }
    if (is('++') || (is('--') && peek(1).t === 'id' && !is('(', 2))) { const op = next().v; return { k: 'preinc', op, e: unary() }; }
    return power();
  }
  function power() {
    const base = postfix();
    if (is('^')) { next(); return { k: 'bin', op: '^', l: base, r: unary() }; }
    return base;
  }
  function postfix() {
    let e = primary();
    for (;;) {
      if (is('(')) { next(); const args = []; while (!is(')')) { if (peek().t === 'id' && is('=', 1)) { next(); next(); } args.push(assignExpr()); if (is(',')) next(); else if (!is(')')) throw new Error('bad call'); } next(); e = { k: 'call', f: e, args }; continue; }
      if (is('[')) { next(); const i = expr(); expect(']'); e = { k: 'index', e, i }; continue; }
      if (is('.') && peek(1).t === 'id') { next(); e = { k: 'member', e, name: next().v }; continue; }
      if (is('++')) { next(); e = { k: 'postinc', op: '++', e }; continue; }
      if (is('--') && (is(')', 1) || is(';', 1))) { next(); e = { k: 'postinc', op: '--', e }; continue; }
      break;
    }
    return e;
  }
  function primary() {
    const t = peek();
    if (t.t === 'num') {
      next();
      // Implicit multiplication: 2A, 3dir(30), 0.5(A+B)
      if ((peek().t === 'id' && !TYPES.has(peek().v)) || is('(')) return { k: 'bin', op: '*', l: { k: 'num', v: t.v }, r: postfix() };
      return { k: 'num', v: t.v };
    }
    if (t.t === 'str') { next(); return { k: 'str', v: t.v }; }
    if (is('(')) {
      next();
      if (isTypeAt(0) && is(')', typeLen(0))) { k += typeLen(0); next(); return unary(); } // cast like (real)x
      const a = expr();
      if (is(',')) { next(); const b = expr(); expect(')'); return { k: 'pair', a, b }; }
      expect(')'); return a;
    }
    if (is('new')) { next(); const tl = typeLen(0); k += tl; if (is('[')) { next(); if (!is(']')) expr(); expect(']'); } if (is('{')) return arrayLit(); return { k: 'array', items: [] }; }
    if (t.t === 'id') { next(); if (t.v === 'true') return { k: 'num', v: true }; if (t.v === 'false') return { k: 'num', v: false }; return { k: 'id', v: t.v }; }
    if (is('{')) return arrayLit();
    throw new Error(`unexpected "${t.v}"`);
  }
  return program();
}

// ------------------------------------------------------------------ evaluator
class Env {
  constructor(parent = null) { this.vars = new Map(); this.parent = parent; }
  find(n) { let e = this; while (e) { if (e.vars.has(n)) return e; e = e.parent; } return null; }
  get(n) { const e = this.find(n); if (!e) throw new Error(`unknown name ${n}`); return e.vars.get(n); }
  set(n, v) { const e = this.find(n) || this; e.vars.set(n, v); }
  def(n, v) { this.vars.set(n, v); }
}
class Return { constructor(v) { this.v = v; } }
const BREAK = { brk: true }; const CONTINUE = { cont: true };

function arith(op, a, b) {
  if (op === '+' && (typeof a === 'string' || typeof b === 'string')) return String(a) + String(b);
  if (a instanceof Pen || b instanceof Pen) { if (op !== '+') throw new Error('pen op'); return mergePens(a, b); }
  if (op === '*' && a instanceof Transform) return applyT(a, b);
  const isP = (v) => v instanceof Pair;
  if (typeof a === 'number' && typeof b === 'number') {
    switch (op) { case '+': return a + b; case '-': return a - b; case '*': return a * b; case '/': return a / b; case '%': return a % b; case '^': return a ** b; case '#': return Math.floor(a / b); default: break; }
  }
  if (isP(a) && isP(b)) {
    if (op === '+') return add(a, b); if (op === '-') return sub(a, b);
    if (op === '*') return P(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x); // complex multiply
    if (op === '/') { const d = b.x * b.x + b.y * b.y; return P((a.x * b.x + a.y * b.y) / d, (a.y * b.x - a.x * b.y) / d); }
  }
  if (isP(a) && typeof b === 'number') { if (op === '*') return mul(a, b); if (op === '/') return mul(a, 1 / b); if (op === '^') { if (b === 2) return arith('*', a, a); } }
  if (typeof a === 'number' && isP(b) && op === '*') return mul(b, a);
  if (op === '*' && typeof a === 'number' && (b instanceof Path)) return applyT(new Transform(a, 0, 0, a, 0, 0), b);
  if (op === '+' && isP(a) && b instanceof Path) return applyT(new Transform(1, 0, 0, 1, a.x, a.y), b);
  if (op === '+' && a instanceof Path && isP(b)) return applyT(new Transform(1, 0, 0, 1, b.x, b.y), a);
  if (op === '^^' || op === '&') return new Path([...toPath(a).subs, ...toPath(b).subs]);
  if ((op === '*') && (typeof a === 'number' || a instanceof Transform) && (typeof b === 'string' || b instanceof Label)) return b;
  if (typeof a === 'boolean' || typeof b === 'boolean') return arith(op, Number(a), Number(b));
  throw new Error(`can't ${op} those`);
}
function mergePens(a, b) {
  const p = new Pen();
  for (const q of [a, b]) {
    if (!(q instanceof Pen)) continue;
    for (const k of ['color', 'width', 'dash', 'opacity']) if (q[k] != null) p[k] = q[k];
  }
  return p;
}
function compare(op, a, b) {
  if (a instanceof Pair && b instanceof Pair) { const eq = Math.abs(a.x - b.x) < 1e-9 && Math.abs(a.y - b.y) < 1e-9; return op === '==' ? eq : op === '!=' ? !eq : false; }
  switch (op) { case '<': return a < b; case '>': return a > b; case '<=': return a <= b; case '>=': return a >= b; case '==': return a === b; case '!=': return a !== b; default: return false; }
}

export function runAsy(code) {
  const ast = parse(code);
  const ops = [];
  let steps = 0;
  const g = new Env();
  const pen = (o) => new Pen(o);
  for (const [n, c] of Object.entries(COLORS)) g.def(n, pen({ color: c }));
  const dirs = { N: [0, 1], S: [0, -1], E: [1, 0], W: [-1, 0], NE: [1, 1], NW: [-1, 1], SE: [1, -1], SW: [-1, -1], up: [0, 1], down: [0, -1], left: [-1, 0], right: [1, 0], NNE: [0.38, 0.92], NNW: [-0.38, 0.92], SSE: [0.38, -0.92], SSW: [-0.38, -0.92], ENE: [0.92, 0.38], WNW: [-0.92, 0.38], ESE: [0.92, -0.38], WSW: [-0.92, -0.38] };
  for (const [n, [x, y]] of Object.entries(dirs)) { const l = Math.hypot(x, y); g.def(n, P(x / l, y / l)); }
  for (const [u, v] of Object.entries({ pt: 1, bp: 1, cm: 28.3465, mm: 2.83465, inch: 72, inches: 72 })) g.def(u, v);
  g.def('origin', P(0, 0)); g.def('pi', Math.PI); g.def('Center', P(0, 0)); g.def('I', P(0, 1));
  g.def('unitsquare', new Path([{ pts: [P(0, 0), P(1, 0), P(1, 1), P(0, 1)], closed: true }]));
  g.def('unitcircle', circlePath(P(0, 0), 1));
  g.def('dashed', pen({ dash: '6 4' })); g.def('dotted', pen({ dash: '1 3' })); g.def('longdashed', pen({ dash: '10 5' })); g.def('dashdotted', pen({ dash: '6 3 1 3' })); g.def('solid', pen({ dash: 'none' }));
  g.def('defaultpen', pen({})); g.def('currentpen', pen({}));
  for (const n of ['Arrow', 'EndArrow', 'Arrows', 'BeginArrow', 'MidArrow', 'ArcArrow', 'EndArcArrow', 'ArcArrows', 'BeginArcArrow']) {
    const where = /Arrows/.test(n) ? 'both' : /Begin/.test(n) ? 'begin' : /Mid/.test(n) ? 'mid' : 'end';
    g.def(n, new ArrowSpec(where));
  }
  for (const n of ['TeXHead', 'HookHead', 'SimpleHead', 'NoFill', 'Fill', 'FillDraw', 'UnFill', 'Draw', 'Bars', 'Bar', 'BeginBar', 'EndBar', 'NoMargin', 'Relative', 'CW', 'CCW', 'Ticks', 'LeftTicks', 'RightTicks', 'NoZero', 'Above', 'Below', 'RightSide', 'LeftSide', 'Center', 'Align', 'invisible']) if (!g.find(n)) g.def(n, null);
  g.def('CW', 'CW');
  g.def('pathpen', pen({})); g.def('pointpen', pen({})); g.def('pointfontpen', pen({})); g.def('markscalefactor', 0.03);

  const num = (v) => { if (typeof v === 'number') return v; if (typeof v === 'boolean') return Number(v); throw new Error('expected a number'); };
  const builtins = {
    dir: (a, b) => (a instanceof Pair ? mul(a, 1 / len(a)) : a instanceof Path ? P(1, 0) : dirOf(num(a))),
    expi: (t) => P(Math.cos(t), Math.sin(t)),
    sqrt: Math.sqrt, abs: (v) => (v instanceof Pair ? len(v) : Math.abs(v)), length: (v) => (v instanceof Pair ? len(v) : v instanceof Path ? Math.max(0, v.subs[0].pts.length - (v.subs[0].closed ? 0 : 1)) : Array.isArray(v) ? v.length : String(v).length),
    sin: Math.sin, cos: Math.cos, tan: Math.tan, asin: Math.asin, acos: Math.acos, atan: Math.atan, atan2: Math.atan2, exp: Math.exp, log: Math.log, log10: Math.log10, floor: Math.floor, ceil: Math.ceil, round: Math.round, sgn: Math.sign,
    Sin: (a) => Math.sin(a * deg), Cos: (a) => Math.cos(a * deg), Tan: (a) => Math.tan(a * deg), aSin: (x) => Math.asin(x) / deg, aCos: (x) => Math.acos(x) / deg, aTan: (x) => Math.atan(x) / deg,
    degrees: (v) => (v instanceof Pair ? (((Math.atan2(v.y, v.x) / deg) % 360) + 360) % 360 : v / deg), radians: (d) => d * deg, angle: (v) => Math.atan2(v.y, v.x),
    max: (...a) => Math.max(...a.flat()), min: (...a) => Math.min(...a.flat()), unit: (v) => mul(v, 1 / len(v)), conj: (v) => P(v.x, -v.y), xpart: (v) => v.x, ypart: (v) => v.y,
    string: (v) => (typeof v === 'number' ? String(Math.round(v * 1e6) / 1e6) : String(v)), format: (f, v) => String(typeof v === 'number' ? Math.round(v * 1e6) / 1e6 : v),
    interp: (a, b, t) => (a instanceof Pair ? add(a, mul(sub(b, a), t)) : a + (b - a) * t),
    midpoint: (p) => { const s = segPts(p)[0]; return mul(add(s[0], s[1]), 0.5); },
    point: (p, t) => pathPoint(p, num(t)), relpoint: (p, t) => pathPoint(p, num(t) * (toPath(p).subs[0].pts.length - 1)),
    extension, foot, intersectionpoint: (p, q) => { const r = intersections(p, q); if (!r.length) throw new Error('no intersection'); return r[0]; },
    intersectionpoints: (p, q) => intersections(p, q),
    IP: (p, q) => { const r = intersections(p, q); if (!r.length) throw new Error('no intersection'); return r[0]; },
    OP: (p, q) => { const r = intersections(p, q); if (!r.length) throw new Error('no intersection'); return r[r.length - 1]; },
    circumcenter, incenter, inradius, centroid: (A, B, C) => mul(add(add(A, B), C), 1 / 3),
    orthocenter: (A, B, C) => extension(A, foot(A, B, C), B, foot(B, A, C)),
    circumradius: (A, B, C) => len(sub(A, circumcenter(A, B, C))),
    circle: (c, r, B) => (r instanceof Pair ? circlePath(circumcenter(c, r, B), len(sub(c, circumcenter(c, r, B)))) : circlePath(c, num(r))),
    Circle: (c, r) => circlePath(c, num(r)), CR: (c, r) => circlePath(c, num(r)),
    circumcircle: (A, B, C) => circlePath(circumcenter(A, B, C), len(sub(A, circumcenter(A, B, C)))),
    incircle: (A, B, C) => circlePath(incenter(A, B, C), inradius(A, B, C)),
    ellipse: (c, a, b) => new Path([{ pts: circlePts(P(0, 0), 1).slice(0, -1).map((p) => P(c.x + p.x * a, c.y + p.y * b)), closed: true }]),
    arc: (c, a, b, d, dirFlag) => {
      if (a instanceof Pair) { // arc(c, z1, z2[, CW])
        const r = len(sub(a, c)); let a1 = Math.atan2(a.y - c.y, a.x - c.x) / deg; let a2 = Math.atan2(b.y - c.y, b.x - c.x) / deg;
        const cw = d === 'CW';
        if (!cw && a2 < a1) a2 += 360; if (cw && a2 > a1) a2 -= 360;
        return new Path([{ pts: circlePts(c, r, a1, a2), closed: false }]);
      }
      let a1 = num(b); let a2 = num(d);
      if (dirFlag === 'CW' && a2 > a1) a2 -= 360;
      return new Path([{ pts: circlePts(c, num(a), a1, a2), closed: false }]);
    },
    Arc: (c, r, a1, a2) => new Path([{ pts: circlePts(c, num(r), num(a1), num(a2)), closed: false }]),
    rightanglemark: (A, B, C, s) => {
      const k = Math.min(len(sub(A, B)), len(sub(C, B))) * 0.14;
      const u = mul(builtins.unit(sub(A, B)), k); const v = mul(builtins.unit(sub(C, B)), k);
      return new Path([{ pts: [add(B, u), add(add(B, u), v), add(B, v)], closed: false }]);
    },
    anglemark: (A, B, C, r) => {
      const rad = r ? num(r) / 40 * Math.min(len(sub(A, B)), len(sub(C, B))) : 0.18 * Math.min(len(sub(A, B)), len(sub(C, B)));
      let a1 = Math.atan2(A.y - B.y, A.x - B.x) / deg; let a2 = Math.atan2(C.y - B.y, C.x - B.x) / deg;
      if (a2 < a1) a2 += 360;
      if (a2 - a1 > 180) { const t = a1; a1 = a2 - 360; a2 = t; }
      return new Path([{ pts: circlePts(B, rad, a1, a2), closed: false }]);
    },
    markangle: () => null,
    shift: (a, b) => (a instanceof Pair ? new Transform(1, 0, 0, 1, a.x, a.y) : new Transform(1, 0, 0, 1, num(a), num(b ?? 0))),
    scale: (a, b) => (b == null ? new Transform(num(a), 0, 0, num(a), 0, 0) : new Transform(num(a), 0, 0, num(b), 0, 0)),
    xscale: (a) => new Transform(num(a), 0, 0, 1, 0, 0), yscale: (a) => new Transform(1, 0, 0, num(a), 0, 0),
    rotate: (a, c) => rotT(num(a), c instanceof Pair ? c : P(0, 0)),
    reflect: (A, B) => { const d = builtins.unit(sub(B, A)); const c2 = d.x * d.x - d.y * d.y; const s2 = 2 * d.x * d.y; const t = new Transform(c2, s2, s2, -c2, 0, 0); const o = applyT(t, A); return new Transform(c2, s2, s2, -c2, A.x - o.x, A.y - o.y); },
    slant: (s) => new Transform(1, num(s), 0, 1, 0, 0),
    linewidth: (w) => pen({ width: num(w) }), fontsize: () => pen({}), font: () => pen({}), opacity: (o) => pen({ opacity: num(o) }), fontcommand: () => pen({}),
    rgb: (r, g2, b) => { const f = (x) => Math.round(Math.max(0, Math.min(1, num(x) > 1 ? num(x) / 255 : num(x))) * 255); return pen({ color: `rgb(${f(r)},${f(g2)},${f(b)})` }); },
    RGB: (r, g2, b) => pen({ color: `rgb(${num(r)},${num(g2)},${num(b)})` }),
    gray: (x) => (x == null ? pen({ color: '#808080' }) : pen({ color: `rgb(${Math.round(num(x) * 255)},${Math.round(num(x) * 255)},${Math.round(num(x) * 255)})` })),
    grey: (x) => builtins.gray(x), cmyk: () => pen({ color: '#808080' }), linetype: (s) => pen({ dash: String(s).trim() || 'none' }),
    Label: (s, pos, align) => new Label(s, pos instanceof Pair ? pos : null, align instanceof Pair ? align : null),
    size: () => null, unitsize: () => null, defaultpen: (p) => { if (p instanceof Pen) g.set('currentpen', mergePens(g.get('currentpen'), p)); return null; },
    real: (x) => num(x), int: (x) => Math.trunc(num(x)),
    add: () => null, clip: () => null, erase: () => null, picture: () => null, xlimits: () => null, ylimits: () => null, crop: () => null, layer: () => null, shipout: () => null,
    graph: (f, a, b, n) => {
      const steps2 = n ? num(n) : 80; const pts = [];
      for (let i = 0; i <= steps2; i++) { const x = num(a) + ((num(b) - num(a)) * i) / steps2; const y = callFn(f, [x]); if (Number.isFinite(y)) pts.push(P(x, y)); }
      return new Path([{ pts, closed: false }]);
    },
    polygon: (n) => new Path([{ pts: Array.from({ length: num(n) }, (_, i) => dirOf(90 + (360 * i) / num(n))), closed: true }]),
    box: (a, b) => new Path([{ pts: [a, P(b.x, a.y), b, P(a.x, b.y)], closed: true }]),
    reverse: (p) => (Array.isArray(p) ? [...p].reverse() : new Path(toPath(p).subs.map((s) => ({ pts: [...s.pts].reverse(), closed: s.closed })))),
    subpath: (p, a, b) => { const s = toPath(p).subs[0]; const pts = s.closed ? [...s.pts, s.pts[0]] : s.pts; return new Path([{ pts: pts.slice(Math.round(num(a)), Math.round(num(b)) + 1), closed: false }]); },
    // drawing
    draw: (...args) => { drawOp('draw', args); return null; },
    fill: (...args) => { drawOp('fill', args); return null; },
    filldraw: (...args) => { drawOp('filldraw', args); return null; },
    unfill: () => null,
    dot: (...args) => {
      if (args.length === 2 && args[0] instanceof Pair && args[1] instanceof Pair) return args[0].x * args[1].x + args[0].y * args[1].y;
      let s = null; let pos = null; let align = null; let p = null;
      for (const a of args) {
        if (typeof a === 'string' || a instanceof Label) { if (s == null) s = a instanceof Label ? a.s : a; }
        else if (a instanceof Pair) { if (!pos) pos = a; else align = a; }
        else if (a instanceof Path) { a.subs.forEach((sp) => sp.pts.forEach((pt) => ops.push({ op: 'dot', pt, pen: p }))); }
        else if (Array.isArray(a)) a.forEach((pt) => pt instanceof Pair && ops.push({ op: 'dot', pt, pen: p }));
        else if (a instanceof Pen) p = a;
      }
      if (pos) { ops.push({ op: 'dot', pt: pos, pen: p }); if (s) ops.push({ op: 'label', s, pos, align: align || P(0, 0), pen: p }); }
      return null;
    },
    label: (...args) => {
      let s = null; let pos = null; let align = null; let p = null;
      for (const a of args) {
        if (typeof a === 'string') { if (s == null) s = a; }
        else if (a instanceof Label) { s = a.s; pos = pos || a.pos; align = align || a.align; }
        else if (a instanceof Pair) { if (!pos) pos = a; else if (!align) align = a; }
        else if (a instanceof Path) { if (!pos) { const pts = a.subs[0].pts; pos = mul(add(pts[0], pts[pts.length - 1]), 0.5); } }
        else if (a instanceof Pen) p = a;
      }
      if (s != null) ops.push({ op: 'label', s: String(s), pos: pos || P(0, 0), align: align || P(0, 0), pen: p });
      return null;
    },
    MP: (s, pos, align) => { ops.push({ op: 'label', s: String(s), pos, align: align instanceof Pair ? align : P(0, 0) }); return pos; },
    D: (x, p) => { if (x instanceof Path) drawOp('draw', [x, p]); else if (x instanceof Pair) ops.push({ op: 'dot', pt: x }); return x; },
    xaxis: (...args) => { axisOp('x', args); return null; }, yaxis: (...args) => { axisOp('y', args); return null; }, axes: (...args) => { axisOp('x', args); axisOp('y', args); return null; },
    xequals: () => null, yequals: () => null,
    write: () => null, assert: () => null, sequence: (n) => Array.from({ length: num(n) }, (_, i) => i),
  };
  for (const [n, f] of Object.entries(builtins)) if (typeof f === 'function') g.def(n, f);

  function drawOp(kind, args) {
    let path = null; let p1 = null; let p2 = null; let arrow = null; let lab = null;
    for (const a of args) {
      if (a instanceof Path || (a instanceof Pair && !path)) { if (!path) path = toPath(a); }
      else if (Array.isArray(a)) a.forEach((x) => x instanceof Path && drawOp(kind, [x, ...args.filter((y) => !Array.isArray(y))]));
      else if (a instanceof Pen) { if (!p1) p1 = a; else p2 = a; }
      else if (a instanceof ArrowSpec) arrow = a.where;
      else if (typeof a === 'string' || a instanceof Label) lab = a;
    }
    if (!path) return;
    const cur = g.get('currentpen');
    if (kind === 'filldraw') ops.push({ op: 'fill', path, pen: mergePens(cur, p1 || pen({ color: '#d4d4d4' })) }, { op: 'draw', path, pen: mergePens(cur, p2 || pen({})) });
    else ops.push({ op: kind, path, pen: mergePens(cur, p1 || pen({})), arrow });
    if (lab && kind === 'draw') { const pts = path.subs[0].pts; ops.push({ op: 'label', s: lab instanceof Label ? lab.s : lab, pos: mul(add(pts[0], pts[pts.length - 1]), 0.5), align: lab instanceof Label && lab.align ? lab.align : P(0, 0) }); }
  }
  const axes = [];
  function axisOp(which, args) {
    let s = null; const nums = [];
    for (const a of args) { if (typeof a === 'string') s = a; else if (typeof a === 'number') nums.push(a); }
    axes.push({ which, s, from: nums[0], to: nums[1] });
  }

  function callFn(f, args) {
    if (typeof f === 'function') return f(...args);
    if (f instanceof Fn) {
      const env = new Env(f.env);
      f.params.forEach((pp, i) => env.def(pp.name, i < args.length ? args[i] : pp.def ? ev(pp.def, f.env) : null));
      const r = exec(f.body, env);
      return r instanceof Return ? r.v : null;
    }
    if (f instanceof Pen && args.length === 0) return f;
    throw new Error('not a function');
  }
  function lvalue(node, env, val) {
    if (node.k === 'id') { env.set(node.v, val); return; }
    if (node.k === 'index') { const arr = ev(node.e, env); arr[num(ev(node.i, env))] = val; return; }
    if (node.k === 'member') { const obj = ev(node.e, env); if (obj instanceof Pair) { obj[node.name] = val; return; } }
    throw new Error('bad assignment');
  }
  function ev(n, env) {
    if (++steps > 300000) throw new Error('too much work');
    switch (n.k) {
      case 'num': return n.v;
      case 'str': return n.v;
      case 'id': {
        const e = env.find(n.v);
        if (!e) throw new Error(`unknown name ${n.v}`);
        return e.vars.get(n.v);
      }
      case 'pair': return P(num(ev(n.a, env)), num(ev(n.b, env)));
      case 'array': return n.items.map((x) => ev(x, env));
      case 'neg': { const v = ev(n.e, env); return v instanceof Pair ? P(-v.x, -v.y) : -num(v); }
      case 'not': return !ev(n.e, env);
      case 'cond': return ev(n.c, env) ? ev(n.a, env) : ev(n.b, env);
      case 'bin': {
        if (n.op === '&&') return ev(n.l, env) && ev(n.r, env);
        if (n.op === '||') return ev(n.l, env) || ev(n.r, env);
        const a = ev(n.l, env); const b = ev(n.r, env);
        if (['<', '>', '<=', '>=', '==', '!='].includes(n.op)) return compare(n.op, a, b);
        return arith(n.op, a, b);
      }
      case 'assign': {
        let v = ev(n.right, env);
        if (n.op !== '=') v = arith(n.op[0], ev(n.left, env), v);
        lvalue(n.left, env, v); return v;
      }
      case 'preinc': case 'postinc': {
        const old = ev(n.e, env); const nv = old + (n.op === '++' ? 1 : -1); lvalue(n.e, env, nv); return n.k === 'preinc' ? nv : old;
      }
      case 'index': { const a = ev(n.e, env); const i = num(ev(n.i, env)); if (a == null) throw new Error('bad index'); return a[i < 0 ? a.length + i : i]; }
      case 'member': {
        const obj = ev(n.e, env);
        if (obj instanceof Pair) { if (n.name === 'x') return obj.x; if (n.name === 'y') return obj.y; }
        if (Array.isArray(obj)) {
          if (n.name === 'length') return obj.length;
          if (n.name === 'push') return (v) => { obj.push(v); return v; };
          if (n.name === 'pop') return () => obj.pop();
          if (n.name === 'cyclic') return () => null;
        }
        throw new Error(`unknown member ${n.name}`);
      }
      case 'call': {
        const f = ev(n.f, env);
        const args = n.args.map((x) => ev(x, env));
        return callFn(f, args);
      }
      case 'path': return buildPath(n, env);
      case 'cycle': return CYCLE;
      default: throw new Error(`can't evaluate ${n.k}`);
    }
  }
  function buildPath(n, env) {
    const subs = [];
    let cur = []; // [{ pt, j }] where j is the join leading into this point
    let closed = false; let cycleJoin = '--';
    const flush = () => {
      if (!cur.length) { closed = false; return; }
      const pts = cur.map((c) => c.pt); const js = cur.map((c) => c.j);
      let out;
      if (!js.some((x) => x === '..') && cycleJoin !== '..') out = pts;
      else if (closed && js.slice(1).every((x) => x === '..') && cycleJoin === '..') out = catmull(pts, true);
      else {
        out = [pts[0]];
        let i = 0;
        while (i < pts.length - 1) {
          if (js[i + 1] === '..') {
            let j = i + 1; while (j + 1 < pts.length && js[j + 1] === '..') j++;
            out = out.concat(catmull(pts.slice(i, j + 1), false).slice(1));
            i = j;
          } else { out.push(pts[i + 1]); i++; }
        }
      }
      subs.push({ pts: out, closed });
      cur = []; closed = false; cycleJoin = '--';
    };
    const addNode = (v, j) => {
      if (v === CYCLE) { closed = true; cycleJoin = j || '--'; return; }
      if (v instanceof Pair) { cur.push({ pt: v, j }); return; }
      if (v instanceof Path) {
        v.subs.forEach((sp, si) => {
          if (si > 0) flush();
          sp.pts.forEach((pt, i) => cur.push({ pt, j: i === 0 ? (si === 0 ? j : null) : '--' }));
          if (sp.closed) { closed = true; flush(); }
        });
        return;
      }
      if (v == null) return;
      throw new Error('bad path node');
    };
    addNode(ev(n.nodes[0], env), null);
    for (let i = 0; i < n.joins.length; i++) {
      const j = n.joins[i];
      const v = ev(n.nodes[i + 1], env);
      if (j === '^^' || j === '&') { flush(); addNode(v, null); continue; }
      if (typeof j === 'object' && j.controls) {
        const a = cur[cur.length - 1].pt; const b = v instanceof Pair ? v : toPath(v).subs[0].pts[0];
        bezier(a, ev(j.controls[0], env), ev(j.controls[1], env), b).forEach((pt) => cur.push({ pt, j: '--' }));
        continue;
      }
      addNode(v, j === '..' ? '..' : '--');
    }
    flush();
    return new Path(subs.filter((sp) => sp.pts.length));
  }
  function exec(n, env) {
    if (++steps > 300000) throw new Error('too much work');
    switch (n.k) {
      case 'nop': return null;
      case 'block': {
        for (const s of n.body) { const r = exec(s, env); if (r) return r; }
        return null;
      }
      case 'expr': ev(n.e, env); return null;
      case 'decl': {
        for (const it of n.items) {
          let v = it.init ? ev(it.init, env) : n.isArray ? [] : null;
          if (v === null && !it.init) v = n.isArray ? [] : 0;
          env.def(it.name, v);
        }
        return null;
      }
      case 'fndef': env.def(n.name, new Fn(n.params, n.body, env)); return null;
      case 'if': return ev(n.c, env) ? exec(n.a, env) : n.b ? exec(n.b, env) : null;
      case 'while': {
        while (ev(n.c, env)) { const r = exec(n.body, env); if (r === BREAK) break; if (r instanceof Return) return r; }
        return null;
      }
      case 'for': {
        const local = new Env(env);
        if (n.init) { if (n.init.k === 'decl') exec(n.init, local); else ev(n.init, local); }
        while (!n.c || ev(n.c, local)) {
          const r = exec(n.body, new Env(local));
          if (r === BREAK) break; if (r instanceof Return) return r;
          if (n.step) ev(n.step, local);
        }
        return null;
      }
      case 'foreach': {
        for (const v of ev(n.arr, env)) { const local = new Env(env); local.def(n.name, v); const r = exec(n.body, local); if (r === BREAK) break; if (r instanceof Return) return r; }
        return null;
      }
      case 'return': return new Return(n.e ? ev(n.e, env) : null);
      case 'break': return BREAK;
      case 'continue': return CONTINUE;
      default: throw new Error(`can't run ${n.k}`);
    }
  }
  exec(ast, g);
  return { ops, axes };
}

// ------------------------------------------------------------------ SVG output
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Returns an element containing the drawing, with labels typeset by renderLabel(texOrText) → HTML.
export function asyToElement(code, renderLabel) {
  const { ops, axes } = runAsy(code);
  const shapes = ops.filter((o) => o.op !== 'label');
  if (!shapes.length && !ops.length) throw new Error('nothing drawn');
  let minX = Infinity; let minY = Infinity; let maxX = -Infinity; let maxY = -Infinity;
  const grow = (p) => { if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) return; minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); };
  for (const o of ops) {
    if (o.path) o.path.subs.forEach((s) => s.pts.forEach(grow));
    if (o.pt) grow(o.pt);
    if (o.op === 'label') grow(o.pos);
  }
  if (!Number.isFinite(minX)) throw new Error('empty drawing');
  for (const a of axes) {
    if (a.which === 'x') { if (a.from != null) grow(P(a.from, 0)); if (a.to != null) grow(P(a.to, 0)); }
    else { if (a.from != null) grow(P(0, a.from)); if (a.to != null) grow(P(0, a.to)); }
  }
  let W = maxX - minX; let H = maxY - minY;
  const span = Math.max(W, H) || 1;
  if (W < span * 0.05) { minX -= span * 0.1; maxX += span * 0.1; W = maxX - minX; }
  if (H < span * 0.05) { minY -= span * 0.1; maxY += span * 0.1; H = maxY - minY; }
  const hasLabels = ops.some((o) => o.op === 'label');
  const pad = span * (hasLabels ? 0.13 : 0.05);
  minX -= pad; minY -= pad; maxX += pad; maxY += pad; W = maxX - minX; H = maxY - minY;
  const X = (x) => (x - minX).toFixed(4);
  const Y = (y) => (maxY - y).toFixed(4);
  const dotR = Math.max(W, H) * 0.011;
  const strokeW = (p) => (p?.width != null ? Math.max(0.6, 0.9 + p.width * 0.75) : 1.4);
  const col = (p, d = '#111') => (p?.color && p.color !== 'none' ? p.color : p?.color === 'none' ? 'none' : d);
  const pathD = (path) => path.subs.map((s) => s.pts.map((p, i) => `${i ? 'L' : 'M'}${X(p.x)} ${Y(p.y)}`).join('') + (s.closed ? 'Z' : '')).join('');
  const parts = [];
  let markers = false;
  for (const o of ops) {
    if (o.op === 'fill') parts.push(`<path d="${pathD(o.path)}" fill="${col(o.pen, '#111')}" fill-rule="evenodd" stroke="none"${o.pen?.opacity != null ? ` fill-opacity="${o.pen.opacity}"` : ''}/>`);
    else if (o.op === 'draw') {
      const isDot = o.path.subs.length === 1 && o.path.subs[0].pts.length === 1;
      if (isDot) { const p = o.path.subs[0].pts[0]; parts.push(`<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="${dotR}" fill="${col(o.pen)}"/>`); continue; }
      const dash = o.pen?.dash && o.pen.dash !== 'none' ? ` stroke-dasharray="${o.pen.dash.split(/\s+/).map((v) => Number(v) * 1.2).join(' ')}"` : '';
      let mk = '';
      if (o.arrow) { markers = true; if (o.arrow === 'end' || o.arrow === 'both') mk += ' marker-end="url(#ah)"'; if (o.arrow === 'begin' || o.arrow === 'both') mk += ' marker-start="url(#ahs)"'; }
      parts.push(`<path d="${pathD(o.path)}" fill="none" stroke="${col(o.pen)}" stroke-width="${strokeW(o.pen)}" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"${dash}${mk}${o.pen?.opacity != null ? ` stroke-opacity="${o.pen.opacity}"` : ''}/>`);
    } else if (o.op === 'dot') parts.push(`<circle cx="${X(o.pt.x)}" cy="${Y(o.pt.y)}" r="${dotR}" fill="${col(o.pen)}"/>`);
  }
  for (const a of axes) {
    markers = true;
    if (a.which === 'x') parts.push(`<path d="M${X(a.from ?? minX + pad * 0.5)} ${Y(0)}L${X(a.to ?? maxX - pad * 0.5)} ${Y(0)}" stroke="#111" stroke-width="1.2" vector-effect="non-scaling-stroke" marker-end="url(#ah)"/>`);
    else parts.push(`<path d="M${X(0)} ${Y(a.from ?? minY + pad * 0.5)}L${X(0)} ${Y(a.to ?? maxY - pad * 0.5)}" stroke="#111" stroke-width="1.2" vector-effect="non-scaling-stroke" marker-end="url(#ah)"/>`);
  }
  const defs = markers ? '<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L10 5L0 10z" fill="#111"/></marker><marker id="ahs" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="7" markerHeight="7" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#111"/></marker></defs>' : '';
  // Marker sizes are in user units; scale them to the drawing.
  const mscale = (Math.max(W, H) / 40).toFixed(4);
  const svg = `<svg viewBox="0 0 ${W.toFixed(4)} ${H.toFixed(4)}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">${defs.replace(/markerWidth="7" markerHeight="7"/g, `markerWidth="${mscale}" markerHeight="${mscale}"`)}${parts.join('')}</svg>`;
  const wrap = document.createElement('div');
  wrap.className = 'asy-fig';
  const aspect = H / W;
  wrap.style.setProperty('--aspect', String(aspect));
  wrap.innerHTML = svg;
  for (const o of ops) {
    if (o.op !== 'label') continue;
    const el = document.createElement('span');
    el.className = 'asy-label';
    el.innerHTML = renderLabel(o.s);
    const a = o.align || P(0, 0);
    const l = len(a) || 1;
    const ux = a.x / l * (len(a) ? 1 : 0); const uy = a.y / l * (len(a) ? 1 : 0);
    el.style.left = `${((o.pos.x - minX) / W) * 100}%`;
    el.style.top = `${((maxY - o.pos.y) / H) * 100}%`;
    const extra = 4 + Math.max(0, Math.min(4, len(a)) - 1) * 7; // longer align vectors push the label further out
    el.style.transform = `translate(calc(-50% + ${(ux * 50).toFixed(1)}% + ${(ux * extra).toFixed(1)}px), calc(-50% - ${(uy * 50).toFixed(1)}% - ${(uy * extra).toFixed(1)}px))`;
    if (o.pen?.color && o.pen.color !== 'none') el.style.color = o.pen.color;
    wrap.appendChild(el);
  }
  return wrap;
}
