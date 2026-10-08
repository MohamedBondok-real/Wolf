import { useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import SafeImage from './SafeImage';
import { formatDate } from '../utils/time';

/**
 * Fullscreen cinematic memory modal:
 * large photo, story, date, category, previous / next, close, blurred backdrop.
 */
export default function MemoryModal({ memory, allMemories, onClose, onNavigate }) {
  const index = allMemories.findIndex((m) => m.id === memory?.id);

  const goPrev = useCallback(() => {
    if (!memory) return;
    const prev = allMemories[(index - 1 + allMemories.length) % allMemories.length];
    onNavigate(prev);
  }, [memory, allMemories, index, onNavigate]);

  const goNext = useCallback(() => {
    if (!memory) return;
    const next = allMemories[(index + 1) % allMemories.length];
    onNavigate(next);
  }, [memory, allMemories, index, onNavigate]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [goPrev, goNext, onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-ink-950/80 backdrop-blur-2xl p-4 md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onClick={onClose}
    >
      <AnimatePresence mode="wait">
        {memory && (
          <motion.article
            key={memory.id}
            initial={{ opacity: 0, y: 26, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong relative grid max-h-[88vh] w-full max-w-5xl overflow-hidden rounded-3xl md:grid-cols-2"
          >
            <button
              type="button"
              aria-label="Close memory"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white/80 backdrop-blur-md hover:text-white"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="relative min-h-[260px] md:min-h-[520px]">
              <SafeImage
                src={memory.photo}
                alt={memory.title}
                rounded={false}
                eager
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
            </div>

            <div className="flex flex-col justify-center p-7 md:p-10">
              <span className="chip mb-5 self-start border-lilac-400/30 bg-lilac-500/10 text-lilac-300">
                {memory.category}
              </span>
              <h3 className="serif text-3xl md:text-4xl font-medium text-gradient">{memory.title}</h3>
              <p className="mt-2 text-sm uppercase tracking-[0.25em] text-white/40">
                {formatDate(memory.date)}
              </p>
              <p className="mt-6 leading-relaxed text-white/75">{memory.story}</p>

              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={goPrev}
                  className="btn-ghost px-4 py-2.5 text-sm"
                  aria-label="Previous memory"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
                </button>
                <span className="text-sm text-white/40">
                  {index + 1} / {allMemories.length}
                </span>
                <button
                  type="button"
                  onClick={goNext}
                  className="btn-ghost px-4 py-2.5 text-sm"
                  aria-label="Next memory"
                >
                  Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.article>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
