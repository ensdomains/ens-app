import React, { useState } from 'react'
import styled from 'react-emotion'
import Button from '../Forms/Button'
import Step from './NameRegister/Step'
import Years from './NameRegister/Years'
import Price from './NameRegister/Price'
import Calendar from './NameRegister/Calendar'

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
      <Step
        number={1}
        progress={step > 0 ? 100 : 0}
        text="Metamask will open and you will be asked to confirm the first of two transactions required for registration. "
      />
      <Step
        number={2}
        progress={75}
        text="There will be a 10+ minute waiting period before Metamask will ask you to confirm the second transaction."
      />
      <Step
        number={3}
        progress={0}
        text="After completing the two transactions, the register button will be active. Click ‘register’ to finalize ownership of the name."
      />
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

const steps = ['request', 'wait', 'register']

const NameRegister = ({ domain }) => {
  const [step, setStep] = useState(0)
  const [years, setYears] = useState(1)

  const incrementStep = () => setStep(step + 1)

  const pricePerYear = 0.1

  return (
    <NameRegisterContainer>
      {steps[step] === 'request' && (
        <>
          <Years years={years} setYears={setYears} />
          <Price years={years} pricePerYear={pricePerYear} />
        </>
      )}

      <Explainer steps={steps} step={step} />
      <CTA incrementStep={incrementStep} />
      <Calendar />
    </NameRegisterContainer>
  )
}

export default NameRegister
