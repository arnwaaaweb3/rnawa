// src/components/AnimatedTabs.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InstagramTab from './InstagramTab';
import TwitterTab from './TwitterTab';
import ThreadsTab from './ThreadsTab';
import LinkedInTab from './LinkedInTab';
import DiscordTab from './DiscordTab';
import FacebookTab from './FacebookTab';
import EmailTab from './EmailTab';
import styles from "@/app/connect/styles/AnimatedTabs.module.css";
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaDiscord,
  FaFacebook,
  FaEnvelope,
  FaSun,
  FaMoon
} from "react-icons/fa";
import { SiThreads } from "react-icons/si";


const AnimatedTabs: React.FC = () => {
  // 1. Initialize theme from localStorage ON MOUNT (no effect needed)
  const [activeTab, setActiveTab] = useState<string>("instagram");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  // Gunakan useEffect ini KHUSUS untuk sinkronisasi mounted & initial theme
  useEffect(() => {
    const initTheme = () => {
      const storedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (storedTheme) {
        setIsDarkMode(storedTheme === 'dark');
      } else {
        setIsDarkMode(systemPrefersDark);
      }

      // Gunakan requestAnimationFrame agar state update tidak dianggap 
      // sinkron langsung dengan body effect oleh ESLint
      requestAnimationFrame(() => {
        setMounted(true);
      });
    };

    initTheme();
  }, []);

  // Effect kedua khusus untuk sinkronisasi ke DOM & LocalStorage
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode, mounted]);

  // Di bagian return, kita kasih proteksi
  if (!mounted) return null; // Mencegah kedipan layout saat loading awal

  // 4. Tab configuration with all components
  const tabs = [
    { id: "instagram", 
      label: "Instagram", 
      icon: <FaInstagram />, 
      content: <InstagramTab isDarkMode={isDarkMode} isActive={activeTab === "instagram"} /> 
    },
    { id: "twitter", 
      label: "Twitter (X)", 
      icon: <FaTwitter />, 
      content: <TwitterTab isDarkMode={isDarkMode} isActive={activeTab === "twitter"} /> 
    },
    { id: "threads", 
      label: "Threads", 
      icon: <SiThreads />, 
      content: <ThreadsTab isActive={activeTab === "threads"} /> 
    },
    { id: "linkedin", 
      label: "LinkedIn", 
      icon: <FaLinkedin />, 
      content: <LinkedInTab isDarkMode={isDarkMode} isActive={activeTab === "linkedin"} /> 
    },
    { id: "discord", 
      label: "Discord", 
      icon: <FaDiscord />, 
      content: <DiscordTab isDarkMode={isDarkMode} isActive={activeTab === "discord"} /> 
    },
    { id: "facebook", 
      label: "Facebook", 
      icon: <FaFacebook />, 
      content: <FacebookTab isDarkMode={isDarkMode} isActive={activeTab === "facebook"} /> 
    },
    { id: "email", 
      label: "Email",
      icon: <FaEnvelope />, 
      content: <EmailTab isDarkMode={isDarkMode} isActive={activeTab === "email"} /> 
    },
  ];

  return (
    <div className={styles.container}>
      {/* Tab Navigation Buttons */}
      <div
        className={styles.tabList}
        data-theme={isDarkMode ? "dark" : "light"}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={styles.tabButton}
            data-active={activeTab === tab.id}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tab-pill"
                className={styles.activeBackground}
                transition={{ type: "spring", duration: 0.6 }}
              />
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative', zIndex: 2 }}>
              {tab.icon} {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Main Content Container */}
      <div className={styles.contentContainer} data-theme={isDarkMode ? "dark" : "light"}>
        {/* Theme Toggle Button */}
        <button
          className={styles.themeToggleBtn}
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <FaSun size={14} /> : <FaMoon size={14} />}
        </button>

        {/* Animated Tab Content */}
        <AnimatePresence mode="wait">
          {tabs.map((tab) => (
            activeTab === tab.id ? (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
                className={styles.contentWrapper}
              >
                {tab.content}
              </motion.div>
            ) : null
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnimatedTabs;