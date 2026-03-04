'use client'

interface ShimmerProps {
  className?: string
}

export default function Shimmer({ className = '' }: ShimmerProps) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className}`}
      style={{
        background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s infinite',
      }}
    />
  )
}
