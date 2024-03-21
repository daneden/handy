import Image from "next/image"
import HandicapCalculator from "./components/HandicapCalculator"
import styles from "./homepage.module.css"
import icon from "./icon.jpg"
import "./styles.css"

export default function HomePage() {
  return (
    <>
      <header className={styles.header}>
        <div className={`${styles.container} container`}>
          <div className="title">
            <h1>Abergele Golf Club</h1>
            <h2>Playing Handicap Calculator</h2>
          </div>
          <div className={styles.logo}>
            <Image
              alt="Abergele Gold Club Logo"
              src={icon}
              width={80}
              height={80}
              placeholder="blur"
            />
          </div>
        </div>
      </header>
      <main className="container">
        <HandicapCalculator />
      </main>
    </>
  )
}
