import React, { useState } from 'react'
import { useMutation } from 'react-apollo'
import { motion, AnimatePresence } from 'framer-motion'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { get } from 'lodash'

import { RENEW_DOMAINS } from '../../graphql/mutations'
import { yearInSeconds } from 'utils/dates'
import { useEthPrice, useEditable } from '../hooks'

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

const ConfirmationList = styled('div')``

function isValid(selectedNames) {
  return selectedNames.length > 0
}

function refetchTilUpdated(
  refetch,
  interval,
  keyToCompare,
  labelName,
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
              return item.domain.labelName === labelName
            })[keyToCompare] !==
            get(prevData, getterString).find(item => {
              return item.domain.labelName === labelName
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
  refetch,
  data
}) {
  let { t } = useTranslation()
  const { state, actions } = useEditable()

  const { editing, txHash, pending, confirmed } = state

  const { startEditing, stopEditing, startPending, setConfirmed } = actions

  const [mutation] = useMutation(RENEW_DOMAINS, {
    onCompleted: res => {
      startPending(Object.values(res)[0])
    }
  })

  const [years, setYears] = useState(1)
  const { price: ethUsdPrice, loading } = useEthPrice()
  const duration = years * yearInSeconds
  let labelsToRenew = selectedNames.map(name => name.split('.')[0])

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
                labelsToRenew[0],
                data,
                'account.registrations'
              )
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
              setYears={setYears}
              duration={duration}
              ethUsdPriceLoading={loading}
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
                mutationButton={'Renew'}
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
                    {t('address.renew.confirm.1')} {years}{' '}
                    {t('address.renew.year')}
                    {years > 1 ? 's' : ''}
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
