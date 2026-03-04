'use client'

import type { PlanetPosition, AspectData } from '@/lib/astronomy'
import { ZODIAC_SIGNS } from '@/lib/zodiac'
import { useTranslation } from '@/i18n/useTranslation'
import { useContent } from '@/i18n/useContent'
import Modal from '@/components/ui/Modal'

type TooltipData =
  | { type: 'planet'; data: PlanetPosition }
  | { type: 'sign'; data: string }
  | { type: 'aspect'; data: AspectData }
  | null

interface WheelTooltipProps {
  tooltip: TooltipData
  planets: PlanetPosition[]
  onClose: () => void
}

export default function WheelTooltip({ tooltip, planets, onClose }: WheelTooltipProps) {
  const { t } = useTranslation()
  const content = useContent()

  if (!tooltip) return null

  return (
    <Modal isOpen={!!tooltip} onClose={onClose}>
      {tooltip.type === 'planet' && (
        <PlanetDetail planet={tooltip.data} t={t} content={content} />
      )}
      {tooltip.type === 'sign' && (
        <SignDetail signId={tooltip.data} planets={planets} t={t} content={content} />
      )}
      {tooltip.type === 'aspect' && (
        <AspectDetail aspect={tooltip.data} t={t} content={content} />
      )}
    </Modal>
  )
}

function PlanetDetail({ planet, t, content }: { planet: PlanetPosition; t: (k: string) => string; content: ReturnType<typeof useContent> }) {
  const sign = ZODIAC_SIGNS.find(s => s.id === planet.zodiacSign)
  const insight = content?.planetMeanings?.[planet.id]?.[planet.zodiacSign]

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl" style={{ color: planet.colour }}>{planet.glyph}</span>
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-white">
            {t(`planet.${planet.id}`)}
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            {t(`zodiac.${planet.zodiacSign}`)} {sign?.glyph} {planet.degreeInSign}°
            {planet.isRetrograde && (
              <span className="ml-2 text-red-400 text-sm">
                {t('planet.retrograde')} Rx
              </span>
            )}
          </p>
        </div>
      </div>

      {insight && (
        <>
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
              {t('planet.whatThisMeans')}
            </h3>
            <p className="font-[family-name:var(--font-display)] text-lg italic mb-3" style={{ color: 'var(--text-primary)' }}>
              &ldquo;{insight.oneLiner}&rdquo;
            </p>
            <div className="space-y-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {insight.fullInsight.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          <div className="glass-card p-3 mb-4">
            <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
              {t('planet.forYourDay')}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {insight.practicalTip}
            </p>
          </div>

          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {t('planet.duration')} {insight.approxDuration}
          </p>
        </>
      )}

      {planet.riseTime && (
        <div className="flex gap-4 mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>{t('planet.riseTime')}: {planet.riseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {planet.setTime && (
            <span>{t('planet.setTime')}: {planet.setTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          )}
        </div>
      )}
    </div>
  )
}

function SignDetail({ signId, planets, t, content }: { signId: string; planets: PlanetPosition[]; t: (k: string) => string; content: ReturnType<typeof useContent> }) {
  const sign = ZODIAC_SIGNS.find(s => s.id === signId)
  const planetsInSign = planets.filter(p => p.zodiacSign === signId)
  const signInsight = content?.signMeanings?.[signId]

  if (!sign) return null

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl" style={{ color: sign.colour }}>{sign.glyph}</span>
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-white">
            {t(`zodiac.${signId}`)}
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {sign.dateRange}
          </p>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <span className="glass-card px-2 py-1 text-xs" style={{ color: sign.colour }}>
          {t('sign.element')}: {t(`element.${sign.element}`)}
        </span>
        <span className="glass-card px-2 py-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
          {t('sign.modality')}: {t(`modality.${sign.modality}`)}
        </span>
      </div>

      {signInsight && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
            {t('sign.whatItFeelsLike')}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {signInsight.whatItFeelsLike}
          </p>
        </div>
      )}

      {planetsInSign.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
            {t('sign.planetsHere')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {planetsInSign.map(p => (
              <span key={p.id} className="glass-card px-2 py-1 text-sm" style={{ color: p.colour }}>
                {p.glyph} {t(`planet.${p.id}`)} {p.degreeInSign}°
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function AspectDetail({ aspect, t, content }: { aspect: AspectData; t: (k: string) => string; content: ReturnType<typeof useContent> }) {
  const generalInsight = content?.aspectMeanings?.[aspect.type]
  const pairKey1 = `${aspect.planet1}-${aspect.planet2}`
  const pairKey2 = `${aspect.planet2}-${aspect.planet1}`
  const specificInsight = content?.planetPairAspects?.[pairKey1]?.[aspect.type]
    ?? content?.planetPairAspects?.[pairKey2]?.[aspect.type]

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl" style={{ color: aspect.colour }}>{aspect.symbol}</span>
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-white">
            {t(`planet.${aspect.planet1}`)} {t(`aspect.${aspect.type}`)} {t(`planet.${aspect.planet2}`)}
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {aspect.planet1Glyph} {aspect.symbol} {aspect.planet2Glyph} · {t('aspect.orb' in aspect ? (aspect.isApplying ? 'aspect.applying' : 'aspect.separating') : 'aspect.applying')} · {aspect.orb}°
          </p>
        </div>
      </div>

      {specificInsight && (
        <p className="font-[family-name:var(--font-display)] text-lg italic mb-4 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          &ldquo;{specificInsight}&rdquo;
        </p>
      )}

      {generalInsight && (
        <div className="glass-card p-3">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {generalInsight.generalMeaning}
          </p>
        </div>
      )}
    </div>
  )
}

export type { TooltipData }
