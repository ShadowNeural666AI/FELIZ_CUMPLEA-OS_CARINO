/* ==========================================================================
   CUMPLE - GIFTS.JS
   Lógica e interactividad de las tarjetas 3D de regalos de cumpleaños
   ========================================================================== */

(function (window) {
  'use strict';

  function initGifts() {
    var giftButtons = document.querySelectorAll(".flip button");

    giftButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var card = button.closest(".flip");
        if (!card) return;

        var isFlipped = card.classList.contains("flipped");

        if (!isFlipped) {
          card.classList.add("flipped");
          button.setAttribute("aria-pressed", "true");

          // Sonido de desenvolvimiento / pop festivo
          if (window.AudioManager && window.AudioManager.playPop) {
            window.AudioManager.playPop();
          }

          // Explosión de confeti y corazones localizada en la tarjeta
          if (window.ParticlesManager) {
            window.ParticlesManager.burstAt(card, 50);
          }
        } else {
          // Permite volver a voltear si el usuario lo desea
          card.classList.remove("flipped");
          button.setAttribute("aria-pressed", "false");

          if (window.AudioManager && window.AudioManager.playPaper) {
            window.AudioManager.playPaper();
          }
        }
      });
    });
  }

  function resetGifts() {
    var flippedCards = document.querySelectorAll(".flip.flipped");
    flippedCards.forEach(function (card) {
      card.classList.remove("flipped");
      var btn = card.querySelector("button");
      if (btn) btn.setAttribute("aria-pressed", "false");
    });
  }

  window.GiftsManager = {
    init: initGifts,
    reset: resetGifts,
  };

})(window);
