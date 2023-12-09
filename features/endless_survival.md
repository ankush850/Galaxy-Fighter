# ♾️ Feature: Endless Survival Mode

**Endless Survival Mode** is a dedicated infinite game mode in Galaxy Fighter engineered for endless replayability, escalating challenge, and high-score competitive dominance.

```mermaid
graph TD
    Start["⚡ Select Endless Survival Mode"] --> W1["Wave 1: Earth Stratosphere (15 Kills)"]
    W1 --> W2["Wave 2: Solar Nebula (15 Kills)"]
    W2 --> W3["Wave 3: Cyber Void (15 Kills) + 👾 BOSS ENCOUNTER"]
    W3 --> W4["Wave 4: Mothership Core (15 Kills)"]
    W4 --> WN["Wave N (Infinite Scaling Loop)"]
```

---

## 🌊 1. Infinite Wave Progression
- **Wave Transition Threshold**: Each wave requires exactly **15 confirmed enemy kills** to complete.
- **Wave Completion Bounty**:
  - $+800$ Bonus Combat Points
  - Screen-wide transition announcement: `⚡ SURVIVAL WAVE [N] INCOMING! ⚡`
  - Audio fanfare synthesis (`playSynthSound('powerup')`).

---

## 🔄 2. Dynamic Celestial Map Rotation
Every wave completion smoothly shifts the celestial backdrop through the 4 galactic regions:
1. `sky_background_mountains.png` (Earth Stratosphere)
2. `bg_solar_nebula.jpg` (Solar Nebula Dust)
3. `bg_cyber_void.jpg` (Cyber Void Starfield)
4. `bg_alien_mothership.jpg` (Mothership Core)
5. *Loops back seamlessly to Earth with increased difficulty multipliers!*

---

## 👾 3. Periodic Mothership Boss Raids
- Every 3rd survival wave ($\text{Wave } 3, 6, 9, 12, 15, \dots$), an **Alien Dreadnought Boss** warps directly into the combat arena.
- In survival mode, Boss max health and attack cadence scale dynamically with the wave number tier.
