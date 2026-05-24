import styles from './Background.module.css'

export default function Background() {
  return (
    <div className={styles.wrapper} aria-hidden="true">
      <div className={styles.primary} />
      <div className={styles.secondary} />
      <div className={styles.accent} />
    </div>
  )
}