import gql from 'graphql-tag'

const NodeFields = gql`
  fragment NodeFields on Node {
    name
    owner
    label
    resolver
    addr
    content
  }
`

const SubDomainStateFields = gql`
  fragment SubDomainStateFields on SubDomainState {
    label
    domain
    price
    rent
    referralFeePPM
    available
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

export { NodesRecursive, NodeFields, SubDomainStateFields }
