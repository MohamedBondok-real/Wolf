import { AnimatePresence, motion } from 'framer-motion';
import { Headphones, Moon, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MagneticButton from './MagneticButton';

/** First-visit welcome modal — shown exactly once (localStorage). */
export default function WelcomeModal() {
  const { showWelcome, dismissWelcome } = useApp();

  return (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          className="fixed inset-0 z-[96] flex items-center justify-center bg-black/75 backdrop-blur-xl p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong relative w-full max-w-md rounded-3xl p-8 text-center md:p-10"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-wine-500/40 to-lilac-500/40 shadow-glow">
              <Moon className="h-7 w-7 text-blush" aria-hidden="true" />
            </div>
            <p className="section-eyebrow">Before you enter…</p>
            <h2 className="serif mt-4 text-3xl md:text-4xl">
              This is <span className="text-gradient">our little world</span>
            </h2>
            <div className="mt-6 space-y-3 text-white/65">
              <p className="flex items-center justify-center gap-2.5">
                <Sparkles className="h-4 w-4 text-lilac-400" aria-hidden="true" />
                Turn up the brightness.
              </p>
              <p className="flex items-center justify-center gap-2.5">
                <Headphones className="h-4 w-4 text-lilac-400" aria-hidden="true" />
                Put your headphones on if you want.
              </p>
              <p className="flex items-center justify-center gap-2.5">
                <Moon className="h-4 w-4 text-lilac-400" aria-hidden="true" />
                Then explore. There is no rush here.
              </p>
            </div>
            <MagneticButton onClick={dismissWelcome} className="mt-8 w-full" ariaLabel="Enter our world">
              Let's Go
            </MagneticButton>
            <p className="mt-4 text-xs text-white/35">
              You will only see this once. Everything else is waiting inside.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
