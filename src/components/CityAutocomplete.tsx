'use client';

import { useState, useRef, useEffect } from 'react';
import { CITIES } from '@/lib/cities';
import { City } from '@/types';
import { useLanguage } from '@/lib/i18n';

interface Props {
  onSelect: (city: City) => void;
  selected: City | null;
}

export default function CityAutocomplete({ onSelect, selected }: Props) {
  const { t } = useLanguage();
  const [query, setQuery] = useState(selected?.name || '');
  const [open, setOpen] = useState(false);
  const [matches, setMatches] = useState<City[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) setQuery(selected.name);
  }, [selected]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleInput(value: string) {
    setQuery(value);
    if (value.length < 2) {
      setMatches([]);
      setOpen(false);
      return;
    }
    const lower = value.toLowerCase();
    const filtered = CITIES.filter((c) =>
      c.name.toLowerCase().includes(lower)
    ).slice(0, 8);
    setMatches(filtered);
    setOpen(filtered.length > 0);
  }

  function handleSelect(city: City) {
    setQuery(city.name);
    setOpen(false);
    onSelect(city);
  }

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => query.length >= 2 && matches.length > 0 && setOpen(true)}
        placeholder={t('cityPlaceholder')}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--space-card)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-dim)] focus:border-[var(--border-active)] focus:outline-none transition-colors font-sans"
        autoComplete="off"
      />
      {open && (
        <ul className="absolute z-40 mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--space-card)] py-1 shadow-xl max-h-64 overflow-y-auto">
          {matches.map((city) => (
            <li key={`${city.name}-${city.lat}-${city.lng}`}>
              <button
                type="button"
                onClick={() => handleSelect(city)}
                className="w-full px-4 py-2.5 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--space-hover)] transition-colors"
              >
                {city.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
