const { describe, it, beforeEach, afterEach } = require("mocha");
const sinon = require("sinon");
const { expect } = require("chai");
const mocks = require("../../mocks/helperLink.mock.js");
const helperLinks = require("../../../controllers/helperLink.controller.js");
const service = require("../../../service/helperLink.service.js");

const controller = helperLinks.controller;

describe("Test helper link controller", () => {
  const serviceMock = {};
  const req = {};
  const res = {};
  beforeEach(() => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
  });
  afterEach(sinon.restore);
  describe("addHelper", () => {
    it("should return 500 if service throws error", async () => {
      req.user = {
        id: 1,
      };
      req.body = mocks.HelperLinkBuilder.helperLink().build();
      serviceMock.addHelper = sinon
        .stub(service, "createHelper")
        .rejects(new Error("Error creating helper"));
      await controller.addHelper(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(500);
      expect(body).to.be.deep.equal({
        error: "Internal Server Error",
        errorCode: "CREATE_HELPER_ERROR",
        message: "Error creating helper",
      });
    });
    it("should return 201 if all data is valid", async () => {
      req.user = {
        id: 1,
      };
      req.body = mocks.HelperLinkBuilder.helperLink().build();
      serviceMock.createHelper = sinon
        .stub(service, "createHelper")
        .resolves(req.body);
      await controller.addHelper(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(201);
      expect(body).to.be.deep.equal(req.body);
    });
  });
  describe("deleteHelper", () => {
    it("should return 500 if service throws error", async () => {
      req.params = {
        id: "1",
      };
      serviceMock.deleteHelper = sinon.stub(service, "deleteHelper").rejects();
      await controller.deleteHelper(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(500);
      expect(body).to.be.deep.equal({
        error: "Internal Server Error",
        errorCode: "DELETE_HELPER_ERROR",
        message: "Error",
      });
    });
    it("should return 404 if helper does not exist", async () => {
      req.params = {
        id: "1",
      };
      serviceMock.deleteHelper = sinon
        .stub(service, "deleteHelper")
        .resolves(false);
      await controller.deleteHelper(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(404);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "Helper with the specified id does not exist" }],
      });
    });
    it("should return 200 if helper is deleted", async () => {
      req.params = {
        id: "1",
      };
      serviceMock.deleteHelper = sinon
        .stub(service, "deleteHelper")
        .resolves(true);
      await controller.deleteHelper(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(200);
      expect(body).to.be.deep.equal({
        message: "Helper with ID 1 deleted successfully",
      });
    });
  });
  describe("editHelper", () => {
    it("should return 500 if service throws error", async () => {
      req.params = {
        id: "1",
      };
      req.body = mocks.HelperLinkBuilder.helperLink().build();
      serviceMock.editHelper = sinon
        .stub(service, "updateHelper")
        .rejects(new Error("Error updating helper"));
      await controller.editHelper(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(500);
      expect(body).to.be.deep.equal({
        error: "Internal Server Error",
        errorCode: "EDIT_HELPER_ERROR",
        message: "Error updating helper",
      });
    });
    it("should return 404 if helper does not exist", async () => {
      req.params = {
        id: "1",
      };
      req.body = mocks.HelperLinkBuilder.helperLink().build();
      serviceMock.editHelper = sinon
        .stub(service, "updateHelper")
        .resolves(null);
      await controller.editHelper(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(404);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "Helper with the specified id does not exist" }],
      });
    });
    it("should return 200 if helper is updated", async () => {
      req.params = {
        id: "1",
      };
      req.body = mocks.HelperLinkBuilder.helperLink().build();
      serviceMock.editHelper = sinon
        .stub(service, "updateHelper")
        .resolves(req.body);
      await controller.editHelper(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(200);
      expect(body).to.be.deep.equal(req.body);
    });
  });
  describe("getAllHelpers", () => {
    it("should return 500 if service throws error", async () => {
      serviceMock.getAllHelpers = sinon
        .stub(service, "getAllHelpers")
        .rejects();
      await controller.getAllHelpers(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(500);
      expect(body).to.be.deep.equal({
        error: "Internal Server Error",
        errorCode: "GET_ALL_HELPERS_ERROR",
        message: "Error",
      });
    });
    it("should return 200 if helpers are found", async () => {
      const helpers = mocks.HelperLinkList;
      serviceMock.getAllHelpers = sinon
        .stub(service, "getAllHelpers")
        .resolves(helpers);
      await controller.getAllHelpers(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(200);
      expect(body).to.be.deep.equal(helpers);
    });
  });
  describe("getHelpersByUserId", () => {
    req.user = { id: 1 };
    it("should return 500 if service throws error", async () => {
      serviceMock.getHelpersByUserId = sinon
        .stub(service, "getHelpersByUserId")
        .rejects(new Error("Error retrieving helper by ID"));
      await controller.getHelpersByUserId(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(500);
      expect(body).to.be.deep.equal({
        error: "Internal Server Error",
        errorCode: "GET_HELPERS_ERROR",
        message: "Error retrieving helper by ID",
      });
    });
    it("should return 200 if helpers are found", async () => {
      const helpers = mocks.HelperLinkList.filter((h) => h.createdBy === 1);
      serviceMock.getHelpersByUserId = sinon
        .stub(service, "getHelpersByUserId")
        .resolves(helpers);
      await controller.getHelpersByUserId(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(200);
      expect(body).to.be.deep.equal(helpers);
    });
  });
  describe("getHelperById", () => {
    it("should return 404 if helper does not exist", async () => {
      req.params = {
        id: "1",
      };
      serviceMock.getHelperById = sinon
        .stub(service, "getHelperById")
        .resolves(null);
      await controller.getHelperById(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(404);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "Helper not found" }],
      });
    });
    it("should return 500 if service throws error", async () => {
      req.params = {
        id: "1",
      };
      serviceMock.getHelperById = sinon
        .stub(service, "getHelperById")
        .rejects(new Error("Error retrieving helper by ID"));
      await controller.getHelperById(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(500);
      expect(body).to.be.deep.equal({
        error: "Internal Server Error",
        errorCode: "GET_HELPER_BY_ID_ERROR",
        message: "Error retrieving helper by ID",
      });
    });
    it("should return 200 if helper is found", async () => {
      const helper = mocks.HelperLinkBuilder.helperLink().build();
      req.params = {
        id: "1",
      };
      serviceMock.getHelperById = sinon
        .stub(service, "getHelperById")
        .resolves(helper);
      await controller.getHelperById(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.equal(200);
      expect(body).to.be.deep.equal(helper);
    });
  });
});
