'use client';
import { motion } from "framer-motion";
import Image from "next/image";
import { FaDiscord } from "react-icons/fa";
import styles from "@/app/connect/styles/AnimatedTabs.module.css";

export default function DiscordTab({ isDarkMode, isActive }: { isDarkMode: boolean; isActive: boolean }) {
  const bannerImage = isDarkMode ? "/assets/discord-dark.webp" : "/assets/discord-light.webp";

  return (
    <div className={styles.dummyCard} style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
      <Image 
        src={bannerImage} 
        alt="Discord" 
        fill 
        priority={isActive} 
        sizes="(max-width: 768px) 100vw, 50vw" 
        style={{ objectFit: 'cover', borderRadius: '20px', filter: isDarkMode ? 'brightness(0.9)' : 'brightness(1)' }} 
      />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
        <motion.h3 style={{ margin: 0, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)', fontSize: '1.3rem', fontWeight: 800 }}>
          Connect with Me on Discord!
        </motion.h3>
        <motion.a 
          href="https://discord.com/users/1320378818464321589" 
          target="_blank" 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          style={{ backgroundColor: '#5865F2', color: 'white', padding: '12px 28px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', gap: '10px' }}
        >
          <FaDiscord size={22} /> Accept Invite
        </motion.a>
      </div>
    </div>
  );
}