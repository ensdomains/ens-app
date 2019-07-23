import React from 'react'
import styled from '@emotion/styled'
import { Query } from 'react-apollo'
import { GET_DOMAINS_OWNED_BY_ADDRESS_FROM_SUBGRAPH } from '../graphql/queries'
import Domain from '../components/SearchName/Domain'

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

function Address({ address, domains }) {
  return (
    <div>
      {domains.map(domain => (
        <Domain name={domain.name} />
      ))}
    </div>
  )
}

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

const AddressContainer = ({ match }) => {
  return (
    <Query
      query={GET_DOMAINS_OWNED_BY_ADDRESS_FROM_SUBGRAPH}
      variables={{ id: match.params.address }}
    >
      {({ data, loading }) => {
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
        console.log(data)
        return (
          <Address
            address={match.params.address}
            domains={filterOutReverse(data.account.domains)}
          />
        )
      }}
    </Query>
  )
}

export default AddressContainer
