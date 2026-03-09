export interface LearnHouse {
  number: number
  name: string
  naturalSign: string
  naturalPlanet: string
  description: string
  inReadings: string
}

export const learnHouses: LearnHouse[] = [
  {
    number: 1,
    name: 'The Self',
    naturalSign: 'Aries',
    naturalPlanet: 'Mars',
    description: 'The first house represents how you present yourself to the world \u2014 your appearance, first impressions, and physical body. It is the mask you wear and the energy people feel when they first meet you. Planets here are expressed directly and visibly.',
    inReadings: 'Planets in your 1st house shape how others see you. Transits here change your identity, appearance, or life direction. A new planet entering the 1st house often coincides with a visible personal transformation.',
  },
  {
    number: 2,
    name: 'Resources & Values',
    naturalSign: 'Taurus',
    naturalPlanet: 'Venus',
    description: 'The second house governs what you own, what you earn, and what you value. It covers money, possessions, self-worth, and the physical senses. This house reveals your relationship with material security and what you consider truly valuable.',
    inReadings: 'Planets in your 2nd house influence how you earn and spend. Transits here shift your financial situation or force you to re-evaluate what you consider worth having. Venus here loves luxury; Saturn here demands budgeting.',
  },
  {
    number: 3,
    name: 'Communication & Learning',
    naturalSign: 'Gemini',
    naturalPlanet: 'Mercury',
    description: 'The third house rules everyday communication, short journeys, siblings, neighbours, and early education. It governs how your mind works on a daily level \u2014 how you process information, write, speak, and learn new things.',
    inReadings: 'Planets in your 3rd house shape your communication style and relationship with learning. Mercury here makes you articulate; Mars here makes you blunt. Transits through the 3rd house often bring important messages, short trips, or periods of intense study.',
  },
  {
    number: 4,
    name: 'Home & Roots',
    naturalSign: 'Cancer',
    naturalPlanet: 'Moon',
    description: 'The fourth house is your foundation \u2014 home, family, ancestry, and emotional security. It represents where you come from and what you need to feel safe. This is the most private house in the chart, governing your inner world and domestic life.',
    inReadings: 'Planets in your 4th house shape your home life and relationship with family. The Moon here creates a deep emotional attachment to home; Saturn here may indicate a difficult childhood or heavy family responsibilities. Transits through the 4th house often trigger moves, renovations, or family events.',
  },
  {
    number: 5,
    name: 'Creativity & Joy',
    naturalSign: 'Leo',
    naturalPlanet: 'Sun',
    description: 'The fifth house governs creative self-expression, romance, pleasure, children, and play. It is where you shine, take risks, and express joy without apology. This house reveals what you create, who you fall in love with (before commitment), and what brings you genuine delight.',
    inReadings: 'Planets in your 5th house shape your creative gifts and romantic style. Venus here attracts love easily; Saturn here may delay romance or demand serious creative discipline. Transits through the 5th house bring creative projects, new romances, or reconnection with playfulness.',
  },
  {
    number: 6,
    name: 'Daily Life & Health',
    naturalSign: 'Virgo',
    naturalPlanet: 'Mercury',
    description: 'The sixth house rules your daily routines, work environment, health habits, and acts of service. It governs the unglamorous but essential parts of life \u2014 your diet, exercise, job tasks, and the small rituals that keep you functioning well.',
    inReadings: 'Planets in your 6th house influence your health patterns and work habits. Mars here drives workaholism; Neptune here may cause mysterious health issues. Transits through the 6th house often trigger health changes, job adjustments, or a restructuring of daily routines.',
  },
  {
    number: 7,
    name: 'Partnerships',
    naturalSign: 'Libra',
    naturalPlanet: 'Venus',
    description: 'The seventh house governs committed partnerships \u2014 marriage, business partners, and any one-to-one relationship where you meet an equal. It also reveals what you seek in others that you have not yet developed in yourself. This house is the mirror.',
    inReadings: 'Planets in your 7th house shape your partnership style and what you attract in relationships. Venus here values harmony; Pluto here attracts intense, transformative partners. Transits through the 7th house bring significant relationship events \u2014 meetings, commitments, or separations.',
  },
  {
    number: 8,
    name: 'Transformation & Shared Resources',
    naturalSign: 'Scorpio',
    naturalPlanet: 'Pluto',
    description: 'The eighth house rules transformation, death and rebirth, shared finances, intimacy, and the unseen. It governs inheritances, taxes, debts, and psychological depth. This is where you merge with others at the deepest level and where you confront what you would rather not see.',
    inReadings: 'Planets in your 8th house shape your relationship with power, intimacy, and change. Pluto here lives in constant transformation; Jupiter here may bring financial windfalls through others. Transits through the 8th house bring endings that lead to new beginnings, financial shifts involving other people, or periods of intense inner work.',
  },
  {
    number: 9,
    name: 'Wisdom & Expansion',
    naturalSign: 'Sagittarius',
    naturalPlanet: 'Jupiter',
    description: 'The ninth house governs higher education, philosophy, long-distance travel, publishing, and the search for meaning. It represents your worldview, spiritual beliefs, and the experiences that expand your understanding of life beyond the familiar.',
    inReadings: 'Planets in your 9th house shape your belief system and appetite for adventure. Jupiter here is the eternal student; Saturn here builds belief systems slowly and carefully. Transits through the 9th house bring travel opportunities, educational pursuits, or moments where your worldview fundamentally shifts.',
  },
  {
    number: 10,
    name: 'Career & Public Role',
    naturalSign: 'Capricorn',
    naturalPlanet: 'Saturn',
    description: 'The tenth house is the highest point of the chart \u2014 your career, public reputation, achievements, and legacy. It governs what you are known for, your authority in the world, and the contribution you make to society through your work.',
    inReadings: 'Planets in your 10th house shape your career path and public image. Saturn here demands slow, steady career building; Uranus here brings sudden career changes. Transits through the 10th house bring promotions, career shifts, or moments where your reputation is tested.',
  },
  {
    number: 11,
    name: 'Community & Future Vision',
    naturalSign: 'Aquarius',
    naturalPlanet: 'Uranus',
    description: 'The eleventh house governs friendships, groups, social causes, and your hopes for the future. It represents the communities you belong to, the ideals you pursue, and the role you play in collective movements larger than yourself.',
    inReadings: 'Planets in your 11th house shape your friendships and social ideals. Venus here attracts large, harmonious social circles; Saturn here may limit friendships to a select few. Transits through the 11th house bring new social connections, group involvement, or a redefinition of your long-term goals.',
  },
  {
    number: 12,
    name: 'The Unseen & Surrender',
    naturalSign: 'Pisces',
    naturalPlanet: 'Neptune',
    description: 'The twelfth house is the most mysterious area of the chart \u2014 it governs the unconscious, solitude, dreams, spirituality, and hidden enemies (including self-sabotage). It represents what lies beneath the surface, the patterns you cannot see, and the wisdom that comes from letting go.',
    inReadings: 'Planets in your 12th house operate behind the scenes. Neptune here is deeply psychic; Mars here may struggle with hidden anger. Transits through the 12th house bring periods of retreat, spiritual awakening, or the surfacing of unconscious patterns that need to be released before a new cycle can begin.',
  },
]
