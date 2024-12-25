import Image from "next/image";
import BonusContent from "./BonusContent";

const Bonus = ({ t, className }) => {
  return (
    <>
      <div className="row">
        <button
          className="d-flex"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasTop"
          aria-controls="offcanvasTop"
        >
          <Image
            width={22}
            height={22}
            src="/img/misc/gift.png"
            alt="Bonus"
            className={`d-flex items-center mr-20 sm:mr-0`}
          />
        </button>
      </div>
      
      <div
        className="offcanvas offcanvas-top vh-100"
        tabIndex={-1}
        id="offcanvasTop"
        aria-labelledby="offcanvasTopLabel"
      >
        <div className="offcanvas-header position-absolute top-0 end-0">
          <button
            type="button"
            className="btn-close text-reset "
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>

        <BonusContent t={t} />

      </div>
    </>
  );
};

export default Bonus;