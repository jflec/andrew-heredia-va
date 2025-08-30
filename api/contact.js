/* eslint-env node */
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Use POST /api/contact" });
  }

  // Vercel usually gives parsed JSON in req.body; safely parse if it's a string
  let body = req.body || {};
  if (typeof body === "string") {
    try {
      body = JSON.parse(body || "{}");
    } catch (err) {
      body = {}; // fallback instead of an empty catch (fixes 'Empty block statement')
    }
  }

  const { name = "", email = "", project = "", message = "" } = body;

  if (!email || !message) {
    return res
      .status(400)
      .json({ ok: false, error: "email and message are required" });
  }

  const subject = `VO Inquiry — ${project || "Project"}`;
  const html = `
    <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(
    email
  )}&gt;</p>
    <p><strong>Project:</strong> ${escapeHtml(project || "-")}</p>
    <hr/>
    <div>${escapeHtml(message).replace(/\n/g, "<br/>")}</div>
  `;

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev", // simple sender; no DNS setup needed
    to: process.env.CONTACT_TO, // your inbox (set in Vercel env)
    replyTo: email, // replies go to the visitor
    subject,
    html,
  });

  if (error) return res.status(500).json({ ok: false, error: error.message });
  return res.status(200).json({ ok: true, id: data?.id });
}

function escapeHtml(s = "") {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c])
  );
}
