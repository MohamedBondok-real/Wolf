import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

/** Simple howling-wolf silhouette (single outline). */
function WolfSilhouette({ className, style, delay = 0 }) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMax meet"
      className={`wolf-silhouette ${className}`}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 1.2 }}
      aria-hidden="true"
    >
      <polygon points="2,62 10,74 30,68 52,66 64,62 72,46 78,32 82,20 86,24 94,30 84,40 76,52 70,66 72,92 76,92 74,70 44,70 40,92 36,92 34,72 18,72 16,92 12,92 14,72 4,84" />
    </motion.svg>
  );
}

/**
 * When Wolf Mode is active: the world gets darker, colder,
 * and wolf silhouettes watch from the edges of the screen.
 */
export default function WolfModeOverlay() {
  const { wolfMode } = useApp();

  return (
    <AnimatePresence>
      {wolfMode && (
        <>
          <motion.div
            key="wolf-tint"
            className="pointer-events-none fixed inset-0 z-[63] bg-gradient-to-b from-night-600/20 via-transparent to-night-600/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            aria-hidden="true"
          />
          <WolfSilhouette
            className="bottom-0 left-[4%] h-28 w-28 md:h-40 md:w-40"
            delay={0.1}
          />
          <WolfSilhouette
            className="bottom-0 right-[6%] h-20 w-20 md:h-32 md:w-32"
            style={{ animationDelay: '1.4s', transform: 'scaleX(-1)' }}
            delay={0.3}
          />
          <WolfSilhouette
            className="bottom-0 left-[42%] h-14 w-14 md:h-24 md:w-24"
            style={{ animationDelay: '2.6s' }}
            delay={0.5}
          />
        </>
      )}
    </AnimatePresence>
  );
}
