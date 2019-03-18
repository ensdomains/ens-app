import React, { useState } from 'react'
import styled from '@emotion/styled'
import { Mutation } from 'react-apollo'

import { COMMIT, REGISTER } from '../../../graphql/mutations'
import { isAvailable } from 'api/registrar'

import PendingTx from '../../PendingTx'
import Button from '../../Forms/Button'

const CTAContainer = styled('div')`
  display: flex;
  justify-content: flex-end;
`

function getCTA({
  step,
  incrementStep,
  duration,
  label,
  txHash,
  setTxHash,
  setTimerRunning,
  refetch
}) {
  console.log(refetch)
  const CTAs = {
    PRICE_DECISION: (
      <Mutation
        mutation={COMMIT}
        variables={{ label }}
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
          setTimerRunning(true)
        }}
      />
    ),
    COMMIT_CONFIRMED: <Button type="disabled">Register</Button>,
    AWAITING_REGISTER: (
      <Mutation
        mutation={REGISTER}
        variables={{ label, duration }}
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
        onConfirmed={async () => {
          incrementStep()
        }}
      />
    ),
    REVEAL_CONFIRMED: <Button onClick={() => refetch()}>Manage name</Button>
  }
  return CTAs[step]
}

const CTA = ({
  step,
  incrementStep,
  decrementStep,
  duration,
  label,
  setTimerRunning,
  refetch
}) => {
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
        label,
        txHash,
        setTxHash,
        setTimerRunning,
        refetch
      })}
    </CTAContainer>
  )
}

export default CTA
