async function sendEmail({ subject, text }) {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.error("BREVO_API_KEY is missing");
    return;
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "api-key": apiKey
    },
    body: JSON.stringify({
      sender: { email: process.env.EMAIL_FROM },
      to: [{ email: process.env.NOTIFY_TO_EMAIL }],
      subject,
      textContent: text
    })
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("BREVO API ERROR:", res.status, data);
  } else {
    console.log("EMAIL SENT VIA BREVO API", data);
  }
}

module.exports = { sendEmail };
