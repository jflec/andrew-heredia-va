/* eslint-env node */
// api/contact.js (or contact.mjs if no "type":"module" in package.json)
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const CONTACT_FROM = process.env.CONTACT_FROM || "onboarding@resend.dev";
const CONTACT_TO = process.env.CONTACT_TO;
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || "*";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  // GET = quick smoke test (sends "Hello World")
  if (req.method === "GET") {
    try {
      await resend.emails.send({
        from: CONTACT_FROM,
        to: CONTACT_TO,
        subject: "Hello World",
        html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
      });
      return res.status(200).json({ ok: true, mode: "hello" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: "Hello send failed" });
    }
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const { name, email, project, message, pot } = req.body || {};
    if (pot) return res.status(200).json({ ok: true }); // honeypot

    if (!email || !message) {
      return res
        .status(400)
        .json({ ok: false, error: "Missing required fields" });
    }

    const subject = `VO Inquiry — ${project || "Project"}`;
    const text = `From: ${name || "Anonymous"} <${email}>
Project: ${project || "-"}

${message}`;

    await resend.emails.send({
      from: CONTACT_FROM, // swap to your verified domain later
      to: CONTACT_TO,
      subject,
      replyTo: email,
      text,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Email send failed" });
  }
}
