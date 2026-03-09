'use client'

import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { useTranslation } from '@/i18n/useTranslation'
import { generateReadingPdf } from './PdfExport'
import type { ScopeState } from './ScopeSelector'
import type { ReadingStyle } from './StyleSelector'

interface ReadingOutputProps {
  reading: string
  isGenerating: boolean
  clientName: string
  readingLanguage: 'en' | 'lt'
  style: ReadingStyle
  signOrDob: string
  scope: ScopeState
  onNewReading: () => void
}

const LOADING_MESSAGES_EN = [
  'Analysing current transits...',
  'Mapping the months ahead...',
  'Composing your reading...',
]
const LOADING_MESSAGES_LT = [
  'Analizuojame tranzitus...',
  'Zemelapiuojame menesius...',
  'Rasome skaitymą...',
]

const markdownComponents = {
  h2: ({ children }: { children?: React.ReactNode }) => (
    <div className="mt-8 mb-4 first:mt-0">
      <div
        className="px-5 py-3 rounded-xl"
        style={{
          background: 'rgba(255,255,255,0.03)',
          borderLeft: '3px solid rgba(139,92,246,0.5)',
        }}
      >
        <h2 className="text-white/85 text-base font-medium font-[family-name:var(--font-display)] uppercase tracking-wide">
          {children}
        </h2>
      </div>
    </div>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-white/75 text-sm font-medium mt-5 mb-2 uppercase tracking-wide">
      {children}
    </h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-white/65 text-[14px] leading-relaxed mb-3">
      {children}
    </p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="text-white/90 font-medium">{children}</strong>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="space-y-2 my-3">{children}</ul>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="text-white/65 text-[14px] leading-relaxed flex gap-2">
      <span className="text-white/25 mt-0.5">{'\u2192'}</span>
      <span>{children}</span>
    </li>
  ),
}

export default function ReadingOutput({
  reading, isGenerating, clientName, readingLanguage,
  style, signOrDob, scope, onNewReading,
}: ReadingOutputProps) {
  const { t, lang } = useTranslation()
  const [copied, setCopied] = useState(false)
  const [loadingIdx, setLoadingIdx] = useState(0)
  const outputRef = useRef<HTMLDivElement>(null)

  // Cycle loading messages
  useEffect(() => {
    if (!isGenerating) { setLoadingIdx(0); return }
    const interval = setInterval(() => {
      setLoadingIdx(prev => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [isGenerating])

  // Scroll to output when reading arrives
  useEffect(() => {
    if (reading && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [reading])

  async function handleCopy() {
    const plain = reading
      .replace(/^##\s+/gm, '')
      .replace(/^###\s+/gm, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
    await navigator.clipboard.writeText(plain)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handlePdf() {
    const scopeLabels: string[] = []
    if (scope.currentSituation) scopeLabels.push('Current Situation')
    if (scope.thisMonth) scopeLabels.push('This Month')
    if (scope.nextThreeMonths) scopeLabels.push('Next 3 Months')
    if (scope.thisYear) scopeLabels.push(`${new Date().getFullYear()} Overview`)
    if (scope.nextYear) scopeLabels.push(`${new Date().getFullYear() + 1} Preview`)

    const styleLabels: Record<string, string> = {
      accessible: 'Accessible',
      practitioner: 'Practitioner',
      mystical: 'Deep Mystical',
    }

    generateReadingPdf({
      reading,
      clientName: clientName || undefined,
      signOrDob,
      scopeList: scopeLabels,
      style: styleLabels[style] || style,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    })
  }

  if (!isGenerating && !reading) return null

  const loadingMessages = lang === 'lt' ? LOADING_MESSAGES_LT : LOADING_MESSAGES_EN
  const nameDisplay = clientName || (lang === 'lt' ? 'kliento' : 'you')

  return (
    <div ref={outputRef}>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-white/15 text-xs">——</span>
        <span className="text-white/30 text-xs font-medium uppercase tracking-widest">
          {reading ? (clientName ? `${t('studio.readingFor')} ${clientName}` : t('studio.yourCosmicReading')) : ''}
        </span>
        <span className="text-white/15 text-xs">——</span>
      </div>

      {/* Loading State */}
      {isGenerating && (
        <div
          className="p-8 rounded-2xl border text-center"
          style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-white/20 animate-pulse">✦</span>
            <span className="text-white/10">· · ·</span>
            <span className="text-white/20 animate-pulse" style={{ animationDelay: '0.5s' }}>✦</span>
            <span className="text-white/10">· · ·</span>
            <span className="text-white/20 animate-pulse" style={{ animationDelay: '1s' }}>✦</span>
          </div>
          <p className="text-white/50 text-sm mb-3">
            {t('studio.readingStarsFor')} {nameDisplay}...
          </p>
          <p className="text-white/30 text-xs">{loadingMessages[loadingIdx]}</p>
          <div className="mt-4 mx-auto w-48 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${((loadingIdx + 1) / 3) * 100}%`,
                background: 'linear-gradient(90deg, rgba(139,92,246,0.3), rgba(139,92,246,0.6))',
              }}
            />
          </div>
        </div>
      )}

      {/* Reading Display */}
      {reading && !isGenerating && (
        <>
          <div
            className="p-6 sm:p-8 rounded-2xl border"
            style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}
          >
            <ReactMarkdown components={markdownComponents}>
              {reading}
            </ReactMarkdown>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center py-4">
            <span className="text-white/10">✦</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCopy}
              className="text-xs px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/10 transition-all cursor-pointer active:scale-95"
            >
              {copied ? t('studio.copied') : t('studio.copyAll')}
            </button>
            <button
              onClick={handlePdf}
              className="text-xs px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/10 transition-all cursor-pointer active:scale-95"
            >
              {t('studio.downloadPdf')}
            </button>
            <button
              onClick={onNewReading}
              className="text-xs px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/10 transition-all cursor-pointer active:scale-95"
            >
              {t('studio.newReading')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
