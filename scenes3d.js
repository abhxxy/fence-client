/* Small 3D scenes used across the page. All of them share ONE WebGL context (Mini) and are
   copied into ordinary <canvas> slots, so the page stays within mobile context limits.
   Depends on THREE (r128) and Fence3D. */
(function (global) {
  const T = global.THREE, F = global.Fence3D, col = F.col;
  const std = (c, extra) => new T.MeshStandardMaterial(Object.assign({ color: col(c), roughness: .85, metalness: 0 }, extra || {}));
  const mesh = (geo, m, x, y, z, parent) => { const o = new T.Mesh(geo, m); o.position.set(x || 0, y || 0, z || 0); o.castShadow = o.receiveShadow = true; if (parent) parent.add(o); return o; };

  /* ---------- shared renderer ---------- */
  const Mini = { ok: null, r: null, size: 1024, slots: [], env: null, dpr: Math.min(global.devicePixelRatio || 1, 1.5) };
  Mini.renderer = function () {
    if (Mini.ok !== null) return Mini.r;
    try {
      const c = document.createElement('canvas'); c.width = c.height = Mini.size;
      const r = new T.WebGLRenderer({ canvas: c, antialias: true, alpha: true, powerPreference: 'high-performance' });
      r.setPixelRatio(1); r.setSize(Mini.size, Mini.size, false); r.shadowMap.enabled = true; r.shadowMap.type = T.PCFSoftShadowMap; r.outputEncoding = T.sRGBEncoding; r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 1.05; r.setClearColor(0, 0); r.autoClear = false;
      Mini.r = r; Mini.ok = true; Mini.env = F.env(r);
    } catch (e) { Mini.ok = false; }
    return Mini.r;
  };
  /* slot = { canvas, build(scene) -> {camera, update(now,dt), dispose}, lazy } */
  Mini.add = function (slot) {
    if (!Mini.renderer()) { slot.canvas.classList.add('nogl'); return null; }
    slot.ctx = slot.canvas.getContext('2d'); slot.visible = false; slot.built = false; slot.last = 0;
    new IntersectionObserver(es => { slot.visible = es[0].isIntersecting; if (slot.visible && !slot.built) Mini.build(slot); }, { rootMargin: '160px' }).observe(slot.canvas);
    Mini.slots.push(slot); return slot;
  };
  Mini.build = function (slot) { slot.scene = new T.Scene(); slot.scene.environment = Mini.env; const h = slot.build(slot.scene); slot.camera = h.camera; slot.update = h.update; slot.handle = h; slot.built = true; if (slot.progress != null && ('progress' in h)) h.progress = slot.progress; };
  Mini.rebuild = function (slot) { if (!slot.built) return; if (slot.handle && slot.handle.dispose) slot.handle.dispose(); slot.scene.traverse(o => { if (o.geometry) o.geometry.dispose(); }); Mini.build(slot); };
  let lastFrame = 0;
  function loop(now) {
    requestAnimationFrame(loop); if (!Mini.r || now - lastFrame < 16) return; const dt = Math.min(.05, (now - lastFrame) / 1000); lastFrame = now;
    const r = Mini.r, S = Mini.size;
    for (const s of Mini.slots) {
      if (!s.visible || !s.built || document.hidden) continue;
      const cw = s.canvas.clientWidth, ch = s.canvas.clientHeight; if (!cw || !ch) continue;
      let w = Math.round(cw * (s.dpr || Mini.dpr)), h = Math.round(ch * (s.dpr || Mini.dpr)); const k = Math.min(1, S / Math.max(w, h)); w = Math.max(2, Math.floor(w * k)); h = Math.max(2, Math.floor(h * k));
      if (s.canvas.width !== w || s.canvas.height !== h) { s.canvas.width = w; s.canvas.height = h; }
      s.camera.aspect = w / h; s.camera.updateProjectionMatrix();
      if (s.update) s.update(now, dt);
      r.setViewport(0, 0, w, h); r.setScissor(0, 0, w, h); r.setScissorTest(true); r.clear(true, true, true); r.render(s.scene, s.camera);
      s.ctx.clearRect(0, 0, w, h); s.ctx.drawImage(r.domElement, 0, S - h, w, h, 0, 0, w, h);
    }
  }
  requestAnimationFrame(loop);

  /* ---------- helpers ---------- */
  function lights(scene, intensity) {
    scene.add(new T.HemisphereLight(0xbcd7f2, 0x5f6f4a, .7));
    const sun = new T.DirectionalLight(0xfff0d6, intensity || 2.0); sun.position.set(-4, 7, 5); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
    const c = sun.shadow.camera; c.left = c.bottom = -5; c.right = c.top = 5; c.near = .5; c.far = 30; sun.shadow.bias = -.0006; sun.shadow.normalBias = .02; scene.add(sun); scene.add(new T.AmbientLight(0xffffff, .12)); return sun;
  }
  function lawnDisc(scene, radius) { const d = mesh(new T.CircleGeometry(radius, 48), new T.MeshStandardMaterial({ map: F.tex('grass', radius * 1.2, radius * 1.2), roughness: 1 })); d.rotation.x = -Math.PI / 2; d.receiveShadow = true; scene.add(d); return d; }
  function turntable(canvas, group, speed) {
    const st = { rot: 0, vel: 0, drag: false, lx: 0, idle: 0 }; canvas.style.touchAction = 'pan-y'; canvas.style.cursor = 'grab';
    canvas.addEventListener('pointerdown', e => { st.drag = true; st.lx = e.clientX; st.vel = 0; canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing'; });
    canvas.addEventListener('pointermove', e => { if (!st.drag) return; st.vel = (e.clientX - st.lx) * .01; st.rot += st.vel; st.lx = e.clientX; });
    ['pointerup', 'pointercancel'].forEach(ev => canvas.addEventListener(ev, () => { st.drag = false; st.idle = 0; canvas.style.cursor = 'grab'; }));
    return (now, dt) => { if (!st.drag) { st.vel *= .9; st.idle += dt; st.rot += st.vel + (st.idle > 1.5 ? dt * (speed || .35) : 0); } group.rotation.y = st.rot; };
  }

  /* ---------- 1. Post footing cutaway (promise section) ---------- */
  function cutaway(canvas) {
    return function (scene) {
      lights(scene, 1.9);
      const g = new T.Group(); scene.add(g); g.rotation.y = -.5;
      const soilDark = new T.MeshStandardMaterial({ map: F.tex('mulch', 2, 1.4), color: col('#8a6a4a'), roughness: 1 }), soilLight = std('#b08968'), grassM = new T.MeshStandardMaterial({ map: F.tex('grass', 2, 2), roughness: 1 });
      const W = 2.6, D = 1.5, Htop = .5, Hsub = 1.1, hole = .36;
      // soil block in two halves with the hole between, back wall behind the hole
      [-1, 1].forEach(s => { const w = (W - hole) / 2; mesh(new T.BoxGeometry(w, Htop, D), soilDark, s * (hole / 2 + w / 2), -Htop / 2, -D / 2, g); mesh(new T.BoxGeometry(w, Hsub, D), soilLight, s * (hole / 2 + w / 2), -Htop - Hsub / 2, -D / 2, g); const gr = mesh(new T.BoxGeometry(w, .06, D), grassM, s * (hole / 2 + w / 2), .03, -D / 2, g); gr.receiveShadow = true; });
      mesh(new T.BoxGeometry(hole, Htop + Hsub, D - hole / 2), soilLight, 0, -(Htop + Hsub) / 2, -D / 2 - hole / 4, g); // behind the hole
      mesh(new T.BoxGeometry(W, .3, D), std('#6b5340'), 0, -Htop - Hsub - .15, -D / 2, g); // base
      // gravel, post, concrete (animated)
      const gravel = new T.Group(); gravel.position.y = -Htop - Hsub + .08; g.add(gravel);
      for (let i = 0; i < 26; i++) { const r = .035 + Math.random() * .03; const m = mesh(new T.DodecahedronGeometry(r, 0), std(['#9a9a94', '#b5b3aa', '#7f7d76'][i % 3], { roughness: .9 }), (Math.random() - .5) * (hole - .08), Math.random() * .06, -Math.random() * (hole / 2 - .05), gravel); m.rotation.set(Math.random() * 3, Math.random() * 3, 0); }
      const postH = 1.75, postBottom = -Htop - Hsub + .14;
      const post = mesh(new T.BoxGeometry(.1, postH, .1), new T.MeshStandardMaterial({ color: col('#9a5a32'), map: F.tex('wood', 1, 2), roughness: .85 }), 0, postBottom + postH / 2, -hole / 4 - .01, g);
      const concH = Htop + Hsub - .2; const conc = new T.Mesh(new T.CylinderGeometry(hole / 2, hole / 2 - .02, concH, 24, 1, false, Math.PI, Math.PI), std('#cfcbc2', { roughness: .95 })); conc.position.set(0, postBottom + concH / 2, 0); conc.castShadow = conc.receiveShadow = true; g.add(conc);
      const concCap = new T.Mesh(new T.CylinderGeometry(hole / 2 + .02, hole / 2, .05, 24, 1, false, Math.PI, Math.PI), std('#d9d5cc', { roughness: .95 })); concCap.position.set(0, postBottom + concH + .02, 0); g.add(concCap);
      // rail stubs + a couple of pickets so it reads as a fence post
      const railM = std('#9a5a32'); [.38, 1.08].forEach(y => mesh(new T.BoxGeometry(1.2, .08, .035), railM, 0, y + .05, -hole / 4 - .07, g));
      for (let i = 0; i < 6; i++) { if (i === 2 || i === 3) continue; mesh(new T.BoxGeometry(.13, 1.42, .018), std('#a8683e', { map: F.tex('wood', 1, 1) }), -.5 + i * .2, .74, -hole / 4 - .095, g); }
      // marker: depth line
      const line = mesh(new T.BoxGeometry(.012, Htop + Hsub, .012), std('#e07a2f', { emissive: col('#e07a2f'), emissiveIntensity: .4 }), hole / 2 + .16, -(Htop + Hsub) / 2, .02, g);
      [0, -(Htop + Hsub)].forEach(y => mesh(new T.BoxGeometry(.14, .012, .012), std('#e07a2f', { emissive: col('#e07a2f'), emissiveIntensity: .4 }), hole / 2 + .16, y, .02, g));
      const camera = new T.PerspectiveCamera(30, 1, .1, 50); camera.position.set(0, .8, 6.1); camera.lookAt(0, -.12, 0);
      // build state driven from outside (scroll) via handle.progress 0..1
      const h = { camera, progress: 1 };
      const spin = turntable(canvas, g, .25);
      h.update = (now, dt) => { spin(now, dt); const p = h.progress; const gp = Math.min(1, Math.max(0, (p - .05) / .2)); gravel.scale.setScalar(.001 + gp); const pp = Math.min(1, Math.max(0, (p - .25) / .3)); post.position.y = postBottom + postH / 2 + (1 - pp) * 2.2; post.visible = p > .25; const cp = Math.min(1, Math.max(0, (p - .55) / .35)); conc.scale.y = Math.max(.001, cp); conc.position.y = postBottom + concH * cp / 2; concCap.visible = cp > .98; line.visible = p > .9; };
      return h;
    };
  }

  /* ---------- 2. Step scenes ---------- */
  function phone(canvas) {
    return function (scene) {
      lights(scene, 1.6); const g = new T.Group(); scene.add(g);
      const body = mesh(new T.BoxGeometry(.72, 1.5, .08), std('#1d2024', { roughness: .4, metalness: .3 }), 0, .75, 0, g);
      mesh(new T.BoxGeometry(.64, 1.38, .01), new T.MeshStandardMaterial({ color: col('#e9f4ec'), emissive: col('#dff3e6'), emissiveIntensity: .5, roughness: .3 }), 0, .75, .045, g);
      mesh(new T.CylinderGeometry(.5, .5, .04, 32), std('#d9d6cd', { roughness: .9 }), 0, 0, 0, g).receiveShadow = true;
      const bubble = (w, h, x, y, c, out) => { const b = new T.Group(); b.position.set(x, y, .07); g.add(b); mesh(new T.BoxGeometry(w, h, .05), std(c, { roughness: .5 }), 0, 0, 0, b); for (let i = 0; i < 2; i++) mesh(new T.BoxGeometry(w - .12 - i * .1, .03, .01), std(out ? '#0b3d22' : '#3a3a3a'), -i * .05, .04 - i * .08, .03, b); return b; };
      const b1 = bubble(.46, .2, -.08, 1.1, '#ffffff', false), b2 = bubble(.5, .2, .06, .82, '#5ee08a', true), b3 = bubble(.4, .18, -.1, .55, '#ffffff', false);
      [b1, b2, b3].forEach((b, i) => { b.userData.y = b.position.y; b.userData.ph = i * 1.1; });
      const camera = new T.PerspectiveCamera(30, 1, .1, 50); camera.position.set(1.6, 1.5, 2.9); camera.lookAt(0, .7, 0);
      const spin = turntable(canvas, g, .3);
      return { camera, update: (now, dt) => { spin(now, dt);[b1, b2, b3].forEach(b => { b.position.y = b.userData.y + Math.sin(now / 700 + b.userData.ph) * .02; }); } };
    };
  }
  function tape(canvas) {
    return function (scene) {
      lights(scene, 1.8); const g = new T.Group(); scene.add(g);
      lawnDisc(scene, 1.5);
      const yellow = std('#f1c232', { roughness: .5 }), dark = std('#2a2a2a', { roughness: .6 });
      const caseG = new T.Group(); caseG.position.set(-.55, .17, 0); g.add(caseG);
      const c1 = mesh(new T.CylinderGeometry(.17, .17, .12, 32), yellow, 0, 0, 0, caseG); c1.rotation.x = Math.PI / 2;
      const c2 = mesh(new T.CylinderGeometry(.18, .18, .05, 32), dark, 0, 0, 0, caseG); c2.rotation.x = Math.PI / 2;
      mesh(new T.BoxGeometry(.06, .05, .14), dark, 0, .19, 0, caseG);
      const blade = mesh(new T.BoxGeometry(1.0, .004, .07), new T.MeshStandardMaterial({ color: col('#f6e7a1'), roughness: .5, metalness: .2 }), .12, .03, 0, g);
      for (let i = 0; i < 9; i++) mesh(new T.BoxGeometry(.006, .005, i % 4 === 0 ? .05 : .025), dark, -.3 + i * .1, .033, .01, g);
      mesh(new T.BoxGeometry(.03, .04, .09), dark, .62, .03, 0, g); // tab
      const stake = mesh(new T.BoxGeometry(.04, .55, .04), std('#9a5a32'), .78, .25, -.02, g); stake.rotation.z = .08;
      mesh(new T.BoxGeometry(.03, .14, .18), std('#ff5a1f'), .8, .5, -.1, g); // flag
      const clip = new T.Group(); clip.position.set(.1, .02, -.55); clip.rotation.set(0, .5, 0); g.add(clip);
      mesh(new T.BoxGeometry(.5, .02, .66), std('#8b5a2b'), 0, 0, 0, clip); mesh(new T.BoxGeometry(.44, .005, .58), std('#f8f6f0'), 0, .013, .02, clip); mesh(new T.BoxGeometry(.2, .03, .06), std('#777'), 0, .03, -.28, clip);
      for (let i = 0; i < 5; i++) mesh(new T.BoxGeometry(.3 - (i % 2) * .08, .002, .012), std('#9aa0a6'), -.03, .017, -.16 + i * .08, clip);
      const camera = new T.PerspectiveCamera(30, 1, .1, 50); camera.position.set(1.2, 1.6, 2.6); camera.lookAt(0.1, .1, 0);
      const spin = turntable(canvas, g, .3);
      return { camera, update: (now, dt) => { spin(now, dt); const ext = .9 + Math.sin(now / 1400) * .1; blade.scale.x = ext; blade.position.x = -.38 + ext * .5; } };
    };
  }
  function built(canvas, material) {
    return function (scene) {
      lights(scene, 2.0); const g = new T.Group(); scene.add(g);
      const d = mesh(new T.CylinderGeometry(2.4, 2.4, .08, 48), new T.MeshStandardMaterial({ map: F.tex('grass', 4, 4), roughness: 1 }), 0, -.04, 0, g);
      const Y = F.build(scene, { material: material || 'wood', gate: true, length: 4.88, gateAt: .6, yard: false }); g.add(Y.group);
      mesh(new T.BoxGeometry(4.6, .04, .5), new T.MeshStandardMaterial({ map: F.tex('mulch', 4, 1), roughness: 1 }), 0, .02, .4, g);
      [-1.6, -1.1, 1.0, 1.6].forEach((x, i) => { const s = mesh(new T.SphereGeometry(.22 + (i % 2) * .05, 10, 8), std(['#3f7a3b', '#4c8a44'][i % 2]), x, .17, .45, g); s.scale.y = .8; });
      // broom leaning on the fence
      const broom = new T.Group(); broom.position.set(1.9, 0, .25); broom.rotation.z = -.22; g.add(broom);
      mesh(new T.CylinderGeometry(.015, .015, 1.3, 8), std('#c99a5b'), 0, .75, 0, broom); mesh(new T.BoxGeometry(.26, .22, .05), std('#d9b36a'), 0, .11, 0, broom);
      const camera = new T.PerspectiveCamera(30, 1, .1, 60); camera.position.set(2.6, 2.1, 5.2); camera.lookAt(0, .8, 0);
      const spin = turntable(canvas, g, .22);
      return { camera, update: (now, dt) => { spin(now, dt); if (Y.gate) Y.gate.rotation.y = -0.35 - Math.sin(now / 1800) * .3; }, dispose: () => F.dispose(Y.group) };
    };
  }

  /* ---------- 3. Fence section for the estimate form ---------- */
  function section(canvas, getMaterial) {
    return function (scene) {
      lights(scene, 2.0); const g = new T.Group(); scene.add(g);
      mesh(new T.CylinderGeometry(1.9, 1.9, .08, 48), new T.MeshStandardMaterial({ map: F.tex('grass', 3, 3), roughness: 1 }), 0, -.04, 0, g);
      const Y = F.build(scene, { material: getMaterial(), gate: false, length: 2.44, yard: false }); g.add(Y.group);
      const camera = new T.PerspectiveCamera(32, 1, .1, 60); camera.position.set(2.2, 1.7, 3.6); camera.lookAt(0, .85, 0);
      const spin = turntable(canvas, g, .4);
      return { camera, update: spin, dispose: () => F.dispose(Y.group) };
    };
  }

  /* ---------- 4. Full yard orbit view for the visualizer ---------- */
  function yard(canvas, getMaterial) {
    return function (scene) {
      const L = F.lights(scene, 'day', 1024); F.sky(scene, 'day', L.sun.position);
      const Y = F.build(scene, { material: getMaterial(), gate: true, yard: true });
      const camera = new T.PerspectiveCamera(40, 1.6, .1, 200);
      const st = { rot: .42, tilt: .22, rad: 7.2, drag: false, lx: 0, ly: 0, vel: 0, idle: 0 }; canvas.style.touchAction = 'pan-y'; canvas.style.cursor = 'grab';
      canvas.addEventListener('pointerdown', e => { st.drag = true; st.lx = e.clientX; st.ly = e.clientY; st.vel = 0; canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing'; });
      canvas.addEventListener('pointermove', e => { if (!st.drag) return; st.vel = (e.clientX - st.lx) * .007; st.rot += st.vel; st.tilt = Math.max(.06, Math.min(.9, st.tilt + (e.clientY - st.ly) * .004)); st.lx = e.clientX; st.ly = e.clientY; });
      ['pointerup', 'pointercancel'].forEach(ev => canvas.addEventListener(ev, () => { st.drag = false; st.idle = 0; canvas.style.cursor = 'grab'; }));
      canvas.addEventListener('wheel', e => { e.preventDefault(); st.rad = Math.max(4, Math.min(12, st.rad + e.deltaY * .01)); }, { passive: false });
      return { camera, update: (now, dt) => { if (!st.drag) { st.vel *= .9; st.rot += st.vel; st.idle += dt; if (st.idle > 2) st.rot += dt * .08; } const r = st.rad, cx = .5; camera.position.set(cx + Math.sin(st.rot) * r * Math.cos(st.tilt), .9 + Math.sin(st.tilt) * r, Math.cos(st.rot) * r * Math.cos(st.tilt)); camera.lookAt(cx, .95, 0); }, dispose: () => { F.dispose(Y.group); F.dispose(Y.yard); } };
    };
  }

  global.Scenes3D = { Mini, cutaway, phone, tape, built, section, yard };
})(window);
