
'use client'

import React, { useState } from "react"
import useLocalStorage, { getLocalStorageData } from "@/hooks/useLocalStorage"

const WishlistButton = ({ wishlistKey, id, className = '' }) => {
    const [wishlistItems, setWishlistItems] = useLocalStorage(wishlistKey, [])

    // Check if item is already in the wishlist
    const [inWishlist, setInWishlist] = useState(wishlistItems?.some(wItem => wItem === id))

    const handleWishlistClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (inWishlist) {
            // Remove item from wishlist
            const filteredItems = getLocalStorageData(wishlistKey, []).filter(wItem => wItem !== id)
            setWishlistItems(filteredItems)
        } else {
            // Add item to wishlist
            const newItems = [...getLocalStorageData(wishlistKey, []), id]
            setWishlistItems(newItems)
        }

        // Toggle inWishlist state
        setInWishlist(!inWishlist)
    }

    return (
        <div
            className={`${className}`}
        >
            <button className={`button ${inWishlist ? '-dark-2 bg-dark-1 text-white' : '-dark-3 bg-white text-dark'} size-30 rounded-full shadow-2 `} type="button" onClick={handleWishlistClick}>
                <i className="icon-heart text-12" />
            </button>
        </div>
    )
}

export default WishlistButton