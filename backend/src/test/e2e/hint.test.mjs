import { expect } from "chai";
import { after, afterEach, before, beforeEach, describe } from "mocha";
import waitOn from "wait-on";
import db from "../../models/index.js";
import app from "../../server.js";
import mocks from "../mocks/hint.mock.js";
import { UserBuilder, validList } from "../mocks/user.mock.js";
import chai from "./index.mjs";

const user = UserBuilder.user;
const dbReadyOptions = {
  resources: ["tcp:localhost:5432"],
  delay: 1000,
  timeout: 30000,
  interval: 1000,
};

const hint = mocks.HintBuilder.hint;
const hintList = mocks.hintList;

describe("E2e tests hint", () => {
  describe("POST /api/hint/add_hint", () => {
    before(async () => {
      db.sequelize.connectionManager.initPools();
    });
    after(async () => {
      const conn = await db.sequelize.connectionManager.getConnection();
      db.sequelize.connectionManager.releaseConnection(conn);
    });
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
        .post("/api/hint/add_hint")
        .send(hint().build());
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
        .post("/api/hint/add_hint")
        .set("Authorization", `Bearer ${newToken}`)
        .send(hint().build());
      expect(res).to.have.status(403);
      expect(res.body).to.be.deep.equal({
        error: "User does not have required access level",
      });
    });
    it("should return 400 if action is missing", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/hint/add_hint")
        .set("Authorization", `Bearer ${token}`)
        .send(hint().missingAction().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: [{ msg: "action is required" }],
      });
    });
    it("should return 400 if action is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/hint/add_hint")
        .set("Authorization", `Bearer ${token}`)
        .send(hint().invalidAction().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: [{ msg: "Invalid value for action" }],
      });
    });
    it("should return 400 if headerBackgroundColor is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/hint/add_hint")
        .set("Authorization", `Bearer ${token}`)
        .send(hint().invalidHeaderBackgroundColor().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: [{ msg: "Invalid value for headerBackgroundColor" }],
      });
    });
    it("should return 400 if headerColor is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/hint/add_hint")
        .set("Authorization", `Bearer ${token}`)
        .send(hint().invalidHeaderColor().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: [{ msg: "Invalid value for headerColor" }],
      });
    });
    it("should return 400 if textColor is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/hint/add_hint")
        .set("Authorization", `Bearer ${token}`)
        .send(hint().invalidTextColor().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: [{ msg: "Invalid value for textColor" }],
      });
    });
    it("should return 400 if buttonBackgroundColor is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/hint/add_hint")
        .set("Authorization", `Bearer ${token}`)
        .send(hint().invalidButtonBackgroundColor().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: [{ msg: "Invalid value for buttonBackgroundColor" }],
      });
    });
    it("should return 400 if buttonTextColor is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/hint/add_hint")
        .set("Authorization", `Bearer ${token}`)
        .send(hint().invalidButtonTextColor().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: [{ msg: "Invalid value for buttonTextColor" }],
      });
    });
    it("should return 201 if hint is created", async () => {
      const { id, ...newHint } = hint().build();
      const res = await chai.request
        .execute(app)
        .post("/api/hint/add_hint")
        .set("Authorization", `Bearer ${token}`)
        .send(newHint);
      expect(res).to.have.status(201);
      expect(res.body).to.be.deep.equal({ ...newHint, id: 1 });
    });
  });
  describe("DELETE /api/hint/delete_hint/:hintId", () => {
    before(async () => {
      db.sequelize.connectionManager.initPools();
    });
    after(async () => {
      const conn = await db.sequelize.connectionManager.getConnection();
      db.sequelize.connectionManager.releaseConnection(conn);
    });
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
        .delete("/api/hint/delete_hint/1")
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
        .delete("/api/hint/delete_hint/1")
        .set("Authorization", `Bearer ${newToken}`)
        .send();
      expect(res).to.have.status(403);
      expect(res.body).to.be.deep.equal({
        error: "User does not have required access level",
      });
    });
    it("should return 400 if hint id is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .delete("/api/hint/delete_hint/invalid")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: [{ msg: "Invalid hint ID" }],
      });
    });
    it("should return 404 if hint is not found", async () => {
      const res = await chai.request
        .execute(app)
        .delete("/api/hint/delete_hint/1")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(res).to.have.status(404);
      expect(res.body).to.be.deep.equal({
        errors: [{ msg: "Hint not found" }],
      });
    });
    it("should return 200 if hint is deleted", async () => {
      const { id, ...newHint } = hint().build();
      const addHint = await chai.request
        .execute(app)
        .post("/api/hint/add_hint")
        .set("Authorization", `Bearer ${token}`)
        .send(newHint);
      const res = await chai.request
        .execute(app)
        .delete(`/api/hint/delete_hint/${addHint.body.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(res).to.have.status(200);
      expect(res.body).to.be.deep.equal({
        message: "Hint with ID 1 deleted successfully",
      });
    });
  });
  describe("PUT /api/hint/edit_hint/:hintId", () => {
    before(async () => {
      db.sequelize.connectionManager.initPools();
    });
    after(async () => {
      const conn = await db.sequelize.connectionManager.getConnection();
      db.sequelize.connectionManager.releaseConnection(conn);
    });
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
        .put("/api/hint/edit_hint/1")
        .send(hint().build());
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
        .put("/api/hint/edit_hint/1")
        .set("Authorization", `Bearer ${newToken}`)
        .send(hint().build());
      expect(res).to.have.status(403);
      expect(res.body).to.be.deep.equal({
        error: "User does not have required access level",
      });
    });
    it("should return 400 if action is missing", async () => {
      const res = await chai.request
        .execute(app)
        .put("/api/hint/edit_hint/1")
        .set("Authorization", `Bearer ${token}`)
        .send(hint().missingAction().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: [{ msg: "action is required" }],
      });
    });
    it("should return 400 if action is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .put("/api/hint/edit_hint/1")
        .set("Authorization", `Bearer ${token}`)
        .send(hint().invalidAction().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: [{ msg: "Invalid value for action" }],
      });
    });
    it("should return 400 if headerBackgroundColor is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .put("/api/hint/edit_hint/1")
        .set("Authorization", `Bearer ${token}`)
        .send(hint().invalidHeaderBackgroundColor().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: [{ msg: "Invalid value for headerBackgroundColor" }],
      });
    });
    it("should return 400 if headerColor is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .put("/api/hint/edit_hint/1")
        .set("Authorization", `Bearer ${token}`)
        .send(hint().invalidHeaderColor().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: [{ msg: "Invalid value for headerColor" }],
      });
    });
    it("should return 400 if textColor is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .put("/api/hint/edit_hint/1")
        .set("Authorization", `Bearer ${token}`)
        .send(hint().invalidTextColor().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: [{ msg: "Invalid value for textColor" }],
      });
    });
    it("should return 400 if buttonBackgroundColor is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .put("/api/hint/edit_hint/1")
        .set("Authorization", `Bearer ${token}`)
        .send(hint().invalidButtonBackgroundColor().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: [{ msg: "Invalid value for buttonBackgroundColor" }],
      });
    });
    it("should return 400 if buttonTextColor is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .put("/api/hint/edit_hint/1")
        .set("Authorization", `Bearer ${token}`)
        .send(hint().invalidButtonTextColor().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: [{ msg: "Invalid value for buttonTextColor" }],
      });
    });
    it("should return 404 if hint is not found", async () => {
      const res = await chai.request
        .execute(app)
        .put("/api/hint/edit_hint/1")
        .set("Authorization", `Bearer ${token}`)
        .send(hint().build());
      expect(res).to.have.status(404);
      expect(res.body).to.be.deep.equal({
        errors: [{ msg: "Hint not found" }],
      });
    });
    it("should return 200 if hint is updated", async () => {
      const { id, ...newHint } = hint().build();
      const addHint = await chai.request
        .execute(app)
        .post("/api/hint/add_hint")
        .set("Authorization", `Bearer ${token}`)
        .send(newHint);
      const res = await chai.request
        .execute(app)
        .put(`/api/hint/edit_hint/${addHint.body.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ ...hint().build(), hintContent: "new content" });
      expect(res).to.have.status(200);
      expect(res.body).to.be.deep.equal({
        ...hint().build(),
        hintContent: "new content",
        id: addHint.body.id,
      });
    });
  });
  describe("GET /api/hint/all_hints", () => {
    before(async () => {
      db.sequelize.connectionManager.initPools();
    });
    after(async () => {
      const conn = await db.sequelize.connectionManager.getConnection();
      db.sequelize.connectionManager.releaseConnection(conn);
    });
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
        hintList.map((popup) => {
          return chai.request
            .execute(app)
            .post("/api/hint/add_hint")
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
      const res = await chai.request.execute(app).get("/api/hint/all_hints");
      expect(res).to.have.status(401);
      expect(res.body).to.be.deep.equal({ error: "No token provided" });
    });
    it("should return 200 if all hints are returned", async () => {
      const res = await chai.request
        .execute(app)
        .get("/api/hint/all_hints")
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.have.length(10);
      res.body.forEach((it) => {
        expect(it).to.have.all.keys([
          "id",
          "action",
          "hintContent",
          "actionButtonText",
          "actionButtonUrl",
          "headerBackgroundColor",
          "headerColor",
          "textColor",
          "buttonBackgroundColor",
          "buttonTextColor",
          "createdBy",
          "creator",
          "header",
          "url",
          "targetElement",
          "tooltipPlacement",
        ]);
      });
    });
  });
  describe("GET /api/hint/hints", () => {
    before(async () => {
      db.sequelize.connectionManager.initPools();
    });
    after(async () => {
      const conn = await db.sequelize.connectionManager.getConnection();
      db.sequelize.connectionManager.releaseConnection(conn);
    });
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
        hintList.map((it) => {
          const { id, ...popup } = it;
          return chai.request
            .execute(app)
            .post("/api/hint/add_hint")
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
      const res = await chai.request.execute(app).get("/api/hint/hints");
      expect(res).to.have.status(401);
      expect(res.body).to.be.deep.equal({ error: "No token provided" });
    });
    it("should return 200 if hints are returned", async () => {
      const res = await chai.request
        .execute(app)
        .get("/api/hint/hints")
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(200);
      expect(res.body).not.to.be.deep.equal(hintList);
      expect(res.body).to.have.length(5);
      expect(res.body.every((it) => it.createdBy === 1)).to.be.true;
    });
  });
  describe("GET /api/hint/get_hint/:id", () => {
    before(async () => {
      db.sequelize.connectionManager.initPools();
    });
    after(async () => {
      const conn = await db.sequelize.connectionManager.getConnection();
      db.sequelize.connectionManager.releaseConnection(conn);
    });
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
      const res = await chai.request.execute(app).get("/api/hint/get_hint/1");
      expect(res).to.have.status(401);
      expect(res.body).to.be.deep.equal({ error: "No token provided" });
    });
    it("should return 400 if hint id is invalid", async () => {
      const res = await chai.request
        .execute(app)
        .get("/api/hint/get_hint/invalid")
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: [{ msg: "Invalid hint ID" }],
      });
    });
    it("should return 200 if hint is retrieved", async () => {
      const { id, ...newHint } = hint().build();
      const addHint = await chai.request
        .execute(app)
        .post("/api/hint/add_hint")
        .set("Authorization", `Bearer ${token}`)
        .send(newHint);
      const res = await chai.request
        .execute(app)
        .get(`/api/hint/get_hint/${addHint.body.id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(200);
      const { creator, ...rest } = res.body;
      expect(rest).to.be.deep.equal({ ...newHint, id: addHint.body.id });
      expect(creator).to.have.property("id", 1);
    });
    it("should return 404 if hint is not found", async () => {
      const res = await chai.request
        .execute(app)
        .get("/api/hint/get_hint/1")
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(404);
      expect(res.body).to.be.deep.equal({
        errors: [{ msg: "Hint not found" }],
      });
    });
  });
});
