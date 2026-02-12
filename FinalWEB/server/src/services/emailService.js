const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendEmail({ subject, text }) {
  return transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject,
    text,
  });
}

module.exports = { sendEmail };
