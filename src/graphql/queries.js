import gql from 'graphql-tag'
import { NodesRecursive, NodeFields } from './fragments'

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

export const GET_SINGLE_NAME = gql`
  query singleName($name: String) @client {
    singleName(name: $name) {
      ...NodeFields
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
