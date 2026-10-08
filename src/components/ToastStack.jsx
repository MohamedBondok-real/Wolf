import { AnimatePresence, motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useApp, ACHIEVEMENTS } from '../context/AppContext';

const KIND_STYLES = {
  achievement: 'border-amber-300/30 from-amber-200/10',
  secret: 'border-blush/40 from-blush/10',
  wolf: 'border-lilac-400/40 from-lilac-500/10',
  info: 'border-lilac-300/25 from-lilac-300/5',
};

function ToastIcon({ name, kind }) {
  const Icon = LucideIcons[name] || LucideIcons.Sparkles;
  return (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${
        kind === 'achievement'
          ? 'from-amber-300/30 to-wine-500/30 text-amber-200'
          : kind === 'secret'
            ? 'from-blush/30 to-wine-500/30 text-blush'
            : kind === 'wolf'
              ? 'from-lilac-400/30 to-night-500/40 text-lilac-300'
              : 'from-lilac-300/20 to-night-500/30 text-lilac-300'
      }`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
  );
}

/** Achievement + secret + info toasts, bottom-left so they never fight the music control. */
export default function ToastStack() {
  const { toasts, removeToast } = useApp();

  return (
    <div
      aria-live="polite"
      className="fixed bottom-24 left-4 z-[85] md:bottom-6 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: -40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`glass-strong bg-gradient-to-br ${KIND_STYLES[toast.kind] ?? KIND_STYLES.info} flex items-start gap-3 rounded-2xl p-4 pr-10`}
          >
            <ToastIcon name={toast.icon} kind={toast.kind} />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                {toast.kind === 'achievement' ? 'Achievement Unlocked' : toast.kind === 'secret' ? 'Secret Discovered' : toast.kind === 'wolf' ? 'Wolf Mode' : 'Just so you know'}
              </p>
              <p className="mt-0.5 font-medium text-white">{toast.title}</p>
              {toast.message && (
                <p className="mt-1 text-sm leading-snug text-white/60">{toast.message}</p>
              )}
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => removeToast(toast.id)}
              className="absolute right-2.5 top-2.5 text-white/40 hover:text-white"
            >
              <LucideIcons.X className="h-4 w-4" aria-hidden="true" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export { ACHIEVEMENTS };
