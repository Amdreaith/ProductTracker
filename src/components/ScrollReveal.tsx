
import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
}

export const ScrollReveal = ({ 
  children,
  width = "fit-content",
  delay = 0.25
}: ScrollRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const mainControls = useAnimation();
  
  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);
  
  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 75 },
        visible: { opacity: 1, y: 0 }
      }}
      initial="hidden"
      animate={mainControls}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: [0, 0.71, 0.2, 1.01]
      }}
      style={{ width }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
