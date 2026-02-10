const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail({ subject, text }) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.NOTIFY_TO_EMAIL,
    subject,
    text,
  });
  console.log("Email sent:", info.messageId);
}

module.exports = { sendEmail };
