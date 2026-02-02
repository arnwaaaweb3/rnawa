'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdCheckCircle, MdRocketLaunch, MdLightbulb, MdApps, MdClose } from 'react-icons/md'
import styles from '@/components/ui/StatusDrawer.module.css';
import { useTheme } from '@/context/ThemeContext'

// Definisikan tipe status sesuai schema Sanity lo
export type ProjectStatus = 'all' | 'completed' | 'ongoing' | 'concept'

interface StatusDrawerProps {
  activeStatus: ProjectStatus
  onStatusChange: (status: ProjectStatus) => void
}

const STATUS_TYPES: {
  label: string
  value: ProjectStatus
  icon: React.ReactNode
}[] = [
  { label: 'Ongoing', value: 'ongoing', icon: <MdRocketLaunch size={18} /> },
  { label: 'Completed', value: 'completed', icon: <MdCheckCircle size={18} /> },
  { label: 'Idea', value: 'concept', icon: <MdLightbulb size={18} /> },
]

export const StatusDrawer = ({ activeStatus, onStatusChange }: StatusDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, mounted } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className={`${styles.drawerWrapper} ${mounted && isDark ? styles.darkModeActive : ''}`}>
      <motion.button
        className={`${styles.drawerTrigger} ${isOpen ? styles.triggerActive : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <MdClose size={20} /> : <MdApps size={20} />}
        <span className={styles.drawerLabel}>{isOpen ? 'CLOSE' : 'STATUS'}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0, x: -20 }}
            animate={{ width: 'auto', opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: -20 }}
            className={styles.horizontalDrawer}
          >
            <div className={styles.drawerContent}>
              {/* Reset ke ALL */}
              <button
                onClick={() => onStatusChange('all')}
                className={`${styles.categoryTab} ${activeStatus === 'all' ? styles.activeCategory : ''}`}
              >
                <span className={styles.categoryTabText}>ALL</span>
              </button>

              {STATUS_TYPES.map((status) => (
                <button
                  key={status.value}
                  onClick={() => onStatusChange(status.value)}
                  className={`${styles.categoryTab} ${activeStatus === status.value ? styles.activeCategory : ''}`}
                >
                  <span className={styles.categoryTabText}>
                    {status.icon} {status.label.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}