import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styled from '@emotion/styled'
import DefaultButton from '../Forms/Button'
import { PricerAll as PriceAllDefault } from '../SingleName/Pricer'
import { yearInSeconds } from 'utils/dates'

import { useEthPrice } from '../hooks'

const RenewContainer = styled('div')``

const RenewSelected = styled(DefaultButton)`
  margin-right: 20px;
`

const RenewAll = styled(DefaultButton)``

const RenewPricer = styled(motion.div)``

const PricerAll = motion.custom(PriceAllDefault)

export default function Renew() {
  const [showPricer, setShowPricer] = useState(false)
  const [years, setYears] = useState(1)
  const { price: ethUsdPrice, loading } = useEthPrice()
  const duration = years * yearInSeconds
  return (
    <RenewContainer>
      <RenewSelected
        onClick={() => setShowPricer(show => !show)}
        type="hollow-primary"
      >
        Renew Selected
      </RenewSelected>
      <RenewAll onClick={() => setShowPricer(show => !show)}>
        Renew all
      </RenewAll>
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
              names={['jefflau.eth']}
              years={years}
              setYears={setYears}
              duration={duration}
              ethUsdPriceLoading={loading}
              ethUsdPrice={ethUsdPrice || 0}
            />
          </RenewPricer>
        </AnimatePresence>
      )}
    </RenewContainer>
  )
}
