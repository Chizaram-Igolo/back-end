const passport = require("passport");
const passportJWT = require("passport-jwt");
const Strategy = require("passport-local").Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
User = require("../db/User");

// Local Strategy
passport.use(
  new Strategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      // If any error
      if (err) {
        return done(err);
      }

      // If no user found
      if (!user) {
        return done(null, false, {
          message: "No user found.",
        });
      }

      // Password not matched
      user
        .login(password)
        .then(() => {
          return done(null, user);
        })
        .catch((err) => {
          return done(err, false, {
            message: "Password not matched.",
          });
        });

      return done(null, user);
    });
  })
);

// JWT
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "jwt_secret",
    },
    (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then((user) => {
          return done(null, user);
        })
        .catch((err) => {
          return done(err, false, {
            message: "Token not matchedd",
          });
        });
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if (err) {
      return done(err);
    }

    done(null, user);
  });
});

module.exports = passport;
