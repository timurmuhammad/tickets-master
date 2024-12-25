const CounterAbout = ({ t }) => {
  const blockContent = [
    {
      id: 1,
      number: "1,200+",
      meta: "about.counter_1",
      hasUnit: "",
      delayAnim: "100",
    },
    {
      id: 2,
      number: "13,800",
      meta: "about.counter_2",
      hasUnit: "",
      delayAnim: "200",
    },
    {
      id: 3,
      number: "180,000+",
      meta: "about.counter_3",
      hasUnit: "",
      delayAnim: "300",
    },
    {
      id: 4,
      number: "24/7",
      meta: "about.counter_4",
      hasUnit: "",
      delayAnim: "400",
    },
  ]
  return (
    <>
      {blockContent.map((item) => (
        <div
          className="col-xl-3 col-6"
          key={item.id}
          data-aos="fade"
          data-aos-delay={item.delayAnim}
        >
          <div className="text-40 lg:text-30 lh-13 fw-600">
            {item.number}
            {item.hasUnit}
          </div>
          <div className="text-14 lh-14 text-light-1 mt-5">{t(`${item.meta}`)}</div>
        </div>
      ))}
    </>
  );
};

export default CounterAbout;
