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

import DetailsItemEditable from '../DetailsItemEditable'
import AddRecord from './AddRecord'
import RecordsItem from './RecordsItem'
import TextRecord from './TextRecord'
import Address from './Address'
import ResolverMigration from './ResolverMigration'
import ArtRecords from './ArtRecords'

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

function hasAResolver(resolver) {
  return parseInt(resolver, 16) !== 0
}

function calculateShouldShowRecords(isOwner, hasResolver) {
  if (!isOwner) {
    return true
  }
  //show records if it only has a resolver if owner so they can add
  if (isOwner && hasResolver) {
    return true
  }
  return false
}

function Records({
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

  const shouldShowRecords = calculateShouldShowRecords(isOwner, hasResolver)
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
      {hasResolver && (
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

const MigrationWarningContainer = styled('div')`
  margin-bottom: 20px;
`

function MigrationWarning() {
  const { t } = useTranslation()
  return (
    <MigrationWarningContainer>
      {t('singleName.resolver.warning')}
    </MigrationWarningContainer>
  )
}

const ManualMigrationMessage = styled('div')`
  margin-bottom: 20px;
`

const ManualMigration = styled('div')`
  border-top: 1px dashed #d3d3d3;
  padding-top: 20px;
`

const ResolverWrapper = styled('div')`
  ${p =>
    p.needsToBeMigrated
      ? `
    color: #ADBBCD;
    font-size: 14px;
    background: hsla(37, 91%, 55%, 0.1);
    padding: 20px;
    margin-bottom: 20px;
  `
      : 'background: none;'}
`

export default function ResolverAndRecords({
  domain,
  isOwner,
  refetch,
  account,
  isMigratedToNewRegistry
}) {
  const { t } = useTranslation()
  const hasResolver = hasAResolver(domain.resolver)
  let isOldPublicResolver = false
  let isDeprecatedResolver = false
  let areRecordsMigrated = true
  let isPublicResolverReady = false

  const { data, loading } = useQuery(GET_RESOLVER_MIGRATION_INFO, {
    variables: {
      name: domain.name,
      resolver: domain.resolver
    },
    skip: !hasResolver
  })

  if (data && data.getResolverMigrationInfo) {
    isOldPublicResolver = data.getResolverMigrationInfo.isOldPublicResolver
    isDeprecatedResolver = data.getResolverMigrationInfo.isDeprecatedResolver
    areRecordsMigrated = data.getResolverMigrationInfo.areRecordsMigrated
    isPublicResolverReady = data.getResolverMigrationInfo.isPublicResolverReady
  }

  const needsToBeMigrated =
    !loading &&
    isMigratedToNewRegistry &&
    isPublicResolverReady &&
    (isOldPublicResolver || isDeprecatedResolver)
  return (
    <>
      <ResolverWrapper needsToBeMigrated={needsToBeMigrated}>
        {needsToBeMigrated ? (
          <>
            <ResolverMigration
              value={domain.resolver}
              name={domain.name}
              refetch={refetch}
              isOwner={isOwner}
            />
          </>
        ) : (
          <DetailsItemEditable
            keyName="Resolver"
            type="address"
            value={domain.resolver}
            canEdit={isOwner && isMigratedToNewRegistry}
            domain={domain}
            editButton={t(`c.set`)}
            mutationButton={t(`c.save`)}
            mutation={SET_RESOLVER}
            refetch={refetch}
            account={account}
            needsToBeMigrated={needsToBeMigrated}
            copyToClipboard={true}
          />
        )}
        {needsToBeMigrated && (
          <>
            <MigrationWarning />
            <ManualMigration>
              <ManualMigrationMessage>
                {t('singleName.resolver.message')}
              </ManualMigrationMessage>
              <DetailsItemEditable
                showLabel={false}
                keyName="Resolver"
                type="address"
                value={domain.resolver}
                canEdit={isOwner && isMigratedToNewRegistry}
                domain={domain}
                editButton={t('c.set')}
                editButtonType="hollow-primary"
                mutationButton={t('c.save')}
                backgroundStyle="warning"
                mutation={SET_RESOLVER}
                refetch={refetch}
                account={account}
                needsToBeMigrated={needsToBeMigrated}
              />
            </ManualMigration>
          </>
        )}
      </ResolverWrapper>

      {hasResolver && (
        <Records
          domain={domain}
          refetch={refetch}
          account={account}
          isOwner={isOwner}
          hasResolver={hasResolver}
          needsToBeMigrated={needsToBeMigrated}
          isOldPublicResolver={isOldPublicResolver}
          isDeprecatedResolver={isDeprecatedResolver}
          areRecordsMigrated={areRecordsMigrated}
        />
      )}

      {hasResolver && <ArtRecords domain={domain} query={GET_TEXT} />}
    </>
  )
}
