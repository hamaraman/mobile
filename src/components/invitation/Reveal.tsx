import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  /** Extra delay in seconds before the element animates in. */
  delay?: number;
  className?: string;
}

/**
 * Fades + lifts its children into view as they enter the viewport.
 * `once` keeps the reveal from replaying on every scroll, and the negative
 * bottom margin triggers slightly before the section is fully visible.
 */
const Reveal: React.FC<Props> = ({ children, delay = 0, className }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '0px 0px -12% 0px' }}
    transition={{ duration: 0.7, ease: 'easeOut', delay }}
  >
    {children}
  </motion.div>
);

export default Reveal;
