const CACHE = 'bitacora-v5';
// jsPDF se precarga para poder generar el PDF sin señal
const URLS = ['./bitacora-parcelas.html', './manifest.json', './icon-192.png', './icon-512.png', 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'];
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxCzunEf1FZhJpnSfu5wetHilEeovRSlJfwt2zuB6ZlPRz2IkBDuYNvTwk1p3rV_e_zHw/exec';
const SYNC_TAG = 'sync-bitacoras';

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

/* ── Sync en segundo plano ──
   El navegador dispara 'sync' cuando regresa la conexion, aunque la app este cerrada
   (Android/Chrome). Si falla, se lanza error para que el navegador reintente. */
self.addEventListener('sync', function(e) {
  if (e.tag === SYNC_TAG) e.waitUntil(syncPendientes(true));
});

self.addEventListener('periodicsync', function(e) {
  if (e.tag === SYNC_TAG) e.waitUntil(syncPendientes(false));
});

self.addEventListener('message', function(e) {
  if (e.data === 'sync') e.waitUntil(syncPendientes(false));
});

function abrirDB() {
  return new Promise(function(res, rej) {
    var r = indexedDB.open('bitacora-v4', 1);
    r.onupgradeneeded = function(ev) {
      var d = ev.target.result;
      if (!d.objectStoreNames.contains('v')) d.createObjectStore('v', { keyPath: 'id', autoIncrement: true }).createIndex('nombre', 'nombre');
    };
    r.onsuccess = function(ev) { res(ev.target.result); };
    r.onerror = function(ev) { rej(ev.target.error); };
  });
}

function pendientes(db) {
  return new Promise(function(res, rej) {
    var t = db.transaction('v', 'readonly');
    var q = t.objectStore('v').getAll();
    q.onsuccess = function() { res(q.result.filter(function(v) { return !v.synced || (v.pdf && !v.dsync); })); };
    t.onerror = function() { rej(t.error); };
  });
}

function marcar(db, id, patch) {
  return new Promise(function(res, rej) {
    var t = db.transaction('v', 'readwrite');
    var s = t.objectStore('v');
    var q = s.get(id);
    q.onsuccess = function() { var d = q.result; if (d) { Object.assign(d, patch); s.put(d); } };
    t.oncomplete = function() { res(); };
    t.onerror = function() { rej(t.error); };
  });
}

function enviar(v) {
  var payload = encodeURIComponent(JSON.stringify({
    fecha: v.fecha, nombre: v.nombre, rol: v.rol, rancho: v.rancho, contrato: v.contrato,
    ha: v.ha, inv: v.inv, anio: v.anio, geo: v.geo, pts: v.pts, mal: v.mal, gc: v.gc, acciones: v.acciones
  }));
  return fetch(SCRIPT_URL + '?action=saveBitacora&payload=' + payload)
    .then(function(r) { return r.json(); })
    .then(function(j) { return !!j.ok; })
    .catch(function() { return false; });
}

// PDF + fotos a Drive por POST (text/plain evita el preflight CORS)
function enviarDrive(v) {
  return fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action: 'saveDrive', parcela: (v.rancho || '') + ' ' + (v.contrato || ''), nombre: v.pdfn, pdf: v.pdf, fotos: (v.fotos || []).map(function(f) { return f.d; }) })
  }).then(function(r) { return r.json(); })
    .then(function(j) { return !!j.ok; })
    .catch(function() { return false; });
}

// Un solo envio a la vez entre la app y el SW, para no duplicar filas en el Sheet
function conLock(fn) {
  if (self.navigator && navigator.locks) return navigator.locks.request('bitacora-sync', fn);
  return fn();
}

function syncPendientes(lanzarSiFalla) {
  return conLock(async function() {
    var db = await abrirDB();
    var lista = await pendientes(db);
    var ok = 0, fallo = 0;
    for (var i = 0; i < lista.length; i++) {
      var v = lista[i];
      if (!v.synced) { if (!(await enviar(v))) { fallo++; continue; } await marcar(db, v.id, { synced: true }); }
      if (v.pdf && !v.dsync) { if (!(await enviarDrive(v))) { fallo++; continue; } await marcar(db, v.id, { dsync: true, pdf: null }); }
      ok++;
    }
    db.close();
    if (ok) {
      var cs = await self.clients.matchAll({ includeUncontrolled: true });
      cs.forEach(function(c) { c.postMessage({ tipo: 'sincronizado', n: ok }); });
    }
    if (fallo && lanzarSiFalla) throw new Error(fallo + ' pendiente(s) sin enviar');
    return { ok: ok, fallo: fallo };
  });
}
