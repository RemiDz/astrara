export interface SignInsight {
  whatItFeelsLike: string
  keywords: string[]
}

export const signMeanings: Record<string, SignInsight> = {
  aries: {
    whatItFeelsLike: "Avino energija jaučiasi kaip pirmoji šilta pavasario diena — staigus, neginčijamas noras judėti, pradėti, tapti. Tai kibirkštis prieš ugnį, kvėpavimas prieš šūksnį. Viskas atrodo įmanoma, o laukimas — neįmanomas.",
    keywords: ["drąsa", "iniciatyva", "nepriklausomybė", "tiesumas"],
  },
  taurus: {
    whatItFeelsLike: "Jaučio energija jaučiasi kaip basos pėdos ant šiltos žemės — lėta, apgalvota, giliai juslinė. Tai pasitenkinimas valgio, paruošto su meile, ramybė sodo, kuris pilnai žydi. Nereikia niekur skubėti, kai viskas jau taip gerai skanauja.",
    keywords: ["stabilumas", "kantrybė", "juslumas", "ryžtingumas"],
  },
  gemini: {
    whatItFeelsLike: "Dvynių energija jaučiasi kaip pokalbis, kuris vis šakojasi į dar įdomesnius pokalbius — elektrizuojantis, smalsus, nesibaigiančiai gyvas. Tai naujos idėjos jaudulys, džiaugsmas sujungti taškus, kurių niekas kitas nemato. Protas šoka, o pasaulis vos spėja iš paskos.",
    keywords: ["smalsumas", "prisitaikymas", "bendravimas", "sąmojis"],
  },
  cancer: {
    whatItFeelsLike: "Vėžio energija jaučiasi kaip grįžimas namo po ilgos kelionės — spynos spragtelėjimas, pažįstamas kvapas, atodūsis, apie kurį nė nežinojai. Tai nuožmi švelnybė to, kuris myli giliai ir saugo tai, kas svarbu, tylia, nepajudinama jėga.",
    keywords: ["rūpestingumas", "intuicija", "apsauga", "emocinis gilumas"],
  },
  leo: {
    whatItFeelsLike: "Liūto energija jaučiasi kaip įžengimas į saulės spindulį, kuris laukė būtent tavęs — šiltas, auksinis, be jokio atsiprašymo spinduliuojantis. Tai drąsa būti matomu būtent tokiu, koks esi, dosnumas širdies, kurioje pakanka šviesos visiems aplink.",
    keywords: ["kūrybiškumas", "pasitikėjimas", "dosnumas", "lyderystė"],
  },
  virgo: {
    whatItFeelsLike: "Mergelės energija jaučiasi kaip tylus pasitenkinimas tobulai sutvarkyta erdve — kiekviena detalė pastebėta, kiekvienas siūlas savo vietoje. Tai gydytojo rankos, redaktoriaus akis, atsidavimas žmogaus, kuris meilę parodo per apgalvotą, rūpestingą tarnystę.",
    keywords: ["tikslumas", "tarnystė", "analizė", "atsidavimas"],
  },
  libra: {
    whatItFeelsLike: "Svarstyklių energija jaučiasi kaip akimirka, kai erdvė pasiekia tobulą pusiausvyrą — graži muzika, švelni šviesa, du žmonės, kurie vienas kitą tobulai supranta. Tai menininko akis harmonijai, diplomato gebėjimas, kad taika atrodytų lengva ir elegantiška.",
    keywords: ["harmonija", "partnerystė", "grožis", "teisingumas"],
  },
  scorpio: {
    whatItFeelsLike: "Skorpiono energija jaučiasi kaip nėrimas į gilų vandenį naktyje — bauginanti, jaudinanti, ir kažkaip būtent ten, kur turi būti. Tai drąsa žvelgti į tai, nuo ko kiti nusisuka, galia, kuri ateina iš atsisakymo gyventi paviršiuje.",
    keywords: ["intensyvumas", "transformacija", "gilumas", "atsparumas"],
  },
  sagittarius: {
    whatItFeelsLike: "Šaulio energija jaučiasi kaip stovėjimas kalno viršūnėje, kai visas pasaulis nusidriekia apačioje — beribis, laisvas, ištroškęs prasmės. Tai filosofo ugnis, keliautojo neramios pėdos, nesuardomas tikėjimas, kad kitame horizonte slypi kažkas nepaprastai.",
    keywords: ["tyrinėjimas", "optimizmas", "išmintis", "laisvė"],
  },
  capricorn: {
    whatItFeelsLike: "Ožiaragio energija jaučiasi kaip tylus pasididžiavimas katedra, statyta akmuo po akmens šimtmečius — kantri, ambicinga, ilgaamžė. Tai tvirta ranka, žaidžianti ilgą žaidimą, gilus žinojimas, kad tai, kas statoma su disciplina ir sąžiningumu, pergyvens viską.",
    keywords: ["ambicija", "disciplina", "atsakomybė", "meistriškumas"],
  },
  aquarius: {
    whatItFeelsLike: "Vandenis energija jaučiasi kaip signalas iš ateities — keistas, genialus, šiek tiek priekyje savo laiko. Tai išradėjo įžvalgos blyksnis, maištininko atsisakymas priimti pasaulį tokį, koks jis yra. Ryšys svarbus giliai, bet niekada autentiškumo kaina.",
    keywords: ["naujovės", "nepriklausomybė", "žmoniškumas", "vizija"],
  },
  pisces: {
    whatItFeelsLike: "Žuvų energija jaučiasi kaip muzika, girdima sapne — persmelkiančiai graži, neįmanoma sulaikyti, bet neįmanoma pamiršti. Tai mistiko žinojimas, menininko atsidavimas, begalinis užuojautos vandenynas sieloje, kuri jaučia visą jūrą viename vandens laše.",
    keywords: ["vaizduotė", "užuojauta", "intuicija", "transcendencija"],
  },
}
