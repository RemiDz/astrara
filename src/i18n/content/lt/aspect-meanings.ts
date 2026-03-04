export interface AspectInsight {
  name: string
  symbol: string
  nature: string
  generalMeaning: string
}

export const aspectMeanings: Record<string, AspectInsight> = {
  conjunction: {
    name: "Konjunkcija",
    symbol: "☌",
    nature: "susiliejimas",
    generalMeaning: "Dvi jėgos susilieja į vieną. Jų energijos šiandien neatsiejamos — sustiprintos, sukoncentruotos, neįmanomos nepastebėti.",
  },
  sextile: { name: "Sekstilis", symbol: "⚹", nature: "galimybė", generalMeaning: "Tylios durys atsiveria tarp dviejų energijų. Nieko dramatiško — tik ramus kvietimas augti. Priimk jį." },
  square: { name: "Kvadratūra", symbol: "□", nature: "įtampa", generalMeaning: "Trintis auga tarp dviejų jėgų. Tai nepatogu, bet produktyvu. Augimas retai ateina iš komforto." },
  trine: { name: "Trigonas", symbol: "△", nature: "harmonija", generalMeaning: "Dvi energijos teka kartu be pastangų. Dovanos ateina be kovos. Pavojus? Priimti šią lengvybę kaip savaime suprantamą." },
  opposition: { name: "Opozicija", symbol: "☍", nature: "poliariškumas", generalMeaning: "Dvi jėgos traukia priešingomis kryptimis. Iššūkis — pusiausvyra: ne vienos pasirinkimas, o abiejų gerbimas." },
}

// Specifinės planetų porų aspektų reikšmės labiausiai paveikioms kombinacijoms
export const planetPairAspects: Record<string, Record<string, string>> = {
  "sun-moon": {
    conjunction: "Tavo vidinis pasaulis ir išorinis aš yra tobulai suderinti. Ką jauti — tą ir rodai. Autentiškumas šiandien ateina savaime.",
    opposition: "Tavo poreikiai ir tapatybė traukia skirtingomis kryptimis. Gerbk tai, ką jauti, net jei tai prieštarauja tavo planams.",
    square: "Vidinė įtampa tarp to, kas esi, ir to, ko tau reikia. Pabūk su šiuo diskomfortu — jis tave kažko svarbaus moko.",
    trine: "Emocinė ramybė lydi visą dieną. Jautiesi kaip namie pats savyje. Kiti jaučia tavo tylų pasitikėjimą.",
    sextile: "Tylu savęs supratimo akimirka. Tavo emocijos ir veiksmai dera mažais, bet prasmingais būdais.",
  },
  "sun-mercury": {
    conjunction: "Protas ir tapatybė susilieja. Tavo žodžiai šiandien turi ypatingą svorį — naudok juos išmintingai.",
    square: "Tavo mintys gali kirsti tavo savivoką. Vidinis dialogas veda į aiškumą, jei leisi jam vykti.",
    trine: "Aiškus mąstymas susitinka su pasitikėjimu savimi. Puiki diena prezentacijoms, rašymui ar svarbiems pokalbiams.",
    sextile: "Idėjos sklandžiai virsta žodžiais. Gera diena planuoti ir dalintis savo vizija.",
  },
  "sun-venus": {
    conjunction: "Meilė ir tapatybė susilieja. Tu spinduliuoji šilumą ir natūraliai trauki grožį.",
    square: "Ko nori ir ką vertini — gali nesutapti. Patikrink: ar sieki malonumo, ar prasmės?",
    trine: "Malonumas ir žavesys ateina be pastangų. Santykiai jaučiasi lengvi. Palepink save — nusipelnei.",
    sextile: "Maži malonumai atneša didelį pasitenkinimą. Parašyk tam, kurį vertini.",
  },
  "sun-mars": {
    conjunction: "Valia įkrauta iki maksimumo. Šiandien gali nuversti kalnus — tik nedegink tiltų pakeliui.",
    opposition: "Tavo ryžtas susiduria su kitų pasipriešinimu. Nukreipk varžymosi energiją į asmeninius rekordus, ne į konfliktus.",
    square: "Nusivylimas uždega veiksmą. Svarbiausia — nukreipti pyktį į kūrimą, ne griovimą.",
    trine: "Energija ir pasitikėjimas gražiai dera. Fizinis aktyvumas teikia malonumą. Veik drąsiai.",
    sextile: "Stabili motyvacija susitinka su aiškiu tikslu. Gera diena imtis užduočių, kurias vis atidėlioji.",
  },
  "sun-jupiter": {
    conjunction: "Optimizmas ir galimybės plečiasi. Galvok plačiau nei įprasta — visata siūlo daugiau, nei tikiesi.",
    opposition: "Perteklius gundo. Dideli planai reikalauja pagrindo. Svajok drąsiai, bet skaičiuok realistiškai.",
    square: "Vienintelis pavojus — per didelis pasitikėjimas savimi. Tavo ambicijos pagrįstos — tik patikrink detales.",
    trine: "Sėkmė ir išmintis dera. Atsiranda galimybės, atitinkančios tavo tikrąjį kelią. Sakyk taip.",
    sextile: "Tyli gausa. Augimas vyksta savaime, kai šiandien seki savo smalsumą.",
  },
  "sun-saturn": {
    conjunction: "Disciplina susitinka su tikslu. Sunkus darbas jaučiasi prasmingas, ne slegiantis. Kurk tai, kas išliks.",
    opposition: "Atsakomybės slegia. Prisimink: pareiga, atlikta su meile, nėra našta — tai palikimas.",
    square: "Kliūtys atrodo asmeninės. Jos nėra — tai kvietimai įrodyti savo atsparumą.",
    trine: "Kantrybė ir ambicijos puikiai dera. Ilgalaikiai planai kristalizuojasi.",
    sextile: "Struktūra palaiko kūrybiškumą. Nustatyk ribas, kurios tave išlaisvina, o ne suvaržo.",
  },
  "venus-mars": {
    conjunction: "Troškimas susitinka su potraukiu. Chemija elektrizuoja. Tiek meilėje, tiek kūryboje — aistra užsidega.",
    opposition: "Potraukis ir ryžtas traukia skirtingomis kryptimis. Ko nori ir kaip to sieki — reikia suderinti.",
    square: "Įtampa tarp troškimo ir veiksmo. Kibirkštis yra — bet ar vaikaisi, ar juntiesi?",
    trine: "Romantika ir aistra teka natūraliai. Kūrybinė energija aukšta. Kurk gražius dalykus.",
    sextile: "Švelnus magnetizmas. Socialiniai susitikimai turi malonų krūvį. Flirtas žaismingas, ne sunkus.",
  },
  "venus-jupiter": {
    conjunction: "Meilė plečiasi be ribų. Dosnumas, grožis ir džiaugsmas stiprėja. Vienintelė rizika — perdėtas mėgavimasis.",
    trine: "Viskas, kas gražu, tampa dar gražiau. Santykiai gilėja lengvai. Perteklius jaučiasi natūraliai.",
    square: "Per daug gero dalyko. Per daug išleidžiama, per daug mėgaujamasi, per daug žadama. Mėgaukis, bet nustatyk ribą.",
    sextile: "Socialinė malonė susitinka su sėkme. Maloni staigmena meilėje ar finansuose yra galima.",
  },
  "venus-saturn": {
    conjunction: "Meilė rimtėja. Įsipareigojimai gilėja. Kas nėra tikra — atkrenta, ir tai yra dovana.",
    opposition: "Šaltumas santykiuose gali pasireikšti. Tai ne meilės stoka — tai kvietimas didesniam atvirumui.",
    square: "Meilė jaučiasi suvaržyta ar išbandoma. Santykiai, kurie tai atlaikys, yra verti išsaugojimo.",
    trine: "Ištikimybė ir atsidavimas atneša tylų džiaugsmą. Ilgalaikiai ryšiai stiprėja. Grožis šiandien turi substanciją.",
    sextile: "Praktiška meilė. Maži įsipareigojimo gestai svarbiau nei dideli žodžiai.",
  },
  "venus-pluto": {
    conjunction: "Transformuojantis susitikimas galimas. Kažkas — ar kažkas — pakeičia tavo širdį visam laikui.",
    opposition: "Galios dinamika iškyla santykiuose. Kontrolė nėra meilė. Paleisk savo gniaužtus, kad rastum tikrą ryšį.",
    square: "Gilios emocijos iškyla santykiuose. Pavydas ar intensyvumas gali pasireikšti — leisk jausmams tekėti, neversdamas sprendimo.",
    trine: "Meilė gilėja be pastangų. Pažeidžiamumas tampa stiprybe. Transformacija jaučiasi kaip grįžimas namo.",
    sextile: "Emocinis atvirumas atveria duris. Pokalbis nueina giliau nei tikėtasi — ir tai yra gerai.",
  },
  "mars-jupiter": {
    conjunction: "Energija ir optimizmas susijungia. Jautiesi nesustabdomu — ir šiandien galbūt toks ir esi.",
    opposition: "Entuziazmas lenkia nuovoką. Sulėtink tik tiek, kad nutaikytum prieš šaudamas.",
    square: "Nekantrus susitinka su pernelyg dideliu pasitikėjimu. Tikslas tikras — tik laiką reikia pakoreguoti.",
    trine: "Veiksmas ir sėkmė dera. Rizikuok tuo, ką seniai svarstai. Fortūna šypsosi drąsiems.",
    sextile: "Produktyvus optimizmas. Energija teka link prasmingų tikslų su minimaliomis nuostoliais.",
  },
  "mars-saturn": {
    conjunction: "Valdoma galia. Kaip kovos menų meistras — kiekvienas judesys tikslus, tikslingas, nepralenkiamas.",
    opposition: "Veiksmas susiduria su nepajudinamomis kliūtimis. Nespausk. Nukreipk energiją ten, kur durys atviros.",
    square: "Nusivylimas auga, kai veiksmas atsitrenkia į pasipriešinimą. Kantrybė šiandien yra tavo supergalia.",
    trine: "Disciplinuotas veiksmas pasiekia ilgalaikių rezultatų. Ištvermė ir strategija dirba kartu.",
    sextile: "Stabili pažanga. Ne jaudinanti, bet giliai patenkinama. Plyta po plytos siena kyla.",
  },
  "mars-pluto": {
    conjunction: "Neapdorota transformacinė galia. Nukreipk ją atsargiai — ji gali kurti imperijas arba deginti jas.",
    opposition: "Galios kovos suintensyvėja. Rinkis savo mūšius. Ne kiekviena kalva verta aukos.",
    square: "Intensyvumas reikalauja išeities. Be jos ši energija tampa griaunančia. Sportuok, kurk, transformuok.",
    trine: "Gilūs jėgos atsargos iškyla. Esi galingesnis, nei žinai. Naudok tai išmintingai.",
    sextile: "Tyli intensyvumas maitina tikslingą veiksmą. Tyrinėjimas, gilinimasis ir koncentruotas darbas klesti.",
  },
  "jupiter-saturn": {
    conjunction: "Plėtra susitinka su struktūra. Svajonės gauna brėžinius. Čia oro pilys randa pamatus.",
    opposition: "Augimas ir apribojimai traukia į skirtingas puses. Subalansuok ambicijas su realybe. Abi pusės turi išminties.",
    square: "Optimizmas kertasi su pragmatizmu. Nė vienas neklysta — rask vidurio kelią.",
    trine: "Išmintingas augimas. Plėtra, kuri yra tvari. Planai, kurie yra ir ambicingi, ir pasiekiami.",
    sextile: "Praktiška išmintis veda sprendimus. Mentorius ar vyresnysis gali pasiūlyti vertingą perspektyvą.",
  },
  "saturn-pluto": {
    conjunction: "Gili struktūrinė transformacija. Senos sistemos griūna, kad galėtų atsirasti naujos. Tai sunku, bet būtina.",
    opposition: "Galios struktūros susiduria su atsiskaitymu. Kas pastatyta ant tiesos — išgyvena. Kas ne — ne.",
    square: "Intensyvus spaudimas transformuotis. Spaudimas nepatogus, bet deimantas to vertas.",
    trine: "Gili, ilgalaikė transformacija vyksta sklandžiai. Sunkus pokyčių darbas jaučiasi prasmingas.",
    sextile: "Subtilūs, bet gilūs galios dinamikos pokyčiai. Evoliucija, o ne revoliucija.",
  },
}
