import { Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import siteConfig from '../config/siteConfig';

/** Slim cinematic footer — with one heart hiding in plain sight. */
export default function Footer() {
  const { discoverSecret, secrets } = useApp();
  const found = secrets.includes('heart');

  return (
    <footer className="relative z-10 mt-24 border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-center">
        <p className="serif text-lg italic text-white/50">
          “{siteConfig.footerNote}”
        </p>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/30">
          <span>Our little world</span>
          <span aria-hidden="true">·</span>
          <span>{new Date().getFullYear()}</span>
          <button
            type="button"
            onClick={() => discoverSecret('heart')}
            aria-label="A hidden heart"
            title={found ? 'Found' : undefined}
            className={`ml-1 inline-flex transition-all duration-500 ${
              found ? 'text-blush/70' : 'text-white/15 hover:text-blush/60'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${found ? 'fill-blush/70' : ''}`} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
