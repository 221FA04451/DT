'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const NAV_ITEMS = ['Home','Solutions', 'Resources', 'Company'];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 z-50 w-full transition-colors duration-300"
        style={{
          background: scrolled
            ? 'rgba(0,0,0,0.85)'
            : 'rgba(0,0,0,1)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="relative mx-auto flex h-11 max-w-[980px] items-center justify-between px-4 md:px-5">

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
                href={`/${item.toLowerCase()}`}
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
              className="text-[12px] font-normal leading-none tracking-[0.01em] text-[#f5f5f7]/80 transition-colors duration-150 hover:text-[#f5f5f7]"
            >
              Get IN
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="flex md:hidden h-11 w-11 items-center justify-center"
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
      </header>

      {/* Mobile full-screen overlay */}
      <div
        className={`fixed inset-0 z-40 flex flex-col md:hidden transition-all duration-300 ease-in-out ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        style={{
          background: 'rgba(29,29,31,0.96)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          paddingTop: '44px',
        }}
      >
        <nav className="flex flex-col px-5 pt-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="border-b border-[#424245] py-4 text-[17px] font-normal text-[#f5f5f7] transition-colors hover:text-[#f5f5f7]/70"
            >
              {item}
            </Link>
          ))}
          <Link
            href="/demo"
            onClick={() => setOpen(false)}
            className="pt-6 text-[17px] font-normal text-[#2997ff]"
          >
            Get IN
          </Link>
        </nav>
      </div>
    </>
  );
}
