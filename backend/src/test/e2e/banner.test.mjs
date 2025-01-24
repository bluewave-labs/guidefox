import { expect } from 'chai';
import { afterEach, beforeEach, describe } from 'mocha';
import waitOn from 'wait-on';
import db from '../../models/index.js';
import app from '../../server.js';
import { BannerBuilder } from '../mocks/banner.mock.js';
import userMocks from '../mocks/user.mock.js';
import chai from './index.mjs';

const banner = BannerBuilder.banner;

const user = userMocks.UserBuilder.user;
const dbReadyOptions = {
  resources: ['tcp:localhost:5432'],
  delay: 1000,
  timeout: 30000,
  interval: 1000,
};

describe('E2e tests banner', () => {
  describe('POST /api/banner/add_banner', () => {
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
    it('should return 401 if no token is provided', async () => {
      const result = await chai.request.execute(app).post('/api/banner/add_banner').send(banner().build());
      expect(result).to.have.status(401);
      const body = result.body;
      expect(body).to.be.deep.equal({ error: 'No token provided' });
    });
    it('should return 403 if user does not have required access level', async () => {
      process.env.NODE_ENV = 'not-test';
      await chai.request
        .execute(app)
        .post('/api/team/invite')
        .set('Authorization', `Bearer ${token}`)
        .send({ invitedEmail: userMocks.validList[1].email, role: 'member' });
      const login = await chai.request
        .execute(app)
        .post('/api/auth/register')
        .send({ ...userMocks.validList[1], role: 2 });
      const newToken = login.body.token;
      const result = await chai.request
        .execute(app)
        .post('/api/banner/add_banner')
        .set('Authorization', `Bearer ${newToken}`)
        .send(banner().build());
      expect(result).to.have.status(403);
      const body = result.body;
      expect(body).to.be.deep.equal({
        error: 'User does not have required access level',
      });
    });
    it('should return status 400 if the repetitionType is missing', async () => {
      const result = await chai.request
        .execute(app)
        .post('/api/banner/add_banner')
        .set('Authorization', `Bearer ${token}`)
        .send(banner().missingRepetitionType().build());
      expect(result).to.have.status(400);
      const body = result.body;
      expect(body).to.be.deep.equal({
        errors: ['Repetition type is required'],
      });
    });
    it('should return status 400 if the position is missing', async () => {
      const result = await chai.request
        .execute(app)
        .post('/api/banner/add_banner')
        .set('Authorization', `Bearer ${token}`)
        .send(banner().missingPosition().build());
      expect(result).to.have.status(400);
      const body = result.body;
      expect(body).to.be.deep.equal({
        errors: ['Position is required'],
      });
    });
    it('should return status 400 if the closeButtonAction is missing', async () => {
      const result = await chai.request
        .execute(app)
        .post('/api/banner/add_banner')
        .set('Authorization', `Bearer ${token}`)
        .send(banner().missingCloseButtonAction().build());
      expect(result).to.have.status(400);
      const body = result.body;
      expect(body).to.be.deep.equal({
        errors: ['Close Button Action is required'],
      });
    });
    it('should return status 400 if the repetitionType is invalid', async () => {
      const result = await chai.request
        .execute(app)
        .post('/api/banner/add_banner')
        .set('Authorization', `Bearer ${token}`)
        .send(banner().invalidRepetitionType().build());
      expect(result).to.have.status(400);
      const body = result.body;
      expect(body).to.be.deep.equal({
        errors: ['Invalid repetition type'],
      });
    });
    it('should return status 400 if the position is invalid', async () => {
      const result = await chai.request
        .execute(app)
        .post('/api/banner/add_banner')
        .set('Authorization', `Bearer ${token}`)
        .send(banner().invalidPosition().build());
      expect(result).to.have.status(400);
      const body = result.body;
      expect(body).to.be.deep.equal({
        errors: ['Position must be top or bottom'],
      });
    });
    it('should return status 400 if the closeButtonAction is invalid', async () => {
      const result = await chai.request
        .execute(app)
        .post('/api/banner/add_banner')
        .set('Authorization', `Bearer ${token}`)
        .send(banner().invalidCloseButtonAction().build());
      expect(result).to.have.status(400);
      const body = result.body;
      expect(body).to.be.deep.equal({
        errors: ['Invalid close button action'],
      });
    });
    it('should return status 400 if backgroundColor is invalid', async () => {
      const result = await chai.request
        .execute(app)
        .post('/api/banner/add_banner')
        .set('Authorization', `Bearer ${token}`)
        .send(banner().invalidBackgroundColor().build());
      expect(result).to.have.status(400);
      const body = result.body;
      expect(body).to.be.deep.equal({
        errors: ['Background color must be a valid hex color code'],
      });
    });
    it('should return status 400 if fontColor is invalid', async () => {
      const result = await chai.request
        .execute(app)
        .post('/api/banner/add_banner')
        .set('Authorization', `Bearer ${token}`)
        .send(banner().invalidFontColor().build());
      expect(result).to.have.status(400);
      const body = result.body;
      expect(body).to.be.deep.equal({
        errors: ['Font color must be a valid hex color code'],
      });
    });
    it('should return status 201 and the new banner if everything goes right', async () => {
      const result = await chai.request
        .execute(app)
        .post('/api/banner/add_banner')
        .set('Authorization', `Bearer ${token}`)
        .send(banner().build());
      expect(result).to.have.status(201);
      const body = result.body;
      expect(body).to.be.deep.equal(banner().build());
    });
  });
  describe('DELETE /api/banner/delete_banner/:id', () => {
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
    it('should return 401 if no token is provided', async () => {
      const result = await chai.request.execute(app).delete('/api/banner/delete_banner/1');
      expect(result).to.have.status(401);
      const body = result.body;
      expect(body).to.be.deep.equal({ error: 'No token provided' });
    });
    it('should return 403 if user does not have required access level', async () => {
      process.env.NODE_ENV = 'not-test';
      await chai.request
        .execute(app)
        .post('/api/team/invite')
        .set('Authorization', `Bearer ${token}`)
        .send({ invitedEmail: userMocks.validList[1].email, role: 'member' });
      const login = await chai.request
        .execute(app)
        .post('/api/auth/register')
        .send({ ...userMocks.validList[1], role: 2 });
      const newToken = login.body.token;
      const result = await chai.request
        .execute(app)
        .delete('/api/banner/delete_banner/1')
        .set('Authorization', `Bearer ${newToken}`);
      expect(result).to.have.status(403);
      const body = result.body;
      expect(body).to.be.deep.equal({
        error: 'User does not have required access level',
      });
    });
    it('should return status 400 if the id is invalid', async () => {
      const result = await chai.request
        .execute(app)
        .delete('/api/banner/delete_banner/invalid')
        .set('Authorization', `Bearer ${token}`);
      expect(result).to.have.status(400);
      const body = result.body;
      expect(body).to.be.deep.equal({
        errors: ['Invalid id'],
      });
    });
    it('should return status 400 the banner is not found', async () => {
      const result = await chai.request
        .execute(app)
        .delete('/api/banner/delete_banner/1')
        .set('Authorization', `Bearer ${token}`);
      expect(result).to.have.status(400);
      const body = result.body;
      expect(body).to.be.deep.equal({
        errors: [{ msg: 'Banner with the specified id does not exist' }],
      });
    });
    it('should return status 200 if banner is deleted', async () => {
      const result = await chai.request
        .execute(app)
        .post('/api/banner/add_banner')
        .set('Authorization', `Bearer ${token}`)
        .send(banner().build());
      const bannerId = result.body.id;
      const deleteResult = await chai.request
        .execute(app)
        .delete(`/api/banner/delete_banner/${bannerId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(deleteResult).to.have.status(200);
      const body = deleteResult.body;
      expect(body).to.be.deep.equal({
        message: 'Banner with ID 1 deleted successfully',
      });
    });
  });
  describe('PUT /api/banner/edit_banner/:id', () => {
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
    it('should return 401 if no token is provided', async () => {
      const result = await chai.request.execute(app).put('/api/banner/edit_banner/1').send(banner().build());
      expect(result).to.have.status(401);
      const body = result.body;
      expect(body).to.be.deep.equal({ error: 'No token provided' });
    });
    it('should return 403 if user does not have required access level', async () => {
      process.env.NODE_ENV = 'not-test';
      await chai.request
        .execute(app)
        .post('/api/team/invite')
        .set('Authorization', `Bearer ${token}`)
        .send({ invitedEmail: userMocks.validList[1].email, role: 'member' });
      const login = await chai.request
        .execute(app)
        .post('/api/auth/register')
        .send({ ...userMocks.validList[1], role: 2 });
      const newToken = login.body.token;
      const result = await chai.request
        .execute(app)
        .delete('/api/banner/delete_banner/1')
        .set('Authorization', `Bearer ${newToken}`);
      expect(result).to.have.status(403);
      const body = result.body;
      expect(body).to.be.deep.equal({
        error: 'User does not have required access level',
      });
    });
    it('should return status 400 if the repetitionType is missing', async () => {
      const result = await chai.request
        .execute(app)
        .post('/api/banner/add_banner')
        .set('Authorization', `Bearer ${token}`)
        .send(banner().missingRepetitionType().build());
      expect(result).to.have.status(400);
      const body = result.body;
      expect(body).to.be.deep.equal({
        errors: ['Repetition type is required'],
      });
    });
    it('should return status 400 if the closeButtonAction is missing', async () => {
      const result = await chai.request
        .execute(app)
        .put('/api/banner/edit_banner/1')
        .set('Authorization', `Bearer ${token}`)
        .send(banner().missingCloseButtonAction().build());
      expect(result).to.have.status(400);
      const body = result.body;
      expect(body).to.be.deep.equal({
        errors: ['Close Button Action is required'],
      });
    });
    it('should return status 400 if the position is missing', async () => {
      const result = await chai.request
        .execute(app)
        .put('/api/banner/edit_banner/1')
        .set('Authorization', `Bearer ${token}`)
        .send(banner().missingPosition().build());
      expect(result).to.have.status(400);
      const body = result.body;
      expect(body).to.be.deep.equal({
        errors: ['Position is required'],
      });
    });
    it('should return status 400 if the repetitionType is invalid', async () => {
      const result = await chai.request
        .execute(app)
        .post('/api/banner/add_banner')
        .set('Authorization', `Bearer ${token}`)
        .send(banner().invalidRepetitionType().build());
      expect(result).to.have.status(400);
      const body = result.body;
      expect(body).to.be.deep.equal({
        errors: ['Invalid repetition type'],
      });
    });
    it('should return status 400 if the position is invalid', async () => {
      const result = await chai.request
        .execute(app)
        .put('/api/banner/edit_banner/1')
        .set('Authorization', `Bearer ${token}`)
        .send(banner().invalidPosition().build());
      expect(result).to.have.status(400);
      const body = result.body;
      expect(body).to.be.deep.equal({
        errors: ['Position must be top or bottom'],
      });
    });
    it('should return status 400 if the closeButtonAction is invalid', async () => {
      const result = await chai.request
        .execute(app)
        .put('/api/banner/edit_banner/1')
        .set('Authorization', `Bearer ${token}`)
        .send(banner().invalidCloseButtonAction().build());
      expect(result).to.have.status(400);
      const body = result.body;
      expect(body).to.be.deep.equal({
        errors: ['Invalid close button action'],
      });
    });
    it('should return status 400 if fontColor is invalid', async () => {
      const result = await chai.request
        .execute(app)
        .put('/api/banner/edit_banner/1')
        .set('Authorization', `Bearer ${token}`)
        .send(banner().invalidFontColor().build());
      expect(result).to.have.status(400);
      const body = result.body;
      expect(body).to.be.deep.equal({
        errors: ['Font color must be a valid hex color code'],
      });
    });
    it('should return status 400 if backgroundColor is invalid', async () => {
      const result = await chai.request
        .execute(app)
        .put('/api/banner/edit_banner/1')
        .set('Authorization', `Bearer ${token}`)
        .send(banner().invalidBackgroundColor().build());
      expect(result).to.have.status(400);
      const body = result.body;
      expect(body).to.be.deep.equal({
        errors: ['Background color must be a valid hex color code'],
      });
    });
    it('should return status 200 and the updated banner if everything goes right', async () => {
      const addResult = await chai.request
        .execute(app)
        .post('/api/banner/add_banner')
        .set('Authorization', `Bearer ${token}`)
        .send(banner().build());
      const bannerId = addResult.body.id;
      const result = await chai.request
        .execute(app)
        .put(`/api/banner/edit_banner/${bannerId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(banner().build());
      expect(result).to.have.status(200);
      const body = result.body;
      expect(body).to.be.deep.equal(banner().build());
    });
  });
  describe('GET /api/banner/all_banners', () => {
    let token;
    beforeEach(async () => {
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
    it('should return 401 if no token is provided', async () => {
      const result = await chai.request.execute(app).get('/api/banner/all_banners');
      expect(result).to.have.status(401);
      const body = result.body;
      expect(body).to.be.deep.equal({ error: 'No token provided' });
    });
    it('should return status 200 and all the banners if everything goes right', async () => {
      const result = await chai.request
        .execute(app)
        .get('/api/banner/all_banners')
        .set('Authorization', `Bearer ${token}`);
      expect(result).to.have.status(200);
      const body = result.body;
      expect(body).to.be.deep.equal([]);
    });
  });
  describe('GET /api/banner/banners', () => {
    let token;
    beforeEach(async () => {
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
    it('should return 401 if no token is provided', async () => {
      const result = await chai.request.execute(app).get('/api/banner/banners');
      expect(result).to.have.status(401);
      const body = result.body;
      expect(body).to.be.deep.equal({ error: 'No token provided' });
    });
    it('should return status 200 and all the banners created by the user if everything goes right', async () => {
      const result = await chai.request.execute(app).get('/api/banner/banners').set('Authorization', `Bearer ${token}`);
      expect(result).to.have.status(200);
      const body = result.body;
      expect(body).to.be.deep.equal([]);
    });
  });
  describe('GET /api/banner/get_banner/:id', () => {
    let token;
    beforeEach(async () => {
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
    it('should return 401 if no token is provided', async () => {
      const result = await chai.request.execute(app).get('/api/banner/get_banner/1');
      expect(result).to.have.status(401);
      const body = result.body;
      expect(body).to.be.deep.equal({ error: 'No token provided' });
    });
    it('should return status 400 if the id is invalid', async () => {
      const result = await chai.request
        .execute(app)
        .get('/api/banner/get_banner/invalid')
        .set('Authorization', `Bearer ${token}`);
      expect(result).to.have.status(400);
      const body = result.body;
      expect(body).to.be.deep.equal({
        errors: ['Invalid id'],
      });
    });
    it('should return status 404 if the service returns null', async () => {
      const result = await chai.request
        .execute(app)
        .get('/api/banner/get_banner/1')
        .set('Authorization', `Bearer ${token}`);
      expect(result).to.have.status(404);
      const body = result.body;
      expect(body).to.be.deep.equal({
        errors: [
          {
            msg: 'Banner not found',
          },
        ],
      });
    });
    it('should return status 200 and the banner if everything goes right', async () => {
      const addResult = await chai.request
        .execute(app)
        .post('/api/banner/add_banner')
        .set('Authorization', `Bearer ${token}`)
        .send(banner().build());
      const bannerId = addResult.body.id;
      const result = await chai.request
        .execute(app)
        .get(`/api/banner/get_banner/${bannerId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result).to.have.status(200);
      const body = result.body;
      expect(body).to.be.deep.equal(banner().build());
    });
  });
});
