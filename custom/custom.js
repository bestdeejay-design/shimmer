// ========== Мерцание — контроль чтения ==========

(function() {
    'use strict';

    // --- Состояние ---
    let controlsVisible = false;

    // --- Контейнеры ---
    const overlay = document.createElement('div');
    overlay.id = 'reader-overlay';

    const toggle = document.createElement('button');
    toggle.id = 'reader-settings-toggle';
    toggle.innerHTML = '⚙';
    toggle.title = 'Настройки чтения';
    toggle.setAttribute('aria-label', 'Настройки чтения');

    const controls = document.createElement('div');
    controls.id = 'reader-controls';
    controls.innerHTML = `
        <div class="control-row">
            <label>Шрифт</label>
            <input type="range" id="fs-slider" min="14" max="26" value="18" step="1">
            <span class="value" id="fs-value">18</span>
        </div>
        <div class="control-row">
            <label>Интервал</label>
            <input type="range" id="lh-slider" min="1.4" max="2.2" value="1.75" step="0.05">
            <span class="value" id="lh-value">1.75</span>
        </div>
        <div class="control-row">
            <label>Ширина</label>
            <input type="range" id="wd-slider" min="580" max="860" value="720" step="10">
            <span class="value" id="wd-value">720</span>
        </div>
        <div class="control-row">
            <label>Фон</label>
            <select id="bg-select">
                <option value="default">Обычный</option>
                <option value="sepia">Сепия</option>
                <option value="night">Ночь</option>
            </select>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(toggle);
    document.body.appendChild(controls);

    // --- Загрузка сохранённых настроек ---
    const saved = JSON.parse(localStorage.getItem('shimmer-settings') || '{}');
    const html = document.documentElement;
    const page = document.querySelector('.page');

    // Элементы управления
    const fsSlider = document.getElementById('fs-slider');
    const lhSlider = document.getElementById('lh-slider');
    const wdSlider = document.getElementById('wd-slider');
    const bgSelect = document.getElementById('bg-select');
    const fsVal = document.getElementById('fs-value');
    const lhVal = document.getElementById('lh-value');
    const wdVal = document.getElementById('wd-value');

    // Применение сохранённых
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

    // --- Сохранение ---
    function save() {
        localStorage.setItem('shimmer-settings', JSON.stringify({
            fontSize: parseInt(fsSlider.value),
            lineHeight: parseFloat(lhSlider.value),
            width: parseInt(wdSlider.value),
            bg: bgSelect.value
        }));
    }

    function applyBg(mode) {
        const root = document.documentElement;
        if (mode === 'sepia') {
            root.style.setProperty('--bg', '#f4ecd8');
            root.style.setProperty('--fg', '#4a3c28');
        } else if (mode === 'night') {
            root.style.setProperty('--bg', '#0a0a0a');
            root.style.setProperty('--fg', '#888888');
        } else {
            root.style.removeProperty('--bg');
            root.style.removeProperty('--fg');
        }
        save();
    }

    // --- Toggle панели ---
    function showControls(show) {
        controlsVisible = show;
        controls.classList.toggle('visible', show);
        overlay.classList.toggle('visible', show);
        toggle.textContent = show ? '✕' : '⚙';
    }

    toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        showControls(!controlsVisible);
    });

    overlay.addEventListener('click', function() {
        showControls(false);
    });

    // --- События слайдеров ---
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

    bgSelect.addEventListener('change', function() {
        applyBg(this.value);
    });

    // --- Закрытие по Escape ---
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && controlsVisible) {
            showControls(false);
        }
    });
})();
