import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';
import { scrollRevealVariants } from '../../../utils/motion';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const ScrollReveal = ({
  children,
  className,
  delay = 0,
}: ScrollRevealProps) => {
  const prefersReducedMotion = useReducedMotion();

  const variants = {
    initial: prefersReducedMotion
      ? { opacity: 0 }
      : scrollRevealVariants.initial,
    animate: prefersReducedMotion
      ? {
          opacity: 1,
          transition: { delay },
          transitionEnd: { opacity: '' as unknown as number },
        }
      : {
          ...scrollRevealVariants.animate,
          transition: { ...scrollRevealVariants.animate.transition, delay },
        },
  };

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.1, margin: '-50px' }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};
