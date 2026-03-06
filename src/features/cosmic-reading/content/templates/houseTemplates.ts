export interface HouseTheme {
  area: string
  keywords: string[]
}

export const HOUSE_THEMES: Record<number, HouseTheme> = {
  1:  { area: 'Self & Identity',              keywords: ['appearance', 'new beginnings', 'personal energy'] },
  2:  { area: 'Finances & Values',            keywords: ['money', 'self-worth', 'material security'] },
  3:  { area: 'Communication & Learning',     keywords: ['conversations', 'short trips', 'siblings', 'ideas'] },
  4:  { area: 'Home & Family',                keywords: ['roots', 'emotional foundation', 'private life'] },
  5:  { area: 'Creativity & Joy',             keywords: ['romance', 'children', 'self-expression', 'play'] },
  6:  { area: 'Health & Daily Routine',       keywords: ['wellness', 'work habits', 'service', 'healing'] },
  7:  { area: 'Relationships & Partnerships', keywords: ['one-on-one connections', 'marriage', 'collaboration'] },
  8:  { area: 'Transformation & Depth',       keywords: ['shared resources', 'intimacy', 'rebirth', 'mystery'] },
  9:  { area: 'Exploration & Wisdom',         keywords: ['travel', 'philosophy', 'higher learning', 'expansion'] },
  10: { area: 'Career & Public Image',        keywords: ['ambition', 'reputation', 'achievement', 'authority'] },
  11: { area: 'Community & Vision',           keywords: ['friendships', 'groups', 'hopes', 'humanitarian goals'] },
  12: { area: 'Spirituality & Surrender',     keywords: ['solitude', 'subconscious', 'rest', 'transcendence'] },
}
