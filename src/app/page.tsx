'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

// Components
import VariableProximity from '../components/VariableProximity';
import RotatingText from "../components/RotatingText";
import GlareHover from "../components/GlareHover";

// Move constants outside to prevent re-allocation on every render
const ROTATING_TEXTS = [
  'Public Relations Officer',
  'Web3 Enthusiast',
  'Smart Contract Developer',
  'dApp Builder',
  'Long-Term Investor',
  'Life-long Learner',
];

const BUTTON_CONFIGS = [
  { id: 1, url: "/services", normal: "/services.png", hover: "/services-hover.png" },
  { id: 2, url: "/connect", normal: "/connect.png", hover: "/connect-hover.png" },
  { id: 3, url: "/docs", normal: "/docs.png", hover: "/docs-hover.png" },
  { id: 4, url: "/projects", normal: "/projects.png", hover: "/projects-hover.png" },
];

export default function HomePage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.mainWrapper}>
      <section className={styles.introArea}>
        {/* Proximity Header */}
        <div className={styles.proximityWrapper} ref={containerRef}>
          <VariableProximity
            label="Hello! My Name is Nawa"
            fromFontVariationSettings="'wght' 400, 'opsz' 9"
            toFontVariationSettings="'wght' 1000, 'opsz' 40"
            radius={100}
            falloff="linear"
            containerRef={containerRef}
          />
        </div>

        {/* Roles Section */}
        <div className={styles.rotatingTextWrapper}>
          I&apos;m a&nbsp;
          <RotatingText
            texts={ROTATING_TEXTS}
            rotationInterval={3000}
            staggerDuration={0.05}
            className={styles.rotatingHighlight}
          />
        </div>

        {/* Navigation Grid */}
        <div className={styles.buttonGrid}>
          {BUTTON_CONFIGS.map((button) => (
            <GlareHover
              key={button.id}
              glareColor="#ff85e5"
              glareOpacity={0.6}
              glareAngle={-30}
              glareSize={200}
              transitionDuration={300}
              width="100%" 
              height="100%"
              borderRadius="20px"
            >
              <motion.button
                className={styles.navButton}
                onClick={() => router.push(button.url)}
                style={{
                  '--bg-normal': `url(${button.normal})`,
                  '--bg-hover': `url(${button.hover})`,
                } as React.CSSProperties}
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255, 133, 229, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              />
            </GlareHover>
          ))}
        </div>
      </section>
    </div>
  );
}