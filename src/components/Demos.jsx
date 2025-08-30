import { useRef, useState, useEffect, memo } from "react";
import { motion } from "framer-motion";

import styles from "../styles/Demos.module.css";
import { useContent } from "../useContent";
import { revealParent, revealChild } from "../helpers/motion";

import { PlayIcon } from "@phosphor-icons/react/dist/ssr/Play";
import { PauseIcon } from "@phosphor-icons/react/dist/ssr/Pause";
import Magnetic from "./Magnetic";

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
function valueFromPointerEvent(e, el) {
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  return clamp01(x / rect.width);
}

const DemoPlayer = memo(function DemoPlayer({ title, src }) {
  const audioRef = useRef(null);
  const progressInputRef = useRef(null);
  const volumeInputRef = useRef(null);
  const draggingRef = useRef({ progress: false, volume: false });

  const [isPlaying, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.25);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => {
      if (a.duration) setProgress(a.currentTime / a.duration);
    };
    const onEnded = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnded);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onTime = () => {
      if (a.duration) setProgress(a.currentTime / a.duration);
    };
    const onEnded = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnded);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);

    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
    };
  }, []);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;

    if (a.paused) {
      if (typeof document !== "undefined") {
        document.querySelectorAll("audio").forEach((el) => {
          if (el !== a) el.pause();
        });
      }
      a.play();
    } else {
      a.pause();
    }
  };

  const onProgressPointerDown = (e) => {
    if (!progressInputRef.current) return;
    e.preventDefault();
    const val = valueFromPointerEvent(e, progressInputRef.current);
    const a = audioRef.current;
    if (a && a.duration) {
      a.currentTime = val * a.duration;
      setProgress(val);
    }
    draggingRef.current.progress = true;
  };
  const onVolumePointerDown = (e) => {
    if (!volumeInputRef.current) return;
    e.preventDefault();
    const val = valueFromPointerEvent(e, volumeInputRef.current);
    setVolume(val);
    draggingRef.current.volume = true;
  };

  const onProgressClick = (e) => {
    if (!progressInputRef.current) return;
    const val = valueFromPointerEvent(e, progressInputRef.current);
    const a = audioRef.current;
    if (a && a.duration) {
      a.currentTime = val * a.duration;
      setProgress(val);
    }
  };
  const onVolumeClick = (e) => {
    if (!volumeInputRef.current) return;
    const val = valueFromPointerEvent(e, volumeInputRef.current);
    setVolume(val);
  };

  return (
    <div className={styles.card}>
      <div className={styles.meta}>
        <h3 className={styles.title}>{title}</h3>
      </div>

      <div className={styles.controlsBlock}>
        <input
          ref={progressInputRef}
          className={`${styles.line} ${styles.progressLine}`}
          type="range"
          min="0"
          max="1"
          step="any"
          value={progress}
          onChange={() => {}}
          onPointerDown={onProgressPointerDown}
          onClick={onProgressClick}
          aria-label="Progress"
          style={{ ["--val"]: `${progress * 100}%`, cursor: "pointer" }}
        />

        <input
          ref={volumeInputRef}
          className={`${styles.line} ${styles.volumeLine}`}
          type="range"
          min="0"
          max="1"
          step="any"
          value={volume}
          onChange={() => {}}
          onPointerDown={onVolumePointerDown}
          onClick={onVolumeClick}
          aria-label="Volume"
          style={{ ["--val"]: `${volume * 100}%`, cursor: "pointer" }}
        />

        <Magnetic>
          <button
            className={styles.playBtn}
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <PauseIcon size={22} weight="fill" />
            ) : (
              <PlayIcon size={22} weight="fill" />
            )}
          </button>
        </Magnetic>
      </div>

      <audio ref={audioRef} preload="metadata" src={src} />
    </div>
  );
});

export default function Demos() {
  const { content } = useContent();
  const demos = content?.demos?.length
    ? content.demos.slice(0, 3)
    : [
        {
          title: "Commercial Demo",
          src: "/demo_tape_one.mp3",
        },
        {
          title: "Narration Demo",
          src: "/demo_tape_two.mp3",
        },
        {
          title: "Character Demo",
          src: "/demo_tape_three.mp3",
        },
      ];

  return (
    <motion.div
      className={styles.grid}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      variants={revealParent}
    >
      <div className={styles.grid}>
        {demos.map((d, i) => (
          <motion.article key={i} variants={revealChild()}>
            <DemoPlayer key={i} title={d.title} src={d.src} />
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}
