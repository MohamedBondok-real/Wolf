import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import MagneticButton from '../components/MagneticButton';

/** 404 — for wanderers who stray off the map. */
export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 pt-28 text-center">
      <div
        className="absolute left-1/2 top-1/3 h-[40vh] w-[40vh] -translate-x-1/2 rounded-full bg-wine-600/15 blur-[120px]"
        aria-hidden="true"
      />
      <div className="relative z-10">
        <motion.p
          className="serif text-9xl font-medium text-gradient opacity-90"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          404
        </motion.p>
        <motion.h1
          className="serif mt-4 text-3xl md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.9 }}
        >
          Looks like you wandered somewhere{' '}
          <span className="text-gradient">you're not supposed to be.</span>
        </motion.h1>
        <motion.p
          className="mx-auto mt-5 max-w-md text-white/55"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9 }}
        >
          Even the wolves get lost sometimes. The map is back this way.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.9 }}
          className="mt-10"
        >
          <MagneticButton onClick={() => navigate('/')} ariaLabel="Take me home">
            <Compass className="h-4 w-4" aria-hidden="true" /> Take Me Home
          </MagneticButton>
        </motion.div>
      </div>
    </div>
  );
}
