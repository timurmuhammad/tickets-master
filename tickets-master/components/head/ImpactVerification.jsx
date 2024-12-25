import { headers } from "next/headers"
import { getContent } from '@/utils/appContent'

const ImpactVerification = () => {
  const headerList = headers();
  const reqHost = headerList.get("x-current-domain")
  const impactValue = getContent(reqHost, 'impactValue')

  return impactValue ? (
    <meta name='impact-site-verification' content={impactValue} />
  ) : null
};

export default ImpactVerification;