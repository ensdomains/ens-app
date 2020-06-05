import React from 'react'
import styled from '@emotion/styled/macro'
import Step from './Step'

const Steps = styled('section')`
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 30px;
  border-bottom: ${p => (p.border ? '1' : '0')}px solid #dfdfdf;
`

const Explainer = ({ step, number, title, text, border }) => {
  return (
    <>
      <Steps border={border}>
        <Step
          number={number}
          progress={
            step === 'SUBMIT_CONFIRMED' ? 100 : step === 'SUBMIT_SENT' ? 50 : 0
          }
          title={title}
          text={text}
        />
      </Steps>
    </>
  )
}

export default Explainer
