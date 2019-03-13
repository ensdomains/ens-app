import React from 'react'
import styled from 'react-emotion'
import { Mutation } from 'react-apollo'

import { COMMIT, REGISTER } from '../../../graphql/mutations'

import PendingTx from '../../PendingTx'
import Button from '../../Forms/Button'

const CTAContainer = styled('div')`
  display: flex;
  justify-content: flex-end;
`

function getCTA({ step, incrementStep, name, duration }) {
  const CTAs = {
    PRICE_DECISION: (
      <Mutation mutation={COMMIT} variables={{ name }}>
        {mutate => <Button onClick={mutate}>Request to register</Button>}
      </Mutation>
    ),
    COMMIT_SENT: <Button type="disabled">Register</Button>,
    COMMIT_CONFIRMED: <Button onClick={incrementStep}>Register</Button>,
    AWAITING_REGISTER: <Button onClick={incrementStep}>Register</Button>,
    REVEAL_SENT: <PendingTx />,
    REVEAL_CONFIRMED: <Button onClick={incrementStep}>Manage name</Button>
  }
  return CTAs[step]
}

const CTA = ({ incrementStep, decrementStep, step, duration, name }) => {
  return (
    <CTAContainer>
      <Button
        type="hollow"
        style={{ marginRight: '20px' }}
        onClick={decrementStep}
      >
        Cancel
      </Button>
      {getCTA({ step, incrementStep, duration, name })}
    </CTAContainer>
  )
}

export default CTA
