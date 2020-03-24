import React, { useState } from 'react'
import { useMutation } from 'react-apollo'
import { motion, AnimatePresence } from 'framer-motion'
import styled from '@emotion/styled'
import DefaultButton from '../Forms/Button'
import SaveCancel from '../SingleName/SaveCancel'
import { PricerAll as PriceAllDefault } from '../SingleName/Pricer'
import { yearInSeconds, formatDate } from 'utils/dates'
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

const RenewButton = styled(DefaultButton)`
  margin-bottom: 20px;
`

const RenewCancel = styled(DefaultButton)`
  margin-left: 20px;
`

const StyledPricer = styled(PriceAllDefault)``

const PricerAll = motion.custom(StyledPricer)

export default function Renew({ selectedNames, allNames }) {
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
            show: !show,
            type: 'selected'
          }))
        }
        type="hollow-primary"
      >
        Renew Selected
      </RenewSelected>
      <RenewAll
        onClick={() =>
          setShowPricer(({ show }) => ({
            show: !show,
            type: 'all'
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
                  // const variables = getVariables(keyName, {
                  //   domain,
                  //   variableName,
                  //   newValue,
                  //   duration
                  // })
                  // mutation({ variables })
                }}
                value={formatDate(new Date())}
                newValue={formatDate(new Date())}
                mutationButton={'Renew All'}
                confirm={true}
                isValid={true}
                extraDataComponent={
                  <div>{namesToRenew.map(name => name + ', \n')}</div>
                }
              />
            </Buttons>
          </RenewPricer>
        </AnimatePresence>
      )}
    </RenewContainer>
  )
}
