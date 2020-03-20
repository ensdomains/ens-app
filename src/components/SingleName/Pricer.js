import React from 'react'
import styled from '@emotion/styled'
import { useQuery } from 'react-apollo'

import { GET_RENT_PRICE, GET_RENT_PRICE_ALL } from 'graphql/queries'

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
  price,
  reference
}) {
  return (
    <PricingContainer className={className} ref={reference}>
      <Years years={years} setYears={setYears} />
      <Chain />
      <Price
        price={price}
        ethUsdPriceLoading={ethUsdPriceLoading}
        ethUsdPrice={ethUsdPrice}
      />
    </PricingContainer>
  )
}

export const PricerAll = React.forwardRef((props, reference) => {
  const { names, duration } = props
  // const { data, loading } = useQuery(GET_RENT_PRICE_ALL, {
  //   variables: {
  //     names,
  //     duration
  //   }
  // })

  const { data, loading } = useQuery(GET_RENT_PRICE, {
    variables: {
      name: names[0],
      duration
    }
  })
  return (
    <PricerInner
      reference={reference}
      price={loading ? 0 : data.getRentPrice}
      loading={loading}
      {...props}
    />
  )
})

export default function Pricer(props) {
  const { name, duration } = props
  const { data, loading } = useQuery(GET_RENT_PRICE, {
    variables: {
      name,
      duration
    }
  })
  return (
    <PricerInner
      price={loading ? 0 : data.getRentPrice}
      loading={loading}
      {...props}
    />
  )
}
