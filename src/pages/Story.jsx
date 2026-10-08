import { useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Compass, Sparkles } from 'lucide-react';
import story from '../data/story';
import memories from '../data/memories';
import { pickDifferentIndex } from '../utils/random';
import { formatDate } from '../utils/time';
import Reveal from '../components/Reveal';
import Polaroid from '../components/Polaroid';
import MagneticButton from '../components/MagneticButton';
import MemoryModal from '../components/MemoryModal';
import SectionHeading from '../components/SectionHeading';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';

/**
 * Interactive cinematic timeline.
 * The line grows as you scroll; images reveal; text fades in.
 */
export default function Story() {
  const { bumpStat, showToast } = useApp();
  const containerRef = useRef(null);
  const [randomMemory, setRandomMemory] = useState(null);
  const [lastMemoryIndex, setLastMemoryIndex] = useState(-1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 70%', 'end 60%'],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });

  const showAnotherMemory = () => {
    const i = pickDifferentIndex(memories.length, lastMemoryIndex);
    setLastMemoryIndex(i);
    bumpStat('memoriesOpened');
    setRandomMemory(memories[i]);
    showToast({
      title: 'Another memory, unlocked',
      message: `“${memories[i].title}” — ${formatDate(memories[i].date)}`,
      kind: 'info',
      icon: 'BookHeart',
      duration: 3800,
    });
  };

  return (
    <div className="relative min-h-screen px-6 pb-10 pt-28 md:pt-36">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Chapter by chapter"
          title="Our Story"
          subtitle="Not a timeline of dates — a timeline of moments that quietly became us. Scroll slowly; every chapter deserves its time."
        />

        {/* ── Timeline ── */}
        <div ref={containerRef} className="relative">
          {/* growing line */}
          <div
            aria-hidden="true"
            className="absolute left-4 top-0 h-full w-px bg-white/[0.07] md:left-1/2 md:-translate-x-1/2"
          >
            <motion.div
              className="h-full w-full origin-top bg-gradient-to-b from-wine-400 via-lilac-400 to-blush shadow-glow"
              style={{ scaleY: lineScale }}
            />
          </div>

          <div className="space-y-16 md:space-y-24">
            {story.map((item, i) => {
              const left = i % 2 === 0;
              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col gap-8 md:flex-row md:items-center ${
                    left ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* node */}
                  <div
                    aria-hidden="true"
                    className="absolute left-4 top-8 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-gradient-to-br from-wine-400 to-lilac-400 shadow-glow md:left-1/2"
                  />

                  {/* photo side */}
                  <div className="flex flex-1 justify-center pl-12 md:pl-0">
                    <Reveal y={left ? -24 : 24} className="relative">
                      <div
                        className="absolute -inset-4 rounded-full bg-lilac-500/10 blur-2xl"
                        aria-hidden="true"
                      />
                      <Polaroid
                        src={item.photo}
                        caption={item.title}
                        alt={`${item.title} — memory photo`}
                        seed={i + 1}
                        imgClassName="aspect-[4/3] w-[300px] md:w-[380px]"
                      />
                    </Reveal>
                  </div>

                  {/* text side */}
                  <div className="flex-1 pl-12 md:pl-0">
                    <Reveal delay={0.1} y={left ? 24 : -24}>
                      <div
                        className={`glass rounded-3xl p-7 md:p-8 ${
                          left ? 'md:ml-10' : 'md:mr-10'
                        }`}
                      >
                        <p className="text-[11px] uppercase tracking-[0.3em] text-lilac-400/80">
                          {item.tag} · {item.date}
                        </p>
                        <h3 className="serif mt-3 text-3xl md:text-4xl">
                          <span className="text-gradient">{item.title}</span>
                        </h3>
                        <p className="mt-4 leading-relaxed text-white/65">{item.description}</p>
                      </div>
                    </Reveal>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Show me another memory ── */}
        <Reveal className="mt-20 flex flex-col items-center text-center">
          <div className="glass rounded-3xl px-10 py-12">
            <Sparkles className="mx-auto h-8 w-8 text-lilac-400" aria-hidden="true" />
            <h3 className="serif mt-4 text-3xl">
              There are <span className="text-gradient">more memories</span> where those came from
            </h3>
            <p className="mx-auto mt-3 max-w-md text-white/55">
              Some of them never made it onto the timeline. Pull one out of the drawer.
            </p>
            <MagneticButton onClick={showAnotherMemory} className="mt-7">
              <Compass className="h-4 w-4" aria-hidden="true" /> Show Me Another Memory
            </MagneticButton>
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {randomMemory && (
          <MemoryModal
            memory={randomMemory}
            allMemories={memories}
            onClose={() => setRandomMemory(null)}
            onNavigate={setRandomMemory}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
