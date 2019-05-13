import React, { useContext } from 'react'
import { Mutation } from 'react-apollo'
import styled from '@emotion/styled'
import mq from 'mediaQuery'
import { useEditable } from '../hooks'
import { SUBMIT_PROOF } from '../../graphql/mutations'

import Button from '../Forms/Button'
import PendingTx from '../PendingTx'

const SubmitButton = styled(Button)`
  width: 130px;
`

const Action = styled('div')`
  margin-top: 20px;
  ${mq.small`
    position: absolute;
    right: 35px;
    transform: translate(0, -65%);
  `}
`

function SubmitProof({ refetch, actionText }) {
  const { state, actions } = useEditable()
  const { txHash, pending, confirmed } = state
  const { startPending, setConfirmed } = actions
  return (
    <Action>
      {pending && !confirmed && txHash ? (
        <PendingTx
          txHash={txHash}
          onConfirmed={() => {
            setConfirmed()
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
            <SubmitButton onClick={mutate} type="primary">
              {actionText}
            </SubmitButton>
          )}
        </Mutation>
      )}
    </Action>
  )
}

export default SubmitProof
