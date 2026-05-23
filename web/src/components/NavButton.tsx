'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/NavButton.module.css';

interface NavButtonProps {
  url: string;
  normal: string;
  hover: string;
  className?: string;
}

export default function NavButton({ url, normal, hover, className }: NavButtonProps) {
  return (
    <Link href={url} className={`${styles.navButtonContainer} ${className}`}>
      <Image
        src={normal}
        alt="Nav Icon"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 25vw"
        className={styles.navImage}
      />
      <div className={styles.hoverImageWrapper}>
        <Image
          src={hover}
          alt="Nav Icon Hover"
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className={styles.navImage}
        />
      </div>
    </Link>
  );
}