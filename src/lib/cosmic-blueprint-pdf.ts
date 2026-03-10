import jsPDF from 'jspdf'
import type { MonthData, OverviewData, CategoryKey } from '@/types/transit-grid'
import { CATEGORY_KEYS } from '@/types/transit-grid'
import type { BlueprintMonthNarrative, BlueprintYearOverview, BlueprintCategoryKey } from '@/types/cosmic-blueprint'
import { BLUEPRINT_CATEGORY_KEYS } from '@/types/cosmic-blueprint'

// ═══════════════════════════════════════════════════════════════════════════
// Colour Palette — Print-Optimised Luxury
// ═══════════════════════════════════════════════════════════════════════════

type RGB = [number, number, number]

const P = {
  paper: '#FAF8F5',
  paperRGB: [250, 248, 245] as RGB,
  navy: [18, 18, 42] as RGB,           // #12122A — primary text
  navyHex: '#12122A',
  grey: [107, 107, 128] as RGB,        // #6B6B80 — secondary text
  mutedGrey: [160, 160, 175] as RGB,   // page numbers etc
  gold: [196, 162, 101] as RGB,        // #C4A265 — accent
  goldHex: '#C4A265',
  coverBg: [8, 8, 20] as RGB,          // deep dark
  coverText: [230, 230, 238] as RGB,
  white: [255, 255, 255] as RGB,
}

const CAT_RGB: Record<BlueprintCategoryKey, RGB> = {
  finance: [184, 150, 62],        // #B8963E antique gold
  relationships: [184, 92, 111],  // #B85C6F dusty rose
  career: [58, 79, 138],          // #3A4F8A deep sapphire
  health: [42, 123, 82],          // #2A7B52 forest emerald
  spiritual: [107, 77, 138],      // #6B4D8A royal amethyst
}

// Also export category labels for the grid-based PDF
const CAT_COLORS: Record<CategoryKey, RGB> = {
  finance: [184, 150, 62],
  relationships: [184, 92, 111],
  career: [58, 79, 138],
  health: [42, 123, 82],
  spiritual: [107, 77, 138],
}

const CAT_LABELS_BI: Record<BlueprintCategoryKey, { en: string; lt: string }> = {
  finance: { en: 'Finance & Abundance', lt: 'Finansai ir Perteklius' },
  relationships: { en: 'Relationships & Love', lt: 'Santykiai ir Meile' },
  career: { en: 'Career & Purpose', lt: 'Karjera ir Paskirtis' },
  health: { en: 'Health & Wellbeing', lt: 'Sveikata ir Gerove' },
  spiritual: { en: 'Spiritual Growth', lt: 'Dvasinis Augimas' },
}

const CAT_LABELS: Record<CategoryKey | 'monthly_summary', { en: string; lt: string }> = {
  ...CAT_LABELS_BI,
  monthly_summary: { en: 'Monthly Summary', lt: 'Menesio Apzvalga' },
}

// Impact gradient: Sage → Amber → Vermillion
function getImpactRGB(score: number): RGB {
  const t = Math.max(0, Math.min(1, (score - 1) / 9))
  if (t < 0.5) {
    const p = t / 0.5
    return [
      Math.round(91 + (196 - 91) * p),   // 5B → C4
      Math.round(138 + (150 - 138) * p),  // 8A → 96
      Math.round(107 + (62 - 107) * p),   // 6B → 3E
    ]
  } else {
    const p = (t - 0.5) / 0.5
    return [
      Math.round(196 + (184 - 196) * p),  // C4 → B8
      Math.round(150 + (74 - 150) * p),   // 96 → 4A
      Math.round(62 + (62 - 62) * p),     // 3E → 3E
    ]
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Translation
// ═══════════════════════════════════════════════════════════════════════════

type Lang = 'en' | 'lt'

const T: Record<string, { en: string; lt: string }> = {
  title: { en: 'COSMIC BLUEPRINT', lt: 'KOSMINIS PLANAS' },
  subtitle: { en: 'Your Personal Transit Reading', lt: 'Jusu Asmeninis Tranzitu Skaitymas' },
  subtitle2: { en: 'A 12-Month Astrological Forecast', lt: '12 Menesiu Astrologine Prognoze' },
  preparedFor: { en: 'Prepared for', lt: 'Paruosta' },
  born: { en: 'Born', lt: 'Gimimo data' },
  brand: { en: 'ASTRARA', lt: 'ASTRARA' },
  brandSub: { en: 'astrara.app', lt: 'astrara.app' },

  // Page 2
  introTitle: { en: 'Your Cosmic Year Ahead', lt: 'Jusu Kosminiai Metai' },
  introGreeting: {
    en: 'Welcome to your personal Cosmic Blueprint — a detailed map of the planetary energies shaping your life over the coming twelve months.',
    lt: 'Sveiki atvyke i jusu asmenini Kosmini Plana — detalu planetu energiju zemelapi, formuojanti jusu gyvenima ateinanciais dvylika menesiu.',
  },
  introMethod: {
    en: 'This reading is based on precise astronomical calculations of planetary positions (NASA JPL ephemeris data) combined with professional astrological interpretation.',
    lt: 'Sis skaitymas paremtas tiksliais astronominiais planetu poziciju skaiciavimais (NASA JPL efemerides duomenys) kartu su profesionalia astrologine interpretacija.',
  },
  introNatal: {
    en: 'Your natal chart has been integrated, making these readings specific to YOUR unique planetary blueprint.',
    lt: 'Jusu gimimo zemelapis integruotas, todel sie skaitymai specifiskai pritaikyti JUSU unikaliam planetiniam planui.',
  },
  introHowTo: { en: 'How to Read This Report', lt: 'Kaip Skaityti Si Ataskaita' },
  introScoring: {
    en: 'Impact scores from 1-10 indicate the intensity of cosmic activity in each area. Higher scores don\'t mean "bad" — they mean more energy, more potential, more to work with.',
    lt: 'Poveikio balai nuo 1 iki 10 rodo kosmines veiklos intensyvuma kiekvienoje srityje. Didesni balai nereiskia "blogai" — jie reiskia daugiau energijos, daugiau potencialo, daugiau galimybiu.',
  },

  // Page 3
  yearGlance: { en: 'Your Year at a Glance', lt: 'Jusu Metai Vienu Zvilgsniu' },
  impactTimeline: { en: '12-Month Impact Timeline', lt: '12 Menesiu Poveikio Laiko Juosta' },
  categoryScores: { en: 'Category Year Scores', lt: 'Kategoriju Metiniu Balu' },
  peakMonths: { en: 'Peak Months', lt: 'Intensyviausi Menesiai' },

  // Pages 4-15
  impact: { en: 'Impact', lt: 'Poveikis' },

  // Page 16
  yearPerspective: { en: 'Your Year in Perspective', lt: 'Jusu Metai Perspektyvoje' },

  // Page 17
  movingForward: { en: 'Moving Forward', lt: 'Zvelgiant i Prieki' },
  keyDates: { en: 'Key Dates to Remember', lt: 'Svarbios Datos' },
  withCosmicLight: { en: 'With cosmic light,', lt: 'Su kosmine sviesa,' },

  // Page 18
  aboutTitle: { en: 'About This Reading', lt: 'Apie Si Skaityma' },
  aboutMethod: {
    en: 'This Cosmic Blueprint was generated using NASA JPL-accurate planetary ephemeris data from the astronomy-engine library, combined with professional astrological interpretation powered by advanced AI. All planetary positions, aspects, and transit timings are computed from precise astronomical algorithms.',
    lt: 'Sis Kosminis Planas sukurtas naudojant NASA JPL tikslumo planetu efemerides duomenis is astronomy-engine bibliotekos, kartu su profesionalia astrologine interpretacija. Visos planetu pozicijos, aspektai ir tranzitu laikai apskaiciuoti tiksliais astronominiais algoritmais.',
  },
  aboutAstrara: {
    en: 'Astrara is a real-time cosmic intelligence platform by Harmonic Waves, providing professional astrology tools backed by precise astronomical data and sound healing integration.',
    lt: 'Astrara yra realaus laiko kosmines ismintis platforma nuo Harmonic Waves, teikianti profesionalius astrologijos irankius, paremtus tiksliais astronominiais duomenimis ir garso terapijos integracija.',
  },
  disclaimer: {
    en: 'This reading is for guidance and self-reflection. It does not constitute financial, medical, or legal advice.',
    lt: 'Sis skaitymas skirtas orientacijai ir savianalzei. Jis nera finansine, medicinine ar teisine konsultacija.',
  },
}

function tr(key: string, lang: Lang): string {
  return T[key]?.[lang] ?? T[key]?.en ?? key
}

function catLabel(key: BlueprintCategoryKey, lang: Lang): string {
  return CAT_LABELS_BI[key]?.[lang] ?? key
}

function catLabelGrid(key: CategoryKey | 'monthly_summary', lang: Lang): string {
  return CAT_LABELS[key]?.[lang] ?? key
}

// ═══════════════════════════════════════════════════════════════════════════
// Font Loading
// ═══════════════════════════════════════════════════════════════════════════

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

interface FontSet {
  hasCormorant: boolean
  hasDMSans: boolean
  hasItalic: boolean
}

async function registerFonts(doc: jsPDF): Promise<FontSet> {
  const result: FontSet = { hasCormorant: false, hasDMSans: false, hasItalic: false }

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
    result.hasCormorant = true

    doc.addFileToVFS('DMSans-Regular.ttf', dmRegular)
    doc.addFont('DMSans-Regular.ttf', 'DMSans', 'normal')
    doc.addFileToVFS('DMSans-Medium.ttf', dmMedium)
    doc.addFont('DMSans-Medium.ttf', 'DMSansMedium', 'normal')
    result.hasDMSans = true

    // Try loading italic
    try {
      const cgItalic = await loadFont('/fonts/CormorantGaramond-Italic.ttf')
      doc.addFileToVFS('CormorantGaramond-Italic.ttf', cgItalic)
      doc.addFont('CormorantGaramond-Italic.ttf', 'CormorantItalic', 'normal')
      result.hasItalic = true
    } catch {
      // Italic not available — will use regular
    }
  } catch (e) {
    console.warn('Failed to load custom fonts:', e)
  }

  return result
}

// ═══════════════════════════════════════════════════════════════════════════
// Drawing Constants & Helpers
// ═══════════════════════════════════════════════════════════════════════════

const PW = 210  // A4 width mm
const PH = 297  // A4 height mm
const ML = 20   // left margin
const MR = 20   // right margin
const MT = 25   // top margin
const MB = 20   // bottom margin
const CW = PW - ML - MR  // content width

function setDisplay(doc: jsPDF, f: FontSet, size: number, style: 'normal' | 'bold' = 'normal') {
  if (f.hasCormorant) {
    doc.setFont('Cormorant', style)
  } else {
    doc.setFont('times', style)
  }
  doc.setFontSize(size)
}

function setDisplayItalic(doc: jsPDF, f: FontSet, size: number) {
  if (f.hasItalic) {
    doc.setFont('CormorantItalic', 'normal')
  } else if (f.hasCormorant) {
    doc.setFont('Cormorant', 'normal')
  } else {
    doc.setFont('times', 'italic')
  }
  doc.setFontSize(size)
}

function setBody(doc: jsPDF, f: FontSet, size: number, medium: boolean = false) {
  if (f.hasDMSans) {
    doc.setFont(medium ? 'DMSansMedium' : 'DMSans', 'normal')
  } else {
    doc.setFont('helvetica', medium ? 'bold' : 'normal')
  }
  doc.setFontSize(size)
}

function goldLine(doc: jsPDF, y: number, width?: number) {
  doc.setDrawColor(...P.gold)
  doc.setLineWidth(0.5)
  const w = width ?? CW
  const x = ML + (CW - w) / 2
  doc.line(x, y, x + w, y)
}

function goldLineFull(doc: jsPDF, y: number) {
  doc.setDrawColor(...P.gold)
  doc.setLineWidth(0.3)
  doc.line(ML, y, PW - MR, y)
}

function starDot(doc: jsPDF, x: number, y: number) {
  doc.setFillColor(...P.gold)
  doc.circle(x, y, 0.5, 'F')
}

function wrapDraw(doc: jsPDF, text: string, x: number, y: number, maxW: number, lh: number): number {
  if (!text) return y
  const lines = doc.splitTextToSize(text, maxW)
  for (const line of lines) {
    doc.text(line, x, y)
    y += lh
  }
  return y
}

function drawImpactDot(doc: jsPDF, f: FontSet, x: number, y: number, score: number, r: number = 5) {
  const color = getImpactRGB(score)
  doc.setFillColor(...color)
  doc.circle(x, y, r, 'F')
  doc.setTextColor(...P.white)
  const fs = r > 4 ? 11 : 8
  setBody(doc, f, fs, true)
  const txt = String(score)
  const tw = doc.getTextWidth(txt)
  doc.text(txt, x - tw / 2, y + fs * 0.12)
}

function pageFooter(doc: jsPDF, f: FontSet, pageNum: number, clientName: string, lang: Lang) {
  // Running header (pages 3+)
  if (pageNum >= 3) {
    doc.setTextColor(...P.mutedGrey)
    setBody(doc, f, 6)
    const header = `Cosmic Blueprint  ·  ${clientName || ''}`
    doc.text(header, ML, 12)
  }

  // Page number
  doc.setTextColor(...P.mutedGrey)
  setBody(doc, f, 7)
  const pn = `— ${pageNum} —`
  const pw = doc.getTextWidth(pn)
  doc.text(pn, PW / 2 - pw / 2, PH - 12)
}

function needsNewPage(doc: jsPDF, y: number, needed: number): boolean {
  return y + needed > PH - MB - 10
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 1 — Cover
// ═══════════════════════════════════════════════════════════════════════════

function drawCover(
  doc: jsPDF, f: FontSet, clientName: string, birthDate: string,
  birthTime: string, dateRange: string, lang: Lang,
) {
  // Full dark background
  doc.setFillColor(...P.coverBg)
  doc.rect(0, 0, PW, PH, 'F')

  // Star field — 50 scattered tiny dots
  doc.setFillColor(255, 255, 255)
  const rng = (seed: number) => {
    let x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }
  for (let i = 0; i < 50; i++) {
    const sx = rng(i * 127 + 13) * PW
    const sy = rng(i * 231 + 47) * PH
    const sr = 0.1 + rng(i * 89 + 5) * 0.3
    const op = 0.1 + rng(i * 337 + 71) * 0.25
    doc.setGState(doc.GState({ opacity: op }))
    doc.circle(sx, sy, sr, 'F')
  }
  doc.setGState(doc.GState({ opacity: 1 }))

  // Zodiac wheel
  const cx = PW / 2, cy = 100, wr = 38
  doc.setDrawColor(...P.gold)
  doc.setGState(doc.GState({ opacity: 0.5 }))
  doc.setLineWidth(0.6)
  doc.circle(cx, cy, wr, 'S')
  doc.setLineWidth(0.4)
  doc.circle(cx, cy, wr - 7, 'S')
  doc.setLineWidth(0.2)
  doc.setGState(doc.GState({ opacity: 0.25 }))
  doc.circle(cx, cy, wr - 14, 'S')

  // 12 spoke lines
  doc.setGState(doc.GState({ opacity: 0.35 }))
  doc.setLineWidth(0.3)
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 - 90) * Math.PI / 180
    const x1 = cx + (wr - 7) * Math.cos(angle)
    const y1 = cy + (wr - 7) * Math.sin(angle)
    const x2 = cx + wr * Math.cos(angle)
    const y2 = cy + wr * Math.sin(angle)
    doc.line(x1, y1, x2, y2)
  }

  // Roman numeral labels in wheel segments
  doc.setGState(doc.GState({ opacity: 0.5 }))
  doc.setTextColor(...P.gold)
  setBody(doc, f, 6)
  const labels = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
  for (let i = 0; i < 12; i++) {
    const angle = ((i * 30) + 15 - 90) * Math.PI / 180
    const lr = wr - 3.5
    const lx = cx + lr * Math.cos(angle)
    const ly = cy + lr * Math.sin(angle)
    const ltw = doc.getTextWidth(labels[i])
    doc.text(labels[i], lx - ltw / 2, ly + 1.5)
  }

  // Decorative planet dots inside
  doc.setGState(doc.GState({ opacity: 0.3 }))
  doc.setFillColor(...P.gold)
  const planetAngles = [15, 67, 112, 148, 195, 238, 280, 320]
  for (let i = 0; i < planetAngles.length; i++) {
    const ang = planetAngles[i] * Math.PI / 180
    const pr = (wr - 14) * (0.3 + rng(i * 73 + 11) * 0.6)
    doc.circle(cx + pr * Math.cos(ang), cy + pr * Math.sin(ang), 0.8 + rng(i * 37) * 0.7, 'F')
  }

  // Centre dot
  doc.setGState(doc.GState({ opacity: 0.4 }))
  doc.circle(cx, cy, 1.5, 'F')
  doc.setGState(doc.GState({ opacity: 1 }))

  // ─── Title block ───
  let y = 162

  doc.setTextColor(...P.gold)
  setDisplay(doc, f, 30, 'normal')
  const title = tr('title', lang)
  const ttw = doc.getTextWidth(title)
  doc.text(title, PW / 2 - ttw / 2, y)
  y += 10

  // Gold line
  doc.setDrawColor(...P.gold)
  doc.setLineWidth(0.4)
  doc.line(PW / 2 - 30, y, PW / 2 + 30, y)
  y += 9

  // Subtitle
  doc.setTextColor(160, 160, 176)
  setDisplay(doc, f, 14, 'normal')
  const sub = tr('subtitle', lang)
  const stw = doc.getTextWidth(sub)
  doc.text(sub, PW / 2 - stw / 2, y)
  y += 18

  // Client name
  if (clientName) {
    doc.setTextColor(...P.white)
    setDisplay(doc, f, 16, 'normal')
    const prep = clientName
    const pw = doc.getTextWidth(prep)
    doc.text(prep, PW / 2 - pw / 2, y)
    y += 8
  }

  // Date range
  doc.setTextColor(140, 140, 158)
  setBody(doc, f, 10)
  const drw = doc.getTextWidth(dateRange)
  doc.text(dateRange, PW / 2 - drw / 2, y)
  y += 10

  // Birth data
  if (birthDate) {
    doc.setTextColor(120, 120, 140)
    setBody(doc, f, 8.5)
    let btext = birthDate
    if (birthTime) btext += `  ·  ${birthTime}`
    const btw = doc.getTextWidth(btext)
    doc.text(btext, PW / 2 - btw / 2, y)
  }

  // Bottom brand
  doc.setTextColor(...P.gold)
  doc.setGState(doc.GState({ opacity: 0.6 }))
  setBody(doc, f, 8, true)
  const brand = 'ASTRARA'
  const bw = doc.getTextWidth(brand)
  doc.text(brand, PW / 2 - bw / 2, PH - 20)

  doc.setTextColor(100, 100, 120)
  setBody(doc, f, 7)
  const site = 'astrara.app'
  const sw = doc.getTextWidth(site)
  doc.text(site, PW / 2 - sw / 2, PH - 14)
  doc.setGState(doc.GState({ opacity: 1 }))
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 2 — Personal Introduction
// ═══════════════════════════════════════════════════════════════════════════

function drawIntroPage(
  doc: jsPDF, f: FontSet, clientName: string,
  birthDate: string, lang: Lang, pageNum: number,
) {
  let y = MT + 10

  // Title
  doc.setTextColor(...P.gold)
  setDisplay(doc, f, 22, 'normal')
  doc.text(tr('introTitle', lang), ML, y)
  y += 8
  goldLine(doc, y, 60)
  y += 14

  // Greeting
  doc.setTextColor(...P.navy)
  setDisplayItalic(doc, f, 12)
  const greeting = clientName
    ? (lang === 'lt'
      ? `Mielas(-a) ${clientName}, sveikiname su Jusu asmeniniu Kosminiu Planu.`
      : `Dear ${clientName}, welcome to your personal Cosmic Blueprint.`)
    : tr('introGreeting', lang)
  y = wrapDraw(doc, greeting, ML, y, CW, 6)
  y += 6

  // Main intro text
  doc.setTextColor(...P.navy)
  setBody(doc, f, 10.5)
  y = wrapDraw(doc, tr('introGreeting', lang), ML, y, CW, 5)
  y += 6

  // Methodology note
  doc.setTextColor(...P.grey)
  setBody(doc, f, 9.5)
  y = wrapDraw(doc, tr('introMethod', lang), ML, y, CW, 4.5)
  y += 4

  // Natal chart note
  if (birthDate) {
    doc.setTextColor(...P.grey)
    setDisplayItalic(doc, f, 10)
    y = wrapDraw(doc, tr('introNatal', lang), ML, y, CW, 5)
    y += 6
  }
  y += 8

  // How to read section
  goldLine(doc, y, 40)
  y += 10

  doc.setTextColor(...P.gold)
  setDisplay(doc, f, 14, 'normal')
  doc.text(tr('introHowTo', lang), ML, y)
  y += 8

  // Draw impact gradient bar
  const barX = ML, barW = 80, barH = 5
  for (let i = 0; i < barW; i++) {
    const t = i / barW
    const score = 1 + t * 9
    const rgb = getImpactRGB(score)
    doc.setFillColor(...rgb)
    doc.rect(barX + i, y, 1.2, barH, 'F')
  }

  // Labels under bar
  doc.setTextColor(...P.grey)
  setBody(doc, f, 7)
  doc.text('1', barX, y + barH + 4)
  doc.text('5', barX + barW / 2 - 2, y + barH + 4)
  const ten = '10'
  doc.text(ten, barX + barW - doc.getTextWidth(ten), y + barH + 4)
  y += barH + 10

  // Scoring explanation
  doc.setTextColor(...P.navy)
  setBody(doc, f, 10)
  y = wrapDraw(doc, tr('introScoring', lang), ML, y, CW, 5)

  pageFooter(doc, f, pageNum, clientName, lang)
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 3 — Year at a Glance
// ═══════════════════════════════════════════════════════════════════════════

function drawYearGlance(
  doc: jsPDF, f: FontSet, months: BlueprintMonthNarrative[],
  yearOverview: BlueprintYearOverview | null,
  clientName: string, lang: Lang, pageNum: number,
) {
  let y = MT + 5

  doc.setTextColor(...P.navy)
  setDisplay(doc, f, 20, 'normal')
  doc.text(tr('yearGlance', lang), ML, y)
  y += 7
  goldLineFull(doc, y)
  y += 10

  // Impact Timeline header
  doc.setTextColor(...P.gold)
  setDisplay(doc, f, 11, 'normal')
  doc.text(tr('impactTimeline', lang), ML, y)
  y += 7

  // Bar chart — 12 bars
  const barH = 40
  const barAreaW = CW
  const segW = barAreaW / 12

  // Find max score for proportional heights
  const maxScore = Math.max(...months.map(m => m.overall_score), 1)

  for (let i = 0; i < months.length; i++) {
    const m = months[i]
    const score = m.overall_score
    const h = (score / 10) * barH
    const color = getImpactRGB(score)

    // Bar
    doc.setFillColor(...color)
    doc.roundedRect(ML + i * segW + 1, y + barH - h, segW - 2, h, 1, 1, 'F')

    // Score inside bar
    doc.setTextColor(...P.white)
    setBody(doc, f, 7, true)
    const numTxt = String(score)
    const nw = doc.getTextWidth(numTxt)
    doc.text(numTxt, ML + i * segW + segW / 2 - nw / 2, y + barH - h + 5)
  }
  y += barH + 3

  // Month labels
  doc.setTextColor(...P.mutedGrey)
  setBody(doc, f, 5.5)
  for (let i = 0; i < months.length; i++) {
    const short = months[i].month.split(' ')[0].substring(0, 3)
    const lw = doc.getTextWidth(short)
    doc.text(short, ML + i * segW + segW / 2 - lw / 2, y + 3)
  }
  y += 10

  // Category average scores
  doc.setTextColor(...P.gold)
  setDisplay(doc, f, 11, 'normal')
  doc.text(tr('categoryScores', lang), ML, y)
  y += 7

  for (const cat of BLUEPRINT_CATEGORY_KEYS) {
    const scores = months.map(m => m[cat].score)
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10
    const rgb = CAT_RGB[cat]

    // Category dot
    doc.setFillColor(...rgb)
    doc.circle(ML + 3, y + 0.5, 2, 'F')

    // Label
    doc.setTextColor(...rgb)
    setBody(doc, f, 9, true)
    doc.text(catLabel(cat, lang), ML + 9, y + 2)

    // Score bar (mini)
    const barStartX = ML + 65
    const barMaxW = 60
    const scoreBarW = (avg / 10) * barMaxW
    doc.setFillColor(...rgb)
    doc.setGState(doc.GState({ opacity: 0.2 }))
    doc.roundedRect(barStartX, y - 1.5, barMaxW, 4, 1, 1, 'F')
    doc.setGState(doc.GState({ opacity: 0.7 }))
    doc.roundedRect(barStartX, y - 1.5, scoreBarW, 4, 1, 1, 'F')
    doc.setGState(doc.GState({ opacity: 1 }))

    // Score text
    doc.setTextColor(...P.navy)
    setBody(doc, f, 8, true)
    doc.text(`${avg}`, barStartX + barMaxW + 4, y + 1.5)

    y += 8
  }
  y += 4

  // Star separator
  starDot(doc, PW / 2 - 6, y)
  starDot(doc, PW / 2, y)
  starDot(doc, PW / 2 + 6, y)
  y += 8

  // Year overview text
  if (yearOverview) {
    doc.setTextColor(...P.navy)
    setDisplayItalic(doc, f, 10.5)
    y = wrapDraw(doc, yearOverview.opening, ML, y, CW, 5)
    y += 4

    doc.setTextColor(...P.grey)
    setBody(doc, f, 9.5)
    y = wrapDraw(doc, yearOverview.major_themes, ML, y, CW, 4.5)
    y += 4

    // Peak periods
    if (yearOverview.peak_periods) {
      doc.setTextColor(...P.gold)
      setBody(doc, f, 8.5, true)
      doc.text(tr('peakMonths', lang) + ':', ML, y)
      y += 4
      doc.setTextColor(...P.navy)
      setBody(doc, f, 9)
      y = wrapDraw(doc, yearOverview.peak_periods, ML, y, CW, 4.5)
    }
  }

  pageFooter(doc, f, pageNum, clientName, lang)
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGES 4–15 — Monthly Readings (Blueprint narrative)
// ═══════════════════════════════════════════════════════════════════════════

function drawMonthPage(
  doc: jsPDF, f: FontSet, month: BlueprintMonthNarrative,
  clientName: string, lang: Lang, pageNum: number,
) {
  let y = MT

  // Month header band
  doc.setTextColor(...P.navy)
  setDisplay(doc, f, 22, 'normal')
  doc.text(month.month, ML, y + 5)

  // Impact circle
  drawImpactDot(doc, f, PW - MR - 8, y + 2, month.overall_score, 7)

  y += 12
  goldLineFull(doc, y)
  y += 8

  // Opening atmosphere (italic, larger)
  if (month.opening) {
    doc.setTextColor(...P.grey)
    setDisplayItalic(doc, f, 11)
    y = wrapDraw(doc, month.opening, ML, y, CW, 5.5)
    y += 6
  }

  // 5 categories
  for (const cat of BLUEPRINT_CATEGORY_KEYS) {
    const reading = month[cat]
    if (!reading) continue

    // Check if we need a new page
    if (needsNewPage(doc, y, 40)) {
      pageFooter(doc, f, pageNum, clientName, lang)
      doc.addPage()
      pageNum++
      y = MT
    }

    const rgb = CAT_RGB[cat]

    // Category name line with score
    doc.setTextColor(...rgb)
    setBody(doc, f, 8.5, true)
    const catText = catLabel(cat, lang).toUpperCase()
    doc.text(catText, ML, y + 2)

    // Thin colored line extending right from category name
    const catTW = doc.getTextWidth(catText)
    doc.setDrawColor(...rgb)
    doc.setLineWidth(0.3)
    doc.setGState(doc.GState({ opacity: 0.4 }))
    doc.line(ML + catTW + 3, y + 1, ML + catTW + 35, y + 1)
    doc.setGState(doc.GState({ opacity: 1 }))

    // Score dot
    drawImpactDot(doc, f, PW - MR - 5, y, reading.score, 3.5)

    y += 6

    // Narrative
    doc.setTextColor(...P.navy)
    setBody(doc, f, 10)
    y = wrapDraw(doc, reading.narrative, ML, y, CW, 4.8)

    y += 8 // spacing between categories
  }

  // Month synthesis
  if (month.month_synthesis) {
    if (needsNewPage(doc, y, 25)) {
      pageFooter(doc, f, pageNum, clientName, lang)
      doc.addPage()
      pageNum++
      y = MT
    }

    goldLine(doc, y, 40)
    y += 7

    // Light background tint for synthesis
    doc.setFillColor(...P.gold)
    doc.setGState(doc.GState({ opacity: 0.05 }))
    const synthLines = doc.splitTextToSize(month.month_synthesis, CW - 8)
    const synthH = synthLines.length * 4.8 + 6
    doc.roundedRect(ML, y - 2, CW, synthH, 2, 2, 'F')
    doc.setGState(doc.GState({ opacity: 1 }))

    doc.setTextColor(...P.grey)
    setDisplayItalic(doc, f, 10)
    y = wrapDraw(doc, month.month_synthesis, ML + 4, y + 2, CW - 8, 4.8)

    y += 4
    // Small diamond glyph centered
    doc.setFillColor(...P.gold)
    doc.setGState(doc.GState({ opacity: 0.4 }))
    const dx = PW / 2
    doc.triangle(dx, y - 1.2, dx + 1.2, y, dx, y + 1.2, 'F')
    doc.triangle(dx, y - 1.2, dx - 1.2, y, dx, y + 1.2, 'F')
    doc.setGState(doc.GState({ opacity: 1 }))
  }

  pageFooter(doc, f, pageNum, clientName, lang)
  return pageNum
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 16 — Year Synthesis
// ═══════════════════════════════════════════════════════════════════════════

function drawYearSynthesis(
  doc: jsPDF, f: FontSet, yearOverview: BlueprintYearOverview,
  clientName: string, lang: Lang, pageNum: number,
) {
  let y = MT + 10

  doc.setTextColor(...P.navy)
  setDisplay(doc, f, 20, 'normal')
  doc.text(tr('yearPerspective', lang), ML, y)
  y += 8
  goldLineFull(doc, y)
  y += 12

  // Opening
  doc.setTextColor(...P.navy)
  setDisplayItalic(doc, f, 12)
  y = wrapDraw(doc, yearOverview.opening, ML, y, CW, 6)
  y += 8

  // Major themes
  doc.setTextColor(...P.navy)
  setBody(doc, f, 10.5)
  y = wrapDraw(doc, yearOverview.major_themes, ML, y, CW, 5)
  y += 8

  // Separator
  starDot(doc, PW / 2 - 6, y)
  starDot(doc, PW / 2, y)
  starDot(doc, PW / 2 + 6, y)
  y += 10

  // Peak periods
  if (yearOverview.peak_periods) {
    doc.setTextColor(...P.gold)
    setDisplay(doc, f, 12, 'normal')
    doc.text(tr('peakMonths', lang), ML, y)
    y += 7

    doc.setTextColor(...P.navy)
    setBody(doc, f, 10)
    y = wrapDraw(doc, yearOverview.peak_periods, ML, y, CW, 5)
    y += 8
  }

  // Growth trajectory
  if (yearOverview.growth_trajectory) {
    doc.setTextColor(...P.grey)
    setDisplayItalic(doc, f, 10.5)
    y = wrapDraw(doc, yearOverview.growth_trajectory, ML, y, CW, 5)
    y += 6
  }

  // Draw a subtle wave across the page
  doc.setDrawColor(...P.gold)
  doc.setLineWidth(0.3)
  doc.setGState(doc.GState({ opacity: 0.2 }))
  const waveY = y + 10
  let prevX = ML, prevY = waveY
  for (let x = ML; x <= PW - MR; x += 2) {
    const t = (x - ML) / CW
    const ny = waveY + Math.sin(t * Math.PI * 3) * 5
    doc.line(prevX, prevY, x, ny)
    prevX = x
    prevY = ny
  }
  doc.setGState(doc.GState({ opacity: 1 }))

  pageFooter(doc, f, pageNum, clientName, lang)
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 17 — Closing & Guidance
// ═══════════════════════════════════════════════════════════════════════════

function drawClosingPage(
  doc: jsPDF, f: FontSet, yearOverview: BlueprintYearOverview,
  months: BlueprintMonthNarrative[],
  clientName: string, lang: Lang, pageNum: number,
) {
  let y = MT + 10

  doc.setTextColor(...P.navy)
  setDisplay(doc, f, 20, 'normal')
  doc.text(tr('movingForward', lang), ML, y)
  y += 8
  goldLineFull(doc, y)
  y += 12

  // Closing message
  if (yearOverview.closing_message) {
    doc.setTextColor(...P.navy)
    setDisplayItalic(doc, f, 12)
    y = wrapDraw(doc, yearOverview.closing_message, ML, y, CW, 6)
    y += 12
  }

  // Key dates to remember — extract from peak periods
  doc.setTextColor(...P.gold)
  setDisplay(doc, f, 14, 'normal')
  doc.text(tr('keyDates', lang), ML, y)
  y += 8

  // Extract top 3 months by score
  const sorted = [...months].sort((a, b) => b.overall_score - a.overall_score)
  const top = sorted.slice(0, 5)

  for (const m of top) {
    doc.setFillColor(...getImpactRGB(m.overall_score))
    doc.circle(ML + 3, y + 0.5, 2, 'F')

    doc.setTextColor(...P.navy)
    setBody(doc, f, 10, true)
    doc.text(m.month, ML + 9, y + 2)

    doc.setTextColor(...P.grey)
    setBody(doc, f, 9)
    const shortOpening = m.opening.length > 100
      ? m.opening.substring(0, 100) + '...'
      : m.opening
    y += 5
    y = wrapDraw(doc, shortOpening, ML + 9, y, CW - 12, 4.5)
    y += 4
  }

  // Signature
  y += 10
  goldLine(doc, y, 30)
  y += 10

  doc.setTextColor(...P.grey)
  setDisplayItalic(doc, f, 11)
  doc.text(tr('withCosmicLight', lang), ML, y)
  y += 7

  doc.setTextColor(...P.gold)
  setDisplay(doc, f, 13, 'normal')
  doc.text('Astrara by Harmonic Waves', ML, y)

  pageFooter(doc, f, pageNum, clientName, lang)
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 18 — About & Methodology
// ═══════════════════════════════════════════════════════════════════════════

function drawAboutPage(doc: jsPDF, f: FontSet, lang: Lang, pageNum: number, clientName: string) {
  let y = MT + 15

  doc.setTextColor(...P.navy)
  setDisplay(doc, f, 18, 'normal')
  doc.text(tr('aboutTitle', lang), ML, y)
  y += 8
  goldLine(doc, y, 40)
  y += 12

  // Methodology
  doc.setTextColor(...P.grey)
  setBody(doc, f, 9.5)
  y = wrapDraw(doc, tr('aboutMethod', lang), ML, y, CW, 4.5)
  y += 12

  // About Astrara
  doc.setTextColor(...P.gold)
  setDisplay(doc, f, 13, 'normal')
  doc.text('Astrara', ML, y)
  y += 7

  doc.setTextColor(...P.grey)
  setBody(doc, f, 9.5)
  y = wrapDraw(doc, tr('aboutAstrara', lang), ML, y, CW, 4.5)
  y += 10

  // Website
  doc.setTextColor(...P.gold)
  setBody(doc, f, 11, true)
  doc.text('astrara.app', ML, y)
  y += 18

  // Disclaimer
  goldLine(doc, y, 30)
  y += 8

  doc.setTextColor(...P.mutedGrey)
  setBody(doc, f, 7.5)
  y = wrapDraw(doc, tr('disclaimer', lang), ML, y, CW, 3.5)

  pageFooter(doc, f, pageNum, clientName, lang)
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Export — Premium Blueprint (narrative-based)
// ═══════════════════════════════════════════════════════════════════════════

export interface BlueprintPdfParams {
  months: BlueprintMonthNarrative[]
  yearOverview: BlueprintYearOverview | null
  clientName: string
  birthDate: string
  birthTime: string
  language: 'en' | 'lt'
}

export async function generateBlueprintPdf(params: BlueprintPdfParams) {
  const { months, yearOverview, clientName, birthDate, birthTime, language } = params

  if (months.length === 0) return

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  // Set paper background for all pages via page event
  doc.setFillColor(...P.paperRGB)

  const f = await registerFonts(doc)
  let pageNum = 1

  // Date range
  const firstMonth = months[0].month
  const lastMonth = months[months.length - 1].month
  const dateRange = `${firstMonth} — ${lastMonth}`

  // ─── Page 1: Cover ───
  drawCover(doc, f, clientName, birthDate, birthTime, dateRange, language)

  // ─── Page 2: Introduction ───
  doc.addPage()
  pageNum++
  // Light background
  doc.setFillColor(...P.paperRGB)
  doc.rect(0, 0, PW, PH, 'F')
  drawIntroPage(doc, f, clientName, birthDate, language, pageNum)

  // ─── Page 3: Year at a Glance ───
  doc.addPage()
  pageNum++
  doc.setFillColor(...P.paperRGB)
  doc.rect(0, 0, PW, PH, 'F')
  drawYearGlance(doc, f, months, yearOverview, clientName, language, pageNum)

  // ─── Pages 4–15: Monthly Readings ───
  for (const month of months) {
    doc.addPage()
    pageNum++
    doc.setFillColor(...P.paperRGB)
    doc.rect(0, 0, PW, PH, 'F')
    pageNum = drawMonthPage(doc, f, month, clientName, language, pageNum)
  }

  // ─── Page 16: Year Synthesis ───
  if (yearOverview) {
    doc.addPage()
    pageNum++
    doc.setFillColor(...P.paperRGB)
    doc.rect(0, 0, PW, PH, 'F')
    drawYearSynthesis(doc, f, yearOverview, clientName, language, pageNum)
  }

  // ─── Page 17: Closing ───
  if (yearOverview) {
    doc.addPage()
    pageNum++
    doc.setFillColor(...P.paperRGB)
    doc.rect(0, 0, PW, PH, 'F')
    drawClosingPage(doc, f, yearOverview, months, clientName, language, pageNum)
  }

  // ─── Page 18: About ───
  doc.addPage()
  pageNum++
  doc.setFillColor(...P.paperRGB)
  doc.rect(0, 0, PW, PH, 'F')
  drawAboutPage(doc, f, language, pageNum, clientName)

  // Save
  const safeName = (clientName || 'cosmic').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const today = new Date().toISOString().split('T')[0]
  doc.save(`cosmic-blueprint-${safeName}-${today}.pdf`)
}

// ═══════════════════════════════════════════════════════════════════════════
// Legacy Export — Grid-based PDF (keeps existing functionality)
// ═══════════════════════════════════════════════════════════════════════════

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
  const f = await registerFonts(doc)
  let pageNum = 1

  const firstMonth = months[0].month
  const lastMonth = months[months.length - 1].month
  const dateRange = `${firstMonth} — ${lastMonth}`

  // Cover
  drawCover(doc, f, clientName, birthDate, birthTime, dateRange, language)

  // Year at a Glance (adapted for grid data)
  doc.addPage()
  pageNum++
  doc.setFillColor(...P.paperRGB)
  doc.rect(0, 0, PW, PH, 'F')
  drawGridYearGlance(doc, f, months, overview, clientName, language, pageNum)

  // Monthly pages
  for (const month of months) {
    doc.addPage()
    pageNum++
    doc.setFillColor(...P.paperRGB)
    doc.rect(0, 0, PW, PH, 'F')
    drawGridMonthPage(doc, f, month, clientName, language, pageNum)
  }

  // Overview
  if (overview) {
    doc.addPage()
    pageNum++
    doc.setFillColor(...P.paperRGB)
    doc.rect(0, 0, PW, PH, 'F')
    drawGridOverview(doc, f, overview, clientName, language, pageNum)
  }

  // About
  doc.addPage()
  pageNum++
  doc.setFillColor(...P.paperRGB)
  doc.rect(0, 0, PW, PH, 'F')
  drawAboutPage(doc, f, language, pageNum, clientName)

  const safeName = (clientName || 'cosmic').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const today = new Date().toISOString().split('T')[0]
  doc.save(`cosmic-blueprint-${safeName}-${today}.pdf`)
}

// ─── Grid-based helpers (adapted from original) ───

function drawGridYearGlance(
  doc: jsPDF, f: FontSet, months: MonthData[], overview: OverviewData | null,
  clientName: string, lang: Lang, pageNum: number,
) {
  let y = MT + 5

  doc.setTextColor(...P.navy)
  setDisplay(doc, f, 20, 'normal')
  doc.text(tr('yearGlance', lang), ML, y)
  y += 7
  goldLineFull(doc, y)
  y += 10

  // Impact timeline
  const barH = 12
  const segW = CW / 12
  for (let i = 0; i < months.length; i++) {
    const score = months[i].categories.monthly_summary.impact_score
    const color = getImpactRGB(score)
    doc.setFillColor(...color)
    doc.roundedRect(ML + i * segW + 0.5, y, segW - 1, barH, 1, 1, 'F')
    doc.setTextColor(...P.white)
    setBody(doc, f, 7, true)
    const nt = String(score)
    const nw = doc.getTextWidth(nt)
    doc.text(nt, ML + i * segW + segW / 2 - nw / 2, y + barH / 2 + 1.5)
  }
  y += barH + 3
  doc.setTextColor(...P.mutedGrey)
  setBody(doc, f, 5)
  for (let i = 0; i < months.length; i++) {
    const short = months[i].month.split(' ')[0].substring(0, 3)
    const lw = doc.getTextWidth(short)
    doc.text(short, ML + i * segW + segW / 2 - lw / 2, y + 3)
  }
  y += 12

  // Peak months
  const sorted = [...months].sort((a, b) =>
    b.categories.monthly_summary.impact_score - a.categories.monthly_summary.impact_score
  )
  for (const m of sorted.slice(0, 3)) {
    const score = m.categories.monthly_summary.impact_score
    drawImpactDot(doc, f, ML + 4, y + 1, score, 3)
    doc.setTextColor(...P.navy)
    setBody(doc, f, 9, true)
    doc.text(m.month, ML + 12, y + 2.5)
    doc.setTextColor(...P.grey)
    setBody(doc, f, 8)
    const theme = m.categories.monthly_summary.dominant_theme
    const wrapped = doc.splitTextToSize(theme, CW - 50)
    doc.text(wrapped[0], ML + 50, y + 2.5)
    y += 8
  }
  y += 6

  // Category highlights
  if (overview) {
    goldLine(doc, y, 40)
    y += 8
    for (const cat of CATEGORY_KEYS) {
      const data = overview.categories[cat]
      if (!data) continue
      const color = CAT_COLORS[cat]
      doc.setFillColor(...color)
      doc.circle(ML + 3, y + 0.5, 2, 'F')
      doc.setTextColor(...color)
      setBody(doc, f, 9, true)
      doc.text(catLabelGrid(cat, lang), ML + 9, y + 2)
      doc.setTextColor(...P.grey)
      setBody(doc, f, 8)
      doc.text(`${data.impact_score}/10  ·  ${data.trajectory ?? ''}`, ML + 55, y + 2)
      y += 6
      if (data.year_trend) {
        doc.setTextColor(...P.grey)
        setBody(doc, f, 8)
        const tl = doc.splitTextToSize(data.year_trend, CW - 8)
        doc.text(tl[0], ML + 9, y + 1)
        y += tl.length > 1 ? 10 : 6
      }
    }
  }

  pageFooter(doc, f, pageNum, clientName, lang)
}

function drawGridMonthPage(
  doc: jsPDF, f: FontSet, month: MonthData,
  clientName: string, lang: Lang, pageNum: number,
) {
  let y = MT

  const overallScore = month.categories.monthly_summary.impact_score
  doc.setTextColor(...P.navy)
  setDisplay(doc, f, 22, 'normal')
  doc.text(month.month, ML, y + 5)
  drawImpactDot(doc, f, PW - MR - 6, y + 2, overallScore, 6)
  y += 12
  goldLineFull(doc, y)
  y += 6

  for (const cat of CATEGORY_KEYS) {
    const reading = month.categories[cat]
    if (!reading) continue

    if (needsNewPage(doc, y, 45)) {
      pageFooter(doc, f, pageNum, clientName, lang)
      doc.addPage()
      pageNum++
      doc.setFillColor(...P.paperRGB)
      doc.rect(0, 0, PW, PH, 'F')
      y = MT
    }

    const color = CAT_COLORS[cat]
    doc.setFillColor(...color)
    doc.roundedRect(ML, y, CW, 5.5, 1, 1, 'F')
    doc.setTextColor(...P.white)
    setBody(doc, f, 8, true)
    doc.text(catLabelGrid(cat, lang), ML + 3, y + 3.8)
    const scoreText = `${reading.impact_score}/10`
    const stw = doc.getTextWidth(scoreText)
    doc.text(scoreText, PW - MR - stw - 3, y + 3.8)
    y += 8

    doc.setTextColor(...P.navy)
    setBody(doc, f, 9, true)
    y = wrapDraw(doc, reading.key_theme, ML + 2, y, CW - 4, 4.5)
    y += 1.5

    doc.setTextColor(...P.grey)
    setBody(doc, f, 8.5)
    y = wrapDraw(doc, reading.full_reading, ML + 2, y, CW - 4, 4)
    y += 1.5

    if (reading.planetary_breakdown && reading.planetary_breakdown.length > 0) {
      doc.setTextColor(...P.mutedGrey)
      setBody(doc, f, 6)
      const planets = reading.planetary_breakdown.map(p => {
        const aspects = p.aspects?.map(a => `${a.symbol}${a.target}`).join(' ') ?? ''
        return `${p.symbol} ${p.planet} ${p.position} ${aspects}`
      }).join('  |  ')
      const pLines = doc.splitTextToSize(planets, CW - 4)
      for (const line of pLines.slice(0, 2)) {
        doc.text(line, ML + 2, y)
        y += 3.5
      }
    }

    if (reading.practical_guidance) {
      doc.setTextColor(100, 90, 120)
      setBody(doc, f, 7)
      const gLines = doc.splitTextToSize(reading.practical_guidance, CW - 4)
      for (const line of gLines.slice(0, 2)) {
        doc.text(line, ML + 2, y)
        y += 3.5
      }
    }
    y += 3
  }

  // Monthly summary
  const summary = month.categories.monthly_summary
  if (needsNewPage(doc, y, 25)) {
    pageFooter(doc, f, pageNum, clientName, lang)
    doc.addPage()
    pageNum++
    doc.setFillColor(...P.paperRGB)
    doc.rect(0, 0, PW, PH, 'F')
    y = MT
  }

  goldLineFull(doc, y)
  y += 5

  doc.setTextColor(...P.gold)
  setDisplay(doc, f, 10, 'normal')
  doc.text(lang === 'lt' ? 'Menesio Santrauka' : 'Month in a Nutshell', ML, y)
  y += 5

  doc.setTextColor(...P.navy)
  setBody(doc, f, 8.5)
  y = wrapDraw(doc, summary.dominant_theme, ML, y, CW, 4)

  pageFooter(doc, f, pageNum, clientName, lang)
}

function drawGridOverview(
  doc: jsPDF, f: FontSet, overview: OverviewData,
  clientName: string, lang: Lang, pageNum: number,
) {
  let y = MT + 5

  doc.setTextColor(...P.navy)
  setDisplay(doc, f, 18, 'normal')
  doc.text(lang === 'lt' ? '12 Menesiu Apzvalga ir Sinteze' : '12-Month Overview & Synthesis', ML, y)
  y += 7
  goldLineFull(doc, y)
  y += 10

  for (const cat of CATEGORY_KEYS) {
    const data = overview.categories[cat]
    if (!data) continue

    if (needsNewPage(doc, y, 25)) {
      pageFooter(doc, f, pageNum, clientName, lang)
      doc.addPage()
      pageNum++
      doc.setFillColor(...P.paperRGB)
      doc.rect(0, 0, PW, PH, 'F')
      y = MT
    }

    const color = CAT_COLORS[cat]
    doc.setFillColor(...color)
    doc.circle(ML + 3, y + 0.5, 2, 'F')
    doc.setTextColor(...color)
    setDisplay(doc, f, 11, 'normal')
    doc.text(catLabelGrid(cat, lang), ML + 9, y + 2.5)

    const scoreColor = getImpactRGB(data.impact_score)
    doc.setTextColor(...scoreColor)
    setBody(doc, f, 8, true)
    const meta = `${data.impact_score}/10  ·  ${data.trajectory ?? ''}`
    const mw = doc.getTextWidth(meta)
    doc.text(meta, PW - MR - mw, y + 2.5)
    y += 7

    if (data.year_trend) {
      doc.setTextColor(...P.grey)
      setBody(doc, f, 8.5)
      y = wrapDraw(doc, data.year_trend, ML + 9, y, CW - 18, 4)
      y += 1
    }
    if (data.full_reading) {
      doc.setTextColor(...P.grey)
      setBody(doc, f, 8.5)
      y = wrapDraw(doc, data.full_reading, ML + 9, y, CW - 18, 4)
    }
    y += 5
  }

  // Grand summary
  const grand = overview.categories.grand_summary
  if (grand) {
    goldLine(doc, y, 50)
    y += 8
    doc.setTextColor(...P.gold)
    setDisplay(doc, f, 14, 'normal')
    doc.text(lang === 'lt' ? 'Metu Apzvalga' : 'Year Overview', ML, y)
    y += 7
    if (grand.dominant_theme) {
      doc.setTextColor(...P.navy)
      setBody(doc, f, 9, true)
      y = wrapDraw(doc, grand.dominant_theme, ML, y, CW, 4.5)
      y += 2
    }
    if (grand.full_reading) {
      doc.setTextColor(...P.grey)
      setBody(doc, f, 8.5)
      y = wrapDraw(doc, grand.full_reading, ML, y, CW, 4)
    }
  }

  pageFooter(doc, f, pageNum, clientName, lang)
}
