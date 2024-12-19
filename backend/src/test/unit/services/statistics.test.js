const { describe, it, beforeEach, afterEach } = require("mocha");
const sinon = require("sinon");
const { expect } = require("chai");
const db = require("../../../models/index.js");
const mocks = require("../../mocks/guidelog.mock.js");
const statisticsService = require("../../../service/statistics.service.js");

const GuideLog = db.GuideLog;

describe("Test statistics service", () => {
  const GuideLogMock = {};
  let commit;
  let rollback;
  beforeEach(() => {
    commit = sinon.spy();
    rollback = sinon.spy();
    sinon.stub(db.sequelize, "transaction").callsFake(async () => ({
      commit,
      rollback,
    }));
  });
  afterEach(sinon.restore);
  it("should return statistics", async () => {
    const guideLogs = mocks.guideLogList;
    GuideLogMock.findAll = sinon.stub(GuideLog, "findAll").resolves(guideLogs);
    const statistics = await statisticsService.generateStatistics({
      userId: 1,
    });
    const expected = [
      { views: 2, change: 0, guideType: "popup" },
      { views: 2, change: 0, guideType: "hint" },
      { views: 2, change: 0, guideType: "banner" },
      { views: 0, change: 0, guideType: "link" },
      { views: 3, change: 0, guideType: "tour" },
      { views: 1, change: 0, guideType: "checklist" },
    ];
    expect(GuideLogMock.findAll.called).to.equal(true);
    expect(statistics).to.be.an("array");
    expect(statistics).to.have.lengthOf(6);
    expect(statistics).to.deep.equal(expected);
  });
});