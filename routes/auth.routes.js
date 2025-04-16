const express = require("express");
const {
  register,
  login,
  getProfile,
} = require("../controllers/auth.controller");
const router = express.Router();
const passport = require("passport");
const auth_role = require("../middlewares/role.middleware");
const auth_validation = require("../validation/auth.validation");
const { register_valid, login_valid } = auth_validation;
const validate = require("../middlewares/validate.middleware");

router.post("/register", register_valid, validate, register);
router.post("/login", login_valid, validate, login);
// GET /api/profile - Protected route
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  getProfile
);

module.exports = router;
