# Astrara Full App Audit Report

Date: 2026-03-05

## CRITICAL - Fixed

### 1. API routes: error details leaked to client
- **Files:** `src/app/api/horoscope/route.ts`, `horoscope-daily/route.ts`, `horoscope-weekly/route.ts`
- **Issue:** Raw Anthropic API error text was sent back to client via `details: error`, potentially exposing API internals
- **Fix:** Removed `details` field from error responses; return generic error messages only

### 2. API routes: no validation of Anthropic response structure
- **Files:** All 3 API routes
- **Issue:** `data.content` accessed without checking it exists or is an array; malformed API response would crash
- **Fix:** Added `if (!data.content || !Array.isArray(data.content))` guard before processing

## HIGH - Fixed

### 3. page.tsx: setTimeout memory leak in handleAudioToggle
- **File:** `src/app/page.tsx:214`
- **Issue:** `setTimeout(() => setShowHeadphoneHint(false), 3000)` not tracked; rapid clicks could stack timeouts
- **Fix:** Added `headphoneHintTimerRef` to track and clear previous timeout before setting new one

### 4. page.tsx: non-null assertions on birth chart planet lookup
- **File:** `src/app/page.tsx:673-674`
- **Issue:** `birthChartData.planets.find(...)!` — non-null assertion would crash if sun/moon missing
- **Fix:** Replaced with optional find + early `if (!sun || !moon) return null` guard

### 5. earth-data.ts: NaN from parseFloat propagated silently
- **File:** `src/lib/earth-data.ts:48`
- **Issue:** `parseFloat(latest[1])` could return NaN if NOAA data is malformed; NaN stored as kpIndex
- **Fix:** Added `isNaN(kp) ? 0 : kp` guard (other parseFloat calls already had `|| 0` fallback)

### 6. useEarthData.ts: unhandled promise rejection
- **File:** `src/hooks/useEarthData.ts:11`
- **Issue:** `fetchEarthData().then(...)` with no `.catch()` — if fetchEarthData throws, promise rejects unhandled
- **Fix:** Added `.catch(() => setLoading(false))`

### 7. useCosmicAudio.ts: no cleanup on unmount
- **File:** `src/audio/useCosmicAudio.ts`
- **Issue:** Audio engine never stopped when component unmounts; audio continues playing in background
- **Fix:** Added cleanup useEffect that calls `stop()` and `stopRotationSound()` on unmount

### 8. promo/page.tsx: console.error in production
- **File:** `src/app/promo/page.tsx:183,224`
- **Issue:** `console.error(err)` in catch blocks for weekly/daily generation
- **Fix:** Removed console.error; errors now silently clear the reading state

### 9. promo/page.tsx: hardcoded "Copy"/"Copied" text
- **File:** `src/app/promo/page.tsx:722`
- **Issue:** Hardcoded English strings not using i18n
- **Fix:** Replaced with `t('promo.copy')` / `t('promo.copied')` from translation keys

### 10. Unused imports removed
- **Files:** `src/app/page.tsx`, `src/app/promo/page.tsx`
- `AstroWheel` import (page.tsx) — 2D wheel only used in wrapper, not main page
- `type HelioData` import (page.tsx) — type only used through inference, not directly
- `PLANETS` import (promo/page.tsx) — never used
- `useLanguage` import (promo/page.tsx) — never called

### 11. AstroWheel3DWrapper: console.warn in error boundary
- **File:** `src/components/AstroWheel/AstroWheel3DWrapper.tsx:52`
- **Issue:** `console.warn('3D wheel failed...')` in production error boundary
- **Fix:** Replaced with silent comment; error boundary still falls back to 2D

## MEDIUM - Noted (not fixed, low impact)

### 12. AstroWheel3D.tsx: Three.js textures not explicitly disposed
- Canvas textures created in `useMemo` (OuterHalo, EarthSphereFallback) are not explicitly disposed
- In practice, these components mount once and stay mounted for the app lifetime; R3F handles cleanup
- Impact: negligible for SPA that doesn't remount the 3D wheel

### 13. API routes: missing input validation for optional fields
- `moonPhase`, `kpIndex`, `solarClass`, `impactScore`, `date` etc. not validated
- These are called from the same app (not public API); outer try-catch handles malformed data
- Proper input validation is good practice but not urgent for internal-only routes

### 14. page.tsx: useEffect dependency inefficiencies
- Some useEffects have broader dependencies than strictly needed (e.g., `autoplayDirection` in line 183)
- Logic guards prevent unnecessary state updates; effects run slightly more often than needed
- Impact: negligible performance cost

### 15. Timezone handling in astronomy calculations
- Astronomy calculations use local Date objects without explicit timezone
- astronomy-engine handles UTC internally; date objects are constructed from user's local time
- This is the intended behavior for a personal astrology app

### 16. Audio rapid toggle race condition
- If user clicks audio toggle twice rapidly during 2200ms fade-out, timing is undefined
- DroneLayer has try-catch protection; worst case is audio glitch, not crash
- Fix: add debouncing to toggle — deferred to future improvement

## LOW - Noted (not fixed)

### 17. birth-chart/page.tsx: hardcoded English strings
- "Back to Astrara", "Personal Birth Chart" — not translated
- Birth chart page is a placeholder/coming-soon page without full i18n support
- Will be addressed when birth chart feature is fully built

### 18. Missing PWA icon files
- `manifest.json` references `icon-192.png` and `icon-512.png` but files not in `/public`
- PWA install works but shows no custom icons
- Need to generate and add icon files

### 19. Missing OpenGraph image
- `layout.tsx` metadata has title/description but no `openGraph.image`
- Social media shares lack preview image
- Need to create and add OG image

### 20. earth-data.ts: hardcoded English labels
- `getKpLabel()`, `getWindSpeedLabel()`, `getBzLabel()` return English strings
- These are used in EarthPanel which should ideally use i18n
- Impact: Earth panel labels show English regardless of language setting

## Security Audit Summary

- `.env.local` properly in `.gitignore` (line 34: `.env*`)
- No hardcoded API keys in source (all use `process.env.ANTHROPIC_API_KEY`)
- NOAA endpoints are public (no auth needed)
- `/promo` and `/about` have `robots: 'noindex, nofollow'` in layout metadata
- API error responses no longer leak internal details (FIXED)

## Build Status

- `npm run build`: PASS (zero errors, zero warnings)
- TypeScript: clean
- All routes compile and generate correctly
