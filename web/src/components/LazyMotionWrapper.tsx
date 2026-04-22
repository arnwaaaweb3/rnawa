// src/components/LazyMotionWrapper.tsx
'use client';

import { LazyMotion } from "framer-motion";

// PAKAI PATH RELATIF
const loadFeatures = () => import("../lib/domMax").then((res) => res.default);

export default function LazyMotionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict> 
      {/* Tambahkan 'strict' biar kita tahu kalau ada error fitur yang kurang */}
      {children}
    </LazyMotion>
  );
}