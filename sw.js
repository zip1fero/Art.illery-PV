/* Art PV 1.9.13: αποθήκευση της εφαρμογής για χρήση χωρίς ίντερνετ */
const CACHE = 'artillery-pv-1.9.13';
const FILES = ['./', './index.html', './manifest.webmanifest', './apple-touch-icon.png', './icon-192.png', './icon-512.png', './favicon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('artillery-pv-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;      // χάρτες/server: όπως πριν
  if (u.pathname.endsWith('version.json')) return;                                 // έλεγχος έκδοσης: πάντα από τον server
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' }).then(r =>   // πάντα έλεγχος στον server για νεότερη έκδοση· χωρίς ίντερνετ από την αποθήκη
 { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); } return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
