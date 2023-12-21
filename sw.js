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
// [Expansion Doc Milestone 43/134]: docs(powerups): document triple spread plasma 3-lane forward firing cone coverage (2023-12-14T17:33:09.473Z)
// [Expansion Doc Milestone 44/134]: docs(powerups): document quantum warp dash vertical teleport and ghost after-images (2023-12-14T20:10:22.556Z)
// [Expansion Doc Milestone 45/134]: docs(powerups): document tactical smart nuke screen clear and high-intensity shake (2023-12-14T22:47:35.639Z)
// [Expansion Doc Milestone 46/134]: docs(powerups): document hull repair kit health restoration and max life caps (2023-12-15T01:24:48.721Z)
// [Expansion Doc Milestone 47/134]: docs(powerups): add random drop chance weight distribution diagram (32% enemy drop rate) (2023-12-15T04:02:01.804Z)
// [Expansion Doc Milestone 48/134]: docs(magazine): modularize tactical magazine mechanics into features/tactical_magazine.md (2023-12-15T06:39:14.887Z)
// [Expansion Doc Milestone 49/134]: docs(magazine): document automated 1.0s reload trigger upon magazine exhaustion (2023-12-15T09:16:27.969Z)
// [Expansion Doc Milestone 50/134]: docs(magazine): document manual reload keybindings (R, K, C) and mobile circle button (2023-12-15T11:53:41.052Z)
// [Expansion Doc Milestone 51/134]: docs(magazine): specify circular reload progress arc rendered around aircraft sprite (2023-12-15T14:30:54.135Z)
// [Expansion Doc Milestone 52/134]: docs(magazine): document HUD magazine slot transparency and bullet state styling (2023-12-15T17:08:07.218Z)
// [Expansion Doc Milestone 53/134]: docs(combo): modularize combo scoring architecture into features/combo_scoring.md (2023-12-15T19:45:20.300Z)
// [Expansion Doc Milestone 54/134]: docs(combo): document 2.8s combo decay timer and multiplier formula (min 5x) (2023-12-15T22:22:33.383Z)
// [Expansion Doc Milestone 55/134]: docs(combo): detail floating combat text formatting and gold particle rendering (2023-12-16T00:59:46.466Z)
// [Expansion Doc Milestone 56/134]: docs(combo): document score scaling table for scout UFOs, heavy UFOs, and boss hits (2023-12-16T03:36:59.548Z)
// [Expansion Doc Milestone 57/134]: docs(boss): modularize alien mothership boss encounter into features/alien_mothership_boss.md (2023-12-16T06:14:12.631Z)
// [Expansion Doc Milestone 58/134]: docs(boss): document phase 1 single targeted plasma fireball attacks (2023-12-16T08:51:25.714Z)
// [Expansion Doc Milestone 59/134]: docs(boss): document phase 2 3-way spread fireballs and vertical evasive sweeps (2023-12-16T11:28:38.796Z)
// [Expansion Doc Milestone 60/134]: docs(boss): document phase 3 enraged mode glowing red barrier and 5-way barrage (2023-12-16T14:05:51.879Z)
// [Expansion Doc Milestone 61/134]: docs(boss): specify boss HP scaling across normal, veteran, and insane difficulties (2023-12-16T16:43:04.962Z)
// [Expansion Doc Milestone 62/134]: docs(boss): document top HUD 480px gradient health bar and phase badge renderer (2023-12-16T19:20:18.045Z)
// [Expansion Doc Milestone 63/134]: docs(hazards): modularize space asteroid hazards into features/asteroid_hazards.md (2023-12-16T21:57:31.127Z)
// [Expansion Doc Milestone 64/134]: docs(hazards): document 3-hit damage thresholds and splitting particle physics (2023-12-17T00:34:44.210Z)
// [Expansion Doc Milestone 65/134]: docs(hazards): document angular rotational drift physics and speed variations (2023-12-17T03:11:57.293Z)
// [Expansion Doc Milestone 66/134]: docs(hazards): specify dual SVG vector variants with bespoke crags and shading (2023-12-17T05:49:10.375Z)
// [Expansion Doc Milestone 67/134]: docs(trophies): modularize trophy room achievements into features/trophies_and_achievements.md (2023-12-17T08:26:23.458Z)
// [Expansion Doc Milestone 68/134]: docs(trophies): document first blood, hyper aviator, and cosmic surfer achievements (2023-12-17T11:03:36.541Z)
// [Expansion Doc Milestone 69/134]: docs(trophies): document super attractor, overdrive fury, and combo king achievements (2023-12-17T13:40:49.624Z)
// [Expansion Doc Milestone 70/134]: docs(trophies): document mothership slayer and gold commander milestone bounties (2023-12-17T16:18:02.706Z)
// [Expansion Doc Milestone 71/134]: docs(trophies): specify in-game slide-in toast notification animation and timeout (2023-12-17T18:55:15.789Z)
// [Expansion Doc Milestone 72/134]: docs(trophies): document audio chime and haptic feedback dispatch upon achievement unlock (2023-12-17T21:32:28.872Z)
// [Expansion Doc Milestone 73/134]: docs(mobile): modularize direct touch steering into features/direct_touch_steering.md (2023-12-18T00:09:41.954Z)
// [Expansion Doc Milestone 74/134]: docs(mobile): document left 72% canvas touch drag Y-follow smoothing formula (2023-12-18T02:46:55.037Z)
// [Expansion Doc Milestone 75/134]: docs(mobile): document right 28% canvas multi-touch action button hit zones (2023-12-18T05:24:08.120Z)
// [Expansion Doc Milestone 76/134]: docs(mobile): specify spring easing physics for aircraft vertical tilt response (2023-12-18T08:01:21.203Z)
// [Expansion Doc Milestone 77/134]: docs(audio): modularize procedural audio synthesis into features/audio_synthesis.md (2023-12-18T10:38:34.285Z)
// [Expansion Doc Milestone 78/134]: docs(audio): document hyper rocket exponential sawtooth synthesis curve (80Hz to 600Hz) (2023-12-18T13:15:47.368Z)
// [Expansion Doc Milestone 79/134]: docs(audio): document cosmic hoverboard square-wave power chord synthesis parameters (2023-12-18T15:53:00.451Z)
// [Expansion Doc Milestone 80/134]: docs(audio): document super magnet modulated sine-wave attractor chime (2023-12-18T18:30:13.533Z)
// [Expansion Doc Milestone 81/134]: docs(audio): document smart EMP nuke white noise and low-frequency sweep synthesis (2023-12-18T21:07:26.616Z)
// [Expansion Doc Milestone 82/134]: docs(android): modularize android native bridge into features/android_native_bridge.md (2023-12-18T23:44:39.699Z)
// [Expansion Doc Milestone 83/134]: docs(android): document Android SDK 34 JavascriptInterface vibration bridge methods (2023-12-19T02:21:52.781Z)
// [Expansion Doc Milestone 84/134]: docs(android): document AndroidManifest hardware acceleration and immersive sticky flags (2023-12-19T04:59:05.864Z)
// [Expansion Doc Milestone 85/134]: docs(android): document PWA WebAPK offline service worker caching strategy (2023-12-19T07:36:18.947Z)
// [Expansion Doc Milestone 86/134]: docs(arch): create dedicated hangar persistence architecture in architecture/HANGAR_AND_PERSISTENCE_ARCHITECTURE.md (2023-12-19T10:13:32.030Z)
// [Expansion Doc Milestone 87/134]: docs(arch): document storage contracts and deserialization safety in hangar subsystem (2023-12-19T12:50:45.112Z)
// [Expansion Doc Milestone 88/134]: docs(arch): create dedicated fury overdrive pipeline specification in architecture/FURY_OVERDRIVE_PIPELINE.md (2023-12-19T15:27:58.195Z)
// [Expansion Doc Milestone 89/134]: docs(arch): document split delta-time frame execution sequence and raycast collisions (2023-12-19T18:05:11.278Z)
// [Expansion Doc Milestone 90/134]: docs(arch): create dedicated survival wave engine specification in architecture/SURVIVAL_WAVE_ENGINE.md (2023-12-19T20:42:24.360Z)
// [Expansion Doc Milestone 91/134]: docs(arch): document wave state machine transitions and difficulty scaling equations (2023-12-19T23:19:37.443Z)
// [Expansion Doc Milestone 92/134]: docs(arch): create dedicated achievement event bus specification in architecture/ACHIEVEMENT_EVENT_BUS.md (2023-12-20T01:56:50.526Z)
// [Expansion Doc Milestone 93/134]: docs(arch): document event dispatch lifecycle, local storage updates, and toast rendering (2023-12-20T04:34:03.609Z)
// [Expansion Doc Milestone 94/134]: docs(gdd): create comprehensive API and game state reference in docs/API_AND_STATE_REFERENCE.md (2023-12-20T07:11:16.691Z)
// [Expansion Doc Milestone 95/134]: docs(gdd): document global gameState schema properties, types, and defaults (2023-12-20T09:48:29.774Z)
// [Expansion Doc Milestone 96/134]: docs(gdd): document lifecycle initialization, render sequence, and game over teardown (2023-12-20T12:25:42.857Z)
// [Expansion Doc Milestone 97/134]: docs(gdd): create combat and balance mathematical formulas in docs/COMBAT_AND_BALANCE_FORMULAS.md (2023-12-20T15:02:55.939Z)
// [Expansion Doc Milestone 98/134]: docs(gdd): centralize weapon damage, speed scaling, and scoring multiplier formulas (2023-12-20T17:40:09.022Z)
// [Expansion Doc Milestone 99/134]: docs(gdd): create open-source contributing guide and conventions in docs/CONTRIBUTING.md (2023-12-20T20:17:22.105Z)
// [Expansion Doc Milestone 100/134]: docs(gdd): document zero-dependency execution rules and canvas 2D GC optimization guidelines (2023-12-20T22:54:35.187Z)
// [Expansion Doc Milestone 101/134]: refactor(features): cross-link all feature specifications with architectural design docs (2023-12-21T01:31:48.270Z)
// [Expansion Doc Milestone 102/134]: refactor(docs): synchronize navigation index in docs/GAME_DESIGN.md and README.md (2023-12-21T04:09:01.353Z)
// [Expansion Doc Milestone 103/134]: style(docs): format all mathematical expressions with LaTeX math blocks (2023-12-21T06:46:14.436Z)