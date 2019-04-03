import React from 'react'
import { Mutation } from 'react-apollo'
import styled from '@emotion/styled'

import { useEditable } from '../hooks'
import mq from 'mediaQuery'
import { TRANSFER_REGISTRARS } from '../../graphql/mutations'

import { DetailsItem } from './DetailsItem'
import Button from '../Forms/Button'
import PendingTx from '../PendingTx'
import { formatDate } from '../../utils/dates'
import { ReactComponent as DefaultMigrationIcon } from 'components/Icons/Migration.svg'
import ReleaseDeed from './ReleaseDeed'

const MigrationInstruction = styled('h3')`
  margin: 0;
  margin-bottom: 0px;
  font-family: Overpass;
  font-size: 18px;
  font-weight: 300;
  color: #2b2b2b;
  ${mq.small`
      font-size: 20px;
  `}
`

const MigrationExplanation = styled('p')`
  font-weight: 300;
  font-size: 14px;
  color: #adbbcd;
  letter-spacing: 0;
  margin-bottom: 20px;

  strong {
    font-weight: 700;
    text-decoration: underline;
  }

  ${mq.small`
    margin: 0;
  `}
`

const TransferButton = styled(Button)`
  width: 130px;
`

const MigrationIcon = styled(DefaultMigrationIcon)`
  position: absolute;
  left: 20px;
  top: 25px;

  ${mq.small`
    left: 30px;
  `}
`

const TransferDetail = styled(DetailsItem)`
  padding: 20px;
  background-color: #f0f6fa;
  position: relative;
  padding-top: 65px;
  margin-bottom: 25px;

  ${mq.small`
    padding-top: 20px;
    padding-right: 150px;
    padding-left: 75px;
    margin-bottom: 25px;
  `}
`

const Action = styled('div')`
  margin-bottom: 1em;
  ${mq.small`
    margin-top: 0;
    position: absolute;
    top: 68%;
    right:30px;
    transform: translate(0, -65%);
  `}
`

function TransferRegistrars({
  label,
  currentBlockDate,
  transferEndDate,
  migrationStartDate,
  refetch
}) {
  const { state, actions } = useEditable()
  const { txHash, pending, confirmed } = state
  const { startPending, setConfirmed } = actions

  const TooEarly = (
    <>
      <MigrationInstruction>
        You cannot migrate into permanent registrar yet
      </MigrationInstruction>
      <MigrationExplanation>
        Migrate between{' '}
        <strong>
          {formatDate(migrationStartDate, true)} -{' '}
          {formatDate(transferEndDate, true)}
        </strong>
        . You will otherwise lose your name
      </MigrationExplanation>
    </>
  )

  const TooLate = (
    <>
      <MigrationInstruction>
        Migration period was ended on {formatDate(transferEndDate, true)}
      </MigrationInstruction>
      <MigrationExplanation>
        You no longer have ownership of this name but you can still release and get your
        locked ETH back.
      </MigrationExplanation>
    </>
  )

  const MigrateNow = (
    <>
      <MigrationInstruction>
        Migrate your name to the Permanent Registrar
      </MigrationInstruction>
      <MigrationExplanation>
        Migrate by <strong>{formatDate(transferEndDate, true)}</strong>. You
        will otherwise lose your name
      </MigrationExplanation>
      <MigrationExplanation>
        If you do not wish to migrate,
        <ReleaseDeed
          label={label}
          refetch={refetch}
          actionText = 'release'
          actionType = 'link'
          explanation = 'You will no longer have ownership of this name'
        />
        your name to get back your locked ETH.
      </MigrationExplanation>
    </>
  )

  const ReleaseAction = (
    <ReleaseDeed
      label={label}
      refetch={refetch}
      actionText = 'Release'
      actionType = 'button'
      explanation = 'You already lost ownership of this name but will get ETH back'
    />
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
          {mutate => <TransferButton
                      onClick={mutate}
                      type="hollow-primary"
                     >Migrate</TransferButton>
          }
        </Mutation>
      )}
    </>
  )


  let CurrentMigrationInstruction, CurrentAction
  
  if (currentBlockDate < migrationStartDate) {
    CurrentMigrationInstruction = TooEarly
    CurrentAction = <TransferButton type="hollow-primary-disabled">Migrate</TransferButton>
  } else if (currentBlockDate < transferEndDate) {
    CurrentMigrationInstruction = MigrateNow
    CurrentAction = MigrateAction
  } else if (currentBlockDate >= transferEndDate){
    CurrentMigrationInstruction = TooLate
    CurrentAction = ReleaseAction
  }

  return (
    <TransferDetail>
      <MigrationIcon />
      {CurrentMigrationInstruction}
      <Action>{CurrentAction}</Action>
    </TransferDetail>
  )
}

export default TransferRegistrars
