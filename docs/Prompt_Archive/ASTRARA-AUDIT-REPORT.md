# Astrara — Full Audit Report
Generated: 2026-03-08

## Executive Summary

Astrara is a visually impressive, technically sophisticated astrology web app built with Next.js 16, React 19, and React Three Fiber. It differentiates itself from competitors through real astronomical data (via `astronomy-engine`), a stunning interactive 3D zodiac wheel, dual geocentric/heliocentric views, live space weather integration, and bilingual support (EN/LT). The codebase is well-structured but concentrated — two files account for ~3,000 of the 18,900 total lines. Zero test coverage, missing PWA assets, and no monetisation infrastructure are the primary gaps holding it back from production readiness and revenue.

---

## 1. Strong Points

### 1.1 Real Astronomical Data — Not Generic Horoscopes
Unlike Co-Star or Sanctuary which rely on pre-written or AI-generated interpretations, Astrara calculates actual planetary positions using the `astronomy-engine` library (`src/lib/astronomy.ts`). Every planet position, retrograde status, ecliptic longitude, rise/set time, and aspect is computed from real ephemeris data. This is a genuine differentiator — the app shows what the sky *actually* looks like, not what a copywriter wrote.

### 1.2 Exceptional 3D Visualisation
The interactive 3D zodiac wheel (`AstroWheel3D.tsx`, 1946 lines) is genuinely impressive:
- **8-phase cinematic entrance** — Earth ignites, rings expand, zodiac appears, planets stagger in, corona fades up, tilt animates, auto-rotate begins
- **Dual view system** — smooth animated transition between geocentric (astrology wheel) and heliocentric (solar system) views with sequential phase transitions (zodiac fade → planet move → helio elements appear)
- **Live space weather** — Sun corona responds to real solar flux data; Earth's Kp aura pulses with geomagnetic activity
- **Saturn's rings, sacred geometry polygon**, procedural Earth texture with continents, atmospheric glow
- **Performance-aware** — Bloom disabled on mobile (`ConditionalBloom`), `memo` on static components, `useRef` for imperative per-frame updates instead of React state

### 1.3 Sound Design System
A layered audio engine (`src/audio/`) with:
- **Binaural beats** — planet-specific frequencies
- **Drone layer** — ambient tones
- **Rotation sound** — vortex hum responds to wheel spin velocity
- **Planet tone layer** — musical tones on planet tap
All driven by Web Audio API with no external dependencies.

### 1.4 Clean Architecture Patterns
- **Data flow:** `useAstroData` hook → `page.tsx` → Wrapper → 3D component. Clear unidirectional.
- **Error boundary** — `Wheel3DErrorBoundary` in `AstroWheel3DWrapper.tsx` catches WebGL crashes and falls back to 2D SVG wheel
- **Lazy loading** — 3D component loaded via `React.lazy()`, Suspense fallback shown during load
- **Cosmic Reading** — well-architected feature module in `src/features/cosmic-reading/` with state machine (`useReadingStateMachine`), context provider, animation controllers, content generators, and templates. Includes a 49.8KB `ARCHITECTURE.md` design document — shows genuine engineering discipline.
- **i18n** — complete EN/LT translations (213 lines each, perfectly in sync), plus extensive content files (planet meanings, sign meanings, aspect meanings, phase meanings, about content) fully translated in both languages — thousands of words of educational content

### 1.5 Thoughtful UX Details
- **Tap vs drag detection** (`useTapVsDrag.ts`) — allows wheel spinning through interactive elements without accidental taps
- **Planet overlap prevention** — planets within 8° get Y-offset and radius-offset to prevent visual collision
- **Touch optimisation** — `-webkit-tap-highlight-color: transparent`, `user-select: none`, hidden scrollbars, native app feel
- **Date navigation** — yesterday/today/tomorrow in geocentric, time-travel autoplay with fast-forward/rewind in heliocentric
- **Settings persistence** — planet scale, rotation speed, rotation sound, immersive mode all saved to localStorage

### 1.6 Competitive Features
- **Cosmic Reading** — a guided, phase-by-phase personalised reading with animated camera movements, planet highlights, aspect beams, and templated content generation
- **Earth Pulse** — live geomagnetic data (Kp index, solar wind, Schumann resonance) with practitioner-focused insights
- **Content Studio** (`/promo` page) — AI-powered reading generator using Claude API for social media content and daily/weekly horoscopes
- **Birth Chart** — computes natal chart from birth date/time/location with aspect calculations
- **Heliocentric solar system view** — continuous time animation showing planetary orbital motion

### 1.7 Modern Stack
Next.js 16.1.6, React 19, Tailwind v4, TypeScript throughout. Very current — no legacy dependencies or version debt.

---

## 2. Weak Points

### 2.1 Zero Test Coverage
No test files exist anywhere in `src/`. No unit tests, no integration tests, no E2E tests. The astronomical calculations, aspect detection, reading generation, state machine, and all 96 TypeScript files are entirely untested. This is the single biggest technical risk — any refactor could silently break astronomical accuracy or UX flows.

### 2.2 Monolithic Files
- `AstroWheel3D.tsx` — **1,946 lines**, containing ~30 components/functions in a single file (RingEdge, OuterZodiacRing, MiddleRing, InnerTrackRing, BackgroundParticles, OrbitingLight, InnerDust, OuterHalo, EarthSphere, EarthKpAura, SunCorona, PlanetOrb, PlanetPolygon, TransitionController, CameraDistanceAnimator, HelioTiltAnimator, EarthPositionAnimator, SunCoronaAnimated, OrbitalRings, MoonOrbitRing, WheelScene, etc.)
- `page.tsx` — **946 lines**, mixing state management, event handlers, birth chart logic, date navigation, autoplay controls, UI rendering, and 6 bridging components

### 2.3 PWA is Incomplete
- `manifest.json` references `icon-192.png` and `icon-512.png` — **neither file exists** in `public/`
- **No service worker** — the app has no offline capability whatsoever
- No splash screens, no maskable icons, no `apple-touch-icon`
- Result: fails PWA installability checks in Lighthouse

### 2.4 Missing SEO Infrastructure
- **No `robots.txt`** — search engines have no crawl directives
- **No `sitemap.xml`** — Google/Bing can't efficiently discover pages
- **No Twitter Card meta tags** — only basic Open Graph tags in `layout.tsx`
- **No structured data** (JSON-LD) — missing for app, FAQ, or organisation schema
- Only 3 indexable pages: `/`, `/about`, `/promo`
- `lang="en"` is hardcoded in `<html>` even when Lithuanian is selected

### 2.5 Minimal Accessibility
Only **18 aria attributes** across the entire codebase. Specific gaps:
- No `role="application"` or ARIA live regions for the 3D canvas
- Color-only information encoding (planet colours, element colours) — no alternative for colour-blind users
- No keyboard navigation for the 3D wheel
- No skip-to-content link
- `userScalable: false` in viewport — prevents pinch-to-zoom for vision-impaired users
- No focus management for modals (birth chart, settings, about)

### 2.6 No Monetisation Infrastructure
- No payment integration (Stripe, PayPal, etc.)
- No subscription system
- No in-app purchase mechanism
- No ad framework
- No premium/free tier gating
- The Content Studio `/promo` page generates readings but has no way to charge for them

### 2.7 Limited Content Depth
- Cosmic Reading is template-based (`generateReading.ts`, 562 lines) — not AI-generated. The templates are good but finite — users will see repeats after a few sessions
- No daily push notifications or email digests
- No relationship compatibility features (a major draw for competitors like The Pattern)
- No house system (Placidus, whole sign, etc.) — only planet-in-sign, no planet-in-house interpretation
- Birth chart is view-only — no interpretation or explanation of natal placements

### 2.8 Memory Management Concerns
- `PlanetPolygon` creates `new THREE.BufferGeometry()` and `new THREE.Line()` inside render via `useMemo` — these are properly disposed on cleanup, but the radial lines create geometry objects via `new THREE.Line(geom, mat)` inside `.map()` which are passed to `<primitive>` without explicit disposal
- `OuterHalo` creates a canvas texture in `useMemo` but never disposes it
- `createEarthTexture()` creates a canvas texture that persists for the life of the component

### 2.9 State Management Scaling Risk
All app state lives in `useState` hooks in `page.tsx` — 20+ state variables. No Redux, Zustand, or Jotai. Works now but will become painful as features grow. The Cosmic Reading feature wisely uses its own Context, but the main page is close to the complexity ceiling of raw `useState`.

### 2.10 Hard-Coded Fallback Location
When geolocation fails, the app falls back to `lat: 51.5074, lng: -0.1278` (London) without telling the user. Birth chart defaults to London coordinates too (`page.tsx:289`). This silently produces incorrect rise/set times and aspect timings for most of the world's population.

### 2.11 Fragile Birth Date Parsing
Birth date input is parsed via `birthDate.split('-').map(Number)` (`page.tsx:284`) with no validation. Malformed input fails silently. Birth time parsing (`split(':').map(Number)`) is similarly unguarded.

### 2.12 No Rate Limiting on API Routes
The three API routes (`/api/horoscope`, `/api/horoscope-daily`, `/api/horoscope-weekly`) call the Anthropic API with no rate limiting, no caching, and no abuse prevention. A malicious actor could spam requests and run up API costs.

### 2.13 Anthropic API Usage
- Uses raw `fetch()` instead of the official `@anthropic-ai/sdk`
- Hard-coded model `claude-sonnet-4-20250514` without version pinning strategy
- `anthropic-version: '2023-06-01'` header is outdated
- No streaming — user waits for full response before seeing anything

---

## 3. Technical Quality Score

### Build Quality: 6.5/10

| Category | Score | Notes |
|---|---|---|
| Code architecture | 7/10 | Clean patterns but monolithic files. Feature-based structure for cosmic reading is excellent. Main page needs decomposition. |
| Component quality & reusability | 6/10 | Many components are tightly coupled to the wheel. `GlassCard`, `Modal`, `Shimmer` are reusable. Most 3D components are specific to AstroWheel3D. |
| Performance optimisation | 7/10 | Good use of `memo`, `useRef`, `useCallback`, `useMemo`. Bloom disabled on mobile. Lazy loading for 3D. Some Three.js memory management gaps. |
| Error handling & resilience | 6/10 | Error boundary for 3D fallback is smart. API routes have try/catch. Many `catch { /* ignore */ }` blocks hide errors silently. No global error boundary. |
| Testing coverage | 1/10 | Zero tests. |
| Accessibility | 2/10 | 18 aria-labels total. No keyboard nav for 3D. No ARIA live regions. Zoom disabled. |
| Security | 7/10 | API keys properly server-side. No XSS vectors visible. `.env.example` provided. No rate limiting on API routes. |
| PWA implementation | 2/10 | Manifest exists but icons are missing. No service worker. No offline support. |
| i18n quality | 8/10 | Two complete languages, perfectly synced (213/213 keys). Content files for planet/sign/aspect meanings in both languages. `lang` attribute on `<html>` is hardcoded to "en". |
| Three.js / 3D implementation | 8/10 | Impressive. Cinematic entrance, dual view transitions, solar activity integration, procedural textures, overlap prevention, mobile bloom gating. Some memory management gaps with geometry disposal. |

### Market Competitiveness: 6/10

| Category | Score | Notes |
|---|---|---|
| Visual design & UX | 8/10 | Stunning. Glass morphism cards, animated borders, cosmic background, 3D wheel entrance is cinema-quality. Dark theme is premium. |
| Feature depth vs competitors | 5/10 | Real astronomy data is unique, but missing houses, relationships, transit timelines, daily notifications, and detailed natal interpretation. |
| Unique differentiators | 8/10 | Real astronomical data, 3D interactive wheel, heliocentric view, live space weather, sound healing integration. No competitor does all of these. |
| Target audience fit | 6/10 | Sits between casual astrology consumers and professional astrologers. Too technical for the "Co-Star generation", not detailed enough for professionals. The Lithuanian language support suggests a niche geographic focus. |
| Monetisation readiness | 1/10 | Zero payment infrastructure. No premium tier. No subscription system. Cannot generate revenue in its current state. |
| Content quality | 6/10 | Template-based readings are decent but will feel repetitive. Planet/sign meanings are thorough. No daily fresh content without manual AI generation via /promo. |
| Viral / shareability potential | 4/10 | No share buttons. No shareable cards/images. No social login. No "invite a friend" mechanic. The /promo page generates content but doesn't create shareable assets. |

---

## 4. Financial Potential Estimate

### Revenue Model Analysis

**Most viable models for Astrara:**

1. **Freemium subscription** — Free: daily wheel + basic weather. Premium ($4.99–9.99/mo): AI-powered daily readings, detailed natal chart interpretations, cosmic reading sessions, transit alerts, relationship compatibility
2. **One-time IAP** — Detailed birth chart report ($2.99–4.99), compatibility analysis ($3.99), yearly forecast ($6.99)
3. **Content licensing** — The /promo page could generate daily content for astrology blogs/influencers as a SaaS ($19–49/mo for API access)
4. **Affiliate** — Sound healing products, crystals, meditation apps (natural fit with the Harmonic Waves brand)

**Least viable:** Advertising (conflicts with premium aesthetic), physical products (no infrastructure).

### Market Size

- Global astrology app market: ~$2.2B (2025), growing ~25% CAGR
- Co-Star: ~$35M ARR, 25M+ downloads
- The Pattern: ~$10M ARR, 15M+ users
- TAM for a niche astrology app with real astronomy data: ~$50M (serious astrology enthusiasts, astronomy-curious, Lithuanian market)
- Realistic serviceable market for Astrara: $500K–$2M (niche positioning limits mass appeal but deepens loyalty)

### Revenue Projections

**Conservative (Year 1): $50–200/month**
- Scenario: Ship basic premium tier, 500 free users, 2% conversion, $4.99/mo
- Reality: Most indie apps struggle to reach even this. Marketing effort minimal.

**Moderate (Year 1): $500–1,500/month**
- Scenario: Polished premium tier with AI readings, 2,000 free users, 5% conversion, $6.99/mo
- Requires: Active marketing, social media presence, App Store listing (via PWA or Capacitor), content marketing

**Optimistic (Year 1): $3,000–5,000/month**
- Scenario: Strong product-market fit, viral moment, 10,000+ users, 5% conversion, $8.99/mo
- Requires: Push notifications, relationship features, sharing mechanics, influencer partnerships, App Store presence

### What Would Need to Change

#### To hit $1K/month:
1. **Add payment infrastructure** (Stripe Checkout + webhook) — 2 days
2. **Create premium tier** with gated features — 3 days
3. **AI-powered daily reading** (move /promo Claude integration to user-facing feature) — 2 days
4. **Submit to App Store** via Capacitor/TWA wrapper — 2 days
5. **Basic marketing** — landing page, social accounts, 10 astrology subreddits — ongoing
6. **Push notifications** for daily readings — 2 days

#### To hit $5K/month:
Everything above, plus:
7. **Relationship compatibility** — compare two birth charts — 5 days
8. **Transit alerts** — "Saturn enters your 7th house next week" — 4 days
9. **Shareable birth chart cards** — canvas-rendered images for Instagram/X — 3 days
10. **Referral program** — "Get 1 month free when a friend subscribes" — 2 days
11. **Content marketing** — weekly blog/newsletter using the /promo content engine — ongoing

#### To hit $10K/month:
Everything above, plus:
12. **House system** (Placidus + whole sign) — 5 days
13. **Detailed natal chart interpretation** — AI-generated multi-page report — 4 days
14. **Annual subscription** with discount ($59.99/year vs $8.99/mo) — 1 day
15. **B2B API** — sell astrology content generation to other apps — 5 days
16. **Multi-language expansion** — Spanish, Portuguese, German — 3 days each

---

## 5. Recommended Priority Actions

| # | Action | Effort | Impact | Notes |
|---|---|---|---|---|
| 1 | **Add payment infrastructure** (Stripe) | 2 days | Critical | Nothing else matters until you can charge money. |
| 2 | **Create premium tier** | 3 days | Critical | Gate AI readings, detailed natal chart, cosmic reading behind paywall. Free tier: wheel + basic weather. |
| 3 | **Fix PWA** — add icons, service worker, splash screens | 1 day | High | Currently fails install checks. Free distribution channel. |
| 4 | **Add basic test suite** | 3 days | High | At minimum: astronomy calculations, aspect detection, reading state machine. These are correctness-critical. |
| 5 | **Break up monolithic files** | 2 days | Medium | Split AstroWheel3D.tsx into ~10 files. Split page.tsx into route + hooks + sub-components. |
| 6 | **Add SEO fundamentals** | 0.5 days | Medium | robots.txt, sitemap.xml, Twitter cards, structured data, dynamic `lang` attribute. |
| 7 | **Ship AI-powered daily readings** to users | 2 days | High | Move Claude integration from /promo to a user-facing feature. This is the #1 engagement driver for astrology apps. |
| 8 | **Add shareable content** | 2 days | High | Canvas-rendered birth chart cards, daily reading images. Viral growth engine. |
| 9 | **Add push notifications** | 2 days | Medium | "Your cosmic weather for today" — daily engagement hook. |
| 10 | **Add relationship compatibility** | 5 days | High | Top requested feature in astrology apps. Compare two birth charts, show synastry aspects. |

---

## 6. Raw Technical Metrics

| Metric | Value |
|---|---|
| **Total TypeScript/TSX files** | 96 |
| **Total lines of code** | 18,901 |
| **Largest file** | AstroWheel3D.tsx — 1,946 lines |
| **Second largest** | about/content.ts — 1,209 lines |
| **Third largest** | promo/page.tsx — 996 lines |
| **Dependencies (prod)** | 11 |
| **Dependencies (dev)** | 8 |
| **node_modules size** | 637 MB |
| **Build output (.next)** | 272 MB |
| **Accessibility attributes (aria-*, role=, alt=)** | 18 total |
| **i18n keys** | 213 per language (EN & LT) |
| **Test files** | 0 |
| **API routes** | 3 (/api/horoscope, /api/horoscope-daily, /api/horoscope-weekly) |
| **Indexable pages** | 4 (/, /about, /promo, /birth-chart) |
| **External APIs consumed** | astronomy-engine (local), Anthropic Claude (server-side), NOAA space weather (client-side fetch in useEarthData) |
| **Font families** | 3 (Cormorant Garamond, DM Sans, DM Mono) |
| **PWA icons present** | 0 of 2 required |
| **Service worker** | None |
| **robots.txt** | Missing |
| **sitemap.xml** | Missing |
| **Lighthouse Performance estimate** | ~65–75 (heavy Three.js bundle, no code splitting beyond lazy 3D) |
| **Lighthouse Accessibility estimate** | ~40–55 (minimal ARIA, zoom disabled) |
| **Lighthouse SEO estimate** | ~70–80 (metadata present, missing robots/sitemap) |
| **Lighthouse PWA estimate** | Fail (missing icons, no service worker) |

---

*Report generated by Claude Opus 4.6 from full codebase analysis. All scores calibrated against professional indie app standards — not inflated.*
