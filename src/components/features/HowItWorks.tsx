"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
/* ─── Data ──────────────────────────────────────────────────── */
const steps = [
  {
    step: "01",
    system: "PATIENT DATA",
    title: "Patient Data",
    description:
      "Clinical records, lab results, and genomic data are collected and validated, forming the complete biological profile of the patient.",
  },
  {
    step: "02",
    system: "DIGITAL TWIN",
    title: "Digital Twin",
    description:
      "A high-fidelity virtual model of the patient is constructed in real-time — mapping organ functions, metabolic rates, and systemic interactions.",
  },
  {
    step: "03",
    system: "SIMULATION",
    title: "Simulation",
    description:
      "The selected treatment is introduced into the virtual model, simulating the full ADME pipeline — absorption, distribution, metabolism, and excretion.",
  },
  {
    step: "04",
    system: "ORGAN RESPONSE",
    title: "Organ Response",
    description:
      "Each organ reacts to the treatment in real-time. The platform tracks pharmacokinetic curves, highlights risk signals, and records systemic changes.",
  },
  {
    step: "05",
    system: "OUTCOME",
    title: "Outcome",
    description:
      "Clear, FDA/EMA-ready insights are generated — enabling confident treatment planning, dosing optimisation, and clinical decision support.",
  },
];

/* ─── Section header ────────────────────────────────────────── */
function SectionHeader() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mb-14 text-center"
    >
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-zinc-600">
        How It Works
      </p>
      <h2 className="text-5xl font-black tracking-tight text-white md:text-7xl leading-[1.05]">
        From data to
        <br />
        <span className="text-zinc-600">clinical insight.</span>
      </h2>
      <p className="mx-auto mt-5 max-w-md text-[0.9375rem] leading-[1.7] text-zinc-500">
        Five stages. Zero guesswork. Full pharmacokinetic confidence before
        your compound ever enters a patient.
      </p>
    </motion.div>
  );
}

/* ─── Main component ────────────────────────────────────────── */
export default function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative bg-black px-6 py-14 md:px-16 lg:px-24 overflow-hidden">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader />

        {/* ── Apple-style two-column layout ── */}
        <div className="flex gap-6 md:gap-10 items-start">

          {/* ── Accordion list ── */}
          <div className="flex flex-col gap-2 w-full max-w-sm">
            {steps.map((item, i) => {
              const isActive = i === active;
              return (
                <div key={item.step}>
                  {/* Pill button */}
                  <button
                    onClick={() => setActive(i)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full border text-left transition-all duration-200 ${
                      isActive
                        ? "border-white/20 bg-white/10 text-white"
                        : "border-white/10 bg-transparent text-zinc-500 hover:text-zinc-200 hover:border-white/15"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isActive ? "border-white/40" : "border-white/20"
                      }`}
                    >
                      {isActive ? (
                        <span className="w-2 h-2 rounded-full bg-white" />
                      ) : (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M4 1v6M1 4h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                      )}
                    </span>
                    <span className="text-sm font-semibold tracking-tight">
                      {item.title}
                    </span>
                  </button>

                  {/* Inline description — expands right below the active pill */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 mx-1 rounded-2xl bg-zinc-900/80 border border-white/[0.07] px-4 py-3">
                          <p className="text-[11px] font-bold tracking-[0.3em] text-cyan-400 mb-1">
                            {item.step} — {item.system}
                          </p>
                          <p className="text-sm leading-[1.65] text-zinc-300">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>


        </div>
      </div>
    </section>
  );
}
