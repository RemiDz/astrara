'use client'

import { useState } from 'react'
import { useTranslation } from '@/i18n/useTranslation'
import { useLanguage } from '@/i18n/LanguageContext'
import PlanetCard from './PlanetCard'
import SignCard from './SignCard'
import AspectCard from './AspectCard'
import HouseCard from './HouseCard'
import ElementCard from './ElementCard'

import { learnPlanets as enPlanets } from '@/i18n/content/en/learn-planets'
import { learnSigns as enSigns } from '@/i18n/content/en/learn-signs'
import { learnAspects as enAspects, learnMinorAspects as enMinorAspects } from '@/i18n/content/en/learn-aspects'
import { learnHouses as enHouses } from '@/i18n/content/en/learn-houses'
import { learnElements as enElements, coustoFrequencies as enCousto, coustoExplanation as enCoustoExpl, etherSection as enEther } from '@/i18n/content/en/learn-elements'

import { learnPlanets as ltPlanets } from '@/i18n/content/lt/learn-planets'
import { learnSigns as ltSigns } from '@/i18n/content/lt/learn-signs'
import { learnAspects as ltAspects, learnMinorAspects as ltMinorAspects } from '@/i18n/content/lt/learn-aspects'
import { learnHouses as ltHouses } from '@/i18n/content/lt/learn-houses'
import { learnElements as ltElements, coustoFrequencies as ltCousto, coustoExplanation as ltCoustoExpl, etherSection as ltEther } from '@/i18n/content/lt/learn-elements'

const TABS = ['planets', 'signs', 'aspects', 'houses', 'elements'] as const
type Tab = typeof TABS[number]

export default function LearningTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('planets')
  const { t } = useTranslation()
  const { lang } = useLanguage()

  const planets = lang === 'lt' ? ltPlanets : enPlanets
  const signs = lang === 'lt' ? ltSigns : enSigns
  const aspects = lang === 'lt' ? ltAspects : enAspects
  const minorAspects = lang === 'lt' ? ltMinorAspects : enMinorAspects
  const houses = lang === 'lt' ? ltHouses : enHouses
  const elements = lang === 'lt' ? ltElements : enElements
  const cousto = lang === 'lt' ? ltCousto : enCousto
  const coustoExpl = lang === 'lt' ? ltCoustoExpl : enCoustoExpl
  const ether = lang === 'lt' ? ltEther : enEther

  const tabLabels: Record<Tab, string> = {
    planets: t('learn.tab.planets'),
    signs: t('learn.tab.signs'),
    aspects: t('learn.tab.aspects'),
    houses: t('learn.tab.houses'),
    elements: t('learn.tab.elements'),
  }

  return (
    <div className="px-4 mt-8 pb-12">
      <div className="max-w-2xl mx-auto">
        {/* Tab bar */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeTab === tab
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'planets' && (
          <div>
            {planets.map(p => <PlanetCard key={p.id} planet={p} />)}
          </div>
        )}

        {activeTab === 'signs' && (
          <div>
            {signs.map(s => <SignCard key={s.id} sign={s} />)}
          </div>
        )}

        {activeTab === 'aspects' && (
          <div>
            {aspects.map(a => <AspectCard key={a.id} aspect={a} />)}
            {/* Minor aspects */}
            <p className="text-[10px] uppercase tracking-[0.2em] mt-6 mb-3" style={{ color: 'var(--text-muted)' }}>
              {t('learn.minorAspects')}
            </p>
            {minorAspects.map(ma => (
              <div
                key={ma.name}
                className="rounded-2xl border p-4 mb-3"
                style={{
                  background: 'rgba(255,255,255,0.015)',
                  borderColor: 'rgba(255,255,255,0.04)',
                }}
              >
                <h4 className="text-[13px] font-medium text-white mb-1">
                  {ma.name} ({ma.angle})
                </h4>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {ma.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'houses' && (
          <div>
            {houses.map(h => <HouseCard key={h.number} house={h} />)}
          </div>
        )}

        {activeTab === 'elements' && (
          <div>
            {elements.map(e => <ElementCard key={e.id} element={e} />)}

            {/* Ether section */}
            <div
              className="rounded-2xl border p-5 mb-6 mt-6"
              style={{
                background: 'rgba(255,255,255,0.025)',
                borderColor: 'rgba(255,255,255,0.06)',
              }}
            >
              <h3 className="text-base font-semibold text-white mb-2">
                {t('learn.ether')}
              </h3>
              <p className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                {ether.description}
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--text-muted)' }}>
                {t('learn.soundConnection')}
              </p>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {ether.soundConnection}
              </p>
            </div>

            {/* Cousto frequencies table */}
            <div
              className="rounded-2xl border p-5 mb-3"
              style={{
                background: 'rgba(255,255,255,0.025)',
                borderColor: 'rgba(255,255,255,0.06)',
              }}
            >
              <h3 className="text-base font-semibold text-white mb-3">
                {t('learn.coustoTitle')}
              </h3>
              <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                {coustoExpl}
              </p>

              <div className="overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                <table className="w-full text-[12px]">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <th className="text-left py-2 font-medium" style={{ color: 'var(--text-muted)' }}>{t('learn.planet')}</th>
                      <th className="text-left py-2 font-medium" style={{ color: 'var(--text-muted)' }}>{t('learn.frequency')}</th>
                      <th className="text-left py-2 font-medium" style={{ color: 'var(--text-muted)' }}>{t('learn.octave')}</th>
                      <th className="text-left py-2 font-medium" style={{ color: 'var(--text-muted)' }}>{t('learn.note')}</th>
                      <th className="text-left py-2 font-medium" style={{ color: 'var(--text-muted)' }}>{t('learn.colour')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cousto.map(row => (
                      <tr key={row.planet} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td className="py-1.5 text-white/70">{row.planet}</td>
                        <td className="py-1.5" style={{ color: 'var(--text-secondary)' }}>{row.frequency}</td>
                        <td className="py-1.5" style={{ color: 'var(--text-muted)' }}>{row.octave}</td>
                        <td className="py-1.5" style={{ color: 'var(--text-secondary)' }}>{row.note}</td>
                        <td className="py-1.5" style={{ color: 'var(--text-muted)' }}>{row.colour}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
