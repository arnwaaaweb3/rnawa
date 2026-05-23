// src/components/LazyMotionWrapper.tsx
'use client';

import { LazyMotion } from "framer-motion";

const loadFeatures = () => import("../lib/domMax").then((res) => res.default);

export default function LazyMotionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict> 
      {children}
    </LazyMotion>
  );
}