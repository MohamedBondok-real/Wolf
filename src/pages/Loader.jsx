import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PawPrint } from 'lucide-react';
import photos from '../data/photos';
import { useApp } from '../context/AppContext';

/**
 * Cinematic loading screen: "Preparing your little universe…"
 * Animated percentage, particles, soft glow, background slowly appearing.
 */
export default function Loader() {
  const { finishLoading } = useApp();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const duration = 2300;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      // ease-out for a cinematic settle
      const eased = 1 - Math.pow(1 - p, 2.4);
      setProgress(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!doneRef.current) {
        doneRef.current = true;
        setProgress(100);
        setDone(true);
        window.setTimeout(() => finishLoading(), 950);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [finishLoading]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-ink-950"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* background image slowly appearing */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.18 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ duration: 2.6, ease: 'easeOut' }}
          >
            <img
              src={photos.hero}
              alt=""
              className="h-full w-full object-cover"
              style={{ filter: 'blur(6px) brightness(0.7)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/40 to-ink-950" />
          </motion.div>

          {/* soft glow */}
          <motion.div
            className="absolute h-[420px] w-[420px] rounded-full bg-wine-500/25 blur-[120px]"
            animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />

          {/* particles */}
          <div className="absolute inset-0" aria-hidden="true">
            {Array.from({ length: 26 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute h-1 w-1 rounded-full bg-lilac-300"
                style={{ left: `${(i * 137) % 100}%`, top: `${(i * 89) % 100}%` }}
                animate={{ opacity: [0.1, 0.9, 0.1], scale: [0.6, 1.4, 0.6] }}
                transition={{
                  duration: 2.4 + (i % 5) * 0.4,
                  repeat: Infinity,
                  delay: (i % 7) * 0.3,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* content */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-wine-500 to-lilac-500 shadow-glow-wine"
            >
              <PawPrint className="h-7 w-7 text-white" aria-hidden="true" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="serif text-xl md:text-2xl italic text-white/80"
            >
              Preparing your little universe
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                …
              </motion.span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 w-64 max-w-[70vw]"
            >
              <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-wine-400 via-lilac-400 to-blush shadow-glow"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.12, ease: 'linear' }}
                />
              </div>
              <p className="serif mt-4 text-5xl font-medium text-gradient">{progress}%</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
