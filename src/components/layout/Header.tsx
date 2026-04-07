'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const NAV_ITEMS = ['Home','Solutions', 'Resources', 'Company'];

export function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    // Scroll down the page (latest > previous) -> Hide header
    // Scroll up the page (latest < previous) -> Show header
    if (latest > previous && latest > 50) {
      setHidden(true);
    } else if (latest < previous) {
      setHidden(false);
    }
  });

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        initial="visible"
        animate={hidden && !open ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="sticky top-0 z-50 w-full transition-colors duration-300"
        style={{
          background: 'rgba(0,0,0,0.90)',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="relative mx-auto flex h-14 max-w-245 items-center justify-between px-4 md:px-5">

          {/* Logo — left */}
          <Link href="/" className="flex shrink-0 items-center opacity-80 hover:opacity-100 transition-opacity duration-200">
            <Image
              src="/logo.png"
              alt="Digital Twin"
              width={100}
              height={100}
              className="object-contain"
            />
          </Link>

          {/* Desktop nav — centered */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item}
                href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className="text-[12px] font-normal leading-none tracking-[0.01em] text-[#f5f5f7]/80 transition-colors duration-150 hover:text-[#f5f5f7]"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA — right */}
          <div className="hidden md:flex items-center">
            <Link
              href="/demo"
              className="text-[12px] font-medium leading-none tracking-tight text-white bg-blue-600 px-4 py-1.5 rounded-full transition-all duration-150 hover:bg-blue-500 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            >
              Get IN
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="flex md:hidden h-14 w-14 items-center justify-center"
            aria-label="Toggle menu"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              {open ? (
                <path
                  d="M2 2L16 16M16 2L2 16"
                  stroke="#f5f5f7"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              ) : (
                <>
                  <line x1="1" y1="5" x2="17" y2="5" stroke="#f5f5f7" strokeWidth="1.4" strokeLinecap="round" />
                  <line x1="1" y1="9" x2="17" y2="9" stroke="#f5f5f7" strokeWidth="1.4" strokeLinecap="round" />
                  <line x1="1" y1="13" x2="17" y2="13" stroke="#f5f5f7" strokeWidth="1.4" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>

        </div>
      </motion.header>

      {/* Mobile full-screen overlay */}
      <div
        className={`fixed inset-0 z-40 flex flex-col md:hidden transition-all duration-300 ease-in-out ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        style={{
          background: 'rgba(29,29,31,0.98)',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          paddingTop: '56px',
        }}
      >
        <nav className="flex flex-col px-5 pt-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item}
              href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="border-b border-[#424245] py-4 text-[17px] font-normal text-[#f5f5f7] transition-colors hover:text-[#f5f5f7]/70"
            >
              {item}
            </Link>
          ))}
          <Link
            href="/demo"
            onClick={() => setOpen(false)}
            className="mt-6 flex items-center justify-center py-3 text-[15px] font-semibold text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
          >
            Get IN
          </Link>
        </nav>
      </div>
    </>
  );
}
