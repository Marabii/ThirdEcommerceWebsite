// External modules
const express = require("express");
const Mailgun = require("mailgun-js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const User = require("mongoose").model("User");
const router = express.Router();

const config = {
  api: {
    mailgunUrl: "https://api.eu.mailgun.net",
  },
  paths: {
    emailAttachments: path.join(__dirname, "../assets/emailAttachments"),
  },
  mailgun: {
    apiKey: process.env.MAILGUN_API,
    domain: process.env.DOMAINMAILGUN,
  },
};

const mg = new Mailgun({
  apiKey: config.mailgun.apiKey,
  domain: config.mailgun.domain,
  url: config.api.mailgunUrl,
});

// Function to delete all files in a directory
function deleteFilesInDirectory(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", filePath, err);
        } else {
          console.log("Deleted file:", filePath);
        }
      });
    });
  });
}

// Function to get all files in a directory
function getFilesInDirectory(directory) {
  try {
    // Check if the directory exists
    if (!fs.existsSync(directory)) {
      // Create the directory if it does not exist
      fs.mkdirSync(directory, { recursive: true });
    }

    // Synchronously read the directory
    const files = fs.readdirSync(directory);
    return files.map((file) => path.join(directory, file));
  } catch (err) {
    throw new Error(`Failed to read or create directory: ${err.message}`);
  }
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.paths.emailAttachments);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage }).array("attachment");

// Routes for email operations
router.post("/api/sendEmailAttachments", upload, (req, res) => {
  res.send("Files received and saved!");
});

const sendEmail = async (
  subject,
  html,
  recipientType,
  specificEmails,
  to = ""
) => {
  try {
    const attachments = getFilesInDirectory(config.paths.emailAttachments);

    const emailData = {
      from: "Farnic commerce <minehamza97@gmail.com>",
      to: "",
      subject: subject,
      html: html,
      inline: attachments,
    };

    let emailPromises = [];

    // Determine recipient type and collect email sending promises
    switch (recipientType) {
      case "specific":
        emailPromises = specificEmails.map((email) =>
          sendEmailPromise(email, emailData)
        );
        break;
      case "emailVerification":
        emailData.to = to;
        emailPromises.push(sendEmailPromise(emailData.to, emailData));
        break;
    }

    // Wait for all emails to be sent
    const emailResults = await Promise.all(emailPromises);
    console.log("Emails sent:", emailResults);

    // Delete files after confirming emails are sent
    deleteFilesInDirectory(config.paths.emailAttachments);
    console.log("Emails sent successfully");
  } catch (error) {
    console.error("Failed to send emails:", error);
  }
};

// Helper function to return a promise for sending an email
function sendEmailPromise(to, emailData) {
  return new Promise((resolve, reject) => {
    const data = { ...emailData, to };
    mg.messages().send(data, function (error, body) {
      if (error) {
        console.error("Failed to send email to:", to, error);
        reject(error);
      } else {
        console.log("Email sent to:", to);
        resolve(body);
      }
    });
  });
}

module.exports = { sendEmail: sendEmail };
