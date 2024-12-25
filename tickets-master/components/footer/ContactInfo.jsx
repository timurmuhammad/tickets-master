'use client'

import { Link } from "@/navigation"
import { usePathname } from "@/navigation"
import { useTranslation } from 'react-i18next'

const ContactInfo = () => {
  const pathname = usePathname()
  const { t } = useTranslation()

  const contactContent = [
    {
      id: 1,
      title: t('footer.sending_message'), //"Sending a message",
      action: "/contact",
      text: t('footer.complete_form'), //"Complete the form",
    },
    {
      id: 2,
      title: t('footer.sending_email'), //"Sending an email",
      action: "mailto:info@ttm.org",
      text: "info@ttm.org",
    },
  ];
  return (
    <>
      {contactContent.map((item) => (
        <div className="mt-30" key={item.id}>
          <div className={"text-14 mt-30"}>{item.title}</div>
          {pathname === item.action ? (
            <div>
              {item.text}
            </div>
          ) : (
            <Link 
              href={item.action}
              target="_blank"
              rel="noopener noreferrer"
              className="text-16 fw-500 text-black mt-5"
            >
              {item.text}
            </Link>
          )}
        </div>
      ))}
    </>
  );
};

export default ContactInfo;
