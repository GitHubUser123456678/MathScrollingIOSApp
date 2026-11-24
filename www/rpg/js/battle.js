// Battles. Regular monsters ask quick AMC-style questions (5 choices, 30 s); elites, bosses and the raid
// boss use real contest problems. Correct answers deal damage; wrong answers let the monster hit back.
import { CLASSES, ABILITIES, ITEMS, TIERS } from './data.js';
import { quick, realProblem, hintFor, TOPIC_OF } from './problems.js';
import { renderContent } from '../../js/render.js';
import { textToHtml } from '../../js/sources.js';
import { exprValue, sameValue } from '../../js/expr.js';

const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const R = (html) => renderContent(html, { base: 'text', dollar: true });
const RT = (text) => R(textToHtml(text));
const QUICK_TIME = 30;

export function startBattle(game, monster) {
  return new Promise((resolve) => {
    const d = monster.def; const p = game.player; const S = game.stats();
    const real = d.kind !== 'quick';
    const phases = d.kind === 'boss' ? 3 : 1;
    let foeHp = real ? phases : d.hp; const foeMax = foeHp;
    let problem = null; let answered = false; let started = 0; let timer = null; let focus = 1; let shield = false; let hintUsed = false; let over = false; let streak = 0;
    const ov = el(`<div class="battle ${real ? 'real' : 'quick'} kind-${d.kind}">
      <div class="bt-top">
        <div class="bt-foe"><div class="bt-foe-icon">${d.icon}</div>
          <div class="bt-foe-info"><b>${d.name}</b><small>Lv ${d.level} · ${real ? `${TIERS[d.tier].name} ${d.kind === 'raid' ? 'raid boss' : d.kind}` : 'Quick battle'}</small>
            <div class="bar foe"><i></i><span></span></div></div></div>
        <button class="bt-flee">${d.kind === 'raid' ? 'Leave' : 'Flee'}</button>
      </div>
      <div class="bt-stage"><div class="bt-log"></div><div class="bt-problem"></div></div>
      <div class="bt-bottom">
        <div class="bt-me"><span class="bt-me-icon">${CLASSES[p.cls].icon}</span>
          <div class="bt-bars"><div class="bar hp"><i></i><span></span></div><div class="bar mp"><i></i><span></span></div></div></div>
        <div class="bt-abilities"></div>
      </div>
      <div class="bt-fx"></div></div>`);
    document.body.appendChild(ov);
    const stage = ov.querySelector('.bt-problem'); const log = ov.querySelector('.bt-log');
    const say = (html, cls = '') => { log.innerHTML = `<p class="${cls}">${html}</p>`; };
    const bars = () => {
      const S2 = game.stats();
      const set = (sel, v, m, txt) => { const b = ov.querySelector(sel); b.querySelector('i').style.width = `${Math.max(0, Math.min(100, (100 * v) / m))}%`; b.querySelector('span').textContent = txt; };
      set('.bar.hp', p.hp, S2.maxHp, `HP ${Math.max(0, Math.round(p.hp))}/${S2.maxHp}`);
      set('.bar.mp', p.mp, S2.maxMp, `MP ${Math.round(p.mp)}/${S2.maxMp}`);
      if (d.kind === 'raid') { const r = game.raid(); set('.bar.foe', r.hp, r.max, `Raid HP ${r.hp}/${r.max}`); }
      else set('.bar.foe', foeHp, foeMax, real ? `${'●'.repeat(Math.max(0, foeHp))}${'○'.repeat(foeMax - Math.max(0, foeHp))} ${phases > 1 ? 'phases' : ''}` : `HP ${Math.max(0, Math.round(foeHp))}/${foeMax}`);
      drawAbilities();
    };
    const fx = (text, cls) => { const f = el(`<b class="bt-num ${cls}">${text}</b>`); ov.querySelector('.bt-fx').appendChild(f); setTimeout(() => f.remove(), 1100); };
    const shake = (sel) => { const n = ov.querySelector(sel); n.classList.remove('hit'); void n.offsetWidth; n.classList.add('hit'); };

    // ---------------- abilities & items
    function drawAbilities() {
      const box = ov.querySelector('.bt-abilities');
      const cls = CLASSES[p.cls];
      const list = [{ ...cls.hint, level: 1, hint: true }, ...ABILITIES];
      const scrolls = game.count('scroll');
      box.innerHTML = list.map((a) => {
        const locked = p.level < a.level; const free = a.hint && scrolls > 0;
        const cant = locked || (!free && p.mp < a.mp) || !problem || answered || (a.hint && hintUsed);
        return `<button class="ab ${locked ? 'locked' : ''}" data-ab="${a.id}" ${cant ? 'disabled' : ''} title="${a.desc}"><span>${locked ? '🔒' : a.icon}</span><b>${a.name}</b><small>${locked ? `Lv ${a.level}` : free ? '📜 free' : `${a.mp} MP`}</small></button>`;
      }).join('') + `<button class="ab" data-ab="bag" ${over ? 'disabled' : ''}><span>🎒</span><b>Items</b><small>${game.count('potion') + game.count('hipotion') + game.count('ether')}</small></button>`;
    }
    ov.querySelector('.bt-abilities').addEventListener('click', (e) => {
      const b = e.target.closest('[data-ab]'); if (!b || b.disabled) return;
      const id = b.dataset.ab;
      if (id === 'bag') return openBag();
      const cls = CLASSES[p.cls];
      const a = id === cls.hint.id ? { ...cls.hint, hint: true } : ABILITIES.find((x) => x.id === id);
      if (a.hint && game.count('scroll') > 0) game.take('scroll'); else p.mp -= a.mp;
      game.sound('magic');
      if (a.hint) {
        hintUsed = true;
        if (a.id === 'eliminate' && problem.kind === 'quick') {
          const wrong = [...stage.querySelectorAll('.choice')].filter((c) => +c.dataset.i !== problem.correct).sort(() => Math.random() - 0.5).slice(0, 2);
          wrong.forEach((c) => { c.disabled = true; c.classList.add('gone'); });
          say(`${a.icon} Two wrong choices vanish!`, 'info');
        } else {
          const h = hintFor(a.id, problem);
          const box = stage.querySelector('.bt-hint'); box.hidden = false; box.innerHTML = `<b>${a.icon} ${a.name}:</b> `; box.appendChild(RT(h));
        }
      } else if (id === 'heal') { const S2 = game.stats(); const amt = Math.round(S2.maxHp * 0.4); p.hp = Math.min(S2.maxHp, p.hp + amt); fx(`+${amt}`, 'heal'); say('💚 You feel restored.', 'info'); }
      else if (id === 'focus') { focus = Math.max(focus, 1.75); say('🎯 Focused! Next correct answer +75% damage.', 'info'); }
      else if (id === 'overdrive') { focus = 3; say('⚡ Overdrive! Next correct answer deals triple damage.', 'info'); }
      else if (id === 'shield') { shield = true; say('🛡️ Second Chance ready: your next mistake is free.', 'info'); }
      bars(); game.save();
    });
    function openBag() {
      const items = ['potion', 'hipotion', 'ether'].filter((k) => game.count(k) > 0);
      const m = el(`<div class="bt-bag"><b>Use an item</b>${items.length ? items.map((k) => `<button data-k="${k}">${ITEMS[k].icon} ${ITEMS[k].name} ×${game.count(k)} <small>${ITEMS[k].desc}</small></button>`).join('') : '<p>No usable items. Buy potions from Hypatia in town.</p>'}<button class="ghost close">Close</button></div>`);
      ov.appendChild(m);
      m.addEventListener('click', (e) => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.dataset.k) { game.useItem(b.dataset.k); fx(ITEMS[b.dataset.k].heal ? `+${ITEMS[b.dataset.k].heal}` : `+${ITEMS[b.dataset.k].mana} MP`, 'heal'); bars(); }
        m.remove();
      });
    }

    // ---------------- problems
    async function nextProblem() {
      answered = false; hintUsed = false; clearInterval(timer); problem = null; drawAbilities();
      if (!real) {
        problem = quick(d.topics, d.tier);
        showQuick();
      } else {
        stage.innerHTML = `<div class="bt-loading"><div class="spinner"></div><p>${d.icon} ${d.name} prepares a ${TIERS[d.tier].name} problem…</p></div>`;
        try { problem = await realProblem({ tier: d.tier, rating: d.rating, problem: d.problem }); } catch {
          stage.innerHTML = '<div class="bt-loading"><p>Couldn’t reach the problem archive. Check your connection.</p><button class="btn retry">Try again</button></div>';
          stage.querySelector('.retry').addEventListener('click', nextProblem); return;
        }
        if (over) return;
        showReal();
      }
      started = performance.now(); drawAbilities();
      window.__numeriaProblem = problem; // read by automated tests
    }
    function showQuick() {
      stage.innerHTML = `<div class="bt-q"><div class="bt-meta"><span class="pill">${TOPIC_OF[problem.key] === 'nt' ? 'Number theory' : TOPIC_OF[problem.key] === 'counting' ? 'Counting' : TOPIC_OF[problem.key] === 'geometry' ? 'Geometry' : 'Algebra'}</span><span class="bt-timer"><i></i><b>${QUICK_TIME}</b></span></div><div class="bt-text"></div><div class="bt-hint" hidden></div>
        <div class="choices">${problem.choices.map((c, i) => `<button class="choice" data-i="${i}"><b>(${'ABCDE'[i]})</b> <span></span></button>`).join('')}</div></div>`;
      stage.querySelector('.bt-text').appendChild(RT(problem.q));
      stage.querySelectorAll('.choice').forEach((b) => b.querySelector('span').appendChild(RT(problem.choices[+b.dataset.i])));
      stage.querySelectorAll('.choice').forEach((b) => b.addEventListener('click', () => answer(+b.dataset.i === problem.correct, b)));
      let left = QUICK_TIME;
      timer = setInterval(() => {
        left -= 0.1; const tb = stage.querySelector('.bt-timer'); if (!tb) return clearInterval(timer);
        tb.querySelector('b').textContent = Math.ceil(left); tb.querySelector('i').style.width = `${(100 * left) / QUICK_TIME}%`; tb.classList.toggle('low', left < 8);
        if (left <= 0) { clearInterval(timer); answer(false, null, true); }
      }, 100);
    }
    function showReal() {
      const aime = problem.tierName.startsWith('AIME');
      stage.innerHTML = `<div class="bt-q"><div class="bt-meta"><span class="pill" style="--pc:${TIERS[d.tier].color}">${problem.label}</span><span class="bt-elapsed">0:00</span></div><div class="bt-text"></div><div class="bt-hint" hidden></div>
        <form class="bt-answer"><input inputmode="${aime ? 'numeric' : 'text'}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${aime ? 'Whole number 0–999' : 'Answer, e.g. 42, 3/4, 2sqrt(3)'}"><button class="btn" type="submit">Attack ⚔️</button></form>
        <p class="bt-preview small"></p><button class="link bt-giveup">Give up and see the answer</button></div>`;
      stage.querySelector('.bt-text').appendChild(R(problem.html));
      const input = stage.querySelector('input'); const prev = stage.querySelector('.bt-preview');
      input.addEventListener('input', () => { const v = exprValue(input.value); prev.textContent = input.value.trim() ? (Number.isFinite(v) ? `≈ ${+v.toPrecision(8)}` : 'Type a number or expression') : ''; });
      stage.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const v = exprValue(input.value);
        if (!Number.isFinite(v)) { input.classList.add('shake'); setTimeout(() => input.classList.remove('shake'), 400); return; }
        answer(sameValue(v, problem.ans), input);
      });
      stage.querySelector('.bt-giveup').addEventListener('click', () => answer(false, null, false, true));
      timer = setInterval(() => { const s = Math.round((performance.now() - started) / 1000); const e = stage.querySelector('.bt-elapsed'); if (e) e.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }, 1000);
    }
    function revealPanel(ok) {
      const box = el(`<div class="bt-reveal ${ok ? 'ok' : 'no'}"><b>${ok ? 'Correct!' : 'Answer:'}</b> <span class="ans"></span>
        ${problem.kind === 'real' ? `<div class="bt-links">${problem.solution ? '<button class="link sol">Show solution</button>' : ''}<a class="link" href="${problem.link}" target="_blank" rel="noopener">AoPS Wiki ↗</a></div><div class="bt-sol" hidden></div>` : ''}</div>`);
      box.querySelector('.ans').appendChild(problem.kind === 'real' ? R(`$${problem.ansTex}$`) : RT(problem.choices[problem.correct]));
      box.querySelector('.sol')?.addEventListener('click', (e) => { const s = box.querySelector('.bt-sol'); s.hidden = !s.hidden; if (!s.childNodes.length) s.appendChild(R(problem.solution)); e.target.textContent = s.hidden ? 'Show solution' : 'Hide solution'; });
      return box;
    }
    function answer(ok, node, timeout = false, gaveUp = false) {
      if (answered || over) return; answered = true; clearInterval(timer);
      const secs = (performance.now() - started) / 1000;
      stage.querySelectorAll('.choice').forEach((b) => { b.disabled = true; if (+b.dataset.i === problem.correct) b.classList.add('right'); });
      if (node && !ok) node.classList.add('wrong');
      stage.querySelector('.bt-giveup')?.remove();
      stage.querySelector('form')?.querySelectorAll('input,button').forEach((x) => { x.disabled = true; });
      game.event({ type: 'answer', ok, topic: problem.topic, real: problem.kind === 'real', crit: ok && !real && secs < 6 });
      if (ok) {
        streak++;
        const bonus = CLASSES[p.cls].topic === problem.topic ? 1.25 : 1;
        const crit = !real && secs < 6;
        let dmg;
        if (!real) dmg = Math.round(S.atk * (0.9 + Math.random() * 0.3) * bonus * focus * (crit ? 1.5 : 1));
        else dmg = 1;
        focus = 1;
        if (d.kind === 'raid') { game.raidHit(Math.max(1, Math.round(bonus * (secs < 180 ? 2 : 1)))); }
        else foeHp -= dmg;
        game.sound(crit ? 'crit' : 'hit');
        shake('.bt-foe-icon');
        fx(real ? (d.kind === 'raid' ? '💥 RAID HIT' : '💥 CRITICAL PROOF') : `${crit ? 'CRIT ' : ''}-${dmg}`, crit || real ? 'crit' : 'dmg');
        say(real ? `✅ Correct${bonus > 1 ? ` — your ${CLASSES[p.cls].name} training hits extra hard` : ''}! (${Math.floor(secs / 60)}m ${Math.round(secs % 60)}s)` : `✅ ${crit ? 'Lightning fast! Critical hit!' : 'Correct!'}${bonus > 1 ? ' Class bonus!' : ''}`, 'good');
      } else {
        streak = 0;
        if (shield) { shield = false; say(`🛡️ Second Chance saved you${timeout ? ' — time ran out' : ''}.`, 'info'); }
        else {
          const raw = Math.max(1, d.atk * (real ? 1.6 : 1) - S.def) * (0.85 + Math.random() * 0.3);
          const hurt = Math.round(raw); p.hp -= hurt; game.sound('hurt'); shake('.bt-me'); fx(`-${hurt}`, 'hurt');
          say(`${timeout ? '⏰ Time’s up! ' : gaveUp ? '🏳️ ' : '❌ '}${d.name} strikes for ${hurt}.`, 'bad');
        }
      }
      stage.querySelector('.bt-q').appendChild(revealPanel(ok));
      bars(); game.save();
      const cont = el(`<button class="btn wide bt-next">${p.hp <= 0 ? 'Continue' : (d.kind === 'raid' ? (game.raid().hp <= 0 ? 'Claim victory' : 'Next problem') : foeHp <= 0 ? 'Victory!' : (real && !ok && d.kind === 'elite') ? 'Retreat' : 'Next')}</button>`);
      stage.querySelector('.bt-q').appendChild(cont);
      cont.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      cont.addEventListener('click', () => {
        if (p.hp <= 0) return end('lose');
        if (d.kind === 'raid' && game.raid().hp <= 0) return end('win');
        if (foeHp <= 0) return end('win');
        if (real && !ok && d.kind === 'elite') return end('flee');
        nextProblem();
      });
      if (!real && ok && foeHp > 0 && p.hp > 0) setTimeout(() => { if (!over && answered && stage.querySelector('.bt-next')) cont.click(); }, 900);
    }
    function end(result) {
      if (over) return; over = true; clearInterval(timer);
      const done = (extra) => { ov.remove(); resolve({ result, ...extra }); };
      if (result === 'win') {
        const r = game.reward(monster);
        game.sound('win');
        const panel = el(`<div class="bt-end win"><div class="bt-end-icon">🏆</div><h2>Victory!</h2><p>${d.name} is defeated.</p>
          <div class="bt-rewards"><span>✨ +${r.xp} XP</span><span>🪙 +${r.gold}</span>${r.items.map((k) => `<span>${ITEMS[k].icon} ${ITEMS[k].name}</span>`).join('')}</div>${r.levelUp ? `<p class="lvl">⬆️ Level up! You are now level ${p.level}.</p>` : ''}<button class="btn wide go">Continue</button></div>`);
        ov.appendChild(panel); panel.querySelector('.go').addEventListener('click', () => done({ reward: r }));
      } else if (result === 'lose') {
        game.sound('lose');
        const panel = el(`<div class="bt-end lose"><div class="bt-end-icon">💫</div><h2>You fainted…</h2><p>You wake up at the inn in Integer Hamlet and drop a few coins on the way.</p><button class="btn wide go">Continue</button></div>`);
        ov.appendChild(panel); panel.querySelector('.go').addEventListener('click', () => done({}));
      } else done({});
    }
    ov.querySelector('.bt-flee').addEventListener('click', () => end(d.kind === 'raid' ? 'leave' : 'flee'));
    game.onRaidUpdate = () => { if (!over && d.kind === 'raid') bars(); };
    bars();
    say(real ? `${d.icon} <b>${d.name}</b> challenges you with a real ${TIERS[d.tier].name} problem!${d.kind === 'boss' ? ' Solve 3 to defeat it.' : d.kind === 'raid' ? ' Every correct answer damages it for everyone in the raid.' : ''}` : `A wild <b>${d.name}</b> appears!`);
    nextProblem();
  });
}
