import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Loader from '../Loader'

export const GET_WC_STATE = gql`
  query web3 {
    web3 @client {
      accounts
      network
      networkId
      isWalletConnect
      isWalletConnectConnected
    }
  }
`

const WCstateQuery = ({ noLoader, children }) => (
  <Query query={GET_WC_STATE}>
    {({ data, loading, error, refetch }) => {
      console.log('data', data);
      if (loading) return noLoader ? '' : <Loader />
      const {
        web3: { isWalletConnect, isWalletConnectConnected }
      } = data
      return children({ isWalletConnect, isWalletConnectConnected, refetch })
    }}
  </Query>
)

export default WCstateQuery
