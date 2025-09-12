const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",   // or "hotmail", "yahoo", or custom SMTP
  auth: {
    user: process.env.EMAIL_USER,  // your email
    pass: process.env.EMAIL_PASS   // app password (not your real email password)
  }
});

module.exports = transporter;
