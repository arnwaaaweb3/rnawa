import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.header__title}>Services</h1>
      <div className={styles.header__divider} />
    </header>
  )
}
