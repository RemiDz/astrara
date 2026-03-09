'use client'

import { useState } from 'react'
import { useTranslation } from '@/i18n/useTranslation'

interface InstagramCaptionsProps {
  reelCaption: string
  postCaption: string
  storyOverlays: string[]
}

export default function InstagramCaptions({ reelCaption, postCaption, storyOverlays }: InstagramCaptionsProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState<string | null>(null)

  async function handleCopy(id: string, text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Reel Caption */}
      <CaptionBlock
        icon="\u{1F4F1}"
        label={t('social.reelCaption')}
        content={reelCaption}
        copied={copied === 'reel'}
        onCopy={() => handleCopy('reel', reelCaption)}
        copyLabel={copied === 'reel' ? t('social.copied') : t('social.copy')}
      />

      {/* Post Caption */}
      <CaptionBlock
        icon="\u{1F4F8}"
        label={t('social.postCaption')}
        content={postCaption}
        copied={copied === 'post'}
        onCopy={() => handleCopy('post', postCaption)}
        copyLabel={copied === 'post' ? t('social.copied') : t('social.copy')}
      />

      {/* Story Overlays */}
      <div>
        <p className="text-xs text-white/30 uppercase tracking-wider mb-2">
          {'\u{1F4D6}'} {t('social.storyOverlays')}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {storyOverlays.map((slide, i) => (
            <button
              key={i}
              onClick={() => handleCopy(`story-${i}`, slide)}
              className="p-3 rounded-xl border text-left transition-colors hover:bg-white/3 cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}
            >
              <span className="text-[10px] text-white/20 uppercase block mb-1">
                {t('social.slide')} {i + 1}
              </span>
              <span className="text-xs text-white/60 leading-relaxed block">{slide}</span>
              <span className="text-[10px] text-white/20 mt-2 block">
                {copied === `story-${i}` ? `\u2713 ${t('social.copied')}` : `\u{1F4CB}`}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function CaptionBlock({ icon, label, content, copied, onCopy, copyLabel }: {
  icon: string
  label: string
  content: string
  copied: boolean
  onCopy: () => void
  copyLabel: string
}) {
  return (
    <div
      className="p-4 rounded-xl border"
      style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-white/30 uppercase tracking-wider">{icon} {label}</span>
        <button
          onClick={onCopy}
          className="text-xs text-white/25 hover:text-purple-400 transition-colors cursor-pointer"
        >
          {copyLabel}
        </button>
      </div>
      <pre className="text-white/65 text-sm whitespace-pre-wrap font-[family-name:var(--font-body)] leading-relaxed">
        {content}
      </pre>
    </div>
  )
}
