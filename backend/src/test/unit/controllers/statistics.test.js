const { describe, it, afterEach } = require("mocha");
const { expect } = require("chai");
const sinon = require("sinon");
const service = require("../../../service/statistics.service.js");
const { guideLogList } = require("../../mocks/guidelog.mock.js");
const controller = require("../../../controllers/statistics.controller.js");

describe("Test Statistics controller", () => {
  const serviceMock = {};
  const req = {};
  const res = {};
  beforeEach(() => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
  });
  afterEach(sinon.restore);
  describe("getStatistics", () => {
    req.user = { id: 1 };
    it("should return status 200 and the statistics to all guides", async () => {
      serviceMock.generateStatistics = sinon
        .stub(service, "generateStatistics")
        .resolves(guideLogList);
      await controller.getStatistics(req, res);
      const status = res.status.firstCall.args[0];
      const json = res.json.firstCall.args[0];
      expect(status).to.be.equal(200);
      expect(json).to.be.equal(guideLogList);
    });
    it("should return status 500 if something goes wrong", async () => {
      serviceMock.generateStatistics = sinon
        .stub(service, "generateStatistics")
        .rejects(`Failed to generate statistics:`);
      await controller.getStatistics(req, res);
      const status = res.status.firstCall.args[0];
      const json = res.json.firstCall.args[0];
      expect(status).to.be.equal(500);
      expect(json).to.be.deep.equal({
        error: "Internal Server Error",
        errorCode: "GET_STATISTICS_ERROR",
      });
    });
  });
});
