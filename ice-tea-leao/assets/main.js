/* Ice Tea Leão Pêssego · projeto conceitual de estudo
   O despejo desenhado em código: o copo enche com a rolagem. */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smoothstep = (p, e0, e1) => { const t = clamp((p - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
  const easeInOut = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const f1 = n => Math.round(n * 10) / 10;
  function rng(seed) { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

  /* ---------- divisão do texto das faixas (uma vez, com semente) ---------- */
  doc.querySelectorAll('.split').forEach(el => {
    const text = el.textContent.trim().replace(/\s+/g, ' ');
    const r = rng(+el.dataset.seed || 7);
    const words = text.split(' ');
    const isSub = 'sub' in el.dataset;
    const base = isSub ? .34 : 0;
    const spread = isSub ? .3 : .42;
    el.textContent = '';
    const sr = doc.createElement('span');
    sr.className = 'sr';
    sr.textContent = text;
    const vis = doc.createElement('span');
    vis.setAttribute('aria-hidden', 'true');
    words.forEach((w, i) => {
      const ws = doc.createElement('span');
      ws.className = 'w';
      ws.style.setProperty('--th', (base + i / Math.max(1, words.length) * spread + r() * .05).toFixed(3));
      const wi = doc.createElement('span');
      wi.className = 'wi';
      wi.textContent = w;
      ws.appendChild(wi);
      vis.appendChild(ws);
      if (i < words.length - 1) vis.appendChild(doc.createTextNode(' '));
    });
    el.append(sr, vis);
  });

  /* ---------- o copo ---------- */
  const G = { cx: 200, rimY: 720, rimHW: 132, botY: 1236, botHW: 110, inTopY: 724, inTopHW: 122, inBotY: 1196, inBotHW: 102, fullY: 776 };
  const hwIn = y => G.inBotHW + (G.inTopHW - G.inBotHW) * (G.inBotY - y) / (G.inBotY - G.inTopY);
  const hwOut = y => G.botHW + (G.rimHW - G.botHW) * (G.botY - y) / (G.botY - G.rimY);

  const ITEMS = [
    { k: 'peach', x: 188, dy: 64, r: 24, d: 1.1 },
    { k: 'cube', x: 246, dy: 104, r: -12, d: 2.3 },
    { k: 'peach', x: 226, dy: 168, r: -30, d: 3.2 },
    { k: 'cube', x: 164, dy: 132, r: 18, d: .4 },
    { k: 'cube', x: 140, dy: -20, r: -8, d: 1.7 },
    { k: 'cube', x: 262, dy: -14, r: 12, d: 3.9 }
  ];

  function buildGlass(slot, uid, seed) {
    if (!slot) return null;
    const r = rng(seed);
    const id = s => `${uid}-${s}`;

    let drops = '';
    for (let i = 0; i < 20; i++) {
      const y = 800 + r() * 380;
      const hw = hwOut(y) - 12;
      const x = G.cx - hw + r() * hw * 2;
      const rx = 2.2 + r() * 2.8;
      const ry = rx * (1.2 + r() * .5);
      const slide = i % 4 === 0;
      drops += `<g${slide ? ` class="slide" style="animation-delay:-${(r() * 9).toFixed(2)}s;animation-duration:${(8 + r() * 5).toFixed(1)}s"` : ''}><ellipse class="drop" cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}"/><circle class="drop-hl" cx="${f1(x - rx * .35)}" cy="${f1(y - ry * .35)}" r="${f1(rx * .3)}"/></g>`;
    }

    let bubs = '';
    for (let i = 0; i < 9; i++) {
      bubs += `<circle class="bub" cx="${f1(128 + r() * 144)}" cy="${f1(1168 + r() * 20)}" r="${f1(1.8 + r() * 3)}" fill="none" stroke="#FFE3B0" stroke-opacity=".75" stroke-width="1.2" style="animation-delay:-${(r() * 6).toFixed(2)}s;animation-duration:${(4 + r() * 3).toFixed(2)}s"/>`;
    }

    let spl = '';
    for (let i = 0; i < 8; i++) {
      const a = (-162 + i * (144 / 7)) * Math.PI / 180;
      const d = 18 + r() * 26;
      spl += `<circle r="${f1(1.6 + r() * 2.2)}" style="--sx:${f1(Math.cos(a) * d)}px;--sy:${f1(Math.sin(a) * d * .9 - 6)}px;animation-delay:-${(r() * 1.1).toFixed(2)}s"/>`;
    }

    let items = '';
    ITEMS.forEach(it => {
      const inner = it.k === 'cube'
        ? `<rect class="cube-body" x="-38" y="-34" width="76" height="68" rx="14"/><path class="cube-hl" d="M-24 -21 L 16 -23"/><path class="cube-hl2" d="M-27 -15 L -26 18"/>`
        : `<path d="M-50 0 A 50 50 0 0 0 50 0 A 50 22 0 0 1 -50 0 Z" fill="url(#${id('peach')})"/><path class="peach-skin" d="M-50 0 A 50 50 0 0 0 50 0"/><path class="peach-line" d="M-30 16 Q 0 36 30 16"/>`;
      items += `<g class="it"><g class="bob" style="animation-delay:-${it.d}s">${inner}</g></g>`;
    });

    slot.innerHTML = `<svg class="glass-svg" viewBox="0 0 400 1300" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
<defs>
<linearGradient id="${id('tea')}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4E1E08"/><stop offset=".28" stop-color="#8E4210"/><stop offset=".66" stop-color="#C8741E"/><stop offset=".88" stop-color="#9A4A12"/><stop offset="1" stop-color="#5A240A"/></linearGradient>
<linearGradient id="${id('teashade')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7B350" stop-opacity=".38"/><stop offset=".35" stop-color="#E08A2A" stop-opacity="0"/><stop offset="1" stop-color="#2A0E03" stop-opacity=".45"/></linearGradient>
<linearGradient id="${id('spec')}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#FFE6BD" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="${id('surf')}" cx=".62" cy=".38" r=".75"><stop offset="0" stop-color="#F9BF62"/><stop offset=".55" stop-color="#C9731F"/><stop offset="1" stop-color="#8A4012"/></radialGradient>
<linearGradient id="${id('stream')}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8E4512"/><stop offset=".42" stop-color="#EDA743"/><stop offset="1" stop-color="#A0521A"/></linearGradient>
<linearGradient id="${id('peach')}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD592"/><stop offset=".55" stop-color="#FFAB60"/><stop offset="1" stop-color="#F07A3A"/></linearGradient>
<radialGradient id="${id('shadow')}"><stop offset="0" stop-color="#1B120A" stop-opacity=".5"/><stop offset="1" stop-color="#1B120A" stop-opacity="0"/></radialGradient>
<radialGradient id="${id('caustic')}"><stop offset="0" stop-color="#FFB54A" stop-opacity=".8"/><stop offset=".5" stop-color="#F29A2E" stop-opacity=".32"/><stop offset="1" stop-color="#F29A2E" stop-opacity="0"/></radialGradient>
</defs>
<ellipse cx="236" cy="1248" rx="200" ry="26" fill="url(#${id('shadow')})"/>
<ellipse class="g-caustic" cx="146" cy="1262" rx="180" ry="26" fill="url(#${id('caustic')})"/>
<path class="g-rim-back"/>
<path class="g-backwall" fill="#fff" fill-opacity=".035"/>
<path class="g-teabody" fill="url(#${id('tea')})"/>
<path class="g-teashade" fill="url(#${id('teashade')})"/>
<path class="g-spec" fill="url(#${id('spec')})" d="M226 760 L 238 760 L 232 1190 L 222 1190 Z"/>
<ellipse class="g-surface" cx="200" fill="url(#${id('surf')})"/>
<g class="g-bubbles">${bubs}</g>
<path class="g-stream" fill="url(#${id('stream')})"/>
<path class="g-stream-hl"/>
<g class="g-entry"><ellipse class="ripple" cx="0" cy="0" rx="30"/><g class="splash">${spl}</g></g>
<g class="g-items">${items}</g>
<path class="g-front-tint"/>
<path class="g-surfline"/>
<path class="g-fog"/>
<path class="g-body"/>
<path class="g-hl-l" d="M84 738 L 101 1224 L 109 1224 L 94 738 Z"/>
<path class="g-hl-r" d="M318 742 L 302 1220 L 306 1220 L 323 742 Z"/>
<path class="g-base"/>
<g class="g-cond">${drops}</g>
<path class="g-rim-front"/>
</svg>`;

    const q = s => slot.querySelector(s);
    const el = {
      caustic: q('.g-caustic'), rimBack: q('.g-rim-back'), back: q('.g-backwall'), tea: q('.g-teabody'), shade: q('.g-teashade'), spec: q('.g-spec'), surf: q('.g-surface'),
      stream: q('.g-stream'), streamHl: q('.g-stream-hl'), entry: q('.g-entry'), ripple: q('.ripple'),
      tint: q('.g-front-tint'), surfLine: q('.g-surfline'), fog: q('.g-fog'), body: q('.g-body'), base: q('.g-base'),
      cond: q('.g-cond'), rimFront: q('.g-rim-front'), items: [...slot.querySelectorAll('.it')]
    };
    let last = -1;

    function draw(p) {
      if (Math.abs(p - last) < .0004 && last >= 0) return;
      last = p;
      const level = .25 + .75 * easeInOut(clamp(p / .8, 0, 1));
      const pour = 1 - smoothstep(p, .7, .82);
      const R = lerp(19, 8, easeOut(p));
      const sY = G.inBotY - level * (G.inBotY - G.fullY);
      const hwS = hwIn(sY);
      const open = 1 + .22 * (sY - G.rimY) / (G.inBotY - G.rimY);
      const rS = R * open * hwS / G.rimHW;
      const Rin = R * G.inTopHW / G.rimHW;
      const Ri = R * 1.2 * G.inBotHW / G.rimHW;
      const Rb = R * 1.22 * G.botHW / G.rimHW;
      const L = G.cx - hwS, Rt = G.cx + hwS;

      el.rimBack.setAttribute('d', `M68 720 A 132 ${f1(R)} 0 0 1 332 720`);
      el.rimFront.setAttribute('d', `M68 720 A 132 ${f1(R)} 0 0 0 332 720`);
      el.back.setAttribute('d', `M78 724 A 122 ${f1(Rin)} 0 0 1 322 724 L 302 1196 A 102 ${f1(Ri)} 0 0 1 98 1196 Z`);
      el.body.setAttribute('d', `M68 720 L 90 1236 M332 720 L 310 1236 M90 1236 A 110 ${f1(Rb)} 0 0 0 310 1236`);
      el.fog.setAttribute('d', `M68 720 A 132 ${f1(R)} 0 0 0 332 720 L 310 1236 A 110 ${f1(Rb)} 0 0 1 90 1236 Z`);
      el.base.setAttribute('d', `M98 1196 A 102 ${f1(Ri)} 0 0 0 302 1196 L 310 1236 A 110 ${f1(Rb)} 0 0 1 90 1236 Z`);
      const teaD = `M${f1(L)} ${f1(sY)} L 98 1196 A 102 ${f1(Ri)} 0 0 0 302 1196 L ${f1(Rt)} ${f1(sY)} Z`;
      el.tea.setAttribute('d', teaD);
      el.shade.setAttribute('d', teaD);
      el.spec.setAttribute('d', `M226 ${f1(sY + rS + 6)} L 240 ${f1(sY + rS + 6)} L 234 1184 L 222 1184 Z`);
      el.tint.setAttribute('d', `M${f1(L)} ${f1(sY)} A ${f1(hwS)} ${f1(rS)} 0 0 0 ${f1(Rt)} ${f1(sY)} L 302 1196 A 102 ${f1(Ri)} 0 0 1 98 1196 Z`);
      el.surfLine.setAttribute('d', `M${f1(L)} ${f1(sY)} A ${f1(hwS)} ${f1(rS)} 0 0 0 ${f1(Rt)} ${f1(sY)}`);
      el.surf.setAttribute('cy', f1(sY));
      el.surf.setAttribute('rx', f1(hwS));
      el.surf.setAttribute('ry', f1(rS));

      const topY = lerp(-120, sY, smoothstep(p, .7, .82));
      const sway = 2.5 * Math.sin(p * 18);
      const wT = 17 * (.3 + .7 * pour);
      const wB = 12 * (.3 + .7 * pour);
      const streamOn = sY - topY > 6;
      if (streamOn) {
        const mid = (topY + sY) / 2;
        const bx = G.cx + sway;
        el.stream.setAttribute('d', `M${f1(G.cx - wT / 2)} ${f1(topY)} C ${f1(G.cx - wT / 2)} ${f1(mid)} ${f1(bx - wB / 2)} ${f1(mid)} ${f1(bx - wB / 2)} ${f1(sY)} L ${f1(bx + wB / 2)} ${f1(sY)} C ${f1(bx + wB / 2)} ${f1(mid)} ${f1(G.cx + wT / 2)} ${f1(mid)} ${f1(G.cx + wT / 2)} ${f1(topY)} Z`);
        el.streamHl.setAttribute('d', `M${f1(G.cx - wT / 5)} ${f1(topY)} C ${f1(G.cx - wT / 5)} ${f1(mid)} ${f1(bx - wB / 5)} ${f1(mid)} ${f1(bx - wB / 5)} ${f1(sY - 4)}`);
      }
      el.stream.style.display = el.streamHl.style.display = streamOn ? '' : 'none';
      el.entry.setAttribute('transform', `translate(${f1(G.cx + sway)} ${f1(sY)})`);
      el.entry.style.opacity = streamOn ? pour.toFixed(3) : '0';
      el.ripple.setAttribute('ry', f1(Math.max(3, rS * .3)));

      const cond = .15 + .85 * smoothstep(p, .45, .85);
      el.cond.style.opacity = cond.toFixed(3);
      el.fog.style.opacity = (.02 + .1 * cond).toFixed(3);
      el.caustic.style.opacity = (.2 + .8 * level).toFixed(3);

      el.items.forEach((g, i) => {
        const it = ITEMS[i];
        const y = Math.min(sY + it.dy, G.inBotY - 42);
        g.setAttribute('transform', `translate(${it.x} ${f1(y)}) rotate(${it.r})`);
      });
    }
    return { draw };
  }

  const hero = doc.querySelector('.hero');
  const scene = hero.querySelector('.scene');
  const cue = hero.querySelector('.cue');
  const heroGlass = buildGlass(hero.querySelector('[data-glass="hero"]'), 'gh', 5);
  const finalGlass = buildGlass(doc.querySelector('[data-glass="final"]'), 'gf', 9);
  if (finalGlass) finalGlass.draw(1);

  /* ---------- o hero guiado por scroll ---------- */
  const bands = [...hero.querySelectorAll('.band')].map((el, i, arr) => {
    const [a, b] = el.dataset.range.split(',').map(Number);
    return { el, a, b, ramp: +el.dataset.ramp || Math.min(.025, (b - a) * .35), first: i === 0, last: i === arr.length - 1, op: -1, k: -1, on: null };
  });

  let target = 0, shown = 0, rafId = null, lastTick = 0, heroOnScreen = true;
  let loadRaw = 0, loadK = 0, loadStart = 0;
  let scrubOn = false, lastCam = -1, cueGone = null;
  let vh = innerHeight, heroTop = 0, heroH = 0, docH = 0;

  function measure() {
    vh = innerHeight;
    heroTop = hero.offsetTop;
    heroH = hero.offsetHeight;
    docH = root.scrollHeight;
  }

  function heroProgress() {
    const range = heroH - vh;
    return range > 0 ? clamp((scrollY - heroTop) / range, 0, 1) : 1;
  }

  function setBand(bd, p) {
    const f = Math.min(.02, (bd.b - bd.a) / 3);
    let op = bd.first ? 1 : smoothstep(p, bd.a, bd.a + f);
    if (!bd.last) op *= 1 - smoothstep(p, bd.b - f, bd.b);
    let k = clamp((p - bd.a) / bd.ramp, 0, 1);
    if (bd.first) k = Math.max(k, loadK);
    if (Math.abs(op - bd.op) > .004 || (op === 0) !== (bd.op === 0) || (op === 1 && bd.op !== 1)) {
      bd.op = op;
      bd.el.style.opacity = op.toFixed(3);
      bd.el.style.visibility = op > 0 ? 'visible' : 'hidden';
      const on = op > .6;
      if (on !== bd.on) { bd.on = on; bd.el.classList.toggle('on', on); }
    }
    if (Math.abs(k - bd.k) > .008 || (k === 1 && bd.k !== 1) || (k === 0 && bd.k !== 0)) {
      bd.k = k;
      bd.el.style.setProperty('--k', k.toFixed(3));
    }
  }

  function render(p) {
    heroGlass.draw(p);
    const cam = easeOut(p);
    if (Math.abs(cam - lastCam) > .002 || (cam === 1 && lastCam !== 1)) {
      lastCam = cam;
      scene.style.setProperty('--cam', cam.toFixed(3));
    }
    bands.forEach(bd => setBand(bd, p));
    const gone = p > .03;
    if (gone !== cueGone) { cueGone = gone; cue.classList.toggle('gone', gone); }
  }

  function tick(now) {
    const dt = Math.min(100, now - (lastTick || now));
    lastTick = now;
    const k = .16;
    shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));
    let moving = true;
    if (Math.abs(target - shown) < .0005) { shown = target; moving = false; }
    if (loadRaw < 1 && loadStart) {
      loadRaw = clamp((now - loadStart) / 1100, 0, 1);
      loadK = easeOut(loadRaw);
      moving = true;
    }
    render(shown);
    if (moving && scrubOn && heroOnScreen) rafId = requestAnimationFrame(tick);
    else { rafId = null; lastTick = 0; }
  }

  function kick() {
    if (rafId === null && heroOnScreen && scrubOn) rafId = requestAnimationFrame(tick);
  }

  function onScroll() {
    target = heroProgress();
    kick();
  }

  new IntersectionObserver(es => {
    heroOnScreen = es[0].isIntersecting;
    if (heroOnScreen) onScroll();
  }).observe(hero);

  /* ---------- modo do hero: decidido ao vivo ---------- */
  const GATES = [
    '(prefers-reduced-motion: reduce)',
    '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)'
  ];
  const MQLS = GATES.map(q => matchMedia(q));
  const RM = MQLS[0];

  function enableScrub() {
    if (scrubOn) return;
    scrubOn = true;
    root.classList.add('mode-scrub');
    root.classList.remove('mode-static');
    addEventListener('scroll', onScroll, { passive: true });
    bands.forEach(b => { b.op = -1; b.k = -1; b.on = null; });
    lastCam = -1; cueGone = null;
    unpinFinalStates();
    measure();
    target = shown = heroProgress();
    render(shown);
    onScroll();
  }

  function disableScrub() {
    if (!scrubOn && root.classList.contains('mode-static')) return;
    scrubOn = false;
    root.classList.remove('mode-scrub');
    root.classList.add('mode-static');
    removeEventListener('scroll', onScroll);
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    lastTick = 0;
    heroGlass.draw(1);
    scene.style.setProperty('--cam', '1');
    lastCam = 1;
  }

  function applyHeroMode() {
    if (MQLS.some(m => m.matches)) disableScrub();
    else enableScrub();
    measure();
    onPageScroll();
  }

  /* ---------- segura pra gelar ---------- */
  const gelar = doc.getElementById('gelar');
  const holdBtn = gelar.querySelector('.hold');
  const holdLabel = gelar.querySelector('.hold-label');
  const card = gelar.querySelector('.bottle-card');
  const tempNum = gelar.querySelector('.temp-num');
  const done = gelar.querySelector('.done');
  const frostSvg = gelar.querySelector('.frost');

  (function frost() {
    const r = rng(33);
    let s = '';
    for (let i = 0; i < 52; i++) {
      const side = Math.floor(r() * 4);
      const d = r() * r() * 150;
      let x, y;
      if (side === 0) { x = r() * 400; y = d; }
      else if (side === 1) { x = 400 - d; y = r() * 400; }
      else if (side === 2) { x = r() * 400; y = 400 - d; }
      else { x = d; y = r() * 400; }
      const len = 5 + r() * 12;
      const rot = r() * 60;
      let p = '';
      for (let a = 0; a < 6; a++) {
        const ang = (rot + a * 60) * Math.PI / 180;
        p += `M${f1(x)} ${f1(y)}L${f1(x + Math.cos(ang) * len)} ${f1(y + Math.sin(ang) * len)}`;
        const bx = x + Math.cos(ang) * len * .6, by = y + Math.sin(ang) * len * .6, bl = len * .3;
        p += `M${f1(bx)} ${f1(by)}L${f1(bx + Math.cos(ang + .6) * bl)} ${f1(by + Math.sin(ang + .6) * bl)}M${f1(bx)} ${f1(by)}L${f1(bx + Math.cos(ang - .6) * bl)} ${f1(by + Math.sin(ang - .6) * bl)}`;
      }
      s += `<path d="${p}" style="opacity:${(.35 + r() * .6).toFixed(2)}"/>`;
    }
    for (let i = 0; i < 26; i++) {
      s += `<ellipse class="fdrop" cx="${f1(100 + r() * 200)}" cy="${f1(60 + r() * 290)}" rx="${f1(1.5 + r() * 2.5)}" ry="${f1(2 + r() * 3.6)}"/>`;
    }
    frostSvg.innerHTML = s;
  })();

  const hold = { p: 0, holding: false, done: false, auto: false, raf: null, last: 0, temp: '', tempAt: 0, chill: -1, ring: -1 };

  function holdRender(now, force) {
    const c = hold.p;
    if (force || Math.abs(c - hold.chill) > .004) {
      hold.chill = c;
      card.style.setProperty('--chill', c.toFixed(3));
      holdBtn.style.setProperty('--ring', (126 * (1 - c)).toFixed(1));
    }
    const t = String(Math.round(26 - 22 * easeOut(c)));
    if (t !== hold.temp && (force || now - hold.tempAt >= 100)) {
      hold.temp = t;
      hold.tempAt = now;
      tempNum.textContent = t;
    }
  }

  function holdLoop(now) {
    const dt = Math.min(64, now - (hold.last || now));
    hold.last = now;
    if (hold.holding) hold.p = Math.min(1, hold.p + dt / 1800);
    else hold.p = Math.max(0, hold.p - dt / 2600);
    holdRender(now, false);
    if (hold.p >= 1 && !hold.done) { complete(false); }
    if (hold.done || (!hold.holding && hold.p <= 0)) {
      holdRender(now, true);
      hold.raf = null;
      hold.last = 0;
      return;
    }
    hold.raf = requestAnimationFrame(holdLoop);
  }

  function startHold() {
    if (hold.done) return;
    hold.holding = true;
    holdBtn.classList.add('holding');
    if (!hold.raf) hold.raf = requestAnimationFrame(holdLoop);
  }

  function stopHold() {
    if (!hold.holding) return;
    hold.holding = false;
    holdBtn.classList.remove('holding');
    if (!hold.raf && !hold.done && hold.p > 0) hold.raf = requestAnimationFrame(holdLoop);
  }

  function complete(auto) {
    hold.done = true;
    hold.auto = auto;
    hold.holding = false;
    hold.p = 1;
    holdBtn.classList.remove('holding');
    holdRender(performance.now(), true);
    gelar.classList.add('chilled');
    holdBtn.setAttribute('aria-disabled', 'true');
    holdLabel.textContent = 'Gelado';
    done.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => done.classList.add('show')));
  }

  function resetHold() {
    if (hold.raf) { cancelAnimationFrame(hold.raf); hold.raf = null; }
    hold.done = false; hold.auto = false; hold.holding = false; hold.p = 0; hold.last = 0;
    holdRender(performance.now(), true);
    gelar.classList.remove('chilled');
    holdBtn.removeAttribute('aria-disabled');
    holdLabel.textContent = 'Segura aqui';
    done.classList.remove('show');
    done.hidden = true;
  }

  holdBtn.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    try { holdBtn.setPointerCapture(e.pointerId); } catch (_) {}
    startHold();
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => holdBtn.addEventListener(t, stopHold));
  holdBtn.addEventListener('keydown', e => {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); startHold(); }
  });
  holdBtn.addEventListener('keyup', e => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); stopHold(); }
  });
  holdBtn.addEventListener('blur', stopHold);
  holdBtn.addEventListener('contextmenu', e => e.preventDefault());

  /* movimento reduzido: fixa os estados finais e desfaz na volta */
  function pinToFinalStates() {
    if (!hold.done) complete(true);
    lines.forEach(l => { l.v = 1; l.path.style.setProperty('--draw', '0'); });
  }
  function unpinFinalStates() {
    if (hold.auto) resetHold();
    lines.forEach(l => { l.v = -1; });
  }

  /* ---------- faixa corrida ---------- */
  const track = doc.querySelector('.marquee-track');
  if (track) {
    const words = ['bem gelado', 'chá preto', 'pêssego', 'pausa', 'trincando', 'pra dividir'];
    const set = doc.createElement('div');
    set.style.display = 'flex';
    const addRound = () => words.forEach(w => { const s = doc.createElement('span'); s.textContent = `${w} ·`; set.appendChild(s); });
    addRound(); addRound();
    track.appendChild(set);
    let guard = 0;
    while (set.scrollWidth < 2600 && guard++ < 6) addRound();
    track.appendChild(set.cloneNode(true));
  }

  /* ---------- entradas coreografadas ---------- */
  const revealIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const s = e.target;
    s.classList.add('in');
    revealIO.unobserve(s);
    setTimeout(() => s.classList.add('settled'), 1700);
  }), { threshold: .14, rootMargin: '0px 0px -6% 0px' });
  doc.querySelectorAll('[data-reveal]').forEach(s => {
    s.querySelectorAll('.r').forEach((el, i) => el.style.setProperty('--i', i));
    revealIO.observe(s);
  });

  /* loops só rodam na tela; aba escondida pausa tudo */
  const liveIO = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('live', e.isIntersecting)), { rootMargin: '120px 0px' });
  [hero, ...doc.querySelectorAll('.sec, .marquee')].forEach(el => liveIO.observe(el));
  doc.addEventListener('visibilitychange', () => doc.body.classList.toggle('paused', doc.hidden));

  /* ---------- rolagem da página: fios, navegação, copo lateral ---------- */
  const lines = [...doc.querySelectorAll('.pour-line')].map(el => ({ el, path: el.querySelector('path'), v: -1 }));
  const nav = doc.getElementById('nav');
  const side = doc.querySelector('.side-glass');
  let pageRaf = null, navSolid = null, sideShow = null, sideFill = -1;

  function pageTick() {
    pageRaf = null;
    const y = scrollY;
    const reads = RM.matches ? null : lines.map(l => l.el.getBoundingClientRect());
    if (reads) {
      lines.forEach((l, i) => {
        const r = reads[i];
        const v = clamp((vh * .95 - r.top) / (r.height + vh * .3), 0, 1);
        if (Math.abs(v - l.v) > .004 || (v === 1 && l.v !== 1)) { l.v = v; l.path.style.setProperty('--draw', (1 - v).toFixed(3)); }
      });
    }
    const heroEnd = heroTop + heroH;
    const solid = y > heroEnd - vh * .9;
    if (solid !== navSolid) { navSolid = solid; nav.classList.toggle('solid', solid); }
    const show = y > heroEnd - vh * .4;
    if (show !== sideShow) { sideShow = show; side.classList.toggle('show', show); }
    const fill = clamp((y - (heroEnd - vh)) / Math.max(1, docH - vh - (heroEnd - vh)), 0, 1);
    if (Math.abs(fill - sideFill) > .003 || (fill === 1 && sideFill !== 1)) { sideFill = fill; side.style.setProperty('--fill', fill.toFixed(3)); }
  }
  function onPageScroll() { if (!pageRaf) pageRaf = requestAnimationFrame(pageTick); }
  addEventListener('scroll', onPageScroll, { passive: true });

  let resizeT = 0;
  addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => { measure(); onScroll(); onPageScroll(); }, 120);
  });
  addEventListener('load', () => { measure(); onScroll(); onPageScroll(); });

  /* ---------- partida ---------- */
  MQLS.forEach(m => m.addEventListener('change', applyHeroMode));
  RM.addEventListener('change', e => { if (e.matches) pinToFinalStates(); else unpinFinalStates(); });
  applyHeroMode();
  if (RM.matches) pinToFinalStates();

  const fontsReady = doc.fonts && doc.fonts.ready ? doc.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(r => setTimeout(r, 1200))]).then(() => {
    measure();
    loadStart = performance.now();
    loadRaw = 0;
    kick();
    onPageScroll();
  });
})();
