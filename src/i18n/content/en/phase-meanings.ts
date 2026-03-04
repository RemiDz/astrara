export interface PhaseInsight {
  meaning: string
  guidance: string
}

export const phaseMeanings: Record<string, PhaseInsight> = {
  "new-moon": {
    meaning: "The sky is dark, and the slate is clean. The New Moon is a seed planted in the invisible — a whispered intention that has yet to find its form. This is the cosmic exhale before the inhale, the fertile void where all beginnings live.",
    guidance: "Set intentions, not goals. Write down what you want to call into your life, then release attachment to how it arrives. Start quietly. Plant seeds in the dark and trust they know how to grow.",
  },
  "waxing-crescent": {
    meaning: "The first sliver of light appears — fragile, hopeful, determined. The Waxing Crescent is the moment your intention meets the real world. Doubt may whisper, but the light is already growing. Something has begun that cannot be undone.",
    guidance: "Take your first concrete step. Gather resources, make a plan, tell someone you trust. This is not the time for grand action — it's the time for committed, quiet momentum. Keep going even if you can't see the full path yet.",
  },
  "first-quarter": {
    meaning: "Half the Moon is lit, half is shadow — and you stand at the crossroads. The First Quarter is a crisis of action. Obstacles appear not to stop you but to test your commitment. The easy path and the right path diverge here.",
    guidance: "Make decisions. Push through resistance. The challenges you face now are not signs to quit — they're the universe asking how badly you want this. Adjust your approach if needed, but don't abandon your intention.",
  },
  "waxing-gibbous": {
    meaning: "The light swells toward fullness. The Waxing Gibbous is the refining phase — the sculptor's careful hand removing what doesn't belong. You can almost see the final shape of what you've been building. Patience and precision matter now.",
    guidance: "Refine, adjust, and perfect. Review your progress with honest eyes. What needs tweaking? What needs releasing? This is not the time to start over — it's the time to polish what's already in motion. Trust your process.",
  },
  "full-moon": {
    meaning: "The Moon blazes in her full glory — everything is illuminated, nothing can hide. The Full Moon is revelation, culmination, and harvest. What you planted at the New Moon now shows its face. Emotions run high because truth runs deep.",
    guidance: "Celebrate what has come to fruition. Acknowledge your growth. But also be honest about what the light reveals — if something isn't working, the Full Moon will show you clearly. Release what no longer serves your highest path.",
  },
  "waning-gibbous": {
    meaning: "The light begins its graceful retreat. The Waning Gibbous — also called the Disseminating Moon — is the teacher's phase. You've learned something valuable and now it's time to share it. Wisdom crystallizes through the act of giving it away.",
    guidance: "Share what you've learned. Mentor, teach, write, or simply have meaningful conversations. Gratitude is your superpower now. Reflect on what worked and offer your insights generously. The universe rewards those who pass the torch.",
  },
  "last-quarter": {
    meaning: "Half light, half shadow again — but this time you're facing the other direction. The Last Quarter is a crisis of meaning. Old structures that no longer serve you become impossible to ignore. Something must be released before the next cycle can begin.",
    guidance: "Let go with grace. Forgive, declutter, end what has run its course. This is not failure — it's composting. Every ending nourishes a new beginning. Make space in your life, your mind, and your heart for what's coming next.",
  },
  "waning-crescent": {
    meaning: "The last thin crescent fades into the approaching dark. The Waning Crescent — the Balsamic Moon — is the most mystical phase. The veil between worlds thins. Dreams speak louder. The soul prepares for renewal through deep, sacred rest.",
    guidance: "Rest. Truly rest. This is not laziness — it's essential preparation. Meditate, dream, journal, or simply be still. Surrender control and trust the darkness. The new cycle is already forming in the silence. You don't need to do anything — just be.",
  },
}
