import React from 'react'
import styled from 'react-emotion'
import Button from '../Forms/Button'

const DomainContainer = styled('div')`
  border-left: 3px solid
    ${p => {
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
          return 'red'
      }
    }};

  background: white;
  border-radius: 6px;
  height: 90px;
  display: flex;
  align-items: center;
`

const Domain = ({ domain, isSubDomain }) => (
  <DomainContainer state={domain.state}>
    {domain.name}
    {isSubDomain ? domain.price : ''}
    <Button href={`/name/${domain.name}`}>Details</Button>
  </DomainContainer>
)

export default Domain
