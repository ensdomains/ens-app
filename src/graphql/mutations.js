import gql from 'graphql-tag'

export const GET_SUBDOMAINS = gql`
  mutation getSubdomains($name: String) {
    getSubdomains(name: $name) @client {
      name
      owner
      resolver
    }
  }
`

export const BID = gql`
  mutation bid($name: String, $amount: Int, $maskAmount: Int) {
    bid(name: $name) @client {
      name
    }
  }
`
