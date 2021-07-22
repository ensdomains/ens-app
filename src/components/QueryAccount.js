import React, { Component } from 'react'
import { Query } from '@apollo/client/react/components'
import { useQuery } from '@apollo/client'
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
          if (loading || !data || !data.web3) {
            return this.props.children({
              account: '0x0000000000000000000000000000000000000000'
            })
          }
          const { web3: { accounts } = { accounts: [] } } = data
          return this.props.children({ account: accounts[0] })
        }}
      </Query>
    )
  }
}

export function useAccount() {
  const { loading, error, data } = useQuery(GET_ACCOUNTS)
  if (loading || !data || !data.web3) {
    return '0x0000000000000000000000000000000000000000'
  }
  const { web3: { accounts } = { accounts: [] } } = data
  return accounts[0]
}

export default GetAccount
