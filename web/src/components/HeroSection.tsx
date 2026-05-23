'use client'

import { useRef } from 'react';
import { VariableProximity, RotatingText, GlareHover } from './DynamicComponents';
import NavButton from './NavButton';
import styles from '../app/page.module.css';

const ROTATING_TEXTS = [
  'Public Relations Officer',
  'Web3 Enthusiast',
  'Graphic Designer',
  'AI/ML Enthusiast',
];

const BUTTON_CONFIGS = [
  { id: 1, url: "/services", normal: "/services.webp", hover: "/services-hover.webp" },
  { id: 2, url: "/connect", normal: "/connect.webp", hover: "/connect-hover.webp" },
  { id: 3, url: "/docs", normal: "/docs.webp", hover: "/docs-hover.webp" },
  { id: 4, url: "/projects", normal: "/projects.webp", hover: "/projects-hover.webp" },
];

export default function HeroSection() {
  const proximityRef = useRef<HTMLDivElement>(null);

  return (
    <section className={styles.introArea}>
      <div className={styles.proximityWrapper} ref={proximityRef}>
        <VariableProximity
          label="Hello! My Name is Nawa"
          fromFontVariationSettings="'wght' 400, 'opsz' 9"
          toFontVariationSettings="'wght' 1000, 'opsz' 40"
          containerRef={proximityRef}
          radius={100}
          falloff="linear"
        />
      </div>

      <div className={styles.rotatingTextWrapper}>
        I&apos;m a&nbsp;
        <RotatingText
          texts={ROTATING_TEXTS}
          rotationInterval={3000}
          staggerDuration={0.05}
          className={styles.rotatingHighlight}
        />
      </div>

      <div className={styles.buttonGrid}>
        {BUTTON_CONFIGS.map((button) => (
          <GlareHover
            key={button.id}
            glareColor="#ff85e5"
            glareOpacity={0.6}
            glareAngle={-30}
            glareSize={100}
            transitionDuration={300}
            width="100%"
            height="100%"
            borderRadius="20px"
          >
            <NavButton
              url={button.url}
              normal={button.normal}
              hover={button.hover}
              className={styles.navButton}
            />
          </GlareHover>
        ))}
      </div>
    </section>
  );
}