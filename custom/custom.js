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
        // Исключаем кликабельные элементы и всё, что в хедере (☰, 🔍, ⚙)
        if (target.closest('a, button, input, select, textarea, [role="button"], label, #mdbook-menu-bar')) return;

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
        if (e.target.closest('a, button, input, select, textarea, [role="button"], label, #mdbook-menu-bar')) return;

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

// ===== ⚙ Шестерёнка — меню настроек =====
(function() {
    'use strict';

    let menuVisible = false;

    const THEMES = ['light', 'rust', 'coal', 'navy', 'ayu'];

    // Создаём overlay
    const overlay = document.createElement('div');
    overlay.id = 'mdbook-settings-overlay';

    // Создаём меню
    const menu = document.createElement('div');
    menu.id = 'mdbook-settings-menu';
    menu.innerHTML =
        '<button class="menu-action" data-action="sidebar">' +
            '<span class="icon">☰</span> Содержание' +
        '</button>' +
        '<button class="menu-action" data-action="search">' +
            '<span class="icon">🔍</span> Поиск' +
        '</button>' +
        '<hr class="menu-divider">' +
        '<div class="settings-section-title">Оформление</div>' +
        '<div class="control-row">' +
            '<label>Тема</label>' +
            '<select id="shimmer-theme-select">' +
                '<option value="auto">Auto</option>' +
                '<option value="light">Light</option>' +
                '<option value="rust">Rust</option>' +
                '<option value="coal">Coal</option>' +
                '<option value="navy">Navy</option>' +
                '<option value="ayu">Ayu</option>' +
            '</select>' +
        '</div>' +
        '<div class="control-row">' +
            '<label>Фон</label>' +
            '<select id="bg-select">' +
                '<option value="default">Обычный</option>' +
                '<option value="sepia">Сепия</option>' +
                '<option value="night">Ночь</option>' +
            '</select>' +
        '</div>' +
        '<hr class="menu-divider">' +
        '<div class="settings-section-title">Чтение</div>' +
        '<div class="control-row">' +
            '<label>Шрифт</label>' +
            '<input type="range" id="fs-slider" min="14" max="26" value="18" step="1">' +
            '<span class="value" id="fs-value">18</span>' +
        '</div>' +
        '<div class="control-row">' +
            '<label>Интервал</label>' +
            '<input type="range" id="lh-slider" min="1.4" max="2.2" value="1.75" step="0.05">' +
            '<span class="value" id="lh-value">1.8</span>' +
        '</div>' +
        '<div class="control-row">' +
            '<label>Ширина</label>' +
            '<input type="range" id="wd-slider" min="580" max="860" value="720" step="10">' +
            '<span class="value" id="wd-value">720</span>' +
        '</div>' +
        '<hr class="menu-divider">' +
        '<button class="menu-action" data-action="print">' +
            '<span class="icon">🖨</span> Печать' +
        '</button>';

    document.body.appendChild(overlay);
    document.body.appendChild(menu);

    // Добавляем ⚙ кнопку в правую часть хедера
    const rightButtons = document.querySelector('.menu-bar .right-buttons');
    if (rightButtons) {
        const gearBtn = document.createElement('button');
        gearBtn.id = 'mdbook-header-settings';
        gearBtn.className = 'icon-button';
        gearBtn.type = 'button';
        gearBtn.title = 'Настройки';
        gearBtn.setAttribute('aria-label', 'Настройки');
        gearBtn.textContent = '⚙';
        rightButtons.appendChild(gearBtn);

        gearBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu(!menuVisible);
        });
    }

    // --- Элементы управления ---
    const fsSlider = document.getElementById('fs-slider');
    const lhSlider = document.getElementById('lh-slider');
    const wdSlider = document.getElementById('wd-slider');
    const bgSelect = document.getElementById('bg-select');
    const themeSelect = document.getElementById('shimmer-theme-select');
    const fsVal = document.getElementById('fs-value');
    const lhVal = document.getElementById('lh-value');
    const wdVal = document.getElementById('wd-value');

    const html = document.documentElement;
    const page = document.querySelector('.page');

    // --- Загрузка сохранённых настроек ---
    const saved = JSON.parse(localStorage.getItem('shimmer-settings') || '{}');

    if (saved.fontSize) {
        html.style.fontSize = saved.fontSize + 'px';
        fsSlider.value = saved.fontSize;
        fsVal.textContent = saved.fontSize;
    }
    if (saved.lineHeight) {
        html.style.lineHeight = saved.lineHeight;
        lhSlider.value = saved.lineHeight;
        lhVal.textContent = saved.lineHeight;
    }
    if (saved.width && page) {
        page.style.maxWidth = saved.width + 'px';
        wdSlider.value = saved.width;
        wdVal.textContent = saved.width;
    }
    if (saved.bg) {
        bgSelect.value = saved.bg;
        applyBg(saved.bg);
    }

    // Текущая тема из localStorage
    const currentTheme = localStorage.getItem('mdbook-theme') || 'light';
    if (currentTheme === 'light' || currentTheme === 'rust' || currentTheme === 'coal' || currentTheme === 'navy' || currentTheme === 'ayu') {
        themeSelect.value = currentTheme;
    }

    function save() {
        localStorage.setItem('shimmer-settings', JSON.stringify({
            fontSize: parseInt(fsSlider.value),
            lineHeight: parseFloat(lhSlider.value),
            width: parseInt(wdSlider.value),
            bg: bgSelect.value
        }));
    }

    function applyBg(mode) {
        if (mode === 'sepia') {
            html.style.setProperty('--bg', '#f4ecd8');
            html.style.setProperty('--fg', '#4a3c28');
        } else if (mode === 'night') {
            html.style.setProperty('--bg', '#0a0a0a');
            html.style.setProperty('--fg', '#888888');
        } else {
            html.style.removeProperty('--bg');
            html.style.removeProperty('--fg');
        }
        save();
    }

    function applyTheme(theme) {
        html.classList.remove('light', 'rust', 'coal', 'navy', 'ayu');
        html.classList.add(theme);
        localStorage.setItem('mdbook-theme', theme);
    }

    function toggleMenu(show) {
        menuVisible = show;
        menu.classList.toggle('visible', show);
        overlay.classList.toggle('visible', show);
        const btn = document.getElementById('mdbook-header-settings');
        if (btn) btn.classList.toggle('active', show);
    }

    // --- События ---
    overlay.addEventListener('click', function() {
        toggleMenu(false);
    });

    // Кнопки действий (Содержание, Поиск, Печать)
    menu.querySelectorAll('[data-action]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            if (action === 'sidebar') {
                const toggle = document.getElementById('mdbook-sidebar-toggle');
                if (toggle) toggle.click();
            } else if (action === 'search') {
                const toggle = document.getElementById('mdbook-search-toggle');
                if (toggle) toggle.click();
            } else if (action === 'print') {
                window.print();
            }
            toggleMenu(false);
        });
    });

    // Тема
    themeSelect.addEventListener('change', function() {
        applyTheme(this.value);
    });

    // Фон
    bgSelect.addEventListener('change', function() {
        applyBg(this.value);
    });

    // Слайдеры
    fsSlider.addEventListener('input', function() {
        const v = this.value;
        html.style.fontSize = v + 'px';
        fsVal.textContent = v;
        save();
    });

    lhSlider.addEventListener('input', function() {
        const v = parseFloat(this.value).toFixed(2);
        html.style.lineHeight = v;
        lhVal.textContent = v;
        save();
    });

    wdSlider.addEventListener('input', function() {
        const v = this.value;
        if (page) page.style.maxWidth = v + 'px';
        wdVal.textContent = v;
        save();
    });

    // Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menuVisible) {
            toggleMenu(false);
        }
    });
})();

// ===== Простая ссылка на другую версию =====
(function() {
    var path = window.location.pathname;
    var isEn = path.indexOf('/en/') === 0 || path === '/en' || path === '/en/';
    var rb = document.querySelector('.menu-bar .right-buttons');
    if (!rb) return;
    var a = document.createElement('a');
    a.href = isEn ? '/' : '/en/';
    a.className = 'icon-button';
    a.textContent = isEn ? 'RU' : 'EN';
    a.title = isEn ? 'Русская версия' : 'English version';
    a.setAttribute('aria-label', a.title);
    rb.appendChild(a);
})();

// ===== 7/8 — Регистрация Service Worker (Offline) =====
(function() {
    'use strict';
    if ('serviceWorker' in navigator) {
        // Вычисляем путь к sw.js относительно корня сайта (работает с любой вложенности)
        var path = window.location.pathname;
        var root = path.substring(0, path.indexOf('/', 1) + 1);
        navigator.serviceWorker.register(root + 'sw.js').catch(function() {});
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
            // Закрываем ⚙ меню, если открыто
            const menu = document.getElementById('mdbook-settings-menu');
            if (menu && menu.classList.contains('visible')) {
                const overlay = document.getElementById('mdbook-settings-overlay');
                if (overlay) overlay.classList.remove('visible');
                menu.classList.remove('visible');
                const btn = document.getElementById('mdbook-header-settings');
                if (btn) btn.classList.remove('active');
            }
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

        const label = document.createElement('div');
        label.id = 'shimmer-progress-label';
        label.textContent = '0%';
        document.body.appendChild(label);

        function updateScrollProgress() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                const pct = Math.min(100, Math.round((scrollTop / docHeight) * 100));
                label.textContent = pct + '%';
            } else {
                label.textContent = '100%';
            }
        }

        updateScrollProgress();
        window.addEventListener('scroll', updateScrollProgress, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildProgressBar);
    } else {
        buildProgressBar();
    }
})();
