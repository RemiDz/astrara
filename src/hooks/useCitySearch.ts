import { useState, useRef, useCallback } from 'react';

interface CityResult {
  name: string;
  lat: number;
  lng: number;
  country: string;
}

export function useCitySearch() {
  const [results, setResults] = useState<CityResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const search = useCallback((query: string, lang: string = 'en') => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(query)}&format=json&limit=8&addressdetails=1` +
          `&featuretype=city&accept-language=${lang}`,
          {
            headers: { 'User-Agent': 'Astrara/1.0 (https://astrara.vercel.app)' },
          }
        );
        const data = await res.json();
        const cities: CityResult[] = data.map((item: Record<string, unknown>) => ({
          name: [
            (item.address as Record<string, string>)?.city ||
            (item.address as Record<string, string>)?.town ||
            (item.address as Record<string, string>)?.village ||
            item.name,
            (item.address as Record<string, string>)?.country,
          ]
            .filter(Boolean)
            .join(', '),
          lat: parseFloat(item.lat as string),
          lng: parseFloat(item.lon as string),
          country: (item.address as Record<string, string>)?.country || '',
        }));
        setResults(cities);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 300);
  }, []);

  const clear = useCallback(() => setResults([]), []);

  return { results, loading, search, clear };
}
