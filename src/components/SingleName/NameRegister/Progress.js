import React from 'react'
import styled from 'react-emotion'

const ProgressContainer = styled('div')``

const states = {
  step1: {
    percentStart: '12.5',
    percentEnd: '25'
  },
  step2: {
    percentStart: '25',
    percentEnd: '75'
  },
  step3a: {
    percentStart: '85'
  },
  step3b: {
    percentStart: '100'
  }
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

function Progress() {
  return (
    <ProgressContainer>
      <ProgressBar percentDone={states.step2.percentStart} />
    </ProgressContainer>
  )
}

export default Progress
