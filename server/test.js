// Import the Nodemailer library
const nodemailer = require('nodemailer');

// Create a transporter using SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use SSL
    auth: {
      user: 'jibli.salaa@gmail.com',
      pass: 'uwkziylazcsdysni',
    }
  });

// Email data
const mailOptions = {
  from: 'jibli.salaa@gmail.com',
  to: 'lahessine.bouhmou@gmail.com',
  subject: 'Node.js Email Tutorial',
  text: '<body><h1>salam</h1><p style="color:red;">hello world</p></body>',
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});