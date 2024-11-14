const passport = require("passport");
const router = require("express").Router();
const url = require("url");
const utils = require("../lib/utils");
const User = require("mongoose").model("User");

const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GoogleOAuth_CLient_ID,
      clientSecret: process.env.GoogleOAuth_CLient_Secret,
      callbackURL: `${process.env.BACK_END}/google/callback`,
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          console.log("User not found, creating new user.");
          user = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            isAuthenticatedByGoogle: true,
            isEmailVerified: profile.email_verified,
          });

          await user.save();
        }

        return done(null, user);
      } catch (err) {
        console.log("Google authentication error:", err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

//----Handling routes----//

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

const cookie = require("cookie");

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    console.log("api ran")
    const tokenObject = utils.issueJWT(req.user);

    // Extract the original URL (or use a fallback)
    const originalURL = `${process.env.FRONT_END}?token=${tokenObject.token}`;

    // Redirect the user to the original URL after login
    res.redirect(originalURL);
  }
);

router.get("/oauth2callback", async (req, res) => {
  let q = url.parse(req.url, true).query;

  if (q.error) {
    // An error response e.g. error=access_denied
    console.log("Error:" + q.error);
  } else if (q.state !== req.session.state) {
    //check state value
    console.log("State mismatch. Possible CSRF attack");
    res.end("State mismatch. Possible CSRF attack");
  } else {
    // Get access and refresh tokens (if access_type is offline)

    let { tokens } = await oauth2Client.getToken(q.code);
    oauth2Client.setCredentials(tokens);
  }

  res.end("Authentication successful. Please return to the console.");
});

//----Finish Hanlding routes----//

module.exports = router;
