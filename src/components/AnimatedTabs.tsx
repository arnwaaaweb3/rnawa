// src/components/AnimatedTabs.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// --- KOMPONEN INSTAGRAM (API REAL + SLIDER) ---
const InstagramTabContent = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [posts, setPosts] = useState<any[]>([]);
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
                <img
                  src={activePost.media_type === "VIDEO" ? activePost.thumbnail_url : activePost.media_url}
                  alt={activePost.caption || "Instagram Post"}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                        "{truncate(activePost.caption, 80)}" <br/>
                        <span style={{ opacity: 0.6, fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                           Post {currentIndex + 1} of {posts.length}
                        </span>
                        <a href={activePost.permalink} target="_blank" rel="noreferrer" style={{ 
                            color: isDarkMode ? "#2196F3" : "black", // Dinamis: #2196F3 di Dark, Black di Light
                            fontSize: "0.8rem", 
                            textDecoration: "none", 
                            marginTop: "5px", 
                            fontWeight: "bold",
                            display:"inline-block" 
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
  // 🔽 DATA TWEET SUDAH DIPERBAIKI 🔽
  const tweets = [
    {
      id: 1,
      text: "Buy (₿) Bitcoin. The only right way to hold your assets value",
      date: "Nov 22, 2024: 9:31 A.M",
      link: "https://x.com/rnawaaaaa/status/1859786857095233566",
      image: "/assets/bitcoin.jpg" // Format path diperbaiki
    },
    {
      id: 2,
      text: "i’m starting to love @Algorand! i’m building a voting dApp, and still reaching the testnet though, ...",
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
            // OPSI A: Kalau ada image, tampilkan GAMBAR
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
                <img
                  src={activeTweet.image}
                  alt="Tweet media"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </motion.a>
          ) : (
            // OPSI B: Kalau image null, tampilkan LOGO TWITTER
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
                "{activeTweet.text}"
            </p>
           
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{activeTweet.date}</span>
                <a href={activeTweet.link} target="_blank" rel="noreferrer" style={{ 
                    color: isDarkMode ? "#2196F3" : "black", // Dinamis: #2196F3 di Dark, Black di Light
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
  // 🔽 DATA THREADS MANUAL 🔽
  const threads = [
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
      image: "/assets/ai.jpeg" // Contoh pakai gambar
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
                <img
                  src={activeThread.image}
                  alt="Threads media"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                 // Background hitam khas Threads (atau putih di light mode nanti otomatis menyesuaikan container)
                 background: "rgba(255, 255, 255, 0.05)",
               }}
            >
               {/* Icon Threads Gede */}
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
                "{activeThread.text}"
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
        <motion.img
            key={bannerImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={bannerImage}
            alt="Connect on LinkedIn"
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '12px',
                filter: isDarkMode ? 'brightness(1)' : 'brightness(1)'
            }}
        />

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
                    // Warna tombol menyesuaikan juga biar makin estetik
                    // Kalau dark mode: Biru LinkedIn, Kalau light mode: Putih (Text Biru) atau tetep Biru
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
 
  // Logic: Ganti banner sesuai tema
  const bannerImage = isDarkMode
    ? "/assets/discord-dark.png"
    : "/assets/discord-light.png";
   
  const discordUrl = "https://discord.com/users/1320378818464321589"; // 🔴 Ganti link invite servermu

  // Warna Khas Discord (Blurple)
  const discordColor = "#5865F2";

  return (
    <div className={styles.dummyCard} style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
       
        {/* 1. GAMBAR CANVA (Background Dinamis) */}
        <motion.img
            key={bannerImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={bannerImage}
            alt="Join Discord Community"
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: isDarkMode? '12px':'12px',
                filter: isDarkMode ? 'brightness(0.9)' : 'brightness(1)'
            }}
        />

        {/* 2. CTA BUTTON (Overlay) */}
        <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center', // Kita taruh tengah biar beda dikit sama LinkedIn
            flexDirection: 'column',
            gap: '12px',
            borderRadius: '12px',
            backgroundColor: 'rgba(0,0,0,0.2)' // Overlay tipis biar teks kebaca
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
   
  // Ganti ke link profile atau Page kamu
  const facebookUrl = "https://www.facebook.com/arnawa.ugra.2025";
  const fbColor = "#1877F2";

  return (
    <div className={styles.dummyCard} style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
       
        {/* 1. BACKGROUND BANNER */}
        <motion.img
            key={bannerImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={bannerImage}
            alt="Facebook Profile"
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '12px',
                filter: isDarkMode ? 'brightness(0.9)' : 'brightness(1)'
            }}
        />

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
    // Gunakan styles.cardLayout (sesuai CSS baru)
    <div className={styles.cardLayout} style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
       
        {/* 1. BACKGROUND BANNER */}
        <motion.img
            key={bannerImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={bannerImage}
            alt="Contact via Email"
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '12px',
                filter: isDarkMode ? 'brightness(0.9)' : 'brightness(1)'
            }}
        />

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
                Let's Collaborate
            </motion.h3>

            <motion.a
                href={gmailDirectLink} // <--- Linknya diganti ke variabel baru
                target="_blank" // Wajib _blank biar buka tab baru
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
  // 1. State
  const [activeTab, setActiveTab] = useState<string>("instagram");

  // 🔽 AFTER: Inisiasi state dengan nilai default SSR yang konsisten (DARK) 🔽
  const [isDarkMode, setIsDarkMode] = useState(true); 
  const [isClient, setIsClient] = useState(false); // State untuk kontrol klien/SSR
  
  // 🔽 AFTER: useEffect untuk melakukan 'sync' tema dari localStorage SETELAH hydration 🔽
  useEffect(() => {
    setIsClient(true); // Komponen sudah mounted di klien
    
    // Logika penentuan tema yang aman di klien (sama seperti sebelumnya)
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let initialMode: boolean;
    if (storedTheme !== null) {
      initialMode = storedTheme === 'dark';
    } else {
      initialMode = systemPrefersDark;
    }

    if (isDarkMode !== initialMode) {
        setIsDarkMode(initialMode);
    }
  }, []); // Hanya berjalan sekali saat mount

  useEffect(() => {
    if (isClient) { // Pastikan hanya dijalankan setelah mount/sync
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, isClient]);

  // 2. Definisi TABS dipindah ke DALAM sini
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
      content: <EmailTabContent isDarkMode={isDarkMode} /> },
  ];

  return (
    <div className={styles.container}>
      {/* Tab Buttons */}
      <div 
      className={styles.tabList} 
      // isDarkMode akan TRUE di SSR (karena logic kita) dan akan update di client side
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

      {/* Content Container */}
      <div className={styles.contentContainer} data-theme={isDarkMode ? "dark" : "light"}>
        {/* Toggle Button */}
        <button
          className={styles.themeToggleBtn}
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <FaSun size={14} /> : <FaMoon size={14} />}
        </button>

        {/* Render Content */}
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