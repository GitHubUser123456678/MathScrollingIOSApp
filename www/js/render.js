// Turns raw wiki HTML into safe, nicely-typeset card content.

const BASES = {
  aops: 'https://artofproblemsolving.com',
  wikipedia: 'https://en.wikipedia.org',
  proofwiki: 'https://proofwiki.org',
  oeis: 'https://oeis.org',
};

// Macros that ProofWiki and AoPS authors use which KaTeX lacks.
const MACROS = {
  '\\paren': '\\left(#1\\right)',
  '\\set': '\\left\\{#1\\right\\}',
  '\\size': '\\left|#1\\right|',
  '\\card': '\\left|#1\\right|',
  '\\norm': '\\left\\Vert#1\\right\\Vert',
  '\\floor': '\\left\\lfloor#1\\right\\rfloor',
  '\\ceiling': '\\left\\lceil#1\\right\\rceil',
  '\\sqbrk': '\\left[#1\\right]',
  '\\tuple': '\\left\\langle#1\\right\\rangle',
  '\\sequence': '\\left\\langle#1\\right\\rangle',
  '\\map': '#1\\left(#2\\right)',
  '\\closedint': '\\left[#1 \\,.\\,.\\, #2\\right]',
  '\\openint': '\\left(#1 \\,.\\,.\\, #2\\right)',
  '\\hointr': '\\left[#1 \\,.\\,.\\, #2\\right)',
  '\\hointl': '\\left(#1 \\,.\\,.\\, #2\\right]',
  '\\cmod': '\\left|#1\\right|',
  '\\eqclass': '\\left[#1\\right]_{#2}',
  '\\ds': '\\displaystyle',
  '\\dd': '\\mathrm d',
  '\\R': '\\mathbb R',
  '\\N': '\\mathbb N',
  '\\Z': '\\mathbb Z',
  '\\Q': '\\mathbb Q',
  '\\C': '\\mathbb C',
  '\\lcm': '\\operatorname{lcm}',
  '\\divides': '\\mid',
  '\\nbr': '\\,',
  '\\ord': '\\operatorname{ord}',
  '\\Img': '\\operatorname{Im}',
  '\\Dom': '\\operatorname{Dom}',
  '\\Rng': '\\operatorname{Rng}',
  '\\len': '\\operatorname{len}',
  '\\Area': '\\operatorname{Area}',
  '\\degrees': '^\\circ',
  '\\textdollar': '\\$',
  '\\emph': '\\textit{#1}',
  '\\mbox': '\\text{#1}',
  '\\tfrac': '\\frac{#1}{#2}',
  '\\stackrel': '\\overset{#1}{#2}',
  '\\leqslant': '\\leq',
  '\\geqslant': '\\geq',
  '\\overarc': '\\overset{\\frown}{#1}',
  '\\arc': '\\overset{\\frown}{#1}',
  '\\order': '\\left|#1\\right|',
  '\\index': '\\left[#1:#2\\right]',
  '\\gen': '\\left\\langle#1\\right\\rangle',
  '\\family': '\\left\\langle#1\\right\\rangle',
  '\\struct': '\\left(#1\\right)',
  '\\powerset': '\\mathcal P\\left(#1\\right)',
  '\\relcomp': '\\complement_{#1}\\left(#2\\right)',
  '\\Ker': '\\operatorname{Ker}',
  '\\eval': '\\left.#1\\right|',
  '\\valueat': '\\left.#1\\right|_{#2}',
  '\\intlimits': '\\left[#1\\right]_{#2}^{#3}',
  '\\nequiv': '\\not\\equiv',
  '\\Mod': '\\pmod{#1}',
  '\\Rr': '\\mathbb R',
  '\\conjugate': '\\overline{#1}',
  '\\sgn': '\\operatorname{sgn}',
  '\\adj': '\\operatorname{adj}',
  '\\Tr': '\\operatorname{Tr}',
  '\\rank': '\\operatorname{rank}',
  '\\Aut': '\\operatorname{Aut}',
  '\\Inn': '\\operatorname{Inn}',
  '\\Gal': '\\operatorname{Gal}',
  '\\Char': '\\operatorname{Char}',
  '\\diam': '\\operatorname{diam}',
  '\\Cl': '\\operatorname{Cl}',
  '\\Int': '\\operatorname{Int}',
  '\\Bd': '\\partial',
};

function tex(src, display) {
  // eslint-disable-next-line no-undef
  return katex.renderToString(src, { displayMode: display, throwOnError: true, macros: { ...MACROS }, trust: false, strict: 'ignore' });
}

function texSoft(src, display) {
  // eslint-disable-next-line no-undef
  return katex.renderToString(src, { displayMode: display, throwOnError: false, macros: { ...MACROS }, strict: 'ignore', errorColor: 'var(--muted)' });
}

const ALLOWED = new Set(['P', 'DIV', 'SPAN', 'A', 'B', 'I', 'EM', 'STRONG', 'U', 'SUB', 'SUP', 'BR', 'HR', 'UL', 'OL', 'LI', 'DL', 'DT', 'DD',
  'H3', 'H4', 'H5', 'BLOCKQUOTE', 'CODE', 'PRE', 'IMG', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TD', 'TH', 'CENTER', 'SMALL', 'S', 'TT', 'CAPTION',
  'MATH', 'SEMANTICS', 'ANNOTATION', 'MROW', 'MI', 'MO', 'MN', 'MSUP', 'MSUB', 'MFRAC']);
const DROP = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'FORM', 'INPUT', 'BUTTON', 'TEXTAREA', 'SELECT', 'LINK', 'META', 'NOSCRIPT', 'SVG', 'VIDEO', 'AUDIO']);

function absolutize(url, base) {
  if (!url) return url;
  if (url.startsWith('//')) return 'https:' + url;
  if (url.startsWith('/')) return BASES[base] + url;
  return url;
}

function sanitize(root, base) {
  const walk = (el) => {
    for (const child of [...el.children]) {
      const tag = child.tagName.toUpperCase();
      // Our own KaTeX output is trusted; leave it untouched.
      if (child.classList.contains('tex') || child.classList.contains('tex-block')) continue;
      if (DROP.has(tag)) { child.remove(); continue; }
      walk(child);
      if (!ALLOWED.has(tag)) {
        // Unwrap unknown elements but keep their content.
        if (tag === 'H1' || tag === 'H2' || tag === 'H6') {
          const h = document.createElement('h3');
          h.innerHTML = child.innerHTML;
          child.replaceWith(h);
        } else {
          child.replaceWith(...child.childNodes);
        }
        continue;
      }
      const keep = {};
      if (tag === 'A') keep.href = child.getAttribute('href');
      if (tag === 'IMG') { keep.src = child.getAttribute('src'); keep.alt = child.getAttribute('alt'); keep.width = child.getAttribute('width'); keep.height = child.getAttribute('height'); }
      if (tag === 'TD' || tag === 'TH') { keep.colspan = child.getAttribute('colspan'); keep.rowspan = child.getAttribute('rowspan'); }
      const cls = child.getAttribute('class') || '';
      for (const a of [...child.attributes]) child.removeAttribute(a.name);
      for (const [k, v] of Object.entries(keep)) if (v != null) child.setAttribute(k, v);
      const keepCls = cls.split(/\s+/).filter((c) => /^(asy|tex-img|eqn|eqn-l|eqn-r|eqn-c|diagram-note|qed|pw-display|oeis-name|hint|plain)$/.test(c));
      if (keepCls.length) child.setAttribute('class', keepCls.join(' '));
      if (tag === 'A') {
        const href = keep.href || '';
        if (/^\s*javascript:/i.test(href) || href.startsWith('#')) { child.replaceWith(...child.childNodes); continue; }
        child.setAttribute('href', absolutize(href, base));
        child.setAttribute('target', '_blank');
        child.setAttribute('rel', 'noopener');
      }
      if (tag === 'IMG') {
        child.setAttribute('src', absolutize(keep.src, base));
        child.setAttribute('loading', 'lazy');
        child.setAttribute('decoding', 'async');
      }
    }
  };
  walk(root);
}

// AoPS renders LaTeX as PNG images with the source in the alt text. Re-typeset with KaTeX
// so it is crisp and follows the dark theme; keep the image if KaTeX can't handle it (e.g. Asymptote).
function aopsMath(root) {
  for (const img of [...root.querySelectorAll('img')]) {
    const alt = (img.getAttribute('alt') || '').trim();
    const cls = img.getAttribute('class') || '';
    const isLatex = /latex/.test(cls) || /latex\.artofproblemsolving\.com/.test(img.getAttribute('src') || '');
    if (!isLatex) continue;
    if (/^\[asy\]/i.test(alt) || /\\begin\{asy\}/.test(alt)) { img.classList.add('asy'); continue; }
    let src = null; let display = false;
    let m;
    if ((m = alt.match(/^\$\$([\s\S]*)\$\$$/))) { src = m[1]; display = true; }
    else if ((m = alt.match(/^\\\[([\s\S]*)\\\]$/))) { src = m[1]; display = true; }
    else if ((m = alt.match(/^\$([\s\S]*)\$$/))) { src = m[1]; display = /latexcenter/.test(cls); }
    else if ((m = alt.match(/^\\begin\{(align\*?|eqnarray\*?|gather\*?|equation\*?)\}([\s\S]*)\\end\{\1\}$/))) { src = `\\begin{aligned}${m[2].replace(/&\s*=\s*&/g, '&=')}\\end{aligned}`; display = true; }
    if (src == null) { img.classList.add('asy'); continue; }
    try {
      const parts = display ? [src] : splitQuads(src);
      if (parts.length > 1) {
        // Answer-choice lines like (A) 1 \qquad (B) 2 ... : typeset each choice separately so they wrap.
        const line = document.createElement('span');
        line.className = 'tex choice-line';
        line.innerHTML = parts.map((p) => `<span class="choice-item">${tex(p, false)}</span>`).join('');
        img.replaceWith(line);
      } else {
        const span = document.createElement(display ? 'div' : 'span');
        span.className = display ? 'tex-block' : 'tex';
        span.innerHTML = tex(src, display);
        img.replaceWith(span);
      }
    } catch {
      img.classList.add('tex-img');
    }
  }
}

// Split a TeX string on \qquad / \quad / \hspace at brace depth 0.
function splitQuads(src) {
  if (!/\\q?quad|\\hspace/.test(src) || !/\((A|B)\)/.test(src)) return [src];
  const parts = []; let depth = 0; let cur = '';
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (c === '{') depth++;
    if (c === '}') depth--;
    if (depth === 0 && c === '\\') {
      const m = src.slice(i).match(/^\\(qquad|quad)(?![a-zA-Z])|^\\hspace\*?\{[^}]*\}/);
      if (m) { parts.push(cur); cur = ''; i += m[0].length - 1; continue; }
    }
    cur += c;
  }
  parts.push(cur);
  const clean = parts.map((p) => p.replace(/^(\s|~|\\ |\\,)+|(\s|~|\\ |\\,)+$/g, '')).filter((p) => p.length);
  return clean.length > 1 ? clean : [src];
}

// Wikipedia ships MathML with the TeX source in an <annotation>, plus an SVG fallback image.
function wikiMath(root) {
  for (const el of [...root.querySelectorAll('.mwe-math-element, math')]) {
    if (!root.contains(el)) continue;
    const container = el.closest('.mwe-math-element') || el;
    const ann = container.querySelector('annotation[encoding="application/x-tex"]');
    const img = container.querySelector('img');
    let src = ann ? ann.textContent : (img ? img.getAttribute('alt') : null);
    if (!src) continue;
    const display = /display|block/.test(container.getAttribute('class') || '') || (container.querySelector('math')?.getAttribute('display') === 'block') || /^\{\\displaystyle/.test(src) && container.parentElement?.tagName === 'DD';
    src = src.replace(/^\{\\displaystyle\s*([\s\S]*)\}$/, '$1');
    const span = document.createElement(display ? 'div' : 'span');
    span.className = display ? 'tex-block' : 'tex';
    span.innerHTML = texSoft(src, display);
    container.replaceWith(span);
  }
}

// Text with raw $...$, $$...$$, \\(...\\) or \\[...\\] maths (datasets, ProofWiki): typeset those runs.
function dollarMath(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  const re = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|\$((?:\\\$|[^$])+?)\$|(\\begin\{(align\*?|equation\*?|gather\*?|eqnarray\*?|multline\*?)\}[\s\S]+?\\end\{\6\})/g;
  for (const node of nodes) {
    const text = node.nodeValue;
    if (!/[$\\]/.test(text)) continue;
    if (node.parentElement?.closest('.katex, code, pre')) continue;
    re.lastIndex = 0;
    let last = 0; let m; const frag = document.createDocumentFragment(); let changed = false;
    while ((m = re.exec(text))) {
      changed = true;
      frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      const display = m[1] != null || m[2] != null || m[5] != null;
      const src = (m[1] ?? m[2] ?? m[3] ?? m[4] ?? m[5]).replace(/\\begin\{eqnarray\*?\}/, '\\begin{aligned}').replace(/\\end\{eqnarray\*?\}/, '\\end{aligned}');
      const parts = display ? [src] : splitQuads(src);
      let el;
      if (parts.length > 1) {
        el = document.createElement('span');
        el.className = 'tex choice-line';
        el.innerHTML = parts.map((p) => `<span class="choice-item">${texSoft(p, false)}</span>`).join('');
      } else {
        el = document.createElement(display ? 'div' : 'span');
        el.className = display ? 'tex-block' : 'tex';
        el.innerHTML = texSoft(src, display);
      }
      frag.appendChild(el);
      last = re.lastIndex;
    }
    if (!changed) continue;
    frag.appendChild(document.createTextNode(text.slice(last)));
    node.replaceWith(frag);
  }
}

export function renderContent(html, { base, dollar = false } = {}) {
  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  // Strip wiki chrome before sanitising.
  wrap.querySelectorAll('.mw-editsection, .toc, #toc, .navbox, .reference, sup.reference, .mw-references-wrap, .printfooter, .catlinks, table.wikitable.navbox, .noprint, .mw-empty-elt').forEach((n) => n.remove());
  if (base === 'aops') {
    // The "See also" / contest navigation tables at the end of AoPS pages.
    wrap.querySelectorAll('table').forEach((t) => { if (/Preceded by|Followed by|Problems|All AJHSME|All AMC|All AIME/.test(t.textContent)) t.remove(); });
    aopsMath(wrap);
  }
  if (base === 'wikipedia') wikiMath(wrap);
  sanitize(wrap, base);
  if (dollar) dollarMath(wrap);
  // Remove empty paragraphs.
  wrap.querySelectorAll('p').forEach((p) => { if (!p.textContent.trim() && !p.querySelector('img,.tex,.tex-block')) p.remove(); });
  return wrap;
}
