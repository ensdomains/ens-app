import React from 'react'
import styled from '@emotion/styled'
import { useQuery } from 'react-apollo'

import { GET_DOMAINS_OWNED_BY_ADDRESS_FROM_SUBGRAPH } from '../../graphql/queries'

import Loader from '../Loader'
import DomainItem from '../DomainItem/ChildDomainItem'
import { decryptName } from '../../api/labels'

const NoDomainsContainer = styled('div')`
  display: flex;
  padding: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  box-shadow: 3px 4px 6px 0 rgba(229, 236, 241, 0.3);
  border-radius: 6px;
  margin-bottom: 40px;

  h2 {
    color: #adbbcd;
    font-weight: 100;
    margin-bottom: 0;
    padding: 0;
    margin-top: 20px;
    text-align: center;
    max-width: 500px;
  }

  p {
    color: #2b2b2b;
    font-size: 18px;
    font-weight: 300;
    margin-top: 20px;
    line-height: 1.3em;
    text-align: center;
    max-width: 400px;
  }
`

const DomainsContainer = styled('div')`
  margin-top: 20px;
  padding-bottom: 30px;
  padding-left: 40px;
  padding-right: 40px;
`

function hasNoDomains(data) {
  return (
    (data.account &&
      data.account.domains &&
      data.account.domains.length === 0) ||
    data.account === null
  )
}

function filterOutReverse(domains) {
  return domains.filter(
    domain => domain.parent && domain.parent.name !== 'addr.reverse'
  )
}

function normaliseAddress(address) {
  return address.toLowerCase()
}

function getSortFunc(activeSort) {
  function alphabetical(a, b) {
    if (
      a.domain.name &&
      a.domain.name[0] === '[' &&
      b.domain.name &&
      b.domain.name[0] === '['
    )
      return a.domain.name > b.domain.name ? 1 : -1
    if (a.domain.name && a.domain.name[0] === '[') return 1
    if (b.domain.name && b.domain.name[0] === '[') return -1
    return a.domain.name > b.domain.name ? 1 : -1
  }
  switch (activeSort) {
    case 'alphabetical':
      return alphabetical
    case 'alphabeticalDesc':
      return (a, b) => {
        if (
          a.domain.name &&
          a.domain.name[0] === '[' &&
          b.domain.name &&
          b.domain.name[0] === '['
        )
          return a.domain.name > b.domain.name ? 1 : -1
        if (a.domain.name && a.domain.name[0] === '[') return 1
        if (b.domain.name && b.domain.name[0] === '[') return -1
        return a.domain.name < b.domain.name ? 1 : -1
      }
    case 'expiryDate':
      return (a, b) => a.expiryDate - b.expiryDate

    case 'expiryDateDesc':
      return (a, b) => b.expiryDate - a.expiryDate
    default:
      return alphabetical
  }
}

export default function DomainList({
  address,
  activeSort,
  activeFilter,
  checkedBoxes,
  setCheckedBoxes
}) {
  const normalisedAddress = normaliseAddress(address)
  const { loading, data, error } = useQuery(
    GET_DOMAINS_OWNED_BY_ADDRESS_FROM_SUBGRAPH,
    { variables: { id: normalisedAddress } }
  )

  if (error) {
    return 'Error getting domains'
  }

  if (loading) {
    return <Loader withWrap large />
  }

  if (hasNoDomains(data)) {
    return (
      <NoDomainsContainer>
        <h2>This address does not own any domains</h2>
      </NoDomainsContainer>
    )
  }

  let domains = []

  if (activeFilter === 'registrant') {
    domains = [...data.account.registrations?.sort(getSortFunc(activeSort))]
  } else if (activeFilter === 'controller') {
    domains = [
      ...filterOutReverse(data.account.domains)
        .map(domain => ({ domain }))
        .sort(getSortFunc(activeSort))
    ]
  }

  return (
    <DomainsContainer>
      {domains.map(d => {
        const name = decryptName(d.domain.name)
        return (
          <>
            <DomainItem
              name={name}
              owner={address}
              domain={d.domain}
              expiryDate={d?.expiryDate}
              labelName={d.domain.labelName}
              labelhash={d.domain.labelhash}
              parent={d.domain.parent.name}
              checkedBoxes={activeFilter === 'registrant' ? checkedBoxes : null}
              setCheckedBoxes={
                activeFilter === 'registrant' ? setCheckedBoxes : null
              }
            />
          </>
        )
      })}
    </DomainsContainer>
  )
}
