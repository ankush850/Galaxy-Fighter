# 🚀 Galaxy Fighter - Production Edition

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](package.json)
[![Engine](https://img.shields.io/badge/engine-HTML5%20Canvas%202D-green.svg)](game.js)
[![Audio](https://img.shields.io/badge/audio-WebAudio%20%2B%20HTML5-purple.svg)](game.js)
[![License](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)

An action-packed, production-grade 2D retro space shooter arcade game built with zero external runtime dependencies. Features responsive Canvas rendering, dynamic multi-sector campaign maps, Subway Surfers-style high-octane arcade power-ups, 6-round tactical magazine system, and multi-phase Alien Mothership Boss encounters.

---

## 🎮 Play Online / Run Locally

### **Quick Start**
```bash
# 1. Install & Run (Zero external dependencies needed)
npm start

# 2. Open in Browser
http://localhost:3000
```

---

## 🕹️ Controls Matrix

| Action | Keyboard | On-Screen Touch / Gamepad |
| :--- | :--- | :--- |
| **Fly Up / Down** | <kbd>W</kbd> / <kbd>S</kbd> or <kbd>▲</kbd> / <kbd>▼</kbd> | Left-side Arrow Buttons |
| **Quantum Warp Dash** | <kbd>Shift</kbd> (Double Tap) | **💨 DASH** Button (Left) |
| **Fire Torpedo** | <kbd>Space</kbd> / <kbd>J</kbd> / <kbd>Enter</kbd> | **✕** Cross Action Button (Right) |
| **Reload Ammo** | <kbd>R</kbd> / <kbd>K</kbd> (Auto on Empty) | **○** Circle Action Button (Right) |
| **Pause / Resume** | <kbd>P</kbd> or <kbd>Esc</kbd> | Top Pause Button |
| **Mute / Unmute** | <kbd>M</kbd> | Top Sound Button |

---

## ⚡ Subway Surfers-Style Arcade Power-Ups

| Power-Up | Duration | Visual Effect | Combat Effect |
| :--- | :--- | :--- | :--- |
| 🚀 **Hyper Rocket** | 6s | Giant flaming exhaust stream + warp lines | +100% Speed, total invulnerability, rams & destroys all enemies, auto-sucks coins |
| 🛹 **Cosmic Hoverboard** | Until Hit | Neon hovering board under aircraft | Absorbs 1 fatal crash hit & triggers EMP shockwave, saving your life |
| 🧲 **Super Coin Magnet** | 12s | Cyan magnetic pulse rings | Magnetically pulls every coin and drop on screen to the player |
| ⚡ **Triple Spread Cannon** | 10s | Gold plasma energy trail | Fires 3 torpedoes simultaneously across all lanes |
| 💨 **Quantum Warp Dash** | Instant (2.5s CD) | Ghost after-images | Teleports through enemy fire and hazards |
| 💣 **Tactical Smart Nuke** | Instant | White flash + explosion boom | Vaporizes all active enemies and bullets on screen |
| ❤️ **Hull Repair Kit** | Instant | Green repair aura | Restores +1 Life Heart to max |

---

## 🗺️ Galactic Sector Maps

1. 🌍 **Sector 1: Earth Stratosphere** - Alpine mountain ridge, 10 UFO Scouts.
2. 🌌 **Sector 2: Solar Nebula** - Deep cosmic purple nebula, 15 Interceptor UFOs & Asteroid Hazards.
3. ⚡ **Sector 3: Cyber Void Armada** - Crimson red giant star, 20 Heavy Armored UFOs.
4. 👾 **Sector 4: Alien Mothership Core** - Multi-phase Alien Dreadnought Boss battle!

---

## 📁 Repository Structure

```
Galaxy-Fighter/
├── docs/                      # Technical & Game Design Documentation
│   ├── GAME_DESIGN.md         # Full GDD, mechanics, and weapon balance
│   ├── ARCHITECTURE.md        # Engine loops, render pipeline & audio system
│   ├── POWERUPS_GUIDE.md      # Detailed arcade powerups & combos
│   └── DEPLOYMENT.md          # Production, Docker, & Cloud hosting
├── features/                  # Modular Feature Specifications
│   ├── maps_and_environments.md
│   ├── hangar_and_aircrafts.md
│   └── combat_mechanics.md
├── recursos/                  # Game Assets (Audio, Fonts, Images)
├── cenas/                     # Solar2D Lua Game Scenes
├── Dockerfile                 # Production Docker image configuration
├── index.html                 # Main Game Viewport & HUD Overlays
├── style.css                  # Modern Glassmorphic Arcade Stylesheet
├── game.js                    # Canvas 2D Engine Core & Powerups Logic
├── server.js                  # Zero-dependency Production Node HTTP Server
└── package.json               # Project manifest
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
