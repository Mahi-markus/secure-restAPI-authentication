const express = require("express");
const auth = require("../middlewares/auth.middleware");
const { checkout } = require("../controllers/payment.controller");
const router = express.Router();
const passport = require("passport");

//router.post("/checkout", checkout);

router.post(
  "/checkout",
  passport.authenticate("jwt", { session: false }),
  checkout
);

module.exports = router;
