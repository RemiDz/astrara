'use client'

import { useTranslation } from '@/i18n/useTranslation'
import type { PlanetPosition } from '@/lib/astronomy'
import { getDominantElement } from './CrystallineCore'
import Modal from '@/components/ui/Modal'

type Element = 'fire' | 'earth' | 'air' | 'water' | 'neutral'

const QUALITIES: Record<Element, Record<string, string>> = {
  fire:    { en: 'courage and directed will',        lt: 'drąsos ir nukreiptos valios' },
  earth:   { en: 'stability and grounded presence',  lt: 'stabilumo ir įžemintos buvimo būsenos' },
  air:     { en: 'clarity and open communication',   lt: 'aiškumo ir atviro bendravimo' },
  water:   { en: 'depth and emotional attunement',   lt: 'gelmės ir emocinio suderinimo' },
  neutral: { en: 'balanced cosmic presence',          lt: 'subalansuotos kosminės būsenos' },
}

const GUIDANCE: Record<Element, Record<string, string>> = {
  fire:    { en: 'act decisively and trust your instincts',          lt: 'veikti ryžtingai ir pasitikėti savo instinktais' },
  earth:   { en: 'ground your vision into practical steps',          lt: 'įžeminti savo viziją praktiniais žingsniais' },
  air:     { en: 'speak your truth and stay curious',                lt: 'kalbėti savo tiesą ir likti smalsiems' },
  water:   { en: 'honour your feelings and deepen your connections', lt: 'gerbti savo jausmus ir gilinti ryšius' },
  neutral: { en: 'stay open and observe the cosmic balance',         lt: 'likti atviriems ir stebėti kosminę pusiausvyrą' },
}

interface CrystalMessageProps {
  isOpen: boolean
  onClose: () => void
  planets: PlanetPosition[]
  date: Date
}

export default function CrystalMessage({ isOpen, onClose, planets, date }: CrystalMessageProps) {
  const { t, lang } = useTranslation()

  const element = getDominantElement(planets)
  const elementName = t(`element.${element === 'neutral' ? 'air' : element}`)
  const quality = QUALITIES[element][lang] ?? QUALITIES[element].en
  const guidance = GUIDANCE[element][lang] ?? GUIDANCE[element].en

  const dateStr = date.toLocaleDateString(lang === 'lt' ? 'lt-LT' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const title = lang === 'lt' ? 'Kosminė Kristalizacija' : 'Cosmic Crystallisation'

  const subtitle = lang === 'lt'
    ? `${elementName} energija dominuoja danguje šiandien`
    : `${elementName} energy dominates today's sky`

  const body = lang === 'lt'
    ? `${planets.length} dangaus kūnai nukreipia savo šviesą per ${elementName.toLowerCase()} ženklus šiandien, kristalizuodami ${quality} lauką. Kosmosas kviečia jus ${guidance}.`
    : `${planets.length} celestial bodies channel their light through ${elementName} signs today, crystallising a field of ${quality}. The cosmos invites you to ${guidance}.`

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <h2 className="font-[family-name:var(--font-display)] text-lg text-white/90 mb-1">
          {title}
        </h2>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-5">
          {subtitle}
        </p>
        <p className="text-sm text-white/60 leading-relaxed mb-6">
          {body}
        </p>
        <p className="text-[10px] text-white/20">
          {dateStr}
        </p>
      </div>
    </Modal>
  )
}
