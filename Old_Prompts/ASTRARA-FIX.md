Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use the --yes flag wherever applicable.

---

# ASTRARA — Critical Fixes + Visual Overhaul

## Three critical problems to fix:

### 1. CRASH FIX: Sun longitude calculation
The app crashes with "Cannot calculate heliocentric longitude of the Sun" because `Astronomy.EclipticLongitude()` does NOT work for the Sun body.

**Fix in birth-chart.ts:**
Replace the Sun calculation with:
```typescript
// For the Sun, use SunPosition instead of EclipticLongitude
if (body === Astronomy.Body.Sun) {
  const sunPos = Astronomy.SunPosition(time);
  longitude = sunPos.elon; // ecliptic longitude in degrees
}
```

`Astronomy.EclipticLongitude(Astronomy.Body.Sun, time)` throws an error. The correct method is `Astronomy.SunPosition(time).elon` which returns the Sun's ecliptic longitude.

Make sure the code handles all planets correctly:
- **Sun**: `Astronomy.SunPosition(time).elon`
- **Moon**: `Astronomy.EclipticGeoMoon(time).lon`
- **All others (Mercury through Pluto)**: `Astronomy.EclipticLongitude(body, time)`

Test this by ensuring `npm run build` passes AND the portrait page no longer crashes.

---

### 2. CITY SEARCH: Replace hardcoded city list with Nominatim API

Delete the entire hardcoded cities.ts file (or keep it as offline fallback only). Replace the city autocomplete with a live search using OpenStreetMap's Nominatim API.

**How Nominatim works:**
```
GET https://nominatim.openstreetmap.org/search?q=Kaunas&format=json&limit=8&addressdetails=1&featuretype=city
```

Returns JSON array with: `display_name`, `lat`, `lon`, `address` (with city, country etc.)

**Implementation:**
- User types in the city input field
- After 300ms debounce (don't fire on every keystroke), call Nominatim
- Show results as a dropdown list below the input
- Each result shows: city name, country
- On select: populate lat/lng from the result, show selected city name
- **Important Nominatim rules:**
  - Add `User-Agent` header: "Astrara/1.0 (https://astrara.vercel.app)"
  - Maximum 1 request per second (the 300ms debounce + typing delay handles this)
  - Use `featuretype=city` or `type=city` param to prefer city results
  - Use `accept-language=en` header for English results (or the current app language)

**Create a new hook: `useCitySearch.ts`**
```typescript
import { useState, useRef, useCallback } from 'react';

interface CityResult {
  name: string;        // display name (city + country)
  lat: number;
  lng: number;
  country: string;
}

export function useCitySearch() {
  const [results, setResults] = useState<CityResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  const search = useCallback((query: string, lang: string = 'en') => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 2) { setResults([]); return; }
    
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(query)}&format=json&limit=8&addressdetails=1` +
          `&featuretype=city&accept-language=${lang}`,
          {
            headers: { 'User-Agent': 'Astrara/1.0' }
          }
        );
        const data = await res.json();
        const cities: CityResult[] = data.map((item: any) => ({
          name: [
            item.address?.city || item.address?.town || item.address?.village || item.name,
            item.address?.country
          ].filter(Boolean).join(', '),
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          country: item.address?.country || '',
        }));
        setResults(cities);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 300);
  }, []);

  const clear = useCallback(() => setResults([]), []);

  return { results, loading, search, clear };
}
```

**Update CityAutocomplete.tsx:**
- Remove all references to the hardcoded cities list
- Use the `useCitySearch` hook
- Show a dropdown below the input when results are available
- Dropdown items: city name, country — styled as clean list items
- On click: select city, populate lat/lng, close dropdown
- Show loading indicator while searching
- If no results: "No cities found" message
- Clicking outside closes the dropdown
- The search should use the current app language (pass lang from i18n context)

**Delete src/lib/cities.ts** — it's no longer needed.

---

### 3. VISUAL OVERHAUL: Landing page must be stunning

The current landing page is boring — just a form on a dark background. It needs to feel like opening a planetarium app for the first time.

**New Landing Page Design:**

**Full viewport hero with depth and atmosphere:**

- Background layers (create depth with CSS):
  - Base: var(--space) #04040A
  - Star field: 200+ tiny dots (but make them BETTER — use 3 sizes: 1px at 0.2 opacity, 1.5px at 0.4 opacity, 2px at 0.6 opacity. Add 20 stars with a gentle twinkle animation using different durations 2-7s. Add 5-8 slightly larger "bright stars" at 3px with a soft glow using box-shadow in white at 0.3 opacity)
  - Nebula glow: 2-3 large radial gradients positioned off-centre
    - One: radial-gradient at 30% 40%, var(--accent) at 0.04 opacity, fading to transparent over 400px
    - Two: radial-gradient at 70% 60%, var(--accent-cool) at 0.03 opacity, fading to transparent over 500px
    - These create a subtle cosmic atmosphere without being cheesy
  - Grain overlay: very subtle noise texture at 0.02 opacity (use a tiny repeating SVG or CSS pattern)

**Layout (centred, max-w-lg):**

- **Animated cosmic ring** at the top (before the title):
  - A simple SVG circle (200px diameter) drawn with a thin dashed stroke
  - var(--accent) at 0.2 opacity
  - Slowly rotating via CSS animation (60s per revolution)
  - Inside the ring: small dots representing planets (use 4-5 dots at different positions around the ring, different planet colours, 4-6px)
  - This immediately tells the user "this is about planets/birth charts" without being a zodiac cliché
  - Framer Motion: ring fades in + scales from 0.8 to 1.0 on page load

- **Title block (below ring):**
  - "ASTRARA" — Instrument Serif, text-xs, tracking-[0.4em], uppercase, var(--text-secondary), letter-spacing gives it luxury feel
  - "What does your birth chart sound like?" — Instrument Serif italic, text-3xl md:text-5xl, var(--text-primary), line-height tight
    - This is a QUESTION — it's a hook, not a statement. Makes people curious.
  - "Every person has a unique cosmic frequency. Discover yours." — DM Sans 300, text-base, var(--text-secondary), max-w-sm, mx-auto
  - Framer Motion: title fades in 300ms after ring, subtitle 200ms after title

- **Form (below title, clean and spacious):**
  - Each input group has generous spacing (space-y-5)
  - Labels: DM Sans 500, text-xs, uppercase, tracking-wider, var(--text-secondary)
  - Inputs: bg var(--space-surface), border var(--border), rounded-lg, py-3.5 px-4, text var(--text-primary), placeholder var(--text-dim)
  - Focus: border var(--border-active), ring-1 ring-[var(--border-active)] with transition
  - Date input: use a styled date input or three selects (day/month/year) for better mobile UX
  - Time input: styled time input with 24hr format
  - City: text input → Nominatim autocomplete dropdown
  - Dropdown: bg var(--space-card), border var(--border), rounded-lg, shadow-2xl, max-h-64 overflow-auto, each item py-3 px-4 hover:bg-[var(--space-hover)]
  - Framer Motion: form slides up and fades in 400ms after subtitle

- **Generate button:**
  - "Reveal My Cosmic Portrait" — full width
  - bg: gradient from var(--accent) to var(--accent-cool) (blue to violet gradient)
  - text-white, font-medium, rounded-xl, py-4
  - Hover: brightness increase + subtle scale 1.01
  - Disabled: opacity 0.4, cursor not-allowed
  - Active/loading: show a small spinning SVG + "Calculating planetary positions..."
  - This button should feel PREMIUM — the gradient makes it stand out as the only colourful element

- **Below form:**
  - "How does it work?" — text link, var(--text-secondary), hover var(--text-primary), with a subtle arrow →
  - Thin separator line (var(--border) at 0.5 opacity)
  - "Part of Harmonic Waves" — small badge with link to harmonicwaves.app

---

## Additional Polish (while you're at it):

### Portrait page improvements:
- When audio is playing, make the planet dots on the cosmic wheel pulse more visibly — scale animation amplitude increases from 0.02 to 0.08
- Add a subtle glow ring around the cosmic wheel when audio is playing (box-shadow with var(--accent) at 0.1, pulsing)
- The play button should have a gentle pulse animation when idle (inviting the user to tap it)

### Share card improvement:
- When user copies the share link, show a toast notification "Link copied!" that fades in/out (not an alert())
- Use a small Framer Motion animated toast at the bottom of the screen

### Responsive check:
- Test that the cosmic wheel Canvas scales correctly between 320px (iPhone SE) and 430px (iPhone 15 Pro Max) widths
- Form inputs should be full-width on mobile with adequate padding
- City dropdown should not overflow the viewport

---

## After all fixes:
```bash
npm run build   # Must pass with 0 errors
git add -A
git commit -m "Fix: Sun calculation, Nominatim city search, visual overhaul"
git push origin master:main
```

Fix everything listed above. The landing page must make someone stop and think "this looks premium." The city search must find ANY city in the world. The Sun calculation must not crash. Go.
