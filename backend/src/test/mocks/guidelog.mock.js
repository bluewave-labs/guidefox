const { GuideType } = require("../../utils/guidelog.helper");

class GuideLogBuilder {
  constructor(id, guideType) {
    this.guideLog = {
      guideType,
      guideId: id,
      userId: "1",
      showingTime: new Date("2024-11-29T00:00:00.000Z"),
      completed: false,
    };
  }

  static guideLog(id = 1, guideType = 1) {
    return new GuideLogBuilder(id, guideType);
  }

  invalidGuideType() {
    this.guideLog.guideType = "invalid";
    return this;
  }

  missingGuideType() {
    this.guideLog.guideType = undefined;
    return this;
  }

  invalidUserId() {
    this.guideLog.userId = 123;
    return this;
  }

  missingUserId() {
    this.guideLog.userId = undefined;
    return this;
  }

  invalidCompleted() {
    this.guideLog.completed = "invalid";
    return this;
  }

  build() {
    return this.guideLog;
  }
}

const guideLogList = Array.from({ length: 10 }, (_, i) => {
  const values = Object.values(GuideType);
  let index = 0;
  if (i % 2 === 0 && i % 3 === 0) {
    index = 1;
  } else if (i % 3 === 0) {
    index = 2;
  } else if (i % 2 === 0 && i % 5 === 0) {
    index = 3;
  } else if (i % 2 === 0) {
    index = 4;
  } else if (i % 5 === 0) {
    index = 5;
  }
  return GuideLogBuilder.guideLog(i + 1, values[index]).build();
}).map((guideLog, i) => (i % 2 === 0 ? guideLog : { ...guideLog, userId: 2 }));

module.exports = { GuideLogBuilder, guideLogList };
