/* ============================================================
   COERVER® TUNISIE — Espace joueurs: player card + juggling game
   Everything runs in the browser; photos are never uploaded.
   ============================================================ */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };

  /* ── 17. Player card generator ── */
  var cv = $('pcCanvas');
  if (cv) {
    var ctx = cv.getContext('2d');
    var STATS = [['VIT', 'Vitesse'], ['TEC', 'Technique'], ['DRI', 'Dribble'], ['PAS', 'Passe'], ['TIR', 'Tir'], ['PHY', 'Physique']];
    var vals = [82, 85, 88, 80, 76, 74];
    var photo = null;
    var logo = new Image(); logo.src = 'assets/images/logo-light.png'; logo.onload = draw;
    var box = $('pcStats');
    box.innerHTML = STATS.map(function (s, i) {
      return '<label class="pf-stat"><span>' + s[1] + '</span><input type="range" min="40" max="99" value="' + vals[i] + '" data-i="' + i + '" /><b>' + vals[i] + '</b></label>';
    }).join('');
    box.addEventListener('input', function (e) {
      if (e.target.type !== 'range') return;
      vals[+e.target.dataset.i] = +e.target.value; e.target.nextElementSibling.textContent = e.target.value; draw();
    });
    $('pcName').addEventListener('input', draw);
    $('pcPos').addEventListener('change', draw);
    $('pcPhoto').addEventListener('change', function () {
      var f = this.files && this.files[0]; if (!f) return;
      var url = URL.createObjectURL(f), im = new Image();
      im.onload = function () { photo = im; draw(); };
      im.src = url;
    });

    function shape(c) { // classic card silhouette
      c.beginPath();
      c.moveTo(60, 70); c.quadraticCurveTo(300, 0, 540, 70);
      c.lineTo(560, 640); c.quadraticCurveTo(560, 700, 500, 730);
      c.lineTo(300, 830); c.lineTo(100, 730); c.quadraticCurveTo(40, 700, 40, 640); c.closePath();
    }
    function draw() {
      ctx.clearRect(0, 0, 600, 840);
      ctx.save(); shape(ctx); ctx.clip();
      var g = ctx.createLinearGradient(0, 0, 600, 840);
      g.addColorStop(0, '#0d2b14'); g.addColorStop(.5, '#14451f'); g.addColorStop(1, '#050806');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 600, 840);
      // pitch lines pattern
      ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.lineWidth = 2;
      for (var k = -840; k < 840; k += 34) { ctx.beginPath(); ctx.moveTo(k, 0); ctx.lineTo(k + 840, 840); ctx.stroke(); }
      var glow = ctx.createRadialGradient(330, 300, 20, 330, 300, 320); glow.addColorStop(0, 'rgba(102,187,106,.45)'); glow.addColorStop(1, 'rgba(102,187,106,0)');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, 600, 840);
      // photo
      if (photo) {
        var bx = 205, by = 90, bw = 340, bh = 420, s = Math.max(bw / photo.width, bh / photo.height);
        var w = photo.width * s, h = photo.height * s;
        ctx.save(); ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.clip();
        ctx.drawImage(photo, bx + (bw - w) / 2, by + (bh - h) / 2.6, w, h);
        var fade = ctx.createLinearGradient(0, by + bh - 140, 0, by + bh); fade.addColorStop(0, 'rgba(10,30,14,0)'); fade.addColorStop(1, 'rgba(10,30,14,1)');
        ctx.fillStyle = fade; ctx.fillRect(bx, by + bh - 140, bw, 140); ctx.restore();
      } else {
        ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.arc(375, 260, 100, 0, 6.283); ctx.fill();
        ctx.beginPath(); ctx.ellipse(375, 470, 150, 110, 0, Math.PI, 0); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.font = '600 22px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Ajoute ta photo', 375, 270);
      }
      // overall + position
      var ovr = Math.round(vals.reduce(function (a, b) { return a + b; }, 0) / vals.length);
      ctx.textAlign = 'center'; ctx.fillStyle = '#f3e63a';
      ctx.font = '800 84px Inter, sans-serif'; ctx.fillText(ovr, 130, 205);
      ctx.fillStyle = '#fff'; ctx.font = '800 40px Inter, sans-serif'; ctx.fillText($('pcPos').value, 130, 252);
      ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(95, 275, 70, 2);
      if (logo.complete && logo.naturalWidth) { var lw = 100, lh = lw * logo.naturalHeight / logo.naturalWidth; ctx.drawImage(logo, 130 - lw / 2, 295, lw, lh); }
      ctx.fillStyle = '#fff'; ctx.font = '700 15px Inter, sans-serif'; ctx.fillText('TUNISIE', 130, 295 + 100 * (logo.naturalHeight || 1) / (logo.naturalWidth || 5) + 22);
      // name
      var name = ($('pcName').value || 'TON PRÉNOM').toUpperCase();
      ctx.fillStyle = '#fff'; ctx.font = '800 52px Inter, sans-serif';
      var fs = 60; while (ctx.measureText(name).width > 440 && fs > 30) { fs -= 2; ctx.font = '800 ' + fs + 'px Inter, sans-serif'; }
      ctx.fillText(name, 300, 568);
      ctx.fillStyle = '#4CAF50'; ctx.fillRect(170, 590, 260, 3);
      // stats
      ctx.font = '800 40px Inter, sans-serif';
      for (var i = 0; i < 6; i++) {
        var col = i < 3 ? 0 : 1, row = i % 3, x = col ? 345 : 140, y = 650 + row * 52;
        ctx.textAlign = 'left'; ctx.fillStyle = '#fff'; ctx.fillText(vals[i], x, y);
        ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.font = '700 30px Inter, sans-serif'; ctx.fillText(STATS[i][0], x + 62, y);
        ctx.font = '800 40px Inter, sans-serif';
      }
      ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(299, 618, 2, 140);
      ctx.restore();
      // gold rim
      ctx.save(); shape(ctx); ctx.lineWidth = 8; var rim = ctx.createLinearGradient(0, 0, 600, 840); rim.addColorStop(0, '#f3e63a'); rim.addColorStop(.5, '#4CAF50'); rim.addColorStop(1, '#f3e63a'); ctx.strokeStyle = rim; ctx.stroke(); ctx.restore();
    }
    function blob(cb) { cv.toBlob(cb, 'image/png'); }
    function fname() { return 'carte-coerver-' + (($('pcName').value || 'joueur').toLowerCase().replace(/[^a-z0-9]+/g, '-')) + '.png'; }
    $('pcDownload').addEventListener('click', function () {
      blob(function (b) { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = fname(); document.body.appendChild(a); a.click(); a.remove(); });
    });
    $('pcShare').addEventListener('click', function () {
      blob(function (b) {
        var file = new File([b], fname(), { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file], title: 'Ma carte Coerver®', text: 'Ma carte de joueur Coerver® Tunisie ⚽' }).catch(function () {});
        else $('pcDownload').click();
      });
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
    draw();
  }

  /* ── 18. Juggling game ── */
  var gc = $('gCanvas');
  if (gc) {
    var g = gc.getContext('2d'), stage = gc.parentNode, ov = $('gOverlay');
    var W, H, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var ball, score = 0, best = 0, state = 'idle', last = 0;
    try { best = +localStorage.getItem('cvJuggleBest') || 0; } catch (e) {}
    $('gBest').textContent = best;
    gc._ball = function () { return ball; };
    function size() { W = stage.clientWidth; H = stage.clientHeight; gc.width = W * dpr; gc.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); if (state !== 'play') reset(); }
    function reset() { ball = { x: W / 2, y: H * .45, vx: 0, vy: 0, r: Math.max(26, Math.min(W, H) * .075), rot: 0 }; draw(); }
    function shareLink() {
      var t = 'J\'ai fait ' + best + ' jongles au Défi Coerver® ⚽ Tu peux battre mon record ? https://coervertunisie.tn/jeux.html#defi';
      $('gShare').href = 'https://wa.me/?text=' + encodeURIComponent(t);
    }
    shareLink();
    function drawBall(x, y, r, rot) {
      g.save(); g.translate(x, y); g.rotate(rot);
      g.fillStyle = '#fff'; g.beginPath(); g.arc(0, 0, r, 0, 6.283); g.fill();
      g.fillStyle = '#111'; g.beginPath();
      for (var i = 0; i < 5; i++) { var a = -Math.PI / 2 + i * 2 * Math.PI / 5; g.lineTo(Math.cos(a) * r * .38, Math.sin(a) * r * .38); }
      g.closePath(); g.fill();
      g.strokeStyle = '#111'; g.lineWidth = r * .07;
      for (var j = 0; j < 5; j++) { var b = -Math.PI / 2 + j * 2 * Math.PI / 5; g.beginPath(); g.moveTo(Math.cos(b) * r * .38, Math.sin(b) * r * .38); g.lineTo(Math.cos(b) * r * .95, Math.sin(b) * r * .95); g.stroke(); }
      g.restore();
    }
    function draw() {
      g.clearRect(0, 0, W, H);
      var bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0b2a12'); bg.addColorStop(1, '#174d22'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
      g.fillStyle = 'rgba(255,255,255,.04)'; for (var s = 0; s < 8; s++) if (s % 2) g.fillRect(0, s * H / 8, W, H / 8);
      g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 2; g.beginPath(); g.arc(W / 2, H, Math.min(W, H) * .35, Math.PI, 0); g.stroke();
      g.beginPath(); g.moveTo(0, H - 2); g.lineTo(W, H - 2); g.stroke();
      // shadow
      var sh = Math.max(.15, 1 - (H - ball.y) / H); g.fillStyle = 'rgba(0,0,0,' + (.35 * sh) + ')'; g.beginPath(); g.ellipse(ball.x, H - 8, ball.r * sh, ball.r * .25 * sh, 0, 0, 6.283); g.fill();
      drawBall(ball.x, ball.y, ball.r, ball.rot);
      if (state === 'play') { g.fillStyle = 'rgba(255,255,255,.9)'; g.font = '900 ' + Math.round(H * .16) + 'px Inter, sans-serif'; g.textAlign = 'center'; g.globalAlpha = .18; g.fillText(score, W / 2, H * .38); g.globalAlpha = 1; }
    }
    function loop(t) {
      var dt = Math.min((t - last) / 16.67, 2); last = t;
      var grav = .42 + Math.min(score, 40) * .012;
      ball.vy += grav * dt; ball.x += ball.vx * dt; ball.y += ball.vy * dt; ball.rot += ball.vx * .02 * dt;
      if (ball.x < ball.r) { ball.x = ball.r; ball.vx *= -.8; }
      if (ball.x > W - ball.r) { ball.x = W - ball.r; ball.vx *= -.8; }
      if (ball.y > H - ball.r) { ball.y = H - ball.r; return over(); }
      draw(); requestAnimationFrame(loop);
    }
    function over() {
      state = 'over'; draw();
      if (score > best) { best = score; try { localStorage.setItem('cvJuggleBest', best); } catch (e) {} $('gBest').textContent = best; shareLink(); }
      ov.innerHTML = '<b>' + score + ' jongle' + (score > 1 ? 's' : '') + '</b><span>' + (score >= best && score > 0 ? 'Nouveau record ! ' : '') + 'Touche pour rejouer</span>';
      ov.classList.add('show');
    }
    function hit(px, py) {
      if (state !== 'play') { state = 'play'; score = 0; $('gScore').textContent = 0; ov.classList.remove('show'); reset(); ball.vy = -12; last = performance.now(); requestAnimationFrame(loop); return; }
      var dx = px - ball.x, dy = py - ball.y;
      if (dx * dx + dy * dy < Math.pow(ball.r * 1.9, 2) && ball.vy > -6) {
        ball.vy = -(11 + Math.min(score, 30) * .12); ball.vx = -dx * .14 + (Math.random() - .5) * 2.4;
        score++; $('gScore').textContent = score;
        if (navigator.vibrate) navigator.vibrate(12);
      }
    }
    function pt(e) { var r = gc.getBoundingClientRect(), p = e.touches ? e.touches[0] : e; return [p.clientX - r.left, p.clientY - r.top]; }
    gc.addEventListener('pointerdown', function (e) { e.preventDefault(); var p = pt(e); hit(p[0], p[1]); });
    ov.addEventListener('pointerdown', function (e) { e.preventDefault(); hit(-999, -999); });
    window.addEventListener('resize', size);
    ov.classList.add('show');
    size();
  }
})();
