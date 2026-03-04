'use client'

import { motion } from 'framer-motion'
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
    >
      <GlassCard onClick={onClick} className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span style={{ color: aspect.colour }} className="text-lg">{aspect.planet1Glyph}</span>
          <span style={{ color: aspect.colour }} className="text-sm">{aspect.symbol}</span>
          <span style={{ color: aspect.colour }} className="text-lg">{aspect.planet2Glyph}</span>
          <span className="text-sm text-white ml-1">
            {t(`planet.${aspect.planet1}`)} {t(`aspect.${aspect.type}`).toLowerCase()} {t(`planet.${aspect.planet2}`)}
          </span>
        </div>

        <p className="font-[family-name:var(--font-display)] text-sm italic leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          &ldquo;{specificInsight || generalInsight?.generalMeaning || ''}&rdquo;
        </p>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {aspect.isApplying ? t('aspect.applying') : t('aspect.separating')} · {aspect.orb}°
          </span>
        </div>
      </GlassCard>
    </motion.div>
  )
}
