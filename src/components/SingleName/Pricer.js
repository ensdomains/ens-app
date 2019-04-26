import React from 'react'
import styled from '@emotion/styled'
import { Query } from 'react-apollo'

import { GET_RENT_PRICE } from 'graphql/queries'

import Years from './NameRegister/Years'
import Price from './NameRegister/Price'

import mq from 'mediaQuery'

import { ReactComponent as ChainDefault } from '../Icons/chain.svg'

const PricingContainer = styled('div')`
  display: grid;
  grid-template-columns: 1fr;
  margin-bottom: 20px;
  ${mq.medium`
    grid-template-columns:
      minmax(min-content, 200px) minmax(min-content, min-content)
      minmax(200px, 1fr);
  `}
`
const Chain = styled(ChainDefault)`
  display: none;

  ${mq.medium`
    display: block;
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
  `}
`

export default function Pricer({
  years,
  setYears,
  duration,
  ethUsdPriceLoading,
  ethUsdPrice,
  name,
  className
}) {
  return (
    <Query
      query={GET_RENT_PRICE}
      variables={{
        name,
        duration
      }}
    >
      {({ data, loading }) => {
        return (
          <PricingContainer className={className}>
            <Years years={years} setYears={setYears} />
            <Chain />
            <Price
              price={loading ? 0 : data.getRentPrice}
              ethUsdPriceLoading={ethUsdPriceLoading}
              ethUsdPrice={ethUsdPrice}
            />
          </PricingContainer>
        )
      }}
    </Query>
  )
}
