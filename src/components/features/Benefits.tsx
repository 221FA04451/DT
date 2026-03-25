"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ─── Data ──────────────────────────────────────────────────── */
const audiences = [
  {
    id: "doctors",
    label: "For Doctors",
    accent: "bg-cyan-400",
    border: "border-cyan-500/20",
    badgeColor: "text-cyan-400",
    metric: { value: "94%", label: "Drug response prediction accuracy" },
    headline: "Prescribe with confidence.",
    description:
      "Replace trial-and-error with evidence-backed precision. Every treatment recommendation is grounded in a patient-specific simulation.",
    points: [
      "Predict individual drug response before the first dose",
      "Identify adverse reactions and contraindications early",
      "Eliminate dosing guesswork with pharmacokinetic modelling",
      "Generate explainable, audit-ready clinical summaries",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    id: "hospitals",
    label: "For Hospitals",
    accent: "bg-violet-400",
    border: "border-violet-500/20",
    badgeColor: "text-violet-400",
    metric: { value: "40%", label: "Reduction in adverse drug events" },
    headline: "Reduce risk at scale.",
    description:
      "Protect patients and reduce liability across your entire formulary — without overhauling your existing clinical workflows.",
    points: [
      "Run batch simulations across patient cohorts simultaneously",
      "Integrate with existing EHR and clinical data systems",
      "Reduce adverse drug events and associated readmission costs",
      "Produce FDA/EMA-aligned outcome reports on demand",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21" />
      </svg>
    ),
  },
  {
    id: "pharma",
    label: "For Pharma",
    accent: "bg-emerald-400",
    border: "border-emerald-500/20",
    badgeColor: "text-emerald-400",
    metric: { value: "3×", label: "Faster time to pre-clinical insight" },
    headline: "Accelerate your pipeline.",
    description:
      "Validate compounds, compare efficacy, and prepare regulatory submissions — all before a single wet lab experiment.",
    points: [
      "Complete full ADME profiling without physical experiments",
      "Compare compound candidates across virtual patient populations",
      "Reduce pre-clinical validation cycles by up to 60%",
      "Generate simulation evidence packages for regulatory bodies",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.727 0-5.399-.439-7.933-1.241-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
];

const ease = [0.25, 0.46, 0.45, 0.94] as const;

/* ─── Benefit card ──────────────────────────────────────────── */
function BenefitCard({
  item,
  index,
}: {
  item: (typeof audiences)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease, delay: index * 0.12 }}
      className={`group relative flex flex-col rounded-2xl border ${item.border} bg-white/[0.02] overflow-hidden transition-colors duration-300 hover:bg-white/[0.04] hover:border-white/[0.12]`}
    >
      {/* top accent line */}
      <div className={`h-[2px] w-full ${item.accent} opacity-60`} />

      <div className="flex flex-col flex-1 p-6 gap-5">

        {/* icon + label */}
        <div className="flex items-center justify-between">
          <div className={`${item.badgeColor} opacity-70`}>{item.icon}</div>
          <span className={`text-[10px] font-bold tracking-[0.28em] uppercase ${item.badgeColor}`}>
            {item.label}
          </span>
        </div>

        {/* headline + description */}
        <div>
          <h3 className="text-2xl font-black tracking-tight text-white leading-tight mb-3 md:text-3xl">
            {item.headline}
          </h3>
          <p className="text-sm leading-relaxed text-zinc-500">
            {item.description}
          </p>
        </div>

        {/* bullet points */}
        <ul className="flex flex-col gap-3">
          {item.points.map((point, i) => (
            <motion.li
              key={point}
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, ease, delay: index * 0.12 + 0.25 + i * 0.07 }}
              className="flex items-start gap-3"
            >
              <span className={`mt-[3px] h-4 w-4 shrink-0 rounded-full border ${item.border} flex items-center justify-center`}>
                <svg viewBox="0 0 10 10" className={`h-2.5 w-2.5 ${item.badgeColor}`} fill="none">
                  <path d="M2 5.5l2 2 4-4" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-sm leading-relaxed text-zinc-400">{point}</span>
            </motion.li>
          ))}
        </ul>

        {/* metric */}
        <div className={`mt-auto border-t ${item.border} pt-4 flex items-baseline gap-3`}>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease, delay: index * 0.12 + 0.5 }}
            className={`text-4xl font-black tracking-tight ${item.badgeColor}`}
          >
            {item.metric.value}
          </motion.span>
          <span className="text-xs text-zinc-500 leading-snug max-w-[10rem]">
            {item.metric.label}
          </span>
        </div>

      </div>
    </motion.div>
  );
}

/* ─── Main export ───────────────────────────────────────────── */
export default function Benefits() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section className="bg-black px-6 py-14 md:px-16 lg:px-24">
      <div className="mx-auto max-w-7xl">

        {/* header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 32 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="mb-10 max-w-2xl"
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-zinc-600">
            Platform Benefits
          </p>
          <h2 className="text-5xl font-black tracking-tight text-white md:text-6xl leading-[1.05]">
            Built for every
            <br />
            <span className="text-zinc-600">stakeholder.</span>
          </h2>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-zinc-500 max-w-lg">
            Whether you are treating patients, managing a hospital, or developing
            the next breakthrough compound — the platform delivers precision at
            every level.
          </p>
        </motion.div>

        {/* cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {audiences.map((item, i) => (
            <BenefitCard key={item.id} item={item} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
