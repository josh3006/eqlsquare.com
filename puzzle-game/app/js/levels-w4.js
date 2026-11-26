/* World 4: Lost in Space (levels 76–100). */
(() => {
  const L = window.LEVEL_LOGIC = window.LEVEL_LOGIC || {};
  const SPACE = 'radial-gradient(circle at 20% 15%, rgba(255,255,255,.9) 0 1px, transparent 2px), radial-gradient(circle at 70% 30%, rgba(255,255,255,.8) 0 1px, transparent 2px), radial-gradient(circle at 40% 70%, rgba(255,255,255,.7) 0 1px, transparent 2px), radial-gradient(circle at 85% 80%, rgba(255,255,255,.8) 0 1px, transparent 2px), radial-gradient(circle at 10% 60%, rgba(255,255,255,.6) 0 1px, transparent 2px), #141a3a';
  const CABIN = '#dfe6f3';
  const ball = (color, extra = '') => `<div style="width:100%;aspect-ratio:1;border-radius:50%;background:${color};${extra}"></div>`;

  L[76] = {
    bg: CABIN,
    objs: [
      { id: 'panel', x: 50, y: 58, w: 80, h: 40, color: '#4a5270', r: 3 },
      { id: 'btn', html: ball('#ff3b3b', 'box-shadow:0 .25em 0 #a51d1d;display:grid;place-items:center;color:#fff;font:700 .2em var(--f-display)') , x: 50, y: 56, w: 34, fs: 16 },
      { id: 'launchTxt', s: 'LAUNCH', txt: true, x: 50, y: 56, fs: 5, c: '#fff', ghost: true },
      { id: 'cover', x: 50, y: 56, w: 44, h: 26, color: 'rgba(190,225,255,.45)', border: '3px solid rgba(255,255,255,.9)', r: 3, z: 10 },
      { id: 'rocket', s: '🚀', x: 50, y: 18, fs: 14, cls: 'anim' },
    ],
    setup(g) {
      g.drag('cover', () => true);
      g.tap('cover', () => g.wrong('The cover is in the way.'));
      g.tap('btn', () => { g.set('rocket', { y: -20 }); g.win(900); });
    },
  };

  L[77] = {
    bg: CABIN,
    objs: [
      { id: 'astro', s: '🧑‍🚀', x: 28, y: 62, fs: 28, cls: 'float' },
      { id: 'water', html: ball('rgba(80,170,255,.85)', 'box-shadow:inset -.2em -.2em 0 rgba(255,255,255,.5)'), x: 72, y: 28, w: 14, fs: 10, cls: 'float' },
    ],
    setup(g) {
      g.drop('water', 'astro', () => { g.hide('water'); g.win(500); }, 2);
      g.miss('astro', 'Thirsty… there’s no cup up here.');
    },
  };

  L[78] = {
    bg: SPACE,
    setup(g) {
      const row1 = [['mercury', '#9e9e9e', 7], ['venus', '#e6c27a', 10], ['earth', '#3d8bff', 11], ['mars', '#d1553b', 9]];
      const row2 = [['jupiter', '#d9a066', 18], ['saturn', '#e8cf8f', 15], ['uranus', '#7fd3d6', 12], ['neptune', '#3f5bd9', 12]];
      row1.forEach(([id, c, w], i) => g.add({ id, html: ball(c), x: 16 + i * 22, y: 32, w, fs: 10 }));
      row2.forEach(([id, c, w], i) => g.add({ id, html: ball(c), x: 14 + i * 24, y: 68, w, fs: 10 }));
      g.add({ id: 'moon', html: ball('#cfd3dc', 'box-shadow:inset -.4em -.3em 0 #9aa0ad'), x: 60, y: 32, w: 20, fs: 10, z: 5 });
      g.drag('moon', () => true);
      g.tap('moon', () => g.wrong('That’s the Moon. It isn’t a planet. And it’s in the way…'));
      g.tap('earth', () => g.win());
      [...row1, ...row2].forEach(([id]) => { if (id !== 'earth') g.miss(id, 'That one is here.'); });
    },
  };

  L[79] = {
    bg: CABIN,
    objs: [
      { id: 'floor', x: 50, y: 92, w: 100, h: 16, color: '#8a93ad' },
      { id: 'astro', s: '🧑‍🚀', x: 50, y: 66, fs: 30, cls: 'anim' },
      { id: 'boots', s: '🥾🥾', x: 50, y: 82, fs: 10, z: 5 },
      { id: 'mag', s: 'MAGNETIC', txt: true, x: 50, y: 90, fs: 3.5, c: '#fff', ghost: true },
    ],
    setup(g) {
      g.tap('boots', () => { g.hide('boots'); g.hide('mag'); g.set('astro', { y: 30, rot: -15 }); g.win(900); });
      g.miss('astro', 'She’s stuck to the floor. Why?');
    },
  };

  L[80] = {
    bg: SPACE,
    objs: [
      { id: 'radio', s: '📻', x: 50, y: 62, fs: 30 },
      { id: 'ant', x: 62, y: 46, w: 1.6, h: 6, color: '#cfd3dc', r: 1 },
      { id: 'knob', x: 62, y: 43, w: 4, fs: 4, html: ball('#ff5a5f') },
      { id: 'sig', s: 'NO SIGNAL', txt: true, x: 50, y: 84, fs: 6, c: '#ff5a5f' },
    ],
    setup(g) {
      g.drag('knob', p => {
        if (p.my < -10) {
          g.set('knob', { x: 62, y: 14 }); g.set('ant', { y: 30, h: 32 });
          g.set('sig', { s: '▂▄▆█ Hello, Earth!', c: '#22b46a' }); g.win(900);
          return true;
        }
        if (p.my < 0) g.toast('Higher!');
        return false;
      });
      g.miss('radio', 'Static… the signal is too weak.');
      g.miss('ant', 'Grab the red tip of the antenna.');
    },
  };

  L[81] = {
    bg: SPACE,
    objs: [
      { id: 'sun', s: '☀️', x: 84, y: 14, fs: 18 },
      ...[[20, 30], [45, 22], [30, 60], [62, 52], [76, 78]].map(([x, y], i) => ({ id: 's' + i, s: '⭐', x, y, fs: 8 })),
    ],
    setup(g) {
      g.input(v => {
        if (v === '6' || v === 'six') return true;
        if (v === '5' || v === 'five') return 'Did you count everything that shines on its own?';
        return false;
      }, { numeric: true });
    },
  };

  L[82] = {
    bg: SPACE,
    objs: [
      { id: 'head', html: ball('#7ed957', 'box-shadow:inset -.3em -.3em 0 #56b13a'), x: 50, y: 48, w: 56, fs: 10 },
      { id: 'e1', html: ball('#1b2340'), x: 40, y: 42, w: 8, fs: 10 },
      { id: 'e2', html: ball('#1b2340'), x: 60, y: 42, w: 8, fs: 10 },
      { id: 'mouth', s: '⌒', txt: true, x: 50, y: 58, fs: 20, c: '#1b2340', cls: 'anim' },
      { id: 'tear', s: '💧', x: 66, y: 50, fs: 5 },
    ],
    setup(g) {
      g.tap('mouth', () => { g.set('mouth', { rot: 180 }); g.hide('tear'); g.win(800); });
      g.drag('mouth', () => { g.set('mouth', { rot: 180 }); g.hide('tear'); g.win(800); return false; });
      g.miss('head', 'It’s still sad. Change its face.');
    },
  };

  L[83] = {
    bg: SPACE,
    objs: [
      { id: 'station', x: 50, y: 10, w: 50, h: 8, color: '#9aa0ad', r: 1 },
      { id: 'port', x: 50, y: 17, w: 14, h: 6, color: '#ffd84d', r: 1 },
      { id: 'ship', s: '🚀', x: 30, y: 72, fs: 18, rot: 45 },
      { id: 'tip', s: 'Tap the ship to turn it. Drag it to dock.', x: 50, y: 92, fs: 3.6, c: '#cfd3dc' },
    ],
    setup(g) {
      g.state.a = 45;
      g.tap('ship', () => { g.state.a = (g.state.a - 45 + 360) % 360; g.set('ship', { rot: g.state.a }); g.sfx('pop'); });
      g.drop('ship', 'port', () => {
        if (g.state.a !== 315) { g.wrong('Wrong angle! The nose must point at the port.'); return false; }
        g.set('ship', { x: 50, y: 26 }); g.win(600);
      }, 6);
    },
  };

  L[84] = {
    bg: SPACE,
    objs: [{ id: 'astro', s: '🧑‍🚀', x: 50, y: 45, fs: 30, cls: 'spin' }],
    setup(g) { g.choices(['Up', 'Down', 'Left', 'There is no up'], 'There is no up'); },
  };

  L[85] = {
    bg: '#c1440e',
    objs: [
      { id: 'soil', x: 50, y: 82, w: 40, h: 12, color: '#7a2a08', r: 2 },
      { id: 'seed', s: '•', txt: true, x: 50, y: 78, fs: 8, c: '#3a1a05' },
      { id: 'ice', s: '🧊', x: 16, y: 30, fs: 13 },
      { id: 'heater', s: '🔥', x: 82, y: 70, fs: 13 },
      { id: 'lamp', s: '💡', x: 50, y: 18, fs: 14, cls: 'off' },
    ],
    setup(g) {
      const grow = () => { if (g.state.wet && g.state.light) { g.set('seed', { s: '🌿', fs: 18, y: 68 }); g.win(800); } };
      g.drag('ice', p => {
        if (!g.state.melted && g.over(p, 'heater', 4)) { g.state.melted = true; g.set('ice', { s: '💧', x: 82, y: 52 }); g.toast('The ice melted into water!'); g.sfx('pop'); return true; }
        if (g.over(p, 'soil', 4)) {
          if (!g.state.melted) { g.wrong('It’s frozen solid.'); return false; }
          g.state.wet = true; g.hide('ice'); g.set('soil', { color: '#4e1a04' }); g.toast('Watered.'); grow(); return true;
        }
        return false;
      });
      g.tap('lamp', () => { g.state.light = true; g.cls('lamp', 'off', false); g.cls('lamp', 'glow'); g.sfx('pop'); grow(); });
      g.miss('seed', 'It needs water and light.');
    },
  };

  L[86] = {
    bg: CABIN,
    objs: [
      { id: 'robot', s: '🤖', x: 50, y: 50, fs: 34, op: 0.6 },
      { id: 'zz', s: 'z z', txt: true, x: 70, y: 30, fs: 6, c: '#5a49ff', cls: 'float' },
      { id: 'back', x: 50, y: 50, w: 46, h: 34, color: '#9aa0ad', r: 3, hidden: true },
      { id: 'sw', s: 'OFF', txt: true, x: 50, y: 50, fs: 6, cls: 'btn', hidden: true },
    ],
    setup(g) {
      const spin = () => { if (g.state.back) return; g.state.back = true; g.hide('robot'); g.show('back'); g.show('sw'); g.sfx('pop'); g.toast('The back of the robot.'); };
      g.swipeOn('robot', spin);
      g.swipe(sw => { if (Math.abs(sw.dx) > 20) spin(); });
      g.tap('robot', () => g.wrong('Zzz… no response.'));
      g.tap('sw', () => { g.set('sw', { s: 'ON', c: '#22b46a' }); g.after(500, () => { g.hide('back'); g.hide('sw'); g.set('robot', { op: 1 }); g.show('robot'); g.hide('zz'); }); g.win(1100); });
    },
  };

  L[87] = {
    bg: SPACE,
    objs: [
      { id: 'body', x: 50, y: 50, w: 18, h: 12, color: '#cfd3dc', r: 1 },
      { id: 'pL', x: 28, y: 50, w: 22, h: 8, color: '#3d5bd9', border: '2px solid #9fb4ff' },
      { id: 'gap', x: 72, y: 50, w: 22, h: 8, border: '2px dashed #9fb4ff', ghost: true },
      { id: 'pR', x: 70, y: 82, w: 22, h: 8, color: '#3d5bd9', border: '2px solid #9fb4ff', rot: 25, cls: 'float' },
    ],
    setup(g) {
      g.drag('pR', p => {
        if (Math.abs(p.x - 72) < 10 && Math.abs(p.y - 50) < 8) { g.set('pR', { x: 72, y: 50, rot: 0, cls: '' }); g.hide('gap'); g.win(600); return true; }
        return false;
      });
    },
  };

  L[88] = {
    bg: SPACE,
    objs: [
      { id: 'alien', s: '👽', x: 35, y: 58, fs: 28 },
      { id: 'bubble', s: '“olleh”', txt: true, x: 66, y: 32, fs: 8, cls: 'card' },
    ],
    setup(g) { g.input(['hello', 'hi'], { placeholder: 'What does it mean?' }); },
  };

  L[89] = {
    bg: CABIN,
    setup(g) {
      const spots = [[14, 30], [38, 26], [62, 30], [86, 26], [14, 66], [38, 70], [62, 66], [86, 70]];
      spots.forEach(([x, y], i) => g.add({ id: 'a' + i, s: '🧑‍🚀', x, y, fs: 15 }));
      g.add({ id: 'ant', s: 'Ψ', txt: true, x: 62, y: 55, fs: 5, c: '#22b46a' });
      g.tap('a6', () => g.win()); g.tap('ant', () => g.win());
      spots.forEach((_, i) => { if (i !== 6) g.miss('a' + i, 'A normal human astronaut.'); });
    },
  };

  L[90] = {
    bg: SPACE,
    objs: [
      { id: 'hole', html: '<div class="blackhole"></div>', x: 62, y: 40, w: 40, h: 26, fs: 10, cls: 'spin' },
      { id: 'rocket', s: '🚀', x: 18, y: 80, fs: 13 },
    ],
    setup(g) {
      g.every(120, () => {
        if (g.state.free) return;
        const r = g.get('rocket'), h = g.get('hole');
        const dx = h.x - r.x, dy = h.y - r.y, d = Math.hypot(dx, dy);
        if (d < 6) { g.wrong('Pulled in! Try again.'); g.set('rocket', { x: 18, y: 80 }); return; }
        g.set('rocket', { x: r.x + dx / d * 0.5, y: r.y + dy / d * 0.5 });
      });
      g.tap('rocket', () => g.wrong('The engines are too weak!'));
      g.drag('hole', p => {
        const q = p.ptr;
        if (q.x < 8 || q.x > 92 || q.y < 6 || q.y > 94) { g.state.free = true; g.hide('hole'); g.set('rocket', { s: '🚀', cls: 'float' }); g.win(600); return true; }
        return true;
      });
    },
  };

  L[91] = {
    bg: '#2b2f45',
    objs: [
      { id: 'moon', x: 50, y: 92, w: 100, h: 18, color: '#cfd3dc' },
      { id: 'astro', s: '🧑‍🚀', x: 50, y: 52, fs: 22 },
      { id: 'scale', s: '⚖️ ? kg', txt: true, x: 50, y: 76, fs: 6, cls: 'card' },
      { id: 'note', s: 'Earth: 60 kg\nMoon gravity = 1/6 of Earth', x: 50, y: 18, fs: 4, c: '#fff' },
    ],
    setup(g) { g.input(['10', 'ten', '10 kg', '10kg'], { numeric: true, placeholder: 'kg on the Moon' }); },
  };

  L[92] = {
    bg: '#141a3a',
    setup(g) {
      // Directions: 0=N 1=E 2=S 3=W. Each tile is a set of connected directions.
      const P = { H: [1, 3], V: [0, 2], NE: [0, 1], ES: [1, 2], SW: [2, 3], WN: [3, 0] };
      const sol = { '0,0': 'H', '0,1': 'SW', '1,1': 'V', '2,1': 'NE', '2,2': 'H', '2,3': 'SW', '3,3': 'NE' };
      const decoy = ['ES', 'V', 'WN', 'H', 'NE', 'SW', 'V', 'ES', 'H'];
      const grid = {};
      let di = 0;
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
        const k = r + ',' + c;
        const dirs = (sol[k] ? P[sol[k]] : P[decoy[di++ % decoy.length]]).slice();
        grid[k] = dirs.map(d => (d + 1) % 4); // start one turn off
      }
      const html = dirs => `<div class="tile">${dirs.map(d => `<i class="${'nesw'[d]}"></i>`).join('')}</div>`;
      const X = c => 20 + c * 20, Y = r => 24 + r * 15;
      g.add({ id: 'bat', s: '🔋', x: 5, y: Y(0), fs: 7 });
      g.add({ id: 'bulb', s: '💡', x: 95, y: Y(3), fs: 7, cls: 'off' });
      Object.keys(grid).forEach(k => {
        const [r, c] = k.split(',').map(Number);
        g.add({ id: 't' + r + c, html: html(grid[k]), x: X(c), y: Y(r), w: 18, h: 14, fs: 10 });
        g.tap('t' + r + c, () => {
          grid[k] = grid[k].map(d => (d + 1) % 4);
          g.set('t' + r + c, { html: html(grid[k]) }); g.sfx('pop');
          if (solved()) { g.cls('bulb', 'off', false); g.cls('bulb', 'glow'); g.win(700); }
        });
      });
      function solved() {
        let r = 0, c = 0, from = 3, steps = 0;
        while (steps++ < 20) {
          const t = grid[r + ',' + c]; if (!t || !t.includes(from)) return false;
          const out = t.find(d => d !== from);
          if (r === 3 && c === 3 && out === 1) return true;
          const dr = [-1, 0, 1, 0][out], dc = [0, 1, 0, -1][out];
          r += dr; c += dc; from = (out + 2) % 4;
          if (r < 0 || r > 3 || c < 0 || c > 3) return false;
        }
        return false;
      }
      g.add({ id: 'tip', s: 'Tap tiles to turn them.', x: 50, y: 90, fs: 4, c: '#cfd3dc' });
    },
  };

  L[93] = {
    bg: SPACE,
    objs: [
      { id: 'astro', s: '🧑‍🚀', x: 25, y: 62, fs: 26 },
      { id: 'hand', s: '✋', x: 38, y: 46, fs: 11 },
      { id: 'aliens', s: '👽 👽 👽', x: 72, y: 50, fs: 12 },
    ],
    setup(g) {
      g.drag('hand', () => false, { rubNeed: 4, rub: () => { g.set('aliens', { s: '👋👽 👋👽 👋👽' }); g.win(900); } });
      g.miss('aliens', 'They stare at you. Say hello first!');
      g.miss('astro', 'Use the hand.');
    },
  };

  L[94] = {
    bg: '#fffbe6',
    objs: [
      { id: 'beds', s: '😣  😣  😣', x: 42, y: 60, fs: 12 },
      { id: 'track', x: 88, y: 50, w: 3, h: 56, color: '#c9cfdd', r: 1 },
      { id: 'knob', x: 88, y: 24, w: 10, h: 6, color: '#5a49ff', r: 1.5 },
      { id: 'sun', s: '☀️', x: 88, y: 14, fs: 6 },
      { id: 'moon', s: '🌙', x: 88, y: 86, fs: 6 },
    ],
    setup(g) {
      const night = () => { if (g.state.done) return; g.state.done = true; g.bg('#1d2238'); g.set('beds', { s: '😴  😴  😴' }); g.set('knob', { y: 76 }); g.win(900); };
      g.darkMode(night);
      g.drag('knob', p => { if (p.y > 60) { night(); return true; } return false; });
      g.miss('beds', 'Too bright to sleep.');
    },
  };

  L[95] = {
    bg: '#2b2f45',
    objs: [
      { id: 'pump', s: '⛽', x: 14, y: 70, fs: 16 },
      { id: 'hose', x: 22, y: 76, w: 10, h: 1.4, color: '#1b2340', r: 1 },
      { id: 'nozzle', x: 28, y: 76, w: 5, h: 4, color: '#ff5a5f', r: 1 },
      { id: 'rocket', s: '🚀', x: 78, y: 50, fs: 26, rot: -45 },
      { id: 'gauge', s: 'FUEL ▯▯▯▯▯', txt: true, x: 78, y: 82, fs: 5, c: '#ffd84d' },
    ],
    setup(g) {
      g.tap('nozzle', () => g.toast('The hose is too short… or is it? Try stretching it.'));
      g.drop('nozzle', 'rocket', () => {
        g.set('nozzle', { x: 70, y: 56 });
        const s = g.get('pump');
        const ax = s.x + 6, ay = 76, bx = 70, by = 56;
        const sr = g.stageRect();
        const lenPx = Math.hypot((bx - ax) / 100 * sr.width, (by - ay) / 100 * sr.height);
        const ang = Math.atan2((by - ay) / 100 * sr.height, (bx - ax) / 100 * sr.width) * 180 / Math.PI;
        g.set('hose', { x: (ax + bx) / 2, y: (ay + by) / 2, w: lenPx / sr.width * 100, rot: ang });
        g.set('gauge', { s: 'FUEL ▮▮▮▮▮' }); g.win(900);
      }, 4);
    },
  };

  L[96] = {
    bg: '#c1440e',
    objs: [{ id: 'mars', html: ball('#d1553b', 'box-shadow:inset -.6em -.4em 0 #9b3420'), x: 50, y: 45, w: 50, fs: 10 }],
    setup(g) { g.choices(['Blue', 'Orange-brown', 'Green', 'Black'], 'Orange-brown', { Blue: 'That’s Earth’s sky. Mars has red dust everywhere.' }); },
  };

  L[97] = {
    bg: '#c1440e',
    objs: [
      { id: 'rover', s: '🚙', x: 50, y: 62, fs: 26 },
      { id: 'panel', x: 50, y: 40, w: 50, h: 10, color: '#2b5bd9', r: 1, html: '<div class="dust" id="dust97"></div>' },
      { id: 'bat', s: '🔋 0%', txt: true, x: 50, y: 84, fs: 6, c: '#fff' },
    ],
    setup(g) {
      const clean = () => {
        if (g.state.clean) return; g.state.clean = true;
        const d = document.getElementById('dust97'); if (d) d.style.opacity = '0';
        g.set('bat', { s: '🔋 100%' }); g.after(500, () => g.set('rover', { x: 120, cls: 'anim' })); g.win(1300);
      };
      g.rub('panel', clean, 4);
      g.swipeOn('panel', sw => { if (Math.abs(sw.dx) > 25) clean(); });
      g.miss('rover', 'The battery is empty.');
      g.tap('panel', () => g.toast('The solar panels are covered in dust.'));
    },
  };

  L[98] = {
    bg: SPACE,
    objs: [
      { id: 'alien', s: '👽', x: 50, y: 36, fs: 26 },
      { id: 'burger', s: '🍔', x: 18, y: 78, fs: 11 },
      { id: 'apple', s: '🍎', x: 40, y: 82, fs: 11 },
      { id: 'pizza', s: '🍕', x: 62, y: 78, fs: 11 },
      { id: 'lamp', s: '💡', x: 86, y: 74, fs: 12, cls: 'glow' },
    ],
    setup(g) {
      ['burger', 'apple', 'pizza'].forEach(f => g.drop(f, 'alien', () => { g.wrong('Bleh! It spits it out.'); return false; }, 4));
      g.drop('lamp', 'alien', () => { g.hide('lamp'); g.set('alien', { cls: 'glow' }); g.toast('Mmm… delicious light!'); g.win(800); }, 4);
    },
  };

  L[99] = {
    bg: CABIN,
    setup(g) {
      const on = { A: true, B: false, C: true };
      g.add({ id: 'rules', cls: 'card', html: '<b>Landing rules</b><br>1) Exactly one switch is ON.<br>2) A is OFF.<br>3) C is ON only if A is ON.', x: 50, y: 22, w: 86, fs: 4.2 });
      ['A', 'B', 'C'].forEach((k, i) => g.add({ id: k, s: `${k}: ${on[k] ? 'ON' : 'OFF'}`, x: 20 + i * 30, y: 56, fs: 6, cls: 'btn', c: on[k] ? '#22b46a' : '#ff5a5f' }));
      g.add({ id: 'go', s: 'Land!', x: 50, y: 80, fs: 7, cls: 'btn', color: '#5a49ff', c: '#fff' });
      ['A', 'B', 'C'].forEach(k => g.tap(k, () => { on[k] = !on[k]; g.set(k, { s: `${k}: ${on[k] ? 'ON' : 'OFF'}`, c: on[k] ? '#22b46a' : '#ff5a5f' }); g.sfx('pop'); }));
      g.tap('go', () => {
        if (!on.A && on.B && !on.C) { g.win(400); return; }
        const n = [on.A, on.B, on.C].filter(Boolean).length;
        if (n !== 1) g.wrong('Rule 1 broken: exactly one switch must be ON.');
        else if (on.A) g.wrong('Rule 2 broken: A must be OFF.');
        else g.wrong('Rule 3 broken: C can only be ON if A is ON.');
      });
    },
  };

  L[100] = {
    bg: '#2b2f45',
    objs: [
      { id: 'win', x: 50, y: 24, w: 80, h: 30, color: '#0b1030', r: 3, border: '5px solid #9aa0ad', html: '<div class="dust" id="dust100"></div>' },
      { id: 'earth', s: '🌍', x: 50, y: 24, fs: 18, ghost: true, op: 0 },
      { id: 'screen', cls: 'card', s: 'NAVIGATION: clean the window first', x: 50, y: 52, w: 80, fs: 3.8 },
      { id: 'handle', s: '⬇ PARACHUTE', txt: true, x: 50, y: 74, fs: 5, cls: 'btn', hidden: true, c: '#ff5a5f' },
      { id: 'house', s: '🏡', x: 50, y: 85, fs: 14, hidden: true },
    ],
    setup(g) {
      const cleaned = () => {
        if (g.state.clean) return; g.state.clean = true;
        const d = document.getElementById('dust100'); if (d) d.style.opacity = '0';
        g.set('earth', { op: 1 }); g.sfx('pop');
        g.set('screen', { s: 'NAVIGATION: How many holes does a T-shirt have?' });
        g.input(v => {
          if (v === '4' || v === 'four') {
            g.set('screen', { s: 'COURSE SET. Deploy the parachute!' }); g.show('handle');
            document.getElementById('answer').hidden = true; g.sfx('pop'); return null;
          }
          return 'Course error. Remember World 1?';
        }, { numeric: true });
      };
      g.rub('win', cleaned, 4);
      g.swipeOn('win', sw => { if (Math.abs(sw.dx) > 25) cleaned(); });
      g.drag('handle', p => {
        if (p.my > 6) { g.hide('handle'); g.show('house'); g.set('screen', { s: 'Landed in the garden. Welcome home!' }); g.win(1000); return true; }
        g.toast('Pull it down.'); return false;
      });
      g.tap('handle', () => g.toast('Pull the handle down.'));
      g.tap('win', () => g.toast('The window is covered in space dust. Wipe it clean.'));
    },
  };
})();
