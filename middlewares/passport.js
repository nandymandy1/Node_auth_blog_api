const { Strategy, ExtractJwt } = require("passport-jwt");
const { appKey } = require("../config/config");
const User = require("../models/User");

// Now we will create auth authentication Strategy
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: appKey
};

module.exports = passport => {
  passport.use(
    new Strategy(opts, async (payload, done) => {
      await User.findById(payload.user_id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => done(null, false));
    })
  );
};
