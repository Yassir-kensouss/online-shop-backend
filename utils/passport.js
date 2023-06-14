const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "128474420027-3cmf1ufttlh5ff8nfniebuqjtm4skard.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http:localhost:8000/api/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });

      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
