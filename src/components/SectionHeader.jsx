import { motion } from "framer-motion";
import { revealChild } from "../helpers/motion";
import styles from "../styles/SectionHeader.module.css";

export default function SectionHeader({ title, sub }) {
  return (
    <motion.div
      className={styles.wrap}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
    >
      <motion.h2 variants={revealChild(10, 0.4)} className={styles.header}>
        {title}
      </motion.h2>
      {sub && (
        <motion.p className="muted" variants={revealChild(8, 0.4)}>
          {sub}
        </motion.p>
      )}
    </motion.div>
  );
}
