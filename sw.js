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
// [Build Revision 2/20]: feat(hangar): design hangar upgrade modal UI and responsive glassmorphism styles (2023-12-03T14:22:00)
// [Build Revision 3/20]: feat(hangar): add magazine capacity, speed, overclock, and hoverboard upgrades (2023-12-05T11:45:00)
// [Build Revision 4/20]: feat(hangar): add dynamic level pills and real-time upgrade cost calculations (2023-12-06T16:30:00)
// [Build Revision 5/20]: feat(trophies): create trophy room modal and live achievement tracker (2023-12-08T09:15:00)
// [Build Revision 6/20]: feat(trophies): define 8 milestone achievements with reward coin bounties (2023-12-09T13:40:00)
// [Build Revision 7/20]: feat(trophies): add in-game animated achievement unlocked toast notification (2023-12-11T17:05:00)
// [Build Revision 8/20]: feat(overdrive): implement fury gauge accumulator for combat kills and coins (2023-12-13T10:50:00)
// [Build Revision 9/20]: feat(overdrive): add mega death laser beam rendering and particle discharge (2023-12-15T15:20:00)
// [Build Revision 10/20]: feat(overdrive): add matrix bullet-time slow-mo and beam piercing collision (2023-12-17T11:35:00)
// [Build Revision 11/20]: feat(overdrive): bind hotkeys (Q/E) and mobile on-screen overdrive HUD button (2023-12-19T14:10:00)
// [Build Revision 12/20]: feat(survival): add endless survival game mode selector to title screen (2023-12-20T16:45:00)
// [Build Revision 13/20]: feat(survival): implement infinite scaling waves and dynamic sector cycling (2023-12-22T09:30:00)
// [Build Revision 14/20]: feat(survival): add survival wave HUD counter and periodic mothership spawns (2023-12-23T13:15:00)
// [Build Revision 15/20]: fix(audio): synthesize procedural sfx for overdrive activation and upgrades (2023-12-25T11:00:00)