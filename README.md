<div align="center">

<img src="./assets/uaipap-banner.svg" alt="UAIPAP Banner" width="100%" />

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=26&duration=3000&pause=800&color=8B5CF6&center=true&vCenter=true&width=650&lines=Universal+AI+Powered+Analytics+Platform;Upload.+Clean.+Visualize.+Ask+AI.+Export.;From+Messy+Spreadsheet+to+Boardroom+PDF+%F0%9F%9A%80" alt="Typing SVG" />

<br/><br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-8B5CF6?style=for-the-badge)](https://universal-ai-powered-data-analytics.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev)
[![Deployed on Render](https://img.shields.io/badge/Deployed_on-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://render.com)

</div>

---

### 🔗 [**universal-ai-powered-data-analytics.onrender.com**](https://universal-ai-powered-data-analytics.onrender.com)
> ⏳ *Runs on a free instance — the first load after inactivity can take 30–50s to wake up. Worth the wait.*

---

## 🌩️ The Problem

Every organization drowns in spreadsheets. Raw exports arrive full of missing cells, duplicate rows, and silent outliers — and before anyone can make a decision, an analyst babysits it through Excel macros, three different chart tools, then emails a PDF around and hopes no one edits the wrong copy.

**UIDAP replaces that entire pipeline with one secure workbench.**

Upload a spreadsheet. Watch it get profiled, cleaned, visualized, and interpreted by an AI copilot — then export a boardroom-grade PDF or PPTX before your coffee gets cold.

<br/>

<div align="center">
<img src="https://raw.githubusercontent.com/ARCHITHAK-DS/Universal-AI-Powered-Data-Analytics-Platform/main/assets/readme-banner.svg" alt="Platform Preview" width="90%" />
</div>

<br/>

## ✨ Features

<table>
<tr>
<td width="50%">

### 📊 Data Intelligence
- **Auto-Profiling** — instantly flags column types, missing values, duplicates, and IQR-based outliers
- **One-Click Cleaning** — median/mode imputation, dedup, type casting, with a live before/after diff
- **Industry Auto-Classifier** — reads your columns and detects Retail, Finance, HR, Healthcare, or Education context, then adapts KPIs
- **Adaptive Charts** — histograms, timelines, scatter plots, and Pearson correlation heatmaps that reshape per dataset

</td>
<td width="50%">

### 🧠 AI & Collaboration
- **Gemini AI Copilot** — ask plain-English questions about your data; it reads schema + stats server-side, not guesses
- **Report Studio** — one click → paginated, headered PDF or PPTX, generated entirely in-browser
- **Role-Based Access** — Admin / Analyst / Viewer tiers, bcrypt-hashed credentials, full audit trail
- **Team Workspaces** — shareable dashboard tokens so a Viewer never touches the raw file

</td>
</tr>
</table>

<br/>

## 🏗️ Architecture

```
                    ┌──────────────────┐
   .csv / .xlsx ──▶ │  SheetJS Parser   │   (runs in-browser — zero upload latency)
                    └────────┬─────────┘
                             ▼
                 ┌───────────────────────┐        ┌─────────────────────┐
                 │  Client Math Engine   │◀──────▶│  Recharts Renderer  │
                 └───────────┬───────────┘        └─────────────────────┘
                             │  (API calls for AI + reports + auth)
                             ▼
        ┌─────────────────────────────────────────────────────┐
        │                 Express + Node.js API                │
        │  ┌───────────┐   ┌──────────────┐   ┌─────────────┐  │
        │  │ Auth (RBAC)│   │  Projects    │   │   Admin     │  │
        │  └─────┬──────┘   └──────┬───────┘   └──────┬──────┘  │
        └────────┼─────────────────┼──────────────────┼─────────┘
                  ▼                 ▼                  ▼
          ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐
          │ MongoDB Atlas│  │ Google Gemini │  │ jsPDF / pptxgenjs │
          │ (or JSON DB) │  │               │  │                  │
          └──────────────┘  └───────────────┘  └──────────────────┘
```

**Stack at a glance**

| Layer | Tech |
|---|---|
| Frontend | React 19 · TypeScript · Tailwind CSS · Recharts · Framer Motion · Lucide Icons |
| Backend | Express 4 on Node.js · bundled with esbuild · run via `tsx` |
| AI | Google Gemini (`@google/genai`) |
| Database | MongoDB Atlas (falls back to local JSON store if unset) |
| Auth | Firebase (optional) + bcrypt-hashed credentials |
| Exports | jsPDF + html2canvas (PDF) · pptxgenjs (PPTX) · SheetJS (XLSX parsing) |

<br/>

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/ARCHITHAK-DS/Universal-AI-Powered-Data-Analytics-Platform.git
cd Universal-AI-Powered-Data-Analytics-Platform

# Install
npm install

# Configure
cp .env.example .env
# fill in GEMINI_API_KEY, MONGODB_URI, and any VITE_FIREBASE_* keys

# Run
npm run dev
```

Build & run for production:
```bash
npm run build
npm start
```

<br/>

## 🔑 Environment Variables

| Variable | Purpose | Required? |
|---|---|---|
| `GEMINI_API_KEY` | Server-side key powering the AI copilot & insight generation | ✅ |
| `MONGODB_URI` | MongoDB Atlas connection string — enables persistent storage | Recommended for production |
| `MONGODB_DB_NAME` | Database name (defaults to `uidap`) | Optional |
| `VITE_FIREBASE_API_KEY` / `VITE_FIREBASE_*` | Firebase client config, if using Firebase Auth | Optional |

> Without `MONGODB_URI`, the app falls back to a local JSON file — fine for local dev, but data won't persist across deploys on most hosts.

<br/>

## 🗺️ Roadmap

- [ ] Migrate remaining local-disk storage (`uploads/`, `exports/`) to object storage
- [ ] Streaming AI responses in the copilot terminal
- [ ] Chunked upload support for 500MB+ files
- [ ] SSO / OAuth login options

<br/>

## 🤝 Contributing

Issues and PRs are welcome — open an issue first for anything bigger than a small fix, so we can align on approach.

<br/>

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for full text.

<br/>

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer" width="100%"/>

Built with 🧠 + ☕ by **[Architha K](https://www.linkedin.com/in/architha-k-a22b4539a)**

</div>