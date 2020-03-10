import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useQuery } from 'react-apollo'

import { GET_DOMAINS_OWNED_BY_ADDRESS_FROM_SUBGRAPH } from '../../graphql/queries'
import DomainItem from '../DomainItem/ChildDomainItem'
import { decryptName } from '../../api/labels'
import AddressContainer from '../Basic/MainContainer'
import DefaultTopBar from '../Basic/TopBar'
import { Title } from '../Typography/Basic'
import { ExternalButtonLink as DefaultExternalButtonLink } from '../Forms/Button'
import { getEtherScanAddr } from '../../utils/utils'
import Loader from '../Loader'

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

const TopBar = styled(DefaultTopBar)`
  margin-bottom: 40px;
`

const ExternalButtonLink = styled(DefaultExternalButtonLink)`
  margin-left: 40px;
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

function DomainList({ domains, address }) {
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

  const mergedDomains = [
    ...data.account.registrations,
    ...filterOutReverse(data.account.domains).map(domain => ({ domain }))
  ]

  return (
    <DomainsContainer>
      {mergedDomains.map(d => (
        <DomainItem
          name={decryptName(d.domain.name)}
          owner={address}
          domain={d.domain}
          expiryDate={d?.expiryDate}
        />
      ))}
    </DomainsContainer>
  )
}

export default function Address({ address }) {
  let [etherScanAddr, setEtherScanAddr] = useState(null)

  useEffect(() => {
    getEtherScanAddr().then(setEtherScanAddr)
  }, [])

  return (
    <AddressContainer>
      <TopBar>
        <Title>{address}</Title>
      </TopBar>
      {etherScanAddr && (
        <ExternalButtonLink
          type="primary"
          target="_blank"
          href={`${etherScanAddr}/address/${address}`}
        >
          View on EtherScan
        </ExternalButtonLink>
      )}
      <DomainList address={address} />
    </AddressContainer>
  )
}
