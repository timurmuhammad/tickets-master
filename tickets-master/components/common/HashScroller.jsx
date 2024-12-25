"use client"

import { useHash } from '@/hooks/useHash'
import { scrollToSection } from '@/utils/scrollToSection'
import useDebouncedEffect from "@/hooks/useDebouncedEffect"

const HashScroller = () => {
  const hash = useHash()

  useDebouncedEffect(() => {
    const section = hash.replace("#", "")

    if (section) scrollToSection(section)
  }, 100, [hash])
  
  return null
}

export default HashScroller