const express = require("express");
const authenticateJWT = require("../middleware/auth.middleware");
const {login, register, logout, resetPassword, forgetPassword} = require('../controllers/auth.controller')
const { loginValidation, registerValidation, forgetPasswordValidation, resetPasswordValidation,  } = require("../utils/auth.helper");
const { handleValidationErrors } = require('../middleware/validation.middleware')
const router = express.Router();

// router.post("/register", registerValidation, handleValidationErrors, register);
router.post("/login", loginValidation, handleValidationErrors, login);
router.post("/logout", authenticateJWT, logout);
// router.post("/forget-password", forgetPasswordValidation, handleValidationErrors, forgetPassword);
// router.post("/reset-password", resetPasswordValidation, handleValidationErrors, resetPassword);

module.exports = router;
