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

async function hfRow(dataset, { where = '', offsetRange = null, config = 'default', split = 'train' } = {}) {
  const key = config === 'default' && split === 'train' ? `${dataset}|${where}` : `${dataset}|${config}|${split}|${where}`;
  let total = totals[key] ?? KNOWN[key];
  const q = `dataset=${encodeURIComponent(dataset)}&config=${encodeURIComponent(config)}&split=${encodeURIComponent(split)}`;
  const url = (offset) => where
    ? `${HF}/filter?${q}&where=${encodeURIComponent(where)}&offset=${offset}&length=1`
    : `${HF}/rows?${q}&offset=${offset}&length=1`;
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
// Problems and solutions in the datasets are plain text with LaTeX: $…$, $$…$$, \(…\), \[…\],
// equation environments, and some text-mode LaTeX (\textbf, lists, tabular) and Markdown.
// Formulas become <span class="m">TeX</span> placeholders that render.js typesets with KaTeX.
const MATH_ENVS = 'align\\*?|aligned|equation\\*?|gather\\*?|gathered|eqnarray\\*?|multline\\*?|split|cases|array|matrix|pmatrix|bmatrix|vmatrix|Bmatrix|Vmatrix|smallmatrix';
const ENV_START = new RegExp(`^\\\\begin\\{(${MATH_ENVS})\\}`);
const DOLLAR = ''; // stands in for an escaped \$ until formulas have been found

// Index of the brace matching the "{" at position i, or -1.
function closeBrace(s, i) {
  let depth = 0;
  for (let j = i; j < s.length; j++) {
    const c = s[j];
    if (c === '\\') { j++; continue; }
    if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return j;
  }
  return -1;
}
// Replace \name{arg} (nested braces allowed) using fn(arg).
function replaceCmd(s, name, fn) {
  const re = new RegExp(`\\\\${name}\\s*\\{`, 'g');
  let out = ''; let last = 0; let m;
  while ((m = re.exec(s))) {
    const open = m.index + m[0].length - 1;
    const close = closeBrace(s, open);
    if (close < 0) break;
    out += s.slice(last, m.index) + fn(s.slice(open + 1, close));
    last = close + 1;
    re.lastIndex = close + 1;
  }
  return out + s.slice(last);
}

// Looks like "$5 and $10" (money), not a formula.
function isCurrency(inner) {
  return /^\d[\d,.]*(\s|$)/.test(inner) && /\s[a-zA-Z]{2,}/.test(inner) && !/[\\^_=+<>{}]/.test(inner);
}

// Split text into [{math:false,text}|{math:true,tex,display}] tokens.
function tokenize(s) {
  const out = [];
  let buf = '';
  const flush = () => { if (buf) { out.push({ math: false, text: buf }); buf = ''; } };
  let i = 0;
  while (i < s.length) {
    const rest = s.startsWith('\\', i) || s[i] === '$' ? s.slice(i, i + 40) : '';
    let m;
    if (s.startsWith('$$', i)) {
      const j = s.indexOf('$$', i + 2);
      if (j > i + 2) { flush(); out.push({ math: true, tex: s.slice(i + 2, j), display: true }); i = j + 2; continue; }
    } else if (s.startsWith('\\[', i)) {
      const j = s.indexOf('\\]', i + 2);
      if (j > i) { flush(); out.push({ math: true, tex: s.slice(i + 2, j), display: true }); i = j + 2; continue; }
    } else if (s.startsWith('\\(', i)) {
      const j = s.indexOf('\\)', i + 2);
      if (j > i) { flush(); out.push({ math: true, tex: s.slice(i + 2, j), display: false }); i = j + 2; continue; }
    } else if (rest && (m = rest.match(ENV_START))) {
      const endTag = `\\end{${m[1]}}`;
      const j = s.indexOf(endTag, i + m[0].length);
      if (j > i) { flush(); out.push({ math: true, tex: s.slice(i, j + endTag.length), display: true }); i = j + endTag.length; continue; }
    } else if (s[i] === '$') {
      const j = s.indexOf('$', i + 1);
      const inner = j > i ? s.slice(i + 1, j) : '';
      if (j > i + 1 && !/\n\s*\n/.test(inner) && !isCurrency(inner)) {
        flush(); out.push({ math: true, tex: inner, display: false }); i = j + 1; continue;
      }
    }
    buf += s[i];
    i++;
  }
  flush();
  return out;
}

// Text-mode LaTeX and Markdown → HTML. Input is raw text; output is safe HTML.
function textMode(raw) {
  let s = escapeHTML(raw);
  // Markdown images (many olympiad problems have their diagrams this way) and links.
  s = s.replace(/!\[([^\]]*)\]\((https:\/\/[^)\s]+)\)/g, (_, alt, url) => `<img class="figure" src="${url}" alt="${alt || 'Figure'}">`);
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>');
  for (const [cmd, tag] of [['textbf', 'b'], ['bf', 'b'], ['textit', 'i'], ['emph', 'i'], ['textsl', 'i'], ['underline', 'u'], ['texttt', 'code']]) {
    s = replaceCmd(s, cmd, (x) => `<${tag}>${x}</${tag}>`);
  }
  for (const cmd of ['text', 'textrm', 'textup', 'textnormal', 'mbox', 'hbox', 'textsc']) s = replaceCmd(s, cmd, (x) => x);
  s = replaceCmd(s, 'section\\*?', (x) => `<b>${x}</b>`);
  s = replaceCmd(s, 'subsection\\*?', (x) => `<b>${x}</b>`);
  s = replaceCmd(s, 'footnote', () => '');
  s = s.replace(/\\(?:vspace|hspace)\*?\{[^}]*\}/g, ' ')
    .replace(/\\(?:noindent|medskip|bigskip|smallskip|centering|hfill|newpage|clearpage|indent|par)\b/g, ' ')
    .replace(/\\begin\{(?:center|flushleft|flushright|quote)\}|\\end\{(?:center|flushleft|flushright|quote)\}/g, '\n')
    .replace(/\\begin\{(?:enumerate|itemize)\}(\[[^\]]*\])?/g, '<ul class="tex-list">')
    .replace(/\\end\{(?:enumerate|itemize)\}/g, '</ul>')
    .replace(/\\item(?:\[([^\]]*)\])?\s*/g, (_, lab) => `<li>${lab ? `<b>${lab}</b> ` : ''}`)
    .replace(/\\\\(\[[^\]]*\])?|\\newline\b/g, '\n')
    .replace(/\\(?:qquad|quad)\b/g, ' ')
    .replace(/\\[,;:! ]/g, ' ')
    .replace(/\\(?:ldots|dots|cdots)\b/g, '…')
    .replace(/\\textdegree\b|\\degree\b/g, '°')
    .replace(/\\([%&#_{}])/g, '$1')
    .replace(/\\textbackslash\b/g, '\\')
    .replace(/``/g, '“').replace(/''/g, '”')
    .replace(/---/g, '—').replace(/(\s)--(\s)/g, '$1–$2')
    .replace(/~/g, ' ');
  // Markdown emphasis and headings.
  s = s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|\n)#{1,4}\s+([^\n]+)/g, '$1<b>$2</b>');
  return s;
}

// \begin{tabular} → an HTML table whose cells may contain maths.
function tabularToHtml(body) {
  const rows = body.replace(/\\hline|\\cline\{[^}]*\}|\\toprule|\\midrule|\\bottomrule/g, '')
    .split(/\\\\/).map((r) => r.trim()).filter(Boolean);
  if (!rows.length) return '';
  const cell = (c) => inlineToHtml(c.replace(/\\multicolumn\{[^}]*\}\{[^}]*\}\{([\s\S]*)\}/, '$1').trim());
  return `<table class="tex-table">${rows.map((r) => `<tr>${r.replace(/\\&/g, '\uE004').split('&').map((c) => `<td>${cell(c.replace(/\uE004/g, '\\&'))}</td>`).join('')}</tr>`).join('')}</table>`;
}

function mathSpan(tex, display) {
  const t = tex.replace(new RegExp(DOLLAR, 'g'), '\\$').trim();
  if (!t) return '';
  return `<span class="m${display ? ' md' : ''}">${escapeHTML(t)}</span>`;
}

function inlineToHtml(text) {
  return tokenize(text).map((t) => (t.math ? mathSpan(t.tex, t.display) : textMode(t.text).replace(new RegExp(DOLLAR, 'g'), '$'))).join('');
}

export function textToHtml(text) {
  let s = String(text || '').replace(/\r\n?/g, '\n').trim()
    // Leftover instructions from machine translation in some olympiad problems.
    .replace(/\n*\s*Translate the above text into English[^\n]*/gi, '')
    .replace(/\\\$/g, DOLLAR);
  const tables = [];
  s = s.replace(/\\begin\{tabular\}\s*(\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\})?([\s\S]*?)\\end\{tabular\}/g, (_, spec, body) => {
    tables.push(tabularToHtml(body));
    return `${tables.length - 1}`;
  });
  // Asymptote diagram code can't be drawn here.
  s = s.replace(/\[asy\][\s\S]*?\[\/asy\]/gi, '');
  let html = tokenize(s).map((t) => {
    if (t.math) return mathSpan(t.tex, t.display);
    return textMode(t.text).replace(new RegExp(DOLLAR, 'g'), '$');
  }).join('');
  html = html.replace(/(\d+)/g, (_, n) => tables[Number(n)] || '')
    .replace(//g, '<span class="diagram-note">This problem has a diagram. Tap <b>Source</b> to see it.</span>');
  // The "tt" wrapper tells the renderer this text was already parsed, so stray $ signs are money, not maths.
  return `<div class="tt">${html.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('')}</div>`;
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
export function answerFor(problem, answer, questionType) {
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
const PROBLEM_TOPICS = ['Algebra', 'Number Theory', 'Combinatorics', 'Geometry', 'Inequalities', 'Calculus', 'Logic and Puzzles', 'Other'];

// ------------------------------------------------------------------ difficulty & filters
// Every problem gets a difficulty on one 1–10 scale. Omni-MATH is rated on it directly, MATH levels 1–5
// map onto it, and the other sources get a typical value for their kind of problem (shown as "~").
export const DEFAULT_FILTERS = {
  dmin: 1, dmax: 10, matchLevel: false, unrated: true,
  qtype: 'any', // any | mcq | number | proof
  checkable: false, hideSeen: true,
  wikiTopics: ['numberTheory', 'algebra', 'linear', 'graphs', 'combinatorics', 'geometry', 'analysis', 'misc'],
  oeisClassic: false,
};
export const ESTIMATES = { contest: 3.5, aops: 5, olympiad: 6 };
export const mathLevelToDifficulty = (level) => Math.round((0.4 + 0.65 * level) * 10) / 10; // L1≈1, L5≈3.7
export function ratingToDifficulty(rating) { return (rating - 600) / 160; }
export function difficultyToRating(d) { return 600 + d * 160; }

// The difficulty window to use, taking "match my level" into account.
export function difficultyWindow(settings) {
  const f = { ...DEFAULT_FILTERS, ...(settings.filters || {}) };
  if (f.matchLevel) {
    const c = Math.max(1, Math.min(10, ratingToDifficulty(settings.rating || 1000)));
    return [Math.max(1, c - 1.5), Math.min(10, c + 1.5)];
  }
  return [f.dmin, f.dmax];
}
export { PROBLEM_TOPICS };

function numinaWhere(source, topics, qtype = 'any') {
  let w = `"source"='${source}' AND "problem_is_valid"='Yes' AND "solution_is_valid"='Yes' AND "solution" IS NOT NULL`;
  if (topics && topics.length && topics.length < PROBLEM_TOPICS.length) {
    const named = topics.filter((t) => t !== 'Other').map((t) => `"problem_type"='${t}'`);
    if (topics.includes('Other')) named.push(`"problem_type"='Other'`, `"problem_type"='unknown'`);
    w += ` AND (${named.join(' OR ')})`;
  }
  if (qtype === 'mcq') w += ` AND "question_type"='MCQ'`;
  if (qtype === 'number') w += ` AND "question_type"='math-word-problem'`;
  if (qtype === 'proof') w += ` AND "question_type"='proof'`;
  return w;
}
const isCheckable = (c) => c.answer && (c.answer.type === 'choice' || c.answer.type === 'numeric');

function searchLink(problem, site) {
  const plain = String(problem).replace(/\$[^$]*\$/g, ' ').replace(/\\[a-z]+/gi, ' ').replace(/[^\w\s'-]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = plain.split(' ').slice(0, 12).join(' ');
  return `https://www.google.com/search?q=${encodeURIComponent(`"${words}"${site ? ` site:${site}` : ''}`)}`;
}

function numinaCard(row, index, cfg) {
  return {
    id: `numina:${row.source}:${index}`,
    source: cfg.tag,
    kind: cfg.kind,
    heading: row.problem_type && row.problem_type !== 'unknown' ? `${cfg.heading} · ${row.problem_type}` : cfg.heading,
    topic: row.problem_type,
    url: searchLink(row.problem, cfg.site),
    html: textToHtml(row.problem),
    solutionHtml: row.solution ? textToHtml(row.solution) : null,
    hintHtml: row.solution ? hintFrom(row.solution) : null,
    solutionLabel: 'Solution',
    solutionNote: cfg.solutionNote,
    answer: answerFor(row.problem, row.answer, row.question_type),
    isProof: row.question_type === 'proof',
    difficulty: ESTIMATES[cfg.tag] ?? 5,
    rated: false,
    base: 'text',
    dollarMath: true,
  };
}

// First sentence or two of a solution, cut where no formula is left open.
function hintFrom(solution) {
  const text = String(solution).replace(/^\s*(\[?solution\]?|solution\s*\d*[.:])\s*/i, '').trim();
  let cut = -1;
  const re = /[.!?](\s|$)/g;
  let m;
  while ((m = re.exec(text))) {
    const before = text.slice(0, m.index + 1);
    const dollars = (before.replace(/\\\$/g, '').match(/\$/g) || []).length;
    const opens = (before.match(/\\[([]/g) || []).length;
    const closes = (before.match(/\\[)\]]/g) || []).length;
    if (dollars % 2 === 0 && opens === closes && before.length >= 40) { cut = m.index + 1; break; }
  }
  if (cut < 0 || cut > 360) return null;
  if (cut > text.length * 0.6) return null; // that would give away most of the solution
  return textToHtml(text.slice(0, cut));
}

const NUMINA_CFG = {
  amc_aime: {
    kind: 'AMC / AIME', tag: 'contest', heading: 'AMC / AIME', site: 'artofproblemsolving.com',
    solutionNote: 'Solution from the AoPS Wiki, via the NuminaMath dataset.',
  },
  aops_forum: {
    kind: 'AoPS forum', tag: 'aops', heading: 'AoPS', site: 'artofproblemsolving.com',
    solutionNote: 'From the NuminaMath dataset. Solutions to AoPS forum problems were written up with AI help and can contain mistakes.',
  },
  olympiads: {
    kind: 'Olympiad', tag: 'olympiad', heading: 'Olympiad',
    solutionNote: 'From the NuminaMath dataset (olympiad problems and official solutions, translated to English). May contain translation slips.',
  },
};

function numinaSource(source) {
  return async (settings) => {
    const f = { ...DEFAULT_FILTERS, ...(settings.filters || {}) };
    for (let attempt = 0; attempt < (f.checkable ? 5 : 1); attempt++) {
      const { row, index } = await hfRow(NUMINA, { where: numinaWhere(source, settings.topics, f.qtype) });
      if (!row.problem || row.problem.length < 20) continue;
      const card = numinaCard(row, index, NUMINA_CFG[source]);
      if (!f.checkable || isCheckable(card)) return card;
    }
    throw new Error('no matching problem');
  };
}

// ------------------------------------------------------------------ MATH dataset (levels 1–5)
const MATH_DS = 'EleutherAI/hendrycks_math';
const MATH_CONFIGS = {
  algebra: { topic: 'Algebra', size: 2931 }, intermediate_algebra: { topic: 'Algebra', size: 2198 }, prealgebra: { topic: 'Algebra', size: 2076 },
  number_theory: { topic: 'Number Theory', size: 1409 }, counting_and_probability: { topic: 'Combinatorics', size: 1245 },
  geometry: { topic: 'Geometry', size: 1349 }, precalculus: { topic: 'Calculus', size: 1292 },
};
const MATH_NAMES = { algebra: 'Algebra', intermediate_algebra: 'Intermediate Algebra', prealgebra: 'Prealgebra', number_theory: 'Number Theory', counting_and_probability: 'Counting & Probability', geometry: 'Geometry', precalculus: 'Precalculus' };

// The contents of the last \boxed{…} in a solution.
function lastBoxed(sol) {
  const i = sol.lastIndexOf('\\boxed');
  if (i < 0) return null;
  const open = sol.indexOf('{', i);
  if (open < 0) return null;
  const close = closeBrace(sol, open);
  return close > open ? sol.slice(open + 1, close).trim() : null;
}

function mathCard(row, config, index, split) {
  const level = parseInt(String(row.level).replace(/\D/g, ''), 10) || 3;
  const ans = lastBoxed(row.solution || '');
  return {
    id: `math:${config}:${split}:${index}`,
    source: 'math',
    kind: 'MATH',
    heading: `${MATH_NAMES[config] || row.type} · Level ${level}`,
    topic: MATH_CONFIGS[config]?.topic,
    url: `https://huggingface.co/datasets/${MATH_DS}`,
    html: textToHtml(row.problem),
    solutionHtml: row.solution ? textToHtml(row.solution) : null,
    hintHtml: row.solution ? hintFrom(row.solution) : null,
    solutionLabel: 'Solution',
    solutionNote: 'From the MATH dataset (Hendrycks et al.), competition problems with worked solutions.',
    answer: ans ? answerFor(row.problem, ans.replace(/^\\text\{\s*\(?([A-E])\)?\s*\}$/, '($1)'), 'math-word-problem') : null,
    difficulty: mathLevelToDifficulty(level),
    rated: true,
    base: 'text',
    dollarMath: true,
  };
}

async function mathSource(settings) {
  const f = { ...DEFAULT_FILTERS, ...(settings.filters || {}) };
  if (f.qtype === 'mcq' || f.qtype === 'proof') throw new Error('no matching problem');
  const [lo, hi] = difficultyWindow(settings);
  const levels = [1, 2, 3, 4, 5].filter((l) => { const d = mathLevelToDifficulty(l); return d >= lo - 0.3 && d <= hi + 0.3; });
  if (!levels.length) throw new Error('no matching problem');
  const configs = Object.entries(MATH_CONFIGS).filter(([, v]) => !settings.topics || settings.topics.includes(v.topic));
  if (!configs.length) throw new Error('no matching problem');
  for (let attempt = 0; attempt < (f.checkable ? 5 : 2); attempt++) {
    let r = Math.random() * configs.reduce((a, [, v]) => a + v.size, 0);
    let config = configs[0][0];
    for (const [k, v] of configs) { if ((r -= v.size) < 0) { config = k; break; } }
    const split = Math.random() < 0.6 ? 'train' : 'test';
    const where = levels.length === 5 ? '' : `(${levels.map((l) => `"level"='Level ${l}'`).join(' OR ')})`;
    const { row, index } = await hfRow(MATH_DS, { config, split, where });
    if (!row.problem) continue;
    const card = mathCard(row, config, index, split);
    if (!f.checkable || isCheckable(card)) return card;
  }
  throw new Error('no matching problem');
}

// ------------------------------------------------------------------ Omni-MATH (rated 1–10)
const OMNI_DS = 'KbsdJames/Omni-MATH';
function omniCard(row, index) {
  const domain = (Array.isArray(row.domain) ? row.domain[0] : row.domain) || '';
  const parts = String(domain).split('->').map((x) => x.trim()).filter((x) => x && x !== 'Mathematics');
  const area = parts[parts.length - 1] || 'Olympiad';
  const d = Math.round(Number(row.difficulty) * 10) / 10 || 6;
  return {
    id: `omni:${index}`,
    source: 'omni',
    kind: 'Omni-MATH',
    heading: area === 'Other' && parts[0] ? parts[0] : area,
    topic: parts[0] || null,
    url: searchLink(row.problem, ''),
    html: textToHtml(row.problem),
    solutionHtml: row.solution ? textToHtml(row.solution) : null,
    hintHtml: row.solution ? hintFrom(row.solution) : null,
    solutionLabel: 'Solution',
    solutionNote: `From Omni-MATH${row.source ? ` (originally ${String(row.source).replace(/_/g, ' ')})` : ''}.`,
    answer: row.answer ? answerFor(row.problem, row.answer, 'math-word-problem') : null,
    difficulty: d,
    rated: true,
    base: 'text',
    dollarMath: true,
  };
}
async function omniSource(settings) {
  const f = { ...DEFAULT_FILTERS, ...(settings.filters || {}) };
  if (f.qtype === 'mcq' || f.qtype === 'proof') throw new Error('no matching problem');
  const [lo, hi] = difficultyWindow(settings);
  const where = lo <= 1 && hi >= 10 ? '' : `"difficulty" >= ${lo.toFixed(1)} AND "difficulty" <= ${hi.toFixed(1)}`;
  for (let attempt = 0; attempt < (f.checkable ? 5 : 2); attempt++) {
    const { row, index } = await hfRow(OMNI_DS, { split: 'test', where });
    if (!row.problem) continue;
    const card = omniCard(row, index);
    if (!f.checkable || isCheckable(card)) return card;
  }
  throw new Error('no matching problem');
}

// The same AMC/AIME problem for everyone on a given day, picked from the date.
export async function dailyChallenge(dateStr) {
  const where = numinaWhere('amc_aime', null);
  const key = `${NUMINA}|${where}`;
  let total = totals[key];
  const url = (offset) => `${HF}/filter?dataset=${encodeURIComponent(NUMINA)}&config=default&split=train&where=${encodeURIComponent(where)}&offset=${offset}&length=1`;
  if (total == null) {
    const first = await getJSON(url(0));
    rememberTotal(key, first.num_rows_total);
    total = first.num_rows_total;
  }
  if (!total) throw new Error('no rows');
  let seed = 0;
  for (const ch of `ms-daily-${dateStr}`) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  for (let i = 0; i < 6; i++) {
    const data = await getJSON(url((seed + i * 7919) % total));
    const r = data.rows?.[0];
    if (!r) continue;
    const card = numinaCard(r.row, r.row_idx, NUMINA_CFG.amc_aime);
    if (card.answer && (card.answer.type === 'choice' || card.answer.type === 'numeric')) {
      return { ...card, id: `daily:${dateStr}`, daily: dateStr, heading: 'Daily challenge' };
    }
  }
  throw new Error('no answerable problem');
}

const amcAime = numinaSource('amc_aime');
const aopsForum = numinaSource('aops_forum');
const olympiad = numinaSource('olympiads');

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

function proofCard(row) {
  if (!row.title || !row.text || row.text.length < 30) return null;
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

async function proofwiki() {
  for (let attempt = 0; attempt < 3; attempt++) {
    const { row } = await hfRow(PROOFS);
    const card = proofCard(row);
    if (card) return card;
  }
  throw new Error('no ProofWiki theorem');
}

// ------------------------------------------------------------------ OEIS
function oeisCard(row) {
  const kw = row.keywords || [];
  if (kw.some((k) => ['dead', 'dumb', 'obsc', 'dupe'].includes(k))) return null;
  const terms = (row.sequence || []).filter((t) => t !== '');
  if (terms.length < 5 || !row.sequence_name) return null;
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

async function oeis(settings) {
  for (let attempt = 0; attempt < 4; attempt++) {
    // Low A-numbers are the classic, well-studied sequences; mix those with the rest.
    const classic = settings?.filters?.oeisClassic;
    const { row } = await hfRow(OEIS_DS, { offsetRange: classic || Math.random() < 0.65 ? 40000 : null });
    const card = oeisCard(row);
    if (card) return card;
  }
  throw new Error('no OEIS sequence');
}
function linkifyOEIS(s) {
  return s.replace(/\bA(\d{6})\b/g, '<a href="https://oeis.org/A$1">A$1</a>');
}

// ------------------------------------------------------------------ Wikipedia (maths only, live)
const WIKI_GROUP_KEYS = ['numberTheory', 'algebra', 'linear', 'graphs', 'combinatorics', 'geometry', 'analysis', 'misc'];
export const WIKI_GROUP_NAMES = { numberTheory: 'Number theory', algebra: 'Abstract algebra', linear: 'Linear algebra', graphs: 'Graph theory', combinatorics: 'Combinatorics', geometry: 'Geometry', analysis: 'Analysis & probability', misc: 'Puzzles, logic & topology' };
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

async function wikiCard(title) {
  const parsed = await getJSON(mwURL({ action: 'parse', page: title, prop: 'text', section: '0', redirects: '1', disableeditsection: '1' }));
  if (parsed.error) return null;
  const doc = new DOMParser().parseFromString(parsed.parse.text, 'text/html');
  doc.querySelectorAll('.infobox, .sidebar, .navbox, .hatnote, .mw-empty-elt, .reference, .metadata, .ambox, table, style, .shortdescription, .mw-references-wrap, figure, .thumb, .noprint').forEach((n) => n.remove());
  const root = doc.querySelector('.mw-parser-output') || doc.body;
  if (root.textContent.trim().length < 120) return null;
  const t = parsed.parse.title || title;
  return {
    id: `wiki:${t}`,
    source: 'wikipedia',
    kind: 'Concept · Wikipedia',
    heading: t,
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(t.replace(/ /g, '_'))}`,
    html: root.innerHTML,
    base: 'wikipedia',
  };
}

async function wikipedia(settings) {
  const wanted = settings?.filters?.wikiTopics;
  const groups = WIKI_CATEGORY_GROUPS.filter((g, i) => !wanted || !wanted.length || wanted.includes(WIKI_GROUP_KEYS[i]));
  for (let attempt = 0; attempt < 3; attempt++) {
    const search = `incategory:${pick(groups.length ? groups : WIKI_CATEGORY_GROUPS).join('|')}`;
    const data = await getJSON(mwURL({ action: 'query', list: 'search', srsearch: search, srsort: 'random', srlimit: '1', srnamespace: '0', srprop: '' }));
    const title = data.query?.search?.[0]?.title;
    if (!title || /^(List|Lists|Outline|Index|Glossary|Timeline) of/i.test(title)) continue;
    const card = await wikiCard(title);
    if (card) return card;
  }
  throw new Error('no good Wikipedia article');
}

// ------------------------------------------------------------------ search
// Runs a keyword search across every source. Calls onGroup(sourceKey, results) as each source answers.
// Each result: { title, snippet, load: () => Promise<card> }.
const sq = (q) => q.replace(/'/g, "''").replace(/[%_]/g, ' ');
function plainSnippet(s, n = 140) {
  return String(s || '').replace(/\\n(?![a-z])/g, ' ').replace(/\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$\$[\s\S]*?\$\$/g, '…').replace(/\$[^$]*\$/g, '…').replace(/\[\[([^\]|]*\|)?([^\]]*)\]\]/g, '$2').replace(/\s+/g, ' ').trim().slice(0, n);
}
async function hfSearch(dataset, where, length = 6) {
  const data = await getJSON(`${HF}/filter?dataset=${encodeURIComponent(dataset)}&config=default&split=train&where=${encodeURIComponent(where)}&offset=0&length=${length}`, 30000);
  if (data.error) throw new Error(data.error);
  return data.rows || [];
}

export function searchAll(query, onGroup) {
  const q = query.trim();
  if (!q) return;
  const like = `'%${sq(q)}%'`;
  const jobs = {
    wikipedia: async () => {
      const data = await getJSON(mwURL({ action: 'query', list: 'search', srsearch: q, srlimit: '6', srnamespace: '0', srprop: 'snippet' }));
      return (data.query?.search || []).map((r) => ({
        title: r.title,
        snippet: r.snippet.replace(/<[^>]+>/g, ''),
        load: () => wikiCard(r.title),
      }));
    },
    problems: async () => {
      const rows = await hfSearch(NUMINA, `"problem" ILIKE ${like} AND "problem_is_valid"='Yes' AND "solution" IS NOT NULL AND ("source"='amc_aime' OR "source"='aops_forum' OR "source"='olympiads')`, 8);
      return rows.map((r) => ({
        title: NUMINA_CFG[r.row.source]?.heading || 'Problem',
        tag: NUMINA_CFG[r.row.source]?.tag || 'olympiad',
        snippet: plainSnippet(r.row.problem),
        load: async () => numinaCard(r.row, r.row_idx, NUMINA_CFG[r.row.source] || NUMINA_CFG.olympiads),
      }));
    },
    proofwiki: async () => {
      const rows = await hfSearch(PROOFS, `"title" ILIKE ${like}`, 6);
      return rows.map((r) => ({ title: r.row.title, snippet: plainSnippet(r.row.text), load: async () => proofCard(r.row) }));
    },
    oeis: async () => {
      const isId = /^A?\d{1,6}$/i.test(q);
      const where = isId ? `"sequence_id"='A${q.replace(/^A/i, '').padStart(6, '0')}'` : `"sequence_name" ILIKE ${like}`;
      const rows = await hfSearch(OEIS_DS, where, 6);
      return rows.map((r) => ({ title: r.row.sequence_id, snippet: plainSnippet(r.row.sequence_name), load: async () => oeisCard(r.row) }));
    },
  };
  for (const [key, job] of Object.entries(jobs)) {
    job().then((res) => onGroup(key, res, null)).catch((err) => onGroup(key, [], err));
  }
}

// Whether a source can produce anything under the current filters.
function unratedEligible(key) {
  return (settings) => {
    const f = { ...DEFAULT_FILTERS, ...(settings.filters || {}) };
    if (!f.unrated) return false;
    const [lo, hi] = difficultyWindow(settings);
    const est = ESTIMATES[key];
    return est >= lo - 1.5 && est <= hi + 1.5;
  };
}
const ratedEligible = (min, max) => (settings) => {
  const f = { ...DEFAULT_FILTERS, ...(settings.filters || {}) };
  if (f.qtype === 'mcq' || f.qtype === 'proof') return false;
  const [lo, hi] = difficultyWindow(settings);
  return hi >= min && lo <= max;
};
const problemsOnlyFilter = (settings) => (settings.filters?.qtype || 'any') === 'any' && !settings.filters?.checkable;

export const SOURCES = {
  contest: { label: 'AMC & AIME', short: 'AMC/AIME', fetch: amcAime, blurb: '5,000+ problems with AoPS Wiki solutions', problems: true, eligible: unratedEligible('contest') },
  math: { label: 'MATH dataset', short: 'MATH', fetch: mathSource, blurb: '12,500 competition problems, levels 1–5', problems: true, eligible: ratedEligible(1, 4) },
  omni: { label: 'Omni-MATH', short: 'Omni', fetch: omniSource, blurb: '4,400 olympiad problems rated 1–10', problems: true, eligible: ratedEligible(1, 10) },
  olympiad: { label: 'Olympiads', short: 'Olympiad', fetch: olympiad, blurb: '150,000+ olympiad problems with solutions', problems: true, eligible: unratedEligible('olympiad') },
  aops: { label: 'AoPS forum', short: 'AoPS', fetch: aopsForum, blurb: '30,000+ problems from the AoPS community', problems: true, eligible: unratedEligible('aops') },
  proofwiki: { label: 'ProofWiki', short: 'Proofs', fetch: proofwiki, blurb: '24,000+ theorems with proofs', eligible: problemsOnlyFilter },
  oeis: { label: 'OEIS', short: 'Sequences', fetch: oeis, blurb: 'All 390,000+ integer sequences', eligible: problemsOnlyFilter },
  wikipedia: { label: 'Wikipedia', short: 'Concepts', fetch: wikipedia, blurb: 'Maths articles, from algebra to topology', eligible: problemsOnlyFilter },
};
