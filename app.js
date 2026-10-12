/* Fence template app. Reads window.SITE (site.config.js). No backend, no APIs. */
(function () {
  const S = window.SITE, B = S.business, $ = id => document.getElementById(id);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = matchMedia('(max-width: 820px)').matches || /Mobi|Android/i.test(navigator.userAgent);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const telHref = 'tel:+' + B.phoneE164, waBase = 'https://wa.me/' + B.whatsapp;
  const get = path => path.split('.').reduce((o, k) => (o == null ? o : o[k]), S);

  /* ---------- theme ---------- */
  (function theme() {
    const hex2hsl = h => { const n = parseInt(h.slice(1), 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b); let hh = 0, s = 0; const l = (mx + mn) / 2; if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); hh = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; hh *= 60; } return [hh, s * 100, l * 100]; };
    const hsl = (h, s, l) => `hsl(${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%)`;
    const r = document.documentElement.style, [bh, bs, bl] = hex2hsl(S.theme.brand), [ah, as, al] = hex2hsl(S.theme.accent);
    r.setProperty('--brand', S.theme.brand); r.setProperty('--brand-2', hsl(bh, bs, Math.max(6, bl - 7))); r.setProperty('--brand-3', hsl(bh, bs, Math.min(60, bl + 10)));
    r.setProperty('--accent', S.theme.accent); r.setProperty('--accent-2', hsl(ah, as, Math.min(75, al + 9))); r.setProperty('--accent-soft', hsl(ah, Math.min(100, as + 10), 93));
    r.setProperty('--paper', S.theme.paper);
    const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = S.theme.brand;
  })();

  /* ---------- text bindings ---------- */
  const computed = {
    title: `${B.name} · Fence Installation in ${B.city}, ${B.state}`,
    description: `${B.name}: wood, vinyl, aluminum and chain-link fence installation in ${B.city}, ${B.baseTown} and Central ${B.stateLong}. ${S.proof.rating}★ on ${S.proof.platform} (${S.proof.reviewCount} reviews). Free estimates.`,
    ogtitle: `${B.name} · ${B.tagline}`, ogdesc: S.hero.sub, brand: '#top', name: B.name, phone: B.phone, tel: telHref, waLink: waBase,
    reviewUrl: S.proof.reviewUrl, proofLine: `${S.proof.rating} · ${S.proof.reviewCount} ${S.proof.platform} reviews`, owner: B.owner, hours: B.hours, stateLong: B.stateLong,
    heroFallback: (S.visualizer.materials.find(m => m.id === S.hero.material) || S.visualizer.materials[0]).image, reviewCta: `Read all ${S.proof.reviewCount} reviews`
  };
  document.querySelectorAll('[data-bind]').forEach(el => {
    const k = el.dataset.bind; const v = computed[k] !== undefined ? computed[k] : get(k); if (v === undefined || v === null) return;
    if (el.tagName === 'META') el.content = v; else if (el.tagName === 'TITLE') el.textContent = v;
    else if (el.tagName === 'IMG') el.src = v;
    else if (el.tagName === 'A' && /^(tel|waLink|reviewUrl|brand)$/.test(k)) { el.href = v; if (el.dataset.bindText) el.textContent = computed[el.dataset.bindText]; }
    else el.textContent = v;
  });
  // headline with highlighted phrase
  (function () { const h = S.hero.headline, p = S.hero.highlight; const i = p ? h.toLowerCase().indexOf(p.toLowerCase()) : -1; $('h1').innerHTML = i < 0 ? esc(h) : esc(h.slice(0, i)) + '<em>' + esc(h.slice(i, i + p.length)) + '</em>' + esc(h.slice(i + p.length)); })();
  $('year').textContent = new Date().getFullYear();

  /* ---------- sections from config ---------- */
  $('stats').innerHTML = S.promise.stats.map(s => `<div><b>${esc(s.value)}<small>${esc(s.suffix)}</small></b><span>${esc(s.label)}</span></div>`).join('');
  $('stepsGrid').innerHTML = S.steps.items.map((s, i) => `<div class="step rv"><div class="n">${i + 1}</div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join('');
  $('revGrid').innerHTML = S.reviews.items.map(r => `<div class="card rv"><div class="stars">${'★'.repeat(r.stars || 5)}</div><p>${esc(r.text)}</p><div class="who"><i>${esc(r.name.split(' ').map(w => w[0]).join('').slice(0, 2))}</i><div><b>${esc(r.name)}</b><span>${esc(r.town)}</span></div></div></div>`).join('');
  const ICONS = {
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 5-5"/></svg>',
    tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7" cy="7" r="1.5"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z"/></svg>',
    wood: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V8l2-3 2 3v13M15 21V8l2-3 2 3v13M3 12h18M3 17h18"/></svg>',
    vinyl: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="14" rx="1"/><path d="M8 6v14M13 6v14M18 6v14M3 11h18"/></svg>',
    aluminum: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V6l1-2 1 2v15M10 21V6l1-2 1 2v15M16 21V6l1-2 1 2v15M22 21V8M2 10h20M2 16h20"/></svg>',
    chainlink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V5M20 21V5M4 5h16M4 9l4 4-4 4M12 5l4 4-4 4 4 4M8 13l4-4 4 4-4 4z"/></svg>'
  };
  $('badgeGrid').innerHTML = S.badges.map(b => `<div class="badge rv"><i>${ICONS[b.icon] || ICONS.check}</i><div><b>${esc(b.title)}</b><span>${esc(b.text)}</span></div></div>`).join('');
  $('areas').innerHTML = B.serviceAreas.map(a => `<span>${esc(a)}</span>`).join('');
  $('footLinks').innerHTML = (S.footer.links || []).map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener" style="margin-right:14px">${esc(l.label)}</a>`).join('');
  const mapsLink = 'https://www.google.com/maps/search/' + encodeURIComponent(B.mapQuery);
  $('map').innerHTML = B.mapEmbed ? `<iframe title="Map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${encodeURIComponent(B.mapQuery)}&output=embed"></iframe>` : `<div class="noframe"><div>Serving ${esc(B.city)}, ${esc(B.baseTown)} and Central ${esc(B.stateLong)}<br><a href="${mapsLink}" target="_blank" rel="noopener">Open in Google Maps</a></div></div>`;

  /* ---------- gallery ---------- */
  const matName = id => (S.visualizer.materials.find(m => m.id === id) || {}).name || id;
  const tags = ['all', ...new Set(S.gallery.items.map(g => g.tag))];
  $('galChips').innerHTML = tags.map(t => `<button type="button" class="chip" data-tag="${esc(t)}" aria-pressed="${t === 'all'}">${t === 'all' ? 'All' : esc(matName(t))}</button>`).join('');
  $('galGrid').innerHTML = S.gallery.items.map((g, i) => `<figure data-tag="${esc(g.tag)}" data-i="${i}" class="rv"><img src="${esc(g.src)}" alt="${esc(g.caption)}" loading="lazy"><span class="tag">${esc(matName(g.tag))}</span><figcaption>${esc(g.caption)}</figcaption></figure>`).join('');
  $('galChips').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; $('galChips').querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(c === b))); const t = b.dataset.tag; $('galGrid').querySelectorAll('figure').forEach(f => f.classList.toggle('hide', t !== 'all' && f.dataset.tag !== t)); });
  const lb = $('lightbox');
  $('galGrid').addEventListener('click', e => { const f = e.target.closest('figure'); if (!f) return; const g = S.gallery.items[+f.dataset.i]; lb.querySelector('img').src = g.src; lb.querySelector('.cap').textContent = g.caption; lb.classList.add('on'); });
  lb.addEventListener('click', e => { if (e.target === lb || e.target.tagName === 'BUTTON') lb.classList.remove('on'); });
  addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('on'); });

  /* ---------- material visualizer (state carries into the form) ---------- */
  const M = S.visualizer.materials; const state = { material: S.hero.material || M[0].id };
  const stage = $('vizStage');
  M.forEach(m => { const img = document.createElement('img'); img.src = m.image; img.alt = m.title; img.dataset.id = m.id; img.decoding = 'async'; stage.insertBefore(img, stage.firstChild); });
  $('vizTabs').innerHTML = M.map(m => `<button type="button" role="tab" data-id="${esc(m.id)}" aria-pressed="false"><i>${ICONS[m.id] || ICONS.wood}</i>${esc(m.name)}</button>`).join('');
  $('fMaterial').innerHTML = M.map(m => `<option value="${esc(m.id)}">${esc(m.name)} (${esc(m.title)})</option>`).join('');
  function setMaterial(id, source) {
    const m = M.find(x => x.id === id); if (!m) return; state.material = id;
    stage.querySelectorAll('img').forEach(i => i.classList.toggle('on', i.dataset.id === id));
    $('vizLabel').textContent = m.title;
    $('vizTabs').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === id)));
    $('vizInfo').innerHTML = `<div class="eyebrow">${esc(m.name)}</div><h3>${esc(m.title)}</h3><p>${esc(m.blurb)}</p><dl><dt>Best for</dt><dd>${esc(m.bestFor)}</dd><dt>Lifespan</dt><dd>${esc(m.lifespan)}</dd><dt>Upkeep</dt><dd>${esc(m.upkeep)}</dd><dt>Relative cost</dt><dd><span class="cost">${[1, 2, 3].map(n => `<i class="${n <= m.cost ? 'on' : ''}"></i>`).join('')}</span></dd></dl><a class="btn primary" href="#estimate">Get a ${esc(m.name.toLowerCase())} fence estimate</a><div class="viz-note">${ICONS.check}<span>Your choice is attached to the estimate form automatically.</span></div>`;
    if (source !== 'form') $('fMaterial').value = id;
    const pick = $('pick'); pick.querySelector('img').src = m.image; pick.querySelector('b').textContent = m.title;
    $('submitWa').textContent = `${S.form.submitLabel} · ${m.name}`;
    $('heroPickOpts').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === id)));
    if (window.__heroMaterial) window.__heroMaterial(id);
  }
  $('heroPickOpts').innerHTML = M.map(m => `<button type="button" data-id="${esc(m.id)}" aria-pressed="false">${esc(m.name)}</button>`).join('');
  $('heroPickOpts').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setMaterial(b.dataset.id, 'hero'); });
  $('vizTabs').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setMaterial(b.dataset.id, 'tabs'); });
  $('fMaterial').addEventListener('change', e => setMaterial(e.target.value, 'form'));
  setMaterial(state.material, 'init');

  /* ---------- lead form: WhatsApp + mailto, no backend ---------- */
  $('fLength').innerHTML = S.form.lengthOptions.map(o => `<option>${esc(o)}</option>`).join('');
  const mailBtn = $('submitMail'); if (B.email) { mailBtn.hidden = false; mailBtn.textContent = S.form.emailLabel; }
  function compose() {
    const m = M.find(x => x.id === state.material) || {}; const v = id => $(id).value.trim();
    return [`New fence estimate request`, `Name: ${v('fName')}`, `Phone: ${v('fPhone')}`, v('fCity') ? `Location: ${v('fCity')}` : null, `Material: ${m.name} (${m.title})`, `Length: ${v('fLength')}`, v('fMsg') ? `Notes: ${v('fMsg')}` : null, `Sent from the ${B.name} website`].filter(Boolean).join('\n');
  }
  function valid() { const n = $('fName'), p = $('fPhone'); [n, p].forEach(i => i.style.outline = ''); if (!n.value.trim()) { n.focus(); n.style.outline = '2px solid #d33'; return false; } if (p.value.replace(/\D/g, '').length < 7) { p.focus(); p.style.outline = '2px solid #d33'; return false; } if (document.querySelector('.hp').value) return false; return true; }
  function openLink(href) { const a = document.createElement('a'); a.href = href; a.target = '_blank'; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove(); }
  function done(channel, href, text) {
    const s = $('sent'); s.innerHTML = `<b>${channel === 'wa' ? 'WhatsApp is opening with your request.' : 'Your email app is opening.'}</b>If nothing opened, <a href="${esc(href)}" target="_blank" rel="noopener">tap here</a> or call <a href="${telHref}">${esc(B.phone)}</a>.<code>${esc(text)}</code><div class="form-actions" style="margin-top:10px"><button type="button" class="btn ghost" id="copyMsg">Copy message</button></div>`;
    s.classList.add('on'); s.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
    $('copyMsg').addEventListener('click', () => { const b = $('copyMsg'); try { navigator.clipboard.writeText(text).then(() => { b.textContent = 'Copied'; }).catch(() => { b.textContent = 'Select the text above'; }); } catch (e) { b.textContent = 'Select the text above'; } });
  }
  $('leadForm').addEventListener('submit', e => { e.preventDefault(); if (!valid()) return; const text = compose(); const href = `${waBase}?text=${encodeURIComponent(text)}`; openLink(href); done('wa', href, text); });
  mailBtn.addEventListener('click', () => { if (!valid()) return; const text = compose(); const href = `mailto:${B.email}?subject=${encodeURIComponent('Fence estimate request from ' + $('fName').value.trim())}&body=${encodeURIComponent(text)}`; location.href = href; done('mail', href, text); });

  /* ---------- nav, reveals ---------- */
  const nav = $('nav'); const navCheck = () => nav.classList.toggle('solid', scrollY > 40); addEventListener('scroll', navCheck, { passive: true }); navCheck();
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));

  /* ---------- hero: scroll-built 3D fence ---------- */
  (function hero() {
    const sec = $('hero'), canvas = $('heroCanvas'), F = window.Fence3D;
    if (!window.THREE || !F || !window.gsap) { sec.classList.add('nogl'); return; }
    let r; try { r = F.renderer(canvas, isMobile ? 1.5 : 2); } catch (e) { sec.classList.add('nogl'); return; }
    const T = THREE, scene = new T.Scene(); scene.environment = F.env(r);
    const L = F.lights(scene, 'day', isMobile ? 1024 : 2048); const sky = F.sky(scene, 'day', L.sun.position);
    const cam = new T.PerspectiveCamera(38, 1, .1, 200); const cp = F.CAMS.hero;
    const camS = { x: cp.pos[0] + .8, y: cp.pos[1] + .5, z: cp.pos[2] + 1.6, lx: cp.look[0], ly: isMobile ? 2.6 : cp.look[1], off: isMobile ? 0 : 1.6 };
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }; if (!isMobile) addEventListener('pointermove', e => { mouse.tx = e.clientX / innerWidth - .5; mouse.ty = e.clientY / innerHeight - .5; });
    gsap.registerPlugin(ScrollTrigger);
    const ST = { trigger: '#hero', start: 'top top', end: 'bottom bottom', scrub: reduce ? false : .8 };
    // yard + camera + plants live in a base timeline that never changes
    const yard = F.build(scene, { material: 'wood', gate: false, length: 14, yard: true }); F.dispose(yard.group);
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', immediateRender: true }, scrollTrigger: Object.assign({}, ST) });
    yard.plants.forEach((m, i) => { const sy = m.scale.y; tl.fromTo(m.scale, { x: .001, y: .001, z: .001 }, { x: 1, y: sy, z: 1, duration: .4, ease: 'back.out(1.6)', immediateRender: true }, 3.0 + (i % 12) * .05); });
    tl.to(camS, { x: cp.pos[0], y: cp.pos[1], z: cp.pos[2], duration: 4, ease: 'power1.inOut' }, 0);
    // the fence itself is rebuilt whenever the visitor picks a material
    let Y = null, tlF = null; const L2 = 14;
    function buildFence(id) {
      if (tlF) { tlF.scrollTrigger && tlF.scrollTrigger.kill(); tlF.kill(); tlF = null; }
      if (Y) { F.dispose(Y.group); Y = null; }
      Y = F.build(scene, { material: id, gate: true, yard: false });
      tlF = gsap.timeline({ defaults: { ease: 'power3.out', immediateRender: true }, scrollTrigger: Object.assign({}, ST) });
      const ft = (t, from, to, pos) => tlF.fromTo(t, from, Object.assign({ immediateRender: true }, to), pos);
      Y.posts.forEach(p => { const o = (p.position.x + L2 / 2) / L2, t0 = 0.05 + o * .55; ft(p.scale, { x: .001, y: .001, z: .001 }, { x: 1, y: 1, z: 1, duration: .02, ease: 'none' }, t0); ft(p.position, { y: p.position.y + 2.6 }, { y: p.position.y, duration: .45, ease: 'bounce.out' }, t0); });
      Y.rails.forEach((m, i) => { const o = Math.max(0, Math.min(1, (m.position.x + L2 / 2) / L2)), ax = m.userData.axis || 'x', t0 = 1.0 + o * .6 + (i % 3) * .05; const others = ['x', 'y', 'z'].filter(k => k !== ax); ft(m.scale, { [others[0]]: .001, [others[1]]: .001 }, { [others[0]]: 1, [others[1]]: 1, duration: .02, ease: 'none' }, t0); ft(m.scale, { [ax]: .001 }, { [ax]: 1, duration: .35, ease: 'power2.out' }, t0); });
      Y.boards.forEach(m => { const o = m.userData.order || 0; if (m.userData.panel) { const t0 = 2.0 + o * .7; ft(m.scale, { y: .001, z: .001 }, { y: 1, z: 1, duration: .02, ease: 'none' }, t0); ft(m.scale, { x: .001 }, { x: 1, duration: .5, ease: 'power2.out' }, t0); } else { const t0 = 2.0 + o * .75; ft(m.scale, { x: .001, z: .001 }, { x: 1, z: 1, duration: .02, ease: 'none' }, t0); ft(m.scale, { y: .001 }, { y: 1, duration: .25, ease: 'back.out(1.4)' }, t0); } });
      if (Y.gate) ft(Y.gate.rotation, { y: -1.15 }, { y: 0, duration: .7, ease: 'power2.inOut' }, 3.1);
      Y.hardware.forEach(h => ft(h.scale, { x: .001, y: .001, z: .001 }, { x: 1, y: 1, z: 1, duration: .2, ease: 'back.out(1.5)' }, 3.0));
      tlF.to({}, { duration: .1 }, 3.9);
      if (reduce) tlF.progress(1);
    }
    let heroMat = null; window.__heroMaterial = id => { if (id === heroMat || !F.PRESETS[id]) return; heroMat = id; buildFence(id); };
    window.__heroMaterial(state.material);
    const stageEls = [...document.querySelectorAll('#buildStage div')]; let last = -1;
    const setStage = s => { if (s === last) return; last = s; stageEls.forEach((el, i) => { el.classList.toggle('on', i === s); el.classList.toggle('done', i < s); }); };
    let fit = 1; const size = () => { const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return; r.setSize(w, h, false); cam.aspect = w / h; cam.fov = w / h < 1 ? 60 : 38; cam.updateProjectionMatrix(); const hf = 2 * Math.atan(Math.tan(cam.fov * Math.PI / 360) * cam.aspect); fit = Math.max(1, Math.min(isMobile ? 1.2 : 1.6, 9 / (2 * Math.tan(hf / 2)) / 6.5)); };
    size(); new ResizeObserver(size).observe(canvas.parentElement);
    let vis = true; new IntersectionObserver(e => { vis = e[0].isIntersecting; }).observe(sec);
    let lastT = 0;
    function frame(now) {
      requestAnimationFrame(frame); if (!vis || now - lastT < 15) return; lastT = now;
      setStage(Math.min(3, Math.floor(tl.progress() * 4)));
      mouse.x += (mouse.tx - mouse.x) * .05; mouse.y += (mouse.ty - mouse.y) * .05;
      const dx = camS.x - camS.lx, dz = camS.z, len = Math.hypot(dx, dz), k = fit;
      cam.position.set(camS.lx + dx * k + mouse.x * .6, camS.y + mouse.y * -.3 + (reduce ? 0 : Math.sin(now / 3000) * .03), dz * k);
      // shift the look target so the fence sits right of the headline on desktop
      const rx = dz / len, rz = -dx / len; cam.lookAt(camS.lx - rx * camS.off, camS.ly, -rz * camS.off);
      if (!reduce) sky.clouds.forEach(c => { c.position.x += c.userData.v; if (c.position.x > 50) c.position.x = -50; });
      r.render(scene, cam);
    }
    requestAnimationFrame(frame);
    if (reduce) tl.progress(1);
    canvas.addEventListener('webglcontextlost', () => sec.classList.add('nogl'));
  })();

  /* smooth anchor scrolling that respects the fixed nav */
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const id = a.getAttribute('href'); if (id === '#' || id === '#top') { e.preventDefault(); scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); return; } const el = document.querySelector(id); if (!el) return; e.preventDefault(); const y = el.getBoundingClientRect().top + scrollY - 60; scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' }); }));
})();
