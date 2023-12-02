// Service Worker for Galaxy Fighter (Android PWA & Offline Support)
const CACHE_NAME = 'galaxy-fighter-v2.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './game.js',
  './manifest.json',
  './recursos/fonte/font.ttf',
  './recursos/audio/musica.mp3',
  './recursos/audio/tiro.mp3',
  './recursos/audio/morte.mp3',
  './recursos/audio/click.mp3',
  './recursos/audio/transicao.mp3',
  './recursos/imagens/BG/sky_background_mountains.png',
  './recursos/imagens/BG/bg_solar_nebula.jpg',
  './recursos/imagens/BG/bg_cyber_void.jpg',
  './recursos/imagens/BG/bg_alien_mothership.jpg',
  './recursos/imagens/planes/plane_1/plane_1_red.png',
  './recursos/imagens/planes/plane_1/plane_1_blue.png',
  './recursos/imagens/planes/plane_1/plane_1_yellow.png',
  './recursos/imagens/planes/plane_2/plane_2_green.png',
  './recursos/imagens/planes/plane_3/plane_3_blue.png',
  './recursos/imagens/planes/inimigos/ovni.png',
  './recursos/imagens/planes/inimigos/boss.png',
  './recursos/imagens/planes/tiros/torpedo_flame.png',
  './recursos/imagens/planes/tiros/fire_ball_1.png',
  './recursos/imagens/UI/life.png',
  './recursos/imagens/UI/municao.png',
  './recursos/imagens/icones/gold_coin.png',
  './recursos/imagens/powerups/powerup_rocket.svg',
  './recursos/imagens/powerups/powerup_hoverboard.svg',
  './recursos/imagens/powerups/powerup_magnet.svg',
  './recursos/imagens/powerups/powerup_spread.svg',
  './recursos/imagens/powerups/powerup_dash.svg',
  './recursos/imagens/powerups/powerup_nuke.svg',
  './recursos/imagens/powerups/powerup_repair.svg',
  './recursos/imagens/hazards/asteroid_1.svg',
  './recursos/imagens/hazards/asteroid_2.svg',
  './recursos/imagens/planes/hoverboard_board.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => cached);
    })
  );
});

// [Build Revision 1/20]: feat(hangar): implement persistent coin banking and local storage persistence (2023-12-02T10:14:00)