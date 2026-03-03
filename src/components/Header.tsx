'use client';

import Link from 'next/link';
import LanguageToggle from './LanguageToggle';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 md:px-6 bg-[var(--space)]/80 backdrop-blur-sm border-b border-[var(--border)]/50">
      <Link
        href="/"
        className="text-sm font-medium tracking-[0.2em] uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-sans"
      >
        ASTRARA
      </Link>
      <LanguageToggle />
    </header>
  );
}
