'use client'

import { useState, useEffect } from 'react'
import { fetchEarthData, type EarthData } from '@/lib/earth-data'

export function useEarthData() {
  const [earthData, setEarthData] = useState<EarthData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEarthData().then(data => {
      setEarthData(data)
      setLoading(false)
    })

    const interval = setInterval(() => {
      fetchEarthData().then(setEarthData)
    }, 15 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return { earthData, loading }
}
