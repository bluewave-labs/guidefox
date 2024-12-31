const { describe, it, beforeEach, afterEach } = require("mocha");
const sinon = require("sinon");
const { expect } = require("chai");
const mocks = require("../../mocks/popup.mock.js");
const popupService = require("../../../service/popup.service.js");
const popupController = require("../../../controllers/popup.controller.js");

const popup = mocks.PopupBuilder.popup;
const popupList = mocks.popupList;

describe("Test popup controller", () => {
  const serviceMock = {};
  const req = {};
  const res = {};
  describe("addPopup", () => {
    beforeEach(() => {
      req.user = { id: "123" };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
    });
    afterEach(sinon.restore);
    it("should return 400 if popupSize is not provided", async () => {
      req.body = popup().missingPopupSize().build();
      await popupController.addPopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "popupSize and closeButtonAction are required" }],
      });
    });
    it("should return 400 if closeButtonAction is not provided", async () => {
      req.body = popup().missingCloseButtonAction().build();
      await popupController.addPopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "popupSize and closeButtonAction are required" }],
      });
    });
    it("should return 400 if popupSize is invalid", async () => {
      req.body = popup().invalidPopupSize().build();
      await popupController.addPopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "Invalid value for popupSize or closeButtonAction" }],
      });
    });
    it("should return 400 if closeButtonAction is invalid", async () => {
      req.body = popup().invalidCloseButtonAction().build();
      await popupController.addPopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "Invalid value for popupSize or closeButtonAction" }],
      });
    });
    it("should return 400 if headerBackgroundColor is invalid", async () => {
      req.body = popup().invalidHeaderBackgroundColor().build();
      await popupController.addPopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({
        errors: [
          { msg: "headerBackgroundColor must be a valid hex color code" },
        ],
      });
    });
    it("should return 400 if headerColor is invalid", async () => {
      req.body = popup().invalidHeaderColor().build();
      await popupController.addPopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "headerColor must be a valid hex color code" }],
      });
    });
    it("should return 400 if textColor is invalid", async () => {
      req.body = popup().invalidTextColor().build();
      await popupController.addPopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "textColor must be a valid hex color code" }],
      });
    });
    it("should return 400 if buttonBackgroundColor is invalid", async () => {
      req.body = popup().invalidButtonBackgroundColor().build();
      await popupController.addPopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({
        errors: [
          { msg: "buttonBackgroundColor must be a valid hex color code" },
        ],
      });
    });
    it("should return 400 if buttonTextColor is invalid", async () => {
      req.body = popup().invalidButtonTextColor().build();
      await popupController.addPopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "buttonTextColor must be a valid hex color code" }],
      });
    });
    it("should return 201 if popup is created", async () => {
      req.body = popup().build();
      serviceMock.createPopup = sinon
        .stub(popupService, "createPopup")
        .resolves(popup().build());
      await popupController.addPopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(201);
      expect(body).to.be.deep.equal(popup().build());
      expect(serviceMock.createPopup.getCall(0).args[0]).to.be.deep.equal({
        ...req.body,
        createdBy: req.user.id,
      });
    });
    it("should return 500 if popup creation fails", async () => {
      req.body = popup().build();
      serviceMock.createPopup = sinon
        .stub(popupService, "createPopup")
        .rejects(new Error("Internal server error"));
      await popupController.addPopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(500);
      expect(body).to.be.deep.equal({
        error: "Internal Server Error",
        errorCode: "CREATE_POPUP_ERROR",
        message: "Internal server error",
      });
    });
  });
  describe("deletePopup", () => {
    beforeEach(() => {
      req.user = { id: "123" };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
    });
    afterEach(sinon.restore);
    it("should return 400 if id is not provided", async () => {
      req.params = {};
      await popupController.deletePopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "Invalid id" }],
      });
    });
    it("should return 400 if id is invalid", async () => {
      req.params = { id: "invalid" };
      await popupController.deletePopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "Invalid id" }],
      });
    });
    it("should return 400 if popup is not found", async () => {
      req.params = { id: "123" };
      serviceMock.deletePopup = sinon
        .stub(popupService, "deletePopup")
        .resolves(null);
      await popupController.deletePopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "Popup with the specified id does not exist" }],
      });
    });
    it("should return 200 if popup is deleted", async () => {
      req.params = { id: "123" };
      serviceMock.deletePopup = sinon
        .stub(popupService, "deletePopup")
        .resolves(popup().build());
      await popupController.deletePopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(200);
      expect(body).to.be.deep.equal({
        message: "Popup with ID 123 deleted successfully",
      });
      expect(serviceMock.deletePopup.getCall(0).args[0]).to.be.equal("123");
    });
    it("should return 500 if popup deletion fails", async () => {
      req.params = { id: "123" };
      serviceMock.deletePopup = sinon
        .stub(popupService, "deletePopup")
        .rejects(new Error("Internal server error"));
      await popupController.deletePopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(500);
      expect(body).to.be.deep.equal({
        error: "Internal Server Error",
        errorCode: "DELETE_POPUP_ERROR",
        message: "Internal server error",
      });
    });
  });
  describe("editPopup", () => {
    beforeEach(() => {
      req.user = { id: "123" };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
    });
    afterEach(sinon.restore);
    it("should return 400 if popupSize is not provided", async () => {
      req.params = { id: "123" };
      req.body = popup().missingPopupSize().build();
      await popupController.editPopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "popupSize and closeButtonAction are required" }],
      });
    });
    it("should return 400 if closeButtonAction is not provided", async () => {
      req.params = { id: "123" };
      req.body = popup().missingCloseButtonAction().build();
      await popupController.editPopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "popupSize and closeButtonAction are required" }],
      });
    });
    it("should return 400 if popupSize is invalid", async () => {
      req.params = { id: "123" };
      req.body = popup().invalidPopupSize().build();
      await popupController.editPopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "Invalid value for popupSize" }],
      });
    });
    it("should return 400 if closeButtonAction is invalid", async () => {
      req.params = { id: "123" };
      req.body = popup().invalidCloseButtonAction().build();
      await popupController.editPopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "Invalid value for closeButtonAction" }],
      });
    });
    it("should return 400 if headerBackgroundColor is invalid", async () => {
      req.params = { id: "123" };
      req.body = popup().invalidHeaderBackgroundColor().build();
      await popupController.editPopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({
        errors: [
          { msg: "headerBackgroundColor must be a valid hex color code" },
        ],
      });
    });
    it("should return 400 if headerColor is invalid", async () => {
      req.params = { id: "123" };
      req.body = popup().invalidHeaderColor().build();
      await popupController.editPopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "headerColor must be a valid hex color code" }],
      });
    });
    it("should return 400 if textColor is invalid", async () => {
      req.params = { id: "123" };
      req.body = popup().invalidTextColor().build();
      await popupController.editPopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "textColor must be a valid hex color code" }],
      });
    });
    it("should return 400 if buttonBackgroundColor is invalid", async () => {
      req.params = { id: "123" };
      req.body = popup().invalidButtonBackgroundColor().build();
      await popupController.editPopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({
        errors: [
          { msg: "buttonBackgroundColor must be a valid hex color code" },
        ],
      });
    });
    it("should return 400 if buttonTextColor is invalid", async () => {
      req.params = { id: "123" };
      req.body = popup().invalidButtonTextColor().build();
      await popupController.editPopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "buttonTextColor must be a valid hex color code" }],
      });
    });
    it("should return 200 if popup is updated", async () => {
      req.body = popup().build();
      req.params = { id: "123" };
      serviceMock.updatePopup = sinon
        .stub(popupService, "updatePopup")
        .resolves(popup().build());
      await popupController.editPopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(200);
      expect(body).to.be.deep.equal(popup().build());
      expect(serviceMock.updatePopup.getCall(0).args).to.be.deep.equal([
        "123",
        req.body,
      ]);
    });
    it("should return 500 if popup update fails", async () => {
      req.body = popup().build();
      req.params = { id: "123" };
      serviceMock.updatePopup = sinon
        .stub(popupService, "updatePopup")
        .rejects(new Error("Internal server error"));
      await popupController.editPopup(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(500);
      expect(body).to.be.deep.equal({
        error: "Internal Server Error",
        errorCode: "EDIT_POPUP_ERROR",
        message: "Internal server error",
      });
    });
  });
  describe("getAllPopups", () => {
    beforeEach(() => {
      req.user = { id: "123" };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
    });
    afterEach(sinon.restore);
    it("should return 200 if popups are found", async () => {
      serviceMock.getAllPopups = sinon
        .stub(popupService, "getAllPopups")
        .resolves(popupList);
      await popupController.getAllPopups(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(200);
      expect(body).to.be.deep.equal(popupList);
    });
    it("should return 500 if popups retrieval fails", async () => {
      serviceMock.getAllPopups = sinon
        .stub(popupService, "getAllPopups")
        .rejects(new Error("Internal server error"));
      await popupController.getAllPopups(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(500);
      expect(body).to.be.deep.equal({
        error: "Internal Server Error",
        errorCode: "GET_ALL_POPUPS_ERROR",
        message: "Internal server error",
      });
    });
  });
  describe("getPopups", () => {
    beforeEach(() => {
      req.user = { id: "123" };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
    });
    afterEach(sinon.restore);
    it("should return 200 if popups are found", async () => {
      serviceMock.getPopups = sinon
        .stub(popupService, "getPopups")
        .resolves(popupList);
      await popupController.getPopups(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(200);
      expect(body).to.be.deep.equal(popupList);
    });
    it("should return 500 if popups retrieval fails", async () => {
      serviceMock.getPopups = sinon
        .stub(popupService, "getPopups")
        .rejects(new Error("Internal server error"));
      await popupController.getPopups(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(500);
      expect(body).to.be.deep.equal({
        error: "Internal Server Error",
        errorCode: "GET_POPUPS_ERROR",
        message: "Internal server error",
      });
    });
  });
  describe("getPopupById", () => {
    beforeEach(() => {
      req.user = { id: "123" };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
    });
    afterEach(sinon.restore);
    it("should return 400 if id is not provided", async () => {
      req.params = {};
      await popupController.getPopupById(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "Invalid popup ID" }],
      });
    });
    it("should return 400 if id is invalid", async () => {
      req.params = { id: "invalid" };
      await popupController.getPopupById(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "Invalid popup ID" }],
      });
    });
    it("should return 404 if popup is not found", async () => {
      req.params = { id: "123" };
      serviceMock.getPopupById = sinon
        .stub(popupService, "getPopupById")
        .resolves(null);
      await popupController.getPopupById(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(404);
      expect(body).to.be.deep.equal({
        errors: [{ msg: "Popup not found" }],
      });
    });
    it("should return 200 if popup is found", async () => {
      req.params = { id: "123" };
      serviceMock.getPopupById = sinon
        .stub(popupService, "getPopupById")
        .resolves(popup().build());
      await popupController.getPopupById(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(200);
      expect(body).to.be.deep.equal(popup().build());
    });
    it("should return 500 if popup retrieval fails", async () => {
      req.params = { id: "123" };
      serviceMock.getPopupById = sinon
        .stub(popupService, "getPopupById")
        .rejects(new Error("Internal server error"));
      await popupController.getPopupById(req, res);
      const status = res.status.getCall(0).args[0];
      const body = res.json.getCall(0).args[0];
      expect(status).to.be.equal(500);
      expect(body).to.be.deep.equal({
        error: "Internal Server Error",
        errorCode: "GET_POPUP_BY_ID_ERROR",
        message: "Internal server error",
      });
    });
  });
});
