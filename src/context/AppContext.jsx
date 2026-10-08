import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getJSON, setJSON, getBool, setBool, LS } from '../utils/storage';
import { playSfx } from '../utils/sound';
import {
  discoverSecretById,
  getDiscoveredSecrets,
  getSecretById,
  getSecretProgress,
} from '../utils/easterEggs';

const AppContext = createContext(null);

export const EXPLORABLE_ROUTES = [
  '/',
  '/dashboard',
  '/story',
  '/memories',
  '/gallery',
  '/wolves',
  '/reasons',
  '/letters',
  '/surprise',
  '/final',
];

export const ACHIEVEMENTS = [
  { id: 'first-visit', icon: 'Sparkles', title: 'First Visit', description: 'You stepped into our little world.' },
  { id: 'memory-explorer', icon: 'BookHeart', title: 'Memory Explorer', description: 'Opened 5 memories.' },
  { id: 'photo-collector', icon: 'Camera', title: 'Photo Collector', description: 'Viewed 10 photos fullscreen.' },
  { id: 'wolf-tamer', icon: 'PawPrint', title: 'Wolf Tamer', description: 'You unleashed Wolf Mode.' },
  { id: 'secret-finder', icon: 'KeyRound', title: 'Secret Finder', description: 'Discovered 3 secrets.' },
  { id: 'letter-reader', icon: 'MailOpen', title: 'Letter Reader', description: 'Opened every letter.' },
  { id: 'full-explorer', icon: 'Compass', title: 'Full Explorer', description: 'Visited every page of our world.' },
];

const DEFAULT_STATS = {
  photosViewed: 0,
  memoriesOpened: 0,
  lettersOpened: 0,
  secretsFound: 0,
  wolfModeCount: 0,
  visits: 0,
};

let toastSeq = 0;

export function AppProvider({ children }) {
  const [loaded, setLoaded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  const [musicOn, setMusicOn] = useState(() => getBool(LS.musicOn, false));
  const [volume, setVolumeState] = useState(() => {
    const v = getJSON(LS.volume, 0.6);
    return typeof v === 'number' ? v : 0.6;
  });
  const [sfxOn, setSfxOn] = useState(() => getBool(LS.sfx, true));
  const [wolfMode, setWolfMode] = useState(() => getBool(LS.wolfMode, false));

  const [secrets, setSecrets] = useState(() => getDiscoveredSecrets());
  const [stats, setStats] = useState(() => ({ ...DEFAULT_STATS, ...getJSON(LS.stats, {}) }));
  const [favorites, setFavorites] = useState(() => getJSON(LS.favorites, []));
  const [achievements, setAchievements] = useState(() => getJSON(LS.achievements, []));
  const [roomUnlocked, setRoomUnlocked] = useState(() => getBool(LS.roomUnlocked, false));
  const [visitedRoutes, setVisitedRoutes] = useState(() => getJSON(LS.visited, []));

  const [toasts, setToasts] = useState([]);
  const audioRef = useRef(null);
  const statsRef = useRef(stats);
  statsRef.current = stats;
  const secretsRef = useRef(secrets);
  secretsRef.current = secrets;
  const visitedRef = useRef(visitedRoutes);
  visitedRef.current = visitedRoutes;

  /* ---------------- persistence ---------------- */
  useEffect(() => setBool(LS.musicOn, musicOn), [musicOn]);
  useEffect(() => setJSON(LS.volume, volume), [volume]);
  useEffect(() => setBool(LS.sfx, sfxOn), [sfxOn]);
  useEffect(() => setBool(LS.wolfMode, wolfMode), [wolfMode]);
  useEffect(() => setJSON(LS.secrets, secrets), [secrets]);
  useEffect(() => setJSON(LS.stats, stats), [stats]);
  useEffect(() => setJSON(LS.favorites, favorites), [favorites]);
  useEffect(() => setJSON(LS.achievements, achievements), [achievements]);
  useEffect(() => setBool(LS.roomUnlocked, roomUnlocked), [roomUnlocked]);
  useEffect(() => setJSON(LS.visited, visitedRoutes), [visitedRoutes]);

  /* ---------------- wolf mode body class ---------------- */
  useEffect(() => {
    document.body.classList.toggle('wolf-mode', wolfMode);
  }, [wolfMode]);

  /* ---------------- toasts ---------------- */
  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, message, kind = 'info', icon = 'Sparkles', duration = 4200 }) => {
      toastSeq += 1;
      const id = `toast-${toastSeq}`;
      setToasts((t) => [...t, { id, title, message, kind, icon, duration }]);
      window.setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  /* ---------------- achievements ---------------- */
  const unlockAchievement = useCallback(
    (id) => {
      if (achievements.includes(id)) return;
      const def = ACHIEVEMENTS.find((a) => a.id === id);
      setAchievements((list) => [...list, id]);
      playSfx('secret', 0.9);
      showToast({
        title: 'Achievement Unlocked!',
        message: `${def?.title ?? id} — ${def?.description ?? ''}`,
        kind: 'achievement',
        icon: def?.icon ?? 'Trophy',
        duration: 5000,
      });
    },
    [achievements, showToast]
  );

  const checkAchievements = useCallback(() => {
    const s = statsRef.current;
    const found = secretsRef.current.length;
    const visited = visitedRef.current;
    const next = [];
    if (!achievements.includes('first-visit')) next.push('first-visit');
    if (s.memoriesOpened >= 5) next.push('memory-explorer');
    if (s.photosViewed >= 10) next.push('photo-collector');
    if (s.wolfModeCount >= 1) next.push('wolf-tamer');
    if (found >= 3) next.push('secret-finder');
    if (s.lettersOpened >= 5) next.push('letter-reader');
    if (EXPLORABLE_ROUTES.every((r) => visited.includes(r))) next.push('full-explorer');
    next.forEach((id) => unlockAchievement(id));
  }, [achievements, unlockAchievement]);

  /* ---------------- secrets ---------------- */
  const discoverSecret = useCallback(
    (id) => {
      const isNew = discoverSecretById(id);
      if (!isNew) return false;
      const def = getSecretById(id);
      setSecrets(getDiscoveredSecrets());
      setStats((s) => ({ ...s, secretsFound: s.secretsFound + 1 }));
      playSfx('secret');
      showToast({
        title: 'Secret Discovered',
        message: `${def?.title ?? 'A secret'} — ${def?.description ?? ''}`,
        kind: 'secret',
        icon: 'Eye',
        duration: 5200,
      });
      // achievements depend on fresh state — check on next tick
      window.setTimeout(checkAchievements, 0);
      return true;
    },
    [checkAchievements, showToast]
  );

  const secretProgress = useMemo(() => getSecretProgress(), [secrets]);

  /* ---------------- stats ---------------- */
  const bumpStat = useCallback(
    (key, amount = 1) => {
      setStats((s) => ({ ...s, [key]: (s[key] ?? 0) + amount }));
      window.setTimeout(checkAchievements, 0);
    },
    [checkAchievements]
  );

  /* ---------------- favorites ---------------- */
  const isFavorite = useCallback((src) => favorites.includes(src), [favorites]);

  const toggleFavorite = useCallback((src) => {
    setFavorites((list) => (list.includes(src) ? list.filter((f) => f !== src) : [...list, src]));
  }, []);

  /* ---------------- music ---------------- */
  const getAudio = useCallback(() => audioRef.current, []);

  const toggleMusic = useCallback(() => {
    setMusicOn((on) => {
      const next = !on;
      const audio = audioRef.current;
      if (audio) {
        if (next) {
          const p = audio.play();
          if (p && typeof p.catch === 'function') p.catch(() => {});
        } else {
          audio.pause();
        }
      }
      return next;
    });
  }, []);

  const setVolume = useCallback((v) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const toggleSfx = useCallback(() => {
    setSfxOn((on) => {
      const next = !on;
      if (next) playSfx('click');
      return next;
    });
  }, []);

  /* ---------------- wolf mode ---------------- */
  const toggleWolfMode = useCallback(
    (force) => {
      setWolfMode((on) => {
        const next = typeof force === 'boolean' ? force : !on;
        if (next && !on) {
          bumpStat('wolfModeCount');
          discoverSecret('wolf-mode');
          playSfx('howl', 0.8);
          showToast({
            title: 'Wolf Mode Unleashed',
            message: 'The forest has taken over. Look around — the wild lives here now.',
            kind: 'wolf',
            icon: 'PawPrint',
            duration: 4600,
          });
        }
        return next;
      });
    },
    [bumpStat, discoverSecret, showToast]
  );

  /* ---------------- secret room ---------------- */
  const unlockRoom = useCallback(() => {
    setRoomUnlocked(true);
    discoverSecret('code');
  }, [discoverSecret]);

  /* ---------------- visited routes ---------------- */
  const addVisitedRoute = useCallback((path) => {
    setVisitedRoutes((list) => {
      if (list.includes(path)) return list;
      const next = [...list, path];
      window.setTimeout(checkAchievements, 0);
      return next;
    });
  }, [checkAchievements]);

  /* ---------------- first visit ---------------- */
  const finishLoading = useCallback(() => {
    const seen = getBool(LS.seen, false);
    setIsFirstVisit(!seen);
    setBool(LS.seen, true);
    setStats((s) => ({ ...s, visits: s.visits + 1 }));
    setLoaded(true);
    if (!seen) {
      window.setTimeout(() => setShowWelcome(true), 900);
    } else {
      window.setTimeout(() => {
        showToast({
          title: 'Welcome back.',
          message: 'Your little world kept everything exactly where you left it.',
          kind: 'info',
          icon: 'Moon',
          duration: 4600,
        });
      }, 1400);
    }
  }, [showToast]);

  const dismissWelcome = useCallback(() => {
    setShowWelcome(false);
    unlockAchievement('first-visit');
  }, [unlockAchievement]);

  const value = useMemo(
    () => ({
      // loading / first visit
      loaded,
      finishLoading,
      showWelcome,
      dismissWelcome,
      isFirstVisit,
      // music
      musicOn,
      toggleMusic,
      volume,
      setVolume,
      getAudio,
      sfxOn,
      toggleSfx,
      // wolf mode
      wolfMode,
      toggleWolfMode,
      // secrets
      secrets,
      discoverSecret,
      secretProgress,
      // stats
      stats,
      bumpStat,
      // favorites
      favorites,
      isFavorite,
      toggleFavorite,
      // achievements
      achievements,
      unlockAchievement,
      // secret room
      roomUnlocked,
      unlockRoom,
      // routing
      visitedRoutes,
      addVisitedRoute,
      // toasts
      toasts,
      removeToast,
      showToast,
    }),
    [
      loaded, finishLoading, showWelcome, dismissWelcome, isFirstVisit,
      musicOn, toggleMusic, volume, setVolume, getAudio, sfxOn, toggleSfx,
      wolfMode, toggleWolfMode, secrets, discoverSecret, secretProgress,
      stats, bumpStat, favorites, isFavorite, toggleFavorite,
      achievements, unlockAchievement, roomUnlocked, unlockRoom,
      visitedRoutes, addVisitedRoute, toasts, removeToast, showToast,
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {/* persistent background music element — mounted once, survives every route */}
      <audio ref={audioRef} src="/audio/background.mp3" loop preload="auto" />
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
