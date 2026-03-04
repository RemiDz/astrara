export interface AboutSection {
  icon: string
  heading: string
  paragraphs: string[]
}

export interface AboutFaq {
  q: string
  a: string
}

export interface AboutLink {
  label: string
  url: string
}

export interface AboutContent {
  title: string
  subtitle: string
  intro: string[]
  sections: AboutSection[]
  faq: { heading: string; items: AboutFaq[] }
  links: AboutLink[]
  version: string
}

export const aboutContent: AboutContent = {
  title: 'About Astrara',
  subtitle: 'How it all works',
  intro: [
    'Astrara shows you the sky as it actually is right now \u2014 where every planet sits, what signs they\u2019re moving through, and what that might mean for you today.',
    'Nothing here is random or made up. Every planetary position is calculated to the arc-minute using the same astronomical algorithms NASA uses for space missions. The insights are drawn from centuries of astrological tradition. The sound frequencies come from real physics.',
    'Here\u2019s how it all comes together.',
  ],
  sections: [
    {
      icon: '\u2726',
      heading: 'The Astro Wheel',
      paragraphs: [
        'The wheel at the centre of Astrara is a live map of the solar system as seen from Earth. You are standing at the centre \u2014 the small blue Earth \u2014 and everything around you is positioned exactly where it appears in the sky right now.',
        'The twelve zodiac signs mark the sections of the sky. The planets are placed at their real astronomical positions. As you swipe between days, the planets move to where they actually were or will be.',
        'All positions are calculated locally on your device using an open-source astronomical library called astronomy-engine, which is accurate to within a fraction of a degree and verified against NASA JPL data. No internet connection is needed for the calculations \u2014 your phone does the maths.',
      ],
    },
    {
      icon: '\u263D',
      heading: 'Planetary Insights',
      paragraphs: [
        'When you tap a planet or zodiac sign, you see an insight about what that placement means. These interpretations are based on traditional astrological meanings that have been developed and refined over thousands of years.',
        'Each planet represents a different aspect of human experience \u2014 the Sun is your core identity, the Moon your emotions, Mercury your communication, Venus your relationships, Mars your drive, and so on. The zodiac sign a planet sits in colours how that energy expresses itself.',
        'The insights are written to be genuinely useful, not vague. We aim for the kind of wisdom you might hear from a thoughtful astrologer rather than a fortune cookie.',
      ],
    },
    {
      icon: '\uD83D\uDD0A',
      heading: 'Cosmic Soundscape',
      paragraphs: [
        'When you tap the sound icon, Astrara generates a live ambient soundscape tuned to today\u2019s planetary configuration. This is not pre-recorded music \u2014 it\u2019s created in real time by your device.',
        'The drone frequency is based on the zodiac sign the Moon currently occupies, using the solfeggio frequency scale \u2014 an ancient tuning system that maps specific frequencies to specific qualities of experience. For example, when the Moon is in Pisces, the drone is tuned to 852 Hz (intuition and inner vision).',
        'The binaural beats layer creates a gentle pulsing effect best heard through headphones. Two slightly different frequencies are played in each ear \u2014 your brain perceives the difference as a rhythmic pulse that can help guide your brainwaves into specific states. The beat frequency changes based on the elemental energy of the day: water signs encourage Theta waves (meditation), fire signs encourage Beta waves (alertness), and so on.',
        'When you tap a planet on the wheel, you hear its unique tone. These frequencies are based on the work of Swiss mathematician Hans Cousto, who calculated the audible octave equivalents of planetary orbital periods. Each planet has a real, measurable frequency derived from its orbit around the Sun \u2014 transposed up many octaves into the range human ears can hear.',
      ],
    },
    {
      icon: '\uD83C\uDF0D',
      heading: 'Earth Intelligence',
      paragraphs: [
        'Tapping the Earth at the centre of the wheel shows you live data about our planet\u2019s electromagnetic environment, pulled directly from NOAA (the US National Oceanic and Atmospheric Administration) satellites.',
        'The Kp Index measures how disturbed Earth\u2019s magnetic field is on a scale of 0 to 9. Research has shown that geomagnetic activity can affect human sleep, mood, blood pressure, and even heart rate variability. Sound healing practitioners often find that sessions feel different during magnetically active periods.',
        'The solar wind data shows the speed and density of charged particles streaming from the Sun. When the solar wind hits Earth\u2019s magnetosphere, it can amplify geomagnetic activity \u2014 which is why we track both.',
        'The Schumann Resonance (7.83 Hz) is the electromagnetic frequency of the cavity between the Earth\u2019s surface and the ionosphere. It sits exactly at the boundary between Theta and Alpha brainwaves, and many practitioners consider it the Earth\u2019s natural heartbeat.',
      ],
    },
  ],
  faq: {
    heading: 'Questions & Answers',
    items: [
      {
        q: 'Is this real astronomy or just astrology?',
        a: 'Both. The planetary positions are calculated using the same precise astronomical data that scientists use. The interpretations of what those positions mean draw from the astrological tradition \u2014 which you\u2019re free to take as literally or metaphorically as you like.',
      },
      {
        q: 'How accurate are the planet positions?',
        a: 'Extremely accurate. The astronomy-engine library we use is verified against NASA\u2019s Jet Propulsion Laboratory data and is accurate to within fractions of a degree. These are the same algorithms used to navigate spacecraft.',
      },
      {
        q: 'Do I need headphones for the sound?',
        a: 'The drone and planet tones work through speakers, but the binaural beats effect only works with headphones. When two slightly different frequencies are played in separate ears, your brain creates the beat \u2014 this can\u2019t happen through speakers where both ears hear everything.',
      },
      {
        q: 'What are solfeggio frequencies?',
        a: 'The solfeggio frequencies (174, 285, 396, 417, 528, 639, 741, 852, 963 Hz) are a set of tones that many sound healing traditions associate with specific physical and emotional qualities. While scientific evidence for their specific healing properties is still emerging, they provide a meaningful and intentional framework for tuning the soundscape to the current cosmic energy.',
      },
      {
        q: 'Where does the Earth data come from?',
        a: 'Directly from NOAA\u2019s Space Weather Prediction Center \u2014 the same data that power companies and airlines use to prepare for geomagnetic storms. It\u2019s updated every few minutes from satellites monitoring the Sun and Earth\u2019s magnetic field.',
      },
      {
        q: 'Does this app track me or collect my data?',
        a: 'No. Astrara doesn\u2019t collect personal data. Your location is used only to show local time and is never sent to any server. If you enter birth details, they\u2019re stored on your device only. We use Plausible Analytics, which is privacy-focused and doesn\u2019t use cookies.',
      },
      {
        q: 'Who made this?',
        a: 'Astrara is part of the Harmonic Waves ecosystem \u2014 a suite of free tools built for sound healing practitioners and anyone curious about the relationship between cosmic rhythms and human experience. Learn more at harmonicwaves.app.',
      },
    ],
  },
  links: [
    { label: 'Explore the full ecosystem', url: 'https://harmonicwaves.app' },
    { label: 'Earth Pulse deep dive', url: 'https://shumann.app' },
    { label: 'Dedicated binaural beats', url: 'https://binara.app' },
  ],
  version: 'v2.0',
}
