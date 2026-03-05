export interface EarthData {
  kpIndex: number
  kpLabel: string
  kpTimestamp: string
  solarWindSpeed: number
  solarWindDensity: number
  solarWindSpeedLabel: string
  bzComponent: number
  bzLabel: string
  solarFlareClass: string
  solarFluxValue: number
  schumannBase: number
  schumannHarmonics: number[]
  lastUpdated: Date
  fetchError: boolean
}

export async function fetchEarthData(): Promise<EarthData> {
  const defaults: EarthData = {
    kpIndex: 0,
    kpLabel: 'Unknown',
    kpTimestamp: '',
    solarWindSpeed: 0,
    solarWindDensity: 0,
    solarWindSpeedLabel: 'Unknown',
    bzComponent: 0,
    bzLabel: 'Unknown',
    solarFlareClass: 'A0.0',
    solarFluxValue: 0,
    schumannBase: 7.83,
    schumannHarmonics: [14.07, 20.25, 26.41, 32.45],
    lastUpdated: new Date(),
    fetchError: false,
  }

  try {
    const [kpRes, plasmaRes, magRes, xrayRes] = await Promise.allSettled([
      fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json'),
      fetch('https://services.swpc.noaa.gov/products/solar-wind/plasma-2-hour.json'),
      fetch('https://services.swpc.noaa.gov/products/solar-wind/mag-2-hour.json'),
      fetch('https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json'),
    ])

    if (kpRes.status === 'fulfilled' && kpRes.value.ok) {
      const kpData = await kpRes.value.json()
      if (kpData.length > 1) {
        const latest = kpData[kpData.length - 1]
        const kp = parseFloat(latest[1])
        defaults.kpIndex = kp
        defaults.kpTimestamp = latest[0]
        defaults.kpLabel = getKpLabel(kp)
      }
    }

    if (plasmaRes.status === 'fulfilled' && plasmaRes.value.ok) {
      const plasmaData = await plasmaRes.value.json()
      if (plasmaData.length > 1) {
        const latest = plasmaData[plasmaData.length - 1]
        defaults.solarWindDensity = parseFloat(latest[1]) || 0
        defaults.solarWindSpeed = parseFloat(latest[2]) || 0
        defaults.solarWindSpeedLabel = getWindSpeedLabel(defaults.solarWindSpeed)
      }
    }

    if (magRes.status === 'fulfilled' && magRes.value.ok) {
      const magData = await magRes.value.json()
      if (magData.length > 1) {
        const latest = magData[magData.length - 1]
        defaults.bzComponent = parseFloat(latest[3]) || 0
        defaults.bzLabel = getBzLabel(defaults.bzComponent)
      }
    }

    if (xrayRes.status === 'fulfilled' && xrayRes.value.ok) {
      const xrayData = await xrayRes.value.json()
      // Find most recent entry for the 0.1-0.8nm channel
      for (let i = xrayData.length - 1; i >= 0; i--) {
        const entry = xrayData[i]
        if (entry.energy === '0.1-0.8nm') {
          defaults.solarFlareClass = entry.current_class || 'A0.0'
          defaults.solarFluxValue = parseFloat(entry.current_int_xrray_flux) || 0
          break
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch Earth data:', error)
    defaults.fetchError = true
  }

  defaults.lastUpdated = new Date()
  return defaults
}

function getKpLabel(kp: number): string {
  if (kp <= 1) return 'Quiet'
  if (kp <= 3) return 'Unsettled'
  if (kp === 4) return 'Active'
  if (kp <= 6) return 'Storm'
  return 'Severe Storm'
}

function getWindSpeedLabel(speed: number): string {
  if (speed < 300) return 'Slow'
  if (speed < 450) return 'Normal'
  if (speed < 600) return 'Fast'
  return 'Very Fast'
}

function getBzLabel(bz: number): string {
  if (bz > 2) return 'Northward (Calm)'
  if (bz > -2) return 'Neutral'
  if (bz > -10) return 'Southward (Active)'
  return 'Strongly Southward (Stormy)'
}
