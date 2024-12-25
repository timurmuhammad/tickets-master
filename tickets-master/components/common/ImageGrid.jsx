import { providers } from "../../data/providers";

const ImageGrid = ({ opacity }) => {
  return (
    <>
      {providers.map((item) => (
        <div
          className="col"
          key={item.id}
          data-aos="fade"
          data-aos-delay={item.delayAnim}
        >
            <div className="row items-center justify-center">
              <div className="col-auto">
                <img
                  style={{ opacity: opacity }}
                  className="size-partner"
                  src={item.img}
                  alt={item.alt}
                />
              </div>
            </div>
        </div>
      ))}
    </>
  );
};

export default ImageGrid;
