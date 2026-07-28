const CACHE = 'shimmer-v3';

self.addEventListener('install', function(event) {
    // Не прекешируем ничего — даём страницам кешироваться по мере посещения
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

    // HTML-страницы: сначала сеть (всегда свежая), при офлайне — из кеша
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).then(function(response) {
                return caches.open(CACHE).then(function(cache) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            }).catch(function() {
                return caches.match(event.request).then(function(cached) {
                    return cached || caches.match('./index.html');
                });
            })
        );
        return;
    }

    // Ассеты (CSS/JS/шрифты): кеш в первую очередь
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
