import gql from 'graphql-tag'
import { NodeFields, SubDomainStateFields } from './fragments'

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

export const GET_ALL_NODES = gql`
  query names {
    names @client {
      ...NodeFields
    }
  }

  ${NodeFields}
`

export const GET_OWNER = gql`
  query getOwner($name: String) {
    getOwner(name: $name) @client
  }
`

export const GET_TEXT = gql`
  query getText($name: String, $key: String) {
    getText(name: $name, key: $key) @client
  }
`

export const GET_ADDR = gql`
  query getAddr($name: String, $key: String) {
    getAddr(name: $name, key: $key) @client
  }
`

export const GET_SINGLE_NAME = gql`
  query singleName($name: String) {
    singleName(name: $name) @client {
      ...NodeFields
      revealDate
      registrationDate
      migrationStartDate
      currentBlockDate
      transferEndDate
      gracePeriodEndDate
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
      isDNSRegistrar
      dnsOwner
    }
  }

  ${NodeFields}
`

export const GET_SUBDOMAINS = gql`
  query getSubDomains($name: String!) @client {
    getSubDomains(name: $name) @client {
      subDomains
    }
  }
`

export const GET_SUBDOMAINS_FROM_SUBGRAPH = gql`
  query getSubdomains($id: ID!) {
    domain(id: $id) {
      id
      labelName
      subdomains {
        id
        labelName
        labelhash
        name
        owner {
          id
        }
      }
    }
  }
`

export const GET_TRANSACTION_HISTORY = gql`
  query getTransactionHistory {
    transactionHistory @client {
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

export const GET_ERRORS = gql`
  query getErrors @client {
    error {
      message
    }
  }
`

/* Subgraph only queries */

export const GET_DOMAINS_OWNED_BY_ADDRESS_FROM_SUBGRAPH = gql`
  query getDomains($id: ID!) {
    account(id: $id) {
      domains {
        labelName
        name
        parent {
          name
        }
      }
    }
  }
`

/* Permanent Registrar */

export const GET_RENT_PRICE = gql`
  query getRentPrice($name: String, $duration: Number) {
    getRentPrice(name: $name, duration: $duration) @client
  }
`

export const GET_MINIMUM_COMMITMENT_AGE = gql`
  query getMinimumCommitmentAge {
    getMinimumCommitmentAge @client
  }
`
