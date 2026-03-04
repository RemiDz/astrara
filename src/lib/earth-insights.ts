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
      low_wind: "The geomagnetic field is deeply calm today, and solar winds whisper gently. Your nervous system can rest in its natural rhythm. A beautiful day for deep meditation, subtle energy work, and sound healing — the body is most receptive when Earth is quiet.",
      normal_wind: "The geomagnetic field is calm with moderate solar wind. Conditions are stable and grounding. A good day for focused work and steady, intentional practice.",
      high_wind: "The geomagnetic field is calm despite elevated solar wind. A watchful peace — like the eye of a gentle storm. Stay grounded and hydrated.",
    },
    unsettled: {
      low_wind: "The geomagnetic field is mildly unsettled. You may notice subtle shifts in mood or energy levels. Some people feel slightly restless or emotionally sensitive. Gentle grounding practices can help.",
      normal_wind: "Earth's magnetic field is stirring today. Sensitivity may increase — headaches, vivid dreams, or unexpected emotions are common when the field is unsettled. Move slowly and listen to your body.",
      high_wind: "The field is unsettled with active solar wind pushing against Earth's magnetosphere. You may feel wired or scattered. Prioritise grounding: walk barefoot, use low frequencies, eat warm food.",
    },
    active: {
      any: "The geomagnetic field is active today — a minor storm is stirring Earth's magnetic shield. Many people report disrupted sleep, heightened anxiety, or intense dreams during active periods. This is also a time of accelerated inner growth. Be gentle with yourself.",
    },
    storm: {
      any: "A geomagnetic storm is in progress. Earth's magnetic field is significantly disturbed. Sensitive individuals may experience headaches, fatigue, emotional intensity, or unusual dream states. This is powerful energy — not harmful, but demanding. Rest when you can, drink water, and avoid major decisions if you feel foggy.",
    },
  },
  lt: {
    quiet: {
      low_wind: "Geomagnetinis laukas šiandien yra giliai ramus, o saulės vėjas švelniai šnabžda. Jūsų nervų sistema gali ilsėtis natūraliu ritmu. Puiki diena giliai meditacijai, subtiliam energetiniam darbui ir garso terapijai — kūnas yra imliausia, kai Žemė tyli.",
      normal_wind: "Geomagnetinis laukas ramus su vidutiniu saulės vėju. Sąlygos stabilios ir įžeminančios. Gera diena susikaupusiam darbui ir nuosekliai praktikai.",
      high_wind: "Geomagnetinis laukas ramus, nepaisant padidėjusio saulės vėjo. Budri ramybė — tarsi švelnios audros akis. Likite įsišakniję ir gerkite vandenį.",
    },
    unsettled: {
      low_wind: "Geomagnetinis laukas šiek tiek nerimsta. Galite pastebėti subtilius nuotaikos ar energijos pokyčius. Kai kurie žmonės jaučiasi truputį neramūs ar emociškai jautrūs. Švelnios įžeminimo praktikos gali padėti.",
      normal_wind: "Žemės magnetinis laukas šiandien juda. Jautrumas gali padidėti — galvos skausmai, ryškūs sapnai ar netikėtos emocijos dažnos, kai laukas nerimsta. Judėkite lėtai ir klausykite savo kūno.",
      high_wind: "Laukas nerimsta su aktyviu saulės vėju, stumiančiu Žemės magnetosferą. Galite jaustis įtempti ar išsiblaškę. Pirmenybę teikite įžeminimui: vaikščiokite basomis, naudokite žemus dažnius, valgykite šiltą maistą.",
    },
    active: {
      any: "Geomagnetinis laukas šiandien aktyvus — nedidelė audra drumščia Žemės magnetinį skydą. Daugelis žmonių praneša apie sutrikdytą miegą, padidėjusį nerimą ar intensyvius sapnus aktyviais periodais. Tai taip pat pagreitinto vidinio augimo laikas. Būkite švelnūs su savimi.",
    },
    storm: {
      any: "Vyksta geomagnetinė audra. Žemės magnetinis laukas stipriai sutrikdytas. Jautrūs žmonės gali patirti galvos skausmus, nuovargį, emocinį intensyvumą ar neįprastas sapnų būsenas. Tai galinga energija — ne žalinga, bet reikli. Ilsėkitės, kai galite, gerkite vandenį ir venkite svarbių sprendimų, jei jaučiatės apsiblaususiai.",
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
      ? "Calm geomagnetic conditions support restful sleep and stable blood pressure."
      : data.kpIndex <= 4
      ? "Mild magnetic disturbance may cause headaches or fatigue in sensitive individuals."
      : "Geomagnetic storm conditions can disrupt sleep, increase blood pressure, and cause migraines.",
    mind: data.kpIndex <= 2
      ? "Low Kp index correlates with better focus and mental clarity."
      : data.kpIndex <= 4
      ? "Concentration may waver — allow extra time for important tasks."
      : "Mental fog and emotional intensity are common. Be patient with yourself.",
    practice: data.kpIndex <= 2
      ? "Ideal conditions for sound healing — the body is most receptive when the field is quiet."
      : data.kpIndex <= 4
      ? "Good for grounding practices. Lower frequencies (174–285 Hz) may be especially soothing."
      : "Focus on stabilising and grounding work. Root chakra frequencies. Avoid overly intense sessions.",
  }

  const lt = {
    body: data.kpIndex <= 2
      ? "Ramios geomagnetinės sąlygos palaiko poilsinį miegą ir stabilų kraujospūdį."
      : data.kpIndex <= 4
      ? "Silpnas magnetinis trikdymas gali sukelti galvos skausmą ar nuovargį jautriems žmonėms."
      : "Geomagnetinės audros sąlygos gali sutrikdyti miegą, padidinti kraujospūdį ir sukelti migreną.",
    mind: data.kpIndex <= 2
      ? "Žemas Kp indeksas koreliuoja su geresniu susikaupmu ir psichine aiškumu."
      : data.kpIndex <= 4
      ? "Koncentracija gali svyruoti — skirkite papildomo laiko svarbioms užduotims."
      : "Protinis rūkas ir emocinis intensyvumas yra įprasti. Būkite kantrūs su savimi.",
    practice: data.kpIndex <= 2
      ? "Idealios sąlygos garso terapijai — kūnas yra imliausias, kai laukas ramus."
      : data.kpIndex <= 4
      ? "Tinka įžeminimo praktikoms. Žemesni dažniai (174–285 Hz) gali būti ypač raminantys."
      : "Sutelkite dėmesį į stabilizavimą ir įžeminimą. Šaknies čakros dažniai. Venkite pernelyg intensyvių seansų.",
  }

  return lang === 'lt' ? lt : en
}
