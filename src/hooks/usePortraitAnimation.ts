'use client';

import { useState, useEffect } from 'react';

export function usePortraitAnimation() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return { loaded };
}
