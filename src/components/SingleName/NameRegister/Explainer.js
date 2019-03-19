import React from 'react'
import styled from '@emotion/styled'

import mq from 'mediaQuery'
import Step from './Step'
import Button from '../../Forms/Button'
import { ReactComponent as Bell } from '../../Icons/Bell.svg'

import { requestPermission } from './notification'

const Steps = styled('section')`
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 30px;
  ${mq.large`
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 30px;
    grid-template-rows: 1fr;
  `}
`

const Header = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const NotifyButton = styled(Button)`
  flex-shrink: 0;
`

const Explainer = ({ step, waitPercentComplete }) => {
  const titles = {
    PRICE_DECISION: 'Registering a name requires you to complete 3 steps',
    COMMIT_SENT:
      'Don’t close your browser! You’ll be able to register your name soon.',
    COMMIT_CONFIRMED:
      'Don’t close your browser! You’ll be able to register your name soon.',
    AWAITING_REGISTER:
      'Don’t close your browser! You’ll be able to register your name soon.',
    REVEAL_SENT:
      'Don’t close your browser! You’ll be able to register your name soon.',
    REVEAL_CONFIRMED: 'You’ve completed all the steps, manage your name now!'
  }

  return (
    <div>
      <Header>
        <h2>{titles[step]}</h2>
        <NotifyButton type="hollow-primary" onClick={requestPermission}>
          <Bell style={{ marginRight: 5 }} />
          Notify me
        </NotifyButton>
      </Header>
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
              ? waitPercentComplete
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

export default Explainer
