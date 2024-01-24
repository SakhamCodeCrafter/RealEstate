// Import necessary modules
require('dotenv').config();
const nodemailer = require("nodemailer");

// Create a Nodemailer transporter for sending emails
var transporter = nodemailer.createTransport({
  // Specify the email service (Gmail)
  service: "gmail",

  // Configure authentication using environment variables
  auth: {
    user: process.env.EMAIL,      // Your email address
    pass: process.env.PASSWORD,   // Your email password or an application-specific password
  },
});

// Export the configured transporter for use in other parts of the application
module.exports = transporter;
