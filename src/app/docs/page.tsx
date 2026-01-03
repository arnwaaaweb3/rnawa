// src/app/docs/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from '../../components/ui/Carousel';

// Component untuk Kartu Kategori Docs
interface DocsCategoryCardProps {
    title: string;
    imageUrl: string;
    href: string;
    color: string;
}

const DocsCategoryCard: React.FC<DocsCategoryCardProps> = ({ title, imageUrl, href, color }) => {

    // Konversi HEX color ke RGB untuk Glow Border Effect di CSS
    const hexToRgb = (hex: string) => {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `${r}, ${g}, ${b}`;
    };

    const rgbColor = hexToRgb(color);

    return (
        <motion.div
            className={styles.cardWrapper}
            whileHover={{}}
            whileTap={{}}
            // Pass color sebagai CSS variable untuk styling border gradient dinamis
            style={{
                '--card-color': color,
                '--card-color-rgb': rgbColor
            } as React.CSSProperties}
        >
            <Link href={href} className={styles.cardLink} aria-label={`Explore ${title}`}>
                <div className={styles.imageContainer}>
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill={true}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className={styles.cardImage}
                        priority={true}
                    />
                </div>
                {/* Semua Text Content (Title, Description, CTA) dihapus 
                   karena sudah menyatu dengan desain image dari Canva.
                */}
            </Link>
        </motion.div>
    );
};

// Data Kategori (Nanti bisa di-fetch dari Sanity)
const categories = [
    {
        title: "Learn",
        imageUrl: "/assets/docs/learn.webp",
        href: "/docs/learn",
        color: "#1c93c9",
    },
    {
        title: "Views",
        imageUrl: "/assets/docs/views.webp",
        href: "/docs/views",
        color: "#1cc990",
    },
    {
        title: "Journal",
        imageUrl: "/assets/docs/journal.webp",
        href: "/docs/journal",
        color: "#1cc94a",
    },
];

const DocsPage: React.FC = () => {
    const HEADING_TEXT = "Documentation";
    const router = useRouter();

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageContent}>
                <h1 className={styles.heading}>
                    {HEADING_TEXT}
                </h1>
                <p className={styles.description}>
                    Read all my experiences, my views, and what I&apos;m learning on!
                </p>

                <Carousel
                    opts={{
                        align: "start",
                        loop: false,
                        slidesToScroll: 1,
                    }}
                    className={styles.carouselContainer}
                >
                    <CarouselContent className={styles.carouselTrack}>
                        {categories.map((cat) => (
                            <CarouselItem
                                key={cat.title}
                                className={styles.carouselCardItem}
                            >
                                <DocsCategoryCard {...cat} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious className={styles.carouselButtonPrev} />
                    <CarouselNext className={styles.carouselButtonNext} />
                </Carousel>
            </div>

            <div className={styles.backButtonWrapper}>
                <button
                    className={styles.backButton}
                    onClick={() => router.push("/")} // Use router instead of window.history
                >
                    ← Back
                </button>
            </div>
        </div>
    );
};

export default DocsPage;