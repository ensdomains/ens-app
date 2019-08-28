import React from 'react'
import styled from '@emotion/styled'
import { useQuery } from 'react-apollo'

import { GET_DOMAINS_OWNED_BY_ADDRESS_FROM_SUBGRAPH } from '../../graphql/queries'
import DomainItem from '../DomainItem/ChildDomainItem'
import { decryptName } from '../../api/labels'
import AddressContainer from '../Basic/MainContainer'
import TopBar from '../Basic/TopBar'
import { Title } from '../Typography/Basic'

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
  return domains.filter(domain => domain.parent.name !== 'addr.reverse')
}

function DomainList({ domains, address }) {
  const { loading, data, error } = useQuery(
    GET_DOMAINS_OWNED_BY_ADDRESS_FROM_SUBGRAPH,
    { variables: { id: address } }
  )

  if (error) {
    return 'Error getting domains'
  }

  if (loading) {
    return null
  }

  if (hasNoDomains(data)) {
    return (
      <NoDomainsContainer>
        <h2>This address does not own any domains</h2>
      </NoDomainsContainer>
    )
  }

  return (
    <DomainsContainer>
      {filterOutReverse(data.account.domains).map(domain => (
        <DomainItem name={decryptName(domain.name)} owner={address} />
      ))}
    </DomainsContainer>
  )
}

export default function Address({ address }) {
  return (
    <AddressContainer>
      <TopBar>
        <Title>{address}</Title>
      </TopBar>
      <DomainList address={address} />
    </AddressContainer>
  )
}
