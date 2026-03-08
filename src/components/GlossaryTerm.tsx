'use client'

import { useState, useRef, useEffect, useCallback, createContext, useContext } from 'react'
import { getGlossaryTerm } from '@/data/glossary'
import { useLanguage } from '@/i18n/LanguageContext'

// Global context so only one tooltip is open at a time
const TooltipContext = createContext<{
  openKey: string | null
  setOpenKey: (key: string | null) => void
}>({ openKey: null, setOpenKey: () => {} })

export function GlossaryTooltipProvider({ children }: { children: React.ReactNode }) {
  const [openKey, setOpenKey] = useState<string | null>(null)

  useEffect(() => {
    if (!openKey) return
    const handleClick = () => setOpenKey(null)
    // Delay so the current click event doesn't immediately close
    const id = setTimeout(() => {
      document.addEventListener('click', handleClick, { once: true })
    }, 0)
    return () => {
      clearTimeout(id)
      document.removeEventListener('click', handleClick)
    }
  }, [openKey])

  return (
    <TooltipContext.Provider value={{ openKey, setOpenKey }}>
      {children}
    </TooltipContext.Provider>
  )
}

interface GlossaryTermProps {
  termKey: string
  children: React.ReactNode
}

export default function GlossaryTerm({ termKey, children }: GlossaryTermProps) {
  const { lang } = useLanguage()
  const { openKey, setOpenKey } = useContext(TooltipContext)
  const spanRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const isOpen = openKey === termKey

  const term = getGlossaryTerm(termKey)
  if (!term) return <>{children}</>

  const localized = lang === 'lt' ? term.lt : term.en

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOpenKey(isOpen ? null : termKey)
  }

  return (
    <span ref={spanRef} className="relative inline" style={{ cursor: 'help' }}>
      <span
        onClick={handleClick}
        className="border-b border-dotted border-current/30"
      >
        {children}
      </span>
      {isOpen && (
        <span
          ref={tooltipRef}
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-[280px] pointer-events-auto"
          style={{
            animation: 'glossaryFadeIn 200ms ease forwards',
          }}
        >
          <span
            className="block rounded-xl px-4 py-3 border border-white/10 text-left"
            style={{
              background: 'rgba(15, 15, 25, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <span className="block text-sm font-bold text-white mb-1">
              {term.symbol} {localized.name}
            </span>
            <span className="block text-[13px] leading-relaxed text-white/70">
              {localized.description}
            </span>
          </span>
          {/* Arrow */}
          <span className="block w-0 h-0 mx-auto border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white/10" />
        </span>
      )}
    </span>
  )
}
