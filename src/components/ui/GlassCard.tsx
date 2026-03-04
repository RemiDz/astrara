'use client'

import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function GlassCard({ children, className = '', onClick }: GlassCardProps) {
  return (
    <div
      className={`rounded-2xl overflow-hidden transition-colors duration-200 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.08) 0%, rgba(88, 28, 135, 0.04) 100%)',
        border: '1px solid rgba(147, 197, 253, 0.08)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
      }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
