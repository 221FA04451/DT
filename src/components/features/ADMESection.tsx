"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

const admeData = [
  {
    id: "A",
    title: "Absorption.",
    description:
      "From the moment of administration, every compound races against biological barriers. We model exactly how much reaches systemic circulation — and why.",
    image: "/Pharmacokinetics/absorption.png",
  },
  {
    id: "D",
    title: "Distribution.",
    description:
      "A drug's reach defines its power. We trace how it travels through blood, tissue, and organs — mapping exactly where it goes, and where it doesn't.",
    image: "/Pharmacokinetics/distribution.png",
  },
  {
    id: "M",
    title: "Metabolism.",
    description:
      "The body never accepts a drug unchanged. We simulate enzymatic breakdown and hepatic processing to reveal what the compound truly becomes inside you.",
    image: "/Pharmacokinetics/metabolism.png",
  },
  {
    id: "E",
    title: "Excretion.",
    description:
      "Every drug must leave. We model the full clearance pathway — renal, biliary, and beyond — ensuring nothing lingers longer than it should.",
    image: "/Pharmacokinetics/excretion.png",
  },
];

const PHASES   = admeData.length;
const THROTTLE = 700; // ms between phase jumps

export default function ADMESection() {
  const containerRef   = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const lastNavTime    = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Keep state + ref in sync when user scrolls normally
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(Math.floor(v * PHASES), PHASES - 1);
    activeIndexRef.current = idx;
    setActiveIndex(idx);
  });

  // Scroll the page to the exact midpoint of a phase
  // (midpoint ensures the active letter is fully in its bright/large state)
  const scrollToPhase = useCallback((idx: number) => {
    if (!containerRef.current) return;
    const container  = containerRef.current;
    const scrollable = container.scrollHeight - window.innerHeight;
    const progress   = (idx + 0.5) / PHASES;
    window.scrollTo({ top: container.offsetTop + progress * scrollable, behavior: "smooth" });
  }, []);

  // Returns true when the sticky panel is covering the viewport
  const isActive = useCallback(() => {
    if (!containerRef.current) return false;
    const { top, bottom } = containerRef.current.getBoundingClientRect();
    return top <= 0 && bottom >= window.innerHeight;
  }, []);

  useEffect(() => {
    const tryNavigate = (dir: 1 | -1) => {
      const next = activeIndexRef.current + dir;
      if (next < 0 || next >= PHASES) return false; // let page scroll continue
      const now = Date.now();
      if (now - lastNavTime.current < THROTTLE) return true; // swallow but don't jump
      lastNavTime.current = now;
      scrollToPhase(next);
      return true;
    };

    const handleWheel = (e: WheelEvent) => {
      if (!isActive()) return;
      const captured = tryNavigate(e.deltaY > 0 ? 1 : -1);
      if (captured) e.preventDefault();
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      if (!isActive()) return;
      const captured = tryNavigate(e.key === "ArrowDown" ? 1 : -1);
      if (captured) e.preventDefault();
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKey);
    };
  }, [isActive, scrollToPhase]);

  const phase = admeData[activeIndex];

  return (
    <section ref={containerRef} className="relative h-[800vh] bg-black">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden bg-black px-6 md:px-16 lg:px-24">

        {/* ── A D M E letters — driven by activeIndex, not scroll progress ── */}
        <div className="relative z-10 flex justify-center items-baseline gap-x-4 md:gap-x-6 mb-8">
          {admeData.map((item, i) => (
            <PhaseLabel key={item.id} label={item.id} isActive={i === activeIndex} />
          ))}
        </div>

        {/* ── Single card ── */}
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

              <div className="hidden md:block w-px h-64 bg-zinc-800" />

              <div className="flex flex-col items-start">
                <h3 className="text-3xl md:text-5xl font-black tracking-tight mb-2 text-white">
                  {phase.title}
                </h3>
                <p className="text-zinc-500 text-xs md:text-sm leading-relaxed max-w-xs">
                  {phase.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}

/* ── Letter label — animates purely from isActive prop ── */
function PhaseLabel({ label, isActive }: { label: string; isActive: boolean }) {
  return (
    <div className="inline-block select-none leading-none">
      <motion.span
        animate={{
          fontSize: isActive ? "8vw" : "3vw",
          color: isActive ? "#ffffff" : "#27272a",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="block font-black tracking-tighter"
      >
        {label}
      </motion.span>
    </div>
  );
}
