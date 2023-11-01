# 🗺️ Galaxy Fighter - Architecture: Game State Machine & Sector Progression

## 1. Top-Level State Machine

```
              ┌─────────────────────────────┐
              │            START            │
              └──────────────┬──────────────┘
                             │ startGame()
                             ▼
              ┌─────────────────────────────┐
              │           PLAYING           │◄────────────┐
              └───────┬─────────────┬───────┘             │
     pauseGame()      │             │ endGame()           │ resumeGame()
          ┌───────────┘             └───────────┐         │
          ▼                                     ▼         │
┌───────────────────┐                 ┌───────────────────┴┐
│      PAUSED       │                 │ GAMEOVER / VICTORY │
└─────────┬─────────┘                 └─────────┬──────────┘
          │ quit()                              │ restart()
          └──────────────────┬──────────────────┘
                             ▼
              ┌─────────────────────────────┐
              │            START            │
              └─────────────────────────────┘
```

---

## 2. Sector Campaign Progression Pipeline

```
[ Sector 1: Earth Stratosphere ] (Target: 10 Kills)
                 │
                 ▼ (Kills >= 10)
[ Hyperspace Jump Fanfare ] ──> [ Sector 2: Solar Nebula ] (Target: 15 Kills + Asteroids)
                                           │
                                           ▼ (Kills >= 15)
[ Hyperspace Jump Fanfare ] ──> [ Sector 3: Cyber Void Armada ] (Target: 20 Heavy UFOs)
                                                     │
                                                     ▼ (Kills >= 20)
[ Hyperspace Jump Fanfare ] ──> [ Sector 4: Alien Mothership Core ] (Boss Dreadnought Battle)
                                                               │
                                                               ▼ (Boss HP <= 0)
                                                    [ Campaign Victory! ]
```
