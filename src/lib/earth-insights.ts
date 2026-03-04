import type { EarthData } from './earth-data'

type WindLevel = 'low_wind' | 'normal_wind' | 'high_wind'

interface ConditionInsights {
  quiet: Record<WindLevel, string>
  unsettled: Record<WindLevel, string>
  active: { any: string }
  storm: { any: string }
}

const insights: Record<string, ConditionInsights> = {
  en: {
    quiet: {
      low_wind: "The geomagnetic field is calm and solar wind is low. These are stable conditions — research associates low Kp with better sleep quality, steady blood pressure, and improved focus. Ideal conditions for sound healing, as the body's electromagnetic environment is undisturbed.",
      normal_wind: "The geomagnetic field is calm with moderate solar wind. Conditions are stable. No significant electromagnetic interference expected. Good baseline conditions for energy work and therapeutic sessions.",
      high_wind: "The geomagnetic field is currently calm despite elevated solar wind speed. Geomagnetic conditions may shift in the coming hours as the solar wind interacts with Earth's magnetosphere. Worth monitoring if you have sessions planned.",
    },
    unsettled: {
      low_wind: "The geomagnetic field is mildly unsettled (Kp 2-3). Some research suggests sensitive individuals may notice subtle changes in mood, energy levels, or sleep quality during these periods. Grounding techniques and low-frequency sound work can be supportive.",
      normal_wind: "The geomagnetic field is unsettled with moderate solar wind. Studies have shown correlations between unsettled geomagnetic conditions and increased reports of headaches, fatigue, and emotional sensitivity. Allow extra integration time in sessions.",
      high_wind: "The geomagnetic field is unsettled with elevated solar wind. The magnetosphere is under pressure. Sensitive individuals may experience disrupted sleep, heightened anxiety, or physical tension. Prioritise grounding work and lower frequencies (174-285 Hz range).",
    },
    active: {
      any: "The geomagnetic field is active (Kp 4+). A minor geomagnetic storm is in progress. Published research has documented effects on human heart rate variability, blood pressure, and melatonin production during active periods. Clients may present with unusual fatigue or emotional intensity. Adjust session intensity accordingly — grounding and stabilising work is recommended.",
    },
    storm: {
      any: "A significant geomagnetic storm is in progress (Kp 5+). Earth's magnetic field is substantially disturbed. Multiple studies have documented measurable effects on the human autonomic nervous system during storms of this magnitude. Common reports include disrupted sleep, headaches, increased anxiety, and emotional volatility. Keep sessions gentle and grounding. Root chakra frequencies and steady, predictable rhythms are most supportive.",
    },
  },
  lt: {
    quiet: {
      low_wind: "Geomagnetinis laukas ramus ir saulės vėjas žemas. Tai stabilios sąlygos — tyrimai sieja žemą Kp su geresne miego kokybe, stabiliu kraujospūdžiu ir geresniu susikaupmu. Idealios sąlygos garso terapijai, nes kūno elektromagnetinė aplinka netrukdoma.",
      normal_wind: "Geomagnetinis laukas ramus su vidutiniu saulės vėju. Sąlygos stabilios. Nenumatoma reikšmingų elektromagnetinių trikdžių. Geros bazinės sąlygos energetiniam darbui ir terapiniams seansams.",
      high_wind: "Geomagnetinis laukas šiuo metu ramus, nepaisant padidėjusio saulės vėjo greičio. Geomagnetinės sąlygos gali keistis artimiausiomis valandomis. Verta stebėti, jei planuojate seansus.",
    },
    unsettled: {
      low_wind: "Geomagnetinis laukas šiek tiek nerimsta (Kp 2-3). Kai kurie tyrimai rodo, kad jautrūs žmonės gali pastebėti subtilius nuotaikos, energijos lygio ar miego kokybės pokyčius. Įžeminimo technikos ir žemo dažnio garso darbas gali padėti.",
      normal_wind: "Geomagnetinis laukas nerimsta su vidutiniu saulės vėju. Tyrimai parodė koreliacijas tarp neramių geomagnetinių sąlygų ir padidėjusių galvos skausmo, nuovargio bei emocinio jautrumo pranešimų. Skirkite papildomo integracijos laiko seansuose.",
      high_wind: "Geomagnetinis laukas nerimsta su padidėjusiu saulės vėju. Magnetosfera yra po spaudimu. Jautrūs žmonės gali patirti sutrikdytą miegą, padidėjusį nerimą ar fizinę įtampą. Pirmenybę teikite įžeminimo darbui ir žemesniems dažniams (174-285 Hz diapazonas).",
    },
    active: {
      any: "Geomagnetinis laukas aktyvus (Kp 4+). Vyksta nedidelė geomagnetinė audra. Publikuoti tyrimai dokumentavo poveikį žmogaus širdies ritmo kintamumui, kraujospūdžiui ir melatonino gamybai aktyviais periodais. Klientai gali pasireikšti neįprastu nuovargiu ar emociniu intensyvumu. Atitinkamai koreguokite seanso intensyvumą — rekomenduojamas įžeminantis ir stabilizuojantis darbas.",
    },
    storm: {
      any: "Vyksta reikšminga geomagnetinė audra (Kp 5+). Žemės magnetinis laukas yra stipriai sutrikdytas. Keli tyrimai dokumentavo išmatuojamą poveikį žmogaus autonominei nervų sistemai tokio masto audrų metu. Dažni pranešimai: sutrikdytas miegas, galvos skausmai, padidėjęs nerimas ir emocinis nepastovumas. Seansus darykite švelnius ir įžeminančius. Šaknies čakros dažniai ir pastovūs, nuspėjami ritmai yra palankiausi.",
    },
  },
}

export function getEarthInsight(data: EarthData, lang: string): string {
  const langInsights = insights[lang] || insights.en

  if (data.kpIndex >= 5) return langInsights.storm.any
  if (data.kpIndex === 4) return langInsights.active.any

  const level: 'quiet' | 'unsettled' = data.kpIndex <= 1 ? 'quiet' : 'unsettled'
  const wind: WindLevel = data.solarWindSpeed < 350 ? 'low_wind' : data.solarWindSpeed < 500 ? 'normal_wind' : 'high_wind'

  return langInsights[level][wind]
}

export function getBodyMindPractice(data: EarthData, lang: string) {
  const en = {
    body: data.kpIndex <= 2
      ? "Calm conditions. Research shows low geomagnetic activity supports stable blood pressure, restful sleep, and normal heart rate variability."
      : data.kpIndex <= 4
      ? "Mildly disturbed conditions. Some individuals may experience headaches, fatigue, or changes in blood pressure. Stay hydrated."
      : "Storm conditions. Documented effects include disrupted sleep, elevated blood pressure, headaches, and reduced heart rate variability.",
    mind: data.kpIndex <= 2
      ? "Low Kp correlates with better focus, mental clarity, and emotional stability in published studies."
      : data.kpIndex <= 4
      ? "Concentration may be affected. Allow extra time for complex tasks and important decisions."
      : "Cognitive function can be impaired during strong geomagnetic storms. Mental fog and emotional reactivity are commonly reported.",
    practice: data.kpIndex <= 2
      ? "Optimal conditions for sound healing. The body's electromagnetic environment is stable, which supports receptivity to subtle frequency work."
      : data.kpIndex <= 4
      ? "Good for grounding-focused sessions. Lower frequencies (174-285 Hz) and steady rhythms are recommended. Allow extra integration time."
      : "Focus on stabilisation and grounding. Root chakra frequencies, steady tempos, and gentle instruments. Avoid overly intense or lengthy sessions.",
  }

  const lt = {
    body: data.kpIndex <= 2
      ? "Ramios sąlygos. Tyrimai rodo, kad žemas geomagnetinis aktyvumas palaiko stabilų kraujospūdį, poilsinį miegą ir normalų širdies ritmo kintamumą."
      : data.kpIndex <= 4
      ? "Šiek tiek sutrikdytos sąlygos. Kai kurie žmonės gali patirti galvos skausmą, nuovargį ar kraujospūdžio pokyčius. Gerkite pakankamai vandens."
      : "Audros sąlygos. Dokumentuotas poveikis: sutrikdytas miegas, padidėjęs kraujospūdis, galvos skausmai ir sumažėjęs širdies ritmo kintamumas.",
    mind: data.kpIndex <= 2
      ? "Žemas Kp koreliuoja su geresniu susikaupmu, psichine aiškumu ir emociniu stabilumu publikuotuose tyrimuose."
      : data.kpIndex <= 4
      ? "Koncentracija gali būti paveikta. Skirkite papildomo laiko sudėtingoms užduotims ir svarbiems sprendimams."
      : "Pažintinės funkcijos gali būti susilpnėjusios stiprių geomagnetinių audrų metu. Protinis rūkas ir emocinis reaktyvumas dažnai pranešami.",
    practice: data.kpIndex <= 2
      ? "Optimalios sąlygos garso terapijai. Kūno elektromagnetinė aplinka stabili, kas palaiko imlumą subtiliam dažnių darbui."
      : data.kpIndex <= 4
      ? "Tinka į įžeminimą orientuotiems seansams. Rekomenduojami žemesni dažniai (174-285 Hz) ir pastovūs ritmai. Skirkite papildomo integracijos laiko."
      : "Sutelkite dėmesį į stabilizavimą ir įžeminimą. Šaknies čakros dažniai, pastovūs tempai ir švelnūs instrumentai. Venkite pernelyg intensyvių ar ilgų seansų.",
  }

  return lang === 'lt' ? lt : en
}
