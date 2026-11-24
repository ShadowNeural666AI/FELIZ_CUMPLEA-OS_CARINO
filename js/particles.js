/* ==========================================================================
   CUMPLE - PARTICLES.JS
   Motor de partículas de confeti, corazones y destellos en Canvas
   ========================================================================== */

(function (window) {
  'use strict';

  // Paleta de confeti y partículas
  var modern = window.CSS && CSS.supports && CSS.supports("color", "oklch(0.7 0.1 10)");
  var COLS = modern
    ? [
        "oklch(0.73 0.145 7)",   // Rosa principal
        "oklch(0.89 0.075 18)",  // Rosa pastel
        "oklch(0.92 0.045 77)",  // Melocotón
        "oklch(0.93 0.046 13)",  // Rosa suave
        "oklch(0.72 0.095 16)",  // Rosa profundo
        "oklch(0.99 0.008 70)",  // Crema/Blanco
      ]
    : ["#F0789B", "#F9D7D9", "#F8E2CC", "#FFFCF7", "#E85D8D", "#FFF6E9"];

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Canvas Global de Confeti (#fx) ---------- */
  var fx = document.getElementById("fx");
  var fctx = fx ? fx.getContext("2d") : null;
  var bits = [];
  var fxRaf = 0;

  function sizeFx() {
    if (!fx) return;
    fx.width = window.innerWidth;
    fx.height = window.innerHeight;
  }

  if (fx) {
    sizeFx();
    window.addEventListener("resize", sizeFx);
  }

  function confetti(x, y, n) {
    if (reduced || !fctx) return;
    if (bits.length >= 150) return;
    n = Math.min(n || 40, 50);

    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2;
      var s = 3.5 + Math.random() * 7.5;
      bits.push({
        x: x,
        y: y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 4.5,
        r: Math.random() * 6.28,
        vr: (Math.random() - 0.5) * 0.4,
        w: 6 + Math.random() * 7,
        h: 4 + Math.random() * 6,
        c: COLS[(Math.random() * COLS.length) | 0],
        life: 115 + Math.random() * 55,
      });
    }

    if (!fxRaf) {
      fxRaf = requestAnimationFrame(fxLoop);
    }
  }

  function fxLoop() {
    if (!fctx) return;
    fctx.clearRect(0, 0, fx.width, fx.height);

    var liveCount = 0;
    for (var i = 0; i < bits.length; i++) {
      var b = bits[i];
      if (b.life > 0 && b.y < fx.height + 40) {
        bits[liveCount++] = b;
      }
    }
    bits.length = liveCount;

    for (var j = 0; j < bits.length; j++) {
      var p = bits[j];
      p.vy += 0.19;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      p.life--;

      fctx.save();
      fctx.globalAlpha = Math.min(1, p.life / 40);
      fctx.translate(p.x, p.y);
      fctx.rotate(p.r);
      fctx.fillStyle = p.c;
      fctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      fctx.restore();
    }

    fxRaf = bits.length ? requestAnimationFrame(fxLoop) : 0;
    if (!bits.length) {
      fctx.clearRect(0, 0, fx.width, fx.height);
    }
  }

  function burstAt(el, count) {
    if (!el) return;
    var r = el.getBoundingClientRect();
    confetti(r.left + r.width / 2, r.top + r.height / 2, count || 60);
  }

  /* ---------- Canvas de la Pantalla Final (#finale-canvas) ---------- */
  var fc = document.getElementById("finale-canvas");
  var fcx = fc ? fc.getContext("2d") : null;
  var fparts = [];
  var fframe = 0;
  var fraf = 0;
  var finaleBurstTimer = 0;

  function sizeFinale() {
    if (!fc) return;
    var r = fc.getBoundingClientRect();
    fc.width = Math.max(1, Math.round(r.width));
    fc.height = Math.max(1, Math.round(r.height));
  }

  function drawHeart(c, x, y, s) {
    c.beginPath();
    c.moveTo(x, y + s * 0.3);
    c.bezierCurveTo(x, y, x - s, y, x - s, y + s * 0.35);
    c.bezierCurveTo(x - s, y + s * 0.75, x, y + s * 0.9, x, y + s * 1.2);
    c.bezierCurveTo(x, y + s * 0.9, x + s, y + s * 0.75, x + s, y + s * 0.35);
    c.bezierCurveTo(x + s, y, x, y, x, y + s * 0.3);
    c.fill();
  }

  function spawnHeart(anyY) {
    if (!fc) return;
    fparts.push({
      t: "h",
      x: Math.random() * fc.width,
      y: anyY ? Math.random() * fc.height : fc.height + 35,
      s: 5 + Math.random() * 11,
      v: 0.65 + Math.random() * 1.35,
      w: Math.random() * 6.28,
      c: COLS[(Math.random() * 5) | 0],
      a: 0.35 + Math.random() * 0.45,
    });
  }

  function spawnSparkle() {
    if (!fc) return;
    var cx = fc.width * (0.12 + Math.random() * 0.76);
    var cy = fc.height * (0.1 + Math.random() * 0.45);
    var col = COLS[(Math.random() * COLS.length) | 0];

    for (var i = 0; i < 18; i++) {
      var a = (i / 18) * 6.28;
      var sp = 1.3 + Math.random() * 2.5;
      fparts.push({
        t: "s",
        x: cx,
        y: cy,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        c: col,
        life: 60,
        r: 1.8 + Math.random() * 1.6,
      });
    }
  }

  function floop() {
    if (!fcx || !fc) return;
    fcx.clearRect(0, 0, fc.width, fc.height);

    if (fframe % 15 === 0 && fparts.length < 75) {
      spawnHeart(false);
    }
    if (fframe % 110 === 0) {
      spawnSparkle();
    }
    fframe++;

    fparts = fparts.filter(function (p) {
      return p.t === "h" ? p.y > -45 : p.life > 0;
    });

    for (var i = 0; i < fparts.length; i++) {
      var p = fparts[i];
      if (p.t === "h") {
        p.y -= p.v;
        p.w += 0.03;
        p.x += Math.sin(p.w) * 0.65;
        fcx.globalAlpha = p.a;
        fcx.fillStyle = p.c;
        drawHeart(fcx, p.x, p.y, p.s);
      } else {
        p.vy += 0.032;
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        fcx.globalAlpha = Math.max(0, p.life / 60);
        fcx.fillStyle = p.c;
        fcx.beginPath();
        fcx.arc(p.x, p.y, p.r, 0, 6.28);
        fcx.fill();
      }
    }

    fcx.globalAlpha = 1;
    fraf = requestAnimationFrame(floop);
  }

  function startFinale() {
    stopFinale();
    sizeFinale();
    fparts = [];
    fframe = 0;

    for (var i = 0; i < 14; i++) {
      spawnHeart(true);
    }

    if (reduced) {
      for (var j = 0; j < fparts.length; j++) {
        var p = fparts[j];
        fcx.globalAlpha = p.a;
        fcx.fillStyle = p.c;
        drawHeart(fcx, p.x, p.y, p.s);
      }
      fcx.globalAlpha = 1;
    } else {
      floop();
      finaleBurstTimer = setTimeout(function () {
        confetti(window.innerWidth / 2, window.innerHeight * 0.3, 85);
      }, 350);
    }
  }

  function stopFinale() {
    if (fraf) {
      cancelAnimationFrame(fraf);
      fraf = 0;
    }
    if (finaleBurstTimer) {
      clearTimeout(finaleBurstTimer);
      finaleBurstTimer = 0;
    }
    if (fcx && fc) {
      fcx.clearRect(0, 0, fc.width, fc.height);
    }
  }

  window.addEventListener("resize", function () {
    if (document.getElementById("step5") && document.getElementById("step5").classList.contains("active")) {
      sizeFinale();
    }
  });

  // Exportar utilidades de partículas al objeto global
  window.ParticlesManager = {
    confetti: confetti,
    burstAt: burstAt,
    startFinale: startFinale,
    stopFinale: stopFinale,
    sizeFx: sizeFx,
    sizeFinale: sizeFinale,
  };

})(window);
