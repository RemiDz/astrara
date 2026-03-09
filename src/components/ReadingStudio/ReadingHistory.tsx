'use client'

import { useState } from 'react'
import { useTranslation } from '@/i18n/useTranslation'

export interface ReadingHistoryEntry {
  id: string
  timestamp: string
  clientName?: string
  inputMode: 'zodiac' | 'birthdate'
  zodiacSign?: string
  birthDate?: string
  scope: string[]
  style: string
  language: string
  readingText: string
}

interface ReadingHistoryProps {
  history: ReadingHistoryEntry[]
  onLoadReading: (entry: ReadingHistoryEntry) => void
  onClearHistory: () => void
}

export default function ReadingHistory({ history, onLoadReading, onClearHistory }: ReadingHistoryProps) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  if (history.length === 0) return null

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-white/30 text-xs uppercase tracking-wider hover:text-white/50 transition-colors cursor-pointer"
      >
        <span className="text-white/15">——</span>
        <span>{t('studio.recentReadings')}</span>
        <span className="text-white/15">——</span>
        <span className="text-[10px]">{expanded ? '\u25B4' : '\u25BE'}</span>
      </button>

      {expanded && (
        <div className="mt-3 space-y-1">
          {history.map(entry => {
            const date = new Date(entry.timestamp)
            const dateStr = date.toLocaleDateString('en-GB', {
              day: 'numeric', month: 'short', year: 'numeric',
            })
            const timeStr = date.toLocaleTimeString('en-GB', {
              hour: '2-digit', minute: '2-digit',
            })
            const label = entry.inputMode === 'zodiac'
              ? entry.zodiacSign
              : entry.birthDate

            return (
              <button
                key={entry.id}
                onClick={() => onLoadReading(entry)}
                className="w-full flex items-center gap-3 py-2 px-3 rounded-lg text-left hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span className="text-white/20 text-xs">·</span>
                <span className="text-white/60 text-sm flex-1 truncate">
                  {entry.clientName || label}
                </span>
                <span className="text-white/25 text-xs">
                  {entry.clientName ? ` — ${label}` : ''}
                </span>
                <span className="text-white/20 text-xs whitespace-nowrap">
                  {dateStr}, {timeStr}
                </span>
              </button>
            )
          })}

          <button
            onClick={onClearHistory}
            className="mt-2 text-xs px-3 py-1.5 rounded-full bg-white/3 border border-white/6 text-white/30 hover:text-white/50 hover:bg-white/5 transition-all cursor-pointer"
          >
            {t('studio.clearHistory')}
          </button>
        </div>
      )}
    </div>
  )
}
