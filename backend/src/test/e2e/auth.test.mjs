import { expect } from 'chai';
import { afterEach, beforeEach, describe, it } from 'mocha';
import waitOn from 'wait-on';
import db from '../../models/index.js';
import app from '../../server.js';
import mocks from '../mocks/user.mock.js';
import chai from './index.mjs';

const user = mocks.UserBuilder.user;

describe('E2e tests auth', () => {
  describe('POST /api/auth/register', () => {
    beforeEach(async () => {
      const dbReadyOptions = {
        resources: ['tcp:localhost:5432'],
        delay: 1000,
        timeout: 30000,
        interval: 1000,
      };

      try {
        await waitOn(dbReadyOptions);
      } catch (err) {
        console.error('Database not ready in time:', err);
        throw err;
      }
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it('should return the user info and a token if everything goes right', async () => {
      const result = await chai.request.execute(app).post('/api/auth/register').send(user().build());
      expect(result).to.have.status(201);
      const { token, ...info } = result.body;
      expect(info).to.be.deep.equal({
        user: {
          email: 'jane.doe@email.com',
          id: 1,
          name: 'Jane',
          role: 'admin',
          surname: 'Doe',
        },
      });
      expect(result.body).to.have.property('token');
    });
    it('should return status 400 in the name has an invalid format', async () => {
      const result = await chai.request.execute(app).post('/api/auth/register').send(user().invalidName().build());
      expect(result).to.have.status(400);
      const { token, ...info } = result.body;
      expect(info).to.be.deep.equal({
        errors: ['Name can only contain letters, hyphens and apostrophes'],
      });
    });
    it('should return status 400 in the surname has an invalid format', async () => {
      const result = await chai.request.execute(app).post('/api/auth/register').send(user().invalidSurname().build());
      expect(result).to.have.status(400);
      const { token, ...info } = result.body;
      expect(info).to.be.deep.equal({
        errors: ['Name can only contain letters, hyphens and apostrophes'],
      });
    });
    it('should return status 400 in the email has an invalid format', async () => {
      const result = await chai.request.execute(app).post('/api/auth/register').send(user().invalidEmail().build());
      expect(result).to.have.status(400);
      const { token, ...info } = result.body;
      expect(info).to.be.deep.equal({
        errors: ['Invalid email address'],
      });
    });
    it('should return status 400 in the password has an invalid format', async () => {
      const result = await chai.request
        .execute(app)
        .post('/api/auth/register')
        .send(user().invalidPasswordChar().build());
      expect(result).to.have.status(400);
      const { token, ...info } = result.body;
      expect(info).to.be.deep.equal({
        errors: ['Must contain one special character'],
      });

      await db.sequelize.truncate({ cascade: true, restartIdentity: true });
      const result2 = await chai.request
        .execute(app)
        .post('/api/auth/register')
        .send(user().invalidPasswordLength().build());
      expect(result2).to.have.status(400);
      const { token: t, ...info2 } = result2.body;
      expect(info2).to.be.deep.equal({
        errors: ['Must be at least 8 characters'],
      });
    });
    it('should return status 400 in the name is missing', async () => {
      const result = await chai.request.execute(app).post('/api/auth/register').send(user().missingName().build());
      expect(result).to.have.status(400);
      const { token, ...info } = result.body;
      expect(info).to.be.deep.equal({
        errors: ['Name is required', 'Name can only contain letters, hyphens and apostrophes'],
      });
    });
    it('should return status 400 in the surname is missing', async () => {
      const result = await chai.request.execute(app).post('/api/auth/register').send(user().missingSurname().build());
      expect(result).to.have.status(400);
      const { token, ...info } = result.body;
      expect(info).to.be.deep.equal({
        errors: ['Surname is required', 'Name can only contain letters, hyphens and apostrophes'],
      });
    });
    it('should return status 400 in the email is missing', async () => {
      const result = await chai.request.execute(app).post('/api/auth/register').send(user().missingEmail().build());
      expect(result).to.have.status(400);
      const { token, ...info } = result.body;
      expect(info).to.be.deep.equal({
        errors: ['Invalid email address'],
      });
    });
    it('should return status 400 in the password is missing', async () => {
      const result = await chai.request.execute(app).post('/api/auth/register').send(user().missingPassword().build());
      expect(result).to.have.status(400);
      const { token, ...info } = result.body;
      expect(info).to.be.deep.equal({
        errors: ['Must be at least 8 characters', 'Must contain one special character'],
      });
    });
  });
  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await chai.request.execute(app).post('/api/auth/register').send(user().build());
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it('should return the user info and a token if everything goes right', async () => {
      const result = await chai.request.execute(app).post('/api/auth/login').send(user().build());
      expect(result).to.have.status(200);
      const { token, ...info } = result.body;
      expect(info).to.be.deep.equal({
        user: {
          email: 'jane.doe@email.com',
          id: 1,
          name: 'Jane',
          role: 'admin',
          surname: 'Doe',
          picture: '',
        },
      });
      expect(result.body).to.have.property('token');
    });
    it('should return status 400 in the email has an invalid format', async () => {
      const result = await chai.request.execute(app).post('/api/auth/login').send(user().invalidEmail().build());
      expect(result).to.have.status(400);
      const { token, ...info } = result.body;
      expect(info).to.be.deep.equal({
        errors: ['Invalid email address'],
      });
    });
    it('should return status 401 in the password has an invalid format', async () => {
      const result = await chai.request.execute(app).post('/api/auth/login').send(user().invalidPasswordChar().build());
      expect(result).to.have.status(401);
      const { token, ...info } = result.body;
      expect(info).to.be.deep.equal({
        error: 'Invalid credentials',
      });

      const result2 = await chai.request
        .execute(app)
        .post('/api/auth/login')
        .send(user().invalidPasswordLength().build());
      expect(result2).to.have.status(401);
      const { token: t, ...info2 } = result2.body;
      expect(info2).to.be.deep.equal({
        error: 'Invalid credentials',
      });
    });
    it('should return status 400 in the email is empty', async () => {
      const result = await chai.request.execute(app).post('/api/auth/login').send(user().missingEmail().build());
      expect(result).to.have.status(400);
      const { token, ...info } = result.body;
      expect(info).to.be.deep.equal({
        errors: ['Invalid email address', 'Email is required'],
      });
    });
    it('should return status 400 in the password is empty', async () => {
      await db.sequelize.truncate({ cascade: true, restartIdentity: true });
      const result = await chai.request.execute(app).post('/api/auth/register').send(user().missingPassword().build());
      expect(result).to.have.status(400);
      const { token, ...info } = result.body;
      expect(info).to.be.deep.equal({
        errors: ['Must be at least 8 characters', 'Must contain one special character'],
      });
    });
  });
  describe('POST /api/auth/logout', () => {
    let token;
    beforeEach(async () => {
      const login = await chai.request.execute(app).post('/api/auth/register').send(user().build());
      token = login.body.token;
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it('should return status 200 and message if everything is right', async () => {
      const result = await chai.request.execute(app).post('/api/auth/logout').set('Authorization', `Bearer ${token}`);
      expect(result).to.have.status(200);
      expect(result.body).to.be.deep.equal({
        message: 'Successfully logged out',
      });
    });
    it('should fail if the token is invalid or missing', async () => {
      const result = await chai.request.execute(app).post('/api/auth/logout');
      expect(result).to.have.status(401);
      expect(result.body).to.be.deep.equal({
        error: 'No token provided',
      });
    });
  });
  describe.skip("POST /api/auth/forget-password", () => {
    beforeEach(async () => {
      await chai.request.execute(app).post('/api/auth/register').send(user().build());
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it('should return status 200 and message if everything is right', async () => {
      const result = await chai.request
        .execute(app)
        .post('/api/auth/forget-password')
        .send({ email: user().build().email });
      expect(result).to.have.status(200);
      expect(result.body).to.be.have.property('message', 'Password reset token sent');
    });
    it('should return status 400 in the email has an invalid format', async () => {
      const result = await chai.request
        .execute(app)
        .post('/api/auth/forget-password')
        .send(user().invalidEmail().build());
      expect(result).to.have.status(400);
      const { token, ...info } = result.body;
      expect(info).to.be.deep.equal({
        errors: ['Invalid email address'],
      });
    });
    it('should return status 400 in the email is empty', async () => {
      const result = await chai.request
        .execute(app)
        .post('/api/auth/forget-password')
        .send(user().missingEmail().build());
      expect(result).to.have.status(400);
      const { token, ...info } = result.body;
      expect(info).to.be.deep.equal({
        errors: ['Invalid email address'],
      });
    });
  });
  describe.skip("POST /api/auth/reset-password", () => {
    let token;
    beforeEach(async () => {
      await chai.request.execute(app).post('/api/auth/register').send(user().build());
      const response = await chai.request
        .execute(app)
        .post('/api/auth/forget-password')
        .send({ email: user().build().email });
      token = response.body.resetToken;
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it('should return status 200 if everything goes right', async () => {
      const result = await chai.request
        .execute(app)
        .post('/api/auth/reset-password')
        .send({ token, newPassword: '321drowss@P' });
      expect(result).to.have.status(200);
      expect(result.body).to.be.deep.equal({
        message: 'Password reset successful',
      });
    });
    it('should return status 400 in the token is empty', async () => {
      const result = await chai.request
        .execute(app)
        .post('/api/auth/reset-password')
        .send({ token: '', newPassword: '321drowss@P' });
      expect(result).to.have.status(400);
      expect(result.body).to.be.deep.equal({
        errors: ['Token is required'],
      });
    });
    it('should return status 400 in the new password has an invalid format', async () => {
      const result = await chai.request
        .execute(app)
        .post('/api/auth/reset-password')
        .send({ token, newPassword: user().invalidPasswordChar().build() });
      expect(result).to.have.status(400);
      expect(result.body).to.be.deep.equal({
        errors: ['Must contain one special character'],
      });
    });
    it('should return status 400 if the new password is empty', async () => {
      const result = await chai.request.execute(app).post('/api/auth/reset-password').send({ token, newPassword: '' });
      expect(result).to.have.status(400);
      expect(result.body).to.be.deep.equal({
        errors: ['Must be atleast 8 characters', 'Must contain one special character'],
      });
    });
  });
});
