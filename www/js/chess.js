// A small, complete chess engine: legal moves (castling, en passant, promotion), check/mate/stalemate,
// and an alpha-beta search for the computer opponent. Board: 64 chars, index = row*8 + col, row 0 = black's back rank.

const isW = (p) => p >= 'A' && p <= 'Z';
const KN = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
const KG = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const DI = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
const OR = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const QD = DI.concat(OR);

export function initial() {
  return {
    b: [...'rnbqkbnrpppppppp', ...'.'.repeat(32), ...'PPPPPPPPRNBQKBNR'],
    w: true, castle: { K: true, Q: true, k: true, q: true }, ep: -1, half: 0,
  };
}

// Is square sq attacked by the given side?
export function attacked(b, sq, byWhite) {
  const r = sq >> 3; const c = sq & 7;
  const at = (rr, cc) => (rr < 0 || rr > 7 || cc < 0 || cc > 7 ? null : b[rr * 8 + cc]);
  const pr = byWhite ? r + 1 : r - 1; const pawn = byWhite ? 'P' : 'p';
  if (at(pr, c - 1) === pawn || at(pr, c + 1) === pawn) return true;
  const kn = byWhite ? 'N' : 'n'; const kg = byWhite ? 'K' : 'k';
  for (const [dr, dc] of KN) if (at(r + dr, c + dc) === kn) return true;
  for (const [dr, dc] of KG) if (at(r + dr, c + dc) === kg) return true;
  const slide = (dirs, a, q) => {
    for (const [dr, dc] of dirs) {
      let rr = r + dr; let cc = c + dc;
      while (rr >= 0 && rr < 8 && cc >= 0 && cc < 8) {
        const p = b[rr * 8 + cc];
        if (p !== '.') { if (p === a || p === q) return true; break; }
        rr += dr; cc += dc;
      }
    }
    return false;
  };
  const Q = byWhite ? 'Q' : 'q';
  return slide(DI, byWhite ? 'B' : 'b', Q) || slide(OR, byWhite ? 'R' : 'r', Q);
}

function pseudo(s) {
  const out = []; const { b, w } = s;
  for (let i = 0; i < 64; i++) {
    const p = b[i];
    if (p === '.' || isW(p) !== w) continue;
    const r = i >> 3; const c = i & 7; const t = p.toLowerCase();
    const add = (to, extra) => out.push({ from: i, to, p, cap: b[to], ...extra });
    if (t === 'p') {
      const d = w ? -1 : 1; const r2 = r + d;
      if (r2 < 0 || r2 > 7) continue;
      const promo = r2 === 0 || r2 === 7 ? { promo: w ? 'Q' : 'q' } : {};
      if (b[r2 * 8 + c] === '.') {
        add(r2 * 8 + c, promo);
        if (r === (w ? 6 : 1) && b[(r + 2 * d) * 8 + c] === '.') add((r + 2 * d) * 8 + c, { dbl: true });
      }
      for (const dc of [-1, 1]) {
        const c2 = c + dc; if (c2 < 0 || c2 > 7) continue;
        const to = r2 * 8 + c2; const q = b[to];
        if (q !== '.' && isW(q) !== w) add(to, promo);
        else if (to === s.ep) add(to, { epCap: r * 8 + c2, cap: w ? 'p' : 'P' });
      }
    } else if (t === 'n' || t === 'k') {
      for (const [dr, dc] of t === 'n' ? KN : KG) {
        const r2 = r + dr; const c2 = c + dc;
        if (r2 < 0 || r2 > 7 || c2 < 0 || c2 > 7) continue;
        const q = b[r2 * 8 + c2];
        if (q === '.' || isW(q) !== w) add(r2 * 8 + c2);
      }
      if (t === 'k') {
        const home = w ? 60 : 4; const opp = !w;
        if (i === home && !attacked(b, home, opp)) {
          const [K, Q, R] = w ? ['K', 'Q', 'R'] : ['k', 'q', 'r'];
          if (s.castle[K] && b[home + 1] === '.' && b[home + 2] === '.' && b[home + 3] === R && !attacked(b, home + 1, opp) && !attacked(b, home + 2, opp)) add(home + 2, { castle: 'K' });
          if (s.castle[Q] && b[home - 1] === '.' && b[home - 2] === '.' && b[home - 3] === '.' && b[home - 4] === R && !attacked(b, home - 1, opp) && !attacked(b, home - 2, opp)) add(home - 2, { castle: 'Q' });
        }
      }
    } else {
      for (const [dr, dc] of t === 'b' ? DI : t === 'r' ? OR : QD) {
        let r2 = r + dr; let c2 = c + dc;
        while (r2 >= 0 && r2 < 8 && c2 >= 0 && c2 < 8) {
          const q = b[r2 * 8 + c2];
          if (q === '.') add(r2 * 8 + c2);
          else { if (isW(q) !== w) add(r2 * 8 + c2); break; }
          r2 += dr; c2 += dc;
        }
      }
    }
  }
  return out;
}

export function make(s, m) {
  const b = s.b.slice();
  const castle = { ...s.castle };
  b[m.to] = m.promo || m.p; b[m.from] = '.';
  if (m.epCap != null) b[m.epCap] = '.';
  if (m.castle) {
    const home = s.w ? 60 : 4;
    if (m.castle === 'K') { b[home + 1] = b[home + 3]; b[home + 3] = '.'; } else { b[home - 1] = b[home - 4]; b[home - 4] = '.'; }
  }
  if (m.p === 'K') castle.K = castle.Q = false;
  if (m.p === 'k') castle.k = castle.q = false;
  for (const sq of [m.from, m.to]) {
    if (sq === 63) castle.K = false; if (sq === 56) castle.Q = false;
    if (sq === 7) castle.k = false; if (sq === 0) castle.q = false;
  }
  return { b, w: !s.w, castle, ep: m.dbl ? (m.from + m.to) / 2 : -1, half: m.cap !== '.' || m.p.toLowerCase() === 'p' ? 0 : s.half + 1 };
}

export function legal(s) {
  const king = s.w ? 'K' : 'k';
  return pseudo(s).filter((m) => { const n = make(s, m); return !attacked(n.b, n.b.indexOf(king), !s.w); });
}
export const inCheck = (s) => attacked(s.b, s.b.indexOf(s.w ? 'K' : 'k'), !s.w);

// 'mate' | 'stalemate' | 'draw' | null
export function status(s) {
  if (!legal(s).length) return inCheck(s) ? 'mate' : 'stalemate';
  if (s.half >= 100) return 'draw';
  const left = s.b.filter((p) => p !== '.' && p !== 'K' && p !== 'k');
  if (!left.length || (left.length === 1 && 'NBnb'.includes(left[0]))) return 'draw';
  return null;
}

// ------------------------------------------------------------------ evaluation & search
const VAL = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
const center = (i) => { const r = i >> 3; const c = i & 7; return 3.5 - Math.max(Math.abs(r - 3.5), Math.abs(c - 3.5)); }; // 0 edge .. 3 centre
function evaluate(s) {
  let score = 0; let pieces = 0;
  for (let i = 0; i < 64; i++) if (s.b[i] !== '.' && 'pk'.indexOf(s.b[i].toLowerCase()) < 0) pieces++;
  const endgame = pieces <= 6;
  for (let i = 0; i < 64; i++) {
    const p = s.b[i]; if (p === '.') continue;
    const t = p.toLowerCase(); const white = isW(p); const r = i >> 3;
    let v = VAL[t];
    if (t === 'n') v += center(i) * 10;
    else if (t === 'b') v += center(i) * 5;
    else if (t === 'q') v += center(i) * 2;
    else if (t === 'p') { const adv = white ? 6 - r : r - 1; v += adv * (endgame ? 12 : 5) + ((i & 7) >= 2 && (i & 7) <= 5 ? adv * 3 : 0); }
    else if (t === 'k') v += endgame ? center(i) * 10 : (white ? (r === 7 ? 15 : -10 * (7 - r)) : (r === 0 ? 15 : -10 * r)) + ((i & 7) === 4 ? -10 : 0);
    score += white ? v : -v;
  }
  return s.w ? score : -score;
}
const order = (moves) => moves.sort((a, b) => (b.cap !== '.' ? VAL[b.cap.toLowerCase()] * 10 - VAL[b.p.toLowerCase()] : 0) + (b.promo ? 800 : 0) - ((a.cap !== '.' ? VAL[a.cap.toLowerCase()] * 10 - VAL[a.p.toLowerCase()] : 0) + (a.promo ? 800 : 0)));

let nodes = 0;
function quiesce(s, alpha, beta, depth) {
  nodes++;
  const stand = evaluate(s);
  if (depth === 0 || stand >= beta) return stand;
  if (stand > alpha) alpha = stand;
  for (const m of order(legal(s).filter((x) => x.cap !== '.' || x.promo))) {
    const v = -quiesce(make(s, m), -beta, -alpha, depth - 1);
    if (v >= beta) return v;
    if (v > alpha) alpha = v;
  }
  return alpha;
}
function negamax(s, depth, alpha, beta, ply) {
  nodes++;
  const moves = legal(s);
  if (!moves.length) return inCheck(s) ? -100000 + ply : 0;
  if (s.half >= 100) return 0;
  if (depth === 0) return quiesce(s, alpha, beta, 4);
  let best = -Infinity;
  for (const m of order(moves)) {
    const v = -negamax(make(s, m), depth - 1, -beta, -alpha, ply + 1);
    if (v > best) best = v;
    if (v > alpha) alpha = v;
    if (alpha >= beta) break;
  }
  return best;
}
// Pick a move. noise (centipawns) makes weaker levels make human-looking mistakes.
export function bestMove(s, depth = 2, noise = 0) {
  nodes = 0;
  const moves = order(legal(s));
  if (!moves.length) return null;
  let best = null; let bestV = -Infinity;
  for (const m of moves) {
    let v = -negamax(make(s, m), depth - 1, -Infinity, Infinity, 1);
    if (noise) v += (Math.random() * 2 - 1) * noise;
    if (v > bestV) { bestV = v; best = m; }
  }
  return best;
}
export const LEVELS = [
  { name: 'Beginner', depth: 1, noise: 220, xp: 25 },
  { name: 'Casual', depth: 1, noise: 60, xp: 40 },
  { name: 'Club', depth: 2, noise: 25, xp: 70 },
  { name: 'Strong', depth: 3, noise: 0, xp: 120 },
];
const FILES = 'abcdefgh';
export const sqName = (i) => `${FILES[i & 7]}${8 - (i >> 3)}`;
export function san(s, m) {
  if (m.castle) return m.castle === 'K' ? 'O-O' : 'O-O-O';
  const t = m.p.toUpperCase();
  const capture = m.cap !== '.';
  let str = t === 'P' ? (capture ? FILES[m.from & 7] : '') : t;
  if (t !== 'P') {
    const others = legal(s).filter((x) => x.p === m.p && x.to === m.to && x.from !== m.from);
    if (others.length) str += others.some((x) => (x.from & 7) === (m.from & 7)) ? 8 - (m.from >> 3) : FILES[m.from & 7];
  }
  str += (capture ? 'x' : '') + sqName(m.to) + (m.promo ? '=Q' : '');
  const n = make(s, m);
  if (inCheck(n)) str += legal(n).length ? '+' : '#';
  return str;
}

// ------------------------------------------------------------------ puzzles (FEN positions, UCI moves)
export function fromFEN(fen) {
  const [pos, side, cas = '-', ep = '-', half = '0'] = fen.trim().split(/\s+/);
  const b = [];
  for (const ch of pos.replace(/\//g, '')) { if (/\d/.test(ch)) b.push(...'.'.repeat(+ch)); else b.push(ch); }
  return {
    b, w: side === 'w',
    castle: { K: cas.includes('K'), Q: cas.includes('Q'), k: cas.includes('k'), q: cas.includes('q') },
    ep: ep === '-' ? -1 : (8 - Number(ep[1])) * 8 + FILES.indexOf(ep[0]),
    half: Number(half) || 0,
  };
}
const sqIndex = (name) => (8 - Number(name[1])) * 8 + FILES.indexOf(name[0]);
export const uciOf = (m) => `${sqName(m.from)}${sqName(m.to)}${m.promo && m.promo.toLowerCase() !== 'q' ? m.promo.toLowerCase() : ''}`;
// The legal move matching a UCI string like "e7e8n" (null if illegal).
export function moveFromUci(s, uci) {
  const from = sqIndex(uci.slice(0, 2)); const to = sqIndex(uci.slice(2, 4)); const pr = uci[4];
  const m = legal(s).find((x) => x.from === from && x.to === to);
  if (!m) return null;
  return pr && m.promo ? { ...m, promo: s.w ? pr.toUpperCase() : pr.toLowerCase() } : m;
}
