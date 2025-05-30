import { expect } from 'chai';
import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import waitOn from 'wait-on';
import db from '../../models/index.js';
import app from '../../server.js';
import mocks from '../mocks/tour.mock.js';
import { UserBuilder, validList } from '../mocks/user.mock.js';
import chai from './index.mjs';

const user = UserBuilder.user;
const dbReadyOptions = {
  resources: ['tcp:localhost:5432'],
  delay: 1000,
  timeout: 30000,
  interval: 1000,
};

const tour = mocks.TourBuilder.tour;
const tourPopup = mocks.TourPopupBuilder.tourPopup;
const tourList = mocks.toursList;

const createTour = async (token, tour) => {
  const { id, createdBy, ...rest } = tour;
  const res = await chai.request
    .execute(app)
    .post('/api/tour/add_tour')
    .set('Authorization', `Bearer ${token}`)
    .send(rest);
  return res.body;
};

describe('E2e tests tour', () => {
  describe('POST /api/tour/add_tour', () => {
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
      const res = await chai.request.execute(app).post('/api/tour/add_tour').send(tour().build());
      expect(res).to.have.status(401);
      const body = res.body;
      expect(body).to.be.deep.equal({ error: 'No token provided' });
    });
    it('should return 400 if "headerColor" is not a valid hex color', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/tour/add_tour')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...tour().invalidHeaderColor().build(), steps: [] });
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['Invalid value for headerColor'] });
    });
    it('should return 400 if "textColor" is not a valid hex color', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/tour/add_tour')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...tour().invalidTextColor().build(), steps: [] });
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['Invalid value for textColor'] });
    });
    it('should return 400 if "buttonBackgroundColorundColor" is not a valid hex color', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/tour/add_tour')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...tour().invalidButtonBackgroundColor().build(), steps: [] });
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['Invalid value for buttonBackgroundColor'] });
    });
    it('should return 400 if "buttonTextColor" is not a valid hex color', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/tour/add_tour')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...tour().invalidButtonTextColor().build(), steps: [] });
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['Invalid value for buttonTextColor'] });
    });
    it('should return 400 if "url" is not a valid url', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/tour/add_tour')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...tour().invalidUrl().build(), steps: [] });
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['url is required', 'Invalid value for url'] });
    });
    it('should return 400 if "url" is missing', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/tour/add_tour')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...tour().missingUrl().build(), steps: [] });
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['url is required', 'Invalid value for url'] });
    });
    it('should return 400 if "size" is not a valid value', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/tour/add_tour')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...tour().invalidSize().build(), steps: [] });
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['Invalid value for size'] });
    });
    it('should return 400 if "finalButtonText" is not a string', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/tour/add_tour')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...tour().invalidFinalButtonText().build(), steps: [] });
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['Invalid value for finalButtonText'] });
    });
    it('should return 400 if "active" is not a boolean', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/tour/add_tour')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...tour().invalidActive().build(), steps: [] });
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['Invalid value for active'] });
    });
    it('should return 400 if "steps" is not an array', async () => {
      const res = await chai.request
        .execute(app)
        .post('/api/tour/add_tour')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...tour().build(), steps: {} });
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['steps must be an array'] });
    });
    it('should return 400 if "steps.*.title" is not a string', async () => {
      const newSteps = [tourPopup().invalidTitle().build()];
      const newTour = { ...tour().build(), steps: newSteps };
      const res = await chai.request
        .execute(app)
        .post('/api/tour/add_tour')
        .set('Authorization', `Bearer ${token}`)
        .send(newTour);
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['Invalid value for title'] });
    });
    it('should return 400 if "steps.*.description" is not a string', async () => {
      const newSteps = [tourPopup().invalidDescription().build()];
      const newTour = { ...tour().build(), steps: newSteps };
      const res = await chai.request
        .execute(app)
        .post('/api/tour/add_tour')
        .set('Authorization', `Bearer ${token}`)
        .send(newTour);
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['Invalid value for description'] });
    });
    it('should return 400 if "steps.*.targetElement" is not a string', async () => {
      const newSteps = [tourPopup().invalidTargetElement().build()];
      const newTour = { ...tour().build(), steps: newSteps };
      const res = await chai.request
        .execute(app)
        .post('/api/tour/add_tour')
        .set('Authorization', `Bearer ${token}`)
        .send(newTour);
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['Invalid value for targetElement'] });
    });
    it('should return 400 if "steps.*.order" is not an integer', async () => {
      const newSteps = [tourPopup().invalidOrder().build()];
      const newTour = { ...tour().build(), steps: newSteps };
      const res = await chai.request
        .execute(app)
        .post('/api/tour/add_tour')
        .set('Authorization', `Bearer ${token}`)
        .send(newTour);
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['Invalid value for order'] });
    });
    it('should return 201 if all required fields are provided', async () => {
      const newSteps = [tourPopup().build()];
      const newTour = { ...tour().withoutId().build(), steps: newSteps };
      const res = await chai.request
        .execute(app)
        .post('/api/tour/add_tour')
        .set('Authorization', `Bearer ${token}`)
        .send(newTour);
      const body = res.body;
      expect(res).to.have.status(201);
      expect(body).to.be.deep.equal({ ...tour().build(), createdBy: 1 });
    });
  });
  describe('DELETE /api/tour/delete_tour/:id', () => {
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
      const res = await chai.request.execute(app).delete('/api/tour/delete_tour/1').send();
      expect(res).to.have.status(401);
      const body = res.body;
      expect(body).to.be.deep.equal({ error: 'No token provided' });
    });
    it('should return 404 if tour is not found', async () => {
      const res = await chai.request
        .execute(app)
        .delete('/api/tour/delete_tour/1')
        .set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(404);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: [{ msg: 'Tour with the specified id does not exist' }] });
    });
    it('should return 200 if tour is found', async () => {
      const tourToDelete = await createTour(token, { ...tour().withoutId().build(), steps: [] });
      const res = await chai.request
        .execute(app)
        .delete(`/api/tour/delete_tour/${tourToDelete.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(200);
      const body = res.body;
      expect(body).to.be.deep.equal({ message: 'Tour deleted successfully' });
    });
  });
  describe('PUT /api/tour/edit_tour/:id', () => {
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
      await createTour(token, tour().withoutId().build());
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it('should return 401 if no token is provided', async () => {
      const res = await chai.request.execute(app).put('/api/tour/edit_tour/1').send(tour().build());
      expect(res).to.have.status(401);
      const body = res.body;
      expect(body).to.be.deep.equal({ error: 'No token provided' });
    });
    it('should return 400 if "headerColor" is not a valid hex color', async () => {
      const res = await chai.request
        .execute(app)
        .put('/api/tour/edit_tour/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...tour().invalidHeaderColor().build(), steps: [] });
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['Invalid value for headerColor'] });
    });
    it('should return 400 if "textColor" is not a valid hex color', async () => {
      const res = await chai.request
        .execute(app)
        .put('/api/tour/edit_tour/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...tour().invalidTextColor().build(), steps: [] });
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['Invalid value for textColor'] });
    });
    it('should return 400 if "buttonBackgroundColor" is not a valid hex color', async () => {
      const res = await chai.request
        .execute(app)
        .put('/api/tour/edit_tour/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...tour().invalidButtonBackgroundColor().build(), steps: [] });
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['Invalid value for buttonBackgroundColor'] });
    });
    it('should return 400 if "buttonTextColor" is not a valid hex color', async () => {
      const res = await chai.request
        .execute(app)
        .put('/api/tour/edit_tour/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...tour().invalidButtonTextColor().build(), steps: [] });
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['Invalid value for buttonTextColor'] });
    });
    it('should return 400 if "url" is not a valid url', async () => {
      const res = await chai.request
        .execute(app)
        .put('/api/tour/edit_tour/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...tour().invalidUrl().build(), steps: [] });
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['url is required', 'Invalid value for url'] });
    });
    it('should return 400 if "url" is missing', async () => {
      const res = await chai.request
        .execute(app)
        .put('/api/tour/edit_tour/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...tour().missingUrl().build(), steps: [] });
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['url is required', 'Invalid value for url'] });
    });
    it('should return 400 if "size" is not a valid value', async () => {
      const res = await chai.request
        .execute(app)
        .put('/api/tour/edit_tour/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...tour().invalidSize().build(), steps: [] });
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['Invalid value for size'] });
    });
    it('should return 400 if "finalButtonText" is not a string', async () => {
      const res = await chai.request
        .execute(app)
        .put('/api/tour/edit_tour/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...tour().invalidFinalButtonText().build(), steps: [] });
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['Invalid value for finalButtonText'] });
    });
    it('should return 400 if "active" is not a boolean', async () => {
      const res = await chai.request
        .execute(app)
        .put('/api/tour/edit_tour/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...tour().invalidActive().build(), steps: [] });
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['Invalid value for active'] });
    });
    it('should return 400 if "steps" is not an array', async () => {
      const res = await chai.request
        .execute(app)
        .put('/api/tour/edit_tour/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...tour().build(), steps: {} });
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['steps must be an array'] });
    });
    it('should return 400 if "steps.*.title" is not a string', async () => {
      const newSteps = [tourPopup().invalidTitle().build()];
      const newTour = { ...tour().build(), steps: newSteps };
      const res = await chai.request
        .execute(app)
        .put('/api/tour/edit_tour/1')
        .set('Authorization', `Bearer ${token}`)
        .send(newTour);
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['Invalid value for title'] });
    });
    it('should return 400 if "steps.*.description" is not a string', async () => {
      const newSteps = [tourPopup().invalidDescription().build()];
      const newTour = { ...tour().build(), steps: newSteps };
      const res = await chai.request
        .execute(app)
        .put('/api/tour/edit_tour/1')
        .set('Authorization', `Bearer ${token}`)
        .send(newTour);
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['Invalid value for description'] });
    });
    it('should return 400 if "steps.*.targetElement" is not a string', async () => {
      const newSteps = [tourPopup().invalidTargetElement().build()];
      const newTour = { ...tour().build(), steps: newSteps };
      const res = await chai.request
        .execute(app)
        .put('/api/tour/edit_tour/1')
        .set('Authorization', `Bearer ${token}`)
        .send(newTour);
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['Invalid value for targetElement'] });
    });
    it('should return 400 if "steps.*.order" is not an integer', async () => {
      const newSteps = [tourPopup().invalidOrder().build()];
      const newTour = { ...tour().build(), steps: newSteps };
      const res = await chai.request
        .execute(app)
        .put('/api/tour/edit_tour/1')
        .set('Authorization', `Bearer ${token}`)
        .send(newTour);
      expect(res).to.have.status(400);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: ['Invalid value for order'] });
    });
    it('should return 200 if all required fields are provided', async () => {
      const newTour = { ...tour().build(), steps: [] };
      const tourToEdit = await createTour(token, newTour);
      const res = await chai.request
        .execute(app)
        .put(`/api/tour/edit_tour/${tourToEdit.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...newTour, headerColor: '#000000' });
      expect(res).to.have.status(200);
      const body = res.body;
      expect(body).not.to.be.deep.equal(tour().build());
      expect(body).to.have.property('headerColor', '#000000');
    });
    it('should return 404 if tour is not found', async () => {
      const res = await chai.request
        .execute(app)
        .put('/api/tour/edit_tour/2')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...tour().build(), steps: [] });
      const body = res.body;
      expect(res).to.have.status(404);
      expect(body).to.be.deep.equal({ errors: [{ msg: 'Tour with the specified id does not exist' }] });
    });
  });
  describe('GET /api/tour/all_tours', () => {
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
      await chai.request
        .execute(app)
        .post('/api/team/invite')
        .set('Authorization', `Bearer ${token}`)
        .send({ invitedEmail: validList[1].email, role: 'member' });
      const login2 = await chai.request
        .execute(app)
        .post('/api/auth/register')
        .send({ ...validList[1], role: 2 });
      const token2 = login2.body.token;
      await Promise.all(
        tourList.map(async (tour) => {
          let { steps, ...rest } = tour;
          steps = steps.map((s) => {
            const { id, ...step } = s;
            return step;
          });
          return await createTour(tour.createdBy === 2 ? token2 : token, { ...rest, steps });
        })
      );
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it('should return 401 if no token is provided', async () => {
      const res = await chai.request.execute(app).get('/api/tour/all_tours');
      expect(res).to.have.status(401);
      const body = res.body;
      expect(body).to.be.deep.equal({ error: 'No token provided' });
    });
    it('should return 200 if tours are found', async () => {
      const res = await chai.request.execute(app).get('/api/tour/all_tours').set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(200);
      const body = res.body;
      expect(body).to.have.lengthOf(10);
    });
  });
  describe('GET /api/tour/tours', () => {
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
      await chai.request
        .execute(app)
        .post('/api/team/invite')
        .set('Authorization', `Bearer ${token}`)
        .send({ invitedEmail: validList[1].email, role: 'member' });
      const login2 = await chai.request
        .execute(app)
        .post('/api/auth/register')
        .send({ ...validList[1], role: 2 });
      const token2 = login2.body.token;
      await Promise.all(
        tourList.map(async (tour) => {
          let { steps, ...rest } = tour;
          steps = steps.map((s) => {
            const { id, ...step } = s;
            return step;
          });
          return await createTour(tour.createdBy === 2 ? token2 : token, { ...rest, steps });
        })
      );
    });
    afterEach(async () => {
      await db.sequelize.sync({ force: true, match: /_test$/ });
    });
    it('should return 401 if no token is provided', async () => {
      const res = await chai.request.execute(app).get('/api/tour/tours').send();
      expect(res).to.have.status(401);
      const body = res.body;
      expect(body).to.be.deep.equal({ error: 'No token provided' });
    });
    it('should return 200 if tours are found', async () => {
      const res = await chai.request.execute(app).get('/api/tour/tours').set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(200);
      const body = res.body;
      expect(body).to.have.lengthOf(5);
    });
  });
  describe('GET /api/tour/get_tour/:id', () => {
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
    it('should return 404 if tour is not found', async () => {
      const res = await chai.request.execute(app).get('/api/tour/get_tour/1').set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(404);
      const body = res.body;
      expect(body).to.be.deep.equal({ errors: [{ msg: 'Tour with the specified id does not exist' }] });
    });
    it('should return 200 if tour is found', async () => {
      await createTour(token, { ...tour().withoutId().build(), steps: [] });
      const res = await chai.request.execute(app).get('/api/tour/get_tour/1').set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.deep.equal({ ...tour().build(), steps: [], createdBy: 1 });
    });
  });
});
