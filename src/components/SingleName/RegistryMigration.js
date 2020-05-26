import React from 'react'
import { useMutation, useQuery } from 'react-apollo'
import { useTranslation, Trans } from 'react-i18next'

import { MIGRATE_REGISTRY } from 'graphql/mutations'
import { IS_CONTRACT_CONTROLLER } from 'graphql/queries'
import styled from '@emotion/styled/macro'
import PendingTx from '../PendingTx'
import { ExternalButtonLink } from '../Forms/Button'

import { useEditable } from '../hooks'

const WarningBox = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  // font-weight: 100;
  color: #2b2b2b;
  padding: 20px 35px;
  background: hsla(37, 91%, 55%, 0.1);
  margin-bottom: 20px;
`

const WarningContent = styled('div')`
  width: calc(100% - 120px);
  padding-right: 20px;
`

const SubWarning = styled('p')`
  font-size: 14px;
  color: #2b2b2b;
  font-weight: 500;
`

const Migrate = styled(ExternalButtonLink)`
  flex: 2 1 auto;
`

export default function RegistryMigration({
  domain,
  account,
  dnssecmode,
  refetchIsMigrated,
  isParentMigratedToNewRegistry,
  loadingIsParentMigrated
}) {
  const { t } = useTranslation()
  const { state, actions } = useEditable()
  const { txHash, pending, confirmed } = state
  const { startPending, setConfirmed } = actions
  const {
    data: { isContractController },
    loading: loadingIsContractController
  } = useQuery(IS_CONTRACT_CONTROLLER, {
    variables: { address: domain.owner }
  })
  const [migrateRegistry] = useMutation(MIGRATE_REGISTRY, {
    variables: { name: domain.name, address: domain.owner },
    onCompleted: data => {
      startPending(Object.values(data)[0])
    }
  })

  const loading = loadingIsParentMigrated || loadingIsContractController
  const canMigrate =
    !loading &&
    isParentMigratedToNewRegistry &&
    account === domain.parentOwner &&
    !isContractController

  const isContractControllerMessage = t('registrymigration.messages.controller')
  const defaultMessage = (
    <Trans
      i18nKey="registrymigration.messages.default"
      values={{ parent: domain.parent }}
    />
  )
  const migrateParentFirstMessage = (
    <Trans
      i18nKey="registrymigration.messages.parentmigrate"
      values={{ parent: domain.parent }}
    />
  )
  const dnssecMigrateMessage = t('registrymigration.messages.dnssec')
  return (
    <WarningBox>
      <WarningContent>
        {isContractController
          ? isContractControllerMessage
          : !isParentMigratedToNewRegistry
          ? migrateParentFirstMessage
          : dnssecmode
          ? dnssecMigrateMessage
          : defaultMessage}
        {domain.parent !== 'eth' && !dnssecmode && (
          <SubWarning>{t('registrymigration.donotaccept')}</SubWarning>
        )}
      </WarningContent>
      {pending && !confirmed && txHash ? (
        <PendingTx
          txHash={txHash}
          onConfirmed={() => {
            setConfirmed()
            refetchIsMigrated()
          }}
        />
      ) : (
        <Migrate
          onClick={canMigrate ? migrateRegistry : () => {}}
          type={canMigrate ? 'hollow-primary' : 'hollow-primary-disabled'}
          href="#"
        >
          {t('c.migrate')}
        </Migrate>
      )}
    </WarningBox>
  )
}
