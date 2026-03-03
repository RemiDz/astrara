'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { motion } from 'framer-motion';
import { City } from '@/types';
import { useLanguage } from '@/lib/i18n';
import CityAutocomplete from './CityAutocomplete';

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
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full space-y-4"
    >
      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-1.5 font-sans">
          {t('dateLabel')}
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--space-card)] px-4 py-3 text-[var(--text-primary)] focus:border-[var(--border-active)] focus:outline-none transition-colors font-sans"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-1.5 font-sans">
          {t('timeLabel')}
        </label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--space-card)] px-4 py-3 text-[var(--text-primary)] focus:border-[var(--border-active)] focus:outline-none transition-colors font-sans"
          required
        />
        <p className="text-xs text-[var(--text-dim)] mt-1">{t('timeHint')}</p>
      </div>

      {!manualCoords ? (
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-1.5 font-sans">
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
              <label className="block text-sm text-[var(--text-secondary)] mb-1.5 font-sans">
                {t('latLabel')}
              </label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="51.5074"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--space-card)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-dim)] focus:border-[var(--border-active)] focus:outline-none transition-colors font-sans"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1.5 font-sans">
                {t('lngLabel')}
              </label>
              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="-0.1278"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--space-card)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-dim)] focus:border-[var(--border-active)] focus:outline-none transition-colors font-sans"
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

      <button
        type="submit"
        disabled={!isValid || loading}
        className="w-full rounded-xl bg-[var(--accent)] py-4 text-white font-medium transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed font-sans"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {t('generating')}
          </span>
        ) : (
          t('generateButton')
        )}
      </button>
    </motion.form>
  );
}
