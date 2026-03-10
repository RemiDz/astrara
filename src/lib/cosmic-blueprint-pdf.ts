import jsPDF from 'jspdf'
import type { MonthData, OverviewData, CategoryKey } from '@/types/transit-grid'
import { CATEGORY_KEYS } from '@/types/transit-grid'
import type {
  BlueprintMonthNarrative, BlueprintYearOverview, BlueprintCategoryKey,
  BlueprintEclipseRetroData, RitualCalendarMonth, BlueprintData,
} from '@/types/cosmic-blueprint'
import { BLUEPRINT_CATEGORY_KEYS, PLANET_FREQUENCIES } from '@/types/cosmic-blueprint'

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
  finance: [155, 125, 46],        // #9B7D2E
  relationships: [184, 92, 111],  // #B85C6F
  career: [58, 80, 136],          // #3A5088
  health: [42, 123, 82],          // #2A7B52
  spiritual: [107, 77, 138],      // #6B4D8A
}

// Also export category labels for the grid-based PDF
const CAT_COLORS: Record<CategoryKey, RGB> = {
  finance: [155, 125, 46],
  relationships: [184, 92, 111],
  career: [58, 80, 136],
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

// Impact gradient: Green → Amber → Orange → Red
function getImpactRGB(score: number): RGB {
  // 1-3: green #2D8E4E, 4-6: amber #D4960F, 7-8: orange #C87A2B, 9-10: red #C44536
  if (score <= 3) return [45, 142, 78]
  if (score <= 6) {
    const t = (score - 3) / 3
    return [
      Math.round(45 + (212 - 45) * t),
      Math.round(142 + (150 - 142) * t),
      Math.round(78 + (15 - 78) * t),
    ]
  }
  if (score <= 8) {
    const t = (score - 6) / 2
    return [
      Math.round(212 + (200 - 212) * t),
      Math.round(150 + (122 - 150) * t),
      Math.round(15 + (43 - 15) * t),
    ]
  }
  // 9-10
  return [196, 69, 54]
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
  sonicRx: { en: 'Your Sonic Prescription', lt: 'Jusu Garso Receptas' },

  // Ritual Calendar
  ritualCalendar: { en: 'Your Ritual Calendar', lt: 'Jusu Ritualu Kalendorius' },
  ritualLegend: { en: 'Legend', lt: 'Legenda' },
  ritualBeneficial: { en: 'Beneficial aspect', lt: 'Palankus aspektas' },
  ritualChallenging: { en: 'Challenging aspect', lt: 'Issukiantis aspektas' },
  ritualRetrograde: { en: 'Retrograde station', lt: 'Retrogradine stotis' },
  ritualMoonPhase: { en: 'New/Full Moon', lt: 'Jaunatis/Pilnatis' },
  ritualEclipse: { en: 'Eclipse', lt: 'Uztemimas' },
  ritualSeason: { en: 'Solstice/Equinox', lt: 'Saulegriza/Lygiadienis' },

  // Eclipse & Retrograde Spotlight
  eclipseTitle: { en: 'Cosmic Crossroads: Eclipses & Retrogrades', lt: 'Kosminiai Kryzkeles: Uztemimiai ir Retrogradai' },

  // Sonic Toolkit
  sonicToolkitTitle: { en: 'Your Sonic Toolkit', lt: 'Jusu Garso Irankiai' },
  sonicFrequencies: { en: 'Primary Frequencies', lt: 'Pagrindines Dazniai' },
  sonicInstruments: { en: 'Recommended Instruments', lt: 'Rekomenduojami Instrumentai' },
  sonicChakras: { en: 'Chakra Focus Areas', lt: 'Cakru Fokuso Sritys' },
  sonicPractice: { en: 'Daily Practice', lt: 'Kasdienis Praktika' },

  // Year pages
  yearPerspective: { en: 'Your Year in Perspective', lt: 'Jusu Metai Perspektyvoje' },

  // Closing
  movingForward: { en: 'Moving Forward', lt: 'Zvelgiant i Prieki' },
  keyDates: { en: 'Key Dates to Remember', lt: 'Svarbios Datos' },
  withCosmicLight: { en: 'With cosmic light,', lt: 'Su kosmine sviesa,' },

  // About
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
// Font Setup — built-in jsPDF fonts only (times + helvetica)
// ═══════════════════════════════════════════════════════════════════════════

interface FontSet {
  hasCormorant: false
  hasDMSans: false
  hasItalic: false
}

function initFonts(): FontSet {
  // Use jsPDF built-in fonts only: times (serif) + helvetica (sans)
  // This avoids custom font registration crashes in production/Vercel
  return { hasCormorant: false, hasDMSans: false, hasItalic: false }
}

// ═══════════════════════════════════════════════════════════════════════════
// Unicode Sanitization — replace symbols that built-in fonts can't render
// ═══════════════════════════════════════════════════════════════════════════

const SYMBOL_MAP: Record<string, string> = {
  // Planets
  '\u2609': 'Sun',     // ☉
  '\u263D': 'Moon',    // ☽
  '\u263F': 'Mercury', // ☿
  '\u2640': 'Venus',   // ♀
  '\u2642': 'Mars',    // ♂
  '\u2643': 'Jupiter', // ♃
  '\u2644': 'Saturn',  // ♄
  '\u2645': 'Uranus',  // ♅
  '\u2646': 'Neptune', // ♆
  '\u2647': 'Pluto',   // ♇
  // Aspects
  '\u260C': 'conj.',   // ☌
  '\u260D': 'opp.',    // ☍
  '\u25B3': 'tri.',    // △
  '\u25A1': 'sq.',     // □
  '\u26B9': 'sxt.',    // ⚹
  // Common decorative
  '\u2726': '*',       // ✦
  '\u2727': '*',       // ✧
  '\u2605': '*',       // ★
  '\u25C6': '*',       // ◆
  '\u2B07': 'v',       // ⬇
  // Em dash (safe in built-in fonts but adding for completeness)
}

function sanitizeForPDF(text: string): string {
  if (!text) return text
  let clean = text
  for (const [symbol, replacement] of Object.entries(SYMBOL_MAP)) {
    clean = clean.replaceAll(symbol, replacement)
  }
  // Strip any remaining non-Latin1 characters that would render as boxes
  // Keep Latin Extended-A (0100-017F) for Lithuanian: ą č ę ė į š ų ū ž
  // Keep common punctuation and symbols
  clean = clean.replace(/[^\x00-\xFF\u0100-\u017F\u2013\u2014\u2018\u2019\u201C\u201D\u2026]/g, '')
  return clean
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
  const safe = sanitizeForPDF(text)
  const lines = doc.splitTextToSize(safe, maxW)
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

function pageFooter(doc: jsPDF, f: FontSet, pageNum: number, clientName: string, _lang: Lang) {
  // Running header (pages 2+, except cover)
  if (pageNum >= 2) {
    doc.setTextColor(160, 160, 168) // #A0A0A8
    setBody(doc, f, 8)
    const header = `Cosmic Blueprint  ·  ${clientName || ''}`
    doc.text(header, ML, 12)
  }

  // Page number — centred at bottom
  if (pageNum >= 2) {
    doc.setTextColor(160, 160, 168)
    setBody(doc, f, 8)
    const pn = `— ${pageNum} —`
    const pw = doc.getTextWidth(pn)
    doc.text(pn, PW / 2 - pw / 2, PH - 12)
  }
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
  // Warm cream background
  doc.setFillColor(...P.paperRGB)
  doc.rect(0, 0, PW, PH, 'F')

  // Zodiac wheel — thin gold lines, elegant
  const cx = PW / 2, cy = 90, wr = 36
  doc.setDrawColor(...P.gold)
  doc.setGState(doc.GState({ opacity: 0.4 }))
  doc.setLineWidth(0.5)
  doc.circle(cx, cy, wr, 'S')
  doc.setLineWidth(0.3)
  doc.circle(cx, cy, wr - 7, 'S')
  doc.setLineWidth(0.15)
  doc.setGState(doc.GState({ opacity: 0.2 }))
  doc.circle(cx, cy, wr - 14, 'S')

  // 12 spoke lines
  doc.setGState(doc.GState({ opacity: 0.25 }))
  doc.setLineWidth(0.2)
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 - 90) * Math.PI / 180
    const x1 = cx + (wr - 7) * Math.cos(angle)
    const y1 = cy + (wr - 7) * Math.sin(angle)
    const x2 = cx + wr * Math.cos(angle)
    const y2 = cy + wr * Math.sin(angle)
    doc.line(x1, y1, x2, y2)
  }

  // 3-letter zodiac abbreviations
  const signs = ['ARI', 'TAU', 'GEM', 'CAN', 'LEO', 'VIR', 'LIB', 'SCO', 'SAG', 'CAP', 'AQU', 'PIS']
  doc.setGState(doc.GState({ opacity: 0.5 }))
  setBody(doc, f, 5.5)
  for (let i = 0; i < 12; i++) {
    const angle = ((i * 30) + 15 - 90) * Math.PI / 180
    const lr = wr - 3.5
    const lx = cx + lr * Math.cos(angle)
    const ly = cy + lr * Math.sin(angle)
    doc.setTextColor(...P.gold)
    const ltw = doc.getTextWidth(signs[i])
    doc.text(signs[i], lx - ltw / 2, ly + 1.2)
  }

  // Decorative planet dots
  doc.setGState(doc.GState({ opacity: 0.2 }))
  doc.setFillColor(...P.gold)
  const rng = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }
  const planetAngles = [15, 67, 112, 148, 195, 238, 280, 320]
  for (let i = 0; i < planetAngles.length; i++) {
    const ang = planetAngles[i] * Math.PI / 180
    const pr = (wr - 14) * (0.3 + rng(i * 73 + 11) * 0.6)
    doc.circle(cx + pr * Math.cos(ang), cy + pr * Math.sin(ang), 0.6 + rng(i * 37) * 0.5, 'F')
  }

  // Centre dot
  doc.setGState(doc.GState({ opacity: 0.3 }))
  doc.circle(cx, cy, 1.2, 'F')
  doc.setGState(doc.GState({ opacity: 1 }))

  // ─── Title block ───
  let y = 152

  doc.setTextColor(...P.navy)
  setDisplay(doc, f, 32, 'bold')
  const title = tr('title', lang)
  const ttw = doc.getTextWidth(title)
  doc.text(title, PW / 2 - ttw / 2, y)
  y += 10

  // Thin gold line (80mm wide, centred)
  doc.setDrawColor(...P.gold)
  doc.setLineWidth(0.4)
  doc.line(PW / 2 - 40, y, PW / 2 + 40, y)
  y += 9

  // Subtitle
  doc.setTextColor(...P.grey)
  setDisplayItalic(doc, f, 14)
  const sub = tr('subtitle', lang)
  const stw = doc.getTextWidth(sub)
  doc.text(sub, PW / 2 - stw / 2, y)
  y += 22

  // "Prepared for"
  doc.setTextColor(...P.grey)
  setBody(doc, f, 10)
  const prep = tr('preparedFor', lang)
  const prw = doc.getTextWidth(prep)
  doc.text(prep, PW / 2 - prw / 2, y)
  y += 10

  // Client name — large and prominent
  if (clientName) {
    doc.setTextColor(...P.navy)
    setDisplay(doc, f, 22, 'bold')
    const cnw = doc.getTextWidth(clientName)
    doc.text(clientName, PW / 2 - cnw / 2, y)
    y += 14
  }

  // Date range
  doc.setTextColor(...P.grey)
  setBody(doc, f, 11)
  const drw = doc.getTextWidth(dateRange)
  doc.text(dateRange, PW / 2 - drw / 2, y)
  y += 8

  // Birth data
  if (birthDate) {
    doc.setTextColor(...P.grey)
    setBody(doc, f, 9)
    let btext = birthDate
    if (birthTime) btext += `  ·  ${birthTime}`
    const btw = doc.getTextWidth(btext)
    doc.text(btext, PW / 2 - btw / 2, y)
  }

  // Bottom brand
  doc.setTextColor(...P.gold)
  doc.setGState(doc.GState({ opacity: 0.7 }))
  setBody(doc, f, 8, true)
  const brand = 'ASTRARA by Harmonic Waves'
  const bw = doc.getTextWidth(brand)
  doc.text(brand, PW / 2 - bw / 2, PH - 22)

  doc.setTextColor(...P.grey)
  doc.setGState(doc.GState({ opacity: 0.5 }))
  setBody(doc, f, 7)
  const site = 'astrara.app'
  const sw = doc.getTextWidth(site)
  doc.text(site, PW / 2 - sw / 2, PH - 15)
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

  // Greeting — one clean opening paragraph (no duplicate)
  doc.setTextColor(...P.navy)
  setDisplayItalic(doc, f, 12)
  const greeting = clientName
    ? (lang === 'lt'
      ? `Mielas(-a) ${clientName}, sveikiname su Jusu asmeniniu Kosminiu Planu — detalu planetu energiju zemelapi, formuojanti jusu gyvenima ateinanciais dvylika menesiu.`
      : `Dear ${clientName}, welcome to your personal Cosmic Blueprint — a detailed map of the planetary energies shaping your life over the coming twelve months.`)
    : tr('introGreeting', lang)
  y = wrapDraw(doc, greeting, ML, y, CW, 6)
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

  // Subtle gold page border for high-impact months (9+)
  if (month.overall_score >= 9) {
    doc.setDrawColor(...P.gold)
    doc.setLineWidth(0.6)
    doc.setGState(doc.GState({ opacity: 0.25 }))
    doc.roundedRect(10, 10, PW - 20, PH - 20, 3, 3, 'S')
    doc.setGState(doc.GState({ opacity: 1 }))
  }

  // Month header band
  doc.setTextColor(...P.navy)
  setDisplay(doc, f, 22, 'bold')
  doc.text(month.month, ML, y + 5)

  // Impact circle next to month name
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

  // ─── Sonic Prescription Section ───
  const hasSonicRx = BLUEPRINT_CATEGORY_KEYS.some(cat => month[cat]?.sonic_rx) || month.month_sonic_focus
  if (hasSonicRx) {
    if (needsNewPage(doc, y, 50)) {
      pageFooter(doc, f, pageNum, clientName, lang)
      doc.addPage()
      pageNum++
      doc.setFillColor(...P.paperRGB)
      doc.rect(0, 0, PW, PH, 'F')
      y = MT
    }

    // Gold accent line
    goldLineFull(doc, y)
    y += 6

    // Section header
    doc.setTextColor(...P.gold)
    setDisplay(doc, f, 13, 'normal')
    doc.text(tr('sonicRx', lang), ML, y)
    y += 7

    // Month sonic focus (italic opening)
    if (month.month_sonic_focus) {
      // Warm gold background tint (3% opacity)
      doc.setFillColor(196, 162, 101)
      doc.setGState(doc.GState({ opacity: 0.03 }))
      const focusLines = doc.splitTextToSize(sanitizeForPDF(month.month_sonic_focus), CW - 8)
      const focusH = focusLines.length * 5 + 6
      doc.roundedRect(ML, y - 2, CW, focusH, 2, 2, 'F')
      doc.setGState(doc.GState({ opacity: 1 }))

      doc.setTextColor(...P.grey)
      setDisplayItalic(doc, f, 10)
      y = wrapDraw(doc, month.month_sonic_focus, ML + 4, y + 1, CW - 8, 5)
      y += 5
    }

    // Category sonic prescriptions
    for (const cat of BLUEPRINT_CATEGORY_KEYS) {
      const reading = month[cat]
      if (!reading?.sonic_rx) continue

      if (needsNewPage(doc, y, 18)) {
        pageFooter(doc, f, pageNum, clientName, lang)
        doc.addPage()
        pageNum++
        doc.setFillColor(...P.paperRGB)
        doc.rect(0, 0, PW, PH, 'F')
        y = MT
      }

      const rgb = CAT_RGB[cat]
      doc.setTextColor(...rgb)
      setBody(doc, f, 7.5, true)
      doc.text(catLabel(cat, lang).toUpperCase(), ML + 4, y)
      y += 4

      doc.setTextColor(...P.grey)
      setBody(doc, f, 8.5)
      y = wrapDraw(doc, reading.sonic_rx, ML + 4, y, CW - 8, 4)
      y += 3
    }
    y += 2
  }

  // Month synthesis
  if (month.month_synthesis) {
    if (needsNewPage(doc, y, 25)) {
      pageFooter(doc, f, pageNum, clientName, lang)
      doc.addPage()
      pageNum++
      doc.setFillColor(...P.paperRGB)
      doc.rect(0, 0, PW, PH, 'F')
      y = MT
    }

    goldLine(doc, y, 40)
    y += 7

    // Light background tint for synthesis
    doc.setFillColor(...P.gold)
    doc.setGState(doc.GState({ opacity: 0.05 }))
    const synthLines = doc.splitTextToSize(sanitizeForPDF(month.month_synthesis), CW - 8)
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

  // ─── Monthly Affirmation ───
  if (month.affirmation) {
    if (needsNewPage(doc, y, 20)) {
      pageFooter(doc, f, pageNum, clientName, lang)
      doc.addPage()
      pageNum++
      doc.setFillColor(...P.paperRGB)
      doc.rect(0, 0, PW, PH, 'F')
      y = MT
    }

    y += 6
    goldLine(doc, y, 50)
    y += 8

    doc.setTextColor(...P.navy)
    setDisplayItalic(doc, f, 12)
    const affLines = doc.splitTextToSize(sanitizeForPDF(month.affirmation), CW - 20)
    // Max 2 lines — affirmations should be memorisable
    for (const line of affLines.slice(0, 2)) {
      const lw = doc.getTextWidth(line)
      doc.text(line, PW / 2 - lw / 2, y)
      y += 6
    }
    y += 2
    goldLine(doc, y, 50)
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

  // Key dates to remember — short, scannable entries
  doc.setTextColor(...P.gold)
  setDisplay(doc, f, 14, 'normal')
  doc.text(tr('keyDates', lang), ML, y)
  y += 8

  // Top months by score, presented as short date entries
  const sorted = [...months].sort((a, b) => b.overall_score - a.overall_score)
  const top = sorted.slice(0, 8)

  for (const m of top) {
    if (needsNewPage(doc, y, 12)) break // Don't overflow onto next page

    doc.setFillColor(...getImpactRGB(m.overall_score))
    doc.circle(ML + 3, y + 0.5, 2, 'F')

    doc.setTextColor(...P.navy)
    setBody(doc, f, 10, true)
    doc.text(m.month, ML + 9, y + 2)

    // Extract just the first sentence of the opening (short, no truncation)
    const firstSentence = m.opening.split(/[.!?]/)[0]?.trim()
    if (firstSentence) {
      doc.setTextColor(...P.grey)
      setBody(doc, f, 9)
      doc.text(sanitizeForPDF(`${firstSentence}.`), ML + 9, y + 7, { maxWidth: CW - 12 })
    }
    y += 13
  }

  // Growth trajectory as final reflection
  if (yearOverview.growth_trajectory) {
    y += 4
    goldLine(doc, y, 40)
    y += 8
    doc.setTextColor(...P.grey)
    setDisplayItalic(doc, f, 10.5)
    y = wrapDraw(doc, yearOverview.growth_trajectory, ML, y, CW, 5)
    y += 10
  }

  // Signature block — styled and warm
  goldLine(doc, y, 30)
  y += 12

  doc.setTextColor(...P.grey)
  setDisplayItalic(doc, f, 12)
  doc.text(tr('withCosmicLight', lang), ML, y)
  y += 8

  doc.setTextColor(...P.gold)
  setDisplay(doc, f, 14, 'normal')
  doc.text('Astrara', ML, y)
  y += 6
  doc.setTextColor(...P.grey)
  setBody(doc, f, 9)
  doc.text('by Harmonic Waves', ML, y)

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
// RITUAL CALENDAR PAGE — 3×4 mini-month grid with coloured event dots
// ═══════════════════════════════════════════════════════════════════════════

const DOT_COLORS: Record<string, RGB> = {
  beneficial_aspect: [196, 162, 101],    // gold
  challenging_aspect: [184, 74, 74],     // red
  retrograde_station: [130, 80, 160],    // purple
  moon_phase: [180, 180, 195],           // silver
  eclipse: [184, 74, 74],               // red
  season: [196, 162, 101],              // gold
}

function drawRitualCalendar(
  doc: jsPDF, f: FontSet, calendar: RitualCalendarMonth[],
  clientName: string, lang: Lang, pageNum: number,
) {
  let y = MT + 2

  // Title
  doc.setTextColor(...P.navy)
  setDisplay(doc, f, 18, 'normal')
  doc.text(tr('ritualCalendar', lang), ML, y)
  y += 6
  goldLineFull(doc, y)
  y += 6

  // 3×4 mini-month grid
  const cols = 4
  const rows = 3
  const cellW = (CW - 6) / cols
  const cellH = 52
  const dayW = cellW / 7
  const dayH = 5.5

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const idx = row * cols + col
      if (idx >= calendar.length) continue

      const cal = calendar[idx]
      const cx = ML + col * (cellW + 2)
      const cy = y + row * (cellH + 4)

      // Month label
      const shortLabel = cal.monthLabel.split(' ')[0].substring(0, 3)
      doc.setTextColor(...P.navy)
      setBody(doc, f, 7, true)
      doc.text(shortLabel, cx, cy + 3)

      // Day grid header (S M T W T F S)
      const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
      doc.setTextColor(...P.mutedGrey)
      setBody(doc, f, 4.5)
      for (let d = 0; d < 7; d++) {
        doc.text(dayLabels[d], cx + d * dayW + dayW / 2 - 1, cy + 7)
      }

      // Day numbers
      let dayRow = 0
      let dayCol = cal.firstDayOfWeek

      for (let day = 1; day <= cal.daysInMonth; day++) {
        const dx = cx + dayCol * dayW
        const dy = cy + 9 + dayRow * dayH

        // Check for events on this day
        const dayEvents = cal.events.filter(e => e.day === day)

        if (dayEvents.length > 0) {
          // Draw coloured dot behind the number
          const primaryEvent = dayEvents[0]
          const dotColor = DOT_COLORS[primaryEvent.type] || P.gold
          doc.setFillColor(...dotColor)
          doc.setGState(doc.GState({ opacity: 0.6 }))
          doc.circle(dx + dayW / 2, dy - 0.5, 2, 'F')
          doc.setGState(doc.GState({ opacity: 1 }))

          // Day number in white on the dot
          doc.setTextColor(...P.white)
          setBody(doc, f, 4)
          const dt = String(day)
          const dtw = doc.getTextWidth(dt)
          doc.text(dt, dx + dayW / 2 - dtw / 2, dy + 0.5)
        } else {
          // Normal day number
          doc.setTextColor(...P.mutedGrey)
          setBody(doc, f, 4)
          const dt = String(day)
          const dtw = doc.getTextWidth(dt)
          doc.text(dt, dx + dayW / 2 - dtw / 2, dy + 0.5)
        }

        dayCol++
        if (dayCol >= 7) {
          dayCol = 0
          dayRow++
        }
      }
    }
  }

  y += rows * (cellH + 4) + 4

  // ─── Legend ───
  goldLine(doc, y, 60)
  y += 6

  doc.setTextColor(...P.gold)
  setBody(doc, f, 8, true)
  doc.text(tr('ritualLegend', lang), ML, y)
  y += 5

  const legendItems = [
    { type: 'beneficial_aspect', label: tr('ritualBeneficial', lang) },
    { type: 'challenging_aspect', label: tr('ritualChallenging', lang) },
    { type: 'retrograde_station', label: tr('ritualRetrograde', lang) },
    { type: 'moon_phase', label: tr('ritualMoonPhase', lang) },
    { type: 'eclipse', label: tr('ritualEclipse', lang) },
    { type: 'season', label: tr('ritualSeason', lang) },
  ]

  const legendCols = 3
  const legendColW = CW / legendCols
  for (let i = 0; i < legendItems.length; i++) {
    const item = legendItems[i]
    const col = i % legendCols
    const row = Math.floor(i / legendCols)
    const lx = ML + col * legendColW
    const ly = y + row * 5

    const dotColor = DOT_COLORS[item.type] || P.gold
    doc.setFillColor(...dotColor)
    doc.setGState(doc.GState({ opacity: 0.7 }))
    doc.circle(lx + 2, ly, 1.5, 'F')
    doc.setGState(doc.GState({ opacity: 1 }))

    doc.setTextColor(...P.grey)
    setBody(doc, f, 7)
    doc.text(item.label, lx + 6, ly + 1)
  }

  pageFooter(doc, f, pageNum, clientName, lang)
}

// ═══════════════════════════════════════════════════════════════════════════
// ECLIPSE & RETROGRADE SPOTLIGHT PAGE — Event cards
// ═══════════════════════════════════════════════════════════════════════════

function drawEclipseSpotlight(
  doc: jsPDF, f: FontSet, data: BlueprintEclipseRetroData,
  clientName: string, lang: Lang, pageNum: number,
) {
  let y = MT + 5

  // Title
  doc.setTextColor(...P.navy)
  setDisplay(doc, f, 16, 'normal')
  doc.text(tr('eclipseTitle', lang), ML, y)
  y += 7
  goldLineFull(doc, y)
  y += 8

  // Intro (reassuring tone)
  if (data.intro) {
    doc.setTextColor(...P.grey)
    setDisplayItalic(doc, f, 10.5)
    y = wrapDraw(doc, data.intro, ML, y, CW, 5)
    y += 8
  }

  // Event cards
  for (const event of data.events) {
    if (needsNewPage(doc, y, 45)) {
      pageFooter(doc, f, pageNum, clientName, lang)
      doc.addPage()
      pageNum++
      doc.setFillColor(...P.paperRGB)
      doc.rect(0, 0, PW, PH, 'F')
      y = MT
    }

    // Event type determines color
    const isEclipse = event.type === 'eclipse_solar' || event.type === 'eclipse_lunar'
    const cardColor: RGB = isEclipse ? P.gold : [130, 80, 160] // gold for eclipses, purple for retrogrades

    // Card background
    doc.setFillColor(...cardColor)
    doc.setGState(doc.GState({ opacity: 0.06 }))
    const narrativeLines = doc.splitTextToSize(sanitizeForPDF(event.narrative || ''), CW - 12)
    const sonicLines = event.sonic_rx ? doc.splitTextToSize(sanitizeForPDF(event.sonic_rx), CW - 12) : []
    const cardH = 20 + narrativeLines.length * 4.5 + (sonicLines.length > 0 ? sonicLines.length * 4 + 8 : 0)
    doc.roundedRect(ML, y - 2, CW, cardH, 3, 3, 'F')
    doc.setGState(doc.GState({ opacity: 1 }))

    // Left colour bar
    doc.setFillColor(...cardColor)
    doc.setGState(doc.GState({ opacity: 0.5 }))
    doc.rect(ML, y - 2, 2.5, cardH, 'F')
    doc.setGState(doc.GState({ opacity: 1 }))

    // Event name
    doc.setTextColor(...cardColor)
    setDisplay(doc, f, 12, 'normal')
    doc.text(event.name, ML + 6, y + 3)

    // Date
    doc.setTextColor(...P.grey)
    setBody(doc, f, 9, true)
    doc.text(event.date, ML + 6, y + 9)
    y += 14

    // Narrative
    if (event.narrative) {
      doc.setTextColor(...P.navy)
      setBody(doc, f, 9.5)
      y = wrapDraw(doc, event.narrative, ML + 6, y, CW - 12, 4.5)
      y += 3
    }

    // Sonic prescription in warm-tinted box
    if (event.sonic_rx) {
      doc.setFillColor(196, 162, 101)
      doc.setGState(doc.GState({ opacity: 0.05 }))
      const rxH = sonicLines.length * 4 + 4
      doc.roundedRect(ML + 6, y - 1, CW - 12, rxH, 1.5, 1.5, 'F')
      doc.setGState(doc.GState({ opacity: 1 }))

      doc.setTextColor(...P.gold)
      setBody(doc, f, 7, true)
      doc.text(tr('sonicRx', lang), ML + 8, y + 2)
      y += 5

      doc.setTextColor(...P.grey)
      setBody(doc, f, 8.5)
      y = wrapDraw(doc, event.sonic_rx, ML + 8, y, CW - 16, 4)
      y += 2
    }

    y += 6
  }

  pageFooter(doc, f, pageNum, clientName, lang)
  return pageNum
}

// ═══════════════════════════════════════════════════════════════════════════
// SONIC TOOLKIT PAGE — Personalised sound healing reference
// ═══════════════════════════════════════════════════════════════════════════

interface SonicToolkitData {
  primaryPlanets: { planet: string; hz: number; chakra: string; instrument: string; note: string; count: number }[]
  topChakras: string[]
  dailyPractice: string
}

function computeSonicToolkit(months: BlueprintMonthNarrative[], lang: Lang): SonicToolkitData {
  // Count planet mentions across all sonic_rx fields to find most active
  const planetCounts: Record<string, number> = {}
  for (const m of months) {
    for (const cat of BLUEPRINT_CATEGORY_KEYS) {
      const rx = m[cat]?.sonic_rx || ''
      for (const planet of Object.keys(PLANET_FREQUENCIES)) {
        if (rx.toLowerCase().includes(planet.toLowerCase())) {
          planetCounts[planet] = (planetCounts[planet] || 0) + 1
        }
      }
    }
    // Also check month_sonic_focus
    const focus = m.month_sonic_focus || ''
    for (const planet of Object.keys(PLANET_FREQUENCIES)) {
      if (focus.toLowerCase().includes(planet.toLowerCase())) {
        planetCounts[planet] = (planetCounts[planet] || 0) + 1
      }
    }
  }

  // Sort by count, take top 4
  const sorted = Object.entries(planetCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)

  const primaryPlanets = sorted.map(([planet, count]) => {
    const freq = PLANET_FREQUENCIES[planet]
    return {
      planet,
      hz: freq.hz,
      chakra: freq.chakra,
      instrument: freq.instrument,
      note: freq.note,
      count,
    }
  })

  // Top chakras
  const chakraCounts: Record<string, number> = {}
  for (const p of primaryPlanets) {
    chakraCounts[p.chakra] = (chakraCounts[p.chakra] || 0) + p.count
  }
  const topChakras = Object.entries(chakraCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([c]) => c)

  // Daily practice suggestion
  const topPlanet = primaryPlanets[0]
  const dailyPractice = topPlanet
    ? lang === 'lt'
      ? `Pradekite diena 5 minutes meditacija su ${topPlanet.hz} Hz dazniu (${topPlanet.planet} energija, ${topPlanet.chakra} cakra). Naudokite ${topPlanet.instrument.split(',')[0].toLowerCase()} ir leiskite vibracijai issklaidyti dienos itampa. Baigdami, tris kartus giliai ikvepkite ir nustatykite savo dienos intencija.`
      : `Begin your day with a 5-minute meditation using the ${topPlanet.hz} Hz frequency (${topPlanet.planet} energy, ${topPlanet.chakra} chakra). Use a ${topPlanet.instrument.split(',')[0].toLowerCase()} and allow the vibration to dissolve tension. Close with three deep breaths and set your intention for the day.`
    : ''

  return { primaryPlanets, topChakras, dailyPractice }
}

function drawSonicToolkit(
  doc: jsPDF, f: FontSet, toolkit: SonicToolkitData,
  year: string, clientName: string, lang: Lang, pageNum: number,
) {
  let y = MT + 5

  // Title
  doc.setTextColor(...P.navy)
  setDisplay(doc, f, 18, 'normal')
  const title = `${tr('sonicToolkitTitle', lang)} ${year}`
  doc.text(title, ML, y)
  y += 7
  goldLineFull(doc, y)
  y += 10

  // ─── Primary Frequencies ───
  doc.setTextColor(...P.gold)
  setDisplay(doc, f, 13, 'normal')
  doc.text(tr('sonicFrequencies', lang), ML, y)
  y += 8

  for (const p of toolkit.primaryPlanets) {
    // Mini card with gold-tinted background
    doc.setFillColor(196, 162, 101)
    doc.setGState(doc.GState({ opacity: 0.04 }))
    doc.roundedRect(ML, y - 3, CW, 22, 2, 2, 'F')
    doc.setGState(doc.GState({ opacity: 1 }))

    // Planet name in bold
    doc.setTextColor(...P.navy)
    setBody(doc, f, 11, true)
    doc.text(p.planet, ML + 4, y)

    // Frequency in large text
    doc.setTextColor(...P.gold)
    setDisplay(doc, f, 16, 'bold')
    const hzText = `${p.hz} Hz`
    const hzW = doc.getTextWidth(hzText)
    doc.text(hzText, PW - MR - hzW - 4, y)

    // Details line
    doc.setTextColor(...P.grey)
    setBody(doc, f, 8.5)
    const desc = `${p.chakra} chakra  ·  Note: ${p.note}  ·  ${p.instrument}`
    y += 5
    y = wrapDraw(doc, desc, ML + 4, y, CW - 8, 4)
    y += 6
  }

  y += 4

  // ─── Recommended Instruments ───
  doc.setTextColor(...P.gold)
  setDisplay(doc, f, 13, 'normal')
  doc.text(tr('sonicInstruments', lang), ML, y)
  y += 8

  // Build instrument list from top planets with proper capitalisation
  const instruments = [...new Set(toolkit.primaryPlanets.flatMap(p => p.instrument.split(',').map(i => i.trim())))]
  for (const inst of instruments.slice(0, 6)) {
    starDot(doc, ML + 4, y)
    doc.setTextColor(...P.navy)
    setBody(doc, f, 10, true)
    // Capitalise first letter
    const capitalised = inst.charAt(0).toUpperCase() + inst.slice(1)
    doc.text(capitalised, ML + 9, y + 1)
    y += 6
  }

  y += 6

  // ─── Chakra Focus Areas ───
  doc.setTextColor(...P.gold)
  setDisplay(doc, f, 13, 'normal')
  doc.text(tr('sonicChakras', lang), ML, y)
  y += 8

  const chakraColors: Record<string, RGB> = {
    'Root': [184, 74, 74],
    'Sacral': [220, 140, 60],
    'Solar Plexus': [196, 162, 101],
    'Heart': [42, 123, 82],
    'Throat': [58, 79, 138],
    'Third Eye': [107, 77, 138],
    'Crown': [160, 120, 200],
  }

  // Chakra descriptions based on planetary context
  const chakraDescriptions: Record<string, string> = {
    'Root': 'Grounding, physical vitality, security during transformation',
    'Sacral': 'Creative flow, emotional release, sensual connection',
    'Solar Plexus': 'Personal power, confidence, digestive harmony',
    'Heart': 'Love integration, relationship healing, self-compassion',
    'Throat': 'Authentic expression, communication clarity, truth',
    'Third Eye': 'Intuition, vision, mental clarity and insight',
    'Crown': 'Spiritual connection, higher wisdom, cosmic alignment',
  }

  for (const chakra of toolkit.topChakras) {
    const cc = chakraColors[chakra] || P.gold
    doc.setFillColor(...cc)
    doc.circle(ML + 4, y, 2.5, 'F')

    doc.setTextColor(...P.navy)
    setBody(doc, f, 10, true)
    doc.text(`${chakra} Chakra`, ML + 10, y + 1.5)

    // Description
    const desc = chakraDescriptions[chakra]
    if (desc) {
      doc.setTextColor(...P.grey)
      setBody(doc, f, 8.5)
      doc.text(desc, ML + 10, y + 6)
    }
    y += 12
  }

  y += 4

  // ─── Daily Practice ───
  doc.setTextColor(...P.gold)
  setDisplay(doc, f, 13, 'normal')
  doc.text(tr('sonicPractice', lang), ML, y)
  y += 8

  // Background tint
  doc.setFillColor(196, 162, 101)
  doc.setGState(doc.GState({ opacity: 0.04 }))
  const practiceLines = doc.splitTextToSize(sanitizeForPDF(toolkit.dailyPractice), CW - 12)
  const practiceH = practiceLines.length * 5 + 8
  doc.roundedRect(ML, y - 2, CW, practiceH, 2, 2, 'F')
  doc.setGState(doc.GState({ opacity: 1 }))

  doc.setTextColor(...P.navy)
  setBody(doc, f, 10)
  y = wrapDraw(doc, toolkit.dailyPractice, ML + 6, y + 2, CW - 12, 5)

  pageFooter(doc, f, pageNum, clientName, lang)
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Export — Premium Blueprint (narrative-based)
// ═══════════════════════════════════════════════════════════════════════════

export interface BlueprintPdfParams {
  months: BlueprintMonthNarrative[]
  yearOverview: BlueprintYearOverview | null
  eclipseRetroData?: BlueprintEclipseRetroData | null
  ritualCalendar?: RitualCalendarMonth[]
  clientName: string
  birthDate: string
  birthTime: string
  language: 'en' | 'lt'
}

export async function generateBlueprintPdf(params: BlueprintPdfParams) {
  const { months, yearOverview, eclipseRetroData, ritualCalendar, clientName, birthDate, birthTime, language } = params

  if (months.length === 0) return

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  // Set paper background for all pages via page event
  doc.setFillColor(...P.paperRGB)

  const f = initFonts()
  let pageNum = 1

  // Date range
  const firstMonth = months[0].month
  const lastMonth = months[months.length - 1].month
  const dateRange = `${firstMonth} — ${lastMonth}`
  const yearStr = firstMonth.split(' ').pop() || new Date().getFullYear().toString()

  // ─── Page 1: Cover ───
  drawCover(doc, f, clientName, birthDate, birthTime, dateRange, language)

  // ─── Page 2: Introduction ───
  doc.addPage()
  pageNum++
  doc.setFillColor(...P.paperRGB)
  doc.rect(0, 0, PW, PH, 'F')
  drawIntroPage(doc, f, clientName, birthDate, language, pageNum)

  // ─── Page 3: Year at a Glance ───
  doc.addPage()
  pageNum++
  doc.setFillColor(...P.paperRGB)
  doc.rect(0, 0, PW, PH, 'F')
  drawYearGlance(doc, f, months, yearOverview, clientName, language, pageNum)

  // ─── Page 4: Ritual Calendar ───
  if (ritualCalendar && ritualCalendar.length > 0) {
    doc.addPage()
    pageNum++
    doc.setFillColor(...P.paperRGB)
    doc.rect(0, 0, PW, PH, 'F')
    drawRitualCalendar(doc, f, ritualCalendar, clientName, language, pageNum)
  }

  // ─── Page 5: Eclipse & Retrograde Spotlight ───
  const eclipseData = eclipseRetroData || yearOverview?.eclipses_and_retrogrades
  if (eclipseData && eclipseData.events && eclipseData.events.length > 0) {
    doc.addPage()
    pageNum++
    doc.setFillColor(...P.paperRGB)
    doc.rect(0, 0, PW, PH, 'F')
    pageNum = drawEclipseSpotlight(doc, f, eclipseData, clientName, language, pageNum)
  }

  // ─── Pages 6–17: Monthly Readings ───
  for (const month of months) {
    doc.addPage()
    pageNum++
    doc.setFillColor(...P.paperRGB)
    doc.rect(0, 0, PW, PH, 'F')
    pageNum = drawMonthPage(doc, f, month, clientName, language, pageNum)
  }

  // ─── Year Synthesis ───
  if (yearOverview) {
    doc.addPage()
    pageNum++
    doc.setFillColor(...P.paperRGB)
    doc.rect(0, 0, PW, PH, 'F')
    drawYearSynthesis(doc, f, yearOverview, clientName, language, pageNum)
  }

  // ─── Closing ───
  if (yearOverview) {
    doc.addPage()
    pageNum++
    doc.setFillColor(...P.paperRGB)
    doc.rect(0, 0, PW, PH, 'F')
    drawClosingPage(doc, f, yearOverview, months, clientName, language, pageNum)
  }

  // ─── Sonic Toolkit ───
  const toolkit = computeSonicToolkit(months, language)
  if (toolkit.primaryPlanets.length > 0) {
    doc.addPage()
    pageNum++
    doc.setFillColor(...P.paperRGB)
    doc.rect(0, 0, PW, PH, 'F')
    drawSonicToolkit(doc, f, toolkit, yearStr, clientName, language, pageNum)
  }

  // ─── About ───
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
  const f = initFonts()
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
    const wrapped = doc.splitTextToSize(sanitizeForPDF(theme), CW - 50)
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
        const tl = doc.splitTextToSize(sanitizeForPDF(data.year_trend), CW - 8)
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
      const planets = sanitizeForPDF(reading.planetary_breakdown.map(p => {
        const aspects = p.aspects?.map(a => `${a.symbol}${a.target}`).join(' ') ?? ''
        return `${p.symbol} ${p.planet} ${p.position} ${aspects}`
      }).join('  |  '))
      const pLines = doc.splitTextToSize(planets, CW - 4)
      for (const line of pLines.slice(0, 2)) {
        doc.text(line, ML + 2, y)
        y += 3.5
      }
    }

    if (reading.practical_guidance) {
      doc.setTextColor(100, 90, 120)
      setBody(doc, f, 7)
      const gLines = doc.splitTextToSize(sanitizeForPDF(reading.practical_guidance), CW - 4)
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
