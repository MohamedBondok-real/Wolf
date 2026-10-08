import { useEffect, useRef } from 'react';

/**
 * Reusable canvas particle system.
 * Variants: stars | glow | snow | wolves | hearts | fog
 * Performance: DPR-capped canvas, count scales with area,
 * halved on mobile, static (single frame) for reduced motion.
 */
const VARIANT_CONFIG = {
  stars: { type: 'stars', density: 9000, max: 130 },
  glow: { type: 'glow', density: 16000, max: 60 },
  snow: { type: 'snow', density: 11000, max: 90 },
  wolves: { type: 'wolves', density: 9000, max: 110 },
  hearts: { type: 'hearts', density: 22000, max: 26 },
  fog: { type: 'fog', density: 1, max: 5 },
};

const isMobile = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function makeParticle(type, w, h) {
  const rand = (a, b) => a + Math.random() * (b - a);
  switch (type) {
    case 'stars':
      return {
        x: rand(0, w), y: rand(0, h), r: rand(0.4, 1.7),
        baseA: rand(0.25, 0.9), phase: rand(0, Math.PI * 2), speed: rand(0.05, 0.25),
        vy: rand(0.02, 0.08), hue: Math.random() < 0.3 ? 'lav' : 'white',
      };
    case 'glow':
      return {
        x: rand(0, w), y: rand(0, h), r: rand(10, 42),
        baseA: rand(0.05, 0.16), phase: rand(0, Math.PI * 2), speed: rand(0.1, 0.4),
        vx: rand(-0.12, 0.12), vy: rand(-0.1, 0.1), tint: Math.random(),
      };
    case 'snow':
    case 'wolves':
      return {
        x: rand(0, w), y: rand(0, h), r: rand(0.6, 2.4),
        baseA: rand(0.35, 0.95), phase: rand(0, Math.PI * 2), speed: rand(0.08, 0.5),
        vy: rand(0.25, 0.9), drift: rand(-0.25, 0.25), tint: Math.random(),
      };
    case 'hearts':
      return {
        x: rand(0, w), y: rand(0, h), r: rand(4, 9),
        baseA: rand(0.25, 0.6), phase: rand(0, Math.PI * 2), speed: rand(0.1, 0.35),
        vy: rand(-0.35, -0.15), drift: rand(-0.3, 0.3), rot: rand(0, Math.PI * 2),
      };
    case 'fog':
      return {
        x: rand(-w * 0.2, w * 0.8), y: rand(h * 0.4, h), r: rand(h * 0.08, h * 0.2),
        baseA: rand(0.03, 0.07), vx: rand(0.15, 0.45), tint: Math.random(),
      };
    default:
      return null;
  }
}

function drawHeart(ctx, x, y, r, alpha, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  const s = r / 8;
  ctx.moveTo(0, 3 * s);
  ctx.bezierCurveTo(-8 * s, -4 * s, -3 * s, -8 * s, 0, -3 * s);
  ctx.bezierCurveTo(3 * s, -8 * s, 8 * s, -4 * s, 0, 3 * s);
  ctx.closePath();
  ctx.fillStyle = `rgba(243, 198, 211, ${alpha})`;
  ctx.fill();
  ctx.restore();
}

function radial(ctx, x, y, r, color) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function frame(ctx, w, h, p, t, dt) {
  switch (p.kind) {
    case 'stars': {
      const a = p.baseA * (0.55 + 0.45 * Math.sin(t * p.speed * 2 + p.phase));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle =
        p.hue === 'lav'
          ? `rgba(216, 199, 245, ${a})`
          : `rgba(255, 255, 255, ${a})`;
      ctx.fill();
      if (p.r > 1.3) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(216, 199, 245, ${a * 0.18})`;
        ctx.fill();
      }
      p.y += p.vy * dt * 60;
      if (p.y > h + 4) { p.y = -4; p.x = Math.random() * w; }
      break;
    }
    case 'glow': {
      const a = p.baseA * (0.6 + 0.4 * Math.sin(t * p.speed + p.phase));
      const color =
        p.tint < 0.33
          ? `rgba(183, 154, 232, ${a})`
          : p.tint < 0.66
            ? `rgba(243, 198, 211, ${a})`
            : `rgba(110, 140, 220, ${a})`;
      radial(ctx, p.x, p.y, p.r, color);
      p.x += p.vx * dt * 60;
      p.y += p.vy * dt * 60;
      if (p.x < -p.r) p.x = w + p.r;
      if (p.x > w + p.r) p.x = -p.r;
      if (p.y < -p.r) p.y = h + p.r;
      if (p.y > h + p.r) p.y = -p.r;
      break;
    }
    case 'snow':
    case 'wolves': {
      const a = p.baseA * (0.6 + 0.4 * Math.sin(t * p.speed * 2 + p.phase));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle =
        p.tint < 0.15
          ? `rgba(216, 199, 245, ${a})`
          : `rgba(235, 240, 255, ${a})`;
      ctx.fill();
      p.y += p.vy * dt * 60;
      p.x += (p.drift + Math.sin(t * 0.6 + p.phase) * 0.3) * dt * 60;
      if (p.y > h + 4) { p.y = -4; p.x = Math.random() * w; }
      if (p.x < -4) p.x = w + 4;
      if (p.x > w + 4) p.x = -4;
      // occasional shooting star in wolf mode
      break;
    }
    case 'hearts': {
      const a = p.baseA * (0.55 + 0.45 * Math.sin(t * p.speed + p.phase));
      drawHeart(ctx, p.x, p.y, p.r, a, p.rot + Math.sin(t + p.phase) * 0.3);
      p.y += p.vy * dt * 60;
      p.x += p.drift * dt * 60;
      if (p.y < -12) { p.y = h + 12; p.x = Math.random() * w; }
      break;
    }
    case 'fog': {
      const color =
        p.tint < 0.5
          ? `rgba(150, 160, 200, ${p.baseA})`
          : `rgba(170, 150, 210, ${p.baseA})`;
      radial(ctx, p.x, p.y, p.r, color);
      p.x += p.vx * dt * 60;
      if (p.x - p.r > w) p.x = -p.r;
      break;
    }
    default:
      break;
  }
}

export default function ParticleBackground({ variant = 'stars', className = '' }) {
  const canvasRef = useRef(null);
  const variantRef = useRef(variant);
  variantRef.current = variant;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const reduced = prefersReduced();

    let w = 0;
    let h = 0;
    let dpr = 1;
    let particles = [];
    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const parent = canvas.parentElement;
      w = parent ? parent.clientWidth : window.innerWidth;
      h = parent ? parent.clientHeight : window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, w * dpr);
      canvas.height = Math.max(1, h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cfg = VARIANT_CONFIG[variantRef.current] ?? VARIANT_CONFIG.stars;
      const mobileScale = isMobile() ? 0.5 : 1;
      const count = Math.min(
        cfg.max,
        Math.floor((w * h) / cfg.density) * mobileScale + (cfg.type === 'fog' ? cfg.max : 0)
      );
      particles = Array.from({ length: Math.max(1, count) }, () => ({
        ...makeParticle(cfg.type, w, h),
        kind: cfg.type,
      }));
    };

    const render = (t) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      ctx.clearRect(0, 0, w, h);

      const kind = (VARIANT_CONFIG[variantRef.current] ?? VARIANT_CONFIG.stars).type;
      // wolf mode gets a faint blue moonlight wash
      if (kind === 'wolves') {
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, 'rgba(40, 60, 110, 0.10)');
        g.addColorStop(1, 'rgba(10, 10, 25, 0.16)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      for (const p of particles) frame(ctx, w, h, p, t / 1000, dt);
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        if (particles[i].dead) particles.splice(i, 1);
      }

      // shooting star occasionally, in starry variants
      if ((kind === 'stars' || kind === 'wolves') && Math.random() < 0.0016 && particles.length < 300) {
        particles.push({
          kind: '__shoot',
          x: Math.random() * w,
          y: Math.random() * h * 0.4,
          vx: 6 + Math.random() * 5,
          vy: 2 + Math.random() * 2,
          life: 1,
        });
      }

      raf = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('resize', resize);

    if (reduced) {
      // single static frame for reduced motion
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) frame(ctx, w, h, p, 0, 0);
    } else {
      raf = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // variant switch: re-render a static burst if reduced motion, else the loop picks it up via ref
  useEffect(() => {
    if (prefersReduced()) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
