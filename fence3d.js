/* Fence3D: a small backyard scene with a fence line in one of four materials.
   Shared by the offline image renderer (visualizer + gallery images) and the live hero.
   Depends on global THREE (r128). */
(function (global) {
  const T = global.THREE;
  const col = h => new T.Color(h).convertSRGBToLinear();

  /* ---------- procedural textures ---------- */
  function cv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
  function noise(x, w, h, amt) { const id = x.getImageData(0, 0, w, h), d = id.data; for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - .5) * amt; d[i] += n; d[i + 1] += n; d[i + 2] += n; } x.putImageData(id, 0, 0); }
  const C = {};
  C.grass = () => { const [c, x] = cv(256, 256); x.fillStyle = '#5a8a3c'; x.fillRect(0, 0, 256, 256); const id = x.getImageData(0, 0, 256, 256), d = id.data; for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - .5) * 48; d[i] += n * .5; d[i + 1] += n; d[i + 2] += n * .3; } x.putImageData(id, 0, 0); x.strokeStyle = 'rgba(30,70,20,.45)'; for (let i = 0; i < 900; i++) { const px = Math.random() * 256, py = Math.random() * 256; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.random() * 3 - 1.5, py - 3 - Math.random() * 5); x.stroke(); } return c; };
  C.wood = () => { const [c, x] = cv(256, 512); x.fillStyle = '#b9b9b9'; x.fillRect(0, 0, 256, 512); for (let i = 0; i < 70; i++) { x.strokeStyle = `rgba(${60 + Math.random() * 40},${60 + Math.random() * 40},${60 + Math.random() * 40},${.08 + Math.random() * .18})`; x.lineWidth = 1 + Math.random() * 2.5; const px = Math.random() * 256; x.beginPath(); x.moveTo(px, 0); x.bezierCurveTo(px + (Math.random() - .5) * 30, 170, px + (Math.random() - .5) * 30, 340, px + (Math.random() - .5) * 20, 512); x.stroke(); } noise(x, 256, 512, 26); return c; };
  C.vinyl = () => { const [c, x] = cv(256, 256); x.fillStyle = '#dcdcdc'; x.fillRect(0, 0, 256, 256); for (let i = 0; i < 256; i += 32) { x.fillStyle = 'rgba(0,0,0,.10)'; x.fillRect(i, 0, 2, 256); x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(i + 2, 0, 1, 256); } noise(x, 256, 256, 5); return c; };
  C.chain = () => { const [c, x] = cv(128, 128); x.clearRect(0, 0, 128, 128); x.strokeStyle = '#ffffff'; x.lineWidth = 5; x.lineCap = 'round'; x.beginPath(); for (let i = -128; i <= 256; i += 64) { x.moveTo(i, 0); x.lineTo(i + 128, 128); x.moveTo(i + 128, 0); x.lineTo(i, 128); } x.stroke(); return c; };
  C.mulch = () => { const [c, x] = cv(256, 256); x.fillStyle = '#4a3222'; x.fillRect(0, 0, 256, 256); noise(x, 256, 256, 60); return c; };
  C.pavers = () => { const [c, x] = cv(256, 256); x.fillStyle = '#b7b1a6'; x.fillRect(0, 0, 256, 256); for (let r = 0; r < 4; r++) for (let i = 0; i < 4; i++) { const off = (r % 2) * 32; x.fillStyle = `hsl(32,${10 + Math.random() * 10}%,${64 + Math.random() * 10}%)`; x.fillRect(((i * 64 + off) % 256) + 2, r * 64 + 2, 60, 60); } noise(x, 256, 256, 18); return c; };
  C.glow = () => { const [c, x] = cv(128, 128); const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,215,150,.9)'); g.addColorStop(.35, 'rgba(255,190,110,.3)'); g.addColorStop(1, 'rgba(255,170,80,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); return c; };
  C.cloud = () => { const [c, x] = cv(256, 128);[[70, 72, 46], [118, 52, 58], [172, 70, 44], [100, 84, 40], [142, 88, 38]].forEach(([cx, cy, r]) => { const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(.55, 'rgba(255,255,255,.5)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 128); }); return c; };
  const cache = {}, tcache = {};
  function tex(name, rx = 1, ry = 1, srgb = true) { const key = name + '|' + rx.toFixed(3) + '|' + ry.toFixed(3) + '|' + srgb; if (tcache[key]) return tcache[key]; if (!cache[name]) cache[name] = C[name](); const t = new T.CanvasTexture(cache[name]); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = 4; if (srgb) t.encoding = T.sRGBEncoding; tcache[key] = t; return t; }

  /* ---------- material presets ---------- */
  const PRESETS = {
    wood: { height: 1.83, postSize: .1, boardW: .14, gap: .012, color: '#a8683e', rails: 3, cap: true, label: 'Cedar privacy' },
    vinyl: { height: 1.83, postSize: .127, color: '#f3f3ee', rails: 2, label: 'Vinyl privacy' },
    aluminum: { height: 1.37, postSize: .05, color: '#1b1c1f', rails: 3, picket: .016, spacing: .098, label: 'Ornamental aluminum' },
    chainlink: { height: 1.22, postSize: .06, color: '#a9adb3', label: 'Chain-link' }
  };

  function std(c, extra) { return new T.MeshStandardMaterial(Object.assign({ color: col(c), roughness: .85, metalness: 0 }, extra || {})); }

  /* Build the yard + fence. Returns handles for animation. */
  function build(scene, o) {
    o = Object.assign({ material: 'wood', length: 14, gate: true, gateAt: 2.2, color: null, quality: 'high', timeOfDay: 'day', lattice: false, yard: true }, o || {});
    const P = Object.assign({}, PRESETS[o.material]); if (o.color) P.color = o.color;
    const R = { group: new T.Group(), posts: [], rails: [], boards: [], gate: null, gateParts: [], hardware: [], plants: [], yard: new T.Group(), material: o.material, preset: P };
    scene.add(R.group); if (o.yard) scene.add(R.yard);
    const H = P.height, L = o.length;
    const add = (geo, m, x, y, z, parent) => { const mesh = new T.Mesh(geo, m); mesh.position.set(x, y, z); mesh.castShadow = mesh.receiveShadow = true; (parent || R.group).add(mesh); return mesh; };

    /* ---- yard ---- */
    if (o.yard) {
    const lawn = new T.Mesh(new T.PlaneGeometry(120, 120), new T.MeshStandardMaterial({ map: tex('grass', 40, 40), roughness: 1 })); lawn.rotation.x = -Math.PI / 2; lawn.receiveShadow = true; R.yard.add(lawn);
    // mulch bed along the fence (owner's side), patio corner at right
    add(new T.BoxGeometry(L + 1, .06, .9), new T.MeshStandardMaterial({ map: tex('mulch', 8, 1), roughness: 1 }), 0, .03, .55, R.yard);
    // shrubs and flowers in the bed
    const greens = ['#3f7a3b', '#4c8a44', '#38703a', '#5a9a4c', '#2f6a34'];
    const leaf = i => std(greens[i % greens.length], { roughness: .95 });
    const shrub = (x, z, r, i) => { const m = add(new T.SphereGeometry(r, 10, 8), leaf(i), x, r * .72, z, R.yard); m.scale.y = .8; R.plants.push(m); return m; };
    [-5.2, -3.9, -1.1, 1.4, 3.7, 5.1].forEach((x, i) => shrub(x, .55, .34 + (i % 3) * .05, i));
    const flowerM = [std('#d9413a'), std('#f1c232'), std('#f5f1e8'), std('#c55a9f'), std('#8a5fc9')];
    for (let i = 0; i < 26; i++) { const x = -6.5 + Math.random() * 13; const m = add(new T.SphereGeometry(.05, 7, 6), flowerM[i % 5], x, .1, .35 + Math.random() * .45, R.yard); R.plants.push(m); }
    // trees behind the fence (neighbour side) and one in the yard
    const bark = std('#5a3d2a', { roughness: 1 });
    const tree = (x, z, s, pine) => { const g = new T.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); R.yard.add(g); if (pine) { add(new T.CylinderGeometry(.1, .16, 1.4, 8), bark, 0, .7, 0, g);[[1.15, 1.8, 1.7], [.9, 1.6, 2.7], [.6, 1.3, 3.6]].forEach(([r, h, y], i) => { const m = new T.Mesh(new T.ConeGeometry(r, h, 9), leaf(i + 2)); m.position.y = y; m.castShadow = m.receiveShadow = true; g.add(m); }); } else { add(new T.CylinderGeometry(.13, .2, 1.8, 8), bark, 0, .9, 0, g);[[1.25, 0, 2.6, 0], [.95, .75, 2.3, .45], [.9, -.75, 2.4, -.25], [.85, .2, 3.35, -.35], [.75, -.3, 2.9, .75]].forEach(([r, px, py, pz], i) => add(new T.SphereGeometry(r, 10, 8), leaf(i), px, py, pz, g)); } return g; };
    tree(-4.5, -4.5, 1.25, false); tree(2.5, -5.5, 1.1, true); tree(7.5, -4, 1.3, false); tree(-9, -3, 1.0, true); tree(-9.5, 7, 1.4, false);
    // neighbour's house far behind
    const nh = new T.Group(); nh.position.set(3, 0, -14); R.yard.add(nh);
    add(new T.BoxGeometry(9, 3.2, 6), std('#d8d2c4'), 0, 1.6, 0, nh);
    const roofS = new T.Shape(); roofS.moveTo(-3.2, 0); roofS.lineTo(3.2, 0); roofS.lineTo(0, 1.8); roofS.closePath();
    const roofG = new T.ExtrudeGeometry(roofS, { depth: 9.4, bevelEnabled: false }); roofG.translate(0, 0, -4.7);
    const roof = new T.Mesh(roofG, std('#4a4a4f')); roof.rotation.y = Math.PI / 2; roof.position.set(0, 3.2, 0); roof.castShadow = true; nh.add(roof);
    [-2.8, 0, 2.8].forEach(x => add(new T.BoxGeometry(1.1, 1.2, .1), new T.MeshPhysicalMaterial({ color: col('#8fb3cc'), roughness: .1, metalness: .05 }), x, 1.7, 3.03, nh));

    }
    /* ---- fence ---- */
    const postM = std(o.material === 'wood' ? '#9a5a32' : P.color, o.material === 'aluminum' ? { roughness: .45, metalness: .6 } : o.material === 'chainlink' ? { roughness: .35, metalness: .85 } : { roughness: .75 });
    if (o.material === 'wood') { postM.map = tex('wood', 1, 2); }
    const sections = Math.round(L / 2.44); const secW = L / sections; const x0 = -L / 2;
    const gateSec = o.gate ? Math.min(sections - 2, Math.max(1, Math.round((o.gateAt - x0) / secW))) : -1;
    // posts
    for (let i = 0; i <= sections; i++) {
      const x = x0 + i * secW;
      let post;
      if (o.material === 'chainlink') post = add(new T.CylinderGeometry(P.postSize / 2, P.postSize / 2, H + .1, 12), postM, x, (H + .1) / 2, 0);
      else post = add(new T.BoxGeometry(P.postSize, H + .12, P.postSize), postM, x, (H + .12) / 2, 0);
      post.userData.base = post.position.y; R.posts.push(post);
      if (o.material === 'vinyl') { const cap = add(new T.BoxGeometry(P.postSize + .04, .05, P.postSize + .04), postM, x, H + .14, 0); R.posts.push(cap); const cap2 = new T.Mesh(new T.ConeGeometry((P.postSize + .04) * .72, .06, 4), postM); cap2.rotation.y = Math.PI / 4; cap2.position.set(x, H + .19, 0); cap2.castShadow = true; R.group.add(cap2); R.posts.push(cap2); }
      if (o.material === 'aluminum') { const cap = new T.Mesh(new T.ConeGeometry(P.postSize * .8, .06, 4), postM); cap.rotation.y = Math.PI / 4; cap.position.set(x, H + .09, 0); cap.castShadow = true; R.group.add(cap); R.posts.push(cap); }
      if (o.material === 'chainlink') { const cap = add(new T.SphereGeometry(P.postSize / 2 + .01, 10, 8), postM, x, H + .05, 0); R.posts.push(cap); }
    }
    // per-section infill
    for (let s = 0; s < sections; s++) {
      const xa = x0 + s * secW, xb = xa + secW, cx = (xa + xb) / 2, inner = secW - P.postSize;
      const isGate = s === gateSec;
      const target = isGate ? new T.Group() : R.group;
      if (isGate) { target.position.set(xa + P.postSize / 2, 0, 0); R.group.add(target); R.gate = target; }
      const lx = isGate ? inner / 2 + .005 : cx; // local x for gate parts
      if (o.material === 'wood') {
        const railM = std('#9a5a32', { map: tex('wood', 3, .3) });
        const railYs = [.25, H / 2, H - .25];
        railYs.forEach(y => { const r = add(new T.BoxGeometry(inner, .09, .038), railM, lx, y, -.05, target); R.rails.push(r); if (isGate) R.gateParts.push(r); });
        const n = Math.floor((inner - .02) / (P.boardW + P.gap)); const start = lx - ((n - 1) * (P.boardW + P.gap)) / 2;
        for (let b = 0; b < n; b++) {
          const shade = .88 + Math.random() * .24; const bm = new T.MeshStandardMaterial({ color: col(P.color).multiplyScalar(shade), map: tex('wood', 1, 1), roughness: .85 });
          const m = add(new T.BoxGeometry(P.boardW, H - .02, .018), bm, start + b * (P.boardW + P.gap), (H - .02) / 2 + .02, .02, target);
          if (!isGate) m.userData.order = (m.position.x - x0) / L; R.boards.push(m); if (isGate) R.gateParts.push(m);
        }
        if (P.cap) { const c = add(new T.BoxGeometry(inner + (isGate ? 0 : P.postSize), .035, .09), railM, lx, H + .005, 0, target); R.rails.push(c); if (isGate) R.gateParts.push(c); }
        if (o.lattice && !isGate) { const latM = std('#9a5a32'); for (let k = 0; k < 12; k++) { const px = lx - inner / 2 + .1 + k * (inner / 12); const a = add(new T.BoxGeometry(.028, .62, .012), latM, px, H + .3, .01, target); a.rotation.z = .72; a.userData.axis = 'y'; R.rails.push(a); const b2 = add(new T.BoxGeometry(.028, .62, .012), latM, px, H + .3, -.01, target); b2.rotation.z = -.72; b2.userData.axis = 'y'; R.rails.push(b2); } [-1, 1].forEach(sx => { const side = add(new T.BoxGeometry(.04, .55, .05), latM, lx + sx * (inner / 2 - .02), H + .3, 0, target); R.rails.push(side); }); const top = add(new T.BoxGeometry(inner + P.postSize, .035, .09), railM, lx, H + .55, 0, target); R.rails.push(top); }
        if (isGate) { const diag = add(new T.BoxGeometry(.09, Math.hypot(inner, H - .5) - .2, .03), railM, lx, H / 2, -.08, target); diag.rotation.z = Math.atan2(inner, H - .5); diag.userData.axis = 'y'; R.rails.push(diag); R.gateParts.push(diag); }
      }
      if (o.material === 'vinyl') {
        const vm = new T.MeshStandardMaterial({ color: col(P.color), roughness: .55 });
        [.12, H - .12].forEach(y => { const r = add(new T.BoxGeometry(inner, .14, .05), vm, lx, y, 0, target); R.rails.push(r); if (isGate) R.gateParts.push(r); });
        const panelM = new T.MeshStandardMaterial({ color: col(P.color), map: tex('vinyl', inner / .18, 1), roughness: .5 });
        const pnl = add(new T.BoxGeometry(inner, H - .26, .022), panelM, lx, H / 2, 0, target); pnl.userData.order = isGate ? 0 : (pnl.position.x - x0) / L; pnl.userData.panel = true; R.boards.push(pnl); if (isGate) R.gateParts.push(pnl);
      }
      if (o.material === 'aluminum') {
        const am = new T.MeshStandardMaterial({ color: col(P.color), roughness: .4, metalness: .65 });
        const railYs = [.12, H / 2 + .05, H - .12];
        railYs.forEach(y => { const r = add(new T.BoxGeometry(inner, .038, .025), am, lx, y, 0, target); R.rails.push(r); if (isGate) R.gateParts.push(r); });
        const n = Math.floor(inner / P.spacing) - 1; const start = lx - ((n - 1) * P.spacing) / 2;
        for (let b = 0; b < n; b++) {
          const m = add(new T.BoxGeometry(P.picket, H, P.picket), am, start + b * P.spacing, H / 2 + .02, 0, target); if (!isGate) m.userData.order = (m.position.x - x0) / L; R.boards.push(m); if (isGate) R.gateParts.push(m);
          const sp = new T.Mesh(new T.ConeGeometry(P.picket * 1.6, .06, 4), am); sp.rotation.y = Math.PI / 4; sp.position.set(start + b * P.spacing, H + .05, 0); sp.castShadow = true; target.add(sp); sp.userData.order = (sp.position.x - x0) / L; R.boards.push(sp); if (isGate) R.gateParts.push(sp);
        }
      }
      if (o.material === 'chainlink') {
        const gm = new T.MeshStandardMaterial({ color: col(P.color), roughness: .35, metalness: .85 });
        const top = new T.Mesh(new T.CylinderGeometry(.021, .021, inner, 10), gm); top.rotation.z = Math.PI / 2; top.position.set(lx, H - .03, 0); top.castShadow = true; top.userData.axis = 'y'; target.add(top); R.rails.push(top); if (isGate) R.gateParts.push(top);
        if (isGate) { [.05].forEach(y => { const b = new T.Mesh(new T.CylinderGeometry(.021, .021, inner, 10), gm); b.rotation.z = Math.PI / 2; b.position.set(lx, y, 0); b.userData.axis = 'y'; target.add(b); R.rails.push(b); R.gateParts.push(b); });[-1, 1].forEach(sx => { const v = new T.Mesh(new T.CylinderGeometry(.021, .021, H - .06, 10), gm); v.position.set(lx + sx * (inner / 2 - .03), H / 2, 0); v.userData.axis = 'y'; target.add(v); R.rails.push(v); R.gateParts.push(v); }); }
        const meshM = new T.MeshStandardMaterial({ color: col(P.color), map: tex('chain', inner / .075, (H - .08) / .075, false), transparent: true, alphaTest: .35, side: T.DoubleSide, roughness: .4, metalness: .8 });
        const mesh = new T.Mesh(new T.PlaneGeometry(inner, H - .08), meshM); mesh.position.set(lx, (H - .08) / 2 + .03, 0); mesh.castShadow = true; mesh.receiveShadow = true; target.add(mesh); mesh.userData.order = isGate ? 0 : (mesh.position.x - x0) / L; mesh.userData.panel = true; R.boards.push(mesh); if (isGate) R.gateParts.push(mesh);
      }
    }
    // gate hardware
    if (R.gate) { const hw = std('#222', { metalness: .6, roughness: .4 }); const g = R.gate; const inner = secW - P.postSize; [.35, H - .35].forEach(y => { const h = add(new T.BoxGeometry(.05, .08, .07), hw, .03, y, .03, g); R.gateParts.push(h); R.hardware.push(h); }); const latch = add(new T.BoxGeometry(.06, .12, .05), hw, inner - .06, H / 2 + .1, .04, g); R.gateParts.push(latch); R.hardware.push(latch); }
    return R;
  }

  /* ---------- lighting, sky, env ---------- */
  function lights(scene, timeOfDay, shadowSize) {
    const dusk = timeOfDay === 'golden';
    const hemi = new T.HemisphereLight(dusk ? 0xd9c2b8 : 0xbcd7f2, dusk ? 0x4a4030 : 0x5f6f4a, dusk ? .55 : .75); scene.add(hemi);
    const sun = new T.DirectionalLight(dusk ? 0xffb070 : 0xfff0d6, dusk ? 1.9 : 2.3); sun.position.set(dusk ? -14 : -9, dusk ? 5 : 13, dusk ? 10 : 11); sun.castShadow = true;
    sun.shadow.mapSize.set(shadowSize || 2048, shadowSize || 2048); const s = sun.shadow.camera; s.left = s.bottom = -14; s.right = s.top = 14; s.near = 1; s.far = 60; sun.shadow.bias = -.0005; sun.shadow.normalBias = .02; scene.add(sun); scene.add(sun.target);
    scene.add(new T.AmbientLight(0xffffff, .1));
    return { hemi, sun };
  }
  const skyVS = 'varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }';
  const skyFS = 'uniform vec3 top,hor,gnd,sunDir,sunCol; varying vec3 vP; void main(){ vec3 d=normalize(vP); float h=d.y; vec3 c=mix(hor,top,smoothstep(0.0,0.4,h)); c=mix(gnd,c,smoothstep(-0.05,0.01,h)); float s=max(dot(d,sunDir),0.0); c+=sunCol*(pow(s,1200.0)*2.0+pow(s,40.0)*0.35+pow(s,6.0)*0.1); gl_FragColor=vec4(c,1.0);\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}';
  function sky(scene, timeOfDay, sunPos) {
    const dusk = timeOfDay === 'golden';
    const u = { top: { value: col(dusk ? '#4a5a8c' : '#3a80d8') }, hor: { value: col(dusk ? '#f3b27e' : '#cfe3f5') }, gnd: { value: col('#6b8a5a') }, sunDir: { value: sunPos.clone().normalize() }, sunCol: { value: col(dusk ? '#ffb070' : '#fff6e0') } };
    const m = new T.Mesh(new T.SphereGeometry(100, 32, 16), new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, uniforms: u, vertexShader: skyVS, fragmentShader: skyFS })); scene.add(m);
    scene.fog = new T.Fog(dusk ? 0xe9b48a : 0xd4e4f2, 40, 120);
    const ct = tex('cloud', 1, 1, true); ct.wrapS = ct.wrapT = T.ClampToEdgeWrapping; const clouds = [];
    for (let i = 0; i < 6; i++) { const s = new T.Sprite(new T.SpriteMaterial({ map: ct, transparent: true, opacity: .85, depthWrite: false })); const sc = 10 + Math.random() * 8; s.scale.set(sc, sc * .5, 1); s.position.set(-40 + Math.random() * 80, 14 + Math.random() * 8, -45 - Math.random() * 20); s.userData.v = .003 + Math.random() * .004; scene.add(s); clouds.push(s); }
    return { mesh: m, clouds };
  }
  function env(renderer) {
    const pm = new T.PMREMGenerator(renderer); const s = new T.Scene();
    const m = new T.Mesh(new T.SphereGeometry(50, 24, 12), new T.ShaderMaterial({ side: T.BackSide, uniforms: { top: { value: col('#3f7fcf') }, hor: { value: col('#dce8f3') }, gnd: { value: col('#57704a') } }, vertexShader: skyVS, fragmentShader: 'uniform vec3 top,hor,gnd; varying vec3 vP; void main(){ float h=normalize(vP).y; vec3 c=mix(hor,top,smoothstep(0.0,0.6,h)); c=mix(gnd,c,smoothstep(-0.05,0.03,h)); gl_FragColor=vec4(c,1.0);\n#include <encodings_fragment>\n}' })); s.add(m);
    const sun = new T.Mesh(new T.SphereGeometry(2.5, 12, 8), new T.MeshBasicMaterial({ color: new T.Color(9, 8, 6.5) })); sun.position.set(-18, 24, 10); s.add(sun);
    const t = pm.fromScene(s, .04).texture; pm.dispose(); return t;
  }
  function renderer(canvas, dpr) { const r = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); r.setPixelRatio(Math.min(global.devicePixelRatio || 1, dpr || 2)); r.shadowMap.enabled = true; r.shadowMap.type = T.PCFSoftShadowMap; r.outputEncoding = T.sRGBEncoding; r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 1.05; r.setClearColor(0, 0); return r; }

  /* camera presets (position, lookAt) */
  const CAMS = {
    viz: { pos: [2.3, 1.45, 5.3], look: [0.45, 1.0, 0], fov: 40 },
    hero: { pos: [3.0, 1.6, 6.4], look: [0.2, 1.0, 0], fov: 38 },
    gallery1: { pos: [-3.5, 1.4, 5.5], look: [0.5, 1.0, 0], fov: 40 },
    gallery2: { pos: [5.5, 2.4, 4.8], look: [-1, .9, 0], fov: 40 },
    gallery3: { pos: [0.8, 1.2, 4.6], look: [0.8, 1.0, 0], fov: 42 },
    gallery4: { pos: [-5.5, 2.6, 7.5], look: [1.5, .8, -1], fov: 38 }
  };

  function dispose(group) { group.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose()); }); if (group.parent) group.parent.remove(group); }
  global.Fence3D = { build, lights, sky, env, renderer, tex, col, PRESETS, CAMS, dispose };
})(window);
