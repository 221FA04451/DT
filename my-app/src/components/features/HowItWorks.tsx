"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Upload Patient Data",
    description:
      "Import clinical records, lab results, genomic data, and physiological parameters. Our platform normalises and validates all inputs automatically.",
  },
  {
    step: "02",
    title: "Generate Digital Twin",
    description:
      "A patient-specific virtual model is built in real time — capturing organ functions, metabolic rates, and systemic interactions unique to each individual.",
  },
  {
    step: "03",
    title: "Simulate Drug Response",
    description:
      "Run the full ADME pipeline. The engine models how your compound absorbs, distributes, metabolises, and is excreted — at organ level, over time.",
  },
  {
    step: "04",
    title: "Analyse & Optimise",
    description:
      "Review pharmacokinetic curves, adjust dosing strategies, compare treatment scenarios, and export FDA/EMA-ready reports — all without a single wet lab.",
  },
];

function Step({
  item,
  index,
  isLast,
}: {
  item: (typeof steps)[number];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -32 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.15 }}
      className="relative flex gap-8"
    >
      {/* timeline spine */}
      <div className="flex flex-col items-center">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-[11px] font-black text-white">
          {item.step}
        </div>
        {!isLast && <div className="mt-2 w-px flex-1 bg-linear-to-b from-white/15 to-transparent" />}
      </div>

      {/* content */}
      <div className="pb-14">
        <h3 className="mb-3 text-xl font-black tracking-tight text-white md:text-2xl">
          {item.title}
        </h3>
        <p className="max-w-lg text-sm leading-relaxed text-zinc-500">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const titleRef = useRef(null);
  const inView = useInView(titleRef, { once: true, margin: "-60px" });

  return (
    <section className="bg-black px-6 py-32 md:px-16 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-20 md:grid-cols-2 md:gap-24">

          {/* left: heading */}
          <motion.div
            ref={titleRef}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="md:sticky md:top-32 md:self-start"
          >
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-600">
              How It Works
            </p>
            <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl leading-tight">
              From data to
              <br />
              <span className="text-zinc-600">clinical insight.</span>
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-zinc-500 max-w-sm">
              Four steps. Zero guesswork. Full pharmacokinetic confidence before
              your compound ever enters a patient.
            </p>
          </motion.div>

          {/* right: steps */}
          <div className="flex flex-col">
            {steps.map((item, i) => (
              <Step key={item.step} item={item} index={i} isLast={i === steps.length - 1} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
