'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { City } from '@/types';
import { useLanguage } from '@/lib/i18n';
import CityAutocomplete from './CityAutocomplete';

const inputClass =
  'w-full rounded-lg border border-[var(--border)] bg-[var(--space-card)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] focus:border-[var(--border-active)] focus:ring-1 focus:ring-[var(--border-active)] focus:outline-none transition-all duration-200 font-sans';

export default function BirthForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [city, setCity] = useState<City | null>(null);
  const [manualCoords, setManualCoords] = useState(false);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = date && time && (city || (manualCoords && lat && lng));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);

    const id = nanoid(10);
    const finalLat = city ? city.lat : parseFloat(lat);
    const finalLng = city ? city.lng : parseFloat(lng);
    const location = city ? city.name : `${lat},${lng}`;

    const params = new URLSearchParams({
      d: date,
      t: time,
      lat: finalLat.toString(),
      lng: finalLng.toString(),
      l: location,
    });

    router.push(`/portrait/${id}?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-sans">
          {t('dateLabel')}
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-sans">
          {t('timeLabel')}
        </label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className={inputClass}
          required
        />
        <p className="text-xs text-[var(--text-dim)] mt-1.5">{t('timeHint')}</p>
      </div>

      {!manualCoords ? (
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-sans">
            {t('cityLabel')}
          </label>
          <CityAutocomplete onSelect={setCity} selected={city} />
          <button
            type="button"
            onClick={() => setManualCoords(true)}
            className="text-xs text-[var(--text-dim)] hover:text-[var(--text-secondary)] mt-2 transition-colors"
          >
            {t('coordsToggle')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-sans">
                {t('latLabel')}
              </label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="51.5074"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-sans">
                {t('lngLabel')}
              </label>
              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="-0.1278"
                className={inputClass}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setManualCoords(false)}
            className="text-xs text-[var(--text-dim)] hover:text-[var(--text-secondary)] transition-colors"
          >
            ← {t('cityLabel')}
          </button>
        </div>
      )}

      <div className="pt-1">
        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full rounded-xl py-3.5 text-sm text-white font-medium transition-all hover:brightness-110 hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 font-sans"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-cool))',
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              {t('generating')}
            </span>
          ) : (
            t('generateButton')
          )}
        </button>
      </div>
    </form>
  );
}
