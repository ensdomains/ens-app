import React from 'react'
import { useMutation } from 'react-apollo'
import { MIGRATE_REGISTRY } from 'graphql/mutations'
import styled from '@emotion/styled'
import PendingTx from '../PendingTx'
import { ExternalButtonLink } from '../Forms/Button'

import { useEditable } from '../hooks'

const WarningBox = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 100;
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

export default function MigrationWarning({
  domain,
  account,
  refetchIsMigrated
}) {
  const { state, actions } = useEditable()
  const { txHash, pending, confirmed } = state
  const { startPending, setConfirmed } = actions
  // const { data, loading } = useQuery(CAN_WRITE, { variables: { account } })
  const [migrateRegistry] = useMutation(MIGRATE_REGISTRY, {
    variables: { name: domain.name, address: domain.owner },
    onCompleted: data => {
      startPending(Object.values(data)[0])
    }
  })
  const canMigrate = account === domain.parentOwner
  return (
    <WarningBox>
      <WarningContent>
        This name needs to be migrated to the new Registry. Only the parent of
        this name ({domain.parent}) can do this.
        <SubWarning>
          *If you trade ENS names, do not accept this name!
        </SubWarning>
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
          Migrate
        </Migrate>
      )}
    </WarningBox>
  )
}
