import { expect } from 'chai';
import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import waitOn from 'wait-on';
import db from '../../models/index.js';
import app from '../../server.js';
import mocks from '../mocks/helperLink.mock.js';
import { UserBuilder } from '../mocks/user.mock.js';
import chai from './index.mjs';

const user = UserBuilder.user;
const dbReadyOptions = {
  resources: ['tcp:localhost:5432'],
  delay: 1000,
  timeout: 30000,
  interval: 1000,
};

const helper = mocks.HelperLinkBuilder.helperLink;
const link = mocks.LinkBuilder.link;

const createHelper = async (token, helper) => {
  const { links, createdBy, id, ...helperData } = helper;
  const res = await chai.request
    .execute(app)
    .post('/api/helper-link/add_helper')
    .set('Authorization', `Bearer ${token}`)
    .send({
      ...helperData,
      links: [],
    });
  return res.body;
};

describe('E2e tests link', () => {
  describe('POST /api/link/add_link', () => {
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
        console.error('Database not ready in time:', err);
        throw err;
      }
      const login = await chai.request.execute(app).post('/api/auth/register').send(user().build());
      token = login.body.token;
      await createHelper(token, helper().build());
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it('should return 401 if no token is provided', async () => {
      const res = await chai.request.execute(app).post('/api/link/add_link');
      expect(res).to.have.status(401);
      const body = res.body;
      expect(body).to.be.deep.equal({ error: 'No token provided' });
    });
    it('should return 400 if url is missing', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/link/add_link')
        .set('Authorization', `Bearer ${token}`)
        .send(link().missingUrl().build());
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({
        errors: ['Invalid value for URL'],
      });
    });
    it('should return 400 if title is missing', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/link/add_link')
        .set('Authorization', `Bearer ${token}`)
        .send(link().missingTitle().build());
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({
        errors: ['Title is required'],
      });
    });
    it('should return 400 if url is invalid', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/link/add_link')
        .set('Authorization', `Bearer ${token}`)
        .send(link().invalidUrl().build());
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({
        errors: ['Invalid value for URL'],
      });
    });
    it('should return 400 if type of order is invalid', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/link/add_link')
        .set('Authorization', `Bearer ${token}`)
        .send(link().invalidOrderType().build());
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({
        errors: ['Order must be an integer', 'Order must be a positive integer'],
      });
    });
    it('should return 400 if order is invalid', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/link/add_link')
        .set('Authorization', `Bearer ${token}`)
        .send(link().invalidOrderValue().build());
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({
        errors: ['Order must be a positive integer'],
      });
    });
    it('should return 201 if link was created', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/link/add_link')
        .set('Authorization', `Bearer ${token}`)
        .send(link().build());
      expect(res).to.have.status(201);
      const body = res.body;
      expect(body).to.be.deep.equal({
        id: 1,
        title: 'Link 1',
        url: '/url',
        order: 1,
        helperId: 1,
        target: true,
      });
    });
    it('should return 201 if order is not provided', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/link/add_link')
        .set('Authorization', `Bearer ${token}`)
        .send(link().missingOrder().build());
      expect(res).to.have.status(201);
      const body = res.body;
      expect(body).to.be.deep.equal({
        id: 1,
        title: 'Link 1',
        url: '/url',
        order: 1,
        helperId: 1,
        target: true,
      });
    });
    it('should return 201 if target is not provided', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/link/add_link')
        .set('Authorization', `Bearer ${token}`)
        .send(link().missingTarget().build());
      expect(res).to.have.status(201);
      const body = res.body;
      expect(body).to.be.deep.equal({
        id: 1,
        title: 'Link 1',
        url: '/url',
        order: 1,
        helperId: 1,
        target: true,
      });
    });
  });
  describe('GET /api/link/get_links', () => {
    before(async () => {
      db.sequelize.connectionManager.initPools();
    });
    after(async () => {
      const conn = await db.sequelize.connectionManager.getConnection();
      db.sequelize.connectionManager.releaseConnection(conn);
    });
    let token;
    let helperId;
    beforeEach(async () => {
      try {
        await waitOn(dbReadyOptions);
      } catch (err) {
        console.error('Database not ready in time:', err);
        throw err;
      }
      const login = await chai.request.execute(app).post('/api/auth/register').send(user().build());
      token = login.body.token;
      const result = await createHelper(token, helper().build());
      helperId = result.id;
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it('should return 401 if no token is provided', async () => {
      const res = await chai.request.execute(app).post('/api/link/add_link');
      expect(res).to.have.status(401);
      const body = res.body;
      expect(body).to.be.deep.equal({ error: 'No token provided' });
    });
    it('should return 400 if helperId is invalid', async () => {
      const res = await chai.request
        .execute(app)
        .get('/api/link/get_links')
        .set('Authorization', `Bearer ${token}`)
        .query({ helperId: 'invalid' });
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({
        errors: ['Helper ID must be an integer'],
      });
    });
    it('should return 200 if links were found', async () => {
      const res = await chai.request
        .execute(app)
        .get('/api/link/get_links')
        .set('Authorization', `Bearer ${token}`)
        .query({ helperId });
      expect(res).to.have.status(200);
      const body = res.body;
      expect(body).to.be.deep.equal([]);
    });
  });
  describe('GET /api/link/all_links', () => {
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
      const res = await chai.request.execute(app).post('/api/link/add_link');
      expect(res).to.have.status(401);
      const body = res.body;
      expect(body).to.be.deep.equal({ error: 'No token provided' });
    });
    it('should return 200 if links were found', async () => {
      const res = await chai.request.execute(app).get('/api/link/all_links').set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(200);
      const body = res.body;
      expect(body).to.be.deep.equal([]);
    });
  });
  describe('GET /api/link/get_link/:id', () => {
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
        console.error('Database not ready in time:', err);
        throw err;
      }
      const login = await chai.request.execute(app).post('/api/auth/register').send(user().build());
      token = login.body.token;
      await createHelper(token, helper().build());
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it('should return 401 if no token is provided', async () => {
      const res = await chai.request.execute(app).post('/api/link/add_link');
      expect(res).to.have.status(401);
      const body = res.body;
      expect(body).to.be.deep.equal({ error: 'No token provided' });
    });
    it('should return 400 if id is invalid', async () => {
      const res = await chai.request
        .execute(app)
        .get('/api/link/get_link/invalid')
        .set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({
        errors: ['ID must be an integer'],
      });
    });
    it('should return 404 if link was not found', async () => {
      const res = await chai.request.execute(app).get('/api/link/get_link/1').set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(404);
      const body = res.body;
      expect(body).to.be.deep.equal({
        errors: [
          {
            msg: 'Link not found',
          },
        ],
      });
    });
    it('should return 200 if link was found', async () => {
      const {
        body: { id: linkId },
      } = await chai.request
        .execute(app)
        .post('/api/link/add_link')
        .set('Authorization', `Bearer ${token}`)
        .send(link().build());
      const res = await chai.request
        .execute(app)
        .get(`/api/link/get_link/${linkId}`)
        .set('Authorization', `Bearer ${token}`);
      const body = res.body;
      expect(res).to.have.status(200);
      expect(body).to.be.deep.equal({
        id: 1,
        title: 'Link 1',
        url: '/url',
        order: 1,
        helperId: 1,
        target: true,
        helper: {
          id: 1,
          title: 'Helper Link 1',
          headerBackgroundColor: '#F8F9F8',
          linkFontColor: '#344054',
          iconColor: '#7F56D9',
          createdBy: 1,
          absolutePath: true,
          active: true,
          url: '/url',
        },
      });
    });
  });
  describe('PUT /api/link/edit_link/:id', () => {
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
        console.error('Database not ready in time:', err);
        throw err;
      }
      const login = await chai.request.execute(app).post('/api/auth/register').send(user().build());
      token = login.body.token;
      await createHelper(token, helper().build());
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it('should return 401 if no token is provided', async () => {
      const res = await chai.request.execute(app).post('/api/link/add_link');
      expect(res).to.have.status(401);
      const body = res.body;
      expect(body).to.be.deep.equal({ error: 'No token provided' });
    });
    it('should return 400 if id is invalid', async () => {
      const res = await chai.request
        .execute(app)
        .put('/api/link/edit_link/invalid')
        .set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({
        errors: [
          'ID must be an integer',
          'Title is required',
          'URL must be a string',
          'Invalid value for URL',
          'Helper ID is required and must be an integer',
        ],
      });
    });
    it('should return 400 if title is missing', async () => {
      const res = await chai.request
        .execute(app)
        .put('/api/link/edit_link/1')
        .set('Authorization', `Bearer ${token}`)
        .send(link().missingTitle().build());
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({
        errors: ['Title is required'],
      });
    });
    it('should return 400 if url is missing', async () => {
      const res = await chai.request
        .execute(app)
        .put('/api/link/edit_link/1')
        .set('Authorization', `Bearer ${token}`)
        .send(link().missingUrl().build());
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({
        errors: ['Invalid value for URL'],
      });
    });
    it('should return 400 if url is invalid', async () => {
      const res = await chai.request
        .execute(app)
        .put('/api/link/edit_link/1')
        .set('Authorization', `Bearer ${token}`)
        .send(link().invalidUrl().build());
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({
        errors: ['Invalid value for URL'],
      });
    });
    it('should return 400 if order is invalid', async () => {
      const res = await chai.request
        .execute(app)
        .put('/api/link/edit_link/1')
        .set('Authorization', `Bearer ${token}`)
        .send(link().invalidOrderValue().build());
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({
        errors: ['Order must be a positive integer'],
      });
    });
    it('should return 400 if order type is invalid', async () => {
      const res = await chai.request
        .execute(app)
        .put('/api/link/edit_link/1')
        .set('Authorization', `Bearer ${token}`)
        .send(link().invalidOrderType().build());
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({
        errors: ['Order must be an integer', 'Order must be a positive integer'],
      });
    });
    it('should return 200 if link was updated', async () => {
      await chai.request
        .execute(app)
        .post('/api/link/add_link')
        .set('Authorization', `Bearer ${token}`)
        .send(link().build());
      const res = await chai.request
        .execute(app)
        .put('/api/link/edit_link/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...link().build(), title: 'Link 2' });
      expect(res).to.have.status(200);
      const body = res.body;
      expect(body).to.be.deep.equal({
        id: 1,
        title: 'Link 2',
        url: '/url',
        order: 1,
        helperId: 1,
        target: true,
      });
    });
    it('should return 200 if order is not provided', async () => {
      await chai.request
        .execute(app)
        .post('/api/link/add_link')
        .set('Authorization', `Bearer ${token}`)
        .send(link().build());
      const res = await chai.request
        .execute(app)
        .put('/api/link/edit_link/1')
        .set('Authorization', `Bearer ${token}`)
        .send(link().missingOrder().build());
      expect(res).to.have.status(200);
      const body = res.body;
      expect(body).to.be.deep.equal({
        id: 1,
        title: 'Link 1',
        url: '/url',
        order: 2,
        helperId: 1,
        target: true,
      });
    });
    it('should return 200 if target is not provided', async () => {
      await chai.request
        .execute(app)
        .post('/api/link/add_link')
        .set('Authorization', `Bearer ${token}`)
        .send(link().build());
      const res = await chai.request
        .execute(app)
        .put('/api/link/edit_link/1')
        .set('Authorization', `Bearer ${token}`)
        .send(link().missingTarget().build());
      expect(res).to.have.status(200);
      const body = res.body;
      expect(body).to.be.deep.equal({
        id: 1,
        title: 'Link 1',
        url: '/url',
        order: 1,
        helperId: 1,
        target: true,
      });
    });
  });
  describe('DELETE /api/link/delete_link/:id', () => {
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
        console.error('Database not ready in time:', err);
        throw err;
      }
      const login = await chai.request.execute(app).post('/api/auth/register').send(user().build());
      token = login.body.token;
      await createHelper(token, helper().build());
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it('should return 401 if no token is provided', async () => {
      const res = await chai.request.execute(app).post('/api/link/add_link');
      expect(res).to.have.status(401);
      const body = res.body;
      expect(body).to.be.deep.equal({ error: 'No token provided' });
    });
    it('should return 400 if id is invalid', async () => {
      const res = await chai.request
        .execute(app)
        .delete('/api/link/delete_link/invalid')
        .set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({
        errors: ['ID must be an integer'],
      });
    });
    it('should return 404 if link was not found', async () => {
      const res = await chai.request
        .execute(app)
        .delete('/api/link/delete_link/1')
        .set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(404);
      const body = res.body;
      expect(body).to.be.deep.equal({
        errors: [
          {
            msg: 'Link with the specified id does not exist',
          },
        ],
      });
    });
    it('should return 200 if link was deleted', async () => {
      await chai.request
        .execute(app)
        .post('/api/link/add_link')
        .set('Authorization', `Bearer ${token}`)
        .send(link().build());
      const res = await chai.request
        .execute(app)
        .delete('/api/link/delete_link/1')
        .set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(200);
      const body = res.body;
      expect(body).to.be.deep.equal({
        message: 'Link with ID 1 deleted successfully',
      });
    });
  });
});
