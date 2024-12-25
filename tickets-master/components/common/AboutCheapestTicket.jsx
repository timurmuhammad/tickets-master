export default function AboutCheapestTicket() {
  const bookingSites = [
    { name: 'Others', imgUrl: '', price: 90 }, //131
    { name: 'Expedia', imgUrl: '/img/providers/xpus.png', price: 100 }, //90
    { name: 'Booking.com', imgUrl: '/img/providers/bcom.png', price: 108 }, //100
    { name: 'United airlines', imgUrl: '/img/providers/uair.png', price: 118 }, //108
    { name: 'Priceline', imgUrl: '/img/providers/pcln.png', price: 131 }, //118
  ]
  const lowestPrice = Math.min(...bookingSites.map(site => site.price))

  const showImages = false

  return (
    <div className="container layout-pt-lg layout-pb-lg">
      <h2 className="text-center mb-8">Get the Aggregator price, Cheapest</h2>
      
      <p className="text-center mb-20">
        We find the lowest price from all available booking sites and airlines
      </p>
      
      <div className="row justify-center align-items-center">
        <div className="col-sm-4 col-lg-2 col-5 text-center bg-blue-1 text-white rounded-18">
          <div className="px-20 py-20 sm:px-15 sm:py-15 d-flex flex-column align-items-center">
            <i className={`icon-tickets text-40`} />
            <span className="text-18 sm:text-16 fw-700 text-uppercase mt-20">tickets.us</span>
            <span className="text-24 sm:text-22 lh-15 sm:mt-8 fw-500 text-green-2">${lowestPrice}</span>
          </div>
        </div>

        <div className="col-sm-auto col-12 text-30 fw-700 text-center">=</div>

        <div className="col-sm-6 col-lg-4 col-8 text-center rounded-18 bg-light-2">
          <div className="px-20 py-20">
            {bookingSites.map((site, index) => (
              <div key={index} className={`${site.price === lowestPrice ? "fw-700" : ""} text-18 d-flex justify-between items-center mb-2 last:mb-0`}>
                {/* <span>{site.name}</span> */}
                <span>
                  {showImages && site.imgUrl ? (
                    <img src={`${site.imgUrl}`} alt={`${site.name}`} style={{ width: '100px'}}/>
                  ) : (
                    <>
                      {site.name}
                    </>
                  )}
                </span>
                <span className={`${site.price === lowestPrice ? "text-green-4" : ""}`}>
                  ${site.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}