'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const NAV_ITEMS = ['Dashboard', 'Product', 'Solutions', 'Resources', 'Pricing', 'Company'];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-black/90 backdrop-blur-2xl">
        <div className="mx-auto max-w-screen-2xl w-full flex h-14 items-center justify-between px-4 md:px-8">

          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3 transition-opacity">
            <Image
              src="/logo.png"
              alt="Digital Twin Logo"
              width={80}
              height={80}
              className="object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-sm font-medium tracking-wide text-zinc-400 transition-colors duration-200 hover:text-white"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-zinc-300 transition-colors hover:text-white"
            >
              Sign In
            </Link>
            <button className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black transition-all duration-200 hover:bg-zinc-100 hover:scale-[1.03]">
              Book a Demo
            </button>
          </div>

          {/* Mobile: Book a Demo + Hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <button className="rounded-full bg-white px-4 py-2 text-xs font-bold text-black">
              Book a Demo
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="flex flex-col justify-center items-center w-8 h-8 gap-1.5"
              aria-label="Toggle menu"
            >
              <span className={`block h-0.5 w-5 bg-white transition-all duration-300 ${open ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-5 bg-white transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 bg-white transition-all duration-300 ${open ? '-translate-y-2 -rotate-45' : ''}`} />
            </button>
          </div>

        </div>

        {/* Mobile drawer */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-screen' : 'max-h-0'}`}>
          <nav className="flex flex-col px-4 pb-4 pt-2 border-t border-white/[0.06] bg-black/95">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium text-zinc-400 border-b border-white/[0.04] hover:text-white transition-colors"
              >
                {item}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="py-3 text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
