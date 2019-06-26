import React from 'react'
import styled from '@emotion/styled'
import moment from 'moment'

import mq from 'mediaQuery'
import Step from './Step'
import Button from '../../Forms/Button'

const Steps = styled('section')`
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 30px;
  border-bottom: 1px solid #dfdfdf;
  ${mq.large`
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 30px;
    grid-template-rows: 1fr;
  `}
`

const Explainer = ({ step, number, title, text }) => {
  return (
    <>
      <Steps>
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
