import type { LearnAspect, LearnMinorAspect } from '../en/learn-aspects'

export const learnAspects: LearnAspect[] = [
  {
    id: 'conjunction',
    symbol: '\u260C',
    name: 'Konjunkcija',
    angle: '0\u00B0',
    title: 'Susiliejimas',
    energy: 'Intensyvinanti, jungian\u010Di, stiprinanti',
    description: 'Konjunkcija \u012Fvyksta, kai dvi planetos u\u017Eima t\u0105 pat\u012F zodiako laipsn\u012F \u2014 j\u0173 energijos susilieja \u012F vien\u0105 j\u0117g\u0105. Tai galingiausias aspektas, nes dvi planetos negali b\u016Bti atskirtos. Ar tai jau\u010Diama k\u016Brybinga ar pernelyg intensyvu, priklauso nuo suinteresuot\u0173 planet\u0173.',
    inPractice: 'Konjunkcijos sutelkia energij\u0105 vienoje gyvenimo srityje. Jos reikalauja d\u0117mesio. N\u0117ra jokio subtilaus \u2014 k\u0105 planetos simbolizuoja, bus gar\u0161iai. Sesijose konjunkcijos yra temos, kuri\u0173 klientai negali i\u0161vengti.',
    visualColour: 'Gintarin\u0117s linijos rate',
  },
  {
    id: 'sextile',
    symbol: '\u26B9',
    name: 'Sekstilis',
    angle: '60\u00B0',
    title: 'Galimyb\u0117',
    energy: 'Palaikantis, skatinantis, aktyvuojantis',
    description: 'Sekstilis sujungia planetas, esančias 60\u00B0 atstumu \u2014 visada suderinamuose elementuose (ugnis\u2013oras arba žemė\u2013vanduo). Tai sukuria švelni\u0105, produktyvi\u0105 jungt\u012F. Skirtingai nuo trino, sekstilis reikalauja nedideli\u0173 pastang\u0173 aktyvavimui.',
    inPractice: 'Sekstiliai reiškia galimybes, kurioms reikia iniciatyvos. Juos lengva praleisti, jei nesate d\u0117mesingi. Garso terapijoje sekstiliai palaiko \u0161velnius, laipsni\u0161kus poky\u010Dius.',
    visualColour: 'M\u0117lynos linijos rate',
  },
  {
    id: 'square',
    symbol: '\u25A1',
    name: 'Kvadrat\u016Bra',
    angle: '90\u00B0',
    title: 'K\u016Brybin\u0117 \u012Ftampa',
    energy: 'I\u0161\u0161\u016Bkinga, motyvuojanti, trintis kurianti',
    description: 'Kvadrat\u016Bra sujungia planetas, esančias 90\u00B0 atstumu \u2014 ženkluose, kurie dalijasi ta pa\u010Dia modalybe, bet susiduria elementais. Tai sukuria trint\u012F, \u012Ftamp\u0105 ir skub\u0173 poreik\u012F veikti. Kvadrat\u016Bros n\u0117ra patogios, bet yra produktyvios.',
    inPractice: 'Kvadrat\u016Bros reikalauja sprendimo. Jos sukuria spaudim\u0105, kuris priverčia priimti sprendimus ir praver\u017Eti. Garso terapijoje kvadrat\u016Bros energija naudinga su instrumentais, atleid\u017Eian\u010Diais \u012Ftamp\u0105 \u2014 gongais, b\u016Bgnais.',
    visualColour: 'Raudonos linijos rate',
  },
  {
    id: 'trine',
    symbol: '\u25B3',
    name: 'Trinas',
    angle: '120\u00B0',
    title: 'Srautas',
    energy: 'Harmoningas, lengvas, nat\u016Bralus',
    description: 'Trinas sujungia planetas, esančias 120\u00B0 atstumu \u2014 visada to paties elemento \u017Eenkluose. Tai sukuria nat\u016Bral\u0173 energijos sraut\u0105 tarp j\u0173, lyg up\u0117 rast\u0173 lengviausi\u0105 keli\u0105. Dvi planetos intuityviai supranta viena kit\u0105.',
    inPractice: 'Trinai jaučiami be pastang\u0173. Talentai ateina nat\u016Braliai. Rizika yra pasitenkinimas \u2014 kai kažkas lengva, galite to pilnai nei\u0161vystyti. Garso terapijoje trinai palaiko atpalaidavim\u0105 ir srauto b\u016Bsenas.',
    visualColour: '\u017Dalios linijos rate',
  },
  {
    id: 'opposition',
    symbol: '\u260D',
    name: 'Opozicija',
    angle: '180\u00B0',
    title: 'S\u0105moningumas',
    energy: 'Poliarizuojanti, apšviečianti, balansuojanti',
    description: 'Opozicija sujungia planetas, esančias 180\u00B0 atstumu \u2014 \u017Eenkluose, kurie žvelgia vienas \u012F kit\u0105 per zodiak\u0105. Tai sukuria temptirštį. Abi planetos turi pagrįstų poreikių, bet traukia priešingomis kryptimis.',
    inPractice: 'Opozicijos reikalauja pusiausvyros. Negalite rinktis vienos pusės neprarasdami kitos. Garso terapijoje opozicijoms naudingos balansuojančios praktikos \u2014 kairės\u2013dešinės panningmas, papildomi dažniai.',
    visualColour: 'Oranžinės linijos rate',
  },
]

export const learnMinorAspects: LearnMinorAspect[] = [
  {
    name: 'Pusiau-sekstilis',
    angle: '30\u00B0',
    description: 'Subtili, šiek tiek nerangi jungtis tarp gretim\u0173 \u017Eenkl\u0173. Dvi energijos yra tokios skirtingos, kad turi i\u0161mokti sugyventi. Pusiau-sekstiliai sukuria fonin\u0119 \u012Ftamp\u0105, kuri yra lengvai nepastebima, bet l\u0117tai produktyvi.',
  },
  {
    name: 'Kvinkunksas (Inkonjunktas)',
    angle: '150\u00B0',
    description: 'Nepatogus kampas tarp \u017Eenkl\u0173, kurie neturi nieko bendro \u2014 skirtingas elementas, skirtinga modalyb\u0117. Kvinkunksai sukuria varginant\u012F jausm\u0105, kad k\u0105 nors reikia koreguoti.',
  },
  {
    name: 'Pusiau-kvadrat\u016Bra',
    angle: '45\u00B0',
    description: '\u0160velnus dirginimas \u2014 kaip kvadrat\u016Bra, bet mažiau intensyvi. Pusiau-kvadrat\u016Bros sukuria trint\u012F, kuri yra pakankamai subtili, kad b\u016Bt\u0173 ignoruojama, bet pakankamai atkakliai, kad motyvuot\u0173 mažus pokyčius.',
  },
  {
    name: 'Seskvikvardat\u016Bra',
    angle: '135\u00B0',
    description: 'Panaši \u012F pusiau-kvadrat\u016Br\u0105, bet šiek tiek stipresnė. Seskvikvardat\u016Bros sukuria vidinį neramum\u0105, kuris kaupiasi tol, kol yra sprendžiamas.',
  },
]
