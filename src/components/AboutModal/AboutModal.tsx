'use client'

import { useLanguage } from '@/i18n/LanguageContext'
import { aboutContent as enAbout } from '@/i18n/content/en/about'
import { aboutContent as ltAbout } from '@/i18n/content/lt/about'
import Modal from '@/components/ui/Modal'

const contentMap: Record<string, typeof enAbout> = { en: enAbout, lt: ltAbout }

interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const { lang } = useLanguage()
  const content = contentMap[lang] || contentMap.en

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-white tracking-wide">
          {content.title}
        </h2>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
          {content.subtitle}
        </p>
      </div>

      {/* Intro */}
      {content.intro.map((p, i) => (
        <p key={i} className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
          {p}
        </p>
      ))}

      {/* Sections */}
      {content.sections.map((section, i) => (
        <div key={i}>
          <div className="w-full h-px bg-white/8 mt-6 mb-4" />
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-3 flex items-center gap-2">
            <span>{section.icon}</span>
            <span>{section.heading}</span>
          </h3>
          {section.paragraphs.map((p, j) => (
            <p key={j} className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
              {p}
            </p>
          ))}
        </div>
      ))}

      {/* FAQ */}
      <div className="w-full h-px bg-white/8 mt-6 mb-4" />
      <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-3 flex items-center gap-2">
        <span>?</span>
        <span>{content.faq.heading}</span>
      </h3>
      {content.faq.items.map((item, i) => (
        <div key={i}>
          <p className="text-[13px] text-white/75 font-medium mt-5 mb-1">
            {item.q}
          </p>
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {item.a}
          </p>
        </div>
      ))}

      {/* Ecosystem links */}
      <div className="w-full h-px bg-white/8 mt-6 mb-4" />
      <div className="space-y-2">
        {content.links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-3 rounded-xl
                       bg-white/[0.03] border border-white/[0.06]
                       hover:bg-white/5 hover:border-white/10
                       transition-all group"
          >
            <span className="text-sm text-white/50 group-hover:text-white/70">{link.label}</span>
            <span className="text-white/20 group-hover:text-white/40 text-xs">&rarr;</span>
          </a>
        ))}
      </div>

      {/* Version */}
      <p className="text-center text-[10px] mt-6" style={{ color: 'var(--text-muted)' }}>
        {content.version}
      </p>
    </Modal>
  )
}
