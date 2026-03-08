/**
 * Plain-English planet domain labels for display on reading cards and main page.
 * Used by both Cosmic Reading (Change 4C) and Today's Cosmic Weather (Change 5).
 */

export const PLANET_DOMAINS: Record<string, { en: string; lt: string }> = {
  sun:     { en: 'Identity & Vitality',       lt: 'Tapatybe ir Gyvybingumas' },
  moon:    { en: 'Emotions & Intuition',      lt: 'Emocijos ir Intuicija' },
  mercury: { en: 'Communication & Mind',      lt: 'Bendravimas ir Protas' },
  venus:   { en: 'Love, Beauty & Values',     lt: 'Meile, Grozis ir Vertybes' },
  mars:    { en: 'Drive, Action & Energy',    lt: 'Valia, Veiksmas ir Energija' },
  jupiter: { en: 'Growth, Luck & Wisdom',     lt: 'Augimas, Sekme ir Ismintis' },
  saturn:  { en: 'Discipline & Structure',    lt: 'Disciplina ir Struktura' },
  uranus:  { en: 'Innovation & Change',       lt: 'Inovacijos ir Pokyciai' },
  neptune: { en: 'Dreams & Spirituality',     lt: 'Svajones ir Dvasingumas' },
  pluto:   { en: 'Transformation & Power',    lt: 'Transformacija ir Galia' },
}
