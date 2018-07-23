import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Loader from '../Loader'
import {
  Open,
  Auction,
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
      owner
    }

    web3 {
      accounts
    }
  }
`

// const GET_ACCOUNTS = gql`
//   query getDomainState {
//     web3 {
//       accounts
//     }
//   }
// `

export const DomainInfo = ({ domainState }) => {
  if (!domainState) return null
  switch (domainState.state) {
    case 'Open':
      return <Open domainState={domainState} />
    case 'Auction':
      return <Auction domainState={domainState} />
    case 'Owned':
      return <Owned domainState={domainState} />
    case 'Forbidden':
      return <Forbidden domainState={domainState} />
    case 'Reveal':
      return <Reveal domainState={domainState} />
    case 'NotYetAvailable':
      return <NotYetAvailable domainState={domainState} />
    default:
      throw new Error('Unrecognised domainState')
  }
}

const DomainInfoContainer = () => {
  return (
    <Query query={GET_DOMAIN_STATE}>
      {({ data: { domainState, web3 }, loading }) => {
        if (loading) return <Loader />
        console.log(web3)
        return <DomainInfo domainState={domainState} web3={web3} />
      }}
    </Query>
  )
}

export default DomainInfoContainer
