# Digital Twin — Precision Medicine Platform

A patient-specific digital twin platform that simulates how drugs behave inside the human body, replacing guesswork with clinical-grade precision before trials begin.

## Overview

This web application visualizes pharmacokinetic (PK/PD) simulations using interactive 3D models and animations. It demonstrates how a digital twin platform can model drug ADME (Absorption, Distribution, Metabolism, Excretion) for individual patients.

## Sections

- **Hero** — Landing with background visualization and CTAs
- **Product Overview** — Platform capabilities at a glance
- **Digital Twin** — Interactive 3D holographic human body (Three.js)
- **ADME Section** — Visual breakdown of the drug lifecycle pipeline
- **About** — Mission and background
- **How It Works** — Step-by-step walkthrough (Upload → Generate → Simulate → Analyse)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| 3D Rendering | Three.js · React Three Fiber · Drei |
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
│   ├── layout.tsx        # Root layout (Header, Footer)
│   └── page.tsx          # Home page
├── components/
│   ├── features/
│   │   ├── HeroSection.tsx
│   │   ├── ProductOverview.tsx
│   │   ├── HumanBody.tsx     # 3D digital twin viewer
│   │   ├── ADMESection.tsx
│   │   ├── AboutSection.tsx
│   │   └── HowItWorks.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
└── lib/
    └── styles/
        └── globals.css
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```
