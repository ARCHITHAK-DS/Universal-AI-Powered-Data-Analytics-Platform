# Universal Intelligent Data Analytics Platform (UIDAP)

An enterprise-grade, full-stack, domain-agnostic tabular data analytics and profiling platform. Designed to ingest, sanitize, profile, audit, visualize, and extract artificial intelligence business intelligence from structured datasets (CSV, XLS, XLSX). 

Designed to support industries ranging from Healthcare and Finance to HR, Manufacturing, and Retail, this application pairs a high-performance, client-side math execution engine with server-side AI Copilot facilities backed by Google Gemini.

---

## 📖 Table of Contents
1. [Project Overview](#project-overview)
2. [Objectives](#objectives)
3. [Key Features](#key-features)
4. [Technology Stack](#technology-stack)
5. [System Architecture](#system-architecture)
6. [Folder Structure](#folder-structure)
7. [Module Walkthroughs](#module-walkthroughs)
   - [Authentication & Role-Based Access Control](#authentication--role-based-access-control)
   - [Dataset Management & Ingestion](#dataset-management--ingestion)
   - [Data Cleaning & Comparative Suite](#data-cleaning--comparative-suite)
   - [Visualization Engine](#visualization-engine)
   - [AI Insight Generation & Copilot Terminal](#ai-insight-generation--copilot-terminal)
   - [Report Generation Engine](#report-generation-engine)
   - [Team Workspace & Sharing](#team-workspace--sharing)
   - [Admin Operational Console](#admin-operational-console)
8. [Database Structure & Schema](#database-structure--schema)
9. [API Overview](#api-overview)
10. [Installation & Local Deployment](#installation--local-deployment)
11. [Production Deployment](#production-deployment)
12. [Troubleshooting](#troubleshooting)
13. [Screenshots](#screenshots)
14. [Future Enhancements](#future-enhancements)
15. [License](#license)

---

## 🌟 Project Overview
The **Universal Intelligent Data Analytics Platform (UIDAP)** is a centralized platform for quantitative analysts, systems administrators, and business viewers. UIDAP serves as a secure workbench for loading Excel/CSV worksheets, checking them for structural data-integrity faults (e.g. outliers, missing items, corrupt datatypes), sanitizing them, rendering descriptive charts, and generating analytical report documents automatically. It also features a conversational AI Copilot connected to Google Gemini to answer complex context-aware domain questions directly.

## 🎯 Objectives
- **Zero-Latency Ingestion**: Perform initial spreadsheet loading and structural metrics compilation in-browser, preventing unnecessary file payload roundtrips.
- **Data Quality Auditing**: Standardize comparative data profiling (identifying missing values, duplicates, and boundary violations) to support high-integrity decisions.
- **Robust Role Security**: Implement precise authentication and permission boundaries (Admin, Analyst, Viewer) to prevent unauthorized file or panel modifications.
- **Domain Adaptation**: Classify uploaded spreadsheets into corporate industries automatically, adapting charts and Key Performance Indicators dynamically.
- **Cognitive Augmentation**: Embed server-side LLM modules directly into the data analysis lifecycle, giving analysts conversational and automated intelligence.

---

## 🚀 Key Features

### 🛡️ Secure Session Security
- Server-side **`bcryptjs`** salted hashing guards registered user credentials.
- Automatic logging of user logins, devices, browser user-agents, and session durations in the Relational DB.
- Real-time password complexity tracker on registration (length, uppercase, lowercase, numbers, and symbols).

### 👥 Fine-Grained Role-Based Access Control (RBAC)
- **Admin**: Inspect registered accounts, edit user roles, toggle account statuses (Active/Inactive), view detailed security audit records, and export system-wide operational reports.
- **Analyst**: Full read-write privileges. Can ingest files, clean data tables, visualize dimensions, trigger AI insights, collaborate in workspaces, and download PDF reports.
- **Viewer**: Read-only workspace access. Can interact with shared dashboard tokens but cannot upload, alter, or delete records.

### 📊 Dataset Profiling & Autocleaning
- Auto-detects columns, schema, types, missing cells, duplicated records, and IQR outliers.
- One-Click Data Cleaning: Media/Mode imputation for empty cells, duplicate pruning, datatype casting, and Interquartile Range (IQR) outlier truncation.
- Dynamic *Before-and-After* comparisons showing exact mathematical changes side-by-side.

### 🧠 Gemini-Powered AI Insight & Copilot
- Connects securely to the Google Gemini API server-side using the `@google/genai` SDK.
- Compiles exactly 10 distinct, structured corporate findings graded by confidence percentage.
- Recommends 3 advanced Machine Learning models (Classification, Regression, Clustering) with statistical justifications.
- Integrates a real-time conversational Copilot terminal to query the spreadsheet context.

### 📈 Multi-Dimensional Visualization Engine
- Renders responsive interactive data visuals with **Recharts**:
  - Binned Frequency Histograms for distribution patterns.
  - Linear Timeline charts for temporal progressions.
  - Interactive Scatter Plots for correlation studies.
  - Pearson Correlation Heatmap showing coefficient values.
- Auto-Industry Classifier: Inspects variables to auto-categorize the workbook into a specific domain (Retail, Finance, HR, Healthcare, Education) and mounts dynamic KPIs.

### 🖨️ Document Export Studio
- Compiles full executive-grade multipage report documents directly from the browser canvas.
- Multi-Page PDF exports powered by **jspdf** and **html2canvas**, complete with corporate headers, automated pagination (e.g., *Page 1 of 6*), visual index pages, data distribution grids, and formal recommendation/sign-off slots.
- Direct **PowerPoint (PPTX)** generation using **pptxgenjs** to facilitate board-room presentations.

---

## 💻 Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | React 19, TypeScript, Tailwind CSS, Lucide Icons | Responsive SPA, modular components, high-contrast Dark UI theme |
| **Backend API** | Express 4, Node.js, `tsx` compiler, ESBuild | Secure routing, PDF streaming, session guards, and static assets |
| **Database** | JSON File Relational Engine (server/db.ts) | Thread-safe, transaction-consistent relational storage on disk |
| **AI Integration** | `@google/genai` (SDK v2) | Server-side LLM processing with Google Gemini |
| **Spreadsheet Math** | SheetJS (`xlsx`) | Quick, client-side workbook ingestion and binary parsing |
| **Visualization** | Recharts 3, D3-interpolators | Mathematical plotting and multi-variable heatmaps |
| **Document Export** | jsPDF, html2canvas, pptxgenjs | Structured multi-page PDF compilation and PowerPoint slides |

---

## ⚙️ System Architecture
The application is structured as a full-stack, cohesive Single Page Application served by an Express middleware layer.

```text
+-------------------------------------------------------------+
|                     Client Browser UI                       |
|  [React 19 Components] <---> [Descriptive Math & SheetJS]  |
+------------------------------+------------------------------+
                               | (Restful API Calls)
                               v
+-------------------------------------------------------------+
|                      Express Backend                        |
|   [Auth Router]       [Dataset Router]      [Admin Console] |
+------------------------------+------------------------------+
                               |
            +------------------+------------------+
            |                                     |
            v                                     v
+-----------------------+               +-----------------------+
|  Relational DB Store  |               |   Google Gemini AI    |
| [database-store.json] |               |   (Server-Side API)   |
+-----------------------+               +-----------------------+
```

---

## 🗂️ Folder Structure
```text
├── database-store.json          # Core persistent database store file
├── requirements.txt             # Python dependencies (for companion scripts/Streamlit)
├── package.json                 # Node.js dependencies & environment build commands
├── server.ts                    # Main API entrypoint and static assets server
├── server/
│   └── db.ts                    # DB Controller implementing CRUD models on database-store.json
├── src/
│   ├── App.tsx                  # Main entrypoint containing UI routes and shell tabs
│   ├── firebase.ts              # Optional Firebase Client Config integration
│   ├── index.css                # Global CSS stylesheet compiling Tailwind CSS utility classes
│   ├── main.tsx                 # Standard React mounting file
│   ├── types.ts                 # Centralized, strictly typed TypeScript schemas
│   ├── components/              # Modular UX Components
│   │   ├── ActivityLogsPanel.tsx   # Admin: Login session auditing logs
│   │   ├── DashboardSharing.tsx    # Workspace: Tokenized cryptographic dashboard shares
│   │   ├── DatasetHistory.tsx      # Analyst: File versions and audit history
│   │   ├── MyAccount.tsx           # Security: Profile settings and password rotation
│   │   ├── ProjectsManager.tsx     # Analyst: Projects and workbook configurations
│   │   ├── SystemSettings.tsx      # Admin: Global application environment flags
│   │   └── TeamWorkspace.tsx       # Workspace: Cooperative multi-member rooms
│   └── utils/
│       └── dataEngine.ts        # Client-side statistical engine (outliers, IQR, imputation)
└── uploads/                     # Physical storage folder for uploaded spreadsheet assets
```

---

## 📦 Database Structure & Schema

The Relational DB Store represents its schema cleanly in `/database-store.json`. The key relational records are managed by the `RelationalDB` class inside `server/db.ts`:

- **`users`**: Store profiles including usernames, emails, hashed passwords (`bcryptjs`), system roles, and status flags.
- **`loginHistory`**: Session auditing log tracking user IDs, device profiles, browsers, login, and logout timestamps.
- **`datasets`**: Files uploaded by Analysts and Admins with sizing, storage paths, and version counts.
- **`projects`**: Saved spreadsheet workspaces, capturing raw and cleaned datasets, statistical matrix configurations, and auto-generated data insights.
- **`teamWorkspaces`**: Multi-member collaborative structures pairing owners to user lists.
- **`sharedDashboards`**: Cryptographic tokens mapping to specific dashboard resources with expiry dates.
- **`activityLogs`**: Universal event logger tracking operational changes.

---

## 👤 Default Credentials & Setup

The local relational storage seeds default sandbox profiles on launch to support immediate testing.

| Account Role | Username | Email | Plaintext Password |
| :--- | :--- | :--- | :--- |
| **Global Admin** | `admin` | `admin123@gmail.com` | `admin@123` |
| **Analyst Profile** | `archu` | `architha.k11@gmail.com` | `Archu123!` |

---

## 🛠️ Installation & Local Deployment

### Prerequisites
- Node.js LTS (version 18 or above recommended)
- NPM (version 9 or above)

### 1. Ingest Dependencies
```bash
npm install
```

### 2. Configure Environment Secrets
Create a `.env` file in the root workspace folder:
```env
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
```

### 3. Run Development Server
```bash
npm run dev
```
The application will boot on port **`3000`**. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Production Deployment

### Compilation Phase
Compile the React application using Vite and bundle the server using esbuild:
```bash
npm run build
```
This produces:
- `/dist` - Optimized frontend assets.
- `/dist/server.cjs` - Compiled and optimized backend server.

### Start Production Server
```bash
npm run start
```
The server will boot in high-performance mode on port **`3000`** with standard Node.js execution.

---

## 🔌 API Overview

All API endpoints are prefixed with `/api` and are guarded where necessary by active session authentication checks.

### Authentication & Profiles
- `POST /api/auth/login` - Authenticates user. Writes login history and starts session.
- `POST /api/auth/register` - Registers a new user. Performs strength complexity checks.
- `POST /api/auth/logout` - Terminates active session and records logout timestamp.
- `POST /api/profile/update` - Modifies full name, email, or visual avatar selection.
- `POST /api/profile/change-password` - Updates old passwords following complexity guidelines.

### Admin Facilities
- `GET /api/admin/users` - Fetches all registered system users.
- `POST /api/admin/users/update-role` - Alters user privilege role (Viewer/Analyst/Admin).
- `POST /api/admin/users/update-status` - Suspends or reactivates accounts.
- `POST /api/admin/users/edit` - Edits user credentials directly from the control panel.
- `POST /api/admin/users/delete` - Permanently deletes an account.
- `GET /api/admin/activity-logs` - Pulls comprehensive security audit trails.
- `GET /api/admin/stats` - Retreives global DB statistics.
- `GET /api/admin/reports` - Fetches historical PDF and CSV audit logs.
- `POST /api/admin/reports/generate` - Generates a comprehensive system audit PDF report.

### Workspaces & Dashboards
- `GET /api/workspaces` - Fetches user-accessible collaborative rooms.
- `POST /api/workspaces/create` - Instantiates a new workspace with custom ownership.
- `POST /api/workspaces/invite` - Adds a team member into a workspace via their username.
- `GET /api/shares/list` - Pulls active tokenized shared dashboards.
- `POST /api/shares/create` - Creates a cryptographic sharing link with expiry boundaries.
- `GET /api/shares/public/:token` - Unlocks public viewer dashboard access for shared links.

---

## 🔍 Troubleshooting

- **Server fails on port 3000**: Check if other processes are using port 3000 (`lsof -i :3000`).
- **AI insights are blank**: Confirm your `GEMINI_API_KEY` is present in your `.env` file and contains valid credentials.
- **Linter fails on start**: Ensure no unused imports exist in newly added files and that TypeScript compiles successfully using `npm run lint`.

---

## 📄 License
This application is distributed under the [MIT License](LICENSE). Refer to original source files for licensing and copyright details.
