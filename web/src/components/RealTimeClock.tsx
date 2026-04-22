'use client';

import { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import styles from '../styles/RealTimeClock.module.css';

const formatDateTime = (date: Date): { time: string; date: string } => {
  const timeFormatter = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return {
    time: timeFormatter.format(date),
    date: dateFormatter.format(date).toUpperCase(),
  };
};

const RealTimeClock: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    // Fungsi update waktu
    const tick = () => {
      setCurrentDate(new Date());
    };

    // Inisialisasi pertama kali di client
    tick();

    // Interval update tiap 1 detik
    const timerId = setInterval(tick, 1000);

    // Cleanup biar gak memory leak
    return () => clearInterval(timerId);
  }, []);

  // Prevent hydration mismatch (Next.js SSR issue)
  if (!currentDate) {
    return (
      <div
        className={styles["realtime-clock"]}
        style={{ opacity: 0 }}
      />
    );
  }

  const { time, date } = formatDateTime(currentDate);

  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={styles["realtime-clock"]}
    >
      <span className={styles["clock-time"]}>{time}</span>
      <span className={styles["clock-date"]}>{date}</span>
    </m.div>
  );
};

export default RealTimeClock;