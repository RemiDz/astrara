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
      className={`glass-card rounded-2xl transition-colors duration-200 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
