'use client'

import type { AspectData } from '@/lib/astronomy'
import { useTranslation } from '@/i18n/useTranslation'
import { useContent } from '@/i18n/useContent'
import GlassCard from '@/components/ui/GlassCard'

interface AspectHighlightProps {
  aspect: AspectData
  index: number
  onClick: () => void
}

export default function AspectHighlight({ aspect, index, onClick }: AspectHighlightProps) {
  const { t } = useTranslation()
  const content = useContent()

  const pairKey1 = `${aspect.planet1}-${aspect.planet2}`
  const pairKey2 = `${aspect.planet2}-${aspect.planet1}`
  const specificInsight = content?.planetPairAspects?.[pairKey1]?.[aspect.type]
    ?? content?.planetPairAspects?.[pairKey2]?.[aspect.type]
  const generalInsight = content?.aspectMeanings?.[aspect.type]

  return (
    <GlassCard onClick={onClick}>
      <div className="flex items-center gap-2 mb-2">
        <span style={{ color: aspect.colour }} className="text-lg">{aspect.planet1Glyph}</span>
        <span style={{ color: aspect.colour }} className="text-sm">{aspect.symbol}</span>
        <span style={{ color: aspect.colour }} className="text-lg">{aspect.planet2Glyph}</span>
        <span className="text-sm text-white/85 ml-1">
          {t(`planet.${aspect.planet1}`)} {t(`aspect.${aspect.type}`).toLowerCase()} {t(`planet.${aspect.planet2}`)}
        </span>
      </div>

      <p className="text-[13px] text-white/40 leading-relaxed">
        {specificInsight || generalInsight?.generalMeaning || ''}
      </p>

      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-white/25">
          {aspect.isApplying ? t('aspect.applying') : t('aspect.separating')} · {aspect.orb}°
        </span>
      </div>
    </GlassCard>
  )
}
