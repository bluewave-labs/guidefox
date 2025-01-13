import { expect } from 'chai';
import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import waitOn from 'wait-on';
import db from '../../models/index.js';
import app from '../../server.js';
import mocks from '../mocks/helperLink.mock.js';
import { UserBuilder, validList } from '../mocks/user.mock.js';
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

const updateHelper = async (token, helperId, helper, links) => {
  return await chai.request
    .execute(app)
    .put(`/api/helper-link/edit_helper/${helperId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ ...helper, links });
};

describe('E2e tests helperLink', () => {
  describe('POST /api/helper-link/add_helper', () => {
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
      const res = await chai.request.execute(app).post('/api/helper-link/add_helper');
      expect(res).to.have.status(401);
      expect(res.body).to.be.deep.equal({ error: 'No token provided' });
    });
    it('should return 400 if title is missing', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/helper-link/add_helper')
        .set('Authorization', `Bearer ${token}`)
        .send(helper().missingTitle().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['Header is required'],
      });
    });
    it('should return 400 if the colors are invalid', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/helper-link/add_helper')
        .set('Authorization', `Bearer ${token}`)
        .send(helper().invalidHeaderBackgroundColor().invalidIconColor().invalidLinkFontColor().build());
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: [
          'Invalid value for headerBackgroundColor',
          'Invalid value for linkFontColor',
          'Invalid value for iconColor',
        ],
      });
    });
    it('should return 400 if link is missing title', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/helper-link/add_helper')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...helper().build(), links: [link().missingTitle().build()] });
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['Title is required'],
      });
    });
    it('should return 400 if link is missing url', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/helper-link/add_helper')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...helper().build(), links: [link().missingUrl().build()] });
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['Invalid value for link URLs'],
      });
    });
    it('should return 400 if link has invalid url', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/helper-link/add_helper')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...helper().build(), links: [link().invalidUrl().build()] });
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['Invalid value for link URLs'],
      });
    });
    it('should return 400 if link has invalid order value', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/helper-link/add_helper')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...helper().build(),
          links: [link().invalidOrderValue().build()],
        });
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['Order must be a positive integer'],
      });
    });
    it('should return 400 if link has invalid order type', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/helper-link/add_helper')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...helper().build(),
          links: [link().invalidOrderType().build()],
        });
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['Order must be an integer', 'Order must be a positive integer'],
      });
    });
    it('should return 201 if all data is valid', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/helper-link/add_helper')
        .set('Authorization', `Bearer ${token}`)
        .send(helper().build());
      expect(res).to.have.status(201);
      const { links, ...expected } = helper().build();
      expect(res.body).to.be.deep.equal(expected);
    });
  });
  describe('GET /api/helper-link/get_helpers', () => {
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
      const res = await chai.request.execute(app).get('/api/helper-link/get_helpers');
      expect(res).to.have.status(401);
      expect(res.body).to.be.deep.equal({ error: 'No token provided' });
    });
    it('should return 200 and the helpers created by the user if token is provided', async () => {
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
      await Promise.all(
        mocks.HelperLinkList.map(async (helper) => {
          return await createHelper(helper.createdBy === 1 ? token : newToken, helper);
        })
      );
      const res = await chai.request
        .execute(app)
        .get('/api/helper-link/get_helpers')
        .set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(200);
      mocks.HelperLinkList.forEach((helper) => {
        if (helper.createdBy === 2) {
          expect(res.body).to.not.include(helper);
        } else {
          const {
            createdBy: c,
            id: i,
            ...curr
          } = res.body.find((it) => it.title === helper.title);
          const { createdBy, links, id, ...expected } = helper;
          expect(curr).to.be.deep.equal(expected);
          // expect(creator).to.have.property("id", createdBy);
        }
      });
    });
  });
  describe('GET /api/helper-link/all_helpers', () => {
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
      const res = await chai.request.execute(app).get('/api/helper-link/all_helpers');
      expect(res).to.have.status(401);
      expect(res.body).to.be.deep.equal({ error: 'No token provided' });
    });
    it('should return 200 and all helpers if token is provided', async () => {
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
      await Promise.all(
        mocks.HelperLinkList.map(async (helper) => {
          return await createHelper(helper.createdBy === 1 ? token : newToken, helper);
        })
      );
      const res = await chai.request
        .execute(app)
        .get('/api/helper-link/all_helpers')
        .set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(200);
      mocks.HelperLinkList.forEach((helper) => {
        const {
          createdBy: c,
          id: i,
          ...curr
        } = res.body.find((it) => it.title === helper.title);
        const { createdBy, links, id, ...expected } = helper;
        expect(curr).to.be.deep.equal(expected);
        // expect(creator).to.have.property("id", createdBy);
      });
    });
  });
  describe('GET /api/helper-link/get_helper/:id', () => {
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
      const res = await chai.request.execute(app).get('/api/helper-link/get_helper/1');
      expect(res).to.have.status(401);
      expect(res.body).to.be.deep.equal({ error: 'No token provided' });
    });
    it('should return 400 if id is invalid', async () => {
      const res = await chai.request
        .execute(app)
        .get('/api/helper-link/get_helper/id')
        .set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['ID must be an integer'],
      });
    });
    it('should return 404 if helper does not exist', async () => {
      const res = await chai.request
        .execute(app)
        .get('/api/helper-link/get_helper/1')
        .set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(404);
      expect(res.body).to.be.deep.equal({
        errors: [
          {
            msg: 'Helper not found',
          },
        ],
      });
    });
    it('should return 200 if helper is found', async () => {
      const helperData = helper().build();
      const { links, createdBy, id, ...expected } = helperData;
      const { id: helperId } = await createHelper(token, helperData);
      const res = await chai.request
        .execute(app)
        .get(`/api/helper-link/get_helper/${helperId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(200);
      const { createdBy: c, id: i, links: l, ...rest } = res.body;
      expect(rest).to.be.deep.equal(expected);
    });
  });
  describe('PUT /api/helper-link/edit_helper/:id', () => {
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
      const res = await chai.request.execute(app).put('/api/helper-link/edit_helper/1');
      expect(res).to.have.status(401);
      expect(res.body).to.be.deep.equal({ error: 'No token provided' });
    });
    it('should return 400 if id is invalid', async () => {
      const res = await chai.request
        .execute(app)
        .put('/api/helper-link/edit_helper/id')
        .set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['ID must be an integer', 'Header is required', 'links must be an array'],
      });
    });
    it('should return 400 if title is missing', async () => {
      const { id: helperId } = await createHelper(token, helper().build());
      const helperToUpdate = helper().missingTitle().withoutId().build();
      const res = await updateHelper(token, helperId, helperToUpdate, helperToUpdate.links);
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['Header is required'],
      });
    });
    it('should return 400 if headerBackgroundColor is invalid', async () => {
      const { id: helperId } = await createHelper(token, helper().build());
      const helperToUpdate = helper().withoutId().invalidHeaderBackgroundColor().build();
      const links = [link().withoutId().build()];
      const res = await updateHelper(token, helperId, helperToUpdate, links);
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['Invalid value for headerBackgroundColor'],
      });
    });
    it('should return 400 if linkFontColor is invalid', async () => {
      const { id: helperId } = await createHelper(token, helper().build());
      const helperToUpdate = helper().withoutId().invalidLinkFontColor().build();
      const links = [link().withoutId().build()];
      const res = await updateHelper(token, helperId, helperToUpdate, links);
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['Invalid value for linkFontColor'],
      });
    });
    it('should return 400 if iconColor is invalid', async () => {
      const { id: helperId } = await createHelper(token, helper().build());
      const helperToUpdate = helper().withoutId().invalidIconColor().build();
      const links = [link().withoutId().build()];
      const res = await updateHelper(token, helperId, helperToUpdate, links);
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['Invalid value for iconColor'],
      });
    });
    it('should return 400 if link is missing title', async () => {
      const { id: helperId } = await createHelper(token, helper().build());
      const helperToUpdate = helper().withoutId().build();
      const links = [link().withoutId().missingTitle().build()];
      const res = await updateHelper(token, helperId, helperToUpdate, links);
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['Title is required'],
      });
    });
    it('should return 400 if link is missing url', async () => {
      const { id: helperId } = await createHelper(token, helper().build());
      const helperToUpdate = helper().withoutId().build();
      const links = [link().withoutId().missingUrl().build()];
      const res = await updateHelper(token, helperId, helperToUpdate, links);
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['Invalid value for link URLs'],
      });
    });
    it('should return 400 if link has invalid url', async () => {
      const { id: helperId } = await createHelper(token, helper().build());
      const helperToUpdate = helper().withoutId().build();
      const links = [link().withoutId().invalidUrl().build()];
      const res = await updateHelper(token, helperId, helperToUpdate, links);
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['Invalid value for link URLs'],
      });
    });
    it('should return 400 if link has invalid order value', async () => {
      const { id: helperId } = await createHelper(token, helper().build());
      const helperToUpdate = helper().withoutId().build();
      const links = [link().withoutId().invalidOrderValue().build()];
      const res = await updateHelper(token, helperId, helperToUpdate, links);
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['Order must be a positive integer'],
      });
    });
    it('should return 400 if link has invalid order type', async () => {
      const { id: helperId } = await createHelper(token, helper().build());
      const helperToUpdate = helper().withoutId().build();
      const links = [link().withoutId().invalidOrderType().build()];
      const res = await updateHelper(token, helperId, helperToUpdate, links);
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['Order must be an integer', 'Order must be a positive integer'],
      });
    });
    it('should return 404 if helper does not exist', async () => {
      await createHelper(token, helper().build());
      const helperToUpdate = helper().withoutId().build();
      const links = [link().withoutId().build()];
      const res = await updateHelper(token, 999999, helperToUpdate, links);
      expect(res).to.have.status(404);
      expect(res.body).to.be.deep.equal({
        errors: [{ msg: 'Helper with the specified id does not exist' }],
      });
    });
    it('should return 200 if helper is updated', async () => {
      const { id: helperId } = await createHelper(token, helper().build());
      const helperToUpdate = helper().withoutId().build();
      const links = [link().withoutId().build()];
      const res = await updateHelper(token, helperId, helperToUpdate, links);
      expect(res).to.have.status(200);
      const response = res.body.map((it) => {
        const { id, ...rest } = it;
        return rest;
      });
      const { links: l, id, ...expected } = helperToUpdate;
      expect(response).to.be.deep.equal([expected]);
    });
  });
  describe('DELETE /api/helper-link/delete_helper/:id', () => {
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
      const res = await chai.request.execute(app).delete('/api/helper-link/delete_helper/1');
      expect(res).to.have.status(401);
      expect(res.body).to.be.deep.equal({ error: 'No token provided' });
    });
    it('should return 400 if id is invalid', async () => {
      const res = await chai.request
        .execute(app)
        .delete('/api/helper-link/delete_helper/id')
        .set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(400);
      expect(res.body).to.be.deep.equal({
        errors: ['ID must be an integer'],
      });
    });
    it('should return 404 if helper does not exist', async () => {
      const res = await chai.request
        .execute(app)
        .delete('/api/helper-link/delete_helper/1')
        .set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(404);
      expect(res.body).to.be.deep.equal({
        errors: [{ msg: 'Helper with the specified id does not exist' }],
      });
    });
    it('should return 200 if helper is deleted', async () => {
      const { id: helperId } = await createHelper(token, helper().build());
      const res = await chai.request
        .execute(app)
        .delete(`/api/helper-link/delete_helper/${helperId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.deep.equal({
        message: `Helper with ID ${helperId} deleted successfully`,
      });
    });
  });
});
