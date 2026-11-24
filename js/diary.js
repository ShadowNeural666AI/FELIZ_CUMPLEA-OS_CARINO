/* ==========================================================================
   CUMPLE - DIARY.JS
   Lógica e interactividad del Libro 3D de Recuerdos (Diario de Cumpleaños)
   ========================================================================== */

(function (window) {
  'use strict';

  var book = document.getElementById("book");
  var shift = document.getElementById("book-shift");
  var leaves = [];
  var N = 0;
  var cur = 0;
  var zTimers = [];
  var tTimers = [];
  var closeTimer = 0;
  var wasFlipped = [];

  function renderBook(animated) {
    if (!book || !leaves.length) return;

    leaves.forEach(function (leaf, i) {
      var isFlipped = i < cur;
      var z = isFlipped ? i + 1 : N - i;

      if (isFlipped !== wasFlipped[i]) {
        wasFlipped[i] = isFlipped;
        leaf.classList.toggle("flipped", isFlipped);

        clearTimeout(zTimers[i]);
        clearTimeout(tTimers[i]);

        if (animated) {
          leaf.style.zIndex = 50;
          leaf.classList.add("turning");

          zTimers[i] = setTimeout(function () {
            leaf.style.zIndex = z;
          }, 600);

          tTimers[i] = setTimeout(function () {
            leaf.classList.remove("turning");
          }, 1150);
        } else {
          leaf.style.zIndex = z;
          leaf.classList.remove("turning");
        }
      } else if (!animated) {
        leaf.style.zIndex = z;
      }
    });

    clearTimeout(closeTimer);
    if (cur === 0) {
      if (animated) {
        closeTimer = setTimeout(function () {
          book.classList.add("is-closed");
        }, 1150);
      } else {
        book.classList.add("is-closed");
      }
    } else {
      book.classList.remove("is-closed");
    }

    if (shift) {
      shift.classList.toggle("closed", cur === 0);
    }
  }

  function flipTo(targetIndex) {
    targetIndex = Math.max(0, Math.min(N, targetIndex));
    if (targetIndex === cur) return;

    cur = targetIndex;
    renderBook(true);

    // Sonido de paso de hoja realista
    if (window.AudioManager && window.AudioManager.playPageFlip) {
      window.AudioManager.playPageFlip();
    }

    // Celebración cuando se llega a la última página del diario
    if (cur === N) {
      setTimeout(function () {
        if (window.ParticlesManager) {
          window.ParticlesManager.confetti(window.innerWidth / 2, window.innerHeight * 0.4, 60);
        }
        if (window.AudioManager && window.AudioManager.playChime) {
          window.AudioManager.playChime();
        }
      }, 700);
    }
  }

  function initDiary() {
    book = document.getElementById("book");
    shift = document.getElementById("book-shift");
    if (!book) return;

    leaves = Array.prototype.slice.call(document.querySelectorAll(".leaf"));
    N = leaves.length;
    cur = 0;
    wasFlipped = leaves.map(function () { return false; });

    // Clic en las hojas: la parte derecha avanza; la parte izquierda retrocede
    leaves.forEach(function (leaf, i) {
      leaf.addEventListener("click", function (e) {
        // Evitar doble disparo si se hace clic en elementos interactivos internos
        flipTo(i >= cur ? i + 1 : i);
      });
    });

    // Clic en la base (página fija derecha de cierre) retrocede
    var base = document.querySelector(".base");
    if (base) {
      base.addEventListener("click", function () {
        flipTo(cur - 1);
      });
    }

    // Soporte para teclado accesible en portada
    var coverFace = document.getElementById("cover-face");
    if (coverFace) {
      coverFace.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (cur === 0) flipTo(1);
        }
      });
    }

    // Navegación por teclas de flecha
    document.addEventListener("keydown", function (e) {
      var step4 = document.getElementById("step4");
      if (!step4 || !step4.classList.contains("active")) return;

      if (e.key === "ArrowRight") {
        flipTo(cur + 1);
      } else if (e.key === "ArrowLeft") {
        flipTo(cur - 1);
      }
    });

    // Soporte para gestos táctiles (Swipe en smartphones)
    var touchStartX = null;
    book.addEventListener("touchstart", function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    book.addEventListener("touchend", function (e) {
      if (touchStartX === null) return;
      var diffX = e.changedTouches[0].clientX - touchStartX;
      touchStartX = null;

      if (diffX < -45) {
        // Deslizar hacia la izquierda -> avanzar página
        flipTo(cur + 1);
      } else if (diffX > 45) {
        // Deslizar hacia la derecha -> retroceder página
        flipTo(cur - 1);
      }
    }, { passive: true });

    renderBook(false);
  }

  function resetDiary() {
    cur = 0;
    renderBook(false);
  }

  window.DiaryManager = {
    init: initDiary,
    flipTo: flipTo,
    reset: resetDiary,
  };

})(window);
