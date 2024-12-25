'use client'

import React from 'react'
import { Link, usePathname } from "@/navigation"
import { useTranslation } from 'react-i18next'

function formatBreadcrumb({ dataArrays, urlSlug }) {
  const { t } = useTranslation(['breadcrumbs'])

  // Iterate over each data array to find a matching item by slug
  for (let dataArray of dataArrays) {
    const tKey = dataArray.tKey ?? null
    const foundItem = dataArray.arr.find(item => item.slug === urlSlug)
    if (foundItem) {
      return tKey ? t(`${tKey}.${foundItem.slug}`) : foundItem.name
    }
  }

  const newUrlSlug = urlSlug .replace(/-/g, '_') // Replace hyphens with 

  return t(`breadcrumbs.${newUrlSlug}`)
}

const TopBreadcrumbs = ({ link, dataArrays, activeBreadcrumb }) => {
  const { t } = useTranslation(['breadcrumbs'])

  const pathname = usePathname()
  const pathnames = pathname.split('/').filter(x => x)

  return (
    <section className="py-10 d-flex items-center bg-light-2">
      <div className="container">
        <div className="row y-gap-10 items-center justify-between">
          <div className="col-auto">
            <div className="row x-gap-10 y-gap-5 items-center text-12 text-light-1">
              <div className="col-auto">
                <Link href="/">{t('breadcrumbs.home')}</Link>
              </div>
              <span className="col-auto">
                &#47;
              </span>
              {pathnames.map((value, index) => {
                const last = index === pathnames.length - 1
                const formattedtext = !last && formatBreadcrumb({ dataArrays, urlSlug: decodeURIComponent(value) })
                const to = `/${pathnames.slice(0, index + 1).join('/')}`

                return last ? (
                  <div key={to} className="col-auto" aria-current="page">
                    <span className='text-dark-1'>{activeBreadcrumb}</span>
                  </div>
                ) : (
                  <>
                    <div className="col-auto" key={to}>
                      <Link href={to}>{formattedtext}</Link>
                    </div>
                    <span className="col-auto" key={to + '/'}>
                      &#47;
                    </span>
                  </>
                )
              })}
            </div>
          </div>
          
          {/*{link?.href && link?.text && (
            <div className="col-auto">
              <Link 
                href={`${link.href}`} 
                className="text-14 text-dark-1 underline" 
                target='_blank'
                rel="noopener noreferrer"
              >
                {link.text}
              </Link>
            </div>
          )}*/}
        </div>
      </div>
    </section>
  );
};

export default TopBreadcrumbs
