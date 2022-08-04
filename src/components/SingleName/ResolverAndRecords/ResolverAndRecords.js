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
import mq from 'mediaQuery'
import RotatingSmallCaret from 'components/Icons/RotatingSmallCaret'

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
      : `
      background: none;
      padding: 20px;
      `}
`

const ResolverDropdown = styled.div`
  border-radius: 6px;
  display: flex;
  flex-direction: column;

  & > div:last-child {
    border-top: 1px dashed #d3d3d3;
    padding: 0;
    padding-top: 32px;
  }
`

const AdvancedButton = styled.button`
  border: none;
  background: none;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 12px 0;
  align-self: flex-start;

  cursor: pointer;

  transition: 0.15s filter ease-in-out;
  filter: opacity(1);

  &:hover {
    filter: opacity(0.5);
  }

  p {
    font-family: Overpass;
    font-size: 14px;
    letter-spacing: 0px;
    font-weight: 600;
    text-transform: uppercase;
    flex-shrink: 0;
    display: flex;
    margin: 0;

    ${mq.small`
      align-items: center;
      margin-bottom: 0;
      font-size: 16px;
    `}
  }
`

function hasAResolver(resolver) {
  const addrNumber = parseInt(resolver, 16)
  return !isNaN(addrNumber) && addrNumber !== 0
}

export default function ResolverAndRecords({
  domain,
  isOwner,
  refetch,
  account,
  isMigratedToNewRegistry,
  readOnly = false
}) {
  const { t } = useTranslation()
  const [showingAdvanced, setShowingAdvanced] = React.useState(false)

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
      {needsToBeMigrated && (
        <ResolverWrapper needsToBeMigrated>
          <ResolverMigration
            value={domain.resolver}
            name={domain.name}
            refetch={refetch}
            isOwner={isOwner}
            readOnly={readOnly}
          />
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
              canEdit={isOwner && isMigratedToNewRegistry && !readOnly}
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
        </ResolverWrapper>
      )}

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
          readOnly={readOnly}
        />
      )}

      {!needsToBeMigrated && (
        <ResolverDropdown>
          <AdvancedButton
            data-testid="advanced-settings-button"
            onClick={() => setShowingAdvanced(prev => !prev)}
          >
            <p>{t('singleName.tabs.advancedSettings')}</p>
            <RotatingSmallCaret rotated={showingAdvanced} start="top" />
          </AdvancedButton>
          {showingAdvanced && (
            <ResolverWrapper>
              <DetailsItemEditable
                keyName="Resolver"
                type="address"
                value={domain.resolver}
                canEdit={isOwner && isMigratedToNewRegistry && !readOnly}
                domain={domain}
                editButton={t('c.set')}
                mutationButton={t('c.save')}
                mutation={SET_RESOLVER}
                refetch={refetch}
                account={account}
                needsToBeMigrated={needsToBeMigrated}
                copyToClipboard={true}
              />
            </ResolverWrapper>
          )}
        </ResolverDropdown>
      )}

      {hasResolver && <ArtRecords domain={domain} query={GET_TEXT} />}
    </>
  )
}
