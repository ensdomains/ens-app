import gql from 'graphql-tag'

export const REGISTER_TESTDOMAIN = gql`
  mutation registerTestdomain($label: String) {
    registerTestdomain(label: $label) @client
  }
`

export const SET_ERROR = gql`
  mutation setError($message: String) {
    setError(message: $message) @client {
      message
    }
  }
`

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
  mutation setResolver($name: String, $address: String) {
    setResolver(name: $name, address: $address) @client
  }
`

export const SET_OWNER = gql`
  mutation setOwner($name: String, $address: String) {
    setOwner(name: $name, address: $address) @client
  }
`

export const SET_SUBNODE_OWNER = gql`
  mutation setSubnodeOwner($name: String, $address: String) {
    setSubnodeOwner(name: $name, address: $address) @client
  }
`

export const SET_NAME = gql`
  mutation setName($name: String) {
    setName(name: $name) @client
  }
`

export const SET_ADDRESS = gql`
  mutation setAddress($name: String, $recordValue: String) {
    setAddress(name: $name, recordValue: $recordValue) @client
  }
`

export const SET_CONTENT = gql`
  mutation setContent($name: String, $recordValue: String) {
    setContent(name: $name, recordValue: $recordValue) @client
  }
`
export const SET_CONTENTHASH = gql`
  mutation setContenthash($name: String, $recordValue: String) {
    setContenthash(name: $name, recordValue: $recordValue) @client
  }
`

export const CREATE_SUBDOMAIN = gql`
  mutation createSubdomain($name: String) {
    createSubdomain(name: $name) @client
  }
`

/* Registrar Mutations */

export const SET_REGISTRANT = gql`
  mutation setRegistrant($name: String, $address: String) {
    setRegistrant(name: $name, address: $address) @client
  }
`

export const RECLAIM = gql`
  mutation reclaim($name: String, $address: String) {
    reclaim(name: $name, address: $address) @client
  }
`

export const COMMIT = gql`
  mutation commit($label: String) {
    commit(label: $label) @client
  }
`

export const REGISTER = gql`
  mutation register($label: String, $duration: Int) {
    register(label: $label, duration: $duration) @client
  }
`

export const RENEW = gql`
  mutation renew($label: String, $duration: Int) {
    renew(label: $label, duration: $duration) @client
  }
`

export const TRANSFER_REGISTRARS = gql`
  mutation transferRegistrars($label: String) {
    transferRegistrars(label: $label) @client
  }
`

export const RELEASE_DEED = gql`
  mutation releaseDeed($hash: String) {
    releaseDeed(label: $label) @client
  }
`

export const SUBMIT_PROOF = gql`
  mutation submitProof($name: String, $parentOwner: String) {
    submitProof(name: $name, parentOwner: $parentOwner) @client
  }
`
