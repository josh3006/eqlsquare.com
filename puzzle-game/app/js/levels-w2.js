/* World 2: School Days (levels 26–50). */
(() => {
  const L = window.LEVEL_LOGIC = window.LEVEL_LOGIC || {};
  const BOARD = '#2f5b47', CLASS = '#dff1e6', CHALK = '#f4f7f2';

  // Helpers shared by this world
  const pathHits = (g, path, id) => {
    const el = g.el(id); if (!el || el.hidden) return false;
    const r = el.getBoundingClientRect(), s = g.stageRect();
    return path.some(p => {
      const cx = s.left + p.x / 100 * s.width, cy = s.top + p.y / 100 * s.height;
      return cx > r.left - 6 && cx < r.right + 6 && cy > r.top - 6 && cy < r.bottom + 6;
    });
  };

  L[26] = {
    bg: BOARD,
    objs: ['1', '+', '1', '=', '3'].map((s, i) => ({ id: 'c' + i, s, txt: true, x: 16 + i * 17, y: 46, fs: 16, c: CHALK })),
    setup(g) {
      g.tap('c3', () => { g.set('c3', { s: '≠' }); g.win(600); });
      ['c0', 'c2', 'c4'].forEach(c => g.miss(c, 'You can’t change the numbers.'));
      g.miss('c1', 'Plus stays plus. Try another symbol.');
    },
  };

  L[27] = {
    bg: BOARD,
    objs: [
      { id: 'eight', s: '8', txt: true, x: 50, y: 40, fs: 60, c: CHALK },
      { id: 's0', s: '?', txt: true, x: 30, y: 86, fs: 10, c: '#ffd84d' },
      { id: 's1', s: '?', txt: true, x: 50, y: 86, fs: 10, c: '#ffd84d' },
      { id: 's2', s: '?', txt: true, x: 70, y: 86, fs: 10, c: '#ffd84d' },
    ],
    setup(g) {
      const found = [];
      g.input(v => {
        const n = { four: '4', zero: '0', three: '3' }[v] || v;
        if (!['4', '0', '3'].includes(n)) return 'Not one of them. Think about the shape of the 8.';
        if (found.includes(n)) return 'You already found that one.';
        found.push(n); g.set('s' + (found.length - 1), { s: n }); g.sfx('pop');
        if (found.length === 3) return true;
        g.toast(`${found.length} of 3 found!`);
        return null;
      }, { placeholder: 'One answer at a time' });
    },
  };

  L[28] = {
    objs: [{
      id: 'tri', x: 50, y: 48, w: 80, fs: 10,
      html: '<svg viewBox="0 0 100 88" width="100%"><path d="M50 2 L98 86 L2 86 Z M26 44 L74 44 L50 86 Z" fill="#ffd84d" stroke="#1b2340" stroke-width="2.5" stroke-linejoin="round"/></svg>',
    }],
    setup(g) {
      g.input(v => {
        if (v === '5' || v === 'five') return true;
        if (v === '4' || v === 'four') return 'Did you count the big one?';
        return false;
      }, { numeric: true, placeholder: 'How many triangles?' });
    },
  };

  L[29] = {
    bg: CLASS,
    objs: [
      { id: 'board', x: 50, y: 22, w: 70, h: 22, color: BOARD, r: 1, border: '6px solid #a5703f' },
      { id: 'piano', s: '🎹', x: 78, y: 70, fs: 20 },
      { id: 'desk', s: '🪑', x: 25, y: 74, fs: 16 },
    ],
    setup(g) { g.input(['piano', 'a piano', 'keyboard', 'a keyboard'], { placeholder: 'Type your answer' }); },
  };

  L[30] = {
    bg: CLASS,
    objs: [
      {
        id: 'clock', x: 50, y: 16, w: 26, fs: 10,
        html: '<svg viewBox="0 0 80 80" width="100%"><circle cx="40" cy="40" r="36" fill="#fff" stroke="#1b2340" stroke-width="5"/><path d="M40 40 L18 40" stroke="#1b2340" stroke-width="6" stroke-linecap="round"/><path d="M40 40 L40 12" stroke="#1b2340" stroke-width="4" stroke-linecap="round"/><g font-family="sans-serif" font-size="10" font-weight="700" fill="#1b2340" text-anchor="middle"><text x="40" y="15">12</text><text x="68" y="44">3</text><text x="40" y="73">6</text><text x="12" y="44">9</text></g></svg>',
      },
      { id: 'board', html: '<b>9 + 9 = ?</b>', txt: true, x: 50, y: 52, w: 84, h: 26, color: BOARD, c: CHALK, fs: 12, r: 1, border: '6px solid #a5703f' },
      { id: 'teacher', s: '👩‍🏫', x: 82, y: 82, fs: 16 },
    ],
    setup(g) {
      g.input(v => {
        if (v === '6' || v === 'six') return true;
        if (v === '18' || v === 'eighteen') { g.bump('teacher'); return 'The teacher shakes their head. Not 18 in this classroom.'; }
        return false;
      }, { numeric: true });
    },
  };

  L[31] = {
    objs: [{ id: 'cake', x: 50, y: 50, w: 72, fs: 10, html: '<div style="width:100%;aspect-ratio:1;border-radius:50%;background:#ff9fc4;border:.5em solid #fff;box-shadow:0 0 0 .2em #e7799f"></div>' }],
    setup(g) {
      g.state.cuts = [];
      g.toast('Swipe across the cake to cut it.');
      g.swipe(sw => {
        const s = g.stageRect();
        const ax = sw.x1 / 100 * s.width, ay = sw.y1 / 100 * s.height, bx = sw.x2 / 100 * s.width, by = sw.y2 / 100 * s.height;
        const len = Math.hypot(bx - ax, by - ay);
        if (len < s.width * 0.45) { g.toast('Make a longer cut, right across.'); return; }
        const cx = s.width / 2, cy = s.height / 2;
        const t = Math.max(0, Math.min(1, ((cx - ax) * (bx - ax) + (cy - ay) * (by - ay)) / (len * len)));
        const d = Math.hypot(ax + t * (bx - ax) - cx, ay + t * (by - ay) - cy);
        if (d > s.width * 0.08) { g.wrong('That piece is too small. Cut through the middle.'); return; }
        const ang = Math.atan2(by - ay, bx - ax) * 180 / Math.PI;
        const n = g.state.cuts.length;
        g.add({ id: 'cut' + n, x: 50, y: 50, w: 80, h: 0.8, color: '#1b2340', rot: ang, ghost: true, z: 5 });
        g.state.cuts.push(ang);
        g.sfx('pop');
        if (n === 0) { g.toast('2 pieces. Keep cutting.'); return; }
        const diff = Math.abs(((g.state.cuts[0] - ang) % 180 + 180) % 180);
        if (Math.min(diff, 180 - diff) > 45) g.win(600);
        else { g.wrong('Those pieces aren’t equal. Start again.'); g.state.cuts.forEach((_, i) => g.hide('cut' + i)); g.state.cuts = []; }
      });
    },
  };

  L[32] = {
    bg: CLASS,
    objs: [0, 1, 2, 3, 4].flatMap(i => [
      { id: 's' + i, s: '🧑‍🎓', x: 12 + i * 19, y: 42, fs: 14 },
      { id: 'b' + i, s: '📖', x: 12 + i * 19, y: 60, fs: 10, rot: i === 3 ? 180 : 0 },
    ]),
    setup(g) {
      g.tap('s3', () => g.win()); g.tap('b3', () => g.win());
      [0, 1, 2, 4].forEach(i => { g.miss('s' + i, 'This one is reading.'); g.miss('b' + i, 'This one is reading.'); });
    },
  };

  L[33] = {
    bg: '#2a2f45',
    setup(g) {
      // Seven-segment "6" made of matchsticks; move the middle stick to the top-right gap to make a 0.
      const X = 20, Y = 46, M = '#f5d76e';
      const seg = {
        a: [X, Y - 14, 12, 2.2], f: [X - 7, Y - 7, 2.6, 12], g: [X, Y, 12, 2.2],
        e: [X - 7, Y + 7, 2.6, 12], d: [X, Y + 14, 12, 2.2], c: [X + 7, Y + 7, 2.6, 12],
      };
      Object.entries(seg).forEach(([k, [x, y, w, h]]) => g.add({ id: k, x, y, w, h, color: M, r: 1 }));
      g.add({ id: 'slotB', x: X + 7, y: Y - 7, w: 6, h: 12, ghost: true });
      g.add({ id: 'rest', s: '+  4  =  4', txt: true, x: 64, y: Y, fs: 13, c: M });
      Object.keys(seg).forEach(k => g.drag(k, p => {
        if (k === 'g' && Math.abs(p.x - (X + 7)) < 6 && Math.abs(p.y - (Y - 7)) < 8) {
          g.set('g', { x: X + 7, y: Y - 7, w: 2.6, h: 12 }); g.win(700); return true;
        }
        if (k !== 'g' && Math.abs(p.x - (X + 7)) < 6 && Math.abs(p.y - (Y - 7)) < 8) g.wrong('Then the number falls apart. Try another stick.');
        return false;
      }));
      g.miss('rest', 'Change the first number.');
    },
  };

  L[34] = {
    bg: BOARD,
    objs: [{ id: 'seq', s: '1, 2, 4, 8, ?', txt: true, x: 50, y: 45, fs: 12, c: CHALK }],
    setup(g) { g.input(['16', 'sixteen'], { numeric: true }); },
  };

  L[35] = {
    bg: BOARD,
    objs: [{ id: 'seq', s: '1\n11\n21\n1211\n?', txt: true, x: 50, y: 48, fs: 10, c: CHALK }],
    setup(g) {
      g.input(v => {
        if (v === '111221') return true;
        if (v === '2421' || v === '12111') return 'Close, but read the last line out loud: one 1, one 2…';
        return false;
      }, { numeric: true });
    },
  };

  L[36] = {
    bg: CLASS,
    objs: [
      { id: 'board', x: 50, y: 16, w: 32, h: 10, color: BOARD, r: 0.5, border: '3px solid #a5703f' },
      { id: 'hw', s: 'Homework:\npage 42', x: 50, y: 16, fs: 1.6, c: CHALK, ghost: true },
      { id: 'desks', s: '🪑   🪑   🪑', x: 50, y: 52, fs: 9 },
      { id: 'desks2', s: '🪑   🪑   🪑', x: 50, y: 68, fs: 11 },
      { id: 'sam', s: '🧑', x: 50, y: 86, fs: 16 },
      { id: 'think', s: '??', txt: true, x: 62, y: 76, fs: 6, c: '#5a49ff', cls: 'float' },
    ],
    setup(g) {
      g.onZoom(z => { if (z >= 1.9 && !g.state.done) { g.state.done = true; g.set('think', { s: '42!' }); g.toast('Sam can read it now: page 42!'); g.win(1200); } });
      g.miss('sam', 'Sam squints. The board is just a blur from here.');
      g.miss('board', 'Too small to read from here.');
    },
  };

  L[37] = {
    objs: [
      { id: 'p1', html: '<div class="pencil out"></div>', x: 50, y: 24, w: 44, h: 3, fs: 7 },
      { id: 'p2', html: '<div class="pencil in"></div>', x: 50, y: 46, w: 44, h: 3, fs: 7 },
      { id: 'p3', html: '<div class="pencil out"></div>', x: 50, y: 68, w: 44, h: 3, fs: 7 },
    ],
    setup(g) {
      ['p1', 'p2', 'p3'].forEach(p => g.drag(p, () => true));
      g.choices(['Top', 'Middle', 'Bottom', 'All the same'], 'All the same', {});
      g.toast('You can drag the pencils.');
    },
  };

  L[38] = {
    bg: BOARD,
    setup(g) {
      let expr = '';
      g.add({ id: 'expr', s: ' ', txt: true, x: 50, y: 20, w: 88, h: 14, fs: 10, c: CHALK, color: 'rgba(255,255,255,.08)', r: 2 });
      const nines = ['n0', 'n1', 'n2', 'n3'];
      nines.forEach((id, i) => g.add({ id, s: '9', x: 20 + i * 20, y: 46, fs: 9, cls: 'btn' }));
      ['+', '−', '×', '÷'].forEach((s, i) => g.add({ id: 'o' + i, s, x: 20 + i * 20, y: 64, fs: 9, cls: 'btn' }));
      g.add({ id: 'clr', s: 'Clear', x: 30, y: 84, fs: 6, cls: 'btn' });
      g.add({ id: 'eq', s: '= 100?', x: 70, y: 84, fs: 6, cls: 'btn' });
      const show = () => g.set('expr', { s: expr || ' ' });
      nines.forEach(id => g.tap(id, () => { expr += '9'; g.hide(id); g.sfx('pop'); show(); }));
      ['+', '−', '×', '÷'].forEach((s, i) => g.tap('o' + i, () => { if (!expr || /[+−×÷]$/.test(expr)) return; expr += s; g.sfx('pop'); show(); }));
      g.tap('clr', () => { expr = ''; nines.forEach(id => g.show(id)); show(); });
      g.tap('eq', () => {
        if ((expr.match(/9/g) || []).length !== 4) { g.wrong('Use all four 9s.'); return; }
        if (/[+−×÷]$/.test(expr)) { g.wrong('Finish the sum first.'); return; }
        const js = expr.replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/');
        let val = NaN;
        if (/^[0-9+\-*/]+$/.test(js)) { try { val = Function('"use strict";return (' + js + ')')(); } catch (e) { val = NaN; } }
        if (Math.abs(val - 100) < 1e-9) g.win(400);
        else g.wrong(`That makes ${Number.isFinite(val) ? Math.round(val * 100) / 100 : '?'}. Try again.`);
      });
    },
  };

  L[39] = {
    bg: CLASS,
    objs: [
      { id: 'bell', s: '🔔', x: 58, y: 9, fs: 13 },
      { id: 'rope', x: 58, y: 26, w: 1.6, h: 22, color: '#8a5a3b' },
      { id: 'cup', html: '<b style="font-size:.3em;color:#fff">CLEANING</b>', x: 16, y: 62, w: 26, h: 40, color: '#a0703f', r: 1, fs: 12, z: 5 },
      { id: 'ladder', s: '🪜', x: 16, y: 66, fs: 22, hidden: true, z: 6 },
      { id: 'kid', s: '🧒', x: 82, y: 80, fs: 16 },
      { id: 'floor', x: 50, y: 95, w: 100, h: 10, color: '#c08a5a' },
    ],
    setup(g) {
      const ring = () => {
        if (!g.state.ladder) { g.wrong('The rope is too high to reach!'); return; }
        g.set('bell', { cls: 'wiggle' }); g.toast('DING DING!'); g.win(700);
      };
      g.tap('rope', ring); g.tap('bell', ring);
      g.tap('cup', () => { if (g.state.open) return; g.state.open = true; g.set('cup', { color: '#5c3d22', html: '' }); g.show('ladder'); g.sfx('pop'); });
      g.drag('ladder', p => { if (Math.abs(p.x - 58) < 16 && p.y > 35) { g.state.ladder = true; g.set('ladder', { x: 58, y: 62, fs: 30 }); g.sfx('pop'); return true; } return false; });
    },
  };

  L[40] = {
    bg: '#e9dccb',
    objs: [
      { id: 'paper', x: 50, y: 40, w: 70, h: 50, color: '#fff', r: 1 },
      { id: 'title', s: 'FINAL EXAM', txt: true, x: 50, y: 22, fs: 6 },
      { id: 'q', s: 'Q1. What is your name?', x: 50, y: 34, fs: 1.5, ghost: true },
      { id: 'line', x: 50, y: 52, w: 50, h: 0.4, color: '#1b2340' },
      { id: 'desk', x: 50, y: 86, w: 100, h: 18, color: '#a0703f' },
      { id: 'plate', s: 'LEO', txt: true, x: 50, y: 82, w: 30, h: 7, fs: 6, color: '#ffd84d', r: 1 },
    ],
    setup(g) {
      g.input(v => {
        if (v === 'leo') return true;
        return 'Read the question first. Zoom in on the paper.';
      }, { placeholder: 'Write your answer' });
      g.miss('paper', 'The question is tiny. Zoom in to read it.');
    },
  };

  L[41] = {
    objs: [{ id: 'cal', s: '📅', x: 50, y: 45, fs: 40 }],
    setup(g) {
      g.input(v => {
        if (v === '12' || v === 'twelve' || v === 'all') return true;
        if (v === '1' || v === 'one') return 'Only February? Does January have a 28th day?';
        return false;
      }, { numeric: true });
    },
  };

  L[42] = {
    objs: [
      { id: 'tri', s: '🔺', x: 28, y: 30, fs: 22 },
      { id: 'sq', s: '🟦', x: 72, y: 30, fs: 20 },
      { id: 'hex', s: '⬢', x: 28, y: 70, fs: 28, c: '#22b46a' },
      { id: 'star', s: '⭐', x: 72, y: 70, fs: 22 },
    ],
    setup(g) {
      g.tap('star', () => g.win());
      g.miss('tri', 'A triangle has 3 sides.');
      g.miss('sq', 'A square has 4 sides.');
      g.miss('hex', 'A hexagon has 6. Something here has more.');
    },
  };

  L[43] = {
    bg: '#eef6ff',
    setup(g) {
      const cap = { A: 3, B: 5 }, amt = { A: 0, B: 0 };
      const jug = k => `<div class="jug"><div class="water" style="height:${amt[k] / cap[k] * 100}%"></div><div class="lab">${amt[k]} / ${cap[k]} L</div></div>`;
      g.add({ id: 'A', html: jug('A'), x: 30, y: 46, w: 24, h: 26, fs: 14 });
      g.add({ id: 'B', html: jug('B'), x: 70, y: 42, w: 30, h: 36, fs: 14 });
      g.add({ id: 'fA', s: 'Fill', x: 22, y: 72, fs: 5, cls: 'btn' });
      g.add({ id: 'eA', s: 'Empty', x: 38, y: 72, fs: 5, cls: 'btn' });
      g.add({ id: 'fB', s: 'Fill', x: 62, y: 72, fs: 5, cls: 'btn' });
      g.add({ id: 'eB', s: 'Empty', x: 78, y: 72, fs: 5, cls: 'btn' });
      g.add({ id: 'help', s: 'Drag one jug onto the other to pour.', x: 50, y: 88, fs: 3.6, c: '#5b6380' });
      const draw = () => {
        g.set('A', { html: jug('A') }); g.set('B', { html: jug('B') });
        if (amt.B === 4 || amt.A === 4) g.win(700);
      };
      const pour = (from, to) => { const n = Math.min(amt[from], cap[to] - amt[to]); amt[from] -= n; amt[to] += n; g.sfx('pop'); draw(); };
      g.tap('fA', () => { amt.A = 3; draw(); }); g.tap('eA', () => { amt.A = 0; draw(); });
      g.tap('fB', () => { amt.B = 5; draw(); }); g.tap('eB', () => { amt.B = 0; draw(); });
      g.drop('A', 'B', () => { pour('A', 'B'); return false; }, 2);
      g.drop('B', 'A', () => { pour('B', 'A'); return false; }, 2);
    },
  };

  L[44] = {
    bg: CLASS,
    objs: [
      { id: 'desk', x: 45, y: 72, w: 60, h: 6, color: '#a0703f' },
      { id: 'student', s: '😴', x: 42, y: 60, fs: 24 },
      { id: 'zz', s: 'Z z', txt: true, x: 58, y: 44, fs: 7, c: '#5a49ff', cls: 'float' },
      { id: 'feather', s: '🪶', x: 80, y: 66, fs: 12 },
    ],
    setup(g) {
      g.drag('feather', () => false, {
        rubNeed: 4,
        rub: p => {
          if (g.over(p, 'student', 10)) { g.set('student', { s: '🤧' }); g.hide('zz'); g.toast('AH-CHOO!'); g.win(900); }
          else g.toast('Tickling the air… try near the nose.');
        },
      });
      g.miss('student', 'Still snoring. Maybe use the feather?');
    },
  };

  L[45] = {
    bg: BOARD,
    objs: [{ id: 'chalk', s: '✏️', x: 85, y: 85, fs: 10 }],
    setup(g) { g.input(v => v === '45' || v === 'forty five' || v === 'forty-five' ? true : 'The answer is already on your screen.', { numeric: true }); },
  };

  L[46] = {
    bg: BOARD,
    setup(g) {
      const parts = ['5', '+', '5', '+', '5', '=', '550'];
      const xs = [12, 22, 32, 42, 52, 64, 82];
      parts.forEach((s, i) => g.add({ id: 'k' + i, s, txt: true, x: xs[i], y: 46, fs: 12, c: CHALK }));
      g.toast('Draw with your finger.');
      g.swipe(sw => {
        if (pathHits(g, sw.path, 'k1') || pathHits(g, sw.path, 'k3')) {
          const k = pathHits(g, sw.path, 'k1') ? 'k1' : 'k3';
          g.set(k, { s: '4', c: '#ffd84d' }); g.win(800);
        } else g.wrong('A line there doesn’t make it true. Try somewhere else.');
      });
      ['k1', 'k3'].forEach(k => g.tap(k, () => g.toast('Draw a line with your finger, don’t just tap.')));
    },
  };

  L[47] = {
    q: 'Which word is always spelled <span data-id="w">WRONG</span>?',
    objs: [{ id: 'dict', s: '📖', x: 50, y: 45, fs: 40 }],
    setup(g) {
      g.tap('w', () => g.win());
      g.input(['wrong'], { placeholder: 'Type the word' });
    },
  };

  L[48] = {
    objs: [{ id: 'circle', x: 50, y: 45, w: 56, fs: 10, html: '<div style="width:100%;aspect-ratio:1;border-radius:50%;border:.6em solid #5a49ff"></div>' }],
    setup(g) { g.choices(['0', '1', '2', 'Infinite'], '2', { Infinite: 'Clever, but think simpler: where can you be?' }); },
  };

  L[49] = {
    bg: CLASS,
    setup(g) {
      const colors = ['#ff5a5f', '#5a49ff', '#22b46a', '#ffb347', '#8e5bd6'];
      // heights in % of stage; the fourth book lies flat until tapped (it is the tallest)
      const books = [{ h: 30 }, { h: 18 }, { h: 38 }, { h: 46, flat: true }, { h: 24 }].map((b, i) => Object.assign(b, { id: 'bk' + i, color: colors[i] }));
      let order = books.map(b => b.id);
      const slotX = i => 14 + i * 18, BASE = 82;
      g.add({ id: 'shelf', x: 50, y: BASE + 1.5, w: 96, h: 3, color: '#8a5a3b' });
      const layout = () => order.forEach((id, i) => {
        const b = books.find(k => k.id === id);
        const w = b.flat ? 16 : 10, h = b.flat ? 6 : b.h;
        g.set(id, { x: slotX(i), y: BASE - h / 2, w, h });
      });
      books.forEach(b => g.add({ id: b.id, x: 0, y: 0, color: b.color, r: 0.8, border: '2px solid rgba(0,0,0,.2)' }));
      layout();
      const check = () => {
        const hs = order.map(id => books.find(b => b.id === id));
        if (hs.some(b => b.flat)) return;
        if (hs.every((b, i) => i === 0 || hs[i - 1].h < b.h)) g.win(600);
      };
      books.forEach(b => {
        g.tap(b.id, () => { if (b.flat) { b.flat = false; layout(); g.sfx('pop'); g.toast('Whoa, that one is tall!'); check(); } });
        g.drag(b.id, p => {
          const to = Math.max(0, Math.min(4, Math.round((p.x - 14) / 18)));
          const from = order.indexOf(b.id);
          order.splice(from, 1); order.splice(to, 0, b.id);
          layout(); g.sfx('pop'); check();
          return false; // layout() already placed every book; let the dragged one glide into its slot
        });
      });
    },
  };

  L[50] = {
    bg: CLASS,
    objs: [
      { id: 'board', html: '<b>? × 2 = 14</b>', txt: true, x: 30, y: 18, w: 50, h: 16, color: BOARD, c: CHALK, fs: 7, r: 1, border: '4px solid #a5703f' },
      { id: 'clock', s: '🕒', x: 78, y: 14, fs: 13 },
      { id: 'window', html: '<span style="font-size:.5em">🐦🐦🐦<br>🐦🐦</span>', x: 26, y: 50, w: 40, h: 22, color: '#8fd0ff', border: '5px solid #fff', fs: 12, r: 1 },
      { id: 'door', s: '🚪', x: 78, y: 56, fs: 28 },
      { id: 'red', s: 'Board', txt: true, x: 18, y: 80, fs: 4.5, color: '#ff8a8a', r: 1, w: 20, h: 8 },
      { id: 'blue', s: 'Clock', txt: true, x: 42, y: 84, fs: 4.5, color: '#8ab8ff', r: 1, w: 20, h: 8 },
      { id: 'green', s: 'Window', txt: true, x: 66, y: 82, fs: 4.5, color: '#8ee0a8', r: 1, w: 20, h: 8 },
    ],
    setup(g) {
      g.tap('red', () => g.toast('Red note: “Board” comes first.'));
      g.tap('blue', () => g.toast('Blue note: “Clock” comes second.'));
      g.tap('green', () => g.toast('Green note: “Window” comes last.'));
      g.tap('door', () => g.toast('The door has a 3-digit keypad. Type the code below.'));
      g.input(v => {
        if (v === '735') { g.set('door', { s: '🚶' }); return true; }
        return 'Beep! Wrong code.';
      }, { numeric: true, placeholder: '3-digit door code' });
    },
  };
})();
