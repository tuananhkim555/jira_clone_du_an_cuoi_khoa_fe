import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimationSectionProps {
  children: ReactNode;
  delay?: number;
}

const AnimationSection: React.FC<AnimationSectionProps> = ({ children, delay = 0.3 }) => {
  const variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: delay
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default AnimationSection;
