import { hotelsDefaultLink } from "@/data/expedia"

export const mainMenu = [
    {
        title: 'flights',
        link: '/flights',
        openInNewTab: true
    },
    {
        title: 'hotels',
        link: hotelsDefaultLink.affiliateLink,
        openInNewTab: true,
        rel: {nofollow: true, noopener: true, noreferrer: true}
    },
    // {
    //     title: 'destinations',
    //     link: '/destinations',
    //     openInNewTab: true
    // },
    // {
    //     title: 'events',
    //     badge: "new",
    //     badgeClassName: 'bg-info-1 text-dark rounded-8',
    //     link: 'https://jetting.com/events',
    //     openInNewTab: true
    // },
    {
        title: 'flight_deals',
        link: '/cheap-flights-anywhere#prices',
        openInNewTab: true,
        rel: {nofollow: true, noopener: true, noreferrer: true},
        badge: "flight_deals_badge",
        badgeClassName: 'bg-blue text-white rounded-8',
    },
]