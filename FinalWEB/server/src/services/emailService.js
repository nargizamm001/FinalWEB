const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "74.125.140.108", // IPv4 smtp.gmail.com
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    servername: "smtp.gmail.com", // важно для TLS
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
});

async function sendEmail({ subject, text }) {
  return transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME || "App"}" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject,
    text,
  });
}

module.exports = { sendEmail };
