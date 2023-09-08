# 🏗️ Galaxy Fighter - Architecture & Engineering Specification

## 1. Engine Core
The game runs on a custom zero-dependency Canvas 2D engine optimized for 60-120 FPS execution across desktop and mobile devices.

### **Component Diagram**
```
+-------------------------------------------------------------+
|                      Game Loop (60 FPS)                     |
+-------------------------------------------------------------+
   |                  |                     |               |
[Input Handler]  [Entity System]     [Audio Engine]   [Render Pipeline]
   - Keyboard       - Player (Aircraft)   - Web Audio API - Parallax BG
   - Touch/D-pad    - UFO Enemies         - HTML5 Audio   - Entity Sprites
   - Mouse Gestures - Asteroids           - Synth FX      - Power-up VFX
                    - Power-ups                           - Particle System
                    - Torpedoes                           - HUD Layer
                    - Mothership Boss
```

## 2. Render Pipeline Layers
1. **Layer 0 - Starfield & Celestial Particles**: Infinite procedural twinkling stars.
2. **Layer 1 - Parallax Environment**: Dual seamless looping backgrounds with offset wrapping.
3. **Layer 2 - Active Hazards**: Floating asteroids with rotation physics.
4. **Layer 3 - Power-Up Collectibles**: Floating glowing orbs with sine-wave hovering and magnet attraction.
5. **Layer 4 - Projectiles**: Player torpedoes and alien plasma fireballs.
6. **Layer 5 - Enemies & Boss**: UFOs with HP bars and Mothership Boss entity.
7. **Layer 6 - Player Entity**: Aircraft sprite with banking rotation, engine exhaust flames, and hoverboard/shield overlays.
8. **Layer 7 - Particle Engine**: Explosions, sparks, smoke, speed lines, and debris.
9. **Layer 8 - Floating Combat Text**: Damage, coin pickups, and combo notifications.
10. **Layer 9 - HUD & Overlay**: Health hearts, 6-bullet magazine slots, coin counters, sector badges, combo meters, and powerup gauges.

## 3. Audio Subsystem
- **Dual-Driver Audio**: Uses native HTML5 Audio streams for background music loops and Web Audio API `AudioContext` oscillators for instantaneous zero-latency sound effects (laser shots, dry fire clicks, power-up chimes, level clear fanfares, smart bomb explosions).
