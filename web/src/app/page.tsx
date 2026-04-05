import dynamic from 'next/dynamic';
import styles from './page.module.css';
import NavButton from '../components/NavButton'; // Import komponen baru kita

// Komponen animasi lainnya tetap dynamic (tapi tanpa ssr: false karena ini Server Component)
const VariableProximity = dynamic(() => import('../components/VariableProximity'));
const RotatingText = dynamic(() => import('../components/RotatingText'));
const GlareHover = dynamic(() => import('../components/GlareHover'));

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
  return (
    <div className={styles.mainWrapper}>
      <section className={styles.introArea}>
        <div className={styles.proximityWrapper}>
          <VariableProximity
            label="Hello! My Name is Nawa"
            fromFontVariationSettings="'wght' 400, 'opsz' 9"
            toFontVariationSettings="'wght' 1000, 'opsz' 40"
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
              glareSize={200}
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
    </div>
  );
}