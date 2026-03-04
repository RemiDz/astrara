export interface AspectInsight {
  name: string
  symbol: string
  nature: string
  generalMeaning: string
}

export const aspectMeanings: Record<string, AspectInsight> = {
  conjunction: {
    name: "Conjunction",
    symbol: "☌",
    nature: "fusion",
    generalMeaning: "Two forces merge into one. Their energies are inseparable today — amplified, intensified, impossible to ignore.",
  },
  sextile: { name: "Sextile", symbol: "⚹", nature: "opportunity", generalMeaning: "A gentle door opens between two energies. Nothing dramatic — just a quiet invitation to grow. Take it." },
  square: { name: "Square", symbol: "□", nature: "tension", generalMeaning: "Friction builds between two forces. This isn't comfortable, but it's productive. Growth rarely comes from ease." },
  trine: { name: "Trine", symbol: "△", nature: "harmony", generalMeaning: "Two energies flow together effortlessly. Gifts arrive without struggle. The danger? Taking this ease for granted." },
  opposition: { name: "Opposition", symbol: "☍", nature: "polarity", generalMeaning: "Two forces pull in opposite directions. The challenge is balance — not choosing one over the other, but honouring both." },
}

// Specific planet-pair aspect meanings for the most impactful combinations
export const planetPairAspects: Record<string, Record<string, string>> = {
  "sun-moon": {
    conjunction: "Your inner world and outer self are perfectly aligned. What you feel is what you show. Authenticity comes naturally today.",
    opposition: "Your needs and your identity pull in different directions. Honour what you feel, even if it contradicts your plans.",
    square: "Inner tension between who you are and what you need. Sit with the discomfort — it's teaching you something important.",
    trine: "Emotional ease flows through your day. You feel at home in yourself. Others sense your calm confidence.",
    sextile: "A quiet moment of self-understanding. Your emotions and actions align in small but meaningful ways.",
  },
  "sun-mercury": {
    conjunction: "Mind and identity merge. Your words carry extra weight today — use them wisely.",
    square: "Your thoughts may clash with your sense of self. Inner debate leads to clarity if you let it.",
    trine: "Clear thinking meets confident expression. Excellent for presentations, writing, or important conversations.",
    sextile: "Ideas flow smoothly into speech. A good day for planning and communicating your vision.",
  },
  "sun-venus": {
    conjunction: "Love and identity merge. You radiate warmth and attract beauty naturally.",
    square: "What you want and what you value may clash. Check if you're pursuing pleasure or meaning.",
    trine: "Grace and charm come effortlessly. Relationships feel easy. Treat yourself — you've earned it.",
    sextile: "Small pleasures bring big satisfaction. Reach out to someone you appreciate.",
  },
  "sun-mars": {
    conjunction: "Willpower is supercharged. You can move mountains today — just don't burn bridges while doing it.",
    opposition: "Your drive meets resistance from others. Channel competitive energy into personal bests, not conflicts.",
    square: "Frustration sparks action. The key is directing anger into creation, not destruction.",
    trine: "Energy and confidence align beautifully. Physical activity feels amazing. Take bold action.",
    sextile: "Steady motivation meets clear purpose. Good for tackling tasks you've been avoiding.",
  },
  "sun-jupiter": {
    conjunction: "Optimism and possibility expand. Think bigger than usual — the universe is offering more than you expect.",
    opposition: "Excess tempts you. Grand plans need grounding. Dream big but budget realistically.",
    square: "Overconfidence is the only danger. Your ambitions are valid — just verify the details.",
    trine: "Luck and wisdom align. Opportunities appear that match your true path. Say yes.",
    sextile: "Quiet abundance. Growth happens naturally when you follow your curiosity today.",
  },
  "sun-saturn": {
    conjunction: "Discipline meets purpose. Hard work feels meaningful, not heavy. Build something that lasts.",
    opposition: "Responsibilities weigh heavily. Remember: duty fulfilled with love isn't a burden, it's a legacy.",
    square: "Obstacles feel personal. They're not — they're invitations to prove your resilience.",
    trine: "Patience and ambition work together beautifully. Long-term plans crystallize.",
    sextile: "Structure supports creativity. Set boundaries that free you rather than confine you.",
  },
  "venus-mars": {
    conjunction: "Desire meets attraction. Chemistry is electric. Both in romance and creative pursuits, passion ignites.",
    opposition: "Attraction and assertion pull apart. What you want and how you pursue it need reconciling.",
    square: "Tension between desire and action. The spark is there — but are you chasing or connecting?",
    trine: "Romance and passion flow naturally. Creative energy is high. Make beautiful things.",
    sextile: "Gentle magnetism. Social encounters carry a pleasant charge. Flirtation is playful, not heavy.",
  },
  "venus-jupiter": {
    conjunction: "Love expands beyond limits. Generosity, beauty, and joy magnify. Indulgence is the only risk.",
    trine: "Everything lovely gets lovelier. Relationships deepen with ease. Abundance feels natural.",
    square: "Too much of a good thing. Overspending, overindulging, over-promising. Enjoy, but set a limit.",
    sextile: "Social grace meets good fortune. A pleasant surprise in love or finances is possible.",
  },
  "venus-saturn": {
    conjunction: "Love gets serious. Commitments deepen. What isn't real falls away — and that's a gift.",
    opposition: "Coldness in relationships may surface. It's not lovelessness — it's a call for more honesty.",
    square: "Love feels restricted or tested. The relationships that survive this are the ones worth keeping.",
    trine: "Loyalty and devotion bring quiet joy. Lasting bonds strengthen. Beauty has substance today.",
    sextile: "Practical love. Small acts of commitment matter more than grand gestures.",
  },
  "venus-pluto": {
    conjunction: "A transformative encounter is possible. Something — or someone — shifts your heart permanently.",
    opposition: "Power dynamics surface in relationships. Control isn't love. Release your grip to find real connection.",
    square: "Deep emotions surface in relationships today. Jealousy or intensity may arise — let feelings flow without forcing resolution.",
    trine: "Love deepens effortlessly. Vulnerability becomes a strength. Transformation feels like coming home.",
    sextile: "Emotional honesty opens doors. A conversation goes deeper than expected — and that's a good thing.",
  },
  "mars-jupiter": {
    conjunction: "Energy and optimism combine. You feel unstoppable — and today, you might actually be.",
    opposition: "Enthusiasm outpaces judgement. Slow down just enough to aim before you fire.",
    square: "Impatience meets overconfidence. The goal is real — the timeline needs adjusting.",
    trine: "Action and luck align. Take that risk you've been considering. Fortune favours the bold.",
    sextile: "Productive optimism. Energy flows toward meaningful goals with minimal wasted effort.",
  },
  "mars-saturn": {
    conjunction: "Controlled power. Like a martial artist — every move is precise, purposeful, devastating.",
    opposition: "Action meets immovable obstacles. Don't force it. Redirect your energy to where the door is open.",
    square: "Frustration builds when action meets resistance. Patience is your superpower today.",
    trine: "Disciplined action achieves lasting results. Stamina and strategy work as one.",
    sextile: "Steady progress. Not exciting, but deeply satisfying. Brick by brick, the wall rises.",
  },
  "mars-pluto": {
    conjunction: "Raw transformative power. Channel this carefully — it can build empires or burn them.",
    opposition: "Power struggles intensify. Choose your battles. Not every hill is worth dying on.",
    square: "Intensity demands an outlet. Without one, this energy turns destructive. Exercise, create, transform.",
    trine: "Deep reserves of strength surface. You're more powerful than you know. Use it wisely.",
    sextile: "Quiet intensity fuels purposeful action. Research, investigation, and deep work thrive.",
  },
  "jupiter-saturn": {
    conjunction: "Expansion meets structure. Dreams get blueprints. This is where castles in the air find foundations.",
    opposition: "Growth and restriction pull apart. Balance ambition with reality. Both voices have wisdom.",
    square: "Optimism clashes with pragmatism. Neither is wrong — find the middle path.",
    trine: "Wise growth. Expansion that's sustainable. Plans that are both ambitious and achievable.",
    sextile: "Practical wisdom guides decisions. A mentor or elder may offer valuable perspective.",
  },
  "saturn-pluto": {
    conjunction: "Deep structural transformation. Old systems crumble so new ones can emerge. This is heavy but necessary.",
    opposition: "Power structures face reckoning. What's built on truth survives. What isn't, doesn't.",
    square: "Intense pressure to transform. The squeeze is uncomfortable but the diamond is worth it.",
    trine: "Deep, lasting transformation proceeds smoothly. The hard work of change feels purposeful.",
    sextile: "Subtle but profound shifts in power dynamics. Evolution rather than revolution.",
  },
}
