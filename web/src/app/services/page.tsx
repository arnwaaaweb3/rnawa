import styles from './page.module.css'
import Background from './components/Background'
import Header from './components/Header'

export default function Home() {
  return (
    <>
      <Background />
      <Header />
      <main className={styles.container}>
        <h2 className={styles.sellpoint}>Looking for What You Need?</h2>
      </main>
    </>
  )
}
