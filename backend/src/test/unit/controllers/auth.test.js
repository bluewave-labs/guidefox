const { describe, it, beforeEach, afterEach } = require("mocha");
const sinon = require("sinon");
const { expect } = require("chai");
const emailService = require("../../../service/email.service.js");
const db = require("../../../models/index.js");
const auth = require("../../../controllers/auth.controller.js");
const mocks = require("../../mocks/user.mock.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = db.User;
const Token = db.Token;

describe("Unit test auth controller", () => {
  const req = {};
  const res = {};
  const fakeToken = jwt.sign(
    { id: 1 },
    process.env.JWT_SECRET || "test_secret"
  );
  const UserMock = {};
  const TokenMock = {};
  let commit;
  let rollback;
  beforeEach(() => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    commit = sinon.spy();
    rollback = sinon.spy();
    sinon.stub(db.sequelize, "transaction").callsFake(async () => ({
      commit,
      rollback,
    }));
  });
  afterEach(sinon.restore);
  it("register - if something goes wrong, should return status 500", async () => {
    UserMock.findOne = sinon.stub(User, "findOne").rejects();
    req.body = { ...mocks.validUser };
    await auth.register(req, res);

    expect(res.status.args[0][0]).to.be.equal(500);
    const body = res.json.args[0][0];
    const { token, ...info } = body;
    expect(info).to.be.deep.equal({
      error: "Internal Server Error",
    });
  });
  it("register - should return status 400 if the email is already registered", async () => {
    UserMock.findOne = sinon.stub(User, "findOne").resolves(true);
    req.body = mocks.validUser;
    await auth.register(req, res);
    expect(UserMock.findOne.called).to.be.true;
    expect(
      UserMock.findOne.calledWith({ where: { email: mocks.validUser.email } })
    ).to.be.true;
    expect(res.status.args[0][0]).to.be.equal(400);
    expect(res.json.args[0][0]).to.be.deep.equal({
      error: "Email already exists",
    });
  });
  it("register - should return the created user and the token if there is a user already created", async () => {
    UserMock.count = sinon.stub(User, "count").resolves(1);
    UserMock.create = sinon.stub(User, "create").resolves(mocks.validUser);
    UserMock.findOne = sinon.stub(User, "findOne").resolves(false);
    TokenMock.create = sinon.stub(Token, "create").resolves();
    req.body = mocks.validUser;
    await auth.register(req, res);

    expect(UserMock.findOne.called).to.be.true;
    expect(
      UserMock.findOne.calledWith({ where: { email: mocks.validUser.email } })
    ).to.be.true;
    expect(UserMock.count.called).to.be.true;
    expect(TokenMock.create.called).to.be.true;
    expect(commit.called).to.be.true;

    expect(res.status.args[0][0]).to.be.equal(201);
    const body = res.json.args[0][0];
    const { token, ...info } = body;
    expect(info).to.be.deep.equal({
      user: {
        email: "jane.doe@email.com",
        id: 1,
        name: "Jane",
        role: "admin",
        surname: "Doe",
      },
    });
    expect(body).to.have.property("token");
  });
  it("register - should return status 400 if something goes wrong and a user is already created", async () => {
    UserMock.count = sinon.stub(User, "count").resolves(1);
    UserMock.create = sinon.stub(User, "create").rejects();
    UserMock.findOne = sinon.stub(User, "findOne").resolves(false);
    TokenMock.create = sinon.stub(Token, "create").resolves();
    req.body = mocks.validUser;
    await auth.register(req, res);

    expect(UserMock.findOne.called).to.be.true;
    expect(
      UserMock.findOne.calledWith({ where: { email: mocks.validUser.email } })
    ).to.be.true;
    expect(UserMock.count.called).to.be.true;
    expect(TokenMock.create.called).to.be.false;
    expect(commit.called).to.be.false;
    expect(rollback.called).to.be.true;

    expect(res.status.args[0][0]).to.be.equal(400);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      error: "Error registering user by invite",
    });
    expect(body).not.to.have.property("token");
  });
  it("register - should return the created user and the token if there isn't any user created", async () => {
    UserMock.count = sinon.stub(User, "count").resolves(0);
    UserMock.create = sinon.stub(User, "create").resolves(mocks.validUser);
    UserMock.findOne = sinon.stub(User, "findOne").resolves(false);
    TokenMock.create = sinon.stub(Token, "create").resolves();
    req.body = mocks.validUser;
    await auth.register(req, res);

    expect(UserMock.findOne.called).to.be.true;
    expect(
      UserMock.findOne.calledWith({ where: { email: mocks.validUser.email } })
    ).to.be.true;
    expect(UserMock.count.called).to.be.true;
    expect(TokenMock.create.called).to.be.true;

    expect(res.status.args[0][0]).to.be.equal(201);
    const body = res.json.args[0][0];
    const { token, ...info } = body;
    expect(info).to.be.deep.equal({
      user: {
        email: "jane.doe@email.com",
        id: 1,
        name: "Jane",
        role: "admin",
        surname: "Doe",
      },
    });
    expect(body).to.have.property("token");
  });
  it("login - if the password doesn't match, should fail with status 401", async () => {
    UserMock.findOne = sinon.stub(User, "findOne").resolves(mocks.validUser);
    req.body = { ...mocks.validUser, password: "pass123" };
    await auth.login(req, res);
    expect(res.status.args[0][0]).to.be.equal(401);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      error: "Invalid credentials",
    });
    expect(body).not.to.have.property("token");
  });
  it("login - should return the user and a new Token", async () => {
    UserMock.findOne = sinon.stub(User, "findOne").resolves({
      ...mocks.validUser,
      password: "$2a$10$GaKE6gfYM/Br697DBHOV9.jZzK7isVa9W7tKID8bp6fqbt0jd3yMS",
    });
    TokenMock.create = sinon.stub(Token, "create").resolves();
    TokenMock.destroy = sinon.stub(Token, "destroy").resolves();
    req.body = { ...mocks.validUser };
    await auth.login(req, res);

    expect(UserMock.findOne.called).to.be.true;
    expect(
      UserMock.findOne.calledWith({ where: { email: mocks.validUser.email } })
    ).to.be.true;
    expect(TokenMock.destroy.called).to.be.true;
    expect(TokenMock.create.called).to.be.true;
    expect(TokenMock.create.args[0][0]).to.have.property("userId", 1);
    expect(TokenMock.create.args[0][0]).to.have.property("type", "auth");

    expect(res.status.args[0][0]).to.be.equal(200);
    const body = res.json.args[0][0];
    const { token, ...info } = body;
    expect(info).to.be.deep.equal({
      user: {
        email: "jane.doe@email.com",
        id: 1,
        name: "Jane",
        role: "admin",
        surname: "Doe",
        picture: "",
      },
    });
    expect(body).to.have.property("token");
  });
  it("login - if something goes wrong, should return status 500", async () => {
    UserMock.findOne = sinon.stub(User, "findOne").rejects();
    req.body = { ...mocks.validUser };
    await auth.login(req, res);

    expect(res.status.args[0][0]).to.be.equal(500);
    const body = res.json.args[0][0];
    const { token, ...info } = body;
    expect(info).to.be.deep.equal({
      error: "Internal Server Error",
    });
  });
  it("logout - should fail with status 401 if token is wrong", async () => {
    req.headers = {
      authorization: "",
    };
    await auth.logout(req, res);
    expect(res.status.args[0][0]).to.be.equal(401);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      error: "Invalid token",
    });
  });
  it("logout - should fail with status 401 if token in DB is different or missing", async () => {
    req.headers = {
      authorization: `Bearer ${fakeToken}`,
    };
    sinon.stub(jwt, "verify").returns({ id: 1 });
    TokenMock.findOne = sinon.stub(Token, "findOne").resolves(null);
    await auth.logout(req, res);
    expect(res.status.args[0][0]).to.be.equal(401);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      error: "Invalid token",
    });
  });
  it("logout - should delete the token and return status 200", async () => {
    req.headers = {
      authorization: `Bearer ${fakeToken}`,
    };
    const fakeResponseToken = {
      token: fakeToken,
      userId: 1,
      type: "auth",
      destroy: sinon.stub(),
    };
    TokenMock.findOne = sinon
      .stub(Token, "findOne")
      .resolves(fakeResponseToken);
    sinon.stub(jwt, "verify").returns({ id: 1 });
    await auth.logout(req, res);

    expect(TokenMock.findOne.called).to.be.true;

    expect(res.status.args[0][0]).to.be.equal(200);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      message: "Successfully logged out",
    });
    expect(body).not.to.have.property("token");
  });
  it("logout - if something goes wrong, should return status 500", async () => {
    req.headers = {
      authorization: `Bearer ${fakeToken}`,
    };
    TokenMock.findOne = sinon.stub(Token, "findOne").rejects();
    sinon.stub(jwt, "verify").returns({ id: 1 });
    await auth.logout(req, res);

    expect(res.status.args[0][0]).to.be.equal(500);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      error: "Internal Server Error",
    });
  });
  it("forgetPassword - should fail with status 400 iif email doesn't match", async () => {
    req.body = {
      email: "email@email.com",
    };
    UserMock.findOne = sinon.stub(User, "findOne").resolves(null);
    await auth.forgetPassword(req, res);

    expect(UserMock.findOne.called).to.be.true;

    expect(res.status.args[0][0]).to.be.equal(400);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      error: "User not found",
    });
  });
  it.skip("forgetPassword - should create a temporary token, send an email and return status 200", async () => {
    req.body = {
      email: mocks.validUser.email,
    };
    UserMock.findOne = sinon.stub(User, "findOne").resolves({
      ...mocks.validUser,
      password: "$2a$10$GaKE6gfYM/Br697DBHOV9.jZzK7isVa9W7tKID8bp6fqbt0jd3yMS",
    });
    TokenMock.create = sinon.stub(Token, "create").resolves();
    sinon.spy(emailService, "sendPasswordResetEmail");
    await auth.forgetPassword(req, res);

    expect(UserMock.findOne.called).to.be.true;
    expect(Token.create.called).to.be.true;

    expect(res.status.args[0][0]).to.be.equal(200);
    const body = res.json.args[0][0];
    expect(body).to.be.have.property("message", "Password reset token sent");
  });
  it("forgetPassword - if something goes wrong, should return status 500", async () => {
    req.body = {
      email: mocks.validUser.email,
    };
    UserMock.findOne = sinon.stub(User, "findOne").rejects();
    await auth.forgetPassword(req, res);

    expect(res.status.args[0][0]).to.be.equal(500);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      error: "Internal Server Error",
    });
  });
  it("resetPassword - should fail with status 400 if there is no token", async () => {
    req.body = {
      token: "Bearer",
    };
    TokenMock.findOne = sinon.stub(Token, "findOne").resolves({
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzMzMTkzMzkyfQ.XVYpcKA-qHrZGoDs9LJv042w0oqcBnzZPZTsXPgB0g4",
      userId: 1,
      type: "reset",
      expiresAt: "2144-11-18",
    });
    await auth.resetPassword(req, res);
    expect(res.status.args[0][0]).to.be.equal(400);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      error: "Invalid or expired token",
    });
  });
  it("resetPassword - should fail with status 400 if the token is wrong", async () => {
    req.body = {
      token: `Bearer ${fakeToken}`,
    };
    TokenMock.findOne = sinon.stub(Token, "findOne").resolves(null);
    sinon.stub(bcrypt, "compare");
    await auth.resetPassword(req, res);

    expect(TokenMock.findOne.called).to.be.true;

    expect(res.status.args[0][0]).to.be.equal(400);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      error: "Invalid or expired token",
    });
    expect(body).not.to.have.property("token");
  });
  it("resetPassword - should return status 200 and the correct message", async () => {
    req.body = {
      token: fakeToken,
      newPassword: "n3wP@ssword",
    };
    const fakeResponseToken = {
      token: fakeToken,
      userId: 1,
      type: "reset",
      destroy: sinon.stub(),
      expiresAt: "2144-11-18",
    };
    TokenMock.findOne = sinon
      .stub(Token, "findOne")
      .resolves(fakeResponseToken);
    sinon.stub(bcrypt, "compare").returns(true);
    UserMock.findOne = sinon.stub(User, "findOne").resolves({
      ...mocks.validUser,
      password: "$2a$10$GaKE6gfYM/Br697DBHOV9.jZzK7isVa9W7tKID8bp6fqbt0jd3yMS",
      save: sinon.stub(),
    });
    await auth.resetPassword(req, res);

    expect(TokenMock.findOne.called).to.be.true;

    expect(res.status.args[0][0]).to.be.equal(200);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      message: "Password reset successful",
    });
    expect(body).not.to.have.property("token");
  });
  it("resetPassword - if something goes wrong, should return status 500", async () => {
    req.body = {
      token: fakeToken,
      newPassword: "n3wP@ssword",
    };
    TokenMock.findOne = sinon.stub(Token, "findOne").rejects();
    await auth.resetPassword(req, res);

    expect(res.status.args[0][0]).to.be.equal(500);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      error: "Internal Server Error",
    });
    expect(body).not.to.have.property("token");
  });
});
