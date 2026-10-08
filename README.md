# 🌙 Our Little World

A personal interactive digital universe — a cinematic, multi-page digital gift built for one
special best friend. Not a portfolio, not a landing page: an explorable world with memories,
letters, wolves, secrets, music, and a finale.

**Dark luxury + cinematic movie + personal diary + interactive story.**

## ✨ Features

- **12 pages** — Loading screen, Home, Dashboard, Our Story, Memories, Gallery, Wolf World,
  Reasons, Letters, Secret Room (hidden), Surprise, Final Page — plus a 404 page.
- **Cinematic design** — glassmorphism, film grain, vignette, stars, particles, fog, light rays,
  Ken Burns zooms, mouse-follow glow, parallax, scroll reveals, and a custom glowing cursor.
- **10 Easter eggs** — tracked in `localStorage`, with a progress counter on the Dashboard and
  inside the Secret Room.
- **Achievement system** — 7 achievements with animated unlock toasts.
- **Persistent music player** — optional background music (`public/audio/background.mp3`),
  volume control, preference saved. **Never autoplays.**
- **Optional sound effects** — click, envelope, secret, wolf howl, transition.
- **Wolf Mode** — a global toggle that darkens the whole world, adds snow, and posts wolf
  silhouettes at the edges of the screen.
- **Secret Room** — a hidden page (not in navigation). Unlock it by typing the secret code
  (`wolf` by default) anywhere on the site, or by entering the code on the locked door.
- **Favorites, statistics, first-visit & returning-visitor experiences** — all local.
- **Fully responsive** (desktop / tablet / mobile with bottom navigation), accessible
  (keyboard navigation, ARIA labels, Escape closes modals, `prefers-reduced-motion` support),
  and performance-conscious (lazy images, canvas particles with DPR caps, fewer particles on
  mobile).

## 🚀 Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run preview  # preview the production build
```

## 🎨 Personalize it (5 minutes)

Everything personal lives in **one file**:

```js
// src/config/siteConfig.js
const siteConfig = {
  name: 'Mira',                 // her name
  nickname: 'Star',             // the nickname only friends know
  friendshipStartDate: '2021-06-14', // drives "Time Since We Met"
  favoriteColor: 'purple',
  secretCode: 'wolf',           // the word that unlocks the Secret Room
  yourName: 'Your friend',      // signs the letters
  footerNote: 'Made especially for you.',
};
```

### Replace her photos

Drop real photos into `public/images/her/` and keep the file names used in
`src/data/photos.js` (or edit that file). Nothing else needs to change — every page reads
from the central photo system.

| File | Used on |
| --- | --- |
| `hero.jpg` | Home hero, loading screen |
| `profile.jpg` | Home intro, Dashboard, Final page |
| `final.jpg` | Final page background |
| `photo1–8.jpg` | Gallery, randomizers, Surprise |
| `memory1–6.jpg` | Memories, Story timeline |
| `special1–2.jpg` | Surprise sequence |
| `secret1–3.jpg` | Secret Room (hidden photos) |

### Replace the wolf world

`public/images/wolves/` — `luna/shadow/ghost/storm/nova/winter.jpg` (the pack),
`forest/mountains/pack/snow/howl/moon.jpg` (scenes + the interactive moon).
Edit names, personalities and descriptions in `src/data/wolves.js`.

### Edit all copy

All content is data, not code:

- `src/data/memories.js` — memory cards + categories
- `src/data/story.js` — the timeline chapters
- `src/data/reasons.js` — the 10 numbered reasons + the "another reason" pool
- `src/data/letters.js` — the 5 envelopes and their letters
- `src/data/messages.js` — random messages, moods, surprise sequence lines
- `src/data/easterEggs.js` — the 10 secrets (titles, hints, descriptions)

### Replace the audio

`public/audio/` — `background.mp3` (looping ambient music), `click.mp3`, `open.mp3`,
`secret.mp3`, `howl.mp3`, `transition.mp3`. The placeholder audio was synthesized locally;
replace the files and everything keeps working.

## 🐺 The 10 secrets

| # | Secret | How to find it |
| --- | --- | --- |
| 1 | The Watchful Logo | Click the navbar logo 5 times, quickly |
| 2 | A Star Wishes Back | Click the twinkling star on the Home page |
| 3 | The Whispered Word | Type `wolf` anywhere on the website |
| 4 | The Howling Moon | Click the moon in Wolf World |
| 5 | The Double-Take | Double-click any photo |
| 6 | Patience, Rewarded | Hold "Enter Our World" for 3 seconds |
| 7 | The Invisible Message | Find the nearly-invisible message in the Gallery |
| 8 | The Counting Game | Click a Dashboard number 7 times |
| 9 | The Wild Within | Enter Wolf Mode |
| 10 | The Hidden Heart | Find the tiny heart in the footer |

## 🗂 Project structure

```
public/
  images/her/        her photos (replace these)
  images/wolves/     wolf world imagery (replace these)
  audio/             music + sound effects (replace these)
src/
  config/siteConfig.js   ALL personal info in one place
  data/                  photos, memories, story, wolves, reasons, letters, messages, easterEggs
  context/AppContext.jsx music, wolf mode, secrets, stats, favorites, achievements, toasts
  utils/                 storage, random, time, sound, easterEggs manager
  components/            ParticleBackground, CustomCursor, Navbar, MusicPlayer,
                         MagneticButton, Polaroid, PhotoViewer, MemoryModal, …
  pages/                 Loader, Home, Dashboard, Story, Memories, Gallery,
                         WolfWorld, Reasons, Letters, SecretRoom, Surprise, Final, NotFound
scripts/
  generate_assets.py     regenerates the cinematic placeholder images + audio
  smoke-test.mjs         SSR-renders every page to catch runtime errors
```

## 🧪 Scripts

```bash
python3 scripts/generate_assets.py   # regenerate placeholder art/audio (needs pillow, numpy, lameenc)
node scripts/smoke-test.mjs          # render every page server-side and report failures
```

## 🛠 Tech stack

React 18 · Vite 5 · React Router 6 · Framer Motion · Tailwind CSS · Lucide React

No backend. Everything persists in `localStorage`.
