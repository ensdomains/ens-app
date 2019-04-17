import React, { useState, useReducer } from 'react'
import styled from '@emotion/styled'
import { Query } from 'react-apollo'

import mq from 'mediaQuery'
import { GET_MINIMUM_COMMITMENT_AGE, GET_RENT_PRICE } from 'graphql/queries'
import { useInterval, useEthPrice } from 'components/hooks'
import { registerMachine, registerReducer } from './registerReducer'
import { sendNotification } from './notification'

import Loader from 'components/Loader'
import Explainer from './Explainer'
import CTA from './CTA'
import Years from './Years'
import Price from './Price'
import Progress from './Progress'
import { ReactComponent as ChainDefault } from '../../Icons/chain.svg'

const PricingContainer = styled('div')`
  display: grid;
  grid-template-columns: 1fr;
  margin-bottom: 20px;
  ${mq.medium`
    grid-template-columns:
      minmax(min-content, 200px) minmax(min-content, min-content)
      minmax(200px, 1fr);
  `}
`

const NameRegisterContainer = styled('div')`
  padding: 20px 40px;
`

const Chain = styled(ChainDefault)`
  display: none;

  ${mq.medium`
    display: block;
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
  `}
`

const NameRegister = ({ domain, waitTime, refetch }) => {
  const [step, dispatch] = useReducer(
    registerReducer,
    registerMachine.initialState
  )
  const incrementStep = () => dispatch('NEXT')
  const decrementStep = () => dispatch('PREVIOUS')
  const [years, setYears] = useState(1)
  const [secondsPassed, setSecondsPassed] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const { loading: ethUsdPriceLoading, price: ethUsdPrice } = useEthPrice()

  useInterval(
    () => {
      if (secondsPassed < waitTime) {
        setSecondsPassed(s => s + 1)
      } else {
        setTimerRunning(false)
        incrementStep()
        sendNotification(`${domain.name} is ready to be registered`)
      }
    },
    timerRunning ? 1000 : null
  )

  const duration = 31556952 * parseFloat(years)
  const waitPercentComplete = (secondsPassed / waitTime) * 100

  return (
    <NameRegisterContainer>
      {step === 'PRICE_DECISION' && (
        <Query
          query={GET_RENT_PRICE}
          variables={{
            name: domain.name,
            duration
          }}
        >
          {({ data, loading }) => {
            return (
              <PricingContainer>
                <Years years={years} setYears={setYears} />
                <Chain />
                <Price
                  price={loading ? 0 : data.getRentPrice}
                  ethUsdPriceLoading={ethUsdPriceLoading}
                  ethUsdPrice={ethUsdPrice}
                />
              </PricingContainer>
            )
          }}
        </Query>
      )}

      <Explainer
        step={step}
        waitTime={waitTime}
        waitPercentComplete={waitPercentComplete}
      />
      <Progress step={step} waitPercentComplete={waitPercentComplete} />
      <CTA
        waitTime={waitTime}
        incrementStep={incrementStep}
        decrementStep={decrementStep}
        step={step}
        label={domain.label}
        duration={duration}
        secondsPassed={secondsPassed}
        setTimerRunning={setTimerRunning}
        refetch={refetch}
      />
    </NameRegisterContainer>
  )
}

const NameRegisterDataWrapper = props => {
  return (
    <Query query={GET_MINIMUM_COMMITMENT_AGE}>
      {({ data, loading }) => {
        if (loading) return <Loader withWrap={true} large />
        const { getMinimumCommitmentAge } = data
        return <NameRegister waitTime={getMinimumCommitmentAge} {...props} />
      }}
    </Query>
  )
}

export default NameRegisterDataWrapper
