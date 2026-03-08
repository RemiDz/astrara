# Astrara — Fix: Lithuanian Grammar in Aspect Sentences

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use megathink for this task.

---

## ISSUE

Aspect sentences in Lithuanian mode have incorrect grammar. Example:

**Current (wrong):**
`Šiandien Uranas formuoja sekstilis su Neptunas`

**Correct:**
`Šiandien Uranas formuoja sekstilį su Neptūnu`

Two grammar rules are broken:
1. The aspect name after "formuoja" needs **accusative case** (galininkas): sekstilis → sekstilį
2. The planet name after "su" needs **instrumental case** (įnagininkas): Neptunas → Neptūnu

This affects ALL aspect sentences across the entire app in Lithuanian mode.

---

## SCOPE

Fix every place where aspect sentences are constructed in Lithuanian, including:
- Cosmic Reading aspect phase cards
- Main page "Today's Cosmic Weather" aspect descriptions
- Any detail panels, tooltips, or expanded views showing aspects
- Template strings in `aspectTemplates.ts` and `generateReading.ts`

---

## IMPLEMENTATION

### Step 1: Add Instrumental Case Declensions for Planet Names

The instrumental case is used after "su" (with). Add this to the planet name lookup:

| English | LT Nominative | LT Instrumental (after "su") |
|---------|--------------|-------------------------------|
| Sun | Saulė | Saule |
| Moon | Mėnulis | Mėnuliu |
| Mercury | Merkurijus | Merkurijumi |
| Venus | Venera | Venera |
| Mars | Marsas | Marsu |
| Jupiter | Jupiteris | Jupiteriu |
| Saturn | Saturnas | Saturnu |
| Uranus | Uranas | Uranu |
| Neptune | Neptūnas | Neptūnu |
| Pluto | Plutonas | Plutonu |

### Step 2: Add Accusative Case for Aspect Names

The accusative case is used for the aspect name as a direct object of "formuoja":

| LT Nominative | LT Accusative (after "formuoja") |
|---------------|----------------------------------|
| Sekstilis | Sekstilį |
| Trinas | Triną |
| Kvadratūra | Kvadratūrą |
| Konjunkcija | Konjunkciją |
| Opozicija | Opoziciją |

### Step 3: Fix the Sentence Construction

Find where the Lithuanian aspect sentence template is built. It likely looks like:

```typescript
// CURRENT (wrong)
`Šiandien ${planet1} formuoja ${aspectName} su ${planet2}`
```

Replace with:

```typescript
// CORRECT
`Šiandien ${planet1Nominative} formuoja ${aspectNameAccusative} su ${planet2Instrumental}`
```

The first planet stays in **nominative** (it's the subject).
The aspect name uses **accusative** (it's the direct object of "formuoja").
The second planet uses **instrumental** (it follows "su").

### Step 4: Search for All Occurrences

```bash
grep -rn "formuoja" src/
grep -rn "su \${" src/
grep -rn "sekstil\|trin\|kvadrat\|konjunk\|opozic" src/
```

Fix every match.

### Step 5: Also Check Other Lithuanian Sentence Patterns

There may be other sentence structures beyond "X formuoja Y su Z" that also need case declensions. For example:
- "X yra Y ženkle" — already fixed in previous iteration
- Any sentences describing retrograde: e.g. "Merkurijus yra retrograde" — check grammar
- Any sentences with prepositions that require specific cases

Common Lithuanian preposition + case rules:
- **su** + instrumental (su Neptūnu)
- **į** + accusative (į harmoniją)
- **iš** + genitive (iš Saturno)
- **apie** + accusative (apie Marsą)

Check all Lithuanian template text for correct case usage with prepositions.

---

## FULL PLANET DECLENSION REFERENCE TABLE

For future-proofing, here are all commonly needed cases for planet names:

| Planet | Nominative | Genitive (of) | Accusative (object) | Instrumental (with) |
|--------|-----------|---------------|---------------------|---------------------|
| Saulė | Saulė | Saulės | Saulę | Saule |
| Mėnulis | Mėnulis | Mėnulio | Mėnulį | Mėnuliu |
| Merkurijus | Merkurijus | Merkurijaus | Merkurijų | Merkurijumi |
| Venera | Venera | Veneros | Venerą | Venera |
| Marsas | Marsas | Marso | Marsą | Marsu |
| Jupiteris | Jupiteris | Jupiterio | Jupiterį | Jupiteriu |
| Saturnas | Saturnas | Saturno | Saturną | Saturnu |
| Uranas | Uranas | Urano | Uraną | Uranu |
| Neptūnas | Neptūnas | Neptūno | Neptūną | Neptūnu |
| Plutonas | Plutonas | Plutono | Plutoną | Plutonu |

Store this full table in a utility file (e.g. `src/features/cosmic-reading/content/templates/planetDeclensions.ts` or extend the existing planet lookup) so any future Lithuanian sentence can use the correct form.

```typescript
export const planetDeclensionsLT: Record<string, {
  nominative: string;
  genitive: string;
  accusative: string;
  instrumental: string;
  locative: string;
}> = {
  Sun: {
    nominative: 'Saulė',
    genitive: 'Saulės',
    accusative: 'Saulę',
    instrumental: 'Saule',
    locative: 'Saulėje',
  },
  Moon: {
    nominative: 'Mėnulis',
    genitive: 'Mėnulio',
    accusative: 'Mėnulį',
    instrumental: 'Mėnuliu',
    locative: 'Mėnulyje',
  },
  Mercury: {
    nominative: 'Merkurijus',
    genitive: 'Merkurijaus',
    accusative: 'Merkurijų',
    instrumental: 'Merkurijumi',
    locative: 'Merkurijuje',
  },
  Venus: {
    nominative: 'Venera',
    genitive: 'Veneros',
    accusative: 'Venerą',
    instrumental: 'Venera',
    locative: 'Veneroje',
  },
  Mars: {
    nominative: 'Marsas',
    genitive: 'Marso',
    accusative: 'Marsą',
    instrumental: 'Marsu',
    locative: 'Marse',
  },
  Jupiter: {
    nominative: 'Jupiteris',
    genitive: 'Jupiterio',
    accusative: 'Jupiterį',
    instrumental: 'Jupiteriu',
    locative: 'Jupiteryje',
  },
  Saturn: {
    nominative: 'Saturnas',
    genitive: 'Saturno',
    accusative: 'Saturną',
    instrumental: 'Saturnu',
    locative: 'Saturne',
  },
  Uranus: {
    nominative: 'Uranas',
    genitive: 'Urano',
    accusative: 'Uraną',
    instrumental: 'Uranu',
    locative: 'Urane',
  },
  Neptune: {
    nominative: 'Neptūnas',
    genitive: 'Neptūno',
    accusative: 'Neptūną',
    instrumental: 'Neptūnu',
    locative: 'Neptūne',
  },
  Pluto: {
    nominative: 'Plutonas',
    genitive: 'Plutono',
    accusative: 'Plutoną',
    instrumental: 'Plutonu',
    locative: 'Plutone',
  },
};
```

---

## TESTING

- [ ] Lithuanian mode: aspect sentences read naturally — e.g. `Šiandien Uranas formuoja sekstilį su Neptūnu`
- [ ] All 5 aspect types use correct accusative form
- [ ] All 10 planets use correct instrumental form after "su"
- [ ] English mode unchanged — still reads `Uranus Sextile Neptune` (or new plain format from previous fix)
- [ ] All diacriticals present and correct
- [ ] No nominative case planet names appearing after "su"
- [ ] No nominative case aspect names appearing after "formuoja"
- [ ] Check retrograde sentences for correct grammar too
- [ ] Build succeeds with zero TypeScript errors

---

## GIT

```bash
git add -A
git commit -m "fix: Lithuanian grammar — accusative aspects, instrumental planets after su, full declension table"
git push origin master:main
```
