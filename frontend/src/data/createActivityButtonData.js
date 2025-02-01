export const ACTIVITY_TYPES = {
  HINTS: 'hints',
  POPUPS: 'popups',
  BANNERS: 'banners',
  HELPERLINKS: 'helper links',
  TOURS: 'tours',
};

export const activityData = {
  [ACTIVITY_TYPES.HINTS]: {
    heading: 'Use hints to',
    listItem: [
      'Help user understand a complex situation',
      'Give contextual tips and tricks',
      'Give instant help',
    ],
    buttonText: 'Create a hint',
  },
  [ACTIVITY_TYPES.POPUPS]: {
    heading: 'Use popups to',
    listItem: [
      'Announce a new feature',
      'Warn user about an upcoming status (e.g outage)',
      'Alert users about issues, errors, or warnings',
    ],
    buttonText: 'Create a popup',
  },
  [ACTIVITY_TYPES.BANNERS]: {
    heading: 'Use banners to',
    listItem: [
      'Announce a new feature',
      'Publish release notes',
      'Give more information about a recent news',
    ],

    buttonText: 'Create a banner',
  },
  [ACTIVITY_TYPES.HELPERLINKS]: {
    heading: 'Use helper links to',
    listItem: [
      'Provide the user a contextual help area',
      'Help them understand a specific feature',
      'Guide them to your knowledgebase',
    ],
    buttonText: 'Create a link',
  },
  [ACTIVITY_TYPES.TOURS]: {
    heading: 'Use tours to',
    listItem: [
      'Design step by step product tours',
      'Welcome new users in the app',
      'Announce new changes & updates',
      'Teach them something new',
    ],
    buttonText: 'Create a tour',
  },
};
