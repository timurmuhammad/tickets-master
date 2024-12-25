'use client'

import { useTranslation } from 'react-i18next'
import Copyright from "./Copyright"

const index = () => {
  const { t } = useTranslation(['footer'])

  return (
    <footer className="footer -type-1 text-12">
      <div className="container">

        <div className="py-10">
          <Copyright t={t} />
        </div>

      </div>
    </footer>
  );
};

export default index;
