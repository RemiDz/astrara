# Astrara — Astrology Glossary + Inline Term Tooltips

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use megathink for this task.

---

## CONTEXT

Users without astrology knowledge encounter unfamiliar terms throughout the app (sextile, trine, waning gibbous, retrograde, etc.) and don't know what they mean. This feature adds:

1. A comprehensive **Glossary tab** inside the existing Info modal
2. **Inline term highlighting** on the main page — tap any highlighted term to see its definition in a small tooltip

**Important design constraint:** Do NOT add inline highlighting inside the Cosmic Reading overlay. The reading flow must stay clean and uninterrupted. Highlighting only applies to the main page cards and sections.

---

## PART 1: GLOSSARY TAB IN INFO MODAL

### Where
The app already has an Info modal (ℹ️ button). Add a new tab alongside the existing content.

### Tab Structure

The Info modal should have two tabs:
- **About** — existing content (keep as-is)
- **Glossary** — new astrology terms dictionary

### Glossary Tab Design

```
┌─────────────────────────────────────┐
│  About  │  ✦ Glossary               │  ← Tab bar
├─────────────────────────────────────┤
│  🔍 Search terms...                 │  ← Search/filter input
├─────────────────────────────────────┤
│                                     │
│  ── Moon Phases ──                  │  ← Category header
│                                     │
│  ☽ New Moon                         │
│  The Moon is between Earth and      │
│  the Sun, invisible in the sky.     │
│  A time for setting intentions      │
│  and planting seeds for new         │
│  beginnings.                        │
│                                     │
│  ☽ Waxing Crescent                  │
│  A sliver of light appears as       │
│  the Moon begins to grow...         │
│                                     │
│  ── Aspects ──                      │
│                                     │
│  △ Trine                            │
│  When two planets are 120° apart.   │
│  This is the most harmonious        │
│  aspect — energies flow together    │
│  naturally and effortlessly...      │
│                                     │
│  ── Planets ──                      │
│                                     │
│  ☉ Sun                              │
│  Represents your core identity,     │
│  ego, vitality, and life force...   │
│                                     │
└─────────────────────────────────────┘
```

### Visual Style

```
Tab bar:
  - Same glass morphism style as existing Info modal
  - Active tab: white text, subtle bottom border glow
  - Inactive tab: white/50% opacity

Search input:
  - Glass morphism input, white/10% background
  - Placeholder: EN "Search terms..." / LT "Ieškoti terminų..."
  - Filters the list in real-time as user types
  - Searches both term names and descriptions

Category headers:
  - Uppercase, 11px, white/40% opacity, letter-spacing: 2px
  - Thin horizontal line (white/10%) above

Term entries:
  - Term name: 16px, white, with symbol prefix
  - Description: 14px, white/70%, max 3 sentences
  - Padding: 12px 0, separated by subtle divider (white/5%)
  - Each entry is a self-contained block — no expand/collapse needed
```

### Glossary Content

All descriptions must be written for a 12-year-old — warm, clear, no jargon in the explanation itself. Both EN and LT versions needed.

#### MOON PHASES

```typescript
{
  category: { en: 'Moon Phases', lt: 'Mėnulio Fazės' },
  terms: [
    {
      symbol: '☽',
      key: 'new_moon',
      en: { name: 'New Moon', description: 'The Moon is between Earth and the Sun, invisible in the night sky. Think of it as a blank page — the perfect moment to set intentions, start fresh projects, or plant seeds for what you want to grow.' },
      lt: { name: 'Jaunatis', description: 'Mėnulis yra tarp Žemės ir Saulės, nematomas naktiniame danguje. Įsivaizduokite tai kaip tuščią lapą — puikus momentas kelti tikslus, pradėti naujus projektus ar pasėti sėklas tam, ką norite auginti.' },
    },
    {
      symbol: '☽',
      key: 'waxing_crescent',
      en: { name: 'Waxing Crescent', description: 'A thin sliver of light appears as the Moon begins to grow. Energy is building. This is the time to take the first small steps towards your intentions — gather resources, make plans, build momentum.' },
      lt: { name: 'Augantis Pjautuvas', description: 'Plonas šviesos pjautuvas pasirodo Mėnuliui pradedant augti. Energija kaupiasi. Laikas žengti pirmuosius žingsnius savo tikslų link — rinkti išteklius, kurti planus, kaupti pagreitį.' },
    },
    {
      symbol: '☽',
      key: 'first_quarter',
      en: { name: 'First Quarter', description: 'The Moon is half-lit — a turning point. Challenges may arise that test your commitment. This is the time to take decisive action, push through obstacles, and commit to your path.' },
      lt: { name: 'Pirmasis Ketvirtis', description: 'Mėnulis apšviestas per pusę — lūžio taškas. Gali kilti iššūkių, tikrinančių jūsų ryžtą. Laikas imtis ryžtingų veiksmų, įveikti kliūtis ir įsipareigoti savo keliui.' },
    },
    {
      symbol: '☽',
      key: 'waxing_gibbous',
      en: { name: 'Waxing Gibbous', description: 'The Moon is almost full, bright and building. Time to refine, adjust, and perfect what you have been working on. Pay attention to details — small tweaks now lead to better results at the Full Moon.' },
      lt: { name: 'Augantis Priešpilnis', description: 'Mėnulis beveik pilnas, šviesus ir augantis. Laikas tobulinti ir koreguoti tai, ką kūrėte. Atkreipkite dėmesį į detales — maži pakeitimai dabar lems geresnius rezultatus per Pilnatį.' },
    },
    {
      symbol: '☽',
      key: 'full_moon',
      en: { name: 'Full Moon', description: 'The Moon is fully illuminated — peak energy, peak clarity. Emotions run high, truths are revealed, and things come to completion. A powerful time for celebration, release, and seeing situations clearly.' },
      lt: { name: 'Pilnatis', description: 'Mėnulis pilnai apšviestas — didžiausia energija ir aiškumas. Emocijos stiprios, tiesos atsiskleidžia, dalykai baigiasi. Galingas laikas švęsti, atleisti ir matyti situacijas aiškiai.' },
    },
    {
      symbol: '☽',
      key: 'waning_gibbous',
      en: { name: 'Waning Gibbous', description: 'The Moon begins to shrink after the Full Moon. The energy shifts from doing to sharing. This is the time to teach what you have learned, express gratitude, and share your wisdom with others.' },
      lt: { name: 'Dylantis Priešpilnis', description: 'Mėnulis pradeda mažėti po Pilnaties. Energija keičiasi nuo veikimo prie dalijimosi. Laikas mokyti, ką išmokote, reikšti dėkingumą ir dalintis savo išmintimi su kitais.' },
    },
    {
      symbol: '☽',
      key: 'last_quarter',
      en: { name: 'Last Quarter', description: 'The Moon is half-lit again, but now shrinking. Time to let go of what no longer serves you — old habits, finished projects, outdated beliefs. Release and make space for the new cycle.' },
      lt: { name: 'Paskutinis Ketvirtis', description: 'Mėnulis vėl apšviestas per pusę, bet dabar mažėja. Laikas atleisti tai, kas jums nebetarnauja — senus įpročius, baigtus projektus, pasenusias idėjas. Atleiskite ir sukurkite erdvę naujam ciklui.' },
    },
    {
      symbol: '☽',
      key: 'waning_crescent',
      en: { name: 'Waning Crescent', description: 'The thinnest sliver before darkness. The quietest phase — time for rest, reflection, and surrender. Slow down, look inward, and prepare your spirit for the renewal that comes with the New Moon.' },
      lt: { name: 'Dylantis Pjautuvas', description: 'Ploniausias pjautuvas prieš tamsą. Ramiausia fazė — laikas poilsiui, apmąstymams ir atsidavimui. Sulėtėkite, pažvelkite į vidų ir paruoškite savo dvasią atsinaujinimui, kuris ateina su Jaunatimi.' },
    },
  ],
}
```

#### ASPECTS

```typescript
{
  category: { en: 'Aspects', lt: 'Aspektai' },
  terms: [
    {
      symbol: '☌',
      key: 'conjunction',
      en: { name: 'Conjunction', description: 'Two planets are at the same point in the sky (0° apart). Their energies merge and intensify each other. Like two musicians playing the same note — the sound becomes louder and more powerful.' },
      lt: { name: 'Konjunkcija', description: 'Dvi planetos yra tame pačiame dangaus taške (0° atstumu). Jų energijos susilieja ir sustiprina viena kitą. Tarsi du muzikantai grojantys tą pačią natą — garsas tampa stipresnis ir galingesnis.' },
    },
    {
      symbol: '⚹',
      key: 'sextile',
      en: { name: 'Sextile', description: 'Two planets are 60° apart — a gentle, supportive connection. Opportunities arise naturally, but you need to act on them. Think of it as a door being held open for you — you still need to walk through it.' },
      lt: { name: 'Sekstilis', description: 'Dvi planetos yra 60° atstumu — švelnus, palaikantis ryšys. Galimybės atsiranda natūraliai, bet reikia jomis pasinaudoti. Įsivaizduokite tai kaip atidaromas jums duris — vis tiek reikia pro jas praeiti.' },
    },
    {
      symbol: '□',
      key: 'square',
      en: { name: 'Square', description: 'Two planets are 90° apart — creating tension and friction. This is not bad — it is the push you need to grow. Challenges arise that force you to take action, solve problems, and become stronger.' },
      lt: { name: 'Kvadratūra', description: 'Dvi planetos yra 90° atstumu — sukuria įtampą ir trintį. Tai nėra blogai — tai stumtelėjimas, kurio reikia augimui. Iššūkiai verčia veikti, spręsti problemas ir tapti stipresniu.' },
    },
    {
      symbol: '△',
      key: 'trine',
      en: { name: 'Trine', description: 'Two planets are 120° apart — the most harmonious aspect. Energies flow together effortlessly, like a river following its natural course. Talents, luck, and ease are amplified. Enjoy the flow.' },
      lt: { name: 'Trinas', description: 'Dvi planetos yra 120° atstumu — pats harmoniškiausias aspektas. Energijos teka kartu be pastangų, kaip upė savo natūraliu keliu. Talentai, sėkmė ir lengvumas sustiprėja. Mėgaukitės srautu.' },
    },
    {
      symbol: '☍',
      key: 'opposition',
      en: { name: 'Opposition', description: 'Two planets are directly opposite each other (180° apart). This creates a tug-of-war between two areas of your life. The key is balance — neither side should win completely. Find the middle ground.' },
      lt: { name: 'Opozicija', description: 'Dvi planetos yra viena priešais kitą (180° atstumu). Tai sukuria traukimą tarp dviejų gyvenimo sričių. Svarbiausia — pusiausvyra. Nė viena pusė neturėtų visiškai laimėti. Raskite vidurio kelią.' },
    },
  ],
}
```

#### PLANETS

```typescript
{
  category: { en: 'Planets', lt: 'Planetos' },
  terms: [
    {
      symbol: '☉',
      key: 'sun',
      en: { name: 'Sun', description: 'Your core self — who you are at the deepest level. The Sun represents your identity, vitality, ego, and life force. It is the centre of your personal solar system, driving your purpose and self-expression.' },
      lt: { name: 'Saulė', description: 'Jūsų esminis aš — kas jūs esate giliausiu lygiu. Saulė atspindi jūsų tapatybę, gyvybingumą, ego ir gyvybinę jėgą. Ji yra jūsų asmeninės saulės sistemos centras, varanti jūsų tikslą ir saviraišką.' },
    },
    {
      symbol: '☽',
      key: 'moon',
      en: { name: 'Moon', description: 'Your emotional world — how you feel, react, and nurture. The Moon governs your instincts, moods, memories, and sense of comfort. It changes sign every 2–3 days, making it the fastest-moving influence in your chart.' },
      lt: { name: 'Mėnulis', description: 'Jūsų emocinis pasaulis — kaip jaučiate, reaguojate ir rūpinatės. Mėnulis valdo jūsų instinktus, nuotaikas, prisiminimus ir komforto pojūtį. Jis keičia ženklą kas 2–3 dienas, todėl tai greičiausiai kintanti įtaka jūsų žemėlapyje.' },
    },
    {
      symbol: '☿',
      key: 'mercury',
      en: { name: 'Mercury', description: 'How you think and communicate. Mercury rules your mind, speech, writing, learning, and short journeys. When Mercury is retrograde, communication and technology often experience delays or misunderstandings.' },
      lt: { name: 'Merkurijus', description: 'Kaip mąstote ir bendraujate. Merkurijus valdo jūsų protą, kalbą, rašymą, mokymąsi ir trumpas keliones. Kai Merkurijus retrograduoja, bendravimas ir technologijos dažnai patiria vėlavimus ar nesusipratimus.' },
    },
    {
      symbol: '♀',
      key: 'venus',
      en: { name: 'Venus', description: 'Love, beauty, pleasure, and values. Venus governs what you find attractive, how you express affection, your relationship style, and what you value — including money. She brings harmony, art, and sweetness.' },
      lt: { name: 'Venera', description: 'Meilė, grožis, malonumas ir vertybės. Venera valdo tai, ką laikote patraukliu, kaip reiškiate meilę, jūsų santykių stilių ir tai, ką vertinate — įskaitant pinigus. Ji neša harmoniją, meną ir švelnumą.' },
    },
    {
      symbol: '♂',
      key: 'mars',
      en: { name: 'Mars', description: 'Your drive, energy, ambition, and courage. Mars is the warrior — it governs how you assert yourself, fight for what you want, and channel your physical energy. It also rules passion, anger, and competitive spirit.' },
      lt: { name: 'Marsas', description: 'Jūsų valia, energija, ambicija ir drąsa. Marsas yra karys — jis valdo, kaip save išreiškiate, kovojate dėl to, ko norite, ir nukreipiate fizinę energiją. Jis taip pat valdo aistrą, pyktį ir varžymosi dvasią.' },
    },
    {
      symbol: '♃',
      key: 'jupiter',
      en: { name: 'Jupiter', description: 'Growth, expansion, luck, and wisdom. Jupiter is the great benefactor — wherever it touches, things expand and prosper. It governs higher education, travel, philosophy, and your sense of faith and optimism.' },
      lt: { name: 'Jupiteris', description: 'Augimas, plėtra, sėkmė ir išmintis. Jupiteris yra didysis geradarys — kur jis paliečia, dalykai plečiasi ir klesti. Jis valdo aukštąjį mokslą, keliones, filosofiją ir jūsų tikėjimo bei optimizmo pojūtį.' },
    },
    {
      symbol: '♄',
      key: 'saturn',
      en: { name: 'Saturn', description: 'Discipline, structure, responsibility, and life lessons. Saturn is the strict teacher — it shows you where you need to work harder, set boundaries, and build lasting foundations. Challenging but ultimately rewarding.' },
      lt: { name: 'Saturnas', description: 'Disciplina, struktūra, atsakomybė ir gyvenimo pamokos. Saturnas yra griežtas mokytojas — jis parodo, kur reikia dirbti daugiau, nustatyti ribas ir kurti ilgalaikius pamatus. Sudėtinga, bet galiausiai atlyginama.' },
    },
    {
      symbol: '♅',
      key: 'uranus',
      en: { name: 'Uranus', description: 'Innovation, sudden change, rebellion, and awakening. Uranus breaks old patterns and brings unexpected breakthroughs. It governs technology, originality, freedom, and revolutionary thinking.' },
      lt: { name: 'Uranas', description: 'Inovacijos, staigūs pokyčiai, maištas ir prabudimas. Uranas laužo senus modelius ir atneša netikėtus proveržius. Jis valdo technologijas, originalumą, laisvę ir revoliucinį mąstymą.' },
    },
    {
      symbol: '♆',
      key: 'neptune',
      en: { name: 'Neptune', description: 'Dreams, spirituality, imagination, and intuition. Neptune dissolves boundaries between the real and the mystical. It governs meditation, music, compassion, and psychic sensitivity — but also illusion and confusion when ungrounded.' },
      lt: { name: 'Neptūnas', description: 'Svajonės, dvasingumas, vaizduotė ir intuicija. Neptūnas ištirpdo ribas tarp realybės ir mistikos. Jis valdo meditaciją, muziką, užuojautą ir dvasinį jautrumą — bet taip pat iliuziją ir sumaištį, kai nėra įžeminimo.' },
    },
    {
      symbol: '♇',
      key: 'pluto',
      en: { name: 'Pluto', description: 'Transformation, power, death and rebirth. Pluto governs the deepest changes — the ones that break you down so you can rebuild stronger. It rules hidden truths, intense experiences, and the cycle of endings that lead to new beginnings.' },
      lt: { name: 'Plutonas', description: 'Transformacija, galia, mirtis ir atgimimas. Plutonas valdo giliausius pokyčius — tuos, kurie jus sugriauna, kad galėtumėte atstatyti stipriau. Jis valdo paslėptas tiesas, intensyvias patirtis ir pabaigų ciklą, vedantį prie naujų pradžių.' },
    },
  ],
}
```

#### ZODIAC SIGNS

```typescript
{
  category: { en: 'Zodiac Signs', lt: 'Zodiako Ženklai' },
  terms: [
    {
      symbol: '♈',
      key: 'aries',
      en: { name: 'Aries', description: 'The pioneer and initiator. Aries energy is bold, courageous, competitive, and impatient. It is the spark that starts everything — pure action and drive. Element: Fire. Ruled by Mars.' },
      lt: { name: 'Avinas', description: 'Pionierius ir iniciatorius. Avino energija yra drąsi, ryžtinga, konkurencinga ir nekantri. Tai kibirkštis, kuri viską pradeda — grynas veiksmas ir varomoji jėga. Stichija: Ugnis. Valdovas: Marsas.' },
    },
    {
      symbol: '♉',
      key: 'taurus',
      en: { name: 'Taurus', description: 'The builder and stabiliser. Taurus energy is grounded, patient, sensual, and persistent. It values comfort, beauty, and security — building things that last. Element: Earth. Ruled by Venus.' },
      lt: { name: 'Jautis', description: 'Statytojas ir stabilizatorius. Jaučio energija yra įžeminta, kantri, jausminė ir atkaklus. Vertina komfortą, grožį ir saugumą — kuria dalykus, kurie išlieka. Stichija: Žemė. Valdovas: Venera.' },
    },
    {
      symbol: '♊',
      key: 'gemini',
      en: { name: 'Gemini', description: 'The communicator and connector. Gemini energy is curious, adaptable, witty, and restless. It loves to learn, talk, and explore ideas — always seeking new connections. Element: Air. Ruled by Mercury.' },
      lt: { name: 'Dvyniai', description: 'Komunikatorius ir jungiklis. Dvynių energija yra smalsi, prisitaikanti, sąmojinga ir nenustygstanti. Mėgsta mokytis, kalbėti ir tyrinėti idėjas — nuolat ieško naujų ryšių. Stichija: Oras. Valdovas: Merkurijus.' },
    },
    {
      symbol: '♋',
      key: 'cancer',
      en: { name: 'Cancer', description: 'The nurturer and protector. Cancer energy is sensitive, caring, intuitive, and deeply emotional. It creates safe spaces, protects loved ones, and honours family and roots. Element: Water. Ruled by Moon.' },
      lt: { name: 'Vėžys', description: 'Globėjas ir saugotojas. Vėžio energija yra jautri, rūpestinga, intuityvi ir giliai emocinė. Kuria saugias erdves, saugo artimuosius ir gerbia šeimą bei šaknis. Stichija: Vanduo. Valdovas: Mėnulis.' },
    },
    {
      symbol: '♌',
      key: 'leo',
      en: { name: 'Leo', description: 'The performer and leader. Leo energy is confident, generous, creative, and dramatic. It shines brightly, inspires others, and seeks recognition for its unique gifts. Element: Fire. Ruled by Sun.' },
      lt: { name: 'Liūtas', description: 'Atlikėjas ir lyderis. Liūto energija yra pasitikinti, dosni, kūrybiška ir dramatiška. Šviečia ryškiai, įkvepia kitus ir siekia pripažinimo už savo unikalias dovanas. Stichija: Ugnis. Valdovas: Saulė.' },
    },
    {
      symbol: '♍',
      key: 'virgo',
      en: { name: 'Virgo', description: 'The analyst and healer. Virgo energy is practical, detail-oriented, helpful, and health-conscious. It seeks to improve, organise, and serve — finding purpose through being useful. Element: Earth. Ruled by Mercury.' },
      lt: { name: 'Mergelė', description: 'Analitikas ir gydytojas. Mergelės energija yra praktiška, orientuota į detales, paslaugi ir sveikatai jautri. Siekia tobulinti, tvarkyti ir tarnauti — randa prasmę būdama naudinga. Stichija: Žemė. Valdovas: Merkurijus.' },
    },
    {
      symbol: '♎',
      key: 'libra',
      en: { name: 'Libra', description: 'The diplomat and harmoniser. Libra energy seeks balance, fairness, beauty, and partnership. It thrives in relationships and creates harmony wherever it goes. Element: Air. Ruled by Venus.' },
      lt: { name: 'Svarstyklės', description: 'Diplomatas ir harmonizuotojas. Svarstyklių energija siekia pusiausvyros, teisingumo, grožio ir partnerystės. Klesti santykiuose ir kuria harmoniją visur, kur eina. Stichija: Oras. Valdovas: Venera.' },
    },
    {
      symbol: '♏',
      key: 'scorpio',
      en: { name: 'Scorpio', description: 'The transformer and truth-seeker. Scorpio energy is intense, passionate, secretive, and deeply perceptive. It digs beneath the surface to find hidden truths and is not afraid of the dark. Element: Water. Ruled by Pluto.' },
      lt: { name: 'Skorpionas', description: 'Transformuotojas ir tiesos ieškotojas. Skorpiono energija yra intensyvi, aistringa, slapta ir giliai permatanti. Kasa po paviršiumi ieškodama paslėptų tiesų ir nebijo tamsos. Stichija: Vanduo. Valdovas: Plutonas.' },
    },
    {
      symbol: '♐',
      key: 'sagittarius',
      en: { name: 'Sagittarius', description: 'The explorer and philosopher. Sagittarius energy is adventurous, optimistic, free-spirited, and truth-seeking. It craves travel, learning, and the big picture of life. Element: Fire. Ruled by Jupiter.' },
      lt: { name: 'Šaulys', description: 'Tyrinėtojas ir filosofas. Šaulio energija yra avantiūristinė, optimistinė, laisvadvasiška ir ieškanti tiesos. Trokšta kelionių, mokymosi ir didžiojo gyvenimo paveikslo. Stichija: Ugnis. Valdovas: Jupiteris.' },
    },
    {
      symbol: '♑',
      key: 'capricorn',
      en: { name: 'Capricorn', description: 'The achiever and builder. Capricorn energy is ambitious, disciplined, patient, and strategic. It climbs steadily towards long-term goals, building empires through persistence. Element: Earth. Ruled by Saturn.' },
      lt: { name: 'Ožiaragis', description: 'Pasiekėjas ir statytojas. Ožiaragio energija yra ambicinga, disciplinuota, kantri ir strateginė. Stabiliai kopia ilgalaikių tikslų link, kurdama imperijas per atkaklumą. Stichija: Žemė. Valdovas: Saturnas.' },
    },
    {
      symbol: '♒',
      key: 'aquarius',
      en: { name: 'Aquarius', description: 'The visionary and humanitarian. Aquarius energy is innovative, independent, idealistic, and eccentric. It thinks about the future of humanity and challenges the status quo. Element: Air. Ruled by Uranus.' },
      lt: { name: 'Vandenis', description: 'Vizionierius ir humanistas. Vandenio energija yra inovatyvi, nepriklausoma, idealistinė ir ekscentriška. Mąsto apie žmonijos ateitį ir meta iššūkį status quo. Stichija: Oras. Valdovas: Uranas.' },
    },
    {
      symbol: '♓',
      key: 'pisces',
      en: { name: 'Pisces', description: 'The dreamer and mystic. Pisces energy is compassionate, intuitive, creative, and deeply spiritual. It feels everything, transcends boundaries, and connects to the unseen world. Element: Water. Ruled by Neptune.' },
      lt: { name: 'Žuvys', description: 'Svajotojas ir mistikas. Žuvų energija yra užjaučianti, intuityvi, kūrybiška ir giliai dvasinė. Jaučia viską, peržengia ribas ir jungiasi su nematomu pasauliu. Stichija: Vanduo. Valdovas: Neptūnas.' },
    },
  ],
}
```

#### OTHER TERMS

```typescript
{
  category: { en: 'Other Terms', lt: 'Kiti Terminai' },
  terms: [
    {
      symbol: '℞',
      key: 'retrograde',
      en: { name: 'Retrograde', description: 'When a planet appears to move backwards in the sky from Earth\'s perspective. It is an optical illusion, but in astrology it signals a time to slow down, review, and revisit matters related to that planet\'s domain.' },
      lt: { name: 'Retrogradas', description: 'Kai planeta atrodo judanti atgal danguje žiūrint nuo Žemės. Tai optinė iliuzija, bet astrologijoje tai signalas sulėtinti, peržiūrėti ir grįžti prie tos planetos srities dalykų.' },
    },
    {
      symbol: '🌑',
      key: 'transit',
      en: { name: 'Transit', description: 'The current real-time position of a planet in the sky. When we say "Venus is transiting Aries", it means Venus is currently moving through the Aries section of the sky. Transits create the daily cosmic weather.' },
      lt: { name: 'Tranzitas', description: 'Dabartinė realaus laiko planetos pozicija danguje. Kai sakome „Venera tranzituoja Aviną", tai reiškia, kad Venera šiuo metu juda per Avino dangaus dalį. Tranzitai sukuria kasdienę kosminę orą.' },
    },
    {
      symbol: '🔮',
      key: 'zodiac',
      en: { name: 'Zodiac', description: 'A belt of 12 constellations that the Sun, Moon, and planets appear to travel through. Each section spans 30° of the sky. Your Sun sign is determined by which section the Sun was in when you were born.' },
      lt: { name: 'Zodiakas', description: 'Juosta iš 12 žvaigždynų, per kuriuos atrodo keliauja Saulė, Mėnulis ir planetos. Kiekviena dalis apima 30° dangaus. Jūsų Saulės ženklas nustatomas pagal tai, kurioje dalyje buvo Saulė, kai gimėte.' },
    },
    {
      symbol: '🏠',
      key: 'house',
      en: { name: 'House', description: 'In astrology, the sky is divided into 12 houses, each representing a different area of life — self, money, communication, home, creativity, health, relationships, transformation, travel, career, community, and spirituality.' },
      lt: { name: 'Namai', description: 'Astrologijoje dangus padalintas į 12 namų, kiekvienas atspindintis skirtingą gyvenimo sritį — aš, pinigai, bendravimas, namai, kūryba, sveikata, santykiai, transformacija, kelionės, karjera, bendruomenė ir dvasingumas.' },
    },
    {
      symbol: '🌊',
      key: 'element',
      en: { name: 'Element', description: 'The four elements — Fire (action), Earth (stability), Air (intellect), Water (emotion) — group the zodiac signs by their fundamental nature. Signs of the same element share a natural understanding and energy quality.' },
      lt: { name: 'Stichija', description: 'Keturios stichijos — Ugnis (veiksmas), Žemė (stabilumas), Oras (intelektas), Vanduo (emocijos) — grupuoja zodiako ženklus pagal jų prigimtį. To paties elemento ženklai dalijasi natūraliu supratimu ir energijos kokybe.' },
    },
  ],
}
```

---

## PART 2: INLINE TERM TOOLTIPS ON MAIN PAGE

### Where This Applies

ONLY on the main page content — specifically:
- Planet cards in "Today's Cosmic Weather" section
- Moon phase card
- Aspect descriptions
- Any other text content on the main page

**DO NOT** apply inline highlighting inside the Cosmic Reading overlay. The reading flow must stay clean and undisturbed.

### How It Works

1. Create a `<GlossaryTerm>` React component
2. This component wraps any text that matches a glossary term key
3. Visual: subtle dotted underline, element colour at 30% opacity
4. On tap/click: a small tooltip bubble appears directly above the word showing the glossary definition (2-3 sentences max — use the short descriptions from Part 1)
5. Tap anywhere else to dismiss the tooltip
6. Only ONE tooltip can be open at a time

### GlossaryTerm Component Spec

```typescript
interface GlossaryTermProps {
  termKey: string;        // matches the 'key' in glossary data
  children: React.ReactNode;  // the displayed text
}
```

### Visual Design

```
Highlighted term inline:
  - Text colour: inherit (same as surrounding text)
  - Border-bottom: 1px dotted currentColor at 30% opacity
  - Cursor: help (on desktop)
  - No other visual change — must be subtle

Tooltip bubble:
  - Position: absolute, above the term, centred
  - Max width: 280px
  - Background: rgba(15, 15, 25, 0.95)
  - Border: 1px solid white/10%
  - Border-radius: 12px
  - Padding: 12px 16px
  - Backdrop-filter: blur(20px)
  - Small downward-pointing arrow/triangle

Tooltip content:
  - Term name: 14px bold, white, with symbol
  - Description: 13px, white/70%, max 2-3 sentences
  - Use short version of glossary descriptions

Animation:
  - Fade in: opacity 0→1, translateY(4px→0), 200ms ease
  - Fade out: reverse, 150ms ease
```

### Which Terms to Highlight

Do NOT highlight every single occurrence. Use these rules:
- Highlight the FIRST occurrence of each term per card/section only
- Never highlight a term more than once in the same visible area
- Terms to highlight: Moon phase names, aspect type names, planet names (only when they appear in descriptive text, NOT in headers where the planet is already labelled with symbol + domain)
- Do NOT highlight zodiac sign names in planet position strings (e.g. don't highlight "Aries" in "Venus in Aries" — the user already sees the sign name)

### Implementation Approach

1. Create the glossary data file: `src/data/glossary.ts` — export the full glossary dataset from Part 1
2. Create `GlossaryTerm` component: `src/components/GlossaryTerm.tsx`
3. Create a `GlossaryTooltip` component for the floating bubble
4. Create the Info modal Glossary tab: add to existing Info modal component
5. Manually wrap key terms in existing main page card components with `<GlossaryTerm termKey="...">` — do NOT use automatic text scanning/regex replacement as this is fragile and breaks React rendering

---

## FILE STRUCTURE

```
src/
├── data/
│   └── glossary.ts                    # Full glossary dataset (all categories, EN + LT)
├── components/
│   ├── GlossaryTerm.tsx               # Inline highlighted term wrapper
│   └── GlossaryTooltip.tsx            # Floating tooltip bubble
└── [existing Info modal component]     # Add Glossary tab here
```

---

## TESTING

- [ ] Info modal shows two tabs: About and Glossary
- [ ] Glossary displays all categories: Moon Phases, Aspects, Planets, Zodiac Signs, Other Terms
- [ ] Search/filter works in real-time
- [ ] All content displays in Lithuanian when LT mode active
- [ ] All diacriticals correct in Lithuanian content
- [ ] Main page: key terms have subtle dotted underline
- [ ] Tapping a highlighted term shows tooltip with definition
- [ ] Only one tooltip visible at a time
- [ ] Tapping elsewhere dismisses tooltip
- [ ] Tooltip positions correctly (above term, doesn't overflow screen)
- [ ] NO highlighted terms inside Cosmic Reading overlay
- [ ] No regressions to existing UI, cards, or Cosmic Reading flow
- [ ] Build succeeds with zero TypeScript errors

---

## GIT

```bash
git add -A
git commit -m "feat: astrology glossary tab in Info modal + inline term tooltips on main page"
git push origin master:main
```
