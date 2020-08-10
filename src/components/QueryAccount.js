import React, { Component } from 'react'
import { Query, useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { EMPTY_ADDRESS } from '../utils/records'

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
          if (loading || !data)
            return this.props.children({ account: EMPTY_ADDRESS })
          const { web3: { accounts } = {} } = data
          if (!accounts[0])
            return this.props.children({ account: EMPTY_ADDRESS })
          return this.props.children({ account: accounts[0] })
        }}
      </Query>
    )
  }
}

export function useAccount() {
  const { loading, error, data } = useQuery(GET_ACCOUNTS)
  if (!data || loading) return EMPTY_ADDRESS
  const { web3: { accounts } = {} } = data
  if (!accounts[0]) return EMPTY_ADDRESS
  return accounts[0]
}

export default GetAccount
