import React from 'react'
import styled from '@emotion/styled/macro'

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

function PricerInner({
  years,
  setYears,
  duration,
  ethUsdPriceLoading,
  ethUsdPrice,
  className,
  loading,
  price,
  reference
}) {
  return (
    <PricingContainer className={className} ref={reference}>
      <Years years={years} setYears={setYears} />
      <Chain />
      <Price
        price={price}
        loading={loading}
        ethUsdPriceLoading={ethUsdPriceLoading}
        ethUsdPrice={ethUsdPrice}
      />
    </PricingContainer>
  )
}

export const PricerAll = React.forwardRef((props, reference) => {
  return <PricerInner reference={reference} {...props} />
})

const Pricer = React.forwardRef((props, reference) => {
  return <PricerInner reference={reference} {...props} />
})

export default Pricer
