import { expect } from "chai";
import { after, afterEach, before, beforeEach, describe } from "mocha";
import waitOn from "wait-on";
import db from "../../models/index.js";
import app from "../../server.js";
import mocks from "../mocks/guidelog.mock.js";
import { UserBuilder, validList } from "../mocks/user.mock.js";
import chai from "./index.mjs";

const user = UserBuilder.user;
const dbReadyOptions = {
  resources: ["tcp:localhost:5432"],
  delay: 1000,
  timeout: 30000,
  interval: 1000,
};

const guideLogList = mocks.guideLogList;

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

const populateGuideLogs = async (token) => {
  for (const guideLog of guideLogList) {
    await chai.request
      .execute(app)
      .post("/api/guide_log/add_guide_log")
      .set("Authorization", `Bearer ${token}`)
      .send(guideLog);
  }
}

describe("E2e tests statistics", () => {
  describe("GET /api/statistics", () => {
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
    it("should return 401 if token is not passed", async () => {
      const response = await chai.request.execute(app).get("/api/statistics");
      expect(response).to.have.status(401);
      expect(response.body).to.be.deep.equal({ error: "No token provided" });
    })
    it("should return 200 if token is passed", async () => {
      populateGuideLogs(token);
      const response = await chai.request
        .execute(app)
        .get("/api/statistics")
        .set("Authorization", `Bearer ${token}`);
      expect(response).to.have.status(200);
      expect(response.body).not.to.deep.equal(guideLogList);
      expect(response.body).to.be.an("array");
      expect(response.body).to.have.lengthOf(6);
      response.body.forEach((statistic) => {
        expect(statistic).to.have.property("views");
        expect(statistic).to.have.property("change");
        expect(statistic).to.have.property("guideType");
      })
    })
  });
});
