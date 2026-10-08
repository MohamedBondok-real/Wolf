import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Compass, Heart, Images, BookOpen, Mountain, Star } from 'lucide-react';
import photos from '../data/photos';
import siteConfig from '../config/siteConfig';
import memories from '../data/memories';
import { useApp } from '../context/AppContext';
import MagneticButton from '../components/MagneticButton';
import Reveal from '../components/Reveal';
import SafeImage from '../components/SafeImage';
import Polaroid from '../components/Polaroid';
import SectionHeading from '../components/SectionHeading';
import Footer from '../components/Footer';
import { timeSince } from '../utils/time';

const QUICK_LINKS = [
  { to: '/story', label: 'Our Story', icon: BookOpen, text: 'The timeline of us — chapter by chapter.', img: photos.memories[0] },
  { to: '/memories', label: 'Memories', icon: Heart, text: 'The moments worth keeping forever.', img: photos.memories[1] },
  { to: '/gallery', label: 'Gallery', icon: Images, text: 'Every frame, a piece of our story.', img: photos.gallery[0] },
  { to: '/wolves', label: 'Wolf World', icon: Mountain, text: 'Where the wild things welcome you.', img: '/images/wolves/forest.jpg' },
];

const WORDS = 'Welcome To Our Little World'.split(' ');

export default function Home() {
  const navigate = useNavigate();
  const { discoverSecret } = useApp();
  const heroRef = useRef(null);
  const [glow, setGlow] = useState({ x: 50, y: 40 });
  const [starFound, setStarFound] = useState(false);

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0.35]);

  // mouse-follow glow
  useEffect(() => {
    const onMove = (e) => {
      setGlow({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const since = timeSince(siteConfig.friendshipStartDate);

  const handleHold = () => {
    discoverSecret('hold');
  };

  return (
    <div className="relative min-h-screen">
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* parallax cinematic image with slow zoom */}
        <motion.div className="absolute inset-0" style={{ y: heroY, opacity: heroOpacity }}>
          <SafeImage
            src={photos.hero}
            alt={`${siteConfig.name} — hero portrait`}
            eager
            rounded={false}
            className="kenburns h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/75 via-ink-950/35 to-ink-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950/60 via-transparent to-wine-600/20" />
        </motion.div>

        {/* mouse-follow glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-700"
          style={{
            background: `radial-gradient(520px circle at ${glow.x}% ${glow.y}%, rgba(183,154,232,0.16), transparent 65%)`,
          }}
        />

        {/* floating hearts */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {[0, 1, 2, 3].map((i) => (
            <Heart
              key={i}
              className="float-heart absolute h-4 w-4 text-blush/50"
              style={{
                left: `${18 + i * 22}%`,
                bottom: '-8%',
                animationDelay: `${i * 2.4}s`,
                animationDuration: `${9 + i}s`,
              }}
            />
          ))}
        </div>

        {/* the hidden clickable star — Easter egg */}
        <button
          type="button"
          aria-label="A star…?"
          title="?"
          onClick={() => { setStarFound(true); discoverSecret('star'); }}
          className={`twinkle absolute right-[12%] top-[22%] text-lilac-300/70 transition-transform hover:scale-125 ${
            starFound ? 'text-blush' : ''
          }`}
        >
          <Star className="h-5 w-5 fill-lilac-300/30" aria-hidden="true" />
        </button>

        {/* content */}
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="section-eyebrow mb-6 flex items-center justify-center gap-3"
          >
            <span className="line-gradient w-12" /> Made especially for you. <span className="line-gradient w-12" />
          </motion.p>

          <h1 className="serif text-5xl font-medium leading-[1.08] md:text-7xl lg:text-8xl glow-text">
            {WORDS.map((word, i) => (
              <motion.span
                key={word + i}
                initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, delay: 0.3 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block bg-gradient-to-b from-white via-lilac-300 to-lilac-500 bg-clip-text pb-1 text-transparent"
              >
                {word}
                {i < WORDS.length - 1 ? ' ' : ''}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85 }}
            className="serif mx-auto mt-8 max-w-2xl text-xl italic leading-relaxed text-white/70 md:text-2xl"
          >
            “Some people become memories. Some people become part of your story.”
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.05 }}
            className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <MagneticButton
              onClick={() => navigate('/dashboard')}
              onHold={handleHold}
              ariaLabel="Enter our world"
              className="text-base"
            >
              Enter Our World <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </MagneticButton>
            <MagneticButton
              variant="ghost"
              onClick={() => {
                document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' });
              }}
              ariaLabel="Explore"
              className="text-base"
            >
              <Compass className="h-4 w-4" aria-hidden="true" /> Explore
            </MagneticButton>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
            className="mt-10 text-xs uppercase tracking-[0.35em] text-white/35"
          >
            {since.years} years of friendship · and counting
          </motion.p>
        </div>

        {/* scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          aria-hidden="true"
        >
          <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/25 p-1.5">
            <motion.span
              className="h-1.5 w-1 rounded-full bg-lilac-300"
              animate={{ y: [0, 12, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ── INTRO ── */}
      <section id="intro" className="relative mx-auto max-w-6xl px-6 py-28">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <Reveal className="relative flex justify-center md:justify-end">
            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-wine-500/20 blur-3xl" aria-hidden="true" />
              <Polaroid
                src={photos.profile}
                caption={`${siteConfig.name} ✦ ${siteConfig.nickname}`}
                alt={`${siteConfig.name} — portrait`}
                seed={3}
                imgClassName="aspect-[4/5] w-[280px] md:w-[340px]"
              />
              <motion.div
                className="absolute -bottom-6 -right-8 hidden md:block"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Polaroid
                  src={photos.gallery[1]}
                  caption="a favorite frame"
                  seed={7}
                  imgClassName="aspect-square w-[130px]"
                />
              </motion.div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="section-eyebrow mb-4">A note before you go in</p>
            <h2 className="serif text-4xl md:text-5xl leading-tight">
              This is a place <span className="text-gradient">built for one person</span>
            </h2>
            <p className="mt-6 leading-relaxed text-white/65">
              Not a portfolio. Not a page. A small universe — with memories to revisit, letters to
              open, wolves to meet, and a few secrets hidden for the curious. Everything here was
              made with one person in mind.
            </p>
            <p className="mt-4 leading-relaxed text-white/65">
              Wander slowly. Click things. Some doors only open for those who pay attention.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { value: memories.length, label: 'Memories kept' },
                { value: photos.gallery.length, label: 'Moments captured' },
                { value: since.totalDays, label: 'Days of us' },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-2xl p-4 text-center">
                  <p className="serif text-2xl text-gradient">{stat.value}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-widest text-white/45">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── QUICK LINKS ── */}
      <section className="relative mx-auto max-w-6xl px-6 pb-10">
        <SectionHeading
          eyebrow="Where to next?"
          title="Choose your path"
          subtitle="Every corner of this world was made to be explored. Start anywhere — it all leads back to her."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((link, i) => (
            <Reveal key={link.to} delay={i * 0.08}>
              <button
                type="button"
                onClick={() => navigate(link.to)}
                className="group glass card-hover relative block h-full overflow-hidden rounded-3xl p-6 text-left"
              >
                <div className="absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-35">
                  <SafeImage src={link.img} alt="" rounded={false} className="h-full w-full object-cover" />
                </div>
                <div className="relative z-10">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.06] text-lilac-300 transition-colors group-hover:bg-lilac-500/20 group-hover:text-blush">
                    <link.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="serif mt-5 text-2xl text-white">{link.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{link.text}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-lilac-300 transition-transform duration-300 group-hover:translate-x-1">
                    Step inside <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
