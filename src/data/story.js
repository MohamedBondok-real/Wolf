import photos from './photos';

/**
 * The interactive cinematic timeline — "Our Story" page.
 * Each item: date, title, description and a photo.
 */
const story = [
  {
    id: 's1',
    date: 'June 2021',
    title: 'The Beginning',
    tag: 'Chapter I',
    photo: photos.memories[0],
    description:
      'A single message, sent almost by accident. Neither of us could have known that this quiet hello would slowly become one of the most important conversations of our lives.',
  },
  {
    id: 's2',
    date: 'Late 2021',
    title: 'The First Conversations',
    tag: 'Chapter II',
    photo: photos.memories[1],
    description:
      'We talked about everything — the small things, the big things, the things we had never told anyone. It felt easy in a way that surprised us both.',
  },
  {
    id: 's3',
    date: '2022',
    title: 'The Random Moments',
    tag: 'Chapter III',
    photo: photos.memories[2],
    description:
      'Ordinary days turned into stories. A call at midnight, a walk with no destination, a song shared at exactly the right moment.',
  },
  {
    id: 's4',
    date: '2022',
    title: 'The Inside Jokes',
    tag: 'Chapter IV',
    photo: photos.memories[5],
    description:
      'A language of our own slowly formed — looks, words, references that nobody else in the world would understand. Ours.',
  },
  {
    id: 's5',
    date: '2023',
    title: 'The Unexpected Memories',
    tag: 'Chapter V',
    photo: photos.memories[3],
    description:
      'The unplanned trips, the disasters that became laughter, the quiet evenings that somehow mattered more than the loud ones.',
  },
  {
    id: 's6',
    date: 'Now',
    title: 'Everything Since Then',
    tag: 'Chapter VI',
    photo: photos.memories[4],
    description:
      'Every message, every call, every ordinary moment that quietly stacked up into something I would never trade. This story is still being written — and I hope you keep turning the pages with me.',
  },
];

export default story;
