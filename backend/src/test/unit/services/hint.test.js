const { describe, it, afterEach } = require("mocha");
const sinon = require("sinon");
const { expect } = require("chai");
const db = require("../../../models/index.js");
const mocks = require("../../mocks/hint.mock.js");
const hintService = require("../../../service/hint.service.js");

const Hint = db.Hint;
const hint = mocks.HintBuilder.hint;
const hintList = mocks.hintList;

describe("Test hint service", () => {
  const HintMock = {};
  afterEach(sinon.restore);
  it("getAllHints - should return the list of hints", async () => {
    HintMock.findAll = sinon.stub(Hint, "findAll").resolves(hintList);
    const hints = await hintService.getAllHints();
    expect(hints).to.deep.equal(hintList);
    // const params = HintMock.findAll.getCall(0).args[0];
    // expect(params).to.deep.equal({
    //   include: [{ model: db.User, as: "creator" }],
    // });
  });
  it("getAllHints - should throw an error if something goes wrong", async () => {
    HintMock.findAll = sinon
      .stub(Hint, "findAll")
      .rejects(new Error("Something went wrong"));
    try {
      await hintService.getAllHints();
    } catch (error) {
      expect(error.message).to.equal(
        "Error retrieving hints: Something went wrong"
      );
    }
    // const params = HintMock.findAll.getCall(0).args[0];
    // expect(params).to.deep.equal({
    //   include: [{ model: db.User, as: "creator" }],
    // });
  });
  it("getHints - should return the list of hints created by the userId", async () => {
    HintMock.findAll = sinon.stub(Hint, "findAll").resolves(hintList);
    const hints = await hintService.getHints(1);
    expect(hints).to.deep.equal(hintList);
    // const params = HintMock.findAll.getCall(0).args[0];
    // expect(params).to.deep.equal({
    //   where: {
    //     createdBy: 1,
    //   },
    //   include: [{ model: db.User, as: "creator" }],
    // });
  });
  it("getHints - should throw an error if something goes wrong", async () => {
    HintMock.findAll = sinon
      .stub(Hint, "findAll")
      .rejects(new Error("Something went wrong"));
    try {
      await hintService.getHints(1);
    } catch (error) {
      expect(error.message).to.equal(
        "Error retrieving hints: Something went wrong"
      );
    }
    // const params = HintMock.findAll.getCall(0).args[0];
    // expect(params).to.deep.equal({
    //   where: {
    //     createdBy: 1,
    //   },
    //   include: [{ model: db.User, as: "creator" }],
    // });
  });
  it("createHint - should return the created hint", async () => {
    HintMock.create = sinon.stub(Hint, "create").resolves(hint().build());
    const newHint = await hintService.createHint(hint().build());
    expect(newHint).to.deep.equal(hint().build());
    const params = HintMock.create.getCall(0).args[0];
    expect(params).to.deep.equal(hint().build());
  });
  it("createHint - should throw an error if something goes wrong", async () => {
    HintMock.create = sinon
      .stub(Hint, "create")
      .rejects(new Error("Something went wrong"));
    try {
      await hintService.createHint(hint().build());
    } catch (error) {
      expect(error.message).to.equal(
        "Error creating hint: Something went wrong"
      );
    }
    const params = HintMock.create.getCall(0).args[0];
    expect(params).to.deep.equal(hint().build());
  });
  it("deleteHint - should return false if no hint is deleted", async () => {
    HintMock.destroy = sinon.stub(Hint, "destroy").resolves(0);
    const result = await hintService.deleteHint(1);
    expect(result).to.equal(false);
    const params = HintMock.destroy.getCall(0).args[0];
    expect(params).to.deep.equal({ where: { id: 1 } });
  });
  it("deleteHint - should return true if the hint is deleted", async () => {
    HintMock.destroy = sinon.stub(Hint, "destroy").resolves(1);
    const result = await hintService.deleteHint(1);
    expect(result).to.equal(true);
    const params = HintMock.destroy.getCall(0).args[0];
    expect(params).to.deep.equal({ where: { id: 1 } });
  });
  it("deleteHint - should throw an error if something goes wrong", async () => {
    HintMock.destroy = sinon
      .stub(Hint, "destroy")
      .rejects(new Error("Something went wrong"));
    try {
      await hintService.deleteHint(1);
    } catch (error) {
      expect(error.message).to.equal(
        "Error deleting hint: Something went wrong"
      );
    }
    const params = HintMock.destroy.getCall(0).args[0];
    expect(params).to.deep.equal({ where: { id: 1 } });
  });
  it("updateHint - should return null if no hint is updated", async () => {
    HintMock.update = sinon.stub(Hint, "update").resolves([0, []]);
    const updatedHint = await hintService.updateHint(1, hint().build());
    expect(updatedHint).to.equal(null);
    const params = HintMock.update.getCall(0).args;
    expect(params[0]).to.deep.equal(hint().build());
    expect(params[1]).to.deep.equal({ where: { id: 1 }, returning: true });
  });
  it("updateHint - should return the updated hint", async () => {
    HintMock.update = sinon
      .stub(Hint, "update")
      .resolves([1, [hint().build()]]);
    const updatedHint = await hintService.updateHint(1, hint().build());
    expect(updatedHint).to.deep.equal(hint().build());
    const params = HintMock.update.getCall(0).args;
    expect(params[0]).to.deep.equal(hint().build());
    expect(params[1]).to.deep.equal({ where: { id: 1 }, returning: true });
  });
  it("updateHint - should throw an error if something goes wrong", async () => {
    HintMock.update = sinon
      .stub(Hint, "update")
      .rejects(new Error("Something went wrong"));
    try {
      await hintService.updateHint(1, hint().build());
    } catch (error) {
      expect(error.message).to.equal(
        "Error updating hint: Something went wrong"
      );
    }
    const params = HintMock.update.getCall(0).args;
    expect(params[0]).to.deep.equal(hint().build());
    expect(params[1]).to.deep.equal({ where: { id: 1 }, returning: true });
  });
  it("getHintById - should return the found hint", async () => {
    HintMock.findOne = sinon.stub(Hint, "findOne").resolves(hint().build());
    const foundHint = await hintService.getHintById(1);
    expect(foundHint).to.deep.equal(hint().build());
    // const params = HintMock.findOne.getCall(0).args[0];
    // expect(params).to.deep.equal({
    //   where: { id: 1 },
    //   include: [{ model: db.User, as: "creator" }],
    // });
  });
  it("getHintById - should throw an error if the hint is not found", async () => {
    HintMock.findOne = sinon.stub(Hint, "findOne").rejects();
    try {
      await hintService.getHintById(1);
    } catch (error) {
      expect(error.message).to.equal("Error retrieving hint by ID: Error");
    }
    // const params = HintMock.findOne.getCall(0).args[0];
    // expect(params).to.deep.equal({
    //   where: { id: 1 },
    //   include: [{ model: db.User, as: "creator" }],
    // });
  });
});
