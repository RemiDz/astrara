'use client'

import { useState, useMemo } from 'react'
import { useLanguage } from '@/i18n/LanguageContext'
import { aboutContent as enAbout } from '@/i18n/content/en/about'
import { aboutContent as ltAbout } from '@/i18n/content/lt/about'
import { GLOSSARY } from '@/data/glossary'
import Modal from '@/components/ui/Modal'

const contentMap: Record<string, typeof enAbout> = { en: enAbout, lt: ltAbout }

interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const { lang } = useLanguage()
  const content = contentMap[lang] || contentMap.en
  const [tab, setTab] = useState<'about' | 'glossary'>('about')
  const [search, setSearch] = useState('')

  const filteredGlossary = useMemo(() => {
    if (!search.trim()) return GLOSSARY
    const q = search.toLowerCase()
    return GLOSSARY.map(cat => ({
      ...cat,
      terms: cat.terms.filter(t => {
        const loc = lang === 'lt' ? t.lt : t.en
        return loc.name.toLowerCase().includes(q) || loc.description.toLowerCase().includes(q)
      }),
    })).filter(cat => cat.terms.length > 0)
  }, [search, lang])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Tab bar */}
      <div className="flex gap-1 mb-5 border-b border-white/8">
        <button
          onClick={() => setTab('about')}
          className="px-4 py-2 text-sm transition-colors relative"
          style={{
            color: tab === 'about' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
          }}
        >
          {lang === 'lt' ? 'Apie' : 'About'}
          {tab === 'about' && (
            <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-white/40" />
          )}
        </button>
        <button
          onClick={() => setTab('glossary')}
          className="px-4 py-2 text-sm transition-colors relative"
          style={{
            color: tab === 'glossary' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
          }}
        >
          {lang === 'lt' ? 'Žodynas' : 'Glossary'}
          {tab === 'glossary' && (
            <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-white/40" />
          )}
        </button>
      </div>

      {tab === 'about' && (
        <>
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
        </>
      )}

      {tab === 'glossary' && (
        <>
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'lt' ? 'Ieškoti terminų...' : 'Search terms...'}
            className="w-full px-4 py-2.5 rounded-xl text-sm text-white/80 placeholder-white/30
                       bg-white/[0.06] border border-white/[0.08] outline-none
                       focus:border-white/15 transition-colors mb-4"
          />

          {filteredGlossary.length === 0 && (
            <p className="text-sm text-white/30 text-center py-8">
              {lang === 'lt' ? 'Nieko nerasta' : 'No results found'}
            </p>
          )}

          {filteredGlossary.map((cat, ci) => (
            <div key={ci}>
              {/* Category header */}
              <div className="w-full h-px bg-white/10 mt-5 mb-3" />
              <p className="text-[11px] uppercase tracking-[0.15em] text-white/40 mb-3">
                {lang === 'lt' ? cat.category.lt : cat.category.en}
              </p>

              {cat.terms.map((term, ti) => {
                const loc = lang === 'lt' ? term.lt : term.en
                return (
                  <div key={ti} className="py-3 border-b border-white/5 last:border-b-0">
                    <p className="text-[15px] text-white font-medium mb-1">
                      {term.symbol} {loc.name}
                    </p>
                    <p className="text-[13px] text-white/60 leading-relaxed">
                      {loc.description}
                    </p>
                  </div>
                )
              })}
            </div>
          ))}
        </>
      )}
    </Modal>
  )
}
