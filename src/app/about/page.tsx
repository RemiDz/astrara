import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Astrara \u00B7 Learning Reference',
  robots: 'noindex, nofollow',
}

const sections = [
  { id: 'celestial-bodies', label: 'The Ten Celestial Bodies' },
  { id: 'zodiac-signs', label: 'The Twelve Zodiac Signs' },
  { id: 'reading-guide', label: 'How to Read a Daily Chart' },
  { id: 'aspects', label: 'Planetary Aspects' },
  { id: 'elements-sound', label: 'Elements & Sound' },
  { id: 'data-sources', label: 'Data Sources' },
  { id: 'frequency-table', label: 'Frequency Reference' },
  { id: 'cheat-sheet', label: 'Quick Reference' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#05050F] text-white/80">
      <div className="max-w-6xl mx-auto px-4 py-12 lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">

        {/* Desktop TOC — sticky sidebar */}
        <nav className="hidden lg:block">
          <div className="sticky top-12">
            <p className="text-xs uppercase tracking-wider text-white/30 mb-4">Contents</p>
            <ul className="space-y-2">
              {sections.map(s => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-sm text-white/40 hover:text-white/80 transition-colors">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Mobile TOC */}
        <details className="lg:hidden mb-8 bg-white/3 rounded-lg border border-white/5 p-4">
          <summary className="text-xs uppercase tracking-wider text-white/40 cursor-pointer">Contents</summary>
          <ul className="mt-3 space-y-2">
            {sections.map(s => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-sm text-white/50 hover:text-white/80 transition-colors">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </details>

        {/* Main content */}
        <div className="max-w-3xl">

          {/* Header */}
          <header className="mb-16">
            <h1 className="text-2xl font-serif text-white/90 mb-2">
              ASTRARA &middot; Learning Reference
            </h1>
            <p className="text-sm text-white/50 italic mb-6">
              A practitioner&apos;s guide to reading the cosmic map
            </p>
            <p className="text-sm leading-relaxed text-white/65">
              This reference covers the astrological meaning of each planet,
              how zodiac signs shape planetary expression, and how to interpret
              the data Astrara provides for readings and sound healing sessions.
            </p>
          </header>

          <Divider />

          {/* SECTION 2: The Ten Celestial Bodies */}
          <section id="celestial-bodies">
            <h2 className="text-2xl font-serif text-white/90 mb-8">The Ten Celestial Bodies</h2>

            <PlanetEntry
              glyph="\u2609"
              name="Sun"
              domain="Core identity, vitality, life purpose, ego, consciousness"
              daily="When the Sun is emphasised by aspect or sign change, you feel a renewed sense of purpose. Your confidence strengthens. Questions of identity and self-expression come to the surface. You notice what genuinely lights you up versus what you do out of habit."
              orbital="Approximately one month per sign. The Sun completes its full zodiac cycle in one year, defining the astrological seasons."
              frequency="126.22 Hz"
              note="B"
              chakra="Solar Plexus and Heart centre"
              sound="Singing bowls tuned to 126 Hz, sun gongs. The Sun frequency is warm and centring. It helps establish a sense of self during meditation. Use it at the start of a session to ground someone in their own identity."
              prominent="A strong Sun placement indicates someone with natural leadership qualities, a clear sense of self, and strong vitality. They tend to be noticed in a room. Their challenge is learning that shining does not require dimming others."
            />

            <PlanetEntry
              glyph="\u263D"
              name="Moon"
              domain="Emotions, instincts, subconscious, nurturing, inner world"
              daily="The Moon sets the emotional temperature of each day. When the Moon changes sign, you may notice a shift in mood that has no obvious external cause. The Moon governs our needs for comfort, safety, and belonging. Pay attention to what your body and heart want, not just what your mind says."
              orbital="Approximately 2.5 days per sign. The Moon is the fastest-moving body in the chart, completing a full cycle every 29.5 days."
              frequency="210.42 Hz"
              note="G#"
              chakra="Sacral centre"
              sound="The Moon frequency is deeply soothing. Crystal bowls tuned near 210 Hz, ocean drums, and water-themed soundscapes resonate with lunar energy. This is the most important frequency for emotional healing sessions. Use it when someone needs to process feelings or release what they have been holding."
              prominent="A strong Moon placement indicates someone deeply intuitive, emotionally rich, and nurturing. They absorb the feelings of those around them. Their challenge is learning that caring for others starts with caring for themselves."
            />

            <PlanetEntry
              glyph="\u263F"
              name="Mercury"
              domain="Communication, thinking, learning, travel, technology"
              daily="When Mercury is active, conversations matter more. You think faster, write more clearly, and make connections between ideas. When Mercury is retrograde, the reverse happens — miscommunications, tech glitches, travel delays. These are not punishments. They are invitations to slow down and review."
              orbital="Approximately 14 to 30 days per sign. Mercury stays close to the Sun and can only be one sign ahead or behind it."
              frequency="141.27 Hz"
              note="C# / D"
              chakra="Throat centre"
              sound="Tuning forks at 141 Hz, wind chimes, and high-pitched Tibetan singing bowls. Mercury energy is quick and light. Use staccato rhythms and brighter tones. This frequency supports clear expression and mental clarity during sessions."
              prominent="A strong Mercury placement indicates someone articulate, curious, and mentally agile. They process information quickly and communicate with precision. Their challenge is learning to listen as deeply as they speak."
            />

            <PlanetEntry
              glyph="\u2640"
              name="Venus"
              domain="Love, beauty, relationships, values, pleasure, art"
              daily="When Venus is active, you are drawn to beauty, comfort, and connection. Relationships feel warmer. You notice aesthetics more. You spend time on what brings pleasure rather than just productivity. Venus days are good for creative work, date nights, and treating yourself with kindness."
              orbital="Approximately 23 to 60 days per sign. Venus moves irregularly and can spend longer in signs when retrograde."
              frequency="221.23 Hz"
              note="A"
              chakra="Heart and Sacral centres"
              sound="Singing bowls tuned near 221 Hz, harp, gentle gong washes. Venus energy is soft, warm, and harmonious. Use sustained, flowing tones. This frequency opens the heart and softens emotional armour. Excellent for relationship healing sessions and self-love meditations."
              prominent="A strong Venus placement indicates someone with refined taste, natural charm, and a deep appreciation for beauty in all forms. They value harmony and can struggle with conflict. Their challenge is learning that genuine love sometimes requires uncomfortable honesty."
            />

            <PlanetEntry
              glyph="\u2642"
              name="Mars"
              domain="Drive, energy, action, courage, conflict, sexuality"
              daily="When Mars is active, your energy levels rise. You feel more assertive, more willing to take risks, and less patient with delay. Physical activity feels satisfying. Arguments can flare up more easily. Mars does not create conflict — it reveals where you already feel frustrated and gives you the courage to act."
              orbital="Approximately 6 to 7 weeks per sign. Mars stays in each sign long enough to activate its themes thoroughly."
              frequency="144.72 Hz"
              note="D"
              chakra="Root and Solar Plexus centres"
              sound="Frame drums, djembe, powerful gong strikes. Mars energy is primal and rhythmic. Use driving beats and lower frequencies. The Mars tone activates physical energy and helps release stored anger or frustration in the body. Useful for sessions focused on empowerment and boundary-setting."
              prominent="A strong Mars placement indicates someone with high energy, natural courage, and a competitive drive. They take initiative and dislike passivity. Their challenge is learning that strength includes the ability to pause."
            />

            <PlanetEntry
              glyph="\u2643"
              name="Jupiter"
              domain="Growth, expansion, luck, wisdom, abundance, travel"
              daily="When Jupiter is emphasised, opportunities appear. Your perspective broadens. You feel more optimistic and generous. Learning feels exciting. There is a risk of overextending — Jupiter does not know the word enough. Moderation is not its strength. Enjoy the expansion, but keep one foot on the ground."
              orbital="Approximately one year per sign. Jupiter spends long enough in each sign to bring growth to that area of collective life."
              frequency="183.58 Hz"
              note="F#"
              chakra="Crown centre"
              sound="Large singing bowls, symphonic gongs, and expansive soundscapes. Jupiter energy is grand and generous. Use rich, layered tones that fill the space. The Jupiter frequency supports feelings of abundance, spiritual growth, and philosophical insight. Excellent for sessions focused on opening to possibility."
              prominent="A strong Jupiter placement indicates someone naturally optimistic, philosophical, and generous. They are drawn to big ideas, travel, and teaching. Their challenge is learning that not every opportunity deserves a yes."
            />

            <PlanetEntry
              glyph="\u2644"
              name="Saturn"
              domain="Structure, discipline, responsibility, limitations, karma, time"
              daily="When Saturn is active, reality checks arrive. Deadlines feel heavier. Responsibilities cannot be avoided. This is not negative — Saturn is the master teacher. It shows you where you need to build stronger foundations. The discomfort you feel under Saturn is the discomfort of growing up."
              orbital="Approximately 2.5 years per sign. Saturn transits are significant life chapters. The Saturn Return at age 29 is a major maturation milestone."
              frequency="147.85 Hz"
              note="D"
              chakra="Root centre"
              sound="Deep Tibetan singing bowls, monochord drones, low gong tones. Saturn energy is slow, heavy, and grounding. Use sustained, repetitive tones. The Saturn frequency supports discipline, patience, and acceptance. Useful for sessions focused on letting go of resistance and embracing structure."
              prominent="A strong Saturn placement indicates someone responsible, disciplined, and deeply mature. They take commitments seriously and earn respect through consistency. Their challenge is learning that rigidity is not the same as strength."
            />

            <PlanetEntry
              glyph="\u2645"
              name="Uranus"
              domain="Revolution, innovation, sudden change, freedom, awakening"
              daily="When Uranus is active, expect the unexpected. Routines break. New ideas arrive like lightning. You feel restless with anything that feels too predictable. Uranus energy is exciting but destabilising. It is the planet of breakthrough — but breakthrough requires something to break."
              orbital="Approximately 7 years per sign. Uranus transits reshape entire areas of collective life over long periods."
              frequency="207.36 Hz"
              note="G#"
              chakra="Third Eye centre"
              sound="Electronic soundscapes, theremin, binaural beats in the Beta range. Uranus energy is electric and unpredictable. Use unconventional sound sources and unexpected frequency shifts. The Uranus frequency stimulates insight and breaks mental patterns. Useful for sessions focused on creative problem-solving."
              prominent="A strong Uranus placement indicates someone original, independent, and drawn to innovation. They often feel ahead of their time. Their challenge is learning that freedom without connection leads to isolation."
            />

            <PlanetEntry
              glyph="\u2646"
              name="Neptune"
              domain="Spirituality, dreams, illusion, intuition, transcendence, compassion"
              daily="When Neptune is active, boundaries dissolve. Imagination expands. You may feel more creative, more empathetic, or more confused — sometimes all three at once. Neptune makes the rational mind uncomfortable because it operates on feeling and intuition. Trust your inner knowing, but verify important decisions with clear-headed thinking."
              orbital="Approximately 14 years per sign. Neptune transits are generational, dissolving and re-imagining entire cultural narratives."
              frequency="211.44 Hz"
              note="G#"
              chakra="Crown centre"
              sound="Gong baths, ocean drums, ambient drones, 432 Hz tuning. Neptune energy is vast and formless. Use sustained, wash-like sounds with no sharp edges. The Neptune frequency supports deep meditation, spiritual connection, and emotional release. This is the go-to frequency for transcendent sound healing experiences."
              prominent="A strong Neptune placement indicates someone deeply intuitive, creative, and compassionate. They have rich inner worlds and natural artistic gifts. Their challenge is learning to distinguish between genuine intuition and wishful thinking."
            />

            <PlanetEntry
              glyph="\u2647"
              name="Pluto"
              domain="Transformation, death and rebirth, power, the unconscious, evolution"
              daily="When Pluto is active, superficial approaches fail. You are drawn to the deeper truth beneath surface appearances. Power dynamics become visible. Something may need to end so that something new can begin. Pluto transits are intense but always evolutionary — they strip away what is false and leave what is real."
              orbital="Approximately 12 to 31 years per sign. Pluto has a highly elliptical orbit, spending much longer in some signs than others. Its transits transform entire generations."
              frequency="140.25 Hz"
              note="C#"
              chakra="Root centre"
              sound="Deep gongs, didgeridoo, very low frequency drones. Pluto energy is intense, primal, and transformative. Use sounds that vibrate in the bones and belly. The Pluto frequency supports deep shadow work, releasing trauma, and profound transformation. Use with care — this frequency moves what has been buried."
              prominent="A strong Pluto placement indicates someone with intense depth, psychological insight, and the ability to transform crisis into growth. They see through pretence. Their challenge is learning that power shared freely is stronger than power held tightly."
            />
          </section>

          <Divider />

          {/* SECTION 3: The Twelve Zodiac Signs */}
          <section id="zodiac-signs">
            <h2 className="text-2xl font-serif text-white/90 mb-8">The Twelve Zodiac Signs</h2>

            <SignEntry
              glyph="\u2648"
              name="Aries"
              dates="21 March \u2013 19 April"
              element="Fire"
              modality="Cardinal"
              ruler="Mars"
              themes="Initiation, courage, independence, pioneering energy. Aries is the first sign — the spark that starts the fire. It represents raw will, the desire to begin, and the courage to act before thinking. Aries energy is direct, honest, and impatient with unnecessary complexity."
              body="Head, face, adrenal glands"
              shadow="Impulsiveness, selfishness, anger, impatience. Aries can start many things and finish few. The shadow is acting without considering impact on others."
              sound="396 Hz solfeggio (liberation, releasing fear). Frame drums, fast rhythms, fire ceremony sounds. Aries responds to driving, energetic soundscapes that match its active nature. Use higher tempo binaural beats in the Beta range (14\u201330 Hz) to channel Aries energy productively."
              cluster="When multiple planets transit Aries, collective energy becomes assertive and competitive. New projects launch. Patience runs thin. Leadership struggles emerge. It is a time for bold action, not careful planning."
            />

            <SignEntry
              glyph="\u2649"
              name="Taurus"
              dates="20 April \u2013 20 May"
              element="Earth"
              modality="Fixed"
              ruler="Venus"
              themes="Stability, sensuality, values, material security, patience. Taurus is the builder — slow, steady, and deeply connected to the physical world. It represents what we value enough to nurture over time. Taurus energy is loyal, practical, and appreciates beauty in tangible forms."
              body="Throat, neck, thyroid"
              shadow="Stubbornness, possessiveness, resistance to change, overindulgence. Taurus can hold on to things, people, and habits long past their usefulness. The shadow is confusing stability with stagnation."
              sound="417 Hz solfeggio (facilitating change). Monochord drones, crystal bowls in lower octaves, root frequency 256 Hz. Taurus responds to sustained, grounding tones that vibrate through the body. Use Alpha brainwave binaural beats (8\u201314 Hz) for deep relaxation."
              cluster="When multiple planets transit Taurus, collective focus turns to finances, food, comfort, and security. The economy gets attention. People crave stability. Change happens slowly but permanently."
            />

            <SignEntry
              glyph="\u264A"
              name="Gemini"
              dates="21 May \u2013 20 June"
              element="Air"
              modality="Mutable"
              ruler="Mercury"
              themes="Communication, curiosity, duality, versatility, connection. Gemini is the messenger — quick, sociable, and endlessly curious. It represents the mind&apos;s desire to understand everything by connecting to everything. Gemini energy is light, adaptable, and thrives on variety."
              body="Hands, arms, lungs, nervous system"
              shadow="Superficiality, inconsistency, gossip, scattered energy. Gemini can know a little about everything and a lot about nothing. The shadow is mistaking information for understanding."
              sound="528 Hz solfeggio (transformation, DNA repair). Tuning forks, wind chimes, higher-pitched singing bowls. Gemini responds to bright, varied sounds with changing patterns. Use Alpha-Beta bridge binaural beats (12\u201315 Hz) for mental clarity without overstimulation."
              cluster="When multiple planets transit Gemini, communication speeds up. Social media buzzes. People talk more than they listen. Information overload is real. It is a time for learning, networking, and exchanging ideas."
            />

            <SignEntry
              glyph="\u264B"
              name="Cancer"
              dates="21 June \u2013 22 July"
              element="Water"
              modality="Cardinal"
              ruler="Moon"
              themes="Home, family, emotional security, nurturing, memory. Cancer is the protector — deeply caring, intuitive, and connected to ancestral roots. It represents our need to belong, to feel safe, and to care for others. Cancer energy is sensitive, receptive, and fiercely protective of what it loves."
              body="Chest, breasts, stomach"
              shadow="Clinginess, moodiness, over-sensitivity, emotional manipulation. Cancer can use care as a form of control. The shadow is building walls instead of homes."
              sound="639 Hz solfeggio (connecting, relationships). Ocean drums, rain sticks, water sounds, gentle gong washes. Cancer responds to flowing, enveloping soundscapes that feel like being held. Use Theta binaural beats (4\u20138 Hz) for deep emotional processing."
              cluster="When multiple planets transit Cancer, emotional themes dominate. Family matters surface. People nest and seek comfort. Nostalgia increases. It is a time for healing old wounds and strengthening bonds."
            />

            <SignEntry
              glyph="\u264C"
              name="Leo"
              dates="23 July \u2013 22 August"
              element="Fire"
              modality="Fixed"
              ruler="Sun"
              themes="Self-expression, creativity, leadership, generosity, joy. Leo is the performer — warm, radiant, and unapologetically visible. It represents the creative force that makes life worth living. Leo energy is generous, dramatic, and lights up every room."
              body="Heart, spine, upper back"
              shadow="Arrogance, attention-seeking, stubbornness, domination. Leo can mistake admiration for love. The shadow is needing an audience to feel real."
              sound="741 Hz solfeggio (expression, solutions). Sun gongs, heart-centred singing bowls, celebratory rhythms. Leo responds to warm, golden tones that feel regal and expansive. Use the Sun frequency (126.22 Hz) as a base drone for Leo-focused sessions."
              cluster="When multiple planets transit Leo, creativity surges. People want recognition. Entertainment and art flourish. Egos can clash. It is a time for bold self-expression and sharing your gifts with confidence."
            />

            <SignEntry
              glyph="\u264D"
              name="Virgo"
              dates="23 August \u2013 22 September"
              element="Earth"
              modality="Mutable"
              ruler="Mercury"
              themes="Service, analysis, health, refinement, practical wisdom. Virgo is the healer — precise, humble, and devoted to improvement. It represents the desire to be useful, to fix what is broken, and to serve something greater than yourself. Virgo energy is meticulous, kind, and quietly powerful."
              body="Digestive system, intestines"
              shadow="Perfectionism, criticism, anxiety, overthinking. Virgo can become so focused on flaws that it misses the whole picture. The shadow is believing that nothing is ever good enough."
              sound="852 Hz solfeggio (returning to spiritual order). Precise tuning forks, crystal bowls, clean harmonic tones. Virgo responds to pure, orderly sounds with clear resonance. Use Mercury frequency (141.27 Hz) for mental clarity. Sessions should feel structured and intentional."
              cluster="When multiple planets transit Virgo, attention turns to health, work routines, and practical improvement. People organise, declutter, and optimise. The collective becomes more critical but also more helpful."
            />

            <SignEntry
              glyph="\u264E"
              name="Libra"
              dates="23 September \u2013 22 October"
              element="Air"
              modality="Cardinal"
              ruler="Venus"
              themes="Balance, harmony, partnership, justice, beauty. Libra is the diplomat — graceful, fair-minded, and deeply invested in how people relate to each other. It represents the desire for equilibrium and the understanding that beauty matters. Libra energy is charming, cooperative, and aesthetically sensitive."
              body="Kidneys, lower back, skin"
              shadow="Indecisiveness, people-pleasing, avoidance of conflict, superficiality. Libra can sacrifice authenticity for the sake of peace. The shadow is keeping everyone happy except yourself."
              sound="639 Hz solfeggio (connecting, harmony). Harp, chimes, paired singing bowls tuned to intervals. Libra responds to harmonious, balanced soundscapes. Use Venus frequency (221.23 Hz) for relationship healing. Sessions should feel elegant and symmetrical."
              cluster="When multiple planets transit Libra, relationship themes intensify. Partnerships form or dissolve. Justice and fairness become hot topics. Art and design get more attention. It is a time for negotiation and finding common ground."
            />

            <SignEntry
              glyph="\u264F"
              name="Scorpio"
              dates="23 October \u2013 21 November"
              element="Water"
              modality="Fixed"
              ruler="Pluto (traditional: Mars)"
              themes="Transformation, depth, intensity, power, intimacy, truth. Scorpio is the alchemist — willing to go where others will not, to look at what others avoid. It represents the power of honest self-examination and the courage to transform. Scorpio energy is magnetic, perceptive, and unafraid of darkness."
              body="Reproductive organs, elimination system"
              shadow="Obsession, jealousy, manipulation, vengefulness. Scorpio can weaponise its insight. The shadow is using knowledge of others as power over them."
              sound="174 Hz solfeggio (foundation, pain reduction). Deep gongs, didgeridoo, low-frequency drones. Scorpio responds to intense, penetrating sounds that reach into the body. Use Pluto frequency (140.25 Hz) for transformative sessions. These are sessions for shadow work and deep release."
              cluster="When multiple planets transit Scorpio, hidden truths surface. Power dynamics become visible. Secrets emerge. Collective intensity rises. It is a time for honest reckoning and transformative healing."
            />

            <SignEntry
              glyph="\u2650"
              name="Sagittarius"
              dates="22 November \u2013 21 December"
              element="Fire"
              modality="Mutable"
              ruler="Jupiter"
              themes="Exploration, philosophy, truth-seeking, adventure, expansion. Sagittarius is the seeker — restless, optimistic, and always looking over the next horizon. It represents the human drive to understand the meaning of life through experience. Sagittarius energy is enthusiastic, honest, and hungry for freedom."
              body="Hips, thighs, liver"
              shadow="Recklessness, tactlessness, commitment-phobia, exaggeration. Sagittarius can mistake movement for progress. The shadow is running from depth under the guise of seeking breadth."
              sound="741 Hz solfeggio (expression, awakening intuition). Large symphonic gongs, world music instruments, expansive soundscapes. Sagittarius responds to grand, layered sounds that evoke wide open spaces. Use Jupiter frequency (183.58 Hz) for sessions focused on vision and possibility."
              cluster="When multiple planets transit Sagittarius, the collective becomes more adventurous. Travel increases. Philosophy and religion get debated. Optimism rises but so does overconfidence. It is a time for expanding horizons and questioning assumptions."
            />

            <SignEntry
              glyph="\u2651"
              name="Capricorn"
              dates="22 December \u2013 19 January"
              element="Earth"
              modality="Cardinal"
              ruler="Saturn"
              themes="Ambition, structure, authority, legacy, mastery. Capricorn is the builder of empires — patient, strategic, and willing to climb the mountain one step at a time. It represents the desire to create something lasting and earn genuine respect through consistent effort. Capricorn energy is disciplined, resourceful, and quietly powerful."
              body="Bones, joints, knees, teeth"
              shadow="Workaholism, coldness, rigidity, status obsession. Capricorn can define self-worth entirely by achievement. The shadow is building a life that looks impressive but feels empty."
              sound="285 Hz solfeggio (influence, energy field healing). Deep Tibetan bowls, monochord, Saturn frequency drones. Capricorn responds to structured, repetitive, grounding sounds. Use Saturn frequency (147.85 Hz) for sessions focused on patience, discipline, and releasing control."
              cluster="When multiple planets transit Capricorn, institutional structures come into focus. Careers advance or restructure. Authority is questioned and rebuilt. Hard work pays off. It is a time for building, not dreaming."
            />

            <SignEntry
              glyph="\u2652"
              name="Aquarius"
              dates="20 January \u2013 18 February"
              element="Air"
              modality="Fixed"
              ruler="Uranus (traditional: Saturn)"
              themes="Innovation, community, humanitarian ideals, individuality, the future. Aquarius is the visionary — seeing possibilities that do not yet exist and working to bring them into reality. It represents the part of us that cares about the collective good and refuses to conform for the sake of it. Aquarius energy is progressive, independent, and sometimes deliberately eccentric."
              body="Ankles, circulatory system, nervous system"
              shadow="Detachment, emotional coldness, contrarianism, elitism. Aquarius can love humanity in theory while struggling with humans in practice. The shadow is intellectualising feelings instead of feeling them."
              sound="963 Hz solfeggio (awakening, cosmic consciousness). Electronic instruments, binaural beats, unconventional sound sources. Aquarius responds to futuristic, unexpected sounds. Use Uranus frequency (207.36 Hz) for sessions focused on breaking patterns and embracing change."
              cluster="When multiple planets transit Aquarius, social movements grow. Technology advances. People seek community around shared ideals. Convention gets challenged. It is a time for innovation and collective progress."
            />

            <SignEntry
              glyph="\u2653"
              name="Pisces"
              dates="19 February \u2013 20 March"
              element="Water"
              modality="Mutable"
              ruler="Neptune (traditional: Jupiter)"
              themes="Transcendence, compassion, imagination, spirituality, dissolution of boundaries. Pisces is the mystic — feeling everything, connected to everything, and sometimes overwhelmed by everything. It represents the soul&apos;s desire to return to source, to dissolve the illusion of separateness. Pisces energy is deeply empathic, creative, and attuned to the invisible."
              body="Feet, lymphatic system, pineal gland"
              shadow="Escapism, martyrdom, victim mentality, addiction, boundary dissolution. Pisces can lose itself in others&apos; pain or in substances that dull its overwhelming sensitivity. The shadow is drowning in the ocean rather than learning to swim in it."
              sound="852 Hz solfeggio (intuition, inner vision). Gong baths, ocean drums, ambient drones, 432 Hz tuning, solfeggio frequencies. Pisces responds to formless, flowing soundscapes with no hard edges. Use Neptune frequency (211.44 Hz) for transcendent sessions. This is the sign most naturally attuned to sound healing."
              cluster="When multiple planets transit Pisces, the collective becomes more sensitive, intuitive, and creative. Boundaries blur — between nations, between people, between reality and imagination. Spirituality increases. Confusion can also increase. It is a time for compassion, art, and letting go."
            />
          </section>

          <Divider />

          {/* SECTION 4: How to Read a Daily Chart */}
          <section id="reading-guide">
            <h2 className="text-2xl font-serif text-white/90 mb-8">How to Read a Daily Chart</h2>
            <p className="text-sm leading-relaxed text-white/65 mb-8">
              A practical guide for using Astrara&apos;s data to give someone a daily reading.
              Follow these steps in order for a thorough, grounded interpretation.
            </p>

            <Step number={1} title="Check the Sun sign">
              What season are we in? What sign is the Sun illuminating? This sets the overall background energy for everyone. The Sun sign is the broadest brush stroke — it tells you the theme that colours all of life right now. When the Sun enters a new sign, the collective mood shifts.
            </Step>

            <Step number={2} title="Check the Moon sign and phase">
              The Moon moves fastest and sets the emotional tone of each day. A Full Moon amplifies and reveals — emotions are louder, truths come to light, and what has been building reaches a peak. A New Moon invites fresh starts — it is a quiet, inward time for planting seeds. The Moon&apos;s sign colours HOW we feel: a Moon in Aries feels urgent; a Moon in Pisces feels dreamy; a Moon in Capricorn feels serious.
            </Step>

            <Step number={3} title="Look at planet clusters">
              Are multiple planets gathered in one or two signs? This creates a stellium — concentrated energy in that area of life. The more planets in one sign, the more intense that sign&apos;s themes become for everyone. Three or more planets in the same sign is significant. Four or more is rare and powerful.
            </Step>

            <Step number={4} title="Check for oppositions and squares">
              Planets opposite each other (180&deg;) create tension and awareness. They force you to see both sides of a situation. Planets square each other (90&deg;) create friction and motivation to act. These are where the drama and growth happen. Do not treat them as negative — they are the engine of change.
            </Step>

            <Step number={5} title="Note the slow movers">
              Jupiter, Saturn, Uranus, Neptune, and Pluto move slowly and set the generational backdrop. Their sign placements are the deep currents that affect everyone for months or years. When a slow mover changes sign, it is a collective turning point. When two slow movers form an aspect to each other, it is a once-in-a-generation event.
            </Step>

            <Step number={6} title="Personalise for the person's sign">
              For a specific person, look at what planets are transiting through their Sun sign, opposing their sign, and squaring their sign. This tells you how intensely today&apos;s energy affects them personally. A day with the Moon in someone&apos;s sign feels deeply personal to them, even if it is barely noticed by others.
            </Step>

            <Step number={7} title="Add the Earth data">
              High Kp index (5+) means the geomagnetic field is disturbed — many people report poor sleep, heightened emotions, headaches, and restlessness. Solar flares can amplify sensitivity. Sound healing sessions may feel more intense during geomagnetic storms. Mention this to clients if the Kp is elevated — it helps them understand that some of what they feel has a physical, measurable cause.
            </Step>

            <Step number={8} title="Choose the sound">
              Use the Moon sign to determine the drone frequency — the Moon sets the emotional tone, so the sound should resonate with it. Use the overall energy level to choose binaural beat speed: calm days call for Theta (4&ndash;8 Hz), active days call for Alpha (8&ndash;14 Hz), intense days can use Beta (14&ndash;30 Hz). Use the dominant element (Fire, Earth, Air, Water) to select instruments — each element has its own sound palette.
            </Step>
          </section>

          <Divider />

          {/* SECTION 5: Planetary Aspects Explained */}
          <section id="aspects">
            <h2 className="text-2xl font-serif text-white/90 mb-8">Planetary Aspects Explained</h2>

            <AspectEntry angle="0\u00B0" name="Conjunction" description="Planets in the same sign. Their energies merge and amplify each other. Like two musicians playing the same note — powerful and focused. Conjunctions concentrate energy. The planets involved lose some individual identity and create something new together. A Sun-Mars conjunction feels like willpower on fire. A Venus-Saturn conjunction feels like love getting serious." />
            <AspectEntry angle="60\u00B0" name="Sextile" description="Planets two signs apart. A harmonious, supportive connection. Opportunities that require a small effort to activate. Sextiles are gentle nudges — they do not force anything, but they make certain paths easier. You have to notice them and act. A Mercury-Jupiter sextile opens doors for learning, but you have to walk through them." />
            <AspectEntry angle="90\u00B0" name="Square" description="Planets three signs apart. Friction, tension, challenge. These are growth aspects — uncomfortable but productive. Squares force you to act because the status quo becomes unbearable. They are the most dynamic aspects in astrology. A Moon-Saturn square feels emotionally heavy, but it builds emotional resilience." />
            <AspectEntry angle="120\u00B0" name="Trine" description="Planets four signs apart. Natural harmony and flow. Talents and gifts that come easily. Trines feel good but can also mean complacency — when everything flows, there is less motivation to push. A Venus-Neptune trine gives effortless creativity and romantic idealism, but may lack practical grounding." />
            <AspectEntry angle="180\u00B0" name="Opposition" description="Planets six signs apart. Awareness, polarity, balance. Forces you to see both sides. Oppositions often manifest through relationships and external events — other people embody the energy you are not expressing. A Sun-Moon opposition (Full Moon) illuminates what was hidden and demands integration of two opposing needs." />
          </section>

          <Divider />

          {/* SECTION 6: Elements and Their Sound Connections */}
          <section id="elements-sound">
            <h2 className="text-2xl font-serif text-white/90 mb-8">Elements and Their Sound Connections</h2>

            <ElementEntry
              element="Fire"
              signs="Aries, Leo, Sagittarius"
              description="High energy, activation, inspiration. Fire energy is warm, bright, and upward-moving. It wants to DO. In sound healing, fire energy calls for rhythmic, energising sounds that move the body and ignite the spirit."
              brainwave="Beta brainwaves (14\u201330 Hz binaural beats)"
              instruments="Frame drums, djembe, didgeridoo, fire gong, rapid rhythmic patterns"
              frequencies="Higher tempo, driving beats. Mars frequency (144.72 Hz) as base. The goal is activation, not relaxation."
            />

            <ElementEntry
              element="Earth"
              signs="Taurus, Virgo, Capricorn"
              description="Grounding energy, stability, embodiment. Earth energy is slow, solid, and downward-rooting. It wants to BUILD. In sound healing, earth energy calls for sustained, anchoring sounds that bring awareness into the body and bones."
              brainwave="Alpha brainwaves (8\u201314 Hz binaural beats)"
              instruments="Monochord, crystal bowls in lower octaves, Tibetan singing bowls, body-resonant drones"
              frequencies="Root frequency 256 Hz. Saturn frequency (147.85 Hz). Sustained tones, minimal variation. The goal is to ground and stabilise."
            />

            <ElementEntry
              element="Air"
              signs="Gemini, Libra, Aquarius"
              description="Mental clarity, communication, connection. Air energy is quick, light, and outward-reaching. It wants to THINK and CONNECT. In sound healing, air energy calls for bright, clear sounds that sharpen the mind without overwhelming it."
              brainwave="Alpha-Beta bridge (12\u201315 Hz binaural beats)"
              instruments="Singing bowls, wind chimes, tuning forks, higher octave tones, bells"
              frequencies="Mercury frequency (141.27 Hz). Brighter, cleaner tones. The goal is mental clarity and open communication."
            />

            <ElementEntry
              element="Water"
              signs="Cancer, Scorpio, Pisces"
              description="Deep feeling, intuition, healing. Water energy is flowing, receptive, and inward-moving. It wants to FEEL and DISSOLVE. In sound healing, water energy calls for formless, immersive sounds that allow emotional release and spiritual connection."
              brainwave="Theta brainwaves (4\u20138 Hz binaural beats)"
              instruments="Ocean drum, rain stick, gong baths, ambient drones, singing bowls with water"
              frequencies="432 Hz tuning. Neptune frequency (211.44 Hz). Solfeggio frequencies. The goal is to dissolve barriers and access deeper feeling."
            />
          </section>

          <Divider />

          {/* SECTION 7: Data Sources */}
          <section id="data-sources">
            <h2 className="text-2xl font-serif text-white/90 mb-8">Data Sources</h2>

            <DataSource title="astronomy-engine (npm package)">
              <p>Open-source astronomical calculation library by Don Cross. Verified against NASA JPL (Jet Propulsion Laboratory) ephemeris data, accurate to fractions of a degree.</p>
              <p>Used for all planetary positions (ecliptic longitude, distance, rise/set times), moon phase calculations, and heliocentric positions for the solar system view. Runs entirely client-side — no server or internet needed for position calculations.</p>
              <p>Source: github.com/cosinekitty/astronomy</p>
            </DataSource>

            <DataSource title="NOAA Space Weather Prediction Center">
              <p>The US National Oceanic and Atmospheric Administration&apos;s space weather monitoring service. Provides real-time data from GOES satellites, updated every few minutes.</p>
              <p>Kp Index endpoint provides Earth&apos;s geomagnetic activity on a 0&ndash;9 scale. X-ray Flux endpoint provides solar flare classification (A/B/C/M/X class). This is the same data used by power companies and airlines for geomagnetic storm preparation.</p>
              <p>Practitioner relevance: Research links geomagnetic activity to sleep quality, mood, blood pressure, and heart rate variability. Elevated Kp can explain why clients feel &ldquo;off&rdquo; on certain days.</p>
            </DataSource>

            <DataSource title="Hans Cousto's Cosmic Octave">
              <p>Mathematical system created by Swiss mathematician Hans Cousto in 1978. Takes a planet&apos;s orbital period, converts it to a frequency (1/period), then octave-transposes it up into the audible range by repeatedly doubling.</p>
              <p>Example: Earth&apos;s year = 365.25 days &rarr; base frequency &rarr; octave up 32 times &rarr; 136.10 Hz (the &ldquo;Om&rdquo; frequency).</p>
              <p>Used for planet tone frequencies when tapping planets on the wheel and drone tuning for the soundscape. Published in &ldquo;The Cosmic Octave&rdquo; (1978). Provides a scientific basis for tuning instruments and sound healing sessions to planetary frequencies.</p>
            </DataSource>

            <DataSource title="Solfeggio Frequencies">
              <p>A set of specific frequencies (174, 285, 396, 417, 528, 639, 741, 852, 963 Hz) associated with different healing qualities. Historically linked to Gregorian chants, though the modern framework is a contemporary interpretation.</p>
              <p>Used for Moon-sign-based drone tuning in the soundscape and mapping zodiac signs to specific solfeggio tones. Evidence for specific healing properties is still emerging, but the frequencies provide a meaningful and intentional framework widely used in sound healing practice.</p>
            </DataSource>

            <DataSource title="Claude API (Anthropic)">
              <p>AI language model API used for generating personalised horoscope readings. Real astronomical data (positions, aspects, moon phase, earth data) is sent as context — Claude generates interpretive readings grounded in the actual sky.</p>
              <p>Used for daily general readings, individual zodiac readings, and weekly forecasts on the /promo content studio page. Model: Claude Sonnet 4. Not used for planetary calculations — those are pure astronomy-engine maths.</p>
            </DataSource>

            <DataSource title="Plausible Analytics">
              <p>Privacy-focused, cookie-free web analytics used for anonymous usage statistics across all Harmonic Waves ecosystem apps. Does NOT collect personal data, use cookies, or track individual users. Your cosmic journey is yours alone.</p>
            </DataSource>
          </section>

          <Divider />

          {/* SECTION 8: Frequency Reference Table */}
          <section id="frequency-table">
            <h2 className="text-2xl font-serif text-white/90 mb-8">Frequency Reference</h2>

            <h3 className="text-lg font-medium text-white/80 mb-4">Cousto Planetary Frequencies</h3>
            <div className="overflow-x-auto mb-12">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <Th>Planet</Th><Th>Frequency (Hz)</Th><Th>Note</Th><Th>Chakra</Th><Th>Colour</Th>
                  </tr>
                </thead>
                <tbody>
                  <Tr cells={['\u2609 Sun', '126.22', 'B', 'Solar Plexus / Heart', 'Gold / Orange']} />
                  <Tr cells={['\u263D Moon', '210.42', 'G#', 'Sacral', 'Silver / Violet']} />
                  <Tr cells={['\u263F Mercury', '141.27', 'C# / D', 'Throat', 'Yellow-Green']} />
                  <Tr cells={['\u2640 Venus', '221.23', 'A', 'Heart / Sacral', 'Green / Pink']} />
                  <Tr cells={['\u2642 Mars', '144.72', 'D', 'Solar Plexus / Root', 'Red']} />
                  <Tr cells={['\u2643 Jupiter', '183.58', 'F#', 'Crown', 'Blue / Purple']} />
                  <Tr cells={['\u2644 Saturn', '147.85', 'D', 'Root', 'Dark Blue / Black']} />
                  <Tr cells={['\u2645 Uranus', '207.36', 'G#', 'Third Eye', 'Electric Blue']} />
                  <Tr cells={['\u2646 Neptune', '211.44', 'G#', 'Crown', 'Turquoise / Sea Green']} />
                  <Tr cells={['\u2647 Pluto', '140.25', 'C#', 'Root', 'Deep Crimson / Black']} />
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-white/80 mb-4">Solfeggio-to-Zodiac Mapping</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <Th>Zodiac Sign</Th><Th>Solfeggio (Hz)</Th><Th>Quality</Th>
                  </tr>
                </thead>
                <tbody>
                  <Tr cells={['\u2648 Aries', '396', 'Liberation, releasing fear']} />
                  <Tr cells={['\u2649 Taurus', '417', 'Facilitating change']} />
                  <Tr cells={['\u264A Gemini', '528', 'Transformation, DNA repair']} />
                  <Tr cells={['\u264B Cancer', '639', 'Connecting, relationships']} />
                  <Tr cells={['\u264C Leo', '741', 'Expression, solutions']} />
                  <Tr cells={['\u264D Virgo', '852', 'Returning to spiritual order']} />
                  <Tr cells={['\u264E Libra', '639', 'Connecting, harmony']} />
                  <Tr cells={['\u264F Scorpio', '174', 'Foundation, pain reduction']} />
                  <Tr cells={['\u2650 Sagittarius', '741', 'Expression, awakening intuition']} />
                  <Tr cells={['\u2651 Capricorn', '285', 'Influence, energy field healing']} />
                  <Tr cells={['\u2652 Aquarius', '963', 'Awakening, cosmic consciousness']} />
                  <Tr cells={['\u2653 Pisces', '852', 'Intuition, inner vision']} />
                </tbody>
              </table>
            </div>
          </section>

          <Divider />

          {/* SECTION 9: Quick Reference — Reading Cheat Sheet */}
          <section id="cheat-sheet">
            <h2 className="text-2xl font-serif text-white/90 mb-8">Quick Reference &mdash; Reading Cheat Sheet</h2>

            <div className="p-6 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-6">Daily Reading Checklist</h3>
              <ol className="space-y-3 text-sm text-white/65 leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-white/30 font-mono w-5 shrink-0">1.</span>
                  <span><span className="text-white/80">What sign is the Sun in?</span> &rarr; Season energy</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-white/30 font-mono w-5 shrink-0">2.</span>
                  <span><span className="text-white/80">What sign is the Moon in?</span> &rarr; Today&apos;s emotional tone</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-white/30 font-mono w-5 shrink-0">3.</span>
                  <span><span className="text-white/80">What phase is the Moon?</span> &rarr; Doing (waxing) or releasing (waning)?</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-white/30 font-mono w-5 shrink-0">4.</span>
                  <span><span className="text-white/80">Any planet clusters?</span> &rarr; Where is energy concentrated?</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-white/30 font-mono w-5 shrink-0">5.</span>
                  <span><span className="text-white/80">Any oppositions?</span> &rarr; Where is there tension?</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-white/30 font-mono w-5 shrink-0">6.</span>
                  <span><span className="text-white/80">Kp index above 4?</span> &rarr; Bodies may feel it</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-white/30 font-mono w-5 shrink-0">7.</span>
                  <span><span className="text-white/80">What element dominates?</span> &rarr; Choose instruments accordingly</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-white/30 font-mono w-5 shrink-0">8.</span>
                  <span><span className="text-white/80">What is the person&apos;s Sun sign?</span> &rarr; How does today hit them specifically?</span>
                </li>
              </ol>
            </div>
          </section>

          <div className="mt-16 text-center text-xs text-white/20">
            Part of Harmonic Waves &middot; astrara.app
          </div>

        </div>
      </div>
    </div>
  )
}

// --- Sub-components ---

function Divider() {
  return <hr className="border-white/5 my-12" />
}

function PlanetEntry({ glyph, name, domain, daily, orbital, frequency, note, chakra, sound, prominent }: {
  glyph: string; name: string; domain: string; daily: string; orbital: string;
  frequency: string; note: string; chakra: string; sound: string; prominent: string
}) {
  return (
    <div className="mb-12">
      <h3 className="text-lg font-medium text-white/80 mb-1">
        <span className="text-xl mr-2">{glyph}</span> {name}
      </h3>
      <p className="text-xs text-white/40 uppercase tracking-wider mb-4">{domain}</p>
      <div className="space-y-3 text-sm leading-relaxed text-white/65">
        <p>{daily}</p>
        <p><span className="text-white/80">Orbital period:</span> {orbital}</p>
        <p><span className="text-white/80">Cousto frequency:</span> {frequency} (note: {note}). <span className="text-white/80">Chakra:</span> {chakra}.</p>
        <p><span className="text-white/80">Sound healing:</span> {sound}</p>
        <p><span className="text-white/80">When prominent:</span> {prominent}</p>
      </div>
    </div>
  )
}

function SignEntry({ glyph, name, dates, element, modality, ruler, themes, body, shadow, sound, cluster }: {
  glyph: string; name: string; dates: string; element: string; modality: string;
  ruler: string; themes: string; body: string; shadow: string; sound: string; cluster: string
}) {
  return (
    <div className="mb-12">
      <h3 className="text-lg font-medium text-white/80 mb-1">
        <span className="text-xl mr-2">{glyph}</span> {name}
      </h3>
      <p className="text-xs text-white/40 mb-4">{dates} &middot; {element} &middot; {modality} &middot; Ruler: {ruler}</p>
      <div className="space-y-3 text-sm leading-relaxed text-white/65">
        <p>{themes}</p>
        <p><span className="text-white/80">Body:</span> {body}</p>
        <p><span className="text-white/80">Shadow:</span> {shadow}</p>
        <p><span className="text-white/80">Sound healing:</span> {sound}</p>
        <p><span className="text-white/80">Planet cluster effect:</span> {cluster}</p>
      </div>
    </div>
  )
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-base font-medium text-white/80 mb-2">
        <span className="text-white/30 font-mono mr-2">Step {number}:</span> {title}
      </h3>
      <p className="text-sm leading-relaxed text-white/65">{children}</p>
    </div>
  )
}

function AspectEntry({ angle, name, description }: { angle: string; name: string; description: string }) {
  return (
    <div className="mb-8">
      <h3 className="text-base font-medium text-white/80 mb-2">
        <span className="text-white/40 font-mono mr-2">{angle}</span> {name}
      </h3>
      <p className="text-sm leading-relaxed text-white/65">{description}</p>
    </div>
  )
}

function ElementEntry({ element, signs, description, brainwave, instruments, frequencies }: {
  element: string; signs: string; description: string; brainwave: string;
  instruments: string; frequencies: string
}) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-medium text-white/80 mb-1">{element}</h3>
      <p className="text-xs text-white/40 mb-3">{signs}</p>
      <div className="space-y-3 text-sm leading-relaxed text-white/65">
        <p>{description}</p>
        <p><span className="text-white/80">Brainwave target:</span> {brainwave}</p>
        <p><span className="text-white/80">Instruments:</span> {instruments}</p>
        <p><span className="text-white/80">Frequencies:</span> {frequencies}</p>
      </div>
    </div>
  )
}

function DataSource({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-base font-medium text-white/80 mb-3">{title}</h3>
      <div className="space-y-2 text-sm leading-relaxed text-white/65">{children}</div>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-3 py-2 border-b border-white/10 text-white/50 text-xs uppercase tracking-wider font-medium">
      {children}
    </th>
  )
}

function Tr({ cells }: { cells: string[] }) {
  return (
    <tr>
      {cells.map((cell, i) => (
        <td key={i} className="px-3 py-2 border-b border-white/[0.04] text-white/65 text-sm">
          {cell}
        </td>
      ))}
    </tr>
  )
}
