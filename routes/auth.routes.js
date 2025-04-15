const express = require("express");
const {
  register,
  login,
  getProfile,
} = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.middleware");
const router = express.Router();
const passport = require("passport");
const auth_role = require("../middlewares/role.middleware");

router.post("/register", register);
router.post("/login", login);
// GET /api/profile - Protected route
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  getProfile
);

module.exports = router;
