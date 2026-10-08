import { getJSON, setJSON, LS } from './storage';
import { easterEggs } from '../data/easterEggs';

/**
 * ─────────────────────────────────────────────────────────────
 *  EASTER EGG MANAGER
 *  Tracks which secrets have been discovered (localStorage).
 *  The UI layer (AppContext) listens and shows toasts / stats.
 * ─────────────────────────────────────────────────────────────
 */

export const TOTAL_SECRETS = easterEggs.length;

export function getDiscoveredSecrets() {
  const list = getJSON(LS.secrets, []);
  return Array.isArray(list) ? list : [];
}

export function isSecretDiscovered(id) {
  return getDiscoveredSecrets().includes(id);
}

/**
 * Mark a secret as discovered.
 * Returns true when it is NEW, false when it was already found.
 */
export function discoverSecretById(id) {
  const list = getDiscoveredSecrets();
  if (list.includes(id)) return false;
  setJSON(LS.secrets, [...list, id]);
  return true;
}

export function getSecretProgress() {
  return { found: getDiscoveredSecrets().length, total: TOTAL_SECRETS };
}

export function getSecretById(id) {
  return easterEggs.find((e) => e.id === id);
}

export function resetSecrets() {
  setJSON(LS.secrets, []);
}
