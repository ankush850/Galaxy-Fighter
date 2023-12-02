/**
 * Galaxy Fighter - Production Grade Arcade Engine
 * Implements Subway Surfers-style power-ups (Hyper Rocket Jetpack, Cosmic Hoverboard,
 * Super Coin Magnet, Quantum Dash), 4 Dynamic Sector Maps, 6-round auto-reloading magazine,
 * custom SVG & high-res PNG/JPG assets, Web Audio synthesis, and multi-phase Alien Mothership Boss.
 */

(function () {
  'use strict';

  // --- Constants & Config ---
  const CANVAS_WIDTH = 1280;
  const CANVAS_HEIGHT = 720;
  const PLAYER_BASE_SPEED = 7.5;
  const MAX_LIVES = 3;
  const MAGAZINE_CAPACITY = 6;
  const RELOAD_TIME = 1.0;

  // Plane Assets
  const PLANE_ASSETS = {
    plane_1_red: 'recursos/imagens/planes/plane_1/plane_1_red.png',
    plane_1_blue: 'recursos/imagens/planes/plane_1/plane_1_blue.png',
    plane_1_yellow: 'recursos/imagens/planes/plane_1/plane_1_yellow.png',
    plane_2_green: 'recursos/imagens/planes/plane_2/plane_2_green.png',
    plane_3_blue: 'recursos/imagens/planes/plane_3/plane_3_blue.png'
  };

  // Image Asset URLs
  const IMAGE_URLS = {
    // 4 Galactic Sector Background Maps
    bgEarth: 'recursos/imagens/BG/sky_background_mountains.png',
    bgNebula: 'recursos/imagens/BG/bg_solar_nebula.jpg',
    bgCyber: 'recursos/imagens/BG/bg_cyber_void.jpg',
    bgMothership: 'recursos/imagens/BG/bg_alien_mothership.jpg',

    // Entities & Projectiles
    enemyOvni: 'recursos/imagens/planes/inimigos/ovni.png',
    boss: 'recursos/imagens/planes/inimigos/boss.png',
    torpedo: 'recursos/imagens/planes/tiros/torpedo_flame.png',
    bossFireball: 'recursos/imagens/planes/tiros/fire_ball_1.png',

    // UI Icons
    iconLife: 'recursos/imagens/UI/life.png',
    iconAmmo: 'recursos/imagens/UI/municao.png',
    iconCoin: 'recursos/imagens/icones/gold_coin.png',

    // Subway Surfers Power-up Sprites
    powerupRocket: 'recursos/imagens/powerups/powerup_rocket.svg',
    powerupHoverboard: 'recursos/imagens/powerups/powerup_hoverboard.svg',
    powerupMagnet: 'recursos/imagens/powerups/powerup_magnet.svg',
    powerupSpread: 'recursos/imagens/powerups/powerup_spread.svg',
    powerupDash: 'recursos/imagens/powerups/powerup_dash.svg',
    powerupNuke: 'recursos/imagens/powerups/powerup_nuke.svg',
    powerupRepair: 'recursos/imagens/powerups/powerup_repair.svg',

    // Space Hazards & Hoverboard Overlay
    asteroid1: 'recursos/imagens/hazards/asteroid_1.svg',
    asteroid2: 'recursos/imagens/hazards/asteroid_2.svg',
    hoverboardBoard: 'recursos/imagens/planes/hoverboard_board.svg',

    ...PLANE_ASSETS
  };

  // Audio URLs
  const AUDIO_URLS = {
    bgm: 'recursos/audio/musica.mp3',
    shoot: 'recursos/audio/tiro.mp3',
    death: 'recursos/audio/morte.mp3',
    click: 'recursos/audio/click.mp3',
    transition: 'recursos/audio/transicao.mp3'
  };

  // Sector Maps Configuration
  const SECTOR_CONFIG = [
    { id: 1, name: "EARTH STRATOSPHERE", targetKills: 10, bg: 'bgEarth', desc: "Neutralize 10 Scout UFOs", themeColor: '#38bdf8' },
    { id: 2, name: "SOLAR NEBULA", targetKills: 15, bg: 'bgNebula', desc: "Clear 15 UFOs & Asteroids", themeColor: '#a855f7' },
    { id: 3, name: "CYBER VOID ARMADA", targetKills: 20, bg: 'bgCyber', desc: "Destroy 20 Heavy UFOs", themeColor: '#f97316' },
    { id: 4, name: "MOTHERSHIP CORE", targetKills: 1, bg: 'bgMothership', desc: "Defeat the Alien Dreadnought", themeColor: '#ef4444' }
  ];

  // --- State Variables ---
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  let animationFrameId = null;
  let lastTime = 0;

  // DOM Elements
  const startOverlay = document.getElementById('startOverlay');
  const resultOverlay = document.getElementById('resultOverlay');
  const pauseOverlay = document.getElementById('pauseOverlay');
  const rulesOverlay = document.getElementById('rulesOverlay');
  const shopOverlay = document.getElementById('shopOverlay');
  const achievementsOverlay = document.getElementById('achievementsOverlay');
  const resultTitle = document.getElementById('resultTitle');
  const resultSub = document.getElementById('resultSub');
  const statSector = document.getElementById('statSector');
  const statCoins = document.getElementById('statCoins');
  const statKills = document.getElementById('statKills');
  const statScore = document.getElementById('statScore');
  const statHighScore = document.getElementById('statHighScore');
  const topCoinCount = document.getElementById('topCoinCount');
  const shopCoinBalance = document.getElementById('shopCoinBalance');
  const achievementsCount = document.getElementById('achievementsCount');
  const achievementsList = document.getElementById('achievementsList');
  const achievementToast = document.getElementById('achievementToast');
  const toastIcon = document.getElementById('toastIcon');
  const toastTitle = document.getElementById('toastTitle');
  const toastDesc = document.getElementById('toastDesc');
  const mapPickerContainer = document.getElementById('mapPickerContainer');

  const btnStartGame = document.getElementById('btnStartGame');
  const btnRestart = document.getElementById('btnRestart');
  const btnResume = document.getElementById('btnResume');
  const btnQuit = document.getElementById('btnQuit');
  const btnPause = document.getElementById('btnPause');
  const btnRules = document.getElementById('btnRules');
  const btnCloseRules = document.getElementById('btnCloseRules');
  const btnShop = document.getElementById('btnShop');
  const btnStartShop = document.getElementById('btnStartShop');
  const btnResultShop = document.getElementById('btnResultShop');
  const btnCloseShop = document.getElementById('btnCloseShop');
  const btnAchievements = document.getElementById('btnAchievements');
  const btnCloseAchievements = document.getElementById('btnCloseAchievements');
  const btnSoundToggle = document.getElementById('btnSoundToggle');
  const soundIcon = document.getElementById('soundIcon');
  const soundText = document.getElementById('soundText');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const btnMobilePause = document.getElementById('btnMobilePause');
  const btnMobileSound = document.getElementById('btnMobileSound');
  const btnMobileFullscreen = document.getElementById('btnMobileFullscreen');
  const btnMobileOverdrive = document.getElementById('btnMobileOverdrive');
  const touchOverdrive = document.getElementById('touchOverdrive');

  const canvasContainer = document.getElementById('canvasContainer');
  const planeCards = document.querySelectorAll('.plane-card');
  const mapButtons = document.querySelectorAll('.map-btn');
  const diffButtons = document.querySelectorAll('.diff-btn');
  const modeButtons = document.querySelectorAll('.mode-btn');

  let selectedPlaneKey = 'plane_1_red';
  let selectedStartMap = 0;
  let selectedDifficulty = 'normal';
  let selectedGameMode = 'campaign'; // 'campaign' or 'survival'

  // Persistent Banked Coins & Upgrades
  let bankedCoins = parseInt(localStorage.getItem('galaxyfighter_banked_coins') || '0', 10);
  let upgrades = { mag: 0, speed: 0, power: 0, board: 0 };
  try {
    const savedUp = JSON.parse(localStorage.getItem('galaxyfighter_upgrades') || '{}');
    upgrades = { ...upgrades, ...savedUp };
  } catch (e) {}

  // Achievements & Claimed Rewards
  let achievements = {
    first_blood: false,
    rocket_ace: false,
    hover_pro: false,
    magnet_king: false,
    overdrive_unleashed: false,
    combo_master: false,
    boss_slayer: false,
    rich_pilot: false
  };
  try {
    const savedAch = JSON.parse(localStorage.getItem('galaxyfighter_achievements') || '{}');
    achievements = { ...achievements, ...savedAch };
  } catch (e) {}

  let claimedRewards = {};
  try {
    claimedRewards = JSON.parse(localStorage.getItem('galaxyfighter_claimed_rewards') || '{}');
  } catch (e) {}

  const ACHIEVEMENT_DEFS = [
    { id: 'first_blood', title: 'First Blood', desc: 'Destroy your first alien UFO', reward: 50, icon: '🎯' },
    { id: 'rocket_ace', title: 'Hyper Aviator', desc: 'Engage Hyper Rocket Jetpack boost', reward: 100, icon: '🚀' },
    { id: 'hover_pro', title: 'Cosmic Surfer', desc: 'Equip a Cosmic Hoverboard shield', reward: 100, icon: '🛹' },
    { id: 'magnet_king', title: 'Super Attractor', desc: 'Trigger Super Coin Magnet', reward: 100, icon: '🧲' },
    { id: 'overdrive_unleashed', title: 'Overdrive Fury', desc: 'Unleash full Fury Overdrive Mega Laser', reward: 150, icon: '⚡' },
    { id: 'combo_master', title: 'Combo King', desc: 'Reach a 5x Combat Score Multiplier', reward: 200, icon: '🔥' },
    { id: 'boss_slayer', title: 'Mothership Slayer', desc: 'Defeat the Alien Dreadnought Boss', reward: 500, icon: '👑' },
    { id: 'rich_pilot', title: 'Gold Commander', desc: 'Accumulate 300 total banked Gold Coins', reward: 250, icon: '💰' }
  ];

  // Direct Touch Steering State
  let isDirectDragging = false;
  let touchTargetY = null;

  // Haptic Feedback Engine
  function triggerHaptic(pattern = 15) {
    try {
      if (window.AndroidNative && window.AndroidNative.vibrate) {
        window.AndroidNative.vibrate(Array.isArray(pattern) ? pattern[0] : pattern);
      } else if (navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch (e) {}
  }

  // --- Web Audio & Sound Engine ---
  const sounds = {};
  let isMuted = false;
  let bgmAudio = null;
  let audioCtx = null;

  function initAudio() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    } catch (e) {}

    for (const [key, url] of Object.entries(AUDIO_URLS)) {
      const audio = new Audio(url);
      audio.preload = 'auto';
      if (key === 'bgm') {
        audio.loop = true;
        audio.volume = 0.5;
        bgmAudio = audio;
      } else {
        audio.volume = 0.6;
      }
      sounds[key] = audio;
    }
  }

  function playSound(key) {
    if (isMuted) return;
    try {
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
      if (key === 'bgm') {
        if (bgmAudio && bgmAudio.paused) {
          bgmAudio.currentTime = 0;
          bgmAudio.play().catch(() => {});
        }
      } else if (sounds[key]) {
        const clone = sounds[key].cloneNode();
        clone.volume = sounds[key].volume;
        clone.play().catch(() => {});
      }
    } catch (e) {}
  }

  // Synthesized Procedural Sound Effects
  function playSynthSound(type) {
    if (isMuted || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'rocket') {
        // Hyper rocket ignition whoosh
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.4);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === 'hoverboard') {
        // Futuristic sci-fi hover chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'magnet') {
        // Pulsing magnet ping
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(840, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'dash') {
        // Quantum warp dash sound
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.18);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'nuke') {
        // Screen nuke boom
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(25, now + 0.7);
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
      } else if (type === 'powerup') {
        // High ping chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {}
  }

  function stopBgm() {
    if (bgmAudio) {
      bgmAudio.pause();
      bgmAudio.currentTime = 0;
    }
  }

  function toggleSound() {
    isMuted = !isMuted;
    if (isMuted) {
      if (soundIcon) soundIcon.textContent = '🔇';
      if (soundText) soundText.textContent = 'Sound OFF';
      if (btnMobileSound) btnMobileSound.textContent = '🔇';
      if (bgmAudio) bgmAudio.pause();
    } else {
      if (soundIcon) soundIcon.textContent = '🔊';
      if (soundText) soundText.textContent = 'Sound ON';
      if (btnMobileSound) btnMobileSound.textContent = '🔊';
      if (gameState.screen === 'PLAYING') {
        playSound('bgm');
      }
    }
  }

  // --- Asset Loader ---
  const images = {};
  let assetsLoaded = 0;
  const totalAssets = Object.keys(IMAGE_URLS).length;

  function loadAssets(callback) {
    for (const [key, url] of Object.entries(IMAGE_URLS)) {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        assetsLoaded++;
        if (assetsLoaded === totalAssets && callback) callback();
      };
      img.onerror = () => {
        assetsLoaded++;
        if (assetsLoaded === totalAssets && callback) callback();
      };
      images[key] = img;
    }
  }

  // --- Game State Object ---
  const gameState = {
    screen: 'START', // START, PLAYING, PAUSED, GAMEOVER, VICTORY
    gameMode: 'campaign', // 'campaign' or 'survival'
    survivalWave: 1,
    fury: 0, // 0 to 100
    sectorIndex: 0,
    sectorKills: 0,
    totalKills: 0,
    coins: 0,
    score: 0,
    highScore: parseInt(localStorage.getItem('galaxyfighter_highscore') || '0', 10),
    combo: 0,
    comboTimer: 0,
    bgX1: 0,
    bgX2: CANVAS_WIDTH,
    bgSpeed: 2.2,
    screenShake: 0,
    bannerText: '',
    bannerTimer: 0,
    bossSpawned: false,
    boss: null,
    player: null,
    torpedoes: [],
    enemyProjectiles: [],
    enemies: [],
    asteroids: [],
    powerups: [],
    particles: [],
    floatingTexts: [],
    afterImages: [],
    enemySpawnTimer: 0,
    asteroidSpawnTimer: 0,
    keys: {
      up: false,
      down: false,
      shoot: false,
      reload: false
    }
  };

  // --- Player Aircraft Class ---
  class Player {
    constructor(planeKey) {
      this.planeKey = planeKey;
      this.width = 110;
      this.height = 65;
      this.x = 130;
      this.y = CANVAS_HEIGHT / 2;
      this.tilt = 0;
      this.lives = MAX_LIVES;
      this.magazineCapacity = MAGAZINE_CAPACITY + (upgrades.mag * 2);
      this.ammo = this.magazineCapacity;
      this.speedMultiplier = 1.0 + (upgrades.speed * 0.18);
      this.powerupBonusTime = upgrades.power * 3.0;
      this.hoverboardMaxHits = 1 + (upgrades.board >= 1 ? 1 : 0);
      this.hoverboardHits = 0;
      this.isReloading = false;
      this.reloadTimer = 0;
      this.invulnerableTimer = 0;
      this.shootCooldown = 0;

      // Subway Surfers-style Power-up Timers & State
      this.rocketTimer = 0; // Hyper Rocket Jetpack
      this.hasHoverboard = false; // Cosmic Hoverboard Shield
      this.magnetTimer = 0; // Super Coin Magnet
      this.spreadShotTimer = 0; // Triple Spread Plasma
      this.rapidFireTimer = 0; // Rapid Fire
      this.dashCooldown = 0; // Quantum Dash cooldown
      this.overdriveTimer = 0; // Fury Overdrive Mega Laser
    }

    update(dt) {
      const baseSpeed = PLAYER_BASE_SPEED * this.speedMultiplier;
      const speed = this.rocketTimer > 0 ? baseSpeed * 1.8 : baseSpeed;

      // Direct Touch Drag / Steering (Mobile Ergonomics)
      if (isDirectDragging && touchTargetY !== null) {
        const dy = touchTargetY - this.y;
        this.y += dy * 0.22;
        this.tilt = Math.max(-0.25, Math.min(0.25, dy * 0.015));
      } else if (gameState.keys.up) {
        this.y -= speed;
        this.tilt = Math.max(this.tilt - 0.05, -0.22);
      } else if (gameState.keys.down) {
        this.y += speed;
        this.tilt = Math.min(this.tilt + 0.05, 0.22);
      } else {
        this.tilt *= 0.82;
      }

      // Vertical clamp
      const minY = 60;
      const maxY = CANVAS_HEIGHT - 60;
      this.y = Math.max(minY, Math.min(maxY, this.y));

      // Overdrive mega beam tick
      if (this.overdriveTimer > 0) {
        this.overdriveTimer -= dt;
        // Screen-wide particle lightning sparks
        for (let i = 0; i < 2; i++) {
          gameState.particles.push(new Particle(
            this.x + 40 + Math.random() * (CANVAS_WIDTH - this.x),
            this.y + (Math.random() * 40 - 20),
            -(Math.random() * 4 + 2),
            (Math.random() - 0.5) * 4,
            Math.random() * 8 + 3,
            Math.random() < 0.5 ? '#38bdf8' : '#fbbf24',
            0.2
          ));
        }
      }

      // Engine Flame & Hyper Rocket Exhaust
      if (this.rocketTimer > 0) {
        // Giant Hyper Rocket Jetstream
        for (let i = 0; i < 3; i++) {
          gameState.particles.push(new Particle(
            this.x - 55,
            this.y + (Math.random() * 16 - 8),
            -(Math.random() * 12 + 10),
            (Math.random() - 0.5) * 3,
            Math.random() * 10 + 5,
            Math.random() < 0.5 ? '#f59e0b' : '#ef4444',
            0.4
          ));
        }
        // Speed lines across canvas
        if (Math.random() < 0.5) {
          gameState.particles.push(new Particle(
            CANVAS_WIDTH + 50,
            Math.random() * CANVAS_HEIGHT,
            -(Math.random() * 18 + 25),
            0,
            Math.random() * 2 + 1,
            'rgba(255, 255, 255, 0.7)',
            0.6
          ));
        }
      } else if (Math.random() < 0.85) {
        // Standard engine flame
        gameState.particles.push(new Particle(
          this.x - 42,
          this.y + (Math.random() * 8 - 4),
          -(Math.random() * 4 + 4),
          (Math.random() - 0.5) * 1.5,
          Math.random() * 6 + 3,
          this.hasHoverboard ? '#a855f7' : (Math.random() < 0.5 ? '#f59e0b' : '#ef4444'),
          0.35
        ));
      }

      // Shoot cooldown
      if (this.shootCooldown > 0) this.shootCooldown -= dt;

      // Dash Cooldown
      if (this.dashCooldown > 0) this.dashCooldown -= dt;

      // Reload sequence
      if (this.isReloading) {
        this.reloadTimer -= dt;
        if (this.reloadTimer <= 0) {
          this.ammo = this.magazineCapacity;
          this.isReloading = false;
          playSound('click');
          triggerHaptic(20);
          gameState.floatingTexts.push(new FloatingText(this.x, this.y - 40, 'RELOADED!', '#22c55e'));
        }
      }

      // Invulnerability blink
      if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;

      // Power-up Timers
      if (this.rocketTimer > 0) this.rocketTimer -= dt;
      if (this.magnetTimer > 0) this.magnetTimer -= dt;
      if (this.spreadShotTimer > 0) this.spreadShotTimer -= dt;
      if (this.rapidFireTimer > 0) this.rapidFireTimer -= dt;

      // Hoverboard neon trail particles
      if (this.hasHoverboard && Math.random() < 0.4) {
        gameState.particles.push(new Particle(
          this.x - 20,
          this.y + 36,
          -(Math.random() * 3 + 2),
          (Math.random() - 0.5) * 1.0,
          Math.random() * 5 + 2,
          '#a855f7',
          0.3
        ));
      }
    }

    dash() {
      if (this.dashCooldown <= 0) {
        this.dashCooldown = 2.5;
        this.invulnerableTimer = 0.6;
        playSynthSound('dash');
        triggerHaptic(25);

        // Leave ghost after-image
        gameState.afterImages.push({
          x: this.x,
          y: this.y,
          tilt: this.tilt,
          planeKey: this.planeKey,
          alpha: 0.7,
          life: 0.35
        });

        // Quick burst movement
        if (gameState.keys.up) this.y = Math.max(60, this.y - 90);
        else if (gameState.keys.down) this.y = Math.min(CANVAS_HEIGHT - 60, this.y + 90);

        gameState.floatingTexts.push(new FloatingText(this.x, this.y - 40, 'WARP DASH!', '#38bdf8'));
      }
    }

    shoot() {
      if (this.isReloading) return;

      if (this.ammo > 0 && this.shootCooldown <= 0) {
        this.ammo--;
        this.shootCooldown = this.rapidFireTimer > 0 ? 0.10 : 0.20;
        playSound('shoot');
        triggerHaptic(12);

        if (this.spreadShotTimer > 0) {
          // Triple spread plasma
          gameState.torpedoes.push(new Torpedo(this.x + 40, this.y, 16, 0));
          gameState.torpedoes.push(new Torpedo(this.x + 36, this.y - 14, 15, -3.2));
          gameState.torpedoes.push(new Torpedo(this.x + 36, this.y + 14, 15, 3.2));
        } else {
          // Single torpedo
          gameState.torpedoes.push(new Torpedo(this.x + 40, this.y + 6, 16, 0));
        }

        // Muzzle flash particles
        for (let i = 0; i < 4; i++) {
          gameState.particles.push(new Particle(
            this.x + 45,
            this.y + 6,
            Math.random() * 3 + 2,
            (Math.random() - 0.5) * 3,
            Math.random() * 4 + 2,
            '#fbbf24',
            0.2
          ));
        }

        // Auto reload when all bullets are spent!
        if (this.ammo === 0) {
          this.reload();
        }
      } else if (this.ammo === 0 && !this.isReloading) {
        this.reload();
      }
    }

    reload() {
      if (this.ammo < this.magazineCapacity && !this.isReloading) {
        this.isReloading = true;
        this.reloadTimer = RELOAD_TIME;
        playSound('click');
        triggerHaptic(15);
        gameState.floatingTexts.push(new FloatingText(this.x, this.y - 35, 'RELOADING...', '#f59e0b'));
      }
    }

    takeDamage() {
      // 1. If Hyper Rocket or Overdrive is active, player is totally invincible!
      if (this.rocketTimer > 0 || this.overdriveTimer > 0 || this.invulnerableTimer > 0) {
        return;
      }

      // 2. If Hoverboard is active, it absorbs the crash!
      if (this.hasHoverboard) {
        this.hoverboardHits++;
        if (this.hoverboardHits >= this.hoverboardMaxHits) {
          this.hasHoverboard = false;
          this.hoverboardHits = 0;
        }
        this.invulnerableTimer = 1.4;
        gameState.screenShake = 16;
        playSynthSound('nuke');
        triggerHaptic([50, 30, 50]);
        gameState.floatingTexts.push(new FloatingText(this.x, this.y - 45, '🛹 HOVERBOARD ABSORBED IMPACT!', '#a855f7'));

        // EMP shockwave clearing nearby bullets
        gameState.enemyProjectiles = [];
        createExplosion(this.x, this.y + 20, 25, '#a855f7');
        return;
      }

      // 3. Normal damage
      this.lives--;
      this.invulnerableTimer = 1.6;
      gameState.screenShake = 14;
      gameState.combo = 0;
      playSound('death');
      triggerHaptic([60, 40, 60]);

      for (let i = 0; i < 16; i++) {
        gameState.particles.push(new Particle(
          this.x, this.y,
          (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8,
          Math.random() * 6 + 2, '#ef4444', 0.6
        ));
      }

      if (this.lives <= 0) {
        endGame(false);
      }
    }

    draw(ctx) {
      if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
        return; // Blink
      }

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.tilt);

      // Draw Fury Overdrive Mega Laser Beam
      if (this.overdriveTimer > 0) {
        ctx.save();
        const beamGrad = ctx.createLinearGradient(0, -30, 0, 30);
        beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0.05)');
        beamGrad.addColorStop(0.2, 'rgba(56, 189, 248, 0.7)');
        beamGrad.addColorStop(0.5, '#ffffff');
        beamGrad.addColorStop(0.8, 'rgba(245, 158, 11, 0.7)');
        beamGrad.addColorStop(1, 'rgba(245, 158, 11, 0.05)');

        ctx.fillStyle = beamGrad;
        ctx.fillRect(40, -32, CANVAS_WIDTH, 64);

        // Core bright beam
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 24;
        ctx.fillRect(40, -10, CANVAS_WIDTH, 20);

        // Charging muzzle lens
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(40, 0, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw Cosmic Hoverboard underneath aircraft using custom sprite
      if (this.hasHoverboard) {
        ctx.save();
        const hbImg = images.hoverboardBoard;
        if (hbImg && hbImg.complete && hbImg.naturalWidth > 0) {
          ctx.drawImage(hbImg, -this.width * 0.6, this.height * 0.35, this.width * 1.2, 32);
        } else {
          ctx.fillStyle = '#a855f7';
          ctx.strokeStyle = '#e879f9';
          ctx.lineWidth = 3;
          ctx.shadowColor = '#d946ef';
          ctx.shadowBlur = 16;
          ctx.beginPath();
          ctx.roundRect(-this.width * 0.55, this.height * 0.45, this.width * 1.1, 14, 6);
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      }

      // Draw Hyper Rocket Aura
      if (this.rocketTimer > 0) {
        ctx.save();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width * 0.8, this.height * 0.9, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Draw Coin Magnet Pulse Aura
      if (this.magnetTimer > 0) {
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const pulseRad = 60 + Math.sin(Date.now() * 0.01) * 12;
        ctx.arc(0, 0, pulseRad, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      const img = images[this.planeKey] || images.plane_1_red;
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, -this.width / 2, -this.height / 2, this.width, this.height);
      } else {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
      }

      // Reloading Progress Arc
      if (this.isReloading) {
        const progress = 1 - (this.reloadTimer / RELOAD_TIME);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, 42, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  // --- Torpedo Class ---
  class Torpedo {
    constructor(x, y, speed, vy = 0) {
      this.x = x;
      this.y = y;
      this.width = 50;
      this.height = 18;
      this.speed = speed;
      this.vy = vy;
      this.markedForDeletion = false;
    }

    update() {
      this.x += this.speed;
      this.y += this.vy;
      if (this.x > CANVAS_WIDTH + 80 || this.y < -50 || this.y > CANVAS_HEIGHT + 50) {
        this.markedForDeletion = true;
      }

      if (Math.random() < 0.6) {
        gameState.particles.push(new Particle(
          this.x - 20,
          this.y,
          -(Math.random() * 3 + 2),
          (Math.random() - 0.5) * 1.2,
          Math.random() * 4 + 2,
          Math.random() < 0.5 ? '#f59e0b' : '#38bdf8',
          0.25
        ));
      }
    }

    draw(ctx) {
      const img = images.torpedo;
      if (img && img.complete) {
        ctx.drawImage(img, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
      } else {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(this.x - 20, this.y - 4, 40, 8);
      }
    }
  }

  // --- Enemy Projectile Class ---
  class EnemyProjectile {
    constructor(x, y, vx, vy) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.width = 30;
      this.height = 30;
      this.radius = 14;
      this.markedForDeletion = false;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -60 || this.x > CANVAS_WIDTH + 60 || this.y < -60 || this.y > CANVAS_HEIGHT + 60) {
        this.markedForDeletion = true;
      }
    }

    draw(ctx) {
      const img = images.bossFireball;
      if (img && img.complete) {
        ctx.drawImage(img, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
      } else {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // --- Enemy UFO Class ---
  class Enemy {
    constructor(isHeavy = false) {
      this.isHeavy = isHeavy;
      this.width = isHeavy ? 100 : 80;
      this.height = isHeavy ? 75 : 60;
      this.x = CANVAS_WIDTH + 80;
      this.baseY = Math.random() * (CANVAS_HEIGHT - 220) + 110;
      this.y = this.baseY;

      const diffMultiplier = selectedDifficulty === 'insane' ? 1.4 : (selectedDifficulty === 'hard' ? 1.2 : 1.0);
      this.speed = (Math.random() * 2.2 + (isHeavy ? 2.5 : 3.5)) * diffMultiplier;
      this.sineOffset = Math.random() * Math.PI * 2;
      this.sineSpeed = Math.random() * 2 + 1.2;
      this.sineAmplitude = isHeavy ? 20 : Math.random() * 35 + 15;
      this.maxHp = isHeavy ? 5 : 2;
      this.hp = this.maxHp;
      this.hitFlashTimer = 0;
      this.shootCooldown = Math.random() * 2.5 + 2.0;
      this.markedForDeletion = false;
    }

    update(dt) {
      this.x -= this.speed;
      this.y = this.baseY + Math.sin(Date.now() * 0.003 * this.sineSpeed + this.sineOffset) * this.sineAmplitude;

      if (this.hitFlashTimer > 0) this.hitFlashTimer -= dt;

      // In Sector 2+ or Heavy UFOs, shoot back!
      if (gameState.sectorIndex >= 1) {
        this.shootCooldown -= dt;
        if (this.shootCooldown <= 0 && this.x < CANVAS_WIDTH - 60 && this.x > 250) {
          this.shoot();
          this.shootCooldown = Math.random() * 2.5 + 2.5;
        }
      }

      if (this.x < -120) this.markedForDeletion = true;
    }

    shoot() {
      if (!gameState.player) return;
      const dx = gameState.player.x - this.x;
      const dy = gameState.player.y - this.y;
      const dist = Math.hypot(dx, dy) || 1;
      const spd = 5.5;
      gameState.enemyProjectiles.push(new EnemyProjectile(
        this.x - 30, this.y,
        (dx / dist) * spd, (dy / dist) * spd
      ));
    }

    takeDamage(damage) {
      this.hp -= damage;
      this.hitFlashTimer = 0.12;

      for (let i = 0; i < 4; i++) {
        gameState.particles.push(new Particle(
          this.x, this.y,
          (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5,
          Math.random() * 4 + 2, '#38bdf8', 0.25
        ));
      }

      if (this.hp <= 0) {
        this.destroy();
      }
    }

    destroy() {
      this.markedForDeletion = true;
      gameState.sectorKills++;
      gameState.totalKills++;
      gameState.coins += this.isHeavy ? 2 : 1;

      addFury(this.isHeavy ? 6 : 4);
      checkAchievement('first_blood');

      gameState.combo++;
      gameState.comboTimer = 2.8;
      const multiplier = Math.min(gameState.combo, 5);
      if (multiplier >= 5) checkAchievement('combo_master');

      const earnedScore = (this.isHeavy ? 300 : 150) * multiplier;
      gameState.score += earnedScore;

      playSound('morte');

      const comboMsg = multiplier > 1 ? `+${earnedScore} (x${multiplier} COMBO!)` : `+${earnedScore}`;
      gameState.floatingTexts.push(new FloatingText(this.x, this.y, comboMsg, '#fbbf24'));

      createExplosion(this.x, this.y, this.isHeavy ? 30 : 20, this.isHeavy ? '#ef4444' : '#38bdf8');

      // Random Power-up Drop Chance (32% chance)
      if (Math.random() < 0.32) {
        spawnRandomPowerup(this.x, this.y);
      }

      checkSectorProgress();
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);

      if (this.hitFlashTimer > 0) {
        ctx.filter = 'brightness(2.5)';
      }

      const img = images.enemyOvni;
      if (img && img.complete) {
        ctx.drawImage(img, -this.width / 2, -this.height / 2, this.width, this.height);
      } else {
        ctx.fillStyle = this.isHeavy ? '#ef4444' : '#a855f7';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // HP bar
      if (this.hp < this.maxHp) {
        const barW = 50;
        const barH = 5;
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(-barW / 2, -this.height / 2 - 10, barW, barH);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(-barW / 2, -this.height / 2 - 10, barW * (this.hp / this.maxHp), barH);
      }

      ctx.restore();
    }
  }

  // --- Space Asteroid Hazard Class ---
  class Asteroid {
    constructor() {
      this.radius = Math.random() * 22 + 20;
      this.width = this.radius * 2;
      this.height = this.radius * 2;
      this.x = CANVAS_WIDTH + 60;
      this.y = Math.random() * (CANVAS_HEIGHT - 160) + 80;
      this.speed = Math.random() * 2.5 + 2.5;
      this.rotation = 0;
      this.rotSpeed = (Math.random() - 0.5) * 0.05;
      this.hp = 3;
      this.variant = Math.random() < 0.5 ? 'asteroid1' : 'asteroid2';
      this.markedForDeletion = false;
    }

    update() {
      this.x -= this.speed;
      this.rotation += this.rotSpeed;
      if (this.x < -80) this.markedForDeletion = true;
    }

    takeDamage(damage) {
      this.hp -= damage;
      for (let i = 0; i < 4; i++) {
        gameState.particles.push(new Particle(
          this.x, this.y,
          (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4,
          Math.random() * 4 + 2, '#94a3b8', 0.25
        ));
      }
      if (this.hp <= 0) {
        this.markedForDeletion = true;
        createExplosion(this.x, this.y, 16, '#64748b');
        gameState.score += 80;
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      const astImg = images[this.variant];
      if (astImg && astImg.complete && astImg.naturalWidth > 0) {
        ctx.drawImage(astImg, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
      } else {
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const ang = (i / 8) * Math.PI * 2;
          const rad = this.radius * (0.8 + (i % 2) * 0.35);
          const px = Math.cos(ang) * rad;
          const py = Math.sin(ang) * rad;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  // --- Collectible Arcade Power-up Class ---
  class Powerup {
    constructor(x, y, type) {
      this.x = x;
      this.y = y;
      this.type = type; // 'rocket', 'hoverboard', 'magnet', 'spread', 'heal', 'ammo', 'nuke'
      this.radius = 24;
      this.width = 48;
      this.height = 48;
      this.speed = 1.8;
      this.bobOffset = Math.random() * Math.PI * 2;
      this.markedForDeletion = false;
    }

    update() {
      this.x -= this.speed;
      this.y += Math.sin(Date.now() * 0.005 + this.bobOffset) * 0.8;

      // Super Coin Magnet Attraction
      if (gameState.player) {
        const dx = gameState.player.x - this.x;
        const dy = gameState.player.y - this.y;
        const dist = Math.hypot(dx, dy);

        // If magnet or rocket is active, screen-wide pull!
        const magnetRange = (gameState.player.magnetTimer > 0 || gameState.player.rocketTimer > 0) ? 900 : 200;

        if (dist < magnetRange) {
          const pullSpeed = (gameState.player.magnetTimer > 0 || gameState.player.rocketTimer > 0) ? 14 : 5;
          this.x += (dx / dist) * pullSpeed;
          this.y += (dy / dist) * pullSpeed;
        }
      }

      if (this.x < -60) this.markedForDeletion = true;
    }

    apply(player) {
      this.markedForDeletion = true;
      addFury(3);

      const bonus = player.powerupBonusTime || 0;

      if (this.type === 'rocket') {
        player.rocketTimer = 6.0 + bonus;
        playSynthSound('rocket');
        triggerHaptic([40, 20, 40]);
        checkAchievement('rocket_ace');
        gameState.floatingTexts.push(new FloatingText(player.x, player.y - 45, `🚀 HYPER ROCKET (${(6 + bonus).toFixed(0)}s)!`, '#f59e0b'));
      } else if (this.type === 'hoverboard') {
        player.hasHoverboard = true;
        player.hoverboardHits = 0;
        playSynthSound('hoverboard');
        triggerHaptic([30, 20, 30]);
        checkAchievement('hover_pro');
        const hitsText = player.hoverboardMaxHits > 1 ? ` (${player.hoverboardMaxHits} HITS)` : '';
        gameState.floatingTexts.push(new FloatingText(player.x, player.y - 45, `🛹 HOVERBOARD EQUIPPED${hitsText}!`, '#a855f7'));
      } else if (this.type === 'magnet') {
        player.magnetTimer = 12.0 + bonus;
        playSynthSound('magnet');
        triggerHaptic([20, 20, 20]);
        checkAchievement('magnet_king');
        gameState.floatingTexts.push(new FloatingText(player.x, player.y - 45, `🧲 COIN MAGNET (${(12 + bonus).toFixed(0)}s)!`, '#38bdf8'));
      } else if (this.type === 'spread') {
        player.spreadShotTimer = 10.0 + bonus;
        playSynthSound('powerup');
        triggerHaptic(20);
        gameState.floatingTexts.push(new FloatingText(player.x, player.y - 45, '⚡ TRIPLE SPREAD SHOT!', '#fbbf24'));
      } else if (this.type === 'heal') {
        if (player.lives < MAX_LIVES) player.lives++;
        playSynthSound('powerup');
        triggerHaptic([30, 30, 30]);
        gameState.floatingTexts.push(new FloatingText(player.x, player.y - 45, '❤️ HULL REPAIRED (+1 LIFE)', '#22c55e'));
      } else if (this.type === 'ammo') {
        player.ammo = player.magazineCapacity;
        player.rapidFireTimer = 6.0 + bonus;
        playSynthSound('powerup');
        triggerHaptic(20);
        gameState.floatingTexts.push(new FloatingText(player.x, player.y - 45, '📦 RAPID FIRE & AMMO!', '#f97316'));
      } else if (this.type === 'nuke') {
        playSynthSound('nuke');
        gameState.screenShake = 24;
        triggerHaptic([80, 40, 80]);
        gameState.floatingTexts.push(new FloatingText(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, '💥 SMART NUKE ACTIVATED!', '#ef4444'));
        gameState.enemies.forEach(e => e.destroy());
        gameState.enemyProjectiles = [];
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);

      let imgKey = 'powerupRocket';
      let auraColor = '#38bdf8';
      if (this.type === 'rocket') { imgKey = 'powerupRocket'; auraColor = '#f59e0b'; }
      else if (this.type === 'hoverboard') { imgKey = 'powerupHoverboard'; auraColor = '#a855f7'; }
      else if (this.type === 'magnet') { imgKey = 'powerupMagnet'; auraColor = '#38bdf8'; }
      else if (this.type === 'spread') { imgKey = 'powerupSpread'; auraColor = '#fbbf24'; }
      else if (this.type === 'heal') { imgKey = 'powerupRepair'; auraColor = '#22c55e'; }
      else if (this.type === 'ammo') { imgKey = 'powerupSpread'; auraColor = '#f97316'; }
      else if (this.type === 'nuke') { imgKey = 'powerupNuke'; auraColor = '#ef4444'; }

      // Outer glowing pulse ring
      ctx.save();
      ctx.strokeStyle = auraColor;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = auraColor;
      ctx.shadowBlur = 16;
      const pulseSize = this.radius + 3 + Math.sin(Date.now() * 0.008 + this.bobOffset) * 3;
      ctx.beginPath();
      ctx.arc(0, 0, pulseSize, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      const pImg = images[imgKey];
      if (pImg && pImg.complete && pImg.naturalWidth > 0) {
        ctx.drawImage(pImg, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
      } else {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = auraColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  function spawnRandomPowerup(x, y) {
    const types = ['rocket', 'hoverboard', 'magnet', 'spread', 'heal', 'ammo', 'nuke'];
    const weights = [0.18, 0.18, 0.18, 0.18, 0.14, 0.08, 0.06];
    const rand = Math.random();
    let cumulative = 0;
    let chosen = types[0];

    for (let i = 0; i < types.length; i++) {
      cumulative += weights[i];
      if (rand <= cumulative) {
        chosen = types[i];
        break;
      }
    }
    gameState.powerups.push(new Powerup(x, y, chosen));
  }

  // --- Boss Mothership Class ---
  class Boss {
    constructor() {
      this.width = 250;
      this.height = 190;
      this.x = CANVAS_WIDTH + 260;
      this.targetX = CANVAS_WIDTH - 240;
      this.y = CANVAS_HEIGHT / 2;
      this.targetY = this.y;
      this.maxHp = selectedDifficulty === 'insane' ? 55 : (selectedDifficulty === 'hard' ? 45 : 35);
      this.hp = this.maxHp;
      this.hitFlashTimer = 0;
      this.attackTimer = 1.8;
      this.moveTimer = 0;
      this.markedForDeletion = false;
      this.dying = false;
      this.deathTimer = 0;
      this.phase = 1;
    }

    update(dt) {
      if (this.dying) {
        this.deathTimer -= dt;
        if (Math.random() < 0.5) {
          createExplosion(
            this.x + (Math.random() - 0.5) * this.width,
            this.y + (Math.random() - 0.5) * this.height,
            16,
            '#ef4444'
          );
        }
        if (this.deathTimer <= 0) {
          this.markedForDeletion = true;
          endGame(true);
        }
        return;
      }

      if (this.x > this.targetX) {
        this.x -= 2.2;
      } else {
        this.moveTimer -= dt;
        if (this.moveTimer <= 0) {
          this.targetY = Math.random() * (CANVAS_HEIGHT - 280) + 140;
          this.moveTimer = Math.random() * 2.0 + 1.6;
        }
        this.y += (this.targetY - this.y) * 0.04;

        const hpPercent = this.hp / this.maxHp;
        if (hpPercent > 0.65) this.phase = 1;
        else if (hpPercent > 0.3) this.phase = 2;
        else this.phase = 3;

        this.attackTimer -= dt;
        if (this.attackTimer <= 0) {
          this.executeAttack();
          this.attackTimer = this.phase === 3 ? 1.2 : (this.phase === 2 ? 1.6 : 2.0);
        }
      }

      if (this.hitFlashTimer > 0) this.hitFlashTimer -= dt;

      if (this.phase >= 2 && Math.random() < 0.6) {
        gameState.particles.push(new Particle(
          this.x - 40 + (Math.random() - 0.5) * 40,
          this.y + (Math.random() - 0.5) * 40,
          -(Math.random() * 3 + 1),
          -(Math.random() * 2 + 1),
          Math.random() * 8 + 4,
          this.phase === 3 ? '#ef4444' : '#64748b',
          0.8
        ));
      }
    }

    executeAttack() {
      if (!gameState.player || this.dying) return;
      playSound('shoot');

      if (this.phase === 1) {
        const dx = gameState.player.x - this.x;
        const dy = gameState.player.y - this.y;
        const dist = Math.hypot(dx, dy) || 1;
        const spd = 7.5;
        gameState.enemyProjectiles.push(new EnemyProjectile(
          this.x - 60, this.y,
          (dx / dist) * spd, (dy / dist) * spd
        ));
      } else if (this.phase === 2) {
        const angles = [-0.25, 0, 0.25];
        angles.forEach(ang => {
          const spd = 7.0;
          gameState.enemyProjectiles.push(new EnemyProjectile(
            this.x - 60, this.y,
            -Math.cos(ang) * spd, Math.sin(ang) * spd
          ));
        });
      } else if (this.phase === 3) {
        const angles = [-0.4, -0.2, 0, 0.2, 0.4];
        angles.forEach(ang => {
          const spd = 7.5;
          gameState.enemyProjectiles.push(new EnemyProjectile(
            this.x - 60, this.y,
            -Math.cos(ang) * spd, Math.sin(ang) * spd
          ));
        });
      }
    }

    takeDamage(damage) {
      if (this.dying) return;
      this.hp -= damage;
      this.hitFlashTimer = 0.12;

      for (let i = 0; i < 4; i++) {
        gameState.particles.push(new Particle(
          this.x - 60,
          this.y + (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6,
          Math.random() * 5 + 3, '#f59e0b', 0.35
        ));
      }

      if (this.hp <= 0) {
        this.destroy();
      }
    }

    destroy() {
      this.dying = true;
      this.deathTimer = 2.4;
      gameState.score += 3000;
      gameState.coins += 15;
      gameState.screenShake = 24;
      playSound('morte');
      gameState.floatingTexts.push(new FloatingText(this.x, this.y - 50, '🏆 MOTHERSHIP DESTROYED!', '#fbbf24'));
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);

      if (this.hitFlashTimer > 0) {
        ctx.filter = 'brightness(2.5)';
      }

      if (this.phase === 3) {
        ctx.save();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 20;
        ctx.strokeRect(-this.width / 2 - 6, -this.height / 2 - 6, this.width + 12, this.height + 12);
        ctx.restore();
      }

      const img = images.boss;
      if (img && img.complete) {
        ctx.drawImage(img, -this.width / 2, -this.height / 2, this.width, this.height);
      } else {
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
      }

      ctx.restore();

      // Top Boss Health Bar
      const barWidth = 480;
      const barHeight = 18;
      const barX = (CANVAS_WIDTH - barWidth) / 2;
      const barY = 32;
      const hpRatio = Math.max(0, this.hp / this.maxHp);

      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.fillRect(barX - 4, barY - 4, barWidth + 8, barHeight + 8);
      ctx.strokeStyle = this.phase === 3 ? '#ef4444' : '#f59e0b';
      ctx.lineWidth = 2;
      ctx.strokeRect(barX - 4, barY - 4, barWidth + 8, barHeight + 8);

      const grad = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
      grad.addColorStop(0, '#ef4444');
      grad.addColorStop(1, '#f59e0b');
      ctx.fillStyle = grad;
      ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);

      ctx.font = '12px "GameFont", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      const phaseLabel = this.phase === 3 ? 'ENRAGED PHASE' : `PHASE ${this.phase}`;
      ctx.fillText(`MOTHERSHIP BOSS [${phaseLabel}]: ${Math.max(0, this.hp)} / ${this.maxHp}`, CANVAS_WIDTH / 2, barY + 14);
      ctx.restore();
    }
  }

  // --- Particles & Explosions ---
  class Particle {
    constructor(x, y, vx, vy, radius, color, life) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.radius = radius;
      this.color = color;
      this.maxLife = life;
      this.life = life;
      this.markedForDeletion = false;
    }

    update(dt) {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= dt;
      if (this.life <= 0) this.markedForDeletion = true;
    }

    draw(ctx) {
      const alpha = Math.max(0, this.life / this.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function createExplosion(x, y, count, color) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;
      gameState.particles.push(new Particle(
        x, y,
        Math.cos(angle) * speed, Math.sin(angle) * speed,
        Math.random() * 6 + 3,
        color,
        Math.random() * 0.4 + 0.3
      ));
    }
  }

  // --- Floating Combat Text ---
  class FloatingText {
    constructor(x, y, text, color) {
      this.x = x;
      this.y = y;
      this.text = text;
      this.color = color;
      this.life = 1.2;
      this.maxLife = 1.2;
      this.markedForDeletion = false;
    }

    update(dt) {
      this.y -= 28 * dt;
      this.life -= dt;
      if (this.life <= 0) this.markedForDeletion = true;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
      ctx.font = '15px "GameFont", sans-serif';
      ctx.fillStyle = this.color;
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 6;
      ctx.fillText(this.text, this.x, this.y);
      ctx.restore();
    }
  }

  // --- Sector Progress Check ---
  function checkSectorProgress() {
    if (gameState.gameMode === 'survival') {
      if (gameState.sectorKills >= 15) {
        gameState.survivalWave++;
        gameState.sectorKills = 0;
        gameState.sectorIndex = (gameState.sectorIndex + 1) % 4;
        playSynthSound('powerup');
        gameState.bannerText = `⚡ SURVIVAL WAVE ${gameState.survivalWave} INCOMING! ⚡`;
        gameState.bannerTimer = 3.5;
        gameState.score += 800;
        if (gameState.survivalWave % 3 === 0) {
          spawnBoss();
        }
      }
      return;
    }

    const currentSector = SECTOR_CONFIG[gameState.sectorIndex];
    if (gameState.sectorIndex < 3 && gameState.sectorKills >= currentSector.targetKills) {
      gameState.sectorIndex++;
      gameState.sectorKills = 0;
      const nextSector = SECTOR_CONFIG[gameState.sectorIndex];

      playSynthSound('powerup');
      gameState.bannerText = `🌟 SECTOR CLEARED! HYPERSPACE JUMP -> ${nextSector.name} 🌟`;
      gameState.bannerTimer = 3.5;
      gameState.score += 500;

      if (gameState.sectorIndex === 3) {
        spawnBoss();
      }
    }
  }

  function spawnBoss() {
    gameState.bossSpawned = true;
    gameState.enemies = [];
    gameState.asteroids = [];
    gameState.enemyProjectiles = [];
    gameState.bannerText = '⚠️ WARNING: ALIEN MOTHERSHIP APPROACHING! ⚠️';
    gameState.bannerTimer = 4.0;
    gameState.boss = new Boss();
  }

  // --- Fury Overdrive System ---
  function addFury(amount) {
    if (!gameState.player || gameState.player.overdriveTimer > 0) return;
    gameState.fury = Math.min(100, gameState.fury + amount);
    if (gameState.fury >= 100) {
      if (btnMobileOverdrive) btnMobileOverdrive.classList.add('ready');
      if (touchOverdrive) touchOverdrive.classList.add('ready');
    } else {
      if (btnMobileOverdrive) btnMobileOverdrive.classList.remove('ready');
      if (touchOverdrive) touchOverdrive.classList.remove('ready');
    }
  }

  function activateOverdrive() {
    if (gameState.screen !== 'PLAYING' || !gameState.player) return;
    if (gameState.fury < 100 && gameState.player.overdriveTimer <= 0) {
      gameState.floatingTexts.push(new FloatingText(gameState.player.x, gameState.player.y - 30, '⚡ FURY CHARGING...', '#94a3b8'));
      return;
    }
    if (gameState.fury >= 100) {
      gameState.fury = 0;
      gameState.player.overdriveTimer = 4.0;
      gameState.player.invulnerableTimer = 4.0;
      gameState.screenShake = 22;
      playSynthSound('nuke');
      triggerHaptic([80, 40, 80]);
      createExplosion(gameState.player.x + 40, gameState.player.y, 35, '#38bdf8');
      gameState.floatingTexts.push(new FloatingText(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, '⚡ FURY OVERDRIVE UNLEASHED! ⚡', '#fbbf24'));
      if (btnMobileOverdrive) btnMobileOverdrive.classList.remove('ready');
      if (touchOverdrive) touchOverdrive.classList.remove('ready');
      checkAchievement('overdrive_unleashed');
    }
  }

  // --- Achievement & Trophy Engine ---
  let toastTimeout = null;
  function showAchievementToast(title, desc) {
    if (!achievementToast) return;
    if (toastTitle) toastTitle.textContent = title;
    if (toastDesc) toastDesc.textContent = desc;
    achievementToast.classList.remove('hidden');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      achievementToast.classList.add('hidden');
    }, 3800);
  }

  function checkAchievement(id) {
    if (achievements[id]) return;
    achievements[id] = true;
    localStorage.setItem('galaxyfighter_achievements', JSON.stringify(achievements));
    const def = ACHIEVEMENT_DEFS.find(a => a.id === id);
    if (def) {
      bankedCoins += def.reward;
      localStorage.setItem('galaxyfighter_banked_coins', bankedCoins.toString());
      updateCoinBadges();
      showAchievementToast(def.title, `${def.desc} (+${def.reward} 🪙)`);
      playSynthSound('powerup');
      triggerHaptic([30, 20, 40]);
    }
  }

  function renderAchievementsList() {
    if (!achievementsList) return;
    achievementsList.innerHTML = '';
    let unlockedCount = 0;

    ACHIEVEMENT_DEFS.forEach(ach => {
      const isUnlocked = achievements[ach.id] === true;
      if (isUnlocked) unlockedCount++;

      const row = document.createElement('div');
      row.className = `achievement-row ${isUnlocked ? 'unlocked' : ''}`;
      row.innerHTML = `
        <div style="font-size: 1.5rem; flex-shrink: 0;">${ach.icon}</div>
        <div style="flex-grow: 1;">
          <h4 style="color: ${isUnlocked ? '#fbbf24' : '#94a3b8'}; font-size: 0.85rem; margin-bottom: 2px;">${ach.title}</h4>
          <p style="color: #64748b; font-size: 0.72rem; margin: 0;">${ach.desc}</p>
        </div>
        <div style="text-align: right; flex-shrink: 0;">
          <span style="font-family: 'GameFont', sans-serif; font-size: 0.68rem; color: ${isUnlocked ? '#22c55e' : '#64748b'};">
            ${isUnlocked ? 'COMPLETED' : `+${ach.reward} 🪙`}
          </span>
        </div>
      `;
      achievementsList.appendChild(row);
    });

    if (achievementsCount) {
      achievementsCount.textContent = `${unlockedCount}/${ACHIEVEMENT_DEFS.length} Unlocked`;
    }
  }

  // --- Hangar Shop & Upgrades System ---
  const UPGRADE_COSTS = {
    mag: [100, 250],
    speed: [150, 300],
    power: [120, 260],
    board: [200]
  };

  function updateCoinBadges() {
    if (topCoinCount) topCoinCount.textContent = bankedCoins.toString();
    if (shopCoinBalance) shopCoinBalance.textContent = `${bankedCoins} Coins`;
    renderShopPills();
    renderAchievementsList();
  }

  function renderShopPills() {
    const updatePillUI = (type, pillContainerId, btnId, costSpanId) => {
      const pillsContainer = document.getElementById(pillContainerId);
      const btn = document.getElementById(btnId);
      const costSpan = document.getElementById(costSpanId);
      if (!pillsContainer || !btn || !costSpan) return;

      const currentLvl = upgrades[type] || 0;
      const costs = UPGRADE_COSTS[type];
      const maxLvl = costs.length;

      const pillElements = pillsContainer.querySelectorAll('.pill');
      pillElements.forEach((p, idx) => {
        if (idx <= currentLvl) p.classList.add('active');
        else p.classList.remove('active');
      });

      if (currentLvl >= maxLvl) {
        costSpan.textContent = 'MAXED';
        btn.disabled = true;
      } else {
        const nextCost = costs[currentLvl];
        costSpan.textContent = `${nextCost} 🪙`;
        btn.disabled = bankedCoins < nextCost;
      }
    };

    updatePillUI('mag', 'pillsMag', 'btnBuyMag', 'costMag');
    updatePillUI('speed', 'pillsSpeed', 'btnBuySpeed', 'costSpeed');
    updatePillUI('power', 'pillsPower', 'btnBuyPower', 'costPower');
    updatePillUI('board', 'pillsBoard', 'btnBuyBoard', 'costBoard');
  }

  function buyUpgrade(type) {
    const currentLvl = upgrades[type] || 0;
    const costs = UPGRADE_COSTS[type];
    if (currentLvl >= costs.length) return;

    const cost = costs[currentLvl];
    if (bankedCoins >= cost) {
      bankedCoins -= cost;
      upgrades[type] = currentLvl + 1;
      localStorage.setItem('galaxyfighter_banked_coins', bankedCoins.toString());
      localStorage.setItem('galaxyfighter_upgrades', JSON.stringify(upgrades));
      playSound('powerup');
      triggerHaptic(25);
      updateCoinBadges();
    }
  }

  // --- Collision Helpers ---
  function checkCollision(r1, r2) {
    return (
      r1.x - r1.width / 2 < r2.x + r2.width / 2 &&
      r1.x + r1.width / 2 > r2.x - r2.width / 2 &&
      r1.y - r1.height / 2 < r2.y + r2.height / 2 &&
      r1.y + r1.height / 2 > r2.y - r2.height / 2
    );
  }

  function checkCircleCollision(c, r) {
    const distX = Math.abs(c.x - r.x);
    const distY = Math.abs(c.y - r.y);
    if (distX > r.width / 2 + c.radius) return false;
    if (distY > r.height / 2 + c.radius) return false;
    if (distX <= r.width / 2) return true;
    if (distY <= r.height / 2) return true;
    const dx = distX - r.width / 2;
    const dy = distY - r.height / 2;
    return dx * dx + dy * dy <= c.radius * c.radius;
  }

  // --- HUD Rendering ---
  function drawHUD(ctx) {
    // 1. Sector Badge / Survival Wave
    const currentSector = SECTOR_CONFIG[gameState.sectorIndex] || SECTOR_CONFIG[0];
    ctx.save();
    ctx.font = '12px "GameFont", sans-serif';
    ctx.fillStyle = currentSector.themeColor;
    ctx.textAlign = 'left';

    if (gameState.gameMode === 'survival') {
      ctx.fillText(`⚡ SURVIVAL WAVE ${gameState.survivalWave}`, 40, 24);
      ctx.font = '10px "GameFont", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`WAVE KILLS: ${gameState.sectorKills} / 15`, 40, 38);
    } else {
      ctx.fillText(`SECTOR ${currentSector.id}/4: ${currentSector.name}`, 40, 24);
      if (gameState.sectorIndex < 3) {
        ctx.font = '10px "GameFont", sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`KILLS: ${gameState.sectorKills} / ${currentSector.targetKills}`, 40, 38);
      }
    }
    ctx.restore();

    // 2. Lives (Hearts)
    for (let i = 0; i < MAX_LIVES; i++) {
      const x = 40 + i * 40;
      const y = 48;
      const hasLife = i < gameState.player.lives;
      ctx.save();
      ctx.globalAlpha = hasLife ? 1.0 : 0.22;
      const img = images.iconLife;
      if (img && img.complete) {
        ctx.drawImage(img, x, y, 32, 32);
      } else {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(x, y, 28, 28);
      }
      ctx.restore();
    }

    // 3. Magazine
    const magX = 40;
    const magY = 88;
    const magCap = gameState.player.magazineCapacity;
    for (let i = 0; i < magCap; i++) {
      const x = magX + i * 24;
      const hasBullet = i < gameState.player.ammo;
      ctx.save();
      ctx.globalAlpha = hasBullet ? 1.0 : 0.2;
      const img = images.iconAmmo;
      if (img && img.complete) {
        ctx.drawImage(img, x, magY, 24, 24);
      } else {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(x, magY, 20, 20);
      }
      ctx.restore();
    }

    // Reload Prompt
    if (gameState.player.ammo === 0 || gameState.player.isReloading) {
      ctx.save();
      ctx.font = '11px "GameFont", sans-serif';
      ctx.fillStyle = gameState.player.isReloading ? '#f59e0b' : '#ef4444';
      ctx.textAlign = 'left';
      const prompt = gameState.player.isReloading ? 'RELOADING...' : 'PRESS [R] / [○] TO RELOAD!';
      ctx.fillText(prompt, magX + magCap * 24 + 8, magY + 17);
      ctx.restore();
    }

    // 4. Fury Overdrive Gauge
    const furyX = 40;
    const furyY = 124;
    const furyW = 150;
    const furyH = 12;
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = gameState.fury >= 100 ? '#f59e0b' : '#334155';
    ctx.lineWidth = 1.5;
    ctx.fillRect(furyX, furyY, furyW, furyH);
    ctx.strokeRect(furyX, furyY, furyW, furyH);

    const furyPct = Math.min(1, gameState.fury / 100);
    if (furyPct > 0) {
      const grad = ctx.createLinearGradient(furyX, 0, furyX + furyW, 0);
      grad.addColorStop(0, '#38bdf8');
      grad.addColorStop(1, '#f59e0b');
      ctx.fillStyle = grad;
      ctx.fillRect(furyX + 2, furyY + 2, (furyW - 4) * furyPct, furyH - 4);
    }

    ctx.font = '9px "GameFont", sans-serif';
    ctx.fillStyle = gameState.fury >= 100 ? '#fbbf24' : '#94a3b8';
    const furyLabel = gameState.fury >= 100 ? '⚡ FURY READY! [Q/E / ⚡]' : `⚡ FURY: ${Math.floor(gameState.fury)}%`;
    ctx.fillText(furyLabel, furyX, furyY - 4);
    ctx.restore();

    // 5. Power-up Timers & Active Badges
    let pOffset = 0;
    if (gameState.player.overdriveTimer > 0) {
      ctx.save();
      ctx.fillStyle = '#fbbf24';
      ctx.font = '11px "GameFont", sans-serif';
      ctx.fillText(`⚡ OVERDRIVE BEAM: ${gameState.player.overdriveTimer.toFixed(1)}s`, 40, 156 + pOffset);
      pOffset += 18;
      ctx.restore();
    }
    if (gameState.player.rocketTimer > 0) {
      ctx.save();
      ctx.fillStyle = '#f59e0b';
      ctx.font = '11px "GameFont", sans-serif';
      ctx.fillText(`🚀 HYPER ROCKET: ${gameState.player.rocketTimer.toFixed(1)}s`, 40, 156 + pOffset);
      pOffset += 18;
      ctx.restore();
    }
    if (gameState.player.hasHoverboard) {
      ctx.save();
      ctx.fillStyle = '#a855f7';
      ctx.font = '11px "GameFont", sans-serif';
      const hitsLeft = gameState.player.hoverboardMaxHits - gameState.player.hoverboardHits;
      ctx.fillText(`🛹 HOVERBOARD (${hitsLeft} HIT${hitsLeft > 1 ? 'S' : ''} LEFT)`, 40, 156 + pOffset);
      pOffset += 18;
      ctx.restore();
    }
    if (gameState.player.magnetTimer > 0) {
      ctx.save();
      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px "GameFont", sans-serif';
      ctx.fillText(`🧲 COIN MAGNET: ${gameState.player.magnetTimer.toFixed(1)}s`, 40, 156 + pOffset);
      pOffset += 18;
      ctx.restore();
    }
    if (gameState.player.spreadShotTimer > 0) {
      ctx.save();
      ctx.fillStyle = '#fbbf24';
      ctx.font = '11px "GameFont", sans-serif';
      ctx.fillText(`⚡ SPREAD CANNON: ${gameState.player.spreadShotTimer.toFixed(1)}s`, 40, 156 + pOffset);
      pOffset += 18;
      ctx.restore();
    }

    // 6. Coins & Score
    ctx.save();
    const coinImg = images.iconCoin;
    if (coinImg && coinImg.complete) {
      ctx.drawImage(coinImg, CANVAS_WIDTH - 230, 24, 28, 28);
    }
    ctx.font = '17px "GameFont", sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.textAlign = 'left';
    ctx.fillText(`${gameState.coins}`, CANVAS_WIDTH - 194, 45);

    ctx.fillStyle = '#ffffff';
    ctx.font = '13px "GameFont", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`SCORE: ${gameState.score}`, CANVAS_WIDTH - 40, 45);
    ctx.fillText(`UFOS: ${gameState.totalKills}`, CANVAS_WIDTH - 40, 70);

    // Combo Streak Indicator
    if (gameState.combo > 1) {
      ctx.font = '14px "GameFont", sans-serif';
      ctx.fillStyle = '#f97316';
      ctx.fillText(`COMBO x${Math.min(gameState.combo, 5)} 🔥`, CANVAS_WIDTH - 40, 95);
    }
    ctx.restore();

    // 7. Sector Transition / Warning Banner
    if (gameState.bannerTimer > 0) {
      ctx.save();
      const alpha = Math.min(1, gameState.bannerTimer);
      ctx.globalAlpha = alpha;
      const isBoss = gameState.bannerText.includes('WARNING');
      ctx.fillStyle = isBoss ? 'rgba(239, 68, 68, 0.88)' : 'rgba(30, 58, 138, 0.88)';
      ctx.fillRect(0, CANVAS_HEIGHT / 2 - 45, CANVAS_WIDTH, 90);

      ctx.font = '22px "GameFont", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 10;
      ctx.fillText(gameState.bannerText, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 8);
      ctx.restore();
    }
  }

  // --- Main Game Loop ---
  function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
    lastTime = timestamp;

    if (gameState.screen === 'PLAYING') {
      updateGame(dt);
      renderGame();
    }

    animationFrameId = requestAnimationFrame(gameLoop);
  }

  function updateGame(dt) {
    // Parallax background
    const bgSpd = gameState.player && gameState.player.rocketTimer > 0 ? gameState.bgSpeed * 3 : gameState.bgSpeed;
    gameState.bgX1 -= bgSpd;
    gameState.bgX2 -= bgSpd;
    if (gameState.bgX1 <= -CANVAS_WIDTH) gameState.bgX1 = gameState.bgX2 + CANVAS_WIDTH;
    if (gameState.bgX2 <= -CANVAS_WIDTH) gameState.bgX2 = gameState.bgX1 + CANVAS_WIDTH;

    // Screen Shake decay
    if (gameState.screenShake > 0) {
      gameState.screenShake -= dt * 32;
      if (gameState.screenShake < 0) gameState.screenShake = 0;
    }

    // Banner Timer
    if (gameState.bannerTimer > 0) gameState.bannerTimer -= dt;

    // Combo Timer Decay
    if (gameState.comboTimer > 0) {
      gameState.comboTimer -= dt;
      if (gameState.comboTimer <= 0) gameState.combo = 0;
    }

    // Player Update
    if (gameState.player) {
      gameState.player.update(dt);
    }

    // Update Ghost After-Images
    gameState.afterImages.forEach(ghost => {
      ghost.life -= dt;
      ghost.alpha = Math.max(0, ghost.life / 0.35);
    });
    gameState.afterImages = gameState.afterImages.filter(ghost => ghost.life > 0);

    // Enemy Spawning
    if (!gameState.bossSpawned) {
      gameState.enemySpawnTimer -= dt;
      if (gameState.enemySpawnTimer <= 0) {
        const isHeavy = gameState.sectorIndex >= 2 && Math.random() < 0.35;
        gameState.enemies.push(new Enemy(isHeavy));
        const spawnDelay = selectedDifficulty === 'insane' ? 1.6 : (selectedDifficulty === 'hard' ? 2.2 : 2.8);
        gameState.enemySpawnTimer = Math.random() * 1.0 + spawnDelay;
      }

      // Asteroid Spawning in Sector 2+ or Survival
      if (gameState.sectorIndex >= 1 || gameState.gameMode === 'survival') {
        gameState.asteroidSpawnTimer -= dt;
        if (gameState.asteroidSpawnTimer <= 0) {
          gameState.asteroids.push(new Asteroid());
          gameState.asteroidSpawnTimer = Math.random() * 3.0 + 3.5;
        }
      }
    }

    // Effective DT for enemies (Matrix Bullet-Time slow-mo during Overdrive)
    const entityDt = gameState.player && gameState.player.overdriveTimer > 0 ? dt * 0.45 : dt;

    // Update Entities
    gameState.enemies.forEach(enemy => enemy.update(entityDt));
    gameState.asteroids.forEach(ast => ast.update(entityDt));
    gameState.powerups.forEach(pw => pw.update(dt));
    if (gameState.boss) gameState.boss.update(entityDt);
    gameState.torpedoes.forEach(torp => torp.update(dt));
    gameState.enemyProjectiles.forEach(proj => proj.update(entityDt));
    gameState.particles.forEach(p => p.update(dt));
    gameState.floatingTexts.forEach(t => t.update(dt));

    // --- Fury Overdrive Piercing Mega Beam Collision ---
    if (gameState.player && gameState.player.overdriveTimer > 0) {
      const py = gameState.player.y;
      gameState.enemies.forEach(enemy => {
        if (!enemy.markedForDeletion && Math.abs(enemy.y - py) < 65 && enemy.x > gameState.player.x) {
          enemy.takeDamage(99);
        }
      });
      gameState.asteroids.forEach(ast => {
        if (!ast.markedForDeletion && Math.abs(ast.y - py) < 65 && ast.x > gameState.player.x) {
          ast.takeDamage(99);
        }
      });
      if (gameState.boss && !gameState.boss.markedForDeletion && !gameState.boss.dying) {
        if (Math.abs(gameState.boss.y - py) < 120 && gameState.boss.x > gameState.player.x) {
          gameState.boss.takeDamage(10 * dt);
        }
      }
    }

    // --- Collisions ---

    // 1. Torpedoes vs Enemies & Asteroids & Boss
    gameState.torpedoes.forEach(torp => {
      gameState.enemies.forEach(enemy => {
        if (!torp.markedForDeletion && !enemy.markedForDeletion && checkCollision(torp, enemy)) {
          torp.markedForDeletion = true;
          enemy.takeDamage(1);
        }
      });

      gameState.asteroids.forEach(ast => {
        if (!torp.markedForDeletion && !ast.markedForDeletion && checkCircleCollision(ast, torp)) {
          torp.markedForDeletion = true;
          ast.takeDamage(1);
        }
      });

      if (gameState.boss && !torp.markedForDeletion && !gameState.boss.markedForDeletion && !gameState.boss.dying) {
        if (checkCollision(torp, gameState.boss)) {
          torp.markedForDeletion = true;
          gameState.boss.takeDamage(1);
        }
      }
    });

    // 2. Player Ramming with Hyper Rocket vs Enemies
    if (gameState.player && gameState.player.rocketTimer > 0) {
      gameState.enemies.forEach(enemy => {
        if (!enemy.markedForDeletion && checkCollision(gameState.player, enemy)) {
          enemy.takeDamage(99);
        }
      });
      gameState.asteroids.forEach(ast => {
        if (!ast.markedForDeletion && checkCircleCollision(ast, gameState.player)) {
          ast.takeDamage(99);
        }
      });
    } else {
      // Normal Player vs Enemies
      gameState.enemies.forEach(enemy => {
        if (gameState.player && !enemy.markedForDeletion && checkCollision(gameState.player, enemy)) {
          enemy.takeDamage(3);
          gameState.player.takeDamage();
        }
      });

      // Player vs Asteroids
      gameState.asteroids.forEach(ast => {
        if (gameState.player && !ast.markedForDeletion && checkCircleCollision(ast, gameState.player)) {
          ast.takeDamage(3);
          gameState.player.takeDamage();
        }
      });

      // Player vs Boss
      if (gameState.boss && !gameState.boss.markedForDeletion && !gameState.boss.dying) {
        if (checkCollision(gameState.player, gameState.boss)) {
          if (gameState.player.rocketTimer > 0) {
            gameState.boss.takeDamage(5);
          } else {
            gameState.player.takeDamage();
          }
        }
      }
    }

    // 3. Player vs Enemy Projectiles
    gameState.enemyProjectiles.forEach(proj => {
      if (gameState.player && !proj.markedForDeletion && checkCircleCollision(proj, gameState.player)) {
        proj.markedForDeletion = true;
        gameState.player.takeDamage();
      }
    });

    // 4. Player vs Power-ups
    gameState.powerups.forEach(pw => {
      if (gameState.player && !pw.markedForDeletion && checkCircleCollision(pw, gameState.player)) {
        pw.apply(gameState.player);
      }
    });

    // Clean up dead entities
    if (gameState.boss && gameState.boss.markedForDeletion) {
      gameState.boss = null;
    }
    gameState.torpedoes = gameState.torpedoes.filter(t => !t.markedForDeletion);
    gameState.enemyProjectiles = gameState.enemyProjectiles.filter(p => !p.markedForDeletion);
    gameState.enemies = gameState.enemies.filter(e => !e.markedForDeletion);
    gameState.asteroids = gameState.asteroids.filter(a => !a.markedForDeletion);
    gameState.powerups = gameState.powerups.filter(p => !p.markedForDeletion);
    gameState.particles = gameState.particles.filter(p => !p.markedForDeletion);
    if (gameState.particles.length > 250) {
      gameState.particles = gameState.particles.slice(-250);
    }
    gameState.floatingTexts = gameState.floatingTexts.filter(t => !t.markedForDeletion);
    if (gameState.floatingTexts.length > 25) {
      gameState.floatingTexts = gameState.floatingTexts.slice(-25);
    }
  }

  function renderGame() {
    ctx.save();

    if (gameState.screenShake > 0) {
      const offsetX = (Math.random() - 0.5) * gameState.screenShake;
      const offsetY = (Math.random() - 0.5) * gameState.screenShake;
      ctx.translate(offsetX, offsetY);
    }

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 1. Parallax Background Map
    const currentSector = SECTOR_CONFIG[gameState.sectorIndex] || SECTOR_CONFIG[0];
    const bgImg = images[currentSector.bg] || images.bgEarth;
    if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
      ctx.drawImage(bgImg, gameState.bgX1, 0, CANVAS_WIDTH + 2, CANVAS_HEIGHT);
      ctx.drawImage(bgImg, gameState.bgX2, 0, CANVAS_WIDTH + 2, CANVAS_HEIGHT);
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // 2. Ghost After-Images
    gameState.afterImages.forEach(ghost => {
      ctx.save();
      ctx.globalAlpha = ghost.alpha * 0.5;
      ctx.translate(ghost.x, ghost.y);
      ctx.rotate(ghost.tilt);
      const img = images[ghost.planeKey] || images.plane_1_red;
      if (img && img.complete) {
        ctx.drawImage(img, -55, -32, 110, 65);
      }
      ctx.restore();
    });

    // 3. Entities
    gameState.powerups.forEach(pw => pw.draw(ctx));
    gameState.asteroids.forEach(ast => ast.draw(ctx));
    gameState.torpedoes.forEach(torp => torp.draw(ctx));
    gameState.enemyProjectiles.forEach(proj => proj.draw(ctx));
    gameState.enemies.forEach(enemy => enemy.draw(ctx));
    if (gameState.boss) gameState.boss.draw(ctx);
    if (gameState.player) gameState.player.draw(ctx);
    gameState.particles.forEach(p => p.draw(ctx));
    gameState.floatingTexts.forEach(t => t.draw(ctx));

    // 4. HUD
    if (gameState.player) {
      drawHUD(ctx);
    }

    ctx.restore();
  }

  // --- Game Flow Methods ---
  function startGame() {
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }

    gameState.screen = 'PLAYING';
    gameState.gameMode = selectedGameMode;
    gameState.survivalWave = 1;
    gameState.fury = 0;
    gameState.sectorIndex = gameState.gameMode === 'survival' ? 0 : selectedStartMap;
    gameState.sectorKills = 0;
    gameState.totalKills = 0;
    gameState.coins = 0;
    gameState.score = 0;
    gameState.combo = 0;
    gameState.comboTimer = 0;
    gameState.bossSpawned = false;
    gameState.boss = null;
    gameState.torpedoes = [];
    gameState.enemyProjectiles = [];
    gameState.enemies = [];
    gameState.asteroids = [];
    gameState.powerups = [];
    gameState.particles = [];
    gameState.floatingTexts = [];
    gameState.afterImages = [];
    gameState.enemySpawnTimer = 1.0;
    gameState.asteroidSpawnTimer = 4.0;

    const modeTitle = gameState.gameMode === 'survival' ? '⚡ ENDLESS SURVIVAL' : `MISSION: ${SECTOR_CONFIG[gameState.sectorIndex].name}`;
    gameState.bannerText = `🚀 ${modeTitle} LAUNCHED 🚀`;
    gameState.bannerTimer = 3.0;

    gameState.player = new Player(selectedPlaneKey);

    if (gameState.gameMode === 'campaign' && gameState.sectorIndex === 3) {
      spawnBoss();
    }

    startOverlay.classList.add('hidden');
    resultOverlay.classList.add('hidden');
    pauseOverlay.classList.add('hidden');
    rulesOverlay.classList.add('hidden');
    shopOverlay.classList.add('hidden');
    achievementsOverlay.classList.add('hidden');

    playSound('transition');
    playSound('bgm');
  }

  function pauseGame() {
    if (gameState.screen === 'PLAYING') {
      gameState.screen = 'PAUSED';
      pauseOverlay.classList.remove('hidden');
      if (bgmAudio) bgmAudio.pause();
    }
  }

  function resumeGame() {
    if (gameState.screen === 'PAUSED') {
      if (document.activeElement && document.activeElement.blur) {
        document.activeElement.blur();
      }
      gameState.screen = 'PLAYING';
      pauseOverlay.classList.add('hidden');
      lastTime = performance.now();
      if (!isMuted && bgmAudio) bgmAudio.play().catch(() => {});
    }
  }

  function endGame(isVictory) {
    gameState.screen = isVictory ? 'VICTORY' : 'GAMEOVER';
    stopBgm();

    // Bank earned gold coins
    bankedCoins += gameState.coins;
    localStorage.setItem('galaxyfighter_banked_coins', bankedCoins.toString());
    updateCoinBadges();

    if (isVictory) {
      checkAchievement('boss_slayer');
    }
    if (bankedCoins >= 300) {
      checkAchievement('rich_pilot');
    }

    if (gameState.score > gameState.highScore) {
      gameState.highScore = gameState.score;
      localStorage.setItem('galaxyfighter_highscore', gameState.highScore.toString());
    }

    resultTitle.textContent = isVictory ? '🏆 CAMPAIGN VICTORY!' : (gameState.gameMode === 'survival' ? '💀 SURVIVAL ENDED' : '💀 MISSION FAILED');
    resultTitle.style.color = isVictory ? '#22c55e' : '#ef4444';
    resultSub.textContent = isVictory
      ? 'The Alien Mothership is destroyed! The galaxy is safe thanks to you, Pilot!'
      : (gameState.gameMode === 'survival' ? `You survived up to Wave ${gameState.survivalWave}! Excellent combat data banked.` : 'Your aircraft was destroyed in combat. Better luck next flight!');

    statSector.textContent = isVictory ? 'CAMPAIGN CLEAR' : (gameState.gameMode === 'survival' ? `Wave ${gameState.survivalWave}` : `Sector ${gameState.sectorIndex + 1}`);
    statCoins.textContent = gameState.coins;
    statKills.textContent = gameState.totalKills;
    statScore.textContent = gameState.score;
    statHighScore.textContent = gameState.highScore;

    setTimeout(() => {
      resultOverlay.classList.remove('hidden');
    }, 600);
  }

  // --- Input Handlers ---
  function setupInputHandlers() {
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      const code = e.code;

      if (code === 'Space' || key === ' ' || key === 'enter' || key === 'w' || key === 's' || key === 'arrowup' || key === 'arrowdown' || key === 'r' || key === 'shift' || key === 'q' || key === 'e') {
        e.preventDefault();
      }

      if (e.repeat) return;

      if (key === 'w' || key === 'arrowup') {
        gameState.keys.up = true;
      } else if (key === 's' || key === 'arrowdown') {
        gameState.keys.down = true;
      } else if (key === 'shift') {
        if (gameState.screen === 'PLAYING' && gameState.player) {
          gameState.player.dash();
        }
      } else if (key === 'q' || key === 'e') {
        activateOverdrive();
      } else if (code === 'Space' || key === ' ' || key === 'j' || key === 'enter') {
        if (gameState.screen === 'PLAYING' && gameState.player) {
          gameState.player.shoot();
        } else if (gameState.screen === 'START') {
          startGame();
        } else if (gameState.screen === 'GAMEOVER' || gameState.screen === 'VICTORY') {
          startGame();
        }
      } else if (key === 'r' || key === 'k' || key === 'c') {
        if (gameState.screen === 'PLAYING' && gameState.player) {
          gameState.player.reload();
        }
      } else if (key === 'p' || key === 'escape') {
        if (gameState.screen === 'PLAYING') pauseGame();
        else if (gameState.screen === 'PAUSED') resumeGame();
      } else if (key === 'm') {
        toggleSound();
      }
    });

    window.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      const code = e.code;
      if (code === 'Space' || key === ' ' || key === 'w' || key === 's' || key === 'arrowup' || key === 'arrowdown') {
        e.preventDefault();
      }
      if (key === 'w' || key === 'arrowup') gameState.keys.up = false;
      if (key === 's' || key === 'arrowdown') gameState.keys.down = false;
    });

    // Touch Controls
    const bindTouch = (id, onStart, onEnd) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        el.classList.add('active');
        if (onStart) onStart();
      });
      const clear = (e) => {
        e.preventDefault();
        el.classList.remove('active');
        if (onEnd) onEnd();
      };
      el.addEventListener('pointerup', clear);
      el.addEventListener('pointercancel', clear);
      el.addEventListener('pointerleave', clear);
    };

    bindTouch('touchUp', () => { gameState.keys.up = true; }, () => { gameState.keys.up = false; });
    bindTouch('touchDown', () => { gameState.keys.down = true; }, () => { gameState.keys.down = false; });
    bindTouch('touchDash', () => {
      if (gameState.player) gameState.player.dash();
    });
    bindTouch('touchOverdrive', () => {
      activateOverdrive();
    });
    bindTouch('touchShoot', () => {
      if (gameState.player) gameState.player.shoot();
    });
    bindTouch('touchReload', () => {
      if (gameState.player) gameState.player.reload();
    });

    // Canvas Direct Touch Drag (Mobile Ergonomics)
    canvas.addEventListener('touchstart', (e) => {
      if (gameState.screen !== 'PLAYING') return;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      if (touch) {
        const scaleY = CANVAS_HEIGHT / rect.height;
        const scaleX = CANVAS_WIDTH / rect.width;
        const touchX = (touch.clientX - rect.left) * scaleX;
        const touchY = (touch.clientY - rect.top) * scaleY;
        if (touchX < CANVAS_WIDTH * 0.72) {
          isDirectDragging = true;
          touchTargetY = touchY;
        }
      }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      if (gameState.screen !== 'PLAYING' || !isDirectDragging) return;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      if (touch) {
        const scaleY = CANVAS_HEIGHT / rect.height;
        touchTargetY = (touch.clientY - rect.top) * scaleY;
      }
    }, { passive: false });

    const endTouchDrag = () => {
      isDirectDragging = false;
      touchTargetY = null;
    };
    canvas.addEventListener('touchend', endTouchDrag);
    canvas.addEventListener('touchcancel', endTouchDrag);

    // Mobile In-Game HUD Buttons
    if (btnMobileOverdrive) {
      btnMobileOverdrive.addEventListener('click', () => {
        activateOverdrive();
      });
    }
    if (btnMobilePause) {
      btnMobilePause.addEventListener('click', () => {
        if (gameState.screen === 'PLAYING') pauseGame();
        else if (gameState.screen === 'PAUSED') resumeGame();
      });
    }
    if (btnMobileSound) {
      btnMobileSound.addEventListener('click', () => {
        toggleSound();
      });
    }
    if (btnMobileFullscreen) {
      btnMobileFullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          canvasContainer.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }

    // Mode Picker
    modeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedGameMode = btn.getAttribute('data-mode');
        if (mapPickerContainer) {
          mapPickerContainer.style.display = selectedGameMode === 'survival' ? 'none' : 'flex';
        }
        playSound('click');
        if (document.activeElement) document.activeElement.blur();
      });
    });

    // Plane Picker
    planeCards.forEach(card => {
      card.addEventListener('click', () => {
        planeCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        selectedPlaneKey = card.getAttribute('data-plane');
        playSound('click');
        if (document.activeElement) document.activeElement.blur();
      });
    });

    // Map Picker
    mapButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        mapButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedStartMap = parseInt(btn.getAttribute('data-map'), 10);
        playSound('click');
        if (document.activeElement) document.activeElement.blur();
      });
    });

    // Difficulty Picker
    diffButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        diffButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedDifficulty = btn.getAttribute('data-diff');
        playSound('click');
        if (document.activeElement) document.activeElement.blur();
      });
    });

    // Shop Upgrades Buttons
    const bindBuy = (id, type) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => buyUpgrade(type));
    };
    bindBuy('btnBuyMag', 'mag');
    bindBuy('btnBuySpeed', 'speed');
    bindBuy('btnBuyPower', 'power');
    bindBuy('btnBuyBoard', 'board');

    // UI Navigation Modals
    const openShop = () => {
      updateCoinBadges();
      shopOverlay.classList.remove('hidden');
      playSound('click');
    };
    const closeShop = () => {
      shopOverlay.classList.add('hidden');
      playSound('click');
    };
    if (btnShop) btnShop.addEventListener('click', openShop);
    if (btnStartShop) btnStartShop.addEventListener('click', openShop);
    if (btnResultShop) btnResultShop.addEventListener('click', openShop);
    if (btnCloseShop) btnCloseShop.addEventListener('click', closeShop);

    const openAch = () => {
      renderAchievementsList();
      achievementsOverlay.classList.remove('hidden');
      playSound('click');
    };
    const closeAch = () => {
      achievementsOverlay.classList.add('hidden');
      playSound('click');
    };
    if (btnAchievements) btnAchievements.addEventListener('click', openAch);
    if (btnCloseAchievements) btnCloseAchievements.addEventListener('click', closeAch);

    // UI Buttons
    btnStartGame.addEventListener('click', () => {
      btnStartGame.blur();
      startGame();
    });
    btnRestart.addEventListener('click', () => {
      btnRestart.blur();
      startGame();
    });
    btnResume.addEventListener('click', () => {
      btnResume.blur();
      resumeGame();
    });
    btnPause.addEventListener('click', () => {
      btnPause.blur();
      if (gameState.screen === 'PLAYING') pauseGame();
      else if (gameState.screen === 'PAUSED') resumeGame();
    });
    btnQuit.addEventListener('click', () => {
      btnQuit.blur();
      gameState.screen = 'START';
      pauseOverlay.classList.add('hidden');
      startOverlay.classList.remove('hidden');
      stopBgm();
    });
    btnRules.addEventListener('click', () => {
      btnRules.blur();
      rulesOverlay.classList.remove('hidden');
    });
    btnCloseRules.addEventListener('click', () => {
      btnCloseRules.blur();
      rulesOverlay.classList.add('hidden');
    });
    btnSoundToggle.addEventListener('click', () => {
      btnSoundToggle.blur();
      toggleSound();
    });

    btnFullscreen.addEventListener('click', () => {
      btnFullscreen.blur();
      if (!document.fullscreenElement) {
        canvasContainer.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  // --- Initialization ---
  function init() {
    initAudio();
    updateCoinBadges();
    setupInputHandlers();
    loadAssets(() => {
      console.log('All Galaxy Fighter assets loaded!');
      renderGame();
    });
    animationFrameId = requestAnimationFrame(gameLoop);
  }

  window.addEventListener('DOMContentLoaded', init);
})();
