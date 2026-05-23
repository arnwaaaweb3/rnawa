'use client'

import dynamic from 'next/dynamic';

export const VariableProximity = dynamic(() => import('../components/VariableProximity'), {
  ssr: false,
  loading: () => <span>Hello! My Name is Nawa</span>,
});

export const RotatingText = dynamic(() => import('../components/RotatingText'), {
  ssr: false,
  loading: () => <span>Public Relations Officer</span>,
});

export const GlareHover = dynamic(() => import('../components/GlareHover'), {
  ssr: false,
});