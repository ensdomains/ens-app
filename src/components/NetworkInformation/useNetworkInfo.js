import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'

export const GET_WEB3 = gql`
  query web3 {
    web3 @client {
      accounts
      networkId
      network
      isReadOnly
    }
  }
`

const useNetworkInfo = () => {
  const { data, loading, error, refetch } = useQuery(GET_WEB3)
  if (loading || !data || !data.web3) {
    return {
      accounts: undefined,
      network: undefined,
      networkId: undefined,
      loading,
      error
    }
  }
  const {
    web3: { accounts, network, networkId, isReadOnly }
  } = data
  return {
    accounts: isReadOnly ? [] : accounts,
    network,
    networkId,
    loading,
    refetch,
    error,
    isReadOnly
  }
}

export default useNetworkInfo
