"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const features = [
  {
    id: "patient-data",
    title: "Patient Data",
    content: "Ingest longitudinal EHRs, real-time wearable biometrics, and multi-omics (genomics, proteomics) data to establish high-fidelity biological parameters.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070",
  },
  {
    id: "twin-creation",
    title: "Digital Twin Creation",
    content: "Leveraging mechanistic modeling, we generate a persistent in silico representation that mirrors patient-specific cellular mechanics and systemic physiology.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=2070",
  },
  {
    id: "drug-simulation",
    title: "Drug Simulation",
    content: "Execute high-throughput in silico clinical trials. We simulate pharmacokinetics to predict how compounds distribute, metabolize, and excrete within the twin.",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2070",
  },
  {
    id: "organ-response",
    title: "Organ Response",
    content: "Monitor localized toxicological impact prior to administration. Trace intricate receptor-ligand bindings to predict drug efficacy and adverse effects.",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=2070",
  },
  {
    id: "outcome-visualization",
    title: "Outcome Visualization",
    content: "Translate complex computations into actionable clinical intelligence. Explore optimized dosage regimens and precise multi-year progression trajectories.",
    image: "https://images.unsplash.com/photo-1581404147348-e4b9e288e404?auto=format&fit=crop&q=80&w=2070",
  },
];

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);



const ChevronUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 15-6-6-6 6" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);
  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % features.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  return (
    <div className="h-screen bg-black text-white flex items-center justify-center px-8 lg:px-16 overflow-hidden">
      <div className="flex w-full max-w-7xl h-full items-center py-8">

        {/* Left Navigation & Accordion Container */}
        <div className="flex w-[45%] max-w-md h-full items-center">
          
          {/* Arrow Buttons */}
          <div className="flex flex-col gap-4 mr-8 lg:mr-12">
            <button 
              onClick={handlePrev}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1c1c1e] hover:bg-[#2c2c2e] transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
              aria-label="Previous feature"
            >
              <ChevronUpIcon />
            </button>
            <button 
              onClick={handleNext}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1c1c1e] hover:bg-[#2c2c2e] transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
              aria-label="Next feature"
            >
              <ChevronDownIcon />
            </button>
          </div>

          {/* Feature List */}
          <div className="flex flex-col gap-4 w-full">
            {features.map((feature, index) => {
              const isActive = index === activeIndex;

              return (
                <motion.div
                  key={feature.id}
                  layout
                  onClick={() => setActiveIndex(index)}
                  className={`
                    cursor-pointer overflow-hidden origin-left
                    ${isActive 
                      ? "bg-[#333333] shadow-lg" 
                      : "bg-[#1c1c1e] hover:bg-[#2c2c2e]"}
                  `}
                  style={{
                    borderRadius: isActive ? "24px" : "9999px",
                    width: isActive ? "100%" : "fit-content",
                  }}
                  transition={{
                    layout: { type: "spring", bounce: 0.2, duration: 0.6 }
                  }}
                >
                  {isActive ? (
                    <motion.div 
                      key="active-content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                      className="p-6 md:p-8"
                    >
                      <p className="text-white text-base md:text-lg leading-relaxed">
                        <span className="font-semibold text-white mr-2">{feature.title}.</span>
                        <span className="text-zinc-300">{feature.content}</span>
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="inactive-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-3 px-5 py-3"
                    >
                      <div className="text-zinc-400">
                        <PlusIcon />
                      </div>
                      <span className="font-medium text-sm text-zinc-100 tracking-wide">
                        {feature.title}
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Image Display */}
        <div className="flex-1 h-full pl-8 lg:pl-16 relative perspective-1000">
          <div className="w-full h-full rounded-4xl overflow-hidden bg-zinc-900 border-12 border-black shadow-[0_0_0_1px_rgba(255,255,255,0.08)] relative flex items-center justify-center">
            
            {/* Monitor Mockup Bezel (simulated) */}
            <div className="absolute top-0 w-full h-8 bg-black z-10 flex justify-center items-center">
              {/* Camera dot */}
              <div className="w-2 h-2 rounded-full bg-green-500/80 mr-2 shadow-[0_0_4px_#22c55e]"></div>
              <div className="w-4 h-4 rounded-full bg-zinc-800 border border-zinc-700"></div>
            </div>

            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                src={features[activeIndex].image}
                alt={features[activeIndex].title}
                initial={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full object-cover rounded-xl mt-4"
              />
            </AnimatePresence>
            
          </div>
        </div>

      </div>
    </div>
  );
}
