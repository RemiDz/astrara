# ASTRARA — Full App Deep Scan & Bug Audit

Use gigathink for this task.

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Task

Perform a comprehensive deep scan of the entire Astrara codebase. Read EVERY source file. Identify bugs, errors, performance issues, accessibility problems, and code quality issues. Fix everything you find. Do NOT skip any file.

---

## Phase 1: Read Everything

Read ALL files in these directories:
- `src/app/` — all pages and API routes
- `src/components/` — all components
- `src/lib/` — all utilities and helpers
- `src/i18n/` or wherever translations live
- `public/` — manifest, icons
- Root config files: `package.json`, `tsconfig.json`, `next.config.*`, `tailwind.config.*`, `postcss.config.*`

---

## Phase 2: TypeScript & Build Errors

1. Run `npm run build` and capture ALL warnings and errors
2. Fix every TypeScript error
3. Fix every TypeScript warning
4. Fix any `any` types that should be properly typed
5. Fix any missing imports or unused imports
6. Fix any unused variables or functions
7. Ensure no `console.log` statements remain (except intentional debug routes)

---

## Phase 3: Runtime Bug Scan

Check for these common issues across ALL components:

### State Management
- Any state that could be undefined when accessed
- Any useEffect missing dependencies that could cause stale closures
- Any state updates on unmounted components (memory leaks)
- Any race conditions in async operations (especially API calls and NOAA fetches)

### Three.js / Wheel
- Any geometry or material not being disposed on unmount (memory leaks)
- Any useFrame callbacks that run when they shouldn't (performance)
- Any refs that could be null when accessed
- Verify all Three.js materials have `dispose()` called in cleanup

### API Routes
- `/api/horoscope` — verify error handling covers all edge cases
- `/api/horoscope-daily` — same
- `/api/horoscope-weekly` — same
- Verify all API routes return proper error responses, not crashes

### Data Fetching
- NOAA Kp fetch — what happens if the endpoint is down? Verify graceful fallback
- NOAA X-ray fetch — same
- astronomy-engine calculations — verify no NaN or Infinity values for edge case dates
- Verify date calculations handle timezone boundaries correctly

### Navigation & Routing
- Verify /promo page works with all features
- Verify /about page loads correctly
- Verify /sell page still works if it exists
- Verify main app page has no broken links

---

## Phase 4: CSS & Layout Audit

1. Check all pages at 375px width (iPhone SE) — no horizontal overflow
2. Check all pages at 768px width (iPad portrait) — single column layout
3. Check all pages at 1024px width (iPad landscape) — single column layout
4. Verify no elements extend beyond viewport at any width below 1280px
5. Check for any missing `overflow-hidden` on containers that could scroll horizontally
6. Verify all `position: fixed` or `position: absolute` elements don't break on scroll
7. Check iOS Safari specific issues:
   - All inputs have `font-size: 16px` minimum (prevents zoom)
   - All inputs have `-webkit-appearance: none`
   - All date inputs have `min-width: 0`
   - No `-webkit-tap-highlight-color` issues
8. Verify dark colour scheme is consistent — no bright white flashes on any page
9. Check that text selection is disabled on main app but enabled on /promo and /about

---

## Phase 5: Performance Audit

1. Check bundle size — are there any unnecessarily large imports?
2. Check for any images or assets that should be optimised
3. Verify all `useMemo` and `useCallback` are used where appropriate
4. Check for any components re-rendering unnecessarily
5. Verify Three.js scene doesn't have excessive geometry or draw calls
6. Check that NOAA fetch intervals are reasonable (not too frequent)
7. Verify no infinite loops or recursive state updates

---

## Phase 6: Security Audit

1. Verify `.env.local` is in `.gitignore`
2. Verify no API keys, secrets, or tokens are hardcoded in source
3. Verify API routes validate input properly
4. Verify no sensitive data is exposed to the client
5. Check that /promo and /about have `noindex, nofollow` meta tags

---

## Phase 7: PWA & Meta

1. Verify `manifest.json` or `site.webmanifest` is correct
2. Verify meta tags (title, description, OG tags) are set correctly
3. Verify favicon and app icons are present
4. Verify Plausible analytics script is present if configured

---

## Phase 8: i18n Audit

1. Compare English and Lithuanian translation files — find any missing keys
2. Find any hardcoded English strings that should be in translation files
3. Verify language toggle works on all pages

---

## Reporting

After scanning everything, create a file `docs/AUDIT-REPORT.md` with:

1. **CRITICAL** — bugs that break functionality (fix immediately)
2. **HIGH** — bugs that affect user experience (fix now)
3. **MEDIUM** — code quality issues (fix for cleanliness)
4. **LOW** — nice-to-have improvements

Fix ALL critical and high issues. Fix medium issues if straightforward. Log low issues in the report for future reference.

---

## Build & Deploy

1. Fix all critical and high issues found
2. Run `npm run build` — must pass with ZERO errors and ZERO warnings
3. Test: main app loads correctly
4. Test: /promo page loads and generates readings
5. Test: /about page loads
6. Test: heliocentric view toggle works
7. Test: settings panel works
8. Test: sound toggle works
9. Commit: `chore: full app audit — bug fixes and code quality improvements`
10. Push to `main`
