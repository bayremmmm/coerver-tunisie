/* ============================================================
   COERVER® TUNISIE — Premium motion layer
   Scroll progress, reveals, parallax, tilt, magnetic buttons,
   nav auto-hide, marquee, and the app storytelling section.
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine   = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var mobile = window.matchMedia('(max-width: 900px)');
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ── Mobile menu: Escape closes it ───────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && typeof window.closeMobile === 'function') window.closeMobile();
  });

  /* ── Scroll progress bar ─────────────────────── */
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);

  /* ── Hero scroll hint ────────────────────────── */
  var hero = $('.hero');
  if (hero) { var h = document.createElement('div'); h.className = 'scroll-hint'; hero.appendChild(h); }

  /* ── Word-by-word title split ────────────────── */
  function split(el) {
    var n = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); return; }
            var line = document.createElement('span'); line.className = 'split-line';
            var s = document.createElement('span'); s.style.setProperty('--w', n++); s.textContent = w;
            line.appendChild(s); frag.appendChild(line);
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') { walk(c); }
      });
    })(el);
  }

  /* ── Auto-tag elements for reveal ────────────── */
  var groups = [
    ['.section-header, .temo-header, .pourquoi-content, .girls-content, .cta-banner-text', null],
    ['.stat-item', 'zoom'],
    ['.pq-card, .prog-photo-card, .point, .girls-point, .pillar-card, .belief-item, .pathway-step, .coach-card, .media-card, .trio-card, .feat, .step-n, .faq-item', null],
    ['.pourquoi-image, .girls-image', 'zoom'],
    ['.cta-banner-btns, .app-cta', null],
    ['.h-head, .h-stat, .h-panel, .h-why-item, .h-prog-head, .h-card, .h-girls .h-wrap > *, .h-final .h-wrap > *', null],
    ['.meth-philo-card, .meth-5s-card, .meth-club-item, .meth-end-item, .meth-tun-point, .pyr-detail, .ent-stat-box, .ent-terrain-card, .ent-cert-card, .ent-formed-stat, .ent-achieve-item, .cnt-info-card, .ins-recap-item, .ap-pillar, .ap-belief-item, .ap-phase-card, .ap-pyr-item, .stages-detail-item, .prog-detail-box, .prog-learn-item, .prog-elite-feature, .legal-section, .med-video-placeholder', null],
    ['.prog-block-content, .ent-coach-content, .meth-origine-content, .meth-tunisie-content, .stages-right, .cnt-form-col, .ins-form-col, .ap-history .container > *, .meth-philo-header, .meth-pyramide-header, .meth-code5s-header, .meth-clubs-header, .ent-certs-header, .ent-action-header, .med-video-header, .cnt-wa-content', null],
    ['.prog-block-media, .ent-coach-media, .meth-origine-media, .meth-tunisie-media, .stages-left, .cnt-wa-photo, .ap-video-wrap, .ap-history-photo', 'zoom'],
    ['.footer-col, .footer-brand', 'fade']
  ];
  groups.forEach(function (g) {
    var els = $$(g[0]);
    els.forEach(function (el, i) {
      if (el.hasAttribute('data-reveal')) return;
      el.setAttribute('data-reveal', g[1] || '');
      el.style.setProperty('--i', i % 4);
    });
  });
  $$('[data-split]').forEach(split);

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var t = e.target; t.classList.add('in'); io.unobserve(t);
        if (t.hasAttribute('data-reveal') && !t.hasAttribute('data-split')) setTimeout(function () { t.removeAttribute('data-reveal'); t.classList.remove('in'); t.style.removeProperty('--i'); }, 1600);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('[data-reveal], [data-split]').forEach(function (el) { io.observe(el); });

  /* ── Scroll-lit statement (words light up as you scroll) ── */
  var wordBlocks = $$('[data-words]').map(function (el) {
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); return; }
            var s = document.createElement('span'); s.className = 'w'; s.textContent = w; frag.appendChild(s);
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1) { walk(c); }
      });
    })(el);
    return { el: el, words: $$('.w', el) };
  });

  /* ── Hero background video: pause when off-screen (saves battery) ── */
  var hvs = $$('.h-hero-video'), heroEl = $('.h-hero');
  if (hvs.length && heroEl) {
    if (reduce) hvs.forEach(function (v) { v.pause(); });
    else new IntersectionObserver(function (en) { en.forEach(function (e) { hvs.forEach(function (v) { if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); }); }); }, { threshold: 0.05 }).observe(heroEl);
  }

  /* ── Videos: autoplay muted when visible, tap for sound ── */
  var vids = $$('.med-vid');
  if (vids.length) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting && !reduce) { v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else if (!e.isIntersecting) v.pause();
      });
    }, { threshold: 0.45 });
    vids.forEach(function (v) {
      vio.observe(v);
      var fig = v.closest('.med-video'), btn = fig && $('.med-vid-sound', fig);
      function toggle() {
        var on = v.muted;
        vids.forEach(function (o) { o.muted = true; var f = o.closest('.med-video'); if (f) f.classList.remove('sound'); });
        v.muted = !on; if (on) { fig.classList.add('sound'); v.play(); }
        if (btn) btn.setAttribute('aria-label', on ? 'Couper le son' : 'Activer le son');
      }
      if (btn) btn.addEventListener('click', toggle);
    });
  }


  /* ── Interactive section backgrounds (aurora, pitch, spotlight, particles, grain) ── */
  var FX = {
    '.h-statement': 'aurora pitch spot grain',
    '.app-story-stage': 'aurora particles spot grain',
    '.h-who': 'aurora spot grain',
    '.h-why': 'pitch aurora spot',
    '.temoignages-section': 'aurora pitch spot',
    '.h-final': 'pitch particles spot',
    '.geste': 'aurora spot',
    '.h-journey': 'aurora spot grain',
    '.game-section': 'aurora particles spot'
  };
  Object.keys(FX).forEach(function (sel) {
    var sec = $(sel); if (!sec) return;
    var want = FX[sel].split(' ');
    var bg = document.createElement('div'); bg.className = 'fx-bg'; bg.setAttribute('aria-hidden', 'true');
    if (want.indexOf('aurora') > -1) bg.insertAdjacentHTML('beforeend', '<div class="fx-aurora"><i></i><i></i><i></i></div>');
    if (want.indexOf('pitch') > -1) bg.insertAdjacentHTML('beforeend', '<div class="fx-pitch"></div>');
    var cv = null;
    if (want.indexOf('particles') > -1 && !reduce) { cv = document.createElement('canvas'); cv.className = 'fx-canvas'; bg.appendChild(cv); }
    if (want.indexOf('spot') > -1) bg.insertAdjacentHTML('beforeend', '<div class="fx-spot"></div>');
    if (want.indexOf('grain') > -1) bg.insertAdjacentHTML('beforeend', '<div class="fx-grain"></div>');
    sec.setAttribute('data-fx', '');
    sec.insertBefore(bg, sec.firstChild);

    var mouse = { x: -9999, y: -9999 }, raf = 0, visible = false;
    if (fine && !reduce) {
      sec.addEventListener('mousemove', function (e) {
        var r = bg.getBoundingClientRect();
        mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          bg.style.setProperty('--mx', mouse.x + 'px'); bg.style.setProperty('--my', mouse.y + 'px');
          bg.style.setProperty('--px', (mouse.x / r.width - 0.5).toFixed(3)); bg.style.setProperty('--py', (mouse.y / r.height - 0.5).toFixed(3));
        });
      });
      sec.addEventListener('mouseleave', function () { mouse.x = mouse.y = -9999; bg.style.setProperty('--px', 0); bg.style.setProperty('--py', 0); });
    }

    /* particles: drifting dots with soft links, pushed away by the cursor */
    var ctx, W, H, dots = [], dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    function size() {
      if (!cv) return;
      W = bg.clientWidth; H = bg.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.min(Math.round(W * H / 16000), mobile.matches ? 36 : 90);
      dots = []; for (var i = 0; i < n; i++) dots.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, r: Math.random() * 1.4 + .5, g: Math.random() < .7 });
    }
    function tick() {
      if (!visible || !cv) return;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i], dx = d.x - mouse.x, dy = d.y - mouse.y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) { d.vx += dx / dist * .06; d.vy += dy / dist * .06; }
        d.vx *= .985; d.vy *= .985; d.x += d.vx + (Math.random() - .5) * .05; d.y += d.vy + (Math.random() - .5) * .05;
        if (d.x < -10) d.x = W + 10; if (d.x > W + 10) d.x = -10; if (d.y < -10) d.y = H + 10; if (d.y > H + 10) d.y = -10;
        for (var j = i + 1; j < dots.length; j++) {
          var e = dots[j], lx = d.x - e.x, ly = d.y - e.y, l = lx * lx + ly * ly;
          if (l < 9000) { ctx.strokeStyle = 'rgba(120,200,120,' + (0.12 * (1 - l / 9000)).toFixed(3) + ')'; ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(e.x, e.y); ctx.stroke(); }
        }
        ctx.fillStyle = d.g ? 'rgba(110,210,120,.75)' : 'rgba(243,230,58,.6)';
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.283); ctx.fill();
      }
      requestAnimationFrame(tick);
    }
    if (cv) { size(); window.addEventListener('resize', size); }
    new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        var was = visible; visible = e.isIntersecting;
        bg.classList.toggle('fx-off', !visible);
        if (visible && !was && cv) requestAnimationFrame(tick);
      });
    }, { threshold: 0 }).observe(sec);
  });

  /* ── Horizontal shelf arrows ─────────────────── */
  $$('[data-shelf]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var shelf = $('#progShelf'); if (!shelf) return;
      var card = $('.h-card', shelf);
      shelf.scrollBy({ left: (card ? card.offsetWidth + 18 : 400) * parseInt(btn.getAttribute('data-shelf'), 10), behavior: 'smooth' });
    });
  });

  /* ── App storytelling (sticky, scroll-driven) ── */
  var story = $('.app-story');
  var storyState = { step: -1 };
  function setStep(i) {
    if (!story || storyState.step === i) return;
    storyState.step = i;
    story.setAttribute('data-step', i);
    $$('.app-step', story).forEach(function (el, k) { el.classList.toggle('on', k === i); });
    $$('.app-dots i', story).forEach(function (el, k) { el.classList.toggle('on', k === i); });
    $$('.screen', story).forEach(function (el, k) { el.classList.toggle('on', k === i); });
  }
  var storyTimer;
  function storyMode() {
    clearInterval(storyTimer);
    if (!story) return;
    storyState.step = -1; setStep(0);
    if (mobile.matches) {
      var n = $$('.screen', story).length, k = 0;
      storyTimer = setInterval(function () { k = (k + 1) % n; $$('.screen', story).forEach(function (el, j) { el.classList.toggle('on', j === k); }); }, 3200);
    }
  }
  if (story) { storyMode(); (mobile.addEventListener ? mobile.addEventListener('change', storyMode) : mobile.addListener(storyMode)); }

  /* ── Scroll-driven loop ──────────────────────── */
  var lastY = window.scrollY, nav = $('#navbar');
  var parallax = $$('[data-parallax]');
  // auto parallax on existing big images
  $$('.pourquoi-image img, .girls-image img').forEach(function (el) { el.setAttribute('data-parallax', '0.08'); parallax.push(el); });
  var ticking = false;

  function frame() {
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;
    bar.style.width = ((max > 0 ? y / max : 0) * 100).toFixed(2) + '%';

    if (nav) { // hide on scroll down, show on scroll up
      var open = document.body.style.overflow === 'hidden';
      nav.classList.toggle('nav-hidden', !open && y > 400 && y > lastY + 4);
      if (y < lastY - 4 || y < 400) nav.classList.remove('nav-hidden');
    }
    lastY = y;

    if (!reduce) {
      parallax.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        var d = (r.top + r.height / 2 - vh / 2) * -speed;
        el.style.transform = 'translate3d(0,' + d.toFixed(1) + 'px,0) scale(1.12)';
      });
    }

    wordBlocks.forEach(function (b) {
      var r = b.el.getBoundingClientRect();
      var p = (vh * 0.85 - r.top) / (r.height + vh * 0.35);
      var lit = reduce ? b.words.length : Math.round(Math.min(Math.max(p, 0), 1) * b.words.length);
      b.words.forEach(function (w, k) { w.classList.toggle('lit', k < lit); });
    });

    if (story && !mobile.matches) {
      var sr = story.getBoundingClientRect();
      var p = Math.min(Math.max(-sr.top / (sr.height - vh), 0), 0.9999);
      setStep(Math.floor(p * $$('.app-step', story).length));
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();

  /* ── Pointer effects (desktop only) ──────────── */
  if (fine && !reduce) {
    // magnetic buttons
    $$('.btn-green, .btn-inscription, .btn-cta-black, .btn-voir-tous, .store-badge').forEach(function (b) {
      b.setAttribute('data-magnetic', '');
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.18, y = (e.clientY - r.top - r.height / 2) * 0.28;
        b.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });
    // 3D tilt on cards
    $$('.pq-card, .trio-card, .feat, .prog-photo-card').forEach(function (c) {
      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform = 'perspective(900px) rotateY(' + (px * 7).toFixed(2) + 'deg) rotateX(' + (-py * 7).toFixed(2) + 'deg) translateY(-6px)';
      });
      c.addEventListener('mouseleave', function () { c.style.transform = ''; });
    });
    // phone follows the cursor on the app page
    var ph = $('.app-hero .phone');
    if (ph) {
      window.addEventListener('mousemove', function (e) {
        var x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
        ph.style.transform = 'rotateY(' + (-12 + x * 14).toFixed(1) + 'deg) rotateX(' + (4 - y * 10).toFixed(1) + 'deg) rotateZ(2deg)';
      });
    }
  }

  /* ── App page: cycle screens in the hero phone ── */
  var heroPhone = $('.app-hero .phone');
  if (heroPhone) {
    var scr = $$('.screen', heroPhone), k = 0;
    if (scr.length) {
      scr[0].classList.add('on');
      var cyc = setInterval(function () {
        if (heroPhone.classList.contains('touched')) { clearInterval(cyc); return; }
        $$('.screen', heroPhone).forEach(function (x) { x.classList.remove('on'); }); k = (k + 1) % scr.length; scr[k].classList.add('on');
      }, 3400);
    }
  }
})();
