const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const MONTHS_LT_GENITIVE = [
  'Sausio', 'Vasario', 'Kovo', 'Balandžio', 'Gegužės', 'Birželio',
  'Liepos', 'Rugpjūčio', 'Rugsėjo', 'Spalio', 'Lapkričio', 'Gruodžio',
]

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
}

export function getCosmicWeatherTitle(selectedDate: Date, lang: 'en' | 'lt'): string {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (lang === 'lt') {
    if (isSameDay(selectedDate, today)) return 'Šiandienos Kosminis Oras'
    if (isSameDay(selectedDate, tomorrow)) return 'Rytojaus Kosminis Oras'
    if (isSameDay(selectedDate, yesterday)) return 'Vakarykštis Kosminis Oras'
    return `Kosminis Oras — ${MONTHS_LT_GENITIVE[selectedDate.getMonth()]} ${selectedDate.getDate()}`
  }

  if (isSameDay(selectedDate, today)) return "Today's Cosmic Weather"
  if (isSameDay(selectedDate, tomorrow)) return "Tomorrow's Cosmic Weather"
  if (isSameDay(selectedDate, yesterday)) return "Yesterday's Cosmic Weather"
  return `Cosmic Weather — ${MONTHS_EN[selectedDate.getMonth()]} ${selectedDate.getDate()}`
}
