# ⚖️ Galaxy Fighter - Combat & Balancing Formulas

This document centralizes the mathematical formulas governing weapons, power-ups, upgrades, and entity balancing in Galaxy Fighter.

---

## 📐 1. Player Upgrades & Stat Modifiers

$$\text{Magazine Capacity} = 6 + (2 \times \text{upgrades.mag})$$
$$\text{Engine Velocity} = 7.2 \times (1.0 + 0.18 \times \text{upgrades.speed})\text{ px/frame}$$
$$\text{Power-Up Duration} = T_{\text{base}} + (3.0\text{s} \times \text{upgrades.power})$$
$$\text{Hoverboard Fatal Hits} = 1 + \text{upgrades.board}$$

---

## 🎯 2. Scoring & Combo Math

$$\text{Score Multiplier} = \min(5, \text{comboStreak})$$
$$\text{Score}(\text{Scout UFO}) = 150 \times \text{Multiplier}$$
$$\text{Score}(\text{Heavy UFO}) = 300 \times \text{Multiplier}$$
$$\text{Score}(\text{Sector Clear}) = 500\text{ pts}$$
$$\text{Score}(\text{Survival Wave Clear}) = 800\text{ pts}$$
$$\text{Score}(\text{Boss Defeat}) = 5000\text{ pts}$$

---

## ⚡ 3. Fury Overdrive Physics
- Charging: $+4\%$ per Scout, $+6\%$ per Heavy UFO, $+3\%$ per Coin.
- Mega Beam DPS against Boss: $10\text{ HP/s}$.
- Bullet-Time: $\Delta t_{\text{slow}} = \Delta t \times 0.45$.
