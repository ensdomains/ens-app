import React from 'react'
import { Mutation } from 'react-apollo'
import styled from '@emotion/styled/macro'

import { useEditable } from '../hooks'
import mq from 'mediaQuery'
import { TRANSFER_REGISTRARS } from '../../graphql/mutations'

import { DetailsItem } from './DetailsItem'
import Button from '../Forms/Button'
import PendingTx from '../PendingTx'
import { formatDate } from '../../utils/dates'
import { ReactComponent as DefaultMigrationIcon } from 'components/Icons/Migration.svg'
import ReleaseDeed from './ReleaseDeed'

const CloseLink = styled('a')`
  position: relative;
  cursor: pointer;
  ${mq.small`
    top:-46px;
  `}
`

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
  margin-bottom: 0;
  margin-right: 2em;

  strong {
    font-weight: 700;
    text-decoration: underline;
  }
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
  background-color: ${props =>
    props.condition === 'warning' ? '#fef6e9' : '#f0f6fa'};
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

const LearnMoreLink = styled('a')``

const LearnMore = () => (
  <LearnMoreLink
    href="https://docs.ens.domains/permanent-registrar-faq"
    target="_blank"
  >
    {t('c.learnmore')}
  </LearnMoreLink>
)

const ReleaseInstead = ({ label, isDeedOwner }) => (
  <MigrationExplanation>
    <ReleaseDeed
      label={label}
      isDeedOwner={isDeedOwner}
      actionText="Release"
      actionType="link"
      explanation="You will no longer have ownership of this name"
    />{' '}
    the domain to get your locked ETH back if you don’t want it anymore.
  </MigrationExplanation>
)

function displayMigrationDiralogue({
  parent,
  isOwner,
  isDeedOwner,
  isNewRegistrar,
  confirmed
}) {
  return (parent === 'eth' && (isDeedOwner && !isNewRegistrar)) || confirmed
}

function TransferRegistrars({
  label,
  currentBlockDate,
  transferEndDate,
  migrationStartDate,
  refetch,
  parent,
  isOwner,
  isDeedOwner,
  isNewRegistrar
}) {
  const { state, actions } = useEditable()
  const { txHash, pending, confirmed } = state
  const { startPending, stopEditing, setConfirmed } = actions

  const MigrationConfirmed = (
    <>
      <MigrationInstruction>
        Congratulations on Migrating your domain!
      </MigrationInstruction>
      <MigrationExplanation>
        You successfully migrated this domain to the new ENS Permanent
        Registrar. We've sent back to you the ETH that you had locked in the
        older registrar contract.
      </MigrationExplanation>
    </>
  )

  const TooEarly = (
    <>
      <MigrationInstruction>
        Be Ready! ENS is migrating to a new Registrar.
      </MigrationInstruction>
      <MigrationExplanation>
        This domain is currently recorded in the old ENS Registrar which will be
        discontinued after 2019.05.04. Migrate to the new ENS Registrar between{' '}
        <strong>
          {formatDate(migrationStartDate, true)} -{' '}
          {formatDate(transferEndDate, true)}
        </strong>{' '}
        if you want to keep your domain. <LearnMore />
      </MigrationExplanation>
      <ReleaseInstead label={label} isDeedOwner={isDeedOwner} />
    </>
  )

  const TooLate = (
    <>
      <MigrationInstruction>Migration period ended</MigrationInstruction>
      <MigrationExplanation>
        You no longer own this name and it has been made available for
        registration in the new ENS Permanent Registrar. You can release the
        domain from the older registrar to get your locked ETH back and register
        it again in the new ENS Permanent Registrar. <LearnMore />
      </MigrationExplanation>
    </>
  )

  const MigrateNow = (
    <>
      <MigrationInstruction>
        Migrate your name to the Permanent Registrar.
      </MigrationInstruction>
      <MigrationExplanation>
        Migrate now to get your locked ETH back and free registration for one
        year. If you do not migrate by{' '}
        <strong>{formatDate(transferEndDate, true)}</strong>, you will lose your
        domain, and others will be able to register it. <LearnMore />
      </MigrationExplanation>
      <ReleaseInstead label={label} isDeedOwner={isDeedOwner} />
    </>
  )

  const ReleaseAction = (
    <ReleaseDeed
      label={label}
      isDeedOwner={isDeedOwner}
      actionText="Release"
      actionType="button"
      explanation="You already lost ownership of this name but will get ETH back"
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
          {mutate => (
            <TransferButton onClick={mutate} type="hollow-primary">
              Migrate
            </TransferButton>
          )}
        </Mutation>
      )}
    </>
  )

  let CurrentMigrationInstruction, CurrentAction, condition
  if (confirmed) {
    CurrentMigrationInstruction = MigrationConfirmed
    CurrentAction = <CloseLink onClick={stopEditing}>x</CloseLink>
  } else {
    if (currentBlockDate < migrationStartDate) {
      CurrentMigrationInstruction = TooEarly
      CurrentAction = (
        <TransferButton type="hollow-primary-disabled">Migrate</TransferButton>
      )
      condition = 'warning'
    } else if (currentBlockDate < transferEndDate) {
      CurrentMigrationInstruction = MigrateNow
      CurrentAction = MigrateAction
      condition = 'warning'
    } else if (currentBlockDate >= transferEndDate) {
      CurrentMigrationInstruction = TooLate
      CurrentAction = ReleaseAction
    }
  }
  return displayMigrationDiralogue({
    parent,
    isOwner,
    isDeedOwner,
    isNewRegistrar,
    confirmed
  }) ? (
    <TransferDetail condition={condition}>
      <MigrationIcon />
      {CurrentMigrationInstruction}
      <Action>{CurrentAction}</Action>
    </TransferDetail>
  ) : (
    ''
  )
}

export default TransferRegistrars
