import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Maximize2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SafeImage from './SafeImage';

/**
 * Fullscreen cinematic photo viewer.
 *  - previous / next (buttons, keyboard arrows, swipe on mobile)
 *  - image counter
 *  - Escape to close
 *  - favorite hearts (persisted)
 *  - double-click → Easter egg
 */
export default function PhotoViewer({ images, index, onClose, onIndexChange, captions = [] }) {
  const { bumpStat, toggleFavorite, isFavorite, discoverSecret } = useApp();
  const [touchStart, setTouchStart] = useState(null);
  const [direction, setDirection] = useState(0);

  const goPrev = useCallback(() => {
    setDirection(-1);
    onIndexChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onIndexChange]);

  const goNext = useCallback(() => {
    setDirection(1);
    onIndexChange((index + 1) % images.length);
  }, [index, images.length, onIndexChange]);

  // count a photo view
  useEffect(() => {
    bumpStat('photosViewed');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // keyboard navigation + escape + scroll lock
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

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const delta = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(delta) > 45) (delta < 0 ? goNext : goPrev)();
    setTouchStart(null);
  };

  const src = images[index];
  const fav = isFavorite(src);

  return (
    <motion.div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/92 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* top bar */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-5">
        <div className="flex items-center gap-3 text-white/70">
          <Maximize2 className="h-4 w-4" aria-hidden="true" />
          <span className="serif text-lg tracking-wide">
            {index + 1} <span className="text-white/40">/ {images.length}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={fav}
            onClick={() => toggleFavorite(src)}
            className={`flex h-11 w-11 items-center justify-center rounded-full glass transition-all ${
              fav ? 'text-blush shadow-glow-pink' : 'text-white/70 hover:text-blush'
            }`}
          >
            <Heart className={`h-5 w-5 ${fav ? 'fill-blush' : ''}`} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Close viewer"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full glass text-white/80 hover:text-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* image */}
      <div className="relative flex h-full w-full items-center justify-center px-4 md:px-20">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={src + index}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction * -60, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-h-[78vh] max-w-full flex-col items-center"
          >
            <SafeImage
              src={src}
              alt={captions[index] || `Photo ${index + 1}`}
              rounded={false}
              eager
              onDoubleClick={() => discoverSecret('photo')}
              className="max-h-[74vh] w-auto max-w-full rounded-lg object-contain shadow-[0_30px_90px_rgba(0,0,0,0.8)]"
            />
            {captions[index] && (
              <p className="serif mt-5 text-center text-lg italic text-white/70">{captions[index]}</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* arrows */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={goPrev}
            className="absolute left-3 top-1/2 hidden -translate-y-1/2 md:flex h-13 w-13 h-12 w-12 items-center justify-center rounded-full glass text-white/80 hover:text-white md:left-6"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={goNext}
            className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full glass text-white/80 hover:text-white md:right-6 md:flex"
          >
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>
        </>
      )}

      {/* thumbnails */}
      {images.length > 1 && (
        <div className="absolute inset-x-0 bottom-0 z-10 hidden md:flex justify-center gap-2 p-5">
          <div className="no-scrollbar glass max-w-[70vw] rounded-full px-3 py-2 flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={img + i}
                type="button"
                aria-label={`Go to photo ${i + 1}`}
                onClick={() => { setDirection(i > index ? 1 : -1); onIndexChange(i); }}
                className={`h-10 w-14 shrink-0 overflow-hidden rounded-md border transition-all ${
                  i === index ? 'border-blush opacity-100' : 'border-white/15 opacity-50 hover:opacity-80'
                }`}
              >
                <SafeImage src={img} alt="" rounded={false} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
