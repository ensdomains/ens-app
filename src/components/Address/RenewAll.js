import React, { useState } from 'react'
import { useMutation, useQuery } from 'react-apollo'
import { motion, AnimatePresence } from 'framer-motion'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { get } from 'lodash'

import { RENEW_DOMAINS } from '../../graphql/mutations'
import { GET_RENT_PRICES } from 'graphql/queries'
import { yearInSeconds } from 'utils/dates'
import { useEthPrice, useEditable, useReferrer } from '../hooks'
import { decryptName } from '../../api/labels'
import { trackReferral } from '../../utils/analytics'

import PendingTx from '../PendingTx'
import DefaultButton from '../Forms/Button'
import SaveCancel from '../SingleName/SaveCancel'
import { PricerAll as PriceAllDefault } from '../SingleName/Pricer'

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

function isValid(selectedNames) {
  return selectedNames.length > 0
}

function refetchTilUpdated(
  refetch,
  interval,
  keyToCompare,
  name,
  prevData,
  getterString
) {
  let maxTries = 10
  let tries = maxTries
  let incrementedInterval = interval

  function recurseRefetch() {
    if (tries > 0) {
      return setTimeout(() => {
        tries--
        incrementedInterval = interval * (maxTries - tries + 1)
        refetch().then(({ data }) => {
          const updated =
            get(data, getterString).find(item => {
              return decryptName(item.domain.name) === name
            })[keyToCompare] !==
            get(prevData, getterString).find(item => {
              return decryptName(item.domain.name) === name
            })[keyToCompare]

          if (updated) return
          return recurseRefetch()
        })
      }, incrementedInterval)
    }
    return
  }

  recurseRefetch()
}

export default function Renew({
  selectedNames,
  allNames,
  selectAllNames,
  removeAllNames,
  setCheckedBoxes,
  setSelectAll,
  refetch,
  data
}) {
  let { t } = useTranslation()
  const { state, actions } = useEditable()
  const referrer = useReferrer()

  const { editing, txHash, pending, confirmed } = state

  const { startEditing, stopEditing, startPending, setConfirmed } = actions

  const [years, setYears] = useState(1)
  const { price: ethUsdPrice, loading: ethUsdPriceLoading } = useEthPrice()
  const duration = years * yearInSeconds
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
      trackReferral({
        labels: labelsToRenew, // labels array
        transactionId: txHash, //hash
        type: 'renew', // renew/register
        price: getRentPrices._hex, // in wei
        referrer
      })
    }
  })

  return (
    <RenewContainer>
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
                'account.registrations'
              )
              setCheckedBoxes({})
              setSelectAll(false)
            }}
          />
        ) : (
          <RenewSelected
            onClick={() => {
              if (labelsToRenew.length > 0) startEditing()
            }}
            type={labelsToRenew.length > 0 ? 'primary' : 'disabled'}
          >
            {t('address.renew.button')}
          </RenewSelected>
        )
      ) : null}

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
              <SaveCancel
                stopEditing={stopEditing}
                mutation={() => {
                  let variables = {
                    labels: labelsToRenew,
                    duration
                  }

                  mutation({ variables })
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
  )
}
