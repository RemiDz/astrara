# ASTRARA — Fix Lithuanian Grammar in Mother Shape Label

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `megathink`

---

## ⚠️ DO NOT BREAK EXISTING FEATURES

This ONLY fixes Lithuanian grammar in the Crystalline Core floating label text.

---

## Problem

The mother shape label displays incorrect Lithuanian grammar. Example:

- **Wrong**: "Uranas Įeina Į Dvyniai" (nominative case — this is the dictionary form)
- **Correct**: "Uranas Įeina Į Dvynius" (accusative case — required after "į" meaning "into")

The preposition "į" (into) requires the **accusative case** (galininkas) for the zodiac sign name that follows it.

---

## Fix

Find where the Lithuanian label text is generated in `CrystallineCore.tsx` (the floating label above the mother shape). Locate the templates for ingress events — the pattern "[Planet] enters [Sign]" / "[Planeta] įeina į [Ženklą]".

Replace the zodiac sign names used in Lithuanian labels with their **accusative case** forms:

### Accusative Case (Galininkas) — used after "į"

| Sign | Nominative (base) | Accusative (after "į") |
|------|-------------------|----------------------|
| Aries | Avinas | Aviną |
| Taurus | Jautis | Jautį |
| Gemini | Dvyniai | Dvynius |
| Cancer | Vėžys | Vėžį |
| Leo | Liūtas | Liūtą |
| Virgo | Mergelė | Mergelę |
| Libra | Svarstyklės | Svarstykles |
| Scorpio | Skorpionas | Skorpioną |
| Sagittarius | Šaulys | Šaulį |
| Capricorn | Ožiaragis | Ožiaragį |
| Aquarius | Vandenis | Vandenį |
| Pisces | Žuvys | Žuvis |

### Where to apply

Find ALL Lithuanian label templates that use "į" + sign name:

1. **Ingress template**: "[Planeta] įeina į [Sign]" → must use accusative
2. Any other template where a sign follows a preposition requiring accusative

### Implementation

Create a lookup map for accusative zodiac names:

```typescript
const ZODIAC_ACCUSATIVE_LT: Record<string, string> = {
  'Aries': 'Aviną',
  'Taurus': 'Jautį',
  'Gemini': 'Dvynius',
  'Cancer': 'Vėžį',
  'Leo': 'Liūtą',
  'Virgo': 'Mergelę',
  'Libra': 'Svarstykles',
  'Scorpio': 'Skorpioną',
  'Sagittarius': 'Šaulį',
  'Capricorn': 'Ožiaragį',
  'Aquarius': 'Vandenį',
  'Pisces': 'Žuvis',
};
```

Use this map whenever building Lithuanian text that places a sign name after "į".

### Also check these other Lithuanian label templates:

The label has multiple template patterns. Check the grammar for ALL of them:

| Pattern | English | Lithuanian (correct) |
|---------|---------|---------------------|
| Ingress | "[Planet] enters [Sign]" | "[Planeta] įeina į [ACCUSATIVE]" |
| Conjunction | "[Planet A] meets [Planet B]" | "[Planeta A] sutinka [ACCUSATIVE of planet B]" |
| Opposition | "[Planet A] faces [Planet B]" | "[Planeta A] stoja prieš [ACCUSATIVE]" |
| Trine | "[Planet A] flows with [Planet B]" | "[Planeta A] teka su [INSTRUMENTAL]" |
| Square | "[Planet A] challenges [Planet B]" | "[Planeta A] meta iššūkį [DATIVE]" |
| Sextile | "[Planet A] supports [Planet B]" | "[Planeta A] palaiko [ACCUSATIVE]" |

For planet names after prepositions/verbs, use the existing `PLANET_DECLENSIONS_LT` from `planetDeclensions.ts` if available — this file already contains planet name declensions in multiple cases. Check what cases are available there and use the appropriate one.

If `planetDeclensions.ts` doesn't have the case you need, add the correct forms.

---

## Build Steps

1. Find the label text generation in CrystallineCore.tsx
2. Create the `ZODIAC_ACCUSATIVE_LT` lookup map
3. Apply accusative case for zodiac signs after "į" in ingress template
4. Check all other Lithuanian templates for correct grammatical cases
5. Use existing `PLANET_DECLENSIONS_LT` for planet name cases where available
6. Test: switch to Lithuanian → label shows "Uranas įeina į Dvynius" (not Dvyniai)
7. Test: navigate to different days → other labels display correct Lithuanian grammar
8. Test: English labels unchanged
9. Run `npm run build`
10. **UPDATE `engine/ARCHITECTURE.md`** — note the Lithuanian accusative case handling
11. Commit: `fix: Lithuanian grammar — accusative case for zodiac signs in mother shape label`
12. Push to **main** branch using `git push origin master:main`
