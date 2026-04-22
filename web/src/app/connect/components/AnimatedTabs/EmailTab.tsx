'use client';
import { m } from "framer-motion";
import Image from "next/image";
import { FaEnvelope } from "react-icons/fa";
import styles from "@/app/connect/styles/AnimatedTabs.module.css";

export default function EmailTab({ isDarkMode, isActive }: { isDarkMode: boolean; isActive: boolean }) {
  const bannerImage = isDarkMode ? "/assets/email-dark.webp" : "/assets/email-light.webp";
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=arnawaugraaa@gmail.com&su=Hello%20Nawa!`;

  return (
    <div className={styles.dummyCard} style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
      <Image 
        src={bannerImage} 
        alt="Email" 
        fill 
        priority={isActive} 
        sizes="(max-width: 768px) 100vw, 50vw" 
        style={{ objectFit: 'cover', borderRadius: '20px' }} 
      />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', backgroundColor: 'rgba(0,0,0,0.1)' }}>
        <m.h3 style={{ margin: 0, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)', fontSize: '1.5rem', fontWeight: 800 }}>
          Let&apos;s Collaborate
        </m.h3>
        <m.a 
          href={gmailLink} 
          target="_blank" 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          style={{ backgroundColor: '#EA4335', color: 'white', padding: '12px 32px', borderRadius: '50px', fontWeight: 'bold', display: 'flex', gap: '10px' }}
        >
          <FaEnvelope size={20} /> Open Gmail
        </m.a>
      </div>
    </div>
  );
}