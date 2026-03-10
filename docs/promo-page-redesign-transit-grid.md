Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

gigathink

# Feature: Redesign /promo — Professional 12-Month Transit Reading Grid

## Overview

Completely redesign the `/promo` page into a professional, PC-optimised client consultation tool. The page presents a structured grid of astrological transit readings across a rolling 12-month window, broken down by life categories. Each cell is an AI-generated reading backed by real planetary transit data. This is used during live client sessions — the practitioner needs to scan quickly, drill into detail on demand, and answer "why?" questions with planetary evidence.

## Grid Architecture

### Columns (Life Categories)

Create these category columns, in this order:
1. **Finance & Abundance** — money, investments, material resources
2. **Relationships & Love** — partnerships, family, social connections  
3. **Career & Purpose** — work, ambition, professional growth, life direction
4. **Health & Wellbeing** — physical health, energy levels, mental wellness
5. **Spiritual Growth** — inner development, intuition, transformation, consciousness
6. **Monthly Summary** — final column, synthesises all categories for that month into one cohesive overview

### Rows (Time Periods)

- **12 rolling months** starting from the CURRENT month (detect dynamically from `new Date()`) through to 11 months ahead
- **12-Month Overview** — final summary row at the bottom that synthesises the entire year across each category
- So the last cell (bottom-right) is the grand summary: 12-month overview across all categories

### Grid Dimensions

- 13 rows (12 months + 1 overview) × 6 columns (5 categories + 1 monthly summary)
- Total: 78 cards
- Plus 6 column headers and 13 row headers

## Card Design

Each card in the grid should be a glass-morphism styled card following the Astrara design system:

### Card Content (collapsed state — what you see in the grid)
- **Impact score badge** — top-right corner, circular badge showing 1–10 score
- **Colour coding** — card border/accent colour reflects impact: green (1–3, calm period) → yellow/orange (4–6, moderate activity) → red (7–10, high intensity). Use HSL interpolation: `hue = 120 - ((score - 1) / 9) * 120`
- **Key theme** — 1–2 sentence headline of what's dominant this month in this category (e.g. "Venus trine Jupiter opens doors for financial growth")
- **Planet glyphs** — show small planet symbols (☉ ☽ ☿ ♀ ♂ ♃ ♄ ♅ ♆ ♇) for planets active in this reading, styled as subtle pills/badges
- High-impact cards (7+) should have a subtle animated glow or stronger border to draw the eye during scanning

### Card Content (expanded state — click to expand)
- **Full reading** — 3–5 sentences of practitioner-quality interpretation
- **Planetary breakdown** — list each relevant transit with:
  - Planet symbol + name
  - Sign position (e.g. "Mars in Gemini")
  - Relevant aspects with aspect symbols (☌ conjunction, ☍ opposition, △ trine, □ square, ⚹ sextile)
  - Individual impact contribution score
  - 1-sentence interpretation of this specific transit's effect on this category
- **Practical guidance** — actionable advice ("Good time to...", "Avoid...", "Focus on...")
- **Dates to watch** — if there are exact aspect dates within the month, highlight them

### Summary Column Cards (Monthly Summary)
Same structure but synthesises across all 5 categories:
- Overall month impact score (weighted average of category scores)
- Dominant theme for the month
- Key planetary players
- Top opportunities and challenges
- When expanded: brief mention of how categories interrelate this month

### Overview Row Cards (12-Month Overview)  
Same structure but synthesises across all 12 months for each category:
- Year-long trend narrative for this category
- Peak months (highest impact) highlighted
- Overall trajectory (improving, challenging, stable, transformative)
- Key planetary ingresses or retrogrades affecting this category over the year

## Column & Row Impact Headers

### Category column headers
- Show the category name + icon
- Display a **yearly impact score** (average across all 12 months for this category)
- Colour-coded like cards
- This lets the practitioner instantly see "Relationships is the hot category this year"

### Month row headers
- Show month name + year (e.g. "March 2026")
- Display a **monthly overall impact score** (average across all categories)
- Colour-coded like cards
- This lets the practitioner instantly see "July is the most intense month"

## Data Generation via Claude API

### CRITICAL: Batch API calls efficiently

Do NOT make 78 individual API calls. Instead:

1. **Compute all transit data first** using astronomy-engine — for each of the 12 months, calculate:
   - All planet positions (sign + degree) for the 1st and 15th of the month
   - All major aspects (conjunction, opposition, trine, square, sextile) between planets
   - Any sign ingresses during the month
   - Any retrograde stations during the month
   - Moon phases

2. **Make ONE API call per month** (12 calls total + 1 for the overview row = 13 calls)
   - Send the computed transit data for that month in the prompt
   - Ask Claude API to return structured JSON with readings for ALL 5 categories + the monthly summary
   - Include the birth chart data if available (from the birth chart entry feature)

3. **Fire API calls in parallel** — use `Promise.all()` or `Promise.allSettled()` for the 12 month calls, then make the overview call last with all monthly data as context

4. **The overview row call** — send summaries from all 12 months and ask for the year-long synthesis per category + grand summary

### API Call Structure

System prompt for each monthly call:
```
You are a professional astrologer providing detailed transit readings for a client consultation. 
You are given exact planetary positions and aspects computed from NASA JPL-accurate ephemeris data.
Provide practitioner-quality interpretations — specific, insightful, and actionable.
Do NOT give vague horoscope-style generalisations.
Reference the actual planets and aspects in your interpretations.
Respond ONLY in valid JSON with no markdown formatting or backticks.
```

Expected JSON response structure per month:
```json
{
  "month": "March 2026",
  "categories": {
    "finance": {
      "impact_score": 7,
      "key_theme": "...",
      "full_reading": "...",
      "planetary_breakdown": [
        {
          "planet": "Jupiter",
          "symbol": "♃",
          "position": "Cancer 12°",
          "aspects": [
            { "type": "trine", "symbol": "△", "target": "Venus", "target_symbol": "♀", "interpretation": "..." }
          ],
          "impact_contribution": 3,
          "category_effect": "..."
        }
      ],
      "practical_guidance": "...",
      "dates_to_watch": ["March 14 — Jupiter trine Venus exact"]
    },
    "relationships": { ... },
    "career": { ... },
    "health": { ... },
    "spiritual": { ... },
    "monthly_summary": {
      "impact_score": 6,
      "dominant_theme": "...",
      "full_reading": "...",
      "key_players": ["Jupiter", "Saturn"],
      "opportunities": "...",
      "challenges": "...",
      "interrelations": "..."
    }
  }
}
```

### Birth Chart Integration

If the user has entered birth chart data, include natal planet positions in the API prompt so readings account for personal transits (transiting planets aspecting natal positions). If no birth chart is entered, generate general transit readings.

## UI Layout — PC Optimised

### Page Structure
- **Top bar**: Client name/birth data (if entered), current date, "Generate Readings" button, loading progress indicator
- **Sticky column headers** — category names stay visible as you scroll down through months
- **Sticky row headers** — month names stay visible as you scroll right (if needed, though aim to fit all columns on a wide screen)
- **The grid** — horizontally, all 6 columns should fit on a standard 1920px+ desktop screen without horizontal scroll. Each card ~280-300px wide. On smaller screens, allow horizontal scroll with sticky month column.
- **Vertically** — the grid will be tall (13 rows). Allow natural vertical scroll. The overview row at the bottom should have a slightly different background to distinguish it.

### Card Interactions
- **Click** to expand a card — the card expands in-place or opens as a larger overlay/modal showing full detail
- **Hover** — subtle lift/glow effect
- Cards should have a smooth expand/collapse animation (300ms ease)

### Loading UX
- Show the grid skeleton immediately with empty cards
- As each monthly API call completes, populate that row with a fade-in animation
- Show a progress bar or counter: "Generating... 4/13 months complete"
- Allow the user to start reading completed months while others are still loading

### Visual Flourishes
- Planet symbols should use a clean, slightly larger font — consider using an astrological symbol font or Unicode symbols styled with the app's colour system
- Aspect symbols should be colour-coded: △ trine and ⚹ sextile in teal/green (harmonious), □ square and ☍ opposition in orange/red (challenging), ☌ conjunction in purple (neutral/powerful)
- High-impact cards (7+) get a subtle pulsing border glow animation
- The overview row should feel visually distinct — slightly larger cards, perhaps a gradient background strip
- Consider adding a subtle zodiac watermark or constellation pattern in card backgrounds

### Colour System (maintain Astrara standards)
- Silver/white for structural elements (headers, borders, grid lines)
- Impact gradient (green → yellow → orange → red) for scores and card accents
- Purple for interactive elements (buttons, links, expand indicators)
- Glass morphism on all cards (backdrop-blur, semi-transparent backgrounds)
- Dark background (void-black / #05050F or similar)

## Bilingual Support

All UI labels, headers, category names, and static text must support EN/LT toggle (use existing language system in the app). The API-generated readings should be in the currently selected language — pass the language preference to the Claude API call.

## State Management

- Cache generated readings in state so switching language doesn't re-fetch (or better: generate in both languages and toggle display)
- Actually — generating in both languages doubles API cost. Instead: generate in the selected language. If user switches language, show a "Regenerate in Lithuanian?" prompt
- Store readings in localStorage so refreshing the page doesn't lose everything (these are expensive to generate)

## Performance Considerations

- 13 parallel API calls is significant. Add a rate limiter if needed (max 3–4 concurrent)
- Each API response could be sizeable. Parse and store efficiently
- The grid will have many DOM elements. Use CSS Grid, not flexbox nesting. Consider virtualising rows if performance becomes an issue, though 13 rows should be fine
- Lazy-load expanded card content — don't render all 78 expanded states in the DOM

## File Organisation

Keep the code well-structured:
- Main page component: handles layout, API orchestration, state
- Grid component: renders the card grid
- Card component: individual card with collapsed/expanded states
- API service: transit computation + Claude API call logic
- Types: TypeScript interfaces for all data structures
- Content/translations: EN/LT labels for all UI text

## Verification

- Generate readings for the current rolling 12-month window
- Verify all 78 cards populate with meaningful, distinct content
- Verify impact scores are reasonable and colour-coding matches
- Verify planetary data in card details is astronomically accurate
- Verify expand/collapse works smoothly on all cards
- Verify the summary column and overview row correctly synthesise their respective data
- Verify the page is usable on a 1920×1080 screen without horizontal scroll
- Verify loading UX works — skeleton → progressive population → complete
- Test both EN and LT languages
- Verify no console errors, no layout shifts during loading
