import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'

export const GET_WEB3 = gql`
  query web3 {
    web3 @client {
      accounts
      networkId
      network
    }
  }
`

const useNetworkInfo = () => {
  const { data, loading, error, refetch } = useQuery(GET_WEB3)

  if (loading) {
    return {
      accounts: undefined,
      network: undefined,
      networkId: undefined,
      loading,
      refetch,
      error
    }
  }
  const {
    web3: { accounts, network, networkId }
  } = data
  return { accounts, network, networkId, loading, error, refetch }
}

export default useNetworkInfo
