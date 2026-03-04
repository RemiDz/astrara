export interface UserLocation {
  lat: number
  lng: number
  city: string
}

const DEFAULT_LOCATION: UserLocation = { lat: 51.5074, lng: -0.1278, city: 'London' }

export async function getUserLocation(): Promise<UserLocation> {
  // Try browser geolocation
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          maximumAge: 600000,
        })
      })
      const { latitude: lat, longitude: lng } = pos.coords
      const city = await reverseGeocode(lat, lng)
      return { lat, lng, city }
    } catch {
      // Geolocation denied or unavailable
    }
  }

  // Try IP-based fallback
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) })
    if (res.ok) {
      const data = await res.json()
      if (data.latitude && data.longitude) {
        return { lat: data.latitude, lng: data.longitude, city: data.city || 'Unknown' }
      }
    }
  } catch {
    // IP lookup failed
  }

  return DEFAULT_LOCATION
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      {
        headers: { 'User-Agent': 'Astrara/2.0 (https://astrara.app)' },
        signal: AbortSignal.timeout(3000),
      }
    )
    if (res.ok) {
      const data = await res.json()
      return data.address?.city || data.address?.town || data.address?.village || 'Unknown'
    }
  } catch {
    // Reverse geocode failed
  }
  return 'Unknown'
}

export async function searchCity(query: string): Promise<UserLocation[]> {
  if (!query || query.length < 2) return []
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
      {
        headers: { 'User-Agent': 'Astrara/2.0 (https://astrara.app)' },
        signal: AbortSignal.timeout(3000),
      }
    )
    if (res.ok) {
      const data = await res.json()
      return data.map((r: { lat: string; lon: string; display_name: string }) => ({
        lat: parseFloat(r.lat),
        lng: parseFloat(r.lon),
        city: r.display_name.split(',')[0],
      }))
    }
  } catch {
    // Search failed
  }
  return []
}
