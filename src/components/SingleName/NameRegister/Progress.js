import React from 'react'
import styled from 'react-emotion'

const ProgressContainer = styled('div')``

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
      percentDone
        ? `
        linear-gradient(to right, #AFFF8C 0%, #42E068 ${percentDone}%, #ffffff ${percentDone}%);`
        : 'white'},
    rgba(66, 224, 104, 0.5);
`

const Steps = styled('div')`
  display: flex;
`

const Step = styled('div')`
  flex-grow: ${p => (p.large ? '2' : '1')};
  display: flex;
  justify-content: center;
  border: 1px dashed #ccc;
  border-top: none;

  &:before {
    display: block;
    content: ${p => (p.text ? 'blah' : 'hello')};
  }
`

function Progress({ step }) {
  if (step === 'PRICE_DECISION') return null
  return (
    <ProgressContainer>
      <ProgressBar percentDone={states[step]} />
      <Steps>
        <Step text="Step 1">&nbsp;</Step>
        <Step text="Step 2" large>
          &nbsp;
        </Step>
        <Step text="Step 3">&nbsp;</Step>
      </Steps>
    </ProgressContainer>
  )
}

export default Progress
