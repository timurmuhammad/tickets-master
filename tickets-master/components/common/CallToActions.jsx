'use client'

import { useTranslation } from 'react-i18next'
import { useState } from "react"

const CallToActions = () => {
  const { t } = useTranslation(['call_to_actions'])
  
  const [email, setEmail] = useState("")

  //status
  const [formStatus, setFormStatus] = useState(null)
  const [formMessage, setFormMessage] = useState("")

  //hande Submit
  const handleSubmit = async () => {

    //validate email
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setFormStatus('error')
      setFormMessage(t("call_to_actions.invalid_email"))
      return false
    }

    const formData = {
      email: email,
    }

    const res = await fetch("/api/email/subscribe", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    const resBody = await res.json()
    
    if (res.status == 200) {
      setEmail('')

      setFormStatus('success')
      if (resBody == 'Successfully Subscribed') {
        setFormMessage(t("call_to_actions.user_successfully_subscribed"))
      } else if (resBody == 'Already Subscribed') {
        setFormMessage(t("call_to_actions.user_already_subscribed"))
      } else {
        setFormMessage(resBody)
      }
    } else {
      setFormStatus('error')
      setFormMessage(t('call_to_actions.error_try_again')) //Something went wrong, please try again later
    }
  }

  return (
    <section className="layout-pt-md layout-pb-md bg-dark-2">
      <div className="container md:pb-60 pt-20 md:pt-60 pb-20">
        <div className="row y-gap-30 justify-between items-center">
          <div className="col-auto">
            <div className="row y-gap-20 flex-wrap items-center">
              <div className="col-auto">
                <div className="icon-newsletter text-60 sm:text-40 text-white" />
              </div>
              <div className="col-auto">
                <h4 className="text-26 text-white fw-600">
                  {t('call_to_actions.signup_title')}
                </h4>
                <div className="text-white">
                  {t('call_to_actions.signup_sub')}
                </div>
              </div>
            </div>
          </div>
          {/* End .col */}

          <div className="col-auto position-relative">
            <div className="single-field -w-410 d-flex x-gap-10 y-gap-20">
              <div>
                <input
                  className="bg-white h-60"
                  type="email"
                  placeholder={t('call_to_actions.signup_input_text')} //Your Email
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setFormStatus(null)
                    setFormMessage('')
                  }}
                />
              </div>

              <div>
                <button
                  className="button -md h-60 bg-dark-1 text-white"
                  onClick={handleSubmit}
                >
                  {t('call_to_actions.signup_button')}
                </button>
              </div>
            </div>
            {formStatus && (
              <div
                className={`position-absolute ${formStatus == 'error' ? 'text-red-3' : 'text-green-3'}`}
                style={{top: '90px'}}
              >
                {formMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActions;
