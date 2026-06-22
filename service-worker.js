const CACHE_NAME="korbo-beta-v075";
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(["./","./index.html","./style.css","./app.js","./data.js","./config.js","./manifest.json"])));
  self.skipWaiting();
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>{if(k!==CACHE_NAME)return caches.delete(k)}))));
  self.clients.claim();
});
self.addEventListener("fetch",e=>{
  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});
