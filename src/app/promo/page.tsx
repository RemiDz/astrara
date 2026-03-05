'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { getPlanetPositions, getMoonData, type PlanetPosition, type MoonData } from '@/lib/astronomy'
import { fetchEarthData, type EarthData } from '@/lib/earth-data'
import { ZODIAC_SIGNS } from '@/lib/zodiac'
import { PLANETS } from '@/lib/planets'

export default function PromoPage() {
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [selectedSign, setSelectedSign] = useState<string>('Aries')
  const [earthData, setEarthData] = useState<EarthData | null>(null)
  const [earthLoading, setEarthLoading] = useState(true)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [horoscope, setHoroscope] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const lastGenerationTime = useRef(0)
  const MIN_GENERATION_INTERVAL = 5000

  // Fetch NOAA data
  useEffect(() => {
    setEarthLoading(true)
    fetchEarthData().then(data => {
      setEarthData(data)
      setEarthLoading(false)
    }).catch(() => setEarthLoading(false))
  }, [])

  // Calculate planet positions (no observer needed for ecliptic longitudes — use 0,0)
  const positions = useMemo(() => getPlanetPositions(selectedDate, 0, 0), [selectedDate])

  // Calculate moon data
  const moonData = useMemo(() => getMoonData(selectedDate), [selectedDate])

  // Calculate zodiac impacts
  const impacts = useMemo(() => {
    const kp = earthData?.kpIndex ?? 0
    const solar = earthData?.solarFlareClass ?? 'A0.0'
    return calculateZodiacImpacts(positions, moonData, kp, solar)
  }, [positions, moonData, earthData])

  // Calculate overall impact
  const overallImpact = useMemo(() => {
    const kp = earthData?.kpIndex ?? 0
    const solar = earthData?.solarFlareClass ?? 'A0.0'
    return calculateOverallImpact(positions, moonData, kp, solar)
  }, [positions, moonData, earthData])

  // Auto-select highest impact sign
  useEffect(() => {
    if (impacts.length > 0) {
      setSelectedSign(impacts[0].sign)
    }
  }, [impacts])

  const selectedImpact = impacts.find(i => i.sign === selectedSign) ?? impacts[0]

  // Horoscope generation
  const generateHoroscope = useCallback(async (sign: string) => {
    const now = Date.now()
    if (now - lastGenerationTime.current < MIN_GENERATION_INTERVAL) return
    lastGenerationTime.current = now

    setIsGenerating(true)
    setGenerationError(null)
    setHoroscope('')

    try {
      const impact = impacts.find(i => i.sign === sign)
      const response = await fetch('/api/horoscope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sign,
          positions: positions.map(p => ({
            glyph: p.glyph,
            name: p.name,
            sign: ZODIAC_SIGNS.find(z => z.id === p.zodiacSign)?.name ?? p.zodiacSign,
            degree: p.degreeInSign,
            isRetrograde: p.isRetrograde,
          })),
          moonPhase: {
            name: moonData.phase,
            illumination: Math.round(moonData.illumination * 100),
          },
          kpIndex: earthData?.kpIndex ?? 0,
          solarClass: earthData?.solarFlareClass ?? 'A0.0',
          impactScore: impact?.score ?? 5,
          impactFactors: impact?.factors ?? [],
          date: selectedDate.toLocaleDateString('en-GB', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
          }),
        }),
      })

      if (!response.ok) throw new Error('Failed to generate horoscope')
      const data = await response.json()
      setHoroscope(data.horoscope)
    } catch {
      setGenerationError('Failed to generate horoscope. Check your API key.')
    } finally {
      setIsGenerating(false)
    }
  }, [impacts, positions, moonData, earthData, selectedDate])

  // Auto-generate when sign changes
  const signRef = useRef(selectedSign)
  useEffect(() => {
    if (selectedSign !== signRef.current) {
      signRef.current = selectedSign
      generateHoroscope(selectedSign)
    }
  }, [selectedSign, generateHoroscope])

  // Generate captions
  const captions = useMemo(() => {
    if (!selectedImpact) return null
    const signData = ZODIAC_SIGNS.find(z => z.name === selectedSign)
    return generateCaptions(
      selectedSign,
      signData?.glyph ?? '',
      positions,
      moonData,
      selectedImpact,
      selectedDate,
      horoscope || undefined
    )
  }, [selectedSign, selectedImpact, positions, moonData, selectedDate, horoscope])

  function formatDateForInput(date: Date): string {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  async function handleCopy(field: string, content: string) {
    await navigator.clipboard.writeText(content)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="min-h-screen text-white" style={{ background: 'var(--bg-deep, #07070F)' }}>
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-semibold tracking-wide text-white/90">
            ASTRARA <span className="text-white/30 font-normal">Content Studio</span>
          </h1>
          <div className="mt-4">
            <input
              type="date"
              value={formatDateForInput(selectedDate)}
              onChange={(e) => {
                const d = new Date(e.target.value + 'T12:00:00')
                if (!isNaN(d.getTime())) setSelectedDate(d)
              }}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm appearance-none"
              style={{ colorScheme: 'dark', WebkitAppearance: 'none', fontSize: '16px' }}
            />
          </div>
        </div>

        <Divider />

        {/* Cosmic Weather Summary */}
        <section className="mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white/80 uppercase tracking-wider">
              Today&apos;s Cosmic Weather
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full transition-colors"
                    style={{
                      backgroundColor: i < overallImpact.score ? overallImpact.colour : 'rgba(255,255,255,0.08)',
                    }}
                  />
                ))}
              </div>
              <span style={{ color: overallImpact.colour }} className="text-sm font-mono font-medium">
                {overallImpact.score}/10
              </span>
            </div>
          </div>

          <p className="text-white/40 text-sm mb-4">{overallImpact.level}</p>

          {/* Planetary Positions */}
          <div className="mb-4">
            <p className="text-white/30 text-xs uppercase tracking-wider mb-2">Planetary Positions</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/60">
              {positions.map(p => (
                <span key={p.id}>
                  {p.glyph} {p.name} in {ZODIAC_SIGNS.find(z => z.id === p.zodiacSign)?.name ?? p.zodiacSign} {p.degreeInSign}&deg;
                  {p.isRetrograde && <span className="text-amber-400 ml-0.5">R</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Moon Phase & Space Weather */}
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/50">
            <span>
              Moon Phase: {moonData.phase} ({Math.round(moonData.illumination * 100)}%)
            </span>
            {earthData && !earthData.fetchError ? (
              <>
                <span>Kp Index: {earthData.kpIndex} ({earthData.kpLabel})</span>
                <span>Solar: {earthData.solarFlareClass}</span>
              </>
            ) : earthLoading ? (
              <span className="text-white/20">Loading space weather...</span>
            ) : (
              <span className="text-white/20">Space weather data unavailable</span>
            )}
          </div>
        </section>

        <Divider />

        {/* Zodiac Impact Rankings */}
        <section className="mb-8">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white/80 uppercase tracking-wider mb-4">
            Zodiac Impact Rankings
          </h2>
          <div className="space-y-1">
            {impacts.map((impact, i) => (
              <div
                key={impact.sign}
                className={`flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer transition-colors ${
                  impact.sign === selectedSign ? 'bg-white/8' : 'hover:bg-white/5'
                }`}
                onClick={() => setSelectedSign(impact.sign)}
              >
                <span className="text-white/30 text-xs w-5 font-mono">{i + 1}.</span>
                <span className="text-lg w-7">{impact.glyph}</span>
                <span className="text-white/80 text-sm w-24">{impact.sign}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${impact.score * 10}%`,
                      backgroundColor: impact.colour,
                    }}
                  />
                </div>
                <span
                  className="text-sm font-mono w-10 text-right"
                  style={{ color: impact.colour }}
                >
                  {impact.score}/10
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${impact.colour}15`,
                    color: impact.colour,
                  }}
                >
                  {impact.level}
                </span>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* Zodiac Reading */}
        <section className="mb-8">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white/80 uppercase tracking-wider mb-4">
            Zodiac Reading
          </h2>
          <select
            value={selectedSign}
            onChange={(e) => setSelectedSign(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm appearance-none cursor-pointer w-full sm:w-auto"
            style={{ colorScheme: 'dark' }}
          >
            {impacts.map(impact => (
              <option key={impact.sign} value={impact.sign}>
                {impact.glyph} {impact.sign} — {impact.score}/10 ({impact.level})
              </option>
            ))}
          </select>

          {selectedImpact && selectedImpact.factors.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedImpact.factors.map((factor, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/60"
                >
                  {factor}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 p-6 rounded-xl border border-white/5 min-h-[200px]" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/80 text-lg font-medium font-[family-name:var(--font-display)]">
                {selectedImpact?.glyph} {selectedSign} &middot; Daily Reading
              </h3>
              <button
                onClick={() => generateHoroscope(selectedSign)}
                disabled={isGenerating}
                className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/10 transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? 'Generating...' : '\u21BB Regenerate'}
              </button>
            </div>

            {isGenerating && (
              <div className="flex items-center gap-3 text-white/40">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                <span className="text-sm">Reading the stars for {selectedSign}...</span>
              </div>
            )}

            {generationError && (
              <div className="text-sm space-y-2">
                <p className="text-amber-400/80">{generationError}</p>
                <p className="text-white/30">
                  Add ANTHROPIC_API_KEY to your .env.local file or Vercel environment variables.
                </p>
              </div>
            )}

            {horoscope && !isGenerating && (
              <div>
                <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                  {horoscope}
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => handleCopy('horoscope', horoscope)}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/10 transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    {copiedField === 'horoscope' ? 'Copied' : 'Copy Reading'}
                  </button>
                </div>
              </div>
            )}

            {!horoscope && !isGenerating && !generationError && (
              <p className="text-white/30 text-sm italic">
                Click &ldquo;Regenerate&rdquo; to generate a reading for {selectedSign}.
              </p>
            )}
          </div>
        </section>

        <Divider />

        {/* Social Captions */}
        <section className="mb-8">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white/80 uppercase tracking-wider mb-4">
            Social Captions
          </h2>
          {captions && (
            <div className="space-y-4">
              <CaptionBlock
                label="TikTok Short"
                content={captions.tiktokShort}
                copied={copiedField === 'tiktok'}
                onCopy={() => handleCopy('tiktok', captions.tiktokShort)}
              />
              <CaptionBlock
                label="Instagram Long"
                content={captions.instagramLong}
                copied={copiedField === 'instagram'}
                onCopy={() => handleCopy('instagram', captions.instagramLong)}
              />
              <CaptionBlock
                label="Hashtags"
                content={captions.hashtags}
                copied={copiedField === 'hashtags'}
                onCopy={() => handleCopy('hashtags', captions.hashtags)}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

// --- Sub-components ---

function Divider() {
  return <hr className="border-white/8 mb-8" />
}

function CaptionBlock({ label, content, copied, onCopy }: {
  label: string
  content: string
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div className="p-4 rounded-xl border border-white/5" style={{ background: 'rgba(255,255,255,0.03)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/40 text-xs font-medium uppercase tracking-wider">
          {label}
        </span>
        <button
          onClick={onCopy}
          className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/10 transition-all duration-200 active:scale-95 cursor-pointer"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="text-white/70 text-sm whitespace-pre-wrap font-[family-name:var(--font-body)] leading-relaxed">
        {content}
      </pre>
    </div>
  )
}

// --- Scoring Logic ---

interface ZodiacImpact {
  sign: string
  glyph: string
  score: number
  level: 'quiet' | 'active' | 'intense'
  colour: string
  factors: string[]
}

function calculateZodiacImpacts(
  positions: PlanetPosition[],
  moonData: MoonData,
  kpIndex: number,
  solarClass: string
): ZodiacImpact[] {
  return ZODIAC_SIGNS.map((sign, signIndex) => {
    let score = 0
    const factors: string[] = []
    const signStart = signIndex * 30
    const signEnd = signStart + 30
    const oppositeStart = ((signIndex + 6) % 12) * 30
    const squareStart1 = ((signIndex + 3) % 12) * 30
    const squareStart2 = ((signIndex + 9) % 12) * 30

    for (const planet of positions) {
      const pLong = planet.eclipticLongitude

      // Planet IN this sign
      if (pLong >= signStart && pLong < signEnd) {
        if (planet.name === 'Sun') { score += 3; factors.push(`Sun in ${sign.name}`) }
        else if (planet.name === 'Moon') { score += 2; factors.push(`Moon in ${sign.name}`) }
        else { score += 1; factors.push(`${planet.name} in ${sign.name}`) }
      }

      // Planet in OPPOSITION (180)
      if (pLong >= oppositeStart && pLong < oppositeStart + 30) {
        if (planet.name === 'Sun' || planet.name === 'Moon') {
          score += 2; factors.push(`${planet.name} opposing ${sign.name}`)
        } else {
          score += 1; factors.push(`${planet.name} opposing ${sign.name}`)
        }
      }

      // Planet in SQUARE (90)
      if ((pLong >= squareStart1 && pLong < squareStart1 + 30) ||
          (pLong >= squareStart2 && pLong < squareStart2 + 30)) {
        score += 0.5
      }
    }

    // Moon phase bonus
    const moonSignName = ZODIAC_SIGNS.find(z => z.id === moonData.zodiacSign)?.name
    if (moonData.phase === 'Full Moon' && moonSignName === sign.name) { score += 3; factors.push('Full Moon in sign') }
    if (moonData.phase === 'New Moon' && moonSignName === sign.name) { score += 2; factors.push('New Moon in sign') }

    // Geomagnetic bonus
    if (kpIndex >= 5) { score += 1; factors.push(`Geomagnetic storm (Kp ${kpIndex})`) }

    // Solar flare bonus
    if (solarClass.startsWith('M') || solarClass.startsWith('X')) {
      score += 1; factors.push(`Solar flare: ${solarClass}`)
    }

    score = Math.max(1, Math.min(10, Math.round(score)))

    let colour: string
    let level: 'quiet' | 'active' | 'intense'
    if (score <= 3) { colour = '#22c55e'; level = 'quiet' }
    else if (score <= 6) { colour = '#f59e0b'; level = 'active' }
    else { colour = '#ef4444'; level = 'intense' }

    return { sign: sign.name, glyph: sign.glyph, score, level, colour, factors }
  })
  .sort((a, b) => b.score - a.score)
}

function calculateOverallImpact(
  positions: PlanetPosition[],
  moonData: MoonData,
  kpIndex: number,
  solarClass: string
): { score: number; colour: string; level: string } {
  let score = 3

  // Count planets in same sign (conjunction clusters)
  const signCounts: Record<string, number> = {}
  positions.forEach(p => {
    const signName = ZODIAC_SIGNS.find(z => z.id === p.zodiacSign)?.name ?? p.zodiacSign
    signCounts[signName] = (signCounts[signName] || 0) + 1
  })
  const maxCluster = Math.max(...Object.values(signCounts))
  if (maxCluster >= 4) { score += 3 }
  else if (maxCluster >= 3) { score += 2 }

  // Full/New Moon
  if (moonData.phase === 'Full Moon') score += 2
  if (moonData.phase === 'New Moon') score += 1.5

  // Geomagnetic
  if (kpIndex >= 7) score += 2
  else if (kpIndex >= 5) score += 1

  // Solar
  if (solarClass.startsWith('X')) score += 2
  else if (solarClass.startsWith('M')) score += 1

  score = Math.max(1, Math.min(10, Math.round(score)))

  let colour: string, level: string
  if (score <= 3) { colour = '#22c55e'; level = 'Quiet cosmic day' }
  else if (score <= 6) { colour = '#f59e0b'; level = 'Active cosmic energy' }
  else { colour = '#ef4444'; level = 'Intense cosmic weather' }

  return { score, colour, level }
}

// --- Caption Generation ---

function generateCaptions(
  sign: string,
  glyph: string,
  positions: PlanetPosition[],
  moonData: MoonData,
  impact: ZodiacImpact,
  date: Date,
  horoscope?: string
): { tiktokShort: string; instagramLong: string; hashtags: string } {
  const sunPos = positions.find(p => p.name === 'Sun')
  const moonPos = positions.find(p => p.name === 'Moon')
  const sunSignName = ZODIAC_SIGNS.find(z => z.id === sunPos?.zodiacSign)?.name ?? ''
  const moonSignName = ZODIAC_SIGNS.find(z => z.id === moonPos?.zodiacSign)?.name ?? ''
  const planetsInSign = positions.filter(p => {
    const pSignName = ZODIAC_SIGNS.find(z => z.id === p.zodiacSign)?.name
    return pSignName === sign
  })

  const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  // Extract horoscope sections if available
  const oneWordMatch = horoscope?.match(/TODAY IN ONE WORD[:\s]*(.+)/i)
  const oneWord = oneWordMatch ? oneWordMatch[1].trim() : ''
  const energyMatch = horoscope?.match(/TODAY'S ENERGY[:\s]*\n?([\s\S]*?)(?=\n\n[A-Z]|\n\nWHAT)/i)
  const energySummary = energyMatch ? energyMatch[1].trim() : ''

  const levelEmoji = impact.level === 'intense' ? '\uD83D\uDD25' : impact.level === 'active' ? '\u2728' : '\uD83C\uDF3F'

  const tiktokShort = `${glyph} ${sign} \u2014 ${dateStr}\n\n` +
    (oneWord ? `Today in one word: ${oneWord}\n\n` : '') +
    (energySummary ? `${energySummary}\n\n` : '') +
    `Cosmic impact: ${impact.score}/10 ${levelEmoji}\n\n` +
    `${sunPos?.glyph ?? ''} Sun in ${sunSignName} ${sunPos?.degreeInSign ?? 0}\u00B0\n` +
    `${moonPos?.glyph ?? ''} Moon in ${moonSignName} ${moonPos?.degreeInSign ?? 0}\u00B0 \u2014 ${moonData.phase}\n\n` +
    `Real planetary data. Real frequencies.\nastrara.app`

  const instagramLong = `${glyph} ${sign.toUpperCase()} \u00B7 ${dateStr}\n` +
    `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\n` +
    `Cosmic Impact: ${'\u25CF'.repeat(impact.score)}${'\u25CB'.repeat(10 - impact.score)} ${impact.score}/10\n\n` +
    `Today's sky:\n` +
    positions.map(p => {
      const pSignName = ZODIAC_SIGNS.find(z => z.id === p.zodiacSign)?.name ?? p.zodiacSign
      return `${p.glyph} ${p.name} in ${pSignName} ${p.degreeInSign}\u00B0`
    }).join('\n') +
    `\n\n` +
    `${moonData.phase} \u00B7 ${Math.round(moonData.illumination * 100)}% illumination\n\n` +
    `What this means for ${sign}:\n` +
    impact.factors.map(f => `\u2192 ${f}`).join('\n') +
    `\n\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n` +
    `Real planetary positions calculated from NASA JPL data.\n` +
    `Explore your own cosmic portrait at astrara.app`

  const hashtags = `#${sign.toLowerCase()} #horoscope #astrology #cosmicweather #zodiac ` +
    `#${sign.toLowerCase()}horoscope #todayshoroscope #planetaryalignment ` +
    `#${moonData.phase.toLowerCase().replace(/\s+/g, '')} #soundhealing ` +
    `#astrara #cosmicportrait #harmonicwaves ` +
    `#${sunSignName.toLowerCase()}season`

  return { tiktokShort, instagramLong, hashtags }
}
