# Astrara — Fix: Lithuanian Planet-in-Sign Grammar

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on.

---

## ISSUE

When displaying planet positions in Lithuanian mode, the app uses English grammar structure:
- `Venera in Avinas` (wrong — mixes English "in" with Lithuanian nominative case)
- `Marsas in Vandenis` (wrong)
- `Uranas in Dvyniai` (wrong)

Correct Lithuanian uses the locative case (vietininkas) with NO "in" preposition:
- `Venera Avine` (short form) or `Venera yra Avino ženkle` (full form)
- `Marsas Vandenyje`
- `Uranas Dvyniuose`

---

## SCOPE

Fix ALL occurrences across the entire app where a planet-in-sign combination is displayed in Lithuanian. This includes:
- Main page planet cards ("Today's Cosmic Weather")
- Cosmic Reading phase cards (Moon-in-sign, Sun-in-sign, all planet references)
- Any tooltips, detail panels, or popups showing planet positions
- Zodiac sign detail panels when tapped on the wheel

---

## IMPLEMENTATION

### Step 1: Create Zodiac Sign Declension Lookup

Create or extend the existing zodiac translation file to include the locative case form for each sign.

**Full declension table:**

| English | LT Nominative (base) | LT Locative (for "planet in sign") |
|---------|----------------------|-------------------------------------|
| Aries | Avinas | Avine |
| Taurus | Jautis | Jautyje |
| Gemini | Dvyniai | Dvyniuose |
| Cancer | Vėžys | Vėžyje |
| Leo | Liūtas | Liūte |
| Virgo | Mergelė | Mergelėje |
| Libra | Svarstyklės | Svarstyklėse |
| Scorpio | Skorpionas | Skorpione |
| Sagittarius | Šaulys | Šaulyje |
| Capricorn | Ožiaragis | Ožiaragyje |
| Aquarius | Vandenis | Vandenyje |
| Pisces | Žuvys | Žuvyse |

### Step 2: Fix the Display Pattern

Find the function or template that constructs the planet-in-sign string. It likely looks something like:

```typescript
// CURRENT (wrong)
`${planetName} in ${signName}`
```

Replace with language-aware logic:

```typescript
// English: "Venus in Aries"
// Lithuanian: "Venera Avine"

if (language === 'lt') {
  return `${planetNameLT} ${signLocativeLT}`;
} else {
  return `${planetNameEN} in ${signNameEN}`;
}
```

**Important:** Use the LOCATIVE form of the sign name for Lithuanian, NOT the nominative. Do NOT use "in" or "yra" — the short form (`Venera Avine`) is cleaner for card UI. The locative case already implies "in".

### Step 3: Search for ALL Occurrences

```bash
grep -rn '" in "' src/
grep -rn "' in '" src/
grep -rn '` in `' src/
grep -rn ' in ${' src/
grep -rn "in " src/features/cosmic-reading/
grep -rn "in " src/components/
```

Every instance where "in" joins a planet and sign name must be replaced with the language-aware pattern.

### Step 4: Lithuanian Planet Names Reference

Verify these are also correct wherever they appear:

| English | Lithuanian |
|---------|-----------|
| Sun | Saulė |
| Moon | Mėnulis |
| Mercury | Merkurijus |
| Venus | Venera |
| Mars | Marsas |
| Jupiter | Jupiteris |
| Saturn | Saturnas |
| Uranus | Uranas |
| Neptune | Neptūnas |
| Pluto | Plutonas |

---

## TESTING

- [ ] Switch to Lithuanian mode
- [ ] Check every planet card on main page — should read e.g. `Venera Avine` NOT `Venera in Avinas`
- [ ] Check Cosmic Reading Moon phase card — e.g. `Mėnulis Svarstyklėse`
- [ ] Check Cosmic Reading Sun card — e.g. `Saulė Žuvyse`
- [ ] Check all aspect cards mentioning planets in signs
- [ ] Switch to English — should still read `Venus in Aries` as before
- [ ] All 12 zodiac signs display correctly in locative case
- [ ] All diacriticals present (ė, ū, ž, š, etc.)
- [ ] Build succeeds with zero TypeScript errors

---

## GIT

```bash
git add -A
git commit -m "fix: Lithuanian planet-in-sign grammar — use locative case, remove English 'in'"
git push origin master:main
```
