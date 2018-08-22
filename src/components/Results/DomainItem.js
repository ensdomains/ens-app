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

const RightContainer = styled('div')`
  display: flex;
  align-items: center;
`

const Heart = styled(HeartDefault)`
  margin-right: 20px;
`

const DomainName = styled('h2')`
  font-size: 28px;
  font-weight: 200;
  color: ${p => {
    switch (p.state) {
      case 'Unavailable':
        return '#CCD4DA'
      default:
        return '#2b2b2b'
    }
  }};
`

const Price = styled('span')`
  margin-right: 20px;
  font-size: 28px;
  font-weight: 100;
`

const Domain = ({ domain, isSubdomain, className }) => (
  <DomainContainer state={domain.state} className={className}>
    <DomainName state={domain.state}>{domain.name}</DomainName>
    <RightContainer>
      <Label state={domain.state} />
      {isSubdomain ? (
        <Price>{domain.price > 0 ? `${domain.price} ETH` : 'Free'}</Price>
      ) : (
        ''
      )}
      <Heart />
      <Button primary href={`/name/${domain.name}`}>
        Details
      </Button>
    </RightContainer>
  </DomainContainer>
)

export default Domain
