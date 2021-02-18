import React, { useState } from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation, Trans } from 'react-i18next'
import mq from 'mediaQuery'
import EthVal from 'ethval'
import DefaultInput from '../../Forms/Input'
const GWEI = 1000000000
const COMMIT_GAS_WEI = 42000
const REGISTER_GAS_WEI = 240000
const TOGAL_GAS_WEI = COMMIT_GAS_WEI + REGISTER_GAS_WEI

const PriceContainer = styled('div')`
  width: 100%;
  ${mq.medium`
    width: auto
  `}
  margin:5px 0;
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

const TotalValue = styled(Value)`
  font-weight: 300;
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

const Input = styled(DefaultInput)`
  display: inline-block;
  width: 4em;
  margin: 5px 0;
`

const EthRegistrationGasPrice = ({ price, ethUsdPrice, gasPrice }) => {
  const { t } = useTranslation()
  const ethVal = new EthVal(`${price}`).toEth()
  const registerGasSlow = new EthVal(`${TOGAL_GAS_WEI * gasPrice.slow}`).toEth()
  const registerGasFast = new EthVal(`${TOGAL_GAS_WEI * gasPrice.fast}`).toEth()
  const gasPriceToGweiSlow = new EthVal(`${gasPrice.slow}`).toGwei()
  const gasPriceToGweiFast = new EthVal(`${gasPrice.fast}`).toGwei()
  const totalSlow = ethVal.add(registerGasSlow)
  const totalFast = ethVal.add(registerGasFast)
  let totalInUsdSlow, totalInUsdFast
  // No price oracle on Goerli
  if (ethUsdPrice) {
    totalInUsdSlow = totalSlow.mul(ethUsdPrice)
    totalInUsdFast = totalFast.mul(ethUsdPrice)
  }
  return (
    <PriceContainer>
      <TotalValue>
        {ethVal.toFixed(3)} ETH + at least {registerGasFast.toFixed(3)} ETH gas
        fee = at least {totalFast.toFixed(3)} ETH
        {ethVal && ethUsdPrice && (
          <USD>
            {' '}
            ${totalInUsdFast.toFixed(2)}
            USD
          </USD>
        )}
      </TotalValue>
      <Description>
        {t('pricer.totalDescription', {
          gasPriceToGweiSlow: gasPriceToGweiSlow.toFixed(0),
          gasPriceToGweiFast: gasPriceToGweiFast.toFixed(0)
        })}
      </Description>
    </PriceContainer>
  )
}

export default EthRegistrationGasPrice
