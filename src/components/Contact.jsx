import { useState } from "react";
import { motion } from "framer-motion";
import { revealChild } from "../helpers/motion";
import { useContent } from "../useContent";
import styles from "../styles/Contact.module.css";
import Magnetic from "./Magnetic";
import { springMd } from "../helpers/motion";

export default function Contact() {
  const { content, loading } = useContent();
  const [sending, setSending] = useState(false);
  if (loading || !content) return null;
  const { site } = content;

  async function handleSubmit(e) {
    e.preventDefault();

    // Cache the form immediately so we don't rely on the event later
    const form = e.currentTarget; // this IS the <form>
    if (!form) return; // extra guard

    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.email || !data.message) {
      alert("Please provide your email and a message.");
      return;
    }

    try {
      setSending(true);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          project: data.project,
          message: data.message,
          pot: data.company || "", // honeypot
        }),
      });

      const json = await res.json();

      if (json.ok) {
        form.reset(); // ✅ reset the cached form, not e.target / e.currentTarget
        alert("Thanks! Your message was sent.");
      } else {
        alert(json.error || "Sorry, something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Sorry, something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <motion.form
      className={styles.form}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      onSubmit={handleSubmit}
    >
      <motion.div className={styles.twoCol} variants={revealChild()}>
        <label>
          Name
          <input name="name" required placeholder="Your name" />
        </label>
        <label>
          Email
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
          />
        </label>
      </motion.div>

      <motion.label variants={revealChild()}>
        Project
        <input
          name="project"
          placeholder="e.g., 30s commercial, explainer video"
        />
      </motion.label>

      <motion.label variants={revealChild()}>
        Message
        <textarea
          name="message"
          rows="6"
          placeholder="Share details, timeline, tone…"
        />
      </motion.label>

      <input
        name="company"
        autoComplete="off"
        tabIndex={-1}
        style={{ display: "none" }}
      />

      <Magnetic
        as="button"
        type="submit"
        className="btn primary"
        transition={springMd}
        whileHover={{ scale: 1.03 }}
        disabled={sending}
      >
        {sending ? "Sending..." : "Send Email"}
      </Magnetic>

      <motion.p className="muted small" variants={revealChild(6, 0.35)}>
        Prefer direct? <a href={`mailto:${site.email}`}>{site.email}</a>
      </motion.p>
    </motion.form>
  );
}
