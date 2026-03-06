import type { ZodiacSign } from '../../types'

export interface SunInSignReading {
  general: { en: string; lt: string }
  themeKeywords: { en: string[]; lt: string[] }
  personalByHouse: Record<number, { en: string; lt: string }>
}

export const SUN_IN_SIGN: Record<ZodiacSign, SunInSignReading> = {
  aries: {
    general: {
      en: 'The Sun in Aries marks the beginning of the astrological year — a burst of cardinal fire that calls everyone to act boldly. Vitality is high, patience is low, and the collective energy favours pioneering spirit over careful planning. This is a season to start things, to lead, and to rediscover what makes you feel alive.',
      lt: 'Saulė Avine žymi astrologinių metų pradžią — kardinalinės ugnies protrūkis, kviečiantis visus veikti drąsiai. Gyvybingumas aukštas, kantrybė žema, o kolektyvinė energija palankiai vertina pionierišką dvasią, o ne atsargų planavimą. Tai sezonas pradėti dalykus, vadovauti ir iš naujo atrasti, kas verčia jus jaustis gyvais.',
    },
    themeKeywords: {
      en: ['initiative', 'courage', 'new beginnings', 'vitality'],
      lt: ['iniciatyva', 'drąsa', 'naujos pradžios', 'gyvybingumas'],
    },
    personalByHouse: {
      1: {
        en: 'The Aries Sun energises your sense of self with pioneering spirit. You feel ready to reinvent yourself, take initiative, and express your identity with bold clarity. This is your season to lead.',
        lt: 'Avino Saulė energizuoja jūsų savęs pojūtį pionierišku dvasiu. Jaučiatės pasiruošę persikurti, imtis iniciatyvos ir reikšti savo tapatybę su drąsiu aiškumu. Tai jūsų sezonas vadovauti.',
      },
      2: {
        en: 'Your earning potential and sense of personal value receive a burst of cardinal fire. Take courageous action around finances — ask for the raise, launch the venture, or assert your worth with confidence.',
        lt: 'Jūsų uždarbio potencialas ir asmeninės vertės pojūtis gauna kardinalinės ugnies protrūkį. Imkitės drąsių veiksmų finansų srityje — prašykite pakelti atlyginimą, pradėkite verslą ar tvirtinkite savo vertę su pasitikėjimu.',
      },
      3: {
        en: 'Your voice carries assertive, pioneering energy. Speaking up, writing boldly, or initiating important conversations comes naturally. Siblings and neighbours may play a more prominent role in your life now.',
        lt: 'Jūsų balsas neša atkaklią, pionieriška energiją. Atvirai kalbėti, drąsiai rašyti ar inicijuoti svarbius pokalbius ateina natūraliai. Broliai, seserys ir kaimynai gali atlikti svarbesnį vaidmenį jūsų gyvenime dabar.',
      },
      4: {
        en: 'Dynamic energy stirs your domestic sphere. You may feel driven to make dramatic changes to your living situation, address family tensions directly, or bring fresh vitality into your private world.',
        lt: 'Dinaminė energija sujudina jūsų namų sferą. Galite jaustis skatinami daryti dramatiškus pokyčius gyvenimo sąlygose, tiesiogiai spręsti šeimos įtampas ar atnešti šviežio gyvybingumo į savo privatų pasaulį.',
      },
      5: {
        en: 'Creative courage surges through you. This is an extraordinary time for starting artistic projects, pursuing romance with boldness, or rediscovering the joy of play and spontaneous self-expression.',
        lt: 'Kūrybinė drąsa tvinsta per jus. Tai ypatingas laikas pradėti meninius projektus, drąsiai siekti romantikos ar iš naujo atrasti žaidimo ir spontaniškos saviraiškos džiaugsmą.',
      },
      6: {
        en: 'Your daily routines benefit from more vigour and decisiveness. Start the fitness programme, overhaul your diet, or take charge of a health concern you have been neglecting. Your body responds well to action now.',
        lt: 'Jūsų kasdienės rutinos gauna naudos iš daugiau energijos ir ryžtingumo. Pradėkite sporto programą, peržiūrėkite savo dietą ar imkitės sveikatos problemos, kurią apleidote. Jūsų kūnas dabar gerai reaguoja į veiksmą.',
      },
      7: {
        en: 'Partnerships require honest assertion of your needs. The balance between independence and togetherness is highlighted — speak your truth to partners while remaining open to their perspective.',
        lt: 'Partnerystės reikalauja sąžiningo savo poreikių išreiškimo. Pusiausvyra tarp nepriklausomybės ir buvimo kartu yra paryškinta — kalbėkite savo tiesą partneriams, bet likite atviri jų perspektyvai.',
      },
      8: {
        en: 'Deep change accelerates with courage and directness. Face the difficult truths, confront what needs to end, and trust that letting go of the old creates space for powerful renewal.',
        lt: 'Gilūs pokyčiai paspartėja su drąsa ir tiesumu. Susidurkite su sunkiomis tiesomis, susidorokite su tuo, kam reikia pabaigos, ir pasitikėkite, kad senojo paleidimas sukuria erdvę galingam atsinaujinimui.',
      },
      9: {
        en: 'Your hunger for adventure and new horizons is ignited. Travel, higher education, philosophical exploration, or simply broadening your worldview through new experiences feeds your soul deeply.',
        lt: 'Jūsų nuotykių ir naujų horizontų alkis yra uždegtas. Kelionės, aukštasis mokslas, filosofinis tyrinėjimas ar tiesiog horizonto plėtimas per naujas patirtis giliai maitina jūsų sielą.',
      },
      10: {
        en: 'Professional ambition and initiative are powerfully activated. This is a time to start new projects, assert your leadership, and take bold risks in your career. Fortune favours the brave now.',
        lt: 'Profesinė ambicija ir iniciatyva yra galingai aktyvuotos. Tai laikas pradėti naujus projektus, tvirtinti savo lyderystę ir drąsiai rizikuoti karjeroje. Šiuo metu likimas palankus drąsiesiems.',
      },
      11: {
        en: 'Your social vision becomes more assertive and action-oriented. Lead group projects, champion causes that matter, or energise your community with your enthusiasm and willingness to go first.',
        lt: 'Jūsų socialinė vizija tampa atkaklesnė ir orientuota į veiksmą. Vadovaukite grupiniams projektams, remkite svarbias bylas ar energizuokite savo bendruomenę savo entuziazmu ir pasiryžimu eiti pirmiems.',
      },
      12: {
        en: 'The fire of conscious will illuminates your inner world. Active spiritual practices — breathwork, dynamic meditation, or confronting subconscious fears — bring more results than passive contemplation.',
        lt: 'Sąmoningos valios ugnis nušviečia jūsų vidinį pasaulį. Aktyvios dvasinės praktikos — kvėpavimo pratimai, dinaminė meditacija ar pasąmoninių baimių įveikimas — duoda daugiau rezultatų nei pasyvus apmąstymas.',
      },
    },
  },
  taurus: {
    general: {
      en: 'The Sun in Taurus slows the pace and grounds the collective energy in what is tangible and enduring. This is a season for building, savouring, and tending to what matters most. Values come into focus — financial, personal, and relational. Steady effort yields lasting results now.',
      lt: 'Saulė Jautyje sulėtina tempą ir įžemina kolektyvinę energiją tame, kas apčiuopiama ir tvaru. Tai sezonas statybai, mėgavimuisi ir rūpinimuisi tuo, kas svarbiausia. Vertybės atsiduria dėmesio centre — finansinės, asmeninės ir santykių. Nuoseklios pastangos dabar duoda ilgalaikius rezultatus.',
    },
    themeKeywords: {
      en: ['stability', 'sensuality', 'values', 'persistence'],
      lt: ['stabilumas', 'juslumas', 'vertybės', 'atkaklumas'],
    },
    personalByHouse: {
      1: {
        en: 'The Taurus Sun steadies your identity and grounds you in your body. This season asks you to slow down, appreciate the beauty of your life as it is, and build on what feels genuinely solid.',
        lt: 'Jaučio Saulė stabilizuoja jūsų tapatybę ir įžemina jus kūne. Šis sezonas prašo sulėtinti, vertinti savo gyvenimo grožį tokį, koks jis yra, ir kurti ant to, kas jaučiasi tikrai tvirta.',
      },
      2: {
        en: 'Financial matters take centre stage with practical determination. This is your season to build material security, invest wisely, and develop a deeper relationship with your own values and self-worth.',
        lt: 'Finansiniai reikalai užima pagrindinę sceną su praktiška ryžtimi. Tai jūsų sezonas kurti materialinį saugumą, protingai investuoti ir gilinti santykį su savo vertybėmis ir saviverte.',
      },
      3: {
        en: 'Your communication style becomes more deliberate and substantial. People value your words because they carry weight and sincerity. This is a good time for important conversations that require patience and honesty.',
        lt: 'Jūsų bendravimo stilius tampa labiau apgalvotas ir turinys. Žmonės vertina jūsų žodžius, nes jie turi svorį ir nuoširdumą. Tai geras metas svarbiems pokalbiams, reikalaujantiems kantrybės ir sąžiningumo.',
      },
      4: {
        en: 'Creating a beautiful, comfortable home environment becomes a priority. Invest in quality over quantity — a well-made piece of furniture, a thriving garden, or a kitchen that nourishes body and soul.',
        lt: 'Gražios, patogios namų aplinkos kūrimas tampa prioritetu. Investuokite į kokybę, o ne kiekybę — gerai pagamintas baldas, klestintis sodas ar virtuvė, maitinanti kūną ir sielą.',
      },
      5: {
        en: 'Sensual, tactile creative expression flourishes. Work with materials you can touch — clay, fabric, wood, food. Romantic connections deepen through shared physical experiences and unhurried pleasure.',
        lt: 'Juslinė, taktilinė kūrybinė raiška klesti. Dirbkite su medžiagomis, kurias galite paliesti — moliu, audiniu, medžiu, maistu. Romantiški ryšiai gilėja per bendras fizines patirtis ir neskubantį malonumą.',
      },
      6: {
        en: 'Sustainable health practices take root during this season. Focus on nourishment rather than restriction, pleasure rather than punishment. Your body thrives on consistency, quality food, and adequate rest.',
        lt: 'Tvarios sveikatos praktikos šiame sezone įsišaknija. Dėmesys maitinimui, o ne apribojimams, malonumui, o ne baudimui. Jūsų kūnas klesti su nuoseklumu, kokybiška maistu ir pakankamu poilsiu.',
      },
      7: {
        en: 'Stability and loyalty become the foundation of your partnerships. This is a time for building lasting commitment rather than chasing excitement. Show your love through consistent, reliable presence.',
        lt: 'Stabilumas ir lojalumas tampa jūsų partnerysčių pagrindu. Tai laikas kurti ilgalaikį įsipareigojimą, o ne vaikytis jaudulį. Parodykite savo meilę per nuoseklų, patikimą buvimą šalia.',
      },
      8: {
        en: 'Deep change moves at a slower, more grounded pace. Rather than sudden upheaval, transformation comes through steady, patient work with your deeper patterns. Trust the process without rushing.',
        lt: 'Gilūs pokyčiai juda lėtesniu, labiau įžemintu tempu. Užuot staigaus perversmo, transformacija ateina per nuoseklų, kantrų darbą su savo gilesniais modeliais. Pasitikėkite procesu, neskubindami.',
      },
      9: {
        en: 'Your search for meaning favours direct experience over abstract theory. Travel to beautiful places, study traditions rooted in nature and the body, or explore philosophies that honour the material world.',
        lt: 'Jūsų prasmės paieška teikia pirmenybę tiesioginei patirčiai prieš abstrakčią teoriją. Kelionės į gražias vietas, tradicijų, įsišaknijusių gamtoje ir kūne, studijavimas ar filosofijų, gerbiantis materialų pasaulį, tyrinėjimas.',
      },
      10: {
        en: 'Professional success comes through steady, quality work rather than flashy moves. Build your reputation on reliability and excellence. The efforts you make now compound into lasting achievement.',
        lt: 'Profesinė sėkmė ateina per nuoseklų, kokybišką darbą, o ne per efektingus žingsnius. Kurkite savo reputaciją ant patikimumo ir puikumo. Pastangos, kurias dėsite dabar, kaupiasi į ilgalaikius pasiekimus.',
      },
      11: {
        en: 'You contribute most to your communities through practical, tangible support. Rather than grand plans, offer your time, skills, and resources to create something real and lasting for the groups you value.',
        lt: 'Labiausiai prisidedate prie savo bendruomenių per praktinę, apčiuopiamą paramą. Užuot didelių planų, pasiūlykite savo laiką, įgūdžius ir išteklius sukurti kažką tikra ir ilgalaikio grupėms, kurias vertinate.',
      },
      12: {
        en: 'Earth-based spirituality nourishes your inner life. Spending time in nature, practising body-awareness meditation, or engaging with the sacred through sensory experience brings genuine transcendence.',
        lt: 'Žemiškas dvasingumas maitina jūsų vidinį gyvenimą. Laikas gamtoje, kūno sąmoningumo meditacija ar bendravimas su šventenybe per juslinę patirtį atneša tikrą transcendenciją.',
      },
    },
  },
  gemini: {
    general: {
      en: 'The Sun in Gemini fills the atmosphere with curiosity, conversation, and mental agility. Ideas circulate rapidly, social connections multiply, and there is a collective hunger for variety and stimulation. This is a season for learning, writing, and exploring multiple perspectives without needing to settle on one.',
      lt: 'Saulė Dvyniuose užpildo atmosferą smalsumu, pokalbiais ir protiniu vikrumu. Idėjos cirkuliuoja sparčiai, socialiniai ryšiai dauginasi, ir yra kolektyvinis alkis įvairovei ir stimuliacijai. Tai sezonas mokymuisi, rašymui ir daugelio perspektyvų tyrinėjimui, nesirenkant vienos.',
    },
    themeKeywords: {
      en: ['curiosity', 'communication', 'versatility', 'learning'],
      lt: ['smalsumas', 'bendravimas', 'universalumas', 'mokymasis'],
    },
    personalByHouse: {
      1: {
        en: 'The Gemini Sun multiplies your interests and social energy. Your identity feels versatile and curious — embrace the many facets of who you are without needing to choose just one.',
        lt: 'Dvynių Saulė padaugina jūsų interesus ir socialinę energiją. Jūsų tapatybė jaučiasi universali ir smalsi — priimkite daugelį savo pusių, nesirinkdami tik vienos.',
      },
      2: {
        en: 'Multiple income streams or creative financial thinking are favoured. Your ability to see opportunities others miss can translate into practical value. Diversify your approach to earning and spending.',
        lt: 'Keli pajamų šaltiniai ar kūrybiškas finansinis mąstymas yra palankūs. Jūsų gebėjimas pastebėti galimybes, kurių kiti pasigenda, gali virsti praktine verte. Diversifikuokite savo požiūrį į uždarbį ir leidimą.',
      },
      3: {
        en: 'This is your season for words, ideas, and connection. Writing, speaking, teaching, and all forms of communication are powerfully activated. Your message reaches further than usual — use this influence wisely.',
        lt: 'Tai jūsų sezonas žodžiams, idėjoms ir ryšiui. Rašymas, kalbėjimas, mokymas ir visos bendravimo formos yra galingai aktyvuotos. Jūsų žinia pasiekia toliau nei įprastai — naudokite šią įtaką išmintingai.',
      },
      4: {
        en: 'Your home becomes a hub of activity and conversation. Family communications, neighbourhood connections, and creating a stimulating domestic environment keep you engaged and emotionally satisfied.',
        lt: 'Jūsų namai tampa veiklos ir pokalbių centru. Šeimos komunikacija, kaimynystės ryšiai ir stimuliuojančios namų aplinkos kūrimas jus užima ir emociškai tenkina.',
      },
      5: {
        en: 'Playful intellectual creativity abounds. Writing, wordplay, collaborative projects, and art that tells a story thrive. Romance benefits from wit, conversation, and the willingness to keep things light and interesting.',
        lt: 'Žaisminga intelektualinė kūryba gausiai liejasi. Rašymas, žodžių žaismai, bendri projektai ir menas, pasakojantis istoriją, klesti. Romantika gauna naudos iš sąmojo, pokalbio ir noro palaikyti dalykus lengvus ir įdomius.',
      },
      6: {
        en: 'Variety in your daily routines prevents boredom and keeps you healthy. Change your workout, try new foods, or rearrange your work schedule. Mental stimulation is as important as physical activity for your wellbeing.',
        lt: 'Įvairovė kasdienėse rutinose apsaugo nuo nuobodulio ir palaiko sveikatą. Pakeiskite savo treniruotę, bandykite naujus maistus ar pertvarkykite savo darbo grafiką. Protinė stimuliacija yra taip pat svarbi kaip fizinė veikla jūsų gerovei.',
      },
      7: {
        en: 'Communication is the lifeblood of your partnerships this season. Talk more, listen more, and stay curious about your partner\'s inner world. The best relationships are ongoing conversations.',
        lt: 'Bendravimas yra jūsų partnerysčių gyvybės šaltinis šį sezoną. Kalbėkite daugiau, klausykite daugiau ir likite smalsūs dėl savo partnerio vidinio pasaulio. Geriausi santykiai yra besitęsiantys pokalbiai.',
      },
      8: {
        en: 'Deep change comes through understanding and articulation. Name what you feel, write about your shadows, and talk through your transformation with a trusted person. Words have healing power now.',
        lt: 'Gilūs pokyčiai ateina per supratimą ir artikuliavimą. Įvardinkite, ką jaučiate, rašykite apie savo šešėlius ir aptarkite savo transformaciją su patikimu žmogumi. Žodžiai dabar turi gydančią galią.',
      },
      9: {
        en: 'Your mind is insatiable — every subject leads to three more. Allow yourself to follow intellectual threads without guilt. Cross-pollination between different fields of knowledge produces your most original insights.',
        lt: 'Jūsų protas nepasotinamas — kiekviena tema veda prie trijų kitų. Leiskite sau sekti intelektualines gijas be kaltės. Kryžminis apvaisinimas tarp skirtingų žinių laukų sukuria jūsų originaliausias įžvalgas.',
      },
      10: {
        en: 'Versatility and communication skills advance your professional standing. Present, network, write, and share your ideas. Being known as someone who connects dots and communicates clearly is a powerful career asset.',
        lt: 'Universalumas ir bendravimo įgūdžiai skatina jūsų profesinę poziciją. Pristatykite, kurkite ryšius, rašykite ir dalinkitės savo idėjomis. Būti žinomam kaip žmogui, kuris jungia taškus ir aiškiai bendrauja, yra galinga karjeros privalumas.',
      },
      11: {
        en: 'Social connections proliferate and energise your sense of purpose. You are the network builder — introduce people to each other, share information generously, and let your social intelligence serve the collective.',
        lt: 'Socialiniai ryšiai dauginasi ir energizuoja jūsų tikslo pojūtį. Jūs esate tinklo kūrėjas — supažindinkite žmones vienus su kitais, dosniai dalinkitės informacija ir leiskite savo socialiniam intelektui tarnauti kolektyvui.',
      },
      12: {
        en: 'Your inner world buzzes with thoughts and questions. Rather than seeking silence, engage with spiritual teachings through reading, discussion, or contemplative writing. Let your mind be a vehicle for transcendence.',
        lt: 'Jūsų vidinis pasaulis kunkuliuoja mintimis ir klausimais. Užuot ieškojote tylos, bendraukite su dvasiniais mokymais per skaitymą, diskusijas ar apmąstomąjį rašymą. Leiskite savo protui būti transcendencijos priemone.',
      },
    },
  },
  cancer: {
    general: {
      en: 'The Sun in Cancer turns the collective attention inward — toward home, family, and emotional roots. Sensitivity is heightened, and there is a deep need for belonging and safety. This is a season for nurturing, for tending to inner wounds, and for creating spaces that feel like sanctuary.',
      lt: 'Saulė Vėžyje nukreipia kolektyvinį dėmesį į vidų — link namų, šeimos ir emocinių šaknų. Jautrumas sustiprėjęs, ir yra gilus priklausymo ir saugumo poreikis. Tai sezonas puoselėjimui, vidinių žaizdų gydymui ir erdvių, kurios jaučiasi kaip šventovė, kūrimui.',
    },
    themeKeywords: {
      en: ['nurturing', 'home', 'emotional depth', 'belonging'],
      lt: ['puoselėjimas', 'namai', 'emocinė gelmė', 'priklausymas'],
    },
    personalByHouse: {
      1: {
        en: 'The Cancer Sun softens your outer shell and connects you more deeply with your emotional core. This season asks you to lead with sensitivity, trust your instincts, and honour your need for safety.',
        lt: 'Vėžio Saulė suminkština jūsų išorinį apvalkalą ir sujungia jus giliau su jūsų emociniu centru. Šis sezonas prašo vadovauti su jautrumu, pasitikėti instinktais ir gerbti savo saugumo poreikį.',
      },
      2: {
        en: 'Financial security takes on emotional significance. Building a nest egg, investing in your home, or ensuring your family\'s material wellbeing feels like an act of love rather than mere practicality.',
        lt: 'Finansinis saugumas įgauna emocinę reikšmę. Lizdo kiaušinio kūrimas, investavimas į namus ar šeimos materialinės gerovės užtikrinimas jaučiasi kaip meilės veiksmas, o ne vien praktiškumas.',
      },
      3: {
        en: 'Your words carry emotional depth and nurturing warmth. Conversations with siblings, neighbours, and close contacts become more intimate. Express your care through thoughtful messages and heartfelt speech.',
        lt: 'Jūsų žodžiai neša emocinę gelmę ir puoselėjantį šiltumą. Pokalbiai su broliais, seserimis, kaimynais ir artimais kontaktais tampa intymialesni. Reikškite savo rūpestį per apgalvotas žinutes ir nuoširdžią kalbą.',
      },
      4: {
        en: 'Your home and family life is powerfully illuminated this season. This is the time to deepen family bonds, improve your living space, and create an environment that feels truly safe and nourishing.',
        lt: 'Jūsų namų ir šeimos gyvenimas šį sezoną galingai nušviestas. Tai laikas gilinti šeimos ryšius, pagerinti gyvenamąją erdvę ir sukurti aplinką, kuri jaučiasi tikrai saugi ir maitinanti.',
      },
      5: {
        en: 'Creative expression drawn from your emotional life and personal memories is deeply moving. Art, cooking, storytelling, or any creative act that comes from the heart resonates powerfully. Romance feels tender and protective.',
        lt: 'Kūrybinė raiška, kylanti iš jūsų emocinio gyvenimo ir asmeninių prisiminimų, yra giliai jaudinanti. Menas, maisto gaminimas, pasakojimas ar bet koks kūrybinis veiksmas, ateinantis iš širdies, stipriai rezonuoja. Romantika jaučiasi švelni ir apsauganti.',
      },
      6: {
        en: 'Your physical health is closely tied to your emotional state right now. Comfort eating, stress, or unprocessed feelings can manifest in your body. Nurture yourself holistically — body, mind, and heart together.',
        lt: 'Jūsų fizinė sveikata yra glaudžiai susijusi su emocine būsena dabar. Paguodos valgymas, stresas ar neapdoroti jausmai gali pasireikšti kūne. Puoselėkite save holistiškai — kūną, protą ir širdį kartu.',
      },
      7: {
        en: 'You bring nurturing energy to your partnerships and seek the same in return. Emotional safety and trust are the foundations you need. Create space for vulnerability — it deepens intimacy profoundly.',
        lt: 'Atneš ate puoselėjančią energiją į partnerystes ir ieškote to paties mainais. Emocinis saugumas ir pasitikėjimas yra jums reikalingi pamatai. Sukurkite erdvę pažeidžiamumui — tai giliai sustiprina artumą.',
      },
      8: {
        en: 'Deep emotional healing is available this season. Old wounds related to family, attachment, and belonging surface for resolution. Allow yourself to grieve what needs grieving and release what needs releasing.',
        lt: 'Gilus emocinis gijimas prieinamas šį sezoną. Senos žaizdos, susijusios su šeima, prisirišimu ir priklausymu, iškyla sprendimui. Leiskite sau gedėti tai, kam reikia gedėjimo, ir paleisti tai, kam reikia paleidimo.',
      },
      9: {
        en: 'Your quest for meaning draws from ancestral wisdom, family traditions, and emotional truth. Travel to places with personal or family significance brings unexpected insight and a deeper sense of belonging.',
        lt: 'Jūsų prasmės paieška semiasi iš protėvių išminties, šeimos tradicijų ir emocinės tiesos. Kelionės į vietas su asmenine ar šeimos reikšme atneša netikėtą įžvalgą ir gilesnį priklausymo pojūtį.',
      },
      10: {
        en: 'Emotional intelligence becomes your greatest professional asset. Lead with empathy, build a supportive team culture, and trust your instincts about people and situations. Authentic care earns lasting respect.',
        lt: 'Emocinis intelektas tampa didžiausiu jūsų profesiniu pranašumu. Vadovaukite su empatija, kurkite palaikančią komandos kultūrą ir pasitikėkite savo instinktais dėl žmonių ir situacijų. Autentiškas rūpestis pelno ilgalaikę pagarbą.',
      },
      11: {
        en: 'You seek to nurture and be nurtured within your social circles. Creating a sense of family among friends, hosting gatherings, and caring for your community members feels deeply purposeful.',
        lt: 'Siekiate puoselėti ir būti puoselėjami savo socialiniuose ratuose. Šeimos jausmo kūrimas tarp draugų, susibūrimų rengimas ir bendruomenės narių priežiūra jaučiasi giliai prasmingai.',
      },
      12: {
        en: 'Your spiritual life becomes deeply emotional and instinctive. Dreams, ancestral connections, and intuitive practices are heightened. Retreat into solitude when you need to — your inner world is rich and alive.',
        lt: 'Jūsų dvasinis gyvenimas tampa giliai emocinis ir instinktyvus. Sapnai, protėvių ryšiai ir intuityvios praktikos yra sustiprinti. Pasitraukite į vienatvę, kai jums reikia — jūsų vidinis pasaulis yra turtingas ir gyvas.',
      },
    },
  },
  leo: {
    general: {
      en: 'The Sun in Leo radiates warmth, creativity, and a desire to be fully expressed. This is the height of summer energy — bold, generous, and unapologetically alive. The collective mood favours celebration, artistic expression, and heartfelt leadership. Let your light shine without apology.',
      lt: 'Saulė Liūte spinduliuoja šilumą, kūrybiškumą ir troškimą būti visiškai išreikštam. Tai vasaros energijos viršūnė — drąsi, dosni ir be atsiprašymų gyva. Kolektyvinis nusistatymas palankus šventimui, meninei raiškai ir nuoširdžiai lyderystei. Leiskite savo šviesai šviesti be atsiprašymo.',
    },
    themeKeywords: {
      en: ['creativity', 'confidence', 'joy', 'self-expression'],
      lt: ['kūrybiškumas', 'pasitikėjimas', 'džiaugsmas', 'saviraiška'],
    },
    personalByHouse: {
      1: {
        en: 'The Leo Sun illuminates your identity with warmth, confidence, and creative power. This is your season to shine — step into the spotlight, express your authentic self, and inspire others through your example.',
        lt: 'Liūto Saulė nušviečia jūsų tapatybę šiluma, pasitikėjimu ir kūrybine galia. Tai jūsų sezonas spindėti — įženkite į dėmesio centrą, reikškite savo autentišką savastį ir įkvėpkite kitus savo pavyzdžiu.',
      },
      2: {
        en: 'Generous impulses meet your financial life. Invest in quality, treat yourself and others, but ensure your spending reflects genuine values rather than ego. Your sense of self-worth directly affects your earning potential now.',
        lt: 'Dosnus impulsai susitinka su jūsų finansiniu gyvenimu. Investuokite į kokybę, lepinkite save ir kitus, bet užtikrinkite, kad jūsų išlaidos atspindi tikras vertybes, o ne ego. Jūsų savivertės pojūtis tiesiogiai veikia uždarbio potencialą dabar.',
      },
      3: {
        en: 'Your words carry dramatic flair and heartfelt passion. Presentations, creative writing, and public speaking are powerfully favoured. Speak from the heart — authenticity is more compelling than perfection.',
        lt: 'Jūsų žodžiai neša dramatišką pakilumą ir nuoširdžią aistrą. Prezentacijos, kūrybinis rašymas ir viešasis kalbėjimas yra galingai palankūs. Kalbėkite iš širdies — autentiškumas yra įtikinamiau nei tobulumas.',
      },
      4: {
        en: 'Bringing warmth, celebration, and creative energy into your home life is the focus. Host, decorate, create family traditions, or simply fill your living space with more light and joy.',
        lt: 'Šilumos, šventimo ir kūrybinės energijos atnešimas į namų gyvenimą yra dėmesio centre. Renkite svečius, dekoruokite, kurkite šeimos tradicijas ar tiesiog pripildykite savo gyvenamąją erdvę daugiau šviesos ir džiaugsmo.',
      },
      5: {
        en: 'This is one of the most creatively potent seasons for you. Artistic expression, romance, playful joy, and anything that allows your heart to sing are deeply favoured. Do not hold back.',
        lt: 'Tai vienas kūrybiškai galingiausių sezonų jums. Meninė raiška, romantika, žaismingas džiaugsmas ir viskas, kas leidžia jūsų širdžiai dainuoti, yra labai palankūs. Nesilaikykite.',
      },
      6: {
        en: 'Approach your daily health routines with pride and pleasure rather than obligation. Exercise that feels celebratory, food that delights, and work that lets you take pride in your craft all support your wellbeing.',
        lt: 'Artėkite prie kasdienių sveikatos rutinų su pasididžiavimu ir malonumu, o ne pareiga. Pratimai, kurie jaučiasi kaip šventė, maistas, kuris džiugina, ir darbas, kuriame galite didžiuotis savo amatu — visa tai palaiko jūsų gerovę.',
      },
      7: {
        en: 'Your partnerships thrive when you bring your full, radiant self. Share your light generously with your closest person, and welcome their light equally. The best relationships celebrate both people fully.',
        lt: 'Jūsų partnerystės klesti, kai atneš ate visą savo spinduliuojančią savastį. Dalinkitės savo šviesa dosniai su artimiausiu žmogumi ir priimkite jų šviesą lygiai taip pat. Geriausi santykiai švenčia abu žmones visiškai.',
      },
      8: {
        en: 'Deep change asks you to let go of ego attachments. What you cling to out of pride may be exactly what needs to be released. The most courageous act is allowing yourself to be vulnerable.',
        lt: 'Gilūs pokyčiai prašo jūsų atsisakyti ego prisirišimų. Tai, ko laikotės iš puikybės, gali būti kaip tik tai, ką reikia paleisti. Drąsiausias veiksmas yra leisti sau būti pažeidžiamam.',
      },
      9: {
        en: 'Your spirit reaches for grand experiences and inspiring knowledge. Travel to places that awe you, study subjects that set your imagination ablaze, or share your wisdom through teaching and storytelling.',
        lt: 'Jūsų dvasia siekia didingų patirčių ir įkvepiančio žinojimo. Keliaukite į vietas, kurios jus stebina, studijuokite dalykus, kurie uždega jūsų vaizduotę, ar dalinkitės savo išmintimi per mokymą ir pasakojimą.',
      },
      10: {
        en: 'Professional authority and creative leadership are your superpowers this season. Step into visible roles, present your vision boldly, and trust that your natural warmth draws the right opportunities toward you.',
        lt: 'Profesinis autoritetas ir kūrybinė lyderystė yra jūsų supergalios šį sezoną. Įženkite į matomus vaidmenis, drąsiai pristatykite savo viziją ir pasitikėkite, kad jūsų natūralus šilumas pritraukia tinkamas galimybes.',
      },
      11: {
        en: 'Your generous spirit inspires and energises your social circles. Lead by example, celebrate others\' achievements as warmly as your own, and use your charisma to rally people around meaningful causes.',
        lt: 'Jūsų dosni dvasia įkvepia ir energizuoja jūsų socialinius ratus. Vadovaukite pavyzdžiu, švęskite kitų pasiekimus taip pat šiltai kaip savo ir naudokite savo charizmą sutelkti žmones aplink prasmingus reikalus.',
      },
      12: {
        en: 'Creative visualisation, heart-centred prayer, and devotional practice suit your spiritual temperament right now. Your inner world needs warmth and purpose — approach the sacred with the same passion you bring to life.',
        lt: 'Kūrybinė vizualizacija, širdimi vadovaujama malda ir atsidavimo praktika tinka jūsų dvasiniam temperamentui dabar. Jūsų vidinis pasaulis reikalauja šilumos ir tikslo — artėkite prie šventybės su tokia pat aistra, kokią atneš ate į gyvenimą.',
      },
    },
  },
  virgo: {
    general: {
      en: 'The Sun in Virgo shifts the focus toward refinement, service, and practical improvement. The expansive energy of Leo gives way to a quieter dedication to craft, health, and the details that hold life together. This is a season for getting organised, healing old patterns, and honouring the sacred in the ordinary.',
      lt: 'Saulė Mergelėje nukreipia dėmesį į tobulinimą, tarnavimą ir praktinį gerinimą. Plėtrinė Liūto energija užleidžia vietą tyliam atsidavimui amatui, sveikatai ir detalėms, kurios laiko gyvenimą drauge. Tai sezonas organizavimuisi, senų modelių gydymui ir šventumo gerbimui kasdieniškame.',
    },
    themeKeywords: {
      en: ['service', 'health', 'refinement', 'practical wisdom'],
      lt: ['tarnavimas', 'sveikata', 'tobulinimas', 'praktiška išmintis'],
    },
    personalByHouse: {
      1: {
        en: 'The Virgo Sun refines your sense of self with analytical clarity and a desire for genuine improvement. This season asks you to serve, heal, and attend to the details of becoming your best self.',
        lt: 'Mergelės Saulė tobulina jūsų savęs pojūtį analitiniu aiškumu ir tikru noru tobulėti. Šis sezonas prašo tarnauti, gydyti ir rūpintis detalėmis, kad taptumėte geriausia savo versija.',
      },
      2: {
        en: 'Financial precision and practical budgeting come naturally. This is an excellent time for sorting through accounts, eliminating waste, and building a more efficient relationship with money and resources.',
        lt: 'Finansinis tikslumas ir praktiškas biudžeto sudarymas ateina natūraliai. Tai puikus metas surūšiuoti sąskaitas, pašalinti švaistymą ir sukurti efektyvesnį santykį su pinigais ir ištekliais.',
      },
      3: {
        en: 'Your thinking and communication are sharp, precise, and detail-oriented. Editing, analysis, and carefully crafted messages are strongly favoured. Your clarity of expression earns trust and respect.',
        lt: 'Jūsų mąstymas ir bendravimas yra aštrus, tikslus ir orientuotas į detales. Redagavimas, analizė ir kruopščiai sukurti pranešimai yra stipriai palankūs. Jūsų raiškos aiškumas pelna pasitikėjimą ir pagarbą.',
      },
      4: {
        en: 'Domestic organisation and improvement take priority. Decluttering, repairing what is broken, and creating a more functional home environment brings deep satisfaction and emotional stability.',
        lt: 'Namų organizavimas ir tobulinimas tampa prioritetu. Daiktų rūšiavimas, sugedusių dalykų taisymas ir funkcionalesnės namų aplinkos kūrimas suteikia gilų pasitenkinimą ir emocinį stabilumą.',
      },
      5: {
        en: 'Craftsmanship and technical skill elevate your creative work. This is a season for refining your art rather than starting from scratch — polish, edit, and perfect. The details matter, and they show.',
        lt: 'Amatas ir techninis įgūdis iškelia jūsų kūrybinį darbą. Tai sezonas tobulinti savo meną, o ne pradėti iš naujo — šlifuokite, redaguokite ir tobulinkite. Detalės svarbios, ir tai matyti.',
      },
      6: {
        en: 'Your health and daily routines are powerfully in focus. Establish sustainable habits, address nagging health concerns, and approach your wellbeing with the same care and precision you bring to your best work.',
        lt: 'Jūsų sveikata ir kasdienės rutinos yra galingai dėmesio centre. Sukurkite tvarius įpročius, spręskite nerimaujančias sveikatos problemas ir artėkite prie savo gerovės su tokiu pat rūpestingumu ir tikslumu, kokį atneš ate į savo geriausią darbą.',
      },
      7: {
        en: 'Practical devotion defines your partnerships. Show love through acts of service, problem-solving together, and attending to the small things that make daily life run smoothly. Helpfulness is your love language now.',
        lt: 'Praktiškas atsidavimas apibrėžia jūsų partnerystes. Parodykite meilę per tarnavimo veiksmus, bendrai spręsdami problemas ir rūpindamiesi smulkmenomis, kurios padeda kasdieniam gyvenimui veikti sklandžiai. Pagalbumas yra jūsų meilės kalba dabar.',
      },
      8: {
        en: 'Analytical self-examination yields genuine breakthroughs. Systematically exploring your patterns, triggers, and deeper motivations — perhaps through therapy or structured journaling — leads to meaningful healing.',
        lt: 'Analitinė savianalizė duoda tikrus proveržius. Sisteminis savo modelių, trigerių ir gilesnių motyvų tyrinėjimas — galbūt per terapiją ar struktūrizuotą dienoraštį — veda prie prasmingo gijimo.',
      },
      9: {
        en: 'Applied learning and practical skill development appeal more than abstract philosophy. Workshops, certifications, or study programmes that give you usable knowledge satisfy your hunger for growth.',
        lt: 'Taikomasis mokymasis ir praktinio įgūdžio ugdymas patraukia labiau nei abstrakti filosofija. Seminarai, sertifikatai ar studijų programos, suteikiančios naudingų žinių, patenkina jūsų augimo alkį.',
      },
      10: {
        en: 'Professional excellence through meticulous work and genuine service advances your reputation. This is not a season for self-promotion but for letting the quality of your work speak for itself.',
        lt: 'Profesinė puikybė per kruopštų darbą ir tikrą tarnavimą kelia jūsų reputaciją. Tai ne sezonas savęs reklamai, o tam, kad jūsų darbo kokybė kalbėtų pati.',
      },
      11: {
        en: 'Your communities benefit most from your practical contributions. Organising events, solving logistical problems, or offering skilled help is how you make your most meaningful social impact.',
        lt: 'Jūsų bendruomenės labiausiai gauna naudos iš jūsų praktinių indėlių. Renginių organizavimas, logistinių problemų sprendimas ar kvalifikuotos pagalbos siūlymas — tai būdas, kuriuo darote didžiausią socialinį poveikį.',
      },
      12: {
        en: 'Mindfulness and body-based practices ground your spiritual life in daily reality. Meditation focused on present-moment awareness, service to others, and finding the sacred in ordinary tasks brings genuine transcendence.',
        lt: 'Sąmoningumas ir kūnu pagrįstos praktikos įžemina jūsų dvasinį gyvenimą kasdienėje realybėje. Meditacija, orientuota į dabartinės akimirkos sąmoningumą, tarnavimas kitiems ir šventumo ieškojimas kasdienėse užduotyse atneša tikrą transcendenciją.',
      },
    },
  },
  libra: {
    general: {
      en: 'The Sun in Libra brings balance, beauty, and relationship into the collective spotlight. The equinox energy asks everyone to find equilibrium — between self and other, giving and receiving, action and rest. This is a season for diplomacy, aesthetic appreciation, and meaningful partnership.',
      lt: 'Saulė Svarstyklėse atneša pusiausvyrą, grožį ir santykius į kolektyvinį dėmesio centrą. Lygiadienio energija prašo visų rasti pusiausvyrą — tarp savęs ir kito, davimo ir priėmimo, veiksmo ir poilsio. Tai sezonas diplomatijai, estetiniam vertinimui ir prasmingai partnerystei.',
    },
    themeKeywords: {
      en: ['balance', 'partnership', 'beauty', 'diplomacy'],
      lt: ['pusiausvyra', 'partnerystė', 'grožis', 'diplomatija'],
    },
    personalByHouse: {
      1: {
        en: 'The Libra Sun brings grace, diplomacy, and aesthetic sensibility to your identity. This season asks you to find balance — between self and other, action and reflection, giving and receiving.',
        lt: 'Svarstyklių Saulė suteikia malonę, diplomatiją ir estetinį jautrumą jūsų tapatybei. Šis sezonas prašo rasti pusiausvyrą — tarp savęs ir kito, veiksmo ir apmąstymo, davimo ir priėmimo.',
      },
      2: {
        en: 'Financial decisions benefit from careful weighing of options and a focus on fairness. Joint financial arrangements, investments in beauty and culture, and balancing your budget with care are all favoured.',
        lt: 'Finansiniai sprendimai gauna naudos iš kruopštaus galimybių svėrimo ir dėmesio sąžiningumui. Bendri finansiniai susitarimai, investicijos į grožį ir kultūrą bei biudžeto subalansavimas su rūpesčiu — visa tai palankiai vertinami.',
      },
      3: {
        en: 'Diplomatic, graceful communication is your strength. Mediating disagreements, writing with elegance, and facilitating harmonious conversations comes naturally. Your words create bridges between people.',
        lt: 'Diplomatiškas, malonus bendravimas yra jūsų stiprybė. Nesutarimų tarpininkavimas, elegantiškas rašymas ir harmoningų pokalbių skatinimas ateina natūraliai. Jūsų žodžiai kuria tiltus tarp žmonių.',
      },
      4: {
        en: 'Creating aesthetic harmony in your home environment nourishes your soul. Beautiful interiors, balanced relationships with family members, and a peaceful domestic atmosphere are worth investing in.',
        lt: 'Estetinės harmonijos kūrimas namų aplinkoje maitina jūsų sielą. Gražūs interjerai, subalansuoti santykiai su šeimos nariais ir taikinga namų atmosfera verta investicijos.',
      },
      5: {
        en: 'Artistic expression infused with beauty, balance, and relational themes flourishes. Collaborative creative projects, romantic connection, and any art form that celebrates harmony resonates deeply with this season.',
        lt: 'Meninė raiška, pripildyta grožio, pusiausvyros ir santykių temų, klesti. Bendri kūrybiniai projektai, romantinis ryšys ir bet kokia meno forma, švenčianti harmoniją, giliai rezonuoja su šiuo sezonu.',
      },
      6: {
        en: 'Balance is the guiding principle for your wellbeing. Neither extreme dieting nor indulgence — find the middle path. Graceful movement practices like dance or tai chi suit this Sun\'s energy perfectly.',
        lt: 'Pusiausvyra yra pagrindinis principas jūsų gerovei. Nei kraštutinė dieta, nei nuolaidžiavimas — raskite vidurio kelią. Gracingos judėjimo praktikos kaip šokis ar tai čis puikiai tinka šios Saulės energijai.',
      },
      7: {
        en: 'Partnerships and one-on-one connections are powerfully illuminated this season. This is the time to deepen commitment, resolve imbalances, and co-create relationships that genuinely honour both people equally.',
        lt: 'Partnerystės ir artimi ryšiai šį sezoną galingai nušviesti. Tai laikas gilinti įsipareigojimą, spręsti disbalansus ir kurti santykius, kurie tikrai gerbia abu žmones lygiai.',
      },
      8: {
        en: 'Deep transformation comes through relationship — the mirror of another person reveals what you cannot see alone. Couples therapy, honest dialogue with a trusted friend, or relational healing work is profoundly effective.',
        lt: 'Gili transformacija ateina per santykius — kito žmogaus veidrodis atskleidžia tai, ko patys negalite pamatyti. Porų terapija, sąžiningas dialogas su patikimu draugu ar santykių gijimo darbas yra giliai efektyvus.',
      },
      9: {
        en: 'Cultural exploration, art history, philosophy of justice, and cross-cultural understanding captivate your mind. Travel to beautiful places or immerse yourself in a different aesthetic tradition to broaden your perspective.',
        lt: 'Kultūros tyrinėjimas, meno istorija, teisingumo filosofija ir tarpkultūrinis supratimas užburia jūsų protą. Keliaukite į gražias vietas ar pasinerkite į kitokią estetinę tradiciją savo perspektyvai praplėsti.',
      },
      10: {
        en: 'Networking, diplomacy, and collaborative leadership advance your professional goals. Building alliances, mediating workplace tensions, and presenting ideas with charm and grace are your greatest career assets now.',
        lt: 'Ryšių kūrimas, diplomatija ir bendradarbiavimo lyderystė skatina jūsų profesinius tikslus. Aljansų kūrimas, darbo vietos įtampų tarpininkavimas ir idėjų pristatymas su žavesiu ir malone yra jūsų didžiausi karjeros pranašumai dabar.',
      },
      11: {
        en: 'Social harmony and collaborative vision define your community involvement. Bridge-building between different groups, creating beautiful shared spaces, and advocating for fairness within your social circles feels deeply purposeful.',
        lt: 'Socialinė harmonija ir bendra vizija apibrėžia jūsų dalyvavimą bendruomenėje. Tiltų statymas tarp skirtingų grupių, gražių bendrų erdvių kūrimas ir sąžiningumo propagavimas jūsų socialiniuose ratuose jaučiasi giliai prasmingai.',
      },
      12: {
        en: 'Inner balance and peace are the goals of your spiritual practice. Meditation focused on equilibrium, contemplation of beauty as a doorway to the divine, and practices that harmonise your inner world bring deep serenity.',
        lt: 'Vidinė pusiausvyra ir ramybė yra jūsų dvasinės praktikos tikslai. Meditacija, orientuota į pusiausvyrą, grožio apmąstymas kaip kelias į dievišką ir praktikos, harmonizuojančios jūsų vidinį pasaulį, atneša gilią ramybę.',
      },
    },
  },
  scorpio: {
    general: {
      en: 'The Sun in Scorpio draws the collective gaze below the surface. This is a season of depth, intensity, and unflinching honesty. Hidden truths emerge, emotional power deepens, and transformation becomes possible for those willing to look into the shadows. Trust the process of dying and being reborn.',
      lt: 'Saulė Skorpione nukreipia kolektyvinį žvilgsnį po paviršiumi. Tai gelmės, intensyvumo ir bekompromisio sąžiningumo sezonas. Paslėptos tiesos iškyla, emocinė galia gilėja, ir transformacija tampa galima tiems, kurie pasiruošę žvelgti į šešėlius. Pasitikėkite mirties ir atgimimo procesu.',
    },
    themeKeywords: {
      en: ['transformation', 'intensity', 'truth', 'power'],
      lt: ['transformacija', 'intensyvumas', 'tiesa', 'galia'],
    },
    personalByHouse: {
      1: {
        en: 'The Scorpio Sun empowers your identity with intensity, depth, and transformative potential. This season asks you to be fearlessly authentic — to embrace your power and your vulnerability in equal measure.',
        lt: 'Skorpiono Saulė įgalina jūsų tapatybę intensyvumu, gelme ir transformacine galia. Šis sezonas prašo būti bebaimiai autentiškais — priimti savo galią ir pažeidžiamumą lygiomis dalimis.',
      },
      2: {
        en: 'Financial matters take on strategic intensity. This is a powerful time for eliminating debt, investigating investments, or transforming your relationship with money and resources at a fundamental level.',
        lt: 'Finansiniai reikalai įgauna strateginį intensyvumą. Tai galingas metas pašalinti skolas, tirti investicijas ar transformuoti savo santykį su pinigais ir ištekliais fundamentaliu lygmeniu.',
      },
      3: {
        en: 'Your words penetrate beneath the surface. Conversations become more honest, probing, and potentially uncomfortable — but also more genuinely healing. Speak truth carefully, and listen for what others are really saying.',
        lt: 'Jūsų žodžiai prasiskverbia po paviršiumi. Pokalbiai tampa sąžiningesni, gilūs ir galbūt nepatogūs — bet taip pat tikrai gydantys. Kalbėkite tiesą rūpestingai ir klausykite, ką kiti iš tikrųjų sako.',
      },
      4: {
        en: 'Deep emotional currents flow through your home and family life. Secrets may surface, old dynamics may shift, and the opportunity for genuine healing within your closest bonds is profound.',
        lt: 'Gilios emocinės srovės teka per jūsų namų ir šeimos gyvenimą. Paslaptys gali iškilti, senos dinamikos gali pasikeisti, ir galimybė tikram gijimui artimiausiuose ryšiuose yra gili.',
      },
      5: {
        en: 'Creative expression drawn from your deepest emotions — grief, desire, rage, ecstasy — produces work of genuine power. Do not flinch from intensity in your art or your romantic life.',
        lt: 'Kūrybinė raiška, kylanti iš giliausių emocijų — sielvarto, troškimo, įtūžio, ekstazės — sukuria tikrai galingą darbą. Nesibaidykite intensyvumo savo mene ar romantiniame gyvenime.',
      },
      6: {
        en: 'Detoxification, elimination, and confronting hidden health issues are strongly favoured. Address what you have been avoiding. Your body\'s capacity for regeneration is remarkable when you give it what it truly needs.',
        lt: 'Detoksikacija, šalinimas ir paslėptų sveikatos problemų sprendimas yra labai palankūs. Spręskite tai, ką vengėte. Jūsų kūno regeneracijos pajėgumas yra nuostabus, kai duodate jam tai, ko jam tikrai reikia.',
      },
      7: {
        en: 'Partnerships require radical honesty and emotional courage this season. Surface-level connection no longer satisfies — you need intimacy that goes to the bone. This can be uncomfortable but profoundly bonding.',
        lt: 'Partnerystės reikalauja radikalaus sąžiningumo ir emocinės drąsos šį sezoną. Paviršutiniški ryšiai nebetenkina — jums reikia artumo, kuris eina iki kaulo. Tai gali būti nepatogu, bet giliai sutvirtina ryšius.',
      },
      8: {
        en: 'This is your most powerful season for deep inner work. Psychological healing, shadow integration, and allowing complete emotional rebirth are all available. Trust the process, even when it feels like destruction.',
        lt: 'Tai jūsų galingiausias sezonas giliam vidiniam darbui. Psichologinis gijimas, šešėlių integracija ir leidimas visiškai emociškai atgimti — visa tai prieinama. Pasitikėkite procesu, net kai jaučiasi kaip griovimas.',
      },
      9: {
        en: 'Your quest for truth cuts through comfortable illusions. Esoteric knowledge, depth psychology, investigative research, or travel to places with intense spiritual energy calls you toward deeper understanding.',
        lt: 'Jūsų tiesos paieška prasiskverbia per patogias iliuzijas. Ezoterinis žinojimas, gelmių psichologija, tyrimo darbas ar kelionės į vietas su intensyvia dvasine energija kviečia jus link gilesnio supratimo.',
      },
      10: {
        en: 'Strategic professional power is available to you. Navigate workplace politics with insight, make career moves with precision, and allow your authentic intensity to command respect rather than hiding it.',
        lt: 'Strateginė profesinė galia jums prieinama. Naršykite darbo vietos politiką su įžvalga, darykite karjeros žingsnius su tikslumu ir leiskite savo autentiškam intensyvumui pelnyti pagarbą, o ne jį slėpkite.',
      },
      11: {
        en: 'You seek depth and authenticity in your social connections. Groups focused on healing, transformation, or social justice resonate. Your willingness to go deep inspires others to do the same.',
        lt: 'Ieškote gelmės ir autentiškumo savo socialiniuose ryšiuose. Grupės, orientuotos į gijimą, transformaciją ar socialinį teisingumą, rezonuoja. Jūsų noras eiti giliai įkvepia kitus daryti tą patį.',
      },
      12: {
        en: 'The unseen world feels closer than ever. Meditation, dream work, ancestral healing, and practices that explore the threshold between life and death bring genuine spiritual power and transformation.',
        lt: 'Nematomas pasaulis jaučiasi arčiau nei bet kada. Meditacija, sapnų darbas, protėvių gijimas ir praktikos, tyrinėjančios ribą tarp gyvenimo ir mirties, atneša tikrą dvasinę galią ir transformaciją.',
      },
    },
  },
  sagittarius: {
    general: {
      en: 'The Sun in Sagittarius expands the horizon and fills the air with optimism, adventure, and philosophical inquiry. This is a season for travel — of body or mind — and for asking the big questions about meaning, purpose, and belief. Generosity and faith in the future come naturally now.',
      lt: 'Saulė Šaulyje praplečia horizontą ir užpildo orą optimizmu, nuotykiais ir filosofine paieška. Tai sezonas kelionei — kūno ar proto — ir didelių klausimų apie prasmę, tikslą ir tikėjimą kėlimui. Dosnumas ir tikėjimas ateitimi ateina natūraliai dabar.',
    },
    themeKeywords: {
      en: ['adventure', 'wisdom', 'expansion', 'optimism'],
      lt: ['nuotykis', 'išmintis', 'plėtra', 'optimizmas'],
    },
    personalByHouse: {
      1: {
        en: 'The Sagittarius Sun fills your identity with optimism, wanderlust, and philosophical fire. This season asks you to expand your horizons, trust your vision, and share your enthusiasm with the world.',
        lt: 'Šaulio Saulė pripildo jūsų tapatybę optimizmu, kelionių troškimu ir filosofine ugnimi. Šis sezonas prašo praplėsti savo horizontus, pasitikėti savo vizija ir dalintis savo entuziazmu su pasauliu.',
      },
      2: {
        en: 'Generous financial impulses and big-picture thinking characterise your approach to money. Invest in experiences, education, or ventures with long-term growth potential rather than accumulating for security alone.',
        lt: 'Dosnūs finansiniai impulsai ir didelio vaizdo mąstymas apibūdina jūsų požiūrį į pinigus. Investuokite į patirtis, švietimą ar verslo sumanymus su ilgalaikiu augimo potencialu, o ne kaupkite dėl saugumo.',
      },
      3: {
        en: 'Your words carry inspiring, visionary energy. Teaching, publishing, public speaking, and conversations that explore the meaning of life are all strongly favoured. Speak your truth with confidence.',
        lt: 'Jūsų žodžiai neša įkvepiančią, vizionierišką energiją. Mokymas, publikavimas, viešasis kalbėjimas ir pokalbiai, tyrinėjantys gyvenimo prasmę — visa tai stipriai palankūs. Kalbėkite savo tiesą su pasitikėjimu.',
      },
      4: {
        en: 'You may feel restless at home, craving more space or freedom within your domestic life. Bring the spirit of adventure indoors — international decor, philosophical family discussions, or hosting visitors from afar.',
        lt: 'Galite jaustis neramiai namuose, trokšdami daugiau erdvės ar laisvės namų gyvenime. Atneškite nuotykio dvasią į namus — paruoškite užsienio virtuvę, vaizdų pokalbiu paskambinkite tolimam draugui ar priimkite svečius iš toli.',
      },
      5: {
        en: 'Expansive, ambitious creative projects call to you. Think bigger than usual — write the book, stage the performance, or pursue the artistic vision that has been quietly growing. Romance feels adventurous and free.',
        lt: 'Plačiausi, ambicingiauisi kūrybiniai projektai kviečia jus. Galvokite plačiau nei įprastai — parašykite knygą, surenkite spektaklį ar siekite meninės vizijos, kuri tyliai augo. Romantika jaučiasi nuotykinga ir laisva.',
      },
      6: {
        en: 'Active, outdoor-oriented health practices suit this season perfectly. Hiking, sports, or any movement that feels like adventure rather than obligation keeps your body and spirit thriving.',
        lt: 'Aktyvios, lauko sveikatos praktikos puikiai tinka šiam sezonui. Žygiai, sportas ar bet koks judėjimas, kuris jaučiasi kaip nuotykis, o ne pareiga, palaiko jūsų kūną ir dvasią klestinčius.',
      },
      7: {
        en: 'Freedom and growth are the gifts you bring to partnerships. Encourage your closest person to expand alongside you, and welcome the ways they challenge your assumptions. The best relationships help both people grow.',
        lt: 'Laisvė ir augimas yra dovanos, kurias atneš ate į partnerystes. Skatinkite artimiausią žmogų plėstis kartu su jumis ir priimkite būdus, kuriais jie meta iššūkį jūsų prielaidoms. Geriausi santykiai padeda abiem žmonėms augti.',
      },
      8: {
        en: 'Deep change becomes meaningful when you can see the purpose in it. Finding wisdom in your pain, extracting the lesson from the crisis, and trusting that every ending is a beginning keeps you moving forward.',
        lt: 'Gilūs pokyčiai tampa prasmingi, kai matote tikslą juose. Išminties ieškojimas savo skausme, pamokos ištraukimas iš krizės ir pasitikėjimas, kad kiekviena pabaiga yra pradžia, jus judina pirmyn.',
      },
      9: {
        en: 'This is your most potent season for expansion of every kind. Travel, higher education, spiritual pilgrimage, or simply following your curiosity into unfamiliar territory yields extraordinary growth and insight.',
        lt: 'Tai jūsų galingiausias sezonas plėtrai visomis kryptimis. Kelionės, aukštasis mokslas, dvasinis piligrimystė ar tiesiog savo smalsumo sekimas į nepažįstamą teritoriją duoda nepaprastą augimą ir įžvalgą.',
      },
      10: {
        en: 'Visionary leadership and big-picture thinking advance your professional standing. Position yourself as someone with a clear philosophy and a long-term vision. Your optimism and ambition inspire confidence.',
        lt: 'Vizionietiška lyderystė ir didelio vaizdo mąstymas skatina jūsų profesinę poziciją. Pozicionuokite save kaip žmogų su aiškia filosofija ir ilgalaike vizija. Jūsų optimizmas ir ambicija įkvepia pasitikėjimą.',
      },
      11: {
        en: 'You are the visionary within your social circles. Rally your community around an inspiring cause, share your knowledge generously, and build networks that connect people across cultural and ideological boundaries.',
        lt: 'Jūs esate vizionierius savo socialiniuose ratuose. Sutelkite savo bendruomenę aplink įkvepiančią bylą, dosniai dalinkitės savo žiniomis ir kurkite tinklus, jungiantčius žmones per kultūrines ir ideologines ribas.',
      },
      12: {
        en: 'Your inner life expands toward the universal and the transcendent. Meditation, prayer, or contemplation that connects you to something greater than your individual story brings profound peace and renewed purpose.',
        lt: 'Jūsų vidinis gyvenimas plečiasi link universalaus ir transcendentinio. Meditacija, malda ar apmąstymas, jungiantis jus su kažkuo didesniu nei jūsų individuali istorija, atneša gilią ramybę ir atnaujintą tikslą.',
      },
    },
  },
  capricorn: {
    general: {
      en: 'The Sun in Capricorn coincides with the winter solstice and the return of the light, yet the energy is focused and serious. This is a season for setting long-term goals, taking responsibility, and building structures that will endure. Discipline and ambition are the gifts of this cardinal earth transit.',
      lt: 'Saulė Ožiaragyje sutampa su žiemos saulėgrįža ir šviesos sugrįžimu, tačiau energija yra susitelkusi ir rimta. Tai sezonas ilgalaikių tikslų nustatymui, atsakomybės prisiėmimui ir struktūrų, kurios atlaikys, statybai. Disciplina ir ambicija yra šio kardinalaus žemės tranzito dovanos.',
    },
    themeKeywords: {
      en: ['ambition', 'discipline', 'structure', 'endurance'],
      lt: ['ambicija', 'disciplina', 'struktūra', 'ištvermė'],
    },
    personalByHouse: {
      1: {
        en: 'The Capricorn Sun endows your identity with quiet authority, discipline, and determination. This season asks you to take responsibility for your life, set meaningful goals, and build structures that endure.',
        lt: 'Ožiaragio Saulė suteikia jūsų tapatybei tylų autoritetą, discipliną ir ryžtą. Šis sezonas prašo prisiimti atsakomybę už savo gyvenimą, nustatyti prasmingus tikslus ir statyti struktūras, kurios tvers.',
      },
      2: {
        en: 'Long-term financial planning and disciplined saving are powerfully favoured. Build wealth slowly and wisely — the foundation you lay now will support you for years. Material security is a worthy goal.',
        lt: 'Ilgalaikis finansinis planavimas ir disciplinuotas taupymas yra galingai palankūs. Kurkite turtą lėtai ir išmintingai — pamatai, kuriuos dedate dabar, palaikys jus metus. Materialinis saugumas yra vertas tikslas.',
      },
      3: {
        en: 'Your words carry weight and authority. Business communication, strategic planning conversations, and practical advice are received with respect. Speak from experience and people will listen.',
        lt: 'Jūsų žodžiai neša svorį ir autoritetą. Verslo komunikacija, strateginio planavimo pokalbiai ir praktiniai patarimai priimami su pagarba. Kalbėkite iš patirties ir žmonės klausysis.',
      },
      4: {
        en: 'Strengthening the foundations of your domestic life — literally and emotionally — is the focus. Home repairs, establishing family traditions, or creating more structure in your household brings lasting satisfaction.',
        lt: 'Namų gyvenimo pamatų stiprinimas — tiesiogine ir perkeltine prasme — yra dėmesio centre. Namų remontai, šeimos tradicijų kūrimas ar daugiau struktūros namų ūkyje atneša ilgalaikį pasitenkinimą.',
      },
      5: {
        en: 'Disciplined creative practice yields your best work this season. Set yourself a challenge, work within structure, and commit to mastering your craft. The joy comes from achieving something you can be proud of.',
        lt: 'Disciplinuota kūrybinė praktika šį sezoną duoda geriausią darbą. Iššūkio nustatymas, darbas su struktūra ir atsidavimas savo amato meistriškumui. Džiaugsmas ateina iš kažko pasiekimo, kuriuo galite didžiuotis.',
      },
      6: {
        en: 'Building sustainable, long-term health habits is the priority. Focus on consistency over intensity — the daily walk matters more than the occasional sprint. Your body rewards commitment with lasting vitality.',
        lt: 'Tvarių, ilgalaikių sveikatos įpročių kūrimas yra prioritetas. Nuoseklumas, o ne intensyvumas — kasdienė pasivaikščiojimas yra svarbiau nei retkarčiais vykstantis sprintas. Jūsų kūnas atlygina įsipareigojimui ilgalaike gyvybingumu.',
      },
      7: {
        en: 'Mature, committed partnerships are the focus. This season favours building lasting relationship structures — shared goals, clear agreements, and mutual respect as the foundation of enduring love.',
        lt: 'Brandžios, įsipareigojusios partnerystės yra dėmesio centre. Šis sezonas palankus ilgalaikių santykių struktūrų statybai — bendrų tikslų, aiškių susitarimų ir abipusės pagarbos kaip ilgalaikės meilės pamato.',
      },
      8: {
        en: 'Deep change requires patience and steady effort rather than dramatic upheaval. Work through your shadows methodically, with the same discipline you bring to your professional life. Lasting transformation takes time.',
        lt: 'Gilūs pokyčiai reikalauja kantrybės ir nuoseklių pastangų, o ne dramatiško perversmo. Dirbkite su savo šešėliais metodiškai, su tokia pat disciplina, kokią atneš ate į profesinį gyvenimą. Ilgalaikė transformacija reikalauja laiko.',
      },
      9: {
        en: 'Traditional wisdom, established teachers, and time-tested knowledge appeal more than experimental approaches. Structure your learning — formal education, apprenticeship, or systematic study — for the most lasting growth.',
        lt: 'Tradicinė išmintis, pripažinti mokytojai ir laiko patikrintos žinios patraukia labiau nei eksperimentiniai požiūriai. Struktūrizuokite savo mokymąsi — formalus švietimas, pameistrystė ar sistemingas studijavimas — ilgalaikiausiam augimui.',
      },
      10: {
        en: 'This is your most powerful season for professional achievement. Set ambitious goals, step into authority, and let your competence and dedication speak for themselves. Career milestones are within reach.',
        lt: 'Tai jūsų galingiausias sezonas profesiniams pasiekimams. Nustatykite ambicingus tikslus, įženkite į autoritetą ir leiskite savo kompetencijai ir atsidavimui kalbėti patiems. Karjeros etapai yra pasiekiami.',
      },
      11: {
        en: 'Your contribution to community and social causes is most effective when it is practical and organised. Build infrastructure, create systems, and lead with quiet competence. Lasting change requires lasting structures.',
        lt: 'Jūsų indėlis į bendruomenę ir socialines bylas yra efektyviausias, kai jis yra praktiškas ir organizuotas. Kurkite infrastruktūrą, sukurkite sistemas ir vadovaukite su tyliu kompetentingumu. Ilgalaikis pokytis reikalauja ilgalaikių struktūrų.',
      },
      12: {
        en: 'Disciplined spiritual practice — regular meditation, structured retreat, or systematic study of a tradition — brings deeper results than sporadic exploration. Commit to a path and walk it with patience.',
        lt: 'Disciplinuota dvasinė praktika — reguliari meditacija, struktūrizuotas atsiskyrimas ar sistemingas tradicijos studijavimas — duoda gilesnius rezultatus nei sporiadiškas tyrinėjimas. Įsipareigokite keliui ir eikite juo su kantrybe.',
      },
    },
  },
  aquarius: {
    general: {
      en: 'The Sun in Aquarius electrifies the collective with innovation, humanitarian ideals, and a desire for freedom. Convention is questioned, individuality is celebrated, and community becomes more important than personal glory. This is a season for visionary thinking and progressive action.',
      lt: 'Saulė Vandenyje elektrifikuoja kolektyvą inovacijomis, humanitariniais idealais ir laisvės troškimu. Konvencijos kvestionuojamos, individualumas švenčiamas, ir bendruomenė tampa svarbesnė nei asmeninė šlovė. Tai sezonas vizionietiškam mąstymui ir pažangiam veikimui.',
    },
    themeKeywords: {
      en: ['innovation', 'community', 'freedom', 'vision'],
      lt: ['inovacija', 'bendruomenė', 'laisvė', 'vizija'],
    },
    personalByHouse: {
      1: {
        en: 'The Aquarius Sun electrifies your identity with originality, independence, and humanitarian vision. This season asks you to be authentically yourself — even when that means standing apart from the crowd.',
        lt: 'Vandenio Saulė elektrifikuoja jūsų tapatybę originalumu, nepriklausomybe ir humanitarine vizija. Šis sezonas prašo būti autentiškai savimi — net kai tai reiškia stovėjimą atskirai nuo minios.',
      },
      2: {
        en: 'Innovative financial thinking and unconventional approaches to earning and spending are favoured. Consider ethical investments, community-based economics, or creative revenue streams that align with your progressive values.',
        lt: 'Inovatyvus finansinis mąstymas ir netradiciniai požiūriai į uždarbį ir leidimą yra palankūs. Apsvarstykite etiškas investicijas, bendruomenine pagrįstą ekonomiką ar kūrybiškus pajamų srautus, atitinkančius jūsų pažangias vertybes.',
      },
      3: {
        en: 'Original, progressive ideas flow through your conversations and writing. Your unique perspective on shared concerns resonates widely. Challenge conventional thinking and share your vision for a better future.',
        lt: 'Originalios, pažangios idėjos teka per jūsų pokalbius ir rašymą. Jūsų unikali perspektyva bendriems klausimams plačiai rezonuoja. Meskite iššūkį tradiciniam mąstymui ir dalinkitės savo vizija geresnei ateičiai.',
      },
      4: {
        en: 'Your domestic life may benefit from technological upgrades, unconventional living arrangements, or simply breaking free from inherited patterns about what home and family should look like.',
        lt: 'Jūsų namų gyvenimas gali gauti naudos iš technologinių atnaujinimų, netradicinių gyvenimo susitarimų ar tiesiog išsilaisvinimo iš paveldėtų modelių apie tai, kaip turėtų atrodyti namai ir šeima.',
      },
      5: {
        en: 'Experimental, innovative, and technologically informed creative expression thrives. Push boundaries, collaborate across disciplines, and create art that challenges convention. The future of creativity flows through you.',
        lt: 'Eksperimentinė, inovatyvi ir technologijomis paremta kūrybinė raiška klesti. Stumkite ribas, bendradarbiaukite tarp disciplinų ir kurkite meną, metantį iššūkį konvencijai. Kūrybiškumo ateitis teka per jus.',
      },
      6: {
        en: 'Progressive and science-informed approaches to health and wellness appeal strongly. Question inherited health assumptions, explore cutting-edge research, and design routines that are as unique as you are.',
        lt: 'Pažangūs ir mokslu pagrįsti požiūriai į sveikatą ir gerovę stipriai patraukia. Kvestionuokite paveldėtas sveikatos prielaidas, tyrinėkite naujausius tyrimus ir kurkite rutinas, kurios yra tokios pat unikalios kaip jūs.',
      },
      7: {
        en: 'Freedom and intellectual connection are what you need most in partnerships. The most fulfilling relationships this season are those that respect individuality while sharing a commitment to mutual growth and a better world.',
        lt: 'Laisvė ir intelektualinis ryšys yra tai, ko labiausiai reikia partnerystėse. Labiausiai patenkinantys santykiai šį sezoną yra tie, kurie gerbia individualumą, dalijantis įsipareigojimu abipusiam augimui ir geresniam pasauliui.',
      },
      8: {
        en: 'Detaching from outdated psychological patterns becomes possible through intellectual clarity and the willingness to see yourself objectively. Sometimes the deepest change comes from simply deciding to think differently.',
        lt: 'Atsisiejimas nuo pasenusių psichologinių modelių tampa galimas per intelektualinį aiškumą ir norą pamatyti save objektyviai. Kartais giliausias pokytis ateina iš paprasto sprendimo mąstyti kitaip.',
      },
      9: {
        en: 'Futuristic thinking, scientific discovery, and progressive philosophy captivate your mind. Explore ideas that are ahead of their time — your capacity to see beyond the present moment is a genuine gift.',
        lt: 'Futuristinis mąstymas, moksliniai atradimai ir pažangi filosofija užburia jūsų protą. Tyrinėkite idėjas, kurios pralenkia laiką — jūsų gebėjimas matyti toliau nei dabartinė akimirka yra tikra dovana.',
      },
      10: {
        en: 'Innovation and visionary thinking set you apart professionally. Position yourself at the forefront of change in your field, propose unconventional solutions, and build a reputation as someone who sees what is coming next.',
        lt: 'Inovacija ir vizionieriškas mąstymas jus išskiria profesionaliai. Pozicionuokite save pokyčių priešakyje savo srityje, siūlykite netradicinius sprendimus ir kurkite reputaciją kaip žmogaus, kuris mato, kas ateina toliau.',
      },
      11: {
        en: 'This is your most powerful season for collective action and social vision. Organise, connect, and lead communities toward progressive change. Your ability to unite individuals around shared ideals is extraordinary.',
        lt: 'Tai jūsų galingiausias sezonas kolektyviniam veiksmui ir socialinei vizijai. Organizuokite, junkite ir vestikite bendruomenes pažangaus pokyčio link. Jūsų gebėjimas vienyti asmenis aplink bendrus idealus yra nepaprastas.',
      },
      12: {
        en: 'A humanitarian spirituality that connects inner growth with collective evolution resonates deeply. Meditation that expands consciousness beyond the personal self, or service-oriented practice, brings your spiritual life alive.',
        lt: 'Humanitarinis dvasingumas, jungiantis vidinį augimą su kolektyvine evoliucija, giliai rezonuoja. Meditacija, plečianti sąmonę už asmeninio savęs, ar tarnavimui orientuota praktika atgaivina jūsų dvasinį gyvenimą.',
      },
    },
  },
  pisces: {
    general: {
      en: 'The Sun in Pisces dissolves boundaries between the seen and unseen. Intuition is heightened, creativity flows freely, and compassion comes naturally. This is a season for dreaming, healing, and connecting to something greater than yourself. The final sign prepares the soul for rebirth.',
      lt: 'Saulė Žuvyse ištirpdo ribas tarp matomo ir nematomo. Intuicija sustiprėjusi, kūrybiškumas teka laisvai, ir užuojauta ateina natūraliai. Tai sezonas svajojimui, gijimui ir ryšiui su kažkuo didesniu nei jūs patys. Paskutinis ženklas ruošia sielą atgimimui.',
    },
    themeKeywords: {
      en: ['intuition', 'compassion', 'creativity', 'surrender'],
      lt: ['intuicija', 'užuojauta', 'kūrybiškumas', 'atsidavimas'],
    },
    personalByHouse: {
      1: {
        en: 'The Piscean Sun infuses your identity with heightened sensitivity and creative vision. Others may see you as more compassionate and intuitive than usual. Lean into this — your empathy is a strength.',
        lt: 'Žuvų Saulė pripildo jūsų tapatybę padidėjusiu jautrumu ir kūrybine vizija. Kiti gali jus matyti kaip labiau užjaučiantį ir intuityvų nei įprastai. Priimkite tai — jūsų empatija yra stiprybė.',
      },
      2: {
        en: 'Material concerns may feel less urgent as spiritual and emotional needs take priority. This is not the time for aggressive financial planning but for reflecting on what truly constitutes abundance in your life.',
        lt: 'Materialūs rūpesčiai gali jaustis mažiau neatidėliotini, dvasiniam ir emociniam poreikiams užimant pirmenybę. Tai ne laikas agresyviam finansiniam planavimui, o apmąstymui, kas tikrai sudaro gausą jūsų gyvenime.',
      },
      3: {
        en: 'Your words carry poetic resonance and emotional depth. Creative writing, compassionate conversations, and communication that comes from the heart rather than the head moves people deeply.',
        lt: 'Jūsų žodžiai neša poetinį rezonansą ir emocinę gelmę. Kūrybinis rašymas, užjaučiantys pokalbiai ir bendravimas, ateinantis iš širdies, o ne galvos, giliai paliečia žmones.',
      },
      4: {
        en: 'Your home becomes a sanctuary and a temple. Creating a dreamy, nurturing atmosphere — with art, music, soft lighting, and sacred objects — nourishes your emotional and spiritual wellbeing profoundly.',
        lt: 'Jūsų namai tampa šventove ir šventykla. Svajinga, puoselėjanti atmosferos kūrimas — su menu, muzika, švelnia šviesa ir šventais objektais — giliai maitina jūsų emocinę ir dvasinę gerovę.',
      },
      5: {
        en: 'Your creative expression deepens profoundly. Artistic projects, playful exploration, and romantic connections all carry a dreamlike, inspired quality. Follow what moves you emotionally — the muse is close.',
        lt: 'Jūsų kūrybinė raiška giliai pagilėja. Meniniai projektai, žaismingas tyrinėjimas ir romantiški ryšiai — visi neša svajonišką, įkvėptą kokybę. Sekite tuo, kas jus emociškai jaudina — mūza yra arti.',
      },
      6: {
        en: 'Sensitivity to your environment is heightened this season. Prioritise gentle, holistic approaches to health — water-based therapies, energy healing, adequate sleep, and avoiding substances or environments that overwhelm your system.',
        lt: 'Jautrumas aplinkai šį sezoną padidėjęs. Pirmenybę teikite švelniems, holistiniams požiūriams į sveikatą — vandens terapijoms, energiniam gijimui, pakankamam miegui ir aplinkų ar medžiagų, kurios perkrauna jūsų sistemą, vengimui.',
      },
      7: {
        en: 'Unconditional compassion and spiritual connection define your partnerships. You seek a soul-level bond rather than surface compatibility. Ensure that your empathy does not lead you to lose yourself in another person.',
        lt: 'Besąlyginė užuojauta ir dvasinis ryšys apibrėžia jūsų partnerystes. Ieškote sielos lygmens ryšio, o ne paviršutiniško suderinamumo. Užtikrinkite, kad jūsų empatija nevestų jūsų prarasti save kitame žmoguje.',
      },
      8: {
        en: 'Surrender is the pathway to your deepest transformation. Rather than fighting change, allow yourself to dissolve into it. The Piscean gift is knowing that what falls apart often reconstitutes into something more beautiful.',
        lt: 'Atsidavimas yra kelias į giliausią transformaciją. Užuot kovojote su pokyčiais, leiskite sau ištirpti juose. Žuvų dovana yra žinojimas, kad tai, kas subyrėjo, dažnai atsikuria į kažką gražesnio.',
      },
      9: {
        en: 'Mystical traditions, spiritual pilgrimage, and transcendent experiences call you beyond the ordinary. Travel to sacred places, study ancient wisdom, or simply follow the thread of your deepest spiritual longing.',
        lt: 'Mistinės tradicijos, dvasinis piligrimystė ir transcendentinės patirtys kviečia jus už įprasto. Keliaukite į šventas vietas, studijuokite senovės išmintį ar tiesiog sekite savo giliausio dvasinio ilgesio giją.',
      },
      10: {
        en: 'Creative, healing, and service-oriented professional paths are strongly illuminated. Your career thrives when it connects to something meaningful beyond personal advancement. Trust your intuition about professional direction.',
        lt: 'Kūrybinės, gydymo ir tarnavimui orientuotos profesinės kryptys yra stipriai nušviestos. Jūsų karjera klesti, kai ji jungiasi su kažkuo prasmingu už asmeninės pažangos. Pasitikėkite savo intuicija dėl profesinės krypties.',
      },
      11: {
        en: 'Communities centred on healing, spirituality, art, or compassionate service resonate most deeply. Your empathic presence and creative gifts uplift any group you choose to be part of.',
        lt: 'Bendruomenės, orientuotos į gijimą, dvasingumą, meną ar užjaučiantį tarnavimą, giliai rezonuoja. Jūsų empatiškas buvimas ir kūrybinės dovanos pakelia bet kurią grupę, kurioje nusprendžiate būti.',
      },
      12: {
        en: 'This is a potent time for your inner life. Meditation, journaling, and solitary reflection feel especially nourishing. You may have vivid dreams or unexpected spiritual insights. Trust what comes from the depths.',
        lt: 'Tai galingas laikas jūsų vidiniam gyvenimui. Meditacija, dienoraštis ir vienišas apmąstymas jaučiasi ypač maitinantis. Galite turėti ryškių sapnų ar netikėtų dvasinių įžvalgų. Pasitikėkite tuo, kas ateina iš gelmių.',
      },
    },
  },
}
