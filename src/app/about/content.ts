// ─────────────────────────────────────────────────────────
// About page — all educational content in EN + LT
// ─────────────────────────────────────────────────────────

export type Language = 'en' | 'lt'

// ── Section navigation ───────────────────────────────────

export const sections: Record<Language, { id: string; label: string }[]> = {
  en: [
    { id: 'celestial-bodies', label: 'The Ten Celestial Bodies' },
    { id: 'zodiac-signs', label: 'The Twelve Zodiac Signs' },
    { id: 'reading-guide', label: 'How to Read a Daily Chart' },
    { id: 'aspects', label: 'Planetary Aspects' },
    { id: 'elements-sound', label: 'Elements & Sound' },
    { id: 'data-sources', label: 'Data Sources' },
    { id: 'frequency-table', label: 'Frequency Reference' },
    { id: 'cheat-sheet', label: 'Quick Reference' },
  ],
  lt: [
    { id: 'celestial-bodies', label: 'Dešimt Dangaus Kūnų' },
    { id: 'zodiac-signs', label: 'Dvylika Zodiako Ženklų' },
    { id: 'reading-guide', label: 'Kaip Skaityti Dienos Žemėlapį' },
    { id: 'aspects', label: 'Planetų Aspektai' },
    { id: 'elements-sound', label: 'Stichijos ir Garsas' },
    { id: 'data-sources', label: 'Duomenų Šaltiniai' },
    { id: 'frequency-table', label: 'Dažnių Lentelė' },
    { id: 'cheat-sheet', label: 'Trumpa Atmintinė' },
  ],
}

// ── Header ───────────────────────────────────────────────

export const header: Record<Language, { title: string; subtitle: string; intro: string }> = {
  en: {
    title: 'ASTRARA \u00b7 Learning Reference',
    subtitle: 'A practitioner\u2019s guide to reading the cosmic map',
    intro: 'This reference covers the astrological meaning of each planet, how zodiac signs shape planetary expression, and how to interpret the data Astrara provides for readings and sound healing sessions.',
  },
  lt: {
    title: 'ASTRARA \u00b7 Mokymosi Žinynas',
    subtitle: 'Praktiko vadovas kosminio žemėlapio skaitymui',
    intro: 'Šis žinynas apima kiekvienos planetos astrologinę reikšmę, kaip zodiako ženklai formuoja planetų raišką ir kaip interpretuoti Astrara pateikiamus duomenis skaitymams bei garso terapijos seansams.',
  },
}

// ── Planet entries (10 celestial bodies) ─────────────────

export interface PlanetData {
  glyph: string
  name: string
  domain: string
  daily: string
  orbital: string
  frequency: string
  note: string
  chakra: string
  sound: string
  prominent: string
}

export const planets: Record<Language, PlanetData[]> = {
  en: [
    {
      glyph: '☉',
      name: 'Sun',
      domain: 'Core identity, vitality, life purpose, ego, consciousness',
      daily: 'When the Sun is emphasised by aspect or sign change, you feel a renewed sense of purpose. Your confidence strengthens. Questions of identity and self-expression come to the surface. You notice what genuinely lights you up versus what you do out of habit.',
      orbital: 'Approximately one month per sign. The Sun completes its full zodiac cycle in one year, defining the astrological seasons.',
      frequency: '126.22 Hz',
      note: 'B',
      chakra: 'Solar Plexus and Heart centre',
      sound: 'Singing bowls tuned to 126 Hz, sun gongs. The Sun frequency is warm and centring. It helps establish a sense of self during meditation. Use it at the start of a session to ground someone in their own identity.',
      prominent: 'A strong Sun placement indicates someone with natural leadership qualities, a clear sense of self, and strong vitality. They tend to be noticed in a room. Their challenge is learning that shining does not require dimming others.',
    },
    {
      glyph: '☽',
      name: 'Moon',
      domain: 'Emotions, instincts, subconscious, nurturing, inner world',
      daily: 'The Moon sets the emotional temperature of each day. When the Moon changes sign, you may notice a shift in mood that has no obvious external cause. The Moon governs our needs for comfort, safety, and belonging. Pay attention to what your body and heart want, not just what your mind says.',
      orbital: 'Approximately 2.5 days per sign. The Moon is the fastest-moving body in the chart, completing a full cycle every 29.5 days.',
      frequency: '210.42 Hz',
      note: 'G#',
      chakra: 'Sacral centre',
      sound: 'The Moon frequency is deeply soothing. Crystal bowls tuned near 210 Hz, ocean drums, and water-themed soundscapes resonate with lunar energy. This is the most important frequency for emotional healing sessions. Use it when someone needs to process feelings or release what they have been holding.',
      prominent: 'A strong Moon placement indicates someone deeply intuitive, emotionally rich, and nurturing. They absorb the feelings of those around them. Their challenge is learning that caring for others starts with caring for themselves.',
    },
    {
      glyph: '☿',
      name: 'Mercury',
      domain: 'Communication, thinking, learning, travel, technology',
      daily: 'When Mercury is active, conversations matter more. You think faster, write more clearly, and make connections between ideas. When Mercury is retrograde, the reverse happens \u2014 miscommunications, tech glitches, travel delays. These are not punishments. They are invitations to slow down and review.',
      orbital: 'Approximately 14 to 30 days per sign. Mercury stays close to the Sun and can only be one sign ahead or behind it.',
      frequency: '141.27 Hz',
      note: 'C# / D',
      chakra: 'Throat centre',
      sound: 'Tuning forks at 141 Hz, wind chimes, and high-pitched Tibetan singing bowls. Mercury energy is quick and light. Use staccato rhythms and brighter tones. This frequency supports clear expression and mental clarity during sessions.',
      prominent: 'A strong Mercury placement indicates someone articulate, curious, and mentally agile. They process information quickly and communicate with precision. Their challenge is learning to listen as deeply as they speak.',
    },
    {
      glyph: '♀',
      name: 'Venus',
      domain: 'Love, beauty, relationships, values, pleasure, art',
      daily: 'When Venus is active, you are drawn to beauty, comfort, and connection. Relationships feel warmer. You notice aesthetics more. You spend time on what brings pleasure rather than just productivity. Venus days are good for creative work, date nights, and treating yourself with kindness.',
      orbital: 'Approximately 23 to 60 days per sign. Venus moves irregularly and can spend longer in signs when retrograde.',
      frequency: '221.23 Hz',
      note: 'A',
      chakra: 'Heart and Sacral centres',
      sound: 'Singing bowls tuned near 221 Hz, harp, gentle gong washes. Venus energy is soft, warm, and harmonious. Use sustained, flowing tones. This frequency opens the heart and softens emotional armour. Excellent for relationship healing sessions and self-love meditations.',
      prominent: 'A strong Venus placement indicates someone with refined taste, natural charm, and a deep appreciation for beauty in all forms. They value harmony and can struggle with conflict. Their challenge is learning that genuine love sometimes requires uncomfortable honesty.',
    },
    {
      glyph: '♂',
      name: 'Mars',
      domain: 'Drive, energy, action, courage, conflict, sexuality',
      daily: 'When Mars is active, your energy levels rise. You feel more assertive, more willing to take risks, and less patient with delay. Physical activity feels satisfying. Arguments can flare up more easily. Mars does not create conflict \u2014 it reveals where you already feel frustrated and gives you the courage to act.',
      orbital: 'Approximately 6 to 7 weeks per sign. Mars stays in each sign long enough to activate its themes thoroughly.',
      frequency: '144.72 Hz',
      note: 'D',
      chakra: 'Root and Solar Plexus centres',
      sound: 'Frame drums, djembe, powerful gong strikes. Mars energy is primal and rhythmic. Use driving beats and lower frequencies. The Mars tone activates physical energy and helps release stored anger or frustration in the body. Useful for sessions focused on empowerment and boundary-setting.',
      prominent: 'A strong Mars placement indicates someone with high energy, natural courage, and a competitive drive. They take initiative and dislike passivity. Their challenge is learning that strength includes the ability to pause.',
    },
    {
      glyph: '♃',
      name: 'Jupiter',
      domain: 'Growth, expansion, luck, wisdom, abundance, travel',
      daily: 'When Jupiter is emphasised, opportunities appear. Your perspective broadens. You feel more optimistic and generous. Learning feels exciting. There is a risk of overextending \u2014 Jupiter does not know the word enough. Moderation is not its strength. Enjoy the expansion, but keep one foot on the ground.',
      orbital: 'Approximately one year per sign. Jupiter spends long enough in each sign to bring growth to that area of collective life.',
      frequency: '183.58 Hz',
      note: 'F#',
      chakra: 'Crown centre',
      sound: 'Large singing bowls, symphonic gongs, and expansive soundscapes. Jupiter energy is grand and generous. Use rich, layered tones that fill the space. The Jupiter frequency supports feelings of abundance, spiritual growth, and philosophical insight. Excellent for sessions focused on opening to possibility.',
      prominent: 'A strong Jupiter placement indicates someone naturally optimistic, philosophical, and generous. They are drawn to big ideas, travel, and teaching. Their challenge is learning that not every opportunity deserves a yes.',
    },
    {
      glyph: '♄',
      name: 'Saturn',
      domain: 'Structure, discipline, responsibility, limitations, karma, time',
      daily: 'When Saturn is active, reality checks arrive. Deadlines feel heavier. Responsibilities cannot be avoided. This is not negative \u2014 Saturn is the master teacher. It shows you where you need to build stronger foundations. The discomfort you feel under Saturn is the discomfort of growing up.',
      orbital: 'Approximately 2.5 years per sign. Saturn transits are significant life chapters. The Saturn Return at age 29 is a major maturation milestone.',
      frequency: '147.85 Hz',
      note: 'D',
      chakra: 'Root centre',
      sound: 'Deep Tibetan singing bowls, monochord drones, low gong tones. Saturn energy is slow, heavy, and grounding. Use sustained, repetitive tones. The Saturn frequency supports discipline, patience, and acceptance. Useful for sessions focused on letting go of resistance and embracing structure.',
      prominent: 'A strong Saturn placement indicates someone responsible, disciplined, and deeply mature. They take commitments seriously and earn respect through consistency. Their challenge is learning that rigidity is not the same as strength.',
    },
    {
      glyph: '♅',
      name: 'Uranus',
      domain: 'Revolution, innovation, sudden change, freedom, awakening',
      daily: 'When Uranus is active, expect the unexpected. Routines break. New ideas arrive like lightning. You feel restless with anything that feels too predictable. Uranus energy is exciting but destabilising. It is the planet of breakthrough \u2014 but breakthrough requires something to break.',
      orbital: 'Approximately 7 years per sign. Uranus transits reshape entire areas of collective life over long periods.',
      frequency: '207.36 Hz',
      note: 'G#',
      chakra: 'Third Eye centre',
      sound: 'Electronic soundscapes, theremin, binaural beats in the Beta range. Uranus energy is electric and unpredictable. Use unconventional sound sources and unexpected frequency shifts. The Uranus frequency stimulates insight and breaks mental patterns. Useful for sessions focused on creative problem-solving.',
      prominent: 'A strong Uranus placement indicates someone original, independent, and drawn to innovation. They often feel ahead of their time. Their challenge is learning that freedom without connection leads to isolation.',
    },
    {
      glyph: '♆',
      name: 'Neptune',
      domain: 'Spirituality, dreams, illusion, intuition, transcendence, compassion',
      daily: 'When Neptune is active, boundaries dissolve. Imagination expands. You may feel more creative, more empathetic, or more confused \u2014 sometimes all three at once. Neptune makes the rational mind uncomfortable because it operates on feeling and intuition. Trust your inner knowing, but verify important decisions with clear-headed thinking.',
      orbital: 'Approximately 14 years per sign. Neptune transits are generational, dissolving and re-imagining entire cultural narratives.',
      frequency: '211.44 Hz',
      note: 'G#',
      chakra: 'Crown centre',
      sound: 'Gong baths, ocean drums, ambient drones, 432 Hz tuning. Neptune energy is vast and formless. Use sustained, wash-like sounds with no sharp edges. The Neptune frequency supports deep meditation, spiritual connection, and emotional release. This is the go-to frequency for transcendent sound healing experiences.',
      prominent: 'A strong Neptune placement indicates someone deeply intuitive, creative, and compassionate. They have rich inner worlds and natural artistic gifts. Their challenge is learning to distinguish between genuine intuition and wishful thinking.',
    },
    {
      glyph: '♇',
      name: 'Pluto',
      domain: 'Transformation, death and rebirth, power, the unconscious, evolution',
      daily: 'When Pluto is active, superficial approaches fail. You are drawn to the deeper truth beneath surface appearances. Power dynamics become visible. Something may need to end so that something new can begin. Pluto transits are intense but always evolutionary \u2014 they strip away what is false and leave what is real.',
      orbital: 'Approximately 12 to 31 years per sign. Pluto has a highly elliptical orbit, spending much longer in some signs than others. Its transits transform entire generations.',
      frequency: '140.25 Hz',
      note: 'C#',
      chakra: 'Root centre',
      sound: 'Deep gongs, didgeridoo, very low frequency drones. Pluto energy is intense, primal, and transformative. Use sounds that vibrate in the bones and belly. The Pluto frequency supports deep shadow work, releasing trauma, and profound transformation. Use with care \u2014 this frequency moves what has been buried.',
      prominent: 'A strong Pluto placement indicates someone with intense depth, psychological insight, and the ability to transform crisis into growth. They see through pretence. Their challenge is learning that power shared freely is stronger than power held tightly.',
    },
  ],
  lt: [
    {
      glyph: '☉',
      name: 'Saulė',
      domain: 'Esminė tapatybė, gyvybingumas, gyvenimo tikslas, ego, sąmonė',
      daily: 'Kai Saulė yra pabrėžta aspektu ar ženklo pasikeitimu, jaučiate atnaujintą tikslo pojūtį. Jūsų pasitikėjimas savimi stiprėja. Tapatybės ir saviraiškos klausimai iškyla į paviršių. Pastebite, kas jus tikrai įkvepia, o ką darote tik iš įpročio.',
      orbital: 'Maždaug vienas mėnuo viename ženkle. Saulė baigia visą zodiako ciklą per metus, apibrėždama astrologinius sezonus.',
      frequency: '126.22 Hz',
      note: 'B',
      chakra: 'Saulės rezginys ir Širdies centras',
      sound: 'Tibetietiški dubenys, suderinti ties 126 Hz, saulės gongai. Saulės dažnis yra šiltas ir centruojantis. Jis padeda sustiprinti savojo „aš" pojūtį meditacijos metu. Naudokite jį seanso pradžioje, kad įžemintumėte žmogų jo paties tapatybėje.',
      prominent: 'Stipri Saulės pozicija rodo žmogų su natūraliomis lyderystės savybėmis, aiškiu savojo „aš" pojūčiu ir stipriu gyvybingumu. Jie linkę būti pastebimi. Jų iššūkis — suvokti, kad švietimas nereikalauja kitų užtemdymo.',
    },
    {
      glyph: '☽',
      name: 'Mėnulis',
      domain: 'Emocijos, instinktai, pasąmonė, globa, vidinis pasaulis',
      daily: 'Mėnulis nustato kiekvienos dienos emocinę temperatūrą. Kai Mėnulis keičia ženklą, galite pastebėti nuotaikos pokytį, neturintį akivaizdžios išorinės priežasties. Mėnulis valdo mūsų poreikį komfortui, saugumui ir priklausymui. Atkreipkite dėmesį į tai, ko nori jūsų kūnas ir širdis, ne tik į tai, ką sako protas.',
      orbital: 'Maždaug 2,5 dienos viename ženkle. Mėnulis yra greičiausiai judantis kūnas žemėlapyje, atliekantis pilną ciklą kas 29,5 dienos.',
      frequency: '210.42 Hz',
      note: 'G#',
      chakra: 'Kryžkaulio centras',
      sound: 'Mėnulio dažnis yra giliai raminantis. Kristaliniai dubenys, suderinti ties 210 Hz, vandenynų būgnai ir vandens tematikos garso peizažai rezonuoja su Mėnulio energija. Tai svarbiausias dažnis emocinės gydymo sesijoms. Naudokite, kai žmogui reikia apdoroti jausmus arba paleisti tai, ką jis laikė savyje.',
      prominent: 'Stipri Mėnulio pozicija rodo giliai intuityvų, emociškai turtingą ir globojantį žmogų. Jie sugeria aplinkinių jausmus. Jų iššūkis — suprasti, kad rūpinimasis kitais prasideda nuo rūpinimosi savimi.',
    },
    {
      glyph: '☿',
      name: 'Merkurijus',
      domain: 'Komunikacija, mąstymas, mokymasis, kelionės, technologijos',
      daily: 'Kai Merkurijus aktyvus, pokalbiai įgauna daugiau svarbos. Mąstote greičiau, rašote aiškiau ir kuriate ryšius tarp idėjų. Kai Merkurijus retrograduoja, nutinka priešingai — nesusipratimai, techninės klaidos, kelionių vėlavimai. Tai ne bausmės. Tai kvietimai sulėtėti ir peržiūrėti.',
      orbital: 'Maždaug 14–30 dienų viename ženkle. Merkurijus laikosi arti Saulės ir gali būti tik vienu ženklu priekyje arba atsilikęs nuo jos.',
      frequency: '141.27 Hz',
      note: 'C# / D',
      chakra: 'Gerklės centras',
      sound: 'Kamertono šakutės ties 141 Hz, vėjo varpeliai ir aukšto tono Tibeto dubenys. Merkurijaus energija yra greita ir lengva. Naudokite staccato ritmus ir šviesesnius tonus. Šis dažnis palaiko aiškią raišką ir protinį aiškumą seansų metu.',
      prominent: 'Stipri Merkurijaus pozicija rodo iškalbingą, smalsų ir protiškai judrų žmogų. Jie greitai apdoroja informaciją ir bendrauja tiksliai. Jų iššūkis — išmokti klausytis taip giliai, kaip kalba.',
    },
    {
      glyph: '♀',
      name: 'Venera',
      domain: 'Meilė, grožis, santykiai, vertybės, malonumas, menas',
      daily: 'Kai Venera aktyvi, jus traukia grožis, komfortas ir ryšys. Santykiai jaučiasi šiltesni. Labiau pastebite estetiką. Leidžiate laiką tam, kas teikia malonumą, o ne vien produktyvumui. Veneros dienos tinka kūrybiniam darbui, pasimatymams ir švelniam rūpinimuisi savimi.',
      orbital: 'Maždaug 23–60 dienų viename ženkle. Venera juda netolygiai ir gali ilgiau pasilikti ženkluose retrograduodama.',
      frequency: '221.23 Hz',
      note: 'A',
      chakra: 'Širdies ir Kryžkaulio centrai',
      sound: 'Tibetietiški dubenys, suderinti ties 221 Hz, arfa, švelnūs gongo skalavimai. Veneros energija yra švelni, šilta ir harmoniška. Naudokite ištęstus, tekančius tonus. Šis dažnis atveria širdį ir sušvelnina emocinę šarvuotę. Puikiai tinka santykių gydymo seansams ir savimeilės meditacijoms.',
      prominent: 'Stipri Veneros pozicija rodo žmogų su rafinuotu skoniu, natūraliu žavesiu ir giliu grožio vertinimu visomis formomis. Jie vertina harmoniją ir gali sunkiai susidoroti su konfliktu. Jų iššūkis — suprasti, kad tikra meilė kartais reikalauja nepatogaus sąžiningumo.',
    },
    {
      glyph: '♂',
      name: 'Marsas',
      domain: 'Varomoji jėga, energija, veiksmas, drąsa, konfliktas, seksualumas',
      daily: 'Kai Marsas aktyvus, jūsų energijos lygis pakyla. Jaučiatės ryžtingesni, labiau pasiruošę rizikuoti ir mažiau kantrūs dėl delsimo. Fizinis aktyvumas teikia pasitenkinimą. Ginčai gali kilti lengviau. Marsas nekuria konflikto — jis atskleidžia, kur jau jaučiatės nusivylę, ir suteikia drąsos veikti.',
      orbital: 'Maždaug 6–7 savaitės viename ženkle. Marsas kiekviename ženkle užsibūna pakankamai ilgai, kad nuodugniai aktyvuotų jo temas.',
      frequency: '144.72 Hz',
      note: 'D',
      chakra: 'Šaknies ir Saulės rezginio centrai',
      sound: 'Rėminiai būgnai, džembė, galingi gongo smūgiai. Marso energija yra pirmapradė ir ritmiška. Naudokite varomąjį ritmą ir žemesnius dažnius. Marso tonas aktyvuoja fizinę energiją ir padeda paleisti kūne sukauptą pyktį ar nusivylimą. Naudinga seansams, orientuotiems į įgalinimą ir ribų nustatymą.',
      prominent: 'Stipri Marso pozicija rodo žmogų su aukšta energija, natūralia drąsa ir varžymosi poreikiu. Jie imasi iniciatyvos ir nemėgsta pasyvumo. Jų iššūkis — suprasti, kad jėga apima ir gebėjimą sustoti.',
    },
    {
      glyph: '♃',
      name: 'Jupiteris',
      domain: 'Augimas, plėtra, sėkmė, išmintis, gausa, kelionės',
      daily: 'Kai Jupiteris pabrėžtas, atsiranda galimybės. Jūsų perspektyva plečiasi. Jaučiatės optimistiškesni ir dosnesni. Mokymasis teikia džiaugsmą. Yra rizika persitempti — Jupiteris nežino žodžio „pakanka". Saikingumas nėra jo stiprybė. Mėgaukitės plėtra, bet laikykite vieną koją ant žemės.',
      orbital: 'Maždaug vieneri metai viename ženkle. Jupiteris kiekviename ženkle užsibūna pakankamai ilgai, kad atneštų augimą tai kolektyvinės gyvenimo sričiai.',
      frequency: '183.58 Hz',
      note: 'F#',
      chakra: 'Karūnos centras',
      sound: 'Dideli dubenys, simfoniniai gongai ir erdvūs garso peizažai. Jupiterio energija yra didinga ir dosni. Naudokite sodrų, sluoksnuotą skambesį, užpildantį erdvę. Jupiterio dažnis palaiko gausos, dvasinio augimo ir filosofinės įžvalgos pojūčius. Puikiai tinka seansams, nukreiptiems į atvirumą galimybėms.',
      prominent: 'Stipri Jupiterio pozicija rodo natūraliai optimistišką, filosofišką ir dosnų žmogų. Juos traukia didelės idėjos, kelionės ir mokymas. Jų iššūkis — suprasti, kad ne kiekviena galimybė nusipelno „taip".',
    },
    {
      glyph: '♄',
      name: 'Saturnas',
      domain: 'Struktūra, disciplina, atsakomybė, apribojimai, karma, laikas',
      daily: 'Kai Saturnas aktyvus, ateina realybės patikros. Terminai jaučiasi sunkesni. Atsakomybių negalima išvengti. Tai nėra neigiama — Saturnas yra vyriausiasis mokytojas. Jis parodo, kur reikia kurti tvirtesnius pamatus. Diskomfortas, kurį jaučiate Saturno laikotarpiu, yra brendimo diskomfortas.',
      orbital: 'Maždaug 2,5 metų viename ženkle. Saturno tranzitai yra reikšmingi gyvenimo skyriai. Saturno sugrįžimas 29 metų amžiuje yra svarbus brandos etapas.',
      frequency: '147.85 Hz',
      note: 'D',
      chakra: 'Šaknies centras',
      sound: 'Gilūs Tibeto dubenys, monokordų dronai, žemi gongo tonai. Saturno energija yra lėta, sunki ir įžeminanti. Naudokite ištęstus, pasikartojantiems tonus. Saturno dažnis palaiko discipliną, kantrybę ir priėmimą. Naudinga seansams, orientuotiems į pasipriešinimo paleidimą ir struktūros priėmimą.',
      prominent: 'Stipri Saturno pozicija rodo atsakingą, drausmingą ir giliai subrendusį žmogų. Jie rimtai žiūri į įsipareigojimus ir pelno pagarbą nuoseklumu. Jų iššūkis — suprasti, kad nelankstumas nėra tas pats kaip stiprybė.',
    },
    {
      glyph: '♅',
      name: 'Uranas',
      domain: 'Revoliucija, inovacijos, staigūs pokyčiai, laisvė, prabudimas',
      daily: 'Kai Uranas aktyvus, tikėkitės netikėto. Rutinos griūva. Naujos idėjos ateina kaip žaibas. Jaučiate nerimą dėl visko, kas atrodo per daug nuspėjama. Urano energija jaudinanti, bet destabilizuojanti. Tai proveržio planeta — tačiau proveržiui reikia kažką sulaužyti.',
      orbital: 'Maždaug 7 metai viename ženkle. Urano tranzitai perkuria ištisas kolektyvinio gyvenimo sritis per ilgus laikotarpius.',
      frequency: '207.36 Hz',
      note: 'G#',
      chakra: 'Trečiosios akies centras',
      sound: 'Elektroniniai garso peizažai, tereminas, binauralieji ritmiai Beta diapazone. Urano energija yra elektriška ir nenuspėjama. Naudokite netradicines garso priemones ir netikėtus dažnių pokyčius. Urano dažnis skatina įžvalgą ir laužo mąstymo šablonus. Naudinga seansams, orientuotiems į kūrybinį problemų sprendimą.',
      prominent: 'Stipri Urano pozicija rodo originalų, nepriklausomą žmogų, besidominantį inovacijomis. Jie dažnai jaučiasi aplenkiantys savo laiką. Jų iššūkis — suprasti, kad laisvė be ryšio veda į izoliaciją.',
    },
    {
      glyph: '♆',
      name: 'Neptūnas',
      domain: 'Dvasingumas, sapnai, iliuzija, intuicija, transcendencija, atjauta',
      daily: 'Kai Neptūnas aktyvus, ribos tirpsta. Vaizduotė plečiasi. Galite jaustis kūrybiškesni, empatiškesni arba labiau sutrikę — kartais visa tai vienu metu. Neptūnas verčia racionalų protą jaustis nepatogiai, nes jis veikia jausmo ir intuicijos pagrindu. Pasitikėkite savo vidiniu žinojimu, bet svarbius sprendimus patikrinkite blaiviu mąstymu.',
      orbital: 'Maždaug 14 metų viename ženkle. Neptūno tranzitai yra kartų, ištirpdantys ir iš naujo kuriantys ištisus kultūrinius naratyvus.',
      frequency: '211.44 Hz',
      note: 'G#',
      chakra: 'Karūnos centras',
      sound: 'Gongo vonios, vandenynų būgnai, ambientiniai dronai, 432 Hz derinimas. Neptūno energija yra plati ir beformė. Naudokite ištęstus, bangomis plaunančius garsus be aštrių kraštų. Neptūno dažnis palaiko gilią meditaciją, dvasinį ryšį ir emocinį paleidimą. Tai pagrindinis dažnis transcendentiniams garso terapijos seansams.',
      prominent: 'Stipri Neptūno pozicija rodo giliai intuityvų, kūrybingą ir atjaučiantį žmogų. Jie turi turtingus vidinius pasaulius ir natūralių meninių gabumų. Jų iššūkis — išmokti atskirti tikrą intuiciją nuo pageidaujamo mąstymo.',
    },
    {
      glyph: '♇',
      name: 'Plutonas',
      domain: 'Transformacija, mirtis ir atgimimas, galia, pasąmonė, evoliucija',
      daily: 'Kai Plutonas aktyvus, paviršutiniški požiūriai nebeveikia. Jus traukia gilesnė tiesa po paviršiaus regimybe. Galios dinamika tampa matoma. Kažkas gali turėti baigtis, kad kažkas naujo galėtų prasidėti. Plutono tranzitai yra intensyvūs, bet visada evoliuciniai — jie nuplėšia tai, kas netikra, ir palieka tai, kas tikra.',
      orbital: 'Maždaug 12–31 metų viename ženkle. Plutonas turi labai eliptinę orbitą, kai kuriuose ženkluose užsibuvo daug ilgiau nei kituose. Jo tranzitai transformuoja ištisas kartas.',
      frequency: '140.25 Hz',
      note: 'C#',
      chakra: 'Šaknies centras',
      sound: 'Gilūs gongai, didžeridū, labai žemo dažnio dronai. Plutono energija yra intensyvi, pirmapradė ir transformuojanti. Naudokite garsus, kurie vibruoja kauluose ir pilve. Plutono dažnis palaiko gilų šešėlio darbą, traumos paleidimą ir giluminę transformaciją. Naudokite atsargiai — šis dažnis pajudina tai, kas buvo palaidota.',
      prominent: 'Stipri Plutono pozicija rodo žmogų su intensyviu gilumu, psichologine įžvalga ir gebėjimu krizę paversti augimu. Jie permato apsimetimą. Jų iššūkis — suprasti, kad laisvai dalijama galia yra stipresnė nei griežtai laikoma.',
    },
  ],
}

// ── Sign entries (12 zodiac signs) ───────────────────────

export interface SignData {
  glyph: string
  name: string
  dates: string
  element: string
  modality: string
  ruler: string
  themes: string
  body: string
  shadow: string
  sound: string
  cluster: string
}

export const signs: Record<Language, SignData[]> = {
  en: [
    {
      glyph: '♈',
      name: 'Aries',
      dates: '21 March – 19 April',
      element: 'Fire',
      modality: 'Cardinal',
      ruler: 'Mars',
      themes: 'Initiation, courage, independence, pioneering energy. Aries is the first sign \u2014 the spark that starts the fire. It represents raw will, the desire to begin, and the courage to act before thinking. Aries energy is direct, honest, and impatient with unnecessary complexity.',
      body: 'Head, face, adrenal glands',
      shadow: 'Impulsiveness, selfishness, anger, impatience. Aries can start many things and finish few. The shadow is acting without considering impact on others.',
      sound: '396 Hz solfeggio (liberation, releasing fear). Frame drums, fast rhythms, fire ceremony sounds. Aries responds to driving, energetic soundscapes that match its active nature. Use higher tempo binaural beats in the Beta range (14\u201330 Hz) to channel Aries energy productively.',
      cluster: 'When multiple planets transit Aries, collective energy becomes assertive and competitive. New projects launch. Patience runs thin. Leadership struggles emerge. It is a time for bold action, not careful planning.',
    },
    {
      glyph: '♉',
      name: 'Taurus',
      dates: '20 April – 20 May',
      element: 'Earth',
      modality: 'Fixed',
      ruler: 'Venus',
      themes: 'Stability, sensuality, values, material security, patience. Taurus is the builder \u2014 slow, steady, and deeply connected to the physical world. It represents what we value enough to nurture over time. Taurus energy is loyal, practical, and appreciates beauty in tangible forms.',
      body: 'Throat, neck, thyroid',
      shadow: 'Stubbornness, possessiveness, resistance to change, overindulgence. Taurus can hold on to things, people, and habits long past their usefulness. The shadow is confusing stability with stagnation.',
      sound: '417 Hz solfeggio (facilitating change). Monochord drones, crystal bowls in lower octaves, root frequency 256 Hz. Taurus responds to sustained, grounding tones that vibrate through the body. Use Alpha brainwave binaural beats (8\u201314 Hz) for deep relaxation.',
      cluster: 'When multiple planets transit Taurus, collective focus turns to finances, food, comfort, and security. The economy gets attention. People crave stability. Change happens slowly but permanently.',
    },
    {
      glyph: '♊',
      name: 'Gemini',
      dates: '21 May – 20 June',
      element: 'Air',
      modality: 'Mutable',
      ruler: 'Mercury',
      themes: 'Communication, curiosity, duality, versatility, connection. Gemini is the messenger \u2014 quick, sociable, and endlessly curious. It represents the mind\u2019s desire to understand everything by connecting to everything. Gemini energy is light, adaptable, and thrives on variety.',
      body: 'Hands, arms, lungs, nervous system',
      shadow: 'Superficiality, inconsistency, gossip, scattered energy. Gemini can know a little about everything and a lot about nothing. The shadow is mistaking information for understanding.',
      sound: '528 Hz solfeggio (transformation, DNA repair). Tuning forks, wind chimes, higher-pitched singing bowls. Gemini responds to bright, varied sounds with changing patterns. Use Alpha-Beta bridge binaural beats (12\u201315 Hz) for mental clarity without overstimulation.',
      cluster: 'When multiple planets transit Gemini, communication speeds up. Social media buzzes. People talk more than they listen. Information overload is real. It is a time for learning, networking, and exchanging ideas.',
    },
    {
      glyph: '♋',
      name: 'Cancer',
      dates: '21 June – 22 July',
      element: 'Water',
      modality: 'Cardinal',
      ruler: 'Moon',
      themes: 'Home, family, emotional security, nurturing, memory. Cancer is the protector \u2014 deeply caring, intuitive, and connected to ancestral roots. It represents our need to belong, to feel safe, and to care for others. Cancer energy is sensitive, receptive, and fiercely protective of what it loves.',
      body: 'Chest, breasts, stomach',
      shadow: 'Clinginess, moodiness, over-sensitivity, emotional manipulation. Cancer can use care as a form of control. The shadow is building walls instead of homes.',
      sound: '639 Hz solfeggio (connecting, relationships). Ocean drums, rain sticks, water sounds, gentle gong washes. Cancer responds to flowing, enveloping soundscapes that feel like being held. Use Theta binaural beats (4\u20138 Hz) for deep emotional processing.',
      cluster: 'When multiple planets transit Cancer, emotional themes dominate. Family matters surface. People nest and seek comfort. Nostalgia increases. It is a time for healing old wounds and strengthening bonds.',
    },
    {
      glyph: '♌',
      name: 'Leo',
      dates: '23 July – 22 August',
      element: 'Fire',
      modality: 'Fixed',
      ruler: 'Sun',
      themes: 'Self-expression, creativity, leadership, generosity, joy. Leo is the performer \u2014 warm, radiant, and unapologetically visible. It represents the creative force that makes life worth living. Leo energy is generous, dramatic, and lights up every room.',
      body: 'Heart, spine, upper back',
      shadow: 'Arrogance, attention-seeking, stubbornness, domination. Leo can mistake admiration for love. The shadow is needing an audience to feel real.',
      sound: '741 Hz solfeggio (expression, solutions). Sun gongs, heart-centred singing bowls, celebratory rhythms. Leo responds to warm, golden tones that feel regal and expansive. Use the Sun frequency (126.22 Hz) as a base drone for Leo-focused sessions.',
      cluster: 'When multiple planets transit Leo, creativity surges. People want recognition. Entertainment and art flourish. Egos can clash. It is a time for bold self-expression and sharing your gifts with confidence.',
    },
    {
      glyph: '♍',
      name: 'Virgo',
      dates: '23 August – 22 September',
      element: 'Earth',
      modality: 'Mutable',
      ruler: 'Mercury',
      themes: 'Service, analysis, health, refinement, practical wisdom. Virgo is the healer \u2014 precise, humble, and devoted to improvement. It represents the desire to be useful, to fix what is broken, and to serve something greater than yourself. Virgo energy is meticulous, kind, and quietly powerful.',
      body: 'Digestive system, intestines',
      shadow: 'Perfectionism, criticism, anxiety, overthinking. Virgo can become so focused on flaws that it misses the whole picture. The shadow is believing that nothing is ever good enough.',
      sound: '852 Hz solfeggio (returning to spiritual order). Precise tuning forks, crystal bowls, clean harmonic tones. Virgo responds to pure, orderly sounds with clear resonance. Use Mercury frequency (141.27 Hz) for mental clarity. Sessions should feel structured and intentional.',
      cluster: 'When multiple planets transit Virgo, attention turns to health, work routines, and practical improvement. People organise, declutter, and optimise. The collective becomes more critical but also more helpful.',
    },
    {
      glyph: '♎',
      name: 'Libra',
      dates: '23 September – 22 October',
      element: 'Air',
      modality: 'Cardinal',
      ruler: 'Venus',
      themes: 'Balance, harmony, partnership, justice, beauty. Libra is the diplomat \u2014 graceful, fair-minded, and deeply invested in how people relate to each other. It represents the desire for equilibrium and the understanding that beauty matters. Libra energy is charming, cooperative, and aesthetically sensitive.',
      body: 'Kidneys, lower back, skin',
      shadow: 'Indecisiveness, people-pleasing, avoidance of conflict, superficiality. Libra can sacrifice authenticity for the sake of peace. The shadow is keeping everyone happy except yourself.',
      sound: '639 Hz solfeggio (connecting, harmony). Harp, chimes, paired singing bowls tuned to intervals. Libra responds to harmonious, balanced soundscapes. Use Venus frequency (221.23 Hz) for relationship healing. Sessions should feel elegant and symmetrical.',
      cluster: 'When multiple planets transit Libra, relationship themes intensify. Partnerships form or dissolve. Justice and fairness become hot topics. Art and design get more attention. It is a time for negotiation and finding common ground.',
    },
    {
      glyph: '♏',
      name: 'Scorpio',
      dates: '23 October – 21 November',
      element: 'Water',
      modality: 'Fixed',
      ruler: 'Pluto (traditional: Mars)',
      themes: 'Transformation, depth, intensity, power, intimacy, truth. Scorpio is the alchemist \u2014 willing to go where others will not, to look at what others avoid. It represents the power of honest self-examination and the courage to transform. Scorpio energy is magnetic, perceptive, and unafraid of darkness.',
      body: 'Reproductive organs, elimination system',
      shadow: 'Obsession, jealousy, manipulation, vengefulness. Scorpio can weaponise its insight. The shadow is using knowledge of others as power over them.',
      sound: '174 Hz solfeggio (foundation, pain reduction). Deep gongs, didgeridoo, low-frequency drones. Scorpio responds to intense, penetrating sounds that reach into the body. Use Pluto frequency (140.25 Hz) for transformative sessions. These are sessions for shadow work and deep release.',
      cluster: 'When multiple planets transit Scorpio, hidden truths surface. Power dynamics become visible. Secrets emerge. Collective intensity rises. It is a time for honest reckoning and transformative healing.',
    },
    {
      glyph: '♐',
      name: 'Sagittarius',
      dates: '22 November – 21 December',
      element: 'Fire',
      modality: 'Mutable',
      ruler: 'Jupiter',
      themes: 'Exploration, philosophy, truth-seeking, adventure, expansion. Sagittarius is the seeker \u2014 restless, optimistic, and always looking over the next horizon. It represents the human drive to understand the meaning of life through experience. Sagittarius energy is enthusiastic, honest, and hungry for freedom.',
      body: 'Hips, thighs, liver',
      shadow: 'Recklessness, tactlessness, commitment-phobia, exaggeration. Sagittarius can mistake movement for progress. The shadow is running from depth under the guise of seeking breadth.',
      sound: '741 Hz solfeggio (expression, awakening intuition). Large symphonic gongs, world music instruments, expansive soundscapes. Sagittarius responds to grand, layered sounds that evoke wide open spaces. Use Jupiter frequency (183.58 Hz) for sessions focused on vision and possibility.',
      cluster: 'When multiple planets transit Sagittarius, the collective becomes more adventurous. Travel increases. Philosophy and religion get debated. Optimism rises but so does overconfidence. It is a time for expanding horizons and questioning assumptions.',
    },
    {
      glyph: '♑',
      name: 'Capricorn',
      dates: '22 December – 19 January',
      element: 'Earth',
      modality: 'Cardinal',
      ruler: 'Saturn',
      themes: 'Ambition, structure, authority, legacy, mastery. Capricorn is the builder of empires \u2014 patient, strategic, and willing to climb the mountain one step at a time. It represents the desire to create something lasting and earn genuine respect through consistent effort. Capricorn energy is disciplined, resourceful, and quietly powerful.',
      body: 'Bones, joints, knees, teeth',
      shadow: 'Workaholism, coldness, rigidity, status obsession. Capricorn can define self-worth entirely by achievement. The shadow is building a life that looks impressive but feels empty.',
      sound: '285 Hz solfeggio (influence, energy field healing). Deep Tibetan bowls, monochord, Saturn frequency drones. Capricorn responds to structured, repetitive, grounding sounds. Use Saturn frequency (147.85 Hz) for sessions focused on patience, discipline, and releasing control.',
      cluster: 'When multiple planets transit Capricorn, institutional structures come into focus. Careers advance or restructure. Authority is questioned and rebuilt. Hard work pays off. It is a time for building, not dreaming.',
    },
    {
      glyph: '♒',
      name: 'Aquarius',
      dates: '20 January – 18 February',
      element: 'Air',
      modality: 'Fixed',
      ruler: 'Uranus (traditional: Saturn)',
      themes: 'Innovation, community, humanitarian ideals, individuality, the future. Aquarius is the visionary \u2014 seeing possibilities that do not yet exist and working to bring them into reality. It represents the part of us that cares about the collective good and refuses to conform for the sake of it. Aquarius energy is progressive, independent, and sometimes deliberately eccentric.',
      body: 'Ankles, circulatory system, nervous system',
      shadow: 'Detachment, emotional coldness, contrarianism, elitism. Aquarius can love humanity in theory while struggling with humans in practice. The shadow is intellectualising feelings instead of feeling them.',
      sound: '963 Hz solfeggio (awakening, cosmic consciousness). Electronic instruments, binaural beats, unconventional sound sources. Aquarius responds to futuristic, unexpected sounds. Use Uranus frequency (207.36 Hz) for sessions focused on breaking patterns and embracing change.',
      cluster: 'When multiple planets transit Aquarius, social movements grow. Technology advances. People seek community around shared ideals. Convention gets challenged. It is a time for innovation and collective progress.',
    },
    {
      glyph: '♓',
      name: 'Pisces',
      dates: '19 February – 20 March',
      element: 'Water',
      modality: 'Mutable',
      ruler: 'Neptune (traditional: Jupiter)',
      themes: 'Transcendence, compassion, imagination, spirituality, dissolution of boundaries. Pisces is the mystic \u2014 feeling everything, connected to everything, and sometimes overwhelmed by everything. It represents the soul\u2019s desire to return to source, to dissolve the illusion of separateness. Pisces energy is deeply empathic, creative, and attuned to the invisible.',
      body: 'Feet, lymphatic system, pineal gland',
      shadow: 'Escapism, martyrdom, victim mentality, addiction, boundary dissolution. Pisces can lose itself in others\u2019 pain or in substances that dull its overwhelming sensitivity. The shadow is drowning in the ocean rather than learning to swim in it.',
      sound: '852 Hz solfeggio (intuition, inner vision). Gong baths, ocean drums, ambient drones, 432 Hz tuning, solfeggio frequencies. Pisces responds to formless, flowing soundscapes with no hard edges. Use Neptune frequency (211.44 Hz) for transcendent sessions. This is the sign most naturally attuned to sound healing.',
      cluster: 'When multiple planets transit Pisces, the collective becomes more sensitive, intuitive, and creative. Boundaries blur \u2014 between nations, between people, between reality and imagination. Spirituality increases. Confusion can also increase. It is a time for compassion, art, and letting go.',
    },
  ],
  lt: [
    {
      glyph: '♈',
      name: 'Avinas',
      dates: '21 kovo – 19 balandžio',
      element: 'Ugnis',
      modality: 'Kardinalus',
      ruler: 'Marsas',
      themes: 'Iniciatyvumas, drąsa, nepriklausomybė, pionieriškas entuziazmas. Avinas yra pirmasis ženklas — kibirkštis, uždeganti ugnį. Jis reprezentuoja grynąją valią, norą pradėti ir drąsą veikti prieš mąstant. Avino energija yra tiesioginė, sąžininga ir nekantri nereikalingam sudėtingumui.',
      body: 'Galva, veidas, antinksčiai',
      shadow: 'Impulsyvumas, savanaudiškumas, pyktis, nekantrumas. Avinas gali pradėti daug dalykų ir baigti nedaug. Šešėlis — veikimas nepaisant poveikio kitiems.',
      sound: '396 Hz solfedžio (išsilaisvinimas, baimės paleidimas). Rėminiai būgnai, greiti ritmai, ugnies ceremonijų garsai. Avinas reaguoja į energingus, veržlius garso peizažus, atitinkančius jo aktyvią prigimtį. Naudokite greitesnio tempo binauralius ritmus Beta diapazone (14–30 Hz), kad produktyviai nukreiptumėte Avino energiją.',
      cluster: 'Kai kelios planetos tranzituoja Aviną, kolektyvinė energija tampa ryžtingesnė ir konkurencingesnė. Startuoja nauji projektai. Kantrybė senka. Iškyla lyderystės kovos. Tai laikas drąsiam veiksmui, ne kruopščiam planavimui.',
    },
    {
      glyph: '♉',
      name: 'Jautis',
      dates: '20 balandžio – 20 gegužės',
      element: 'Žemė',
      modality: 'Fiksuotas',
      ruler: 'Venera',
      themes: 'Stabilumas, juslingumas, vertybės, materialus saugumas, kantrybė. Jautis yra statytojas — lėtas, pastovus ir giliai susijęs su fiziniu pasauliu. Jis reprezentuoja tai, ką mes pakankamai vertiname, kad puoselėtume laikui bėgant. Jaučio energija yra lojali, praktiška ir vertina grožį apčiuopiamomis formomis.',
      body: 'Gerklė, kaklas, skydliaukė',
      shadow: 'Užsispyrimas, savininkiškumas, pasipriešinimas pokyčiams, nesusilaikymas. Jautis gali laikytis daiktų, žmonių ir įpročių ilgai praėjus jų naudingumui. Šešėlis — stabilumo painiojimas su stagnacija.',
      sound: '417 Hz solfedžio (pokyčių palengvinimas). Monokordų dronai, kristaliniai dubenys žemesnėse oktavose, šakninis dažnis 256 Hz. Jautis reaguoja į ištęstus, įžeminančius tonus, vibruojančius per kūną. Naudokite Alfa smegenų bangų binauralius ritmus (8–14 Hz) giliam atsipalaidavimui.',
      cluster: 'Kai kelios planetos tranzituoja Jautį, kolektyvinis dėmesys krypsta į finansus, maistą, komfortą ir saugumą. Ekonomika sulaukia dėmesio. Žmonės trokšta stabilumo. Pokyčiai vyksta lėtai, bet negrįžtamai.',
    },
    {
      glyph: '♊',
      name: 'Dvyniai',
      dates: '21 gegužės – 20 birželio',
      element: 'Oras',
      modality: 'Kintamas',
      ruler: 'Merkurijus',
      themes: 'Komunikacija, smalsumas, dvilypumas, universalumas, ryšys. Dvyniai yra pasiuntinys — greitas, draugiškas ir begaliniai smalsus. Jis reprezentuoja proto norą viską suprasti per sąsajas su viskuo. Dvynių energija yra lengva, prisitaikanti ir klesti įvairovėje.',
      body: 'Rankos, plaštakos, plaučiai, nervų sistema',
      shadow: 'Paviršutiniškumas, nenuoseklumas, apkalbos, išsibarsčiusi energija. Dvyniai gali žinoti šiek tiek apie viską ir daug apie nieką. Šešėlis — informacijos painiojimas su supratimu.',
      sound: '528 Hz solfedžio (transformacija, DNR atstatymas). Kamertono šakutės, vėjo varpeliai, aukštesnio tono dubenys. Dvyniai reaguoja į šviesius, įvairius garsus su besikeičiančiais šablonais. Naudokite Alfa-Beta tilto binauralius ritmus (12–15 Hz) protiniam aiškumui be perstimuliacijos.',
      cluster: 'Kai kelios planetos tranzituoja Dvynius, komunikacija paspartėja. Socialiniai tinklai ūžia. Žmonės daugiau kalba nei klausosi. Informacinis perteklius tampa realus. Tai laikas mokymuisi, tinklaveikai ir idėjų mainams.',
    },
    {
      glyph: '♋',
      name: 'Vėžys',
      dates: '21 birželio – 22 liepos',
      element: 'Vanduo',
      modality: 'Kardinalus',
      ruler: 'Mėnulis',
      themes: 'Namai, šeima, emocinis saugumas, globa, atmintis. Vėžys yra saugotojas — giliai besirūpinantis, intuityvus ir susijęs su protėvių šaknimis. Jis reprezentuoja mūsų poreikį priklausyti, jaustis saugiai ir rūpintis kitais. Vėžio energija yra jautri, imlì ir aistringai saugo tai, ką myli.',
      body: 'Krūtinė, krūtys, skrandis',
      shadow: 'Prisirišimas, nuotaikų kaita, pernelyg didelis jautrumas, emocinis manipuliavimas. Vėžys gali naudoti rūpestį kaip kontrolės formą. Šešėlis — sienų, o ne namų statymas.',
      sound: '639 Hz solfedžio (sujungimas, santykiai). Vandenynų būgnai, lietaus lazdelės, vandens garsai, švelnūs gongo skalavimai. Vėžys reaguoja į tekančius, gaubiančius garso peizažus, kurie primena apkabinimą. Naudokite Teta binauralius ritmus (4–8 Hz) giliam emociniam apdorojimui.',
      cluster: 'Kai kelios planetos tranzituoja Vėžį, dominuoja emocinės temos. Iškyla šeimos reikalai. Žmonės lizdoja ir ieško komforto. Nostalgija stiprėja. Tai laikas senų žaizdų gydymui ir ryšių stiprinimui.',
    },
    {
      glyph: '♌',
      name: 'Liūtas',
      dates: '23 liepos – 22 rugpjūčio',
      element: 'Ugnis',
      modality: 'Fiksuotas',
      ruler: 'Saulė',
      themes: 'Saviraiška, kūrybiškumas, lyderystė, dosnumas, džiaugsmas. Liūtas yra atlikėjas — šiltas, spinduliuojantis ir nesidrovinantis būti matomas. Jis reprezentuoja kūrybinę jėgą, dėl kurios gyvenimas vertas gyventi. Liūto energija yra dosni, dramatiška ir nušviečia kiekvieną kambarį.',
      body: 'Širdis, stuburas, viršutinė nugaros dalis',
      shadow: 'Arogancija, dėmesio ieškojimas, užsispyrimas, dominavimas. Liūtas gali supainioti susižavėjimą su meile. Šešėlis — auditorijos poreikis, kad jaustumei save tikru.',
      sound: '741 Hz solfedžio (raiška, sprendimai). Saulės gongai, širdies centro dubenys, šventiniai ritmai. Liūtas reaguoja į šiltus, auksinius tonus, kurie jaučiasi karališkai ir erdviai. Naudokite Saulės dažnį (126.22 Hz) kaip bazinį droną Liūtui skirtuose seansuose.',
      cluster: 'Kai kelios planetos tranzituoja Liūtą, kūrybiškumas šauna aukštyn. Žmonės nori pripažinimo. Pramogos ir menas klesti. Ego gali susidurti. Tai laikas drąsiai saviraiškiai ir savo dovanų dalijimui su pasitikėjimu.',
    },
    {
      glyph: '♍',
      name: 'Mergelė',
      dates: '23 rugpjūčio – 22 rugsėjo',
      element: 'Žemė',
      modality: 'Kintamas',
      ruler: 'Merkurijus',
      themes: 'Tarnavimas, analizė, sveikata, tobulinimas, praktinė išmintis. Mergelė yra gydytoja — tiksli, kukli ir atsidavusi tobulėjimui. Ji reprezentuoja norą būti naudingam, taisyti tai, kas sugedę, ir tarnauti kažkam didesniam už save. Mergelės energija yra kruopšti, maloni ir tyliai galinga.',
      body: 'Virškinimo sistema, žarnos',
      shadow: 'Perfekcionizmas, kritiškumas, nerimas, per didelis mąstymas. Mergelė gali tapti tokia susikoncentravusi į trūkumus, kad praleidžia bendrą vaizdą. Šešėlis — tikėjimas, kad niekas niekada nėra pakankamai gerai.',
      sound: '852 Hz solfedžio (grįžimas į dvasinę tvarką). Tikslios kamertono šakutės, kristaliniai dubenys, švarūs harmoniniai tonai. Mergelė reaguoja į grynus, tvarkingus garsus su aiškiu rezonansu. Naudokite Merkurijaus dažnį (141.27 Hz) protiniam aiškumui. Seansai turėtų būti struktūruoti ir sąmoningi.',
      cluster: 'Kai kelios planetos tranzituoja Mergelę, dėmesys krypsta į sveikatą, darbo rutiną ir praktinį tobulėjimą. Žmonės organizuoja, pertvarko ir optimizuoja. Kolektyvas tampa kritiškesnis, bet ir labiau padedantis.',
    },
    {
      glyph: '♎',
      name: 'Svarstyklės',
      dates: '23 rugsėjo – 22 spalio',
      element: 'Oras',
      modality: 'Kardinalus',
      ruler: 'Venera',
      themes: 'Pusiausvyra, harmonija, partnerystė, teisingumas, grožis. Svarstyklės yra diplomatas — grakštus, sąžiningas ir giliai investuojantis į tai, kaip žmonės sąveikauja. Jos reprezentuoja pusiausvyros troškimą ir supratimą, kad grožis yra svarbu. Svarstyklių energija yra žavi, bendradarbiaujanti ir estetiškai jautri.',
      body: 'Inkstai, apatinė nugaros dalis, oda',
      shadow: 'Neryžtingumas, pataikavimas, konflikto vengimas, paviršutiniškumas. Svarstyklės gali paaukoti autentiškumą dėl ramybės. Šešėlis — visų laimingų laikymas, išskyrus save.',
      sound: '639 Hz solfedžio (sujungimas, harmonija). Arfa, varpeliai, poromis suderinti dubenys intervalais. Svarstyklės reaguoja į harmoningus, subalansuotus garso peizažus. Naudokite Veneros dažnį (221.23 Hz) santykių gydymui. Seansai turėtų jaustis elegantiškai ir simetriškai.',
      cluster: 'Kai kelios planetos tranzituoja Svarstykles, santykių temos sustiprėja. Partnerystės užsimezga arba nutrūksta. Teisingumas ir sąžiningumas tampa karštomis temomis. Menas ir dizainas sulaukia daugiau dėmesio. Tai laikas deryboms ir bendrų pagrindų paieškai.',
    },
    {
      glyph: '♏',
      name: 'Skorpionas',
      dates: '23 spalio – 21 lapkričio',
      element: 'Vanduo',
      modality: 'Fiksuotas',
      ruler: 'Plutonas (tradicinis: Marsas)',
      themes: 'Transformacija, gilumas, intensyvumas, galia, intymumas, tiesa. Skorpionas yra alchemikas — pasiryžęs eiti ten, kur kiti nedrįsta, žiūrėti į tai, ko kiti vengia. Jis reprezentuoja sąžiningo savęs tyrinėjimo galią ir drąsą transformuotis. Skorpiono energija yra magnetiška, įžvalgi ir nebijanti tamsos.',
      body: 'Reprodukciniai organai, šalinimo sistema',
      shadow: 'Apsėdimas, pavydas, manipuliavimas, kerštas. Skorpionas gali savo įžvalgą paversti ginklu. Šešėlis — kitų pažinimo naudojimas kaip galia prieš juos.',
      sound: '174 Hz solfedžio (pamatai, skausmo mažinimas). Gilūs gongai, didžeridū, žemo dažnio dronai. Skorpionas reaguoja į intensyvius, prasiskverbiančius garsus, pasiekiančius kūno gilumą. Naudokite Plutono dažnį (140.25 Hz) transformuojantiems seansams. Tai seansai šešėlio darbui ir giliam paleidimui.',
      cluster: 'Kai kelios planetos tranzituoja Skorpioną, paslėptos tiesos iškyla į paviršių. Galios dinamika tampa matoma. Paslaptys atsiskleidžia. Kolektyvinis intensyvumas auga. Tai laikas sąžiningam atsiskaitymui ir transformuojančiam gydymui.',
    },
    {
      glyph: '♐',
      name: 'Šaulys',
      dates: '22 lapkričio – 21 gruodžio',
      element: 'Ugnis',
      modality: 'Kintamas',
      ruler: 'Jupiteris',
      themes: 'Tyrinėjimas, filosofija, tiesos paieška, nuotykis, plėtra. Šaulys yra ieškotojas — nerimstantis, optimistiškas ir visada žvelgiantis už kito horizonto. Jis reprezentuoja žmogišką polinkį suprasti gyvenimo prasmę per patirtį. Šaulio energija yra entuziastinga, sąžininga ir alkstanti laisvės.',
      body: 'Klubai, šlaunys, kepenys',
      shadow: 'Neatsargumas, netaktiškumas, įsipareigojimų baimė, perdėjimas. Šaulys gali supainioti judėjimą su progresu. Šešėlis — bėgimas nuo gilumo prisidengiant pločio paieška.',
      sound: '741 Hz solfedžio (raiška, intuicijos žadinimas). Dideli simfoniniai gongai, pasaulio muzikos instrumentai, erdvūs garso peizažai. Šaulys reaguoja į didingus, sluoksniuotus garsus, sukuriančius plačių atvirų erdvių pojūtį. Naudokite Jupiterio dažnį (183.58 Hz) seansams, orientuotiems į viziją ir galimybes.',
      cluster: 'Kai kelios planetos tranzituoja Šaulį, kolektyvas tampa nuotykingesnias. Kelionių daugėja. Filosofija ir religija diskutuojamos. Optimizmas auga, bet kartu ir per didelis pasitikėjimas savimi. Tai laikas horizontų plėtimui ir prielaidų kvestionavimui.',
    },
    {
      glyph: '♑',
      name: 'Ožiaragis',
      dates: '22 gruodžio – 19 sausio',
      element: 'Žemė',
      modality: 'Kardinalus',
      ruler: 'Saturnas',
      themes: 'Ambicija, struktūra, autoritetas, palikimas, meistriškumas. Ožiaragis yra imperijų statytojas — kantrus, strategiškas ir pasiruošęs kopti kalnu po vieną žingsnį. Jis reprezentuoja norą sukurti kažką ilgaamžio ir pelnyti tikrą pagarbą per nuoseklias pastangas. Ožiaragio energija yra drausminga, sumani ir tyliai galinga.',
      body: 'Kaulai, sąnariai, keliai, dantys',
      shadow: 'Darboholizmas, šaltumas, nelankstumas, statuso obsesija. Ožiaragis gali apibrėžti savo vertę vien per pasiekimus. Šešėlis — gyvenimo, kuris atrodo įspūdingai, bet jaučiasi tuščiai, kūrimas.',
      sound: '285 Hz solfedžio (įtaka, energinio lauko gydymas). Gilūs Tibeto dubenys, monokordas, Saturno dažnio dronai. Ožiaragis reaguoja į struktūruotus, pasikartojantiems, įžeminančius garsus. Naudokite Saturno dažnį (147.85 Hz) seansams, orientuotiems į kantrybę, discipliną ir kontrolės paleidimą.',
      cluster: 'Kai kelios planetos tranzituoja Ožiaragį, institucinės struktūros atsiduria dėmesio centre. Karjeros žengia pirmyn arba persitvarko. Autoritetas kvestionuojamas ir atkuriamas. Sunkus darbas atsiperka. Tai laikas statybai, ne svajojimui.',
    },
    {
      glyph: '♒',
      name: 'Vandenis',
      dates: '20 sausio – 18 vasario',
      element: 'Oras',
      modality: 'Fiksuotas',
      ruler: 'Uranas (tradicinis: Saturnas)',
      themes: 'Inovacijos, bendruomenė, humanitariniai idealai, individualumas, ateitis. Vandenis yra vizionierius — matantis galimybes, kurių dar nėra, ir dirbantis, kad jos taptų realybe. Jis reprezentuoja tą mūsų dalį, kuri rūpinasi kolektyvine gerove ir atsisako konformuotis dėl pačio konformizmo. Vandenio energija yra progresyvi, nepriklausoma ir kartais sąmoningai ekscentriška.',
      body: 'Kulkšnys, kraujotakos sistema, nervų sistema',
      shadow: 'Atsiribojimas, emocinis šaltumas, priešgyniavimas, elitizmas. Vandenis gali mylėti žmoniją teoriškai, bet sunkiai susidoroti su žmonėmis praktiškai. Šešėlis — jausmų intelektualizavimas vietoj jų jutimo.',
      sound: '963 Hz solfedžio (pabudimas, kosminė sąmonė). Elektroniniai instrumentai, binauralieji ritmiai, netradiciniai garso šaltiniai. Vandenis reaguoja į futuristinius, netikėtus garsus. Naudokite Urano dažnį (207.36 Hz) seansams, orientuotiems į šablonų laužymą ir pokyčių priėmimą.',
      cluster: 'Kai kelios planetos tranzituoja Vandenį, socialiniai judėjimai auga. Technologijos žengia pirmyn. Žmonės ieško bendruomenės aplink bendrus idealus. Konvencijos kvestionuojamos. Tai laikas inovacijoms ir kolektyvinei pažangai.',
    },
    {
      glyph: '♓',
      name: 'Žuvys',
      dates: '19 vasario – 20 kovo',
      element: 'Vanduo',
      modality: 'Kintamas',
      ruler: 'Neptūnas (tradicinis: Jupiteris)',
      themes: 'Transcendencija, atjauta, vaizduotė, dvasingumas, ribų ištirpimas. Žuvys yra mistikas — jaučiantis viską, susijęs su viskuo ir kartais prislėgtas visko. Jos reprezentuoja sielos troškimą grįžti prie šaltinio, ištirpdyti atskirtumo iliuziją. Žuvų energija yra giliai empatiška, kūrybiška ir suderinta su nematomybe.',
      body: 'Pėdos, limfinė sistema, kankorėžinė liauka',
      shadow: 'Eskapizmas, kankinystė, aukos mentalitetas, priklausomybė, ribų ištirpimas. Žuvys gali pasimesti kitų skausme arba medžiagose, slopinančiose jų nepakeliamai jautrumą. Šešėlis — skandinimasis vandenyne, užuot mokantis jame plaukti.',
      sound: '852 Hz solfedžio (intuicija, vidinis regėjimas). Gongo vonios, vandenynų būgnai, ambientiniai dronai, 432 Hz derinimas, solfedžio dažniai. Žuvys reaguoja į beformius, tekančius garso peizažus be aštrių kraštų. Naudokite Neptūno dažnį (211.44 Hz) transcendentiniams seansams. Tai ženklas, natūraliausiai suderintas su garso terapija.',
      cluster: 'Kai kelios planetos tranzituoja Žuvis, kolektyvas tampa jautresnis, intuityvesnis ir kūrybiškesnis. Ribos nusitrina — tarp tautų, tarp žmonių, tarp realybės ir vaizduotės. Dvasingumas didėja. Sumišimas taip pat gali didėti. Tai laikas atjautai, menui ir paleidimui.',
    },
  ],
}

// ── Reading guide section ────────────────────────────────

export const readingGuideTitle: Record<Language, string> = {
  en: 'How to Read a Daily Chart',
  lt: 'Kaip Skaityti Dienos Žemėlapį',
}

export const readingGuideIntro: Record<Language, string> = {
  en: 'A practical guide for using Astrara\u2019s data to give someone a daily reading. Follow these steps in order for a thorough, grounded interpretation.',
  lt: 'Praktinis vadovas, kaip naudoti Astrara duomenis dienos skaitymui. Sekite šiuos žingsnius eilės tvarka, kad gautumėte nuodugnią, pagrįstą interpretaciją.',
}

export interface StepData {
  number: number
  title: string
  content: string
}

export const readingSteps: Record<Language, StepData[]> = {
  en: [
    {
      number: 1,
      title: 'Check the Sun sign',
      content: 'What season are we in? What sign is the Sun illuminating? This sets the overall background energy for everyone. The Sun sign is the broadest brush stroke \u2014 it tells you the theme that colours all of life right now. When the Sun enters a new sign, the collective mood shifts.',
    },
    {
      number: 2,
      title: 'Check the Moon sign and phase',
      content: 'The Moon moves fastest and sets the emotional tone of each day. A Full Moon amplifies and reveals \u2014 emotions are louder, truths come to light, and what has been building reaches a peak. A New Moon invites fresh starts \u2014 it is a quiet, inward time for planting seeds. The Moon\u2019s sign colours HOW we feel: a Moon in Aries feels urgent; a Moon in Pisces feels dreamy; a Moon in Capricorn feels serious.',
    },
    {
      number: 3,
      title: 'Look at planet clusters',
      content: 'Are multiple planets gathered in one or two signs? This creates a stellium \u2014 concentrated energy in that area of life. The more planets in one sign, the more intense that sign\u2019s themes become for everyone. Three or more planets in the same sign is significant. Four or more is rare and powerful.',
    },
    {
      number: 4,
      title: 'Check for oppositions and squares',
      content: 'Planets opposite each other (180\u00b0) create tension and awareness. They force you to see both sides of a situation. Planets square each other (90\u00b0) create friction and motivation to act. These are where the drama and growth happen. Do not treat them as negative \u2014 they are the engine of change.',
    },
    {
      number: 5,
      title: 'Note the slow movers',
      content: 'Jupiter, Saturn, Uranus, Neptune, and Pluto move slowly and set the generational backdrop. Their sign placements are the deep currents that affect everyone for months or years. When a slow mover changes sign, it is a collective turning point. When two slow movers form an aspect to each other, it is a once-in-a-generation event.',
    },
    {
      number: 6,
      title: 'Personalise for the person\u2019s sign',
      content: 'For a specific person, look at what planets are transiting through their Sun sign, opposing their sign, and squaring their sign. This tells you how intensely today\u2019s energy affects them personally. A day with the Moon in someone\u2019s sign feels deeply personal to them, even if it is barely noticed by others.',
    },
    {
      number: 7,
      title: 'Add the Earth data',
      content: 'High Kp index (5+) means the geomagnetic field is disturbed \u2014 many people report poor sleep, heightened emotions, headaches, and restlessness. Solar flares can amplify sensitivity. Sound healing sessions may feel more intense during geomagnetic storms. Mention this to clients if the Kp is elevated \u2014 it helps them understand that some of what they feel has a physical, measurable cause.',
    },
    {
      number: 8,
      title: 'Choose the sound',
      content: 'Use the Moon sign to determine the drone frequency \u2014 the Moon sets the emotional tone, so the sound should resonate with it. Use the overall energy level to choose binaural beat speed: calm days call for Theta (4\u20138 Hz), active days call for Alpha (8\u201314 Hz), intense days can use Beta (14\u201330 Hz). Use the dominant element (Fire, Earth, Air, Water) to select instruments \u2014 each element has its own sound palette.',
    },
  ],
  lt: [
    {
      number: 1,
      title: 'Patikrinkite Saulės ženklą',
      content: 'Koks sezonas dabar? Kokį ženklą apšviečia Saulė? Tai nustato bendrą foninę energiją visiems. Saulės ženklas yra plačiausias potėpis — jis parodo temą, kuri spalvina visą gyvenimą šiuo metu. Kai Saulė įeina į naują ženklą, kolektyvinė nuotaika pasikeičia.',
    },
    {
      number: 2,
      title: 'Patikrinkite Mėnulio ženklą ir fazę',
      content: 'Mėnulis juda greičiausiai ir nustato kiekvienos dienos emocinį toną. Pilnatis sustiprina ir atskleidžia — emocijos garsesnės, tiesos išaiškėja, ir tai, kas buvo kaupiama, pasiekia viršūnę. Jaunatis kviečia naujai pradžiai — tai ramus, vidinis laikas sėjimui. Mėnulio ženklas nuspalvina, KAIP jaučiamės: Mėnulis Avine jaučiasi skubus; Mėnulis Žuvyse — svajingas; Mėnulis Ožiaragyje — rimtas.',
    },
    {
      number: 3,
      title: 'Pažiūrėkite planetų sankaupas',
      content: 'Ar keli planetos susitelkę viename ar dviejuose ženkluose? Tai sukuria steliumą — sukoncentruotą energiją toje gyvenimo srityje. Kuo daugiau planetų viename ženkle, tuo intensyvesnės to ženklo temos tampa visiems. Trys ar daugiau planetų tame pačiame ženkle yra reikšminga. Keturios ar daugiau — reta ir galinga.',
    },
    {
      number: 4,
      title: 'Patikrinkite opozicijas ir kvadratūras',
      content: 'Planetos, esančios viena priešais kitą (180°), kuria įtampą ir sąmoningumą. Jos verčia matyti abi situacijos puses. Planetos kvadratūroje (90°) kuria trintį ir motyvaciją veikti. Čia vyksta drama ir augimas. Nelaikykite jų neigiamais — tai pokyčių variklis.',
    },
    {
      number: 5,
      title: 'Atkreipkite dėmesį į lėtąsias planetas',
      content: 'Jupiteris, Saturnas, Uranas, Neptūnas ir Plutonas juda lėtai ir nustato kartų foną. Jų pozicijos ženkluose yra giluminės srovės, veikiančios visus mėnesius ar metus. Kai lėtoji planeta keičia ženklą, tai kolektyvinis lūžio taškas. Kai dvi lėtosios planetos suformuoja aspektą tarpusavyje, tai kartą per kartą pasitaikantis įvykis.',
    },
    {
      number: 6,
      title: 'Pritaikykite žmogaus ženklui',
      content: 'Konkrečiam žmogui pažiūrėkite, kokios planetos tranzituoja per jo Saulės ženklą, oponuoja jo ženklui ir yra kvadratūroje su jo ženklu. Tai parodo, kaip intensyviai šiandienos energija veikia jį asmeniškai. Diena su Mėnuliu kažkieno ženkle jaučiasi jam giliai asmeniškai, net jei kiti to beveik nepastebi.',
    },
    {
      number: 7,
      title: 'Pridėkite Žemės duomenis',
      content: 'Aukštas Kp indeksas (5+) reiškia, kad geomagnetinis laukas yra sutrikdytas — daugelis žmonių praneša apie blogą miegą, sustiprėjusias emocijas, galvos skausmą ir nerimą. Saulės žybsniai gali sustiprinti jautrumą. Garso terapijos seansai gali jaustis intensyvesni geomagnetinių audrų metu. Paminėkite tai klientams, jei Kp yra padidėjęs — tai padeda jiems suprasti, kad dalis to, ką jie jaučia, turi fizinę, išmatuojamą priežastį.',
    },
    {
      number: 8,
      title: 'Pasirinkite garsą',
      content: 'Naudokite Mėnulio ženklą drono dažniui nustatyti — Mėnulis nustato emocinį toną, todėl garsas turėtų su juo rezonuoti. Naudokite bendrą energijos lygį binauralio ritmo greičio pasirinkimui: ramios dienos kviečia Teta (4–8 Hz), aktyvios dienos — Alfa (8–14 Hz), intensyvios dienos gali naudoti Beta (14–30 Hz). Naudokite dominuojančią stichiją (Ugnis, Žemė, Oras, Vanduo) instrumentų pasirinkimui — kiekviena stichija turi savo garso paletę.',
    },
  ],
}

// ── Aspects section ──────────────────────────────────────

export const aspectsTitle: Record<Language, string> = {
  en: 'Planetary Aspects Explained',
  lt: 'Planetų Aspektai',
}

export interface AspectData {
  angle: string
  name: string
  description: string
}

export const aspects: Record<Language, AspectData[]> = {
  en: [
    {
      angle: '0°',
      name: 'Conjunction',
      description: 'Planets in the same sign. Their energies merge and amplify each other. Like two musicians playing the same note \u2014 powerful and focused. Conjunctions concentrate energy. The planets involved lose some individual identity and create something new together. A Sun-Mars conjunction feels like willpower on fire. A Venus-Saturn conjunction feels like love getting serious.',
    },
    {
      angle: '60°',
      name: 'Sextile',
      description: 'Planets two signs apart. A harmonious, supportive connection. Opportunities that require a small effort to activate. Sextiles are gentle nudges \u2014 they do not force anything, but they make certain paths easier. You have to notice them and act. A Mercury-Jupiter sextile opens doors for learning, but you have to walk through them.',
    },
    {
      angle: '90°',
      name: 'Square',
      description: 'Planets three signs apart. Friction, tension, challenge. These are growth aspects \u2014 uncomfortable but productive. Squares force you to act because the status quo becomes unbearable. They are the most dynamic aspects in astrology. A Moon-Saturn square feels emotionally heavy, but it builds emotional resilience.',
    },
    {
      angle: '120°',
      name: 'Trine',
      description: 'Planets four signs apart. Natural harmony and flow. Talents and gifts that come easily. Trines feel good but can also mean complacency \u2014 when everything flows, there is less motivation to push. A Venus-Neptune trine gives effortless creativity and romantic idealism, but may lack practical grounding.',
    },
    {
      angle: '180°',
      name: 'Opposition',
      description: 'Planets six signs apart. Awareness, polarity, balance. Forces you to see both sides. Oppositions often manifest through relationships and external events \u2014 other people embody the energy you are not expressing. A Sun-Moon opposition (Full Moon) illuminates what was hidden and demands integration of two opposing needs.',
    },
  ],
  lt: [
    {
      angle: '0°',
      name: 'Konjunkcija',
      description: 'Planetos tame pačiame ženkle. Jų energijos susilieja ir sustiprina viena kitą. Kaip du muzikantai, grojantys tą pačią natą — galinga ir sutelkta. Konjunkcijos sukoncentruoja energiją. Dalyvaujančios planetos praranda dalį individualios tapatybės ir kartu sukuria kažką nauja. Saulės ir Marso konjunkcija jaučiasi kaip valios galia ugnyje. Veneros ir Saturno konjunkcija jaučiasi kaip meilė, tampanti rimta.',
    },
    {
      angle: '60°',
      name: 'Sekstilis',
      description: 'Planetos per du ženklus viena nuo kitos. Harmoningas, palaikantis ryšys. Galimybės, kurioms aktyvuoti reikia nedidelio pastangų. Sekstiliai yra švelnūs postūmiai — jie nieko neverčia, bet palengvina tam tikrus kelius. Turite juos pastebėti ir veikti. Merkurijaus ir Jupiterio sekstilis atveria duris mokymuisi, bet jūs turite pro jas praeiti.',
    },
    {
      angle: '90°',
      name: 'Kvadratūra',
      description: 'Planetos per tris ženklus viena nuo kitos. Trintis, įtampa, iššūkis. Tai augimo aspektai — nepatogūs, bet produktyvūs. Kvadratūros verčia jus veikti, nes status quo tampa nepakeliamas. Tai patys dinamiškiausi aspektai astrologijoje. Mėnulio ir Saturno kvadratūra jaučiasi emociškai sunki, bet ugdo emocinį atsparumą.',
    },
    {
      angle: '120°',
      name: 'Trinas',
      description: 'Planetos per keturis ženklus viena nuo kitos. Natūrali harmonija ir tėkmė. Talentai ir dovanos, kurios ateina lengvai. Trinai jaučiasi gerai, bet gali reikšti ir pasyvumą — kai viskas teka, mažiau motyvacijos stumti. Veneros ir Neptūno trinas suteikia lengvą kūrybiškumą ir romantišką idealizmą, bet gali stokoti praktinio pagrindo.',
    },
    {
      angle: '180°',
      name: 'Opozicija',
      description: 'Planetos per šešis ženklus viena nuo kitos. Sąmoningumas, poliariškumas, pusiausvyra. Verčia matyti abi puses. Opozicijos dažnai pasireiškia per santykius ir išorinius įvykius — kiti žmonės įkūnija energiją, kurios jūs nereiškiate. Saulės ir Mėnulio opozicija (Pilnatis) apšviečia tai, kas buvo paslėpta, ir reikalauja dviejų priešingų poreikių integracijos.',
    },
  ],
}

// ── Elements section ─────────────────────────────────────

export const elementsTitle: Record<Language, string> = {
  en: 'Elements and Their Sound Connections',
  lt: 'Stichijos ir Jų Garso Sąsajos',
}

export interface ElementData {
  element: string
  signs: string
  description: string
  brainwave: string
  instruments: string
  frequencies: string
}

export const elements: Record<Language, ElementData[]> = {
  en: [
    {
      element: 'Fire',
      signs: 'Aries, Leo, Sagittarius',
      description: 'High energy, activation, inspiration. Fire energy is warm, bright, and upward-moving. It wants to DO. In sound healing, fire energy calls for rhythmic, energising sounds that move the body and ignite the spirit.',
      brainwave: 'Beta brainwaves (14\u201330 Hz binaural beats)',
      instruments: 'Frame drums, djembe, didgeridoo, fire gong, rapid rhythmic patterns',
      frequencies: 'Higher tempo, driving beats. Mars frequency (144.72 Hz) as base. The goal is activation, not relaxation.',
    },
    {
      element: 'Earth',
      signs: 'Taurus, Virgo, Capricorn',
      description: 'Grounding energy, stability, embodiment. Earth energy is slow, solid, and downward-rooting. It wants to BUILD. In sound healing, earth energy calls for sustained, anchoring sounds that bring awareness into the body and bones.',
      brainwave: 'Alpha brainwaves (8\u201314 Hz binaural beats)',
      instruments: 'Monochord, crystal bowls in lower octaves, Tibetan singing bowls, body-resonant drones',
      frequencies: 'Root frequency 256 Hz. Saturn frequency (147.85 Hz). Sustained tones, minimal variation. The goal is to ground and stabilise.',
    },
    {
      element: 'Air',
      signs: 'Gemini, Libra, Aquarius',
      description: 'Mental clarity, communication, connection. Air energy is quick, light, and outward-reaching. It wants to THINK and CONNECT. In sound healing, air energy calls for bright, clear sounds that sharpen the mind without overwhelming it.',
      brainwave: 'Alpha-Beta bridge (12\u201315 Hz binaural beats)',
      instruments: 'Singing bowls, wind chimes, tuning forks, higher octave tones, bells',
      frequencies: 'Mercury frequency (141.27 Hz). Brighter, cleaner tones. The goal is mental clarity and open communication.',
    },
    {
      element: 'Water',
      signs: 'Cancer, Scorpio, Pisces',
      description: 'Deep feeling, intuition, healing. Water energy is flowing, receptive, and inward-moving. It wants to FEEL and DISSOLVE. In sound healing, water energy calls for formless, immersive sounds that allow emotional release and spiritual connection.',
      brainwave: 'Theta brainwaves (4\u20138 Hz binaural beats)',
      instruments: 'Ocean drum, rain stick, gong baths, ambient drones, singing bowls with water',
      frequencies: '432 Hz tuning. Neptune frequency (211.44 Hz). Solfeggio frequencies. The goal is to dissolve barriers and access deeper feeling.',
    },
  ],
  lt: [
    {
      element: 'Ugnis',
      signs: 'Avinas, Liūtas, Šaulys',
      description: 'Aukšta energija, aktyvavimas, įkvėpimas. Ugnies energija yra šilta, šviesi ir kylanti aukštyn. Ji nori VEIKTI. Garso terapijoje ugnies energija reikalauja ritmiškų, energizuojančių garsų, kurie judina kūną ir uždega dvasią.',
      brainwave: 'Beta smegenų bangos (14–30 Hz binauralieji ritmiai)',
      instruments: 'Rėminiai būgnai, džembė, didžeridū, ugnies gongas, greiti ritminiai šablonai',
      frequencies: 'Greitesnis tempas, varomieji ritmiai. Marso dažnis (144.72 Hz) kaip bazė. Tikslas — aktyvavimas, ne atsipalaidavimas.',
    },
    {
      element: 'Žemė',
      signs: 'Jautis, Mergelė, Ožiaragis',
      description: 'Įžeminanti energija, stabilumas, įsikūnijimas. Žemės energija yra lėta, tvirta ir besileidžianti žemyn. Ji nori STATYTI. Garso terapijoje žemės energija reikalauja ištęstų, įtvirtinančių garsų, kurie atkreipia dėmesį į kūną ir kaulus.',
      brainwave: 'Alfa smegenų bangos (8–14 Hz binauralieji ritmiai)',
      instruments: 'Monokordas, kristaliniai dubenys žemesnėse oktavose, Tibeto dubenys, kūne rezonuojantys dronai',
      frequencies: 'Šakninis dažnis 256 Hz. Saturno dažnis (147.85 Hz). Ištęsti tonai, minimalios variacijos. Tikslas — įžeminti ir stabilizuoti.',
    },
    {
      element: 'Oras',
      signs: 'Dvyniai, Svarstyklės, Vandenis',
      description: 'Protinis aiškumas, komunikacija, ryšys. Oro energija yra greita, lengva ir besitęsianti į išorę. Ji nori MĄSTYTI ir JUNGTIS. Garso terapijoje oro energija reikalauja šviesių, aiškių garsų, kurie paaštrina protą jo neapkraudami.',
      brainwave: 'Alfa-Beta tiltas (12–15 Hz binauralieji ritmiai)',
      instruments: 'Tibetietiški dubenys, vėjo varpeliai, kamertono šakutės, aukštesnių oktavų tonai, varpai',
      frequencies: 'Merkurijaus dažnis (141.27 Hz). Šviesesni, švaresni tonai. Tikslas — protinis aiškumas ir atvira komunikacija.',
    },
    {
      element: 'Vanduo',
      signs: 'Vėžys, Skorpionas, Žuvys',
      description: 'Gilus jautimas, intuicija, gydymas. Vandens energija yra tekanti, imli ir judanti į vidų. Ji nori JAUSTI ir TIRPDYTI. Garso terapijoje vandens energija reikalauja beformių, panardinančių garsų, leidžiančių emocinį paleidimą ir dvasinį ryšį.',
      brainwave: 'Teta smegenų bangos (4–8 Hz binauralieji ritmiai)',
      instruments: 'Vandenynų būgnas, lietaus lazdelė, gongo vonios, ambientiniai dronai, dubenys su vandeniu',
      frequencies: '432 Hz derinimas. Neptūno dažnis (211.44 Hz). Solfedžio dažniai. Tikslas — ištirpdyti barjerus ir pasiekti gilesnį jautimą.',
    },
  ],
}

// ── Data sources section ─────────────────────────────────

export const dataSourcesTitle: Record<Language, string> = {
  en: 'Data Sources',
  lt: 'Duomenų Šaltiniai',
}

export interface DataSourceData {
  title: string
  paragraphs: string[]
}

export const dataSources: Record<Language, DataSourceData[]> = {
  en: [
    {
      title: 'astronomy-engine (npm package)',
      paragraphs: [
        'Open-source astronomical calculation library by Don Cross. Verified against NASA JPL (Jet Propulsion Laboratory) ephemeris data, accurate to fractions of a degree.',
        'Used for all planetary positions (ecliptic longitude, distance, rise/set times), moon phase calculations, and heliocentric positions for the solar system view. Runs entirely client-side \u2014 no server or internet needed for position calculations.',
        'Source: github.com/cosinekitty/astronomy',
      ],
    },
    {
      title: 'NOAA Space Weather Prediction Center',
      paragraphs: [
        'The US National Oceanic and Atmospheric Administration\u2019s space weather monitoring service. Provides real-time data from GOES satellites, updated every few minutes.',
        'Kp Index endpoint provides Earth\u2019s geomagnetic activity on a 0\u20139 scale. X-ray Flux endpoint provides solar flare classification (A/B/C/M/X class). This is the same data used by power companies and airlines for geomagnetic storm preparation.',
        'Practitioner relevance: Research links geomagnetic activity to sleep quality, mood, blood pressure, and heart rate variability. Elevated Kp can explain why clients feel \u201coff\u201d on certain days.',
      ],
    },
    {
      title: 'Hans Cousto\u2019s Cosmic Octave',
      paragraphs: [
        'Mathematical system created by Swiss mathematician Hans Cousto in 1978. Takes a planet\u2019s orbital period, converts it to a frequency (1/period), then octave-transposes it up into the audible range by repeatedly doubling.',
        'Example: Earth\u2019s year = 365.25 days \u2192 base frequency \u2192 octave up 32 times \u2192 136.10 Hz (the \u201cOm\u201d frequency).',
        'Used for planet tone frequencies when tapping planets on the wheel and drone tuning for the soundscape. Published in \u201cThe Cosmic Octave\u201d (1978). Provides a scientific basis for tuning instruments and sound healing sessions to planetary frequencies.',
      ],
    },
    {
      title: 'Solfeggio Frequencies',
      paragraphs: [
        'A set of specific frequencies (174, 285, 396, 417, 528, 639, 741, 852, 963 Hz) associated with different healing qualities. Historically linked to Gregorian chants, though the modern framework is a contemporary interpretation.',
        'Used for Moon-sign-based drone tuning in the soundscape and mapping zodiac signs to specific solfeggio tones. Evidence for specific healing properties is still emerging, but the frequencies provide a meaningful and intentional framework widely used in sound healing practice.',
      ],
    },
    {
      title: 'Claude API (Anthropic)',
      paragraphs: [
        'AI language model API used for generating personalised horoscope readings. Real astronomical data (positions, aspects, moon phase, earth data) is sent as context \u2014 Claude generates interpretive readings grounded in the actual sky.',
        'Used for daily general readings, individual zodiac readings, and weekly forecasts on the /promo content studio page. Model: Claude Sonnet 4. Not used for planetary calculations \u2014 those are pure astronomy-engine maths.',
      ],
    },
    {
      title: 'Plausible Analytics',
      paragraphs: [
        'Privacy-focused, cookie-free web analytics used for anonymous usage statistics across all Harmonic Waves ecosystem apps. Does NOT collect personal data, use cookies, or track individual users. Your cosmic journey is yours alone.',
      ],
    },
  ],
  lt: [
    {
      title: 'astronomy-engine (npm paketas)',
      paragraphs: [
        'Atviro kodo astronominių skaičiavimų biblioteka, sukurta Don Cross. Patikrinta pagal NASA JPL (Jet Propulsion Laboratory) efemeridžių duomenis, tiksli iki laipsnio dalių.',
        'Naudojama visoms planetų pozicijoms (ekliptikos ilguma, atstumas, patekėjimo / nusileidimo laikai), Mėnulio fazių skaičiavimams ir heliocentrinėms pozicijoms Saulės sistemos vaizde. Veikia visiškai kliento pusėje — pozicijų skaičiavimams nereikia serverio ar interneto.',
        'Šaltinis: github.com/cosinekitty/astronomy',
      ],
    },
    {
      title: 'NOAA Kosminio Oro Prognozių Centras',
      paragraphs: [
        'JAV Nacionalinės vandenynų ir atmosferos administracijos kosminio oro stebėjimo tarnyba. Teikia realaus laiko duomenis iš GOES palydovų, atnaujinamus kas kelias minutes.',
        'Kp indekso sąsaja pateikia Žemės geomagnetinį aktyvumą 0–9 skalėje. Rentgeno srauto sąsaja pateikia saulės žybsnių klasifikaciją (A/B/C/M/X klasė). Tai tie patys duomenys, kuriuos naudoja energetikos įmonės ir avialinijos geomagnetinių audrų pasirengimui.',
        'Aktualumas praktikams: tyrimai sieja geomagnetinį aktyvumą su miego kokybe, nuotaika, kraujospūdžiu ir širdies ritmo kintamumu. Padidėjęs Kp gali paaiškinti, kodėl klientai tam tikromis dienomis jaučiasi „ne taip".',
      ],
    },
    {
      title: 'Hanso Cousto Kosminė Oktava',
      paragraphs: [
        'Matematinė sistema, sukurta Šveicarijos matematiko Hanso Cousto 1978 m. Ima planetos orbitos periodą, konvertuoja jį į dažnį (1/periodas), tada oktavomis perkelia aukštyn į girdimą diapazoną, nuolat dvigubindama.',
        'Pavyzdys: Žemės metai = 365,25 dienos → bazinis dažnis → 32 oktavos aukštyn → 136,10 Hz („Om" dažnis).',
        'Naudojama planetų tonų dažniams, palietus planetas ant rato, ir drono derinimui garso peizažui. Publikuota knygoje „The Cosmic Octave" (1978). Suteikia mokslinį pagrindą instrumentų ir garso terapijos seansų derinimui pagal planetų dažnius.',
      ],
    },
    {
      title: 'Solfedžio dažniai',
      paragraphs: [
        'Specifinių dažnių rinkinys (174, 285, 396, 417, 528, 639, 741, 852, 963 Hz), susijęs su skirtingomis gydymo savybėmis. Istoriškai siejamas su grigališkaisiais giedojimais, nors šiuolaikinis modelis yra šiuolaikinė interpretacija.',
        'Naudojamas Mėnulio ženklu pagrįstam drono derinimui garso peizaže ir zodiako ženklų siejimui su konkrečiais solfedžio tonais. Konkrečių gydomųjų savybių įrodymai vis dar kaupiami, tačiau dažniai suteikia prasmingą ir tikslintą sistemą, plačiai naudojamą garso terapijos praktikoje.',
      ],
    },
    {
      title: 'Claude API (Anthropic)',
      paragraphs: [
        'DI kalbos modelio API, naudojama personalizuotiems horoskopų skaitymams generuoti. Tikri astronominiai duomenys (pozicijos, aspektai, Mėnulio fazė, Žemės duomenys) siunčiami kaip kontekstas — Claude generuoja interpretuojančius skaitymus, pagrįstus tikru dangumi.',
        'Naudojama kasdieniams bendriesiems skaitymams, individualiems zodiako skaitymams ir savaitinėms prognozėms /promo turinio studijos puslapyje. Modelis: Claude Sonnet 4. Nenaudojama planetų skaičiavimams — tai grynoji astronomy-engine matematika.',
      ],
    },
    {
      title: 'Plausible Analytics',
      paragraphs: [
        'Privatumui orientuota, be slapukų veikianti žiniatinklio analitika, naudojama anoniminei naudojimo statistikai visose Harmonic Waves ekosistemos programose. NERENKA asmeninių duomenų, nenaudoja slapukų ir neseka individualių naudotojų. Jūsų kosminė kelionė priklauso tik jums.',
      ],
    },
  ],
}

// ── Frequency table data ─────────────────────────────────

export const coustoRows: string[][] = [
  ['☉ Sun', '126.22', 'B', 'Solar Plexus / Heart', 'Gold / Orange'],
  ['☽ Moon', '210.42', 'G#', 'Sacral', 'Silver / Violet'],
  ['☿ Mercury', '141.27', 'C# / D', 'Throat', 'Yellow-Green'],
  ['♀ Venus', '221.23', 'A', 'Heart / Sacral', 'Green / Pink'],
  ['♂ Mars', '144.72', 'D', 'Solar Plexus / Root', 'Red'],
  ['♃ Jupiter', '183.58', 'F#', 'Crown', 'Blue / Purple'],
  ['♄ Saturn', '147.85', 'D', 'Root', 'Dark Blue / Black'],
  ['♅ Uranus', '207.36', 'G#', 'Third Eye', 'Electric Blue'],
  ['♆ Neptune', '211.44', 'G#', 'Crown', 'Turquoise / Sea Green'],
  ['♇ Pluto', '140.25', 'C#', 'Root', 'Deep Crimson / Black'],
]

export const coustoRowsLt: string[][] = [
  ['☉ Saulė', '126.22', 'B', 'Saulės rezginys / Širdis', 'Auksinė / Oranžinė'],
  ['☽ Mėnulis', '210.42', 'G#', 'Kryžkaulio', 'Sidabrinė / Violetinė'],
  ['☿ Merkurijus', '141.27', 'C# / D', 'Gerklės', 'Gelsva-žalia'],
  ['♀ Venera', '221.23', 'A', 'Širdies / Kryžkaulio', 'Žalia / Rožinė'],
  ['♂ Marsas', '144.72', 'D', 'Saulės rezginys / Šaknies', 'Raudona'],
  ['♃ Jupiteris', '183.58', 'F#', 'Karūnos', 'Mėlyna / Violetinė'],
  ['♄ Saturnas', '147.85', 'D', 'Šaknies', 'Tamsiai mėlyna / Juoda'],
  ['♅ Uranas', '207.36', 'G#', 'Trečiosios akies', 'Elektrinė mėlyna'],
  ['♆ Neptūnas', '211.44', 'G#', 'Karūnos', 'Turkio / Jūros žalia'],
  ['♇ Plutonas', '140.25', 'C#', 'Šaknies', 'Tamsiai raudona / Juoda'],
]

export const solfeggioRows: string[][] = [
  ['♈ Aries', '396', 'Liberation, releasing fear'],
  ['♉ Taurus', '417', 'Facilitating change'],
  ['♊ Gemini', '528', 'Transformation, DNA repair'],
  ['♋ Cancer', '639', 'Connecting, relationships'],
  ['♌ Leo', '741', 'Expression, solutions'],
  ['♍ Virgo', '852', 'Returning to spiritual order'],
  ['♎ Libra', '639', 'Connecting, harmony'],
  ['♏ Scorpio', '174', 'Foundation, pain reduction'],
  ['♐ Sagittarius', '741', 'Expression, awakening intuition'],
  ['♑ Capricorn', '285', 'Influence, energy field healing'],
  ['♒ Aquarius', '963', 'Awakening, cosmic consciousness'],
  ['♓ Pisces', '852', 'Intuition, inner vision'],
]

export const solfeggioRowsLt: string[][] = [
  ['♈ Avinas', '396', 'Išsilaisvinimas, baimės paleidimas'],
  ['♉ Jautis', '417', 'Pokyčių palengvinimas'],
  ['♊ Dvyniai', '528', 'Transformacija, DNR atstatymas'],
  ['♋ Vėžys', '639', 'Sujungimas, santykiai'],
  ['♌ Liūtas', '741', 'Raiška, sprendimai'],
  ['♍ Mergelė', '852', 'Grįžimas į dvasinę tvarką'],
  ['♎ Svarstyklės', '639', 'Sujungimas, harmonija'],
  ['♏ Skorpionas', '174', 'Pamatai, skausmo mažinimas'],
  ['♐ Šaulys', '741', 'Raiška, intuicijos žadinimas'],
  ['♑ Ožiaragis', '285', 'Įtaka, energinio lauko gydymas'],
  ['♒ Vandenis', '963', 'Pabudimas, kosminė sąmonė'],
  ['♓ Žuvys', '852', 'Intuicija, vidinis regėjimas'],
]

// ── Cheat sheet section ──────────────────────────────────

export interface CheatSheetItem {
  question: string
  arrow: string
}

export const cheatSheetTitle: Record<Language, string> = {
  en: 'Quick Reference \u2014 Reading Cheat Sheet',
  lt: 'Trumpa Atmintinė \u2014 Skaitymo Šparžalapė',
}

export const cheatSheetSubtitle: Record<Language, string> = {
  en: 'Daily Reading Checklist',
  lt: 'Dienos Skaitymo Kontrolinis Sąrašas',
}

export const cheatSheet: Record<Language, CheatSheetItem[]> = {
  en: [
    { question: 'What sign is the Sun in?', arrow: 'Season energy' },
    { question: 'What sign is the Moon in?', arrow: 'Today\u2019s emotional tone' },
    { question: 'What phase is the Moon?', arrow: 'Doing (waxing) or releasing (waning)?' },
    { question: 'Any planet clusters?', arrow: 'Where is energy concentrated?' },
    { question: 'Any oppositions?', arrow: 'Where is there tension?' },
    { question: 'Kp index above 4?', arrow: 'Bodies may feel it' },
    { question: 'What element dominates?', arrow: 'Choose instruments accordingly' },
    { question: 'What is the person\u2019s Sun sign?', arrow: 'How does today hit them specifically?' },
  ],
  lt: [
    { question: 'Kokiame ženkle yra Saulė?', arrow: 'Sezono energija' },
    { question: 'Kokiame ženkle yra Mėnulis?', arrow: 'Šiandienos emocinis tonas' },
    { question: 'Kokia Mėnulio fazė?', arrow: 'Veikimas (augantis) ar paleidimas (senstantis)?' },
    { question: 'Ar yra planetų sankaupų?', arrow: 'Kur sutelkta energija?' },
    { question: 'Ar yra opozicijų?', arrow: 'Kur yra įtampa?' },
    { question: 'Kp indeksas virš 4?', arrow: 'Kūnai gali tai pajusti' },
    { question: 'Kokia stichija dominuoja?', arrow: 'Pasirinkite instrumentus atitinkamai' },
    { question: 'Koks žmogaus Saulės ženklas?', arrow: 'Kaip šiandiena veikia juos konkrečiai?' },
  ],
}

// ── Section labels used in sub-components ────────────────

export const labels: Record<Language, {
  celestialBodiesTitle: string
  zodiacSignsTitle: string
  frequencyTitle: string
  coustoTitle: string
  solfeggioTitle: string
  cheatSheetTitle: string
  cheatSheetSubtitle: string
  footer: string
  contents: string
  orbitalPeriod: string
  coustoFrequency: string
  chakraLabel: string
  soundHealing: string
  whenProminent: string
  bodyLabel: string
  shadowLabel: string
  planetCluster: string
  ruler: string
  brainwave: string
  instruments: string
  frequencies: string
  step: string
  planet: string
  frequencyHz: string
  noteLabel: string
  chakraCol: string
  colour: string
  zodiacSign: string
  solfeggioHz: string
  quality: string
}> = {
  en: {
    celestialBodiesTitle: 'The Ten Celestial Bodies',
    zodiacSignsTitle: 'The Twelve Zodiac Signs',
    frequencyTitle: 'Frequency Reference',
    coustoTitle: 'Cousto Planetary Frequencies',
    solfeggioTitle: 'Solfeggio-to-Zodiac Mapping',
    cheatSheetTitle: 'Quick Reference \u2014 Reading Cheat Sheet',
    cheatSheetSubtitle: 'Daily Reading Checklist',
    footer: 'Part of Harmonic Waves \u00b7 astrara.app',
    contents: 'Contents',
    orbitalPeriod: 'Orbital period:',
    coustoFrequency: 'Cousto frequency:',
    chakraLabel: 'Chakra:',
    soundHealing: 'Sound healing:',
    whenProminent: 'When prominent:',
    bodyLabel: 'Body:',
    shadowLabel: 'Shadow:',
    planetCluster: 'Planet cluster effect:',
    ruler: 'Ruler:',
    brainwave: 'Brainwave target:',
    instruments: 'Instruments:',
    frequencies: 'Frequencies:',
    step: 'Step',
    planet: 'Planet',
    frequencyHz: 'Frequency (Hz)',
    noteLabel: 'Note',
    chakraCol: 'Chakra',
    colour: 'Colour',
    zodiacSign: 'Zodiac Sign',
    solfeggioHz: 'Solfeggio (Hz)',
    quality: 'Quality',
  },
  lt: {
    celestialBodiesTitle: 'Dešimt Dangaus Kūnų',
    zodiacSignsTitle: 'Dvylika Zodiako Ženklų',
    frequencyTitle: 'Dažnių Lentelė',
    coustoTitle: 'Cousto Planetų Dažniai',
    solfeggioTitle: 'Solfedžio ir Zodiako Sąsajos',
    cheatSheetTitle: 'Trumpa Atmintinė \u2014 Skaitymo Šparžalapė',
    cheatSheetSubtitle: 'Dienos Skaitymo Kontrolinis Sąrašas',
    footer: 'Dalis Harmonic Waves \u00b7 astrara.app',
    contents: 'Turinys',
    orbitalPeriod: 'Orbitos periodas:',
    coustoFrequency: 'Cousto dažnis:',
    chakraLabel: 'Čakra:',
    soundHealing: 'Garso terapija:',
    whenProminent: 'Kai ryškiai išreikštas:',
    bodyLabel: 'Kūno sritis:',
    shadowLabel: 'Šešėlis:',
    planetCluster: 'Planetų sankaupos efektas:',
    ruler: 'Valdovas:',
    brainwave: 'Smegenų bangų tikslas:',
    instruments: 'Instrumentai:',
    frequencies: 'Dažniai:',
    step: 'Žingsnis',
    planet: 'Planeta',
    frequencyHz: 'Dažnis (Hz)',
    noteLabel: 'Nata',
    chakraCol: 'Čakra',
    colour: 'Spalva',
    zodiacSign: 'Zodiako ženklas',
    solfeggioHz: 'Solfedžio (Hz)',
    quality: 'Savybė',
  },
}
