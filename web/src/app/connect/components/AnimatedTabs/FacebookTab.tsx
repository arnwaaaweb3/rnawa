'use client';
import { motion } from "framer-motion";
import Image from "next/image";
import { FaFacebook } from "react-icons/fa";
import styles from "@/app/connect/styles/AnimatedTabs.module.css";

export default function FacebookTab({ isDarkMode, isActive }: { isDarkMode: boolean; isActive: boolean }) {
  const bannerImage = isDarkMode ? "/assets/facebook-dark.webp" : "/assets/facebook-light.webp";

  return (
    <div className={styles.dummyCard} style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
      <Image 
        src={bannerImage} 
        alt="Facebook" 
        fill 
        priority={isActive} 
        sizes="(max-width: 768px) 100vw, 50vw" 
        style={{ objectFit: 'cover', borderRadius: '20px' }} 
      />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '20px', paddingTop: '150px' }}>
        <motion.a 
          href="https://www.facebook.com/arnawa.ugra.2025" 
          target="_blank" 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          style={{ backgroundColor: '#1877F2', color: 'white', padding: '12px 28px', borderRadius: '50px', fontWeight: 'bold', display: 'flex', gap: '10px' }}
        >
          <FaFacebook size={22} /> Visit Profile
        </motion.a>
      </div>
    </div>
  );
}