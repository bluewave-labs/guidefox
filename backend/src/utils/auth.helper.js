const { body } = require("express-validator");
const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("surname").notEmpty().withMessage("Surname is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Must be atleast 8 characters")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Must contain one special character"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

const forgetPasswordValidation = [
  body("email").isEmail().withMessage("Invalid email address"),
];

const resetPasswordValidation = [
  body("token").notEmpty().withMessage("Token is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("Must be atleast 8 characters")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Must contain one special character"),
];

module.exports = {
  registerValidation,
  loginValidation,
  forgetPasswordValidation,
  resetPasswordValidation,
};