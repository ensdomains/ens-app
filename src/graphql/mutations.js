import { gql } from '@apollo/client'

export const REGISTER_TESTDOMAIN = gql`
  mutation registerTestdomain($label: String) {
    registerTestdomain(label: $label)
  }
`

export const SET_ERROR = gql`
  mutation setError($message: String) {
    setError(message: $message) {
      message
    }
  }
`

export const GET_SUBDOMAINS = gql`
  mutation getSubdomains($name: String) {
    getSubdomains(name: $name) {
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
    ) {
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
    ) {
      id
    }
  }
`

export const SET_RESOLVER = gql`
  mutation setResolver($name: String, $address: String) {
    setResolver(name: $name, address: $address)
  }
`

export const SET_OWNER = gql`
  mutation setOwner($name: String, $address: String) {
    setOwner(name: $name, address: $address)
  }
`

export const SET_SUBNODE_OWNER = gql`
  mutation setSubnodeOwner($name: String, $address: String) {
    setSubnodeOwner(name: $name, address: $address)
  }
`

export const CREATE_SUBDOMAIN = gql`
  mutation createSubdomain($name: String) {
    createSubdomain(name: $name)
  }
`

export const DELETE_SUBDOMAIN = gql`
  mutation deleteSubdomain($name: String) {
    deleteSubdomain(name: $name)
  }
`

/* Resolver Mutations */

export const SET_NAME = gql`
  mutation setName($name: String) {
    setName(name: $name)
  }
`

export const SET_ADDRESS = gql`
  mutation setAddress($name: String, $recordValue: String) {
    setAddress(name: $name, recordValue: $recordValue)
  }
`

export const SET_CONTENT = gql`
  mutation setContent($name: String, $recordValue: String) {
    setContent(name: $name, recordValue: $recordValue)
  }
`
export const SET_CONTENTHASH = gql`
  mutation setContenthash($name: String, $recordValue: String) {
    setContenthash(name: $name, recordValue: $recordValue)
  }
`

export const SET_TEXT = gql`
  mutation setText($name: String, $key: String, $recordValue: String) {
    setText(name: $name, key: $key, recordValue: $recordValue)
  }
`

export const SET_ADDR = gql`
  mutation setAddr($name: String, $key: String, $recordValue: String) {
    setAddr(name: $name, key: $key, recordValue: $recordValue)
  }
`

export const MIGRATE_RESOLVER = gql`
  mutation migrateResolver($name: String) {
    migrateResolver(name: $name)
  }
`

export const ADD_MULTI_RECORDS = gql`
  mutation addMultiRecords($name: String, $records: Records) {
    addMultiRecords(name: $name, records: $records)
  }
`

/* Registrar Mutations */

export const SET_REGISTRANT = gql`
  mutation setRegistrant($name: String, $address: String) {
    setRegistrant(name: $name, address: $address)
  }
`

export const RECLAIM = gql`
  mutation reclaim($name: String, $address: String) {
    reclaim(name: $name, address: $address)
  }
`

export const COMMIT = gql`
  mutation commit($label: String, $secret: String) {
    commit(label: $label, secret: $secret)
  }
`

export const REGISTER = gql`
  mutation register($label: String, $duration: Int, $secret: String) {
    register(label: $label, duration: $duration, secret: $secret)
  }
`

export const RENEW = gql`
  mutation renew($label: String, $duration: Int) {
    renew(label: $label, duration: $duration)
  }
`

export const SUBMIT_PROOF = gql`
  mutation submitProof($name: String, $parentOwner: String) {
    submitProof(name: $name, parentOwner: $parentOwner)
  }
`

export const RENEW_DOMAINS = gql`
  mutation renewDomains($labels: [String], $duration: Int) {
    renewDomains(labels: $labels, duration: $duration)
  }
`

/* Registry Migration */

export const MIGRATE_REGISTRY = gql`
  mutation migrateRegistry($name: String, $address: String) {
    migrateRegistry(name: $name, address: $address)
  }
`
