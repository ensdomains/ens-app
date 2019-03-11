import React from 'react'
import styled from 'react-emotion'
import mq from 'mediaQuery'
import EthVal from 'ethval'

const PriceContainer = styled('div')`
  width: 100%;
  ${mq.medium`
    width: auto
  `}
`

const Value = styled('div')`
  font-family: Overpass;
  font-weight: 100;
  font-size: 28px;
  color: #2b2b2b;
  border-bottom: 1px solid #dbdbdb;
`

const Description = styled('div')`
  font-family: Overpass;
  font-weight: 300;
  font-size: 14px;
  color: #adbbcd;
  margin-top: 10px;
`

const Price = ({ price }) => {
  return (
    <PriceContainer>
      <Value>{new EthVal(price).toEth().toFixed(12)} ETH</Value>
      <Description>Price per amount of time selected</Description>
    </PriceContainer>
  )
}

export default Price
