import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, RotateCcw } from 'lucide-react';
import photos from '../data/photos';
import siteConfig from '../config/siteConfig';
import MagneticButton from '../components/MagneticButton';
import SafeImage from '../components/SafeImage';

/** The Final page — an extremely clean cinematic ending. */
export default function Final() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-28">
      {/* background photo, heavily dimmed */}
      <div className="absolute inset-0" aria-hidden="true">
        <SafeImage
          src={photos.final}
          alt=""
          eager
          rounded={false}
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/70 to-ink-950" />
      </div>

      {/* soft glow */}
      <div
        className="absolute left-1/2 top-1/2 h-[50vh] w-[50vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lilac-500/15 blur-[130px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {/* framed photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-12 w-52 md:w-64"
        >
          <div className="rounded-full p-[3px] bg-gradient-to-br from-wine-400 via-lilac-400 to-blush shadow-glow">
            <SafeImage
              src={photos.profile}
              alt={`${siteConfig.name} — a portrait to end with`}
              className="aspect-square w-full rounded-full object-cover"
            />
          </div>
        </motion.div>

        <motion.h1
          className="serif text-4xl md:text-6xl lg:text-7xl leading-[1.15]"
          initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-gradient">Some friendships are impossible to explain.</span>
        </motion.h1>

        <motion.p
          className="serif mt-10 text-3xl md:text-5xl italic text-white/85"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 1.1 }}
        >
          They're just felt.
        </motion.p>

        <motion.p
          className="mt-8 text-lg md:text-xl text-white/65"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 1.1 }}
        >
          Thank you for being part of my story, {siteConfig.name}.
        </motion.p>

        <motion.p
          className="serif mt-10 text-2xl md:text-3xl text-lilac-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 1.1 }}
        >
          Until the next memory... <Heart className="inline h-6 w-6 fill-blush text-blush" aria-hidden="true" />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2, duration: 1 }}
          className="mt-14"
        >
          <MagneticButton
            onClick={() => navigate('/')}
            ariaLabel="Start again — return to home"
            className="text-base"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Start Again
          </MagneticButton>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4, duration: 1.5 }}
          className="mt-12 text-xs uppercase tracking-[0.35em] text-white/30"
        >
          {siteConfig.footerNote}
        </motion.p>
      </div>
    </div>
  );
}
