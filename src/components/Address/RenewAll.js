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

function isValid(selectedNames) {
  return selectedNames.length > 0
}

export default function Renew({ selectedNames, allNames }) {
  const [mutation] = useMutation(RENEW_DOMAINS)
  const [showPricer, setShowPricer] = useState(false)
  const [years, setYears] = useState(1)
  const { price: ethUsdPrice, loading } = useEthPrice()
  const duration = years * yearInSeconds
  const labelsToRenew = selectedNames.map(name => name.split('.')[0])

  return (
    <RenewContainer>
      <RenewSelected onClick={() => setShowPricer(true)} type="hollow-primary">
        Renew Selected
      </RenewSelected>
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
              labels={labelsToRenew}
              years={years}
              setYears={setYears}
              duration={duration}
              ethUsdPriceLoading={loading}
              ethUsdPrice={ethUsdPrice || 0}
            />
            <Buttons>
              <SaveCancel
                stopEditing={() => setShowPricer(false)}
                mutation={() => {
                  let variables = {
                    labels: labelsToRenew,
                    duration
                  }

                  console.log(variables)
                  mutation({ variables })
                }}
                mutationButton={'Renew'}
                confirm={true}
                isValid={isValid(selectedNames)}
                extraDataComponent={
                  <ConfirmationList>
                    The following names:{'\n'}
                    <ul>
                      {selectedNames.map(name => (
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
