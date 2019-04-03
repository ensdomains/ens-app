import React, { useContext} from 'react'
import { Mutation } from 'react-apollo'
import styled from '@emotion/styled'

import { useEditable,  } from '../hooks'
import { RELEASE_DEED } from '../../graphql/mutations'

import Button from '../Forms/Button'
import PendingTx from '../PendingTx'
import GlobalState from '../../globalState'

const ReleaseButton = styled(Button)`
  width: 130px;
`

const ReleaseLink = styled('a')`
  &:hover {
    cursor: pointer;
  }
`

function ReleaseDeed({
  label,
  refetch,
  actionText,
  actionType,
  explanation
}) {
  const { toggleModal } = useContext(GlobalState)
  const { state, actions } = useEditable()
  const { txHash, pending, confirmed } = state
  const { startPending, setConfirmed } = actions  
  let ActionElement
  if(actionType === 'link'){
    ActionElement = ReleaseLink
  }else{
    ActionElement = ReleaseButton
  }
  return (
    <>
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
          mutation={RELEASE_DEED}
          variables={{ label }}
          onCompleted={data => {
            startPending(Object.values(data)[0])
          }}
        >
          {mutate => <ActionElement
                      onClick={() =>
                        toggleModal({
                          name: 'confirm',
                          mutation: mutate,
                          explanation: explanation,
                          cancel: () => {
                            toggleModal({ name: 'confirm' })
                          }
                        })
                      }
                      type="primary"
                    >{actionText}</ActionElement>
          }
        </Mutation>
      )}
    </>
  )
}

export default ReleaseDeed
