// middlewares/auth.validation.js
const { body } = require("express-validator");

const register_valid = [
  body("email")
    .exists({ checkFalsy: true })
    .withMessage("Email is required") // Check if email exists first
    .bail()
    .isEmail()
    .withMessage("Invalid email"), // Check if it's a valid email if it exists
  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required") // Check if password exists first
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"), // Check if password is at least 6 characters long
  body("role")
    .exists({ checkNull: true })
    .withMessage("Role is required") // Check if role exists first
    .bail()
    .isIn(["user", "admin"])
    .withMessage("Role must be either 'user' or 'admin'"), // Check if role is either 'user' or 'admin'
];

const login_valid = [
  body("email")
    .exists()
    .withMessage("Email is required") // Check if email exists first
    .isEmail()
    .withMessage("Invalid email"), // Check if it's a valid email if it exists
  body("password").exists().withMessage("Password is required"), // Check if password exists first
];

module.exports = {
  register_valid,
  login_valid,
};
