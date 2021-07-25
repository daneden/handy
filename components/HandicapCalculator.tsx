import Input from "./Input"
import { KeyboardEvent, useEffect, useRef, useState } from "react"

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
  const [handicapIndex, setHandicapIndex] = useState("0")
  const [slopeRating, setSlopeRating] = useState(0)
  const [allowance, setAllowance] = useState(0)
  const [score, setScore] = useState(0)

  useEffect(() => {
    setScore(
      round(
        round(
          (Number(handicapIndex) * slopeRatings[slopeRating].rating) / CONSTANT
        ) *
          (allowances[allowance] / 100)
      )
    )
  }, [handicapIndex, slopeRating, allowance])

  function sanitizeAndSetHandicapIndex(newValue: string) {
    console.log(newValue)
    let transformedValue = newValue
      // Remove anything that isn’t a number or a period
      .replace(/[^0-9.]/, "")
      // Replace multiple periods with just one
      .replace(/\.+/gm, ".")
      // Remove leading zeros
      .replace(/^0?([0-9]+)/, "$1")

    // Constrain number
    const valueAsNumber = parseFloat(transformedValue)
    if (valueAsNumber > 54) {
      transformedValue = "54"
    } else if (valueAsNumber < 0) {
      transformedValue = "0"
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
        if (incrementedValue > 54) return
        return sanitizeAndSetHandicapIndex(incrementedValue.toString())

      case "ArrowDown":
        e.preventDefault()
        const decrementedValue = (Number(handicapIndex) * 10 - increment) / 10
        if (decrementedValue < 0) return
        return sanitizeAndSetHandicapIndex(decrementedValue.toString())
    }
  }

  return (
    <>
      <Input label="Handicap Index">
        <input
          data-testid="handicap-index"
          type="text"
          value={handicapIndex}
          onChange={(e) => sanitizeAndSetHandicapIndex(e.currentTarget.value)}
          onKeyDown={handleKeyPress}
          inputMode="decimal"
          pattern="[0-9.]*"
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
          font-size: 3rem;
          line-height: 1;
        }
      `}</style>
    </>
  )
}
