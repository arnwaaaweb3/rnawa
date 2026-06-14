'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { m, useScroll, useTransform } from 'framer-motion';
import styles from './page.module.css';
import Background from './components/Background';
import Header from './components/Header';

const ServicesPage: React.FC = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // 0 = outline only, 1 = fully filled
  const fillProgress = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <>
      <Background />
      <Header />

      <main ref={containerRef} className={styles.container}>
        <m.h2
          className={styles.sellpoint}
          style={{
            backgroundPositionX: useTransform(fillProgress, [0, 1], ['100%', '0%']),
          }}
        >
          Looking for What You Need?
        </m.h2>
      </main>

      <div className={styles.backButtonWrapper}>
        <button
          className={styles.backButton}
          onClick={() => router.push('/')}
        >
          ← Back
        </button>
      </div>
    </>
  );
};

export default ServicesPage;