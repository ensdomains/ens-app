import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { adopt } from 'react-adopt'
import Loader from '../Loader'
import { GET_WEB3 } from '../../graphql/queries'
import {
  Open,
  Auction,
  Owned,
  Forbidden,
  Reveal,
  NotYetAvailable
} from './DomainInfoStates'

const GET_DOMAIN_STATE = gql`
  query getDomainState @client {
    domainState {
      name
      state
      owner
    }
  }
`

const getDomainStateComponent = (domainState, accounts) => {
  switch (domainState.state) {
    case 'Open':
      return <Open domainState={domainState} />
    case 'Auction':
      return <Auction domainState={domainState} />
    case 'Owned':
      return <Owned domainState={domainState} accounts={accounts} />
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

export const DomainInfo = ({ domainState, accounts }) => {
  if (!domainState) return null

  const DomainState = getDomainStateComponent(domainState, accounts)

  return (
    <div>
      <h2>Top Level Domains</h2>
      {DomainState}
    </div>
  )
}

const Composed = adopt({
  domainState: <Query query={GET_DOMAIN_STATE} />,
  accounts: <Query query={GET_WEB3} pollInterval={100} />
})

const DomainInfoContainer = () => {
  return (
    <Composed>
      {({
        domainState: {
          data: { domainState },
          loading
        },
        accounts: { data, loading2 }
      }) => {
        if (loading && loading2) return <Loader />
        return (
          <DomainInfo domainState={domainState} accounts={data.web3.accounts} />
        )
      }}
    </Composed>
  )
}

export default DomainInfoContainer
