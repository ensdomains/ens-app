import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled/macro'
import { useMutation } from '@apollo/client'
import { useEditable } from 'components/hooks'
import { MIGRATE_RESOLVER } from 'graphql/mutations'
import { useTranslation } from 'react-i18next'
import { DetailsItem, DetailsKey, DetailsValue } from '../DetailsItem'
import PendingTx from '../../PendingTx'
import Button from '../../Forms/Button'
import mq from 'mediaQuery'
import ErrorModal from 'components/ErrorModal'
import CopyToClipBoard from '../../CopyToClipboard/'

const MigrateItem = styled(DetailsItem)`
  position: relative;
`

const MigrateKey = styled(DetailsKey)`
  color: #2b2b2b;
`

const MigrateValue = styled(DetailsValue)`
  color: #f5a623;
`

const MigrateButton = styled(Button)`
  margin-left: 10px;
`

const MigrateAction = styled('div')`
  margin-left: 0;
  ${mq.small`
    margin-left: auto
  `}
`

const SVG = styled('svg')`
  margin-right: 10px;
`

export default function MigrateResolver({ value, name, refetch, isOwner }) {
  const { t } = useTranslation()
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const { state: state1, actions: actions1 } = useEditable()
  const { state: state2, actions: actions2 } = useEditable()

  const { txHash: txHash1, pending: pending1, confirmed: confirmed1 } = state1
  const { txHash: txHash2, pending: pending2, confirmed: confirmed2 } = state2

  const { startPending: startPending1, setConfirmed: setConfirmed1 } = actions1

  const { startPending: startPending2, setConfirmed: setConfirmed2 } = actions2
  const [migrateResolver, { error: mutationError }] = useMutation(
    MIGRATE_RESOLVER,
    {
      variables: { name },
      onCompleted: data => {
        if (Object.values(data)[0].length > 1) {
          startPending1(Object.values(data)[0][0])
          startPending2(Object.values(data)[0][1])
        } else {
          startPending1(Object.values(data)[0][0])
          startPending2('notatx')
        }
      }
    }
  )

  useEffect(() => {
    if (mutationError) setIsErrorModalOpen(true)
  }, [mutationError])

  return (
    <MigrateItem>
      {isErrorModalOpen && (
        <ErrorModal
          error={mutationError}
          title={t('singleName.resolver.error')}
          close={() => setIsErrorModalOpen(false)}
        />
      )}
      <MigrateKey>
        <SVG width="16" height="16" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.739 5.82c-.039.746-.096 1.512-.134 2.258-.02.25-.02.268-.02.517a.723.723 0 01-.727.708.707.707 0 01-.727-.689c-.058-1.167-.134-2.143-.192-3.311l-.057-.938c-.02-.478.268-.9.727-1.034a.972.972 0 011.13.556c.057.153.095.306.095.478-.019.479-.057.976-.095 1.455m-.88 6.316a.98.98 0 01-.977-.976.98.98 0 01.976-.976c.536 0 .976.44.957.995.02.517-.44.957-.957.957M7.93 0a7.93 7.93 0 100 15.86A7.93 7.93 0 007.93 0"
            fill="#F5A623"
            fillRule="evenodd"
          />
        </SVG>
        {t('c.Resolver')}
      </MigrateKey>
      <MigrateValue editable data-testid={'migrate-value'}>
        {value}
        <CopyToClipBoard iconColour="#f5a623" />
      </MigrateValue>
      <MigrateAction>
        {pending1 &&
        pending2 &&
        (txHash1 && txHash2) &&
        (!confirmed1 || !confirmed2) ? (
          <PendingTx
            txHashes={txHash2 === 'notatx' ? undefined : [txHash1, txHash2]}
            txHash={txHash2 === 'notatx' ? txHash1 : undefined}
            onConfirmed={() => {
              setConfirmed1()
              setConfirmed2()
              refetch()
            }}
          />
        ) : (
          <MigrateButton
            onClick={isOwner ? migrateResolver : () => {}}
            type={isOwner ? 'primary' : 'disabled'}
          >
            {t('c.migrate')}
          </MigrateButton>
        )}
      </MigrateAction>
    </MigrateItem>
  )
}
