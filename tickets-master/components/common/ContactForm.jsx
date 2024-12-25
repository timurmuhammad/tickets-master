'use client'

import { useContext, useState } from "react"
import { AppContext } from '@/contexts/AppContext'
import { useTranslation } from 'react-i18next'

const ContactForm = () => {
  const { t } = useTranslation(['search_form'])
  
  const { appName, domain } = useContext(AppContext)

  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  //status
  const [formStatus, setFormStatus] = useState(null)
  const [formMessage, setFormMessage] = useState("")

  const handleSubmit = async () => {
    //validate email
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setFormStatus('error')
      setFormMessage(t('contact.invalid_email_address'))
      return false
    } else if (!name || !email || !subject || !message) {
      setFormStatus('error')
      setFormMessage(t('contact.please_fill_all_fields'))
      return false
    } else {
      setFormStatus(null)
      setFormMessage("")
    }

    // handle form submission logic here
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
        appName,
        domain,
      })
    });

    const resBody = await res.json();

    if (res.status == 200) {
      setFormStatus('success')
      setFormMessage(t(`contact.${resBody}`))

      //clear form
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } else {
      setFormStatus('error')
      setFormMessage(t(`contact.${resBody}`))
    }
  };

  return (
    <div className="row y-gap-20 pt-20">
      <div className="col-12">
        <div className="form-input">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
            }}
          />
          <label className="lh-1 text-16 text-light-1">
            {t('contact.your_name')} *
          </label>
        </div>
      </div>
      <div className="col-12">
        <div className="form-input">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
          <label className="lh-1 text-16 text-light-1">
            {t('contact.email')} *
          </label>
        </div>
      </div>
      <div className="col-12">
        <div className="form-input">
          <input
            type="text"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value)
            }}
          />
          <label className="lh-1 text-16 text-light-1">
            {t('contact.subject')} *
          </label>
        </div>
      </div>
      <div className="col-12">
        <div className="form-input">
          <textarea
            rows="5"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
            }}
          ></textarea>
          <label className="lh-1 text-16 text-light-1">
            {t('contact.your_message')} *
          </label>
        </div>
      </div>
      <div className="col-auto">
        <button
          onClick={handleSubmit}
          className="button px-24 h-50 -dark-1 bg-dark-1 text-white"
        >
          {t('contact.submit')} <div className="icon-arrow-top-right ml-15"></div>
        </button>
      </div>
      
      {formStatus && (
        <div className={`col-12 ${formStatus == 'error' ? 'text-red-1' : 'text-green-2'}`} >
          {formMessage}
        </div>
      )}
    </div>
  );
};

export default ContactForm;
