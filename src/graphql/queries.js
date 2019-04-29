import gql from 'graphql-tag'
import { NodesRecursive, NodeFields, SubDomainStateFields } from './fragments'

export const GET_WEB3 = gql`
  query web3 {
    web3 @client {
      accounts
      isReadOnly
    }
  }
`

export const GET_PUBLIC_RESOLVER = gql`
  query getPublicResolver {
    publicResolver @client {
      address
    }
  }
`

export const GET_NODES = gql`
  query nodes {
    nodes {
      ...NodesRecursive
    }
  }

  ${NodesRecursive}
`

export const GET_ALL_NODES = gql`
  query names {
    names {
      ...NodeFields
      revealDate
      registrationDate
      value
      highestBid
      state
      migrationStartDate
    }
  }

  ${NodeFields}
`

export const GET_SINGLE_NAME = gql`
  query singleName($name: String) @client {
    singleName(name: $name) {
      ...NodeFields
      revealDate
      registrationDate
      migrationStartDate
      currentBlockDate
      transferEndDate
      value
      highestBid
      state
      price
      rent
      referralFeePPM
      available
      expiryTime
      deedOwner
      registrant
      isNewRegistrar
    }
  }

  ${NodeFields}
`

export const GET_SUBDOMAINS = gql`
  query getSubDomains($name: String) @client {
    getSubDomains(name: $name) {
      subDomains
    }
  }
`

export const GET_TRANSACTION_HISTORY = gql`
  query getTransactionHistory @client {
    transactionHistory {
      txHash
      txState
      createdAt
    }
  }
`

export const GET_FAVOURITES = gql`
  query getFavourites {
    favourites @client {
      name
    }
  }
`

export const GET_SUBDOMAIN_FAVOURITES = gql`
  query getSubDomainFavourites {
    subDomainFavourites @client {
      name
    }
  }

  ${SubDomainStateFields}
`

export const GET_DOMAIN_STATE = gql`
  query getDomainState @client {
    domainState {
      name
      revealDate
      registrationDate
      value
      highestBid
      state
      owner
    }
  }
`

export const GET_DOMAIN_STATE_SINGLE = gql`
  query getDomainStateSingle($name: String) @client {
    domainStateSingle(name: $name) {
      name
      revealDate
      registrationDate
      value
      highestBid
      state
      owner
    }
  }
`

export const GET_ERRORS = gql`
  query getErrors @client {
    error {
      message
    }
  }
`

/* Permanent Registrar */

export const GET_RENT_PRICE = gql`
  query getRentPrice($name: String, $duration: Number) @client {
    getRentPrice(name: $name, duration: $duration)
  }
`

export const GET_MINIMUM_COMMITMENT_AGE = gql`
  query getMinimumCommitmentAge @client {
    getMinimumCommitmentAge
  }
`
