'use client'

import { useState } from 'react'
import type { PlanetPosition, MoonData } from '@/lib/astronomy'
import { ZODIAC_SIGNS } from '@/lib/zodiac'
import { useTranslation } from '@/i18n/useTranslation'
import { useLanguage } from '@/i18n/LanguageContext'

interface AiCaptionProps {
  positions: PlanetPosition[]
  moonData: MoonData
}

export default function AiCaption({ positions, moonData }: AiCaptionProps) {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const [caption, setCaption] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  async function generate() {
    setIsGenerating(true)
    setCaption('')

    try {
      const response = await fetch('/api/social-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          positions: positions.map(p => ({
            glyph: p.glyph,
            name: p.name,
            sign: ZODIAC_SIGNS.find(z => z.id === p.zodiacSign)?.name ?? p.zodiacSign,
            degree: p.degreeInSign,
            retrograde: p.isRetrograde,
          })),
          moonPhase: moonData.phase,
          moonIllumination: Math.round(moonData.illumination * 100),
          lang,
        }),
      })

      if (!response.ok) throw new Error('Failed')
      const data = await response.json()
      setCaption(data.caption)
    } catch {
      setCaption('')
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(caption)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="p-5 sm:p-6 rounded-2xl border"
      style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}
    >
      <p className="text-xs text-white/30 mb-3">
        {t('social.aiCaptionDesc')}
      </p>

      <button
        onClick={generate}
        disabled={isGenerating}
        className="px-5 py-2.5 rounded-xl text-sm transition-all cursor-pointer active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: isGenerating
            ? 'rgba(139,92,246,0.1)'
            : 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(139,92,246,0.15))',
          border: '1px solid rgba(139,92,246,0.3)',
          color: 'rgba(255,255,255,0.85)',
        }}
      >
        {isGenerating ? (
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            {t('social.generating')}
          </span>
        ) : (
          <span>\u2726 {t('social.generateAi')}</span>
        )}
      </button>

      {caption && !isGenerating && (
        <div className="mt-4">
          <pre className="text-white/65 text-sm whitespace-pre-wrap font-[family-name:var(--font-body)] leading-relaxed mb-3">
            {caption}
          </pre>
          <button
            onClick={handleCopy}
            className="text-xs text-white/25 hover:text-purple-400 transition-colors cursor-pointer"
          >
            {copied ? `\u2713 ${t('social.copied')}` : `\u{1F4CB} ${t('social.copy')}`}
          </button>
        </div>
      )}
    </div>
  )
}
