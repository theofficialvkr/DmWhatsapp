const CACHE_NAME = 'direct-message-cache-v1';
const ASSETS_TO_CACHE = [
    '/directmessage',
    'index.html',
    'css/styles.css',
    'js/app.js',
    'js/countryPhoneLengths.js',
    'images/dm.png',
    'manifest.json'
];

// Install event: caching static assets for offline use
self.addEventListener('install', (event) => {
    console.log('Service Worker Installed');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching important assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting(); // Immediately activate the new service worker
});

// Fetch event: serving files from cache or fetching from network if not cached
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((networkResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        }).catch(() => caches.match('/offline.html')) // Serve offline fallback
    );
});

// Activate event: cleaning up old caches if necessary
self.addEventListener('activate', (event) => {
    console.log('Service Worker Activated');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Listen for message event to update the service worker and notify the user
self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'skipWaiting') {
        self.skipWaiting(); // Force the waiting service worker to become active
    }
});
