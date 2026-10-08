import { useEffect, useState } from 'react';

/** Thin cinematic scroll progress bar at the very top of the viewport. */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? el.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[80] h-[2px] w-full bg-white/[0.04]"
    >
      <div
        className="h-full bg-gradient-to-r from-wine-400 via-lilac-400 to-blush shadow-glow"
        style={{ width: `${progress * 100}%`, transition: 'width 80ms linear' }}
      />
    </div>
  );
}
