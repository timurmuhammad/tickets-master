const Address = ({ t }) => {
  const addressContent = [
    {
      id: 1,
      colClass: "col-lg-3",
      title: t('contact.our_registration_address'),
      content: (
        <>
        {t('contact.address')}
        </>
      ),
    },
    {
      id: 2,
      colClass: "col-auto",
      title: t('contact.customer_support'),
      content: (
        <>
          <a href="mailto:info@ttm.org">{t('contact.email_customer_support')}</a>
        </>
      ),
    },
    {
      id: 3,
      colClass: "col-auto",
      title: t('contact.partner_contact'),
      content: (
        <>
          {" "}
          <a href="mailto:partner@ttm.org">{t('contact.email_partner_contact')}</a>
        </>
      ),
    },
  ];
  return (
    <>
      {addressContent.map((item) => (
        <div className={`${item.colClass}`} key={item.id}>
          <div className="text-14 text-light-1">{item.title}</div>
          <div className="text-18 fw-500 mt-10">{item.content}</div>
        </div>
      ))}
    </>
  );
};

export default Address;
