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
  background: ${({ percentDone }) =>
      percentDone
        ? `
        linear-gradient(to right, #AFFF8C 0%, #42E068 ${percentDone}%, #ffffff ${percentDone}%);`
        : 'white'},
    rgba(66, 224, 104, 0.5);
`

function Progress({ step }) {
  return (
    <ProgressContainer>
      <ProgressBar percentDone={states[step]} />
    </ProgressContainer>
  )
}

export default Progress
