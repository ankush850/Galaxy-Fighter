# 🌌 Galaxy Fighter - Game Design Document (GDD)

## 1. Overview
**Galaxy Fighter** is a retro-arcade 2D aerial combat and space shooter game developed with pure high-performance Web standards (HTML5 Canvas, Web Audio API, Vanilla CSS) and Solar2D Lua engine.

## 2. Core Gameplay Pillars
- **High-Octane Dogfighting**: Fluid vertical flight maneuvering, banking tilt physics, and dynamic projectile combat.
- **Tactical Resource Management**: 6-round high-impact missile magazines with automated & manual tactical reload mechanisms.
- **Arcade Power-Up Synergy**: Subway Surfers-style high-impact arcade power-ups including Hyper Rocket Boost, Cosmic Hoverboard, Super Coin Magnet, Quantum Dash, and Triple Spread Cannons.
- **Multi-Sector Campaign**: 4 progressively challenging galactic sectors, environmental hazards (asteroids), and multi-phase Alien Mothership boss battles.

---

## 3. Power-Ups Matrix

| Power-Up | Type | Duration | Visual Effect | Gameplay Mechanics |
| :--- | :--- | :--- | :--- | :--- |
| 🚀 **Hyper Rocket** | Speed & Invincibility | 6s | Huge fiery exhaust jet + speed warp lines | +100% Speed, destroys enemies on touch, auto-collects all coins |
| 🛹 **Hoverboard** | Shield / Extra Life | Until Hit | Neon floating board beneath aircraft | Absorbs 1 fatal collision, explodes with an EMP shockwave |
| 🧲 **Coin Magnet** | Economy | 12s | Cyan magnetic pulse rings | Sucks all gold & silver coins from screen instantly |
| ⚡ **Triple Spread** | Weapon Boost | 10s | Gold plasma energy trail | Fires 3 torpedoes in forward spread cone |
| 💨 **Quantum Dash** | Maneuver | Instant (3s cooldown) | Ghost after-images / blue flash | Instant vertical warp dodge through enemy fire |
| ❤️ **Hull Repair** | Health | Instant | Green cross aura | Restores +1 Heart/Life to maximum |
| 💣 **Smart EMP Nuke** | Screen Clear | Instant | White screen flash + heavy boom | Wipes out all active enemies & projectiles |

---

## 4. Galactic Sectors & Map Progression

### **Sector 1: Earth Stratosphere & Mountain Ridge**
- **Atmosphere**: Sunny blue skies with mountain parallax.
- **Enemies**: OVNI Scout UFOs (Basic sine-wave movement).
- **Objective**: Neutralize 10 UFOs.

### **Sector 2: Solar Nebula & Asteroid Field**
- **Atmosphere**: Purple cosmic nebula with deep space dust.
- **Hazards**: Floating space asteroids (can be destroyed or dodged).
- **Enemies**: Interceptor UFOs that fire plasma bullets back at the player.
- **Objective**: Neutralize 15 UFOs & Asteroids.

### **Sector 3: Cyber Armada Outpost**
- **Atmosphere**: Cyber grid void with dark red giant star.
- **Enemies**: Heavy Armored UFOs (5 HP) with dual plasma lasers.
- **Objective**: Neutralize 20 Heavy UFOs.

### **Sector 4: Alien Dreadnought Mothership**
- **Atmosphere**: Alien hive core with lightning storms.
- **Boss Encounter**: Alien Mothership (HP: 50).
  - *Phase 1*: Targeted heavy plasma blasts.
  - *Phase 2*: Triple fireball barrage + dive sweeps.
  - *Phase 3 (Enraged)*: Red energy shield, 5-way spread barrage, drone escort minions.
