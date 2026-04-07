'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
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
    <Link 
      href={url} 
      style={{ display: 'block', width: '100%', height: '100%', position: 'relative' }}
    >
      {/* Hidden Images untuk Trigger Priority & Preloading */}
      {/* display: none memastikan ini tidak mengganggu layout, tapi browser tetap download */}
      <div style={{ display: 'none' }}>
        <Image src={normal} alt="preload-normal" width={10} height={10} priority />
        <Image src={hover} alt="preload-hover" width={10} height={10} priority />
      </div>

      <motion.button
        className={className}
        style={{
          '--bg-image-normal': `url(${normal})`,
          '--bg-image-hover': `url(${hover})`,
          width: '100%',
          height: '100%',
          border: 'none',
          backgroundSize: 'cover',
          cursor: 'pointer',
          transition: 'background-image 0.2s ease-in-out'
        } as NavButtonStyles}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      />
    </Link>
  );
}