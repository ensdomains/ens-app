import React, { useContext } from 'react'
import { Mutation } from 'react-apollo'
import styled from '@emotion/styled'
import mq from 'mediaQuery'
import { useEditable } from '../hooks'
import { SUBMIT_PROOF } from '../../graphql/mutations'
import { ReactComponent as Pencil } from '../Icons/SmallPencil.svg'

import Button from '../Forms/Button'
import PendingTx from '../PendingTx'

const SubmitButton = styled(Button)`
  width: 130px;
`

const Action = styled('div')`
  position: absolute;
`

function SubmitProof({ name, parentOwner, refetch, actionText }) {
  const { state, actions } = useEditable()
  const { txHash, pending, confirmed } = state
  const { startPending, setConfirmed } = actions
  console.log('SubmitProof component', {
    name,
    parentOwner,
    refetch,
    actionText,
    txHash,
    pending,
    confirmed
  })
  return (
    <Action>
      {pending && !confirmed && txHash ? (
        <PendingTx
          txHash={txHash}
          onConfirmed={() => {
            console.log('onConfirmed')
            // setConfirmed()
            refetch()
          }}
        />
      ) : (
        <Mutation
          mutation={SUBMIT_PROOF}
          onCompleted={data => {
            console.log('SubmitProof:onCompleted', { data })
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
