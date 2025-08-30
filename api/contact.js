import { Resend } from "resend";

export const runtime = "nodejs";

const RESEND_KEY = (process.env.RESEND_API_KEY || "").trim();
const CONTACT_TO = (process.env.CONTACT_TO || "").trim();
const FROM = (process.env.CONTACT_FROM || "onboarding@resend.dev").trim();

const resend = new Resend(RESEND_KEY);

const err = (msg, status = 500) =>
  Response.json({ ok: false, error: msg }, { status });
const ok = (body = {}, status = 200) =>
  Response.json({ ok: true, ...body }, { status });

const escapeHTML = (s = "") =>
  String(s).replace(
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

const ensureEnv = () => {
  if (!RESEND_KEY) return err("RESEND_API_KEY missing");
  if (!CONTACT_TO) return err("CONTACT_TO missing");
  return null;
};

export async function GET() {
  const bad = ensureEnv();
  if (bad) return bad;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: CONTACT_TO,
      subject: "Hello World",
      html: "<p>Test email from /api/contact (GET)</p>",
    });
    if (error) return err(error.message);
    return ok({ id: data?.id, mode: "hello" });
  } catch (e) {
    return err(String(e));
  }
}

export async function POST(request) {
  const bad = ensureEnv();
  if (bad) return bad;

  let body = {};
  try {
    body = await request.json();
  } catch {
    console.log(
      "Something went wrong! Please contact andrewherediavo@gmail.com"
    );
  }

  const { name = "", email = "", project = "", message = "", pot = "" } = body;

  if (pot) return ok();

  if (!email || !message) return err("email and message are required", 400);

  const subject = `Voice Acting: ${project || "Project"}`;
  const html = `
    <p><strong>From:</strong> ${escapeHTML(name)} &lt;${escapeHTML(
    email
  )}&gt;</p>
    <p><strong>Project:</strong> ${escapeHTML(project || "-")}</p>
    <hr/><div>${escapeHTML(message).replace(/\n/g, "<br/>")}</div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: CONTACT_TO,
      replyTo: email,
      subject,
      html,
    });
    if (error) return err(error.message);
    return ok({ id: data?.id });
  } catch (e) {
    return err(String(e));
  }
}
