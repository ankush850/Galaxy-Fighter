# 📚 Galaxy Fighter - API & Game State Reference

This document provides an engineering reference for the core data structures, state machines, and lifecycle methods in `game.js`.

---

## 🏛️ 1. Global Game State Schema (`gameState`)

```javascript
const gameState = {
  screen: 'START',         // 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'VICTORY'
  gameMode: 'campaign',    // 'campaign' | 'survival'
  survivalWave: 1,         // Active Survival Wave tier
  fury: 0,                 // Fury Gauge percentage (0..100)
  sectorIndex: 0,          // Current Sector Map (0..3)
  sectorKills: 0,          // Kills accumulated in current sector/wave
  totalKills: 0,           // Total lifetime kills in session
  coins: 0,                // Gold coins collected in session
  score: 0,                // Active combat score
  highScore: 0,            // Highest historical score
  combo: 0,                // Active combo streak (0..5)
  comboTimer: 0,           // Combo decay timer (2.8s max)
  screenShake: 0,          // Screen shake intensity
  player: null,            // Instance of Player aircraft
  boss: null,              // Instance of Boss (if spawned)
  enemies: [],             // Active UFO entity array
  asteroids: [],           // Active Asteroid entity array
  powerups: [],            // Active Powerup drop array
  torpedoes: [],           // Player torpedo array
  enemyProjectiles: [],    // Alien fireball array
  particles: [],           // VFX Particle array (capped at 250)
  floatingTexts: []        // Floating combat numbers (capped at 25)
};
```

---

## 🔧 2. Key Lifecycle Methods
- `init()`: Initializes AudioContext, attaches multi-touch/keyboard listeners, and preloads assets.
- `startGame()`: Resets entity collections, resolves Hangar upgrades, and begins `requestAnimationFrame(gameLoop)`.
- `updateGame(dt)`: Orchestrates delta-time clamping, entity movements, Overdrive raycasts, and collision checks.
- `renderGame()`: Clears canvas and renders all 10 visual layers in sequential z-index order.
- `endGame(isVictory)`: Computes final stats, banks coins into `localStorage`, and displays result overlay.
