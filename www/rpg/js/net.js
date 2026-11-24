// Multiplayer for Numeria.
//  • Supabase Realtime (broadcast) when js/config.js has a project URL and anon key: real players, worldwide.
//  • BroadcastChannel: other tabs on the same device (handy for testing).
//  • NPC adventurers (clearly labelled) keep zones lively when nobody else is around.
// Chat is quick-chat only (preset phrases and emotes): there is no free text, so it is safe for everyone.
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../js/config.js';
import { NAME_A, NAME_B, COLORS, CHAT, ZONES, MONSTERS } from './data.js';

const RAID_MAX = 30;
const hourKey = () => Math.floor(Date.now() / 3600000);

export function createNet({ me, world, onChat, onPeers, onRaid, onRaidWon }) {
  const peers = new Map(); // id → peer
  let zone = null; let lastSent = 0; let lastPos = ''; let bots = [];
  const raid = { hour: hourKey(), hp: RAID_MAX, max: RAID_MAX, mine: 0, won: false };
  const listeners = [];

  // ---------------- transports
  const transports = [];
  try {
    const bc = new BroadcastChannel('numeria');
    bc.onmessage = (e) => receive(e.data);
    transports.push({ name: 'local', send: (m) => bc.postMessage(m), join() {}, leave() {} });
  } catch { /* old browser */ }
  let online = false;
  if (SUPABASE_URL && SUPABASE_ANON_KEY) transports.push(supabaseTransport());
  function supabaseTransport() {
    let ws = null; let ref = 0; let topic = null; let beat = null; let queue = [];
    const url = `${SUPABASE_URL.replace(/^http/, 'ws')}/realtime/v1/websocket?apikey=${encodeURIComponent(SUPABASE_ANON_KEY)}&vsn=1.0.0`;
    const raw = (t, event, payload) => { const msg = JSON.stringify({ topic: t, event, payload, ref: String(++ref) }); if (ws && ws.readyState === 1) ws.send(msg); else queue.push(msg); };
    const connect = () => {
      try { ws = new WebSocket(url); } catch { return; }
      ws.onopen = () => { online = true; queue.forEach((m) => ws.send(m)); queue = []; if (topic) joinTopic(topic); clearInterval(beat); beat = setInterval(() => raw('phoenix', 'heartbeat', {}), 25000); };
      ws.onmessage = (e) => { try { const m = JSON.parse(e.data); if (m.event === 'broadcast' && m.payload?.payload) receive(m.payload.payload); } catch { /* ignore */ } };
      ws.onclose = () => { online = false; clearInterval(beat); setTimeout(connect, 4000); };
    };
    const joinTopic = (t) => raw(`realtime:${t}`, 'phx_join', { config: { broadcast: { self: false, ack: false }, presence: { key: me.id } }, access_token: SUPABASE_ANON_KEY });
    connect();
    return {
      name: 'supabase',
      send: (m) => { if (topic) raw(`realtime:${topic}`, 'broadcast', { type: 'broadcast', event: 'm', payload: m }); },
      join: (z) => { if (topic) raw(`realtime:${topic}`, 'phx_leave', {}); topic = `numeria-${z}`; joinTopic(topic); },
      leave: () => {},
    };
  }
  const send = (m) => { const msg = { ...m, id: me.id, zone, v: 1 }; transports.forEach((t) => t.send(msg)); };

  // ---------------- receiving
  function receive(m) {
    if (!m || m.id === me.id) return;
    if (m.t === 'raid') { if (m.hour === raid.hour && m.zone === 'citadel') applyRaid(m.dmg, m.name); return; }
    if (m.t === 'raidState') { if (m.hour === raid.hour && m.hp < raid.hp) { raid.hp = m.hp; onRaid?.(raid); } return; }
    if (m.zone !== zone) { peers.delete(m.id); emitPeers(); return; }
    let p = peers.get(m.id);
    if (m.t === 'bye') { peers.delete(m.id); emitPeers(); return; }
    if (!p) { p = { id: m.id, x: m.x ?? 0, y: m.y ?? 0, tx: m.x ?? 0, ty: m.y ?? 0 }; peers.set(m.id, p); if (m.t !== 'hello') send({ t: 'pos', ...pos() }); }
    p.seen = Date.now();
    if (m.t === 'hello') { send({ t: 'pos', ...pos() }); if (zone === 'citadel') send({ t: 'raidState', hour: raid.hour, hp: raid.hp }); }
    if (m.t === 'pos' || m.t === 'hello') Object.assign(p, { name: m.name, cls: m.cls, color: m.color, level: m.level, tx: m.x, ty: m.y, moving: m.moving });
    if (m.t === 'chat') { p.bubble = m.text; p.bubbleUntil = Date.now() + 5000; onChat?.({ from: p.name, text: m.text, color: p.color }); }
    emitPeers();
  }
  const pos = () => ({ name: me.name, cls: me.cls, color: me.color, level: me.level, x: +world.me.x.toFixed(2), y: +world.me.y.toFixed(2), moving: world.me.moving });
  function emitPeers() { onPeers?.(count()); }
  const count = () => [...peers.values()].filter((p) => Date.now() - p.seen < 10000).length;

  // ---------------- raid boss (shared HP for the hour)
  function applyRaid(dmg, who) {
    if (raid.hour !== hourKey()) resetRaid();
    if (raid.hp <= 0) return;
    raid.hp = Math.max(0, raid.hp - dmg);
    if (who) onChat?.({ from: who, text: `hit the Grand Examiner for ${dmg}! 💥`, color: '#f472b6', system: true });
    onRaid?.(raid);
    if (raid.hp <= 0 && !raid.won) { raid.won = true; onRaidWon?.(raid); }
  }
  function resetRaid() { raid.hour = hourKey(); raid.hp = RAID_MAX; raid.mine = 0; raid.won = false; onRaid?.(raid); }

  // ---------------- NPC adventurers
  function makeBots(z) {
    bots = [];
    if (!z) return;
    const n = z === 'town' ? 3 : 2;
    const r = (k) => Math.floor(Math.random() * k);
    for (let k = 0; k < n; k++) {
      const lv = Math.max(1, ZONES[z].level[0] + r(4));
      bots.push({ id: `npc-${k}`, npc: true, name: `${NAME_A[r(NAME_A.length)]}${NAME_B[r(NAME_B.length)]}`, cls: ['algebraist', 'geometer', 'theorist', 'combinatorist'][r(4)], color: COLORS[r(COLORS.length)], level: lv, x: world.me.x + r(5) - 2, y: world.me.y + r(5) - 2, path: [], wait: 1 + Math.random() * 3, next: Date.now() + 8000 + Math.random() * 20000 });
    }
  }
  function tickBots(dt) {
    const map = world.map; if (!map) return;
    for (const b of bots) {
      if (!world.walkable(Math.floor(b.x), Math.floor(b.y))) { b.x = map.center.x + 0.5; b.y = map.center.y + 0.5; }
      if (b.path.length) {
        const [tx, ty] = b.path[0]; const dx = tx + 0.5 - b.x; const dy = ty + 0.5 - b.y; const d = Math.hypot(dx, dy); const st = 2.6 * dt;
        if (d < st) { b.x = tx + 0.5; b.y = ty + 0.5; b.path.shift(); } else { b.x += (dx / d) * st; b.y += (dy / d) * st; }
        b.moving = true;
      } else {
        b.moving = false; b.wait -= dt;
        if (b.wait <= 0) {
          const tx = Math.floor(b.x) + Math.floor(Math.random() * 13) - 6; const ty = Math.floor(b.y) + Math.floor(Math.random() * 13) - 6;
          const path = world.walkable(tx, ty) ? world.findPath(Math.floor(b.x), Math.floor(b.y), tx, ty) : null;
          if (path && path.length < 25) b.path = path; b.wait = 2 + Math.random() * 5;
        }
      }
      if (Date.now() > b.next) {
        b.next = Date.now() + 25000 + Math.random() * 40000;
        if (zone === 'citadel' && raid.hp > 0 && Math.random() < 0.7) { applyRaid(1, `${b.name} (NPC)`); b.bubble = 'Take that, Examiner!'; }
        else b.bubble = CHAT[Math.floor(Math.random() * CHAT.length)];
        b.bubbleUntil = Date.now() + 4500;
      }
    }
  }

  // ---------------- per-frame
  function tick(dt) {
    const now = Date.now();
    if (raid.hour !== hourKey()) resetRaid();
    const p = pos(); const key = `${p.x},${p.y},${p.moving}`;
    if ((key !== lastPos && now - lastSent > 150) || now - lastSent > 3000) { send({ t: 'pos', ...p }); lastSent = now; lastPos = key; }
    for (const q of peers.values()) { q.x += (q.tx - q.x) * Math.min(1, dt * 10); q.y += (q.ty - q.y) * Math.min(1, dt * 10); if (q.bubble && now > q.bubbleUntil) q.bubble = null; }
    for (const [k, q] of peers) if (now - q.seen > 10000) peers.delete(k);
    tickBots(dt);
    for (const b of bots) if (b.bubble && now > b.bubbleUntil) b.bubble = null;
    world.setOthers([...peers.values(), ...bots]);
  }

  return {
    tick,
    setZone(z) { if (zone) send({ t: 'bye' }); zone = z; peers.clear(); transports.forEach((t) => t.join(z)); makeBots(z); send({ t: 'hello', ...pos() }); emitPeers(); },
    chat(text) { send({ t: 'chat', text }); world.me.bubble = text; clearTimeout(this._b); this._b = setTimeout(() => { world.me.bubble = null; }, 5000); },
    raidHit(dmg) { raid.mine += dmg; applyRaid(dmg, null); send({ t: 'raid', hour: raid.hour, dmg, name: me.name }); },
    get raid() { return raid; },
    get online() { return online; },
    get mode() { return transports.some((t) => t.name === 'supabase') ? 'online' : 'local'; },
    count,
    peersList: () => [...peers.values()].filter((p) => Date.now() - p.seen < 10000),
    botsList: () => bots,
    bye() { send({ t: 'bye' }); },
  };
}
