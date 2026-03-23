import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#18181b]/90 backdrop-blur-2xl">
      <div className="w-full flex h-24 items-center justify-between px-8 lg:px-16">
        {/* Logo and Brand */}
        <Link href="/" className="group flex items-center gap-3 transition-opacity">
          <Image
            src="/logo.png"
            alt="Digital Twin Logo"
            width={80}
            height={80}
            className="object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        
        {/* Corporate SaaS Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {['Product', 'Solutions', 'Resources', 'Pricing', 'Company'].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-sm font-medium tracking-wide text-zinc-400 transition-all duration-300 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden text-sm font-semibold text-zinc-300 transition-colors hover:text-white sm:block"
          >
            Sign In
          </Link>
          <button className="relative overflow-hidden rounded-full bg-cyan-500 px-6 py-2.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 hover:scale-105 hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]">
            <span className="relative z-10">Book a Demo</span>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100"></div>
          </button>
        </div>
      </div>
    </header>
  );
}
