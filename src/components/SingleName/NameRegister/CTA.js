import React, { useState } from 'react'
import styled from '@emotion/styled'
import { Mutation } from 'react-apollo'

import { COMMIT, REGISTER } from '../../../graphql/mutations'

import PendingTx from '../../PendingTx'
import Button, { ExternalButtonLink } from '../../Forms/Button'

const CTAContainer = styled('div')`
  display: flex;
  justify-content: flex-end;
`

function getCTA({ step, incrementStep, duration, name, txHash, setTxHash }) {
  const CTAs = {
    PRICE_DECISION: (
      <Mutation
        mutation={COMMIT}
        variables={{ name }}
        onCompleted={data => {
          setTxHash(Object.values(data)[0])
          incrementStep()
        }}
      >
        {mutate => <Button onClick={mutate}>Request to register</Button>}
      </Mutation>
    ),
    COMMIT_SENT: (
      <PendingTx
        txHash={txHash}
        onConfirmed={() => {
          incrementStep()
        }}
      />
    ),
    COMMIT_CONFIRMED: <Button type="disabled">Register</Button>,
    AWAITING_REGISTER: (
      <Mutation
        mutation={REGISTER}
        variables={{ name, duration }}
        onCompleted={data => {
          setTxHash(Object.values(data)[0])
          incrementStep()
        }}
      >
        {mutate => <Button onClick={mutate}>Register</Button>}
      </Mutation>
    ),
    REVEAL_SENT: (
      <PendingTx
        txHash={txHash}
        onConfirmed={() => {
          incrementStep()
        }}
      />
    ),
    REVEAL_CONFIRMED: (
      <ExternalButtonLink href={`https://manager.ens.domains/name/${name}`}>
        Manage name
      </ExternalButtonLink>
    )
  }
  return CTAs[step]
}

const CTA = ({ step, incrementStep, decrementStep, duration, name }) => {
  const [txHash, setTxHash] = useState(undefined)
  return (
    <CTAContainer>
      {step !== 'REVEAL_CONFIRMED' && (
        <Button
          type="hollow"
          style={{ marginRight: '20px' }}
          onClick={decrementStep}
        >
          Cancel
        </Button>
      )}

      {getCTA({
        step,
        incrementStep,
        duration,
        name,
        txHash,
        setTxHash
      })}
    </CTAContainer>
  )
}

export default CTA
