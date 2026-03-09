'use client'

import { useState } from 'react'
import { useTranslation } from '@/i18n/useTranslation'
import type { HashtagSet } from '@/lib/social-content'

interface HashtagSetsProps {
  sets: HashtagSet[]
}

const ICONS: Record<string, string> = {
  trending: '\u{1F525}',
  evergreen: '\u{1F319}',
  soundhealing: '\u{1F3B5}',
  tiktok: '\u{1F4F1}',
}

export default function HashtagSets({ sets }: HashtagSetsProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState<string | null>(null)

  async function handleCopy(id: string, tags: string[]) {
    await navigator.clipboard.writeText(tags.join(' '))
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-3">
      {sets.map(set => (
        <div
          key={set.id}
          className="p-4 rounded-xl border flex items-start justify-between gap-3"
          style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/30 uppercase tracking-wider mb-1.5">
              {ICONS[set.id] || ''} {t(set.labelKey)}
            </p>
            <p className="text-sm text-white/50 leading-relaxed break-words">
              {set.tags.join(' ')}
            </p>
          </div>
          <button
            onClick={() => handleCopy(set.id, set.tags)}
            className="text-xs text-white/25 hover:text-purple-400 transition-colors shrink-0 cursor-pointer"
          >
            {copied === set.id ? `\u2713 ${t('social.copied')}` : `\u{1F4CB}`}
          </button>
        </div>
      ))}
    </div>
  )
}
