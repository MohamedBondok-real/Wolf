import { getBool, setBool, LS } from './storage';

/**
 * Optional, subtle sound effects. Cached <audio> elements, never autoplayed,
 * and fully disabled when the user turns sound effects off.
 */
const SOUNDS = {
  click: '/audio/click.mp3',
  open: '/audio/open.mp3',
  secret: '/audio/secret.mp3',
  howl: '/audio/howl.mp3',
  transition: '/audio/transition.mp3',
};

const cache = {};

export function isSfxEnabled() {
  return getBool(LS.sfx, true);
}

export function setSfxEnabled(value) {
  setBool(LS.sfx, value);
}

/** Play a subtle sound effect. Safe to call anywhere — it never throws. */
export function playSfx(name, volume = 1) {
  if (!isSfxEnabled()) return;
  if (typeof window === 'undefined') return;
  try {
    let audio = cache[name];
    if (!audio) {
      audio = new Audio(SOUNDS[name]);
      audio.preload = 'auto';
      cache[name] = audio;
    }
    audio.volume = Math.min(1, Math.max(0, 0.45 * volume));
    audio.currentTime = 0;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  } catch {
    /* audio unsupported — ignore */
  }
}
