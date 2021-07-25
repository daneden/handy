import Input from "./Input"
import { useEffect, useState } from "react"

const CONSTANT = 113
const { round } = Math

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
    rating: 118,
  },
]

const allowances = [100, 95, 90, 85, 75]

export default function HandicapCalculator() {
  const [handicapIndex, setHandicapIndex] = useState(0)
  const [slopeRating, setSlopeRating] = useState(0)
  const [allowance, setAllowance] = useState(0)
  const [score, setScore] = useState(0)

  useEffect(() => {
    setScore(
      round(
        round((handicapIndex * slopeRatings[slopeRating].rating) / CONSTANT) *
          (allowances[allowance] / 100)
      )
    )
  }, [handicapIndex, slopeRating, allowance])

  return (
    <>
      <Input label="Handicap Index">
        <input
          type="number"
          value={handicapIndex}
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

      <Input label="Handicap allowance">
        <select
          value={allowance}
          onChange={(e) => setAllowance(Number(e.currentTarget.value))}
        >
          {allowances.map((item, index) => (
            <option key={item} value={index}>
              {item}%
            </option>
          ))}
        </select>
      </Input>

      <hr />
      <p>Your playing handicap:</p>
      <p className="large">{score}</p>
      <hr />
      <footer>
        <small>
          Note that this result is only valid for Abergele tees (18 holes)
        </small>
      </footer>
      <style jsx>{`
        .large {
          font-weight: 600;
          font-size: 3rem;
          line-height: 1;
        }
      `}</style>
    </>
  )
}
