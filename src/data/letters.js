import siteConfig from '../config/siteConfig';

/**
 * Interactive digital envelopes. Each letter unfolds when opened.
 * All copy is editable right here.
 */
const letters = [
  {
    id: 'smile',
    title: 'Open When You Need A Smile',
    hint: 'For the days that feel heavier than they should.',
    mood: 'warm',
    paragraphs: [
      `Hey ${siteConfig.name},`,
      'First of all — look at you, opening a letter like this. I already like how curious you are.',
      'I want you to remember something: the world is not always kind, and you do not have to be strong every single day. But on the days when you are — I see it. And I am proud of you.',
      'Now close your eyes for three seconds and think of one moment that made you laugh recently. Got it? Good. That moment exists because of people like you, and because of people who get to be near you.',
      'Smile. Not because everything is perfect — but because you are.',
    ],
  },
  {
    id: 'bad-day',
    title: "Open When You're Having A Bad Day",
    hint: 'For the days when everything goes wrong at once.',
    mood: 'soft',
    paragraphs: [
      `My dear ${siteConfig.nickname},`,
      'Bad days lie to you. They tell you that this feeling is permanent, that everyone else has it together, that you are the only one who feels like this. It is not true.',
      'You have survived every bad day you have ever had — one hundred percent of them. That is not luck; that is you.',
      'This day will end. The sun will rise whether you watch it or not, and when it does, you will still be here — and so will I.',
      'Be gentle with yourself today. You are allowed to have days like this. You are still loved on days like this.',
    ],
  },
  {
    id: 'motivation',
    title: 'Open When You Need Motivation',
    hint: 'For the days you forget how far you have come.',
    mood: 'fire',
    paragraphs: [
      'Listen to me for a second.',
      `You started this friendship as a stranger to greatness — and look at you now. You have grown in ways you cannot even see from the inside. That is what growth always looks like: invisible from up close.`,
      'The goal is not to be the best. The goal is to be a little braver than you were yesterday. A little kinder. A little more you.',
      'And on the days when even that feels impossible — remember that someone out there believes in you, exactly as you are, without a single condition.',
      'Now go do the thing. Not perfectly. Just start.',
    ],
  },
  {
    id: 'good-days',
    title: 'Open When You Miss The Good Days',
    hint: 'For the days you wish you could go back.',
    mood: 'moon',
    paragraphs: [
      'I miss them too, sometimes.',
      'But here is the secret about good days: they are not behind us — they are inside us. Every laugh, every adventure, every quiet moment is still part of who we are. You carry them with you.',
      'And the beautiful thing? The good days are not finished. There are so many more of them waiting — some of them with you in them, and me wondering how it is even possible to be this lucky.',
      'Until then, this letter is a place to keep them. Safe. Warm. Yours.',
    ],
  },
  {
    id: 'because',
    title: 'Open Just Because',
    hint: 'No reason needed. That is the point.',
    mood: 'lavender',
    paragraphs: [
      'No bad day, no sad day, no reason at all.',
      `I just wanted you to have a letter that exists for one reason only: because you are ${siteConfig.name}, and because somewhere in this world, someone thinks about you and smiles.`,
      'Friendship, at its best, is not a transaction. It is not "I help you when you need it." It is "I think about you when you do not need anything at all."',
      'This is that kind of letter. From that kind of friend.',
      `Until the next memory… ♡\n— ${siteConfig.yourName}`,
    ],
  },
];

export default letters;
