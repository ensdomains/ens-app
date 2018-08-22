import React from 'react'
import styled from 'react-emotion'
import Button from '../Forms/Button'
import HeartDefault from '../Icons/Heart'

const DomainContainer = styled('div')`
  &:before {
    content: '';
    background: ${p => {
      switch (p.state) {
        case 'Open':
          return '#42E068'
        case 'Auction':
          return 'blue'
        case 'Owned':
          return '#CACACA'
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
    width: 4px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
  padding: 20px;
  overflow: hidden;
  position: relative;

  background: white;
  border-radius: 6px;
  height: 90px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 22px;
`

const Actions = styled('div')`
  display: flex;
  align-items: center;
`

const Heart = styled(HeartDefault)`
  margin-right: 20px;
`

const DomainName = styled('h2')`
  font-size: 22px;
  font-weight: 300;
`

const Domain = ({ domain, isSubDomain, className }) => (
  <DomainContainer state={domain.state} className={className}>
    <DomainName>{domain.name}</DomainName>
    {isSubDomain ? domain.price : ''}
    <Actions>
      <Heart />
      <Button primary href={`/name/${domain.name}`}>
        Details
      </Button>
    </Actions>
  </DomainContainer>
)

export default Domain
