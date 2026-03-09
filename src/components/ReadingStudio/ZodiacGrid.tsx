'use client'

import { ZODIAC_SIGNS, ELEMENT_COLOURS } from '@/lib/zodiac'
import { useTranslation } from '@/i18n/useTranslation'

interface ZodiacGridProps {
  selected: string
  onSelect: (signId: string) => void
}

export default function ZodiacGrid({ selected, onSelect }: ZodiacGridProps) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {ZODIAC_SIGNS.map(sign => {
        const isSelected = selected === sign.id
        const color = ELEMENT_COLOURS[sign.element]
        return (
          <button
            key={sign.id}
            onClick={() => onSelect(sign.id)}
            className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl border transition-all cursor-pointer"
            style={{
              background: isSelected ? `${color}12` : 'rgba(255,255,255,0.025)',
              borderColor: isSelected ? `${color}50` : 'rgba(255,255,255,0.06)',
            }}
          >
            <span
              className="text-2xl"
              style={{
                color: isSelected ? color : 'rgba(255,255,255,0.5)',
                textShadow: isSelected ? `0 0 12px ${color}40` : 'none',
              }}
            >
              {String.fromCodePoint(sign.glyph.codePointAt(0)!)}{'\uFE0E'}
            </span>
            <span
              className="text-xs"
              style={{ color: isSelected ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)' }}
            >
              {t(`zodiac.${sign.id}`)}
            </span>
          </button>
        )
      })}
    </div>
  )
}
