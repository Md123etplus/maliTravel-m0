const CACHE_NAME = "mali-voyages-v1"
const urlsToCache = [
  "/",
  "/offline",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/images/logo.png",
  "/images/offline.svg",
  "/styles/globals.css",
]

// Installation du Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache ouvert")
      return cache.addAll(urlsToCache)
    }),
  )
})

// Activation du Service Worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// Stratégie de cache: Network first, falling back to cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la requête est réussie, on met en cache la réponse
        if (event.request.method === "GET") {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }
        return response
      })
      .catch(() => {
        // Si la requête échoue, on essaie de récupérer depuis le cache
        return caches.match(event.request).then((response) => {
          if (response) {
            return response
          }
          // Si la page n'est pas en cache, on renvoie la page offline
          if (event.request.mode === "navigate") {
            return caches.match("/offline")
          }
          // Pour les autres ressources, on renvoie une réponse vide
          return new Response("", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
          })
        })
      }),
  )
})
