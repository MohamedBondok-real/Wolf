import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookHeart,
  Camera,
  Compass,
  Gift,
  Heart,
  Hourglass,
  Images,
  KeyRound,
  Lock,
  MailOpen,
  Mountain,
  PawPrint,
  RefreshCw,
  ScrollText,
  Shuffle,
  Sparkles,
  Trophy,
} from 'lucide-react';
import photos from '../data/photos';
import memories from '../data/memories';
import { randomMessages, moods } from '../data/messages';
import { easterEggs } from '../data/easterEggs';
import siteConfig from '../config/siteConfig';
import { useApp, ACHIEVEMENTS } from '../context/AppContext';
import { pickDifferent } from '../utils/random';
import { timeSince } from '../utils/time';
import CountUp from '../components/CountUp';
import Reveal from '../components/Reveal';
import SafeImage from '../components/SafeImage';
import MagneticButton from '../components/MagneticButton';
import SectionHeading from '../components/SectionHeading';
import Footer from '../components/Footer';

function GlassCard({ children, className = '' }) {
  return <div className={`glass rounded-3xl p-6 md:p-7 ${className}`}>{children}</div>;
}

function CardLabel({ icon: Icon, children }) {
  return (
    <p className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-lilac-300/80">
      <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {children}
    </p>
  );
}

/** Live "Time Since We Met" counter — ticks every second. */
function TimeCard() {
  const [, force] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => force((v) => v + 1), 1000);
    return () => window.clearInterval(id);
  }, []);
  const t = timeSince(siteConfig.friendshipStartDate);
  const units = [
    { value: t.years, label: 'Years' },
    { value: t.months, label: 'Months' },
    { value: t.days, label: 'Days' },
    { value: t.hours, label: 'Hours' },
  ];
  return (
    <GlassCard>
      <CardLabel icon={Hourglass}>Time Since We Met</CardLabel>
      <div className="grid grid-cols-4 gap-2">
        {units.map((u) => (
          <div key={u.label} className="rounded-2xl bg-white/[0.04] py-4 text-center">
            <p className="serif text-3xl md:text-4xl text-gradient">{u.value}</p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-white/40">{u.label}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm italic text-white/50">
        Since {siteConfig.friendshipStartDate} — and every hour since.
      </p>
    </GlassCard>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    stats,
    bumpStat,
    secretProgress,
    secrets,
    favorites,
    toggleFavorite,
    achievements,
    discoverSecret,
  } = useApp();

  const [message, setMessage] = useState(randomMessages[0]);
  const [mood, setMood] = useState(moods[0]);
  const [favPhoto, setFavPhoto] = useState(photos.gallery[0]);
  const numberClicks = useRef(0);

  const handleNewMessage = () => setMessage((m) => pickDifferent(randomMessages, m));
  const handleNewMood = () => setMood((m) => pickDifferent(moods, m));
  const handleNewPhoto = () => setFavPhoto((p) => pickDifferent(photos.all, p));

  /** Click the memories number 7 times → secret. */
  const handleNumberClick = () => {
    numberClicks.current += 1;
    if (numberClicks.current >= 7) {
      numberClicks.current = 0;
      discoverSecret('number');
    }
  };

  const statCards = [
    { key: 'photosViewed', label: 'Photos Viewed', icon: Camera },
    { key: 'memoriesOpened', label: 'Memories Opened', icon: BookHeart },
    { key: 'lettersOpened', label: 'Letters Opened', icon: MailOpen },
    { key: 'secretsFound', label: 'Secrets Found', icon: KeyRound },
    { key: 'wolfModeCount', label: 'Wolf Mode Activations', icon: PawPrint },
  ];

  return (
    <div className="relative min-h-screen px-6 pb-10 pt-28 md:pt-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Everything, in one place"
          title="Your Little Dashboard"
          subtitle={`A quiet corner of our world that keeps track of her — and of the things you discover along the way, ${siteConfig.nickname}.`}
        />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Memory counter — click the number 7 times (Easter egg) */}
          <Reveal>
            <GlassCard className="card-hover">
              <CardLabel icon={BookHeart}>Memories Collected</CardLabel>
              <button
                type="button"
                onClick={handleNumberClick}
                title="Keep count…"
                aria-label="Memories collected — count them"
                className="serif text-7xl text-gradient transition-transform hover:scale-105"
              >
                <CountUp to={memories.length} />
              </button>
              <p className="mt-3 text-sm text-white/55">Little moments, kept safe.</p>
            </GlassCard>
          </Reveal>

          {/* Photo counter */}
          <Reveal delay={0.06}>
            <GlassCard className="card-hover">
              <CardLabel icon={Images}>Moments Captured</CardLabel>
              <p className="serif text-7xl text-gradient">
                <CountUp to={photos.gallery.length} />
              </p>
              <p className="mt-3 text-sm text-white/55">Frames of a life well shared.</p>
            </GlassCard>
          </Reveal>

          {/* Time since we met */}
          <Reveal delay={0.12} className="lg:col-span-1">
            <TimeCard />
          </Reveal>

          {/* Random message */}
          <Reveal delay={0.05}>
            <GlassCard className="flex flex-col">
              <CardLabel icon={Sparkles}>A Message For You</CardLabel>
              <p className="serif flex-1 text-xl italic leading-relaxed text-white/80">
                “{message}”
              </p>
              <MagneticButton variant="ghost" onClick={handleNewMessage} className="mt-5 self-start px-5 py-2.5 text-sm">
                <RefreshCw className="h-4 w-4" aria-hidden="true" /> Give Me A Message
              </MagneticButton>
            </GlassCard>
          </Reveal>

          {/* Mood widget */}
          <Reveal delay={0.1}>
            <GlassCard className="flex flex-col">
              <CardLabel icon={Sparkles}>Today's Vibe</CardLabel>
              <motion.div
                key={mood.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex-1"
              >
                <p className="text-5xl" aria-hidden="true">{mood.emoji}</p>
                <p className="serif mt-3 text-3xl text-gradient">{mood.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{mood.text}</p>
              </motion.div>
              <MagneticButton variant="ghost" onClick={handleNewMood} className="mt-5 self-start px-5 py-2.5 text-sm">
                <Shuffle className="h-4 w-4" aria-hidden="true" /> Shuffle The Vibe
              </MagneticButton>
            </GlassCard>
          </Reveal>

          {/* Favorite photo */}
          <Reveal delay={0.15}>
            <GlassCard className="flex flex-col">
              <CardLabel icon={Heart}>Favorite Photo</CardLabel>
              <motion.div
                key={favPhoto}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45 }}
                className="relative flex-1 overflow-hidden rounded-2xl"
              >
                <SafeImage
                  src={favPhoto}
                  alt="A favorite photo"
                  className="h-48 w-full object-cover"
                />
              </motion.div>
              <MagneticButton variant="ghost" onClick={handleNewPhoto} className="mt-5 self-start px-5 py-2.5 text-sm">
                <RefreshCw className="h-4 w-4" aria-hidden="true" /> Another One
              </MagneticButton>
            </GlassCard>
          </Reveal>

          {/* Secret progress */}
          <Reveal delay={0.05}>
            <GlassCard>
              <CardLabel icon={KeyRound}>Secret Progress</CardLabel>
              <div className="flex items-end gap-3">
                <p className="serif text-6xl text-gradient">
                  {secretProgress.found}
                  <span className="text-3xl text-white/40"> / {secretProgress.total}</span>
                </p>
              </div>
              <p className="mt-2 text-sm text-white/55">Secrets Discovered</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {easterEggs.map((egg) => {
                  const found = secrets.includes(egg.id);
                  return (
                    <span
                      key={egg.id}
                      title={found ? `${egg.title} — ${egg.hint}` : egg.hint}
                      className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] transition-all ${
                        found
                          ? 'border-blush/50 bg-blush/10 text-blush'
                          : 'border-white/10 bg-white/[0.03] text-white/30'
                      }`}
                    >
                      {found ? <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> : <Lock className="h-3 w-3" aria-hidden="true" />}
                    </span>
                  );
                })}
              </div>
              <p className="mt-4 text-xs italic text-white/40">
                Look closer. Click more. Hold on a little longer.
              </p>
            </GlassCard>
          </Reveal>

          {/* Your favorite moments */}
          <Reveal delay={0.1}>
            <GlassCard>
              <CardLabel icon={Heart}>Your Favorite Moments</CardLabel>
              {favorites.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center text-center">
                  <Heart className="h-8 w-8 text-white/20" aria-hidden="true" />
                  <p className="mt-3 text-sm text-white/50">
                    No favorites yet. Tap the heart on any photo in the Gallery.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {favorites.slice(0, 6).map((src) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => toggleFavorite(src)}
                      title="Remove from favorites"
                      className="group relative aspect-square overflow-hidden rounded-xl"
                    >
                      <SafeImage src={src} alt="Favorite moment" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <span className="absolute right-1.5 top-1.5 rounded-full bg-black/50 p-1 text-blush opacity-0 transition-opacity group-hover:opacity-100">
                        <Heart className="h-3 w-3 fill-blush" aria-hidden="true" />
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </GlassCard>
          </Reveal>

          {/* Secret statistics */}
          <Reveal delay={0.15}>
            <GlassCard>
              <CardLabel icon={Trophy}>Secret Statistics</CardLabel>
              <div className="space-y-3.5">
                {statCards.map((s) => (
                  <div key={s.key} className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5 text-sm text-white/60">
                      <s.icon className="h-4 w-4 text-lilac-400" aria-hidden="true" />
                      {s.label}
                    </span>
                    <span className="serif text-xl text-white">{stats[s.key] ?? 0}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-white/8 pt-3.5">
                  <span className="flex items-center gap-2.5 text-sm text-white/60">
                    <Compass className="h-4 w-4 text-lilac-400" aria-hidden="true" />
                    Visits to our world
                  </span>
                  <span className="serif text-xl text-white">{stats.visits ?? 0}</span>
                </div>
              </div>
            </GlassCard>
          </Reveal>
        </div>

        {/* Achievements */}
        <Reveal>
          <div className="mt-14">
            <SectionHeading
              eyebrow="Small trophies"
              title="Achievements"
              subtitle="They unlock themselves as you explore. No rush — curiosity always wins."
              align="left"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {ACHIEVEMENTS.map((a) => {
                const unlocked = achievements.includes(a.id);
                const Icon = {
                  Sparkles, BookHeart, Camera, PawPrint, KeyRound, MailOpen, Compass, Trophy,
                }[a.icon] || Trophy;
                return (
                  <div
                    key={a.id}
                    className={`glass rounded-2xl p-5 transition-all duration-500 ${
                      unlocked ? 'border-lilac-400/30 shadow-glow' : 'opacity-60'
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full ${
                        unlocked
                          ? 'bg-gradient-to-br from-wine-500/40 to-lilac-500/40 text-blush'
                          : 'bg-white/[0.05] text-white/35'
                      }`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 font-medium text-white">{a.title}</h3>
                    <p className="mt-1 text-sm text-white/50">{a.description}</p>
                    <p className={`mt-3 text-[10px] uppercase tracking-widest ${unlocked ? 'text-blush/80' : 'text-white/30'}`}>
                      {unlocked ? 'Unlocked' : 'Locked'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Quick navigation */}
        <Reveal>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { to: '/story', label: 'Our Story', icon: ScrollText },
              { to: '/gallery', label: 'Gallery', icon: Images },
              { to: '/wolves', label: 'Wolf World', icon: Mountain },
              { to: '/surprise', label: 'Surprise', icon: Gift },
            ].map((l) => (
              <MagneticButton
                key={l.to}
                variant="ghost"
                onClick={() => navigate(l.to)}
                className="justify-start px-6 py-5 text-left"
                ariaLabel={`Go to ${l.label}`}
              >
                <l.icon className="h-5 w-5 text-lilac-400" aria-hidden="true" />
                <span className="flex-1">{l.label}</span>
                <span aria-hidden="true">→</span>
              </MagneticButton>
            ))}
          </div>
        </Reveal>
      </div>
      <Footer />
    </div>
  );
}
