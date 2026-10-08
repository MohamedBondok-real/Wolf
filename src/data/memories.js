import photos from './photos';

/**
 * Memory cards. Categories: funny | random | beautiful | chaotic | special
 */
const memories = [
  {
    id: 'm1',
    title: 'The First Conversation',
    date: '2021-06-14',
    category: 'special',
    photo: photos.memories[0],
    description: 'The message that started everything. Neither of us knew it yet.',
    story:
      'It started with a single message — nothing dramatic, nothing planned. Just two people who had no idea that this conversation would turn into something neither of us can imagine living without. Sometimes the biggest things begin the smallest way.',
  },
  {
    id: 'm2',
    title: 'The Night We Talked Until Sunrise',
    date: '2021-09-03',
    category: 'beautiful',
    photo: photos.memories[1],
    description: 'One of those nights where nobody wanted to say goodbye.',
    story:
      'We talked about everything and nothing — dreams, fears, songs, the future, the past. When the sky started getting light, we both pretended not to notice. Some conversations are so good you forget to check the time. That was one of them.',
  },
  {
    id: 'm3',
    title: 'The Random Tuesday',
    date: '2022-02-22',
    category: 'random',
    photo: photos.memories[2],
    description: 'An ordinary day that somehow became unforgettable.',
    story:
      'Nothing special was supposed to happen that day. And yet — a call out of nowhere, a laugh at exactly the right moment, a silence that felt comfortable instead of awkward. The best memories are rarely the planned ones.',
  },
  {
    id: 'm4',
    title: 'The Chaos Episode',
    date: '2022-07-19',
    category: 'chaotic',
    photo: photos.memories[3],
    description: 'The day everything went wrong — and we laughed until it hurt.',
    story:
      'Plans fell apart, everything that could go wrong did go wrong, and for a moment it was a disaster. Then we looked at each other and just… laughed. That day taught me that chaos is a lot less scary when you face it with the right person.',
  },
  {
    id: 'm5',
    title: 'The Little Things',
    date: '2023-01-08',
    category: 'beautiful',
    photo: photos.memories[4],
    description: 'A quiet moment that stayed with me long after.',
    story:
      'No big event, no celebration — just a small gesture, a look, a word at the right time. The kind of moment you carry with you. It reminded me that love (and friendship) lives in the little things, the ones nobody else would even notice.',
  },
  {
    id: 'm6',
    title: 'The Adventure',
    date: '2023-08-27',
    category: 'funny',
    photo: photos.memories[5],
    description: 'The trip where everything was improvised — and perfect.',
    story:
      'No itinerary, no plan, no reservations. Just a decision made in five minutes and a road we had never driven. It was messy and hilarious and completely unforgettable. The best adventures are the ones you do not plan.',
  },
  {
    id: 'm7',
    title: 'The Storm We Weathered',
    date: '2024-03-11',
    category: 'special',
    photo: photos.special[0],
    description: 'A hard season — and you stayed.',
    story:
      'There was a stretch of time that was heavy for both of us. No grand speeches, no movie moments. Just showing up. Again and again. That is when I understood what real friendship looks like — not in the fireworks, but in the consistency.',
  },
  {
    id: 'm8',
    title: 'The Inside Joke',
    date: '2024-11-02',
    category: 'funny',
    photo: photos.special[1],
    description: 'The joke that only makes sense to us.',
    story:
      'There is a word, a phrase, a look — something that only the two of us understand, and every time it comes up we both lose it. Those private jokes are the secret architecture of a friendship. Ours is still under construction.',
  },
];

export const MEMORY_CATEGORIES = ['all', 'funny', 'random', 'beautiful', 'chaotic', 'special'];

export default memories;
