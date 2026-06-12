'use client';

import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './loading.module.css';

export default function Loading() {
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {shouldRender && (
          <m.div 
            className={styles.loadingContainer}
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.4, ease: "easeInOut" } 
            }}
          >
            <div className={styles.brandWrapper}>
              
              <m.div 
                className={styles.logoContainer}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ 
                  opacity: [0.6, 1, 0.6],
                  scale: [0.97, 1, 0.97]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <Image 
                  src="/nawa.webp"
                  alt="Nawa Logo" 
                  width={72}
                  height={72}
                  className={styles.logoImage}
                  priority
                />
              </m.div>

              <div className={styles.progressBarTrack}>
                <m.div 
                  className={styles.progressBarFill}
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>

              {/* Subtle Loading Status */}
              <p className={styles.statusText}>Loading</p>

            </div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}