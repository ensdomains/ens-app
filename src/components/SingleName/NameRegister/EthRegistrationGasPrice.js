import React, { useState } from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation, Trans } from 'react-i18next'
import mq from 'mediaQuery'
import EthVal from 'ethval'
import DefaultInput from '../../Forms/Input'
const GWEI = 1000000000
const COMMIT_GAS_WEI = 42000
const REGISTER_GAS_WEI = 240000

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

const EthRegistrationGasPrice = ({ price, ethUsdPrice, initialGasPrice }) => {
  const { t } = useTranslation()
  const gasPrice = initialGasPrice
  const ethVal = new EthVal(`${price}`).toEth()
  const commitGas = new EthVal(`${COMMIT_GAS_WEI * gasPrice}`).toEth()
  const registerGas = new EthVal(`${REGISTER_GAS_WEI * gasPrice}`).toEth()
  const gasPriceToGwei = new EthVal(`${gasPrice}`).toGwei()
  const totalGas = commitGas.add(registerGas)
  const buffer = ethVal.div(10)
  const total = ethVal.add(buffer).add(totalGas)
  const totalInUsd = total.mul(ethUsdPrice)
  return (
    <PriceContainer>
      <TotalValue>
        {total.toFixed(4)} ETH ({ethVal.toFixed(4)} ETH + {buffer.toFixed(4)}{' '}
        ETH + {totalGas.toFixed(3)} ETH)
        {ethVal && ethUsdPrice && (
          <USD>
            {' '}
            = ${totalInUsd.toFixed(2)}
            USD
          </USD>
        )}
      </TotalValue>
      <Description>
        {t('pricer.totalDescription', { gasPriceToGwei })}
      </Description>
    </PriceContainer>
  )
}

export default EthRegistrationGasPrice
