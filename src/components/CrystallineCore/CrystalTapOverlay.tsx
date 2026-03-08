'use client'

import { useCallback } from 'react'
import { useTranslation } from '@/i18n/useTranslation'
import type { PlanetPosition } from '@/lib/astronomy'
import { getDominantElement, getElementCounts, type ElementType } from './crystalUtils'
import Modal from '@/components/ui/Modal'

interface CrystalTapOverlayProps {
  isOpen: boolean
  onClose: () => void
  planets: PlanetPosition[]
  date: Date
}

const GUIDANCE: Record<ElementType, Record<string, string>> = {
  fire: {
    en: 'act with courage and trust your instincts',
    lt: 'veikti drąsiai ir pasitikėti savo instinktais',
  },
  water: {
    en: 'honour your emotions and deepen your connections',
    lt: 'gerbti savo emocijas ir gilinti ryšius',
  },
  earth: {
    en: 'ground your vision into practical steps',
    lt: 'paversti savo viziją praktiniais žingsniais',
  },
  air: {
    en: 'communicate your truth and stay open to new perspectives',
    lt: 'išsakyti savo tiesą ir būti atviru naujoms perspektyvoms',
  },
}

export default function CrystalTapOverlay({ isOpen, onClose, planets, date }: CrystalTapOverlayProps) {
  const { t, lang } = useTranslation()

  const element = getDominantElement(planets)
  const counts = getElementCounts(planets)
  const totalPlanets = planets.length

  const elementName = t(`element.${element}`)
  const guidance = GUIDANCE[element][lang] ?? GUIDANCE[element].en

  const dateStr = date.toLocaleDateString(lang === 'lt' ? 'lt-LT' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const title = lang === 'lt' ? 'Kosminė Kristalizacija' : 'Cosmic Crystallisation'
  const subtitle = lang === 'lt' ? 'Vieningo lauko žinia' : 'The unified field speaks'

  const body = lang === 'lt'
    ? `Kosminės jėgos šiuo metu kristalizuojasi per ${elementName} energiją. ${totalPlanets} dangaus kūnai nukreipia savo šviesą į šią akimirką. Visata kviečia jus ${guidance}.`
    : `The cosmic forces are currently crystallising through ${elementName} energy. ${totalPlanets} celestial bodies channel their light into this moment. The universe invites you to ${guidance}.`

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

        {/* Element breakdown */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {(['fire', 'water', 'earth', 'air'] as ElementType[]).map((el) => (
            <div
              key={el}
              className={`rounded-xl py-2 px-1 text-center ${el === element ? 'bg-white/10 border border-white/15' : 'bg-white/3'}`}
            >
              <div className="text-[10px] uppercase tracking-wider text-white/30">
                {t(`element.${el}`)}
              </div>
              <div className={`text-base font-medium ${el === element ? 'text-white/80' : 'text-white/30'}`}>
                {counts[el]}
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-white/20">
          {dateStr}
        </p>
      </div>
    </Modal>
  )
}
