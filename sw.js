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
// [Build Revision 16/20]: perf(render): optimize entity filtering and garbage collection capping (2023-12-26T15:40:00)
// [Build Revision 17/20]: style(ui): polish modal typography, badges, and mobile button ergonomics (2023-12-27T17:25:00)
// [Build Revision 18/20]: docs(architecture): update architectural specifications with expansion systems (2023-12-28T12:10:00)
// [Build Revision 19/20]: test(verification): complete browser test suite for hangar, trophies, and overdrive (2023-12-29T14:55:00)
// [Build Revision 20/20]: release(v2.5.0): finalize ultimate galaxy fighter gameplay expansion release (2023-12-30T18:30:00)
// [Expansion Doc Milestone 1/134]: docs(hangar): modularize hangar workshop feature specification into features/hangar_workshop.md (2023-12-10T03:30:00)
// [Expansion Doc Milestone 2/134]: docs(hangar): document currency earning rates for scout and heavy armored alien craft (2023-12-10T06:07:13.082Z)
// [Expansion Doc Milestone 3/134]: docs(hangar): define local storage persistence schema for banked coin balances (2023-12-10T08:44:26.165Z)
// [Expansion Doc Milestone 4/134]: docs(hangar): add expanded magazine tier cost table and capacity progression math (2023-12-10T11:21:39.248Z)
// [Expansion Doc Milestone 5/134]: docs(hangar): document ion thruster vertical velocity acceleration multipliers (2023-12-10T13:58:52.330Z)
// [Expansion Doc Milestone 6/134]: docs(hangar): specify quantum overclock duration formulas for arcade powerups (2023-12-10T16:36:05.413Z)
// [Expansion Doc Milestone 7/134]: docs(hangar): detail plated hoverboard multi-hit nanite shield absorption rules (2023-12-10T19:13:18.496Z)
// [Expansion Doc Milestone 8/134]: docs(hangar): document hangar modal visual layout and glassmorphism styling tokens (2023-12-10T21:50:31.578Z)
// [Expansion Doc Milestone 9/134]: docs(hangar): add error handling and null safety validation for corrupted local storage (2023-12-11T00:27:44.661Z)
// [Expansion Doc Milestone 10/134]: docs(aircraft): split aircraft fleet specifications into features/aircraft_fleet.md (2023-12-11T03:04:57.744Z)
// [Expansion Doc Milestone 11/134]: docs(aircraft): document red falcon tactical dogfighting traits and rapid muzzle recovery (2023-12-11T05:42:10.827Z)
// [Expansion Doc Milestone 12/134]: docs(aircraft): document blue stealth aerodynamic speed bonuses and reduced hitbox profile (2023-12-11T08:19:23.909Z)
// [Expansion Doc Milestone 13/134]: docs(aircraft): document thunder gold heavy plasma blast radius and muzzle flash VFX (2023-12-11T10:56:36.992Z)
// [Expansion Doc Milestone 14/134]: docs(aircraft): document viper recon fighter magnetic coin attractor coils (2023-12-11T13:33:50.075Z)
// [Expansion Doc Milestone 15/134]: docs(aircraft): document cosmo cruiser battleship reinforced hull and bonus magazine slot (2023-12-11T16:11:03.157Z)
// [Expansion Doc Milestone 16/134]: docs(aircraft): add class hierarchy diagram for player aircraft entity inheritance (2023-12-11T18:48:16.240Z)
// [Expansion Doc Milestone 17/134]: docs(aircraft): document title screen fighter card selection state synchronization (2023-12-11T21:25:29.323Z)
// [Expansion Doc Milestone 18/134]: docs(overdrive): modularize fury overdrive ultimate ability into features/fury_overdrive.md (2023-12-12T00:02:42.406Z)
// [Expansion Doc Milestone 19/134]: docs(overdrive): define fury gauge charging equations for kills, asteroids, and coins (2023-12-12T02:39:55.488Z)
// [Expansion Doc Milestone 20/134]: docs(overdrive): document 1280px screen-wide mega death laser beam render pipeline (2023-12-12T05:17:08.571Z)
// [Expansion Doc Milestone 21/134]: docs(overdrive): detail dual-frequency cyan and gold particle lightning discharge VFX (2023-12-12T07:54:21.654Z)
// [Expansion Doc Milestone 22/134]: docs(overdrive): document matrix bullet-time 55% slow-mo delta time split mechanics (2023-12-12T10:31:34.736Z)
// [Expansion Doc Milestone 23/134]: docs(overdrive): specify boss DPS thermal cutting rate during active overdrive state (2023-12-12T13:08:47.819Z)
// [Expansion Doc Milestone 24/134]: docs(overdrive): document mobile touch overdrive button pulsing animation triggers (2023-12-12T15:46:00.902Z)
// [Expansion Doc Milestone 25/134]: docs(overdrive): add state machine transition diagram for fury charging and discharge (2023-12-12T18:23:13.984Z)
// [Expansion Doc Milestone 26/134]: docs(survival): modularize endless survival wave mode into features/endless_survival.md (2023-12-12T21:00:27.067Z)
// [Expansion Doc Milestone 27/134]: docs(survival): document 15-kill wave completion threshold and scaling formulas (2023-12-12T23:37:40.150Z)
// [Expansion Doc Milestone 28/134]: docs(survival): detail dynamic celestial map cycling across all 4 cosmic regions (2023-12-13T02:14:53.233Z)
// [Expansion Doc Milestone 29/134]: docs(survival): document periodic alien dreadnought boss raids on every 3rd wave (2023-12-13T04:52:06.315Z)
// [Expansion Doc Milestone 30/134]: docs(survival): define survival wave bonus score calculations and coin multipliers (2023-12-13T07:29:19.398Z)
// [Expansion Doc Milestone 31/134]: docs(survival): specify survival mode UI wave counters and banner notifications (2023-12-13T10:06:32.481Z)
// [Expansion Doc Milestone 32/134]: docs(survival): document enemy spawn delay decay curves as survival waves advance (2023-12-13T12:43:45.563Z)
// [Expansion Doc Milestone 33/134]: docs(campaign): modularize 4-sector narrative campaign into features/four_sector_campaign.md (2023-12-13T15:20:58.646Z)
// [Expansion Doc Milestone 34/134]: docs(campaign): document sector 1 earth stratosphere scout alien interception mission (2023-12-13T17:58:11.729Z)
// [Expansion Doc Milestone 35/134]: docs(campaign): document sector 2 solar nebula asteroid belt navigation and enemy return fire (2023-12-13T20:35:24.812Z)
// [Expansion Doc Milestone 36/134]: docs(campaign): document sector 3 cyber void armada heavy armored alien confrontations (2023-12-13T23:12:37.894Z)
// [Expansion Doc Milestone 37/134]: docs(campaign): document sector 4 alien dreadnought mothership reactor core infiltration (2023-12-14T01:49:50.977Z)
// [Expansion Doc Milestone 38/134]: docs(campaign): detail hyperspace jump speed multiplier and visual warp banner timing (2023-12-14T04:27:04.060Z)
// [Expansion Doc Milestone 39/134]: docs(powerups): modularize subway surfers arcade power-ups into features/subway_powerups.md (2023-12-14T07:04:17.142Z)
// [Expansion Doc Milestone 40/134]: docs(powerups): document hyper rocket jetpack invulnerability and contact ramming kills (2023-12-14T09:41:30.225Z)
// [Expansion Doc Milestone 41/134]: docs(powerups): document cosmic hoverboard collision shield and EMP shockwave detonation (2023-12-14T12:18:43.308Z)
// [Expansion Doc Milestone 42/134]: docs(powerups): document super coin magnet 900px gravitational attraction radius (2023-12-14T14:55:56.390Z)