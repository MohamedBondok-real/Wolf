import { useEffect, useRef, useState } from 'react';

/**
 * Subtle custom cursor for desktop: a glowing dot + outer ring.
 * Expands over interactive elements. Disabled on touch devices.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return undefined;
    setEnabled(true);
    document.documentElement.classList.add('cursor-on');

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      const dot = dotRef.current;
      if (dot) dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    };
    const onOver = (e) => {
      const interactive = e.target.closest?.(
        'a, button, [role="button"], input, textarea, select, label, [data-cursor]'
      );
      setHovering(Boolean(interactive));
    };
    const onDown = () => setHovering((h) => h);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown);

    let raf;
    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.16;
      ring.current.y += (pos.current.y - ring.current.y) * 0.16;
      const el = ringRef.current;
      if (el) el.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      document.documentElement.classList.remove('cursor-on');
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className={`cursor-ring ${hovering ? 'is-hover' : ''}`} aria-hidden="true" />
    </>
  );
}
