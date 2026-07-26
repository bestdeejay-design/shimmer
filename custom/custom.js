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

// ===== 5/8 — Сохранение прогресса чтения =====
(function() {
    'use strict';

    const LS_KEY = 'shimmer-last-chapter';
    const currentUrl = window.location.pathname.split('/').pop() || '';

    function getChapterTitle() {
        const sidebar = document.getElementById('mdbook-sidebar');
        if (!sidebar) return '';
        const links = sidebar.querySelectorAll('li.chapter-item a');
        for (let i = 0; i < links.length; i++) {
            const href = links[i].getAttribute('href');
            if (href && currentUrl.includes(href)) {
                return links[i].textContent.trim();
            }
        }
        return '';
    }

    // Сохраняем текущую главу
    const title = getChapterTitle();
    if (title) {
        localStorage.setItem(LS_KEY, JSON.stringify({ url: currentUrl, title: title }));
    }

    // Проверяем, не зашли ли мы на другую главу, чем в прошлый раз
    try {
        const prev = JSON.parse(localStorage.getItem('shimmer-last-visit') || '{}');
        const current = { url: currentUrl, title: title };
        localStorage.setItem('shimmer-last-visit', JSON.stringify(current));

        if (prev.url && prev.url !== currentUrl && prev.title && title) {
            const banner = document.createElement('div');
            banner.id = 'shimmer-continue-banner';
            banner.innerHTML = '<span>Продолжить с <a href="' + prev.url + '">' + prev.title + '</a></span> <button id="shimmer-continue-dismiss">&times;</button>';
            document.body.prepend(banner);

            document.getElementById('shimmer-continue-dismiss').addEventListener('click', function() {
                banner.remove();
            });
        }
    } catch(e) {}
})();

// ===== 4/8 — Авто-скрытие хедера =====
(function() {
    'use strict';

    const header = document.getElementById('mdbook-menu-bar');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;
    const HIDE_THRESHOLD = 80;

    function onScroll() {
        const sy = window.scrollY;
        const dy = sy - lastScrollY;

        if (Math.abs(dy) < 8) {
            ticking = false;
            return;
        }

        if (dy > 0 && sy > HIDE_THRESHOLD) {
            header.classList.add('shimmer-header-hidden');
        } else if (dy < 0) {
            header.classList.remove('shimmer-header-hidden');
        }

        lastScrollY = sy;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                onScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    document.addEventListener('touchstart', function(e) {
        const touch = e.touches[0];
        if (touch.clientY < 80) {
            header.classList.remove('shimmer-header-hidden');
        }
    }, { passive: true });
})();

// ===== 3/8 — Прогресс-бар внизу =====
(function() {
    'use strict';

    function buildProgressBar() {
        const sidebar = document.getElementById('mdbook-sidebar');
        if (!sidebar) return;

        const links = sidebar.querySelectorAll('li.chapter-item a');
        if (!links.length) return;

        const currentPath = window.location.pathname.split('/').pop() || '';

        let currentIdx = -1;
        links.forEach(function(a, i) {
            const href = a.getAttribute('href');
            if (href && currentPath.includes(href)) {
                currentIdx = i;
            }
        });

        if (currentIdx < 0) return;

        const total = links.length;
        const pct = total > 1 ? (currentIdx / (total - 1)) * 100 : 0;

        const container = document.createElement('div');
        container.id = 'shimmer-progress';
        container.setAttribute('aria-label', 'Progress');
        container.setAttribute('role', 'progressbar');
        container.setAttribute('aria-valuenow', Math.round(pct));
        container.setAttribute('aria-valuemin', '0');
        container.setAttribute('aria-valuemax', '100');

        const bar = document.createElement('div');
        bar.id = 'shimmer-progress-bar';
        bar.style.width = pct + '%';
        container.appendChild(bar);

        document.body.appendChild(container);

        container.addEventListener('click', function(e) {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const ratio = Math.max(0, Math.min(1, x / rect.width));
            const targetIdx = Math.round(ratio * (total - 1));
            const targetLink = links[targetIdx];
            if (targetLink) {
                window.location.href = targetLink.getAttribute('href');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildProgressBar);
    } else {
        buildProgressBar();
    }
})();
