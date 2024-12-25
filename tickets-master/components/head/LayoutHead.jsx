'use client'

import Aos from "aos"
import React, { useEffect } from "react"
import { GoogleAnalytics } from "nextjs-google-analytics"
import { useContext } from 'react'
import { AppContext } from '@/contexts/AppContext'
import { getContent } from '@/utils/appContent'

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

const LayoutHead = () => {
  const { domain } = useContext(AppContext)
  const gaValue = getContent(domain, 'gaValue')
  
  useEffect(() => {
    Aos.init({
      duration: 1200,
      once: true,
    });
  }, []);

  return (
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Onest:wght@400..600&display=swap" rel="stylesheet"/>

      <link rel="apple-touch-icon" sizes="180x180" href="/img/logo/fav/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/img/logo/fav/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/img/logo/fav/favicon-16x16.png" />
      <link rel="manifest" href="/img/logo/fav/site.webmanifest" />
      <link rel="mask-icon" href="/img/logo/fav/safari-pinned-tab.svg" color="#121212" />
      <meta name="msapplication-TileColor" content="#121212" />
      <meta name="theme-color" content="#ffffff" />
      {gaValue && (
        <GoogleAnalytics strategy="lazyOnload" trackPageViews gaMeasurementId={gaValue} />
      )}
    </head>
  )
};

export default LayoutHead;