import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CloudFog,
  Info,
  Moon,
  PawPrint,
  Quote,
  Snowflake,
  Trees,
} from 'lucide-react';
import wolves from '../data/wolves';
import { useApp } from '../context/AppContext';
import { playSfx } from '../utils/sound';
import Reveal from '../components/Reveal';
import SafeImage from '../components/SafeImage';
import MagneticButton from '../components/MagneticButton';
import PhotoViewer from '../components/PhotoViewer';
import SectionHeading from '../components/SectionHeading';
import Footer from '../components/Footer';

/**
 * Wolf World — full cinematic environment:
 * dark forest + moon + fog + snow, the pack, facts, quotes,
 * an interactive moon, and Wolf Mode.
 */
export default function WolfWorld() {
  const { wolfMode, toggleWolfMode, discoverSecret } = useApp();
  const [moonClicked, setMoonClicked] = useState(false);
  const [darken, setDarken] = useState(false);
  const [fogBoost, setFogBoost] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(null);
  const [factOpen, setFactOpen] = useState(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const moonRef = useRef(null);

  const handleMoonClick = () => {
    if (moonClicked) return;
    setMoonClicked(true);
    discoverSecret('moon');
    // cinematic sequence: darken → howl → fog → message
    setDarken(true);
    playSfx('howl', 1);
    window.setTimeout(() => setFogBoost(true), 250);
    window.setTimeout(() => setDarken(false), 2600);
    window.setTimeout(() => setFogBoost(false), 5200);
  };

  const galleryImages = wolves.gallery.map((g) => g.src);
  const galleryCaptions = wolves.gallery.map((g) => g.caption);

  return (
    <div className="relative min-h-screen overflow-hidden px-6 pb-10 pt-28 md:pt-36">
      {/* ── Cinematic background: forest + fog layers ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <SafeImage
          src={wolves.backgrounds.forest}
          alt=""
          eager
          rounded={false}
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/55 to-ink-950" />
        {/* fog layers */}
        <div
          className={`fog-layer h-[40vh] w-[70vw] left-[-10%] top-[55%] bg-slate-300/10 ${fogBoost ? '' : ''}`}
          style={{ animationDuration: fogBoost ? '7s' : '26s' }}
          aria-hidden="true"
        />
        <div
          className="fog-layer h-[34vh] w-[60vw] right-[-15%] top-[30%] bg-indigo-300/10"
          style={{ animationDuration: fogBoost ? '9s' : '32s', animationDelay: '4s' }}
          aria-hidden="true"
        />
        <div
          className="fog-layer h-[30vh] w-[55vw] left-[20%] top-[75%] bg-violet-300/10"
          style={{ animationDuration: fogBoost ? '11s' : '38s', animationDelay: '9s' }}
          aria-hidden="true"
        />
      </div>

      {/* moon click → brief darkening */}
      <AnimatePresence>
        {darken && (
          <motion.div
            key="darken"
            className="pointer-events-none fixed inset-0 z-[5] bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.72 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* ── Header ── */}
        <div className="text-center">
          <Reveal>
            <p className="section-eyebrow mb-4">Beyond the last page of the map</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="serif text-5xl md:text-7xl lg:text-8xl font-medium glow-text">
              <span className="text-gradient">Welcome To The Wild</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="serif mx-auto mt-6 max-w-xl text-xl italic text-white/65">
              “Every pack has its own story.”
            </p>
          </Reveal>
        </div>

        {/* ── Interactive moon ── */}
        <Reveal className="mt-16 flex flex-col items-center">
          <motion.button
            ref={moonRef}
            type="button"
            onClick={handleMoonClick}
            aria-label="Click the moon"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group relative"
          >
            <span
              className="absolute -inset-10 rounded-full bg-indigo-200/20 blur-3xl transition-opacity duration-700 group-hover:opacity-100 opacity-60"
              aria-hidden="true"
            />
            <SafeImage
              src={wolves.backgrounds.moon}
              alt="The full moon of the Wolf World"
              className="relative h-44 w-44 md:h-56 md:w-56 rounded-full object-cover shadow-[0_0_80px_rgba(190,200,255,0.35)] ring-4 ring-white/10"
            />
            <span className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full glass px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-white/60">
              <Moon className="h-3 w-3" aria-hidden="true" /> Touch the moon
            </span>
          </motion.button>

          <AnimatePresence>
            {moonClicked && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="mt-12 max-w-lg text-center"
              >
                <p className="serif text-2xl italic leading-relaxed text-blush/90">
                  “The pack hears you. Somewhere in the dark, a wolf lifts its voice —
                  and the whole forest answers.”
                </p>
                <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/40">
                  The moon remembers those who look up
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>

        {/* ── Wolf Mode CTA ── */}
        <Reveal className="mt-16 flex justify-center">
          <div className="glass max-w-2xl rounded-3xl p-8 text-center md:p-12">
            <PawPrint className="mx-auto h-9 w-9 text-lilac-400" aria-hidden="true" />
            <h2 className="serif mt-4 text-3xl md:text-4xl">
              Ready to run <span className="text-gradient">with the pack</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-white/60">
              Wolf Mode turns the whole world darker, colder and wilder — the navigation sinks
              into shadow, the snow falls harder, and silhouettes watch from the treeline.
              You can always come back to the light.
            </p>
            <MagneticButton
              onClick={() => toggleWolfMode()}
              className="mt-8"
              ariaLabel={wolfMode ? 'Exit Wolf Mode' : 'Enter Wolf Mode'}
            >
              <PawPrint className="h-4 w-4" aria-hidden="true" />
              {wolfMode ? 'Return To The Light' : 'Enter Wolf Mode'}
            </MagneticButton>
            {wolfMode && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-5 flex items-center justify-center gap-2 text-sm text-lilac-300"
              >
                <Snowflake className="h-4 w-4" aria-hidden="true" /> Wolf Mode is active. The forest is watching.
              </motion.p>
            )}
          </div>
        </Reveal>

        {/* ── The Pack ── */}
        <div className="mt-28">
          <SectionHeading
            eyebrow="Six souls, one forest"
            title="The Pack"
            subtitle="Every wolf here carries a piece of a personality I see in the people I love. Find yours."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {wolves.pack.map((wolf, i) => (
              <Reveal key={wolf.id} delay={i * 0.07}>
                <motion.article
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="glass card-hover group overflow-hidden rounded-3xl"
                >
                  <div className="relative overflow-hidden">
                    <SafeImage
                      src={wolf.image}
                      alt={`${wolf.name} — wolf of the pack`}
                      className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent" />
                    <span className="absolute bottom-4 left-4 rounded-full border border-lilac-400/30 bg-ink-950/60 px-3 py-1 text-[11px] uppercase tracking-widest text-lilac-300 backdrop-blur-md">
                      {wolf.personality}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="serif text-3xl">
                      <span className="text-gradient">{wolf.name}</span>
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/60">{wolf.description}</p>
                  </div>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── Wolf gallery ── */}
        <div className="mt-28">
          <SectionHeading
            eyebrow="Scenes from the wild"
            title="Wolf Gallery"
            subtitle="Swipe or scroll through the world the pack calls home. Tap any scene to step inside it."
          />
          <div className="no-scrollbar flex gap-5 overflow-x-auto pb-4">
            {wolves.gallery.map((g, i) => (
              <Reveal key={g.src} delay={Math.min(i * 0.06, 0.3)} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setViewerIndex(i)}
                  aria-label={`Open scene: ${g.caption}`}
                  className="group relative block w-[78vw] overflow-hidden rounded-3xl sm:w-[420px]"
                >
                  <SafeImage
                    src={g.src}
                    alt={g.caption}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
                  <p className="serif absolute bottom-5 left-6 text-xl italic text-white/85">
                    {g.caption}
                  </p>
                </button>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── Facts + quotes ── */}
        <div className="mt-28 grid gap-5 lg:grid-cols-2">
          {/* Facts */}
          <Reveal>
            <div className="glass h-full rounded-3xl p-7 md:p-9">
              <p className="section-eyebrow mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" aria-hidden="true" /> Things worth knowing
              </p>
              <h2 className="serif text-3xl md:text-4xl">
                <span className="text-gradient">Wolf Facts</span>
              </h2>
              <div className="mt-7 space-y-3">
                {wolves.facts.map((fact, i) => {
                  const open = factOpen === i;
                  return (
                    <div key={fact.title} className="rounded-2xl bg-white/[0.04]">
                      <button
                        type="button"
                        onClick={() => setFactOpen(open ? null : i)}
                        aria-expanded={open}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      >
                        <span className="font-medium text-white/85">{fact.title}</span>
                        <Trees
                          className={`h-4 w-4 shrink-0 text-lilac-400 transition-transform duration-300 ${
                            open ? 'rotate-90' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35 }}
                            className="overflow-hidden px-5 text-sm leading-relaxed text-white/60"
                          >
                            <span className="block pb-5">{fact.text}</span>
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Quotes */}
          <Reveal delay={0.1}>
            <div className="glass relative flex h-full flex-col rounded-3xl p-7 md:p-9">
              <p className="section-eyebrow mb-2 flex items-center gap-2">
                <Quote className="h-4 w-4" aria-hidden="true" /> Words from the wild
              </p>
              <h2 className="serif text-3xl md:text-4xl">
                <span className="text-gradient">Wolf Quotes</span>
              </h2>
              <div className="relative mt-8 flex-1">
                <AnimatePresence mode="wait">
                  <motion.blockquote
                    key={quoteIndex}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.5 }}
                    className="serif text-2xl md:text-3xl italic leading-relaxed text-white/85"
                  >
                    “{wolves.quotes[quoteIndex]}”
                  </motion.blockquote>
                </AnimatePresence>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <div className="flex gap-2">
                  {wolves.quotes.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Quote ${i + 1}`}
                      onClick={() => setQuoteIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === quoteIndex ? 'w-6 bg-blush' : 'w-2 bg-white/25 hover:bg-white/45'
                      }`}
                    />
                  ))}
                </div>
                <MagneticButton
                  variant="ghost"
                  onClick={() => setQuoteIndex((q) => (q + 1) % wolves.quotes.length)}
                  className="px-5 py-2.5 text-sm"
                  ariaLabel="Next quote"
                >
                  Next <CloudFog className="h-4 w-4" aria-hidden="true" />
                </MagneticButton>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── Fullscreen scene viewer ── */}
      <AnimatePresence>
        {viewerIndex !== null && (
          <PhotoViewer
            images={galleryImages}
            index={viewerIndex}
            captions={galleryCaptions}
            onClose={() => setViewerIndex(null)}
            onIndexChange={setViewerIndex}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
