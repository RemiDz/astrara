// Lithuanian noun declensions for planet names
// Used wherever a planet name must agree with a preposition or verb case

export interface PlanetDeclension {
  nominative: string   // subject: Saturnas formuoja...
  genitive: string     // after "iš", possession: Saturno energija
  accusative: string   // direct object, after "apie": Saturną
  instrumental: string // after "su": su Saturnu
  locative: string     // after "yra": Saturne
}

export const PLANET_DECLENSIONS_LT: Record<string, PlanetDeclension> = {
  sun: {
    nominative: 'Saulė',
    genitive: 'Saulės',
    accusative: 'Saulę',
    instrumental: 'Saule',
    locative: 'Saulėje',
  },
  moon: {
    nominative: 'Mėnulis',
    genitive: 'Mėnulio',
    accusative: 'Mėnulį',
    instrumental: 'Mėnuliu',
    locative: 'Mėnulyje',
  },
  mercury: {
    nominative: 'Merkurijus',
    genitive: 'Merkurijaus',
    accusative: 'Merkurijų',
    instrumental: 'Merkurijumi',
    locative: 'Merkurijuje',
  },
  venus: {
    nominative: 'Venera',
    genitive: 'Veneros',
    accusative: 'Venerą',
    instrumental: 'Venera',
    locative: 'Veneroje',
  },
  mars: {
    nominative: 'Marsas',
    genitive: 'Marso',
    accusative: 'Marsą',
    instrumental: 'Marsu',
    locative: 'Marse',
  },
  jupiter: {
    nominative: 'Jupiteris',
    genitive: 'Jupiterio',
    accusative: 'Jupiterį',
    instrumental: 'Jupiteriu',
    locative: 'Jupiteryje',
  },
  saturn: {
    nominative: 'Saturnas',
    genitive: 'Saturno',
    accusative: 'Saturną',
    instrumental: 'Saturnu',
    locative: 'Saturne',
  },
  uranus: {
    nominative: 'Uranas',
    genitive: 'Urano',
    accusative: 'Uraną',
    instrumental: 'Uranu',
    locative: 'Urane',
  },
  neptune: {
    nominative: 'Neptūnas',
    genitive: 'Neptūno',
    accusative: 'Neptūną',
    instrumental: 'Neptūnu',
    locative: 'Neptūne',
  },
  pluto: {
    nominative: 'Plutonas',
    genitive: 'Plutono',
    accusative: 'Plutoną',
    instrumental: 'Plutonu',
    locative: 'Plutone',
  },
}

// Accusative forms for aspect names (used after "formuoja")
export const ASPECT_ACCUSATIVE_LT: Record<string, string> = {
  conjunction: 'konjunkciją',
  sextile: 'sekstilį',
  square: 'kvadratūrą',
  trine: 'triną',
  opposition: 'opoziciją',
}
