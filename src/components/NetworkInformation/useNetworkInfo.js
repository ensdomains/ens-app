import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'

export const GET_WEB3 = gql`
  query web3 {
    web3 @client {
      accounts
      network
    }
  }
`

const useNetworkInfo = () => {
  const { data, loading, error } = useQuery(GET_WEB3)

  if (loading) {
    return {
      accounts: undefined,
      network: undefined,
      loading,
      error
    }
  }

  const {
    web3: { accounts, network }
  } = data
  return { accounts, network, loading, error }
}

export default useNetworkInfo
