# 🔊 Galaxy Fighter - Architecture: Procedural Audio & Web Audio API

## 1. Web Audio API Synthesis Graph

```
+---------------------------------------------------------------------------------+
|                       WEB AUDIO API `AudioContext`                              |
+---------------------------------------------------------------------------------+
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
     +-----------------------+                       +-----------------------+
     |   HTML5 Audio Stream  |                       | Procedural Synthesis  |
     |   (Background Music)  |                       |  (Instant Sound FX)   |
     +-----------------------+                       +-----------------------+
                 │                                               │
                 │                                               ▼
                 │                                   +-----------------------+
                 │                                   |   OscillatorNode      |
                 │                                   | (Sine/Sawtooth/Tri)   |
                 │                                   +-----------------------+
                 │                                               │
                 │                                               ▼
                 │                                   +-----------------------+
                 │                                   |      GainNode         |
                 │                                   | (Exponential Envelope)|
                 │                                   +-----------------------+
                 │                                               │
                 └───────────────────────┬───────────────────────┘
                                         ▼
                         +-------------------------------+
                         |   AudioDestinationNode        |
                         |   (Device Speakers/Headphones)|
                         +-------------------------------+
```

---

## 2. Procedural Synthesis Frequency Curves

| Effect | Waveform | Frequency Modulation (Hz) | Gain Envelope |
| :--- | :--- | :--- | :--- |
| **Hyper Rocket Ignition** | Sawtooth | $80\text{ Hz} \xrightarrow{\text{exp}} 600\text{ Hz}$ in 0.4s | $0.4 \xrightarrow{\text{exp}} 0.001$ in 0.5s |
| **Cosmic Hoverboard Chime**| Sine | $300\text{ Hz} \xrightarrow{\text{exp}} 1200\text{ Hz}$ in 0.25s | $0.35 \xrightarrow{\text{exp}} 0.001$ in 0.35s |
| **Coin Magnet Pulse** | Triangle | $520\text{ Hz} \xrightarrow{\text{exp}} 840\text{ Hz}$ in 0.2s | $0.3 \xrightarrow{\text{exp}} 0.001$ in 0.3s |
| **Quantum Warp Dash** | Sawtooth | $800\text{ Hz} \xrightarrow{\text{exp}} 200\text{ Hz}$ in 0.18s | $0.3 \xrightarrow{\text{exp}} 0.001$ in 0.2s |
| **Tactical Screen Nuke** | Sawtooth | $160\text{ Hz} \xrightarrow{\text{exp}} 25\text{ Hz}$ in 0.7s | $0.6 \xrightarrow{\text{exp}} 0.001$ in 0.8s |
| **Power-up Pickup** | Sine | $440\text{ Hz} \xrightarrow{\text{exp}} 880\text{ Hz}$ in 0.15s | $0.3 \xrightarrow{\text{exp}} 0.001$ in 0.25s |
