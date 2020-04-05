import React, { useState } from 'react'
import { useMutation } from 'react-apollo'
import { motion, AnimatePresence } from 'framer-motion'
import styled from '@emotion/styled'

import { RENEW_DOMAINS } from '../../graphql/mutations'
import { yearInSeconds } from 'utils/dates'
import { useEthPrice } from '../hooks'

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

export default function Renew({
  selectedNames,
  allNames,
  selectAllNames,
  removeAllNames
}) {
  const [mutation] = useMutation(RENEW_DOMAINS)

  const [showPricer, setShowPricer] = useState(false)
  const [years, setYears] = useState(1)
  const { price: ethUsdPrice, loading } = useEthPrice()
  const duration = years * yearInSeconds
  let labelsToRenew = selectedNames.map(name => name.split('.')[0])
  console.log(labelsToRenew)
  return (
    <RenewContainer>
      <RenewSelected
        onClick={() => {
          if (labelsToRenew.length > 0) setShowPricer(true)
        }}
        type={labelsToRenew.length > 0 ? 'primary' : 'disabled'}
      >
        Renew Selected
      </RenewSelected>
      {showPricer && (
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
