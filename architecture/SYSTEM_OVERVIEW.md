# 🌐 Galaxy Fighter - Architecture: System Overview

## 1. High-Level System Architecture
Galaxy Fighter is designed with a modular, cross-platform dual-runtime architecture supporting both high-performance **HTML5 Canvas 2D / Web Audio** and native **Solar2D Lua** engines.

```
+-----------------------------------------------------------------------------------+
|                                 APPLICATION HOST                                  |
|   (Desktop Browsers / Android WebAPK PWA / Android Native WebView / Solar2D)     |
+-----------------------------------------------------------------------------------+
                                         |
     +-----------------------------------+-----------------------------------+
     |                                                                       |
     v                                                                       v
+-------------------------------+                       +---------------------------------+
|      CANVAS 2D GAME ENGINE    |                       |      SOLAR2D ENGINE CORE        |
|  - game.js Core Loop          |                       |  - main.lua & config.lua        |
|  - RequestAnimationFrame      |                       |  - scenes/jogo.lua              |
|  - Hardware Acceleration      |                       |  - scenes/iniciar.lua           |
+-------------------------------+                       +---------------------------------+
     |                                                                       |
     +------------+------------+------------+------------+                   |
     |            |            |            |            |                   |
     v            v            v            v            v                   v
+----------+ +----------+ +----------+ +----------+ +----------+    +--------------------+
|  Input   | | Entity   | | Render   | | Audio    | | Storage  |    | Box2D Physics &    |
| Pipeline | | Manager  | | Pipeline | | Engine   | | (Storage)|    | Native Lua Runtime |
+----------+ +----------+ +----------+ +----------+ +----------+    +--------------------+
     |            |            |            |            |                   |
     +------------+------------+------------+------------+-------------------+
                                         |
                                         v
                         +-------------------------------+
                         |   HARDWARE & OPERATING SYSTEM |
                         |   (GPU / Display / Audio DAC) |
                         +-------------------------------+
```

---

## 2. Core Subsystems

### 2.1 State Management Subsystem
- **Finite State Machine**: Manages top-level application states (`START`, `PLAYING`, `PAUSED`, `GAMEOVER`, `VICTORY`).
- **Data Persistence**: Uses `localStorage` for high score records, sound preferences, and aircraft unlocks with fallback to in-memory state.

### 2.2 Entity Component Subsystem
- **Object Lifecycle**: Manages creation, spatial updates, collision resolution, particle generation, and memory reclamation for all dynamic game objects.
- **Garbage Collection Optimization**: Utilizes array filtering and object recycling to minimize GC pauses during intense 60-120 FPS dogfights.

### 2.3 Audio Subsystem
- **Dual-Driver Audio Architecture**: Combines streamed background music with instantaneous zero-latency Web Audio API procedural oscillator synthesis.

### 2.4 Cross-Platform Native Bridge
- **Android JS Interface**: `AndroidNative.vibrate(ms)` communicates directly with Android OS `Vibrator` service.
- **PWA Service Worker**: Full cache-first offline capability via `sw.js`.
