// Campaigns: every game has 12 levels with 1–3 stars, a boss every fourth level, and a star road
// across all games that pays out rewards. Games read their level from `opt.stage` and report back
// through stageResult(). Endless mode is the original free-play version of each game.

const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

// ---- level builders (each returns { name, goal, p, s, lower, unit, starText, boss })
const pts = (s) => `★ ${s[0]} · ★★ ${s[1]} · ★★★ ${s[2]}`;
const low = (s, u) => `★ ≤${s[0]}${u} · ★★ ≤${s[1]}${u} · ★★★ ≤${s[2]}${u}`;

const BB = (name, p, s, boss) => ({ name, boss, p, s, unit: 'points',
  goal: `${p.gems ? `Collect all ${p.gems} 💎 and score` : 'Score'} as many points as you can with ${p.pieces} pieces.${p.stones ? ` ${p.stones} stone blocks are in the way.` : ''}`, starText: pts(s) + ' points' });
const T24 = (name, p, s, boss) => ({ name, boss, p, s, unit: 'solved',
  goal: `${p.target === 'mix' ? 'Hit a different target every time' : `Make ${p.target}`} with all four numbers${p.max > 9 ? ' (numbers up to 13)' : ''}. ${p.time}s on the clock.`, starText: pts(s) + ' puzzles' });
const CH = (name, rating, n, boss) => ({ name, boss, p: { rating, n, lives: boss ? 1 : 2 }, unit: 'solved',
  goal: `Solve ${n} puzzles rated about ${rating}. ${boss ? 'One mistake and it’s over.' : 'You can afford one mistake.'}`, starText: `★ finish · ★★ no mistakes · ★★★ no mistakes or hints` });
const SU = (name, size, givens, lives, boss) => ({ name, boss, p: { size, givens, lives }, unit: '',
  goal: `Fill the ${size}×${size} grid. ${lives} mistake${lives === 1 ? '' : 's'} and you’re out. Use ✏️ notes to keep track.`, starText: '★ solve · ★★ ≤1 mistake · ★★★ no mistakes or hints' });
const MI = (name, R, C, M, s, shield, boss) => ({ name, boss, p: { R, C, M, shield }, s, lower: true, unit: 's',
  goal: `Clear a ${C}×${R} field with ${M} mines.${shield ? ' 🛡️ A shield saves you from the first mine.' : ''} Tap a number to open around it once it’s flagged.`, starText: low(s, 's') });
const MM = (name, len, pool, tries, repeats, s, boss) => ({ name, boss, p: { len, pool, tries, repeats }, s, lower: true, unit: 'guesses',
  goal: `Crack a ${len}-digit code using digits 0–${pool - 1}${repeats ? ', digits can repeat' : ', all different'}. ${tries} tries.`, starText: low(s, '') + ' guesses' });
const ME = (name, pairs, pool, time, boss) => { const s = [Math.round(pairs * 2.6), Math.round(pairs * 2.1), Math.round(pairs * 1.7)]; return { name, boss, p: { pairs, pool, time }, s, lower: true, unit: 'moves',
  goal: `Match ${pairs} pairs of equal values${time ? ` in ${time}s` : ''}.`, starText: low(s, '') + ' moves' }; };
const NI = (name, p, boss) => ({ name, boss, p, unit: '',
  goal: `${{ normal: 'Take the last stone to win.', misere: 'Misère: whoever takes the last stone LOSES.' }[p.v]} ${p.heaps} rows of up to ${p.max}.${p.k ? ` Take at most ${p.k} at a time.` : ''}${boss ? ' Best of 3.' : ''}`, starText: '★ win · ★★ ≤1 hint · ★★★ no hints' });
const G2 = (name, p, boss) => { const base = { 64: [70, 52, 40], 128: [130, 100, 82], 256: [240, 190, 160], 512: [470, 380, 320], 1024: [920, 760, 650] }[p.goal]; const s = base.map((x) => Math.round(x * (p.N === 5 ? 0.95 : p.N === 3 ? 1.15 : 1))); return { name, boss, p, s, lower: true, unit: 'moves',
  goal: `Reach the ${p.goal} tile on a ${p.N}×${p.N} board${p.rocks ? ` with ${p.rocks} 🪨 rock${p.rocks > 1 ? 's' : ''}` : ''}. One free ↩️ undo.`, starText: low(s, '') + ' moves' }; };
const BZ = (name, p, s, boss) => ({ name, boss, p, s, unit: 'points',
  goal: `${p.time}s of ${p.label}.${p.sudden ? ' Sudden death: one wrong answer ends it.' : ''}`, starText: pts(s) + ' points' });
const NJ = (name, p, s, boss) => ({ name, boss, p, s, unit: 'points',
  goal: `Slice ${p.rules.length > 1 ? 'whatever the rule says (it changes!)' : `only the ${p.label}`} for ${p.time}s. Lose all hearts and you fail.${p.bombs ? ' Watch for 💣.' : ''} Grab ❄️ ⭐ ❤️ power-ups.`, starText: pts(s) + ' points' });
const MT = (name, p, boss) => ({ name, boss, p, unit: '',
  goal: `Survive ${p.waves} wave${p.waves > 1 ? 's' : ''}${p.start > 1 ? ` starting at wave ${p.start}` : ''}.${p.boss ? ' Then defeat the 👾 Mothership.' : ''}`, starText: '★ survive · ★★ 2 shields left · ★★★ no damage' });

export const STAGES = {
  blockblast: [
    BB('First blocks', { pieces: 15 }, [100, 180, 240]), BB('Stepping stones', { pieces: 18, stones: 4 }, [140, 220, 320]), BB('Gem hunt', { pieces: 18, gems: 3, stones: 3 }, [100, 210, 320]),
    BB('Rubble boss', { pieces: 21, stones: 12 }, [180, 280, 420], true), BB('Long game', { pieces: 24 }, [280, 420, 560]), BB('Hidden gems', { pieces: 24, gems: 5, stones: 6 }, [210, 350, 490]),
    BB('Quarry', { pieces: 27, stones: 8 }, [350, 520, 700]), BB('Gem vault boss', { pieces: 30, gems: 6, stones: 14 }, [320, 490, 660], true), BB('Marathon', { pieces: 30 }, [560, 770, 980]),
    BB('Treasure', { pieces: 33, gems: 8, stones: 10 }, [420, 630, 840]), BB('Landslide', { pieces: 36, stones: 18 }, [630, 910, 1190]), BB('Grand clear', { pieces: 45, gems: 10, stones: 16 }, [840, 1190, 1540], true),
  ],
  g24: [
    T24('Make ten', { target: 10, time: 90, max: 6 }, [3, 5, 7]), T24('Classic 24', { target: 24, time: 120, max: 9 }, [3, 5, 7]), T24('A dozen', { target: 12, time: 90, max: 9 }, [3, 5, 7]),
    T24('Speed 24 boss', { target: 24, time: 60, max: 9 }, [3, 4, 6], true), T24('Thirty-six', { target: 36, time: 120, max: 9 }, [3, 5, 7]), T24('Face cards', { target: 24, time: 150, max: 13 }, [3, 5, 7]),
    T24('Eighteen', { target: 18, time: 90, max: 9 }, [3, 5, 7]), T24('Forty-eight boss', { target: 48, time: 120, max: 9 }, [3, 4, 6], true), T24('Sixty', { target: 60, time: 120, max: 13 }, [2, 4, 6]),
    T24('Thirty', { target: 30, time: 100, max: 9 }, [3, 5, 7]), T24('Seventy-two', { target: 72, time: 120, max: 13 }, [2, 4, 5]), T24('Moving targets', { target: 'mix', time: 150, max: 13 }, [3, 5, 7], true),
  ],
  chess: [
    CH('Opening moves', 600, 3), CH('Spot the threat', 700, 3), CH('Tactics', 800, 3), CH('Club boss', 900, 4, true),
    CH('Sharper', 1000, 3), CH('Combinations', 1100, 3), CH('Deep tactics', 1200, 3), CH('Expert boss', 1300, 4, true),
    CH('Master class', 1400, 3), CH('Calculation', 1500, 3), CH('Grandmaster ideas', 1600, 3), CH('Champion boss', 1800, 4, true),
  ],
  sudoku: [
    SU('Mini', 4, 8, 3), SU('Mini plus', 4, 6, 3), SU('Six', 6, 22, 3), SU('Six boss', 6, 16, 2, true),
    SU('Full grid', 9, 46, 3), SU('Getting there', 9, 42, 3), SU('Thinker', 9, 38, 3), SU('Logic boss', 9, 34, 2, true),
    SU('Hard', 9, 32, 3), SU('Harder', 9, 30, 3), SU('Expert', 9, 28, 2), SU('Grandmaster boss', 9, 26, 1, true),
  ],
  mines: [
    MI('Tiny field', 6, 6, 4, [60, 35, 20], true), MI('Small field', 7, 7, 6, [80, 50, 30], true), MI('Meadow', 8, 8, 9, [110, 70, 45], true), MI('Minefield boss', 9, 8, 13, [150, 100, 70], false, true),
    MI('Classic', 10, 8, 12, [150, 100, 70]), MI('Crowded', 10, 8, 14, [170, 120, 80]), MI('Wide', 11, 9, 16, [200, 140, 100]), MI('Sapper boss', 12, 9, 20, [260, 180, 130], false, true),
    MI('Dense', 12, 9, 22, [280, 200, 150]), MI('Big field', 13, 9, 24, [320, 230, 170]), MI('Danger zone', 14, 9, 27, [360, 260, 200]), MI('Bomb squad boss', 14, 10, 32, [420, 300, 230], false, true),
  ],
  mastermind: [
    MM('Three digits', 3, 6, 10, false, [7, 5, 4]), MM('More digits', 3, 8, 10, false, [7, 6, 4]), MM('Four', 4, 6, 10, false, [8, 6, 5]), MM('Vault boss', 4, 8, 8, false, [8, 6, 5], true),
    MM('Full keypad', 4, 10, 10, false, [9, 7, 5]), MM('Echoes', 3, 6, 10, true, [8, 6, 4]), MM('Echo four', 4, 8, 10, true, [9, 7, 5]), MM('Five lock boss', 5, 8, 12, false, [11, 9, 7], true),
    MM('Repeats', 4, 10, 10, true, [9, 7, 6]), MM('Five', 5, 10, 12, false, [11, 9, 7]), MM('Five echoes', 5, 8, 12, true, [11, 9, 7]), MM('Bank vault boss', 6, 10, 14, false, [13, 11, 9], true),
  ],
  memory: [
    ME('Warm-up', 4, 'easy'), ME('Five pairs', 5, 'easy'), ME('Six pairs', 6, 'mid'), ME('Speed boss', 6, 'mid', 60, true),
    ME('Seven', 7, 'mid'), ME('Eight', 8, 'mid'), ME('Tricky', 8, 'hard'), ME('Clock boss', 8, 'hard', 75, true),
    ME('Nine', 9, 'hard'), ME('Ten', 10, 'mid'), ME('Ten hard', 10, 'hard'), ME('Mega boss', 12, 'hard', 130, true),
  ],
  nim: [
    NI('First moves', { v: 'normal', heaps: 2, max: 5, skill: 0.35 }), NI('Three rows', { v: 'normal', heaps: 3, max: 5, skill: 0.5 }), NI('Take three', { v: 'normal', heaps: 2, max: 9, k: 3, skill: 0.6 }),
    NI('Nim boss', { v: 'normal', heaps: 3, max: 7, skill: 0.85, bo3: true }, true), NI('Misère', { v: 'misere', heaps: 3, max: 5, skill: 0.6 }), NI('Four rows', { v: 'normal', heaps: 4, max: 7, skill: 0.75 }),
    NI('Take two', { v: 'normal', heaps: 3, max: 8, k: 2, skill: 0.75 }), NI('Misère boss', { v: 'misere', heaps: 4, max: 6, skill: 0.9, bo3: true }, true), NI('Take four', { v: 'normal', heaps: 3, max: 10, k: 4, skill: 0.85 }),
    NI('Five rows', { v: 'normal', heaps: 5, max: 7, skill: 0.9 }), NI('Upside down', { v: 'misere', heaps: 4, max: 8, k: 3, skill: 0.9 }), NI('Grand Nim boss', { v: 'normal', heaps: 5, max: 9, skill: 1, bo3: true }, true),
  ],
  g2048: [
    G2('Sixty-four', { N: 4, goal: 64 }), G2('One-two-eight', { N: 4, goal: 128 }), G2('Roomy', { N: 5, goal: 256 }), G2('Tiny board boss', { N: 3, goal: 64 }, true),
    G2('Two-five-six', { N: 4, goal: 256 }), G2('The rock', { N: 4, goal: 128, rocks: 1 }), G2('Big board', { N: 5, goal: 512 }), G2('Boulders boss', { N: 4, goal: 256, rocks: 2 }, true),
    G2('Five-twelve', { N: 4, goal: 512 }), G2('Rocky road', { N: 5, goal: 512, rocks: 2 }), G2('Thousand', { N: 4, goal: 1024 }), G2('Summit boss', { N: 4, goal: 1024, rocks: 1 }, true),
  ],
  blitz: [
    BZ('Arithmetic', { time: 45, kinds: ['arith'], label: 'arithmetic' }, [120, 220, 320]), BZ('Bigger or smaller', { time: 45, kinds: ['arith', 'compare'], label: 'sums and comparisons' }, [120, 220, 320]),
    BZ('Primes & patterns', { time: 45, kinds: ['prime', 'sequence'], label: 'primes and sequences' }, [100, 200, 300]), BZ('Sudden death boss', { time: 60, kinds: ['arith', 'compare', 'prime', 'sequence'], label: 'mixed questions', sudden: true }, [80, 160, 260], true),
    BZ('Algebra', { time: 45, kinds: ['solvex', 'estimate'], label: 'algebra and estimation' }, [100, 200, 300]), BZ('Digits', { time: 45, kinds: ['units', 'divisors'], label: 'last digits and divisors' }, [100, 200, 300]),
    BZ('Number systems', { time: 45, kinds: ['mod', 'binary'], label: 'remainders and binary' }, [100, 200, 300]), BZ('Geometry boss', { time: 60, kinds: ['angle', 'solvex', 'mod', 'units'], label: 'angles and more', sudden: true }, [80, 160, 260], true),
    BZ('Everything', { time: 60, kinds: null, label: 'everything' }, [180, 300, 450]), BZ('Level up', { time: 60, kinds: null, label: 'harder questions', lvl: 3 }, [150, 260, 400]),
    BZ('Quick fire', { time: 40, kinds: null, label: 'everything, fast' }, [120, 220, 330]), BZ('Final exam boss', { time: 75, kinds: null, label: 'hard questions', lvl: 3, sudden: true }, [100, 220, 360], true),
  ],
  ninja: [
    NJ('Evens', { time: 40, rules: [1], label: 'even numbers' }, [150, 280, 420]), NJ('Threes', { time: 40, rules: [0], label: 'multiples of 3' }, [150, 280, 420]), NJ('Squares', { time: 45, rules: [3], label: 'perfect squares' }, [120, 240, 360]),
    NJ('Prime boss', { time: 55, rules: [2], label: 'primes', bombs: true, speed: 1.2 }, [200, 380, 560], true), NJ('Fours', { time: 45, rules: [4], label: 'multiples of 4', bombs: true }, [180, 320, 480]), NJ('Sevens', { time: 45, rules: [5], label: 'multiples of 7', bombs: true }, [150, 280, 420]),
    NJ('Factors', { time: 50, rules: [7], label: 'factors of 60', bombs: true }, [180, 330, 500]), NJ('Shapeshifter boss', { time: 60, rules: [0, 1, 2, 3], label: '', bombs: true, speed: 1.3, every: 12 }, [250, 450, 650], true), NJ('Digit sums', { time: 50, rules: [6], label: 'numbers with digit sum 9', bombs: true }, [150, 280, 420]),
    NJ('Fast primes', { time: 50, rules: [2], label: 'primes', bombs: true, speed: 1.45 }, [220, 400, 600]), NJ('Chaos', { time: 60, rules: [0, 2, 4, 5, 7], label: '', bombs: true, speed: 1.4, every: 10 }, [250, 450, 650]), NJ('Ninja master boss', { time: 75, rules: [0, 1, 2, 3, 4, 5, 6, 7], label: '', bombs: true, speed: 1.6, every: 9 }, [350, 600, 900], true),
  ],
  meteor: [
    MT('First contact', { waves: 2, start: 1 }), MT('Incoming', { waves: 3, start: 1 }), MT('Faster rocks', { waves: 3, start: 2 }), MT('Mothership boss', { waves: 2, start: 2, boss: 5 }, true),
    MT('Storm', { waves: 4, start: 2 }), MT('Squares & roots', { waves: 4, start: 3 }), MT('Barrage', { waves: 5, start: 3 }), MT('Twin boss', { waves: 3, start: 4, boss: 7 }, true),
    MT('Percent rain', { waves: 5, start: 4 }), MT('Powers', { waves: 5, start: 5 }), MT('Last line', { waves: 6, start: 5 }), MT('Armageddon boss', { waves: 4, start: 6, boss: 10 }, true),
  ],
};

// ---- progress
const prog = (ctx, id) => { const c = ctx.campaign(); return (c[id] ||= []); };
export const gameStars = (ctx, id) => prog(ctx, id).reduce((a, b) => a + (b || 0), 0);
export const totalStars = (ctx) => Object.keys(STAGES).reduce((a, id) => a + gameStars(ctx, id), 0);
export const MAX_STARS = Object.values(STAGES).reduce((a, s) => a + s.length * 3, 0);
const unlocked = (ctx, id, i) => i === 0 || (prog(ctx, id)[i - 1] || 0) > 0;
export function starsFor(stage, v) {
  if (!stage.s || v == null) return 0;
  return stage.s.filter((t) => (stage.lower ? v <= t : v >= t)).length;
}

// ---- star road: rewards for stars across all games
export const ROAD = [
  { at: 5, title: 'Rookie', charges: 3, xp: 50 }, { at: 15, title: 'Player', charges: 4, xp: 80 }, { at: 30, title: 'Contender', charges: 5, xp: 120 },
  { at: 50, title: 'Challenger', charges: 6, xp: 160 }, { at: 75, title: 'Strategist', charges: 8, xp: 220 }, { at: 105, title: 'Tactician', charges: 10, xp: 280 },
  { at: 140, title: 'Virtuoso', charges: 12, xp: 350 }, { at: 180, title: 'Champion', charges: 14, xp: 420 }, { at: 230, title: 'Hero', charges: 16, xp: 500 },
  { at: 290, title: 'Legend', charges: 20, xp: 600 }, { at: 360, title: 'Mythic', charges: 25, xp: 750 }, { at: MAX_STARS, title: 'Perfectionist', charges: 40, xp: 1200 },
];
export const roadTitle = (ctx) => ROAD.filter((r) => totalStars(ctx) >= r.at).pop()?.title || null;
export function roadHtml(ctx) {
  const t = totalStars(ctx); const next = ROAD.find((r) => t < r.at);
  const prev = [...ROAD].reverse().find((r) => t >= r.at)?.at || 0;
  const pct = next ? Math.round(((t - prev) / (next.at - prev)) * 100) : 100;
  return `<button class="gm-road"><span class="gr-star">⭐</span><span class="gr-mid"><b>${t} / ${MAX_STARS} stars</b><small>${next ? `${next.at - t} more for <b>${next.title}</b> · +${next.charges}⚡ +${next.xp} XP` : 'Every reward collected!'}</small><span class="gr-bar"><i style="width:${pct}%"></i></span></span><span class="gm-go">›</span></button>`;
}
export function openRoad(ctx, back) {
  const t = totalStars(ctx);
  const body = el(`<div class="road"><p class="small">Earn stars in any game’s levels. Every milestone pays out ⚡ and XP and gives you a new title.</p>
    <div class="road-list">${ROAD.map((r) => `<div class="road-step ${t >= r.at ? 'got' : ''}"><span class="rs-at">⭐ ${r.at}</span><span class="rs-mid"><b>${r.title}</b><small>+${r.charges}⚡ · +${r.xp} XP</small></span><span class="rs-ok">${t >= r.at ? '✓' : '🔒'}</span></div>`).join('')}</div>
    <h4 class="gm-cat">Stars by game</h4><div class="road-games">${Object.keys(STAGES).map((id) => `<div><span>${ctx.gameMeta(id)?.icon || ''} ${ctx.gameMeta(id)?.name || id}</span><b>${gameStars(ctx, id)}/36</b></div>`).join('')}</div>
    <button class="btn ghost wide back">Back to games</button></div>`);
  body.querySelector('.back').addEventListener('click', back);
  ctx.openSheet('Star road', body, 'tall');
}
function payRoad(ctx, before, after) {
  for (const r of ROAD) if (before < r.at && after >= r.at) {
    ctx.refund(r.charges); ctx.gainXp(r.xp);
    setTimeout(() => ctx.toast(`⭐ Star road: you’re now a ${r.title}! +${r.charges}⚡ +${r.xp} XP`), 1200);
  }
}

// ---- level map for one game
export function openLevels(ctx, g, { play, endless, howTo }) {
  const list = STAGES[g.id]; const p = prog(ctx, g.id);
  const got = gameStars(ctx, g.id); const best = ctx.bests()[g.id];
  const firstOpen = list.findIndex((_, i) => unlocked(ctx, g.id, i) && !p[i]);
  const node = (s, i) => {
    const open = unlocked(ctx, g.id, i); const st = p[i] || 0;
    return `<button class="lv-node ${open ? '' : 'locked'} ${s.boss ? 'boss' : ''} ${i === firstOpen ? 'next' : ''} ${st === 3 ? 'perfect' : ''}" data-i="${i}" ${open ? '' : 'disabled'}>
      <span class="lv-num">${open ? (s.boss ? '👹' : i + 1) : '🔒'}</span><span class="lv-stars">${[0, 1, 2].map((k) => `<i class="${k < st ? 'on' : ''}">★</i>`).join('')}</span><small>${s.name}</small></button>`;
  };
  const body = el(`<div class="levels">
    <div class="lv-head"><span class="lv-icon">${g.icon}</span><div><h3>${g.name}</h3><p class="small">${g.blurb}</p></div></div>
    <div class="lv-prog"><span>⭐ <b>${got}</b>/36</span><span class="gr-bar"><i style="width:${Math.round((got / 36) * 100)}%"></i></span><button class="link lv-how">How to play</button></div>
    <div class="lv-path">${list.map(node).join('')}</div>
    <button class="lv-endless"><span>♾️</span><span><b>Endless mode</b><small>${best != null && best > 0 ? `Best ${ctx.bestLabel(g.id, best)}` : 'The classic game, no limits'} · ${g.cost}</small></span><span class="gm-go">›</span></button>
    <button class="btn ghost wide lv-back">‹ All games</button></div>`);
  body.querySelectorAll('.lv-node:not(.locked)').forEach((b) => b.addEventListener('click', () => stageCard(ctx, g, +b.dataset.i, play)));
  body.querySelector('.lv-endless').addEventListener('click', endless);
  body.querySelector('.lv-how').addEventListener('click', howTo);
  body.querySelector('.lv-back').addEventListener('click', () => ctx.openGames());
  ctx.openSheet(g.name, body, 'tall');
  requestAnimationFrame(() => body.querySelector('.lv-node.next')?.scrollIntoView({ block: 'center' }));
}
function stageCard(ctx, g, i, play) {
  const s = STAGES[g.id][i]; const st = prog(ctx, g.id)[i] || 0;
  const pop = el(`<div class="lv-pop"><div class="lv-card ${s.boss ? 'boss' : ''}">
    <small>${s.boss ? '👹 BOSS LEVEL' : `LEVEL ${i + 1}`}</small><h3>${s.name}</h3>
    <div class="lv-stars big">${[0, 1, 2].map((k) => `<i class="${k < st ? 'on' : ''}">★</i>`).join('')}</div>
    <p>${s.goal}</p><p class="small lv-goals">${s.starText}</p>
    <button class="btn wide lv-play">${st ? 'Play again' : 'Play'}${g.cost.includes('⚡') ? ' · 1⚡' : ''}</button><button class="btn ghost wide lv-x">Back</button></div></div>`);
  document.body.appendChild(pop);
  const close = () => pop.remove();
  pop.addEventListener('click', (e) => { if (e.target === pop) close(); });
  pop.querySelector('.lv-x').addEventListener('click', close);
  pop.querySelector('.lv-play').addEventListener('click', () => { close(); play(i); });
}

// ---- end of a level
// value: the level's main number (checked against s); or pass stars directly. fail: didn't finish.
export function stageResult(ctx, body, { id, idx, value, stars, fail = false, big, unit = '', line = '', share, retry, next, levels }) {
  const s = STAGES[id][idx];
  const n = fail ? 0 : Math.max(stars ?? starsFor(s, value), 0);
  const won = n > 0;
  const p = prog(ctx, id); const prev = p[idx] || 0;
  const before = totalStars(ctx);
  if (n > prev) { p[idx] = n; ctx.saveCampaign(); }
  const after = totalStars(ctx);
  const fresh = Math.max(0, n - prev);
  const xp = won ? 8 + idx * 2 + fresh * (12 + idx * 3) + (s.boss && !prev ? 25 : 0) : 3;
  const gained = ctx.gameDone(id, xp) ?? xp;
  payRoad(ctx, before, after);
  const nextOpen = won && idx < STAGES[id].length - 1;
  const why = !won ? (fail ? 'Level failed' : `Not enough for a star — you needed ${s.lower ? `${s.s[0]} or fewer` : `at least ${s.s?.[0]}`}`) : '';
  body.innerHTML = `<div class="stage-done ${won ? 'won' : 'lost'} ${s.boss ? 'boss' : ''}">
    <small class="gd-title">${s.boss ? '👹 ' : ''}Level ${idx + 1} · ${s.name}</small>
    <div class="sd-stars">${[0, 1, 2].map((k) => `<i class="${k < n ? 'on' : ''}" style="--d:${k * 0.25}s">★</i>`).join('')}</div>
    <h3>${won ? (n === 3 ? 'Perfect!' : n === 2 ? 'Great job!' : 'Level cleared!') : 'So close!'}</h3>
    ${big != null ? `<div class="score">${big}<small> ${unit}</small></div>` : ''}
    <p>${[why, line, `+${gained} XP`, fresh && prev ? `New best: ${n}★` : ''].filter(Boolean).join(' · ')}</p>
    <p class="small sd-goals">${s.starText}</p>
    ${nextOpen ? '<button class="btn wide sd-next">Next level ›</button>' : ''}
    <button class="btn ${nextOpen ? 'ghost' : ''} wide sd-retry">${won ? 'Replay for more stars' : 'Try again'}</button>
    <div class="sd-row"><button class="btn ghost sd-levels">Levels</button>${share ? '<button class="btn ghost sd-share">Share</button>' : ''}</div></div>`;
  if (n === 3) setTimeout(() => ctx.confetti?.(), 700);
  ctx.sound(won ? 'level' : 'wrong');
  body.querySelector('.sd-next')?.addEventListener('click', next);
  body.querySelector('.sd-retry').addEventListener('click', retry);
  body.querySelector('.sd-levels').addEventListener('click', levels);
  body.querySelector('.sd-share')?.addEventListener('click', () => ctx.shareText(share));
  body.closest('.sheet-body, .sheet')?.scrollTo?.({ top: 0 });
  return n;
}
