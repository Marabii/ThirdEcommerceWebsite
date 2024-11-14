const mongoose = require("mongoose");
const router = require("express").Router();
const User = mongoose.model("User");
const passport = require("passport");
const utils = require("../lib/utils");
const sendEmail = require("../lib/email").sendEmail;

// Validate an existing user and issue a JWT
router.post("/api/login", function (req, res, next) {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ success: false, msg: "could not find user" });
      }

      if (user.isAuthenticatedByGoogle) {
        return res
          .status(404)
          .json({ success: false, msg: "Please use Google login" });
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

router.get(
  "/api/verifyEmail",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { email, userId } = req.query;

    if (!email || !userId) {
      return res.status(400).send("Missing email or user ID");
    }

    try {
      // Generate a random verification code
      const randomString = (Math.random() + 1).toString(36).substring(5);

      // Find user by ID and update the email verification code
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send("User not found");
      }

      // Set the new email verification code and the creation date
      user.emailVerificationCode = {
        code: randomString,
        dateCreated: new Date(), // Sets the current date and time
      };

      await user.save();

      // Uncomment and configure the sendEmail call as necessary
      sendEmail(
        "Email Verification",
        "Your verification code is: " + randomString,
        "emailVerification",
        [],
        email
      );

      res.status(200).send("Verification code sent.");
    } catch (error) {
      console.error("Error in verifying email:", error);
      res.status(500).send("Internal server error");
    }
  }
);

router.get(
  "/api/verifyEmailCode",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { code: codeFromUser, userId } = req.query;

    if (!codeFromUser || !userId) {
      return res.status(400).send("Missing code or user ID");
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }

      const { code: storedCode, dateCreated } = user.emailVerificationCode;
      if (!storedCode || !dateCreated) {
        return res.status(404).send("No verification code found");
      }

      const now = new Date();
      const timeDiff = now - new Date(dateCreated); // Convert dateCreated to Date object if not already

      if (timeDiff > 5 * 60 * 1000) {
        // 5 minutes in milliseconds
        user.emailVerificationCode = {}; // Clear the verification code object
        await user.save();
        return res.status(400).send("Verification code has expired");
      }

      if (storedCode !== codeFromUser) {
        return res.status(401).send("Incorrect verification code");
      }

      user.isEmailVerified = true;
      user.emailVerificationCode = {}; // Optionally clear the code after successful verification
      await user.save();
      return res.status(200).send("Email verified successfully");
    } catch (error) {
      console.error("Error verifying email code:", error);
      return res.status(500).send("Internal server error");
    }
  }
);

router.post(
  "/api/updateUser",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { name, email } = req.body;
    try {
      const user = await User.findById(req.user._id);
      if (user.email !== email) {
        user.isEmailVerified = false;
      }
      user.name = name;
      user.email = email;
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  }
);


router.get(
  "/api/getUserData",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userId = req.user._id;

    // Check if the provided id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user ID format");
    }

    try {
      const userData = await User.findById(
        userId,
        { username: 1, email: 1, isEmailVerified: 1, isAdmin: 1 }
      );

      if (userData) {
        res.status(200).json(userData);
      } else {
        res.status(404).send("No user found");
      }
    } catch (e) {
      console.error("getUserData", e);
      res.status(500).send("Internal server error");
    }
  }
);

router.get("/api/verifyUser", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    console.log("verification api ran");
    if (err) {
      res.status(500).send("An internal error occured");
    }
    if (!user) {
      // If authentication failed, user will be false
      res.json({ isLoggedIn: false });
    } else {
      User.findById(user._id).then((data) => {
        const cartItems = data.cart;
        res.status(200).json({ isLoggedIn: true, cartItems: cartItems });
      });
    }
  })(req, res, next);
});

module.exports = router;
