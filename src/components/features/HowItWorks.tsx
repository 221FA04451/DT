"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import Image from "next/image";

/* ─── Data ──────────────────────────────────────────────────── */
const steps = [
  {
    step: "01",
    system: "PATIENT DATA",
    title: "Patient Data",
    description:
      "Clinical records, lab results, and genomic data are collected and validated, forming the complete biological profile of the patient.",
    prompts: ["Receiving patient data...", "Synchronizing clinical inputs..."],
    image: "/HowItWorks/step1.png",
    alt: "Patient data collection",
    color: { badge: "text-cyan-400", ring: "border-cyan-500/30" },
  },
  {
    step: "02",
    system: "DIGITAL TWIN",
    title: "Digital Twin",
    description:
      "A high-fidelity virtual model of the patient is constructed in real-time — mapping organ functions, metabolic rates, and systemic interactions.",
    prompts: ["Generating digital twin...", "Mapping organ systems..."],
    image: "/HowItWorks/Step2.webp",
    alt: "Digital twin model generation",
    color: { badge: "text-violet-400", ring: "border-violet-500/30" },
  },
  {
    step: "03",
    system: "SIMULATION",
    title: "Simulation",
    description:
      "The selected treatment is introduced into the virtual model, simulating the full ADME pipeline — absorption, distribution, metabolism, and excretion.",
    prompts: ["Initializing simulation...", "Tracking drug movement..."],
    image: "/HowItWorks/step3.png",
    alt: "Drug simulation",
    color: { badge: "text-blue-400", ring: "border-blue-500/30" },
  },
  {
    step: "04",
    system: "ORGAN RESPONSE",
    title: "Organ Response",
    description:
      "Each organ reacts to the treatment in real-time. The platform tracks pharmacokinetic curves, highlights risk signals, and records systemic changes.",
    prompts: ["Analyzing organ response...", "Monitoring system changes..."],
    image: "/HowItWorks/step4.png",
    alt: "Organ response monitoring",
    color: { badge: "text-emerald-400", ring: "border-emerald-500/30" },
  },
  {
    step: "05",
    system: "OUTCOME",
    title: "Outcome",
    description:
      "Clear, FDA/EMA-ready insights are generated — enabling confident treatment planning, dosing optimisation, and clinical decision support.",
    prompts: ["Compiling results...", "Generating treatment insights..."],
    image: "/HowItWorks/step5.png",
    alt: "Treatment outcome insights",
    color: { badge: "text-amber-400", ring: "border-amber-500/30" },
  },
];

/* ─── Easing ────────────────────────────────────────────────── */
const ease = [0.25, 0.46, 0.45, 0.94] as const;

/* ─── Variants ──────────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease } },
};


/* ─── Step card ─────────────────────────────────────────────── */
function StepCard({
  item,
  index,
  isLast,
}: {
  item: (typeof steps)[number];
  index: number;
  isLast: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-100px" });

  /* scroll-linked image parallax */
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], [28, -28]);
  const imgY = useSpring(rawY, { stiffness: 80, damping: 20 });

  const isEven = index % 2 === 0;

  return (
    <div ref={cardRef} className="relative mb-4">
      {/* connector */}
      {!isLast && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.5 }}
          style={{ originY: 0 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-4 bg-white/10 z-10"
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 56 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.85, ease }}
        className="grid md:grid-cols-2 overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0a0a0a]"
      >
        {/* ── Text ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className={`flex flex-col justify-center gap-5 p-8 md:p-10 ${isEven ? "md:order-1" : "md:order-2"}`}
        >
          {/* step + label */}
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <span className={`text-[11px] font-bold tracking-[0.35em] uppercase ${item.color.badge}`}>
              {item.step} — {item.system}
            </span>
          </motion.div>

          {/* title */}
          <motion.h3
            variants={fadeUp}
            className="text-[2.25rem] font-black tracking-tight text-white leading-[1.1] md:text-5xl"
          >
            {item.title}
          </motion.h3>

          {/* description */}
          <motion.p
            variants={fadeUp}
            className="text-[0.9375rem] leading-[1.7] text-zinc-400 max-w-[22rem]"
          >
            {item.description}
          </motion.p>

        </motion.div>

        {/* ── Image ── */}
        <div
          className={`relative overflow-hidden min-h-[300px] md:min-h-[460px] bg-zinc-950 ${isEven ? "md:order-2" : "md:order-1"}`}
        >
          <motion.div
            className="absolute inset-[-8%] will-change-transform"
            style={{ y: imgY }}
          >
            <motion.div
              initial={{ scale: 1.06, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 1.1, ease }}
              className="h-full w-full"
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </motion.div>

          {/* subtle bottom gradient for text bleed */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Section header ────────────────────────────────────────── */
function SectionHeader() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="mb-10 text-center"
    >
      <motion.p
        variants={fadeUp}
        className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-zinc-600"
      >
        How It Works
      </motion.p>

      <motion.h2
        variants={fadeUp}
        className="text-5xl font-black tracking-tight text-white md:text-7xl leading-[1.05]"
      >
        From data to
        <br />
        <span className="text-zinc-600">clinical insight.</span>
      </motion.h2>

      <motion.p
        variants={fadeUp}
        className="mx-auto mt-5 max-w-md text-[0.9375rem] leading-[1.7] text-zinc-500"
      >
        Five stages. Zero guesswork. Full pharmacokinetic confidence before
        your compound ever enters a patient.
      </motion.p>
    </motion.div>
  );
}

/* ─── Export ────────────────────────────────────────────────── */
export default function HowItWorks() {
  return (
    <section className="relative bg-black px-6 py-14 md:px-16 lg:px-24 overflow-hidden">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader />
        <div className="flex flex-col">
          {steps.map((item, i) => (
            <StepCard key={item.step} item={item} index={i} isLast={i === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
