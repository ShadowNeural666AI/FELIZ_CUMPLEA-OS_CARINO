/* ==========================================================================
   CUMPLE - ENVELOPE.JS
   Lógica e interactividad del sobre 3D de deseos y apertura de carta
   ========================================================================== */

(function (window) {
  'use strict';

  var envelopeBtn = document.getElementById("envelope");
  var envelopeWrap = document.getElementById("envelope-wrap");
  var waxSeal = document.getElementById("wax-seal");
  var openPrompt = document.getElementById("open-prompt");
  var openedLetter = document.getElementById("opened-letter");
  var letterNext = document.getElementById("letter-next");
  var stageLeft = document.getElementById("stage-char-left");
  var stageRightEnv = document.getElementById("stage-right-env");
  var stagePedestal = document.getElementById("stage-pedestal");
  var envelopeHead = document.getElementById("envelope-head");
  var letterHead = document.getElementById("letter-head");
  var balloonLeft = document.getElementById("balloon-left");
  var balloonRight = document.getElementById("balloon-right");

  function openEnvelope() {
    if (!envelopeBtn || envelopeBtn.dataset.opened === "true") return;
    envelopeBtn.dataset.opened = "true";

    // Sonido sutil de papel / apertura
    if (window.AudioManager && window.AudioManager.playPaper) {
      window.AudioManager.playPaper();
    }

    // Efecto de rotación y apertura del sobre con escala 3D
    if (envelopeBtn) {
      envelopeBtn.style.animation = "envelope-open-burst 0.38s cubic-bezier(0.22, 1, 0.36, 1) both";
    }

    // Lanzar ráfaga de confeti y corazones desde el sobre
    if (window.ParticlesManager) {
      window.ParticlesManager.confetti(window.innerWidth / 2, window.innerHeight / 2, 70);
    }

    // Desplegar la experiencia deluxe de la carta (Imagen 4)
    setTimeout(function () {
      if (envelopeWrap) envelopeWrap.hidden = true;
      if (envelopeBtn) envelopeBtn.hidden = true;
      if (openPrompt) openPrompt.hidden = true;

      // Alternar encabezado a la versión deluxe (Imagen 4)
      if (envelopeHead) envelopeHead.hidden = true;
      if (letterHead) {
        letterHead.hidden = false;
        letterHead.style.animation = "page-in 0.45s ease both";
      }

      // Revelar personajes laterales y pedestal con animación
      if (stageLeft) {
        stageLeft.hidden = false;
        stageLeft.style.animation = "page-in 0.5s ease both";
      }
      if (stageRightEnv) {
        stageRightEnv.hidden = false;
        stageRightEnv.style.animation = "page-in 0.5s ease both";
      }
      if (stagePedestal) {
        stagePedestal.hidden = false;
        stagePedestal.style.animation = "page-in 0.5s ease both";
      }
      if (balloonLeft) balloonLeft.hidden = false;
      if (balloonRight) balloonRight.hidden = false;

      // Mostrar carta deluxe y botón de continuar (Imagen 4)
      if (openedLetter) {
        openedLetter.hidden = false;
        openedLetter.style.animation = "letter-unfold-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both";
      }
      if (letterNext) {
        letterNext.hidden = false;
        letterNext.style.animation = "button-arrive 0.4s ease both";
      }

      // Sonido celestial de campanillas al revelar la carta
      if (window.AudioManager && window.AudioManager.playChime) {
        window.AudioManager.playChime();
      }
    }, 320);
  }

  function resetEnvelope() {
    if (envelopeBtn) {
      envelopeBtn.dataset.opened = "false";
      envelopeBtn.style.animation = "";
      envelopeBtn.hidden = false;
    }
    if (envelopeWrap) {
      envelopeWrap.hidden = false;
    }
    if (openPrompt) openPrompt.hidden = false;

    if (stageLeft) stageLeft.hidden = true;
    if (stageRightEnv) stageRightEnv.hidden = true;
    if (stagePedestal) stagePedestal.hidden = true;
    if (balloonLeft) balloonLeft.hidden = true;
    if (balloonRight) balloonRight.hidden = true;

    if (envelopeHead) envelopeHead.hidden = false;
    if (letterHead) letterHead.hidden = true;

    if (openedLetter) openedLetter.hidden = true;
    if (letterNext) letterNext.hidden = true;
  }

  function initEnvelope() {
    envelopeBtn = document.getElementById("envelope");
    envelopeWrap = document.getElementById("envelope-wrap");
    waxSeal = document.getElementById("wax-seal");
    openPrompt = document.getElementById("open-prompt");
    openedLetter = document.getElementById("opened-letter");
    letterNext = document.getElementById("letter-next");
    stageLeft = document.getElementById("stage-char-left");
    stageRightEnv = document.getElementById("stage-right-env");
    stagePedestal = document.getElementById("stage-pedestal");
    envelopeHead = document.getElementById("envelope-head");
    letterHead = document.getElementById("letter-head");
    balloonLeft = document.getElementById("balloon-left");
    balloonRight = document.getElementById("balloon-right");

    if (envelopeBtn) {
      envelopeBtn.addEventListener("click", openEnvelope);
    }

    if (waxSeal) {
      waxSeal.addEventListener("click", function (e) {
        e.stopPropagation();
        openEnvelope();
      });
    }
  }

  window.EnvelopeManager = {
    init: initEnvelope,
    open: openEnvelope,
    reset: resetEnvelope,
  };

})(window);
