import React from 'react'
import { Mutation } from 'react-apollo'
import styled from '@emotion/styled'

import { useEditable } from '../hooks'
import mq from 'mediaQuery'
import { TRANSFER_REGISTRARS } from '../../graphql/mutations'

import { DetailsItem } from './DetailsItem'
import Button from '../Forms/Button'
import PendingTx from '../PendingTx'
import { ReactComponent as DefaultMigrationIcon } from 'components/Icons/Migration.svg'

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

  h3 {
    margin: 0;
    margin-bottom: 0px;
    font-family: Overpass;
    font-size: 18px;
    font-weight: 300;
    color: #2b2b2b;
  }

  p {
    font-weight: 700;
    font-size: 14px;
    color: #adbbcd;
    letter-spacing: 0;
    margin-bottom: 20px;
  }

  ${mq.small`
    padding-top: 20px;
    padding-right: 150px;
    padding-left: 75px;

    p {
      margin: 0;
    }

    h3 {
      font-size: 20px;
    }
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

function TransferRegistrars({ label, refetch }) {
  const { state, actions } = useEditable()
  const { txHash, pending, confirmed } = state
  const { startPending, setConfirmed } = actions
  return (
    <>
      <TransferDetail>
        <MigrationIcon />
        <h3>Migrate your name to the Permanent Registrar </h3>
        <p>Migrate by May 4, 2020. You will otherwise lose your name.</p>
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
              {mutate => (
                <TransferButton onClick={mutate}>Migrate</TransferButton>
              )}
            </Mutation>
          )}
        </Action>
      </TransferDetail>
    </>
  )
}

export default TransferRegistrars
