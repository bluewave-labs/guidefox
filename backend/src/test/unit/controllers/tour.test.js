const { describe, it, beforeEach, afterEach } = require('mocha');
const sinon = require('sinon');
const { expect } = require('chai');
const mocks = require('../../mocks/tour.mock.js');
const tourService = require('../../../service/tour.service.js');
const tourController = require('../../../controllers/tour.controller.js');

const tour = mocks.TourBuilder.tour;

describe('Test tour controller', () => {
  const serviceMock = {};
  const req = {};
  const res = {};
  describe('createTour', () => {
    beforeEach(() => {
      req.user = { id: '123' };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
    });
    afterEach(sinon.restore);
    it('should return 201 if all required fields are provided', async () => {
      req.body = tour().build();
      serviceMock.createTour = sinon.stub(tourService, 'createTour').resolves(tour().build());
      await tourController.createTour(req, res);
      const status = res.status.getCall(0).args[0];
      expect(status).to.be.equal(201);
      const body = res.json.getCall(0).args[0];
      expect(body).to.be.deep.equal(tour().build());
    });
    it('should return 500 if an error occurs', async () => {
      req.body = tour().build();
      serviceMock.createTour = sinon.stub(tourService, 'createTour').rejects(new Error('error'));
      await tourController.createTour(req, res);
      const status = res.status.getCall(0).args[0];
      expect(status).to.be.equal(500);
      const body = res.json.getCall(0).args[0];
      expect(body).to.be.deep.equal({
        error: 'Internal Server Error',
        errorCode: 'CREATE_TOUR_ERROR',
        message: 'error',
      });
    });
  });
  describe('deleteTour', () => {
    beforeEach(() => {
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
    });
    afterEach(sinon.restore);
    it('should return 404 if tour is not found', async () => {
      req.params = { id: '123' };
      serviceMock.deleteTour = sinon.stub(tourService, 'deleteTour').resolves(null);
      await tourController.deleteTour(req, res);
      const status = res.status.getCall(0).args[0];
      expect(status).to.be.equal(404);
      const body = res.json.getCall(0).args[0];
      expect(body).to.be.deep.equal({ errors: [{"msg": "Tour with the specified id does not exist"}] });
    });
    it('should return 200 if tour is found', async () => {
      req.params = { id: '123' };
      serviceMock.deleteTour = sinon.stub(tourService, 'deleteTour').resolves(tour().build());
      await tourController.deleteTour(req, res);
      const status = res.status.getCall(0).args[0];
      expect(status).to.be.equal(200);
      const body = res.json.getCall(0).args[0];
      expect(body).to.be.deep.equal({ "message": "Tour deleted successfully" });
    });
    it('should return 500 if an error occurs', async () => {
      req.params = { id: '123' };
      serviceMock.deleteTour = sinon.stub(tourService, 'deleteTour').rejects(new Error('error'));
      await tourController.deleteTour(req, res);
      const status = res.status.getCall(0).args[0];
      expect(status).to.be.equal(500);
      const body = res.json.getCall(0).args[0];
      expect(body).to.be.deep.equal({
        error: 'Internal Server Error',
        errorCode: 'DELETE_TOUR_ERROR',
        message: 'error',
      });
    });
  });
  describe('updateTour', () => {
    beforeEach(() => {
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
    });
    afterEach(sinon.restore);
    it('should return 200 if all required fields are provided', async () => {
      req.body = tour().build();
      serviceMock.updateTour = sinon.stub(tourService, 'updateTour').resolves(tour().build());
      await tourController.updateTour(req, res);
      const status = res.status.getCall(0).args[0];
      expect(status).to.be.equal(200);
      const body = res.json.getCall(0).args[0];
      expect(body).to.be.deep.equal(tour().build());
    });
    it('should return 404 if tour is not found', async () => {
      req.body = tour().build();
      serviceMock.updateTour = sinon.stub(tourService, 'updateTour').resolves(null);
      await tourController.updateTour(req, res);
      const status = res.status.getCall(0).args[0];
      expect(status).to.be.equal(404);
      const body = res.json.getCall(0).args[0];
      expect(body).to.be.deep.equal({ errors: [{  "msg": "Tour with the specified id does not exist" }] });
    });
    it('should return 500 if an error occurs', async () => {
      req.body = tour().build();
      serviceMock.updateTour = sinon.stub(tourService, 'updateTour').rejects(new Error('error'));
      await tourController.updateTour(req, res);
      const status = res.status.getCall(0).args[0];
      expect(status).to.be.equal(500);
      const body = res.json.getCall(0).args[0];
      expect(body).to.be.deep.equal({
        error: 'Internal Server Error',
        errorCode: 'UPDATE_TOUR_ERROR',
        message: 'error',
      });
    });
  });
  describe('getAllTours', () => {
    beforeEach(() => {
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
    });
    afterEach(sinon.restore);
    it('should return 200 if tours are found', async () => {
      serviceMock.getAllTours = sinon.stub(tourService, 'getAllTours').resolves(mocks.toursList);
      await tourController.getAllTours(req, res);
      const status = res.status.getCall(0).args[0];
      expect(status).to.be.equal(200);
      const body = res.json.getCall(0).args[0];
      expect(body).to.be.deep.equal(mocks.toursList);
    });
    it('should return 500 if an error occurs', async () => {
      serviceMock.getAllTours = sinon.stub(tourService, 'getAllTours').rejects(new Error('error'));
      await tourController.getAllTours(req, res);
      const status = res.status.getCall(0).args[0];
      expect(status).to.be.equal(500);
      const body = res.json.getCall(0).args[0];
      expect(body).to.be.deep.equal({
        error: 'Internal Server Error',
        errorCode: 'GET_TOUR_ERROR',
        message: 'error',
      });
    });
  });
  describe('getToursByUserId', () => {
    beforeEach(() => {
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
    });
    afterEach(sinon.restore);
    it('should return 200 if tours are found', async () => {
      req.user = { id: '123' };
      serviceMock.getTourByUserId = sinon.stub(tourService, 'getTourByUserId').resolves(mocks.toursList);
      await tourController.getToursByUserId(req, res);
      const status = res.status.getCall(0).args[0];
      expect(status).to.be.equal(200);
      const body = res.json.getCall(0).args[0];
      expect(body).to.be.deep.equal(mocks.toursList);
    });
    it('should return 500 if an error occurs', async () => {
      req.user = { id: '123' };
      serviceMock.getTourByUserId = sinon.stub(tourService, 'getTourByUserId').rejects(new Error('error'));
      await tourController.getToursByUserId(req, res);
      const status = res.status.getCall(0).args[0];
      expect(status).to.be.equal(500);
      const body = res.json.getCall(0).args[0];
      expect(body).to.be.deep.equal({
        error: 'Internal Server Error',
        errorCode: 'GET_TOUR_BY_USER_ID_ERROR',
        message: 'error',
      });
    });
  });
  describe('getTourById', () => {
    beforeEach(() => {
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
    });
    afterEach(sinon.restore);
    it('should return 404 if tour is not found', async () => {
      req.params = { id: '123' };
      serviceMock.getTourById = sinon.stub(tourService, 'getTourById').resolves(null);
      await tourController.getTourById(req, res);
      const status = res.status.getCall(0).args[0];
      expect(status).to.be.equal(404);
      const body = res.json.getCall(0).args[0];
      expect(body).to.be.deep.equal({ errors: [{ msg: 'Tour with the specified id does not exist' }] });
    });
    it('should return 200 if tour is found', async () => {
      req.params = { id: '123' };
      serviceMock.getTourById = sinon.stub(tourService, 'getTourById').resolves(tour().build());
      await tourController.getTourById(req, res);
      const status = res.status.getCall(0).args[0];
      expect(status).to.be.equal(200);
      const body = res.json.getCall(0).args[0];
      expect(body).to.be.deep.equal(tour().build());
    });
    it('should return 500 if an error occurs', async () => {
      req.params = { id: '123' };
      serviceMock.getTourById = sinon.stub(tourService, 'getTourById').rejects(new Error('error'));
      await tourController.getTourById(req, res);
      const status = res.status.getCall(0).args[0];
      expect(status).to.be.equal(500);
      const body = res.json.getCall(0).args[0];
      expect(body).to.be.deep.equal({
        error: 'Internal Server Error',
        errorCode: 'GET_TOUR_BY_ID_ERROR',
        message: 'error',
      });
    });
  });
});
