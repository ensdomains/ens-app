import React from 'react'
import styled from '@emotion/styled'

import { hasReachedState } from './registerReducer'

import Tooltip from '../../Tooltip/Tooltip'
import { ReactComponent as DefaultQuestionMark } from 'components/Icons/QuestionMarkSmall.svg'
import { ReactComponent as DefaultCheckCircle } from 'components/Icons/CheckCircle.svg'

const ProgressContainer = styled('div')`
  margin-bottom: 20px;
`

const states = {
  PRICE_DECISION: 0,
  COMMIT_SENT: 12.5,
  COMMIT_CONFIRMED: 25,
  AWAITING_REGISTER: 75,
  REVEAL_SENT: 85,
  REVEAL_CONFIRMED: 100
}

const ProgressBar = styled('div')`
  height: 20px;
  width: 100%;
  border-radius: 10px;
  margin-bottom: 20px;
  background: ${({ percentDone }) =>
      percentDone &&
      `
        linear-gradient(to right, #AFFF8C 0%, #42E068 ${percentDone}%, transparent ${percentDone}%),`}
    rgba(66, 224, 104, 0.1);
`

const Steps = styled('div')`
  display: flex;
  margin-bottom: 20px;
`

const StepContainer = styled('div')`
  flex: ${p => (p.large ? '2' : '1')};
  display: flex;
  justify-content: center;
  border: 1px dotted #ccc;
  border-right: none;
  border-top: none;
  position: relative;

  &:last-child {
    border-right: none;
  }
`

const StepContent = styled('div')`
  display: flex;
  align-items: center;
  background: white;
  padding: 3px 15px;
  font-family: Overpass;
  font-weight: bold;
  font-size: 14px;
  color: #2c46a6;
  letter-spacing: 1px;
  margin-bottom: -16px;
  color: black;
`

const QuestionMark = styled(DefaultQuestionMark)`
  margin-left: 5px;
`

const CheckCircle = styled(DefaultCheckCircle)`
  margin-left: 5px;
`

function Step({ children, text, large, icon, onMouseOver, onMouseLeave }) {
  return (
    <StepContainer large={large}>
      <StepContent onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
        {children}
        {text} {icon}
      </StepContent>
    </StepContainer>
  )
}

function Progress({ step, waitTime, secondsPassed }) {
  if (step === 'PRICE_DECISION') return null

  const waitPercentComplete = (secondsPassed / waitTime) * 100
  const waitMin = states['COMMIT_CONFIRMED']
  const waitMax = states['AWAITING_REGISTER']
  const percentDone = waitPercentComplete / (100 / (waitMax - waitMin)) + 25
  return (
    <ProgressContainer>
      <ProgressBar
        percentDone={step !== 'COMMIT_CONFIRMED' ? states[step] : percentDone}
      />
      <Steps>
        <Tooltip
          text="<p>The first transaction is being mined on the blockchain. This should take 15-30 seconds.</p>"
          position="top"
          border={true}
          offset={{ left: -30, top: 10 }}
        >
          {({ tooltipElement, showTooltip, hideTooltip }) => (
            <Step
              text="Step 1"
              icon={
                hasReachedState('COMMIT_CONFIRMED', step) ? (
                  <CheckCircle />
                ) : (
                  <QuestionMark />
                )
              }
              onMouseOver={() => {
                showTooltip()
              }}
              onMouseLeave={() => {
                hideTooltip()
              }}
            >
              &nbsp;
              {tooltipElement}
            </Step>
          )}
        </Tooltip>
        <Tooltip
          text="<p>Once this step is complete, the ‘register’ button will activate. Sign up for google notifications to remind you when the wait is up.  </p>"
          position="top"
          border={true}
          offset={{ left: -30, top: 10 }}
        >
          {({ tooltipElement, showTooltip, hideTooltip }) => (
            <Step
              large
              text="Step 2"
              icon={
                hasReachedState('AWAITING_REGISTER', step) ? (
                  <CheckCircle />
                ) : (
                  <QuestionMark />
                )
              }
              onMouseOver={() => {
                showTooltip()
              }}
              onMouseLeave={() => {
                hideTooltip()
              }}
            >
              &nbsp;
              {tooltipElement}
            </Step>
          )}
        </Tooltip>
        <Tooltip
          text="<p>Click ‘register’ to launch the second transaction and complete the registration. </p>"
          position="top"
          border={true}
          offset={{ left: -30, top: 10 }}
        >
          {({ tooltipElement, showTooltip, hideTooltip }) => (
            <Step
              text="Step 3"
              icon={
                hasReachedState('REVEAL_CONFIRMED', step) ? (
                  <CheckCircle />
                ) : (
                  <QuestionMark />
                )
              }
              onMouseOver={() => {
                showTooltip()
              }}
              onMouseLeave={() => {
                hideTooltip()
              }}
            >
              &nbsp;
              {tooltipElement}
            </Step>
          )}
        </Tooltip>
      </Steps>
    </ProgressContainer>
  )
}

export default Progress
