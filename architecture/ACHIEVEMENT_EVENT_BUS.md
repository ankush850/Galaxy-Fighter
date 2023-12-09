# 🏛️ Architecture: Achievement & Trophy Event Bus

This document specifies the event dispatching, reward granting, and UI toast animation lifecycle of the **Trophy Room & Achievement Subsystem**.

---

## 1. Event Flow Architecture

```mermaid
sequenceDiagram
    participant Game as Combat Engine
    participant AchBus as checkAchievement(id)
    participant Storage as LocalStorage
    participant Toast as Toast UI (#achievementToast)
    participant Audio as Web Audio Synth
    participant Haptics as Android Bridge

    Game->>AchBus: Condition Met (e.g. 'first_blood')
    AchBus->>Storage: Check achievements[id]
    alt If Already Unlocked
        AchBus-->>Game: No-op return
    else If New Unlock
        AchBus->>Storage: Set achievements[id] = true
        AchBus->>Storage: Add bounty to banked_coins
        AchBus->>Toast: Render Title, Desc, Icon, slide-in CSS
        AchBus->>Audio: Play synthesis arpeggio chime
        AchBus->>Haptics: Fire tactile vibration pattern
        Toast->>Toast: Auto-dismiss after 3.8s
    end
```

---

## 2. Milestone Achievement Dictionary

```typescript
interface AchievementDef {
  id: string;
  title: string;
  desc: string;
  reward: number;
  icon: string;
}
```
All definitions are centralized in `ACHIEVEMENT_DEFS` in `game.js`, ensuring zero duplicate logic between combat event triggers and modal UI renderers.
