import React from 'react'
import { Mutation } from '@apollo/client/react/components'
import styled from '@emotion/styled/macro'
import { useEditable } from '../hooks'
import { SUBMIT_PROOF } from '../../graphql/mutations'

import Button from '../Forms/Button'
import PendingTx from '../PendingTx'

const SubmitButton = styled(Button)`
  width: 130px;
`

const Action = styled('div')`
  position: absolute;
`

function SubmitProof({ name, parentOwner, refetch, actionText }) {
  console.log('SubmitProof', { name, parentOwner, refetch, actionText })
  const { state, actions } = useEditable()
  const { txHash, pending, confirmed } = state
  const { startPending } = actions

  return (
    <Action>
      {pending && !confirmed && txHash ? (
        <PendingTx
          txHash={txHash}
          onConfirmed={() => {
            refetch()
          }}
        />
      ) : (
        <Mutation
          mutation={SUBMIT_PROOF}
          onCompleted={data => {
            startPending(Object.values(data)[0])
          }}
        >
          {mutate => (
            <SubmitButton
              onClick={() => {
                mutate({ variables: { name, parentOwner } })
              }}
              type="primary"
            >
              {actionText}
            </SubmitButton>
          )}
        </Mutation>
      )}
    </Action>
  )
}

export default SubmitProof
