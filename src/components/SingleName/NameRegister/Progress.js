import React from 'react'
import styled from '@emotion/styled'

import Tooltip from '../../Tooltip/Tooltip'

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

const Step = styled('div')`
  flex-grow: ${p => (p.large ? '2' : '1')};
  display: flex;
  justify-content: center;
  border: 1px dotted #ccc;
  border-right: none;
  border-top: none;
  position: relative;

  &:last-child {
    border-right: none;
  }

  &:before {
    content: "${p => p.text}";
    display: flex;
    background: white;
    padding: 3px 15px;
    font-family: Overpass;
    font-weight: bold;
    font-size: 14px;
    color: #2C46A6;
    letter-spacing: 1px;
    z-index: 1;
    position: absolute;
    transform: translateX(-50%);
    left: 50%;
    top: 10px;
    color: black;
  }
`

function Progress({ step, waitTime, secondsPassed }) {
  if (step === 'PRICE_DECISION') return null

  const waitMin = states[step]['COMMIT_CONFIRMED']
  const waitMax = states[step]['COMMIT_CONFIRMED']
  return (
    <ProgressContainer>
      <ProgressBar percentDone={states[step]} />
      <Steps>
        <Tooltip
          text="<p>The first transaction is being mined on the blockchain. This should take 15-30 seconds.</p>"
          position="top"
          border={true}
        >
          {({ tooltipElement, showTooltip, hideTooltip }) => (
            <Step
              text="Step 1"
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
          text='<p>This resolver is outdated and does not support the new content hash.<br/>Click the "Set" button to update  to the latest public resolver.</p>'
          position="top"
          border={true}
        >
          {({ tooltipElement, showTooltip, hideTooltip }) => (
            <Step
              large
              text="Step 2"
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
          text='<p>This resolver is outdated and does not support the new content hash.<br/>Click the "Set" button to update  to the latest public resolver.</p>'
          position="top"
          border={true}
        >
          {({ tooltipElement, showTooltip, hideTooltip }) => (
            <Step
              text="Step 3"
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
