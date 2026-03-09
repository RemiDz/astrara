import type { LearnElement, CoustoFrequency } from '../en/learn-elements'

export const learnElements: LearnElement[] = [
  {
    id: 'fire',
    name: 'Ugnies Ženklai',
    signs: 'Avinas, Li\u016Btas, \u0160aulys',
    description: 'Ugnies energija yra aktyvi, k\u016Brybi\u0161ka ir i\u0161orinė. Kai daug planet\u0173 yra ugnies \u017Eenkluose, kolektyvinė energija yra dr\u0105si ir nekantri. Ugnis inicijuoja, \u012Fkvepia ir transformuoja per veiksm\u0105. Tai kibirkštis, kuri apšvie\u010Dia keli\u0105 \u2014 aistringa, dr\u0105si ir kartais ryjanti.',
    soundApproach: 'Ritmiškas, aktyvuojantis, kylantis link atleidimo. Ugnies sesijos turėtų turėti aiškų lanką \u2014 augantis intensyvumas, o po to galingas atleidimo taškas.',
    frequencyRange: '396\u2013741 Hz',
    instruments: 'Būgnai (djemb\u0117, r\u0117minis b\u016Bgnas, bodhranas), gongai, didgeridoo, dainavimas',
    caution: 'Ugnies perteklius gali sukelti perdegim\u0105, pykt\u012F ir nerimastingum\u0105. Naudokite vandens instrumentus (vandenyno b\u016Bgnai, lietaus lazd\u0117s) balansui.',
    solfeggioConnections: [
      { sign: 'Avinas', frequency: '396 Hz', quality: 'I\u0161silaisvinimas nuo baim\u0117s' },
      { sign: 'Li\u016Btas', frequency: '741 Hz', quality: 'I\u0161raiška ir sprendimai' },
      { sign: '\u0160aulys', frequency: '963 Hz', quality: 'Atbudimas ir jungtis' },
    ],
  },
  {
    id: 'earth',
    name: '\u017Dem\u0117s Ženklai',
    signs: 'Jautis, Mergel\u0117, O\u017Eiaragis',
    description: '\u017Dem\u0117s energija yra stabili, prakti\u0161ka ir form\u0105 suteikianti. Kai daug planet\u0173 yra \u017Eem\u0117s \u017Eenkluose, kolektyvinis d\u0117mesys krypsta \u012F materialin\u0119 tikrov\u0119 \u2014 darb\u0105, pinigus, sveikat\u0105 ir statym\u0105. \u017Dem\u0117 palaiko, strukt\u016Bruoja ir materializuoja.',
    soundApproach: 'L\u0117tas, \u012F\u017Eeminantis, i\u0161laikomas rezonansas. \u017Dem\u0117s sesijos turėtų jaustis \u012F\u0161aknijusios \u2014 ilgi tonai, pastov\u016Bs ritmai ir vibracijos, kurias jaučiate kauluose.',
    frequencyRange: '174\u2013528 Hz',
    instruments: 'Monochordas, \u017Eem\u0117s gongai, \u017Eemos dainavimo dubenys, kamertonai',
    caution: '\u017Dem\u0117s perteklius gali sukelti stagnacij\u0105, ri\u017Eidumą ir pasi\u0161priešinim\u0105 poky\u010Diams. Naudokite oro instrumentus (\u010Aimbeliai, fleita, varpeliai) judėjimui.',
    solfeggioConnections: [
      { sign: 'Jautis', frequency: '417 Hz', quality: 'Poky\u010Di\u0173 palengvinimas' },
      { sign: 'Mergel\u0117', frequency: '852 Hz', quality: 'Gr\u0105\u017Einimas \u012F dvasin\u0119 tvark\u0105' },
      { sign: 'O\u017Eiaragis', frequency: '417 Hz', quality: 'Situacij\u0173 pakeitimas ir poky\u010Di\u0173 palengvinimas' },
    ],
  },
  {
    id: 'air',
    name: 'Oro Ženklai',
    signs: 'Dvyniai, Svarstykl\u0117s, Vandenis',
    description: 'Oro energija yra protin\u0117, socialin\u0117 ir komunikacin\u0117. Kai daug planet\u0173 yra oro \u017Eenkluose, id\u0117jos teka laisvai, pokalbiai \u012Fsi\u017Eiebia ir ry\u0161ys stipr\u0117ja. Oras analizuoja, susieja ir skleid\u017Eia.',
    soundApproach: 'Lengvas, \u012Fvairus, intelektualiai \u012Ftraukiantis. Oro sesijos naudin gos kei\u010Dian\u010Diomis tekst\u016Bromis, netik\u0117tais intervalais. Tyla tarp gars\u0173 yra tokia pat svarbi kaip patys garsai.',
    frequencyRange: '528\u2013963 Hz',
    instruments: '\u010Caimbeliai, varpeliai, fleita, kalimba, kamertonai, kristaliniai dubenys',
    caution: 'Oro perteklius gali sukelti per didel\u012F m\u0105stym\u0105, nerim\u0105 ir emocin\u012F atsijungim\u0105. Naudokite \u017Eem\u0117s instrumentus \u012F\u017Eeminimui ir vandens instrumentus jausm\u0173 ry\u0161iui.',
    solfeggioConnections: [
      { sign: 'Dvyniai', frequency: '528 Hz', quality: 'Transformacija ir DNR atstatymas' },
      { sign: 'Svarstykl\u0117s', frequency: '963 Hz', quality: 'Atbudimas ir jungtis su \u0161altiniu' },
      { sign: 'Vandenis', frequency: '528 Hz', quality: 'Transformacija ir stebuklai' },
    ],
  },
  {
    id: 'water',
    name: 'Vandens Ženklai',
    signs: 'V\u0117\u017Eys, Skorpionas, \u017Duvys',
    description: 'Vandens energija yra emocin\u0117, intuityvi ir vidin\u0117. Kai daug planet\u0173 yra vandens \u017Eenkluose, emocin\u0117s srov\u0117s teka giliai. Intuicija yra j\u016Bs\u0173 kompasas. Vanduo jau\u010Dia, gydo ir tirpdo.',
    soundApproach: 'Tekantis, \u012Fsismelkiantis, emoci\u0161kai rezonuojantis. Vandens sesijos turėtų jaustis kaip buvimas apglėbtam \u2014 be aštrių kampų, švelnios dinamikos ir garsai, kurie teka per jus.',
    frequencyRange: '396\u2013852 Hz',
    instruments: 'Kristaliniai dubenėliai (matiniai), vandenyno b\u016Bgnai, lietaus lazdos, harmonijus, vandens garsai',
    caution: 'Vandens perteklius gali sukelti emocin\u012F persikrovim\u0105, rib\u0173 i\u0161tirpim\u0105 ir eskpizm\u0105. Naudokite ugnies instrumentus energizavimui ir \u017Eem\u0117s instrumentus strukt\u016Brai.',
    solfeggioConnections: [
      { sign: 'V\u0117\u017Eys', frequency: '639 Hz', quality: 'Jungtis ir santykiai' },
      { sign: 'Skorpionas', frequency: '396 Hz', quality: 'I\u0161silaisvinimas ir sielvartos pavertimas d\u017Eiaugsmu' },
      { sign: '\u017Duvys', frequency: '852 Hz', quality: 'Gr\u0105\u017Einimas \u012F dvasin\u0119 tvark\u0105' },
    ],
  },
]

export const coustoFrequencies: CoustoFrequency[] = [
  { planet: 'Saul\u0117', frequency: '126,22 Hz', octave: '32-as', note: 'B', colour: '\u017Daliai geltona' },
  { planet: 'M\u0117nulis (sinodinis)', frequency: '210,42 Hz', octave: '29-as', note: 'G\u266F', colour: 'Oran\u017Ein\u0117' },
  { planet: 'Merkurijus', frequency: '141,27 Hz', octave: '30-as', note: 'C\u266F/D\u266D', colour: 'M\u0117lsvai \u017Ealia' },
  { planet: 'Venera', frequency: '221,23 Hz', octave: '32-as', note: 'A', colour: 'Geltonai oran\u017Ein\u0117' },
  { planet: 'Marsas', frequency: '144,72 Hz', octave: '33-as', note: 'D', colour: 'M\u0117lyna' },
  { planet: 'Jupiteris', frequency: '183,58 Hz', octave: '36-as', note: 'F\u266F', colour: 'Raudona' },
  { planet: 'Saturnas', frequency: '147,85 Hz', octave: '37-as', note: 'D', colour: 'M\u0117lyna' },
  { planet: 'Uranas', frequency: '207,36 Hz', octave: '39-as', note: 'G\u266F', colour: 'Oran\u017Ein\u0117' },
  { planet: 'Nept\u016Bnas', frequency: '211,44 Hz', octave: '40-as', note: 'G\u266F', colour: 'Oran\u017Ein\u0117' },
  { planet: 'Plutonas', frequency: '140,25 Hz', octave: '40-as', note: 'C\u266F/D\u266D', colour: 'M\u0117lsvai \u017Ealia' },
]

export const coustoExplanation = 'Hansas Cousto, \u0160veicarijos matematikas ir muzikologas, atrado matematin\u012F ry\u0161\u012F tarp planeti\u0173 orbitinių period\u0173 ir girdim\u0173 da\u017Eni\u0173. Taikydamas oktavos princip\u0105 (da\u017Enio dvigubinimas) itin \u017Eemam planetos orbitinio periodo da\u017Eniui, jis pasiek\u0117 girdimus tonus. Pavyzd\u017Eiui, \u017Dem\u0117 apskrieja Saul\u0119 vien\u0105 kart\u0105 per metus \u2014 tai itin \u017Eemas da\u017Enis (maždaug 0,00000003171 Hz). Dvigubinant j\u012F 32 kartus, gaunamas 136,10 Hz \u2014 „Om" da\u017Enis, atitinkantis C\u266F. \u0160ie da\u017Eniai n\u0117ra atsitiktiniai dvasiniai pasirinkimai, o matematiškai i\u0161vesti ry\u0161iai tarp dangaus mechanikos ir garso.'

export const etherSection = {
  name: 'Eteris / Dvasia',
  description: 'U\u017E keturi\u0173 klsikiniu element\u0173 daug tradicij\u0173 pripa\u017E\u012Fsta penkt\u0105j\u012F element\u0105 \u2014 Eter\u012F, Dvasi\u0105 arba Aka\u0161\u0105. Harmonic Waves ekosistemoje \u0161is penktasis elementas reprezentuoja vienijant\u012F lauk\u0105, jungiant\u012F visus dalykus: erdv\u0119, per kuri\u0105 keliauja garsas, tyl\u0105 tarp nat\u0173, s\u0105mon\u0119, kuri stebi.',
  soundConnection: 'Eteris rezonuoja su tyla, obertonais ir tarpais tarp gars\u0173. \u0160umano rezonansas (7,83 Hz) \u2014 \u017Dem\u0117s elektromagnetinis \u0161irdies ritmas \u2014 yra artimiausias fizinis eterio da\u017Enio atitikmuo. Garso terapijos sesijos, apiman\u010Dios s\u0105moning\u0105 tyl\u0105, i\u0161laikomus obertonus ir d\u0117mes\u012F tarpams tarp ton\u0173, dirba su eterio energija. Om da\u017Enis (136,10 Hz, \u017Dem\u0117s met\u0173 tonas) tiltu jungia fizinius ir dvasinius elementus.',
}
