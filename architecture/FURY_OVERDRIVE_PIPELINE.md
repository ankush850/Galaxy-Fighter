# 🏛️ Architecture: Fury Overdrive Pipeline & Bullet-Time Engine

This document details the execution pipeline, split delta-time physics, and collision matrix for the **Fury Overdrive Ultimate Ability**.

---

## 1. Frame Execution Pipeline

```mermaid
sequenceDiagram
    participant Input as Input Handler
    participant Overdrive as Overdrive Manager
    participant Loop as Main Game Loop
    participant Player as Player Entity
    participant Entities as Hostile Entities (UFOs/Boss)
    participant Renderer as Render Pipeline

    Input->>Overdrive: activateOverdrive() [Q/E / ⚡ Touch]
    Overdrive->>Player: Set overdriveTimer = 4.0, invulnerableTimer = 4.0
    Overdrive->>Loop: Enable Split Delta Time (dt_entities = dt * 0.45)
    Loop->>Player: Update player at normal dt (1.0x)
    Loop->>Entities: Update UFOs & Projectiles at slowed dt (0.45x)
    Loop->>Overdrive: Horizontal Beam Piercing Raycast (y ± 65px)
    Overdrive->>Entities: Deal 99 DMG (Vaporize UFOs) / 10 DPS (Boss)
    Loop->>Renderer: Render 1280px Cyan-Gold Laser + Lightning Particles
```

---

## 2. Split Delta Time Math

To achieve the Matrix Bullet-Time slow-mo effect without impacting frame rates or input responsiveness:

$$\Delta t_{\text{player}} = \Delta t$$
$$\Delta t_{\text{entities}} = \begin{cases} \Delta t \times 0.45 & \text{if } \text{player.overdriveTimer} > 0 \\ \Delta t & \text{otherwise} \end{cases}$$

---

## 3. Beam Collision Matrix
The piercing beam is evaluated across all active enemies and asteroids on each frame:
```javascript
if (gameState.player && gameState.player.overdriveTimer > 0) {
  const py = gameState.player.y;
  gameState.enemies.forEach(enemy => {
    if (!enemy.markedForDeletion && Math.abs(enemy.y - py) < 65 && enemy.x > gameState.player.x) {
      enemy.takeDamage(99);
    }
  });
}
```
