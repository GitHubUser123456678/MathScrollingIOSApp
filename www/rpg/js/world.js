// The Numeria overworld: zone maps (seeded, so identical for every player), rendering, movement,
// tap-to-move pathfinding, NPCs, roaming monsters, exits and waystones.
import { ZONES, MONSTERS, NPCS, CLASSES } from './data.js';

export const TS = 36; // tile size in CSS pixels
const T = { GRASS: 0, OBST: 1, PATH: 2, DECO: 3, WATER: 4, FLOOR: 5, HOUSE: 6, DOOR: 7 };
const SOLID = new Set([T.OBST, T.WATER, T.HOUSE, T.DOOR]);

const THEMES = {
  town: { ground: '#69b35a', ground2: '#5fa851', path: '#dcc690', obst: 'tree', tree: '#2f7d3a', deco: '🌼', floor: '#b8b2a7' },
  meadow: { ground: '#78be5a', ground2: '#6db151', path: '#e0cb8f', obst: 'tree', tree: '#3b8b3e', deco: '🌼', p: 0.34, water: true },
  forest: { ground: '#3f8b47', ground2: '#367e3e', path: '#b99a62', obst: 'tree', tree: '#1f5e2c', deco: '🍄', p: 0.46 },
  mountain: { ground: '#9aa87a', ground2: '#8e9c6f', path: '#cdbf98', obst: 'rock', rock: '#7d7f86', deco: '🪨', p: 0.42 },
  marsh: { ground: '#5d7d4c', ground2: '#557345', path: '#a99567', obst: 'bog', bog: '#3c6a6e', deco: '🌾', p: 0.43 },
  canyon: { ground: '#d9a467', ground2: '#cf9a5d', path: '#ecc690', obst: 'mesa', mesa: '#a5552f', deco: '🌵', p: 0.40 },
  citadel: { ground: '#34324a', ground2: '#2e2c42', path: '#4a4766', obst: 'wall', wall: '#55536f', deco: '🕯️', p: 0.40 },
};

// Deterministic random numbers, so every player gets the same map.
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const hash = (x, y) => { let h = (x * 374761393 + y * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

// ------------------------------------------------------------------ map building
function buildTown() {
  const W = 34; const H = 24;
  const g = Array.from({ length: H }, () => Array(W).fill(T.GRASS));
  for (let x = 0; x < W; x++) { g[0][x] = T.OBST; g[H - 1][x] = T.OBST; }
  for (let y = 0; y < H; y++) { g[y][0] = T.OBST; g[y][W - 1] = T.OBST; }
  const road = (x0, y0, x1, y1) => { for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) g[y][x] = T.PATH; };
  road(1, 12, W - 1, 12); road(1, 11, 4, 11); road(17, 2, 17, H - 2);
  for (let y = 9; y <= 15; y++) for (let x = 13; x <= 21; x++) g[y][x] = T.FLOOR; // plaza
  g[11][16] = g[11][17] = g[12][16] = g[12][17] = T.WATER; // fountain
  g[11][W - 1] = g[12][W - 1] = g[13][W - 1] = T.PATH; road(W - 4, 11, W - 1, 13); // east gate
  const houses = [];
  const house = (x, y, w, h, doorTop, name) => {
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) g[yy][xx] = T.HOUSE;
    const dx = x + Math.floor(w / 2); const dy = doorTop ? y : y + h - 1; g[dy][dx] = T.DOOR;
    const front = doorTop ? dy - 1 : dy + 1;
    road(dx, front, dx, 12);
    houses.push({ x, y, w, h, name });
    return { x: dx, y: front };
  };
  const shop = house(3, 4, 5, 3, false, 'Shop');
  const inn = house(26, 4, 5, 3, false, 'Inn');
  const guildF = house(3, 17, 5, 3, true, 'Guild');
  const elderH = house(26, 17, 5, 3, true, 'Elder');
  const trainerH = house(10, 3, 4, 3, false, 'Dojo');
  // a few trees and flowers
  const r = rng(77);
  for (let k = 0; k < 40; k++) { const x = 1 + Math.floor(r() * (W - 2)); const y = 1 + Math.floor(r() * (H - 2)); if (g[y][x] === T.GRASS) g[y][x] = r() < 0.35 ? T.OBST : T.DECO; }
  for (let y = 10; y <= 14; y++) g[y][W - 2] = g[y][W - 2] === T.OBST ? T.GRASS : g[y][W - 2];
  const npcs = [
    { id: 'merchant', x: shop.x + 1, y: shop.y },
    { id: 'innkeeper', x: inn.x - 1, y: inn.y },
    { id: 'guild', x: guildF.x + 1, y: guildF.y },
    { id: 'elder', x: 15, y: 13 },
    { id: 'trainer', x: trainerH.x + 1, y: trainerH.y },
    { id: 'sage', x: elderH.x - 1, y: elderH.y },
  ];
  npcs.forEach((n) => { if (SOLID.has(g[n.y][n.x])) g[n.y][n.x] = T.GRASS; });
  return { W, H, g, npcs, houses, center: { x: 18, y: 14 }, exits: [{ side: 'E', to: 'fields' }], waystone: { x: 19, y: 14 } };
}

function buildZone(id) {
  const Z = ZONES[id]; const th = THEMES[Z.theme];
  const W = 46; const H = 34; const r = rng(Z.seed);
  let g = Array.from({ length: H }, (_, y) => Array.from({ length: W }, (_, x) => (x === 0 || y === 0 || x === W - 1 || y === H - 1 || r() < th.p ? T.OBST : T.GRASS)));
  for (let it = 0; it < 4; it++) {
    const n = g.map((row) => row.slice());
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      let c = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && g[y + dy][x + dx] === T.OBST) c++;
      n[y][x] = c >= 5 ? T.OBST : c <= 2 ? T.GRASS : g[y][x];
    }
    g = n;
  }
  const cx = Math.floor(W / 2); const cy = Math.floor(H / 2);
  const carve = (x, y, rad = 1, t = T.PATH) => { for (let dy = -rad; dy <= rad; dy++) for (let dx = -rad; dx <= rad; dx++) { const xx = x + dx; const yy = y + dy; if (xx > 0 && yy > 0 && xx < W - 1 && yy < H - 1) g[yy][xx] = t; } };
  const exitPos = (side) => ({ N: { x: cx, y: 0 }, S: { x: cx, y: H - 1 }, W: { x: 0, y: cy }, E: { x: W - 1, y: cy } }[side]);
  // Winding roads from each exit to the centre.
  for (const ex of Z.exits) {
    const p = exitPos(ex.side); let x = p.x; let y = p.y;
    g[y][x] = T.PATH; if (ex.side === 'N' || ex.side === 'S') { g[y][x - 1] = g[y][x + 1] = T.PATH; } else { g[y - 1][x] = g[y + 1][x] = T.PATH; }
    for (let k = 0; k < 400 && (Math.abs(x - cx) > 1 || Math.abs(y - cy) > 1); k++) {
      const towardX = Math.sign(cx - x); const towardY = Math.sign(cy - y);
      if (r() < 0.25) { if (r() < 0.5) x += r() < 0.5 ? 1 : -1; else y += r() < 0.5 ? 1 : -1; } else if (Math.abs(cx - x) > Math.abs(cy - y) ? r() < 0.8 : r() < 0.2) x += towardX; else y += towardY;
      x = Math.max(1, Math.min(W - 2, x)); y = Math.max(1, Math.min(H - 2, y));
      carve(x, y, 1);
    }
  }
  carve(cx, cy, 3, T.GRASS); carve(cx, cy, 1, T.PATH);
  // Lakes in the meadow.
  if (th.water) for (let k = 0; k < 3; k++) { const lx = 6 + Math.floor(r() * (W - 12)); const ly = 5 + Math.floor(r() * (H - 10)); if (Math.abs(lx - cx) + Math.abs(ly - cy) < 8) continue; for (let dy = -2; dy <= 2; dy++) for (let dx = -3; dx <= 3; dx++) if (dx * dx / 9 + dy * dy / 4 <= 1 && g[ly + dy][lx + dx] !== T.PATH) g[ly + dy][lx + dx] = T.WATER; }
  // Keep only the part reachable from the centre.
  const seen = Array.from({ length: H }, () => Array(W).fill(false));
  const q = [[cx, cy]]; seen[cy][cx] = true; const reach = [];
  while (q.length) { const [x, y] = q.pop(); reach.push([x, y]); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const xx = x + dx; const yy = y + dy; if (xx >= 0 && yy >= 0 && xx < W && yy < H && !seen[yy][xx] && !SOLID.has(g[yy][xx])) { seen[yy][xx] = true; q.push([xx, yy]); } } }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!seen[y][x] && !SOLID.has(g[y][x])) g[y][x] = T.OBST;
  for (const [x, y] of reach) if (g[y][x] === T.GRASS && r() < 0.06) g[y][x] = T.DECO;
  // Boss lair: the reachable spot farthest from the first exit.
  const e0 = exitPos(Z.exits[0].side);
  let far = [cx, cy]; let best = -1;
  for (const [x, y] of reach) { const d = Math.abs(x - e0.x) + Math.abs(y - e0.y); if (d > best && x > 2 && y > 2 && x < W - 3 && y < H - 3 && !Z.exits.some((ex) => { const p = exitPos(ex.side); return Math.abs(p.x - x) + Math.abs(p.y - y) < 6; })) { best = d; far = [x, y]; } }
  carve(far[0], far[1], 2, T.GRASS);
  const lair = { x: far[0], y: far[1] };
  const spots = reach.filter(([x, y]) => Math.abs(x - cx) + Math.abs(y - cy) > 5 && Math.abs(x - lair.x) + Math.abs(y - lair.y) > 4 && !SOLID.has(g[y][x]));
  return { W, H, g, npcs: [], houses: [], center: { x: cx, y: cy }, exits: Z.exits, waystone: { x: cx + 1, y: cy }, lair, spots, rand: r };
}

// ------------------------------------------------------------------ pre-rendered map
function drawMap(map, theme) {
  const th = THEMES[theme]; const dpr = Math.min(2, window.devicePixelRatio || 1);
  const c = document.createElement('canvas'); c.width = map.W * TS * dpr; c.height = map.H * TS * dpr;
  const g = c.getContext('2d'); g.scale(dpr, dpr);
  const solidAt = (x, y) => x < 0 || y < 0 || x >= map.W || y >= map.H || map.g[y][x] === T.OBST;
  for (let y = 0; y < map.H; y++) for (let x = 0; x < map.W; x++) {
    const t = map.g[y][x]; const px = x * TS; const py = y * TS; const h = hash(x, y);
    g.fillStyle = h < 0.5 ? th.ground : th.ground2; g.fillRect(px, py, TS, TS);
    if (h > 0.8 && t === T.GRASS) { g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(px + h * 20, py + 8, 3, 6); }
    if (t === T.PATH) { g.fillStyle = th.path; g.fillRect(px, py, TS, TS); g.fillStyle = 'rgba(0,0,0,.05)'; g.fillRect(px + (h * 30) | 0, py + ((h * 997) % 30), 4, 3); }
    if (t === T.FLOOR) { g.fillStyle = th.floor || th.path; g.fillRect(px, py, TS, TS); g.strokeStyle = 'rgba(0,0,0,.12)'; g.strokeRect(px + 0.5, py + 0.5, TS - 1, TS - 1); }
    if (t === T.DECO) { g.font = `${TS * 0.45}px serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.globalAlpha = 0.9; g.fillText(th.deco, px + TS / 2 + (h - 0.5) * 8, py + TS / 2 + (h * 7 % 1 - 0.5) * 8); g.globalAlpha = 1; }
    if (t === T.WATER) { g.fillStyle = '#3d8fd1'; g.fillRect(px, py, TS, TS); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(px + 6 + h * 10, py + 10 + h * 8, 10, 2); }
    if (t === T.OBST) {
      if (th.obst === 'tree') {
        g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(px + TS / 2, py + TS * 0.82, TS * 0.38, TS * 0.14, 0, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#6b4a2b'; g.fillRect(px + TS * 0.44, py + TS * 0.55, TS * 0.12, TS * 0.3);
        g.fillStyle = th.tree; g.beginPath(); g.arc(px + TS / 2, py + TS * 0.42, TS * 0.38, 0, Math.PI * 2); g.fill();
        g.fillStyle = 'rgba(255,255,255,.12)'; g.beginPath(); g.arc(px + TS * 0.4, py + TS * 0.32, TS * 0.14, 0, Math.PI * 2); g.fill();
      } else if (th.obst === 'rock' || th.obst === 'mesa') {
        const col = th[th.obst];
        g.fillStyle = col; g.beginPath(); g.moveTo(px + 3, py + TS - 3); g.lineTo(px + 6 + h * 6, py + 6); g.lineTo(px + TS - 8, py + 3 + h * 5); g.lineTo(px + TS - 3, py + TS - 4); g.closePath(); g.fill();
        g.fillStyle = 'rgba(255,255,255,.15)'; g.beginPath(); g.moveTo(px + 6 + h * 6, py + 6); g.lineTo(px + TS - 8, py + 3 + h * 5); g.lineTo(px + TS / 2, py + TS / 2); g.closePath(); g.fill();
      } else if (th.obst === 'bog') {
        g.fillStyle = th.bog; g.fillRect(px, py, TS, TS);
        g.fillStyle = 'rgba(160,220,200,.25)'; g.beginPath(); g.ellipse(px + TS * (0.3 + h * 0.4), py + TS * 0.5, 5, 2, 0, 0, Math.PI * 2); g.fill();
      } else if (th.obst === 'wall') {
        g.fillStyle = th.wall; g.fillRect(px, py, TS, TS);
        g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1;
        for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(px, py + k * 12 + 0.5); g.lineTo(px + TS, py + k * 12 + 0.5); g.stroke(); const off = k % 2 ? 0 : TS / 2; g.beginPath(); g.moveTo(px + off + 0.5, py + k * 12); g.lineTo(px + off + 0.5, py + k * 12 + 12); g.stroke(); }
        if (!solidAt(x, y + 1)) { g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(px, py + TS - 5, TS, 5); }
      }
    }
  }
  // Houses on top.
  for (const hs of map.houses) {
    const px = hs.x * TS; const py = hs.y * TS; const w = hs.w * TS; const h = hs.h * TS;
    g.fillStyle = '#e8dcc4'; g.fillRect(px + 2, py + h * 0.38, w - 4, h * 0.62 - 2);
    g.fillStyle = '#b5523b'; g.beginPath(); g.moveTo(px - 4, py + h * 0.42); g.lineTo(px + w / 2, py - 6); g.lineTo(px + w + 4, py + h * 0.42); g.closePath(); g.fill();
    g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(px + 2, py + h * 0.38, w - 4, 4);
    for (const fx of [0.22, 0.78]) { g.fillStyle = '#7cc6f2'; g.fillRect(px + w * fx - 8, py + h * 0.55, 16, 14); g.strokeStyle = '#6b4a2b'; g.strokeRect(px + w * fx - 8, py + h * 0.55, 16, 14); }
    g.fillStyle = '#fff'; g.font = '700 11px system-ui, sans-serif'; g.textAlign = 'center'; g.fillText(hs.name, px + w / 2, py + h * 0.3);
  }
  for (let y = 0; y < map.H; y++) for (let x = 0; x < map.W; x++) if (map.g[y][x] === T.DOOR) { g.fillStyle = '#6b4a2b'; g.fillRect(x * TS + 9, y * TS + 6, TS - 18, TS - 6); g.fillStyle = '#facc15'; g.fillRect(x * TS + TS - 14, y * TS + TS / 2, 3, 3); }
  return c;
}

// ------------------------------------------------------------------ the world object
export function createWorld(canvas, hooks) {
  const g = canvas.getContext('2d');
  let map = null; let mapImg = null; let zoneId = null; let theme = 'town';
  const me = { x: 0, y: 0, path: [], target: null, dir: 1, moving: false, name: '', cls: 'algebraist', color: '#facc15', level: 1, bubble: null };
  let monsters = []; let npcs = []; let others = []; let raidBoss = null;
  let W = 0; let H = 0; let dpr = 1; let grace = 0; const keys = new Set(); let floaters = [];
  const resize = () => { dpr = Math.min(3, window.devicePixelRatio || 1); W = canvas.clientWidth; H = canvas.clientHeight; canvas.width = W * dpr; canvas.height = H * dpr; };
  window.addEventListener('resize', resize); resize();
  const walkable = (x, y) => map && x >= 0 && y >= 0 && x < map.W && y < map.H && !SOLID.has(map.g[y][x]);

  function spawnMonster(type, at) {
    const def = MONSTERS[type];
    return { uid: Math.random().toString(36).slice(2), type, def, x: at[0] + 0.5, y: at[1] + 0.5, home: { x: at[0], y: at[1] }, tx: null, ty: null, wait: Math.random() * 2, alive: true, respawn: 0, bob: Math.random() * 6 };
  }
  function loadZone(id, fromSide = null, at = null) {
    zoneId = id; const Z = ZONES[id]; theme = Z.theme;
    map = id === 'town' ? buildTown() : buildZone(id);
    mapImg = drawMap(map, theme);
    npcs = map.npcs.map((n) => ({ ...n, ...NPCS[n.id], x: n.x + 0.5, y: n.y + 0.5 }));
    monsters = []; raidBoss = null;
    if (id !== 'town') {
      const spots = map.spots; const r = map.rand;
      const pickSpot = () => spots[Math.floor(r() * spots.length)];
      for (let k = 0; k < 11; k++) monsters.push(spawnMonster(Z.spawns[k % Z.spawns.length], pickSpot()));
      for (const e of Z.elites) for (let k = 0; k < 2; k++) monsters.push(spawnMonster(e, pickSpot()));
      if (Z.boss) monsters.push(spawnMonster(Z.boss, [map.lair.x, map.lair.y]));
      if (Z.raid) { raidBoss = spawnMonster(Z.raid, [map.lair.x, map.lair.y]); monsters.push(raidBoss); }
      monsters.forEach((m) => { if (m.def.kind !== 'quick') m.static = true; });
    }
    // Place the player.
    let p = at ? { x: at.x, y: at.y } : null;
    if (!p && fromSide) {
      const cx = Math.floor(map.W / 2); const cy = Math.floor(map.H / 2);
      const ex = map.exits.find((e) => e.side === fromSide);
      if (ex || id === 'town') {
        const s = id === 'town' ? 'E' : fromSide;
        p = { N: { x: cx, y: 2 }, S: { x: cx, y: map.H - 3 }, W: { x: 2, y: cy }, E: { x: map.W - 3, y: id === 'town' ? 12 : cy } }[s];
        if (!walkable(p.x, p.y)) p = { N: { x: cx, y: 1 }, S: { x: cx, y: map.H - 2 }, W: { x: 1, y: cy }, E: { x: map.W - 2, y: id === 'town' ? 12 : cy } }[s];
      }
    }
    if (!p || !walkable(Math.floor(p.x), Math.floor(p.y))) p = { x: map.center.x, y: map.center.y };
    me.x = Math.floor(p.x) + 0.5; me.y = Math.floor(p.y) + 0.5; me.path = []; me.target = null; grace = 1.5;
    hooks.onZone?.(id);
  }

  // A* on the tile grid.
  function findPath(sx, sy, tx, ty, adjacentOk = false) {
    const key = (x, y) => y * map.W + x;
    const goal = (x, y) => (adjacentOk ? Math.abs(x - tx) + Math.abs(y - ty) <= 1 : x === tx && y === ty);
    if (!adjacentOk && !walkable(tx, ty)) return null;
    const open = [[sx, sy, 0, Math.abs(sx - tx) + Math.abs(sy - ty)]]; const came = new Map(); const gs = new Map([[key(sx, sy), 0]]);
    for (let it = 0; open.length && it < 4000; it++) {
      let bi = 0; for (let i = 1; i < open.length; i++) if (open[i][3] < open[bi][3]) bi = i;
      const [x, y, gc] = open.splice(bi, 1)[0];
      if (goal(x, y)) { const path = []; let k = key(x, y); while (came.has(k)) { path.unshift([k % map.W, Math.floor(k / map.W)]); k = came.get(k); } return path; }
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx; const ny = y + dy; if (!walkable(nx, ny)) continue;
        const nk = key(nx, ny); const ng = gc + 1;
        if (ng < (gs.get(nk) ?? Infinity)) { gs.set(nk, ng); came.set(nk, key(x, y)); open.push([nx, ny, ng, ng + Math.abs(nx - tx) + Math.abs(ny - ty)]); }
      }
    }
    return null;
  }
  const toTile = (sx, sy) => { const cam = camera(); return [Math.floor((sx + cam.x) / TS), Math.floor((sy + cam.y) / TS)]; };
  function camera() {
    const mw = map.W * TS; const mh = map.H * TS;
    let x = me.x * TS - W / 2; let y = me.y * TS - H / 2;
    x = mw < W ? (mw - W) / 2 : Math.max(0, Math.min(mw - W, x));
    y = mh < H ? (mh - H) / 2 : Math.max(0, Math.min(mh - H, y));
    return { x, y };
  }
  function tap(sx, sy) {
    if (!map) return;
    const [tx, ty] = toTile(sx, sy);
    const near = (e) => Math.abs(e.x - (tx + 0.5)) < 0.9 && Math.abs(e.y - (ty + 0.5)) < 0.9;
    const npc = npcs.find(near);
    const mon = monsters.find((m) => m.alive && near(m));
    const other = others.find(near);
    const way = map.waystone && map.waystone.x === tx && map.waystone.y === ty;
    let target = null;
    if (npc) target = { type: 'npc', ref: npc };
    else if (mon) target = { type: 'monster', ref: mon };
    else if (way) target = { type: 'waystone' };
    else if (other) { hooks.onPlayer?.(other); return; }
    const adj = !!target || !walkable(tx, ty);
    const path = findPath(Math.floor(me.x), Math.floor(me.y), tx, ty, adj);
    if (path) { me.path = path; me.target = target; hooks.onTapFeedback?.(tx, ty); }
    if (path && !path.length && target) arrive(target);
  }
  function arrive(target) {
    me.target = null;
    if (target.type === 'npc') hooks.onNpc?.(target.ref);
    if (target.type === 'monster' && target.ref.alive) hooks.onBattle?.(target.ref);
    if (target.type === 'waystone') hooks.onWaystone?.();
  }
  canvas.addEventListener('click', (e) => { const b = canvas.getBoundingClientRect(); tap(e.clientX - b.left, e.clientY - b.top); });
  window.addEventListener('keydown', (e) => { if (/^(Arrow|[wasdWASD]$)/.test(e.key) && !e.target.closest('input')) { keys.add(e.key.toLowerCase()); me.path = []; me.target = null; } });
  window.addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));

  function update(dt, paused) {
    if (!map) return;
    grace = Math.max(0, grace - dt);
    const speed = 4.4;
    let mx = 0; let my = 0;
    if (!paused) {
      if (keys.has('arrowleft') || keys.has('a')) mx -= 1; if (keys.has('arrowright') || keys.has('d')) mx += 1;
      if (keys.has('arrowup') || keys.has('w')) my -= 1; if (keys.has('arrowdown') || keys.has('s')) my += 1;
    }
    me.moving = false;
    if (!paused && (mx || my)) {
      const len = Math.hypot(mx, my); const nx = me.x + (mx / len) * speed * dt; const ny = me.y + (my / len) * speed * dt;
      const r = 0.3; const free = (x, y) => walkable(Math.floor(x - r), Math.floor(y - r)) && walkable(Math.floor(x + r), Math.floor(y - r)) && walkable(Math.floor(x - r), Math.floor(y + r)) && walkable(Math.floor(x + r), Math.floor(y + r));
      if (free(nx, me.y)) me.x = nx; if (free(me.x, ny)) me.y = ny;
      if (mx) me.dir = Math.sign(mx); me.moving = true;
    } else if (!paused && me.path.length) {
      const [tx, ty] = me.path[0]; const dx = tx + 0.5 - me.x; const dy = ty + 0.5 - me.y; const d = Math.hypot(dx, dy);
      const step = speed * dt;
      if (d <= step) { me.x = tx + 0.5; me.y = ty + 0.5; me.path.shift(); if (!me.path.length && me.target) arrive(me.target); }
      else { me.x += (dx / d) * step; me.y += (dy / d) * step; if (dx) me.dir = Math.sign(dx); }
      me.moving = true;
    }
    // exits
    const tx = Math.floor(me.x); const ty = Math.floor(me.y);
    if (!paused && (tx <= 0 || ty <= 0 || tx >= map.W - 1 || ty >= map.H - 1)) {
      const side = tx <= 0 ? 'W' : tx >= map.W - 1 ? 'E' : ty <= 0 ? 'N' : 'S';
      const ex = map.exits.find((e) => e.side === side);
      if (ex) { hooks.onExit?.(ex.to, { N: 'S', S: 'N', W: 'E', E: 'W' }[side]); return; }
    }
    // monsters
    const now = performance.now() / 1000;
    for (const m of monsters) {
      if (!m.alive) { if (now > m.respawn) { m.alive = true; m.x = m.home.x + 0.5; m.y = m.home.y + 0.5; } continue; }
      m.bob += dt * 3;
      if (!m.static && !paused) {
        if (m.tx == null) { m.wait -= dt; if (m.wait <= 0) { const nx = m.home.x + Math.floor(Math.random() * 7) - 3; const ny = m.home.y + Math.floor(Math.random() * 7) - 3; if (walkable(nx, ny)) { m.tx = nx + 0.5; m.ty = ny + 0.5; } m.wait = 1.5 + Math.random() * 2.5; } }
        else { const dx = m.tx - m.x; const dy = m.ty - m.y; const d = Math.hypot(dx, dy); const st = 1.2 * dt; if (d < st) { m.tx = null; } else { const nx = m.x + (dx / d) * st; const ny = m.y + (dy / d) * st; if (walkable(Math.floor(nx), Math.floor(ny))) { m.x = nx; m.y = ny; } else m.tx = null; } }
      }
      if (!paused && !grace && Math.hypot(m.x - me.x, m.y - me.y) < 0.75) { me.path = []; me.target = null; hooks.onBattle?.(m); break; }
    }
    floaters = floaters.filter((f) => (f.t -= dt) > 0);
  }

  function drawEntity(x, y, icon, { label, sub, color, size = 28, bob = 0, ring, bubble, scale = 1, dim = false } = {}) {
    const px = x * TS; const py = y * TS - Math.abs(Math.sin(bob)) * 3;
    g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(px, y * TS + 10, 12 * scale, 5 * scale, 0, 0, Math.PI * 2); g.fill();
    if (ring) { g.strokeStyle = ring; g.lineWidth = 3; g.beginPath(); g.ellipse(px, y * TS + 10, 15 * scale, 6.5 * scale, 0, 0, Math.PI * 2); g.stroke(); }
    if (dim) g.globalAlpha = 0.5;
    g.font = `${size * scale}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(icon, px, py - 4 * scale);
    g.globalAlpha = 1;
    if (label) {
      g.font = '700 11px system-ui, sans-serif'; const w = g.measureText(label).width + 10;
      g.fillStyle = 'rgba(0,0,0,.55)'; roundRect(px - w / 2, py - 32 * scale - 6, w, 15, 7); g.fill();
      g.fillStyle = color || '#fff'; g.fillText(label, px, py - 32 * scale + 1.5);
    }
    if (sub) { g.font = '600 9px system-ui, sans-serif'; g.fillStyle = 'rgba(255,255,255,.85)'; g.fillText(sub, px, py + 22 * scale); }
    if (bubble) {
      g.font = '600 12px system-ui, sans-serif'; const w = Math.min(180, g.measureText(bubble).width + 16);
      const by = py - 32 * scale - 30; g.fillStyle = '#fff'; roundRect(px - w / 2, by, w, 20, 10); g.fill();
      g.beginPath(); g.moveTo(px - 5, by + 20); g.lineTo(px + 5, by + 20); g.lineTo(px, by + 26); g.fill();
      g.fillStyle = '#111'; g.fillText(bubble, px, by + 10.5, 170);
    }
  }
  function roundRect(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

  function render(t) {
    if (!map) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = '#0b0c10'; g.fillRect(0, 0, W, H);
    const cam = camera();
    g.save(); g.translate(-Math.round(cam.x), -Math.round(cam.y));
    g.drawImage(mapImg, 0, 0, map.W * TS, map.H * TS);
    // water shimmer
    // path target marker
    if (me.path.length) { const [ex, ey] = me.path[me.path.length - 1]; g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 2; g.beginPath(); g.arc(ex * TS + TS / 2, ey * TS + TS / 2, 8 + Math.sin(t * 6) * 2, 0, Math.PI * 2); g.stroke(); }
    // waystone
    if (map.waystone) { const w = map.waystone; const px = w.x * TS + TS / 2; const py = w.y * TS + TS / 2; const glow = 0.5 + 0.5 * Math.sin(t * 2); g.fillStyle = `rgba(125,211,252,${0.25 + glow * 0.25})`; g.beginPath(); g.arc(px, py, 16, 0, Math.PI * 2); g.fill(); g.font = '24px serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('🔷', px, py - 2); }
    // exit arrows
    for (const ex of map.exits) {
      const cx = Math.floor(map.W / 2); const cy = Math.floor(map.H / 2);
      const p = { N: [cx, 0.6], S: [cx, map.H - 0.6], W: [0.6, map.zoneTown ? 12 : cy], E: [map.W - 0.6, zoneId === 'town' ? 12.5 : cy + 0.5] }[ex.side];
      const px = (ex.side === 'N' || ex.side === 'S' ? p[0] + 0.5 : p[0]) * TS; const py = (ex.side === 'W' || ex.side === 'E' ? (zoneId === 'town' ? 12.5 : p[1] + 0.5) : p[1]) * TS;
      g.font = '700 11px system-ui, sans-serif'; g.textAlign = 'center'; const label = `${{ N: '▲', S: '▼', W: '◀', E: '▶' }[ex.side]} ${ZONES[ex.to].name}`;
      const w = g.measureText(label).width + 12; const lx = Math.max(w / 2 + 4, Math.min(map.W * TS - w / 2 - 4, px)); const ly = Math.max(14, Math.min(map.H * TS - 14, py + (ex.side === 'N' ? 16 : ex.side === 'S' ? -16 : -22)));
      g.fillStyle = 'rgba(0,0,0,.55)'; roundRect(lx - w / 2, ly - 9, w, 18, 9); g.fill(); g.fillStyle = '#fde68a'; g.fillText(label, lx, ly + 0.5);
    }
    // entities, sorted by y
    const ents = [];
    for (const n of npcs) ents.push({ y: n.y, draw: () => drawEntity(n.x, n.y, n.icon, { label: n.name.split(' ').slice(-1)[0], sub: n.role, color: '#fde68a', bob: t * 2 + n.x, bubble: n.bubble }) });
    for (const m of monsters) if (m.alive) {
      const d = m.def; const big = d.kind === 'boss' || d.kind === 'raid';
      ents.push({ y: m.y, draw: () => drawEntity(m.x, m.y, d.icon, { label: `${d.name} · Lv ${d.level}`, color: d.kind === 'quick' ? '#fff' : d.kind === 'elite' ? '#fbbf24' : '#f87171', size: big ? 40 : d.kind === 'elite' ? 32 : 26, bob: m.bob, ring: d.kind === 'quick' ? null : d.kind === 'elite' ? '#fbbf24' : '#ef4444', scale: big ? 1.3 : 1 }) });
    }
    for (const o of others) ents.push({ y: o.y, draw: () => drawEntity(o.x, o.y, CLASSES[o.cls]?.icon || '🙂', { label: `${o.npc ? '🤖 ' : ''}${o.name} · ${o.level}`, color: o.npc ? '#c7d2fe' : o.color, bob: o.moving ? t * 10 : 0, ring: o.color, bubble: o.bubble, dim: o.dim }) });
    ents.push({ y: me.y, draw: () => drawEntity(me.x, me.y, CLASSES[me.cls].icon, { label: `${me.name} · ${me.level}`, color: me.color, bob: me.moving ? t * 10 : 0, ring: me.color, bubble: me.bubble }) });
    ents.sort((a, b) => a.y - b.y).forEach((e) => e.draw());
    for (const f of floaters) { g.globalAlpha = Math.min(1, f.t * 2); g.font = '800 14px system-ui, sans-serif'; g.fillStyle = f.color; g.textAlign = 'center'; g.fillText(f.text, f.x * TS, f.y * TS - 40 - (1.5 - f.t) * 20); g.globalAlpha = 1; }
    g.restore();
  }

  return {
    loadZone, update, render, tap, findPath,
    get me() { return me; }, get map() { return map; }, get zone() { return zoneId; }, get monsters() { return monsters; }, get npcs() { return npcs; },
    get raidBoss() { return raidBoss; },
    setOthers(list) { others = list; },
    kill(m) { m.alive = false; m.respawn = performance.now() / 1000 + (m.def.kind === 'quick' ? 25 : m.def.kind === 'elite' ? 60 : 90); grace = 1.2; },
    graceFor(s) { grace = s; },
    float(text, color = '#fde68a', x = me.x, y = me.y) { floaters.push({ text, color, x, y, t: 1.5 }); },
    walkable, camera,
  };
}
