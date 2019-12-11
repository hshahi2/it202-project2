const staticCacheName = 'site-static_v3';
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/pages/_list.html',
    '/manifest.json',
    '/pages/_map.html',
    '/pages/_search.html',
]

//
// install service worker
// 
self.addEventListener('install', evt => {
    console.log('service worker has been installed');
    evt.waitUntil(    
        caches.open(staticCacheName).then(cache => {
        console.log('caching shell assets');
        cache.addAll(assets);
    }));
}); 

//
// activate service worker 
// 
self.addEventListener('activate', evt => {
    console.log('service worker has been activated');
    evt.waitUntil(
        caches.keys().then(keys => {
            console.log(keys);
            return Promise.all(keys
                              .filter(key => key !== staticCacheName)
                              .map(key => caches.delete(key))
                              )
        })
    );
}); 
//
// fetch event
// 
self.addEventListener('fetch', evt => {
    console.log('fetch event', evt);
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request);
        })
    );   
}); 