"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function CallToAction() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative overflow-hidden bg-black px-6 py-40 md:px-16 lg:px-24">

      {/* glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[800px] rounded-full bg-white/[0.03] blur-[100px]" />
      </div>

      {/* border top */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/8" />

      <div className="relative mx-auto max-w-4xl text-center" ref={ref}>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-600"
        >
          Get Started
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-6 text-4xl font-black tracking-tight text-white md:text-6xl leading-tight"
        >
          Ready to transform
          <br />
          <span className="text-zinc-600">drug development?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 text-base text-zinc-500 md:text-lg leading-relaxed max-w-xl mx-auto"
        >
          Join leading pharmaceutical teams using Digital Twin to cut development
          timelines, reduce costs, and bring safer medicines to patients faster.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          {/* email input row */}
          <div className="flex w-full max-w-md overflow-hidden rounded-full border border-white/15 bg-white/5 focus-within:border-white/40 transition-colors">
            <input
              type="email"
              placeholder="Enter your work email"
              className="flex-1 bg-transparent px-5 py-3 text-sm text-white placeholder-zinc-600 outline-none"
            />
            <button className="m-1 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black hover:bg-zinc-200 transition-colors shrink-0">
              Request Demo
            </button>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 text-xs text-zinc-700"
        >
          No credit card required · HIPAA & GDPR compliant · Setup in minutes
        </motion.p>

      </div>
    </section>
  );
}
