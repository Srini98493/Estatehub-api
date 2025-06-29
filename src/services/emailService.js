const nodemailer = require("nodemailer");
const config = require("../config/config");
require("dotenv").config();

// Create transporter using environment variables
const transporter = nodemailer.createTransport({
  host: config.email.smtp.host,
  port: config.email.smtp.port,
  secure: false,
  auth: {
    user: config.email.smtp.auth.user,
    pass: config.email.smtp.auth.pass,
  },
});

// Email sending function
const sendEmail = async ({from, to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: from || config.email.from, // sender address
      to, // recipient(s)
      subject, // subject line
      text, // plain text body
      html, // html body
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { sendEmail };
