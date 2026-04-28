const CACHE = 'bitacora-v3';
const URLS = ['./bitacora-parcelas.html', './manifest.json', './icon.svg'];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function(c) { return c.addAll(URLS); })
      .then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(ks) {
      return Promise.all(ks.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  // No cachear requests al Apps Script
  if (e.request.url.includes('script.google.com')) return;

  e.respondWith(
    caches.match(e.request).then(function(r) {
      return r || fetch(e.request).then(function(nr) {
        if (nr.ok) {
          var c = nr.clone();
          caches.open(CACHE).then(function(ca) { ca.put(e.request, c); });
        }
        return nr;
      }).catch(function() {
        return caches.match('./bitacora-parcelas.html');
      });
    })
  );
});
