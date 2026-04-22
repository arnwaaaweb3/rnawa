'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import styles from '@/styles/NavButton.module.css'; // Pastikan path-nya benar

interface NavButtonProps {
  url: string;
  normal: string;
  hover: string;
  className?: string;
}

export default function NavButton({ url, normal, hover, className }: NavButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      href={url} 
      className={`${styles.navButtonContainer} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gambar Normal */}
      <Image
        src={normal}
        alt="Nav Icon"
        fill
        priority // Penting! Supaya gambar tombol di-load paling awal
        sizes="(max-width: 768px) 100vw, 25vw"
        className={`${styles.navImage} ${isHovered ? styles.hidden : styles.visible}`}
      />
      
      {/* Gambar Hover - Kita pakai AnimatePresence biar smooth tapi ringan */}
      <AnimatePresence>
        {isHovered && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={styles.hoverImageWrapper}
          >
            <Image
              src={hover}
              alt="Nav Icon Hover"
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className={styles.navImage}
            />
          </m.div>
        )}
      </AnimatePresence>
    </Link>
  );
}