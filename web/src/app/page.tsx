import styles from './page.module.css';
import HeroSection from '../components/HeroSection';

export default function HomePage() {
  return (
    <div className={styles.mainWrapper}>
      <HeroSection />
    </div>
  );
}