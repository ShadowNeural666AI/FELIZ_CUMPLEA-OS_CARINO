/* ==========================================================================
   CUMPLE - MAIN.JS
   Inicialización general, sintetizador Web Audio y eventos principales
   ========================================================================== */

(function (window) {
  'use strict';

  /* ==========================================================================
     SINTETIZADOR WEB AUDIO (Efectos de sonido procedimentales delicados)
     No requiere archivos de audio externos, funciona 100% offline y sin latencia.
     ========================================================================== */
  var audioCtx = null;
  var soundEnabled = true;

  function getAudioContext() {
    if (!audioCtx) {
      var AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      try {
        audioCtx.resume().catch(function () { });
      } catch (err) { }
    }
    return audioCtx;
  }

  function playBlow() {
    if (!soundEnabled) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;

      // Generar ruido blanco filtrado simulando soplido suave de velas
      var bufferSize = ctx.sampleRate * 0.55;
      var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.4;
      }

      var noise = ctx.createBufferSource();
      noise.buffer = buffer;

      var filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.55);

      var gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.58);
    } catch (e) {
      // Silencioso en caso de bloqueo del navegador
    }
  }

  function playChime() {
    if (!soundEnabled) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;

      var notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Acorde mayor brillante)
      notes.forEach(function (freq, idx) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.85);
      });
    } catch (e) { }
  }

  function playPop() {
    if (!soundEnabled) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;

      var osc = ctx.createOscillator();
      var gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch (e) { }
  }

  function playPaper() {
    if (!soundEnabled) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;

      var bufferSize = ctx.sampleRate * 0.25;
      var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.15;
      }

      var noise = ctx.createBufferSource();
      noise.buffer = buffer;

      var filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2200;
      filter.Q.value = 1.2;

      var gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.58);
    } catch (e) { }
  }

  function playPageFlip() {
    if (!soundEnabled) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;

      var bufferSize = ctx.sampleRate * 0.35;
      var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.22;
      }

      var noise = ctx.createBufferSource();
      noise.buffer = buffer;

      var filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.35);

      var gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.58);
    } catch (e) { }
  }

  function playHarp() {
    if (!soundEnabled) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;

      var arpeggio = [440, 554.37, 659.25, 880, 1108.73, 1318.51]; // A, C#, E
      arpeggio.forEach(function (freq, idx) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + idx * 0.07 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 1.25);
      });
    } catch (e) { }
  }

  window.AudioManager = {
    playBlow: playBlow,
    playChime: playChime,
    playPop: playPop,
    playPaper: playPaper,
    playPageFlip: playPageFlip,
    playHarp: playHarp,
    toggleSound: function () {
      soundEnabled = !soundEnabled;
      return soundEnabled;
    },
    isSoundEnabled: function () {
      return soundEnabled;
    }
  };

  /* ==========================================================================
     LÓGICA DE LA TORTA Y VELAS (PANTALLA 1)
     ========================================================================== */
  var cake = document.getElementById("cake");
  var wishBtn = document.getElementById("wish-btn");
  var blown = false;

  function blowCandles() {
    if (blown) return;
    blown = true;

    // Reproducir efectos de sonido
    playBlow();
    setTimeout(playChime, 300);

    // Animación visual de apagar velas (humo)
    if (cake) cake.classList.add("out");
    if (wishBtn) wishBtn.disabled = true;

    // Ráfagas secuenciales de confeti celebratorio
    if (window.ParticlesManager) {
      window.ParticlesManager.confetti(window.innerWidth / 2, window.innerHeight * 0.35, 100);
      setTimeout(function () {
        window.ParticlesManager.confetti(window.innerWidth * 0.25, window.innerHeight * 0.4, 50);
      }, 250);
      setTimeout(function () {
        window.ParticlesManager.confetti(window.innerWidth * 0.75, window.innerHeight * 0.4, 50);
      }, 480);
    }

    // Transición suave hacia la pantalla 2 (Sobre de deseos)
    setTimeout(function () {
      if (window.NavigationManager) {
        window.NavigationManager.goTo(2);
      }
    }, 1600);
  }

  function resetCake() {
    blown = false;
    if (cake) cake.classList.remove("out");
    if (wishBtn) wishBtn.disabled = false;
  }

  /* ==========================================================================
     INICIALIZACIÓN GENERAL DE LA APLICACIÓN
     ========================================================================== */
  document.addEventListener("DOMContentLoaded", function () {
    // 1. Inicializar módulos
    if (window.EnvelopeManager) window.EnvelopeManager.init();
    if (window.GiftsManager) window.GiftsManager.init();
    if (window.DiaryManager) window.DiaryManager.init();
    if (window.NavigationManager) window.NavigationManager.init();

    // 2. Eventos de la torta de bienvenida
    if (wishBtn) wishBtn.addEventListener("click", blowCandles);
    if (cake) cake.addEventListener("click", blowCandles);

    // 3. Botón de control de audio / sonido
    var audioToggleBtn = document.getElementById("audio-toggle");
    if (audioToggleBtn) {
      audioToggleBtn.addEventListener("click", function () {
        var active = window.AudioManager.toggleSound();
        audioToggleBtn.setAttribute("aria-label", active ? "Silenciar efectos de sonido" : "Activar efectos de sonido");
        audioToggleBtn.innerHTML = active ? "🔔" : "🔕";
      });
    }

    // 4. Desbloqueo inicial del contexto de audio en primera interacción
    var userInteracted = false;
    function unlockAudio() {
      if (!userInteracted) {
        userInteracted = true;
        getAudioContext();
        window.removeEventListener("click", unlockAudio);
        window.removeEventListener("touchstart", unlockAudio);
      }
    }
    window.addEventListener("click", unlockAudio);
    window.addEventListener("touchstart", unlockAudio);
  });

  window.MainApp = {
    blowCandles: blowCandles,
    resetCake: resetCake,
  };

})(window);
