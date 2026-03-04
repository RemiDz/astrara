export interface PhaseInsight {
  meaning: string
  guidance: string
}

export const phaseMeanings: Record<string, PhaseInsight> = {
  "new-moon": {
    meaning: "Dangus tamsus, o lapas tuščias. Jaunatis — tai sėkla, pasodinta nematomybėje, tyliai ištartas ketinimas, dar neradęs savo formos. Tai kosminis iškvėpimas prieš įkvėpimą, derlingas tuštumas, kuriame gyvena visos pradžios.",
    guidance: "Kelk ketinimus, ne tikslus. Užrašyk, ką nori pakviesti į savo gyvenimą, ir paleisk prisirišimą prie to, kaip tai ateis. Pradėk tyliai. Sodink sėklas tamsoje ir pasitikėk, kad jos žino, kaip augti.",
  },
  "waxing-crescent": {
    meaning: "Pirmasis šviesos brūkšnelis pasirodo — trapus, kupinas vilties, ryžtingas. Augantis pjautuvas — tai akimirka, kai tavo ketinimas susitinka su tikruoju pasauliu. Abejonė gali šnabždėti, bet šviesa jau auga. Kažkas prasidėjo ir to nebegalima atšaukti.",
    guidance: "Žengk pirmą konkretų žingsnį. Rink išteklius, sudaryk planą, papasakok žmogui, kuriuo pasitiki. Tai ne laikas didiems veiksmams — tai laikas tyliam, pasiryžusiam judėjimui pirmyn. Eik toliau, net jei dar nematai viso kelio.",
  },
  "first-quarter": {
    meaning: "Pusė Mėnulio apšviesta, pusė — šešėlyje, o tu stovi kryžkelėje. Pirmasis ketvirtis — tai veiksmo krizė. Kliūtys atsiranda ne tam, kad tave sustabdytų, o kad patikrintų tavo pasiryžimą. Lengvas kelias ir teisingas kelias čia išsiskiria.",
    guidance: "Priimk sprendimus. Veržkis per pasipriešinimą. Iššūkiai, su kuriais dabar susiduriama, nėra ženklai pasitraukti — tai visatos klausimas, kiek stipriai to nori. Koreguok savo būdą, jei reikia, bet neatsisaky savo ketinimo.",
  },
  "waxing-gibbous": {
    meaning: "Šviesa tvinksi link pilnumo. Augantis kupranugaris — tai tobulinimo fazė, skulptoriaus rūpestinga ranka, šalinanti tai, kas nepriklauso. Tu beveik matai galutinę formą to, ką kūrei. Kantrybė ir tikslumas dabar svarbiausia.",
    guidance: "Tobulink, koreguok ir šlifuok. Peržvelk savo pažangą sąžiningomis akimis. Ką reikia pakoreguoti? Ką reikia paleisti? Tai ne laikas pradėti iš naujo — tai laikas nušlifuoti tai, kas jau juda. Pasitikėk savo procesu.",
  },
  "full-moon": {
    meaning: "Mėnulis šviečia visa savo šlove — viskas apšviesta, niekas negali pasislėpti. Pilnatis — tai apreiškimas, kulminacija ir derlius. Tai, ką sodinai per jaunatį, dabar parodo savo veidą. Emocijos stiprios, nes tiesa gili.",
    guidance: "Švęsk tai, kas subrandinta. Pripažink savo augimą. Bet taip pat būk atviras tam, ką atskleidžia šviesa — jei kažkas neveikia, pilnatis tai aiškiai parodys. Paleisk tai, kas nebetarnauja tavo aukščiausiam keliui.",
  },
  "waning-gibbous": {
    meaning: "Šviesa pradeda grakštų atsitraukimą. Blėstantis kupranugaris — tai mokytojo fazė. Tu išmokai kažką vertingo, ir dabar laikas tuo dalintis. Išmintis kristalizuojasi per dalijimosi aktą.",
    guidance: "Dalinkis tuo, ką išmokai. Mokyk, rašyk arba tiesiog vesk prasmingus pokalbius. Dėkingumas dabar yra tavo supergalia. Apmąstyk, kas pavyko, ir dosniai dalinkis savo įžvalgomis. Visata apdovanoja tuos, kurie perduoda deglą.",
  },
  "last-quarter": {
    meaning: "Vėl pusė šviesos, pusė šešėlio — bet šįkart žvelgi kita kryptimi. Paskutinis ketvirtis — tai prasmės krizė. Senos struktūros, kurios nebetarnauja, tampa nebeįmanomos ignoruoti. Kažką reikia paleisti, kol gali prasidėti naujas ciklas.",
    guidance: "Paleisk su malone. Atleisk, išsivalyk, užbaik tai, kas atgyveno. Tai ne nesėkmė — tai kompostavimas. Kiekviena pabaiga maitina naują pradžią. Padaryk vietos savo gyvenime, prote ir širdyje tam, kas ateina.",
  },
  "waning-crescent": {
    meaning: "Paskutinis plonas pjautuvas blėsta į artėjančią tamsą. Blėstantis pjautuvas — Balzaminė Mėnulio fazė — yra pati mistiškiausia. Šydas tarp pasaulių plonėja. Sapnai kalba garsiau. Siela ruošiasi atsinaujinimui per gilų, šventą poilsį.",
    guidance: "Ilsėkis. Tikrai ilsėkis. Tai ne tingumas — tai esminė pasiruošimas. Medituok, sapnuok, rašyk dienoraštį arba tiesiog būk ramybėje. Atsisakyk kontrolės ir pasitikėk tamsa. Naujas ciklas jau formuojasi tyloje. Tau nereikia nieko daryti — tiesiog būk.",
  },
}
