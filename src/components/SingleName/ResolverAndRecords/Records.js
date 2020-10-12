import React, { useState, useEffect } from 'react'
import { useMutation } from 'react-apollo'
import styled from '@emotion/styled/macro'
import isEqual from 'lodash/isEqual'
import differenceWith from 'lodash/differenceWith'
import { useQuery } from 'react-apollo'
import { useTranslation } from 'react-i18next'
import { getNamehash } from '@ensdomains/ui'

import { useEditable } from '../../hooks'
import { ADD_MULTI_RECORDS } from '../../../graphql/mutations'
import COIN_LIST from 'constants/coinList'
import PendingTx from '../../PendingTx'
import { emptyAddress } from '../../../utils/utils'

import {
  GET_ADDRESSES,
  GET_TEXT_RECORDS,
  GET_RESOLVER_FROM_SUBGRAPH
} from 'graphql/queries'

import AddRecord from './AddRecord'
import ContentHash from './ContentHash'
import TextRecord from './TextRecord'
import Coins from './Coins'
import DefaultSaveCancel from '../SaveCancel'
import RecordsCheck from './RecordsCheck'

const RecordsWrapper = styled('div')`
  border-radius: 6px;
  border: 1px solid #ededed;
  box-shadow: inset 0 0 10px 0 rgba(235, 235, 235, 0.5);
  display: ${p => (p.shouldShowRecords ? 'block' : 'none')};
  margin-bottom: 20px;
`

const CantEdit = styled('div')`
  padding: 20px;
  font-size: 14px;
  color: #adbbcd;
  background: hsla(37, 91%, 55%, 0.1);
`

const SaveCancel = styled(DefaultSaveCancel)``

const ConfirmBox = styled('div')`
  p {
    font-weight: 300;
    font-size: 14px;
  }
  padding: 20px;
  background: #f0f6fa;
  display: flex;
  justify-content: space-between;
`

const RECORDS = [
  {
    label: 'Addresses',
    value: 'coins'
  },
  {
    label: 'Content',
    value: 'content'
  },
  {
    label: 'Text',
    value: 'textRecords'
  }
]

function isEmpty(record) {
  if (parseInt(record, 16) === 0) {
    return true
  }
  if (record === '0x') {
    return true
  }
  if (!record) {
    return true
  }
  return false
}

function hasAnyRecord(domain) {
  if (!isEmpty(domain.addr)) {
    return true
  }

  if (!isEmpty(domain.content)) {
    return true
  }
}

function calculateShouldShowRecords(isOwner, hasResolver, hasRecords) {
  //do no show records if it only has a resolver if not owner
  if (!isOwner && hasRecords) {
    return true
  }
  //show records if it only has a resolver if owner so they can add
  if (isOwner && hasResolver) {
    return true
  }
  return false
}

function getChangedRecords(initialRecords, updatedRecords) {
  if (initialRecords.loading)
    return {
      textRecords: [],
      coins: []
    }

  const textRecords = differenceWith(
    updatedRecords.textRecords,
    initialRecords.textRecords,
    isEqual
  )
  const coins = differenceWith(
    updatedRecords.coins,
    initialRecords.coins,
    isEqual
  )

  const contentHash = !isEqual(
    updatedRecords.contentHash,
    initialRecords.contentHash
  )
    ? updatedRecords.contentHash
    : undefined

  return {
    textRecords,
    coins,
    ...(contentHash && { contentHash })
  }
}

function checkRecordsHaveChanged(changedRecords) {
  return (
    changedRecords.textRecords.length > 0 ||
    changedRecords.coins.length > 0 ||
    changedRecords.contenthash
  )
}

function checkRecordsAreValid(changedRecords) {
  const textRecordsValid = !(
    changedRecords.textRecords.filter(record => record.isValid === false)
      .length > 0
  )

  const coinsValid = !(
    changedRecords.coins.filter(record => record.isValid === false).length > 0
  )

  return textRecordsValid && coinsValid
}

// graphql data in resolver and records to check current records
// state in resolver and records to record new edit changes
// check old and new to see if any have changed
// abstract build tx data into function and use it here
//

export default function Records({
  domain,
  isOwner,
  refetch,
  account,
  hasResolver,
  isOldPublicResolver,
  isDeprecatedResolver,
  hasMigratedRecords,
  needsToBeMigrated
}) {
  const { t } = useTranslation()
  const [addMultiRecords] = useMutation(ADD_MULTI_RECORDS, {
    onCompleted: data => {
      startPending(Object.values(data)[0])
    }
  })
  const [updatedRecords, setUpdatedRecords] = useState({
    contentHash: undefined,
    coins: [],
    textRecords: []
  })
  const { actions, state } = useEditable()
  const { pending, confirmed, editing, txHash } = state

  const {
    startPending,
    setConfirmed,
    startEditing,
    stopEditing,
    resetPending
  } = actions

  //const [editMode, setEditMode] = useState(false)

  const { loading: addressesLoading, data: dataAddresses } = useQuery(
    GET_ADDRESSES,
    {
      variables: { name: domain.name, keys: COIN_LIST }
    }
  )

  const { data: dataTextRecordKeys } = useQuery(GET_RESOLVER_FROM_SUBGRAPH, {
    variables: {
      id: getNamehash(domain.name)
    }
  })

  //TEXT_RECORD_KEYS use for fallback

  const { loading: textRecordsLoading, data: dataTextRecords } = useQuery(
    GET_TEXT_RECORDS,
    {
      variables: {
        name: domain.name,
        keys:
          dataTextRecordKeys &&
          dataTextRecordKeys.domain &&
          dataTextRecordKeys.domain.resolver &&
          dataTextRecordKeys.domain.resolver.texts
      },
      skip: !dataTextRecordKeys
    }
  )

  const initialRecords = {
    textRecords: dataTextRecords && dataTextRecords.getTextRecords,
    coins: dataAddresses && dataAddresses.getAddresses,
    contentHash: domain.content?.startsWith('undefined') ? '' : domain.content,
    loading: textRecordsLoading || addressesLoading
  }

  useEffect(() => {
    if (textRecordsLoading === false && addressesLoading === false) {
      setUpdatedRecords(initialRecords)
    }
  }, [textRecordsLoading, addressesLoading, dataAddresses, dataTextRecords])

  const emptyRecords = RECORDS.filter(record => {
    if (record.value === 'address') {
      return isEmpty(domain['addr']) ? true : false
    }

    return isEmpty(domain[record.value]) ? true : false
  })

  const hasRecords = hasAnyRecord(domain)

  const changedRecords = getChangedRecords(initialRecords, updatedRecords)

  const shouldShowRecords = calculateShouldShowRecords(
    isOwner,
    hasResolver,
    hasRecords
  )
  const canEditRecords =
    !isOldPublicResolver && !isDeprecatedResolver && isOwner

  if (!shouldShowRecords) {
    return null
  }

  const haveRecordsChanged = checkRecordsHaveChanged(changedRecords)
  const areRecordsValid = checkRecordsAreValid(changedRecords)

  return (
    <RecordsWrapper
      shouldShowRecords={shouldShowRecords}
      needsToBeMigrated={needsToBeMigrated}
    >
      {!canEditRecords && isOwner ? (
        <CantEdit>{t('singleName.record.cantEdit')}</CantEdit>
      ) : (
        <AddRecord
          domain={domain}
          canEdit={canEditRecords}
          editing={editing}
          startEditing={startEditing}
          stopEditing={stopEditing}
          initialRecords={initialRecords}
          updatedRecords={updatedRecords}
          setUpdatedRecords={setUpdatedRecords}
          emptyRecords={emptyRecords}
        />
      )}
      <Coins
        canEdit={canEditRecords}
        editing={editing}
        domain={domain}
        addresses={updatedRecords.coins}
        loading={addressesLoading}
        title={t('c.addresses')}
        updatedRecords={updatedRecords}
        setUpdatedRecords={setUpdatedRecords}
        changedRecords={changedRecords}
      />
      <ContentHash
        canEdit={canEditRecords}
        editing={editing}
        domain={domain}
        keyName="Content"
        type="content"
        value={domain.content.startsWith('undefined') ? '' : domain.content}
        refetch={refetch}
        updatedRecords={updatedRecords}
        setUpdatedRecords={setUpdatedRecords}
        changedRecords={changedRecords}
      />
      <TextRecord
        canEdit={canEditRecords}
        editing={editing}
        domain={domain}
        textRecords={dataTextRecords && dataTextRecords.getTextRecords}
        loading={textRecordsLoading}
        title={t('c.textrecord')}
        updatedRecords={updatedRecords}
        setUpdatedRecords={setUpdatedRecords}
        changedRecords={changedRecords}
      />
      {pending && !confirmed && txHash && (
        <ConfirmBox pending={pending}>
          <PendingTx
            txHash={txHash}
            onConfirmed={() => {
              setConfirmed()
              resetPending()
            }}
          />
        </ConfirmBox>
      )}
      {editing && !txHash && (
        <ConfirmBox>
          <p>
            Add, delete, or edit one or multiple records. Confirm in one
            transaction.
          </p>
          <SaveCancel
            mutation={() => {
              addMultiRecords({
                variables: { name: domain.name, records: changedRecords }
              })
            }}
            mutationButton="Confirm"
            stopEditing={stopEditing}
            disabled={false}
            confirm={true}
            extraDataComponent={
              <RecordsCheck changedRecords={changedRecords} />
            }
            isValid={haveRecordsChanged && areRecordsValid}
          />
        </ConfirmBox>
      )}
    </RecordsWrapper>
  )
}
