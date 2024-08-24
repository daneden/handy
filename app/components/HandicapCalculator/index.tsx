"use client"

import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react"
import Input from "../Input"
import styles from "./styles.module.css"

const CONSTANT = 113
const [HANDICAP_MIN, HANDICAP_MAX] = [-5.0, 54.0]
const { round } = Math
const handicapRegex = /(-)?(\d{1,2})(\.?\d)/
const SIGNIFICANT_DIGITS = 14

interface Tee {
  name: string
  rating: number
  courseRating: number
  par: number
  courseLength: number
}

const mensSlopeRatings: Array<Tee> = [
  {
    name: "White 18h",
    rating: 124,
    courseRating: 71.8,
    par: 72,
    courseLength: 1,
  },
  {
    name: "White Front 9",
    rating: 122,
    courseRating: 35.4,
    par: 36,
    courseLength: 0.5,
  },
  {
    name: "White Back 9",
    rating: 125,
    courseRating: 36.4,
    par: 36,
    courseLength: 0.5,
  },
  {
    name: "Yellow 18h",
    rating: 119,
    courseRating: 69.4,
    par: 72,
    courseLength: 1,
  },
  {
    name: "Yellow Front 9",
    rating: 114,
    courseRating: 34,
    par: 36,
    courseLength: 0.5,
  },
  {
    name: "Yellow Back 9",
    rating: 123,
    courseRating: 35.4,
    par: 36,
    courseLength: 0.5,
  },
  {
    name: "Red 18h",
    rating: 113,
    courseRating: 67.3,
    par: 70,
    courseLength: 1,
  },
]

const womensSlopeRatings: Array<Tee> = [
  {
    name: "White 18h",
    rating: 135,
    courseRating: 76.4,
    par: 76,
    courseLength: 1,
  },
  {
    name: "Yellow 18h",
    rating: 126,
    courseRating: 74.6,
    par: 75,
    courseLength: 1,
  },
  {
    name: "Red 18h",
    rating: 118,
    courseRating: 72.4,
    par: 73,
    courseLength: 1,
  },
  {
    name: "Red Front 9",
    rating: 114,
    courseRating: 35.3,
    par: 36,
    courseLength: 0.5,
  },
  {
    name: "Red Back 9",
    rating: 122,
    courseRating: 37.1,
    par: 37,
    courseLength: 0.5,
  },
]

enum Gender {
  men = "Men",
  women = "Women",
}

const slopeRatings = {
  [Gender.men]: mensSlopeRatings,
  [Gender.women]: womensSlopeRatings,
}

const allowances = [100, 95, 90, 85, 75, 25, 20, 15, 10]

export default function HandicapCalculator() {
  const [handicapIndex, setHandicapIndex] = useState("0")
  const [slopeRating, setSlopeRating] = useState(0)
  const [allowance, setAllowance] = useState(0)
  const [score, setScore] = useState(0)
  const [gender, setGender] = useState(Gender.men)

  const genderSlopeRatings = slopeRatings[gender]

  useEffect(() => {
    const { rating, courseRating, par, courseLength } =
      genderSlopeRatings[slopeRating]
    const allowancePercentage = allowances[allowance] / 100
    const handicapNum = Number.isNaN(Number(handicapIndex))
      ? 0
      : Number(handicapIndex)

    setScore(
      Number(
        (
          ((handicapNum * courseLength * rating) / CONSTANT +
            (courseRating - par)) *
          allowancePercentage
        ).toPrecision(SIGNIFICANT_DIGITS)
      )
    )
  }, [handicapIndex, slopeRating, allowance, genderSlopeRatings])

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

  function safelySetGender(e: ChangeEvent<HTMLInputElement>) {
    const newValue = e.currentTarget.value as Gender
    const newSlopeRatings = slopeRatings[newValue]
    if (slopeRating >= newSlopeRatings.length) {
      setSlopeRating(newSlopeRatings.length - 1)
    }
    setGender(newValue)
  }

  return (
    <>
      <span className={`label-text ${styles.radioList}`}>
        {Object.keys(Gender).map((key) => (
          <label key={key} className={styles.radioLabel}>
            <input
              name="gender"
              checked={gender == Gender[key]}
              value={Gender[key]}
              onChange={safelySetGender}
              type="radio"
            />
            {Gender[key]}
          </label>
        ))}
      </span>
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
          {genderSlopeRatings.map((item, index) => (
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
      <p data-testid="final-value" className={styles.large}>
        {round(score)}
      </p>
    </>
  )
}
