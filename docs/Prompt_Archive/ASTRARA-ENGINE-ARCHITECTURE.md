# ASTRARA — Generate Living Architecture Document: engine/ARCHITECTURE.md

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `megathink`

---

## Task

Create a comprehensive, accurate architecture document at `engine/ARCHITECTURE.md` by scanning the ENTIRE current codebase. This file will serve as a **living reference document** — a single source of truth for understanding how the app works, what depends on what, and what the current state of every feature is.

This document will be shared with an external AI architect (who cannot see the codebase) to plan future improvements and write implementation specs. Therefore it must be **complete, accurate, and self-contained** — someone reading only this file should understand the entire app without seeing any source code.

---

## ⚠️ CRITICAL: Accuracy Over Speed

Do NOT guess or assume anything. Read every file. If a feature exists in the code, document it. If it doesn't exist, don't mention it. This document must reflect the ACTUAL current state of the codebase, not what was planned or discussed.

---

## Document Structure

Generate the following sections in this exact order:

### 1. PROJECT OVERVIEW
- App name, domain, description (one paragraph)
- Tech stack with exact versions (read from package.json)
- Deployment: hosting, DNS, analytics
- Repository info: branch structure, deploy branch

### 2. FOLDER STRUCTURE
- Full directory tree (2-3 levels deep)
- Brief description of what each folder/key file contains
- Where styles live, where components live, where data/content lives

### 3. DEPENDENCIES
- List ALL npm dependencies from package.json with a one-line description of what each is used for in THIS app (not generic descriptions)
- Separate into: core framework, 3D/rendering, audio, data/API, UI/styling, dev tools
- Flag any unused dependencies if found

### 4. PAGE ROUTES
- Every route the app serves (/, /promo, /sell, /about, etc.)
- What each route does and what components it renders
- Which routes are public vs hidden

### 5. CORE ARCHITECTURE
- How the app initialises (entry point → layout → page → components)
- State management approach (React state, context, localStorage, etc.)
- Data flow: where astronomical data comes from, how it's calculated, how it reaches components
- i18n system: how language switching works, where translation files live, supported languages
- How the app determines user location

### 6. THE ASTRO WHEEL (3D Scene)
- Complete component hierarchy of the R3F Canvas scene
- How planetary positions are calculated (astronomy-engine usage)
- How zodiac signs are positioned
- How the wheel renders: rings, labels, planet orbs, zodiac badges
- Camera system: controls, tilt animation, distance, constraints
- Auto-rotation: how it works, speed, pause/resume logic
- Interaction system: how planet taps work, how zodiac taps work, tap targets
- Aspect rendering: how connections between planets are drawn (current implementation)
- Sacred geometry polygon: how it works
- Earth model in the centre
- Starfield/background particle system
- Glass ring shimmer effect and lighting

### 7. COSMIC READING SYSTEM
- State machine: all states and transitions (IDLE → ONBOARDING → PREPARING → etc.)
- ReadingContext: what data it holds, how it's provided
- Content engine: how reading text is generated/templated
- Phase types: what phases exist (Moon, Sun, Aspects, Sound Healing, Summary, etc.)
- Phase cards: how they render, navigation (Next/Back), progress indication
- Animations during reading: planet highlights, camera movements, aspect connections
- How zodiac sign selection works and is stored
- Birth chart integration: what data is used, where it comes from

### 8. AUDIO SYSTEM
- Audio toggle: how it works, what it controls
- Drone layer: frequency source, oscillator setup, LFO breathing
- Binaural beats: carrier frequency, beat frequency by element
- Interactive tones: planet tap tones, zodiac tap tones
- Rotation vortex sound: how it responds to wheel spin
- Background music player: current state (if implemented)
- Web Audio API context lifecycle: how autoplay policy is handled
- Settings: what audio settings exist (volume, toggles, etc.)

### 9. UI COMPONENTS & MODALS
- Header: structure, icons, what each does
- Settings panel: all settings available, how they're stored
- Info/About modal: what content it shows
- Birth chart modal (Personal Cosmic Portrait): inputs, validation, how data is processed
- Day navigation: Yesterday/Today/Tomorrow buttons, date logic, how custom dates work
- CosmicWeather component: what it shows, data source
- Language switcher: implementation
- View toggle (if heliocentric/geocentric views exist)

### 10. STYLING SYSTEM
- Tailwind version and configuration approach
- Glass morphism: exact CSS properties used for glass cards
- Colour palette: primary colours, element colours, aspect colours
- Fonts: what fonts are loaded and where they're used
- Scrollbar hiding: how it's implemented
- iOS Safari specific fixes applied
- Responsive approach: breakpoints, mobile-first patterns

### 11. DATA & APIs
- astronomy-engine: which functions are used, what's calculated client-side
- AstronomyAPI.com: if used, which endpoints, API key location
- NOAA: if used, which endpoints, what data
- Any other external data sources
- localStorage: what keys are stored and what they contain

### 12. PWA CONFIGURATION
- manifest.json: current state and contents
- Service worker: exists or not, what it caches
- Icons: sizes available
- Theme colour, background colour

### 13. /promo CONTENT STUDIO
- What the promo page does
- Claude API integration: how it works, which model, what prompts
- Content types generated (daily reading, zodiac readings, weekly)
- Social media caption generation
- How content is displayed and copied

### 14. /about REFERENCE PAGE
- What content it contains
- Structure and sections

### 15. KNOWN ISSUES & TECHNICAL DEBT
- List any TODO comments found in the code
- List any console.warn or console.error messages that indicate incomplete features
- List any commented-out code blocks that suggest planned but unimplemented features
- Any performance concerns observed (large bundle, heavy computations, etc.)

### 16. RECENT CHANGES LOG
- Add a section at the bottom titled "Last Updated" with today's date
- Leave space for a brief changelog that should be updated each time this file is modified

---

## Formatting Rules

- Use clean Markdown with clear heading hierarchy
- Use code blocks for file paths, component names, CSS values, and configuration
- Use tables where they make comparison clearer (e.g. dependency lists, route lists)
- Keep descriptions concise — one or two sentences per item, not paragraphs
- Use ✅ for implemented features, ⚠️ for partially implemented, ❌ for not implemented

---

## Build Steps

1. Read `package.json` — extract all dependencies and scripts
2. Map the full directory structure
3. Read every component file in the project systematically
4. Read all data/content/translation files
5. Read all style files and Tailwind configuration
6. Read all API integration code
7. Read the R3F scene graph and all 3D components
8. Read the Cosmic Reading state machine and all reading components
9. Read the audio system implementation
10. Read all modal and UI components
11. Read PWA manifest and service worker (if exists)
12. Read /promo and /about page implementations
13. Compile all findings into `engine/ARCHITECTURE.md` following the structure above
14. Review the document for accuracy — cross-reference claims against actual code
15. Commit: `docs: create living architecture document in engine/ARCHITECTURE.md`
16. Push to **main** branch using `git push origin master:main`

---

## IMPORTANT: Future Update Rule

From this point forward, every time you (Claude Code) complete work on Astrara — whether it's a bug fix, new feature, or refactor — you MUST update `engine/ARCHITECTURE.md` to reflect the changes. Add a brief entry to the "Recent Changes Log" section at the bottom with the date and what changed. This keeps the document always current.
