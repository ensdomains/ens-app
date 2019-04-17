import React from 'react'
import styled from '@emotion/styled'
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

const USD = styled('span')`
  color: #adbbcd;
  margin-left: 20px;
`

const Price = ({ price, ethUsdPrice, ethUsdPriceLoading }) => {
  const ethVal = new EthVal(price).toEth()
  return (
    <PriceContainer>
      <Value>
        {ethVal.toFixed(5)} ETH
        {!ethUsdPriceLoading && (
          <USD>${ethVal.mul(ethUsdPrice).toFixed(2)} USD</USD>
        )}
      </Value>
      <Description>Total price to pay</Description>
    </PriceContainer>
  )
}

export default Price
