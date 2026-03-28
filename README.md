
# Digital Twin — Patient-Specific Drug Simulation Platform

A patient-specific digital twin platform that simulates how drugs behave inside the human body, replacing guesswork with clinical-grade precision before trials begin.

## Overview

This web application visualizes pharmacokinetic (PK/PD) simulations using interactive 3D models and scroll-driven animations. It models drug ADME (Absorption, Distribution, Metabolism, Excretion) for individual patients, with a fully interactive x-ray human body showing all major organs and their physiological connections in real time.

## Sections

- **Digital Twin** — Interactive 3D x-ray human body (Three.js) with brain, heart, lungs, liver, stomach, kidney, and intestines rendered as sprites with animated organ-to-organ flow connections
- **Product Overview** — Platform capabilities at a glance
- **ADME Section** — Scroll-driven visual breakdown of the drug lifecycle (Absorption → Distribution → Metabolism → Excretion)
- **How It Works** — Step-by-step walkthrough (Upload → Generate → Simulate → Analyse)
- **Benefits** — Key advantages of the platform

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| 3D Rendering | Three.js · React Three Fiber · Drei |
| State | Zustand |
| Deployment | Vercel |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx               # Root layout (Header, Footer)
│   └── (marketing)/
│       ├── layout.tsx           # Marketing layout
│       ├── page.tsx             # Home page
│       ├── company/page.tsx     # Company page
│       ├── solutions/page.tsx   # Solutions page
│       └── resources/page.tsx   # Resources page
├── components/
│   ├── features/
│   │   ├── HumanBody.tsx        # 3D digital twin with organ sprites & connections
│   │   ├── ProductOverview.tsx  # Platform capabilities
│   │   ├── ADMESection.tsx      # Scroll-driven ADME breakdown
│   │   ├── HowItWorks.tsx       # Step-by-step walkthrough
│   │   └── Benefits.tsx         # Platform benefits
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   └── styles/
│       └── globals.css
└── public/
    ├── organs/                  # Organ images (brain, heart, lungs, liver, stomach, kidney, intestines)
    ├── Pharmacokinetics/        # ADME section images
    ├── HowItWorks/              # Step images
    └── logo.png
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```
# url of hosted website
https://dt-six-theta.vercel.app/
