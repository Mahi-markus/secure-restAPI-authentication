// middlewares/auth.validation.js
const { body } = require("express-validator");

const register_valid = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").isLength({ min: 6 }).withMessage("Password too short"),
  body("role")
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin"),
];

const login_valid = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = {
  register_valid,
  login_valid,
};
