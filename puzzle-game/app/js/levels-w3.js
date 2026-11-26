/* World 3: Detective Case (levels 51–75). */
(() => {
  const L = window.LEVEL_LOGIC = window.LEVEL_LOGIC || {};
  const OFFICE = '#e8e1d3', NIGHT = '#232a45';

  const suspects = (labels, extra = {}) => labels.map((s, i) => Object.assign({ id: 'p' + i, s, x: 20 + i * 30, y: 50, fs: 24 }, extra));

  L[51] = {
    bg: '#dcefd8',
    objs: [
      ...suspects(['🧍', '🧍‍♂️', '🧍‍♀️']),
      { id: 'sh0', s: '👟', x: 20, y: 72, fs: 9 },
      { id: 'sh1', s: '🥾', x: 50, y: 72, fs: 9 },
      { id: 'mud', s: '●  ●', txt: true, x: 50, y: 76, fs: 4, c: '#6b4423' },
      { id: 'sh2', s: '👠', x: 80, y: 72, fs: 9 },
      { id: 'garden', x: 50, y: 92, w: 100, h: 14, color: '#7a5230' },
    ],
    setup(g) {
      g.tap('p1', () => g.win()); g.tap('sh1', () => g.win());
      g.miss('p0', 'Clean shoes. Not this one.'); g.miss('sh0', 'Clean shoes.');
      g.miss('p2', 'Clean shoes. Not this one.'); g.miss('sh2', 'Clean shoes.');
    },
  };

  L[52] = {
    bg: OFFICE,
    objs: [
      { id: 'desk', x: 50, y: 70, w: 96, h: 6, color: '#8a5a3b' },
      { id: 'lamp', s: '💡', x: 18, y: 58, fs: 14 },
      { id: 'book', s: '📕', x: 42, y: 61, fs: 12 },
      { id: 'glass', s: '🥛', x: 70, y: 59, fs: 14 },
      { id: 'print', html: '<div class="print"></div>', x: 72, y: 57, w: 6, h: 4, fs: 6, hidden: true, z: 5 },
      { id: 'mag', s: '🔍', x: 50, y: 30, fs: 14 },
    ],
    setup(g) {
      g.drag('mag', p => {
        if (g.over(p, 'glass', 4)) { g.show('print'); g.toast('A fingerprint! Tap it.'); g.sfx('pop'); return false; }
        if (g.over(p, 'lamp', 2) || g.over(p, 'book', 2)) g.toast('No prints here.');
        return false;
      });
      g.tap('print', () => g.win());
      g.miss('glass', 'Looks clean… use the magnifying glass.');
    },
  };

  L[53] = {
    bg: OFFICE,
    objs: [
      { id: 'a', cls: 'card', html: '🏖️ <b>A</b><br>“I was at the beach all day.”<br><small>Sunburned 🥵</small>', x: 50, y: 18, w: 86, fs: 4.2 },
      { id: 'b', cls: 'card', html: '🍞 <b>B</b><br>“I was baking.”<br><small>Flour on hands</small>', x: 50, y: 48, w: 86, fs: 4.2 },
      { id: 'c', cls: 'card', html: '🌙 <b>C</b><br>“I was reading in my room last night.”<br><small>Room light bulb: broken 💡❌</small>', x: 50, y: 79, w: 86, fs: 4.2 },
    ],
    setup(g) {
      g.tap('c', () => g.win());
      g.miss('a', 'The sunburn fits the beach story.');
      g.miss('b', 'The flour fits the baking story.');
    },
  };

  L[54] = {
    bg: OFFICE,
    objs: [
      { id: 'safe', s: '🔐', x: 70, y: 58, fs: 30 },
      { id: 'cal', cls: 'card', html: '<b>APRIL</b><br><span style="letter-spacing:.2em">1 2 3 4 5 6 7<br>8 9 10 11 <u style="color:#ff5a5f">12❤️</u> 13 14</span>', x: 28, y: 28, w: 46, fs: 3.6 },
    ],
    setup(g) {
      g.input(v => (v === '0412' || v === '412') ? true : 'The safe beeps. Wrong code.', { numeric: true, placeholder: '4-digit code' });
      g.miss('safe', 'Type the code below.');
    },
  };

  L[55] = {
    bg: OFFICE,
    objs: [
      { id: 'sketch', s: '🧔', x: 50, y: 24, fs: 22, rot: 180, color: '#fff', r: 2, cls: 'card' },
      { id: 'lbl', s: 'Witness drawing (tap to turn)', x: 50, y: 41, fs: 3.6, c: '#5b6380' },
      ...[['👨', 14], ['👴', 38], ['🧔', 62], ['👩', 86]].map(([s, x], i) => ({ id: 's' + i, s, x, y: 72, fs: 16 })),
    ],
    setup(g) {
      g.state.rot = 180;
      g.el('sketch').style.filter = 'grayscale(1)';
      g.tap('sketch', () => { g.state.rot = (g.state.rot + 90) % 360; g.set('sketch', { rot: g.state.rot }); g.sfx('pop'); });
      [0, 1, 2, 3].forEach(i => g.tap('s' + i, () => {
        if (g.state.rot !== 0) { g.wrong('Hard to compare when the drawing is that way round.'); return; }
        if (i === 2) g.win(); else g.wrong('Doesn’t match the drawing.');
      }));
    },
  };

  L[56] = {
    bg: '#cfe8c8',
    objs: [
      { id: 'house', x: 50, y: 40, w: 90, h: 60, color: '#f0d9b5' },
      { id: 'door', s: '🚪', x: 50, y: 50, fs: 28 },
      { id: 'mat', s: 'WELCOME', txt: true, x: 50, y: 76, w: 40, h: 7, fs: 4, color: '#8a5a3b', c: '#fff', r: 1 },
      { id: 'key', s: '🗝️', x: 80, y: 78, fs: 8, hidden: true, z: 6 },
      { id: 'pot', s: '🪴', x: 82, y: 72, fs: 16, z: 5 },
      { id: 'lamp', s: '🏮', x: 16, y: 56, fs: 12 },
    ],
    setup(g) {
      g.tap('pot', () => { g.set('pot', { rot: 80, x: 90 }); g.show('key'); g.sfx('pop'); });
      g.tap('key', () => g.win());
      g.miss('mat', 'Under the doormat? Too obvious!');
      g.miss('lamp', 'Nothing in the lamp.');
      g.miss('door', 'Locked.');
    },
  };

  L[57] = {
    bg: OFFICE,
    objs: [
      { id: 'note', cls: 'card', s: '3 - 1 - 20', x: 50, y: 34, fs: 12 },
      { id: 'clue', cls: 'card', s: 'A = 1', x: 50, y: 66, fs: 6 },
    ],
    setup(g) { g.input(['cat'], { placeholder: 'Decoded word' }); },
  };

  L[58] = {
    bg: OFFICE,
    objs: [
      { id: 'paper', x: 36, y: 62, w: 52, h: 30, color: '#fffdf5', r: 1 },
      { id: 'msg', s: 'BEHIND THE\nPAINTING', txt: true, x: 36, y: 62, fs: 5, c: '#a0522d', hidden: true, ghost: true },
      { id: 'lamp', s: '💡', x: 82, y: 70, fs: 14 },
      { id: 'painting', s: '🖼️', x: 72, y: 20, fs: 22 },
    ],
    setup(g) {
      g.drop('lamp', 'paper', () => { g.show('msg'); g.state.read = true; g.toast('Words appear!'); g.sfx('pop'); return false; }, 2);
      g.tap('painting', () => { if (g.state.read) { g.set('painting', { rot: 25 }); g.win(600); } else g.wrong('Just a nice painting… for now.'); });
      g.miss('paper', 'Blank. Or is it?');
    },
  };

  L[59] = {
    bg: '#e9e1cf',
    objs: [
      { id: 'boot', cls: 'card', html: '<b style="font-size:2.2em;display:block">R</b><small>Boot sole</small>', x: 50, y: 20, fs: 6 },
      { id: 'f0', html: '<div style="font:700 2.4em var(--f-display);color:#6b4423">R</div>', x: 20, y: 66, fs: 8 },
      { id: 'f1', html: '<div style="font:700 2.4em var(--f-display);color:#6b4423;transform:scaleX(-1)">R</div>', x: 50, y: 66, fs: 8 },
      { id: 'f2', html: '<div style="font:700 2.4em var(--f-display);color:#6b4423;transform:rotate(180deg)">R</div>', x: 80, y: 66, fs: 8 },
    ],
    setup(g) {
      g.tap('f1', () => g.win());
      g.miss('f0', 'It looks the same as the sole… but a footprint is like a stamp.');
      g.miss('f2', 'That one is upside down.');
    },
  };

  L[60] = {
    bg: '#5b4a3a',
    objs: [
      { id: 'sofa', s: '🛋️', x: 25, y: 70, fs: 22 },
      { id: 'plant', s: '🪴', x: 55, y: 66, fs: 16 },
      { id: 'curtain', x: 82, y: 50, w: 22, h: 74, color: '#8e2b2b', r: 1 },
      { id: 'shoes', s: '👟👟', x: 82, y: 89, fs: 7, z: 5 },
      { id: 'clock', s: '🕰️', x: 40, y: 20, fs: 12 },
      { id: 'dark', html: '', cls: 'dark-cover', x: 50, y: 50, w: 100, h: 100, ghost: true, z: 80 },
    ],
    setup(g) {
      const d = g.el('dark');
      g.move(p => { d.style.setProperty('--lx', p.x + '%'); d.style.setProperty('--ly', p.y + '%'); });
      g.tap('shoes', () => { g.hide('dark'); g.win(500); });
      g.miss('sofa', 'Just a sofa.'); g.miss('plant', 'Just a plant.'); g.miss('clock', 'Tick tock.');
      g.miss('curtain', 'Something moved down below…');
      g.toast('Drag your finger around to use the torch.');
    },
  };

  L[61] = {
    bg: '#cfc6b8',
    objs: [{ id: 'watch', cls: 'card', html: '⌚<br><b style="font-size:.6em">9:40</b><br><small style="font-size:.3em">cracked</small>', x: 50, y: 46, fs: 22 }],
    setup(g) { g.input(['9:40', '940', '9.40', '09:40', '21:40'], { placeholder: 'Time of the robbery' }); },
  };

  L[62] = {
    bg: '#dfe7f2',
    objs: [
      ...[16, 38, 60, 82].map((x, i) => ({ id: 'c' + i, s: '👮', x, y: 36, fs: 16 })),
      { id: 'det', s: '🕵️', x: 50, y: 72, fs: 20 },
      { id: 'badge', s: '⭐', x: 56, y: 80, fs: 2.4 },
    ],
    setup(g) {
      g.input(v => {
        if (v === '5' || v === 'five') return true;
        if (v === '4' || v === 'four') return 'Look closely at the man in the coat.';
        return false;
      }, { numeric: true });
    },
  };

  L[63] = {
    bg: OFFICE,
    objs: [
      { id: 'table', x: 50, y: 66, w: 92, h: 5, color: '#8a5a3b' },
      { id: 'c0', s: '☕', x: 22, y: 57, fs: 14 },
      { id: 'c1', s: '☕', x: 50, y: 57, fs: 14 },
      { id: 'steam', s: '♨️', x: 50, y: 42, fs: 8, cls: 'float', ghost: true },
      { id: 'c2', s: '☕', x: 78, y: 57, fs: 14 },
    ],
    setup(g) {
      g.tap('c1', () => g.win());
      g.miss('c0', 'Stone cold.'); g.miss('c2', 'Stone cold.');
    },
  };

  L[64] = {
    bg: '#b88a5a',
    objs: [
      { id: 'door', x: 50, y: 50, w: 70, h: 90, color: '#8a5a3b', r: 1 },
      { id: 'handle', x: 70, y: 52, w: 14, h: 4, color: '#d4af37', r: 2 },
      { id: 'prints', html: '<div class="print"></div>', x: 70, y: 52, w: 8, h: 5, fs: 6, hidden: true, z: 5, ghost: true },
      { id: 'brush', s: '🖌️', x: 28, y: 80, fs: 14 },
    ],
    setup(g) {
      g.drag('brush', () => false, {
        rubNeed: 4,
        rub: p => { if (g.over(p, 'handle', 8)) { g.show('prints'); g.win(900); } else g.toast('Dust the door handle.'); },
      });
      g.miss('handle', 'Use the brush. Rub it over the handle.');
    },
  };

  L[65] = {
    bg: '#14182b',
    setup(g) {
      const dots = [];
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
        const id = 'd' + (r * 3 + c), x = 25 + c * 25, y = 30 + r * 22;
        dots.push({ id, x, y });
        g.add({ id, x, y, w: 6, fs: 6, html: '<div style="width:100%;aspect-ratio:1;border-radius:50%;background:#e8ebf7"></div>' });
      }
      // faint smudges tracing an L (top-left down, then across)
      g.add({ id: 'sm1', x: 25, y: 52, w: 1.5, h: 44, color: 'rgba(255,255,255,.12)', ghost: true });
      g.add({ id: 'sm2', x: 50, y: 74, w: 50, h: 1.2, color: 'rgba(255,255,255,.12)', ghost: true });
      g.add({ id: 'lock', s: '🔒 Draw the unlock pattern', x: 50, y: 10, fs: 4, c: '#e8ebf7' });
      g.trace(path => {
        const seq = [];
        path.forEach(p => {
          const d = dots.find(k => Math.abs(k.x - p.x) < 9 && Math.abs(k.y - p.y) < 7);
          if (d && seq[seq.length - 1] !== d.id) seq.push(d.id);
        });
        if (seq.length < 2) return;
        if (seq.join() === 'd0,d3,d6,d7,d8') { g.set('lock', { s: '🔓 Unlocked!' }); g.win(600); }
        else g.wrong('Wrong pattern. Look at the smudges on the screen.');
      });
    },
  };

  L[66] = {
    bg: '#cfe8c8',
    objs: [
      { id: 'dog', s: '🐕', x: 18, y: 72, fs: 18 },
      ...[34, 50, 66, 82, 98, 114, 130, 146, 162].map((x, i) => ({ id: 'pw' + i, s: '🐾', x, y: 80 - (i % 2) * 4, fs: 5 })),
      { id: 'bone', s: '🦴', x: 176, y: 76, fs: 9 },
      { id: 'tree', s: '🌳', x: 170, y: 60, fs: 36, z: 5 },
      { id: 'arrow', s: '→', txt: true, x: 88, y: 40, fs: 10, c: '#5b6380', cls: 'pulse' },
    ],
    setup(g) {
      g.pan(2);
      g.tap('bone', () => g.win());
      g.miss('dog', 'Sniff sniff… the trail goes on.');
      g.toast('Swipe the scene to look around.');
    },
  };

  L[67] = {
    bg: '#f2dfb2',
    objs: [{ id: 'path', s: '👣   👣   👣', x: 50, y: 50, fs: 12, rot: -20 }],
    setup(g) { g.input(['footsteps', 'footstep', 'footprints', 'footprint', 'steps'], { placeholder: 'Type your answer' }); },
  };

  L[68] = {
    bg: OFFICE,
    objs: [
      { id: 'note', cls: 'card', s: 'MEET AT 9', x: 40, y: 34, fs: 9, flip: true },
      { id: 'mirror', s: '🪞', x: 78, y: 74, fs: 18 },
    ],
    setup(g) {
      g.drop('mirror', 'note', () => { g.set('note', { flip: false }); g.toast('Now you can read it!'); g.sfx('pop'); return false; }, 10);
      g.input(v => (v === '9' || v === 'nine' || v === '9:00' || v === '9 pm' || v === '9pm') ? true : 'Read the note properly first.', { numeric: true, placeholder: 'What time?' });
    },
  };

  L[69] = {
    bg: '#fff1c9',
    objs: [
      { id: 'sun', s: '☀️', x: 85, y: 12, fs: 14 },
      ...suspects(['🧑', '🧑‍🦱', '🧑‍🦰'], { y: 52 }),
      { id: 'gl', s: '🧤', x: 80, y: 68, fs: 8 },
      { id: 'ts', s: '👕', x: 20, y: 70, fs: 8 }, { id: 'ts2', s: '👕', x: 50, y: 70, fs: 8 },
    ],
    setup(g) {
      g.tap('p2', () => g.win()); g.tap('gl', () => g.win());
      g.miss('p0', 'Dressed for summer.'); g.miss('p1', 'Dressed for summer.');
    },
  };

  L[70] = {
    bg: '#5c3d22',
    setup(g) {
      const letters = ['P', 'E', 'X', 'O', 'N', 'R', 'A'];
      const colors = ['#ff5a5f', '#5a49ff', '#22b46a', '#ffb347', '#8e5bd6', '#2bb3c0', '#f06292'];
      letters.forEach((s, i) => g.add({ id: 'k' + i, s, txt: true, x: 12 + i * 12.6, y: 52, w: 11, h: 40, fs: 6, color: colors[i], c: '#fff', r: 1 }));
      g.add({ id: 'shelf', x: 50, y: 73, w: 100, h: 3, color: '#3a2615' });
      g.add({ id: 'note', s: '📜', x: 50, y: 14, fs: 12 });
      g.tap('note', () => g.toast('The note says: “Say the magic word.”'));
      const want = ['O', 'P', 'E', 'N'];
      let got = [];
      letters.forEach((s, i) => g.tap('k' + i, () => {
        got.push(s); g.set('k' + i, { y: 48 }); g.sfx('pop');
        if (s !== want[got.length - 1]) {
          g.wrong('Click… nothing happens.'); got = [];
          letters.forEach((_, j) => g.set('k' + j, { y: 52 }));
          return;
        }
        if (got.length === want.length) { g.bg('#1d1d1d'); g.win(700); }
      }));
    },
  };

  L[71] = {
    objs: [
      { id: 't', s: '🔺 = 3', txt: true, x: 50, y: 22, fs: 9 },
      { id: 's', s: '🟥 = 4', txt: true, x: 50, y: 44, fs: 9 },
      { id: 'p', s: '⬟ = ?', txt: true, x: 50, y: 66, fs: 9, c: '#5a49ff' },
    ],
    setup(g) { g.input(['5', 'five'], { numeric: true }); },
  };

  L[72] = {
    bg: '#2a3354',
    setup(g) {
      [20, 50, 80].forEach((x, i) => {
        g.add({ id: 'car' + i, s: '🚗', x, y: 62, fs: 20 });
        if (i !== 1) g.add({ id: 'snow' + i, x, y: 55.5, w: 16, h: 3, color: '#ffffff', r: 2, ghost: true });
      });
      g.add({ id: 'flakes', s: '❄  ❄    ❄   ❄  ❄', x: 50, y: 18, fs: 5, c: '#ffffff' });
      g.add({ id: 'ground', x: 50, y: 88, w: 100, h: 20, color: '#eef2f8' });
      g.tap('car1', () => g.win());
      g.miss('car0', 'Covered in snow. It hasn’t moved for hours.');
      g.miss('car2', 'Covered in snow. It hasn’t moved for hours.');
    },
  };

  L[73] = {
    bg: '#0b0d16',
    objs: [
      { id: 'suspect', s: '🕴️', x: 50, y: 44, fs: 24, op: 0.15 },
      { id: 'frame', x: 50, y: 44, w: 80, h: 56, border: '3px solid rgba(255,255,255,.4)', r: 1, ghost: true },
      { id: 'flash', s: '⚡', x: 20, y: 86, fs: 10, cls: 'off' },
      { id: 'shutter', x: 50, y: 86, w: 18, fs: 10, html: '<div style="width:100%;aspect-ratio:1;border-radius:50%;background:#fff;border:.3em solid #8a90a8"></div>' },
    ],
    setup(g) {
      g.tap('flash', () => { g.state.flash = !g.state.flash; g.cls('flash', 'off', !g.state.flash); g.toast(g.state.flash ? 'Flash on' : 'Flash off'); });
      g.tap('shutter', () => {
        if (!g.state.flash) { g.wrong('Too dark. The photo came out black.'); return; }
        g.bg('#ffffff'); g.set('suspect', { op: 1 }); g.after(200, () => g.bg('#0b0d16')); g.win(700);
      });
    },
  };

  L[74] = {
    bg: OFFICE,
    objs: ['LISTEN', 'SILENT', 'ENLIST', 'TINSEL', 'SALINE'].map((s, i) => ({ id: 'w' + i, s, cls: 'card', x: i % 2 ? 72 : 28, y: 18 + i * 16, fs: 6 })),
    setup(g) {
      g.tap('w4', () => g.win());
      [0, 1, 2, 3].forEach(i => g.miss('w' + i, 'Look at the letters, not the meaning.'));
    },
  };

  L[75] = {
    bg: OFFICE,
    objs: [
      { id: 'print', s: '👣', x: 18, y: 18, fs: 10 },
      { id: 'window', s: '🪟', x: 50, y: 15, fs: 14 },
      { id: 'bin', s: '🗑️', x: 82, y: 18, fs: 12 },
      { id: 'clues', s: 'Clues: 0 / 3', txt: true, x: 50, y: 32, fs: 4.5, c: '#5b6380' },
      { id: 'c0', cls: 'card', html: '<b>Max</b><br>Shoe 42<br>Blue scarf<br>Alibi: home all night', x: 18, y: 56, w: 30, fs: 3.3 },
      { id: 'c1', cls: 'card', html: '<b>Rosa</b><br>Shoe 42<br>Red scarf<br>No alibi after 7:00', x: 50, y: 56, w: 30, fs: 3.3 },
      { id: 'c2', cls: 'card', html: '<b>Ivan</b><br>Shoe 38<br>Red scarf<br>Alibi: at work', x: 82, y: 56, w: 30, fs: 3.3 },
      { id: 'arrest', s: 'ARREST', txt: true, x: 50, y: 86, w: 50, h: 10, fs: 5, color: '#ff5a5f', c: '#fff', r: 2 },
    ],
    setup(g) {
      const found = new Set();
      const clue = (k, msg) => () => {
        if (!found.has(k)) { found.add(k); g.set('clues', { s: `Clues: ${found.size} / 3` }); g.sfx('pop'); }
        g.toast(msg);
      };
      g.tap('print', clue('p', 'Clue: a size 42 shoe print.'));
      g.tap('window', clue('w', 'Clue: a red thread on the window latch.'));
      g.tap('bin', clue('b', 'Clue: a train ticket for 7:15 pm.'));
      ['c0', 'c1', 'c2'].forEach(c => g.drop(c, 'arrest', () => {
        if (found.size < 3) { g.wrong('Collect all 3 clues first.'); return false; }
        if (c === 'c1') { g.win(400); return false; }
        g.wrong(c === 'c0' ? 'Max has an alibi and a blue scarf.' : 'Ivan’s shoes are too small.');
        return false;
      }, 2));
      g.tap('arrest', () => g.toast('Drag a suspect card here.'));
    },
  };
})();
