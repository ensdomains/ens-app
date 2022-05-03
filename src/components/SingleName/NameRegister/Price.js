import React from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import mq from 'mediaQuery'
import { InlineLoader } from 'components/Loader'
import priceCalculator from './PriceCalculator'

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

const Price = ({
  loading,
  price,
  premiumOnlyPrice,
  ethUsdPrice,
  ethUsdPremiumPrice,
  underPremium
}) => {
  const { t } = useTranslation()
  let ethPrice = <InlineLoader />
  let withPremium, c
  if (!loading && price) {
    c = priceCalculator({
      price, // in ETH, BN
      premium: premiumOnlyPrice, // in ETH
      ethUsdPrice
    })
    ethPrice = c.price
    if (underPremium && ethUsdPremiumPrice && ethUsdPrice) {
      withPremium =
        underPremium && ethUsdPremiumPrice
          ? `$${c.basePriceInUsd}(+$${c.premiumInUsd}) =`
          : null
    }
  }
  const priceInUsd = c?.priceInUsd
  return (
    <PriceContainer>
      <Value>
        {ethPrice} ETH
        {withPremium && (
          <USD>
            {withPremium}${priceInUsd}
            USD
          </USD>
        )}
      </Value>
      <Description>
        {ethUsdPremiumPrice
          ? t('pricer.pricePerAmount')
          : t('pricer.registrationPriceLabel')}
      </Description>
    </PriceContainer>
  )
}

export default Price
