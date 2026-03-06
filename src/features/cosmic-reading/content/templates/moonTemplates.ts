import type { ZodiacSign } from '../../types'

// === MOON PHASE READINGS ===

export interface MoonPhaseReading {
  general: { en: string; lt: string }
  themeKeywords: { en: string[]; lt: string[] }
}

export const MOON_PHASES: Record<string, MoonPhaseReading> = {
  'New Moon': {
    general: {
      en: 'The sky is dark and the Moon is hidden — a powerful moment for intention setting. This is the cosmic reset point, where old cycles dissolve and new ones are seeded in silence. Plant your intentions gently today; they do not need to be perfect, only sincere. Trust the darkness as fertile ground.',
      lt: 'Dangus tamsus ir Mėnulis paslėptas — tai galinga akimirka ketinimams nustatyti. Tai kosminis atsinaujinimo taškas, kur senieji ciklai ištirpsta ir nauji užsėjami tyloje. Švelniai pasėkite savo ketinimus šiandien; jie neturi būti tobuli, tik nuoširdūs. Pasitikėkite tamsa kaip derlingais dirvonais.',
    },
    themeKeywords: {
      en: ['beginnings', 'intention', 'planting seeds', 'fresh start'],
      lt: ['pradžios', 'ketinimas', 'sėklų sėjimas', 'nauja pradžia'],
    },
  },
  'Waxing Crescent': {
    general: {
      en: 'A thin sliver of light returns to the sky, and with it, a sense of emerging clarity. The intentions you set at the New Moon are beginning to take root. This is a time to take small, deliberate first steps — not to rush, but to build momentum with faith. Courage grows quietly now.',
      lt: 'Plonas šviesos pjautuvas grįžta į dangų, o su juo — besiformuojantis aiškumas. Ketinimai, kuriuos nustatėte per Jaunatį, pradeda leisti šaknis. Tai laikas žengti mažus, apgalvotus pirmuosius žingsnius — ne skubėti, bet kurti pagreitį su tikėjimu. Drąsa dabar tyliai auga.',
    },
    themeKeywords: {
      en: ['growth', 'momentum', 'first steps', 'emerging clarity'],
      lt: ['augimas', 'pagreitis', 'pirmieji žingsniai', 'besiformuojantis aiškumas'],
    },
  },
  'First Quarter': {
    general: {
      en: 'The Moon reaches its first square to the Sun, bringing a moment of creative tension. Decisions may feel pressing and obstacles may surface — these are not setbacks but invitations to act with determination. This is the phase where intentions meet reality. Choose your path and move forward with conviction.',
      lt: 'Mėnulis pasiekia pirmąjį kvadratą su Saule, atnešdamas kūrybinės įtampos akimirką. Sprendimai gali atrodyti neatidėliotini ir kliūtys gali iškilti — tai ne nesėkmės, o kvietimai veikti ryžtingai. Tai fazė, kai ketinimai susitinka su realybe. Pasirinkite savo kelią ir judėkite pirmyn su įsitikinimu.',
    },
    themeKeywords: {
      en: ['determination', 'action', 'decisions', 'overcoming obstacles'],
      lt: ['ryžtas', 'veiksmas', 'sprendimai', 'kliūčių įveikimas'],
    },
  },
  'Waxing Gibbous': {
    general: {
      en: 'The Moon is nearly full, and the light is building steadily. This is a time of refinement and patience — your efforts are taking shape, even if the results are not yet fully visible. Trust the process without forcing outcomes. Small adjustments made now will have a significant impact when the Full Moon arrives.',
      lt: 'Mėnulis beveik pilnas, ir šviesa nuosekliai stiprėja. Tai laikas tobulinti ir kantriai laukti — jūsų pastangos įgauna formą, net jei rezultatai dar ne visai matomi. Pasitikėkite procesu, neverskite rezultatų. Maži pakeitimai, padaryti dabar, turės didelę reikšmę, kai ateis Pilnatis.',
    },
    themeKeywords: {
      en: ['perseverance', 'refinement', 'patience', 'trust'],
      lt: ['atkaklumas', 'tobulinimas', 'kantrybė', 'pasitikėjimas'],
    },
  },
  'Full Moon': {
    general: {
      en: 'The Moon stands fully illuminated, opposite the Sun, and whatever has been building reaches a peak. Emotions run high, clarity arrives suddenly, and hidden truths may surface. This is a moment of culmination and revelation — celebrate what has come to fruition, and allow yourself to see clearly what needs to shift.',
      lt: 'Mėnulis stovi visiškai apšviestas, priešais Saulę, ir visa, kas buvo kuriama, pasiekia viršūnę. Emocijos kyla aukštai, aiškumas ateina staiga, ir paslėptos tiesos gali iškilti. Tai kulminacijos ir atradimo akimirka — švęskite tai, kas subrandinta, ir leiskite sau aiškiai pamatyti, ką reikia keisti.',
    },
    themeKeywords: {
      en: ['revelation', 'culmination', 'illumination', 'heightened emotions'],
      lt: ['atradimas', 'kulminacija', 'nušvitimas', 'sustiprėjusios emocijos'],
    },
  },
  'Waning Gibbous': {
    general: {
      en: 'The Full Moon is behind you, and the light begins to soften. This is a generous, reflective phase — a time to share what you have learned and to express gratitude for what has been revealed. Wisdom gathered during the Full Moon can now be offered to others. Teaching, mentoring, and acts of generosity feel especially natural.',
      lt: 'Pilnatis jau praeityje, ir šviesa pradeda švelnėti. Tai dosni, apmąstymų fazė — laikas dalintis tuo, ką sužinojote, ir reikšti dėkingumą už tai, kas buvo atskleista. Pilnatyje surinkta išmintis dabar gali būti dovanojama kitiems. Mokymas, mentorystė ir dosnumo gestai jaučiasi ypač natūraliai.',
    },
    themeKeywords: {
      en: ['generosity', 'gratitude', 'sharing wisdom', 'reflection'],
      lt: ['dosnumas', 'dėkingumas', 'išminties dalijimasis', 'apmąstymas'],
    },
  },
  'Last Quarter': {
    general: {
      en: 'The Moon reaches its final square, and the energy turns inward. This is the time for release — letting go of what no longer serves you, forgiving what needs forgiveness, and clearing space for what comes next. Old patterns, habits, and attachments can be gently set down now. Surrender is not weakness; it is wisdom.',
      lt: 'Mėnulis pasiekia paskutinį kvadratą, ir energija pasisuka į vidų. Tai laikas paleisti — atsisakyti to, kas nebetarnauja, atleisti tai, kam reikia atleidimo, ir sukurti erdvę tam, kas ateina toliau. Seni modeliai, įpročiai ir prisirišimai gali būti švelniai palikti. Atsidavimas nėra silpnybė; tai išmintis.',
    },
    themeKeywords: {
      en: ['surrender', 'release', 'forgiveness', 'letting go'],
      lt: ['atsidavimas', 'paleidimas', 'atleidimas', 'atsisakymas'],
    },
  },
  'Waning Crescent': {
    general: {
      en: 'The Moon is barely visible, retreating into darkness before the next New Moon. This is the most restful phase of the entire cycle — a time for stillness, solitude, and deep reflection. Your body and spirit are preparing for renewal. Honour this quiet interval by slowing down and listening inward.',
      lt: 'Mėnulis vos matomas, traukiasi į tamsą prieš kitą Jaunatį. Tai ramiausias viso ciklo fazė — laikas tylai, vienatvei ir giliam apmąstymui. Jūsų kūnas ir dvasia ruošiasi atsinaujinimui. Pagerbkite šį tylų intervalą sulėtindami ir klausydamiesi savęs.',
    },
    themeKeywords: {
      en: ['stillness', 'rest', 'reflection', 'preparation'],
      lt: ['tyla', 'poilsis', 'apmąstymas', 'pasiruošimas'],
    },
  },
}

// === MOON IN SIGN READINGS ===

export interface MoonInSignReading {
  general: { en: string; lt: string }
  themeKeywords: { en: string[]; lt: string[] }
  personalByHouse: Record<number, { en: string; lt: string }>
}

export const MOON_IN_SIGN: Record<ZodiacSign, MoonInSignReading> = {
  aries: {
    general: {
      en: 'The Moon in Aries ignites emotional spontaneity. Bold feelings rise to the surface — this is a time to act on instinct rather than overthink. Emotional courage is available to all.',
      lt: 'Mėnulis Avine uždega emocinį spontaniškumą. Drąsūs jausmai kyla į paviršių — tai laikas veikti instinktyviai, o ne permąstyti. Emocinė drąsa prieinama visiems.',
    },
    themeKeywords: {
      en: ['courage', 'spontaneity', 'initiative'],
      lt: ['drąsa', 'spontaniškumas', 'iniciatyva'],
    },
    personalByHouse: {
      1: {
        en: 'You feel an electric surge of personal confidence today. Trust your instincts about who you are and what you want — bold self-expression is favoured right now.',
        lt: 'Šiandien jaučiate elektrinį asmeninio pasitikėjimo antplūdį. Pasitikėkite savo instinktais dėl to, kas esate ir ko norite — drąsi saviraiška šiuo metu palankiai vertinama.',
      },
      2: {
        en: 'A sudden urge to spend on something that excites you may arise. Channel this fiery impulse into reviewing your financial goals rather than making impulsive purchases — your values deserve the same courage you bring to everything else.',
        lt: 'Gali kilti staigus noras išleisti kažkam, kas jus jaudina. Nukreipkite šį ugningą impulsą į finansinių tikslų peržiūrą, o ne į impulsyvius pirkinius — jūsų vertybės nusipelno tokios pat drąsos, kokią suteikiate viskam kitam.',
      },
      3: {
        en: 'Words come fast and direct under this Moon. You may feel compelled to speak your mind without filtering — which can be refreshing, but take a breath before sending that message. Honest conversation clears the air beautifully if delivered with care.',
        lt: 'Žodžiai šiame Mėnulyje ateina greitai ir tiesiai. Galite jaustis verčiami kalbėti atvirai be filtravimo — tai gali būti gaivinu, tačiau prieš siųsdami tą žinutę, atsikvėpkite. Sąžiningas pokalbis nuvalo orą, jei pateikiamas su rūpesčiu.',
      },
      4: {
        en: 'Restless energy stirs in your home life. You might feel the urge to rearrange, declutter, or have a direct conversation with family about something you have been holding back.',
        lt: 'Nerami energija sujudina jūsų namų gyvenimą. Galite pajusti norą pertvarkyti, išvalyti ar turėti tiesioginį pokalbį su šeima apie tai, ką laikėte savyje.',
      },
      5: {
        en: 'Creative fire runs high for you today. A passion project, romantic impulse, or playful adventure calls — follow the spark without overthinking where it leads.',
        lt: 'Kūrybinė ugnis šiandien dega aukštai. Aistros projektas, romantinis impulsas ar žaismingas nuotykis kviečia — sekite kibirkštį, per daug negalvodami, kur ji nuves.',
      },
      6: {
        en: 'Your body craves movement and release. An intense workout, a brisk walk, or simply tackling your to-do list with fierce energy can channel this Moon\'s restless force through your daily routines.',
        lt: 'Jūsų kūnas trokšta judėjimo ir atpalaidavimo. Intensyvus treniruotė, greitas pasivaikščiojimas ar tiesiog savo darbų sąrašo įveikimas su aršia energija gali nukreipti šio Mėnulio neramią jėgą per jūsų kasdienes rutinas.',
      },
      7: {
        en: 'Passion and directness colour your closest relationships. Speak honestly with your partner or collaborator — they will respect your candour, and clearing the air now prevents resentment from building.',
        lt: 'Aistra ir tiesumas nuspalvina jūsų artimiausius santykius. Kalbėkite atvirai su partneriu ar bendradarbiu — jie gerbs jūsų nuoširdumą, o oro išvalymas dabar neleis kauptis nuoskaudai.',
      },
      8: {
        en: 'Deep, intense feelings may surface without warning. This Moon stirs the hidden layers of your emotional life — allow whatever arises to be felt fully. Courage in facing your shadows brings genuine freedom.',
        lt: 'Gilūs, intensyvūs jausmai gali iškilti be įspėjimo. Šis Mėnulis sujudina paslėptus jūsų emocinio gyvenimo sluoksnius — leiskite viskam, kas iškyla, būti visiškai pajustam. Drąsa susiduriant su savo šešėliais atneša tikrą laisvę.',
      },
      9: {
        en: 'A hunger for adventure or meaning pulls you outward. Whether it is booking a trip, picking up a new book, or having a philosophical debate, your spirit needs expansion today.',
        lt: 'Nuotykių ar prasmės alkis traukia jus į lauką. Nesvarbu, ar tai kelionės planavimas, naujos knygos paėmimas, ar filosofinis debatas — jūsų dvasia šiandien reikalauja plėtros.',
      },
      10: {
        en: 'An impulsive career idea may surface. Do not dismiss it — this Aries Moon activates your ambition. Take one bold step toward a professional goal, even if it feels premature.',
        lt: 'Gali iškilti impulsyvi karjeros idėja. Neatmeskite jos — šis Avino Mėnulis aktyvuoja jūsų ambiciją. Ženkite vieną drąsų žingsnį link profesinio tikslo, net jei tai atrodo per anksti.',
      },
      11: {
        en: 'You may feel called to lead within your social circle or champion a cause that matters to you. Your pioneering spirit inspires others — use this influence to rally people around a shared vision.',
        lt: 'Galite jaustis kviečiami vesti savo socialiniame rate arba ginti jums svarbią bylą. Jūsų pionieriškas dvasios įkvepia kitus — naudokite šią įtaką sutelkti žmones aplink bendrą viziją.',
      },
      12: {
        en: 'Inner restlessness signals a need for spiritual reset. Active meditation, breathwork, or journaling can help channel this fiery energy inward. Pay attention to vivid dreams or sudden intuitive flashes.',
        lt: 'Vidinė neramybė signalizuoja dvasinio atsinaujinimo poreikį. Aktyvi meditacija, kvėpavimo pratybos ar dienoraščio rašymas gali padėti nukreipti šią ugningą energiją į vidų. Atkreipkite dėmesį į ryškius sapnus ar staigias intuityvias blykšmes.',
      },
    },
  },
  taurus: {
    general: {
      en: 'The Moon in Taurus grounds the emotional body in comfort and steadiness. There is a deep need for stability, good food, and sensory pleasure today. Slow down and savour what is already here.',
      lt: 'Mėnulis Jautyje įžemina emocinį kūną komforte ir stabilume. Yra gilus stabilumo, gero maisto ir juslinių malonumų poreikis šiandien. Sulėtinkite ir mėgaukitės tuo, kas jau yra.',
    },
    themeKeywords: {
      en: ['comfort', 'stability', 'sensory pleasure'],
      lt: ['komfortas', 'stabilumas', 'jusliniai malonumai'],
    },
    personalByHouse: {
      1: {
        en: 'Your sense of self feels grounded and steady today. There is a quiet confidence in simply being — no need to prove anything. Honour your body\'s need for comfort and presence.',
        lt: 'Jūsų savęs pojūtis šiandien yra įžemintas ir stabilus. Yra tylus pasitikėjimas tiesiog buvimu — nereikia nieko įrodinėti. Pagerbkite savo kūno komforto ir buvimo šalia poreikį.',
      },
      2: {
        en: 'Financial matters feel particularly pressing, but in a stabilising way. This is an excellent time to review your budget, appreciate what you already have, and make practical decisions about money and resources.',
        lt: 'Finansiniai reikalai jaučiasi ypač svarbūs, bet stabilizuojančiai. Tai puikus metas peržiūrėti biudžetą, įvertinti tai, ką jau turite, ir priimti praktiškus sprendimus dėl pinigų ir išteklių.',
      },
      3: {
        en: 'Conversations slow down and become more deliberate. You prefer substance over small talk today — meaningful exchanges about practical matters or shared pleasures feel most satisfying.',
        lt: 'Pokalbiai sulėtėja ir tampa labiau apgalvoti. Šiandien teikiate pirmenybę turiniui, o ne tuščiam plepėjimui — prasmingi pokalbiai apie praktiškus dalykus ar dalijimąsi malonumais jaučiasi labiausiai patenkinantys.',
      },
      4: {
        en: 'Your home becomes a sanctuary today. Cooking a good meal, tending to your living space, or simply resting in familiar surroundings feeds your soul deeply. Invest in your comfort.',
        lt: 'Jūsų namai šiandien tampa šventove. Gero patiekalo ruošimas, gyvenamosios erdvės tvarkymas ar tiesiog poilsis pažįstamoje aplinkoje giliai maitina jūsų sielą. Investuokite į savo komfortą.',
      },
      5: {
        en: 'Sensory creativity flourishes — working with your hands, cooking, gardening, or making music feels deeply satisfying. Romance, too, takes on a warm, unhurried quality. Savour rather than rush.',
        lt: 'Juslinė kūryba klesti — darbas rankomis, maisto gaminimas, sodininkavimas ar muzikavimas jaučiasi giliai patenkinamai. Romantika taip pat įgauna šiltą, neskubią kokybę. Mėgaukitės, o ne skubėkite.',
      },
      6: {
        en: 'Your body asks for nourishment and rest rather than intensity. Gentle movement, wholesome food, and a steady pace through your daily tasks bring genuine satisfaction and wellbeing.',
        lt: 'Jūsų kūnas prašo maistingumo ir poilsio, o ne intensyvumo. Švelnus judėjimas, sveikas maistas ir pastovus tempas kasdienėse užduotyse suteikia tikrą pasitenkinimą ir gerovę.',
      },
      7: {
        en: 'Loyalty and reliability matter most in your partnerships today. Show up consistently for the people who matter — and notice who shows up consistently for you. Stability is a form of love.',
        lt: 'Lojalumas ir patikimumas šiandien labiausiai svarbu jūsų partnerystėse. Nuosekliai būkite šalia svarbiems žmonėms — ir pastebėkite, kas nuosekliai būna šalia jums. Stabilumas yra meilės forma.',
      },
      8: {
        en: 'You may resist change today, preferring the familiar over the unknown. Yet something beneath the surface is quietly shifting. Allow small transformations without forcing dramatic upheaval.',
        lt: 'Šiandien galite priešintis pokyčiams, teikdami pirmenybę pažįstamam prieš nežinomą. Tačiau kažkas po paviršiumi tyliai keičiasi. Leiskite mažoms transformacijoms vykti, neverskite dramatiškų perversmų.',
      },
      9: {
        en: 'Philosophical questions take a practical turn — you want wisdom you can actually apply. A nature walk, a visit somewhere beautiful, or learning a hands-on skill satisfies this Moon\'s earthy wanderlust.',
        lt: 'Filosofiniai klausimai įgauna praktinį posūkį — norite išminties, kurią iš tikrųjų galite pritaikyti. Pasivaikščiojimas gamtoje, apsilankymas kur nors gražioje vietoje ar praktinio įgūdžio mokymasis patenkina šio Mėnulio žemišką kelionių troškimą.',
      },
      10: {
        en: 'Professional matters benefit from patience and persistence rather than bold moves. Build steadily, focus on quality over speed, and trust that consistent effort creates lasting reputation.',
        lt: 'Profesiniai reikalai naudingesni su kantrybe ir atkaklumu, o ne drąsiais žingsniais. Kurkite stabiliai, dėmesį skirkite kokybei, o ne greičiui, ir pasitikėkite, kad nuoseklios pastangos sukuria ilgalaikę reputaciją.',
      },
      11: {
        en: 'You gravitate toward friends and groups that feel reliable and genuine. Superficial social interactions drain you today — seek out the people who share your values and appreciate authenticity.',
        lt: 'Traukiate prie draugų ir grupių, kurios jaučiasi patikimos ir nuoširdžios. Paviršutiniški socialiniai santykiai šiandien jus alina — ieškokite žmonių, kurie dalijasi jūsų vertybėmis ir vertina autentiškumą.',
      },
      12: {
        en: 'A quiet, embodied spirituality calls to you. Sitting in nature, practising slow breathing, or simply being still allows your inner world to settle and restore. Trust the wisdom of stillness.',
        lt: 'Tyli, kūniška dvasingumas kviečia jus. Sėdėjimas gamtoje, lėto kvėpavimo praktika ar tiesiog buvimas ramybėje leidžia jūsų vidiniam pasauliui nusistovėti ir atsistatyti. Pasitikėkite tylos išmintimi.',
      },
    },
  },
  gemini: {
    general: {
      en: 'The Moon in Gemini quickens the mind and stirs curiosity. Conversations feel stimulating, ideas flow freely, and there is a restless need for variety. Journaling, reading, or a good talk with a friend can satisfy the emotional appetite.',
      lt: 'Mėnulis Dvyniuose pagreitina protą ir sužadina smalsumą. Pokalbiai jaučiasi stimuliuojantys, idėjos teka laisvai, ir yra neramus poreikis įvairovei. Rašymas dienoraštyje, skaitymas ar geras pokalbis su draugu gali patenkinti emocinį apetitą.',
    },
    themeKeywords: {
      en: ['curiosity', 'communication', 'mental stimulation'],
      lt: ['smalsumas', 'bendravimas', 'protinis stimuliavimas'],
    },
    personalByHouse: {
      1: {
        en: 'Your mind is buzzing and your sense of self feels multifaceted today. You may want to try on different roles or explore new sides of your personality. Curiosity about who you are becoming is a gift.',
        lt: 'Jūsų protas šurmuliuoja ir jūsų savęs pojūtis jaučiasi daugiabriaunis šiandien. Galite norėti išbandyti skirtingus vaidmenis ar tyrinėti naujas savo asmenybės puses. Smalsumas apie tai, kuo tampate, yra dovana.',
      },
      2: {
        en: 'Financial ideas come rapidly — side projects, investments, or creative ways to earn may flash through your mind. Write them down before they vanish, but wait a day before acting on any of them.',
        lt: 'Finansinės idėjos ateina greitai — šalutiniai projektai, investicijos ar kūrybiški būdai uždirbti gali šmėžuoti protu. Užsirašykite jas, kol neišnyko, bet palaukite dieną prieš imdamiesi bet kurios.',
      },
      3: {
        en: 'This Moon lands directly in your communication zone, amplifying everything it touches. Words flow easily, conversations spark new ideas, and connecting with siblings, neighbours, or local community feels especially rewarding.',
        lt: 'Šis Mėnulis nusileidžia tiesiai jūsų bendravimo zonoje, sustiprinant viską, ką paliečia. Žodžiai teka lengvai, pokalbiai žadina naujas idėjas, ir ryšys su broliais, seserimis, kaimynais ar vietine bendruomene jaučiasi ypač atlyginantis.',
      },
      4: {
        en: 'Your home life feels busier than usual — phone calls, messages, visitors, or family discussions fill the space. Embrace the social energy in your private world, but carve out moments of quiet if it becomes overwhelming.',
        lt: 'Jūsų namų gyvenimas šiandien jaučiasi judresnis nei įprastai — telefono skambučiai, žinutės, lankytojai ar šeimos diskusijos užpildo erdvę. Priimkite socialinę energiją savo privačiame pasaulyje, bet išsaugokite tylos akimirkas, jei tai tampa pernelyg.',
      },
      5: {
        en: 'Playful, witty creative energy is abundant. Writing, word games, comedy, or any art form that involves language and ideas thrives under this Moon. Romance, too, benefits from clever conversation and lightness.',
        lt: 'Žaisminga, sąmojinga kūrybinė energija gausiai liejasi. Rašymas, žodžių žaidimai, komedija ar bet kokia meno forma, susijusi su kalba ir idėjomis, klesti šiame Mėnulyje. Romantika taip pat turi naudos iš sumanaus pokalbio ir lengvumo.',
      },
      6: {
        en: 'Mental restlessness may disguise itself as physical agitation. Vary your daily routine — a different walking route, a new podcast during chores, or simply rearranging your workspace can satisfy the need for novelty.',
        lt: 'Protinė neramybė gali apsimesti fiziniu sujaudinimu. Įvairuokite savo kasdienę rutiną — kitoks pasivaikščiojimo maršrutas, nauja transliacijos laida ruošiant maistą ar tiesiog darbo erdvės pertvarka gali patenkinti naujovės poreikį.',
      },
      7: {
        en: 'Communication is the key to your partnerships today. Have the conversation you have been postponing, share an interesting article with your partner, or simply enjoy the pleasure of talking together without an agenda.',
        lt: 'Bendravimas yra jūsų partnerysčių raktas šiandien. Turėkite pokalbį, kurį atidėliojote, pasidalinkite įdomiu straipsniu su partneriu ar tiesiog mėgaukitės malonumu kalbėtis kartu be plano.',
      },
      8: {
        en: 'Curiosity draws you toward deeper subjects — psychology, mystery, or taboo topics. Exploring these intellectually rather than emotionally can bring surprising insights about your own hidden patterns.',
        lt: 'Smalsumas traukia jus prie gilesnių temų — psichologijos, paslapčių ar tabu temų. Šių dalykų tyrinėjimas intelektualiai, o ne emociškai, gali atnešti stebinančių įžvalgų apie jūsų pačių paslėptus modelius.',
      },
      9: {
        en: 'Your mind reaches for the big picture. Enrol in a short course, read widely, or engage in a spirited debate about beliefs. Intellectual expansion feeds your soul more than physical travel today.',
        lt: 'Jūsų protas siekia didžiojo vaizdo. Įsirašykite į trumpus kursus, skaitykite plačiai ar dalyvaukite gyvame debate apie įsitikinimus. Intelektualinė plėtra šiandien maitina jūsų sielą labiau nei fizinės kelionės.',
      },
      10: {
        en: 'Networking and communication skills are your professional superpower right now. Share your ideas, write that proposal, or make the call you have been putting off — your words carry extra weight.',
        lt: 'Bendravimo ir ryšių įgūdžiai yra jūsų profesinė supergalia dabar. Dalinkitės idėjomis, rašykite tą pasiūlymą ar skambinkite tuo skambučiu, kurį atidėliojote — jūsų žodžiai turi papildomą svorį.',
      },
      11: {
        en: 'Social connections multiply and energise you. Group chats, community events, or brainstorming sessions with friends feel stimulating. You are the connector today — bring people and ideas together.',
        lt: 'Socialiniai ryšiai dauginasi ir energizuoja jus. Grupiniai pokalbiai, bendruomenės renginiai ar protų šturmai su draugais jaučiasi stimuliuojantys. Šiandien jūs esate jungiklis — sutelkite žmones ir idėjas.',
      },
      12: {
        en: 'Your inner world is talkative — thoughts race and the mind resists stillness. Journaling, guided meditation, or reading spiritual texts can channel this mental energy into meaningful inner exploration.',
        lt: 'Jūsų vidinis pasaulis yra kalbantis — mintys lekia ir protas priešinasi tylai. Dienoraščio rašymas, vedama meditacija ar dvasinių tekstų skaitymas gali nukreipti šią protinę energiją į prasmingą vidinį tyrinėjimą.',
      },
    },
  },
  cancer: {
    general: {
      en: 'The Moon is at home in Cancer, deepening sensitivity and the need for emotional safety. Nurturing yourself and others feels instinctive today. Home, family, and familiar comforts hold special meaning.',
      lt: 'Mėnulis namuose Vėžyje, gilina jautrumą ir emocinio saugumo poreikį. Savęs ir kitų puoselėjimas jaučiasi instinktyviai šiandien. Namai, šeima ir pažįstami komfortai turi ypatingą reikšmę.',
    },
    themeKeywords: {
      en: ['nurturing', 'home', 'emotional safety'],
      lt: ['puoselėjimas', 'namai', 'emocinis saugumas'],
    },
    personalByHouse: {
      1: {
        en: 'Your emotional sensitivity is heightened and your personal energy turns inward. Honour whatever feelings arise without judging them — this Moon invites you to be tender with yourself.',
        lt: 'Jūsų emocinis jautrumas sustiprėjęs ir asmeninė energija pasisuka į vidų. Pagerbkite bet kokius kylančius jausmus jų neteisdami — šis Mėnulis kviečia būti švelniais su savimi.',
      },
      2: {
        en: 'Financial security feels more emotionally charged than usual. The desire to feel safe through material comfort is strong. Review your savings or create a budget that genuinely supports your wellbeing.',
        lt: 'Finansinis saugumas jaučiasi labiau emociškai svarbus nei įprastai. Noras jaustis saugiai per materialinį komfortą yra stiprus. Peržiūrėkite savo santaupas ar sukurkite biudžetą, kuris tikrai palaiko jūsų gerovę.',
      },
      3: {
        en: 'Conversations take on an emotional depth today. You may find yourself sharing more vulnerably with siblings, neighbours, or close contacts. Heartfelt exchanges can heal old misunderstandings.',
        lt: 'Pokalbiai šiandien įgauna emocinį gilumą. Galite pastebėti, kad dalindamiesi labiau pažeidžiamai su broliais, seserimis, kaimynais ar artimais kontaktais. Nuoširdūs pokalbiai gali išgydyti senus nesusipratimus.',
      },
      4: {
        en: 'This Moon activates your deepest sense of home and belonging. Cooking a family recipe, calling a parent, or simply nesting in your favourite space brings profound comfort and emotional renewal.',
        lt: 'Šis Mėnulis aktyvuoja giliausią namų ir priklausymo pojūtį. Šeimos recepto gaminimas, skambutis tėvams ar tiesiog poilsis mėgstamoje erdvėje suteikia gilų komfortą ir emocinį atsinaujinimą.',
      },
      5: {
        en: 'Your creative expression draws from deep emotional wells today. Art, music, or writing that channels your feelings can be genuinely moving — both for you and anyone who experiences it. Romance feels tender and intimate.',
        lt: 'Jūsų kūrybinė raiška šiandien semiasi iš gilių emocinių šaltinių. Menas, muzika ar rašymas, nukreipiantis jūsų jausmus, gali būti tikrai jaudinantis — tiek jums, tiek visiems, kurie tai patiria. Romantika jaučiasi švelni ir intymi.',
      },
      6: {
        en: 'Emotional stress may manifest physically today. Pay attention to your stomach and digestive system. Warm, nourishing food, gentle routines, and adequate rest are more important than pushing through.',
        lt: 'Emocinis stresas šiandien gali pasireikšti fiziškai. Atkreipkite dėmesį į skrandį ir virškinimo sistemą. Šiltas, maistingas maistas, švelnios rutinos ir pakankamas poilsis yra svarbiau nei stumti save per jėgą.',
      },
      7: {
        en: 'You need emotional attunement from your closest relationships. Ask for comfort if you need it, and offer it generously in return. Vulnerability is strength in partnerships right now.',
        lt: 'Jums reikia emocinio derinamasis iš artimiausių santykių. Prašykite paguodos, jei jums jos reikia, ir dosniai ją siūlykite mainais. Pažeidžiamumas dabar yra stiprybė partnerystėse.',
      },
      8: {
        en: 'Deep emotional currents run through you today, stirring memories, attachments, and old wounds. Allow the feelings to surface — processing them honestly is the most healing thing you can do.',
        lt: 'Gilios emocinės srovės teka per jus šiandien, sujudindamos prisiminimus, prisirišimus ir senas žaizdas. Leiskite jausmams iškilti — sąžiningas jų apdorojimas yra labiausiai gydantis dalykas, kurį galite padaryti.',
      },
      9: {
        en: 'Your search for meaning turns emotional and personal. Rather than abstract philosophy, you crave wisdom rooted in lived experience — stories, traditions, and teachings that speak to the heart.',
        lt: 'Jūsų prasmės paieška tampa emocinė ir asmeninė. Užuot ieškojote abstrakčios filosofijos, trokštate išminties, įsišaknijusios gyvenimo patirtyje — istorijų, tradicijų ir mokymų, kurie kalba širdžiai.',
      },
      10: {
        en: 'Your professional life benefits from emotional intelligence today. Read the room, trust your intuition about colleagues, and lead with empathy. People respond to genuine care more than polished performance.',
        lt: 'Jūsų profesinis gyvenimas gauna naudos iš emocinio intelekto šiandien. Skaitykite atmosferą, pasitikėkite savo intuicija dėl kolegų ir vadovaukite su empatija. Žmonės reaguoja į tikrą rūpestį labiau nei į nušlifuotą pasirodymą.',
      },
      11: {
        en: 'You seek emotional belonging within your social circles. Surface-level interactions leave you cold — look for the friends and groups where you can be authentically yourself without pretence.',
        lt: 'Ieškote emocinio priklausymo savo socialiniuose ratuose. Paviršutiniški santykiai jums šalta — ieškokite draugų ir grupių, kur galite būti autentiškai savimi be pretenzijų.',
      },
      12: {
        en: 'The boundary between your conscious mind and deeper psyche is thin. Dreams may be vivid and emotionally charged. A gentle meditation practice focused on self-compassion can bring profound inner peace.',
        lt: 'Riba tarp jūsų sąmoningo proto ir gilesnės psichikos yra plona. Sapnai gali būti ryškūs ir emociškai įkrauti. Švelni meditacijos praktika, orientuota į savigailą, gali atnešti gilią vidinę ramybę.',
      },
    },
  },
  leo: {
    general: {
      en: 'The Moon in Leo warms the heart and calls for creative expression. There is a need to be seen, appreciated, and celebrated. Generosity flows easily, and joy is found in playfulness, art, and heartfelt connection.',
      lt: 'Mėnulis Liūte sušildo širdį ir kviečia kūrybinei raiškai. Yra poreikis būti pastebėtam, įvertintam ir pagerbtam. Dosnumas teka lengvai, o džiaugsmas randamas žaismingume, mene ir nuoširdžiame ryšyje.',
    },
    themeKeywords: {
      en: ['creativity', 'self-expression', 'warmth'],
      lt: ['kūrybiškumas', 'saviraiška', 'šiluma'],
    },
    personalByHouse: {
      1: {
        en: 'You radiate warmth and confidence today. Your personal magnetism is amplified — this is a time to show up fully as yourself, without dimming your light for anyone. Others are drawn to your authenticity.',
        lt: 'Šiandien spinduliuojate šilumą ir pasitikėjimą. Jūsų asmeninis magnetizmas sustiprėjęs — tai laikas pasirodyti visa savo esybe, niekam negesindami savo šviesos. Kiti traukiami prie jūsų autentiškumo.',
      },
      2: {
        en: 'Generosity with money and resources feels natural, but ensure it aligns with your values rather than a desire for recognition. Investing in things that bring genuine joy — not just status — is the wisest use of this energy.',
        lt: 'Dosnumas su pinigais ir ištekliais jaučiasi natūraliai, bet įsitikinkite, kad tai atitinka jūsų vertybes, o ne pripažinimo troškimą. Investavimas į dalykus, kurie atneša tikrą džiaugsmą — ne tik statusą — yra protingiausia šios energijos panaudojimas.',
      },
      3: {
        en: 'Your words carry dramatic flair and heartfelt conviction. Public speaking, creative writing, or any form of expressive communication shines today. Share your story — people are listening.',
        lt: 'Jūsų žodžiai turi dramatišką pakilumą ir nuoširdų įsitikinimą. Viešas kalbėjimas, kūrybinis rašymas ar bet kokia išraiškingo bendravimo forma šiandien šviečia. Dalinkitės savo istorija — žmonės klausosi.',
      },
      4: {
        en: 'You may want to make your home more beautiful, host a gathering, or bring warmth and celebration into your private world. Your family benefits from your generous, open-hearted presence.',
        lt: 'Galite norėti padaryti savo namus gražesniais, surengti susibūrimą ar atnešti šilumos ir šventimo į savo privatų pasaulį. Jūsų šeima gauna naudos iš jūsų dosno, atviros širdies buvimo.',
      },
      5: {
        en: 'Creative fire burns brightly and joyfully. This Moon lands in its most natural territory for you — artistic expression, romance, play, and anything that makes your heart sing are deeply favoured.',
        lt: 'Kūrybinė ugnis dega ryškiai ir džiaugsmingai. Šis Mėnulis nusileidžia natūraliausioje teritorijoje jums — meninė raiška, romantika, žaidimas ir viskas, kas dainuoja jūsų širdžiai, yra labai palankiai vertinami.',
      },
      6: {
        en: 'Your daily routines benefit from a touch of flair and pleasure. Make your workout feel like a celebration, prepare food that delights the senses, and approach mundane tasks with pride rather than drudgery.',
        lt: 'Jūsų kasdienės rutinos gauna naudos iš prabangos ir malonumo prisilietimo. Paverkite savo treniruotę švente, paruoškite maistą, kuris džiugina pojūčius, ir imkitės kasdienių užduočių su pasididžiavimu, o ne nuoboduliu.',
      },
      7: {
        en: 'You want to be appreciated and admired by your partner or closest collaborator. Express your affection generously and openly — and allow yourself to receive the same warmth in return.',
        lt: 'Norite būti įvertinti ir žavimi savo partnerio ar artimiausio bendradarbio. Reikškite savo meilę dosniai ir atvirai — ir leiskite sau priimti tokią pat šilumą mainais.',
      },
      8: {
        en: 'Pride may resist the vulnerability that deep transformation requires. Yet beneath your confident exterior, something is shifting. Allow yourself to be seen in your wholeness — strength and tenderness together.',
        lt: 'Puikybė gali priešintis pažeidžiamumui, kurio reikalauja gili transformacija. Tačiau po jūsų pasitikėjimu savimi, kažkas keičiasi. Leiskite sau būti matytam visa savo pilnatve — stiprybė ir švelnumas kartu.',
      },
      9: {
        en: 'Grand adventures and expansive learning call to you. Whether it is travelling to an inspiring destination or diving into a subject that ignites your passion, your spirit craves meaningful expansion.',
        lt: 'Dideli nuotykiai ir plati mokymasis kviečia jus. Nesvarbu, ar tai kelionė į įkvepiančią vietą, ar pasinėrimas į temą, kuri uždega jūsų aistrą — jūsų dvasia trokšta prasmingos plėtros.',
      },
      10: {
        en: 'Your professional presence is commanding today. Step into leadership, present your ideas with confidence, and allow your natural authority to shine. Recognition for your efforts is closer than you think.',
        lt: 'Jūsų profesinis buvimas šiandien yra įsakmus. Įženkit į lyderystę, pristatykite savo idėjas su pasitikėjimu ir leiskite savo natūraliam autoritetui spindėti. Pripažinimas už jūsų pastangas yra arčiau, nei manote.',
      },
      11: {
        en: 'You are drawn to lead or inspire within your social circles. Organise a gathering, champion a collective cause, or simply bring your warmth to a group setting — your generosity of spirit lifts everyone.',
        lt: 'Jaučiatės patraukti vadovauti ar įkvėpti savo socialiniuose ratuose. Organizuokite susibūrimą, remkite kolektyvinę bylą ar tiesiog atneškite savo šilumą į grupinę aplinką — jūsų dvasios dosnumas pakelia visus.',
      },
      12: {
        en: 'Creative visualisation and heart-centred meditation work beautifully for you today. Your inner world needs warmth and light — approach your spiritual practice with the same passion you bring to everything else.',
        lt: 'Kūrybinė vizualizacija ir širdimi vadovaujama meditacija puikiai veikia jums šiandien. Jūsų vidinis pasaulis reikalauja šilumos ir šviesos — artėkite prie savo dvasinės praktikos su tokia pat aistra, kokią suteikiate viskam kitam.',
      },
    },
  },
  virgo: {
    general: {
      en: 'The Moon in Virgo brings a quiet urge to organise, refine, and attend to the details of daily life. Emotional fulfilment comes through service, problem-solving, and creating order from chaos. Be gentle with yourself — perfectionism is the shadow here.',
      lt: 'Mėnulis Mergelėje sukelia tylų norą organizuoti, tobulinti ir rūpintis kasdienio gyvenimo detalėmis. Emocinis pasitenkinimas ateina per tarnavimą, problemų sprendimą ir tvarkos kūrimą iš chaoso. Būkite švelnūs su savimi — perfekcionizmas yra šešėlis čia.',
    },
    themeKeywords: {
      en: ['organisation', 'service', 'refinement'],
      lt: ['organizavimas', 'tarnavimas', 'tobulinimas'],
    },
    personalByHouse: {
      1: {
        en: 'A quiet urge to improve yourself surfaces today. Channel this constructively — gentle refinement rather than harsh self-criticism. Your attention to detail and desire for integrity are genuine strengths.',
        lt: 'Tylus noras tobulėti iškyla šiandien. Nukreipkite tai konstruktyviai — švelnų tobulinimą, o ne griežtą savikritika. Jūsų dėmesys detalėms ir vientisumo troškimas yra tikros stiprybės.',
      },
      2: {
        en: 'Financial organisation comes naturally under this Moon. Reviewing budgets, sorting receipts, or creating a practical savings plan brings genuine satisfaction and a sense of order to your material world.',
        lt: 'Finansinis organizavimas ateina natūraliai šiame Mėnulyje. Biudžetų peržiūra, kvitų tvarkymas ar praktinio taupymo plano sukūrimas suteikia tikrą pasitenkinimą ir tvarkos pojūtį jūsų materialiniame pasaulyje.',
      },
      3: {
        en: 'Your thinking is precise and analytical today. Editing, proofreading, problem-solving conversations, and detailed planning all benefit from this Moon\'s sharp mental focus. Speak with care and clarity.',
        lt: 'Jūsų mąstymas šiandien yra tikslus ir analitiškas. Redagavimas, korektūra, problemų sprendimo pokalbiai ir detalus planavimas — visa tai gauna naudos iš šio Mėnulio aštraus protinio dėmesio. Kalbėkite rūpestingai ir aiškiai.',
      },
      4: {
        en: 'Cleaning, organising, and tending to household details brings emotional satisfaction. Your home environment directly affects your inner peace right now — creating order in your space creates calm in your mind.',
        lt: 'Valymas, tvarkymas ir namų detalių priežiūra suteikia emocinį pasitenkinimą. Jūsų namų aplinka tiesiogiai veikia jūsų vidinę ramybę dabar — tvarkos kūrimas erdvėje sukuria ramybę prote.',
      },
      5: {
        en: 'Your creative work benefits from meticulous attention to craft. Refine rather than start from scratch — editing a draft, perfecting a technique, or polishing a project yields better results than beginning something new.',
        lt: 'Jūsų kūrybinis darbas gauna naudos iš kruopštaus dėmesio amatui. Tobulinkite, o ne pradėkite iš naujo — juodraščio redagavimas, technikos tobulinimas ar projekto šlifavimas duoda geresnius rezultatus nei kažko naujo pradėjimas.',
      },
      6: {
        en: 'This Moon activates your daily health and wellness with particular strength. Schedule that check-up, revise your diet, or establish a more sustainable daily rhythm. Small, practical improvements add up to significant wellbeing.',
        lt: 'Šis Mėnulis aktyvuoja jūsų kasdienę sveikatą ir savijautą ypatingai stipriai. Suplanuokite tą apsilankymą, peržiūrėkite savo dietą ar sukurkite tvaresnį kasdienį ritmą. Maži, praktiški patobulinimai sudaro reikšmingą gerovę.',
      },
      7: {
        en: 'You may notice imperfections in your partnerships more acutely than usual. Practise discernment without criticism — offering helpful support is generous, but expecting perfection from others leads to frustration.',
        lt: 'Galite pastebėti trūkumus savo partnerystėse aštriau nei įprastai. Praktikuokite įžvalgumą be kritikos — pagalbos siūlymas yra dosnus, bet tobulumo tikėjimasis iš kitų veda prie nusivylimo.',
      },
      8: {
        en: 'Analytical energy applied to your deeper psychological patterns can yield real breakthroughs. Journaling, therapy, or honest self-assessment helps you understand and heal what has been hidden.',
        lt: 'Analitinė energija, pritaikyta jūsų gilesniems psichologiniams modeliams, gali duoti tikrų proveržių. Dienoraščio rašymas, terapija ar sąžininga savianalizė padeda suprasti ir išgydyti tai, kas buvo paslėpta.',
      },
      9: {
        en: 'You crave practical wisdom — not grand theories but applicable knowledge. A workshop, a skill-building course, or reading that offers concrete guidance satisfies this Moon\'s hunger for useful learning.',
        lt: 'Trokštate praktinės išminties — ne didingų teorijų, o pritaikomo žinojimo. Seminaras, įgūdžių ugdymo kursas ar skaitymas, siūlantis konkrečius patarimus, patenkina šio Mėnulio naudingo mokymosi alkį.',
      },
      10: {
        en: 'Professional diligence and attention to quality set you apart today. Focus on doing excellent work rather than seeking attention. Your thoroughness will be noticed by the people who matter most.',
        lt: 'Profesinis kruopštumas ir dėmesys kokybei jus išskiria šiandien. Susikoncentruokite į puikų darbą, o ne į dėmesio paiešką. Jūsų nuodugnumas bus pastebėtas žmonių, kurie labiausiai svarbūs.',
      },
      11: {
        en: 'You are most helpful to your community when you contribute practical skills rather than just good intentions. Volunteer your expertise, organise logistics, or help a friend solve a tangible problem.',
        lt: 'Esate naudingiausi savo bendruomenei, kai prisidedate praktiniais įgūdžiais, o ne tik gerais ketinimais. Pasiūlykite savo kompetenciją, organizuokite logistiką ar padėkite draugui išspręsti apčiuopiamą problemą.',
      },
      12: {
        en: 'The inner critic may be louder than usual. Counter it with a mindfulness practice that emphasises acceptance over improvement. You do not need to fix your inner world — just observe it with compassion.',
        lt: 'Vidinis kritikas šiandien gali būti garsesnis nei įprastai. Atremkite jį sąmoningumo praktika, pabrėžiančia priėmimą, o ne tobulinimą. Jums nereikia taisyti savo vidinio pasaulio — tiesiog stebėkite jį su užuojauta.',
      },
    },
  },
  libra: {
    general: {
      en: 'The Moon in Libra seeks harmony and balance. Relationships take centre stage — this is a time for meaningful conversations, compromise, and appreciating beauty in your surroundings. Diplomacy comes naturally, but be mindful of people-pleasing.',
      lt: 'Mėnulis Svarstyklėse ieško harmonijos ir pusiausvyros. Santykiai užima pagrindinę sceną — tai laikas prasmingam pokalbiui, kompromisui ir grožio vertinimui aplinkoje. Diplomatija ateina natūraliai, bet saugokitės noro visiems įtikti.',
    },
    themeKeywords: {
      en: ['harmony', 'relationships', 'balance'],
      lt: ['harmonija', 'santykiai', 'pusiausvyra'],
    },
    personalByHouse: {
      1: {
        en: 'Your sense of self is filtered through your connections with others today. While harmony is valuable, ensure you are not losing yourself in the process of keeping the peace. Your needs matter too.',
        lt: 'Jūsų savęs pojūtis šiandien filtruojamas per jūsų ryšius su kitais. Nors harmonija yra vertinga, įsitikinkite, kad neprarandate savęs stengdamiesi palaikyti taiką. Jūsų poreikiai taip pat svarbūs.',
      },
      2: {
        en: 'Financial decisions benefit from weighing all options carefully. This is a good time for joint financial planning, negotiating fair agreements, or investing in beauty and aesthetics that enrich your daily life.',
        lt: 'Finansiniai sprendimai turi naudos iš visų galimybių kruopštaus pasvėrimo. Tai geras metas bendram finansiniam planavimui, sąžiningų susitarimų deryboms ar investavimui į grožį ir estetiką, kuri praturtina kasdienį gyvenimą.',
      },
      3: {
        en: 'Diplomacy comes naturally to your conversations. You instinctively find the right words to soothe, mediate, and connect. Use this gift to facilitate understanding between people who see things differently.',
        lt: 'Diplomatija jūsų pokalbiuose ateina natūraliai. Instinktyviai randate tinkamus žodžius nuraminti, tarpininkauti ir susieti. Naudokite šią dovaną skatinti supratimą tarp žmonių, kurie mato dalykus skirtingai.',
      },
      4: {
        en: 'Beautifying your home environment brings deep emotional satisfaction. Fresh flowers, rearranged furniture, or simply creating a more harmonious atmosphere in your private space nourishes your spirit.',
        lt: 'Namų aplinkos pagražinimas suteikia gilų emocinį pasitenkinimą. Šviežios gėlės, pertvarkyti baldai ar tiesiog harmoningesnės atmosferos kūrimas jūsų privačioje erdvėje maitina jūsų dvasią.',
      },
      5: {
        en: 'Artistic expression flows with grace and elegance. Collaborative creative projects are especially favoured — working with a partner or small group produces something more beautiful than you could create alone.',
        lt: 'Meninė raiška teka su malone ir elegancija. Bendri kūrybiniai projektai ypač palankūs — darbas su partneriu ar maža grupe sukuria kažką gražesnio, nei galėtumėte sukurti vienas.',
      },
      6: {
        en: 'Balance is the keyword for your wellbeing today. Neither overwork nor complete rest — find the middle path. Gentle movement paired with aesthetic pleasure, such as yoga in a beautiful setting, suits this Moon perfectly.',
        lt: 'Pusiausvyra yra raktinis žodis jūsų gerovei šiandien. Nei perdarbas, nei visiškas poilsis — suraskite vidurio kelią. Švelnus judėjimas kartu su estetiniu malonumu, pavyzdžiui, joga gražioje aplinkoje, puikiai tinka šiam Mėnuliui.',
      },
      7: {
        en: 'This Moon lands directly in your partnership zone, amplifying your need for connection, fairness, and mutual understanding. Honest, balanced conversations with your closest person can deepen intimacy significantly.',
        lt: 'Šis Mėnulis nusileidžia tiesiai jūsų partnerystės zonoje, sustiprinant jūsų ryšio, sąžiningumo ir abipusio supratimo poreikį. Sąžiningi, subalansuoti pokalbiai su artimiausiu žmogumi gali reikšmingai pagilinti artumą.',
      },
      8: {
        en: 'Deep changes are easier to navigate when you do not face them alone. Share your inner process with someone you trust — the mirror of relationship helps you see your transformation more clearly.',
        lt: 'Gilius pokyčius lengviau įveikti, kai nesusiduri su jais vienas. Pasidalinkite savo vidiniu procesu su kuo nors, kuo pasitikite — santykių veidrodis padeda aiškiau pamatyti savo transformaciją.',
      },
      9: {
        en: 'Your intellectual curiosity gravitates toward art, culture, and ideas about justice and beauty. Visit a gallery, explore a different cultural perspective, or read about the philosophy of aesthetics.',
        lt: 'Jūsų intelektualinis smalsumas gravituoja link meno, kultūros ir idėjų apie teisingumą ir grožį. Aplankykite galeriją, tyrinėkite kitą kultūrinę perspektyvą ar skaitykite apie estetikos filosofiją.',
      },
      10: {
        en: 'Professional relationships and diplomacy are your strongest career assets today. Networking, mediating workplace tensions, or presenting ideas with grace and charm advances your position naturally.',
        lt: 'Profesiniai santykiai ir diplomatija yra jūsų stipriausi karjeros pranašumai šiandien. Bendravimas, darbo vietos įtampų tarpininkavimas ar idėjų pristatymas su malone ir žavesiu natūraliai kelia jūsų poziciją.',
      },
      11: {
        en: 'Social harmony within your groups and friendships matters deeply. You may find yourself mediating between friends or bringing balance to a community dynamic. Your fairness is genuinely appreciated.',
        lt: 'Socialinė harmonija jūsų grupėse ir draugystėse giliai svarbi. Galite rasti save tarpininkaujant tarp draugų ar atnešant pusiausvyrą į bendruomenės dinamiką. Jūsų sąžiningumas tikrai vertinamas.',
      },
      12: {
        en: 'Inner peace comes through finding balance between solitude and connection. A meditation practice focused on equilibrium — balancing breath, balancing energy — helps you access deeper serenity.',
        lt: 'Vidinė ramybė ateina ieškant pusiausvyros tarp vienatvės ir ryšio. Meditacijos praktika, orientuota į pusiausvyrą — subalansuotą kvėpavimą, subalansuotą energiją — padeda pasiekti gilesnę ramybę.',
      },
    },
  },
  scorpio: {
    general: {
      en: 'The Moon in Scorpio intensifies emotions and draws attention to what lies beneath the surface. Deep feelings, hidden truths, and powerful instincts come alive. This is a potent time for healing, intimacy, and honest self-examination.',
      lt: 'Mėnulis Skorpione sustiprina emocijas ir nukreipia dėmesį į tai, kas slypi po paviršiumi. Gilūs jausmai, paslėptos tiesos ir galingi instinktai atgyja. Tai galingas laikas gijimui, artumui ir sąžiningam savianalizei.',
    },
    themeKeywords: {
      en: ['intensity', 'depth', 'transformation'],
      lt: ['intensyvumas', 'gelmė', 'transformacija'],
    },
    personalByHouse: {
      1: {
        en: 'Emotional intensity colours your entire sense of self today. You feel things deeply and see through surface appearances with penetrating clarity. Use this power wisely — not everyone can handle your depth.',
        lt: 'Emocinė intensyvumas šiandien nuspalvina visą jūsų savęs pojūtį. Jaučiate dalykus giliai ir matote per paviršiaus apraiškas su prasiskverbiančiu aiškumu. Naudokite šią galią išmintingai — ne visi gali susidoroti su jūsų gelme.',
      },
      2: {
        en: 'Financial matters take on an intense, strategic quality. This is a powerful time for investigating investments, eliminating unnecessary expenses, or confronting money fears honestly. Financial truth-telling leads to empowerment.',
        lt: 'Finansiniai reikalai įgauna intensyvų, strateginį pobūdį. Tai galingas metas tyrinėti investicijas, šalinti nereikalingas išlaidas ar sąžiningai susidurti su pinigų baimėmis. Finansinė tiesos sakymas veda prie įgalinimo.',
      },
      3: {
        en: 'Your words carry unusual weight and depth today. Conversations may veer into emotionally charged territory — this can be profoundly healing if approached with honesty, or destructive if wielded carelessly.',
        lt: 'Jūsų žodžiai šiandien turi neįprastą svorį ir gelmę. Pokalbiai gali nukrypti į emociškai įkrautą teritoriją — tai gali būti giliai gydanti, jei artėjama su sąžiningumu, arba griaunanti, jei valdoma neatsargiai.',
      },
      4: {
        en: 'Powerful emotions about family, roots, and belonging may surface. Old family dynamics or childhood memories ask for your attention. Healing work done in the privacy of your own space is deeply transformative.',
        lt: 'Galingi jausmai apie šeimą, šaknis ir priklausymą gali iškilti. Senos šeimos dinamikos ar vaikystės prisiminimai prašo jūsų dėmesio. Gijimo darbas, atliekamas jūsų pačių erdvės privatume, yra giliai transformuojantis.',
      },
      5: {
        en: 'Creative expression plunges into the depths today. Art, writing, or music that explores intense themes — love, loss, power, rebirth — channels this Moon\'s energy into something genuinely moving.',
        lt: 'Kūrybinė raiška šiandien pasineria į gelmes. Menas, rašymas ar muzika, tyrinėjanti intensyvias temas — meilę, netektį, galią, atgimimą — nukreipia šio Mėnulio energiją į kažką tikrai jaudinančio.',
      },
      6: {
        en: 'Hidden health patterns may come to your attention. Listen to your body\'s subtler signals and investigate anything that has been nagging. Elimination, detoxification, and releasing what no longer serves your physical wellbeing are favoured.',
        lt: 'Paslėpti sveikatos modeliai gali atkreipti jūsų dėmesį. Klausykitės savo kūno subtilesnių signalų ir tyrinėkite viską, kas jus kamavo. Šalinimas, detoksikacija ir to, kas nebetarnauja jūsų fizinei gerovei, paleidimas yra palankūs.',
      },
      7: {
        en: 'Intimacy and honesty define your partnerships today. Surface-level pleasantries feel hollow — you crave genuine emotional connection and are willing to go to uncomfortable places to find it.',
        lt: 'Artumas ir sąžiningumas apibrėžia jūsų partnerystes šiandien. Paviršutiniškos mandagybės jaučiasi tuščiai — jūs trokštate tikro emocinio ryšio ir esate pasiruošę eiti į nepatogias vietas, kad jį rastumėte.',
      },
      8: {
        en: 'This Moon activates your most transformative zone with extraordinary power. Deep psychological work, confronting fears, and allowing emotional death-and-rebirth cycles to complete themselves is profoundly healing.',
        lt: 'Šis Mėnulis aktyvuoja jūsų transformatyviausią zoną su nepaprastą galia. Gili psichologinė veikla, baimių susidurimasis ir emocinių mirties ir atgimimo ciklų leidimas užsibaigti yra giliai gydantis.',
      },
      9: {
        en: 'Your quest for meaning goes beyond the intellectual — you want to know the hidden truth beneath appearances. Esoteric studies, depth psychology, or travelling to places with powerful spiritual history calls to you.',
        lt: 'Jūsų prasmės paieška eina toliau nei intelektualinė — norite žinoti paslėptą tiesą po paviršiumi. Ezoterinės studijos, gelmių psichologija ar kelionės į vietas su galinga dvasine istorija kviečia jus.',
      },
      10: {
        en: 'Strategic thinking and emotional intelligence give you a professional advantage. You can read power dynamics clearly and navigate complex situations with precision. Use this insight ethically for lasting career growth.',
        lt: 'Strateginis mąstymas ir emocinis intelektas suteikia jums profesinį pranašumą. Galite aiškiai skaityti galios dinamiką ir naviguoti sudėtingas situacijas su tikslumu. Naudokite šią įžvalgą etiškai ilgalaikiam karjeros augimui.',
      },
      11: {
        en: 'You seek depth in your friendships and group connections. Superficial social gatherings drain you — one meaningful conversation with a trusted friend is worth more than a room full of acquaintances.',
        lt: 'Ieškote gelmės savo draugystėse ir grupiniuose ryšiuose. Paviršutiniški socialiniai susibūrimai jus alina — vienas prasmingas pokalbis su patikimu draugu yra vertesnis nei kambarys pilnas pažįstamų.',
      },
      12: {
        en: 'The veil between your conscious mind and the unconscious is exceptionally thin. Dreams, synchronicities, and psychic impressions may be unusually vivid. Trust what surfaces from the depths — it carries wisdom.',
        lt: 'Skydas tarp jūsų sąmoningo proto ir pasąmonės yra išskirtinai plonas. Sapnai, sinchroniškumai ir psichiniai įspūdžiai gali būti neįprastai ryškūs. Pasitikėkite tuo, kas iškyla iš gelmių — tai neša išmintį.',
      },
    },
  },
  sagittarius: {
    general: {
      en: 'The Moon in Sagittarius lifts the emotional tone toward optimism and adventure. There is a hunger for meaning, expansion, and freedom. Exploration — whether physical travel or philosophical inquiry — feeds the soul today.',
      lt: 'Mėnulis Šaulyje pakelia emocinį toną link optimizmo ir nuotykių. Yra alkis prasmei, plėtrai ir laisvei. Tyrinėjimas — tiek fizinė kelionė, tiek filosofinė paieška — maitina sielą šiandien.',
    },
    themeKeywords: {
      en: ['optimism', 'adventure', 'expansion'],
      lt: ['optimizmas', 'nuotykis', 'plėtra'],
    },
    personalByHouse: {
      1: {
        en: 'Optimism and restless energy infuse your sense of self. You feel larger than your usual boundaries and crave freedom to explore, grow, and discover new aspects of who you are becoming.',
        lt: 'Optimizmas ir nerami energija pripildo jūsų savęs pojūtį. Jaučiatės didesni nei įprastos ribos ir trokštate laisvės tyrinėti, augti ir atrasti naujas savo tapimo puses.',
      },
      2: {
        en: 'Generosity with money comes naturally, but watch for overextending. This is a good time to invest in education, travel, or experiences that broaden your horizons rather than accumulating possessions.',
        lt: 'Dosnumas su pinigais ateina natūraliai, bet saugokitės per didelio išsitempimo. Tai geras metas investuoti į švietimą, keliones ar patirtis, kurios praplečia jūsų horizontus, o ne kaupti daiktus.',
      },
      3: {
        en: 'Your conversations are animated by big ideas and infectious enthusiasm. You speak with conviction and inspire others with your vision. Just ensure you listen as generously as you speak.',
        lt: 'Jūsų pokalbiai gyvina didelės idėjos ir užkrečiantis entuziazmas. Kalbate su įsitikinimu ir įkvepia kitus savo vizija. Tik įsitikinkite, kad klausotės taip pat dosniai, kaip kalbate.',
      },
      4: {
        en: 'Your home may feel too small for your spirit today. If you cannot physically travel, bring the world home — cook a foreign cuisine, video-call a distant friend, or rearrange your space to feel more open and expansive.',
        lt: 'Jūsų namai šiandien gali jaustis per maži jūsų dvasiai. Jei negalite fiziškai keliauti, atneškite pasaulį namo — paruoškite užsienio virtuvę, paskambinkite tolimam draugui vaizdo skambučiu ar pertvarkyti savo erdvę, kad jaustųsi atviresnė ir erdvesnė.',
      },
      5: {
        en: 'Joy and creative freedom are abundant. Follow whatever sparks your enthusiasm without worrying about perfection. Playful experimentation, adventurous dates, or spontaneous creative expression feeds your soul.',
        lt: 'Džiaugsmas ir kūrybinė laisvė gausiai liejasi. Sekite tuo, kas žadina jūsų entuziazmą, nesirūpindami tobulumu. Žaismingas eksperimentavimas, nuotykių kupini pasimatymai ar spontaniška kūrybinė raiška maitina jūsų sielą.',
      },
      6: {
        en: 'Outdoor exercise and movement that feels like adventure rather than obligation suits you perfectly. A hike, a new sport, or simply exploring an unfamiliar part of your neighbourhood benefits both body and spirit.',
        lt: 'Lauko pratimai ir judėjimas, kuris jaučiasi kaip nuotykis, o ne pareiga, jums puikiai tinka. Žygis, naujas sportas ar tiesiog nežinomos jūsų kaimynystės dalies tyrinėjimas naudingas tiek kūnui, tiek dvasiai.',
      },
      7: {
        en: 'Freedom and honesty are what you need most from partnerships right now. Give your closest person space to be themselves, and claim the same for yourself. The best relationships make both people feel larger.',
        lt: 'Laisvė ir sąžiningumas yra tai, ko jums labiausiai reikia iš partnerysčių dabar. Suteikite artimiausiam žmogui erdvės būti savimi ir reikalaukite to paties sau. Geriausi santykiai abu žmones padaro didesniais.',
      },
      8: {
        en: 'You prefer to process deep emotions through meaning-making rather than sitting in discomfort. Finding the lesson, the growth, or the philosophical purpose in your pain is genuinely healing — not avoidance.',
        lt: 'Mieliau apdorojate gilius jausmus per prasmės kūrimą, o ne sėdėdami nepatogume. Pamokos, augimo ar filosofinio tikslo paieška jūsų skausme yra tikrai gydanti — ne vengimas.',
      },
      9: {
        en: 'This Moon lands in its most natural territory for you — your zone of wisdom, travel, and philosophical inquiry. Whether you book a journey, start a course, or simply follow your curiosity wherever it leads, expansion is inevitable.',
        lt: 'Šis Mėnulis nusileidžia natūraliausioje teritorijoje jums — jūsų išminties, kelionių ir filosofinės paieškos zonoje. Nesvarbu, ar planuojate kelionę, pradedate kursą ar tiesiog sekate savo smalsumą, kur jis veda — plėtra neišvengiama.',
      },
      10: {
        en: 'Big-picture career thinking is favoured over day-to-day details. Where do you want to be in five years? What legacy do you want to build? Let this Moon\'s visionary energy inform your professional direction.',
        lt: 'Didelio vaizdo karjeros mąstymas palankesnis nei kasdienės detalės. Kur norite būti po penkerių metų? Kokį palikimą norite palikti? Leiskite šio Mėnulio vizionieriškai energijai informuoti jūsų profesinę kryptį.',
      },
      11: {
        en: 'You are drawn to communities that share your ideals and love of learning. Teaching, mentoring, or joining a group united by a shared philosophy or cause feels deeply satisfying and purposeful.',
        lt: 'Traukia bendruomenės, kurios dalijasi jūsų idealais ir meile mokymuisi. Mokymas, mentorystė ar prisijungimas prie grupės, kurią vienija bendra filosofija ar reikalas, jaučiasi giliai patenkinantis ir prasmingas.',
      },
      12: {
        en: 'Spiritual restlessness drives you to explore beyond your usual practices. A new tradition, a pilgrimage, or simply asking bigger questions about existence can open doors you did not know were there.',
        lt: 'Dvasinis neramumas verčia jus tyrinėti toliau nei įprastos praktikos. Nauja tradicija, piligriminė kelionė ar tiesiog didesnių klausimų apie egzistenciją kėlimas gali atverti duris, apie kurias nežinojote.',
      },
    },
  },
  capricorn: {
    general: {
      en: 'The Moon in Capricorn steadies the emotional landscape with a focus on responsibility and long-term goals. There is a quiet determination in the air — feelings are processed practically, and accomplishment brings deep satisfaction.',
      lt: 'Mėnulis Ožiaragyje stabilizuoja emocinį kraštovaizdį dėmesiu atsakomybei ir ilgalaikiams tikslams. Oras persmelktas tylaus ryžto — jausmai apdorojami praktiškai, o pasiekimai teikia gilų pasitenkinimą.',
    },
    themeKeywords: {
      en: ['discipline', 'ambition', 'responsibility'],
      lt: ['disciplina', 'ambicija', 'atsakomybė'],
    },
    personalByHouse: {
      1: {
        en: 'A composed, determined energy settles over your sense of self. You feel capable and ready to handle whatever comes. This quiet strength is genuine — trust it and let it guide your actions today.',
        lt: 'Rami, ryžtinga energija nusileidžia ant jūsų savęs pojūčio. Jaučiatės pajėgūs ir pasiruošę susidoroti su bet kuo. Ši tyli stiprybė yra tikra — pasitikėkite ja ir leiskite jai vadovauti jūsų veiksmams šiandien.',
      },
      2: {
        en: 'Financial discipline and long-term planning feel natural and satisfying. This is an excellent time to set savings goals, review investments, or make practical decisions about your material security.',
        lt: 'Finansinė disciplina ir ilgalaikis planavimas jaučiasi natūraliai ir patenkinančiai. Tai puikus metas nustatyti taupymo tikslus, peržiūrėti investicijas ar priimti praktiškus sprendimus dėl materialinio saugumo.',
      },
      3: {
        en: 'Your words carry authority and gravitas today. Conversations about practical matters, professional plans, or serious topics feel most natural. People trust your judgement when you speak with this kind of quiet conviction.',
        lt: 'Jūsų žodžiai turi autoritetą ir svarumą šiandien. Pokalbiai apie praktiškus dalykus, profesinius planus ar rimtas temas jaučiasi natūraliausi. Žmonės pasitiki jūsų sprendimu, kai kalbate su šiuo tyliu įsitikinimu.',
      },
      4: {
        en: 'Responsibilities at home may feel heavier than usual, but tackling them brings deep satisfaction. Structural improvements, long-term family planning, or simply creating more order in your domestic life is grounding.',
        lt: 'Atsakomybės namuose gali jaustis sunkesnės nei įprastai, bet jų įveikimas suteikia gilų pasitenkinimą. Struktūriniai patobulinimai, ilgalaikis šeimos planavimas ar tiesiog daugiau tvarkos namų gyvenime yra įžeminantis.',
      },
      5: {
        en: 'Creative expression benefits from discipline and structure rather than free-form experimentation. Work within constraints — a specific medium, a deadline, a formal structure — and discover how limitation can be liberating.',
        lt: 'Kūrybinė raiška gauna naudos iš disciplinos ir struktūros, o ne laisvos formos eksperimentavimo. Dirbkite su apribojimais — konkreti priemonė, terminas, formali struktūra — ir atraskite, kaip apribojimas gali būti išlaisvinantis.',
      },
      6: {
        en: 'Establishing sustainable health routines is strongly favoured. This is not about dramatic overhauls but about building habits that will serve you for years. Start small and commit consistently.',
        lt: 'Tvarių sveikatos rutinų sukūrimas yra labai palankus. Tai ne apie dramatiškus perversmus, o apie įpročių, kurie tarnaus jums metus, kūrimą. Pradėkite nuo mažų dalykų ir nuosekliai laikykitės.',
      },
      7: {
        en: 'You approach partnerships with maturity and a focus on long-term sustainability. Conversations about commitments, shared responsibilities, or future plans feel productive and grounding.',
        lt: 'Artėjate prie partnerysčių su brandumu ir dėmesiu ilgalaikiam tvarumui. Pokalbiai apie įsipareigojimus, bendras atsakomybes ar ateities planus jaučiasi produktyvūs ir įžeminantys.',
      },
      8: {
        en: 'You process deep changes with remarkable composure. Rather than being swept away by emotional currents, you find solid ground to stand on while allowing transformation to happen at its own pace.',
        lt: 'Apdorojate gilius pokyčius su nepaprastu ramumu. Užuot buvę nešami emocinių srovių, randate tvirtą pagrindą stovėti, leisdami transformacijai vykti savo tempu.',
      },
      9: {
        en: 'Your search for wisdom favours the practical and proven over the theoretical. Traditional teachings, mentors with real-world experience, and structured learning programmes appeal more than speculative exploration.',
        lt: 'Jūsų išminties paieška teikia pirmenybę praktiniam ir patikrintam prieš teorinį. Tradiciniai mokymai, mentoriai su realaus pasaulio patirtimi ir struktūrizuotos mokymosi programos patraukia labiau nei spekuliatyvus tyrinėjimas.',
      },
      10: {
        en: 'This Moon directly activates your professional ambitions and public image. Career decisions made now carry extra weight — step into authority with confidence, and let your competence speak for itself.',
        lt: 'Šis Mėnulis tiesiogiai aktyvuoja jūsų profesines ambicijas ir viešąjį įvaizdį. Karjeros sprendimai, priimti dabar, turi papildomą svorį — įženkite į autoritetą su pasitikėjimu ir leiskite savo kompetencijai kalbėti pačiai.',
      },
      11: {
        en: 'You contribute most meaningfully to groups through reliable, practical action rather than grand gestures. Organise, strategise, and build infrastructure for the causes and communities you believe in.',
        lt: 'Prasmingiausia prisidedate prie grupių per patikimą, praktinį veiksmą, o ne per didingus gestus. Organizuokite, kurkite strategiją ir kurkite infrastruktūrą reikalams ir bendruomenėms, kuriomis tikite.',
      },
      12: {
        en: 'Structured spiritual practice — a regular meditation schedule, a disciplined retreat, or systematic study of a tradition — brings more depth than spontaneous exploration right now.',
        lt: 'Struktūrizuota dvasinė praktika — reguliarus meditacijos tvarkaraštis, disciplinuotas atsiskyrimas ar sistemingas tradicijos studijavimas — suteikia daugiau gelmės nei spontaniškas tyrinėjimas dabar.',
      },
    },
  },
  aquarius: {
    general: {
      en: 'The Moon in Aquarius brings an emotionally detached yet idealistic quality. Community, innovation, and individuality take precedence over personal comfort. This is a time to think about the bigger picture and connect with like-minded people.',
      lt: 'Mėnulis Vandenyje suteikia emociškai atsiribojusią, tačiau idealistinę kokybę. Bendruomenė, inovacijos ir individualumas yra svarbiau nei asmeninis komfortas. Tai laikas galvoti apie platesnį vaizdą ir susisiekti su bendraminčiais.',
    },
    themeKeywords: {
      en: ['innovation', 'community', 'individuality'],
      lt: ['inovacija', 'bendruomenė', 'individualumas'],
    },
    personalByHouse: {
      1: {
        en: 'You feel slightly detached from your usual identity, as though observing yourself from a higher perspective. This emotional distance is not coldness — it is the freedom to see yourself clearly and choose who you want to be.',
        lt: 'Jaučiatės šiek tiek atsiriboję nuo savo įprastos tapatybės, tarsi stebėtumėte save iš aukštesnės perspektyvos. Ši emocinė distancija nėra šaltumas — tai laisvė aiškiai pamatyti save ir pasirinkti, kuo norite būti.',
      },
      2: {
        en: 'Unconventional approaches to money and resources appeal to you today. Consider innovative saving tools, ethical investments, or creative income streams that align with your values rather than following conventional financial advice.',
        lt: 'Netradiciniai požiūriai į pinigus ir išteklius jus patraukia šiandien. Apsvarstykite inovatyvius taupymo įrankius, etiškas investicijas ar kūrybiškas pajamų srautus, kurios atitinka jūsų vertybes, o ne sekite tradicinius finansinius patarimus.',
      },
      3: {
        en: 'Your thinking is original and forward-looking. Ideas that seem unusual or ahead of their time flow freely. Share them — even if they feel strange, they may spark something valuable in others.',
        lt: 'Jūsų mąstymas yra originalus ir žvelgiantis į ateitį. Idėjos, kurios atrodo neįprastos ar pralenkiančios laiką, teka laisvai. Dalinkitės jomis — net jei jaučiasi keistai, jos gali uždegti kažką vertingo kituose.',
      },
      4: {
        en: 'You may crave more independence within your home life or feel inspired to make your living space more unique and unconventional. Technology upgrades, unusual decor, or simply breaking a domestic routine feels refreshing.',
        lt: 'Galite trokšti daugiau nepriklausomybės namų gyvenime ar jaustis įkvėpti padaryti savo gyvenamąją erdvę labiau unikalia ir netradicine. Technologijų atnaujinimai, neįprastas dekoras ar tiesiog namų rutinos sulaužymas jaučiasi gaiviai.',
      },
      5: {
        en: 'Experimental, boundary-pushing creative expression thrives under this Moon. Embrace the unconventional — mix genres, try new technologies, or create art that challenges rather than comforts. Innovation is your muse.',
        lt: 'Eksperimentinė, ribas stumianti kūrybinė raiška klesti šiame Mėnulyje. Priimkite netradicišką — maišykite žanrus, bandykite naujas technologijas ar kurkite meną, kuris meta iššūkį, o ne guodžia. Inovacija yra jūsų mūza.',
      },
      6: {
        en: 'Alternative or progressive approaches to health and wellness appeal strongly. Biohacking, unconventional therapies, or simply questioning whether your current routines truly serve you can lead to meaningful improvements.',
        lt: 'Alternatyvūs ar pažangūs požiūriai į sveikatą ir savijautą stipriai patraukia. Biohakavimas, netradicinės terapijos ar tiesiog klausimas, ar jūsų dabartinės rutinos tikrai jums tarnauja, gali vesti prie reikšmingų patobulinimų.',
      },
      7: {
        en: 'You need intellectual stimulation and independence within your partnerships. Have a conversation about ideas rather than feelings, give each other space, and appreciate the ways your partner is uniquely themselves.',
        lt: 'Jums reikia intelektualinės stimuliacijos ir nepriklausomybės partnerystėse. Turėkite pokalbį apie idėjas, o ne jausmus, suteikite vienas kitam erdvės ir vertinkite būdus, kuriais jūsų partneris yra unikaliai savimi.',
      },
      8: {
        en: 'Emotional detachment can actually serve transformation today — stepping back to observe your patterns objectively rather than being consumed by them offers a kind of clarity that feeling alone cannot provide.',
        lt: 'Emocinis atsiribojimas iš tikrųjų gali tarnauti transformacijai šiandien — žingsnis atgal, kad objektyviai stebėtumėte savo modelius, o ne būtumėte jų apimti, siūlo tokį aiškumą, kurio vien jausmai negali suteikti.',
      },
      9: {
        en: 'Cutting-edge ideas, scientific frontiers, and humanitarian philosophies capture your imagination. Your quest for knowledge gravitates toward what is innovative, progressive, and potentially world-changing.',
        lt: 'Naujausios idėjos, mokslo ribos ir humanitarinės filosofijos užvaldo jūsų vaizduotę. Jūsų žinių paieška gravituoja link to, kas yra inovatyvu, pažangu ir potencialiai keičia pasaulį.',
      },
      10: {
        en: 'Professional innovation and thinking ahead of the curve distinguish you today. Propose the unconventional idea, challenge outdated processes, or position yourself as someone who sees where things are headed.',
        lt: 'Profesinė inovacija ir mąstymas priekyje jus išskiria šiandien. Pasiūlykite netradiciniu idėją, meskite iššūkį pasenusiems procesams ar pozicionuokite save kaip žmogų, kuris mato, kur viskas juda.',
      },
      11: {
        en: 'This Moon directly activates your social and humanitarian zone. Group activities, community organising, or connecting with like-minded people around a shared vision feels deeply energising and purposeful.',
        lt: 'Šis Mėnulis tiesiogiai aktyvuoja jūsų socialinę ir humanitarinę zoną. Grupinė veikla, bendruomenės organizavimas ar ryšys su bendraminčiais aplink bendrą viziją jaučiasi giliai energizuojančiai ir prasmingai.',
      },
      12: {
        en: 'Your spiritual life benefits from a more detached, observational approach. Meditation practices that develop witness consciousness — watching thoughts without attachment — are particularly powerful right now.',
        lt: 'Jūsų dvasinis gyvenimas gauna naudos iš labiau atsiribojusio, stebėtojaus požiūrio. Meditacijos praktikos, kurios ugdo stebėtojo sąmonę — minčių stebėjimas be prisirišimo — yra ypač galingos dabar.',
      },
    },
  },
  pisces: {
    general: {
      en: 'The Moon in Pisces dissolves emotional boundaries and heightens empathy, creativity, and spiritual sensitivity. Dreams may be vivid and intuition especially keen. This is a time for compassion, artistic expression, and gentle surrender to the flow of life.',
      lt: 'Mėnulis Žuvyse ištirpdo emocines ribas ir sustiprina empatiją, kūrybiškumą ir dvasinį jautrumą. Sapnai gali būti ryškūs, o intuicija ypač aštriai veikia. Tai laikas užuojautai, meninei raiškai ir švelniam atsidavimui gyvenimo tėkmei.',
    },
    themeKeywords: {
      en: ['empathy', 'intuition', 'spiritual sensitivity'],
      lt: ['empatija', 'intuicija', 'dvasinis jautrumas'],
    },
    personalByHouse: {
      1: {
        en: 'Your personal boundaries soften and your sense of self becomes more fluid. You may absorb the emotions of those around you more easily than usual. Protect your energy while remaining open to the beauty of this heightened sensitivity.',
        lt: 'Jūsų asmeninės ribos švelnėja ir savęs pojūtis tampa skystesnis. Galite absorbuoti aplinkinių emocijas lengviau nei įprastai. Saugokite savo energiją, bet likite atviri šio padidėjusio jautrumo grožiui.',
      },
      2: {
        en: 'Financial clarity may be elusive today — numbers blur and practical decisions feel harder. Avoid major financial commitments and instead focus on the deeper question of what truly brings you a sense of abundance and security.',
        lt: 'Finansinis aiškumas šiandien gali būti sunkiai pasiekiamas — skaičiai apsiblausia ir praktiški sprendimai jaučiasi sunkesni. Venkite didelių finansinių įsipareigojimų ir vietoj to susikoncentruokite į gilesnį klausimą, kas tikrai suteikia gausos ir saugumo pojūtį.',
      },
      3: {
        en: 'Words take on a poetic, intuitive quality. You communicate through feeling as much as logic — this makes you a compassionate listener and an inspiring speaker, even if precision is not your strength today.',
        lt: 'Žodžiai įgauna poetinę, intuityvią kokybę. Bendraujate per jausmus tiek pat, kiek per logiką — tai daro jus užjaučiančiu klausytoju ir įkvepiančiu kalbėtoju, net jei tikslumas šiandien nėra jūsų stiprybė.',
      },
      4: {
        en: 'Your home becomes a refuge for your spirit. Creating a dreamy, peaceful atmosphere — soft lighting, gentle music, comfortable textures — nourishes your emotional core in ways that nothing else can today.',
        lt: 'Jūsų namai tampa prieglobsčiu jūsų dvasiai. Svajoninga, taikios atmosferos kūrimas — švelni šviesa, rami muzika, patogios tekstūros — maitina jūsų emocinį centrą taip, kaip niekas kitas šiandien negali.',
      },
      5: {
        en: 'Artistic inspiration flows without effort. Music, visual art, poetry, or any creative act that channels emotion directly into form feels almost effortless. Romance carries a dreamlike, idealised quality.',
        lt: 'Meninis įkvėpimas teka be pastangų. Muzika, vizualusis menas, poezija ar bet koks kūrybinis veiksmas, nukreipiantis emocijas tiesiai į formą, jaučiasi beveik be pastangų. Romantika turi svajingą, idealizuotą kokybę.',
      },
      6: {
        en: 'Sensitivity to your environment is heightened — noise, chemicals, crowds, or poor food choices may affect you more strongly than usual. Prioritise gentle, nourishing practices and avoid anything that overwhelms your system.',
        lt: 'Jautrumas aplinkai yra padidėjęs — triukšmas, chemikalai, minios ar netinkamas maisto pasirinkimas gali paveikti jus stipriau nei įprastai. Pirmenybę teikite švelnioms, maitinančioms praktikoms ir venkite visko, kas perkrauna jūsų sistemą.',
      },
      7: {
        en: 'Empathy and compassion define your partnerships today. You sense your partner\'s unspoken needs and respond with intuitive kindness. Ensure this flows both ways — your needs deserve the same gentle attention.',
        lt: 'Empatija ir užuojauta apibrėžia jūsų partnerystes šiandien. Jaučiate savo partnerio neištartus poreikius ir reaguojate su intuityvia gerumu. Užtikrinkite, kad tai teka abiem kryptimis — jūsų poreikiai nusipelno tokio pat švelnaus dėmesio.',
      },
      8: {
        en: 'The boundary between your conscious and unconscious mind dissolves today, allowing deep healing to occur naturally. Simply being present with your feelings — without analysing or fixing — is the most transformative act.',
        lt: 'Riba tarp jūsų sąmoningo ir pasąmoninio proto ištirpsta šiandien, leisdama natūraliam gijimui vykti. Tiesiog būti čia ir dabar su savo jausmais — be analizavimo ar taisymo — yra labiausiai transformuojantis veiksmas.',
      },
      9: {
        en: 'Spiritual journeys and mystical teachings call to you more strongly than academic learning. Explore traditions that honour the unseen, attend a retreat, or simply allow your intuition to guide your search for meaning.',
        lt: 'Dvasinės kelionės ir mistiniai mokymai kviečia jus stipriau nei akademinis mokymasis. Tyrinėkite tradicijas, kurios gerbia nematomą, dalyvaukite atsiskyrimo stovykloje ar tiesiog leiskite savo intuicijai vadovauti jūsų prasmės paieškai.',
      },
      10: {
        en: 'Your professional life benefits from imagination and compassion rather than strategy. Healing professions, creative industries, or any work that serves others thrives under this Moon. Trust your intuition about career direction.',
        lt: 'Jūsų profesinis gyvenimas gauna naudos iš vaizduotės ir užuojautos, o ne strategijos. Gydymo profesijos, kūrybinės industrijos ar bet koks darbas, tarnaujantis kitiems, klesti šiame Mėnulyje. Pasitikėkite savo intuicija dėl karjeros krypties.',
      },
      11: {
        en: 'You are drawn to communities that share a spiritual or compassionate purpose. Gatherings centred on healing, art, or service to others resonate deeply. Your empathic presence is a gift to any group.',
        lt: 'Traukia bendruomenės, turinčios dvasinį ar užjaučiantį tikslą. Susibūrimai, orientuoti į gijimą, meną ar tarnavimą kitiems, rezonuoja giliai. Jūsų empatiškas buvimas yra dovana bet kuriai grupei.',
      },
      12: {
        en: 'This Moon activates your most spiritually sensitive zone with extraordinary potency. Meditation, prayer, dream work, and surrender to something greater than yourself come naturally. This is a profoundly sacred time for inner work.',
        lt: 'Šis Mėnulis aktyvuoja jūsų dvasiškai jautriausią zoną su nepaprastą galią. Meditacija, malda, sapnų darbas ir atsidavimas kažkam didesniam nei jūs pats ateina natūraliai. Tai giliai šventas laikas vidiniam darbui.',
      },
    },
  },
}
