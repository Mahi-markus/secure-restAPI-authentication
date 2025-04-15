const express = require("express");
const {
  register,
  login,
  getProfile,
} = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.middleware");
const router = express.Router();
const auth_role = require("../middlewares/role.middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getProfile);

module.exports = router;
