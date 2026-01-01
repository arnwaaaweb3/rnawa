// src/hooks/useSidebarWidth.ts

import { useState, useEffect } from 'react';
import { debounce } from '../utils/debounce'; // Menggunakan utilitas debounce yang sudah ada
import { 
    DEFAULT_SIDEBAR_WIDTH, 
    MOBILE_BREAKPOINT, 
    MOBILE_SIDEBAR_WIDTH_VW 
} from '../constants'; // Menggunakan konstanta baru

// ✅ Custom Hook untuk menghitung lebar sidebar dengan SSR Safety
export function useSidebarWidth() {
  // Nilai awal harus aman di SSR (menggunakan default desktop)
  const [width, setWidth] = useState(DEFAULT_SIDEBAR_WIDTH); 

  useEffect(() => {
    // ✅ SOLUSI SSR SAFETY: Hanya jalankan logic browser di sisi klien
    if (typeof window === 'undefined') {
        return;
    }

    const calculate = () => {
      const windowWidth = window.innerWidth;
      setWidth(windowWidth <= MOBILE_BREAKPOINT 
        ? windowWidth * MOBILE_SIDEBAR_WIDTH_VW 
        : DEFAULT_SIDEBAR_WIDTH
      );
    };
    
    // Panggil sekali saat mount 
    requestAnimationFrame(calculate);

    // Tambahkan event listener dengan Debounce
    const debouncedCalculate = debounce(calculate, 150); 
    window.addEventListener('resize', debouncedCalculate);

    return () => window.removeEventListener('resize', debouncedCalculate);
  }, []);

  return width;
}