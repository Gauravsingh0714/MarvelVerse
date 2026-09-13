export const motionEasings = {
  standard: [0.2, 0, 0, 1] as const,
  in: [0.3, 0, 1, 1] as const,
  out: [0, 0, 0.2, 1] as const,
  cinematic: [0.16, 1, 0.3, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
};

export const motionDurations = {
  instant: 0,
  fast: 0.15,
  normal: 0.25,
  slow: 0.35,
  cinematic: 0.6,
};

export const heroStaggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
    transitionEnd: {
      opacity: '' as unknown as number,
    },
  },
};

export const heroItemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionDurations.cinematic,
      ease: motionEasings.cinematic,
    },
    transitionEnd: {
      opacity: '' as unknown as number,
      y: '' as unknown as number,
    },
  },
};

export const scrollRevealVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionDurations.cinematic,
      ease: motionEasings.cinematic,
    },
    transitionEnd: {
      opacity: '' as unknown as number,
      y: '' as unknown as number,
    },
  },
};
