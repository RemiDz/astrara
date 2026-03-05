import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Astrara Content Studio',
  robots: 'noindex, nofollow',
}

export default function PromoLayout({ children }: { children: React.ReactNode }) {
  return children
}
