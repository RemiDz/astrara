// 1 AU in kilometres
const AU_TO_KM = 149_597_870.7

// Speed of light in km/s
const SPEED_OF_LIGHT_KMS = 299_792.458

// 1 km in miles
const KM_TO_MILES = 0.621371

export interface DistanceData {
  km: number
  miles: number
  lightTravelSeconds: number
  formattedKm: string
  formattedMiles: string
  formattedLightTravel: string
}

export function calculateDistance(distanceAU: number): DistanceData {
  const km = distanceAU * AU_TO_KM
  const miles = km * KM_TO_MILES
  const lightTravelSeconds = km / SPEED_OF_LIGHT_KMS

  return {
    km,
    miles,
    lightTravelSeconds,
    formattedKm: formatDistance(km),
    formattedMiles: formatDistance(miles),
    formattedLightTravel: formatLightTravel(lightTravelSeconds),
  }
}

function formatDistance(value: number): string {
  if (value < 1_000) return `${Math.round(value)}`
  if (value < 1_000_000) return `${(value / 1_000).toFixed(1)}k`
  if (value < 1_000_000_000) return `${numberWithCommas(Math.round(value / 1_000) * 1_000)}`
  return `${(value / 1_000_000_000).toFixed(2)} billion`
}

// e.g. 384400000 → "384,400,000"
function numberWithCommas(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function formatLightTravel(totalSeconds: number): string {
  if (totalSeconds < 60) {
    return `${totalSeconds.toFixed(1)} seconds`
  }
  if (totalSeconds < 3600) {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.round(totalSeconds % 60)
    return seconds > 0 ? `${minutes} min ${seconds} sec` : `${minutes} min`
  }
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.round((totalSeconds % 3600) / 60)
  return minutes > 0 ? `${hours} hr ${minutes} min` : `${hours} hr`
}
