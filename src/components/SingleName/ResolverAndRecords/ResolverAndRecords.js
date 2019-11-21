import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useQuery } from 'react-apollo'

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

import DetailsItemEditable from '../DetailsItemEditable'
import AddRecord from './AddRecord'
import RecordsItem from './RecordsItem'
import TextRecord from './TextRecord'
import Address from './Address'

const RecordsWrapper = styled('div')`
  border-radius: 6px;
  border: 1px solid #ededed;
  box-shadow: inset 0 0 10px 0 rgba(235, 235, 235, 0.5);
  padding-bottom: ${p => (p.shouldShowRecords ? '10px' : '0')};
  display: ${p => (p.shouldShowRecords ? 'block' : 'none')};
  margin-bottom: 20px;
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

function hasAResolver(resolver) {
  return parseInt(resolver, 16) !== 0
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

function calculateCanEditRecords(domain) {
  /* If it is not old resolver, can edit */
  if (!domain.isOldPublicResolver) {
    return true
  }
  /* Otherwise is an oldPublicResolver so don't let edits*/
  return false
}

function Records({ domain, isOwner, refetch, account }) {
  const [recordAdded, setRecordAdded] = useState(0)
  const { data, loading: loadingResolverMigration, error } = useQuery(
    GET_RESOLVER_MIGRATION_INFO,
    {
      variables: {
        name: domain.name,
        resolver: domain.resolver
      }
    }
  )
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

  const hasResolver = hasAResolver(domain.resolver)
  const hasRecords = hasAnyRecord(domain)
  const shouldShowRecords = calculateShouldShowRecords(
    isOwner,
    hasResolver,
    hasRecords
  )
  const canEditRecords = calculateCanEditRecords(domain)

  if (!shouldShowRecords) {
    return null
  }

  return (
    <RecordsWrapper shouldShowRecords={shouldShowRecords}>
      <AddRecord
        emptyRecords={emptyRecords}
        title="Records"
        isOwner={isOwner}
        domain={domain}
        refetch={refetch}
        setRecordAdded={setRecordAdded}
      />
      {hasResolver && hasAnyRecord && (
        <>
          {!isEmpty(domain.addr) && (
            <RecordsItem
              canEdit={canEditRecords}
              domain={domain}
              isOwner={isOwner}
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
              isOwner={isOwner}
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
            isOwner={isOwner}
            recordAdded={recordAdded}
            mutation={SET_ADDR}
            query={GET_ADDR}
            title="Other Addresses"
          />
          <TextRecord
            canEdit={canEditRecords}
            domain={domain}
            isOwner={isOwner}
            recordAdded={recordAdded}
            mutation={SET_TEXT}
            query={GET_TEXT}
            title="Text Record"
          />
        </>
      )}
    </RecordsWrapper>
  )
}

export default function ResolverAndRecords({
  domain,
  isOwner,
  refetch,
  account
}) {
  return (
    <>
      <DetailsItemEditable
        keyName="Resolver"
        type="address"
        value={domain.resolver}
        canEdit={isOwner}
        domain={domain}
        editButton="Set"
        mutationButton="Save"
        mutation={SET_RESOLVER}
        refetch={refetch}
        account={account}
      />
      <Records domain={domain} isOwner={isOwner} />
    </>
  )
}
