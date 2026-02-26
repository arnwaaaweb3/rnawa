// src/components/ui/Button.tsx
'use client';

import * as React from "react";
import styles from './Button.module.css';

// Varian Dasar (Disimplifikasi dari Shadcn)
type ButtonVariant = "default" | "outline" | "ghost" | "icon";
type ButtonSize = "default" | "sm" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Ganti VariantProps dari cva menjadi tipe lokal
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    
    // Gabungkan class default, variant, size, dan class tambahan dari props
    const buttonClasses = `${styles.base} ${styles[variant]} ${styles[size]} ${className || ''}`;

    return (
      <button
        className={buttonClasses}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button };