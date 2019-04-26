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
  font-size: 22px;
  color: #2b2b2b;
  border-bottom: 1px solid #dbdbdb;
  ${mq.small`
    font-size: 28px;
  `}
`

const Description = styled('div')`
  font-family: Overpass;
  font-weight: 300;
  font-size: 14px;
  color: #adbbcd;
  margin-top: 10px;
`

const USD = styled('span')`
  font-size: 22px;
  color: #adbbcd;
  margin-left: 20px;
  ${mq.small`
    font-size: 28px;
  `}
`

const Price = ({ price, ethUsdPrice, ethUsdPriceLoading }) => {
  const ethVal = new EthVal(price).toEth()
  return (
    <PriceContainer>
      <Value>
        {ethVal.toFixed(3)} ETH
        {!ethUsdPriceLoading && (
          <USD>${ethVal.mul(ethUsdPrice).toFixed(2)} USD</USD>
        )}
      </Value>
      <Description>Total price to pay</Description>
    </PriceContainer>
  )
}

export default Price
