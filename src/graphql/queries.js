import gql from 'graphql-tag'
import { NodesRecursive } from './fragments'

export const GET_NODES = gql`
  query nodes {
    nodes {
      ...NodesRecursive
    }
  }

  ${NodesRecursive}
`
