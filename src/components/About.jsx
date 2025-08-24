import { motion } from "framer-motion";
import { revealParent, revealChild } from "../helpers/motion";
import { useContent } from "../useContent";
import styles from "../styles/About.module.css";

export default function About() {
  const { content, loading } = useContent();
  if (loading || !content) return null;
  const { about } = content;

  return (
    <motion.div
      className="grid two"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      variants={revealParent}
    >
      <motion.p className={styles.lead} variants={revealChild()}>
        {about.lead}
      </motion.p>
      <motion.ul className={styles.kvs} variants={revealChild()}>
        {about.keyValues.map(({ k, v }) => (
          <li key={k}>
            <strong>{k}:</strong> {v}
          </li>
        ))}
      </motion.ul>
    </motion.div>
  );
}
