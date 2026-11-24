// Content sources. Each returns a "card":
// { id, source, kind, heading, url, html, solutionHtml?, solutionLabel?, answer?, terms?, base, dollarMath? }
//
// AoPS, ProofWiki and the OEIS don't let apps read their sites directly (AoPS sits behind a bot
// check; the other two block cross-site requests), so their content comes from public mirrors on
// Hugging Face, whose API is open to apps:
//   AoPS      → NuminaMath-1.5: AMC/AIME problems with AoPS Wiki solutions, plus AoPS forum problems
//   ProofWiki → NaturalProofs: ProofWiki theorems with their proofs
//   OEIS      → christopher/oeis: the whole OEIS
// Wikipedia is read live.

const HF = 'https://datasets-server.huggingface.co';
const WIKI_API = 'https://en.wikipedia.org/w/api.php';
const NUMINA = 'project-numina/NuminaMath-1.5';
const PROOFS = 'wellecks/naturalproofs-gen';
const OEIS_DS = 'christopher/oeis';

const rand = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rand(arr.length)];

async function getJSON(url, timeoutMs = 15000) {
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

export function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ------------------------------------------------------------------ Hugging Face helpers
// Row counts per query, remembered so a random row can be picked with a single request.
const TOTALS_KEY = 'ms:hf-totals';
let totals = {};
try { totals = JSON.parse(localStorage.getItem(TOTALS_KEY) || '{}'); } catch { /* ignore */ }
const KNOWN = {
  [`${PROOFS}|`]: 24848,
  [`${OEIS_DS}|`]: 392167,
};
function rememberTotal(key, n) {
  if (typeof n !== 'number') return;
  totals[key] = n;
  try { localStorage.setItem(TOTALS_KEY, JSON.stringify(totals)); } catch { /* ignore */ }
}

async function hfRow(dataset, { where = '', offsetRange = null } = {}) {
  const key = `${dataset}|${where}`;
  let total = totals[key] ?? KNOWN[key];
  const url = (offset) => where
    ? `${HF}/filter?dataset=${encodeURIComponent(dataset)}&config=default&split=train&where=${encodeURIComponent(where)}&offset=${offset}&length=1`
    : `${HF}/rows?dataset=${encodeURIComponent(dataset)}&config=default&split=train&offset=${offset}&length=1`;
  if (total == null) {
    const first = await getJSON(url(0));
    rememberTotal(key, first.num_rows_total);
    total = first.num_rows_total;
  }
  if (!total) throw new Error('no rows for this filter');
  const max = offsetRange ? Math.min(offsetRange, total) : total;
  const data = await getJSON(url(rand(max)));
  if (data.error) throw new Error(data.error);
  rememberTotal(key, data.num_rows_total);
  const row = data.rows?.[0];
  if (!row) throw new Error('empty row');
  return { row: row.row, index: row.row_idx };
}

// ------------------------------------------------------------------ plain-text maths → HTML
function textToHtml(text) {
  // Keep each formula on one line so paragraph/line breaks never split it.
  const flat = String(text || '').trim()
    // Leftover instructions from machine translation in some olympiad problems.
    .replace(/\n*\s*Translate the above text into English[^\n]*/gi, '')
    .replace(/\\begin\{(align\*?|equation\*?|gather\*?|eqnarray\*?|multline\*?|array|cases)\}[\s\S]+?\\end\{\1\}|\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^$]+?\$/g, (m) => m.replace(/\s*\n\s*/g, ' '));
  let s = escapeHTML(flat);
  // Asymptote diagram code can't be drawn here.
  s = s.replace(/\[asy\][\s\S]*?\[\/asy\]/gi, '<p class="diagram-note">This problem has a diagram. Tap <b>Source</b> to see it.</p>');
  s = s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  return s.split(/\n\s*\n/).map((p) => (p.startsWith('<p') ? p : `<p>${p.replace(/\n/g, '<br>')}</p>`)).join('');
}

// Find the A–E options in an AMC problem so a tap can be checked against the dataset's answer.
function normTex(s) {
  return String(s || '')
    .replace(/\\(?:textbf|mathrm|text|bf|mathbf)\s*\{\s*\(?[A-E]\)?\s*\}/g, '')
    .replace(/\\(?:text|textbf|mathrm|mbox|mathbf)\s*\{([^{}]*)\}/g, '$1')
    .replace(/\\(?:qquad|quad|displaystyle|left|right|textdollar|,|;|!| )/g, '')
    .replace(/\\[dt]frac/g, '\\frac')
    .replace(/[\s$~{}]/g, '')
    .replace(/\\\$/g, '')
    .replace(/[.,;]+$/, '')
    .toLowerCase();
}
function parseChoices(problem) {
  const re = /(?:\\(?:textbf|mathrm|text|bf|mathbf)\s*\{\s*\(([A-E])\)\s*\}|\(([A-E])\))/g;
  const marks = [];
  let m;
  while ((m = re.exec(problem))) marks.push({ letter: m[1] || m[2], start: m.index, end: re.lastIndex });
  // Keep the last run of A..E in order.
  const order = 'ABCDE';
  for (let i = marks.length - 1; i >= 0; i--) {
    if (marks[i].letter === 'A') {
      const run = marks.slice(i, i + 5);
      if (run.length >= 4 && run.every((r, k) => r.letter === order[k])) {
        const choices = {};
        run.forEach((r, k) => {
          const stop = run[k + 1] ? run[k + 1].start : problem.length;
          choices[r.letter] = problem.slice(r.end, stop);
        });
        return choices;
      }
    }
  }
  return null;
}
function answerFor(problem, answer, questionType) {
  if (answer == null) return null;
  const a = String(answer).trim();
  if (!a || a === 'null' || /proof/i.test(a)) return null;
  const choices = parseChoices(problem);
  if (choices) {
    const letter = a.match(/\(([A-E])\)/)?.[1] || (/^[A-E]$/.test(a) ? a : null);
    if (letter) return { type: 'choice', value: letter };
    const target = normTex(a);
    const hits = Object.entries(choices).filter(([, v]) => normTex(v) === target);
    if (hits.length === 1) return { type: 'choice', value: hits[0][0] };
  }
  if (/^-?\d{1,6}$/.test(a)) return { type: 'numeric', value: String(parseInt(a, 10)) };
  if (questionType !== 'proof' && a.length < 80) return { type: 'reveal', value: a };
  return null;
}

// ------------------------------------------------------------------ AoPS + olympiads (NuminaMath)
const PROBLEM_TOPICS = ['Algebra', 'Number Theory', 'Combinatorics', 'Geometry', 'Inequalities', 'Calculus', 'Logic and Puzzles'];
export { PROBLEM_TOPICS };

function numinaWhere(source, topics) {
  let w = `"source"='${source}' AND "problem_is_valid"='Yes' AND "solution_is_valid"='Yes' AND "solution" IS NOT NULL`;
  if (topics && topics.length && topics.length < PROBLEM_TOPICS.length) {
    w += ` AND (${topics.map((t) => `"problem_type"='${t}'`).join(' OR ')})`;
  }
  return w;
}

function searchLink(problem, site) {
  const plain = String(problem).replace(/\$[^$]*\$/g, ' ').replace(/\\[a-z]+/gi, ' ').replace(/[^\w\s'-]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = plain.split(' ').slice(0, 12).join(' ');
  return `https://www.google.com/search?q=${encodeURIComponent(`"${words}"${site ? ` site:${site}` : ''}`)}`;
}

function numinaSource({ source, kind, tag, heading, site, solutionNote }) {
  return async (settings) => {
    const { row, index } = await hfRow(NUMINA, { where: numinaWhere(source, settings.topics) });
    if (!row.problem || row.problem.length < 20) throw new Error('empty problem');
    return {
      id: `numina:${source}:${index}`,
      source: tag,
      kind,
      heading: row.problem_type && row.problem_type !== 'unknown' ? `${heading} · ${row.problem_type}` : heading,
      url: searchLink(row.problem, site),
      html: textToHtml(row.problem),
      solutionHtml: row.solution ? textToHtml(row.solution) : null,
      solutionLabel: 'Solution',
      solutionNote,
      answer: answerFor(row.problem, row.answer, row.question_type),
      isProof: row.question_type === 'proof',
      base: 'text',
      dollarMath: true,
    };
  };
}

const amcAime = numinaSource({
  source: 'amc_aime', kind: 'AMC / AIME', tag: 'contest', heading: 'AMC / AIME', site: 'artofproblemsolving.com',
  solutionNote: 'Solution from the AoPS Wiki, via the NuminaMath dataset.',
});
const aopsForum = numinaSource({
  source: 'aops_forum', kind: 'AoPS forum', tag: 'aops', heading: 'AoPS', site: 'artofproblemsolving.com',
  solutionNote: 'From the NuminaMath dataset. Solutions to AoPS forum problems were written up with AI help and can contain mistakes.',
});
const olympiad = numinaSource({
  source: 'olympiads', kind: 'Olympiad', tag: 'olympiad', heading: 'Olympiad',
  solutionNote: 'From the NuminaMath dataset (olympiad problems and official solutions, translated to English). May contain translation slips.',
});

// ------------------------------------------------------------------ ProofWiki (NaturalProofs)
// Converts ProofWiki's wiki markup into HTML with $…$ maths for the renderer to typeset.
function wikiInline(s) {
  return s
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (_, page, text) => `<a href="https://proofwiki.org/wiki/${encodeURIComponent(page.trim().replace(/ /g, '_'))}">${text}</a>`)
    .replace(/\[\[([^\]]+)\]\]/g, (_, page) => `<a href="https://proofwiki.org/wiki/${encodeURIComponent(page.trim().replace(/ /g, '_'))}">${page.replace(/^Definition:/, '')}</a>`)
    .replace(/'''(.+?)'''/g, '<b>$1</b>')
    .replace(/''(.+?)''/g, '<i>$1</i>');
}
function eqnBlock(body) {
  const rows = [];
  const re = /\{\{eqn([\s\S]*?)\}\}(?=\s*(?:\{\{eqn|\{\{end-eqn|$))/g;
  let m;
  while ((m = re.exec(body))) {
    const fields = {};
    m[1].split(/\n?\s*\|\s*(?=[lorc]\s*=)/).forEach((part) => {
      const f = part.match(/^([lorc])\s*=\s*([\s\S]*)$/);
      if (f) fields[f[1]] = f[2].trim();
    });
    const lhs = fields.l ? `$\\displaystyle ${fields.l}$` : '';
    const rhs = fields.r ? `$\\displaystyle ${fields.o || '='} ${fields.r}$` : '';
    rows.push(`<tr><td class="eqn-l">${lhs}</td><td class="eqn-r">${rhs}</td><td class="eqn-c">${fields.c ? wikiInline(fields.c) : ''}</td></tr>`);
  }
  return rows.length ? `<table class="eqn">${rows.join('')}</table>` : '';
}
function proofWikiToHtml(raw) {
  let s = String(raw || '');
  // Sentence breaks are stored as a literal "\n"; don't touch LaTeX commands like \neq or \not.
  s = s.replace(/\\n(?![a-z])/g, '\n');
  s = escapeHTML(s);
  s = s.replace(/\{\{begin-eqn\}\}([\s\S]*?)\{\{end-eqn\}\}/g, (_, body) => `\n${eqnBlock(body)}\n`);
  s = s.replace(/\{\{qed(?:\|[^}]*)?\}\}/gi, '<p class="qed">∎</p>');
  s = s.replace(/\{\{AimForCont\}\}/g, 'Aiming for a contradiction, suppose');
  s = s.replace(/\{\{iff\}\}/gi, 'if and only if');
  s = s.replace(/\{\{:[^}]*\}\}/g, ''); // transcluded pages aren't in the dataset
  s = s.replace(/^=+\s*(.+?)\s*=+$/gm, '<h4>$1</h4>');
  s = s.replace(/\{\{(?:begin-axiom|end-axiom|axiom[^}]*|explain[^}]*|refactor[^}]*|questionable[^}]*|improve[^}]*|tidy[^}]*|MissingLinks[^}]*|link[^}]*|proofread[^}]*)\}\}/gi, '');
  s = s.replace(/\{\{([A-Za-z]+)\}\}/g, '');
  const lines = s.split('\n').map((l) => l.trim()).filter(Boolean);
  return lines.map((line) => {
    if (line.startsWith('<table') || line.startsWith('<p') || line.startsWith('<h4')) return line;
    if (/^:+/.test(line)) {
      const inner = line.replace(/^:+\s*/, '');
      // ":$…$" lines are displayed equations.
      return `<div class="pw-display">${wikiInline(inner).replace(/^\$(.*)\$$/, '$$$$\\displaystyle $1$$$$')}</div>`;
    }
    if (/^\*/.test(line)) return `<ul><li>${wikiInline(line.replace(/^\*+\s*/, ''))}</li></ul>`;
    return `<p>${wikiInline(line)}</p>`;
  }).join('');
}

async function proofwiki() {
  for (let attempt = 0; attempt < 3; attempt++) {
    const { row } = await hfRow(PROOFS);
    if (!row.title || !row.text || row.text.length < 30) continue;
    return {
      id: `proofwiki:${row.title}`,
      source: 'proofwiki',
      kind: 'Theorem · ProofWiki',
      heading: row.title,
      url: `https://proofwiki.org/wiki/${encodeURIComponent(row.title.replace(/ /g, '_'))}`,
      html: proofWikiToHtml(row.text),
      solutionHtml: row.target ? proofWikiToHtml(row.target) : null,
      solutionLabel: 'Proof',
      solutionNote: 'From ProofWiki (CC BY-SA), via the NaturalProofs dataset.',
      base: 'proofwiki',
      dollarMath: true,
    };
  }
  throw new Error('no ProofWiki theorem');
}

// ------------------------------------------------------------------ OEIS
async function oeis() {
  for (let attempt = 0; attempt < 4; attempt++) {
    // Low A-numbers are the classic, well-studied sequences; mix those with the rest.
    const { row } = await hfRow(OEIS_DS, { offsetRange: Math.random() < 0.65 ? 40000 : null });
    const kw = row.keywords || [];
    if (kw.some((k) => ['dead', 'dumb', 'obsc', 'dupe'].includes(k))) continue;
    const terms = (row.sequence || []).filter((t) => t !== '');
    if (terms.length < 5 || !row.sequence_name) continue;
    const a = row.sequence_id;
    const refs = (row.cross_references || []).filter((r) => r !== a).slice(0, 12);
    const nice = kw.includes('nice') || kw.includes('core');
    const details = [
      `<h3>About</h3><ul class="plain">`,
      `<li>Offset: ${escapeHTML(row.offset_a ?? '')}</li>`,
      kw.length ? `<li>Keywords: ${escapeHTML(kw.filter((k) => k !== 'changed').join(', '))}</li>` : '',
      row.author ? `<li>Author: ${escapeHTML(row.author)}</li>` : '',
      `</ul>`,
      refs.length ? `<h3>Related sequences</h3><p>${refs.map((r) => `<a href="https://oeis.org/${r}">${r}</a>`).join(' · ')}</p>` : '',
      `<p class="hint">Formulas, comments and proofs are on the sequence's OEIS page — tap <b>Source</b>.</p>`,
    ].join('');
    return {
      id: `oeis:${a}`,
      source: 'oeis',
      kind: 'Sequence · OEIS',
      heading: nice ? `${a} ★` : a,
      url: `https://oeis.org/${a}`,
      html: `<p class="oeis-name">${linkifyOEIS(escapeHTML(row.sequence_name))}</p>`,
      terms: terms.slice(0, 40),
      solutionHtml: details,
      solutionLabel: 'More',
      solutionNote: 'From the OEIS (CC BY-SA), via a Hugging Face mirror.',
      base: 'oeis',
    };
  }
  throw new Error('no OEIS sequence');
}
function linkifyOEIS(s) {
  return s.replace(/\bA(\d{6})\b/g, '<a href="https://oeis.org/A$1">A$1</a>');
}

// ------------------------------------------------------------------ Wikipedia (maths only, live)
const WIKI_CATEGORY_GROUPS = [
  ['Theorems_in_number_theory', 'Theorems_about_prime_numbers', 'Conjectures_about_prime_numbers', 'Integer_sequences', 'Figurate_numbers', 'Diophantine_equations', 'Modular_arithmetic', 'Additive_number_theory', 'Analytic_number_theory', 'Prime_numbers'],
  ['Theorems_in_abstract_algebra', 'Theorems_in_group_theory', 'Theorems_in_ring_theory', 'Group_theory', 'Finite_groups', 'Ring_theory', 'Field_(mathematics)', 'Galois_theory', 'Theorems_in_algebra'],
  ['Linear_algebra', 'Theorems_in_linear_algebra', 'Polynomials', 'Matrices', 'Inequalities'],
  ['Graph_theory', 'Theorems_in_graph_theory', 'Graph_invariants', 'Graph_families', 'Graph_coloring', 'Extremal_graph_theory', 'Topological_graph_theory'],
  ['Theorems_in_combinatorics', 'Enumerative_combinatorics', 'Ramsey_theory', 'Combinatorial_game_theory', 'Permutations', 'Combinatorial_design', 'Factorial_and_binomial_topics'],
  ['Theorems_in_geometry', 'Theorems_about_triangles', 'Theorems_about_circles', 'Triangle_geometry', 'Euclidean_plane_geometry', 'Polyhedra', 'Conic_sections', 'Tessellation', 'Curves'],
  ['Theorems_in_real_analysis', 'Theorems_in_complex_analysis', 'Theorems_in_calculus', 'Mathematical_series', 'Special_functions', 'Fractals', 'Theorems_in_probability_theory'],
  ['Unsolved_problems_in_mathematics', 'Mathematical_paradoxes', 'Recreational_mathematics', 'Mathematical_puzzles', 'Mathematical_constants', 'Large_numbers', 'Theorems_in_topology', 'Knot_theory', 'Theorems_in_the_foundations_of_mathematics', 'Mathematical_logic'],
];

function mwURL(params) {
  return `${WIKI_API}?${new URLSearchParams({ format: 'json', formatversion: '2', origin: '*', ...params })}`;
}

async function wikipedia() {
  for (let attempt = 0; attempt < 3; attempt++) {
    const search = `incategory:${pick(WIKI_CATEGORY_GROUPS).join('|')}`;
    const data = await getJSON(mwURL({ action: 'query', list: 'search', srsearch: search, srsort: 'random', srlimit: '1', srnamespace: '0', srprop: '' }));
    const title = data.query?.search?.[0]?.title;
    if (!title || /^(List|Lists|Outline|Index|Glossary|Timeline) of/i.test(title)) continue;
    const parsed = await getJSON(mwURL({ action: 'parse', page: title, prop: 'text', section: '0', redirects: '1', disableeditsection: '1' }));
    if (parsed.error) continue;
    const doc = new DOMParser().parseFromString(parsed.parse.text, 'text/html');
    doc.querySelectorAll('.infobox, .sidebar, .navbox, .hatnote, .mw-empty-elt, .reference, .metadata, .ambox, table, style, .shortdescription, .mw-references-wrap, figure, .thumb, .noprint').forEach((n) => n.remove());
    const root = doc.querySelector('.mw-parser-output') || doc.body;
    if (root.textContent.trim().length < 200) continue;
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

export const SOURCES = {
  contest: { label: 'AMC & AIME', short: 'AMC/AIME', fetch: amcAime, blurb: '5,000+ problems with AoPS Wiki solutions' },
  olympiad: { label: 'Olympiads', short: 'Olympiad', fetch: olympiad, blurb: '150,000+ olympiad problems with solutions' },
  aops: { label: 'AoPS forum', short: 'AoPS', fetch: aopsForum, blurb: '65,000+ problems from the AoPS community' },
  proofwiki: { label: 'ProofWiki', short: 'Proofs', fetch: proofwiki, blurb: '24,000+ theorems with proofs' },
  oeis: { label: 'OEIS', short: 'Sequences', fetch: oeis, blurb: 'All 390,000+ integer sequences' },
  wikipedia: { label: 'Wikipedia', short: 'Concepts', fetch: wikipedia, blurb: 'Maths articles, from algebra to topology' },
};
