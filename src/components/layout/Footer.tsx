import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full bg-black text-zinc-500 text-[11px] font-sans antialiased border-t border-white/[0.06]">
      <div className="w-full px-8 py-12 lg:px-16">
        {/* Logo / Breadcrumb */}
        <div className="mb-8">
          <Link href="/" className="group flex items-center gap-3 transition-opacity">
            <Image
              src="/logo.png"
              alt="Digital Twin Logo"
              width={80}
              height={80}
              className="object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        </div>
        
        {/* Directory Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 mb-8">
          {/* Column 1 */}
          <div>
            <h3 className="font-semibold text-white mb-2 tracking-wide text-[12px]">Explore</h3>
            <ul className="flex flex-col gap-1.5">
              {['Features', 'Models', 'Solutions', 'Pricing'].map((link) => (
                <li key={link}>
                  <Link href="#" className="hover:text-white transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-semibold text-white mb-2 tracking-wide text-[12px]">Account</h3>
            <ul className="flex flex-col gap-1.5">
              {['Manage Your ID', 'Store Account', 'Cloud.com'].map((link) => (
                <li key={link}>
                  <Link href="#" className="hover:text-white transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-semibold text-white mb-2 tracking-wide text-[12px]">Company</h3>
            <ul className="flex flex-col gap-1.5">
              {['About Digital Twin', 'Careers', 'Ethics'].map((link) => (
                <li key={link}>
                  <Link href="#" className="hover:text-white transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="font-semibold text-white mb-2 tracking-wide text-[12px]">Support</h3>
            <ul className="flex flex-col gap-1.5">
              {['Contact Us', 'Documentation', 'Community'].map((link) => (
                <li key={link}>
                  <Link href="#" className="hover:text-white transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="border-t border-white/[0.06] pt-4 flex flex-col md:flex-row items-baseline justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 text-left">
            <p>Copyright © {new Date().getFullYear()} Digital Twin Inc. All rights reserved.</p>
            <div className="hidden md:flex items-center gap-2.5">
              {['Privacy Policy', 'Terms of Use', 'Legal', 'Site Map'].map((link, idx, arr) => (
                <span key={link} className="flex items-center gap-2.5">
                  <Link href="#" className="hover:text-white transition-colors text-nowrap">{link}</Link>
                  {idx < arr.length - 1 && <span className="w-px h-3 bg-white/10" />}
                </span>
              ))}
            </div>
          </div>
          <Link href="#" className="hover:text-white transition-colors text-nowrap self-start md:self-auto uppercase">
            United States
          </Link>
        </div>
      </div>
    </footer>
  );
}
