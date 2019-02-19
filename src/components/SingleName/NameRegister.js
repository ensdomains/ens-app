import React, { useState } from 'react'
import styled from 'react-emotion'
import Button from '../Forms/Button'
import Step from './NameRegister/Step'
import Years from './NameRegister/Years'
import Price from './NameRegister/Price'
import Calendar from './NameRegister/Calendar'
import Progress from './NameRegister/Progress'
import { ReactComponent as ChainDefault } from '../Icons/chain.svg'
import {
  requestPermission,
  sendNotification
} from './NameRegister/notification'

const Steps = styled('section')`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 30px;
  grid-template-rows: 1fr;
`

const PricingContainer = styled('div')`
  display: grid;
  grid-template-columns: minmax(min-content, 200px) minmax(
      min-content,
      min-content
    ) minmax(200px, 1fr);
`

const Explainer = ({ step }) => {
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
          progress={step > 0 ? 100 : 0}
          title="Request to register"
          text="Your wallet will open and you will be asked to confirm the first of two transactions required for registration."
        />
        <Step
          number={2}
          progress={100}
          title="Wait for 10 minutes"
          text="The waiting period is required to ensure another person hasn’t tried to register the same name."
        />
        <Step
          number={3}
          progress={0}
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

const CTA = () => (
  <CTAContainer>
    <Button type="hollow" style={{ marginRight: '20px' }}>
      Cancel
    </Button>
    <Button>Request to register</Button>
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
  const [step, setStep] = useState(0)
  const [years, setYears] = useState(1)

  const incrementStep = () => setStep(step + 1)

  const pricePerYear = 0.1

  return (
    <NameRegisterContainer>
      {steps[step] === 'request' && (
        <PricingContainer>
          <Years years={years} setYears={setYears} />
          <Chain />
          <Price years={years} pricePerYear={pricePerYear} />
        </PricingContainer>
      )}

      <Explainer steps={steps} step={step} />
      <Progress />
      <CTA incrementStep={incrementStep} />

      <Calendar />
      <div onClick={requestPermission}>Request permission</div>
      <div onClick={() => sendNotification('cool')}>Notify</div>
    </NameRegisterContainer>
  )
}

export default NameRegister
