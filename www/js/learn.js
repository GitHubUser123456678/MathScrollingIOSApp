// Learn: Duolingo-style courses. Each course is a path of units (MATH levels 1–5); each unit has four
// short lessons and a unit test. Lessons are real competition problems with hearts, XP and streaks.

const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

export const COURSES = [
  { id: 'prealgebra', icon: '➗', color: '#58cc02', blurb: 'Fractions, percents, ratios, basic equations' },
  { id: 'algebra', icon: '𝑥', color: '#1cb0f6', blurb: 'Linear equations, quadratics, functions' },
  { id: 'number_theory', icon: '🔢', color: '#ce82ff', blurb: 'Divisibility, primes, modular arithmetic' },
  { id: 'counting_and_probability', icon: '🎲', color: '#ff9600', blurb: 'Counting, combinations, probability' },
  { id: 'geometry', icon: '📐', color: '#ff4b4b', blurb: 'Angles, triangles, circles, area' },
  { id: 'intermediate_algebra', icon: '∑', color: '#2b70c9', blurb: 'Polynomials, inequalities, sequences' },
  { id: 'precalculus', icon: '📈', color: '#00cd9c', blurb: 'Trigonometry, vectors, complex numbers' },
];
const UNIT_NAMES = ['Foundations', 'Building blocks', 'Stepping up', 'Contest ready', 'Mastery'];
const UNITS = 5; const PER_UNIT = 5; // 4 lessons + a unit test
const TOTAL = UNITS * PER_UNIT;
const ZIG = [0, 46, 70, 46, 0, -46, -70, -46];

const nodeInfo = (k) => {
  const unit = Math.floor(k / PER_UNIT); const slot = k % PER_UNIT;
  const test = slot === PER_UNIT - 1;
  return { unit, slot, test, level: unit + 1, questions: test ? 8 : 5, hearts: 3, label: test ? `Unit ${unit + 1} test` : `Lesson ${slot + 1}` };
};

export function openLearn(ctx) {
  const p = ctx.progress();
  if (!p.course) return pickCourse(ctx);
  const course = COURSES.find((c) => c.id === p.course) || COURSES[0];
  const name = ctx.subjects[course.id];
  const done = p.done[course.id] || 0;
  const body = el(`<div class="learn" style="--cc:${course.color}">
    <div class="learn-head"><button class="learn-course">${course.icon} <b>${name}</b> <span>▾</span></button><span class="learn-pct">${Math.round((100 * done) / TOTAL)}%</span></div>
    <div class="learn-path"></div></div>`);
  body.querySelector('.learn-course').addEventListener('click', () => pickCourse(ctx));
  const path = body.querySelector('.learn-path');
  for (let u = 0; u < UNITS; u++) {
    const unitLocked = done < u * PER_UNIT;
    const band = el(`<div class="unit-band ${unitLocked ? 'locked' : ''}"><div><small>Unit ${u + 1} · Level ${u + 1}</small><b>${UNIT_NAMES[u]}</b></div>${unitLocked ? '<button class="btn small jump">Jump here</button>' : `<span class="unit-guide">${done >= (u + 1) * PER_UNIT ? '✓ Done' : ''}</span>`}</div>`);
    band.querySelector('.jump')?.addEventListener('click', () => startLesson(ctx, course, { unit: u, slot: PER_UNIT - 1, test: true, level: u + 1, questions: 8, hearts: 3, label: `Jump to unit ${u + 1}` }, { jump: u }));
    path.appendChild(band);
    const col = el('<div class="unit-nodes"></div>');
    for (let s = 0; s < PER_UNIT; s++) {
      const k = u * PER_UNIT + s; const info = nodeInfo(k);
      const state = k < done ? 'done' : k === done ? 'current' : 'locked';
      const n = el(`<div class="node-wrap" style="--x:${ZIG[k % ZIG.length]}px"><button class="node ${state} ${info.test ? 'test' : ''}" aria-label="${info.label}">${info.test ? '🏆' : state === 'done' ? '✓' : state === 'locked' ? '🔒' : '★'}</button>${state === 'current' ? '<span class="node-start">START</span>' : ''}</div>`);
      n.querySelector('.node').addEventListener('click', () => nodePopup(ctx, course, k, state, n));
      col.appendChild(n);
    }
    path.appendChild(col);
  }
  if (done >= TOTAL) path.appendChild(el(`<div class="course-done">🏆 You finished ${name}! Practise any lesson, or pick another course.</div>`));
  ctx.openSheet('Learn', body, 'tall');
  setTimeout(() => body.querySelector('.node.current')?.scrollIntoView({ block: 'center' }), 60);
}

function nodePopup(ctx, course, k, state, wrap) {
  document.querySelectorAll('.node-pop').forEach((x) => x.remove());
  const info = nodeInfo(k);
  const pop = el(`<div class="node-pop ${state}">
    <b>${info.label}</b><small>${info.questions} questions · Level ${info.level} · ${info.hearts} hearts</small>
    ${state === 'locked' ? '<p>Finish the lessons before this to unlock it.</p>' : `<button class="btn wide go">${state === 'done' ? `Practise +${xpFor(info) >> 1} XP` : `Start +${xpFor(info)} XP`}</button>`}</div>`);
  wrap.appendChild(pop);
  pop.querySelector('.go')?.addEventListener('click', () => startLesson(ctx, course, info, { practice: state === 'done', node: k }));
  setTimeout(() => document.addEventListener('click', function off(e) { if (!pop.contains(e.target) && !wrap.contains(e.target)) { pop.remove(); document.removeEventListener('click', off); } }), 0);
}
const xpFor = (info) => (info.test ? 25 + 5 * info.level : 10 + 3 * info.level);

function pickCourse(ctx) {
  const p = ctx.progress();
  const body = el(`<div class="chess-pick"><p>Pick a course. Each one goes from Level 1 warm-ups to Level 5 contest problems.</p>
    ${COURSES.map((c) => { const d = p.done[c.id] || 0; return `<button class="game-tile course-tile" data-c="${c.id}" style="--cc:${c.color}"><span class="g-icon">${c.icon}</span><span class="g-text"><b>${ctx.subjects[c.id]}${p.course === c.id ? ' ✓' : ''}</b><small>${c.blurb}</small><span class="course-bar"><i style="width:${(100 * d) / TOTAL}%"></i></span></span></button>`; }).join('')}</div>`);
  body.querySelectorAll('[data-c]').forEach((b) => b.addEventListener('click', () => { p.course = b.dataset.c; ctx.save(); openLearn(ctx); }));
  ctx.openSheet('Choose a course', body, 'tall');
}

// ------------------------------------------------------------------ a lesson
function startLesson(ctx, course, info, { practice = false, node = null, jump = null } = {}) {
  ctx.closeSheet();
  const Q = info.questions;
  let hearts = info.hearts; let i = 0; let right = 0; let alive = true;
  const start = Date.now();
  const ov = el(`<div class="lesson" style="--cc:${course.color}">
    <div class="lesson-top"><button class="lesson-x" aria-label="Quit">✕</button><div class="lesson-bar"><i></i></div><span class="hearts">❤️ <b>${hearts}</b></span></div>
    <div class="lesson-stage"></div>
    <div class="lesson-foot" hidden><div class="lf-msg"></div><button class="btn wide lf-go">Continue</button></div></div>`);
  document.body.appendChild(ov);
  const stage = ov.querySelector('.lesson-stage'); const foot = ov.querySelector('.lesson-foot');
  const quit = () => { alive = false; ov.remove(); openLearn(ctx); };
  ov.querySelector('.lesson-x').addEventListener('click', () => {
    if (i === 0 || !alive) return quit();
    if (ov.querySelector('.quit-ask')) return;
    const ask = el('<div class="quit-ask"><b>Quit this lesson?</b><p>You’ll lose your progress in it.</p><button class="btn wide stay">Keep going</button><button class="btn ghost wide leave">Quit</button></div>');
    ov.appendChild(ask);
    ask.querySelector('.stay').addEventListener('click', () => ask.remove());
    ask.querySelector('.leave').addEventListener('click', quit);
  });
  // Keep one problem ready ahead of time.
  const fetchOne = async () => { for (let t = 0; t < 4; t++) { try { return await ctx.fetchProblem(course.id, info.level); } catch { /* retry */ } } throw new Error('offline'); };
  let next = fetchOne();
  const show = async () => {
    ov.querySelector('.lesson-bar i').style.width = `${(100 * i) / Q}%`;
    foot.hidden = true;
    stage.innerHTML = '<p class="loader-msg">Loading…</p>';
    let card;
    try { card = await next; } catch { stage.innerHTML = '<p class="loader-msg">Couldn’t load problems. Check your connection.</p>'; return; }
    if (!alive) return;
    next = i + 1 < Q ? fetchOne() : null;
    let answered = false;
    ctx.mountProblem(stage, card, (ok) => {
      if (answered) return; answered = true;
      i++;
      if (ok) right++; else { hearts--; ov.querySelector('.hearts b').textContent = hearts; ov.querySelector('.hearts').classList.add('lost'); setTimeout(() => ov.querySelector('.hearts')?.classList.remove('lost'), 600); }
      ov.querySelector('.lesson-bar i').style.width = `${(100 * i) / Q}%`;
      foot.hidden = false; foot.className = `lesson-foot ${ok ? 'ok' : 'no'}`;
      foot.querySelector('.lf-msg').innerHTML = ok ? `<b>${['Nice!', 'Correct!', 'Great job!', 'You got it!'][right % 4]}</b>` : `<b>${hearts > 0 ? 'Not quite' : 'Out of hearts'}</b>`;
      foot.querySelector('.lf-go').onclick = () => { if (hearts <= 0) return fail(); if (i >= Q) return finish(); show(); };
      setTimeout(() => foot.scrollIntoView({ block: 'end', behavior: 'smooth' }), 50);
    });
    stage.scrollTop = 0;
  };
  const fail = () => {
    alive = false;
    stage.innerHTML = `<div class="lesson-end"><div class="le-big">💔</div><h2>Out of hearts</h2><p>You got ${right} of ${i}. Problems at this level are tough — try again, they’ll be different ones.</p><button class="btn wide again">Try again</button><button class="btn ghost wide back">Back to the path</button></div>`;
    foot.hidden = true;
    stage.querySelector('.again').addEventListener('click', () => { ov.remove(); startLesson(ctx, course, info, { practice, node, jump }); });
    stage.querySelector('.back').addEventListener('click', quit);
    ctx.sound('wrong');
  };
  const finish = () => {
    alive = false;
    const p = ctx.progress();
    const perfect = right === Q;
    let xp = xpFor(info) + (perfect ? 5 : 0);
    if (practice) xp = Math.round(xp / 2);
    let unlocked = '';
    if (jump != null) { p.done[course.id] = Math.max(p.done[course.id] || 0, jump * PER_UNIT); unlocked = `Unit ${jump + 1} unlocked!`; }
    else if (!practice && node != null) { p.done[course.id] = Math.max(p.done[course.id] || 0, node + 1); if (info.test) unlocked = info.unit + 1 < UNITS ? `Unit ${info.unit + 2} unlocked!` : 'Course complete!'; }
    ctx.save();
    ctx.lessonDone(xp, { perfect });
    ctx.sound('level');
    const secs = Math.round((Date.now() - start) / 1000);
    foot.hidden = true;
    ov.querySelector('.lesson-bar i').style.width = '100%';
    stage.innerHTML = `<div class="lesson-end"><div class="le-big">${info.test || jump != null ? '🏆' : perfect ? '🌟' : '🎉'}</div><h2>${jump != null ? 'Test passed!' : info.test ? 'Unit complete!' : 'Lesson complete!'}</h2>
      ${unlocked ? `<p class="le-unlock">${unlocked}</p>` : ''}
      <div class="le-stats"><div><small>XP</small><b>+${xp}</b></div><div><small>Accuracy</small><b>${Math.round((100 * right) / Q)}%</b></div><div><small>Time</small><b>${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}</b></div></div>
      <p class="small">Each correct answer also earned you ⚡ for the mini-games.</p>
      <button class="btn wide cont">Continue</button><button class="btn ghost wide share-l">Share</button></div>`;
    stage.querySelector('.cont').addEventListener('click', quit);
    stage.querySelector('.share-l').addEventListener('click', () => ctx.shareText(`I just finished ${info.label} in ${ctx.subjects[course.id]} (Level ${info.level}) on MathScroll — ${right}/${Q} correct!`));
  };
  show();
}
