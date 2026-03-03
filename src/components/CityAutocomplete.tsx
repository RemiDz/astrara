'use client';

import { useState, useRef, useEffect } from 'react';
import { City } from '@/types';
import { useLanguage } from '@/lib/i18n';
import { useCitySearch } from '@/hooks/useCitySearch';

interface Props {
  onSelect: (city: City) => void;
  selected: City | null;
}

export default function CityAutocomplete({ onSelect, selected }: Props) {
  const { t, lang } = useLanguage();
  const [query, setQuery] = useState(selected?.name || '');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { results, loading, search, clear } = useCitySearch();

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
      clear();
      setOpen(false);
      return;
    }
    search(value, lang);
    setOpen(true);
  }

  function handleSelect(city: { name: string; lat: number; lng: number }) {
    setQuery(city.name);
    setOpen(false);
    clear();
    onSelect({ name: city.name, lat: city.lat, lng: city.lng });
  }

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => query.length >= 2 && results.length > 0 && setOpen(true)}
        placeholder={t('cityPlaceholder')}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--space-card)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] focus:border-[var(--border-active)] focus:ring-1 focus:ring-[var(--border-active)] focus:outline-none transition-all duration-200 font-sans"
        autoComplete="off"
      />
      {open && (
        <ul className="absolute z-40 mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--space-card)] shadow-xl shadow-black/30 max-h-48 overflow-y-auto">
          {loading && results.length === 0 && (
            <li className="px-4 py-3 text-sm text-[var(--text-dim)] italic text-center">
              Searching...
            </li>
          )}
          {!loading && results.length === 0 && query.length >= 2 && (
            <li className="px-4 py-3 text-sm text-[var(--text-dim)] text-center">
              No cities found
            </li>
          )}
          {results.map((city, i) => (
            <li
              key={`${city.name}-${city.lat}-${city.lng}-${i}`}
              className={i < results.length - 1 ? 'border-b border-[var(--border)]' : ''}
            >
              <button
                type="button"
                onClick={() => handleSelect(city)}
                className="w-full px-4 py-3 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--space-hover)] transition-colors cursor-pointer"
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
