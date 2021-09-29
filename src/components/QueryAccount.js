import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

const GET_ACCOUNTS = gql`
  query getAccounts @client {
    accounts
  }
`

export function useAccount() {
  const {
    data: { accounts }
  } = useQuery(GET_ACCOUNTS)
  if (!accounts) {
    return '0x0000000000000000000000000000000000000000'
  }
  return accounts[0]
}
