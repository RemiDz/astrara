# Astrara — Full Lithuanian Language Audit & Fix

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use megathink for this task.

---

## ISSUE

Lithuanian text throughout the app has broken diacritical characters. Letters like **š, č, ž, ė, ų, ū, į, ą** are being stripped or replaced with their ASCII equivalents (s, c, z, e, u, i, a). This makes the Lithuanian text look illiterate to native speakers.

Known examples:
- `Priespilnis` → should be `Priešpilnis`
- `Sianden` → should be `Šiandien` (also misspelled — missing the 'i' before 'en')

This is likely widespread across all Lithuanian strings in the app.

---

## SCOPE

Search the ENTIRE codebase for ALL Lithuanian text strings and fix every single one. This includes but is not limited to:

- Translation/i18n files
- Template files (`moonTemplates.ts`, `sunTemplates.ts`, `aspectTemplates.ts`, `retrogradeTemplates.ts`, `houseTemplates.ts`, `frequencyTemplates.ts`)
- Component files with inline Lithuanian strings
- `planetDomains.ts` or any planet meaning lookups
- Navigation labels, button text, tooltips
- Moon phase names, aspect names, zodiac sign names
- Cosmic Reading card content (summary, phase cards, plain-English subtitles)
- Main page UI text (headers, labels, footer)
- Any hardcoded Lithuanian strings anywhere in `src/`

---

## HOW TO AUDIT

1. Run a project-wide search for Lithuanian text. Search for common Lithuanian words and patterns:
   ```bash
   grep -rn "lt:" src/
   grep -rn "lt'" src/
   grep -rn "'lt'" src/
   grep -rn "language.*lt" src/
   grep -rn "locale.*lt" src/
   ```
   Also search for known broken patterns:
   ```bash
   grep -rn "Siand" src/
   grep -rn "Priespil" src/
   grep -rn "Menul" src/
   grep -rn "Saul" src/
   grep -rn "Svaj" src/
   grep -rn "Sekmė" src/
   grep -rn "Ismint" src/
   ```

2. For EVERY Lithuanian string found, verify:
   - All diacritical marks are present and correct (š, č, ž, ė, ų, ū, į, ą, Š, Č, Ž, Ė, Ų, Ū, Į, Ą)
   - The spelling is correct Lithuanian (not just English words with Lithuanian endings)
   - Grammar and word forms are correct

3. Fix every error found.

---

## LITHUANIAN DIACRITICAL REFERENCE

The Lithuanian alphabet uses these special characters that are commonly broken:

| Correct | Commonly broken to |
|---------|-------------------|
| Š š | S s |
| Č č | C c |
| Ž ž | Z z |
| Ė ė | E e |
| Ų ų | U u |
| Ū ū | U u |
| Į į | I i |
| Ą ą | A a |

---

## KNOWN CORRECTIONS REFERENCE

Use this as a starting point but DO NOT limit fixes to only these. Fix ALL Lithuanian errors found.

### UI Labels
| Wrong | Correct |
|-------|---------|
| Sianden / Siandien | Šiandien |
| Vakar | Vakar ✓ (this one is correct) |
| Rytoj | Rytoj ✓ (this one is correct) |

### Moon Phases
| Wrong | Correct |
|-------|---------|
| Jaunatis | Jaunatis ✓ |
| Augantis Pjautuvas | Augantis Pjautuvas ✓ |
| Pirmasis Ketvirtis | Pirmasis Ketvirtis ✓ |
| Augantis Priespilnis | Augantis Priešpilnis |
| Pilnatis | Pilnatis ✓ |
| Dylantis Priespilnis | Dylantis Priešpilnis |
| Paskutinis Ketvirtis | Paskutinis Ketvirtis ✓ |
| Dylantis Pjautuvas | Dylantis Pjautuvas ✓ |

### Moon Phase Plain Names
| Wrong | Correct |
|-------|---------|
| Nauja Pradzia | Nauja Pradžia |
| Augantis Pagreitis | Augantis Pagreitis ✓ |
| Veikimo Laikas | Veikimo Laikas ✓ |
| Tobulinimas | Tobulinimas ✓ |
| Pilna Energija | Pilna Energija ✓ |
| Dalijimasis | Dalijimasis ✓ |
| Atleidimas | Atleidimas ✓ |
| Poilsis ir Apmastymai | Poilsis ir Apmąstymai |

### Aspect Plain Names
| Wrong | Correct |
|-------|---------|
| Susijungimas | Susijungimas ✓ |
| Palaikantis Rysys | Palaikantis Ryšys |
| Kurybine Itampa | Kūrybinė Įtampa |
| Naturalus Srautas | Natūralus Srautas |
| Pusiausvyra | Pusiausvyra ✓ |

### Planet Domains
| Wrong | Correct |
|-------|---------|
| Tapatybe ir Gyvybingumas | Tapatybė ir Gyvybingumas |
| Emocijos ir Intuicija | Emocijos ir Intuicija ✓ |
| Bendravimas ir Protas | Bendravimas ir Protas ✓ |
| Meile, Grozis ir Vertybes | Meilė, Grožis ir Vertybės |
| Valia, Veiksmas ir Energija | Valia, Veiksmas ir Energija ✓ |
| Augimas, Sekme ir Ismintis | Augimas, Sėkmė ir Išmintis |
| Disciplina ir Struktura | Disciplina ir Struktūra |
| Inovacijos ir Pokyciai | Inovacijos ir Pokyčiai |
| Svajones ir Dvasingumas | Svajonės ir Dvasingumas |
| Transformacija ir Galia | Transformacija ir Galia ✓ |

### Phase Progress Bar Labels
| Wrong | Correct |
|-------|---------|
| Apzvalga | Apžvalga |
| Menulis | Mėnulis |
| Saule | Saulė |
| Aspektai | Aspektai ✓ |
| Garsas | Garsas ✓ |

### Cosmic Reading Content
Check ALL template strings in:
- `moonTemplates.ts` — all Moon-in-sign readings, Moon phase readings
- `sunTemplates.ts` — all Sun-in-sign readings
- `aspectTemplates.ts` — all aspect descriptions and planet energy descriptions
- `retrogradeTemplates.ts` — all retrograde readings
- `houseTemplates.ts` — all house themes and keywords
- `frequencyTemplates.ts` — any Lithuanian descriptions

Every Lithuanian sentence in these files must be checked for missing diacriticals and spelling.

---

## ENCODING CHECK

Also verify that all source files containing Lithuanian characters are saved as UTF-8. If any file is not UTF-8, convert it:
```bash
file -i src/features/cosmic-reading/content/templates/*.ts
```

All files must be UTF-8 encoded to properly display Lithuanian diacritical characters.

---

## TESTING

- [ ] Switch to Lithuanian mode
- [ ] Check every single screen and card for correct diacriticals
- [ ] Main page: header, date navigation, moon phase card, planet cards
- [ ] Cosmic Reading: button label, all phase cards, progress icons, summary
- [ ] Zodiac selector: all 12 sign names
- [ ] No ASCII equivalents visible anywhere (no s instead of š, no c instead of č, etc.)
- [ ] Build succeeds with zero TypeScript errors
- [ ] No encoding warnings or errors in console

---

## GIT

```bash
git add -A
git commit -m "fix: comprehensive Lithuanian diacritical and spelling corrections across entire app"
git push origin master:main
```
