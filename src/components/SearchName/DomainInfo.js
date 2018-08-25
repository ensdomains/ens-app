import React, { Fragment } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { adopt } from 'react-adopt'
import Loader from '../Loader'
import DomainItem from '../Results/DomainItem'
import { GET_WEB3 } from '../../graphql/queries'
import { H2 } from '../Typography/Basic'

const GET_DOMAIN_STATE = gql`
  query getDomainState @client {
    domainState {
      name
      state
      owner
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
        accounts
      }) => {
        return (
          <Fragment>
            <H2>Domain Results</H2>
            {loading ? (
              <Fragment>
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
