/* eslint-env node */
// api/contact.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Use POST /api/contact" });
  }

  const body = await readJson(req);
  const { name = "", email = "", project = "", message = "" } = body;

  if (!email || !message) {
    return res
      .status(400)
      .json({ ok: false, error: "email and message are required" });
  }

  // Keep it simple like the example: use Resend's onboarding sender for now.
  const subject = `VO Inquiry — ${project || "Project"}`;
  const html = `
    <p><strong>From:</strong> ${escape(name)} &lt;${escape(email)}&gt;</p>
    <p><strong>Project:</strong> ${escape(project || "-")}</p>
    <hr/>
    <div>${escape(message).replace(/\n/g, "<br/>")}</div>
  `;

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev", // super simple; no DNS setup required
    to: process.env.CONTACT_TO, // your inbox
    replyTo: email, // replies go to the visitor
    subject,
    html,
  });

  if (error) return res.status(500).json({ ok: false, error: error.message });
  return res.status(200).json({ ok: true, id: data?.id });
}

function escape(s = "") {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        c
      ])
  );
}

async function readJson(req) {
  if (req.body) return req.body;
  const chunks = [];
  for await (const ch of req) chunks.push(ch);
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    return {};
  }
}
