"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
  MotionValue,
} from "framer-motion";

const admeData = [
  {
    id: "A",
    title: "Absorption.",
    description:
      "The primary process by which a drug enters the bloodstream from its site of administration, determining systemic availability.",
    image: "/Pharmacokinetics/absorption.png",
    parameters: [
      { label: "Bioavailability", value: "85%" },
      { label: "Tmax", value: "1.5h" },
      { label: "Cmax", value: "24.5 μg/mL" },
    ],
  },
  {
    id: "D",
    title: "Distribution.",
    description:
      "How the therapeutic agent is predictably dispersed and partitioned through the fluids and tissues of the complete physiological model.",
    image: "/Pharmacokinetics/distribution.png",
    parameters: [
      { label: "Vd", value: "0.7 L/kg" },
      { label: "Protein Binding", value: "92%" },
      { label: "BBB Cross", value: "Minimal" },
    ],
  },
  {
    id: "M",
    title: "Metabolism.",
    description:
      "Real-time chemical alteration of the drug mapping enzymatic breakdown and hepatic clearance with absolute granularity.",
    image: "/Pharmacokinetics/metabolism.png",
    parameters: [
      { label: "Half-life", value: "4.2h" },
      { label: "Clearance", value: "0.15 L/h" },
      { label: "Enzyme", value: "CYP3A4" },
    ],
  },
  {
    id: "E",
    title: "Excretion.",
    description:
      "The complete removal pipeline of the drug and its active metabolites from the systemic circulation.",
    image: "/Pharmacokinetics/excretion.png",
    parameters: [
      { label: "Renal Clear", value: "75%" },
      { label: "Biliary Exc", value: "25%" },
      { label: "Sensitivity", value: "Moderate" },
    ],
  },
];

const PHASES = admeData.length;
const STEP   = 1 / PHASES; // 0.25 per phase
const RAMP   = 0.04;       // smooth letter transition

/* ════════════════════════════════════════════
   Main section
════════════════════════════════════════════ */
export default function ADMESection() {
  const containerRef = useRef<HTMLDivElement>(null);
  // activeIndex drives the card — only ONE card in DOM at a time
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Snap to the correct phase as the user scrolls
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(Math.floor(v * PHASES), PHASES - 1);
    setActiveIndex(idx);
  });

  const phase = admeData[activeIndex];

  return (
    <section ref={containerRef} className="relative h-[800vh] bg-black">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden bg-black px-6 md:px-16 lg:px-24">

        {/* ── A D M E letters ── */}
        <div className="relative z-10 flex justify-center items-baseline gap-x-4 md:gap-x-6 mb-8">
          {admeData.map((item, i) => (
            <PhaseLabel key={item.id} index={i} label={item.id} progress={scrollYProgress} />
          ))}
        </div>

        {/* ── Single card — guaranteed no overlap ── */}
        <div className="relative z-10 w-full max-w-5xl" style={{ height: "22rem" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14"
            >
              {/* Image */}
              <div className="relative w-56 h-56 md:w-80 md:h-80 shrink-0">
                <Image
                  src={phase.image}
                  alt={phase.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 224px, 320px"
                  className="object-contain"
                />
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-64 bg-zinc-800" />

              {/* Text + stats */}
              <div className="flex flex-col items-start">
                <h3 className="text-3xl md:text-5xl font-black tracking-tight mb-2 text-white">
                  {phase.title}
                </h3>
                <p className="text-zinc-500 text-xs md:text-sm leading-relaxed max-w-xs mb-6">
                  {phase.description}
                </p>
                <div className="flex gap-6 md:gap-10">
                  {phase.parameters.map((param) => (
                    <div key={param.label} className="flex flex-col gap-0.5">
                      <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-600">
                        {param.label}
                      </span>
                      <span className="text-base md:text-xl font-bold text-white tracking-tight">
                        {param.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   Single letter label — animates size & color
   based on scroll position.
════════════════════════════════════════════ */
function PhaseLabel({
  index,
  label,
  progress,
}: {
  index: number;
  label: string;
  progress: MotionValue<number>;
}) {
  const isFirst = index === 0;
  const isLast  = index === PHASES - 1;
  const start   = index * STEP;
  const end     = start + STEP;

  // Build keyframe arrays that handle first/last edges cleanly
  const keys: number[] = isFirst
    ? [0,         end - RAMP, end]
    : isLast
    ? [start,     start + RAMP, 1]
    : [start, start + RAMP, end - RAMP, end];

  const fontVals: string[] = isFirst
    ? ["8vw", "8vw", "3vw"]
    : isLast
    ? ["3vw", "8vw", "8vw"]
    : ["3vw", "8vw", "8vw", "3vw"];

  const colorVals: string[] = isFirst
    ? ["#ffffff", "#ffffff", "#27272a"]
    : isLast
    ? ["#27272a", "#ffffff", "#ffffff"]
    : ["#27272a", "#ffffff", "#ffffff", "#27272a"];

  const fontSize = useTransform(progress, keys, fontVals);
  const color    = useTransform(progress, keys, colorVals);

  return (
    <div className="inline-block select-none leading-none">
      <motion.span
        style={{ fontSize, color }}
        className="block font-black tracking-tighter"
      >
        {label}
      </motion.span>
    </div>
  );
}
