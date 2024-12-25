'use client'

import { useContext } from "react"
import { AppContext } from "@/contexts/AppContext"
import { domains } from "@/data/domains"

const DomainList = () => {
  const { domain: currentDomain } = useContext(AppContext)
  return (
    <div className="flag-domain-list">
      {domains.map(({ name, domain, flag }) => (
        <div key={domain} className={`flag-domain-item ${domain.toLowerCase() === currentDomain.toLowerCase() ? 'fw-600 underline' : ''}`}>
          <span className={`flags ${flag}`}></span>
          <span className="domain-name">{domain}</span>
        </div>
      ))}
    </div>
  )
}

export default DomainList
