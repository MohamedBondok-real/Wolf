import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { playSfx } from '../utils/sound';

/**
 * A button that feels alive:
 *  - magnetic hover (pulls toward the cursor)
 *  - soft glow + scale on hover
 *  - ripple on click
 *  - optional 3-second "hold" detection (Easter egg support)
 */
export default function MagneticButton({
  children,
  onClick,
  onHold,
  holdMs = 3000,
  className = '',
  innerClassName = '',
  variant = 'primary',
  type = 'button',
  disabled = false,
  ariaLabel,
  glow = true,
}) {
  const ref = useRef(null);
  const holdTimer = useRef(null);
  const heldRef = useRef(false);
  const [ripples, setRipples] = useState([]);

  const base =
    variant === 'primary' ? 'btn-primary' : variant === 'ghost' ? 'btn-ghost' : variant === 'icon' ? '' : 'btn-primary';

  const clearHold = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };

  const handleMove = (e) => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.28}px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = 'translate(0, 0)';
    clearHold();
  };

  const handleDown = () => {
    if (!onHold || disabled) return;
    heldRef.current = false;
    clearHold();
    holdTimer.current = window.setTimeout(() => {
      heldRef.current = true;
      onHold();
    }, holdMs);
  };

  const handleUp = () => clearHold();

  const handleClick = (e) => {
    if (disabled) return;
    // ripple
    const el = ref.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.4;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const id = Date.now() + Math.random();
      setRipples((r) => [...r, { id, x, y, size }]);
      window.setTimeout(() => setRipples((r) => r.filter((rip) => rip.id !== id)), 700);
    }
    playSfx('click', 0.8);
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={handleClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onPointerCancel={clearHold}
      className={`relative overflow-hidden ${base} ${glow ? '' : ''} ${className}`}
      style={{ transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)' }}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
    >
      <span className={`relative z-10 flex items-center gap-2 ${innerClassName}`}>{children}</span>
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-white/25"
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
            animation: 'ripple 0.7s ease-out forwards',
          }}
        />
      ))}
      <style>{`@keyframes ripple { from { transform: scale(0); opacity: .6 } to { transform: scale(1); opacity: 0 } }`}</style>
    </motion.button>
  );
}
