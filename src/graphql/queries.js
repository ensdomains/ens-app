import gql from 'graphql-tag'
import { NodesRecursive, NodeFields } from './fragments'

export const GET_NODES = gql`
  query nodes {
    nodes {
      ...NodesRecursive
    }
  }

  ${NodesRecursive}
`

export const GET_SINGLE_NODE = gql`
  query singleNode($name: String) @client {
    singleNode(name: $name) {
      #...NodeFields
      name
      owner
    }
  }

  ${NodeFields}
`
