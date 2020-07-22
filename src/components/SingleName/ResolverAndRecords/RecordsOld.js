import React, { useState } from 'react'
import styled from '@emotion/styled/macro'
import { useQuery } from 'react-apollo'
import { useTranslation } from 'react-i18next'

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
  GET_RESOLVER_MIGRATION_INFO
} from 'graphql/queries'

import AddRecord from './AddRecordOld'
import RecordsItem from './RecordsItem'
import TextRecord from './TextRecordOld'
import Address from './AddressOld'

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
  const [recordAdded, setRecordAdded] = useState(0)

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
          emptyRecords={emptyRecords}
          title="Records"
          canEdit={canEditRecords}
          domain={domain}
          refetch={refetch}
          setRecordAdded={setRecordAdded}
        />
      )}
      {hasResolver && hasAnyRecord && (
        <>
          {!isEmpty(domain.addr) && (
            <RecordsItem
              canEdit={canEditRecords}
              domain={domain}
              keyName="Address"
              value={domain.addr}
              mutation={SET_ADDRESS}
              type="address"
              refetch={refetch}
              account={account}
            />
          )}
          {!isEmpty(domain.content) && (
            <RecordsItem
              canEdit={canEditRecords}
              domain={domain}
              keyName="Content"
              type="content"
              mutation={contentMutation}
              value={domain.content}
              refetch={refetch}
            />
          )}
          <Address
            canEdit={canEditRecords}
            domain={domain}
            recordAdded={recordAdded}
            mutation={SET_ADDR}
            query={GET_ADDR}
            title={t('c.otheraddresses')}
          />
          <TextRecord
            canEdit={canEditRecords}
            domain={domain}
            recordAdded={recordAdded}
            mutation={SET_TEXT}
            query={GET_TEXT}
            title={t('c.textrecord')}
          />
        </>
      )}
    </RecordsWrapper>
  )
}
