import Input from "../components/Input"
import { useEffect, useState } from "react"
import Head from "next/head"
import HandicapCalculator from "../components/HandicapCalculator"
import Image from "next/image"

const PAGE_TITLE = "Playing Handicap Calculator"

export default function HomePage() {
  return (
    <>
      <Head>
        <title>{PAGE_TITLE} | Abergele Golf Club</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <meta name="apple-mobile-web-app-title" content="Handicap Calculator" />
      </Head>
      <header>
        <div className="container">
          <div className="title">
            <h1>Abergele Golf Club</h1>
            <h2>{PAGE_TITLE}</h2>
          </div>
          <div className="logo">
            <Image src="/logo.jpg" width={426} height={426} sizes="80px" />
          </div>
        </div>
      </header>
      <main className="container">
        <HandicapCalculator />
      </main>
      <style jsx>{`
        header {
          color: white;
        }

        header .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          width: 4rem;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
          overflow: hidden;
          border-radius: 30%;
          margin-left: 1rem;
        }
      `}</style>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          position: relative;
        }

        :root {
          --brand-color: #406e8e;
          --highlight-color: royalblue;
          --wash-color: #fefefe;
          --text-color: #111;
          --edge-highlight: rgba(0, 0, 0, 0.1);
          --secondary-wash: rgba(128, 128, 128, 0.1);
          --tertiary-wash: rgba(128, 128, 128, 0.2);
          --quarternary-wash: rgba(128, 128, 128, 0.3);
          --divider-color: rgba(128, 128, 128, 0.05);
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --highlight-color: cornflowerblue;
            --wash-color: #111;
            --text-color: #fefefe;
            --edge-highlight: rgba(255, 255, 255, 0.15);
          }
        }

        html {
          font: 125%/1.5 "Poppins", system-ui, -apply-system, BlinkMacSystemFont,
            sans-serif;
          color: var(--text-color);
          background-color: var(--brand-color);
        }

        @media (max-width: 600px) {
          html {
            font-size: 100%;
          }
        }

        .container {
          max-width: 30rem;
          margin: 0 auto;
          padding: 1.5rem;
        }

        @media (max-width: 30rem) {
          .container {
            margin: 0 0.25rem;
          }
        }

        main {
          background-color: var(--wash-color);
          border-radius: 1rem;
          box-shadow: 0 0 2rem rgba(0, 0, 0, 0.1);
        }

        h1 {
          font-size: 1.5rem;
          line-height: 1.25;
        }

        h2 {
          font-size: 1.25rem;
          line-height: 1.25;
          font-weight: 400;
        }

        hr {
          margin: 1.5rem 0;
          border: none;
          border-top: 1px solid var(--edge-highlight);
        }
      `}</style>
    </>
  )
}
