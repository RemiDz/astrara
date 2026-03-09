'use client'

import { useEffect, useMemo } from 'react'
import { getPlanetPositions, getMoonData } from '@/lib/astronomy'
import { calculateAspects } from '@/lib/aspects'
import { LanguageProvider } from '@/i18n/LanguageContext'
import { useLanguage } from '@/i18n/LanguageContext'
import { useTranslation } from '@/i18n/useTranslation'
import LanguageToggle from '@/components/LanguageToggle'
import SkyGlance from '@/components/SocialStudio/SkyGlance'
import TikTokHooks from '@/components/SocialStudio/TikTokHooks'
import InstagramCaptions from '@/components/SocialStudio/InstagramCaptions'
import HashtagSets from '@/components/SocialStudio/HashtagSets'
import AiCaption from '@/components/SocialStudio/AiCaption'
import {
  generateHooks,
  generateReelCaption,
  generatePostCaption,
  generateStoryOverlays,
  generateHashtagSets,
} from '@/lib/social-content'

export default function Page() {
  return (
    <LanguageProvider>
      <SocialStudioPage />
    </LanguageProvider>
  )
}

function SocialStudioPage() {
  const { t } = useTranslation()
  const { lang } = useLanguage()

  // Enable text selection
  useEffect(() => {
    document.body.classList.add('allow-select')
    return () => { document.body.classList.remove('allow-select') }
  }, [])

  // Calculate today's data
  const now = useMemo(() => new Date(), [])
  const positions = useMemo(() => getPlanetPositions(now, 0, 0), [now])
  const moonData = useMemo(() => getMoonData(now), [now])
  const aspects = useMemo(() => calculateAspects(positions), [positions])

  // Generate all content
  const hooks = useMemo(() => generateHooks(positions, moonData, aspects, lang), [positions, moonData, aspects, lang])
  const reelCaption = useMemo(() => generateReelCaption(positions, moonData, aspects, lang), [positions, moonData, aspects, lang])
  const postCaption = useMemo(() => generatePostCaption(positions, moonData, aspects, lang), [positions, moonData, aspects, lang])
  const storyOverlays = useMemo(() => generateStoryOverlays(positions, moonData, aspects, lang), [positions, moonData, aspects, lang])
  const hashtagSets = useMemo(() => generateHashtagSets(positions, moonData), [positions, moonData])

  const dateStr = now.toLocaleDateString(lang === 'lt' ? 'lt-LT' : 'en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <div className="min-h-screen text-white" style={{ background: 'var(--bg-deep, #07070F)' }}>
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-semibold tracking-wide text-white/90">
              <span className="text-white/25 mr-2">{'\u2726'}</span>
              ASTRARA{' '}
              <span className="text-white/30 font-normal">{t('social.title')}</span>
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-white/25 text-sm hidden sm:block">{dateStr}</span>
              <LanguageToggle />
            </div>
          </div>
        </div>

        {/* ── TODAY'S SKY ── */}
        <SectionHeader label={t('social.skyGlance')} />
        <div className="mb-8">
          <SkyGlance positions={positions} moonData={moonData} aspects={aspects} />
        </div>

        {/* ── TIKTOK HOOKS ── */}
        <SectionHeader label={`${t('social.tiktokHooks')} (${t('social.tapToCopy')})`} />
        <div className="mb-8">
          <TikTokHooks hooks={hooks} />
        </div>

        {/* ── INSTAGRAM CAPTIONS ── */}
        <SectionHeader label={`${t('social.instagramCaptions')} (${t('social.tapToCopy')})`} />
        <div className="mb-8">
          <InstagramCaptions
            reelCaption={reelCaption}
            postCaption={postCaption}
            storyOverlays={storyOverlays}
          />
        </div>

        {/* ── HASHTAG SETS ── */}
        <SectionHeader label={`${t('social.hashtagSets')} (${t('social.tapToCopy')})`} />
        <div className="mb-8">
          <HashtagSets sets={hashtagSets} />
        </div>

        {/* ── AI ENHANCED CAPTION ── */}
        <SectionHeader label={t('social.aiCaption')} />
        <div className="mb-12">
          <AiCaption positions={positions} moonData={moonData} />
        </div>

      </div>
    </div>
  )
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-white/15 text-xs">{'\u2014\u2014'}</span>
      <span className="text-white/30 text-xs font-medium uppercase tracking-widest">{label}</span>
      <span className="text-white/15 text-xs">{'\u2014\u2014'}</span>
    </div>
  )
}
