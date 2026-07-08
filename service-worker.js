const CACHE_NAME = "caisse-cache-v16";

const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icon.png",
  "./icon-1-boule.png",
  "./icon-2-boules.png",
  "./icon-3-boules.png",
  "./icon-boisson-chaude.png",
  "./icon-boisson-froide.png",
  "./icon-boisson.png",
  "./icon-brownies.png",
  "./icon-cafe.png",
  "./icon-chantilly-non.png",
  "./icon-chantilly-oui.png",
  "./icon-chocolat-chaud.png",
  "./icon-cocacola-zero.png",
  "./icon-cocacola-zero2.png",
  "./icon-cocacola.png",
  "./icon-cocacola2.png",
  "./icon-cookie.png",
  "./icon-cornet.png",
  "./icon-creme-fouettee.png",
  "./icon-crepe.png",
  "./icon-eau.png",
  "./icon-eau2.png",
  "./icon-fanta.png",
  "./icon-gateau.png",
  "./icon-glace.png",
  "./icon-icetea.png",
  "./icon-icetea2.png",
  "./icon-jus-ananas.png",
  "./icon-jus-banane.png",
  "./icon-nappage-caramel.png",
  "./icon-nappage-chocolat.png",
  "./icon-nappage-confiture-fraise.png",
  "./icon-nappage-creme-de-marron.png",
  "./icon-nappage-creme-noisette-blanche.png",
  "./icon-nappage-fraise.png",
  "./icon-nappage-nutella.png",
  "./icon-nappage-speculoos.png",
  "./icon-nappage-sucre.png",
  "./icon-oasis-tropical.png",
  "./icon-options-banane.png",
  "./icon-options-boule-de-glace.png",
  "./icon-options-chantilly.png",
  "./icon-options-framboise.png",
  "./icon-options-fraise.png",
  "./icon-options-myrtille.png",
  "./icon-options-pistache-concassees.png",
  "./icon-panini-boeuf.png",
  "./icon-panini-poulet.png",
  "./icon-panini-vegan.png",
  "./icon-panini.png",
  "./icon-parfum-glace-cafe.png",
  "./icon-parfum-glace-café.png",
  "./icon-parfum-glace-caramel.png",
  "./icon-parfum-glace-caramel2.png",
  "./icon-parfum-glace-chocolat-facon-brownies.png",
  "./icon-parfum-glace-chocolat-façon-brownies.png",
  "./icon-parfum-glace-chocolat.png",
  "./icon-parfum-glace-citron.png",
  "./icon-parfum-glace-fraise.png",
  "./icon-parfum-glace-fraise2.png",
  "./icon-parfum-glace-guimauve.png",
  "./icon-parfum-glace-mangue.png",
  "./icon-parfum-glace-menthe.png",
  "./icon-parfum-glace-noix-de-coco.png",
  "./icon-parfum-glace-parfum-du-moment.png",
  "./icon-parfum-glace-pistache.png",
  "./icon-parfum-glace-rhum-raisin.png",
  "./icon-parfum-glace-vanille-de-madagascar.png",
  "./icon-parfum-glace-vanille.png",
  "./icon-pot.png",
  "./icon-redbull.png",
  "./icon-sale.png",
  "./icon-schweppes-agrumes.png",
  "./icon-sprite.png",
  "./icon-sprite2.png",
  "./icon-the.png",
  "./icon-topping-amandes.png",
  "./icon-topping-boule-choco.png",
  "./icon-topping-coco-rape.png",
  "./icon-topping-kinder-bueno.png",
  "./icon-topping-oreo.png",
  "./icon-topping-shortbread.png",
  "./icon-topping-speculos.png",
  "./icon-topping-speculoos.png",
  "./icon-topping-sprinkles.png",
  "./icon-vanta.png",
  "./logo-manga.png",
  "./logo-vague.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
    ))
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if(event.request.method !== "GET"){
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if(cachedResponse){
        return cachedResponse;
      }

      return fetch(event.request)
        .then(networkResponse => {
          if(
            networkResponse &&
            networkResponse.ok &&
            event.request.url.startsWith(self.location.origin)
          ){
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }

          return networkResponse;
        })
        .catch(() => {
          if(event.request.mode === "navigate"){
            return caches.match("./index.html");
          }

          if(event.request.destination === "image"){
            return caches.match("./icon.png");
          }

          return new Response("", {
            status: 503,
            statusText: "Offline"
          });
        });
    })
  );
});
