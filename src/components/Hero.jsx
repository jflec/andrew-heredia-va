import { motion, useScroll, useTransform } from "framer-motion";
import Magnetic from "./Magnetic";
import { springMd } from "../helpers/motion";
import { useContent } from "../useContent";
import styles from "../styles/Hero.module.css";

export default function Hero() {
  const { content, loading } = useContent();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -20]);
  const o = useTransform(scrollY, [0, 300], [1, 0.92]);

  if (loading || !content) return null;
  const { site } = content;

  return (
    <motion.div
      className={styles.inner}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{ y, opacity: o }}
    >
      <Magnetic
        as="img"
        src="/profile_picture.webp"
        alt={`${site.name} Headshot`}
        className={styles.avatar}
        strength={16}
        whileHover={{ scale: 1.03 }}
        transition={springMd}
      />

      <p className={styles.eyebrow}>{site.role}</p>
      <h1 className={styles.title}>{site.name}</h1>
      <p className={styles.tagline}>{site.tagline}</p>

      <div className={styles.ctaRow}>
        <Magnetic
          as="a"
          href="#projects"
          className="btn primary"
          transition={springMd}
        >
          See Projects
        </Magnetic>
        <Magnetic as="a" href="#contact" className="btn" transition={springMd}>
          Book {site.name.split(" ")[0]}
        </Magnetic>
      </div>
    </motion.div>
  );
}
