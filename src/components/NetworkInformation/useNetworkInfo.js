import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

export const GET_WEB3 = gql`
  query web3 @client {
    accounts
    networkId
    network
    isReadOnly
    isSafeApp
  }
`

const useNetworkInfo = () => {
  const { data, loading, error, refetch } = useQuery(GET_WEB3)
  if (!data) {
    return {
      accounts: undefined,
      network: undefined,
      networkId: undefined,
      loading,
      error
    }
  }
  const { accounts, network, networkId, isReadOnly, isSafeApp } = data
  return {
    accounts: isReadOnly ? [] : accounts,
    network,
    networkId,
    loading,
    refetch,
    error,
    isReadOnly,
    isSafeApp
  }
}

export default useNetworkInfo
