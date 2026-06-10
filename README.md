# Career Manager 🚀

A personal career manager app — track internship opportunities, manage daily learning streaks, and get AI-powered career help.

Built by [Stephane Tchatchum](https://github.com/stephanetchatchum).

## Features

- **Profile** — set your details once, AI uses them in every conversation
- **Opportunities** — track applications with deadlines, status, and AI analysis
- **Learning** — daily non-negotiables tracker (NeetCode, Khan Academy, reading) with streak counter and 300-curriculum progress
- **AI Chat** — Groq for quick tasks, Claude for complex ones (cover letters, CV tailoring, opportunity analysis)
- **Settings** — add your own API keys

## Tech Stack

- React + Vite
- Tailwind CSS
- Groq API (llama-3.3-70b-versatile) — simple tasks
- Claude API (claude-sonnet-4) — complex tasks
- localStorage — no backend needed

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/stephanetchatchum/career-manager
cd career-manager
npm install
```

### 2. Run locally

```bash
npm run dev
```

Open `http://localhost:5173`

### 3. Get API keys

- **Groq (free):** https://console.groq.com — create an account, get a free API key
- **Claude:** https://console.anthropic.com — create an account, add credits

Add both keys in the Settings tab of the app.

### 4. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) and it deploys automatically on every push.

## Usage

1. Fill in your **Profile** first — name, skills, projects, goals, targets
2. Add opportunities in **Opportunities** — CERN, CNES, ESA, etc.
3. Check off your daily non-negotiables in **Learning**
4. Use **AI Chat** to analyze opportunities, write cover letters, or get advice

## Notes

- API keys are stored in your browser's localStorage only — never sent anywhere except directly to Groq/Anthropic
- Anyone can use this app with their own profile and API keys
- Data persists in localStorage — clearing browser data will reset everything
