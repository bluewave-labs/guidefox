const { describe, it, afterEach } = require("mocha");
const { expect } = require("chai");
const sinon = require("sinon");
const db = require("../../../models/index.js");
const service = require("../../../service/banner.service");
const { BannerBuilder, validList } = require("../../mocks/banner.mock.js");

const Banner = db.Banner;
const banner = BannerBuilder.banner;

describe("Test Banner service", () => {
  const BannerMock = {};
  afterEach(sinon.restore);
  it("getAllBanners - should return all the banners", async () => {
    BannerMock.findAll = sinon.stub(Banner, "findAll").resolves(validList);
    const result = await service.getAllBanners();
    expect(result).to.be.deep.equal(validList);
    // const params = BannerMock.findAll.args[0][0];
    // expect(params).to.be.deep.equal({
    //   include: [{ model: db.User, as: "creator" }],
    // });
  });
  it("getBanners - should return the banners created by the userId", async () => {
    BannerMock.findAll = sinon
      .stub(Banner, "findAll")
      .resolves(validList.filter((it) => it.createdBy === 2));
    const result = await service.getBanners(2);
    expect(result).not.to.be.deep.equal(validList);
    const params = BannerMock.findAll.args[0][0];
    expect(params).to.be.deep.equal({
      where: {
        createdBy: 2,
      },
      // include: [{ model: db.User, as: "creator" }],
    });
  });
  it("createBanner - should return the created banner", async () => {
    BannerMock.create = sinon.stub(Banner, "create").resolves(banner().build());
    const result = await service.createBanner({ bannerText: "hello world" });
    expect(result).to.be.deep.equal(banner().build());
    const params = BannerMock.create.args[0][0];
    expect(params).to.be.deep.equal({ bannerText: "hello world" });
  });
  it("deleteBanner - should return true if the banner is deleted", async () => {
    BannerMock.destroy = sinon.stub(Banner, "destroy").resolves(1);
    const result = await service.deleteBanner(1);
    expect(result).to.be.true;
    const params = BannerMock.destroy.args[0][0];
    expect(params).to.be.deep.equal({ where: { id: 1 } });
  });
  it("deleteBanner - should return false if the banner is not deleted", async () => {
    BannerMock.destroy = sinon.stub(Banner, "destroy").resolves(0);
    const result = await service.deleteBanner(1);
    expect(result).to.be.false;
    const params = BannerMock.destroy.args[0][0];
    expect(params).to.be.deep.equal({ where: { id: 1 } });
  });
  it("updateBanner - should return null if no banners are updated", async () => {
    BannerMock.update = sinon.stub(Banner, "update").resolves([0, [null]]);
    const data = { bannerText: "hello world" };
    const result = await service.updateBanner(1, data);
    expect(result).to.be.null;
    const params = BannerMock.update.args[0];
    expect(params).to.be.deep.equal([
      data,
      { where: { id: 1 }, returning: true },
    ]);
  });
  it("updateBanner - should return the updated banner", async () => {
    BannerMock.update = sinon
      .stub(Banner, "update")
      .resolves([1, [banner().build()]]);
    const data = { bannerText: "hello world" };
    const result = await service.updateBanner(1, data);
    expect(result).to.be.deep.equal(banner().build());
    const params = BannerMock.update.args[0];
    expect(params).to.be.deep.equal([
      data,
      {
        where: { id: 1 },
        returning: true,
      },
    ]);
  });
  it("getBannerById - should return the found banner", async () => {
    BannerMock.findOne = sinon
      .stub(Banner, "findOne")
      .resolves(banner().build());
    const result = await service.getBannerById(1);
    expect(result).to.be.deep.equal(banner().build());
    const params = BannerMock.findOne.args[0][0];
    expect(params).to.be.deep.equal({
      where: { id: 1 },
    });
  });
  it("getBannerById - if something goes wrong, should throw an error", async () => {
    BannerMock.findOne = sinon.stub(Banner, "findOne").rejects();
    try {
      await service.getBannerById(1);
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
      expect(error.message).to.be.equal("Error retrieving banner by ID");
    }
  });
});
