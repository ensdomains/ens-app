import React, { Component } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

const GET_ACCOUNTS = gql`
  query getAccounts @client {
    accounts
  }
`

class GetAccount extends Component {
  render() {
    return <div>QueryAccount.js was here</div>
    // return (
    //   <Query query={GET_ACCOUNTS}>
    //     {({ data, loading, error }) => {
    //       if (loading || !data || !data.web3) {
    //         return this.props.children({
    //           account: '0x0000000000000000000000000000000000000000'
    //         })
    //       }
    //       const { web3: { accounts } = { accounts: [] } } = data
    //       return this.props.children({ account: accounts[0] })
    //     }}
    //   </Query>
    // )
  }
}

export function useAccount() {
  const {
    data: { accounts }
  } = useQuery(GET_ACCOUNTS)
  if (!accounts) {
    return '0x0000000000000000000000000000000000000000'
  }
  return accounts[0]
}

export default GetAccount
