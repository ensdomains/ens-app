import React, { useState, useReducer } from 'react'
import styled from 'react-emotion'
import Button from '../Forms/Button'
import Step from './NameRegister/Step'
import Years from './NameRegister/Years'
import Price from './NameRegister/Price'
import Progress from './NameRegister/Progress'
import { ReactComponent as ChainDefault } from '../Icons/chain.svg'
import {
  requestPermission,
  sendNotification
} from './NameRegister/notification'

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

const Steps = styled('section')`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 30px;
  grid-template-rows: 1fr;
`

const PricingContainer = styled('div')`
  display: grid;
  grid-template-columns:
    minmax(min-content, 200px) minmax(min-content, min-content)
    minmax(200px, 1fr);
`

const Explainer = ({ step, time }) => {
  const titles = [
    'Registering a name requires you to complete 3 steps:',
    'Don’t close your browser! You’ll be able to register your name soon.',
    'You’ve completed all the steps, register your name now!'
  ]

  return (
    <div>
      <h2>{titles[step]}</h2>
      <p>
        *Favorite the name for easy access in case you close out of your
        browser.
      </p>
      <Steps>
        <Step
          number={1}
          progress={
            step === 'PRICE_DECISION' ? 0 : step === 'COMMIT_SENT' ? 50 : 100
          }
          title="Request to register"
          text="Your wallet will open and you will be asked to confirm the first of two transactions required for registration."
        />
        <Step
          number={2}
          progress={
            step === 'PRICE_DECISION' || step === 'COMMIT_SENT'
              ? 0
              : step === 'COMMIT_CONFIRMED'
              ? time
              : 100
          }
          title="Wait for 10 minutes"
          text="The waiting period is required to ensure another person hasn’t tried to register the same name."
        />
        <Step
          number={3}
          progress={
            step === 'REVEAL_CONFIRMED' ? 100 : step === 'REVEAL_SENT' ? 50 : 0
          }
          title="Complete Registration"
          text="Click ‘register’ and your wallet will re-open. Upon confirming the second transaction, you can manage your new name."
        />
      </Steps>
    </div>
  )
}

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
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
`

const steps = ['request', 'wait', 'register']

const NameRegister = ({ domain }) => {
  const [step, dispatch] = useReducer(
    registerReducer,
    registerMachine.initialState
  )
  const [years, setYears] = useState(1)
  const time = 50

  const incrementStep = () => dispatch('NEXT')
  const decrementStep = () => dispatch('PREVIOUS')

  const pricePerYear = 0.1

  return (
    <NameRegisterContainer>
      {step === 'PRICE_DECISION' && (
        <PricingContainer>
          <Years years={years} setYears={setYears} />
          <Chain />
          <Price years={years} pricePerYear={pricePerYear} />
        </PricingContainer>
      )}
      <Explainer step={step} time={time} />
      <Progress step={step} />
      <CTA incrementStep={incrementStep} decrementStep={decrementStep} />
      <div onClick={requestPermission}>Request permission</div>
      <div onClick={() => sendNotification('cool')}>Notify</div>
    </NameRegisterContainer>
  )
}

export default NameRegister
