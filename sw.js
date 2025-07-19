// SERVICE WORKER FOR PERFORMANCE OPTIMIZATION
// Caching, offline support, and performance monitoring

const CACHE_NAME = 'quran-pure-path-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/css/premium-animations.css',
    '/js/premium-interactions.js',
    '/js/advanced-features.js',
    '/assets/arabic-calligraphy-logo.png',
    '/assets/quran-book-3d-render.png',
    '/assets/divine-light-rays.png',
    '/assets/islamic-geometric-pattern-gold.png',
    '/assets/particle-system-elements.png'
];

// Network-first resources (always try network first)
const NETWORK_FIRST = [
    '/api/',
    '/search/',
    '/analytics/'
];

// Cache-first resources (serve from cache if available)
const CACHE_FIRST = [
    '/assets/',
    '/css/',
    '/js/',
    'https://fonts.googleapis.com/',
    'https://fonts.gstatic.com/'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Static files cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Error caching static files', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated successfully');
                return self.clients.claim();
            })
    );
});

// Fetch event - handle requests with different strategies
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http requests
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
    const url = new URL(request.url);
    
    try {
        // Network-first strategy for API calls
        if (NETWORK_FIRST.some(pattern => url.pathname.startsWith(pattern))) {
            return await networkFirst(request);
        }
        
        // Cache-first strategy for static assets
        if (CACHE_FIRST.some(pattern => url.href.includes(pattern) || url.pathname.startsWith(pattern))) {
            return await cacheFirst(request);
        }
        
        // Stale-while-revalidate for HTML pages
        if (request.headers.get('accept').includes('text/html')) {
            return await staleWhileRevalidate(request);
        }
        
        // Default to network-first
        return await networkFirst(request);
        
    } catch (error) {
        console.error('Service Worker: Error handling request', error);
        return await handleOffline(request);
    }
}

// Network-first strategy
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache successful responses
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Network failed, try cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// Cache-first strategy
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        // Update cache in background
        updateCache(request);
        return cachedResponse;
    }
    
    // Not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);
    
    // Always try to update from network
    const networkPromise = fetch(request)
        .then(response => {
            if (response.ok) {
                const cache = caches.open(DYNAMIC_CACHE);
                cache.then(c => c.put(request, response.clone()));
            }
            return response;
        })
        .catch(() => null);
    
    // Return cached version immediately if available
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Otherwise wait for network
    return await networkPromise;
}

// Update cache in background
async function updateCache(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response);
        }
    } catch (error) {
        // Silently fail background updates
    }
}

// Handle offline scenarios
async function handleOffline(request) {
    const url = new URL(request.url);
    
    // Try to find any cached version
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // For HTML requests, return offline page
    if (request.headers.get('accept').includes('text/html')) {
        const offlineResponse = await caches.match('/');
        if (offlineResponse) {
            return offlineResponse;
        }
    }
    
    // For images, return placeholder
    if (request.headers.get('accept').includes('image')) {
        return new Response(
            '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f0f0f0"/><text x="100" y="100" text-anchor="middle" fill="#999">Image Unavailable</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
        );
    }
    
    // Return generic offline response
    return new Response('Offline - Content not available', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain' }
    });
}

// Background sync for analytics and user data
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(syncUserData());
    }
});

async function syncUserData() {
    try {
        // Sync bookmarks, progress, and analytics data
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'SYNC_DATA',
                timestamp: Date.now()
            });
        });
    } catch (error) {
        console.error('Service Worker: Error syncing data', error);
    }
}

// Push notifications (for future use)
self.addEventListener('push', event => {
    if (!event.data) return;
    
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/assets/arabic-calligraphy-logo.png',
        badge: '/assets/arabic-calligraphy-logo.png',
        vibrate: [200, 100, 200],
        data: data.data,
        actions: [
            {
                action: 'open',
                title: 'Open',
                icon: '/assets/arabic-calligraphy-logo.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/arabic-calligraphy-logo.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Performance monitoring
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'PERFORMANCE_METRICS') {
        // Store performance metrics for analysis
        console.log('Performance metrics received:', event.data.metrics);
    }
});

// Cache management - clean up old entries
setInterval(() => {
    cleanupCache();
}, 24 * 60 * 60 * 1000); // Daily cleanup

async function cleanupCache() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const requests = await cache.keys();
        const now = Date.now();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        
        for (const request of requests) {
            const response = await cache.match(request);
            const dateHeader = response.headers.get('date');
            
            if (dateHeader) {
                const responseDate = new Date(dateHeader).getTime();
                if (now - responseDate > maxAge) {
                    await cache.delete(request);
                }
            }
        }
    } catch (error) {
        console.error('Service Worker: Error cleaning cache', error);
    }
}

// Preload critical resources
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'PRELOAD_RESOURCES') {
        event.waitUntil(preloadResources(event.data.resources));
    }
});

async function preloadResources(resources) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const promises = resources.map(url => {
            return fetch(url).then(response => {
                if (response.ok) {
                    return cache.put(url, response);
                }
            }).catch(() => {
                // Silently fail preloading
            });
        });
        
        await Promise.all(promises);
    } catch (error) {
        console.error('Service Worker: Error preloading resources', error);
    }
}

