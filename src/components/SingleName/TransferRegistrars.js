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
  background-color: ${props => props.condition === 'warning' ? '#fef6e9' : '#f0f6fa'};
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

const LearnMoreLink = styled('a')`
`

const LearnMore = () => (
  <LearnMoreLink
    // Temp link until we get better blog post explaining the detail.
    href="https://medium.com/the-ethereum-name-service/the-future-of-ens-as-explained-in-our-ethcc-talks-videos-inside-395fbaaa6cad"
    target="_blank"
  >
    Learn More
  </LearnMoreLink>
)

const ReleaseInstead = (label, refetch) =>(
  <MigrationExplanation>
    <ReleaseDeed
      label={label}
      refetch={refetch}
      actionText = 'Release'
      actionType = 'link'
      explanation = 'You will no longer have ownership of this name'
    />{' '}
    the domain to get your locked ETH back if you don’t want it anymore.
 </MigrationExplanation>
)

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
        Be Ready! ENS is migrating to a new Registrar.
      </MigrationInstruction>
      <MigrationExplanation>
        This domain is currently recorded in the old ENS Registrar which will be discontinued after May 4th 2019.
        Migrate to the new ENS Registrar between{' '}
        <strong>
          {formatDate(migrationStartDate, true)} -{' '}
          {formatDate(transferEndDate, true)}
        </strong>
        {' '}
        if you want to keep your domain.
        {' '}<LearnMore />
      </MigrationExplanation>
      <ReleaseInstead label={label} refetch={refetch} />
    </>
  )

  const TooLate = (
    <>
      <MigrationInstruction>
        Migration period ended {formatDate(transferEndDate, true)}
      </MigrationInstruction>
      <MigrationExplanation>
        You no longer own this name and it has been made available for registration in the new ENS Permanent Registrar.
        You can release the domain from the older registrar to get your locked ETH back and register it again in the new ENS Permanent Registrar.
        {' '}<LearnMore />
      </MigrationExplanation>
    </>
  )

  const MigrateNow = (
    <>
      <MigrationInstruction>
        Migrate your name to the Permanent Registrar. 
      </MigrationInstruction>
      <MigrationExplanation>
        Migrate now to get your locked ETH back and free registration for one year.
        If you do not migrate by <strong>{formatDate(transferEndDate, true)}</strong>, you will lose your domain, and others will be able to register it.
        {' '}<LearnMore />
      </MigrationExplanation>
      <ReleaseInstead label={label} refetch={refetch} />
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


  let CurrentMigrationInstruction, CurrentAction, condition
  if (currentBlockDate < migrationStartDate) {
    CurrentMigrationInstruction = TooEarly
    CurrentAction = <TransferButton type="hollow-primary-disabled">Migrate</TransferButton>
    condition = 'warning'
  } else if (currentBlockDate < transferEndDate) {
    CurrentMigrationInstruction = MigrateNow
    CurrentAction = MigrateAction
    condition = 'warning'
  } else if (currentBlockDate >= transferEndDate){
    CurrentMigrationInstruction = TooLate
    CurrentAction = ReleaseAction
  }
  return (
    <TransferDetail condition={condition}>
      <MigrationIcon />
      {CurrentMigrationInstruction}
      <Action>{CurrentAction}</Action>
    </TransferDetail>
  )
}

export default TransferRegistrars
