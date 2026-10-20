/* ============================================================
   COERVER® TUNISIE — Features (WhatsApp menu, back-to-top,
   micro-interactions, confetti, app demo, player card, game,
   data-driven blocks)
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = '21658519189';

  /* ── 25. Smart WhatsApp menu ── */
  var waBtn = $('.wa-float');
  if (waBtn) {
    var opts = [
      ['Inscription', "Bonjour, je souhaite inscrire mon enfant chez Coerver® Coaching Tunisie."],
      ["Séance d'essai gratuite", "Bonjour, je souhaite réserver une séance d'essai gratuite pour mon enfant."],
      ['Tarifs et horaires', 'Bonjour, pouvez-vous m\'envoyer les tarifs et les horaires des séances ?'],
      ['Application Coerver Foot', "Bonjour, j'ai une question sur l'application Coerver Foot."],
      ['Autre question', 'Bonjour, ']
    ];
    var menu = document.createElement('div');
    menu.className = 'wa-menu'; menu.setAttribute('role', 'dialog'); menu.setAttribute('aria-label', 'Contacter sur WhatsApp');
    menu.innerHTML = '<div class="wa-menu-head"><span class="av"><img src="assets/images/logo-light.png" alt="" /></span><div><b>Coerver® Tunisie</b><span>Répond rapidement</span></div></div>' +
      '<p>Comment pouvons-nous vous aider ?</p>' +
      opts.map(function (o) { return '<a class="wa-opt" target="_blank" rel="noopener noreferrer" href="https://wa.me/' + WA + '?text=' + encodeURIComponent(o[1]) + '">' + o[0] + '</a>'; }).join('');
    document.body.appendChild(menu);
    function setOpen(on) { menu.classList.toggle('open', on); waBtn.classList.toggle('is-open', on); waBtn.setAttribute('aria-expanded', on ? 'true' : 'false'); }
    waBtn.setAttribute('aria-haspopup', 'dialog');
    waBtn.addEventListener('click', function (e) { e.preventDefault(); setOpen(!menu.classList.contains('open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('.wa-opt')) setOpen(false); });
    document.addEventListener('click', function (e) { if (!e.target.closest('.wa-menu, .wa-float')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }

  /* ── 29. Back-to-top football ── */
  var top = document.createElement('button');
  top.className = 'to-top'; top.type = 'button'; top.setAttribute('aria-label', 'Retour en haut');
  top.innerHTML = '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#fff" stroke="#111" stroke-width="1.2"/><path d="M16 9.5l5.2 3.8-2 6.1h-6.4l-2-6.1z" fill="#111"/><path d="M16 9.5V3.2M21.2 13.3l6-2M19.2 19.4l3.8 5.1M12.8 19.4L9 24.5M10.8 13.3l-6-2" stroke="#111" stroke-width="1.3" fill="none"/></svg>';
  document.body.appendChild(top);
  window.addEventListener('scroll', function () { top.classList.toggle('show', window.scrollY > window.innerHeight * 1.2); }, { passive: true });
  top.addEventListener('click', function () {
    top.classList.remove('kick'); void top.offsetWidth; top.classList.add('kick');
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  /* ── 28. Micro-interactions: tiny "pop" on every button/link-button click ── */
  document.addEventListener('pointerdown', function (e) {
    var b = e.target.closest('.h-btn, .btn-green, .btn-inscription, .store-badge, .xm-cta, .ins-next, .ins-submit, .cnt-submit, .map-btn, .fb-cta, .med-filter, .wa-opt, .finder-fields select');
    if (!b || reduce) return;
    b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
  });

  /* ── 28. Confetti on the thank-you page ── */
  if ($('.merci-box') && !reduce) {
    var cv = document.createElement('canvas'); cv.className = 'confetti'; document.body.appendChild(cv);
    var ctx = cv.getContext('2d'), W, H, parts = [], cols = ['#4CAF50', '#66BB6A', '#f3e63a', '#ffffff', '#2e7d32'];
    function size() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
    size(); addEventListener('resize', size);
    for (var i = 0; i < 160; i++) parts.push({ x: W / 2 + (Math.random() - .5) * 120, y: H * .35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4, s: Math.random() * 7 + 4, r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: cols[i % cols.length], life: 0 });
    var t0 = performance.now();
    (function draw(t) {
      ctx.clearRect(0, 0, W, H);
      parts.forEach(function (p) { p.vy += .32; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore(); });
      if (t - t0 < 4200) requestAnimationFrame(draw); else cv.remove();
    })(t0);
  }
})();

/* ── 26. App page: clickable phone demo ── */
(function () {
  'use strict';
  var phone = document.querySelector('.app-hero .phone'); if (!phone) return;
  var screens = Array.prototype.slice.call(phone.querySelectorAll('.screen'));
  function find(fn) { for (var i = 0; i < screens.length; i++) if (fn(screens[i])) return screens[i]; }
  var byTab = {
    'Accueil': find(function (s) { return /passport/i.test((s.querySelector('.s-top b') || {}).textContent || ''); }),
    'Planning': find(function (s) { return /Planning/.test((s.querySelector('.s-top b') || {}).textContent || ''); }),
    'Équipes': find(function (s) { return /Appel/.test((s.querySelector('.s-top b') || {}).textContent || ''); }),
    'Messages': phone.querySelector('.s-msgs')
  };
  function go(scr) {
    if (!scr) return; phone.classList.add('touched');
    screens.forEach(function (s) { s.classList.toggle('on', s === scr); });
  }
  phone.style.pointerEvents = 'auto';
  phone.classList.add('demo');
  phone.addEventListener('click', function (e) {
    var tab = e.target.closest('.tabbar span');
    if (tab) { go(byTab[tab.textContent.trim()]); return; }
    if (e.target.closest('.s-btn') && e.target.closest('.s-login')) { go(byTab['Accueil']); return; }
    var pill = e.target.closest('.roll-row .pill');
    if (pill) { var order = ['ok', 'ko', 'wait']; var cur = order.filter(function (c) { return pill.classList.contains(c); })[0] || 'wait'; var nxt = order[(order.indexOf(cur) + 1) % 3];
      pill.classList.remove(cur); pill.classList.add(nxt); pill.textContent = { ok: 'Présent', ko: 'Absent', wait: 'À faire' }[nxt]; phone.classList.add('touched'); }
  });
  var hint = document.createElement('div'); hint.className = 'demo-hint'; hint.textContent = 'Touchez les onglets pour essayer l’app';
  phone.parentNode.appendChild(hint);
})();

/* ── 19–24. Data-driven blocks (filled from assets/js/site-data.js) ── */
(function () {
  'use strict';
  var D = window.COERVER_DATA || {};
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  function slot(name) { return document.querySelector('[data-block="' + name + '"]'); }
  function show(el, html) { el.innerHTML = html; el.classList.add('has-data'); }
  var MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

  /* 19. Chiffres clés */
  var el = slot('chiffres');
  if (el && D.chiffres && D.chiffres.length) {
    show(el, '<div class="h-wrap db-stats">' + D.chiffres.map(function (c) {
      return '<div class="db-stat"><b><span class="db-count" data-to="' + (+c.valeur || 0) + '">0</span><sup>' + esc(c.suffixe || '') + '</sup></b><span>' + esc(c.label) + '</span></div>';
    }).join('') + '</div>');
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (!e.isIntersecting) return; io.disconnect();
      Array.prototype.forEach.call(el.querySelectorAll('.db-count'), function (n) { var to = +n.dataset.to, t0 = performance.now();
        (function step(t) { var p = Math.min((t - t0) / 1600, 1); n.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); })(t0); }); }); }, { threshold: .4 });
    io.observe(el);
  }

  /* 20. Planning de la semaine */
  el = slot('semaine');
  if (el && D.semaine && D.semaine.length) {
    show(el, '<div class="container"><span class="section-tag">Une semaine chez Coerver®</span><h2 class="section-title">Quand s\'entraîne<br />votre enfant ?</h2>' +
      '<div class="db-legend"><i class="p-mini">Mini</i><i class="p-performance">Performance</i><i class="p-advanced">Advanced</i><i class="p-elite">Élite</i></div>' +
      '<div class="db-week">' + D.semaine.map(function (d) {
        return '<div class="db-day"><h4>' + esc(d.jour) + '</h4>' + (d.creneaux || []).map(function (c) {
          return '<div class="db-slot p-' + esc(c.programme || 'mini') + '"><b>' + esc(c.heure) + '</b><span>' + esc(c.groupe) + '</span></div>'; }).join('') + '</div>';
      }).join('') + '</div></div>');
  }

  /* 21. Histoire de progression (avant / après) */
  el = slot('progression');
  var P = D.progression;
  if (el && P && P.avant && P.apres) {
    show(el, '<div class="h-wrap db-ba-grid"><div><span class="h-kicker">Histoire de progression</span><h2 class="h-h2">' + esc(P.prenom) + ',<br /><em>' + esc(P.avant.age) + ' → ' + esc(P.apres.age) + ' ans.</em></h2><p class="h-sub">' + esc(P.texte) + '</p></div>' +
      '<div class="db-ba" style="--pos:50%"><img src="' + esc(P.apres.photo) + '" alt="' + esc(P.prenom) + ' à ' + esc(P.apres.age) + ' ans" /><div class="db-ba-before"><img src="' + esc(P.avant.photo) + '" alt="' + esc(P.prenom) + ' à ' + esc(P.avant.age) + ' ans" /></div>' +
      '<span class="db-ba-l">Avant · ' + esc(P.avant.age) + ' ans</span><span class="db-ba-r">Aujourd\'hui · ' + esc(P.apres.age) + ' ans</span><input type="range" min="0" max="100" value="50" aria-label="Comparer avant et après" /><i class="db-ba-handle"></i></div></div>');
    var ba = el.querySelector('.db-ba');
    ba.querySelector('input').addEventListener('input', function () { ba.style.setProperty('--pos', this.value + '%'); });
  }

  /* 22. Partenaires */
  el = slot('partenaires');
  if (el && D.partenaires && D.partenaires.length) {
    show(el, '<div class="h-wrap"><span class="h-kicker">Ils nous accompagnent</span><div class="db-logos">' + D.partenaires.map(function (p) {
      var img = '<img src="' + esc(p.logo) + '" alt="' + esc(p.nom) + '" loading="lazy" />';
      return p.lien ? '<a href="' + esc(p.lien) + '" target="_blank" rel="noopener noreferrer">' + img + '</a>' : '<span>' + img + '</span>';
    }).join('') + '</div></div>');
  }

  /* 23. Actualités */
  el = slot('actualites');
  if (el && D.actualites && D.actualites.length) {
    var news = D.actualites.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 3);
    show(el, '<div class="h-wrap"><span class="h-kicker">Actualités</span><h2 class="h-h2">La vie de l\'académie.</h2><div class="db-news">' + news.map(function (n) {
      var d = new Date(n.date), when = isNaN(d) ? '' : d.getDate() + ' ' + MOIS[d.getMonth()] + ' ' + d.getFullYear();
      return '<a class="db-new" href="' + esc(n.lien || '#') + '">' + (n.photo ? '<div class="db-new-img" style="background-image:url(\'' + esc(n.photo) + '\')"></div>' : '') +
        '<div class="db-new-body"><time>' + when + '</time><h3>' + esc(n.titre) + '</h3><p>' + esc(n.texte) + '</p></div></a>';
    }).join('') + '</div></div>');
  }

  /* 24. Compte à rebours */
  el = slot('evenement');
  var E = D.evenement;
  if (el && E && E.date && new Date(E.date) > new Date()) {
    var msg = 'Bonjour, je souhaite être informé(e) pour : ' + E.titre;
    show(el, '<div class="db-cd"><span class="db-cd-t">' + esc(E.titre) + '</span><div class="db-cd-n"><b data-u="j">0</b><small>jours</small><b data-u="h">0</b><small>h</small><b data-u="m">0</b><small>min</small><b data-u="s">0</b><small>s</small></div>' +
      '<a class="db-cd-btn" target="_blank" rel="noopener noreferrer" href="https://wa.me/21658519189?text=' + encodeURIComponent(msg) + '">' + esc(E.bouton || 'Me prévenir') + '</a></div>');
    var target = new Date(E.date).getTime();
    (function tick() {
      var s = Math.max(0, Math.floor((target - Date.now()) / 1000));
      var v = { j: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
      Array.prototype.forEach.call(el.querySelectorAll('[data-u]'), function (b) { b.textContent = v[b.dataset.u]; });
      if (s > 0) setTimeout(tick, 1000);
    })();
  }
})();
