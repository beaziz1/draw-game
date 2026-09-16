const CACHE_NAME="symmetry-drawing-v1";
const FILES=["./","./index.html","./manifest.json","./service-worker.js","./icon-192.png"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(FILES))));
self.addEventListener("fetch",event=>event.respondWith(caches.match(event.request).then(r=>r||fetch(event.request))));
