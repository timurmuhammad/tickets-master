import AppBlock from "@/components/block/AppBlock"

const AppBanner = () => {
  return (
    <section
      className="section-bg pt-80 pb-80 md:pt-40 md:pb-40 animated"
      data-aos="fade-up"
    >
      <div className="section-bg__item -w-1500 rounded-24 bg-red-3"></div>
      <div className="container">
        <AppBlock />
      </div>
    </section>
  );
};

export default AppBanner;
