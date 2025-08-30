// api/contact.js
import { Resend } from "resend";

export const runtime = "nodejs";

const RESEND_KEY = (process.env.RESEND_API_KEY || "").trim();
const CONTACT_TO = (process.env.CONTACT_TO || "").trim();
const FROM = (process.env.CONTACT_FROM || "onboarding@resend.dev").trim();

// Debug flags (enable in Vercel → Settings → Environment Variables)
const DEBUG_PROVIDER_ERRORS = (process.env.DEBUG_PROVIDER_ERRORS || "") === "1";
const ALLOW_SMOKE_TEST = (process.env.ALLOW_SMOKE_TEST || "") === "1";

const resend = new Resend(RESEND_KEY);

const err = (msg, status = 500) =>
  Response.json({ ok: false, error: msg }, { status });
const ok = (body = {}, status = 200) =>
  Response.json({ ok: true, ...body }, { status });

const mask = (s = "") => s.replace(/(^.).+(@.*$)/, "$1***$2");

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

export async function GET(request) {
  const bad = ensureEnv();
  if (bad) return bad;

  // Minimal health in prod; only send email when explicitly allowed
  if (!ALLOW_SMOKE_TEST) return ok({ status: "up" });

  const url = new URL(request.url);
  const toOverride = (url.searchParams.get("to") || "").trim();
  const to = toOverride || CONTACT_TO;

  console.log("GET /api/contact -> to:", mask(to), "from:", mask(FROM));

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      subject: "Hello World",
      html: "<p>Test email from /api/contact (GET)</p>",
    });
    if (error) {
      console.error("Resend error (GET):", error);
      const status = error.statusCode ?? error.status ?? 502;
      return DEBUG_PROVIDER_ERRORS
        ? err(`${status}: ${error.message}`, status)
        : err("Email send failed.", 502);
    }
    return ok({ id: data?.id, mode: "hello", to: mask(to) });
  } catch (e) {
    console.error("GET /api/contact exception:", e);
    return err("Internal error.", 500);
  }
}

export async function POST(request) {
  const bad = ensureEnv();
  if (bad) return bad;

  let body = {};
  try {
    body = await request.json();
  } catch {
    console.error("POST /api/contact: JSON parse failed");
  }

  const { name = "", email = "", project = "", message = "", pot = "" } = body;

  if (pot) return ok(); // honeypot

  if (!email || !message) return err("email and message are required", 400);

  const subject = `Voice Acting: ${project || "Project"}`;
  const html = `
    <p><strong>From:</strong> ${escapeHTML(name)} &lt;${escapeHTML(
    email
  )}&gt;</p>
    <p><strong>Project:</strong> ${escapeHTML(project || "-")}</p>
    <hr/><div>${escapeHTML(message).replace(/\n/g, "<br/>")}</div>
  `;

  console.log(
    "POST /api/contact -> to:",
    mask(CONTACT_TO),
    "from:",
    mask(FROM)
  );

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: CONTACT_TO,
      replyTo: email,
      subject,
      html,
    });
    if (error) {
      console.error("Resend error (POST):", error);
      const status = error.statusCode ?? error.status ?? 502;
      return DEBUG_PROVIDER_ERRORS
        ? err(`${status}: ${error.message}`, status)
        : err("Email send failed.", 502);
    }
    return ok({ id: data?.id });
  } catch (e) {
    console.error("POST /api/contact exception:", e);
    return err("Internal error.", 500);
  }
}
