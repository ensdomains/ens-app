import gql from 'graphql-tag'

export const NodeFields = gql`
  fragment NodeFields on Node {
    name
    owner
    label
    resolver
    addr
    content
  }
`

export const SubDomainStateFields = gql`
  fragment SubDomainStateFields on SubDomain {
    label
    domain
    price
    rent
    referralFeePPM
    available
  }
`

export const SubDomainStateFieldsFavourite = gql`
  fragment SubDomainStateFieldsFavourite on SubDomain {
    name
    price
    state
  }
`

export const NodesRecursive = gql`
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
