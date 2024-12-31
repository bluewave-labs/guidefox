const { describe, it, beforeEach, afterEach } = require("mocha");
const sinon = require("sinon");
const { expect } = require("chai");
const db = require("../../../models/index.js");
const mocks = require("../../mocks/guidelog.mock.js");
const statisticsService = require("../../../service/statistics.service.js");

const GuideLog = db.GuideLog;

describe("Test statistics service", () => {
  const GuideLogMock = {};
  afterEach(sinon.restore);
  it("should return statistics", async () => {
    const guideLogs = mocks.guideLogList;
    GuideLogMock.findAll = sinon.stub(GuideLog, "findAll").resolves(guideLogs);
    const statistics = await statisticsService.generateStatistics({
      userId: 1,
    });

    expect(GuideLogMock.findAll.called).to.equal(true);
    expect(statistics).to.be.an("array");
    expect(statistics).to.have.lengthOf(6);
    statistics.forEach((statistic) => {
      expect(statistic).to.have.property("guideType");
      expect(statistic).to.have.property("views");
      expect(statistic).to.have.property("change");
    });
  });
});
