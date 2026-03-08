# Astrara — Fix: Replace Technical Aspect Names with Human-Readable Descriptions

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on.

---

## ISSUE

Planet aspect strings like `Saturnas sekstilis Plutonas` or `Venus Sextile Pluto` use technical astrology jargon that regular users don't understand. Words like "sekstilis", "trinas", "kvadratūra", "sextile", "trine", "square" mean nothing to someone without astrology knowledge.

The display needs to communicate the EFFECT, not the technical term.

---

## SOLUTION

Replace the technical aspect name in planet-aspect-planet strings with a plain-language descriptor that tells the user what this connection actually means.

### Current format (wrong for regular users):
```
EN: "Saturn Sextile Pluto"
LT: "Saturnas sekstilis Plutonas"
```

### New format:
```
EN: "Saturn ✦ Pluto — Supportive Connection"
LT: "Saturnas ✦ Plutonas — Palaikantis Ryšys"
```

---

## ASPECT DISPLAY TRANSLATIONS

| Technical EN | Technical LT | Plain EN | Plain LT |
|-------------|-------------|----------|----------|
| Conjunction | Konjunkcija | Merging Energies | Susijungiančios Energijos |
| Sextile | Sekstilis | Supportive Connection | Palaikantis Ryšys |
| Square | Kvadratūra | Creative Tension | Kūrybinė Įtampa |
| Trine | Trinas | Natural Flow | Natūralus Srautas |
| Opposition | Opozicija | Balancing Act | Pusiausvyros Ieškojimas |

---

## IMPLEMENTATION

### Step 1: Find where planet-aspect-planet strings are constructed

Search for where the display string combining planet + aspect + planet is built:

```bash
grep -rn "sekstilis\|trinas\|kvadrat\|konjunkcija\|opozicija" src/
grep -rn "Sextile\|Trine\|Square\|Conjunction\|Opposition" src/
grep -rn "aspectName\|aspect_name\|aspectLabel\|aspectType" src/
```

This likely exists in:
- Aspect card rendering in Cosmic Reading phase cards
- Main page "Today's Cosmic Weather" aspect section
- Any aspect list or detail views

### Step 2: Update the display format

Wherever a planet-aspect-planet string is rendered to the user, change the format:

**For card headers / titles:**
```
Planet1 ✦ Planet2
```
The ✦ symbol replaces the technical aspect name as a clean visual separator.

**For the subtitle / description line below:**
```
Plain aspect name (e.g. "Supportive Connection" / "Palaikantis Ryšys")
```

So a complete card header looks like:

```
♄ Saturnas ✦ ♇ Plutonas
  Palaikantis Ryšys                    ← plain name, smaller text, 60% opacity

  Disciplina ir Struktūra ✦ Transformacija ir Galia    ← planet domains
```

### Step 3: Keep technical names accessible but hidden

Do NOT delete the technical terms entirely. They should still exist in the data layer for anyone who wants them. Just don't show them as the primary display. If in future you want a "show technical terms" toggle for advanced users, the data is there.

### Step 4: Check ALL locations

- [ ] Cosmic Reading aspect phase cards
- [ ] Main page aspect cards/sections below the wheel
- [ ] Any tooltips or detail panels showing aspects
- [ ] Phase progress bar — the "Aspects" / "Aspektai" label is fine (it's a category name, not a technical term)

---

## TESTING

- [ ] English mode: aspect cards show "Saturn ✦ Pluto" with "Supportive Connection" subtitle
- [ ] Lithuanian mode: aspect cards show "Saturnas ✦ Plutonas" with "Palaikantis Ryšys" subtitle
- [ ] All 5 aspect types display correct plain names in both languages
- [ ] No instances of "Sextile", "Trine", "Square", "sekstilis", "trinas", "kvadratūra" visible to the user anywhere
- [ ] Planet domain labels still display correctly beneath planet names
- [ ] Diacriticals all correct (Kūrybinė Įtampa, not Kurybine Itampa)
- [ ] Build succeeds with zero TypeScript errors

---

## GIT

```bash
git add -A
git commit -m "fix: replace technical aspect jargon with human-readable plain descriptions"
git push origin master:main
```
