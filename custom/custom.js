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

        if (Math.abs(dy) > Math.abs(dx) * 1.5) return;

        const target = e.target;
        if (target.closest('a, button, input, select, textarea, [role="button"]')) return;

        const w = window.innerWidth;
        const tapX = t.clientX;

        if (Math.abs(dx) > 40) {
            if (dx < 0) {
                clickNext();
            } else {
                clickPrev();
            }
            touchHandled = true;
            return;
        }

        if (Math.abs(dx) < 20) {
            if (tapX < w * 0.3) {
                clickPrev();
            } else if (tapX > w * 0.7) {
                clickNext();
            }
            touchHandled = true;
        }
    }, { passive: true });

    document.addEventListener('click', function(e) {
        if (e.target.closest('a, button, input, select, textarea, [role="button"]')) return;

        const w = window.innerWidth;
        if (w > 900) return;
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

// ===== 2/8 — Закрытие сайдбара жестом + оверлей =====
(function() {
    'use strict';

    const sidebar = document.getElementById('mdbook-sidebar');
    const toggle = document.getElementById('mdbook-sidebar-toggle-anchor');
    if (!sidebar || !toggle) return;

    let sbTouchStartX = 0;

    sidebar.addEventListener('touchstart', function(e) {
        if (e.touches.length !== 1) return;
        sbTouchStartX = e.touches[0].clientX;
    }, { passive: true });

    sidebar.addEventListener('touchend', function(e) {
        if (!toggle.checked) return;
        if (e.changedTouches.length !== 1) return;
        const dx = e.changedTouches[0].clientX - sbTouchStartX;
        if (dx < -40) {
            toggle.checked = false;
            document.documentElement.classList.remove('sidebar-visible');
        }
    }, { passive: true });

    function setupOverlay() {
        const pageWrapper = document.querySelector('.page-wrapper');
        if (!pageWrapper) return;

        pageWrapper.addEventListener('click', function(e) {
            if (!toggle.checked) return;
            if (e.target.closest('#mdbook-sidebar')) return;
            if (window.innerWidth < 1080) {
                toggle.checked = false;
                document.documentElement.classList.remove('sidebar-visible');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupOverlay);
    } else {
        setupOverlay();
    }
})();
