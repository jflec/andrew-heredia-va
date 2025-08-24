import { motion } from "framer-motion";
import { revealParent, revealChild } from "../helpers/motion";
import { useContent } from "../useContent";
import styles from "../styles/Projects.module.css";
import Magnetic from "./Magnetic";
import { springMd } from "../helpers/motion";

export default function Projects() {
  const { content, loading } = useContent();
  if (loading || !content) return null;

  const { projects } = content;
  if (!projects?.length) return null;

  return (
    <motion.div
      className={styles.grid}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      variants={revealParent}
    >
      {projects.map((p, i) => (
        <motion.article
          key={i}
          className={styles.card}
          variants={revealChild()}
        >
          <h3 className={styles.title}>{p.title}</h3>
          <p className={styles.desc}>{p.desc}</p>
          <div className={styles.actions}>
            <Magnetic
              as="a"
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="btn small"
              transition={springMd}
            >
              Open
            </Magnetic>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}
