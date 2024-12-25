const ContactInfo = ({ t }) => {
  const contactContent = [
    {
      id: 1,
      title: t('header.email_support'), //"Need support? Email us:",
      action: "mailto:info@ttm.org",
      text: "info@ttm.org",
    },
  ];
  return (
    <>
      {contactContent.map((item) => (
        <div className="mb-20" key={item.id}>
          <div className={"text-14"}>{item.title}</div>
          <a href={item.action} className="text-18 fw-500 text-dark-1 mt-5">
            {item.text}
          </a>
        </div>
      ))}
    </>
  );
};

export default ContactInfo;
