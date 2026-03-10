Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

gigathink

# Feature: Premium PDF Export — "Cosmic Blueprint" Personal Transit Reading

## Overview

Add a "Download Reading" button to the `/promo` page that generates a stunning, premium-quality PDF report from the 12-month transit reading grid data. This PDF IS the product — it's what clients receive after paying for a personal reading. It must look like a luxury publication, not a generated report. Think high-end editorial design meets mystical astrology brand.

The PDF should feel like something a client would proudly show friends, frame pages of, or photograph for Instagram stories — which becomes organic marketing.

## Brand & Product Name

- Report title: **"Cosmic Blueprint"** — Your Personal Transit Reading
- Subtitle: "A 12-Month Astrological Forecast"
- Brand: Astrara by Harmonic Waves
- Include astrara.app URL subtly in the footer

## PDF Structure & Content

### Page 1 — Cover Page

A full-page, visually stunning cover:
- **Large elegant title**: "Cosmic Blueprint" in a premium serif or display font
- **Subtitle**: "Your Personal Transit Reading"
- **Client name** (from birth chart entry, e.g. "Prepared for Elena Petrova")
- **Date range**: e.g. "March 2026 — February 2027"
- **Birth data**: Date, time, location (if provided)
- **Visual**: A stylised zodiac wheel or constellation artwork — create this using reportlab drawing primitives (circles, lines, arcs) to draw an elegant zodiac wheel with the client's sun sign highlighted. Use the Astrara colour palette.
- **Brand footer**: "Astrara by Harmonic Waves · astrara.app"
- Background: deep cosmic dark (#05050F or similar), with subtle gradient or star-field dots

### Page 2 — Your Year at a Glance

An executive summary page:
- **12-Month Impact Overview** — a visual timeline bar showing each month's overall impact score as coloured segments (green→red gradient), giving an instant visual of the year's intensity curve
- **Top 3 Peak Months** — highlighted with brief descriptions of why they're significant
- **Key Planetary Themes** — 3–4 bullet points summarising the dominant planetary influences across the year
- **Category Highlights** — one-liner per category noting the overall yearly trend (e.g. "Finance: Growth phase, strongest in Q3")
- This page should feel like the "dashboard" — if a client reads nothing else, this page tells the story

### Pages 3–14 — Monthly Deep Dives (one page per month)

Each month gets a full dedicated page:

**Header area:**
- Month name + year in large display type
- Overall monthly impact score badge (coloured circle)
- Moon phase icon for the month
- Key planet symbols active this month

**Category cards layout:**
Arrange the 5 category readings in an elegant grid or stacked layout on the page. For each category:
- Category name + icon
- Impact score (1–10) with colour indicator
- Key theme headline (bold, 1 line)
- Full reading (3–5 sentences)
- Planetary breakdown: planet symbols, positions, aspects with symbols (☌ ☍ △ □ ⚹), and brief interpretations
- Practical guidance in italics
- Dates to watch (if any)

**Monthly Summary sidebar or footer:**
- Synthesised overview tying all categories together
- "Month in a nutshell" — one compelling sentence

**Visual elements:**
- Subtle zodiac constellation watermark in the background specific to the dominant sign energy of the month
- Elegant dividers between categories (thin lines, not heavy borders)
- Colour accents from the impact score, but restrained — this is print design, not screen UI

### Page 15 — 12-Month Overview & Synthesis

The grand summary:
- Per-category yearly narrative (2–3 sentences each)
- Overall year theme and trajectory
- Key dates and turning points across the entire year
- Closing inspirational/empowering message personalised to the client's chart
- This should feel like the conclusion of a premium consultation

### Final Page — About & Contact

- Brief "About This Reading" — explains the methodology (NASA JPL-accurate planetary data, professional astrological interpretation)
- "About Astrara" — one paragraph about the app and Harmonic Waves ecosystem
- Contact/website: astrara.app
- Social media handles (if available in the app config)
- Small disclaimer: "This reading is for guidance and self-reflection purposes. It does not constitute financial, medical, or legal advice."
- QR code linking to astrara.app (generate using a QR code library if available, otherwise skip)

## Visual Design Requirements

This PDF must look PREMIUM. Not "generated report" — luxury editorial.

### Typography
- **Title/Display font**: Use a serif font for headings. reportlab has limited built-in fonts, so register a premium-feeling font. Options:
  - Download and embed a Google Font like Playfair Display, Cormorant Garamond, or Cinzel from the allowed domains if possible
  - If font download isn't possible, use reportlab's built-in Times-Roman for headings (styled large and with generous letter-spacing) and Helvetica for body text
  - The key is LARGE type sizes for titles, generous spacing, and elegant proportions
- **Body text**: Clean, readable, well-spaced. 10–11pt with 14–16pt leading.
- **Planet/aspect symbols**: Use Unicode glyphs (☉☽☿♀♂♃♄♅♆♇ for planets, ☌☍△□⚹ for aspects). Verify they render in the chosen font — if not, use text fallbacks (e.g. "Sun", "Moon", "trine", "square")

### Colour Palette
- **Background**: White or very light cream (#FAFAF8) for pages — this is a printable PDF
- **Primary text**: Deep charcoal (#1A1A2E) — NOT pure black
- **Accent colours**: Gold (#C9A84C) for decorative elements, borders, score badges for neutral items
- **Impact gradient**: Green (#2D8B4E) → Yellow (#C4A72B) → Orange (#D4782F) → Red (#C44536) for score-based elements
- **Category accent colours** — each category gets a subtle accent:
  - Finance: Gold (#C9A84C)
  - Relationships: Rose (#C4627A)
  - Career: Deep blue (#3A5BA0)
  - Health: Emerald (#2D8B4E)
  - Spiritual: Purple (#7B5EA7)
- **Decorative elements**: Thin gold lines for dividers, subtle geometric patterns

### Layout Principles
- **Generous margins** — at least 20mm on all sides. This is premium, not cramped.
- **Consistent grid** — align everything to a clear underlying grid
- **Breathing room** — plenty of whitespace between sections. Don't fill every pixel.
- **Visual hierarchy** — clear distinction between headings, subheadings, body, and metadata
- **Page numbers** — elegant, small, centred at bottom with subtle styling

### Decorative Elements (draw with reportlab primitives)
- **Zodiac wheel on cover** — draw a stylised wheel using arcs, circles, and lines. Highlight the client's sun sign segment in gold.
- **Constellation patterns** — subtle dot-and-line constellation drawings as page watermarks (very low opacity, decorative)
- **Impact score circles** — draw filled circles with the impact colour and white number text inside
- **Section dividers** — thin gold lines with a small diamond or star in the centre
- **Monthly timeline bar** (Year at a Glance page) — draw a horizontal bar divided into 12 segments, each coloured by that month's impact score
- **Planet symbol badges** — small circles with planet symbols, used as inline decorations

## Technical Implementation

### Use reportlab (Python)

Build the PDF using reportlab's Platypus framework for the main content flow, with Canvas-level drawing for the cover page and custom visual elements.

```
pip install reportlab --break-system-packages
```

### Integration with /promo page

1. Add a "Download Cosmic Blueprint" button to the `/promo` page header (styled as a premium purple button with a subtle shimmer/glow)
2. When clicked, the frontend sends the complete reading data (all 78 cards' data as JSON) to a Next.js API route
3. The API route:
   - Receives the JSON reading data + client birth data
   - Calls a Python script (or use reportlab via a serverless function — check what's feasible in the Next.js/Vercel setup)
   - The Python script generates the PDF
   - Returns the PDF as a downloadable file

### Alternative: Generate PDF client-side

If server-side Python isn't feasible on Vercel, use **jsPDF** + **html2canvas** or the **@react-pdf/renderer** library to generate the PDF client-side in the browser:

```
npm install @react-pdf/renderer
```

or

```
npm install jspdf html2canvas
```

Choose whichever approach integrates best with the existing Astrara setup. `@react-pdf/renderer` gives the most control over layout and typography for a React/Next.js app. If using this approach, create a dedicated React component tree that renders the PDF layout (it won't be displayed on screen — it's only for PDF generation).

### Data Flow

The PDF generator receives the SAME data that powers the grid:
```typescript
interface CosmicBlueprintData {
  client: {
    name: string;
    birthDate: string;
    birthTime?: string;
    birthLocation?: string;
    sunSign: string;
  };
  dateRange: {
    start: string; // "March 2026"
    end: string;   // "February 2027"
  };
  months: Array<{
    month: string;
    year: number;
    overallImpact: number;
    moonPhase: string;
    activePlanets: string[];
    categories: {
      finance: CategoryReading;
      relationships: CategoryReading;
      career: CategoryReading;
      health: CategoryReading;
      spiritual: CategoryReading;
    };
    monthlySummary: MonthlySummary;
  }>;
  yearOverview: YearOverview;
  language: 'en' | 'lt';
}
```

## Bilingual Support

Generate the PDF in the currently selected language (EN or LT). All labels, headers, section titles, and the reading content itself should be in the appropriate language. The PDF title and structure names need translations:

- EN: "Cosmic Blueprint" / LT: "Kosminis Planas"
- EN: "Your Personal Transit Reading" / LT: "Jūsų Asmeninis Tranzitų Skaitymas"
- EN: "Your Year at a Glance" / LT: "Jūsų Metai Vienu Žvilgsniu"
- EN: "Monthly Summary" / LT: "Mėnesio Apžvalga"
- EN: "What's Happening Now" / LT: "Kas Vyksta Dabar"
- EN: "Practical Guidance" / LT: "Praktiniai Patarimai"
- EN: "Dates to Watch" / LT: "Svarbios Datos"
- (etc. — translate ALL UI text)

Note: Lithuanian characters (ą, č, ę, ė, į, š, ų, ū, ž) MUST render correctly in the PDF. Verify the chosen font supports the Lithuanian character set. If using reportlab with a custom font, ensure the font file includes these glyphs.

## Quality Checklist

Before considering this done:
- [ ] Cover page looks like a luxury publication, not a generated report
- [ ] Typography is elegant with clear hierarchy — large titles, readable body
- [ ] Colour palette is cohesive and restrained (not rainbow chaos)
- [ ] Every monthly page has consistent layout with clear visual structure
- [ ] Impact scores are visually prominent with correct colour coding
- [ ] Planetary symbols and aspect symbols render correctly
- [ ] All decorative elements (zodiac wheel, dividers, constellation watermarks) render cleanly
- [ ] Generous whitespace throughout — nothing feels cramped
- [ ] Page numbers present and styled
- [ ] Both EN and LT versions generate correctly with proper character rendering
- [ ] PDF file size is reasonable (under 5MB)
- [ ] The PDF looks good when printed on A4 paper
- [ ] A client receiving this would feel they got a premium product worth paying for
