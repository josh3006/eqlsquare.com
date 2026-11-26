/* Trick Mind game engine: screens, economy, and the level runtime that the
   level files (levels-w1..w4.js) program through the `g` API. */
(() => {
  'use strict';

  const DATA = window.LEVEL_DATA;
  const LOGIC = window.LEVEL_LOGIC || {};
  const ECON = DATA.economy;
  const LEVELS = DATA.levels;
  const TOTAL = LEVELS.length;
  const COST = [ECON.hintCosts.nudge, ECON.hintCosts.strong, ECON.hintCosts.solution];
  const TIERS = ['Nudge', 'Strong hint', 'Full solution'];
  const DAILY_BONUS = 10;
  const AD_REWARD = 20;
  const INTERSTITIAL_EVERY = 5;

  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const level = id => LEVELS[id - 1];

  /* ---------------- Save data ---------------- */
  const SAVE_KEY = 'trickmind.save.v1';
  const defaults = () => ({ coins: ECON.startCoins, solved: {}, hints: {}, lastDaily: '', streak: 0, noAds: false, starter: false, muted: false, sinceAd: 0 });
  const save = (() => {
    try { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if (s) return Object.assign(defaults(), s); } catch (e) { /* ignore */ }
    return defaults();
  })();
  function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) { /* ignore */ } }
  const solvedCount = () => Object.keys(save.solved).length;
  const isUnlocked = n => n >= 1 && n <= TOTAL && (n === 1 || !!save.solved[n - 1] || !!save.solved[n]);
  function nextLevel() {
    for (let i = 1; i <= TOTAL; i++) if (!save.solved[i] && isUnlocked(i)) return i;
    return TOTAL;
  }

  /* ---------------- Sound ---------------- */
  let actx = null;
  function sfx(kind) {
    if (save.muted) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const notes = { ok: [523, 659, 784], bad: [220, 175], pop: [660], coin: [880, 1175] }[kind] || [440];
      const t0 = actx.currentTime;
      notes.forEach((f, i) => {
        const o = actx.createOscillator(), gn = actx.createGain(), t = t0 + i * 0.09;
        o.type = kind === 'bad' ? 'square' : 'triangle';
        o.frequency.value = f;
        gn.gain.setValueAtTime(0.0001, t);
        gn.gain.exponentialRampToValueAtTime(kind === 'bad' ? 0.05 : 0.15, t + 0.01);
        gn.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
        o.connect(gn).connect(actx.destination);
        o.start(t); o.stop(t + 0.2);
      });
    } catch (e) { /* audio unavailable */ }
  }

  /* ---------------- Coins, toast, overlays ---------------- */
  function renderCoins(bump) {
    document.querySelectorAll('[data-coins]').forEach(b => {
      b.querySelector('.coin-n').textContent = save.coins;
      if (bump) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
    });
  }
  function addCoins(n) { save.coins += n; persist(); renderCoins(true); if (n > 0) sfx('coin'); }

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  let adTimer = null;
  function overlay(html, cls = '', modal = false) {
    clearInterval(adTimer);
    const o = $('#overlay');
    o.innerHTML = `<div class="scrim ${cls}" id="scrim">${html}</div>`;
    const s = $('#scrim');
    s.addEventListener('click', e => { if (e.target === s && !modal) closeOverlay(); });
    s.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeOverlay));
    return s;
  }
  function closeOverlay() { clearInterval(adTimer); $('#overlay').innerHTML = ''; }

  /* ---------------- Routing ---------------- */
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }
  function show(id) { ['home', 'map', 'play'].forEach(s => { $('#' + s).hidden = s !== id; }); }
  function route() {
    closeOverlay();
    clearTimeout(toastTimer); $('#toast').classList.remove('show');
    unloadLevel();
    const m = location.hash.match(/^#level-(\d+)$/);
    if (m && isUnlocked(+m[1])) loadLevel(+m[1]);
    else if (location.hash === '#map') showMap();
    else showHome();
  }

  function showHome() {
    show('home');
    const n = solvedCount();
    $('#playBtn').textContent = n === 0 ? 'Play' : (n >= TOTAL ? 'Play again' : `Continue · Level ${nextLevel()}`);
    $('#homeProgress').textContent = `${n} of ${TOTAL} levels solved`;
  }

  function showMap() {
    show('map');
    renderCoins();
    $('#mapList').innerHTML = DATA.worlds.map(w => {
      const [a, b] = w.levels.split('-').map(Number);
      const ids = Array.from({ length: b - a + 1 }, (_, i) => a + i);
      const done = ids.filter(i => save.solved[i]).length;
      const locked = !isUnlocked(a);
      return `<section class="world-card${locked ? ' locked' : ''}">
        <h3>World ${w.id}: ${esc(w.name)}</h3>
        <p class="meta">${done} / ${ids.length} solved${locked ? ' · Finish the world before to unlock' : ''}</p>
        <div class="lv-grid">${ids.map(i => {
          const st = save.solved[i] ? 'done' : (isUnlocked(i) ? 'open' : '');
          const hard = level(i).difficulty === 'hard' ? ' hard' : '';
          return `<button class="lv ${st}${hard}" data-lv="${i}" ${st ? '' : 'disabled'} aria-label="Level ${i}${save.solved[i] ? ', solved' : ''}">${i}</button>`;
        }).join('')}</div></section>`;
    }).join('');
    $('#mapList').querySelectorAll('[data-lv]').forEach(b => b.addEventListener('click', () => go('#level-' + b.dataset.lv)));
    const open = $('#mapList').querySelector('.lv.open');
    if (open) open.scrollIntoView({ block: 'center' });
  }

  /* ---------------- Level runtime ---------------- */
  const stage = $('#stage'), world = $('#world'), playArea = $('#playArea');
  let cur = null;

  new ResizeObserver(() => world.style.setProperty('--u', stage.clientWidth / 100 + 'px')).observe(stage);

  function paint(o) {
    const el = o.el, st = el.style;
    el.className = 'obj' + (o.txt ? ' txt' : '') + (o.drag ? ' draggable' : '') + (o.cls ? ' ' + o.cls : '');
    st.left = (o.x ?? 50) + '%';
    st.top = (o.y ?? 50) + '%';
    st.fontSize = `calc(var(--u) * ${o.fs ?? 12})`;
    st.width = o.w != null ? o.w + '%' : '';
    st.height = o.h != null ? o.h + '%' : '';
    st.background = o.color || '';
    st.color = o.c || '';
    st.border = o.border || '';
    st.borderRadius = o.r == null ? '' : (typeof o.r === 'number' ? `calc(var(--u) * ${o.r})` : o.r);
    st.zIndex = o.z ?? '';
    st.opacity = o.op ?? '';
    st.pointerEvents = o.ghost ? 'none' : '';
    st.setProperty('--rot', (o.rot || 0) + 'deg');
    st.setProperty('--flip', o.flip ? -1 : 1);
    el.hidden = !!o.hidden;
    if (o.html != null) { if (el._html !== o.html) { el.innerHTML = o.html; el._html = o.html; } }
    else { el._html = null; const s = String(o.s ?? ''); if (el.textContent !== s) el.textContent = s; }
  }

  function makeRuntime(id, L, logic) {
    const rt = { id, L, logic, objs: {}, handlers: {}, cleanups: [], solved: false, zoom: 1, pan: 0, panMax: 0, zx: 0, zy: 0 };
    const H = oid => rt.handlers[oid] || (rt.handlers[oid] = {});
    const answer = $('#answer');

    const g = rt.g = {
      state: {},
      id,
      add(o) {
        const el = document.createElement('div');
        o.el = el; el.dataset.id = o.id; rt.objs[o.id] = o;
        paint(o); world.appendChild(el);
        return o;
      },
      set(oid, props) {
        const o = rt.objs[oid]; if (!o) return;
        Object.assign(o, props);
        if (o.tok) {
          if ('hidden' in props) o.el.style.visibility = props.hidden ? 'hidden' : '';
          if ('s' in props) o.el.textContent = props.s;
          return;
        }
        paint(o);
      },
      get: oid => rt.objs[oid],
      el: oid => rt.objs[oid] && rt.objs[oid].el,
      show(oid) { g.set(oid, { hidden: false }); },
      hide(oid) { g.set(oid, { hidden: true }); },
      cls(oid, c, on = true) {
        const o = rt.objs[oid]; if (!o) return;
        const set = new Set((o.cls || '').split(' ').filter(Boolean));
        if (on) set.add(c); else set.delete(c);
        o.cls = [...set].join(' ');
        if (o.tok) o.el.classList.toggle(c, on); else paint(o);
      },
      bump(oid) {
        const el = g.el(oid); if (!el) return;
        el.classList.remove('wiggle'); void el.offsetWidth; el.classList.add('wiggle');
      },
      tap(oid, fn) { H(oid).tap = fn; },
      miss(oid, msg) { H(oid).tap = () => { g.wrong(msg); g.bump(oid); }; },
      dbl(oid, fn) { H(oid).dbl = fn; },
      drag(oid, fn, opts = {}) {
        const o = rt.objs[oid]; if (!o) return;
        o.drag = true;
        Object.assign(H(oid), { drop: fn, rub: opts.rub, rubNeed: opts.rubNeed || 6 });
        if (o.tok) o.el.style.cursor = 'grab'; else paint(o);
      },
      drop(a, b, fn, pad = 4) {
        g.drag(a, p => {
          const targets = Array.isArray(b) ? b : [b];
          const hit = targets.find(t => g.over(p, t, pad));
          if (hit) return fn(p, hit) !== false;
          return false;
        });
      },
      rub(oid, fn, need = 6) { Object.assign(H(oid), { rub: fn, rubNeed: need }); },
      swipeOn(oid, fn) { H(oid).swipe = fn; },
      swipe(fn) { rt.onSwipe = fn; },
      trace(fn) { rt.onTrace = fn; },
      move(fn) { rt.onMove = fn; },
      onZoom(fn) { rt.onZoom = fn; },
      pinch(fn) { rt.onPinch = fn; },
      pan(pages) { rt.panMax = pages - 1; },
      get zoom() { return rt.zoom; },
      over(p, oid, pad = 0) {
        const el = g.el(oid); if (!el || el.hidden) return false;
        const r = el.getBoundingClientRect(), pw = stage.clientWidth * pad / 100;
        return p.cx > r.left - pw && p.cx < r.right + pw && p.cy > r.top - pw && p.cy < r.bottom + pw;
      },
      input(check, opts = {}) {
        answer.hidden = false;
        answer.innerHTML = `<form autocomplete="off"><input id="ans" ${opts.numeric ? 'inputmode="numeric"' : ''} placeholder="${esc(opts.placeholder || 'Your answer')}" aria-label="Your answer" maxlength="24"><button class="go" type="submit">Check</button></form>`;
        answer.querySelector('form').addEventListener('submit', e => {
          e.preventDefault();
          const inp = $('#ans');
          const v = inp.value.trim().toLowerCase().replace(/\s+/g, ' ');
          if (!v) return;
          const res = Array.isArray(check) ? check.includes(v) : check(v);
          if (res === true) { inp.blur(); g.win(); return; }
          if (res === null) { inp.value = ''; return; }
          const msg = typeof res === 'string' ? res : (opts.wrong && opts.wrong[v]) || 'Not quite. Try again.';
          g.wrong(msg);
          inp.classList.remove('shake'); void inp.offsetWidth; inp.classList.add('shake');
        });
      },
      choices(list, correct, wrong = {}) {
        answer.hidden = false;
        answer.innerHTML = list.map((c, i) => `<button class="choice" data-i="${i}">${esc(c)}</button>`).join('');
        answer.querySelectorAll('.choice').forEach(b => b.addEventListener('click', () => {
          const c = list[+b.dataset.i];
          if (c === correct) g.win();
          else { g.wrong(wrong[c] || 'Not quite. Think again.'); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); }
        }));
      },
      bg(c) { stage.style.background = c; },
      toast, sfx,
      after(ms, fn) { const t = setTimeout(() => { if (cur === rt) fn(); }, ms); rt.cleanups.push(() => clearTimeout(t)); return t; },
      every(ms, fn) { const t = setInterval(() => { if (cur === rt) fn(); }, ms); rt.cleanups.push(() => clearInterval(t)); return t; },
      win(delay = 350) {
        if (rt.solved) return;
        rt.solved = true; sfx('ok');
        setTimeout(() => { if (cur === rt) levelWon(rt); }, delay);
      },
      wrong(msg) { if (msg) toast(msg); sfx('bad'); },
      shake(fn) {
        let last = 0, hits = 0;
        const h = e => {
          const a = e.acceleration && e.acceleration.x != null ? e.acceleration : e.accelerationIncludingGravity;
          if (!a) return;
          let m = Math.hypot(a.x || 0, a.y || 0, a.z || 0);
          if (a === e.accelerationIncludingGravity) m = Math.abs(m - 9.8);
          if (m > 13) {
            const now = Date.now();
            hits = now - last < 900 ? hits + 1 : 1; last = now;
            if (hits >= 2) fn();
          }
        };
        window.addEventListener('devicemotion', h);
        rt.cleanups.push(() => window.removeEventListener('devicemotion', h));
      },
      upsideDown(fn) {
        const h = e => { if (e.beta != null && e.beta < -55) fn(); };
        window.addEventListener('deviceorientation', h);
        rt.cleanups.push(() => window.removeEventListener('deviceorientation', h));
      },
      darkMode(fn) {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const h = e => { if (e.matches) fn(); };
        mq.addEventListener('change', h);
        rt.cleanups.push(() => mq.removeEventListener('change', h));
      },
      mute(fn) { rt.onMute = fn; },
      stageRect: () => stage.getBoundingClientRect(),
    };
    return rt;
  }

  function loadLevel(id) {
    const L = level(id), logic = LOGIC[id] || {};
    show('play');
    renderCoins();
    $('#levelPill').textContent = 'Level ' + id;
    world.innerHTML = '';
    world.style.transform = '';
    world.style.transformOrigin = '50% 50%';
    stage.style.background = logic.bg || '#fff7ee';
    const answer = $('#answer');
    answer.hidden = true; answer.innerHTML = '';
    $('#question').innerHTML = logic.q || esc(L.question);
    cur = makeRuntime(id, L, logic);
    (logic.objs || []).forEach(o => cur.g.add(Object.assign({}, o)));
    $('#question').querySelectorAll('[data-id]').forEach(el => {
      el.classList.add('tok');
      cur.objs[el.dataset.id] = { id: el.dataset.id, tok: true, el };
    });
    if (!logic.setup) { toast('This level is still being built.'); return; }
    try { logic.setup(cur.g); } catch (e) { console.error(e); toast('Something went wrong loading this level.'); }
  }

  function unloadLevel() {
    if (!cur) return;
    cur.cleanups.forEach(f => { try { f(); } catch (e) { /* ignore */ } });
    cur = null;
    gest = null; pinchSt = null; pointers.clear();
  }

  /* ---------------- Pointer input ---------------- */
  const pointers = new Map();
  let gest = null, pinchSt = null, lastTap = { t: 0, id: null };

  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  function pctOf(cx, cy) {
    const r = world.getBoundingClientRect();
    return { x: (cx - r.left) / r.width * 100, y: (cy - r.top) / r.height * 100 };
  }
  function centerOf(el) { const r = el.getBoundingClientRect(); return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 }; }
  function applyView() {
    if (cur.zoom <= 1.01) { cur.zx = 0; cur.zy = 0; }
    const mx = (cur.zoom - 1) * stage.clientWidth, my = (cur.zoom - 1) * stage.clientHeight;
    cur.zx = Math.max(-mx, Math.min(mx, cur.zx)); cur.zy = Math.max(-my, Math.min(my, cur.zy));
    world.style.transform = `translate(${cur.pan + cur.zx}px, ${cur.zy}px) scale(${cur.zoom})`;
  }
  function setOrigin(cx, cy) {
    if (cur.zoom > 1.01) return;
    const r = stage.getBoundingClientRect();
    world.style.transformOrigin = `${(cx - r.left - cur.pan) / r.width * 100}% ${(cy - r.top) / r.height * 100}%`;
  }
  function setZoom(z, anim = true) {
    if (!cur) return;
    z = Math.max(1, Math.min(3, z));
    world.classList.toggle('nozoomanim', !anim);
    cur.zoom = z; applyView();
    if (cur.onZoom) cur.onZoom(z);
  }
  function setPan(px) {
    const max = cur.panMax * stage.clientWidth;
    cur.pan = Math.max(-max, Math.min(0, px));
    world.classList.add('nozoomanim'); applyView();
  }
  function resetDrag(o, animate) {
    if (animate) o.el.classList.add('return');
    o.el.style.setProperty('--dx', '0px'); o.el.style.setProperty('--dy', '0px');
  }

  playArea.addEventListener('pointerdown', e => {
    if (!cur || cur.solved) return;
    const tok = e.target.closest('.tok');
    if (!stage.contains(e.target) && !tok) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try { playArea.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    if (pointers.size === 2) {
      if (gest && gest.o && gest.o.drag) { gest.o.el.classList.remove('dragging'); resetDrag(gest.o, true); }
      gest = null;
      const [a, b] = [...pointers.values()];
      setOrigin((a.x + b.x) / 2, (a.y + b.y) / 2);
      pinchSt = { d: dist(a, b) || 1, z: cur.zoom, ratio: 1 };
      return;
    }
    if (pointers.size > 2) return;
    const tEl = tok || e.target.closest('.obj');
    const oid = tEl && tEl.dataset.id, o = oid ? cur.objs[oid] : null;
    gest = { pid: e.pointerId, sx: e.clientX, sy: e.clientY, lx: e.clientX, o, oid, moved: false, dir: 0, flips: 0, rubbed: false, pan0: cur.pan, z0: [cur.zx, cur.zy], path: [pctOf(e.clientX, e.clientY)] };
    if (o && o.drag) { o.el.classList.remove('return'); o.el.classList.add('dragging'); }
    e.preventDefault();
  });

  playArea.addEventListener('pointermove', e => {
    if (!cur) return;
    if (cur.onMove && stage.contains(e.target)) cur.onMove(pctOf(e.clientX, e.clientY));
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinchSt && pointers.size >= 2) {
      const [a, b] = [...pointers.values()];
      pinchSt.ratio = dist(a, b) / pinchSt.d;
      setZoom(pinchSt.z * pinchSt.ratio, false);
      return;
    }
    if (!gest || gest.pid !== e.pointerId) return;
    const dx = e.clientX - gest.sx, dy = e.clientY - gest.sy;
    if (!gest.moved && Math.hypot(dx, dy) > 8) gest.moved = true;
    const ddx = e.clientX - gest.lx;
    if (Math.abs(ddx) > 4) {
      const d = Math.sign(ddx);
      if (gest.dir && d !== gest.dir) gest.flips++;
      gest.dir = d; gest.lx = e.clientX;
    }
    if (gest.path.length < 500) gest.path.push(pctOf(e.clientX, e.clientY));
    const h = gest.oid ? cur.handlers[gest.oid] : null;
    if (gest.o && gest.o.drag) {
      const z = gest.o.tok ? 1 : cur.zoom;
      gest.o.el.style.setProperty('--dx', dx / z + 'px');
      gest.o.el.style.setProperty('--dy', dy / z + 'px');
    } else if (cur.zoom > 1.05 && gest.moved && !(h && (h.rub || h.swipe)) && !cur.onSwipe && !cur.onTrace) {
      cur.zx = gest.z0[0] + dx; cur.zy = gest.z0[1] + dy;
      world.classList.add('nozoomanim'); applyView();
    } else if (cur.panMax > 0 && gest.moved) {
      setPan(gest.pan0 + dx);
    }
    if (h && h.rub && !gest.rubbed && gest.flips >= h.rubNeed) {
      gest.rubbed = true;
      const c = gest.o && gest.o.drag ? centerOf(gest.o.el) : { cx: e.clientX, cy: e.clientY };
      h.rub(Object.assign(c, pctOf(c.cx, c.cy)));
    }
  });

  function pointerEnd(e) {
    pointers.delete(e.pointerId);
    if (pinchSt) {
      if (pointers.size < 2) {
        const r = pinchSt.ratio; pinchSt = null; gest = null;
        if (cur && cur.zoom < 1.05) { cur.zoom = 1; applyView(); }
        if (cur && cur.onPinch) cur.onPinch(r);
      }
      return;
    }
    if (!gest || gest.pid !== e.pointerId || !cur) return;
    const G = gest; gest = null;
    const h = G.oid ? cur.handlers[G.oid] : null;
    if (G.o && G.o.drag) G.o.el.classList.remove('dragging');
    if (cur.solved) { if (G.o && G.o.drag) resetDrag(G.o, true); return; }

    if (!G.moved || e.type === 'pointercancel' && !G.moved) {
      if (G.o && G.o.drag) resetDrag(G.o, false);
      const now = Date.now(), key = G.oid || '#bg';
      const isDbl = lastTap.id === key && now - lastTap.t < 320;
      lastTap = { t: now, id: key };
      const p = Object.assign({ cx: e.clientX, cy: e.clientY }, pctOf(e.clientX, e.clientY));
      if (isDbl && h && h.dbl) { h.dbl(p); return; }
      if (h && h.tap) { h.tap(p); return; }
      if (isDbl) {
        if (cur.zoom > 1.2) setZoom(1); else { setOrigin(e.clientX, e.clientY); setZoom(2.5); }
      }
      return;
    }

    if (G.o && G.o.drag) {
      if (e.type === 'pointercancel') { resetDrag(G.o, true); return; }
      const c = centerOf(G.o.el);
      const p = Object.assign(c, pctOf(c.cx, c.cy), { ptr: pctOf(e.clientX, e.clientY), mx: (e.clientX - G.sx) / stage.clientWidth * 100, my: (e.clientY - G.sy) / stage.clientHeight * 100 });
      const bx = G.o.x, by = G.o.y;
      let keep = false;
      try { keep = h && h.drop ? h.drop(p) : false; } catch (err) { console.error(err); }
      if (!cur || !cur.objs[G.oid]) return;
      if (keep && !G.o.tok) {
        if (G.o.x === bx && G.o.y === by) { G.o.x = p.x; G.o.y = p.y; }
        G.o.el.classList.remove('return');
        G.o.el.style.setProperty('--dx', '0px'); G.o.el.style.setProperty('--dy', '0px');
        paint(G.o);
      } else if (!keep) resetDrag(G.o, true);
      return;
    }

    const p1 = G.path[0], p2 = pctOf(e.clientX, e.clientY);
    const sw = { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, dx: p2.x - p1.x, dy: p2.y - p1.y, path: G.path, oid: G.oid };
    if (h && h.swipe) h.swipe(sw);
    if (cur.onSwipe) cur.onSwipe(sw);
    if (cur.onTrace) cur.onTrace(G.path);
  }
  playArea.addEventListener('pointerup', pointerEnd);
  playArea.addEventListener('pointercancel', pointerEnd);
  stage.addEventListener('wheel', e => {
    if (!cur) return;
    e.preventDefault();
    setOrigin(e.clientX, e.clientY);
    setZoom(cur.zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15));
  }, { passive: false });

  /* ---------------- Win, hints, shop, ads ---------------- */
  function levelWon(rt) {
    const id = rt.id, first = !save.solved[id];
    save.solved[id] = true;
    let reward = first ? ECON.levelReward : 0;
    const worldEnd = first && id % 25 === 0;
    if (worldEnd) reward += ECON.worldReward;
    save.sinceAd = (save.sinceAd || 0) + 1;
    persist();
    if (reward) addCoins(reward);
    const last = id === TOTAL;
    overlay(`<div class="center-card" role="dialog" aria-label="Level solved">
      <h2>${worldEnd ? 'World complete!' : (last ? 'You finished!' : 'Solved!')}</h2>
      ${reward ? `<div class="reward"><span class="coin"></span> +${reward}</div>` : ''}
      <div class="why"><b>Why it works</b>${esc(rt.L.why)}</div>
      <button class="big-btn" id="nextBtn">${last ? 'Back to levels' : 'Next level'}</button>
    </div>`, 'center', true);
    $('#nextBtn').addEventListener('click', () => {
      if (last) { go('#map'); return; }
      const next = () => go('#level-' + (id + 1));
      if (!save.noAds && save.sinceAd >= INTERSTITIAL_EVERY) { save.sinceAd = 0; persist(); interstitial(next); }
      else next();
    });
  }

  function openHints() {
    if (!cur || cur.solved) return;
    const id = cur.id, L = cur.L;
    const opened = save.hints[id] || (save.hints[id] = [false, false, false]);
    const texts = [L.hints[0], L.hints[1], L.solution];
    overlay(`<div class="sheet" role="dialog" aria-label="Hints">
      <button class="close" data-close aria-label="Close">×</button>
      <h2>Need a hint?</h2>
      <p class="sub">You have ${save.coins} coins. Start with the cheap one.</p>
      ${[0, 1, 2].map(t => opened[t]
        ? `<div class="hint-row open"><div><span class="lvl">${TIERS[t]}</span><span class="txt">${esc(texts[t])}</span></div></div>`
        : `<button class="hint-row" data-t="${t}"><div><span class="lvl">${TIERS[t]}</span><span class="txt">${t === 2 ? 'Shows exactly how to solve it' : 'Tap to reveal'}</span></div><span class="cost"><span class="coin"></span>${COST[t]}</span></button>`
      ).join('')}
    </div>`);
    $('#overlay').querySelectorAll('.hint-row[data-t]').forEach(b => b.addEventListener('click', () => {
      const t = +b.dataset.t;
      if (save.coins < COST[t]) { toast('Not enough coins. Get more in the shop.'); openShop(); return; }
      opened[t] = true;
      addCoins(-COST[t]);
      openHints();
    }));
  }

  function openShop() {
    const packs = [
      { key: 'small', coins: 100, price: '$0.99' },
      { key: 'medium', coins: 600, price: '$4.99', ribbon: 'Popular' },
      { key: 'large', coins: 1500, price: '$9.99', ribbon: 'Best value', cls: 'best' },
      { key: 'starter', coins: 300, price: '$1.99', ribbon: 'One-time offer', cls: 'starter wide', desc: 'Starter pack: 300 coins + no forced ads', noAds: true, once: true },
      { key: 'noads', coins: 0, price: '$2.99', cls: 'wide', desc: 'Remove forced ads forever', label: 'No ads', noAds: true },
    ];
    const owned = k => (k.key === 'starter' && save.starter) || (k.key === 'noads' && save.noAds);
    overlay(`<div class="sheet" role="dialog" aria-label="Shop">
      <button class="close" data-close aria-label="Close">×</button>
      <h2>Coin shop</h2>
      <p class="sub">Use coins for hints when a puzzle gets tough.</p>
      <div class="shop-grid">
        ${packs.map((k, i) => `<button class="pack ${k.cls || ''}${owned(k) ? ' owned' : ''}" data-i="${i}">
          ${k.ribbon ? `<span class="ribbon">${k.ribbon}</span>` : ''}
          <div>${k.coins ? `<span class="amt"><span class="coin"></span>${k.coins.toLocaleString()}</span>` : `<span class="amt">${k.label}</span>`}
          ${k.desc ? `<span class="desc">${k.desc}</span>` : ''}</div>
          <span class="price">${owned(k) ? 'Owned' : k.price}</span></button>`).join('')}
        <button class="pack wide" id="shopAd"><div><span class="amt"><span class="coin"></span>${AD_REWARD} free</span><span class="desc">Watch a short ad</span></div><span class="price" style="background:var(--ink)">Watch</span></button>
      </div>
      <p class="test-note">Test version: purchases are simulated and nothing is charged. Google Play billing is connected before release.</p>
    </div>`);
    $('#overlay').querySelectorAll('.pack[data-i]').forEach(b => b.addEventListener('click', () => {
      const k = packs[+b.dataset.i];
      if (k.noAds) save.noAds = true;
      if (k.once) save.starter = true;
      persist();
      if (k.coins) addCoins(k.coins);
      closeOverlay();
      toast(k.coins ? `+${k.coins} coins added (test purchase)` : 'Forced ads removed (test purchase)');
    }));
    $('#shopAd').addEventListener('click', rewardedAd);
  }

  function adScreen(label, seconds, done, skippable) {
    let n = seconds;
    overlay(`<div class="ad-card" role="dialog" aria-label="${esc(label)}">
      <div class="lbl">${esc(label)}</div>
      <div class="count" id="adN">${n}</div>
      <div style="opacity:.8;font-size:14px">Test ad. A real video ad plays here in the released game.</div>
      ${skippable ? '<button class="skip" id="adRemove">Remove ads</button>' : ''}
    </div>`, 'center', true);
    if (skippable) $('#adRemove').addEventListener('click', () => { clearInterval(adTimer); openShop(); });
    adTimer = setInterval(() => {
      n--;
      const el = $('#adN'); if (el) el.textContent = n;
      if (n <= 0) { clearInterval(adTimer); closeOverlay(); done(); }
    }, 1000);
  }
  function rewardedAd() { adScreen('Ad playing', 3, () => { addCoins(AD_REWARD); toast(`+${AD_REWARD} coins for watching`); }); }
  function interstitial(next) { adScreen('Ad break', 3, next, true); }

  /* ---------------- Daily bonus ---------------- */
  function dailyBonus() {
    const today = new Date().toISOString().slice(0, 10);
    if (save.lastDaily === today) return;
    const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    const first = !save.lastDaily;
    save.streak = save.lastDaily === y ? save.streak + 1 : 1;
    save.lastDaily = today;
    persist();
    if (first) return; // new players already get the starting coins
    addCoins(DAILY_BONUS);
    toast(`Daily bonus: +${DAILY_BONUS} coins · ${save.streak}-day streak`);
  }

  /* ---------------- Wiring ---------------- */
  function renderMute() {
    const b = $('#muteBtn');
    b.textContent = save.muted ? '🔇' : '🔊';
    b.setAttribute('aria-label', save.muted ? 'Sound off, tap to turn on' : 'Sound on, tap to mute');
  }
  $('#playBtn').addEventListener('click', () => go('#level-' + (solvedCount() >= TOTAL ? 1 : nextLevel())));
  $('#mapBtn').addEventListener('click', () => go('#map'));
  $('#homeShopBtn').addEventListener('click', openShop);
  $('#mapBack').addEventListener('click', () => go('#'));
  $('#playBack').addEventListener('click', () => go('#map'));
  $('#hintBtn').addEventListener('click', openHints);
  $('#adBtn').addEventListener('click', rewardedAd);
  $('#muteBtn').addEventListener('click', () => {
    save.muted = !save.muted; persist(); renderMute();
    if (save.muted && cur && cur.onMute && !cur.solved) cur.onMute();
  });
  document.querySelectorAll('[data-coins]').forEach(b => b.addEventListener('click', openShop));

  renderMute();
  renderCoins();
  dailyBonus();
  route();
  window.addEventListener('hashchange', route);

  // Test hook for automated checks; harmless in production.
  window.__trickmind = { save, go, get cur() { return cur; } };
})();
