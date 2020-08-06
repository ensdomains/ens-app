import React, { Component } from 'react'
import { Query, useQuery } from 'react-apollo'
import gql from 'graphql-tag'

const GET_ACCOUNTS = gql`
  query getAccounts @client {
    web3 {
      accounts
    }
  }
`

class GetAccount extends Component {
  render() {
    return (
      <Query query={GET_ACCOUNTS}>
        {({ data, loading, error }) => {
          const {
            web3: { accounts }
          } = data
          if (loading || !accounts[0]) {
            return this.props.children({
              account: '0x0000000000000000000000000000000000000000'
            })
          }
          return this.props.children({ account: accounts[0] })
        }}
      </Query>
    )
  }
}

export function useAccount() {
  const { loading, error, data } = useQuery(GET_ACCOUNTS)
  const { web3: { accounts } = {} } = data
  if (error || loading || !accounts[0]) {
    return '0x0000000000000000000000000000000000000000'
  }
  return accounts[0]
}

export default GetAccount
