const { describe, it, beforeEach, afterEach } = require("mocha");
const sinon = require("sinon");
const { expect } = require("chai");
const mocks = require("../../mocks/hint.mock.js");
const hintService = require("../../../service/hint.service.js");
const hintController = require("../../../controllers/hint.controller.js");

const hint = mocks.HintBuilder.hint;
const hintList = mocks.hintList;

describe("Test hint controller", () => {
  const serviceMock = {};
  const req = {};
  const res = {};
  describe("addHint", () => {
    beforeEach(() => {
      req.user = { id: "123" };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
    });
    afterEach(sinon.restore);
    it("should return 201 if hint is created", async () => {
      req.body = hint(1).build();
      serviceMock.createHint = sinon
        .stub(hintService, "createHint")
        .resolves(hint(1).build());
      await hintController.addHint(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(201);
      expect(body).to.be.deep.equal(hint(1).build());
    });
    it("should return 500 if an error occurs", async () => {
      req.body = hint(1).build();
      serviceMock.createHint = sinon
        .stub(hintService, "createHint")
        .rejects(new Error("error"));
      await hintController.addHint(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(500);
      expect(body).to.be.deep.equal({
        error: "Internal Server Error",
        errorCode: "CREATE_HINT_ERROR",
        message: "An unexpected error occurred while creating the hint",
      });
    });
  });
  describe("getHints", () => {
    beforeEach(() => {
      req.user = { id: "1" };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
    });
    afterEach(sinon.restore);
    it("should return 200 if hints created by the user are retrieved", async () => {
      serviceMock.getHints = sinon
        .stub(hintService, "getHints")
        .resolves(hintList.filter((hint) => hint.createdBy === 1));
      await hintController.getHints(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(200);
      expect(body).not.to.be.deep.equal(hintList);
    });
    it("should return 500 if an error occurs", async () => {
      serviceMock.getHints = sinon
        .stub(hintService, "getHints")
        .rejects(new Error("error"));
      await hintController.getHints(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(500);
      expect(body).to.be.deep.equal({
        error: "Internal Server Error",
        errorCode: "GET_HINTS_ERROR",
        message: "An unexpected error occurred while retrieving hints",
      });
    });
  });
  describe("getAllHints", () => {
    beforeEach(() => {
      req.user = { id: "1" };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
    });
    afterEach(sinon.restore);
    it("should return 200 if hints are retrieved", async () => {
      serviceMock.getAllHints = sinon
        .stub(hintService, "getAllHints")
        .resolves(hintList);
      await hintController.getAllHints(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(200);
      expect(body).to.be.deep.equal(hintList);
    });
    it("should return 500 if an error occurs", async () => {
      serviceMock.getAllHints = sinon
        .stub(hintService, "getAllHints")
        .rejects(new Error("error"));
      await hintController.getAllHints(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(500);
      expect(body).to.be.deep.equal({
        error: "Internal Server Error",
        errorCode: "GET_ALL_HINTS_ERROR",
        message: "An unexpected error occurred while retrieving hints",
      });
    });
  });
  describe("getHintById", () => {
    beforeEach(() => {
      req.user = { id: "123" };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
    });
    afterEach(sinon.restore);
    it("should return 200 if hint is retrieved", async () => {
      req.params = { hintId: "1" };
      serviceMock.getHintById = sinon
        .stub(hintService, "getHintById")
        .resolves(hint(1).build());
      await hintController.getHintById(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(200);
      expect(body).to.be.deep.equal(hint(1).build());
    });
    it("should return 404 if hint is not found", async () => {
      req.params = { hintId: "1" };
      serviceMock.getHintById = sinon
        .stub(hintService, "getHintById")
        .resolves(null);
      await hintController.getHintById(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(404);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "Hint not found" }],
      });
    });
    it("should return 500 if an error occurs", async () => {
      req.params = { hintId: "1" };
      serviceMock.getHintById = sinon
        .stub(hintService, "getHintById")
        .rejects(new Error("error"));
      await hintController.getHintById(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(500);
      expect(body).to.be.deep.equal({
        error: "Internal Server Error",
        errorCode: "GET_HINT_BY_ID_ERROR",
        message: "An unexpected error occurred while retrieving the hint",
      });
    });
  });
  describe("updateHint", () => {
    beforeEach(() => {
      req.user = { id: "123" };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
    });
    afterEach(sinon.restore);
    it("should return 404 if hint is not found", async () => {
      req.params = { hintId: "1" };
      req.body = hint(1).build();
      serviceMock.getHintById = sinon
        .stub(hintService, "getHintById")
        .resolves(null);
      await hintController.updateHint(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(404);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "Hint not found" }],
      });
    });
    it("should return 200 if hint is updated", async () => {
      req.params = { hintId: "1" };
      req.body = hint(1).build();
      serviceMock.getHintById = sinon
        .stub(hintService, "getHintById")
        .resolves(hint(1).build());
      serviceMock.updateHint = sinon
        .stub(hintService, "updateHint")
        .resolves(hint(1).build());
      await hintController.updateHint(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(200);
      expect(body).to.be.deep.equal(hint(1).build());
    });
    it("should return 500 if an error occurs", async () => {
      req.params = { hintId: "1" };
      req.body = hint(1).build();
      serviceMock.getHintById = sinon
        .stub(hintService, "getHintById")
        .rejects(new Error("error"));
      await hintController.updateHint(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(500);
      expect(body).to.be.deep.equal({
        error: "Internal Server Error",
        errorCode: "UPDATE_HINT_ERROR",
        message: "An unexpected error occurred while updating the hint",
      });
    });
  });
  describe("deleteHint", () => {
    beforeEach(() => {
      req.user = { id: "123" };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
    });
    afterEach(sinon.restore);
    it("should return 404 if hint is not found", async () => {
      req.params = { hintId: "1" };
      serviceMock.getHintById = sinon
        .stub(hintService, "deleteHint")
        .resolves(null);
      await hintController.deleteHint(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(404);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "Hint not found" }],
      });
    });
    it("should return 200 if hint is deleted", async () => {
      req.params = { hintId: "1" };
      serviceMock.getHintById = sinon
        .stub(hintService, "getHintById")
        .resolves(hint(1).build());
      serviceMock.deleteHint = sinon
        .stub(hintService, "deleteHint")
        .resolves(hint(1).build());
      await hintController.deleteHint(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(200);
      expect(body).to.be.deep.equal({
        message: "Hint with ID 1 deleted successfully",
      });
    });
    it("should return 500 if an error occurs", async () => {
      req.params = { hintId: "1" };
      serviceMock.getHintById = sinon
        .stub(hintService, "getHintById")
        .resolves(1);
      serviceMock.deleteHint = sinon
        .stub(hintService, "deleteHint")
        .rejects(new Error("error"));
      await hintController.deleteHint(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(500);
      expect(body).to.be.deep.equal({
        error: "Internal Server Error",
        errorCode: "DELETE_HINT_ERROR",
        message: "An unexpected error occurred while deleting the hint",
      });
    });
  });
});
