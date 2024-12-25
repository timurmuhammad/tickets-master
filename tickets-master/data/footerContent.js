import { hotelsDefaultLink } from "@/data/expedia"

export const footerContent = [
  {
    id: 1,
    title: "company",
    menuList: [
      {
        title: "about_us",
        link: "/about",
        openInNewTab: true,
      },
      {
        title: "terms_of_use",
        link: "https://ttm.org/terms",
        openInNewTab: true
      },
      // {
      //   title: "privacy_policy",
      //   link: "https://ttm.org/privacy",
      //   openInNewTab: true
      // },
      // { title: "Cookie Policy", link: "/terms#cookie_policy" },
      {
        title: "destinations",
        link: "https://ttm.org/global",
        openInNewTab: true
      },
      {
        title: "contact",
        link: "/contact",
        openInNewTab: true
      },
    ],
  },
  {
    id: 2,
    title: "services",
    menuList: [
      {
        title: "flights",
        link: "/flights",
        openInNewTab: true
      },
      {
        title: "hotels",
        link: hotelsDefaultLink.affiliateLink,
        rel: {nofollow: true, noopener: true, noreferrer: true},
        openInNewTab: true
      },
      {
        title: "deals",
        link: "/cheap-flights-anywhere#prices",
        openInNewTab: true
      },
      // {
      //   title: `blog`,
      //   link: `https://blog.ttm.org`,
      //   openInNewTab: true
      // },
      // {
      //   title: "best_price_guarantee",
      //   link: "/terms#best_price_guarantee",
      //   openInNewTab: true
      // },
      // {
      //   title: 'events',
      //   link: 'https://jetting.com/events',
      //   openInNewTab: true
      // },
    ],
  },
];

export const footerContinents = {
  title: "destinations",
  menuList: [
    {
      title: "africa",
      link: "/destinations/africa",
      openInNewTab: true
    },
    {
      title: "asia",
      link: "/destinations/asia",
      openInNewTab: true
    },
    {
      title: "australia-and-oceania",
      link: "/destinations/australia-and-oceania",
      openInNewTab: true
    },
    {
      title: "europe",
      link: "/destinations/europe",
      openInNewTab: true
    },
    {
      title: "north-america",
      link: "/destinations/north-america",
      openInNewTab: true
    },
    {
      title: "south-america",
      link: "/destinations/south-america",
      openInNewTab: true
    },
    // { title: "Middle East", link: "/destinations/middle-east" },
  ],
}
