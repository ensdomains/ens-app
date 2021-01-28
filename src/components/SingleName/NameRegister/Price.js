import React from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import mq from 'mediaQuery'
import EthVal from 'ethval'
import { InlineLoader } from 'components/Loader'

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
  ethUsdPrice,
  ethUsdPremiumPrice,
  ethUsdPriceLoading,
  initialGasPrice,
  underPremium
}) => {
  const { t } = useTranslation()

  let ethPrice = <InlineLoader />
  let ethVal, basePrice, withPremium, usdPremium
  if (!loading && price) {
    ethVal = new EthVal(`${price}`).toEth()
    ethPrice = ethVal && ethVal.toFixed(3)
    if (ethUsdPrice && ethUsdPremiumPrice) {
      basePrice = ethVal.mul(ethUsdPrice) - ethUsdPremiumPrice
      withPremium =
        underPremium && ethUsdPremiumPrice
          ? `$${basePrice.toFixed(0)}(+$${ethUsdPremiumPrice.toFixed(2)}) =`
          : null
      usdPremium = ethVal.mul(ethUsdPrice).toFixed(2)
    } else if (ethUsdPrice) {
      usdPremium = ethVal.mul(ethUsdPrice).toFixed(2)
    }
  }
  return (
    <PriceContainer>
      <Value>
        {ethPrice} ETH
        {ethVal && ethUsdPrice && (
          <USD>
            {withPremium}${usdPremium}
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
