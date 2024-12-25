'use client'

import React, { useState, useEffect } from "react"
import Image from "next/image"

const ImageWithFallback = ({
  fallbackSrc,
  alt,
  src,
  setImageError,
  ...props
}) => {
  const [error, setError] = useState(null)

  useEffect(() => {
    setError(null)
    if (setImageError) {
      setImageError(null)
    }
  }, [src])

  return (
    <Image
      alt={alt}
      onError={(value) => {
        setError(value)
        if (setImageError) {
          setImageError(value)
        }
      }}
      src={error ? fallbackSrc : src}
      {...props}
    />
  )
}
export default ImageWithFallback