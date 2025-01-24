class BannerBuilder {
  constructor() {
    this.banner = {
      id: 1,
      closeButtonAction: 'no action',
      repetitionType: 'show only once',
      position: 'top',
      url: 'http://localhost:3000',
      fontColor: '#FFFFFF',
      backgroundColor: '#FFFFFF',
      bannerText: 'banner 1',
      createdBy: 1,
      actionUrl: '/home',
    };
  }

  static banner() {
    return new BannerBuilder();
  }

  missingCloseButtonAction() {
    this.banner.closeButtonAction = '';
    return this;
  }
  missingPosition() {
    this.banner.position = '';
    return this;
  }

  invalidCloseButtonAction() {
    this.banner.closeButtonAction = 'close';
    return this;
  }
  invalidPosition() {
    this.banner.position = 'side';
    return this;
  }

  invalidFontColor() {
    this.banner.fontColor = 'blue';
    return this;
  }
  invalidBackgroundColor() {
    this.banner.backgroundColor = 'black';
    return this;
  }

  missingRepetitionType() {
    this.banner.repetitionType = undefined;
    return this;
  }

  invalidRepetitionType() {
    this.banner.repetitionType = 'invalid';
    return this;
  }

  build() {
    return this.banner;
  }
}

const validList = [
  {
    id: 1,
    closeButtonAction: 'no action',
    repetitionType: 'show only once',
    position: 'top',
    url: 'http://localhost:3000',
    fontColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    bannerText: 'banner 1',
    createdBy: 1,
  },
  {
    id: 2,
    closeButtonAction: 'open url',
    repetitionType: 'show only once',
    position: 'top',
    url: 'http://localhost:3000',
    fontColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    bannerText: 'banner 2',
    createdBy: 1,
  },
  {
    id: 3,
    closeButtonAction: 'open url in a new tab',
    repetitionType: 'show only once',
    position: 'top',
    url: 'http://localhost:3000',
    fontColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    bannerText: 'banner 3',
    createdBy: 1,
  },
  {
    id: 4,
    closeButtonAction: 'no action',
    repetitionType: 'show every visit',
    position: 'bottom',
    url: 'http://localhost:3000',
    fontColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    bannerText: 'banner 4',
    createdBy: 1,
  },
  {
    id: 5,
    closeButtonAction: 'open url',
    repetitionType: 'show only once',
    position: 'bottom',
    url: 'http://localhost:3000',
    fontColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    bannerText: 'banner 5',
    createdBy: 1,
  },
  {
    id: 6,
    closeButtonAction: 'open url in a new tab',
    repetitionType: 'show every visit',
    position: 'bottom',
    url: 'http://localhost:3000',
    fontColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    bannerText: 'banner 6',
    createdBy: 2,
  },
  {
    id: 7,
    closeButtonAction: 'no action',
    repetitionType: 'show every visit',
    position: 'top',
    url: 'http://localhost:3000',
    fontColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    bannerText: 'banner 7',
    createdBy: 2,
  },
  {
    id: 8,
    closeButtonAction: 'no action',
    repetitionType: 'show only once',
    position: 'top',
    url: 'http://localhost:3000',
    fontColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    bannerText: 'banner 8',
    createdBy: 2,
  },
  {
    id: 9,
    closeButtonAction: 'no action',
    repetitionType: 'show every visit',
    position: 'top',
    url: 'http://localhost:3000',
    fontColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    bannerText: 'banner 9',
    createdBy: 2,
  },
  {
    id: 10,
    closeButtonAction: 'no action',
    repetitionType: 'show only once',
    position: 'top',
    url: 'http://localhost:3000',
    fontColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    bannerText: 'banner 10',
    createdBy: 2,
  },
];

module.exports = {
  BannerBuilder,
  validList,
};
