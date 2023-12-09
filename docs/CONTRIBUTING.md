# 🤝 Contributing to Galaxy Fighter

Thank you for your interest in contributing to **Galaxy Fighter**! This guide covers coding standards, architecture conventions, and submission workflows.

---

## 🛠️ Development Workflow

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ankush850/Galaxy-Fighter.git
   cd Galaxy-Fighter
   ```
2. **Start the local HTTP server**:
   ```bash
   npm start
   ```
3. **Open in browser**: Navigate to `http://localhost:3000`.

---

## 📐 Coding Conventions
- **Zero Runtime Dependencies**: The core web game must execute without bundlers or external JavaScript packages.
- **Canvas 2D Optimization**: Avoid allocating new objects or arrays inside the per-frame `gameLoop()`. Reuse particles and entities.
- **Strict Lint Validation**: Validate syntax using `node -c game.js`.
- **CSS Design**: Follow modern glassmorphism design tokens defined in `style.css`.
