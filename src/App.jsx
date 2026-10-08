import { useEffect, useMemo, useRef } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from './context/AppContext';
import { playSfx } from './utils/sound';
import siteConfig from './config/siteConfig';

import Loader from './pages/Loader';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Story from './pages/Story';
import Memories from './pages/Memories';
import Gallery from './pages/Gallery';
import WolfWorld from './pages/WolfWorld';
import Reasons from './pages/Reasons';
import Letters from './pages/Letters';
import SecretRoom from './pages/SecretRoom';
import Surprise from './pages/Surprise';
import Final from './pages/Final';
import NotFound from './pages/NotFound';

import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';
import CustomCursor from './components/CustomCursor';
import ScrollProgress from './components/ScrollProgress';
import ParticleBackground from './components/ParticleBackground';
import ToastStack from './components/ToastStack';
import WelcomeModal from './components/WelcomeModal';
import WolfModeOverlay from './components/WolfModeOverlay';

const ROUTE_PARTICLES = {
  '/': 'stars',
  '/dashboard': 'glow',
  '/story': 'stars',
  '/memories': 'glow',
  '/gallery': 'stars',
  '/wolves': 'wolves',
  '/reasons': 'glow',
  '/letters': 'stars',
  '/surprise': 'hearts',
  '/final': 'stars',
  '/secret-room': 'glow',
};

/** Cinematic page transition wrapper. */
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -16, filter: 'blur(10px)' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    loaded,
    wolfMode,
    roomUnlocked,
    unlockRoom,
    addVisitedRoute,
    showToast,
  } = useApp();

  /* track visited routes (Full Explorer achievement) */
  useEffect(() => {
    if (loaded) addVisitedRoute(location.pathname);
  }, [location.pathname, loaded, addVisitedRoute]);

  /* global keyboard listener — typing the secret code anywhere unlocks the Secret Room */
  const buffer = useRef([]);
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key.length !== 1) return;
      const now = Date.now();
      buffer.current = [...buffer.current.filter((k) => now - k.time < 2500), { key: e.key.toLowerCase(), time: now }];
      const word = buffer.current.map((k) => k.key).join('');
      if (word.endsWith(siteConfig.secretCode)) {
        buffer.current = [];
        if (!roomUnlocked) {
          unlockRoom();
          playSfx('secret');
          showToast({
            title: 'A door opened somewhere.',
            message: 'You whispered the word. Follow the wolves — /secret-room',
            kind: 'secret',
            icon: 'KeyRound',
            duration: 6000,
          });
        }
        navigate('/secret-room');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [roomUnlocked, unlockRoom, navigate, showToast]);

  /* per-route particle variant (wolves take over everything in Wolf Mode) */
  const particleVariant = useMemo(() => {
    if (wolfMode) return 'wolves';
    return ROUTE_PARTICLES[location.pathname] ?? 'stars';
  }, [location.pathname, wolfMode]);

  return (
    <div className="relative min-h-screen">
      {/* global atmosphere layers */}
      <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
        <ParticleBackground variant={particleVariant} />
      </div>
      <div className="vignette-overlay" aria-hidden="true" />
      <div className="grain-overlay" aria-hidden="true" />

      <WolfModeOverlay />
      <ScrollProgress />
      <CustomCursor />

      {/* loading screen */}
      <AnimatePresence>{!loaded && <Loader />}</AnimatePresence>

      {/* the world */}
      {loaded && (
        <>
          <Navbar />
          <MusicPlayer />
          <ToastStack />
          <WelcomeModal />

          <main className="relative z-[10]">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
                <Route path="/story" element={<PageTransition><Story /></PageTransition>} />
                <Route path="/memories" element={<PageTransition><Memories /></PageTransition>} />
                <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
                <Route path="/wolves" element={<PageTransition><WolfWorld /></PageTransition>} />
                <Route path="/reasons" element={<PageTransition><Reasons /></PageTransition>} />
                <Route path="/letters" element={<PageTransition><Letters /></PageTransition>} />
                <Route path="/secret-room" element={<PageTransition><SecretRoom /></PageTransition>} />
                <Route path="/surprise" element={<PageTransition><Surprise /></PageTransition>} />
                <Route path="/final" element={<PageTransition><Final /></PageTransition>} />
                <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
              </Routes>
            </AnimatePresence>
          </main>
        </>
      )}
    </div>
  );
}

export default function App() {
  return <AppShell />;
}
