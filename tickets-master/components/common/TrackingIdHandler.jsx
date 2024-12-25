"use client"

import { useSearchParams } from 'next/navigation'
import { setCookie } from "@/helpers/cookie"
import { Suspense } from 'react'
import { useRouter, usePathname } from "@/navigation"

const Tracking = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    
    if (searchParams) {
        const trackingId = searchParams.get('t')
        if (trackingId) {
            const params = new URLSearchParams(searchParams.toString())
            params.delete('t')
            
            setCookie('trackingId', trackingId, 30 * 24)
            
            const newUrl = {
                pathname: pathname,
                query: Object.fromEntries(params),
                hash: window.location.hash
            };

            router.push(`${newUrl.pathname}${newUrl.query ? `?${new URLSearchParams(newUrl.query).toString()}` : ''}${newUrl.hash}`);
        }
    }
}

const TrackingIdHandler = () => {
  
    return (
        <Suspense>
            <Tracking />
        </Suspense>
    )
}

export default TrackingIdHandler