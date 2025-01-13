const { describe, it, afterEach } = require("mocha");
const sinon = require("sinon");
const { expect } = require("chai");
const db = require("../../../models/index.js");
const mocks = require("../../mocks/popup.mock.js");
const popupService = require("../../../service/popup.service.js");

const Popup = db.Popup;
const popup = mocks.PopupBuilder.popup;
const popupList = mocks.popupList;

describe("Test popup service", () => {
  const PopupMock = {};
  afterEach(sinon.restore);
  it("getAllPopups - should return all the popups with the user", async () => {
    PopupMock.findAll = sinon.stub(Popup, "findAll").resolves(popupList);
    const popups = await popupService.getAllPopups();
    expect(popups).to.deep.equal(popupList);
    // const params = PopupMock.findAll.getCall(0).args[0];
    // expect(params).to.be.deep.equal({
    //   include: [{ model: db.User, as: "creator" }],
    // });
    expect(PopupMock.findAll.called).to.be.true;
  });
  it("getPopups - should return only the popups created by the userId", async () => {
    const userId = 2;
    PopupMock.findAll = sinon
      .stub(Popup, "findAll")
      .resolves(popupList.filter((popup) => popup.createdBy === userId));
    const popups = await popupService.getPopups(userId);
    expect(popups).not.to.deep.equal(popupList);
    // const params = PopupMock.findAll.getCall(0).args[0];
    // expect(params).to.be.deep.equal({
    //   where: {
    //     createdBy: userId,
    //   },
    //   include: [{ model: db.User, as: "creator" }],
    // });
    expect(PopupMock.findAll.called).to.be.true;
  });
  it("createPopup - should return the created popup", async () => {
    const newPopup = popup().build();
    PopupMock.create = sinon.stub(Popup, "create").resolves(newPopup);
    const createdPopup = await popupService.createPopup(newPopup);
    expect(createdPopup).to.deep.equal(newPopup);
    const params = PopupMock.create.getCall(0).args[0];
    expect(params).to.be.deep.equal(newPopup);
    expect(PopupMock.create.called).to.be.true;
  });
  it("deletePopup - should return false if no popup is deleted", async () => {
    const popupId = 1;
    PopupMock.destroy = sinon.stub(Popup, "destroy").resolves(0);
    const isDeleted = await popupService.deletePopup(popupId);
    expect(isDeleted).to.be.false;
    const params = PopupMock.destroy.getCall(0).args[0];
    expect(params).to.be.deep.equal({ where: { id: popupId } });
    expect(PopupMock.destroy.called).to.be.true;
  });
  it("deletePopup - should return true if the popup is deleted", async () => {
    const popupId = 1;
    PopupMock.destroy = sinon.stub(Popup, "destroy").resolves(1);
    const isDeleted = await popupService.deletePopup(popupId);
    expect(isDeleted).to.be.true;
    const params = PopupMock.destroy.getCall(0).args[0];
    expect(params).to.be.deep.equal({ where: { id: popupId } });
    expect(PopupMock.destroy.called).to.be.true;
  });
  it("updatePopup - should return null if no popup is updated", async () => {
    const popupId = 1;
    PopupMock.update = sinon.stub(Popup, "update").resolves([0, []]);
    const popupData = { header: "new header" };
    const updatedPopupResult = await popupService.updatePopup(
      popupId,
      popupData
    );
    expect(updatedPopupResult).to.be.null;
    const params = PopupMock.update.getCall(0).args;
    expect(params[0]).to.be.deep.equal(popupData);
    expect(params[1]).to.be.deep.equal({
      where: { id: popupId },
      returning: true,
    });
    expect(PopupMock.update.called).to.be.true;
  });
  it("updatePopup - should return the updated popup", async () => {
    const popupId = 1;
    const updatedPopup = popup(popupId).build();
    PopupMock.update = sinon
      .stub(Popup, "update")
      .resolves([1, [updatedPopup]]);
    const popupData = { header: "new header" };
    const updatedPopupResult = await popupService.updatePopup(
      popupId,
      popupData
    );
    expect(updatedPopupResult).to.be.deep.equal(updatedPopup);
    const params = PopupMock.update.getCall(0).args;
    expect(params[0]).to.be.deep.equal(popupData);
    expect(params[1]).to.be.deep.equal({
      where: { id: popupId },
      returning: true,
    });
    expect(PopupMock.update.called).to.be.true;
  });
  it("getPopupById - should return the found popup", async () => {
    const popupId = 1;
    const foundPopup = popup(popupId).build();
    PopupMock.findOne = sinon.stub(Popup, "findOne").resolves(foundPopup);
    const popupResult = await popupService.getPopupById(popupId);
    expect(popupResult).to.be.deep.equal(foundPopup);
    // const params = PopupMock.findOne.getCall(0).args[0];
    // expect(params).to.be.deep.equal({
    //   where: { id: popupId },
    //   include: [{ model: db.User, as: "creator" }],
    // });
    expect(PopupMock.findOne.called).to.be.true;
  });
  it("getPopupById - should throw an error if the popup is not found", async () => {
    const popupId = 1;
    PopupMock.findOne = sinon.stub(Popup, "findOne").rejects();
    try {
      await popupService.getPopupById(popupId);
    } catch (error) {
      expect(error.message).to.be.equal("Error retrieving popup by ID");
    }
    // const params = PopupMock.findOne.getCall(0).args[0];
    // expect(params).to.be.deep.equal({
    //   where: { id: popupId },
    //   include: [{ model: db.User, as: "creator" }],
    // });
    expect(PopupMock.findOne.called).to.be.true;
  });
});
