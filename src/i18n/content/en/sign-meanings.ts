export interface SignInsight {
  whatItFeelsLike: string
  keywords: string[]
}

export const signMeanings: Record<string, SignInsight> = {
  aries: {
    whatItFeelsLike: "Aries energy feels like the first warm day of spring — a sudden, undeniable urge to move, to start, to become. It's the spark before the fire, the breath before the shout. Everything feels possible, and waiting feels impossible.",
    keywords: ["courage", "initiative", "independence", "directness"],
  },
  taurus: {
    whatItFeelsLike: "Taurus energy feels like bare feet on warm earth — slow, deliberate, deeply sensual. It's the satisfaction of a meal cooked with love, the peace of a garden in full bloom. Nothing needs to be rushed when everything already tastes this good.",
    keywords: ["stability", "patience", "sensuality", "determination"],
  },
  gemini: {
    whatItFeelsLike: "Gemini energy feels like a conversation that keeps branching into more fascinating conversations — electric, curious, endlessly alive. It's the thrill of a new idea, the joy of connecting dots no one else can see. The mind dances, and the world can barely keep up.",
    keywords: ["curiosity", "adaptability", "communication", "wit"],
  },
  cancer: {
    whatItFeelsLike: "Cancer energy feels like coming home after a long journey — the click of the lock, the familiar scent, the exhale you didn't know you were holding. It's the fierce tenderness of someone who loves deeply and protects what matters with quiet, unwavering strength.",
    keywords: ["nurturing", "intuition", "protection", "emotional depth"],
  },
  leo: {
    whatItFeelsLike: "Leo energy feels like stepping into a sunbeam that was waiting just for you — warm, golden, unapologetically radiant. It's the courage to be seen exactly as you are, the generosity of a heart that has enough light for everyone in the room.",
    keywords: ["creativity", "confidence", "generosity", "leadership"],
  },
  virgo: {
    whatItFeelsLike: "Virgo energy feels like the quiet satisfaction of a perfectly organized space — every detail noticed, every thread in its right place. It's the healer's hands, the editor's eye, the devotion of someone who shows love through acts of careful, thoughtful service.",
    keywords: ["precision", "service", "analysis", "devotion"],
  },
  libra: {
    whatItFeelsLike: "Libra energy feels like the moment a room falls into perfect balance — beautiful music, soft light, two people understanding each other completely. It's the artist's eye for harmony, the diplomat's gift for making peace feel effortless and elegant.",
    keywords: ["harmony", "partnership", "beauty", "justice"],
  },
  scorpio: {
    whatItFeelsLike: "Scorpio energy feels like diving into deep water at night — terrifying, exhilarating, and somehow exactly where you need to be. It's the courage to look at what others turn away from, the power that comes from refusing to live on the surface.",
    keywords: ["intensity", "transformation", "depth", "resilience"],
  },
  sagittarius: {
    whatItFeelsLike: "Sagittarius energy feels like standing on a mountaintop with the whole world spread below — boundless, free, hungry for meaning. It's the philosopher's fire, the traveller's restless feet, the unshakeable faith that the next horizon holds something extraordinary.",
    keywords: ["exploration", "optimism", "wisdom", "freedom"],
  },
  capricorn: {
    whatItFeelsLike: "Capricorn energy feels like the quiet pride of a cathedral built stone by stone over centuries — patient, ambitious, enduring. It's the steady hand that plays the long game, the deep knowing that what's built with discipline and integrity will outlast everything else.",
    keywords: ["ambition", "discipline", "responsibility", "mastery"],
  },
  aquarius: {
    whatItFeelsLike: "Aquarius energy feels like a signal from the future — strange, brilliant, slightly ahead of its time. It's the inventor's flash of insight, the rebel's refusal to accept the world as it is. Connection matters deeply, but never at the cost of authenticity.",
    keywords: ["innovation", "independence", "humanitarianism", "vision"],
  },
  pisces: {
    whatItFeelsLike: "Pisces energy feels like music heard in a dream — hauntingly beautiful, impossible to hold, yet impossible to forget. It's the mystic's knowing, the artist's surrender, the vast compassion of a soul that feels the whole ocean in a single drop of water.",
    keywords: ["imagination", "compassion", "intuition", "transcendence"],
  },
}
