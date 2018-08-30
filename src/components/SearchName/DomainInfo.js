import React, { Fragment } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { adopt } from 'react-adopt'
import Loader from '../Loader'
import DomainItem from '../DomainItem/DomainItem'
import { GET_WEB3 } from '../../graphql/queries'
import { H2 } from '../Typography/Basic'

const GET_DOMAIN_STATE = gql`
  query getDomainState @client {
    domainState {
      name
      revealDate
      registrationDate
      value
      highestBid
      state
      owner
    }

    web3 {
      accounts
    }
  }
`

export const DomainInfo = ({ domainState, accounts }) => {
  if (!domainState) return null

  return (
    <div>
      <DomainItem domain={domainState} />
    </div>
  )
}

const Composed = adopt({
  domainState: <Query query={GET_DOMAIN_STATE} fetchPolicy="no-cache" />,
  accounts: <Query query={GET_WEB3} />
})

const DomainInfoContainer = () => {
  return (
    <Composed>
      {({
        domainState: {
          data: { domainState, web3 },
          loading
        }
      }) => {
        return (
          <Fragment>
            <H2>Top Level Domains</H2>
            {loading ? (
              <Fragment>
                {console.log(web3)}
                <Loader />
              </Fragment>
            ) : (
              <DomainInfo domainState={domainState} />
            )}
          </Fragment>
        )
      }}
    </Composed>
  )
}

export default DomainInfoContainer
