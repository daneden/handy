import { KeyboardEvent, useEffect, useState } from "react"
import Input from "./Input"

const CONSTANT = 113
const [HANDICAP_MIN, HANDICAP_MAX] = [-5.0, 54.0]
const { round } = Math
const handicapRegex = /(-)?(\d{1,2})(\.?\d)/

interface Tee {
  name: string
  rating: number
  courseRating: number
  par: number
}

const slopeRatings: Array<Tee> = [
  {
    name: "White",
    rating: 124,
    courseRating: 71.8,
    par: 72,
  },
  {
    name: "Yellow",
    rating: 119,
    courseRating: 69.4,
    par: 72,
  },
  {
    name: "Red",
    rating: 118,
    courseRating: 72.4,
    par: 73,
  },
]

const allowances = [100, 95, 90, 85, 75]

export default function HandicapCalculator() {
  const [handicapIndex, setHandicapIndex] = useState("0")
  const [slopeRating, setSlopeRating] = useState(0)
  const [allowance, setAllowance] = useState(0)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const { rating, courseRating, par } = slopeRatings[slopeRating]
    const allowancePercentage = allowances[allowance] / 100
    const handicapNum = Number.isNaN(Number(handicapIndex))
      ? 0
      : Number(handicapIndex)

    setScore(
      round(
        ((handicapNum * rating) / CONSTANT + (courseRating - par)) *
          allowancePercentage
      )
    )
  }, [handicapIndex, slopeRating, allowance])

  function sanitizeAndSetHandicapIndex(newValue: string) {
    let transformedValue = newValue
      // Remove anything that isn’t a number or a period
      .replace(/[^\d.-]/, "")
      // Replace multiple minus signs with just one
      .replace(/-+/, "-")
      // Replace all but leading minus signs
      .replace(/(?!^)-/g, "")
      // Remove leading zeros
      .replace(/^(-)?0?(\d+)/, "$1$2")
      // Ensure only up to one period
      .replace(/(?<!^-?\d{1,2})\./g, "")

    // Constrain number
    const valueAsNumber = parseFloat(transformedValue)
    if (valueAsNumber > HANDICAP_MAX) {
      transformedValue = HANDICAP_MAX.toString()
    } else if (valueAsNumber < HANDICAP_MIN) {
      transformedValue = HANDICAP_MIN.toString()
    }

    setHandicapIndex(transformedValue)
  }

  function handleKeyPress(e: KeyboardEvent) {
    // When holding shift, increment by 1, otherwise by 0.1
    const increment = e.shiftKey ? 10 : 1

    // If the user is holding command/ctrl, use the default behaviour
    if (e.metaKey) {
      return
    }

    // Switch over up/down arrows to increment/decrement
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault()
        // Here we multiply the value by 10, increment, then divide by 10
        // to avoid a rounding error when incrementing by 0.1
        const incrementedValue = (Number(handicapIndex) * 10 + increment) / 10
        if (incrementedValue > HANDICAP_MAX) return
        return sanitizeAndSetHandicapIndex(incrementedValue.toString())

      case "ArrowDown":
        e.preventDefault()
        const decrementedValue = (Number(handicapIndex) * 10 - increment) / 10
        if (decrementedValue < HANDICAP_MIN) return
        return sanitizeAndSetHandicapIndex(decrementedValue.toString())
    }
  }

  return (
    <>
      <Input label="Handicap Index">
        <input
          data-testid="handicap-index"
          type="step"
          step="0.1"
          min={HANDICAP_MIN}
          max={HANDICAP_MAX}
          value={handicapIndex}
          onChange={(e) => sanitizeAndSetHandicapIndex(e.currentTarget.value)}
          onKeyDown={handleKeyPress}
          pattern={handicapRegex.source}
        />
      </Input>

      <Input label="Select which tees you are playing off">
        <select
          data-testid="tee-selector"
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
          data-testid="handicap-allowance"
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
      <p data-testid="final-value" className="large">
        {score}
      </p>
      <hr />
      <footer>
        <small>
          Note that this result is only valid for Abergele tees (18 holes)
        </small>
      </footer>
      <style jsx>{`
        .large {
          font-weight: 600;
          font-size: 4rem;
          line-height: 1;
          font-variation-settings: "wdth" 70;
        }

        .checkbox-label {
          display: flex;
          align-items: baseline;
          gap: 0.25em;
          margin-bottom: 0.75rem;
        }

        small.description {
          display: block;
        }
      `}</style>
    </>
  )
}
