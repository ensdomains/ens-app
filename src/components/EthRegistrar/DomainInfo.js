import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import {
  Open,
  Owned,
  Forbidden,
  Reveal,
  NotYetAvailable
} from './DomainInfoStates'

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
  console.log(domainState.state)
  switch (domainState.state) {
    case 'Open':
      return <Open domainState={domainState} />
    case 'Owned':
      return <Owned domainState={domainState} />
    case 'Forbidden':
      return <Forbidden domainState={domainState} />
    case 'Reveal':
      return <Reveal domainState={domainState} />
    case 'NotYetAvailable':
      return <NotYetAvailable domainState={domainState} />
  }
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
