'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import styles from '../styles/RealTimeClock.module.css';

// Format waktu + tanggal
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
  const clockRef = useRef<HTMLDivElement>(null);

  // ✅ GSAP hanya jalan di client
  useLayoutEffect(() => {
    if (!clockRef.current) return;

    gsap.from(clockRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out',
    });
  }, []);

  // ✅ Set waktu hanya setelah mount (ANTI SSR MISMATCH)
  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  // ✅ Cegah render saat masih null (PENTING)
  if (!currentDate) return null;

  const { time, date } = formatDateTime(currentDate);

  return (
    <div ref={clockRef} className={styles["realtime-clock"]}>
      <span className={styles["clock-time"]}>{time}</span>
      <span className={styles["clock-date"]}>{date}</span>
    </div>
  );
};

export default RealTimeClock;
