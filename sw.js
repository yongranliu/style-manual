// 离线缓存：页面、照片、图标和字体先用缓存，后台再更新；AI、天气等接口一律走网络
const CACHE = 'xing-v1';
const CORE = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
const CACHEABLE = [self.location.origin, 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || !CACHEABLE.includes(url.origin)) return;
  // 页面本身：先网络（拿到最新版），断网时用缓存
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(cc => cc.put('./index.html', c)); return r }).catch(() => caches.match('./index.html')));
    return;
  }
  // 其他静态资源：缓存优先，同时后台刷新
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(req);
    const net = fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r }).catch(() => hit);
    return hit || net;
  }));
});
