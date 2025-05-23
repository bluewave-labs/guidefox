const { describe, it, afterEach, beforeEach } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const db = require('../../../models/index.js');
const mocks = require('../../mocks/tour.mock.js');
const tourService = require('../../../service/tour.service.js');

const Tour = db.Tour;
const TourPopup = db.TourPopup;
const tour = mocks.TourBuilder.tour;
const tourPopup = mocks.TourPopupBuilder.tourPopup;

describe('Test tour service', () => {
  const TourMock = {};
  const TourPopupMock = {};
  let commit;
  let rollback;
  beforeEach(() => {
    commit = sinon.spy();
    rollback = sinon.spy();
    sinon.stub(db.sequelize, 'transaction').callsFake(async () => ({
      commit,
      rollback,
    }));
  });
  afterEach(sinon.restore);
  it("getAllTours - should return all tours with it's users", async () => {
    TourMock.findAll = sinon.stub(Tour, 'findAll').resolves(mocks.toursList);
    const tours = await tourService.getAllTours();
    expect(tours).to.be.deep.equal(mocks.toursList);
    expect(TourMock.findAll.called).to.be.true;
  });
  it('getTourByUserId - should return only the tours created by the specific user', async () => {
    const userId = 1;
    TourMock.findAll = sinon.stub(Tour, 'findAll').resolves(mocks.toursList);
    const tours = await tourService.getTourByUserId(userId);
    expect(tours).to.be.deep.equal(mocks.toursList);
    expect(TourMock.findAll.called).to.be.true;
  });
  it('createTour - should return the tour created', async () => {
    const newTour = tour(1).build();
    const newSteps = [tourPopup(1, newTour.id).build(), tourPopup(2, newTour.id).build()];
    TourMock.create = sinon.stub(Tour, 'create').resolves(newTour);
    TourPopupMock.bulkCreate = sinon.stub(TourPopup, 'bulkCreate').resolves(newSteps);
    const createdTour = await tourService.createTour({ ...newTour, steps: newSteps });
    expect(createdTour).to.be.deep.equal(newTour);
    expect(TourMock.create.called).to.be.true;
    expect(TourPopupMock.bulkCreate.called).to.be.true;
    const params = TourMock.create.getCall(0).args[0];
    expect(params).to.be.deep.equal(newTour);
    expect(commit.called).to.be.true;
  });
  it('createTour - should throw an error if the tour is not created', async () => {
    const newTour = tour(1).build();
    TourMock.create = sinon.stub(Tour, 'create').rejects();
    try {
      await tourService.createTour(newTour);
    } catch (error) {
      expect(error.message).to.be.equal('Error');
    }
    expect(TourMock.create.called).to.be.true;
    expect(rollback.called).to.be.true;
  });
  it('deleteTour - if no tour is deleted, should return false', async () => {
    const id = 1;
    TourMock.destroy = sinon.stub(Tour, 'destroy').resolves(0);
    TourPopupMock.destroy = sinon.stub(TourPopup, 'destroy').resolves(0);
    const isDeleted = await tourService.deleteTour(id);
    expect(isDeleted).to.be.false;
    expect(TourMock.destroy.called).to.be.true;
    const params = TourMock.destroy.getCall(0).args[0];
    expect(params).to.be.deep.equal({ where: { id }, transaction: { commit, rollback } });
  });
  it('deleteTour - if a tour is deleted, should return true', async () => {
    const id = 1;
    TourMock.destroy = sinon.stub(Tour, 'destroy').resolves(1);
    TourPopupMock.destroy = sinon.stub(TourPopup, 'destroy').resolves(1);
    const isDeleted = await tourService.deleteTour(id);
    expect(isDeleted).to.be.true;
    expect(TourMock.destroy.called).to.be.true;
    expect(TourPopupMock.destroy.called).to.be.true;
    expect(commit.called).to.be.true;
    const params = TourMock.destroy.getCall(0).args[0];
    expect(params.where).to.be.deep.equal({ id });
  });
  it('deleteTour - should throw an error if the tour is not deleted', async () => {
    const id = 1;
    TourPopupMock.destroy = sinon.stub(TourPopup, 'destroy').rejects();
    try {
      await tourService.deleteTour(id);
    } catch (error) {
      expect(error.message).to.be.equal('Error');
    }
    expect(TourPopupMock.destroy.called).to.be.true;
    expect(rollback.called).to.be.true;
  });
  it('updateTour - should return null if no tour is updated', async () => {
    const id = 1;
    const data = tour(1).build();
    const newSteps = [tourPopup(1, id).build(), tourPopup(2, id).build()];
    TourMock.update = sinon.stub(Tour, 'update').resolves([0, []]);
    TourPopupMock.destroy = sinon.stub(TourPopup, 'destroy').resolves();
    TourPopupMock.bulkCreate = sinon.stub(TourPopup, 'bulkCreate').resolves();
    const updatedTour = await tourService.updateTour(id, { ...data, steps: newSteps });
    expect(updatedTour).to.be.null;
    expect(TourMock.update.called).to.be.true;
    expect(TourPopupMock.destroy.called).to.be.false;
    expect(TourPopupMock.bulkCreate.called).to.be.false;
    const params = TourMock.update.getCall(0).args;
    expect(params[0]).to.be.deep.equal(data);
    expect(params[1]).to.be.deep.equal({ where: { id }, returning: true, transaction: { commit, rollback } });
  });
  it('updateTour - should return the updated tour', async () => {
    const id = 1;
    const data = tour(1).build();
    const newSteps = [tourPopup(1, id).build(), tourPopup(2, id).build()];
    TourMock.update = sinon.stub(Tour, 'update').resolves([1, [data]]);
    TourPopupMock.destroy = sinon.stub(TourPopup, 'destroy').resolves(1);
    TourPopupMock.bulkCreate = sinon.stub(TourPopup, 'bulkCreate').resolves(newSteps);
    const updatedTour = await tourService.updateTour(id, { ...data, steps: newSteps });
    expect(updatedTour).to.be.deep.equal(data);
    expect(TourMock.update.called).to.be.true;
    expect(TourPopupMock.destroy.called).to.be.true;
    expect(TourPopupMock.bulkCreate.called).to.be.true;
    const params = TourMock.update.getCall(0).args;
    expect(params[0]).to.be.deep.equal(data);
    expect(params[1].where).to.be.deep.equal({ id });
    expect(params[1].returning).to.be.true;
  });
  it('getTourById - should return the found tour', async () => {
    const tourId = 1;
    const expectedTour = tour(1).build();
    TourMock.findByPk = sinon.stub(Tour, 'findByPk').resolves(expectedTour);
    const foundTour = await tourService.getTourById(tourId);
    expect(foundTour).to.be.deep.equal(expectedTour);
    expect(TourMock.findByPk.called).to.be.true;
  });
  it('getTourById - should throw an error if the tour is not found', async () => {
    const tourId = 1;
    TourMock.findByPk = sinon.stub(Tour, 'findByPk').rejects();
    try {
      await tourService.getTourById(tourId);
    } catch (error) {
      expect(error.message).to.be.equal('Error');
    }
    expect(TourMock.findByPk.called).to.be.true;
  });
});
