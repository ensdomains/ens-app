import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { motion, AnimatePresence } from 'framer-motion'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import EthVal from 'ethval'
import mq from 'mediaQuery'

import { RENEW_DOMAINS } from '../../graphql/mutations'
import { GET_RENT_PRICES } from 'graphql/queries'
import { calculateDuration } from 'utils/dates'
import { useEthPrice, useEditable } from '../hooks'
import { trackReferral } from '../../utils/analytics'
import { refetchTilUpdated } from '../../utils/graphql'

import PendingTx from '../PendingTx'
import DefaultButton from '../Forms/Button'
import SaveCancel from '../SingleName/SaveCancel'
import { PricerAll as PriceAllDefault } from '../SingleName/Pricer'
import ExpiryNotifyDropdown from '../ExpiryNotification/ExpiryNotifyDropdown'

const ActionsContainer = styled('div')`
  align-items: start;
  display: flex;
  flex-direction: column;
  grid-area: actions;
  justify-content: flex-start;
  > * {
    margin: 10px 0 10px 0;
  }
  ${mq.small`
    align-items: center; 
    flex-direction: row;
    > * { 
      margin: 0 0 0 20px;
    }
  `}
  ${mq.large`
    justify-content: flex-end;
  `}
`

const RenewContainer = styled('div')`
  grid-area: renew;
  display: flex;
  flex-direction: column;
`

const RenewSelected = styled(DefaultButton)`
  margin-right: 20px;
  align-self: flex-start;
`

const RenewPricer = styled(motion.div)`
  background: #f0f6fa;
  padding: 20px;
  margin: 20px;
  margin-left: 0;
  display: flex;
  flex-direction: column;
`

const Buttons = styled('div')`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
`

const StyledPricer = styled(PriceAllDefault)``

const PricerAll = motion.custom(StyledPricer)

const ConfirmationList = styled('div')`
  max-height: 500px;
  overflow-y: scroll;
`

const WarningMessage = styled('span')`
  color: #f6412d;
  margin-right: auto;
  margin-bottom: 1em;
  ${mq.small`
    margin-bottom: 0em;
  `}
`

function isValid(selectedNames) {
  return selectedNames.length > 0
}

export default function Renew({
  selectedNames,
  address,
  allNames,
  setCheckedBoxes,
  setSelectAll,
  refetch,
  data,
  getterString,
  checkedOtherOwner
}) {
  let { t } = useTranslation()
  const { state, actions } = useEditable()
  const { editing, txHash, pending, confirmed } = state

  const { startEditing, stopEditing, startPending, setConfirmed } = actions

  const [years, setYears] = useState(1)
  const { price: ethUsdPrice, loading: ethUsdPriceLoading } = useEthPrice()
  const duration = calculateDuration(years)
  let labelsToRenew = selectedNames.map(name => name.split('.')[0])

  const { data: { getRentPrices } = {}, loading: loadingRentPrices } = useQuery(
    GET_RENT_PRICES,
    {
      variables: {
        labels: labelsToRenew,
        duration
      }
    }
  )

  const [mutation] = useMutation(RENEW_DOMAINS, {
    onCompleted: res => {
      const txHash = Object.values(res)[0]
      startPending(txHash)
      if (getRentPrices && txHash && ethUsdPrice) {
        trackReferral({
          labels: labelsToRenew, // labels array
          transactionId: txHash, //hash
          type: 'renew', // renew/register
          price: new EthVal(`${getRentPrices._hex}`)
            .toEth()
            .mul(ethUsdPrice)
            .toFixed(2), // in wei
          years
        })
      }
    }
  })

  return (
    <>
      <ActionsContainer>
        {!editing ? (
          pending && !confirmed ? (
            <PendingTx
              txHash={txHash}
              onConfirmed={() => {
                setConfirmed()
                refetchTilUpdated(
                  refetch,
                  300,
                  'expiryDate',
                  selectedNames[0],
                  data,
                  getterString
                )
                setCheckedBoxes({})
                setSelectAll(false)
              }}
            />
          ) : (
            <>
              {address && allNames.length > 0 ? (
                <ExpiryNotifyDropdown address={address} />
              ) : (
                ''
              )}
              <RenewSelected
                onClick={() => {
                  if (labelsToRenew.length > 0) startEditing()
                }}
                type={labelsToRenew.length > 0 ? 'primary' : 'disabled'}
              >
                {t('address.renew.button')}
              </RenewSelected>
            </>
          )
        ) : null}
      </ActionsContainer>

      <RenewContainer>
        {editing && (
          <AnimatePresence>
            <RenewPricer
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <PricerAll
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                labels={labelsToRenew}
                years={years}
                loading={loadingRentPrices}
                price={getRentPrices}
                setYears={setYears}
                duration={duration}
                ethUsdPriceLoading={ethUsdPriceLoading}
                ethUsdPrice={ethUsdPrice || 0}
              />
              <Buttons>
                {checkedOtherOwner && (
                  <WarningMessage>
                    *{t('singleName.expiry.cannotown')}
                  </WarningMessage>
                )}
                <SaveCancel
                  stopEditing={stopEditing}
                  mutation={() => {
                    let variables = {
                      labels: labelsToRenew,
                      duration
                    }

                    mutation({
                      variables
                    })
                  }}
                  mutationButton={t('address.renew.confirmButton')}
                  confirm={true}
                  isValid={isValid(selectedNames)}
                  extraDataComponent={
                    <ConfirmationList>
                      {t('address.renew.confirm.0')}
                      {'\n'}
                      <ul>
                        {selectedNames.map(name => (
                          <li>{name}</li>
                        ))}
                      </ul>
                      {t('address.renew.confirm.1')}
                      {t('address.renew.year', { count: years })}
                    </ConfirmationList>
                  }
                />
              </Buttons>
            </RenewPricer>
          </AnimatePresence>
        )}
      </RenewContainer>
    </>
  )
}
