import React from 'react'
import { Mutation } from 'react-apollo'
import styled from '@emotion/styled'

import { useEditable } from '../hooks'
import mq from 'mediaQuery'
import {
  TRANSFER_REGISTRARS
} from '../../graphql/mutations'

import { DetailsItem } from './DetailsItem'
import Button from '../Forms/Button'
import PendingTx from '../PendingTx'


const TransferButton = styled(Button)`
  width:130px;
`

const TransferDetail = styled(DetailsItem)`
  padding:15px;
  background-color:#f0f6fa;
  
  ${mq.small`
    padding-right: 150px;
    padding-left: 15px;
  `}
`

const Action = styled('div')`
  margin-bottom: 1em;
  ${mq.small`
    margin-top: 0;
    position: absolute;
    top: 68%;
    right:50px;
    transform: translate(0, -65%);
  `}
`

function TransferRegistrars({label, migrationStartDate, refetch}){
  const { state, actions } = useEditable()
  const { txHash, pending, confirmed } = state
  const { startPending, setConfirmed } = actions
  return(
    <>
      <TransferDetail>
        You cannot migrate into permanent registrar until  {migrationStartDate}.
        <br/>
        Please come back again.
      </TransferDetail>
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
          mutation={TRANSFER_REGISTRARS}
          variables={{ label }}
          onCompleted={data => {
            startPending(Object.values(data)[0])
          }}
          >
            {mutate => <TransferButton onClick={mutate} >Migrate</TransferButton>}
          </Mutation>
        )}
      </Action>
    </>
  )
}

export default TransferRegistrars
