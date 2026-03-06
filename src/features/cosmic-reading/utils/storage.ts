import type { ZodiacProfile } from '../types'

const PROFILE_KEY = 'astrara_zodiac_profile'
const EXISTING_BIRTH_KEY = 'astrara-birth-data'

export function getZodiacProfile(): ZodiacProfile | null {
  if (typeof window === 'undefined') return null
  try {
    const saved = localStorage.getItem(PROFILE_KEY)
    if (saved) return JSON.parse(saved) as ZodiacProfile
  } catch { /* ignore */ }
  return null
}

export function saveZodiacProfile(profile: ZodiacProfile): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

/**
 * Check if the user has existing birth data from the birth chart feature.
 * Returns the stored birth date string if available, null otherwise.
 * The caller can use getPlanetPositions() from @/lib/astronomy to derive the Sun sign.
 */
export function getExistingBirthData(): {
  date: string
  time: string
  city: string
  lat: number
  lng: number
} | null {
  if (typeof window === 'undefined') return null
  try {
    const saved = localStorage.getItem(EXISTING_BIRTH_KEY)
    if (saved) return JSON.parse(saved)
  } catch { /* ignore */ }
  return null
}

export function clearZodiacProfile(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(PROFILE_KEY)
}
