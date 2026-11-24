// Numeria — a maths MMO for AMC 8 → AIME. Game state, UI panels, NPCs, quests, progression, saving.
import { CLASSES, ABILITIES, PER_LEVEL, xpToNext, MAX_LEVEL, ITEMS, SHOP, MONSTERS, ZONES, ZONE_ORDER, NPCS, MAIN_QUEST, ELDER_LINES, SIDE_QUESTS, BOUNTY_POOL, NAME_A, NAME_B, COLORS, CHAT, EMOTES, TIERS } from './data.js';
import { createWorld } from './world.js';
import { startBattle } from './battle.js';
import { createNet } from './net.js';

const $ = (s, r = document) => r.querySelector(s);
const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const today = () => new Date().toLocaleDateString('en-CA');
const SAVE = 'numeria:save';
const load = () => { try { return JSON.parse(localStorage.getItem(SAVE)); } catch { return null; } };
const deviceId = (() => { try { let id = localStorage.getItem('numeria:id'); if (!id) { id = Math.random().toString(36).slice(2, 10); localStorage.setItem('numeria:id', id); } return id; } catch { return Math.random().toString(36).slice(2, 10); } })();

// ------------------------------------------------------------------ sound
let actx = null; let soundOn = (() => { try { return localStorage.getItem('numeria:sound') !== 'off'; } catch { return true; } })();
function sound(kind) {
  if (!soundOn) return;
  try {
    actx ||= new (window.AudioContext || window.webkitAudioContext)();
    const notes = { hit: [[520, 0.06], [780, 0.08]], crit: [[660, 0.05], [990, 0.05], [1320, 0.1]], hurt: [[220, 0.12], [150, 0.15]], win: [[523, 0.1], [659, 0.1], [784, 0.1], [1047, 0.22]], lose: [[392, 0.15], [330, 0.15], [262, 0.3]], magic: [[880, 0.06], [1175, 0.08]], coin: [[1200, 0.05], [1600, 0.08]], level: [[523, 0.08], [659, 0.08], [784, 0.08], [1047, 0.08], [1319, 0.25]], click: [[700, 0.03]], quest: [[784, 0.08], [988, 0.14]] }[kind] || [[600, 0.05]];
    let t = actx.currentTime;
    for (const [f, d] of notes) { const o = actx.createOscillator(); const gn = actx.createGain(); o.type = kind === 'hurt' || kind === 'lose' ? 'sawtooth' : 'triangle'; o.frequency.value = f; gn.gain.setValueAtTime(0.08, t); gn.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(gn).connect(actx.destination); o.start(t); o.stop(t + d + 0.02); t += d * 0.9; }
  } catch { /* no audio */ }
}

// ------------------------------------------------------------------ game state
let P = load(); // the saved hero
let world = null; let net = null; let paused = false;
const game = {
  get player() { return P; },
  stats() {
    const c = CLASSES[P.cls].base; const L = P.level - 1;
    const eq = Object.values(P.equip).filter(Boolean).map((k) => ITEMS[k]);
    const sum = (f) => eq.reduce((a, it) => a + (it[f] || 0), 0);
    return { maxHp: c.hp + PER_LEVEL.hp * L + sum('hp'), maxMp: c.mp + PER_LEVEL.mp * L + sum('mp'), atk: c.atk + PER_LEVEL.atk * L + sum('atk'), def: c.def + PER_LEVEL.def * L + sum('def'), xpBoost: sum('xpBoost'), goldBoost: sum('goldBoost') };
  },
  save() { try { P.savedAt = Date.now(); P.zone = world?.zone || P.zone; if (world) { P.x = world.me.x; P.y = world.me.y; } localStorage.setItem(SAVE, JSON.stringify(P)); } catch { /* storage full */ } hud(); },
  sound,
  count: (k) => P.inv[k] || 0,
  give(k, n = 1) { P.inv[k] = (P.inv[k] || 0) + n; },
  take(k, n = 1) { P.inv[k] = Math.max(0, (P.inv[k] || 0) - n); if (!P.inv[k]) delete P.inv[k]; },
  useItem(k) {
    const it = ITEMS[k]; const S = game.stats(); if (!game.count(k)) return;
    if (it.heal) P.hp = Math.min(S.maxHp, P.hp + it.heal);
    if (it.mana) P.mp = Math.min(S.maxMp, P.mp + it.mana);
    game.take(k); sound('magic'); game.save();
  },
  gainXp(x) {
    const S = game.stats(); x = Math.round(x * (1 + S.xpBoost)); P.xp += x; let up = false;
    while (P.level < MAX_LEVEL && P.xp >= xpToNext(P.level)) { P.xp -= xpToNext(P.level); P.level++; up = true; }
    if (up) { const S2 = game.stats(); P.hp = S2.maxHp; P.mp = S2.maxMp; sound('level'); if (world) world.me.level = P.level; toast(`⬆️ Level ${P.level}! HP and MP restored.${ABILITIES.find((a) => a.level === P.level) ? ` New ability: ${ABILITIES.find((a) => a.level === P.level).name}!` : ''}`); }
    return { gained: x, up };
  },
  addGold(g) { const S = game.stats(); g = Math.round(g * (1 + S.goldBoost)); P.gold += g; return g; },
  reward(m) {
    const d = m.def; const xpR = game.gainXp(d.xp); const gold = game.addGold(d.gold); const items = [];
    const roll = Math.random();
    if (d.kind === 'quick' && roll < 0.1) items.push('potion');
    if (d.kind === 'quick' && roll > 0.97) items.push('ether');
    if (d.kind === 'elite') { items.push(roll < 0.5 ? 'hipotion' : 'scroll'); }
    if (d.kind === 'boss') { items.push('shard', 'hipotion', 'scroll'); }
    if (d.kind === 'raid') { items.push('hipotion', 'ether'); if (!P.inv.eulerquill && !P.equip.weapon?.includes('eulerquill')) items.push('eulerquill'); }
    items.forEach((k) => game.give(k));
    world.kill(m);
    game.event({ type: 'kill', monster: m.type, kind: d.kind });
    if (d.zoneBoss) game.event({ type: 'boss', monster: m.type });
    game.save();
    return { xp: xpR.gained, gold, items, levelUp: xpR.up };
  },
  raid: () => net.raid,
  raidHit(n) { net.raidHit(n); },
  onRaidUpdate: null,
  // ---------------- quests
  event(e) {
    const Q = P.quests;
    if (e.type === 'answer') {
      P.stats.answered++; if (e.ok) { P.stats.solved++; if (e.real) P.stats.realSolved++; }
      Q.streak = e.ok ? (Q.streak || 0) + 1 : 0;
    }
    if (e.type === 'kill') P.stats.kills++;
    // side quests
    for (const sq of SIDE_QUESTS) { const s = Q.side[sq.id]; if (!s || s.done) continue; if (progressFor(sq.goal, e, s)) { s.progress = Math.min(sq.goal.n, (s.progress || 0) + 1); if (s.progress >= sq.goal.n) { s.done = true; toast(`📜 Side quest complete: ${sq.title}! Return to Sage Germain.`); sound('quest'); } } }
    // daily bounties
    ensureBounties();
    for (const b of Q.bounties.list) { const def = BOUNTY_POOL.find((x) => x.id === b.id); if (b.done) continue; if (def.goal.streak) { if (e.type === 'answer' && Q.streak >= def.goal.streak) b.progress = def.goal.streak; } else if (progressFor(def.goal, e, b)) b.progress = (b.progress || 0) + 1; const need = def.goal.n || def.goal.streak; if (b.progress >= need) { b.done = true; toast(`🎯 Bounty done: ${def.text}! Claim it from Noether.`); sound('quest'); } }
    // main quest
    const m = MAIN_QUEST[Q.main];
    if (m?.goal && ((m.goal.boss && e.type === 'boss' && e.monster === m.goal.boss) || (m.goal.raid && e.type === 'raid') || (m.goal.talk && e.type === 'talk' && e.npc === m.goal.talk))) advanceMain();
    hud();
  },
};
function progressFor(goal, e, s) {
  if (goal.kill && e.type === 'kill') return e.monster === goal.kill;
  if (goal.killAny && e.type === 'kill') return true;
  if (goal.elite && e.type === 'kill') return e.kind === 'elite';
  if (goal.topic && e.type === 'answer') return e.ok && e.topic === goal.topic;
  if (goal.real && e.type === 'answer') return e.ok && e.real;
  if (goal.crit && e.type === 'answer') return e.crit;
  return false;
}
function advanceMain() {
  const Q = P.quests; const m = MAIN_QUEST[Q.main];
  if (m.reward) { const x = game.gainXp(m.reward.xp); const g = game.addGold(m.reward.gold); toast(`🌟 Main quest complete: ${m.title}! +${x.gained} XP, +${g} gold`); }
  Q.main = Math.min(MAIN_QUEST.length - 1, Q.main + 1); sound('quest'); game.save();
}
function ensureBounties() {
  const Q = P.quests;
  if (Q.bounties?.date === today()) return;
  let seed = [...today()].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7) >>> 0;
  const r = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const pool = BOUNTY_POOL.slice(); const list = [];
  while (list.length < 3) list.push({ id: pool.splice(Math.floor(r() * pool.length), 1)[0].id, progress: 0, done: false, claimed: false });
  Q.bounties = { date: today(), list };
}

function newHero(name, cls, color) {
  const S = CLASSES[cls].base;
  return { v: 1, name, cls, color, level: 1, xp: 0, hp: S.hp, mp: S.mp, gold: 40, inv: { potion: 3, ether: 1 }, equip: { weapon: null, armor: null, charm: null }, zone: 'town', x: null, y: null, visited: { town: true }, quests: { main: 0, side: {}, bounties: null, streak: 0 }, stats: { kills: 0, answered: 0, solved: 0, realSolved: 0 }, created: Date.now() };
}

// ------------------------------------------------------------------ UI helpers
function toast(msg) { const t = el(`<div class="toast">${msg}</div>`); $('#toasts').appendChild(t); setTimeout(() => t.classList.add('out'), 3200); setTimeout(() => t.remove(), 3700); }
function panel(title, body, { wide = false, onClose } = {}) {
  closePanel(); paused = true;
  const p = el(`<div class="panel-wrap"><div class="panel ${wide ? 'wide' : ''}"><header><h2>${title}</h2><button class="x" aria-label="Close">✕</button></header><div class="panel-body"></div></div></div>`);
  p.querySelector('.panel-body').appendChild(typeof body === 'string' ? el(`<div>${body}</div>`) : body);
  const close = () => { p.remove(); paused = false; onClose?.(); };
  p.querySelector('.x').addEventListener('click', close);
  p.addEventListener('click', (e) => { if (e.target === p) close(); });
  $('#ui').appendChild(p); p._close = close;
  return p;
}
function closePanel() { $('#ui .panel-wrap')?._close(); }
function dialog(npc, text, options = []) {
  closePanel(); paused = true;
  const d = el(`<div class="panel-wrap dlg"><div class="dialog"><div class="dlg-who"><span class="dlg-icon">${npc.icon}</span><div><b>${npc.name}</b><small>${npc.role || ''}</small></div><button class="x">✕</button></div><div class="dlg-text"></div><div class="dlg-opts"></div></div></div>`);
  const close = () => { d.remove(); paused = false; };
  d._close = close;
  d.querySelector('.x').addEventListener('click', close);
  // typewriter text
  const tx = d.querySelector('.dlg-text'); let i = 0; const full = text;
  const typer = setInterval(() => { i += 3; tx.textContent = full.slice(0, i); if (i >= full.length) clearInterval(typer); }, 16);
  tx.addEventListener('click', () => { clearInterval(typer); tx.textContent = full; });
  const box = d.querySelector('.dlg-opts');
  for (const o of options.length ? options : [{ label: 'Goodbye', run: () => {} }]) {
    const b = el(`<button class="btn ${o.ghost ? 'ghost' : ''}">${o.label}</button>`);
    b.addEventListener('click', () => { sound('click'); close(); o.run?.(); });
    box.appendChild(b);
  }
  $('#ui').appendChild(d);
}

// ------------------------------------------------------------------ HUD
function hud() {
  if (!P || !$('#hud')) return;
  const S = game.stats();
  $('#hud .h-name').textContent = P.name; $('#hud .h-lv').textContent = `Lv ${P.level}`;
  $('#hud .h-icon').textContent = CLASSES[P.cls].icon; $('#hud .h-icon').style.borderColor = P.color;
  const set = (sel, v, m) => { $(sel).style.width = `${Math.max(0, Math.min(100, (100 * v) / m))}%`; };
  set('#hud .hp i', P.hp, S.maxHp); set('#hud .mp i', P.mp, S.maxMp); set('#hud .xp i', P.xp, xpToNext(P.level));
  $('#hud .hp span').textContent = `${Math.max(0, Math.round(P.hp))}/${S.maxHp}`; $('#hud .mp span').textContent = `${Math.round(P.mp)}/${S.maxMp}`;
  $('#hud .h-gold').textContent = `🪙 ${P.gold}`;
  const m = MAIN_QUEST[P.quests.main]; $('#objective').innerHTML = m ? `<b>${m.title}</b><span>${m.text}</span>` : '';
  const doneSide = SIDE_QUESTS.some((q) => P.quests.side[q.id]?.done && !P.quests.side[q.id]?.claimed);
  const doneB = P.quests.bounties?.list?.some((b) => b.done && !b.claimed);
  $('#qBtn').classList.toggle('alert', !!(doneSide || doneB));
}
function zoneBanner(id) {
  const Z = ZONES[id]; const b = $('#zoneBanner');
  b.innerHTML = `<b>${Z.name}</b><small>${Z.sub}</small>`; b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
  $('#raidBar').hidden = id !== 'citadel'; updateRaidBar();
}
function updateRaidBar() {
  if (!net) return; const r = net.raid;
  $('#raidBar i').style.width = `${(100 * r.hp) / r.max}%`;
  $('#raidBar span').textContent = r.hp > 0 ? `🐉 Grand Examiner raid: ${r.hp}/${r.max} · you dealt ${r.mine}` : '🐉 The Grand Examiner has fallen! Back next hour.';
  if (world?.raidBoss) { world.raidBoss.alive = r.hp > 0; }
}

// ------------------------------------------------------------------ NPCs
function talk(npc) {
  game.event({ type: 'talk', npc: npc.id });
  const Q = P.quests;
  if (npc.id === 'elder') {
    const m = MAIN_QUEST[Q.main];
    const shards = game.count('shard');
    const lines = Q.main <= 1 ? `${ELDER_LINES[0]} ${ELDER_LINES[1]}` : Q.main >= MAIN_QUEST.length - 1 ? 'You have done it, hero. Every theorem is whole again. Numeria will remember your name.' : `You carry ${shards} Theorem Shard${shards === 1 ? '' : 's'}. Well done! Your next task: ${m.text}`;
    dialog(npc, lines, [{ label: 'Show quests', run: openQuests }, { label: 'Goodbye', ghost: true }]);
  } else if (npc.id === 'merchant') {
    dialog(npc, `Welcome! Potions, gear, charms — everything a mathematician-adventurer needs. You have ${P.gold} gold.`, [{ label: '🛒 Browse the shop', run: openShop }, { label: 'Goodbye', ghost: true }]);
  } else if (npc.id === 'innkeeper') {
    const cost = P.level <= 3 ? 0 : 4 * P.level;
    dialog(npc, `A warm bed and a hot meal restore all your HP and MP. ${cost ? `That’s ${cost} gold.` : 'First nights are free for new adventurers!'}`, [{ label: `🛏️ Rest${cost ? ` (${cost} 🪙)` : ''}`, run: () => { if (P.gold < cost) return toast('Not enough gold.'); P.gold -= cost; const S = game.stats(); P.hp = S.maxHp; P.mp = S.maxMp; sound('magic'); toast('You feel fully rested. 😴'); game.save(); } }, { label: 'Goodbye', ghost: true }]);
  } else if (npc.id === 'guild') {
    ensureBounties();
    dialog(npc, 'The guild posts three new bounties every day. Complete them for bonus XP and gold.', [{ label: '🎯 View bounties', run: openQuests }, { label: 'Goodbye', ghost: true }]);
  } else if (npc.id === 'trainer') {
    dialog(npc, `Every class has a gift. Yours, ${CLASSES[P.cls].name}, is “${CLASSES[P.cls].hint.name}”: ${CLASSES[P.cls].hint.desc} More abilities unlock as you level up. Want to spar? My training dummy asks quick questions — no risk, small XP.`, [{ label: '🥋 Spar', run: spar }, { label: '📖 Abilities', run: openAbilities }, { label: 'Goodbye', ghost: true }]);
  } else if (npc.id === 'sage') {
    openSideQuests(npc);
  }
}
async function spar() {
  const topics = { algebra: ['arith', 'fraction', 'percent', 'quadratic'], geometry: ['angles', 'pythag', 'area', 'circle'], nt: ['primes', 'divisors', 'units', 'mod'], counting: ['counting', 'probability', 'binomial'] }[CLASSES[P.cls].topic];
  const tier = Math.min(5, 1 + Math.floor(P.level / 5));
  const dummy = { type: 'dummy', def: { name: 'Training Dummy', icon: '🎯', level: P.level, hp: 40 + P.level * 6, atk: 0, xp: 6 + P.level, gold: 0, kind: 'quick', topics, tier }, alive: true };
  battle(dummy);
}
function openSideQuests(npc) {
  const Q = P.quests;
  const avail = SIDE_QUESTS.filter((q) => P.visited[q.zone]);
  const ready = SIDE_QUESTS.find((q) => Q.side[q.id]?.done && !Q.side[q.id].claimed);
  if (ready) {
    const s = Q.side[ready.id]; s.claimed = true;
    const x = game.gainXp(ready.reward.xp); const g = game.addGold(ready.reward.gold); if (ready.reward.item) game.give(ready.reward.item);
    game.save(); sound('coin');
    return dialog(npc, `You finished “${ready.title}”! Here is your reward: ${x.gained} XP, ${g} gold${ready.reward.item ? ` and a ${ITEMS[ready.reward.item].name}` : ''}.`, [{ label: 'Thanks!', run: () => openSideQuests(npc) }]);
  }
  const offer = avail.find((q) => !Q.side[q.id]);
  if (offer) return dialog(npc, `I have a task for you in ${ZONES[offer.zone].name}: ${offer.text} Reward: ${offer.reward.xp} XP and ${offer.reward.gold} gold.`, [{ label: '✅ Accept', run: () => { Q.side[offer.id] = { progress: 0, done: false }; toast(`📜 Side quest accepted: ${offer.title}`); game.save(); } }, { label: 'Not now', ghost: true }]);
  dialog(npc, avail.length < SIDE_QUESTS.length ? 'Explore further and I will have more tasks for you. Each new zone holds a new story.' : 'You have done every task I had. Remarkable!', [{ label: 'Show quests', run: openQuests }, { label: 'Goodbye', ghost: true }]);
}

// ------------------------------------------------------------------ panels
function openShop() {
  const body = el('<div class="shop"><div class="shop-tabs"><button class="on" data-t="buy">Buy</button><button data-t="sell">Sell</button></div><div class="shop-list"></div></div>');
  let tab = 'buy';
  const draw = () => {
    const list = body.querySelector('.shop-list');
    if (tab === 'buy') list.innerHTML = SHOP.map((k) => { const it = ITEMS[k]; const owned = game.count(k) + (Object.values(P.equip).includes(k) ? 1 : 0); return `<div class="row"><span class="ri">${it.icon}</span><div><b>${it.name}</b><small>${it.desc}${owned ? ` · owned ${owned}` : ''}</small></div><button class="btn small" data-buy="${k}" ${P.gold < it.price ? 'disabled' : ''}>🪙 ${it.price}</button></div>`; }).join('');
    else { const ks = Object.keys(P.inv).filter((k) => ITEMS[k].price > 0); list.innerHTML = ks.length ? ks.map((k) => { const it = ITEMS[k]; return `<div class="row"><span class="ri">${it.icon}</span><div><b>${it.name} ×${P.inv[k]}</b><small>${it.desc}</small></div><button class="btn small ghost" data-sell="${k}">Sell 🪙 ${Math.floor(it.price / 2)}</button></div>`; }).join('') : '<p class="muted">Nothing to sell. (Equipped gear isn’t sold.)</p>'; }
    body.querySelector('.gold-line')?.remove();
    body.insertAdjacentHTML('afterbegin', `<p class="gold-line">You have <b>🪙 ${P.gold}</b></p>`);
  };
  body.addEventListener('click', (e) => {
    const t = e.target.closest('[data-t]'); if (t) { tab = t.dataset.t; body.querySelectorAll('[data-t]').forEach((x) => x.classList.toggle('on', x === t)); draw(); return; }
    const b = e.target.closest('[data-buy]'); if (b) { const it = ITEMS[b.dataset.buy]; if (P.gold < it.price) return; P.gold -= it.price; game.give(b.dataset.buy); sound('coin'); toast(`Bought ${it.icon} ${it.name}${it.kind !== 'use' ? ' — equip it from your bag' : ''}`); game.save(); draw(); return; }
    const s = e.target.closest('[data-sell]'); if (s) { const it = ITEMS[s.dataset.sell]; game.take(s.dataset.sell); P.gold += Math.floor(it.price / 2); sound('coin'); game.save(); draw(); }
  });
  draw();
  panel('🛒 Hypatia’s Shop', body);
}
function openBag() {
  const body = el('<div class="bag"></div>');
  const draw = () => {
    const S = game.stats();
    const slot = (k, label) => { const it = P.equip[k] ? ITEMS[P.equip[k]] : null; return `<div class="slot ${it ? '' : 'empty'}" data-unequip="${k}"><small>${label}</small><span>${it ? it.icon : '—'}</span><b>${it ? it.name : 'Empty'}</b></div>`; };
    const items = Object.keys(P.inv);
    body.innerHTML = `<div class="statline"><span>⚔️ ${S.atk}</span><span>🛡️ ${S.def}</span><span>❤️ ${S.maxHp}</span><span>🔷 ${S.maxMp}</span>${S.xpBoost ? `<span>✨ +${Math.round(S.xpBoost * 100)}% XP</span>` : ''}${S.goldBoost ? `<span>🪙 +${Math.round(S.goldBoost * 100)}%</span>` : ''}</div>
      <div class="slots">${slot('weapon', 'Weapon')}${slot('armor', 'Armour')}${slot('charm', 'Charm')}</div>
      <h3>Backpack</h3><div class="shop-list">${items.length ? items.map((k) => { const it = ITEMS[k]; const act = it.kind === 'use' && k !== 'scroll' ? `<button class="btn small" data-use="${k}">Use</button>` : ['weapon', 'armor', 'charm'].includes(it.kind) ? `<button class="btn small" data-equip="${k}">Equip</button>` : ''; return `<div class="row"><span class="ri">${it.icon}</span><div><b>${it.name} ×${P.inv[k]}</b><small>${it.desc}</small></div>${act}</div>`; }).join('') : '<p class="muted">Empty.</p>'}</div>
      <p class="muted small">Stats: ${P.stats.kills} monsters defeated · ${P.stats.solved}/${P.stats.answered} answers correct · ${P.stats.realSolved} real contest problems solved</p>`;
  };
  body.addEventListener('click', (e) => {
    const u = e.target.closest('[data-use]'); if (u) { game.useItem(u.dataset.use); draw(); return; }
    const q = e.target.closest('[data-equip]'); if (q) { const k = q.dataset.equip; const kind = ITEMS[k].kind; if (P.equip[kind]) game.give(P.equip[kind]); P.equip[kind] = k; game.take(k); sound('magic'); const S = game.stats(); P.hp = Math.min(P.hp, S.maxHp); P.mp = Math.min(P.mp, S.maxMp); game.save(); draw(); return; }
    const s = e.target.closest('[data-unequip]'); if (s && P.equip[s.dataset.unequip]) { game.give(P.equip[s.dataset.unequip]); P.equip[s.dataset.unequip] = null; const S = game.stats(); P.hp = Math.min(P.hp, S.maxHp); P.mp = Math.min(P.mp, S.maxMp); game.save(); draw(); }
  });
  draw();
  panel('🎒 Bag & Equipment', body);
}
function openQuests() {
  ensureBounties();
  const Q = P.quests; const m = MAIN_QUEST[Q.main];
  const body = el('<div class="quests"></div>');
  const draw = () => {
    body.innerHTML = `<h3>🌟 Main story</h3><div class="quest main"><b>${m.title}</b><p>${m.text}</p><div class="shards">${[1, 2, 3, 4, 5].map((k) => `<span class="${Q.main > k ? 'got' : ''}">💎</span>`).join('')}</div></div>
      <h3>🎯 Daily bounties <small>(new every day)</small></h3>${Q.bounties.list.map((b, i) => { const d = BOUNTY_POOL.find((x) => x.id === b.id); const need = d.goal.n || d.goal.streak; return `<div class="quest ${b.claimed ? 'claimed' : b.done ? 'done' : ''}"><b>${d.text}</b><div class="qbar"><i style="width:${(100 * Math.min(need, b.progress || 0)) / need}%"></i></div><small>${Math.min(need, b.progress || 0)}/${need} · ${d.reward.xp} XP, ${d.reward.gold} gold</small>${b.done && !b.claimed ? `<button class="btn small" data-claim="${i}">Claim</button>` : b.claimed ? '<small>✅ Claimed</small>' : ''}</div>`; }).join('')}
      <h3>📜 Side quests</h3>${SIDE_QUESTS.filter((q) => Q.side[q.id]).map((q) => { const s = Q.side[q.id]; return `<div class="quest ${s.claimed ? 'claimed' : s.done ? 'done' : ''}"><b>${q.title}</b><p>${q.text} <small>(${ZONES[q.zone].name})</small></p><div class="qbar"><i style="width:${(100 * Math.min(q.goal.n, s.progress || 0)) / q.goal.n}%"></i></div><small>${s.claimed ? '✅ Done' : s.done ? 'Complete — return to Sage Germain' : `${s.progress || 0}/${q.goal.n}`}</small></div>`; }).join('') || '<p class="muted">Talk to Sage Germain in town for side quests.</p>'}`;
  };
  body.addEventListener('click', (e) => { const c = e.target.closest('[data-claim]'); if (!c) return; const b = Q.bounties.list[+c.dataset.claim]; const d = BOUNTY_POOL.find((x) => x.id === b.id); b.claimed = true; const x = game.gainXp(d.reward.xp); const g = game.addGold(d.reward.gold); sound('coin'); toast(`Bounty claimed: +${x.gained} XP, +${g} gold`); game.save(); draw(); });
  draw();
  panel('📜 Quests', body);
}
function openAbilities() {
  const cls = CLASSES[P.cls];
  const list = [{ ...cls.hint, level: 1 }, ...ABILITIES];
  panel('📖 Abilities', `<div class="abil">${list.map((a) => `<div class="row ${P.level < a.level ? 'locked' : ''}"><span class="ri">${P.level < a.level ? '🔒' : a.icon}</span><div><b>${a.name} <small>· ${a.mp} MP · Lv ${a.level}</small></b><small>${a.desc}</small></div></div>`).join('')}<p class="muted small">Use abilities during battles. Your class also deals +25% damage on ${cls.topic === 'nt' ? 'number theory' : cls.topic === 'counting' ? 'counting & probability' : cls.topic} questions.</p></div>`);
}
function openMap() {
  const here = world.zone; const atStone = world.map.waystone && Math.hypot(world.me.x - (world.map.waystone.x + 0.5), world.me.y - (world.map.waystone.y + 0.5)) < 1.6;
  const body = el(`<div class="worldmap">${ZONE_ORDER.map((z, i) => { const Z = ZONES[z]; const v = P.visited[z]; return `<div class="zrow ${z === here ? 'here' : ''} ${v ? '' : 'unknown'}"><span class="zi">${['🏘️', '🌾', '🌲', '⛰️', '🐸', '🏜️', '🏰'][i]}</span><div><b>${v ? Z.name : '???'}</b><small>${Z.sub}</small></div>${z === here ? '<small class="you">You are here</small>' : v && (atStone || here === 'town') ? `<button class="btn small" data-go="${z}">Travel</button>` : ''}</div>`; }).join('')}
    <p class="muted small">${atStone || here === 'town' ? 'Fast travel to any zone you have visited.' : 'Stand at a 🔷 waystone (or be in town) to fast travel.'}</p></div>`);
  body.addEventListener('click', (e) => { const b = e.target.closest('[data-go]'); if (!b) return; closePanel(); travel(b.dataset.go, null, true); });
  panel('🗺️ World of Numeria', body);
}
function openChat() {
  const log = window.__chatLog || [];
  const body = el(`<div class="chat"><div class="chat-log">${log.slice(-12).map((c) => `<p><b style="color:${c.color || '#fde68a'}">${c.from}</b> ${c.text}</p>`).join('') || '<p class="muted">No messages yet. Say hi!</p>'}</div>
    <h3>Quick chat</h3><div class="chat-grid">${CHAT.map((c) => `<button data-c="${c}">${c}</button>`).join('')}</div>
    <h3>Emotes</h3><div class="chat-grid emotes">${EMOTES.map((c) => `<button data-c="${c}">${c}</button>`).join('')}</div>
    <p class="muted small">${net.mode === 'online' ? (net.online ? '🟢 Connected to the Numeria server.' : '🟡 Connecting…') : 'Playing locally: players in your other tabs show up here. Real worldwide multiplayer turns on when MathScroll’s server (Supabase) is set up.'} Quick chat only, so chat stays friendly.</p></div>`);
  body.addEventListener('click', (e) => { const b = e.target.closest('[data-c]'); if (!b) return; net.chat(b.dataset.c); pushChat({ from: P.name, text: b.dataset.c, color: P.color }); closePanel(); });
  panel('💬 Chat', body);
}
function pushChat(c) { (window.__chatLog ||= []).push(c); const t = $('#chatTicker'); t.innerHTML = `<b style="color:${c.color || '#fde68a'}">${c.from}</b> ${c.text}`; t.classList.remove('show'); void t.offsetWidth; t.classList.add('show'); }
function openMenu() {
  const body = el(`<div class="menu">
    <button class="btn wide" data-m="help">❓ How to play</button>
    <button class="btn wide ghost" data-m="sound">${soundOn ? '🔊 Sound: on' : '🔇 Sound: off'}</button>
    <a class="btn wide ghost" href="../">↩ Back to MathScroll</a>
    <button class="btn wide ghost danger" data-m="reset">Start a new hero</button>
    <p class="muted small">Saved automatically on this device. Problems come from real AMC 8, AMC 10, AMC 12 and AIME contests (Easy2Hard-Bench and the AIME 1983–2024 set), with solutions on the AoPS Wiki.</p></div>`);
  body.addEventListener('click', (e) => {
    const b = e.target.closest('[data-m]'); if (!b) return;
    if (b.dataset.m === 'sound') { soundOn = !soundOn; try { localStorage.setItem('numeria:sound', soundOn ? 'on' : 'off'); } catch { /* */ } b.textContent = soundOn ? '🔊 Sound: on' : '🔇 Sound: off'; }
    if (b.dataset.m === 'help') help();
    if (b.dataset.m === 'reset') { if (b.dataset.sure) { localStorage.removeItem(SAVE); location.reload(); } else { b.dataset.sure = '1'; b.textContent = 'Tap again to delete this hero'; } }
  });
  panel('☰ Menu', body);
}
function help() {
  panel('❓ How to play', `<div class="help">
    <p><b>Move:</b> tap where you want to go (or use WASD / arrow keys).</p>
    <p><b>Talk:</b> tap a townsperson. Hypatia sells gear, Gauss heals you, Noether has daily bounties, Germain gives side quests, Ramanujan trains you.</p>
    <p><b>Fight:</b> walk into a monster. Regular monsters ask quick AMC-style questions — answer in under 6 seconds for a critical hit. <span style="color:#fbbf24">Elites</span> and <span style="color:#f87171">bosses</span> ask <b>real contest problems</b> (AMC 8 → AIME): take your time, type the answer, and use your abilities.</p>
    <p><b>Grow:</b> earn XP and gold, level up, buy gear, unlock abilities. Each zone guardian drops a 💎 Theorem Shard for the main story.</p>
    <p><b>Together:</b> other players appear in the same zone. Use quick chat, and team up on the hourly 🐉 Grand Examiner raid in the Citadel of AIME — every correct AIME answer from anyone damages it.</p></div>`);
}

// ------------------------------------------------------------------ battles & travel
async function battle(m) {
  if (paused) return;
  if (m.def.kind === 'raid' && net.raid.hp <= 0) { toast('🐉 The Grand Examiner has fallen this hour. It returns at the top of the hour!'); world.graceFor(3); return; }
  paused = true; closePanel();
  const res = await startBattle(game, m);
  paused = false;
  if (res.result === 'lose') { P.gold = Math.floor(P.gold * 0.9); const S = game.stats(); P.hp = S.maxHp; P.mp = Math.round(S.maxMp / 2); travel('town', null, true); }
  if (res.result === 'flee' || res.result === 'leave') world.graceFor(2.5);
  if (res.result === 'win' && m.def.kind === 'raid') { /* reward given */ }
  game.save();
}
function travel(zone, fromSide, toStone = false) {
  if (P.level < ZONES[zone].level[0] - 2 && !toStone) toast(`⚠️ ${ZONES[zone].name} is for level ${ZONES[zone].level[0]}+. Be careful!`);
  P.visited[zone] = true;
  world.loadZone(zone, fromSide, toStone && world ? null : null);
  if (toStone && world.map.waystone) { world.me.x = world.map.waystone.x - 0.5; world.me.y = world.map.waystone.y + 0.5; }
  net.setZone(zone);
  game.save();
}

// ------------------------------------------------------------------ title & character creation
function titleScreen() {
  const ui = $('#ui');
  const t = el(`<div class="title"><div class="title-inner"><div class="logo">∑ Numeria</div><p class="tag">A maths MMO · from AMC 8 to the AIME</p>
    ${P ? `<button class="btn big cont">Continue as ${P.name} <small>Lv ${P.level} ${CLASSES[P.cls].name}</small></button><button class="btn ghost new">New hero</button>` : '<button class="btn big new">Create your hero</button>'}
    <a class="link back" href="../">↩ Back to MathScroll</a></div></div>`);
  ui.appendChild(t);
  t.querySelector('.cont')?.addEventListener('click', () => { t.remove(); startGame(); });
  t.querySelector('.new').addEventListener('click', () => { t.remove(); createHero(); });
}
function createHero() {
  const r = (a) => a[Math.floor(Math.random() * a.length)];
  let cls = 'algebraist'; let a = r(NAME_A); let b = r(NAME_B); let color = r(COLORS);
  const c = el(`<div class="title create"><div class="title-inner"><h2>Create your hero</h2>
    <div class="classes">${Object.entries(CLASSES).map(([k, v]) => `<button class="cls ${k === cls ? 'on' : ''}" data-c="${k}" style="--cc:${v.color}"><span>${v.icon}</span><b>${v.name}</b><small>${v.role} · ${v.blurb}</small><em>${v.hint.icon} ${v.hint.name}: ${v.hint.desc}</em></button>`).join('')}</div>
    <h3>Name</h3><div class="namer"><select class="na">${NAME_A.map((x) => `<option ${x === a ? 'selected' : ''}>${x}</option>`).join('')}</select><select class="nb">${NAME_B.map((x) => `<option ${x === b ? 'selected' : ''}>${x}</option>`).join('')}</select><button class="btn ghost dice" aria-label="Random name">🎲</button></div>
    <h3>Colour</h3><div class="colors">${COLORS.map((x) => `<button style="background:${x}" data-col="${x}" class="${x === color ? 'on' : ''}"></button>`).join('')}</div>
    <div class="preview"></div>
    <button class="btn big go">Enter Numeria</button></div></div>`);
  const prev = () => { c.querySelector('.preview').innerHTML = `<span class="pv-icon" style="border-color:${color}">${CLASSES[cls].icon}</span><b style="color:${color}">${a}${b}</b><small>Level 1 ${CLASSES[cls].name}</small>`; };
  c.addEventListener('click', (e) => {
    const k = e.target.closest('[data-c]'); if (k) { cls = k.dataset.c; c.querySelectorAll('.cls').forEach((x) => x.classList.toggle('on', x === k)); sound('click'); prev(); }
    const col = e.target.closest('[data-col]'); if (col) { color = col.dataset.col; c.querySelectorAll('[data-col]').forEach((x) => x.classList.toggle('on', x === col)); prev(); }
    if (e.target.closest('.dice')) { a = r(NAME_A); b = r(NAME_B); c.querySelector('.na').value = a; c.querySelector('.nb').value = b; prev(); }
  });
  c.querySelector('.na').addEventListener('change', (e) => { a = e.target.value; prev(); });
  c.querySelector('.nb').addEventListener('change', (e) => { b = e.target.value; prev(); });
  c.querySelector('.go').addEventListener('click', () => { P = newHero(`${a}${b}`, cls, color); c.remove(); startGame(true); });
  prev();
  $('#ui').appendChild(c);
}

// ------------------------------------------------------------------ boot
function startGame(fresh = false) {
  $('#hud').hidden = false; $('#side').hidden = false;
  ensureBounties();
  const canvas = $('#world');
  world = createWorld(canvas, {
    onNpc: talk,
    onBattle: (m) => battle(m),
    onWaystone: () => { if (!P.visited[world.zone]) P.visited[world.zone] = true; toast('🔷 Waystone attuned. Open the map to fast travel.'); openMap(); },
    onExit: (to, side) => travel(to, side),
    onZone: (z) => { zoneBanner(z); P.visited[z] = true; },
    onPlayer: (o) => toast(`${o.npc ? '🤖 NPC adventurer' : '🧑 Player'} ${o.name} · Lv ${o.level} ${CLASSES[o.cls]?.name || ''}`),
  });
  Object.assign(world.me, { name: P.name, cls: P.cls, color: P.color, level: P.level });
  net = createNet({
    me: { id: deviceId, get name() { return P.name; }, get cls() { return P.cls; }, get color() { return P.color; }, get level() { return P.level; } },
    world,
    onChat: (c) => pushChat(c),
    onPeers: (n) => { $('#online').textContent = n ? `🟢 ${n} player${n === 1 ? '' : 's'} here` : (net?.mode === 'online' ? '🟢 Online' : '⚪ Local play'); },
    onRaid: () => { updateRaidBar(); game.onRaidUpdate?.(); },
    onRaidWon: (r) => { if (r.mine > 0) { game.event({ type: 'raid' }); const x = game.gainXp(400); const g = game.addGold(250); game.give('hipotion'); toast(`🐉 RAID VICTORY! The Grand Examiner falls. +${x.gained} XP, +${g} gold`); sound('win'); game.save(); } else toast('🐉 Other adventurers defeated the Grand Examiner!'); },
  });
  world.loadZone(P.zone || 'town', null, P.x != null ? { x: P.x, y: P.y } : null);
  net.setZone(world.zone);
  hud();
  // side buttons
  $('#qBtn').onclick = openQuests; $('#bagBtn').onclick = openBag; $('#mapBtn').onclick = openMap; $('#chatBtn').onclick = openChat; $('#menuBtn').onclick = openMenu;
  if (fresh) setTimeout(() => dialog(NPCS.elder ? { ...NPCS.elder, id: 'elder' } : {}, `Welcome to Numeria, ${P.name}! ${ELDER_LINES[0]} Come and find me by the fountain — tap the ground to walk, tap people to talk.`, [{ label: 'Let’s go!' }, { label: 'How to play', ghost: true, run: help }]), 400);
  let last = performance.now();
  const loop = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    world.update(dt, paused || !!document.querySelector('.battle'));
    net.tick(dt);
    world.render(now / 1000);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  setInterval(() => game.save(), 15000);
  // regen MP slowly out of battle
  setInterval(() => { if (!document.querySelector('.battle')) { const S = game.stats(); P.mp = Math.min(S.maxMp, P.mp + 1); if (world.zone === 'town') P.hp = Math.min(S.maxHp, P.hp + 2); hud(); } }, 4000);
  window.addEventListener('beforeunload', () => { net.bye(); game.save(); });
  window.__numeria = { game, world, net, get P() { return P; }, battle, travel, talk };
}
titleScreen();
