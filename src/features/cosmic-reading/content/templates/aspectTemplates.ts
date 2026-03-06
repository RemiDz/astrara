import type { AspectType, ZodiacSign } from '../../types'
import { getHouseForTransit } from '../../utils/zodiacHelpers'
import { HOUSE_THEMES } from './houseTemplates'

// === ASPECT TYPE DESCRIPTIONS ===

export interface AspectTypeDescription {
  name: { en: string; lt: string }
  energy: { en: string; lt: string }
  nature: 'harmonious' | 'challenging' | 'neutral'
}

export const ASPECT_DESCRIPTIONS: Record<AspectType, AspectTypeDescription> = {
  conjunction: {
    name: { en: 'Conjunction', lt: 'Konjunkcija' },
    energy: { en: 'Fusion — energies merge and amplify', lt: 'Susiliejimas — energijos susijungia ir sustiprėja' },
    nature: 'neutral',
  },
  sextile: {
    name: { en: 'Sextile', lt: 'Sekstilis' },
    energy: { en: 'Opportunity — gentle support and creative flow', lt: 'Galimybė — švelni parama ir kūrybinė tėkmė' },
    nature: 'harmonious',
  },
  square: {
    name: { en: 'Square', lt: 'Kvadratūra' },
    energy: { en: 'Tension — friction that demands action', lt: 'Įtampa — trintis, reikalaujanti veiksmo' },
    nature: 'challenging',
  },
  trine: {
    name: { en: 'Trine', lt: 'Trinas' },
    energy: { en: 'Flow — natural ease and gifts', lt: 'Tėkmė — natūralus lengvumas ir dovanos' },
    nature: 'harmonious',
  },
  opposition: {
    name: { en: 'Opposition', lt: 'Opozicija' },
    energy: { en: 'Polarity — awareness through contrast', lt: 'Poliariškumas — sąmoningumas per kontrastą' },
    nature: 'challenging',
  },
}

// === PLANET ENERGY DESCRIPTIONS ===

export interface PlanetEnergy {
  name: { en: string; lt: string }
  domain: { en: string; lt: string }
  keywords: { en: string[]; lt: string[] }
}

export const PLANET_ENERGIES: Record<string, PlanetEnergy> = {
  sun: {
    name: { en: 'The Sun', lt: 'Saulė' },
    domain: { en: 'identity, vitality, and conscious will', lt: 'tapatybė, gyvybingumas ir sąmoninga valia' },
    keywords: { en: ['self', 'purpose', 'confidence'], lt: ['savastis', 'tikslas', 'pasitikėjimas'] },
  },
  moon: {
    name: { en: 'The Moon', lt: 'Mėnulis' },
    domain: { en: 'emotions, instincts, and inner needs', lt: 'emocijos, instinktai ir vidiniai poreikiai' },
    keywords: { en: ['feelings', 'comfort', 'intuition'], lt: ['jausmai', 'komfortas', 'intuicija'] },
  },
  mercury: {
    name: { en: 'Mercury', lt: 'Merkurijus' },
    domain: { en: 'communication, thought, and perception', lt: 'bendravimas, mintis ir suvokimas' },
    keywords: { en: ['ideas', 'speech', 'learning'], lt: ['idėjos', 'kalba', 'mokymasis'] },
  },
  venus: {
    name: { en: 'Venus', lt: 'Venera' },
    domain: { en: 'love, beauty, and values', lt: 'meilė, grožis ir vertybės' },
    keywords: { en: ['harmony', 'pleasure', 'connection'], lt: ['harmonija', 'malonumas', 'ryšys'] },
  },
  mars: {
    name: { en: 'Mars', lt: 'Marsas' },
    domain: { en: 'drive, action, and desire', lt: 'varomoji jėga, veiksmas ir troškimas' },
    keywords: { en: ['energy', 'courage', 'assertion'], lt: ['energija', 'drąsa', 'tvirtinimas'] },
  },
  jupiter: {
    name: { en: 'Jupiter', lt: 'Jupiteris' },
    domain: { en: 'expansion, wisdom, and abundance', lt: 'plėtra, išmintis ir gausybė' },
    keywords: { en: ['growth', 'optimism', 'opportunity'], lt: ['augimas', 'optimizmas', 'galimybė'] },
  },
  saturn: {
    name: { en: 'Saturn', lt: 'Saturnas' },
    domain: { en: 'structure, discipline, and responsibility', lt: 'struktūra, disciplina ir atsakomybė' },
    keywords: { en: ['boundaries', 'lessons', 'maturity'], lt: ['ribos', 'pamokos', 'brandumas'] },
  },
  uranus: {
    name: { en: 'Uranus', lt: 'Uranas' },
    domain: { en: 'innovation, freedom, and sudden change', lt: 'inovacija, laisvė ir staigus pokytis' },
    keywords: { en: ['awakening', 'rebellion', 'breakthrough'], lt: ['prabudimas', 'maištas', 'proveržis'] },
  },
  neptune: {
    name: { en: 'Neptune', lt: 'Neptūnas' },
    domain: { en: 'dreams, spirituality, and transcendence', lt: 'svajonės, dvasingumas ir transcendencija' },
    keywords: { en: ['imagination', 'compassion', 'dissolution'], lt: ['vaizduotė', 'užuojauta', 'ištirpimas'] },
  },
  pluto: {
    name: { en: 'Pluto', lt: 'Plutonas' },
    domain: { en: 'transformation, power, and deep renewal', lt: 'transformacija, galia ir gilus atsinaujinimas' },
    keywords: { en: ['rebirth', 'intensity', 'shadow work'], lt: ['atgimimas', 'intensyvumas', 'šešėlių darbas'] },
  },
}

// === SPECIAL-CASE HARDCODED ASPECT READINGS ===

const SPECIAL_ASPECTS: Record<string, { en: string; lt: string }> = {
  'sun-conjunction-moon': {
    en: 'The Sun and Moon unite in the sky — this is New Moon energy at its most potent. The conscious will and the emotional body fuse into a single impulse. This is a powerful moment for setting intentions that align your deepest feelings with your outward direction. Let instinct and purpose become one.',
    lt: 'Saulė ir Mėnulis susijungia danguje — tai Jaunaties energija savo galingiausiu pavidalu. Sąmoninga valia ir emocinis kūnas susilieja į vieną impulsą. Tai galinga akimirka nustatyti ketinimus, kurie suderina jūsų giliausius jausmus su išorine kryptimi. Leiskite instinktui ir tikslui tapti viena.',
  },
  'sun-opposition-moon': {
    en: 'The Sun and Moon stand opposite one another — the Full Moon illuminates everything. What has been growing in the dark now comes into full view. Emotions are heightened, truths are revealed, and the tension between what you want and what you need reaches its peak. Allow this clarity to guide your next steps.',
    lt: 'Saulė ir Mėnulis stovi priešais vienas kitą — Pilnatis nušviečia viską. Tai, kas augo tamsoje, dabar atsiskleidžia visu ryškumu. Emocijos sustiprėjusios, tiesos atskleistos, ir įtampa tarp to, ko norite, ir ko jums reikia, pasiekia piką. Leiskite šiam aiškumui vadovauti jūsų tolesniems žingsniams.',
  },
  'venus-conjunction-mars': {
    en: 'Venus and Mars come together, merging desire with affection, passion with tenderness. This is one of the most sensual and creative alignments in the sky. Relationships feel magnetic, attraction is palpable, and the drive to connect — romantically, artistically, physically — is strong. Embrace what you truly want.',
    lt: 'Venera ir Marsas susijungia, sujungdami troškimą su meile, aistrą su švelnumu. Tai viena jusliškiausių ir kūrybiškiausių dangaus konfigūracijų. Santykiai jaučiasi magnetiški, trauka apčiuopiama, ir noras jungtis — romantiškai, meniškai, fiziškai — yra stiprus. Priimkite tai, ko tikrai trokštate.',
  },
  'mercury-square-saturn': {
    en: 'Mercury squares Saturn, creating friction between the desire to communicate and a feeling of being blocked or misunderstood. Words may feel heavy, plans may hit delays, and self-doubt can creep into the mind. This is not a time to force ideas through — it is a time to think carefully, speak precisely, and trust that clarity will come with patience.',
    lt: 'Merkurijus kerta kvadratūrą su Saturnu, sukurdamas trintį tarp noro bendrauti ir jausmo, kad esate blokuojami ar nesuprantami. Žodžiai gali jaustis sunkūs, planai gali susidurti su vėlavimais, ir abejojimas savimi gali įsiskverbti į protą. Tai ne laikas versti idėjas per jėgą — tai laikas galvoti atidžiai, kalbėti tiksliai ir pasitikėti, kad aiškumas ateis su kantrybe.',
  },
  'jupiter-trine-sun': {
    en: 'Jupiter forms a flowing trine to the Sun, opening a channel of confidence, optimism, and expansion. This is one of the most fortunate alignments of the year — a time when effort meets opportunity and doors seem to open of their own accord. Take bold steps, trust your vision, and allow abundance to find you.',
    lt: 'Jupiteris formuoja tekantį triną su Saule, atverdamas pasitikėjimo, optimizmo ir plėtros kanalą. Tai viena palankiausių metų konfigūracijų — laikas, kai pastangos sutinka galimybę ir durys, atrodo, atsidaro savaime. Ženkite drąsius žingsnius, pasitikėkite savo vizija ir leiskite gausai jus rasti.',
  },
  'sun-trine-jupiter': {
    en: 'Jupiter forms a flowing trine to the Sun, opening a channel of confidence, optimism, and expansion. This is one of the most fortunate alignments of the year — a time when effort meets opportunity and doors seem to open of their own accord. Take bold steps, trust your vision, and allow abundance to find you.',
    lt: 'Jupiteris formuoja tekantį triną su Saule, atverdamas pasitikėjimo, optimizmo ir plėtros kanalą. Tai viena palankiausių metų konfigūracijų — laikas, kai pastangos sutinka galimybę ir durys, atrodo, atsidaro savaime. Ženkite drąsius žingsnius, pasitikėkite savo vizija ir leiskite gausai jus rasti.',
  },
}

// === COMPOSABLE ASPECT READING GENERATOR ===

export function generateAspectReading(
  planet1Id: string,
  planet2Id: string,
  aspectType: AspectType,
  orb: number,
  lang: 'en' | 'lt' = 'en'
): string {
  // Check for special-case readings (both orderings)
  const key1 = `${planet1Id}-${aspectType}-${planet2Id}`
  const key2 = `${planet2Id}-${aspectType}-${planet1Id}`
  if (SPECIAL_ASPECTS[key1]?.[lang]) return SPECIAL_ASPECTS[key1][lang]
  if (SPECIAL_ASPECTS[key2]?.[lang]) return SPECIAL_ASPECTS[key2][lang]

  // Composable fallback
  const p1 = PLANET_ENERGIES[planet1Id]
  const p2 = PLANET_ENERGIES[planet2Id]
  const aspect = ASPECT_DESCRIPTIONS[aspectType]

  if (!p1 || !p2 || !aspect) {
    return lang === 'lt'
      ? `Ryškus aspektas formuojasi danguje tarp ${planet1Id} ir ${planet2Id}, atnešdamas energijos pokytį, vertą dėmesio.`
      : `A notable aspect is forming in the sky between ${planet1Id} and ${planet2Id}, bringing a shift in energy worth paying attention to.`
  }

  const potency = orb < 2
    ? lang === 'lt'
      ? ' Šis aspektas šiandien ypač galingas — konfigūracija beveik tiksli.'
      : ' This aspect is especially potent today — the alignment is almost exact.'
    : ''

  const guidance: Record<AspectType, { en: string; lt: string }> = {
    conjunction: {
      en: 'Allow these merged energies to work together rather than competing for attention.',
      lt: 'Leiskite šioms susijungusioms energijoms dirbti kartu, o ne konkuruoti dėl dėmesio.',
    },
    sextile: {
      en: 'Look for small openings and creative possibilities — this gentle support rewards those who engage with it.',
      lt: 'Ieškokite mažų atvirumų ir kūrybinių galimybių — ši švelni parama atlygina tiems, kurie su ja bendradarbiauja.',
    },
    square: {
      en: 'Rather than resisting the friction, use it as fuel for meaningful change.',
      lt: 'Užuot priešinantis trinčiai, naudokite ją kaip kurą prasmingiems pokyčiams.',
    },
    trine: {
      en: 'This natural flow is a gift — receive it with gratitude and let it carry you forward.',
      lt: 'Ši natūrali tėkmė yra dovana — priimkite ją su dėkingumu ir leiskite jai nešti jus pirmyn.',
    },
    opposition: {
      en: 'Balance is the key — neither side holds the complete truth, but together they offer a fuller picture.',
      lt: 'Pusiausvyra yra raktas — nė viena pusė neturi visos tiesos, bet kartu jos siūlo pilnesnį vaizdą.',
    },
  }

  return lang === 'lt'
    ? `Šiandien ${p1.name[lang]} formuoja ${aspect.name[lang].toLowerCase()} su ${p2.name[lang]}. ${aspect.energy[lang]}. Kai ${p1.domain[lang]} planeta sutinka ${p2.domain[lang]} planetą, rezultatas yra dinamiška sąveika, liečianti ${p1.keywords[lang][0]}, ${p2.keywords[lang][0]} ir erdvę tarp jų. ${guidance[aspectType][lang]}${potency}`
    : `Today, ${p1.name[lang]} forms a ${aspect.name[lang].toLowerCase()} with ${p2.name[lang]}. ${aspect.energy[lang]}. When the planet of ${p1.domain[lang]} meets the planet of ${p2.domain[lang]}, the result is a dynamic interplay that touches ${p1.keywords[lang][0]}, ${p2.keywords[lang][0]}, and the space between them. ${guidance[aspectType][lang]}${potency}`
}

// === PERSONAL ASPECT READING (HOUSE-BASED) ===

function getHouseInteractionText(house1: number, house2: number, aspectType: AspectType, lang: 'en' | 'lt' = 'en'): string {
  // Same house — concentrated energy
  if (house1 === house2) {
    const theme = HOUSE_THEMES[house1]
    return lang === 'lt'
      ? `Ši energija galingai susitelkia jūsų ${theme.area[lang].toLowerCase()} srityje — tikėkitės, kad ši gyvenimo sritis jaučiasi ypač aktyvuota ir reikalauja viso jūsų dėmesio.`
      : `This energy concentrates powerfully in your ${theme.area[lang].toLowerCase()} — expect this area of life to feel especially activated and demand your full attention.`
  }

  // Key axis pairs
  const pair = [Math.min(house1, house2), Math.max(house1, house2)].join('-')
  const axisTexts: Record<string, Record<AspectType, { en: string; lt: string }>> = {
    '1-7': {
      conjunction: {
        en: 'Your sense of self and your closest partnership merge into a single focus. Who you are and who you are with become inseparable questions.',
        lt: 'Jūsų savęs pojūtis ir artimiausia partnerystė susilieja į vieną dėmesio centrą. Kas esate ir su kuo esate tampa neatskiriami klausimai.',
      },
      sextile: {
        en: 'A gentle opening appears between your personal identity and your closest relationships. Small gestures of authenticity strengthen your bonds.',
        lt: 'Švelnus atvirumas atsiranda tarp jūsų asmeninės tapatybės ir artimiausių santykių. Maži autentiškumo gestai sustiprina jūsų ryšius.',
      },
      square: {
        en: 'Tension between your personal needs and your partnership obligations demands creative resolution. Neither side can be ignored.',
        lt: 'Įtampa tarp jūsų asmeninių poreikių ir partnerystės įsipareigojimų reikalauja kūrybiško sprendimo. Nė vienos pusės negalima ignoruoti.',
      },
      trine: {
        en: 'Your sense of self and your relationships flow together naturally. Being authentically you strengthens rather than threatens your closest bonds.',
        lt: 'Jūsų savęs pojūtis ir santykiai teka kartu natūraliai. Būti autentiškai savimi stiprina, o ne gresia jūsų artimiausiems ryšiams.',
      },
      opposition: {
        en: 'The mirror of relationship shows you something important about yourself. What you see in your partner — admirable or frustrating — reflects something within.',
        lt: 'Santykių veidrodis parodo jums kažką svarbaus apie save. Tai, ką matote savo partneryje — žavingo ar erzinančio — atspindi kažką viduje.',
      },
    },
    '2-8': {
      conjunction: {
        en: 'Personal resources and shared depths merge. Financial or emotional investments require you to blend what is yours with what belongs to the relationship.',
        lt: 'Asmeniniai ištekliai ir bendros gelmės susilieja. Finansinės ar emocinės investicijos reikalauja suderinti tai, kas jūsų, su tuo, kas priklauso santykiui.',
      },
      sextile: {
        en: 'A small opportunity emerges to deepen your financial or emotional security through shared resources. Trust is building quietly.',
        lt: 'Maža galimybė iškyla pagilinti jūsų finansinį ar emocinį saugumą per bendrus išteklius. Pasitikėjimas tyliai kuriasi.',
      },
      square: {
        en: 'Tension between what you own and what you share with others surfaces. Negotiations about money, intimacy, or vulnerability may feel charged.',
        lt: 'Įtampa tarp to, ką turite, ir tuo, ką dalijatės su kitais, iškyla. Derybos dėl pinigų, intymumo ar pažeidžiamumo gali jaustis įkrautos.',
      },
      trine: {
        en: 'Material security and emotional depth flow together easily. Investments — financial or emotional — feel naturally supported.',
        lt: 'Materialinis saugumas ir emocinė gelmė teka kartu lengvai. Investicijos — finansinės ar emocinės — jaučiasi natūraliai palaikomos.',
      },
      opposition: {
        en: 'The balance between personal possessions and shared resources needs recalibrating. What you hold tightly may need releasing, and what you share may need protecting.',
        lt: 'Pusiausvyra tarp asmeninių nuosavybių ir bendrų išteklių reikalauja perkalibrimo. Tai, ko tvirtai laikotės, gali reikėti paleisti, ir tai, kuo dalijatės, gali reikėti apsaugos.',
      },
    },
    '4-10': {
      conjunction: {
        en: 'Home life and career ambitions demand simultaneous attention. Finding a way to honour both your private roots and your public aspirations is the challenge.',
        lt: 'Namų gyvenimas ir karjeros ambicijos reikalauja vienalaikio dėmesio. Rasti būdą pagerbti ir savo privačias šaknis, ir viešus siekius yra iššūkis.',
      },
      sextile: {
        en: 'A gentle connection forms between your domestic life and professional goals. Something at home supports your career, or a professional insight improves family life.',
        lt: 'Švelnus ryšys formuojasi tarp jūsų namų gyvenimo ir profesinių tikslų. Kažkas namuose palaiko jūsų karjerą, arba profesinė įžvalga pagerina šeimos gyvenimą.',
      },
      square: {
        en: 'The pull between home responsibilities and career demands creates friction. Neither can be sacrificed for the other — integration is the only path.',
        lt: 'Traukimas tarp namų atsakomybių ir karjeros reikalavimų sukuria trintį. Nė vienas negali būti paaukotas dėl kito — integracija yra vienintelis kelias.',
      },
      trine: {
        en: 'Your private life and public life support each other naturally. Professional success feels rooted in personal stability, and home life benefits from your achievements.',
        lt: 'Jūsų privatus ir viešas gyvenimas palaiko vienas kitą natūraliai. Profesinė sėkmė jaučiasi įsišaknijusi asmeniniame stabilume, ir namų gyvenimas gauna naudos iš jūsų pasiekimų.',
      },
      opposition: {
        en: 'Family needs and career ambitions stand in stark contrast. Finding balance requires honest assessment of what truly matters most to you right now.',
        lt: 'Šeimos poreikiai ir karjeros ambicijos stovi ryškiame kontraste. Pusiausvyros radimas reikalauja sąžiningo įvertinimo, kas tikrai šiuo metu svarbiausia.',
      },
    },
    '5-11': {
      conjunction: {
        en: 'Personal creativity and collective vision unite. Your individual expression serves a larger purpose, and group energy fuels your creative fire.',
        lt: 'Asmeninis kūrybiškumas ir kolektyvinė vizija susivienija. Jūsų individuali raiška tarnauja didesniam tikslui, ir grupės energija maitina jūsų kūrybinę ugnį.',
      },
      sextile: {
        en: 'A small creative opportunity arises through your social connections. What brings you joy aligns with what your community needs.',
        lt: 'Maža kūrybinė galimybė iškyla per jūsų socialinius ryšius. Tai, kas teikia jums džiaugsmą, sutampa su tuo, ko reikia jūsų bendruomenei.',
      },
      square: {
        en: 'Tension between personal creative expression and group expectations surfaces. Your individual joy may not align with collective priorities — find a way to honour both.',
        lt: 'Įtampa tarp asmeninės kūrybinės raiškos ir grupės lūkesčių iškyla. Jūsų individualus džiaugsmas gali nesutapti su kolektyviniais prioritetais — raskite būdą pagerbti abu.',
      },
      trine: {
        en: 'Your creative gifts flow naturally into community benefit. What you do for joy also serves others, and group energy inspires your personal expression.',
        lt: 'Jūsų kūrybinės dovanos natūraliai teka į bendruomenės naudą. Tai, ką darote iš džiaugsmo, taip pat tarnauja kitiems, ir grupės energija įkvepia jūsų asmeninę raišką.',
      },
      opposition: {
        en: 'The balance between personal pleasure and collective responsibility is highlighted. Your individual desires and your community commitments need reconciling.',
        lt: 'Pusiausvyra tarp asmeninio malonumo ir kolektyvinės atsakomybės yra paryškinta. Jūsų individualūs troškimai ir bendruomeniniai įsipareigojimai reikalauja suderinimo.',
      },
    },
  }

  if (axisTexts[pair]?.[aspectType]) {
    return axisTexts[pair][aspectType][lang]
  }

  // General composable template for all other combinations
  const h1 = HOUSE_THEMES[house1]
  const h2 = HOUSE_THEMES[house2]
  const natureTexts: Record<string, { en: string; lt: string }> = {
    harmonious: {
      en: 'This creates a supportive flow between these areas of your life — progress in one naturally benefits the other.',
      lt: 'Tai sukuria palaikantį srautą tarp šių jūsų gyvenimo sričių — pažanga vienoje natūraliai naudinga kitai.',
    },
    challenging: {
      en: 'This creates productive tension between these areas, pushing you to find creative solutions that honour both.',
      lt: 'Tai sukuria produktyvią įtampą tarp šių sričių, stumdama jus rasti kūrybiškų sprendimų, gerbiant abi.',
    },
    neutral: {
      en: 'These two areas of your life are merging their energies, creating a concentrated focus that demands your attention.',
      lt: 'Šios dvi jūsų gyvenimo sritys sujungia savo energijas, sukurdamos sutelktą dėmesį, reikalaujantį jūsų dėmesio.',
    },
  }
  const aspectNature = ASPECT_DESCRIPTIONS[aspectType]?.nature ?? 'neutral'

  return lang === 'lt'
    ? `Jūsų ${h1.area[lang].toLowerCase()} ir jūsų ${h2.area[lang].toLowerCase()} yra dinamiškame pokalbyje. ${natureTexts[aspectNature][lang]}`
    : `Your ${h1.area[lang].toLowerCase()} and your ${h2.area[lang].toLowerCase()} are in dynamic conversation. ${natureTexts[aspectNature][lang]}`
}

export function generatePersonalAspectReading(
  planet1Id: string,
  planet1Sign: string,
  planet2Id: string,
  planet2Sign: string,
  aspectType: AspectType,
  userSunSign: string,
  lang: 'en' | 'lt' = 'en'
): string {
  const house1 = getHouseForTransit(userSunSign as ZodiacSign, planet1Sign as ZodiacSign)
  const house2 = getHouseForTransit(userSunSign as ZodiacSign, planet2Sign as ZodiacSign)
  const h1Theme = HOUSE_THEMES[house1]
  const h2Theme = HOUSE_THEMES[house2]
  const aspectDesc = ASPECT_DESCRIPTIONS[aspectType]

  if (!h1Theme || !h2Theme || !aspectDesc) return ''

  const interactionText = getHouseInteractionText(house1, house2, aspectType, lang)

  if (house1 === house2) {
    return lang === 'lt'
      ? `Ši ${aspectDesc.name[lang].toLowerCase()} sutelkia dėmesį į jūsų ${h1Theme.area[lang].toLowerCase()}. ${interactionText}`
      : `This ${aspectDesc.name[lang].toLowerCase()} focuses on your ${h1Theme.area[lang].toLowerCase()}. ${interactionText}`
  }

  return lang === 'lt'
    ? `Ši ${aspectDesc.name[lang].toLowerCase()} jungia jūsų ${h1Theme.area[lang].toLowerCase()} su jūsų ${h2Theme.area[lang].toLowerCase()}. ${interactionText}`
    : `This ${aspectDesc.name[lang].toLowerCase()} connects your ${h1Theme.area[lang].toLowerCase()} with your ${h2Theme.area[lang].toLowerCase()}. ${interactionText}`
}
