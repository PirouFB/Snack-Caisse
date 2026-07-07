const CACHE_NAME = "caisse-cache-v15"; // 🔥 change version pour forcer update

const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/manifest.json",
  "/icon.png",
  "/logo-manga.png",

  /* ================= MAIN ================= */
  "/icon-crepe.png",
  "/icon-panini.png",
  "/icon-glace.png",
  "/icon-boisson.png",
  "/icon-gateau.png",
  "/icon-sale.png",

  /* ================= GLACE ================= */
  "/icon-pot.png",
  "/icon-cornet.png",
  "/icon-1-boule.png",
  "/icon-2-boules.png",

  /* ================= NAPPAGE ================= */
  "/icon-nappage-nutella.png",
  "/icon-nappage-sucre.png",
  "/icon-nappage-chocolat.png",
  "/icon-nappage-fraise.png",
  "/icon-nappage-caramel.png",
  "/icon-nappage-creme-noisette-blanche.png",
  "/icon-nappage-confiture-fraise.png",
  "/icon-nappage-speculoos.png",

  /* ================= TOPPING ================= */
  "/icon-topping-kinder-bueno.png",
  "/icon-topping-oreo.png",
  "/icon-topping-speculos.png",
  "/icon-topping-boule-choco.png",
  "/icon-topping-amandes.png",
  "/icon-topping-shortbread.png",

  /* ================= OPTIONS ================= */
  "/icon-options-boule-de-glace.png",
  "/icon-options-banane.png",
  "/icon-options-fraise.png",
  "/icon-options-chantilly.png",

  /* ================= PARFUMS ================= */
  "/icon-parfum-glace-vanille-de-madagascar.png",
  "/icon-parfum-glace-caramel.png",
  "/icon-parfum-glace-chocolat-facon-brownies.png",
  "/icon-parfum-glace-guimauve.png",
  "/icon-parfum-glace-mangue.png",
  "/icon-parfum-glace-fraise.png",
  "/icon-parfum-glace-rhum-raisin.png",
  "/icon-parfum-glace-cafe.png",
  "/icon-parfum-glace-pistache.png",
  "/icon-parfum-glace-citron.png",
  "/icon-parfum-glace-parfum-du-moment.png",

  /* ================= CHANTILLY ================= */
  "/icon-chantilly-oui.png",
  "/icon-chantilly-non.png",

  /* ================= BOISSONS ================= */
  "/icon-boisson-froide.png",
  "/icon-boisson-chaude.png",
  "/icon-cocacola.png",
  "/icon-cocacola-zero.png",
  "/icon-fanta.png",
  "/icon-sprite.png",
  "/icon-icetea.png",
  "/icon-eau.png",
  "/icon-oasis-tropical.png",
  "/icon-schweppes-agrumes.png",
  "/icon-jus-ananas.png",
  "/icon-jus-banane.png",
  "/icon-redbull.png",

  /* ================= BOISSONS CHAUDES ================= */
  "/icon-cafe.png",
  "/icon-the.png",
  "/icon-chocolat-chaud.png",

  /* ================= GATEAU ================= */
  "/icon-cookie.png",
  "/icon-brownies.png",

  /* ================= SALE ================= */
  "/icon-panini-boeuf.png",
  "/icon-panini-poulet.png",
  "/icon-panini-vegan.png"
];

/* ================= INSTALL ================= */
self.addEventListener("install", event => {
  self.skipWaiting(); // 🔥 active direct

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

/* ================= ACTIVATE ================= */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );

  self.clients.claim(); // 🔥 prend contrôle immédiat
});

/* ================= FETCH ================= */
self.addEventListener("fetch", event => {

  // 🔥 STRATÉGIE : cache d'abord + fallback réseau + fallback image
  event.respondWith(

    caches.match(event.request).then(response => {

      if(response){
        return response;
      }

      return fetch(event.request)
        .then(networkResponse => {

          // 🔥 on met en cache automatiquement les images chargées
          if(event.request.destination === "image"){
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }

          return networkResponse;
        })
        .catch(() => {

          // 🔥 fallback image (optionnel)
          if(event.request.destination === "image"){
            return caches.match("/icon.png"); // image de secours
          }

        });

    })
  );
});
