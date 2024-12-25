
'use client'

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'

const HelpfulFeedback = ({ id }) => {
  const { t } = useTranslation(['feedback'])

  const storageKey = `feedback_${id}`;
  const [isHelpfulClicked, setIsHelpfulClicked] = useState(false);
  const [isNotHelpfulClicked, setIsNotHelpfulClicked] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const storedFeedback = localStorage.getItem(storageKey);
    if (storedFeedback) {
      setFeedback(storedFeedback);
      if (storedFeedback === 'helpful') {
        setIsHelpfulClicked(true);
      } else if (storedFeedback === 'notHelpful') {
        setIsNotHelpfulClicked(true);
      }
    }
  }, []);

  const handleHelpfulClick = () => {
    if (isHelpfulClicked) {
      setIsHelpfulClicked(false);
      setFeedback('');
      localStorage.removeItem(storageKey);
    } else {
      setIsHelpfulClicked(true);
      setIsNotHelpfulClicked(false);
      setFeedback('helpful');
      localStorage.setItem(storageKey, 'helpful');
    }
  };

  const handleNotHelpfulClick = () => {
    if (isNotHelpfulClicked) {
      setIsNotHelpfulClicked(false);
      setFeedback('');
      localStorage.removeItem(storageKey);
    } else {
      setIsHelpfulClicked(false);
      setIsNotHelpfulClicked(true);
      setFeedback('notHelpful');
      localStorage.setItem(storageKey, 'notHelpful');
    }
  };

  return (
    <div className="helpful-not-helpful-container">
      <div className="d-flex x-gap-10 items-center text-10 mt-10">
        <button
          className={`helpful d-flex items-center text-red-4 ${isHelpfulClicked ? 'active' : ''}`}
          onClick={handleHelpfulClick}
        >
          <i className="icon-like mr-5" />
          {t('feedback.helpful')}
        </button>
        <button
          className={`helpful d-flex items-center text-dark-5 ${isNotHelpfulClicked ? 'active' : ''}`}
          onClick={handleNotHelpfulClick}
        >
          <i className="icon-dislike mr-5" />
          {t('feedback.not_helpful')}
        </button>
      </div>
      <div className="feedback-message">
        {feedback === 'notHelpful' || feedback === 'helpful' ? t('feedback.feedback_thanks') : t('feedback.feedback_important')}
      </div>
    </div>
  );
};

export default HelpfulFeedback;
