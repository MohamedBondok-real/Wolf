/** Safe localStorage helpers. Every feature persists locally — no backend. */

export const LS = {
  seen: 'lw_seen',
  musicOn: 'lw_music_on',
  volume: 'lw_music_volume',
  sfx: 'lw_sfx_on',
  wolfMode: 'lw_wolf_mode',
  secrets: 'lw_secrets',
  stats: 'lw_stats',
  favorites: 'lw_favorites',
  achievements: 'lw_achievements',
  roomUnlocked: 'lw_room_unlocked',
  visited: 'lw_visited',
};

export function getJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function setJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable — fail silently */
  }
}

export function getBool(key, fallback = false) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : raw === 'true';
  } catch {
    return fallback;
  }
}

export function setBool(key, value) {
  try {
    localStorage.setItem(key, value ? 'true' : 'false');
  } catch {
    /* ignore */
  }
}

export function getNum(key, fallback = 0) {
  const v = Number(getJSON(key, fallback));
  return Number.isFinite(v) ? v : fallback;
}
