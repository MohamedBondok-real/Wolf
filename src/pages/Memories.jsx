import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import memories, { MEMORY_CATEGORIES } from '../data/memories';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/time';
import Reveal from '../components/Reveal';
import SafeImage from '../components/SafeImage';
import MemoryModal from '../components/MemoryModal';
import SectionHeading from '../components/SectionHeading';
import Footer from '../components/Footer';

const CATEGORY_COLORS = {
  funny: 'border-amber-300/30 bg-amber-200/10 text-amber-200',
  random: 'border-lilac-300/30 bg-lilac-500/10 text-lilac-300',
  beautiful: 'border-blush/40 bg-blush/10 text-blush',
  chaotic: 'border-wine-400/40 bg-wine-500/15 text-rose-200',
  special: 'border-night-400/60 bg-night-500/20 text-blue-200',
};

/**
 * Advanced memory system: filterable cards + fullscreen cinematic modal.
 */
export default function Memories() {
  const { bumpStat } = useApp();
  const [filter, setFilter] = useState('all');
  const [active, setActive] = useState(null);

  const filtered = useMemo(
    () => (filter === 'all' ? memories : memories.filter((m) => m.category === filter)),
    [filter]
  );

  const openMemory = (memory) => {
    bumpStat('memoriesOpened');
    setActive(memory);
  };

  return (
    <div className="relative min-h-screen px-6 pb-10 pt-28 md:pt-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="The memory drawer"
          title="Memories"
          subtitle="Every card is a door. Open one, and the whole moment comes back — the light, the laughter, the way it felt."
        />

        {/* ── Filter chips ── */}
        <Reveal>
          <div className="mb-12 flex flex-wrap justify-center gap-2.5" role="tablist" aria-label="Filter memories">
            {MEMORY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={filter === cat}
                onClick={() => setFilter(cat)}
                className={`chip capitalize ${filter === cat ? 'chip-active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        {/* ── Memory cards ── */}
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((memory, i) => (
              <motion.button
                key={memory.id}
                layout
                initial={{ opacity: 0, y: 26, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.04, 0.3) }}
                onClick={() => openMemory(memory)}
                className="group glass card-hover overflow-hidden rounded-3xl text-left"
                aria-label={`Open memory: ${memory.title}`}
              >
                <div className="relative overflow-hidden">
                  <SafeImage
                    src={memory.photo}
                    alt={memory.title}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
                  <span
                    className={`absolute left-4 top-4 rounded-full border px-3 py-1 text-[11px] uppercase tracking-widest backdrop-blur-md ${
                      CATEGORY_COLORS[memory.category] ?? CATEGORY_COLORS.random
                    }`}
                  >
                    {memory.category}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">
                    {formatDate(memory.date)}
                  </p>
                  <h3 className="serif mt-2 text-2xl text-white transition-colors group-hover:text-blush">
                    {memory.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/55">
                    {memory.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="py-20 text-center text-white/50">No memories in this drawer yet.</p>
        )}
      </div>

      {/* ── Fullscreen cinematic modal ── */}
      <AnimatePresence>
        {active && (
          <MemoryModal
            memory={active}
            allMemories={memories}
            onClose={() => setActive(null)}
            onNavigate={setActive}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
