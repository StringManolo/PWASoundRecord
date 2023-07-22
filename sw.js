const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );

    // Solicitar permiso para notificaciones al registrar el Service Worker
    self.registration.showNotification('Solicitando permiso', {
      body: 'Haga clic para permitir notificaciones',
    });

});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  // Aquí puedes realizar alguna acción al hacer clic en la notificación, si lo deseas.
  // Por ejemplo, abrir una página o ejecutar una función específica.
});
