import type { CelestialBodyId } from '../../types'

export interface RetrogradeReading {
  general: { en: string; lt: string }
  practiceAdvice: { en: string; lt: string }
  personalByHouse: Record<number, { en: string; lt: string }>
}

export const RETROGRADE_READINGS: Record<CelestialBodyId, RetrogradeReading> = {
  sun: {
    general: {
      en: 'The Sun does not retrograde in the traditional sense. If you are seeing this, the data may reflect an unusual calculation. The Sun\'s energy remains a steady, forward-moving force of identity and vitality.',
      lt: 'Saul\u0117 neturi retrogradin\u0117s faz\u0117s tradicine prasme. Jei tai matote, duomenys gali atspind\u0117ti ne\u012Fprast\u0105 skai\u010Diavim\u0105. Saul\u0117s energija lieka stabili, pirmyn judanti tapatyb\u0117s ir gyvybingumo j\u0117ga.',
    },
    practiceAdvice: {
      en: 'Continue to align with your core purpose and trust the light within.',
      lt: 'Toliau derinkit\u0117s su savo pagrindiniu tikslu ir pasitik\u0117kite \u0161viesa savyje.',
    },
    personalByHouse: {},
  },
  moon: {
    general: {
      en: 'The Moon does not go retrograde. Its cycles are constant and reliable \u2014 waxing and waning in an unbroken rhythm. If this appears, it is a data artefact rather than a celestial event.',
      lt: 'M\u0117nulis neina retrogradiniu keliu. Jo ciklai yra pastov\u016Bs ir patikimi \u2014 augantys ir ma\u017E\u0117jantys nepertraukiamu ritmu. Jei tai pasirodo, tai duomen\u0173 artefaktas, o ne dangaus \u012Fvykis.',
    },
    practiceAdvice: {
      en: 'Honour the Moon\'s natural cycle of growth and release.',
      lt: 'Gerbkite nat\u016Bral\u0173 M\u0117nulio augimo ir paleidimo cikl\u0105.',
    },
    personalByHouse: {},
  },
  mercury: {
    general: {
      en: 'Mercury retrograde is the most well-known and frequently occurring of all retrogrades, happening roughly three times per year. Communication, technology, and travel plans are prone to disruption. Misunderstandings, lost messages, and mechanical glitches are common themes. However, this is also a profoundly useful period for review \u2014 re-reading, re-thinking, and re-connecting with people and ideas from the past.',
      lt: 'Merkurijaus retrogradas yra geriausiai \u017Einomas ir da\u017Eniausiai pasitaikantis i\u0161 vis\u0173 retrograd\u0173, vykstantis ma\u017Edaug tris kartus per metus. Bendravimas, technologijos ir kelioni\u0173 planai yra link\u0119 \u012F sutrikimus. Nesusipratimai, prarastos \u017Einut\u0117s ir mechaniniai gedimai yra da\u017Enos temos. Ta\u010Diau tai taip pat yra giliai naudingas laikotarpis per\u017Ei\u016Brai \u2014 perskaityti, perm\u0105styti ir i\u0161 naujo susisiekti su \u017Emon\u0117mis ir id\u0117jomis i\u0161 praeities.',
    },
    practiceAdvice: {
      en: 'Double-check all messages before sending, back up digital files, and avoid signing important contracts unless necessary. Revisit old projects or reconnect with people you have lost touch with.',
      lt: 'Dar kart\u0105 patikrinkite visas \u017Einutes prie\u0161 si\u0173sdami, sukurkite atsargines skaitmenini\u0173 fail\u0173 kopijas ir venkite pasira\u0161yti svarbias sutartis, nebent b\u016Btina. Per\u017Ei\u016Br\u0117kite senus projektus arba atkurkite ry\u0161\u012F su \u017Emon\u0117mis, su kuriais praradote kontakt\u0105.',
    },
    personalByHouse: {
      1: {
        en: 'Identity confusion or reconsideration of how you present yourself to the world is likely. Old self-images may resurface for review. Give yourself permission to not have all the answers about who you are right now.',
        lt: 'Tapatyb\u0117s sumai\u0161tis ar sav\u0119s pateikimo pasauliui persvarstymas yra tik\u0117tini. Seni sav\u0119s vaizd\u017Eiai gali i\u0161kilt per\u017Ei\u016Brai. Leiskite sau netur\u0117ti vis\u0173 atsakym\u0173 apie tai, kas esate dabar.',
      },
      2: {
        en: 'Financial miscommunications or unexpected expenses may arise. Double-check bank statements, review subscriptions, and avoid making major financial commitments until Mercury moves direct. Past money decisions may need revisiting.',
        lt: 'Finansiniai nesusipratimai ar netik\u0117tos i\u0161laidos gali kilti. Patikrinkite banko ataskaitas, per\u017Ei\u016Br\u0117kite prenumeratas ir venkite dideli\u0173 finansini\u0173 \u012Fsipareigojim\u0173, kol Merkurijus jud\u0117s tiesiai. Praeities finansiniai sprendimai gali reikalauti persvarstymo.',
      },
      3: {
        en: 'Mercury retrograde hits especially close to home for you \u2014 miscommunications with siblings, neighbours, or in daily exchanges are likely. Re-read messages before sending. Old conversations may resurface for resolution.',
        lt: 'Merkurijaus retrogradas ypa\u010D stipriai palie\u010Dia jus \u2014 nesusipratimai su broliais, seserimis, kaimynais ar kasdieniuose santykiuose yra tik\u0117tini. Perskaitykite \u017Einutes prie\u0161 si\u0173sdami. Seni pokalbiai gali i\u0161kilt sprendimui.',
      },
      4: {
        en: 'Household appliances may malfunction and family miscommunications increase. Old memories or unresolved family issues may surface. Use this time to reconnect with your roots and address domestic matters patiently.',
        lt: 'Nam\u0173 prietaisai gali sugesti ir \u0161eimos nesusipratimai padaug\u0117ja. Seni prisiminimai ar nei\u0161spr\u0119stos \u0161eimos problemos gali i\u0161kilti. Naudokite \u0161\u012F laik\u0105 atkurti ry\u0161\u012F su savo \u0161aknimis ir kantriai spr\u0119sti nam\u0173 reikalus.',
      },
      5: {
        en: 'Creative projects may stall or need significant revision. Rather than pushing forward, revisit earlier drafts and abandoned ideas \u2014 there may be gold in what you set aside. Past romantic connections may also reappear.',
        lt: 'K\u016Brybiniai projektai gali strigti ar reikalauti reik\u0161mingo per\u017Ei\u016Br\u0117jimo. U\u017Euot st\u016Bm\u0119 pirmyn, gr\u012F\u017Ekite prie ankstesni\u0173 juodra\u0161\u010Di\u0173 ir atmest\u0173 id\u0117j\u0173 \u2014 gali b\u016Bti aukso tame, k\u0105 atid\u0117jote. Seni romanti\u0161ki ry\u0161iai taip pat gali pasirodyti.',
      },
      6: {
        en: 'Your daily routines may feel disrupted and old health concerns could flare up briefly. Take it as a prompt to revisit wellness habits you have neglected. Slow down at work and double-check details.',
        lt: 'J\u016Bs\u0173 kasdienos rutinos gali jaustis sutrikdytos ir senos sveikatos problemos gali trumpam suaktyv\u0117ti. Priimkite tai kaip raginim\u0105 per\u017Ei\u016Br\u0117ti sveikatingumo \u012Fpro\u010Dius, kuriuos apleidote. Sul\u0117tinkite darbe ir patikrinkite detales.',
      },
      7: {
        en: 'Miscommunications with partners and close collaborators are especially likely. Assumptions that seemed clear may prove otherwise. Practise patience, ask clarifying questions, and avoid making binding agreements.',
        lt: 'Nesusipratimai su partneriais ir artimais bendradarbiais yra ypa\u010D tik\u0117tini. Prielaidos, kurios atrod\u0117 ai\u0161kios, gali pasitvirtinti kitaip. Praktikuokite kantryb\u0119, klauskite patikslinan\u010Dius klausimus ir venkite \u012Fpareigojan\u010Di\u0173 susitarim\u0173.',
      },
      8: {
        en: 'Hidden information or unresolved matters about shared resources, debts, or deep emotional patterns may resurface. Review joint finances carefully and allow old psychological material to surface for healing.',
        lt: 'Pasl\u0117pta informacija ar nei\u0161spr\u0119sti reikalai d\u0117l bendr\u0173 i\u0161tekli\u0173, skol\u0173 ar gili\u0173 emocini\u0173 modeli\u0173 gali i\u0161kilt. Atid\u017Eiai per\u017Ei\u016Br\u0117kite bendrus finansus ir leiskite senai psichologinei med\u017Eiagai i\u0161kilt gijimui.',
      },
      9: {
        en: 'Travel plans may be disrupted or delayed. Registrations, bookings, and academic submissions need extra scrutiny. Use this time to revisit earlier studies or reconsider your philosophical positions rather than pushing into new territory.',
        lt: 'Kelioni\u0173 planai gali b\u016Bti sutrikdyti ar atid\u0117ti. Registracijos, u\u017Esakymai ir akademiniai pateikimai reikalauja papildomo kruop\u0161tumo. Naudokite \u0161\u012F laik\u0105 per\u017Ei\u016Br\u0117ti ankstesnius mokymosi darbus ar persvarstyti savo filosofines pozicijas, o ne stumtis \u012F nauj\u0105 teritorij\u0105.',
      },
      10: {
        en: 'Professional communications need extra care. Double-check emails to superiors, review contracts thoroughly, and avoid launching major career initiatives until Mercury goes direct. Past professional connections may prove valuable.',
        lt: 'Profesinis bendravimas reikalauja papildomo r\u016Bpes\u010Dio. Patikrinkite lai\u0161kus vadovams, kruop\u0161\u010Diai per\u017Ei\u016Br\u0117kite sutartis ir venkite dideli\u0173 karjeros iniciatyv\u0173, kol Merkurijus jud\u0117s tiesiai. Praeities profesiniai ry\u0161iai gali pasirodyti vertingi.',
      },
      11: {
        en: 'Group communications and social plans are prone to confusion. Confirm arrangements twice, be patient with miscommunications among friends, and use this time to reconnect with people from your past social circles.',
        lt: 'Grupinis bendravimas ir socialiniai planai yra link\u0119 \u012F painiav\u0105. Patvirtinkite susitarimus du kartus, b\u016Bkite kantr\u016Bs su nesusipratimais tarp draug\u0173 ir naudokite \u0161\u012F laik\u0105 atkurti ry\u0161\u012F su \u017Emon\u0117mis i\u0161 praeities socialini\u0173 rat\u0173.',
      },
      12: {
        en: 'Your inner dialogue becomes confused or circular. Rather than forcing mental clarity, allow the mental fog \u2014 it may be clearing space for deeper intuition. Dreams and subconscious messages deserve extra attention now.',
        lt: 'J\u016Bs\u0173 vidinis dialogas tampa supainiotu ar cikli\u0161ku. U\u017Euot versdami protin\u012F ai\u0161kum\u0105, leiskite protiniam r\u016Bkui \u2014 jis gali valyti erdv\u0119 gilesnei intuicijai. Sapnai ir pas\u0105monin\u0117s \u017Einut\u0117s nusipelno papildomo d\u0117mesio dabar.',
      },
    },
  },
  venus: {
    general: {
      en: 'Venus retrograde turns attention inward on matters of love, beauty, and value. Relationships from the past may resurface, and your sense of what \u2014 and who \u2014 you truly value may shift. This is a period of romantic and financial re-evaluation, not a time for impulsive purchases or new relationships.',
      lt: 'Veneros retrogradas nukreipia d\u0117mes\u012F \u012F vid\u0173 meil\u0117s, gro\u017Eio ir vert\u0117s klausimais. Santykiai i\u0161 praeities gali i\u0161kilt, ir j\u016Bs\u0173 to, k\u0105 \u2014 ir k\u0105 \u2014 tikrai vertinate, poj\u016Btis gali pasikeisti. Tai romanti\u0161kas ir finansinis pervertinimo laikotarpis, ne laikas impulsyviems pirkiniams ar naujiems santykiams.',
    },
    practiceAdvice: {
      en: 'Reflect on what brings you genuine pleasure and connection. Avoid dramatic changes to your appearance or large financial commitments.',
      lt: 'Apm\u0105stykite, kas jums suteikia tikr\u0105 malonum\u0105 ir ry\u0161\u012F. Venkite dramati\u0161k\u0173 savo i\u0161vaizdos pakeitim\u0173 ar dideli\u0173 finansini\u0173 \u012Fsipareigojim\u0173.',
    },
    personalByHouse: {
      1: {
        en: 'Your sense of attractiveness, personal style, and how you present yourself to the world comes under review. Old insecurities may surface, but so might a more authentic understanding of your beauty and worth.',
        lt: 'J\u016Bs\u0173 patrauklumo, asmeninio stiliaus ir sav\u0119s pateikimo pasauliui poj\u016Btis per\u017Ei\u016Brimas. Senos nesaugumo formos gali i\u0161kilt, bet taip pat gali atsirasti autenti\u0161kesnis j\u016Bs\u0173 gro\u017Eio ir vert\u0117s supratimas.',
      },
      2: {
        en: 'Financial values and spending habits undergo re-evaluation. Purchases made now may later feel regrettable. Focus on understanding what you truly value rather than acquiring new things.',
        lt: 'Finansin\u0117s vertyb\u0117s ir leidimo \u012Fpro\u010Diai yra pervertinami. Dabar padaryti pirkiniai v\u0117liau gali atrodyti apgailestauti. Sukoncentruokite d\u0117mes\u012F \u012F supratim\u0105, k\u0105 tikrai vertinate, o ne \u012F nauj\u0173 dalyku \u012Fsigijim\u0105.',
      },
      3: {
        en: 'The way you express affection and create harmony in daily interactions comes under review. You may reconsider how you communicate in relationships and discover more authentic ways of connecting.',
        lt: 'B\u016Bdas, kuriuo rei\u0161kiate meil\u0119 ir kuriate harmonij\u0105 kasdieniuose santykiuose, yra per\u017Ei\u016Brimas. Galite persvarstyti, kaip bendraujate santykiuose, ir atrasti autenti\u0161kesnius b\u016Bdus jungtis.',
      },
      4: {
        en: 'Old feelings about family love, childhood nurturing, and emotional safety surface for reconsideration. Redecorating or making major changes to your home is best postponed, but reflecting on what home truly means to you is valuable.',
        lt: 'Seni jausmai apie \u0161eimos meil\u0119, vaikyst\u0117s puosel\u0117jim\u0105 ir emocin\u012F saugum\u0105 i\u0161kyla persvarstymui. Remont\u0105 ar didelius nam\u0173 poky\u010Dius geriau atid\u0117ti, bet apm\u0105stymas, k\u0105 namai tikrai rei\u0161kia jums, yra vertingas.',
      },
      5: {
        en: 'Creative confidence may waver and romantic nostalgia intensifies. Past lovers or abandoned creative projects call for your attention. Revisiting what once brought you joy may reveal something worth reclaiming.',
        lt: 'K\u016Brybinis pasitik\u0117jimas gali svyruoti ir romanti\u0161ka nostalgija sustipreja. Praeities meil\u0173\u017Eiai ar apleisti k\u016Brybiniai projektai kvie\u010Dia j\u016Bs\u0173 d\u0117mesio. Per\u017Ei\u016Br\u0117jimas, kas ka\u017Ekada jums teik\u0117 d\u017Eiaug-sm\u0105, gali atskleisti ka\u017Ek\u0105 verta atgauti.',
      },
      6: {
        en: 'Your relationship with self-care and daily pleasure needs reassessment. Are you nurturing yourself genuinely or merely going through the motions? Revisit beauty and wellness routines with fresh eyes.',
        lt: 'J\u016Bs\u0173 santykis su savitvarka ir kasdieniu malonumu reikalauja per\u017Ei\u016Bros. Ar tikrai puosel\u0117jate save, ar tik atliekate veiksmus? Per\u017Ei\u016Br\u0117kite gro\u017Eio ir sveikatingumo rutinas \u0161vie\u017Eiomis akimis.',
      },
      7: {
        en: 'Partnerships undergo their most significant re-evaluation. Relationship patterns, expectations, and the balance of giving and receiving all demand honest examination. Old partners may reappear, bearing unfinished lessons.',
        lt: 'Partneryst\u0117s i\u0161gyvena reik\u0161mingiaus\u012F pervertinim\u0105. Santyki\u0173 modeliai, l\u016Bkes\u010Diai ir davimo ir pri\u0117mimo pusiausvyra \u2014 visa tai reikalauja s\u0105\u017Einingo patikrinimo. Seni partneriai gali pasirodyti su nebaigtosiomis pamokomis.',
      },
      8: {
        en: 'Deep reassessment of intimacy, shared resources, and emotional vulnerability unfolds. What you once found attractive about merging with another may need recalibrating. Financial arrangements with others also warrant review.',
        lt: 'Gilus intymumo, bendr\u0173 i\u0161tekli\u0173 ir emocinio pa\u017Eid\u017Eiamumo pervertinimas vyksta. Tai, kas ka\u017Ekada jus trauk\u0117 susiliejime su kitu, gali reikalauti perkalibrimo. Finansiniai susitarimai su kitais taip pat verti per\u017Ei\u016Bros.',
      },
      9: {
        en: 'Your aesthetic sensibilities and cultural values expand through revisiting previous experiences. A place you visited before may reveal new beauty, or an old philosophical framework may offer fresh wisdom about love and values.',
        lt: 'J\u016Bs\u0173 estetiniai jautrumai ir kult\u016Brin\u0117s vertyb\u0117s ple\u010Diasi per\u017Ei\u016Brint ankstesnes patirtis. Vieta, kuri\u0105 lank\u0117te anks\u010Diau, gali atskleisti nauj\u0105 gro\u017E\u012F, arba sena filosofin\u0117 sistema gali pasi\u016Blyti \u0161vie\u017Ei\u0105 i\u0161mint\u012F apie meil\u0119 ir vertybes.',
      },
      10: {
        en: 'Professional relationships and your public image in matters of diplomacy, art, or collaboration need careful tending. Avoid major changes to your professional appearance or brand until Venus moves direct.',
        lt: 'Profesiniai santykiai ir j\u016Bs\u0173 vie\u0161asis \u012Fvaizdis diplomatijos, meno ar bendradarbiavimo klausimais reikalauja kruop\u0161taus d\u0117mesio. Venkite dideli\u0173 profesin\u0117s i\u0161vaizdos ar prek\u0117s \u017Eenklo poky\u010Di\u0173, kol Venera jud\u0117s tiesiai.',
      },
      11: {
        en: 'Friendships and social allegiances undergo quiet reassessment. You may drift away from some groups and reconnect with others. Allow your social values to evolve without forcing decisions about who belongs in your life.',
        lt: 'Draugyst\u0117s ir socialiniai aljansai tyliai pervertinami. Galite nutolti nuo kai kuri\u0173 grupi\u0173 ir i\u0161 naujo susisiekti su kitomis. Leiskite savo socialin\u0117ms vertyb\u0117ms evoliucionuoti, neverskdami sprendim\u0173, kas priklauso j\u016Bs\u0173 gyvenimui.',
      },
      12: {
        en: 'Hidden desires, secret attractions, and unprocessed grief about love surface from your subconscious. This is a powerful time for healing old romantic wounds through reflection, therapy, or compassionate self-examination.',
        lt: 'Pasl\u0117pti troškimai, slapti traukimai ir neapdorotas sielvartas d\u0117l meil\u0117s i\u0161kyla i\u0161 j\u016Bs\u0173 pas\u0105mon\u0117s. Tai galingas laikas gydyti senas romantines \u017Eaizdas per apm\u0105stym\u0105, terapij\u0105 ar u\u017Ejau\u010Diant\u012F savianalizę.',
      },
    },
  },
  mars: {
    general: {
      en: 'Mars retrograde slows the drive and redirects energy inward. Projects may stall, motivation can feel elusive, and frustration may build without a clear outlet. This is a time to reconsider how you use your energy and what battles are truly worth fighting.',
      lt: 'Marso retrogradas sul\u0117tina varom\u0105j\u0105 j\u0117g\u0105 ir nukreipia energij\u0105 \u012F vid\u0173. Projektai gali strigti, motyvacija gali jaustis sunkiai pasiekiama, ir nusivylimas gali kauptis be ai\u0161kaus i\u0161eities. Tai laikas persvarstyti, kaip naudojate savo energij\u0105 ir kokios kovos tikrai vertos.',
    },
    practiceAdvice: {
      en: 'Channel physical energy into gentle, mindful practices. Avoid initiating conflicts or starting major new ventures.',
      lt: 'Nukreipkite fizin\u0119 energij\u0105 \u012F \u0161velnius, s\u0105moningus pratimus. Venkite inicijuoti konfliktus ar prad\u0117ti didelius naujus projektus.',
    },
    personalByHouse: {
      1: {
        en: 'Your personal drive and assertiveness turn inward. Physical energy may dip, and the usual confidence in taking action may waver. This is a time to reconsider how you assert yourself rather than pushing forward blindly.',
        lt: 'J\u016Bs\u0173 asmeninis variklis ir asertyvumas pasisuka \u012F vid\u0173. Fizin\u0117 energija gali suma\u017E\u0117ti, ir \u012Fprastas pasitik\u0117jimas imdamasis veiksm\u0173 gali svyruoti. Tai laikas persvarstyti, kaip save tvirtinate, o ne aklai stumti pirmyn.',
      },
      2: {
        en: 'Financial aggression or impulsive spending may backfire. Slow down your pursuit of money and material goals. Reflect on whether your current financial strategies truly serve your long-term security.',
        lt: 'Finansinis agresyvumas ar impulsyvus leidimas gali atsisukti prie\u0161 jus. Sul\u0117tinkite savo pinig\u0173 ir materialini\u0173 tiksl\u0173 siekim\u0105. Apm\u0105stykite, ar j\u016Bs\u0173 dabartin\u0117s finansin\u0117s strategijos tikrai tarnauja ilgalaikiam saugumui.',
      },
      3: {
        en: 'Arguments and verbal confrontations are more likely to escalate during this period. Think before speaking harshly, and avoid sending angry messages. Old conflicts with siblings or neighbours may resurface for resolution.',
        lt: 'Gin\u010Dai ir \u017Eodiniai konfliktai labiau link\u0119 eskaluoti \u0161iuo laikotarpiu. Pagalvokite prie\u0161 kalb\u0117dami grie\u017Etai ir venkite si\u0173sti pikt\u0173 \u017Einu\u010Di\u0173. Seni konfliktai su broliais, seserimis ar kaimynais gali i\u0161kilt sprendimui.',
      },
      4: {
        en: 'Frustration within your domestic environment may simmer. Home renovation projects may face delays. Channel the restless energy into reflecting on what changes your home and family life truly need.',
        lt: 'Nusivylimas nam\u0173 aplinkoje gali kunkuliuoti. Nam\u0173 renovacijos projektai gali susidurti su v\u0117lavimais. Nukreipkite nerami\u0105 energij\u0105 \u012F apm\u0105stym\u0105, koki\u0173 poky\u010Di\u0173 j\u016Bs\u0173 nam\u0173 ir \u0161eimos gyvenimas tikrai reikia.',
      },
      5: {
        en: 'Creative projects may lose momentum or feel forced. Rather than pushing through, step back and reconnect with what genuinely inspires you. Past creative endeavours or old romantic passions may call for completion.',
        lt: 'K\u016Brybiniai projektai gali prarasti pagreit\u012F ar jaustis priversti. U\u017Euot st\u016Bm\u0119 per j\u0117g\u0105, atsitraukite ir atkurkite ry\u0161\u012F su tuo, kas tikrai jus \u012Fkvepia. Praeities k\u016Brybiniai darbai ar senos romanti\u0161kos aistros gali kviesti u\u017Ebaigimo.',
      },
      6: {
        en: 'Physical energy fluctuates and pushing too hard during exercise risks strain or injury. Modify your fitness routine to be gentler, and attend to any health issues you have been powering through rather than addressing.',
        lt: 'Fizin\u0117 energija svyruoja ir per didelis kr\u016Bvis treniruo\u010Di\u0173 metu rizikuoja sukelti \u012Ftempim\u0105 ar traum\u0105. Modifikuokite savo sporto rutin\u0105, kad b\u016Bt\u0173 \u0161velnesn\u0117, ir r\u016Bpinkit\u0117s sveikatos problemomis, kurias sprend\u0117te j\u0117ga, o ne d\u0117mesiu.',
      },
      7: {
        en: 'Unresolved anger or frustration in partnerships surfaces. Past conflicts that were never fully resolved may demand attention. Avoid starting new confrontations and instead work through old resentments with patience.',
        lt: 'Nei\u0161spr\u0119stas pyktis ar nusivylimas partneryst\u0117se i\u0161kyla. Praeities konfliktai, kurie niekada nebuvo visi\u0161kai i\u0161spr\u0119sti, gali reikalauti d\u0117mesio. Venkite prad\u0117ti nauj\u0173 konfrontacij\u0173 ir vietoj to dirbkite su senomis nuoskaudomis kantriai.',
      },
      8: {
        en: 'Deep, primal energy redirects inward, stirring repressed anger, desire, or power dynamics. This can be uncomfortable but deeply healing if you allow the feelings rather than acting them out destructively.',
        lt: 'Gili, pirmin\u0117 energija nukreipiama \u012F vid\u0173, sujudindama nuslopint\u0105 pykt\u012F, tro\u0161kim\u0105 ar galios dinamikas. Tai gali b\u016Bti nepatogu, bet giliai gydanti, jei leisite jausmams, o ne juos destruktyviai realizuosite.',
      },
      9: {
        en: 'Travel plans may encounter obstacles or delays. Legal matters proceed slowly. Use this time to reconsider your beliefs about what is worth fighting for and redirect your passionate energy toward inner growth.',
        lt: 'Kelioni\u0173 planai gali susidurti su kli\u016Btimis ar v\u0117lavimais. Teisiniai reikalai juda l\u0117tai. Naudokite \u0161\u012F laik\u0105 persvarstyti savo \u012Fsitikinimus apie tai, u\u017E k\u0105 verta kovoti, ir nukreipti savo aistring\u0105 energij\u0105 \u012F vidin\u012F augim\u0105.',
      },
      10: {
        en: 'Professional ambition may feel thwarted or misdirected. Avoid forcing career moves or engaging in workplace power struggles. Instead, reassess your long-term professional goals and how you pursue them.',
        lt: 'Profesin\u0117 ambicija gali jaustis trukdoma ar nukreipta netinkama kryptimi. Venkite versti karjeros \u017Eingsnius ar \u012Fsitraukti \u012F darbo vietos galios kovas. Vietoj to i\u0161 naujo \u012Fvertinkite savo ilgalaikius profesinius tikslus ir tai, kaip juos siekiate.',
      },
      11: {
        en: 'Conflicts within groups or frustrations with collective progress surface. Rather than fighting against the slowdown, use it to reconsider which causes and communities truly deserve your energy and commitment.',
        lt: 'Konfliktai grup\u0117se ar nusivylimas kolektyviniu progresu i\u0161kyla. U\u017Euot kovojote prie\u0161 sul\u0117t\u0117jim\u0105, naudokite j\u012F persvarstyti, kurios bylai ir bendruomen\u0117s tikrai nusipelno j\u016Bs\u0173 energijos ir \u012Fsipareigojimo.',
      },
      12: {
        en: 'Anger, desire, and competitive energy that normally drives you outward turns inward. This can feel unsettling, but it offers a rare opportunity to confront your shadow warrior \u2014 the part of you that fights from fear.',
        lt: 'Pyktis, tro\u0161kimas ir konkurencin\u0117 energija, kuri paprastai varo jus \u012F lauk\u0105, pasisuka \u012F vid\u0173. Tai gali jaustis nerim\u0105 kelianti, bet si\u016Blo ret\u0105 galimyb\u0119 susidurti su savo \u0161e\u0161\u0117liu kariu \u2014 ta j\u016Bs\u0173 dalimi, kuri kovoja i\u0161 baim\u0117s.',
      },
    },
  },
  jupiter: {
    general: {
      en: 'Jupiter retrograde invites you to look inward for growth rather than outward. Expansion turns philosophical \u2014 this is a period for deepening your beliefs, revisiting your vision for the future, and finding abundance in what you already have rather than seeking more.',
      lt: 'Jupiterio retrogradas kvie\u010Dia jus ie\u0161koti augimo viduje, o ne i\u0161or\u0117je. Pl\u0117tra tampa filosofine \u2014 tai laikotarpis gilinti savo \u012Fsitikinimus, per\u017Ei\u016Br\u0117ti ateities vizij\u0105 ir rasti gaus\u0105 tame, k\u0105 jau turite, o ne ie\u0161koti daugiau.',
    },
    practiceAdvice: {
      en: 'Journal about your long-term goals and question whether your current path truly aligns with your values.',
      lt: 'Ra\u0161ykite dienora\u0161t\u012F apie savo ilgalaikius tikslus ir klauskite, ar j\u016Bs\u0173 dabartinis kelias tikrai atitinka j\u016Bs\u0173 vertybes.',
    },
    personalByHouse: {
      1: {
        en: 'Your personal philosophy and sense of optimism turn inward for reflection. Rather than projecting confidence outward, explore whether your beliefs about yourself are genuinely expansive or merely comfortable.',
        lt: 'J\u016Bs\u0173 asmenin\u0117 filosofija ir optimizmo poj\u016Btis pasisuka \u012F vid\u0173 apm\u0105stymui. U\u017Euot projektuodami pasitik\u0117jim\u0105 \u012F lauk\u0105, tyrin\u0117kite, ar j\u016Bs\u0173 \u012Fsitikinimai apie save yra tikrai ple\u010Diantys ar tiesiog patog\u016Bs.',
      },
      2: {
        en: 'Financial growth may slow, but inner wealth deepens. Reconsider what abundance truly means to you beyond material accumulation. This is a time for gratitude and wise stewardship rather than aggressive expansion.',
        lt: 'Finansinis augimas gali sul\u0117t\u0117ti, bet vidin\u0117 gerov\u0117 gil\u0117ja. Persvarstykite, k\u0105 gausyb\u0117 tikrai rei\u0161kia jums, o ne materialin\u012F kaupim\u0105. Tai laikas d\u0117kingumui ir i\u0161mintingam valdymui, o ne agresyviai pl\u0117trai.',
      },
      3: {
        en: 'Your capacity for inspiring communication turns reflective. Revisit earlier teachings, reconsider strong opinions, and allow your intellectual life to deepen through quiet study rather than outward proclamation.',
        lt: 'J\u016Bs\u0173 geb\u0117jimas \u012Fkv\u0117pti bendravimu pasisuka apm\u0105stymui. Per\u017Ei\u016Br\u0117kite ankstesnius mokymus, apsvarstykite tvirtus \u012Fsitikinimus ir leiskite savo intelektualiniam gyvenimui gil\u0117ti per tyl\u0173 studijavim\u0105, o ne i\u0161orin\u0119 proklamacij\u0105.',
      },
      4: {
        en: 'Growth and expansion in your home life slow down, offering time to appreciate what you already have. Reflect on family blessings, cherish your roots, and find abundance in the simple comfort of belonging.',
        lt: 'Augimas ir pl\u0117tra nam\u0173 gyvenime sul\u0117t\u0117ja, si\u016Blydami laiko vertinti tai, k\u0105 jau turite. Apm\u0105stykite \u0161eimos palaiminimus, branginkite savo \u0161aknis ir raskite gaus\u0105 paprastame priklausymo komforte.',
      },
      5: {
        en: 'Creative abundance turns inward \u2014 rather than producing new work, you may need to revisit and deepen what already exists. Romantic idealism also benefits from honest reassessment. What genuinely brings you joy?',
        lt: 'K\u016Brybin\u0117 gausa pasisuka \u012F vid\u0173 \u2014 u\u017Euot k\u016Br\u0119 naujus darbus, gali reik\u0117ti per\u017Ei\u016Br\u0117ti ir pagilinti tai, kas jau egzistuoja. Romanti\u0161kas idealizmas taip pat gauna naudos i\u0161 s\u0105\u017Einingo pervertinimo. Kas tikrai jums teikia d\u017Eiaug-sm\u0105?',
      },
      6: {
        en: 'Health expansion through new diets, fitness programmes, or wellness trends may stall. Use this time to assess which practices truly serve your body rather than following trends. Quality of routine matters more than quantity.',
        lt: 'Sveikatos pl\u0117tra per naujas dietas, sporto programas ar sveikatingumo tendencijas gali strigti. Naudokite \u0161\u012F laik\u0105 \u012Fvertinti, kurios praktikos tikrai tarnauja j\u016Bs\u0173 k\u016Bnui, o ne sekti tendencijas. Rutinos kokyb\u0117 svarbesn\u0117 nei kiekyb\u0117.',
      },
      7: {
        en: 'The desire for growth within partnerships turns inward. Rather than seeking new connections or expanding existing ones outward, deepen your understanding of what makes your closest relationships genuinely fulfilling.',
        lt: 'Augimo tro\u0161kimas partneryst\u0117se pasisuka \u012F vid\u0173. U\u017Euot ie\u0161kodami nauj\u0173 ry\u0161i\u0173 ar pl\u0117sdami esamus \u012F lauk\u0105, gilinkite savo supratim\u0105, kas daro j\u016Bs\u0173 artim\u0105usius santykius tikrai pilnaver\u010Diais.',
      },
      8: {
        en: 'Deep inner growth replaces external expansion. Questions about shared resources, inheritance, and psychological depth become more reflective. Trust that the wisdom gained during this period will bear fruit later.',
        lt: 'Gilus vidinis augimas pakei\u010Dia i\u0161orin\u0119 pl\u0117tr\u0105. Klausimai apie bendrus i\u0161teklius, paveld\u0105 ir psichologin\u0119 gelm\u0119 tampa labiau apm\u0105stomi. Pasitik\u0117kite, kad \u0161iuo laikotarpiu surinkta i\u0161mintis duos vaisi\u0173 v\u0117liau.',
      },
      9: {
        en: 'Your philosophical and spiritual life deepens through reflection rather than outward seeking. Revisit wisdom traditions you have explored before, reread transformative books, and allow your worldview to mature quietly.',
        lt: 'J\u016Bs\u0173 filosofinis ir dvasinis gyvenimas gil\u0117ja per apm\u0105stym\u0105, o ne per i\u0161orin\u0119 paie\u0161k\u0105. Per\u017Ei\u016Br\u0117kite anks\u010Diau tyrin\u0117tas i\u0161minties tradicijas, perskaitykite transformuojan\u010Dias knygas ir leiskite savo pasaul\u0117\u017Ei\u016Brai tyliai br\u0119sti.',
      },
      10: {
        en: 'Professional expansion slows, offering time to reassess your career trajectory. Is your current path truly aligned with your deeper values and long-term vision? This reflection prevents you from growing in the wrong direction.',
        lt: 'Profesin\u0117 pl\u0117tra sul\u0117t\u0117ja, si\u016Blydama laiko pervertinti karjeros trajektorij\u0105. Ar j\u016Bs\u0173 dabartinis kelias tikrai atitinka j\u016Bs\u0173 gilesnes vertybes ir ilgalaik\u0119 vizij\u0105? \u0160is apm\u0105stymas neleid\u017Eia jums augti neteisinga kryptimi.',
      },
      11: {
        en: 'Your role within communities and social causes may shift as you reconsider which groups and visions truly align with your evolving beliefs. Quality of connection matters more than breadth of influence right now.',
        lt: 'J\u016Bs\u0173 vaidmuo bendruomen\u0117se ir socialin\u0117se bylose gali pasikeisti, kai i\u0161 naujo apsvarstote, kurios grup\u0117s ir vizijos tikrai atitinka j\u016Bs\u0173 besivy\u0161tan\u010Dius \u012Fsitikinimus. Ry\u0161io kokyb\u0117 svarbesn\u0117 nei \u012Ftakos plotis dabar.',
      },
      12: {
        en: 'Spiritual growth turns profoundly inward. This is one of the most powerful periods for genuine inner expansion \u2014 meditation, contemplation, and the courage to question your deepest beliefs lead to authentic wisdom.',
        lt: 'Dvasinis augimas pasisuka giliai \u012F vid\u0173. Tai vienas galingiaus\u0173 laikotarpi\u0173 tikram vidiniam pl\u0117timuisi \u2014 meditacija, apm\u0105stymas ir dr\u0105sa kvestionuoti savo giliausius \u012Fsitikinimus veda prie autenti\u0161kos i\u0161minties.',
      },
    },
  },
  saturn: {
    general: {
      en: 'Saturn retrograde softens the taskmaster\'s grip and invites a re-examination of the structures, rules, and responsibilities that govern your life. Boundaries that felt rigid may loosen, and lessons you thought you had learned may return for deeper integration.',
      lt: 'Saturno retrogradas su\u0161velnina grie\u017Etojo mokytojo gniauž-tus ir kvie\u010Dia i\u0161 naujo i\u0161tirti strukt\u016Bras, taisykles ir atsakomybes, valdan\u010Dias j\u016Bs\u0173 gyvenim\u0105. Ribos, kurios atrod\u0117 kietos, gali atsilaisvinti, ir pamokos, kurias man\u0117te i\u0161mok\u0119, gali gr\u012F\u017Eti gilesnei integracijai.',
    },
    practiceAdvice: {
      en: 'Review your commitments and boundaries. Release obligations that no longer serve your growth and reinforce those that do.',
      lt: 'Per\u017Ei\u016Br\u0117kite savo \u012Fsipareigojimus ir ribas. Atsisakykite pareig\u0173, kurios nebetarnauja j\u016Bs\u0173 augimui, ir sustiprin\u200Bkite tas, kurios tarnauja.',
    },
    personalByHouse: {
      1: {
        en: 'The structures of your identity and how you present yourself to the world come under review. Old responsibilities or self-imposed limitations may feel heavier. Reassess which rules serve your growth and which merely constrain you.',
        lt: 'J\u016Bs\u0173 tapatyb\u0117s strukt\u016Bros ir sav\u0119s pateikimo pasauliui b\u016Bdas per\u017Ei\u016Brimi. Senos atsakomyb\u0117s ar sau primesti apribojimai gali jaustis sunkes-ni. I\u0161 naujo \u012Fvertinkite, kurios taisykl\u0117s tarnauja j\u016Bs\u0173 augimui ir kurios tik riboja.',
      },
      2: {
        en: 'Financial structures and security measures you have built may need reassessment. Are your saving habits too rigid or not disciplined enough? This period asks you to find the right balance between caution and generosity.',
        lt: 'Finansin\u0117s strukt\u016Bros ir saugumo priemon\u0117s, kurias suk\u016Br\u0117te, gali reikalauti pervertinimo. Ar j\u016Bs\u0173 taupymo \u012Fpro\u010Diai per grie\u017Eti ar nepakankamai disciplinuoti? \u0160is laikotarpis pra\u0161o rasti teising\u0105 pusiausvyr\u0105 tarp atsargumo ir dosnumo.',
      },
      3: {
        en: 'Communication patterns that have become rigid or overly cautious surface for review. You may need to unlearn habits of self-censorship or excessive restraint in how you express your ideas and opinions.',
        lt: 'Bendravimo modeliai, kurie tapo nelanks-t\u016Bs ar pernelyg atsarg\u016Bs, i\u0161kyla per\u017Ei\u016Brai. Gali reik\u0117ti atsisakyti savicenz\u016Bros ar perd\u0117to sant\u016Brumo \u012Fpro\u010Di\u0173, kaip rei\u0161kiate savo id\u0117jas ir nuomones.',
      },
      4: {
        en: 'Foundational issues in your home life \u2014 structural repairs, family responsibilities, or outdated domestic patterns \u2014 demand attention. What you have been avoiding or propping up with temporary fixes now requires real resolution.',
        lt: 'Fundamentalios nam\u0173 gyvenimo problemos \u2014 strukt\u016Briniai remontai, \u0161eimos atsakomyb\u0117s ar pasen\u0119 nam\u0173 modeliai \u2014 reikalauja d\u0117mesio. Tai, k\u0105 veng\u0117te ar laik\u0117te laikinais sprendimais, dabar reikalauja tikro sprendimo.',
      },
      5: {
        en: 'Creative blocks may intensify as old fears about inadequacy or worthlessness surface. This is not a sign to give up but an invitation to work through the inner barriers that limit your self-expression and capacity for joy.',
        lt: 'K\u016Brybiniai blokai gali sustipre-ti, kai senos baim\u0117s d\u0117l nepakankamumo ar bevertišk-umo i\u0161kyla. Tai ne \u017Eenklas pasiduoti, o kvietimas perdirbti vidines kli\u016Btis, ribojan\u010Dias j\u016Bs\u0173 saviraišk\u0105 ir d\u017Eiaugsmo paj\u0117gum\u0105.',
      },
      6: {
        en: 'Long-standing health habits and work routines come under scrutiny. Chronic issues that you have been managing rather than resolving may demand more serious attention. Build health structures that will support you for the long term.',
        lt: 'Ilgalaikiai sveikatos \u012Fpro\u010Diai ir darbo rutinos atsiduria d\u0117mesio centre. L\u0117tin\u0117s problemos, kurias vald\u0117te, o ne sprendte, gali reikalauti rimtesnio d\u0117mesio. Kurkite sveikatos strukt\u016Bras, kurios palaikys jus ilg\u0105 laik\u0105.',
      },
      7: {
        en: 'The structures and commitments within your partnerships undergo serious review. Boundaries that once felt necessary may now feel restrictive, or vice versa. Honest reassessment of what you owe each other is overdue.',
        lt: 'Partnerys\u010Di\u0173 strukt\u016Bros ir \u012Fsipareigojimai i\u0161gyvena rimt\u0105 per\u017Ei\u016Br\u0105. Ribos, kurios ka\u017Ekada atrod\u0117 b\u016Btinos, dabar gali jaustis ribojan\u010Dios, arba atvirkš\u010Diai. S\u0105\u017Einingas pervertinimas, k\u0105 esate skolingi vienas kitam, yra pav\u0117luotas.',
      },
      8: {
        en: 'Deep, structural patterns around control, power, and shared resources surface for renegotiation. Old debts \u2014 emotional or financial \u2014 need addressing. This serious inner work builds a more solid foundation for future intimacy.',
        lt: 'Gil\u016Bs, strukt\u016Briniai modeliai aplink kontrol\u0119, gali\u0105 ir bendrus i\u0161teklius i\u0161kyla perderyboms. Senos skolos \u2014 emocin\u0117s ar finansin\u0117s \u2014 reikalauja sprendimo. \u0160is rimtas vidinis darbas kuria tvirtesn\u012F pamat\u0105 b\u016Bsimam artumui.',
      },
      9: {
        en: 'Your belief systems and educational foundations come under review. Teachings you once relied on may need questioning, and your relationship to authority figures or mentors may shift. Build a philosophy you can genuinely stand on.',
        lt: 'J\u016Bs\u0173 tik\u0117jimo sistemos ir \u0161vietimo pamatai per\u017Ei\u016Brimi. Mokymai, kuriais ka\u017Ekada r\u0117m\u0117t\u0117s, gali reikalauti kvestionavimo, ir j\u016Bs\u0173 santykis su autoritetiniais asmenimis ar mentoriais gali pasikeisti. Kurkite filosofij\u0105, ant kurios galite tikrai tvirtai stov\u0117ti.',
      },
      10: {
        en: 'Career structures, professional boundaries, and your relationship to authority are all under review. Promotions may be delayed, but the reassessment of your professional path ensures you are building toward something genuinely meaningful.',
        lt: 'Karjeros strukt\u016Bros, profesin\u0117s ribos ir j\u016Bs\u0173 santykis su autoritetu \u2014 visa tai per\u017Ei\u016Brima. Paaukštinimai gali v\u0117luoti, bet profesinio kelio pervertinimas u\u017Etikrina, kad kuriate ka\u017Ek\u0105 tikrai prasmingo.',
      },
      11: {
        en: 'Your role and responsibilities within groups undergo serious reconsideration. Some commitments may need releasing while others need strengthening. Ensure your contributions to the collective are sustainable and aligned with your true values.',
        lt: 'J\u016Bs\u0173 vaidmuo ir atsakomyb\u0117s grup\u0117se i\u0161gyvena rimt\u0105 persvarstym\u0105. Kai kuriuos \u012Fsipareigojimus gali reik\u0117ti paleisti, kitus \u2014 sustiprinti. U\u017Etikrinkite, kad j\u016Bs\u0173 ind\u0117lis \u012F kolektyv\u0105 yra tvarus ir atitinka j\u016Bs\u0173 tikr\u0105sias vertybes.',
      },
      12: {
        en: 'Deep karmic patterns and subconscious fears around inadequacy, failure, or unworthiness surface for examination. This is serious inner work, but the reward is liberation from limitations you did not even know you were carrying.',
        lt: 'Gil\u016Bs karminiai modeliai ir pas\u0105monin\u0117s baim\u0117s d\u0117l nepakankamumo, nes\u0117km\u0117s ar bevertiškumo i\u0161kyla patikrinimui. Tai rimtas vidinis darbas, bet atlygis yra i\u0161silaisvinimas i\u0161 apribojim\u0173, apie kuriuos net ne\u017Einojote, kad ne\u0161iojate.',
      },
    },
  },
  uranus: {
    general: {
      en: 'Uranus retrograde internalises the planet of revolution. Rather than sudden external change, the disruption happens within \u2014 old patterns of thinking break apart quietly, making room for genuine inner freedom. The breakthroughs are subtle but profound.',
      lt: 'Urano retrogradas internalizuoja revoliucijos planet\u0105. U\u017Euot staigaus i\u0161orinio poky\u010Dio, sutrikimas vyksta viduje \u2014 seni m\u0105stymo modeliai tyliai yrasi, darydami viet\u0105 tikrai vidinei laisvei. Prover\u017Eiai yra subtil\u016Bs, bet gil\u016Bs.',
    },
    practiceAdvice: {
      en: 'Notice where you feel stuck in routine and gently experiment with new ways of thinking or being.',
      lt: 'Pasteb\u0117kite, kur jau\u010Diat\u0117s \u012Fstrig\u0119 rutinoj e ir \u0161velniai eksperimentuokite naujais m\u0105stymo ar buvimo b\u016Bdais.',
    },
    personalByHouse: {
      1: {
        en: 'The desire for radical self-reinvention turns inward. Rather than shocking others with sudden external changes, quietly revolutionise how you think about yourself and your potential for freedom.',
        lt: 'Radikalaus sav\u0119s perk\u016Brimo tro\u0161kimas pasisuka \u012F vid\u0173. U\u017Euot stebindami kitus staigiais i\u0161oriniais poky\u010Diais, tyliai revoliucionuokite, kaip galvojate apie save ir savo laisv\u0117s potencial\u0105.',
      },
      2: {
        en: 'Unexpected financial insights emerge from within. Reconsider your relationship to material security \u2014 are your financial structures serving your freedom or limiting it? Internal shifts in values precede external changes.',
        lt: 'Netik\u0117tos finansin\u0117s \u012F\u017Evalgos i\u0161kyla i\u0161 vidaus. Persvarstykite savo santyk\u012F su materialiniu saugumu \u2014 ar j\u016Bs\u0173 finansin\u0117s strukt\u016Bros tarnauja j\u016Bs\u0173 laisvei, ar j\u0105 riboja? Vidiniai vertybi\u0173 poky\u010Diai eina prie\u0161 i\u0161orinius.',
      },
      3: {
        en: 'Revolutionary ideas you have been broadcasting outward now need internal processing. Reconsider which of your more radical opinions are genuinely visionary and which are merely reactive. Intellectual honesty deepens your thinking.',
        lt: 'Revoliucin\u0117s id\u0117jos, kurias transliavote \u012F lauk\u0105, dabar reikalauja vidinio apdorojimo. Persvarstykite, kurios i\u0161 j\u016Bs\u0173 radikalesni\u0173 nuomoni\u0173 yra tikrai vizionierišk os ir kurios \u2014 tik reaktyvios. Intelektualinis s\u0105\u017Einingumas gilina j\u016Bs\u0173 m\u0105stym\u0105.',
      },
      4: {
        en: 'Disruptions to your domestic life slow down, allowing you to integrate previous changes. Reflect on what genuine freedom means within your family dynamics and how you can create a home that supports your authentic self.',
        lt: 'Nam\u0173 gyvenimo sutrikimai sul\u0117t\u0117ja, leisdami integruoti ankstesnius poky\u010Dius. Apm\u0105stykite, k\u0105 tikra laisv\u0117 rei\u0161kia j\u016Bs\u0173 \u0161eimos dinamikoje ir kaip galite sukurti namus, palaikan\u010Dius j\u016Bs\u0173 autentišk\u0105 savast\u012F.',
      },
      5: {
        en: 'Creative innovation turns reflective. Rather than constantly seeking the next breakthrough, revisit unconventional projects you started and consider which truly deserve completion. Your creative rebellion needs deeper roots.',
        lt: 'K\u016Brybin\u0117 inovacija pasisuka apm\u0105stymui. U\u017Euot nuolat ie\u0161kodami kito prover\u017Eio, per\u017Ei\u016Br\u0117kite netradicini us projektus, kuriuos prad\u0117jote, ir apsvarstykite, kurie tikrai nusipelno u\u017Ebaigimo. J\u016Bs\u0173 k\u016Brybiniam mai\u0161tui reikia gilesni\u0173 \u0161akn\u0173.',
      },
      6: {
        en: 'Experimental health approaches you have been trying may need reassessment. Not every alternative is better than the conventional. Evaluate which progressive health practices genuinely serve your body and which are merely trendy.',
        lt: 'Eksperimentiniai sveikatos po\u017Ei\u016Briai, kuriuos band\u0117te, gali reikalauti pervertinimo. Ne kiekviena alternatyva yra geresn\u0117 nei tradicin\u0117. \u012Evertinkite, kurios pa\u017Eangios sveikatos praktikos tikrai tarnauja j\u016Bs\u0173 k\u016Bnui ir kurios yra tiesiog madingos.',
      },
      7: {
        en: 'The desire for freedom within partnerships turns inward. Rather than disrupting relationships externally, examine your own patterns around intimacy and independence. True freedom begins with self-understanding.',
        lt: 'Laisv\u0117s tro\u0161kimas partneryst\u0117se pasisuka \u012F vid\u0173. U\u017Euot trikdydami santykius i\u0161oriškai, tyrin\u0117kite savo modelius aplink artum\u0105 ir nepriklausomyb\u0119. Tikra laisv\u0117 prasideda nuo sav\u0119s supratimo.',
      },
      8: {
        en: 'Deep psychological patterns around control and liberation surface quietly. Old, unexpected memories or insights may emerge. Allow the internal revolution to proceed without forcing external change.',
        lt: 'Gil\u016Bs psichologiniai modeliai aplink kontrol\u0119 ir i\u0161silaisvinim\u0105 tyliai i\u0161kyla. Seni, netik\u0117ti prisiminimai ar \u012F\u017Evalgos gali atsirasti. Leiskite vidinei revoliucijai vykti, neverskdami i\u0161orinio poky\u010Dio.',
      },
      9: {
        en: 'Revolutionary beliefs and progressive philosophies undergo internal revision. You may quietly abandon or refine ideas that once felt radical. Authentic intellectual freedom requires regular honest reassessment.',
        lt: 'Revoliuciniai \u012Fsitikinimai ir pa\u017Eangios filosofijos i\u0161gyvena vidin\u0119 revizij\u0105. Galite tyliai atsisakyti ar patobulinti id\u0117jas, kurios ka\u017Ekada atrod\u0117 radikalios. Autenti\u0161ka intelektualin\u0117 laisv\u0117 reikalauja reguliaraus s\u0105\u017Einingo pervertinimo.',
      },
      10: {
        en: 'Career disruptions slow, giving you time to integrate professional changes that have already occurred. Reflect on whether your career path truly reflects your unique contribution or merely your rebellion against convention.',
        lt: 'Karjeros sutrikimai sul\u0117t\u0117ja, duodami laiko integruoti jau \u012Fvykusius profesinius poky\u010Dius. Apm\u0105stykite, ar j\u016Bs\u0173 karjeros kelias tikrai atspindi j\u016Bs\u0173 unikal\u0173 ind\u0117l\u012F, ar tiesiog j\u016Bs\u0173 mai\u0161t\u0105 prie\u0161 konvencij\u0105.',
      },
      11: {
        en: 'Your relationship to groups, social movements, and collective ideals deepens through reflection. Reassess which communities truly align with your evolving vision rather than those you joined in a moment of enthusiasm.',
        lt: 'J\u016Bs\u0173 santykis su grup\u0117mis, socialiniais jud\u0117jimais ir kolektyviniais idealais gil\u0117ja per apm\u0105stym\u0105. I\u0161 naujo \u012Fvertinkite, kurios bendruomen\u0117s tikrai atitinka j\u016Bs\u0173 besivy\u0161tan\u010Di\u0105 vizij\u0105, o ne tos, prie kuri\u0173 prisijungete entuziazmo akimirk\u0105.',
      },
      12: {
        en: 'Inner awakenings proceed quietly but powerfully. The subconscious processes breakthroughs that your conscious mind has not yet fully grasped. Pay attention to dreams and sudden flashes of insight during meditation.',
        lt: 'Vidiniai prabudimai vyksta tyliai, bet galingai. Pas\u0105mon\u0117 apdoroja prover\u017Eius, kuri\u0173 j\u016Bs\u0173 s\u0105moningas protas dar visi\u0161kai nesuvok\u0117. Atkreipkite d\u0117mes\u012F \u012F sapnus ir staigias \u012F\u017Evalg\u0173 blyksmes meditacijos metu.',
      },
    },
  },
  neptune: {
    general: {
      en: 'Neptune retrograde lifts the veil of illusion and invites a more honest relationship with your dreams, addictions, and spiritual practices. What once seemed enchanting may reveal its true nature. This is a period for grounding your spirituality in reality.',
      lt: 'Nept\u016Bno retrogradas pakelia iliuzijos \u0161yd\u0105 ir kvie\u010Dia s\u0105\u017Einingesniam santykiui su savo svajon\u0117mis, priklausomyb\u0117mis ir dvasin\u0117mis praktikomis. Tai, kas ka\u017Ekada atrod\u0117 \u017Eavinga, gali atskleisti savo tikr\u0105j\u0105 prigim-t\u012F. Tai laikotarpis dvasingumui pagr\u012Fsti realybe.',
    },
    practiceAdvice: {
      en: 'Question any situation that seems too good to be true. Strengthen your meditation or mindfulness practice with a focus on discernment.',
      lt: 'Kvestionuokite bet koki\u0105 situacij\u0105, kuri atrodo per gera, kad b\u016Bt\u0173 tikra. Stiprinkite savo meditacijos ar s\u0105moningumo praktik\u0105, sutelkdami d\u0117mes\u012F \u012F \u012F\u017Evalgum\u0105.',
    },
    personalByHouse: {
      1: {
        en: 'Illusions about your own identity become clearer. The gap between how you present yourself and who you truly are narrows. This honest self-seeing, though uncomfortable, is a genuine gift.',
        lt: 'Iliuzijos apie j\u016Bs\u0173 pa\u010Di\u0173 tapatyb\u0119 tampa ai\u0161kesn\u0117s. Atotr\u016Bkis tarp to, kaip pristatote save, ir kas tikrai esate, siaur\u0117ja. \u0160is s\u0105\u017Einingas sav\u0119s matymas, nors ir nepatogus, yra tikra dovana.',
      },
      2: {
        en: 'Financial confusion lifts slightly as you see more clearly where you have been deceiving yourself about money. Practical financial reality \u2014 however sobering \u2014 is better than beautiful illusions about abundance.',
        lt: 'Finansin\u0117 sumai\u0161tis \u0161iek tiek praskaidr\u0117ja, kai ai\u0161kiau matote, kur apsigaudin\u0117jote d\u0117l pinig\u0173. Praktišk a finansin\u0117 realyb\u0117 \u2014 kad ir kokia blaivi \u2014 yra geriau nei gra\u017Eios iliuzijos apie gaus\u0105.',
      },
      3: {
        en: 'Mental fog may lift enough to see where your thinking has been wishful rather than realistic. Conversations become more grounded, and the ability to distinguish between intuition and fantasy sharpens.',
        lt: 'Protinis r\u016Bkas gali pakankamai prasiskaidrinti, kad pamatytum\u0117te, kur j\u016Bs\u0173 m\u0105stymas buvo labiau tro\u0161kimais, nei realybe pagr\u012Fstas. Pokalbiai tampa labiau \u012F\u017Eeminti, ir geb\u0117jimas atskirti intuicij\u0105 nuo fantazijos paaštreja.',
      },
      4: {
        en: 'Idealised visions of home and family are gently corrected by reality. This is not disillusioning but clarifying \u2014 seeing your domestic life honestly allows you to love what is real rather than chasing what was imagined.',
        lt: 'Idealizuotos nam\u0173 ir \u0161eimos vizijos \u0161velniai koreguojamos realybe. Tai ne nusivylimas, o paai\u0161kinimas \u2014 s\u0105\u017Einingas savo nam\u0173 gyvenimo matymas leid\u017Eia myl\u0117ti tai, kas tikra, o ne vaikytis tai, kas buvo \u012Fsivaizduota.',
      },
      5: {
        en: 'Creative inspiration may feel less accessible, but what emerges is more authentic. The glamour fades and genuine craft remains. Artistic work done during Neptune retrograde tends to be more honest and enduring.',
        lt: 'K\u016Brybinis \u012Fkv\u0117pimas gali jaustis ma\u017Eiau pasiekiamas, bet tai, kas i\u0161kyla, yra autenti\u0161kiau. Glam\u016Bras bl\u0117sta ir tikras amatas lieka. Meninis darbas, atliktas Nept\u016Bno retrogrado metu, linkęs b\u016Bti s\u0105\u017Einingesnis ir ilgalaikesnis.',
      },
      6: {
        en: 'Health practices that relied on faith rather than evidence may prove less effective. Use this time to honestly assess which wellness approaches genuinely help and which were placebo or wishful thinking.',
        lt: 'Sveikatos praktikos, kurios r\u0117m\u0117si tik\u0117jimu, o ne \u012Frodymais, gali pasirodyti ma\u017Eiau efektyvios. Naudokite \u0161\u012F laik\u0105 s\u0105\u017Einingai \u012Fvertinti, kurie sveikatingumo po\u017Ei\u016Briai tikrai padeda ir kurie buvo placebo ar tro\u0161kimu pagr\u012Fstas m\u0105stymas.',
      },
      7: {
        en: 'The rose-tinted glasses come off in partnerships. Seeing your partner and your relationship dynamics more clearly can be sobering but ultimately strengthening. Real love is more durable than idealised fantasy.',
        lt: 'Ro\u017Einiai akiniai santykiuose nuimami. Aiškesnis partnerio ir santyki\u0173 dinamikos matymas gali b\u016Bti blaivus, bet galiausiai stiprinantis. Tikra meil\u0117 yra patvaresn\u0117 nei idealizuota fantazija.',
      },
      8: {
        en: 'Deep illusions about power, intimacy, or shared resources gradually dissolve. What you discover beneath the fantasy may be uncomfortable, but it is the foundation for genuine rather than imagined transformation.',
        lt: 'Gilios iliuzijos apie gali\u0105, artum\u0105 ar bendrus i\u0161teklius palaipsniui tirpsta. Tai, k\u0105 atrandate po fantazija, gali b\u016Bti nepatogu, bet tai yra pagrindas tikrai, o ne \u012Fsivaizduojamai transformacijai.',
      },
      9: {
        en: 'Spiritual and philosophical beliefs undergo a reality check. Teachings or gurus you once idealised may reveal their limitations. This disillusionment is actually spiritual maturity \u2014 truth needs no embellishment.',
        lt: 'Dvasiniai ir filosofiniai \u012Fsitikinimai i\u0161gyvena realyb\u0117s patikr-inim\u0105. Mokymai ar mokytojai, kuriuos ka\u017Ekada idealizavote, gali atskleisti savo ribotum\u0105. \u0160is nusivylimas i\u0161 tikr\u0173j\u0173 yra dvasin\u0117 brandą \u2014 tiesai nereikia papuošim\u0173.',
      },
      10: {
        en: 'Professional fantasies or unclear career goals become more visible. If you have been drifting professionally, this retrograde helps you see where you need to get more practical and grounded about your ambitions.',
        lt: 'Profesin\u0117s fantazijos ar neai\u0161k\u016Bs karjeros tikslai tampa labiau matomi. Jei profesiniame gyvenime dreifavote, \u0161is retrogradas padeda pamatyti, kur turite b\u016Bti praktišk esni ir labiau \u012F\u017Eeminti d\u0117l savo ambicij\u0173.',
      },
      11: {
        en: 'Idealistic visions about groups or causes you support may be tempered by reality. This is healthy \u2014 discerning which collective dreams are achievable and which are escapist strengthens your genuine contribution.',
        lt: 'Idealistin\u0117s vizijos apie grupes ar bylas, kurias remiate, gali b\u016Bti su\u0161velnintos realybe. Tai sveika \u2014 atskirti, kurios kolektyvin\u0117s svajon\u0117s yra pasiekiamos ir kurios yra eskapistines, stiprina j\u016Bs\u0173 tikr\u0105 ind\u0117l\u012F.',
      },
      12: {
        en: 'Spiritual practices deepen through honest self-examination rather than blissful escape. This is one of the most powerful periods for distinguishing genuine spiritual experience from pleasant delusion. Truth, however ordinary, is sacred.',
        lt: 'Dvasin\u0117s praktikos gil\u0117ja per s\u0105\u017Eining\u0105 savianalizę, o ne per palaiming\u0105 pab\u0117gim\u0105. Tai vienas galingiaus-i\u0173 laikotarpi\u0173 atskirti tikr\u0105 dvasin\u0119 patirt\u012F nuo malonios iliuzijos. Tiesa, kad ir kokia kasdieniška, yra \u0161venta.',
      },
    },
  },
  pluto: {
    general: {
      en: 'Pluto retrograde takes the process of transformation underground. Deep psychological patterns, power dynamics, and unresolved trauma surface for examination. This is shadow work at its most potent \u2014 uncomfortable but ultimately liberating.',
      lt: 'Plutono retrogradas perkelia transformacijos proces\u0105 po \u017Eeme. Gil\u016Bs psichologiniai modeliai, galios dinamikos ir nei\u0161spr\u0119stos traumos i\u0161kyla patikrinimui. Tai \u0161e\u0161\u0117li\u0173 darbas savo galingiausiu pavidalu \u2014 nepatogus, bet galiausiai i\u0161laisvinantis.',
    },
    practiceAdvice: {
      en: 'Engage with therapeutic practices, journaling, or any form of deep self-inquiry. Allow what needs to die its natural death.',
      lt: 'U\u017Esiimkite terapin\u0117mis praktikomis, dienoraš\u010Dio rašymu ar bet kokia gilio sav\u0119s tyrimo forma. Leiskite tam, kas turi mirti, savo nat\u016Bralia mirtimi.',
    },
    personalByHouse: {
      1: {
        en: 'Deep power dynamics within your sense of identity surface for examination. Where have you been giving your power away, or wielding it unconsciously? This period of intense self-honesty leads to genuine empowerment.',
        lt: 'Gilios galios dinamikos j\u016Bs\u0173 tapatyb\u0117s poj\u016Btyje i\u0161kyla patikrinimui. Kur atidavete savo gali\u0105 arba naudojote j\u0105 nes\u0105moningai? \u0160is intensyvaus sav\u0119s s\u0105\u017Einingumo laikotarpis veda prie tikro \u012Fgalinimo.',
      },
      2: {
        en: 'Buried patterns around money, control, and material security demand attention. Compulsive financial behaviours \u2014 whether hoarding or overspending \u2014 reveal their psychological roots. Understanding these patterns is the first step to freedom.',
        lt: 'Pasl\u0117pti modeliai aplink pinigus, kontrol\u0119 ir materialin\u012F saugum\u0105 reikalauja d\u0117mesio. Kompulsyv\u016Bs finansiniai elgesiai \u2014 tiek kaupimas, tiek per didelis leidimas \u2014 atskleid\u017Eia savo psichologines \u0161aknis. \u0160i\u0173 modeli\u0173 supratimas yra pirmas \u017Eingsnis laisv\u0117s link.',
      },
      3: {
        en: 'The power dynamics in your everyday communications become more visible. Notice where you manipulate through words or allow others to silence you. Reclaiming honest, empowered speech transforms your daily interactions.',
        lt: 'Galios dinamikos kasdieniamuose bendravimuose tampa labiau matomos. Pasteb\u0117kite, kur manipuliuojate \u017Eod\u017Eiais ar leid\u017Eiate kitiems jus nutildyti. S\u0105\u017Einingos, \u012Fgalintos kalb\u0117s atgavimas transformuoja j\u016Bs\u0173 kasdienius santykius.',
      },
      4: {
        en: 'Deep family patterns \u2014 power struggles, control dynamics, or inherited trauma \u2014 surface within your private world. This is uncomfortable but necessary excavation. What you uncover and heal now transforms your family legacy.',
        lt: 'Gil\u016Bs \u0161eimos modeliai \u2014 galios kovos, kontrol\u0117s dinamikos ar paveld\u0117tos traumos \u2014 i\u0161kyla j\u016Bs\u0173 priva\u010Diame pasaulyje. Tai nepatogus, bet b\u016Btinas kasin\u0117jimas. Tai, k\u0105 atrandate ir i\u0161gydote dabar, transformuoja j\u016Bs\u0173 \u0161eimos palikimą.',
      },
      5: {
        en: 'Creative blocks rooted in deep psychological material surface for attention. Fears about being truly seen, past creative wounds, or compulsive patterns around pleasure and avoidance reveal themselves for healing.',
        lt: 'K\u016Brybiniai blokai, \u012Fsi\u0161aknij\u0119 gilioje psichologin\u0117je med\u017Eiagoje, i\u0161kyla d\u0117mesiui. Baim\u0117s b\u016Bti tikrai matytam, praeities k\u016Brybin\u0117s \u017Eaizdos ar kompulsyv\u016Bs modeliai aplink malonum\u0105 ir vengim\u0105 atsiskleid\u017Eia gijimui.',
      },
      6: {
        en: 'Deep-seated health patterns or compulsive habits around food, exercise, or daily routines demand honest confrontation. The body stores what the mind suppresses \u2014 listen to what your physical symptoms are really telling you.',
        lt: 'Giliai \u012Fsi\u0161aknij\u0119 sveikatos modeliai ar kompulsyv\u016Bs \u012Fpro\u010Diai aplink maist\u0105, sport\u0105 ar kasdienes rutinas reikalauja s\u0105\u017Einingo susid\u016Brimo. K\u016Bnas saugo tai, k\u0105 protas nuslopina \u2014 klausykite, k\u0105 j\u016Bs\u0173 fiziniai simptomai tikrai jums sako.',
      },
      7: {
        en: 'Power dynamics within your closest partnerships come under intense scrutiny. Control patterns, unspoken resentments, and the balance of vulnerability between you and your partner surface for transformation.',
        lt: 'Galios dinamikos artimiausiose partneryst\u0117se patenka po intensyvia patikra. Kontrol\u0117s modeliai, nei\u0161tartos nuoskaudos ir pa\u017Eid\u017Eiamumo pusiausvyra tarp j\u016Bs\u0173 ir j\u016Bs\u0173 partnerio i\u0161kyla transformacijai.',
      },
      8: {
        en: 'This is your deepest and most intense period of psychological work. Shadow material surfaces with particular clarity and force. Therapy, depth psychology, or honest self-examination during this period can be genuinely life-changing.',
        lt: 'Tai j\u016Bs\u0173 giliausias ir intensyviausias psichologinio darbo laikotarpis. \u0160e\u0161\u0117lin\u0117 med\u017Eiaga i\u0161kyla su ypatingu ai\u0161kumu ir j\u0117ga. Terapija, gelmi\u0173 psichologija ar s\u0105\u017Eininga savianalizė \u0161iuo laikotarpiu gali b\u016Bti tikrai gyvenim\u0105 kei\u010Dianti.',
      },
      9: {
        en: 'Fundamental beliefs about power, truth, and meaning undergo radical revision. Ideologies you once held with certainty may crumble, making space for a more authentic and personally earned understanding of reality.',
        lt: 'Fundamental\u016Bs \u012Fsitikinimai apie gali\u0105, ties\u0105 ir prasm\u0119 i\u0161gyvena radikali\u0105 revizij\u0105. Ideologijos, kuriomis ka\u017Ekada tik\u0117jote u\u017Etikrintai, gali sugri\u016Bti, darydamos viet\u0105 autentiškesniam ir asmeniškai u\u017Edirbti realyb\u0117s supratimui.',
      },
      10: {
        en: 'Professional power dynamics, ambition, and your relationship to authority undergo deep examination. Where have you compromised your integrity for advancement, or avoided power out of fear? This honest reckoning strengthens your career foundation.',
        lt: 'Profesin\u0117s galios dinamikos, ambicija ir j\u016Bs\u0173 santykis su autoritetu i\u0161gyvena gil\u0173 patikr-inim\u0105. Kur pakenk\u0117te savo vientisumui d\u0117l kilimo, ar veng\u0117te galios i\u0161 baim\u0117s? \u0160is s\u0105\u017Einingas atsiskaitymas stiprina j\u016Bs\u0173 karjeros pamat\u0105.',
      },
      11: {
        en: 'Your role within group power structures and collective movements becomes clearer. Hidden dynamics within organisations you belong to may surface. Use this insight to either transform these groups from within or walk away with integrity.',
        lt: 'J\u016Bs\u0173 vaidmuo grupin\u0117se galios strukt\u016Brose ir kolektyviniuose jud\u0117jimuose tampa aiškesnis. Pasl\u0117ptos dinamikos organizacijose, kurioms priklausote, gali i\u0161kilt. Naudokite \u0161i\u0105 \u012F\u017Evalg\u0105 transformuoti \u0161ias grupes i\u0161 vidaus arba pasitraukti su vientisumu.',
      },
      12: {
        en: 'The deepest layers of your subconscious reveal themselves during this period. Dreams may be intense, past-life themes may surface, and the boundary between your personal shadow and the collective unconscious thins. Profound healing is available.',
        lt: 'Giliausi j\u016Bs\u0173 pas\u0105mon\u0117s sluoksniai atsiskleid\u017Eia \u0161iuo laikotarpiu. Sapnai gali b\u016Bti intens-yv\u016Bs, praeities gyvenim\u0173 temos gali i\u0161kilt, ir riba tarp j\u016Bs\u0173 asmeninio \u0161e\u0161\u0117lio ir kolektyvin\u0117s pas\u0105mon\u0117s plon\u0117ja. Gilus gijimas yra prieinamas.',
      },
    },
  },
}

export function generateRetrogradeSummary(retrogradeBodyIds: string[], lang: 'en' | 'lt' = 'en'): string {
  if (retrogradeBodyIds.length === 0) return ''

  const validIds = retrogradeBodyIds.filter(id => id in RETROGRADE_READINGS && id !== 'sun' && id !== 'moon')
  if (validIds.length === 0) return ''

  const nameMap: Record<string, { en: string; lt: string }> = {
    mercury: { en: 'Mercury', lt: 'Merkurijus' },
    venus: { en: 'Venus', lt: 'Venera' },
    mars: { en: 'Mars', lt: 'Marsas' },
    jupiter: { en: 'Jupiter', lt: 'Jupiteris' },
    saturn: { en: 'Saturn', lt: 'Saturnas' },
    uranus: { en: 'Uranus', lt: 'Uranas' },
    neptune: { en: 'Neptune', lt: 'Nept\u016Bnas' },
    pluto: { en: 'Pluto', lt: 'Plutonas' },
  }

  const names = validIds.map(id => nameMap[id]?.[lang] ?? id)

  if (validIds.length === 1) {
    const reading = RETROGRADE_READINGS[validIds[0] as CelestialBodyId]
    if (lang === 'lt') {
      return `${names[0]} \u0161iuo metu yra retrogradinis. ${reading.general[lang]} ${reading.practiceAdvice[lang]}`
    }
    return `${names[0]} is currently retrograde. ${reading.general[lang]} ${reading.practiceAdvice[lang]}`
  }

  const listStr = lang === 'lt'
    ? names.length === 2
      ? `${names[0]} ir ${names[1]}`
      : `${names.slice(0, -1).join(', ')} ir ${names[names.length - 1]}`
    : names.length === 2
      ? `${names[0]} and ${names[1]}`
      : `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`

  const combinedAdvice = validIds
    .map(id => RETROGRADE_READINGS[id as CelestialBodyId].practiceAdvice[lang])
    .join(' ')

  if (lang === 'lt') {
    return `${listStr} \u0161iuo metu yra retrogradiniai, sukurdami kolektyvin\u012F kvietim\u0105 sustoti, per\u017Ei\u016Br\u0117ti ir perm\u0105styti. Kai kelios planetos atrodo judan\u010Dios atgal vienu metu, visata pabrė\u017Eia apm\u0105stym\u0105, o ne veiksm\u0105. Seni modeliai i\u0161kyla gijimui, ir vidinis pasaulis reikalauja daugiau d\u0117mesio nei i\u0161orinis. ${combinedAdvice}`
  }

  return `${listStr} are all currently retrograde, creating a collective invitation to pause, review, and re-examine. When multiple planets appear to move backward simultaneously, the universe emphasises reflection over action. Old patterns resurface for healing, and the inner world demands more attention than the outer. ${combinedAdvice}`
}
