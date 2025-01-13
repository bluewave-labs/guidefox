const { describe, it, afterEach, beforeEach, before, after } = require("mocha");
const { expect } = require("chai");
const sinon = require("sinon");
const service = require("../../../service/email.service.js");
const fs = require("fs");
const path = require("path");
const { UserBuilder } = require("../../mocks/user.mock.js");
const handlebars = require("handlebars");

const db = require("../../../models/index.js");
const User = db.User;
const user = UserBuilder.user;

describe("Test email service", () => {
  let readFile;
  let transporterMock;
  let envOrig;
  before(() => {
    envOrig = JSON.stringify(process.env);
  });

  after(() => {
    process.env = JSON.parse(envOrig);
  });
  beforeEach(() => {
    readFile = sinon.stub(fs, "readFileSync");
    transporterMock = sinon.stub(service.transporter, "sendMail");
    sinon.stub(path, "join").callsFake((...args) => args.join("/"));
    sinon
      .stub(handlebars, "compile")
      .callsFake((html) => (replacements) => html);
  });
  afterEach(sinon.restore);
  it("findUserByEmail - should return the user if it is found", async () => {
    User.findOne = sinon.stub(User, "findOne").resolves(user().build());
    const result = await service.findUserByEmail(user().build().email);
    expect(result).to.deep.equal(user().build());
    const params = User.findOne.getCall(0).args[0];
    expect(params).to.deep.equal({ where: { email: user().build().email } });
  });
  it("findUserByEmail - should return null if it isn't found", async () => {
    User.findOne = sinon.stub(User, "findOne").resolves(null);
    const result = await service.findUserByEmail(user().build().email);
    expect(result).to.be.null;
    const params = User.findOne.getCall(0).args[0];
    expect(params).to.deep.equal({ where: { email: user().build().email } });
  });
  it("sendSignupEmail - if email is not enabled, should return undefined", async () => {
    process.env.EMAIL_ENABLE = "false";
    const result = await service.sendSignupEmail(
      user().build().email,
      user().build().name
    );
    expect(result).to.be.undefined;
    expect(readFile.called).to.be.false;
  });
  it("sendSignupEmail - should send the email with the sing up content", async () => {
    process.env.EMAIL_ENABLE = "true";
    await readFile.resolves("html");
    await service.sendSignupEmail(user().build().email, user().build().name);
    expect(readFile.called).to.be.true;
    const params = transporterMock.getCall(0).args[0];
    expect(transporterMock.called).to.be.true;
    expect(params).to.deep.equal({
      from: process.env.EMAIL,
      to: user().build().email,
      subject: "Welcome to Our Service",
      html: "html",
    });
  });
  it("sendPasswordResetEmail - if email is not enabled, should return undefined", async () => {
    process.env.EMAIL_ENABLE = "false";
    const result = await service.sendPasswordResetEmail(
      user().build().email,
      user().build().name,
      "token"
    );
    expect(result).to.be.undefined;
    expect(readFile.called).to.be.false;
  });
  it("sendPasswordResetEmail - should send the email with the reset password content", async () => {
    process.env.EMAIL_ENABLE = "true";
    await readFile.resolves("html");
    await service.sendPasswordResetEmail(
      user().build().email,
      user().build().name,
      "token"
    );
    expect(readFile.called).to.be.true;
    const params = transporterMock.getCall(0).args[0];
    expect(transporterMock.called).to.be.true;
    expect(params).to.deep.equal({
      from: process.env.EMAIL,
      to: user().build().email,
      subject: "Reset your password for Guidefox",
      html: "html",
    });
  });
});
