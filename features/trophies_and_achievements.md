# 🏆 Trophy Room & Achievements System

Galaxy Fighter features a comprehensive **Trophy Room & Achievement Engine** with real-time in-game unlock toasts and coin bounty rewards.

---

## 🎖️ Milestone Achievements Roster

| # | Icon | Title | Unlock Criteria | Coin Reward |
| :---: | :---: | :--- | :--- | :---: |
| **1** | 🎯 | **First Blood** | Destroy your first alien UFO in combat | $+50$ 🪙 |
| **2** | 🚀 | **Hyper Aviator** | Engage the Hyper Rocket Jetpack boost | $+100$ 🪙 |
| **3** | 🛹 | **Cosmic Surfer** | Equip a Cosmic Hoverboard shield | $+100$ 🪙 |
| **4** | 🧲 | **Super Attractor** | Trigger the Super Coin Magnet pulse | $+100$ 🪙 |
| **5** | ⚡ | **Overdrive Fury** | Unleash the full Fury Overdrive Mega Laser beam | $+150$ 🪙 |
| **6** | 🔥 | **Combo King** | Achieve a 5x Combat Score Multiplier | $+200$ 🪙 |
| **7** | 👑 | **Mothership Slayer** | Destroy the Alien Dreadnought Mothership Boss | $+500$ 🪙 |
| **8** | 💰 | **Gold Commander** | Accumulate 300 total banked Gold Coins in the Hangar | $+250$ 🪙 |

---

## 🍞 In-Game Toast Notification Architecture

When an achievement condition is met during gameplay:
1. `checkAchievement(id)` is triggered.
2. The achievement ID is saved into `localStorage.galaxyfighter_achievements`.
3. The coin bounty is immediately credited to `localStorage.galaxyfighter_banked_coins`.
4. An animated glassmorphic toast notification `#achievementToast` slides in from the top of the HUD.
5. Procedural audio chime (`playSynthSound('powerup')`) and haptic pulse (`triggerHaptic([30, 20, 40])`) are fired simultaneously.
6. The toast auto-dismisses smoothly after 3.8 seconds.
