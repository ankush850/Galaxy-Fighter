# 🛸 Galaxy Fighter - Architecture: Entity Lifecycle & Data Models

## 1. Class Hierarchy & Inheritance Model

```
                          +-------------------+
                          |    Base Entity    |
                          |  (x, y, vx, vy)   |
                          +-------------------+
                                    |
     +-----------------+------------+------------+-----------------+
     |                 |            |            |                 |
     v                 v            v            v                 v
+----------+     +----------+ +----------+ +----------+     +----------+
|  Player  |     |  Enemy   | | Asteroid | | Powerup  |     | Torpedo/ |
| Aircraft |     |   UFO    | |  Hazard  | | Item Orb |     | Fireball |
+----------+     +----------+ +----------+ +----------+     +----------+
                       |
                       v
               +---------------+
               |  Mothership   |
               |     Boss      |
               +---------------+
```

---

## 2. Entity Lifecycle State Machine

```
[ Instantiate ]
       │
       ▼
[ Spawn Queue ] ──> [ Position & Velocity Init ]
                            │
                            ▼
                    [ Active Tick Loop ] ◄────────┐
                            │                     │
                    [ Update Physics ]            │
                            │                     │
                    [ Collision Check ] ──────────┘
                            │
                   (Impact / HP <= 0 / Out of Bounds)
                            │
                            ▼
                    [ Trigger VFX/Audio ] (Explosion & Haptics)
                            │
                            ▼
                    [ markForDeletion = true ]
                            │
                            ▼
                    [ Array Cleanup (filter) ]
```

---

## 3. Boss 3-Phase State Machine
The Alien Dreadnought boss changes combat behaviors dynamically based on its health ratio:

```
+-------------------------------------------------------------------+
|                        MOTHERSHIP BOSS (50 HP)                    |
+-------------------------------------------------------------------+
                                  │
      ┌───────────────────────────┼───────────────────────────┐
      ▼                           ▼                           ▼
[ Phase 1: 100% - 65% HP ]   [ Phase 2: 65% - 30% HP ]   [ Phase 3: < 30% (Enraged) ]
- Single targeted fireballs  - Triple-spread fireballs   - Red Energy Barrier
- Steady vertical hovering   - Sine-wave dive sweeps     - 5-Way spread bullet storm
- Attack Interval: 2.0s      - Attack Interval: 1.6s     - Attack Interval: 1.2s
```
