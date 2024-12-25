'use client'

import { getContent } from '@/utils/appContent'
import { useContext } from 'react'
import { AppContext } from '@/contexts/AppContext'
import { Link } from "@/navigation"
import Image from "next/image"

const Social = () => {
  const { domain } = useContext(AppContext)

  const socials = getContent(domain, 'socials')
  return (
    <>
      {Object.entries(socials).map(([key, item]) => (
        <Link
          href={item.link}
          target="_blank"
          rel="nofollow noopener noreferrer"
          key={key}
        >
          <i className={`icon-${key} text-14`} />
        </Link>
      ))}
    </>
  );
};

export default Social;
