# Abhishek S Nair — Portfolio

**Full-Stack Developer** · Web · Mobile · Backend · AI

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?logo=tailwindcss)](https://tailwindcss.com)

---

## 🌐 Live

> [abhisheksnair.dev](https://abhishek-portfolio-nu-five.vercel.app) _(Vercel)_

---

## 🚀 About

A premium cinematic developer portfolio with two experiences:

- **Professional Mode** — Clean, recruiter-friendly full-stack portfolio
- **Cinematic Experience Mode** — GTA-inspired interactive portfolio with HUD, radar mini-map, 8 cinematic scenes, and ABI AI Guide chatbot

Built with real production projects, professional work history, and verified credentials.

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|-------------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, TypeScript, Tailwind CSS |
| Animation | Framer Motion, GSAP |
| Audio | Web Audio API (custom AudioSynth) |
| Contact | EmailJS (no backend required) |
| Deployment | Vercel |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── contact/       # Contact form email handler
│   │   └── photo/         # Secured image API route
│   ├── experience/        # Cinematic experience page
│   └── page.tsx           # Professional portfolio home
├── components/
│   ├── experience/        # Cinematic mode components
│   │   ├── CinematicExperience.tsx
│   │   ├── AbiAiGuide.tsx
│   │   └── AudioSynth.ts
│   ├── ProtectedImage.tsx # Canvas-based secure image component
│   └── ...                # Portfolio sections
├── data/
│   └── portfolioData.ts   # All projects, experience, certifications
public/
└── scenes/                # Cinematic backdrop images (8 scenes)
```

---

## 🔒 Security Note

The personal photo is **not committed to this repository** and is served via a secured Next.js API route (`/api/photo`) with:
- Referrer validation (same-origin only)
- Canvas-based rendering (blocks right-click save)
- `Cache-Control: no-store` headers
- Excluded from git via `.gitignore`

For deployment, the photo is uploaded separately via Vercel CLI.

---

## 🏃 Run Locally

```bash
git clone https://github.com/abhisheksureshnair/abhishek-portfolio.git
cd abhishek-portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **Note:** The personal photo (`src/private-assets/photo.jpg`) is not included in the repo. The site will work without it — image slots show a loading skeleton.

---

## 📬 Contact

**Abhishek S Nair**  
[nairsabhishek@gmail.com](mailto:nairsabhishek@gmail.com)  
[linkedin.com/in/abhisheksnair](https://linkedin.com/in/abhisheksnair)  
[github.com/abhisheksureshnair](https://github.com/abhisheksureshnair)
