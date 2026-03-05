'use client'

import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'
import {
  sections, header, planets, signs, readingGuideTitle, readingGuideIntro,
  readingSteps, aspectsTitle, aspects, elementsTitle, elements,
  dataSourcesTitle, dataSources, coustoRows, coustoRowsLt,
  solfeggioRows, solfeggioRowsLt, cheatSheet, labels,
  type Language, type PlanetData, type SignData, type StepData,
  type AspectData, type ElementData, type DataSourceData,
} from './content'

export default function Page() {
  return (
    <LanguageProvider>
      <AboutPage />
    </LanguageProvider>
  )
}

function AboutPage() {
  const { lang } = useLanguage()
  const l = labels[lang as Language] ?? labels.en
  const secs = sections[lang as Language] ?? sections.en
  const h = header[lang as Language] ?? header.en
  const planetList = planets[lang as Language] ?? planets.en
  const signList = signs[lang as Language] ?? signs.en
  const stepList = readingSteps[lang as Language] ?? readingSteps.en
  const aspectList = aspects[lang as Language] ?? aspects.en
  const elementList = elements[lang as Language] ?? elements.en
  const sourceList = dataSources[lang as Language] ?? dataSources.en
  const cheatItems = cheatSheet[lang as Language] ?? cheatSheet.en
  const cousto = lang === 'lt' ? coustoRowsLt : coustoRows
  const solfeggio = lang === 'lt' ? solfeggioRowsLt : solfeggioRows

  return (
    <div className="min-h-screen bg-[#05050F] text-white/80">
      <div className="max-w-6xl mx-auto px-4 py-12 lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">

        {/* Desktop TOC */}
        <nav className="hidden lg:block">
          <div className="sticky top-12">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-wider text-white/30">{l.contents}</p>
              <LanguageToggle />
            </div>
            <ul className="space-y-2">
              {secs.map(s => (
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
        <div className="lg:hidden mb-8">
          <div className="flex justify-end mb-4">
            <LanguageToggle />
          </div>
          <details className="bg-white/3 rounded-lg border border-white/5 p-4">
            <summary className="text-xs uppercase tracking-wider text-white/40 cursor-pointer">{l.contents}</summary>
            <ul className="mt-3 space-y-2">
              {secs.map(s => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-sm text-white/50 hover:text-white/80 transition-colors">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </div>

        {/* Main content */}
        <div className="max-w-3xl">

          {/* Header */}
          <header className="mb-16">
            <h1 className="text-2xl font-serif text-white/90 mb-2">{h.title}</h1>
            <p className="text-sm text-white/50 italic mb-6">{h.subtitle}</p>
            <p className="text-sm leading-relaxed text-white/65">{h.intro}</p>
          </header>

          <Divider />

          {/* The Ten Celestial Bodies */}
          <section id="celestial-bodies">
            <h2 className="text-2xl font-serif text-white/90 mb-8">{l.celestialBodiesTitle}</h2>
            {planetList.map(p => (
              <PlanetEntry key={p.glyph} data={p} labels={l} />
            ))}
          </section>

          <Divider />

          {/* The Twelve Zodiac Signs */}
          <section id="zodiac-signs">
            <h2 className="text-2xl font-serif text-white/90 mb-8">{l.zodiacSignsTitle}</h2>
            {signList.map(s => (
              <SignEntry key={s.glyph} data={s} labels={l} />
            ))}
          </section>

          <Divider />

          {/* How to Read a Daily Chart */}
          <section id="reading-guide">
            <h2 className="text-2xl font-serif text-white/90 mb-8">
              {readingGuideTitle[lang as Language] ?? readingGuideTitle.en}
            </h2>
            <p className="text-sm leading-relaxed text-white/65 mb-8">
              {readingGuideIntro[lang as Language] ?? readingGuideIntro.en}
            </p>
            {stepList.map(s => (
              <Step key={s.number} data={s} stepLabel={l.step} />
            ))}
          </section>

          <Divider />

          {/* Planetary Aspects */}
          <section id="aspects">
            <h2 className="text-2xl font-serif text-white/90 mb-8">
              {aspectsTitle[lang as Language] ?? aspectsTitle.en}
            </h2>
            {aspectList.map(a => (
              <AspectEntry key={a.angle} data={a} />
            ))}
          </section>

          <Divider />

          {/* Elements & Sound */}
          <section id="elements-sound">
            <h2 className="text-2xl font-serif text-white/90 mb-8">
              {elementsTitle[lang as Language] ?? elementsTitle.en}
            </h2>
            {elementList.map(e => (
              <ElementEntry key={e.element} data={e} labels={l} />
            ))}
          </section>

          <Divider />

          {/* Data Sources */}
          <section id="data-sources">
            <h2 className="text-2xl font-serif text-white/90 mb-8">
              {dataSourcesTitle[lang as Language] ?? dataSourcesTitle.en}
            </h2>
            {sourceList.map(ds => (
              <DataSource key={ds.title} data={ds} />
            ))}
          </section>

          <Divider />

          {/* Frequency Reference */}
          <section id="frequency-table">
            <h2 className="text-2xl font-serif text-white/90 mb-8">{l.frequencyTitle}</h2>

            <h3 className="text-lg font-medium text-white/80 mb-4">{l.coustoTitle}</h3>
            <div className="overflow-x-auto mb-12">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <Th>{l.planet}</Th><Th>{l.frequencyHz}</Th><Th>{l.noteLabel}</Th><Th>{l.chakraCol}</Th><Th>{l.colour}</Th>
                  </tr>
                </thead>
                <tbody>
                  {cousto.map((row, i) => <Tr key={i} cells={row} />)}
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-white/80 mb-4">{l.solfeggioTitle}</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <Th>{l.zodiacSign}</Th><Th>{l.solfeggioHz}</Th><Th>{l.quality}</Th>
                  </tr>
                </thead>
                <tbody>
                  {solfeggio.map((row, i) => <Tr key={i} cells={row} />)}
                </tbody>
              </table>
            </div>
          </section>

          <Divider />

          {/* Quick Reference */}
          <section id="cheat-sheet">
            <h2 className="text-2xl font-serif text-white/90 mb-8">{l.cheatSheetTitle}</h2>
            <div className="p-6 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-6">{l.cheatSheetSubtitle}</h3>
              <ol className="space-y-3 text-sm text-white/65 leading-relaxed">
                {cheatItems.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-white/30 font-mono w-5 shrink-0">{i + 1}.</span>
                    <span><span className="text-white/80">{item.question}</span> &rarr; {item.arrow}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <div className="mt-16 text-center text-xs text-white/20">
            {l.footer}
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

function PlanetEntry({ data, labels: l }: { data: PlanetData; labels: typeof import('./content').labels.en }) {
  return (
    <div className="mb-12">
      <h3 className="text-lg font-medium text-white/80 mb-1">
        <span className="text-xl mr-2">{data.glyph}</span> {data.name}
      </h3>
      <p className="text-xs text-white/40 uppercase tracking-wider mb-4">{data.domain}</p>
      <div className="space-y-3 text-sm leading-relaxed text-white/65">
        <p>{data.daily}</p>
        <p><span className="text-white/80">{l.orbitalPeriod}</span> {data.orbital}</p>
        <p><span className="text-white/80">{l.coustoFrequency}</span> {data.frequency} (note: {data.note}). <span className="text-white/80">{l.chakraLabel}</span> {data.chakra}.</p>
        <p><span className="text-white/80">{l.soundHealing}</span> {data.sound}</p>
        <p><span className="text-white/80">{l.whenProminent}</span> {data.prominent}</p>
      </div>
    </div>
  )
}

function SignEntry({ data, labels: l }: { data: SignData; labels: typeof import('./content').labels.en }) {
  return (
    <div className="mb-12">
      <h3 className="text-lg font-medium text-white/80 mb-1">
        <span className="text-xl mr-2">{data.glyph}</span> {data.name}
      </h3>
      <p className="text-xs text-white/40 mb-4">{data.dates} &middot; {data.element} &middot; {data.modality} &middot; {l.ruler} {data.ruler}</p>
      <div className="space-y-3 text-sm leading-relaxed text-white/65">
        <p>{data.themes}</p>
        <p><span className="text-white/80">{l.bodyLabel}</span> {data.body}</p>
        <p><span className="text-white/80">{l.shadowLabel}</span> {data.shadow}</p>
        <p><span className="text-white/80">{l.soundHealing}</span> {data.sound}</p>
        <p><span className="text-white/80">{l.planetCluster}</span> {data.cluster}</p>
      </div>
    </div>
  )
}

function Step({ data, stepLabel }: { data: StepData; stepLabel: string }) {
  return (
    <div className="mb-8">
      <h3 className="text-base font-medium text-white/80 mb-2">
        <span className="text-white/30 font-mono mr-2">{stepLabel} {data.number}:</span> {data.title}
      </h3>
      <p className="text-sm leading-relaxed text-white/65">{data.content}</p>
    </div>
  )
}

function AspectEntry({ data }: { data: AspectData }) {
  return (
    <div className="mb-8">
      <h3 className="text-base font-medium text-white/80 mb-2">
        <span className="text-white/40 font-mono mr-2">{data.angle}</span> {data.name}
      </h3>
      <p className="text-sm leading-relaxed text-white/65">{data.description}</p>
    </div>
  )
}

function ElementEntry({ data, labels: l }: { data: ElementData; labels: typeof import('./content').labels.en }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-medium text-white/80 mb-1">{data.element}</h3>
      <p className="text-xs text-white/40 mb-3">{data.signs}</p>
      <div className="space-y-3 text-sm leading-relaxed text-white/65">
        <p>{data.description}</p>
        <p><span className="text-white/80">{l.brainwave}</span> {data.brainwave}</p>
        <p><span className="text-white/80">{l.instruments}</span> {data.instruments}</p>
        <p><span className="text-white/80">{l.frequencies}</span> {data.frequencies}</p>
      </div>
    </div>
  )
}

function DataSource({ data }: { data: DataSourceData }) {
  return (
    <div className="mb-8">
      <h3 className="text-base font-medium text-white/80 mb-3">{data.title}</h3>
      <div className="space-y-2 text-sm leading-relaxed text-white/65">
        {data.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
      </div>
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
