class TourPopupBuilder {
  constructor(id, tourId) {
    this.tourPopup = {
      id: id,
      title: `title ${id}`,
      header: `header ${id}`,
      description: `description ${id}`,
      targetElement: `.element${id}`,
      order: id,
      tourId,
    };
  }

  static tourPopup(id = 1, tourId = 1) {
    return new TourPopupBuilder(id, tourId);
  }

  withoutId() {
    this.tourPopup.id = undefined;
    return this;
  }

  invalidTitle() {
    this.tourPopup.title = 123;
    return this;
  }

  missingTitle() {
    this.tourPopup.title = undefined;
    return this;
  }

  invalidDescription() {
    this.tourPopup.description = 123;
    return this;
  }

  missingDescription() {
    this.tourPopup.description = undefined;
    return this;
  }

  invalidTargetElement() {
    this.tourPopup.targetElement = 123;
    return this;
  }

  missingTargetElement() {
    this.tourPopup.targetElement = undefined;
    return this;
  }

  invalidOrder() {
    this.tourPopup.order = 'asd';
    return this;
  }

  missingOrder() {
    this.tourPopup.order = undefined;
    return this;
  }

  build() {
    return this.tourPopup;
  }
}

class TourBuilder {
  constructor(id) {
    this.tour = {
      id: id,
      headerColor: '#999',
      textColor: '#444',
      buttonBackgroundColor: '#ff00ff',
      buttonTextColor: '#fff',
      url: '/url',
      size: 'small',
      finalButtonText: 'text',
      active: true,
    };
  }

  static tour(id = 1) {
    return new TourBuilder(id);
  }

  withoutId() {
    this.tour.id = undefined;
    return this;
  }

  invalidHeaderColor() {
    this.tour.headerColor = 123;
    return this;
  }

  invalidTextColor() {
    this.tour.textColor = 123;
    return this;
  }

  invalidButtonBackgroundColor() {
    this.tour.buttonBackgroundColor = 123;
    return this;
  }

  invalidButtonTextColor() {
    this.tour.buttonTextColor = 123;
    return this;
  }

  invalidUrl() {
    this.tour.url = 123;
    return this;
  }

  missingUrl() {
    this.tour.url = undefined;
    return this;
  }

  invalidSize() {
    this.tour.size = 'asd';
    return this;
  }

  missingSize() {
    this.tour.size = undefined;
    return this;
  }

  invalidFinalButtonText() {
    this.tour.finalButtonText = 123;
    return this;
  }

  missingFinalButtonText() {
    this.tour.finalButtonText = undefined;
    return this;
  }

  invalidActive() {
    this.tour.active = 'asd';
    return this;
  }

  missingActive() {
    this.tour.active = undefined;
    return this;
  }

  invalidSteps() {
    this.tour.steps = 123;
    return this;
  }

  missingSteps() {
    this.tour.steps = undefined;
    return this;
  }

  build() {
    return this.tour;
  }
}

const toursList = new Array(10)
  .fill(null)
  .map((_, i) => TourBuilder.tour(i + 1).build())
  .map((tour, i) => {
    const steps = new Array(3).fill(null).map((_, j) => TourPopupBuilder.tourPopup(j + 1, tour.id).build());
    tour.steps = steps;
    if (i % 2 === 0) {
      return { ...tour, createdBy: 2 };
    }
    return tour;
  });

module.exports = { TourBuilder, toursList, TourPopupBuilder };
