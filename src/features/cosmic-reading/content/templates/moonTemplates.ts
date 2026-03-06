import type { ZodiacSign } from '../../types'

// === MOON PHASE READINGS ===

export interface MoonPhaseReading {
  general: string
  themeKeywords: string[]
}

export const MOON_PHASES: Record<string, MoonPhaseReading> = {
  'New Moon': {
    general: 'The sky is dark and the Moon is hidden — a powerful moment for intention setting. This is the cosmic reset point, where old cycles dissolve and new ones are seeded in silence. Plant your intentions gently today; they do not need to be perfect, only sincere. Trust the darkness as fertile ground.',
    themeKeywords: ['beginnings', 'intention', 'planting seeds', 'fresh start'],
  },
  'Waxing Crescent': {
    general: 'A thin sliver of light returns to the sky, and with it, a sense of emerging clarity. The intentions you set at the New Moon are beginning to take root. This is a time to take small, deliberate first steps — not to rush, but to build momentum with faith. Courage grows quietly now.',
    themeKeywords: ['growth', 'momentum', 'first steps', 'emerging clarity'],
  },
  'First Quarter': {
    general: 'The Moon reaches its first square to the Sun, bringing a moment of creative tension. Decisions may feel pressing and obstacles may surface — these are not setbacks but invitations to act with determination. This is the phase where intentions meet reality. Choose your path and move forward with conviction.',
    themeKeywords: ['determination', 'action', 'decisions', 'overcoming obstacles'],
  },
  'Waxing Gibbous': {
    general: 'The Moon is nearly full, and the light is building steadily. This is a time of refinement and patience — your efforts are taking shape, even if the results are not yet fully visible. Trust the process without forcing outcomes. Small adjustments made now will have a significant impact when the Full Moon arrives.',
    themeKeywords: ['perseverance', 'refinement', 'patience', 'trust'],
  },
  'Full Moon': {
    general: 'The Moon stands fully illuminated, opposite the Sun, and whatever has been building reaches a peak. Emotions run high, clarity arrives suddenly, and hidden truths may surface. This is a moment of culmination and revelation — celebrate what has come to fruition, and allow yourself to see clearly what needs to shift.',
    themeKeywords: ['revelation', 'culmination', 'illumination', 'heightened emotions'],
  },
  'Waning Gibbous': {
    general: 'The Full Moon is behind you, and the light begins to soften. This is a generous, reflective phase — a time to share what you have learned and to express gratitude for what has been revealed. Wisdom gathered during the Full Moon can now be offered to others. Teaching, mentoring, and acts of generosity feel especially natural.',
    themeKeywords: ['generosity', 'gratitude', 'sharing wisdom', 'reflection'],
  },
  'Last Quarter': {
    general: 'The Moon reaches its final square, and the energy turns inward. This is the time for release — letting go of what no longer serves you, forgiving what needs forgiveness, and clearing space for what comes next. Old patterns, habits, and attachments can be gently set down now. Surrender is not weakness; it is wisdom.',
    themeKeywords: ['surrender', 'release', 'forgiveness', 'letting go'],
  },
  'Waning Crescent': {
    general: 'The Moon is barely visible, retreating into darkness before the next New Moon. This is the most restful phase of the entire cycle — a time for stillness, solitude, and deep reflection. Your body and spirit are preparing for renewal. Honour this quiet interval by slowing down and listening inward.',
    themeKeywords: ['stillness', 'rest', 'reflection', 'preparation'],
  },
}

// === MOON IN SIGN READINGS ===

export interface MoonInSignReading {
  general: string
  themeKeywords: string[]
  personalByHouse: Record<number, string>
}

export const MOON_IN_SIGN: Record<ZodiacSign, MoonInSignReading> = {
  aries: {
    general: 'The Moon in Aries ignites emotional spontaneity. Bold feelings rise to the surface — this is a time to act on instinct rather than overthink. Emotional courage is available to all.',
    themeKeywords: ['courage', 'spontaneity', 'initiative'],
    personalByHouse: {
      1: 'You feel an electric surge of personal confidence today. Trust your instincts about who you are and what you want — bold self-expression is favoured right now.',
      2: 'A sudden urge to spend on something that excites you may arise. Channel this fiery impulse into reviewing your financial goals rather than making impulsive purchases — your values deserve the same courage you bring to everything else.',
      3: 'Words come fast and direct under this Moon. You may feel compelled to speak your mind without filtering — which can be refreshing, but take a breath before sending that message. Honest conversation clears the air beautifully if delivered with care.',
      4: 'Restless energy stirs in your home life. You might feel the urge to rearrange, declutter, or have a direct conversation with family about something you have been holding back.',
      5: 'Creative fire runs high for you today. A passion project, romantic impulse, or playful adventure calls — follow the spark without overthinking where it leads.',
      6: 'Your body craves movement and release. An intense workout, a brisk walk, or simply tackling your to-do list with fierce energy can channel this Moon\'s restless force through your daily routines.',
      7: 'Passion and directness colour your closest relationships. Speak honestly with your partner or collaborator — they will respect your candour, and clearing the air now prevents resentment from building.',
      8: 'Deep, intense feelings may surface without warning. This Moon stirs the hidden layers of your emotional life — allow whatever arises to be felt fully. Courage in facing your shadows brings genuine freedom.',
      9: 'A hunger for adventure or meaning pulls you outward. Whether it is booking a trip, picking up a new book, or having a philosophical debate, your spirit needs expansion today.',
      10: 'An impulsive career idea may surface. Do not dismiss it — this Aries Moon activates your ambition. Take one bold step toward a professional goal, even if it feels premature.',
      11: 'You may feel called to lead within your social circle or champion a cause that matters to you. Your pioneering spirit inspires others — use this influence to rally people around a shared vision.',
      12: 'Inner restlessness signals a need for spiritual reset. Active meditation, breathwork, or journaling can help channel this fiery energy inward. Pay attention to vivid dreams or sudden intuitive flashes.',
    },
  },
  taurus: {
    general: 'The Moon in Taurus grounds the emotional body in comfort and steadiness. There is a deep need for stability, good food, and sensory pleasure today. Slow down and savour what is already here.',
    themeKeywords: ['comfort', 'stability', 'sensory pleasure'],
    personalByHouse: {
      1: 'Your sense of self feels grounded and steady today. There is a quiet confidence in simply being — no need to prove anything. Honour your body\'s need for comfort and presence.',
      2: 'Financial matters feel particularly pressing, but in a stabilising way. This is an excellent time to review your budget, appreciate what you already have, and make practical decisions about money and resources.',
      3: 'Conversations slow down and become more deliberate. You prefer substance over small talk today — meaningful exchanges about practical matters or shared pleasures feel most satisfying.',
      4: 'Your home becomes a sanctuary today. Cooking a good meal, tending to your living space, or simply resting in familiar surroundings feeds your soul deeply. Invest in your comfort.',
      5: 'Sensory creativity flourishes — working with your hands, cooking, gardening, or making music feels deeply satisfying. Romance, too, takes on a warm, unhurried quality. Savour rather than rush.',
      6: 'Your body asks for nourishment and rest rather than intensity. Gentle movement, wholesome food, and a steady pace through your daily tasks bring genuine satisfaction and wellbeing.',
      7: 'Loyalty and reliability matter most in your partnerships today. Show up consistently for the people who matter — and notice who shows up consistently for you. Stability is a form of love.',
      8: 'You may resist change today, preferring the familiar over the unknown. Yet something beneath the surface is quietly shifting. Allow small transformations without forcing dramatic upheaval.',
      9: 'Philosophical questions take a practical turn — you want wisdom you can actually apply. A nature walk, a visit somewhere beautiful, or learning a hands-on skill satisfies this Moon\'s earthy wanderlust.',
      10: 'Professional matters benefit from patience and persistence rather than bold moves. Build steadily, focus on quality over speed, and trust that consistent effort creates lasting reputation.',
      11: 'You gravitate toward friends and groups that feel reliable and genuine. Superficial social interactions drain you today — seek out the people who share your values and appreciate authenticity.',
      12: 'A quiet, embodied spirituality calls to you. Sitting in nature, practising slow breathing, or simply being still allows your inner world to settle and restore. Trust the wisdom of stillness.',
    },
  },
  gemini: {
    general: 'The Moon in Gemini quickens the mind and stirs curiosity. Conversations feel stimulating, ideas flow freely, and there is a restless need for variety. Journaling, reading, or a good talk with a friend can satisfy the emotional appetite.',
    themeKeywords: ['curiosity', 'communication', 'mental stimulation'],
    personalByHouse: {
      1: 'Your mind is buzzing and your sense of self feels multifaceted today. You may want to try on different roles or explore new sides of your personality. Curiosity about who you are becoming is a gift.',
      2: 'Financial ideas come rapidly — side projects, investments, or creative ways to earn may flash through your mind. Write them down before they vanish, but wait a day before acting on any of them.',
      3: 'This Moon lands directly in your communication zone, amplifying everything it touches. Words flow easily, conversations spark new ideas, and connecting with siblings, neighbours, or local community feels especially rewarding.',
      4: 'Your home life feels busier than usual — phone calls, messages, visitors, or family discussions fill the space. Embrace the social energy in your private world, but carve out moments of quiet if it becomes overwhelming.',
      5: 'Playful, witty creative energy is abundant. Writing, word games, comedy, or any art form that involves language and ideas thrives under this Moon. Romance, too, benefits from clever conversation and lightness.',
      6: 'Mental restlessness may disguise itself as physical agitation. Vary your daily routine — a different walking route, a new podcast during chores, or simply rearranging your workspace can satisfy the need for novelty.',
      7: 'Communication is the key to your partnerships today. Have the conversation you have been postponing, share an interesting article with your partner, or simply enjoy the pleasure of talking together without an agenda.',
      8: 'Curiosity draws you toward deeper subjects — psychology, mystery, or taboo topics. Exploring these intellectually rather than emotionally can bring surprising insights about your own hidden patterns.',
      9: 'Your mind reaches for the big picture. Enrol in a short course, read widely, or engage in a spirited debate about beliefs. Intellectual expansion feeds your soul more than physical travel today.',
      10: 'Networking and communication skills are your professional superpower right now. Share your ideas, write that proposal, or make the call you have been putting off — your words carry extra weight.',
      11: 'Social connections multiply and energise you. Group chats, community events, or brainstorming sessions with friends feel stimulating. You are the connector today — bring people and ideas together.',
      12: 'Your inner world is talkative — thoughts race and the mind resists stillness. Journaling, guided meditation, or reading spiritual texts can channel this mental energy into meaningful inner exploration.',
    },
  },
  cancer: {
    general: 'The Moon is at home in Cancer, deepening sensitivity and the need for emotional safety. Nurturing yourself and others feels instinctive today. Home, family, and familiar comforts hold special meaning.',
    themeKeywords: ['nurturing', 'home', 'emotional safety'],
    personalByHouse: {
      1: 'Your emotional sensitivity is heightened and your personal energy turns inward. Honour whatever feelings arise without judging them — this Moon invites you to be tender with yourself.',
      2: 'Financial security feels more emotionally charged than usual. The desire to feel safe through material comfort is strong. Review your savings or create a budget that genuinely supports your wellbeing.',
      3: 'Conversations take on an emotional depth today. You may find yourself sharing more vulnerably with siblings, neighbours, or close contacts. Heartfelt exchanges can heal old misunderstandings.',
      4: 'This Moon activates your deepest sense of home and belonging. Cooking a family recipe, calling a parent, or simply nesting in your favourite space brings profound comfort and emotional renewal.',
      5: 'Your creative expression draws from deep emotional wells today. Art, music, or writing that channels your feelings can be genuinely moving — both for you and anyone who experiences it. Romance feels tender and intimate.',
      6: 'Emotional stress may manifest physically today. Pay attention to your stomach and digestive system. Warm, nourishing food, gentle routines, and adequate rest are more important than pushing through.',
      7: 'You need emotional attunement from your closest relationships. Ask for comfort if you need it, and offer it generously in return. Vulnerability is strength in partnerships right now.',
      8: 'Deep emotional currents run through you today, stirring memories, attachments, and old wounds. Allow the feelings to surface — processing them honestly is the most healing thing you can do.',
      9: 'Your search for meaning turns emotional and personal. Rather than abstract philosophy, you crave wisdom rooted in lived experience — stories, traditions, and teachings that speak to the heart.',
      10: 'Your professional life benefits from emotional intelligence today. Read the room, trust your intuition about colleagues, and lead with empathy. People respond to genuine care more than polished performance.',
      11: 'You seek emotional belonging within your social circles. Surface-level interactions leave you cold — look for the friends and groups where you can be authentically yourself without pretence.',
      12: 'The boundary between your conscious mind and deeper psyche is thin. Dreams may be vivid and emotionally charged. A gentle meditation practice focused on self-compassion can bring profound inner peace.',
    },
  },
  leo: {
    general: 'The Moon in Leo warms the heart and calls for creative expression. There is a need to be seen, appreciated, and celebrated. Generosity flows easily, and joy is found in playfulness, art, and heartfelt connection.',
    themeKeywords: ['creativity', 'self-expression', 'warmth'],
    personalByHouse: {
      1: 'You radiate warmth and confidence today. Your personal magnetism is amplified — this is a time to show up fully as yourself, without dimming your light for anyone. Others are drawn to your authenticity.',
      2: 'Generosity with money and resources feels natural, but ensure it aligns with your values rather than a desire for recognition. Investing in things that bring genuine joy — not just status — is the wisest use of this energy.',
      3: 'Your words carry dramatic flair and heartfelt conviction. Public speaking, creative writing, or any form of expressive communication shines today. Share your story — people are listening.',
      4: 'You may want to make your home more beautiful, host a gathering, or bring warmth and celebration into your private world. Your family benefits from your generous, open-hearted presence.',
      5: 'Creative fire burns brightly and joyfully. This Moon lands in its most natural territory for you — artistic expression, romance, play, and anything that makes your heart sing are deeply favoured.',
      6: 'Your daily routines benefit from a touch of flair and pleasure. Make your workout feel like a celebration, prepare food that delights the senses, and approach mundane tasks with pride rather than drudgery.',
      7: 'You want to be appreciated and admired by your partner or closest collaborator. Express your affection generously and openly — and allow yourself to receive the same warmth in return.',
      8: 'Pride may resist the vulnerability that deep transformation requires. Yet beneath your confident exterior, something is shifting. Allow yourself to be seen in your wholeness — strength and tenderness together.',
      9: 'Grand adventures and expansive learning call to you. Whether it is travelling to an inspiring destination or diving into a subject that ignites your passion, your spirit craves meaningful expansion.',
      10: 'Your professional presence is commanding today. Step into leadership, present your ideas with confidence, and allow your natural authority to shine. Recognition for your efforts is closer than you think.',
      11: 'You are drawn to lead or inspire within your social circles. Organise a gathering, champion a collective cause, or simply bring your warmth to a group setting — your generosity of spirit lifts everyone.',
      12: 'Creative visualisation and heart-centred meditation work beautifully for you today. Your inner world needs warmth and light — approach your spiritual practice with the same passion you bring to everything else.',
    },
  },
  virgo: {
    general: 'The Moon in Virgo brings a quiet urge to organise, refine, and attend to the details of daily life. Emotional fulfilment comes through service, problem-solving, and creating order from chaos. Be gentle with yourself — perfectionism is the shadow here.',
    themeKeywords: ['organisation', 'service', 'refinement'],
    personalByHouse: {
      1: 'A quiet urge to improve yourself surfaces today. Channel this constructively — gentle refinement rather than harsh self-criticism. Your attention to detail and desire for integrity are genuine strengths.',
      2: 'Financial organisation comes naturally under this Moon. Reviewing budgets, sorting receipts, or creating a practical savings plan brings genuine satisfaction and a sense of order to your material world.',
      3: 'Your thinking is precise and analytical today. Editing, proofreading, problem-solving conversations, and detailed planning all benefit from this Moon\'s sharp mental focus. Speak with care and clarity.',
      4: 'Cleaning, organising, and tending to household details brings emotional satisfaction. Your home environment directly affects your inner peace right now — creating order in your space creates calm in your mind.',
      5: 'Your creative work benefits from meticulous attention to craft. Refine rather than start from scratch — editing a draft, perfecting a technique, or polishing a project yields better results than beginning something new.',
      6: 'This Moon activates your daily health and wellness with particular strength. Schedule that check-up, revise your diet, or establish a more sustainable daily rhythm. Small, practical improvements add up to significant wellbeing.',
      7: 'You may notice imperfections in your partnerships more acutely than usual. Practise discernment without criticism — offering helpful support is generous, but expecting perfection from others leads to frustration.',
      8: 'Analytical energy applied to your deeper psychological patterns can yield real breakthroughs. Journaling, therapy, or honest self-assessment helps you understand and heal what has been hidden.',
      9: 'You crave practical wisdom — not grand theories but applicable knowledge. A workshop, a skill-building course, or reading that offers concrete guidance satisfies this Moon\'s hunger for useful learning.',
      10: 'Professional diligence and attention to quality set you apart today. Focus on doing excellent work rather than seeking attention. Your thoroughness will be noticed by the people who matter most.',
      11: 'You are most helpful to your community when you contribute practical skills rather than just good intentions. Volunteer your expertise, organise logistics, or help a friend solve a tangible problem.',
      12: 'The inner critic may be louder than usual. Counter it with a mindfulness practice that emphasises acceptance over improvement. You do not need to fix your inner world — just observe it with compassion.',
    },
  },
  libra: {
    general: 'The Moon in Libra seeks harmony and balance. Relationships take centre stage — this is a time for meaningful conversations, compromise, and appreciating beauty in your surroundings. Diplomacy comes naturally, but be mindful of people-pleasing.',
    themeKeywords: ['harmony', 'relationships', 'balance'],
    personalByHouse: {
      1: 'Your sense of self is filtered through your connections with others today. While harmony is valuable, ensure you are not losing yourself in the process of keeping the peace. Your needs matter too.',
      2: 'Financial decisions benefit from weighing all options carefully. This is a good time for joint financial planning, negotiating fair agreements, or investing in beauty and aesthetics that enrich your daily life.',
      3: 'Diplomacy comes naturally to your conversations. You instinctively find the right words to soothe, mediate, and connect. Use this gift to facilitate understanding between people who see things differently.',
      4: 'Beautifying your home environment brings deep emotional satisfaction. Fresh flowers, rearranged furniture, or simply creating a more harmonious atmosphere in your private space nourishes your spirit.',
      5: 'Artistic expression flows with grace and elegance. Collaborative creative projects are especially favoured — working with a partner or small group produces something more beautiful than you could create alone.',
      6: 'Balance is the keyword for your wellbeing today. Neither overwork nor complete rest — find the middle path. Gentle movement paired with aesthetic pleasure, such as yoga in a beautiful setting, suits this Moon perfectly.',
      7: 'This Moon lands directly in your partnership zone, amplifying your need for connection, fairness, and mutual understanding. Honest, balanced conversations with your closest person can deepen intimacy significantly.',
      8: 'Deep changes are easier to navigate when you do not face them alone. Share your inner process with someone you trust — the mirror of relationship helps you see your transformation more clearly.',
      9: 'Your intellectual curiosity gravitates toward art, culture, and ideas about justice and beauty. Visit a gallery, explore a different cultural perspective, or read about the philosophy of aesthetics.',
      10: 'Professional relationships and diplomacy are your strongest career assets today. Networking, mediating workplace tensions, or presenting ideas with grace and charm advances your position naturally.',
      11: 'Social harmony within your groups and friendships matters deeply. You may find yourself mediating between friends or bringing balance to a community dynamic. Your fairness is genuinely appreciated.',
      12: 'Inner peace comes through finding balance between solitude and connection. A meditation practice focused on equilibrium — balancing breath, balancing energy — helps you access deeper serenity.',
    },
  },
  scorpio: {
    general: 'The Moon in Scorpio intensifies emotions and draws attention to what lies beneath the surface. Deep feelings, hidden truths, and powerful instincts come alive. This is a potent time for healing, intimacy, and honest self-examination.',
    themeKeywords: ['intensity', 'depth', 'transformation'],
    personalByHouse: {
      1: 'Emotional intensity colours your entire sense of self today. You feel things deeply and see through surface appearances with penetrating clarity. Use this power wisely — not everyone can handle your depth.',
      2: 'Financial matters take on an intense, strategic quality. This is a powerful time for investigating investments, eliminating unnecessary expenses, or confronting money fears honestly. Financial truth-telling leads to empowerment.',
      3: 'Your words carry unusual weight and depth today. Conversations may veer into emotionally charged territory — this can be profoundly healing if approached with honesty, or destructive if wielded carelessly.',
      4: 'Powerful emotions about family, roots, and belonging may surface. Old family dynamics or childhood memories ask for your attention. Healing work done in the privacy of your own space is deeply transformative.',
      5: 'Creative expression plunges into the depths today. Art, writing, or music that explores intense themes — love, loss, power, rebirth — channels this Moon\'s energy into something genuinely moving.',
      6: 'Hidden health patterns may come to your attention. Listen to your body\'s subtler signals and investigate anything that has been nagging. Elimination, detoxification, and releasing what no longer serves your physical wellbeing are favoured.',
      7: 'Intimacy and honesty define your partnerships today. Surface-level pleasantries feel hollow — you crave genuine emotional connection and are willing to go to uncomfortable places to find it.',
      8: 'This Moon activates your most transformative zone with extraordinary power. Deep psychological work, confronting fears, and allowing emotional death-and-rebirth cycles to complete themselves is profoundly healing.',
      9: 'Your quest for meaning goes beyond the intellectual — you want to know the hidden truth beneath appearances. Esoteric studies, depth psychology, or travelling to places with powerful spiritual history calls to you.',
      10: 'Strategic thinking and emotional intelligence give you a professional advantage. You can read power dynamics clearly and navigate complex situations with precision. Use this insight ethically for lasting career growth.',
      11: 'You seek depth in your friendships and group connections. Superficial social gatherings drain you — one meaningful conversation with a trusted friend is worth more than a room full of acquaintances.',
      12: 'The veil between your conscious mind and the unconscious is exceptionally thin. Dreams, synchronicities, and psychic impressions may be unusually vivid. Trust what surfaces from the depths — it carries wisdom.',
    },
  },
  sagittarius: {
    general: 'The Moon in Sagittarius lifts the emotional tone toward optimism and adventure. There is a hunger for meaning, expansion, and freedom. Exploration — whether physical travel or philosophical inquiry — feeds the soul today.',
    themeKeywords: ['optimism', 'adventure', 'expansion'],
    personalByHouse: {
      1: 'Optimism and restless energy infuse your sense of self. You feel larger than your usual boundaries and crave freedom to explore, grow, and discover new aspects of who you are becoming.',
      2: 'Generosity with money comes naturally, but watch for overextending. This is a good time to invest in education, travel, or experiences that broaden your horizons rather than accumulating possessions.',
      3: 'Your conversations are animated by big ideas and infectious enthusiasm. You speak with conviction and inspire others with your vision. Just ensure you listen as generously as you speak.',
      4: 'Your home may feel too small for your spirit today. If you cannot physically travel, bring the world home — cook a foreign cuisine, video-call a distant friend, or rearrange your space to feel more open and expansive.',
      5: 'Joy and creative freedom are abundant. Follow whatever sparks your enthusiasm without worrying about perfection. Playful experimentation, adventurous dates, or spontaneous creative expression feeds your soul.',
      6: 'Outdoor exercise and movement that feels like adventure rather than obligation suits you perfectly. A hike, a new sport, or simply exploring an unfamiliar part of your neighbourhood benefits both body and spirit.',
      7: 'Freedom and honesty are what you need most from partnerships right now. Give your closest person space to be themselves, and claim the same for yourself. The best relationships make both people feel larger.',
      8: 'You prefer to process deep emotions through meaning-making rather than sitting in discomfort. Finding the lesson, the growth, or the philosophical purpose in your pain is genuinely healing — not avoidance.',
      9: 'This Moon lands in its most natural territory for you — your zone of wisdom, travel, and philosophical inquiry. Whether you book a journey, start a course, or simply follow your curiosity wherever it leads, expansion is inevitable.',
      10: 'Big-picture career thinking is favoured over day-to-day details. Where do you want to be in five years? What legacy do you want to build? Let this Moon\'s visionary energy inform your professional direction.',
      11: 'You are drawn to communities that share your ideals and love of learning. Teaching, mentoring, or joining a group united by a shared philosophy or cause feels deeply satisfying and purposeful.',
      12: 'Spiritual restlessness drives you to explore beyond your usual practices. A new tradition, a pilgrimage, or simply asking bigger questions about existence can open doors you did not know were there.',
    },
  },
  capricorn: {
    general: 'The Moon in Capricorn steadies the emotional landscape with a focus on responsibility and long-term goals. There is a quiet determination in the air — feelings are processed practically, and accomplishment brings deep satisfaction.',
    themeKeywords: ['discipline', 'ambition', 'responsibility'],
    personalByHouse: {
      1: 'A composed, determined energy settles over your sense of self. You feel capable and ready to handle whatever comes. This quiet strength is genuine — trust it and let it guide your actions today.',
      2: 'Financial discipline and long-term planning feel natural and satisfying. This is an excellent time to set savings goals, review investments, or make practical decisions about your material security.',
      3: 'Your words carry authority and gravitas today. Conversations about practical matters, professional plans, or serious topics feel most natural. People trust your judgement when you speak with this kind of quiet conviction.',
      4: 'Responsibilities at home may feel heavier than usual, but tackling them brings deep satisfaction. Structural improvements, long-term family planning, or simply creating more order in your domestic life is grounding.',
      5: 'Creative expression benefits from discipline and structure rather than free-form experimentation. Work within constraints — a specific medium, a deadline, a formal structure — and discover how limitation can be liberating.',
      6: 'Establishing sustainable health routines is strongly favoured. This is not about dramatic overhauls but about building habits that will serve you for years. Start small and commit consistently.',
      7: 'You approach partnerships with maturity and a focus on long-term sustainability. Conversations about commitments, shared responsibilities, or future plans feel productive and grounding.',
      8: 'You process deep changes with remarkable composure. Rather than being swept away by emotional currents, you find solid ground to stand on while allowing transformation to happen at its own pace.',
      9: 'Your search for wisdom favours the practical and proven over the theoretical. Traditional teachings, mentors with real-world experience, and structured learning programmes appeal more than speculative exploration.',
      10: 'This Moon directly activates your professional ambitions and public image. Career decisions made now carry extra weight — step into authority with confidence, and let your competence speak for itself.',
      11: 'You contribute most meaningfully to groups through reliable, practical action rather than grand gestures. Organise, strategise, and build infrastructure for the causes and communities you believe in.',
      12: 'Structured spiritual practice — a regular meditation schedule, a disciplined retreat, or systematic study of a tradition — brings more depth than spontaneous exploration right now.',
    },
  },
  aquarius: {
    general: 'The Moon in Aquarius brings an emotionally detached yet idealistic quality. Community, innovation, and individuality take precedence over personal comfort. This is a time to think about the bigger picture and connect with like-minded people.',
    themeKeywords: ['innovation', 'community', 'individuality'],
    personalByHouse: {
      1: 'You feel slightly detached from your usual identity, as though observing yourself from a higher perspective. This emotional distance is not coldness — it is the freedom to see yourself clearly and choose who you want to be.',
      2: 'Unconventional approaches to money and resources appeal to you today. Consider innovative saving tools, ethical investments, or creative income streams that align with your values rather than following conventional financial advice.',
      3: 'Your thinking is original and forward-looking. Ideas that seem unusual or ahead of their time flow freely. Share them — even if they feel strange, they may spark something valuable in others.',
      4: 'You may crave more independence within your home life or feel inspired to make your living space more unique and unconventional. Technology upgrades, unusual decor, or simply breaking a domestic routine feels refreshing.',
      5: 'Experimental, boundary-pushing creative expression thrives under this Moon. Embrace the unconventional — mix genres, try new technologies, or create art that challenges rather than comforts. Innovation is your muse.',
      6: 'Alternative or progressive approaches to health and wellness appeal strongly. Biohacking, unconventional therapies, or simply questioning whether your current routines truly serve you can lead to meaningful improvements.',
      7: 'You need intellectual stimulation and independence within your partnerships. Have a conversation about ideas rather than feelings, give each other space, and appreciate the ways your partner is uniquely themselves.',
      8: 'Emotional detachment can actually serve transformation today — stepping back to observe your patterns objectively rather than being consumed by them offers a kind of clarity that feeling alone cannot provide.',
      9: 'Cutting-edge ideas, scientific frontiers, and humanitarian philosophies capture your imagination. Your quest for knowledge gravitates toward what is innovative, progressive, and potentially world-changing.',
      10: 'Professional innovation and thinking ahead of the curve distinguish you today. Propose the unconventional idea, challenge outdated processes, or position yourself as someone who sees where things are headed.',
      11: 'This Moon directly activates your social and humanitarian zone. Group activities, community organising, or connecting with like-minded people around a shared vision feels deeply energising and purposeful.',
      12: 'Your spiritual life benefits from a more detached, observational approach. Meditation practices that develop witness consciousness — watching thoughts without attachment — are particularly powerful right now.',
    },
  },
  pisces: {
    general: 'The Moon in Pisces dissolves emotional boundaries and heightens empathy, creativity, and spiritual sensitivity. Dreams may be vivid and intuition especially keen. This is a time for compassion, artistic expression, and gentle surrender to the flow of life.',
    themeKeywords: ['empathy', 'intuition', 'spiritual sensitivity'],
    personalByHouse: {
      1: 'Your personal boundaries soften and your sense of self becomes more fluid. You may absorb the emotions of those around you more easily than usual. Protect your energy while remaining open to the beauty of this heightened sensitivity.',
      2: 'Financial clarity may be elusive today — numbers blur and practical decisions feel harder. Avoid major financial commitments and instead focus on the deeper question of what truly brings you a sense of abundance and security.',
      3: 'Words take on a poetic, intuitive quality. You communicate through feeling as much as logic — this makes you a compassionate listener and an inspiring speaker, even if precision is not your strength today.',
      4: 'Your home becomes a refuge for your spirit. Creating a dreamy, peaceful atmosphere — soft lighting, gentle music, comfortable textures — nourishes your emotional core in ways that nothing else can today.',
      5: 'Artistic inspiration flows without effort. Music, visual art, poetry, or any creative act that channels emotion directly into form feels almost effortless. Romance carries a dreamlike, idealised quality.',
      6: 'Sensitivity to your environment is heightened — noise, chemicals, crowds, or poor food choices may affect you more strongly than usual. Prioritise gentle, nourishing practices and avoid anything that overwhelms your system.',
      7: 'Empathy and compassion define your partnerships today. You sense your partner\'s unspoken needs and respond with intuitive kindness. Ensure this flows both ways — your needs deserve the same gentle attention.',
      8: 'The boundary between your conscious and unconscious mind dissolves today, allowing deep healing to occur naturally. Simply being present with your feelings — without analysing or fixing — is the most transformative act.',
      9: 'Spiritual journeys and mystical teachings call to you more strongly than academic learning. Explore traditions that honour the unseen, attend a retreat, or simply allow your intuition to guide your search for meaning.',
      10: 'Your professional life benefits from imagination and compassion rather than strategy. Healing professions, creative industries, or any work that serves others thrives under this Moon. Trust your intuition about career direction.',
      11: 'You are drawn to communities that share a spiritual or compassionate purpose. Gatherings centred on healing, art, or service to others resonate deeply. Your empathic presence is a gift to any group.',
      12: 'This Moon activates your most spiritually sensitive zone with extraordinary potency. Meditation, prayer, dream work, and surrender to something greater than yourself come naturally. This is a profoundly sacred time for inner work.',
    },
  },
}
