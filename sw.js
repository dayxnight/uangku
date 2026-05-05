const CACHE_NAME = "v1_cache";
const urlsToCache = [
    "/",
    "/index.html",
    "/styles.css",
    "/script.js",
    "/theme.css",
    "/theme-dark.css",
    "/icon-192.png", // Tambahkan ini
    "/icon-512.png", // Tambahkan ini
    "https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js",
    "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
];

// Install Service Worker
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch data dari cache jika offline
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
