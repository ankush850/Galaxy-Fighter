# 🎮 Galaxy Fighter - Architecture: Input & Haptics Pipeline

## 1. Input Flow Architecture

```
[ Physical User Input ]
   │
   ├─► Keyboard (W, S, Shift, Space, R, P, M)
   │      │
   │      ▼
   │   e.preventDefault() -> KeyState Mapping
   │
   ├─► Touch Gamepad Buttons (▲, ▼, 💨, ✕, ○)
   │      │
   │      ▼
   │   PointerDown / PointerUp with Visual Active State
   │
   └─► Canvas Direct Touch Drag
          │
          ▼
       Touch Coordinate Normalization ($Y_{\text{target}} = \text{touch.clientY} \times \text{scaleY}$)
          │
          ▼
       Smooth Aircraft Steering Interpolation ($\Delta Y = Y_{\text{target}} - Y_{\text{plane}}$)
```

---

## 2. Cross-Platform Haptics Engine

```
[ Game Action Event ] (Fire, Dash, Hit, Powerup, Nuke)
          │
          ▼
[ triggerHaptic(duration / pattern) ]
          │
          ▼
  /───────────────────────────────────\
 <  Is `window.AndroidNative` available? >
  \───────────────────────────────────/
        /                       \
 YES   /                         \   NO
      v                           v
[ Native Android Bridge ]   /───────────────────────────\
`AndroidNative.vibrate(ms)`<  Is `navigator.vibrate`     >
      │                    <  supported by browser?     >
      ▼                     \───────────────────────────/
[ OS Vibrator Service ]           /               \
 (Hardware Motor)          YES   /                 \  NO
                                v                   v
                     [ Web Vibration API ]      [ Graceful No-Op ]
                     `navigator.vibrate(...)`
```
