// ========== Мерцание — контроль чтения ==========

(function() {
    'use strict';

    // --- Создаём панель управления ---
    const controls = document.createElement('div');
    controls.id = 'reading-controls';
    controls.innerHTML = `
        <label for="font-size-slider">Шрифт</label>
        <input type="range" id="font-size-slider" min="14" max="26" value="18" step="1">
        <label for="line-height-slider">Интервал</label>
        <input type="range" id="line-height-slider" min="1.4" max="2.2" value="1.75" step="0.05">
        <label for="width-slider">Ширина</label>
        <input type="range" id="width-slider" min="580" max="860" value="720" step="10">
        <label for="sepia-toggle">Сепия</label>
        <select id="sepia-toggle">
            <option value="off">Выкл</option>
            <option value="sepia">Сепия</option>
            <option value="night">Ночь</option>
        </select>
    `;
    document.body.appendChild(controls);

    // --- Загружаем сохранённые настройки ---
    const saved = JSON.parse(localStorage.getItem('shimmer-reader-settings') || '{}');

    const html = document.documentElement;
    const fontSizeSlider = document.getElementById('font-size-slider');
    const lineHeightSlider = document.getElementById('line-height-slider');
    const widthSlider = document.getElementById('width-slider');
    const sepiaToggle = document.getElementById('sepia-toggle');

    // Применяем сохранённые
    if (saved.fontSize) {
        html.style.fontSize = saved.fontSize + 'px';
        fontSizeSlider.value = saved.fontSize;
    }
    if (saved.lineHeight) {
        html.style.lineHeight = saved.lineHeight;
        lineHeightSlider.value = saved.lineHeight;
    }
    if (saved.width) {
        document.querySelector('.page').style.maxWidth = saved.width + 'px';
        widthSlider.value = saved.width;
    }
    if (saved.sepia) {
        sepiaToggle.value = saved.sepia;
        applySepia(saved.sepia);
    }

    // --- Сохраняем ---
    function saveSettings() {
        localStorage.setItem('shimmer-reader-settings', JSON.stringify({
            fontSize: parseInt(fontSizeSlider.value),
            lineHeight: parseFloat(lineHeightSlider.value),
            width: parseInt(widthSlider.value),
            sepia: sepiaToggle.value
        }));
    }

    function applySepia(mode) {
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
    }

    // --- События ---
    fontSizeSlider.addEventListener('input', function() {
        html.style.fontSize = this.value + 'px';
        saveSettings();
    });

    lineHeightSlider.addEventListener('input', function() {
        html.style.lineHeight = this.value;
        saveSettings();
    });

    widthSlider.addEventListener('input', function() {
        document.querySelector('.page').style.maxWidth = this.value + 'px';
        saveSettings();
    });

    sepiaToggle.addEventListener('change', function() {
        applySepia(this.value);
        saveSettings();
    });
})();
