/* ==========================================================================
   CUMPLE - NAVIGATION.JS
   Controlador de flujo y navegación entre las pantallas de la experiencia
   ========================================================================== */

(function (window) {
  'use strict';

  var currentScreen = 1;
  var screens = [];

  function goTo(stepNumber) {
    stepNumber = parseInt(stepNumber, 10);
    if (!screens || !screens.length) {
      screens = Array.prototype.slice.call(document.querySelectorAll(".screen"));
    }
    if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > screens.length) return;

    currentScreen = stepNumber;

    screens.forEach(function (screen, index) {
      var isActive = (index === stepNumber - 1);
      screen.classList.toggle("active", isActive);
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    // Control de eventos especiales por pantalla
    if (stepNumber === 5) {
      if (window.ParticlesManager) {
        window.ParticlesManager.startFinale();
      }
      if (window.AudioManager && window.AudioManager.playHarp) {
        window.AudioManager.playHarp();
      }
    } else {
      if (window.ParticlesManager) {
        window.ParticlesManager.stopFinale();
      }
    }

    if (stepNumber === 1) {
      if (window.MainApp && window.MainApp.resetCake) {
        window.MainApp.resetCake();
      }
      if (window.EnvelopeManager && window.EnvelopeManager.reset) {
        window.EnvelopeManager.reset();
      }
    }
  }

  function celebrateAgain() {
    // Resetear diario
    if (window.DiaryManager && window.DiaryManager.reset) {
      window.DiaryManager.reset();
    }

    // Resetear regalos
    if (window.GiftsManager && window.GiftsManager.reset) {
      window.GiftsManager.reset();
    }

    // Resetear sobre
    if (window.EnvelopeManager && window.EnvelopeManager.reset) {
      window.EnvelopeManager.reset();
    }

    // Resetear torta y velas
    if (window.MainApp && window.MainApp.resetCake) {
      window.MainApp.resetCake();
    }

    // Volver a la pantalla 1
    goTo(1);
  }

  function initNavigation() {
    screens = Array.prototype.slice.call(document.querySelectorAll(".screen"));

    // Enlazar todos los botones que posean data-next
    document.querySelectorAll("[data-next]").forEach(function (button) {
      button.addEventListener("click", function () {
        var nextStep = button.getAttribute("data-next");
        goTo(nextStep);
      });
    });

    // Botón de celebrar de nuevo
    var replayBtn = document.getElementById("replay");
    if (replayBtn) {
      replayBtn.addEventListener("click", celebrateAgain);
    }
  }

  window.NavigationManager = {
    init: initNavigation,
    goTo: goTo,
    celebrateAgain: celebrateAgain,
    getCurrentScreen: function () { return currentScreen; }
  };

})(window);
