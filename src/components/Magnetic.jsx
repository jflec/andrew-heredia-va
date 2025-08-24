import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { springSm } from "../helpers/motion";

export default function Magnetic({
  strength = 24,
  children,
  as = "div",
  className,
  ...rest
}) {
  const Ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, springSm);
  const sy = useSpring(y, springSm);
  const Component = motion[as] || motion.div;

  const onMove = (e) => {
    const rect = Ref.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set((dx / rect.width) * strength);
    y.set((dy / rect.height) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Component
      ref={Ref}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={className}
      {...rest}
    >
      {children}
    </Component>
  );
}
