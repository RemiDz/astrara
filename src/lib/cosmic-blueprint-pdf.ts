import jsPDF from 'jspdf'
import type { MonthData, OverviewData, CategoryKey } from '@/types/transit-grid'
import { CATEGORY_KEYS } from '@/types/transit-grid'

// ─── Colour Palette ───
const C = {
  bg: '#FAFAF8',
  text: [26, 26, 46] as [number, number, number],       // #1A1A2E
  textLight: [90, 90, 110] as [number, number, number],
  textMuted: [150, 150, 160] as [number, number, number],
  gold: [201, 168, 76] as [number, number, number],      // #C9A84C
  goldHex: '#C9A84C',
  coverBg: [5, 5, 15] as [number, number, number],       // #05050F
  coverText: [240, 240, 245] as [number, number, number],
  coverGold: [201, 168, 76] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
}

const CAT_COLORS: Record<CategoryKey, [number, number, number]> = {
  finance: [201, 168, 76],      // Gold
  relationships: [196, 98, 122], // Rose
  career: [58, 91, 160],        // Deep blue
  health: [45, 139, 78],        // Emerald
  spiritual: [123, 94, 167],    // Purple
}

const CAT_LABELS: Record<CategoryKey | 'monthly_summary', { en: string; lt: string }> = {
  finance: { en: 'Finance & Abundance', lt: 'Finansai ir Perteklius' },
  relationships: { en: 'Relationships & Love', lt: 'Santykiai ir Meile' },
  career: { en: 'Career & Purpose', lt: 'Karjera ir Paskirtis' },
  health: { en: 'Health & Wellbeing', lt: 'Sveikata ir Gerove' },
  spiritual: { en: 'Spiritual Growth', lt: 'Dvasinis Augimas' },
  monthly_summary: { en: 'Monthly Summary', lt: 'Menesio Apzvalga' },
}

function getImpactRGB(score: number): [number, number, number] {
  const t = (score - 1) / 9
  if (t < 0.33) {
    const p = t / 0.33
    return [
      Math.round(45 + (196 - 45) * p),
      Math.round(139 + (167 - 139) * p),
      Math.round(78 + (43 - 78) * p),
    ]
  } else if (t < 0.66) {
    const p = (t - 0.33) / 0.33
    return [
      Math.round(196 + (212 - 196) * p),
      Math.round(167 + (120 - 167) * p),
      Math.round(43 + (47 - 43) * p),
    ]
  } else {
    const p = (t - 0.66) / 0.34
    return [
      Math.round(212 + (196 - 212) * p),
      Math.round(120 + (69 - 120) * p),
      Math.round(47 + (54 - 47) * p),
    ]
  }
}

// ─── Translation helper ───
type Lang = 'en' | 'lt'
const T: Record<string, { en: string; lt: string }> = {
  title: { en: 'Cosmic Blueprint', lt: 'Kosminis Planas' },
  subtitle: { en: 'Your Personal Transit Reading', lt: 'Jusu Asmeninis Tranzitu Skaitymas' },
  subtitle2: { en: 'A 12-Month Astrological Forecast', lt: '12 Menesiu Astrologine Prognoze' },
  preparedFor: { en: 'Prepared for', lt: 'Paruosta' },
  born: { en: 'Born', lt: 'Gimimo data' },
  dateRange: { en: 'Forecast Period', lt: 'Prognozes Laikotarpis' },
  brand: { en: 'Astrara by Harmonic Waves', lt: 'Astrara by Harmonic Waves' },
  yearAtGlance: { en: 'Your Year at a Glance', lt: 'Jusu Metai Vienu Zvilgsniu' },
  impactOverview: { en: '12-Month Impact Overview', lt: '12 Menesiu Poveikio Apzvalga' },
  peakMonths: { en: 'Peak Months', lt: 'Intensyviausi Menesiai' },
  keyThemes: { en: 'Key Planetary Themes', lt: 'Pagrindes Planetines Temos' },
  categoryHighlights: { en: 'Category Highlights', lt: 'Kategoriju Apzvalga' },
  reading: { en: 'Reading', lt: 'Skaitymas' },
  planetaryBreakdown: { en: 'Planetary Breakdown', lt: 'Planetu Analize' },
  practicalGuidance: { en: 'Practical Guidance', lt: 'Praktiniai Patarimai' },
  datesToWatch: { en: 'Dates to Watch', lt: 'Svarbios Datos' },
  monthlySummary: { en: 'Month in a Nutshell', lt: 'Menesio Santrauka' },
  opportunities: { en: 'Opportunities', lt: 'Galimybes' },
  challenges: { en: 'Challenges', lt: 'Issukiai' },
  overviewTitle: { en: '12-Month Overview & Synthesis', lt: '12 Menesiu Apzvalga ir Sinteze' },
  trajectory: { en: 'Trajectory', lt: 'Trajektorija' },
  peakPeriods: { en: 'Peak Periods', lt: 'Intensyviausi Laikotarpiai' },
  keyEvents: { en: 'Key Events', lt: 'Pagrindiniai Ivykiai' },
  grandSummary: { en: 'Year Overview', lt: 'Metu Apzvalga' },
  aboutTitle: { en: 'About This Reading', lt: 'Apie Si Skaityma' },
  aboutMethod: {
    en: 'This Cosmic Blueprint was generated using NASA JPL-accurate planetary ephemeris data from the astronomy-engine library, combined with professional astrological interpretation powered by advanced AI. All planetary positions, aspects, and transit timings are computed from precise astronomical algorithms.',
    lt: 'Sis Kosminis Planas sugeneruotas naudojant NASA JPL tikslumo planetu efemerides duomenis is astronomy-engine bibliotekos, kartu su profesionalia astrologine interpretacija. Visos planetu pozicijos, aspektai ir tranzitu laikai apskaiciuoti tiksliais astronominiais algoritmais.',
  },
  aboutAstrara: {
    en: 'Astrara is a real-time cosmic intelligence platform by Harmonic Waves, providing professional astrology tools backed by precise astronomical data and sound healing integration.',
    lt: 'Astrara yra realaus laiko kosmines ismintis platforma nuo Harmonic Waves, teikianti profesionalius astrologijos irankius, paremtus tiksliais astronominiais duomenimis ir garso terapijos integracija.',
  },
  disclaimer: {
    en: 'This reading is for guidance and self-reflection purposes. It does not constitute financial, medical, or legal advice.',
    lt: 'Sis skaitymas skirtas orientacijai ir savianalzei. Jis nera finansine, medicinine ar teisine konsultacija.',
  },
  page: { en: 'Page', lt: 'Puslapis' },
  impact: { en: 'Impact', lt: 'Poveikis' },
}

function tr(key: string, lang: Lang): string {
  return T[key]?.[lang] ?? T[key]?.en ?? key
}

function catLabel(key: CategoryKey | 'monthly_summary', lang: Lang): string {
  return CAT_LABELS[key]?.[lang] ?? CAT_LABELS[key]?.en ?? key
}

// ─── Font loading ───
async function loadFont(url: string): Promise<string> {
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

async function registerFonts(doc: jsPDF): Promise<boolean> {
  try {
    const [cgRegular, cgBold, dmRegular, dmMedium] = await Promise.all([
      loadFont('/fonts/CormorantGaramond-Regular.ttf'),
      loadFont('/fonts/CormorantGaramond-Bold.ttf'),
      loadFont('/fonts/DMSans-Regular.ttf'),
      loadFont('/fonts/DMSans-Medium.ttf'),
    ])

    doc.addFileToVFS('CormorantGaramond-Regular.ttf', cgRegular)
    doc.addFont('CormorantGaramond-Regular.ttf', 'Cormorant', 'normal')

    doc.addFileToVFS('CormorantGaramond-Bold.ttf', cgBold)
    doc.addFont('CormorantGaramond-Bold.ttf', 'Cormorant', 'bold')

    doc.addFileToVFS('DMSans-Regular.ttf', dmRegular)
    doc.addFont('DMSans-Regular.ttf', 'DMSans', 'normal')

    doc.addFileToVFS('DMSans-Medium.ttf', dmMedium)
    doc.addFont('DMSans-Medium.ttf', 'DMSansMedium', 'normal')

    return true
  } catch (e) {
    console.warn('Failed to load custom fonts, using defaults:', e)
    return false
  }
}

// ─── Drawing helpers ───
const M = 20 // margin
const PW = 210 // A4 width
const PH = 297 // A4 height
const CW = PW - M * 2 // content width

function setDisplay(doc: jsPDF, hasCustom: boolean, size: number, style: string = 'normal') {
  if (hasCustom) {
    doc.setFont('Cormorant', style === 'bold' ? 'bold' : 'normal')
  } else {
    doc.setFont('times', style === 'bold' ? 'bold' : 'normal')
  }
  doc.setFontSize(size)
}

function setBody(doc: jsPDF, hasCustom: boolean, size: number, medium: boolean = false) {
  if (hasCustom) {
    doc.setFont(medium ? 'DMSansMedium' : 'DMSans', 'normal')
  } else {
    doc.setFont('helvetica', medium ? 'bold' : 'normal')
  }
  doc.setFontSize(size)
}

function drawDivider(doc: jsPDF, y: number, width?: number) {
  doc.setDrawColor(...C.gold)
  doc.setLineWidth(0.3)
  const w = width ?? CW
  const x = M + (CW - w) / 2
  doc.line(x, y, x + w, y)
  // Small diamond in center
  const cx = PW / 2
  doc.setFillColor(...C.gold)
  const s = 1.5
  doc.triangle(cx, y - s, cx + s, y, cx, y + s, 'F')
  doc.triangle(cx, y - s, cx - s, y, cx, y + s, 'F')
}

function drawImpactCircle(doc: jsPDF, x: number, y: number, score: number, radius: number = 5) {
  const color = getImpactRGB(score)
  doc.setFillColor(...color)
  doc.circle(x, y, radius, 'F')
  doc.setTextColor(...C.white)
  const fontSize = radius > 4 ? 10 : 8
  setBody(doc, true, fontSize, true)
  const text = String(score)
  const tw = doc.getTextWidth(text)
  doc.text(text, x - tw / 2, y + fontSize * 0.12)
}

function drawPageNumber(doc: jsPDF, page: number, lang: Lang) {
  doc.setTextColor(...C.textMuted)
  setBody(doc, true, 7)
  const text = `${page}`
  const tw = doc.getTextWidth(text)
  doc.text(text, PW / 2 - tw / 2, PH - 10)
}

function drawFooter(doc: jsPDF) {
  doc.setTextColor(...C.textMuted)
  setBody(doc, true, 6)
  const text = 'astrara.app'
  const tw = doc.getTextWidth(text)
  doc.text(text, PW / 2 - tw / 2, PH - 6)
}

function wrapAndDraw(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
  const lines = doc.splitTextToSize(text, maxWidth)
  for (const line of lines) {
    doc.text(line, x, y)
    y += lineHeight
  }
  return y
}

function checkPage(doc: jsPDF, y: number, needed: number, pageNum: { current: number }, lang: Lang): number {
  if (y + needed > PH - 20) {
    drawPageNumber(doc, pageNum.current, lang)
    drawFooter(doc)
    doc.addPage()
    pageNum.current++
    return 22
  }
  return y
}

// ─── Cover Page ───
function drawCoverPage(
  doc: jsPDF,
  hasCustom: boolean,
  clientName: string,
  birthDate: string,
  birthTime: string,
  dateRange: string,
  lang: Lang,
) {
  // Dark background
  doc.setFillColor(...C.coverBg)
  doc.rect(0, 0, PW, PH, 'F')

  // Subtle star field
  doc.setFillColor(255, 255, 255)
  for (let i = 0; i < 80; i++) {
    const sx = Math.random() * PW
    const sy = Math.random() * PH
    const sr = 0.15 + Math.random() * 0.35
    doc.setGState(doc.GState({ opacity: 0.1 + Math.random() * 0.3 }))
    doc.circle(sx, sy, sr, 'F')
  }
  doc.setGState(doc.GState({ opacity: 1 }))

  // Draw zodiac wheel
  drawZodiacWheel(doc, PW / 2, 110, 45)

  // Title
  let y = 180
  doc.setTextColor(...C.coverGold)
  setDisplay(doc, hasCustom, 36, 'normal')
  const title = tr('title', lang)
  const tw = doc.getTextWidth(title)
  doc.text(title, PW / 2 - tw / 2, y)
  y += 12

  // Divider line
  doc.setDrawColor(...C.coverGold)
  doc.setLineWidth(0.4)
  doc.line(PW / 2 - 30, y, PW / 2 + 30, y)
  y += 10

  // Subtitle
  doc.setTextColor(200, 200, 210)
  setDisplay(doc, hasCustom, 14, 'normal')
  const sub = tr('subtitle', lang)
  const sw = doc.getTextWidth(sub)
  doc.text(sub, PW / 2 - sw / 2, y)
  y += 7

  setDisplay(doc, hasCustom, 11, 'normal')
  const sub2 = tr('subtitle2', lang)
  const sw2 = doc.getTextWidth(sub2)
  doc.text(sub2, PW / 2 - sw2 / 2, y)
  y += 16

  // Client name
  if (clientName) {
    doc.setTextColor(...C.coverGold)
    setDisplay(doc, hasCustom, 13, 'normal')
    const prep = `${tr('preparedFor', lang)} ${clientName}`
    const pw = doc.getTextWidth(prep)
    doc.text(prep, PW / 2 - pw / 2, y)
    y += 8
  }

  // Birth data
  if (birthDate) {
    doc.setTextColor(160, 160, 175)
    setBody(doc, hasCustom, 9)
    let birthText = `${tr('born', lang)}: ${birthDate}`
    if (birthTime) birthText += ` ${birthTime}`
    const bw = doc.getTextWidth(birthText)
    doc.text(birthText, PW / 2 - bw / 2, y)
    y += 6
  }

  // Date range
  doc.setTextColor(160, 160, 175)
  setBody(doc, hasCustom, 9)
  const drw = doc.getTextWidth(dateRange)
  doc.text(dateRange, PW / 2 - drw / 2, y)

  // Brand footer
  doc.setTextColor(100, 100, 115)
  setBody(doc, hasCustom, 8)
  const brand = tr('brand', lang) + '  ·  astrara.app'
  const brw = doc.getTextWidth(brand)
  doc.text(brand, PW / 2 - brw / 2, PH - 15)
}

function drawZodiacWheel(doc: jsPDF, cx: number, cy: number, r: number) {
  // Outer ring
  doc.setDrawColor(...C.coverGold)
  doc.setLineWidth(0.6)
  doc.setGState(doc.GState({ opacity: 0.5 }))
  doc.circle(cx, cy, r, 'S')
  doc.circle(cx, cy, r - 8, 'S')

  // Inner ring
  doc.setLineWidth(0.3)
  doc.setGState(doc.GState({ opacity: 0.3 }))
  doc.circle(cx, cy, r - 16, 'S')

  // Spoke lines
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 - 90) * Math.PI / 180
    const x1 = cx + (r - 8) * Math.cos(angle)
    const y1 = cy + (r - 8) * Math.sin(angle)
    const x2 = cx + r * Math.cos(angle)
    const y2 = cy + r * Math.sin(angle)
    doc.line(x1, y1, x2, y2)
  }

  // Sign labels (using simple letters as stand-in — Unicode zodiac glyphs)
  doc.setGState(doc.GState({ opacity: 0.6 }))
  doc.setTextColor(...C.coverGold)
  setBody(doc, true, 7)

  for (let i = 0; i < 12; i++) {
    const angle = ((i * 30) + 15 - 90) * Math.PI / 180
    const labelR = r - 4
    const lx = cx + labelR * Math.cos(angle)
    const ly = cy + labelR * Math.sin(angle)
    // Use simple Roman numeral-style indicators since Unicode zodiac might not render
    const labels = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
    const ltw = doc.getTextWidth(labels[i])
    doc.text(labels[i], lx - ltw / 2, ly + 1.5)
  }

  // Centre dot
  doc.setGState(doc.GState({ opacity: 0.4 }))
  doc.setFillColor(...C.coverGold)
  doc.circle(cx, cy, 2, 'F')

  doc.setGState(doc.GState({ opacity: 1 }))
}

// ─── Year at a Glance ───
function drawYearAtGlance(
  doc: jsPDF,
  hasCustom: boolean,
  months: MonthData[],
  overview: OverviewData | null,
  lang: Lang,
  pageNum: { current: number },
) {
  let y = 28

  // Title
  doc.setTextColor(...C.text)
  setDisplay(doc, hasCustom, 22, 'normal')
  doc.text(tr('yearAtGlance', lang), M, y)
  y += 8

  drawDivider(doc, y, CW)
  y += 14

  // Impact timeline bar
  doc.setTextColor(...C.text)
  setDisplay(doc, hasCustom, 12, 'normal')
  doc.text(tr('impactOverview', lang), M, y)
  y += 8

  const barH = 12
  const barW = CW
  const segW = barW / 12

  for (let i = 0; i < months.length; i++) {
    const m = months[i]
    const score = m.categories.monthly_summary.impact_score
    const color = getImpactRGB(score)
    doc.setFillColor(...color)
    doc.roundedRect(M + i * segW + 0.5, y, segW - 1, barH, 1, 1, 'F')

    // Score number
    doc.setTextColor(...C.white)
    setBody(doc, hasCustom, 7, true)
    const numText = String(score)
    const nw = doc.getTextWidth(numText)
    doc.text(numText, M + i * segW + segW / 2 - nw / 2, y + barH / 2 + 1.5)
  }
  y += barH + 3

  // Month labels
  doc.setTextColor(...C.textMuted)
  setBody(doc, hasCustom, 5)
  for (let i = 0; i < months.length; i++) {
    const shortMonth = months[i].month.split(' ')[0].substring(0, 3)
    const lw = doc.getTextWidth(shortMonth)
    doc.text(shortMonth, M + i * segW + segW / 2 - lw / 2, y + 3)
  }
  y += 12

  drawDivider(doc, y, 60)
  y += 10

  // Peak months
  doc.setTextColor(...C.text)
  setDisplay(doc, hasCustom, 12, 'normal')
  doc.text(tr('peakMonths', lang), M, y)
  y += 7

  const sorted = [...months].sort((a, b) =>
    b.categories.monthly_summary.impact_score - a.categories.monthly_summary.impact_score
  )
  const top3 = sorted.slice(0, 3)

  setBody(doc, hasCustom, 9)
  for (const m of top3) {
    const score = m.categories.monthly_summary.impact_score
    drawImpactCircle(doc, M + 4, y + 1, score, 3.5)

    doc.setTextColor(...C.text)
    setBody(doc, hasCustom, 9, true)
    doc.text(m.month, M + 12, y + 2.5)

    doc.setTextColor(...C.textLight)
    setBody(doc, hasCustom, 8)
    const theme = m.categories.monthly_summary.dominant_theme
    const wrapped = doc.splitTextToSize(theme, CW - 50)
    doc.text(wrapped[0], M + 50, y + 2.5)
    y += wrapped.length > 1 ? 10 : 8
  }

  y += 6
  drawDivider(doc, y, 60)
  y += 10

  // Category highlights
  doc.setTextColor(...C.text)
  setDisplay(doc, hasCustom, 12, 'normal')
  doc.text(tr('categoryHighlights', lang), M, y)
  y += 8

  if (overview) {
    for (const cat of CATEGORY_KEYS) {
      const data = overview.categories[cat]
      if (!data) continue

      const color = CAT_COLORS[cat]
      doc.setFillColor(...color)
      doc.circle(M + 3, y + 0.5, 2, 'F')

      doc.setTextColor(...color)
      setBody(doc, hasCustom, 9, true)
      doc.text(catLabel(cat, lang), M + 9, y + 2)

      doc.setTextColor(...C.textLight)
      setBody(doc, hasCustom, 8)
      const text = `${tr('impact', lang)}: ${data.impact_score}/10  ·  ${data.trajectory ?? ''}`
      doc.text(text, M + 55, y + 2)

      y += 6

      // Year trend (1 line summary)
      if (data.year_trend) {
        doc.setTextColor(...C.textLight)
        setBody(doc, hasCustom, 8)
        const trendLine = doc.splitTextToSize(data.year_trend, CW - 8)
        doc.text(trendLine[0], M + 9, y + 1)
        if (trendLine.length > 1) {
          doc.text(trendLine[1], M + 9, y + 5)
          y += 5
        }
        y += 6
      }
    }
  }

  drawPageNumber(doc, pageNum.current, lang)
  drawFooter(doc)
}

// ─── Monthly Page ───
function drawMonthlyPage(
  doc: jsPDF,
  hasCustom: boolean,
  month: MonthData,
  lang: Lang,
  pageNum: { current: number },
) {
  let y = 22

  // Month header
  const overallScore = month.categories.monthly_summary.impact_score

  doc.setTextColor(...C.text)
  setDisplay(doc, hasCustom, 24, 'normal')
  doc.text(month.month, M, y + 5)

  // Impact circle
  drawImpactCircle(doc, PW - M - 6, y + 2, overallScore, 6)

  y += 14

  // Key players
  const players = month.categories.monthly_summary.key_players
  if (players && players.length > 0) {
    doc.setTextColor(...C.textMuted)
    setBody(doc, hasCustom, 7)
    doc.text(players.join('  ·  '), M, y)
    y += 4
  }

  drawDivider(doc, y, CW)
  y += 6

  // Draw 5 categories
  for (const cat of CATEGORY_KEYS) {
    const reading = month.categories[cat]
    if (!reading) continue

    y = checkPage(doc, y, 55, pageNum, lang)

    const catColor = CAT_COLORS[cat]

    // Category header with impact
    doc.setFillColor(...catColor)
    doc.roundedRect(M, y, CW, 6, 1, 1, 'F')
    doc.setTextColor(...C.white)
    setBody(doc, hasCustom, 8, true)
    doc.text(catLabel(cat, lang), M + 3, y + 4.2)

    // Score
    const scoreText = `${reading.impact_score}/10`
    const stw = doc.getTextWidth(scoreText)
    doc.text(scoreText, PW - M - stw - 3, y + 4.2)
    y += 9

    // Key theme
    doc.setTextColor(...C.text)
    setBody(doc, hasCustom, 9, true)
    y = wrapAndDraw(doc, reading.key_theme, M + 2, y, CW - 4, 4.5)
    y += 2

    // Full reading
    doc.setTextColor(...C.textLight)
    setBody(doc, hasCustom, 8)
    y = wrapAndDraw(doc, reading.full_reading, M + 2, y, CW - 4, 4)
    y += 2

    // Planetary breakdown (compact)
    if (reading.planetary_breakdown && reading.planetary_breakdown.length > 0) {
      y = checkPage(doc, y, 10, pageNum, lang)
      doc.setTextColor(...C.textMuted)
      setBody(doc, hasCustom, 6)
      const planets = reading.planetary_breakdown.map(p => {
        const aspects = p.aspects?.map(a => `${a.symbol}${a.target}`).join(' ') ?? ''
        return `${p.symbol} ${p.planet} ${p.position} ${aspects}`
      }).join('  |  ')
      const planetLines = doc.splitTextToSize(planets, CW - 4)
      for (const line of planetLines.slice(0, 2)) {
        doc.text(line, M + 2, y)
        y += 3.5
      }
    }

    // Practical guidance
    if (reading.practical_guidance) {
      y = checkPage(doc, y, 8, pageNum, lang)
      doc.setTextColor(...C.textLight)
      setBody(doc, hasCustom, 7)
      // Italic simulation via color
      doc.setTextColor(100, 90, 120)
      const guidance = doc.splitTextToSize(reading.practical_guidance, CW - 4)
      for (const line of guidance.slice(0, 2)) {
        doc.text(line, M + 2, y)
        y += 3.5
      }
    }

    // Dates to watch
    if (reading.dates_to_watch && reading.dates_to_watch.length > 0) {
      y = checkPage(doc, y, 6, pageNum, lang)
      doc.setTextColor(...C.gold)
      setBody(doc, hasCustom, 6, true)
      for (const date of reading.dates_to_watch.slice(0, 2)) {
        doc.text(`* ${date}`, M + 2, y)
        y += 3.5
      }
    }

    y += 3
  }

  // Monthly summary at bottom
  const summary = month.categories.monthly_summary
  y = checkPage(doc, y, 30, pageNum, lang)

  doc.setDrawColor(...C.gold)
  doc.setLineWidth(0.3)
  doc.line(M, y, PW - M, y)
  y += 5

  doc.setTextColor(...C.gold)
  setDisplay(doc, hasCustom, 10, 'normal')
  doc.text(tr('monthlySummary', lang), M, y)
  y += 5

  doc.setTextColor(...C.text)
  setBody(doc, hasCustom, 8)
  y = wrapAndDraw(doc, summary.dominant_theme, M, y, CW, 4)
  y += 2

  if (summary.opportunities) {
    doc.setTextColor(45, 139, 78)
    setBody(doc, hasCustom, 7)
    const oppText = `${tr('opportunities', lang)}: ${summary.opportunities}`
    y = wrapAndDraw(doc, oppText, M, y, CW, 3.5)
    y += 1
  }

  if (summary.challenges) {
    doc.setTextColor(196, 69, 54)
    setBody(doc, hasCustom, 7)
    const chalText = `${tr('challenges', lang)}: ${summary.challenges}`
    y = wrapAndDraw(doc, chalText, M, y, CW, 3.5)
  }

  drawPageNumber(doc, pageNum.current, lang)
  drawFooter(doc)
}

// ─── Overview Page ───
function drawOverviewPage(
  doc: jsPDF,
  hasCustom: boolean,
  overview: OverviewData,
  lang: Lang,
  pageNum: { current: number },
) {
  let y = 28

  doc.setTextColor(...C.text)
  setDisplay(doc, hasCustom, 20, 'normal')
  doc.text(tr('overviewTitle', lang), M, y)
  y += 8

  drawDivider(doc, y, CW)
  y += 10

  // Per-category overview
  for (const cat of CATEGORY_KEYS) {
    const data = overview.categories[cat]
    if (!data) continue

    y = checkPage(doc, y, 30, pageNum, lang)

    const catColor = CAT_COLORS[cat]

    // Category header
    doc.setFillColor(...catColor)
    doc.circle(M + 3, y + 0.5, 2, 'F')
    doc.setTextColor(...catColor)
    setDisplay(doc, hasCustom, 11, 'normal')
    doc.text(catLabel(cat, lang), M + 9, y + 2.5)

    // Score and trajectory
    const scoreColor = getImpactRGB(data.impact_score)
    doc.setTextColor(...scoreColor)
    setBody(doc, hasCustom, 8, true)
    const meta = `${data.impact_score}/10  ·  ${data.trajectory ?? ''}`
    const metaW = doc.getTextWidth(meta)
    doc.text(meta, PW - M - metaW, y + 2.5)
    y += 7

    // Year trend
    if (data.year_trend) {
      doc.setTextColor(...C.textLight)
      setBody(doc, hasCustom, 8)
      y = wrapAndDraw(doc, data.year_trend, M + 9, y, CW - 18, 4)
      y += 1
    }

    // Full reading
    if (data.full_reading) {
      doc.setTextColor(...C.textLight)
      setBody(doc, hasCustom, 8)
      y = wrapAndDraw(doc, data.full_reading, M + 9, y, CW - 18, 4)
      y += 1
    }

    // Peak months
    if (data.peak_months && data.peak_months.length > 0) {
      doc.setTextColor(...C.gold)
      setBody(doc, hasCustom, 7)
      doc.text(`${tr('peakPeriods', lang)}: ${data.peak_months.join(', ')}`, M + 9, y)
      y += 4
    }

    y += 4
  }

  // Grand summary
  const grand = overview.categories.grand_summary
  if (grand) {
    y = checkPage(doc, y, 35, pageNum, lang)

    drawDivider(doc, y, 60)
    y += 8

    doc.setTextColor(...C.gold)
    setDisplay(doc, hasCustom, 14, 'normal')
    doc.text(tr('grandSummary', lang), M, y)
    y += 7

    if (grand.dominant_theme) {
      doc.setTextColor(...C.text)
      setBody(doc, hasCustom, 9, true)
      y = wrapAndDraw(doc, grand.dominant_theme, M, y, CW, 4.5)
      y += 2
    }

    if (grand.full_reading) {
      doc.setTextColor(...C.textLight)
      setBody(doc, hasCustom, 8)
      y = wrapAndDraw(doc, grand.full_reading, M, y, CW, 4)
      y += 2
    }

    if (grand.trajectory) {
      doc.setTextColor(...C.gold)
      setBody(doc, hasCustom, 8, true)
      doc.text(`${tr('trajectory', lang)}: ${grand.trajectory}`, M, y)
      y += 5
    }

    if (grand.peak_months && grand.peak_months.length > 0) {
      doc.setTextColor(...C.textMuted)
      setBody(doc, hasCustom, 7)
      doc.text(`${tr('peakPeriods', lang)}: ${grand.peak_months.join(', ')}`, M, y)
    }
  }

  drawPageNumber(doc, pageNum.current, lang)
  drawFooter(doc)
}

// ─── About Page ───
function drawAboutPage(
  doc: jsPDF,
  hasCustom: boolean,
  lang: Lang,
  pageNum: { current: number },
) {
  let y = 40

  // Title
  doc.setTextColor(...C.text)
  setDisplay(doc, hasCustom, 18, 'normal')
  doc.text(tr('aboutTitle', lang), M, y)
  y += 10

  drawDivider(doc, y, 50)
  y += 12

  // Methodology
  doc.setTextColor(...C.textLight)
  setBody(doc, hasCustom, 9)
  y = wrapAndDraw(doc, tr('aboutMethod', lang), M, y, CW, 4.5)
  y += 10

  // About Astrara
  doc.setTextColor(...C.gold)
  setDisplay(doc, hasCustom, 12, 'normal')
  doc.text('Astrara', M, y)
  y += 6

  doc.setTextColor(...C.textLight)
  setBody(doc, hasCustom, 9)
  y = wrapAndDraw(doc, tr('aboutAstrara', lang), M, y, CW, 4.5)
  y += 10

  // Contact
  doc.setTextColor(...C.gold)
  setBody(doc, hasCustom, 10, true)
  doc.text('astrara.app', M, y)
  y += 15

  // Disclaimer
  drawDivider(doc, y, 40)
  y += 8

  doc.setTextColor(...C.textMuted)
  setBody(doc, hasCustom, 7)
  y = wrapAndDraw(doc, tr('disclaimer', lang), M, y, CW, 3.5)

  drawPageNumber(doc, pageNum.current, lang)
  drawFooter(doc)
}

// ─── Main export function ───
export interface CosmicBlueprintParams {
  months: MonthData[]
  overview: OverviewData | null
  clientName: string
  birthDate: string
  birthTime: string
  language: 'en' | 'lt'
}

export async function generateCosmicBlueprint(params: CosmicBlueprintParams) {
  const { months, overview, clientName, birthDate, birthTime, language } = params

  if (months.length === 0) return

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const hasCustom = await registerFonts(doc)
  const pageNum = { current: 1 }

  // Date range
  const firstMonth = months[0].month
  const lastMonth = months[months.length - 1].month
  const dateRange = `${firstMonth} — ${lastMonth}`

  // ─── Page 1: Cover ───
  drawCoverPage(doc, hasCustom, clientName, birthDate, birthTime, dateRange, language)

  // ─── Page 2: Year at a Glance ───
  doc.addPage()
  pageNum.current++
  drawYearAtGlance(doc, hasCustom, months, overview, language, pageNum)

  // ─── Pages 3–14: Monthly Deep Dives ───
  for (const month of months) {
    doc.addPage()
    pageNum.current++
    drawMonthlyPage(doc, hasCustom, month, language, pageNum)
  }

  // ─── Page 15: Overview ───
  if (overview) {
    doc.addPage()
    pageNum.current++
    drawOverviewPage(doc, hasCustom, overview, language, pageNum)
  }

  // ─── Final Page: About ───
  doc.addPage()
  pageNum.current++
  drawAboutPage(doc, hasCustom, language, pageNum)

  // Save
  const safeName = (clientName || 'cosmic').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const today = new Date().toISOString().split('T')[0]
  doc.save(`cosmic-blueprint-${safeName}-${today}.pdf`)
}
