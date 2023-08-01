/**
 * Space Shooter - Canvas 2D Game Engine
 */

(function () {
  'use strict';

  // --- Constants & Config ---
  const CANVAS_WIDTH = 1280;
  const CANVAS_HEIGHT = 720;
  const PLAYER_SPEED = 7;
  const MAX_LIVES = 3;
  const MAX_AMMO = 3;
  const BOSS_KILL_THRESHOLD = 8;

  // Plane Asset Mapping
  const PLANE_ASSETS = {
    plane_1_red: 'recursos/imagens/planes/plane_1/plane_1_red.png',
    plane_1_blue: 'recursos/imagens/planes/plane_1/plane_1_blue.png',
    plane_1_yellow: 'recursos/imagens/planes/plane_1/plane_1_yellow.png',
    plane_2_green: 'recursos/imagens/planes/plane_2/plane_2_green.png',
    plane_3_blue: 'recursos/imagens/planes/plane_3/plane_3_blue.png'
  };

  // Image Asset URLs
  const IMAGE_URLS = {
    bgMountain: 'recursos/imagens/BG/sky_background_mountains.png',
    bgHills: 'recursos/imagens/BG/sky_background_green_hills.png',
    enemyOvni: 'recursos/imagens/planes/inimigos/ovni.png',
    boss: 'recursos/imagens/planes/inimigos/boss.png',
    torpedo: 'recursos/imagens/planes/tiros/torpedo_flame.png',
    bossFireball: 'recursos/imagens/planes/tiros/fire_ball_1.png',
    iconLife: 'recursos/imagens/UI/life.png',
    iconAmmo: 'recursos/imagens/UI/municao.png',
    iconCoin: 'recursos/imagens/icones/gold_coin.png',
    ...PLANE_ASSETS
  };

  // Audio Asset URLs
  const AUDIO_URLS = {
    bgm: 'recursos/audio/musica.mp3',
    shoot: 'recursos/audio/tiro.mp3',
    death: 'recursos/audio/morte.mp3',
    click: 'recursos/audio/click.mp3',
    transition: 'recursos/audio/transicao.mp3'
  };

  // --- State Variables ---
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  let animationFrameId = null;
  let lastTime = 0;

  // DOM Elements
  const startOverlay = document.getElementById('startOverlay');
  const resultOverlay = document.getElementById('resultOverlay');
  const pauseOverlay = document.getElementById('pauseOverlay');
  const resultTitle = document.getElementById('resultTitle');
  const statCoins = document.getElementById('statCoins');
  const statKills = document.getElementById('statKills');
  const statScore = document.getElementById('statScore');
  const statHighScore = document.getElementById('statHighScore');
  const btnStartGame = document.getElementById('btnStartGame');
  const btnRestart = document.getElementById('btnRestart');
  const btnResume = document.getElementById('btnResume');
  const btnQuit = document.getElementById('btnQuit');
  const btnPause = document.getElementById('btnPause');
  const btnSoundToggle = document.getElementById('btnSoundToggle');
  const soundIcon = document.getElementById('soundIcon');
  const soundText = document.getElementById('soundText');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const canvasContainer = document.getElementById('canvasContainer');

  // Plane selector cards
  const planeCards = document.querySelectorAll('.plane-card');
  let selectedPlaneKey = 'plane_1_red';

  // --- Audio System ---
  const sounds = {};
  let isMuted = false;
  let bgmAudio = null;

  function initAudio() {
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
    if (isMuted || !sounds[key]) return;
    try {
      if (key === 'bgm') {
        if (sounds[key].paused) {
          sounds[key].currentTime = 0;
          sounds[key].play().catch(() => {});
        }
      } else {
        const clone = sounds[key].cloneNode();
        clone.volume = sounds[key].volume;
        clone.play().catch(() => {});
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
      soundIcon.textContent = '🔇';
      soundText.textContent = 'Sound OFF';
      if (bgmAudio) bgmAudio.pause();
    } else {
      soundIcon.textContent = '🔊';
      soundText.textContent = 'Sound ON';
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
        console.warn(`Failed to load asset: ${url}`);
        assetsLoaded++;
        if (assetsLoaded === totalAssets && callback) callback();
      };
      images[key] = img;
    }
  }

  // --- Game State Object ---
  const gameState = {
    screen: 'START', // START, PLAYING, PAUSED, GAMEOVER, VICTORY
    score: 0,
    coins: 0,
    kills: 0,
    highScore: parseInt(localStorage.getItem('spaceshooter_highscore') || '0', 10),
    bgX1: 0,
    bgX2: CANVAS_WIDTH,
    bgSpeed: 2,
    screenShake: 0,
    bossWarningTimer: 0,
    bossSpawned: false,
    particles: [],
    floatingTexts: [],
    torpedoes: [],
    enemyProjectiles: [],
    enemies: [],
    boss: null,
    player: null,
    enemySpawnTimer: 0,
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
      this.width = 120;
      this.height = 70;
      this.x = 120;
      this.y = CANVAS_HEIGHT / 2;
      this.targetY = this.y;
      this.tilt = 0;
      this.lives = MAX_LIVES;
      this.ammo = MAX_AMMO;
      this.maxAmmo = MAX_AMMO;
      this.isReloading = false;
      this.reloadTimer = 0;
      this.invulnerableTimer = 0;
      this.shootCooldown = 0;
    }

    update(dt) {
      // Movement
      if (gameState.keys.up) {
        this.y -= PLAYER_SPEED;
        this.tilt = Math.max(this.tilt - 0.05, -0.2);
      } else if (gameState.keys.down) {
        this.y += PLAYER_SPEED;
        this.tilt = Math.min(this.tilt + 0.05, 0.2);
      } else {
        this.tilt *= 0.85;
      }

      // Keep within bounds
      const minY = 60;
      const maxY = CANVAS_HEIGHT - 60;
      this.y = Math.max(minY, Math.min(maxY, this.y));

      // Exhaust flame particles
      if (Math.random() < 0.8) {
        gameState.particles.push(new Particle(
          this.x - 45,
          this.y + (Math.random() * 8 - 4),
          -(Math.random() * 4 + 4),
          (Math.random() - 0.5) * 1.5,
          Math.random() * 6 + 3,
          Math.random() < 0.5 ? '#f59e0b' : '#ef4444',
          0.4
        ));
      }

      // Shoot cooldown
      if (this.shootCooldown > 0) this.shootCooldown -= dt;

      // Reload timer
      if (this.isReloading) {
        this.reloadTimer -= dt;
        if (this.reloadTimer <= 0) {
          this.ammo = this.maxAmmo;
          this.isReloading = false;
          playSound('click');
        }
      }

      // Invulnerability blink
      if (this.invulnerableTimer > 0) {
        this.invulnerableTimer -= dt;
      }
    }

    shoot() {
      if (this.ammo > 0 && this.shootCooldown <= 0 && !this.isReloading) {
        this.ammo--;
        this.shootCooldown = 0.22;
        playSound('shoot');

        gameState.torpedoes.push(new Torpedo(
          this.x + 45,
          this.y + 8,
          16
        ));

        // Recoil muzzle flash particles
        for (let i = 0; i < 5; i++) {
          gameState.particles.push(new Particle(
            this.x + 48,
            this.y + 8,
            Math.random() * 3 + 2,
            (Math.random() - 0.5) * 3,
            Math.random() * 5 + 2,
            '#fbbf24',
            0.25
          ));
        }
      } else if (this.ammo === 0 && !this.isReloading) {
        this.reload();
      }
    }

    reload() {
      if (this.ammo < this.maxAmmo && !this.isReloading) {
        this.isReloading = true;
        this.reloadTimer = 0.7; // 700ms reload
        playSound('click');
      }
    }

    takeDamage() {
      if (this.invulnerableTimer > 0) return;
      this.lives--;
      this.invulnerableTimer = 1.6;
      gameState.screenShake = 14;
      playSound('death');

      // Sparks & damage particles
      for (let i = 0; i < 18; i++) {
        gameState.particles.push(new Particle(
          this.x,
          this.y,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
          Math.random() * 6 + 2,
          '#ef4444',
          0.6
        ));
      }

      if (this.lives <= 0) {
        endGame(false);
      }
    }

    draw(ctx) {
      if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
        return; // Flash effect
      }

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.tilt);

      const img = images[this.planeKey] || images.plane_1_red;
      if (img && img.complete) {
        ctx.drawImage(img, -this.width / 2, -this.height / 2, this.width, this.height);
      } else {
        // Fallback drawing
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
      }

      ctx.restore();
    }
  }

  // --- Torpedo Class ---
  class Torpedo {
    constructor(x, y, speed) {
      this.x = x;
      this.y = y;
      this.width = 54;
      this.height = 20;
      this.speed = speed;
      this.markedForDeletion = false;
    }

    update() {
      this.x += this.speed;
      if (this.x > CANVAS_WIDTH + 100) {
        this.markedForDeletion = true;
      }

      // Flame exhaust trail
      if (Math.random() < 0.6) {
        gameState.particles.push(new Particle(
          this.x - 22,
          this.y,
          -(Math.random() * 3 + 2),
          (Math.random() - 0.5) * 1.5,
          Math.random() * 4 + 2,
          Math.random() < 0.5 ? '#f59e0b' : '#38bdf8',
          0.3
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

  // --- Boss Fireball Projectile ---
  class EnemyProjectile {
    constructor(x, y, vx, vy) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.width = 36;
      this.height = 36;
      this.radius = 16;
      this.markedForDeletion = false;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < -100 || this.x > CANVAS_WIDTH + 100 || this.y < -100 || this.y > CANVAS_HEIGHT + 100) {
        this.markedForDeletion = true;
      }

      // Fire trail
      if (Math.random() < 0.7) {
        gameState.particles.push(new Particle(
          this.x,
          this.y,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 5 + 3,
          '#ef4444',
          0.4
        ));
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

  // --- UFO Enemy Class ---
  class Enemy {
    constructor() {
      this.width = 85;
      this.height = 65;
      this.x = CANVAS_WIDTH + 80;
      this.baseY = Math.random() * (CANVAS_HEIGHT - 220) + 110;
      this.y = this.baseY;
      this.speed = Math.random() * 2.5 + 3.2;
      this.sineOffset = Math.random() * Math.PI * 2;
      this.sineSpeed = Math.random() * 2 + 1.5;
      this.sineAmplitude = Math.random() * 35 + 15;
      this.maxHp = 3;
      this.hp = this.maxHp;
      this.hitFlashTimer = 0;
      this.markedForDeletion = false;
    }

    update(dt) {
      this.x -= this.speed;
      this.y = this.baseY + Math.sin(Date.now() * 0.003 * this.sineSpeed + this.sineOffset) * this.sineAmplitude;

      if (this.hitFlashTimer > 0) this.hitFlashTimer -= dt;
      if (this.x < -120) this.markedForDeletion = true;
    }

    takeDamage(damage) {
      this.hp -= damage;
      this.hitFlashTimer = 0.12;

      // Small hit sparks
      for (let i = 0; i < 4; i++) {
        gameState.particles.push(new Particle(
          this.x,
          this.y,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5,
          Math.random() * 4 + 2,
          '#38bdf8',
          0.3
        ));
      }

      if (this.hp <= 0) {
        this.destroy();
      }
    }

    destroy() {
      this.markedForDeletion = true;
      gameState.kills++;
      gameState.coins += 1;
      gameState.score += 150;
      playSound('morte');

      // Floating +1 coin text
      gameState.floatingTexts.push(new FloatingText(this.x, this.y, '+1 COIN', '#fbbf24'));

      // Burst explosion
      createExplosion(this.x, this.y, 25, '#38bdf8');

      // Check boss trigger
      if (gameState.kills >= BOSS_KILL_THRESHOLD && !gameState.bossSpawned && !gameState.boss) {
        spawnBoss();
      }
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
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // HP Bar above UFO if damaged
      if (this.hp < this.maxHp) {
        const barW = 50;
        const barH = 5;
        const hpPercent = this.hp / this.maxHp;
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(-barW / 2, -this.height / 2 - 12, barW, barH);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(-barW / 2, -this.height / 2 - 12, barW * hpPercent, barH);
      }

      ctx.restore();
    }
  }

  // --- Boss Class ---
  class Boss {
    constructor() {
      this.width = 240;
      this.height = 180;
      this.x = CANVAS_WIDTH + 260;
      this.targetX = CANVAS_WIDTH - 240;
      this.y = CANVAS_HEIGHT / 2;
      this.targetY = this.y;
      this.maxHp = 25;
      this.hp = this.maxHp;
      this.hitFlashTimer = 0;
      this.attackTimer = 2.0;
      this.moveTimer = 0;
      this.markedForDeletion = false;
      this.dying = false;
      this.deathTimer = 0;
    }

    update(dt) {
      if (this.dying) {
        this.deathTimer -= dt;
        if (Math.random() < 0.4) {
          createExplosion(
            this.x + (Math.random() - 0.5) * this.width,
            this.y + (Math.random() - 0.5) * this.height,
            12,
            '#ef4444'
          );
        }
        if (this.deathTimer <= 0) {
          this.markedForDeletion = true;
          endGame(true);
        }
        return;
      }

      // Entry slide in
      if (this.x > this.targetX) {
        this.x -= 2.5;
      } else {
        // Vertical hover movement
        this.moveTimer -= dt;
        if (this.moveTimer <= 0) {
          this.targetY = Math.random() * (CANVAS_HEIGHT - 280) + 140;
          this.moveTimer = Math.random() * 2.5 + 2.0;
        }
        this.y += (this.targetY - this.y) * 0.035;

        // Attack AI
        this.attackTimer -= dt;
        if (this.attackTimer <= 0) {
          this.attack();
          this.attackTimer = Math.random() * 1.5 + 1.8;
        }
      }

      if (this.hitFlashTimer > 0) this.hitFlashTimer -= dt;

      // Smoke particles if low HP
      if (this.hp < this.maxHp * 0.5 && Math.random() < 0.6) {
        gameState.particles.push(new Particle(
          this.x - 30 + (Math.random() - 0.5) * 40,
          this.y + (Math.random() - 0.5) * 40,
          -(Math.random() * 2 + 1),
          -(Math.random() * 2 + 1),
          Math.random() * 8 + 4,
          '#64748b',
          0.8
        ));
      }
    }

    attack() {
      if (!gameState.player || this.dying) return;
      playSound('shoot');

      // Aim fireball towards player position
      const dx = gameState.player.x - this.x;
      const dy = gameState.player.y - this.y;
      const dist = Math.hypot(dx, dy) || 1;
      const speed = 7.5;
      const vx = (dx / dist) * speed;
      const vy = (dy / dist) * speed;

      gameState.enemyProjectiles.push(new EnemyProjectile(
        this.x - 60,
        this.y,
        vx,
        vy
      ));
    }

    takeDamage(damage) {
      if (this.dying) return;
      this.hp -= damage;
      this.hitFlashTimer = 0.12;

      for (let i = 0; i < 5; i++) {
        gameState.particles.push(new Particle(
          this.x - 60,
          this.y + (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6,
          Math.random() * 5 + 3,
          '#f59e0b',
          0.35
        ));
      }

      if (this.hp <= 0) {
        this.destroy();
      }
    }

    destroy() {
      this.dying = true;
      this.deathTimer = 2.2;
      gameState.score += 2000;
      gameState.coins += 10;
      gameState.screenShake = 22;
      playSound('morte');
      gameState.floatingTexts.push(new FloatingText(this.x, this.y - 50, '+10 COINS! BOSS DEFEATED!', '#fbbf24'));
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);

      if (this.hitFlashTimer > 0) {
        ctx.filter = 'brightness(2.5)';
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
      const barWidth = 460;
      const barHeight = 18;
      const barX = (CANVAS_WIDTH - barWidth) / 2;
      const barY = 28;
      const hpRatio = Math.max(0, this.hp / this.maxHp);

      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(barX - 4, barY - 4, barWidth + 8, barHeight + 8);
      ctx.strokeStyle = '#ef4444';
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
      ctx.fillText(`MOTHERSHIP BOSS: ${Math.max(0, this.hp)} / ${this.maxHp}`, CANVAS_WIDTH / 2, barY + 14);
      ctx.restore();
    }
  }

  function spawnBoss() {
    gameState.bossSpawned = true;
    gameState.bossWarningTimer = 3.0;
    gameState.boss = new Boss();
  }

  // --- Particles & VFX ---
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
        x,
        y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        Math.random() * 6 + 3,
        color,
        Math.random() * 0.4 + 0.3
      ));
    }
  }

  // --- Floating Text ---
  class FloatingText {
    constructor(x, y, text, color) {
      this.x = x;
      this.y = y;
      this.text = text;
      this.color = color;
      this.life = 1.0;
      this.maxLife = 1.0;
      this.markedForDeletion = false;
    }

    update(dt) {
      this.y -= 30 * dt;
      this.life -= dt;
      if (this.life <= 0) this.markedForDeletion = true;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
      ctx.font = '16px "GameFont", sans-serif';
      ctx.fillStyle = this.color;
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 6;
      ctx.fillText(this.text, this.x, this.y);
      ctx.restore();
    }
  }

  // --- Collision Detection Helpers ---
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
    // 1. Lives (Hearts)
    for (let i = 0; i < MAX_LIVES; i++) {
      const x = 40 + i * 44;
      const y = 36;
      const hasLife = i < gameState.player.lives;
      ctx.save();
      ctx.globalAlpha = hasLife ? 1.0 : 0.25;
      const img = images.iconLife;
      if (img && img.complete) {
        ctx.drawImage(img, x, y, 36, 36);
      } else {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(x, y, 32, 32);
      }
      ctx.restore();
    }

    // 2. Ammo Bullets
    for (let i = 0; i < MAX_AMMO; i++) {
      const x = 40 + i * 44;
      const y = 84;
      const hasAmmo = i < gameState.player.ammo;
      ctx.save();
      ctx.globalAlpha = hasAmmo ? 1.0 : 0.2;
      const img = images.iconAmmo;
      if (img && img.complete) {
        ctx.drawImage(img, x, y, 36, 36);
      } else {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(x, y, 32, 32);
      }
      ctx.restore();
    }

    // Reload Prompt if empty
    if (gameState.player.ammo === 0 || gameState.player.isReloading) {
      ctx.save();
      ctx.font = '13px "GameFont", sans-serif';
      ctx.fillStyle = '#f59e0b';
      ctx.textAlign = 'left';
      const prompt = gameState.player.isReloading ? 'RELOADING...' : 'PRESS [R] / [○] TO RELOAD';
      ctx.fillText(prompt, 180, 106);
      ctx.restore();
    }

    // 3. Coins & Score
    ctx.save();
    // Coin Icon
    const coinImg = images.iconCoin;
    if (coinImg && coinImg.complete) {
      ctx.drawImage(coinImg, CANVAS_WIDTH - 240, 36, 32, 32);
    }
    ctx.font = '18px "GameFont", sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.textAlign = 'left';
    ctx.fillText(`${gameState.coins}`, CANVAS_WIDTH - 198, 60);

    // Kills & Score
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px "GameFont", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`SCORE: ${gameState.score}`, CANVAS_WIDTH - 40, 96);
    ctx.fillText(`UFOS: ${gameState.kills}`, CANVAS_WIDTH - 40, 124);
    ctx.restore();

    // 4. Boss Warning Banner
    if (gameState.bossWarningTimer > 0) {
      ctx.save();
      const alpha = Math.min(1, gameState.bossWarningTimer);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.fillRect(0, CANVAS_HEIGHT / 2 - 50, CANVAS_WIDTH, 100);

      ctx.font = '28px "GameFont", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 10;
      ctx.fillText('⚠️ WARNING: ALIEN MOTHERSHIP APPROACHING! ⚠️', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
      ctx.restore();
    }
  }

  // --- Game Loop Update & Render ---
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
    // Background parallax scroll
    gameState.bgX1 -= gameState.bgSpeed;
    gameState.bgX2 -= gameState.bgSpeed;
    if (gameState.bgX1 <= -CANVAS_WIDTH) gameState.bgX1 = gameState.bgX2 + CANVAS_WIDTH;
    if (gameState.bgX2 <= -CANVAS_WIDTH) gameState.bgX2 = gameState.bgX1 + CANVAS_WIDTH;

    // Screen Shake decay
    if (gameState.screenShake > 0) {
      gameState.screenShake -= dt * 30;
      if (gameState.screenShake < 0) gameState.screenShake = 0;
    }

    // Boss Warning Timer
    if (gameState.bossWarningTimer > 0) {
      gameState.bossWarningTimer -= dt;
    }

    // Player Update
    if (gameState.player) {
      gameState.player.update(dt);
    }

    // Enemy Spawning (only before boss is defeated)
    if (!gameState.bossSpawned) {
      gameState.enemySpawnTimer -= dt;
      if (gameState.enemySpawnTimer <= 0) {
        gameState.enemies.push(new Enemy());
        gameState.enemySpawnTimer = Math.random() * 1.5 + 2.0; // every 2-3.5s
      }
    }

    // Update Enemies
    gameState.enemies.forEach(enemy => enemy.update(dt));

    // Update Boss
    if (gameState.boss) {
      gameState.boss.update(dt);
    }

    // Update Torpedoes
    gameState.torpedoes.forEach(torp => torp.update(dt));

    // Update Enemy Projectiles
    gameState.enemyProjectiles.forEach(proj => proj.update(dt));

    // Update Particles
    gameState.particles.forEach(part => part.update(dt));

    // Update Floating Texts
    gameState.floatingTexts.forEach(text => text.update(dt));

    // --- Collisions ---

    // 1. Player Torpedoes vs Enemies
    gameState.torpedoes.forEach(torp => {
      gameState.enemies.forEach(enemy => {
        if (!torp.markedForDeletion && !enemy.markedForDeletion && checkCollision(torp, enemy)) {
          torp.markedForDeletion = true;
          enemy.takeDamage(1);
        }
      });

      // Player Torpedoes vs Boss
      if (gameState.boss && !torp.markedForDeletion && !gameState.boss.markedForDeletion && !gameState.boss.dying) {
        if (checkCollision(torp, gameState.boss)) {
          torp.markedForDeletion = true;
          gameState.boss.takeDamage(1);
        }
      }
    });

    // 2. Player vs Enemy UFOs
    gameState.enemies.forEach(enemy => {
      if (gameState.player && !enemy.markedForDeletion && checkCollision(gameState.player, enemy)) {
        enemy.takeDamage(3);
        gameState.player.takeDamage();
      }
    });

    // 3. Player vs Enemy Projectiles
    gameState.enemyProjectiles.forEach(proj => {
      if (gameState.player && !proj.markedForDeletion && checkCircleCollision(proj, gameState.player)) {
        proj.markedForDeletion = true;
        gameState.player.takeDamage();
      }
    });

    // Clean up dead entities
    gameState.torpedoes = gameState.torpedoes.filter(t => !t.markedForDeletion);
    gameState.enemyProjectiles = gameState.enemyProjectiles.filter(p => !p.markedForDeletion);
    gameState.enemies = gameState.enemies.filter(e => !e.markedForDeletion);
    gameState.particles = gameState.particles.filter(p => !p.markedForDeletion);
    gameState.floatingTexts = gameState.floatingTexts.filter(t => !t.markedForDeletion);
  }

  function renderGame() {
    ctx.save();

    // Screen Shake transform
    if (gameState.screenShake > 0) {
      const offsetX = (Math.random() - 0.5) * gameState.screenShake;
      const offsetY = (Math.random() - 0.5) * gameState.screenShake;
      ctx.translate(offsetX, offsetY);
    }

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 1. Draw Parallax Background
    const bgImg = images.bgMountain;
    if (bgImg && bgImg.complete) {
      ctx.drawImage(bgImg, gameState.bgX1, 0, CANVAS_WIDTH + 2, CANVAS_HEIGHT);
      ctx.drawImage(bgImg, gameState.bgX2, 0, CANVAS_WIDTH + 2, CANVAS_HEIGHT);
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // 2. Draw Torpedoes
    gameState.torpedoes.forEach(torp => torp.draw(ctx));

    // 3. Draw Enemy Projectiles
    gameState.enemyProjectiles.forEach(proj => proj.draw(ctx));

    // 4. Draw Enemies
    gameState.enemies.forEach(enemy => enemy.draw(ctx));

    // 5. Draw Boss
    if (gameState.boss) {
      gameState.boss.draw(ctx);
    }

    // 6. Draw Player
    if (gameState.player) {
      gameState.player.draw(ctx);
    }

    // 7. Draw Particles
    gameState.particles.forEach(p => p.draw(ctx));

    // 8. Draw Floating Texts
    gameState.floatingTexts.forEach(t => t.draw(ctx));

    // 9. Draw HUD
    if (gameState.player) {
      drawHUD(ctx);
    }

    ctx.restore();
  }

  // --- Game Flow Methods ---
  function startGame() {
    gameState.screen = 'PLAYING';
    gameState.score = 0;
    gameState.coins = 0;
    gameState.kills = 0;
    gameState.bossSpawned = false;
    gameState.boss = null;
    gameState.torpedoes = [];
    gameState.enemyProjectiles = [];
    gameState.enemies = [];
    gameState.particles = [];
    gameState.floatingTexts = [];
    gameState.enemySpawnTimer = 1.0;

    gameState.player = new Player(selectedPlaneKey);

    startOverlay.classList.add('hidden');
    resultOverlay.classList.add('hidden');
    pauseOverlay.classList.add('hidden');

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
      gameState.screen = 'PLAYING';
      pauseOverlay.classList.add('hidden');
      lastTime = performance.now();
      if (!isMuted && bgmAudio) bgmAudio.play().catch(() => {});
    }
  }

  function endGame(isVictory) {
    gameState.screen = isVictory ? 'VICTORY' : 'GAMEOVER';
    stopBgm();

    // High Score Calculation
    if (gameState.score > gameState.highScore) {
      gameState.highScore = gameState.score;
      localStorage.setItem('spaceshooter_highscore', gameState.highScore.toString());
    }

    resultTitle.textContent = isVictory ? '🏆 VICTORY!' : '💀 MISSION FAILED';
    resultTitle.style.color = isVictory ? '#22c55e' : '#ef4444';
    statCoins.textContent = gameState.coins;
    statKills.textContent = gameState.kills;
    statScore.textContent = gameState.score;
    statHighScore.textContent = gameState.highScore;

    setTimeout(() => {
      resultOverlay.classList.remove('hidden');
    }, 600);
  }

  // --- Event Listeners & Input Binding ---
  function setupInputHandlers() {
    // Keyboard inputs
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      const key = e.key.toLowerCase();

      if (key === 'w' || key === 'arrowup') {
        gameState.keys.up = true;
      } else if (key === 's' || key === 'arrowdown') {
        gameState.keys.down = true;
      } else if (key === ' ' || key === 'j' || key === 'enter') {
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
      if (key === 'w' || key === 'arrowup') gameState.keys.up = false;
      if (key === 's' || key === 'arrowdown') gameState.keys.down = false;
    });

    // Touch Virtual Gamepad Handlers
    const bindTouchButton = (elementId, onStart, onEnd) => {
      const el = document.getElementById(elementId);
      if (!el) return;

      const handleStart = (e) => {
        e.preventDefault();
        el.classList.add('active');
        if (onStart) onStart();
      };
      const handleEnd = (e) => {
        e.preventDefault();
        el.classList.remove('active');
        if (onEnd) onEnd();
      };

      el.addEventListener('pointerdown', handleStart);
      el.addEventListener('pointerup', handleEnd);
      el.addEventListener('pointercancel', handleEnd);
      el.addEventListener('pointerleave', handleEnd);
    };

    bindTouchButton('touchUp', () => { gameState.keys.up = true; }, () => { gameState.keys.up = false; });
    bindTouchButton('touchDown', () => { gameState.keys.down = true; }, () => { gameState.keys.down = false; });
    bindTouchButton('touchShoot', () => {
      if (gameState.player) gameState.player.shoot();
    });
    bindTouchButton('touchReload', () => {
      if (gameState.player) gameState.player.reload();
    });

    // Aircraft Selection Picker
    planeCards.forEach(card => {
      card.addEventListener('click', () => {
        planeCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        selectedPlaneKey = card.getAttribute('data-plane');
        playSound('click');
      });
    });

    // UI Buttons
    btnStartGame.addEventListener('click', startGame);
    btnRestart.addEventListener('click', startGame);
    btnResume.addEventListener('click', resumeGame);
    btnPause.addEventListener('click', () => {
      if (gameState.screen === 'PLAYING') pauseGame();
      else if (gameState.screen === 'PAUSED') resumeGame();
    });
    btnQuit.addEventListener('click', () => {
      gameState.screen = 'START';
      pauseOverlay.classList.add('hidden');
      startOverlay.classList.remove('hidden');
      stopBgm();
    });
    btnSoundToggle.addEventListener('click', toggleSound);

    // Fullscreen Toggle
    btnFullscreen.addEventListener('click', () => {
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
    setupInputHandlers();
    loadAssets(() => {
      console.log('All Space Shooter assets loaded successfully!');
      // Initial background render on start screen
      renderGame();
    });

    animationFrameId = requestAnimationFrame(gameLoop);
  }

  window.addEventListener('DOMContentLoaded', init);
})();
