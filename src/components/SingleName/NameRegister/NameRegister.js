import React, { useState, useReducer } from 'react'
import styled from 'react-emotion'
import { Query } from 'react-apollo'

import mq from 'mediaQuery'
import Button from '../../Forms/Button'

import Explainer from './Explainer'
import Years from './Years'
import Price from './Price'
import Progress from './Progress'
import { ReactComponent as ChainDefault } from '../../Icons/chain.svg'
import gql from 'graphql-tag'

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

const CTAContainer = styled('div')`
  display: flex;
  justify-content: flex-end;
`

const CTA = ({ incrementStep, decrementStep }) => (
  <CTAContainer>
    <Button
      type="hollow"
      style={{ marginRight: '20px' }}
      onClick={decrementStep}
    >
      Cancel
    </Button>
    <Button onClick={incrementStep}>Request to register</Button>
  </CTAContainer>
)

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

const GET_RENT_PRICE = gql`
  query getRentPrice($name: String, $duration: Number) @client {
    getRentPrice(name: $name, duration: $duration) {
      price
    }
  }
`

const NameRegister = ({ domain }) => {
  const [step, dispatch] = useReducer(
    registerReducer,
    registerMachine.initialState
  )
  const [years, setYears] = useState(1)
  const time = 50

  const incrementStep = () => dispatch('NEXT')
  const decrementStep = () => dispatch('PREVIOUS')

  return (
    <NameRegisterContainer>
      {step === 'PRICE_DECISION' && (
        <Query
          query={GET_RENT_PRICE}
          variables={{
            name: domain.name,
            duration: 100000
          }}
        >
          {data => {
            console.log(data)
            return (
              <PricingContainer>
                <Years years={years} setYears={setYears} />
                <Chain />
                <Price price={100} />
              </PricingContainer>
            )
          }}
        </Query>
      )}
      <Explainer step={step} time={time} />
      <Progress step={step} />
      <CTA incrementStep={incrementStep} decrementStep={decrementStep} />
    </NameRegisterContainer>
  )
}

export default NameRegister
