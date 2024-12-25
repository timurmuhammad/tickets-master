import { useState, useEffect } from 'react'
import { usePathname } from "@/navigation"

export const useHash = () => {
  const [hash, setHash] = useState('')
  const pathname = usePathname()

  const setInitialHash = () => {
    if (typeof window != 'undefined') {
      setHash(window.location.hash)
    }
  }

  useEffect(() => {
    setInitialHash()
  }, [pathname])

  return hash
}