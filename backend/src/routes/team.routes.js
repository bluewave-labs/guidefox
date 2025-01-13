const express = require('express');
const {
  setOrganisation,
  getTeamDetails,
  getTeamCount,
  getServerUrl,
  setServerUrl,
  updateTeamDetails,
  removeMember,
  changeRole,
} = require('../controllers/team.controller');
const { sendTeamInvite, getAllInvites } = require('../controllers/invite.controller');
const authenticateJWT = require('../middleware/auth.middleware');
const accessGuard = require('../middleware/accessGuard.middleware');
const settings = require('../../config/settings');
const {
  validateSetServerUrl,
  validateOrganizationName,
  validationInvite,
  validationChangeRole,
  validateIdParam,
} = require('../utils/team.helper');
const { handleValidationErrors } = require('../middleware/validation.middleware');

const router = express.Router();
const teamPermissions = settings.team.permissions;

router.get('/count', getTeamCount);
router.use(authenticateJWT);
router.get('/details', getTeamDetails);
router.get('/urls', accessGuard(teamPermissions.serverUrl), getServerUrl);

router.post(
  '/set-organisation',
  accessGuard(teamPermissions.setOrg),
  validateOrganizationName,
  handleValidationErrors,
  setOrganisation
);
router.post('/invite', accessGuard(teamPermissions.invite), validationInvite, handleValidationErrors, sendTeamInvite);
router.put(
  '/update',
  accessGuard(teamPermissions.update),
  validateOrganizationName,
  handleValidationErrors,
  updateTeamDetails
);
router.put(
  '/change-role',
  accessGuard(teamPermissions.changeRole),
  validationChangeRole,
  handleValidationErrors,
  changeRole
);
router.put(
  '/urls',
  accessGuard(teamPermissions.serverUrl),
  validateSetServerUrl,
  handleValidationErrors,
  setServerUrl
);

router.delete(
  '/remove/:memberId',
  accessGuard(teamPermissions.removeUser),
  validateIdParam,
  handleValidationErrors,
  removeMember
);
router.get('/get-all-invites', accessGuard(teamPermissions.removeUser), getAllInvites);
module.exports = router;
