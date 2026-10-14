/* Fence template · After Dark. Reads window.SITE (site.config.js). No backend, no APIs.
   One night-time 3D yard sits behind the whole page; scrolling moves the camera between
   staged viewpoints (one per section) and the fence rebuilds in whatever material the visitor picks. */
(function () {
  const S = window.SITE, B = S.business, $ = id => document.getElementById(id);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = matchMedia('(max-width: 820px)').matches || /Mobi|Android/i.test(navigator.userAgent);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const telHref = 'tel:+' + B.phoneE164, waBase = 'https://wa.me/' + B.whatsapp;
  const get = path => path.split('.').reduce((o, k) => (o == null ? o : o[k]), S);

  /* ---------- theme ---------- */
  (function theme() {
    const rgb = h => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
    const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
    const css = c => `rgb(${c.join(',')})`;
    const r = document.documentElement.style, t = S.theme || {};
    const bg = rgb(t.bg || '#070b14'), ac = rgb(t.accent || '#f5b544');
    r.setProperty('--bg', css(bg)); r.setProperty('--bg-2', css(mix(bg, [255, 255, 255], .04)));
    r.setProperty('--glass', `rgba(${mix(bg, [255, 255, 255], .05).join(',')},.62)`); r.setProperty('--glass-2', `rgba(${mix(bg, [255, 255, 255], .05).join(',')},.84)`);
    r.setProperty('--accent', css(ac)); r.setProperty('--accent-2', css(mix(ac, [255, 255, 255], .35))); r.setProperty('--accent-soft', `rgba(${ac.join(',')},.14)`);
    if (t.ember) r.setProperty('--ember', t.ember); if (t.moon) r.setProperty('--moon', t.moon);
    const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = t.bg || '#070b14';
  })();

  /* ---------- text bindings ---------- */
  const M = S.visualizer.materials;
  const computed = {
    title: `${B.name} · Fence Installation in ${B.city}, ${B.state}`,
    description: `${B.name}: wood, vinyl, aluminum and chain-link fence installation in ${B.city}, ${B.baseTown} and Central ${B.stateLong}. ${S.proof.rating}★ on ${S.proof.platform} (${S.proof.reviewCount} reviews). Free estimates.`,
    ogtitle: `${B.name} · ${B.tagline}`, ogdesc: S.hero.sub, brand: '#top', name: B.name, phone: B.phone, tel: telHref, waLink: waBase,
    reviewUrl: S.proof.reviewUrl, proofLine: `${S.proof.rating} · ${S.proof.reviewCount} ${S.proof.platform} reviews`, owner: B.owner, hours: B.hours, stateLong: B.stateLong,
    sceneFallback: S.hero.background || (M.find(m => m.id === S.hero.material) || M[0]).image, reviewCta: `Read all ${S.proof.reviewCount} reviews`
  };
  document.querySelectorAll('[data-bind]').forEach(el => {
    const k = el.dataset.bind; const v = computed[k] !== undefined ? computed[k] : get(k); if (v === undefined || v === null) return;
    if (el.tagName === 'META') el.content = v; else if (el.tagName === 'TITLE') el.textContent = v;
    else if (el.tagName === 'IMG') el.src = v;
    else if (el.tagName === 'A' && /^(tel|waLink|reviewUrl|brand)$/.test(k)) { el.href = v; if (el.dataset.bindText) el.textContent = computed[el.dataset.bindText]; }
    else el.textContent = v;
  });
  (function () { const h = S.hero.headline, p = S.hero.highlight; const i = p ? h.toLowerCase().indexOf(p.toLowerCase()) : -1; $('h1').innerHTML = i < 0 ? esc(h) : esc(h.slice(0, i)) + '<em>' + esc(h.slice(i, i + p.length)) + '</em>' + esc(h.slice(i + p.length)); })();
  $('year').textContent = new Date().getFullYear();

  /* ---------- icons ---------- */
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

  /* ---------- sections from config ---------- */
  $('stats').innerHTML = S.promise.stats.map(s => `<div><b>${esc(s.value)}<small>${esc(s.suffix)}</small></b><span>${esc(s.label)}</span></div>`).join('');
  $('specList').innerHTML = ((S.promise.cutaway || {}).points || []).map((t, i) => `<li style="transition-delay:${i * 90}ms"><i>0${i + 1}</i><span>${esc(t)}</span></li>`).join('');
  $('stepsGrid').innerHTML = S.steps.items.map((s, i) => `<div class="step panel rv" style="transition-delay:${i * 120}ms"><div class="n">0${i + 1}</div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p><span class="k">Step 0${i + 1} of 0${S.steps.items.length}</span></div>`).join('');
  $('revStrip').innerHTML = S.reviews.items.map(r => `<article class="rcard panel"><div class="stars">${'★'.repeat(r.stars || 5)}</div><p>${esc(r.text)}</p><div class="who"><i>${esc(r.name.split(' ').map(w => w[0]).join('').slice(0, 2))}</i><div><b>${esc(r.name)}</b><span>${esc(r.town)}</span></div></div></article>`).join('');
  $('badgeGrid').innerHTML = S.badges.map((b, i) => `<div class="badge rv" style="transition-delay:${i * 80}ms"><i>${ICONS[b.icon] || ICONS.check}</i><div><b>${esc(b.title)}</b><span>${esc(b.text)}</span></div></div>`).join('');
  $('areas').innerHTML = B.serviceAreas.map(a => `<span>${esc(a)}</span>`).join('');
  $('footLinks').innerHTML = (S.footer.links || []).map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('');
  const mapsLink = 'https://www.google.com/maps/search/' + encodeURIComponent(B.mapQuery);
  $('map').innerHTML = B.mapEmbed ? `<iframe title="Map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${encodeURIComponent(B.mapQuery)}&output=embed"></iframe>` : `<div class="noframe"><div>Serving ${esc(B.city)}, ${esc(B.baseTown)} and Central ${esc(B.stateLong)}<br><a href="${mapsLink}" target="_blank" rel="noopener">Open in Google Maps</a></div></div>`;
  const SECS = [...document.querySelectorAll('[data-cam]')];
  $('rail').innerHTML = SECS.filter(s => s.dataset.label).map(s => `<a href="#${s.id}"><span>${esc(s.dataset.label)}</span><i></i></a>`).join('');

  /* ---------- gallery ---------- */
  const matName = id => (M.find(m => m.id === id) || {}).name || id;
  const tags = ['all', ...new Set(S.gallery.items.map(g => g.tag))];
  $('galChips').innerHTML = tags.map(t => `<button type="button" class="chip" data-tag="${esc(t)}" aria-pressed="${t === 'all'}">${t === 'all' ? 'All' : esc(matName(t))}</button>`).join('');
  $('galGrid').innerHTML = S.gallery.items.map((g, i) => `<figure data-tag="${esc(g.tag)}" data-i="${i}" class="rv" style="transition-delay:${(i % 4) * 70}ms"><img src="${esc(g.src)}" alt="${esc(g.caption)}" loading="lazy"><span class="tag">${esc(matName(g.tag))}</span><figcaption>${esc(g.caption)}</figcaption></figure>`).join('');
  $('galChips').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; $('galChips').querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(c === b))); const t = b.dataset.tag; $('galGrid').querySelectorAll('figure').forEach(f => f.classList.toggle('hide', t !== 'all' && f.dataset.tag !== t)); });
  const lb = $('lightbox');
  $('galGrid').addEventListener('click', e => { const f = e.target.closest('figure'); if (!f) return; const g = S.gallery.items[+f.dataset.i]; lb.querySelector('img').src = g.src; lb.querySelector('.cap').textContent = g.caption; lb.classList.add('on'); });
  lb.addEventListener('click', e => { if (e.target === lb || e.target.tagName === 'BUTTON') lb.classList.remove('on'); });
  addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('on'); });

  /* ---------- reviews: scroll-snap strip ---------- */
  (function strip() {
    const strip = $('revStrip'), cards = [...strip.children], n = cards.length; if (!n) return; let cur = 0, timer = null, touched = 0;
    $('revDots').innerHTML = cards.map((_, i) => `<button type="button" aria-label="Review ${i + 1}" aria-pressed="${i === 0}"></button>`).join('');
    const mark = i => { cur = i; cards.forEach((c, k) => c.classList.toggle('active', k === i)); $('revDots').querySelectorAll('button').forEach((b, k) => b.setAttribute('aria-pressed', String(k === i))); };
    const go = i => { i = (i + n) % n; cards[i].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest', inline: 'center' }); mark(i); };
    const io = new IntersectionObserver(es => { es.forEach(x => { if (x.isIntersecting && x.intersectionRatio > .6) mark(cards.indexOf(x.target)); }); }, { root: strip, threshold: [.6] });
    cards.forEach(c => io.observe(c));
    $('revDots').addEventListener('click', e => { const i = [...$('revDots').children].indexOf(e.target); if (i >= 0) { go(i); touched = Date.now(); } });
    strip.addEventListener('pointerdown', () => { touched = Date.now(); }, { passive: true });
    strip.addEventListener('wheel', () => { touched = Date.now(); }, { passive: true });
    if (!reduce) timer = setInterval(() => { if (Date.now() - touched < 8000) return; const r = strip.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; go(cur + 1); }, 5000);
    mark(0);
  })();

  /* ---------- material visualizer (state carries into the form and the 3D scene) ---------- */
  const state = { material: M.some(m => m.id === S.hero.material) ? S.hero.material : M[0].id };
  const frame = $('vizFrame'), vizSec = $('visualizer');
  M.forEach(m => { const img = document.createElement('img'); img.src = m.image; img.alt = m.title; img.dataset.id = m.id; img.decoding = 'async'; img.loading = 'lazy'; frame.insertBefore(img, frame.firstChild); });
  $('vizTabs').innerHTML = M.map(m => `<button type="button" role="tab" data-id="${esc(m.id)}" aria-pressed="false"><i>${ICONS[m.id] || ICONS.wood}</i><div><b>${esc(m.name)}</b><span>${esc(m.bestFor)}</span></div></button>`).join('');
  $('heroPickOpts').innerHTML = M.map(m => `<button type="button" data-id="${esc(m.id)}" aria-pressed="false">${esc(m.name)}</button>`).join('');
  $('fMaterial').innerHTML = M.map(m => `<option value="${esc(m.id)}">${esc(m.name)} (${esc(m.title)})</option>`).join('');
  vizSec.classList.add(S.visualizer.enable3d ? 'live' : 'photo'); if (!S.visualizer.enable3d) vizSec.classList.add('nogl');
  $('vizMode').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $('vizMode').querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); const photo = b.dataset.v === 'photo'; vizSec.classList.toggle('photo', photo); vizSec.classList.toggle('live', !photo); });
  function setMaterial(id, source) {
    const m = M.find(x => x.id === id); if (!m) return; state.material = id;
    frame.querySelectorAll('img').forEach(i => i.classList.toggle('on', i.dataset.id === id));
    $('vizLabel').textContent = m.title;
    $('vizTabs').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === id)));
    $('heroPickOpts').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === id)));
    $('vizInfo').innerHTML = `<div class="eyebrow">${esc(m.name)}</div><h3>${esc(m.title)}</h3><p>${esc(m.blurb)}</p><dl><dt>Best for</dt><dd>${esc(m.bestFor)}</dd><dt>Lifespan</dt><dd>${esc(m.lifespan)}</dd><dt>Upkeep</dt><dd>${esc(m.upkeep)}</dd><dt>Cost</dt><dd><span class="cost">${[1, 2, 3].map(n => `<i class="${n <= m.cost ? 'on' : ''}"></i>`).join('')}</span></dd></dl><a class="btn primary" href="#estimate">Get a ${esc(m.name.toLowerCase())} fence estimate</a><div class="viz-note">${ICONS.check}<span>Your choice is attached to the estimate form automatically.</span></div>`;
    if (source !== 'form') $('fMaterial').value = id;
    const pick = $('pick'); pick.querySelector('img').src = m.image; pick.querySelector('b').textContent = m.title;
    $('submitWa').textContent = `${S.form.submitLabel} · ${m.name}`;
    if (window.__sceneMaterial) window.__sceneMaterial(id);
  }
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
  function valid() { const n = $('fName'), p = $('fPhone'); [n, p].forEach(i => i.style.outline = ''); if (!n.value.trim()) { n.focus(); n.style.outline = '2px solid #ff5d5d'; return false; } if (p.value.replace(/\D/g, '').length < 7) { p.focus(); p.style.outline = '2px solid #ff5d5d'; return false; } if (document.querySelector('.hp').value) return false; return true; }
  function openLink(href) { const a = document.createElement('a'); a.href = href; a.target = '_blank'; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove(); }
  function done(channel, href, text) {
    const s = $('sent'); s.innerHTML = `<b>${channel === 'wa' ? 'WhatsApp is opening with your request.' : 'Your email app is opening.'}</b>If nothing opened, <a href="${esc(href)}" target="_blank" rel="noopener">tap here</a> or call <a href="${telHref}">${esc(B.phone)}</a>.<code>${esc(text)}</code><div class="form-actions" style="margin-top:10px"><button type="button" class="btn ghost" id="copyMsg">Copy message</button></div>`;
    s.classList.add('on'); s.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
    $('copyMsg').addEventListener('click', () => { const b = $('copyMsg'); try { navigator.clipboard.writeText(text).then(() => { b.textContent = 'Copied'; }).catch(() => { b.textContent = 'Select the text above'; }); } catch (e) { b.textContent = 'Select the text above'; } });
  }
  $('leadForm').addEventListener('submit', e => { e.preventDefault(); if (!valid()) return; const text = compose(); const href = `${waBase}?text=${encodeURIComponent(text)}`; openLink(href); done('wa', href, text); });
  mailBtn.addEventListener('click', () => { if (!valid()) return; const text = compose(); const href = `mailto:${B.email}?subject=${encodeURIComponent('Fence estimate request from ' + $('fName').value.trim())}&body=${encodeURIComponent(text)}`; location.href = href; done('mail', href, text); });

  /* ---------- nav, rail, reveals ---------- */
  const nav = $('nav'), railLinks = [...$('rail').querySelectorAll('a')]; let railCur = -1;
  function chrome() {
    nav.classList.toggle('solid', scrollY > 40);
    let a = 0; SECS.forEach((s, i) => { if (s.dataset.label && s.getBoundingClientRect().top <= innerHeight * .5) a = i; });
    if (a !== railCur) { railCur = a; railLinks.forEach((l, i) => l.classList.toggle('on', i === a)); }
  }
  addEventListener('scroll', chrome, { passive: true }); chrome();
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.rv, .spec-list li').forEach(el => io.observe(el));
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const id = a.getAttribute('href'); if (id === '#' || id === '#top') { e.preventDefault(); scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); return; } const el = document.querySelector(id); if (!el) return; e.preventDefault(); const y = el.getBoundingClientRect().top + scrollY - 20; scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' }); }));

  /* ---------- the scene ---------- */
  (function scene() {
    const stage = $('stage'), canvas = $('sceneCanvas'), F = window.Fence3D, status = $('status');
    const fail = () => { stage.classList.add('nogl'); vizSec.classList.add('nogl'); vizSec.classList.remove('live'); status.hidden = true; };
    if (!window.THREE || !F || !window.gsap) return fail();
    let r; try { r = F.renderer(canvas, isMobile ? 1.25 : 1.5); } catch (e) { return fail(); }
    r.toneMappingExposure = 1.0; r.setClearColor(0x070b14, 1);
    const T = THREE, scene = new T.Scene(); scene.environment = F.env(r, true);
    const L = F.lights(scene, 'night', isMobile ? 1024 : 2048); const sky = F.sky(scene, 'night', L.sun.position);
    const cam = new T.PerspectiveCamera(42, 1, .1, 220);
    // the yard (lawn, beds, trees, neighbour's house, lamp post) is built once; its throwaway fence is dropped
    const yard = F.build(scene, { material: 'wood', gate: false, length: 14, yard: true, timeOfDay: 'night', lamp: true, lampAt: [5.5, 2.0] }); F.dispose(yard.group);

    /* camera viewpoints, one per section (data-cam). pos = where the camera stands, look = what it looks at */
    const POSES = {
      hero: { pos: [-7.4, 1.3, 8.6], look: [1.0, 1.3, -0.6], fov: 44, end: { pos: [-4.4, 1.55, 6.3], look: [1.6, 1.25, -0.3], fov: 42 }, m: { pos: [-3.6, 1.5, 7.2], look: [0.8, 1.0, -0.4], fov: 44, end: { pos: [-1.8, 1.4, 5.6], look: [1.2, 1.0, -0.2], fov: 44 } } },
      promise: { pos: [3.6, 1.95, 2.7], look: [-1.4, 2.0, -0.5], fov: 44, m: { pos: [3.2, 1.9, 3.4], look: [-1.0, 1.7, -0.5], fov: 44 } },
      viz: { pos: [2.6, 1.85, 5.6], look: [0.3, 1.5, 0], fov: 40, m: { pos: [2.2, 1.6, 6.4], look: [0.2, 1.2, 0], fov: 42 } },
      gate: { pos: [5.2, 1.55, 4.6], look: [3.3, 1.1, -0.1], fov: 42 },
      wide: { pos: [-3.2, 5.4, 12.4], look: [0.5, 0.8, -2.0], fov: 42 },
      line: { pos: [-8.4, 1.5, 2.3], look: [3.5, 1.7, -0.3], fov: 38 },
      front: { pos: [1.2, 1.75, 4.9], look: [0.4, 1.15, 0], fov: 40 },
      footer: { pos: [-5.2, 2.9, 7.8], look: [2.0, 0.9, -3.0], fov: 40 }
    };
    let portrait = false; const pose = s => { const p = POSES[s.dataset.cam] || POSES.front; return portrait && p.m ? p.m : p; };
    const cur = { x: 0, y: 0, z: 0, lx: 0, ly: 0, lz: 0, fov: 42 }, tgt = Object.assign({}, cur);
    const setP = (o, p) => { o.x = p.pos[0]; o.y = p.pos[1]; o.z = p.pos[2]; o.lx = p.look[0]; o.ly = p.look[1]; o.lz = p.look[2]; o.fov = p.fov; };
    const lerpP = (o, p, e) => { o.x += (p.pos[0] - o.x) * e; o.y += (p.pos[1] - o.y) * e; o.z += (p.pos[2] - o.z) * e; o.lx += (p.look[0] - o.lx) * e; o.ly += (p.look[1] - o.ly) * e; o.lz += (p.look[2] - o.lz) * e; o.fov += (p.fov - o.fov) * e; };
    const smooth = p => p * p * (3 - 2 * p), clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    function computeTarget() {
      const first = pose(SECS[0]); setP(tgt, first);
      if (first.end) { const h = SECS[0].getBoundingClientRect(); const p = clamp(-h.top / Math.max(1, h.height - innerHeight), 0, 1); lerpP(tgt, first.end, smooth(p)); }
      for (let i = 1; i < SECS.length; i++) { const rc = SECS[i].getBoundingClientRect(); const p = clamp((innerHeight * .92 - rc.top) / (innerHeight * .78), 0, 1); if (p > 0) lerpP(tgt, pose(SECS[i]), smooth(p)); }
    }

    /* the fence: rebuilt (with a little build animation) whenever the visitor picks a material */
    let Y = null, mat = null, firstBuild = true;
    function buildFence(id) {
      if (Y) { F.dispose(Y.group); Y = null; }
      Y = F.build(scene, { material: id, gate: true, yard: false, timeOfDay: 'night', stringLights: true });
      const d0 = firstBuild ? .35 : 0, ease = 'power3.out';
      const ord = m => clamp((m.position.x + 7) / 14, 0, 1);
      Y.posts.forEach(p => { const t0 = d0 + ord(p) * .5; const y = p.position.y; p.scale.setScalar(.001); gsap.to(p.scale, { x: 1, y: 1, z: 1, duration: .01, delay: t0 }); p.position.y = y + 2.4; gsap.to(p.position, { y, duration: .5, ease: 'bounce.out', delay: t0 }); });
      const tl = d0 + (firstBuild ? 1.9 : 1.4);
      Y.rails.forEach((m, i) => { if (m.geometry && m.geometry.type === 'TubeGeometry') { m.visible = false; gsap.delayedCall(tl - .25, () => { m.visible = true; }); return; } const ax = m.userData.axis || 'x', o = clamp((m.getWorldPosition(new T.Vector3()).x + 7) / 14, 0, 1), t0 = d0 + .45 + o * .5 + (i % 3) * .04; m.scale[ax] = .001; gsap.to(m.scale, { [ax]: 1, duration: .4, ease, delay: t0 }); });
      Y.boards.forEach(m => { const o = m.userData.order || 0; if (m.userData.panel) { m.scale.x = .001; gsap.to(m.scale, { x: 1, duration: .5, ease, delay: d0 + .8 + o * .6 }); } else { m.scale.y = .001; gsap.to(m.scale, { y: 1, duration: .32, ease: 'back.out(1.3)', delay: d0 + .8 + o * .7 }); } });
      Y.hardware.forEach(h => { h.scale.setScalar(.001); gsap.to(h.scale, { x: 1, y: 1, z: 1, duration: .3, ease: 'back.out(1.5)', delay: d0 + 1.6 }); });
      if (Y.gate) { Y.gate.rotation.y = -1.0; gsap.to(Y.gate.rotation, { y: 0, duration: .8, ease: 'power2.inOut', delay: d0 + 1.5 }); }
      // string lights come on last, left to right
      Y.glows.forEach((g, i) => { const op = g.material.opacity; g.material.opacity = 0; gsap.to(g.material, { opacity: op, duration: .3, delay: tl + i * .025 }); });
      Y.pointLights.forEach(pl => { const I = pl.intensity; pl.intensity = 0; gsap.to(pl, { intensity: I, duration: .8, delay: tl + .3 }); });
      if (Y.bulbs[0]) { const bm = Y.bulbs[0].material, I = bm.emissiveIntensity; bm.emissiveIntensity = 0; gsap.to(bm, { emissiveIntensity: I, duration: .6, delay: tl + .2 }); }
      if (firstBuild && yard.lampLight) {
        const pl = yard.lampLight, I = pl.intensity, gl = yard.lampGlow, hm = yard.lampHead; pl.intensity = 0; gl.material.opacity = 0; hm.emissiveIntensity = 0;
        const fl = gsap.timeline({ delay: .15 }); fl.to(pl, { intensity: I * .5, duration: .08 }).to(pl, { intensity: 0, duration: .06 }).to(pl, { intensity: I * .8, duration: .1 }).to(pl, { intensity: I * .2, duration: .08 }).to(pl, { intensity: I, duration: .35 });
        gsap.to(gl.material, { opacity: .9, duration: .5, delay: .45 }); gsap.to(hm, { emissiveIntensity: 1.8, duration: .4, delay: .4 });
        gsap.delayedCall(tl + 1.2, () => { status.classList.add('on'); status.querySelector('span').textContent = 'Lights on · scroll to walk the yard'; });
      }
      if (reduce) gsap.globalTimeline.progress(1);
      firstBuild = false;
    }
    window.__sceneMaterial = id => { if (id === mat || !F.PRESETS[id]) return; mat = id; buildFence(id); };
    window.__sceneMaterial(state.material);

    /* mouse parallax + drag-to-orbit (desktop) */
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }; let yaw = 0, yawT = 0, dragging = false;
    if (!isMobile) addEventListener('pointermove', e => { if (dragging) return; mouse.tx = e.clientX / innerWidth - .5; mouse.ty = e.clientY / innerHeight - .5; });
    const pad = $('orbitPad'); let px0 = 0, yaw0 = 0;
    pad.addEventListener('pointerdown', e => { if (e.pointerType === 'touch') return; dragging = true; px0 = e.clientX; yaw0 = yawT; pad.setPointerCapture(e.pointerId); });
    pad.addEventListener('pointermove', e => { if (!dragging) return; yawT = clamp(yaw0 + (e.clientX - px0) * .005, -.75, .75); });
    const up = () => { dragging = false; }; pad.addEventListener('pointerup', up); pad.addEventListener('pointercancel', up);

    /* sizing: portrait screens get a wider lens and a longer lead */
    let fit = 1, fovK = 1, W = 0, H = 0;
    const size = () => { W = innerWidth; H = innerHeight; r.setSize(W, H, false); const a = W / H; cam.aspect = a; portrait = a < 1; fit = a >= 1.45 ? 1 : a >= 1 ? 1.15 : 1.45; fovK = a < 1 ? 1.3 : a < 1.45 ? 1.1 : 1; cam.updateProjectionMatrix(); };
    size(); addEventListener('resize', size); addEventListener('orientationchange', size);
    computeTarget(); Object.assign(cur, tgt);

    let last = 0, hidden = document.hidden; document.addEventListener('visibilitychange', () => { hidden = document.hidden; });
    const up3 = new T.Vector3(0, 1, 0), dir = new T.Vector3(), right = new T.Vector3(), look = new T.Vector3(), posV = new T.Vector3();
    function frame(now) {
      requestAnimationFrame(frame); if (hidden) return; if (isMobile && now - last < 30) return;
      const dt = Math.min(.1, (now - last) / 1000) || .016; last = now;
      computeTarget();
      const k = reduce ? 1 : 1 - Math.exp(-dt * 5.5);
      for (const key in cur) cur[key] += (tgt[key] - cur[key]) * k;
      mouse.x += (mouse.tx - mouse.x) * .05; mouse.y += (mouse.ty - mouse.y) * .05;
      if (!dragging) yawT += (0 - yawT) * Math.min(1, dt * .6);
      yaw += (yawT - yaw) * Math.min(1, dt * 6);
      look.set(cur.lx, cur.ly, cur.lz); dir.set(cur.x - cur.lx, cur.y - cur.ly, cur.z - cur.lz).applyAxisAngle(up3, yaw);
      right.crossVectors(dir, up3).normalize();
      posV.copy(look).addScaledVector(dir, fit).addScaledVector(right, mouse.x * -.5).addScaledVector(up3, mouse.y * -.25 + (reduce ? 0 : Math.sin(now / 2600) * .025));
      cam.position.copy(posV); cam.lookAt(look.x + mouse.x * .2, look.y, look.z);
      const f = cur.fov * fovK; if (Math.abs(cam.fov - f) > .01) { cam.fov = f; cam.updateProjectionMatrix(); }
      if (!reduce) sky.update(now);
      r.render(scene, cam);
    }
    requestAnimationFrame(frame);
    canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); fail(); });
  })();
})();
