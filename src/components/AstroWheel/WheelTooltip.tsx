'use client'

import type { PlanetPosition, AspectData } from '@/lib/astronomy'
import { ZODIAC_SIGNS } from '@/lib/zodiac'
import { calculateDistance } from '@/lib/distance'
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

function MoonProximityLabel({ km, t }: { km: number; t: (k: string) => string }) {
  if (km < 360_000) {
    return (
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {t('planet.nearPerigee')}
      </span>
    )
  }
  if (km > 404_000) {
    return (
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {t('planet.nearApogee')}
      </span>
    )
  }
  return null
}

function PlanetDetail({ planet, t, content }: { planet: PlanetPosition; t: (k: string) => string; content: ReturnType<typeof useContent> }) {
  const sign = ZODIAC_SIGNS.find(s => s.id === planet.zodiacSign)
  const insight = content?.planetMeanings?.[planet.id]?.[planet.zodiacSign]
  const dist = calculateDistance(planet.distanceAU)

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

      {/* Distance from Earth */}
      <div className="mb-4">
        <h3 className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          {t('planet.distanceFromEarth')}
        </h3>
        <div className="glass-card p-3 space-y-1.5">
          <p className="text-sm flex flex-wrap items-baseline gap-x-1">
            <span className="opacity-50">📏</span>
            <span className="font-medium" style={{ color: planet.colour }}>{dist.formattedKm}</span>
            <span style={{ color: 'var(--text-muted)' }}>km</span>
            <span style={{ color: 'var(--text-muted)' }}> · </span>
            <span className="font-medium" style={{ color: planet.colour }}>{dist.formattedMiles}</span>
            <span style={{ color: 'var(--text-muted)' }}>mi</span>
          </p>
          <p className="text-sm flex items-baseline gap-x-1">
            <span className="opacity-50">✦</span>
            <span className="font-medium" style={{ color: planet.colour }}>{dist.formattedLightTravel}</span>
            <span style={{ color: 'var(--text-muted)' }}>{t('planet.atSpeedOfLight')}</span>
          </p>
          {planet.id === 'moon' && <MoonProximityLabel km={dist.km} t={t} />}
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
      {/* Header */}
      <div className="text-center mb-5">
        <div className="text-4xl mb-2" style={{ color: sign.colour }}>{sign.glyph}</div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-white tracking-wide">
          {t(`zodiac.${signId}`).toUpperCase()}
        </h2>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
          {t(`element.${sign.element}`)} · {t(`modality.${sign.modality}`)}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {sign.dateRange}
        </p>
      </div>

      <div className="w-full h-px bg-white/8 mb-4" />

      {/* Energy description */}
      {signInsight && (
        <>
          <h3 className="text-[10px] uppercase tracking-widest mb-2.5" style={{ color: 'var(--text-muted)' }}>
            {t('sign.whatItFeelsLike')}
          </h3>
          <p className="font-[family-name:var(--font-display)] text-sm italic leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
            &ldquo;{signInsight.energyDescription}&rdquo;
          </p>

          <div className="w-full h-px bg-white/8 mb-4" />
        </>
      )}

      {/* Planets currently in this sign */}
      <h3 className="text-[10px] uppercase tracking-widest mb-2.5" style={{ color: 'var(--text-muted)' }}>
        {t('sign.planetsHere')}
      </h3>
      {planetsInSign.length > 0 ? (
        <div className="space-y-2.5 mb-5">
          {planetsInSign.map(p => (
            <div key={p.id} className="flex items-start gap-3">
              <span className="text-lg" style={{ color: p.colour }}>{p.glyph}</span>
              <div>
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  {t(`planet.${p.id}`)} at {p.degreeInSign}°
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm italic mb-5" style={{ color: 'var(--text-muted)' }}>
          {signInsight?.noPlanetsMessage}
        </p>
      )}

      {signInsight && (
        <>
          <div className="w-full h-px bg-white/8 mb-4" />

          {/* Sign details */}
          <h3 className="text-[10px] uppercase tracking-widest mb-2.5" style={{ color: 'var(--text-muted)' }}>
            {t('sign.details')}
          </h3>
          <div className="space-y-2 text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex justify-between gap-4">
              <span style={{ color: 'var(--text-muted)' }}>{t('sign.element')}</span>
              <span className="text-right">{t(`element.${sign.element}`)} — {signInsight.elementDescription}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span style={{ color: 'var(--text-muted)' }}>{t('sign.modality')}</span>
              <span className="text-right">{t(`modality.${sign.modality}`)} — {signInsight.modalityDescription}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span style={{ color: 'var(--text-muted)' }}>{t('sign.rulingPlanet')}</span>
              <span>{signInsight.rulingPlanet}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span style={{ color: 'var(--text-muted)' }}>{t('sign.bodyArea')}</span>
              <span className="text-right">{signInsight.bodyArea}</span>
            </div>
            <div>
              <span className="block mb-1" style={{ color: 'var(--text-muted)' }}>{t('sign.themes')}</span>
              <span>{signInsight.themes}</span>
            </div>
            <div>
              <span className="block mb-1" style={{ color: 'var(--text-muted)' }}>{t('sign.shadow')}</span>
              <span>{signInsight.shadow}</span>
            </div>
          </div>

          <div className="w-full h-px bg-white/8 mb-4" />

          {/* Sound healing connection */}
          <h3 className="text-[10px] uppercase tracking-widest mb-2.5" style={{ color: 'var(--text-muted)' }}>
            {t('sign.soundHealing')}
          </h3>
          <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex justify-between gap-4">
              <span style={{ color: 'var(--text-muted)' }}>{t('sign.frequency')}</span>
              <span>{signInsight.frequency}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span style={{ color: 'var(--text-muted)' }}>{t('sign.instruments')}</span>
              <span className="text-right">{signInsight.instruments}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span style={{ color: 'var(--text-muted)' }}>{t('sign.keynote')}</span>
              <span>{signInsight.keynote}</span>
            </div>
          </div>
        </>
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
