/* ============================================================
   COERVER® TUNISIE — Extras: intro, football cursor, programme
   finder, inscription stepper, pyramid & journey scroll, viewer…
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ── 4. Logo intro: first visit on the homepage only ── */
  if (document.body.classList.contains('home') && $('.h-hero') && !reduce && !store('cvIntro')) {
    store('cvIntro', '1');
    var intro = document.createElement('div');
    intro.className = 'intro'; intro.setAttribute('aria-hidden', 'true');
    intro.innerHTML = '<div class="intro-inner"><img src="assets/images/logo-light.png" alt="" /><div class="bar"><i></i></div><small>TUNISIE</small></div>';
    document.body.appendChild(intro);
    document.documentElement.style.overflow = 'hidden';
    setTimeout(function () { intro.classList.add('out'); document.documentElement.style.overflow = ''; }, 1500);
    setTimeout(function () { intro.remove(); }, 2600);
  }

  /* ── 5. Football cursor (desktop, follows the pointer) ── */
  if (fine && !reduce) {
    var ball = document.createElement('div');
    ball.className = 'ball-cursor'; ball.setAttribute('aria-hidden', 'true');
    ball.innerHTML = '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#fff" stroke="#111" stroke-width="1.2"/><path d="M16 9.5l5.2 3.8-2 6.1h-6.4l-2-6.1z" fill="#111"/><path d="M16 9.5V3.2M21.2 13.3l6-2M19.2 19.4l3.8 5.1M12.8 19.4L9 24.5M10.8 13.3l-6-2" stroke="#111" stroke-width="1.3" fill="none"/></svg>';
    document.body.appendChild(ball);
    var tx = -100, ty = -100, x = -100, y = -100, rot = 0, running = false;
    function loop() {
      var dx = tx - x, dy = ty - y;
      x += dx * 0.22; y += dy * 0.22; rot += dx * 0.9;
      ball.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) rotate(' + rot.toFixed(1) + 'deg)';
      if (Math.abs(dx) + Math.abs(dy) > 0.2) requestAnimationFrame(loop); else running = false;
    }
    document.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY; ball.classList.add('on');
      if (!running) { running = true; requestAnimationFrame(loop); }
    }, { passive: true });
    document.addEventListener('mouseleave', function () { ball.classList.remove('on'); });
    document.addEventListener('mousedown', function () { ball.classList.add('press'); });
    document.addEventListener('mouseup', function () { ball.classList.remove('press'); });
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest && e.target.closest('a, button, label, select, input, textarea, summary, .med-item, .h-card, .h-panel');
      ball.classList.toggle('big', !!t);
    });
    // hide over iframes (map / video) where we lose the mouse
    $$('iframe').forEach(function (f) { f.addEventListener('mouseenter', function () { ball.classList.remove('on'); }); });
  }
})();

/* ── 6. Programme finder + 7. Inscription stepper ── */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var YEAR = new Date().getFullYear();

  var PROGS = {
    mini:        { name: 'Mini Coerver®', age: 'U6 – U8 · 6 à 8 ans', text: "L'éveil au football par le jeu et la joie : coordination, équilibre et premiers mouvements Coerver®.", img: 'assets/images/academie/mini-frappe.jpg' },
    performance: { name: 'Performance Academy', age: 'U9 – U14 · 9 à 14 ans', text: 'Le cœur du système Coerver® : les 6 niveaux de la pyramide pour une progression mesurable et durable.', img: 'assets/images/academie/performance.jpg' },
    advanced:    { name: 'Advanced Track', age: 'U15 – U18 · 15 à 18 ans', text: "Pour les joueurs ambitieux : technique avancée sous pression, préparation physique et analyse tactique.", img: 'assets/images/academie/advanced.jpg' },
    elite:       { name: 'Programme Élite', age: 'Tous niveaux · Sélection sur dossier', text: 'Suivi individualisé, évaluations mensuelles et connexion avec le réseau Coerver® international.', img: 'assets/images/academie/elite.jpg' }
  };

  $$('[data-finder]').forEach(function (box) {
    var yearSel = $('.finder-year', box), lvlSel = $('.finder-level', box), out = $('.finder-result', box);
    for (var y = YEAR - 4; y >= YEAR - 19; y--) { var o = document.createElement('option'); o.value = y; o.textContent = y; yearSel.appendChild(o); }
    function render() {
      var y = parseInt(yearSel.value, 10), lvl = lvlSel.value;
      if (!y) { out.classList.remove('show'); return; }
      var age = YEAR - y, key = null, note = '';
      if (age < 6) note = "Nos programmes commencent à 6 ans. Contactez-nous : nous vous dirons quand votre enfant pourra nous rejoindre.";
      else if (age <= 8) key = 'mini';
      else if (age <= 14) key = 'performance';
      else if (age <= 18) key = 'advanced';
      else note = "Nos programmes s'adressent aux joueurs jusqu'à 18 ans. Contactez-nous pour en parler.";
      if (key && lvl === 'high' && age >= 9) note = 'Votre enfant joue en compétition ? Le Programme Élite (sur dossier) peut aussi lui convenir.';
      if (!key) {
        out.innerHTML = '<div class="finder-card no-img"><div class="fc-body"><span class="fc-age">' + age + ' ans en ' + YEAR + '</span><h4>Parlons-en ensemble</h4><p>' + note + '</p><div class="fc-cta"><a class="h-btn green" href="contact.html">Nous contacter</a></div></div></div>';
      } else {
        var p = PROGS[key];
        out.innerHTML = '<div class="finder-card"><div class="fc-img" style="background-image:url(\'' + p.img + '\')"></div><div class="fc-body"><span class="fc-age">' + age + ' ans en ' + YEAR + ' · ' + p.age + '</span><h4>' + p.name + '</h4><p>' + p.text + '</p>' +
          (note ? '<p class="fc-note">' + note + ' <a href="programmes.html#elite">En savoir plus ›</a></p>' : '') +
          '<div class="fc-cta"><a class="h-btn green" href="inscription.html?programme=' + key + '#formulaire">S\'inscrire à ce programme</a><a class="h-link" href="programmes.html#' + key + '">Voir le programme</a></div></div></div>';
      }
      out.classList.remove('show'); void out.offsetWidth; out.classList.add('show');
    }
    yearSel.addEventListener('change', render); lvlSel.addEventListener('change', render);
  });

  /* Inscription: preselect programme from ?programme= */
  var form = $('form.ins-form');
  if (!form) return;
  var want = new URLSearchParams(location.search).get('programme');
  var map = { mini: 'mini', performance: 'performance', advanced: 'advanced', elite: 'elite', stage: 'stage' };
  if (want && map[want]) { var r = form.querySelector('input[name="programme"][value="' + map[want] + '"]'); if (r) { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); } }

  /* Stepper: split the long form into 3 steps without changing any field */
  var dividers = $$('.ins-form-divider', form);
  if (dividers.length < 2) return;
  var panels = [document.createElement('div'), document.createElement('div'), document.createElement('div')];
  panels.forEach(function (p, i) { p.className = 'ins-panel'; p.setAttribute('data-step', i); });
  var kids = Array.prototype.slice.call(form.children), idx = 0;
  kids.forEach(function (k) {
    if (k.classList && k.classList.contains('ins-form-divider')) { idx++; k.remove(); return; }
    if (k.tagName === 'INPUT' && k.type === 'hidden') return;
    panels[Math.min(idx, 2)].appendChild(k);
  });
  var head = document.createElement('div'); head.className = 'ins-stepper';
  head.innerHTML = '<div class="st-labels"><span class="on">1 · Parent</span><span>2 · Enfant</span><span>3 · Programme</span></div><div class="st-bar"><i></i></div>';
  form.insertBefore(head, form.firstChild);
  panels.forEach(function (p) { form.appendChild(p); });
  // navigation buttons
  function nav(i) {
    var n = document.createElement('div'); n.className = 'ins-nav';
    if (i > 0) n.insertAdjacentHTML('beforeend', '<button type="button" class="ins-back">‹ Retour</button>');
    if (i < 2) n.insertAdjacentHTML('beforeend', '<button type="button" class="ins-next">Continuer ›</button>');
    return n;
  }
  panels[0].appendChild(nav(0)); panels[1].appendChild(nav(1));
  var submit = panels[2].querySelector('button[type="submit"]');
  if (submit) submit.parentNode.insertBefore(nav(2), submit);
  var step = 0;
  function show(i, scroll) {
    step = i;
    panels.forEach(function (p, k) { p.classList.toggle('active', k === i); });
    $$('.st-labels span', head).forEach(function (s, k) { s.classList.toggle('on', k <= i); });
    $('.st-bar i', head).style.transform = 'scaleX(' + ((i + 1) / 3) + ')';
    if (scroll) { var top = head.getBoundingClientRect().top + window.scrollY - 110; window.scrollTo({ top: top, behavior: 'smooth' }); }
    var f = panels[i].querySelector('input:not([type=hidden]):not([type=radio]), select, textarea'); if (f && scroll) setTimeout(function () { f.focus({ preventScroll: true }); }, 350);
  }
  function valid(i) {
    var fields = $$('input, select, textarea', panels[i]);
    for (var k = 0; k < fields.length; k++) { if (!fields[k].checkValidity()) { fields[k].reportValidity(); return false; } }
    return true;
  }
  form.addEventListener('click', function (e) {
    if (e.target.closest('.ins-next')) { if (valid(step)) show(step + 1, true); }
    if (e.target.closest('.ins-back')) show(step - 1, true);
  });
  // Enter key on steps 1–2 goes to the next step instead of submitting
  form.addEventListener('submit', function (e) {
    if (step < 2) { e.preventDefault(); e.stopImmediatePropagation(); if (valid(step)) show(step + 1, true); }
  }, true);
  form.classList.add('is-stepper');
  show(want ? 0 : 0, false);
})();

/* ── 1. Méthode: pyramid that builds itself while scrolling ── */
(function () {
  'use strict';
  var layout = document.querySelector('.meth-pyramide-layout');
  if (!layout) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var levels = Array.prototype.slice.call(layout.querySelectorAll('.pyr-level'));
  var details = Array.prototype.slice.call(layout.querySelectorAll('.pyr-detail'));
  var wide = window.matchMedia('(min-width: 1101px)');
  var track = document.createElement('div'); track.className = 'pyr-track';
  layout.parentNode.insertBefore(track, layout); track.appendChild(layout);
  layout.insertAdjacentHTML('beforeend', '<div class="pyr-progress" aria-hidden="true">' + [1,2,3,4,5,6].map(function (n) { return '<i data-n="' + n + '"></i>'; }).join('') + '</div>');
  var dots = Array.prototype.slice.call(layout.querySelectorAll('.pyr-progress i'));
  var cur = 0;
  function set(n) {
    if (n === cur) return; cur = n;
    levels.forEach(function (l) { var k = +l.dataset.level; l.classList.toggle('built', k <= n); l.classList.toggle('pyr-level-active', k === n); });
    details.forEach(function (d) { d.classList.toggle('pyr-detail-active', +d.dataset.level === n); });
    dots.forEach(function (d) { d.classList.toggle('on', +d.dataset.n <= n); });
  }
  function onScroll() {
    if (!wide.matches || reduce) return;
    var r = track.getBoundingClientRect(), span = track.offsetHeight - window.innerHeight;
    var p = Math.min(Math.max(-r.top / Math.max(span, 1), 0), 0.999);
    set(Math.floor(p * 6) + 1);
  }
  function mode() {
    var on = wide.matches && !reduce;
    track.classList.toggle('is-scroll', on);
    if (!on) { levels.forEach(function (l) { l.classList.add('built'); }); cur = 0; set(1); }
    else onScroll();
  }
  // clicking a level scrolls to its position on desktop (keeps the old click behaviour on mobile)
  levels.forEach(function (l) {
    l.addEventListener('click', function () {
      var n = +l.dataset.level;
      if (track.classList.contains('is-scroll')) {
        var span = track.offsetHeight - window.innerHeight, top = track.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top + span * ((n - 0.5) / 6), behavior: 'smooth' });
      } else set(n);
    });
  });
  window.addEventListener('scroll', function () { requestAnimationFrame(onScroll); }, { passive: true });
  (wide.addEventListener ? wide.addEventListener('change', mode) : wide.addListener(mode));
  mode();
})();

/* ── 2. Player journey: horizontal travel on vertical scroll (desktop) ── */
(function () {
  'use strict';
  var sec = document.querySelector('.h-journey'); if (!sec) return;
  var track = sec.querySelector('.hj-track'), line = sec.querySelector('.hj-line'), stops = Array.prototype.slice.call(sec.querySelectorAll('.hj-stop'));
  var wide = window.matchMedia('(min-width: 1101px)'), reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function light(p) {
    line.style.setProperty('--hj', p.toFixed(3));
    stops.forEach(function (s, i) { s.classList.toggle('lit', p >= i / stops.length - 0.02); });
  }
  function frame() {
    if (sec.classList.contains('is-scroll')) {
      var r = sec.getBoundingClientRect(), span = sec.offsetHeight - window.innerHeight;
      var p = Math.min(Math.max(-r.top / Math.max(span, 1), 0), 1);
      var max = Math.max(track.scrollWidth - window.innerWidth + 40, 0);
      track.style.transform = 'translate3d(' + (-p * max).toFixed(1) + 'px,0,0)';
      light(p);
    } else {
      var r2 = sec.getBoundingClientRect();
      light(Math.min(Math.max((window.innerHeight - r2.top) / (r2.height + window.innerHeight * .2), 0), 1));
    }
  }
  function mode() {
    var on = wide.matches && !reduce;
    sec.classList.toggle('is-scroll', on);
    if (!on) track.style.transform = '';
    frame();
  }
  window.addEventListener('scroll', function () { requestAnimationFrame(frame); }, { passive: true });
  window.addEventListener('resize', frame);
  (wide.addEventListener ? wide.addEventListener('change', mode) : wide.addListener(mode));
  mode();
})();

/* ── 10. Médias: Instagram-style story viewer for videos + swipe in photo lightbox ── */
(function () {
  'use strict';
  var vids = Array.prototype.slice.call(document.querySelectorAll('.med-video'));
  if (vids.length) {
    var data = vids.map(function (f) { var v = f.querySelector('video'); return { src: v.getAttribute('src'), poster: v.getAttribute('poster'), title: (f.querySelector('figcaption b') || {}).textContent || '', sub: (f.querySelector('figcaption span') || {}).textContent || '' }; });
    var st = document.createElement('div'); st.className = 'story'; st.setAttribute('role', 'dialog'); st.setAttribute('aria-label', 'Vidéos');
    st.innerHTML = '<div class="story-bars">' + data.map(function () { return '<i><b></b></i>'; }).join('') + '</div>' +
      '<div class="story-head"><img src="assets/images/logo-light.png" alt="" /><div><b></b><span></span></div><button class="story-mute" type="button" aria-label="Son">🔊</button><button class="story-close" type="button" aria-label="Fermer">✕</button></div>' +
      '<video class="story-vid" playsinline preload="auto"></video><button class="story-prev" aria-label="Précédent"></button><button class="story-next" aria-label="Suivant"></button>';
    document.body.appendChild(st);
    var sv = st.querySelector('.story-vid'), bars = st.querySelectorAll('.story-bars b'), idx = 0, muted = false;
    function load(i) {
      idx = (i + data.length) % data.length;
      sv.src = data[idx].src; sv.poster = data[idx].poster; sv.muted = muted; sv.currentTime = 0;
      st.querySelector('.story-head b').textContent = data[idx].title; st.querySelector('.story-head span').textContent = data[idx].sub;
      Array.prototype.forEach.call(bars, function (b, k) { b.style.transform = 'scaleX(' + (k < idx ? 1 : 0) + ')'; });
      var p = sv.play(); if (p && p.catch) p.catch(function () { muted = true; sv.muted = true; sv.play(); });
      st.querySelector('.story-mute').textContent = muted ? '🔇' : '🔊';
    }
    function open(i) {
      document.querySelectorAll('.med-vid').forEach(function (v) { v.pause(); });
      st.classList.add('open'); document.body.style.overflow = 'hidden'; load(i);
    }
    function close() { st.classList.remove('open'); sv.pause(); sv.removeAttribute('src'); sv.load(); document.body.style.overflow = ''; }
    sv.addEventListener('timeupdate', function () { if (sv.duration) bars[idx].style.transform = 'scaleX(' + (sv.currentTime / sv.duration) + ')'; });
    sv.addEventListener('ended', function () { if (idx < data.length - 1) load(idx + 1); else close(); });
    st.querySelector('.story-close').addEventListener('click', close);
    st.querySelector('.story-prev').addEventListener('click', function () { load(idx - 1); });
    st.querySelector('.story-next').addEventListener('click', function () { load(idx + 1); });
    st.querySelector('.story-mute').addEventListener('click', function () { muted = !muted; sv.muted = muted; this.textContent = muted ? '🔇' : '🔊'; });
    var sx = 0, sy = 0;
    st.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    st.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (dy > 90 && Math.abs(dy) > Math.abs(dx)) close(); else if (Math.abs(dx) > 50) load(idx + (dx < 0 ? 1 : -1));
    });
    document.addEventListener('keydown', function (e) {
      if (!st.classList.contains('open')) return;
      if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') load(idx + 1); if (e.key === 'ArrowLeft') load(idx - 1);
    });
    vids.forEach(function (f, i) {
      var frame = f.querySelector('.med-video-frame');
      frame.insertAdjacentHTML('beforeend', '<span class="med-open">Plein écran</span>');
      f.querySelector('video').addEventListener('click', function () { open(i); });
      f.querySelector('.med-open').addEventListener('click', function () { open(i); });
    });
  }
  // photo lightbox: swipe on phones + counter
  var lb = document.getElementById('lightbox');
  if (lb) {
    var x0 = 0, y0 = 0;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) document.getElementById(dx < 0 ? 'lbNext' : 'lbPrev').click();
      else if (dy > 90) document.getElementById('lbClose').click();
    });
  }
})();

/* ── 11. Coach cards: tap to flip on touch screens ── */
(function () {
  Array.prototype.forEach.call(document.querySelectorAll('.flip-card'), function (c) {
    c.addEventListener('click', function (e) { if (e.target.closest('a')) return; c.classList.toggle('flipped'); });
  });
})();
