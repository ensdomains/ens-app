import gql from 'graphql-tag'

export const NodeFields = gql`
  fragment NodeFields on Node {
    name
    decrypted
    parent
    parentOwner
    owner
    label
    resolver
    addr
    content
    contentType
  }
`

export const SubDomainStateFields = gql`
  fragment SubDomainStateFields on SubDomain {
    label
    domain
    name
    owner
    price
    rent
    referralFeePPM
    available
    state
  }
`
