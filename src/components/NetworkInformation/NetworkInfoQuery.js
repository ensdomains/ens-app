import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Loader from '../Loader'

export const GET_WEB3 = gql`
  query web3 {
    web3 @client {
      accounts
      network
    }
  }
`

class NetworkInfoQuery extends Component {
  render() {
    return (
      <Query query={GET_WEB3}>
        {({ data, loading, error }) => {
          if (loading) return <Loader />
          const {
            web3: { accounts, network }
          } = data
          return this.props.children({ accounts, network })
        }}
      </Query>
    )
  }
}
export default NetworkInfoQuery
