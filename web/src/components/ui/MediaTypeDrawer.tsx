'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdFolder, MdClose, MdVideoLibrary, MdPictureAsPdf, MdImage, MdCode, MdViewCarousel } from 'react-icons/md'
import styles from './MediaTypeDrawer.module.css'
import { useTheme } from '@/context/ThemeContext'

// =========================
// Types
// =========================

export type MediaType = 'all' | 'video' | 'poster' | 'pdf' | 'github' | 'feeds'

interface MediaTypeDrawerProps {
  activeMediaType: MediaType // Hapus null, ganti jadi MediaType
  onMediaTypeChange: (type: MediaType) => void // Hapus null
}

// =========================
// Media Registry
// =========================

const MEDIA_TYPES: {
  label: string
  value: MediaType
  icon: React.ReactNode
}[] = [
    { label: 'Video', value: 'video', icon: <MdVideoLibrary size={18} /> },
    { label: 'PDF', value: 'pdf', icon: <MdPictureAsPdf size={18} /> },
    { label: 'Poster', value: 'poster', icon: <MdImage size={18} /> },
    { label: 'Repo', value: 'github', icon: <MdCode size={18} /> },
    { label: 'Feeds', value: 'feeds', icon: <MdViewCarousel size={18} /> },
  ]

// =========================
// Component
// =========================

export const MediaTypeDrawer = ({
  activeMediaType,
  onMediaTypeChange,
}: MediaTypeDrawerProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { darkMode, mounted } = useTheme()

  // =========================
  // Styles
  // =========================

  const drawerClass = `${styles.drawerWrapper} ${mounted && darkMode ? styles.darkModeActive : ''
    }`

  // =========================
  // Render
  // =========================

  return (
    <div className={drawerClass}>
      {/* Trigger Button */}
      <motion.button
        className={`${styles.drawerTrigger} ${isDrawerOpen ? styles.triggerActive : ''
          }`}
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        whileHover={{ scale: 1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isDrawerOpen ? <MdClose size={20} /> : <MdFolder size={20} />}
        <span className={styles.drawerLabel}>
          {isDrawerOpen ? 'CLOSE' : 'FORMAT'}
        </span>
      </motion.button>

      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0, x: -20 }}
            animate={{ width: 'auto', opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: -20 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className={styles.horizontalDrawer}
          >
            <div className={styles.drawerContent}>
              {/* Reset Filter */}
              <motion.button
                onClick={() => onMediaTypeChange('all')} // Kirim 'all'
                className={`${styles.categoryTab} ${activeMediaType === 'all' ? styles.activeCategory : ''
                  }`}
              >
                <span className={styles.categoryTabText}>ALL</span>
              </motion.button>

              {/* Media Types */}
              {MEDIA_TYPES.map((media) => (
                <motion.button
                  key={media.value}
                  onClick={() => onMediaTypeChange(media.value)}
                  className={`${styles.categoryTab} ${activeMediaType === media.value ? styles.activeCategory : ''
                    }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={styles.categoryTabText}>
                    {media.icon} {media.label.toUpperCase()}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
