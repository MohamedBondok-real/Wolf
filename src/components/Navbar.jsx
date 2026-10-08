import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Camera,
  Compass,
  Gift,
  Heart,
  Home,
  Images,
  LayoutDashboard,
  Mail,
  Menu,
  Moon,
  Mountain,
  PawPrint,
  ScrollText,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import siteConfig from '../config/siteConfig';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/story', label: 'Story', icon: ScrollText },
  { to: '/memories', label: 'Memories', icon: BookOpen },
  { to: '/gallery', label: 'Gallery', icon: Images },
  { to: '/wolves', label: 'Wolves', icon: Mountain },
  { to: '/reasons', label: 'Reasons', icon: Heart },
  { to: '/letters', label: 'Letters', icon: Mail },
  { to: '/surprise', label: 'Surprise', icon: Gift },
];

/** Click the logo 5 times quickly → secret. */
function Logo({ onClick, compact = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Our little world — home"
      className={`group flex items-center gap-2.5 ${compact ? '' : ''}`}
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-wine-500 to-lilac-500 shadow-glow">
        <Moon className="h-4 w-4 text-white" aria-hidden="true" />
        <PawPrint className="absolute -bottom-0.5 -right-0.5 h-3 w-3 text-blush" aria-hidden="true" />
      </span>
      {!compact && (
        <span className="serif text-lg font-medium tracking-wide text-white/90 group-hover:text-white transition-colors">
          {siteConfig.nickname}'s <span className="text-gradient">World</span>
        </span>
      )}
    </button>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { discoverSecret, wolfMode, toggleWolfMode, secretProgress } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const clickTimes = useRef([]);

  const handleLogoClick = () => {
    const now = Date.now();
    clickTimes.current = clickTimes.current.filter((t) => now - t < 3000);
    clickTimes.current.push(now);
    if (clickTimes.current.length >= 5) {
      clickTimes.current = [];
      discoverSecret('logo');
    }
    navigate('/');
  };

  // close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // lock scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      {/* ── Desktop: floating glass navigation ── */}
      <header className="fixed inset-x-0 top-0 z-[75] hidden md:flex justify-center pt-5 pointer-events-none">
        <nav
          aria-label="Primary"
          className="nav-glass pointer-events-auto glass flex items-center gap-1 rounded-full px-3 py-2"
        >
          <div className="px-2">
            <Logo onClick={handleLogoClick} />
          </div>
          <div className="mx-2 h-6 w-px bg-white/10" />
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `relative rounded-full px-3.5 py-2 text-sm font-medium tracking-wide transition-all duration-300 ${
                  isActive
                    ? 'text-white bg-white/[0.08] shadow-glow'
                    : 'text-white/55 hover:text-white hover:bg-white/[0.05]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="mx-1 h-6 w-px bg-white/10" />
          <button
            type="button"
            onClick={() => toggleWolfMode()}
            aria-label={wolfMode ? 'Exit Wolf Mode' : 'Enter Wolf Mode'}
            title={wolfMode ? 'Exit Wolf Mode' : 'Enter Wolf Mode'}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
              wolfMode
                ? 'bg-lilac-500/25 text-blush shadow-glow'
                : 'text-lilac-300/80 hover:text-blush hover:bg-white/[0.06]'
            }`}
          >
            <PawPrint className="h-4 w-4" aria-hidden="true" />
          </button>
          <div
            className="ml-1 hidden lg:flex flex-col px-2"
            title="Secrets discovered"
          >
            <span className="text-[10px] uppercase tracking-widest text-white/35">Secrets</span>
            <span className="serif text-sm text-lilac-300">
              {secretProgress.found} / {secretProgress.total}
            </span>
          </div>
        </nav>
      </header>

      {/* ── Mobile: bottom navigation + fullscreen menu ── */}
      <header className="fixed inset-x-0 bottom-0 z-[75] md:hidden pb-[env(safe-area-inset-bottom)]">
        <nav
          aria-label="Mobile primary"
          className="nav-glass mx-3 mb-3 glass flex items-center justify-around rounded-2xl px-2 py-2.5"
        >
          {NAV_LINKS.slice(0, 4).map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              aria-label={link.label}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 transition-all ${
                  isActive ? 'text-blush' : 'text-white/50'
                }`
              }
            >
              <link.icon className="h-5 w-5" aria-hidden="true" />
              <span className="text-[10px] tracking-wide">{link.label}</span>
            </NavLink>
          ))}
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-white/70"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
            <span className="text-[10px] tracking-wide">More</span>
          </button>
        </nav>
      </header>

      {/* ── Mobile fullscreen menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[90] flex flex-col bg-ink-950/95 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between px-6 pt-8">
              <Logo onClick={handleLogoClick} />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="glass flex h-11 w-11 items-center justify-center rounded-full text-white/80"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-10 flex flex-1 flex-col items-center justify-center gap-2 px-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                  className="w-full max-w-xs"
                >
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-4 rounded-2xl glass-strong px-5 py-4 text-lg transition-all ${
                        isActive ? 'border-lilac-400/40 text-white' : 'text-white/70'
                      }`
                    }
                  >
                    <link.icon className="h-5 w-5 text-lilac-400" aria-hidden="true" />
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * NAV_LINKS.length, duration: 0.4 }}
                onClick={() => toggleWolfMode()}
                className={`mt-4 flex w-full max-w-xs items-center gap-4 rounded-2xl glass-strong px-5 py-4 text-lg ${
                  wolfMode ? 'text-blush border-lilac-400/40' : 'text-white/70'
                }`}
              >
                <PawPrint className="h-5 w-5 text-lilac-400" aria-hidden="true" />
                {wolfMode ? 'Exit Wolf Mode' : 'Enter Wolf Mode'}
              </motion.button>
            </div>
            <p className="pb-8 text-center text-xs uppercase tracking-[0.3em] text-white/30">
              {siteConfig.footerNote}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
