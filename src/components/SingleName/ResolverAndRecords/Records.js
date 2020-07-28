import React, { useState, useReducer, useEffect } from 'react'
import styled from '@emotion/styled/macro'
import { useQuery } from 'react-apollo'
import { useTranslation } from 'react-i18next'
import COIN_LIST from 'constants/coinList'
import TEXT_RECORD_KEYS from 'constants/textRecords'
import { getNamehash } from '@ensdomains/ui'

import {
  SET_RESOLVER,
  SET_ADDRESS,
  SET_CONTENT,
  SET_CONTENTHASH,
  SET_TEXT,
  SET_ADDR
} from 'graphql/mutations'

import {
  GET_TEXT,
  GET_ADDR,
  GET_ADDRESSES,
  GET_TEXT_RECORDS,
  GET_RESOLVER_MIGRATION_INFO,
  GET_RESOLVER_FROM_SUBGRAPH
} from 'graphql/queries'

import AddRecord from './AddRecord'
import ContentHash from './ContentHash'
import TextRecord from './TextRecord'
import Coins from './Coins'

const RecordsWrapper = styled('div')`
  border-radius: 6px;
  border: 1px solid #ededed;
  box-shadow: inset 0 0 10px 0 rgba(235, 235, 235, 0.5);
  padding-bottom: ${p => (p.shouldShowRecords ? '10px' : '0')};
  display: ${p => (p.shouldShowRecords ? 'block' : 'none')};
  margin-bottom: 20px;
`

const CantEdit = styled('div')`
  padding: 20px;
  font-size: 14px;
  color: #adbbcd;
  background: hsla(37, 91%, 55%, 0.1);
`

const EditModeButton = styled('div')`
  color: ${p => (p.canEdit ? '#5284FF' : '#ccc')};
`

const RECORDS = [
  {
    label: 'Address',
    value: 'address'
  },
  {
    label: 'Other addresses',
    value: 'otherAddresses'
  },
  {
    label: 'Content',
    value: 'content'
  },
  {
    label: 'Text',
    value: 'text'
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

function reducer(state, action) {
  switch (action.type) {
    case 'EDIT_RECORD':
      return {
        ...state,
        [action.record.name]: action.record
      }
    case 'ADD_RECORD':
      return {
        ...state,
        [action.record.name]: action.record
      }
  }
}

function useCoins() {}

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
  const [state, dispatch] = useReducer(reducer, {})
  const [updatedRecords, setUpdatedRecords] = useState({
    contentHash: undefined,
    coins: [],
    textRecords: []
  })
  const [editMode, setEditMode] = useState(false)
  const { loading: addressesLoading, data: dataAddresses } = useQuery(
    GET_ADDRESSES,
    {
      variables: { name: domain.name, keys: COIN_LIST }
    }
  )

  const { data: dataTextRecordKeys, loading, error } = useQuery(
    GET_RESOLVER_FROM_SUBGRAPH,
    {
      variables: {
        id: getNamehash(domain.name)
      }
    }
  )
  //TEXT_RECORD_KEYS use for fallback

  const { loading: textRecordsLoading, data: dataTextRecords } = useQuery(
    GET_TEXT_RECORDS,
    {
      variables: {
        name: domain.name,
        keys:
          dataTextRecordKeys &&
          dataTextRecordKeys.domain &&
          dataTextRecordKeys.domain.resolver.texts
      },
      skip: !dataTextRecordKeys
    }
  )

  const initialRecords = {
    textRecords: dataTextRecords && dataTextRecords.getTextRecords,
    coins: dataAddresses && dataAddresses.getAddresses,
    contentHash: domain.content
  }

  useEffect(() => {
    if (textRecordsLoading === false && addressesLoading === false) {
      setUpdatedRecords(initialRecords)
    }
  }, [textRecordsLoading, addressesLoading, dataAddresses, dataTextRecords])

  console.log({ initialRecords, updatedRecords })

  const emptyRecords = RECORDS.filter(record => {
    if (record.value === 'address') {
      return isEmpty(domain['addr']) ? true : false
    }

    return isEmpty(domain[record.value]) ? true : false
  })

  let contentMutation
  if (domain.contentType === 'oldcontent') {
    contentMutation = SET_CONTENT
  } else {
    contentMutation = SET_CONTENTHASH
  }

  const hasRecords = hasAnyRecord(domain)
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
          editMode={editMode}
          setEditMode={setEditMode}
          initialRecords={initialRecords}
          updatedRecords={updatedRecords}
        />
      )}

      <Coins
        canEdit={canEditRecords}
        editing={editMode}
        domain={domain}
        mutation={SET_ADDR}
        addresses={dataAddresses.getAddresses}
        loading={addressesLoading}
        title={t('c.addresses')}
        updatedRecords={updatedRecords}
        setUpdatedRecords={setUpdatedRecords}
      />
      {!isEmpty(domain.content) && (
        <ContentHash
          canEdit={canEditRecords}
          editng={editMode}
          domain={domain}
          keyName="Content"
          type="content"
          mutation={contentMutation}
          value={domain.content}
          refetch={refetch}
        />
      )}
      <TextRecord
        canEdit={canEditRecords}
        editing={editMode}
        domain={domain}
        mutation={SET_TEXT}
        textRecords={dataTextRecords && dataTextRecords.getTextRecords}
        loading={textRecordsLoading}
        title={t('c.textrecord')}
        updatedRecords={updatedRecords}
        setUpdatedRecords={setUpdatedRecords}
      />
    </RecordsWrapper>
  )
}
