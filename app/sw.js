// Service worker: guarda la app en el dispositivo para que funcione sin conexión.
//
// Por qué hace falta: el APK de Capacitor ya lleva los archivos dentro del paquete,
// pero la PWA instalada en el navegador no guardaba nada. Al abrirla sin datos, la
// página no cargaba. Este archivo cachea el esqueleto de la app y lo sirve desde el
// caché cuando no hay red.
//
// IMPORTANTE — al cambiar cualquier archivo de app/, hay que subir CACHE aquí:
// si no, los usuarios con la app instalada seguirían viendo la versión vieja.
const CACHE = "sesp-v3";

const SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./ui/fonts.css",
  "./ui/tokens.css",
  "./ui/styles.css",
  "./ui/app.js",
  "./core/storage.js",
  "./core/engine.js",
  "./core/stats.js",
  "./data/modules.js",
  "./data/questions.rc.js",
  "./data/questions.lc.js",
  "./data/questions.cc.js",
  "./data/questions.in.js",
  "./data/questions.ce.js",
  "./data/questions.s2.js",
  "./data/questions.fp.js",
  "./data/questions.ds.js",
  "./data/questions.pc.js",
  "./data/questions.gen.rc.js",
  "./data/questions.gen.lc.js",
  "./data/questions.gen.cc.js",
  "./data/questions.gen.in.js",
  "./data/questions.gen.ce.js",
  "./data/explanations.js",
  "./modes/practice.js",
  "./modes/review.js",
  "./modes/express.js",
  "./modes/simulation.js",
  "./modes/simulacro2.js",
  "./modes/training.js",
  "./assets/images/logo.png",
  "./assets/images/icon-192.png",
  "./assets/images/icon-512.png",

  // Las tipografías van en el shell porque sin ellas la app abre con una serif
  // del sistema y cambia por completo al pasar de "sin datos" a "con datos".
  "./assets/fonts/nunito-latin-1.woff2",
  "./assets/fonts/nunito-latin-3.woff2",
  "./assets/fonts/nunito-latin-5.woff2",
  "./assets/fonts/nunito-latin-7.woff2",
  "./assets/fonts/nunito-latin-9.woff2",
  "./assets/fonts/nunito-latin-ext-0.woff2",
  "./assets/fonts/nunito-latin-ext-2.woff2",
  "./assets/fonts/nunito-latin-ext-4.woff2",
  "./assets/fonts/nunito-latin-ext-6.woff2",
  "./assets/fonts/nunito-latin-ext-8.woff2",

  // Los 23 enunciados que dependen de una imagen (Ciencias Naturales, Lectura
  // Crítica, Matemática yFyP) quedarían incompletos sin conexión si la imagen
  // no estuviera ya en caché, y el estudiante no puede ver lo que sí tiene que
  // estar mirando.
  "./assets/images/DS-2018-CTX-02.png",
  "./assets/images/DS-2018-CTX-03.png",
  "./assets/images/DS-2018-CTX-04.png",
  "./assets/images/DS-2018-CTX-05.png",
  "./assets/images/DS-2018-CTX-07.png",
  "./assets/images/DS-2018-CTX-08.png",
  "./assets/images/LC-2018-CTX-06.png",
  "./assets/images/LC-2018-CTX-07.png",
  "./assets/images/LC-2018-CTX-12.png",
  "./assets/images/PC-2026-CTX-01.png",
  "./assets/images/PC-2026-CTX-03.png",
  "./assets/images/PC-2026-CTX-05.png",
  "./assets/images/PC-2026-CTX-08.png",
  "./assets/images/PC-2026-CTX-21.png",
  "./assets/images/PC-2026-CTX-22.png",
  "./assets/images/PC-2026-CTX-23.png",
  "./assets/images/RC-2018-CTX-02.png",
  "./assets/images/RC-2018-CTX-03.png",
  "./assets/images/RC-2018-CTX-04.png",
  "./assets/images/RC-2018-CTX-07.png",
  "./assets/images/RC-2018-CTX-10.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      // addAll falla entero si un archivo falta; se cachea uno a uno para que un
      // recurso ausente no impida instalar el resto.
      .then((cache) => Promise.all(SHELL.map((url) => cache.add(url).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navegación: se sirve el index cacheado para que la app abra sin red.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Resto de recursos: se responde al instante desde el caché y, en segundo plano,
  // se guarda lo que llegue de la red. Con "caché primero a secas" un usuario con
  // la app instalada se quedaría viendo la versión vieja para siempre, y como el
  // index sí se actualiza en cada visita, abriría un index nuevo con scripts viejos.
  event.respondWith(
    caches.match(req).then((hit) => {
      const red = fetch(req).then((res) => {
        if (res && res.ok && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || red;
    })
  );
});