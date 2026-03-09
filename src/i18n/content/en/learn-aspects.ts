export interface LearnAspect {
  id: string
  symbol: string
  name: string
  angle: string
  title: string
  energy: string
  description: string
  inPractice: string
  visualColour: string
}

export const learnAspects: LearnAspect[] = [
  {
    id: 'conjunction',
    symbol: '\u260C',
    name: 'Conjunction',
    angle: '0\u00B0',
    title: 'Fusion',
    energy: 'Intensifying, merging, amplifying',
    description: 'A conjunction occurs when two planets occupy the same degree of the zodiac \u2014 their energies fuse into a single force. This is the most powerful aspect because the two planets cannot be separated. Whether this feels creative or overwhelming depends on which planets are involved. A Sun\u2013Jupiter conjunction is joyful expansion; a Mars\u2013Saturn conjunction is frustrated effort.',
    inPractice: 'Conjunctions concentrate energy in one area of life. They demand attention. There is no subtlety \u2014 whatever the planets represent will be loudly present. In sessions, conjunctions are the themes that clients cannot avoid.',
    visualColour: 'Amber lines on the wheel',
  },
  {
    id: 'sextile',
    symbol: '\u26B9',
    name: 'Sextile',
    angle: '60\u00B0',
    title: 'Opportunity',
    energy: 'Supportive, stimulating, activating',
    description: 'A sextile connects planets 60\u00B0 apart \u2014 always in compatible elements (fire\u2013air or earth\u2013water). This creates a gentle, productive connection. The two planets support each other, but unlike the trine, the sextile requires a small effort to activate. Think of it as an open door \u2014 you still have to walk through it.',
    inPractice: 'Sextiles represent opportunities that require initiative. They are easy to miss if you are not paying attention. In readings, they suggest practical steps the person can take. In sound healing, sextiles support gentle, incremental shifts rather than dramatic breakthroughs.',
    visualColour: 'Blue lines on the wheel',
  },
  {
    id: 'square',
    symbol: '\u25A1',
    name: 'Square',
    angle: '90\u00B0',
    title: 'Creative Tension',
    energy: 'Challenging, motivating, friction-generating',
    description: 'A square connects planets 90\u00B0 apart \u2014 in signs that share the same modality but clash in element. This creates friction, tension, and the urgent need to act. Squares are not comfortable, but they are productive. Without squares, nothing would ever change. They are the engine of growth.',
    inPractice: 'Squares demand resolution. They create the pressure that forces decisions, changes, and breakthroughs. In readings, they point to areas of struggle that are also areas of greatest potential growth. In sound healing, square energy benefits from instruments that release tension \u2014 gongs, drums, deep vibrations.',
    visualColour: 'Red lines on the wheel',
  },
  {
    id: 'trine',
    symbol: '\u25B3',
    name: 'Trine',
    angle: '120\u00B0',
    title: 'Flow',
    energy: 'Harmonious, easy, natural',
    description: 'A trine connects planets 120\u00B0 apart \u2014 always in signs of the same element. This creates a natural flow of energy between them, like a river finding its easiest path. The two planets understand each other instinctively and work together without effort.',
    inPractice: 'Trines feel effortless. Talents come naturally. The risk is complacency \u2014 when something is easy, you may not develop it fully. In readings, trines represent gifts and natural abilities. In sound healing, trines support relaxation, integration, and states of flow. Harmonious intervals (thirds, fifths) mirror trine energy.',
    visualColour: 'Green lines on the wheel',
  },
  {
    id: 'opposition',
    symbol: '\u260D',
    name: 'Opposition',
    angle: '180\u00B0',
    title: 'Awareness',
    energy: 'Polarising, illuminating, balancing',
    description: 'An opposition connects planets 180\u00B0 apart \u2014 in signs that face each other across the zodiac. This creates a tug-of-war. Both planets have valid needs, but they pull in opposite directions. The opposition is the aspect of relationships \u2014 it often manifests through other people who embody the energy you are not expressing.',
    inPractice: 'Oppositions demand balance. You cannot choose one side without losing the other. In readings, they often point to relationship dynamics or internal conflicts between competing needs. In sound healing, oppositions benefit from balancing practices \u2014 alternating left\u2013right panning, complementary frequencies, and integration work.',
    visualColour: 'Orange lines on the wheel',
  },
]

export interface LearnMinorAspect {
  name: string
  angle: string
  description: string
}

export const learnMinorAspects: LearnMinorAspect[] = [
  {
    name: 'Semi-sextile',
    angle: '30\u00B0',
    description: 'A subtle, slightly awkward connection between adjacent signs. The two energies are so different they must learn to coexist. Semi-sextiles create background tension that is easy to overlook but slowly productive.',
  },
  {
    name: 'Quincunx (Inconjunct)',
    angle: '150\u00B0',
    description: 'An uncomfortable angle between signs that share nothing \u2014 different element, different modality. Quincunxes create a nagging sense that something needs adjusting. They often manifest as health issues or persistent life imbalances that demand creative solutions.',
  },
  {
    name: 'Semi-square',
    angle: '45\u00B0',
    description: 'A mild irritation \u2014 like a square but less intense. Semi-squares create friction that is subtle enough to ignore but persistent enough to motivate small changes over time.',
  },
  {
    name: 'Sesquiquadrate',
    angle: '135\u00B0',
    description: 'Similar to the semi-square but slightly more forceful. Sesquiquadrates create a sense of internal agitation that builds until addressed. They often trigger the insight that something in your life needs to shift.',
  },
]
