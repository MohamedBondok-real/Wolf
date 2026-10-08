import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { reasons, moreReasons } from '../data/reasons';
import { playSfx } from '../utils/sound';
import Reveal from '../components/Reveal';
import MagneticButton from '../components/MagneticButton';
import SectionHeading from '../components/SectionHeading';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';

/**
 * "Reasons You're Special" — animated numbered cards,
 * with an ever-growing pool behind "Give Me Another Reason".
 */
export default function Reasons() {
  const { showToast } = useApp();
  const [extraCount, setExtraCount] = useState(0);

  const visibleExtra = moreReasons.slice(0, extraCount);

  const giveAnother = () => {
    if (extraCount < moreReasons.length) {
      playSfx('click');
      setExtraCount((c) => c + 1);
    } else {
      showToast({
        title: 'That is all of them. For now.',
        message: 'The list grows every time I think of you — which is often.',
        kind: 'info',
        icon: 'Heart',
        duration: 4600,
      });
    }
  };

  return (
    <div className="relative min-h-screen px-6 pb-10 pt-28 md:pt-36">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="A list that never really ends"
          title="Reasons You're Special"
          subtitle="Ten to start. Press the button — there are always more. Friendship is the reason; this is just the paper it's written on."
        />

        {/* ── Numbered cards 01–10 ── */}
        <div className="grid gap-5 sm:grid-cols-2">
          {reasons.map((reason, i) => (
            <Reveal key={reason.number} delay={i * 0.05}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="glass card-hover group relative overflow-hidden rounded-3xl p-7"
              >
                <span
                  aria-hidden="true"
                  className="serif absolute -right-3 -top-6 text-8xl font-medium text-white/[0.045] transition-colors duration-500 group-hover:text-lilac-400/10"
                >
                  {reason.number}
                </span>
                <div className="relative z-10 flex items-start gap-5">
                  <span className="serif text-4xl font-medium text-gradient">{reason.number}</span>
                  <div>
                    <h3 className="serif text-2xl text-white">{reason.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{reason.text}</p>
                  </div>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>

        {/* ── Extra reasons, revealed one by one ── */}
        <AnimatePresence>
          {visibleExtra.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-5 grid gap-5 sm:grid-cols-2"
            >
              {visibleExtra.map((reason, i) => {
                const number = String(reasons.length + i + 1).padStart(2, '0');
                return (
                  <motion.article
                    key={number}
                    initial={{ opacity: 0, y: 26, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="glass relative overflow-hidden rounded-3xl border-lilac-400/25 p-7 shadow-glow"
                  >
                    <div className="flex items-start gap-5">
                      <span className="serif text-4xl font-medium text-gradient">{number}</span>
                      <div>
                        <h3 className="serif text-2xl text-white">{reason.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-white/60">{reason.text}</p>
                      </div>
                    </div>
                    <Sparkles
                      className="absolute right-4 top-4 h-4 w-4 text-lilac-400/60"
                      aria-hidden="true"
                    />
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Give me another ── */}
        <Reveal className="mt-14 flex justify-center">
          <div className="glass rounded-3xl px-10 py-10 text-center">
            <Heart className="mx-auto h-8 w-8 text-blush" aria-hidden="true" />
            <h3 className="serif mt-4 text-2xl md:text-3xl">
              {extraCount < moreReasons.length
                ? `There are more where those came from`
                : 'The list is long — like the friendship'}
            </h3>
            <MagneticButton onClick={giveAnother} className="mt-7" ariaLabel="Give me another reason">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {extraCount < moreReasons.length ? 'Give Me Another Reason' : 'That’s Enough For Now'}
            </MagneticButton>
          </div>
        </Reveal>
      </div>
      <Footer />
    </div>
  );
}
