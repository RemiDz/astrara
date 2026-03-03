'use client';

import Link from 'next/link';
import LanguageToggle from './LanguageToggle';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-5 bg-[#04040A]/90 backdrop-blur-sm border-b border-[#1E1F2E]/50">
      <Link
        href="/"
        className="text-sm font-medium tracking-[0.15em] uppercase text-[#6B7194] hover:text-[#E8ECF4] transition-colors font-sans"
      >
        ASTRARA
      </Link>
      <LanguageToggle />
    </header>
  );
}
