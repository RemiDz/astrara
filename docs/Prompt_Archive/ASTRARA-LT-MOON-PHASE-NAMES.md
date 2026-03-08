# Astrara — Fix: Lithuanian Moon Phase Names on Main Page Card

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on.

---

## ISSUE

The Moon phase card on the main page (below the Astro Wheel) always shows Moon phase names in English regardless of language setting. When Lithuanian mode is active, these should display in Lithuanian.

---

## MOON PHASE NAME TRANSLATIONS

| English | Lithuanian |
|---------|-----------|
| New Moon | Jaunatis |
| Waxing Crescent | Augantis Pjautuvas |
| First Quarter | Pirmasis Ketvirtis |
| Waxing Gibbous | Augantis Priešpilnis |
| Full Moon | Pilnatis |
| Waning Gibbous | Dylantis Priešpilnis |
| Last Quarter | Paskutinis Ketvirtis |
| Waning Crescent | Dylantis Pjautuvas |

---

## IMPLEMENTATION

1. Find the Moon phase card component on the main page (below the Astro Wheel — NOT inside the Cosmic Reading overlay).
2. Locate where the Moon phase name string is rendered (e.g. `moonPhase.name` or similar).
3. Add a Lithuanian lookup map (or extend existing i18n/translation pattern used elsewhere in the app).
4. When language is `lt`, display the Lithuanian name. When `en`, keep English as-is.
5. If the app already has a translation utility or hook (e.g. `useLanguage()`, `t()`, or a context), use the same pattern for consistency.

---

## TESTING

- [ ] Switch to Lithuanian → Moon phase card shows Lithuanian name
- [ ] Switch to English → Moon phase card shows English name
- [ ] All 8 phase names display correctly in both languages
- [ ] No regressions on Cosmic Reading overlay moon phase cards
- [ ] Build succeeds with zero TypeScript errors

---

## GIT

```bash
git add -A
git commit -m "fix: translate moon phase names to Lithuanian on main page card"
git push origin master:main
```
