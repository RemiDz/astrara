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
        background: 'rgba(255, 255, 255, 0.025)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
      }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
