import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Mail, MailOpen, Sparkles, X } from 'lucide-react';
import letters from '../data/letters';
import { useApp } from '../context/AppContext';
import { playSfx } from '../utils/sound';
import Reveal from '../components/Reveal';
import MagneticButton from '../components/MagneticButton';
import SectionHeading from '../components/SectionHeading';
import Footer from '../components/Footer';

const MOOD_TINTS = {
  warm: 'from-amber-200/20',
  soft: 'from-blush/20',
  fire: 'from-wine-500/25',
  moon: 'from-night-500/30',
  lavender: 'from-lilac-500/25',
};

/** A CSS envelope with a wax-seal heart. */
function Envelope({ letter, index, onOpen }) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(letter)}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 240, damping: 18 }}
      className="group glass card-hover relative flex aspect-[4/3] w-full flex-col items-center justify-center overflow-hidden rounded-3xl p-6 text-center"
      aria-label={`Open letter: ${letter.title}`}
    >
      {/* envelope body */}
      <div className="relative h-28 w-40">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#e9dcc8] to-[#cbb99f] shadow-xl transition-transform duration-500 group-hover:-translate-y-1" />
        {/* flap */}
        <div
          className="envelope-flap absolute inset-x-0 top-0 h-full rounded-t-xl bg-gradient-to-b from-[#f4ead9] to-[#d9c8ab] transition-transform duration-500 group-hover:[transform:rotateX(28deg)]"
          style={{ transformOrigin: 'top center', backfaceVisibility: 'hidden' }}
        />
        {/* letter peeking */}
        <div className="absolute inset-x-3 top-2 h-10 rounded-md bg-white/90 shadow-sm transition-transform duration-500 group-hover:-translate-y-2" />
        {/* wax seal */}
        <span className="absolute left-1/2 top-[58%] flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-wine-500 to-wine-600 text-blush shadow-lg ring-2 ring-wine-400/40">
          <Heart className="h-4 w-4 fill-blush" aria-hidden="true" />
        </span>
      </div>
      <h3 className="serif mt-6 text-xl text-white">{letter.title}</h3>
      <p className="mt-2 text-sm italic text-white/50">{letter.hint}</p>
      <span className="mt-4 flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-lilac-400">
        <Mail className="h-3.5 w-3.5" aria-hidden="true" /> Open the envelope
      </span>
    </motion.button>
  );
}

/**
 * Interactive digital envelopes. Opening one unfolds the letter:
 * the background shifts, particles bloom, and the words appear line by line.
 */
export default function Letters() {
  const { bumpStat } = useApp();
  const [openLetter, setOpenLetter] = useState(null);

  const handleOpen = (letter) => {
    playSfx('open');
    bumpStat('lettersOpened');
    setOpenLetter(letter);
  };

  return (
    <div className="relative min-h-screen px-6 pb-10 pt-28 md:pt-36">
      {/* background tint changes while a letter is open */}
      <AnimatePresence>
        {openLetter && (
          <motion.div
            key="letter-bg"
            className={`pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b ${MOOD_TINTS[openLetter.mood] ?? MOOD_TINTS.lavender} to-ink-950/60`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Paper, but make it magic"
          title="Letters"
          subtitle="Five envelopes, each for a different kind of day. Open the one you need — the words will find their own light."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {letters.map((letter, i) => (
            <Reveal key={letter.id} delay={i * 0.08}>
              <Envelope letter={letter} index={i} onOpen={handleOpen} />
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── Opened letter ── */}
      <AnimatePresence>
        {openLetter && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-black/70 backdrop-blur-2xl p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setOpenLetter(null)}
          >
            <motion.article
              initial={{ opacity: 0, y: 60, rotateX: -14 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: 30, rotateX: 8 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl"
            >
              {/* glow behind the letter */}
              <div
                className="absolute -inset-8 rounded-[2rem] bg-lilac-400/15 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative max-h-[82vh] overflow-y-auto rounded-[1.6rem] border border-lilac-300/20 bg-gradient-to-b from-[#171021] to-[#0d0716] p-8 md:p-12 shadow-glow">
                <button
                  type="button"
                  aria-label="Close letter"
                  onClick={() => setOpenLetter(null)}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-white/70 hover:text-white"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>

                <div className="mb-8 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-wine-500/40 to-lilac-500/40 text-blush">
                    <MailOpen className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-lilac-400/80">A letter for you</p>
                    <h2 className="serif text-2xl md:text-3xl">
                      <span className="text-gradient">{openLetter.title}</span>
                    </h2>
                  </div>
                </div>

                <div className="space-y-5">
                  {openLetter.paragraphs.map((paragraph, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + i * 0.35, duration: 0.7 }}
                      className="serif text-lg md:text-xl leading-relaxed text-white/85 whitespace-pre-line"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + openLetter.paragraphs.length * 0.35, duration: 1 }}
                  className="mt-10 flex items-center gap-2 text-lilac-300/70"
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  <span className="text-xs uppercase tracking-[0.3em]">Sealed with friendship</span>
                </motion.div>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
