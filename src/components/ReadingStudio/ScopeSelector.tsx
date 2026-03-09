'use client'

import { useTranslation } from '@/i18n/useTranslation'

export interface ScopeState {
  currentSituation: boolean
  thisMonth: boolean
  nextThreeMonths: boolean
  thisYear: boolean
  nextYear: boolean
  relationship: boolean
}

interface ScopeSelectorProps {
  scope: ScopeState
  onChange: (scope: ScopeState) => void
}

export default function ScopeSelector({ scope, onChange }: ScopeSelectorProps) {
  const { t } = useTranslation()

  const year = new Date().getFullYear()
  const nextYear = year + 1

  const items: { key: keyof ScopeState; label: string; comingSoon?: boolean }[] = [
    { key: 'currentSituation', label: t('studio.scopeCurrent') },
    { key: 'thisMonth', label: t('studio.scopeMonth') },
    { key: 'nextThreeMonths', label: t('studio.scope3Months') },
    { key: 'thisYear', label: `${t('studio.scopeYear')} (${year})` },
    { key: 'nextYear', label: `${t('studio.scopeNextYear')} (${nextYear})` },
    { key: 'relationship', label: t('studio.scopeRelationship'), comingSoon: true },
  ]

  function toggle(key: keyof ScopeState) {
    if (key === 'relationship') return
    onChange({ ...scope, [key]: !scope[key] })
  }

  return (
    <div className="space-y-1">
      {items.map(({ key, label, comingSoon }) => (
        <label
          key={key}
          className="flex items-center gap-3 py-2 px-3 rounded-lg transition-colors"
          style={{
            opacity: comingSoon ? 0.35 : 1,
            cursor: comingSoon ? 'not-allowed' : 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={scope[key]}
            onChange={() => toggle(key)}
            disabled={comingSoon}
            className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#8B5CF6] cursor-pointer"
          />
          <span className="text-sm text-white/70">
            {label}
            {comingSoon && (
              <span className="ml-2 text-xs text-white/30">({t('studio.comingSoon')})</span>
            )}
          </span>
        </label>
      ))}
    </div>
  )
}
