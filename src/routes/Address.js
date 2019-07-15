import React from 'react'
import { Query } from 'react-apollo'
import { GET_DOMAINS_OWNED_BY_ADDRESS_FROM_SUBGRAPH } from '../graphql/queries'
import Domain from '../components/SearchName/Domain'

function Address({ address, domains }) {
  return (
    <div>
      {domains.map(domain => (
        <Domain name={domain.name} />
      ))}
    </div>
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
