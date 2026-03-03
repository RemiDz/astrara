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
        className="w-full bg-[#0F1019] border border-[#1E1F2E] rounded-lg py-3 px-4 text-sm text-[#E8ECF4] placeholder-[#3D4167] focus:border-[#3B4BDB] focus:outline-none transition-colors font-sans"
        autoComplete="off"
      />
      {open && (
        <ul className="absolute z-40 mt-1 w-full rounded-lg border border-[#1E1F2E] bg-[#0F1019] shadow-xl shadow-black/30 max-h-48 overflow-y-auto">
          {loading && results.length === 0 && (
            <li className="px-4 py-3 text-sm text-[#3D4167] italic text-center">
              Searching...
            </li>
          )}
          {!loading && results.length === 0 && query.length >= 2 && (
            <li className="px-4 py-3 text-sm text-[#3D4167] text-center">
              No cities found
            </li>
          )}
          {results.map((city, i) => (
            <li
              key={`${city.name}-${city.lat}-${city.lng}-${i}`}
              className={i < results.length - 1 ? 'border-b border-[#1E1F2E]' : ''}
            >
              <button
                type="button"
                onClick={() => handleSelect(city)}
                className="w-full px-4 py-3 text-left text-sm text-[#E8ECF4] hover:bg-[#161722] transition-colors cursor-pointer"
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
