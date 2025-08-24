import { motion } from "framer-motion";
import { revealChild } from "../helpers/motion";
import { useContent } from "../useContent";
import styles from "../styles/Contact.module.css";
import Magnetic from "./Magnetic";
import { springMd } from "../helpers/motion";

export default function Contact() {
  const { content, loading } = useContent();
  if (loading || !content) return null;
  const { site } = content;

  return (
    <motion.form
      className={styles.form}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      onSubmit={(e) => {
        e.preventDefault();
        const data = Object.fromEntries(
          new FormData(e.currentTarget).entries()
        );
        const subject = encodeURIComponent(
          `VO Inquiry — ${data.project || "Project"}`
        );
        const body = encodeURIComponent(
          `Hi ${site.name},%0D%0A%0D%0A${data.message || ""}%0D%0A%0D%0A— ${
            data.name || ""
          } (${data.email || ""})`
        );
        window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      }}
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
        ></textarea>
      </motion.label>

      <Magnetic
        as="button" // ⬅️ string, not motion.button
        className="btn primary"
        type="submit"
        transition={springMd}
        whileHover={{ scale: 1.03 }} // optional
      >
        Send Email
      </Magnetic>

      <motion.p className="muted small" variants={revealChild(6, 0.35)}>
        Prefer direct? {site.email}
      </motion.p>
    </motion.form>
  );
}
