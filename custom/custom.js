// ===== 1/8 — Тап/свайп по краям для перелистывания глав =====
(function() {
    'use strict';

    let touchStartX = 0;
    let touchStartY = 0;
    let touchHandled = false;

    document.addEventListener('touchstart', function(e) {
        if (e.touches.length !== 1) return;
        const t = e.touches[0];
        touchStartX = t.clientX;
        touchStartY = t.clientY;
        touchHandled = false;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        if (touchHandled) return;
        if (e.changedTouches.length !== 1) return;
        const t = e.changedTouches[0];

        const dx = t.clientX - touchStartX;
        const dy = t.clientY - touchStartY;

        // Если это был скролл (по вертикали больше, чем по горизонтали) — не вмешиваемся
        if (Math.abs(dy) > Math.abs(dx) * 1.5) return;

        const target = e.target;
        // Не срабатывать на кликабельных элементах
        if (target.closest('a, button, input, select, textarea, [role="button"]')) return;

        const w = window.innerWidth;
        const tapX = t.clientX;

        // Свайп влево/вправо
        if (Math.abs(dx) > 40) {
            if (dx < 0) {
                clickNext();
            } else {
                clickPrev();
            }
            touchHandled = true;
            return;
        }

        // Тап по левой/правой трети
        if (Math.abs(dx) < 20) {
            if (tapX < w * 0.3) {
                clickPrev();
            } else if (tapX > w * 0.7) {
                clickNext();
            }
            touchHandled = true;
        }
    }, { passive: true });

    // Клик левой/правой кнопкой мыши по краям (для удобства на десктопе)
    document.addEventListener('click', function(e) {
        // Только если клик не на кликабельном элементе
        if (e.target.closest('a, button, input, select, textarea, [role="button"]')) return;

        const w = window.innerWidth;
        // Не срабатывать на широких экранах (>900px) — там есть боковые нав-стрелки
        if (w > 900) return;

        // Только левая кнопка мыши
        if (e.button !== 0) return;

        const x = e.clientX;
        if (x < w * 0.3) {
            clickPrev();
        } else if (x > w * 0.7) {
            clickNext();
        }
    });

    function clickPrev() {
        const prev = document.querySelector('.nav-chapters.previous, .mobile-nav-chapters.previous');
        if (prev) prev.click();
    }

    function clickNext() {
        const next = document.querySelector('.nav-chapters.next, .mobile-nav-chapters.next');
        if (next) next.click();
    }
})();
