import React from 'react';
import '../styles/GlareHover.module.css';

interface GlareHoverProps {
  width?: string;
  height?: string;
  background?: string;
  borderRadius?: string;
  borderColor?: string;
  children?: React.ReactNode;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
  playOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const GlareHover: React.FC<GlareHoverProps> = ({
  width, // Menggunakan width/height dari children (button) jika tidak diset
  height,
  background = 'transparent', // Ubah default ke transparent karena kita pakai image background
  borderRadius = '25px', // Mengambil nilai dari button style
  borderColor = 'transparent', // Ubah default ke transparent (border sudah ada di button)
  children,
  glareColor = '#ffffff',
  glareOpacity = 0.3, // Menggunakan nilai default yang sedikit lebih rendah agar tidak terlalu mencolok
  glareAngle = -30, // Menggunakan nilai default dari instruksi
  glareSize = 300, // Menggunakan nilai default dari instruksi
  transitionDuration = 800, // Menggunakan nilai default dari instruksi
  playOnce = false,
  className = '',
  style = {}
}) => {
  const hex = glareColor.replace('#', '');
  let rgba = glareColor;
  if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  } else if (/^[0-9A-Fa-f]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  }

  const vars: React.CSSProperties & { [k: string]: string } = {
    '--gh-width': width || 'auto', // Auto agar mengikuti lebar child
    '--gh-height': height || 'auto', // Auto agar mengikuti tinggi child
    '--gh-bg': background,
    '--gh-br': borderRadius,
    '--gh-angle': `${glareAngle}deg`,
    '--gh-duration': `${transitionDuration}ms`,
    '--gh-size': `${glareSize}%`,
    '--gh-rgba': rgba,
    '--gh-border': borderColor,
  };

  return (
    <div
      className={`glare-hover ${playOnce ? 'glare-hover--play-once' : ''} ${className}`}
      style={{ ...vars, ...style } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default GlareHover;