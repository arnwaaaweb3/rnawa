'use client';
import { m } from "framer-motion";
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";
import styles from "@/app/connect/styles/AnimatedTabs.module.css";

export default function LinkedInTab({ isDarkMode, isActive }: { isDarkMode: boolean; isActive: boolean }) {
  const bannerImage = isDarkMode ? "/assets/linkedin-dark.webp" : "/assets/linkedin-light.webp";
  const linkedinUrl = "https://www.linkedin.com/in/arnawa-ugra-39277a21b/";

  return (
    <div className={styles.dummyCard} style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
      <m.div
        key={bannerImage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        <Image
          src={bannerImage}
          alt="Connect on LinkedIn"
          fill
          priority={isActive}
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: 'cover', borderRadius: '20px' }}
        />
      </m.div>

      <div style={{ position: 'absolute', inset: 0, paddingTop: '10rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '20px' }}>
        <m.a
          href={linkedinUrl}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            backgroundColor: isDarkMode ? '#0077B5' : '#ffffff',
            color: isDarkMode ? 'white' : '#0077B5',
            padding: '12px 24px',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            border: isDarkMode ? '2px solid rgba(255,255,255,0.2)' : '2px solid #0077B5'
          }}
        >
          <FaLinkedin size={20} />
          Connect Now
        </m.a>
      </div>
    </div>
  );
}