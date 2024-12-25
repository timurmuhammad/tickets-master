import { useState, useEffect } from "react"

export default function useDebouncedEffect(callback, delay, deps) {
  const [trigger, setTrigger] = useState(0)

  useEffect(() => {
    const handler = setTimeout(() => {
      callback()
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [...deps, trigger])

  return () => setTrigger(t => t + 1)
}