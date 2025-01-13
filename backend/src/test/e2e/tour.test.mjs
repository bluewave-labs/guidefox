import { expect } from "chai";
import { after, afterEach, before, beforeEach, describe } from "mocha";
import waitOn from "wait-on";
import db from "../../models/index.js";
import app from "../../server.js";
import mocks from "../mocks/tour.mock.js";
import { UserBuilder, validList } from "../mocks/user.mock.js";
import chai from "./index.mjs";

const user = UserBuilder.user;
const dbReadyOptions = {
  resources: ["tcp:localhost:5432"],
  delay: 1000,
  timeout: 30000,
  interval: 1000,
};

const tour = mocks.TourBuilder.tour;
const tourList = mocks.toursList;

const createTour = async (token, tour) => {
  const { id, createdBy, ...rest } = tour;
  const res = await chai.request
    .execute(app)
    .post("/api/tour/add_tour")
    .set("Authorization", `Bearer ${token}`)
    .send(rest);
  return res.body;
};

describe("E2e tests tour", () => {
  describe("POST /api/tour/add_tour", () => {
    before(async () => {
      db.sequelize.connectionManager.initPools();
    });
    after(async () => {
      const conn = await db.sequelize.connectionManager.getConnection();
      db.sequelize.connectionManager.releaseConnection(conn);
    });
    let token;

    beforeEach(async () => {
      try {
        await waitOn(dbReadyOptions);
      } catch (err) {
        console.error("Database not ready in time:", err);
        throw err;
      }
      const login = await chai.request
        .execute(app)
        .post("/api/auth/register")
        .send(user().build());
      token = login.body.token;
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it("should return 401 if no token is provided", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/tour/add_tour")
        .send(tour().build());
      expect(res).to.have.status(401);
      const body = res.body;
      expect(body).to.be.deep.equal({ error: "No token provided" });
    });
    it("should return 400 if title is not provided", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/tour/add_tour")
        .set("Authorization", `Bearer ${token}`)
        .send(tour().missingTitle().build());
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({
        errors: [
          {
            msg: "title, pageTargeting, theme, and triggeringFrequency are required",
          },
        ],
      });
    });
    it("should return 400 if pageTargeting is not provided", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/tour/add_tour")
        .set("Authorization", `Bearer ${token}`)
        .send(tour().missingPageTargeting().build());
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({
        errors: [
          {
            msg: "title, pageTargeting, theme, and triggeringFrequency are required",
          },
        ],
      });
    });
    it("should return 400 if theme is not provided", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/tour/add_tour")
        .set("Authorization", `Bearer ${token}`)
        .send(tour().missingTheme().build());
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({
        errors: [
          {
            msg: "title, pageTargeting, theme, and triggeringFrequency are required",
          },
        ],
      });
    });
    it("should return 400 if triggeringFrequency is not provided", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/tour/add_tour")
        .set("Authorization", `Bearer ${token}`)
        .send(tour().missingTriggeringFrequency().build());
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({
        errors: [
          {
            msg: "title, pageTargeting, theme, and triggeringFrequency are required",
          },
        ],
      });
    });
    it("should return 400 if pageTargeting is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/tour/add_tour")
        .set("Authorization", `Bearer ${token}`)
        .send(tour().invalidPageTargeting().build());
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({
        errors: [
          {
            msg: "Invalid value for pageTargeting, theme, or triggeringFrequency",
          },
        ],
      });
    });
    it("should return 400 if theme is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/tour/add_tour")
        .set("Authorization", `Bearer ${token}`)
        .send(tour().invalidTheme().build());
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({
        errors: [
          {
            msg: "Invalid value for pageTargeting, theme, or triggeringFrequency",
          },
        ],
      });
    });
    it("should return 400 if triggeringFrequency is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/tour/add_tour")
        .set("Authorization", `Bearer ${token}`)
        .send(tour().invalidTriggeringFrequency().build());
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({
        errors: [
          {
            msg: "Invalid value for pageTargeting, theme, or triggeringFrequency",
          },
        ],
      });
    });
    it("should return 201 if all required fields are provided", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/tour/add_tour")
        .set("Authorization", `Bearer ${token}`)
        .send(tour().withoutId().build());
      expect(res).to.have.status(201);
      const body = res.body;
      expect(body).to.be.deep.equal(tour().build());
    });
  });
  describe("DELETE /api/tour/delete_tour/:id", () => {
    before(async () => {
      db.sequelize.connectionManager.initPools();
    });
    after(async () => {
      const conn = await db.sequelize.connectionManager.getConnection();
      db.sequelize.connectionManager.releaseConnection(conn);
    });
    let token;

    beforeEach(async () => {
      try {
        await waitOn(dbReadyOptions);
      } catch (err) {
        console.error("Database not ready in time:", err);
        throw err;
      }
      const login = await chai.request
        .execute(app)
        .post("/api/auth/register")
        .send(user().build());
      token = login.body.token;
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it("should return 401 if no token is provided", async () => {
      const res = await chai.request
        .execute(app)
        .delete("/api/tour/delete_tour/1")
        .send();
      expect(res).to.have.status(401);
      const body = res.body;
      expect(body).to.be.deep.equal({ error: "No token provided" });
    });
    it("should return 404 if tour is not found", async () => {
      const res = await chai.request
        .execute(app)
        .delete("/api/tour/delete_tour/1")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(res).to.have.status(404);
      const body = res.body;
      expect(body).to.be.deep.equal({ msg: "Tour not found" });
    });
    it("should return 200 if tour is found", async () => {
      const tokenToDelete = await createTour(token, tour().withoutId().build());
      const res = await chai.request
        .execute(app)
        .delete(`/api/tour/delete_tour/${tokenToDelete.id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(200);
      const body = res.body;
      expect(body).to.be.deep.equal({ msg: "Tour deleted successfully" });
    });
  });
  describe("PUT /api/tour/edit_tour/:id", () => {
    before(async () => {
      db.sequelize.connectionManager.initPools();
    });
    after(async () => {
      const conn = await db.sequelize.connectionManager.getConnection();
      db.sequelize.connectionManager.releaseConnection(conn);
    });
    let token;

    beforeEach(async () => {
      try {
        await waitOn(dbReadyOptions);
      } catch (err) {
        console.error("Database not ready in time:", err);
        throw err;
      }
      const login = await chai.request
        .execute(app)
        .post("/api/auth/register")
        .send(user().build());
      token = login.body.token;
      await createTour(token, tour().withoutId().build());
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it("should return 401 if no token is provided", async () => {
      const res = await chai.request
        .execute(app)
        .put("/api/tour/edit_tour/1")
        .send(tour().build());
      expect(res).to.have.status(401);
      const body = res.body;
      expect(body).to.be.deep.equal({ error: "No token provided" });
    });
    it("should return 200 if all required fields are provided", async () => {
      const res = await chai.request
        .execute(app)
        .put("/api/tour/edit_tour/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "New title" });
      expect(res).to.have.status(200);
      const body = res.body;
      expect(body).not.to.be.deep.equal(tour().build());
      expect(body).to.have.property("title", "New title");
    });
    it("should return 404 if tour is not found", async () => {
      const res = await chai.request
        .execute(app)
        .put("/api/tour/edit_tour/2")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "New title" });
      expect(res).to.have.status(404);
      const body = res.body;
      expect(body).to.be.deep.equal({ msg: "Tour not found" });
    });
  });
  describe("GET /api/tour/all_tours", () => {
    before(async () => {
      db.sequelize.connectionManager.initPools();
    });
    after(async () => {
      const conn = await db.sequelize.connectionManager.getConnection();
      db.sequelize.connectionManager.releaseConnection(conn);
    });
    let token;

    beforeEach(async () => {
      try {
        await waitOn(dbReadyOptions);
      } catch (err) {
        console.error("Database not ready in time:", err);
        throw err;
      }
      const login = await chai.request
        .execute(app)
        .post("/api/auth/register")
        .send(user().build());
      token = login.body.token;
      await chai.request
        .execute(app)
        .post("/api/team/invite")
        .set("Authorization", `Bearer ${token}`)
        .send({ invitedEmail: validList[1].email, role: "member" });
      const login2 = await chai.request
        .execute(app)
        .post("/api/auth/register")
        .send({ ...validList[1], role: 2 });
      const token2 = login2.body.token;
      await Promise.all(
        tourList.map(async (tour) => {
          return await createTour(tour.createdBy === 1 ? token : token2, tour);
        })
      );
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it("should return 401 if no token is provided", async () => {
      const res = await chai.request
        .execute(app)
        .get("/api/tour/all_tours")
        .send();
      expect(res).to.have.status(401);
      const body = res.body;
      expect(body).to.be.deep.equal({ error: "No token provided" });
    });
    it("should return 200 if tours are found", async () => {
      await createTour(token, tour().withoutId().build());
      const res = await chai.request
        .execute(app)
        .get("/api/tour/all_tours")
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(200);
      const body = res.body;
      body.forEach((info, i) => {
        const { id, createdBy: c, ...rest } = info;
        const listTourItem = tourList.find((tour) => tour.title === rest.title);
        const { id: tourId, createdBy, ...expected } = listTourItem;
        expect(rest).to.be.deep.equal(expected);
        // expect(creator.id).to.be.equal(c);
      });
      expect(body).to.have.lengthOf(11);
    });
  });
  describe("GET /api/tour/tours", () => {
    before(async () => {
      db.sequelize.connectionManager.initPools();
    });
    after(async () => {
      const conn = await db.sequelize.connectionManager.getConnection();
      db.sequelize.connectionManager.releaseConnection(conn);
    });
    let token;

    beforeEach(async () => {
      try {
        await waitOn(dbReadyOptions);
      } catch (err) {
        console.error("Database not ready in time:", err);
        throw err;
      }
      const login = await chai.request
        .execute(app)
        .post("/api/auth/register")
        .send(user().build());
      token = login.body.token;
      await chai.request
        .execute(app)
        .post("/api/team/invite")
        .set("Authorization", `Bearer ${token}`)
        .send({ invitedEmail: validList[1].email, role: "member" });
      const login2 = await chai.request
        .execute(app)
        .post("/api/auth/register")
        .send({ ...validList[1], role: 2 });
      const token2 = login2.body.token;
      await Promise.all(
        tourList.map(async (tour) => {
          await createTour(tour.createdBy === 1 ? token : token2, tour);
        })
      );
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it("should return 401 if no token is provided", async () => {
      const res = await chai.request.execute(app).get("/api/tour/tours").send();
      expect(res).to.have.status(401);
      const body = res.body;
      expect(body).to.be.deep.equal({ error: "No token provided" });
    });
    it("should return 200 if tours are found", async () => {
      await createTour(token, tour().withoutId().build());
      const res = await chai.request
        .execute(app)
        .get("/api/tour/tours")
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(200);
      const body = res.body;
      body.forEach((info, i) => {
        const { id, creator, createdBy: c, ...rest } = info;
        const listTourItem = tourList.find((tour) => tour.title === rest.title);
        if (c !== 1) {
          expect(rest).not.to.include(listTourItem);
        } else {
          const { id: tourId, createdBy, ...expected } = listTourItem;
          expect(rest).to.be.deep.equal(expected);
        }
      });
      expect(body).to.have.lengthOf(6);
    });
  });
  describe("GET /api/tour/get_tour/:id", () => {
    before(async () => {
      db.sequelize.connectionManager.initPools();
    });
    after(async () => {
      const conn = await db.sequelize.connectionManager.getConnection();
      db.sequelize.connectionManager.releaseConnection(conn);
    });
    let token;

    beforeEach(async () => {
      try {
        await waitOn(dbReadyOptions);
      } catch (err) {
        console.error("Database not ready in time:", err);
        throw err;
      }
      const login = await chai.request
        .execute(app)
        .post("/api/auth/register")
        .send(user().build());
      token = login.body.token;
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it("should return 401 if no token is provided", async () => {
      const res = await chai.request
        .execute(app)
        .get("/api/tour/get_tour/1")
        .send();
      expect(res).to.have.status(401);
      const body = res.body;
      expect(body).to.be.deep.equal({ error: "No token provided" });
    });
    it("should return 404 if tour is not found", async () => {
      const res = await chai.request
        .execute(app)
        .get("/api/tour/get_tour/1")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(res).to.have.status(404);
      const body = res.body;
      expect(body).to.be.deep.equal({ msg: "Tour not found" });
    });
    it("should return 200 if tour is found", async () => {
      await createTour(token, tour().withoutId().build());
      const res = await chai.request
        .execute(app)
        .get("/api/tour/get_tour/1")
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(200);
      const { creator, ...rest } = res.body;
      expect(rest).to.be.deep.equal(tour().build());
    });
  });
});
