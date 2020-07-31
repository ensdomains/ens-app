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
  console.log('****useNetworkInfo1')
  const { data, loading, error, refetch } = useQuery(GET_WEB3)
  console.log('****useNetworkInfo2', data)
  if (loading) {
    return {
      accounts: undefined,
      network: undefined,
      networkId: undefined,
      loading,
      error,
      refetch
    }
  }
  const {
    web3: { accounts, network, networkId }
  } = data
  return { accounts, network, networkId, loading, error, refetch }
}

export default useNetworkInfo
