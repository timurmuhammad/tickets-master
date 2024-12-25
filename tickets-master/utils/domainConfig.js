export const defaultDomain = {
  domain: "tickets.us",
    skyscannerMarket: "US",
    market: "US",
    appName: "TICKETS",
    langs: ["en", "es"],
    defaultCurrency: "USD",
};

export const domainsArr = [
  defaultDomain,
  {
    domain: "tickets.se",
    skyscannerMarket: "SE",
    market: "SE",
    appName: "TICKETS",
    langs: ["se", "no", "dk", "fi", "en"],
    defaultCurrency: "SEK",
  },
  {
    domain: "tickets.com.co",
    skyscannerMarket: "US",
    market: "CO",
    appName: "TICKETS",
    langs: ["es", "en"],
    defaultCurrency: "COP",
  },
  {
    domain: "tickets.ar",
    skyscannerMarket: "US",
    market: "AR",
    appName: "TICKETS",
    langs: ["es", "en"],
    defaultCurrency: "ARS",
  },
  {
    domain: "tickets.pt",
    skyscannerMarket: "US",
    market: "PT",
    appName: "TICKETS",
    langs: ["pt", "en"],
    defaultCurrency: "EUR",
  },
  {
    domain: "tickets.co.id",
    skyscannerMarket: "US",
    market: "ID",
    appName: "TICKETS",
    langs: ["id", "en"],
    defaultCurrency: "IDR",
  },
  {
    domain: "tickets.bh",
    skyscannerMarket: "US",
    market: "BH",
    appName: "TICKETS",
    // langs: ["ar", "en"],
    langs: ["en"],
    defaultCurrency: "BHD",
    isComingSoon: true
  },
  {
    domain: "tickets.com.mm",
    skyscannerMarket: "US",
    market: "MM",
    appName: "TICKETS",
    // langs: ["my", "en"],
    langs: ["en"],
    defaultCurrency: "MMK",
    isComingSoon: true
  },
];

export const getDomainConfig = ({ host = null, headers = null }) => {
  let reqHost = host;
  if (!reqHost && headers) {
    const headerList = headers();
    reqHost = headerList.get("x-current-domain");
  }

  return domainsArr.find((item) => item.domain === host) || defaultDomain;
};
