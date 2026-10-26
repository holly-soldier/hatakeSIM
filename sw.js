const CACHE_NAME = 'honofarm-v26.10.27.0044a';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// インストール時にキャッシュする
self.addEventListener('install', event => {
  // すぐに新しいService Workerをアクティブにする
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// アクティベート時に古いキャッシュを削除する
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // コントロールを即座に奪取
  self.clients.claim();
});

// フェッチ処理（ネットワークファースト戦略）
// 開発中のアップデートを反映しやすくするため、まずはネットワークを見に行き、
// オフラインならキャッシュを返す設定にしています。
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
