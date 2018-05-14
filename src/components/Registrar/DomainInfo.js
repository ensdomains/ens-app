import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const GET_DOMAIN_STATE = gql`
  query getDomainState {
    domainState {
      name
      state
    }
  }
`

export const DomainInfo = ({ domainState }) => {
  if (!domainState) return null
  console.log(domainState)
  return (
    <div>
      {domainState.name} - {domainState.state}
    </div>
  )
}

const DomainInfoContainer = ({}) => {
  return (
    <Query query={GET_DOMAIN_STATE}>
      {({ data: { domainState }, loading }) => (
        <DomainInfo domainState={domainState} />
      )}
    </Query>
  )
}

export default DomainInfoContainer
