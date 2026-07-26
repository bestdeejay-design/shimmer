const CACHE = 'shimmer-v1';
const PRECACHE = [
    './',
    './Глава_01_Камень_Ответа.html',
    './Глава_02_Рисунки.html',
    './Глава_03_Храм_Без_Голоса.html',
    './Глава_04_Башня_Шпиль.html',
    './Глава_05_Сад_Камней.html',
    './Глава_06_Гробница_Первых.html',
    './Глава_07_Голос_из_пустыни.html',
    './Глава_08_Я_здесь.html',
    './Глава_09_Вспышка.html',
    './Глава_10_Тропа.html',
    './Глава_11_За_горизонт_часа.html',
    './Глава_12_Ты_опоздал_Схождение.html'
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
