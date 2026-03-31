const CACHE_NAME = "caisse-cache-v5";

const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icon.png",
  "./logo-manga.png",

  /* ================= MAIN ================= */
  "./icon-crepe.png",
  "./icon-panini.png",
  "./icon-glace.png",
  "./icon-boisson.png",
  "./icon-gateau.png",
  "./icon-sale.png",

  /* ================= GLACE ================= */
  "./icon-pot.png",
  "./icon-cornet.png",
  "./icon-1-boule.png",
  "./icon-2-boules.png",

  /* ================= NAPPAGE ================= */
  "./icon-nappage-nutella.png",
  "./icon-nappage-sucre.png",
  "./icon-nappage-chocolat.png",
  "./icon-nappage-creme-de-marron.png",
  "./icon-nappage-fraise.png",
  "./icon-nappage-caramel.png",

  /* ================= TOPPING ================= */
  "./icon-topping-kinder-bueno.png",
  "./icon-topping-oreo.png",
  "./icon-topping-sprinkles.png",
  "./icon-topping-chantilly.png",
  "./icon-topping-coco-rape.png",
  "./icon-topping-speculos.png",

  /* ================= OPTIONS ================= */
  "./icon-options-boule-de-glace.png",
  "./icon-options-banane.png",
  "./icon-options-fraise.png",
  "./icon-options-myrtille.png",
  "./icon-options-framboise.png",
  "./icon-options-pistache-concassees.png",

  /* ================= PARFUMS ================= */
  "./icon-parfum-glace-chocolat.png",
  "./icon-parfum-glace-fraise.png",
  "./icon-parfum-glace-vanille.png",
  "./icon-parfum-glace-menthe.png",
  "./icon-parfum-glace-caramel.png",
  "./icon-parfum-glace-noix-de-coco.png",

  /* ================= CHANTILLY ================= */
  "./icon-chantilly-oui.png",
  "./icon-chantilly-non.png",

  /* ================= BOISSONS ================= */
  "./icon-boisson-froide.png",
  "./icon-boisson-chaude.png",
  "./icon-cocacola.png",
  "./icon-cocacola-zero.png",
  "./icon-vanta.png",
  "./icon-sprite.png",
  "./icon-icetea.png",
  "./icon-eau.png",

  /* ================= BOISSONS CHAUDES ================= */
  "./icon-cafe.png",
  "./icon-the.png",
  "./icon-chocolat-chaud.png",

  /* ================= GATEAU ================= */
  "./icon-cookie.png",
  "./icon-brownies.png",

  /* ================= SALE ================= */
  "./icon-panini-boeuf.png",
  "./icon-panini-poulet.png",
  "./icon-panini-vegan.png"
];

/* ================= INSTALL ================= */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

/* ================= FETCH ================= */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

/* ================= UPDATE CACHE ================= */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});