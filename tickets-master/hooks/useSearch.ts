import { FlightsSearchContext } from '@/contexts/FlightsSearchContext'
import { useContext } from 'react'

export const useSearchForm = () => useContext(FlightsSearchContext)