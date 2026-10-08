import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Gift, Music, Sparkles } from 'lucide-react';
import photos from '../data/photos';
import siteConfig from '../config/siteConfig';
import { surpriseMessages } from '../data/messages';
import { useApp } from '../context/AppContext';
import { playSfx } from '../utils/sound';
import SafeImage from '../components/SafeImage';
import MagneticButton from '../components/MagneticButton';
import Footer from '../components/Footer';

/**
 * The Surprise — a cinematic finale sequence:
 * black → stars → photos → messages → the final words → replay.
 */
const PHOTO_POOL = [...photos.special, ...photos.gallery.slice(0, 4)];
const PHOTO_TIMING = 2600;
const MESSAGE_TIMING = 2400;

export default function Surprise() {
  const { musicOn, toggleMusic } = useApp();
  const [phase, setPhase] = useState('intro'); // intro → black → photos → messages → final → end
  const [step, setStep] = useState(0);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const after = (ms, fn) => timers.current.push(window.setTimeout(fn, ms));

  useEffect(() => () => clearTimers(), []);

  const startSequence = () => {
    playSfx('transition', 1);
    setPhase('black');
    setStep(0);
    // fade to black → stars + photos appear one by one
    after(1400, () => setPhase('photos'));
    // after all photos, show messages
    after(1400 + PHOTO_TIMING * PHOTO_POOL.length + 600, () => setPhase('messages'));
    // after all messages, the final words
    after(1400 + PHOTO_TIMING * PHOTO_POOL.length + 600 + MESSAGE_TIMING * surpriseMessages.length + 600, () =>
      setPhase('final')
    );
    after(1400 + PHOTO_TIMING * PHOTO_POOL.length + 600 + MESSAGE_TIMING * surpriseMessages.length + 5200, () =>
      setPhase('end')
    );
  };

  const replay = () => {
    clearTimers();
    startSequence();
  };

  /* step indices while phases run */
  useEffect(() => {
    if (phase !== 'photos' && phase !== 'messages') return undefined;
    const pool = phase === 'photos' ? PHOTO_POOL : surpriseMessages;
    if (step >= pool.length) return undefined;
    const id = window.setTimeout(() => setStep((s) => s + 1), phase === 'photos' ? PHOTO_TIMING : MESSAGE_TIMING);
    return () => window.clearTimeout(id);
  }, [phase, step]);

  return (
    <div className="relative min-h-screen overflow-hidden px-6 pb-10 pt-28 md:pt-36">
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* ── Intro ── */}
        {phase === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="flex min-h-[60vh] flex-col items-center justify-center"
          >
            <motion.p
              className="serif text-4xl md:text-6xl text-white/85"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
            >
              Okay…
            </motion.p>
            <motion.p
              className="serif mt-8 text-3xl md:text-5xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 1.2 }}
            >
              <span className="text-gradient">One last thing.</span>
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.8, duration: 1 }}
            >
              <MagneticButton onClick={startSequence} className="mt-12 text-base" ariaLabel="Open the surprise">
                <Gift className="h-4 w-4" aria-hidden="true" /> Open The Surprise
              </MagneticButton>
              <p className="mt-5 flex items-center justify-center gap-2 text-sm text-white/45">
                <Music className="h-4 w-4" aria-hidden="true" />
                {musicOn ? 'The music is playing. Good.' : 'Turn the music on in the corner if you want.'}
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* ── Black fade ── */}
        <AnimatePresence>
          {phase === 'black' && (
            <motion.div
              key="black"
              className="fixed inset-0 z-[40] bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        {/* ── Photos phase ── */}
        {phase === 'photos' && (
          <div className="flex min-h-[70vh] w-full flex-col items-center justify-center">
            <div className="relative flex h-[52vh] w-full max-w-2xl items-center justify-center">
              <AnimatePresence>
                {PHOTO_POOL.slice(0, step + 1).map((src, i) => (
                  <motion.div
                    key={src}
                    initial={{ opacity: 0, scale: 1.08, rotate: i % 2 ? 2 : -2 }}
                    animate={{
                      opacity: i === step ? 1 : 0.35,
                      scale: i === step ? 1 : 0.94,
                      y: i === step ? 0 : 14,
                    }}
                    exit={{ opacity: 0, scale: 1.06 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute"
                    style={{ zIndex: i }}
                  >
                    <SafeImage
                      src={src}
                      alt={`A memory with ${siteConfig.name}`}
                      eager
                      className="h-[46vh] w-auto max-w-[86vw] rounded-3xl object-cover shadow-[0_30px_90px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <p className="mt-8 text-xs uppercase tracking-[0.35em] text-white/40">
              {step + 1} / {PHOTO_POOL.length} memories
            </p>
          </div>
        )}

        {/* ── Messages phase ── */}
        {phase === 'messages' && (
          <div className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-10">
            <div className="relative h-[40vh] w-full max-w-xl">
              <AnimatePresence>
                {surpriseMessages.slice(0, step + 1).map((msg, i) => (
                  <motion.p
                    key={msg}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: i === step ? 1 : 0.3, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="serif absolute inset-0 flex items-center justify-center text-center text-2xl md:text-4xl italic text-white/85"
                  >
                    “{msg}”
                  </motion.p>
                ))}
              </AnimatePresence>
            </div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/40">
              {step + 1} / {surpriseMessages.length}
            </p>
          </div>
        )}

        {/* ── Final words ── */}
        {phase === 'final' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-[70vh] flex-col items-center justify-center"
          >
            <motion.h2
              className="serif text-4xl md:text-6xl lg:text-7xl leading-tight text-center"
              initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-gradient">
                You are one of the most important people in my story.
              </span>
            </motion.h2>
            <motion.p
              className="serif mt-10 text-2xl md:text-4xl italic text-white/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1.2 }}
            >
              Thank you for being you.
            </motion.p>
            <motion.p
              className="serif mt-6 text-xl md:text-3xl text-lilac-300/90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4, duration: 1.2 }}
            >
              Here's to every memory we haven't made yet.
            </motion.p>
          </motion.div>
        )}

        {/* ── End ── */}
        {phase === 'end' && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex min-h-[70vh] flex-col items-center justify-center"
          >
            <Sparkles className="h-10 w-10 text-lilac-400" aria-hidden="true" />
            <p className="serif mt-6 text-3xl md:text-4xl">
              <span className="text-gradient">Until the next memory… ♡</span>
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <MagneticButton onClick={replay} ariaLabel="Replay the surprise">
                Replay
              </MagneticButton>
              <MagneticButton
                variant="ghost"
                onClick={() => {
                  showToast({
                    title: 'The ending, saved.',
                    message: 'Whenever you need it, the Final page is one click away.',
                    kind: 'info',
                    icon: 'Gift',
                  });
                  window.location.hash = '';
                  setPhase('intro');
                }}
                ariaLabel="Back to the beginning of the surprise"
              >
                Back
              </MagneticButton>
            </div>
          </motion.div>
        )}
      </div>

      {/* music nudge during the sequence */}
      <AnimatePresence>
        {(phase === 'photos' || phase === 'messages' || phase === 'final') && !musicOn && (
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            onClick={toggleMusic}
            className="glass fixed bottom-24 left-1/2 z-[50] -translate-x-1/2 flex items-center gap-2 rounded-full px-5 py-3 text-sm text-lilac-300 md:bottom-8"
            aria-label="Turn the music on"
          >
            <Music className="h-4 w-4" aria-hidden="true" /> This moment sounds better with music
          </motion.button>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
