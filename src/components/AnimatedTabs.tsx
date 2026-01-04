// src/components/AnimatedTabs.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import styles from "../styles/AnimatedTabs.module.css";
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaDiscord,
  FaFacebook,
  FaEnvelope,
  FaImage,
  FaChevronLeft,
  FaChevronRight,
  FaSun,
  FaMoon
} from "react-icons/fa";
import { SiThreads } from "react-icons/si";

// Type definitions
interface InstagramPost {
  id: string;
  caption: string;
  media_type: string;
  media_url: string;
  thumbnail_url: string;
  permalink: string;
}

interface Tweet {
  id: number;
  text: string;
  date: string;
  link: string;
  image?: string;
}

interface Thread {
  id: number;
  text: string;
  date: string;
  link: string;
  image?: string;
}

// --- KOMPONEN INSTAGRAM (API REAL + SLIDER) ---
const InstagramTabContent = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const token = process.env.NEXT_PUBLIC_IG_TOKEN;

  const truncate = (str: string, n: number) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  useEffect(() => {
    if (!token) return;

    const fetchInstagramPosts = async () => {
      try {
        const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}&limit=5`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.data) {
          setPosts(data.data);
        }
      } catch (error) {
        console.error("Gagal ambil data IG:", error);
      }
    };

    fetchInstagramPosts();
  }, [token]);

  const handleNext = () => setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  const activePost = posts[currentIndex];

  return (
    <div className={styles.dummyCard}>
      {/* KIRI: Preview Box */}
      <div className={styles.previewBox} style={{ overflow: "hidden", padding: 0, border: activePost ? "none" : "2px dashed rgba(255,255,255,0.1)", position: 'relative' }}>
        {activePost ? (
          <>
            <div className={styles.navOverlay}>
              <button onClick={handlePrev} className={styles.navButton}><FaChevronLeft size={12} /></button>
              <button onClick={handleNext} className={styles.navButton}><FaChevronRight size={12} /></button>
            </div>
            <AnimatePresence mode="wait">
              <motion.a
                key={activePost.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                href={activePost.permalink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: "100%", height: "100%", display: "block" }}
              >
                <Image
                  src={activePost.media_type === "VIDEO" ? activePost.thumbnail_url : activePost.media_url}
                  alt={activePost.caption || "Instagram Post"}
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </motion.a>
            </AnimatePresence>
          </>
        ) : (
          <div style={{ textAlign: "center", opacity: 0.5 }}>
            <FaImage size={40} style={{ marginBottom: 10 }} />
            <p style={{ fontSize: "0.8rem", margin: 0 }}>Loading / No Data</p>
          </div>
        )}
      </div>

      {/* KANAN: Text Info */}
      <div className={styles.textGroup}>
        <div className={styles.iconLarge}><FaInstagram /></div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activePost ? activePost.id : "empty"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
          >
            <h2 className={styles.dummyTitle}>{activePost ? "Latest Updates" : "Instagram"}</h2>
            <p className={styles.dummyDesc}>
              {activePost ? (
                <span>
                  &ldquo;{truncate(activePost.caption, 80)}&rdquo; <br />
                  <span style={{ opacity: 0.6, fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                    Post {currentIndex + 1} of {posts.length}
                  </span>
                  <a href={activePost.permalink} target="_blank" rel="noreferrer" style={{
                    color: isDarkMode ? "#2196F3" : "black",
                    fontSize: "0.8rem",
                    textDecoration: "none",
                    marginTop: "5px",
                    fontWeight: "bold",
                    display: "inline-block"
                  }}>
                    View Post &rarr;
                  </a>
                </span>
              ) : "Check out my posts on Instagram!"}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- KOMPONEN TWITTER (MANUAL DATA + SLIDER + IMAGE FIX) ---
const TwitterTabContent = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const tweets: Tweet[] = [
    {
      id: 1,
      text: "Buy (₿) Bitcoin. The only right way to hold your assets value",
      date: "Nov 22, 2024: 9:31 A.M",
      link: "https://x.com/rnawaaaaa/status/1859786857095233566",
      image: "/assets/bitcoin.jpg"
    },
    {
      id: 2,
      text: "i'm starting to love @Algorand! i'm building a voting dApp, and still reaching the testnet though, ...",
      date: "Sep 30, 2025: 3:01 A.M",
      link: "https://x.com/rnawaaaaa/status/1972753505166532652?s=20",
      image: "/assets/algorand.png"
    },
    {
      id: 3,
      text: "Post Hackathon! Hari ini aku udah berhasil selesaiin proyek MVP buat Veritas! ...",
      date: "Nov 1, 2025: 6:58 P.M",
      link: "https://x.com/rnawaaaaa/status/1984590992738304398?s=20",
      image: "/assets/devpost.png"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => setCurrentIndex((prev) => (prev === tweets.length - 1 ? 0 : prev + 1));
  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? tweets.length - 1 : prev - 1));

  const activeTweet = tweets[currentIndex];

  return (
    <div className={styles.dummyCard}>
      {/* KIRI: Preview Box (Logic Gambar vs Icon) */}
      <div className={styles.previewBox} style={{ position: 'relative', border: activeTweet.image ? "none" : "2px dashed rgba(255,255,255,0.1)", overflow: 'hidden' }}>

        <div className={styles.navOverlay}>
          <button onClick={handlePrev} className={styles.navButton}><FaChevronLeft size={12} /></button>
          <button onClick={handleNext} className={styles.navButton}><FaChevronRight size={12} /></button>
        </div>
        <AnimatePresence mode="wait">
          {activeTweet.image ? (
            <motion.a
              key={`img-${activeTweet.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              href={activeTweet.link}
              target="_blank"
              rel="noreferrer"
              style={{ width: "100%", height: "100%", display: "block" }}
            >
              <Image
                src={activeTweet.image}
                alt="Tweet media"
                fill
                style={{ objectFit: "cover" }}
                unoptimized
              />
            </motion.a>
          ) : (
            <motion.div
              key={`icon-${activeTweet.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(29, 161, 242, 0.05)",
              }}
            >
              <FaTwitter size={80} color="#1DA1F2" style={{ opacity: 0.8 }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* KANAN: Isi Tweet */}
      <div className={styles.textGroup}>
        <div className={styles.iconLarge} style={{ color: "#1DA1F2" }}><FaTwitter /></div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTweet.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
          >
            <h2 className={styles.dummyTitle} style={{ color: "#1DA1F2" }}>On The Timeline</h2>

            <p className={styles.dummyDesc} style={{ fontStyle: "italic", fontSize: "0.95rem" }}>
              &ldquo;{activeTweet.text}&rdquo;
            </p>

            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
              <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{activeTweet.date}</span>
              <a href={activeTweet.link} target="_blank" rel="noreferrer" style={{
                color: isDarkMode ? "#2196F3" : "black",
                fontSize: "0.8rem",
                textDecoration: "none",
                fontWeight: "bold",
                marginTop: '5px'
              }}>
                Reply on X &rarr;
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- KOMPONEN THREADS (MANUAL DATA + SLIDER) ---
const ThreadsTabContent = () => {
  const threads: Thread[] = [
    {
      id: 1,
      text: "i learned something about smart contract. specifically Solidity - Ethereum!",
      date: "Nov 25, 2025: 4:13 P.M",
      link: "https://www.threads.com/@arnawa.sui/post/DReVWBGkjRk?xmt=AQF0mQjwBUg3X4165tAlegMCJh3dI4pCap-J-peoDIFYhg",
      image: "/assets/ethereum.png"
    },
    {
      id: 2,
      text: "i think it would be a good idea to bring a visual representation of LLM as a companion AI, ...",
      date: "Nov 25, 2025: 4:26 P.M",
      link: "https://www.threads.com/@arnawa.sui/post/DReW7RWkviZ?xmt=AQF0OI_4fSq9cyFTfQN7TD-aYuaXmgD_jjsCALHZ8tFqUw",
      image: "/assets/ai.jpeg"
    },
    {
      id: 3,
      text: "The Future is Never Been Crafted by Perfect Hands. It's Always Crafted by Failure Hands",
      date: "Nov 25, 2025: 5:18 P.M",
      link: "https://www.threads.com/@arnawa.sui/post/DRecxBrkpqP?xmt=AQF0GPvzc6MyxkWmHyBituDSBcmhNxVAEpSXhH1SsVsOwg",
      image: "/assets/future.jpeg"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => setCurrentIndex((prev) => (prev === threads.length - 1 ? 0 : prev + 1));
  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? threads.length - 1 : prev - 1));

  const activeThread = threads[currentIndex];

  return (
    <div className={styles.dummyCard}>
      {/* KIRI: Preview Box */}
      <div className={styles.previewBox} style={{ position: 'relative', border: activeThread.image ? "none" : "2px dashed rgba(255,255,255,0.1)", overflow: 'hidden' }}>

        <div className={styles.navOverlay}>
          <button onClick={handlePrev} className={styles.navButton}><FaChevronLeft size={12} /></button>
          <button onClick={handleNext} className={styles.navButton}><FaChevronRight size={12} /></button>
        </div>

        <AnimatePresence mode="wait">
          {activeThread.image ? (
            <motion.a
              key={`img-${activeThread.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              href={activeThread.link}
              target="_blank"
              rel="noreferrer"
              style={{ width: "100%", height: "100%", display: "block" }}
            >
              <Image
                src={activeThread.image}
                alt="Threads media"
                fill
                style={{ objectFit: "cover" }}
                unoptimized
              />
            </motion.a>
          ) : (
            <motion.div
              key={`icon-${activeThread.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255, 255, 255, 0.05)",
              }}
            >
              <SiThreads size={70} style={{ opacity: 0.8 }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* KANAN: Isi Thread */}
      <div className={styles.textGroup}>
        <div className={styles.iconLarge}><SiThreads /></div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeThread.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
          >
            <h2 className={styles.dummyTitle}>Threads</h2>

            <p className={styles.dummyDesc} style={{ fontStyle: "normal", fontSize: "0.95rem" }}>
              &ldquo;{activeThread.text}&rdquo;
            </p>

            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
              <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{activeThread.date}</span>
              <a href={activeThread.link} target="_blank" rel="noreferrer" style={{ fontSize: "0.8rem", textDecoration: "none", fontWeight: "bold", marginTop: '5px', color: 'inherit' }}>
                View on Threads &rarr;
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- KOMPONEN LINKEDIN (DYNAMIC BANNER: LIGHT/DARK) ---
const LinkedInTabContent = ({ isDarkMode }: { isDarkMode: boolean }) => {

  const bannerImage = isDarkMode
    ? "/assets/linkedin-dark.png"
    : "/assets/linkedin-light.png";

  const linkedinUrl = "https://www.linkedin.com/in/arnawa-ugra-39277a21b/";

  return (
    <div className={styles.dummyCard} style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>

      {/* 1. GAMBAR CANVA (Background Dinamis) */}
      <motion.div
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
          style={{
            objectFit: 'contain',
            borderRadius: '20px',
            filter: isDarkMode ? 'brightness(1)' : 'brightness(1)'
          }}
          unoptimized
        />
      </motion.div>

      {/* 2. CTA BUTTON (Overlay) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        paddingTop: '10rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: '20px'
      }}>

        <motion.a
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
        </motion.a>
      </div>
    </div>
  );
};

// --- KOMPONEN DISCORD (DYNAMIC BANNER: LIGHT/DARK) ---
const DiscordTabContent = ({ isDarkMode }: { isDarkMode: boolean }) => {

  const bannerImage = isDarkMode
    ? "/assets/discord-dark.png"
    : "/assets/discord-light.png";

  const discordUrl = "https://discord.com/users/1320378818464321589";
  const discordColor = "#5865F2";

  return (
    <div className={styles.dummyCard} style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>

      {/* 1. GAMBAR CANVA (Background Dinamis) */}
      <motion.div
        key={bannerImage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        <Image
          src={bannerImage}
          alt="Join Discord Community"
          fill
          style={{
            objectFit: 'contain',
            borderRadius: isDarkMode ? '20px' : '20px',
            filter: isDarkMode ? 'brightness(0.9)' : 'brightness(1)'
          }}
          unoptimized
        />
      </motion.div>

      {/* 2. CTA BUTTON (Overlay) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '12px',
        borderRadius: '12px',
        backgroundColor: 'rgba(0,0,0,0.2)'
      }}>

        <motion.h3
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            margin: 0,
            color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            fontSize: '1.3rem',
            fontWeight: 800
          }}
        >
          Connect with Me on Discord!
        </motion.h3>

        <motion.a
          href={discordUrl}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            backgroundColor: discordColor,
            color: 'white',
            padding: '12px 28px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 15px rgba(88, 101, 242, 0.4)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <FaDiscord size={22} />
          Accept Invite
        </motion.a>
      </div>
    </div>
  );
};

// --- KOMPONEN FACEBOOK (DYNAMIC BANNER) ---
const FacebookTabContent = ({ isDarkMode }: { isDarkMode: boolean }) => {

  const bannerImage = isDarkMode
    ? "/assets/facebook-dark.png"
    : "/assets/facebook-light.png";

  const facebookUrl = "https://www.facebook.com/arnawa.ugra.2025";
  const fbColor = "#1877F2";

  return (
    <div className={styles.dummyCard} style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>

      {/* 1. BACKGROUND BANNER */}
      <motion.div
        key={bannerImage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        <Image
          src={bannerImage}
          alt="Facebook Profile"
          fill
          style={{
            objectFit: 'contain',
            borderRadius: '20px',
            filter: isDarkMode ? 'brightness(0.9)' : 'brightness(1)'
          }}
          unoptimized
        />
      </motion.div>

      {/* 2. OVERLAY CTA */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: '20px',
        paddingTop: '150px'
      }}>

        <motion.a
          href={facebookUrl}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            backgroundColor: fbColor,
            color: 'white',
            padding: '12px 28px',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 15px rgba(24, 119, 242, 0.4)',
            border: '2px solid rgba(255,255,255,0.2)'
          }}
        >
          <FaFacebook size={22} />
          Visit Profile
        </motion.a>
      </div>
    </div>
  );
};

// --- KOMPONEN EMAIL (GMAIL DIRECT LINK) ---
const EmailTabContent = ({ isDarkMode }: { isDarkMode: boolean }) => {

  const bannerImage = isDarkMode
    ? "/assets/email-dark.png"
    : "/assets/email-light.png";

  const emailAddress = "arnawaugraaa@gmail.com";
  const gmailDirectLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}&su=Hello%20Nawa!&body=Hi%20Nawa,%20I%20saw%20your%20portfolio...`;

  const emailColor = "#EA4335";

  return (
    <div className={styles.dummyCard} style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>

      {/* 1. BACKGROUND BANNER */}
      <motion.div
        key={bannerImage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        <Image
          src={bannerImage}
          alt="Contact via Email"
          fill
          style={{
            objectFit: 'contain',
            borderRadius: '20px',
            filter: isDarkMode ? 'brightness(0.9)' : 'brightness(1)'
          }}
          unoptimized
        />
      </motion.div>

      {/* 2. OVERLAY CTA */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '12px',
        backgroundColor: 'rgba(0,0,0,0.1)'
      }}>

        <motion.h3
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            margin: 0,
            color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            fontSize: '1.5rem',
            fontWeight: 800
          }}
        >
          Let&apos;s Collaborate
        </motion.h3>

        <motion.a
          href={gmailDirectLink}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            backgroundColor: emailColor,
            color: 'white',
            padding: '12px 32px',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 15px rgba(234, 67, 53, 0.4)',
            border: '2px solid rgba(255,255,255,0.2)'
          }}
        >
          <FaEnvelope size={20} />
          Open Gmail
        </motion.a>
      </div>
    </div>
  );
};
const AnimatedTabs: React.FC = () => {
  // 1. Initialize theme from localStorage ON MOUNT (no effect needed)
  const [activeTab, setActiveTab] = useState<string>("instagram");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // This runs during render - safe for SSR/client
    if (typeof window === 'undefined') return true; // Default for SSR
    
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    return storedTheme !== null ? storedTheme === 'dark' : systemPrefersDark;
  });

  // 2. ONLY sync changes to localStorage (external system)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode]);
  
  // 3. Persist theme changes to localStorage (only after client mount)
  useEffect(() => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }
}, [isDarkMode]); 

  // 4. Tab configuration with all components
  const tabs = [
    {
      id: "instagram",
      label: "Instagram",
      icon: <FaInstagram />,
      content: <InstagramTabContent isDarkMode={isDarkMode} />
    },
    {
      id: "twitter",
      label: "Twitter (X)",
      icon: <FaTwitter />,
      content: <TwitterTabContent isDarkMode={isDarkMode} />
    },
    {
      id: "threads",
      label: "Threads",
      icon: <SiThreads />,
      content: <ThreadsTabContent />
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: <FaLinkedin />,
      content: <LinkedInTabContent isDarkMode={isDarkMode} />
    },
    {
      id: "discord",
      label: "Discord",
      icon: <FaDiscord />,
      content: <DiscordTabContent isDarkMode={isDarkMode} />
    },
    {
      id: "facebook",
      label: "Facebook",
      icon: <FaFacebook />,
      content: <FacebookTabContent isDarkMode={isDarkMode} />
    },
    {
      id: "email",
      label: "Email",
      icon: <FaEnvelope />,
      content: <EmailTabContent isDarkMode={isDarkMode} />
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