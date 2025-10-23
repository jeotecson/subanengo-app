// public/sw.js

const CACHE_NAME = "subanengo-cache-v1";
const urlsToCache = [
  "/",
  "/learn",
  "/quests",
  "/leaderboard",
  "/courses",
  "/admin",
  "/~offline",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching essential pages");
      return cache.addAll(urlsToCache);
    })
  );
});
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || !event.request.url.startsWith("http")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log("Service Worker: Serving from cache:", event.request.url);
        return response;
      }

      return fetch(event.request).catch(() => {
        if (event.request.destination === "document") {
          console.log("Service Worker: Offline, serving fallback page");
          return caches.match("/~offline");
        }
      });
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log("Service Worker: Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});