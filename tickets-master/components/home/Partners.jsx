
import Image from "next/image";

const Partners = () => {
  const brandImages = [
    {
      id: 1,
      src: "/img/partners/skyscanner.svg",
      alt: "Skyscanner",
    },
    // {
    //   id: 2,
    //   src: "/img/partners/expedia.svg",
    //   alt: "Expedia",
    // },
    // {
    //   id: 3,
    //   src: "/img/partners/tickets.svg",
    //   alt: "TICKETS",
    // },
    {
      id: 3,
      src: "/img/partners/booking.svg",
      alt: "Booking.com",
    },
    // {
    //   id: 4,
    //   src: "/img/partners/hotels.svg",
    //   alt: "Hotels.com",
    // },
    // {
    //   id: 5,
    //   src: "/img/partners/hostelworld.svg",
    //   alt: "hostelworld",
    // },
    {
      id: 5,
      src: "/img/partners/jetting.svg",
      alt: "Jetting",
    },
    {
      id: 6,
      src: "/img/partners/monobank.svg",
      alt: "monobank",
    },
    {
      id: 7,
      src: "/img/partners/cruise-direct.svg",
      alt: "cruisedirect",
    },
  ];
  return (
    <>
      {brandImages.map((item, i) => (
        <div className="col-md-auto col-sm-6" key={i}>
          <div className="d-flex justify-center">
            <Image            
              width={200}
              height={68} 
              className="h-28"
              src={item.src} 
              alt={item.alt} 
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default Partners;
