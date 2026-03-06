export interface HouseTheme {
  area: { en: string; lt: string }
  keywords: { en: string[]; lt: string[] }
}

export const HOUSE_THEMES: Record<number, HouseTheme> = {
  1: {
    area: { en: 'Self & Identity', lt: 'Tapatyb\u0117 ir savimon\u0117' },
    keywords: {
      en: ['appearance', 'new beginnings', 'personal energy'],
      lt: ['i\u0161vaizda', 'naujos prad\u017eios', 'asmenin\u0117 energija'],
    },
  },
  2: {
    area: { en: 'Finances & Values', lt: 'Finansai ir vertyb\u0117s' },
    keywords: {
      en: ['money', 'self-worth', 'material security'],
      lt: ['pinigai', 'savivert\u0117', 'materialinis saugumas'],
    },
  },
  3: {
    area: { en: 'Communication & Learning', lt: 'Bendravimas ir mokymasis' },
    keywords: {
      en: ['conversations', 'short trips', 'siblings', 'ideas'],
      lt: ['pokalbiai', 'trumpos kelion\u0117s', 'broliai ir seserys', 'id\u0117jos'],
    },
  },
  4: {
    area: { en: 'Home & Family', lt: 'Namai ir \u0161eima' },
    keywords: {
      en: ['roots', 'emotional foundation', 'private life'],
      lt: ['\u0161aknys', 'emocinis pamatas', 'privatus gyvenimas'],
    },
  },
  5: {
    area: { en: 'Creativity & Joy', lt: 'K\u016brybi\u0161kumas ir d\u017eiaugsmas' },
    keywords: {
      en: ['romance', 'children', 'self-expression', 'play'],
      lt: ['romantika', 'vaikai', 'savirai\u0161ka', '\u017eaidimas'],
    },
  },
  6: {
    area: { en: 'Health & Daily Routine', lt: 'Sveikata ir kasdienybe' },
    keywords: {
      en: ['wellness', 'work habits', 'service', 'healing'],
      lt: ['sveikata', 'darbo \u012fpro\u010diai', 'tarnavimas', 'gijimas'],
    },
  },
  7: {
    area: { en: 'Relationships & Partnerships', lt: 'Santykiai ir partneryst\u0117s' },
    keywords: {
      en: ['one-on-one connections', 'marriage', 'collaboration'],
      lt: ['artimi ry\u0161iai', 'santuoka', 'bendradarbiavimas'],
    },
  },
  8: {
    area: { en: 'Transformation & Depth', lt: 'Transformacija ir gelm\u0117' },
    keywords: {
      en: ['shared resources', 'intimacy', 'rebirth', 'mystery'],
      lt: ['bendri i\u0161tekliai', 'intymumas', 'atgimimas', 'paslaptis'],
    },
  },
  9: {
    area: { en: 'Exploration & Wisdom', lt: 'Tyrin\u0117jimas ir i\u0161mintis' },
    keywords: {
      en: ['travel', 'philosophy', 'higher learning', 'expansion'],
      lt: ['kelion\u0117s', 'filosofija', 'auk\u0161tasis mokslas', 'pl\u0117tra'],
    },
  },
  10: {
    area: { en: 'Career & Public Image', lt: 'Karjera ir vie\u0161asis \u012fvaizdis' },
    keywords: {
      en: ['ambition', 'reputation', 'achievement', 'authority'],
      lt: ['ambicija', 'reputacija', 'pasiekimai', 'autoritetas'],
    },
  },
  11: {
    area: { en: 'Community & Vision', lt: 'Bendruomen\u0117 ir vizija' },
    keywords: {
      en: ['friendships', 'groups', 'hopes', 'humanitarian goals'],
      lt: ['draugyst\u0117s', 'grup\u0117s', 'viltys', 'humanitariniai tikslai'],
    },
  },
  12: {
    area: { en: 'Spirituality & Surrender', lt: 'Dvasingumas ir atsidavimas' },
    keywords: {
      en: ['solitude', 'subconscious', 'rest', 'transcendence'],
      lt: ['vienatv\u0117', 'pas\u0105mon\u0117', 'poilsis', 'transcendencija'],
    },
  },
}
