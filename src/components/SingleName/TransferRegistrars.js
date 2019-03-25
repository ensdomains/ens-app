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
import { formatDate } from '../../utils/dates'

const MigrationInstraction = styled('p')`
  margin: 0;
  margin-left: 10px;
  font-size: 20px;
  font-weight: 300;
`

const MigrationExplanation = styled('p')`
  margin: 0;
  margin-left: 10px;
  color: #cacaca;  
  font-size: 14px;
`

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

function TransferRegistrars({
  label,
  currentBlockDate,
  transferEndDate,
  migrationStartDate,
  refetch
}){
  const { state, actions } = useEditable()
  const { txHash, pending, confirmed } = state
  const { startPending, setConfirmed } = actions

  const TooEarly = (
    <TransferDetail>
      <MigrationInstraction>
        You cannot migrate into permanent registrar yet
      </MigrationInstraction>
      <MigrationExplanation>
        Migrate between {formatDate(migrationStartDate, true)} - {formatDate(transferEndDate, true)}. You will otherwise lose your name
      </MigrationExplanation>
    </TransferDetail>
  ) 

  const MigrateNow = (
    <TransferDetail>
      <MigrationInstraction>
        Migrate your name to the Permanent Registrar
      </MigrationInstraction>
      <MigrationExplanation>
        Migrate by{formatDate(transferEndDate, true)}. You will otherwise lose your name
      </MigrationExplanation>
    </TransferDetail>
  )

  const TooLate = (
    <TransferDetail>
      <MigrationInstraction>
        Migration period was ended at {formatDate(transferEndDate, true)}
      </MigrationInstraction>
      <MigrationExplanation>
        You no longer has ownership on this name but you can still get your locked ETH back.
      </MigrationExplanation>
    </TransferDetail>
  )

  const MigrateAction = (
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
        mutation={TRANSFER_REGISTRARS}
        variables={{ label }}
        onCompleted={data => {
          startPending(Object.values(data)[0])
        }}
        >
          {mutate => <TransferButton onClick={mutate} >Migrate</TransferButton>}
        </Mutation>
      )}
    </>
  )

  let CurrentMigrationInstraction, CurrentAction

  if(currentBlockDate < migrationStartDate){
    CurrentMigrationInstraction = TooEarly
    CurrentAction = (<TransferButton type="disabled" >Migrate</TransferButton>)
  }else if (currentBlockDate < transferEndDate){
    CurrentMigrationInstraction = MigrateNow
    CurrentAction = MigrateAction
  }else{
    CurrentMigrationInstraction = TooLate
    // This is TBD
    CurrentAction = (<TransferButton >Release</TransferButton>)
  }

  return(
    <>
      { CurrentMigrationInstraction }
      <Action>{ CurrentAction }</Action>
    </>
  )
}

export default TransferRegistrars
