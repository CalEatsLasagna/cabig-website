const CACHE='site-cache-v1';const toCache=['/','/index.html','/styles/base.css','/scripts/main.js','/icons/icon-192.png','/icons/icon-512.png','/icons/favicon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(toCache)))});
self.addEventListener('fetch',e=>{e.respondWith((async()=>{const cache=await caches.open(CACHE);const cached=await cache.match(e.request);
const network=fetch(e.request).then(resp=>{cache.put(e.request,resp.clone());return resp}).catch(()=>cached);return cached||network})())});