const express = require("express");
const {
  register,
  login,
  getProfile,
  refresh,
} = require("../controllers/auth.controller");
const router = express.Router();
const passport = require("passport");
const auth_validation = require("../validation/auth.validation");
const { register_valid, login_valid } = auth_validation;
const validate = require("../middlewares/validate.middleware");
const async_handler = require("../utils/asyncHandler");

router.post("/register", register_valid, validate, async_handler(register));
router.post("/login", login_valid, validate, async_handler(login));
// GET /api/profile - Protected route
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  async_handler(getProfile)
);

router.post("/refresh", refresh);

module.exports = router;
