// middleware/auth.js
const passport = require("passport");
require("../config/passport");

module.exports = passport.authenticate("jwt", { session: false });
