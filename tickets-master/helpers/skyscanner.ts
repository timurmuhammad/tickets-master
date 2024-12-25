export const getSkyscannerDateTimeDifference = (datetime1, datetime2) => {
  const date1 = new Date(datetime1.year, datetime1.month - 1, datetime1.day, datetime1.hour, datetime1.minute)
  const date2 = new Date(datetime2.year, datetime2.month - 1, datetime2.day, datetime2.hour, datetime2.minute)

  const diff = date2.getTime() - date1.getTime()

  const diffMinutes = Math.floor(diff / 1000 / 60)

  return diffMinutes
}

export const formatSkyscannerImageUrl = (title, imageUrl) => {
  if (!imageUrl) {
    return title == 'Ryanair' ? '/img/flights/carriers/ryanair.png' : '/img/flights/carriers/default.png'
  }
  return imageUrl
}