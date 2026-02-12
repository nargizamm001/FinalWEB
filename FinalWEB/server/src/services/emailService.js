// FinalWEB/server/src/services/emailService.js

const fetchFn =
  typeof fetch === "function"
    ? fetch
    : (...args) => import("node-fetch").then(({ default: f }) => f(...args));

async function sendEmail({ subject, text, to }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");

  const target = to || process.env.ADMIN_EMAIL;
  if (!target) throw new Error("ADMIN_EMAIL is not set");

  const from = process.env.EMAIL_FROM || "onboarding@resend.dev";

  const r = await fetchFn("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [target],
      subject,
      text,
    }),
  });

  const bodyText = await r.text();
  if (!r.ok) {
    throw new Error(`Resend error ${r.status}: ${bodyText}`);
  }

  try {
    return JSON.parse(bodyText);
  } catch {
    return bodyText;
  }
}

module.exports = { sendEmail };
