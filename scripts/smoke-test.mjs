/**
 * Runtime smoke test: renders every page to a string via Vite's SSR loader.
 * Catches runtime errors (bad imports, undefined values, render crashes)
 * that a production build cannot see. Run:  node scripts/smoke-test.mjs
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

/* ---------- minimal browser shims (needed before app modules load) ---------- */
const storage = new Map();
globalThis.localStorage = {
  getItem: (k) => (storage.has(k) ? storage.get(k) : null),
  setItem: (k, v) => storage.set(k, String(v)),
  removeItem: (k) => storage.delete(k),
  clear: () => storage.clear(),
};
globalThis.window = globalThis;
globalThis.window.matchMedia = () => ({
  matches: false,
  media: '',
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
});
globalThis.matchMedia = globalThis.window.matchMedia;
globalThis.requestAnimationFrame = () => 0;
globalThis.cancelAnimationFrame = () => {};
globalThis.document = {
  documentElement: { classList: { add() {}, remove() {}, toggle() {} }, style: {} },
  body: { classList: { add() {}, remove() {}, toggle() {} }, style: {} },
  addEventListener() {},
  removeEventListener() {},
  createElement: () => ({ style: {}, getContext: () => null, classList: { add() {}, remove() {} } }),
  hidden: false,
};
globalThis.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
globalThis.Audio = class {
  play() { return Promise.resolve(); }
  pause() {}
};
globalThis.HTMLCanvasElement = class {};
globalThis.SVGElement = class {};
globalThis.HTMLElement = class {};
globalThis.Element = class {};
globalThis.Node = class {};
try {
  Object.defineProperty(globalThis, 'navigator', { value: { userAgent: 'smoke-test' }, configurable: true });
} catch { /* node already provides navigator */ }
globalThis.getComputedStyle = () => ({ getPropertyValue: () => '' });
globalThis.location = { href: 'http://localhost/', pathname: '/', hash: '', search: '' };
globalThis.addEventListener = () => {};
globalThis.removeEventListener = () => {};
globalThis.dispatchEvent = () => true;
globalThis.document.defaultView = globalThis;
globalThis.window.addEventListener = globalThis.addEventListener;
globalThis.window.removeEventListener = globalThis.removeEventListener;
globalThis.window.dispatchEvent = globalThis.dispatchEvent;
globalThis.window.innerWidth = 1440;
globalThis.window.innerHeight = 900;
globalThis.window.devicePixelRatio = 1;
globalThis.window.scrollTo = () => {};

/* ---------- boot vite in middleware mode ---------- */
const server = await createServer({
  root: new URL('..', import.meta.url).pathname,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'silent',
});

const { AppProvider } = await server.ssrLoadModule('/src/context/AppContext.jsx');
const { default: App } = await server.ssrLoadModule('/src/App.jsx');
const { default: Navbar } = await server.ssrLoadModule('/src/components/Navbar.jsx');

const PAGES = [
  ['Home', '/src/pages/Home.jsx', '/'],
  ['Dashboard', '/src/pages/Dashboard.jsx', '/dashboard'],
  ['Story', '/src/pages/Story.jsx', '/story'],
  ['Memories', '/src/pages/Memories.jsx', '/memories'],
  ['Gallery', '/src/pages/Gallery.jsx', '/gallery'],
  ['WolfWorld', '/src/pages/WolfWorld.jsx', '/wolves'],
  ['Reasons', '/src/pages/Reasons.jsx', '/reasons'],
  ['Letters', '/src/pages/Letters.jsx', '/letters'],
  ['SecretRoom', '/src/pages/SecretRoom.jsx', '/secret-room'],
  ['Surprise', '/src/pages/Surprise.jsx', '/surprise'],
  ['Final', '/src/pages/Final.jsx', '/final'],
  ['NotFound', '/src/pages/NotFound.jsx', '/nowhere'],
];

let failures = 0;

function render(element) {
  return renderToString(element);
}

/* App shell (loader state) */
try {
  const html = render(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/'] },
      React.createElement(AppProvider, null, React.createElement(App))
    )
  );
  if (!html.includes('Preparing your little universe')) throw new Error('loader text missing');
  console.log('PASS  App shell (loader)');
} catch (e) {
  failures += 1;
  console.error('FAIL  App shell:', e.message);
}

/* Navbar at a route */
try {
  const html = render(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/gallery'] },
      React.createElement(AppProvider, null, React.createElement(Navbar))
    )
  );
  if (!html.includes('Gallery')) throw new Error('nav links missing');
  console.log('PASS  Navbar');
} catch (e) {
  failures += 1;
  console.error('FAIL  Navbar:', e.message);
}

/* Every page */
for (const [name, mod, route] of PAGES) {
  try {
    const { default: Page } = await server.ssrLoadModule(mod);
    const html = render(
      React.createElement(
        MemoryRouter,
        { initialEntries: [route] },
        React.createElement(AppProvider, null, React.createElement(Page))
      )
    );
    if (html.length < 500) throw new Error(`suspiciously small output (${html.length} chars)`);
    console.log(`PASS  ${name} (${html.length} chars)`);
  } catch (e) {
    failures += 1;
    console.error(`FAIL  ${name}:`, e.stack?.split('\n').slice(0, 8).join('\n'));
  }
}

/* Secret Room — unlocked state (pre-seed localStorage) */
try {
  storage.set('lw_room_unlocked', 'true');
  storage.set('lw_secrets', JSON.stringify(['logo', 'star', 'code', 'moon']));
  const { default: SecretRoom } = await server.ssrLoadModule('/src/pages/SecretRoom.jsx');
  const html = render(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/secret-room'] },
      React.createElement(AppProvider, null, React.createElement(SecretRoom))
    )
  );
  if (!html.includes("You Found Something")) throw new Error('unlocked content missing');
  if (!html.includes('Hidden Photos')) throw new Error('hidden photos section missing');
  console.log('PASS  SecretRoom (unlocked)');
  storage.clear();
} catch (e) {
  failures += 1;
  console.error('FAIL  SecretRoom (unlocked):', e.message);
}

await server.close();

if (failures > 0) {
  console.error(`\n${failures} FAILURE(S)`);
  process.exit(1);
}
console.log('\nALL SMOKE TESTS PASSED');
