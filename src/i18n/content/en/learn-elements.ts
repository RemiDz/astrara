export interface LearnElement {
  id: string
  name: string
  signs: string
  description: string
  soundApproach: string
  frequencyRange: string
  instruments: string
  caution: string
  solfeggioConnections: { sign: string; frequency: string; quality: string }[]
}

export const learnElements: LearnElement[] = [
  {
    id: 'fire',
    name: 'Fire Signs',
    signs: 'Aries, Leo, Sagittarius',
    description: 'Fire energy is active, creative, and outward-moving. When multiple planets are in fire signs, the collective energy is bold and impatient. Fire initiates, inspires, and transforms through action. It is the spark that lights the way \u2014 passionate, courageous, and sometimes consuming. Fire people lead with instinct and learn by doing.',
    soundApproach: 'Rhythmic, activating, building towards release. Fire sessions should have a clear arc \u2014 building intensity followed by a powerful release point. Movement and drumming are natural companions.',
    frequencyRange: '396\u2013741 Hz',
    instruments: 'Drums (djembe, frame drum, bodhran), gongs, didgeridoo, singing, clapping',
    caution: 'Fire excess can cause burnout, anger, and restlessness. Use water instruments (ocean drum, rain stick, soft bowls) to balance.',
    solfeggioConnections: [
      { sign: 'Aries', frequency: '396 Hz', quality: 'Liberation from fear' },
      { sign: 'Leo', frequency: '741 Hz', quality: 'Expression and solutions' },
      { sign: 'Sagittarius', frequency: '963 Hz', quality: 'Awakening and connection' },
    ],
  },
  {
    id: 'earth',
    name: 'Earth Signs',
    signs: 'Taurus, Virgo, Capricorn',
    description: 'Earth energy is stable, practical, and form-giving. When multiple planets are in earth signs, the collective focus turns to material reality \u2014 work, money, health, and building. Earth sustains, structures, and manifests. It is the ground beneath your feet \u2014 reliable, patient, and deeply sensual. Earth people build with care and trust what they can touch.',
    soundApproach: 'Slow, grounding, sustained resonance. Earth sessions should feel rooted \u2014 long tones, steady rhythms, and vibrations you can feel in your bones. Body contact with instruments (bowls placed on the body) amplifies earth energy.',
    frequencyRange: '174\u2013528 Hz',
    instruments: 'Monochord, earth gongs, low singing bowls, tuning forks, body placement bowls',
    caution: 'Earth excess can cause stagnation, rigidity, and resistance to change. Use air instruments (chimes, flute, bells) to introduce movement and lightness.',
    solfeggioConnections: [
      { sign: 'Taurus', frequency: '417 Hz', quality: 'Facilitating change' },
      { sign: 'Virgo', frequency: '852 Hz', quality: 'Returning to spiritual order' },
      { sign: 'Capricorn', frequency: '417 Hz', quality: 'Undoing situations and facilitating change' },
    ],
  },
  {
    id: 'air',
    name: 'Air Signs',
    signs: 'Gemini, Libra, Aquarius',
    description: 'Air energy is mental, social, and communicative. When multiple planets are in air signs, ideas flow freely, conversations spark, and connection is amplified. Air analyses, relates, and disseminates. It is the breath that carries the word \u2014 quick, curious, and endlessly adaptive. Air people think first and feel later.',
    soundApproach: 'Light, varied, intellectually engaging. Air sessions benefit from changing textures, unexpected intervals, and instruments that interact with each other. Silence between sounds is as important as the sounds themselves.',
    frequencyRange: '528\u2013963 Hz',
    instruments: 'Chimes, bells, flute, kalimba, tuning forks, crystal bowls (clear/alchemy)',
    caution: 'Air excess can cause overthinking, anxiety, and emotional disconnection. Use earth instruments (monochord, low bowls) to ground, and water instruments (ocean drum) to reconnect with feeling.',
    solfeggioConnections: [
      { sign: 'Gemini', frequency: '528 Hz', quality: 'Transformation and DNA repair' },
      { sign: 'Libra', frequency: '963 Hz', quality: 'Awakening and connection to source' },
      { sign: 'Aquarius', frequency: '528 Hz', quality: 'Transformation and miracles' },
    ],
  },
  {
    id: 'water',
    name: 'Water Signs',
    signs: 'Cancer, Scorpio, Pisces',
    description: 'Water energy is emotional, intuitive, and inward-moving. When multiple planets are in water signs, emotional currents run deep. Intuition is your compass. Water feels, heals, and dissolves. It is the tide that connects everything \u2014 empathetic, mysterious, and powerful in its softness. Water people navigate by feeling and remember through the body.',
    soundApproach: 'Flowing, immersive, emotionally resonant. Water sessions should feel like being held \u2014 no sharp edges, gentle dynamics, and sounds that wash over you. This is the element most naturally aligned with sound healing.',
    frequencyRange: '396\u2013852 Hz',
    instruments: 'Crystal bowls (frosted), ocean drums, rain sticks, harmonium, water sounds, ambient layers',
    caution: 'Water excess can cause emotional overwhelm, boundary dissolution, and escapism. Use fire instruments (drums, gongs) to activate and energise, and earth instruments (monochord) to provide structure.',
    solfeggioConnections: [
      { sign: 'Cancer', frequency: '639 Hz', quality: 'Connecting and relationships' },
      { sign: 'Scorpio', frequency: '396 Hz', quality: 'Liberation and turning grief into joy' },
      { sign: 'Pisces', frequency: '852 Hz', quality: 'Returning to spiritual order' },
    ],
  },
]

export interface CoustoFrequency {
  planet: string
  frequency: string
  octave: string
  note: string
  colour: string
}

export const coustoFrequencies: CoustoFrequency[] = [
  { planet: 'Sun', frequency: '126.22 Hz', octave: '32nd', note: 'B', colour: 'Yellow-green' },
  { planet: 'Moon (synodic)', frequency: '210.42 Hz', octave: '29th', note: 'G\u266F', colour: 'Orange' },
  { planet: 'Mercury', frequency: '141.27 Hz', octave: '30th', note: 'C\u266F/D\u266D', colour: 'Blue-green' },
  { planet: 'Venus', frequency: '221.23 Hz', octave: '32nd', note: 'A', colour: 'Yellow-orange' },
  { planet: 'Mars', frequency: '144.72 Hz', octave: '33rd', note: 'D', colour: 'Blue' },
  { planet: 'Jupiter', frequency: '183.58 Hz', octave: '36th', note: 'F\u266F', colour: 'Red' },
  { planet: 'Saturn', frequency: '147.85 Hz', octave: '37th', note: 'D', colour: 'Blue' },
  { planet: 'Uranus', frequency: '207.36 Hz', octave: '39th', note: 'G\u266F', colour: 'Orange' },
  { planet: 'Neptune', frequency: '211.44 Hz', octave: '40th', note: 'G\u266F', colour: 'Orange' },
  { planet: 'Pluto', frequency: '140.25 Hz', octave: '40th', note: 'C\u266F/D\u266D', colour: 'Blue-green' },
]

export const coustoExplanation = 'Hans Cousto, a Swiss mathematician and musicologist, discovered the mathematical relationship between planetary orbital periods and audible frequencies. By applying the principle of the octave (doubling a frequency) repeatedly to the extremely low frequency of a planet\u2019s orbital period, he arrived at audible tones. For example, the Earth orbits the Sun once per year \u2014 this is an extremely low frequency (approximately 0.00000003171 Hz). By doubling it 32 times, you arrive at 136.10 Hz \u2014 the \u201COm\u201D frequency, which corresponds to C\u266F. These frequencies are not arbitrary spiritual choices but mathematically derived relationships between celestial mechanics and sound. Many singing bowl and gong manufacturers now tune their instruments to Cousto\u2019s planetary frequencies.'

export const etherSection = {
  name: 'Ether / Spirit',
  description: 'Beyond the four classical elements, many traditions recognise a fifth element \u2014 Ether, Spirit, or Akasha. In the Harmonic Waves ecosystem, this fifth element represents the unifying field that connects all things: the space through which sound travels, the silence between notes, the consciousness that observes. Ether is not associated with specific zodiac signs but with the chart as a whole \u2014 the pattern itself, the intelligence behind the arrangement.',
  soundConnection: 'Ether resonates with silence, overtones, and the spaces between sounds. The Schumann Resonance (7.83 Hz) \u2014 Earth\u2019s electromagnetic heartbeat \u2014 is the closest physical equivalent to the ether frequency. Sound healing sessions that include intentional silence, sustained overtones, and awareness of the spaces between tones are working with ether energy. The Om frequency (136.10 Hz, the Earth\u2019s year tone) bridges the physical and spiritual elements.',
}
