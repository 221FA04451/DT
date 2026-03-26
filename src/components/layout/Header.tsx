import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-black/80 backdrop-blur-2xl">
      <div className="mx-auto max-w-screen-2xl w-full flex h-14 items-center justify-between px-8">
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
          {['Dashboard', 'Product', 'Solutions', 'Resources', 'Pricing', 'Company'].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-sm font-medium tracking-wide text-zinc-400 transition-colors duration-200 hover:text-white"
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
          <button className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black transition-all duration-200 hover:bg-zinc-100 hover:scale-[1.03]">
            Book a Demo
          </button>
        </div>
      </div>
    </header>
  );
}
