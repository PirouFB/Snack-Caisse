const CACHE_NAME = "caisse-cache-v6";

const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icon.png",

  "./logo-vague.png",
  "./logo-manga.png",

  "./icon-crepe.png",
  "./icon-panini.png",
  "./icon-glace.png",

  "./icon-pot.png",
  "./icon-cornet.png",
  "./icon-1-boule.png",
  "./icon-2-boules.png",

  "./icon-chantilly-oui.png",
  "./icon-chantilly-non.png"
];

// INSTALL
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// FETCH
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});

// UPDATE CACHE
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME)
            .map(k => caches.delete(k))
      )
    )
  );
});