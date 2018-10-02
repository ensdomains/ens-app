import gql from 'graphql-tag'
import { NodesRecursive, NodeFields, SubDomainStateFields } from './fragments'

export const GET_WEB3 = gql`
  query web3 {
    web3 @client {
      accounts
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
      value
      highestBid
      state
      price
      rent
      referralFeePPM
      available
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
