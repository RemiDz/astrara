import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Astrara · Learning Reference',
  robots: 'noindex, nofollow',
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
