/** Randomization helpers that avoid immediate duplicates. */

/** Pick a random item that is different from the previous one (when possible). */
export function pickDifferent(arr, avoid) {
  if (!arr || arr.length === 0) return undefined;
  if (arr.length === 1) return arr[0];
  let next = arr[Math.floor(Math.random() * arr.length)];
  let guard = 0;
  while (next === avoid && guard < 10) {
    next = arr[Math.floor(Math.random() * arr.length)];
    guard += 1;
  }
  return next;
}

/** Pick a random item different from `avoid` by id/index-safe comparison. */
export function pickDifferentIndex(length, avoidIndex) {
  if (length <= 1) return 0;
  let i = Math.floor(Math.random() * length);
  let guard = 0;
  while (i === avoidIndex && guard < 10) {
    i = Math.floor(Math.random() * length);
    guard += 1;
  }
  return i;
}

/** Fisher–Yates shuffle (returns a new array). */
export function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Random integer in [min, max]. */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
