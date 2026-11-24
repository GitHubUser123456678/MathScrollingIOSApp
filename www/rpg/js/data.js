// Numeria game data: classes, abilities, items, monsters, zones, NPCs, quests, names and quick chat.

export const CLASSES = {
  algebraist: {
    name: 'Algebraist', icon: '🧙', color: '#a78bfa', role: 'Mage', topic: 'algebra',
    blurb: 'Bends equations to their will. Bonus damage on algebra.',
    base: { hp: 90, mp: 40, atk: 12, def: 2 },
    hint: { id: 'estimate', name: 'Estimate', icon: '📏', mp: 6, desc: 'Shows a range the answer lies in.' },
  },
  geometer: {
    name: 'Geometer', icon: '🏹', color: '#34d399', role: 'Ranger', topic: 'geometry',
    blurb: 'Sees the hidden lines in every figure. Bonus damage on geometry.',
    base: { hp: 105, mp: 30, atk: 13, def: 3 },
    hint: { id: 'sketch', name: 'Sketch', icon: '✏️', mp: 6, desc: 'Reveals the first step of the solution (or a key formula).' },
  },
  theorist: {
    name: 'Number Theorist', icon: '🗡️', color: '#f87171', role: 'Rogue', topic: 'nt',
    blurb: 'Strikes at the remainders. Bonus damage on number theory.',
    base: { hp: 95, mp: 32, atk: 14, def: 2 },
    hint: { id: 'lastdigit', name: 'Last Digit', icon: '🔚', mp: 6, desc: 'Reveals the last digit of the answer.' },
  },
  combinatorist: {
    name: 'Combinatorist', icon: '🔮', color: '#60a5fa', role: 'Summoner', topic: 'counting',
    blurb: 'Counts every possibility. Bonus damage on counting and probability.',
    base: { hp: 88, mp: 45, atk: 12, def: 2 },
    hint: { id: 'eliminate', name: 'Eliminate', icon: '✂️', mp: 6, desc: 'Removes two wrong choices (or tells you if the answer is even or odd).' },
  },
};
export const PER_LEVEL = { hp: 12, mp: 4, atk: 2, def: 1 };
// Abilities everyone unlocks as they level up (plus their class hint at level 1).
export const ABILITIES = [
  { id: 'focus', name: 'Focus', icon: '🎯', mp: 8, level: 3, desc: 'Your next correct answer deals +75% damage.' },
  { id: 'heal', name: 'Heal', icon: '💚', mp: 10, level: 5, desc: 'Restore 40% of your HP.' },
  { id: 'shield', name: 'Second Chance', icon: '🛡️', mp: 12, level: 8, desc: 'Your next wrong answer costs no HP.' },
  { id: 'overdrive', name: 'Overdrive', icon: '⚡', mp: 20, level: 12, desc: 'Your next correct answer deals triple damage.' },
];
export const xpToNext = (lv) => Math.round(40 * lv ** 1.6);
export const MAX_LEVEL = 30;

export const ITEMS = {
  potion: { name: 'Potion', icon: '🧪', kind: 'use', price: 15, heal: 45, desc: 'Restores 45 HP.' },
  hipotion: { name: 'Hi-Potion', icon: '⚗️', kind: 'use', price: 45, heal: 130, desc: 'Restores 130 HP.' },
  ether: { name: 'Ether', icon: '🔷', kind: 'use', price: 25, mana: 20, desc: 'Restores 20 MP.' },
  scroll: { name: 'Scroll of Insight', icon: '📜', kind: 'use', price: 35, freeHint: true, desc: 'Use your class hint for free in battle.' },
  // weapons
  pencil: { name: 'Sharpened Pencil', icon: '✏️', kind: 'weapon', price: 25, atk: 3, desc: '+3 attack.' },
  compass: { name: 'Compass Blade', icon: '🧭', kind: 'weapon', price: 90, atk: 7, desc: '+7 attack.' },
  protractor: { name: 'Protractor Bow', icon: '🏹', kind: 'weapon', price: 220, atk: 12, desc: '+12 attack.' },
  sliderule: { name: 'Slide-Rule Staff', icon: '📐', kind: 'weapon', price: 480, atk: 18, desc: '+18 attack.' },
  goldenratio: { name: 'Golden Ratio Sword', icon: '🗡️', kind: 'weapon', price: 950, atk: 26, desc: '+26 attack.' },
  eulerquill: { name: 'Quill of Euler', icon: '🪶', kind: 'weapon', price: 0, atk: 36, rare: true, desc: '+36 attack. Dropped by the Grand Examiner.' },
  // armour
  graphrobe: { name: 'Graph-Paper Robe', icon: '🥼', kind: 'armor', price: 30, hp: 20, def: 1, desc: '+20 HP, +1 defence.' },
  theoremmail: { name: 'Theorem Mail', icon: '🦺', kind: 'armor', price: 120, hp: 45, def: 3, desc: '+45 HP, +3 defence.' },
  axiomplate: { name: 'Axiom Plate', icon: '🛡️', kind: 'armor', price: 300, hp: 80, def: 5, desc: '+80 HP, +5 defence.' },
  lemmaguard: { name: 'Lemma Guard', icon: '🧥', kind: 'armor', price: 650, hp: 130, def: 8, desc: '+130 HP, +8 defence.' },
  // charms
  luckypi: { name: 'Lucky π', icon: '🥧', kind: 'charm', price: 60, mp: 10, desc: '+10 MP.' },
  fibshell: { name: 'Fibonacci Shell', icon: '🐚', kind: 'charm', price: 160, xpBoost: 0.15, desc: '+15% XP.' },
  mobius: { name: 'Möbius Ring', icon: '💍', kind: 'charm', price: 160, goldBoost: 0.2, desc: '+20% gold.' },
  klein: { name: 'Klein Bottle', icon: '🫙', kind: 'charm', price: 420, mp: 25, xpBoost: 0.1, desc: '+25 MP, +10% XP.' },
  // trophies (sell or keep)
  shard: { name: 'Theorem Shard', icon: '💎', kind: 'quest', price: 0, desc: 'A glowing fragment of a lost theorem.' },
};
export const SHOP = ['potion', 'hipotion', 'ether', 'scroll', 'pencil', 'compass', 'protractor', 'sliderule', 'goldenratio', 'graphrobe', 'theoremmail', 'axiomplate', 'lemmaguard', 'luckypi', 'fibshell', 'mobius', 'klein'];

// Problem tiers. "quick" = generated AMC-style questions; real = actual contest problems.
export const TIERS = {
  amc8: { name: 'AMC 8', color: '#4ade80' },
  amc10: { name: 'AMC 10', color: '#facc15' },
  amc12: { name: 'AMC 12', color: '#fb923c' },
  aime: { name: 'AIME', color: '#f472b6' },
};

// Monsters. kind: quick (generated questions), elite (one real problem), boss (three real problems).
export const MONSTERS = {
  // Fraction Fields
  halfslime: { name: 'Half-Slime', icon: '🟢', level: 1, hp: 30, atk: 6, xp: 14, gold: 6, kind: 'quick', topics: ['arith', 'fraction'], tier: 1 },
  ratiorat: { name: 'Ratio Rat', icon: '🐀', level: 2, hp: 38, atk: 7, xp: 18, gold: 8, kind: 'quick', topics: ['ratio', 'percent'], tier: 1 },
  percentpixie: { name: 'Percent Pixie', icon: '🧚', level: 3, hp: 44, atk: 8, xp: 22, gold: 10, kind: 'quick', topics: ['percent', 'average'], tier: 1 },
  fieldsentinel: { name: 'Field Sentinel', icon: '🗿', level: 4, hp: 1, atk: 14, xp: 70, gold: 40, kind: 'elite', tier: 'amc8', rating: [0, 1.6] },
  meadowking: { name: 'Meadow King', icon: '🦁', level: 5, hp: 3, atk: 16, xp: 180, gold: 100, kind: 'boss', tier: 'amc8', rating: [1, 2.2], zoneBoss: 'fields' },
  // Prime Woods
  primewolf: { name: 'Prime Wolf', icon: '🐺', level: 5, hp: 55, atk: 10, xp: 28, gold: 12, kind: 'quick', topics: ['primes', 'gcd'], tier: 2 },
  factorfox: { name: 'Factor Fox', icon: '🦊', level: 6, hp: 60, atk: 11, xp: 32, gold: 13, kind: 'quick', topics: ['divisors', 'gcd', 'primes'], tier: 2 },
  digitowl: { name: 'Digit Owl', icon: '🦉', level: 7, hp: 66, atk: 12, xp: 36, gold: 15, kind: 'quick', topics: ['digits', 'units', 'base'], tier: 2 },
  sievetreant: { name: 'Sieve Treant', icon: '🌳', level: 8, hp: 1, atk: 20, xp: 110, gold: 60, kind: 'elite', tier: 'amc8', rating: [1.2, 2.6] },
  woodwarden: { name: 'Warden of the Woods', icon: '🐻', level: 9, hp: 3, atk: 22, xp: 280, gold: 160, kind: 'boss', tier: 'amc10', rating: [1.4, 2.4], zoneBoss: 'woods' },
  // Polygon Peaks
  anglebat: { name: 'Angle Bat', icon: '🦇', level: 9, hp: 75, atk: 14, xp: 42, gold: 17, kind: 'quick', topics: ['angles', 'polygon'], tier: 2 },
  trigolem: { name: 'Triangle Golem', icon: '🪨', level: 10, hp: 82, atk: 15, xp: 46, gold: 18, kind: 'quick', topics: ['pythag', 'area'], tier: 3 },
  circlewisp: { name: 'Circle Wisp', icon: '🌀', level: 11, hp: 88, atk: 16, xp: 50, gold: 20, kind: 'quick', topics: ['circle', 'area', 'coord'], tier: 3 },
  areawyvern: { name: 'Area Wyvern', icon: '🐲', level: 12, hp: 1, atk: 26, xp: 160, gold: 90, kind: 'elite', tier: 'amc10', rating: [1.6, 2.8] },
  peaktitan: { name: 'Titan of the Peaks', icon: '🗻', level: 13, hp: 3, atk: 28, xp: 420, gold: 240, kind: 'boss', tier: 'amc10', rating: [2.2, 3.2], zoneBoss: 'peaks' },
  // Modular Marsh
  remaindertoad: { name: 'Remainder Toad', icon: '🐸', level: 13, hp: 95, atk: 18, xp: 56, gold: 22, kind: 'quick', topics: ['mod', 'units'], tier: 3 },
  congruencecroc: { name: 'Congruence Croc', icon: '🐊', level: 14, hp: 102, atk: 19, xp: 60, gold: 24, kind: 'quick', topics: ['mod', 'divisors', 'factorial'], tier: 3 },
  basebeetle: { name: 'Base Beetle', icon: '🪲', level: 15, hp: 108, atk: 20, xp: 64, gold: 25, kind: 'quick', topics: ['base', 'digits', 'mod'], tier: 3 },
  marshhydra: { name: 'Marsh Hydra', icon: '🐍', level: 16, hp: 1, atk: 32, xp: 220, gold: 120, kind: 'elite', tier: 'amc12', rating: [1.6, 3] },
  bogbehemoth: { name: 'Bog Behemoth', icon: '🦛', level: 17, hp: 3, atk: 34, xp: 560, gold: 320, kind: 'boss', tier: 'amc12', rating: [2.2, 3.4], zoneBoss: 'marsh' },
  // Combinatoria Canyon
  dicescorpion: { name: 'Dice Scorpion', icon: '🦂', level: 17, hp: 115, atk: 22, xp: 70, gold: 27, kind: 'quick', topics: ['counting', 'probability'], tier: 4 },
  permhawk: { name: 'Permutation Hawk', icon: '🦅', level: 18, hp: 122, atk: 23, xp: 74, gold: 28, kind: 'quick', topics: ['counting', 'binomial'], tier: 4 },
  vietaviper: { name: 'Vieta Viper', icon: '🐉', level: 19, hp: 130, atk: 24, xp: 78, gold: 30, kind: 'quick', topics: ['quadratic', 'sequence', 'logs'], tier: 4 },
  canyonsphinx: { name: 'Canyon Sphinx', icon: '🦁', level: 20, hp: 1, atk: 38, xp: 300, gold: 160, kind: 'elite', tier: 'amc12', rating: [2.4, 3.6] },
  chimera: { name: 'Combinatorial Chimera', icon: '🐯', level: 21, hp: 3, atk: 40, xp: 720, gold: 420, kind: 'boss', tier: 'aime', problem: [1, 6], zoneBoss: 'canyon' },
  // Citadel of AIME
  lemmaknight: { name: 'Lemma Knight', icon: '♞', level: 21, hp: 140, atk: 26, xp: 84, gold: 32, kind: 'quick', topics: ['quadratic', 'mod', 'counting', 'logs'], tier: 5 },
  proofwraith: { name: 'Proof Wraith', icon: '👻', level: 22, hp: 148, atk: 27, xp: 88, gold: 34, kind: 'quick', topics: ['probability', 'binomial', 'factorial', 'coord'], tier: 5 },
  aimegargoyle: { name: 'AIME Gargoyle', icon: '🗿', level: 23, hp: 1, atk: 44, xp: 380, gold: 200, kind: 'elite', tier: 'aime', problem: [1, 8] },
  examiner: { name: 'The Grand Examiner', icon: '🐉', level: 25, hp: 3, atk: 50, xp: 1200, gold: 700, kind: 'raid', tier: 'aime', problem: [3, 12] },
};

// Zones. Map layouts are generated from the seed, so every player sees the same world.
export const ZONES = {
  town: { name: 'Integer Hamlet', sub: 'A safe town', theme: 'town', level: [1, 30], music: 'town', safe: true },
  fields: { name: 'Fraction Fields', sub: 'AMC 8 · Lv 1–5', theme: 'meadow', level: [1, 5], seed: 1101, spawns: ['halfslime', 'halfslime', 'ratiorat', 'percentpixie'], elites: ['fieldsentinel'], boss: 'meadowking', exits: [{ side: 'W', to: 'town' }, { side: 'E', to: 'woods' }] },
  woods: { name: 'Prime Woods', sub: 'AMC 8/10 · Lv 5–9', theme: 'forest', level: [5, 9], seed: 2202, spawns: ['primewolf', 'factorfox', 'digitowl'], elites: ['sievetreant'], boss: 'woodwarden', exits: [{ side: 'W', to: 'fields' }, { side: 'S', to: 'peaks' }] },
  peaks: { name: 'Polygon Peaks', sub: 'AMC 10 · Lv 9–13', theme: 'mountain', level: [9, 13], seed: 3303, spawns: ['anglebat', 'trigolem', 'circlewisp'], elites: ['areawyvern'], boss: 'peaktitan', exits: [{ side: 'N', to: 'woods' }, { side: 'E', to: 'marsh' }] },
  marsh: { name: 'Modular Marsh', sub: 'AMC 10/12 · Lv 13–17', theme: 'marsh', level: [13, 17], seed: 4404, spawns: ['remaindertoad', 'congruencecroc', 'basebeetle'], elites: ['marshhydra'], boss: 'bogbehemoth', exits: [{ side: 'W', to: 'peaks' }, { side: 'S', to: 'canyon' }] },
  canyon: { name: 'Combinatoria Canyon', sub: 'AMC 12 · Lv 17–21', theme: 'canyon', level: [17, 21], seed: 5505, spawns: ['dicescorpion', 'permhawk', 'vietaviper'], elites: ['canyonsphinx'], boss: 'chimera', exits: [{ side: 'N', to: 'marsh' }, { side: 'E', to: 'citadel' }] },
  citadel: { name: 'Citadel of AIME', sub: 'AIME · Lv 21+', theme: 'citadel', level: [21, 30], seed: 6606, spawns: ['lemmaknight', 'proofwraith'], elites: ['aimegargoyle'], raid: 'examiner', exits: [{ side: 'W', to: 'canyon' }] },
};
export const ZONE_ORDER = ['town', 'fields', 'woods', 'peaks', 'marsh', 'canyon', 'citadel'];

export const NPCS = {
  elder: { name: 'Elder Euclid', icon: '👴', role: 'Main quest' },
  merchant: { name: 'Hypatia the Merchant', icon: '👩‍💼', role: 'Shop' },
  innkeeper: { name: 'Gauss the Innkeeper', icon: '🧑‍🍳', role: 'Rest & heal' },
  guild: { name: 'Guildmistress Noether', icon: '👩‍🏫', role: 'Daily bounties' },
  trainer: { name: 'Trainer Ramanujan', icon: '🧘', role: 'Abilities & tips' },
  sage: { name: 'Sage Germain', icon: '🧝‍♀️', role: 'Lore & side quests' },
};

// The main story: recover a Theorem Shard from each zone boss.
export const MAIN_QUEST = [
  { id: 'm0', title: 'A Realm Without Proofs', text: 'Talk to Elder Euclid in the town square.', goal: { talk: 'elder' } },
  { id: 'm1', title: 'The First Shard', text: 'Defeat the Meadow King in Fraction Fields.', goal: { boss: 'meadowking' }, reward: { xp: 120, gold: 80 } },
  { id: 'm2', title: 'Into the Woods', text: 'Defeat the Warden of the Woods in Prime Woods.', goal: { boss: 'woodwarden' }, reward: { xp: 220, gold: 140 } },
  { id: 'm3', title: 'The Shape of Things', text: 'Defeat the Titan of the Peaks in Polygon Peaks.', goal: { boss: 'peaktitan' }, reward: { xp: 340, gold: 200 } },
  { id: 'm4', title: 'Remainders in the Mud', text: 'Defeat the Bog Behemoth in Modular Marsh.', goal: { boss: 'bogbehemoth' }, reward: { xp: 460, gold: 260 } },
  { id: 'm5', title: 'Countless Possibilities', text: 'Defeat the Combinatorial Chimera in Combinatoria Canyon.', goal: { boss: 'chimera' }, reward: { xp: 600, gold: 340 } },
  { id: 'm6', title: 'The Grand Examination', text: 'Join a raid on the Grand Examiner in the Citadel of AIME.', goal: { raid: 'examiner' }, reward: { xp: 1000, gold: 600 } },
  { id: 'm7', title: 'Legend of Numeria', text: 'You restored every theorem. Keep exploring, raiding and climbing the leaderboard!', goal: null },
];
export const ELDER_LINES = [
  'Welcome, traveller. The Lost Theorems have shattered, and monsters now roam Numeria. Each zone guardian holds a Theorem Shard.',
  'Defeat the guardians, one per zone, and bring the shards home. Start in Fraction Fields, east of town.',
];

// Side quests offered by the Sage, one per zone.
export const SIDE_QUESTS = [
  { id: 's_fields', zone: 'fields', title: 'Slime Season', text: 'Defeat 6 Half-Slimes.', goal: { kill: 'halfslime', n: 6 }, reward: { xp: 60, gold: 40, item: 'potion' } },
  { id: 's_woods', zone: 'woods', title: 'Prime Suspects', text: 'Solve 8 number theory questions.', goal: { topic: 'nt', n: 8 }, reward: { xp: 110, gold: 70, item: 'ether' } },
  { id: 's_peaks', zone: 'peaks', title: 'Angles Everywhere', text: 'Solve 8 geometry questions.', goal: { topic: 'geometry', n: 8 }, reward: { xp: 170, gold: 100, item: 'hipotion' } },
  { id: 's_marsh', zone: 'marsh', title: 'Croc Hunt', text: 'Defeat 5 Congruence Crocs.', goal: { kill: 'congruencecroc', n: 5 }, reward: { xp: 230, gold: 130, item: 'scroll' } },
  { id: 's_canyon', zone: 'canyon', title: 'Real Contest Grit', text: 'Solve 3 real contest problems.', goal: { real: true, n: 3 }, reward: { xp: 320, gold: 180, item: 'hipotion' } },
];
// Daily bounties: three picked by date.
export const BOUNTY_POOL = [
  { id: 'b_kill10', text: 'Defeat 10 monsters', goal: { killAny: true, n: 10 }, reward: { xp: 80, gold: 60 } },
  { id: 'b_streak', text: 'Answer 5 questions in a row correctly', goal: { streak: 5 }, reward: { xp: 70, gold: 50 } },
  { id: 'b_elite', text: 'Defeat an elite monster', goal: { elite: true, n: 1 }, reward: { xp: 120, gold: 90 } },
  { id: 'b_real2', text: 'Solve 2 real contest problems', goal: { real: true, n: 2 }, reward: { xp: 140, gold: 100 } },
  { id: 'b_geo', text: 'Solve 6 geometry questions', goal: { topic: 'geometry', n: 6 }, reward: { xp: 70, gold: 50 } },
  { id: 'b_nt', text: 'Solve 6 number theory questions', goal: { topic: 'nt', n: 6 }, reward: { xp: 70, gold: 50 } },
  { id: 'b_count', text: 'Solve 6 counting questions', goal: { topic: 'counting', n: 6 }, reward: { xp: 70, gold: 50 } },
  { id: 'b_alg', text: 'Solve 6 algebra questions', goal: { topic: 'algebra', n: 6 }, reward: { xp: 70, gold: 50 } },
  { id: 'b_fast', text: 'Land 5 critical hits (answer in under 6 seconds)', goal: { crit: true, n: 5 }, reward: { xp: 90, gold: 60 } },
];

// Names are picked, not typed, so they're always friendly.
export const NAME_A = ['Swift', 'Brave', 'Clever', 'Prime', 'Golden', 'Silent', 'Lucky', 'Mighty', 'Radiant', 'Cosmic', 'Rapid', 'Quiet', 'Bold', 'Witty', 'Sharp', 'Infinite', 'Rational', 'Complex', 'Perfect', 'Fearless'];
export const NAME_B = ['Lemma', 'Vertex', 'Sigma', 'Theta', 'Vector', 'Matrix', 'Axiom', 'Prism', 'Radius', 'Tangent', 'Cosine', 'Integer', 'Fractal', 'Spiral', 'Pi', 'Delta', 'Omega', 'Euler', 'Gauss', 'Fermat'];
export const COLORS = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#22d3ee', '#60a5fa', '#a78bfa', '#f472b6'];

// Quick chat only — no free typing — so it's safe for everyone.
export const CHAT = ['Hi! 👋', 'Need help?', 'Follow me!', 'Nice solve!', 'GG!', 'Thanks!', 'Raid the Examiner?', 'Good luck!', 'Brb', 'What level are you?', 'That boss was tough', 'Let’s go! 🚀'];
export const EMOTES = ['👍', '😄', '🎉', '🤔', '😮', '❤️', '🔥', '💯'];
