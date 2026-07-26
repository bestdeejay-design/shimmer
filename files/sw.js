const CACHE = 'shimmer-v1';
const PRECACHE = [
    './',
    './kai/Глава_01_Камень_Ответа.html',
    './kai/Глава_02_Рисунки.html',
    './kai/Глава_03_Храм_Без_Голоса.html',
    './kai/Глава_04_Башня_Шпиль.html',
    './kai/Глава_05_Сад_Камней.html',
    './kai/Глава_06_Гробница_Первых.html',
    './kai/Глава_07_Голос_из_пустыни.html',
    './kai/Глава_08_Я_здесь.html',
    './kai/Глава_09_Вспышка.html',
    './kai/Глава_10_Тропа.html',
    './kai/Глава_11_За_горизонт_часа.html',
    './kai/Глава_12_Ты_опоздал_Схождение.html',
    './lira/Пролог_Схождение_Лира.html',
    './lira/Глава_Лиры_01_Рождённая_знающей.html',
    './lore/psi-stream.html',
    './lore/the-architects.html',
    './lore/the-shimmer.html',
    './lore/timeline.html',
    './lore/world-of-en-ra.html',
    './lore/world-of-kai.html',
    './lore/world-of-lira.html'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE).then(function(cache) {
            return cache.addAll(PRECACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.filter(function(k) { return k !== CACHE; })
                    .map(function(k) { return caches.delete(k); })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        caches.match(event.request).then(function(cached) {
            return cached || fetch(event.request).then(function(response) {
                return caches.open(CACHE).then(function(cache) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        }).catch(function() {
            return caches.match('./index.html');
        })
    );
});
