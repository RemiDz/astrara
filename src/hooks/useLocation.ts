'use client'

import { useState, useEffect } from 'react'
import { getUserLocation, type UserLocation } from '@/lib/location'

export function useLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserLocation()
      .then(setLocation)
      .finally(() => setLoading(false))
  }, [])

  return { location, loading, setLocation }
}
