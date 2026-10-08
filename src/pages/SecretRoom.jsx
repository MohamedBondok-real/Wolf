import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Ghost, KeyRound, Lock, Moon, Scroll, Sparkles } from 'lucide-react';
import photos from '../data/photos';
import siteConfig from '../config/siteConfig';
import { easterEggs } from '../data/easterEggs';
import { useApp } from '../context/AppContext';
import { playSfx } from '../utils/sound';
import Reveal from '../components/Reveal';
import SafeImage from '../components/SafeImage';
import MagneticButton from '../components/MagneticButton';
import PhotoViewer from '../components/PhotoViewer';
import SectionHeading from '../components/SectionHeading';
import Footer from '../components/Footer';

const SECRET_MESSAGES = [
  'This room was never on any map. You were never supposed to find it.',
  'Some friendships leave fingerprints on the places they touch. This is one of them.',
  'If you are reading this, then curiosity won — and curiosity is one of the best things about you.',
  'The wolves know you now. They always know.',
];

const SECRET_NOTES = [
  { title: 'A note, left in the dark', text: 'I built a door and hid the key in plain sight. Then I realized the best hiding place was trust — you found it anyway.' },
  { title: 'A promise', text: 'Everything hidden here stays between us and the moon.' },
  { title: 'A confession', text: 'I have re-read our old conversations more times than I will ever admit. The good ones never get old.' },
];

const FUNNY_MEMORIES = [
  { title: 'The Great Misunderstanding', text: 'We argued for twenty minutes about something that turned out to be a typo. Neither of us admitted it until days later.' },
  { title: 'The Inside Joke, Classified', text: 'There is a word. There is a story. You know the word. You live the story. Enough said.' },
  { title: 'The Time We Got Lost', text: 'We took a wrong turn, ended up somewhere neither of us had ever been, and called it the best part of the trip.' },
];

/**
 * The Secret Room — a hidden page that is NOT in the navigation.
 * Entry: type the secret code ("wolf") anywhere, or use the code input below.
 */
export default function SecretRoom() {
  const navigate = useNavigate();
  const { roomUnlocked, unlockRoom, secrets, secretProgress } = useApp();
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(null);

  const tryCode = () => {
    if (code.trim().toLowerCase() === siteConfig.secretCode) {
      playSfx('secret');
      unlockRoom();
    } else {
      setError(true);
      playSfx('click');
      window.setTimeout(() => setError(false), 1200);
    }
  };

  /* ── Locked state ── */
  if (!roomUnlocked) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-6 pt-28">
        <div className="glass-strong w-full max-w-md rounded-3xl p-10 text-center">
          <motion.div
            animate={{ rotate: [0, -6, 6, 0], scale: [1, 1.06, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-night-500/50 to-ink-800 shadow-glow"
          >
            <Lock className="h-8 w-8 text-lilac-300" aria-hidden="true" />
          </motion.div>
          <h1 className="serif text-3xl md:text-4xl">
            This door is <span className="text-gradient">locked</span>
          </h1>
          <p className="mt-4 text-white/55">
            You were never supposed to be here. But since you are — whisper the right word.
          </p>
          <div className="mt-7 flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && tryCode()}
              placeholder="the secret word…"
              aria-label="Secret code"
              className={`input-glass ${error ? 'border-red-400/60' : ''}`}
            />
            <MagneticButton onClick={tryCode} ariaLabel="Unlock the secret room" className="px-5">
              <KeyRound className="h-4 w-4" aria-hidden="true" />
            </MagneticButton>
          </div>
          {error && (
            <p className="mt-3 text-sm text-red-300/80">Not quite. The forest keeps its secrets.</p>
          )}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-7 text-sm text-white/40 underline-offset-4 hover:text-white/70 hover:underline"
          >
            Go back before anyone notices
          </button>
        </div>
      </div>
    );
  }

  /* ── Unlocked state ── */
  return (
    <div className="relative min-h-screen px-6 pb-10 pt-28 md:pt-36">
      {/* eerie local background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#070310] via-ink-950 to-[#070310]" />
        <div className="absolute left-1/2 top-[-10%] h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-wine-600/15 blur-[120px]" aria-hidden="true" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="text-center">
          <Reveal>
            <p className="section-eyebrow mb-4 flex items-center justify-center gap-2">
              <Ghost className="h-4 w-4" aria-hidden="true" /> You were never supposed to be here
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="serif text-4xl md:text-6xl leading-tight">
              <span className="text-gradient">
                You Found Something That Wasn't Supposed To Be Easy To Find.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="serif mx-auto mt-6 max-w-xl text-lg italic text-white/60">
              So everything in this room belongs to the curious. Welcome, ${siteConfig.nickname}.
            </p>
          </Reveal>
        </div>

        {/* ── Secret progress ── */}
        <Reveal className="mt-14">
          <div className="glass mx-auto max-w-3xl rounded-3xl p-8">
            <div className="flex items-center justify-between">
              <p className="section-eyebrow flex items-center gap-2">
                <Sparkles className="h-4 w-4" aria-hidden="true" /> Secrets Discovered
              </p>
              <p className="serif text-3xl">
                <span className="text-gradient">{secretProgress.found}</span>
                <span className="text-white/40"> / {secretProgress.total}</span>
              </p>
            </div>
            <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-wine-400 via-lilac-400 to-blush"
                initial={{ width: 0 }}
                animate={{ width: `${(secretProgress.found / secretProgress.total) * 100}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {easterEggs.map((egg) => {
                const found = secrets.includes(egg.id);
                return (
                  <div
                    key={egg.id}
                    className={`rounded-2xl border p-4 transition-all ${
                      found
                        ? 'border-blush/30 bg-blush/5'
                        : 'border-white/8 bg-white/[0.02] opacity-60'
                    }`}
                  >
                    <p className={`flex items-center gap-2 font-medium ${found ? 'text-blush' : 'text-white/50'}`}>
                      {found ? <Sparkles className="h-4 w-4" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
                      {found ? egg.title : '?????????'}
                    </p>
                    <p className="mt-1 text-xs text-white/45">{egg.hint}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* ── Hidden photos ── */}
        <div className="mt-20">
          <SectionHeading
            eyebrow="Frames that were never shown"
            title="Hidden Photos"
            subtitle="Three photographs that stayed in the dark — until now."
          />
          <div className="grid gap-5 sm:grid-cols-3">
            {photos.secret.map((src, i) => (
              <Reveal key={src} delay={i * 0.08}>
                <button
                  type="button"
                  onClick={() => setViewerIndex(i)}
                  aria-label={`Open hidden photo ${i + 1}`}
                  className="group relative block overflow-hidden rounded-3xl"
                >
                  <SafeImage
                    src={src}
                    alt={`Hidden photo ${i + 1}`}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent opacity-80" />
                  <span className="absolute bottom-4 left-5 text-[11px] uppercase tracking-[0.3em] text-white/60">
                    Classified · 0{i + 1}
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── Secret messages ── */}
        <div className="mt-20 grid gap-5 md:grid-cols-2">
          {SECRET_MESSAGES.map((msg, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="glass rounded-3xl p-7">
                <Moon className="h-5 w-5 text-lilac-400" aria-hidden="true" />
                <p className="serif mt-4 text-lg italic leading-relaxed text-white/75">“{msg}”</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── Funny memories ── */}
        <div className="mt-20">
          <SectionHeading
            eyebrow="The drawer nobody was supposed to open"
            title="Funny Memories"
            subtitle="The stories we laugh about when nobody else is listening."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {FUNNY_MEMORIES.map((m, i) => (
              <Reveal key={m.title} delay={i * 0.08}>
                <div className="glass card-hover h-full rounded-3xl p-7">
                  <Ghost className="h-6 w-6 text-wine-400" aria-hidden="true" />
                  <h3 className="serif mt-4 text-2xl text-white">{m.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{m.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── Special notes ── */}
        <div className="mt-20">
          <SectionHeading
            eyebrow="Folded small, kept close"
            title="Special Notes"
            subtitle="Little things I wrote down so I would never forget them."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {SECRET_NOTES.map((note, i) => (
              <Reveal key={note.title} delay={i * 0.08}>
                <div className="glass-strong h-full rounded-3xl p-7">
                  <Scroll className="h-6 w-6 text-blush/80" aria-hidden="true" />
                  <h3 className="serif mt-4 text-2xl">
                    <span className="text-gradient">{note.title}</span>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{note.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-16 flex justify-center">
          <MagneticButton variant="ghost" onClick={() => navigate('/surprise')} ariaLabel="Continue to the surprise">
            One more door waits this way →
          </MagneticButton>
        </Reveal>
      </div>

      <AnimatePresence>
        {viewerIndex !== null && (
          <PhotoViewer
            images={photos.secret}
            index={viewerIndex}
            captions={['Classified · 01', 'Classified · 02', 'Classified · 03']}
            onClose={() => setViewerIndex(null)}
            onIndexChange={setViewerIndex}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
