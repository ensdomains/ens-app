import React from 'react'
import styled from '@emotion/styled/macro'
import { useQuery } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import Records from './Records'

import { GET_RESOLVER_MIGRATION_INFO, GET_TEXT } from 'graphql/queries'
import { SET_RESOLVER } from 'graphql/mutations'
import ArtRecords from './ArtRecords'

import ResolverMigration from './ResolverMigration'
import DetailsItemEditable from '../DetailsItemEditable'

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

function hasAResolver(resolver) {
  return parseInt(resolver, 16) !== 0
}

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
            editButton={t('c.set')}
            mutationButton={t('c.save')}
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

      {hasResolver && Object.values(domain).filter(x => x).length && (
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
