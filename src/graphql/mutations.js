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
  mutation bid(
    $name: String
    $bidAmount: Int
    $decoyBidAmount: Int
    $secret: String
  ) {
    bid(
      name: $name
      bidAmount: $bidAmount
      decoyBidAmount: $decoyBidAmount
      secret: $secret
    ) @client {
      id
    }
  }
`

export const START_AND_BID = gql`
  mutation startAuctionAndBid(
    $name: String
    $bidAmount: Int
    $decoyBidAmount: Int
    $secret: String
  ) {
    startAuctionAndBid(
      name: $name
      bidAmount: $bidAmount
      decoyBidAmount: $decoyBidAmount
      secret: $secret
    ) @client {
      id
    }
  }
`

export const SET_RESOLVER = gql`
  mutation setResolver($name: String, $resolverAddress: String) {
    setResolver(name: $name, resolverAddress: $resolverAddress)
  }
`

export const SET_OWNER = gql`
  mutation setOwner($name: String, $ownerAddress: String) {
    setResolver(name: $name, ownerAddress: $ownerAddress)
  }
`

export const SET_ADDRESS = gql`
  mutation setAddress($name: String, $address: String) {
    setAddress(name: $name, address: $address)
  }
`

export const SET_CONTENT = gql`
  mutation setAddress($name: String, $content: String) {
    setAddress(name: $name, content: $content)
  }
`
