import React from 'react'
import styled from 'react-emotion'
import Button from '../Forms/Button'

const DomainContainer = styled('div')`
  background: ${p => {
    switch (p.state) {
      case 'Open':
        return 'green'
      case 'Auction':
        return 'blue'
      case 'Owned':
        return 'red'
      case 'Forbidden':
        return 'black'
      case 'Reveal':
        return 'blue'
      case 'NotYetAvailable':
        return 'red'
      default:
        throw new Error('Unrecognised domainState')
    }
  }};
`

const Domain = ({ domain, isSubDomain }) => (
  <DomainContainer state={domain.state}>
    {domain.name}
    {isSubDomain ? domain.price : ''}
    <Button>Details</Button>
  </DomainContainer>
)

export default Domain
