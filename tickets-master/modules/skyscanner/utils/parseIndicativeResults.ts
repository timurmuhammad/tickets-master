import { calculateAveragePrice } from '@/helpers/price'

export default function parseResults(resultsRaw, type, groupBy) {
  if (type == 'places') {
    const places = resultsRaw.content?.results?.places || {}

    if (groupBy == 'route') {
      const quotes = resultsRaw.content?.results?.quotes || {}

      let grouppedParsedResults = []
      const grouppedQuotes = resultsRaw.content?.groupingOptions?.byRoute?.quotesGroups

      if (grouppedQuotes) {
        let grouppedMinPrice = Infinity
        const groupedResults = {}

        grouppedQuotes.forEach((quote: any) => {
          let minPrice = Infinity
          let selectedQuote = null

          // Find the quote with the lowest price
          quote.quoteIds.forEach(quoteId => {
            const quote = quotes[quoteId]
            if (quote && parseFloat(quote.minPrice.amount) < minPrice) {
              minPrice = parseFloat(quote.minPrice.amount)
              selectedQuote = quote
            }
          })

          if (minPrice < grouppedMinPrice) grouppedMinPrice = minPrice

          const destination = places[quote.destinationPlaceId]

          // Group by destinationPlaceId
          if (!groupedResults[quote.destinationPlaceId] || (groupedResults[quote.destinationPlaceId] && groupedResults[quote.destinationPlaceId].price > minPrice)) {
            groupedResults[quote.destinationPlaceId] = {
              originPlace: places[quote.originPlaceId],
              destinationPlace: destination,
              price: minPrice,
              isDirect: selectedQuote.isDirect,
            }
          }
        })

        const averagePrice = calculateAveragePrice(Object.values(groupedResults).map((result: any) => result.price), grouppedMinPrice)

        grouppedParsedResults = Object.values(groupedResults)
        grouppedParsedResults.forEach((result: any) => {
          result.isCheapest = result.price === grouppedMinPrice
          result.isBelowAverage = result.price < averagePrice
        })

        grouppedParsedResults.sort((a: any, b: any) => a.price - b.price)
      }

      return grouppedParsedResults
    } else {
      let parsedResults = []
      let minPrice = Infinity
  
      const carriers = resultsRaw.content?.results?.carriers || {}
      const quotes = Object.values(resultsRaw.content?.results?.quotes || {})
  
  
      quotes.forEach((quote: any) => {
        const outboundLeg = quote.outboundLeg
        const inboundLeg = quote.inboundLeg
  
        const outbound = {
          originPlace: places[outboundLeg.originPlaceId],
          destinationPlace: places[outboundLeg.destinationPlaceId],
          carrier: carriers[outboundLeg.marketingCarrierId],
          departureDateTime: outboundLeg.departureDateTime,
        }
  
        let inbound = null
        if (inboundLeg && inboundLeg.originPlaceId) {
          inbound = {
            originPlace: places[inboundLeg.originPlaceId],
            destinationPlace: places[inboundLeg.destinationPlaceId],
            carrier: carriers[inboundLeg.marketingCarrierId],
            departureDateTime: inboundLeg.departureDateTime,
          }
        }
  
        const price = parseFloat(quote.minPrice.amount)
        if (price < minPrice) minPrice = price
  
        parsedResults.push({
          outbound,
          inbound,
          price,
          isDirect: quote.isDirect,
        })
      })
  
      parsedResults.forEach(result => {
        result.isCheapest = result.price === minPrice
      })
      
      parsedResults.sort((a, b) => a.price - b.price)
      return parsedResults
    }
  } else {
    const parsedResults = {}
    const source = resultsRaw.content?.results?.quotes
    let minPrice = Infinity
  
    if (source) {
      Object.values(source).forEach((quote: any) => {
        const outboundDateTime = quote.outboundLeg.departureDateTime
        const outboundDay = groupBy != 'dates' ? `-${String(outboundDateTime.day).padStart(2, '0')}` : ''
        const outboundDateText = `${outboundDateTime.year}-${String(outboundDateTime.month).padStart(2, '0')}${outboundDay}`
  
        const inboundDateTime = quote?.inboundLeg?.originPlaceId ? quote.inboundLeg.departureDateTime : null
        const inboundDay = inboundDateTime && groupBy != 'dates' ? `-${String(inboundDateTime.day).padStart(2, '0')}` : ''
        const inboundDateText = inboundDateTime ? `-${inboundDateTime.year}-${String(inboundDateTime.month).padStart(2, '0')}${inboundDay}` : ''
  
        const dateKey = outboundDateText + inboundDateText
        const price = parseFloat(quote.minPrice.amount)
  
        if (parsedResults[dateKey]) {
          // If the date key exists, compare and save the lower price
          if (price < parsedResults[dateKey].price) {
            parsedResults[dateKey].price = price;
            parsedResults[dateKey].isDirect = quote.isDirect; // update if the new price is lower
          }
        } else {
          // If the date key doesn't exist, create a new entry
          parsedResults[dateKey] = {
            date: dateKey,
            price: price,
            isDirect: quote.isDirect
          };
        }
  
        if (price < minPrice) {
          minPrice = price
        }
      })

      const averagePrice = calculateAveragePrice(Object.values(parsedResults).map((result: any) => result.price), minPrice)

      // Sort the dates in descending order (from bigger to smaller)
      const sortedDates = Object.keys(parsedResults).sort((a, b) => {
        const dateA: any = new Date(a)
        const dateB: any = new Date(b)
        return dateA - dateB
      })
  
      // Reconstruct the object with sorted dates
      const sortedResults = {}
      sortedDates.forEach((dateKey) => {
        sortedResults[dateKey] = parsedResults[dateKey]
        sortedResults[dateKey].isBelowAverage = sortedResults[dateKey].price < averagePrice
        sortedResults[dateKey].isCheapest = sortedResults[dateKey].price == minPrice
      })

      return sortedResults
    }
  }

  return null
}
