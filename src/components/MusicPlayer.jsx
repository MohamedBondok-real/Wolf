import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * Floating, persistent background-music control.
 * Never autoplays — the user turns it on. Preference saved to localStorage.
 */
export default function MusicPlayer() {
  const { musicOn, toggleMusic, volume, setVolume, getAudio } = useApp();
  const [expanded, setExpanded] = useState(false);

  // keep the persistent <audio> element in sync
  useEffect(() => {
    const audio = getAudio();
    if (!audio) return;
    audio.volume = volume;
    if (musicOn) {
      const p = audio.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } else {
      audio.pause();
    }
  }, [musicOn, volume, getAudio]);

  return (
    <div className="fixed bottom-24 right-4 z-[76] md:bottom-6 flex flex-col items-end gap-3">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="glass-strong rounded-2xl px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <VolumeX className="h-4 w-4 text-white/50" aria-hidden="true" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                aria-label="Music volume"
                onChange={(e) => setVolume(Number(e.target.value))}
                className="h-1 w-28 cursor-pointer appearance-none rounded-full bg-white/15 accent-lilac-400"
              />
              <Volume2 className="h-4 w-4 text-lilac-300" aria-hidden="true" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={toggleMusic}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        onFocus={() => setExpanded(true)}
        onBlur={() => setExpanded(false)}
        aria-label={musicOn ? 'Turn music off' : 'Turn music on'}
        aria-pressed={musicOn}
        title={musicOn ? 'Music: On' : 'Music: Off'}
        className={`glass relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
          musicOn ? 'text-blush shadow-glow' : 'text-white/60 hover:text-lilac-300'
        }`}
      >
        {musicOn ? (
          <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
            <span className="eq-bar" style={{ animationDelay: '0s' }} />
            <span className="eq-bar" style={{ animationDelay: '0.15s' }} />
            <span className="eq-bar" style={{ animationDelay: '0.3s' }} />
          </span>
        ) : (
          <Music className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
