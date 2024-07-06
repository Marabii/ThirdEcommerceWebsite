const sendEmail = require("./lib/email").sendEmail;
const randomString = (Math.random() + 1).toString(36).substring(5);
const email = "minehamza90@gmail";

sendEmail(
  "Email Verification",
  "Your verification code is: " + randomString,
  "emailVerification",
  [],
  email
);
