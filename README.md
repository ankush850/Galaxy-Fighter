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

| Action | Keyboard | On-Screen Touch / Mobile |
| :--- | :--- | :--- |
| **Fly Up / Down** | <kbd>W</kbd> / <kbd>S</kbd> or <kbd>▲</kbd> / <kbd>▼</kbd> | Direct Canvas Drag Steering or Left Buttons |
| **Quantum Warp Dash** | <kbd>Shift</kbd> (Instant Dodge) | **💨 DASH** Action Button (Left) |
| **Fury Overdrive Laser** | <kbd>Q</kbd> / <kbd>E</kbd> (When 100% Full) | **⚡ OVERDRIVE** Button (Right) |
| **Fire Torpedo** | <kbd>Space</kbd> / <kbd>J</kbd> / <kbd>Enter</kbd> | **✕** Shoot Action Button (Right) |
| **Reload Magazine** | <kbd>R</kbd> / <kbd>K</kbd> (Auto on Empty) | **○** Reload Button (Right) |
| **Pause / Resume** | <kbd>P</kbd> or <kbd>Esc</kbd> | Top Pause Button |
| **Mute / Unmute** | <kbd>M</kbd> | Top Sound Button |

---

## 🛠️ Hangar Workshop & Permanent Upgrades

Spend banked gold coins accumulated across Campaign and Survival runs to permanently upgrade your aircraft:

1. 🎯 **Expanded Magazine**: Increases missile capacity ($6 \to 8 \to 10$ missiles).
2. 🚀 **Ion Thrusters**: Boosts vertical maneuverability and speed ($+15\%, +30\%, +45\%$).
3. ⏱️ **Quantum Overclock**: Extends Hyper Rocket, Super Magnet, and Spread Shot durations ($+3\text{s}, +6\text{s}, +9\text{s}$).
4. 🛹 **Plated Hoverboard**: Upgrades Cosmic Hoverboard to absorb up to **2 fatal collisions**!

---

## ⚡ Fury Overdrive Ultimate Ability
- **Fury Gauge (0–100%)**: Fills by destroying UFOs ($+4\%/6\%$) and collecting coins ($+3\%$).
- **Mega Death Laser**: Screen-wide horizontal thermal energy beam ($1280\text{px}$) piercing and vaporizing all enemies in the lane.
- **Matrix Bullet-Time**: Enemy velocities and plasma fireballs slow down by **$55\%$ slow-mo** for 4.0s while the player is completely invulnerable.

---

## ♾️ Endless Survival Mode
- **Infinite Scaling Waves**: Face continuous waves scaling every 15 kills.
- **Dynamic Celestial Map Cycling**: Smoothly rotates between Earth Stratosphere, Solar Nebula, Cyber Void, and Alien Mothership Core.
- **Alien Mothership Boss Battles**: Confront the Alien Dreadnought Boss every 3rd survival wave for massive score and coin bounties!

---

## 🏆 Trophy Room & Achievements
- **8 Milestone Achievements**: Unlock trophies like *First Blood*, *Hyper Aviator*, *Cosmic Surfer*, *Super Attractor*, *Overdrive Fury*, *Combo King*, *Mothership Slayer*, and *Gold Commander*.
- **Live In-Game Toast**: Real-time slide-in notifications with procedural audio chimes and haptic feedback.

---

## ⚡ Subway Surfers-Style Arcade Power-Ups

| Power-Up | Duration | Visual Effect | Combat Effect |
| :--- | :--- | :--- | :--- |
| 🚀 **Hyper Rocket** | $6.0\text{s} + \text{Bonus}$ | Giant flaming exhaust stream + warp lines | $+100\%$ Speed, total invulnerability, rams & destroys all enemies, auto-sucks coins |
| 🛹 **Cosmic Hoverboard** | Until Hit (Up to 2 Hits) | Neon hovering board under aircraft | Absorbs fatal crash hits & triggers EMP shockwave, saving your life |
| 🧲 **Super Coin Magnet** | $12.0\text{s} + \text{Bonus}$ | Cyan magnetic pulse rings | Magnetically pulls every coin and drop on screen to the player ($900\text{px}$ range) |
| ⚡ **Triple Spread Cannon** | $10.0\text{s} + \text{Bonus}$ | Gold plasma energy trail | Fires 3 torpedoes simultaneously across all lanes |
| 💨 **Quantum Warp Dash** | Instant ($2.5\text{s}$ CD) | Ghost after-images | Teleports through enemy fire and hazards with $0.6\text{s}$ invulnerability |
| 💣 **Tactical Smart Nuke** | Instant | White flash + explosion boom | Vaporizes all active enemies and bullets on screen |
| ❤️ **Hull Repair Kit** | Instant | Green repair aura | Restores $+1$ Life Heart to max |

---

## 🗺️ Galactic Sector Maps

1. 🌍 **Sector 1: Earth Stratosphere** - Alpine mountain ridge, 10 UFO Scouts.
2. 🌌 **Sector 2: Solar Nebula** - Deep cosmic purple nebula, 15 Interceptor UFOs & Asteroid Hazards.
3. ⚡ **Sector 3: Cyber Void Armada** - Crimson red giant star, 20 Heavy Armored UFOs.
4. 👾 **Sector 4: Alien Mothership Core** - Multi-phase Alien Dreadnought Boss battle!

---

## 📱 Android Studio & PWA APK Deployment

```bash
# 1. Open Native Android Studio Project
android/

# 2. Build Debug APK
cd android && ./gradlew assembleDebug

# 3. Output APK Path
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📁 Repository Structure

```
Galaxy-Fighter/
├── android/                   # Native Android Studio Project (SDK 34, Java 17)
├── architecture/              # 7 Comprehensive System Architecture Docs & Diagrams
│   ├── SYSTEM_OVERVIEW.md
│   ├── ENGINE_PIPELINE.md
│   ├── ENTITY_COMPONENT_SYSTEM.md
│   ├── AUDIO_SYNTHESIS_ARCHITECTURE.md
│   ├── INPUT_AND_HAPTICS_PIPELINE.md
│   ├── STATE_MACHINE_AND_SECTORS.md
│   └── ANDROID_NATIVE_BRIDGE.md
├── docs/                      # Technical & Game Design Documentation
│   ├── GAME_DESIGN.md         # Full GDD, mechanics, and weapon balance
│   ├── ARCHITECTURE.md        # Engine loops, render pipeline & audio system
│   ├── POWERUPS_GUIDE.md      # Detailed arcade powerups & combos
│   ├── ANDROID_PRODUCTION.md  # APK build & WebAPK installation guide
│   └── DEPLOYMENT.md          # Production, Docker, & Cloud hosting
├── features/                  # Modular Feature Specifications
│   ├── hangar_and_aircrafts.md
│   ├── combat_mechanics.md
│   ├── maps_and_environments.md
│   └── trophies_and_achievements.md
├── recursos/                  # Game Assets (Audio, Fonts, Images)
├── cenas/                     # Solar2D Lua Game Scenes
├── manifest.json              # Standalone Landscape PWA Manifest
├── sw.js                      # Cache-first Offline Service Worker
├── index.html                 # Main Game Viewport & HUD Overlays
├── style.css                  # Modern Glassmorphic Arcade Stylesheet
├── game.js                    # Canvas 2D Engine Core & Powerups Logic
└── package.json               # Project manifest
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

