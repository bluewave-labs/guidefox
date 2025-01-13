const settings = require('../../config/settings');
const { body, validationResult } = require('express-validator');
const UserService = require('../service/user.service');
const { internalServerError } = require('../utils/errors.helper');
const { decode } = require('../utils/auth.helper');

const userService = new UserService();

const isBase64 = (value) => {
  return /^data:image\/[a-zA-Z]+;base64,/.test(value);
};

const checkAtLeastOneField = (req, res, next) => {
  const { name, surname, picture } = req.body;

  if (name === undefined && surname === undefined && picture === undefined) {
    console.error("At least one of 'name', 'surname', or 'picture' must be provided");
    return res.status(400).json({
      updated: false,
      error: 'Error, no value(s) provided to update',
    });
  }

  next();
};

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ updated: false, errors: errors.array() });
  }
  next();
};

const validateProfileUpdate = [
  body('name').optional().isString().trim().escape(),
  body('surname').optional().isString().trim().escape(),
  body('picture')
    .optional()
    .custom((value) => {
      if (value === null) return true;
      try {
        new URL(decode(value));
        return true;
      } catch {
        return isBase64(value);
      }
    })
    .trim()
    .escape()
    .withMessage('Picture must be either a valid URL or a base64 encoded string'),
];

const getUpdatedFields = (original, updated) => {
  const result = {};

  Object.keys(original).forEach((key) => {
    if (updated[key]) {
      if (key === 'picture') {
        result[key] = decode(updated[key]); // unescape picture
      } else {
        result[key] = updated[key];
      }
    } else if (key === 'picture' && !updated[key]) {
      //if picture is deleted return null;
      result[key] = null;
    }
  });

  return result;
};

const getUsersList = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;

  try {
    const { rows: users, count: totalUsers } = await userService.getUsers({ page, limit, search });

    let returnObj = {
      users: users.map((user) => ({
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: settings.user.roleName[user.role],
      })),
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page),
      totalUsers,
    };

    res.status(200).json(returnObj);
  } catch (err) {
    const { statusCode, payload } = internalServerError('GET_USER_LIST_ERROR', err.message);
    res.status(statusCode).json(payload);
  }
};

const getCurrentUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await userService.getUser(userId);
    if (user) {
      const { id, name, surname, email, role, picture } = user;
      return res.status(200).json({ user: { id, name, surname, email, role: settings.user.roleName[role], picture } });
    } else {
      return res.status(400).json({ error: 'User not found' });
    }
  } catch (err) {
    const { statusCode, payload } = internalServerError('GET_USER_ERROR', err.message);
    res.status(statusCode).json(payload);
  }
};

const updateUserDetails = async (req, res) => {
  const userId = req.user.id;
  const inputs = req.body;
  try {
    const updatedUser = await userService.updateUser(userId, inputs);

    return res.status(200).json({ updated: true, user: getUpdatedFields(inputs, updatedUser) });
  } catch (err) {
    const { statusCode, payload } = internalServerError('UPDATE_USER_ERROR', err.message);
    res.status(statusCode).json(payload);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    await userService.deleteUser(userId);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    const { statusCode, payload } = internalServerError('DELETE_USER_ERROR', err.message);
    res.status(statusCode).json(payload);
  }
};

const hasUsers = async (req, res) => {
  try {
    const result = await userService.hasUsers();
    return res.status(200).json(result);
  } catch (err) {
    const { statusCode, payload } = internalServerError('GET_USERS_ERROR', err.message);
    res.status(statusCode).json(payload);
  }
};

module.exports = {
  getUsersList,
  getCurrentUser,
  updateUserDetails,
  deleteUser,
  checkAtLeastOneField,
  validateProfileUpdate,
  handleValidationErrors,
  userService,
  hasUsers,
};
