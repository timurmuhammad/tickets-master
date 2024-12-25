'use client'

import { Link } from "@/navigation"
import Image from "next/image"
import { useTranslation } from 'react-i18next'
import { useContext } from 'react'
import { AppContext } from '@/contexts/AppContext'
import { getContent } from '@/utils/appContent'

const Images = () => {
  const { domain } = useContext(AppContext)
  const { imageSrc: logoSrc, altName: logoAlt } = getContent(domain, 'logo')

  const { t } = useTranslation(['footer'])

  return (
    <div className="col-xl-2 col-lg-4 col-sm-6 text-center x-gap-10 y-gap-10">
      <Image
        width={120}
        height={120}
        className="w-max-150 mb-10 ml-10"
        src="/img/badges/best-price.png"
        alt={`${t('footer.best_price_guarantee')}`}
      />
      <br />
      <Link
        href={`https://jetting.com`}
        target='_blank'
      >
        <Image
          width={150}
          height={34}
          className="mb-10"
          src="/img/badges/jetting.svg"
          alt={`jetting.com`}
        />
      </Link>
      <br />
      <Image
        width={150}
        height={29}
        src={logoSrc}
        alt={logoAlt}
      />
    </div>
  );
};

export default Images;
