import type { CelestialBodyId } from '../../types'

export interface RetrogradeReading {
  general: string
  practiceAdvice: string
  personalByHouse: Record<number, string>
}

export const RETROGRADE_READINGS: Record<CelestialBodyId, RetrogradeReading> = {
  sun: {
    general: 'The Sun does not retrograde in the traditional sense. If you are seeing this, the data may reflect an unusual calculation. The Sun\'s energy remains a steady, forward-moving force of identity and vitality.',
    practiceAdvice: 'Continue to align with your core purpose and trust the light within.',
    personalByHouse: {},
  },
  moon: {
    general: 'The Moon does not go retrograde. Its cycles are constant and reliable — waxing and waning in an unbroken rhythm. If this appears, it is a data artefact rather than a celestial event.',
    practiceAdvice: 'Honour the Moon\'s natural cycle of growth and release.',
    personalByHouse: {},
  },
  mercury: {
    general: 'Mercury retrograde is the most well-known and frequently occurring of all retrogrades, happening roughly three times per year. Communication, technology, and travel plans are prone to disruption. Misunderstandings, lost messages, and mechanical glitches are common themes. However, this is also a profoundly useful period for review — re-reading, re-thinking, and re-connecting with people and ideas from the past.',
    practiceAdvice: 'Double-check all messages before sending, back up digital files, and avoid signing important contracts unless necessary. Revisit old projects or reconnect with people you have lost touch with.',
    personalByHouse: {
      1: 'Identity confusion or reconsideration of how you present yourself to the world is likely. Old self-images may resurface for review. Give yourself permission to not have all the answers about who you are right now.',
      2: 'Financial miscommunications or unexpected expenses may arise. Double-check bank statements, review subscriptions, and avoid making major financial commitments until Mercury moves direct. Past money decisions may need revisiting.',
      3: 'Mercury retrograde hits especially close to home for you — miscommunications with siblings, neighbours, or in daily exchanges are likely. Re-read messages before sending. Old conversations may resurface for resolution.',
      4: 'Household appliances may malfunction and family miscommunications increase. Old memories or unresolved family issues may surface. Use this time to reconnect with your roots and address domestic matters patiently.',
      5: 'Creative projects may stall or need significant revision. Rather than pushing forward, revisit earlier drafts and abandoned ideas — there may be gold in what you set aside. Past romantic connections may also reappear.',
      6: 'Your daily routines may feel disrupted and old health concerns could flare up briefly. Take it as a prompt to revisit wellness habits you have neglected. Slow down at work and double-check details.',
      7: 'Miscommunications with partners and close collaborators are especially likely. Assumptions that seemed clear may prove otherwise. Practise patience, ask clarifying questions, and avoid making binding agreements.',
      8: 'Hidden information or unresolved matters about shared resources, debts, or deep emotional patterns may resurface. Review joint finances carefully and allow old psychological material to surface for healing.',
      9: 'Travel plans may be disrupted or delayed. Registrations, bookings, and academic submissions need extra scrutiny. Use this time to revisit earlier studies or reconsider your philosophical positions rather than pushing into new territory.',
      10: 'Professional communications need extra care. Double-check emails to superiors, review contracts thoroughly, and avoid launching major career initiatives until Mercury goes direct. Past professional connections may prove valuable.',
      11: 'Group communications and social plans are prone to confusion. Confirm arrangements twice, be patient with miscommunications among friends, and use this time to reconnect with people from your past social circles.',
      12: 'Your inner dialogue becomes confused or circular. Rather than forcing mental clarity, allow the mental fog — it may be clearing space for deeper intuition. Dreams and subconscious messages deserve extra attention now.',
    },
  },
  venus: {
    general: 'Venus retrograde turns attention inward on matters of love, beauty, and value. Relationships from the past may resurface, and your sense of what — and who — you truly value may shift. This is a period of romantic and financial re-evaluation, not a time for impulsive purchases or new relationships.',
    practiceAdvice: 'Reflect on what brings you genuine pleasure and connection. Avoid dramatic changes to your appearance or large financial commitments.',
    personalByHouse: {
      1: 'Your sense of attractiveness, personal style, and how you present yourself to the world comes under review. Old insecurities may surface, but so might a more authentic understanding of your beauty and worth.',
      2: 'Financial values and spending habits undergo re-evaluation. Purchases made now may later feel regrettable. Focus on understanding what you truly value rather than acquiring new things.',
      3: 'The way you express affection and create harmony in daily interactions comes under review. You may reconsider how you communicate in relationships and discover more authentic ways of connecting.',
      4: 'Old feelings about family love, childhood nurturing, and emotional safety surface for reconsideration. Redecorating or making major changes to your home is best postponed, but reflecting on what home truly means to you is valuable.',
      5: 'Creative confidence may waver and romantic nostalgia intensifies. Past lovers or abandoned creative projects call for your attention. Revisiting what once brought you joy may reveal something worth reclaiming.',
      6: 'Your relationship with self-care and daily pleasure needs reassessment. Are you nurturing yourself genuinely or merely going through the motions? Revisit beauty and wellness routines with fresh eyes.',
      7: 'Partnerships undergo their most significant re-evaluation. Relationship patterns, expectations, and the balance of giving and receiving all demand honest examination. Old partners may reappear, bearing unfinished lessons.',
      8: 'Deep reassessment of intimacy, shared resources, and emotional vulnerability unfolds. What you once found attractive about merging with another may need recalibrating. Financial arrangements with others also warrant review.',
      9: 'Your aesthetic sensibilities and cultural values expand through revisiting previous experiences. A place you visited before may reveal new beauty, or an old philosophical framework may offer fresh wisdom about love and values.',
      10: 'Professional relationships and your public image in matters of diplomacy, art, or collaboration need careful tending. Avoid major changes to your professional appearance or brand until Venus moves direct.',
      11: 'Friendships and social allegiances undergo quiet reassessment. You may drift away from some groups and reconnect with others. Allow your social values to evolve without forcing decisions about who belongs in your life.',
      12: 'Hidden desires, secret attractions, and unprocessed grief about love surface from your subconscious. This is a powerful time for healing old romantic wounds through reflection, therapy, or compassionate self-examination.',
    },
  },
  mars: {
    general: 'Mars retrograde slows the drive and redirects energy inward. Projects may stall, motivation can feel elusive, and frustration may build without a clear outlet. This is a time to reconsider how you use your energy and what battles are truly worth fighting.',
    practiceAdvice: 'Channel physical energy into gentle, mindful practices. Avoid initiating conflicts or starting major new ventures.',
    personalByHouse: {
      1: 'Your personal drive and assertiveness turn inward. Physical energy may dip, and the usual confidence in taking action may waver. This is a time to reconsider how you assert yourself rather than pushing forward blindly.',
      2: 'Financial aggression or impulsive spending may backfire. Slow down your pursuit of money and material goals. Reflect on whether your current financial strategies truly serve your long-term security.',
      3: 'Arguments and verbal confrontations are more likely to escalate during this period. Think before speaking harshly, and avoid sending angry messages. Old conflicts with siblings or neighbours may resurface for resolution.',
      4: 'Frustration within your domestic environment may simmer. Home renovation projects may face delays. Channel the restless energy into reflecting on what changes your home and family life truly need.',
      5: 'Creative projects may lose momentum or feel forced. Rather than pushing through, step back and reconnect with what genuinely inspires you. Past creative endeavours or old romantic passions may call for completion.',
      6: 'Physical energy fluctuates and pushing too hard during exercise risks strain or injury. Modify your fitness routine to be gentler, and attend to any health issues you have been powering through rather than addressing.',
      7: 'Unresolved anger or frustration in partnerships surfaces. Past conflicts that were never fully resolved may demand attention. Avoid starting new confrontations and instead work through old resentments with patience.',
      8: 'Deep, primal energy redirects inward, stirring repressed anger, desire, or power dynamics. This can be uncomfortable but deeply healing if you allow the feelings rather than acting them out destructively.',
      9: 'Travel plans may encounter obstacles or delays. Legal matters proceed slowly. Use this time to reconsider your beliefs about what is worth fighting for and redirect your passionate energy toward inner growth.',
      10: 'Professional ambition may feel thwarted or misdirected. Avoid forcing career moves or engaging in workplace power struggles. Instead, reassess your long-term professional goals and how you pursue them.',
      11: 'Conflicts within groups or frustrations with collective progress surface. Rather than fighting against the slowdown, use it to reconsider which causes and communities truly deserve your energy and commitment.',
      12: 'Anger, desire, and competitive energy that normally drives you outward turns inward. This can feel unsettling, but it offers a rare opportunity to confront your shadow warrior — the part of you that fights from fear.',
    },
  },
  jupiter: {
    general: 'Jupiter retrograde invites you to look inward for growth rather than outward. Expansion turns philosophical — this is a period for deepening your beliefs, revisiting your vision for the future, and finding abundance in what you already have rather than seeking more.',
    practiceAdvice: 'Journal about your long-term goals and question whether your current path truly aligns with your values.',
    personalByHouse: {
      1: 'Your personal philosophy and sense of optimism turn inward for reflection. Rather than projecting confidence outward, explore whether your beliefs about yourself are genuinely expansive or merely comfortable.',
      2: 'Financial growth may slow, but inner wealth deepens. Reconsider what abundance truly means to you beyond material accumulation. This is a time for gratitude and wise stewardship rather than aggressive expansion.',
      3: 'Your capacity for inspiring communication turns reflective. Revisit earlier teachings, reconsider strong opinions, and allow your intellectual life to deepen through quiet study rather than outward proclamation.',
      4: 'Growth and expansion in your home life slow down, offering time to appreciate what you already have. Reflect on family blessings, cherish your roots, and find abundance in the simple comfort of belonging.',
      5: 'Creative abundance turns inward — rather than producing new work, you may need to revisit and deepen what already exists. Romantic idealism also benefits from honest reassessment. What genuinely brings you joy?',
      6: 'Health expansion through new diets, fitness programmes, or wellness trends may stall. Use this time to assess which practices truly serve your body rather than following trends. Quality of routine matters more than quantity.',
      7: 'The desire for growth within partnerships turns inward. Rather than seeking new connections or expanding existing ones outward, deepen your understanding of what makes your closest relationships genuinely fulfilling.',
      8: 'Deep inner growth replaces external expansion. Questions about shared resources, inheritance, and psychological depth become more reflective. Trust that the wisdom gained during this period will bear fruit later.',
      9: 'Your philosophical and spiritual life deepens through reflection rather than outward seeking. Revisit wisdom traditions you have explored before, reread transformative books, and allow your worldview to mature quietly.',
      10: 'Professional expansion slows, offering time to reassess your career trajectory. Is your current path truly aligned with your deeper values and long-term vision? This reflection prevents you from growing in the wrong direction.',
      11: 'Your role within communities and social causes may shift as you reconsider which groups and visions truly align with your evolving beliefs. Quality of connection matters more than breadth of influence right now.',
      12: 'Spiritual growth turns profoundly inward. This is one of the most powerful periods for genuine inner expansion — meditation, contemplation, and the courage to question your deepest beliefs lead to authentic wisdom.',
    },
  },
  saturn: {
    general: 'Saturn retrograde softens the taskmaster\'s grip and invites a re-examination of the structures, rules, and responsibilities that govern your life. Boundaries that felt rigid may loosen, and lessons you thought you had learned may return for deeper integration.',
    practiceAdvice: 'Review your commitments and boundaries. Release obligations that no longer serve your growth and reinforce those that do.',
    personalByHouse: {
      1: 'The structures of your identity and how you present yourself to the world come under review. Old responsibilities or self-imposed limitations may feel heavier. Reassess which rules serve your growth and which merely constrain you.',
      2: 'Financial structures and security measures you have built may need reassessment. Are your saving habits too rigid or not disciplined enough? This period asks you to find the right balance between caution and generosity.',
      3: 'Communication patterns that have become rigid or overly cautious surface for review. You may need to unlearn habits of self-censorship or excessive restraint in how you express your ideas and opinions.',
      4: 'Foundational issues in your home life — structural repairs, family responsibilities, or outdated domestic patterns — demand attention. What you have been avoiding or propping up with temporary fixes now requires real resolution.',
      5: 'Creative blocks may intensify as old fears about inadequacy or worthlessness surface. This is not a sign to give up but an invitation to work through the inner barriers that limit your self-expression and capacity for joy.',
      6: 'Long-standing health habits and work routines come under scrutiny. Chronic issues that you have been managing rather than resolving may demand more serious attention. Build health structures that will support you for the long term.',
      7: 'The structures and commitments within your partnerships undergo serious review. Boundaries that once felt necessary may now feel restrictive, or vice versa. Honest reassessment of what you owe each other is overdue.',
      8: 'Deep, structural patterns around control, power, and shared resources surface for renegotiation. Old debts — emotional or financial — need addressing. This serious inner work builds a more solid foundation for future intimacy.',
      9: 'Your belief systems and educational foundations come under review. Teachings you once relied on may need questioning, and your relationship to authority figures or mentors may shift. Build a philosophy you can genuinely stand on.',
      10: 'Career structures, professional boundaries, and your relationship to authority are all under review. Promotions may be delayed, but the reassessment of your professional path ensures you are building toward something genuinely meaningful.',
      11: 'Your role and responsibilities within groups undergo serious reconsideration. Some commitments may need releasing while others need strengthening. Ensure your contributions to the collective are sustainable and aligned with your true values.',
      12: 'Deep karmic patterns and subconscious fears around inadequacy, failure, or unworthiness surface for examination. This is serious inner work, but the reward is liberation from limitations you did not even know you were carrying.',
    },
  },
  uranus: {
    general: 'Uranus retrograde internalises the planet of revolution. Rather than sudden external change, the disruption happens within — old patterns of thinking break apart quietly, making room for genuine inner freedom. The breakthroughs are subtle but profound.',
    practiceAdvice: 'Notice where you feel stuck in routine and gently experiment with new ways of thinking or being.',
    personalByHouse: {
      1: 'The desire for radical self-reinvention turns inward. Rather than shocking others with sudden external changes, quietly revolutionise how you think about yourself and your potential for freedom.',
      2: 'Unexpected financial insights emerge from within. Reconsider your relationship to material security — are your financial structures serving your freedom or limiting it? Internal shifts in values precede external changes.',
      3: 'Revolutionary ideas you have been broadcasting outward now need internal processing. Reconsider which of your more radical opinions are genuinely visionary and which are merely reactive. Intellectual honesty deepens your thinking.',
      4: 'Disruptions to your domestic life slow down, allowing you to integrate previous changes. Reflect on what genuine freedom means within your family dynamics and how you can create a home that supports your authentic self.',
      5: 'Creative innovation turns reflective. Rather than constantly seeking the next breakthrough, revisit unconventional projects you started and consider which truly deserve completion. Your creative rebellion needs deeper roots.',
      6: 'Experimental health approaches you have been trying may need reassessment. Not every alternative is better than the conventional. Evaluate which progressive health practices genuinely serve your body and which are merely trendy.',
      7: 'The desire for freedom within partnerships turns inward. Rather than disrupting relationships externally, examine your own patterns around intimacy and independence. True freedom begins with self-understanding.',
      8: 'Deep psychological patterns around control and liberation surface quietly. Old, unexpected memories or insights may emerge. Allow the internal revolution to proceed without forcing external change.',
      9: 'Revolutionary beliefs and progressive philosophies undergo internal revision. You may quietly abandon or refine ideas that once felt radical. Authentic intellectual freedom requires regular honest reassessment.',
      10: 'Career disruptions slow, giving you time to integrate professional changes that have already occurred. Reflect on whether your career path truly reflects your unique contribution or merely your rebellion against convention.',
      11: 'Your relationship to groups, social movements, and collective ideals deepens through reflection. Reassess which communities truly align with your evolving vision rather than those you joined in a moment of enthusiasm.',
      12: 'Inner awakenings proceed quietly but powerfully. The subconscious processes breakthroughs that your conscious mind has not yet fully grasped. Pay attention to dreams and sudden flashes of insight during meditation.',
    },
  },
  neptune: {
    general: 'Neptune retrograde lifts the veil of illusion and invites a more honest relationship with your dreams, addictions, and spiritual practices. What once seemed enchanting may reveal its true nature. This is a period for grounding your spirituality in reality.',
    practiceAdvice: 'Question any situation that seems too good to be true. Strengthen your meditation or mindfulness practice with a focus on discernment.',
    personalByHouse: {
      1: 'Illusions about your own identity become clearer. The gap between how you present yourself and who you truly are narrows. This honest self-seeing, though uncomfortable, is a genuine gift.',
      2: 'Financial confusion lifts slightly as you see more clearly where you have been deceiving yourself about money. Practical financial reality — however sobering — is better than beautiful illusions about abundance.',
      3: 'Mental fog may lift enough to see where your thinking has been wishful rather than realistic. Conversations become more grounded, and the ability to distinguish between intuition and fantasy sharpens.',
      4: 'Idealised visions of home and family are gently corrected by reality. This is not disillusioning but clarifying — seeing your domestic life honestly allows you to love what is real rather than chasing what was imagined.',
      5: 'Creative inspiration may feel less accessible, but what emerges is more authentic. The glamour fades and genuine craft remains. Artistic work done during Neptune retrograde tends to be more honest and enduring.',
      6: 'Health practices that relied on faith rather than evidence may prove less effective. Use this time to honestly assess which wellness approaches genuinely help and which were placebo or wishful thinking.',
      7: 'The rose-tinted glasses come off in partnerships. Seeing your partner and your relationship dynamics more clearly can be sobering but ultimately strengthening. Real love is more durable than idealised fantasy.',
      8: 'Deep illusions about power, intimacy, or shared resources gradually dissolve. What you discover beneath the fantasy may be uncomfortable, but it is the foundation for genuine rather than imagined transformation.',
      9: 'Spiritual and philosophical beliefs undergo a reality check. Teachings or gurus you once idealised may reveal their limitations. This disillusionment is actually spiritual maturity — truth needs no embellishment.',
      10: 'Professional fantasies or unclear career goals become more visible. If you have been drifting professionally, this retrograde helps you see where you need to get more practical and grounded about your ambitions.',
      11: 'Idealistic visions about groups or causes you support may be tempered by reality. This is healthy — discerning which collective dreams are achievable and which are escapist strengthens your genuine contribution.',
      12: 'Spiritual practices deepen through honest self-examination rather than blissful escape. This is one of the most powerful periods for distinguishing genuine spiritual experience from pleasant delusion. Truth, however ordinary, is sacred.',
    },
  },
  pluto: {
    general: 'Pluto retrograde takes the process of transformation underground. Deep psychological patterns, power dynamics, and unresolved trauma surface for examination. This is shadow work at its most potent — uncomfortable but ultimately liberating.',
    practiceAdvice: 'Engage with therapeutic practices, journaling, or any form of deep self-inquiry. Allow what needs to die its natural death.',
    personalByHouse: {
      1: 'Deep power dynamics within your sense of identity surface for examination. Where have you been giving your power away, or wielding it unconsciously? This period of intense self-honesty leads to genuine empowerment.',
      2: 'Buried patterns around money, control, and material security demand attention. Compulsive financial behaviours — whether hoarding or overspending — reveal their psychological roots. Understanding these patterns is the first step to freedom.',
      3: 'The power dynamics in your everyday communications become more visible. Notice where you manipulate through words or allow others to silence you. Reclaiming honest, empowered speech transforms your daily interactions.',
      4: 'Deep family patterns — power struggles, control dynamics, or inherited trauma — surface within your private world. This is uncomfortable but necessary excavation. What you uncover and heal now transforms your family legacy.',
      5: 'Creative blocks rooted in deep psychological material surface for attention. Fears about being truly seen, past creative wounds, or compulsive patterns around pleasure and avoidance reveal themselves for healing.',
      6: 'Deep-seated health patterns or compulsive habits around food, exercise, or daily routines demand honest confrontation. The body stores what the mind suppresses — listen to what your physical symptoms are really telling you.',
      7: 'Power dynamics within your closest partnerships come under intense scrutiny. Control patterns, unspoken resentments, and the balance of vulnerability between you and your partner surface for transformation.',
      8: 'This is your deepest and most intense period of psychological work. Shadow material surfaces with particular clarity and force. Therapy, depth psychology, or honest self-examination during this period can be genuinely life-changing.',
      9: 'Fundamental beliefs about power, truth, and meaning undergo radical revision. Ideologies you once held with certainty may crumble, making space for a more authentic and personally earned understanding of reality.',
      10: 'Professional power dynamics, ambition, and your relationship to authority undergo deep examination. Where have you compromised your integrity for advancement, or avoided power out of fear? This honest reckoning strengthens your career foundation.',
      11: 'Your role within group power structures and collective movements becomes clearer. Hidden dynamics within organisations you belong to may surface. Use this insight to either transform these groups from within or walk away with integrity.',
      12: 'The deepest layers of your subconscious reveal themselves during this period. Dreams may be intense, past-life themes may surface, and the boundary between your personal shadow and the collective unconscious thins. Profound healing is available.',
    },
  },
}

export function generateRetrogradeSummary(retrogradeBodyIds: string[]): string {
  if (retrogradeBodyIds.length === 0) return ''

  const validIds = retrogradeBodyIds.filter(id => id in RETROGRADE_READINGS && id !== 'sun' && id !== 'moon')
  if (validIds.length === 0) return ''

  const names = validIds.map(id => {
    const nameMap: Record<string, string> = {
      mercury: 'Mercury', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter',
      saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto',
    }
    return nameMap[id] ?? id
  })

  if (validIds.length === 1) {
    const reading = RETROGRADE_READINGS[validIds[0] as CelestialBodyId]
    return `${names[0]} is currently retrograde. ${reading.general} ${reading.practiceAdvice}`
  }

  const listStr = names.length === 2
    ? `${names[0]} and ${names[1]}`
    : `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`

  const combinedAdvice = validIds
    .map(id => RETROGRADE_READINGS[id as CelestialBodyId].practiceAdvice)
    .join(' ')

  return `${listStr} are all currently retrograde, creating a collective invitation to pause, review, and re-examine. When multiple planets appear to move backward simultaneously, the universe emphasises reflection over action. Old patterns resurface for healing, and the inner world demands more attention than the outer. ${combinedAdvice}`
}
