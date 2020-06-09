import React from 'react'
import styled from '@emotion/styled/macro'

import { hasReachedState } from './registerReducer'

import Tooltip from '../../Tooltip/Tooltip'
import { ReactComponent as DefaultQuestionMark } from 'components/Icons/QuestionMarkSmall.svg'
import { ReactComponent as DefaultCheckCircle } from 'components/Icons/CheckCircle.svg'

const ProgressContainer = styled('div')`
  margin-bottom: 40px;
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

const StepContainer = styled('section')`
  flex: ${p => (p.large ? '2' : '1')};
  display: flex;
  justify-content: center;
  border: 1px dotted #ccc;
  border-right: none;
  border-top: none;
  position: relative;

  &:last-of-type {
    border-right: 1px dotted #ccc;
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
  letter-spacing: 1px;
  margin-bottom: -16px;
  transition: 0.2s;
  color: ${p => (p.completed ? 'hsla(134, 72%, 57%, 1)' : 'hsla(0,0%,82%,1)')};
  &:hover {
    color: ${p =>
      p.completed ? 'hsla(134, 72%, 57%, 1)' : 'hsla(227, 58%, 41%, 1)'};

    circle {
      fill: hsla(227, 58%, 41%, 1);
    }
  }
`

const QuestionMark = styled(DefaultQuestionMark)`
  margin-left: 5px;
  margin-bottom: 2px;
  transition: 0.2s;
`

const CheckCircle = styled(DefaultCheckCircle)`
  margin-left: 5px;
  margin-bottom: 2px;
`

function Step({
  children,
  completed,
  text,
  large,
  icon,
  onMouseOver,
  onMouseLeave
}) {
  return (
    <StepContainer large={large}>
      <StepContent
        completed={completed}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
      >
        {children}
        {text} {icon}
      </StepContent>
    </StepContainer>
  )
}

function Progress({ step, waitPercentComplete }) {
  if (step === 'PRICE_DECISION') return null

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
          {({ tooltipElement, showTooltip, hideTooltip }) => {
            const completed = hasReachedState('COMMIT_CONFIRMED', step)
            return (
              <Step
                text="Step 1"
                completed={completed}
                icon={completed ? <CheckCircle /> : <QuestionMark />}
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
            )
          }}
        </Tooltip>
        <Tooltip
          text="<p>Once this step is complete, the ‘register’ button will activate. Sign up for browser notifications to remind you when the wait is up.  </p>"
          position="top"
          border={true}
          offset={{ left: -30, top: 10 }}
        >
          {({ tooltipElement, showTooltip, hideTooltip }) => {
            const completed = hasReachedState('AWAITING_REGISTER', step)
            return (
              <Step
                large
                text="Step 2"
                completed={completed}
                icon={completed ? <CheckCircle /> : <QuestionMark />}
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
            )
          }}
        </Tooltip>
        <Tooltip
          text="<p>Click ‘register’ to launch the second transaction and complete the registration. </p>"
          position="top"
          border={true}
          offset={{ left: -30, top: 10 }}
        >
          {({ tooltipElement, showTooltip, hideTooltip }) => {
            const completed = hasReachedState('REVEAL_CONFIRMED', step)
            return (
              <Step
                completed={completed}
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
            )
          }}
        </Tooltip>
      </Steps>
    </ProgressContainer>
  )
}

export default Progress
