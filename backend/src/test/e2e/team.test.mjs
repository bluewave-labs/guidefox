import { expect } from 'chai';
import { afterEach, beforeEach, describe, it } from 'mocha';
import waitOn from 'wait-on';
import db from '../../models/index.js';
import app from '../../server.js';
import mocks, { validList } from '../mocks/user.mock.js';
import chai from './index.mjs';

const user = mocks.UserBuilder.user;
const dbReadyOptions = {
  resources: ['tcp:localhost:5432'],
  delay: 1000,
  timeout: 30000,
  interval: 1000,
};

describe('E2e tests team', () => {
  describe('GET /api/team/details', () => {
    let token;
    beforeEach(async () => {
      process.env.NODE_ENV = 'test';
      try {
        await waitOn(dbReadyOptions);
      } catch (err) {
        console.error('Database not ready in time:', err);
        throw err;
      }
      const login = await chai.request.execute(app).post('/api/auth/register').send(user().build());
      token = login.body.token;
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it('should return status 401 if no token is provided', async () => {
      const response = await chai.request.execute(app).get('/api/team/details');
      expect(response).to.have.status(401);
      expect(response.body).to.be.deep.equal({ error: 'No token provided' });
    });
    it('should return status 500 if no team was created', async () => {
      const response = await chai.request.execute(app).get('/api/team/details').set('Authorization', `Bearer ${token}`);
      expect(response).to.have.status(500);
      expect(response.body).to.be.deep.equal({
        error: 'Internal Server Error',
        errorCode: 'GET_TEAM_ERROR',
        message: 'Team data not found',
      });
    });
    it('should return status 200 and the team and list of users if everything goes right', async () => {
      await chai.request
        .execute(app)
        .post('/api/team/set-organisation')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'team' });
      await chai.request
        .execute(app)
        .post('/api/team/invite')
        .set('Authorization', `Bearer ${token}`)
        .send({ invitedEmail: validList[1].email, role: 'member' });
      const response = await chai.request.execute(app).get('/api/team/details').set('Authorization', `Bearer ${token}`);
      expect(response).to.have.status(200);
      expect(response.body).to.have.property('name');
      expect(response.body).to.have.property('users');
    });
  });
  describe('GET /api/team/count', () => {
    let token;
    beforeEach(async () => {
      process.env.NODE_ENV = 'test';
      try {
        await waitOn(dbReadyOptions);
      } catch (err) {
        console.error('Database not ready in time:', err);
        throw err;
      }
      const login = await chai.request.execute(app).post('/api/auth/register').send(user().build());
      token = login.body.token;
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it('should return status 200 if everything goes right', async () => {
      const response = await chai.request.execute(app).get('/api/team/count').set('Authorization', `Bearer ${token}`);
      expect(response).to.have.status(200);
      expect(response.body).to.have.property('teamExists', false);
    });
  });
  describe('POST /api/team/set-organisation', () => {
    let token;
    beforeEach(async () => {
      process.env.NODE_ENV = 'test';
      try {
        await waitOn(dbReadyOptions);
      } catch (err) {
        console.error('Database not ready in time:', err);
        throw err;
      }
      const login = await chai.request.execute(app).post('/api/auth/register').send(user().build());
      token = login.body.token;
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it('should return status 401 if no token is provided', async () => {
      const response = await chai.request.execute(app).post('/api/team/set-organisation').send({ name: 'team' });
      expect(response).to.have.status(401);
      expect(response.body).to.be.deep.equal({ error: 'No token provided' });
    });
    it("should return status 403 if the user don't have the permission", async () => {
      process.env.NODE_ENV = 'not-test';
      await chai.request
        .execute(app)
        .post('/api/team/invite')
        .set('Authorization', `Bearer ${token}`)
        .send({ invitedEmail: validList[1].email, role: 'member' });
      const login = await chai.request
        .execute(app)
        .post('/api/auth/register')
        .send({ ...validList[1], role: 2 });
      const newToken = login.body.token;
      const response = await chai.request
        .execute(app)
        .post('/api/team/set-organisation')
        .set('Authorization', `Bearer ${newToken}`)
        .send({ name: 'team' });
      expect(response).to.have.status(403);
      expect(response.body).to.be.deep.equal({
        error: 'User does not have required access level',
      });
    });
    it('should return status 400 if no name is passed', async () => {
      const response = await chai.request
        .execute(app)
        .post('/api/team/set-organisation')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      expect(response).to.have.status(400);
      expect(response.body).to.be.deep.equal({
        errors: [
          'Organization name is required and should be a non-empty string',
          'Organization name contains invalid characters',
        ],
      });
    });
    it('should return status 400 if name is invalid', async () => {
      const response = await chai.request
        .execute(app)
        .post('/api/team/set-organisation')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: ' ' });
      expect(response).to.have.status(400);
      expect(response.body).to.be.deep.equal({
        errors: [
          'Organization name is required and should be a non-empty string',
          'Organization name contains invalid characters',
        ],
      });
    });
    it('should return status 400 if name is bigger than 100 characters', async () => {
      const response = await chai.request
        .execute(app)
        .post('/api/team/set-organisation')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'a'.repeat(101) });
      expect(response).to.have.status(400);
      expect(response.body).to.be.deep.equal({
        errors: ['Organization name cannot exceed 100 characters'],
      });
    });
    it('should return status 400 if name has invalid characters', async () => {
      const response = await chai.request
        .execute(app)
        .post('/api/team/set-organisation')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'a$' });
      expect(response).to.have.status(400);
      expect(response.body).to.be.deep.equal({
        errors: ['Organization name contains invalid characters'],
      });
    });
    it('should return status 400 if a team is already created', async () => {
      await chai.request
        .execute(app)
        .post('/api/team/set-organisation')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'team' });
      const response = await chai.request
        .execute(app)
        .post('/api/team/set-organisation')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'team' });
      expect(response).to.have.status(400);
      expect(response.body).to.be.deep.equal({
        error: 'Cannot create more than one team.',
      });
    });
    it('should return status 201 and the created team if everything goes right', async () => {
      const response = await chai.request
        .execute(app)
        .post('/api/team/set-organisation')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'team' });
      expect(response).to.have.status(201);
      expect(response.body).to.have.property('message', 'Organization created successfully');
    });
  });
  describe('POST /api/team/invite', () => {
    let token;
    beforeEach(async () => {
      process.env.NODE_ENV = 'test';
      try {
        await waitOn(dbReadyOptions);
      } catch (err) {
        console.error('Database not ready in time:', err);
        throw err;
      }
      const login = await chai.request.execute(app).post('/api/auth/register').send(user().build());
      token = login.body.token;
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it('should return status 401 if no token is provided', async () => {
      const response = await chai.request.execute(app).post('/api/team/invite');
      expect(response).to.have.status(401);
      expect(response.body).to.be.deep.equal({ error: 'No token provided' });
    });
    it("should return status 403 if the user don't have the permission", async () => {
      process.env.NODE_ENV = 'not-test';
      await chai.request
        .execute(app)
        .post('/api/team/invite')
        .set('Authorization', `Bearer ${token}`)
        .send({ invitedEmail: validList[1].email, role: 'member' });
      const login = await chai.request
        .execute(app)
        .post('/api/auth/register')
        .send({ ...validList[1], role: 2 });
      const newToken = login.body.token;
      const response = await chai.request
        .execute(app)
        .post('/api/team/invite')
        .set('Authorization', `Bearer ${newToken}`)
        .send({ invitedEmail: validList[2].email, role: 'member' });
      expect(response).to.have.status(403);
      expect(response.body).to.be.deep.equal({
        error: 'User does not have required access level',
      });
    });
    it('should return status 200 if everything works', async () => {
      const response = await chai.request
        .execute(app)
        .post('/api/team/invite')
        .set('Authorization', `Bearer ${token}`)
        .send({ invitedEmail: validList[1].email, role: 'member' });
      expect(response).to.have.status(200);
      expect(response.body).to.have.property('message', 'Invite sent successfully');
    });
  });
  describe('PUT /api/team/update', () => {
    let token;
    beforeEach(async () => {
      process.env.NODE_ENV = 'test';
      try {
        await waitOn(dbReadyOptions);
      } catch (err) {
        console.error('Database not ready in time:', err);
        throw err;
      }
      const login = await chai.request.execute(app).post('/api/auth/register').send(user().build());
      token = login.body.token;
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it('should return status 401 if no token is provided', async () => {
      const response = await chai.request.execute(app).put('/api/team/update');
      expect(response).to.have.status(401);
      expect(response.body).to.be.deep.equal({ error: 'No token provided' });
    });
    it("should return status 403 if the user don't have the permission", async () => {
      process.env.NODE_ENV = 'not-test';
      await chai.request
        .execute(app)
        .post('/api/team/invite')
        .set('Authorization', `Bearer ${token}`)
        .send({ invitedEmail: validList[1].email, role: 'member' });
      const login = await chai.request
        .execute(app)
        .post('/api/auth/register')
        .send({ ...validList[1], role: 2 });
      const newToken = login.body.token;
      const response = await chai.request
        .execute(app)
        .put('/api/team/update')
        .set('Authorization', `Bearer ${newToken}`)
        .send({ name: 'team' });
      expect(response).to.have.status(403);
      expect(response.body).to.be.deep.equal({
        error: 'User does not have required access level',
      });
    });
    it('should return status 200 if everything goes right', async () => {
      await chai.request
        .execute(app)
        .post('/api/team/set-organisation')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'team' });
      const response = await chai.request
        .execute(app)
        .put('/api/team/update')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'new team' });
      expect(response).to.have.status(200);
      expect(response.body).to.have.property('message', 'Team Details Updated Successfully');
    });
  });
  describe('PUT /api/team/change-role', () => {
    let token;
    beforeEach(async () => {
      process.env.NODE_ENV = 'test';
      try {
        await waitOn(dbReadyOptions);
      } catch (err) {
        console.error('Database not ready in time:', err);
        throw err;
      }
      const login = await chai.request.execute(app).post('/api/auth/register').send(user().build());
      token = login.body.token;
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it('should return status 401 if no token is provided', async () => {
      const response = await chai.request.execute(app).put('/api/team/change-role');
      expect(response).to.have.status(401);
      expect(response.body).to.be.deep.equal({ error: 'No token provided' });
    });
    it("should return status 403 if the user don't have the permission", async () => {
      process.env.NODE_ENV = 'not-test';
      await chai.request
        .execute(app)
        .post('/api/team/invite')
        .set('Authorization', `Bearer ${token}`)
        .send({ invitedEmail: validList[1].email, role: 'member' });
      const login = await chai.request
        .execute(app)
        .post('/api/auth/register')
        .send({ ...validList[1], role: 2 });
      const newToken = login.body.token;
      const response = await chai.request
        .execute(app)
        .put('/api/team/change-role')
        .set('Authorization', `Bearer ${newToken}`)
        .send({ memberId: 2, role: 'admin' });
      expect(response).to.have.status(403);
      expect(response.body).to.be.deep.equal({
        error: 'User does not have required access level',
      });
    });
    it('should return status 500 if the member is not found', async () => {
      const response = await chai.request
        .execute(app)
        .put('/api/team/change-role')
        .set('Authorization', `Bearer ${token}`)
        .send({ memberId: 2, role: 'admin' });
      expect(response).to.have.status(500);
      expect(response.body).to.be.deep.equal({
        error: 'Internal Server Error',
        errorCode: 'CHANGE_ROLE_ERROR',
        message: 'Failed to update user role ~ User Not Found',
      });
    });
    it('should return status 500 if the team has only one admin', async () => {
      await chai.request
        .execute(app)
        .post('/api/team/set-organisation')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'team' });
      const response = await chai.request
        .execute(app)
        .put('/api/team/change-role')
        .set('Authorization', `Bearer ${token}`)
        .send({ memberId: 1, role: 'member' });
      expect(response).to.have.status(500);
      expect(response.body).to.be.deep.equal({
        error: 'Internal Server Error',
        errorCode: 'CHANGE_ROLE_ERROR',
        message: "Failed to update user role ~ The team has only single admin and its role can't be changed",
      });
    });
    it('should return status 200 if everything goes right', async () => {
      await chai.request
        .execute(app)
        .post('/api/team/set-organisation')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'team' });
      await chai.request
        .execute(app)
        .post('/api/team/invite')
        .set('Authorization', `Bearer ${token}`)
        .send({ invitedEmail: validList[1].email, role: 'member' });
      await chai.request.execute(app).post('/api/auth/register').send(validList[1]);
      const response = await chai.request
        .execute(app)
        .put('/api/team/change-role')
        .set('Authorization', `Bearer ${token}`)
        .send({ memberId: 2, role: 'admin' });
      expect(response).to.have.status(200);
      expect(response.body).to.be.deep.equal({
        message: 'User Role Updated Successfully',
      });
    });
  });
  describe('DELETE /api/team/remove/:memberId', () => {
    let token;
    beforeEach(async () => {
      process.env.NODE_ENV = 'test';
      try {
        await waitOn(dbReadyOptions);
      } catch (err) {
        console.error('Database not ready in time:', err);
        throw err;
      }
      const login = await chai.request.execute(app).post('/api/auth/register').send(user().build());
      token = login.body.token;
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it('should return status 401 if no token is provided', async () => {
      const response = await chai.request.execute(app).delete('/api/team/remove/1');
      expect(response).to.have.status(401);
      expect(response.body).to.be.deep.equal({ error: 'No token provided' });
    });
    it("should return status 403 if the user don't have the permission", async () => {
      process.env.NODE_ENV = 'not-test';
      await chai.request
        .execute(app)
        .post('/api/team/invite')
        .set('Authorization', `Bearer ${token}`)
        .send({ invitedEmail: validList[1].email, role: 'member' });
      const login = await chai.request
        .execute(app)
        .post('/api/auth/register')
        .send({ ...validList[1], role: 2 });
      const newToken = login.body.token;
      const response = await chai.request
        .execute(app)
        .delete('/api/team/remove/2')
        .set('Authorization', `Bearer ${newToken}`);
      expect(response).to.have.status(403);
      expect(response.body).to.be.deep.equal({
        error: 'User does not have required access level',
      });
    });
    it('should return status 500 if the userId is equal to the memberId', async () => {
      const response = await chai.request
        .execute(app)
        .delete('/api/team/remove/1')
        .set('Authorization', `Bearer ${token}`);
      expect(response).to.have.status(500);
      expect(response.body).to.be.deep.equal({
        error: 'Internal Server Error',
        errorCode: 'REMOVE_USER_ERROR',
        message: "Failed to remove user from team ~ User can't remove itself through team list",
      });
    });
    it('should return status 500 if the user to be removed is not found', async () => {
      const response = await chai.request
        .execute(app)
        .delete('/api/team/remove/2')
        .set('Authorization', `Bearer ${token}`);
      expect(response).to.have.status(500);
      expect(response.body).to.be.deep.equal({
        error: 'Internal Server Error',
        errorCode: 'REMOVE_USER_ERROR',
        message: 'Failed to remove user from team ~ User to be removed not found',
      });
    });
    it('should return status 200 if everything goes right', async () => {
      await chai.request
        .execute(app)
        .post('/api/team/set-organisation')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'team' });
      await chai.request
        .execute(app)
        .post('/api/team/invite')
        .set('Authorization', `Bearer ${token}`)
        .send({ invitedEmail: validList[1].email, role: 'member' });
      await chai.request.execute(app).post('/api/auth/register').send(validList[1]);
      const response = await chai.request
        .execute(app)
        .delete('/api/team/remove/2')
        .set('Authorization', `Bearer ${token}`);
      expect(response).to.have.status(200);
      expect(response.body).to.be.deep.equal({
        message: 'User Removed from Team Successfully',
      });
    });
  });
  describe('GET /api/team/get-all-invites', () => {
    let token;
    beforeEach(async () => {
      process.env.NODE_ENV = 'test';
      try {
        await waitOn(dbReadyOptions);
      } catch (err) {
        console.error('Database not ready in time:', err);
        throw err;
      }
      const login = await chai.request.execute(app).post('/api/auth/register').send(user().build());
      token = login.body.token;
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it('should return status 401 if no token is provided', async () => {
      const response = await chai.request.execute(app).get('/api/team/get-all-invites');
      expect(response).to.have.status(401);
      expect(response.body).to.be.deep.equal({ error: 'No token provided' });
    });
    it("should return status 403 if the user don't have the permission", async () => {
      process.env.NODE_ENV = 'not-test';
      await chai.request
        .execute(app)
        .post('/api/team/invite')
        .set('Authorization', `Bearer ${token}`)
        .send({ invitedEmail: validList[1].email, role: 'member' });
      const login = await chai.request
        .execute(app)
        .post('/api/auth/register')
        .send({ ...validList[1], role: 2 });
      const newToken = login.body.token;
      const response = await chai.request
        .execute(app)
        .get('/api/team/get-all-invites')
        .set('Authorization', `Bearer ${newToken}`);
      expect(response).to.have.status(403);
      expect(response.body).to.be.deep.equal({
        error: 'User does not have required access level',
      });
    });
    it('should return status 200 all the invites', async () => {
      await chai.request
        .execute(app)
        .post('/api/team/invite')
        .set('Authorization', `Bearer ${token}`)
        .send({ invitedEmail: validList[1].email, role: 'member' });
      const response = await chai.request
        .execute(app)
        .get('/api/team/get-all-invites')
        .set('Authorization', `Bearer ${token}`);
      expect(response).to.have.status(200);
      const {
        invites: [{ createdAt, ...invite }],
        message,
        success,
      } = response.body;
      expect(message).to.be.equal('Invites Retrieved Successfully');
      expect(success).to.be.true;
      expect(invite).to.deep.equal({
        id: 1,
        invitedBy: 1,
        invitedEmail: validList[1].email,
        role: '2',
      });
    });
  });
});
