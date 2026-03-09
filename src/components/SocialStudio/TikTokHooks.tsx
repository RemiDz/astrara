'use client'

import { useState } from 'react'
import { useTranslation } from '@/i18n/useTranslation'

interface TikTokHooksProps {
  hooks: string[]
}

export default function TikTokHooks({ hooks }: TikTokHooksProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState<number | null>(null)

  async function handleCopy(idx: number, text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(idx)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-2">
      {hooks.map((hook, i) => (
        <div
          key={i}
          className="p-4 rounded-xl border flex items-start gap-3"
          style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <span className="text-white/15 text-xs font-mono mt-0.5">{i + 1}.</span>
          <p className="text-white/70 text-sm leading-relaxed flex-1">&ldquo;{hook}&rdquo;</p>
          <button
            onClick={() => handleCopy(i, hook)}
            className="text-xs text-white/25 hover:text-purple-400 transition-colors shrink-0 cursor-pointer"
          >
            {copied === i ? `\u2713 ${t('social.copied')}` : `\u{1F4CB} ${t('social.copy')}`}
          </button>
        </div>
      ))}
    </div>
  )
}
