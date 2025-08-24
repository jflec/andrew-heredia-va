export const springSm = {
  type: "spring",
  stiffness: 400,
  damping: 28,
  mass: 0.4,
};
export const springMd = {
  type: "spring",
  stiffness: 280,
  damping: 24,
  mass: 0.7,
};

export const revealParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export const revealChild = (y = 14, d = 0.45) => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: d, ease: "easeOut" } },
});
