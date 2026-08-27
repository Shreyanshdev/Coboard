# 🎨 Coboard — Next-Gen Collaborative AI Whiteboard

<p align="center">
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/NextJS-Dark.svg" width="40" height="40" alt="Next.js" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TypeScript.svg" width="40" height="40" alt="TypeScript" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/MongoDB.svg" width="40" height="40" alt="MongoDB" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TailwindCSS-Dark.svg" width="40" height="40" alt="Tailwind CSS" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/HTML.svg" width="40" height="40" alt="HTML5 Canvas" />
</p>

<p align="center">
  <b>A real-time hand-drawn collaborative whiteboard with multimodal Google Gemini AI, prompt-to-architecture diagramming, vision math solver, and zero-collision canvas placement.</b>
</p>

---

```
   ┌─────────────────────────────────────────────────────────────┐
   │                     ✨ COBOARD ECOSYSTEM ✨                  │
   └──────────────────────────────┬──────────────────────────────┘
                                  │
         ╭────────────────────────┴────────────────────────╮
         │                                                 │
   ┌─────▼────────────────┐                     ┌──────────▼───────────┐
   │ 🤖 GEMINI AI COPILOT │                     │ ⚡ REAL-TIME ENGINE  │
   │  • Prompt-to-Diagram │                     │  • 120 FPS WebSockets│
   │  • Vision Math Solver│                     │  • Room Multi-user   │
   │  • Free-Space Radar  │                     │  • Cursor Telemetry  │
   └──────────┬───────────┘                     └──────────┬───────────┘
              │                                            │
              ╰───────────────────┬────────────────────────╯
                                  │
                                  ▼
                   ┌──────────────────────────────┐
                   │  🗄️ NATIVE MONGOOSE STORAGE │
                   │   • Embedded Canvas Elements │
                   │   • Zero 'any' Type Safety   │
                   │   • 24/7 Render Keep-Alive   │
                   └──────────────────────────────┘
```

---

## 🚀 Key Features

```
✎ Features Overview
 ├── 🪄 Google Gemini 3.7 Flash AI Copilot
 │    ├── Prompt-to-Diagram (Microservices, Ingress, DBs, Queues)
 │    ├── Multimodal Vision Math Solver (Draw `= ?` to calculate live)
 │    ╰───► Collision-Free Smart Placement (Never overlaps existing work!)
 │
 ├── 🎨 Hand-Drawn RoughJS Aesthetic
 │    ├── 12 Vector Tools: Hand, Pencil, Highlighter, Shapes, Arrows, Text, Laser
 │    ├── 5 Harmonic Palettes (Vibrant, Neon, Warm, Emerald, Monochrome)
 │    ╰───► Custom Typography (Caveat, Virgil, Inter, JetBrains Mono)
 │
 ├── 🌐 Ultra-Low Latency Collaboration
 │    ├── Native WebSockets with 120 FPS broadcast sync
 │    ├── Multiplayer Remote Cursors & Selection Highlights
 │    ╰───► Solo Offline Mode with LocalStorage fallback
 │
 └── 📱 Fluid Responsive Architecture
      ├── Desktop: Expansive top-center toolbar & floating styling drawer
      ╰───► Mobile: Floating bottom-right tool selector + top-center AI badge
```

---

## 🏗️ Architecture & Component Topology

```
 [ Client Browser ]
        │
        ├───( HTTPS / REST )───► [ Next.js Web App / API Gateway ] (Port 3000)
        │                                 │
        │                                 ├───► [ Google Gemini 3.7 Flash API ]
        │                                 ╰───► [ Express HTTP Backend ] (Port 3001)
        │                                                │
        ╰───( WSS / WebSocket )──► [ WS Real-Time Sync ] (Port 8080)
                                          │              │
                                          ╰───────┬──────╯
                                                  │
                                                  ▼
                                       [ MongoDB / Mongoose ]
                                         • Users Collection
                                         • Rooms (Embedded Elements)
```

---

## 📦 Project Structure

```
excalidraw-monorepo/
├── apps/
│   ├── web/                # Next.js 16 App Router (Canvas, AI, Landing)
│   ├── http-backend/       # Express.js REST API + Render Auto-Pinger Bot
│   └── ws-backend/         # WebSocket Server for 120 FPS Real-Time Sync
├── packages/
│   ├── common/             # Shared Types, Zod Schemas, & Constants
│   ├── db/                 # Mongoose Connection & Strict Data Models
│   └── typescript-config/  # Shared TSConfig presets
└── .github/workflows/      # CI/CD Pipeline & 24/7 Render Ping Bot
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js `20.x` or higher
- MongoDB instance (Local or MongoDB Atlas)
- Google Gemini API Key ([Get here](https://aistudio.google.com/))

### 2. Clone & Install
```bash
git clone https://github.com/your-username/coboard.git
cd coboard
npm install
```

### 3. Environment Variables
Copy `.env.example` to each corresponding app directory:
```bash
# Frontend
cp .env.example apps/web/.env

# Backends
cp .env.example apps/http-backend/.env
cp .env.example apps/ws-backend/.env
```

Add your credentials in `apps/web/.env`:
```env
NEXT_PUBLIC_HTTP_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:8080
GEMINI_API_KEY=your_actual_gemini_api_key
```

### 4. Run Locally
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to open Coboard.

---

## 🚢 Deployment (Render & Vercel)

| Service | Platform | Build Command | Start Command |
| :--- | :--- | :--- | :--- |
| **`web`** | Vercel / Render | `npm run build -w web` | `npm run start -w web` |
| **`http-backend`** | Render Web Service | `npm run build -w http-backend` | `npm run start:http` |
| **`ws-backend`** | Render Web Service | `npm run build -w ws-backend` | `npm run start:ws` |

> [!TIP]
> **Render Free Tier Auto-Bot**: The built-in bot in `apps/http-backend/src/keep-alive.ts` automatically pings your servers every 10 minutes to prevent cold boot sleep!

---

## 📜 License
MIT License © 2026 Coboard Team
