import { motion, useScroll, useTransform } from "framer-motion";
import { useContent } from "../useContent";
import styles from "../styles/Hero.module.css";
import Magnetic from "./Magnetic";

import { YoutubeLogoIcon } from "@phosphor-icons/react/dist/ssr/YoutubeLogo";
import { TiktokLogoIcon } from "@phosphor-icons/react/dist/ssr/TiktokLogo";

export default function Hero() {
  const { content, loading } = useContent();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -20]);
  const o = useTransform(scrollY, [0, 300], [1, 0.92]);

  if (loading || !content) return null;
  const { site, social } = content;

  return (
    <motion.div
      className={styles.inner}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{ y, opacity: o }}
    >
      <img
        src="/andrew_photo.webp"
        alt={`${site.name} Headshot`}
        className={styles.avatar}
      />

      <p className={styles.eyebrow}>{site.role}</p>
      <h1 className={styles.title}>{site.name}</h1>
      <p className={styles.tagline}>{site.tagline}</p>

      <div className={styles.ctaRow}>
        <Magnetic>
          <a href="#projects" className="btn primary">
            See Projects
          </a>
        </Magnetic>
        <Magnetic>
          <a href="#contact" className="btn">
            Book {site.name.split(" ")[0]}
          </a>
        </Magnetic>
      </div>

      <div className={styles.socialRow}>
        {social?.tiktok && (
          <a
            href={social.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className={styles.socialBtn}
          >
            <TiktokLogoIcon
              size={32}
              weight="regular"
              className={styles.iconRegular}
            />
            <TiktokLogoIcon
              size={32}
              weight="fill"
              className={styles.iconFill}
            />
          </a>
        )}
        {social?.youtube && (
          <a
            href={social.youtube}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className={styles.socialBtn}
          >
            <YoutubeLogoIcon
              size={32}
              weight="regular"
              className={styles.iconRegular}
            />
            <YoutubeLogoIcon
              size={32}
              weight="fill"
              className={styles.iconFill}
            />
          </a>
        )}
      </div>
    </motion.div>
  );
}
