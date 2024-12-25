'use client'

import { useTranslation } from 'react-i18next'

const Pagination = ({
  canPaginate,
  maxPage,
  currentPage,
  setCurrentPage,
  id = '',
  tPaginationKey = 'load_more'
}) => {
  const { t } = useTranslation(['pagination'])

  return (
    canPaginate && currentPage < maxPage && (
      <div className="d-flex justify-center mt-30">
        <button
          id={id}
          className="button -md bg-light-5 text-blue-1 -blue-1" 
          onClick={() => { setCurrentPage(currentPage + 1) }}
        >
          {t(`pagination.${tPaginationKey}`)}
        </button>
      </div>
    )
  )
}

export default Pagination
