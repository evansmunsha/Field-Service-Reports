const CACHE_NAME = "fsr-v1";
const APP_SHELL = [
  "/",
  "/offline.html",
  "/manifest.json",

  // Icons
  "/logo-96.png",
  "/logo-128.png",
  "/logo-144.png",
  "/logo-152.png",
  "/logo-192.png",
  "/logo-384.png",
  "/logo-512.png",
];

// -------- INSTALL --------
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

// -------- ACTIVATE --------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// -------- FETCH --------
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 🔒 Never cache auth or API calls
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/api/auth")) {
    event.respondWith(fetch(request));
    return;
  }

  // 🌐 Navigation requests (pages)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match("/offline.html")
      )
    );
    return;
  }

  // 🧠 Static assets: cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request).then((response) => {
          if (
            request.method === "GET" &&
            response.status === 200 &&
            response.type === "basic"
          ) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
      );
    })
  );
});
