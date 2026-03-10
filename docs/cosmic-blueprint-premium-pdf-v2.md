Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

gigathink

# Cosmic Blueprint PDF — Premium Client Product (Complete Rethink)

## Philosophy

The Cosmic Blueprint PDF is NOT an export of the grid. It is a standalone premium product — the thing clients pay for. It must read like a personal letter from a master astrologer, not a data dump. Every page should feel crafted, intentional, and deeply personal.

The grid on /promo remains the practitioner's quick-scan dashboard (compact readings = perfect for that purpose). The PDF is the client experience — rich, narrative, beautiful.

## Architecture: Separate Generation Pipeline

### Two-stage approach:

**Stage 1 — Transit Data Computation (no API cost)**
Compute all planetary positions, aspects, ingresses, retrogrades, and moon phases for all 12 months using astronomy-engine. This is pure math — no API calls needed. Include the client's natal chart positions if birth data is provided, and compute transit-to-natal aspects.

Store this as a structured transit data object.

**Stage 2 — Narrative Generation (3 API calls total)**

Instead of 12+ calls, make exactly 3 rich narrative calls:

**Call 1: Months 1–4 narrative** (max_tokens: 4000)
Send transit data for months 1–4. Ask for flowing, narrative readings.

**Call 2: Months 5–8 narrative** (max_tokens: 4000)
Send transit data for months 5–8.

**Call 3: Months 9–12 + Year Overview narrative** (max_tokens: 4000)
Send transit data for months 9–12 plus a summary of the key transits from all 12 months. Ask for months 9–12 readings PLUS the full year overview and closing message.

3 calls × 4000 max_tokens = manageable cost, and each call has plenty of room for rich, detailed content covering 4 months.

### System Prompt for PDF Narrative Calls

```
You are a renowned professional astrologer writing a personal 12-month transit reading for a client. This reading is a premium paid product — the client expects depth, insight, and care.

Your writing style:
- Warm, wise, and personal — as if speaking directly to the client
- Weave planetary positions and aspects naturally into the narrative (don't list them separately)
- Be specific about what the transits mean for each life area — avoid vague generalisations
- Include practical guidance naturally within the narrative
- Mention specific dates when exact aspects occur ("Around March 14th, as Venus trines Jupiter...")
- Each monthly reading should tell a story — the energy builds, peaks, and transitions
- Reference connections between categories ("The financial confidence you're building this month is supported by the same Jupiter energy opening doors in your career...")
- Use evocative but grounded language — mystical without being fluffy

The client's data:
- Name: {name}
- Birth date: {birthDate}
- Birth time: {birthTime} (if provided)
- Birth location: {birthLocation} (if provided)
- Sun sign: {sunSign}

Transit data for this period:
{transitData}

If birth time is provided, reference natal chart transits (transiting planets aspecting natal positions). If not, provide general transit readings.

Respond ONLY in valid JSON with no markdown backticks. Use this structure:

{
  "months": [
    {
      "month": "March 2026",
      "overall_score": 7,
      "opening": "A 2-3 sentence atmospheric opening setting the energetic tone for the month",
      "finance": {
        "score": 6,
        "narrative": "A rich 4-6 sentence narrative about financial energy this month. Weave in the specific planetary transits naturally. Include dates where relevant. End with practical guidance."
      },
      "relationships": {
        "score": 8,
        "narrative": "4-6 sentences..."
      },
      "career": {
        "score": 7,
        "narrative": "4-6 sentences..."
      },
      "health": {
        "score": 5,
        "narrative": "4-6 sentences..."
      },
      "spiritual": {
        "score": 9,
        "narrative": "4-6 sentences..."
      },
      "month_synthesis": "A 3-4 sentence closing that weaves all themes together and bridges to the next month's energy"
    }
  ]
}
```

For Call 3, add to the structure:
```
  "year_overview": {
    "opening": "2-3 sentence overview of the year's dominant energy",
    "major_themes": "3-4 sentence description of the year's major planetary themes",
    "peak_periods": "2-3 sentences highlighting the most significant months and why",
    "growth_trajectory": "3-4 sentences about the client's overall growth arc across the year",
    "closing_message": "A warm, empowering 2-3 sentence personal closing message to the client"
  }
```

### API Call Configuration
```typescript
{
  model: "claude-sonnet-4-20250514",
  max_tokens: 4000,
  temperature: 0.7,  // Slightly creative for richer narrative
  messages: [{ role: "user", content: prompt }]
}
```

### Sequential with Delay
Run the 3 calls sequentially with 3-second delays between them. Show progress: "Crafting your reading... Part 1 of 3"

### Language
Pass the selected language (EN/LT) to the prompt. Add to system prompt:
- EN: "Write in English."
- LT: "Write in Lithuanian. Use natural, flowing Lithuanian — not stiff translations."

## PDF Design — The Product

### Design Philosophy
This PDF must look like it was designed by a luxury brand's creative director. Think: Diptyque candle packaging meets astronomy textbook meets high-end wellness retreat brochure.

No one should look at this PDF and think "AI generated this." Every detail matters.

### Page Size & Setup
- A4 portrait (210 × 297mm)
- Bleed area consideration — keep critical content 15mm from edges
- Total pages: approximately 18–20

### Colour Palette (Print-Optimised)
- **Paper**: Warm off-white (#FAF8F5) — feels like quality stock
- **Primary text**: Deep space navy (#12122A) — richer than plain black
- **Secondary text**: Muted cosmic grey (#6B6B80)
- **Gold accent**: (#C4A265) — for borders, scores, decorative elements, category names
- **Category colours** (muted, sophisticated versions):
  - Finance: Antique gold (#B8963E)
  - Relationships: Dusty rose (#B85C6F)
  - Career: Deep sapphire (#3A4F8A)
  - Health: Forest emerald (#2A7B52)
  - Spiritual: Royal amethyst (#6B4D8A)
- **Impact gradient**: Sage (#5B8A6B) → Amber (#C4963E) → Vermillion (#B84A3E)
- Avoid pure saturated colours — everything should feel muted, elegant, natural

### Typography
Try to download and register Google Fonts. Fetch from fonts.google.com:

- **Display/Titles**: Cormorant Garamond (elegant serif) — use for "Cosmic Blueprint", month names, section headers
  - URL to try: https://github.com/google/fonts/raw/main/ofl/cormorantgaramond/CormorantGaramond-Regular.ttf
  - Fallback: Times-Roman (built-in) styled with generous size and letter-spacing
- **Body text**: Source Sans 3 or the built-in Helvetica
  - Body: 10.5pt with 15pt leading (generous line-height for readability)
- **Accent text**: Cormorant Garamond Italic for quotes, guidance text, atmospheric openings

If font downloads fail from the allowed domains, use built-in fonts (Times-Roman for headings, Helvetica for body) and compensate with sizing, spacing, and weight contrast.

### Page-by-Page Layout

---

#### PAGE 1 — Cover

Full-page, dramatic:

- Background: Deep navy (#12122A) filling the entire page
- Centre-top: Draw a decorative celestial circle using reportlab — a thin gold circle with 12 small marks around it (like a clock/zodiac wheel), with the client's sun sign symbol larger and in gold at the top of the wheel
- Inside the circle: Small dots representing planet positions (approximate, decorative — not precisely accurate, this is design not data)
- Below the wheel:
  - "COSMIC BLUEPRINT" — large, tracked-out letters (Cormorant Garamond, ~28pt, gold, letter-spacing 4pt)
  - Thin gold horizontal line (60mm wide, centred)
  - "Your Personal Transit Reading" — 14pt, light grey (#A0A0B0)
  - Spacer
  - "Prepared for {Client Name}" — 16pt, white
  - "{Month Year} — {Month Year}" — 12pt, light grey
  - Spacer
  - Birth data line: date, time, location in small elegant text
- Bottom: "ASTRARA" wordmark + "astrara.app" in small gold text
- Subtle scattered dots across the background to suggest stars (draw 30-50 tiny circles in very low opacity white, randomly positioned)

---

#### PAGE 2 — Personal Introduction

- Header: "Your Cosmic Year Ahead" in Cormorant Garamond, gold
- A warm personal opening paragraph addressing the client by name, introducing what this reading contains and how to use it
- Brief explanation: "This reading is based on precise astronomical calculations of planetary positions (NASA JPL ephemeris data) combined with professional astrological interpretation."
- If birth chart data was provided: "Your natal chart has been integrated, making these readings specific to YOUR unique planetary blueprint."
- A "How to Read This Report" section explaining the scoring system:
  - Draw a small horizontal gradient bar from sage green to vermillion red
  - "Impact scores from 1-10 indicate the intensity of cosmic activity in each area. Higher scores don't mean 'bad' — they mean more energy, more potential, more to work with."
- Keep this page elegant and minimal — lots of whitespace

---

#### PAGE 3 — Year at a Glance

- Header: "Your Year at a Glance"
- **12-Month Impact Timeline**: Draw a horizontal chart showing 12 bars (one per month), heights proportional to overall monthly impact scores, coloured by the impact gradient. Month labels below. This gives an instant visual rhythm of the year.
- **Category Year Scores**: 5 horizontal mini-bars, one per category, showing the average yearly score. Each with the category colour and name.
- **Year Overview narrative**: The `year_overview.opening` and `year_overview.major_themes` text
- **Peak Periods**: Call out the 2-3 most significant months with brief annotations
- This is the "executive summary" — if someone only reads this page, they get the picture

---

#### PAGES 4–15 — Monthly Readings (1 page per month)

Each month gets a dedicated full page:

**Header band:**
- Month name + year in Cormorant Garamond, large (22pt), gold
- Overall month impact score as a filled circle (40pt diameter) with the score number inside, coloured by impact gradient
- Thin gold line below

**Opening atmosphere:**
- The `opening` text in italic, slightly larger than body text (11.5pt), creating an evocative introduction to the month's energy

**Category readings:**
Arrange the 5 categories in a clear, readable flow. For each:
- Category name in its accent colour, small caps, 9pt, with a thin coloured line extending to the right
- Impact score: small filled circle (colour-coded) with number, positioned to the right of the category name
- Narrative text: the full 4-6 sentence reading in body text, flowing naturally
- Subtle spacing between categories (8mm)

Layout option: Two-column layout for categories — 2 on the left, 3 on the right (or vice versa). This uses the page width better than a single column of 5 stacked readings. Alternatively, if text is long, use full-width single column — test both and use whichever feels more balanced.

**Month Synthesis:**
At the bottom, separated by a thin gold line:
- The `month_synthesis` text in a slightly different style (perhaps a light background tint or italic) to distinguish it as the closing summary
- Small decorative element: a tiny star or diamond glyph centred below

**Background watermark (very subtle):**
- The zodiac constellation drawing for the dominant sign energy of the month
- Drawn in very low opacity (#12122A at 3-5% darker than the page background) so it's barely visible but adds a subliminal layer of craft

---

#### PAGE 16 — Year Synthesis

- Header: "Your Year in Perspective"
- The full year overview narrative: opening, major themes, peak periods, growth trajectory
- This should feel like the wise astrologer sitting back and giving the big picture
- Visual: A simple arc or wave drawn across the page suggesting the ebb and flow of the year's energy

---

#### PAGE 17 — Closing & Guidance

- Header: "Moving Forward"
- The closing personal message to the client
- A curated list of 3-5 "Key Dates to Remember" pulled from the most significant exact aspects across all 12 months
- Inspirational closing: something warm and empowering, not generic
- Signature area: "With cosmic light," / "Astrara by Harmonic Waves"

---

#### PAGE 18 — About & Methodology

- "About This Reading" — brief explanation of the methodology
- "About Astrara" — one paragraph
- Website: astrara.app
- Disclaimer: "This reading is for guidance and self-reflection. It does not constitute financial, medical, or legal advice."
- Optional: QR code to astrara.app (use `qrcode` Python library if installable, otherwise skip)

### Decorative Details Throughout

- **Page numbers**: Small, centred at bottom, in muted grey. Format: "— 3 —"
- **Running header**: Tiny "Cosmic Blueprint · {Client Name}" in grey at the top of pages 3+
- **Gold accent lines**: Thin (0.5pt) gold lines used as section dividers — never thick or heavy
- **Star dots**: Occasional tiny gold dots (1pt circles) used as decorative punctuation between sections
- **Consistent margins**: 20mm left/right, 25mm top, 20mm bottom on all content pages

### Print Readiness

- The PDF should look excellent when printed on standard A4 paper
- All text must be large enough to read comfortably (nothing below 8pt)
- Colours should be chosen for good contrast on white paper
- The cover page is the only dark-background page — rest are light for print friendliness

## Implementation

### Use @react-pdf/renderer (client-side) OR reportlab (server-side)

Evaluate which is better for this project:

**Option A: @react-pdf/renderer** (recommended if custom fonts work)
- Runs client-side in the browser
- React component syntax — familiar for this codebase
- Good font support (can register Google Fonts)
- `npm install @react-pdf/renderer`

**Option B: reportlab via Next.js API route**
- Server-side Python
- Very powerful for precise layouts
- May need additional setup on Vercel (Python runtime)
- More control over exact positioning

Try Option A first. If font loading or layout quality isn't sufficient, fall back to Option B.

### Button & Flow

1. On the /promo page, add a prominent "Generate Cosmic Blueprint" button (styled premium — gold border, elegant typography)
2. Button is only active if the grid has been generated (readings exist)
3. Click triggers:
   - Progress modal: "Crafting your Cosmic Blueprint..." with a 3-stage progress indicator
   - Stage 1: "Computing planetary transits..." (instant — pure math)
   - Stage 2: "Writing your personal reading..." (3 API calls, show 1/3, 2/3, 3/3)
   - Stage 3: "Designing your report..." (PDF generation)
4. PDF downloads automatically when complete
5. Also offer "Open in new tab" to preview

### Caching

- Cache the generated narrative data (the 3 API responses) in localStorage keyed by birth data hash
- If cached data exists for this client, skip the API calls and go straight to PDF generation
- "Regenerate" option to force fresh API calls

### Cost Estimate

3 API calls × ~1500 input tokens × ~3500 output tokens per call:
- Sonnet: approximately $0.03-0.05 per full PDF generation
- That's negligible as a business cost when charging clients for the reading

## Bilingual

- EN/LT as before — pass language to API calls
- All PDF labels, headers, page titles need translation
- Lithuanian characters must render correctly in the chosen font

## Verification

- [ ] Generate a full Cosmic Blueprint PDF for a test client
- [ ] Cover page looks stunning — dark, cosmic, premium
- [ ] Year at a Glance page provides clear visual overview
- [ ] All 12 monthly pages have rich, flowing narrative (not compressed bullet points)
- [ ] Readings feel personal and specific (reference actual planets and dates)
- [ ] Typography is elegant with clear hierarchy
- [ ] Colour palette is cohesive and sophisticated
- [ ] The PDF looks professional when printed on A4
- [ ] Lithuanian version generates with correct characters
- [ ] Total generation time is under 2 minutes
- [ ] File size is under 5MB
- [ ] A client receiving this would feel they received a premium, personalised product worth paying for
- [ ] No other product on the market looks like this
