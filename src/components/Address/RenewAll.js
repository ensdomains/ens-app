import React, { useState } from 'react'
import { useMutation } from 'react-apollo'
import { motion, AnimatePresence } from 'framer-motion'
import styled from '@emotion/styled'

import { RENEW_DOMAINS } from '../../graphql/mutations'

import DefaultButton from '../Forms/Button'
import SaveCancel from '../SingleName/SaveCancel'
import { PricerAll as PriceAllDefault } from '../SingleName/Pricer'
import { yearInSeconds } from 'utils/dates'
import mq from 'mediaQuery'

import { useEthPrice } from '../hooks'

const RenewContainer = styled('div')`
  grid-column-start: auto;

  ${mq.small`
    grid-column-start: span 2;
  `}
`

const RenewSelected = styled(DefaultButton)`
  margin-right: 20px;
`

const RenewAll = styled(DefaultButton)``

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

function isValid(type, selectedNames) {
  if (type === 'selected') {
    return selectedNames.length > 0
  } else if (type === 'all') {
    return true
  }

  return true
}

export default function Renew({ selectedNames, allNames }) {
  const [mutation] = useMutation(RENEW_DOMAINS)
  const [showPricer, setShowPricer] = useState({ type: undefined, show: false })
  const [years, setYears] = useState(1)
  const { price: ethUsdPrice, loading } = useEthPrice()
  const duration = years * yearInSeconds
  let namesToRenew = []

  if (showPricer.type === 'selected') {
    namesToRenew = selectedNames
  } else if (showPricer.type === 'all') {
    namesToRenew = allNames
  }

  return (
    <RenewContainer>
      <RenewSelected
        onClick={() =>
          setShowPricer(({ show }) => ({
            show: show.type === 'selected' ? false : true,
            type: show.type === 'selected' ? undefined : 'selected'
          }))
        }
        type="hollow-primary"
      >
        Renew Selected
      </RenewSelected>
      <RenewAll
        onClick={() =>
          setShowPricer(({ show }) => ({
            show: show.type === 'all' ? false : true,
            type: show.type === 'all' ? undefined : 'all'
          }))
        }
      >
        Renew all
      </RenewAll>
      {showPricer.show && (
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
              names={['jefflau.eth']}
              years={years}
              setYears={setYears}
              duration={duration}
              ethUsdPriceLoading={loading}
              ethUsdPrice={ethUsdPrice || 0}
            />
            <Buttons>
              <SaveCancel
                stopEditing={() => setShowPricer(show => ({ show: false }))}
                mutation={() => {
                  const labels = namesToRenew.map(name => name.split('.')[0])
                  let variables = {
                    labels,
                    duration
                  }

                  console.log(variables)
                  mutation({ variables })
                  // const variables = getVariables(keyName, {
                  //   domain,
                  //   variableName,
                  //   newValue,
                  //   duration
                  // })
                  // mutation({ variables })
                }}
                mutationButton={
                  showPricer.type === 'all' ? 'Renew All' : 'Renew Selected'
                }
                confirm={true}
                isValid={isValid(showPricer.type, selectedNames)}
                extraDataComponent={
                  <ConfirmationList>
                    The following names:{'\n'}
                    <ul>
                      {namesToRenew.map(name => (
                        <li>{name}</li>
                      ))}
                    </ul>
                    will be renewed for {years} {years > 1 ? 'years' : 'year'}
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
