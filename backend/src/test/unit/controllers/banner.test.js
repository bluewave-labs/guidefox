const { describe, it, afterEach } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const service = require('../../../service/banner.service');
const { BannerBuilder, validList } = require('../../mocks/banner.mock.js');
const controller = require('../../../controllers/banner.controller.js');

const banner = BannerBuilder.banner;

describe('Test Banner controller', () => {
  const serviceMock = {};
  const req = {};
  const res = {};
  beforeEach(() => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
  });
  afterEach(sinon.restore);
  describe('addBanner', () => {
    req.user = { id: 1 };
    it('should return status 201 and the new banner if everything goes right', async () => {
      req.user = { id: 1 };
      req.body = banner().build();
      serviceMock.createBanner = sinon.stub(service, 'createBanner').returns(banner().build());
      await controller.addBanner(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.be.equal(201);
      expect(body).to.be.deep.equal(banner().build());
    });
    it('should return status 500 if something goes wrong', async () => {
      req.user = { id: 1 };
      serviceMock.createBanner = sinon.stub(service, 'createBanner').rejects();
      req.body = banner().build();
      await controller.addBanner(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.be.equal(500);
      expect(body).to.be.deep.equal({
        error: 'Internal Server Error',
        errorCode: 'CREATE_BANNER_ERROR',
        message: 'Error',
      });
    });
  });
  describe('deleteBanner', () => {
    it('should return status 400 if the service returns false', async () => {
      req.params = { id: '1' };
      serviceMock.deleteBanner = sinon.stub(service, 'deleteBanner').resolves(false);
      await controller.deleteBanner(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({
        errors: [{ msg: 'Banner with the specified id does not exist' }],
      });
    });
    it('should return status 200 if banner is deleted', async () => {
      req.params = { id: '1' };
      serviceMock.deleteBanner = sinon.stub(service, 'deleteBanner').resolves(true);
      await controller.deleteBanner(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.be.equal(200);
      expect(body).to.be.deep.equal({
        message: 'Banner with ID 1 deleted successfully',
      });
    });
    it('should return status 500 if something goes wrong', async () => {
      req.params = { id: '1' };
      serviceMock.deleteBanner = sinon.stub(service, 'deleteBanner').rejects();
      await controller.deleteBanner(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.be.equal(500);
      expect(body).to.be.deep.equal({
        error: 'Internal Server Error',
        errorCode: 'DELETE_BANNER_ERROR',
        message: 'Error',
      });
    });
  });
  describe('editBanner', () => {
    it('should return status 200 and the updated banner if everything goes right', async () => {
      req.body = banner().build();
      serviceMock.updateBanner = sinon.stub(service, 'updateBanner').returns(banner().build());
      await controller.editBanner(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.be.equal(200);
      expect(body).to.be.deep.equal(banner().build());
    });
    it('should return status 500 if something goes wrong', async () => {
      req.body = banner().build();
      serviceMock.updateBanner = sinon.stub(service, 'updateBanner').rejects();
      await controller.editBanner(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.be.equal(500);
      expect(body).to.be.deep.equal({
        error: 'Internal Server Error',
        errorCode: 'EDIT_BANNER_ERROR',
        message: 'Error',
      });
    });
  });
  it('getAllBanners - should return status 200 and all the banners if everything goes right', async () => {
    serviceMock.getAllBanners = sinon.stub(service, 'getAllBanners').returns(validList);
    await controller.getAllBanners(req, res);
    const status = res.status.args[0][0];
    const body = res.json.args[0][0];
    expect(status).to.be.equal(200);
    expect(body).to.be.deep.equal(validList);
  });
  it('getAllBanners - should return status 500 if something goes wrong', async () => {
    serviceMock.getAllBanners = sinon.stub(service, 'getAllBanners').rejects();
    await controller.getAllBanners(req, res);
    const status = res.status.args[0][0];
    const body = res.json.args[0][0];
    expect(status).to.be.equal(500);
    expect(body).to.be.deep.equal({
      error: 'Internal Server Error',
      errorCode: 'GET_ALL_BANNERS_ERROR',
      message: 'Error',
    });
  });
  it('getBanners - should return status 200 and all the banners created by the user if everything goes right', async () => {
    req.user = { id: 1 };
    serviceMock.getBanners = sinon.stub(service, 'getBanners').returns(validList);
    await controller.getBanners(req, res);
    const status = res.status.args[0][0];
    const body = res.json.args[0][0];
    expect(status).to.be.equal(200);
    expect(body).to.be.deep.equal(validList);
  });
  it('getBanners - should return status 500 if something goes wrong', async () => {
    req.user = { id: 1 };
    serviceMock.getBanners = sinon.stub(service, 'getBanners').rejects();
    await controller.getBanners(req, res);
    const status = res.status.args[0][0];
    const body = res.json.args[0][0];
    expect(status).to.be.equal(500);
    expect(body).to.be.deep.equal({
      error: 'Internal Server Error',
      errorCode: 'GET_BANNERS_ERROR',
      message: 'Error',
    });
  });
  describe('getBannerById', () => {
    it('should return status 404 if the service returns null', async () => {
      req.params = { id: '1' };
      serviceMock.getBannerById = sinon.stub(service, 'getBannerById').resolves(null);
      await controller.getBannerById(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.be.equal(404);
      expect(body).to.be.deep.equal({
        errors: [{ msg: 'Banner not found' }],
      });
    });
    it('should return status 200 and the banner if everything goes right', async () => {
      req.params = { id: '1' };
      serviceMock.getBannerById = sinon.stub(service, 'getBannerById').returns(banner().build());
      await controller.getBannerById(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.be.equal(200);
      expect(body).to.be.deep.equal(banner().build());
    });
    it('should return status 500 if something goes wrong', async () => {
      req.params = { id: '1' };
      serviceMock.getBannerById = sinon.stub(service, 'getBannerById').rejects();
      await controller.getBannerById(req, res);
      const status = res.status.args[0][0];
      const body = res.json.args[0][0];
      expect(status).to.be.equal(500);
      expect(body).to.be.deep.equal({
        error: 'Internal Server Error',
        errorCode: 'GET_BANNER_BY_ID_ERROR',
        message: 'Error',
      });
    });
  });
});
