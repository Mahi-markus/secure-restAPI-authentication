// const { Strategy, ExtractJwt } = require("passport-jwt");
// const User = require("../models/user.model");
// require("dotenv").config();

// module.exports = (passport) => {
//   passport.use(
//     new Strategy(
//       {
//         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//         secretOrKey: process.env.JWT_SECRET,
//       },
//       async (payload, done) => {
//         try {
//           const user = await User.findById(payload.id);
//           if (user) return done(null, user);
//           return done(null, false);
//         } catch (err) {
//           done(err, false);
//         }
//       }
//     )
//   );
// };
