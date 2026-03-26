"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const features = [
  {
    id: "f1",
    icon: "⬡",
    title: "Digital Twin",
    body: "A virtual representation of a patient's body built from real clinical data — reflecting organ functions and physiological conditions in a live digital environment.",
    from: "left",
  },
  {
    id: "f2",
    icon: "⟳",
    title: "System Flow",
    body: "Patient Data → Digital Twin → Simulation → Outcome Analysis. Every treatment interaction is modelled across all body systems in real time.",
    from: "right",
  },
  {
    id: "f3",
    icon: "◈",
    title: "Drug Simulation",
    body: "Simulates Absorption, Distribution, Metabolism and Excretion at organ level, giving precise insight into how any compound moves through the body.",
    from: "left",
  },
  {
    id: "f4",
    icon: "◎",
    title: "Treatment Insight",
    body: "Evaluate dosing strategies, monitor response curves and fine-tune protocols — before a single trial begins.",
    from: "right",
  },
];


export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={containerRef} className="relative h-[500vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">

        {/* subtle grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "80px 80px" }}
        />

        {/* ── Phase 1: Headline (0 → 0.25) ── */}
        <Headline progress={scrollYProgress} />

        {/* ── Phase 2: Hologram (0.2 → 0.65) ── */}
        <Hologram progress={scrollYProgress} />

        {/* ── Phase 3: Feature cards (0.45 → 0.85) ── */}
        <div className="absolute inset-0 pointer-events-none">
          {features.map((f, i) => (
            <FeatureCard key={f.id} feature={f} index={i} progress={scrollYProgress} />
          ))}
        </div>


      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   Phase 1 — company headline
══════════════════════════════════════ */
function Headline({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.08, 0.2, 0.3], [0, 1, 1, 0]);
  const y = useTransform(progress, [0, 0.08], [40, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute z-30 flex flex-col items-center text-center px-6"
    >
      <p className="mb-4 text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase text-zinc-500">
        About the Platform
      </p>
      <h2 className="text-[14vw] md:text-[8vw] font-black tracking-tighter text-white leading-none mb-6">
        Simulating Life.<br />
        <span className="text-zinc-500">Saving Lives.</span>
      </h2>
      <p className="max-w-2xl text-base md:text-xl text-zinc-400 leading-relaxed">
        We build patient-specific digital twins that predict how drugs behave inside the human body —
        replacing guesswork with precision before clinical trials begin.
      </p>
    </motion.div>
  );
}

/* ══════════════════════════════════════
   Phase 2 — hologram image
══════════════════════════════════════ */
function Hologram({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.18, 0.3, 0.72, 0.82], [0, 1, 1, 0]);
  const scale  = useTransform(progress, [0.18, 0.4, 0.72], [0.7, 1.0, 1.15]);
  const ringScale = useTransform(progress, [0.25, 0.6], [0.9, 1.08]);

  return (
    <motion.div
      style={{ opacity, scale }}
      className="relative z-10 w-[min(90vw,720px)] aspect-square"
    >
      {/* glow ring */}
      <motion.div
        style={{ scale: ringScale }}
        className="absolute inset-[-12%] rounded-full border border-white/5 shadow-[0_0_120px_rgba(255,255,255,0.04)]"
      />

      {/* hologram image */}
      <div className="relative w-full h-full">
        <Image
          src="/About/hologram.png"
          alt="Digital Twin"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* orbiting dashed ring */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full opacity-20" viewBox="0 0 100 100">
          <motion.circle
            cx="50" cy="50" r="46"
            stroke="#ffffff" strokeWidth="0.15" fill="none"
            strokeDasharray="2 6"
            animate={{ rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════
   Phase 3 — feature cards
══════════════════════════════════════ */
const CARD_POSITIONS = [
  "top-[12%] left-[3%] lg:left-[6%]",
  "top-[12%] right-[3%] lg:right-[6%]",
  "bottom-[12%] left-[3%] lg:left-[6%]",
  "bottom-[12%] right-[3%] lg:right-[6%]",
];

function FeatureCard({
  feature,
  index,
  progress,
}: {
  feature: (typeof features)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const base  = 0.42 + index * 0.04;
  const xFrom = feature.from === "left" ? -60 : 60;

  const opacity = useTransform(progress, [base, base + 0.08, 0.78, 0.86], [0, 1, 1, 0]);
  const x       = useTransform(progress, [base, base + 0.1], [xFrom, 0]);

  return (
    <motion.div
      style={{ opacity, x }}
      className={`absolute ${CARD_POSITIONS[index]} w-64 lg:w-72 pointer-events-auto`}
    >
      <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/80 p-5 hover:border-white/20 hover:bg-zinc-900/80 transition-all duration-300">
        <h3 className="mb-2 text-base font-bold tracking-widest text-white uppercase">
          {feature.title}
        </h3>
        <p className="text-xs leading-relaxed text-zinc-500">
          {feature.body}
        </p>
      </div>
    </motion.div>
  );
}

