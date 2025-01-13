import { expect } from 'chai';
import { afterEach, beforeEach, describe, it } from 'mocha';
import waitOn from 'wait-on';
import db from '../../models/index.js';
import app from '../../server.js';
import mocks from '../mocks/user.mock.js';
import chai from './index.mjs';

const dbReadyOptions = {
  resources: ['tcp:localhost:5432'],
  delay: 1000,
  timeout: 30000,
  interval: 1000,
};

const setupTestDb = () => {
  beforeEach(async () => {
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
};

describe('E2e tests user', () => {
  let resetDb = async () => {
    const login = await chai.request.execute(app).post('/api/auth/register').send(mocks.validUser);
    return login.body.token;
  };
  describe('GET /api/users/users-list', () => {
    setupTestDb();
    it('should return a list of users with pagination and status code 200 if everything goes right', async () => {
      await resetDb();
      const result = await chai.request.execute(app).get('/api/users/users-list ');
      expect(result).to.have.status(200);
      expect(result.body).to.be.deep.equal({
        currentPage: 1,
        totalPages: 1,
        totalUsers: 1,
        users: [
          {
            email: 'jane.doe@email.com',
            name: 'Jane',
            role: 'admin',
            surname: 'Doe',
          },
        ],
      });
    });
  });
  describe('GET /api/users/current-user', () => {
    setupTestDb();
    it('should fail if the user is not logged', async () => {
      await resetDb();
      const result = await chai.request.execute(app).get('/api/users/current-user');
      expect(result).to.have.status(401);
      expect(result.body).to.be.deep.equal({
        error: 'No token provided',
      });
    });
    it('should return the user without the password if everything goes right', async () => {
      const token = await resetDb();
      const { password, picture: p, createdAt: c, ...expected } = mocks.validUser;
      const result = await chai.request
        .execute(app)
        .get('/api/users/current-user')
        .set('Authorization', `Bearer ${token}`);
      expect(result).to.have.status(200);
      const { picture, createdAt, ...body } = result.body.user;
      expect(body).to.be.deep.equal({ ...expected, role: 'admin' });
    });
  });
  describe('PUT /api/users/update', () => {
    setupTestDb();
    it('should fail if the user is not logged', async () => {
      await resetDb();
      const result = await chai.request.execute(app).put('/api/users/update');
      expect(result).to.have.status(401);
      expect(result.body).to.deep.equal({ error: 'No token provided' });
    });
    it('should fail if the request body is empty', async () => {
      const token = await resetDb();
      const result = await chai.request.execute(app).put('/api/users/update').set('Authorization', `Bearer ${token}`);
      expect(result).to.have.status(400);
      expect(result.body).to.deep.equal({
        updated: false,
        error: 'Error, no value(s) provided to update',
      });
    });
    it('should fail if the image is not an url or base64', async () => {
      const token = await resetDb();
      const result = await chai.request
        .execute(app)
        .put('/api/users/update')
        .set('Authorization', `Bearer ${token}`)
        .send({ picture: 'photo' });
      expect(result).to.have.status(400);
      expect(result.body).to.deep.equal({
        errors: [
          {
            location: 'body',
            msg: 'Picture must be either a valid URL or a base64 encoded string',
            path: 'picture',
            type: 'field',
            value: 'photo',
          },
        ],
        updated: false,
      });
    });
    it('should fail if the name is not a string', async () => {
      const token = await resetDb();
      const result = await chai.request
        .execute(app)
        .put('/api/users/update')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 25 });
      expect(result).to.have.status(400);
      expect(result.body).to.deep.equal({
        errors: [
          {
            location: 'body',
            msg: 'Invalid value',
            path: 'name',
            type: 'field',
            value: 25,
          },
        ],
        updated: false,
      });
    });
    it('should fail if the surname is not a string', async () => {
      const token = await resetDb();
      const result = await chai.request
        .execute(app)
        .put('/api/users/update')
        .set('Authorization', `Bearer ${token}`)
        .send({ surname: 32 });
      expect(result).to.have.status(400);
      expect(result.body).to.deep.equal({
        errors: [
          {
            location: 'body',
            msg: 'Invalid value',
            path: 'surname',
            type: 'field',
            value: 32,
          },
        ],
        updated: false,
      });
    });
    it('if everything goes right, should return the updated user without the password', async () => {
      const token = await resetDb();
      const result = await chai.request
        .execute(app)
        .put('/api/users/update')
        .set('Authorization', `Bearer ${token}`)
        .send({ picture: encodeURIComponent('https://picsum.photos/200/300') });
        expect(result).to.have.status(200);
        const { createdAt, ...body } = result.body.user;
      expect(body).to.be.deep.equal({
        picture: 'https://picsum.photos/200/300',
      });
    });
  });
  describe('DELETE /api/users/delete', () => {
    setupTestDb();
    it('should return status code 500 and the title error code DELETE_USER_ERROR if something goes wrong', async () => {
      await resetDb();
      const result = await chai.request.execute(app).delete('/api/users/delete');
      expect(result).to.have.status(401);
      expect(result.body).to.deep.equal({
        error: 'No token provided',
      });
    });
    it('should return status code 500 and the correct response if only one admin is present', async () => {
      const token = await resetDb();
      const result = await chai.request
        .execute(app)
        .delete('/api/users/delete')
        .set('Authorization', `Bearer ${token}`);
      expect(result).to.have.status(500);
      expect(result.body).to.deep.equal({
        error: 'Internal Server Error',
        message: "Error deleting user ~ The team has only single admin and can't delete themselves",
        errorCode: 'DELETE_USER_ERROR',
      });
    });
    it("should return the message 'User deleted successfully' if everything goes right", async () => {
      await resetDb();
      const newLogin = await chai.request.execute(app).post('/api/auth/register').send(mocks.validList[2]);
      const newToken = newLogin.body.token;
      const result = await chai.request
        .execute(app)
        .delete('/api/users/delete')
        .set('Authorization', `Bearer ${newToken}`);
      expect(result).to.have.status(200);
      expect(result.body).to.deep.equal({
        message: 'User deleted successfully',
      });
    });
  });
});
