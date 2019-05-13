import React from 'react'
import styled from '@emotion/styled'
import moment from 'moment'

import mq from 'mediaQuery'
import Step from './Step'
import Button from '../../Forms/Button'
import { ReactComponent as Bell } from '../../Icons/Bell.svg'
import { ReactComponent as Tick } from '../../Icons/GreyCircleTick.svg'

import { requestPermission, hasPermission } from './notification'

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
  margin-bottom: 20px;

  h2 {
    font-family: Overpass;
    font-weight: 300;
    font-size: 18px;
    color: #2b2b2b;
    letter-spacing: 0;
    margin: 0;
    margin-bottom: 5px;

    ${mq.medium`
      font-size: 24px;
      color: #2B2B2B;
      letter-spacing: 0;
    `}
  }

  p {
    margin: 0;
    font-weight: 400;
    font-family: Overpass;
    font-size: 14px;
    color: #adbbcd;
    letter-spacing: 0;
  }
`

const NotifyButton = styled(Button)`
  flex-shrink: 0;
`

const NotifyButtonDisabled = styled('div')`
  color: hsla(0, 0%, 82%, 1);
`

const Explainer = ({ step, waitPercentComplete, waitTime }) => {
  const titles = {
    PRICE_DECISION: 'Registering a name requires you to complete 3 steps',
    COMMIT_SENT:
      'Don’t close your browser! You’ll be able to manage your name soon.',
    COMMIT_CONFIRMED:
      'Don’t close your browser! You’ll be able to manage your name soon.',
    AWAITING_REGISTER:
      'Don’t close your browser! You’ll be able to manage your name soon.',
    REVEAL_SENT:
      'Don’t close your browser! You’ll be able to manage your name soon.',
    REVEAL_CONFIRMED: 'You’ve completed all the steps, manage your name now!'
  }

  return (
    <>
      <Header>
        <div>
          <h2>{titles[step]}</h2>
          <p>
            *Favorite the name for easy access in case you close out of your
            browser.
          </p>
        </div>
        {hasPermission() ? (
          <NotifyButtonDisabled>
            <Tick style={{ marginRight: 5 }} />
            Notify me
          </NotifyButtonDisabled>
        ) : (
          <NotifyButton type="hollow-primary" onClick={requestPermission}>
            <Bell style={{ marginRight: 5 }} />
            Notify me
          </NotifyButton>
        )}
      </Header>

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
          title={`Wait for ${moment
            .duration({ seconds: waitTime })
            .humanize()}`}
          text="The waiting period is required to ensure another person hasn’t tried to register the same name and protect you after your request."
        />
        <Step
          number={3}
          progress={
            step === 'REVEAL_CONFIRMED' ? 100 : step === 'REVEAL_SENT' ? 50 : 0
          }
          title="Complete Registration"
          text="Click ‘register’ and your wallet will re-open. Only after the 2nd transaction is confirmed you'll know if you got the domain"
        />
      </Steps>
    </>
  )
}

export default Explainer
