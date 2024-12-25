// Utility function to calculate average price
export function calculateAveragePrice(prices: number[], minPrice: number = null): number {
  if (prices.length === 0) return 0;
  const totalSum = prices.reduce((acc, price) => acc + price, 0);
  return ((totalSum / prices.length) + minPrice) / 2
}

export function formatPriceShort({ 
  price, 
  currency,
  locale = 'en-US', 
  hidePriceSymbol = false 
}: { 
  price: number, 
  currency: string, 
  locale?: string, 
  hidePriceSymbol?: boolean 
}): string {
  const formatter = new Intl.NumberFormat(locale, { 
    style: 'currency', 
    currency: currency, 
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  });

  let newPrice = formatter.format(price)

  let formattedPrice = newPrice.replace(/[^\d,]/g, '');

  // If more than 5 symbols, format to 'K'
  if (formattedPrice.length > 5) {
    const thousands = Math.round(price / 1000);
    formattedPrice = `${thousands}K`

    newPrice = `${formatter.format(thousands)}K`
  }
  
  const res = hidePriceSymbol ? formattedPrice : newPrice
  
  // Remove &nbsp;, space, comma, and dot
  return res.replace(/[\s.,\u00A0]+/g, '');
}

export function formatPrice({ price, currency, locale }: { price: number, currency: string, locale?: string }): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 2,
    trailingZeroDisplay: 'stripIfInteger'
  });

  const formattedPrice = formatter.format(price);
  
  // Remove decimal part if it's .00
  return formattedPrice.replace(/\.00$/, '');
}
