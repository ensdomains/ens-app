import React from 'react'
import styled from 'react-emotion'
import { COMMIT, REGISTER } from '../../../graphql/mutations'

const CTAContainer = styled('div')`
  display: flex;
  justify-content: flex-end;
`

const CTAs = {
  PRICE_DECISION: <Button onClick={incrementStep}>Request to register</Button>,
  COMMIT_SENT: <Button onClick={incrementStep}>Request to register</Button>,
  COMMIT_CONFIRMED: (
    <Button onClick={incrementStep}>Request to register</Button>
  ),
  AWAITING_REGISTER: (
    <Button onClick={incrementStep}>Request to register</Button>
  ),
  REVEAL_SENT: <Button onClick={incrementStep}>Request to register</Button>,
  REVEAL_CONFIRMED: <Button onClick={incrementStep}>Request to register</Button>
}

function getCTA(step) {
  return CTAs[step]
}

const CTA = ({ incrementStep, decrementStep, step }) => {
  return (
    <CTAContainer>
      <Button
        type="hollow"
        style={{ marginRight: '20px' }}
        onClick={decrementStep}
      >
        Cancel
      </Button>
      {getCTA(step)}
    </CTAContainer>
  )
}

export default CTA
