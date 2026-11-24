// Content sources. Each source returns a "card" object:
// { id, source, kind, title, subtitle, url, html, solutionHtml?, solutionLabel?, answer?, terms? }
// All sources are free, public, and need no API key.

const AOPS_API = 'https://artofproblemsolving.com/wiki/api.php';
const AOPS_PAGE = 'https://artofproblemsolving.com/wiki/index.php?title=';
const WIKI_API = 'https://en.wikipedia.org/w/api.php';
const PROOF_API = 'https://proofwiki.org/w/api.php';
const OEIS = 'https://oeis.org';

const rand = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rand(arr.length)];
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

async function getJSON(url, timeoutMs = 12000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

function mwURL(api, params) {
  const p = new URLSearchParams({ format: 'json', formatversion: '2', origin: '*', ...params });
  return `${api}?${p}`;
}

async function mwParse(api, page, extra = {}) {
  const data = await getJSON(mwURL(api, { action: 'parse', page, prop: 'text|displaytitle', redirects: '1', disableeditsection: '1', ...extra }));
  if (data.error) throw new Error(data.error.code || 'parse error');
  return { title: data.parse.title, html: data.parse.text };
}

const toDoc = (html) => new DOMParser().parseFromString(`<div id="root">${html}</div>`, 'text/html');

// Split a parsed MediaWiki page into sections at h2 headings.
function sectionsOf(html) {
  const doc = toDoc(html);
  const root = doc.querySelector('.mw-parser-output') || doc.getElementById('root');
  const sections = [{ heading: '', nodes: [] }];
  for (const node of [...root.childNodes]) {
    const isH2 = node.nodeType === 1 && (node.tagName === 'H2' || (node.classList && node.classList.contains('mw-heading2')));
    if (isH2) {
      const h = node.tagName === 'H2' ? node : node.querySelector('h2');
      const heading = (h ? h.textContent : node.textContent).replace(/\[edit\]/g, '').trim();
      sections.push({ heading, nodes: [] });
    } else {
      sections[sections.length - 1].nodes.push(node);
    }
  }
  return sections.map((s) => {
    const div = doc.createElement('div');
    s.nodes.forEach((n) => div.appendChild(n));
    return { heading: s.heading, html: div.innerHTML, text: div.textContent.trim() };
  });
}

// ---------------------------------------------------------------- AoPS contests
// Every (contest, year, problem) triple the AoPS Wiki uses for its problem pages.
const CONTESTS = [
  { family: 'amc8', label: 'AMC 8', years: range(1999, 2025).filter((y) => y !== 2021), n: 25, name: (y) => `${y} AMC 8` },
  { family: 'amc8', label: 'AJHSME', years: range(1985, 1998), n: 25, name: (y) => `${y} AJHSME` },
  { family: 'amc10', label: 'AMC 10', years: [2000, 2001], n: 25, name: (y) => `${y} AMC 10` },
  { family: 'amc10', label: 'AMC 10A', years: range(2002, 2025), n: 25, name: (y) => `${y} AMC 10A`, fall: true },
  { family: 'amc10', label: 'AMC 10B', years: range(2002, 2025), n: 25, name: (y) => `${y} AMC 10B`, fall: true },
  { family: 'amc12', label: 'AMC 12', years: [2000, 2001], n: 25, name: (y) => `${y} AMC 12` },
  { family: 'amc12', label: 'AMC 12A', years: range(2002, 2025), n: 25, name: (y) => `${y} AMC 12A`, fall: true },
  { family: 'amc12', label: 'AMC 12B', years: range(2002, 2025), n: 25, name: (y) => `${y} AMC 12B`, fall: true },
  { family: 'amc12', label: 'AHSME', years: range(1974, 1999), n: 30, name: (y) => `${y} AHSME` },
  { family: 'aime', label: 'AIME', years: range(1983, 1999), n: 15, name: (y) => `${y} AIME`, numeric: true },
  { family: 'aime', label: 'AIME I', years: range(2000, 2025), n: 15, name: (y) => `${y} AIME I`, numeric: true },
  { family: 'aime', label: 'AIME II', years: range(2000, 2025), n: 15, name: (y) => `${y} AIME II`, numeric: true },
  { family: 'olympiad', label: 'USAJMO', years: range(2010, 2025), n: 6, name: (y) => `${y} USAJMO` },
  { family: 'olympiad', label: 'USAMO', years: range(1996, 2025), n: 6, name: (y) => `${y} USAMO` },
  { family: 'olympiad', label: 'IMO', years: range(1959, 2025).filter((y) => y !== 1980), n: 6, name: (y) => `${y} IMO` },
];

export const CONTEST_FAMILIES = [
  { id: 'amc8', label: 'AMC 8 / AJHSME' },
  { id: 'amc10', label: 'AMC 10' },
  { id: 'amc12', label: 'AMC 12 / AHSME' },
  { id: 'aime', label: 'AIME' },
  { id: 'olympiad', label: 'USAJMO / USAMO / IMO' },
];

export function contestPoolSize(families) {
  return CONTESTS.filter((c) => families.includes(c.family)).reduce((s, c) => s + c.years.length * c.n, 0);
}

const answerKeyCache = new Map();
async function answerKey(contestName) {
  if (answerKeyCache.has(contestName)) return answerKeyCache.get(contestName);
  const p = (async () => {
    try {
      const { html } = await mwParse(AOPS_API, `${contestName} Answer Key`);
      const doc = toDoc(html);
      const items = [...doc.querySelectorAll('ol li')].map((li) => li.textContent.trim());
      return items.length ? items : null;
    } catch {
      return null;
    }
  })();
  answerKeyCache.set(contestName, p);
  return p;
}

function problemNumber(diff, n) {
  // diff: 'any' | 'easy' | 'medium' | 'hard' — by position in the contest.
  const third = Math.ceil(n / 3);
  if (n <= 6) {
    if (diff === 'easy') return pick([1, 4]);
    if (diff === 'medium') return pick([2, 5]);
    if (diff === 'hard') return pick([3, 6]);
    return 1 + rand(n);
  }
  if (diff === 'easy') return 1 + rand(third);
  if (diff === 'medium') return third + 1 + rand(third);
  if (diff === 'hard') return 2 * third + 1 + rand(n - 2 * third);
  return 1 + rand(n);
}

async function aopsContest(settings) {
  const pool = CONTESTS.filter((c) => settings.families.includes(c.family));
  if (!pool.length) throw new Error('no contests selected');
  // Weight contests by how many problems they have so every problem is equally likely.
  const weights = pool.map((c) => c.years.length * c.n);
  let r = rand(weights.reduce((a, b) => a + b, 0));
  let contest = pool[0];
  for (let i = 0; i < pool.length; i++) { if ((r -= weights[i]) < 0) { contest = pool[i]; break; } }

  const year = pick(contest.years);
  const num = problemNumber(settings.difficulty, contest.n);
  const cname = contest.name(year);
  const page = `${cname} Problems/Problem ${num}`;
  const { title, html } = await mwParse(AOPS_API, page);
  const secs = sectionsOf(html);

  const isSol = (h) => /solution|answer/i.test(h);
  const isJunk = (h) => /see also|video|related|notes/i.test(h);
  let problem = secs.find((s) => /^problem/i.test(s.heading) && s.text.length > 20);
  if (!problem) problem = secs.find((s) => !s.heading && s.text.length > 40);
  if (!problem || problem.text.length < 20) throw new Error('no problem text');
  const solutions = secs.filter((s) => isSol(s.heading) && !isJunk(s.heading) && s.text.length > 0);

  const solutionHtml = solutions.map((s) => `<h3>${escapeHTML(s.heading)}</h3>${s.html}`).join('');
  const key = await answerKey(cname);
  let answer = null;
  if (key && key[num - 1]) {
    const a = key[num - 1].trim();
    if (contest.numeric && /^\d{1,3}$/.test(a)) answer = { type: 'numeric', value: String(parseInt(a, 10)) };
    else if (/^[A-E]$/i.test(a)) answer = { type: 'choice', value: a.toUpperCase() };
  }

  return {
    id: `aops:${title}`,
    source: 'contest',
    kind: 'Contest problem',
    heading: `${year} ${contest.label}`,
    number: num,
    of: contest.n,
    url: AOPS_PAGE + encodeURIComponent(title.replace(/ /g, '_')),
    html: problem.html,
    solutionHtml: solutionHtml || null,
    solutionLabel: 'Solution',
    answer,
    base: 'aops',
  };
}

// ---------------------------------------------------------------- AoPS wiki articles
async function aopsArticle() {
  for (let attempt = 0; attempt < 4; attempt++) {
    const data = await getJSON(mwURL(AOPS_API, { action: 'query', list: 'random', rnnamespace: '0', rnlimit: '5' }));
    const candidates = data.query.random.map((r) => r.title)
      .filter((t) => !/Problems(\/|$)|Answer Key|Resources|Category|Talk|User|Template/i.test(t));
    if (!candidates.length) continue;
    const t = candidates[0];
    const { title, html } = await mwParse(AOPS_API, t);
    const secs = sectionsOf(html);
    const lead = secs.filter((s) => !/see also|external|resources|references/i.test(s.heading)).slice(0, 3);
    const text = lead.map((s) => s.text).join(' ');
    if (text.length < 150 || /disambiguation|redirect/i.test(text.slice(0, 200))) continue;
    return {
      id: `aopswiki:${title}`,
      source: 'aopswiki',
      kind: 'AoPS Wiki',
      heading: title,
      url: AOPS_PAGE + encodeURIComponent(title.replace(/ /g, '_')),
      html: lead.map((s, i) => (i && s.heading ? `<h3>${escapeHTML(s.heading)}</h3>` : '') + s.html).join(''),
      base: 'aops',
    };
  }
  throw new Error('no good AoPS article');
}

// ---------------------------------------------------------------- Wikipedia (math only)
// Category groups covering tens of thousands of maths articles. One group is picked,
// then CirrusSearch returns a random article from it.
const WIKI_CATEGORY_GROUPS = [
  ['Theorems in number theory', 'Conjectures about prime numbers', 'Integer sequences', 'Figurate numbers', 'Diophantine equations', 'Prime numbers', 'Additive number theory', 'Modular arithmetic'],
  ['Theorems in geometry', 'Triangle geometry', 'Euclidean plane geometry', 'Polyhedra', 'Curves', 'Theorems about triangles', 'Theorems about circles', 'Conic sections', 'Tessellation'],
  ['Theorems in combinatorics', 'Enumerative combinatorics', 'Graph theory', 'Theorems in graph theory', 'Ramsey theory', 'Combinatorial game theory', 'Permutations', 'Combinatorial design'],
  ['Theorems in algebra', 'Inequalities', 'Polynomials', 'Theorems in abstract algebra', 'Group theory', 'Linear algebra', 'Matrices', 'Field (mathematics)'],
  ['Theorems in analysis', 'Theorems in calculus', 'Mathematical series', 'Special functions', 'Theorems in real analysis', 'Theorems in complex analysis', 'Integrals', 'Fractals'],
  ['Unsolved problems in mathematics', 'Mathematical paradoxes', 'Mathematical problems', 'Recreational mathematics', 'Mathematical puzzles', 'Mathematical constants', 'Large numbers', 'Theorems in probability theory', 'Probability problems'],
  ['Topology', 'Theorems in topology', 'Knot theory', 'Mathematical logic', 'Set theory', 'Theorems in the foundations of mathematics', 'Computability theory', 'Cryptography'],
];

async function wikipedia() {
  for (let attempt = 0; attempt < 3; attempt++) {
    const cats = pick(WIKI_CATEGORY_GROUPS).map((c) => `"${c}"`).join('|');
    const search = `incategory:${cats}`;
    let title;
    try {
      const data = await getJSON(mwURL(WIKI_API, { action: 'query', list: 'search', srsearch: search, srsort: 'random', srlimit: '1', srnamespace: '0', srprop: '' }));
      title = data.query?.search?.[0]?.title;
    } catch { /* fall through */ }
    if (!title) {
      // Fallback for when random sort is unavailable: random offset into the results.
      const first = await getJSON(mwURL(WIKI_API, { action: 'query', list: 'search', srsearch: search, srlimit: '1', srprop: '', srinfo: 'totalhits' }));
      const total = Math.min(first.query?.searchinfo?.totalhits || 0, 9000);
      if (!total) continue;
      const off = await getJSON(mwURL(WIKI_API, { action: 'query', list: 'search', srsearch: search, srlimit: '1', srprop: '', sroffset: String(rand(total)) }));
      title = off.query?.search?.[0]?.title;
    }
    if (!title || /^(List|Lists|Outline|Index|Glossary) of/i.test(title)) continue;
    const { html } = await mwParse(WIKI_API, title, { section: '0' });
    const doc = toDoc(html);
    doc.querySelectorAll('.infobox, .sidebar, .navbox, .hatnote, .mw-empty-elt, .reference, .metadata, .ambox, table, style, .shortdescription, .mw-references-wrap, figure, .thumb, .noprint').forEach((n) => n.remove());
    const root = doc.querySelector('.mw-parser-output') || doc.getElementById('root');
    const text = root.textContent.trim();
    if (text.length < 200) continue;
    return {
      id: `wiki:${title}`,
      source: 'wikipedia',
      kind: 'Concept · Wikipedia',
      heading: title,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
      html: root.innerHTML,
      base: 'wikipedia',
    };
  }
  throw new Error('no good Wikipedia article');
}

// ---------------------------------------------------------------- ProofWiki
async function proofwiki() {
  for (let attempt = 0; attempt < 4; attempt++) {
    const data = await getJSON(mwURL(PROOF_API, { action: 'query', list: 'random', rnnamespace: '0', rnlimit: '5' }));
    const t = data.query.random.map((r) => r.title).find((x) => !/\/(Proof \d+|Lemma|Historical Note|Also known as|Also presented as)/i.test(x) && !/^(ProofWiki|Main Page)/.test(x));
    if (!t) continue;
    const { title, html } = await mwParse(PROOF_API, t);
    const secs = sectionsOf(html);
    const theorem = secs.find((s) => /^theorem/i.test(s.heading) && s.text.length > 20);
    if (!theorem) continue;
    const proofs = secs.filter((s) => /^proof/i.test(s.heading) && s.text.length > 10);
    return {
      id: `proofwiki:${title}`,
      source: 'proofwiki',
      kind: 'Theorem · ProofWiki',
      heading: title,
      url: `https://proofwiki.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
      html: theorem.html,
      solutionHtml: proofs.length ? proofs.map((s) => `<h3>${escapeHTML(s.heading)}</h3>${s.html}`).join('') : null,
      solutionLabel: 'Proof',
      base: 'proofwiki',
      dollarMath: true,
    };
  }
  throw new Error('no good ProofWiki theorem');
}

// ---------------------------------------------------------------- OEIS
async function oeis() {
  let seq;
  for (let attempt = 0; attempt < 4 && !seq; attempt++) {
    let url;
    if (Math.random() < 0.7) {
      // Sequences the OEIS editors marked "nice" (about 9,000) are the most interesting.
      url = `${OEIS}/search?fmt=json&q=${encodeURIComponent('keyword:nice')}&start=${rand(8000)}`;
    } else {
      url = `${OEIS}/search?fmt=json&q=id:A${String(1 + rand(380000)).padStart(6, '0')}`;
    }
    const data = await getJSON(url);
    const results = Array.isArray(data) ? data : data?.results;
    if (results && results.length) seq = pick(results);
  }
  if (!seq) throw new Error('no OEIS sequence');
  const a = `A${String(seq.number).padStart(6, '0')}`;
  const terms = (seq.data || '').split(',').filter(Boolean);
  const list = (arr, max) => (arr || []).filter((l) => !/^\s*$/.test(l)).slice(0, max)
    .map((l) => `<li>${linkifyOEIS(escapeHTML(l))}</li>`).join('');
  const comments = list(seq.comment, 4);
  const formulas = list(seq.formula, 3);
  const examples = list(seq.example, 4);
  return {
    id: `oeis:${a}`,
    source: 'oeis',
    kind: 'Sequence · OEIS',
    heading: `${a}`,
    url: `${OEIS}/${a}`,
    html: `<p class="oeis-name">${linkifyOEIS(escapeHTML(seq.name || ''))}</p>`,
    terms: terms.slice(0, 40),
    solutionHtml: (comments ? `<h3>Comments</h3><ul class="plain">${comments}</ul>` : '') +
      (formulas ? `<h3>Formulas</h3><ul class="plain mono">${formulas}</ul>` : '') +
      (examples ? `<h3>Examples</h3><ul class="plain mono">${examples}</ul>` : '') || null,
    solutionLabel: 'More',
    base: 'oeis',
  };
}

function linkifyOEIS(s) {
  return s.replace(/\bA(\d{6})\b/g, '<a href="https://oeis.org/A$1">A$1</a>');
}

export function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export const SOURCES = {
  contest: { label: 'Contest problems', short: 'Contests', fetch: aopsContest, blurb: 'AMC, AIME, USAMO & IMO via the AoPS Wiki' },
  wikipedia: { label: 'Concepts', short: 'Concepts', fetch: wikipedia, blurb: 'Maths articles from Wikipedia' },
  proofwiki: { label: 'Theorems & proofs', short: 'Proofs', fetch: proofwiki, blurb: 'ProofWiki' },
  oeis: { label: 'Integer sequences', short: 'Sequences', fetch: oeis, blurb: 'The OEIS' },
  aopswiki: { label: 'AoPS Wiki articles', short: 'AoPS Wiki', fetch: aopsArticle, blurb: 'Random page from the AoPS Wiki' },
};
