"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const products = [
  {
    number: "01",
    title: "3D Digital Twin Visualisation",
    description:
      "A patient-specific virtual body built from real clinical data. Simulates organ functions, physiological conditions, and systemic interactions in a fully immersive 3D environment.",
    tag: "Visualisation",
    href: "#digital-twin",
  },
  {
    number: "02",
    title: "Drug Simulation Engine",
    description:
      "Model how any compound moves through the body in real time. Predict systemic bioavailability, organ-level distribution, and therapeutic windows before a single trial begins.",
    tag: "Simulation",
    href: "#adme",
  },
  {
    number: "03",
    title: "ADME Analysis",
    description:
      "Full-spectrum pharmacokinetic profiling — Absorption, Distribution, Metabolism, Excretion — mapped phase by phase with granular parameter-level insight.",
    tag: "Pharmacokinetics",
    href: "#adme",
  },
];

function ProductCard({
  item,
  index,
}: {
  item: (typeof products)[number];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.12 }}
      className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-500"
    >
      {/* top row */}
      <div className="mb-5 flex items-start justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-600">
          {item.number}
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
          {item.tag}
        </span>
      </div>

      {/* content */}
      <div>
        <h3 className="mb-4 text-2xl font-black tracking-tight text-white leading-tight">
          {item.title}
        </h3>
        <p className="text-sm leading-relaxed text-zinc-500">{item.description}</p>
      </div>

      {/* arrow */}
      <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-zinc-600 group-hover:text-white transition-colors">
        <span>Explore</span>
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
      </div>

      {/* subtle corner accent */}
      <div className="absolute bottom-0 right-0 h-px w-16 bg-gradient-to-l from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}

export default function ProductOverview() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });

  return (
    <section id="product-overview" className="bg-black px-6 py-14 md:px-16 lg:px-24">
      <div className="mx-auto max-w-7xl">

        {/* heading */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 32 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-600">
            Product Overview
          </p>
          <h2 className="max-w-3xl text-4xl font-black tracking-tight text-white md:text-6xl leading-tight">
            Three systems.
            <br />
            <span className="text-zinc-600">One platform.</span>
          </h2>
        </motion.div>

        {/* cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {products.map((item, i) => (
            <ProductCard key={item.number} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
