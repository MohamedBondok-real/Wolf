/**
 * ─────────────────────────────────────────────────────────────
 *  CENTRALIZED PHOTO SYSTEM
 *  Replace the files inside  public/images/her/  and every
 *  photo on the website updates automatically. Never hardcode
 *  image paths inside components — always import from here.
 * ─────────────────────────────────────────────────────────────
 */
const photos = {
  // Main hero visual on the Home page.
  hero: '/images/her/hero.jpg',

  // Portrait used in the Home intro + Dashboard.
  profile: '/images/her/profile.jpg',

  // Cinematic ending visual on the Final page.
  final: '/images/her/final.jpg',

  // The main gallery (Gallery page + Dashboard randomizer).
  gallery: [
    '/images/her/photo1.jpg',
    '/images/her/photo2.jpg',
    '/images/her/photo3.jpg',
    '/images/her/photo4.jpg',
    '/images/her/photo5.jpg',
    '/images/her/photo6.jpg',
    '/images/her/photo7.jpg',
    '/images/her/photo8.jpg',
  ],

  // Memory photos (Memories page + Story timeline).
  memories: [
    '/images/her/memory1.jpg',
    '/images/her/memory2.jpg',
    '/images/her/memory3.jpg',
    '/images/her/memory4.jpg',
    '/images/her/memory5.jpg',
    '/images/her/memory6.jpg',
  ],

  // Extra-special photos (Surprise sequence).
  special: ['/images/her/special1.jpg', '/images/her/special2.jpg'],

  // Hidden photos only visible inside the Secret Room.
  secret: [
    '/images/her/secret1.jpg',
    '/images/her/secret2.jpg',
    '/images/her/secret3.jpg',
  ],
};

/** Every photo, deduplicated — handy for randomizers. */
photos.all = [
  ...new Set([
    photos.hero,
    photos.profile,
    photos.final,
    ...photos.gallery,
    ...photos.memories,
    ...photos.special,
    ...photos.secret,
  ]),
];

export default photos;
