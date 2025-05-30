const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const controller = require('../../../controllers/team.controller.js');
const userMocks = require('../../mocks/user.mock.js');
const db = require('../../../models/index.js');

const Team = db.Team;
const service = controller.teamService;

describe('Unit test team controller', () => {
  const req = {};
  const res = {};
  beforeEach(() => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
  });
  afterEach(sinon.restore);

  it('setOrganisation - should return status 400 if a team is already created', async () => {
    sinon.stub(Team, 'count').returns(1);
    req.body = {
      name: 'Test',
    };
    await controller.setOrganisation(req, res);
    expect(res.status.args[0][0]).to.equal(400);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      error: 'Cannot create more than one team.',
    });
  });
  it('setOrganisation - should return status 201 and the created team if everything goes right', async () => {
    sinon.stub(Team, 'count').returns(0);
    sinon.stub(service, 'createTeam').returns({
      id: 1,
      name: 'Test',
      createdAt: new Date(),
    });
    req.body = {
      name: 'Test',
    };
    await controller.setOrganisation(req, res);
    expect(res.status.args[0][0]).to.equal(201);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      status: 201,
      message: 'Organization created successfully',
      data: {
        id: 1,
        name: 'Test',
        createdAt: new Intl.DateTimeFormat('en-US').format(new Date()),
      },
    });
  });
  it('setOrganisation - should return status 500 if something goes wrong', async () => {
    sinon.stub(Team, 'count').throws();
    req.body = {
      name: 'Test',
    };
    await controller.setOrganisation(req, res);
    expect(res.status.args[0][0]).to.equal(500);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      error: 'Internal Server Error',
      errorCode: 'CREATE_ORG_ERROR',
      message: 'Error',
    });
  });
  it('getTeamCount - should return status 200 if everything goes right', async () => {
    sinon.stub(service, 'getTeamCount').returns({ teamExists: true });
    await controller.getTeamCount(req, res);
    expect(res.status.args[0][0]).to.equal(200);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      teamExists: true,
    });
  });
  it('getTeamCount - should return status 500 if something goes wrong', async () => {
    sinon.stub(Team, 'count').throws();
    await controller.getTeamCount(req, res);
    expect(res.status.args[0][0]).to.equal(500);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      error: 'Internal Server Error',
      errorCode: 'GET_TEAM_COUNT_ERROR',
      message: 'Failed to get team count',
    });
  });
  it('getTeamDetails - should return status 500 if no team was created', async () => {
    sinon.stub(service, 'getTeam').returns(null);
    await controller.getTeamDetails(req, res);
    expect(res.status.args[0][0]).to.equal(500);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      error: 'Internal Server Error',
      errorCode: 'GET_TEAM_ERROR',
      message: 'Team data not found',
    });
  });
  it('getTeamDetails - should return status 200 and the team and list of users if everything goes right', async () => {
    sinon.stub(service, 'getTeam').resolves({
      team: {
        name: 'Test',
      },
      users: userMocks.validList,
    });
    await controller.getTeamDetails(req, res);
    expect(res.status.args[0][0]).to.equal(200);
    const body = res.json.args[0][0];
    expect(body.name).to.equal('Test');
    expect(body.users).to.have.lengthOf(userMocks.validList.length);
    expect(body.users).not.to.be.deep.equal(userMocks.validList);
  });
  it('getTeamDetails - should return status 500 if something goes wrong', async () => {
    sinon.stub(service, 'getTeam').rejects();
    await controller.getTeamDetails(req, res);
    expect(res.status.args[0][0]).to.equal(500);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      error: 'Internal Server Error',
      errorCode: 'GET_TEAM_ERROR',
      message: 'Error',
    });
  });
  it('updateTeamDetails - should return status 200 if everything goes right', async () => {
    req.body = {
      name: 'Test',
    };
    sinon.stub(service, 'updateTeam').resolves();
    await controller.updateTeamDetails(req, res);
    expect(res.status.args[0][0]).to.equal(200);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      message: 'Team Details Updated Successfully',
    });
  });
  it('updateTeamDetails - should return status 500 if something goes wrong', async () => {
    req.body = {
      name: 'Test',
    };
    sinon.stub(service, 'updateTeam').rejects();
    await controller.updateTeamDetails(req, res);
    expect(res.status.args[0][0]).to.equal(500);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      error: 'Internal Server Error',
      errorCode: 'UPDATE_TEAM_ERROR',
      message: 'Error',
    });
  });
  it('removeMember - should return status 200 if everything goes right', async () => {
    req.params = {
      memberId: 1,
    };
    req.user = {
      id: 1,
    };
    sinon.stub(service, 'removeUserFromTeam').resolves();
    await controller.removeMember(req, res);
    expect(res.status.args[0][0]).to.equal(200);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      message: 'User Removed from Team Successfully',
    });
  });
  it('removeMember - should return status 500 if something goes wrong', async () => {
    req.params = {
      memberId: 1,
    };
    req.user = {
      id: 1,
    };
    sinon.stub(service, 'removeUserFromTeam').rejects();
    await controller.removeMember(req, res);
    expect(res.status.args[0][0]).to.equal(500);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      error: 'Internal Server Error',
      errorCode: 'REMOVE_USER_ERROR',
      message: 'Error',
    });
  });
  it('changeRole - should return status 200 if everything goes right', async () => {
    req.body = {
      userId: 1,
      role: 'member',
    };
    sinon.stub(service, 'updateUserRole').resolves();
    await controller.changeRole(req, res);
    expect(res.status.args[0][0]).to.equal(200);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      message: 'User Role Updated Successfully',
    });
  });
  it('changeRole - should return status 500 if something goes wrong', async () => {
    req.body = {
      userId: 1,
      role: 'member',
    };
    sinon.stub(service, 'updateUserRole').rejects();
    await controller.changeRole(req, res);
    expect(res.status.args[0][0]).to.equal(500);
    const body = res.json.args[0][0];
    expect(body).to.be.deep.equal({
      error: 'Internal Server Error',
      errorCode: 'CHANGE_ROLE_ERROR',
      message: 'Error',
    });
  });
});
