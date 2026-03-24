"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" as const, delay },
});

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-6 pt-24 text-center">

      {/* full-screen background image */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/About/pkp.webp"
          alt="Digital Twin Visualization"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        {/* dark gradient overlay so text stays readable */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-black/80" />
      </div>

      {/* headline */}
      <motion.h1
        {...fade(0.2)}
        className="mb-6 max-w-5xl text-[11vw] font-black leading-none tracking-tighter text-white md:text-[7vw]"
      >
        Precision Medicine
        <br />
        <span className="text-zinc-600">Starts Here.</span>
      </motion.h1>

      {/* sub */}
      <motion.p
        {...fade(0.35)}
        className="mb-10 max-w-2xl text-base text-zinc-400 md:text-xl leading-relaxed"
      >
        Patient-specific digital twins that simulate how drugs behave inside the
        human body — replacing guesswork with clinical-grade precision before
        trials begin.
      </motion.p>

      {/* CTAs */}
      <motion.div {...fade(0.5)} className="flex flex-wrap items-center justify-center gap-4">
        <button className="rounded-full bg-white px-8 py-3 text-sm font-bold text-black transition-all hover:bg-zinc-200 hover:scale-105">
          Request a Demo
        </button>
        <Link
          href="#product-overview"
          className="rounded-full border border-white/20 px-8 py-3 text-sm font-semibold text-white transition-all hover:border-white/50 hover:bg-white/5"
        >
          Explore Platform ↓
        </Link>
      </motion.div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-px bg-linear-to-b from-white/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
