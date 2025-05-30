import { expect } from "chai";
import { after, afterEach, before, beforeEach, describe } from "mocha";
import waitOn from "wait-on";
import db from "../../models/index.js";
import app from "../../server.js";
import mocks from "../mocks/popup.mock.js";
import { UserBuilder, validList } from "../mocks/user.mock.js";
import chai from "./index.mjs";

const user = UserBuilder.user;
const dbReadyOptions = {
  resources: ["tcp:localhost:5432"],
  delay: 1000,
  timeout: 30000,
  interval: 1000,
};

const popup = mocks.PopupBuilder.popup;
const popupList = mocks.popupList;

const setupTestDatabase = () => {
  before(async () => {
    db.sequelize.connectionManager.initPools();
  });

  after(async () => {
    try {
      const conn = await db.sequelize.connectionManager.getConnection();
      db.sequelize.connectionManager.releaseConnection(conn);
    } catch (error) {
      console.error("Failed to release database connection:", error);
      throw error;
    }
  });
};

describe("E2e tests popup", () => {
  describe("POST /api/popup/add_popup", () => {
    setupTestDatabase();
    let token;

    beforeEach(async () => {
      process.env.NODE_ENV = "test";
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
        .post("/api/popup/add_popup")
        .send(popup().build());
      expect(res).to.have.status(401);
      expect(res.body).to.be.deep.equal({ error: "No token provided" });
    });
    it("should return 403 if user does not have required access level", async () => {
      process.env.NODE_ENV = "not-test";
      await chai.request
        .execute(app)
        .post("/api/team/invite")
        .set("Authorization", `Bearer ${token}`)
        .send({ invitedEmail: validList[1].email, role: "member" });
      const login = await chai.request
        .execute(app)
        .post("/api/auth/register")
        .send({ ...validList[1], role: 2 });
      const newToken = login.body.token;
      const res = await chai.request
        .execute(app)
        .post("/api/popup/add_popup")
        .set("Authorization", `Bearer ${newToken}`)
        .send(popup().build());
      expect(res).to.have.status(403);
      expect(res.body).to.be.deep.equal({
        error: "User does not have required access level",
      });
    });
    it("should return 400 if popupSize is not provided", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/popup/add_popup")
        .set("Authorization", `Bearer ${token}`)
        .send(popup().missingPopupSize().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['Popup size is required'],
      });
    });
    it("should return 400 if closeButtonAction is not provided", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/popup/add_popup")
        .set("Authorization", `Bearer ${token}`)
        .send(popup().missingCloseButtonAction().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['Close Button Action is required'],
      });
    });
    it("should return 400 if popupSize is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/popup/add_popup")
        .set("Authorization", `Bearer ${token}`)
        .send(popup().invalidPopupSize().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['Invalid value for Popup size'],
      });
    });
    it("should return 400 if closeButtonAction is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/popup/add_popup")
        .set("Authorization", `Bearer ${token}`)
        .send(popup().invalidCloseButtonAction().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['Invalid close button action'],
      });
    });
    it("should return 400 if headerBackgroundColor is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/popup/add_popup")
        .set("Authorization", `Bearer ${token}`)
        .send(popup().invalidHeaderBackgroundColor().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['headerBackgroundColor must be a valid hex color code'],
      });
    });
    it("should return 400 if headerColor is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/popup/add_popup")
        .set("Authorization", `Bearer ${token}`)
        .send(popup().invalidHeaderColor().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['headerColor must be a valid hex color code'],
      });
    });
    it("should return 400 if textColor is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/popup/add_popup")
        .set("Authorization", `Bearer ${token}`)
        .send(popup().invalidTextColor().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['textColor must be a valid hex color code'],
      });
    });
    it("should return 400 if buttonBackgroundColor is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/popup/add_popup")
        .set("Authorization", `Bearer ${token}`)
        .send(popup().invalidButtonBackgroundColor().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['buttonBackgroundColor must be a valid hex color code'],
      });
    });
    it("should return 400 if buttonTextColor is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/popup/add_popup")
        .set("Authorization", `Bearer ${token}`)
        .send(popup().invalidButtonTextColor().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['buttonTextColor must be a valid hex color code'],
      });
    });
    it("should return 201 if popup is created", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/popup/add_popup")
        .set("Authorization", `Bearer ${token}`)
        .send(popup().build());
      expect(res).to.have.status(201);
      expect(res.body).to.be.deep.equal(popup().build());
    });
  });
  describe("DELETE /api/popup/delete_popup/:id", () => {
    setupTestDatabase();
    let token;

    beforeEach(async () => {
      process.env.NODE_ENV = "test";
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
        .delete("/api/popup/delete_popup/1")
        .send();
      expect(res).to.have.status(401);
      expect(res.body).to.be.deep.equal({ error: "No token provided" });
    });
    it("should return 403 if user does not have required access level", async () => {
      process.env.NODE_ENV = "not-test";
      await chai.request
        .execute(app)
        .post("/api/team/invite")
        .set("Authorization", `Bearer ${token}`)
        .send({ invitedEmail: validList[1].email, role: "member" });
      const login = await chai.request
        .execute(app)
        .post("/api/auth/register")
        .send({ ...validList[1], role: 2 });
      const newToken = login.body.token;
      const res = await chai.request
        .execute(app)
        .delete("/api/popup/delete_popup/1")
        .set("Authorization", `Bearer ${newToken}`)
        .send();
      expect(res).to.have.status(403);
      expect(res.body).to.be.deep.equal({
        error: "User does not have required access level",
      });
    });
    it("should return 400 if id is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .delete("/api/popup/delete_popup/invalid")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['Invalid popup id'],
      });
    });
    it("should return 400 if popup is not found", async () => {
      const res = await chai.request
        .execute(app)
        .delete("/api/popup/delete_popup/1")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: [
          {
            msg: "Popup with the specified id does not exist",
          },
        ],
      });
    });
    it("should return 200 if popup is deleted", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/popup/add_popup")
        .set("Authorization", `Bearer ${token}`)
        .send(popup().build());
      const popupId = res.body.id;
      const res2 = await chai.request
        .execute(app)
        .delete(`/api/popup/delete_popup/${popupId}`)
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(res2).to.have.status(200);
      expect(res2.body).to.be.deep.equal({
        message: "Popup with ID 1 deleted successfully",
      });
    });
  });
  describe("PUT /api/popup/edit_popup/:id", () => {
    setupTestDatabase();
    let token;

    beforeEach(async () => {
      process.env.NODE_ENV = "test";
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
        .put("/api/popup/edit_popup/1")
        .send(popup().build());
      expect(res).to.have.status(401);
      expect(res.body).to.be.deep.equal({ error: "No token provided" });
    });
    it("should return 403 if user does not have required access level", async () => {
      process.env.NODE_ENV = "not-test";
      await chai.request
        .execute(app)
        .post("/api/team/invite")
        .set("Authorization", `Bearer ${token}`)
        .send({ invitedEmail: validList[1].email, role: "member" });
      const login = await chai.request
        .execute(app)
        .post("/api/auth/register")
        .send({ ...validList[1], role: 2 });
      const newToken = login.body.token;
      const res = await chai.request
        .execute(app)
        .put("/api/popup/edit_popup/1")
        .set("Authorization", `Bearer ${newToken}`)
        .send(popup().build());
      expect(res).to.have.status(403);
      expect(res.body).to.be.deep.equal({
        error: "User does not have required access level",
      });
    });
    it("should return 400 if popupSize is not provided", async () => {
      const res = await chai.request
        .execute(app)
        .put("/api/popup/edit_popup/1")
        .set("Authorization", `Bearer ${token}`)
        .send(popup().missingPopupSize().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['Popup size is required'],
      });
    });
    it("should return 400 if closeButtonAction is not provided", async () => {
      const res = await chai.request
        .execute(app)
        .put("/api/popup/edit_popup/1")
        .set("Authorization", `Bearer ${token}`)
        .send(popup().missingCloseButtonAction().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['Close Button Action is required'],
      });
    });
    it("should return 400 if popupSize is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .put("/api/popup/edit_popup/1")
        .set("Authorization", `Bearer ${token}`)
        .send(popup().invalidPopupSize().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['Invalid value for Popup size'],
      });
    });
    it("should return 400 if closeButtonAction is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .put("/api/popup/edit_popup/1")
        .set("Authorization", `Bearer ${token}`)
        .send(popup().invalidCloseButtonAction().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['Invalid close button action'],
      });
    });
    it("should return 400 if headerBackgroundColor is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .put("/api/popup/edit_popup/1")
        .set("Authorization", `Bearer ${token}`)
        .send(popup().invalidHeaderBackgroundColor().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['headerBackgroundColor must be a valid hex color code'],
      });
    });
    it("should return 400 if headerColor is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .put("/api/popup/edit_popup/1")
        .set("Authorization", `Bearer ${token}`)
        .send(popup().invalidHeaderColor().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['headerColor must be a valid hex color code'],
      });
    });
    it("should return 400 if textColor is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .put("/api/popup/edit_popup/1")
        .set("Authorization", `Bearer ${token}`)
        .send(popup().invalidTextColor().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['textColor must be a valid hex color code'],
      });
    });
    it("should return 400 if buttonBackgroundColor is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .put("/api/popup/edit_popup/1")
        .set("Authorization", `Bearer ${token}`)
        .send(popup().invalidButtonBackgroundColor().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['buttonBackgroundColor must be a valid hex color code'],
      });
    });
    it("should return 400 if buttonTextColor is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .put("/api/popup/edit_popup/1")
        .set("Authorization", `Bearer ${token}`)
        .send(popup().invalidButtonTextColor().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['buttonTextColor must be a valid hex color code'],
      });
    });
    it("should return 200 if popup is updated", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/popup/add_popup")
        .set("Authorization", `Bearer ${token}`)
        .send(popup().build());
      const popupId = res.body.id;
      const res2 = await chai.request
        .execute(app)
        .put(`/api/popup/edit_popup/${popupId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(popup().build());
      expect(res2).to.have.status(200);
      expect(res2.body).to.be.deep.equal(popup().build());
    });
  });
  describe("GET /api/popup/all_popups", () => {
    setupTestDatabase();
    let token;

    beforeEach(async () => {
      process.env.NODE_ENV = "test";
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
      const newToken = login2.body.token;
      await Promise.all(
        popupList.map((popup) => {
          return chai.request
            .execute(app)
            .post("/api/popup/add_popup")
            .set(
              "Authorization",
              `Bearer ${popup.createdBy === 1 ? token : newToken}`
            )
            .send(popup);
        })
      );
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it("should return 401 if no token is provided", async () => {
      const res = await chai.request.execute(app).get("/api/popup/all_popups");
      expect(res).to.have.status(401);
      expect(res.body).to.be.deep.equal({ error: "No token provided" });
    });
    it("should return 200 if popups are found", async () => {
      const res = await chai.request
        .execute(app)
        .get("/api/popup/all_popups")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(res).to.have.status(200);
      expect(res.body).to.have.length(10);
    });
  });
  describe("GET /api/popup/popups", () => {
    setupTestDatabase();
    let token;

    beforeEach(async () => {
      process.env.NODE_ENV = "test";
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
      const newToken = login2.body.token;
      await Promise.all(
        popupList.map((it) => {
          const { id, ...popup } = it;
          return chai.request
            .execute(app)
            .post("/api/popup/add_popup")
            .set(
              "Authorization",
              `Bearer ${popup.createdBy === 1 ? token : newToken}`
            )
            .send(popup);
        })
      );
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it("should return 401 if no token is provided", async () => {
      const res = await chai.request.execute(app).get("/api/popup/popups");
      expect(res).to.have.status(401);
      expect(res.body).to.be.deep.equal({ error: "No token provided" });
    });
    it("should return 200 if popups are found", async () => {
      const res = await chai.request
        .execute(app)
        .get("/api/popup/popups")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(res).to.have.status(200);
      expect(res.body).to.have.length(5);
    });
  });
  describe("GET /api/popup/get_popup/:id", () => {
    setupTestDatabase();
    let token;

    beforeEach(async () => {
      process.env.NODE_ENV = "test";
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
      const res = await chai.request.execute(app).get("/api/popup/get_popup/1");
      expect(res).to.have.status(401);
      expect(res.body).to.be.deep.equal({ error: "No token provided" });
    });
    it("should return 400 if id is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .get("/api/popup/get_popup/invalid")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ["Invalid popup id"],
      });
    });
    it("should return 404 if popup is not found", async () => {
      const res = await chai.request
        .execute(app)
        .get("/api/popup/get_popup/1")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(res).to.have.status(404);
      expect(res.body).to.be.deep.equal({
        errors: [
          {
            msg: "Popup not found",
          },
        ],
      });
    });
    it("should return 200 if popup is found", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/popup/add_popup")
        .set("Authorization", `Bearer ${token}`)
        .send(popup().build());
      const popupId = res.body.id;
      const res2 = await chai.request
        .execute(app)
        .get(`/api/popup/get_popup/${popupId}`)
        .set("Authorization", `Bearer ${token}`)
        .send();
      const { ...rest } = res2.body;
      expect(res2).to.have.status(200);
      expect(rest).to.be.deep.equal(popup().build());
      // expect(creator.id).to.be.equal(user().build().id);
    });
  });
});
