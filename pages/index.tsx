import Input from "../components/Input"
import { useEffect, useState } from "react"
import Head from "next/head"

const CONSTANT = 113

const slopeRatings = [
  {
    name: "White",
    rating: 124,
  },
  {
    name: "Yellow",
    rating: 119,
  },
  {
    name: "Red",
    rating: 119,
  },
]

export default function HomePage() {
  const [handicapIndex, setHandicapIndex] = useState(0)
  const [slopeRating, setSlopeRating] = useState(0)
  const [score, setScore] = useState(0)

  useEffect(() => {
    setScore(
      Math.round((handicapIndex * slopeRatings[slopeRating].rating) / CONSTANT)
    )
  }, [handicapIndex, slopeRating])

  return (
    <>
      <Head>
        <title>Handicap Score Calculator | Abergele Golf Club</title>
      </Head>
      <main>
        <h1>Abergele Golf Club</h1>
        <h2>Handicap Score Calculator</h2>
        <Input label="Handicap Index">
          <input
            type="number"
            value={Number(handicapIndex)}
            onChange={(e) =>
              setHandicapIndex(Math.min(Number(e.currentTarget.value), 54))
            }
            min={0}
            max={54}
            step={0.1}
            inputMode="decimal"
          />
        </Input>

        <Input label="Select which tees you are playing off">
          <select
            value={slopeRating}
            onChange={(e) => setSlopeRating(Number(e.currentTarget.value))}
          >
            {slopeRatings.map((item, index) => (
              <option key={item.name} value={index}>
                {item.name} ({item.rating})
              </option>
            ))}
          </select>
        </Input>

        <hr />
        <p>Your playing handicap:</p>
        <p className="large">{score}</p>
      </main>
      <style jsx>{`
        .large {
          font-weight: 600;
          font-size: 3rem;
          line-height: 1;
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
          font: 125%/1.5 system-ui, -apply-system, BlinkMacSystemFont,
            sans-serif;
          color: var(--text-color);
          background-color: var(--wash-color);
        }

        @media (max-width: 600px) {
          html {
            font-size: 100%;
          }
        }

        main {
          max-width: 30rem;
          margin: 0 auto;
          padding: 1.5rem;
        }

        h1 {
          font-size: 1.5rem;
          line-height: 1.25;
        }

        h2 {
          font-size: 1.25rem;
          line-height: 1.25;
          font-weight: 400;
          margin-bottom: 1.5rem;
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
