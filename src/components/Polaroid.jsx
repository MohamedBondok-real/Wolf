import { useMemo } from 'react';
import { motion } from 'framer-motion';
import SafeImage from './SafeImage';

/**
 * Reusable polaroid: cream frame, slight deterministic rotation,
 * straightens + lifts on hover, caption appears beneath the photo.
 */
export default function Polaroid({
  src,
  caption,
  alt = '',
  seed = 0,
  className = '',
  imgClassName = 'aspect-[4/5]',
  maxW = 'max-w-[260px]',
}) {
  const rotation = useMemo(() => (((seed * 137) % 9) - 4) * 0.9, [seed]); // -3.6 .. +3.6 deg
  const yOffset = useMemo(() => ((seed * 53) % 14) - 7, [seed]);

  return (
    <motion.figure
      initial={{ rotate: rotation, y: yOffset }}
      whileHover={{ rotate: 0, y: yOffset - 8, scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      className={`polaroid ${maxW} ${className}`}
    >
      <SafeImage
        src={src}
        alt={alt || caption || 'polaroid photo'}
        rounded={false}
        className={`w-full object-cover ${imgClassName}`}
      />
      {caption && <figcaption>{caption}</figcaption>}
    </motion.figure>
  );
}
