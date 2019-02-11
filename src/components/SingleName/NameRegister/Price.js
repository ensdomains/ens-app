import React from 'react'
import styled from 'react-emotion'

const PriceContainer = styled('div')``

const Price = ({ pricePerYear, years }) => (
  <PriceContainer>{pricePerYear * years} ETH</PriceContainer>
)

export default Price
