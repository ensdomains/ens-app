import gql from 'graphql-tag'

const NodeFields = gql`
  fragment NodeFields on Node {
    name
    owner
    label
    resolver
    # addr
    # content
  }
`
const NodesRecursive = gql`
  fragment NodesRecursive on Node {
    ...NodeFields
    nodes {
      ...NodeFields
      nodes {
        ...NodeFields
        nodes {
          ...NodeFields
          nodes {
            ...NodeFields
          }
        }
      }
    }
  }

  ${NodeFields}
`

export { NodesRecursive, NodeFields }
