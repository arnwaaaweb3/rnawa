'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CSSProperties } from 'react';

interface NavButtonProps {
  url: string;
  normal: string;
  hover: string;
  className?: string;
}

interface NavButtonStyles extends CSSProperties {
  '--bg-image-normal': string;
  '--bg-image-hover': string;
}

export default function NavButton({ url, normal, hover, className }: NavButtonProps) {
  return (
    <Link href={url} style={{ display: 'block', width: '100%', height: '100%' }}>
      <motion.button
        className={className}
        style={{
          '--bg-image-normal': `url(${normal})`,
          '--bg-image-hover': `url(${hover})`,
          width: '100%',
          height: '100%',
          border: 'none',
          backgroundSize: 'cover',
          cursor: 'pointer'
        } as NavButtonStyles}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      />
    </Link>
  );
}