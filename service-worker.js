const CACHE_NAME = "draw-pwa-v2";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

// Install new service worker
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

// Delete old caches
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

// Always check the network first
self.addEventListener("fetch", event => {
    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                // Save the newest version in cache
                const responseClone = networkResponse.clone();

                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseClone);
                });

                return networkResponse;
            })
            .catch(() => {
                // If offline, use cached version
                return caches.match(event.request);
            })
    );
});
