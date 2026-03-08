'use client'

import { useTranslation } from '@/i18n/useTranslation'
import type { ReadingPhase, PhaseType } from '../types'

interface PhaseProgressBarProps {
  phases: ReadingPhase[]
  currentIndex: number
  onJump: (index: number) => void
}

const PHASE_META: Record<PhaseType, { icon: string; label: { en: string; lt: string } }> = {
  'summary':                  { icon: '✦', label: { en: 'Overview',  lt: 'Apzvalga' } },
  'moon-phase':               { icon: '☽', label: { en: 'Moon',      lt: 'Menulis' } },
  'sun-position':             { icon: '☉', label: { en: 'Sun',       lt: 'Saule' } },
  'planetary-aspect':         { icon: '△', label: { en: 'Aspects',   lt: 'Aspektai' } },
  'retrograde':               { icon: '℞', label: { en: 'Retro',     lt: 'Retro' } },
  'frequency-recommendation': { icon: '♫', label: { en: 'Sound',     lt: 'Garsas' } },
  'planetary-highlight':      { icon: '★', label: { en: 'Planet',    lt: 'Planeta' } },
}

export default function PhaseProgressBar({ phases, currentIndex, onJump }: PhaseProgressBarProps) {
  const { lang } = useTranslation()

  return (
    <>
      <div className="flex items-center justify-center gap-3 px-4 py-3">
        {phases.map((phase, i) => {
          const meta = PHASE_META[phase.type] ?? { icon: '·', label: { en: '', lt: '' } }
          const isActive = i === currentIndex
          const isCompleted = i < currentIndex

          return (
            <button
              key={phase.id}
              type="button"
              onClick={() => onJump(i)}
              className="phase-progress-item flex flex-col items-center gap-0.5"
              style={{
                minWidth: 44,
                minHeight: 44,
                opacity: isActive ? 1 : isCompleted ? 0.6 : 0.3,
                transition: 'opacity 300ms ease, text-shadow 300ms ease',
              }}
            >
              <span
                className="text-lg leading-none text-white"
                style={{
                  textShadow: isActive ? '0 0 8px currentColor' : 'none',
                  transition: 'text-shadow 300ms ease',
                }}
              >
                {meta.icon}
              </span>
              <span
                className="text-[10px] uppercase tracking-wide text-white leading-none"
              >
                {meta.label[lang as 'en' | 'lt'] ?? meta.label.en}
              </span>
            </button>
          )
        })}
      </div>

      <style>{`
        .phase-progress-item {
          -webkit-tap-highlight-color: transparent;
          cursor: pointer;
          background: none;
          border: none;
          padding: 4px 2px;
        }
      `}</style>
    </>
  )
}
