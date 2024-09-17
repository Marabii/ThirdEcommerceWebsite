const mongoose = require("mongoose");
const router = require("express").Router();
const User = mongoose.model("User");
const passport = require("passport");
const utils = require("../lib/utils");

// Validate an existing user and issue a JWT
router.post("/api/login", function (req, res, next) {
  console.log("api called");
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ success: false, msg: "could not find user" });
      }

      // Function defined at bottom of app.js
      const isValid = utils.validPassword(
        req.body.password,
        user.hash,
        user.salt
      );

      if (isValid) {
        const tokenObject = utils.issueJWT(user);

        res.status(200).json({
          success: true,
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
        });
      } else {
        res
          .status(401)
          .json({ success: false, msg: "you entered the wrong password" });
      }
    })
    .catch((err) => {
      next(err);
    });
});

// Register a new user
router.post("/api/register", function (req, res, next) {
  const saltHash = utils.genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
    username: req.body.name,
    email: req.body.email,
    hash: hash,
    salt: salt,
  });

  try {
    newUser.save().then(() => {
      res.json({ success: true });
    });
  } catch (err) {
    res.json({ success: false, msg: err });
  }
});

module.exports = router;
