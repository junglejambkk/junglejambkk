// Service Worker for Jungle Jam BKK
// Improves performance and SEO through caching

const CACHE_NAME = 'jungle-jam-bkk-v1';
const urlsToCache = [
    '/',
    '/events/',
    '/gallery/',
    '/merchandise/',
    '/tickets/',
    '/assets/css/main.css',
    '/assets/css/components.css',
    '/assets/css/responsive.css',
    '/assets/js/main.js',
    '/assets/js/animations.js',
    '/assets/js/navigation.js',
    '/assets/images/backgrounds/hero-rave.jpg',
    '/assets/images/rave/underground-moment.jpg',
    '/assets/images/dj/neon-dj-setup.jpg',
    '/assets/images/dj/turntable-neon.jpg',
    'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                
                // Clone the request because it's a stream
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then(function(response) {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clone the response because it's a stream
                    const responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

