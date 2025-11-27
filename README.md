# 🧠 Friendly Commits  
Generate smart commit messages from git diffs or code — fully on-device.

Friendly Commits is a tiny web app that takes a git diff or code snippet and generates a clean, accurate commit message using:

- **Transformers.js**
- **Qwen2.5-Coder-0.5B-Instruct (ONNX)**
- **Web Workers** (AI runs off the main thread)
- **React + Vite + Tailwind**

Everything runs **100% locally in your browser** — no API keys, no cloud, no servers.

---

## 📦 Features

- 🧠 **Local LLM inference** — Qwen model runs in-browser via ONNX  
- ⚡ **Web Worker offloading** — the UI never freezes during inference  
- 🎨 **Clean UI** built with Tailwind  
- ✍️ **Conventional Commits** output (`feat`, `fix`, `refactor`, etc.)  
- 🛡️ Automatic detection of invalid inputs  
- 🔌 No backend, no cloud, no tracking

---

## 🧰 Tech Stack

- **React 18 + TypeScript**
- **Vite**
- **TailwindCSS**
- **Transformers.js**
- **ONNX Runtime (Web/WASM/WebGPU)**
- **Web Workers**

---

## 📁 Project Structure

src/
logic/
commitMessageModel.ts # Worker bridge (request/response)
workers/
commitWorker.ts # Qwen model loaded here
App.tsx # UI
main.tsx
index.css

## ▶️ Running Locally

# Clone and install:

```bash
git clone https://github.com/sylwia-lask/friendly-commit-messages.git
cd friendly-commit-messages
npm install
```

# Start dev server:

```
npm run dev
```

#Open:

```
http://localhost:5173
```

# 🏗️ Build

```
npm run build
```

# Preview production bundle:

```
npm run preview
```

## 🧠 How It Works

A Web Worker loads
Qwen2.5-Coder-0.5B-Instruct (ONNX) using Transformers.js

The main UI sends diffs/snippets to the worker

The worker generates a commit message using this prompt:

- If input is not code or a diff → "This is not valid code or a git diff."
- Otherwise → produce one-line commit message


UI displays the result instantly without freezing

## 🎯 Why On-Device AI?

⚡ Zero latency

🔒 No data leaves your machine

💸 No tokens or API bills

🧱 Works offline

🧪 A perfect environment for experimenting with small LLMs
