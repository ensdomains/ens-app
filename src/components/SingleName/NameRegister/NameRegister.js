import React, { useState, useReducer } from 'react'
import styled from '@emotion/styled'
import { Query } from 'react-apollo'

import mq from 'mediaQuery'
import { GET_MINIMUM_COMMITMENT_AGE, GET_RENT_PRICE } from 'graphql/queries'
import { useInterval } from 'components/hooks'

import Loader from 'components/Loader'
import Explainer from './Explainer'
import CTA from './CTA'
import Years from './Years'
import Price from './Price'
import Progress from './Progress'
import { ReactComponent as ChainDefault } from '../../Icons/chain.svg'

// steps

// 0 not registered, deciding price
// 1 transaction sent, waiting for confirmation
// 2 transaction confirmed, waiting 10 mins
// 3 10 mins over, waiting for user to hit register
// 4 transaction sent. waiting for confirmation
// 5 transaction confirmed, click to manage name

const registerMachine = {
  initialState: 'PRICE_DECISION',
  states: {
    PRICE_DECISION: {
      on: {
        NEXT: 'COMMIT_SENT',
        PREVIOUS: 'PRICE_DECISION'
      }
    },
    COMMIT_SENT: {
      on: {
        NEXT: 'COMMIT_CONFIRMED',
        PREVIOUS: 'PRICE_DECISION'
      }
    },
    COMMIT_CONFIRMED: {
      on: {
        NEXT: 'AWAITING_REGISTER',
        PREVIOUS: 'COMMIT_SENT'
      }
    },
    AWAITING_REGISTER: {
      on: {
        NEXT: 'REVEAL_SENT',
        PREVIOUS: 'COMMIT_CONFIRMED'
      }
    },
    REVEAL_SENT: {
      on: {
        NEXT: 'REVEAL_CONFIRMED',
        PREVIOUS: 'AWAITING_REGISTER'
      }
    },
    REVEAL_CONFIRMED: {
      on: {
        NEXT: 'REVEAL_CONFIRMED',
        PREVIOUS: 'REVEAL_SENT'
      }
    }
  }
}

function registerReducer(state, action) {
  return registerMachine.states[state].on[action] || state
}

const PricingContainer = styled('div')`
  display: grid;
  grid-template-columns: 1fr;
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

  useInterval(
    () => {
      if (secondsPassed < waitTime) {
        setSecondsPassed(s => s + 1)
      } else {
        setTimerRunning(false)
        incrementStep()
      }
    },
    timerRunning ? 1000 : null
  )

  const time = 50

  const duration = 31556952 * years

  return (
    <NameRegisterContainer>
      {secondsPassed}
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
                <Price price={loading ? 0 : data.getRentPrice} />
              </PricingContainer>
            )
          }}
        </Query>
      )}

      <Explainer step={step} time={time} />
      <Progress step={step} waitTime={waitTime} secondsPassed={secondsPassed} />
      <CTA
        waitTime={waitTime}
        incrementStep={incrementStep}
        decrementStep={decrementStep}
        step={step}
        name={domain.name}
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
        if (loading) return <Loader />
        const { getMinimumCommitmentAge } = data
        return <NameRegister waitTime={getMinimumCommitmentAge} {...props} />
      }}
    </Query>
  )
}

export default NameRegisterDataWrapper
