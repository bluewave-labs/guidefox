export const ACTIVITY_TYPES_INFO = {
  HINTS: 'hints',
  POPUPS: 'popups',
  BANNERS: 'banners',
  HELPERLINKS: 'helper links',
  TOURS: 'tours',
};

export const activityInfoData = {
  [ACTIVITY_TYPES_INFO.POPUPS]: {
    heading: 'What is a popup?',
    paragraph:
      'Popups can enhance user experience, communication, and engagement within a SaaS dashboard when used effectively \n Popups can display promotional messages, special offers, or discounts to encourage users to upgrade their subscription, purchase additional features, or engage more with the software \n They can also notify users about important updates, announcements, or events related to the software or their account.',
    buttonText: 'Create a new popup',
    title: 'All popups',
  },
  [ACTIVITY_TYPES_INFO.BANNERS]: {
    heading: 'What is a banner?',
    paragraph:
      "A banner is a strip or bar typically displayed at the top or bottom of the user interface. \n Banners can be used to convey important announcements such as new features, product updates, scheduled maintenance, or system downtime. \n They can also display promotional messages, special offers, discounts, or upcoming events to attract users' attention and encourage engagement. \n Banners can effectively communicate important information to users without disrupting their workflow within the SaaS application",
    buttonText: 'Create a new banner',
    title: 'All banners',
  },
  [ACTIVITY_TYPES_INFO.HINTS]: {
    heading: 'What is a hint?',
    paragraph:
      "Hints are like friendly reminders in an app, giving tips without stopping what you are doing. They show up at small bubbles near buttons or menus, guiding you on how to use things. \n One good thing about hints is they help you use the app better by giving tips when you need them. For example, they can show clear instructions when you're trying something new, so you don't get stuck or confused. \n Hints work for everyone, from beginners to experts. They give basic tips for people just starting out and clever tricks for those who know the app well. This makes the app easier for everyone to use.",
    buttonText: 'Create a new hint',
    title: 'All hints',
  },
  [ACTIVITY_TYPES_INFO.HELPERLINKS]: {
    heading: 'What is helper link?',
    paragraph:
      'A helper link is a way to collect all your help and feedback links.\nIf your users aren’t sure where to contact you, find knowledgebase or get help, a helper link is the best answer.\nHelper links can enhance user experience, communication, and engagement when used effectively.',
    buttonText: 'Create a new helper link',
    title: 'All helper links',
  },
};
