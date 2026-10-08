/**
 * ─────────────────────────────────────────────────────────────
 *  WOLF WORLD — its own visual identity: full moon, dark forest,
 *  fog, snow, stars, purple/blue moonlight and wolf silhouettes.
 *  Images live in  public/images/wolves/
 * ─────────────────────────────────────────────────────────────
 */
const wolves = {
  // Backgrounds
  backgrounds: {
    forest: '/images/wolves/forest.jpg',
    mountains: '/images/wolves/mountains.jpg',
    pack: '/images/wolves/pack.jpg',
    snow: '/images/wolves/snow.jpg',
    howl: '/images/wolves/howl.jpg',
    moon: '/images/wolves/moon.jpg',
  },

  // The Pack — wolf cards
  pack: [
    {
      id: 'luna',
      name: 'Luna',
      image: '/images/wolves/luna.jpg',
      personality: 'The Dreamer',
      description:
        'Silver-furred and soft-spoken, Luna leads with quiet intuition. She finds beauty in the darkest nights and reminds the pack that gentleness is its own kind of strength.',
    },
    {
      id: 'shadow',
      name: 'Shadow',
      image: '/images/wolves/shadow.jpg',
      personality: 'The Protector',
      description:
        'Always watching, always present. Shadow moves without a sound and stands between the pack and anything that might harm it. Loyalty is his whole language.',
    },
    {
      id: 'ghost',
      name: 'Ghost',
      image: '/images/wolves/ghost.jpg',
      personality: 'The Mystery',
      description:
        'Pale as moonlight on snow, Ghost appears when you least expect him. He knows the paths nobody else dares to walk — and he always finds his way back.',
    },
    {
      id: 'storm',
      name: 'Storm',
      image: '/images/wolves/storm.jpg',
      personality: 'The Wild One',
      description:
        'Loud, fearless and impossible to tame. Storm runs into the wind instead of away from it, and somehow always drags the pack along into something unforgettable.',
    },
    {
      id: 'nova',
      name: 'Nova',
      image: '/images/wolves/nova.jpg',
      personality: 'The Spark',
      description:
        'Small but brilliant, Nova is the reason the pack never sits still for too long. One look from her and the whole forest seems to light up a little brighter.',
    },
    {
      id: 'winter',
      name: 'Winter',
      image: '/images/wolves/winter.jpg',
      personality: 'The Ancient',
      description:
        'Old, patient and wise beyond his years. Winter has seen every season the forest has to offer, and he carries each one with quiet grace.',
    },
  ],

  // Large interactive wolf gallery
  gallery: [
    { src: '/images/wolves/forest.jpg', caption: 'Where the pack began' },
    { src: '/images/wolves/mountains.jpg', caption: 'Above the fog, under the moon' },
    { src: '/images/wolves/pack.jpg', caption: 'The pack, together' },
    { src: '/images/wolves/snow.jpg', caption: 'Winter belongs to them' },
    { src: '/images/wolves/howl.jpg', caption: 'The song of the wild' },
    { src: '/images/wolves/moon.jpg', caption: 'Every legend starts with a moon' },
  ],

  // Interesting wolf facts
  facts: [
    {
      title: 'Wolves mate for life',
      text: 'A wolf pack is built around a family, not a hierarchy of strangers. The alpha pair are simply… the parents. The pack is their family tree in motion.',
    },
    {
      title: 'They howl to find each other',
      text: 'A howl is not a cry of loneliness — it is a beacon. Wolves howl to gather the pack, to warn strangers away, and to say: I am here, and so are we.',
    },
    {
      title: 'Their paws are built for snow',
      text: 'Wolves have webbed toes and a special circulation system that keeps their paw pads from freezing — nature’s own snowshoes, designed over thousands of winters.',
    },
    {
      title: 'They remember kindness',
      text: 'Wolves can recognize a human who helped them — sometimes years later. In old stories, the wolf never forgets a friend.',
    },
    {
      title: 'A pack is a family',
      text: 'Every wolf in a pack has a role: hunters, babysitters, scouts, guardians. No wolf is alone, because the strength of the pack is each wolf, and each wolf is the pack.',
    },
    {
      title: 'They feel the moon',
      text: 'Wolves are more active on bright nights. There is an old belief that a howl under a full moon carries further than any other — as if the moon itself lends them its voice.',
    },
  ],

  // Original short quotes inspired by wolves
  quotes: [
    'Run with the pack, but never lose yourself inside it.',
    'Even the wildest heart needs a place to rest.',
    'The moon does not rush the night — and neither should you.',
    'Loyalty is louder than any howl.',
    'Some souls are born to run free; the lucky ones find a pack to run with.',
    'In the forest, the bravest thing is still to be gentle.',
  ],
};

export default wolves;
