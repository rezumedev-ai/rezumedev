
// Cache name with version
const CACHE_NAME = 'rezume-cache-v1';

// Files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/custom-favicon.ico',
  '/custom-favicon.svg',
  '/sitemap.html',
  '/rss.xml',
  '/sitemap.xml'
];

// Install the service worker and cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and network strategy with fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Don't cache API calls or dynamic content
                if (!event.request.url.includes('/api/') && 
                    !event.request.url.includes('/dashboard/') && 
                    !event.request.url.includes('/resume-builder/')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        );
      })
      .catch(() => {
        // Fallback for offline pages
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});

// Clean up old caches when new service worker activated
self.addEventListener('activate', event => {
  const cacheAllowlist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
