/* World 1: At Home (levels 1–25). Placeholder art uses emoji and simple shapes. */
(() => {
  const L = window.LEVEL_LOGIC = window.LEVEL_LOGIC || {};
  const WALL = '#ffe1cc';

  L[1] = {
    objs: [
      { id: 'n9', s: '9', txt: true, x: 25, y: 48, fs: 46, c: '#5a49ff' },
      { id: 'n6', s: '6', txt: true, x: 62, y: 55, fs: 22, c: '#ff5a5f' },
      { id: 'n15', s: '15', txt: true, x: 86, y: 60, fs: 7, c: '#22b46a' },
    ],
    setup(g) {
      g.tap('n15', () => g.win());
      g.miss('n9', 'Not quite. Look again.');
      g.miss('n6', 'Not quite. Look again.');
    },
  };

  L[2] = {
    bg: '#2a2f45',
    objs: [
      { id: 'lamp', s: '💡', x: 50, y: 22, fs: 20, cls: 'off' },
      { id: 'switch', s: '🔘', x: 82, y: 45, fs: 10 },
      { id: 'socket', html: '<b style="font-size:.5em;color:#555">● ●</b>', x: 62, y: 86, w: 12, h: 7, color: '#e9edf5', r: 1.5 },
      { id: 'plug', s: '🔌', x: 25, y: 88, fs: 11 },
    ],
    setup(g) {
      g.drop('plug', 'socket', () => { g.state.plugged = true; g.set('plug', { x: 62, y: 80, rot: 0 }); g.toast('Plugged in!'); g.sfx('pop'); });
      g.tap('switch', () => {
        if (!g.state.plugged) { g.wrong('Click… nothing happens. No power?'); g.bump('switch'); return; }
        g.cls('lamp', 'off', false); g.cls('lamp', 'glow'); g.bg('#fff7d6'); g.win(600);
      });
      g.miss('lamp', 'The lamp needs power first.');
    },
  };

  L[3] = {
    bg: WALL,
    objs: [
      { id: 'win', x: 32, y: 26, w: 46, h: 30, color: '#bfe3ff', r: 1, border: '6px solid #fff' },
      { id: 'sun', s: '☀️', x: 26, y: 22, fs: 14 },
      { id: 'curtainR', x: 63, y: 26, w: 9, h: 36, color: '#c0392b', r: 1, z: 5 },
      { id: 'cat', s: '🐱', x: 55, y: 74, fs: 22 },
      { id: 'bed', x: 55, y: 84, w: 50, h: 8, color: '#8e5bd6', r: 2 },
      { id: 'zzz', s: 'z z z', txt: true, x: 70, y: 62, fs: 7, c: '#5a49ff', hidden: true },
    ],
    setup(g) {
      g.drop('curtainR', 'win', () => {
        g.set('curtainR', { x: 32, y: 26, w: 48, h: 33 });
        g.bg('#c9a58c'); g.set('cat', { s: '😴' }); g.show('zzz'); g.win(700);
      }, 2);
      g.miss('cat', 'The cat squints. It is far too bright in here.');
      g.miss('sun', 'You can’t switch off the sun. Block it instead.');
    },
  };

  L[4] = {
    objs: [
      { id: 'carton', x: 50, y: 52, w: 76, h: 26, color: '#d8c3a5', r: 3 },
      { id: 'row1', s: '🥚🥚🥚🥚🥚🥚', x: 50, y: 46, fs: 9 },
      { id: 'row2', s: '🥚🥚🥚🥚🥚🥚', x: 50, y: 58, fs: 9 },
      { id: 'lid', x: 50, y: 59, w: 78, h: 14, color: '#b58f61', r: 3, z: 5, html: '<b style="font-size:.4em;color:#fff7ee">EGGS</b>', fs: 12 },
    ],
    setup(g) {
      g.drag('lid', p => { if (Math.abs(p.my) > 8 || Math.abs(p.mx) > 25) { g.state.open = true; return true; } return false; });
      g.input(v => {
        if (v === '12' || v === 'twelve') return true;
        if (v === '6' || v === 'six') return 'Are you seeing the whole carton?';
        return false;
      }, { numeric: true, placeholder: 'How many eggs?' });
    },
  };

  L[5] = {
    bg: WALL,
    objs: [
      { id: 'bed', x: 45, y: 72, w: 70, h: 16, color: '#5b8def', r: 3 },
      { id: 'dad', s: '😴', x: 30, y: 62, fs: 22 },
      { id: 'zz', s: 'Z z', txt: true, x: 45, y: 48, fs: 7, c: '#5a49ff', cls: 'float' },
      { id: 'table', x: 82, y: 66, w: 18, h: 14, color: '#a0703f', r: 1 },
      { id: 'clock', s: '⏰', x: 82, y: 52, fs: 13 },
    ],
    setup(g) {
      let taps = [];
      const wake = () => { g.set('dad', { s: '😳' }); g.hide('zz'); g.set('clock', { cls: 'wiggle' }); g.win(500); };
      g.shake(wake);
      g.tap('clock', () => {
        const now = Date.now(); taps = taps.filter(t => now - t < 2000); taps.push(now);
        g.bump('clock');
        if (taps.length >= 5) wake(); else if (taps.length === 1) g.toast('Tick… it needs a bigger push.');
      });
      g.miss('dad', 'Dad keeps snoring.');
    },
  };

  L[6] = {
    bg: '#f3e9ff',
    objs: [
      { id: 'tv', s: '📺', x: 50, y: 18, fs: 22 },
      { id: 'plant', s: '🪴', x: 12, y: 62, fs: 14 },
      { id: 'sofa', x: 52, y: 75, w: 76, h: 22, color: '#7c4dcc', r: 4, z: 3 },
      { id: 'remote', html: '<span style="font-size:.35em;color:#fff;line-height:1.3">● ●<br>▲<br>▼</span>', x: 42, y: 66, w: 7, h: 12, color: '#2b2f3a', r: 1.5, z: 4 },
      { id: 'cushion', x: 42, y: 66, w: 26, h: 10, color: '#a678f0', r: 3, z: 5 },
      { id: 'cushion2', x: 66, y: 66, w: 26, h: 10, color: '#a678f0', r: 3, z: 5 },
    ],
    setup(g) {
      g.drag('cushion', () => true);
      g.drag('cushion2', () => true);
      g.tap('remote', () => g.win());
      g.miss('plant', 'Not in the plant.');
      g.miss('tv', 'Find the remote first.');
    },
  };

  L[7] = {
    objs: [
      { id: 'counter', x: 50, y: 82, w: 100, h: 14, color: '#d9a876' },
      { id: 'kettle', s: '🫖', x: 75, y: 62, fs: 20 },
      { id: 'steam', s: '💨', x: 80, y: 45, fs: 10, hidden: true, cls: 'float' },
      { id: 'cup', x: 32, y: 66, w: 18, h: 14, color: '#ffffff', r: '0 0 40% 40%', border: '4px solid #1b2340', html: '' },
      { id: 'bag', s: '🏷️', x: 55, y: 30, fs: 10 },
    ],
    setup(g) {
      g.drop('bag', 'cup', () => { g.state.bag = true; g.hide('bag'); g.set('cup', { color: '#f2e2c4' }); g.toast('Tea bag in.'); g.sfx('pop'); });
      g.tap('kettle', () => { if (!g.state.hot) { g.state.hot = true; g.show('steam'); g.toast('The kettle is boiling.'); g.sfx('pop'); } });
      g.drag('kettle', p => {
        if (!g.over(p, 'cup', 8)) return false;
        if (!g.state.hot) { g.wrong('The water is cold. Boil it first (tap the kettle).'); return false; }
        if (!g.state.bag) { g.wrong('Just hot water? Add the tea bag first.'); return false; }
        g.set('cup', { color: '#9b5a2a' }); g.hide('steam'); g.win(500);
        return false;
      });
    },
  };

  L[8] = {
    objs: [
      { id: 'c1', s: '🕒', x: 28, y: 32, fs: 24 },
      { id: 'c2', s: '🕕', x: 72, y: 32, fs: 24 },
      { id: 'c3', s: '🕘', x: 28, y: 70, fs: 24 },
      { id: 'c4', s: '🕧', x: 72, y: 70, fs: 24 },
    ],
    setup(g) {
      g.tap('c4', () => g.win());
      ['c1', 'c2', 'c3'].forEach(c => g.miss(c, 'This one looks normal. Check the minute hands.'));
    },
  };

  L[9] = {
    q: 'The baby is crying. Make it st<span data-id="o">o</span>p.',
    bg: WALL,
    objs: [
      { id: 'floor', x: 50, y: 92, w: 100, h: 16, color: '#d9a876' },
      { id: 'crib', x: 50, y: 70, w: 64, h: 26, color: 'transparent', border: '6px solid #8a5a3b', r: 2 },
      { id: 'baby', s: '😭', x: 50, y: 58, fs: 28 },
    ],
    setup(g) {
      g.drop('o', 'baby', () => { g.hide('o'); g.set('baby', { s: '😌' }); g.win(700); }, 6);
      g.miss('baby', 'Waaah! The baby needs something to suck on.');
    },
  };

  L[10] = {
    bg: WALL,
    objs: [
      { id: 'floor', x: 50, y: 92, w: 100, h: 18, color: '#d9a876' },
      { id: 'win', x: 30, y: 22, w: 48, h: 28, color: '#8fd0ff', border: '6px solid #fff', r: 1 },
      { id: 'sun', s: '☀️', x: 44, y: 15, fs: 8 },
      { id: 'cloud', s: '☁️', x: 24, y: 22, fs: 17, z: 10 },
      { id: 'sink', x: 82, y: 50, w: 28, h: 16, color: '#c9d3e6', r: 1 },
      { id: 'tap', s: '🚰', x: 82, y: 36, fs: 12 },
      { id: 'can', s: '🪣', x: 80, y: 78, fs: 13 },
      { id: 'plant', s: '🥀', x: 42, y: 76, fs: 20 },
      { id: 'rain', s: '💧 💧 💧', x: 42, y: 58, fs: 6, hidden: true, cls: 'pulse' },
    ],
    setup(g) {
      g.drag('cloud', p => {
        if (g.over(p, 'plant', 14)) {
          g.set('cloud', { x: 42, y: 44 }); g.show('rain'); g.set('plant', { s: '🌷' }); g.win(1200);
          return true;
        }
        return false;
      });
      g.miss('tap', 'The tap is broken. Not a drop.');
      g.miss('can', 'The watering can is empty.');
      g.miss('plant', 'The plant is thirsty.');
    },
  };

  L[11] = {
    objs: [
      { id: 'chair', s: '🪑', x: 50, y: 62, fs: 40 },
      { id: 'dog', s: '🐕', x: 50, y: 40, fs: 26 },
    ],
    setup(g) {
      g.input(v => {
        if (v === '8' || v === 'eight') return true;
        if (v === '4' || v === 'four') return 'Only the dog? Look again.';
        return false;
      }, { numeric: true, placeholder: 'How many legs?' });
    },
  };

  L[12] = {
    objs: [
      { id: 'machine', x: 62, y: 55, w: 52, h: 50, color: '#e6ebf2', r: 3, border: '4px solid #b8c2d6' },
      { id: 'door', x: 62, y: 60, w: 30, h: 22, color: '#9fd3ff', r: '50%', border: '6px solid #b8c2d6' },
      { id: 'dial', s: 'WASH', txt: true, x: 62, y: 38, fs: 5, cls: 'btn' },
      { id: 'sock', s: '🧦', x: 18, y: 72, fs: 16 },
      { id: 'drip', s: '💧', x: 22, y: 86, fs: 5, cls: 'float' },
    ],
    setup(g) {
      const modes = ['WASH', 'RINSE', 'SPIN', 'DRY'];
      let m = 0;
      const check = () => {
        if (g.state.in && modes[m] === 'DRY') { g.set('door', { color: '#ffd59e' }); g.win(700); }
      };
      g.drop('sock', ['machine', 'door'], () => { g.state.in = true; g.hide('sock'); g.hide('drip'); g.toast('Sock is in the machine.'); g.sfx('pop'); check(); });
      g.tap('dial', () => {
        m = (m + 1) % modes.length; g.set('dial', { s: modes[m] }); g.sfx('pop');
        if (modes[m] === 'DRY' && !g.state.in) g.toast('The machine is empty.');
        check();
      });
    },
  };

  L[13] = {
    objs: [
      { id: 'floor', x: 50, y: 90, w: 100, h: 20, color: '#e8d2b0' },
      { id: 'trap', s: '🪤', x: 85, y: 85, fs: 14 },
      { id: 'table', x: 25, y: 46, w: 36, h: 4, color: '#a0703f' },
      { id: 'cheese', s: '🧀', x: 25, y: 38, fs: 12 },
      { id: 'mouse', s: '🐭', x: 40, y: 85, fs: 11, cls: 'anim' },
    ],
    setup(g) {
      const spots = [[15, 86], [40, 82], [60, 88], [30, 90], [70, 82], [50, 86]];
      let i = 0;
      g.every(900, () => { if (g.state.caught) return; i = (i + 1) % spots.length; g.set('mouse', { x: spots[i][0], y: spots[i][1] }); });
      g.tap('mouse', () => { g.wrong('Too fast! You can’t catch it by hand.'); i = (i + 2) % spots.length; g.set('mouse', { x: spots[i][0], y: spots[i][1] }); });
      g.drop('cheese', 'trap', () => {
        g.state.caught = true; g.set('cheese', { x: 85, y: 80, fs: 7 });
        g.after(300, () => g.set('mouse', { x: 85, y: 84 }));
        g.win(1300);
      }, 6);
    },
  };

  L[14] = {
    objs: [
      { id: 'table', x: 50, y: 42, w: 60, h: 6, color: '#a0703f', r: 1 },
      { id: 'plate', s: '🍽️', x: 50, y: 34, fs: 16 },
      { id: 'boy', s: '👦', x: 18, y: 68, fs: 20 },
      { id: 'dog', s: '🐕', x: 50, y: 72, fs: 20 },
      { id: 'gran', s: '👵', x: 82, y: 66, fs: 20 },
      { id: 'crumbs', s: '·:·.·:', txt: true, x: 82, y: 79, fs: 1.6, c: '#8a4b16' },
    ],
    setup(g) {
      g.miss('boy', 'He says it wasn’t him. You need proof.');
      g.miss('dog', 'The dog looks innocent. You need proof.');
      g.tap('gran', () => { if (g.zoom >= 1.8) g.win(); else g.wrong('Grandma smiles sweetly. You need proof. Look closer.'); });
      g.tap('crumbs', () => { if (g.zoom >= 1.8) { g.toast('Cake crumbs on Grandma’s lap!'); g.state.found = true; } });
      g.onZoom(z => { if (z >= 1.8 && !g.state.told) { g.state.told = true; g.toast('Now look at everyone carefully…'); } });
      g.toast('Tip: pinch or double-tap to zoom.');
    },
  };

  L[15] = {
    bg: WALL,
    objs: [
      { id: 'shelf', x: 55, y: 20, w: 56, h: 3, color: '#8a5a3b' },
      { id: 'jar', s: '🍪', x: 64, y: 13, fs: 12, cls: 'anim' },
      { id: 'screw1', s: '🔩', x: 30, y: 23, fs: 5 },
      { id: 'screw2', s: '🔩', x: 80, y: 23, fs: 5 },
      { id: 'kid', s: '🧒', x: 32, y: 76, fs: 22 },
      { id: 'chair', s: '🪑', x: 66, y: 80, fs: 15 },
      { id: 'floor', x: 50, y: 95, w: 100, h: 10, color: '#d9a876' },
    ],
    setup(g) {
      const fall = () => { if (g.state.down) return; g.state.down = true; g.set('jar', { x: 34, y: 60 }); g.set('kid', { s: '😋' }); g.win(1100); };
      g.upsideDown(fall);
      ['screw1', 'screw2'].forEach(s => g.tap(s, () => {
        g.state[s] = true; g.hide(s); g.sfx('pop');
        if (g.state.screw1 && g.state.screw2) { g.set('shelf', { rot: 18 }); fall(); } else g.toast('One screw loose…');
      }));
      g.miss('chair', 'Still far too short.');
      g.miss('kid', 'The kid jumps… nowhere near.');
      g.miss('jar', 'Too high to reach.');
    },
  };

  L[16] = {
    bg: '#fffbe6',
    objs: [
      { id: 'l1', s: '💡', x: 18, y: 18, fs: 12, cls: 'glow' },
      { id: 'l2', s: '💡', x: 50, y: 14, fs: 12, cls: 'glow' },
      { id: 'l3', s: '💡', x: 82, y: 18, fs: 12, cls: 'glow' },
      { id: 'l4', s: '🛋️', x: 25, y: 70, fs: 18 },
      { id: 'l5', s: '🪔', x: 80, y: 62, fs: 12, cls: 'glow' },
      { id: 'table', x: 55, y: 82, w: 34, h: 4, color: '#a0703f' },
      { id: 'phone', s: '📱', x: 55, y: 75, fs: 9, cls: 'glow' },
    ],
    setup(g) {
      const lights = ['l1', 'l2', 'l3', 'l5', 'phone'];
      const check = () => {
        const on = lights.filter(l => !g.state[l]);
        if (on.length === 0) { g.bg('#1d2238'); g.win(600); }
        else if (on.length === 1 && on[0] === 'phone' && !g.state.told) { g.state.told = true; g.toast('Hmm… something is still glowing.'); }
      };
      lights.forEach(l => g.tap(l, () => {
        if (g.state[l]) return;
        g.state[l] = true; g.cls(l, 'glow', false); g.cls(l, 'off'); g.sfx('pop'); check();
      }));
      g.miss('l4', 'That’s a sofa.');
    },
  };

  L[17] = {
    objs: [
      { id: 'feather', s: '🪶', x: 28, y: 40, fs: 22 },
      { id: 'iron', s: '🔩', x: 72, y: 40, fs: 22 },
      { id: 'k1', s: '1 kg', txt: true, x: 28, y: 66, fs: 8 },
      { id: 'k2', s: '1 kg', txt: true, x: 72, y: 66, fs: 8 },
    ],
    setup(g) { g.choices(['Feathers', 'Iron', 'Same'], 'Same', { Feathers: 'Read the question again.', Iron: 'Read the question again.' }); },
  };

  L[18] = {
    objs: [
      { id: 'tank', x: 50, y: 68, w: 76, h: 40, color: '#9fd8ff', r: 2, border: '4px solid #ffffff' },
      { id: 'fish', s: '🐟', x: 45, y: 70, fs: 14, cls: 'float' },
      { id: 'food', s: '· · · · ·', txt: true, x: 45, y: 54, fs: 6, c: '#b35a00', hidden: true },
      { id: 'box', html: '<b style="font-size:.32em;color:#fff">FISH<br>FOOD</b>', x: 76, y: 20, w: 15, h: 16, color: '#ff9f43', r: 1.5 },
    ],
    setup(g) {
      g.drag('box', () => false, {
        rubNeed: 4,
        rub: p => {
          if (g.over(p, 'tank', 6) || p.y < 70) { g.show('food'); g.set('fish', { s: '🐠' }); g.win(900); }
        },
      });
      g.tap('box', () => g.wrong('Tapping does nothing. How do you get food out of a shaker?'));
      g.miss('fish', 'The fish is hungry.');
    },
  };

  L[19] = {
    bg: '#eaf6ff',
    objs: [
      { id: 'box', s: '📦', x: 42, y: 82, fs: 24 },
      { id: 't1', s: '⚽', x: 14, y: 50, fs: 12 },
      { id: 't2', s: '🚗', x: 40, y: 40, fs: 12 },
      { id: 't3', s: '🧱', x: 62, y: 55, fs: 12 },
      { id: 't4', s: '🪆', x: 25, y: 22, fs: 12 },
      { id: 'teddy', s: '🧸', x: 86, y: 58, fs: 12 },
      { id: 'curtain', x: 86, y: 48, w: 18, h: 64, color: '#5a49ff', r: 1, z: 5 },
    ],
    setup(g) {
      g.state.n = 0;
      g.drag('curtain', () => true);
      ['t1', 't2', 't3', 't4', 'teddy'].forEach(t => g.drop(t, 'box', () => {
        g.hide(t); g.state.n++; g.sfx('pop');
        if (g.state.n === 5) g.win(500);
        else if (g.state.n === 4) g.toast('That’s 4. Where is number 5?');
      }, 4));
    },
  };

  L[20] = {
    objs: [
      { id: 'dog', s: '🐕', x: 50, y: 62, fs: 30 },
      { id: 'woof', s: 'WOOF!', txt: true, x: 70, y: 32, fs: 8, c: '#ff5a5f', cls: 'pulse' },
      { id: 'woof2', s: 'WOOF!', txt: true, x: 28, y: 40, fs: 6, c: '#ff5a5f', cls: 'pulse' },
      { id: 'bone', s: '🦴', x: 82, y: 86, fs: 11 },
    ],
    setup(g) {
      const quiet = () => { g.hide('woof'); g.hide('woof2'); g.set('dog', { s: '🐶' }); g.win(600); };
      g.mute(quiet);
      g.drop('bone', 'dog', () => { g.wrong('Crunch… WOOF! Still barking.'); return false; });
      g.miss('dog', 'Woof woof! Petting doesn’t help.');
    },
  };

  L[21] = {
    objs: [{ id: 'shirt', s: '👕', x: 50, y: 50, fs: 55 }],
    setup(g) {
      g.input(v => {
        if (v === '4' || v === 'four') return true;
        if (v === '3' || v === '2') return 'Count again. Where does your body go in and come out?';
        return false;
      }, { numeric: true, placeholder: 'How many holes?' });
    },
  };

  L[22] = {
    bg: WALL,
    setup(g) {
      const now = new Date();
      let mins = ((now.getHours() % 12) * 60 + now.getMinutes() + 4 * 60 + 25) % 720;
      mins -= mins % 5;
      const face = () => {
        const h = (mins / 720) * 360, m = ((mins % 60) / 60) * 360;
        return `<div style="position:relative;width:100%;height:100%;border-radius:50%;background:#fff;border:.06em solid #1b2340">
          ${[0, 1, 2, 3].map(i => `<b style="position:absolute;left:50%;top:50%;font-size:.14em;transform:translate(-50%,-50%) rotate(${i * 90}deg) translateY(-2.9em) rotate(${-i * 90}deg)">${[12, 3, 6, 9][i]}</b>`).join('')}
          <i style="position:absolute;left:48%;top:22%;width:4%;height:28%;background:#1b2340;border-radius:4px;transform-origin:50% 100%;transform:rotate(${h}deg)"></i>
          <i style="position:absolute;left:49%;top:10%;width:2%;height:40%;background:#ff5a5f;border-radius:4px;transform-origin:50% 100%;transform:rotate(${m}deg)"></i>
          <i style="position:absolute;left:46%;top:46%;width:8%;height:8%;border-radius:50%;background:#1b2340"></i></div>`;
      };
      g.add({ id: 'clock', html: face(), x: 50, y: 40, w: 62, h: 34, fs: 40 });
      g.add({ id: 'hr', s: '+1 hour', x: 30, y: 82, fs: 6, cls: 'btn' });
      g.add({ id: 'mn', s: '+5 min', x: 70, y: 82, fs: 6, cls: 'btn' });
      const check = () => {
        const n = new Date(), real = (n.getHours() % 12) * 60 + n.getMinutes();
        const d = Math.abs(real - mins), diff = Math.min(d, 720 - d);
        if (diff <= 5) g.win(500);
      };
      g.tap('hr', () => { mins = (mins + 60) % 720; g.set('clock', { html: face() }); g.sfx('pop'); check(); });
      g.tap('mn', () => { mins = (mins + 5) % 720; g.set('clock', { html: face() }); g.sfx('pop'); check(); });
      g.tap('clock', () => g.toast('Use the buttons to move the hands.'));
    },
  };

  L[23] = {
    bg: '#f3e9ff',
    objs: [
      { id: 'books', s: '📚', x: 15, y: 30, fs: 14 },
      { id: 'plant', s: '🪴', x: 85, y: 70, fs: 14 },
      { id: 'sofa', s: '🛋️', x: 18, y: 78, fs: 16 },
      { id: 'mom', s: '👩', x: 52, y: 58, fs: 36 },
      { id: 'glasses', s: '👓', x: 52, y: 39, fs: 10 },
      { id: 'q', s: '?', txt: true, x: 72, y: 34, fs: 10, c: '#5a49ff', cls: 'float' },
    ],
    setup(g) {
      g.tap('glasses', () => g.win());
      g.miss('books', 'Not behind the books.');
      g.miss('plant', 'Not in the plant.');
      g.miss('sofa', 'Not under the sofa.');
      g.miss('mom', 'Mom keeps searching. They are closer than she thinks.');
    },
  };

  L[24] = {
    objs: [
      { id: 'oven', x: 58, y: 62, w: 52, h: 40, color: '#4a4f5c', r: 2 },
      { id: 'window', x: 58, y: 66, w: 36, h: 20, color: '#2b2f3a', r: 1.5 },
      { id: 'dial', s: 'OFF', txt: true, x: 58, y: 48, fs: 4.5, cls: 'btn' },
      { id: 'bowl', s: '🥣', x: 16, y: 82, fs: 14 },
      { id: 'timer', s: '⏲️ 60:00', txt: true, x: 70, y: 18, fs: 6.5, cls: 'btn' },
      { id: 'cake', s: '🎂', x: 58, y: 66, fs: 12, hidden: true },
      { id: 'note', s: 'Guests arrive any second!', txt: true, x: 30, y: 30, fs: 4, c: '#ff5a5f' },
    ],
    setup(g) {
      let t = 60;
      const check = () => {
        if (g.state.in && g.state.on && t === 0) { g.show('cake'); g.set('window', { color: '#ffb347' }); g.win(700); }
      };
      const setT = v => { t = Math.max(0, v); g.set('timer', { s: `⏲️ ${String(t).padStart(2, '0')}:00` }); check(); };
      g.drop('bowl', ['oven', 'window'], () => { g.state.in = true; g.hide('bowl'); g.toast('Batter is in the oven.'); g.sfx('pop'); check(); });
      g.tap('dial', () => { g.state.on = !g.state.on; g.set('dial', { s: g.state.on ? 'ON' : 'OFF' }); g.set('window', { color: g.state.on ? '#7a3b1d' : '#2b2f3a' }); g.sfx('pop'); check(); });
      g.tap('timer', () => { setT(t - 15); g.sfx('pop'); });
      g.rub('timer', () => setT(0), 3);
    },
  };

  L[25] = {
    bg: WALL,
    objs: [
      { id: 'floor', x: 50, y: 92, w: 100, h: 18, color: '#d9a876' },
      { id: 'door', s: '🚪', x: 82, y: 52, fs: 34 },
      { id: 'clock', s: '🕰️', x: 46, y: 16, fs: 13 },
      { id: 'drawer', html: '<b style="font-size:.35em;color:#fff">▬</b>', x: 20, y: 52, w: 28, h: 12, color: '#a0703f', r: 1, fs: 12 },
      { id: 'note', s: '📝', x: 20, y: 40, fs: 10, hidden: true },
      { id: 'key', s: '🔑', x: 42, y: 88, fs: 18, z: 2 },
      { id: 'rug', x: 42, y: 88, w: 54, h: 16, color: '#c0392b', r: 1.5, z: 5, border: '3px dashed #ffd84d' },
    ],
    setup(g) {
      g.tap('clock', () => {
        if (g.state.drawer) return;
        g.state.drawer = true; g.set('drawer', { color: '#7a5130' }); g.show('note'); g.sfx('pop'); g.toast('A drawer pops open!');
      });
      g.miss('drawer', 'It’s stuck. Maybe something opens it?');
      g.tap('note', () => g.toast('The note says: “Under your feet.”'));
      g.drag('rug', () => true);
      const shrink = () => { if (g.state.small) return; g.state.small = true; g.set('key', { fs: 9 }); g.toast('The key shrank!'); g.sfx('pop'); };
      g.dbl('key', shrink);
      g.pinch(r => { if (r < 0.8) shrink(); });
      g.drop('key', 'door', () => {
        if (!g.state.small) { g.wrong('That key is far too big for the lock!'); return false; }
        g.hide('key'); g.set('door', { s: '🚶' }); g.win(600);
      });
      g.tap('door', () => g.wrong('Locked.'));
    },
  };
})();
