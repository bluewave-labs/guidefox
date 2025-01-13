const { describe, it, afterEach } = require("mocha");
const { expect } = require("chai");
const sinon = require("sinon");
const db = require("../../../models/index.js");
const mocks = require("../../mocks/tour.mock.js");
const tourService = require("../../../service/tour.service.js");

const Tour = db.Tour;
const tour = mocks.TourBuilder.tour;

describe("Test tour service", () => {
  const TourMock = {};
  afterEach(sinon.restore);
  it("getAllTours - should return all tours with it's users", async () => {
    TourMock.findAll = sinon.stub(Tour, "findAll").resolves(mocks.toursList);
    const tours = await tourService.getAllTours();
    expect(tours).to.be.deep.equal(mocks.toursList);
    expect(TourMock.findAll.called).to.be.true;
    // const params = TourMock.findAll.getCall(0).args[0];
    // expect(params).to.be.deep.equal({
    //   include: [{ model: db.User, as: "creator" }],
    // });
  });
  it("getTours - should return only the tours created by the specific user", async () => {
    const userId = 1;
    TourMock.findAll = sinon.stub(Tour, "findAll").resolves(mocks.toursList);
    const tours = await tourService.getTours(userId);
    expect(tours).to.be.deep.equal(mocks.toursList);
    expect(TourMock.findAll.called).to.be.true;
    // const params = TourMock.findAll.getCall(0).args[0];
    // expect(params).to.be.deep.equal({
    //   where: { createdBy: userId },
    //   include: [{ model: db.User, as: "creator" }],
    // });
  });
  it("createTour - should return the tour created", async () => {
    const newTour = tour(1).build();
    TourMock.create = sinon.stub(Tour, "create").resolves(newTour);
    const createdTour = await tourService.createTour(newTour);
    expect(createdTour).to.be.deep.equal(newTour);
    expect(TourMock.create.called).to.be.true;
    const params = TourMock.create.getCall(0).args[0];
    expect(params).to.be.deep.equal(newTour);
  });
  it("deleteTour - if no tour is deleted, should return false", async () => {
    const id = 1;
    TourMock.destroy = sinon.stub(Tour, "destroy").resolves(0);
    const isDeleted = await tourService.deleteTour(id);
    expect(isDeleted).to.be.false;
    expect(TourMock.destroy.called).to.be.true;
    const params = TourMock.destroy.getCall(0).args[0];
    expect(params).to.be.deep.equal({ where: { id } });
  });
  it("deleteTour - if a tour is deleted, should return true", async () => {
    const id = 1;
    TourMock.destroy = sinon.stub(Tour, "destroy").resolves(1);
    const isDeleted = await tourService.deleteTour(id);
    expect(isDeleted).to.be.true;
    expect(TourMock.destroy.called).to.be.true;
    const params = TourMock.destroy.getCall(0).args[0];
    expect(params).to.be.deep.equal({ where: { id } });
  });
  it("updateTour - should return null if no tour is updated", async () => {
    const id = 1;
    const data = tour(1).build();
    TourMock.update = sinon.stub(Tour, "update").resolves([0, []]);
    const updatedTour = await tourService.updateTour(id, data);
    expect(updatedTour).to.be.null;
    expect(TourMock.update.called).to.be.true;
    const params = TourMock.update.getCall(0).args;
    expect(params[0]).to.be.deep.equal(data);
    expect(params[1]).to.be.deep.equal({ where: { id }, returning: true });
  });
  it("updateTour - should return the updated tour", async () => {
    const id = 1;
    const data = tour(1).build();
    TourMock.update = sinon.stub(Tour, "update").resolves([1, [data]]);
    const updatedTour = await tourService.updateTour(id, data);
    expect(updatedTour).to.be.deep.equal(data);
    expect(TourMock.update.called).to.be.true;
    const params = TourMock.update.getCall(0).args;
    expect(params[0]).to.be.deep.equal(data);
    expect(params[1]).to.be.deep.equal({ where: { id }, returning: true });
  });
  it("getTourById - should return the found tour", async () => {
    const tourId = 1;
    const expectedTour = tour(1).build();
    TourMock.findOne = sinon.stub(Tour, "findOne").resolves(expectedTour);
    const foundTour = await tourService.getTourById(tourId);
    expect(foundTour).to.be.deep.equal(expectedTour);
    expect(TourMock.findOne.called).to.be.true;
    // const params = TourMock.findOne.getCall(0).args[0];
    // expect(params).to.be.deep.equal({
    //   where: { id: tourId },
    //   include: [{ model: db.User, as: "creator" }],
    // });
  });
  it("getTourById - should throw an error if the tour is not found", async () => {
    const tourId = 1;
    TourMock.findOne = sinon.stub(Tour, "findOne").rejects();
    try {
      await tourService.getTourById(tourId);
    } catch (error) {
      expect(error.message).to.be.equal("Error retrieving tour by ID");
    }
    expect(TourMock.findOne.called).to.be.true;
    // const params = TourMock.findOne.getCall(0).args[0];
    // expect(params).to.be.deep.equal({
    //   where: { id: tourId },
    //   include: [{ model: db.User, as: "creator" }],
    // });
  });
});
