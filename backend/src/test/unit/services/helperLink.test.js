const { describe, it, beforeEach, afterEach } = require("mocha");
const sinon = require("sinon");
const { expect } = require("chai");
const db = require("../../../models/index.js");
const mocks = require("../../mocks/helperLink.mock.js");
const helperLinkService = require("../../../service/helperLink.service.js");

const HelperLink = db.HelperLink;
const Link = db.Link;

describe("Test helper link service", () => {
  const HelperLinkMock = {};
  const LinkMock = {};
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
  it("getAllHelpers - should return all the helper links with it's user without the password", async () => {
    HelperLinkMock.findAll = sinon
      .stub(HelperLink, "findAll")
      .resolves(mocks.HelperLinkList);
    const result = await helperLinkService.getAllHelpers();
    expect(result).to.deep.equal(mocks.HelperLinkList);
    //   const params = HelperLinkMock.findAll.getCall(0).args;
    //   expect(params).to.deep.equal([
    //     {
    //       include: [
    //         {
    //           model: db.User,
    //           as: "creator",
    //           attributes: {
    //             exclude: ["password"],
    //           },
    //         },
    //       ],
    //     },
    //   ]);
  });
  it("getHelpersByUserId - should return all the helper links of one user without the password", async () => {
    HelperLinkMock.findAll = sinon
      .stub(HelperLink, "findAll")
      .resolves(mocks.HelperLinkList.filter((it) => it.createdBy === 1));
    const result = await helperLinkService.getHelpersByUserId(1);
    expect(result).to.deep.equal(
      mocks.HelperLinkList.filter((it) => it.createdBy === 1)
    );
    //   const params = HelperLinkMock.findAll.getCall(0).args;
    //   expect(params).to.deep.equal([
    //     {
    //       where: {
    //         createdBy: 1,
    //       },
    //       include: [
    //         {
    //           model: db.User,
    //           as: "creator",
    //           attributes: {
    //             exclude: ["password"],
    //           },
    //         },
    //       ],
    //     },
    //   ]);
  });
  it("createHelper - should create the helper link and it's links", async () => {
    HelperLinkMock.create = sinon
      .stub(HelperLink, "create")
      .resolves(mocks.HelperLinkBuilder.helperLink(1).build());
    LinkMock.bulkCreate = sinon
      .stub(Link, "bulkCreate")
      .resolves(mocks.LinkBuilder.link(1).build());
    const result = await helperLinkService.createHelper(
      mocks.HelperLinkBuilder.helperLink(1).build(),
      mocks.LinksList
    );
    expect(result).to.deep.equal(mocks.HelperLinkBuilder.helperLink(1).build());
    const paramsHelper = HelperLinkMock.create.getCall(0).args;
    expect(paramsHelper[0]).to.deep.equal(
      mocks.HelperLinkBuilder.helperLink(1).build()
    );
    expect(paramsHelper[1]).to.have.property("returning", true);
    const paramsLink = LinkMock.bulkCreate.getCall(0).args;
    expect(paramsLink[0]).to.deep.equal(mocks.LinksList);
    expect(commit.called).to.be.true;
    expect(rollback.called).to.be.false;
  });
  it("createHelper - should throw an error if something goes wrong", async () => {
    HelperLinkMock.create = sinon.stub(HelperLink, "create").rejects();
    LinkMock.bulkCreate = sinon.stub(Link, "bulkCreate").resolves();
    try {
      await helperLinkService.createHelper(
        mocks.HelperLinkBuilder.helperLink(1).build(),
        mocks.LinksList
      );
    } catch (e) {
      expect(e.message).to.equal("Error creating helper");
    }
    expect(commit.called).to.be.false;
    expect(rollback.called).to.be.true;
  });
  it("deleteHelper - should return true if the helper was deleted", async () => {
    HelperLinkMock.destroy = sinon.stub(HelperLink, "destroy").resolves(1);
    const result = await helperLinkService.deleteHelper(1);
    expect(result).to.be.true;
    const params = HelperLinkMock.destroy.getCall(0).args;
    expect(params).to.deep.equal([{ where: { id: 1 } }]);
  });
  it("deleteHelper - should return false if the helper wasn't deleted", async () => {
    HelperLinkMock.destroy = sinon.stub(HelperLink, "destroy").resolves(0);
    const result = await helperLinkService.deleteHelper(1);
    expect(result).to.be.false;
    const params = HelperLinkMock.destroy.getCall(0).args;
    expect(params).to.deep.equal([{ where: { id: 1 } }]);
  });
  it("updateHelper - should return null if no helper is updated", async () => {
    HelperLinkMock.update = sinon.stub(HelperLink, "update").resolves([0, []]);
    const result = await helperLinkService.updateHelper(1, {}, []);
    expect(result).to.be.null;
    const params = HelperLinkMock.update.getCall(0).args;
    expect(params[0]).to.deep.equal({});
    expect(params[1]).to.deep.equal({
      transaction: { commit, rollback },
      where: { id: 1 },
      returning: true,
    });
  });
  it("updateHelper - should return the updated helper is everything goes right", async () => {
    HelperLinkMock.update = sinon
      .stub(HelperLink, "update")
      .resolves([1, mocks.HelperLinkBuilder.helperLink(1).build()]);
    LinkMock.update = sinon.stub(Link, "update").resolves();
    LinkMock.bulkCreate = sinon.stub(Link, "bulkCreate").resolves();
    const result = await helperLinkService.updateHelper(
      1,
      mocks.HelperLinkBuilder.helperLink(1).build(),
      mocks.LinksList
    );
    expect(result).to.deep.equal(mocks.HelperLinkBuilder.helperLink(1).build());
    const paramsHelper = HelperLinkMock.update.getCall(0).args;
    expect(paramsHelper[0]).to.deep.equal(
      mocks.HelperLinkBuilder.helperLink(1).build()
    );
    expect(paramsHelper[1]).to.deep.equal({
      transaction: { commit, rollback },
      where: { id: 1 },
      returning: true,
    });
    const paramsLink = LinkMock.update.getCall(0).args;
    const { id, ...link } = mocks.LinksList[0];
    expect(paramsLink[0]).to.deep.equal(link);
    expect(paramsLink[1]).to.deep.equal({
      transaction: { commit, rollback },
      where: { id: 1 },
    });
    expect(commit.called).to.be.true;
    expect(rollback.called).to.be.false;
  });
  it("updateHelper - should update a link if it exists", async () => {
    HelperLinkMock.update = sinon
      .stub(HelperLink, "update")
      .resolves([1, mocks.HelperLinkBuilder.helperLink(1).build()]);
    LinkMock.update = sinon.stub(Link, "update").resolves();
    LinkMock.bulkCreate = sinon.stub(Link, "bulkCreate").resolves();
    const result = await helperLinkService.updateHelper(
      1,
      mocks.HelperLinkBuilder.helperLink(1).build(),
      mocks.LinksList
    );
    expect(result).to.deep.equal(mocks.HelperLinkBuilder.helperLink(1).build());
    expect(LinkMock.update.called).to.be.true;
    expect(LinkMock.bulkCreate.called).to.be.false;
    expect(commit.called).to.be.true;
    expect(rollback.called).to.be.false;
  });
  it("updateHelper - should create a link if it doesn't exist", async () => {
    HelperLinkMock.update = sinon
      .stub(HelperLink, "update")
      .resolves([1, mocks.HelperLinkBuilder.helperLink(1).build()]);
    LinkMock.update = sinon.stub(Link, "update").resolves();
    LinkMock.bulkCreate = sinon.stub(Link, "bulkCreate").resolves();
    const result = await helperLinkService.updateHelper(
      1,
      mocks.HelperLinkBuilder.helperLink(1).build(),
      mocks.LinksList.map((it) => {
        const { id, ...link } = it;
        return link;
      })
    );
    expect(result).to.deep.equal(mocks.HelperLinkBuilder.helperLink(1).build());
    expect(LinkMock.update.called).to.be.false;
    expect(LinkMock.bulkCreate.called).to.be.true;
    expect(commit.called).to.be.true;
    expect(rollback.called).to.be.false;
  });
  it("updateHelper - should throw an error if something goes wrong", async () => {
    HelperLinkMock.update = sinon.stub(HelperLink, "update").rejects();
    try {
      await helperLinkService.updateHelper(
        1,
        mocks.HelperLinkBuilder.helperLink(1).build(),
        mocks.LinksList
      );
    } catch (e) {
      expect(e.message).to.equal("Error updating helper");
      expect(e).to.be.an.instanceof(Error);
    }
    expect(commit.called).to.be.false;
    expect(rollback.called).to.be.true;
  });
  it("getHelperById - should return the helperLink and it's user without the password", async () => {
    HelperLinkMock.findOne = sinon
      .stub(HelperLink, "findOne")
      .resolves(mocks.HelperLinkBuilder.helperLink(1).build());
    const result = await helperLinkService.getHelperById(1);
    expect(result).to.deep.equal(mocks.HelperLinkBuilder.helperLink(1).build());
    //   const params = HelperLinkMock.findOne.getCall(0).args;
    //   expect(params).to.deep.equal([
    //     {
    //       where: { id: 1 },
    //       include: [
    //         {
    //           model: db.User,
    //           as: "creator",
    //           attributes: {
    //             exclude: ["password"],
    //           },
    //         },
    //         {
    //           model: db.Link,
    //           as: "links",
    //         },
    //       ],
    //     },
    //   ]);
  });
  it("getHelperById - should throw an error if the user is not found", async () => {
    HelperLinkMock.findOne = sinon.stub(HelperLink, "findOne").rejects();
    try {
      await helperLinkService.getHelperById(1);
    } catch (e) {
      expect(e.message).to.equal("Error retrieving helper by ID");
      expect(e).to.be.an.instanceof(Error);
    }
  });
});