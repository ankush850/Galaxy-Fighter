# ⚙️ Galaxy Fighter - Architecture: Engine & Render Pipeline

## 1. Frame Loop Orchestration
The engine loop executes using the browser's `requestAnimationFrame` mechanism capped at a fixed delta time clamp (`dt = Math.min((t - lastTime) / 1000, 0.1)`) to avoid time dilation spikes.

```
+-----------------------------------------------------------------------------------+
|                            REQUEST ANIMATION FRAME TICK                           |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
                         +-------------------------------+
                         |   Calculate Delta Time (dt)   |
                         |   (Max clamp 100ms)           |
                         +-------------------------------+
                                         |
                                         v
                      /-------------------------------------\
                     | Is State == PLAYING?                  |
                      \-------------------------------------/
                                    /         \
                             YES   /           \   NO
                                  v             v
                +---------------------+      +---------------------+
                | 1. Update Pipeline  |      | Keep Idle Animation |
                | 2. Render Pipeline  |      | / UI Overlays       |
                +---------------------+      +---------------------+
                                  \             /
                                   \           /
                                    v         v
                         +-------------------------------+
                         | Request Next Animation Frame  |
                         +-------------------------------+
```

---

## 2. 10-Layer Render Pipeline
The rendering pipeline operates across 10 deterministic z-index visual layers:

```
[Layer 0]: Starfield Background Particle Emitters
   │
[Layer 1]: Seamless Parallax Background Map (Dual-wrap offset)
   │
[Layer 2]: Ghost After-Images (Quantum Warp Dash Trails)
   │
[Layer 3]: Collectible Power-Up Sprites & Hovering Glow Rings
   │
[Layer 4]: Space Asteroid Hazards with Rotational Physics
   │
[Layer 5]: Torpedo Missiles & Exhaust Trail Particles
   │
[Layer 6]: Enemy Plasma Fireballs & Projectiles
   │
[Layer 7]: Enemy UFOs (Scouts & Heavy Armored Cruisers)
   │
[Layer 8]: Alien Mothership Dreadnought Boss Entity
   │
[Layer 9]: Player Aircraft + Live Cosmic Hoverboard Overlay
   │
[Layer 10]: Particle Engine (Explosions, Smoke, Sparks, Speed Lines)
   │
[Layer 11]: Floating Combat Text & Combo Multiplier Alerts
   │
[Layer 12]: Head-Up Display (HUD: Magazine, Hearts, Sector, Score)
```

---

## 3. Screen Shake & Camera Matrix
Screen shake is computed via a decaying sinusoidal random impulse function:
$$\text{Offset}_X = (\text{Random}() - 0.5) \times \text{screenShake}$$
$$\text{Offset}_Y = (\text{Random}() - 0.5) \times \text{screenShake}$$
$$\text{screenShake} \leftarrow \max(0, \text{screenShake} - dt \times 32)$$
The canvas context translates by $(\text{Offset}_X, \text{Offset}_Y)$ before rendering and restores state at the end of the frame.
