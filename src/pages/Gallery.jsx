import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Crown, Eye, Heart, Shuffle, Sparkles, Wand2 } from 'lucide-react';
import photos from '../data/photos';
import { useApp } from '../context/AppContext';
import { pickDifferent, pickDifferentIndex, shuffled } from '../utils/random';
import Reveal from '../components/Reveal';
import SafeImage from '../components/SafeImage';
import PhotoViewer from '../components/PhotoViewer';
import MagneticButton from '../components/MagneticButton';
import SectionHeading from '../components/SectionHeading';
import Footer from '../components/Footer';

const GALLERY_CAPTIONS = [
  'The way she laughs when she is not performing it.',
  'A quiet moment that felt like a secret.',
  'Light, landing on her exactly right.',
  'The smile that started a thousand conversations.',
  'Caught mid-story, mid-laugh, mid-life.',
  'One of those frames you never want to lose.',
  'Her, in her element.',
  'A memory, frozen in light.',
];

/**
 * Premium masonry gallery: shuffle, random memory, fullscreen viewer,
 * favorites, keyboard + swipe navigation, and one invisible message.
 */
export default function Gallery() {
  const { toggleFavorite, isFavorite, discoverSecret, secrets } = useApp();
  const [order, setOrder] = useState(photos.gallery);
  const [viewerIndex, setViewerIndex] = useState(null);
  const [moment, setMoment] = useState(() => photos.gallery[1]);
  const [hintFound, setHintFound] = useState(secrets.includes('gallery'));
  const [shuffleKey, setShuffleKey] = useState(0);

  const captions = useMemo(
    () => order.map((_, i) => GALLERY_CAPTIONS[i % GALLERY_CAPTIONS.length]),
    [order]
  );

  const handleShuffle = () => {
    setOrder((current) => shuffled(current));
    setShuffleKey((k) => k + 1);
  };

  const handleRandom = () => {
    const i = pickDifferentIndex(order.length, viewerIndex ?? -1);
    setViewerIndex(i);
  };

  const handleRandomMoment = () => setMoment((m) => pickDifferent(photos.all, m));

  const findHiddenMessage = () => {
    setHintFound(true);
    discoverSecret('gallery');
  };

  return (
    <div className="relative min-h-screen px-6 pb-10 pt-28 md:pt-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Every frame tells it"
          title="Gallery"
          subtitle="A masonry of moments — some loud, some quiet, all hers. Shuffle it, wander through it, or open any frame fullscreen."
        />

        {/* ── Controls ── */}
        <Reveal>
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            <MagneticButton onClick={handleShuffle} ariaLabel="Shuffle gallery">
              <Shuffle className="h-4 w-4" aria-hidden="true" /> Shuffle
            </MagneticButton>
            <MagneticButton variant="ghost" onClick={handleRandom} ariaLabel="Open a random memory">
              <Wand2 className="h-4 w-4" aria-hidden="true" /> Random Memory
            </MagneticButton>
            <MagneticButton
              variant="ghost"
              onClick={() => setViewerIndex(0)}
              ariaLabel="View fullscreen"
            >
              <Eye className="h-4 w-4" aria-hidden="true" /> View Fullscreen
            </MagneticButton>
          </div>
        </Reveal>

        {/* ── Photo of the Moment ── */}
        <Reveal>
          <div className="glass relative mb-14 overflow-hidden rounded-3xl">
            <div className="grid md:grid-cols-2">
              <div className="relative min-h-[300px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={moment}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0"
                  >
                    <SafeImage
                      src={moment}
                      alt="Photo of the moment"
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent md:bg-gradient-to-r" />
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/30 bg-amber-200/10 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-amber-200">
                  <Crown className="h-3.5 w-3.5" aria-hidden="true" /> Photo of the Moment
                </span>
                <h3 className="serif mt-5 text-3xl md:text-4xl">
                  <span className="text-gradient">Chosen by chance.</span>
                  <br />
                  Kept because of you.
                </h3>
                <p className="mt-4 text-white/60">
                  Every visit, a different frame finds its way to the light. Come back tomorrow —
                  the gallery always has a new favorite.
                </p>
                <MagneticButton variant="ghost" onClick={handleRandomMoment} className="mt-7 self-start">
                  <Shuffle className="h-4 w-4" aria-hidden="true" /> Crown Another
                </MagneticButton>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Masonry gallery ── */}
        <motion.div
          key={shuffleKey}
          className="columns-2 gap-5 md:columns-3 lg:columns-4 [column-fill:_balance]"
        >
          {order.map((src, i) => {
            const fav = isFavorite(src);
            return (
              <motion.figure
                key={src}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: Math.min(i * 0.05, 0.4) }}
                className="group relative mb-5 break-inside-avoid"
              >
                <button
                  type="button"
                  onClick={() => setViewerIndex(i)}
                  aria-label={`Open photo ${i + 1} fullscreen`}
                  className="block w-full overflow-hidden rounded-2xl"
                >
                  <SafeImage
                    src={src}
                    alt={captions[i]}
                    className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      i % 3 === 0 ? 'aspect-[3/4]' : i % 3 === 1 ? 'aspect-square' : 'aspect-[4/5]'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <figcaption className="serif absolute inset-x-0 bottom-0 p-4 text-sm italic text-white/85 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 translate-y-2">
                    {captions[i]}
                  </figcaption>
                </button>
                <button
                  type="button"
                  aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
                  aria-pressed={fav}
                  onClick={() => toggleFavorite(src)}
                  className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 backdrop-blur-md transition-all ${
                    fav ? 'text-blush' : 'text-white/60 opacity-0 group-hover:opacity-100 hover:text-blush'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${fav ? 'fill-blush' : ''}`} aria-hidden="true" />
                </button>
              </motion.figure>
            );
          })}
        </motion.div>

        {/* ── The invisible message — Easter egg ── */}
        <div className="relative mt-20 flex justify-center">
          {!hintFound ? (
            <button
              type="button"
              onClick={findHiddenMessage}
              className="select-none text-xs tracking-[0.2em] text-white/[0.06] transition-colors duration-700 hover:text-white/25"
              aria-label="There is something here. Investigate."
            >
              · · · something is written here, but you can barely see it · · ·
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass max-w-lg rounded-3xl p-8 text-center"
            >
              <Sparkles className="mx-auto h-6 w-6 text-lilac-400" aria-hidden="true" />
              <p className="serif mt-4 text-xl italic leading-relaxed text-white/80">
                “You weren't supposed to find this… but since you did: you're the kind of person
                who notices little things. That's one of my favorite things about you.”
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Fullscreen viewer ── */}
      <AnimatePresence>
        {viewerIndex !== null && (
          <PhotoViewer
            images={order}
            index={viewerIndex}
            captions={captions}
            onClose={() => setViewerIndex(null)}
            onIndexChange={setViewerIndex}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
