const express = require("express");
const passport = require("passport");
const auth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { checkout } = require("../controllers/payment.controller");
const { checkout_valid } = require("../validation/checkout.validation");

const router = express.Router();

router.post(
  "/checkout",
  passport.authenticate("jwt", { session: false }),
  checkout_valid,
  validate,
  checkout
);

module.exports = router;
