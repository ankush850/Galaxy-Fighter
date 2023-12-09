# 🪨 Feature: Space Asteroid Environmental Hazards

Space Asteroids introduce dense environmental hazards into Sector 2, Sector 3, and Endless Survival Mode, forcing pilots to maneuver tactically while dogfighting alien UFOs.

---

## 🌌 1. Asteroid Physics & Characteristics

```mermaid
graph LR
    Spawn["🪨 Asteroid Spawns off-screen (Sector 2+)"] --> Drift["Drifts left with angular rotation (rotSpeed)"]
    Drift --> HitCheck{"Collision Event"}
    HitCheck -->|Player Torpedo (3 Hits)| Shatter["💥 Explodes (+80 Pts + Fury + Particles)"]
    HitCheck -->|Player Collision (No Shield)| Damage["💥 Player Takes 1 Life Damage"]
    HitCheck -->|Hoverboard Shield| Absorb["🛹 Shield Absorbs Impact & Drops EMP"]
    HitCheck -->|Hyper Rocket Ram| Obliterate["🚀 Asteroid Vaporized on Contact"]
```

---

## ⚙️ 2. Technical Specifications
- **Spawn Radius**: Random $20\text{px}$ to $42\text{px}$.
- **Hit Points**: $3\text{ HP}$ (requires 3 standard torpedo strikes or 1 Overdrive/Rocket hit).
- **Variants**: Dual procedural SVG vectors (`asteroid_1.svg`, `asteroid_2.svg`) with unique surface crags.
- **Rotation Engine**: Continuous rotational angular drift ($\omega = \pm 0.05\text{ rad/frame}$).
- **Vaporization Particles**: Emits slate grey and dust debris particles upon destruction (`#94a3b8`, `#64748b`).
