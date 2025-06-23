const CACHE_NAME = 'mizan-cache-v1';
const urlsToCache = [
  './',
  './manifest.json',
  './images/icon-192x192.png',
  './images/icon-512x512.png',
  './index.html',
  './onboarding.html',
  './css/base.css',
  './css/themes.css',
  './css/layout.css',
  './css/components.css',
  './css/utilities.css',
  './css/dashboard.css',
  './js/script.js',
  './js/dashboard.js',
  './pages/assistant.html',
  './pages/budgets.html',
  './pages/calendar.html',
  './pages/currency.html',
  './pages/debts.html',
  './pages/goals.html',
  './pages/helpers.html',
  './pages/projects.html',
  './pages/settings.html',
  './pages/transactions.html'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});