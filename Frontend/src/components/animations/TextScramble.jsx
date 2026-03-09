import { useEffect, useMemo, useState } from 'react'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function randomChar() {
  return LETTERS[Math.floor(Math.random() * LETTERS.length)]
}

export default function TextScramble({ text, speed = 30, className = '' }) {
  const [displayed, setDisplayed] = useState('')

  const scramble = useMemo(() => {
    const chars = text.split('')
    const steps = chars.map((target) => {
      const length = Math.floor(Math.random() * 10) + 5
      return {
        target,
        length,
      }
    })
    return { chars, steps }
  }, [text])

  useEffect(() => {
    let frame = 0
    let animationFrame

    function update() {
      frame += 1
      const output = scramble.chars
        .map((char, idx) => {
          const step = scramble.steps[idx]
          if (frame > step.length) return char
          return randomChar()
        })
        .join('')

      setDisplayed(output)

      if (frame < Math.max(...scramble.steps.map((step) => step.length))) {
        animationFrame = requestAnimationFrame(update)
      }
    }

    animationFrame = requestAnimationFrame(update)

    return () => cancelAnimationFrame(animationFrame)
  }, [scramble])

  return <span className={className}>{displayed}</span>
}
