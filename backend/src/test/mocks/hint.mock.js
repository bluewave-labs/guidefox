class HintBuilder {
  constructor(id) {
    this.hint = {
      id,
      action: "open url in a new tab",
      repetitionType: "show only once",
      actionButtonUrl: "/url",
      actionButtonText: "text",
      targetElement: ".element",
      tooltipPlacement: "top",
      isHintIconVisible: true,
      hintContent: "content",
      header: "header",
      url: "/url",
      headerBackgroundColor: "#FFFFFF",
      headerColor: "#000000",
      textColor: "#000000",
      buttonBackgroundColor: "#FFFFFF",
      buttonTextColor: "#000000",
      createdBy: 1,
    };
  }

  static hint(id) {
    return new HintBuilder(id);
  }

  missingAction() {
    this.hint.action = undefined;
    return this;
  }

  invalidAction() {
    this.hint.action = "invalid action";
    return this;
  }

  missingRepetitionType() {
    this.hint.repetitionType = undefined;
    return this;
  }

  invalidRepetitionType() {
    this.hint.repetitionType = "invalid repetition type";
    return this;
  }

  invalidHeaderBackgroundColor() {
    this.hint.headerBackgroundColor = "invalid";
    return this;
  }

  invalidHeaderColor() {
    this.hint.headerColor = "invalid";
    return this;
  }

  invalidTextColor() {
    this.hint.textColor = "invalid";
    return this;
  }

  invalidButtonBackgroundColor() {
    this.hint.buttonBackgroundColor = "invalid";
    return this;
  }

  invalidButtonTextColor() {
    this.hint.buttonTextColor = "invalid";
    return this;
  }

  build() {
    return this.hint;
  }
}

const hintList = Array.from({ length: 10 }, (_, i) =>
  new HintBuilder(i + 1).build()
).map((hint, i) => (i % 2 === 0 ? { ...hint, createdBy: 2 } : hint));

module.exports = {
  HintBuilder,
  hintList,
};
